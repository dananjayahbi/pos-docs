# Group A: Account Type Definitions

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Initialize accounting app and establish account type enumeration system with AccountTypeConfig model

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Account-Model-Hierarchy](../Group-B_Account-Model-Hierarchy/)

---

## Group Overview

This group establishes the foundational accounting app and defines the account type system for double-entry bookkeeping. It creates enumerations for account types (Asset, Liability, Equity, Revenue, Expense), categories, statuses, and normal balance indicators. The AccountTypeConfig model provides system configuration for each account type including code ranges and display order.

### Key Outcomes

- Django accounting app initialized and registered
- AccountType enum defining 5 main types (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
- AccountCategory enum for sub-classifications (CURRENT, NON_CURRENT, OPERATING, etc.)
- AccountStatus enum for lifecycle management (ACTIVE, INACTIVE, ARCHIVED)
- NormalBalance enum for debit/credit increase side
- AccountTypeConfig model with code ranges (1xxx-5xxx)
- JSON fixture for loading 5 main account types
- Management command to load fixtures

### Technology Context

- **Framework:** Django 5.x with Python 3.12+
- **Enums:** Django TextChoices or IntegerChoices
- **Fixtures:** JSON fixtures for type configuration
- **Multi-tenancy:** Registered in TENANT_APPS

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-02_Accounting-App-Setup.md` | Create and register accounting Django app | 01-02 |
| 02 | `02_Tasks-03-06_Account-Enums.md` | Define AccountType, Category, Status, NormalBalance enums | 03-06 |
| 03 | `03_Tasks-07-12_AccountTypeConfig-Model.md` | Create AccountTypeConfig model with all fields | 07-12 |
| 04 | `04_Tasks-13-16_Migrations-Fixtures-Testing.md` | Run migrations, create fixtures, test configuration | 13-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create accounting App | Low | None |
| 02 | Register accounting App | Low | Task 01 |
| 03 | Define AccountType Enum | Low | Task 02 |
| 04 | Define AccountCategory Enum | Low | Task 03 |
| 05 | Define AccountStatus Enum | Low | Task 04 |
| 06 | Define NormalBalance Enum | Low | Task 05 |
| 07 | Create AccountTypeConfig Model | Medium | Task 06 |
| 08 | Add Type Name Field | Low | Task 07 |
| 09 | Add Type Normal Balance | Low | Task 07 |
| 10 | Add Type Code Range | Low | Task 07 |
| 11 | Add Type Display Order | Low | Task 07 |
| 12 | Add Type Description | Low | Task 07 |
| 13 | Run AccountTypeConfig Migrations | Low | Task 12 |
| 14 | Create AccountType Fixture | Medium | Task 13 |
| 15 | Create Load Fixture Command | Medium | Task 14 |
| 16 | Test AccountType Configuration | Medium | Task 15 |

---

## Execution Order

```
Task 01: Create accounting App
    │
    ▼
Task 02: Register accounting App
    │
    ▼
Tasks 03-06: Define Enums (sequential)
    │
    ▼
Task 07: Create AccountTypeConfig Model
    │
    ▼
Tasks 08-12: Add Model Fields (parallel)
    │
    ▼
Task 13: Run Migrations
    │
    ▼
Task 14: Create Fixture
    │
    ▼
Task 15: Create Load Command
    │
    ▼
Task 16: Test Configuration
```

---

## Expected Deliverables

```
apps/accounting/
├── __init__.py
├── apps.py                    # App configuration
├── models/
│   ├── __init__.py
│   ├── enums.py              # AccountType, AccountCategory, AccountStatus, NormalBalance
│   └── account_type.py       # AccountTypeConfig model
├── fixtures/
│   └── account_types.json    # 5 main account types fixture
├── management/
│   └── commands/
│       └── load_account_types.py  # Load fixtures command
└── tests/
    └── test_account_types.py # AccountType tests
```

---

## Notes for AI Agents

### Account Type Code Ranges
- Assets: 1000-1999
- Liabilities: 2000-2999
- Equity: 3000-3999
- Revenue: 4000-4999
- Expenses: 5000-5999

### Normal Balance Rules
- Assets & Expenses: DEBIT (increases with debit)
- Liabilities, Equity & Revenue: CREDIT (increases with credit)

### Fixture Structure
The account_types.json fixture should include all 5 main types with:
- Type code (1-5)
- Name (ASSET, LIABILITY, etc.)
- Normal balance (DEBIT/CREDIT)
- Code range (start/end)
- Display order for reports
- Description

### Multi-tenancy Consideration
AccountTypeConfig may be in public schema if shared across tenants, or in tenant schema if customizable per tenant. Evaluate based on business requirements.
