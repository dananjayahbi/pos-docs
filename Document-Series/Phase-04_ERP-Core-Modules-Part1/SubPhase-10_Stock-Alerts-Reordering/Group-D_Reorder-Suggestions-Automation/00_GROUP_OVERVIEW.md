# Group D: Reorder Suggestions & Automation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** D of F  
> **Tasks Covered:** 51-68  
> **Group Goal:** Implement reorder point calculations and automated suggestions

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Scheduled Monitoring Tasks](../Group-C_Scheduled-Monitoring-Tasks/)
- **→ Next Group:** [Group E: Serializers & API Views](../Group-E_Serializers-API-Views/)

---

## Group Overview

### Key Outcomes

1. **ReorderSuggestion Model** - Store generated reorder suggestions
2. **Suggestion Status** - PENDING, CONVERTED_TO_PO, DISMISSED
3. **SalesVelocityService** - Calculate average sales rate for products
4. **Daily/Weekly Velocity** - Average units sold per day/week
5. **Seasonality Adjustment** - Adjust velocity based on seasonal patterns
6. **ReorderCalculator Service** - Calculate optimal reorder quantity
7. **EOQ Calculation** - Economic Order Quantity formula
8. **Safety Stock Calculation** - Based on lead time variability
9. **Days Until Stockout** - Estimate when product will run out
10. **Reorder Suggestion Task** - Celery task to create suggestions
11. **Suggestion to PO Conversion** - Create purchase order from suggestion
12. **Auto-Reorder (Optional)** - Auto-create PO when hitting reorder point
13. **Supplier Lead Time Tracking** - Track typical lead time per supplier
14. **Demand Forecasting** - Simple forecast based on historical sales
15. **Reorder Calendar View** - Calendar showing expected stockouts

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | ReorderSuggestion model, aggregation queries |
| Celery | Async suggestion generation |
| Decimal | Precise quantity and cost calculations |
| Statistics | Velocity, safety stock, EOQ calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-57_Suggestion-Model-Velocity.md` | 51-57 | ReorderSuggestion model, SalesVelocityService, daily/weekly/seasonal |
| 02 | `02_Tasks-58-63_Calculator-EOQ-Conversion.md` | 58-63 | ReorderCalculator, EOQ, safety stock, stockout, suggestion task, PO conversion |
| 03 | `03_Tasks-64-68_Auto-Reorder-Forecasting.md` | 64-68 | Auto-reorder, lead time, report, forecasting, calendar |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create ReorderSuggestion model | Medium | 30 min |
| 52 | Add suggestion fields | Medium | 20 min |
| 53 | Add status field | Low | 15 min |
| 54 | Create SalesVelocityService | High | 30 min |
| 55 | Implement daily_velocity calculation | Medium | 25 min |
| 56 | Implement weekly_velocity calculation | Medium | 20 min |
| 57 | Add seasonality adjustment | High | 30 min |
| 58 | Create ReorderCalculator service | High | 30 min |
| 59 | Implement EOQ calculation | High | 30 min |
| 60 | Implement safety stock calculation | High | 25 min |
| 61 | Create days_until_stockout calculation | Medium | 25 min |
| 62 | Generate reorder suggestions task | High | 30 min |
| 63 | Add suggestion to PO conversion | High | 30 min |
| 64 | Implement auto-reorder (optional) | High | 35 min |
| 65 | Add supplier lead time tracking | Medium | 25 min |
| 66 | Create reorder report | Medium | 30 min |
| 67 | Add demand forecasting (basic) | High | 35 min |
| 68 | Create reorder calendar view | High | 30 min |

---

## Execution Order

```
[Tasks 51-53: ReorderSuggestion model]
         │
         ▼
[Tasks 54-57: SalesVelocityService with seasonality]
         │
         ▼
[Tasks 58-61: ReorderCalculator (EOQ, safety stock, stockout)]
         │
         ▼
[Tasks 62-63: Suggestion task and PO conversion]
         │
         ▼
[Tasks 64-65: Auto-reorder and lead time tracking]
         │
         ▼
[Tasks 66-68: Reports, forecasting, calendar]
```

---

## Expected Deliverables

```
apps/inventory/alerts/
├── models/
│   ├── __init__.py
│   └── reorder_suggestion.py     # Tasks 51-53
├── services/
│   ├── __init__.py
│   ├── sales_velocity.py         # Tasks 54-57
│   ├── reorder_calculator.py     # Tasks 58-61
│   ├── forecasting.py            # Task 67
│   └── reports.py                # Task 66
└── tasks/
    └── reorder_suggestions.py    # Tasks 62, 64
```

---

## Notes for AI Agents

### ReorderSuggestion Fields
- product FK: Link to product
- variant FK (optional): Link to variant
- warehouse FK (optional): Specific warehouse
- suggested_qty: Recommended order quantity
- suggested_supplier FK (optional): Preferred supplier
- urgency: LOW, MEDIUM, HIGH, CRITICAL
- days_until_stockout: Estimated days
- status: PENDING, CONVERTED_TO_PO, DISMISSED
- created_at, updated_at: Timestamps
- converted_po FK (optional): Link to created PO

### Sales Velocity Calculation
```
daily_velocity = total_sold / days
weekly_velocity = total_sold / weeks
```

### Seasonality Adjustment
- Compare current period to same period last year
- Apply seasonal factor to velocity
- Handle missing historical data gracefully

### Economic Order Quantity (EOQ)
```
EOQ = sqrt((2 × D × S) / H)

Where:
D = Annual demand (units)
S = Ordering cost per order (LKR)
H = Holding cost per unit per year (LKR)
```

### Safety Stock Formula
```
Safety Stock = Z × sqrt(LT × σ_d² + D² × σ_LT²)

Where:
Z = Service level factor (1.65 for 95%)
LT = Average lead time
σ_d = Standard deviation of demand
D = Average daily demand
σ_LT = Standard deviation of lead time
```

### Days Until Stockout
```
days = available_quantity / daily_velocity
```

### Auto-Reorder Flow
1. Detect stock hits reorder point
2. Get effective config
3. Calculate suggested quantity (EOQ or configured)
4. Create draft PO with suggested supplier
5. Optionally auto-submit if enabled

### Dependencies
- SubPhase-09: StockLevel, StockMovement for calculations
- Phase-05: Purchase Orders for conversion
