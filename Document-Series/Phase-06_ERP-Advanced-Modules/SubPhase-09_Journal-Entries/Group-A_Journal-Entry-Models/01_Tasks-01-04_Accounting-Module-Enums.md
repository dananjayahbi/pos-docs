# Tasks 01-04: Accounting Module and Enumerations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** A - Journal Entry Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-05-12_JournalEntry-Core-Fields.md](02_Tasks-05-12_JournalEntry-Core-Fields.md)

---

## Document Overview

This document covers the extension of the accounting application to support journal entries and the definition of all required enumerations. These enumerations provide type-safe categorization for journal entry types, statuses, and sources, establishing a foundation for double-entry bookkeeping.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Extend accounting App | Low | 10 min |
| 02 | Define JournalEntryType Enum | Low | 15 min |
| 03 | Define JournalEntryStatus Enum | Low | 15 min |
| 04 | Define JournalSource Enum | Low | 15 min |

---

## Task 01: Extend Accounting App

### Overview
Extend the existing accounting application structure to accommodate journal entry functionality. This involves creating the necessary directory structure and module files to organize journal entry models, enumerations, and related components.

### Dependencies
- Accounting application (`apps/accounting/`) must exist
- Django project structure is established

### Instructions

1. **Verify accounting app structure**
   - Navigate to `apps/accounting/` directory
   - Confirm existing models structure is in place
   - Identify current enum definitions location

2. **Review existing enums.py**
   - Open `apps/accounting/models/enums.py` if it exists
   - Review current enumeration patterns
   - Note the structure for consistency

3. **Plan journal entry integration**
   - Determine where journal entry models will reside
   - Plan enum additions to existing enums.py
   - Consider migration strategy

4. **Prepare models directory**
   - Ensure `apps/accounting/models/` directory exists
   - Confirm `__init__.py` is present
   - Note existing model imports for pattern consistency

5. **Document integration points**
   - List existing accounting models
   - Identify relationships with journal entries
   - Note foreign key connections needed

### Integration Context

The accounting app should have the following structure:

```
apps/accounting/
├── models/
│   ├── __init__.py           # Model exports
│   ├── enums.py              # Existing + new enums
│   ├── account.py            # Chart of Accounts
│   ├── fiscal_period.py      # Fiscal period model
│   └── journal_entry.py      # New: Journal entry model
├── migrations/
│   └── [existing migrations]
└── tests/
    └── [existing tests]
```

### Relationship Overview

| Existing Model | Relationship to Journal Entry |
|----------------|-------------------------------|
| Account | JournalEntry lines debit/credit accounts |
| FiscalPeriod | JournalEntry must be within open period |
| User (auth) | JournalEntry tracks created_by and posted_by |

### Expected Outcome
- Clear understanding of accounting app structure
- Plan for integrating journal entry functionality
- Consistent directory organization
- Foundation for adding enumerations

### Verification Checklist
- [ ] `apps/accounting/models/` directory exists
- [ ] `models/__init__.py` file present
- [ ] `models/enums.py` file present or will be created
- [ ] Existing model structure reviewed
- [ ] Integration points identified

---

## Task 02: Define JournalEntryType Enum

### Overview
Define the JournalEntryType enumeration to categorize journal entries based on their creation origin and purpose. This enum distinguishes between manually created entries, automatically generated entries, period-end adjusting entries, and reversing entries.

### Dependencies
- Task 01: Extend accounting App

### Instructions

1. **Open or create enums.py file**
   - Navigate to `apps/accounting/models/enums.py`
   - If file doesn't exist, create it with module docstring
   - Import Django TextChoices

2. **Add module imports**
   - Import `from django.db import models`
   - Ensure TextChoices is available
   - Add comprehensive module docstring

3. **Define JournalEntryType class**
   - Create class inheriting from `models.TextChoices`
   - Add class docstring explaining purpose
   - Follow Django enumeration patterns

4. **Add MANUAL entry type**
   - Value: 'MANUAL'
   - Label: 'Manual Entry'
   - Purpose: User-created journal entries

5. **Add AUTO entry type**
   - Value: 'AUTO'
   - Label: 'Auto-Generated'
   - Purpose: System-generated from transactions

6. **Add ADJUSTING entry type**
   - Value: 'ADJUSTING'
   - Label: 'Adjusting Entry'
   - Purpose: Period-end adjustments

