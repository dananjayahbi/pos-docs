# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** F of F  
> **Tasks Covered:** 81-88  
> **Group Goal:** Complete tax reporting module with admin, ViewSet, URL routes, tests, and documentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Filing-Reminders](../Group-E_Filing-Reminders/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-13_Dashboard-KPIs](../../SubPhase-13_Dashboard-KPIs/)

---

## Group Overview

This group completes the tax reporting module with Django admin configuration, DRF serializers, unified ViewSet, and URL routing. Creates comprehensive unit tests for VAT and EPF/ETF returns. Provides complete API documentation for all tax reporting endpoints including return generation, filing, and calendar views.

### Key Outcomes

- TaxConfiguration Django admin
- Tax return serializers (VAT, PAYE, EPF, ETF)
- Combined Tax ViewSet
- Tax calendar endpoint (deadlines overview)
- URL routes registered
- VAT return unit tests
- EPF/ETF return unit tests
- Complete API documentation

### Technology Context

- **Admin:** Django admin with inline editors
- **Serializers:** DRF with nested representations
- **ViewSet:** Combined for all tax operations
- **Documentation:** drf-spectacular OpenAPI
- **Testing:** pytest with pytest-django

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-85_Admin-Serializers-ViewSet.md` | Create admin, serializers, ViewSet, and routes | 81-85 |
| 02 | `02_Tasks-86-88_Tests-Documentation.md` | Write unit tests and API documentation | 86-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create TaxConfig Admin | Medium | Task 80 |
| 82 | Create Tax Return Serializers | Medium | Task 81 |
| 83 | Create Tax ViewSet | High | Task 82 |
| 84 | Add Tax Calendar Endpoint | Medium | Task 83 |
| 85 | Add Tax URL Routes | Low | Task 84 |
| 86 | Write VAT Return Tests | High | Task 85 |
| 87 | Write EPF/ETF Return Tests | High | Task 86 |
| 88 | Create Tax Reporting API Docs | Medium | Task 87 |

---

## Execution Order

```
Task 81: Create TaxConfig Admin
    │
    ▼
Task 82: Create Tax Return Serializers
    │
    ▼
Task 83: Create Tax ViewSet
    │
    ▼
Task 84: Add Tax Calendar Endpoint
    │
    ▼
Task 85: Add Tax URL Routes
    │
    ▼
Task 86: Write VAT Return Tests
    │
    ▼
Task 87: Write EPF/ETF Return Tests
    │
    ▼
Task 88: Create Tax Reporting API Docs
```

---

## Expected Deliverables

```
apps/accounting/
├── admin/
│   └── tax.py                  # Tax admin configuration
├── serializers/
│   ├── vat_return.py
│   ├── paye_return.py
│   ├── epf_return.py
│   ├── etf_return.py
│   └── tax_calendar.py         # Calendar serializer
├── views/
│   └── tax.py                  # Tax ViewSet (complete)
├── urls.py                     # Add tax routes
├── tests/
│   ├── test_vat_return.py      # VAT tests
│   ├── test_paye_return.py     # PAYE tests
│   ├── test_epf_return.py      # EPF tests
│   └── test_etf_return.py      # ETF tests
└── docs/
    └── tax_reporting_api.md    # API documentation
```

---

## Notes for AI Agents

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tax/config/` | Get tax configuration |
| PUT | `/api/v1/tax/config/` | Update tax configuration |
| GET | `/api/v1/tax/periods/` | List tax periods |
| GET | `/api/v1/tax/calendar/` | Tax filing calendar |
| GET | `/api/v1/tax/vat-returns/` | List VAT returns |
| POST | `/api/v1/tax/vat-returns/generate/` | Generate VAT return |
| GET | `/api/v1/tax/vat-returns/{id}/pdf/` | Export VAT PDF |
| GET | `/api/v1/tax/vat-returns/{id}/csv/` | Export VAT CSV |
| GET | `/api/v1/tax/paye-returns/` | List PAYE returns |
| POST | `/api/v1/tax/paye-returns/generate/` | Generate PAYE return |
| GET | `/api/v1/tax/epf-returns/` | List EPF returns |
| POST | `/api/v1/tax/epf-returns/generate/` | Generate EPF C-Form |
| GET | `/api/v1/tax/etf-returns/` | List ETF returns |
| POST | `/api/v1/tax/etf-returns/generate/` | Generate ETF return |
| POST | `/api/v1/tax/submissions/` | Record filing submission |
| GET | `/api/v1/tax/reminders/` | Get pending reminders |

### Tax Calendar Response
```json
{
  "current_month": "February 2026",
  "deadlines": [
    {
      "tax_type": "PAYE",
      "period": "January 2026",
      "due_date": "2026-02-15",
      "status": "PENDING",
      "days_remaining": 5
    },
    {
      "tax_type": "VAT",
      "period": "January 2026",
      "due_date": "2026-02-20",
      "status": "PENDING",
      "days_remaining": 10
    }
  ],
  "overdue": []
}
```

### Test Coverage Requirements
- VAT return generation with sample invoices
- Input/Output VAT calculation accuracy
- SVAT adjustment handling
- PAYE tax bracket calculations
- EPF contribution calculations (8% + 12%)
- ETF contribution calculation (3%)
- Filing deadline calculations
- Reminder generation

### Django Admin Configuration
- TaxConfiguration: Inline with tenant
- TaxPeriodRecord: List with filters
- VATReturn: Read-only with export buttons
- PAYEReturn: Read-only with employee count
- EPFReturn: Read-only with C-Form link
- ETFReturn: Read-only
- TaxSubmission: With document preview

### Documentation Sections
1. Tax Configuration Setup
2. VAT Return API
3. PAYE Return API
4. EPF Return API (C-Form)
5. ETF Return API
6. Tax Calendar API
7. Filing Submissions
8. Reminder System
9. Export Formats (PDF, CSV)
