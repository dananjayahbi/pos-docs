# Group B: Account Model & Hierarchy

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create the Account model with django-mptt for hierarchical tree structure and full field implementation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Account-Type-Definitions](../Group-A_Account-Type-Definitions/)
- **→ Next Group:** [Group-C_Default-Chart-Setup](../Group-C_Default-Chart-Setup/)

---

## Group Overview

This group implements the core Account model using django-mptt for efficient hierarchical tree operations. The model supports parent-child relationships enabling nested account structures (e.g., Assets > Current Assets > Cash > Petty Cash). Includes all essential fields for account code, name, type, category, status, currency, and balance tracking.

### Key Outcomes

- django-mptt installed and configured
- Account model with MPTT tree fields (tree_id, level, lft, rght)
- Unique account code field (e.g., 1100, 2100)
- Foreign key to AccountTypeConfig for type classification
- Self-referential parent field for hierarchy
- Header account flag for summary/parent accounts
- System account flag for protected accounts
- Opening balance and current balance fields
- Multi-currency support with optional currency override
- Unique constraints and code range validation

### Technology Context

- **Hierarchy:** django-mptt for Modified Preorder Tree Traversal
- **Database:** PostgreSQL with tenant schema isolation
- **Validation:** Code must fall within type's code range
- **Constraints:** Unique account code per tenant

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-18_MPTT-Account-Model.md` | Install django-mptt and create base Account model | 17-18 |
| 02 | `02_Tasks-19-24_Core-Account-Fields.md` | Add code, name, type FK, category, status, description | 19-24 |
| 03 | `03_Tasks-25-28_Hierarchy-System-Fields.md` | Add parent FK, MPTT config, is_header, is_system flags | 25-28 |
| 04 | `04_Tasks-29-34_Balance-Currency-Constraints.md` | Add currency, balances, timestamps, migrations, constraints | 29-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Install django-mptt | Low | Task 16 |
| 18 | Create Account Model | Medium | Task 17 |
| 19 | Add Account Code Field | Low | Task 18 |
| 20 | Add Account Name Field | Low | Task 18 |
| 21 | Add Account Type FK | Low | Task 18 |
| 22 | Add Account Category | Low | Task 18 |
| 23 | Add Account Status | Low | Task 18 |
| 24 | Add Account Description | Low | Task 18 |
| 25 | Add Account Parent FK | Medium | Task 18 |
| 26 | Configure MPTT Fields | Medium | Task 25 |
| 27 | Add Account Is Header | Low | Task 26 |
| 28 | Add Account Is System | Low | Task 26 |
| 29 | Add Account Currency | Low | Task 26 |
| 30 | Add Account Opening Balance | Low | Task 26 |
| 31 | Add Account Current Balance | Low | Task 26 |
| 32 | Add Account Timestamps | Low | Task 26 |
| 33 | Run Account Migrations | Low | Task 32 |
| 34 | Add Account Model Constraints | Medium | Task 33 |

---

## Execution Order

```
Task 17: Install django-mptt
    │
    ▼
Task 18: Create Account Model (base)
    │
    ├──────────────────────────────┐
    ▼                              ▼
Tasks 19-24: Core Fields      Task 25: Parent FK
(parallel)                         │
    │                              ▼
    │                         Task 26: MPTT Config
    │                              │
    │                    ┌─────────┼─────────┐
    │                    ▼         ▼         ▼
    │               Task 27   Task 28   Tasks 29-32
    │               is_header is_system (parallel)
    │                    │         │         │
    └────────────────────┴─────────┴─────────┘
                         │
                         ▼
                    Task 33: Run Migrations
                         │
                         ▼
                    Task 34: Add Constraints
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py           # Export Account model
│   └── account.py            # Account model with MPTT
├── migrations/
│   └── 0002_account.py       # Account model migration
└── tests/
    └── test_account_model.py # Account model tests

requirements/
└── base.txt                  # django-mptt added
```

---

## Notes for AI Agents

### MPTT Configuration
The Account model must inherit from MPTTModel and include:
- parent = TreeForeignKey to self
- MPTTMeta class with order_insertion_by = ['code']

### Account Code Validation
- Code must be unique within tenant
- Code must fall within type's code range (e.g., Assets: 1000-1999)
- Header accounts typically end in 00 (e.g., 1100, 1200)

### Balance Tracking Strategy
- opening_balance: Set during migration/import
- current_balance: Cached value updated by journal entries
- Balance recalculation on-demand via service

### System Account Protection
Accounts marked is_system=True cannot be:
- Deleted
- Have type changed
- Have code changed
Examples: AR Control, AP Control, Retained Earnings

### Multi-currency Consideration
The optional currency field allows specific accounts to track balances in foreign currencies while most accounts use the tenant's base currency.
