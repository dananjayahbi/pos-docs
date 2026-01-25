# Tasks 19-26: JournalEntryLine Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** B - Double-Entry Validation  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-32_Double-Entry-Validators.md](02_Tasks-27-32_Double-Entry-Validators.md)

---

## Document Overview

This document covers the creation of the JournalEntryLine model, which represents individual debit and credit line items within a journal entry. Each line connects a specific account with either a debit or credit amount, forming the foundation of double-entry bookkeeping in the system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create JournalEntryLine Model | Medium | 30 min |
| 20 | Add Line Entry FK | Low | 15 min |
| 21 | Add Line Account FK | Low | 15 min |
| 22 | Add Line Debit Field | Low | 15 min |
| 23 | Add Line Credit Field | Low | 15 min |
| 24 | Add Line Description | Low | 10 min |
| 25 | Add Line Sort Order | Low | 10 min |
| 26 | Run Line Migrations | Low | 15 min |

---

## Task 19: Create JournalEntryLine Model

### Overview
Create the JournalEntryLine model class to represent individual debit and credit entries within a journal entry. This model implements the line-level detail for double-entry bookkeeping, with each line affecting one account with either a debit or credit amount.

### Dependencies
- Task 18: Run JournalEntry Migrations
- JournalEntry model exists
- Account model exists in accounting app

### Instructions

1. **Create journal_line.py file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `journal_line.py`
   - Add module docstring explaining line items

2. **Add required imports**
   - Import Django model utilities
   - Import tenant-related base classes
   - Import JournalEntry model
   - Import Account model
   - Import Decimal type

3. **Define JournalEntryLine class**
   - Inherit from appropriate base class (TenantAwareModel)
   - Add comprehensive class docstring
   - Explain line-level bookkeeping

4. **Set up model Meta class**
   - Define database table name
   - Set default ordering (by journal_entry, sort_order)
   - Add verbose names
   - Define indexes for queries
   - Add unique_together constraint if needed

5. **Plan field structure**
   - Foreign keys (entry, account)
   - Amount fields (debit, credit)
   - Description field
   - Sort order field
   - Timestamps

6. **Add model methods placeholders**
   - Plan __str__ method
   - Plan validation methods
   - Plan property methods
   - Plan save override

### Model Purpose and Structure

The JournalEntryLine model serves as the detail component of journal entries:

```
┌─────────────────────────────────────────────────────────┐
│              Journal Entry Structure                     │
└─────────────────────────────────────────────────────────┘

JournalEntry (Header)
├─ entry_number: JE-2026-00123
├─ entry_date: 2026-03-15
├─ total_debit: 1,000.00
└─ total_credit: 1,000.00
    │
    ├─ JournalEntryLine #1 (Detail)
    │  ├─ account: Accounts Receivable
    │  ├─ debit: 1,000.00
    │  ├─ credit: 0.00
    │  └─ description: "Invoice SI-2026-00045"
    │
    ├─ JournalEntryLine #2 (Detail)
    │  ├─ account: Sales Revenue
    │  ├─ debit: 0.00
    │  ├─ credit: 850.00
    │  └─ description: "Sales amount"
    │
    └─ JournalEntryLine #3 (Detail)
       ├─ account: Tax Payable
       ├─ debit: 0.00
       ├─ credit: 150.00
       └─ description: "VAT amount"
```

### Relationship to Journal Entry

```
┌────────────────┐        1:N         ┌─────────────────┐
│ JournalEntry   │◄────────────────────│JournalEntryLine │
│  (Header)      │                     │   (Detail)      │
├────────────────┤                     ├─────────────────┤
│ entry_number   │                     │ journal_entry   │
│ entry_date     │                     │ account         │
│ total_debit    │                     │ debit_amount    │
│ total_credit   │                     │ credit_amount   │
└────────────────┘                     └─────────────────┘
                                              │
                                              │ N:1
                                              ▼
                                       ┌─────────────┐
                                       │   Account   │
                                       ├─────────────┤
                                       │ code        │
                                       │ name        │
                                       │ type        │
                                       └─────────────┘
```

### Double-Entry Principles

Each line follows these rules:

| Rule | Description | Validation |
|------|-------------|------------|
| Single Amount | Each line has EITHER debit OR credit, not both | debit > 0 XOR credit > 0 |
| Positive Only | Amount must be positive (never negative) | amount > 0 |
| One Account | Each line affects exactly one account | account FK required |
| Balance Required | Total debits must equal total credits | Σ(debits) = Σ(credits) |
| Minimum Lines | At least 2 lines per entry | count(lines) >= 2 |

### Line Item Example Scenarios

#### Simple Sale Transaction
```
Journal Entry: JE-2026-00123
Description: Sale to customer ABC

Line 1:
├─ Account: 1100 - Accounts Receivable
├─ Debit: 1,000.00
└─ Description: "Invoice SI-2026-00045"

Line 2:
├─ Account: 4100 - Sales Revenue
├─ Credit: 850.00
└─ Description: "Sales amount"

Line 3:
├─ Account: 2300 - Tax Payable
├─ Credit: 150.00
└─ Description: "VAT @ 18%"

Validation: Dr 1,000.00 = Cr (850.00 + 150.00) ✓
```

#### Payroll Transaction
```
Journal Entry: JE-2026-00125
Description: March 2026 payroll

Line 1:
├─ Account: 5100 - Salary Expense
├─ Debit: 50,000.00
└─ Description: "Gross salaries"

Line 2:
├─ Account: 5200 - EPF Expense
├─ Debit: 6,000.00
└─ Description: "Employer EPF contribution"

Line 3:
├─ Account: 2400 - EPF Payable
├─ Credit: 6,000.00
└─ Description: "EPF liability"

Line 4:
├─ Account: 2500 - Tax Payable
├─ Credit: 8,000.00
└─ Description: "PAYE tax withheld"

Line 5:
├─ Account: 1000 - Bank Account
├─ Credit: 42,000.00
└─ Description: "Net pay transferred"

Validation: Dr (50,000 + 6,000) = Cr (6,000 + 8,000 + 42,000) ✓
```

