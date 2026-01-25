# Tasks 01-08: Analytics App and Enumerations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** A - Report Framework  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Definition-Instance-Models.md](02_Tasks-09-16_Definition-Instance-Models.md)

---

## Document Overview

This document covers the creation of the analytics Django app and the definition of core enumerations for the reporting system. These elements establish the foundation for business analytics and report generation, including report categories, output formats, and generation status tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create analytics app | Low | 10 min |
| 02 | Register analytics in TENANT_APPS | Low | 5 min |
| 03 | Define ReportCategory enum | Low | 15 min |
| 04 | Define ReportFormat enum | Low | 10 min |
| 05 | Define ReportStatus enum | Low | 10 min |
| 06 | Create enums module structure | Low | 5 min |
| 07 | Add enum documentation | Low | 10 min |
| 08 | Verify enum implementation | Low | 5 min |

---

## Task 01: Create Analytics App

### Overview
Create the `analytics` Django app to house all business reporting and analytics functionality. This app will contain report definitions, report instances, data aggregation logic, and export mechanisms for various report formats.

### Dependencies
- Django project structure established
- Multi-tenancy infrastructure configured
- Core apps (inventory, sales, customers, etc.) exist

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Navigate to `apps/` directory
   - This is where all Django apps are organized

2. **Create analytics app**
   - Run Django's startapp command
   - Command: `python manage.py startapp analytics apps/analytics`
   - Creates standard Django app structure

3. **Verify app structure created**
   - Confirm `apps/analytics/` directory exists
   - Verify standard files: `__init__.py`, `apps.py`, `models.py`, `views.py`, `admin.py`

4. **Create models subdirectory**
   - Create `models/` directory inside `analytics/`
   - This will organize multiple model files
   - Delete default `models.py` file

5. **Create models package initialization**
   - Create `__init__.py` in `models/` directory
   - Leave empty initially (will import models later)

6. **Create enums module**
   - Create `enums.py` in `analytics/` directory
   - Will contain ReportCategory, ReportFormat, ReportStatus

7. **Create services directory**
   - Create `services/` directory inside `analytics/`
   - Will contain report generation logic
   - Create `__init__.py` in services directory

8. **Create tasks module**
   - Create `tasks.py` in `analytics/` directory
   - Will contain Celery tasks for async report generation

9. **Update apps.py configuration**
   - Open `apps/analytics/apps.py`
   - Ensure app name is `apps.analytics`
   - Add verbose_name: "Analytics & Reports"

### Analytics App Directory Structure
```
apps/analytics/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration
├── admin.py                       # Admin interface registration
├── enums.py                       # Enum definitions
├── tasks.py                       # Celery tasks
├── models/
│   └── __init__.py               # Models package init
├── services/
│   └── __init__.py               # Services package init
└── migrations/
    └── __init__.py               # Migrations directory
```

### App Purpose and Responsibilities

| Component | Purpose |
|-----------|---------|
| `enums.py` | Report categories, formats, status values |
| `models/` | ReportDefinition, ReportInstance models |
| `services/` | Report generation, data aggregation |
| `tasks.py` | Async report generation with Celery |
| `admin.py` | Administrative interfaces |

### Analytics App Features Overview

```
┌─────────────────────────────────────────────────┐
│           Analytics App Architecture            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Report Definitions                             │
│  ├── Sales reports                              │
│  ├── Inventory reports                          │
│  ├── Purchase reports                           │
│  ├── Customer reports                           │
│  └── Staff reports                              │
│                                                 │
│  Report Generation                              │
│  ├── Data aggregation                           │
│  ├── Filter application                         │
│  ├── Format conversion (PDF, Excel, CSV)        │
│  └── File storage                               │
│                                                 │
│  Report Scheduling                              │
│  ├── Recurring reports                          │
│  ├── Email delivery                             │
│  └── Automatic generation                       │
│                                                 │
│  Report History                                 │
│  ├── Generated reports tracking                 │
│  ├── Generation status                          │
│  └── Error logging                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Clean Django app structure
- Organized directory layout
- Foundation for analytics functionality
- Ready for model and service implementation

### Verification Checklist
- [ ] `apps/analytics/` directory exists
- [ ] `apps.py` configured with correct name
- [ ] `models/` directory created
- [ ] `models/__init__.py` exists
- [ ] `enums.py` file created
- [ ] `services/` directory created
- [ ] `services/__init__.py` exists
- [ ] `tasks.py` file created
- [ ] Default `models.py` removed

---

## Task 02: Register Analytics in TENANT_APPS

### Overview
Register the analytics app in Django's TENANT_APPS configuration to ensure it's included in tenant schemas. This allows each tenant to have isolated analytics data and report configurations while sharing the same codebase.

### Dependencies
- Task 01: Create analytics app
- Multi-tenancy configuration exists
- django-tenants or similar package installed

### Instructions

1. **Locate tenant settings file**
   - Open `config/settings/base.py` or tenant-specific settings
   - Find TENANT_APPS configuration section
   - This lists apps that create tables in tenant schemas

2. **Add analytics to TENANT_APPS**
   - Add `'apps.analytics'` to TENANT_APPS list
   - Place after core ERP apps (inventory, sales, pos)
   - Maintain alphabetical or logical ordering

3. **Verify app registration**
   - Ensure full dotted path used: `'apps.analytics'`
   - Check for typos in app name
   - Confirm proper indentation and syntax

4. **Add to INSTALLED_APPS if separate**
   - If INSTALLED_APPS is separate from TENANT_APPS
   - Ensure analytics is in appropriate list
   - May need to be in both depending on setup

5. **Document app purpose**
   - Add inline comment explaining analytics app
   - Note: "Business intelligence and reporting"

### TENANT_APPS Configuration Example

```python
TENANT_APPS = [
    # Core Django apps
    'django.contrib.contenttypes',
    'django.contrib.auth',
    
    # Multi-tenancy
    'django_tenants',
    
    # Core ERP modules
    'apps.core',
    'apps.inventory',
    'apps.sales',
    'apps.pos',
    'apps.customers',
    'apps.suppliers',
    'apps.purchase',
    'apps.staff',
    
    # Advanced modules
    'apps.analytics',  # Business intelligence and reporting ← Add here
    
    # Third-party apps
    'rest_framework',
    'celery',
]
```

### Multi-Tenancy Implications

```
┌─────────────────────────────────────────────────┐
│         Multi-Tenant Analytics Isolation        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Public Schema (Shared)                         │
│  └── Tenant model                               │
│      └── Domain model                           │
│                                                 │
│  Tenant A Schema                                │
│  ├── ReportDefinition (Tenant A)                │
│  ├── ReportInstance (Tenant A)                  │
│  └── Generated reports (Tenant A)               │
│                                                 │
│  Tenant B Schema                                │
│  ├── ReportDefinition (Tenant B)                │
│  ├── ReportInstance (Tenant B)                  │
│  └── Generated reports (Tenant B)               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### App Registration Locations

