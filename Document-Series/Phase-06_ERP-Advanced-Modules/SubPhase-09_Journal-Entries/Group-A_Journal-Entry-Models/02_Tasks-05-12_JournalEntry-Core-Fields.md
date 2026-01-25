# Tasks 05-12: JournalEntry Model Core Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** A - Journal Entry Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 05, 06, 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Accounting-Module-Enums.md](01_Tasks-01-04_Accounting-Module-Enums.md)
- **→ Next Document:** [03_Tasks-13-18_Entry-Tracking-Migrations.md](03_Tasks-13-18_Entry-Tracking-Migrations.md)

---

## Document Overview

This document covers the creation of the JournalEntry model and its core fields. The model serves as the header for double-entry bookkeeping transactions, containing essential information about entry identification, dating, categorization, and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 05 | Create JournalEntry Model | Medium | 30 min |
| 06 | Add Entry Number Field | Medium | 25 min |
| 07 | Add Entry Date Field | Low | 15 min |
| 08 | Add Entry Type Field | Low | 10 min |
| 09 | Add Entry Status Field | Low | 10 min |
| 10 | Add Entry Source Field | Low | 10 min |
| 11 | Add Entry Reference Field | Low | 15 min |
| 12 | Add Entry Description Field | Low | 15 min |

---

## Task 05: Create JournalEntry Model

### Overview
Create the JournalEntry model class, which serves as the header for all journal entries in the double-entry bookkeeping system. This model will contain all entry-level information, while line items will be stored in a separate JournalEntryLine model (created in later groups).

### Dependencies
- Task 04: Define JournalSource Enum
- Account model exists in accounting app
- FiscalPeriod model exists in accounting app
- User model from Django auth

### Instructions

1. **Create journal_entry.py file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `journal_entry.py`
   - Add module docstring explaining purpose

2. **Add required imports**
   - Import Django model utilities
   - Import tenant-related base classes
   - Import enumeration classes from enums.py
   - Import User model from Django auth

3. **Define JournalEntry class**
   - Inherit from appropriate base class (TenantAwareModel)
   - Add comprehensive class docstring
   - Include model purpose and relationship notes

4. **Set up model Meta class**
   - Define database table name
   - Set default ordering (by entry_date, entry_number)
   - Add verbose names
   - Define indexes for common queries
   - Add constraints as needed

5. **Plan field structure**
   - Identify primary identification fields
   - Determine date-related fields
   - Plan status and type fields
   - Consider foreign key relationships

6. **Add model methods placeholders**
   - Plan __str__ method
   - Plan save method override
   - Plan validation methods
   - Plan helper methods

### Model Structure Overview

The JournalEntry model represents:
- **Header Information:** Entry number, date, description
- **Classification:** Type, status, source
- **Linkage:** Reference to source document
- **Workflow:** Created by, posted by, posting date
- **Calculations:** Total debit, total credit
- **Relationships:** Lines (one-to-many), reversal entry (self-FK)

### Model Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    JournalEntry Model                    │
├─────────────────────────────────────────────────────────┤
│  - entry_number (unique)                                │
│  - entry_date                                           │
│  - description                                          │
│  - type (enum)                                          │
│  - status (enum)                                        │
│  - source (enum)                                        │
│  - reference                                            │
└─────────────────────────────────────────────────────────┘
                     │         │
        ┌────────────┘         └────────────┐
        ▼                                   ▼
┌──────────────┐                   ┌─────────────────┐
│ JournalEntry │                   │ JournalEntryLine│
│    Lines     │◄──────────────────│   (Detail)      │
│ (one-to-many)│  journal_entry_id │ - account       │
└──────────────┘                   │ - debit/credit  │
                                   │ - description   │
                                   └─────────────────┘
        ▼
