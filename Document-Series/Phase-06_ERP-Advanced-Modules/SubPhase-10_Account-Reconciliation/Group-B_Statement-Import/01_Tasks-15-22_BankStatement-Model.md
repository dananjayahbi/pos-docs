# Tasks 15-22: BankStatement Model and Configuration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** B - Statement Import  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-30_StatementLine-CSV-Importer.md](02_Tasks-23-30_StatementLine-CSV-Importer.md)

---

## Document Overview

This document covers the foundation of the bank statement import system, including statement format enumeration and the core BankStatement model. These elements establish the infrastructure for importing bank statements from various file formats, tracking statement metadata, and managing the import lifecycle.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Define StatementFormat enum | Low | 10 min |
| 16 | Create BankStatement model | Medium | 30 min |
| 17 | Add statement bank FK | Low | 10 min |
| 18 | Add statement date range | Low | 15 min |
| 19 | Add statement balances | Low | 15 min |
| 20 | Add statement file field | Medium | 20 min |
| 21 | Add statement import status | Low | 15 min |
| 22 | Run statement migrations | Low | 10 min |

---

## Task 15: Define StatementFormat Enum

### Overview
Define the StatementFormat enumeration to categorize different bank statement file formats. This enum ensures consistency when identifying statement types during import, parsing, and processing operations. Supporting multiple formats allows the system to handle statements from various banks and financial institutions.

### Dependencies
- Accounting app (`apps/accounting/`) exists
- Enums module structure is established
- Previous Group A (BankAccount model) completed

### Instructions

1. **Open or create enums.py file**
   - Navigate to `apps/accounting/models/enums.py`
   - If file doesn't exist, create it
   - Import necessary modules (TextChoices from Django)

2. **Add module docstring**
   - Document purpose of enumerations
   - List all enums in the file
   - Note usage contexts (bank statements, reconciliation)

3. **Define StatementFormat class**
   - Inherit from models.TextChoices
   - Add class docstring explaining statement formats

4. **Define CSV format constant**
   - Value: 'CSV'
   - Label: 'CSV (Comma-Separated Values)'
   - Most common format for Sri Lankan banks

5. **Define OFX format constant**
   - Value: 'OFX'
   - Label: 'OFX (Open Financial Exchange)'
   - Standard international banking format

6. **Define MT940 format constant**
   - Value: 'MT940'
   - Label: 'MT940 (SWIFT Message Type)'
   - Used for international/corporate banking

7. **Update enums __init__.py**
   - Import StatementFormat
   - Add to __all__ list for easy imports

### Statement Format Details

| Format | Extension | Usage | Sri Lanka Support |
|--------|-----------|-------|-------------------|
| CSV | .csv | Most common, simple text | ✓ Primary format |
| OFX | .ofx | Standard banking protocol | ○ Future support |
| MT940 | .sta, .txt | SWIFT international | ○ Limited use |

### Format Comparison

```
CSV Format (Comma-Separated Values)
═══════════════════════════════════
Advantages:
✓ Simple text format
✓ Easy to parse and debug
✓ Universally supported by banks
✓ Can be opened in Excel/spreadsheet apps
✓ Human-readable

Disadvantages:
✗ No standardization across banks
✗ Requires custom mapping per bank
✗ Limited metadata
✗ No built-in validation

Sri Lankan Bank Usage: ★★★★★ (Primary)


OFX Format (Open Financial Exchange)
════════════════════════════════════
Advantages:
✓ Standardized XML/SGML format
✓ Rich metadata support
✓ Built-in transaction categorization
✓ International standard

Disadvantages:
✗ More complex to parse
✗ Less common in Sri Lankan banks
✗ Larger file sizes

Sri Lankan Bank Usage: ★☆☆☆☆ (Rare)


MT940 Format (SWIFT Message Type)
═════════════════════════════════
Advantages:
✓ International banking standard
✓ Comprehensive transaction details
✓ Used in corporate banking

Disadvantages:
✗ Complex format specification
✗ Requires specialized parsing
✗ Not used by retail banks in Sri Lanka

Sri Lankan Bank Usage: ★☆☆☆☆ (Corporate only)
```

### Sri Lankan Bank Format Landscape

| Bank | CSV Support | OFX Support | MT940 Support | Notes |
|------|-------------|-------------|---------------|-------|
| Bank of Ceylon | ✓ Yes | ✗ No | ✗ No | Custom CSV format |
| Commercial Bank | ✓ Yes | ✗ No | ✗ No | Standard CSV |
| Sampath Bank | ✓ Yes | ✗ No | ✗ No | Online banking export |
| HNB | ✓ Yes | ✗ No | ○ Corporate | CSV primary |
| DFCC Bank | ✓ Yes | ✗ No | ✗ No | CSV download |
| NDB Bank | ✓ Yes | ✗ No | ✗ No | CSV format |
| Seylan Bank | ✓ Yes | ✗ No | ✗ No | Basic CSV |

### Format Detection Strategy

```
Statement Upload Flow
═════════════════════

User uploads file
      │
      ▼
┌─────────────────┐
│ Check extension │
│  .csv → CSV     │
│  .ofx → OFX     │
│  .sta → MT940   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate format │
│ against enum    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Route to proper │
│ parser service  │
└─────────────────┘
```

### Expected Outcome
- StatementFormat enum defined with three formats
- Foundation for format-specific import logic
- Clear format categorization
- Extensible for future formats

### Verification Checklist
- [ ] enums.py file exists in models directory
- [ ] StatementFormat class defined
- [ ] CSV constant defined with proper label
- [ ] OFX constant defined with proper label
- [ ] MT940 constant defined with proper label
- [ ] Class inherits from models.TextChoices
- [ ] Enum imported in __init__.py

---

## Task 16: Create BankStatement Model

### Overview
Create the core BankStatement model that represents a bank statement document. This model serves as the header/container for statement line items and tracks metadata about the statement file, import status, and reconciliation progress. Each statement represents a specific period for a bank account.

### Dependencies
- Task 15: Define StatementFormat enum
- BankAccount model exists (from Group A)
- Tenant and User models exist
- Django ORM configured

### Instructions

