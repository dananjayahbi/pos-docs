# SubPhase 09: Journal Entries - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 09 of 14  
> **SubPhase Goal:** Record financial transactions with double-entry bookkeeping  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08_Chart-of-Accounts](../SubPhase-08_Chart-of-Accounts/)
- **→ Next SubPhase:** [SubPhase-10_Account-Reconciliation](../SubPhase-10_Account-Reconciliation/)

---

## SubPhase Overview

This sub-phase implements the journal entry system, the core mechanism for recording all financial transactions in double-entry bookkeeping. Includes manual entries, auto-generated entries from business operations, adjusting entries, reversing entries, templates, and approval workflows.

### Key Outcomes
- Journal entry model with line items
- Double-entry validation (debits = credits)
- Manual journal entry creation
- Auto-generated entries from sales/purchases
- Adjusting entries (month-end)
- Reversing entries
- Entry templates for recurring transactions
- Recurring/scheduled entries
- Entry approval workflow
- Document attachments
- Entry posting (draft vs posted)

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Validation:** Double-entry balance validation
- **Scheduling:** Celery Beat for recurring entries
- **Frontend:** Next.js 14+ with TypeScript
- **Storage:** S3-compatible for attachments

### Dependencies
- Phase-06 SubPhase-08: Chart of Accounts (accounts)

---

## Task Execution Order

```
TASK GROUP A: Journal Entry Models (Tasks 01-18)
        │
        ▼
TASK GROUP B: Double-Entry Validation (Tasks 19-32)
        │
        ▼
TASK GROUP C: Auto-Generated Entries (Tasks 33-48)
        │
        ▼
TASK GROUP D: Templates & Recurring (Tasks 49-64)
        │
        ▼
TASK GROUP E: Approval & Posting (Tasks 65-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-94)
```

---

## Task Index

