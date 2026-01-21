# Group D: Reconciliation Workflow

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Create reconciliation session model, track matched pairs, and implement workflow management service

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Matching-Engine](../Group-C_Matching-Engine/)
- **→ Next Group:** [Group-E_Reporting-History](../Group-E_Reporting-History/)

---

## Group Overview

This group implements the reconciliation workflow management. Creates the Reconciliation model for session tracking with bank account and statement linking, balance comparison, and status management. The ReconciliationItem model tracks matched pairs between statement lines and journal entries. The ReconciliationService provides workflow methods for starting, managing, and completing reconciliation sessions.

### Key Outcomes

- ReconciliationStatus enum (IN_PROGRESS, COMPLETED, CANCELLED)
- Reconciliation model for session management
- Bank account and statement foreign keys
- Reconciliation date and period tracking
- Statement balance and book balance fields
- Calculated difference field
- Completion tracking (completed_at, completed_by)
- ReconciliationItem model for match tracking
- Statement line to journal entry linking
- Match type tracking (AUTO, MANUAL)
- ReconciliationService for workflow operations

### Technology Context

- **Workflow:** Session-based reconciliation management
- **Status:** State machine for reconciliation lifecycle
- **Tracking:** Audit trail for matched items
- **Calculation:** Real-time difference computation

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-58_Reconciliation-Model.md` | Create Reconciliation model with session tracking fields | 49-58 |
| 02 | `02_Tasks-59-64_ReconciliationItem-Service.md` | Create ReconciliationItem model and workflow service | 59-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Define ReconciliationStatus Enum | Low | Task 48 |
| 50 | Create Reconciliation Model | Medium | Task 49 |
| 51 | Add Reconciliation Bank FK | Low | Task 50 |
| 52 | Add Reconciliation Statement FK | Low | Task 50 |
| 53 | Add Reconciliation Date Fields | Low | Task 50 |
| 54 | Add Reconciliation Balances | Low | Task 50 |
| 55 | Add Reconciliation Difference | Low | Task 50 |
| 56 | Add Reconciliation Status | Low | Task 50 |
| 57 | Add Completed Fields | Low | Task 50 |
| 58 | Run Reconciliation Migrations | Low | Task 57 |
| 59 | Create ReconciliationItem Model | Medium | Task 58 |
| 60 | Add Item Statement Line FK | Low | Task 59 |
| 61 | Add Item Journal Entry FK | Low | Task 59 |
| 62 | Add Item Match Type | Low | Task 59 |
| 63 | Run ReconciliationItem Migrations | Low | Task 62 |
| 64 | Create Reconciliation Service | High | Task 63 |

---

## Execution Order

```
Task 49: Define ReconciliationStatus Enum
    │
    ▼
Task 50: Create Reconciliation Model (base)
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Tasks 51-55: Session Fields               Tasks 56-57: Status & Completion
(bank FK, statement FK, dates, balances)
    │                                             │
    └─────────────────────┬───────────────────────┘
                          ▼
                     Task 58: Run Migrations
                          │
                          ▼
                     Task 59: Create ReconciliationItem Model
                          │
                          ├─────────────────────────────┐
                          ▼                             ▼
                     Tasks 60-61: FK Fields       Task 62: Match Type
                          │                             │
                          └─────────────┬───────────────┘
                                        ▼
                                   Task 63: Run Migrations
                                        │
                                        ▼
                                   Task 64: Create Service
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   ├── enums.py                 # Add ReconciliationStatus
│   ├── reconciliation.py        # Reconciliation model
│   └── reconciliation_item.py   # ReconciliationItem model
├── services/
│   └── reconciliation_service.py # Workflow service
├── migrations/
│   ├── 0015_reconciliation.py
│   └── 0016_reconciliationitem.py
└── tests/
    └── test_reconciliation.py   # Workflow tests
```

---

## Notes for AI Agents

### Reconciliation Status Lifecycle
```
IN_PROGRESS → COMPLETED
      │
      └───→ CANCELLED
```

### Reconciliation Session Fields
- bank_account: FK to BankAccount being reconciled
- statement: FK to imported BankStatement
- reconciliation_date: Date of reconciliation
- period_start, period_end: Statement period
- statement_balance: Balance per bank statement
- book_balance: Balance per GL account
- difference: Calculated = statement_balance - book_balance
- status: Current workflow status
- completed_at, completed_by: Completion metadata
- created_at, created_by: Creation metadata

### ReconciliationItem Fields
- reconciliation: FK to parent Reconciliation
- statement_line: FK to StatementLine
- journal_entry: FK to JournalEntry (or JournalEntryLine)
- match_type: AUTO (system matched) or MANUAL (user matched)
- matched_at: Timestamp of match
- matched_by: User who matched (null for AUTO)

### Reconciliation Calculation
```
Statement Balance (closing per bank)
+ Deposits in Transit (in books, not in statement)
- Outstanding Checks (in books, not cleared)
= Adjusted Bank Balance

Book Balance (per GL account)
+/- Adjustments (bank charges, interest, errors)
= Adjusted Book Balance

Difference = Adjusted Bank Balance - Adjusted Book Balance
(Should be 0 for successful reconciliation)
```

### Workflow Service Methods
- start_reconciliation(bank_account, statement): Create session
- match_items(statement_line, journal_entry): Manual match
- unmatch_items(reconciliation_item): Remove match
- calculate_difference(): Recalculate balance difference
- complete_reconciliation(): Finalize and lock
- cancel_reconciliation(): Cancel session
