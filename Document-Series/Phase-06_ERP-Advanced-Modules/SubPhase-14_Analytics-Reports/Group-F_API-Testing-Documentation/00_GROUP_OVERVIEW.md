# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** F of F  
> **Tasks Covered:** 85-94  
> **Group Goal:** Complete analytics module with admin, ViewSet, URL routes, tests, and documentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Report-Builder-Scheduling](../Group-E_Report-Builder-Scheduling/)
- **→ Next Group:** None (Last Group) | **Next Phase:** [Phase-07_Frontend-Infrastructure-ERP-Dashboard](../../Phase-07_Frontend-Infrastructure-ERP-Dashboard/)

---

## Group Overview

This group completes the analytics and reports module with Django admin configuration, DRF serializers, unified ViewSet, and URL routing. Creates endpoints for listing available reports, generating reports, and downloading generated report files. Implements comprehensive unit tests for all report generators and the scheduler. Provides complete API documentation for the entire analytics system.

### Key Outcomes

- Report admin configuration (definitions, instances, saved, scheduled)
- DRF serializers for all report models
- ReportViewSet (combined)
- List available reports endpoint
- Generate report endpoint (POST)
- Download report endpoint (GET with file)
- Analytics URL routes
- Unit tests for all report generators
- Scheduler tests
- Complete API documentation

### Technology Context

- **Admin:** Django admin with filters and actions
- **Serializers:** Nested representations for reports
- **ViewSet:** Combined for all analytics operations
- **File Download:** FileResponse for report files
- **Documentation:** drf-spectacular OpenAPI

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-85-91_Admin-ViewSet-Routes.md` | Create admin, serializers, ViewSet, and URL routes | 85-91 |
| 02 | `02_Tasks-92-94_Tests-Documentation.md` | Write unit tests and API documentation | 92-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 85 | Create Report Admin | Medium | Task 84 |
| 86 | Create Report Serializers | Medium | Task 85 |
| 87 | Create ReportViewSet | High | Task 86 |
| 88 | Add List Available Reports | Low | Task 87 |
| 89 | Add Generate Report Endpoint | Medium | Task 88 |
| 90 | Add Download Report Endpoint | Medium | Task 89 |
| 91 | Add Analytics URL Routes | Low | Task 90 |
| 92 | Write Report Generator Tests | High | Task 91 |
| 93 | Write Scheduler Tests | High | Task 92 |
| 94 | Create Analytics API Documentation | Medium | Task 93 |

---

## Execution Order

```
Task 85: Create Report Admin
    │
    ▼
Task 86: Create Report Serializers
    │
    ▼
Task 87: Create ReportViewSet
    │
    ▼
Task 88: Add List Available Reports
    │
    ▼
Task 89: Add Generate Report Endpoint
    │
    ▼
Task 90: Add Download Report Endpoint
    │
    ▼
Task 91: Add Analytics URL Routes
    │
    ▼
Task 92: Write Report Generator Tests
    │
    ▼
Task 93: Write Scheduler Tests
    │
    ▼
Task 94: Create Analytics API Documentation
```

---

## Expected Deliverables

```
apps/analytics/
├── admin.py                    # Report admin configuration
├── serializers/
│   ├── __init__.py
│   ├── report.py               # Report serializers
│   └── schedule.py             # Schedule serializers
├── views/
│   └── reports.py              # ReportViewSet (complete)
├── urls.py                     # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_sales_reports.py
│   ├── test_inventory_reports.py
│   ├── test_customer_reports.py
│   ├── test_staff_reports.py
│   └── test_scheduler.py
└── docs/
    └── analytics_api.md        # API documentation
```

---

## Notes for AI Agents

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/reports/` | List available report types |
| GET | `/api/v1/analytics/reports/{code}/` | Get report definition details |
| POST | `/api/v1/analytics/generate/` | Generate a report |
| GET | `/api/v1/analytics/instances/` | List generated reports |
| GET | `/api/v1/analytics/download/{id}/` | Download report file |
| GET | `/api/v1/analytics/saved/` | List saved reports |
| POST | `/api/v1/analytics/saved/` | Create saved report |
| GET | `/api/v1/analytics/scheduled/` | List scheduled reports |
| POST | `/api/v1/analytics/scheduled/` | Create scheduled report |
| GET | `/api/v1/analytics/sales/` | Sales reports endpoint |
| GET | `/api/v1/analytics/inventory/` | Inventory reports endpoint |
| GET | `/api/v1/analytics/customers/` | Customer reports endpoint |
| GET | `/api/v1/analytics/staff/` | Staff reports endpoint |

### Generate Report Request
```json
{
  "report_code": "SALES_BY_PRODUCT",
  "filters": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "category": ["groceries"]
  },
  "format": "PDF"
}
```

### Generate Report Response
```json
{
  "instance_id": 123,
  "status": "GENERATING",
  "estimated_time": 30,
  "download_url": null
}
```

### Report Instance Status Response
```json
{
  "instance_id": 123,
  "status": "COMPLETED",
  "generated_at": "2026-01-27T10:35:00Z",
  "download_url": "/api/v1/analytics/download/123/",
  "format": "PDF",
  "file_size": 125000
}
```

### Django Admin Configuration
- ReportDefinition: List with category filter
- ReportInstance: List with status filter, user filter
- SavedReport: List with owner filter
- ScheduledReport: List with frequency filter, is_active toggle

### Test Coverage Requirements
- Each report generator with sample data
- Filter validation
- Export format generation (PDF, Excel, CSV)
- Empty data handling
- Date range calculations
- Scheduler next_run calculation
- Email sending mock
- History tracking

### Documentation Sections
1. Analytics Overview
2. Available Reports
3. Report Generation API
4. Report Filters Reference
5. Export Formats
6. Saved Reports
7. Scheduled Reports
8. Email Distribution
9. API Reference
10. Error Handling

### Error Response Format
```json
{
  "error": "INVALID_FILTER",
  "message": "start_date is required for this report",
  "details": {
    "field": "start_date",
    "required": true
  }
}
```
