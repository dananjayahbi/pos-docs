# Group C: Partial & Split Payments

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** C of F  
> **Tasks Covered:** 37-50  
> **Group Goal:** Implement partial payments, split payments, and payment plans

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Payment Recording Services](../Group-B_Payment-Recording-Services/)
- **→ Next Group:** [Group D: Refunds & Adjustments](../Group-D_Refunds-Adjustments/)

---

## Group Overview

### Key Outcomes

1. **Partial Payment** - Record payment less than invoice total
2. **Balance Calculation** - Calculate remaining after partial
3. **Invoice Status Update** - Mark as PARTIAL when partially paid
4. **SplitPayment Model** - Record split payment transactions
5. **Split Payment Components** - Link multiple payments to transaction
6. **Split Payment Recording** - Multiple methods (cash + card)
7. **Split Total Validation** - Ensure components equal total
8. **PaymentPlan Model** - Installment payment plans
9. **Payment Plan Schedule** - Installment dates and amounts
10. **Payment Plan Creation** - Create plan for invoice
11. **Installment Payment** - Record against specific installment
12. **Payment Plan Tracking** - Track paid/pending installments
13. **Payment Plan Reminder** - Celery task for reminders
14. **Partial/Split Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | SplitPayment, PaymentPlan models |
| Service Layer | Payment plan management |
| Celery | Reminder tasks |
| Decimal | Precise calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-37-43_Partial-Split-Payments.md` | 37-43 | Partial payment, balance, status, SplitPayment model, components, recording, validation |
| 02 | `02_Tasks-44-50_Payment-Plans.md` | 44-50 | PaymentPlan model, schedule, creation, installment payment, tracking, reminders, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Implement Partial Payment | Medium | 25 min |
| 38 | Implement Balance Calculation | Medium | 20 min |
| 39 | Update Invoice Payment Status | Medium | 20 min |
| 40 | Create SplitPayment Model | Medium | 25 min |
| 41 | Add Split Payment Components | Medium | 20 min |
| 42 | Implement Split Payment Recording | High | 30 min |
| 43 | Validate Split Payment Totals | Medium | 25 min |
| 44 | Create PaymentPlan Model | Medium | 25 min |
| 45 | Add Payment Plan Schedule | Medium | 25 min |
| 46 | Implement Payment Plan Creation | High | 30 min |
| 47 | Implement Installment Payment | Medium | 25 min |
| 48 | Implement Payment Plan Tracking | Medium | 25 min |
| 49 | Create Payment Plan Reminder Task | Medium | 25 min |
| 50 | Run Partial/Split Payment Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 37-43: Partial and split payment systems]
         │
         ▼
[Tasks 44-50: Payment plan system with reminders]
```

---

## Expected Deliverables

```
apps/payments/
├── models/
│   ├── __init__.py
│   ├── payment.py
│   ├── split_payment.py          # Tasks 40-41
│   └── payment_plan.py           # Tasks 44-45
├── services/
│   ├── __init__.py
│   ├── payment_service.py        # Updated for partial/split
│   └── plan_service.py           # Tasks 46-48
├── tasks/
│   ├── __init__.py
│   └── reminder_tasks.py         # Task 49
└── migrations/
    └── 0003_split_plan.py        # Task 50
```

---

## Notes for AI Agents

### Partial Payment Flow
```
Invoice Total: LKR 10,000
       │
       ▼
Payment 1: LKR 6,000
       │
       ▼
Invoice Status: PARTIAL
Balance Due: LKR 4,000
       │
       ▼
Payment 2: LKR 4,000
       │
       ▼
Invoice Status: PAID
Balance Due: LKR 0
```

### Balance Calculation
```
balance_due = invoice_total 
            - sum(payments) 
            - sum(credit_notes)
            + sum(debit_notes)
```

### SplitPayment Model
- split_payment_number: Unique identifier
- invoice: FK to Invoice
- total_amount: Total payment amount
- created_at: Timestamp
- components: Reverse relation to Payment records

### Split Payment Components
- split_payment: FK to SplitPayment
- payment: OneToOne to Payment
- Each component is a complete Payment record

### Split Payment Example
```
Total: LKR 5,000
       │
       ├─ Component 1: CASH - LKR 3,000
       │
       └─ Component 2: CARD - LKR 2,000
       │
       ▼
Validate: 3,000 + 2,000 = 5,000 ✓
```

### PaymentPlan Model
- invoice: FK to Invoice
- plan_number: Unique identifier (PP-{YEAR}-{SEQ})
- total_amount: Total to be paid
- number_of_installments: Integer
- start_date: First installment date
- frequency: WEEKLY, BIWEEKLY, MONTHLY
- status: ACTIVE, COMPLETED, DEFAULTED, CANCELLED

### PaymentPlanInstallment Model
- payment_plan: FK to PaymentPlan
- installment_number: Integer (1, 2, 3...)
- due_date: Date
- amount: DecimalField
- status: PENDING, PAID, OVERDUE
- payment: FK to Payment (nullable)
- paid_date: Date (nullable)

### Payment Plan Example
```
Invoice: LKR 12,000
Plan: 3 monthly installments
       │
       ├─ Installment 1: LKR 4,000 - Due: 2026-02-01
       ├─ Installment 2: LKR 4,000 - Due: 2026-03-01
       └─ Installment 3: LKR 4,000 - Due: 2026-04-01
```

### Reminder Task Schedule
```
@shared_task
def send_installment_reminders():
    """Daily task to send reminders"""
    upcoming = PaymentPlanInstallment.objects.filter(
        status='PENDING',
        due_date__lte=date.today() + timedelta(days=7)
    )
    for installment in upcoming:
        send_reminder(installment)
```

### Frequency Options
| Frequency | Days Between |
|-----------|--------------|
| WEEKLY | 7 |
| BIWEEKLY | 14 |
| MONTHLY | 30 |
| QUARTERLY | 90 |
