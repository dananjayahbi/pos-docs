# Group D: Account Management Features

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement COA fixtures, templates, initialization services, balance calculation, and validation logic

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Default-Chart-Setup](../Group-C_Default-Chart-Setup/)
- **→ Next Group:** [Group-E_Admin-Serializers](../Group-E_Admin-Serializers/)

---

## Group Overview

This group implements the business logic and services for chart of accounts management. Includes COA fixtures for default accounts, template models for industry-specific variations (Retail, Service), initialization services for tenant setup, balance calculation services for real-time account balances, and comprehensive validators for account operations. Supports archive functionality for soft deletion.

### Key Outcomes

- Default COA JSON fixture with all standard accounts
- COATemplate model for industry-specific templates
- COAInitializer service for tenant account setup
- Template-based and default initialization methods
- AccountBalanceService for balance calculations
- Balance update and child balance aggregation
- AccountValidator for business rule enforcement
- Code range validation within account type
- Deletion prevention for accounts with transactions
- Soft archive functionality instead of hard delete

### Technology Context

- **Fixtures:** JSON fixtures for data loading
- **Services:** Service layer pattern for business logic
- **Validation:** Custom validators for business rules
- **Archival:** Soft delete with ARCHIVED status

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-55_COA-Fixtures-Templates.md` | Create default COA fixture and COATemplate model | 51-55 |
| 02 | `02_Tasks-56-58_COA-Initializer-Service.md` | Implement COAInitializer with template and default methods | 56-58 |
| 03 | `03_Tasks-59-62_Balance-Service.md` | Create AccountBalanceService for balance calculations | 59-62 |
| 04 | `04_Tasks-63-66_Validators-Archive.md` | Implement AccountValidator and archive functionality | 63-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Default COA Fixture | Medium | Task 50 |
| 52 | Create COA Template Model | Medium | Task 51 |
| 53 | Add Template Name Field | Low | Task 52 |
| 54 | Add Template Accounts JSON | Low | Task 52 |
| 55 | Run Template Migrations | Low | Task 54 |
| 56 | Create COA Initializer Service | High | Task 55 |
| 57 | Add Create From Template Method | Medium | Task 56 |
| 58 | Add Create Default Method | Medium | Task 56 |
| 59 | Create Account Balance Service | High | Task 58 |
| 60 | Add Calculate Balance Method | Medium | Task 59 |
| 61 | Add Update Balance Method | Medium | Task 60 |
| 62 | Add Get Children Balances | Medium | Task 61 |
| 63 | Create Account Validator | Medium | Task 62 |
| 64 | Add Code Range Validation | Low | Task 63 |
| 65 | Add Deletion Validation | Medium | Task 64 |
| 66 | Add Archive Functionality | Low | Task 65 |

---

## Execution Order

```
Task 51: Create Default COA Fixture
    │
    ▼
Task 52: Create COA Template Model
    │
    ├──────────────┐
    ▼              ▼
Task 53        Task 54
(name field)   (accounts JSON)
    │              │
    └──────┬───────┘
           ▼
      Task 55: Run Migrations
           │
           ▼
      Task 56: Create COA Initializer Service
           │
           ├──────────────┐
           ▼              ▼
      Task 57          Task 58
      (from template)  (default)
           │              │
           └──────┬───────┘
                  ▼
             Task 59: Create Balance Service
                  │
                  ▼
             Task 60: Calculate Balance
                  │
                  ▼
             Task 61: Update Balance
                  │
                  ▼
             Task 62: Children Balances
                  │
                  ▼
             Task 63: Create Validator
                  │
                  ▼
             Task 64: Code Range Validation
                  │
                  ▼
             Task 65: Deletion Validation
                  │
                  ▼
             Task 66: Archive Functionality
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   └── coa_template.py       # COATemplate model
├── fixtures/
│   ├── account_types.json    # From Group A
│   └── default_coa.json      # Complete default COA
├── services/
│   ├── __init__.py
│   ├── coa_initializer.py    # COA initialization service
│   ├── balance_service.py    # Balance calculation service
│   └── validators.py         # Account validators
└── migrations/
    └── 0003_coatemplate.py   # Template model migration
```

---

## Notes for AI Agents

### COATemplate Model Structure
- name: Template name (e.g., "Retail Business", "Service Company")
- description: Template description
- industry: Industry category
- accounts: JSONField containing account definitions
- is_active: Boolean for template availability

### COA Initializer Service Methods
```
COAInitializerService:
├── initialize_from_template(tenant, template_id)
│   └── Creates accounts from template JSON
├── initialize_default(tenant)
│   └── Creates accounts from default_coa.json fixture
└── _create_account_tree(accounts_data)
    └── Recursively creates hierarchical accounts
```

### Balance Calculation Logic
- DEBIT normal balance: Balance = Opening + Debits - Credits
- CREDIT normal balance: Balance = Opening + Credits - Debits
- Parent balance = Sum of all child balances

### Account Validator Rules
1. Code must be within type's code range (e.g., Assets: 1000-1999)
2. Code must be unique within tenant
3. Cannot delete account with existing journal entries
4. Cannot change type if account has transactions
5. System accounts cannot be deleted

### Archive vs Delete
When users "delete" an account:
1. Check for existing transactions
2. If transactions exist: Set status = ARCHIVED
3. If no transactions: Hard delete allowed
4. Archived accounts hidden from selections but visible in historical reports
