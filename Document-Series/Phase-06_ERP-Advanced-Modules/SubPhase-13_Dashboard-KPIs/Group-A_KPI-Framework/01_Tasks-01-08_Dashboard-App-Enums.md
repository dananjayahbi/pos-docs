# Tasks 01-08: Dashboard App and Enums

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** A - KPI Framework  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_KPIDefinition-BaseCalculator.md](02_Tasks-09-16_KPIDefinition-BaseCalculator.md)

---

## Document Overview

This document covers the foundation of the dashboard KPI system, including the dashboard application structure, KPI category and period enumerations, widget type definitions, and the core KPIDefinition model with its fundamental fields. These elements establish the base infrastructure for comprehensive business intelligence and performance monitoring.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create dashboard App | Low | 10 min |
| 02 | Register dashboard App | Low | 5 min |
| 03 | Define KPICategory Enum | Low | 15 min |
| 04 | Define KPIPeriod Enum | Low | 15 min |
| 05 | Define WidgetType Enum | Low | 15 min |
| 06 | Create KPIDefinition Model | Medium | 30 min |
| 07 | Add KPI Name Field | Low | 15 min |
| 08 | Add KPI Category Field | Low | 10 min |

---

## Task 01: Create Dashboard App

### Overview
Create the `dashboard` Django application to organize all dashboard and KPI-related functionality. This application will contain models for KPI definitions, calculation engines, widget configurations, and administrative interfaces for dashboard management.

### Dependencies
- Django project structure is established
- Monorepo backend structure exists
- Multi-tenancy infrastructure is configured

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Navigate to `apps/` directory
   - This is where all Django apps reside

2. **Create dashboard application**
   - Use Django's startapp command
   - Create new Django app named `dashboard`
   - This will generate the standard Django app structure

3. **Verify app structure**
   - Confirm `dashboard/` directory exists
   - Check for standard Django files (models.py, views.py, admin.py, etc.)

4. **Create enums subdirectory**
   - Create `enums/` directory inside `dashboard/`
   - This will contain KPI-related enumerations

5. **Create enums package initialization**
   - Create `__init__.py` in `enums/` directory
   - Leave empty initially (will import enums later)

6. **Create calculators subdirectory**
   - Create `calculators/` directory inside `dashboard/`
   - This will contain KPI calculation logic

7. **Create calculators package initialization**
   - Create `__init__.py` in `calculators/` directory
   - Leave empty initially

8. **Create widgets subdirectory**
   - Create `widgets/` directory inside `dashboard/`
   - This will contain widget configuration models

9. **Create widgets package initialization**
   - Create `__init__.py` in `widgets/` directory
   - Leave empty initially

10. **Add app docstring**
    - Open `dashboard/__init__.py`
    - Add comprehensive module documentation
    - Explain dashboard purpose and KPI system

### Directory Structure
```
apps/dashboard/
├── __init__.py                    # Package initialization with docstring
├── models.py                      # Core models
├── views.py                       # Dashboard views
├── admin.py                       # Admin configurations
├── apps.py                        # App configuration
├── tests.py                       # Unit tests
├── enums/
│   └── __init__.py               # Enum imports
├── calculators/
│   └── __init__.py               # Calculator imports
└── widgets/
    └── __init__.py               # Widget imports
```

### App Purpose

| Component | Purpose |
|-----------|---------|
| `dashboard/__init__.py` | Package entry point and documentation |
| `models.py` | KPI definitions and dashboard models |
| `enums/` | Category, period, and widget type enums |
| `calculators/` | KPI calculation engines |
| `widgets/` | Dashboard widget configurations |
| `admin.py` | Django admin customization |

### Expected Outcome
- Clean Django app structure
- Organized subdirectories for specialized components
- Foundation for dashboard and KPI system
- Ready for model and enum definitions

### Verification Checklist
- [ ] `apps/dashboard/` directory exists
- [ ] Standard Django app files present
- [ ] `dashboard/__init__.py` has docstring
- [ ] `enums/` subdirectory created
- [ ] `enums/__init__.py` file exists
- [ ] `calculators/` subdirectory created
- [ ] `calculators/__init__.py` file exists
- [ ] `widgets/` subdirectory created
- [ ] `widgets/__init__.py` file exists

---

## Task 02: Register Dashboard App

### Overview
Register the dashboard application in Django settings as a tenant-aware application. This ensures that dashboard data, KPI definitions, and widgets are properly isolated per tenant and that Django recognizes the app for migrations, admin, and routing.

### Dependencies
- Task 01: Create dashboard App
- Django multi-tenancy configuration exists
- Settings file with TENANT_APPS configured

### Instructions

1. **Open settings file**
   - Navigate to project settings directory
   - Open main settings file (settings.py or settings/base.py)
   - Locate TENANT_APPS configuration

2. **Add dashboard to TENANT_APPS**
   - Add `'apps.dashboard'` to TENANT_APPS list
   - Place after core apps but before optional modules
   - Maintain alphabetical or logical ordering

3. **Verify app configuration**
   - Confirm dashboard appears in TENANT_APPS
   - Check that app path is correct
   - Ensure no typos in app name

4. **Update AppConfig if needed**
   - Open `dashboard/apps.py`
   - Verify `name = 'apps.dashboard'`
   - Set appropriate `verbose_name = 'Dashboard & KPIs'`
   - Add `default_auto_field` if needed

5. **Document app purpose**
   - Add comment above dashboard entry in TENANT_APPS
   - Explain dashboard and KPI functionality
   - Note tenant isolation requirements

### TENANT_APPS Configuration

```python
TENANT_APPS = [
    # Core business apps
    'apps.inventory',
    'apps.sales',
    'apps.pos',
    'apps.accounting',
    
    # Advanced modules
    'apps.dashboard',           # Dashboard, KPIs, business intelligence
    'apps.reports',
    'apps.analytics',
    
    # ... other tenant apps
]
```

### App Registration Importance

| Aspect | Impact |
|--------|--------|
| **Migrations** | Django creates tenant-schema migrations |
| **Models** | Dashboard models are tenant-aware |
| **Admin** | Dashboard admin accessible per tenant |
| **Data Isolation** | KPIs isolated per tenant schema |
| **Routing** | Dashboard URLs available per tenant |

### Multi-Tenancy Considerations

```
Tenant A Schema
═══════════════════════════════════
├── dashboard_kpidefinition
│   ├── Sales KPIs for Tenant A
│   ├── Inventory KPIs for Tenant A
│   └── Financial KPIs for Tenant A
├── dashboard_widgetconfig
└── dashboard_kpicalculation

Tenant B Schema
═══════════════════════════════════
├── dashboard_kpidefinition
│   ├── Sales KPIs for Tenant B
│   ├── Inventory KPIs for Tenant B
│   └── Financial KPIs for Tenant B
├── dashboard_widgetconfig
└── dashboard_kpicalculation

Complete Data Isolation ✓
```

### AppConfig Example

```python
# dashboard/apps.py
from django.apps import AppConfig

class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.dashboard'
    verbose_name = 'Dashboard & KPIs'
    
    def ready(self):
        # Import signal handlers if needed
        pass
```

### Expected Outcome
- Dashboard app registered as tenant-aware
- Models will be created in tenant schemas
- Dashboard accessible per tenant
- Foundation for tenant-specific KPIs

### Verification Checklist
- [ ] Dashboard added to TENANT_APPS
- [ ] App path is correct ('apps.dashboard')
- [ ] Comment documenting app purpose
- [ ] AppConfig name matches
- [ ] verbose_name is set appropriately
- [ ] No registration errors when running Django