| Configuration | Purpose | Contains Analytics |
|--------------|---------|-------------------|
| SHARED_APPS | Tables in public schema | No |
| TENANT_APPS | Tables in tenant schemas | Yes ✓ |
| INSTALLED_APPS | All apps for Django | Yes (if not using tenant split) |

### Expected Outcome
- Analytics app registered in multi-tenant configuration
- Tables will be created in tenant schemas
- Each tenant has isolated analytics data
- App ready for migrations

### Verification Checklist
- [ ] Analytics added to TENANT_APPS
- [ ] Full dotted path used: `'apps.analytics'`
- [ ] Proper placement in app list
- [ ] No syntax errors in settings
- [ ] Inline comment added for clarity

---

## Task 03: Define ReportCategory Enum

### Overview
Define the ReportCategory enumeration to categorize different types of business reports. This enum provides a standardized way to classify reports and enables filtering, organization, and permission management based on report categories.

### Dependencies
- Task 01: Create analytics app
- Python 3.x with enum support

### Instructions

1. **Open enums.py file**
   - Navigate to `apps/analytics/enums.py`
   - Prepare to define enumerations

2. **Import enum modules**
   - Import `Enum` from `enum` standard library
   - Import `models` from Django for TextChoices

3. **Add module docstring**
   - Document the purpose of enumerations
   - List all enums defined in this module
   - Note usage context for each enum

4. **Define ReportCategory class**
   - Inherit from `models.TextChoices`
   - Use Django's choices pattern for database compatibility
   - Add class docstring explaining categories

5. **Define SALES category**
   - Value: `'SALES'`
   - Label: `'Sales'`
   - Purpose: Revenue, transactions, sales performance

6. **Define INVENTORY category**
   - Value: `'INVENTORY'`
   - Label: `'Inventory'`
   - Purpose: Stock levels, movement, valuation

7. **Define PURCHASE category**
   - Value: `'PURCHASE'`
   - Label: `'Purchase'`
   - Purpose: Vendor orders, receiving, purchasing

8. **Define CUSTOMER category**
   - Value: `'CUSTOMER'`
   - Label: `'Customer'`
   - Purpose: Customer analytics, behavior, segmentation

9. **Define STAFF category**
   - Value: `'STAFF'`
   - Label: `'Staff'`
   - Purpose: Employee performance, attendance, HR

10. **Define FINANCIAL category**
    - Value: `'FINANCIAL'`
    - Label: `'Financial'`
    - Purpose: P&L, balance sheet, cash flow

11. **Define TAX category**
    - Value: `'TAX'`
    - Label: `'Tax & Compliance'`
    - Purpose: Tax reports, VAT, regulatory compliance

12. **Add get_description method**
    - Class method returning category description
    - Provides detailed explanation of each category
    - Used in UI help text

### ReportCategory Enum Structure

```python
class ReportCategory(models.TextChoices):
    """
    Categories for organizing business reports.
    """
    
    SALES = 'SALES', 'Sales'
    INVENTORY = 'INVENTORY', 'Inventory'
    PURCHASE = 'PURCHASE', 'Purchase'
    CUSTOMER = 'CUSTOMER', 'Customer'
    STAFF = 'STAFF', 'Staff'
    FINANCIAL = 'FINANCIAL', 'Financial'
    TAX = 'TAX', 'Tax & Compliance'
```

### Report Categories Detailed

| Category | Purpose | Example Reports |
|----------|---------|----------------|
| SALES | Revenue and transaction analytics | Daily sales, Sales by product, Sales by staff, Sales trends |
| INVENTORY | Stock management and tracking | Stock levels, Stock movement, Low stock alerts, Valuation |
| PURCHASE | Vendor and purchasing analysis | Purchase orders, Vendor performance, Receiving reports |
| CUSTOMER | Customer behavior and analytics | Customer purchases, Customer lifetime value, Segmentation |
| STAFF | Employee performance and HR | Staff performance, Commission, Attendance, Timesheets |
| FINANCIAL | Financial statements and analysis | Profit & Loss, Balance sheet, Cash flow, Budget variance |
| TAX | Tax reporting and compliance | VAT reports, Income tax, Tax liability, Audit reports |

