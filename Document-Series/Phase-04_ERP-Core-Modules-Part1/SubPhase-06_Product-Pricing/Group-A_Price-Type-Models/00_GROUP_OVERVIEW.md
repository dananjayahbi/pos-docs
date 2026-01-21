# Group A: Price Type Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create core pricing models with LKR currency support

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_Tax-Integration-Calculation](../Group-B_Tax-Integration-Calculation/)

---

## Group Overview

### Key Outcomes
- Pricing app structure within products module
- LKR currency constants and formatting
- Custom PriceField for validated decimal prices
- ProductPrice model with base, sale, cost, wholesale prices
- VariantPrice model for variant-level pricing
- Price history tracking with signals
- Profit margin calculation properties
- Price comparison methods (is_on_sale, discount_percentage)
- Admin configuration for price management

### Technology Context
- **Framework:** Django 5.x ORM
- **Currency:** LKR (Sri Lankan Rupees) with 2 decimal places
- **Field Type:** DecimalField with max_digits=12, decimal_places=2
- **Format:** "LKR 1,250.00" with comma thousand separator

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Pricing-App-Setup.md | 01-04 | App structure, constants, PriceField, ProductPrice model |
| 02 | 02_Tasks-05-09_Price-Fields-Manager.md | 05-09 | Sale, wholesale prices, tax fields, Meta, manager |
| 03 | 03_Tasks-10-14_Variant-Price-History.md | 10-14 | VariantPrice model, validation, margin, PriceHistory |
| 04 | 04_Tasks-15-18_Signals-Utils-Admin.md | 15-18 | History signals, formatting, comparison methods, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create pricing app structure | Low | 15 min |
| 02 | Define currency constants | Low | 10 min |
| 03 | Create PriceField custom field | Medium | 25 min |
| 04 | Create ProductPrice model | Medium | 30 min |
| 05 | Add sale price fields | Low | 20 min |
| 06 | Add wholesale price field | Low | 15 min |
| 07 | Add tax handling fields | Low | 20 min |
| 08 | Create ProductPrice Meta class | Low | 15 min |
| 09 | Add ProductPrice model manager | Medium | 25 min |
| 10 | Create VariantPrice model | Medium | 30 min |
| 11 | Add VariantPrice override logic | Low | 15 min |
| 12 | Create price validation methods | Medium | 25 min |
| 13 | Add profit margin calculation | Low | 20 min |
| 14 | Create price history model | Medium | 30 min |
| 15 | Add PriceHistory signals | Medium | 25 min |
| 16 | Create currency formatting utility | Low | 15 min |
| 17 | Add price comparison methods | Low | 20 min |
| 18 | Create ProductPrice admin | Low | 20 min |

---

## Execution Order

```
Task 01: Create pricing app structure
    │
    ▼
Tasks 02-03: Currency Constants & PriceField
    │
    ▼
Tasks 04-09: ProductPrice Model
    │ (base, sale, wholesale, tax fields, Meta, manager)
    ▼
Tasks 10-13: VariantPrice & Validation
    │ (override logic, validation, margin)
    ▼
Tasks 14-18: History, Signals & Utils
    │ (PriceHistory, signals, formatting, comparison, admin)
```

---

## Expected Deliverables

```
backend/apps/products/pricing/
├── __init__.py (NEW)
├── apps.py (NEW)
├── constants.py (NEW)
├── fields.py (NEW)
├── utils.py (NEW)
├── admin.py (NEW)
├── models/
│   ├── __init__.py (NEW)
│   ├── product_price.py (NEW)
│   ├── variant_price.py (NEW)
│   └── price_history.py (NEW)
└── managers/
    └── price_manager.py (NEW)
```

---

## Notes for AI Agents

1. **LKR Format:** "LKR 1,250.00" - space after LKR, comma separator
2. **Max Price:** 999,999,999.99 (12 digits total, 2 decimal)
3. **PriceField:** Subclass DecimalField with LKR validation
4. **sale_price_start/end:** DateTimeField for sale periods
5. **is_tax_inclusive:** Boolean indicating stored price includes tax
6. **use_product_price:** VariantPrice inheritance flag
7. **PriceHistory:** Track old_price, new_price, changed_at, changed_by
8. **post_save Signal:** Auto-log price changes to history
9. **is_on_sale():** Check if within sale date range
10. **Next Group:** Tax Integration & Calculation (Group B)
