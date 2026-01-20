# Group B: ProductVariant Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** B of F  
> **Tasks Covered:** 19-38  
> **Group Goal:** Create ProductVariant model and ProductOptionConfig linking model

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Variant-Option-Models](../Group-A_Variant-Option-Models/)
- **→ Next Group:** [Group-C_Variant-Generation-Logic](../Group-C_Variant-Generation-Logic/)

---

## Group Overview

### Key Outcomes
- ProductVariant model linking to parent Product
- Variant-specific SKU and barcode
- ManyToMany to OptionValue for variant options
- Override fields for weight and dimensions
- ProductOptionConfig for product-option linking

### Technology Context
- ForeignKey to Product (parent)
- ManyToMany through model for option values
- Unique constraint on product + option_values combination
- Auto-generated name from options

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-19-26_ProductVariant-Basic-Fields.md | 19-26 | Create ProductVariant with basic fields |
| 02 | 02_Tasks-27-34_Override-Fields-Properties.md | 27-34 | Add override fields and properties |
| 03 | 03_Tasks-35-38_ProductOptionConfig-Export.md | 35-38 | Create config model and export |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Create product_variant.py File | Low |
| 20 | Define ProductVariant Class | Medium |
| 21 | Add product Field | Medium |
| 22 | Add sku Field | Medium |
| 23 | Add barcode Field | Low |
| 24 | Add name Field | Low |
| 25 | Add option_values Field | High |
| 26 | Add is_active Field | Low |
| 27 | Add weight_override Field | Low |
| 28 | Add dimension_overrides | Medium |
| 29 | Add sort_order Field | Low |
| 30 | Define ProductVariantOption | High |
| 31 | Add __str__ Method | Low |
| 32 | Add Meta Class | Medium |
| 33 | Add get_option_display Method | Medium |
| 34 | Add get_full_name Property | Low |
| 35 | Create ProductOptionConfig | Medium |
| 36 | Add product Field to Config | Low |
| 37 | Add option_type Field to Config | Low |
| 38 | Export ProductVariant | Low |

---

## Execution Order

```
Tasks 19-26: ProductVariant Basic Fields
    │
    ▼
Tasks 27-34: Override Fields & Properties
    │
    ▼
Tasks 35-38: ProductOptionConfig & Export
```

---

## Expected Deliverables

```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── variant_option.py
    └── product_variant.py
```

---

## Notes for AI Agents

1. ProductVariant has unique SKU per tenant
2. option_values is M2M through ProductVariantOption
3. weight_override and dimension_overrides are nullable
4. ProductOptionConfig links Product to OptionType (which options apply)
5. get_full_name returns "Product Name - Size: M, Color: Red"
6. Variants only for product_type=VARIABLE
