# Group B: Autocomplete Suggestions

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 05 - Search Functionality  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create autocomplete dropdown with product and category suggestions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Search-Input-Component](../Group-A_Search-Input-Component/)
- **→ Next Group:** [Group-C_Recent-Searches](../Group-C_Recent-Searches/)

---

## Group Overview

This group creates the autocomplete dropdown. Creates autocomplete container with positioning and visibility logic. Creates product suggestions section with product suggestion items showing thumbnail and info. Creates category suggestions section with category items. Creates highlighted matching text. Creates keyboard navigation with arrow keys, Enter to select, and Escape to close. Creates hover highlight and click outside close. Creates search API service and suggestions loading state. Verifies complete autocomplete UX.

### Key Outcomes

- Autocomplete container
- Autocomplete positioning
- Autocomplete visibility logic
- Product suggestions section
- Product suggestion item
- Product suggestion image
- Product suggestion info
- Category suggestions section
- Category suggestion item
- Highlighted match text
- Keyboard navigation (arrows)
- Hover highlight
- Enter to select
- Escape to close
- Click outside close
- Search API service
- Suggestions loading state
- Autocomplete UX verified

### Technology Context

- **Position:** Below input, full width
- **API:** Debounced suggestions
- **Keyboard:** Full navigation
- **Close:** Click outside/Escape

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Container-Suggestions.md` | Create container and suggestion items | 17-26 |
| 02 | `02_Tasks-27-34_Keyboard-API-Verify.md` | Create keyboard nav, API, and verification | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Autocomplete Container | Medium | Task 16 |
| 18 | Create Autocomplete Position | Low | Task 17 |
| 19 | Create Autocomplete Visibility | Low | Task 17 |
| 20 | Create Product Suggestions Section | Medium | Task 17 |
| 21 | Create Product Suggestion Item | Low | Task 20 |
| 22 | Create Product Suggestion Image | Low | Task 21 |
| 23 | Create Product Suggestion Info | Low | Task 21 |
| 24 | Create Category Suggestions Section | Medium | Task 17 |
| 25 | Create Category Suggestion Item | Low | Task 24 |
| 26 | Create Highlighted Match | Low | Task 21 |
| 27 | Create Keyboard Navigation | Medium | Task 17 |
| 28 | Create Hover Highlight | Low | Task 17 |
| 29 | Create Enter to Select | Low | Task 27 |
| 30 | Create Escape to Close | Low | Task 17 |
| 31 | Create Click Outside Close | Low | Task 17 |
| 32 | Create Search API Service | Medium | Task 17 |
| 33 | Create Suggestions Loading | Low | Task 32 |
| 34 | Verify Autocomplete UX | Low | Task 33 |

---

## Execution Order

```
Task 17: Autocomplete Container
    │
    ├──────────────────────────────────────────────────┐
    │                                                  │
    ├────────┬────────┬────────┬────────┬────────┐     │
    ▼        ▼        ▼        ▼        ▼        │     │
T-18     T-19     T-20     T-24     T-27        │     │
(Pos)   (Vis)  (Products)(Cats)  (Keyboard)    │     │
    │        │        │        │        │        │     │
    │        │        ▼        ▼        ▼        │     │
    │        │     T-21     T-25     T-29       │     │
    │        │    (Item)   (Item)  (Enter)      │     │
    │        │        │        │        │        │     │
    │        │    ┌───┴───┐    │        │        │     │
    │        │    ▼       ▼    │        │        │     │
    │        │  T-22   T-23    │        │        │     │
    │        │ (Image)(Info)   │        │        │     │
    │        │    │       │    │        │        │     │
    │        │    │       ▼    │        │        │     │
    │        │    │    T-26    │        │        │     │
    │        │    │  (Highlight)│       │        │     │
    │        │    │       │    │        │        │     │
    └────────┴────┴───────┴────┴────────┘        │     │
                          │                      │     │
    ┌─────────────────────┘                      │     │
    │                                            │     │
    ├────────┬────────┬────────┐                 │     │
    ▼        ▼        ▼        │                 │     │
T-28     T-30     T-31        │                 │     │
(Hover) (Escape)(Outside)     │                 │     │
    │        │        │        │                 │     │
    └────────┴────────┘        │                 │     │
               │               │                 │     │
               ▼               │                 │     │
         Task 32: Search API   │                 │     │
               │               │                 │     │
               ▼               │                 │     │
         Task 33: Loading      │                 │     │
               │               │                 │     │
               ▼
         Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── search/
│           └── Autocomplete/
│               ├── Autocomplete.tsx
│               ├── ProductSuggestions.tsx
│               ├── ProductSuggestionItem.tsx
│               ├── CategorySuggestions.tsx
│               ├── CategorySuggestionItem.tsx
│               ├── HighlightMatch.tsx
│               ├── SuggestionsLoading.tsx
│               └── index.ts
├── hooks/
│   └── store/
│       └── useAutocomplete.ts
└── services/
    └── store/
        └── searchService.ts
```

---

## Notes for AI Agents

### Autocomplete Container (Task 17)
| Feature | Value |
|---------|-------|
| Position | Absolute below input |
| Width | Same as input |
| Z-index | 50 |
| Background | White |
| Shadow | lg shadow |
| Border | Rounded corners |

### Autocomplete Visibility (Task 19)
| Show When | Hide When |
|-----------|-----------|
| Input focused + value | Input blur |
| Typing (after debounce) | Clear input |
| Has suggestions | Escape pressed |
| | Click outside |

### Product Suggestion Item (Task 21)
| Element | Description |
|---------|-------------|
| Image | 40x40 thumbnail |
| Name | Product name |
| Price | Product price |
| Layout | Horizontal flex |

### Category Suggestion Item (Task 25)
| Element | Description |
|---------|-------------|
| Icon | Category icon |
| Name | Category name |
| Count | Product count |
| Action | Search in category |

### Highlighted Match (Task 26)
| Feature | Description |
|---------|-------------|
| Match | Bold matching text |
| Example | "Lap**top**" for "top" |
| Case | Case insensitive |

### Keyboard Navigation (Task 27)
| Key | Action |
|-----|--------|
| ↓ | Move to next item |
| ↑ | Move to previous item |
| Enter | Select item |
| Escape | Close dropdown |
| Tab | Close and move focus |

### Hover Highlight (Task 28)
| State | Style |
|-------|-------|
| Normal | White background |
| Hover | Gray-100 background |
| Keyboard | Same as hover |

### Search API Service (Task 32)
| Endpoint | Purpose |
|----------|---------|
| /api/search/suggestions | Get suggestions |
| Query Params | q, limit |
| Response | products[], categories[] |

### Suggestions Loading (Task 33)
| Feature | Value |
|---------|-------|
| Skeleton | 3-4 item placeholders |
| Spinner | Small in corner |
| Min Time | 100ms (avoid flash) |
