# Hyper Get Skill

## Overview

**Hyper Get** is an open-source, cross-platform download manager for Windows and Linux, built with **Rust**, **SQLite**, **Tauri 2**, and **React**. It targets users who are tired of browser-bound or resource-heavy downloaders and want a fast, persistent, resumable solution with modern features.

- **Repository**: [github.com/khodemadi/Hyperget](https://github.com/khodemadi/Hyperget)
- **Current release**: `v0.2.2-alpha.1`
- **License**: MIT

## Key Features

| Capability | Implementation |
|---|---|
| Priority queue | Persistent SQLite WAL queue ordered by `Critical > High > Normal > Low`, then position and creation time |
| Concurrent downloads | Serialized scheduler with configurable max slots (default 3 active) |
| Resume / restart recovery | Partial-byte reconciliation from disk; remote identity checks (ETag/Last-Modified) before appending |
| Partial-file continuation | `Content-Range` probing via `probe()` in `hyper-core/src/http.rs` |
| Speed limiting | Shared async rate gate for the combined global rate; optional per-download gate applies the stricter file rate |
| SHA-256 verification | `checksum_sha256` field in `AddDownloadRequest`; verified post-download via `hyper-core/src/verify.rs` |
| Wildcard discovery | `expand_wildcards()` probes actual byte sequence from a single `*` pattern |
| Browser extensions | Chromium (Chrome/Edge) and Firefox extensions via native messaging host |
| Desktop UI | Light/dark Tauri window with guarded commands and crash fallback |

## Components

- `crates/hyper-core` — download engine, scheduler, SQLite persistence, HTTP client, verification
- `crates/hyper-cli` — command-line client (`Add`, `List`, `Status`, `Start/Pause/Resume/Cancel`, `Remove`, `StartAll`, `PauseAll`)
- `crates/hyper-native-host` — browser native messaging bridge
- `apps/desktop` — Tauri + React desktop application
- `extensions/browser` — Chromium and Firefox extensions

## CLI Usage

```bash
# Add a download (default 4 connections, start immediately)
hyper-get add <url> [--output <path>] [--no-start]

# List downloads
hyper-get list [--json]

# Global status
hyper-get status [--json]

# Per-download controls (id is a UUID)
hyper-get start <id>
hyper-get pause <id>
hyper-get resume <id>
hyper-get cancel <id>
hyper-get remove <id> [--delete-data]
```

Data directory defaults to `$XDG_DATA_HOME/hyper-get` (Linux) or `%APPDATA%\hyper-get` (Windows); override with `--data-dir` or `HYPER_GET_DATA_DIR`.

## Installation

### Prebuilt binaries (amd64 / x86_64 only)

Release assets are available for:

- Windows 10/11 x64: NSIS `.exe`, WiX `.msi`
- Linux x64: AppImage, `.deb`
- Browser extensions: `hyper-get-chromium.zip`, `hyper-get-firefox.zip`
- Native host bridges: Linux x64 and Windows x64

Download from: <https://github.com/khodemadi/Hyperget/releases/latest>

### Build from source (aarch64 / arm64 or any platform)

**Requirements**: Rust 1.85+, Node.js 22+, pnpm 10.14+, Tauri system dependencies.

```bash
corepack enable
pnpm install --frozen-lockfile
cargo test --workspace --all-features      # run tests
pnpm lint && pnpm typecheck && pnpm test   # quality checks
pnpm --filter @hyper-get/desktop tauri dev  # run desktop app
pnpm --filter @hyper-get/desktop tauri build  # build desktop bundle
pnpm browser:build                          # build extensions
pnpm browser:package                        # package extensions
```

> Note: This environment is aarch64; release binaries are amd64-only, so building from source is required here.

## Browser Integration

1. Install the desktop app.
2. Install the native messaging host:
   - **Linux**: `./scripts/install-browser-host-linux.sh`
   - **Windows**: `.\scripts\install-browser-host-windows.ps1`
3. Load the matching extension ZIP from the release page in developer/unpacked mode.

See `extensions/browser/README.md` in the repository for details.

## Architecture Highlights

- `hyper-core` is the single source of truth for downloads, scheduler state, settings, and aggregate status.
- The CLI and Tauri adapter are thin clients over `DownloadService`; React invokes typed Tauri commands and renders snapshots via a guarded, non-overlapping refresh loop.
- A typed state machine (`DownloadState::can_transition`) governs all lifecycle transitions.
- `GlobalStatus` percentage is byte-weighted: `sum(min(downloaded, total)) / sum(total)` across known-size downloads only.
- Filenames are sanitized against traversal and Windows reserved device names; collisions resolve to `file (n).ext`.
- SQLite uses WAL mode with explicit migrations (`001_initial`, `002_queue_settings`, `003_download_preferences`).

## Documentation

- Architecture: `docs/ARCHITECTURE.md`
- Core engine: `docs/CORE.md`
- Extension protocol: `docs/EXTENSION_PROTOCOL.md`
- Release process: `docs/RELEASE.md`
- Testing: `docs/TESTING.md`
- UI: `docs/UI.md`

## Useful Links

- Repository: <https://github.com/khodemadi/Hyperget>
- Releases: <https://github.com/khodemadi/Hyperget/releases/latest>
- Issues: <https://github.com/khodemadi/Hyperget/issues>
- Telegram: [@im_wrench](https://t.me/im_wrench) (Ali), [@Codino_dev](https://t.me/Codino_dev)
