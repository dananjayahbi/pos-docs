# Group E: Reorder Suggestions

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement reorder point calculation and suggestions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Prediction-Algorithms](../Group-D_Prediction-Algorithms/)
- **→ Next Group:** [Group-F_API-Frontend](../Group-F_API-Frontend/)

---

## Group Overview

This group implements reorder suggestions. Creates ReorderService with safety_stock calculation, reorder_point calculation, lead_time_demand to estimate demand during lead time, and optimal_order_qty using EOQ formula. Creates ReorderSuggestion model with suggested_qty, reorder_date, and urgency fields. Creates ReorderAlert for low stock alerts. Creates generate_suggestions for batch suggestions and ReorderTask as Celery task. Creates Reorder Dashboard admin. Verifies reorder flow.

### Key Outcomes

- ReorderService
- safety_stock method
- reorder_point method
- lead_time_demand method
- optimal_order_qty method
- ReorderSuggestion model
- suggested_qty field
- reorder_date field
- urgency field
- ReorderAlert
- generate_suggestions method
- ReorderTask
- Reorder Dashboard
- Reorder verified

### Technology Context

- **EOQ:** Economic Order Quantity
- **ROP:** Reorder Point
- **Safety Stock:** Buffer stock
- **Lead Time:** Supplier lead time

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-75_Service-Model.md` | Create service and model | 67-75 |
| 02 | `02_Tasks-76-80_Alert-Task-Dashboard.md` | Create alert, task, dashboard | 76-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create ReorderService | High | Task 66 |
| 68 | Create safety_stock | Medium | Task 67 |
| 69 | Create reorder_point | Medium | Task 68 |
| 70 | Create lead_time_demand | Medium | Task 69 |
| 71 | Create optimal_order_qty | Medium | Task 70 |
| 72 | Create ReorderSuggestion Model | Medium | Task 71 |
| 73 | Create suggested_qty Field | Low | Task 72 |
| 74 | Create reorder_date Field | Low | Task 72 |
| 75 | Create urgency Field | Low | Task 72 |
| 76 | Create ReorderAlert | Medium | Task 75 |
| 77 | Create generate_suggestions | High | Task 76 |
| 78 | Create ReorderTask | Medium | Task 77 |
| 79 | Create Reorder Dashboard | Medium | Task 78 |
| 80 | Verify Reorder | Low | Task 79 |

---

## Execution Order

```
Task 67: ReorderService
    │
    ▼
Task 68: safety_stock
    │
    ▼
Task 69: reorder_point
    │
    ▼
Task 70: lead_time_demand
    │
    ▼
Task 71: optimal_order_qty
    │
    ▼
Task 72: ReorderSuggestion Model
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-73      T-74      T-75
(Qty)   (Date)  (Urgency)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 76: ReorderAlert
              │
              ▼
       Task 77: generate_suggestions
              │
              ▼
       Task 78: ReorderTask
              │
              ▼
       Task 79: Reorder Dashboard
              │
              ▼
       Task 80: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── forecasting/
            ├── models/
            │   └── reorder_suggestion.py
            ├── services/
            │   └── reorder_service.py
            └── tasks/
                └── reorder_tasks.py
```

---

## Notes for AI Agents

### ReorderService (Task 67)
| Class | ReorderService |
|-------|----------------|
| Purpose | Calculate reorder points |

### safety_stock (Task 68)
| Method | safety_stock(product_id) |
|--------|--------------------------|
| Return | Safety stock units |
| Formula | Z × σ × √L |

### Safety Stock Formula
| Symbol | Meaning |
|--------|---------|
| Z | Service level factor (1.65 for 95%) |
| σ | Demand standard deviation |
| L | Lead time in days |

### Service Level Factors
| Level | Z Value |
|-------|---------|
| 90% | 1.28 |
| 95% | 1.65 |
| 99% | 2.33 |

### reorder_point (Task 69)
| Method | reorder_point(product_id) |
|--------|---------------------------|
| Return | Reorder point units |
| Formula | (D × L) + SS |

### Reorder Point Formula
| Symbol | Meaning |
|--------|---------|
| D | Average daily demand |
| L | Lead time in days |
| SS | Safety stock |

### lead_time_demand (Task 70)
| Method | lead_time_demand(product_id) |
|--------|------------------------------|
| Return | Expected demand during lead time |
| Use | With forecast |

### optimal_order_qty (Task 71)
| Method | optimal_order_qty(product_id) |
|--------|-------------------------------|
| Return | EOQ units |
| Formula | √(2DS/H) |

### EOQ Formula
| Symbol | Meaning |
|--------|---------|
| D | Annual demand |
| S | Order cost |
| H | Holding cost per unit |

### ReorderSuggestion Model (Task 72)
| Class | ReorderSuggestion |
|-------|-------------------|
| Purpose | Store reorder suggestions |
| FK | Product |

### suggested_qty Field (Task 73)
| Field | Type |
|-------|------|
| Name | suggested_qty |
| Type | IntegerField |
| Use | Quantity to order |

### reorder_date Field (Task 74)
| Field | Type |
|-------|------|
| Name | reorder_date |
| Type | DateField |
| Use | When to place order |

### urgency Field (Task 75)
| Field | Type |
|-------|------|
| Name | urgency |
| Type | CharField |
| Choices | low, medium, high, critical |

### Urgency Levels
| Level | Condition |
|-------|-----------|
| CRITICAL | Stock < safety stock |
| HIGH | Stock < reorder point |
| MEDIUM | Stock < 1.5 × ROP |
| LOW | Stock approaching ROP |

### ReorderAlert (Task 76)
| Class | ReorderAlert |
|-------|--------------|
| Purpose | Alert on low stock |
| Channels | Email, dashboard |

### generate_suggestions (Task 77)
| Method | generate_suggestions(tenant) |
|--------|------------------------------|
| Action | Batch generate all suggestions |
| Return | List of ReorderSuggestion |

### ReorderTask (Task 78)
| Task | generate_reorder_suggestions_task |
|------|----------------------------------|
| Type | Celery task |
| Schedule | Daily at 6:00 AM |

### Reorder Dashboard (Task 79)
| Dashboard | Reorder Admin |
|-----------|---------------|
| Features | List, filter, export |
| Filters | Urgency, category |
