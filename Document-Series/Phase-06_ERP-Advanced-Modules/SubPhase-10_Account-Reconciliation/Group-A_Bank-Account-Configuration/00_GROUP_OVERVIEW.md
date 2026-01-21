# Group A: Bank Account Configuration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create bank account model with configuration for reconciliation and GL account linking

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Statement-Import](../Group-B_Statement-Import/)

---

## Group Overview

This group establishes the bank account configuration model within the accounting module. Creates BankAccountType enumeration for account classification (Checking, Savings, Credit Card, Cash) and the BankAccount model with bank details, GL account linking, currency settings, and reconciliation tracking fields. Links bank accounts to corresponding Chart of Accounts entries for automatic journal posting.

### Key Outcomes

- Extend accounting app with reconciliation module
- BankAccountType enum (CHECKING, SAVINGS, CREDIT_CARD, CASH)
- BankAccount model with bank identification
- Account name and number fields
- Bank name, branch name, and branch code
- Foreign key to Chart of Accounts (GL account)
- Account type classification field
- Currency field (LKR default)
- Last reconciled date tracking
- Last reconciled balance tracking
- Active/inactive flag

### Technology Context

- **Framework:** Django 5.x with Python 3.12+
- **Relationships:** FK to Account model from Chart of Accounts
- **Currency:** ISO 4217 currency codes
- **Multi-tenancy:** Tenant-isolated bank accounts

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-03_Reconciliation-Module-BankAccount.md` | Extend accounting app and create BankAccount model | 01-03 |
| 02 | `02_Tasks-04-10_Bank-Configuration-Fields.md` | Add bank identification, GL link, type, and currency fields | 04-10 |
| 03 | `03_Tasks-11-14_Reconciliation-Tracking-Migrations.md` | Add reconciliation tracking fields and run migrations | 11-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Extend accounting App | Low | None |
| 02 | Define BankAccountType Enum | Low | Task 01 |
| 03 | Create BankAccount Model | Medium | Task 02 |
| 04 | Add Bank Account Name | Low | Task 03 |
| 05 | Add Bank Account Number | Low | Task 03 |
| 06 | Add Bank Name Field | Low | Task 03 |
| 07 | Add Bank Branch Field | Low | Task 03 |
| 08 | Add GL Account FK | Medium | Task 03 |
| 09 | Add Account Type Field | Low | Task 03 |
| 10 | Add Currency Field | Low | Task 03 |
| 11 | Add Last Reconciled Date | Low | Task 03 |
| 12 | Add Last Reconciled Balance | Low | Task 03 |
| 13 | Add Active Flag | Low | Task 03 |
| 14 | Run BankAccount Migrations | Low | Task 13 |

---

## Execution Order

```
Task 01: Extend accounting App
    │
    ▼
Task 02: Define BankAccountType Enum
    │
    ▼
Task 03: Create BankAccount Model (base)
    │
    ├─────────────────────────────────────────────────┐
    ▼                                                 ▼
Tasks 04-10: Bank Config Fields              Tasks 11-13: Tracking Fields
(name, number, bank, branch, GL, type, currency)  (last reconciled, active)
    │                                                 │
    └─────────────────────┬───────────────────────────┘
                          ▼
                     Task 14: Run Migrations
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py           # Export BankAccount
│   ├── enums.py              # Add BankAccountType enum
│   └── bank_account.py       # BankAccount model
├── migrations/
│   └── 0010_bankaccount.py   # Bank account migration
└── tests/
    └── test_bank_account.py  # Bank account tests
```

---

## Notes for AI Agents

### Bank Account Types
- CHECKING: Standard business checking account
- SAVINGS: Savings/deposit account
- CREDIT_CARD: Credit card account (liability type)
- CASH: Cash register/petty cash (physical cash)

### GL Account Linking
Each BankAccount must link to a corresponding Account in the Chart of Accounts:
- Checking/Savings → Asset accounts (1100-1199)
- Credit Card → Liability accounts (2100-2199)
- Cash → Cash accounts (1100-1110)

### Sri Lanka Banks
Common Sri Lankan banks:
- Bank of Ceylon (BOC)
- People's Bank
- Commercial Bank of Ceylon
- Hatton National Bank (HNB)
- Sampath Bank
- Seylan Bank
- Nations Trust Bank

### Currency Support
- Default: LKR (Sri Lankan Rupee)
- Support for multi-currency accounts (USD, EUR, etc.)
- Currency stored as ISO 4217 3-letter code

### Reconciliation Tracking
- last_reconciled_date: Date of most recent completed reconciliation
- last_reconciled_balance: Balance confirmed at last reconciliation
- Used to calculate opening balance for next reconciliation session