### Category-Based Report Examples

#### SALES Category Reports
```
┌─────────────────────────────────────────────────┐
│              Sales Category Reports              │
├─────────────────────────────────────────────────┤
│ • Daily Sales Summary                           │
│ • Sales by Product Category                     │
│ • Sales by Location                             │
│ • Sales by Staff Member                         │
│ • Hourly Sales Trends                           │
│ • Payment Method Analysis                       │
│ • Discount and Promotion Analysis               │
│ • Top Selling Products                          │
│ • Sales Comparison (YoY, MoM)                   │
└─────────────────────────────────────────────────┘
```

#### INVENTORY Category Reports
```
┌─────────────────────────────────────────────────┐
│           Inventory Category Reports            │
├─────────────────────────────────────────────────┤
│ • Current Stock Levels                          │
│ • Stock Movement Report                         │
│ • Low Stock Alerts                              │
│ • Overstock Report                              │
│ • Inventory Valuation                           │
│ • Stock Age Analysis                            │
│ • Dead Stock Report                             │
│ • Reorder Recommendations                       │
│ • Stock Adjustment History                      │
└─────────────────────────────────────────────────┘
```

#### CUSTOMER Category Reports
```
┌─────────────────────────────────────────────────┐
│           Customer Category Reports             │
├─────────────────────────────────────────────────┤
│ • Customer Purchase History                     │
│ • Customer Lifetime Value                       │
│ • Customer Segmentation                         │
│ • New vs Returning Customers                    │
│ • Customer Loyalty Analysis                     │
│ • Customer Credit Analysis                      │
│ • Top Customers by Revenue                      │
│ • Customer Churn Analysis                       │
└─────────────────────────────────────────────────┘
```

### Permission Mapping by Category

| Category | Required Permission | Permission Group |
|----------|-------------------|------------------|
| SALES | `analytics.view_sales_reports` | Sales Managers |
| INVENTORY | `analytics.view_inventory_reports` | Inventory Managers |
| PURCHASE | `analytics.view_purchase_reports` | Purchase Managers |
| CUSTOMER | `analytics.view_customer_reports` | Sales/Marketing |
| STAFF | `analytics.view_staff_reports` | HR Managers |
| FINANCIAL | `analytics.view_financial_reports` | Finance Team |
| TAX | `analytics.view_tax_reports` | Accountants |

### Category Selection UI Flow

```
User Dashboard
     │
     ▼
Select Report Category
     │
     ├── Sales ──────────► Sales Report List
     │                         │
     │                         ├── Daily Sales
     │                         ├── Sales by Product
     │                         └── Sales Trends
     │
     ├── Inventory ──────► Inventory Report List
     │                         │
     │                         ├── Stock Levels
     │                         ├── Stock Movement
     │                         └── Reorder Report
     │
     └── Customer ───────► Customer Report List
                               │
                               ├── Purchase History
                               ├── Lifetime Value
                               └── Segmentation
```

### Sri Lanka-Specific Considerations

#### Tax Category - Sri Lanka Context
```
┌─────────────────────────────────────────────────┐
│      Tax Reports (Sri Lanka Compliance)         │
├─────────────────────────────────────────────────┤
│ • VAT Returns (15%)                             │
│ • VAT Input/Output Analysis                     │
│ • NBT (Nation Building Tax) Reports             │
│ • Withholding Tax Reports                       │
│ • SVAT (Simplified VAT) Reports                 │
│ • PAL (Ports and Airports Levy)                 │
│ • Tax Audit Preparation                         │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Standardized report categorization
- Clear organizational structure
- Foundation for category-based filtering
- Permission management support

### Verification Checklist
- [ ] ReportCategory class defined
- [ ] Inherits from models.TextChoices
- [ ] SALES category defined
- [ ] INVENTORY category defined
- [ ] PURCHASE category defined
- [ ] CUSTOMER category defined
- [ ] STAFF category defined
- [ ] FINANCIAL category defined
- [ ] TAX category defined
- [ ] Class docstring added
- [ ] get_description method implemented (optional)

---

## Task 04: Define ReportFormat Enum

### Overview
Define the ReportFormat enumeration to specify available output formats for generated reports. This enum ensures consistent format specification and enables the system to generate reports in various formats based on user needs and use cases.

### Dependencies
- Task 03: Define ReportCategory enum

### Instructions

1. **Open enums.py file**
   - Continue in `apps/analytics/enums.py`
   - Add ReportFormat enum below ReportCategory

2. **Define ReportFormat class**
   - Inherit from `models.TextChoices`
   - Add class docstring explaining format types

3. **Define PDF format**
   - Value: `'PDF'`
   - Label: `'PDF'`
   - Purpose: Print-ready, formatted documents

4. **Define EXCEL format**
   - Value: `'EXCEL'`
   - Label: `'Excel'`
   - Purpose: Spreadsheet with data and formulas

5. **Define CSV format**
   - Value: `'CSV'`
   - Label: `'CSV'`
   - Purpose: Simple comma-separated data export

6. **Define JSON format**
   - Value: `'JSON'`
   - Label: `'JSON'`
   - Purpose: Structured data for API consumption

7. **Define HTML format (optional)**
   - Value: `'HTML'`
   - Label: `'HTML'`
   - Purpose: Web display, email embedding

8. **Add get_file_extension method**
   - Class method returning file extension
   - Maps format to extension (.pdf, .xlsx, .csv, .json)

9. **Add get_content_type method**
   - Class method returning MIME type
   - Used for HTTP responses and downloads

### ReportFormat Enum Structure

```python
class ReportFormat(models.TextChoices):
    """
    Output formats for generated reports.
    """
    
    PDF = 'PDF', 'PDF'
    EXCEL = 'EXCEL', 'Excel'
    CSV = 'CSV', 'CSV'
    JSON = 'JSON', 'JSON'
    HTML = 'HTML', 'HTML'
