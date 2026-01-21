# Group A: Payment Model & Methods

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create Payment model with Sri Lanka payment methods support

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Payment Recording Services](../Group-B_Payment-Recording-Services/)

---

## Group Overview

### Key Outcomes

1. **Payments Django App** - New Django app for payments module
2. **App Registration** - Register payments in TENANT_APPS
3. **PaymentMethod Choices** - CASH, CARD, BANK_TRANSFER, MOBILE, CHECK, STORE_CREDIT
4. **PaymentStatus Choices** - PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED
5. **Payment Core Fields** - payment_number, method, status, amount, created_at
6. **Payment Reference Fields** - Invoice FK, Order FK, Customer FK
7. **Payment Date Fields** - payment_date, processed_at, cancelled_at
8. **Payment Currency Fields** - currency (LKR), exchange_rate, base amount
9. **Payment Method Details** - JSONField for card/bank details
10. **Payment Reference Number** - Bank transfer ref, check number
11. **Payment User Fields** - received_by, approved_by
12. **Payment Notes Fields** - notes, internal_notes
13. **Payment Number Generator** - Auto-generation with yearly sequence
14. **PaymentMethod Configuration Model** - Per-tenant method settings
15. **Payment Method Settings** - Enable/disable, limits, fees
16. **Model Indexes** - Database indexes for performance
17. **Model Constraints** - Validation rules
18. **Initial Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Payment model definition |
| PostgreSQL | Indexes and constraints |
| JSONField | Method details storage |
| Sequence Generator | Payment number generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, method/status choices, core fields, references |
| 02 | `02_Tasks-07-12_Date-Currency-Details-User-Notes.md` | 07-12 | Date fields, currency, method details, reference number, user fields, notes |
| 03 | `03_Tasks-13-18_Number-Gen-Config-Index-Migration.md` | 13-18 | Number generator, method config, settings, indexes, constraints, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create payments Django App | Low | 15 min |
| 02 | Register payments App | Low | 10 min |
| 03 | Define PaymentMethod Choices | Low | 15 min |
| 04 | Define PaymentStatus Choices | Low | 15 min |
| 05 | Create Payment Model Core Fields | Medium | 25 min |
| 06 | Add Payment Reference Fields | Medium | 20 min |
| 07 | Add Payment Date Fields | Medium | 20 min |
| 08 | Add Payment Currency Fields | Medium | 20 min |
| 09 | Add Payment Method Details | Medium | 20 min |
| 10 | Add Payment Reference Number | Low | 15 min |
| 11 | Add Payment User Fields | Medium | 20 min |
| 12 | Add Payment Notes Fields | Low | 15 min |
| 13 | Create Payment Number Generator | Medium | 25 min |
| 14 | Create PaymentMethod Configuration Model | Medium | 25 min |
| 15 | Add Payment Method Settings | Medium | 20 min |
| 16 | Create Payment Model Indexes | Medium | 20 min |
| 17 | Create Payment Model Constraints | Medium | 20 min |
| 18 | Run Initial Payment Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-04: Django app setup and choice enums]
         │
         ▼
[Tasks 05-08: Core model fields, references, dates, currency]
         │
         ▼
[Tasks 09-12: Method details, reference number, user, notes]
         │
         ▼
[Tasks 13-18: Number gen, method config, indexes, migrations]
```

---

## Expected Deliverables

```
apps/payments/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   ├── payment.py                # Tasks 05-12, 16-17
│   └── payment_method.py         # Tasks 14-15
├── constants.py                  # Tasks 03-04
├── services/
│   └── number_generator.py       # Task 13
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### PaymentMethod Choices
- **CASH**: Cash payment with amount tendered and change
- **CARD**: Visa/MasterCard with card type, last 4 digits
- **BANK_TRANSFER**: Bank transfer with reference number
- **MOBILE**: Mobile payment (FriMi, etc.) with transaction ID
- **CHECK**: Check payment with check number, bank, date
- **STORE_CREDIT**: Store credit usage from customer balance

### PaymentStatus Choices
- **PENDING**: Payment initiated, not yet processed
- **COMPLETED**: Payment successfully processed
- **FAILED**: Payment processing failed
- **CANCELLED**: Payment cancelled before processing
- **REFUNDED**: Payment has been refunded (full or partial)

### Payment Number Format
```
PAY-{YEAR}-{SEQUENCE}
Example: PAY-2026-00001
```

### Method Details JSONField Structure
| Method | Fields |
|--------|--------|
| CASH | amount_tendered, change_given |
| CARD | card_type, last_four, approval_code |
| BANK_TRANSFER | bank_name, reference_number |
| MOBILE | provider, transaction_id |
| CHECK | check_number, bank_name, check_date |
| STORE_CREDIT | balance_before, balance_after |

### Status Transition Matrix
| From State | Allowed Transitions |
|------------|---------------------|
| PENDING | COMPLETED, FAILED, CANCELLED |
| COMPLETED | REFUNDED |
| FAILED | PENDING (retry) |
| CANCELLED | (terminal) |
| REFUNDED | (terminal) |

### Database Indexes
- payment_number (unique)
- method
- status
- customer_id
- invoice_id
- payment_date
- created_at

### PaymentMethod Configuration
- tenant: FK to Tenant
- method: Choice field
- is_enabled: BooleanField
- min_amount: DecimalField
- max_amount: DecimalField
- processing_fee_type: PERCENTAGE, FIXED
- processing_fee_value: DecimalField