---

## Task 03: Define KPICategory Enum

### Overview
Define the KPICategory enumeration that categorizes different types of KPIs across the ERP system. These categories help organize KPIs logically, enable category-based filtering in dashboards, and align with business functional areas relevant to Sri Lankan enterprises.

### Dependencies
- Task 01: Create dashboard App
- Python enum support (Django 3.0+)

### Instructions

1. **Create category enum file**
   - Create file at `apps/dashboard/enums/category.py`
   - Import Django TextChoices or Python Enum

2. **Import required modules**
   - Import Django's models.TextChoices
   - This provides database-friendly enumerations
   - Ensures type safety and validation

3. **Define KPICategory class**
   - Create class inheriting from models.TextChoices
   - Add comprehensive class docstring
   - Explain categorization purpose

4. **Add SALES category**
   - Value: 'SALES'
   - Label: 'Sales & Revenue'
   - Covers revenue, orders, customer metrics
   - Most critical for retail and distribution

5. **Add INVENTORY category**
   - Value: 'INVENTORY'
   - Label: 'Inventory & Stock'
   - Covers stock levels, turnover, wastage
   - Critical for supply chain management

6. **Add FINANCIAL category**
   - Value: 'FINANCIAL'
   - Label: 'Financial Performance'
   - Covers profitability, cash flow, expenses
   - Essential for financial health monitoring

7. **Add HR category**
   - Value: 'HR'
   - Label: 'Human Resources'
   - Covers employee metrics, attendance, productivity
   - Important for workforce management

8. **Add CUSTOMER category**
   - Value: 'CUSTOMER'
   - Label: 'Customer Metrics'
   - Covers satisfaction, retention, loyalty
   - Critical for customer-centric businesses

9. **Add OPERATIONS category**
   - Value: 'OPERATIONS'
   - Label: 'Operations & Efficiency'
   - Covers process efficiency, service times
   - Important for operational excellence

10. **Add COMPLIANCE category**
    - Value: 'COMPLIANCE'
    - Label: 'Compliance & Regulatory'
    - Covers tax compliance, regulatory reporting
    - Essential for Sri Lankan business compliance

11. **Update enums/__init__.py**
    - Import KPICategory
    - Add to __all__ list
    - Make available for model imports

### KPI Category Structure

```
┌──────────────────────────────────────────────────┐
│           KPICategory Enumeration                │
├──────────────────────────────────────────────────┤
│ SALES          - Sales & Revenue                 │
│ INVENTORY      - Inventory & Stock               │
│ FINANCIAL      - Financial Performance           │
│ HR             - Human Resources                 │
│ CUSTOMER       - Customer Metrics                │
│ OPERATIONS     - Operations & Efficiency         │
│ COMPLIANCE     - Compliance & Regulatory         │
└──────────────────────────────────────────────────┘
```

### Category Details

| Category | Value | Label | Focus Area | Priority |
|----------|-------|-------|------------|----------|
| SALES | 'SALES' | Sales & Revenue | Revenue, orders, growth | High |
| INVENTORY | 'INVENTORY' | Inventory & Stock | Stock levels, turnover | High |
| FINANCIAL | 'FINANCIAL' | Financial Performance | Profit, cash flow, ROI | High |
| HR | 'HR' | Human Resources | Employees, productivity | Medium |
| CUSTOMER | 'CUSTOMER' | Customer Metrics | Satisfaction, retention | Medium |
| OPERATIONS | 'OPERATIONS' | Operations & Efficiency | Process efficiency | Medium |
| COMPLIANCE | 'COMPLIANCE' | Compliance & Regulatory | Tax, regulations | High |

### Category-Based KPI Examples

#### SALES Category
- Daily revenue
- Monthly sales growth
- Average transaction value
- Sales per square foot
- Top-selling products
- Sales by payment method
- Peak hour performance

#### INVENTORY Category
- Stock turnover rate
- Days of inventory on hand
- Stock-out frequency
- Overstock percentage
- Dead stock value
- Inventory accuracy
- Reorder point compliance

#### FINANCIAL Category
- Gross profit margin
- Net profit margin
- Operating cash flow
- Return on investment (ROI)
- Break-even point
- Cost of goods sold (COGS)
- Accounts receivable turnover

#### HR Category
- Employee headcount
- Attendance rate
- Employee turnover
- Productivity per employee
- Training hours completed
- Overtime percentage
- Salary expense ratio

#### CUSTOMER Category
- Customer satisfaction score
- Net promoter score (NPS)
- Customer retention rate
- Average customer lifetime value
- Repeat purchase rate
- Customer complaint rate
- Customer acquisition cost

#### OPERATIONS Category
- Order fulfillment time
- Average service time
- Process efficiency rate
- Equipment utilization
- Waste percentage
- Quality defect rate
- On-time delivery rate

#### COMPLIANCE Category
- VAT filing compliance
- WHT remittance status
- EPF/ETF payment compliance
- NBT filing status
- CESS payment compliance
- Audit readiness score
- License renewal status

### Sri Lankan Business Context

| Category | Local Relevance | Example KPIs |
|----------|----------------|--------------|
| SALES | Retail/Distribution focus | Daily revenue, festive season performance |
| INVENTORY | Import-dependent economy | Import lead time, customs clearance time |
| FINANCIAL | SME cash flow critical | Cash position, debtor aging |
| HR | Labor regulations | EPF/ETF compliance, leave balance |
| CUSTOMER | Relationship-driven market | Customer loyalty, referral rate |
| OPERATIONS | Service quality focus | Queue time, service efficiency |
| COMPLIANCE | Complex tax structure | VAT compliance, WHT tracking |

### Dashboard Organization

```
Main Dashboard
═══════════════════════════════════════════════════

┌─────────────────────┐  ┌─────────────────────┐
│  SALES              │  │  INVENTORY          │
│  ─────              │  │  ─────────          │
│  Daily Revenue      │  │  Stock Value        │
│  Orders Today       │  │  Low Stock Items    │
│  Avg Transaction    │  │  Turnover Rate      │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│  FINANCIAL          │  │  CUSTOMER           │
│  ─────────          │  │  ────────           │
│  Profit Margin      │  │  Satisfaction       │
│  Cash Flow          │  │  Retention Rate     │
│  ROI                │  │  Lifetime Value     │
└─────────────────────┘  └─────────────────────┘

Category-Based Widget Organization
```

### Expected Outcome
- Clear KPI categorization
- Logical grouping of metrics
- Category-based dashboard organization
- Sri Lankan business alignment
- Type-safe category references

### Verification Checklist
- [ ] category.py file created
- [ ] KPICategory class defined
- [ ] SALES category added
- [ ] INVENTORY category added
- [ ] FINANCIAL category added
- [ ] HR category added
- [ ] CUSTOMER category added
- [ ] OPERATIONS category added
- [ ] COMPLIANCE category added
- [ ] Class docstring comprehensive
- [ ] Imported in enums/__init__.py

---

## Task 04: Define KPIPeriod Enum

### Overview
Define the KPIPeriod enumeration that specifies time periods for KPI calculation and display. These periods enable time-based analysis, trend tracking, and performance comparison across different timeframes, aligned with Sri Lankan business cycles and fiscal year.

### Dependencies
- Task 01: Create dashboard App
- Python enum support

### Instructions

1. **Create period enum file**
   - Create file at `apps/dashboard/enums/period.py`
   - Import Django TextChoices

2. **Import required modules**
   - Import Django's models.TextChoices
   - Ensures database compatibility
   - Provides type safety

