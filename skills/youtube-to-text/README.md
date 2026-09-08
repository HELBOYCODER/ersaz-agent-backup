# youtube-to-text

A [Claude Code](https://claude.com/claude-code) **skill** that downloads a YouTube video (or any
local audio/video file), transcribes the speech to clean text, and then summarizes it — so Claude
can read, quote, and reason about what was said.

Built for **Hebrew and English**, with Hebrew as a first-class citizen:

- **Local engine** (default) — [`faster-whisper`](https://github.com/SYSTRAN/faster-whisper)
  running **on-device**: free, private, offline. Hebrew uses the
  [**ivrit.ai**](https://huggingface.co/ivrit-ai) Whisper finetunes (state-of-the-art open Hebrew
  ASR); English uses Whisper `large-v3`.
- **ElevenLabs engine** (optional) — [ElevenLabs **Scribe v2**](https://elevenlabs.io/docs/capabilities/speech-to-text)
  cloud API for the highest accuracy (also nails English brand/tech terms spoken inside Hebrew,
  and supports speaker diarization). Costs money and uploads the audio to ElevenLabs.

> The skill is invoked automatically by Claude Code when you ask it to transcribe/summarize a
> video or paste a YouTube link. You can also run `scripts/transcribe.py` directly.

---

## Features

- 🎯 **Strong Hebrew** — ivrit.ai finetunes locally, or ElevenLabs Scribe v2 in the cloud.
- 🔒 **Local & private by default** — nothing leaves your machine with the local engine.
- 🌐 **English too** — Whisper `large-v3` / Scribe v2.
- 📝 **Clean output** — paragraph-segmented `.txt`, optional `.srt` subtitles, optional summary.
- 🗣️ **Speaker diarization** (`--diarize`, ElevenLabs engine).
- 🧹 **Proofread step** — Claude fixes the English brand/tech terms the local Hebrew model tends
  to garble (e.g. "קלוד קוד" → "Claude Code").
- 🔑 **Safe key handling** — ElevenLabs key read from macOS Keychain, env var, or `.env`
  (never committed).

## Requirements

- **macOS on Apple Silicon** (primary target). Linux works too if you provide the deps manually;
  the macOS Keychain lookup is skipped gracefully (use `ELEVENLABS_API_KEY` or `.env` there).
- [**Homebrew**](https://brew.sh) — used to install `yt-dlp`, `ffmpeg`, and `uv`.
- Internet for the first run (downloads the local model, ~1.6 GB for the Hebrew turbo model) and
  for the ElevenLabs engine.

## Install

Clone into your Claude Code user-skills directory so Claude can discover it:

```bash
git clone https://github.com/Gal-WPsite/youtube-to-text.git \
  ~/.claude/skills/youtube-to-text
bash ~/.claude/skills/youtube-to-text/scripts/setup.sh
```

`setup.sh` installs `yt-dlp`, `ffmpeg`, and `uv` (via Homebrew), then builds an **isolated
Python 3.12 venv** with `faster-whisper` + `requests` — it does **not** touch your system Python.
It's safe to re-run.

## Usage

Let Claude drive it (just ask it to "transcribe / summarize this video" and paste a link), or run
it directly:

```bash
# Local engine (default) — free / offline. Hebrew:
~/.claude/skills/youtube-to-text/.venv/bin/python \
  ~/.claude/skills/youtube-to-text/scripts/transcribe.py \
  "https://www.youtube.com/watch?v=…" --lang he

# English:
…/transcribe.py "https://www.youtube.com/watch?v=…" --lang en

# A local file, with subtitles:
…/transcribe.py ./meeting.mp4 --lang he --srt

# ElevenLabs Scribe v2 (needs a key — see below), with speaker labels:
…/transcribe.py "https://youtu.be/…" --lang he --engine elevenlabs --diarize
```

Output defaults to `./transcripts/<title>.txt` in the current directory.

### Flags

| Flag | Description |
|------|-------------|
| `--engine local\|elevenlabs` | Transcription engine (default `local`). |
| `--lang he\|en` | Spoken language (default `he`). |
| `--accurate` | [local] Use full `large-v3` instead of `turbo` (slower, more accurate). |
| `--diarize` | [elevenlabs] Label speakers (`**Speaker 1:** …`). |
| `--srt` | Also write a timestamped `.srt` subtitle file. |
| `--out <path>` | Output `.txt` path or directory. |
| `--keep-audio` | Keep the intermediate 16 kHz WAV. |
| `--model <id>` | [local] Override the model id/path (advanced). |

## ElevenLabs key setup (optional engine)

The script looks for the key in this order: **`ELEVENLABS_API_KEY` env var → macOS Keychain →
`.env` file** in the skill directory. **You store the key yourself** — it's never committed.

Recommended (macOS Keychain — no plaintext on disk; prompts for the secret so it stays out of
shell history):

```bash
security add-generic-password -s ELEVENLABS_API_KEY -a youtube-to-text -U -w
# paste your key when prompted
```

Or create `~/.claude/skills/youtube-to-text/.env` (it's git-ignored):

```
ELEVENLABS_API_KEY=your_key_here
```

## How it works

```
YouTube URL ─yt-dlp→ bestaudio ─ffmpeg→ 16 kHz mono WAV ─┬─ local: faster-whisper (ivrit.ai / Whisper)
                                                          └─ cloud: ElevenLabs Scribe v2
                                          → clean .txt (+ .srt) → Claude proofreads (Hebrew) → summary
```

The local Hebrew model is excellent on Hebrew but spells **English terms phonetically**
("Cloudflare" → "קלאודפלר"). The skill's **proofread** step has Claude fix those clearly-wrong
terms using context (keeping a `.raw.txt` of the original), then summarize.

## Notes & limits

- **Local on Mac runs on CPU** (CTranslate2 has no Metal/GPU backend), so a long video takes a
  few minutes — the `turbo` model (default) is the practical choice. Run long jobs in the
  background.
- The **ivrit.ai models are Hebrew-only by design** — don't use `--lang he` on English audio with
  the local engine (use `--lang en`, or the ElevenLabs engine for mixed content).
- ElevenLabs **costs money** and **uploads your audio** to their API. Don't send anything
  sensitive without thinking about it.

## Credits

- [ivrit.ai](https://www.ivrit.ai/) — Hebrew Whisper finetunes & dataset (Interspeech 2025).
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) / [CTranslate2](https://github.com/OpenNMT/CTranslate2)
  and OpenAI [Whisper](https://github.com/openai/whisper).
- [ElevenLabs Scribe](https://elevenlabs.io/docs/capabilities/speech-to-text).
- [yt-dlp](https://github.com/yt-dlp/yt-dlp), [ffmpeg](https://ffmpeg.org/), [uv](https://github.com/astral-sh/uv).

Each dependency is under its own license — review them for commercial use.

## Disclaimer

This tool downloads audio from YouTube. Only download content you have the right to use, and
respect YouTube's Terms of Service and applicable copyright law. The authors take no
responsibility for misuse.

## License

[MIT](./LICENSE) © 2026 Gal Hadad