#### Compound Entry
```
Journal Entry: JE-2026-00130
Description: Monthly expenses allocation

Line 1:
├─ Account: 5300 - Rent Expense
├─ Debit: 10,000.00
└─ Description: "Office rent March"

Line 2:
├─ Account: 5400 - Utilities Expense
├─ Debit: 3,000.00
└─ Description: "Electricity and water"

Line 3:
├─ Account: 5500 - Telephone Expense
├─ Debit: 2,000.00
└─ Description: "Phone and internet"

Line 4:
├─ Account: 1000 - Bank Account
├─ Credit: 15,000.00
└─ Description: "Payment made"

Validation: Dr (10,000 + 3,000 + 2,000) = Cr 15,000 ✓
```

### Expected Outcome
- JournalEntryLine model class created
- Proper inheritance and imports
- Meta class configured
- Foundation for adding fields
- Clear documentation

### Verification Checklist
- [ ] `journal_line.py` file created
- [ ] Required imports added
- [ ] JournalEntryLine class defined
- [ ] Inherits from TenantAwareModel
- [ ] Meta class defined with table name
- [ ] Class docstring added
- [ ] Ready for field definitions

---

## Task 20: Add Line Entry FK

### Overview
Add the journal_entry foreign key field to link each line item to its parent journal entry. This relationship establishes the header-detail structure and enables cascading operations when entries are deleted or modified.

### Dependencies
- Task 19: Create JournalEntryLine Model
- JournalEntry model exists

### Instructions

1. **Add journal_entry field definition**
   - Use ForeignKey to JournalEntry model
   - Set on_delete=models.CASCADE (delete lines with entry)
   - Set related_name='lines'
   - Cannot be null (required field)

2. **Add field help text**
   - Document purpose: "Parent journal entry for this line"
   - Note cascade behavior
   - Explain relationship

3. **Add field verbose name**
   - Set to "Journal Entry"
   - Used in admin and forms

4. **Add database index**
   - Set db_index=True automatically with FK
   - Enables efficient line queries
   - Support entry detail retrieval

5. **Plan cascade behavior**
   - When entry deleted, all lines deleted
   - Maintain referential integrity
   - Prevent orphaned lines

### Foreign Key Relationship

```
┌─────────────────────────────────────────────────────────┐
│         Journal Entry to Lines Relationship              │
└─────────────────────────────────────────────────────────┘

One-to-Many Relationship:
- One JournalEntry has many JournalEntryLines
- Each JournalEntryLine belongs to one JournalEntry

Access Pattern:

From Entry to Lines:
entry = JournalEntry.objects.get(entry_number='JE-2026-00123')
lines = entry.lines.all()  # Related name 'lines'

From Line to Entry:
line = JournalEntryLine.objects.get(id=1)
entry = line.journal_entry
```

### Cascade Delete Behavior

```
When JournalEntry is deleted:

BEFORE DELETE:
JournalEntry: JE-2026-00123
├─ Line 1: Accounts Receivable Dr 1,000
├─ Line 2: Sales Revenue Cr 850
└─ Line 3: Tax Payable Cr 150

DELETE Operation:
entry = JournalEntry.objects.get(entry_number='JE-2026-00123')
entry.delete()

AFTER DELETE:
- JournalEntry deleted
- All 3 lines automatically deleted
- No orphaned records
- Database integrity maintained
```

### Query Examples

```
Get all lines for an entry:
lines = JournalEntryLine.objects.filter(
    journal_entry=entry
)
# Or using related name:
lines = entry.lines.all()

Get entry from line:
line = JournalEntryLine.objects.get(id=1)
parent_entry = line.journal_entry

Count lines in entry:
line_count = entry.lines.count()

Get lines with specific account:
ar_lines = entry.lines.filter(
    account__code='1100'
)

Order lines by sort order:
ordered_lines = entry.lines.order_by('sort_order')
```

### Line Management Operations

```
Add line to entry:
line = JournalEntryLine.objects.create(
    journal_entry=entry,
    account=account,
    debit_amount=1000.00,
    credit_amount=0,
    description="Line description"
)

Bulk create lines:
lines_data = [
    JournalEntryLine(journal_entry=entry, account=acc1, debit_amount=1000),
    JournalEntryLine(journal_entry=entry, account=acc2, credit_amount=850),
    JournalEntryLine(journal_entry=entry, account=acc3, credit_amount=150),
]
JournalEntryLine.objects.bulk_create(lines_data)

Delete specific line:
line = entry.lines.filter(account__code='1100').first()
line.delete()
# Entry totals should be recalculated

Clear all lines:
entry.lines.all().delete()
```

### Expected Outcome
- Link between line and parent entry
- Cascade delete behavior
- Efficient querying
- Referential integrity

### Verification Checklist
- [ ] journal_entry field added
- [ ] ForeignKey to JournalEntry
- [ ] on_delete=CASCADE set
- [ ] related_name='lines' set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Required field (not null)

---

## Task 21: Add Line Account FK

### Overview
Add the account foreign key field to link each line item to a specific account in the chart of accounts. This relationship determines which account is debited or credited by the line item.

### Dependencies
- Task 19: Create JournalEntryLine Model
- Account model exists in accounting app

### Instructions