3. **Define KPIPeriod class**
   - Create class inheriting from models.TextChoices
   - Add comprehensive class docstring
   - Explain period usage in KPI calculations

4. **Add TODAY period**
   - Value: 'TODAY'
   - Label: 'Today'
   - Current day performance
   - Real-time monitoring

5. **Add YESTERDAY period**
   - Value: 'YESTERDAY'
   - Label: 'Yesterday'
   - Previous day comparison
   - Day-over-day analysis

6. **Add WEEK period**
   - Value: 'WEEK'
   - Label: 'This Week'
   - Current week (Monday-Sunday)
   - Weekly performance tracking

7. **Add LAST_WEEK period**
   - Value: 'LAST_WEEK'
   - Label: 'Last Week'
   - Previous week comparison
   - Week-over-week analysis

8. **Add MONTH period**
   - Value: 'MONTH'
   - Label: 'This Month'
   - Current month performance
   - Monthly targets tracking

9. **Add LAST_MONTH period**
   - Value: 'LAST_MONTH'
   - Label: 'Last Month'
   - Previous month comparison
   - Month-over-month analysis

10. **Add QUARTER period**
    - Value: 'QUARTER'
    - Label: 'This Quarter'
    - Current quarter (aligned with Sri Lankan fiscal year)
    - Quarterly performance review

11. **Add YEAR period**
    - Value: 'YEAR'
    - Label: 'This Year'
    - Current fiscal year (April-March)
    - Annual performance tracking

12. **Add LAST_YEAR period**
    - Value: 'LAST_YEAR'
    - Label: 'Last Year'
    - Previous fiscal year comparison
    - Year-over-year growth

13. **Add CUSTOM period**
    - Value: 'CUSTOM'
    - Label: 'Custom Range'
    - User-defined date range
    - Flexible analysis

14. **Update enums/__init__.py**
    - Import KPIPeriod
    - Add to __all__ list

### KPI Period Structure

```
┌──────────────────────────────────────────────────┐
│            KPIPeriod Enumeration                 │
├──────────────────────────────────────────────────┤
│ TODAY          - Today                           │
│ YESTERDAY      - Yesterday                       │
│ WEEK           - This Week                       │
│ LAST_WEEK      - Last Week                       │
│ MONTH          - This Month                      │
│ LAST_MONTH     - Last Month                      │
│ QUARTER        - This Quarter                    │
│ YEAR           - This Year (Fiscal)              │
│ LAST_YEAR      - Last Year (Fiscal)              │
│ CUSTOM         - Custom Range                    │
└──────────────────────────────────────────────────┘
```

### Period Details

| Period | Value | Label | Timeframe | Use Case |
|--------|-------|-------|-----------|----------|
| TODAY | 'TODAY' | Today | Current day | Real-time monitoring |
| YESTERDAY | 'YESTERDAY' | Yesterday | Previous day | Daily comparison |
| WEEK | 'WEEK' | This Week | Mon-Sun current | Weekly tracking |
| LAST_WEEK | 'LAST_WEEK' | Last Week | Mon-Sun previous | Week-over-week |
| MONTH | 'MONTH' | This Month | 1st to current | Monthly targets |
| LAST_MONTH | 'LAST_MONTH' | Last Month | Previous month | Month-over-month |
| QUARTER | 'QUARTER' | This Quarter | Fiscal quarter | Quarterly reviews |
| YEAR | 'YEAR' | This Year | Apr-Mar current | Annual performance |
| LAST_YEAR | 'LAST_YEAR' | Last Year | Apr-Mar previous | Year-over-year |
| CUSTOM | 'CUSTOM' | Custom Range | User-defined | Flexible analysis |

### Sri Lankan Fiscal Year Alignment

#### Fiscal Year Structure (April-March)
```
Fiscal Year 2025/2026
═══════════════════════════════════════════════════

Q1: April - June 2025
    ├── April 2025
    ├── May 2025
    └── June 2025

Q2: July - September 2025
    ├── July 2025
    ├── August 2025
    └── September 2025

Q3: October - December 2025
    ├── October 2025
    ├── November 2025
    └── December 2025

Q4: January - March 2026
    ├── January 2026
    ├── February 2026
    └── March 2026
```

### Period Calculation Examples

#### TODAY Period
```
Date: January 25, 2026
Time: 2:30 PM

Period Start: January 25, 2026 00:00:00
Period End:   January 25, 2026 23:59:59

Use Case: Real-time sales monitoring
KPI: "Sales Today" = LKR 45,000 (so far)
```

#### WEEK Period
```
Current Date: January 25, 2026 (Saturday)

Week Start:   January 20, 2026 (Monday) 00:00:00
Week End:     January 26, 2026 (Sunday) 23:59:59

Use Case: Weekly sales target tracking
KPI: "Sales This Week" = LKR 320,000 (Mon-Sat)
Target: LKR 400,000
Progress: 80% complete
```

#### MONTH Period
```
Current Date: January 25, 2026

Month Start:  January 1, 2026 00:00:00
Month End:    January 31, 2026 23:59:59

Use Case: Monthly revenue tracking
KPI: "Sales This Month" = LKR 1,250,000
Target: LKR 1,500,000
Remaining Days: 6 days
Daily Required: LKR 41,667
```

#### QUARTER Period (Sri Lankan Fiscal Year)
```
Current Date: January 25, 2026
Fiscal Year: 2025/2026

Q4 Start:     January 1, 2026 00:00:00
Q4 End:       March 31, 2026 23:59:59

Quarter: Q4 (January-March 2026)
Progress: 25 days of 90 days
KPI: "Quarterly Revenue" = LKR 3,800,000
Target: LKR 12,000,000
On Track: No (needs acceleration)
```

#### YEAR Period (Sri Lankan Fiscal Year)
```
Current Date: January 25, 2026
Fiscal Year: 2025/2026

FY Start:     April 1, 2025 00:00:00
FY End:       March 31, 2026 23:59:59

Months Complete: 9.8 months (10 of 12)
KPI: "Annual Revenue" = LKR 48,000,000
Target: LKR 60,000,000
Progress: 80%
Remaining: LKR 12,000,000 in 2.2 months
```

### Period Comparison Matrix

| Comparison Type | Current Period | Comparison Period | Analysis |
|----------------|----------------|-------------------|----------|
| Day-over-day | TODAY | YESTERDAY | Daily trends |
| Week-over-week | WEEK | LAST_WEEK | Weekly performance |
| Month-over-month | MONTH | LAST_MONTH | Monthly growth |
| Year-over-year | YEAR | LAST_YEAR | Annual growth |
| Custom | CUSTOM | CUSTOM | Flexible comparison |

### Business Hours Consideration (Sri Lankan Context)

```
Typical Business Hours: 9:00 AM - 6:00 PM

TODAY Period Calculation:
═══════════════════════════════════════
- Start: 00:00:00 (midnight)
- Current: 14:30:00 (2:30 PM)
- End: 23:59:59 (midnight)

Business Hours Elapsed: 5.5 hours of 9 hours
Business Day Progress: 61%

KPI Adjustment:
- Raw Today Sales: LKR 45,000
- Business Hours Only: LKR 43,000 (9 AM - 2:30 PM)
- Projected Full Day: LKR 70,500
```

### Festive Season Periods (Sri Lanka-Specific)