### Group A: Journal Entry Models (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Extend accounting App** | Add journal entry module to accounting app | None | 🔴 Not Created |
| 02 | **Define JournalEntryType Enum** | Create: MANUAL, AUTO, ADJUSTING, REVERSING | Task 01 | 🔴 Not Created |
| 03 | **Define JournalEntryStatus Enum** | Create: DRAFT, PENDING_APPROVAL, APPROVED, POSTED, VOID | Task 02 | 🔴 Not Created |
| 04 | **Define JournalSource Enum** | Create: SALES, PURCHASE, PAYROLL, INVENTORY, MANUAL | Task 03 | 🔴 Not Created |
| 05 | **Create JournalEntry Model** | Core journal entry header model | Task 04 | 🔴 Not Created |
| 06 | **Add Entry Number Field** | Auto-generated entry number (JE-2026-00001) | Task 05 | 🔴 Not Created |
| 07 | **Add Entry Date Field** | Transaction date | Task 05 | 🔴 Not Created |
| 08 | **Add Entry Type Field** | Add type using JournalEntryType | Task 05 | 🔴 Not Created |
| 09 | **Add Entry Status Field** | Add status using JournalEntryStatus | Task 05 | 🔴 Not Created |
| 10 | **Add Entry Source Field** | Add source using JournalSource | Task 05 | 🔴 Not Created |
| 11 | **Add Entry Reference Field** | Reference to source document (Invoice #) | Task 05 | 🔴 Not Created |
| 12 | **Add Entry Description Field** | Memo/narration for the entry | Task 05 | 🔴 Not Created |
| 13 | **Add Entry Total Fields** | Add total_debit, total_credit (cached) | Task 05 | 🔴 Not Created |
| 14 | **Add Entry Created By** | FK to User who created | Task 05 | 🔴 Not Created |
| 15 | **Add Entry Posted Fields** | Add posted_at, posted_by | Task 05 | 🔴 Not Created |
| 16 | **Add Entry Reversal FK** | Self-FK for reversed entry reference | Task 05 | 🔴 Not Created |
| 17 | **Add Entry Timestamps** | Add created_at, updated_at | Task 05 | 🔴 Not Created |
| 18 | **Run JournalEntry Migrations** | Generate and apply migrations | Task 17 | 🔴 Not Created |

---

### Group B: Double-Entry Validation (Tasks 19-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create JournalEntryLine Model** | Individual debit/credit line items | Task 18 | 🔴 Not Created |
| 20 | **Add Line Entry FK** | Foreign key to JournalEntry | Task 19 | 🔴 Not Created |
| 21 | **Add Line Account FK** | Foreign key to Account | Task 19 | 🔴 Not Created |
| 22 | **Add Line Debit Field** | Debit amount (Decimal) | Task 19 | 🔴 Not Created |
| 23 | **Add Line Credit Field** | Credit amount (Decimal) | Task 19 | 🔴 Not Created |
| 24 | **Add Line Description** | Line-level memo | Task 19 | 🔴 Not Created |
| 25 | **Add Line Sort Order** | Display order in entry | Task 19 | 🔴 Not Created |
| 26 | **Run Line Migrations** | Generate and apply migrations | Task 25 | 🔴 Not Created |
| 27 | **Create Balance Validator** | Validate debits = credits | Task 26 | 🔴 Not Created |
| 28 | **Add Zero Balance Check** | Ensure total_debit == total_credit | Task 27 | 🔴 Not Created |
| 29 | **Add Minimum Lines Check** | Require at least 2 lines | Task 28 | 🔴 Not Created |
| 30 | **Add Non-Zero Check** | Ensure amounts are positive | Task 29 | 🔴 Not Created |
| 31 | **Add Account Active Check** | Validate accounts are active | Task 30 | 🔴 Not Created |
| 32 | **Add Entry Period Check** | Validate entry date in open period | Task 31 | 🔴 Not Created |

---

### Group C: Auto-Generated Entries (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create JournalEntryAttachment Model** | Document attachments for entries | Task 32 | 🔴 Not Created |
| 34 | **Add Attachment File Field** | FileField for uploaded document | Task 33 | 🔴 Not Created |
| 35 | **Add Attachment Metadata** | Add file_name, file_size, uploaded_by | Task 33 | 🔴 Not Created |
| 36 | **Run Attachment Migrations** | Generate and apply migrations | Task 35 | 🔴 Not Created |
| 37 | **Create JournalEntryService** | Service class for entry operations | Task 36 | 🔴 Not Created |
| 38 | **Add Create Entry Method** | Create with validation | Task 37 | 🔴 Not Created |
| 39 | **Add Update Entry Method** | Update draft entries only | Task 38 | 🔴 Not Created |
| 40 | **Add Post Entry Method** | Post entry and update balances | Task 39 | 🔴 Not Created |
| 41 | **Add Void Entry Method** | Void posted entry (creates reversal) | Task 40 | 🔴 Not Created |
| 42 | **Create AutoEntryGenerator** | Service for auto-generated entries | Task 41 | 🔴 Not Created |
| 43 | **Add Sales Entry Generator** | Create entry from sales invoice | Task 42 | 🔴 Not Created |
| 44 | **Add Purchase Entry Generator** | Create entry from purchase bill | Task 43 | 🔴 Not Created |
| 45 | **Add Payment Entry Generator** | Create entry from payment | Task 44 | 🔴 Not Created |
| 46 | **Add Payroll Entry Generator** | Create entry from payroll | Task 45 | 🔴 Not Created |
| 47 | **Add Inventory Entry Generator** | Create entry from inventory adjustment | Task 46 | 🔴 Not Created |
| 48 | **Create Entry Posting Trigger** | Celery signal to post auto-entries | Task 47 | 🔴 Not Created |

---

### Group D: Templates & Recurring (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create JournalEntryTemplate Model** | Reusable entry templates | Task 48 | 🔴 Not Created |
| 50 | **Add Template Name Field** | Template name for identification | Task 49 | 🔴 Not Created |
| 51 | **Add Template Description** | Template purpose description | Task 49 | 🔴 Not Created |
| 52 | **Add Template Lines JSON** | Stored template line items | Task 49 | 🔴 Not Created |
| 53 | **Add Template Category** | Category for organization | Task 49 | 🔴 Not Created |
| 54 | **Run Template Migrations** | Generate and apply migrations | Task 53 | 🔴 Not Created |
| 55 | **Create Template Service** | Service for template operations | Task 54 | 🔴 Not Created |
| 56 | **Add Create From Template** | Create entry from template | Task 55 | 🔴 Not Created |
| 57 | **Add Save As Template** | Save existing entry as template | Task 56 | 🔴 Not Created |
| 58 | **Create RecurringEntry Model** | Scheduled recurring entries | Task 57 | 🔴 Not Created |
| 59 | **Add Recurring Template FK** | Link to template | Task 58 | 🔴 Not Created |
| 60 | **Add Recurring Frequency** | Add frequency (daily, weekly, monthly) | Task 58 | 🔴 Not Created |
| 61 | **Add Recurring Schedule Fields** | Add next_run, last_run, end_date | Task 58 | 🔴 Not Created |
| 62 | **Add Recurring Active Flag** | Add is_active boolean | Task 58 | 🔴 Not Created |
| 63 | **Run Recurring Migrations** | Generate and apply migrations | Task 62 | 🔴 Not Created |
| 64 | **Create Recurring Entry Celery Task** | Process recurring entries | Task 63 | 🔴 Not Created |

---

### Group E: Approval & Posting (Tasks 65-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create AccountingPeriod Model** | Fiscal periods for entry validation | Task 64 | 🔴 Not Created |
| 66 | **Add Period Date Range** | Add start_date, end_date | Task 65 | 🔴 Not Created |
| 67 | **Add Period Status** | Add status (OPEN, CLOSED, LOCKED) | Task 65 | 🔴 Not Created |
| 68 | **Add Period Year/Month** | Add fiscal_year, fiscal_month | Task 65 | 🔴 Not Created |
| 69 | **Run Period Migrations** | Generate and apply migrations | Task 68 | 🔴 Not Created |
| 70 | **Create Approval Workflow** | Entry approval process | Task 69 | 🔴 Not Created |
| 71 | **Add Approval Threshold** | Auto-approve below threshold | Task 70 | 🔴 Not Created |
| 72 | **Add Request Approval Method** | Submit entry for approval | Task 71 | 🔴 Not Created |
| 73 | **Add Approve Entry Method** | Approve and optionally post | Task 72 | 🔴 Not Created |
| 74 | **Add Reject Entry Method** | Reject with reason | Task 73 | 🔴 Not Created |
| 75 | **Create Adjusting Entry Service** | Month-end adjustments | Task 74 | 🔴 Not Created |
| 76 | **Add Accrual Entry Method** | Create accrual entries | Task 75 | 🔴 Not Created |
| 77 | **Add Deferral Entry Method** | Create deferral entries | Task 76 | 🔴 Not Created |
| 78 | **Create Reversing Entry Service** | Auto-reverse adjusting entries | Task 77 | 🔴 Not Created |
| 79 | **Add Create Reversal Method** | Generate reversal entry | Task 78 | 🔴 Not Created |
| 80 | **Add Schedule Reversal Method** | Schedule for next period | Task 79 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create JournalEntry Admin** | Django admin for entries | Task 80 | 🔴 Not Created |
| 82 | **Add Admin Inline Lines** | Inline editing for entry lines | Task 81 | 🔴 Not Created |
| 83 | **Add Admin List Display** | Show number, date, status, totals | Task 82 | 🔴 Not Created |
| 84 | **Add Admin Actions** | Post, Void, Approve actions | Task 83 | 🔴 Not Created |
| 85 | **Create JournalEntrySerializer** | DRF serializer with lines | Task 84 | 🔴 Not Created |
| 86 | **Create JournalEntryLineSerializer** | Nested line serializer | Task 85 | 🔴 Not Created |
| 87 | **Create JournalEntryViewSet** | Full CRUD ViewSet | Task 86 | 🔴 Not Created |
| 88 | **Add Post Entry Endpoint** | POST /entries/{id}/post/ | Task 87 | 🔴 Not Created |
| 89 | **Add Void Entry Endpoint** | POST /entries/{id}/void/ | Task 88 | 🔴 Not Created |
| 90 | **Add Approve Entry Endpoint** | POST /entries/{id}/approve/ | Task 89 | 🔴 Not Created |
| 91 | **Add Entry URL Routes** | Register routes in urls.py | Task 90 | 🔴 Not Created |
| 92 | **Write JournalEntry Model Tests** | Unit tests for entry model | Task 91 | 🔴 Not Created |
| 93 | **Write Double-Entry Tests** | Test balance validation | Task 92 | 🔴 Not Created |
| 94 | **Create Journal Entry API Docs** | Document all endpoints | Task 93 | 🔴 Not Created |

---

## Expected File Structure

```
apps/accounting/
├── models/
│   ├── journal_entry.py        # JournalEntry model
│   ├── journal_line.py         # JournalEntryLine model
│   ├── journal_attachment.py   # Attachment model
│   ├── journal_template.py     # Template model
│   ├── recurring_entry.py      # Recurring entry model
│   └── accounting_period.py    # Fiscal period model
├── serializers/
│   ├── journal_entry.py        # Entry serializers
│   ├── journal_line.py         # Line serializers
│   └── journal_template.py     # Template serializers
├── views/
│   ├── journal_entry.py        # Entry ViewSet
│   └── journal_template.py     # Template ViewSet
├── services/
│   ├── journal_service.py      # Entry operations service
│   ├── auto_entry.py           # Auto-generated entries
│   ├── template_service.py     # Template operations
│   ├── recurring_service.py    # Recurring entry processing
│   ├── approval_service.py     # Approval workflow
│   └── adjusting_service.py    # Adjusting/reversing entries
├── validators/
│   └── entry_validators.py     # Double-entry validation
├── tasks.py                    # Celery tasks (recurring, auto-post)
├── signals.py                  # Auto-entry triggers
├── tests/
│   ├── test_journal_entry.py
│   ├── test_double_entry.py
│   ├── test_auto_entry.py
│   └── test_recurring.py
└── migrations/

frontend/src/app/(dashboard)/accounting/
├── journal-entries/
│   ├── page.tsx                # Entry list
│   ├── [id]/
│   │   └── page.tsx            # Entry detail
│   ├── new/
│   │   └── page.tsx            # Create entry
│   └── templates/
│       └── page.tsx            # Template management
├── components/
│   ├── JournalEntryForm.tsx    # Entry form with lines
│   ├── JournalEntryLines.tsx   # Line items editor
│   ├── EntryStatusBadge.tsx    # Status display
│   └── AccountSelector.tsx     # Account dropdown
└── hooks/
    ├── useJournalEntries.ts
    └── useAccounts.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Journal Entry Models | 18 | 0 | 0% |
| Group B: Double-Entry Validation | 14 | 0 | 0% |
| Group C: Auto-Generated Entries | 16 | 0 | 0% |
| Group D: Templates & Recurring | 16 | 0 | 0% |
| Group E: Approval & Posting | 16 | 0 | 0% |
| Group F: API, Testing & Documentation | 14 | 0 | 0% |
| **TOTAL** | **94** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **Double-Entry Rule:**
   - Every entry MUST have total debits = total credits
   - Validate before save, validate before post
   - Minimum 2 lines per entry

2. **Entry Number Format:**
   - JE-{YEAR}-{SEQUENCE}
   - Example: JE-2026-00001
   - Auto-increment per tenant

3. **Entry Lifecycle:**
   ```
   DRAFT → PENDING_APPROVAL → APPROVED → POSTED
                                    ↓
                                  VOID (creates reversal)
   ```

4. **Posted Entry Rules:**
   - Posted entries cannot be edited
   - To correct: Create reversal entry
   - Void creates automatic reversal

5. **Account Balance Updates:**
   - Update account.current_balance on posting
   - Debit: Add to DEBIT-normal accounts, subtract from CREDIT-normal
   - Credit: Opposite of debit

6. **Accounting Period:**
   - Entries require date within OPEN period
   - Closed periods prevent new entries
   - Period close triggers balance carry-forward

### Auto-Generated Entry Examples

1. **Sales Invoice Entry:**
   ```
   DR Accounts Receivable  1,000.00
   DR VAT Input              150.00
       CR Sales Revenue              1,000.00
       CR VAT Output                   150.00
   ```

2. **Purchase Bill Entry:**
   ```
   DR Inventory/Expense    800.00
   DR VAT Input            120.00
       CR Accounts Payable            920.00
   ```

3. **Payroll Entry:**
   ```
   DR Salaries Expense   100,000.00
   DR EPF Expense (12%)   12,000.00
   DR ETF Expense (3%)     3,000.00
       CR EPF Payable (20%)           20,000.00
       CR ETF Payable (3%)             3,000.00
       CR PAYE Payable                 5,000.00
       CR Net Salaries Payable        87,000.00
   ```

### Sri Lanka Specific

1. **VAT Entries:**
   - Track VAT Input (purchases) and VAT Output (sales)
   - Net VAT calculation for returns

2. **EPF/ETF Entries:**
   - Employee EPF 8% from salaries
   - Employer EPF 12% as expense
   - Employer ETF 3% as expense

3. **PAYE Entries:**
   - Deduct from salaries based on tax brackets
   - Credit to PAYE Payable

### Template Examples

1. **Monthly Rent Template:**
   ```
   DR Rent Expense         [Amount]
       CR Bank/Cash                 [Amount]
   ```

2. **Depreciation Template:**
   ```
   DR Depreciation Expense [Amount]
       CR Accumulated Depreciation  [Amount]
   ```

### Workflow Summary

```
Manual Entry Created (DRAFT)
        │
        ▼
Lines Added (Debit/Credit balanced)
        │
        ▼
Submitted for Approval (if required)
        │
        ▼
Approved by Manager
        │
        ▼
Posted (Account balances updated)
        │
        ▼
If Error → Void (Reversal entry created)
```

---

## Completion Checklist

- [ ] JournalEntry model with all fields
- [ ] JournalEntryLine model with debit/credit
- [ ] Double-entry validation (debits = credits)
- [ ] JournalEntryAttachment model
- [ ] Entry service (create, post, void)
- [ ] Auto-entry generators (sales, purchase, payroll)
- [ ] Template model and service
- [ ] Recurring entry model and Celery task
- [ ] Accounting period model
- [ ] Approval workflow
- [ ] Adjusting/reversing entry services
- [ ] Django admin with inline lines
- [ ] DRF serializers and ViewSets
- [ ] API endpoints (CRUD + post/void/approve)
- [ ] Unit and integration tests
- [ ] API documentation
