# Tasks 13-18: Entry Tracking Fields and Migrations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** A - Journal Entry Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-05-12_JournalEntry-Core-Fields.md](02_Tasks-05-12_JournalEntry-Core-Fields.md)
- **→ Next Group:** [../Group-B_Double-Entry-Validation/](../Group-B_Double-Entry-Validation/)

---

## Document Overview

This document covers the addition of calculated total fields, user tracking fields, reversal relationship, timestamp fields, and the creation of database migrations for the JournalEntry model. These fields complete the model structure and enable posting workflow, audit trails, and entry reversals.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add Entry Total Fields | Low | 20 min |
| 14 | Add Entry Created By | Low | 15 min |
| 15 | Add Entry Posted Fields | Low | 20 min |
| 16 | Add Entry Reversal FK | Low | 20 min |
| 17 | Add Entry Timestamps | Low | 10 min |
| 18 | Run JournalEntry Migrations | Low | 15 min |

---

## Task 13: Add Entry Total Fields

### Overview
Add cached total_debit and total_credit fields to store calculated sums of all debit and credit amounts from journal entry lines. These cached values improve query performance and enable quick validation that the entry balances (debit = credit).

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add total_debit field definition**
   - Use DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=0
   - Add editable=False (calculated value)

2. **Add total_debit help text and verbose name**
   - Help text: "Total debit amount (cached from lines)"
   - Verbose name: "Total Debit"

3. **Add total_credit field definition**
   - Use DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=0
   - Add editable=False (calculated value)

4. **Add total_credit help text and verbose name**
   - Help text: "Total credit amount (cached from lines)"
   - Verbose name: "Total Credit"

5. **Plan calculation logic**
   - Calculate on line save/delete
   - Sum all debit amounts from lines
   - Sum all credit amounts from lines
   - Update parent entry

6. **Plan balance validation**
   - Validate total_debit == total_credit
   - Check before status changes
   - Used in posting workflow

### Total Fields Purpose

| Field | Purpose | Calculation |
|-------|---------|-------------|
| total_debit | Sum of all debit amounts | Σ(line.debit_amount) |
| total_credit | Sum of all credit amounts | Σ(line.credit_amount) |

### Calculation Logic

```
┌─────────────────────────────────────────────────────────┐
│            Total Calculation Workflow                    │
└─────────────────────────────────────────────────────────┘

When JournalEntryLine is saved:
    │
    ▼
1. Calculate new totals:
   total_debit = sum of all lines where debit_amount > 0
   total_credit = sum of all lines where credit_amount > 0
    │
    ▼
2. Update parent JournalEntry:
   entry.total_debit = calculated_debit
   entry.total_credit = calculated_credit
   entry.save()
    │
    ▼
3. Validate balance:
   if total_debit != total_credit:
       raise ValidationError("Entry does not balance")
```

### Balance Validation Examples

#### Balanced Entry ✓
```
Journal Entry: JE-2026-00123

Lines:
1. Accounts Receivable     Dr  1,000.00
2. Sales Revenue               Cr    850.00
3. Tax Payable                 Cr    150.00

Calculation:
total_debit = 1,000.00
total_credit = 850.00 + 150.00 = 1,000.00

Validation: 1,000.00 == 1,000.00 ✓ Balanced
```

#### Unbalanced Entry ✗
```
Journal Entry: JE-2026-00124

Lines:
1. Accounts Receivable     Dr  1,000.00
2. Sales Revenue               Cr    900.00

Calculation:
total_debit = 1,000.00
total_credit = 900.00

Validation: 1,000.00 != 900.00 ✗ Unbalanced
Error: "Entry does not balance. Difference: ₨100.00"
```

#### Complex Entry ✓
```
Journal Entry: JE-2026-00125 (Payroll)

Lines:
1. Salary Expense          Dr 50,000.00
2. EPF Expense             Dr  6,000.00
3. EPF Payable                 Cr  6,000.00
4. Tax Payable                 Cr  8,000.00
5. Bank Account                Cr 42,000.00

Calculation:
total_debit = 50,000.00 + 6,000.00 = 56,000.00
total_credit = 6,000.00 + 8,000.00 + 42,000.00 = 56,000.00

Validation: 56,000.00 == 56,000.00 ✓ Balanced
```