```

### Report Format Specifications

| Format | Extension | MIME Type | Use Case | Generation Library |
|--------|-----------|-----------|----------|-------------------|
| PDF | .pdf | application/pdf | Print-ready documents | WeasyPrint, ReportLab |
| EXCEL | .xlsx | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | Data analysis, charts | openpyxl, xlsxwriter |
| CSV | .csv | text/csv | Simple data export | Python csv module |
| JSON | .json | application/json | API integration | Python json module |
| HTML | .html | text/html | Web display, email | Django templates |

### Format Selection Guidelines

#### PDF Format
```
Best For:
├── Formal reports and presentations
├── Print-ready documents
├── Fixed layout requirements
├── Reports with complex formatting
└── Digital signatures and security

Characteristics:
├── Fixed page layout
├── Professional appearance
├── Portable across platforms
├── Not easily editable
└── Larger file size
```

#### EXCEL Format
```
Best For:
├── Data analysis and manipulation
├── Charts and graphs
├── Pivot tables
├── Financial statements
└── Reports requiring calculations

Characteristics:
├── Editable spreadsheet
├── Formula support
├── Multiple sheets
├── Conditional formatting
└── Compatible with Excel, LibreOffice
```

#### CSV Format
```
Best For:
├── Simple data exports
├── Database imports
├── Third-party integrations
├── Large datasets
└── ETL processes

Characteristics:
├── Plain text format
├── Universal compatibility
├── Minimal file size
├── No formatting
└── Easy to parse
```

#### JSON Format
```
Best For:
├── API responses
├── System integrations
├── Mobile app consumption
├── Web applications
└── Data interchange

Characteristics:
├── Structured data format
├── Nested data support
├── Programming language friendly
├── Human readable
└── Lightweight
```

### Format Generation Examples

#### PDF Report Structure
```
╔═══════════════════════════════════════════════╗
║           DAILY SALES REPORT                  ║
║           January 25, 2026                    ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  Location: Colombo Main Branch                ║
║  Generated: 2026-01-25 14:30:00               ║
║                                               ║
║  ┌─────────────────────────────────────────┐ ║
║  │ SALES SUMMARY                           │ ║
║  ├─────────────────────────────────────────┤ ║
║  │ Total Sales:        LKR 1,250,000.00    │ ║
║  │ Total Transactions: 145                 │ ║
║  │ Average Sale:       LKR 8,620.69        │ ║
║  └─────────────────────────────────────────┘ ║
║                                               ║
║  [Chart: Sales by Hour]                       ║
║                                               ║
║  [Table: Top Products]                        ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

#### Excel Report Structure
```
Sheet 1: Summary
┌──────────────────┬──────────────────┐
│ Metric           │ Value            │
├──────────────────┼──────────────────┤
│ Total Sales      │ 1,250,000.00     │
│ Transactions     │ 145              │
│ Average Sale     │ =B2/B3           │ ← Formula
└──────────────────┴──────────────────┘

Sheet 2: Detailed Data
┌──────────┬────────────┬──────────┬──────────┐
│ Time     │ Product    │ Quantity │ Amount   │
├──────────┼────────────┼──────────┼──────────┤
│ 09:15:00 │ Product A  │ 2        │ 5,000.00 │
│ 09:23:00 │ Product B  │ 1        │ 3,500.00 │
└──────────┴────────────┴──────────┴──────────┘

Sheet 3: Charts
[Embedded charts and visualizations]
```

#### CSV Format Example
```csv
Date,Transaction ID,Product,Quantity,Unit Price,Total
2026-01-25,TXN-001,Product A,2,2500.00,5000.00
2026-01-25,TXN-002,Product B,1,3500.00,3500.00
2026-01-25,TXN-003,Product C,3,1200.00,3600.00
```

#### JSON Format Example
```json
{
  "report": {
    "title": "Daily Sales Report",
    "date": "2026-01-25",
    "location": "Colombo Main Branch",
    "summary": {
      "total_sales": 1250000.00,
      "total_transactions": 145,
      "average_sale": 8620.69
    },
    "transactions": [
      {
        "id": "TXN-001",
        "time": "09:15:00",
        "product": "Product A",
        "quantity": 2,
        "amount": 5000.00
      }
    ]
  }
}
```

### Format Selection by Use Case

| Use Case | Recommended Format | Reason |
|----------|-------------------|--------|
| Management review | PDF | Professional, print-ready |
| Data analysis | EXCEL | Formulas, pivot tables |
| System integration | JSON | Structured, API-friendly |
| Database import | CSV | Universal compatibility |
| Email distribution | PDF or HTML | Portable, viewable inline |
| Mobile app | JSON | Lightweight, structured |
| Audit documentation | PDF | Immutable, secure |
| Bulk data export | CSV | Efficient for large datasets |

### Expected Outcome
- Standardized format specification
- Multiple output options for users
- Foundation for format-specific generation
- Clear format selection guidelines

