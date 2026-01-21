# Group C: Recent Searches

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 05 - Search Functionality  
> **Group:** C of F  
> **Tasks Covered:** 35-48  
> **Group Goal:** Create recent searches storage and display with popular searches fallback

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Autocomplete-Suggestions](../Group-B_Autocomplete-Suggestions/)
- **→ Next Group:** [Group-D_Search-Results-Page](../Group-D_Search-Results-Page/)

---

## Group Overview

This group creates recent and popular searches. Creates recent searches section with header and clear all button. Creates recent search item with history icon and remove button. Creates localStorage hook for storage. Creates add to recent functionality on search submit. Creates limit of 10 recent searches with deduplication. Creates click to search again functionality. Creates popular searches section with API for trending searches when input is empty. Verifies storage and display.

### Key Outcomes

- Recent searches section
- Recent searches header
- Recent search item
- Recent search icon (clock)
- Remove recent item button
- Clear all recent button
- Recent searches localStorage
- Add to recent on submit
- Max 10 recent searches
- Deduplication logic
- Click recent to search
- Popular searches section
- Popular searches API
- Storage and display verified

### Technology Context

- **Storage:** localStorage
- **Key:** lcc-recent-searches
- **Limit:** Max 10 items
- **Fallback:** Popular when empty

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-42_Recent-Section-Storage.md` | Create recent section and storage | 35-42 |
| 02 | `02_Tasks-43-48_Limit-Popular-Verify.md` | Create limits, popular, and verification | 43-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Recent Searches Section | Low | Task 34 |
| 36 | Create Recent Searches Header | Low | Task 35 |
| 37 | Create Recent Search Item | Low | Task 35 |
| 38 | Create Recent Search Icon | Low | Task 37 |
| 39 | Create Remove Recent Item | Low | Task 37 |
| 40 | Create Clear All Recent | Low | Task 35 |
| 41 | Create Recent Searches Storage | Medium | Task 35 |
| 42 | Create Add to Recent | Low | Task 41 |
| 43 | Create Recent Limit | Low | Task 41 |
| 44 | Create Recent Deduplication | Low | Task 42 |
| 45 | Create Click Recent to Search | Low | Task 37 |
| 46 | Create Popular Searches | Medium | Task 35 |
| 47 | Create Popular Searches API | Low | Task 46 |
| 48 | Verify Recent Searches | Low | Task 47 |

---

## Execution Order

```
Task 35: Recent Searches Section
    │
    ├──────────────────────────────────────────────────┐
    │                                                  │
    ├────────┬────────┬────────┬────────┐              │
    ▼        ▼        ▼        ▼        │              │
T-36     T-37     T-40     T-41     T-46              │
(Header) (Item)  (Clear) (Storage)(Popular)           │
    │        │        │        │        │              │
    │    ┌───┴───┐    │        │        │              │
    │    ▼       ▼    │        │        │              │
    │  T-38   T-39    │        │        │              │
    │ (Icon) (Remove) │        │        │              │
    │    │       │    │        │        │              │
    └────┴───────┴────┘        │        │              │
               │               │        │              │
               │          ┌────┴────┐   │              │
               │          ▼         ▼   │              │
               │       T-42      T-43   │              │
               │      (Add)    (Limit)  │              │
               │          │         │   │              │
               │          ▼         │   │              │
               │       T-44        │   │              │
               │     (Dedup)       │   │              │
               │          │         │   │              │
               └──────────┴─────────┘   │              │
                          │             │              │
                          ▼             │              │
                    Task 45: Click Search              │
                          │             │              │
                          │             ▼              │
                          │       Task 47: API         │
                          │             │              │
                          └─────────────┘              │
                                   │                   │
                                   ▼
                             Task 48: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── search/
│           └── RecentSearches/
│               ├── RecentSearches.tsx
│               ├── RecentSearchesHeader.tsx
│               ├── RecentSearchItem.tsx
│               ├── PopularSearches.tsx
│               └── index.ts
├── hooks/
│   └── store/
│       └── useRecentSearches.ts
└── services/
    └── store/
        └── popularSearchesService.ts
```

---

## Notes for AI Agents

### Recent Searches Section (Task 35)
| Show When | Content |
|-----------|---------|
| Input focused | Recent searches list |
| Has history | Show items |
| Empty input | Show instead of suggestions |

### Recent Searches Header (Task 36)
| Element | Content |
|---------|---------|
| Title | "Recent Searches" |
| Action | Clear All link |
| Style | Small, muted |

### Recent Search Item (Task 37)
| Element | Description |
|---------|-------------|
| Icon | Clock/history icon |
| Text | Search query |
| Remove | X button on hover |
| Action | Click to search |

### Remove Recent Item (Task 39)
| Feature | Description |
|---------|-------------|
| Visible | On hover/focus |
| Action | Remove from list |
| Persist | Update localStorage |

### Clear All Recent (Task 40)
| Feature | Description |
|---------|-------------|
| Text | "Clear All" |
| Confirm | Optional confirmation |
| Action | Clear localStorage |

### Recent Storage Hook (Task 41)
| Feature | Value |
|---------|-------|
| Key | lcc-recent-searches |
| Type | string[] |
| Max | 10 items |
| Order | Newest first |

### Add to Recent (Task 42)
| Trigger | Action |
|---------|--------|
| Search submit | Add to top of list |
| Existing | Move to top |
| Trim | Remove oldest if > 10 |

### Recent Limit (Task 43)
| Rule | Value |
|------|-------|
| Max Items | 10 |
| Overflow | Remove oldest |
| Display | Show all 10 |

### Deduplication (Task 44)
| Feature | Description |
|---------|-------------|
| Check | Case insensitive |
| Match | Exact match |
| Action | Update position, not add |

### Popular Searches (Task 46)
| Show When | Content |
|-----------|---------|
| Empty input | Trending searches |
| No history | Fallback content |
| Title | "Popular Searches" |

### Popular Searches API (Task 47)
| Endpoint | /api/search/popular |
| Response | string[] (queries) |
| Cache | 1 hour |
| Limit | 5-8 items |
