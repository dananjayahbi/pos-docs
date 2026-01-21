# Group D: Communication & History

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** D of F  
> **Tasks Covered:** 51-64  
> **Group Goal:** Implement communication logging and purchase history aggregation

---

## Navigation

- **↑ Parent:** [SubPhase-08 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Customer Services & Search](../Group-C_Customer-Services-Search/)
- **→ Next Group:** [Group E: Segmentation & Duplicate Detection](../Group-E_Segmentation-Duplicate-Detection/)

---

## Group Overview

### Key Outcomes

1. **CustomerCommunication Model** - Customer interaction logs
2. **CommunicationType Choices** - EMAIL, PHONE_CALL, SMS, VISIT, NOTE, OTHER
3. **Communication Fields** - type, subject, content, contacted_by
4. **Communication Date Fields** - communication_date, follow_up_date
5. **Communication Migrations** - Apply migrations
6. **Log Communication** - Service to log entries
7. **Communication Timeline** - Chronological history
8. **PurchaseHistory Aggregation** - Orders, invoices, payments
9. **Purchase Summary** - Total spent, order count, average
10. **Top Products Bought** - Frequently purchased products
11. **Last Purchase Info** - Last purchase date, amount, products
12. **Customer Statistics** - Lifetime value, frequency
13. **Customer Activity Feed** - Combined activities
14. **Activity Feed Pagination** - Paginated with filters

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Communication model |
| Aggregation | Purchase history calculations |
| Pagination | Activity feed pagination |
| Caching | Statistics caching |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-57_Communication-Model.md` | 51-57 | CustomerCommunication model, types, fields, dates, migrations, log service, timeline |
| 02 | `02_Tasks-58-64_Purchase-History-Statistics.md` | 58-64 | Purchase aggregation, summary, top products, last purchase, statistics, activity feed, pagination |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create CustomerCommunication Model | Medium | 25 min |
| 52 | Define CommunicationType Choices | Low | 15 min |
| 53 | Add Communication Fields | Medium | 20 min |
| 54 | Add Communication Date Fields | Low | 15 min |
| 55 | Run Communication Migrations | Low | 15 min |
| 56 | Implement Log Communication | Medium | 25 min |
| 57 | Implement Communication Timeline | Medium | 25 min |
| 58 | Create PurchaseHistory Aggregation | High | 30 min |
| 59 | Implement Purchase Summary | Medium | 25 min |
| 60 | Implement Top Products Bought | Medium | 25 min |
| 61 | Implement Last Purchase Info | Medium | 20 min |
| 62 | Implement Customer Statistics | Medium | 25 min |
| 63 | Create Customer Activity Feed | High | 30 min |
| 64 | Implement Activity Feed Pagination | Medium | 25 min |

---

## Execution Order

```
[Tasks 51-57: Communication model and services]
         │
         ▼
[Tasks 58-64: Purchase history and activity feed]
```

---

## Expected Deliverables

```
apps/customers/
├── models/
│   ├── __init__.py
│   └── customer_communication.py # Tasks 51-54
├── services/
│   ├── __init__.py
│   ├── communication_service.py  # Tasks 56-57
│   ├── history_service.py        # Tasks 58-62
│   └── activity_service.py       # Tasks 63-64
└── migrations/
    └── 0005_communication.py     # Task 55
```

---

## Notes for AI Agents

### CommunicationType Choices
- **EMAIL**: Email sent to customer
- **PHONE_CALL**: Phone call with customer
- **SMS**: SMS message sent
- **VISIT**: Customer store visit
- **NOTE**: Internal note about customer
- **OTHER**: Other communication type

### CustomerCommunication Fields
- customer: FK to Customer
- communication_type: Choice field
- subject: CharField
- content: TextField
- contacted_by: FK to User
- communication_date: DateTimeField
- follow_up_date: DateField (nullable)
- follow_up_completed: BooleanField
- related_order: FK to Order (nullable)
- related_invoice: FK to Invoice (nullable)

### Communication Timeline
```
GET /customers/{id}/communications/

Response:
[
  {
    "date": "2026-01-15T10:30:00",
    "type": "PHONE_CALL",
    "subject": "Order inquiry",
    "content": "Customer called about order status...",
    "contacted_by": "John Staff"
  },
  ...
]
```

### Purchase Summary
```json
{
  "total_orders": 25,
  "total_spent": 150000,
  "average_order_value": 6000,
  "total_items_purchased": 85,
  "first_purchase_date": "2025-03-15",
  "last_purchase_date": "2026-01-10"
}
```

### Top Products Bought
```json
{
  "top_products": [
    {"product_id": "uuid", "name": "Product A", "quantity": 50, "total": 75000},
    {"product_id": "uuid", "name": "Product B", "quantity": 30, "total": 45000},
    {"product_id": "uuid", "name": "Product C", "quantity": 20, "total": 30000}
  ]
}
```

### Customer Statistics
```json
{
  "lifetime_value": 150000,
  "average_order_value": 6000,
  "purchase_frequency_days": 14,
  "days_since_last_purchase": 5,
  "total_orders": 25,
  "total_returns": 2,
  "return_rate": 8,
  "outstanding_balance": 0
}
```

### Activity Feed Types
- ORDER_PLACED
- ORDER_COMPLETED
- PAYMENT_RECEIVED
- INVOICE_SENT
- COMMUNICATION_LOGGED
- PROFILE_UPDATED
- ADDRESS_ADDED
- TAG_ASSIGNED

### Activity Feed Response
```json
{
  "activities": [
    {
      "type": "ORDER_PLACED",
      "date": "2026-01-15T10:30:00",
      "description": "Placed order #ORD-2026-00001 for LKR 5,000",
      "related_id": "order-uuid"
    },
    ...
  ],
  "page": 1,
  "total_pages": 5,
  "total_count": 48
}
```
