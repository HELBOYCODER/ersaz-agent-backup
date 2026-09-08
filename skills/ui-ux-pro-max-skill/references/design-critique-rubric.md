# Design Critique Rubric

The critique question is never "is it correct?" — it is "does this clear what a senior product designer at a top-tier product company — the Linear/Stripe/Supabase class — would sign off on?". **Technically clean but flat fails.** Judge each axis explicitly; a PASS with no named evidence per axis is not a review.

## Axes

- **Hierarchy** — one glance names what leads, what supports, what recedes.
  FAIL: adjacent elements competing at equal weight; headings that do not organize scanning.
- **Type discipline** — a modular scale is in use; display and body behave differently on purpose. FAIL: arbitrary sizes, one step doing three jobs, broken CJK line-height.
- **Spacing rhythm** — values come from the scale; sibling gaps agree; sections breathe in proportion to their weight. FAIL: off-scale values, touching sections, arrhythmic padding.
- **Color system** — layered backgrounds, text hierarchy through color, a deliberate accent budget, semantic states. FAIL: one flood color plus gray; decorative gradients with no role; contrast under the floor.
- **State coverage** — primitives show hover, focus-visible, active, disabled, loading, error, and empty. FAIL: any interactive element with only a default state.
- **Signature** — at least one deliberate element a template would not have. FAIL: nothing distinguishes this surface from its framework's example app.
- **Motion restraint** — animation communicates state or causality within duration tokens and respects reduced motion. FAIL: decorative motion, scroll hijacking, ignored `prefers-reduced-motion`.
- **CJK and localization fit** — when the audience needs it: fallback stacks, line-height, and truncation behave in the heavy script. FAIL: Latin-tuned metrics breaking CJK text.

## Verdict discipline

- Review content accuracy and hierarchy before visual polish; a beautiful wrong page fails first on content.
- Name the taste direction the work claims — the primary direction (operational, minimalist/editorial, premium/soft, or bold/expressive) — then judge inside it: an operational tool is not failed for lacking gloss, and a premium surface is failed for it.
- Every FAIL names the axis, the evidence, and the smallest change that would flip it.
- A PASS requires fresh rendered evidence across the declared pages, states, and viewports; the rubric never passes work from description alone.

## Attribution

Adapted from concepts by `nextlevelbuilder/ui-ux-pro-max-skill` (MIT), `Leonxlnx/taste-skill` (MIT), `Owl-Listener/designpowers` (MIT), and `nexu-io/open-design` (Apache-2.0). No upstream text is reproduced; this is an original synthesis.