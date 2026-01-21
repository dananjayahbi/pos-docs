# Group E: Serializers & API Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** E of F  
> **Tasks Covered:** 69-80  
> **Group Goal:** Create DRF serializers and viewsets for alerts and reordering API

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Reorder Suggestions & Automation](../Group-D_Reorder-Suggestions-Automation/)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **ProductStockConfigSerializer** - Config with inheritance info
2. **StockAlertSerializer** - Product info, alert details
3. **ReorderSuggestionSerializer** - Velocity, days until stockout
4. **AlertDashboardSerializer** - Summary for dashboard widget
5. **ProductStockConfigViewSet** - Config CRUD operations
6. **StockAlertViewSet** - Acknowledge, snooze, resolve actions
7. **ReorderSuggestionViewSet** - Convert-to-PO action
8. **Alert Dashboard Endpoint** - Summary stats
9. **Product Alerts Endpoint** - Product's alerts
10. **Bulk Config Update Endpoint** - Mass config updates
11. **Reorder Report Endpoint** - Filtered report
12. **Stock Health Endpoint** - Overall health score

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | Serializers, ViewSets, routers |
| django-filter | Filter backends for queries |
| Custom Actions | ViewSet actions for operations |
| Aggregation | Summary calculations for dashboard |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-69-72_Serializers.md` | 69-72 | Config, Alert, Suggestion, Dashboard serializers |
| 02 | `02_Tasks-73-77_ViewSets.md` | 73-77 | Config, Alert, Suggestion ViewSets, dashboard/product endpoints |
| 03 | `03_Tasks-78-80_Additional-Endpoints.md` | 78-80 | Bulk config, reorder report, stock health endpoints |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create ProductStockConfigSerializer | Medium | 25 min |
| 70 | Create StockAlertSerializer | Medium | 25 min |
| 71 | Create ReorderSuggestionSerializer | Medium | 25 min |
| 72 | Create AlertDashboardSerializer | Medium | 20 min |
| 73 | Create ProductStockConfigViewSet | Medium | 25 min |
| 74 | Create StockAlertViewSet | High | 30 min |
| 75 | Create ReorderSuggestionViewSet | High | 30 min |
| 76 | Add alert dashboard endpoint | Medium | 25 min |
| 77 | Add product alerts endpoint | Medium | 20 min |
| 78 | Add bulk config update endpoint | Medium | 25 min |
| 79 | Add reorder report endpoint | Medium | 25 min |
| 80 | Add stock health endpoint | Medium | 25 min |

---

## Execution Order

```
[Tasks 69-72: All serializers]
         │
         ▼
[Tasks 73-75: Core ViewSets]
         │
         ▼
[Tasks 76-77: Dashboard and product endpoints]
         │
         ▼
[Tasks 78-80: Additional endpoints]
```

---

## Expected Deliverables

```
apps/inventory/alerts/
├── serializers/
│   ├── __init__.py
│   ├── config.py                 # Task 69
│   ├── alert.py                  # Tasks 70, 72
│   └── reorder.py                # Task 71
├── views/
│   ├── __init__.py
│   ├── config.py                 # Tasks 73, 78
│   ├── alert.py                  # Tasks 74, 76-77
│   └── reorder.py                # Tasks 75, 79-80
└── urls.py                       # All routes
```

---

## Notes for AI Agents

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | /api/stock-config/ | Stock config CRUD |
| PATCH | /api/stock-config/bulk/ | Bulk config update |
| GET | /api/stock-alerts/ | List alerts with filters |
| POST | /api/stock-alerts/{id}/acknowledge/ | Acknowledge alert |
| POST | /api/stock-alerts/{id}/snooze/ | Snooze alert |
| POST | /api/stock-alerts/{id}/resolve/ | Resolve alert |
| GET | /api/alerts/dashboard/ | Dashboard summary |
| GET | /api/products/{id}/alerts/ | Product's alerts |
| GET | /api/reorder-suggestions/ | List suggestions |
| POST | /api/reorder-suggestions/{id}/convert-to-po/ | Create PO |
| POST | /api/reorder-suggestions/{id}/dismiss/ | Dismiss |
| GET | /api/reorder/report/ | Reorder report |
| GET | /api/inventory/health/ | Stock health score |

### ProductStockConfigSerializer Fields
- id, product (nested), warehouse (nested)
- low_stock_threshold, reorder_point, reorder_quantity
- auto_hide_when_oos, allow_backorder
- effective_config (SerializerMethodField for inherited values)

### StockAlertSerializer Fields
- id, product (nested), variant (optional), warehouse
- alert_type, status, priority
- threshold_value, current_stock
- created_at, resolved_at, acknowledged_at
- acknowledged_by, snoozed_until

### AlertDashboardSerializer Fields
- total_active_alerts
- by_type: {LOW_STOCK: n, CRITICAL_STOCK: n, OUT_OF_STOCK: n}
- by_status: {ACTIVE: n, ACKNOWLEDGED: n, SNOOZED: n}
- recent_alerts (last 5)
- products_at_risk (top 10 by urgency)

### Stock Health Score Calculation
```
Health = 100 - oos_penalty - low_penalty

Where:
oos_penalty = (oos_count / total_products) × 50
low_penalty = (low_count / total_products) × 30
```

### Permissions
- StockConfig: Requires inventory management permission
- StockAlerts: Read for staff, write for managers
- ReorderSuggestions: Read for staff, convert for buyers