### Performance Benefits of Caching

```
WITHOUT Cached Totals:
Every query needs JOIN to lines table:

SELECT je.*, 
       SUM(CASE WHEN jel.debit_amount > 0 THEN jel.debit_amount END) as total_debit,
       SUM(CASE WHEN jel.credit_amount > 0 THEN jel.credit_amount END) as total_credit
FROM journal_entry je
LEFT JOIN journal_entry_line jel ON jel.journal_entry_id = je.id
GROUP BY je.id

Slow for large datasets


WITH Cached Totals:
Simple SELECT from single table:

SELECT id, entry_number, total_debit, total_credit
FROM journal_entry

Fast and efficient
```

### Total Fields in Reports

```
Trial Balance Query:

SELECT 
    account_id,
    account_name,
    SUM(total_debit) as total_debits,
    SUM(total_credit) as total_credits
FROM journal_entry
WHERE entry_status = 'POSTED'
  AND entry_date BETWEEN '2026-01-01' AND '2026-03-31'
GROUP BY account_id

Fast because totals are cached
```

### Update Triggers

Total fields should be recalculated when:

| Event | Action |
|-------|--------|
| Line added | Recalculate totals |
| Line modified | Recalculate totals |
| Line deleted | Recalculate totals |
| Entry validation | Check totals balance |
| Status change | Validate totals |

### Expected Outcome
- Cached total amounts
- Fast balance validation
- Improved query performance
- Support for reporting

### Verification Checklist
- [ ] total_debit field added
- [ ] DecimalField with max_digits=15, decimal_places=2
- [ ] default=0 set
- [ ] editable=False set
- [ ] total_credit field added
- [ ] Same DecimalField configuration
- [ ] Help text added for both fields
- [ ] Verbose names set

---

## Task 14: Add Entry Created By

### Overview
Add the created_by field to track which user created the journal entry. This field is essential for audit trails, workflow management, and permission checking. It establishes ownership of the entry during the draft and approval process.

### Dependencies
- Task 05: Create JournalEntry Model
- User model from Django auth

### Instructions

1. **Add created_by field definition**
   - Use ForeignKey to User model
   - Set on_delete=models.PROTECT
   - Set related_name='journal_entries_created'
   - Allow null=True (for system-generated entries)

2. **Add field help text**
   - Document purpose: "User who created this journal entry"
   - Note permission implications
   - Explain workflow ownership

3. **Add field verbose name**
   - Set to "Created By"
   - Used in admin and forms

4. **Plan auto-population**
   - Set from request.user on creation
   - For system entries, may be null or system user
   - Cannot be changed after creation

5. **Plan permission checks**
   - Creator can edit DRAFT entries
   - Creator can delete DRAFT entries
   - Creator can submit for approval
   - Used in access control

### Created By Field Purpose

| Purpose | Description |
|---------|-------------|
| Audit Trail | Track who created each entry |
| Ownership | Identify entry owner |
| Permissions | Control edit/delete access |
| Workflow | Route approvals |
| Reporting | User activity reports |

### User Tracking in Entry Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│          User Tracking Through Lifecycle                 │
└─────────────────────────────────────────────────────────┘

1. Entry Creation:
   User: John (Accountant)
   ├─ created_by = John
   ├─ status = DRAFT
   └─ John can edit/delete

2. Submit for Approval:
   User: John (Accountant)
   ├─ status → PENDING_APPROVAL
   └─ John can no longer edit

3. Approval:
   User: Mary (Manager)
   ├─ status → APPROVED
   └─ approved_by = Mary (future field)

4. Posting:
   User: Mary (Manager)
   ├─ status → POSTED
   ├─ posted_by = Mary
   └─ posted_at = 2026-03-15 14:30:00