1. **Add account field definition**
   - Use ForeignKey to Account model
   - Set on_delete=models.PROTECT (prevent deletion of used accounts)
   - Set related_name='journal_lines'
   - Cannot be null (required field)

2. **Add field help text**
   - Document purpose: "Account affected by this line item"
   - Note protection behavior
   - Explain chart of accounts linkage

3. **Add field verbose name**
   - Set to "Account"
   - Used in admin and forms

4. **Add database index**
   - Set db_index=True automatically with FK
   - Enables account-based reporting
   - Support ledger queries

5. **Plan protection behavior**
   - Cannot delete account if used in lines
   - Maintains historical integrity
   - Prevents broken references

### Account Foreign Key Purpose

```
┌─────────────────────────────────────────────────────────┐
│         Line to Account Relationship                     │
└─────────────────────────────────────────────────────────┘

Many-to-One Relationship:
- Many JournalEntryLines can use same Account
- Each JournalEntryLine links to one Account

Access Pattern:

From Line to Account:
line = JournalEntryLine.objects.get(id=1)
account = line.account
print(f"{account.code} - {account.name}")
# Output: "1100 - Accounts Receivable"

From Account to Lines:
account = Account.objects.get(code='1100')
lines = account.journal_lines.all()
# All lines affecting this account
```

### Protected Delete Behavior

```
Attempting to delete an account used in journal lines:

SCENARIO:
Account: 1100 - Accounts Receivable
Used in:
├─ JE-2026-00123, Line 1 (Dr 1,000)
├─ JE-2026-00125, Line 1 (Dr 500)
└─ JE-2026-00130, Line 3 (Cr 800)

DELETE Operation:
account = Account.objects.get(code='1100')
account.delete()

RESULT:
ProtectedError: Cannot delete account because it is referenced
by journal entry lines.

REASON: on_delete=PROTECT prevents deletion
```

### Account Ledger Queries

```
Get all transactions for an account:
account = Account.objects.get(code='1100')
lines = account.journal_lines.filter(
    journal_entry__entry_status='POSTED'
).order_by('journal_entry__entry_date')

Calculate account balance:
from django.db.models import Sum, Q

account = Account.objects.get(code='1100')
result = account.journal_lines.filter(
    journal_entry__entry_status='POSTED'
).aggregate(
    total_debit=Sum('debit_amount'),
    total_credit=Sum('credit_amount')
)

balance = result['total_debit'] - result['total_credit']
```

### Account Type Usage

```
Different account types used in journal lines:

ASSET Accounts (Debit Normal):
Example: Accounts Receivable (1100)
├─ Increase: Debit line
└─ Decrease: Credit line

LIABILITY Accounts (Credit Normal):
Example: Accounts Payable (2100)
├─ Increase: Credit line
└─ Decrease: Debit line

REVENUE Accounts (Credit Normal):
Example: Sales Revenue (4100)
├─ Increase: Credit line
└─ Decrease: Debit line (returns)

EXPENSE Accounts (Debit Normal):
Example: Salary Expense (5100)
├─ Increase: Debit line
└─ Decrease: Credit line (corrections)
```

### Account Selection Validation

```
When creating a line:

Valid Account Selection:
✓ Account must exist in chart of accounts
✓ Account must be active (is_active=True)
✓ Account must allow journal entries (not header/group)
✓ Account must be for current tenant

Invalid Examples:
✗ Inactive account: "This account is not active"
✗ Header account: "Cannot post to group/header accounts"
✗ Deleted account: "Account does not exist"
```

### Account-Based Reports

```
Trial Balance:
For each account, sum all posted journal lines:

Account Code | Account Name      | Debit     | Credit    | Balance
-------------|-------------------|-----------|-----------|----------
1100        | A/R               | 10,000.00 | 5,000.00  | 5,000.00
2100        | A/P               | 3,000.00  | 8,000.00  | (5,000.00)
4100        | Sales Revenue     | 0.00      | 50,000.00 | (50,000.00)
5100        | Salary Expense    | 30,000.00 | 0.00      | 30,000.00

General Ledger:
For specific account, show all posted lines:

Account: 1100 - Accounts Receivable

Date       | Entry No      | Description | Debit   | Credit  | Balance
-----------|---------------|-------------|---------|---------|----------
2026-03-10 | JE-2026-00123 | SI-00045    | 1,000   | -       | 1,000
2026-03-12 | JE-2026-00125 | Payment     | -       | 500     | 500
2026-03-15 | JE-2026-00130 | SI-00046    | 800     | -       | 1,300
```

### Expected Outcome
- Link between line and account
- Protected deletion of accounts
- Account-based reporting capability
- Chart of accounts integration

### Verification Checklist
- [ ] account field added
- [ ] ForeignKey to Account
- [ ] on_delete=PROTECT set
- [ ] related_name='journal_lines' set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Required field (not null)

---

## Task 22: Add Line Debit Field

### Overview
Add the debit_amount field to store the debit value for a journal entry line. In double-entry bookkeeping, each line has either a debit amount or a credit amount (not both). This field uses DecimalField for precise currency handling.

### Dependencies
- Task 19: Create JournalEntryLine Model

### Instructions

1. **Add debit_amount field definition**
   - Use DecimalField
   - Set max_digits=15 (supports up to trillions)
   - Set decimal_places=2 (standard currency precision)
   - Set default=0
   - Allow blank=True for flexibility

2. **Add field help text**
   - Document purpose: "Debit amount for this line (leave 0 if credit)"
   - Note currency precision
   - Explain XOR with credit

3. **Add field verbose name**
   - Set to "Debit Amount"
   - Used in admin and forms

