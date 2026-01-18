# SubPhase 14: Analytics & Reports - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 14 of 14  
> **SubPhase Goal:** Business intelligence and comprehensive reporting  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-13_Dashboard-KPIs](../SubPhase-13_Dashboard-KPIs/)
- **→ Next Phase:** [Phase-07_Frontend-Infrastructure-ERP-Dashboard](../../Phase-07_Frontend-Infrastructure-ERP-Dashboard/)

---

## SubPhase Overview

This sub-phase implements comprehensive business analytics and reporting capabilities. Includes sales reports, inventory reports, purchase reports, customer analytics, and staff reports. Features a report builder, scheduled reports, email distribution, and multiple export formats.

### Key Outcomes
- Sales reports (by product, customer, period, channel)
- Inventory reports (stock, movement, valuation)
- Purchase reports (by vendor, category)
- Customer reports (acquisition, retention, lifetime value)
- Staff reports (attendance, performance)
- Report builder for custom reports
- Scheduled report generation
- Email distribution with attachments
- Export formats (PDF, Excel, CSV)
- Saved report templates

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Report Generation:** WeasyPrint (PDF), openpyxl (Excel)
- **Scheduling:** Celery Beat for scheduled reports
- **Frontend:** Next.js 14+ with TypeScript
- **Charts:** Recharts for visualizations

### Dependencies
- Phase-05: Sales, Inventory, Purchase data
- Phase-06 SubPhase-01-06: HR data
- Phase-06 SubPhase-13: Dashboard KPIs

---

## Task Execution Order

```
TASK GROUP A: Report Framework (Tasks 01-16)
        │
        ▼
TASK GROUP B: Sales Reports (Tasks 17-34)
        │
        ▼
TASK GROUP C: Inventory & Purchase Reports (Tasks 35-52)
        │
        ▼
TASK GROUP D: Customer & Staff Reports (Tasks 53-70)
        │
        ▼
TASK GROUP E: Report Builder & Scheduling (Tasks 71-84)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 85-94)
```

---

## Task Index

### Group A: Report Framework (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create analytics App** | Initialize Django app for analytics | None | 🔴 Not Created |
| 02 | **Register analytics App** | Add to TENANT_APPS in settings | Task 01 | 🔴 Not Created |
| 03 | **Define ReportCategory Enum** | Create: SALES, INVENTORY, PURCHASE, CUSTOMER, STAFF | Task 02 | 🔴 Not Created |
| 04 | **Define ReportFormat Enum** | Create: PDF, EXCEL, CSV, JSON | Task 03 | 🔴 Not Created |
| 05 | **Define ReportStatus Enum** | Create: PENDING, GENERATING, COMPLETED, FAILED | Task 04 | 🔴 Not Created |
| 06 | **Create ReportDefinition Model** | Define available report types | Task 05 | 🔴 Not Created |
| 07 | **Add Definition Name Field** | Add name, code, description | Task 06 | 🔴 Not Created |
| 08 | **Add Definition Category** | Add category using ReportCategory | Task 06 | 🔴 Not Created |
| 09 | **Add Definition Parameters** | Add available_filters JSONField | Task 06 | 🔴 Not Created |
| 10 | **Add Definition Permissions** | Add required_permission | Task 06 | 🔴 Not Created |
| 11 | **Run ReportDefinition Migrations** | Generate and apply migrations | Task 10 | 🔴 Not Created |
| 12 | **Create ReportInstance Model** | Track generated reports | Task 11 | 🔴 Not Created |
| 13 | **Add Instance Parameters** | Add filter_parameters JSONField | Task 12 | 🔴 Not Created |
| 14 | **Add Instance Output** | Add output_file, output_format | Task 12 | 🔴 Not Created |
| 15 | **Add Instance Status** | Add status, generated_at, error_message | Task 12 | 🔴 Not Created |
| 16 | **Run ReportInstance Migrations** | Generate and apply migrations | Task 15 | 🔴 Not Created |

---