┌──────────────┐
│  reversal_of │
│  (self-FK)   │
│  For voided  │
│  entries     │
└──────────────┘
```

### Field Categories

| Category | Fields | Purpose |
|----------|--------|---------|
| Identification | entry_number | Unique identifier |
| Dating | entry_date | Transaction date |
| Classification | type, status, source | Categorization |
| Documentation | description, reference | Context and linking |
| Workflow | created_by, posted_by, posted_at | User tracking |
| Calculation | total_debit, total_credit | Cached totals |
| Relationship | reversal_of | Void/reversal linking |
| Timestamps | created_at, updated_at | Audit trail |

### Expected Outcome
- JournalEntry model class created
- Proper inheritance and imports
- Meta class configured
- Foundation for adding fields

### Verification Checklist
- [ ] `journal_entry.py` file created
- [ ] Required imports added
- [ ] JournalEntry class defined
- [ ] Inherits from TenantAwareModel
- [ ] Meta class defined
- [ ] Class docstring added
- [ ] Ready for field definitions

---

## Task 06: Add Entry Number Field

### Overview
Add the entry_number field to automatically generate unique journal entry numbers following the format JE-YYYY-NNNNN (e.g., JE-2026-00001). This field provides a human-readable, sequential identifier for each journal entry within the tenant and year.

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add entry_number field definition**
   - Use CharField with max_length=20
   - Set unique=True for uniqueness constraint
   - Add db_index=True for performance
   - Set editable=False (auto-generated)

2. **Add field help text**
   - Document the format: JE-YYYY-NNNNN
   - Note auto-generation behavior
   - Explain sequential numbering

3. **Add field verbose name**
   - Set to "Entry Number"
   - Used in admin and forms

4. **Plan auto-generation logic**
   - Generate on save if not provided
   - Format: JE-{YEAR}-{SEQUENCE:05d}
   - Year from entry_date
   - Sequence resets each year

5. **Consider tenant isolation**
   - Entry numbers must be unique per tenant
   - Sequences are tenant-specific
   - No cross-tenant duplicates

6. **Plan sequence implementation**
   - Query last entry number for year
   - Extract sequence number
   - Increment by 1
   - Handle concurrent creation (atomic operations)

### Entry Number Format

```
Entry Number Format: JE-YYYY-NNNNN

Components:
- Prefix: "JE-" (Journal Entry)
- Year: 4-digit year from entry_date
- Separator: "-"
- Sequence: 5-digit zero-padded number

Examples:
- JE-2026-00001  (First entry of 2026)
- JE-2026-00002  (Second entry of 2026)
- JE-2026-00099  (99th entry of 2026)
- JE-2026-01234  (1,234th entry of 2026)
- JE-2027-00001  (First entry of 2027 - sequence resets)
```

### Sequence Generation Logic

```
Step 1: Extract Year
entry_date = 2026-03-15
year = 2026

Step 2: Query Last Entry for Year
last_entry = JournalEntry.objects.filter(
    entry_number__startswith='JE-2026-'
).order_by('-entry_number').first()

Step 3: Extract Sequence
if last_entry:
    last_number = "JE-2026-00123"
    last_seq = int(last_number.split('-')[2])  # 123
    new_seq = last_seq + 1  # 124
else:
    new_seq = 1

Step 4: Format New Number
entry_number = f"JE-{year}-{new_seq:05d}"
# Result: "JE-2026-00124"
```

### Tenant Isolation

```
Tenant A:
- JE-2026-00001
- JE-2026-00002
- JE-2026-00003

Tenant B:
- JE-2026-00001  (Same number, different tenant)
- JE-2026-00002
- JE-2026-00003

Uniqueness: (tenant_id, entry_number) composite
```

### Concurrency Handling

To prevent duplicate numbers when multiple entries are created simultaneously:

1. **Database-level unique constraint:** Ensures no duplicates
2. **Atomic transaction:** Entry creation in transaction
3. **Retry logic:** If duplicate detected, regenerate and retry
4. **Row-level locking:** Lock last entry row when reading sequence

### Usage in Queries

```
Filter by Year:
entries = JournalEntry.objects.filter(
    entry_number__startswith='JE-2026-'
)

Search by Number:
entry = JournalEntry.objects.get(
    entry_number='JE-2026-00123'
)

