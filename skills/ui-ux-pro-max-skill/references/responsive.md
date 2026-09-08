# Responsive Framework

## Container

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
```

## Breakpoints (Mobile-first)

```css
/* Base: 320px+ */
/* sm: 640px */
@media (min-width: 640px) { /* small tablets */ }
/* md: 768px */
@media (min-width: 768px) { /* tablets */ }
/* lg: 1024px */
@media (min-width: 1024px) { /* desktop */ }
/* xl: 1280px */
@media (min-width: 1280px) { /* large desktop */ }
/* 2xl: 1536px */
@media (min-width: 1536px) { /* ultra-wide */ }
```

## Common Grid Patterns

```css
/* 2-column zig-zag */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
  align-items: center;
}
@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; gap: var(--space-6); }
}

/* Auto-fit card grid */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

/* Masonry */
.masonry {
  columns: 3;
  column-gap: var(--space-6);
}
@media (max-width: 1024px) { .masonry { columns: 2; } }
@media (max-width: 640px) { .masonry { columns: 1; } }

/* Split layout */
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
}
@media (max-width: 768px) { .split { grid-template-columns: 1fr; } }
```

## Touch Targets

```css
/* Minimum 44px touch target for all interactive elements */
.btn, .nav-link, .card, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

## Fluid Type

```css
/* Clamp for responsive type without breakpoints */
h1 { font-size: clamp(var(--text-2xl), 5vw, var(--text-7xl)); }
p  { font-size: clamp(var(--text-base), 2vw, var(--text-lg)); }
```