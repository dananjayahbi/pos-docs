# Group C: Inventory & Purchase Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement inventory and purchase report generators with stock, movement, and vendor analysis

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Sales-Reports](../Group-B_Sales-Reports/)
- **→ Next Group:** [Group-D_Customer-Staff-Reports](../Group-D_Customer-Staff-Reports/)

---

## Group Overview

This group implements inventory and purchase report generators. Creates three inventory reports: stock level (current stock by product), stock movement (in/out transactions with running balance), and stock valuation (with FIFO/LIFO/Average costing methods and aging analysis). Creates three purchase reports: by vendor (with ranking), by category (with breakdown), and vendor performance (delivery and quality metrics). All reports include location and category filters.

### Key Outcomes

- StockLevelReport with current stock
- Location (warehouse) filter
- Category filter
- Stock value calculation
- StockMovementReport with transactions
- Movement type filter (IN, OUT, ADJUSTMENT)
- Running balance column
- StockValuationReport with costing methods
- FIFO, LIFO, Average valuation options
- Stock aging buckets
- PurchaseByVendorReport with ranking
- Vendor ranking by purchase amount
- Payment status column
- PurchaseByCategoryReport
- Category percentage breakdown
- VendorPerformanceReport
- Delivery and quality metrics
- Lead time analysis
- Inventory report API endpoint

### Technology Context

- **Costing Methods:** FIFO, LIFO, Weighted Average
- **Data Source:** StockLevel, StockMovement, PurchaseOrder
- **Aging:** Days since last movement
- **Vendor Metrics:** From GRN and quality records

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Stock-Reports.md` | Create stock level, movement, and valuation reports | 35-44 |
| 02 | `02_Tasks-45-52_Purchase-Reports.md` | Create purchase and vendor performance reports | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create StockLevelReport | Medium | Task 34 |
| 36 | Add Location Filter | Low | Task 35 |
| 37 | Add Category Filter | Low | Task 35 |
| 38 | Add Stock Value Column | Medium | Task 37 |
| 39 | Create StockMovementReport | Medium | Task 38 |
| 40 | Add Movement Type Filter | Low | Task 39 |
| 41 | Add Running Balance | Medium | Task 40 |
| 42 | Create StockValuationReport | High | Task 41 |
| 43 | Add Valuation Method | High | Task 42 |
| 44 | Add Age Analysis | Medium | Task 43 |
| 45 | Create PurchaseByVendorReport | Medium | Task 44 |
| 46 | Add Vendor Ranking | Medium | Task 45 |
| 47 | Add Payment Status Column | Low | Task 46 |
| 48 | Create PurchaseByCategoryReport | Medium | Task 47 |
| 49 | Add Category Breakdown | Low | Task 48 |
| 50 | Create VendorPerformanceReport | High | Task 49 |
| 51 | Add Lead Time Analysis | Medium | Task 50 |
| 52 | Create Inventory Report Endpoint | Low | Task 51 |

---

## Execution Order

```
Task 35: Create StockLevelReport
    │
    ├──────────────┐
    ▼              ▼
Task 36        Task 37
(location)     (category)
    │              │
    └──────┬───────┘
           ▼
      Task 38: Stock Value Column
           │
           ▼
      Task 39: StockMovementReport
           │
           ▼
      Task 40: Movement Type Filter
           │
           ▼
      Task 41: Running Balance
           │
           ▼
      Task 42: StockValuationReport
           │
           ▼
      Task 43: Valuation Method
           │
           ▼
      Task 44: Age Analysis
           │
           ▼
      Task 45: PurchaseByVendorReport
           │
           ▼
      Task 46: Vendor Ranking
           │
           ▼
      Task 47: Payment Status Column
           │
           ▼
      Task 48: PurchaseByCategoryReport
           │
           ▼
      Task 49: Category Breakdown
           │
           ▼
      Task 50: VendorPerformanceReport
           │
           ▼
      Task 51: Lead Time Analysis
           │
           ▼
      Task 52: Create API Endpoint
```

---

## Expected Deliverables

```
apps/analytics/
├── generators/
│   ├── __init__.py
│   ├── base.py
│   ├── sales/
│   │   └── ...
│   ├── inventory/
│   │   ├── __init__.py
│   │   ├── stock_level.py      # StockLevelReport
│   │   ├── stock_movement.py   # StockMovementReport
│   │   └── stock_valuation.py  # StockValuationReport
│   └── purchase/
│       ├── __init__.py
│       ├── by_vendor.py        # PurchaseByVendorReport
│       ├── by_category.py      # PurchaseByCategoryReport
│       └── vendor_performance.py
└── views/
    └── reports.py              # Add inventory endpoint
```

---

## Notes for AI Agents

### StockLevelReport Structure
```json
{
  "report_type": "STOCK_LEVEL",
  "as_of_date": "2026-01-31",
  "data": [
    {
      "product_id": 1,
      "product_name": "Rice 5kg",
      "sku": "RICE-5KG",
      "category": "Groceries",
      "warehouse": "Main Store",
      "quantity": 150,
      "unit_cost": 480.00,
      "stock_value": 72000.00,
      "reorder_point": 50,
      "status": "NORMAL"
    }
  ],
  "totals": {
    "total_items": 250,
    "total_value": 5250000.00
  }
}
```

### StockMovementReport Structure
```json
{
  "report_type": "STOCK_MOVEMENT",
  "period": "2026-01-01 to 2026-01-31",
  "product": "Rice 5kg",
  "data": [
    {
      "date": "2026-01-15",
      "type": "IN",
      "reference": "GRN-001",
      "quantity": 100,
      "running_balance": 200
    },
    {
      "date": "2026-01-20",
      "type": "OUT",
      "reference": "INV-0015",
      "quantity": -50,
      "running_balance": 150
    }
  ]
}
```

### Stock Valuation Methods
- FIFO: First In, First Out
- LIFO: Last In, First Out
- AVERAGE: Weighted Average Cost

### Stock Aging Buckets
| Age | Category |
|-----|----------|
| 0-30 days | Current |
| 31-60 days | Moderate |
| 61-90 days | Slow |
| 90+ days | Dead Stock |

### Vendor Performance Metrics
```json
{
  "vendor_id": 1,
  "vendor_name": "ABC Suppliers",
  "total_orders": 25,
  "on_time_delivery_rate": 92.5,
  "avg_lead_time_days": 3.5,
  "quality_acceptance_rate": 98.0,
  "total_value": 2500000.00
}
```

### Lead Time Calculation
- Order Date → Delivery Date
- Average across all completed orders
- Exclude cancelled/rejected orders