### Verification Checklist
- [ ] ReportFormat class defined
- [ ] Inherits from models.TextChoices
- [ ] PDF format defined
- [ ] EXCEL format defined
- [ ] CSV format defined
- [ ] JSON format defined
- [ ] HTML format defined (optional)
- [ ] Class docstring added
- [ ] get_file_extension method implemented
- [ ] get_content_type method implemented

---

## Task 05: Define ReportStatus Enum

### Overview
Define the ReportStatus enumeration to track the lifecycle of report generation. This enum provides clear status indicators for asynchronous report generation, enabling users to monitor progress and system administrators to track failures.

### Dependencies
- Task 04: Define ReportFormat enum

### Instructions

1. **Open enums.py file**
   - Continue in `apps/analytics/enums.py`
   - Add ReportStatus enum below ReportFormat

2. **Define ReportStatus class**
   - Inherit from `models.TextChoices`
   - Add class docstring explaining status lifecycle

3. **Define PENDING status**
   - Value: `'PENDING'`
   - Label: `'Pending'`
   - Purpose: Report requested, waiting to start

4. **Define GENERATING status**
   - Value: `'GENERATING'`
   - Label: `'Generating'`
   - Purpose: Report generation in progress

5. **Define COMPLETED status**
   - Value: `'COMPLETED'`
   - Label: `'Completed'`
   - Purpose: Successfully generated and available

6. **Define FAILED status**
   - Value: `'FAILED'`
   - Label: `'Failed'`
   - Purpose: Generation failed with error

7. **Define CANCELLED status (optional)**
   - Value: `'CANCELLED'`
   - Label: `'Cancelled'`
   - Purpose: User cancelled generation

8. **Add is_terminal method**
   - Class method checking if status is final
   - Returns True for COMPLETED, FAILED, CANCELLED
   - Used to determine if further processing needed

9. **Add is_successful method**
   - Class method checking if generation succeeded
   - Returns True only for COMPLETED
   - Used for success metrics and notifications

### ReportStatus Enum Structure

```python
class ReportStatus(models.TextChoices):
    """
    Status values for report generation lifecycle.
    """
    
    PENDING = 'PENDING', 'Pending'
    GENERATING = 'GENERATING', 'Generating'
    COMPLETED = 'COMPLETED', 'Completed'
    FAILED = 'FAILED', 'Failed'
    CANCELLED = 'CANCELLED', 'Cancelled'
```

### Report Status Lifecycle

```
Report Request
     │
     ▼
┌──────────┐
│ PENDING  │ ← User requests report
└────┬─────┘   System queues for generation
     │
     ▼
┌──────────────┐
│ GENERATING   │ ← Celery task starts
└────┬─────────┘   Data aggregation in progress
     │
     ├───────────────────┐
     │                   │
     ▼                   ▼
┌───────────┐      ┌──────────┐
│ COMPLETED │      │  FAILED  │
└───────────┘      └──────────┘
  Success            Error occurred
  File ready         Error message logged
                     
     ▲
     │
     │ User action
     │
┌────────────┐
│ CANCELLED  │ ← User cancels during generation
└────────────┘
```

### Status Details and Handling

| Status | Description | Duration | User Action | System Action |
|--------|-------------|----------|-------------|---------------|
| PENDING | Queued, waiting | Seconds to minutes | Wait | Queue in Celery |
| GENERATING | In progress | Minutes to hours | Monitor progress | Execute generation |
| COMPLETED | Ready for download | Permanent | Download report | Store file |
| FAILED | Generation error | Permanent | Retry or contact support | Log error details |
| CANCELLED | User cancelled | Permanent | Request new report | Clean up partial data |

### Status Transition Rules

```
Valid Transitions:
═══════════════════

PENDING ──────────────► GENERATING
         (Task starts)

GENERATING ───────────► COMPLETED
          (Success)

GENERATING ───────────► FAILED
          (Error)

GENERATING ───────────► CANCELLED
          (User action)

Invalid Transitions:
═══════════════════

COMPLETED ─────╳────► GENERATING
FAILED ────────╳────► PENDING
CANCELLED ─────╳────► GENERATING
```

### Status-Based UI Display

#### PENDING Status Display
```
┌────────────────────────────────────────────────┐
│ Report: Daily Sales Summary                   │
│ Status: ⏳ Pending                            │
│                                                │
│ Your report has been queued for generation.   │
│ Processing will begin shortly...              │
│                                                │
│ Estimated time: 2-5 minutes                   │
└────────────────────────────────────────────────┘
```

#### GENERATING Status Display
```
┌────────────────────────────────────────────────┐
│ Report: Daily Sales Summary                   │
│ Status: ⚙️ Generating                         │
│                                                │
│ ████████████░░░░░░░░░░░░░░░░░ 45%            │
│                                                │
│ Processing sales data...                      │
│ Please wait, this may take a few minutes.     │
│                                                │
│ [Cancel Generation]                           │
└────────────────────────────────────────────────┘
```

#### COMPLETED Status Display
```
┌────────────────────────────────────────────────┐
│ Report: Daily Sales Summary                   │
│ Status: ✅ Completed                          │
│                                                │
│ Generated: January 25, 2026 at 2:30 PM       │
│ Format: PDF                                    │
│ Size: 1.2 MB                                   │
│                                                │
│ [📥 Download Report]  [🗑️ Delete]            │
└────────────────────────────────────────────────┘
```

