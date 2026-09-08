# States: Loading, Empty, Error

## Loading States

```css
/* Skeleton loader */
.skeleton {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: inherit;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Card skeleton */
.card-skeleton {
  height: 200px;
  border-radius: 0.75rem;
}

/* Text skeleton lines */
.skeleton-text {
  height: 1em;
  border-radius: 4px;
  margin-bottom: var(--space-2);
}
.skeleton-text:last-child { width: 60%; }
```

## Empty States

```html
<div class="empty-state">
  <div class="empty-state__icon" aria-hidden="true">📋</div>
  <h3 class="empty-state__title">No items yet</h3>
  <p class="empty-state__description">Create your first item to get started.</p>
  <button class="btn btn-primary">Create item</button>
</div>
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-16);
  gap: var(--space-4);
}
.empty-state__icon {
  font-size: var(--text-5xl);
  opacity: 0.5;
}
.empty-state__title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}
.empty-state__description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
  max-width: 320px;
}
```

## Error States

```html
<div class="error-state" role="alert">
  <span class="error-state__icon" aria-hidden="true">⚠️</span>
  <h3 class="error-state__title">Something went wrong</h3>
  <p class="error-state__description">We couldn't load the data. Please try again.</p>
  <button class="btn btn-secondary" onclick="retry()">Retry</button>
</div>
```

```css
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12);
  gap: var(--space-3);
  background-color: color-mix(in srgb, var(--color-error) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-error) 20%, transparent);
  border-radius: 0.75rem;
}
.error-state__icon { font-size: var(--text-3xl); }
.error-state__title {
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-error);
  margin: 0;
}
.error-state__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}
```

## Toast / Notification

```css
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  animation: slide-in var(--transition-normal) var(--transition-spring) both;
}
@keyframes slide-in {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
.toast--success { border-left: 3px solid var(--color-success); }
.toast--warning { border-left: 3px solid var(--color-warning); }
.toast--error   { border-left: 3px solid var(--color-error); }
.toast--info    { border-left: 3px solid var(--color-info); }
```