4. **Plan validation rules**
   - Must be >= 0 (non-negative)
   - Cannot have both debit and credit > 0
   - At least one line must have debit > 0

5. **Consider currency formatting**
   - Display with 2 decimal places
   - Use thousand separators
   - Show currency symbol (₨)

### Debit Amount Purpose

```
┌─────────────────────────────────────────────────────────┐
│              Debit Amount in Line Items                  │
└─────────────────────────────────────────────────────────┘

Purpose:
- Records increases to debit-normal accounts (Assets, Expenses)
- Records decreases to credit-normal accounts (Liabilities, Equity, Revenue)

Range: 0 to 999,999,999,999.99
Default: 0
Precision: 2 decimal places

Exclusive with credit_amount:
- If debit_amount > 0, then credit_amount = 0
- If credit_amount > 0, then debit_amount = 0
- Both cannot be > 0 simultaneously
```

### Debit Normal Accounts

These accounts increase with debits:

```
ASSET Accounts:
Example: Cash (1000)
Transaction: Receive payment ₨1,000
Line:
├─ account: Cash
├─ debit_amount: 1,000.00  ← Increases balance
└─ credit_amount: 0.00

EXPENSE Accounts:
Example: Salary Expense (5100)
Transaction: Pay salary ₨50,000
Line:
├─ account: Salary Expense
├─ debit_amount: 50,000.00  ← Records expense
└─ credit_amount: 0.00
```

### Debit for Decreasing Credit-Normal Accounts

```
LIABILITY Accounts:
Example: Accounts Payable (2100)
Transaction: Pay supplier ₨5,000
Line:
├─ account: Accounts Payable
├─ debit_amount: 5,000.00  ← Decreases liability
└─ credit_amount: 0.00

REVENUE Accounts:
Example: Sales Revenue (4100)
Transaction: Sales return ₨200
Line:
├─ account: Sales Revenue
├─ debit_amount: 200.00  ← Reverses revenue
└─ credit_amount: 0.00
```

### Decimal Precision Examples

```
Valid Debit Amounts:
✓ 0.00         (Zero - no debit)
✓ 1.50         (One rupee fifty cents)
✓ 100.00       (One hundred rupees)
✓ 1,234.56     (Formatted with thousands)
✓ 1,000,000.00 (One million)

Invalid Examples:
✗ -100.00      (Negative not allowed)
✗ 1.5          (Missing precision - should be 1.50)
✗ 1.999        (Too many decimals - should be 2.00)
```

### Example Line Items with Debits

```
Purchase Transaction:
Line 1:
├─ account: Inventory
├─ debit_amount: 10,000.00  ← Asset increase
└─ credit_amount: 0.00

Line 2:
├─ account: Accounts Payable
├─ debit_amount: 0.00
└─ credit_amount: 10,000.00  ← Liability increase


Payment of Expense:
Line 1:
├─ account: Rent Expense
├─ debit_amount: 5,000.00  ← Expense recorded
└─ credit_amount: 0.00

Line 2:
├─ account: Bank Account
├─ debit_amount: 0.00
└─ credit_amount: 5,000.00  ← Asset decrease


Compound Entry:
Line 1:
├─ account: Equipment  (Asset)
├─ debit_amount: 50,000.00  ← Asset increase
└─ credit_amount: 0.00

Line 2:
├─ account: VAT Receivable  (Asset)
├─ debit_amount: 7,500.00  ← Asset increase
└─ credit_amount: 0.00

Line 3:
├─ account: Bank Account  (Asset)
├─ debit_amount: 0.00
└─ credit_amount: 57,500.00  ← Asset decrease

Total Debits: 57,500.00
Total Credits: 57,500.00
Balanced: ✓
```

### Query and Aggregation

```
Sum all debits in an entry:
from django.db.models import Sum

total_debits = entry.lines.aggregate(
    total=Sum('debit_amount')
)['total'] or 0

Get all debit lines (non-zero):
debit_lines = entry.lines.filter(
    debit_amount__gt=0
)

Calculate account debit total:
account_debits = account.journal_lines.filter(
    journal_entry__entry_status='POSTED'
).aggregate(
    total=Sum('debit_amount')
)['total'] or 0
```

### Expected Outcome
- Precise debit amount storage
- Currency precision maintained
- Support for large amounts
- Foundation for validation

### Verification Checklist
- [ ] debit_amount field added
- [ ] DecimalField type used
- [ ] max_digits=15 set
- [ ] decimal_places=2 set
- [ ] default=0 set
- [ ] blank=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 23: Add Line Credit Field

### Overview
Add the credit_amount field to store the credit value for a journal entry line. This field complements the debit_amount field in double-entry bookkeeping. Each line has either a debit or credit amount, never both simultaneously.

### Dependencies
- Task 19: Create JournalEntryLine Model
- Task 22: Add Line Debit Field

### Instructions

1. **Add credit_amount field definition**
   - Use DecimalField
   - Set max_digits=15 (same as debit)
   - Set decimal_places=2 (currency precision)
   - Set default=0
   - Allow blank=True for flexibility

2. **Add field help text**
   - Document purpose: "Credit amount for this line (leave 0 if debit)"
   - Note exclusivity with debit
   - Explain double-entry principle

3. **Add field verbose name**
   - Set to "Credit Amount"
   - Used in admin and forms

4. **Plan validation rules**
   - Must be >= 0 (non-negative)
   - XOR with debit (not both > 0)
   - At least one line must have credit > 0

5. **Ensure symmetry with debit**
   - Same precision and range
   - Same validation patterns
   - Consistent behavior

### Credit Amount Purpose