#### FAILED Status Display
```
┌────────────────────────────────────────────────┐
│ Report: Daily Sales Summary                   │
│ Status: ❌ Failed                             │
│                                                │
│ Generation failed due to an error.            │
│ Error: Database connection timeout            │
│                                                │
│ Please try again or contact support if the    │
│ problem persists.                              │
│                                                │
│ [🔄 Retry]  [📧 Contact Support]             │
└────────────────────────────────────────────────┘
```

### Status-Based Notifications

| Status | Notification Type | Trigger | Message |
|--------|------------------|---------|---------|
| PENDING | In-app | Immediate | Report queued for generation |
| GENERATING | None | - | (Optional progress updates) |
| COMPLETED | Email + In-app | On completion | Your report is ready for download |
| FAILED | Email + In-app | On error | Report generation failed |
| CANCELLED | In-app | On cancellation | Report generation cancelled |

### Status Metrics and Monitoring

```
┌─────────────────────────────────────────────────┐
│         Report Generation Metrics               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Total Reports Today:          145              │
│  ├── Completed:     132 (91%)                   │
│  ├── Failed:          8 (5.5%)                  │
│  ├── Cancelled:       3 (2%)                    │
│  └── In Progress:     2 (1.5%)                  │
│                                                 │
│  Average Generation Time:      3.5 minutes      │
│  Longest Generation Time:      45 minutes       │
│  Success Rate (7 days):        93%              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Error Handling by Status

#### PENDING → FAILED (Pre-generation errors)
- Invalid filter parameters
- Insufficient permissions
- Missing required data
- Configuration errors

#### GENERATING → FAILED (Generation errors)
- Database query timeout
- Data processing errors
- File write errors
- Memory exhaustion
- Library/dependency errors

### Status Retention Policy

| Status | Retention Period | Cleanup Action |
|--------|-----------------|----------------|
| PENDING | 24 hours | Auto-fail if not started |
| GENERATING | 2 hours | Auto-fail if exceeds timeout |
| COMPLETED | 30 days | Delete report file and record |
| FAILED | 7 days | Delete error record |
| CANCELLED | 24 hours | Delete request record |

### Expected Outcome
- Complete status lifecycle tracking
- Clear status communication to users
- Foundation for progress monitoring
- Error tracking and recovery

### Verification Checklist
- [ ] ReportStatus class defined
- [ ] Inherits from models.TextChoices
- [ ] PENDING status defined
- [ ] GENERATING status defined
- [ ] COMPLETED status defined
- [ ] FAILED status defined
- [ ] CANCELLED status defined (optional)
- [ ] Class docstring added
- [ ] is_terminal method implemented
- [ ] is_successful method implemented

---

## Task 06: Create Enums Module Structure

### Overview
Organize and structure the enums module with proper imports, exports, and documentation. Ensure all enumerations are properly exposed and accessible from other parts of the application.

### Dependencies
- Task 03: Define ReportCategory enum
- Task 04: Define ReportFormat enum
- Task 05: Define ReportStatus enum

### Instructions

1. **Open enums.py file**
   - Navigate to `apps/analytics/enums.py`
   - Review all defined enumerations

2. **Add comprehensive module docstring**
   - Document module purpose
   - List all enums in module
   - Provide usage examples

3. **Organize imports section**
   - Import Django modules
   - Import Python standard library modules
   - Group imports logically

4. **Add __all__ list**
   - Export ReportCategory
   - Export ReportFormat
   - Export ReportStatus
   - Controls what's imported with `from enums import *`

5. **Add type hints (optional)**
   - Import TYPE_CHECKING
   - Add type annotations for methods
   - Improve IDE support

6. **Add enum helper functions**
   - Create get_choices_dict() function
   - Returns all choices for each enum
   - Used in UI dropdowns and filters

7. **Add validation helpers**
   - Create is_valid_category() function
   - Create is_valid_format() function
   - Create is_valid_status() function
   - Used for input validation

### Enums Module Complete Structure

```python
"""
Analytics enumerations module.

This module defines all enumeration types used throughout the analytics
and reporting system. These enums provide standardized values for report
categories, output formats, and generation status tracking.

Enums:
    - ReportCategory: Report classification (SALES, INVENTORY, etc.)
    - ReportFormat: Output format (PDF, EXCEL, CSV, JSON)
    - ReportStatus: Generation status (PENDING, GENERATING, COMPLETED, FAILED)

Usage:
    from apps.analytics.enums import ReportCategory, ReportFormat, ReportStatus
    
    category = ReportCategory.SALES
    format = ReportFormat.PDF
    status = ReportStatus.PENDING
"""

from django.db import models
from typing import Dict, List, Tuple

__all__ = [
    'ReportCategory',
    'ReportFormat',
    'ReportStatus',
]

# Enum definitions here...
```

### Helper Functions Structure

```python
def get_report_choices() -> Dict[str, List[Tuple[str, str]]]:
    """
    Get all enum choices for UI dropdowns.
    
    Returns:
        Dictionary mapping enum names to choice lists.
    """
    return {
        'categories': ReportCategory.choices,
        'formats': ReportFormat.choices,
        'statuses': ReportStatus.choices,
    }


def is_valid_category(value: str) -> bool:
    """Check if value is a valid ReportCategory."""
    return value in ReportCategory.values


def is_valid_format(value: str) -> bool:
    """Check if value is a valid ReportFormat."""
    return value in ReportFormat.values


def is_valid_status(value: str) -> bool:
    """Check if value is a valid ReportStatus."""
    return value in ReportStatus.values