| Period Name | Dates | Period Type | Importance |
|------------|-------|-------------|------------|
| Sinhala Tamil New Year | April 13-15 | CUSTOM | High sales period |
| Vesak | May (full moon) | CUSTOM | Moderate sales |
| Poson | June (full moon) | CUSTOM | Moderate sales |
| Ramadan | Variable | CUSTOM | Special hours |
| Eid | Variable | CUSTOM | High sales |
| Christmas | December 25 | CUSTOM | High sales |
| Year-End | December 20-31 | CUSTOM | Peak sales period |

### Expected Outcome
- Comprehensive period definitions
- Sri Lankan fiscal year alignment
- Flexible time-based analysis
- Support for business hour tracking
- Festival season handling

### Verification Checklist
- [ ] period.py file created
- [ ] KPIPeriod class defined
- [ ] TODAY period added
- [ ] YESTERDAY period added
- [ ] WEEK period added
- [ ] LAST_WEEK period added
- [ ] MONTH period added
- [ ] LAST_MONTH period added
- [ ] QUARTER period added
- [ ] YEAR period added
- [ ] LAST_YEAR period added
- [ ] CUSTOM period added
- [ ] Class docstring comprehensive
- [ ] Fiscal year alignment documented
- [ ] Imported in enums/__init__.py

---

## Task 05: Define WidgetType Enum

### Overview
Define the WidgetType enumeration that specifies different visualization types for displaying KPIs on dashboards. These widget types enable diverse data presentation formats, from simple numbers to complex charts, ensuring effective communication of business metrics.

### Dependencies
- Task 01: Create dashboard App
- Python enum support

### Instructions

1. **Create widget type enum file**
   - Create file at `apps/dashboard/enums/widget_type.py`
   - Import Django TextChoices

2. **Import required modules**
   - Import Django's models.TextChoices
   - Ensures type safety and validation

3. **Define WidgetType class**
   - Create class inheriting from models.TextChoices
   - Add comprehensive class docstring
   - Explain widget visualization purposes

4. **Add NUMBER widget type**
   - Value: 'NUMBER'
   - Label: 'Number Widget'
   - Displays single numeric value
   - Simple, high-impact metric display

5. **Add CHART widget type**
   - Value: 'CHART'
   - Label: 'Chart Widget'
   - Displays data as various chart types
   - Trend visualization

6. **Add TABLE widget type**
   - Value: 'TABLE'
   - Label: 'Table Widget'
   - Displays data in tabular format
   - Detailed multi-row data

7. **Add GAUGE widget type**
   - Value: 'GAUGE'
   - Label: 'Gauge Widget'
   - Displays progress toward target
   - Visual performance indicator

8. **Add TREND widget type**
   - Value: 'TREND'
   - Label: 'Trend Widget'
   - Shows trend direction with sparkline
   - Compact trend visualization

9. **Add LIST widget type**
   - Value: 'LIST'
   - Label: 'List Widget'
   - Displays ranked or ordered items
   - Top performers, bottom performers

10. **Add MAP widget type**
    - Value: 'MAP'
    - Label: 'Map Widget'
    - Geographic data visualization
    - Branch/region performance

11. **Add CARD widget type**
    - Value: 'CARD'
    - Label: 'Card Widget'
    - Multi-metric information card
    - Summary dashboard cards

12. **Update enums/__init__.py**
    - Import WidgetType
    - Add to __all__ list

### Widget Type Structure

```
┌──────────────────────────────────────────────────┐
│            WidgetType Enumeration                │
├──────────────────────────────────────────────────┤
│ NUMBER         - Number Widget                   │
│ CHART          - Chart Widget                    │
│ TABLE          - Table Widget                    │
│ GAUGE          - Gauge Widget                    │
│ TREND          - Trend Widget                    │
│ LIST           - List Widget                     │
│ MAP            - Map Widget                      │
│ CARD           - Card Widget                     │
└──────────────────────────────────────────────────┘
```

### Widget Type Details

| Type | Value | Label | Visualization | Best For |
|------|-------|-------|---------------|----------|
| NUMBER | 'NUMBER' | Number Widget | Large number display | Single key metric |
| CHART | 'CHART' | Chart Widget | Line/Bar/Pie charts | Trends over time |
| TABLE | 'TABLE' | Table Widget | Data table | Detailed data lists |
| GAUGE | 'GAUGE' | Gauge Widget | Progress gauge | Target achievement |
| TREND | 'TREND' | Trend Widget | Mini trend line | Compact trend view |
| LIST | 'LIST' | List Widget | Ranked list | Top/bottom items |
| MAP | 'MAP' | Map Widget | Geographic map | Location-based data |
| CARD | 'CARD' | Card Widget | Info card | Multiple metrics |

### Widget Type Visualizations

#### NUMBER Widget
```
┌─────────────────────────────────┐
│  Daily Revenue                  │
│                                 │
│      LKR 1,450,000             │  ← Large number
│                                 │
│  ↑ 12.5% vs Yesterday          │  ← Comparison
└─────────────────────────────────┘
```

#### CHART Widget
```
┌─────────────────────────────────┐
│  Sales Trend (This Month)       │
│                                 │
│  LKR                            │
│   2M ┤         ╭─╮              │
│      ┤       ╭─╯ │              │
│   1M ┤     ╭─╯   │              │
│      ┤   ╭─╯     ╰─╮            │
│      └─────────────────────     │
│     Week 1  2  3  4             │
└─────────────────────────────────┘
```

#### TABLE Widget
```
┌─────────────────────────────────┐
│  Top Products                   │
│                                 │
│ Rank  Product       Sales       │
│ ────  ──────────── ──────       │
│  1    Product A    125,000      │
│  2    Product B     98,500      │
│  3    Product C     87,200      │
│  4    Product D     76,800      │
│  5    Product E     65,400      │
└─────────────────────────────────┘
```

#### GAUGE Widget
```
┌─────────────────────────────────┐
│  Monthly Sales Target           │
│                                 │
│         ╭───────╮               │
│       ╱     78%  ╲              │
│      │   ▐█████   │             │
│       ╲           ╱             │
│         ╰───────╯               │
│                                 │
│  LKR 1,170,000 of 1,500,000    │
└─────────────────────────────────┘
```

#### TREND Widget
```
┌─────────────────────────────────┐
│  Customer Count    ↗  +8.2%    │
│                ───╱             │
│  1,245      ──╱                │
└─────────────────────────────────┘
```

#### LIST Widget
```
┌─────────────────────────────────┐
│  Top Sales Representatives      │
│                                 │
│  1. Kamal Perera    LKR 450,000│
│  2. Nimal Silva     LKR 420,000│
│  3. Sunil Fernando  LKR 380,000│
│  4. Priya Jayawardena 360,000  │
│  5. Saman Kumara    LKR 340,000│
└─────────────────────────────────┘
```

#### MAP Widget
```
┌─────────────────────────────────┐
│  Sales by Province              │
│                                 │
│        [Sri Lanka Map]          │
│                                 │
│   Western:  ● LKR 5.2M          │
│   Central:  ● LKR 2.1M          │
│   Southern: ● LKR 1.8M          │
│   Northern: ● LKR 1.2M          │
└─────────────────────────────────┘
```

#### CARD Widget
```
┌─────────────────────────────────┐
│  Inventory Summary              │
│                                 │
│  Total Items:     1,245         │
│  Low Stock:          23  ⚠     │
│  Out of Stock:        5  ✖     │
│  Stock Value:  LKR 8.5M         │
│                                 │
│  Last Updated: 2:30 PM          │
└─────────────────────────────────┘
```

### Widget Type Use Cases

