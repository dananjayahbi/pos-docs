# Tasks 37-41: Theme Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** D - Tailwind CSS Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-36_Tailwind-Install.md](01_Tasks-31-36_Tailwind-Install.md)
- **→ Next Document:** [03_Tasks-42-45_Global-Styles.md](03_Tasks-42-45_Global-Styles.md)

---

## Document Overview

This document covers configuring typography, spacing scales, breakpoints, dark mode, and PostCSS configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 37 | Configure Theme - Fonts | Simple |
| 38 | Configure Theme - Spacing | Simple |
| 39 | Configure Theme - Breakpoints | Simple |
| 40 | Configure Dark Mode | Simple |
| 41 | Create postcss.config.js | Simple |

---

## Task 37: Configure Theme - Fonts

### Overview
Configure font families for the application's typography system.

### Dependencies
- Task 34: Create tailwind.config.ts

### Instructions

1. **Define font families**
   - Sans-serif for body text
   - Monospace for code

2. **Use CSS variables**
   - Reference next/font variables

3. **Add to theme.extend**
   - Extend fontFamily object

### Font Families

| Family | Use | Variable |
|--------|-----|----------|
| `sans` | Body text | --font-inter |
| `mono` | Code | --font-mono |
| `display` | Headings | --font-display |

### Configuration Pattern

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'Consolas', 'monospace'],
}
```

### Next/Font Integration

Fonts loaded via next/font:
- Automatic optimization
- No layout shift
- Self-hosted

### Font Scale

Tailwind defaults cover:
| Size | Class |
|------|-------|
| 12px | text-xs |
| 14px | text-sm |
| 16px | text-base |
| 18px | text-lg |
| 20px | text-xl |
| 24px | text-2xl |

### Expected Outcome
- Font families configured
- Variable fonts ready

### Verification Checklist
- [ ] sans font family defined
- [ ] mono font family defined
- [ ] CSS variables referenced

---

## Task 38: Configure Theme - Spacing

### Overview
Configure the spacing scale for padding, margin, and gaps.

### Dependencies
- Task 34: Create tailwind.config.ts

### Instructions

1. **Extend default spacing**
   - Add larger values
   - Add custom values

2. **Use 4px grid**
   - Consistent spacing units

3. **Add component-specific spacing**
   - Container padding
   - Section spacing

### Extended Spacing Values

| Value | Size | Use |
|-------|------|-----|
| 18 | 72px | Section gaps |
| 22 | 88px | Large sections |
| 26 | 104px | Hero sections |
| 30 | 120px | Page sections |

### Configuration Pattern

```typescript
spacing: {
  '18': '4.5rem',
  '22': '5.5rem',
  '26': '6.5rem',
  '30': '7.5rem',
}
```

### Container Spacing

| Context | Spacing |
|---------|---------|
| Card padding | p-4 to p-6 |
| Section | py-12 to py-24 |
| Page | px-4 lg:px-8 |

### Sri Lanka Context

Consider spacing for:
- Dense data tables
- Mobile-first layouts
- Touch targets (44px+)

### Expected Outcome
- Extended spacing scale
- Consistent sizing system

### Verification Checklist
- [ ] Extended spacing added
- [ ] Large values available
- [ ] 4px grid maintained

---

## Task 39: Configure Theme - Breakpoints

### Overview
Configure responsive breakpoints for mobile-first design.

### Dependencies
- Task 34: Create tailwind.config.ts

### Instructions

1. **Review default breakpoints**
   - Tailwind defaults are usually sufficient

2. **Add custom breakpoints if needed**
   - Extend screens object

3. **Document breakpoint strategy**
   - Mobile-first approach

### Default Breakpoints

| Breakpoint | Width | Devices |
|------------|-------|---------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### Custom Breakpoints

| Breakpoint | Width | Purpose |
|------------|-------|---------|
| xs | 475px | Small phones |
| 3xl | 1920px | Full HD |

### Configuration Pattern

```typescript
screens: {
  'xs': '475px',
  // defaults: sm, md, lg, xl, 2xl
  '3xl': '1920px',
}
```

### Mobile-First Strategy

| Pattern | Meaning |
|---------|---------|
| `text-sm md:text-base` | Small default, base on tablet+ |
| `flex-col lg:flex-row` | Column mobile, row desktop |

### POS Considerations

For POS tablet displays:
- md (768px) is common tablet width
- Touch-optimized at this breakpoint

### Expected Outcome
- Responsive breakpoints defined
- Mobile-first ready

### Verification Checklist
- [ ] Breakpoints reviewed
- [ ] Custom breakpoints added if needed
- [ ] Mobile-first documented

---

## Task 40: Configure Dark Mode

### Overview
Configure dark mode with class-based switching for manual control.

### Dependencies
- Task 34: Create tailwind.config.ts

### Instructions

1. **Set darkMode strategy**
   - Use 'class' for manual control

2. **Document dark mode usage**
   - How to toggle
   - Default behavior

3. **Plan dark variants**
   - Color overrides
   - Background changes

### Dark Mode Configuration

```typescript
darkMode: 'class',
```

### Strategies Comparison

| Strategy | Behavior |
|----------|----------|
| `media` | System preference |
| `class` | Manual toggle |
| `selector` | Custom selector |

### Why Class-Based

| Reason | Benefit |
|--------|---------|
| User preference | Override system |
| Persistence | Save choice |
| Transitions | Animate changes |

### Dark Mode Usage

Add to HTML element:
```html
<html class="dark">
```

### Dark Variant Pattern

| Light | Dark |
|-------|------|
| `bg-white` | `dark:bg-gray-900` |
| `text-gray-900` | `dark:text-gray-100` |
| `border-gray-200` | `dark:border-gray-700` |

### Theme Toggle Implementation

Will implement:
- Toggle button in header
- localStorage persistence
- System preference detection

### Expected Outcome
- Dark mode configured
- Class-based switching ready

### Verification Checklist
- [ ] darkMode set to 'class'
- [ ] Dark variants understood
- [ ] Toggle strategy planned

---

## Task 41: Create postcss.config.js

### Overview
Create the PostCSS configuration file with Tailwind and Autoprefixer plugins.

### Dependencies
- Task 32: Install PostCSS

### Instructions

1. **Create postcss.config.js**
   - Create in frontend root

2. **Add Tailwind plugin**
   - Reference tailwindcss

3. **Add Autoprefixer plugin**
   - Add autoprefixer

### File Location

```
frontend/
├── postcss.config.js
├── tailwind.config.ts
└── package.json
```

### PostCSS Configuration

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Alternative Format

Object syntax:
```javascript
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
```

### Plugin Order

| Order | Plugin | Purpose |
|-------|--------|---------|
| 1 | tailwindcss | Process Tailwind |
| 2 | autoprefixer | Add prefixes |

### Future Plugins

May add later:
| Plugin | Purpose |
|--------|---------|
| postcss-import | @import support |
| postcss-nesting | Native nesting |
| cssnano | Minification |

### Expected Outcome
- PostCSS configured
- Plugins registered

### Verification Checklist
- [ ] postcss.config.js exists
- [ ] tailwindcss plugin added
- [ ] autoprefixer plugin added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 37 | Configure Theme - Fonts | Typography system |
| 38 | Configure Theme - Spacing | Spacing scale |
| 39 | Configure Theme - Breakpoints | Responsive design |
| 40 | Configure Dark Mode | Class-based toggle |
| 41 | Create postcss.config.js | PostCSS setup |

### Files Created/Updated

```
frontend/
├── postcss.config.js     # NEW
└── tailwind.config.ts    # UPDATED
```

### tailwind.config.ts Additions

```typescript
{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
}
```

### postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Next Steps
Proceed to [03_Tasks-42-45_Global-Styles.md](03_Tasks-42-45_Global-Styles.md) for global stylesheets.

---

## Notes for AI Agents

1. **Dark Mode:** Use 'class' for manual control
2. **Fonts:** Reference CSS variables from next/font
3. **Spacing:** Extend, don't replace defaults
4. **PostCSS:** Order matters - Tailwind first
5. **Git:** Do NOT commit yet - complete all Group D tasks first
