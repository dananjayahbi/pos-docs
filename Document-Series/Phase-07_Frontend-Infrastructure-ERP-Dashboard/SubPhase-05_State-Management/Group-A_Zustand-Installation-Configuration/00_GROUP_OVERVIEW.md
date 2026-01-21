# Group A: Zustand Installation & Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and configure Zustand with middlewares and utilities

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_UI-State-Stores](../Group-B_UI-State-Stores/)

---

## Group Overview

This group installs and configures Zustand as the client-side state management library. Creates the store/ directory structure and defines TypeScript types. Configures middlewares: immer for immutable updates, persist for localStorage persistence, and devtools for debugging. Creates a createStore utility that combines all middlewares. Establishes selector patterns with useShallow for optimized subscriptions. Creates utilities for store reset (logout) and SSR hydration handling.

### Key Outcomes

- Zustand installed
- store/ directory created
- Store TypeScript types defined
- Immer middleware configured
- Persist middleware configured
- DevTools middleware configured
- createStore utility with combined middlewares
- Selector patterns established
- useShallow hook configured
- Store reset utilities
- SSR hydration handler
- Store index file
- DevTools extension documented
- Setup verified

### Technology Context

- **State Library:** Zustand (lightweight, hook-based)
- **Immutability:** Immer middleware
- **Persistence:** localStorage via persist
- **DevTools:** Browser extension + middleware

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Installation-Middlewares.md` | Install Zustand and configure middlewares | 01-07 |
| 02 | `02_Tasks-08-14_Selectors-Utilities-Verification.md` | Create selectors, utilities, and verify setup | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install Zustand | Low | SubPhase-04 |
| 02 | Create Store Directory | Low | Task 01 |
| 03 | Create Store Types | Low | Task 02 |
| 04 | Configure Immer Middleware | Low | Task 01 |
| 05 | Configure Persist Middleware | Low | Task 01 |
| 06 | Configure DevTools Middleware | Low | Task 01 |
| 07 | Create createStore Utility | Medium | Tasks 04-06 |
| 08 | Create Store Selector Patterns | Low | Task 03 |
| 09 | Create useShallow Hook | Low | Task 01 |
| 10 | Create Store Reset Utilities | Low | Task 02 |
| 11 | Create Store Hydration Handler | Medium | Task 05 |
| 12 | Create Store Index File | Low | Task 02 |
| 13 | Install DevTools Extension | Low | Task 06 |
| 14 | Verify Zustand Setup | Low | Task 07 |

---

## Execution Order

```
Task 01: Install Zustand
    │
    ▼
Task 02: Create Store Directory
    │
    ├──────────────────────┐
    ▼                      ▼
Task 03               Tasks 04-06
(Store Types)         (Middlewares)
    │                      │
    │                      ▼
    │                 Task 07: createStore
    │                      │
    └──────────┬───────────┘
               ▼
    ┌────┬─────┼─────┬────┐
    ▼    ▼     ▼     ▼    ▼
   08   09    10    11   12
    │    │     │     │    │
    └────┴─────┴─────┴────┘
               │
               ▼
          Task 13: DevTools Docs
               │
               ▼
          Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
└── store/
    ├── types.ts
    ├── utils.ts
    └── index.ts
```

---

## Notes for AI Agents

### Zustand Installation (Task 01)
| Package | Purpose |
|---------|---------|
| zustand | Core state library |
| immer | Immutable update helper |

### Middleware Configuration Order (Task 07)
1. devtools (outermost for debugging)
2. persist (middle for storage)
3. immer (innermost for updates)

### Persist Configuration (Task 05)
| Option | Value | Description |
|--------|-------|-------------|
| name | store-key | localStorage key |
| partialize | fn | Select what to persist |
| onRehydrateStorage | fn | Hydration callback |

### Selector Pattern (Task 08)
| Pattern | Description |
|---------|-------------|
| Atomic | Select single property |
| Computed | Derive from multiple |
| useShallow | Compare shallow equality |

### Store Reset Pattern (Task 10)
- Create initial state constant
- Reset function sets to initial
- Call on logout
- Clear persisted data

### SSR Hydration (Task 11)
- Check if client-side
- Skip during SSR
- Handle hydration mismatch
- Use useEffect for client

### DevTools Extension (Task 13)
| Browser | Extension |
|---------|-----------|
| Chrome | Redux DevTools |
| Firefox | Redux DevTools |
| Edge | Redux DevTools |
