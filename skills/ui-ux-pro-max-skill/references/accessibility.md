# Accessibility (WCAG AA Minimum)

## Color Contrast

- Normal text: minimum 4.5:1 contrast ratio against background
- Large text (18pt+ or 14pt bold+): minimum 3:1
- Interactive elements: minimum 3:1 against adjacent colors
- Never rely on color alone to convey meaning

## Keyboard Navigation

- All interactive elements reachable via Tab key
- Visible focus indicators on all focusable elements
- Logical Tab order matches visual flow
- Skip-to-content link as first focusable element
- No keyboard traps

## Screen Reader Support

- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<button>`, `<input>`, etc.
- Descriptive alt text on all meaningful images
- ARIA labels where context is unclear
- ARIA live regions for dynamic content updates
- Proper heading hierarchy (h1 → h2 → h3, no skips)

## Focus Management

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

## Motion & Animation

```css
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Form Accessibility

```html
<label for="email" class="form-label">Email</label>
<input type="email" id="email" name="email" class="form-input" required aria-describedby="email-hint">
<span id="email-hint" class="form-helper">We'll never share your email</span>
```

## Touch Target Minimums

- All interactive elements: minimum 44px × 44px
- Adequate spacing between tap targets (8px minimum)
- No hover-only interactions on touch devices

## ARIA Patterns

```html
<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about" aria-current="page">About</a></li>
  </ul>
</nav>

<!-- Button group -->
<div role="group" aria-label="View options">
  <button role="radio" aria-checked="true">Grid</button>
  <button role="radio" aria-checked="false">List</button>
</div>

<!-- Live region -->
<div aria-live="polite" role="status">
  <!-- Dynamic content updates announced to screen readers -->
</div>
```

## Contrast Checker

Use this tool to verify: https://webaim.org/resources/contrastchecker/

Target ratios:
- `#6366f1` on white = 4.56:1 ✅ (passes AA for normal text)
- `#6366f1` on `#0a0a0a` = 4.89:1 ✅
- `#525252` on white = 5.47:1 ✅
- `#737373` on white = 3.17:1 ⚠️ (use for large text only)