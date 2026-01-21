# Group A: POS Routes & Layout Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up POS terminal route structure with full-screen layout and state management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Product-Search-Quick-Buttons](../Group-B_Product-Search-Quick-Buttons/)

---

## Group Overview

This group creates the complete route and layout structure for the Point of Sale terminal. Sets up app/(pos)/ route group with dedicated full-screen layout (no sidebar). Creates POS page route, loading state, and error boundary. Creates POS header with exit button (with confirmation) and shift status display. Creates two-column layout with product panel (left) and cart panel (right). Sets up POS context provider for shared state. Defines TypeScript types for POS. Creates offline mode indicator. Sets up keyboard shortcuts for speed operations. Verifies route accessibility.

### Key Outcomes

- POS route directory created
- Full-screen POS layout (no sidebar)
- POS page route
- POS loading state
- POS error boundary
- POS header component
- Exit POS button with confirmation
- Shift status display
- Two-column main container
- Product panel (left)
- Cart panel (right)
- POS context provider
- POS state types defined
- Offline mode indicator
- Keyboard shortcuts configured
- Route structure verified

### Technology Context

- **Routing:** Next.js App Router (pos) group
- **Layout:** Full-screen dedicated layout
- **State:** React Context for POS state
- **Keyboard:** Hotkey handlers

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Routes-Header.md` | Create routes, layout, and header | 01-08 |
| 02 | `02_Tasks-09-16_Panels-Context-Verify.md` | Create panels, context, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create POS Route Directory | Low | SubPhase-07 |
| 02 | Create POS Layout | Medium | Task 01 |
| 03 | Create POS Page Route | Low | Task 01 |
| 04 | Create POS Loading State | Low | Task 01 |
| 05 | Create POS Error Boundary | Low | Task 01 |
| 06 | Create POS Header Component | Medium | Task 02 |
| 07 | Create Exit POS Button | Low | Task 06 |
| 08 | Create Shift Status Display | Low | Task 06 |
| 09 | Create POS Main Container | Medium | Task 02 |
| 10 | Create Product Panel | Low | Task 09 |
| 11 | Create Cart Panel | Low | Task 09 |
| 12 | Create POS Context Provider | Medium | Task 03 |
| 13 | Create POS State Types | Medium | Task 12 |
| 14 | Create Offline Mode Indicator | Low | Task 02 |
| 15 | Create POS Keyboard Shortcuts | Medium | Task 03 |
| 16 | Verify POS Route Structure | Low | Task 15 |

---

## Execution Order

```
Task 01: Create POS Route Directory
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: POS Layout                                    │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 03    Task 04    Task 05       │                 │
(Page)     (Loading)  (Error)        │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 06: POS Header         │                 │
               │                     │                 │
         ┌─────┴─────┐               │                 │
         ▼           ▼               │                 │
      Task 07    Task 08             │                 │
      (Exit)     (Shift)             │                 │
         │           │               │                 │
         └─────┬─────┘               │                 │
               │                     │                 │
               ▼                     │                 │
         Task 09: Main Container     │                 │
               │                     │                 │
         ┌─────┴─────┐               │                 │
         ▼           ▼               │                 │
      Task 10    Task 11             │                 │
      (Product)  (Cart)              │                 │
         │           │               │                 │
         └─────┬─────┘               │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
               ┌──────────┼──────────┐                 │
               ▼          ▼          ▼                 │
         Task 12    Task 14    Task 15                 │
         (Context)  (Offline)  (Keyboard)              │
               │          │          │                 │
               ▼          │          │                 │
         Task 13         │          │                 │
         (Types)         │          │                 │
               │          │          │                 │
               └──────────┴──────────┴─────────────────┘
                                     │
                                     ▼
                               Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (pos)/
│       ├── layout.tsx
│       └── pos/
│           ├── page.tsx
│           ├── loading.tsx
│           └── error.tsx
├── components/
│   └── modules/
│       └── pos/
│           └── POSLayout/
│               ├── POSLayout.tsx
│               ├── POSHeader.tsx
│               ├── ExitPOSButton.tsx
│               ├── ShiftStatus.tsx
│               ├── POSContainer.tsx
│               ├── ProductPanel.tsx
│               ├── CartPanel.tsx
│               ├── OfflineIndicator.tsx
│               └── index.ts
├── context/
│   └── pos/
│       ├── POSContext.tsx
│       └── types.ts
└── hooks/
    └── pos/
        └── useKeyboardShortcuts.ts
```

---

## Notes for AI Agents

### POS Layout (Task 02)
| Feature | Description |
|---------|-------------|
| Full-screen | 100vh, no scroll |
| No sidebar | Dedicated POS layout |
| Header | Fixed top bar |
| Two-column | Product (60%) + Cart (40%) |

### Exit POS Button (Task 07)
| Feature | Description |
|---------|-------------|
| Icon | XCircle |
| Position | Top-left |
| Confirm | If cart has items |
| Navigate | Dashboard |

### Shift Status (Task 08)
| State | Display |
|-------|---------|
| Open | SHIFT #123 - OPEN (green) |
| Closed | NO ACTIVE SHIFT (red) |
| Opening | Click to open modal |

### Main Container (Task 09)
| Panel | Width | Content |
|-------|-------|---------|
| Left | 60% | Product panel |
| Right | 40% | Cart panel |

### POS State Types (Task 13)
| Type | Description |
|------|-------------|
| CartItem | Product, variant, qty, price |
| Cart | Items, discount, totals |
| Shift | ID, status, opening cash |
| Sale | Cart + payment + customer |

### Keyboard Shortcuts (Task 15)
| Key | Action |
|-----|--------|
| F1 | Focus search |
| F2 | Apply discount |
| F10 | Process payment |
| F12 | Open/Close shift |
| Esc | Cancel/Close modal |

### Offline Indicator (Task 14)
| State | Display |
|-------|---------|
| Online | Hidden |
| Offline | Yellow banner "Offline Mode" |
