# Group B: Color System & Design Tokens

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Define comprehensive color system with CSS custom properties, palettes, and dark mode support

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Tailwind-Installation-Configuration](../Group-A_Tailwind-Installation-Configuration/)
- **→ Next Group:** [Group-C_Typography-System](../Group-C_Typography-System/)

---

## Group Overview

This group establishes the complete color system for LankaCommerce Cloud using CSS custom properties mapped to Tailwind theme. Defines color palettes for primary, secondary, success, warning, error, and info states with full shade ranges (50-950). Configures semantic colors for backgrounds, foregrounds, borders, and inputs. Implements dark mode color scheme with inverted values. Adds specialized colors for charts and status indicators.

### Key Outcomes

- CSS custom properties in :root
- Primary color palette (blue, 50-950)
- Secondary color palette (slate, 50-950)
- Success color palette (green)
- Warning color palette (amber)
- Error color palette (red)
- Info color palette (blue variant)
- Background colors (background, card, popover, muted)
- Foreground colors (text, muted-foreground, accent-foreground)
- Border colors (border, input, ring)
- Dark mode (.dark) color scheme
- Tailwind theme extended with CSS variables
- Custom color utility classes
- Chart visualization colors
- Status indicator colors
- Color documentation

### Technology Context

- **CSS Variables:** HSL format for flexibility
- **Tailwind:** theme.extend.colors mapping
- **Dark Mode:** class-based (.dark)
- **Shadcn/UI:** Compatible color system

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-24_CSS-Variables-Palettes.md` | Define CSS variables and color palettes | 15-24 |
| 02 | `02_Tasks-25-30_DarkMode-Utilities-Docs.md` | Configure dark mode, utilities, and documentation | 25-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Define CSS Custom Properties | Medium | Task 05 |
| 16 | Configure Primary Color Palette | Low | Task 15 |
| 17 | Configure Secondary Color Palette | Low | Task 15 |
| 18 | Configure Success Color Palette | Low | Task 15 |
| 19 | Configure Warning Color Palette | Low | Task 15 |
| 20 | Configure Error Color Palette | Low | Task 15 |
| 21 | Configure Info Color Palette | Low | Task 15 |
| 22 | Define Background Colors | Low | Task 15 |
| 23 | Define Foreground Colors | Low | Task 15 |
| 24 | Define Border Colors | Low | Task 15 |
| 25 | Configure Dark Mode Colors | Medium | Tasks 15-24 |
| 26 | Extend Tailwind Colors | Medium | Tasks 16-24 |
| 27 | Create Color Utility Classes | Low | Task 26 |
| 28 | Configure Chart Colors | Low | Task 15 |
| 29 | Configure Status Colors | Low | Task 15 |
| 30 | Create Color Documentation | Low | Task 29 |

---

## Execution Order

```
Task 15: Define CSS Custom Properties
    │
    ├───────────────────────────────────────────────────┐
    ▼                                                   ▼
Tasks 16-21                                       Tasks 22-24
(color palettes)                                  (semantic colors)
    │                                                   │
    └───────────────────────┬───────────────────────────┘
                            ▼
                       Task 25: Dark Mode Colors
                            │
                            ▼
                       Task 26: Extend Tailwind Colors
                            │
                            ├──────────────────────┬───────────┐
                            ▼                      ▼           ▼
                       Task 27             Tasks 28-29    Task 30
                       (utilities)         (chart/status) (docs)
```

---

## Expected Deliverables

```
frontend/
├── styles/
│   └── globals.css         # CSS custom properties
├── tailwind.config.js      # Extended colors
└── docs/
    └── design-system/
        └── colors.md       # Color documentation
```

---

## Notes for AI Agents

### CSS Variable Format (HSL)
- Use HSL format: "222.2 84% 4.9%"
- No hsl() wrapper in variable value
- Apply with: hsl(var(--primary))

### Primary Color Palette (Task 16)
| Shade | HSL | Usage |
|-------|-----|-------|
| 50 | 221 100% 97% | Light backgrounds |
| 100 | 221 100% 94% | Hover states |
| 500 | 221 83% 53% | Primary buttons |
| 600 | 221 83% 47% | Button hover |
| 700 | 221 83% 40% | Button active |

### Semantic Colors (Tasks 22-24)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| background | white | slate-950 | Page background |
| foreground | slate-950 | slate-50 | Text color |
| card | white | slate-900 | Card background |
| border | slate-200 | slate-800 | Borders |

### Dark Mode Implementation (Task 25)
- Use .dark class on html element
- Invert light/dark values
- Maintain contrast ratios

### Tailwind Color Mapping (Task 26)
```js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ...
    }
  }
}
```

### Chart Colors (Task 28)
| Variable | Color | Usage |
|----------|-------|-------|
| chart-1 | Blue | Primary data |
| chart-2 | Green | Secondary data |
| chart-3 | Orange | Tertiary data |
| chart-4 | Purple | Fourth series |
| chart-5 | Pink | Fifth series |

### Status Colors (Task 29)
| Status | Color | Usage |
|--------|-------|-------|
| pending | amber | Awaiting action |
| processing | blue | In progress |
| completed | green | Successfully done |
| cancelled | gray | Cancelled/inactive |
| failed | red | Error state |
