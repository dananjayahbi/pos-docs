# Group F: Employee & Accounting Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** F of G  
> **Tasks Covered:** 73-84  
> **Group Goal:** Create employee management and basic accounting models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Order-Invoice-Models/](../Group-E_Order-Invoice-Models/)
- **→ Next Group:** [../Group-G_Configuration-Verification/](../Group-G_Configuration-Verification/)

---

## Group Overview

This group creates the Employee model for staff management, basic accounting models (Chart of Accounts, Journal Entries), and a tenant-level audit log for activity tracking.

### Key Outcomes
- Employee model created
- Employee user FK (to tenant user)
- Employee role field
- Employee contact fields
- Employee status field
- Account model (chart of accounts)
- Account code field
- Account type field (asset, liability, equity, etc.)
- JournalEntry model
- Entry debit/credit fields
- TenantAuditLog model
- Audit log fields (action, actor, timestamp, details)

### Technology Context
- **Employee Roles:** Admin, manager, cashier, etc.
- **Double-Entry:** Debit and credit accounting
- **Chart of Accounts:** Standard account structure
- **Audit Log:** Track all tenant activities

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-73-77_Employee-Model.md | 73-77 | Employee model, user FK, role, contact, status |
| 02 | 02_Tasks-78-82_Accounting-Models.md | 78-82 | Account model, code, type, JournalEntry, debit/credit |
| 03 | 03_Tasks-83-84_Audit-Log.md | 83-84 | TenantAuditLog model, action, actor, timestamp, details |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 73 | Create Employee Model | Task 11 | Medium |
| 74 | Add Employee User FK | Task 73 | Simple |
| 75 | Add Employee Role Field | Task 73 | Simple |
| 76 | Add Employee Contact Fields | Task 73 | Simple |
| 77 | Add Employee Status Field | Task 73 | Simple |
| 78 | Create Account Model | Task 11 | Medium |
| 79 | Add Account Code Field | Task 78 | Simple |
| 80 | Add Account Type Field | Task 78 | Simple |
| 81 | Create JournalEntry Model | Task 80 | Medium |
| 82 | Add Entry Debit/Credit Fields | Task 81 | Simple |
| 83 | Create TenantAuditLog Model | Task 11 | Medium |
| 84 | Add Audit Log Fields | Task 83 | Simple |

---

## Execution Order

```
01_Tasks-73-77_Employee-Model.md
        │
        ▼
02_Tasks-78-82_Accounting-Models.md
        │
        ▼
03_Tasks-83-84_Audit-Log.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    ├── employees/
    │   ├── models/
    │   │   ├── __init__.py
    │   │   └── employee.py      # Employee model
    │   └── constants.py         # Roles, statuses
    └── accounting/
        ├── models/
        │   ├── __init__.py
        │   ├── account.py       # Account model
        │   ├── journal.py       # JournalEntry model
        │   └── audit.py         # TenantAuditLog model
        └── constants.py         # Account types
```

---

## Employee Roles

| Role | Description |
|------|-------------|
| ADMIN | Full access |
| MANAGER | Management access |
| CASHIER | POS access |
| WAREHOUSE | Inventory access |
| ACCOUNTANT | Accounting access |

---

## Account Types

| Type | Description |
|------|-------------|
| ASSET | Assets (cash, inventory, etc.) |
| LIABILITY | Liabilities (payables, loans) |
| EQUITY | Owner's equity |
| REVENUE | Income accounts |
| EXPENSE | Expense accounts |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete (orders/invoices exist)
2. **User FK:** Link to tenant user (created later)
3. **Double-Entry:** Every entry has debit and credit
4. **Account Codes:** Use standard chart of accounts
5. **Audit Log:** Log all significant actions
6. **Git Commit:** Commit after completing this group