1. **Create bank_statement.py model file**
   - Create file at `apps/accounting/models/bank_statement.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields and Model class
   - Import base model mixins (TenantAwareMixin, TimestampMixin, CreatedByMixin)
   - Import StatementFormat enum
   - Import BankAccount model
   - Import User model for tracking

3. **Define BankStatement model class**
   - Inherit from TenantAwareMixin, TimestampMixin, CreatedByMixin
   - Add comprehensive model docstring

4. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Human-readable statement identifier
   - Example: "December 2025 Statement", "Q4 2025 Statement"

5. **Add statement_format field**
   - CharField with choices from StatementFormat
   - Default to StatementFormat.CSV
   - Indicates the format of uploaded file

6. **Add notes field**
   - TextField, optional (blank=True, null=True)
   - Internal notes about the statement
   - Import issues, special considerations

7. **Add is_reconciled field**
   - BooleanField, default=False
   - Indicates if statement is fully reconciled
   - Set to True when all lines matched

8. **Add reconciled_at field**
   - DateTimeField, null=True, blank=True
   - Timestamp when reconciliation completed
   - Automatically set when is_reconciled becomes True

9. **Add reconciled_by field**
   - ForeignKey to User, null=True, blank=True
   - Tracks who completed reconciliation
   - Related name: 'reconciled_statements'

10. **Add Meta class**
    - Set verbose_name and verbose_name_plural
    - Add ordering by start_date descending
    - Add index on (tenant, bank_account, start_date)
    - Add index on (tenant, is_reconciled)

11. **Add __str__ method**
    - Return meaningful string representation
    - Format: "BankAccount Name - Start Date to End Date"
    - Example: "BOC Current Account - 2025-12-01 to 2025-12-31"

12. **Add get_unreconciled_count method**
    - Return count of unreconciled statement lines
    - Used for reconciliation progress tracking

13. **Add get_reconciliation_percentage method**
    - Calculate percentage of reconciled lines
    - Returns 0-100 value
    - Used for progress indicators

14. **Update models/__init__.py**
    - Import BankStatement model
    - Add to __all__ list

### BankStatement Model Structure

```
┌─────────────────────────────────────────────────────┐
│              BankStatement Model                    │
├─────────────────────────────────────────────────────┤
│ Identification:                                     │
│  • name (CharField)                                 │
│  • statement_format (CharField with choices)        │
│                                                     │
│ Relationships:                                      │
│  • bank_account (ForeignKey - Task 17)              │
│  • tenant (ForeignKey - inherited)                  │
│  • created_by (ForeignKey - inherited)              │
│  • reconciled_by (ForeignKey)                       │
│                                                     │
│ Date Range (Task 18):                               │
│  • start_date (DateField)                           │
│  • end_date (DateField)                             │
│                                                     │
│ Balances (Task 19):                                 │
│  • opening_balance (DecimalField)                   │
│  • closing_balance (DecimalField)                   │
│                                                     │
│ File Storage (Task 20):                             │
│  • file (FileField)                                 │
│                                                     │
│ Import Status (Task 21):                            │
│  • import_status (CharField with choices)           │
│  • imported_at (DateTimeField)                      │
│  • imported_by (ForeignKey)                         │
│  • import_error (TextField)                         │
│                                                     │
│ Reconciliation:                                     │
│  • is_reconciled (BooleanField)                     │
│  • reconciled_at (DateTimeField)                    │
│  • reconciled_by (ForeignKey)                       │
│                                                     │
│ Metadata:                                           │
│  • notes (TextField)                                │
│  • created_at, updated_at (inherited)               │
└─────────────────────────────────────────────────────┘
```

### Model Relationships Diagram

```
┌──────────────┐
│    Tenant    │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐         1:N          ┌────────────────────┐
│ BankAccount  │◄─────────────────────│  BankStatement     │
└──────────────┘                      └──────────┬─────────┘
                                                 │ 1:N
                                                 ▼
                                      ┌────────────────────┐
                                      │  StatementLine     │
                                      │  (Next Document)   │
                                      └────────────────────┘
                                                 │ N:1
                                                 ▼
                                      ┌────────────────────┐
                                      │  JournalEntry      │
                                      │ (Reconciliation)   │
                                      └────────────────────┘
```

### Field Purpose and Usage

| Field | Purpose | Example Value | Business Logic |
|-------|---------|---------------|----------------|
| name | Statement identifier | "December 2025 Statement" | User-friendly reference |
| statement_format | File format type | StatementFormat.CSV | Routes to correct parser |
| notes | Internal comments | "Missing 2 transactions" | Accounting team notes |
| is_reconciled | Reconciliation status | False | Controls workflow state |
| reconciled_at | Completion timestamp | 2025-12-15 14:30:00 | Audit trail |
| reconciled_by | User who reconciled | User(id=5) | Accountability |

### Statement Lifecycle

```
Statement Lifecycle States
═══════════════════════════

1. CREATED
   ├─ Statement record created
   ├─ File not yet uploaded
   └─ import_status = PENDING

2. FILE UPLOADED
   ├─ File attached to statement
   ├─ Ready for import
   └─ import_status = PENDING

3. IMPORTING
   ├─ Parser processing file
   ├─ Creating statement lines
   └─ import_status = PENDING

4. IMPORTED
   ├─ All lines created successfully
   ├─ Ready for reconciliation
   ├─ import_status = IMPORTED
   └─ imported_at timestamp set

5. RECONCILING
   ├─ Matching lines to journal entries
   ├─ Some lines matched
   └─ is_reconciled = False

6. RECONCILED
   ├─ All lines matched
   ├─ Reconciliation complete
   ├─ is_reconciled = True
   └─ reconciled_at timestamp set

Error States:
═════════════
IMPORT_FAILED
   ├─ Parser encountered errors
   ├─ import_status = FAILED
   └─ import_error contains details
```

### Reconciliation Progress Tracking

```
Progress Calculation Example
═════════════════════════════

Statement: "December 2025"
Total Lines: 150

Reconciled Lines: 135
Unreconciled Lines: 15

Progress = (135 / 150) × 100 = 90%

Status Display:
┌────────────────────────────────────┐
│ December 2025 Statement            │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░ 90%          │
│ 135 of 150 transactions matched    │
│ 15 remaining                       │
└────────────────────────────────────┘
```

### Expected Outcome
- Functional BankStatement model
- Statement lifecycle tracking
- Reconciliation progress monitoring
- Foundation for statement line items

### Verification Checklist
- [ ] bank_statement.py file created
- [ ] BankStatement class defined
- [ ] name field added
- [ ] statement_format field with enum choices
- [ ] notes field added (optional)
- [ ] is_reconciled field added
- [ ] reconciled_at field added (optional)
- [ ] reconciled_by field added (optional FK)
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] get_unreconciled_count method added
- [ ] get_reconciliation_percentage method added
- [ ] Model imported in __init__.py

---

## Task 17: Add Statement Bank FK

### Overview
Add the foreign key relationship linking BankStatement to BankAccount. This relationship establishes which bank account the statement belongs to, enabling proper statement organization and ensuring statements are correctly associated with their source accounts.

### Dependencies
- Task 16: Create BankStatement model
- BankAccount model exists (Group A, Task 14)

### Instructions

1. **Open bank_statement.py model file**
   - Navigate to `apps/accounting/models/bank_statement.py`
   - Locate BankStatement model class

2. **Import BankAccount model**
   - Add import at top of file
   - Import from accounting.models

3. **Add bank_account field**
   - ForeignKey to BankAccount model
   - on_delete=models.PROTECT (prevent deletion if statements exist)
   - related_name='statements'
   - Required field (no null/blank)

4. **Add help_text**
   - Explain field purpose
   - Note: "The bank account this statement belongs to"

5. **Update Meta class**
   - Add index on (tenant, bank_account, start_date)
   - Improves query performance for account statements

6. **Update __str__ method**
   - Include bank account name in string representation
   - Format: "BankAccount Name - Date Range"

7. **Add get_account_type_display method**
   - Helper method to get account type
   - Returns bank_account.account_type display value
   - Useful for filtering and display

### Bank Account Relationship

```
One Bank Account → Many Statements
═══════════════════════════════════

BOC Current Account (1234-5678)
├── January 2025 Statement
├── February 2025 Statement
├── March 2025 Statement
├── April 2025 Statement
├── May 2025 Statement
└── ... (one statement per period)


Multiple Accounts → Multiple Statements
════════════════════════════════════════

Commercial Bank Current (Account A)
├── Q1 2025 Statement
└── Q2 2025 Statement

Sampath Bank Savings (Account B)
├── Jan-Jun 2025 Statement
└── Jul-Dec 2025 Statement

HNB Credit Card (Account C)
└── Monthly statements...
```

### Relationship Details

| Aspect | Details |
|--------|---------|
| Cardinality | One-to-Many (Account → Statements) |
| on_delete | PROTECT (cannot delete account with statements) |
| related_name | statements (access via account.statements.all()) |
| Required | Yes (every statement must have an account) |
| Indexing | Indexed with tenant and start_date |

### Query Pattern Examples

#### Get All Statements for Account
```
Query Pattern (Django ORM):
BankAccount.objects.get(id=account_id).statements.all()