Latest Entry:
latest = JournalEntry.objects.order_by(
    '-entry_number'
).first()
```

### Expected Outcome
- Unique, auto-generated entry numbers
- Year-based sequential numbering
- Tenant-isolated sequences
- Human-readable format
- Database-enforced uniqueness

### Verification Checklist
- [ ] entry_number field added
- [ ] CharField with max_length=20
- [ ] unique=True constraint set
- [ ] db_index=True for performance
- [ ] editable=False set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Auto-generation logic planned

---

## Task 07: Add Entry Date Field

### Overview
Add the entry_date field to record the transaction date of the journal entry. This date determines which accounting period the entry belongs to and is used for financial reporting and period closing.

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add entry_date field definition**
   - Use DateField type
   - Do not set default (must be explicit)
   - Set db_index=True for date-based queries

2. **Add field help text**
   - Document purpose: "Transaction date of the journal entry"
   - Note period validation requirement
   - Explain reporting impact

3. **Add field verbose name**
   - Set to "Entry Date"
   - Used in admin and forms

4. **Plan validation rules**
   - Must be within open fiscal period
   - Cannot be future date (optional rule)
   - Cannot be in closed period
   - Validate against fiscal calendar

5. **Consider date-based filtering**
   - Index for date range queries
   - Support month/year grouping
   - Enable period-based reports

### Entry Date Purpose

The entry_date field serves multiple purposes:

| Purpose | Description |
|---------|-------------|
| Period Assignment | Determines which fiscal period contains the entry |
| Reporting | Used for grouping in financial statements |
| Sequence Generation | Year component of entry number |
| Validation | Check against open/closed periods |
| Audit Trail | Historical transaction dating |

### Date Validation Rules

#### Rule 1: Open Period Check
```
Validation:
- entry_date must fall within an open fiscal period
- Query FiscalPeriod where status='OPEN'
- If no open period contains date, reject

Example:
entry_date = 2026-03-15
Open Period: 2026-03-01 to 2026-03-31
Result: Valid ✓

entry_date = 2026-02-15
Open Period: 2026-03-01 to 2026-03-31
Result: Invalid ✗ (Period not open)
```

#### Rule 2: Closed Period Check
```
Validation:
- entry_date must not be in closed period
- Closed periods cannot accept new entries
- Period closing locks historical data

Example:
entry_date = 2026-02-15
Period Status: CLOSED
Result: Invalid ✗
```

#### Rule 3: Future Date Check (Optional)
```
Validation:
- entry_date should not exceed current date
- Prevents backdating errors
- Can be disabled for planned entries

Example:
entry_date = 2026-05-01
Current Date: 2026-03-15
Result: Invalid ✗ (if rule enabled)
```

### Date-Based Reporting Scenarios

#### Monthly Reports
```
Filter entries for March 2026:
entries = JournalEntry.objects.filter(
    entry_date__year=2026,
    entry_date__month=3
)
```

#### Date Range Reports
```
Filter entries for Q1 2026:
entries = JournalEntry.objects.filter(
    entry_date__gte='2026-01-01',
    entry_date__lte='2026-03-31'
)
```

#### Year-to-Date Reports
```
Filter entries from year start to now:
entries = JournalEntry.objects.filter(
    entry_date__year=2026,
    entry_date__lte=today
)
```

### Entry Date in Financial Close Process

```
┌─────────────────────────────────────────────────────────┐
│           Period Close Impact on Entry Date              │
└─────────────────────────────────────────────────────────┘

Period: March 2026 (Open)
├─ entry_date in range: Allowed ✓
└─ entry_date outside range: Rejected ✗

Period: February 2026 (Closed)
├─ entry_date in range: Rejected ✗
└─ New entries blocked

