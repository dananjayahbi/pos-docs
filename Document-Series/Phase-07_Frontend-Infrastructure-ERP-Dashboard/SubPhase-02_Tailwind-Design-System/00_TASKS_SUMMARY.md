# SubPhase 02: Tailwind & Design System - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 02 of 14  
> **SubPhase Goal:** Configure Tailwind CSS with custom design tokens, typography system, and responsive design framework  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 6-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_NextJS-Project-Setup](../SubPhase-01_NextJS-Project-Setup/)
- **→ Next SubPhase:** [SubPhase-03_Component-Library-Setup](../SubPhase-03_Component-Library-Setup/)

---

## SubPhase Overview

This sub-phase establishes the visual foundation for LankaCommerce Cloud's frontend. It configures Tailwind CSS with custom design tokens, creates a consistent typography system, and sets up responsive design patterns. The design system ensures visual consistency across all ERP dashboard interfaces.

### Key Outcomes
- Tailwind CSS configured with custom theme
- Design tokens defined (colors, spacing, typography)
- Responsive breakpoints configured for tablet/desktop
- Dark mode support structure ready
- CSS variables for dynamic theming
- Animation utilities defined
- Global styles and reset configured

### Technology Context
- **CSS Framework:** Tailwind CSS 3.x
- **PostCSS:** For processing and optimization
- **CSS Variables:** For dynamic theming and dark mode
- **Font:** Inter (primary), system fonts (fallback)

### Design Specifications
- **Primary Color:** #2563eb (Blue)
- **Secondary Color:** #64748b (Slate)
- **Success:** #22c55e (Green)
- **Warning:** #f59e0b (Amber)
- **Error:** #ef4444 (Red)
- **Border Radius:** 6px (default)
- **Base Font Size:** 16px

---

## Task Execution Order

```
TASK GROUP A: Tailwind Installation & Configuration (Tasks 01-14)
        │
        ▼
TASK GROUP B: Color System & Design Tokens (Tasks 15-30)
        │
        ▼
TASK GROUP C: Typography System (Tasks 31-44)
        │
        ▼
TASK GROUP D: Spacing & Layout System (Tasks 45-58)
        │
        ▼
TASK GROUP E: Responsive Design & Breakpoints (Tasks 59-72)
        │
        ▼
TASK GROUP F: Animations, Utilities & Global Styles (Tasks 73-86)
```

---

## Task Index

### Group A: Tailwind Installation & Configuration (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install Tailwind CSS** | Add tailwindcss, postcss, autoprefixer as dev dependencies | SubPhase-01 | 🔴 Not Created |
| 02 | **Initialize Tailwind Config** | Run npx tailwindcss init -p to create config files | Task 01 | 🔴 Not Created |
| 03 | **Configure Content Paths** | Set up content array for Tailwind to scan .tsx, .ts files | Task 02 | 🔴 Not Created |
| 04 | **Create postcss.config.js** | Configure PostCSS with Tailwind and Autoprefixer plugins | Task 01 | 🔴 Not Created |
| 05 | **Create Global CSS File** | Set up styles/globals.css with Tailwind directives | Task 02 | 🔴 Not Created |
| 06 | **Configure Tailwind Base Layer** | Add @tailwind base with CSS reset | Task 05 | 🔴 Not Created |
| 07 | **Configure Tailwind Components Layer** | Add @tailwind components for component classes | Task 05 | 🔴 Not Created |
| 08 | **Configure Tailwind Utilities Layer** | Add @tailwind utilities for utility classes | Task 05 | 🔴 Not Created |
| 09 | **Import Global CSS in Layout** | Import globals.css in root layout.tsx | Task 05 | 🔴 Not Created |
| 10 | **Install Tailwind Typography Plugin** | Add @tailwindcss/typography for prose styling | Task 01 | 🔴 Not Created |
| 11 | **Install Tailwind Forms Plugin** | Add @tailwindcss/forms for form element styling | Task 01 | 🔴 Not Created |
| 12 | **Install Tailwind Aspect Ratio Plugin** | Add @tailwindcss/aspect-ratio for media containers | Task 01 | 🔴 Not Created |
| 13 | **Configure Plugins in tailwind.config.js** | Add all installed plugins to config | Task 10-12 | 🔴 Not Created |
| 14 | **Verify Tailwind Installation** | Test Tailwind classes work in a sample component | Task 09 | 🔴 Not Created |

