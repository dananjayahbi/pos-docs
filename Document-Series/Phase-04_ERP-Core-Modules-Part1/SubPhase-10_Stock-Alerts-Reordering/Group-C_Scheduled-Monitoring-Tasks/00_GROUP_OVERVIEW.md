# Group C: Scheduled Monitoring Tasks

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement Celery tasks for automated stock monitoring

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Stock Alert System](../Group-B_Stock-Alert-System/)
- **→ Next Group:** [Group D: Reorder Suggestions & Automation](../Group-D_Reorder-Suggestions-Automation/)

---

## Group Overview

### Key Outcomes

1. **Stock Monitoring Task** - Celery task to check all product stock levels
2. **Batch Processing** - Process products in batches to avoid memory issues
3. **Low Stock Check** - Compare stock level to low_stock_threshold
4. **Critical Stock Check** - Compare to critical threshold (50% of low)
5. **Out of Stock Check** - Check for zero/negative available quantity
6. **Alert Generation Logic** - Create StockAlert if threshold breached
7. **Alert Resolution Logic** - Resolve alerts when stock replenished
8. **Back in Stock Detection** - Detect and alert when OOS product restocked
9. **Scheduled Task Configuration** - Celery Beat for periodic execution
10. **Configurable Frequency** - Tenant-configurable check frequency
11. **Monitoring Exclusions** - Option to exclude products from monitoring
12. **Alert Throttling** - Limit notifications to prevent spam
13. **Webhook Notifications** - Send alerts to external systems

### Technology Context

| Technology | Purpose |
|------------|---------|
| Celery | Async task execution for monitoring |
| Celery Beat | Scheduled task configuration |
| Django ORM | Batch query processing |
| Redis | Celery broker and result backend |
| Webhooks | External system integration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-40_Monitoring-Task-Checks.md` | 35-40 | Stock monitoring task, batch processing, threshold checks, alert generation |
| 02 | `02_Tasks-41-45_Resolution-Scheduling-Logging.md` | 41-45 | Alert resolution, back in stock, scheduling, frequency, logging |
| 03 | `03_Tasks-46-50_Exclusions-Throttling-Webhooks.md` | 46-50 | Exclusions, warehouse checks, throttling, dashboard data, webhooks |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create stock monitoring task | High | 30 min |
| 36 | Add batch processing | Medium | 25 min |
| 37 | Implement low stock check | Medium | 20 min |
| 38 | Implement critical stock check | Medium | 20 min |
| 39 | Implement out of stock check | Low | 15 min |
| 40 | Create alert generation logic | Medium | 25 min |
| 41 | Create alert resolution logic | Medium | 25 min |
| 42 | Implement back in stock detection | Medium | 20 min |
| 43 | Schedule monitoring task | Medium | 20 min |
| 44 | Add configurable frequency | Medium | 20 min |
| 45 | Create monitoring log | Medium | 20 min |
| 46 | Add monitoring exclusions | Medium | 20 min |
| 47 | Create warehouse-specific checks | Medium | 25 min |
| 48 | Add alert throttling | Medium | 25 min |
| 49 | Create monitoring dashboard data | Medium | 25 min |
| 50 | Add webhook notifications | High | 30 min |

---

## Execution Order

```
[Tasks 35-36: Stock monitoring task with batch processing]
         │
         ▼
[Tasks 37-39: Low, critical, out of stock checks]
         │
         ▼
[Tasks 40-42: Alert generation, resolution, back in stock]
         │
         ▼
[Tasks 43-45: Scheduling, frequency, logging]
         │
         ▼
[Tasks 46-48: Exclusions, warehouse checks, throttling]
         │
         ▼
[Tasks 49-50: Dashboard data and webhooks]
```

---

## Expected Deliverables

```
apps/inventory/alerts/
├── tasks/
│   ├── __init__.py
│   └── stock_monitor.py          # Tasks 35-50
├── models/
│   └── monitoring_log.py         # Task 45
└── services/
    └── webhook.py                # Task 50
```

---

## Notes for AI Agents

### Monitoring Task Flow
1. Get all active products for tenant
2. Exclude products with monitoring_excluded=True
3. Process in batches (e.g., 100 products per batch)
4. For each product:
   - Get effective config (thresholds)
   - Get current stock levels
   - Compare against thresholds
   - Generate or resolve alerts as needed
5. Log monitoring run stats

### Threshold Checks
- **Low Stock**: stock ≤ low_stock_threshold
- **Critical Stock**: stock ≤ low_stock_threshold × 0.5
- **Out of Stock**: available_quantity ≤ 0

### Alert Resolution
- When stock replenished above threshold, resolve existing alert
- Set resolved_at timestamp
- Change status to RESOLVED
- Don't delete - keep for history

### Celery Beat Configuration
```python
CELERY_BEAT_SCHEDULE = {
    'stock-monitor-hourly': {
        'task': 'apps.inventory.alerts.tasks.run_stock_monitoring',
        'schedule': crontab(minute=0),  # Every hour
    },
}
```

### Alert Throttling
- Track last notification time per alert
- Don't re-notify within throttle period (e.g., 24 hours)
- Allow override for critical alerts

### Webhook Payload
```json
{
    "event": "stock_alert",
    "alert_type": "LOW_STOCK",
    "product": {
        "id": "...",
        "name": "...",
        "sku": "..."
    },
    "warehouse": "...",
    "current_stock": 5,
    "threshold": 10,
    "timestamp": "2024-01-15T10:00:00Z"
}
```