7. **Add REVERSING entry type**
   - Value: 'REVERSING'
   - Label: 'Reversing Entry'
   - Purpose: Auto-reversal of adjusting entries

### Entry Type Definitions

| Type | Value | Label | Description | Use Case |
|------|-------|-------|-------------|----------|
| MANUAL | 'MANUAL' | Manual Entry | User-created entries | Corrections, manual adjustments |
| AUTO | 'AUTO' | Auto-Generated | System-generated | Sales, purchases, payroll |
| ADJUSTING | 'ADJUSTING' | Adjusting Entry | Period-end adjustments | Accruals, deferrals, provisions |
| REVERSING | 'REVERSING' | Reversing Entry | Auto-reversal | Reverse adjusting entries |

### Entry Type Usage Scenarios

#### MANUAL Entries
Used when accountants need to:
- Record manual corrections
- Enter bank charges not in statements
- Record write-offs
- Make manual adjustments
- Create opening balances
- Record non-standard transactions

#### AUTO Entries
Automatically generated from:
- Sales invoice posting
- Purchase bill posting
- Payment processing
- Payroll journal entries
- Inventory cost adjustments
- Tax calculations

#### ADJUSTING Entries
Created during period-end close for:
- Accrued expenses (utilities, salaries)
- Prepaid expenses allocation
- Depreciation recording
- Provision for bad debts
- Inventory valuation adjustments
- Unearned revenue recognition

#### REVERSING Entries
Automatically created to reverse:
- Accrued expenses at period start
- Prepayment adjustments
- Temporary provisions
- Year-end adjusting entries
- Ensures automatic correction in new period

### Entry Type Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Journal Entry Types                    │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┬──────────────┐
                │           │           │              │
                ▼           ▼           ▼              ▼
         ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
         │  MANUAL  │ │  AUTO   │ │ADJUSTING │ │REVERSING │
         └──────────┘ └─────────┘ └──────────┘ └──────────┘
              │            │            │             │
              ▼            ▼            ▼             ▼
      User Creates   From Business  Period-End   Auto-Created
       Direct Entry   Transactions   Close        at Period Start
```

### Expected Outcome
- Type-safe journal entry categorization
- Clear distinction between entry origins
- Support for various accounting workflows
- Foundation for validation rules

### Verification Checklist
- [ ] JournalEntryType class defined
- [ ] MANUAL type added with value and label
- [ ] AUTO type added with value and label
- [ ] ADJUSTING type added with value and label
- [ ] REVERSING type added with value and label
- [ ] Class docstring added
- [ ] Follows Django TextChoices pattern

---

## Task 03: Define JournalEntryStatus Enum

### Overview
Define the JournalEntryStatus enumeration to track the lifecycle state of journal entries. This enum enforces a controlled workflow from draft creation through approval and posting, with support for voiding entries when needed.

### Dependencies
- Task 02: Define JournalEntryType Enum

### Instructions

1. **Continue in enums.py file**
   - Remain in `apps/accounting/models/enums.py`
   - Add clear separation comment
   - Prepare to define status enum

2. **Define JournalEntryStatus class**
   - Create class inheriting from `models.TextChoices`
   - Add comprehensive class docstring
   - Explain status workflow

3. **Add DRAFT status**
   - Value: 'DRAFT'
   - Label: 'Draft'
   - Purpose: Initial creation, editable state

4. **Add PENDING_APPROVAL status**
   - Value: 'PENDING_APPROVAL'
   - Label: 'Pending Approval'
   - Purpose: Submitted for review

5. **Add APPROVED status**
   - Value: 'APPROVED'
   - Label: 'Approved'
   - Purpose: Approved but not yet posted

6. **Add POSTED status**
   - Value: 'POSTED'
   - Label: 'Posted'
   - Purpose: Posted to general ledger

7. **Add VOID status**
   - Value: 'VOID'
   - Label: 'Void'
   - Purpose: Voided/cancelled entry

### Status Definitions

| Status | Value | Label | Description | Editable | Reversible |
|--------|-------|-------|-------------|----------|------------|
| DRAFT | 'DRAFT' | Draft | Initial creation | Yes | Yes (delete) |
| PENDING_APPROVAL | 'PENDING_APPROVAL' | Pending Approval | Awaiting review | No | Yes (recall) |
| APPROVED | 'APPROVED' | Approved | Manager approved | No | Yes (reject) |
| POSTED | 'POSTED' | Posted | Posted to GL | No | Yes (void) |
| VOID | 'VOID' | Void | Cancelled | No | No |

### Status Lifecycle Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              Journal Entry Status Lifecycle                  │
└─────────────────────────────────────────────────────────────┘

        CREATE
          │
          ▼
    ┌──────────┐  SUBMIT    ┌─────────────────┐
    │  DRAFT   │──────────>│ PENDING_APPROVAL │
    └──────────┘            └─────────────────┘
          │                         │
          │ DELETE                  │ RECALL
          ▼                         ▼
    ┌──────────┐            ┌──────────┐
    │ DELETED  │            │  DRAFT   │
    └──────────┘            └──────────┘
                                    │ APPROVE
                                    ▼
                            ┌──────────┐  REJECT
                            │ APPROVED │─────────> DRAFT
                            └──────────┘
                                    │ POST
                                    ▼
                            ┌──────────┐  VOID
                            │  POSTED  │─────────> Create Reversal
                            └──────────┘           Entry
                                    │
                                    │ AUTO-VOID
                                    ▼
                            ┌──────────┐
                            │   VOID   │
                            └──────────┘
```

