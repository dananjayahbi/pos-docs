# SubPhase 13: Dashboard KPIs - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 13 of 14  
> **SubPhase Goal:** Real-time business performance metrics dashboard  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 13-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-12_Tax-Reporting](../SubPhase-12_Tax-Reporting/)
- **→ Next SubPhase:** [SubPhase-14_Analytics-Reports](../SubPhase-14_Analytics-Reports/)

---

## SubPhase Overview

This sub-phase implements a comprehensive KPI dashboard with real-time business performance metrics. Includes sales, inventory, financial, and HR KPIs. Features customizable widgets, role-based visibility, alert thresholds, and real-time updates.

### Key Outcomes
- Sales KPIs (daily, monthly, growth)
- Inventory KPIs (stock value, low stock, movement)
- Financial KPIs (profit margins, cash position)
- HR KPIs (attendance, leave, headcount)
- Real-time data updates
- Customizable dashboard layouts
- Role-based KPI visibility
- Alert thresholds and notifications
- Widget configuration

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Real-time:** Redis caching, WebSockets (optional)
- **Charts:** Recharts or Chart.js
- **Frontend:** Next.js 14+ with TypeScript
- **State:** React Query for data fetching

### Dependencies
- Phase-05: Sales, Inventory, Purchase data
- Phase-06 SubPhase-01-06: HR and Payroll data
- Phase-06 SubPhase-08-11: Financial data

---

## Task Execution Order

```
TASK GROUP A: KPI Framework (Tasks 01-16)
        │
        ▼
TASK GROUP B: Sales KPIs (Tasks 17-32)
        │
        ▼
TASK GROUP C: Inventory KPIs (Tasks 33-48)
        │
        ▼
TASK GROUP D: Financial KPIs (Tasks 49-64)
        │
        ▼
TASK GROUP E: HR KPIs & Alerts (Tasks 65-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-90)
```

---

## Task Index

### Group A: KPI Framework (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create dashboard App** | Initialize Django app for dashboard | None | 🔴 Not Created |
| 02 | **Register dashboard App** | Add to TENANT_APPS in settings | Task 01 | 🔴 Not Created |
| 03 | **Define KPICategory Enum** | Create: SALES, INVENTORY, FINANCIAL, HR | Task 02 | 🔴 Not Created |
| 04 | **Define KPIPeriod Enum** | Create: TODAY, WEEK, MONTH, QUARTER, YEAR | Task 03 | 🔴 Not Created |
| 05 | **Define WidgetType Enum** | Create: NUMBER, CHART, TABLE, GAUGE, TREND | Task 04 | 🔴 Not Created |
| 06 | **Create KPIDefinition Model** | Define available KPIs | Task 05 | 🔴 Not Created |
| 07 | **Add KPI Name Field** | Add name, code, description | Task 06 | 🔴 Not Created |
| 08 | **Add KPI Category Field** | Add category using KPICategory | Task 06 | 🔴 Not Created |
| 09 | **Add KPI Widget Type** | Add default_widget_type | Task 06 | 🔴 Not Created |
| 10 | **Add KPI Calculation Method** | Add calculation_method string | Task 06 | 🔴 Not Created |
| 11 | **Add KPI Format Field** | Add format (currency, number, percent) | Task 06 | 🔴 Not Created |
| 12 | **Add KPI Permissions** | Add required_permission | Task 06 | 🔴 Not Created |
| 13 | **Run KPIDefinition Migrations** | Generate and apply migrations | Task 12 | 🔴 Not Created |
| 14 | **Create KPI Fixtures** | Load default KPI definitions | Task 13 | 🔴 Not Created |
| 15 | **Create BaseKPICalculator** | Abstract base class for KPI calc | Task 14 | 🔴 Not Created |
| 16 | **Add Calculate Method** | Abstract calculate() method | Task 15 | 🔴 Not Created |

---