Period: April 2026 (Not Started)
├─ entry_date in range: May be allowed (future posting)
└─ Depends on policy
```

### Expected Outcome
- Transaction date captured
- Period validation support
- Date-based querying enabled
- Financial reporting foundation

### Verification Checklist
- [ ] entry_date field added
- [ ] DateField type used
- [ ] db_index=True set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Validation rules planned
- [ ] No default value (explicit date required)

---

## Task 08: Add Entry Type Field

### Overview
Add the entry_type field to categorize journal entries by their creation method and purpose. This field uses the JournalEntryType enumeration defined earlier to distinguish between manual, auto-generated, adjusting, and reversing entries.

### Dependencies
- Task 02: Define JournalEntryType Enum
- Task 05: Create JournalEntry Model

### Instructions

1. **Add entry_type field definition**
   - Use CharField with choices parameter
   - Set choices=JournalEntryType.choices
   - Set max_length=20 (accommodate enum values)
   - Set default=JournalEntryType.MANUAL

2. **Add field help text**
   - Document purpose: "Type of journal entry"
   - Note default behavior
   - Reference enum values

3. **Add field verbose name**
   - Set to "Entry Type"
   - Used in admin and forms

4. **Add database index**
   - Set db_index=True
   - Enable type-based filtering
   - Support type-specific reports

5. **Plan type-specific behavior**
   - MANUAL entries are editable
   - AUTO entries have source references
   - ADJUSTING entries may create reversals
   - REVERSING entries link to original

### Entry Type Usage

| Type | Default Status | Editable | Auto-Number | Common Source |
|------|---------------|----------|-------------|---------------|
| MANUAL | DRAFT | Yes | Yes | User creation |
| AUTO | POSTED | No | Yes | System transactions |
| ADJUSTING | DRAFT | Yes | Yes | Period close |
| REVERSING | POSTED | No | Yes | Auto-generated |

### Type-Based Validation Rules

#### MANUAL Type
- Created by users in accounting module
- Always starts as DRAFT
- Requires approval workflow
- Can be edited before posting
- Must balance (debit = credit)

#### AUTO Type
- Generated from business transactions
- Often created in POSTED status
- Should not be edited directly
- Has source document reference
- System validates balance

#### ADJUSTING Type
- Created during period-end close
- Starts as DRAFT
- Requires approval
- May have reversal flag set
- Used for accruals, deferrals

#### REVERSING Type
- Auto-created from adjusting entries
- Created in POSTED status
- Cannot be edited
- Automatically balances original
- Posted at period start

### Type-Based Business Logic

```
┌─────────────────────────────────────────────────────────┐
│          Entry Type Determines Behavior                  │
└─────────────────────────────────────────────────────────┘

IF entry_type == MANUAL:
    - Allow user editing in DRAFT status
    - Require manual approval
    - Enable posting by accountant

IF entry_type == AUTO:
    - Set created_by = system
    - Link to source document (required)
    - Auto-post if validation passes
    - Prevent manual editing

IF entry_type == ADJUSTING:
    - Allow reversal_flag option
    - Enable period-end workflows
    - May create REVERSING entry

IF entry_type == REVERSING:
    - Set reversal_of FK (required)
    - Auto-post at period start
    - Debit ↔ Credit swap
```

### Type-Based Filtering

```
Manual Entries Only:
manual_entries = JournalEntry.objects.filter(
    entry_type=JournalEntryType.MANUAL
)

System-Generated Entries:
auto_entries = JournalEntry.objects.filter(
    entry_type=JournalEntryType.AUTO
)

Adjusting and Reversing Entries:
adjustments = JournalEntry.objects.filter(
    entry_type__in=[
        JournalEntryType.ADJUSTING,
        JournalEntryType.REVERSING
    ]
)
```

### Expected Outcome
- Type-safe entry categorization
- Support for different workflows
- Type-based business rules
- Filtering and reporting capability

### Verification Checklist
- [ ] entry_type field added
- [ ] CharField with choices
- [ ] choices=JournalEntryType.choices
- [ ] max_length=20 set
- [ ] default=MANUAL set
- [ ] db_index=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 09: Add Entry Status Field

### Overview
Add the entry_status field to track the lifecycle state of journal entries. This field uses the JournalEntryStatus enumeration to enforce a controlled workflow from draft creation through approval and posting, with support for voiding entries.

### Dependencies
- Task 03: Define JournalEntryStatus Enum
- Task 05: Create JournalEntry Model

### Instructions

1. **Add entry_status field definition**
   - Use CharField with choices parameter
   - Set choices=JournalEntryStatus.choices
   - Set max_length=20 (accommodate enum values)
   - Set default=JournalEntryStatus.DRAFT

2. **Add field help text**
   - Document purpose: "Current status of the journal entry"
   - Note workflow stages
   - Reference status transitions

3. **Add field verbose name**
   - Set to "Status"
   - Used in admin and forms

4. **Add database index**
   - Set db_index=True
   - Enable status-based filtering
   - Support workflow queries

5. **Plan status transition validation**
   - Validate allowed transitions
   - Check user permissions
   - Enforce business rules

### Status-Based Permissions

| Status | View | Edit | Submit | Approve | Post | Void |
|--------|------|------|--------|---------|------|------|
| DRAFT | Creator | Creator | Creator | - | - | Creator (delete) |
| PENDING | Approver | - | - | Approver | - | - |
| APPROVED | All | - | - | - | Accountant | Manager |
| POSTED | All | - | - | - | - | Manager |
| VOID | All | - | - | - | - | - |

### Status Transition Validation

```
┌─────────────────────────────────────────────────────────┐
│        Status Transition Validation Rules                │
└─────────────────────────────────────────────────────────┘

