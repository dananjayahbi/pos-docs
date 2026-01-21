# Group D: Stock Take & Adjustments

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** D of F  
> **Tasks Covered:** 57-72  
> **Group Goal:** Implement physical inventory counting and variance handling

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Stock Operations Services](../Group-C_Stock-Operations-Services/)
- **→ Next Group:** [Group E: Serializers & API Views](../Group-E_Serializers-API-Views/)

---

## Group Overview

### Key Outcomes

1. **StockTake Model** - Track physical inventory counting sessions
2. **Stock Take Status** - DRAFT, IN_PROGRESS, COUNTING, REVIEW, COMPLETED, CANCELLED
3. **Stock Take Scope** - FULL (all products) or PARTIAL (selected)
4. **StockTakeItem Model** - Individual counted items with expected vs counted
5. **Variance Calculation** - Calculate quantity and percentage variance
6. **StockTakeService** - Manage stock take lifecycle
7. **Variance Approval Workflow** - Require approval for significant variances
8. **Stock Take Report** - Generate PDF/Excel reports
9. **Blind Count Support** - Hide expected quantity during counting
10. **Cycle Count Scheduling** - Schedule partial counts on rotating basis

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | StockTake and StockTakeItem models |
| Celery | Async report generation and scheduled counts |
| WeasyPrint/openpyxl | PDF and Excel report generation |
| Django Signals | Trigger adjustments on stock take completion |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-57-62_Stock-Take-Models.md` | 57-62 | StockTake model, status, scope, StockTakeItem, variance calc |
| 02 | `02_Tasks-63-68_Take-Service-Lifecycle.md` | 63-68 | Counted_by, timestamps, StockTakeService, start/record/complete |
| 03 | `03_Tasks-69-72_Approval-Reports-Scheduling.md` | 69-72 | Variance approval, reports, blind count, cycle count |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create StockTake model | Medium | 30 min |
| 58 | Add stock take status field | Low | 15 min |
| 59 | Add stock take scope | Low | 15 min |
| 60 | Create StockTakeItem model | Medium | 30 min |
| 61 | Add variance calculation | Medium | 15 min |
| 62 | Add variance percentage | Low | 15 min |
| 63 | Add counted_by FK | Low | 10 min |
| 64 | Add counted_at timestamp | Low | 10 min |
| 65 | Create StockTakeService | Medium | 30 min |
| 66 | Implement start_stock_take | Medium | 30 min |
| 67 | Implement record_count | Medium | 20 min |
| 68 | Implement complete_stock_take | High | 35 min |
| 69 | Create variance approval workflow | High | 30 min |
| 70 | Generate stock take report | High | 35 min |
| 71 | Add blind count support | Medium | 20 min |
| 72 | Create cycle count scheduling | High | 30 min |

---

## Execution Order

```
[Tasks 57-59: StockTake model with status and scope]
         │
         ▼
[Tasks 60-62: StockTakeItem model with variance calculation]
         │
         ▼
[Tasks 63-64: Counted_by FK and timestamp]
         │
         ▼
[Tasks 65-68: StockTakeService lifecycle methods]
         │
         ▼
[Task 69: Variance approval workflow]
         │
         ▼
[Task 70: Report generation]
         │
         ▼
[Tasks 71-72: Blind count and cycle count scheduling]
```

---

## Expected Deliverables

```
apps/inventory/stock/
├── models/
│   ├── __init__.py
│   ├── stock_take.py             # Tasks 57-59
│   └── stock_take_item.py        # Tasks 60-64
├── services/
│   ├── stock_take_service.py     # Tasks 65-69, 71
│   └── reports.py                # Task 70
└── tasks.py                      # Task 72 (Celery tasks)
```

---

## Notes for AI Agents

### Stock Take Status Flow
```
DRAFT → IN_PROGRESS → COUNTING → REVIEW → COMPLETED
  │                                          │
  └─────────► CANCELLED ◄────────────────────┘
```

- **DRAFT**: Stock take created, items being added
- **IN_PROGRESS**: Active counting session started
- **COUNTING**: Physical counting in progress
- **REVIEW**: Variances under review/approval
- **COMPLETED**: Adjustments applied
- **CANCELLED**: Stock take cancelled

### Variance Calculation
```
variance = counted_qty - expected_qty
variance_percentage = (variance / expected_qty) * 100 if expected_qty else 0
```

### Auto-Approval Rules (Configurable)
- AUTO_APPROVE_THRESHOLD = 5 units
- AUTO_APPROVE_PERCENTAGE = 2%
- If variance within thresholds: auto-approve
- Otherwise: require manager approval

### Blind Count
- Hide expected_qty during counting phase
- Reveal only during review phase
- Reduces bias in counting

### Cycle Count
- Schedule partial counts on rotating basis
- ABC analysis: count A items weekly, B monthly, C quarterly
- Track last_counted_at per product/location