| Widget Type | KPI Category | Example KPI | Reasoning |
|------------|--------------|-------------|-----------|
| NUMBER | SALES | Daily Revenue | Clear, high-impact metric |
| CHART | SALES | Monthly Sales Trend | Visualize patterns |
| TABLE | INVENTORY | Low Stock Items | Show multiple items |
| GAUGE | FINANCIAL | Profit Target | Show progress to goal |
| TREND | CUSTOMER | Customer Growth | Quick direction indicator |
| LIST | SALES | Top Products | Ranked performance |
| MAP | OPERATIONS | Branch Performance | Geographic distribution |
| CARD | OPERATIONS | Dashboard Summary | Multiple related metrics |

### Dashboard Layout Examples

#### Executive Dashboard (Sri Lankan Context)
```
┌──────────────────────────────────────────────────────────┐
│                   LankaERP Dashboard                     │
├─────────────────┬─────────────────┬──────────────────────┤
│ Daily Revenue   │ Orders Today    │ Avg. Transaction    │
│ [NUMBER]        │ [NUMBER]        │ [NUMBER]            │
│ LKR 1.45M ↑12% │ 324  ↑8%        │ LKR 4,475 ↓2%       │
├─────────────────┴─────────────────┴──────────────────────┤
│ Sales Trend This Month                                   │
│ [CHART - Line Graph]                                     │
│ Shows daily sales for current month                      │
├────────────────────────────┬─────────────────────────────┤
│ Top Products               │ Monthly Target              │
│ [TABLE]                    │ [GAUGE]                     │
│ Ranked list of products    │ 78% achievement            │
├────────────────────────────┴─────────────────────────────┤
│ Branch Performance                                       │
│ [MAP - Sri Lanka]                                        │
│ Geographic sales distribution                            │
└──────────────────────────────────────────────────────────┘
```

#### Sales Manager Dashboard
```
┌──────────────────────────────────────────────────────────┐
│                   Sales Performance                      │
├─────────────────┬─────────────────┬──────────────────────┤
│ Week Sales      │ Month Sales     │ Quarter Sales       │
│ [TREND]         │ [TREND]         │ [TREND]             │
│ ↗ +12.5%        │ ↗ +8.2%         │ ↗ +15.3%            │
├─────────────────┴─────────────────┴──────────────────────┤
│ Top Sales Representatives                                │
│ [LIST]                                                   │
│ Performance ranking with targets                         │
├──────────────────────────────────────────────────────────┤
│ Daily Sales Pattern                                      │
│ [CHART - Bar Graph]                                      │
│ Hourly sales breakdown                                   │
└──────────────────────────────────────────────────────────┘
```

### Chart Subtypes (for CHART widget)

| Subtype | Best For | Example KPI |
|---------|----------|-------------|
| Line Chart | Time-series trends | Daily sales over month |
| Bar Chart | Comparisons | Sales by product category |
| Pie Chart | Proportions | Revenue by payment method |
| Area Chart | Cumulative trends | Cumulative monthly revenue |
| Column Chart | Period comparisons | Monthly sales comparison |

### Sri Lankan Business Context

| Widget | Local Use Case | Example |
|--------|---------------|---------|
| NUMBER | Daily cash collection | LKR amounts, clear visibility |
| CHART | Seasonal sales (festive periods) | Vesak/Avurudu/Christmas peaks |
| TABLE | Tax compliance tracking | VAT/WHT payment status |
| GAUGE | EPF/ETF payment compliance | Percentage of on-time payments |
| TREND | Rupee exchange rate impact | Import cost trends |
| LIST | Best-selling items per region | Provincial preferences |
| MAP | Island-wide distribution | 9 provinces + districts |
| CARD | Multi-location summary | Branch snapshot |

### Expected Outcome
- Diverse visualization options
- Flexible dashboard design
- Type-safe widget references
- Support for various data presentations
- Sri Lankan business dashboard compatibility

### Verification Checklist
- [ ] widget_type.py file created
- [ ] WidgetType class defined
- [ ] NUMBER widget type added
- [ ] CHART widget type added
- [ ] TABLE widget type added
- [ ] GAUGE widget type added
- [ ] TREND widget type added
- [ ] LIST widget type added
- [ ] MAP widget type added
- [ ] CARD widget type added
- [ ] Class docstring comprehensive
- [ ] Visualization examples documented
- [ ] Imported in enums/__init__.py

---

## Task 06: Create KPIDefinition Model

### Overview
Create the core KPIDefinition model that stores KPI metadata, calculation logic references, and configuration. This model serves as the central registry for all KPIs in the system, enabling dynamic KPI creation, modification, and tenant-specific customization.

### Dependencies
- Task 01: Create dashboard App
- Task 02: Register dashboard App
- Task 03: Define KPICategory Enum
- Task 04: Define KPIPeriod Enum
- Task 05: Define WidgetType Enum
- Tenant model exists
- Django ORM configured

### Instructions

1. **Create kpi_definition.py model file**
   - Create file at `apps/dashboard/models/kpi_definition.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import dashboard enums (KPICategory, KPIPeriod, WidgetType)
   - Import tenant model

3. **Define KPIDefinition model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain KPI definition purpose

4. **Add is_active field**
   - BooleanField, default=True
   - Controls KPI availability
   - Inactive KPIs not calculated or displayed

5. **Add is_system_kpi field**
   - BooleanField, default=False
   - Marks system-defined vs. tenant-defined KPIs
   - System KPIs cannot be deleted

6. **Add sort_order field**
   - IntegerField, default=0
   - Controls display order in dashboards
   - Lower numbers appear first

7. **Add Meta class**
   - Set verbose_name = 'KPI Definition'
   - Set verbose_name_plural = 'KPI Definitions'
   - Add ordering by ['sort_order', 'name']
   - Add index on (tenant, is_active)
   - Add index on (tenant, category)

8. **Add __str__ method**
   - Return KPI name
   - Include category in parentheses
   - Format: "Daily Revenue (SALES)"

9. **Add get_calculator method placeholder**
   - Method to retrieve calculator instance
   - Returns calculator based on code
   - To be implemented in later tasks

10. **Update models/__init__.py**
    - Import KPIDefinition
    - Add to __all__ list

### KPIDefinition Model Structure

```
┌─────────────────────────────────────────────────┐
│           KPIDefinition Model                   │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • is_active (BooleanField)                     │
│  • is_system_kpi (BooleanField)                 │
│  • sort_order (IntegerField)                    │
│                                                 │
│ Fields to be added in subsequent tasks:         │
│  • name, code, description (Task 07)            │
│  • category (Task 08)                           │
│  • period, widget_type (Task 09)                │
│  • calculation fields (Task 10-16)              │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│  KPIDefinition     │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ 1:N
                                               ▼
                                      ┌────────────────────┐
                                      │  KPICalculation    │
                                      │  (Future Task)     │
                                      └────────────────────┘
                                               │
                                               │ N:N
                                               ▼
                                      ┌────────────────────┐
                                      │  DashboardWidget   │
                                      │  (Future Task)     │
                                      └────────────────────┘
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| is_active | BooleanField | Yes | True | Enable/disable KPI |
| is_system_kpi | BooleanField | Yes | False | System vs. custom KPI |
| sort_order | IntegerField | Yes | 0 | Display ordering |
| tenant | ForeignKey | Yes | - | Tenant association |
| created_at | DateTimeField | Yes | auto | Creation timestamp |
| updated_at | DateTimeField | Yes | auto | Modification timestamp |

### System KPI vs. Tenant KPI

