---
name: ui-ux-pro-max-skill
description: Comprehensive UI/UX design skill — audit, redesign, design system, accessibility, visual QA, and premium polish. Use when the user says: ui-ux, ui ux, ui/ux, pro max, premium design, redesign, design system, make it beautiful, make it premium, make it less ai, ai-looking ui, ai slop ui, generic ui, broken layout, frontend, front-end, front end, web ui, landing page, web app layout, responsive layout, responsive design, design quality, visual qa, accessibility, wcag, lighthouse, core web vitals, taste, polish, high quality design, ui ux pro max, design pro max, frontend pro max, visual qa pro.
metadata:
  tags: [design, ui, ux, accessibility, quality, premium]
  category: materials
  phase: design-quality-gate
  quality_tier: pro-gated
---

# UI/UX Pro Max Skill

Comprehensive UI/UX design skill combining audit, redesign, design system, accessibility, visual QA, and premium polish into one workflow.

## Workflow

### Phase 1: Audit
Scan the project. Identify framework, styling method, and current design patterns. Run through the audit checklist in `references/audit-checklist.md` and list every generic pattern, weak point, and missing state.

### Phase 2: Diagnose
Categorize findings by severity. Group related issues. Identify root causes (not just symptoms).

### Phase 3: Fix
Apply targeted upgrades working with the existing stack. Do not rewrite from scratch. Apply changes in priority order:
1. **Font swap** — biggest instant improvement, lowest risk
2. **Color palette cleanup** — remove clashing or oversaturated colors
3. **Hover and active states** — makes the interface feel alive
4. **Layout and spacing** — proper grid, max-width, consistent padding
5. **Replace generic components** — swap cliche patterns for modern alternatives
6. **Add loading, empty, and error states** — makes it feel finished
7. **Polish typography scale and spacing** — the premium final touch

### Phase 4: Verify
Take screenshots at multiple breakpoints. Check contrast ratios. Validate keyboard navigation. Run Lighthouse if available. Use `references/design-critique-rubric.md` to judge each axis with named evidence.

### Phase 5: Document
Record what was changed, why, and how it maps to the design system.

## Reference Files

| File | Covers |
|------|--------|
| `references/audit-checklist.md` | Full audit checklist (typography, color, layout, interactivity, content, components, iconography, code quality, strategic omissions) |
| `references/design-system.md` | Color palette, typography scale, spacing, shadows, transitions |
| `references/components.md` | Buttons, cards, form elements, navigation, badges |
| `references/responsive.md` | Container, breakpoints, grid patterns, touch targets |
| `references/accessibility.md` | WCAG AA, keyboard navigation, screen reader, focus management, motion |
| `references/states.md` | Loading (skeleton), empty state, error state |
| `references/motion.md` | Animation principles, keyframes, staggered entrance, spotlight border, theme toggle |
| `references/visual-qa.md` | Visual QA checklist + anti-slop patterns to reject |
| `references/design-critique-rubric.md` | 8-axis critique rubric for senior designer sign-off |

## Rules
- Work with the existing tech stack. Do not migrate frameworks or styling libraries.
- Do not break existing functionality. Test after every change.
- Before importing any new library, check the project's dependency file first.
- If the project uses Tailwind, check the version (v3 vs v4) before modifying config.
- If the project has no framework, use vanilla CSS.
- Never claim visual QA pass without fresh rendered evidence (screenshots at 320/768/1280px).