Returns:
[
  <BankStatement: BOC Current - 2025-01-01 to 2025-01-31>,
  <BankStatement: BOC Current - 2025-02-01 to 2025-02-28>,
  <BankStatement: BOC Current - 2025-03-01 to 2025-03-31>
]
```

#### Filter Statements by Account Type
```
Query Pattern:
BankStatement.objects.filter(
    bank_account__account_type='CURRENT'
)

Use Case:
Find all current account statements for reconciliation
```

#### Get Unreconciled Statements per Account
```
Query Pattern:
account.statements.filter(is_reconciled=False)

Dashboard Display:
┌─────────────────────────────────────────┐
│ BOC Current Account                     │
│ 3 unreconciled statements               │
│ ├─ December 2025 (120 lines pending)    │
│ ├─ January 2026 (95 lines pending)      │
│ └─ February 2026 (Not imported yet)     │
└─────────────────────────────────────────┘
```

### Data Integrity Rules

| Rule | Enforcement | Reason |
|------|-------------|--------|
| Account required | Database NOT NULL | Every statement needs an account |
| No orphaned statements | on_delete=PROTECT | Preserve financial data |
| Tenant isolation | Inherited from account | Security and data separation |
| Unique periods | Application logic | No overlapping statements |

### Deletion Protection

```
Deletion Attempt Scenario
═════════════════════════

User tries to delete: BOC Current Account

System checks:
┌────────────────────────────────────────┐
│ Related Objects Check                  │
├────────────────────────────────────────┤
│ ✓ 12 BankStatements                    │
│ ✓ 1,450 StatementLines                 │
│ ✓ 3,200 JournalEntries (reconciled)    │
└────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ ⚠ DELETION BLOCKED                     │
│                                        │
│ Cannot delete bank account with        │
│ existing statements. Please:           │
│                                        │
│ 1. Delete or archive statements first  │
│ 2. Un-reconcile related transactions   │
│ 3. Or mark account as inactive         │
└────────────────────────────────────────┘
```

### Expected Outcome
- Statement linked to specific bank account
- Proper relationship established
- Query performance optimized
- Data integrity protected

### Verification Checklist
- [ ] BankAccount model imported
- [ ] bank_account field added as ForeignKey
- [ ] on_delete=models.PROTECT set
- [ ] related_name='statements' configured
- [ ] help_text added
- [ ] Index added to Meta class
- [ ] __str__ method updated
- [ ] get_account_type_display method added

---

## Task 18: Add Statement Date Range

### Overview
Add start_date and end_date fields to define the period covered by the bank statement. These fields establish the temporal boundaries of the statement and are crucial for reconciliation, ensuring transactions are matched within the correct time period.

### Dependencies
- Task 17: Add statement bank FK

### Instructions

1. **Open bank_statement.py model file**
   - Continue in `apps/accounting/models/bank_statement.py`
   - Locate BankStatement model class

2. **Add start_date field**
   - DateField (date without time)
   - Required field (no null/blank)
   - db_index=True for query performance
   - help_text: "First date covered by this statement"

3. **Add end_date field**
   - DateField (date without time)
   - Required field (no null/blank)
   - db_index=True for query performance
   - help_text: "Last date covered by this statement"

4. **Update Meta class ordering**
   - Order by start_date descending (newest first)
   - Secondary ordering by bank_account name

5. **Add clean method**
   - Validate end_date is not before start_date
   - Raise ValidationError if invalid
   - Check for overlapping periods for same account

6. **Add get_period_days method**
   - Calculate number of days in statement period
   - Returns integer
   - Formula: (end_date - start_date).days + 1

7. **Add get_period_display method**
   - Return formatted string of date range
   - Format: "January 1-31, 2025" or "Q1 2025"
   - User-friendly display

8. **Add is_period_complete property**
   - Check if end_date is in the past
   - Returns boolean
   - Indicates if statement period has ended

9. **Add overlaps_with method**
   - Check if this statement overlaps with another
   - Accepts another statement instance
   - Returns boolean
   - Used for validation

### Date Range Patterns

```
Common Statement Period Patterns
═════════════════════════════════

Monthly Statement (Most Common):
┌────────────────────────────────┐
│ Start: 2025-12-01              │
│ End:   2025-12-31              │
│ Days:  31                      │
│ Display: "December 2025"       │
└────────────────────────────────┘

Quarterly Statement:
┌────────────────────────────────┐
│ Start: 2025-10-01              │
│ End:   2025-12-31              │
│ Days:  92                      │
│ Display: "Q4 2025"             │
└────────────────────────────────┘

Credit Card Billing Cycle:
┌────────────────────────────────┐
│ Start: 2025-12-15              │
│ End:   2026-01-14              │
│ Days:  31                      │
│ Display: "Dec 15 - Jan 14"     │
└────────────────────────────────┘

Custom Period:
┌────────────────────────────────┐
│ Start: 2025-06-01              │
│ End:   2025-08-31              │
│ Days:  92                      │
│ Display: "Jun 1 - Aug 31, 2025"│
└────────────────────────────────┘
```

### Date Range Validation

```
Valid Date Range
════════════════
start_date: 2025-12-01
end_date:   2025-12-31
✓ Valid: end_date >= start_date


Invalid Date Range
══════════════════
start_date: 2025-12-31
end_date:   2025-12-01
✗ Invalid: end_date before start_date

Error: "Statement end date cannot be before start date"


Overlapping Periods (Same Account)
═══════════════════════════════════
Existing Statement:
  Start: 2025-12-01
  End:   2025-12-31

New Statement Attempt:
  Start: 2025-12-15
  End:   2026-01-15

┌────────────────────────────────────────┐
│         Dec 2025        Jan 2026       │
│ ├───────────────────┤                  │  Existing
│          ├───────────────────┤         │  New (overlaps)
│          └──────┬─────┘                │
│              Overlap                   │
└────────────────────────────────────────┘

✗ Invalid: Periods overlap for same account
```

### Period Coverage Timeline

```
Annual Coverage Visualization
══════════════════════════════

Account: BOC Current Account

2025:
│
├─ January   [01-31] ✓ Imported, Reconciled
├─ February  [01-28] ✓ Imported, Reconciled
├─ March     [01-31] ✓ Imported, Reconciled
├─ April     [01-30] ✓ Imported, Pending Reconciliation
├─ May       [01-31] ✓ Imported, Pending Reconciliation
├─ June      [01-30] ⚠ Not Yet Imported
├─ July      [01-31] ⚠ Not Yet Imported
├─ August    [01-31] ⚠ Not Yet Imported
├─ September [01-30] ⚠ Not Yet Imported
├─ October   [01-31] ⚠ Not Yet Imported
├─ November  [01-30] ⚠ Not Yet Imported
└─ December  [01-31] ⚠ Period Ongoing

Coverage: 5 of 12 months complete (42%)
```

### Sri Lankan Banking Context

#### Financial Year Periods
```
Calendar Year (Most Common):
Jan 1 - Dec 31

Fiscal Year (Government/Corporate):
Apr 1 - Mar 31

Quarterly Reporting:
Q1: Jan-Mar
Q2: Apr-Jun
Q3: Jul-Sep
Q4: Oct-Dec
```

#### Statement Frequency by Bank

| Bank | Statement Frequency | Date Range Pattern |
|------|--------------------|--------------------|
| Bank of Ceylon | Monthly | 1st to last day of month |
| Commercial Bank | Monthly | 1st to last day of month |
| Sampath Bank | Monthly | 1st to last day of month |
| Credit Cards | Billing cycle | Any 28-31 day period |
| Savings Accounts | Quarterly | Quarter start to end |

### Period Comparison Queries

```
Find Statements in Date Range
══════════════════════════════

