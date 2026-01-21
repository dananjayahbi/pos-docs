# Group E: Returns & Cancellations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement return workflow and order cancellation

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Fulfillment Workflow](../Group-D_Fulfillment-Workflow/)
- **→ Next Group:** [Group F: Order API, Testing & Documentation](../Group-F_Order-API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **OrderReturn Model** - Return/RMA requests linked to order
2. **Return Reason Fields** - DEFECTIVE, WRONG_ITEM, CHANGED_MIND, etc.
3. **Return Status Fields** - REQUESTED, APPROVED, RECEIVED, REFUNDED, REJECTED
4. **ReturnLineItem Model** - Link return to specific items
5. **Return Financial Fields** - refund_amount, restocking_fee, refund_method
6. **Return Migrations** - Apply migrations
7. **ReturnService Class** - Handle return workflow
8. **Return Request** - Customer/staff initiates return
9. **Return Approval** - Staff approves/rejects return
10. **Return Receipt** - Mark items as received, inspect
11. **Stock Restoration** - Return items to inventory
12. **Order Cancellation** - Cancel order, release stock
13. **Cancellation Validation** - Validate cancellation is allowed
14. **Partial Cancellation** - Cancel specific line items

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Return models |
| Service Layer | Return workflow |
| State Machine | Return status transitions |
| Inventory Service | Stock restoration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-72_Return-Models.md` | 67-72 | OrderReturn model, reason, status, line items, financial, migrations |
| 02 | `02_Tasks-73-77_Return-Service-Workflow.md` | 73-77 | ReturnService, request, approval, receipt, stock restoration |
| 03 | `03_Tasks-78-80_Cancellation.md` | 78-80 | Order cancellation, validation, partial cancellation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create OrderReturn Model | Medium | 25 min |
| 68 | Add Return Reason Fields | Medium | 20 min |
| 69 | Add Return Status Fields | Medium | 20 min |
| 70 | Create ReturnLineItem Model | Medium | 25 min |
| 71 | Add Return Financial Fields | Medium | 20 min |
| 72 | Run Return Migrations | Low | 15 min |
| 73 | Create ReturnService Class | High | 30 min |
| 74 | Implement Return Request | Medium | 25 min |
| 75 | Implement Return Approval | Medium | 25 min |
| 76 | Implement Return Receipt | Medium | 25 min |
| 77 | Implement Stock Restoration | High | 30 min |
| 78 | Implement Order Cancellation | High | 30 min |
| 79 | Add Cancellation Validation | Medium | 25 min |
| 80 | Implement Partial Cancellation | High | 30 min |

---

## Execution Order

```
[Tasks 67-72: Return models and migrations]
         │
         ▼
[Tasks 73-77: ReturnService and workflow]
         │
         ▼
[Tasks 78-80: Cancellation logic]
```

---

## Expected Deliverables

```
apps/orders/
├── models/
│   ├── __init__.py
│   └── order_return.py           # Tasks 67-71
├── services/
│   ├── __init__.py
│   ├── return_service.py         # Tasks 73-77
│   └── cancellation_service.py   # Tasks 78-80
└── migrations/
    └── 0005_return.py            # Task 72
```

---

## Notes for AI Agents

### OrderReturn Model Fields
- order: FK to Order
- return_number: Unique identifier (RET-{YEAR}-{SEQ})
- status: Choice field
- reason: Choice field
- reason_notes: TextField
- requested_at, approved_at, received_at, refunded_at
- approved_by: FK to User
- refund_amount: DecimalField
- restocking_fee: DecimalField
- refund_method: Choice (ORIGINAL, STORE_CREDIT, CASH)
- notes: TextField

### Return Reason Choices
- **DEFECTIVE**: Product defective or damaged
- **WRONG_ITEM**: Wrong item received
- **CHANGED_MIND**: Customer changed mind
- **NOT_AS_DESCRIBED**: Not as advertised
- **BETTER_PRICE**: Found better price elsewhere
- **DUPLICATE**: Duplicate order
- **OTHER**: Other reason (requires notes)

### Return Status Flow
```
REQUESTED → APPROVED → RECEIVED → REFUNDED
    │                      │
    └── REJECTED           └── (stock restored)
```

### ReturnLineItem Fields
- order_return: FK to OrderReturn
- order_line_item: FK to OrderLineItem
- quantity: Quantity being returned
- condition: UNOPENED, OPENED, DAMAGED
- notes: TextField

### Stock Restoration Rules
| Condition | Action |
|-----------|--------|
| UNOPENED | Full restore to sellable |
| OPENED | Restore with inspection |
| DAMAGED | Mark as damaged/write-off |

### Cancellation Validation Rules
| Status | Can Cancel |
|--------|------------|
| PENDING | ✅ Full cancel |
| CONFIRMED | ✅ Full cancel (release stock) |
| PROCESSING | ⚠️ Requires manager approval |
| SHIPPED | ❌ Cannot cancel (use return) |
| DELIVERED | ❌ Cannot cancel (use return) |

### Partial Cancellation
```
Order: 10 items
       │
       ├─ Cancel 3 items → Release stock for 3
       │
       └─ Keep 7 items → Continue fulfillment
```

### Refund Calculation
```
refund_amount = sum(line.unit_price * line.quantity for line in return_lines)
refund_amount -= restocking_fee
refund_amount += original_shipping (if full return)
```
