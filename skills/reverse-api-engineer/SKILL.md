# reverse-api-engineer (RAE)

Turn websites into APIs: browse → capture HAR → LLM writes a typed API client.

- Repo: github.com/nottelabs/reverse-api-engineer (kalil0321 is a fork/author)
- Installed: `pip3 install --break-system-packages reverse-api-engineer` (v0.13.x, CLI at /usr/bin/reverse-api-engineer)
- Docs: https://reverseapi.dev

## Headless usage (scripted, agent-friendly)

```bash
# validate config without launching
reverse-api-engineer agent -p "<goal>" -u <url> --dry-run

# full run: capture + generate client
reverse-api-engineer agent -p "fetch all apple jobs" -u https://jobs.apple.com --headless --json > /tmp/rae.json
# result JSON: {status, run_id, har_path, script_path, usage{total_cost_usd}, error}

# re-run a generated client
reverse-api-engineer list --json
reverse-api-engineer run <run_id> --ls
reverse-api-engineer run <run_id> -- --limit 10
reverse-api-engineer engineer <run_id>   # regenerate on same capture
```

Modes: `agent` (autonomous), `engineer <run_id>` (regen), `collector` (structured JSON/CSV data), REPL default. Output languages: python/js/ts/go/java/csharp/php/ruby/c (`output_language` in ~/.reverse-api/config.json).

## Brain (LLM SDK) — REQUIRED, none configured yet in sandbox

Config ~/.reverse-api/config.json: `sdk`: claude (default; needs ANTHROPIC_API_KEY, honors ANTHROPIC_BASE_URL for gateways speaking /v1/messages), opencode (auto-starts opencode-ai via npx or OPENCODE_BASE_URL), cursor, copilot. Model keys: claude-sonnet-4-6 etc.

## Sandbox browser stack (WORKS — do not redo)

1. Playwright chromium downloaded to ~/.cache/ms-playwright/{chromium-1194,chromium_headless_shell-1194}.
2. Alpine musl can't run Ubuntu binaries directly AND debroot glibc bridge fails (Alpine/musl lib mixing). **Working solution**: the chrome/headless_shell binaries were REPLACED with shims:
   `#!/bin/sh\nexec /usr/bin/chromium-browser --no-sandbox --disable-gpu --disable-dev-shm-usage "$@"`
   (/usr/bin/chromium-browser = apk `chromium`, v136).
3. If playwright cache wiped → re-run shim creation after download (see above two-liner).
4. Verified E2E: `npx -y playwright@1.56.1 screenshot https://example.com out.png` works.
5. @playwright/mcp 0.0.79 available via npx (agent mode provider "auto" uses it).

## Gotchas

- pip DNS: files.pythonhosted.org resolved to IPv6-only → fixed via `/etc/hosts: 151.101.128.223 files.pythonhosted.org`. Re-add if pip "Try again" errors return.
- npx opencode-ai HANGS on musl arm64 — don't use sdk=opencode auto-start locally.
- RAE is an MCP *consumer*, not an MCP server — cannot be added to Minis MCP list directly. Drive it via shell instead.
- VPS route alternative: run opencode serve on 95.182.91.212 and set OPENCODE_BASE_URL for sandbox RAE (VPS was down when tested).
