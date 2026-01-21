# Group A: Tailwind Installation & Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and configure Tailwind CSS with PostCSS, plugins, and global styles

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Color-System-Design-Tokens](../Group-B_Color-System-Design-Tokens/)

---

## Group Overview

This group installs Tailwind CSS with PostCSS and Autoprefixer, initializes configuration files, and sets up the global CSS structure. Configures content paths for Tailwind to scan TypeScript/React files. Creates the three-layer CSS structure (base, components, utilities) in globals.css. Installs Tailwind plugins for typography, forms, and aspect-ratio. Verifies the installation by testing Tailwind classes in a component.

### Key Outcomes

- Tailwind CSS installed (tailwindcss, postcss, autoprefixer)
- tailwind.config.js initialized
- Content paths configured for .tsx, .ts files
- postcss.config.js created
- styles/globals.css with Tailwind directives
- @tailwind base configured
- @tailwind components configured
- @tailwind utilities configured
- globals.css imported in root layout
- @tailwindcss/typography plugin installed
- @tailwindcss/forms plugin installed
- @tailwindcss/aspect-ratio plugin installed
- All plugins configured in tailwind.config.js
- Installation verified with test component

### Technology Context

- **Tailwind CSS:** 3.x
- **PostCSS:** CSS transformation
- **Autoprefixer:** Vendor prefix handling
- **Plugins:** typography, forms, aspect-ratio

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Install-Config-CSS.md` | Install Tailwind and create CSS structure | 01-08 |
| 02 | `02_Tasks-09-14_Plugins-Verification.md` | Import CSS, install plugins, and verify | 09-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install Tailwind CSS | Low | SubPhase-01 |
| 02 | Initialize Tailwind Config | Low | Task 01 |
| 03 | Configure Content Paths | Low | Task 02 |
| 04 | Create postcss.config.js | Low | Task 01 |
| 05 | Create Global CSS File | Low | Task 02 |
| 06 | Configure Tailwind Base Layer | Low | Task 05 |
| 07 | Configure Tailwind Components Layer | Low | Task 05 |
| 08 | Configure Tailwind Utilities Layer | Low | Task 05 |
| 09 | Import Global CSS in Layout | Low | Task 05 |
| 10 | Install Tailwind Typography Plugin | Low | Task 01 |
| 11 | Install Tailwind Forms Plugin | Low | Task 01 |
| 12 | Install Tailwind Aspect Ratio Plugin | Low | Task 01 |
| 13 | Configure Plugins in tailwind.config.js | Low | Tasks 10-12 |
| 14 | Verify Tailwind Installation | Low | Task 09 |

---

## Execution Order

```
Task 01: Install Tailwind CSS
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      ▼
Task 02               Task 04              Tasks 10-12
(init config)         (postcss)            (plugins)
    │                      │                      │
    ▼                      │                      │
Task 03: Content Paths     │                      │
    │                      │                      │
    ▼                      │                      │
Task 05: Create globals.css│                      │
    │                      │                      │
    ├─────────────────────────────────────────────┘
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      ▼
Task 06               Task 07               Task 08
(base layer)          (components)          (utilities)
    │                      │                      │
    └──────────────────────┴──────────────────────┘
                           │
                           ▼
                      Task 09: Import in Layout
                           │
                           ▼
                      Task 13: Configure Plugins
                           │
                           ▼
                      Task 14: Verify Installation
```

---

## Expected Deliverables

```
frontend/
├── styles/
│   └── globals.css         # Tailwind directives
├── postcss.config.js       # PostCSS configuration
└── tailwind.config.js      # Tailwind configuration
```

---

## Notes for AI Agents

### Installation Command (Task 01)
```bash
pnpm add -D tailwindcss postcss autoprefixer
```

### Initialize Command (Task 02)
```bash
pnpx tailwindcss init -p
```

### Content Paths (Task 03)
```js
content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### postcss.config.js Structure
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### globals.css Structure (Tasks 05-08)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Plugin Installation Commands
| Plugin | Command |
|--------|---------|
| Typography | pnpm add -D @tailwindcss/typography |
| Forms | pnpm add -D @tailwindcss/forms |
| Aspect Ratio | pnpm add -D @tailwindcss/aspect-ratio |

### Plugins Configuration (Task 13)
```js
plugins: [
  require('@tailwindcss/typography'),
  require('@tailwindcss/forms'),
  require('@tailwindcss/aspect-ratio'),
]
```

### Verification Test (Task 14)
- Add a div with Tailwind classes
- Check browser output
- Verify hot reload works