```
┌─────────────────────────────────────────────────────────┐
│             Credit Amount in Line Items                  │
└─────────────────────────────────────────────────────────┘

Purpose:
- Records increases to credit-normal accounts (Liabilities, Equity, Revenue)
- Records decreases to debit-normal accounts (Assets, Expenses)

Range: 0 to 999,999,999,999.99
Default: 0
Precision: 2 decimal places

Exclusive with debit_amount:
- If credit_amount > 0, then debit_amount = 0
- If debit_amount > 0, then credit_amount = 0
- Exactly one must be > 0 per line
```

### Credit Normal Accounts

These accounts increase with credits:

```
LIABILITY Accounts:
Example: Accounts Payable (2100)
Transaction: Purchase on credit ₨5,000
Line:
├─ account: Accounts Payable
├─ debit_amount: 0.00
└─ credit_amount: 5,000.00  ← Increases liability

EQUITY Accounts:
Example: Owner's Capital (3000)
Transaction: Owner investment ₨100,000
Line:
├─ account: Owner's Capital
├─ debit_amount: 0.00
└─ credit_amount: 100,000.00  ← Increases equity

REVENUE Accounts:
Example: Sales Revenue (4100)
Transaction: Sale ₨850
Line:
├─ account: Sales Revenue
├─ debit_amount: 0.00
└─ credit_amount: 850.00  ← Records revenue
```

### Credit for Decreasing Debit-Normal Accounts

```
ASSET Accounts:
Example: Bank Account (1000)
Transaction: Payment made ₨5,000
Line:
├─ account: Bank Account
├─ debit_amount: 0.00
└─ credit_amount: 5,000.00  ← Decreases asset

EXPENSE Accounts:
Example: Salary Expense (5100)
Transaction: Expense reversal ₨1,000
Line:
├─ account: Salary Expense
├─ debit_amount: 0.00
└─ credit_amount: 1,000.00  ← Reverses expense
```

### Complete Transaction Examples

```
Sales Transaction:
Line 1 (Debit):
├─ account: Accounts Receivable (Asset)
├─ debit_amount: 1,000.00  ← Asset increase
└─ credit_amount: 0.00

Line 2 (Credit):
├─ account: Sales Revenue
├─ debit_amount: 0.00
└─ credit_amount: 850.00  ← Revenue increase

Line 3 (Credit):
├─ account: VAT Payable (Liability)
├─ debit_amount: 0.00
└─ credit_amount: 150.00  ← Liability increase


Cash Payment:
Line 1 (Debit):
├─ account: Rent Expense
├─ debit_amount: 10,000.00  ← Expense increase
└─ credit_amount: 0.00

Line 2 (Credit):
├─ account: Bank Account (Asset)
├─ debit_amount: 0.00
└─ credit_amount: 10,000.00  ← Asset decrease
```

### Debit/Credit Exclusivity Validation

```
RULE: Each line must have exactly one non-zero amount

Valid Line Configurations:
✓ debit_amount = 1,000.00, credit_amount = 0.00
✓ debit_amount = 0.00, credit_amount = 1,000.00

Invalid Line Configurations:
✗ debit_amount = 1,000.00, credit_amount = 1,000.00
  Error: "Line cannot have both debit and credit amounts"

✗ debit_amount = 0.00, credit_amount = 0.00
  Error: "Line must have either debit or credit amount"
```

### Balanced Entry Requirement

```
Every journal entry must balance:

Example Entry:
Line 1: debit_amount = 1,000.00
Line 2: debit_amount = 500.00
Line 3: credit_amount = 1,200.00
Line 4: credit_amount = 300.00

Calculation:
Total Debits = 1,000.00 + 500.00 = 1,500.00
Total Credits = 1,200.00 + 300.00 = 1,500.00

Result: 1,500.00 = 1,500.00 ✓ Balanced


Unbalanced Example:
Line 1: debit_amount = 1,000.00
Line 2: credit_amount = 900.00

Calculation:
Total Debits = 1,000.00
Total Credits = 900.00

Result: 1,000.00 ≠ 900.00 ✗ Unbalanced
Error: "Entry is unbalanced. Difference: ₨100.00"
```

### Query and Aggregation

```
Sum all credits in an entry:
total_credits = entry.lines.aggregate(
    total=Sum('credit_amount')
)['total'] or 0

Get all credit lines:
credit_lines = entry.lines.filter(
    credit_amount__gt=0
)

Verify entry balance:
totals = entry.lines.aggregate(
    debits=Sum('debit_amount'),
    credits=Sum('credit_amount')
)
is_balanced = totals['debits'] == totals['credits']

Calculate account credit total:
account_credits = account.journal_lines.filter(
    journal_entry__entry_status='POSTED'
).aggregate(
    total=Sum('credit_amount')
)['total'] or 0
```

### Expected Outcome
- Precise credit amount storage
- Symmetry with debit field
- Support for validation
- Foundation for balanced entries

### Verification Checklist
- [ ] credit_amount field added
- [ ] DecimalField type used
- [ ] max_digits=15 set
- [ ] decimal_places=2 set
- [ ] default=0 set
- [ ] blank=True set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 24: Add Line Description

### Overview
Add the description field to provide line-level narration or memo for each journal entry line. This field allows users to add specific notes about individual debits and credits, complementing the entry-level description.

### Dependencies
- Task 19: Create JournalEntryLine Model

### Instructions

1. **Add description field definition**
   - Use CharField
   - Set max_length=255 (sufficient for line notes)
   - Set blank=True (optional field)
   - Allow null=False (empty string if no description)

2. **Add field help text**
   - Document purpose: "Description or memo for this specific line item"
   - Note supplements entry description
   - Explain typical usage

3. **Add field verbose name**
   - Set to "Description"
   - Used in admin and forms

