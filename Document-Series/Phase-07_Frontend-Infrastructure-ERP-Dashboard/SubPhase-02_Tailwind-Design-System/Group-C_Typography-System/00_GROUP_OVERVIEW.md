# Group C: Typography System

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** C of F  
> **Tasks Covered:** 31-44  
> **Group Goal:** Configure comprehensive typography system with font families, scales, and text styles

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Color-System-Design-Tokens](../Group-B_Color-System-Design-Tokens/)
- **→ Next Group:** [Group-D_Spacing-Layout-System](../Group-D_Spacing-Layout-System/)

---

## Group Overview

This group establishes the typography system for LankaCommerce Cloud. Installs Inter as the primary font using Next.js font optimization. Configures font family in Tailwind with system font fallbacks. Defines comprehensive font size, line height, weight, and letter spacing scales. Creates default heading and body text styles in the base layer. Configures the typography plugin for prose content and adds text utility classes.

### Key Outcomes

- Inter font installed (next/font)
- Font family configured in Tailwind
- System font fallbacks defined
- Font size scale (xs to 6xl)
- Line height scale for all sizes
- Font weight scale (light to bold)
- Letter spacing scale
- H1-H6 heading styles
- Body text styles
- Caption/small text styles
- Prose styles customized
- Monospace font configured
- Text truncation utilities
- Typography documentation

### Technology Context

- **Font Loading:** Next.js next/font (optimized)
- **Primary Font:** Inter
- **Fallback:** System font stack
- **Plugin:** @tailwindcss/typography for prose

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-38_Font-Setup-Headings.md` | Install fonts and create heading styles | 31-38 |
| 02 | `02_Tasks-39-44_Body-Prose-Utilities.md` | Create body styles, prose config, and utilities | 39-44 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Install Inter Font | Low | Task 05 |
| 32 | Configure Font Family in Tailwind | Low | Task 31 |
| 33 | Configure Fallback Font Stack | Low | Task 32 |
| 34 | Define Font Size Scale | Low | Task 02 |
| 35 | Define Line Height Scale | Low | Task 34 |
| 36 | Define Font Weight Scale | Low | Task 02 |
| 37 | Define Letter Spacing Scale | Low | Task 02 |
| 38 | Create Heading Styles | Medium | Tasks 34-36 |
| 39 | Create Body Text Styles | Low | Tasks 34-36 |
| 40 | Create Caption/Small Text Styles | Low | Task 34 |
| 41 | Configure Prose Styles | Medium | Task 10 |
| 42 | Create Monospace Font Config | Low | Task 02 |
| 43 | Create Text Truncation Utilities | Low | Task 02 |
| 44 | Create Typography Documentation | Low | Task 43 |

---

## Execution Order

```
Task 31: Install Inter Font
    │
    ▼
Task 32: Configure Font Family
    │
    ▼
Task 33: Fallback Font Stack
    │
    ├───────────────────────────────────────────────────┐
    ▼                                                   ▼
Tasks 34-37                                        Task 42
(scales: size, height, weight, spacing)            (monospace)
    │                                                   │
    └───────────────────────┬───────────────────────────┘
                            ▼
                       Task 38: Heading Styles
                            │
                            ├──────────────────────┐
                            ▼                      ▼
                       Task 39               Tasks 40-41
                       (body text)           (captions, prose)
                            │                      │
                            └──────────┬───────────┘
                                       ▼
                                  Task 43: Truncation Utilities
                                       │
                                       ▼
                                  Task 44: Documentation
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── layout.tsx          # Font import
├── styles/
│   └── globals.css         # Typography base styles
├── tailwind.config.js      # Typography configuration
└── docs/
    └── design-system/
        └── typography.md   # Typography documentation
```

---

## Notes for AI Agents

### Inter Font Setup (Task 31)
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

### Font Family Configuration (Tasks 32-33)
```js
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)', ...fontFamily.sans],
      mono: ['Fira Code', 'Consolas', 'monospace'],
    }
  }
}
```

### Font Size Scale (Task 34)
| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 0.75rem (12px) | 1rem (16px) | Captions |
| sm | 0.875rem (14px) | 1.25rem (20px) | Small text |
| base | 1rem (16px) | 1.5rem (24px) | Body |
| lg | 1.125rem (18px) | 1.75rem (28px) | Large body |
| xl | 1.25rem (20px) | 1.75rem (28px) | H5 |
| 2xl | 1.5rem (24px) | 2rem (32px) | H4 |
| 3xl | 1.875rem (30px) | 2.25rem (36px) | H3 |
| 4xl | 2.25rem (36px) | 2.5rem (40px) | H2 |
| 5xl | 3rem (48px) | 1 | H1 |
| 6xl | 3.75rem (60px) | 1 | Display |

### Font Weight Scale (Task 36)
| Name | Value | Usage |
|------|-------|-------|
| light | 300 | Subtle text |
| normal | 400 | Body text |
| medium | 500 | Emphasis |
| semibold | 600 | Headings |
| bold | 700 | Strong emphasis |

### Heading Styles (Task 38)
- H1: text-5xl font-bold
- H2: text-4xl font-bold
- H3: text-3xl font-semibold
- H4: text-2xl font-semibold
- H5: text-xl font-medium
- H6: text-lg font-medium

### Prose Configuration (Task 41)
- Customize heading styles
- Adjust paragraph spacing
- Configure link colors
- Set code block styling

### Text Truncation Utilities (Task 43)
- truncate: Single line ellipsis
- line-clamp-2: 2 lines with ellipsis
- line-clamp-3: 3 lines with ellipsis
