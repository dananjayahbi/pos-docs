# Group E: Approval & Posting

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** E of F  
> **Tasks Covered:** 65-80  
> **Group Goal:** Implement accounting periods, approval workflow, and adjusting/reversing entry services

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Templates-Recurring](../Group-D_Templates-Recurring/)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

This group implements fiscal period management, entry approval workflows, and specialized services for adjusting and reversing entries. AccountingPeriod model controls which dates accept new entries. The approval workflow supports threshold-based auto-approval and manager review for larger entries. Adjusting entry services handle month-end accruals and deferrals, while reversing entry services auto-generate reversal entries for the following period.

### Key Outcomes

- AccountingPeriod model with date ranges
- Period status control (OPEN, CLOSED, LOCKED)
- Fiscal year and month tracking
- Approval workflow for journal entries
- Threshold-based auto-approval
- Request approval, approve, reject methods
- AdjustingEntryService for period-end adjustments
- Accrual entry creation method
- Deferral entry creation method
- ReversingEntryService for auto-reversals
- Create reversal method
- Schedule reversal for next period

### Technology Context

- **Periods:** Fiscal calendar management
- **Workflow:** Configurable approval thresholds
- **Adjustments:** GAAP/IFRS compliant adjusting entries
- **Reversals:** Automatic next-period reversal scheduling

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-65-69_Accounting-Period-Model.md` | Create AccountingPeriod model with date range and status | 65-69 |
| 02 | `02_Tasks-70-74_Approval-Workflow.md` | Implement approval workflow with threshold and approval methods | 70-74 |
| 03 | `03_Tasks-75-80_Adjusting-Reversing-Services.md` | Create services for adjusting and reversing entries | 75-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 65 | Create AccountingPeriod Model | Medium | Task 64 |
| 66 | Add Period Date Range | Low | Task 65 |
| 67 | Add Period Status | Low | Task 65 |
| 68 | Add Period Year/Month | Low | Task 65 |
| 69 | Run Period Migrations | Low | Task 68 |
| 70 | Create Approval Workflow | High | Task 69 |
| 71 | Add Approval Threshold | Medium | Task 70 |
| 72 | Add Request Approval Method | Medium | Task 71 |
| 73 | Add Approve Entry Method | Medium | Task 72 |
| 74 | Add Reject Entry Method | Medium | Task 73 |
| 75 | Create Adjusting Entry Service | High | Task 74 |
| 76 | Add Accrual Entry Method | Medium | Task 75 |
| 77 | Add Deferral Entry Method | Medium | Task 76 |
| 78 | Create Reversing Entry Service | High | Task 77 |
| 79 | Add Create Reversal Method | Medium | Task 78 |
| 80 | Add Schedule Reversal Method | Medium | Task 79 |

---

## Execution Order

```
Task 65: Create AccountingPeriod Model
    │
    ├─────────────────────────────┐
    ▼                             ▼
Tasks 66-67: Date & Status   Task 68: Year/Month
    │                             │
    └─────────────┬───────────────┘
                  ▼
             Task 69: Run Migrations
                  │
                  ▼
             Task 70: Create Approval Workflow
                  │
                  ▼
             Task 71: Add Threshold
                  │
                  ▼
             Task 72: Request Approval
                  │
                  ▼
             Task 73: Approve Entry
                  │
                  ▼
             Task 74: Reject Entry
                  │
                  ▼
             Task 75: Create Adjusting Service
                  │
                  ▼
             Task 76: Accrual Method
                  │
                  ▼
             Task 77: Deferral Method
                  │
                  ▼
             Task 78: Create Reversing Service
                  │
                  ▼
             Task 79: Create Reversal
                  │
                  ▼
             Task 80: Schedule Reversal
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   └── accounting_period.py   # AccountingPeriod model
├── services/
│   ├── __init__.py
│   ├── approval_service.py    # Approval workflow
│   ├── adjusting_service.py   # Adjusting entries
│   └── reversing_service.py   # Reversing entries
└── migrations/
    └── 0009_accountingperiod.py
```

---

## Notes for AI Agents

### Accounting Period Status
- OPEN: Accept new entries, allow edits
- CLOSED: No new entries, allow adjustments only
- LOCKED: No changes allowed (post year-end audit)

### Period Lifecycle
```
OPEN → CLOSED → LOCKED
  ↑        │
  └────────┘ (reopen if needed)
```

### Approval Workflow Logic
1. Entry submitted for approval (status = PENDING_APPROVAL)
2. Check total amount against approval_threshold
3. If below threshold: Auto-approve (status = APPROVED)
4. If above threshold: Require manager approval
5. Manager can approve (APPROVED) or reject (back to DRAFT)
6. Approved entries can be posted

### Approval Threshold Configuration
Store in tenant settings or AccountingSettings model:
- auto_approve_threshold: Decimal (e.g., 10000.00)
- require_approval: Boolean (enable/disable workflow)

### Adjusting Entry Types

**Accrual Example (Expense incurred, not yet paid):**
```
DR Salary Expense      10,000.00
    CR Accrued Salaries         10,000.00
```

**Deferral Example (Payment received, not yet earned):**
```
DR Unearned Revenue     5,000.00
    CR Service Revenue          5,000.00
```

### Reversing Entry Logic
Adjusting entries marked for reversal:
1. Create reversal entry dated first day of next period
2. Swap all debits and credits
3. Link reversal_of FK to original
4. Set entry_type = REVERSING
5. Auto-post on period open

### Sri Lanka Fiscal Year
Standard fiscal year: April 1 to March 31
Periods typically:
- April (Month 1) to March (Month 12)
- Some businesses use calendar year (Jan-Dec)
