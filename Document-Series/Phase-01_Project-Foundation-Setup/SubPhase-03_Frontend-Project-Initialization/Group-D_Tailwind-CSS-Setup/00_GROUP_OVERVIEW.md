# Group D: Tailwind CSS Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** D of G  
> **Tasks Covered:** 31-45  
> **Group Goal:** Configure Tailwind CSS with custom design tokens

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_TypeScript-Configuration/](../Group-C_TypeScript-Configuration/)
- **→ Next Group:** [../Group-E_Folder-Structure-Setup/](../Group-E_Folder-Structure-Setup/)

---

## Group Overview

This group sets up Tailwind CSS with PostCSS, configures a custom design system with colors, fonts, spacing, and breakpoints, and creates global stylesheets. The configuration supports dark mode for both ERP and Webstore interfaces.

### Key Outcomes
- Tailwind CSS 3.x installed with PostCSS and Autoprefixer
- Custom theme with LankaCommerce brand colors
- Typography and spacing scales defined
- Dark mode with class-based switching
- Global CSS files with Tailwind directives and custom properties

### Technology Context
- **Tailwind Version:** 3.x
- **PostCSS Plugins:** Tailwind, Autoprefixer
- **Dark Mode:** Class-based (`dark:` variants)
- **Config Format:** TypeScript (tailwind.config.ts)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-31-36_Tailwind-Install.md | 31-36 | Install Tailwind, PostCSS, create config, colors |
| 02 | 02_Tasks-37-41_Theme-Config.md | 37-41 | Configure fonts, spacing, breakpoints, dark mode, PostCSS |
| 03 | 03_Tasks-42-45_Global-Styles.md | 42-45 | Create globals.css, variables.css, animations, import in layout |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 31 | Install Tailwind CSS | Task 09 | Simple |
| 32 | Install PostCSS | Task 31 | Simple |
| 33 | Install Autoprefixer | Task 32 | Simple |
| 34 | Create tailwind.config.ts | Task 31 | Medium |
| 35 | Configure Content Paths | Task 34 | Simple |
| 36 | Configure Theme - Colors | Task 34 | Medium |
| 37 | Configure Theme - Fonts | Task 34 | Simple |
| 38 | Configure Theme - Spacing | Task 34 | Simple |
| 39 | Configure Theme - Breakpoints | Task 34 | Simple |
| 40 | Configure Dark Mode | Task 34 | Simple |
| 41 | Create postcss.config.js | Task 32 | Simple |
| 42 | Create styles/globals.css | Task 34 | Medium |
| 43 | Create styles/variables.css | Task 42 | Medium |
| 44 | Create styles/animations.css | Task 42 | Simple |
| 45 | Import Global Styles | Tasks 42, 15 | Simple |

---

## Execution Order

```
01_Tasks-31-36_Tailwind-Install.md
        │
        ▼
02_Tasks-37-41_Theme-Config.md
        │
        ▼
03_Tasks-42-45_Global-Styles.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── postcss.config.js        # PostCSS configuration
├── styles/
│   ├── animations.css       # Custom CSS animations
│   ├── globals.css          # Global styles with Tailwind
│   └── variables.css        # CSS custom properties
└── tailwind.config.ts       # Tailwind configuration
```

---

## Design Token Overview

**Colors:**
- Primary: Brand colors for LankaCommerce
- Secondary: Accent colors
- Neutral: Gray scale
- Semantic: Success, Warning, Error, Info

**Typography:**
- Font families: Sans (Inter), Mono
- Font sizes: xs to 4xl scale
- Font weights: light to bold

**Spacing:**
- Extended scale for larger components
- Consistent 4px grid system

---

## Notes for AI Agents

1. **Dependencies:** Requires Next.js installed (Task 09)
2. **Config Format:** Use TypeScript config (tailwind.config.ts)
3. **Content Paths:** Include all component file locations
4. **Dark Mode:** Use class-based for manual control
5. **CSS Variables:** Define in :root for theme consistency
6. **Git Commit:** Commit after completing this group