```

### Permission Rules Based on Created By

```
IF current_user == entry.created_by:
    IF entry.status == DRAFT:
        ✓ Can edit entry
        ✓ Can delete entry
        ✓ Can submit for approval
    
    IF entry.status == PENDING_APPROVAL:
        ✓ Can recall to DRAFT
        ✗ Cannot edit
    
    IF entry.status in [APPROVED, POSTED]:
        ✗ Cannot edit
        ✗ Cannot delete
        ✓ Can view

ELSE:
    IF current_user.has_perm('accounting.view_journalentry'):
        ✓ Can view entry
    
    IF current_user.has_perm('accounting.approve_journalentry'):
        ✓ Can approve PENDING entries
    
    Other actions require specific permissions
```

### System-Generated Entries

```
For AUTO entries (e.g., from sales invoices):

Option 1: Set created_by = null
- Indicates system-generated
- No user ownership
- Special handling in permissions

Option 2: Set created_by = system_user
- Create special "System" user account
- All auto entries attributed to this user
- Easier permission handling

Recommendation: Use Option 2 for consistency
```

### Audit Reports Using Created By

```
User Activity Report:

User: John Smith
Period: March 2026

Created Entries:
- JE-2026-00123 (DRAFT)
- JE-2026-00124 (PENDING_APPROVAL)
- JE-2026-00125 (POSTED)

Total Entries: 3
Total Amount: ₨56,000
```

### Query Examples

```
Get user's draft entries:
drafts = JournalEntry.objects.filter(
    created_by=current_user,
    entry_status=JournalEntryStatus.DRAFT
)

Get all entries by specific user:
user_entries = JournalEntry.objects.filter(
    created_by=user_id
).order_by('-created_at')

Get entries awaiting user's approval:
pending = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.PENDING_APPROVAL
).exclude(
    created_by=current_user  # Can't approve own entries
)
```

### Expected Outcome
- User attribution for entries
- Audit trail capability
- Permission enforcement
- Workflow ownership

### Verification Checklist
- [ ] created_by field added
- [ ] ForeignKey to User model
- [ ] on_delete=PROTECT set
- [ ] related_name='journal_entries_created'
- [ ] null=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 15: Add Entry Posted Fields

### Overview
Add posted_by and posted_at fields to track when and by whom the journal entry was posted to the general ledger. These fields capture the critical moment when the entry becomes part of the official accounting records.

### Dependencies
- Task 05: Create JournalEntry Model
- User model from Django auth

### Instructions

1. **Add posted_by field definition**
   - Use ForeignKey to User model
   - Set on_delete=models.PROTECT
   - Set related_name='journal_entries_posted'
   - Set null=True, blank=True (only populated when posted)

2. **Add posted_by help text**
   - Document purpose: "User who posted this entry to the general ledger"
   - Note only set when status becomes POSTED
   - Explain cannot post own entries rule

3. **Add posted_by verbose name**
   - Set to "Posted By"

4. **Add posted_at field definition**
   - Use DateTimeField
   - Set null=True, blank=True
   - Auto-populated on posting

5. **Add posted_at help text**
   - Document purpose: "Date and time when entry was posted"
   - Note timezone handling
   - Explain immutability

6. **Add posted_at verbose name**
   - Set to "Posted At"

7. **Plan posting workflow**
   - Set both fields when status → POSTED
   - Validate user has post permission
   - Cannot be modified after posting

### Posting Fields Purpose

| Field | Purpose | Set When | Changeable |
|-------|---------|----------|------------|
| posted_by | Who posted | Status → POSTED | No |
| posted_at | When posted | Status → POSTED | No |

### Posting Workflow

```
┌─────────────────────────────────────────────────────────┐
│              Journal Entry Posting Process               │
└─────────────────────────────────────────────────────────┘

Pre-Conditions:
✓ Entry status = APPROVED
✓ Entry balances (debit = credit)
✓ Period is open
✓ User has post permission
✓ User != created_by (optional rule)