### Group B: Sales KPIs (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create SalesKPICalculator** | Sales KPI calculator class | Task 16 | 🔴 Not Created |
| 18 | **Add Today's Sales KPI** | Calculate today's total sales | Task 17 | 🔴 Not Created |
| 19 | **Add Weekly Sales KPI** | Calculate this week's sales | Task 18 | 🔴 Not Created |
| 20 | **Add Monthly Sales KPI** | Calculate this month's sales | Task 19 | 🔴 Not Created |
| 21 | **Add Sales Growth KPI** | Calculate growth percentage | Task 20 | 🔴 Not Created |
| 22 | **Add Average Order Value KPI** | Calculate AOV | Task 21 | 🔴 Not Created |
| 23 | **Add Orders Count KPI** | Calculate order count | Task 22 | 🔴 Not Created |
| 24 | **Add Top Selling Products KPI** | List top 5 products | Task 23 | 🔴 Not Created |
| 25 | **Add Top Customers KPI** | List top 5 customers | Task 24 | 🔴 Not Created |
| 26 | **Add Sales by Category KPI** | Breakdown by category | Task 25 | 🔴 Not Created |
| 27 | **Add Sales by Channel KPI** | POS vs Webstore split | Task 26 | 🔴 Not Created |
| 28 | **Add Sales Trend Data** | Daily sales for chart | Task 27 | 🔴 Not Created |
| 29 | **Add Comparison Data** | Compare to prior period | Task 28 | 🔴 Not Created |
| 30 | **Create Sales KPI Cache** | Redis cache for sales KPIs | Task 29 | 🔴 Not Created |
| 31 | **Add Cache Invalidation** | Invalidate on new sale | Task 30 | 🔴 Not Created |
| 32 | **Create Sales KPI Endpoint** | GET /dashboard/sales/ | Task 31 | 🔴 Not Created |

---

### Group C: Inventory KPIs (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create InventoryKPICalculator** | Inventory KPI calculator | Task 32 | 🔴 Not Created |
| 34 | **Add Stock Value KPI** | Calculate total inventory value | Task 33 | 🔴 Not Created |
| 35 | **Add Low Stock Items KPI** | Count items below threshold | Task 34 | 🔴 Not Created |
| 36 | **Add Out of Stock KPI** | Count items with zero stock | Task 35 | 🔴 Not Created |
| 37 | **Add Overstock Items KPI** | Count overstocked items | Task 36 | 🔴 Not Created |
| 38 | **Add Inventory Turnover KPI** | Calculate turnover ratio | Task 37 | 🔴 Not Created |
| 39 | **Add Days of Inventory KPI** | Average days in stock | Task 38 | 🔴 Not Created |
| 40 | **Add Fast Moving Products KPI** | Top 5 by velocity | Task 39 | 🔴 Not Created |
| 41 | **Add Slow Moving Products KPI** | Bottom 5 by velocity | Task 40 | 🔴 Not Created |
| 42 | **Add Dead Stock KPI** | Items with no sales in 90 days | Task 41 | 🔴 Not Created |
| 43 | **Add Stock by Category KPI** | Value by category | Task 42 | 🔴 Not Created |
| 44 | **Add Stock by Warehouse KPI** | Value by location | Task 43 | 🔴 Not Created |
| 45 | **Add Reorder Alert List** | Items needing reorder | Task 44 | 🔴 Not Created |
| 46 | **Create Inventory KPI Cache** | Redis cache for inventory | Task 45 | 🔴 Not Created |
| 47 | **Add Inventory Cache Invalidation** | Invalidate on stock change | Task 46 | 🔴 Not Created |
| 48 | **Create Inventory KPI Endpoint** | GET /dashboard/inventory/ | Task 47 | 🔴 Not Created |

---

