# Group A: Data Preparation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Prepare customer data for analytics models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_Platform-Analytics-AI](../../SubPhase-11_Platform-Analytics-AI/)
- **→ Next Group:** [Group-B_RFM-Segmentation](../Group-B_RFM-Segmentation/)

---

## Group Overview

This group prepares customer data. Creates CustomerMetrics Model with Metrics Fields. Creates Order Aggregator. Creates First Order Date and Last Order Date. Creates Order Count, Total Spend, and Average Order. Creates Order Frequency. Creates Product Categories, Purchase Days, and Time of Day preferences. Creates Metrics Scheduler and Historical Snapshots. Creates Data Cleanup. Verifies Data Preparation.

### Key Outcomes

- CustomerMetrics Model
- Metrics Fields
- Order Aggregator
- First Order Date
- Last Order Date
- Order Count
- Total Spend
- Average Order
- Order Frequency
- Product Categories
- Purchase Days
- Time of Day
- Metrics Scheduler
- Historical Snapshots
- Data Cleanup
- Data verified

### Technology Context

- **Aggregation:** Django ORM
- **Storage:** PostgreSQL
- **Schedule:** Daily batch
- **Cleanup:** Outlier removal

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Metrics-Model.md` | Create customer metrics model | 01-08 |
| 02 | `02_Tasks-09-16_Scheduler-Cleanup.md` | Create scheduler and cleanup | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create CustomerMetrics Model | Medium | None |
| 02 | Create Metrics Fields | Low | Task 01 |
| 03 | Create Order Aggregator | Medium | Task 02 |
| 04 | Create First Order Date | Low | Task 03 |
| 05 | Create Last Order Date | Low | Task 04 |
| 06 | Create Order Count | Low | Task 05 |
| 07 | Create Total Spend | Low | Task 06 |
| 08 | Create Average Order | Low | Task 07 |
| 09 | Create Order Frequency | Medium | Task 08 |
| 10 | Create Product Categories | Medium | Task 09 |
| 11 | Create Purchase Days | Low | Task 10 |
| 12 | Create Time of Day | Low | Task 11 |
| 13 | Create Metrics Scheduler | Low | Task 12 |
| 14 | Create Historical Snapshots | Medium | Task 13 |
| 15 | Create Data Cleanup | Low | Task 14 |
| 16 | Verify Data Preparation | Low | Task 15 |

---

## Execution Order

```
Task 01: CustomerMetrics Model
    │
    ▼
Task 02: Metrics Fields
    │
    ▼
Task 03: Order Aggregator
    │
    ▼
Task 04: First Order Date
    │
    ▼
Task 05: Last Order Date
    │
    ▼
Task 06: Order Count
    │
    ▼
Task 07: Total Spend
    │
    ▼
Task 08: Average Order
    │
    ▼
Task 09: Order Frequency
    │
    ▼
Task 10: Product Categories
    │
    ▼
Task 11: Purchase Days
    │
    ▼
Task 12: Time of Day
    │
    ▼
Task 13: Metrics Scheduler
    │
    ▼
Task 14: Historical Snapshots
    │
    ▼
Task 15: Data Cleanup
    │
    ▼
Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   └── customer_metrics.py
        └── analytics/
            └── aggregator.py
```

---

## Notes for AI Agents

### CustomerMetrics Model (Task 01)
| Model | CustomerMetrics |
|-------|-----------------|
| Purpose | Store customer stats |

### Metrics Fields (Task 02)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Record ID |
| tenant_id | string | Tenant |
| customer_id | string | Customer |
| first_order_date | date | First purchase |
| last_order_date | date | Last purchase |
| total_orders | int | Order count |
| total_spend | decimal | Lifetime spend |
| average_order | decimal | AOV |
| order_frequency | decimal | Avg days between |
| preferred_categories | array | Top categories |
| preferred_days | array | Preferred days |
| preferred_hours | array | Preferred hours |
| updated_at | datetime | Last update |

### Order Aggregator (Task 03)
| Class | OrderAggregator |
|-------|-----------------|
| Method | aggregate(customer_id) |

### First Order Date (Task 04)
| Query | MIN(order_date) |
|-------|-----------------|
| Purpose | Customer tenure |

### Last Order Date (Task 05)
| Query | MAX(order_date) |
|-------|-----------------|
| Purpose | Recency calculation |

### Order Count (Task 06)
| Query | COUNT(orders) |
|-------|---------------|
| Purpose | Frequency calculation |

### Total Spend (Task 07)
| Query | SUM(order_total) |
|-------|------------------|
| Purpose | Monetary calculation |

### Average Order (Task 08)
| Formula | Total Spend / Order Count |
|---------|---------------------------|
| Purpose | AOV calculation |

### Order Frequency (Task 09)
| Formula | (Last - First) / (Count - 1) |
|---------|-------------------------------|
| Purpose | Avg days between orders |

### Product Categories (Task 10)
| Method | Top 3 categories by spend |
|--------|---------------------------|
| Store | Array of category IDs |

### Purchase Days (Task 11)
| Method | Top days by order count |
|--------|-------------------------|
| Store | Array (Mon=0, Sun=6) |

### Time of Day (Task 12)
| Method | Top hours by order count |
|--------|--------------------------|
| Store | Array of hours (0-23) |

### Metrics Scheduler (Task 13)
| Schedule | Daily 3 AM |
|----------|------------|
| Task | Celery beat |

### Historical Snapshots (Task 14)
| Model | CustomerMetricsHistory |
|-------|------------------------|
| Schedule | Monthly |

### Data Cleanup (Task 15)
| Action | Remove outliers |
|--------|-----------------|
| Method | IQR method |

### Outlier Rules
| Field | Threshold |
|-------|-----------|
| total_spend | > 3x IQR |
| order_count | > 3x IQR |