```
System KPIs (is_system_kpi=True)
═══════════════════════════════════════════
- Predefined by application
- Available to all tenants
- Cannot be deleted by tenants
- Can be deactivated per tenant
- Examples: Daily Revenue, Stock Value, Profit Margin

Tenant Custom KPIs (is_system_kpi=False)
═══════════════════════════════════════════
- Created by tenant users
- Specific to tenant needs
- Can be modified/deleted by tenant
- Examples: Custom sales targets, specific product metrics
```

### KPI Lifecycle States

```
KPI Lifecycle
═══════════════════════════════════════════

Created (is_active=True)
    │
    ├─► Active & Calculating
    │       │
    │       ├─► Displayed on dashboards
    │       ├─► Regular calculations
    │       └─► Historical data retention
    │
    └─► Deactivated (is_active=False)
            │
            ├─► Not calculated
            ├─► Not displayed
            └─► Historical data preserved
```

### Sort Order Examples

| Sort Order | KPI Name | Category | Display Priority |
|-----------|----------|----------|------------------|
| 0 | Daily Revenue | SALES | Highest (top) |
| 10 | Orders Today | SALES | High |
| 20 | Average Transaction | SALES | Medium |
| 30 | Stock Value | INVENTORY | Medium |
| 40 | Low Stock Count | INVENTORY | Lower |
| 50 | Profit Margin | FINANCIAL | Lower |

### System KPI Examples (Sri Lankan Context)

| KPI Name | Category | is_system_kpi | Description |
|----------|----------|---------------|-------------|
| Daily Revenue | SALES | True | Total daily sales in LKR |
| Stock Value | INVENTORY | True | Total inventory value |
| Profit Margin | FINANCIAL | True | Gross profit percentage |
| VAT Collectible | COMPLIANCE | True | Total VAT to remit |
| Employee Count | HR | True | Active employee headcount |
| Customer Count | CUSTOMER | True | Total active customers |

### Tenant-Specific KPI Examples

| Tenant | KPI Name | Category | is_system_kpi | Purpose |
|--------|----------|----------|---------------|---------|
| Retail Store | Gift Wrap Revenue | SALES | False | Track gift wrap sales |
| Restaurant | Table Turnover | OPERATIONS | False | Average table turns |
| Import Business | Customs Clearance Time | OPERATIONS | False | Import efficiency |
| Multi-location | Branch Compliance Score | COMPLIANCE | False | Branch audit scores |

### KPI Activation/Deactivation Scenarios

| Scenario | Action | Reason |
|----------|--------|--------|
| Seasonal KPI | Activate in Dec, deactivate in Jan | Christmas season tracking |
| Pilot feature | Activate for testing | New metric evaluation |
| Deprecated metric | Deactivate permanently | No longer relevant |
| Performance optimization | Temporarily deactivate | Reduce calculation load |
| Tenant request | Deactivate specific KPI | Not needed by tenant |

### Expected Outcome
- Functional KPIDefinition model foundation
- Tenant-specific KPI management
- System vs. custom KPI differentiation
- Active/inactive state control
- Ordered KPI display support

### Verification Checklist
- [ ] kpi_definition.py file created
- [ ] KPIDefinition class defined
- [ ] is_active field added
- [ ] is_system_kpi field added
- [ ] sort_order field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] get_calculator method placeholder added
- [ ] Model imported in models/__init__.py
- [ ] TenantAwareMixin inherited
- [ ] TimestampMixin inherited

---

## Task 07: Add KPI Name Field

### Overview
Add name, code, and description fields to the KPIDefinition model. These fields provide human-readable identification, unique programmatic reference, and detailed documentation for each KPI.

### Dependencies
- Task 06: Create KPIDefinition Model

### Instructions

1. **Open kpi_definition.py model file**
   - Navigate to `apps/dashboard/models/kpi_definition.py`
   - Locate KPIDefinition model class

2. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Human-readable KPI name
   - Example: "Daily Revenue", "Stock Turnover Rate"

3. **Add code field**
   - CharField with max_length=100
   - Required field
   - Unique programmatic identifier
   - Uppercase, underscored format
   - Example: "DAILY_REVENUE", "STOCK_TURNOVER_RATE"

4. **Add description field**
   - TextField
   - Optional (blank=True, null=True)
   - Detailed KPI explanation
   - Calculation methodology
   - Business context and interpretation

5. **Update Meta class**
   - Add unique_together constraint: ['tenant', 'code']
   - Ensures unique KPI codes per tenant
   - Add index on (tenant, code)

6. **Update __str__ method**
   - Use name field in string representation
   - Format: "Daily Revenue (SALES)"

7. **Add clean method**
   - Validate code format (uppercase, underscored)
   - Convert code to uppercase if needed
   - Ensure code doesn't contain spaces or special chars

8. **Update model docstring**
   - Document name, code, description fields
   - Explain naming conventions
   - Provide examples

### KPI Name Field Structure

```
┌─────────────────────────────────────────────────┐
│         KPI Identification Fields               │
├─────────────────────────────────────────────────┤
│ name (CharField, 200)                           │
│  • Human-readable display name                  │
│  • Used in dashboards and reports               │
│  • Example: "Daily Revenue"                     │
│                                                 │
│ code (CharField, 100, unique per tenant)        │
│  • Programmatic identifier                      │
│  • Uppercase, underscored                       │
│  • Example: "DAILY_REVENUE"                     │
│                                                 │
│ description (TextField, optional)               │
│  • Detailed explanation                         │
│  • Calculation methodology                      │
│  • Business interpretation                      │
└─────────────────────────────────────────────────┘
```

### Field Naming Conventions

| Field | Format | Example | Usage |
|-------|--------|---------|-------|
| name | Title Case | "Daily Revenue" | Display in UI |
| code | UPPERCASE_UNDERSCORE | "DAILY_REVENUE" | Programmatic reference |
| description | Prose | "Total revenue collected..." | Help text, documentation |

### Code Field Examples

| KPI Name | Code | Format Rules |
|----------|------|--------------|
| Daily Revenue | DAILY_REVENUE | Uppercase, underscore separator |
| Stock Turnover Rate | STOCK_TURNOVER_RATE | Multiple words separated |
| Average Transaction Value | AVG_TRANSACTION_VALUE | Abbreviations allowed |
| VAT Collectible Today | VAT_COLLECTIBLE_TODAY | Acronyms uppercase |
| Customer Satisfaction Score | CUSTOMER_SATISFACTION | No special characters |

### Description Field Examples

#### Example 1: Daily Revenue
```
Name: Daily Revenue
Code: DAILY_REVENUE
Description:
Total revenue collected from all sales transactions during the current 
business day (00:00 to 23:59). Includes all payment methods (cash, card, 
credit). Excludes refunds and voids. Calculated in real-time.

Business Context:
Primary indicator of daily sales performance. Compare against daily targets 
and historical averages. Sri Lankan retail typically sees peaks during 
lunch hours (12-2 PM) and evening hours (5-8 PM).

Calculation:
SUM(sale_amount) WHERE sale_date = TODAY AND status = 'completed'
```

#### Example 2: Stock Turnover Rate
```
Name: Stock Turnover Rate
Code: STOCK_TURNOVER_RATE
Description:
Measures how many times inventory is sold and replaced during a period. 
Calculated as Cost of Goods Sold divided by Average Inventory Value. 
Higher turnover indicates efficient inventory management.

Business Context:
Critical for import-dependent Sri Lankan businesses. High turnover 
reduces holding costs and currency risk. Target: 8-12 times per year 
for FMCG, 4-6 times for durables.

Calculation:
COGS / ((Opening Stock + Closing Stock) / 2)
```