Posting Action:
1. Begin transaction
2. Validate all pre-conditions
3. Set entry.posted_by = current_user
4. Set entry.posted_at = now()
5. Set entry.entry_status = POSTED
6. Create GL transactions from lines
7. Update account balances
8. Commit transaction

Post-Conditions:
✓ Entry is immutable
✓ GL transactions created
✓ Account balances updated
✓ Audit trail complete
```

### Posting Permission Rules

```
Can Post Journal Entry IF:
✓ User has 'accounting.post_journalentry' permission
✓ Entry status == APPROVED
✓ Entry balances
✓ Period is open
✓ Fiscal year is open

Optional Rule (Segregation of Duties):
✓ User != entry.created_by
  (Cannot post own entries)
```

### Posting Time Tracking

```
Entry Timeline:

Created: 2026-03-10 09:15:00 (by John)
↓
Submitted: 2026-03-10 09:30:00 (by John)
↓
Approved: 2026-03-12 10:00:00 (by Mary)
↓
Posted: 2026-03-15 14:30:00 (by Mary)

posted_by = Mary
posted_at = 2026-03-15 14:30:00
```

### Audit Trail with Posting Fields

```
Journal Entry Audit Report:

Entry Number: JE-2026-00123
Entry Date: 2026-03-10
Status: POSTED

Created By: John Smith (Accountant)
Created At: 2026-03-10 09:15:00

Posted By: Mary Johnson (Manager)
Posted At: 2026-03-15 14:30:00

Time to Post: 5 days, 5 hours, 15 minutes
```

### Query Examples

```
Get entries posted today:
posted_today = JournalEntry.objects.filter(
    posted_at__date=today,
    entry_status=JournalEntryStatus.POSTED
)

Get entries posted by specific user:
posted_by_user = JournalEntry.objects.filter(
    posted_by=user_id
).order_by('-posted_at')

Get entries posted in date range:
posted_range = JournalEntry.objects.filter(
    posted_at__gte=start_date,
    posted_at__lte=end_date
)

Get approved but not yet posted:
awaiting_post = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.APPROVED,
    posted_at__isnull=True
)
```

### Posting Report

```
Daily Posting Report:
Date: 2026-03-15

Posted By: Mary Johnson
------------------------------
Entry No     | Amount    | Time
-------------|-----------|----------
JE-2026-00123| 1,000.00  | 14:30:00
JE-2026-00124|   500.00  | 14:35:00
JE-2026-00125|56,000.00  | 14:40:00
------------------------------
Total Entries: 3
Total Amount: ₨57,500.00
```

### Expected Outcome
- Complete posting audit trail
- User accountability
- Timestamp accuracy
- Workflow completion tracking

### Verification Checklist
- [ ] posted_by field added
- [ ] ForeignKey to User model
- [ ] on_delete=PROTECT set
- [ ] related_name='journal_entries_posted'
- [ ] null=True, blank=True set
- [ ] posted_at field added
- [ ] DateTimeField type used
- [ ] null=True, blank=True set
- [ ] Help text added for both fields
- [ ] Verbose names set

---

## Task 16: Add Entry Reversal FK

### Overview
Add the reversal_of field to create a self-referential foreign key that links voided journal entries to their reversal entries. When an entry is voided, a new reversal entry is automatically created with opposite debits/credits, and both entries reference each other.

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add reversal_of field definition**
   - Use ForeignKey to 'self'
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='reversed_by'

2. **Add field help text**
   - Document purpose: "Original entry that this reversal entry voids"
   - Explain void workflow
   - Note automatic creation

3. **Add field verbose name**
   - Set to "Reversal Of"

4. **Plan reversal workflow**
   - When voiding entry, create new reversal entry
   - New entry: reversal_of = original entry
   - Swap debits and credits
   - Both entries remain in system

5. **Plan bidirectional relationship**
   - Original entry: status = VOID
   - Reversal entry: reversal_of = original
   - Original can access reversal via reversed_by

### Reversal Relationship

```
┌─────────────────────────────────────────────────────────┐
│         Entry Reversal Relationship Structure            │
└─────────────────────────────────────────────────────────┘

