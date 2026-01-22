# Tasks 42-45: Global Styles

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** D - Tailwind CSS Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-37-41_Theme-Config.md](02_Tasks-37-41_Theme-Config.md)
- **→ Next Group:** [../Group-E_Folder-Structure-Setup/00_GROUP_OVERVIEW.md](../Group-E_Folder-Structure-Setup/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating the global stylesheet structure including Tailwind directives, CSS variables, and animations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 42 | Create globals.css | Medium |
| 43 | Create variables.css | Simple |
| 44 | Create animations.css | Simple |
| 45 | Import Styles in Layout | Simple |

---

## Task 42: Create globals.css

### Overview
Create the main stylesheet with Tailwind directives and base styles.

### Dependencies
- Task 31: Install Tailwind CSS
- Task 32: Install PostCSS

### Instructions

1. **Create globals.css**
   - Create in app/ directory

2. **Add Tailwind directives**
   - @tailwind base
   - @tailwind components
   - @tailwind utilities

3. **Add base styles**
   - Reset defaults
   - Font smoothing

4. **Add custom base layer**
   - Typography defaults
   - Link styles

### File Location

```
frontend/
└── src/
    └── app/
        └── globals.css
```

### Tailwind Directives

| Directive | Purpose |
|-----------|---------|
| @tailwind base | Normalize + base styles |
| @tailwind components | Component classes |
| @tailwind utilities | Utility classes |

### Base Layer Styles

Add to @layer base:
| Element | Styles |
|---------|--------|
| html | Scroll behavior, font |
| body | Antialiasing, colors |
| * | Box-sizing |

### Component Layer

Add to @layer components:
| Component | Purpose |
|-----------|---------|
| .btn | Button base |
| .card | Card container |
| .input | Form inputs |

### Utilities Layer

Add to @layer utilities:
| Utility | Purpose |
|---------|---------|
| .scrollbar-hide | Hide scrollbars |
| .text-balance | Balanced text wrap |

### Dark Mode Styles

Base styles support dark mode:
| Light | Dark |
|-------|------|
| bg-white | dark:bg-gray-950 |
| text-gray-900 | dark:text-gray-50 |

### globals.css Structure

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-white text-gray-900;
    @apply dark:bg-gray-950 dark:text-gray-50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  /* Component styles */
}

@layer utilities {
  /* Custom utilities */
}
```

### Expected Outcome
- globals.css created
- Tailwind directives included
- Base styles configured

### Verification Checklist
- [ ] File exists at app/globals.css
- [ ] All three directives present
- [ ] Base layer configured
- [ ] Dark mode base styles

---

## Task 43: Create variables.css

### Overview
Create CSS custom properties for theme values accessible outside Tailwind.

### Dependencies
- Task 42: Create globals.css

### Instructions

1. **Create variables.css**
   - Create in styles/ directory

2. **Define color variables**
   - Map Tailwind colors to CSS vars

3. **Define spacing variables**
   - Common spacing values

4. **Define animation variables**
   - Duration, easing

### File Location

```
frontend/
└── src/
    └── styles/
        └── variables.css
```

### CSS Variable Structure

| Category | Examples |
|----------|----------|
| Colors | --color-primary |
| Spacing | --spacing-section |
| Animation | --duration-default |
| Typography | --font-size-base |

### Color Variables

```css
:root {
  /* Brand */
  --color-primary: #006D35;
  --color-secondary: #1E40AF;
  
  /* Semantic */
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error: #DC2626;
  
  /* Neutral */
  --color-background: #FFFFFF;
  --color-foreground: #111827;
}

