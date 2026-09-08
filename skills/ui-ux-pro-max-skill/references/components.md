# Components

## Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-sm);
  line-height: 1;
  padding: var(--space-3) var(--space-4);
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
  border-color: var(--border-strong);
}

.btn-ghost {
  background-color: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover:not(:disabled) {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-lg { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn-sm { padding: var(--space-2) var(--space-3); font-size: var(--text-xs); }
.btn-icon { padding: var(--space-2); aspect-ratio: 1; }
```

## Cards

```css
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all var(--transition-normal);
}
.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.card-no-border {
  border: none;
  background: transparent;
}
.card-elevated {
  border: none;
  box-shadow: var(--shadow-md);
}
```

## Form Elements

```css
.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: var(--space-3);
  font-size: var(--text-base);
  font-family: inherit;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all var(--transition-fast);
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 15%, transparent);
}

.form-input:disabled {
  background-color: var(--bg-secondary);
  cursor: not-allowed;
}

.form-error {
  font-size: var(--text-xs);
  color: var(--color-error);
  margin-top: var(--space-1);
}

.form-helper {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: var(--space-1);
}
```

## Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.nav-link {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}
.nav-link.active {
  color: var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
}
```

## Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
  padding: 0.15rem 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}
.badge-success { background-color: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success); border-color: color-mix(in srgb, var(--color-success) 30%, transparent); }
.badge-warning { background-color: color-mix(in srgb, var(--color-warning) 15%, transparent); color: var(--color-warning); border-color: color-mix(in srgb, var(--color-warning) 30%, transparent); }
.badge-error   { background-color: color-mix(in srgb, var(--color-error) 15%, transparent); color: var(--color-error); border-color: color-mix(in srgb, var(--color-error) 30%, transparent); }
```

## Tooltip

```css
.tooltip {
  position: relative;
  display: inline-flex;
}
.tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
  color: white;
  background-color: var(--color-gray-800);
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  pointer-events: none;
}
.tooltip:hover .tooltip__content {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
```