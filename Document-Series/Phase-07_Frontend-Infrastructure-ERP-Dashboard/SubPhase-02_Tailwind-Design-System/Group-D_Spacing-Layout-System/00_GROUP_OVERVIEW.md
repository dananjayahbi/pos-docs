# Group D: Spacing & Layout System

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** D of F  
> **Tasks Covered:** 45-58  
> **Group Goal:** Configure spacing scale, layout utilities, shadows, and z-index system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Typography-System](../Group-C_Typography-System/)
- **→ Next Group:** [Group-E_Responsive-Design-Breakpoints](../Group-E_Responsive-Design-Breakpoints/)

---

## Group Overview

This group establishes the spacing and layout system for consistent visual rhythm. Defines a 4px base spacing unit with extended scale values. Configures container max-widths and settings. Creates border radius and box shadow scales for visual depth. Defines z-index layers for proper stacking. Adds utility classes for dashboard grids, flex gaps, section spacing, and form layouts.

### Key Outcomes

- 4px base spacing unit
- Extended spacing scale (0.5, 1.5, 2.5, etc.)
- Container max-widths (sm to 2xl)
- Container center and padding
- Border radius scale
- Box shadow scale (sm to 2xl, inner)
- Card shadow utilities
- Modal shadow utilities
- Z-index scale (dropdown, modal, toast)
- Dashboard grid utilities
- Flex gap utilities
- Section spacing utilities
- Form layout utilities
- Spacing documentation

### Technology Context

- **Spacing Unit:** 4px (0.25rem)
- **Shadows:** CSS box-shadow with multiple layers
- **Z-Index:** Defined scale for predictable layering
- **Grid:** CSS Grid for dashboard layouts

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-45-52_Spacing-Shadows.md` | Define spacing, radius, and shadow scales | 45-52 |
| 02 | `02_Tasks-53-58_Layout-Utilities-Docs.md` | Create layout utilities and documentation | 53-58 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 45 | Define Base Spacing Unit | Low | Task 02 |
| 46 | Extend Spacing Scale | Low | Task 45 |
| 47 | Configure Max Width Scale | Low | Task 02 |
| 48 | Configure Container Settings | Low | Task 47 |
| 49 | Define Border Radius Scale | Low | Task 02 |
| 50 | Define Box Shadow Scale | Low | Task 02 |
| 51 | Create Card Shadow Utilities | Low | Task 50 |
| 52 | Create Modal Shadow Utilities | Low | Task 50 |
| 53 | Define Z-Index Scale | Low | Task 02 |
| 54 | Create Layout Grid Utilities | Medium | Task 02 |
| 55 | Create Flex Gap Utilities | Low | Task 46 |
| 56 | Create Section Spacing Utilities | Low | Task 46 |
| 57 | Create Form Layout Utilities | Low | Task 46 |
| 58 | Create Spacing Documentation | Low | Task 57 |

---

## Execution Order

```
Task 45: Define Base Spacing Unit
    │
    ▼
Task 46: Extend Spacing Scale
    │
    ├───────────────────────────────────────────────────┐
    ▼                                                   ▼
Task 47: Max Width Scale                          Task 49: Border Radius
    │                                                   │
    ▼                                                   │
Task 48: Container Settings                             │
    │                                                   │
    ├───────────────────────────────────────────────────┘
    │
    ▼
Task 50: Box Shadow Scale
    │
    ├──────────────────────┐
    ▼                      ▼
Task 51               Task 52
(card shadow)         (modal shadow)
    │                      │
    └──────────┬───────────┘
               ▼
          Task 53: Z-Index Scale
               │
               ├──────────────────────┬──────────────────┐
               ▼                      ▼                  ▼
          Task 54              Tasks 55-56          Task 57
          (grid)               (gap, section)       (form)
               │                      │                  │
               └──────────────────────┴──────────────────┘
                                      │
                                      ▼
                                 Task 58: Documentation
```

---

## Expected Deliverables

```
frontend/
├── tailwind.config.js      # Spacing configuration
└── docs/
    └── design-system/
        └── spacing.md      # Spacing documentation
```

---

## Notes for AI Agents

### Spacing Scale (Tasks 45-46)
| Key | Value | Pixels |
|-----|-------|--------|
| 0.5 | 0.125rem | 2px |
| 1 | 0.25rem | 4px |
| 1.5 | 0.375rem | 6px |
| 2 | 0.5rem | 8px |
| 2.5 | 0.625rem | 10px |
| 3 | 0.75rem | 12px |
| 4 | 1rem | 16px |
| 5 | 1.25rem | 20px |
| 6 | 1.5rem | 24px |
| 8 | 2rem | 32px |
| 10 | 2.5rem | 40px |
| 12 | 3rem | 48px |
| 16 | 4rem | 64px |

### Container Max-Widths (Task 47)
| Size | Width | Usage |
|------|-------|-------|
| sm | 640px | Small content |
| md | 768px | Medium content |
| lg | 1024px | Large content |
| xl | 1280px | Wide content |
| 2xl | 1536px | Full width |

### Border Radius Scale (Task 49)
| Name | Value | Usage |
|------|-------|-------|
| none | 0 | No radius |
| sm | 0.125rem | Subtle |
| DEFAULT | 0.375rem | Standard |
| md | 0.375rem | Same as default |
| lg | 0.5rem | Cards |
| xl | 0.75rem | Large cards |
| 2xl | 1rem | Modals |
| full | 9999px | Circular |

### Box Shadow Scale (Task 50)
| Name | Usage |
|------|-------|
| sm | Subtle elevation |
| DEFAULT | Standard elevation |
| md | Medium elevation |
| lg | Cards, dropdowns |
| xl | Modals |
| 2xl | Floating elements |
| inner | Inset shadows |

### Z-Index Scale (Task 53)
| Name | Value | Usage |
|------|-------|-------|
| dropdown | 50 | Dropdown menus |
| sticky | 100 | Sticky headers |
| fixed | 150 | Fixed elements |
| modal-backdrop | 200 | Modal backdrop |
| modal | 250 | Modal content |
| popover | 300 | Popovers |
| tooltip | 350 | Tooltips |
| toast | 400 | Toast notifications |

### Dashboard Grid (Task 54)
- 12-column grid system
- Auto-fit for responsive cards
- Gap utilities for spacing