DRAFT → PENDING_APPROVAL:
✓ Entry must balance (debit = credit)
✓ All lines must have accounts
✓ Entry date must be in open period
✓ User must be creator

PENDING_APPROVAL → APPROVED:
✓ User must have approve permission
✓ Entry still valid (not outdated)

APPROVED → POSTED:
✓ User must have post permission
✓ Period still open
✓ Final validation passes
✓ Creates GL transactions

POSTED → VOID:
✓ User must have void permission
✓ Creates reversal entry
✓ Updates original status
```

### Status-Based Query Patterns

```
Draft Entries (Editable):
drafts = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.DRAFT,
    created_by=current_user
)

Pending Approval (For Approvers):
pending = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.PENDING_APPROVAL
)

Posted Entries (Financial Reports):
posted = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.POSTED,
    entry_date__year=2026
)

Active Entries (Non-Void):
active = JournalEntry.objects.exclude(
    entry_status=JournalEntryStatus.VOID
)
```

### Status Change Triggers

```
┌─────────────────────────────────────────────────────────┐
│          Actions Triggered by Status Changes             │
└─────────────────────────────────────────────────────────┘

On PENDING_APPROVAL:
- Send notification to approvers
- Log status change
- Lock editing

On APPROVED:
- Send notification to creator
- Update approval timestamp
- Record approver

On POSTED:
- Create general ledger transactions
- Update account balances
- Lock entry (immutable)
- Record posting user and time

On VOID:
- Create reversal journal entry
- Update GL transactions
- Send notification
- Preserve audit trail
```

### Status in Financial Reports

Different reports include entries based on status:

| Report Type | Included Statuses |
|-------------|------------------|
| Draft Report | DRAFT |
| Pending Approval List | PENDING_APPROVAL |
| General Ledger | POSTED |
| Trial Balance | POSTED |
| Audit Trail | ALL (including VOID) |
| Voided Entries Report | VOID |

### Expected Outcome
- Complete status lifecycle tracking
- Workflow enforcement
- Status-based permissions
- Audit trail support

### Verification Checklist
- [ ] entry_status field added
- [ ] CharField with choices
- [ ] choices=JournalEntryStatus.choices
- [ ] max_length=20 set
- [ ] default=DRAFT set
- [ ] db_index=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 10: Add Entry Source Field

### Overview
Add the entry_source field to identify the origin or source system that generated the journal entry. This field uses the JournalSource enumeration to support source-specific reporting, reconciliation, and audit trails.

### Dependencies
- Task 04: Define JournalSource Enum
- Task 05: Create JournalEntry Model

### Instructions

1. **Add entry_source field definition**
   - Use CharField with choices parameter
   - Set choices=JournalSource.choices
   - Set max_length=20 (accommodate enum values)
   - Set default=JournalSource.MANUAL

2. **Add field help text**
   - Document purpose: "Source system or module that generated this entry"
   - Note reconciliation usage
   - Reference source types

3. **Add field verbose name**
   - Set to "Source"
   - Used in admin and forms

4. **Add database index**
   - Set db_index=True
   - Enable source-based filtering
   - Support source journals

5. **Plan source-reference mapping**
   - Each source has typical reference format
   - Reference field links to source document
   - Support source-specific validation

### Source-Reference Examples

| Source | Reference Format | Example | Source Document |
|--------|-----------------|---------|-----------------|
| SALES | SI-YYYY-NNNNN | SI-2026-00123 | Sales Invoice |
| PURCHASE | PB-YYYY-NNNNN | PB-2026-00045 | Purchase Bill |
| PAYROLL | PR-YYYY-NN | PR-2026-01 | Payroll Batch |
| INVENTORY | SA-YYYY-NNNNN | SA-2026-00012 | Stock Adjustment |
| BANKING | BT-YYYY-NNNNN | BT-2026-00234 | Bank Transaction |
| MANUAL | User-defined | Various | N/A |
| ADJUSTMENT | ADJ-YYYY-NN | ADJ-2026-03 | Adjustment Batch |

### Source-Based Journals

Traditional accounting uses subsidiary journals for different sources:

#### Sales Journal (SALES Source)
```
All journal entries with source=SALES

Columns:
- Entry Number
- Entry Date
- Customer (from reference)
- Invoice Number
- Accounts Receivable (Debit)
- Sales Revenue (Credit)
- Tax Payable (Credit)
```

#### Purchase Journal (PURCHASE Source)
```
All journal entries with source=PURCHASE

