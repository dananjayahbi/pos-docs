# Group B: Sales KPIs

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement sales KPI calculator with daily, weekly, monthly metrics and real-time caching

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_KPI-Framework](../Group-A_KPI-Framework/)
- **→ Next Group:** [Group-C_Inventory-KPIs](../Group-C_Inventory-KPIs/)

---

## Group Overview

This group implements the SalesKPICalculator with all sales-related performance metrics. Calculates today's sales, weekly and monthly totals, growth percentages, average order value, and order counts. Includes top selling products, top customers, sales by category, and sales by channel (POS vs Webstore). Implements trend data for charts, comparison with prior periods, Redis caching with automatic invalidation on new sales, and dedicated API endpoint.

### Key Outcomes

- SalesKPICalculator extending BaseKPICalculator
- Today's sales KPI
- Weekly sales KPI
- Monthly sales KPI
- Sales growth percentage KPI
- Average order value (AOV) KPI
- Orders count KPI
- Top 5 selling products KPI
- Top 5 customers KPI
- Sales by category breakdown
- Sales by channel (POS vs Webstore)
- Sales trend data for charts
- Prior period comparison data
- Redis cache for sales KPIs
- Cache invalidation on new sale
- Sales KPI API endpoint

### Technology Context

- **Data Source:** Sales invoices and orders
- **Caching:** Redis with 15-minute TTL for real-time
- **Invalidation:** Signal-based on sale creation
- **Charts:** Daily data points for trend visualization

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-24_Sales-Metrics.md` | Create SalesKPICalculator with core sales metrics | 17-24 |
| 02 | `02_Tasks-25-32_Sales-Trends-Caching.md` | Add breakdowns, trends, caching, and API endpoint | 25-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create SalesKPICalculator | Medium | Task 16 |
| 18 | Add Today's Sales KPI | Medium | Task 17 |
| 19 | Add Weekly Sales KPI | Low | Task 18 |
| 20 | Add Monthly Sales KPI | Low | Task 19 |
| 21 | Add Sales Growth KPI | Medium | Task 20 |
| 22 | Add Average Order Value KPI | Low | Task 21 |
| 23 | Add Orders Count KPI | Low | Task 22 |
| 24 | Add Top Selling Products KPI | Medium | Task 23 |
| 25 | Add Top Customers KPI | Medium | Task 24 |
| 26 | Add Sales by Category KPI | Medium | Task 25 |
| 27 | Add Sales by Channel KPI | Medium | Task 26 |
| 28 | Add Sales Trend Data | Medium | Task 27 |
| 29 | Add Comparison Data | Medium | Task 28 |
| 30 | Create Sales KPI Cache | Medium | Task 29 |
| 31 | Add Cache Invalidation | Medium | Task 30 |
| 32 | Create Sales KPI Endpoint | Low | Task 31 |

---

## Execution Order

```
Task 17: Create SalesKPICalculator
    │
    ▼
Task 18: Today's Sales KPI
    │
    ▼
Task 19: Weekly Sales KPI
    │
    ▼
Task 20: Monthly Sales KPI
    │
    ▼
Task 21: Sales Growth KPI
    │
    ▼
Task 22: Average Order Value KPI
    │
    ▼
Task 23: Orders Count KPI
    │
    ▼
Task 24: Top Selling Products KPI
    │
    ▼
Task 25: Top Customers KPI
    │
    ▼
Task 26: Sales by Category KPI
    │
    ▼
Task 27: Sales by Channel KPI
    │
    ▼
Task 28: Sales Trend Data
    │
    ▼
Task 29: Comparison Data
    │
    ▼
Task 30: Create Sales KPI Cache
    │
    ▼
Task 31: Cache Invalidation
    │
    ▼
Task 32: Create Sales KPI Endpoint
```

---

## Expected Deliverables

```
apps/dashboard/
├── calculators/
│   ├── __init__.py
│   ├── base.py
│   └── sales.py               # SalesKPICalculator
├── services/
│   ├── __init__.py
│   └── cache_service.py       # Redis caching
├── views/
│   ├── __init__.py
│   └── dashboard.py           # Add sales endpoint
└── signals.py                 # Cache invalidation signals
```

---

## Notes for AI Agents

### Sales KPI Response Structure
```json
{
  "category": "SALES",
  "period": "TODAY",
  "kpis": {
    "todays_sales": {
      "value": 125450.00,
      "formatted": "LKR 125,450.00",
      "trend": "up",
      "change_percent": 15.5,
      "comparison_value": 108600.00
    },
    "orders_count": {
      "value": 45,
      "trend": "up",
      "change_percent": 8.3
    },
    "average_order_value": {
      "value": 2787.78,
      "formatted": "LKR 2,787.78",
      "trend": "up"
    }
  },
  "top_products": [...],
  "top_customers": [...],
  "sales_by_category": {...},
  "sales_by_channel": {...},
  "trend_data": [...]
}
```

### KPI Formulas

**Sales Growth:**
```
Growth % = ((Current Period - Previous Period) / Previous Period) * 100
```

**Average Order Value:**
```
AOV = Total Sales / Number of Orders
```

### Sales by Channel Data
```json
{
  "pos": {
    "amount": 80000.00,
    "percentage": 64,
    "orders": 32
  },
  "webstore": {
    "amount": 45450.00,
    "percentage": 36,
    "orders": 13
  }
}
```

### Trend Data Structure (for charts)
```json
{
  "trend_data": [
    {"date": "2026-01-25", "sales": 95000, "orders": 38},
    {"date": "2026-01-26", "sales": 110000, "orders": 42},
    {"date": "2026-01-27", "sales": 125450, "orders": 45}
  ]
}
```

### Cache Keys
- `kpi:sales:today:{tenant_id}` - 15 min TTL
- `kpi:sales:week:{tenant_id}` - 1 hour TTL
- `kpi:sales:month:{tenant_id}` - 6 hour TTL
- `kpi:sales:top_products:{tenant_id}` - 1 hour TTL

### Cache Invalidation Trigger
Signal on SalesInvoice.save():
- Delete `kpi:sales:today:*`
- Delete `kpi:sales:week:*`
- Delete `kpi:sales:month:*`
