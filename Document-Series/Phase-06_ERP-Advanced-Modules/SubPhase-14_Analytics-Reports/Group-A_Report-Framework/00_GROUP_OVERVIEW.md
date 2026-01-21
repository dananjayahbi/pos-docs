# Group A: Report Framework

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create analytics app with report definitions and instance tracking models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Sales-Reports](../Group-B_Sales-Reports/)

---

## Group Overview

This group establishes the foundational framework for the business analytics and reporting system. Creates the analytics Django app with enumerations for report categories, formats, and statuses. Implements the ReportDefinition model to define available report types with their parameters, filters, and permission requirements. Creates the ReportInstance model for tracking generated reports with their filter parameters, output files, and generation status.

### Key Outcomes

- Analytics Django app created
- App registered in TENANT_APPS
- ReportCategory enum (SALES, INVENTORY, PURCHASE, CUSTOMER, STAFF)
- ReportFormat enum (PDF, EXCEL, CSV, JSON)
- ReportStatus enum (PENDING, GENERATING, COMPLETED, FAILED)
- ReportDefinition model
- Definition name, code, description fields
- Category field using ReportCategory
- Available filters JSONField
- Required permission field
- ReportInstance model
- Filter parameters JSONField
- Output file and format fields
- Status, generated_at, error_message fields

### Technology Context

- **Report Generation:** Async via Celery for long reports
- **Export Formats:** WeasyPrint (PDF), openpyxl (Excel)
- **File Storage:** Django file storage for output files
- **Status Tracking:** Full lifecycle from PENDING to COMPLETED

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Analytics-App-Enums.md` | Create analytics app and define enums | 01-08 |
| 02 | `02_Tasks-09-16_Definition-Instance-Models.md` | Create ReportDefinition and ReportInstance models | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create analytics App | Low | None |
| 02 | Register analytics App | Low | Task 01 |
| 03 | Define ReportCategory Enum | Low | Task 02 |
| 04 | Define ReportFormat Enum | Low | Task 03 |
| 05 | Define ReportStatus Enum | Low | Task 04 |
| 06 | Create ReportDefinition Model | Medium | Task 05 |
| 07 | Add Definition Name Field | Low | Task 06 |
| 08 | Add Definition Category | Low | Task 06 |
| 09 | Add Definition Parameters | Medium | Task 06 |
| 10 | Add Definition Permissions | Low | Task 06 |
| 11 | Run ReportDefinition Migrations | Low | Task 10 |
| 12 | Create ReportInstance Model | Medium | Task 11 |
| 13 | Add Instance Parameters | Low | Task 12 |
| 14 | Add Instance Output | Low | Task 12 |
| 15 | Add Instance Status | Low | Task 12 |
| 16 | Run ReportInstance Migrations | Low | Task 15 |

---

## Execution Order

```
Task 01: Create analytics App
    │
    ▼
Task 02: Register in TENANT_APPS
    │
    ▼
Tasks 03-05: Define Enums
(ReportCategory, ReportFormat, ReportStatus)
    │
    ▼
Task 06: Create ReportDefinition Model
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Tasks 07-09: Definition Fields          Task 10: Permissions
(name, category, parameters)
    │                                             │
    └─────────────────────┬───────────────────────┘
                          ▼
                     Task 11: Run ReportDefinition Migrations
                          │
                          ▼
                     Task 12: Create ReportInstance Model
                          │
                          ├─────────────────────┐
                          ▼                     ▼
                     Tasks 13-14           Task 15
                     (params, output)      (status)
                          │                     │
                          └─────────┬───────────┘
                                    ▼
                               Task 16: Run Migrations
```

---

## Expected Deliverables

```
apps/analytics/
├── __init__.py
├── admin.py
├── apps.py
├── models/
│   ├── __init__.py
│   ├── report_definition.py   # ReportDefinition model
│   └── report_instance.py     # ReportInstance model
├── fixtures/
│   └── report_definitions.json # Default report types
└── migrations/
    └── 0001_initial.py
```

---

## Notes for AI Agents

### ReportCategory Enum Values
- SALES: Revenue and transaction reports
- INVENTORY: Stock and movement reports
- PURCHASE: Vendor and purchasing reports
- CUSTOMER: Customer analytics reports
- STAFF: HR and employee reports

### ReportFormat Enum Values
- PDF: Formatted, print-ready document
- EXCEL: Spreadsheet with data and formulas
- CSV: Simple comma-separated data
- JSON: Structured data for API use

### ReportStatus Enum Values
- PENDING: Report requested, waiting to generate
- GENERATING: Report generation in progress
- COMPLETED: Successfully generated
- FAILED: Generation failed with error

### ReportDefinition Model Fields
- name: Human-readable name
- code: Unique identifier (e.g., "SALES_BY_PRODUCT")
- description: Detailed description
- category: ReportCategory enum
- available_filters: JSONField defining filter options
- required_permission: Permission codename
- is_active: Boolean for enabling/disabling

### Available Filters Structure
```json
{
  "date_range": {"type": "date_range", "required": true},
  "category": {"type": "multi_select", "model": "Product.category"},
  "product": {"type": "multi_select", "model": "Product"},
  "location": {"type": "single_select", "model": "Warehouse"}
}
```

### ReportInstance Model Fields
- report_definition: FK to ReportDefinition
- user: FK to User (who requested)
- filter_parameters: JSONField (applied filters)
- output_format: ReportFormat enum
- output_file: FileField (generated file)
- status: ReportStatus enum
- generated_at: DateTime (completion time)
- error_message: TextField (if failed)
- created_at: DateTime
