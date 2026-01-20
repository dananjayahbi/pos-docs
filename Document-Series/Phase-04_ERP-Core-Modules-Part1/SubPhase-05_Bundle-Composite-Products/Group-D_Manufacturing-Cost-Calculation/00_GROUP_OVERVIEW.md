# Group D: Manufacturing Cost Calculation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** D of F  
> **Tasks Covered:** 57-68  
> **Group Goal:** Implement cost calculation services for composite/manufactured products

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Composite-Product-BOM](../Group-C_Composite-Product-BOM/)
- **→ Next Group:** [Group-E_Serializers-Views](../Group-E_Serializers-Views/)

---

## Group Overview

### Key Outcomes
- CostCalculationService for manufacturing costs
- Material cost calculation from BOM items
- Wastage cost inclusion
- Labor cost tracking
- Overhead cost allocation
- Total manufacturing cost aggregation
- Unit cost calculation (per output unit)
- Selling price suggestion with margin
- ManufacturingStockService for raw material availability
- Producible quantity calculation

### Technology Context
- **Pattern:** Service Layer for business logic
- **Cost Components:** Material + Wastage + Labor + Overhead
- **Unit Cost:** Total cost / yield_quantity
- **Price Suggestion:** Cost * (1 + target_margin)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-57-63_Cost-Calculation-Service.md | 57-63 | CostCalculationService with all cost methods |
| 02 | 02_Tasks-64-68_Unit-Cost-Manufacturing-Stock.md | 64-68 | Unit cost, price suggestion, and stock service |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create manufacturing_services.py | Low | 3 min |
| 58 | Create CostCalculationService Class | Medium | 10 min |
| 59 | Add calculate_material_cost Method | High | 15 min |
| 60 | Add calculate_with_wastage Method | Medium | 10 min |
| 61 | Add calculate_labor_cost Method | Medium | 10 min |
| 62 | Add calculate_overhead Method | Medium | 10 min |
| 63 | Add calculate_total_cost Method | Medium | 10 min |
| 64 | Add calculate_unit_cost Method | Low | 5 min |
| 65 | Add suggest_selling_price Method | Medium | 10 min |
| 66 | Create ManufacturingStockService | Medium | 10 min |
| 67 | Add check_raw_materials Method | High | 15 min |
| 68 | Add get_producible_quantity Method | High | 15 min |

---

## Execution Order

```
Task 57: Create manufacturing_services.py
    │
    ▼
Tasks 58-63: CostCalculationService
    │ (calculate_material_cost, calculate_with_wastage,
    │  calculate_labor_cost, calculate_overhead,
    │  calculate_total_cost)
    ▼
Tasks 64-65: Unit Cost & Pricing
    │ (calculate_unit_cost, suggest_selling_price)
    ▼
Tasks 66-68: ManufacturingStockService
    │ (check_raw_materials, get_producible_quantity)
```

---

## Expected Deliverables

```
backend/apps/products/
├── services/
│   ├── __init__.py (updated)
│   └── manufacturing_services.py (NEW)
└── tests/
    └── test_manufacturing_services.py (NEW)
```

---

## Notes for AI Agents

1. **Material Cost:** Sum(BOMItem.quantity * raw_material.cost_price)
2. **Wastage Cost:** Material cost * (wastage_percent / 100)
3. **Labor Cost:** May be per-product or per-production-run
4. **Overhead:** Fixed or percentage-based allocation
5. **Total Cost:** Material + Wastage + Labor + Overhead
6. **Unit Cost:** Total cost / BOM.yield_quantity
7. **Price Suggestion:** Unit cost * (1 + margin_percentage)
8. **check_raw_materials:** Verify all materials have sufficient stock
9. **get_producible_quantity:** MIN(material_stock / required_qty) * yield
10. **Handle Substitutes:** Check substitutes if primary unavailable
11. **Next Group:** Serializers & Views (Group E)