Query: Statements overlapping with Dec 2025

Matching Logic:
Statement matches if:
  (start_date <= 2025-12-31) AND
  (end_date >= 2025-12-01)

Results:
✓ Nov 15 - Dec 15 (overlaps Dec 1-15)
✓ Dec 1 - Dec 31 (fully within)
✓ Dec 15 - Jan 15 (overlaps Dec 15-31)
✗ Nov 1 - Nov 30 (before Dec)
✗ Jan 1 - Jan 31 (after Dec)
```

### Expected Outcome
- Statement period clearly defined
- Date validation enforced
- Period display formatting
- Overlap detection capability

### Verification Checklist
- [ ] start_date field added
- [ ] end_date field added
- [ ] Both fields indexed
- [ ] help_text added to both fields
- [ ] Meta class ordering updated
- [ ] clean method implemented with validation
- [ ] get_period_days method added
- [ ] get_period_display method added
- [ ] is_period_complete property added
- [ ] overlaps_with method added
- [ ] Date range validation works

---

## Task 19: Add Statement Balances

### Overview
Add opening_balance and closing_balance fields to track the bank account balance at the start and end of the statement period. These balances are essential for reconciliation verification, ensuring that the sum of transactions matches the balance changes reported by the bank.

### Dependencies
- Task 18: Add statement date range

### Instructions

1. **Open bank_statement.py model file**
   - Continue in `apps/accounting/models/bank_statement.py`
   - Locate BankStatement model class

2. **Import Decimal type**
   - Import Decimal from decimal module
   - Used for financial calculations

3. **Add opening_balance field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field (no null/blank)
   - default=Decimal('0.00')
   - help_text: "Account balance at the start of the statement period"

4. **Add closing_balance field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field (no null/blank)
   - default=Decimal('0.00')
   - help_text: "Account balance at the end of the statement period"

5. **Add get_balance_change method**
   - Calculate difference between closing and opening
   - Returns Decimal
   - Formula: closing_balance - opening_balance
   - Positive = net deposit, Negative = net withdrawal

6. **Add get_expected_closing_balance method**
   - Calculate expected closing from transactions
   - Formula: opening_balance + sum(credits) - sum(debits)
   - Returns Decimal
   - Used for reconciliation verification

7. **Add get_balance_discrepancy method**
   - Compare expected vs actual closing balance
   - Returns Decimal (difference)
   - Zero = perfect match
   - Non-zero = discrepancy requiring investigation

8. **Add is_balanced property**
   - Check if expected matches actual closing balance
   - Returns boolean
   - Tolerance: within 0.01 (1 cent) considered balanced

9. **Add get_balance_summary method**
   - Return dictionary with all balance information
   - Include: opening, closing, change, expected, discrepancy
   - Used for dashboard displays

### Balance Field Specifications

```
DecimalField Configuration
═══════════════════════════

max_digits=15
  ├─ Maximum total digits (before and after decimal)
  ├─ Allows up to: 9,999,999,999,999.99
  └─ Supports large balances for corporate accounts

decimal_places=2
  ├─ Standard currency precision
  ├─ Supports cents/paise
  └─ Sri Lankan Rupee format: Rs. 1,234.56

Storage:
  Database: DECIMAL(15,2) or NUMERIC(15,2)
  Python: decimal.Decimal (precise financial math)
  Display: LKR 1,234.56 or Rs. 1,234.56
```

### Balance Change Calculation

```
Example: December 2025 Statement
═════════════════════════════════

Opening Balance:  Rs. 125,000.00  (Dec 1, 2025)
Closing Balance:  Rs. 148,750.00  (Dec 31, 2025)

Balance Change:
  Closing - Opening
  = 148,750.00 - 125,000.00
  = +23,750.00

Interpretation:
  Positive = Net increase
  Account received Rs. 23,750.00 more than spent
```

### Reconciliation Verification

```
Balance Verification Process
════════════════════════════

Step 1: Get Statement Balances
┌────────────────────────────────┐
│ Opening Balance: Rs. 125,000.00│
│ Closing Balance: Rs. 148,750.00│
│ Expected Change: Rs. 23,750.00 │
└────────────────────────────────┘

Step 2: Calculate from Transactions
┌────────────────────────────────┐
│ Total Credits:  Rs. 185,500.00 │
│ Total Debits:   Rs. 161,750.00 │
│ Net Change:     Rs.  23,750.00 │
└────────────────────────────────┘

Step 3: Verify
Expected Closing = Opening + Credits - Debits
                 = 125,000.00 + 185,500.00 - 161,750.00
                 = 148,750.00

Actual Closing   = 148,750.00

Discrepancy = Actual - Expected
            = 148,750.00 - 148,750.00
            = 0.00

✓ BALANCED - Statement reconciles perfectly
```

### Balance Discrepancy Scenarios

```
Scenario 1: Perfect Balance
═══════════════════════════
Opening:  Rs. 100,000.00
Expected: Rs. 105,500.00
Actual:   Rs. 105,500.00
Discrepancy: Rs. 0.00
Status: ✓ Balanced


Scenario 2: Minor Discrepancy (Rounding)
════════════════════════════════════════
Opening:  Rs. 100,000.00
Expected: Rs. 105,500.34
Actual:   Rs. 105,500.35
Discrepancy: Rs. 0.01
Status: ✓ Balanced (within tolerance)


Scenario 3: Missing Transaction
════════════════════════════════
Opening:  Rs. 100,000.00
Expected: Rs. 105,500.00
Actual:   Rs. 106,250.00
Discrepancy: Rs. 750.00
Status: ✗ Unbalanced

Possible Causes:
- Missing transaction in import
- Interest/fee not in statement lines
- Bank error
- Data entry error


Scenario 4: Duplicate Transaction
══════════════════════════════════
Opening:  Rs. 100,000.00
Expected: Rs. 105,500.00
Actual:   Rs. 104,000.00
Discrepancy: Rs. -1,500.00
Status: ✗ Unbalanced

Possible Causes:
- Duplicate debit transaction
- Import error
- Data corruption
```

### Balance Summary Display

```
Statement Balance Dashboard
═══════════════════════════

┌──────────────────────────────────────────────┐
│ BOC Current Account - December 2025          │
├──────────────────────────────────────────────┤
│ Opening Balance:        Rs. 125,000.00       │
│ Total Credits:         +Rs. 185,500.00       │
│ Total Debits:          -Rs. 161,750.00       │
│ Expected Closing:       Rs. 148,750.00       │
│ Actual Closing:         Rs. 148,750.00       │
│                                              │
│ Discrepancy:            Rs.       0.00 ✓     │
│ Status: BALANCED                             │
└──────────────────────────────────────────────┘


Unbalanced Statement Example
═════════════════════════════

