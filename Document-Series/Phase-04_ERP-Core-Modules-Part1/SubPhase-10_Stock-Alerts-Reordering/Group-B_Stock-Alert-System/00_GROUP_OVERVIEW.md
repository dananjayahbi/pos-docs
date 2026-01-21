# Group B: Stock Alert System

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement alert models and multi-channel notification delivery

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Stock Configuration Models](../Group-A_Stock-Configuration-Models/)
- **→ Next Group:** [Group C: Scheduled Monitoring Tasks](../Group-C_Scheduled-Monitoring-Tasks/)

---

## Group Overview

### Key Outcomes

1. **Alert Type Constants** - LOW_STOCK, CRITICAL_STOCK, OUT_OF_STOCK, BACK_IN_STOCK
2. **Alert Status Constants** - ACTIVE, ACKNOWLEDGED, RESOLVED, SNOOZED
3. **StockAlert Model** - Track and manage stock alerts
4. **Warehouse-Specific Alerts** - Alerts tied to specific warehouses
5. **Threshold and Stock Tracking** - Store values that triggered alert
6. **Alert Lifecycle Timestamps** - Created, resolved, acknowledged tracking
7. **Snooze Functionality** - Snooze alerts until specific datetime
8. **Alert Deduplication** - Prevent duplicate alerts for same product/type
9. **AlertNotificationService** - Multi-channel notification delivery
10. **Email, Dashboard, SMS Alerts** - Configurable notification channels
11. **Alert Templates** - Email/notification templates for each type
12. **StockAlert Admin** - Admin with filters and bulk acknowledge

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | StockAlert model with comprehensive indexes |
| Django Signals | Trigger notifications on alert creation |
| Celery | Async notification delivery |
| Email Backend | Alert email sending |
| SMS Provider | Optional SMS alerts integration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-22_Alert-Constants-Model.md` | 17-22 | Alert/status constants, StockAlert model, warehouse FK, fields |
| 02 | `02_Tasks-23-28_Lifecycle-Manager-Deduplication.md` | 23-28 | Timestamps, acknowledged_by, snooze, Meta, manager, deduplication |
| 03 | `03_Tasks-29-34_Notification-Service-Admin.md` | 29-34 | AlertNotificationService, email/dashboard/SMS, templates, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Define alert type constants | Low | 10 min |
| 18 | Define alert status constants | Low | 10 min |
| 19 | Create StockAlert model | Medium | 30 min |
| 20 | Add warehouse FK | Low | 15 min |
| 21 | Add threshold fields | Low | 15 min |
| 22 | Add current stock field | Low | 15 min |
| 23 | Add created/resolved timestamps | Low | 15 min |
| 24 | Add acknowledged_by FK | Low | 10 min |
| 25 | Add snooze functionality | Medium | 20 min |
| 26 | Create StockAlert Meta class | Low | 15 min |
| 27 | Add StockAlert manager | Medium | 25 min |
| 28 | Create alert deduplication | Medium | 25 min |
| 29 | Create AlertNotificationService | High | 30 min |
| 30 | Implement email alert | Medium | 25 min |
| 31 | Implement dashboard notification | Medium | 20 min |
| 32 | Implement SMS alert (optional) | Medium | 25 min |
| 33 | Create alert templates | Medium | 25 min |
| 34 | Create StockAlert admin | Medium | 25 min |

---

## Execution Order

```
[Tasks 17-18: Alert type and status constants]
         │
         ▼
[Tasks 19-22: StockAlert model with core fields]
         │
         ▼
[Tasks 23-25: Lifecycle timestamps and snooze]
         │
         ▼
[Tasks 26-28: Meta class, manager, deduplication]
         │
         ▼
[Tasks 29-32: AlertNotificationService and channels]
         │
         ▼
[Tasks 33-34: Templates and admin]
```

---

## Expected Deliverables

```
apps/inventory/alerts/
├── models/
│   ├── __init__.py
│   └── stock_alert.py            # Tasks 19-28
├── services/
│   ├── __init__.py
│   └── notification.py           # Tasks 29-32
├── constants.py                  # Tasks 17-18 (added)
├── admin.py                      # Task 34 (added)
└── templates/
    └── emails/
        ├── low_stock_alert.html  # Task 33
        ├── critical_stock.html
        └── back_in_stock.html
```

---

## Notes for AI Agents

### Alert Types
| Type | Trigger Condition | Priority |
|------|-------------------|----------|
| LOW_STOCK | stock ≤ low_stock_threshold | Medium |
| CRITICAL_STOCK | stock ≤ low_stock_threshold × 0.5 | High |
| OUT_OF_STOCK | available_quantity ≤ 0 | Critical |
| BACK_IN_STOCK | Was OOS, now stock > 0 | Info |

### Alert Status Flow
```
         ┌──────────────────┐
         │      ACTIVE      │ ← Alert created
         └────────┬─────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ACKNOWLEDGED│ │ SNOOZED │ │ RESOLVED │
└──────────┘ └──────────┘ └──────────┘
      │           │
      │           │ (snooze expires)
      └───────────┼───────────┘
                  ▼
            Back to ACTIVE
```

### StockAlert Fields
- product FK: Link to product
- variant FK (optional): Link to variant
- warehouse FK (optional): Specific warehouse or all
- alert_type: Type of alert
- status: Current status
- threshold_value: Threshold that was breached
- current_stock: Stock level when alert created
- created_at: Auto timestamp
- resolved_at: When resolved (nullable)
- acknowledged_at: When acknowledged (nullable)
- acknowledged_by: User who acknowledged
- snoozed_until: Datetime to snooze until (nullable)

### Manager Methods
- get_active(): All active alerts
- get_by_product(product): Alerts for specific product
- get_unacknowledged(): Active, unacknowledged alerts
- get_snoozed_expired(): Snoozed alerts past snooze time

### Deduplication Logic
- Before creating alert, check for existing ACTIVE alert with same:
  - product
  - alert_type
  - warehouse (or both NULL)
- If exists, don't create duplicate
- Update existing alert's current_stock if changed significantly
