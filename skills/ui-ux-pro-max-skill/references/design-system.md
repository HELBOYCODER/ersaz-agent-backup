# Design System

## Color Palette

```css
:root {
  /* Neutral scale */
  --color-white: #ffffff;
  --color-black: #0a0a0a;
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-300: #d4d4d4;
  --color-gray-400: #a3a3a3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #262626;
  --color-gray-800: #171717;
  --color-gray-900: #0a0a0a;

  /* Single accent - pick one and commit */
  --color-accent: #6366f1;     /* indigo */
  --color-accent-hover: #4f46e5;
  --color-accent-soft: #eef2ff;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Backgrounds */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-gray-50);
  --bg-tertiary: var(--color-gray-100);

  /* Text */
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --text-muted: var(--color-gray-500);

  /* Borders */
  --border-color: var(--color-gray-200);
  --border-strong: var(--color-gray-300);
}

[data-theme="dark"] {
  --color-white: #0a0a0a;
  --color-black: #ffffff;
  --color-gray-50: #0a0a0a;
  --color-gray-100: #171717;
  --color-gray-200: #262626;
  --color-gray-300: #333333;
  --color-gray-400: #404040;
  --color-gray-500: #525252;
  --color-gray-600: #737373;
  --color-gray-700: #a3a3a3;
  --color-gray-800: #d4d4d4;
  --color-gray-900: #f5f5f5;

  --bg-primary: var(--color-gray-900);
  --bg-secondary: var(--color-gray-800);
  --bg-tertiary: var(--color-gray-700);

  --text-primary: var(--color-white);
  --text-secondary: var(--color-gray-300);
  --text-muted: var(--color-gray-400);

  --border-color: var(--color-gray-700);
  --border-strong: var(--color-gray-600);
}
```

## Typography Scale

```css
:root {
  --font-display: 'Outfit', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Scale (modular scale ~1.25) */
  --text-xs: 0.75rem;         /* 12px */
  --text-sm: 0.875rem;        /* 14px */
  --text-base: 1rem;          /* 16px */
  --text-lg: 1.125rem;        /* 18px */
  --text-xl: 1.25rem;         /* 20px */
  --text-2xl: 1.5rem;         /* 24px */
  --text-3xl: 1.875rem;       /* 30px */
  --text-4xl: 2.25rem;        /* 36px */
  --text-5xl: 3rem;           /* 48px */
  --text-6xl: 3.75rem;        /* 60px */
  --text-7xl: 4.5rem;         /* 72px */

  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

## Spacing Scale (8pt grid)

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-32: 8rem;       /* 128px */
}
```

## Shadows

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.16);
}
```

## Transitions

```css
:root {
  --transition-fast: 100ms ease-in-out;
  --transition-normal: 200ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  --transition-spring: 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-nav: 10;
  --z-dropdown: 20;
  --z-sticky: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-toast: 70;
  --z-fixed: 80;
  --z-max: 90;
}
```