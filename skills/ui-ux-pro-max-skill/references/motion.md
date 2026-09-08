# Motion & Animation

## Principles

- Use `transform` and `opacity` only — GPU-accelerated, never janky
- Spring physics over linear easing for natural feel: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Staggered entry: elements cascade in with 50-100ms delays
- Scroll-driven reveals: content enters through expanding masks or wipes
- Never animate `top`, `left`, `width`, `height`

## Key Animations

```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered entrance */
.stagger > * {
  animation: slide-up var(--transition-normal) var(--transition-fast) both;
}
.stagger > *:nth-child(2) { animation-delay: 50ms; }
.stagger > *:nth-child(3) { animation-delay: 100ms; }
.stagger > *:nth-child(4) { animation-delay: 150ms; }
.stagger > *:nth-child(5) { animation-delay: 200ms; }
```

## Spotlight Border

```css
.spotlight {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background: var(--bg-primary);
}
.spotlight::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-accent), transparent 40%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.spotlight:hover::before { opacity: 1; }
```

```javascript
// Spotlight mouse tracking
document.querySelectorAll('.spotlight').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});
```

## Theme Toggle

```html
<div class="theme-toggle" role="radiogroup" aria-label="Theme">
  <button class="theme-option active" data-theme="system" role="radio" aria-checked="true">System</button>
  <button class="theme-option" data-theme="light" role="radio" aria-checked="false">Light</button>
  <button class="theme-option" data-theme="dark" role="radio" aria-checked="false">Dark</button>
</div>
```

```css
.theme-toggle {
  display: inline-flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 3px;
  gap: 2px;
}
.theme-option {
  padding: 8px 14px;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.theme-option.active {
  background: var(--color-accent);
  color: white;
}
```

```javascript
class ThemeManager {
  constructor() {
    this.current = localStorage.getItem('theme') || 'system';
    this.apply(this.current);
    this.bind();
  }
  apply(theme) {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
    document.querySelectorAll('.theme-option').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === theme);
      el.setAttribute('aria-checked', el.dataset.theme === theme);
    });
    this.current = theme;
  }
  bind() {
    document.querySelectorAll('.theme-option').forEach(el => {
      el.addEventListener('click', () => this.apply(el.dataset.theme));
    });
  }
}
```

## Scroll Animations

```javascript
// Intersection Observer for scroll reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
```

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```