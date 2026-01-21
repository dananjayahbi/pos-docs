# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Complete dashboard module with layout customization, ViewSet, tests, and documentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_HR-KPIs-Alerts](../Group-E_HR-KPIs-Alerts/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-14_Analytics-Reports](../../SubPhase-14_Analytics-Reports/)

---

## Group Overview

This group completes the dashboard KPI module with user layout customization, unified API endpoints, comprehensive testing, and documentation. Creates DashboardLayout model for storing user widget preferences and positions. Implements DashboardViewSet with endpoints for all KPI categories, combined all-KPIs endpoint, and layout save/load. Writes unit tests for all calculators and provides complete API documentation.

### Key Outcomes

- DashboardLayout model for user customization
- Widget positions and config JSONField
- Dashboard serializers for all KPIs
- DashboardViewSet (combined)
- All KPIs endpoint (GET /dashboard/all/)
- Save layout endpoint (PUT /dashboard/layout/)
- Dashboard URL routes
- Unit tests for all KPI calculators
- Complete API documentation

### Technology Context

- **Customization:** Per-user widget layout storage
- **Serializers:** Nested KPI response structures
- **ViewSet:** Combined for all dashboard operations
- **Documentation:** drf-spectacular OpenAPI

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-88_Layout-ViewSet-Routes.md` | Create DashboardLayout model, ViewSet, and URL routes | 81-88 |
| 02 | `02_Tasks-89-90_Tests-Documentation.md` | Write unit tests and API documentation | 89-90 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create DashboardLayout Model | Medium | Task 80 |
| 82 | Add Layout Widgets JSON | Medium | Task 81 |
| 83 | Run Layout Migrations | Low | Task 82 |
| 84 | Create Dashboard Serializers | Medium | Task 83 |
| 85 | Create DashboardViewSet | High | Task 84 |
| 86 | Add All KPIs Endpoint | Medium | Task 85 |
| 87 | Add Save Layout Endpoint | Medium | Task 86 |
| 88 | Add Dashboard URL Routes | Low | Task 87 |
| 89 | Write KPI Calculator Tests | High | Task 88 |
| 90 | Create Dashboard API Documentation | Medium | Task 89 |

---

## Execution Order

```
Task 81: Create DashboardLayout Model
    │
    ▼
Task 82: Add Layout Widgets JSON
    │
    ▼
Task 83: Run Layout Migrations
    │
    ▼
Task 84: Create Dashboard Serializers
    │
    ▼
Task 85: Create DashboardViewSet
    │
    ▼
Task 86: Add All KPIs Endpoint
    │
    ▼
Task 87: Add Save Layout Endpoint
    │
    ▼
Task 88: Add Dashboard URL Routes
    │
    ▼
Task 89: Write KPI Calculator Tests
    │
    ▼
Task 90: Create Dashboard API Documentation
```

---

## Expected Deliverables

```
apps/dashboard/
├── models/
│   ├── __init__.py
│   ├── kpi_definition.py
│   ├── kpi_alert.py
│   └── dashboard_layout.py    # DashboardLayout model
├── serializers/
│   ├── __init__.py
│   ├── kpi.py                 # KPI serializers
│   └── layout.py              # Layout serializer
├── views/
│   └── dashboard.py           # DashboardViewSet (complete)
├── urls.py                    # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_sales_kpi.py
│   ├── test_inventory_kpi.py
│   ├── test_financial_kpi.py
│   └── test_hr_kpi.py
├── migrations/
│   └── 0003_dashboardlayout.py
└── docs/
    └── dashboard_api.md       # API documentation
```

---

## Notes for AI Agents

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/all/` | All KPIs combined |
| GET | `/api/v1/dashboard/sales/` | Sales KPIs |
| GET | `/api/v1/dashboard/inventory/` | Inventory KPIs |
| GET | `/api/v1/dashboard/financial/` | Financial KPIs |
| GET | `/api/v1/dashboard/hr/` | HR KPIs |
| GET | `/api/v1/dashboard/alerts/` | Active alerts |
| GET | `/api/v1/dashboard/layout/` | Get user layout |
| PUT | `/api/v1/dashboard/layout/` | Save user layout |
| GET | `/api/v1/dashboard/kpis/` | KPI definitions list |

### DashboardLayout Model Fields
- user: FK to User (OneToOne)
- widgets: JSONField (positions and config)
- created_at: DateTime
- updated_at: DateTime

### Widget Configuration Structure
```json
{
  "widgets": [
    {
      "id": "widget_1",
      "kpi_code": "SALES_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 0, "y": 0, "w": 2, "h": 1},
      "config": {
        "show_trend": true,
        "comparison": "yesterday"
      }
    },
    {
      "id": "widget_2",
      "kpi_code": "SALES_TREND",
      "widget_type": "CHART",
      "position": {"x": 2, "y": 0, "w": 4, "h": 2},
      "config": {
        "chart_type": "line",
        "period": "week"
      }
    }
  ]
}
```

### All KPIs Response Structure
```json
{
  "sales": {...},
  "inventory": {...},
  "financial": {...},
  "hr": {...},
  "alerts": [...],
  "last_updated": "2026-01-27T10:30:00Z"
}
```

### Test Coverage Requirements
- Each calculator method tested
- Cache hit/miss scenarios
- Comparison calculations
- Empty data handling
- Permission-based access
- Layout save/load

### Documentation Sections
1. Dashboard Overview
2. KPI Categories and Definitions
3. Sales KPIs API
4. Inventory KPIs API
5. Financial KPIs API
6. HR KPIs API
7. Alert Configuration
8. Layout Customization
9. Caching Strategy
10. Real-time Updates (WebSocket optional)

### Role-Based KPI Access
| Role | Sales | Inventory | Financial | HR |
|------|-------|-----------|-----------|-----|
| Admin | ✓ | ✓ | ✓ | ✓ |
| Manager | ✓ | ✓ | ✓ | Limited |
| Accountant | ✓ | - | ✓ | - |
| Cashier | ✓ | - | - | - |
| HR | - | - | - | ✓ |