Original Entry (JE-2026-00123):
├─ entry_status = VOID
├─ reversal_of = null
└─ reversed_by → points to reversal entry

Reversal Entry (JE-2026-00150):
├─ entry_status = POSTED
├─ entry_type = REVERSING
├─ reversal_of → points to original entry
└─ Debits ↔ Credits swapped
```

### Void Workflow

```
┌─────────────────────────────────────────────────────────┐
│            Journal Entry Void Process                    │
└─────────────────────────────────────────────────────────┘

User Initiates Void:
JE-2026-00123 (Currently POSTED)

Step 1: Validate
✓ Entry status = POSTED
✓ User has void permission
✓ Period still open (or void in current period)

Step 2: Create Reversal Entry
New Entry: JE-2026-00150
├─ entry_date = today (or same as original)
├─ entry_type = REVERSING
├─ entry_status = POSTED
├─ reversal_of = JE-2026-00123
├─ description = "Reversal of JE-2026-00123"
└─ Lines = original lines with debits/credits swapped

Step 3: Update Original Entry
JE-2026-00123:
├─ entry_status = VOID
└─ Can access reversal via .reversed_by

Step 4: Post Reversal
Create GL transactions from reversal entry
Update account balances (undo original effect)
```

### Reversal Entry Line Creation

```
Original Entry (JE-2026-00123):
Dr. Accounts Receivable        1,000.00
    Cr. Sales Revenue                      850.00
    Cr. Tax Payable                        150.00

Reversal Entry (JE-2026-00150):
Dr. Sales Revenue                850.00
Dr. Tax Payable                  150.00
    Cr. Accounts Receivable              1,000.00

Net Effect: Zero (original transaction cancelled)
```

### Reversal Reasons

```
Common Reasons for Voiding/Reversal:

1. Error Correction:
   - Wrong amounts
   - Wrong accounts
   - Wrong date

2. Duplicate Entry:
   - Entry posted twice
   - Must void duplicate

3. Customer Cancellation:
   - Sale cancelled
   - Invoice voided

4. Period-End Adjustment:
   - Adjusting entry needs reversal
   - Automatic at next period start
```

### Query Examples

```
Get original entry from reversal:
if reversal_entry.reversal_of:
    original = reversal_entry.reversal_of

Get reversal entry from original:
if original_entry.reversed_by.exists():
    reversal = original_entry.reversed_by.first()

Find all void entries:
void_entries = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.VOID
)

Find all reversal entries:
reversals = JournalEntry.objects.filter(
    reversal_of__isnull=False
)
```

### Reversal Report

```
Voided Entries Report:
Period: March 2026

Original | Void Date | Reversal | Reason
---------|-----------|----------|--------
JE-00123 | 2026-03-15| JE-00150 | Error in amount
JE-00098 | 2026-03-20| JE-00165 | Duplicate entry
JE-00087 | 2026-03-25| JE-00178 | Customer cancelled

Each pair nets to zero in GL
```

### Reversal Chain Validation

```
Validation Rules:

1. Cannot void an entry that's already void
   if entry.entry_status == VOID:
       raise ValidationError("Entry already voided")

2. Cannot void a reversal entry
   if entry.reversal_of is not None:
       raise ValidationError("Cannot void a reversal entry")

3. Can only void POSTED entries
   if entry.entry_status != POSTED:
       raise ValidationError("Can only void posted entries")
```

### Audit Trail with Reversals

```
Entry History View:

JE-2026-00123 (VOID):
Created: 2026-03-10 by John
Posted: 2026-03-12 by Mary
Voided: 2026-03-15 by Mary
Reversal: JE-2026-00150