4. **Plan typical content**
   - Reference numbers (invoices, receipts)
   - Account explanations
   - Allocation notes
   - Supporting details

### Line Description Purpose

```
┌─────────────────────────────────────────────────────────┐
│           Entry vs. Line Level Descriptions              │
└─────────────────────────────────────────────────────────┘

Entry-Level Description (Header):
"March 2026 payroll processing"
└─ Overall context for entire entry

Line-Level Descriptions (Detail):
├─ Line 1: "Gross salaries for 10 employees"
├─ Line 2: "Employer EPF contribution @ 12%"
├─ Line 3: "Employee EPF deduction"
├─ Line 4: "PAYE tax withheld"
└─ Line 5: "Net pay bank transfer"

Purpose: Specific explanation for each debit/credit
```

### Description Content Examples

```
Sales Transaction:
Entry: "Posted sales invoice SI-2026-00045"

Line 1 (Accounts Receivable):
├─ Debit: 1,000.00
└─ Description: "Invoice SI-2026-00045 - ABC Company"

Line 2 (Sales Revenue):
├─ Credit: 850.00
└─ Description: "Sales - 10 units @ ₨85 each"

Line 3 (VAT Payable):
├─ Credit: 150.00
└─ Description: "VAT @ 18%"


Expense Allocation:
Entry: "Utilities allocation March 2026"

Line 1 (Utilities Expense - Store):
├─ Debit: 1,500.00
└─ Description: "Store location - 50% allocation"

Line 2 (Utilities Expense - Office):
├─ Debit: 1,500.00
└─ Description: "Office location - 50% allocation"

Line 3 (Bank Account):
├─ Credit: 3,000.00
└─ Description: "Payment to utility company"


Adjustment Entry:
Entry: "Depreciation for March 2026"

Line 1 (Depreciation Expense - Equipment):
├─ Debit: 5,000.00
└─ Description: "Computer equipment @ 20% annual"

Line 2 (Accumulated Depreciation - Equipment):
├─ Credit: 5,000.00
└─ Description: "Monthly depreciation charge"
```

### Description Best Practices

```
Good Line Descriptions:
✓ Specific: "Invoice SI-2026-00045 - ABC Company"
✓ Reference: "Payment receipt PR-2026-123"
✓ Calculation: "VAT @ 18% on ₨850"
✓ Allocation: "Department A - 60% of total"
✓ Identifier: "Employee ID 12345 - March salary"

Poor Line Descriptions:
✗ Vague: "Payment"
✗ Duplicate: "Sale" (same as entry description)
✗ Missing context: "Amount"
✗ Too long: [Full paragraph repeating entry description]
```

### Usage in Reports

```
General Ledger Detail:

Account: 1100 - Accounts Receivable

Date       | Entry No      | Line Description              | Debit   | Credit
-----------|---------------|-------------------------------|---------|--------
2026-03-10 | JE-2026-00123 | Invoice SI-2026-00045 - ABC  | 1,000.00| -
2026-03-12 | JE-2026-00125 | Receipt PR-2026-078 - ABC    | -       | 500.00
2026-03-15 | JE-2026-00130 | Invoice SI-2026-00046 - XYZ  | 800.00  | -

Line descriptions provide transaction details
```

### Optional vs. Required

```
Configuration Option:

Option 1: Optional (Recommended)
- blank=True allows empty descriptions
- Flexible for simple entries
- Users can skip if not needed

Option 2: Required
- blank=False forces description
- Ensures documentation
- May be tedious for obvious entries

Recommendation: Keep optional but encourage use
```

### Character Limit Consideration

```
max_length=255 is typically sufficient:

Short descriptions:
"Invoice SI-2026-00045"                    (24 chars)
"VAT @ 18%"                                (10 chars)
"Employee 12345 salary"                    (23 chars)

Medium descriptions:
"Sales - 10 units @ ₨85 each to ABC Company"  (47 chars)
"Depreciation - Equipment @ 20% annual rate"  (48 chars)

Full descriptions approaching limit:
"Payment to XYZ Suppliers for purchase bill PB-2026-00045 
dated 2026-03-10, covering invoice amount ₨10,000 plus 
transport charges ₨500, total ₨10,500"      (145 chars)

If longer descriptions needed:
- Consider TextField instead
- Or increase max_length to 500
```

### Expected Outcome
- Line-level documentation
- Enhanced audit trail
- Transaction detail capture
- Report clarity

### Verification Checklist
- [ ] description field added
- [ ] CharField type used
- [ ] max_length=255 set
- [ ] blank=True set (optional)
- [ ] Help text added
- [ ] Verbose name set

---

## Task 25: Add Line Sort Order

### Overview
Add the sort_order field to control the display sequence of journal entry lines. This field ensures lines appear in a consistent, logical order (e.g., debits before credits, or user-defined sequence) when viewing or printing journal entries.

### Dependencies
- Task 19: Create JournalEntryLine Model

### Instructions

1. **Add sort_order field definition**
   - Use IntegerField (or PositiveIntegerField)
   - Set default=0
   - Set blank=True for flexibility

2. **Add field help text**
   - Document purpose: "Display order for this line (lower numbers first)"
   - Note typical patterns
   - Explain auto-numbering option

3. **Add field verbose name**
   - Set to "Sort Order"
   - Used in admin and forms

4. **Update Meta ordering**
   - Include sort_order in Meta.ordering
   - Typically: ['journal_entry', 'sort_order']

5. **Plan auto-numbering**
   - Optionally auto-assign on creation
   - Increment: 10, 20, 30 (allows insertion)
   - Allow manual reordering

### Sort Order Purpose