┌──────────────────────────────────────────────┐
│ Sampath Savings - January 2026               │
├──────────────────────────────────────────────┤
│ Opening Balance:        Rs.  50,000.00       │
│ Total Credits:         +Rs.  25,000.00       │
│ Total Debits:          -Rs.  15,000.00       │
│ Expected Closing:       Rs.  60,000.00       │
│ Actual Closing:         Rs.  60,500.00       │
│                                              │
│ Discrepancy:            Rs.     500.00 ⚠     │
│ Status: NEEDS REVIEW                         │
│                                              │
│ Action Required:                             │
│ • Check for missing transactions             │
│ • Verify interest/fees                       │
│ • Contact bank if needed                     │
└──────────────────────────────────────────────┘
```

### Sri Lankan Banking Context

#### Balance Display Formats

| Context | Format | Example |
|---------|--------|---------|
| Statement | LKR or Rs. | Rs. 125,000.00 |
| System Display | Rs. with commas | Rs. 1,25,000.00 |
| Reports | LKR | LKR 125,000.00 |
| International | USD equivalent | $625.00 (@ 200 LKR/USD) |

#### Common Balance Ranges

| Account Type | Typical Balance Range |
|--------------|----------------------|
| Savings Account | Rs. 5,000 - Rs. 500,000 |
| Current Account | Rs. 50,000 - Rs. 5,000,000 |
| Fixed Deposit | Rs. 100,000 - Rs. 10,000,000 |
| Credit Card | Rs. -500,000 - Rs. 0 (negative) |
| Overdraft | Rs. -1,000,000 - Rs. 0 (negative) |

### Financial Precision Requirements

```
Decimal Precision Rules
═══════════════════════

DO Use decimal.Decimal:
  ✓ from decimal import Decimal
  ✓ balance = Decimal('125000.00')
  ✓ Exact representation
  ✓ No rounding errors

DON'T Use float:
  ✗ balance = 125000.00
  ✗ Floating point imprecision
  ✗ Accumulates rounding errors
  ✗ Example: 0.1 + 0.2 = 0.30000000000000004

Rounding:
  ROUND_HALF_UP (standard banking)
  Rs. 123.455 → Rs. 123.46
  Rs. 123.445 → Rs. 123.45
```

### Expected Outcome
- Opening and closing balances tracked
- Balance change calculation
- Reconciliation verification capability
- Discrepancy detection
- Accurate financial precision

### Verification Checklist
- [ ] Decimal imported from decimal module
- [ ] opening_balance field added (DecimalField)
- [ ] closing_balance field added (DecimalField)
- [ ] Both fields: max_digits=15, decimal_places=2
- [ ] help_text added to both fields
- [ ] get_balance_change method added
- [ ] get_expected_closing_balance method added
- [ ] get_balance_discrepancy method added
- [ ] is_balanced property added
- [ ] get_balance_summary method added
- [ ] Uses Decimal for calculations (not float)

---

## Task 20: Add Statement File Field

### Overview
Add a file field to store the uploaded bank statement file. This field handles file upload, storage, and organization, ensuring statement documents are securely stored and easily retrievable for audit purposes and re-import scenarios.

### Dependencies
- Task 19: Add statement balances
- File storage backend configured (S3, local storage, etc.)
- Media settings configured in Django settings

### Instructions

1. **Open bank_statement.py model file**
   - Continue in `apps/accounting/models/bank_statement.py`
   - Locate BankStatement model class

2. **Define upload_to function**
   - Create function to generate upload path
   - Pattern: 'bank_statements/{tenant_id}/{year}/{month}/{filename}'
   - Organizes files by tenant, year, and month
   - Place function before model class

3. **Add file field**
   - FileField with upload_to parameter
   - Optional (blank=True, null=True)
   - Allows statements without file (manual entry)
   - help_text: "Uploaded bank statement file (CSV, OFX, MT940)"

4. **Add file_size field**
   - BigIntegerField, null=True, blank=True
   - Stores file size in bytes
   - Automatically populated on save
   - Used for storage tracking

5. **Add file_uploaded_at field**
   - DateTimeField, null=True, blank=True
   - Timestamp when file was uploaded
   - auto_now_add=False (manual control)
   - Set when file is first attached

6. **Override save method**
   - Detect if file has changed
   - Update file_size when file uploaded
   - Update file_uploaded_at on first upload
   - Call parent save method

7. **Add get_file_extension method**
   - Extract file extension from filename
   - Returns lowercase extension (e.g., 'csv', 'ofx')
   - Used for format detection

8. **Add get_file_size_display method**
   - Convert bytes to human-readable format
   - Returns string like "1.5 MB", "250 KB"
   - Used in admin and UI displays

9. **Add has_file property**
   - Check if file is attached
   - Returns boolean
   - Convenient for templates and logic

10. **Add delete_file method**
    - Remove file from storage
    - Clear file field
    - Update file metadata fields
    - Does not delete model instance

### File Storage Organization

```
Storage Directory Structure
════════════════════════════

media/
└── bank_statements/
    ├── tenant_001/
    │   ├── 2025/
    │   │   ├── 01/
    │   │   │   ├── boc_current_jan2025.csv
    │   │   │   └── sampath_savings_jan2025.csv
    │   │   ├── 02/
    │   │   │   ├── boc_current_feb2025.csv
    │   │   │   └── commercial_current_feb2025.csv
    │   │   └── 12/
    │   │       └── boc_current_dec2025.csv
    │   └── 2026/
    │       └── 01/
    │           └── boc_current_jan2026.csv
    └── tenant_002/
        └── 2025/
            └── ...

Naming Convention:
{bank}_{account_type}_{period}.{extension}

Examples:
- boc_current_jan2025.csv
- commercial_savings_q4_2025.csv
- hnb_creditcard_dec2025.ofx
```

### Upload Path Generation

```
Upload Path Function Logic
═══════════════════════════

Input:
  Instance: BankStatement(
    tenant_id=5,
    start_date=2025-12-01,
    bank_account="BOC Current"
  )
  Filename: "december_statement.csv"

Process:
  tenant_id: 5 → "tenant_005"
  year: 2025 → "2025"
  month: 12 → "12"
  filename: "december_statement.csv" → sanitized

Output Path:
  "bank_statements/tenant_005/2025/12/december_statement.csv"

Storage:
  Local: /media/bank_statements/tenant_005/2025/12/december_statement.csv
  S3: s3://bucket/bank_statements/tenant_005/2025/12/december_statement.csv
```

### File Size Management

```
File Size Tracking
══════════════════

Small File (< 1 MB):
├─ Size: 45,328 bytes
├─ Display: "44.3 KB"
└─ Processing: Fast, in-memory

Medium File (1-10 MB):
├─ Size: 2,458,624 bytes
├─ Display: "2.3 MB"
└─ Processing: Chunked reading

Large File (> 10 MB):
├─ Size: 15,728,640 bytes
├─ Display: "15.0 MB"
└─ Processing: Stream processing, progress bar

Size Display Conversion:
< 1 KB:    Show bytes    "856 bytes"
< 1 MB:    Show KB        "125.5 KB"
< 1 GB:    Show MB        "15.8 MB"
>= 1 GB:   Show GB        "1.2 GB"
```

### File Extension Detection

```
Supported File Extensions
═════════════════════════

CSV Files:
  .csv  → StatementFormat.CSV
  .txt  → StatementFormat.CSV (with validation)

OFX Files:
  .ofx  → StatementFormat.OFX
  .qfx  → StatementFormat.OFX (Quicken variant)

MT940 Files:
  .sta  → StatementFormat.MT940
  .mt940 → StatementFormat.MT940
  .txt  → StatementFormat.MT940 (with validation)

Validation:
  1. Check file extension
  2. Verify statement_format matches
  3. Validate file content (first few lines)
  4. Reject unsupported formats
```

### File Upload Workflow

```
Statement File Upload Process
═════════════════════════════

Step 1: User Selects File
┌────────────────────────────────┐
│ Choose file: boc_dec2025.csv   │
│ [Browse...] [Upload]           │
└────────────────────────────────┘
         │
         ▼
Step 2: File Validation
┌────────────────────────────────┐
│ ✓ File size: 1.2 MB (OK)       │
│ ✓ Extension: .csv (Supported)  │
│ ✓ Format: CSV (Matches)        │
└────────────────────────────────┘
         │
         ▼
