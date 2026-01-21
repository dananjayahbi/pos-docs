# Group C: Product Search & Barcode

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** C of F  
> **Tasks Covered:** 39-54  
> **Group Goal:** Implement product lookup and barcode scanning functionality

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Cart & Line Item Management](../Group-B_Cart-Line-Item-Management/)
- **→ Next Group:** [Group D: Payment Processing](../Group-D_Payment-Processing/)

---

## Group Overview

### Key Outcomes

1. **Search Submodule** - Organized `apps/pos/search/` package structure
2. **ProductSearchService** - Centralized product search service
3. **Barcode Search** - Exact barcode match lookup
4. **SKU Search** - Exact and partial SKU matching
5. **Name Search** - Fuzzy matching on product name
6. **Combined Search** - Single search across barcode, SKU, name
7. **Variant Resolution** - Return variant if barcode matches variant
8. **Stock Availability** - Filter/flag out-of-stock products
9. **Price Inclusion** - Include effective price in results
10. **QuickButtonGroup Model** - Groups for quick access buttons
11. **QuickButton Model** - Product shortcuts with positioning
12. **Barcode Format Validators** - EAN-13, UPC-A, Code-128 validation
13. **Weight-Based Barcode Parsing** - Parse price/weight embedded barcodes
14. **Search History** - Track recent searches for quick access
15. **Category Quick Filter** - Filter products by category

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Quick button models, search queries |
| Full-Text Search | PostgreSQL trigram similarity for fuzzy search |
| Service Layer | ProductSearchService for search logic |
| Regex | Barcode format validation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-39-45_Search-Service-Methods.md` | 39-45 | Search submodule, ProductSearchService, barcode/SKU/name/combined search, variant resolution |
| 02 | `02_Tasks-46-50_Stock-Price-Quick-Buttons.md` | 46-50 | Stock check, price inclusion, QuickButtonGroup, QuickButton, position management |
| 03 | `03_Tasks-51-54_Barcode-Validation-Filters.md` | 51-54 | Barcode validators, weight parsing, search history, category filter |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 39 | Create search submodule | Low | 10 min |
| 40 | Create ProductSearchService | Medium | 25 min |
| 41 | Implement barcode_search | Medium | 20 min |
| 42 | Implement sku_search | Medium | 20 min |
| 43 | Implement name_search | Medium | 25 min |
| 44 | Implement combined_search | High | 30 min |
| 45 | Add variant resolution | Medium | 20 min |
| 46 | Add stock availability check | Medium | 20 min |
| 47 | Add price inclusion | Medium | 20 min |
| 48 | Create QuickButtonGroup model | Medium | 25 min |
| 49 | Create QuickButton model | Medium | 25 min |
| 50 | Add button position management | Medium | 20 min |
| 51 | Create barcode format validators | Medium | 25 min |
| 52 | Add weight-based barcode parsing | High | 30 min |
| 53 | Create search history tracking | Medium | 20 min |
| 54 | Add category quick filter | Medium | 20 min |

---

## Execution Order

```
[Tasks 39-40: Search submodule and ProductSearchService]
         │
         ▼
[Tasks 41-44: Individual and combined search methods]
         │
         ▼
[Tasks 45-47: Variant, stock, price enhancements]
         │
         ▼
[Tasks 48-50: Quick button models and positioning]
         │
         ▼
[Tasks 51-54: Barcode validation, history, filters]
```

---

## Expected Deliverables

```
apps/pos/
├── search/
│   ├── __init__.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── product_search.py     # Tasks 40-47, 53-54
│   ├── models/
│   │   ├── __init__.py
│   │   ├── quick_button_group.py # Task 48
│   │   └── quick_button.py       # Tasks 49-50
│   └── validators.py             # Tasks 51-52
```

---

## Notes for AI Agents

### Search Priority Order
1. **Exact Barcode Match** - Highest priority, single result
2. **Exact SKU Match** - Single result
3. **Partial SKU Match** - Multiple results
4. **Name Search** - Fuzzy matching, multiple results

### Combined Search Logic
```
def combined_search(query):
    # Try barcode first
    result = barcode_search(query)
    if result:
        return [result]
    
    # Try exact SKU
    result = sku_search(query, exact=True)
    if result:
        return [result]
    
    # Fall back to name + partial SKU
    results = name_search(query)
    results += sku_search(query, exact=False)
    return deduplicate(results)
```

### Barcode Format Detection
| Format | Length | Characters |
|--------|--------|------------|
| EAN-13 | 13 | Digits only |
| EAN-8 | 8 | Digits only |
| UPC-A | 12 | Digits only |
| Code-128 | Variable | Alphanumeric |

### Weight-Embedded Barcode
```
Format: 2PPPPPWWWWWC (EAN-13)
- 2: Prefix for weighted item
- PPPPP: Product code (5 digits)
- WWWWW: Weight in grams (5 digits)
- C: Check digit
```

### Quick Button Grid
```
┌─────┬─────┬─────┬─────┐
│ 1,1 │ 1,2 │ 1,3 │ 1,4 │  Row 1
├─────┼─────┼─────┼─────┤
│ 2,1 │ 2,2 │ 2,3 │ 2,4 │  Row 2
...
└─────┴─────┴─────┴─────┘

Position: (row, column)
Default grid: 5 rows × 4 columns
```

### QuickButton Fields
- group FK: Link to QuickButtonGroup
- product FK: Link to Product
- label: Display label (optional, defaults to product name)
- row, column: Grid position
- color: Hex color code or preset
- image: Optional button image

### Search History
- Track last N searches per terminal/user
- Store: query, result_count, selected_product, timestamp
- Enable quick access to recent searches