Columns:
- Entry Number
- Entry Date
- Supplier (from reference)
- Bill Number
- Inventory (Debit)
- Tax Receivable (Debit)
- Accounts Payable (Credit)
```

#### Payroll Journal (PAYROLL Source)
```
All journal entries with source=PAYROLL

Columns:
- Entry Number
- Entry Date
- Payroll Batch
- Salary Expense (Debit)
- EPF/ETF Expense (Debit)
- Payroll Liabilities (Credit)
- Net Pay (Credit)
```

#### General Journal (MANUAL Source)
```
All journal entries with source=MANUAL

Columns:
- Entry Number
- Entry Date
- Description
- Account Debits
- Account Credits
```

### Source-Based Reconciliation

Sources enable reconciliation between modules:

```
┌─────────────────────────────────────────────────────────┐
│             Source-Based Reconciliation                  │
└─────────────────────────────────────────────────────────┘

Sales Module:
Total Sales Invoices Posted = ₨ 1,000,000

Accounting Module:
Total Journal Entries (source=SALES) = ₨ 1,000,000

Match: ✓ Reconciled


Payroll Module:
Total Payroll Processed = ₨ 500,000

Accounting Module:
Total Journal Entries (source=PAYROLL) = ₨ 500,000

Match: ✓ Reconciled
```

### Source-Based Access Control

```
Different users may have access based on source:

Sales Manager:
- View: SALES entries only
- Cannot view other sources

Payroll Manager:
- View: PAYROLL entries only
- Cannot view other sources

Accountant:
- View: ALL sources
- Edit: MANUAL, ADJUSTMENT only
- Cannot edit AUTO entries

Finance Manager:
- View: ALL sources
- Approve: ALL sources
```

### Source Validation Rules

```
IF entry_source == SALES:
    - reference must match sales invoice format
    - Must have AR debit line
    - Must have Sales/Tax credit lines

IF entry_source == PURCHASE:
    - reference must match purchase bill format
    - Must have AP credit line
    - Must have Inventory/Expense debit lines

IF entry_source == PAYROLL:
    - reference must match payroll batch format
    - Must balance to net payroll amount

IF entry_source == MANUAL:
    - reference is optional
    - More flexible validation
```

### Expected Outcome
- Clear source identification
- Support for subsidiary journals
- Source-based reconciliation
- Module integration tracking

### Verification Checklist
- [ ] entry_source field added
- [ ] CharField with choices
- [ ] choices=JournalSource.choices
- [ ] max_length=20 set
- [ ] default=MANUAL set
- [ ] db_index=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 11: Add Entry Reference Field

### Overview
Add the reference field to store the source document identifier that generated this journal entry. This field creates a link back to the originating transaction, enabling traceability and drill-down from accounting entries to source documents.

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add reference field definition**
   - Use CharField
   - Set max_length=50
   - Set blank=True, null=True (optional)
   - Add db_index=True for lookups

2. **Add field help text**
   - Document purpose: "Reference to source document (e.g., invoice number, bill number)"
   - Note format varies by source
   - Explain traceability purpose

3. **Add field verbose name**
   - Set to "Reference"
   - Used in admin and forms

4. **Plan reference validation**
   - Format validation based on source
   - Verify document exists
   - Prevent duplicate posting

### Reference Field Usage by Source

| Source | Reference Content | Required | Format Validation |
|--------|------------------|----------|-------------------|
| SALES | Sales Invoice Number | Yes | SI-YYYY-NNNNN |
| PURCHASE | Purchase Bill Number | Yes | PB-YYYY-NNNNN |
| PAYROLL | Payroll Batch ID | Yes | PR-YYYY-NN |
| INVENTORY | Stock Adjustment ID | Yes | SA-YYYY-NNNNN |
| BANKING | Bank Transaction ID | Yes | BT-YYYY-NNNNN |
| MANUAL | User-entered text | No | Free text |
| ADJUSTMENT | Adjustment Batch ID | No | ADJ-YYYY-NN |

### Reference Lookup and Traceability

```
┌─────────────────────────────────────────────────────────┐
│              Reference Traceability Flow                 │
└─────────────────────────────────────────────────────────┘

User Views: General Ledger
    │
    ▼
