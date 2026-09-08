# Visual QA Checklist

## Before PASS, verify:

- [ ] Screenshot taken at 320px (mobile)
- [ ] Screenshot taken at 768px (tablet)
- [ ] Screenshot taken at 1280px (desktop)
- [ ] No text overflow or clipping
- [ ] No placeholder text visible
- [ ] No generic stock imagery
- [ ] No broken layout at any breakpoint
- [ ] No orphaned words on last line
- [ ] Focus indicators visible on keyboard navigation
- [ ] All buttons have hover states
- [ ] All interactive elements have press feedback
- [ ] Color contrast passes WCAG AA (4.5:1)
- [ ] Dark mode renders correctly if implemented
- [ ] Reduced motion preference respected
- [ ] Favicon present and branded
- [ ] Meta tags present (title, description, og:image)
- [ ] Semantic HTML used (nav, main, article, aside, section)
- [ ] Skip-to-content link present
- [ ] No console errors in browser
- [ ] Lighthouse accessibility score ≥ 95 (if run)
- [ ] Lighthouse performance score ≥ 90 (if run)

## Anti-Slop Patterns to Reject

- One-note palettes with no hierarchy
- Weak visual hierarchy with cramped cards
- Ungrounded gradients and decorative blobs
- Placeholder-heavy copy (lorem ipsum, "John Doe")
- Generic card look (border + shadow + white bg everywhere)
- Three equal card columns as feature rows
- Modals for everything
- Footer link farms with 4+ columns
- Lucide/Feather icons exclusively
- Rocketship for "Launch", shield for "Security"
- AI copywriting cliches (Elevate, Seamless, Unleash, Next-Gen)
- No hover, active, or focus states
- No loading, empty, or error states
- No legal links (privacy, terms)
- No back navigation
- No custom 404 page
- No form validation
- No cookie consent banner (if required)

## Critique Rubric (8 Axes)

| Axis | Pass Standard | FAIL |
|------|--------------|------|
| **Hierarchy** | One glance names what leads/supports/recedes | Adjacent elements at equal weight |
| **Type discipline** | Modular scale; display vs body behave differently | Arbitrary sizes; one step doing 3 jobs |
| **Spacing rhythm** | Values from scale; sections breathe in proportion | Off-scale values; touching sections |
| **Color system** | Layered bg, text hierarchy, deliberate accent, semantic states | One flood color + gray; decorative gradients; contrast < floor |
| **State coverage** | Hover, focus-visible, active, disabled, loading, error, empty | Any interactive element with only default state |
| **Signature** | At least one deliberate element a template would not have | Nothing distinguishes from framework example app |
| **Motion restraint** | Animation communicates state/causality; respects reduced motion | Decorative motion; scroll hijacking; ignored prefers-reduced-motion |
| **CJK fit** | Fallback stacks, line-height, truncation behave in heavy script | Latin-tuned metrics breaking CJK text |

Every FAIL must name the axis, the evidence, and the smallest change that would flip it. A PASS requires fresh rendered evidence across declared pages, states, and viewports.