---

### Group B: Color System & Design Tokens (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Define CSS Custom Properties** | Create :root CSS variables for all design tokens | Task 05 | 🔴 Not Created |
| 16 | **Configure Primary Color Palette** | Define primary color with shades (50-950) | Task 15 | 🔴 Not Created |
| 17 | **Configure Secondary Color Palette** | Define secondary/slate color with shades | Task 15 | 🔴 Not Created |
| 18 | **Configure Success Color Palette** | Define success/green color with shades | Task 15 | 🔴 Not Created |
| 19 | **Configure Warning Color Palette** | Define warning/amber color with shades | Task 15 | 🔴 Not Created |
| 20 | **Configure Error Color Palette** | Define error/red color with shades | Task 15 | 🔴 Not Created |
| 21 | **Configure Info Color Palette** | Define info/blue color with shades | Task 15 | 🔴 Not Created |
| 22 | **Define Background Colors** | Configure background, card, popover, muted colors | Task 15 | 🔴 Not Created |
| 23 | **Define Foreground Colors** | Configure text, muted-foreground, accent-foreground | Task 15 | 🔴 Not Created |
| 24 | **Define Border Colors** | Configure border, input, ring colors | Task 15 | 🔴 Not Created |
| 25 | **Configure Dark Mode Colors** | Define .dark class with inverted color scheme | Task 15-24 | 🔴 Not Created |
| 26 | **Extend Tailwind Colors** | Map CSS variables to Tailwind theme.colors | Task 16-24 | 🔴 Not Created |
| 27 | **Create Color Utility Classes** | Add custom color utilities (text-primary, bg-primary) | Task 26 | 🔴 Not Created |
| 28 | **Configure Chart Colors** | Define colors for data visualization charts | Task 15 | 🔴 Not Created |
| 29 | **Configure Status Colors** | Define colors for order/payment/stock statuses | Task 15 | 🔴 Not Created |
| 30 | **Create Color Documentation** | Document all color tokens and usage guidelines | Task 29 | 🔴 Not Created |

---

### Group C: Typography System (Tasks 31-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Install Inter Font** | Add @fontsource/inter or next/font for Inter | Task 05 | 🔴 Not Created |
| 32 | **Configure Font Family in Tailwind** | Set Inter as default sans font family | Task 31 | 🔴 Not Created |
| 33 | **Configure Fallback Font Stack** | Define system font fallbacks for performance | Task 32 | 🔴 Not Created |
| 34 | **Define Font Size Scale** | Configure fontSize with responsive sizes (xs to 6xl) | Task 02 | 🔴 Not Created |
| 35 | **Define Line Height Scale** | Configure lineHeight for all font sizes | Task 34 | 🔴 Not Created |
| 36 | **Define Font Weight Scale** | Configure fontWeight (light, normal, medium, semibold, bold) | Task 02 | 🔴 Not Created |
| 37 | **Define Letter Spacing Scale** | Configure letterSpacing (tighter to wider) | Task 02 | 🔴 Not Created |
| 38 | **Create Heading Styles** | Define h1-h6 default styles in base layer | Task 34-36 | 🔴 Not Created |
| 39 | **Create Body Text Styles** | Define paragraph and body text styles | Task 34-36 | 🔴 Not Created |
| 40 | **Create Caption/Small Text Styles** | Define styles for labels, captions, helper text | Task 34 | 🔴 Not Created |
| 41 | **Configure Prose Styles** | Customize @tailwindcss/typography for rich content | Task 10 | 🔴 Not Created |
| 42 | **Create Monospace Font Config** | Configure monospace font for code display | Task 02 | 🔴 Not Created |
| 43 | **Create Text Truncation Utilities** | Add utilities for text ellipsis, line clamp | Task 02 | 🔴 Not Created |
| 44 | **Create Typography Documentation** | Document typography scale and usage guidelines | Task 43 | 🔴 Not Created |

