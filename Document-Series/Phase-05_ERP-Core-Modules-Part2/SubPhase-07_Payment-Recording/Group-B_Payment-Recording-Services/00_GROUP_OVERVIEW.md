# Group B: Payment Recording Services

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** B of F  
> **Tasks Covered:** 19-36  
> **Group Goal:** Implement payment recording services for all payment methods

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Payment Model & Methods](../Group-A_Payment-Model-Methods/)
- **→ Next Group:** [Group C: Partial & Split Payments](../Group-C_Partial-Split-Payments/)

---

## Group Overview

### Key Outcomes

1. **PaymentService Class** - Main service for payment operations
2. **Cash Payment Recording** - Record with amount tendered, change
3. **Card Payment Recording** - Record with card type, last 4
4. **Bank Transfer Recording** - Record with bank name, reference
5. **Mobile Payment Recording** - Record FriMi etc. with transaction ID
6. **Check Payment Recording** - Record with check number, dated check
7. **Store Credit Payment** - Record and deduct from balance
8. **Payment Validation** - Validate amount, method, limits
9. **Invoice Payment Allocation** - Allocate to invoice, update balance
10. **Order Payment Recording** - Record against order
11. **Payment Status Updates** - Complete, fail, cancel
12. **PaymentAllocation Model** - Multi-invoice allocation
13. **Multi-Invoice Payment** - Single payment to multiple invoices
14. **PaymentHistory Model** - Audit trail
15. **History Logging** - Log actions with user, timestamp
16. **PaymentSettings Model** - Tenant configuration
17. **Processing Fee Calculator** - Card/mobile fees
18. **Service Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic encapsulation |
| Django ORM | Payment allocation models |
| Django Signals | History logging |
| Decimal | Precise financial calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-25_Service-Method-Recording.md` | 19-25 | PaymentService, cash, card, bank, mobile, check, store credit |
| 02 | `02_Tasks-26-31_Validation-Allocation-Order.md` | 26-31 | Validation, invoice allocation, order payment, status updates, allocation model, multi-invoice |
| 03 | `03_Tasks-32-36_History-Settings-Fees-Migration.md` | 32-36 | PaymentHistory, logging, settings, fee calculator, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create PaymentService Class | High | 30 min |
| 20 | Implement Cash Payment Recording | Medium | 20 min |
| 21 | Implement Card Payment Recording | Medium | 20 min |
| 22 | Implement Bank Transfer Recording | Medium | 20 min |
| 23 | Implement Mobile Payment Recording | Medium | 20 min |
| 24 | Implement Check Payment Recording | Medium | 20 min |
| 25 | Implement Store Credit Payment | Medium | 25 min |
| 26 | Implement Payment Validation | Medium | 25 min |
| 27 | Implement Invoice Payment Allocation | High | 30 min |
| 28 | Implement Order Payment Recording | Medium | 25 min |
| 29 | Implement Payment Status Updates | Medium | 25 min |
| 30 | Create PaymentAllocation Model | Medium | 25 min |
| 31 | Implement Multi-Invoice Payment | High | 30 min |
| 32 | Create PaymentHistory Model | Medium | 25 min |
| 33 | Implement History Logging | Medium | 25 min |
| 34 | Create PaymentSettings Model | Medium | 25 min |
| 35 | Implement Processing Fee Calculator | Medium | 25 min |
| 36 | Run Payment Service Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 19-25: PaymentService with method-specific recording]
         │
         ▼
[Tasks 26-31: Validation, allocation, status updates]
         │
         ▼
[Tasks 32-36: History, settings, fees, migrations]
```

---

## Expected Deliverables

```
apps/payments/
├── models/
│   ├── __init__.py
│   ├── payment.py
│   ├── payment_allocation.py     # Task 30
│   ├── payment_history.py        # Task 32
│   └── payment_settings.py       # Task 34
├── services/
│   ├── __init__.py
│   ├── payment_service.py        # Tasks 19-29
│   ├── allocation_service.py     # Task 31
│   └── fee_calculator.py         # Task 35
└── migrations/
    └── 0002_allocation_history.py # Task 36
```

---

## Notes for AI Agents

### PaymentService Methods
- record_cash_payment(invoice_id, amount, amount_tendered, user)
- record_card_payment(invoice_id, amount, card_details, user)
- record_bank_transfer(invoice_id, amount, bank_details, user)
- record_mobile_payment(invoice_id, amount, mobile_details, user)
- record_check_payment(invoice_id, amount, check_details, user)
- record_store_credit(invoice_id, amount, customer_id, user)
- validate_payment(amount, method, tenant)
- allocate_to_invoice(payment_id, invoice_id, amount)
- complete_payment(payment_id, user)
- fail_payment(payment_id, reason, user)
- cancel_payment(payment_id, reason, user)

### Cash Payment Flow
```
Customer presents LKR 5,000
       │
       ▼
Invoice total: LKR 4,750
       │
       ▼
Record Payment:
- amount: 4,750
- amount_tendered: 5,000
- change_given: 250
       │
       ▼
Update Invoice: PAID
```

### PaymentAllocation Model
- payment: FK to Payment
- invoice: FK to Invoice
- amount_allocated: DecimalField
- allocated_at: DateTimeField

### Multi-Invoice Payment Flow
```
Payment: LKR 10,000
       │
       ├─ Invoice #1 (LKR 6,000) → Allocate 6,000 → PAID
       │
       └─ Invoice #2 (LKR 4,000) → Allocate 4,000 → PAID
```

### PaymentHistory Event Types
- CREATED, COMPLETED, FAILED
- CANCELLED, REFUNDED
- ALLOCATED, REALLOCATED
- STATUS_CHANGED

### PaymentSettings Fields
- tenant: OneToOne to Tenant
- default_payment_method: Choice
- require_approval_above: DecimalField
- allow_partial_payments: BooleanField
- allow_split_payments: BooleanField
- allow_dated_checks: BooleanField
- check_clearing_days: IntegerField

### Processing Fee Calculation
```
if method == CARD:
    fee = amount * (card_fee_percentage / 100)
elif method == MOBILE:
    fee = amount * (mobile_fee_percentage / 100)
else:
    fee = 0
```
