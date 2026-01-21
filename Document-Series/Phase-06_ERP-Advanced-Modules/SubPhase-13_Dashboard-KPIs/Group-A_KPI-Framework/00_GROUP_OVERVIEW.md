# Group A: KPI Framework

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create dashboard app with KPI definitions, enums, and base calculator class

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Sales-KPIs](../Group-B_Sales-KPIs/)

---

## Group Overview

This group establishes the foundational framework for the KPI dashboard system. Creates the dashboard Django app with enumerations for KPI categories, periods, and widget types. Implements the KPIDefinition model to define available KPIs with their calculation methods, formats, and permission requirements. Creates the BaseKPICalculator abstract class that all specific calculators will extend.

### Key Outcomes

- Dashboard Django app created
- App registered in TENANT_APPS
- KPICategory enum (SALES, INVENTORY, FINANCIAL, HR)
- KPIPeriod enum (TODAY, WEEK, MONTH, QUARTER, YEAR)
- WidgetType enum (NUMBER, CHART, TABLE, GAUGE, TREND)
- KPIDefinition model
- KPI name, code, and description fields
- KPI category field
- Default widget type field
- Calculation method reference field
- Format field (currency, number, percent)
- Required permission field
- KPI fixtures with default definitions
- BaseKPICalculator abstract class
- Abstract calculate() method

### Technology Context

- **Architecture:** Strategy pattern for calculators
- **Caching:** Redis for KPI value caching
- **Permissions:** Role-based KPI visibility
- **Configuration:** Model-driven KPI definitions

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Dashboard-App-Enums.md` | Create dashboard app and define enums | 01-08 |
| 02 | `02_Tasks-09-16_KPIDefinition-BaseCalculator.md` | Create KPIDefinition model and BaseKPICalculator | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create dashboard App | Low | None |
| 02 | Register dashboard App | Low | Task 01 |
| 03 | Define KPICategory Enum | Low | Task 02 |
| 04 | Define KPIPeriod Enum | Low | Task 03 |
| 05 | Define WidgetType Enum | Low | Task 04 |
| 06 | Create KPIDefinition Model | Medium | Task 05 |
| 07 | Add KPI Name Field | Low | Task 06 |
| 08 | Add KPI Category Field | Low | Task 06 |
| 09 | Add KPI Widget Type | Low | Task 06 |
| 10 | Add KPI Calculation Method | Low | Task 06 |
| 11 | Add KPI Format Field | Low | Task 06 |
| 12 | Add KPI Permissions | Low | Task 06 |
| 13 | Run KPIDefinition Migrations | Low | Task 12 |
| 14 | Create KPI Fixtures | Medium | Task 13 |
| 15 | Create BaseKPICalculator | High | Task 14 |
| 16 | Add Calculate Method | Medium | Task 15 |

---

## Execution Order

```
Task 01: Create dashboard App
    │
    ▼
Task 02: Register in TENANT_APPS
    │
    ▼
Tasks 03-05: Define Enums
(KPICategory, KPIPeriod, WidgetType)
    │
    ▼
Task 06: Create KPIDefinition Model
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Tasks 07-11: KPI Fields              Task 12: Permissions
(name, category, widget, calc, format)
    │                                             │
    └─────────────────────┬───────────────────────┘
                          ▼
                     Task 13: Run Migrations
                          │
                          ▼
                     Task 14: Create KPI Fixtures
                          │
                          ▼
                     Task 15: Create BaseKPICalculator
                          │
                          ▼
                     Task 16: Add Calculate Method
```

---

## Expected Deliverables

```
apps/dashboard/
├── __init__.py
├── admin.py
├── apps.py
├── models/
│   ├── __init__.py
│   └── kpi_definition.py     # KPIDefinition model
├── calculators/
│   ├── __init__.py
│   └── base.py               # BaseKPICalculator
├── fixtures/
│   └── kpi_definitions.json  # Default KPI definitions
└── migrations/
    └── 0001_initial.py
```

---

## Notes for AI Agents

### KPICategory Enum Values
- SALES: Revenue and order metrics
- INVENTORY: Stock and movement metrics
- FINANCIAL: Profit and ratio metrics
- HR: Employee and attendance metrics

### KPIPeriod Enum Values
- TODAY: Current day
- WEEK: Current week (Mon-Sun)
- MONTH: Current calendar month
- QUARTER: Current fiscal quarter
- YEAR: Current fiscal year

### WidgetType Enum Values
- NUMBER: Single value with trend indicator
- CHART: Bar/line chart for trends
- TABLE: List of items (top products, etc.)
- GAUGE: Progress toward target
- TREND: Sparkline with change percentage

### KPIDefinition Model Fields
- name: Human-readable name
- code: Unique identifier (e.g., "SALES_TODAY")
- description: Detailed description
- category: KPICategory enum
- default_widget_type: WidgetType enum
- calculation_method: Method name reference
- format: "currency", "number", "percent"
- required_permission: Permission codename

### BaseKPICalculator Interface
```
BaseKPICalculator (abstract):
├── kpi_definition: KPIDefinition
├── period: KPIPeriod
├── calculate() → dict (abstract)
├── get_period_dates() → tuple[date, date]
├── get_comparison_data() → dict
├── format_value(value) → str
└── get_trend_indicator(current, previous) → str
```

### Caching Strategy by Period
| Period | Cache TTL |
|--------|-----------|
| TODAY | 15 minutes |
| WEEK | 1 hour |
| MONTH | 6 hours |
| QUARTER | 24 hours |
| YEAR | 24 hours |
