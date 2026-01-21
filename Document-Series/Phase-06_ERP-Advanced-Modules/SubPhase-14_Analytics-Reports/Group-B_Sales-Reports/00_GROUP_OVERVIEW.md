# Group B: Sales Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement sales report generators with product, customer, period, channel, and cashier breakdowns

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Report-Framework](../Group-A_Report-Framework/)
- **→ Next Group:** [Group-C_Inventory-Purchase-Reports](../Group-C_Inventory-Purchase-Reports/)

---

## Group Overview

This group implements the BaseReportGenerator abstract class and all sales-related report generators. Creates five sales reports: by product, by customer, by period (day/week/month), by channel (POS vs Webstore), and by cashier. Each report includes appropriate filters, calculated columns (quantity, revenue), ranking capabilities, and trend visualization data. Implements export methods for PDF, Excel, and CSV formats.

### Key Outcomes

- BaseReportGenerator abstract class
- Abstract generate() method
- Export methods (to_pdf, to_excel, to_csv)
- SalesByProductReport with product/category filter
- Date range filter for all sales reports
- Quantity and revenue columns
- SalesByCustomerReport with ranking
- Order count column
- SalesByPeriodReport with grouping
- Trend visualization chart data
- SalesByChannelReport (POS vs Webstore)
- Channel comparison analysis
- SalesByCashierReport
- Cashier performance metrics (AOV, transaction count)
- Sales report API endpoint

### Technology Context

- **Export:** WeasyPrint (PDF), openpyxl (Excel)
- **Data Source:** SalesInvoice, SalesInvoiceLine
- **Charts:** Recharts-compatible JSON data
- **Filters:** DRF query parameters

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_BaseGenerator-ProductCustomer.md` | Create BaseReportGenerator and product/customer reports | 17-26 |
| 02 | `02_Tasks-27-34_Period-Channel-Cashier.md` | Create period, channel, and cashier reports with API | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create BaseReportGenerator | High | Task 16 |
| 18 | Add Generate Method | Medium | Task 17 |
| 19 | Add Export Methods | Medium | Task 18 |
| 20 | Create SalesByProductReport | Medium | Task 19 |
| 21 | Add Product Filter | Low | Task 20 |
| 22 | Add Date Range Filter | Low | Task 20 |
| 23 | Add Quantity/Revenue Columns | Medium | Task 22 |
| 24 | Create SalesByCustomerReport | Medium | Task 23 |
| 25 | Add Customer Ranking | Medium | Task 24 |
| 26 | Add Order Count Column | Low | Task 25 |
| 27 | Create SalesByPeriodReport | Medium | Task 26 |
| 28 | Add Period Grouping | Medium | Task 27 |
| 29 | Add Trend Visualization | Medium | Task 28 |
| 30 | Create SalesByChannelReport | Medium | Task 29 |
| 31 | Add Channel Comparison | Low | Task 30 |
| 32 | Create SalesByCashierReport | Medium | Task 31 |
| 33 | Add Cashier Performance Metrics | Medium | Task 32 |
| 34 | Create Sales Report Endpoint | Low | Task 33 |

---

## Execution Order

```
Task 17: Create BaseReportGenerator
    │
    ▼
Task 18: Add Generate Method
    │
    ▼
Task 19: Add Export Methods
    │
    ▼
Task 20: Create SalesByProductReport
    │
    ├──────────────┐
    ▼              ▼
Task 21        Task 22
(product)      (date range)
    │              │
    └──────┬───────┘
           ▼
      Task 23: Quantity/Revenue Columns
           │
           ▼
      Task 24: SalesByCustomerReport
           │
           ▼
      Task 25: Customer Ranking
           │
           ▼
      Task 26: Order Count Column
           │
           ▼
      Task 27: SalesByPeriodReport
           │
           ▼
      Task 28: Period Grouping
           │
           ▼
      Task 29: Trend Visualization
           │
           ▼
      Task 30: SalesByChannelReport
           │
           ▼
      Task 31: Channel Comparison
           │
           ▼
      Task 32: SalesByCashierReport
           │
           ▼
      Task 33: Cashier Performance
           │
           ▼
      Task 34: Create API Endpoint
```

---

## Expected Deliverables

```
apps/analytics/
├── generators/
│   ├── __init__.py
│   ├── base.py                # BaseReportGenerator
│   └── sales/
│       ├── __init__.py
│       ├── by_product.py      # SalesByProductReport
│       ├── by_customer.py     # SalesByCustomerReport
│       ├── by_period.py       # SalesByPeriodReport
│       ├── by_channel.py      # SalesByChannelReport
│       └── by_cashier.py      # SalesByCashierReport
├── exporters/
│   ├── __init__.py
│   ├── pdf.py                 # PDF exporter
│   ├── excel.py               # Excel exporter
│   └── csv.py                 # CSV exporter
└── views/
    └── reports.py             # Add sales endpoint
```

---

## Notes for AI Agents

### BaseReportGenerator Interface
```
BaseReportGenerator (abstract):
├── report_definition: ReportDefinition
├── filters: dict
├── generate() → ReportData (abstract)
├── validate_filters() → bool
├── apply_date_filter(queryset) → QuerySet
├── to_pdf() → bytes
├── to_excel() → bytes
├── to_csv() → str
└── get_chart_data() → dict
```

### SalesByProductReport Structure
```json
{
  "report_type": "SALES_BY_PRODUCT",
  "period": "2026-01-01 to 2026-01-31",
  "data": [
    {
      "product_id": 1,
      "product_name": "Rice 5kg",
      "sku": "RICE-5KG",
      "category": "Groceries",
      "quantity_sold": 250,
      "revenue": 125000.00,
      "avg_price": 500.00,
      "percentage": 15.5
    }
  ],
  "totals": {
    "quantity": 2500,
    "revenue": 1250000.00
  }
}
```

### SalesByCustomerReport Structure
```json
{
  "report_type": "SALES_BY_CUSTOMER",
  "data": [
    {
      "rank": 1,
      "customer_id": 123,
      "customer_name": "ABC Company",
      "order_count": 15,
      "total_amount": 450000.00,
      "avg_order_value": 30000.00
    }
  ]
}
```

### SalesByPeriodReport Grouping Options
- DAILY: Each day in range
- WEEKLY: Each week in range
- MONTHLY: Each month in range

### Channel Comparison Metrics
- Total sales per channel
- Order count per channel
- Average order value per channel
- Percentage split

### Cashier Performance Metrics
- Total sales amount
- Transaction count
- Average order value
- Items per transaction
