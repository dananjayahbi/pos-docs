# Group E: Pickup & COD

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement pickup scheduling and COD collection reports

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Tracking-Webhooks](../Group-D_Tracking-Webhooks/)
- **→ Next Group:** [Group-F_Admin-Testing](../Group-F_Admin-Testing/)

---

## Group Overview

This group implements pickup scheduling and COD collection. Creates Pickup model with pickup date, time slot (morning/afternoon), and status fields. Creates schedule_pickup API call to Koombiyo with pickup response parser. Creates bulk pickup for scheduling multiple waybills. Creates CODReport model with date range, total collected amount. Creates get_cod_report API call. Creates COD reconciliation to match with orders. Creates COD settlement tracking. Verifies pickup and COD flow.

### Key Outcomes

- Pickup model
- Pickup date field
- Pickup time slot
- Pickup status
- schedule_pickup API
- Pickup response parser
- Bulk pickup
- CODReport model
- Report date range
- Total collected
- get_cod_report API
- COD reconciliation
- COD settlement
- Pickup & COD verified

### Technology Context

- **Pickup:** Schedule collection
- **Time slots:** Morning/afternoon
- **COD:** Cash on Delivery
- **Settlement:** Bank transfer cycles

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-73_Pickup-Model-API.md` | Create pickup model and API | 67-73 |
| 02 | `02_Tasks-74-80_COD-Reconcile-Verify.md` | Create COD and reconciliation | 74-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create Pickup Model | Medium | Task 66 |
| 68 | Create Pickup Date | Low | Task 67 |
| 69 | Create Pickup Time Slot | Low | Task 67 |
| 70 | Create Pickup Status | Low | Task 67 |
| 71 | Create schedule_pickup API | Medium | Task 67 |
| 72 | Create Pickup Response | Low | Task 71 |
| 73 | Create Bulk Pickup | Medium | Task 71 |
| 74 | Create CODReport Model | Medium | Task 66 |
| 75 | Create Report Date Range | Low | Task 74 |
| 76 | Create Total Collected | Low | Task 74 |
| 77 | Create get_cod_report API | Medium | Task 74 |
| 78 | Create COD Reconciliation | High | Task 77 |
| 79 | Create COD Settlement | Medium | Task 78 |
| 80 | Verify Pickup & COD | Low | Task 79 |

---

## Execution Order

```
Task 67: Pickup Model
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-68     T-69     T-70     T-71
(Date)  (Slot)(Status) (API)
    │        │        │        │
    │        │        │        ├────────┐
    │        │        │        ▼        ▼
    │        │        │      T-72     T-73
    │        │        │    (Resp)   (Bulk)
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                    │
                    ▼
           Task 74: CODReport Model
                    │
              ┌─────┼─────┐
              ▼     ▼     ▼
           T-75   T-76   T-77
          (Range)(Total)(API)
              │     │     │
              │     │     ▼
              │     │   T-78
              │     │ (Reconcile)
              │     │     │
              │     │     ▼
              │     │   T-79
              │     │ (Settle)
              │     │     │
              └─────┴─────┘
                    │
                    ▼
              Task 80: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── models/
        │   ├── pickup.py
        │   └── cod_report.py
        └── services/
            ├── pickup_service.py
            └── cod_service.py
```

---

## Notes for AI Agents

### Pickup Model (Task 67)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| pickup_date | DateField |
| time_slot | CharField (choices) |
| status | CharField (choices) |
| waybills | ManyToManyField |

### Pickup Date (Task 68)
| Field | Type |
|-------|------|
| Name | pickup_date |
| Constraint | Future date only |

### Pickup Time Slot (Task 69)
| Slot | Description |
|------|-------------|
| MORNING | 9:00 AM - 12:00 PM |
| AFTERNOON | 1:00 PM - 5:00 PM |

### Pickup Status (Task 70)
| Status | Description |
|--------|-------------|
| PENDING | Awaiting pickup |
| SCHEDULED | Confirmed with courier |
| COMPLETED | Packages collected |
| CANCELLED | Pickup cancelled |

### schedule_pickup API (Task 71)
| Endpoint | POST /pickup/schedule |
|----------|----------------------|
| Payload | date, time_slot, waybills |
| Return | Pickup confirmation |

### Pickup Response (Task 72)
| Parse | Pickup ID |
|-------|-----------|
| Status | Confirmation status |

### Bulk Pickup (Task 73)
| Feature | Multiple waybills |
|---------|-------------------|
| Action | Single pickup request |
| Use | Daily pickup scheduling |

### CODReport Model (Task 74)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| start_date | DateField |
| end_date | DateField |
| total_collected | DecimalField |

### Report Date Range (Task 75)
| Fields | start_date, end_date |
|--------|----------------------|
| Use | Filter COD data |

### Total Collected (Task 76)
| Field | Type |
|-------|------|
| Name | total_collected |
| Currency | LKR |
| Source | Koombiyo report |

### get_cod_report API (Task 77)
| Endpoint | GET /cod/report |
|----------|-----------------|
| Params | start_date, end_date |
| Return | COD collection details |

### COD Reconciliation (Task 78)
| Match | Koombiyo COD with orders |
|-------|--------------------------|
| Check | Amount matches |
| Flag | Discrepancies |

### COD Settlement (Task 79)
| Track | Settlement dates |
|-------|------------------|
| Cycle | Weekly settlement |
| Amount | Net after fees |
