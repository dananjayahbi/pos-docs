# Group A: Search Input Component

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 05 - Search Functionality  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create search directory, routes, and search input components for desktop and mobile

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Autocomplete-Suggestions](../Group-B_Autocomplete-Suggestions/)

---

## Group Overview

This group creates the search route and input components. Creates search directory and search results page route. Creates search page layout and loading state. Creates search component directory. Creates SearchInput component with search icon button, input field, and clear button. Creates search form wrapper with submit handling. Creates keyboard shortcut (Ctrl+K). Creates debounce hook and search state management. Creates header search for desktop and mobile search button with full-screen overlay.

### Key Outcomes

- Search directory (/search route)
- Search results page route
- Search page layout
- Search loading state
- Search component directory
- SearchInput component
- Search icon button
- Input field with placeholder
- Clear button (X)
- Search form with submit
- Keyboard shortcut (Ctrl+K)
- Debounce hook (300ms)
- Search state management
- Header search (desktop)
- Mobile search button
- Mobile search overlay

### Technology Context

- **Route:** /search?q=query
- **Debounce:** 300ms delay
- **Shortcut:** Ctrl+K / Cmd+K
- **Mobile:** Full-screen overlay

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Route-Input-Base.md` | Create route, input, and base components | 01-08 |
| 02 | `02_Tasks-09-16_Form-Mobile-Debounce.md` | Create form, mobile search, and debounce | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Search Directory | Low | SubPhase-04 |
| 02 | Create Search Results Page Route | Low | Task 01 |
| 03 | Create Search Page Layout | Low | Task 01 |
| 04 | Create Search Loading State | Low | Task 02 |
| 05 | Create Search Component Directory | Low | Task 01 |
| 06 | Create SearchInput Component | Medium | Task 05 |
| 07 | Create Search Icon Button | Low | Task 06 |
| 08 | Create Input Field | Low | Task 06 |
| 09 | Create Clear Button | Low | Task 08 |
| 10 | Create Search Form | Low | Task 06 |
| 11 | Create Search Shortcut | Low | Task 06 |
| 12 | Create Debounce Hook | Medium | Task 08 |
| 13 | Create Search State | Low | Task 08 |
| 14 | Create Header Search | Medium | Task 06 |
| 15 | Create Mobile Search Button | Low | Task 06 |
| 16 | Create Mobile Search Overlay | Medium | Task 15 |

---

## Execution Order

```
Task 01: Search Directory
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 02    Task 03    Task 05
(Route)    (Layout)  (Components)
    │          │          │
    ▼          │          │
Task 04       │          │
(Loading)     │          │
    │          │          │
    └──────────┘          │
         │                │
         │                ▼
         │          Task 06: SearchInput
         │                │
         │          ┌─────┼─────┬─────┬─────┐
         │          ▼     ▼     ▼     ▼     ▼
         │       T-07  T-08  T-10  T-11  T-14
         │      (Icon)(Input)(Form)(Shortcut)(Header)
         │          │     │     │     │     │
         │          │     ├─────┤     │     │
         │          │     │     │     │     │
         │          │  ┌──┴──┐  │     │     │
         │          │  ▼     ▼  │     │     │
         │          │T-09  T-12 │     │     │
         │          │(Clear)(Debounce)│     │
         │          │  │     │  │     │     │
         │          │  │     ▼  │     │     │
         │          │  │  T-13  │     │     │
         │          │  │ (State)│     │     │
         │          │  │     │  │     │     │
         │          └──┴─────┴──┴─────┘     │
         │                │                 │
         │                ▼                 │
         │          Task 15: Mobile Button  │
         │                │                 │
         │                ▼                 │
         │          Task 16: Mobile Overlay │
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── search/
│           ├── page.tsx
│           ├── layout.tsx
│           └── loading.tsx
├── components/
│   └── storefront/
│       └── search/
│           └── SearchInput/
│               ├── SearchInput.tsx
│               ├── SearchIcon.tsx
│               ├── SearchForm.tsx
│               ├── ClearButton.tsx
│               ├── HeaderSearch.tsx
│               ├── MobileSearchButton.tsx
│               ├── MobileSearchOverlay.tsx
│               └── index.ts
└── hooks/
    └── store/
        ├── useDebounce.ts
        └── useSearchState.ts
```

---

## Notes for AI Agents

### Search Directory (Task 01)
| Path | Purpose |
|------|---------|
| /search | Search results route |
| /search?q=query | Query parameter |

### Search Input (Task 06)
| Element | Description |
|---------|-------------|
| Container | Flex row |
| Icon | Left search icon |
| Input | Center text field |
| Clear | Right X button |
| Width | Full on mobile, fixed on desktop |

### Input Field (Task 08)
| Feature | Value |
|---------|-------|
| Placeholder | "Search products..." |
| Type | text |
| Autocomplete | off |
| Focus | Auto on mobile |

### Clear Button (Task 09)
| Feature | Description |
|---------|-------------|
| Visible | When input has value |
| Action | Clear input |
| Style | X icon |

### Search Shortcut (Task 11)
| Platform | Shortcut |
|----------|----------|
| Windows | Ctrl+K |
| Mac | Cmd+K |
| Action | Focus search input |
| Badge | Show in input |

### Debounce Hook (Task 12)
| Feature | Value |
|---------|-------|
| Delay | 300ms |
| Usage | Autocomplete trigger |
| Cancel | On new input |

### Header Search (Task 14)
| Feature | Description |
|---------|-------------|
| Position | Header right side |
| Width | 300-400px |
| Breakpoint | Hidden < 768px |

### Mobile Search Button (Task 15)
| Feature | Description |
|---------|-------------|
| Icon | Search icon |
| Visible | < 768px |
| Action | Open overlay |

### Mobile Search Overlay (Task 16)
| Feature | Description |
|---------|-------------|
| Style | Full-screen |
| Header | Back button + input |
| Backdrop | White/gray |
| Close | Back button or Escape |
| Focus | Auto-focus input |