### Group B: Sales Reports (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create BaseReportGenerator** | Abstract base class for reports | Task 16 | 🔴 Not Created |
| 18 | **Add Generate Method** | Abstract generate() method | Task 17 | 🔴 Not Created |
| 19 | **Add Export Methods** | to_pdf(), to_excel(), to_csv() | Task 18 | 🔴 Not Created |
| 20 | **Create SalesByProductReport** | Sales breakdown by product | Task 19 | 🔴 Not Created |
| 21 | **Add Product Filter** | Filter by product/category | Task 20 | 🔴 Not Created |
| 22 | **Add Date Range Filter** | Filter by date range | Task 20 | 🔴 Not Created |
| 23 | **Add Quantity/Revenue Columns** | Calculate totals | Task 22 | 🔴 Not Created |
| 24 | **Create SalesByCustomerReport** | Sales breakdown by customer | Task 23 | 🔴 Not Created |
| 25 | **Add Customer Ranking** | Rank by purchase amount | Task 24 | 🔴 Not Created |
| 26 | **Add Order Count Column** | Include order count | Task 25 | 🔴 Not Created |
| 27 | **Create SalesByPeriodReport** | Sales by day/week/month | Task 26 | 🔴 Not Created |
| 28 | **Add Period Grouping** | Group by selected period | Task 27 | 🔴 Not Created |
| 29 | **Add Trend Visualization** | Chart data for trends | Task 28 | 🔴 Not Created |
| 30 | **Create SalesByChannelReport** | POS vs Webstore split | Task 29 | 🔴 Not Created |
| 31 | **Add Channel Comparison** | Compare channels | Task 30 | 🔴 Not Created |
| 32 | **Create SalesByCashierReport** | Sales by staff member | Task 31 | 🔴 Not Created |
| 33 | **Add Cashier Performance Metrics** | Include AOV, transaction count | Task 32 | 🔴 Not Created |
| 34 | **Create Sales Report Endpoint** | GET /analytics/sales/ | Task 33 | 🔴 Not Created |

---

### Group C: Inventory & Purchase Reports (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create StockLevelReport** | Current stock by product | Task 34 | 🔴 Not Created |
| 36 | **Add Location Filter** | Filter by warehouse | Task 35 | 🔴 Not Created |
| 37 | **Add Category Filter** | Filter by category | Task 35 | 🔴 Not Created |
| 38 | **Add Stock Value Column** | Calculate stock value | Task 37 | 🔴 Not Created |
| 39 | **Create StockMovementReport** | Stock in/out transactions | Task 38 | 🔴 Not Created |
| 40 | **Add Movement Type Filter** | IN, OUT, ADJUSTMENT | Task 39 | 🔴 Not Created |
| 41 | **Add Running Balance** | Show running stock balance | Task 40 | 🔴 Not Created |
| 42 | **Create StockValuationReport** | Inventory valuation | Task 41 | 🔴 Not Created |
| 43 | **Add Valuation Method** | FIFO, LIFO, Average | Task 42 | 🔴 Not Created |
| 44 | **Add Age Analysis** | Stock aging buckets | Task 43 | 🔴 Not Created |
| 45 | **Create PurchaseByVendorReport** | Purchases by vendor | Task 44 | 🔴 Not Created |
| 46 | **Add Vendor Ranking** | Rank by purchase amount | Task 45 | 🔴 Not Created |
| 47 | **Add Payment Status Column** | Include payment info | Task 46 | 🔴 Not Created |
| 48 | **Create PurchaseByCategoryReport** | Purchases by category | Task 47 | 🔴 Not Created |
| 49 | **Add Category Breakdown** | Percentage breakdown | Task 48 | 🔴 Not Created |
| 50 | **Create VendorPerformanceReport** | Delivery, quality metrics | Task 49 | 🔴 Not Created |
| 51 | **Add Lead Time Analysis** | Average delivery time | Task 50 | 🔴 Not Created |
| 52 | **Create Inventory Report Endpoint** | GET /analytics/inventory/ | Task 51 | 🔴 Not Created |

---

