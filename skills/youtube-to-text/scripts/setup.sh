#!/usr/bin/env bash
#
# One-time setup for the youtube-to-text skill.
#
# Installs the CLI tools (yt-dlp, ffmpeg) and builds an ISOLATED Python 3.12 venv
# with faster-whisper — kept separate from the system Python 3.14 (which has no
# ctranslate2/faster-whisper wheels yet) so nothing on the machine is disturbed.
#
# Safe to re-run: it skips anything already present.

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$SKILL_DIR/.venv"
PYVER="3.12"

say() { printf '\033[1;36m[setup]\033[0m %s\n' "$*"; }

# --- 1. Homebrew CLI tools -------------------------------------------------
if ! command -v brew >/dev/null 2>&1; then
  echo "ERROR: Homebrew not found. Install it from https://brew.sh first." >&2
  exit 1
fi

for tool in yt-dlp ffmpeg uv; do
  if command -v "$tool" >/dev/null 2>&1; then
    say "$tool already installed ($(command -v "$tool"))"
  else
    say "Installing $tool via brew…"
    brew install "$tool"
  fi
done

# --- 2. Isolated Python venv (uv manages the 3.12 interpreter itself) ------
if [ -d "$VENV" ]; then
  say "venv already exists at $VENV"
else
  say "Creating venv with Python $PYVER at $VENV"
  uv venv --python "$PYVER" "$VENV"
fi

# --- 3. Python deps --------------------------------------------------------
say "Installing faster-whisper + requests into the venv…"
uv pip install --python "$VENV/bin/python" --upgrade faster-whisper requests

say "Verifying faster-whisper import…"
"$VENV/bin/python" -c "import faster_whisper; print('faster-whisper', faster_whisper.__version__)"

say "Done. The skill is ready."
say "First transcription will download the model (~1.6 GB for turbo) from HuggingFace."