#### Example 3: VAT Collectible Today
```
Name: VAT Collectible Today
Code: VAT_COLLECTIBLE_TODAY
Description:
Total Value Added Tax collected from sales during the current day. 
Calculated at 18% of taxable sales (Sri Lankan standard VAT rate as of 
2026). Must be remitted to IRAD monthly.

Business Context:
Essential for tax compliance. Track daily to ensure proper collection 
and avoid shortfalls at month-end. Include in cash flow planning.

Calculation:
SUM(vat_amount) WHERE sale_date = TODAY AND vat_applicable = TRUE
Rate: 18% (standard), 0% (exempt items)
```

### KPI Naming Best Practices

#### Clear and Concise Names
| Good Name ✓ | Poor Name ✗ | Reason |
|-------------|-------------|--------|
| Daily Revenue | Today's Income | "Revenue" is standard business term |
| Stock Turnover Rate | How Fast Inventory Moves | Professional terminology |
| Average Transaction | Avg Sale | "Transaction" more precise |
| Customer Count | # of Customers | Avoid symbols in names |
| Profit Margin | How Much Profit % | Remove unnecessary words |

#### Sri Lankan Context Names
| KPI Name | Local Context | Code |
|----------|---------------|------|
| VAT Collectible | 18% standard rate | VAT_COLLECTIBLE |
| WHT Payable | Withholding tax tracking | WHT_PAYABLE |
| EPF Contribution | Employee Provident Fund | EPF_CONTRIBUTION |
| ETF Contribution | Employee Trust Fund | ETF_CONTRIBUTION |
| NBT Payable | Nation Building Tax | NBT_PAYABLE |

### Code Field Validation Rules

```
Valid Code Examples:
═══════════════════════════════════════════
✓ DAILY_REVENUE
✓ STOCK_TURNOVER_RATE
✓ AVG_TRANSACTION_VALUE
✓ VAT_COLLECTIBLE_TODAY
✓ CUSTOMER_COUNT_MONTH

Invalid Code Examples:
═══════════════════════════════════════════
✗ Daily Revenue          (not uppercase)
✗ daily-revenue          (hyphen not allowed)
✗ Daily_Revenue          (mixed case)
✗ DAILY REVENUE          (space not allowed)
✗ DAILY_REVENUE!         (special char not allowed)
```

### Unique Code Constraint

```
Tenant A Schema
═══════════════════════════════════
KPIDefinition Table:
- id: 1, code: 'DAILY_REVENUE', tenant_id: A
- id: 2, code: 'STOCK_VALUE', tenant_id: A
- id: 3, code: 'PROFIT_MARGIN', tenant_id: A

Tenant B Schema
═══════════════════════════════════
KPIDefinition Table:
- id: 1, code: 'DAILY_REVENUE', tenant_id: B  ✓ Same code, different tenant
- id: 2, code: 'CUSTOM_METRIC', tenant_id: B
- id: 3, code: 'DAILY_REVENUE', tenant_id: B  ✗ Duplicate within tenant

Unique constraint: (tenant, code)
```

### Description Template

```
Recommended Description Structure:
═══════════════════════════════════════════════════════════

1. Definition (What it measures)
   - Clear explanation of the metric
   - Units of measurement (LKR, %, count)

2. Calculation Methodology (How it's calculated)
   - Formula or algorithm
   - Data sources
   - Inclusion/exclusion criteria

3. Business Context (Why it matters)
   - Strategic importance
   - Target ranges or benchmarks
   - Sri Lankan business considerations

4. Interpretation Guide (How to read it)
   - What high values mean
   - What low values mean
   - Warning thresholds

5. Related KPIs (Optional)
   - Complementary metrics
   - Dependent metrics
```

### Multi-Language Considerations (Future)

| Language | Name | Description |
|----------|------|-------------|
| English | Daily Revenue | Total revenue collected today |
| Sinhala | දෛනික ආදායම | අද එකතු කළ මුළු ආදායම |
| Tamil | தினசரி வருவாய் | இன்று சேகரிக்கப்பட்ட மொத்த வருமானம் |

### Expected Outcome
- Clear KPI identification
- Unique programmatic codes
- Comprehensive documentation
- Validation for code format
- Foundation for KPI registration

### Verification Checklist
- [ ] name field added (CharField, 200)
- [ ] code field added (CharField, 100)
- [ ] description field added (TextField, optional)
- [ ] unique_together constraint on (tenant, code)
- [ ] Index on (tenant, code) added
- [ ] __str__ method updated to use name
- [ ] clean method added for code validation
- [ ] Model docstring updated
- [ ] Code format validation implemented
- [ ] All fields have appropriate help_text

---

## Task 08: Add KPI Category Field

### Overview
Add the category field to the KPIDefinition model to classify KPIs by business functional area. This categorization enables organized dashboard layouts, category-based filtering, and logical grouping of related metrics.

### Dependencies
- Task 03: Define KPICategory Enum
- Task 07: Add KPI Name Field

### Instructions

1. **Open kpi_definition.py model file**
   - Navigate to `apps/dashboard/models/kpi_definition.py`
   - Locate KPIDefinition model class

2. **Import KPICategory enum**
   - Add import statement for KPICategory
   - Verify enum is available from dashboard.enums

3. **Add category field**
   - CharField with max_length=20
   - Choices from KPICategory enum
   - Required field (no blank/null)
   - Default to KPICategory.SALES

4. **Add help_text for category**
   - Explain categorization purpose
   - List available categories
   - Mention dashboard organization impact

5. **Update Meta class**
   - Add index on (tenant, category, is_active)
   - Enables efficient category filtering
   - Supports dashboard queries

6. **Add get_category_display helper**
   - Property method returning category label
   - Uses Django's get_FOO_display() functionality
   - Returns human-readable category name

7. **Update __str__ method**
   - Include category in string representation
   - Format: "Daily Revenue (SALES)"
   - Use category value or label

8. **Add category validation**
   - Ensure category is valid enum value
   - Performed in clean() method
   - Raise ValidationError if invalid

9. **Update model docstring**
   - Document category field
   - Explain category-based organization
   - Provide examples per category

### Category Field Structure

```
┌─────────────────────────────────────────────────┐
│           KPI Category Field                    │
├─────────────────────────────────────────────────┤
│ category (CharField with choices)               │
│                                                 │
│ Properties:                                     │
│  • max_length: 20                               │
│  • choices: KPICategory enum                    │
│  • default: KPICategory.SALES                   │
│  • required: True                               │
│  • indexed: True (with tenant, is_active)       │
│                                                 │
│ Valid Values:                                   │
│  • SALES                                        │
│  • INVENTORY                                    │
│  • FINANCIAL                                    │
│  • HR                                           │
│  • CUSTOMER                                     │
│  • OPERATIONS                                   │
│  • COMPLIANCE                                   │
└─────────────────────────────────────────────────┘
```

### Category Field Implementation

```python
# Conceptual structure (NOT ACTUAL CODE)

class KPIDefinition(TenantAwareMixin, TimestampMixin, models.Model):
    # ... existing fields ...
    
    category = models.CharField(
        max_length=20,
        choices=KPICategory.choices,
        default=KPICategory.SALES,
        help_text="Functional area categorization for dashboard organization"
    )
    
    class Meta:
        indexes = [
            models.Index(fields=['tenant', 'category', 'is_active']),
            # ... other indexes ...
        ]
```

### Category-Based KPI Organization