Step 3: Upload to Storage
┌────────────────────────────────┐
│ Uploading... ▓▓▓▓▓▓▓░░░ 75%    │
└────────────────────────────────┘
         │
         ▼
Step 4: Update Metadata
┌────────────────────────────────┐
│ file_size: 1,258,291 bytes     │
│ file_uploaded_at: 2025-12-15   │
│ uploaded_by: User(id=5)        │
└────────────────────────────────┘
         │
         ▼
Step 5: Ready for Import
┌────────────────────────────────┐
│ ✓ File uploaded successfully   │
│ [Import Statement]             │
└────────────────────────────────┘
```

### Storage Backend Configuration

```
Django Settings Configuration
══════════════════════════════

Local Storage (Development):
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

S3 Storage (Production):
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
AWS_S3_REGION_NAME = 'ap-southeast-1'  # Singapore
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_DEFAULT_ACL = 'private'  # Security
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
```

### File Security Considerations

| Aspect | Implementation | Reason |
|--------|----------------|--------|
| Access Control | Private storage, pre-signed URLs | Confidential financial data |
| Encryption | S3 encryption at rest | Data protection |
| Virus Scanning | Pre-upload scan | Prevent malware |
| File Size Limit | Max 50 MB | Prevent abuse |
| Allowed Extensions | .csv, .ofx, .sta only | Security |
| Tenant Isolation | Path includes tenant_id | Data separation |

### Expected Outcome
- File upload capability
- Organized storage structure
- File metadata tracking
- Secure file handling
- Support for re-import

### Verification Checklist
- [ ] upload_to function defined
- [ ] file field added (FileField)
- [ ] file_size field added (BigIntegerField)
- [ ] file_uploaded_at field added (DateTimeField)
- [ ] save method overridden to update metadata
- [ ] get_file_extension method added
- [ ] get_file_size_display method added
- [ ] has_file property added
- [ ] delete_file method added
- [ ] File storage configured in settings
- [ ] Upload path includes tenant isolation

---

## Task 21: Add Statement Import Status

### Overview
Add import status tracking fields to manage the statement import lifecycle. These fields track the progress of parsing and importing statement lines from the uploaded file, handling success and failure scenarios, and providing visibility into the import process.

### Dependencies
- Task 20: Add statement file field
- User model exists for tracking

### Instructions

1. **Open bank_statement.py model file**
   - Continue in `apps/accounting/models/bank_statement.py`
   - Locate BankStatement model class

2. **Define ImportStatus enum**
   - Create TextChoices class inside model or in enums.py
   - Three states: PENDING, IMPORTED, FAILED

3. **Add import_status field**
   - CharField with choices from ImportStatus
   - Default to ImportStatus.PENDING
   - Required field (no null/blank)
   - help_text: "Current status of statement import process"

4. **Add imported_at field**
   - DateTimeField, null=True, blank=True
   - Automatically set when import succeeds
   - Audit trail for import completion

5. **Add imported_by field**
   - ForeignKey to User, null=True, blank=True
   - Tracks who initiated the import
   - related_name='imported_statements'
   - on_delete=models.SET_NULL

6. **Add import_error field**
   - TextField, null=True, blank=True
   - Stores error message if import fails
   - Helps debugging import issues

7. **Add import_line_count field**
   - PositiveIntegerField, default=0
   - Count of successfully imported statement lines
   - Updated during import process

8. **Add mark_as_imported method**
   - Set import_status to IMPORTED
   - Set imported_at to current timestamp
   - Set imported_by to user
   - Update import_line_count

9. **Add mark_as_failed method**
   - Set import_status to FAILED
   - Set import_error message
   - Log failure for monitoring

10. **Add can_reimport property**
    - Check if statement can be re-imported
    - Returns boolean
    - True if FAILED or file changed

11. **Add get_import_status_display method**
    - Return user-friendly status text
    - Include timestamp and user info
    - Format: "Imported on Dec 15, 2025 by John Doe"

12. **Update Meta class**
    - Add index on (tenant, import_status)
    - Improves filtering by status

### Import Status States

```
Import Status Lifecycle
════════════════════════

PENDING
├─ Initial state when statement created
├─ File uploaded but not yet processed
├─ Awaiting import action
└─ Can transition to: IMPORTED or FAILED
    │
    ├──── [Import Success] ────→ IMPORTED
    │                              ├─ All lines parsed successfully
    │                              ├─ imported_at timestamp set
    │                              ├─ imported_by user recorded
    │                              ├─ import_line_count updated
    │                              └─ Can transition to: PENDING (re-import)
    │
    └──── [Import Failure] ────→ FAILED
                                   ├─ Error occurred during parsing
                                   ├─ import_error message stored
                                   ├─ Partial lines may exist
                                   └─ Can transition to: PENDING (retry)
```

### Import Status Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Statement Upload                          │
│                           │                                   │
│                           ▼                                   │
│                    ┌────────────┐                            │
│                    │  PENDING   │◄──────────────┐            │
│                    └──────┬─────┘               │            │
│                           │                     │            │
│                      [Start Import]             │            │
│                           │                     │            │
│              ┌────────────┴────────────┐        │            │
│              ▼                         ▼        │            │
│      ┌──────────────┐          ┌─────────────┐ │            │
│      │   IMPORTED   │          │   FAILED    │ │            │
│      │              │          │             │ │            │
│      │ ✓ Success    │          │ ✗ Error     │ │            │
│      │ Lines: 150   │          │ Message:... │ │            │
│      │ Date: ...    │          │             │ │            │
│      └──────────────┘          └─────┬───────┘ │            │
│                                      │         │            │
│                                 [Fix & Retry]  │            │
│                                      │         │            │
│                                      └─────────┘            │
└──────────────────────────────────────────────────────────────┘
```

### Import Process Steps

```
Detailed Import Process
═══════════════════════

1. Pre-Import Validation
   ┌────────────────────────────────────┐
   │ Status: PENDING                    │
   │ ✓ File exists                      │
   │ ✓ File format valid                │
   │ ✓ Bank account set                 │
   │ ✓ Date range valid                 │
   └────────────────────────────────────┘
            │
            ▼
2. File Parsing
   ┌────────────────────────────────────┐
   │ Reading file...                    │
   │ Parsing lines: 1/150               │
   │ Progress: ▓▓░░░░░░░░ 10%           │
   └────────────────────────────────────┘
            │
            ├──── Success ────→ Continue
            │
            └──── Error ──────→ FAILED
                                ├─ Store error
                                └─ Stop process
            │
            ▼
3. Line Creation
   ┌────────────────────────────────────┐
   │ Creating statement lines...        │
   │ Created: 150/150                   │
   │ Progress: ▓▓▓▓▓▓▓▓▓▓ 100%          │
   └────────────────────────────────────┘
            │
            ▼
4. Verification
   ┌────────────────────────────────────┐
   │ Verifying balances...              │
   │ Expected: Rs. 148,750.00           │
   │ Actual:   Rs. 148,750.00           │
   │ Discrepancy: Rs. 0.00 ✓            │
   └────────────────────────────────────┘
            │
            ▼
5. Completion
   ┌────────────────────────────────────┐
   │ Status: IMPORTED                   │
   │ Lines: 150                         │
   │ Imported at: 2025-12-15 14:30      │
   │ Imported by: John Doe              │
   └────────────────────────────────────┘
```

### Import Error Handling

