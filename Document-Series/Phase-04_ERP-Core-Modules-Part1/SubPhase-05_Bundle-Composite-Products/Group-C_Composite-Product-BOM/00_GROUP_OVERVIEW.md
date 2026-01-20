# Group C: Composite Product & BOM

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** C of F  
> **Tasks Covered:** 37-56  
> **Group Goal:** Implement Bill of Materials (BOM) models for manufacturing/composite products

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Bundle-Stock-Pricing-Logic](../Group-B_Bundle-Stock-Pricing-Logic/)
- **→ Next Group:** [Group-D_Manufacturing-Cost-Calculation](../Group-D_Manufacturing-Cost-Calculation/)

---

## Group Overview

### Key Outcomes
- bom.py model file for Bill of Materials
- BillOfMaterials model with versioning support
- BOMItem model for raw material components
- Wastage percentage tracking
- Critical component flagging
- Substitute material support
- Yield quantity for output
- BOM Manager for optimized queries

### Technology Context
- **Concept:** Composite products manufactured from raw materials
- **Versioning:** Multiple BOM versions per product
- **Wastage:** Percentage of material lost during manufacturing
- **Substitutes:** Alternative materials for flexibility

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-37-44_BOM-Model-Setup.md | 37-44 | BillOfMaterials model with versioning |
| 02 | 02_Tasks-45-50_BOMItem-Base-Fields.md | 45-50 | BOMItem with quantity and wastage |
| 03 | 03_Tasks-51-56_BOMItem-Advanced-Manager.md | 51-56 | Substitutes, sort order, and manager |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create bom.py File | Low | 3 min |
| 38 | Define BillOfMaterials Class | Medium | 10 min |
| 39 | Add product Field | Low | 5 min |
| 40 | Add version Field | Low | 5 min |
| 41 | Add is_active Field | Low | 3 min |
| 42 | Add notes Field | Low | 3 min |
| 43 | Add yield_quantity Field | Low | 5 min |
| 44 | Export BillOfMaterials | Low | 3 min |
| 45 | Define BOMItem Class | Medium | 10 min |
| 46 | Add bom Field | Low | 5 min |
| 47 | Add raw_material Field | Low | 5 min |
| 48 | Add quantity Field | Low | 5 min |
| 49 | Add unit_of_measure Field | Low | 5 min |
| 50 | Add wastage_percent Field | Low | 5 min |
| 51 | Add is_critical Field | Low | 3 min |
| 52 | Add substitute Field | Medium | 8 min |
| 53 | Add sort_order Field | Low | 3 min |
| 54 | Export BOMItem | Low | 3 min |
| 55 | Create BOM Migration | Low | 5 min |
| 56 | Create BOM Manager | Medium | 10 min |

---

## Execution Order

```
Task 37: Create bom.py File
    │
    ▼
Tasks 38-44: BillOfMaterials Model
    │ (product FK, version, is_active, notes,
    │  yield_quantity, export)
    ▼
Tasks 45-50: BOMItem Model (Base)
    │ (bom FK, raw_material FK, quantity,
    │  unit_of_measure, wastage_percent)
    ▼
Tasks 51-54: BOMItem Model (Advanced)
    │ (is_critical, substitute FK, sort_order, export)
    ▼
Tasks 55-56: Migration & Manager
```

---

## Expected Deliverables

```
backend/apps/products/
├── models/
│   ├── __init__.py (updated)
│   └── bom.py (NEW)
├── managers/
│   ├── __init__.py (updated)
│   └── bom_manager.py (NEW or in bom.py)
└── migrations/
    └── XXXX_bom_models.py (NEW)
```

---

## Notes for AI Agents

1. **BOM Versioning:** Allow multiple versions (v1.0, v1.1, etc.)
2. **is_active:** Only one active BOM version per product
3. **yield_quantity:** Output units from one production run
4. **raw_material:** FK to Product (raw material type)
5. **wastage_percent:** Decimal field (e.g., 5.0 for 5%)
6. **is_critical:** Component that cannot be substituted
7. **substitute:** Self-FK to alternative BOMItem
8. **unit_of_measure:** String or FK to UoM model
9. **Tenant Isolation:** All BOM data tenant-specific
10. **Next Group:** Manufacturing Cost Calculation (Group D)