### Status Transition Rules

#### From DRAFT
- **Submit:** Change to PENDING_APPROVAL (if validation passes)
- **Delete:** Permanently remove entry
- **Edit:** Modify entry details freely

#### From PENDING_APPROVAL
- **Approve:** Change to APPROVED (requires approval permission)
- **Reject:** Return to DRAFT with comments
- **Recall:** Return to DRAFT (by submitter only)

#### From APPROVED
- **Post:** Change to POSTED (creates GL transactions)
- **Reject:** Return to DRAFT (requires higher permission)

#### From POSTED
- **Void:** Change to VOID (creates reversal entry)
- **Cannot:** Edit or delete directly

#### From VOID
- **Terminal State:** No further transitions allowed
- **Reference Only:** Kept for audit trail

### Permission Requirements by Status

| Status | Create | View | Edit | Submit | Approve | Post | Void |
|--------|--------|------|------|--------|---------|------|------|
| DRAFT | User | User | User | User | - | - | - |
| PENDING | - | Approver | - | - | Approver | - | - |
| APPROVED | - | Any | - | - | - | Accountant | Accountant |
| POSTED | - | Any | - | - | - | - | Manager |
| VOID | - | Any | - | - | - | - | - |

### Expected Outcome
- Complete status lifecycle management
- Clear transition rules
- Support for approval workflows
- Audit trail preservation
- Permission-based state control

### Verification Checklist
- [ ] JournalEntryStatus class defined
- [ ] DRAFT status added
- [ ] PENDING_APPROVAL status added
- [ ] APPROVED status added
- [ ] POSTED status added
- [ ] VOID status added
- [ ] Status workflow documented
- [ ] Transition rules clear

---

## Task 04: Define JournalSource Enum

### Overview
Define the JournalSource enumeration to identify the origin or source system of journal entries. This enum helps track which business process generated the entry and enables source-specific reporting and reconciliation.

### Dependencies
- Task 03: Define JournalEntryStatus Enum

### Instructions

1. **Continue in enums.py file**
   - Remain in `apps/accounting/models/enums.py`
   - Add section separator comment
   - Prepare for source enum definition

2. **Define JournalSource class**
   - Create class inheriting from `models.TextChoices`
   - Add detailed class docstring
   - Explain source tracking purpose

3. **Add SALES source**
   - Value: 'SALES'
   - Label: 'Sales'
   - Purpose: Generated from sales invoices

4. **Add PURCHASE source**
   - Value: 'PURCHASE'
   - Label: 'Purchase'
   - Purpose: Generated from purchase bills

5. **Add PAYROLL source**
   - Value: 'PAYROLL'
   - Label: 'Payroll'
   - Purpose: Generated from payroll processing

6. **Add INVENTORY source**
   - Value: 'INVENTORY'
   - Label: 'Inventory'
   - Purpose: Generated from inventory adjustments

7. **Add BANKING source**
   - Value: 'BANKING'
   - Label: 'Banking'
   - Purpose: Generated from bank transactions

8. **Add MANUAL source**
   - Value: 'MANUAL'
   - Label: 'Manual Entry'
   - Purpose: Manually created entries

9. **Add ADJUSTMENT source**
   - Value: 'ADJUSTMENT'
   - Label: 'Adjustment'
   - Purpose: Period-end adjusting entries

### Source Definitions

