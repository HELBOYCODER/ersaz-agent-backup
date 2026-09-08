# SkillUI — Design System Reverse Engineering

Extracts exact design tokens from any website, git repo, or local project. No AI, no API keys.

## Installation
- Binary: `/usr/local/bin/skillui`
- Requires: Node.js 18+
- Ultra mode: needs Playwright (installed at `~/.cache/ms-playwright/`)

## Usage

### Scan a website
```bash
skillui --url https://example.com
```

### Ultra mode (full extraction with screenshots, animations, interactions)
```bash
skillui --url https://example.com --mode ultra
```

### Scan local project
```bash
skillui --dir ./my-app
```

### Scan git repo
```bash
skillui --repo https://github.com/org/repo
```

### Output directory
```bash
skillui --url https://example.com --out ./design-output
```

## Output Files
| File | Contents |
|---|---|
| `DESIGN.md` | Colors, typography, spacing, border radius, components |
| `ANIMATIONS.md` | CSS keyframes, scroll triggers, GSAP/Lottie/Three.js |
| `LAYOUT.md` | Flex/grid containers, page structure |
| `COMPONENTS.md` | DOM patterns, HTML fingerprints, class analysis |
| `INTERACTIONS.md` | Hover/focus state diffs with before/after styles |
| `VISUAL_GUIDE.md` | Master visual reference with screenshots |
| `screens/scroll/` | 7 cinematic scroll journey screenshots (ultra) |
| `tokens/*.json` | Colors, spacing, typography as JSON tokens |
| `fonts/` | Google Fonts bundled locally |

## Modes
- **default**: DESIGN.md + tokens + fonts
- **ultra**: Everything above + screenshots + animations + interactions + components

## Flags
- `--no-skill` — DESIGN.md only, skip .skill ZIP packaging
- `--format design-md|skill|both` — control output format (default: both)
- `--screens <N>` — ultra mode: max pages to crawl (default: 5)
- `--name <string>` — override project name
