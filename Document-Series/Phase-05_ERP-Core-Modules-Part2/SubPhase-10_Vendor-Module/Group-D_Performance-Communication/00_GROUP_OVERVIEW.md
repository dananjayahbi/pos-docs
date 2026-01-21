# Group D: Performance & Communication

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement vendor performance tracking and communication logging

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Vendor Product Catalog](../Group-C_Vendor-Product-Catalog/)
- **→ Next Group:** [Group E: Documents & Import/Export](../Group-E_Documents-Import-Export/)

---

## Group Overview

### Key Outcomes

1. **VendorPerformance Model** - Track vendor performance metrics
2. **Performance Metrics** - on_time_delivery_rate, quality_score, response_time
3. **Performance Period Fields** - period_start, period_end
4. **Performance Migrations** - Apply migrations
5. **PerformanceService Class** - Calculate vendor performance
6. **Delivery Rate Calculator** - On-time delivery percentage
7. **Quality Score Calculator** - Quality based on returns/defects
8. **Response Time Tracker** - Vendor response time
9. **Overall Rating Calculator** - Weighted vendor rating
10. **VendorCommunication Model** - Log vendor interactions
11. **CommunicationType Choices** - EMAIL, PHONE, MEETING, SITE_VISIT, OTHER
12. **Communication Fields** - type, subject, content, contacted_by
13. **Communication Follow-up** - follow_up_date, follow_up_notes
14. **Communication Migrations** - Apply migrations
15. **Log Communication** - Service to log new communication
16. **Communication Timeline** - Chronological history

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Performance and communication models |
| Service Layer | Performance calculations |
| Aggregation | Metric calculations |
| Timeline | Chronological display |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-59_Performance-Model-Service.md` | 51-59 | VendorPerformance model, metrics, service, calculators |
| 02 | `02_Tasks-60-66_Communication-Model-Service.md` | 60-66 | VendorCommunication model, types, logging, timeline |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create VendorPerformance Model | Medium | 25 min |
| 52 | Add Performance Metrics | Medium | 25 min |
| 53 | Add Performance Period Fields | Medium | 20 min |
| 54 | Run Performance Migrations | Low | 15 min |
| 55 | Create PerformanceService Class | High | 30 min |
| 56 | Implement Delivery Rate Calculator | Medium | 25 min |
| 57 | Implement Quality Score Calculator | Medium | 25 min |
| 58 | Implement Response Time Tracker | Medium | 25 min |
| 59 | Implement Overall Rating Calculator | High | 30 min |
| 60 | Create VendorCommunication Model | Medium | 25 min |
| 61 | Define CommunicationType Choices | Low | 15 min |
| 62 | Add Communication Fields | Medium | 20 min |
| 63 | Add Communication Follow-up | Medium | 20 min |
| 64 | Run Communication Migrations | Low | 15 min |
| 65 | Implement Log Communication | Medium | 25 min |
| 66 | Implement Communication Timeline | Medium | 25 min |

---

## Execution Order

```
[Tasks 51-59: Performance model and service]
         │
         ▼
[Tasks 60-66: Communication model and service]
```

---

## Expected Deliverables

```
apps/vendors/
├── models/
│   ├── __init__.py
│   ├── vendor_performance.py     # Tasks 51-53
│   └── vendor_communication.py   # Tasks 60-63
├── services/
│   ├── __init__.py
│   └── performance_service.py    # Tasks 55-59
└── migrations/
    ├── 0007_performance.py       # Task 54
    └── 0008_communication.py     # Task 64
```

---

## Notes for AI Agents

### VendorPerformance Fields
- vendor: FK to Vendor
- period_start: Date
- period_end: Date
- on_time_delivery_rate: Decimal (0-100%)
- quality_score: Decimal (0-100%)
- avg_response_time_hours: Decimal
- total_orders_count: Integer
- orders_on_time: Integer
- orders_late: Integer
- items_received: Integer
- items_defective: Integer
- overall_rating: Decimal (1.0-5.0)

### Performance Metrics Calculation

| Metric | Calculation | Weight |
|--------|-------------|--------|
| On-Time Delivery | (Orders on time ÷ Total orders) × 100 | 40% |
| Quality Score | (1 - Defective ÷ Total items) × 100 | 30% |
| Response Time | Average time to respond (hours) | 15% |
| Price Competitiveness | Comparison with market | 15% |

### On-Time Delivery Rate
```
on_time_rate = (orders_on_time / total_orders) × 100

Example:
95 on-time out of 100 orders = 95%
```

### Quality Score
```
quality_score = (1 - defective_items / total_items) × 100

Example:
5 defective out of 1000 items = 99.5%
```

### Response Time
```
avg_response_time = sum(response_times) / count(responses)

Tracked from:
- PO sent → PO acknowledged
- Inquiry sent → Response received
```

### Overall Rating Formula
```
rating = (on_time × 0.40) + (quality × 0.30) + (response × 0.15) + (price × 0.15)

Converted to 1-5 scale:
stars = (rating / 100) × 5
```

### CommunicationType Choices
- **EMAIL**: Email correspondence
- **PHONE**: Phone call
- **MEETING**: In-person or virtual meeting
- **SITE_VISIT**: Vendor site visit
- **OTHER**: Other communication type

### VendorCommunication Fields
- vendor: FK to Vendor
- communication_type: Choice field
- subject: CharField
- content: TextField
- contacted_by: FK to User
- contact_date: DateTime
- follow_up_date: Date (nullable)
- follow_up_notes: TextField
- is_follow_up_complete: Boolean
- related_po: FK to PurchaseOrder (nullable)

### Communication Timeline Response
```json
{
  "vendor_id": "uuid",
  "communications": [
    {
      "date": "2026-01-15T10:30:00",
      "type": "PHONE",
      "subject": "Order status inquiry",
      "content": "Called about PO-2026-00050 status...",
      "contacted_by": "John Staff"
    },
    {
      "date": "2026-01-10T14:00:00",
      "type": "EMAIL",
      "subject": "Price list update request",
      "content": "Requested updated price list...",
      "contacted_by": "Jane Buyer"
    }
  ]
}
```
