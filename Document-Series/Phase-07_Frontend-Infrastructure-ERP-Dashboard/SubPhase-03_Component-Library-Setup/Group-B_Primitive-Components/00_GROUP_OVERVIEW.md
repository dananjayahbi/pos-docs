# Group B: Primitive Components

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** B of F  
> **Tasks Covered:** 15-32  
> **Group Goal:** Install and customize Shadcn/UI primitive components for basic UI elements

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_ShadcnUI-Installation-Configuration](../Group-A_ShadcnUI-Installation-Configuration/)
- **→ Next Group:** [Group-C_Form-Components](../Group-C_Form-Components/)

---

## Group Overview

This group installs and customizes the core primitive components from Shadcn/UI. Adds Button with loading states, icon-only, and size variants plus a ButtonGroup component. Installs form inputs (Input, Textarea, Select) with icon prefixes, clearable options, and async loading support. Adds selection components (Checkbox, RadioGroup, Switch) and display primitives (Label, Badge, Avatar, Separator, Slider). Creates custom variants for status badges and avatar groups.

### Key Outcomes

- Button component with variants
- Button loading state and sizes
- ButtonGroup for grouped actions
- Input with validation states
- Input icon prefix/suffix and clearable
- Textarea with auto-resize
- Select with search and multi-select
- Select async loading and create option
- Checkbox with indeterminate state
- RadioGroup with card variant
- Switch toggle component
- Label for form fields
- Badge with color variants
- Badge status colors (pending, shipped, etc.)
- Avatar with fallback initials
- AvatarGroup for stacked display
- Separator (horizontal/vertical)
- Slider for range inputs

### Technology Context

- **Components:** Shadcn/UI (Radix primitives)
- **Variants:** class-variance-authority (CVA)
- **Styling:** Tailwind CSS classes
- **Accessibility:** Radix UI accessible by default

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-24_Button-Input-Selection.md` | Install Button, Input, and selection components | 15-24 |
| 02 | `02_Tasks-25-32_Display-Primitives.md` | Install display primitives (Badge, Avatar, etc.) | 25-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Install Button Component | Low | Task 14 |
| 16 | Customize Button Variants | Medium | Task 15 |
| 17 | Create Button Group Component | Low | Task 15 |
| 18 | Install Input Component | Low | Task 14 |
| 19 | Customize Input Variants | Medium | Task 18 |
| 20 | Install Textarea Component | Low | Task 14 |
| 21 | Install Select Component | Low | Task 14 |
| 22 | Customize Select Component | Medium | Task 21 |
| 23 | Install Checkbox Component | Low | Task 14 |
| 24 | Install Radio Group Component | Low | Task 14 |
| 25 | Install Switch Component | Low | Task 14 |
| 26 | Install Label Component | Low | Task 14 |
| 27 | Install Badge Component | Low | Task 14 |
| 28 | Customize Badge Variants | Low | Task 27 |
| 29 | Install Avatar Component | Low | Task 14 |
| 30 | Create Avatar Group Component | Low | Task 29 |
| 31 | Install Separator Component | Low | Task 14 |
| 32 | Install Slider Component | Low | Task 14 |

---

## Execution Order

```
Task 15: Install Button
    │
    ├──────────────────────┐
    ▼                      ▼
Task 16               Task 17
(variants)            (ButtonGroup)
    │                      │
    └──────────┬───────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
Task 18              Tasks 20-24
(Input)              (Textarea, Select, Checkbox, Radio)
    │                     │
    ▼                     │
Task 19: Input Variants   │
    │                     │
    └──────────┬──────────┘
               ▼
          Tasks 25-26: Switch, Label
               │
               ▼
          Task 27: Badge
               │
               ▼
          Task 28: Badge Variants
               │
               ▼
          Task 29: Avatar
               │
               ▼
          Task 30: AvatarGroup
               │
               ├──────────────────────┐
               ▼                      ▼
          Task 31               Task 32
          (Separator)           (Slider)
```

---

## Expected Deliverables

```
frontend/components/ui/
├── button.tsx
├── input.tsx
├── textarea.tsx
├── select.tsx
├── checkbox.tsx
├── radio-group.tsx
├── switch.tsx
├── label.tsx
├── badge.tsx
├── avatar.tsx
├── separator.tsx
└── slider.tsx

frontend/components/composite/
├── button-group.tsx
└── avatar-group.tsx
```

---

## Notes for AI Agents

### Button Variants (Task 16)
| Variant | Usage |
|---------|-------|
| default | Primary actions |
| destructive | Delete actions |
| outline | Secondary actions |
| secondary | Tertiary actions |
| ghost | Subtle actions |
| link | Navigation links |

### Button Sizes
| Size | Height | Usage |
|------|--------|-------|
| sm | h-8 | Compact UI |
| default | h-10 | Standard |
| lg | h-12 | Hero sections |
| icon | h-10 w-10 | Icon-only |

### Input Customizations (Task 19)
- Icon prefix slot
- Icon suffix slot
- Clearable (X button)
- Error state styling
- Disabled state

### Select Customizations (Task 22)
- Searchable filter
- Multi-select mode
- Async loading
- "Create new" option
- Loading spinner

### Badge Status Colors (Task 28)
| Status | Color | Usage |
|--------|-------|-------|
| pending | amber | Awaiting action |
| confirmed | blue | Confirmed orders |
| processing | purple | In progress |
| shipped | cyan | Shipped items |
| delivered | green | Completed |
| cancelled | gray | Cancelled |
| failed | red | Errors |

### AvatarGroup Props
- avatars: Array of avatar data
- max: Maximum to display
- size: Avatar size variant
- Shows "+N" for overflow
