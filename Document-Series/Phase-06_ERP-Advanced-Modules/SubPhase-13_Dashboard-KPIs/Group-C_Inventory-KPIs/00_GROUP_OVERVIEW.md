# Group C: Inventory KPIs

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement inventory KPI calculator with stock value, movement metrics, and reorder alerts

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Sales-KPIs](../Group-B_Sales-KPIs/)
- **→ Next Group:** [Group-D_Financial-KPIs](../Group-D_Financial-KPIs/)

---

## Group Overview

This group implements the InventoryKPICalculator with all stock-related performance metrics. Calculates total stock value, low stock and out of stock counts, overstock items, inventory turnover ratio, and days of inventory. Includes fast-moving and slow-moving product analysis, dead stock identification, stock breakdowns by category and warehouse, and reorder alert lists. Implements Redis caching with invalidation on stock changes.

### Key Outcomes

- InventoryKPICalculator extending BaseKPICalculator
- Total stock value KPI
- Low stock items count KPI
- Out of stock items count KPI
- Overstock items count KPI
- Inventory turnover ratio KPI
- Days of inventory KPI
- Fast-moving products list (top 5 by velocity)
- Slow-moving products list (bottom 5)
- Dead stock list (no sales in 90 days)
- Stock value by category breakdown
- Stock value by warehouse breakdown
- Reorder alert item list
- Redis cache for inventory KPIs
- Cache invalidation on stock change
- Inventory KPI API endpoint

### Technology Context

- **Data Source:** StockLevel, Product, StockMovement
- **Calculations:** FIFO cost basis for valuation
- **Velocity:** Sales units / time period
- **Caching:** 1-hour TTL for inventory metrics

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-40_Stock-Value-Turnover.md` | Create InventoryKPICalculator with value and movement metrics | 33-40 |
| 02 | `02_Tasks-41-48_Stock-Analysis-Caching.md` | Add dead stock, breakdowns, caching, and API endpoint | 41-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create InventoryKPICalculator | Medium | Task 32 |
| 34 | Add Stock Value KPI | Medium | Task 33 |
| 35 | Add Low Stock Items KPI | Medium | Task 34 |
| 36 | Add Out of Stock KPI | Low | Task 35 |
| 37 | Add Overstock Items KPI | Medium | Task 36 |
| 38 | Add Inventory Turnover KPI | High | Task 37 |
| 39 | Add Days of Inventory KPI | Medium | Task 38 |
| 40 | Add Fast Moving Products KPI | Medium | Task 39 |
| 41 | Add Slow Moving Products KPI | Medium | Task 40 |
| 42 | Add Dead Stock KPI | Medium | Task 41 |
| 43 | Add Stock by Category KPI | Medium | Task 42 |
| 44 | Add Stock by Warehouse KPI | Medium | Task 43 |
| 45 | Add Reorder Alert List | Medium | Task 44 |
| 46 | Create Inventory KPI Cache | Medium | Task 45 |
| 47 | Add Inventory Cache Invalidation | Medium | Task 46 |
| 48 | Create Inventory KPI Endpoint | Low | Task 47 |

---

## Execution Order

```
Task 33: Create InventoryKPICalculator
    │
    ▼
Task 34: Stock Value KPI
    │
    ▼
Task 35: Low Stock Items KPI
    │
    ▼
Task 36: Out of Stock KPI
    │
    ▼
Task 37: Overstock Items KPI
    │
    ▼
Task 38: Inventory Turnover KPI
    │
    ▼
Task 39: Days of Inventory KPI
    │
    ▼
Task 40: Fast Moving Products KPI
    │
    ▼
Task 41: Slow Moving Products KPI
    │
    ▼
Task 42: Dead Stock KPI
    │
    ▼
Task 43: Stock by Category KPI
    │
    ▼
Task 44: Stock by Warehouse KPI
    │
    ▼
Task 45: Reorder Alert List
    │
    ▼
Task 46: Create Inventory KPI Cache
    │
    ▼
Task 47: Cache Invalidation
    │
    ▼
Task 48: Create Inventory KPI Endpoint
```

---

## Expected Deliverables

```
apps/dashboard/
├── calculators/
│   ├── __init__.py
│   ├── base.py
│   ├── sales.py
│   └── inventory.py           # InventoryKPICalculator
├── services/
│   └── cache_service.py       # Add inventory cache
├── views/
│   └── dashboard.py           # Add inventory endpoint
└── signals.py                 # Add stock change signals
```

---

## Notes for AI Agents

### Inventory KPI Response Structure
```json
{
  "category": "INVENTORY",
  "kpis": {
    "stock_value": {
      "value": 5250000.00,
      "formatted": "LKR 5,250,000.00",
      "trend": "up",
      "change_percent": 3.2
    },
    "low_stock_count": {
      "value": 15,
      "urgency": "warning"
    },
    "out_of_stock_count": {
      "value": 3,
      "urgency": "critical"
    },
    "inventory_turnover": {
      "value": 4.2,
      "interpretation": "Good"
    },
    "days_of_inventory": {
      "value": 87,
      "trend": "stable"
    }
  },
  "fast_moving": [...],
  "slow_moving": [...],
  "dead_stock": [...],
  "by_category": {...},
  "by_warehouse": {...},
  "reorder_alerts": [...]
}
```

### KPI Formulas

**Stock Value:**
```
Stock Value = Σ (Quantity on Hand × Unit Cost) for all products
```

**Inventory Turnover:**
```
Turnover = COGS (annual) / Average Inventory Value
```

**Days of Inventory:**
```
DOI = (Average Inventory / COGS) × 365
```

### Stock Status Thresholds
| Status | Condition |
|--------|-----------|
| Out of Stock | quantity = 0 |
| Critical Low | quantity ≤ 25% of reorder_point |
| Low Stock | quantity ≤ reorder_point |
| Normal | quantity > reorder_point |
| Overstock | quantity > max_stock_level |

### Fast/Slow Moving Calculation
```
Velocity = Units Sold (30 days) / Available Days
Fast Moving: Top 5 by velocity
Slow Moving: Bottom 5 by velocity (excluding zero)
```

### Dead Stock Criteria
- No sales in last 90 days
- Quantity on hand > 0
- Consider seasonality exception flags

### Cache Keys
- `kpi:inventory:value:{tenant_id}` - 1 hour TTL
- `kpi:inventory:alerts:{tenant_id}` - 30 min TTL
- `kpi:inventory:movement:{tenant_id}` - 1 hour TTL

### Reorder Alert Structure
```json
{
  "reorder_alerts": [
    {
      "product_id": 123,
      "product_name": "Rice 5kg",
      "sku": "RICE-5KG",
      "current_stock": 5,
      "reorder_point": 20,
      "suggested_qty": 50,
      "urgency": "critical"
    }
  ]
}
```