```

### Import and Usage Examples

```python
# Example 1: Basic enum usage
from apps.analytics.enums import ReportCategory

category = ReportCategory.SALES
print(category.value)  # Output: 'SALES'
print(category.label)  # Output: 'Sales'

# Example 2: Using in model fields
from apps.analytics.enums import ReportFormat

class ReportDefinition(models.Model):
    default_format = models.CharField(
        max_length=20,
        choices=ReportFormat.choices,
        default=ReportFormat.PDF
    )

# Example 3: Validation
from apps.analytics.enums import is_valid_category

user_input = request.data.get('category')
if not is_valid_category(user_input):
    return Response({'error': 'Invalid category'}, status=400)

# Example 4: Getting all choices
from apps.analytics.enums import get_report_choices

choices = get_report_choices()
category_choices = choices['categories']
# Use in forms or API responses
```

### Module Organization Best Practices

```
┌─────────────────────────────────────────────────┐
│            Enums Module Structure               │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Module Docstring                            │
│     ├── Purpose statement                       │
│     ├── List of enums                           │
│     └── Usage examples                          │
│                                                 │
│  2. Imports                                     │
│     ├── Django imports                          │
│     ├── Standard library imports                │
│     └── Type hints (if used)                    │
│                                                 │
│  3. __all__ Declaration                         │
│     └── Explicit exports                        │
│                                                 │
│  4. Enum Definitions                            │
│     ├── ReportCategory                          │
│     ├── ReportFormat                            │
│     └── ReportStatus                            │
│                                                 │
│  5. Helper Functions                            │
│     ├── get_report_choices()                    │
│     ├── is_valid_category()                     │
│     ├── is_valid_format()                       │
│     └── is_valid_status()                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Well-organized enums module
- Proper exports and imports
- Helper functions for validation
- Clear documentation

### Verification Checklist
- [ ] Module docstring comprehensive
- [ ] Imports properly organized
- [ ] __all__ list defined
- [ ] All enums included in __all__
- [ ] Helper functions implemented
- [ ] Validation functions working
- [ ] Type hints added (optional)

---

## Task 07: Add Enum Documentation

### Overview
Add comprehensive documentation for all enumerations, including usage examples, integration patterns, and best practices. This documentation will be embedded as docstrings and comments within the code for developer reference.

### Dependencies
- Task 06: Create enums module structure

### Instructions

1. **Document ReportCategory enum**
   - Add detailed class docstring
   - Document each category value
   - Provide usage examples
   - List related reports for each category

2. **Document ReportFormat enum**
   - Add detailed class docstring
   - Document each format value
   - Include file extensions and MIME types
   - Provide generation library references

3. **Document ReportStatus enum**
   - Add detailed class docstring
   - Document each status value
   - Explain status transitions
   - Provide lifecycle diagram in comments

4. **Add enum method documentation**
   - Document get_file_extension method
   - Document get_content_type method
   - Document is_terminal method
   - Document is_successful method

5. **Create usage examples section**
   - Add module-level examples
   - Show common usage patterns
   - Include integration examples
   - Demonstrate validation patterns

6. **Add inline comments**
   - Comment complex enum logic
   - Explain design decisions
   - Note Sri Lanka-specific considerations
   - Reference related components

### Documentation Template Structure

```python
class ReportCategory(models.TextChoices):
    """
    Report category enumeration for organizing business reports.
    
    Categories group related reports together and enable category-based
    filtering, permissions, and navigation in the UI. Each tenant can
    define report definitions within these categories.
    
    Categories:
        SALES: Revenue and transaction reports
            - Daily sales summary
            - Sales by product
            - Sales by staff
            - Payment method analysis
            
        INVENTORY: Stock management reports
            - Stock levels
            - Stock movement
            - Low stock alerts
            - Inventory valuation
            
        PURCHASE: Vendor and purchasing reports
            - Purchase orders
            - Vendor performance
            - Receiving reports
            - Purchase analysis
            
        CUSTOMER: Customer analytics reports
            - Purchase history
            - Customer lifetime value
            - Segmentation analysis
            - Loyalty metrics
            
        STAFF: Employee performance reports
            - Staff performance
            - Commission reports
            - Attendance tracking
            - Timesheet reports
            
        FINANCIAL: Financial statements
            - Profit & Loss
            - Balance sheet
            - Cash flow
            - Budget variance
            
        TAX: Tax and compliance reports
            - VAT returns
            - Income tax reports
            - Tax liability
            - Audit preparation
    
    Usage:
        category = ReportCategory.SALES
        if category == ReportCategory.SALES:
            # Handle sales reports
            pass
            
    Permissions:
        Each category maps to a specific permission:
        - SALES: analytics.view_sales_reports
        - INVENTORY: analytics.view_inventory_reports
        etc.
    """
    
    SALES = 'SALES', 'Sales'
    INVENTORY = 'INVENTORY', 'Inventory'
    # ... rest of definitions
```

### Expected Outcome
- Comprehensive enum documentation
- Clear usage guidelines
- Developer-friendly reference
- Maintainable codebase

### Verification Checklist
- [ ] ReportCategory fully documented
- [ ] ReportFormat fully documented
- [ ] ReportStatus fully documented
- [ ] Method docstrings added
- [ ] Usage examples provided
- [ ] Inline comments added where needed

---

## Task 08: Verify Enum Implementation

### Overview
Verify that all enumerations are correctly implemented, properly exported, and functioning as expected. Test imports, value access, and helper functions to ensure the enums module is production-ready.