---

### Group D: Spacing & Layout System (Tasks 45-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Define Base Spacing Unit** | Configure 4px base spacing unit | Task 02 | 🔴 Not Created |
| 46 | **Extend Spacing Scale** | Add custom spacing values (0.5, 1.5, 2.5, etc.) | Task 45 | 🔴 Not Created |
| 47 | **Configure Max Width Scale** | Define container max-widths (sm to 2xl) | Task 02 | 🔴 Not Created |
| 48 | **Configure Container Settings** | Set up container with center and padding | Task 47 | 🔴 Not Created |
| 49 | **Define Border Radius Scale** | Configure borderRadius (none, sm, md, lg, xl, full) | Task 02 | 🔴 Not Created |
| 50 | **Define Box Shadow Scale** | Configure boxShadow (sm, md, lg, xl, 2xl, inner) | Task 02 | 🔴 Not Created |
| 51 | **Create Card Shadow Utilities** | Define card-specific shadow utilities | Task 50 | 🔴 Not Created |
| 52 | **Create Modal Shadow Utilities** | Define modal/dialog shadow utilities | Task 50 | 🔴 Not Created |
| 53 | **Define Z-Index Scale** | Configure zIndex for layering (dropdown, modal, toast) | Task 02 | 🔴 Not Created |
| 54 | **Create Layout Grid Utilities** | Define grid templates for dashboard layouts | Task 02 | 🔴 Not Created |
| 55 | **Create Flex Gap Utilities** | Define common gap utilities for flex layouts | Task 46 | 🔴 Not Created |
| 56 | **Create Section Spacing Utilities** | Define section padding and margin utilities | Task 46 | 🔴 Not Created |
| 57 | **Create Form Layout Utilities** | Define form field spacing and grouping | Task 46 | 🔴 Not Created |
| 58 | **Create Spacing Documentation** | Document spacing system and usage patterns | Task 57 | 🔴 Not Created |

---

### Group E: Responsive Design & Breakpoints (Tasks 59-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Configure Screen Breakpoints** | Define sm, md, lg, xl, 2xl breakpoints | Task 02 | 🔴 Not Created |
| 60 | **Configure Tablet Breakpoint (md)** | Set 768px breakpoint for tablet landscape | Task 59 | 🔴 Not Created |
| 61 | **Configure Desktop Breakpoint (lg)** | Set 1024px breakpoint for desktop | Task 59 | 🔴 Not Created |
| 62 | **Configure Wide Desktop Breakpoint (xl)** | Set 1280px breakpoint for wide screens | Task 59 | 🔴 Not Created |
| 63 | **Configure 2XL Breakpoint** | Set 1536px breakpoint for ultra-wide screens | Task 59 | 🔴 Not Created |
| 64 | **Create Mobile-First Utilities** | Ensure all utilities follow mobile-first approach | Task 59 | 🔴 Not Created |
| 65 | **Create Responsive Typography Utilities** | Define text size changes across breakpoints | Task 34, 59 | 🔴 Not Created |
| 66 | **Create Responsive Spacing Utilities** | Define spacing changes across breakpoints | Task 46, 59 | 🔴 Not Created |
| 67 | **Create Responsive Grid Utilities** | Define grid column changes across breakpoints | Task 54, 59 | 🔴 Not Created |
| 68 | **Create Sidebar Responsive Behavior** | Define sidebar collapse/expand by breakpoint | Task 59 | 🔴 Not Created |
| 69 | **Create Table Responsive Patterns** | Define horizontal scroll for data tables on mobile | Task 59 | 🔴 Not Created |
| 70 | **Create Card Stack Patterns** | Define card grid to stack behavior | Task 59 | 🔴 Not Created |
| 71 | **Create Print Styles** | Configure print media query styles | Task 02 | 🔴 Not Created |
| 72 | **Create Responsive Documentation** | Document responsive patterns and breakpoint usage | Task 71 | 🔴 Not Created |

