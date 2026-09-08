# Playwright CLI Skill

Microsoft's official Playwright CLI for browser automation from terminal. Token-efficient alternative to MCP for coding agents.

## Installation
- Binary: `/usr/local/bin/playwright-cli`
- Browser: Chromium at `~/.cache/ms-playwright/chromium_headless_shell-1234`

## Quick Start
```bash
playwright-cli open https://example.com
playwright-cli snapshot          # get element refs
playwright-cli click e12         # click element by ref
playwright-cli type "hello"      # type text
playwright-cli screenshot        # capture page
playwright-cli close             # close browser
```

## Session Management
- Default: in-memory session (cookies/state lost on close)
- Persistent: `playwright-cli -s=myname open https://...` (profile saved to disk)
- List sessions: `playwright-cli list`
- Kill zombies: `playwright-cli kill-all`

## Key Commands

### Navigation & Interaction
- `open <url>` — launch browser to URL
- `goto <url>` — navigate in existing browser
- `click <target> [button]` — click element (target = element ref from snapshot)
- `dblclick <target>` — double click
- `type <text>` — type into focused element
- `fill <target> <text>` — fill input by ref
- `select <target> <val>` — dropdown select
- `check <target>` / `uncheck <target>` — checkbox/radio
- `hover <target>` — hover
- `drag <start> <end>` — drag and drop
- `press <key>` — keyboard press (Enter, Tab, Escape, arrowleft, etc.)

### Inspection
- `snapshot [target]` — capture accessibility tree (element refs like e1, e12, e35)
- `find <text>` — search page for text, returns matching nodes with context
- `screenshot [target]` — screenshot page or element
- `pdf` — save as PDF
- `console [min-level]` — list console messages

### Network
- `requests` — list network requests since page load
- `request <index>` — full details of a request (headers, body, response)
- `response-body <index>` — get response body
- `route <pattern>` — mock network requests
- `network-state-set offline|online` — toggle network

### Tabs & Storage
- `tab-list` / `tab-new [url]` / `tab-close <i>` / `tab-select <i>`
- `state-save [file]` / `state-load <file>` — persist auth state
- `cookie-list` / `cookie-set <n> <v>` / `localstorage-*` / `sessionstorage-*`

### DevTools
- `run-code <code>` — execute Playwright code snippet
- `eval <func> [target]` — evaluate JS on page
- `video-start` / `video-stop` — record video
- `tracing-start` / `tracing-stop` — trace recording

## Workflow Pattern
1. `playwright-cli open <url>` — open page
2. `playwright-cli snapshot` — get element refs
3. `playwright-cli find "Login"` — find login button ref
4. `playwright-cli click e42` — click it
5. `playwright-cli fill e15 "user@example.com"` — fill form
6. `playwright-cli press Enter` — submit
7. `playwright-cli screenshot` — verify result
8. `playwright-cli close` — done

## Flags
- `--json` — output as JSON
- `--raw` — output only result value
- `--headed` — visible browser (with `open`)
- `--help [command]` — command-specific help