### Group D: Customer & Staff Reports (Tasks 53-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create CustomerAcquisitionReport** | New customers by period | Task 52 | 🔴 Not Created |
| 54 | **Add Acquisition Channel** | How customers found us | Task 53 | 🔴 Not Created |
| 55 | **Add First Purchase Value** | Initial order value | Task 54 | 🔴 Not Created |
| 56 | **Create CustomerRetentionReport** | Repeat customer analysis | Task 55 | 🔴 Not Created |
| 57 | **Add Repeat Rate Calc** | Calculate repeat % | Task 56 | 🔴 Not Created |
| 58 | **Add Churn Analysis** | Identify churned customers | Task 57 | 🔴 Not Created |
| 59 | **Create CustomerLifetimeValueReport** | CLV calculation | Task 58 | 🔴 Not Created |
| 60 | **Add CLV Formula** | Calculate average CLV | Task 59 | 🔴 Not Created |
| 61 | **Add Customer Segmentation** | High/Medium/Low value | Task 60 | 🔴 Not Created |
| 62 | **Create Customer Report Endpoint** | GET /analytics/customers/ | Task 61 | 🔴 Not Created |
| 63 | **Create AttendanceReport** | Staff attendance summary | Task 62 | 🔴 Not Created |
| 64 | **Add Attendance Rate Calc** | Calculate % present | Task 63 | 🔴 Not Created |
| 65 | **Add Late/Early Stats** | Track punctuality | Task 64 | 🔴 Not Created |
| 66 | **Create LeaveReport** | Leave utilization summary | Task 65 | 🔴 Not Created |
| 67 | **Add Leave Balance Analysis** | Track leave balances | Task 66 | 🔴 Not Created |
| 68 | **Create OvertimeReport** | Overtime hours by employee | Task 67 | 🔴 Not Created |
| 69 | **Add Overtime Cost Calc** | Calculate OT cost | Task 68 | 🔴 Not Created |
| 70 | **Create Staff Report Endpoint** | GET /analytics/staff/ | Task 69 | 🔴 Not Created |

---

### Group E: Report Builder & Scheduling (Tasks 71-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Create SavedReport Model** | User-saved report configs | Task 70 | 🔴 Not Created |
| 72 | **Add Saved Report Name** | Add name, description | Task 71 | 🔴 Not Created |
| 73 | **Add Saved Report Config** | Add report_type, filters JSON | Task 71 | 🔴 Not Created |
| 74 | **Add Saved Report Owner** | FK to user | Task 71 | 🔴 Not Created |
| 75 | **Run SavedReport Migrations** | Generate and apply migrations | Task 74 | 🔴 Not Created |
| 76 | **Create ScheduledReport Model** | Scheduled report generation | Task 75 | 🔴 Not Created |
| 77 | **Add Schedule Frequency** | DAILY, WEEKLY, MONTHLY | Task 76 | 🔴 Not Created |
| 78 | **Add Schedule Recipients** | Email recipients list | Task 76 | 🔴 Not Created |
| 79 | **Add Schedule Next Run** | Next execution time | Task 76 | 🔴 Not Created |
| 80 | **Run ScheduledReport Migrations** | Generate and apply migrations | Task 79 | 🔴 Not Created |
| 81 | **Create Report Scheduler Celery Task** | Process scheduled reports | Task 80 | 🔴 Not Created |
| 82 | **Add Generate Scheduled Method** | Generate and email report | Task 81 | 🔴 Not Created |
| 83 | **Add Email Distribution** | Send report as attachment | Task 82 | 🔴 Not Created |
| 84 | **Add Schedule History Tracking** | Track past executions | Task 83 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 85-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create Report Admin** | Django admin for reports | Task 84 | 🔴 Not Created |
| 86 | **Create Report Serializers** | DRF serializers for all reports | Task 85 | 🔴 Not Created |
| 87 | **Create ReportViewSet** | Combined ViewSet for reports | Task 86 | 🔴 Not Created |
| 88 | **Add List Available Reports** | GET /analytics/reports/ | Task 87 | 🔴 Not Created |
| 89 | **Add Generate Report Endpoint** | POST /analytics/generate/ | Task 88 | 🔴 Not Created |
| 90 | **Add Download Report Endpoint** | GET /analytics/download/{id}/ | Task 89 | 🔴 Not Created |
| 91 | **Add Analytics URL Routes** | Register routes in urls.py | Task 90 | 🔴 Not Created |
| 92 | **Write Report Generator Tests** | Unit tests for generators | Task 91 | 🔴 Not Created |
| 93 | **Write Scheduler Tests** | Tests for scheduled reports | Task 92 | 🔴 Not Created |
| 94 | **Create Analytics API Documentation** | Document all endpoints | Task 93 | 🔴 Not Created |