### Group D: Financial KPIs (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create FinancialKPICalculator** | Financial KPI calculator | Task 48 | 🔴 Not Created |
| 50 | **Add Revenue KPI** | Current period revenue | Task 49 | 🔴 Not Created |
| 51 | **Add Expenses KPI** | Current period expenses | Task 50 | 🔴 Not Created |
| 52 | **Add Net Income KPI** | Revenue - Expenses | Task 51 | 🔴 Not Created |
| 53 | **Add Gross Profit Margin KPI** | (Revenue - COGS) / Revenue | Task 52 | 🔴 Not Created |
| 54 | **Add Net Profit Margin KPI** | Net Income / Revenue | Task 53 | 🔴 Not Created |
| 55 | **Add Cash Position KPI** | Current cash balance | Task 54 | 🔴 Not Created |
| 56 | **Add Accounts Receivable KPI** | Total AR outstanding | Task 55 | 🔴 Not Created |
| 57 | **Add AR Aging Summary KPI** | AR by aging buckets | Task 56 | 🔴 Not Created |
| 58 | **Add Accounts Payable KPI** | Total AP outstanding | Task 57 | 🔴 Not Created |
| 59 | **Add AP Aging Summary KPI** | AP by aging buckets | Task 58 | 🔴 Not Created |
| 60 | **Add Current Ratio KPI** | Current Assets / Liabilities | Task 59 | 🔴 Not Created |
| 61 | **Add Quick Ratio KPI** | (Current - Inventory) / Liabilities | Task 60 | 🔴 Not Created |
| 62 | **Add Revenue Trend Data** | Monthly revenue chart | Task 61 | 🔴 Not Created |
| 63 | **Create Financial KPI Cache** | Redis cache for financial | Task 62 | 🔴 Not Created |
| 64 | **Create Financial KPI Endpoint** | GET /dashboard/financial/ | Task 63 | 🔴 Not Created |

---

### Group E: HR KPIs & Alerts (Tasks 65-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create HRKPICalculator** | HR KPI calculator | Task 64 | 🔴 Not Created |
| 66 | **Add Employee Count KPI** | Total active employees | Task 65 | 🔴 Not Created |
| 67 | **Add New Hires KPI** | Hires this month | Task 66 | 🔴 Not Created |
| 68 | **Add Turnover Rate KPI** | Terminations / Average HC | Task 67 | 🔴 Not Created |
| 69 | **Add Today's Attendance KPI** | Present/Total today | Task 68 | 🔴 Not Created |
| 70 | **Add Attendance Rate KPI** | Monthly attendance % | Task 69 | 🔴 Not Created |
| 71 | **Add Leave Balance Summary KPI** | By leave type | Task 70 | 🔴 Not Created |
| 72 | **Add Pending Leave Requests KPI** | Count pending approvals | Task 71 | 🔴 Not Created |
| 73 | **Add Payroll Cost KPI** | Current month payroll | Task 72 | 🔴 Not Created |
| 74 | **Create HR KPI Endpoint** | GET /dashboard/hr/ | Task 73 | 🔴 Not Created |
| 75 | **Create KPIAlert Model** | Alert configuration | Task 74 | 🔴 Not Created |
| 76 | **Add Alert Threshold Fields** | Add warning_threshold, critical_threshold | Task 75 | 🔴 Not Created |
| 77 | **Add Alert Notification Config** | Add notify_email, notify_dashboard | Task 75 | 🔴 Not Created |
| 78 | **Run KPIAlert Migrations** | Generate and apply migrations | Task 77 | 🔴 Not Created |
| 79 | **Create Alert Check Service** | Service to check thresholds | Task 78 | 🔴 Not Created |
| 80 | **Create Alert Celery Task** | Periodic alert checking | Task 79 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create DashboardLayout Model** | User dashboard customization | Task 80 | 🔴 Not Created |
| 82 | **Add Layout Widgets JSON** | Widget positions and config | Task 81 | 🔴 Not Created |
| 83 | **Run Layout Migrations** | Generate and apply migrations | Task 82 | 🔴 Not Created |
| 84 | **Create Dashboard Serializers** | DRF serializers for KPIs | Task 83 | 🔴 Not Created |
| 85 | **Create DashboardViewSet** | Combined ViewSet for all KPIs | Task 84 | 🔴 Not Created |
| 86 | **Add All KPIs Endpoint** | GET /dashboard/all/ | Task 85 | 🔴 Not Created |
| 87 | **Add Save Layout Endpoint** | PUT /dashboard/layout/ | Task 86 | 🔴 Not Created |
| 88 | **Add Dashboard URL Routes** | Register routes in urls.py | Task 87 | 🔴 Not Created |
| 89 | **Write KPI Calculator Tests** | Unit tests for all calculators | Task 88 | 🔴 Not Created |
| 90 | **Create Dashboard API Documentation** | Document all endpoints | Task 89 | 🔴 Not Created |

