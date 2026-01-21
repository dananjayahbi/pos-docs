# Group D: Payment Recording & Scheduling

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** D of F  
> **Tasks Covered:** 49-66  
> **Group Goal:** Implement vendor payment recording with multiple methods and scheduling

---

## Navigation

- **↑ Parent:** [SubPhase-12 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Bill Services & Processing](../Group-C_Bill-Services-Processing/)
- **→ Next Group:** [Group E: Statements, Reports & Aging](../Group-E_Statements-Reports-Aging/)

---

## Group Overview

### Key Outcomes

1. **VendorPayment Model** - Model for vendor payment records
2. **Payment Core Fields** - payment_number, amount, payment_date
3. **Payment Method Fields** - BANK_TRANSFER, CHECK, CASH, ONLINE
4. **Payment Reference Fields** - reference_number, check_number, transaction_id
5. **Payment Bill FK** - vendor_bill FK for linked payment
6. **Payment Vendor FK** - vendor FK for advance payments
7. **Payment Bank Fields** - bank_account, from_account, to_account
8. **Payment Status Field** - PENDING, COMPLETED, FAILED, REVERSED
9. **Payment Number Generator** - Auto-generate PAY-{YEAR}-{SEQUENCE}
10. **VendorPayment Migrations** - Apply migrations
11. **PaymentService Class** - Service for payment operations
12. **Full Payment** - Record full payment, mark bill PAID
13. **Partial Payment** - Record partial, update amount_paid, amount_due
14. **Multi-Bill Payment** - Single payment for multiple bills
15. **Advance Payment** - Payment before bill (vendor credit)
16. **PaymentSchedule Model** - Model for scheduled future payments
17. **Payment Reminder Task** - Celery task for upcoming due dates
18. **Payment Service Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | VendorPayment, PaymentSchedule models |
| Service Layer | Payment operations |
| Celery | Reminder tasks |
| Decimal | Payment precision |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-49-58_Payment-Model.md` | 49-58 | VendorPayment model, all fields, migrations |
| 02 | `02_Tasks-59-66_Payment-Service-Schedule.md` | 59-66 | PaymentService, full/partial/multi-bill, advance, schedule, reminder |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create VendorPayment Model | Medium | 25 min |
| 50 | Add Payment Core Fields | Medium | 20 min |
| 51 | Add Payment Method Fields | Medium | 20 min |
| 52 | Add Payment Reference Fields | Medium | 20 min |
| 53 | Add Payment Bill FK | Medium | 15 min |
| 54 | Add Payment Vendor FK | Medium | 15 min |
| 55 | Add Payment Bank Fields | Medium | 20 min |
| 56 | Add Payment Status Field | Low | 15 min |
| 57 | Create Payment Number Generator | Medium | 25 min |
| 58 | Run VendorPayment Migrations | Low | 15 min |
| 59 | Create PaymentService Class | High | 30 min |
| 60 | Implement Full Payment | Medium | 25 min |
| 61 | Implement Partial Payment | Medium | 25 min |
| 62 | Implement Multi-Bill Payment | High | 30 min |
| 63 | Implement Advance Payment | Medium | 25 min |
| 64 | Create PaymentSchedule Model | Medium | 25 min |
| 65 | Implement Payment Reminder Task | Medium | 25 min |
| 66 | Run Payment Service Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 49-58: VendorPayment model and fields]
         │
         ▼
[Tasks 59-66: PaymentService, schedule, reminders]
```

---

## Expected Deliverables

```
apps/vendor_bills/
├── models/
│   ├── __init__.py
│   ├── vendor_payment.py         # Tasks 49-57
│   └── payment_schedule.py       # Task 64
├── services/
│   ├── __init__.py
│   └── payment_service.py        # Tasks 59-63
├── tasks/
│   ├── __init__.py
│   └── reminder_tasks.py         # Task 65
└── migrations/
    ├── 0005_payment.py           # Task 58
    └── 0006_schedule.py          # Task 66
```

---

## Notes for AI Agents

### Payment Number Format
```
PAY-{YEAR}-{SEQUENCE}
Example: PAY-2026-00001

Sequence resets annually.
```

### VendorPayment Fields
- payment_number: CharField (unique, auto-generated)
- vendor: FK to Vendor
- vendor_bill: FK to VendorBill (nullable for advance)
- amount: Decimal
- payment_date: Date
- payment_method: Choice field
- reference_number: CharField
- check_number: CharField (for check payments)
- transaction_id: CharField (for online payments)
- from_account: CharField (company bank account)
- to_account: CharField (vendor bank account)
- status: Choice field
- notes: TextField
- created_by: FK to User
- created_at: DateTime

### Payment Method Choices
- **BANK_TRANSFER**: Direct bank transfer
- **CHECK**: Payment by check
- **CASH**: Cash payment
- **ONLINE**: Online payment gateway

### Payment Status Choices
- **PENDING**: Payment initiated
- **COMPLETED**: Payment confirmed
- **FAILED**: Payment failed
- **REVERSED**: Payment reversed/returned

### PaymentService Methods
- record_payment(bill_id, amount, method, data, user)
- record_full_payment(bill_id, method, data, user)
- record_partial_payment(bill_id, amount, method, data, user)
- pay_multiple_bills(bill_ids, total_amount, method, data, user)
- record_advance(vendor_id, amount, method, data, user)
- apply_advance_to_bill(advance_id, bill_id, amount, user)
- reverse_payment(payment_id, reason, user)
- get_vendor_balance(vendor_id)

### Full Payment Flow
```
1. Validate bill is APPROVED or PARTIAL_PAID
2. Create VendorPayment record
3. Update bill.amount_paid
4. Update bill.amount_due (should be 0)
5. Change bill status to PAID
6. Log in BillHistory
```

### Partial Payment Flow
```
1. Validate bill is APPROVED or PARTIAL_PAID
2. Validate amount <= bill.amount_due
3. Create VendorPayment record
4. Update bill.amount_paid
5. Update bill.amount_due
6. If amount_due > 0: status = PARTIAL_PAID
7. If amount_due = 0: status = PAID
8. Log in BillHistory
```

### Multi-Bill Payment
```
Given: Bills [BILL-001, BILL-002, BILL-003]
Total Due: Rs. 100,000 + 50,000 + 30,000 = Rs. 180,000
Payment: Rs. 180,000

Process:
1. Create single VendorPayment (Rs. 180,000)
2. Create PaymentAllocation for each bill
3. Mark all bills as PAID
```

### PaymentSchedule Fields
- vendor_bill: FK to VendorBill
- scheduled_date: Date
- amount: Decimal
- status: Choice (PENDING, PAID, CANCELLED)
- reminder_sent: Boolean
- reminder_sent_at: DateTime
- notes: TextField

### Payment Reminder Schedule
| Days Before Due | Action |
|-----------------|--------|
| 7 days | "Payment due in 1 week" |
| 3 days | "Payment due in 3 days" |
| 1 day | "Payment due tomorrow" |
| 0 (due date) | "Payment due today" |
| -1 day | "Payment overdue by 1 day" |