```
┌─────────────────────────────────────────────────────────┐
│              Line Sort Order Control                     │
└─────────────────────────────────────────────────────────┘

Purpose:
- Controls display sequence in forms and reports
- Maintains logical presentation order
- Allows reordering without changing data

Typical Pattern:
- Debits first (sort_order 10, 20, 30...)
- Then credits (sort_order 40, 50, 60...)
- Or custom user-defined order
```

### Sort Order Strategies

#### Strategy 1: Debits Before Credits
```
Journal Entry: JE-2026-00123

Line 1:
├─ sort_order: 10
├─ account: Accounts Receivable
├─ debit_amount: 1,000.00
└─ description: "Invoice SI-2026-00045"

Line 2:
├─ sort_order: 20
├─ account: Sales Revenue
├─ credit_amount: 850.00
└─ description: "Sales amount"

Line 3:
├─ sort_order: 30
├─ account: VAT Payable
├─ credit_amount: 150.00
└─ description: "VAT @ 18%"

Display: Debit line first, then credit lines
```

#### Strategy 2: Account Order
```
Journal Entry: JE-2026-00125

Line 1:
├─ sort_order: 10
├─ account: 1000 - Bank Account
└─ credit_amount: 42,000.00

Line 2:
├─ sort_order: 20
├─ account: 2400 - EPF Payable
└─ credit_amount: 6,000.00

Line 3:
├─ sort_order: 30
├─ account: 2500 - Tax Payable
└─ credit_amount: 8,000.00

Line 4:
├─ sort_order: 40
├─ account: 5100 - Salary Expense
└─ debit_amount: 50,000.00

Line 5:
├─ sort_order: 50
├─ account: 5200 - EPF Expense
└─ debit_amount: 6,000.00

Display: Ordered by account code within debit/credit groups
```

### Increment Strategy

```
Using increment of 10:

Initial Assignment:
Line 1: sort_order = 10
Line 2: sort_order = 20
Line 3: sort_order = 30

Benefits:
- Allows insertion between lines
- Insert between Line 1 and 2: sort_order = 15
- No need to renumber all lines

Example Insertion:
After creating 3 lines, user wants to add between Line 1 and 2:

Before:
10, 20, 30

Add new line:
10, 15, 20, 30

Still in correct order without renumbering others
```

### Auto-Assignment Logic

```
On Line Creation:

Method 1: Simple Increment
def get_next_sort_order(entry):
    max_order = entry.lines.aggregate(
        max_order=Max('sort_order')
    )['max_order'] or 0
    return max_order + 10

new_line.sort_order = get_next_sort_order(entry)


Method 2: Debit/Credit Grouping
def get_next_sort_order(entry, is_debit):
    if is_debit:
        # Debits: 10-499
        max_order = entry.lines.filter(
            debit_amount__gt=0
        ).aggregate(max_order=Max('sort_order'))['max_order'] or 0
        return min(max_order + 10, 490)
    else:
        # Credits: 500-999
        max_order = entry.lines.filter(
            credit_amount__gt=0
        ).aggregate(max_order=Max('sort_order'))['max_order'] or 500
        return max_order + 10
```

### Display and Reordering

```
In Admin Interface:

Journal Entry: JE-2026-00123
Lines:
[ 10] Dr. Accounts Receivable    1,000.00
[ 20] Cr. Sales Revenue             850.00
[ 30] Cr. VAT Payable               150.00

Reorder Operation:
User wants Credits before Debit:

New Sort Orders:
[ 10] Cr. Sales Revenue             850.00
[ 20] Cr. VAT Payable               150.00
[ 30] Dr. Accounts Receivable    1,000.00

Update sort_order values accordingly
```

### Query with Ordering

```
Get lines in sort order:
lines = entry.lines.order_by('sort_order')

Model Meta ordering:
class Meta:
    ordering = ['journal_entry', 'sort_order']
    # Automatically applies to queries

Display ordered lines:
for line in entry.lines.all():  # Already ordered by sort_order
    print(f"{line.sort_order}: {line.account.code} - {line.account.name}")
```

### Expected Outcome
- Controlled line display order
- Logical presentation
- Flexible reordering
- Consistent formatting

### Verification Checklist
- [ ] sort_order field added
- [ ] IntegerField type used
- [ ] default=0 set
- [ ] blank=True set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Meta.ordering includes sort_order

---

## Task 26: Run Line Migrations

### Overview
Generate and apply Django migrations to create the JournalEntryLine model in the database. This task creates the line items table with all defined fields, foreign keys, and indexes.

### Dependencies
- Task 25: Add Line Sort Order (all fields complete)

### Instructions

1. **Review model completeness**
   - Verify all fields defined
   - Check foreign key relationships
   - Ensure Meta class configured
   - Validate field parameters

2. **Update models __init__.py**
   - Import JournalEntryLine model
   - Export in __all__ list
   - Make available to Django

3. **Generate migration file**
   - Run makemigrations command
   - Review generated migration
   - Check field definitions
   - Verify foreign keys and indexes

4. **Review migration file**
   - Open generated migration
   - Check CreateModel operation
   - Verify all fields included
   - Review indexes and constraints

5. **Apply migration**
   - Run migrate command
   - Verify successful application
   - Check database table created
   - Confirm schema matches model

6. **Verify database schema**
   - Connect to database
   - Check table exists
   - Review column definitions
   - Verify foreign keys

### Model Export Configuration

```
File: apps/accounting/models/__init__.py

Add import:
from .journal_line import JournalEntryLine

Update __all__:
__all__ = [
    'Account',
    'FiscalPeriod',
    'JournalEntry',
    'JournalEntryLine',  # Add this
]
```

### Migration Generation