```
Common Import Errors
════════════════════

Error 1: Invalid CSV Format
┌────────────────────────────────────┐
│ Status: FAILED                     │
│ Error: "Invalid CSV format: ...   │
│   Expected 6 columns, found 4"    │
│                                    │
│ Resolution:                        │
│ - Check CSV structure              │
│ - Verify column mapping            │
│ - Re-upload correct format         │
└────────────────────────────────────┘

Error 2: Date Parsing Error
┌────────────────────────────────────┐
│ Status: FAILED                     │
│ Error: "Cannot parse date: ...    │
│   '15/13/2025' is not valid"      │
│                                    │
│ Resolution:                        │
│ - Check date format setting        │
│ - Verify CSV date column           │
│ - Fix date format in file          │
└────────────────────────────────────┘

Error 3: Balance Mismatch
┌────────────────────────────────────┐
│ Status: IMPORTED (with warning)    │
│ Warning: "Balance discrepancy:     │
│   Expected Rs. 148,750.00          │
│   Found Rs. 149,250.00             │
│   Difference: Rs. 500.00"          │
│                                    │
│ Resolution:                        │
│ - Review missing transactions      │
│ - Check for duplicate entries      │
│ - Verify opening balance           │
└────────────────────────────────────┘

Error 4: Duplicate Statement
┌────────────────────────────────────┐
│ Status: FAILED                     │
│ Error: "Statement already exists   │
│   for this account and period"    │
│                                    │
│ Resolution:                        │
│ - Check existing statements        │
│ - Delete duplicate if needed       │
│ - Adjust date range                │
└────────────────────────────────────┘
```

### Status Dashboard Display

```
Import Status Dashboard
═══════════════════════

Pending Imports:
┌──────────────────────────────────────────────┐
│ ⏳ BOC Current - December 2025               │
│    File uploaded: 2 hours ago                │
│    Size: 1.2 MB (150 lines estimated)        │
│    [Import Now]                              │
└──────────────────────────────────────────────┘

Imported Statements:
┌──────────────────────────────────────────────┐
│ ✓ Commercial Savings - November 2025         │
│   Imported: Dec 10, 2025 by Jane Smith       │
│   Lines: 89 | Status: Reconciling            │
│   [View] [Re-import]                         │
└──────────────────────────────────────────────┘

Failed Imports:
┌──────────────────────────────────────────────┐
│ ✗ Sampath Current - October 2025             │
│   Failed: Dec 12, 2025                       │
│   Error: Invalid date format in row 45       │
│   [Fix & Retry] [View Error Details]         │
└──────────────────────────────────────────────┘
```

### Import Metrics Tracking

```
Import Performance Metrics
══════════════════════════

Statement: BOC Current - December 2025

Import Statistics:
├─ Total Lines: 150
├─ Import Duration: 12.5 seconds
├─ Processing Rate: 12 lines/second
├─ File Size: 1.2 MB
├─ Memory Used: 45 MB peak
└─ Database Operations: 302 queries

Performance Benchmarks:
┌──────────────┬─────────┬──────────┐
│ File Size    │ Lines   │ Duration │
├──────────────┼─────────┼──────────┤
│ < 1 MB       │ 0-100   │ < 10 sec │
│ 1-5 MB       │ 100-500 │ 10-30 s  │
│ 5-10 MB      │ 500-1K  │ 30-60 s  │
│ > 10 MB      │ > 1K    │ 1-5 min  │
└──────────────┴─────────┴──────────┘
```

### Re-import Capability

```
Re-import Scenarios
═══════════════════

Scenario 1: Import Failed
  Current Status: FAILED
  Allow Re-import: YES
  Reason: Correct errors and retry
  Action: Fix issues → [Re-import]

Scenario 2: Import Successful
  Current Status: IMPORTED
  Allow Re-import: YES (with warning)
  Reason: File corrected, need refresh
  Action: [Delete Existing Lines] → [Re-import]
  Warning: "This will delete 150 existing lines"

Scenario 3: Already Reconciled
  Current Status: IMPORTED
  Reconciliation: COMPLETE
  Allow Re-import: NO
  Reason: Financial data locked
  Message: "Cannot re-import reconciled statement"
```

### Expected Outcome
- Import status tracking
- Error message capture
- Import metadata recording
- Re-import capability
- Import progress visibility

### Verification Checklist
- [ ] ImportStatus enum defined
- [ ] import_status field added with choices
- [ ] imported_at field added (DateTimeField)
- [ ] imported_by field added (ForeignKey to User)
- [ ] import_error field added (TextField)
- [ ] import_line_count field added (PositiveIntegerField)
- [ ] mark_as_imported method added
- [ ] mark_as_failed method added
- [ ] can_reimport property added
- [ ] get_import_status_display method added
- [ ] Meta class index updated
- [ ] Default status is PENDING

---

## Task 22: Run Statement Migrations

### Overview
Generate and apply Django migrations for the BankStatement model with all its fields. This task creates the database schema for storing bank statements and establishes the necessary database indexes for optimal query performance.

### Dependencies
- Tasks 15-21: All BankStatement model fields added
- Database configured and accessible
- Django migrations system working

### Instructions

1. **Verify model completeness**
   - Review BankStatement model
   - Ensure all fields from Tasks 15-21 are added
   - Check model imports are correct
   - Verify enums are properly defined

2. **Create migration file**
   - Run makemigrations command
   - Command: `python manage.py makemigrations accounting`
   - Review generated migration file
   - Check for any warnings or issues

3. **Review migration file**
   - Open migration file in migrations directory
   - Verify all fields are included
   - Check field types and constraints
   - Ensure indexes are created
   - Review foreign key relationships

4. **Run migration in development**
   - Apply migration: `python manage.py migrate accounting`
   - Verify migration succeeds
   - Check for any database errors
   - Confirm tables created

5. **Verify database schema**
   - Inspect database table
   - Confirm all columns exist
   - Check data types match model
   - Verify indexes created
   - Test foreign key constraints

6. **Test model operations**
   - Create test statement instance
   - Save to database
   - Query and retrieve
   - Update fields
   - Delete (if appropriate)

7. **Update migration checklist**
   - Document migration number
   - Note any special considerations
   - Record rollback procedure if needed

### Migration File Structure

```
Migration File Overview
═══════════════════════

File: 0011_bankstatement.py
Location: apps/accounting/migrations/

Contents:
├─ dependencies: Previous migrations
├─ operations:
│   ├─ CreateModel: BankStatement
│   │   ├─ Fields: All model fields
│   │   ├─ Options: Meta class settings
│   │   └─ Bases: Mixin inheritance
│   ├─ AddIndex: tenant, bank_account, start_date
│   ├─ AddIndex: tenant, is_reconciled
│   └─ AddIndex: tenant, import_status
```

### Database Schema