---

## Expected File Structure

```
apps/analytics/
├── __init__.py
├── admin.py                    # Report admin configuration
├── apps.py                     # App config
├── models/
│   ├── __init__.py
│   ├── report_definition.py    # ReportDefinition model
│   ├── report_instance.py      # ReportInstance model
│   ├── saved_report.py         # SavedReport model
│   └── scheduled_report.py     # ScheduledReport model
├── serializers/
│   ├── __init__.py
│   ├── report.py               # Report serializers
│   └── schedule.py             # Schedule serializers
├── views/
│   ├── __init__.py
│   └── reports.py              # Report ViewSet
├── generators/
│   ├── __init__.py
│   ├── base.py                 # BaseReportGenerator
│   ├── sales/
│   │   ├── __init__.py
│   │   ├── by_product.py       # SalesByProductReport
│   │   ├── by_customer.py      # SalesByCustomerReport
│   │   ├── by_period.py        # SalesByPeriodReport
│   │   ├── by_channel.py       # SalesByChannelReport
│   │   └── by_cashier.py       # SalesByCashierReport
│   ├── inventory/
│   │   ├── __init__.py
│   │   ├── stock_level.py      # StockLevelReport
│   │   ├── stock_movement.py   # StockMovementReport
│   │   └── stock_valuation.py  # StockValuationReport
│   ├── purchase/
│   │   ├── __init__.py
│   │   ├── by_vendor.py        # PurchaseByVendorReport
│   │   ├── by_category.py      # PurchaseByCategoryReport
│   │   └── vendor_performance.py
│   ├── customer/
│   │   ├── __init__.py
│   │   ├── acquisition.py      # CustomerAcquisitionReport
│   │   ├── retention.py        # CustomerRetentionReport
│   │   └── lifetime_value.py   # CustomerLifetimeValueReport
│   └── staff/
│       ├── __init__.py
│       ├── attendance.py       # AttendanceReport
│       ├── leave.py            # LeaveReport
│       └── overtime.py         # OvertimeReport
├── exporters/
│   ├── __init__.py
│   ├── pdf.py                  # PDF exporter
│   ├── excel.py                # Excel exporter
│   └── csv.py                  # CSV exporter
├── services/
│   ├── __init__.py
│   └── scheduler.py            # Report scheduling service
├── fixtures/
│   └── report_definitions.json # Default report types
├── tasks.py                    # Celery tasks (scheduled reports)
├── urls.py                     # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_sales_reports.py
│   ├── test_inventory_reports.py
│   ├── test_customer_reports.py
│   └── test_scheduler.py
└── migrations/

frontend/src/app/(dashboard)/analytics/
├── page.tsx                    # Analytics home
├── sales/
│   ├── page.tsx                # Sales reports
│   └── [type]/
│       └── page.tsx            # Specific report
├── inventory/
│   ├── page.tsx                # Inventory reports
│   └── [type]/
│       └── page.tsx            # Specific report
├── customers/
│   ├── page.tsx                # Customer reports
│   └── [type]/
│       └── page.tsx            # Specific report
├── staff/
│   ├── page.tsx                # Staff reports
│   └── [type]/
│       └── page.tsx            # Specific report
├── scheduled/
│   ├── page.tsx                # Scheduled reports
│   └── new/
│       └── page.tsx            # Create schedule
├── components/
│   ├── ReportFilters.tsx       # Filter controls
│   ├── ReportTable.tsx         # Data table
│   ├── ReportChart.tsx         # Chart display
│   ├── ExportButtons.tsx       # Export options
│   └── ScheduleForm.tsx        # Schedule config
└── hooks/
    ├── useReports.ts
    └── useScheduledReports.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Report Framework | 16 | 0 | 0% |
| Group B: Sales Reports | 18 | 0 | 0% |
| Group C: Inventory & Purchase Reports | 18 | 0 | 0% |
| Group D: Customer & Staff Reports | 18 | 0 | 0% |
| Group E: Report Builder & Scheduling | 14 | 0 | 0% |
| Group F: API, Testing & Documentation | 10 | 0 | 0% |
| **TOTAL** | **94** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **Report Generation Pattern:**
   - User selects report type and filters
   - Backend validates and generates data
   - Response includes data + chart config
   - Export triggered separately

2. **Filter Types:**
   - Date Range (required for most)
   - Category (multi-select)
   - Product (multi-select)
   - Customer (multi-select)
   - Location (single-select)

3. **Export Formats:**
   - PDF: Formatted, print-ready
   - Excel: Raw data with formulas
   - CSV: Simple data export
   - JSON: API/integration use

4. **Scheduled Reports:**
   - Run during off-peak hours
   - Email with attachment
   - Track success/failure
   - Retry on failure

5. **Performance:**
   - Paginate large datasets
   - Cache common reports
   - Background generation for heavy reports

### Report Output Structure

```json
{
  "report_type": "sales_by_product",
  "title": "Sales by Product Report",
  "filters_applied": {
    "date_range": "2026-01-01 to 2026-01-31",
    "category": "All Categories"
  },
  "generated_at": "2026-01-31T10:00:00Z",
  "summary": {
    "total_revenue": 1250000.00,
    "total_quantity": 5420,
    "unique_products": 145
  },
  "data": [
    {
      "product_name": "Rice 5kg",
      "category": "Groceries",
      "quantity_sold": 850,
      "revenue": 127500.00,
      "percentage": 10.2
    }
  ],
  "chart_config": {
    "type": "bar",
    "labels": ["Rice 5kg", "Sugar 1kg", ...],
    "datasets": [{"label": "Revenue", "data": [127500, ...]}]
  }
}
```

### Sri Lanka Specific

1. **Currency Format:**
   - LKR 1,234,567.89
   - PDF reports in LKR

2. **Date Format:**
   - DD/MM/YYYY (Sri Lanka standard)
   - Reports grouped by fiscal periods

3. **Common Report Needs:**
   - Sales tax (VAT) reports
   - EPF/ETF summaries
   - Inventory by supplier origin

### Customer Analytics Formulas

**Customer Lifetime Value (CLV):**
```
CLV = Average Order Value × Purchase Frequency × Customer Lifespan
```

**Customer Retention Rate:**
```
Retention = ((Customers End - New Customers) / Customers Start) × 100
```

**Customer Churn Rate:**
```
Churn = (Lost Customers / Total Customers Start) × 100
```

### Inventory Analytics

**Inventory Turnover:**
```
Turnover = Cost of Goods Sold / Average Inventory Value
```

**Days Sales of Inventory (DSI):**
```
DSI = (Average Inventory / COGS) × 365
```

**Stock Age Buckets:**
- 0-30 days: Current
- 31-60 days: Slow
- 61-90 days: Aging
- 90+ days: Dead stock

---

## Completion Checklist

- [ ] ReportDefinition model with fixtures
- [ ] ReportInstance model for tracking
- [ ] BaseReportGenerator abstract class
- [ ] All Sales reports (5 types)
- [ ] All Inventory reports (3 types)
- [ ] All Purchase reports (3 types)
- [ ] All Customer reports (3 types)
- [ ] All Staff reports (3 types)
- [ ] PDF exporter (WeasyPrint)
- [ ] Excel exporter (openpyxl)
- [ ] CSV exporter
- [ ] SavedReport model
- [ ] ScheduledReport model
- [ ] Celery task for scheduled reports
- [ ] Email distribution
- [ ] DRF serializers and ViewSet
- [ ] Unit tests for all generators
- [ ] API documentation

---

## Phase 06 Completion Summary

With this SubPhase-14 complete, Phase 06 (ERP Advanced Modules) is fully planned:

| SubPhase | Name | Tasks |
|----------|------|-------|
| 01 | Employee Management | 92 |
| 02 | Department & Designations | 78 |
| 03 | Attendance System | 88 |
| 04 | Leave Management | 90 |
| 05 | Salary Structure | 86 |
| 06 | Payroll Processing | 92 |
| 07 | Payslip Generation | 88 |
| 08 | Chart of Accounts | 86 |
| 09 | Journal Entries | 94 |
| 10 | Account Reconciliation | 84 |
| 11 | Financial Reports | 92 |
| 12 | Tax Reporting | 88 |
| 13 | Dashboard KPIs | 90 |
| 14 | Analytics & Reports | 94 |
| **TOTAL** | **14 SubPhases** | **~1,242 Tasks** |