```
Dashboard by Category
═══════════════════════════════════════════════════

SALES Category
├── Daily Revenue
├── Monthly Sales Growth
├── Average Transaction Value
├── Orders Count Today
└── Sales per Square Foot

INVENTORY Category
├── Total Stock Value
├── Low Stock Items Count
├── Stock Turnover Rate
├── Days of Inventory on Hand
└── Out of Stock Items

FINANCIAL Category
├── Gross Profit Margin
├── Net Profit Margin
├── Operating Cash Flow
├── Return on Investment
└── Accounts Receivable Days

COMPLIANCE Category
├── VAT Collectible
├── WHT Payable
├── EPF Contribution Due
├── ETF Contribution Due
└── Tax Filing Status
```

### Category Distribution Examples (Sri Lankan Retail)

| Category | # of KPIs | Importance | Example KPIs |
|----------|-----------|------------|--------------|
| SALES | 8-12 | High | Daily revenue, orders, avg transaction |
| INVENTORY | 6-10 | High | Stock value, turnover, low stock |
| FINANCIAL | 6-8 | High | Profit margins, cash flow |
| COMPLIANCE | 4-6 | High | VAT, EPF, ETF, WHT |
| CUSTOMER | 4-6 | Medium | Satisfaction, retention, lifetime value |
| OPERATIONS | 3-5 | Medium | Efficiency, service time |
| HR | 3-5 | Medium | Attendance, productivity, turnover |

### Category-Based Dashboard Layouts

#### Layout 1: Category Tabs
```
┌──────────────────────────────────────────────────────────┐
│ [ SALES ] [ INVENTORY ] [ FINANCIAL ] [ COMPLIANCE ]     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   SALES Category KPIs:                                   │
│                                                          │
│   ┌─────────────────┐  ┌─────────────────┐             │
│   │ Daily Revenue   │  │ Orders Today    │             │
│   │ LKR 1.45M ↑12% │  │ 324  ↑8%        │             │
│   └─────────────────┘  └─────────────────┘             │
│                                                          │
│   ┌──────────────────────────────────────────┐          │
│   │ Sales Trend (30 Days)                    │          │
│   │ [Chart Widget]                            │          │
│   └──────────────────────────────────────────┘          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Layout 2: Category Sections
```
┌──────────────────────────────────────────────────────────┐
│                   Executive Dashboard                     │
├──────────────────────────────────────────────────────────┤
│ SALES                                                    │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│ │ Revenue   │ │ Orders    │ │ Avg Value │              │
│ └───────────┘ └───────────┘ └───────────┘              │
├──────────────────────────────────────────────────────────┤
│ INVENTORY                                                │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│ │ Stock Val │ │ Low Stock │ │ Turnover  │              │
│ └───────────┘ └───────────┘ └───────────┘              │
├──────────────────────────────────────────────────────────┤
│ FINANCIAL                                                │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│ │ Profit %  │ │ Cash Flow │ │ ROI       │              │
│ └───────────┘ └───────────┘ └───────────┘              │
├──────────────────────────────────────────────────────────┤
│ COMPLIANCE                                               │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│ │ VAT Due   │ │ EPF Due   │ │ Tax Status│              │
│ └───────────┘ └───────────┘ └───────────┘              │
└──────────────────────────────────────────────────────────┘
```

### Category-Based Filtering

```
Query Examples:
═══════════════════════════════════════════════════

# Get all SALES KPIs for tenant
KPIDefinition.objects.filter(
    tenant=current_tenant,
    category=KPICategory.SALES,
    is_active=True
)

# Get all COMPLIANCE KPIs with specific period
KPIDefinition.objects.filter(
    tenant=current_tenant,
    category=KPICategory.COMPLIANCE,
    period=KPIPeriod.MONTH,
    is_active=True
)

# Count KPIs per category
KPIDefinition.objects.filter(
    tenant=current_tenant,
    is_active=True
).values('category').annotate(
    count=Count('id')
)
```

### Category Priority for Sri Lankan Businesses

| Business Type | Priority Categories | Rationale |
|--------------|---------------------|-----------|
| Retail Store | SALES, INVENTORY, COMPLIANCE | Daily cash, stock, VAT |
| Restaurant | SALES, OPERATIONS, HR | Revenue, service, staff |
| Import Business | FINANCIAL, COMPLIANCE, INVENTORY | Cash flow, customs, stock |
| Service Company | SALES, CUSTOMER, HR | Revenue, satisfaction, team |
| Manufacturing | OPERATIONS, INVENTORY, FINANCIAL | Efficiency, materials, margins |

### Category-Specific KPI Characteristics

| Category | Typical Period | Widget Type | Update Frequency |
|----------|---------------|-------------|------------------|
| SALES | TODAY, WEEK | NUMBER, CHART | Real-time / Hourly |
| INVENTORY | TODAY, MONTH | NUMBER, TABLE | Daily |
| FINANCIAL | MONTH, QUARTER | NUMBER, GAUGE | Daily / Weekly |
| COMPLIANCE | MONTH | NUMBER, CARD | Daily |
| CUSTOMER | WEEK, MONTH | TREND, GAUGE | Daily |
| OPERATIONS | TODAY, WEEK | NUMBER, CHART | Real-time / Hourly |
| HR | MONTH | NUMBER, TABLE | Daily / Weekly |

### Expected Outcome
- KPIs categorized by functional area
- Category-based dashboard organization
- Efficient category filtering
- Logical KPI grouping
- Sri Lankan business alignment

### Verification Checklist
- [ ] KPICategory enum imported
- [ ] category field added (CharField, choices)
- [ ] Default category set (SALES)
- [ ] help_text added explaining categorization
- [ ] Index added on (tenant, category, is_active)
- [ ] get_category_display helper implemented
- [ ] __str__ method includes category
- [ ] Category validation in clean() method
- [ ] Model docstring updated with category info
- [ ] Category examples documented

---

## Summary

This document established the foundation of the dashboard KPI system:

### Completed Infrastructure
- ✅ Dashboard Django application with organized structure
- ✅ Dashboard app registered as tenant-aware application
- ✅ KPICategory enum (SALES, INVENTORY, FINANCIAL, HR, CUSTOMER, OPERATIONS, COMPLIANCE)
- ✅ KPIPeriod enum (TODAY, WEEK, MONTH, QUARTER, YEAR, CUSTOM)
- ✅ WidgetType enum (NUMBER, CHART, TABLE, GAUGE, TREND, LIST, MAP, CARD)
- ✅ KPIDefinition model with tenant awareness
- ✅ KPI identification fields (name, code, description)
- ✅ KPI categorization (category field with enum)

### Key Achievements
1. **Organized Structure** - Clean Django app with specialized subdirectories
2. **Type Safety** - Enumerations for categories, periods, and widget types
3. **Tenant Flexibility** - Per-tenant KPI customization and isolation
4. **Sri Lankan Context** - Fiscal year alignment, compliance categories, local business needs
5. **Comprehensive Categorization** - Seven business functional areas
6. **Flexible Time Periods** - Multiple period options including fiscal year
7. **Diverse Visualizations** - Eight widget types for varied data presentation

### Sri Lankan Business Alignment
- Fiscal year periods (April-March)
- Compliance category for VAT, WHT, EPF, ETF tracking
- Business hour considerations
- Multi-language support readiness
- Local tax and regulatory context

### Next Steps
Proceed to [02_Tasks-09-16_KPIDefinition-BaseCalculator.md](02_Tasks-09-16_KPIDefinition-BaseCalculator.md) to implement KPI period/widget fields, calculation configuration, target settings, and the base KPI calculator framework.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~980