### Dependencies
- Task 07: Add enum documentation

### Instructions

1. **Verify imports**
   - Test importing from enums module
   - Confirm all enums accessible
   - Check __all__ list working correctly

2. **Test enum values**
   - Verify all category values defined
   - Verify all format values defined
   - Verify all status values defined
   - Check value and label pairs correct

3. **Test Django integration**
   - Verify choices property works
   - Test in model field definitions
   - Confirm database compatibility

4. **Test helper functions**
   - Test get_report_choices()
   - Test validation functions
   - Test file extension mapping
   - Test content type mapping

5. **Test enum methods**
   - Test is_terminal() method
   - Test is_successful() method
   - Test custom methods

6. **Create test script**
   - Write verification script
   - Test all enum functionality
   - Document results

7. **Run Django checks**
   - Run `python manage.py check`
   - Verify no errors or warnings
   - Confirm app registration successful

### Verification Script Example

```python
"""
Enum verification script.
Run: python manage.py shell < verify_enums.py
"""

from apps.analytics.enums import (
    ReportCategory,
    ReportFormat,
    ReportStatus,
    get_report_choices,
    is_valid_category,
)

print("=" * 50)
print("Analytics Enums Verification")
print("=" * 50)

# Test ReportCategory
print("\n1. ReportCategory:")
print(f"   Choices: {len(ReportCategory.choices)}")
for value, label in ReportCategory.choices:
    print(f"   - {value}: {label}")

# Test ReportFormat
print("\n2. ReportFormat:")
print(f"   Choices: {len(ReportFormat.choices)}")
for value, label in ReportFormat.choices:
    print(f"   - {value}: {label}")
    print(f"     Extension: {ReportFormat.get_file_extension(value)}")
    print(f"     MIME: {ReportFormat.get_content_type(value)}")

# Test ReportStatus
print("\n3. ReportStatus:")
print(f"   Choices: {len(ReportStatus.choices)}")
for value, label in ReportStatus.choices:
    print(f"   - {value}: {label}")
    print(f"     Terminal: {ReportStatus.is_terminal(value)}")

# Test helper functions
print("\n4. Helper Functions:")
choices = get_report_choices()
print(f"   Categories: {len(choices['categories'])}")
print(f"   Formats: {len(choices['formats'])}")
print(f"   Statuses: {len(choices['statuses'])}")

# Test validation
print("\n5. Validation:")
print(f"   is_valid_category('SALES'): {is_valid_category('SALES')}")
print(f"   is_valid_category('INVALID'): {is_valid_category('INVALID')}")

print("\n" + "=" * 50)
print("Verification Complete!")
print("=" * 50)
```

### Expected Verification Output

```
==================================================
Analytics Enums Verification
==================================================

1. ReportCategory:
   Choices: 7
   - SALES: Sales
   - INVENTORY: Inventory
   - PURCHASE: Purchase
   - CUSTOMER: Customer
   - STAFF: Staff
   - FINANCIAL: Financial
   - TAX: Tax & Compliance

2. ReportFormat:
   Choices: 5
   - PDF: PDF
     Extension: .pdf
     MIME: application/pdf
   - EXCEL: Excel
     Extension: .xlsx
     MIME: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   - CSV: CSV
     Extension: .csv
     MIME: text/csv
   - JSON: JSON
     Extension: .json
     MIME: application/json
   - HTML: HTML
     Extension: .html
     MIME: text/html

3. ReportStatus:
   Choices: 5
   - PENDING: Pending
     Terminal: False
   - GENERATING: Generating
     Terminal: False
   - COMPLETED: Completed
     Terminal: True
   - FAILED: Failed
     Terminal: True
   - CANCELLED: Cancelled
     Terminal: True

4. Helper Functions:
   Categories: 7
   Formats: 5
   Statuses: 5

5. Validation:
   is_valid_category('SALES'): True
   is_valid_category('INVALID'): False

==================================================
Verification Complete!
==================================================
```

### Verification Checklist
- [ ] All enums import successfully
- [ ] Enum values accessible
- [ ] Django choices property works
- [ ] Helper functions operational
- [ ] Validation functions correct
- [ ] No Django check errors
- [ ] Documentation complete
- [ ] Module ready for use

---

## Summary

This document established the analytics app foundation and core enumerations:

### Completed Infrastructure
- ✅ Analytics Django app created and organized
- ✅ App registered in TENANT_APPS for multi-tenancy
- ✅ ReportCategory enum (7 categories)
- ✅ ReportFormat enum (5 formats)
- ✅ ReportStatus enum (5 statuses)
- ✅ Helper functions for validation
- ✅ Comprehensive documentation
- ✅ Verification procedures

### Key Achievements
1. **App Structure** - Clean Django app with proper organization
2. **Multi-Tenancy** - Configured for tenant-specific data isolation
3. **Report Categories** - Sales, Inventory, Purchase, Customer, Staff, Financial, Tax
4. **Output Formats** - PDF, Excel, CSV, JSON, HTML
5. **Status Tracking** - Complete lifecycle from PENDING to COMPLETED/FAILED
6. **Helper Functions** - Validation and utility functions
7. **Documentation** - Comprehensive docstrings and usage examples

### Next Steps
Proceed to [02_Tasks-09-16_Definition-Instance-Models.md](02_Tasks-09-16_Definition-Instance-Models.md) to implement the ReportDefinition and ReportInstance models that will use these enumerations.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~957