JE-2026-00150 (POSTED):
Created: 2026-03-15 by System
Posted: 2026-03-15 by Mary
Reversal Of: JE-2026-00123
Type: REVERSING
```

### Expected Outcome
- Complete void/reversal tracking
- Bidirectional relationship
- Audit trail preservation
- Proper accounting reversal

### Verification Checklist
- [ ] reversal_of field added
- [ ] ForeignKey to 'self'
- [ ] on_delete=SET_NULL set
- [ ] null=True, blank=True set
- [ ] related_name='reversed_by'
- [ ] Help text added
- [ ] Verbose name set

---

## Task 17: Add Entry Timestamps

### Overview
Add created_at and updated_at timestamp fields to automatically track when journal entries are created and last modified. These fields are essential for audit trails and understanding entry history.

### Dependencies
- Task 05: Create JournalEntry Model

### Instructions

1. **Add created_at field definition**
   - Use DateTimeField
   - Set auto_now_add=True (auto-set on creation)
   - Cannot be modified after creation

2. **Add created_at help text**
   - Document purpose: "Date and time when entry was created"
   - Note automatic population
   - Explain immutability

3. **Add created_at verbose name**
   - Set to "Created At"

4. **Add updated_at field definition**
   - Use DateTimeField
   - Set auto_now=True (auto-updated on save)
   - Updates on every modification

5. **Add updated_at help text**
   - Document purpose: "Date and time of last modification"
   - Note automatic update
   - Explain modification tracking

6. **Add updated_at verbose name**
   - Set to "Updated At"

### Timestamp Fields Purpose

| Field | Purpose | Set When | Updated When |
|-------|---------|----------|--------------|
| created_at | Entry creation time | First save | Never |
| updated_at | Last modification time | Every save | Every save |

### Timestamp Usage in Audit Trail

```
┌─────────────────────────────────────────────────────────┐
│           Entry Timeline with Timestamps                 │
└─────────────────────────────────────────────────────────┘

JE-2026-00123:

created_at: 2026-03-10 09:15:00
└─ Entry created by John

updated_at: 2026-03-10 09:20:00
└─ John added more lines

updated_at: 2026-03-10 09:30:00
└─ John submitted for approval

updated_at: 2026-03-12 10:00:00
└─ Mary approved entry

updated_at: 2026-03-15 14:30:00
└─ Mary posted entry

Lifetime: 5 days, 5 hours, 15 minutes
Modifications: 4 updates
```

### Recently Modified Entries

```
Query for recent changes:

recent_updates = JournalEntry.objects.filter(
    updated_at__gte=datetime.now() - timedelta(hours=24)
).order_by('-updated_at')

Shows entries modified in last 24 hours
Useful for reviewing recent activity
```

### Age Reporting

```
Entry Age Report:

Entry No     | Created At          | Age
-------------|---------------------|--------
JE-2026-00123| 2026-03-10 09:15:00 | 5 days
JE-2026-00124| 2026-03-12 14:30:00 | 3 days
JE-2026-00125| 2026-03-15 10:00:00 | 0 days

Identify old draft entries
```

### Modification Tracking

```
Last Modified Report:

Entry No     | Status  | Last Update         | Days Since
-------------|---------|---------------------|------------
JE-2026-00100| DRAFT   | 2026-02-15 10:00:00 | 30 days
JE-2026-00105| PENDING | 2026-03-01 14:00:00 | 15 days
JE-2026-00110| DRAFT   | 2026-03-10 09:00:00 | 5 days

Identify stale entries needing attention
```

### Query Examples

```
Entries created today:
today_entries = JournalEntry.objects.filter(
    created_at__date=today
)

Entries modified in date range:
modified_range = JournalEntry.objects.filter(
    updated_at__gte=start_datetime,
    updated_at__lte=end_datetime
)

Old draft entries:
stale_drafts = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.DRAFT,
    created_at__lte=datetime.now() - timedelta(days=30)
)

Recently posted entries:
recent_posts = JournalEntry.objects.filter(
    entry_status=JournalEntryStatus.POSTED,
    updated_at__gte=datetime.now() - timedelta(hours=24)
)
```

### Timezone Considerations

```
Timestamp Storage:
- Store in UTC in database
- Display in user's local timezone
- Sri Lanka timezone: Asia/Colombo (UTC+5:30)