Sees: Journal Entry JE-2026-00123
    │
    ▼
Clicks: Reference "SI-2026-00045"
    │
    ▼
Navigates: To Sales Invoice SI-2026-00045
    │
    ▼
Views: Original invoice details, items, customer
    │
    ▼
Can: Print invoice, view payments, see full history
```

### Duplicate Posting Prevention

The reference field helps prevent posting the same source document multiple times:

```
Validation Logic:

BEFORE posting Sales Invoice SI-2026-00045:

1. Check for existing journal entry:
   existing = JournalEntry.objects.filter(
       entry_source=JournalSource.SALES,
       reference='SI-2026-00045',
       entry_status__in=[APPROVED, POSTED]
   ).exists()

2. If existing:
   - Raise ValidationError
   - Message: "Invoice SI-2026-00045 already posted"
   - Prevent duplicate

3. If not existing:
   - Allow posting
   - Create journal entry with reference
```

### Reference in Audit Reports

```
Audit Trail Report:

Date       | Entry No      | Source   | Reference      | Amount
-----------|---------------|----------|----------------|----------
2026-03-15 | JE-2026-00123 | SALES    | SI-2026-00045  | 1,000.00
2026-03-15 | JE-2026-00124 | PURCHASE | PB-2026-00021  | 500.00
2026-03-16 | JE-2026-00125 | PAYROLL  | PR-2026-01     | 50,000.00
2026-03-16 | JE-2026-00126 | MANUAL   | Bank Charges   | 50.00

Click any reference → Navigate to source document
```

### Reference Search Functionality

```
Search Scenarios:

1. Find entry by invoice number:
   entry = JournalEntry.objects.get(
       reference='SI-2026-00045'
   )

2. Find all entries for payroll batch:
   entries = JournalEntry.objects.filter(
       entry_source=JournalSource.PAYROLL,
       reference='PR-2026-01'
   )

3. Find entries with specific reference pattern:
   entries = JournalEntry.objects.filter(
       reference__startswith='SI-2026-'
   )
```

### Reference Format Examples

```
SALES Reference:
- Format: SI-2026-00045
- Links to: Sales Invoice model (id or number)
- Displays: Invoice details, customer, items

PURCHASE Reference:
- Format: PB-2026-00021
- Links to: Purchase Bill model
- Displays: Bill details, supplier, items

PAYROLL Reference:
- Format: PR-2026-01
- Links to: Payroll Batch model
- Displays: Batch details, employees, amounts

MANUAL Reference:
- Format: Free text
- Examples: "Bank charges March 2026"
           "Opening balance correction"
           "Depreciation adjustment"
```

### Expected Outcome
- Source document linkage
- Duplicate posting prevention
- Traceability support
- Audit trail enhancement

### Verification Checklist
- [ ] reference field added
- [ ] CharField with max_length=50
- [ ] blank=True, null=True set
- [ ] db_index=True set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Optional field (not required)

---

## Task 12: Add Entry Description Field

### Overview
Add the description field to store a narration or memo explaining the purpose and details of the journal entry. This field provides context for the entry and is essential for understanding the transaction, especially for manual entries and adjustments.

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add description field definition**
   - Use TextField for longer text
   - Set blank=True (optional but recommended)
   - No max_length constraint

2. **Add field help text**
   - Document purpose: "Detailed description or narration of the journal entry"
   - Note usage in reports
   - Mention audit trail importance

3. **Add field verbose name**
   - Set to "Description"
   - Used in admin and forms

4. **Plan description content**
   - Brief explanation of transaction
   - Additional context
   - Reference to supporting documents
   - Used in reporting

### Description Content Guidelines

| Entry Type | Description Content |
|-----------|-------------------|
| MANUAL | Detailed explanation of adjustment or correction |
| AUTO | Auto-generated description from source document |
| ADJUSTING | Reason for adjustment, calculation method |
| REVERSING | Reference to original adjusting entry |

### Description Examples by Source

#### SALES Source
```
Description: "Posted sales invoice SI-2026-00045 for customer ABC Company. 
Total amount: ₨1,000 (Sales: ₨850 + VAT: ₨150)"

Purpose: Documents the sale transaction
```

#### PURCHASE Source
```
Description: "Posted purchase bill PB-2026-00021 from XYZ Suppliers. 
Inventory: ₨800, VAT: ₨120, Total: ₨920"

