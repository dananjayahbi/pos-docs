# Group B: Product Search & Quick Buttons

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Build product search with barcode support and quick add button grid

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_POS-Routes-Layout-Structure](../Group-A_POS-Routes-Layout-Structure/)
- **→ Next Group:** [Group-C_Cart-Management](../Group-C_Cart-Management/)

---

## Group Overview

This group creates the product search and quick buttons for fast product selection. Creates product search bar with auto-focus input and barcode scanner detection. Creates search results dropdown with result items. Implements add from search functionality. Creates quick buttons container with responsive grid layout. Creates individual quick button component with product image, price display, and out of stock indicator. Adds category tabs to filter quick buttons. Implements quick button action to add products. Loads quick button products from API. Creates variant selection modal for products with variants. Connects product search to API.

### Key Outcomes

- Product search bar component
- Auto-focus search input
- Barcode scanner handler
- Search results dropdown
- Search result item component
- Add from search action
- Quick buttons container
- Quick button component
- Quick button grid (responsive)
- Category tabs for filtering
- Category tab item
- Quick button add action
- Product image in button
- Out of stock indicator
- Price display in button
- Quick products API load
- Variant selection modal
- Product search API connected

### Technology Context

- **Search:** Auto-complete search
- **Barcode:** Rapid keystroke detection
- **Grid:** Responsive button grid
- **Variants:** Modal for selection

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-28_Search-QuickButtons.md` | Create search and quick buttons | 17-28 |
| 02 | `02_Tasks-29-34_Display-Modal-API.md` | Create display elements, modal, and API | 29-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Product Search Bar | Medium | Task 10 |
| 18 | Create Search Input Component | Low | Task 17 |
| 19 | Create Barcode Scanner Handler | Medium | Task 17 |
| 20 | Create Search Results Dropdown | Medium | Task 18 |
| 21 | Create Search Result Item | Low | Task 20 |
| 22 | Create Add from Search | Low | Task 21 |
| 23 | Create Quick Buttons Container | Low | Task 10 |
| 24 | Create Quick Button Component | Medium | Task 23 |
| 25 | Create Quick Button Grid | Low | Task 24 |
| 26 | Create Category Tabs | Low | Task 23 |
| 27 | Create Category Tab Item | Low | Task 26 |
| 28 | Create Quick Button Action | Low | Task 25 |
| 29 | Create Product Image Display | Low | Task 24 |
| 30 | Create Out of Stock Indicator | Low | Task 24 |
| 31 | Create Price Display in Button | Low | Task 24 |
| 32 | Load Quick Button Products | Medium | Task 28 |
| 33 | Create Variant Selection Modal | Medium | Task 28 |
| 34 | Connect Product Search to API | Medium | Task 32 |

---

## Execution Order

```
Task 17: Product Search Bar
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 18: Search Input                                  │
    │                                                  │
    ▼                                                  │
Task 19: Barcode Handler                               │
    │                                                  │
    ▼                                                  │
Task 20: Search Dropdown                               │
    │                                                  │
    ▼                                                  │
Task 21: Result Item                                   │
    │                                                  │
    ▼                                                  │
Task 22: Add from Search                               │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 23: Quick Buttons Container
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 24    Task 26
      (Button)   (Tabs)
         │           │
         ▼           ▼
      Task 25    Task 27
      (Grid)     (Tab Item)
         │           │
         └─────┬─────┘
               ▼
         Task 28: Button Action
               │
         ┌─────┼─────┬─────┐
         ▼     ▼     ▼     │
      Task 29 Task 30 Task 31
      (Image) (Stock) (Price)
         │     │     │     │
         └─────┴─────┴─────┘
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 32    Task 33
      (Load)     (Variant)
         │           │
         └─────┬─────┘
               ▼
         Task 34: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── pos/
            └── ProductPanel/
                ├── ProductPanel.tsx
                ├── ProductSearch.tsx
                ├── SearchInput.tsx
                ├── SearchResults.tsx
                ├── SearchResultItem.tsx
                ├── QuickButtons.tsx
                ├── QuickButton.tsx
                ├── QuickButtonGrid.tsx
                ├── CategoryTabs.tsx
                ├── CategoryTab.tsx
                ├── ProductImage.tsx
                ├── StockIndicator.tsx
                ├── PriceDisplay.tsx
                ├── VariantModal.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Search Input (Task 18)
| Feature | Description |
|---------|-------------|
| Auto-focus | Focus on mount |
| Placeholder | "Search or scan barcode..." |
| Icon | Search + Barcode |
| Clear | X button to clear |

### Barcode Handler (Task 19)
| Detection | Criteria |
|-----------|----------|
| Speed | < 50ms between keystrokes |
| Pattern | Numeric or alphanumeric |
| Length | 8-13 characters typical |
| Action | Auto-search on detect |

### Search Results (Task 20)
| Feature | Description |
|---------|-------------|
| Position | Below search input |
| Max | 10 results |
| Keyboard | Arrow keys to navigate |
| Select | Enter to add |

### Search Result Item (Task 21)
| Element | Content |
|---------|---------|
| Image | Product thumbnail |
| Name | Product name |
| SKU | Product SKU |
| Price | LKR formatted |
| Stock | Available quantity |

### Quick Button (Task 24)
| Element | Content |
|---------|---------|
| Image | Product image |
| Name | Short name |
| Price | LKR formatted |
| Size | ~100x120px |

### Category Tabs (Task 26)
| Feature | Description |
|---------|-------------|
| Position | Above button grid |
| All | Show all categories |
| Active | Highlighted tab |
| Scroll | Horizontal if many |

### Quick Button Grid (Task 25)
| Screen | Columns |
|--------|---------|
| Large | 6 |
| Medium | 4 |
| Small | 3 |

### Out of Stock (Task 30)
| State | Display |
|-------|---------|
| In Stock | Normal button |
| Low Stock | Yellow indicator |
| Out | Grayed out, disabled |

### Variant Modal (Task 33)
| Element | Content |
|---------|---------|
| Title | Select Variant |
| Options | Size, Color, etc. |
| Stock | Show per variant |
| Add | Add selected to cart |