```
Command:
python manage.py makemigrations accounting

Expected Output:
Migrations for 'accounting':
  apps/accounting/migrations/0005_journalentryline.py
    - Create model JournalEntryLine
    - Add index on ['journal_entry', 'sort_order']
    - Add index on ['account']
```

### Generated Migration Structure

```
File: 0005_journalentryline.py

operations = [
    migrations.CreateModel(
        name='JournalEntryLine',
        fields=[
            ('id', models.BigAutoField(primary_key=True)),
            ('journal_entry', models.ForeignKey(
                on_delete=models.CASCADE,
                related_name='lines',
                to='accounting.journalentry'
            )),
            ('account', models.ForeignKey(
                on_delete=models.PROTECT,
                related_name='journal_lines',
                to='accounting.account'
            )),
            ('debit_amount', models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=15
            )),
            ('credit_amount', models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=15
            )),
            ('description', models.CharField(
                blank=True,
                max_length=255
            )),
            ('sort_order', models.IntegerField(default=0)),
        ],
        options={
            'db_table': 'accounting_journal_entry_line',
            'ordering': ['journal_entry', 'sort_order'],
            'verbose_name': 'Journal Entry Line',
            'verbose_name_plural': 'Journal Entry Lines',
        },
    ),
    migrations.AddIndex(
        model_name='journalentryline',
        index=models.Index(
            fields=['journal_entry', 'sort_order'],
            name='idx_jel_entry_order'
        ),
    ),
]
```

### Apply Migration

```
Command:
python manage.py migrate accounting

Expected Output:
Running migrations:
  Applying accounting.0005_journalentryline... OK

Database Changes:
- Table 'accounting_journal_entry_line' created
- All columns added with correct types
- Foreign keys established
- Indexes created
- Constraints applied
```

### Database Schema Verification

```
Table: accounting_journal_entry_line

Columns:
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- journal_entry_id (BIGINT, FK to journal_entry, CASCADE)
- account_id (BIGINT, FK to account, PROTECT)
- debit_amount (DECIMAL(15,2), DEFAULT 0)
- credit_amount (DECIMAL(15,2), DEFAULT 0)
- description (VARCHAR(255), NULLABLE)
- sort_order (INTEGER, DEFAULT 0)

Indexes:
- PRIMARY KEY (id)
- INDEX (journal_entry_id)
- INDEX (account_id)
- INDEX idx_jel_entry_order (journal_entry_id, sort_order)

Foreign Keys:
- journal_entry_id → accounting_journal_entry.id (ON DELETE CASCADE)
- account_id → accounting_account.id (ON DELETE PROTECT)

Constraints:
- NOT NULL: journal_entry_id, account_id
- CHECK: debit_amount >= 0, credit_amount >= 0 (if added)
```

### Testing Database Access

```
Django Shell Test:

python manage.py shell

>>> from apps.accounting.models import JournalEntry, JournalEntryLine, Account
>>> 
>>> # Create test entry
>>> entry = JournalEntry.objects.first()
>>> account = Account.objects.first()
>>> 
>>> # Create test line
>>> line = JournalEntryLine.objects.create(
...     journal_entry=entry,
...     account=account,
...     debit_amount=1000.00,
...     credit_amount=0,
...     description="Test line",
...     sort_order=10
... )
>>> 
>>> line.id
1
>>> line.journal_entry.entry_number
'JE-2026-00001'
>>> 
>>> # Access via related name
>>> entry.lines.count()
1
>>> entry.lines.all()
<QuerySet [<JournalEntryLine: ...>]>
```

### Cascade Delete Test

```
Test Cascade Behavior:

# Create entry with lines
entry = JournalEntry.objects.create(...)
line1 = JournalEntryLine.objects.create(journal_entry=entry, ...)
line2 = JournalEntryLine.objects.create(journal_entry=entry, ...)

# Verify lines exist
entry.lines.count()  # Returns 2

# Delete entry
entry.delete()

# Verify lines also deleted
JournalEntryLine.objects.filter(id=line1.id).exists()  # Returns False
JournalEntryLine.objects.filter(id=line2.id).exists()  # Returns False
```

### Protected Delete Test

```
Test Account Protection:

# Create line using account
account = Account.objects.get(code='1100')
line = JournalEntryLine.objects.create(account=account, ...)

# Try to delete account
try:
    account.delete()
except ProtectedError:
    print("Account protected - cannot delete while in use")
    # Expected behavior
```

### Expected Outcome
- Database table created
- All fields present
- Foreign keys functional
- Cascade and protect working
- Model ready for validation

### Verification Checklist
- [ ] Models __init__.py updated
- [ ] JournalEntryLine imported and exported
- [ ] makemigrations command run
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] migrate command run
- [ ] Migration applied successfully
- [ ] Database table created
- [ ] Foreign keys functional
- [ ] Model accessible in Django shell
- [ ] Cascade delete working
- [ ] Protected delete working

---

## Summary

This document completed the JournalEntryLine model implementation by:

1. **Created JournalEntryLine model** with proper structure and inheritance
2. **Added journal_entry FK** linking lines to parent entries with cascade delete
3. **Added account FK** linking lines to chart of accounts with protected delete
4. **Added debit_amount field** for debit values in double-entry bookkeeping
5. **Added credit_amount field** for credit values with XOR constraint
6. **Added description field** for line-level narration
7. **Added sort_order field** for display sequence control
8. **Generated and applied migrations** creating database schema

The line items model is now complete and ready for validation logic implementation.

### Next Steps
Proceed to [02_Tasks-27-32_Double-Entry-Validators.md](02_Tasks-27-32_Double-Entry-Validators.md) to implement comprehensive double-entry bookkeeping validation rules.
