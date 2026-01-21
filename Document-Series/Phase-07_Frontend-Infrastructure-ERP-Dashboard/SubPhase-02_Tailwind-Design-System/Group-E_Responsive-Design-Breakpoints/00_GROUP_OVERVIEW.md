# Group E: Responsive Design & Breakpoints

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** E of F  
> **Tasks Covered:** 59-72  
> **Group Goal:** Configure responsive breakpoints and create responsive utility patterns

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Spacing-Layout-System](../Group-D_Spacing-Layout-System/)
- **→ Next Group:** [Group-F_Animations-Utilities-GlobalStyles](../Group-F_Animations-Utilities-GlobalStyles/)

---

## Group Overview

This group configures responsive breakpoints and creates responsive patterns for the ERP dashboard. Defines screen breakpoints from tablet (md: 768px) to ultra-wide (2xl: 1536px). Ensures mobile-first approach for all utilities. Creates responsive variants for typography, spacing, and grid layouts. Implements specific patterns for sidebar collapse, table scrolling, and card stacking. Adds print styles for reports and receipts.

### Key Outcomes

- Screen breakpoints configured (sm, md, lg, xl, 2xl)
- Tablet breakpoint (768px)
- Desktop breakpoint (1024px)
- Wide desktop breakpoint (1280px)
- Ultra-wide breakpoint (1536px)
- Mobile-first utilities
- Responsive typography utilities
- Responsive spacing utilities
- Responsive grid utilities
- Sidebar responsive behavior
- Table responsive patterns
- Card stack patterns
- Print media styles
- Responsive documentation

### Technology Context

- **Approach:** Mobile-first
- **Breakpoints:** Tailwind default scale
- **Media Queries:** min-width (mobile-first)
- **Print:** @media print

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-59-66_Breakpoints-Utilities.md` | Configure breakpoints and responsive utilities | 59-66 |
| 02 | `02_Tasks-67-72_Patterns-Print-Docs.md` | Create responsive patterns and print styles | 67-72 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 59 | Configure Screen Breakpoints | Low | Task 02 |
| 60 | Configure Tablet Breakpoint (md) | Low | Task 59 |
| 61 | Configure Desktop Breakpoint (lg) | Low | Task 59 |
| 62 | Configure Wide Desktop Breakpoint (xl) | Low | Task 59 |
| 63 | Configure 2XL Breakpoint | Low | Task 59 |
| 64 | Create Mobile-First Utilities | Low | Task 59 |
| 65 | Create Responsive Typography Utilities | Low | Tasks 34, 59 |
| 66 | Create Responsive Spacing Utilities | Low | Tasks 46, 59 |
| 67 | Create Responsive Grid Utilities | Low | Tasks 54, 59 |
| 68 | Create Sidebar Responsive Behavior | Medium | Task 59 |
| 69 | Create Table Responsive Patterns | Medium | Task 59 |
| 70 | Create Card Stack Patterns | Low | Task 59 |
| 71 | Create Print Styles | Medium | Task 02 |
| 72 | Create Responsive Documentation | Low | Task 71 |

---

## Execution Order

```
Task 59: Configure Screen Breakpoints
    │
    ├──────────────────────────────────────────────────────┐
    ▼                                                      ▼
Tasks 60-63: Breakpoint Values                        Task 64
(md, lg, xl, 2xl)                                     (mobile-first)
    │                                                      │
    └──────────────────────┬───────────────────────────────┘
                           ▼
                      Tasks 65-66: Responsive Utilities
                      (typography, spacing)
                           │
                           ▼
                      Task 67: Responsive Grid
                           │
                           ├──────────────────────┐
                           ▼                      ▼
                      Task 68               Tasks 69-70
                      (sidebar)             (table, cards)
                           │                      │
                           └──────────┬───────────┘
                                      ▼
                                 Task 71: Print Styles
                                      │
                                      ▼
                                 Task 72: Documentation
```

---

## Expected Deliverables

```
frontend/
├── styles/
│   └── globals.css         # Print styles
├── tailwind.config.js      # Breakpoints
└── docs/
    └── design-system/
        └── responsive.md   # Responsive documentation
```

---

## Notes for AI Agents

### Breakpoint Values
| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Desktops |
| xl | 1280px | Wide desktops |
| 2xl | 1536px | Ultra-wide |

### Mobile-First Example (Task 64)
```html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

### Responsive Typography (Task 65)
| Breakpoint | H1 Size | Body Size |
|------------|---------|-----------|
| Default | text-3xl | text-sm |
| md | text-4xl | text-base |
| lg | text-5xl | text-base |

### Responsive Spacing (Task 66)
| Breakpoint | Section Padding | Container Width |
|------------|-----------------|-----------------|
| Default | p-4 | w-full |
| md | p-6 | max-w-md |
| lg | p-8 | max-w-lg |

### Sidebar Behavior (Task 68)
| Breakpoint | Behavior |
|------------|----------|
| Default | Hidden (mobile drawer) |
| md | Collapsed (icons only) |
| lg | Expanded (full sidebar) |

### Table Patterns (Task 69)
- Horizontal scroll on mobile
- Stack cells on small screens
- Fixed header on scroll
- Responsive column visibility

### Card Stack Patterns (Task 70)
| Breakpoint | Layout |
|------------|--------|
| Default | Stack (1 column) |
| md | 2 columns |
| lg | 3 columns |
| xl | 4 columns |

### Print Styles (Task 71)
- Hide navigation, sidebar
- Use print-friendly fonts
- Remove backgrounds
- Page break control
- Invoice/receipt formatting