.dark {
  --color-background: #030712;
  --color-foreground: #F9FAFB;
}
```

### Spacing Variables

```css
:root {
  --spacing-section: 6rem;
  --spacing-container: 2rem;
  --spacing-card: 1.5rem;
}
```

### Animation Variables

```css
:root {
  --duration-fast: 150ms;
  --duration-default: 200ms;
  --duration-slow: 300ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Import Order

In globals.css:
```css
@import './variables.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Expected Outcome
- variables.css created
- Theme variables defined
- Dark mode variants

### Verification Checklist
- [ ] File exists at styles/variables.css
- [ ] Color variables defined
- [ ] Dark mode overrides
- [ ] Animation variables

---

## Task 44: Create animations.css

### Overview
Create reusable CSS animations and keyframes for the application.

### Dependencies
- Task 42: Create globals.css
- Task 43: Create variables.css

### Instructions

1. **Create animations.css**
   - Create in styles/ directory

2. **Define keyframes**
   - Common animations

3. **Create animation classes**
   - Utility classes for animations

4. **Add reduced motion support**
   - Respect user preferences

### File Location

```
frontend/
└── src/
    └── styles/
        └── animations.css
```

### Keyframe Definitions

| Animation | Purpose |
|-----------|---------|
| fadeIn | Fade in opacity |
| fadeOut | Fade out opacity |
| slideUp | Slide from bottom |
| slideDown | Slide from top |
| scaleIn | Scale up entrance |
| spin | Loading spinner |
| pulse | Subtle pulse |
| shimmer | Loading skeleton |

### Keyframe Examples

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Animation Classes

```css
.animate-fade-in {
  animation: fadeIn var(--duration-default) var(--ease-default);
}

.animate-slide-up {
  animation: slideUp var(--duration-default) var(--ease-default);
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Import Order

```css
@import './variables.css';
@import './animations.css';

@tailwind base;
```

### Expected Outcome
- animations.css created
- Keyframes defined
- Reduced motion supported

### Verification Checklist
- [ ] File exists at styles/animations.css
- [ ] Common keyframes defined
- [ ] Animation classes created
- [ ] Reduced motion query

---

## Task 45: Import Styles in Layout

### Overview
Import all stylesheets in the root layout to enable global styles.

### Dependencies
- Task 14: Create App Layout
- Task 42: Create globals.css
- Task 43: Create variables.css
- Task 44: Create animations.css

### Instructions

1. **Update globals.css imports**
   - Import variables and animations

2. **Import in root layout**
   - Add import to layout.tsx

3. **Verify styles load**
   - Check browser dev tools

### Import Structure

In globals.css:
```css
/* Import dependencies first */
@import '../styles/variables.css';
@import '../styles/animations.css';

/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base layer styles */
@layer base {
  /* ... */
}
```

### Layout Import

In app/layout.tsx:
```typescript
import './globals.css'
```

### Alternative Import Pattern

For modular organization:
```
frontend/
└── src/
    ├── app/
    │   ├── globals.css
    │   └── layout.tsx
    └── styles/
        ├── variables.css
        ├── animations.css
        └── index.css      # Optional barrel
```

### Import Order Matters

| Order | File | Reason |
|-------|------|--------|
| 1 | variables.css | Variables used everywhere |
| 2 | animations.css | Uses variables |
| 3 | Tailwind base | Consumes CSS vars |
| 4 | Tailwind components | After base |
| 5 | Tailwind utilities | Last |

### Verification Steps

1. Start dev server
2. Open browser DevTools
3. Check computed styles
4. Verify Tailwind classes work
5. Test dark mode toggle

### Expected Outcome
- Styles imported correctly
- All CSS active
- No import errors

### Verification Checklist
- [ ] globals.css imports dependencies
- [ ] layout.tsx imports globals.css
- [ ] Dev server shows styles
- [ ] No console errors

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 42 | Create globals.css | Tailwind directives |
| 43 | Create variables.css | CSS custom properties |
| 44 | Create animations.css | Keyframes & classes |
| 45 | Import Styles in Layout | Style integration |

### Files Created/Updated

```
frontend/
└── src/
    ├── app/
    │   ├── globals.css     # UPDATED
    │   └── layout.tsx      # UPDATED
    └── styles/
        ├── variables.css   # NEW
        └── animations.css  # NEW
```

### globals.css Final Structure

```css
/* Dependencies */
@import '../styles/variables.css';
@import '../styles/animations.css';

/* Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Layers */
@layer base { /* ... */ }
@layer components { /* ... */ }
@layer utilities { /* ... */ }
```

### Group D Complete

All Tailwind CSS setup tasks completed:
- Tailwind + PostCSS + Autoprefixer installed
- tailwind.config.ts configured
- postcss.config.js created
- Global styles structure ready

### Next Steps
Proceed to [../Group-E_Folder-Structure-Setup/00_GROUP_OVERVIEW.md](../Group-E_Folder-Structure-Setup/00_GROUP_OVERVIEW.md) for folder structure setup.

---

## Notes for AI Agents

1. **Import order:** Variables → Animations → Tailwind directives
2. **CSS Variables:** Enable theming outside Tailwind
3. **Reduced Motion:** Accessibility requirement
4. **Dark Mode:** CSS vars switch automatically with .dark class
5. **Git:** Commit after Group D complete
6. **Verification:** Run dev server to test styles load