---

### Group F: Animations, Utilities & Global Styles (Tasks 73-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Define Transition Duration Scale** | Configure transitionDuration (75, 100, 150, 200, 300) | Task 02 | 🔴 Not Created |
| 74 | **Define Transition Timing Functions** | Configure transitionTimingFunction (ease-in-out, etc.) | Task 02 | 🔴 Not Created |
| 75 | **Create Fade Animation** | Define keyframes and animate-fade utility | Task 73 | 🔴 Not Created |
| 76 | **Create Slide Animations** | Define slide-in-up, slide-in-down, slide-in-left, slide-in-right | Task 73 | 🔴 Not Created |
| 77 | **Create Scale Animation** | Define scale-in animation for modals | Task 73 | 🔴 Not Created |
| 78 | **Create Spin Animation** | Define spin animation for loading states | Task 73 | 🔴 Not Created |
| 79 | **Create Pulse Animation** | Define pulse animation for skeleton loaders | Task 73 | 🔴 Not Created |
| 80 | **Create Shake Animation** | Define shake animation for error states | Task 73 | 🔴 Not Created |
| 81 | **Configure Focus Ring Styles** | Define consistent focus ring styles for accessibility | Task 24 | 🔴 Not Created |
| 82 | **Create Disabled State Styles** | Define consistent disabled state opacity and cursor | Task 02 | 🔴 Not Created |
| 83 | **Create Scrollbar Styles** | Customize scrollbar appearance for webkit browsers | Task 05 | 🔴 Not Created |
| 84 | **Create Selection Styles** | Configure text selection highlight colors | Task 05 | 🔴 Not Created |
| 85 | **Create Global Body Styles** | Define body background, font, antialiasing | Task 05 | 🔴 Not Created |
| 86 | **Final Verification & Documentation** | Test all utilities, create style guide documentation | Task 85 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── styles/
│   └── globals.css          # Main CSS with Tailwind directives
├── tailwind.config.js       # Complete Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── docs/
    └── design-system/
        ├── colors.md        # Color documentation
        ├── typography.md    # Typography documentation
        ├── spacing.md       # Spacing documentation
        └── responsive.md    # Responsive documentation
```

---

## Key Configuration References

### CSS Custom Properties Structure
```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.375rem;

  /* Chart Colors */
  --chart-1: 221 83% 53%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... inverted colors */
}
```

### Tailwind Extend Configuration Highlights
- Custom colors mapped to CSS variables
- Extended spacing scale (4px base unit)
- Custom font family (Inter)
- Animation keyframes and durations
- Box shadow scale for cards/modals
- Z-index scale for layering
- Responsive breakpoints (768, 1024, 1280, 1536)

### Typography Scale
| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 12px | 16px | Captions, labels |
| sm | 14px | 20px | Body small, buttons |
| base | 16px | 24px | Body text |
| lg | 18px | 28px | Large body |
| xl | 20px | 28px | H5 headings |
| 2xl | 24px | 32px | H4 headings |
| 3xl | 30px | 36px | H3 headings |
| 4xl | 36px | 40px | H2 headings |
| 5xl | 48px | 1 | H1 headings |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 86 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **CSS Variables:** Use HSL color format without hsl() wrapper for Tailwind compatibility
3. **Dark Mode:** Implement using CSS class strategy (.dark) for easy toggling
4. **Mobile First:** All responsive utilities should be mobile-first (min-width breakpoints)
5. **Plugin Order:** Install all plugins before configuring them in tailwind.config.js
6. **Performance:** Avoid unused CSS by properly configuring content paths
7. **Consistency:** Use design tokens (CSS variables) instead of hardcoded values
8. **Accessibility:** Ensure sufficient color contrast ratios (4.5:1 for text)
9. **Dependencies:** This sub-phase depends on SubPhase-01 (Next.js Project Setup) completion
10. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