---

## Expected File Structure

```
apps/dashboard/
├── __init__.py
├── admin.py                    # KPI admin configuration
├── apps.py                     # App config
├── models/
│   ├── __init__.py
│   ├── kpi_definition.py       # KPIDefinition model
│   ├── kpi_alert.py            # KPIAlert model
│   └── dashboard_layout.py     # DashboardLayout model
├── serializers/
│   ├── __init__.py
│   ├── kpi.py                  # KPI serializers
│   └── layout.py               # Layout serializers
├── views/
│   ├── __init__.py
│   └── dashboard.py            # Dashboard ViewSet
├── calculators/
│   ├── __init__.py
│   ├── base.py                 # BaseKPICalculator
│   ├── sales.py                # SalesKPICalculator
│   ├── inventory.py            # InventoryKPICalculator
│   ├── financial.py            # FinancialKPICalculator
│   └── hr.py                   # HRKPICalculator
├── services/
│   ├── __init__.py
│   ├── cache_service.py        # KPI caching
│   └── alert_service.py        # Alert checking
├── fixtures/
│   └── kpi_definitions.json    # Default KPIs
├── tasks.py                    # Celery tasks (alerts)
├── urls.py                     # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_sales_kpi.py
│   ├── test_inventory_kpi.py
│   ├── test_financial_kpi.py
│   └── test_hr_kpi.py
└── migrations/

frontend/src/app/(dashboard)/
├── page.tsx                    # Main dashboard
├── components/
│   ├── DashboardGrid.tsx       # Grid layout
│   ├── widgets/
│   │   ├── NumberWidget.tsx    # Single number display
│   │   ├── ChartWidget.tsx     # Chart display
│   │   ├── TableWidget.tsx     # Table display
│   │   ├── GaugeWidget.tsx     # Gauge/meter display
│   │   └── TrendWidget.tsx     # Trend with sparkline
│   ├── SalesKPIs.tsx           # Sales KPI section
│   ├── InventoryKPIs.tsx       # Inventory KPI section
│   ├── FinancialKPIs.tsx       # Financial KPI section
│   ├── HRKPIs.tsx              # HR KPI section
│   └── AlertBanner.tsx         # Alert notifications
└── hooks/
    ├── useDashboard.ts
    ├── useKPIs.ts
    └── useLayout.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: KPI Framework | 16 | 0 | 0% |
| Group B: Sales KPIs | 16 | 0 | 0% |
| Group C: Inventory KPIs | 16 | 0 | 0% |
| Group D: Financial KPIs | 16 | 0 | 0% |
| Group E: HR KPIs & Alerts | 16 | 0 | 0% |
| Group F: API, Testing & Documentation | 10 | 0 | 0% |
| **TOTAL** | **90** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **KPI Calculation Pattern:**
   - Each calculator fetches data for the period
   - Calculations are cached in Redis
   - Cache TTL varies by KPI (realtime vs daily)
   - Background refresh for heavy calculations

2. **Caching Strategy:**
   ```
   Real-time KPIs (15 min cache):
   - Today's Sales
   - Today's Attendance
   - Cash Position
   
   Hourly KPIs (1 hour cache):
   - Stock Value
   - Low Stock Count
   - AR/AP Totals
   
   Daily KPIs (24 hour cache):
   - Growth Percentages
   - Turnover Ratios
   - Aging Summaries
   ```

3. **Cache Invalidation:**
   - Sales KPIs: On new sale/invoice
   - Inventory KPIs: On stock change
   - Financial KPIs: On journal posting
   - HR KPIs: On attendance/leave change

4. **Widget Types:**
   - NUMBER: Single value with trend arrow
   - CHART: Bar/line chart for trends
   - TABLE: Top items list
   - GAUGE: Progress toward target
   - TREND: Sparkline with change %

5. **Role-Based Visibility:**
   - Admin: All KPIs
   - Manager: All except HR sensitive
   - Cashier: Sales KPIs only
   - Accountant: Financial + Sales

### KPI Formulas

**Sales:**
```
Sales Growth % = ((Current - Previous) / Previous) * 100
Average Order Value = Total Sales / Order Count
```

**Inventory:**
```
Inventory Turnover = COGS / Average Inventory
Days of Inventory = (Average Inventory / COGS) * 365
```

**Financial:**
```
Gross Profit Margin = (Revenue - COGS) / Revenue * 100
Net Profit Margin = Net Income / Revenue * 100
Current Ratio = Current Assets / Current Liabilities
Quick Ratio = (Current Assets - Inventory) / Current Liabilities
```

**HR:**
```
Attendance Rate = Present Days / Working Days * 100
Turnover Rate = Terminations / Average Headcount * 100
```

### Sri Lanka Specific

1. **Currency Format:**
   - LKR 1,234,567.89
   - Use ▲/▼ for trends

2. **Time Zone:**
   - Asia/Colombo (UTC+5:30)
   - "Today" based on local time

3. **Business Hours:**
   - Consider business hours for real-time KPIs
   - Weekend handling (Saturday half-day)

### Widget Examples

**Number Widget:**
```
┌─────────────────────────┐
│ Today's Sales           │
│ LKR 125,450.00     ▲15% │
│ vs yesterday            │
└─────────────────────────┘
```

**Chart Widget:**
```
┌─────────────────────────┐
│ Weekly Sales Trend      │
│ ╭──╮                    │
│ │  ╰───╮    ╭──╮       │
│ │      ╰────╯  ╰─      │
│ Mon Tue Wed Thu Fri Sat │
└─────────────────────────┘
```

**Table Widget:**
```
┌─────────────────────────┐
│ Top Selling Products    │
│ 1. Rice 5kg     ▌▌▌▌▌  │
│ 2. Sugar 1kg    ▌▌▌▌   │
│ 3. Milk 1L      ▌▌▌    │
│ 4. Bread        ▌▌     │
│ 5. Eggs dozen   ▌      │
└─────────────────────────┘
```

### Alert Thresholds

| KPI | Warning | Critical |
|-----|---------|----------|
| Low Stock Count | > 10 items | > 25 items |
| Out of Stock | > 0 items | > 5 items |
| AR Overdue | > LKR 100K | > LKR 500K |
| Cash Position | < LKR 50K | < LKR 10K |
| Attendance Rate | < 90% | < 80% |

---

## Completion Checklist

- [ ] KPIDefinition model and fixtures
- [ ] BaseKPICalculator abstract class
- [ ] SalesKPICalculator with all sales KPIs
- [ ] InventoryKPICalculator with all inventory KPIs
- [ ] FinancialKPICalculator with all financial KPIs
- [ ] HRKPICalculator with all HR KPIs
- [ ] Redis caching for all KPIs
- [ ] Cache invalidation on data changes
- [ ] KPIAlert model and threshold checking
- [ ] Alert notification (email + dashboard)
- [ ] DashboardLayout for customization
- [ ] DRF serializers and ViewSet
- [ ] API endpoints for all KPI categories
- [ ] Unit tests for all calculators
- [ ] API documentation
