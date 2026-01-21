# Group D: Refunds & Adjustments

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** D of F  
> **Tasks Covered:** 51-64  
> **Group Goal:** Implement refund processing and payment adjustments

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Partial & Split Payments](../Group-C_Partial-Split-Payments/)
- **→ Next Group:** [Group E: Payment Receipts & Notifications](../Group-E_Payment-Receipts-Notifications/)

---

## Group Overview

### Key Outcomes

1. **RefundReason Choices** - RETURN, OVERCHARGE, CANCELLED, DUPLICATE, OTHER
2. **Refund Model** - Refund transactions linked to original payment
3. **Refund Amount Fields** - amount, original_payment FK, reason
4. **Refund Method Fields** - refund_method (original, store credit, cash)
5. **Refund Status Fields** - PENDING, APPROVED, PROCESSED, REJECTED
6. **Refund Approval Fields** - requested_by, approved_by, notes
7. **Refund Migrations** - Apply migrations
8. **RefundService Class** - Handle refund workflow
9. **Refund Request** - Create with reason
10. **Refund Approval** - Approve/reject request
11. **Refund Processing** - Process approved, update balances
12. **Store Credit Refund** - Issue store credit instead of cash
13. **Invoice Update on Refund** - Adjust invoice balance
14. **Refund Limits** - Validate doesn't exceed original

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Refund model |
| Service Layer | Refund workflow |
| State Machine | Refund status transitions |
| Customer Balance | Store credit management |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-57_Refund-Model.md` | 51-57 | RefundReason, Refund model, amount, method, status, approval, migrations |
| 02 | `02_Tasks-58-64_Refund-Service-Workflow.md` | 58-64 | RefundService, request, approval, processing, store credit, invoice update, limits |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Define RefundReason Choices | Low | 15 min |
| 52 | Create Refund Model | Medium | 25 min |
| 53 | Add Refund Amount Fields | Medium | 20 min |
| 54 | Add Refund Method Fields | Medium | 20 min |
| 55 | Add Refund Status Fields | Medium | 20 min |
| 56 | Add Refund Approval Fields | Medium | 20 min |
| 57 | Run Refund Model Migrations | Low | 15 min |
| 58 | Create RefundService Class | High | 30 min |
| 59 | Implement Refund Request | Medium | 25 min |
| 60 | Implement Refund Approval | Medium | 25 min |
| 61 | Implement Refund Processing | High | 30 min |
| 62 | Implement Store Credit Refund | Medium | 25 min |
| 63 | Update Invoice on Refund | Medium | 25 min |
| 64 | Implement Refund Limits | Medium | 25 min |

---

## Execution Order

```
[Tasks 51-57: Refund model and migrations]
         │
         ▼
[Tasks 58-64: RefundService and workflow]
```

---

## Expected Deliverables

```
apps/payments/
├── models/
│   ├── __init__.py
│   ├── payment.py
│   └── refund.py                 # Tasks 52-56
├── constants.py                  # Task 51
├── services/
│   ├── __init__.py
│   └── refund_service.py         # Tasks 58-64
└── migrations/
    └── 0004_refund.py            # Task 57
```

---

## Notes for AI Agents

### RefundReason Choices
- **RETURN**: Customer returned goods
- **OVERCHARGE**: Customer was overcharged
- **CANCELLED**: Order/invoice cancelled
- **DUPLICATE**: Duplicate payment received
- **OTHER**: Other reason (requires notes)

### Refund Model Fields
- refund_number: Unique identifier (REF-{YEAR}-{SEQ})
- original_payment: FK to Payment
- amount: DecimalField
- reason: Choice field
- reason_notes: TextField
- refund_method: Choice (ORIGINAL, STORE_CREDIT, CASH)
- status: Choice field
- requested_by: FK to User
- requested_at: DateTimeField
- approved_by: FK to User (nullable)
- approved_at: DateTimeField (nullable)
- processed_at: DateTimeField (nullable)
- rejection_reason: TextField (nullable)

### Refund Status Flow
```
                    ┌───────────────┐
                    │    PENDING    │ ← Request created
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                                   │
          ▼                                   ▼
  ┌───────────────┐                   ┌───────────────┐
  │   APPROVED    │                   │   REJECTED    │
  └───────┬───────┘                   └───────────────┘
          │ process()
          ▼
  ┌───────────────┐
  │   PROCESSED   │
  └───────────────┘
```

### Refund Method Options
| Method | Description |
|--------|-------------|
| ORIGINAL | Refund to original payment method |
| STORE_CREDIT | Issue store credit to customer |
| CASH | Cash refund (for card/transfer payments) |

### RefundService Methods
- request_refund(payment_id, amount, reason, user)
- approve_refund(refund_id, user)
- reject_refund(refund_id, reason, user)
- process_refund(refund_id, user)
- process_to_store_credit(refund_id, user)
- validate_refund_amount(payment_id, amount)

### Store Credit Refund Flow
```
Refund Approved: LKR 5,000
       │
       ▼
Customer selects: STORE_CREDIT
       │
       ▼
Create Store Credit:
- customer_id
- amount: 5,000
- source: REFUND
- refund_reference: REF-2026-00001
       │
       ▼
Customer Balance: +5,000
```

### Invoice Update on Refund
```
Original Invoice:
- total: 10,000
- amount_paid: 10,000
- balance_due: 0

After Refund (5,000):
- total: 10,000
- amount_paid: 5,000
- amount_refunded: 5,000
- balance_due: 5,000
```

### Refund Limit Validation
```
max_refundable = original_payment.amount - sum(previous_refunds)
if requested_amount > max_refundable:
    raise ValidationError("Refund exceeds available amount")
```