Example:
Database: 2026-03-15 09:00:00 UTC
Display: 2026-03-15 14:30:00 +0530
```

### Expected Outcome
- Automatic timestamp tracking
- Creation time preserved
- Modification history
- Audit trail support

### Verification Checklist
- [ ] created_at field added
- [ ] DateTimeField type used
- [ ] auto_now_add=True set
- [ ] Help text added
- [ ] Verbose name set
- [ ] updated_at field added
- [ ] DateTimeField type used
- [ ] auto_now=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 18: Run JournalEntry Migrations

### Overview
Generate and apply Django migrations to create the JournalEntry model in the database. This task creates the database schema for the journal entry header table with all defined fields and constraints.

### Dependencies
- Task 17: Add Entry Timestamps (all fields complete)

### Instructions

1. **Review model completeness**
   - Verify all fields are defined
   - Check Meta class configuration
   - Ensure imports are correct
   - Validate field parameters

2. **Update models __init__.py**
   - Import JournalEntry model
   - Export in __all__ list
   - Make available to Django

3. **Generate migration file**
   - Run makemigrations command
   - Review generated migration
   - Check field definitions
   - Verify indexes and constraints

4. **Review migration file**
   - Open generated migration file
   - Check CreateModel operation
   - Verify all fields included
   - Review index definitions

5. **Apply migration**
   - Run migrate command
   - Verify successful application
   - Check database table created
   - Confirm schema matches model

6. **Verify database schema**
   - Connect to database
   - Check table exists
   - Review column definitions
   - Verify indexes created

### Model Export Configuration

```
File: apps/accounting/models/__init__.py

Add import:
from .journal_entry import JournalEntry

Update __all__:
__all__ = [
    'Account',
    'FiscalPeriod',
    'JournalEntry',  # Add this
]
```

### Migration Generation

```
Command:
python manage.py makemigrations accounting

Expected Output:
Migrations for 'accounting':
  apps/accounting/migrations/0004_journalentry.py
    - Create model JournalEntry
    - Add index on ['entry_date', 'entry_status']
    - Add index on ['entry_source', 'reference']
    - Add constraint 'unique_entry_number' (tenant_id, entry_number)
```

### Generated Migration Structure

```
File: 0004_journalentry.py

operations = [
    migrations.CreateModel(
        name='JournalEntry',
        fields=[
            ('id', models.BigAutoField(primary_key=True)),
            ('entry_number', models.CharField(max_length=20, unique=True)),
            ('entry_date', models.DateField()),
            ('entry_type', models.CharField(max_length=20, choices=...)),
            ('entry_status', models.CharField(max_length=20, choices=...)),
            ('entry_source', models.CharField(max_length=20, choices=...)),
            ('reference', models.CharField(max_length=50, blank=True, null=True)),
            ('description', models.TextField(blank=True)),
            ('total_debit', models.DecimalField(max_digits=15, decimal_places=2, default=0)),
            ('total_credit', models.DecimalField(max_digits=15, decimal_places=2, default=0)),
            ('created_by', models.ForeignKey(..., on_delete=models.PROTECT, related_name='journal_entries_created')),
            ('posted_by', models.ForeignKey(..., on_delete=models.PROTECT, related_name='journal_entries_posted', blank=True, null=True)),
            ('posted_at', models.DateTimeField(blank=True, null=True)),
            ('reversal_of', models.ForeignKey('self', on_delete=models.SET_NULL, related_name='reversed_by', blank=True, null=True)),
            ('created_at', models.DateTimeField(auto_now_add=True)),
            ('updated_at', models.DateTimeField(auto_now=True)),
        ],
        options={
            'db_table': 'accounting_journal_entry',
            'ordering': ['-entry_date', '-entry_number'],
            'verbose_name': 'Journal Entry',
            'verbose_name_plural': 'Journal Entries',
        },
    ),
    migrations.AddIndex(
        model_name='journalentry',
        index=models.Index(fields=['entry_date', 'entry_status'], name='idx_je_date_status'),
    ),
    migrations.AddIndex(
        model_name='journalentry',
        index=models.Index(fields=['entry_source', 'reference'], name='idx_je_source_ref'),
    ),
]
```

### Apply Migration

```
Command:
python manage.py migrate accounting