Purpose: Documents the purchase transaction
```

#### PAYROLL Source
```
Description: "Payroll journal entry for March 2026 (PR-2026-01). 
Gross salary: ₨50,000, EPF: ₨6,000, Tax: ₨8,000, Net: ₨42,000"

Purpose: Summarizes payroll processing
```

#### MANUAL Source - Correction
```
Description: "Correction of February 2026 sales entry. Original entry 
JE-2026-00098 had incorrect account classification. Moving ₨500 from 
Sales - Product A to Sales - Product B per manager approval."

Purpose: Documents correction and authorization
```

#### MANUAL Source - Bank Charges
```
Description: "Bank charges for March 2026 as per bank statement. 
Account maintenance: ₨25, Transaction fees: ₨25, Total: ₨50"

Purpose: Records bank fees
```

#### ADJUSTING Source - Depreciation
```
Description: "Monthly depreciation for March 2026. Computer equipment: 
₨5,000, Furniture: ₨2,000, Vehicles: ₨8,000, Total: ₨15,000"

Purpose: Documents depreciation calculation
```

#### ADJUSTING Source - Accrued Expenses
```
Description: "Accrued utility expenses for March 2026. Estimated amount 
₨3,000 based on average consumption. Will be reversed in April upon 
receipt of actual bill."

Purpose: Documents accrual and reversal plan
```

### Description in Reports

```
Journal Entry Detail Report:

Entry Number: JE-2026-00123
Entry Date: 2026-03-15
Type: MANUAL
Status: POSTED
Source: MANUAL

Description:
"Correction of inventory valuation error discovered during stock take. 
Original entry JE-2026-00095 incorrectly valued Item XYZ at ₨100 per 
unit instead of ₨150 per unit. Adjustment for 50 units: ₨2,500. 
Approved by Inventory Manager on 2026-03-14."

Lines:
Dr. Inventory                     2,500.00
    Cr. Cost of Goods Sold                    2,500.00
```

### Description Formatting Best Practices

```
Good Description:
✓ Clear and concise
✓ Includes amounts
✓ References source documents
✓ Notes authorization if needed
✓ Explains unusual transactions

Example:
"Depreciation for March 2026. Office Equipment: ₨5,000 @ 20% annual 
rate. See Asset Register for details."


Poor Description:
✗ Too vague
✗ Missing context
✗ No amounts
✗ Unclear purpose

Example:
"Depreciation entry"
```

### Description for Audit Trail

The description field is crucial for audit trails:

1. **Explains transaction rationale:** Why was this entry made?
2. **Documents authorization:** Who approved it?
3. **References supporting docs:** What documents support this?
4. **Provides calculation details:** How were amounts determined?
5. **Notes unusual circumstances:** Any special considerations?

### Auto-Generated vs. Manual Descriptions

```
AUTO-GENERATED (from system):
Template: "Posted {document_type} {document_number} for {party_name}. 
Amount: {currency}{total}"

Example: "Posted sales invoice SI-2026-00045 for ABC Company. 
Amount: ₨1,000"

Advantage: Consistent format, complete information


MANUAL (user-entered):
Format: Free text entered by user

Example: "Correction of coding error in February entries per 
supervisor approval"

Advantage: Flexible, detailed context
```

### Expected Outcome
- Clear transaction documentation
- Enhanced audit trail
- Context for understanding entries
- Support for compliance

### Verification Checklist
- [ ] description field added
- [ ] TextField type used
- [ ] blank=True set (optional)
- [ ] Help text added
- [ ] Verbose name set
- [ ] No max_length restriction

---

## Summary

This document established the core structure of the JournalEntry model with essential fields:

1. **Created JournalEntry model** with proper inheritance and meta configuration
2. **Added entry_number field** with auto-generation format JE-YYYY-NNNNN
3. **Added entry_date field** for transaction dating
4. **Added entry_type field** for categorizing entry origin
5. **Added entry_status field** for lifecycle workflow
6. **Added entry_source field** for source system identification
7. **Added reference field** for source document linking
8. **Added description field** for transaction narration

These core fields establish the foundation for journal entry recording. The next document will add calculated fields, user tracking, and relationships.

### Next Steps
Proceed to [03_Tasks-13-18_Entry-Tracking-Migrations.md](03_Tasks-13-18_Entry-Tracking-Migrations.md) to add total fields, user tracking, reversal relationships, and run migrations.
