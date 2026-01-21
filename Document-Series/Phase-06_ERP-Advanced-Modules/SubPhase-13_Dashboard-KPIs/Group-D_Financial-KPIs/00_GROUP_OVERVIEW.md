# Group D: Financial KPIs

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Implement financial KPI calculator with profit margins, cash position, and liquidity ratios

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Inventory-KPIs](../Group-C_Inventory-KPIs/)
- **→ Next Group:** [Group-E_HR-KPIs-Alerts](../Group-E_HR-KPIs-Alerts/)

---

## Group Overview

This group implements the FinancialKPICalculator with all accounting and financial performance metrics. Calculates current period revenue, expenses, and net income. Includes gross profit margin and net profit margin percentages. Tracks cash position, accounts receivable and payable with aging summaries. Calculates liquidity ratios (current ratio, quick ratio). Provides revenue trend data for charts and implements Redis caching.

### Key Outcomes

- FinancialKPICalculator extending BaseKPICalculator
- Revenue KPI (current period)
- Expenses KPI (current period)
- Net income KPI
- Gross profit margin percentage KPI
- Net profit margin percentage KPI
- Cash position KPI (current balance)
- Accounts receivable total KPI
- AR aging summary (30/60/90+ days)
- Accounts payable total KPI
- AP aging summary (30/60/90+ days)
- Current ratio KPI
- Quick ratio KPI
- Monthly revenue trend data
- Redis cache for financial KPIs
- Financial KPI API endpoint

### Technology Context

- **Data Source:** Chart of Accounts, Journal Entries
- **Calculations:** From P&L and Balance Sheet data
- **Aging:** Based on invoice due dates
- **Caching:** 6-hour TTL for financial metrics

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-57_Profit-Margins-Cash.md` | Create FinancialKPICalculator with profitability and cash KPIs | 49-57 |
| 02 | `02_Tasks-58-64_Ratios-Trends-Caching.md` | Add aging summaries, ratios, trends, and caching | 58-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create FinancialKPICalculator | Medium | Task 48 |
| 50 | Add Revenue KPI | Medium | Task 49 |
| 51 | Add Expenses KPI | Medium | Task 50 |
| 52 | Add Net Income KPI | Low | Task 51 |
| 53 | Add Gross Profit Margin KPI | Medium | Task 52 |
| 54 | Add Net Profit Margin KPI | Low | Task 53 |
| 55 | Add Cash Position KPI | Medium | Task 54 |
| 56 | Add Accounts Receivable KPI | Medium | Task 55 |
| 57 | Add AR Aging Summary KPI | High | Task 56 |
| 58 | Add Accounts Payable KPI | Medium | Task 57 |
| 59 | Add AP Aging Summary KPI | High | Task 58 |
| 60 | Add Current Ratio KPI | Medium | Task 59 |
| 61 | Add Quick Ratio KPI | Low | Task 60 |
| 62 | Add Revenue Trend Data | Medium | Task 61 |
| 63 | Create Financial KPI Cache | Medium | Task 62 |
| 64 | Create Financial KPI Endpoint | Low | Task 63 |

---

## Execution Order

```
Task 49: Create FinancialKPICalculator
    │
    ▼
Task 50: Revenue KPI
    │
    ▼
Task 51: Expenses KPI
    │
    ▼
Task 52: Net Income KPI
    │
    ▼
Task 53: Gross Profit Margin KPI
    │
    ▼
Task 54: Net Profit Margin KPI
    │
    ▼
Task 55: Cash Position KPI
    │
    ▼
Task 56: Accounts Receivable KPI
    │
    ▼
Task 57: AR Aging Summary KPI
    │
    ▼
Task 58: Accounts Payable KPI
    │
    ▼
Task 59: AP Aging Summary KPI
    │
    ▼
Task 60: Current Ratio KPI
    │
    ▼
Task 61: Quick Ratio KPI
    │
    ▼
Task 62: Revenue Trend Data
    │
    ▼
Task 63: Create Financial KPI Cache
    │
    ▼
Task 64: Create Financial KPI Endpoint
```

---

## Expected Deliverables

```
apps/dashboard/
├── calculators/
│   ├── __init__.py
│   ├── base.py
│   ├── sales.py
│   ├── inventory.py
│   └── financial.py           # FinancialKPICalculator
├── services/
│   └── cache_service.py       # Add financial cache
├── views/
│   └── dashboard.py           # Add financial endpoint
└── signals.py                 # Add journal entry signals
```

---

## Notes for AI Agents

### Financial KPI Response Structure
```json
{
  "category": "FINANCIAL",
  "period": "MONTH",
  "kpis": {
    "revenue": {
      "value": 2500000.00,
      "formatted": "LKR 2,500,000.00",
      "trend": "up",
      "change_percent": 12.5
    },
    "expenses": {
      "value": 1800000.00,
      "formatted": "LKR 1,800,000.00"
    },
    "net_income": {
      "value": 700000.00,
      "formatted": "LKR 700,000.00",
      "trend": "up"
    },
    "gross_profit_margin": {
      "value": 35.5,
      "formatted": "35.5%"
    },
    "net_profit_margin": {
      "value": 28.0,
      "formatted": "28.0%"
    },
    "cash_position": {
      "value": 1250000.00,
      "urgency": "normal"
    },
    "current_ratio": {
      "value": 2.1,
      "interpretation": "Healthy"
    },
    "quick_ratio": {
      "value": 1.4,
      "interpretation": "Good"
    }
  },
  "ar_aging": {...},
  "ap_aging": {...},
  "revenue_trend": [...]
}
```

### KPI Formulas

**Gross Profit Margin:**
```
GPM = (Revenue - COGS) / Revenue × 100
```

**Net Profit Margin:**
```
NPM = Net Income / Revenue × 100
```

**Current Ratio:**
```
Current Ratio = Current Assets / Current Liabilities
```

**Quick Ratio:**
```
Quick Ratio = (Current Assets - Inventory) / Current Liabilities
```

### Aging Summary Structure
```json
{
  "ar_aging": {
    "current": 500000.00,
    "days_30": 150000.00,
    "days_60": 75000.00,
    "days_90_plus": 25000.00,
    "total": 750000.00
  }
}
```

### Ratio Interpretations
| Ratio | Poor | Acceptable | Good | Excellent |
|-------|------|------------|------|-----------|
| Current | < 1.0 | 1.0-1.5 | 1.5-2.5 | > 2.5 |
| Quick | < 0.5 | 0.5-1.0 | 1.0-1.5 | > 1.5 |

### Revenue Trend Structure
```json
{
  "revenue_trend": [
    {"month": "2025-11", "revenue": 2200000, "expenses": 1650000},
    {"month": "2025-12", "revenue": 2350000, "expenses": 1750000},
    {"month": "2026-01", "revenue": 2500000, "expenses": 1800000}
  ]
}
```

### Cache Keys
- `kpi:financial:summary:{tenant_id}` - 6 hour TTL
- `kpi:financial:aging:{tenant_id}` - 1 hour TTL
- `kpi:financial:ratios:{tenant_id}` - 6 hour TTL

### Data Sources
- Revenue: Account type = REVENUE
- Expenses: Account type = EXPENSE
- Cash: Account codes 1100-1199
- AR: Account codes 1200-1299
- AP: Account codes 2100-2199
- Current Assets: Account codes 1xxx
- Current Liabilities: Account codes 21xx