Expected Output:
Running migrations:
  Applying accounting.0004_journalentry... OK

Database Changes:
- Table 'accounting_journal_entry' created
- All columns added with correct types
- Indexes created on specified fields
- Foreign key constraints established
```

### Database Schema Verification

```
Table: accounting_journal_entry

Columns:
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- entry_number (VARCHAR(20), UNIQUE, INDEXED)
- entry_date (DATE, INDEXED)
- entry_type (VARCHAR(20))
- entry_status (VARCHAR(20), INDEXED)
- entry_source (VARCHAR(20), INDEXED)
- reference (VARCHAR(50), NULLABLE, INDEXED)
- description (TEXT, NULLABLE)
- total_debit (DECIMAL(15,2), DEFAULT 0)
- total_credit (DECIMAL(15,2), DEFAULT 0)
- created_by_id (BIGINT, FK to auth_user, PROTECT)
- posted_by_id (BIGINT, FK to auth_user, PROTECT, NULLABLE)
- posted_at (DATETIME, NULLABLE)
- reversal_of_id (BIGINT, FK to self, SET_NULL, NULLABLE)
- created_at (DATETIME, AUTO)
- updated_at (DATETIME, AUTO)

Indexes:
- PRIMARY KEY (id)
- UNIQUE (entry_number)
- INDEX idx_je_date_status (entry_date, entry_status)
- INDEX idx_je_source_ref (entry_source, reference)
- INDEX (created_by_id)
- INDEX (posted_by_id)
- INDEX (reversal_of_id)

Foreign Keys:
- created_by_id → auth_user.id (ON DELETE PROTECT)
- posted_by_id → auth_user.id (ON DELETE PROTECT)
- reversal_of_id → accounting_journal_entry.id (ON DELETE SET NULL)
```

### Testing Database Access

```
Django Shell Test:

python manage.py shell

>>> from apps.accounting.models import JournalEntry
>>> JournalEntry.objects.count()
0
>>> # Success - model accessible

>>> entry = JournalEntry()
>>> entry.entry_date = '2026-03-15'
>>> # Can create instance
```

### Multi-Tenancy Considerations

```
If using django-tenants:

1. Run migration on public schema:
   python manage.py migrate_schemas --shared

2. Run migration on tenant schemas:
   python manage.py migrate_schemas

3. Verify tenant isolation:
   - Each tenant has own journal_entry table
   - Entry numbers isolated per tenant
   - Sequences independent
```

### Expected Outcome
- Database table created
- All fields present with correct types
- Indexes created for performance
- Foreign keys established
- Model ready for use

### Verification Checklist
- [ ] Models __init__.py updated
- [ ] JournalEntry imported and exported
- [ ] makemigrations command run
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] migrate command run
- [ ] Migration applied successfully
- [ ] Database table created
- [ ] Database schema verified
- [ ] Model accessible in Django shell

---

## Summary

This document completed the JournalEntry model implementation by adding:

1. **Total fields** (total_debit, total_credit) for cached sums
2. **Created by field** for user attribution
3. **Posting fields** (posted_by, posted_at) for posting workflow
4. **Reversal FK** (reversal_of) for void/reversal linking
5. **Timestamp fields** (created_at, updated_at) for audit trail
6. **Database migrations** to create the model schema

The JournalEntry model is now complete with all header-level fields and ready for integration with journal entry lines (next group).

### Next Steps
Proceed to [Group-B_Double-Entry-Validation](../Group-B_Double-Entry-Validation/) to create the JournalEntryLine model and implement double-entry validation rules.
