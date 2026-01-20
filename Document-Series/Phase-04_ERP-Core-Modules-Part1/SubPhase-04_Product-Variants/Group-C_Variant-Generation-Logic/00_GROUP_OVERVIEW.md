# Group C: Variant Generation Logic

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** C of F  
> **Tasks Covered:** 39-54  
> **Group Goal:** Create variant generation service and signals

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_ProductVariant-Model](../Group-B_ProductVariant-Model/)
- **→ Next Group:** [Group-D_Variant-Managers-QuerySets](../Group-D_Variant-Managers-QuerySets/)

---

## Group Overview

### Key Outcomes
- VariantGenerator service class
- Cartesian product for option combinations
- Configurable SKU pattern generation
- Bulk variant creation
- Signals for auto-name generation

### Technology Context
- itertools.product for combinations
- Bulk create for performance
- Signal handlers for pre/post save
- Configurable SKU patterns

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-39-45_VariantGenerator-Class.md | 39-45 | Create VariantGenerator service |
| 02 | 02_Tasks-46-52_SKU-Pattern-Signals.md | 46-52 | Configure SKU patterns and signals |
| 03 | 03_Tasks-53-54_Migration-Testing.md | 53-54 | Create migration and test generation |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 39 | Create variant_generator.py | Low |
| 40 | Create VariantGenerator Class | Medium |
| 41 | Add get_combinations Method | High |
| 42 | Add generate_variants Method | High |
| 43 | Add generate_sku Method | Medium |
| 44 | Add validate_combinations Method | Medium |
| 45 | Add bulk_create_variants Method | High |
| 46 | Create SKU Pattern Config | Medium |
| 47 | Define Default SKU Pattern | Low |
| 48 | Add SKU Uniqueness Check | Medium |
| 49 | Create signals.py File | Low |
| 50 | Add pre_save Signal | Medium |
| 51 | Add post_save Signal | Medium |
| 52 | Add Auto-name Generation | Medium |
| 53 | Create Variant Migration | Low |
| 54 | Test Variant Generation | High |

---

## Execution Order

```
Tasks 39-45: VariantGenerator Class
    │
    ▼
Tasks 46-48: SKU Patterns
    │
    ▼
Tasks 49-52: Signals
    │
    ▼
Tasks 53-54: Migration & Testing
```

---

## Expected Deliverables

```
backend/apps/products/
├── services/
│   └── variant_generator.py
└── signals.py
```

---

## Notes for AI Agents

1. get_combinations uses itertools.product for Cartesian product
2. SKU pattern: {product_sku}-{size}-{color} format
3. validate_combinations checks for duplicate SKUs
4. bulk_create_variants uses Django's bulk_create for efficiency
5. pre_save signal auto-generates variant name
6. Signal connects on app ready in apps.py
