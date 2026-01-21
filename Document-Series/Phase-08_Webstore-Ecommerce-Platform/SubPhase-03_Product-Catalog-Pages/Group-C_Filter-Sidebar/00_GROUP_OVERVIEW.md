# Group C: Filter Sidebar

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** C of F  
> **Tasks Covered:** 37-54  
> **Group Goal:** Create filter sidebar with category, price, attribute, and availability filters

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Product-Grid-Cards](../Group-B_Product-Grid-Cards/)
- **→ Next Group:** [Group-D_Sort-Pagination](../Group-D_Sort-Pagination/)

---

## Group Overview

This group creates the filter sidebar. Creates main filter sidebar component. Creates collapsible filter section with header and content. Creates category filter with checkbox list. Creates price range filter with slider and input fields. Creates attribute filters for color (swatches), size (checkboxes), and brand (checkboxes). Creates in stock availability filter and on sale filter toggles. Creates apply filters and clear filters buttons. Verifies filter functionality.

### Key Outcomes

- Filter sidebar component
- Filter section (collapsible)
- Filter section header
- Filter section content
- Category filter
- Category checkbox
- Price range filter
- Price range slider
- Price input fields
- Attribute filters
- Color filter (swatches)
- Size filter (checkboxes)
- Brand filter (checkboxes)
- In stock filter (toggle)
- On sale filter (toggle)
- Apply filters button
- Clear filters button
- Filter functionality verified

### Technology Context

- **State:** URL search params
- **UI:** Headless UI / Radix
- **Slider:** Custom or library
- **Mobile:** Becomes drawer

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-37-46_Sidebar-Category-Price-Attribute.md` | Create sidebar, category, price, and attribute filters | 37-46 |
| 02 | `02_Tasks-47-54_Color-Size-Brand-Availability.md` | Create color, size, brand filters and verification | 47-54 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 37 | Create Filter Sidebar Component | Medium | Task 16 |
| 38 | Create Filter Section Component | Low | Task 37 |
| 39 | Create Filter Section Header | Low | Task 38 |
| 40 | Create Filter Section Content | Low | Task 38 |
| 41 | Create Category Filter | Medium | Task 37 |
| 42 | Create Category Checkbox | Low | Task 41 |
| 43 | Create Price Range Filter | Medium | Task 37 |
| 44 | Create Price Range Slider | Medium | Task 43 |
| 45 | Create Price Input Fields | Low | Task 43 |
| 46 | Create Attribute Filters | Medium | Task 37 |
| 47 | Create Color Filter | Medium | Task 46 |
| 48 | Create Size Filter | Low | Task 46 |
| 49 | Create Brand Filter | Low | Task 46 |
| 50 | Create In Stock Filter | Low | Task 37 |
| 51 | Create On Sale Filter | Low | Task 37 |
| 52 | Create Apply Filters Button | Low | Task 37 |
| 53 | Create Clear Filters Button | Low | Task 37 |
| 54 | Verify Filter Functionality | Low | Task 53 |

---

## Execution Order

```
Task 37: Filter Sidebar Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 38: Filter Section Component                      │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 39    Task 40       │                            │
(Header)   (Content)     │                            │
    │          │          │                            │
    └──────────┘          │                            │
         │                │                            │
         ▼                │                            │
   Task 41: Category Filter                            │
         │                │                            │
         ▼                │                            │
   Task 42: Category Checkbox                          │
         │                │                            │
         ▼                │                            │
   Task 43: Price Range Filter                         │
         │                │                            │
    ┌────┴────┐           │                            │
    ▼         ▼           │                            │
Task 44   Task 45        │                            │
(Slider)  (Inputs)       │                            │
    │         │           │                            │
    └────┬────┘           │                            │
         ▼                │                            │
   Task 46: Attribute Filters                          │
         │                │                            │
    ┌────┼────┬──────────┐│                            │
    ▼    ▼    ▼          ││                            │
T-47   T-48  T-49        ││                            │
(Color)(Size)(Brand)     ││                            │
    │    │    │          ││                            │
    └────┴────┘          ││                            │
         │               ││                            │
    ┌────┴────┐          ││                            │
    ▼         ▼          ││                            │
Task 50   Task 51        ││                            │
(Stock)   (Sale)         ││                            │
    │         │          ││                            │
    └────┬────┘          ││                            │
         │               ││                            │
    ┌────┴────┐          ││                            │
    ▼         ▼          ││                            │
Task 52   Task 53        ││                            │
(Apply)   (Clear)        ││                            │
    │         │          ││                            │
    └────┬────┘          │
         ▼
   Task 54: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── catalog/
│           └── Filters/
│               ├── FilterSidebar.tsx
│               ├── FilterSection.tsx
│               ├── FilterSectionHeader.tsx
│               ├── FilterSectionContent.tsx
│               ├── CategoryFilter.tsx
│               ├── CategoryCheckbox.tsx
│               ├── PriceRangeFilter.tsx
│               ├── PriceSlider.tsx
│               ├── PriceInputs.tsx
│               ├── AttributeFilters.tsx
│               ├── ColorFilter.tsx
│               ├── SizeFilter.tsx
│               ├── BrandFilter.tsx
│               ├── AvailabilityFilter.tsx
│               ├── SaleFilter.tsx
│               ├── FilterActions.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Filter Sidebar Layout (Task 37)
| Section | Content |
|---------|---------|
| Header | "Filters" + Clear All |
| Sections | Collapsible filter groups |
| Footer | Apply button (mobile) |

### Filter Section (Task 38)
| Feature | Description |
|---------|-------------|
| Collapsible | Click to expand/collapse |
| Default | First 3 open |
| Animation | Smooth expand |
| Icon | Chevron indicator |

### Category Filter (Task 41)
| Feature | Description |
|---------|-------------|
| Type | Checkbox list |
| Hierarchy | Show subcategories |
| Count | (23) products count |
| Search | Optional search box |

### Price Range Filter (Task 43-45)
| Element | Description |
|---------|-------------|
| Slider | Dual-handle slider |
| Min Input | Minimum price |
| Max Input | Maximum price |
| Currency | LKR (₨) |
| Range | Dynamic from data |

### Color Filter (Task 47)
| Feature | Description |
|---------|-------------|
| Type | Color swatches |
| Display | Circle swatches |
| Selected | Border/check mark |
| Tooltip | Color name |

### Size Filter (Task 48)
| Feature | Description |
|---------|-------------|
| Type | Checkbox or buttons |
| Options | XS, S, M, L, XL, XXL |
| Disabled | If not available |
| Count | Show product count |

### Brand Filter (Task 49)
| Feature | Description |
|---------|-------------|
| Type | Checkbox list |
| Count | (15) products |
| Search | If > 10 brands |
| Alphabetical | Sort A-Z |

### Availability Filters (Tasks 50-51)
| Filter | Type | Default |
|--------|------|---------|
| In Stock | Toggle | Off |
| On Sale | Toggle | Off |

### Filter Actions (Tasks 52-53)
| Button | Action |
|--------|--------|
| Apply | Update URL params |
| Clear | Reset all filters |
| Mobile | Sticky at bottom |
