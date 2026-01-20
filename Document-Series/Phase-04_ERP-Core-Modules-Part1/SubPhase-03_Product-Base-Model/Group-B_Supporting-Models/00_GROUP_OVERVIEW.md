# Group B: Supporting Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** B of F  
> **Tasks Covered:** 15-32  
> **Group Goal:** Create Brand, TaxClass, and UnitOfMeasure supporting models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Products-App-Setup](../Group-A_Products-App-Setup/)
- **→ Next Group:** [Group-C_Product-Model-Definition](../Group-C_Product-Model-Definition/)

---

## Group Overview

### Key Outcomes
- Brand model for product branding
- TaxClass model for tax rate management
- UnitOfMeasure model for product units
- All models exported from models module

### Technology Context
- Django models inheriting from BaseModel
- Brand with logo image storage
- TaxClass with decimal rate field
- UnitOfMeasure with symbol and conversion

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-23_Brand-Model.md | 15-23 | Create Brand model with all fields |
| 02 | 02_Tasks-24-29_TaxClass-Model.md | 24-29 | Create TaxClass model for tax rates |
| 03 | 03_Tasks-30-32_UnitOfMeasure-Model.md | 30-32 | Create UnitOfMeasure model |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create brand.py File | Low |
| 16 | Define Brand Class | Medium |
| 17 | Add Brand name Field | Low |
| 18 | Add Brand slug Field | Low |
| 19 | Add Brand logo Field | Medium |
| 20 | Add Brand description Field | Low |
| 21 | Add Brand website Field | Low |
| 22 | Add Brand is_active Field | Low |
| 23 | Export Brand Model | Low |
| 24 | Create tax_class.py File | Low |
| 25 | Define TaxClass Class | Medium |
| 26 | Add TaxClass name Field | Low |
| 27 | Add TaxClass rate Field | Medium |
| 28 | Add TaxClass is_default Field | Low |
| 29 | Export TaxClass Model | Low |
| 30 | Create unit_of_measure.py | Low |
| 31 | Define UnitOfMeasure Class | Medium |
| 32 | Export UnitOfMeasure Model | Low |

---

## Execution Order

```
Tasks 15-23: Brand Model
    │
    ▼
Tasks 24-29: TaxClass Model
    │
    ▼
Tasks 30-32: UnitOfMeasure Model
```

---

## Expected Deliverables

```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── brand.py
    ├── tax_class.py
    └── unit_of_measure.py
```

---

## Notes for AI Agents

1. Brand logo should use tenant-isolated storage path
2. TaxClass rate is decimal (e.g., 8.00 for 8%)
3. Only one TaxClass should be is_default=True per tenant
4. UnitOfMeasure includes name, symbol, and conversion factor
5. Common UoM: Piece (pcs), Kilogram (kg), Liter (l)