```
BankStatement Table Schema
══════════════════════════

Table Name: accounting_bankstatement

Columns:
┌────────────────────────┬──────────────────┬──────────┬──────────┐
│ Column Name            │ Type             │ Nullable │ Default  │
├────────────────────────┼──────────────────┼──────────┼──────────┤
│ id                     │ BIGINT           │ NO       │ AUTO     │
│ tenant_id              │ BIGINT           │ NO       │ -        │
│ bank_account_id        │ BIGINT           │ NO       │ -        │
│ name                   │ VARCHAR(200)     │ NO       │ -        │
│ statement_format       │ VARCHAR(10)      │ NO       │ 'CSV'    │
│ start_date             │ DATE             │ NO       │ -        │
│ end_date               │ DATE             │ NO       │ -        │
│ opening_balance        │ DECIMAL(15,2)    │ NO       │ 0.00     │
│ closing_balance        │ DECIMAL(15,2)    │ NO       │ 0.00     │
│ file                   │ VARCHAR(100)     │ YES      │ NULL     │
│ file_size              │ BIGINT           │ YES      │ NULL     │
│ file_uploaded_at       │ TIMESTAMP        │ YES      │ NULL     │
│ import_status          │ VARCHAR(20)      │ NO       │ 'PENDING'│
│ imported_at            │ TIMESTAMP        │ YES      │ NULL     │
│ imported_by_id         │ BIGINT           │ YES      │ NULL     │
│ import_error           │ TEXT             │ YES      │ NULL     │
│ import_line_count      │ INTEGER          │ NO       │ 0        │
│ is_reconciled          │ BOOLEAN          │ NO       │ FALSE    │
│ reconciled_at          │ TIMESTAMP        │ YES      │ NULL     │
│ reconciled_by_id       │ BIGINT           │ YES      │ NULL     │
│ notes                  │ TEXT             │ YES      │ NULL     │
│ created_at             │ TIMESTAMP        │ NO       │ NOW()    │
│ updated_at             │ TIMESTAMP        │ NO       │ NOW()    │
│ created_by_id          │ BIGINT           │ YES      │ NULL     │
└────────────────────────┴──────────────────┴──────────┴──────────┘

Indexes:
├─ PRIMARY KEY (id)
├─ INDEX (tenant_id, bank_account_id, start_date)
├─ INDEX (tenant_id, is_reconciled)
├─ INDEX (tenant_id, import_status)
└─ INDEX (start_date)

Foreign Keys:
├─ tenant_id → tenants_tenant(id)
├─ bank_account_id → accounting_bankaccount(id) [PROTECT]
├─ imported_by_id → users_user(id) [SET_NULL]
├─ reconciled_by_id → users_user(id) [SET_NULL]
└─ created_by_id → users_user(id) [SET_NULL]
```

### Migration Commands

```
Development Environment
═══════════════════════

1. Check migration status:
   $ python manage.py showmigrations accounting

   Output:
   accounting
    [X] 0001_initial
    [X] 0002_chartofaccounts
    ...
    [X] 0010_bankaccount
    [ ] 0011_bankstatement

2. Generate migration:
   $ python manage.py makemigrations accounting

   Output:
   Migrations for 'accounting':
     accounting/migrations/0011_bankstatement.py
       - Create model BankStatement

3. Apply migration:
   $ python manage.py migrate accounting

   Output:
   Running migrations:
     Applying accounting.0011_bankstatement... OK

4. Verify migration:
   $ python manage.py showmigrations accounting

   Output:
   accounting
    [X] 0001_initial
    ...
    [X] 0010_bankaccount
    [X] 0011_bankstatement


Production Environment
══════════════════════

1. Review migration (dry run):
   $ python manage.py migrate accounting --plan

2. Apply with care:
   $ python manage.py migrate accounting

3. Monitor performance:
   - Watch for slow queries
   - Check index creation time
   - Monitor disk space

4. Rollback if needed:
   $ python manage.py migrate accounting 0010_bankaccount
```

### Testing Model Creation

```
Django Shell Testing
════════════════════

$ python manage.py shell

>>> from apps.accounting.models import BankStatement, BankAccount
>>> from apps.tenants.models import Tenant
>>> from apps.accounting.models.enums import StatementFormat
>>> from decimal import Decimal
>>> from datetime import date

# Get test data
>>> tenant = Tenant.objects.first()
>>> bank_account = BankAccount.objects.first()

# Create statement
>>> statement = BankStatement.objects.create(
...     tenant=tenant,
...     bank_account=bank_account,
...     name="Test Statement",
...     statement_format=StatementFormat.CSV,
...     start_date=date(2025, 12, 1),
...     end_date=date(2025, 12, 31),
...     opening_balance=Decimal('100000.00'),
...     closing_balance=Decimal('125000.00')
... )

>>> print(statement)
BOC Current Account - 2025-12-01 to 2025-12-31

>>> print(f"Balance change: {statement.get_balance_change()}")
Balance change: 25000.00

>>> print(f"Status: {statement.import_status}")
Status: PENDING

# Query statements
>>> statements = BankStatement.objects.filter(
...     tenant=tenant,
...     bank_account=bank_account
... )
>>> print(f"Found {statements.count()} statements")

# Cleanup
>>> statement.delete()
```

### Migration Rollback Procedure

```
Rollback Plan
═════════════

If issues occur after migration:

1. Stop application servers
   $ supervisorctl stop all

2. Rollback migration
   $ python manage.py migrate accounting 0010_bankaccount

3. Review issues
   - Check error logs
   - Identify problem
   - Fix model definition

4. Create new migration
   $ python manage.py makemigrations accounting

5. Test in development first

6. Apply corrected migration
   $ python manage.py migrate accounting

7. Restart application
   $ supervisorctl start all
```

### Post-Migration Verification

```
Verification Checklist
══════════════════════

Database Checks:
✓ Table created: accounting_bankstatement
✓ All columns present with correct types
✓ Primary key exists
✓ Foreign keys configured
✓ Indexes created
✓ Default values set

Application Checks:
✓ Model imports without errors
✓ Django admin loads
✓ Can create statement instance
✓ Can query statements
✓ Foreign key relationships work
✓ Enum choices display correctly

Performance Checks:
✓ Index usage verified
✓ Query plans reviewed
✓ No N+1 query issues
✓ Acceptable response times
```

### Expected Outcome
- Migration file generated
- Database schema created
- All fields and indexes present
- Model fully functional
- Ready for statement line model

### Verification Checklist
- [ ] Migration file created (0011_bankstatement.py)
- [ ] Migration file reviewed for correctness
- [ ] Migration applied successfully
- [ ] Database table created
- [ ] All columns exist with correct types
- [ ] Indexes created on key fields
- [ ] Foreign key constraints established
- [ ] Can create BankStatement instances
- [ ] Can query BankStatement records
- [ ] Model methods work correctly
- [ ] Django admin integration working
- [ ] No migration warnings or errors

---

## Summary

This document established the foundation of the bank statement import system:

### Completed Infrastructure
- ✅ StatementFormat enum (CSV, OFX, MT940)
- ✅ BankStatement model with comprehensive fields
- ✅ Bank account relationship
- ✅ Statement date range tracking
- ✅ Opening and closing balance management
- ✅ File upload and storage
- ✅ Import status lifecycle tracking
- ✅ Database migrations applied

### Key Achievements
1. **Format Support** - Extensible enum for multiple statement formats
2. **Complete Model** - All fields for statement metadata and lifecycle
3. **File Management** - Secure upload, storage, and organization
4. **Import Tracking** - Status, errors, and metadata capture
5. **Balance Verification** - Opening/closing balances with discrepancy detection
6. **Reconciliation Ready** - Fields to track reconciliation progress

### Model Field Summary

| Category | Fields | Purpose |
|----------|--------|---------|
| Identification | name, statement_format | Statement identity |
| Relationships | bank_account, tenant | Data organization |
| Date Range | start_date, end_date | Period coverage |
| Balances | opening_balance, closing_balance | Balance tracking |
| File Storage | file, file_size, file_uploaded_at | Document management |
| Import Status | import_status, imported_at, imported_by, import_error, import_line_count | Process tracking |
| Reconciliation | is_reconciled, reconciled_at, reconciled_by | Workflow state |
| Metadata | notes, created_at, updated_at | Audit trail |

### Next Steps
Proceed to [02_Tasks-23-30_StatementLine-CSV-Importer.md](02_Tasks-23-30_StatementLine-CSV-Importer.md) to implement:
- StatementLine model for individual transactions
- Transaction date, description, and amount fields
- Reference number and running balance tracking
- CSV importer service with configurable column mapping
- Support for various Sri Lankan bank CSV formats

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~950
