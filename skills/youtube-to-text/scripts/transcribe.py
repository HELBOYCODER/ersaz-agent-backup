#!/usr/bin/env python3
"""
youtube-to-text — download a YouTube video's audio and transcribe it to clean text.

Pipeline:
  1. yt-dlp downloads the best audio track (or accepts a local media file).
  2. ffmpeg converts it to 16 kHz mono WAV (what Whisper expects).
  3. Transcribe with the chosen ENGINE:
       --engine local       (default) faster-whisper, runs on-device, free/offline:
                              --lang he -> ivrit.ai Hebrew finetune (SOTA for Hebrew)
                              --lang en -> standard Whisper large-v3
                              --accurate -> swap the Hebrew turbo model for the full v3
       --engine elevenlabs  ElevenLabs Scribe v2 cloud API — highest Hebrew accuracy,
                              built-in diarization. Costs money; sends audio to ElevenLabs.
  4. Writes a clean, paragraph-segmented .txt (and optionally .srt) next to --out.

Run via the venv built by setup.sh:
    ~/.claude/skills/youtube-to-text/.venv/bin/python transcribe.py <url-or-file> ...

It deliberately does NOT summarize or proofread — those steps are done by Claude reading the
.txt (see SKILL.md).
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import namedtuple
from pathlib import Path

# Local-engine model selection. ivrit.ai models are Hebrew-only by design (language detection
# was intentionally degraded during finetuning), so English uses the vanilla Whisper.
MODELS = {
    ("he", False): "ivrit-ai/whisper-large-v3-turbo-ct2",  # default Hebrew: fast on CPU
    ("he", True): "ivrit-ai/whisper-large-v3-ct2",          # --accurate Hebrew: full v3
    ("en", False): "large-v3-turbo",                         # default English
    ("en", True): "large-v3",                                # --accurate English
}

# whisper.cpp (Minis/Alpine fallback when faster-whisper is unavailable).
SKILL_DIR = Path(__file__).resolve().parent.parent
GGML_MODELS = {
    "he": SKILL_DIR / "models" / "ggml-he-large-v3-turbo.bin",   # ivrit.ai finetune
    "en": SKILL_DIR / "models" / "ggml-he-large-v3-turbo.bin",   # same multilingual turbo
}

def _find_whisper_cli() -> str | None:
    cands = [os.environ.get("WHISPER_CPP_CLI")] + [
        str(SKILL_DIR / "bin" / "whisper-cli"),
        "/tmp/whisper.cpp/build/bin/whisper-cli",
    ]
    for c in cands:
        if c and os.path.exists(c):
            return c
    return shutil.which("whisper-cli")

# ElevenLabs API key lookup (in order: env var, macOS Keychain, skill-dir .env file).
KEYCHAIN_SERVICE = "ELEVENLABS_API_KEY"
KEYCHAIN_ACCOUNT = "youtube-to-text"

Seg = namedtuple("Seg", ["start", "end", "text"])


def log(msg: str) -> None:
    print(f"[youtube-to-text] {msg}", file=sys.stderr, flush=True)


def require(tool: str) -> None:
    if shutil.which(tool) is None:
        log(f"ERROR: '{tool}' not found on PATH. Run scripts/setup.sh first.")
        sys.exit(2)


def is_url(s: str) -> bool:
    return s.startswith("http://") or s.startswith("https://")


def safe_stem(name: str) -> str:
    """Filesystem-safe stem, keeping Hebrew/Unicode letters but dropping path-hostile chars."""
    name = re.sub(r"[\\/:*?\"<>|]+", "_", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name[:120] or "transcript"


def fetch_title(url: str) -> str:
    try:
        out = subprocess.run(
            ["yt-dlp", "--no-warnings", "--print", "%(title)s", "--skip-download", url],
            capture_output=True, text=True, timeout=120,
        )
        title = out.stdout.strip().splitlines()[0] if out.stdout.strip() else ""
        return safe_stem(title) if title else ""
    except Exception:
        return ""


def download_audio(url: str, workdir: Path) -> Path:
    """Download bestaudio with yt-dlp into workdir, return the downloaded file path."""
    require("yt-dlp")
    out_tmpl = str(workdir / "audio.%(ext)s")
    log(f"Downloading audio: {url}")
    subprocess.run(
        ["yt-dlp", "-f", "bestaudio/best", "--no-playlist",
         "--no-warnings", "-o", out_tmpl, url],
        check=True,
    )
    files = [p for p in workdir.iterdir() if p.stem == "audio"]
    if not files:
        log("ERROR: yt-dlp produced no audio file.")
        sys.exit(1)
    return files[0]


def to_wav(src: Path, workdir: Path) -> Path:
    """Convert any media file to 16 kHz mono WAV via ffmpeg."""
    require("ffmpeg")
    wav = workdir / "audio16k.wav"
    log("Converting to 16 kHz mono WAV")
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-ac", "1", "-ar", "16000",
         "-vn", str(wav)],
        check=True,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    return wav


# --------------------------------------------------------------------------- engines

def transcribe_local(wav: Path, lang: str, accurate: bool, model_override: str | None):
    """Local engine. Prefers faster-whisper; falls back to a whisper.cpp CLI build."""
    try:
        from faster_whisper import WhisperModel  # imported here so --help works without it
    except Exception:
        return transcribe_whisper_cpp(wav, lang, accurate, model_override)

    model_id = model_override or MODELS.get((lang, accurate)) or \
        ("ivrit-ai/whisper-large-v3-turbo-ct2" if lang == "he" else "large-v3-turbo")
    log(f"Loading model: {model_id}  (first run downloads it from HuggingFace)")
    # int8 keeps the turbo model fast and light on Apple Silicon CPU.
    model = WhisperModel(model_id, device="cpu", compute_type="int8")
    log(f"Transcribing locally (lang={lang})…")
    segments, _info = model.transcribe(str(wav), language=lang, vad_filter=True, beam_size=5)
    segs = [Seg(s.start, s.end, s.text.strip()) for s in segments if s.text.strip()]
    return segs, None


def _parse_hms(ts: str) -> float:
    """'00:01:23,456' or '0:01:23.456' -> seconds."""
    ts = ts.replace(",", ".")
    parts = ts.split(":")
    while len(parts) < 3:
        parts.insert(0, "0")
    h, m, s = parts
    return int(h) * 3600 + int(m) * 60 + float(s)


def transcribe_whisper_cpp(wav: Path, lang: str, accurate: bool, model_override: str | None):
    """whisper.cpp fallback. Returns (segments, None)."""
    cli = _find_whisper_cli()
    if not cli:
        log("ERROR: local engine unavailable — faster-whisper not installed and whisper-cli "
            "not found. Run scripts/setup.sh first.")
        sys.exit(2)

    if model_override and os.path.exists(model_override):
        gm = Path(model_override)
    else:
        gm = GGML_MODELS.get(lang) or GGML_MODELS["en"]
        if not gm.exists():  # fall back to any downloaded ggml model
            bins = sorted((SKILL_DIR / "models").glob("*.bin")) if (SKILL_DIR / "models").exists() else []
            if not bins:
                log(f"ERROR: no GGML model found in {SKILL_DIR / 'models'}. "
                    "Run scripts/setup.sh to download one.")
                sys.exit(2)
            gm = bins[0]
    log(f"whisper.cpp model: {gm.name}")

    json_base = wav.parent / "wcpp"
    n_threads = min(os.cpu_count() or 4, 8)
    cmd = [cli, "-m", str(gm), "-f", str(wav), "-l", lang,
           "-oj", "-of", str(json_base), "-t", str(n_threads)]
    log(f"Transcribing locally with whisper.cpp ({n_threads} threads)…")
    subprocess.run(cmd, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    jpath = Path(str(json_base) + ".json")
    segs: list[Seg] = []
    if jpath.exists():
        import json as _json
        data = _json.loads(jpath.read_text(encoding="utf-8"))
        for s in data.get("transcription", []):
            text = s.get("text", "").strip()
            t = s.get("timestamps", {})
            if text:
                segs.append(Seg(_parse_hms(t.get("from", "00:00:00,000")),
                                _parse_hms(t.get("to", "00:00:00,000")), text))
    else:  # extremely unlikely; plain txt fallback without timestamps
        txt_path = Path(str(json_base) + ".txt")
        text = txt_path.read_text(encoding="utf-8") if txt_path.exists() else ""
        segs = [Seg(0.0, 0.0, p.strip()) for p in re.split(r"\n+", text) if p.strip()]
    return [s for s in segs if s.text], None


# ------------------------------------------------------------------ subtitles engine (free)

def download_subtitles(url: str, lang: str, workdir: Path):
    """Fetch manual, then auto-generated YouTube subtitles via yt-dlp. Returns .vtt path or None."""
    require("yt-dlp")
    base = workdir / "subs"
    attempts = [["--write-subs"], ["--write-subs", "--write-auto-subs"]]
    for extra in attempts:
        subprocess.run(
            ["yt-dlp", "--skip-download", "--no-warnings", "--no-playlist",
             "--sub-langs", f"{lang}.*,^{lang}", "-o", str(base), *extra, url],
            capture_output=True,
        )
        vtts = list(workdir.glob("*.vtt"))
        # prefer non-auto (manual) subs: retry order handles that automatically
        if vtts:
            return vtts[0]
    return None


def parse_vtt(path: Path) -> list[Seg]:
    """Flatten a WebVTT file into clean Seg lines (dedupes rolling auto-caption repeats)."""
    import html
    raw = path.read_text(encoding="utf-8", errors="replace")
    cue_re = re.compile(r"(\d+:)?\d+:\d+[.,]\d+\s*-->\s*(\d+:)?\d+:\d+[.,]\d+")
    tag_re = re.compile(r"<[^>]+>")
    seen_lines: set[str] = set()
    ordered: list[str] = []
    start = end = 0.0
    last_start = last_end = 0.0
    pending_start = None
    for block in re.split(r"\n\s*\n", raw):
        m = re.search(r"(\d+:)?(\d+):(\d+)[.,](\d+)\s*-->\s*(\d+:)?(\d+):(\d+)[.,](\d+)", block)
        if m:
            g = ["0" if x is None else x for x in m.groups()]
            last_start = int(g[0]) * 3600 + int(g[1]) * 60 + int(g[2]) + int(g[3]) / 1000
            last_end = int(g[4]) * 3600 + int(g[5]) * 60 + int(g[6]) + int(g[7]) / 1000
        for line in block.splitlines():
            line = line.strip()
            if not line or cue_re.search(line) or line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")) \
               or line.isdigit():
                continue
            clean = html.unescape(tag_re.sub("", line)).strip()
            if clean and clean not in seen_lines:
                seen_lines.add(clean)
                if pending_start is None:
                    pending_start = last_start
                ordered.append(clean)
    text = " ".join(ordered)
    return [Seg(pending_start or 0.0, last_end or 0.0, text)] if text else []


def get_elevenlabs_key() -> str | None:
    """Look up the ElevenLabs API key: env var -> macOS Keychain -> skill-dir .env."""
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k and k.strip():
        return k.strip()
    try:  # macOS Keychain
        out = subprocess.run(
            ["security", "find-generic-password", "-s", KEYCHAIN_SERVICE,
             "-a", KEYCHAIN_ACCOUNT, "-w"],
            capture_output=True, text=True,
        )
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    envf = Path(__file__).resolve().parent.parent / ".env"  # ~/.claude/skills/youtube-to-text/.env
    if envf.exists():
        for line in envf.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("ELEVENLABS_API_KEY") and "=" in line:
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def group_words(words, max_gap: float = 0.8, max_chars: int = 90):
    """Group ElevenLabs word objects into sentence/gap-bounded Seg lines."""
    segs, cur, start, prev_end = [], [], None, None
    for w in words:
        t = (w.get("text") or "").strip()
        if not t:
            continue
        if start is None:
            start = w["start"]
        too_long = sum(len(x) + 1 for x in cur) > max_chars
        big_gap = prev_end is not None and (w["start"] - prev_end) > max_gap
        ends_sentence = cur and cur[-1].endswith((".", "!", "?", "…", ":"))
        if cur and (big_gap or too_long or ends_sentence):
            segs.append(Seg(start, prev_end, " ".join(cur)))
            cur, start = [], w["start"]
        cur.append(t)
        prev_end = w["end"]
    if cur:
        segs.append(Seg(start, prev_end, " ".join(cur)))
    return segs


def format_diarized(words) -> str:
    """Group consecutive words by speaker into 'Speaker N:' paragraphs."""
    blocks, cur, speaker = [], [], None
    for w in words:
        t = (w.get("text") or "").strip()
        if not t:
            continue
        sp = w.get("speaker_id") or "speaker_0"
        if sp != speaker and cur:
            blocks.append((speaker, " ".join(cur)))
            cur = []
        speaker = sp
        cur.append(t)
    if cur:
        blocks.append((speaker, " ".join(cur)))

    def label(sp):  # speaker_0 -> "Speaker 1"
        n = sp.rsplit("_", 1)[-1]
        return f"Speaker {int(n) + 1}" if n.isdigit() else sp

    return "\n\n".join(f"**{label(sp)}:** {txt}" for sp, txt in blocks).strip() + "\n"


def transcribe_elevenlabs(wav: Path, lang: str, diarize: bool):
    """ElevenLabs Scribe v2. Returns (segments: list[Seg], diarized_text or None)."""
    import requests

    key = get_elevenlabs_key()
    if not key:
        log("ERROR: ElevenLabs API key not found. Store it first — see SKILL.md "
            "(macOS Keychain, ELEVENLABS_API_KEY env var, or skill-dir .env).")
        sys.exit(2)

    data = {
        "model_id": "scribe_v2",
        "language_code": lang,            # ISO-639-1 (he/en) is accepted
        "diarize": "true" if diarize else "false",
        "tag_audio_events": "false",      # keep the transcript clean (no "(laughter)")
        "timestamps_granularity": "word",
    }
    log("Uploading to ElevenLabs Scribe v2…")
    with open(wav, "rb") as fh:
        resp = requests.post(
            "https://api.elevenlabs.io/v1/speech-to-text",
            headers={"xi-api-key": key},
            data=data,
            files={"file": ("audio.wav", fh, "audio/wav")},
            timeout=1800,
        )
    if resp.status_code != 200:
        log(f"ERROR: ElevenLabs API {resp.status_code}: {resp.text[:500]}")
        sys.exit(1)

    j = resp.json()
    words = [w for w in j.get("words", []) if w.get("type") == "word"]
    if not words:  # fall back to the flat text if no word objects came back
        return [Seg(0.0, 0.0, j.get("text", "").strip())], None
    segs = group_words(words)
    diarized = format_diarized(words) if diarize else None
    return segs, diarized


# --------------------------------------------------------------------------- output

def paragraphize(segments, gap_threshold: float = 1.2, max_sentences: int = 5) -> str:
    """Join segments into readable paragraphs.

    Start a new paragraph on a long silence gap, or after a few sentence-ending segments.
    """
    paragraphs, current, sent_count = [], [], 0
    prev_end = None
    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue
        big_gap = prev_end is not None and (seg.start - prev_end) > gap_threshold
        if current and (big_gap or sent_count >= max_sentences):
            paragraphs.append(" ".join(current))
            current, sent_count = [], 0
        current.append(text)
        if text.endswith((".", "!", "?", "…", ":", "。", "؟")):
            sent_count += 1
        prev_end = seg.end
    if current:
        paragraphs.append(" ".join(current))
    return "\n\n".join(paragraphs).strip() + "\n"


def fmt_ts(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def write_srt(segments, path: Path) -> None:
    lines = []
    for i, seg in enumerate(segments, 1):
        text = seg.text.strip()
        if not text:
            continue
        lines.append(str(i))
        lines.append(f"{fmt_ts(seg.start)} --> {fmt_ts(seg.end)}")
        lines.append(text)
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser(description="YouTube (or local file) -> clean transcript text.")
    ap.add_argument("source", help="YouTube URL or path to a local audio/video file")
    ap.add_argument("--lang", default="he",
                    help="Spoken language ISO code (default: he). Picks the local model / API hint.")
    ap.add_argument("--engine", default="local", choices=["local", "elevenlabs", "subs"],
                    help="Transcription engine (default: local; 'subs' = free YouTube subtitles).")
    ap.add_argument("--accurate", action="store_true",
                    help="[local] Use the full large-v3 model instead of turbo (slower, better)")
    ap.add_argument("--diarize", action="store_true",
                    help="[elevenlabs] Label speakers (Speaker 1/2/…) in the output")
    ap.add_argument("--out", default=None,
                    help="Output path or directory. Default: ./transcripts/<title>.txt")
    ap.add_argument("--srt", action="store_true", help="Also write an .srt subtitle file")
    ap.add_argument("--model", default=None, help="[local] Override the model id/path (advanced)")
    ap.add_argument("--keep-audio", action="store_true",
                    help="Keep the intermediate WAV next to the transcript")
    args = ap.parse_args()

    if args.diarize and args.engine != "elevenlabs":
        log("Note: --diarize only applies to --engine elevenlabs; ignoring it.")

    # Resolve output path
    if is_url(args.source):
        stem = fetch_title(args.source) or "transcript"
    else:
        stem = safe_stem(Path(args.source).stem)

    if args.out is None:
        out_txt = Path.cwd() / "transcripts" / f"{stem}.txt"
    else:
        out_path = Path(args.out)
        out_txt = out_path if out_path.suffix.lower() == ".txt" else out_path / f"{stem}.txt"
    out_txt.parent.mkdir(parents=True, exist_ok=True)

    workdir = Path(tempfile.mkdtemp(prefix="yt2txt_"))
    try:
        # 1+2. Get audio as 16 kHz mono WAV
        if args.engine == "subs":
            if not is_url(args.source):
                log("ERROR: --engine subs only works with a YouTube URL (it fetches subtitles).")
                sys.exit(2)
            vtt = download_subtitles(args.source, args.lang, workdir)
            if vtt is None:
                log(f"ERROR: no '{args.lang}' subtitles on this video. "
                    "Try another --lang, or engines: local/elevenlabs.")
                sys.exit(3)
            segs = parse_vtt(vtt)
            diarized = None
        else:
            if is_url(args.source):
                raw = download_audio(args.source, workdir)
            else:
                raw = Path(args.source)
                if not raw.exists():
                    log(f"ERROR: file not found: {raw}")
                    sys.exit(1)
            wav = to_wav(raw, workdir)

            # 3. Transcribe
            if args.engine == "elevenlabs":
                segs, diarized = transcribe_elevenlabs(wav, args.lang, args.diarize)
            else:
                segs, diarized = transcribe_local(wav, args.lang, args.accurate, args.model)

        # 4. Write outputs
        text = diarized if diarized is not None else paragraphize(segs)
        out_txt.write_text(text, encoding="utf-8")
        log(f"Wrote transcript: {out_txt}  ({len(text)} chars, engine={args.engine})")

        if args.srt:
            srt_path = out_txt.with_suffix(".srt")
            write_srt(segs, srt_path)
            log(f"Wrote subtitles: {srt_path}")

        if args.keep_audio:
            kept = out_txt.with_suffix(".wav")
            shutil.copy(wav, kept)
            log(f"Kept audio: {kept}")

        # Final line on stdout = the transcript path, so callers can capture it.
        print(str(out_txt))
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    main()
