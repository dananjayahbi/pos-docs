# Group B: Credit Transactions & Aging

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement credit transactions, aging buckets, and automated reminders

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Credit Limit & Configuration](../Group-A_Credit-Limit-Configuration/)
- **→ Next Group:** [Group C: Loyalty Points System](../Group-C_Loyalty-Points-System/)

---

## Group Overview

### Key Outcomes

1. **CreditTransaction Model** - Credit usage and payment transactions
2. **TransactionType Choices** - CREDIT_PURCHASE, PAYMENT, ADJUSTMENT, INTEREST, WRITE_OFF
3. **Transaction Fields** - type, amount, balance_after, reference_id
4. **Transaction Date Fields** - transaction_date, due_date, paid_date
5. **Transaction Migrations** - Apply migrations
6. **CreditService Class** - Main service for credit operations
7. **Credit Purchase** - Record purchase, reduce available credit
8. **Credit Payment** - Record payment, increase available credit
9. **Credit Limit Check** - Validate against available credit
10. **Credit Balance Calculator** - Calculate outstanding from transactions
11. **Aging Buckets Calculator** - Current, 30, 60, 90, 90+ days
12. **Customer Credit Statement** - Generate statement with transactions
13. **Interest Calculation** - Calculate interest on overdue
14. **Payment Reminder Task** - Celery task for due reminders
15. **Overdue Alert Task** - Celery task for overdue notifications
16. **Credit Suspension** - Auto-suspend on excessive late payments

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Transaction model |
| Service Layer | Business logic |
| Celery | Async reminder tasks |
| PostgreSQL | Date calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-21_Transaction-Model.md` | 17-21 | CreditTransaction model, types, fields, dates, migrations |
| 02 | `02_Tasks-22-27_Service-Aging.md` | 22-27 | CreditService, purchase/payment, limit check, balance, aging |
| 03 | `03_Tasks-28-32_Statements-Reminders-Suspension.md` | 28-32 | Statement, interest, reminders, alerts, suspension |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create CreditTransaction Model | Medium | 25 min |
| 18 | Define TransactionType Choices | Low | 15 min |
| 19 | Add Transaction Fields | Medium | 20 min |
| 20 | Add Transaction Date Fields | Medium | 20 min |
| 21 | Run Transaction Migrations | Low | 15 min |
| 22 | Create CreditService Class | High | 30 min |
| 23 | Implement Credit Purchase | Medium | 25 min |
| 24 | Implement Credit Payment | Medium | 25 min |
| 25 | Implement Credit Limit Check | Medium | 20 min |
| 26 | Implement Credit Balance Calculator | Medium | 25 min |
| 27 | Create Aging Buckets Calculator | High | 30 min |
| 28 | Create Customer Credit Statement | High | 30 min |
| 29 | Implement Interest Calculation | Medium | 25 min |
| 30 | Create Payment Reminder Task | Medium | 25 min |
| 31 | Create Overdue Alert Task | Medium | 25 min |
| 32 | Implement Credit Suspension | Medium | 25 min |

---

## Execution Order

```
[Tasks 17-21: CreditTransaction model setup]
         │
         ▼
[Tasks 22-27: CreditService and aging]
         │
         ▼
[Tasks 28-32: Statements, reminders, suspension]
```

---

## Expected Deliverables

```
apps/credit/
├── models/
│   ├── __init__.py
│   └── credit_transaction.py     # Tasks 17-20
├── services/
│   ├── __init__.py
│   └── credit_service.py         # Tasks 22-29
├── tasks/
│   ├── __init__.py
│   └── reminder_tasks.py         # Tasks 30-32
└── migrations/
    └── 0003_transaction.py       # Task 21
```

---

## Notes for AI Agents

### TransactionType Choices
- **CREDIT_PURCHASE**: Purchase using credit
- **PAYMENT**: Payment received
- **ADJUSTMENT**: Manual adjustment
- **INTEREST**: Interest charge
- **WRITE_OFF**: Bad debt write-off

### CreditTransaction Fields
- credit_account: FK to CustomerCredit
- transaction_type: Choice field
- amount: Decimal (positive)
- balance_after: Decimal (running balance)
- reference_type: Order, Invoice, Payment
- reference_id: UUID of reference
- transaction_date: DateTime
- due_date: Date (for purchases)
- paid_date: Date (for payments)
- notes: TextField

### Aging Buckets
| Bucket | Days Overdue | Description |
|--------|--------------|-------------|
| Current | 0 | Not yet due |
| 1-30 | 1-30 | Slightly overdue |
| 31-60 | 31-60 | Moderately overdue |
| 61-90 | 61-90 | Significantly overdue |
| 90+ | >90 | Severely overdue |

### Aging Response Format
```json
{
  "customer_id": "uuid",
  "total_outstanding": 50000,
  "aging": {
    "current": 20000,
    "days_1_30": 15000,
    "days_31_60": 10000,
    "days_61_90": 5000,
    "days_90_plus": 0
  }
}
```

### Credit Statement
```json
{
  "customer": "Customer Name",
  "statement_date": "2026-01-31",
  "opening_balance": 0,
  "transactions": [
    {"date": "2026-01-05", "type": "CREDIT_PURCHASE", "amount": 10000, "balance": 10000},
    {"date": "2026-01-15", "type": "PAYMENT", "amount": -5000, "balance": 5000}
  ],
  "closing_balance": 5000
}
```

### Interest Calculation
```
Monthly Interest = (Outstanding Balance) × (Monthly Rate / 100)
Daily Interest = Monthly Interest / 30

Example:
Outstanding: Rs. 50,000
Monthly Rate: 2%
Monthly Interest = 50,000 × 0.02 = Rs. 1,000
```

### Payment Reminder Schedule
| Days Before Due | Action |
|-----------------|--------|
| 7 days | First reminder email |
| 3 days | Second reminder email |
| 1 day | Final reminder |
| Due date | Payment due notification |

### Auto-Suspension Rules
- 3 consecutive late payments → Warning
- 5 consecutive late payments → Auto-suspend
- Outstanding > credit limit → Auto-suspend
- 90+ days overdue → Auto-suspend