| Source | Value | Label | Description | Typical Entry Type |
|--------|-------|-------|-------------|-------------------|
| SALES | 'SALES' | Sales | Sales invoice posting | AUTO |
| PURCHASE | 'PURCHASE' | Purchase | Purchase bill posting | AUTO |
| PAYROLL | 'PAYROLL' | Payroll | Payroll processing | AUTO |
| INVENTORY | 'INVENTORY' | Inventory | Stock adjustments | AUTO |
| BANKING | 'BANKING' | Banking | Bank transactions | AUTO |
| MANUAL | 'MANUAL' | Manual Entry | User-created entries | MANUAL |
| ADJUSTMENT | 'ADJUSTMENT' | Adjustment | Adjusting entries | ADJUSTING |

### Source Usage Scenarios

#### SALES Source
Generated when posting:
- Sales invoices
- Customer payments
- Sales returns
- Credit notes

Journal Entry Example:
```
Accounts Receivable     Dr  1,000
    Sales Revenue               Cr    850
    Tax Payable                 Cr    150
```

#### PURCHASE Source
Generated when posting:
- Purchase bills
- Supplier payments
- Purchase returns
- Debit notes

Journal Entry Example:
```
Inventory               Dr    800
Tax Receivable          Dr    120
    Accounts Payable            Cr    920
```

#### PAYROLL Source
Generated when processing:
- Monthly salary
- Employee benefits
- Payroll taxes
- Deductions

Journal Entry Example:
```
Salary Expense          Dr  50,000
EPF Expense             Dr   6,000
    EPF Payable                 Cr   6,000
    Tax Payable                 Cr   8,000
    Bank Account                Cr  42,000
```

#### INVENTORY Source
Generated from:
- Stock adjustments
- Inventory valuation changes
- Write-offs
- Revaluation

Journal Entry Example:
```
Inventory Loss          Dr    500
    Inventory                   Cr    500
```

#### BANKING Source
Generated from:
- Bank deposits
- Bank withdrawals
- Bank charges
- Interest income

Journal Entry Example:
```
Bank Charges            Dr     50
    Bank Account                Cr     50
```

#### MANUAL Source
User-created entries for:
- Corrections
- Reclassifications
- Opening balances
- Special transactions

#### ADJUSTMENT Source
Period-end entries for:
- Accrued expenses
- Prepaid expenses
- Depreciation
- Provisions

### Source-to-Reference Mapping

| Source | Reference Field Contains |
|--------|-------------------------|
| SALES | Sales Invoice Number (SI-2026-00123) |
| PURCHASE | Purchase Bill Number (PB-2026-00045) |
| PAYROLL | Payroll Batch ID (PR-2026-01) |
| INVENTORY | Stock Adjustment ID (SA-2026-00012) |
| BANKING | Bank Transaction ID (BT-2026-00234) |
| MANUAL | User-entered reference |
| ADJUSTMENT | Adjustment Reason/Batch ID |

### Source-Based Reporting

Sources enable:
- **Sales Journal Report:** All SALES source entries
- **Purchase Journal Report:** All PURCHASE source entries
- **Payroll Journal Report:** All PAYROLL source entries
- **Cash Book:** All BANKING source entries
- **General Journal:** All MANUAL source entries

### Expected Outcome
- Clear source identification
- Support for source-based filtering
- Enhanced audit trail
- Source-specific reporting
- Reconciliation support

### Verification Checklist
- [ ] JournalSource class defined
- [ ] SALES source added
- [ ] PURCHASE source added
- [ ] PAYROLL source added
- [ ] INVENTORY source added
- [ ] BANKING source added
- [ ] MANUAL source added
- [ ] ADJUSTMENT source added
- [ ] All sources have values and labels
- [ ] Source documentation complete

---

## Summary

This document established the foundation for journal entries by:

1. **Extended accounting app** with journal entry module structure
2. **Created JournalEntryType enum** with MANUAL, AUTO, ADJUSTING, REVERSING
3. **Created JournalEntryStatus enum** with complete lifecycle workflow
4. **Created JournalSource enum** with comprehensive source tracking

These enumerations provide type-safe categorization and enable proper workflow management, audit trails, and source-specific reporting for the journal entry system.

### Next Steps
Proceed to [02_Tasks-05-12_JournalEntry-Core-Fields.md](02_Tasks-05-12_JournalEntry-Core-Fields.md) to create the JournalEntry model with core fields.
