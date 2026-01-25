# Tasks 27-32: Double-Entry Validators

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** B - Double-Entry Validation  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-26_JournalEntryLine-Model.md](01_Tasks-19-26_JournalEntryLine-Model.md)
- **→ Next Group:** [../Group-C_Auto-Generated-Entries/](../Group-C_Auto-Generated-Entries/)

---

## Document Overview

This document covers the comprehensive validation system for journal entries, implementing all double-entry bookkeeping rules. The validators ensure accounting integrity by checking balance equality, minimum line requirements, positive amounts, account status, and period validity. These validations protect against accounting errors and maintain the fundamental principle that debits must always equal credits.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create Balance Validator | High | 45 min |
| 28 | Add Zero Balance Check | Medium | 30 min |
| 29 | Add Minimum Lines Check | Low | 15 min |
| 30 | Add Non-Zero Check | Low | 20 min |
| 31 | Add Account Active Check | Low | 20 min |
| 32 | Add Entry Period Check | Medium | 35 min |

---

## Task 27: Create Balance Validator

### Overview
Create the core balance validation function that ensures every journal entry satisfies the fundamental double-entry bookkeeping rule: total debits must equal total credits. This is the most critical validation in the entire accounting system, as unbalanced entries corrupt financial statements and violate accounting principles.

### Dependencies
- Task 26: Run Line Migrations
- JournalEntryLine model with debit and credit fields
- JournalEntry model with lines relationship

### Instructions

1. **Create validators module structure**
   - Navigate to `apps/accounting/validators/` directory
   - If directory doesn't exist, create it
   - Establishes location for all validation logic

2. **Create validators package initialization**
   - Create `__init__.py` in `validators/` directory
   - Will import and export validator functions
   - Provides clean public API

3. **Create entry validators module**
   - Create `entry_validators.py` file
   - Will contain all journal entry validation functions
   - Separate from model definitions for clarity

4. **Add module docstring**
   - Document validation purpose
   - Explain double-entry principles
   - List all validator functions

5. **Import required dependencies**
   - Import Decimal from decimal module
   - Import ValidationError from django.core.exceptions
   - Import JournalEntry model
   - Import necessary Q objects for queries

6. **Define validate_entry_balance function**
   - Function name: `validate_entry_balance`
   - Single parameter: journal_entry (JournalEntry instance)
   - Returns None or raises ValidationError
   - Main entry point for balance validation

7. **Calculate total debits**
   - Query all lines for the entry
   - Sum all debit field values
   - Use Django ORM aggregate function
   - Handle null values (treat as zero)

8. **Calculate total credits**
   - Query all lines for the entry
   - Sum all credit field values
   - Use Django ORM aggregate function
   - Handle null values (treat as zero)

9. **Compare totals with precision**
   - Use Decimal comparison (not float)
   - Account for rounding at 2 decimal places
   - Ensure exact equality
   - No tolerance for imbalance

10. **Raise validation error if unbalanced**
    - Create clear error message
    - Include both debit and credit totals
    - Show difference amount
    - Use ValidationError with descriptive text

11. **Handle edge cases**
    - Entry with no lines (caught by other validator)
    - Entry with only debits or only credits
    - Very large amounts (Decimal handles this)
    - Null/None values in amounts

### Balance Validation Logic Flow

```
┌─────────────────────────────────────┐
│  validate_entry_balance(entry)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Query all entry.lines              │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐ ┌──────────────┐
│  Sum(debit)  │ │ Sum(credit)  │
└──────┬───────┘ └───────┬──────┘
       │                 │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │  debit = credit? │
       └────┬────────┬────┘
            │        │
           Yes       No
            │        │
            ▼        ▼
       ┌────────┐ ┌──────────────────┐
       │  Pass  │ │ Raise Validation │
       └────────┘ │      Error       │
                  └──────────────────┘
```

### Balance Validation Examples

#### Valid Balanced Entry
```
Entry: Office Supplies Purchase

Line 1: Office Expense (Debit: 500.00, Credit: 0.00)
Line 2: Cash Account    (Debit: 0.00, Credit: 500.00)

Calculation:
Total Debits:  500.00
Total Credits: 500.00
Result: VALID ✓
```

#### Valid Multi-Line Entry
```
Entry: Payroll Payment

Line 1: Salary Expense       (Debit: 10,000.00, Credit: 0.00)
Line 2: Tax Payable          (Debit: 0.00, Credit: 2,000.00)
Line 3: Bank Account         (Debit: 0.00, Credit: 8,000.00)

Calculation:
Total Debits:  10,000.00
Total Credits: 10,000.00
Result: VALID ✓
```

#### Invalid Unbalanced Entry
```
Entry: Equipment Purchase (ERROR)

Line 1: Equipment Asset  (Debit: 5,000.00, Credit: 0.00)
Line 2: Cash Account     (Debit: 0.00, Credit: 4,500.00)

Calculation:
Total Debits:  5,000.00
Total Credits: 4,500.00
Difference: 500.00
Result: INVALID ✗
Error: "Entry is unbalanced: Debits (5000.00) ≠ Credits (4500.00)"
```

#### Invalid Single-Sided Entry
```
Entry: Revenue Entry (ERROR)

Line 1: Revenue Account  (Debit: 0.00, Credit: 1,000.00)

Calculation:
Total Debits:  0.00
Total Credits: 1,000.00
Difference: 1,000.00
Result: INVALID ✗
Error: "Entry is unbalanced: Debits (0.00) ≠ Credits (1000.00)"
```

### Decimal Precision Handling

#### Why Decimal Matters
```
Float arithmetic:     0.1 + 0.2 = 0.30000000000000004  ✗
Decimal arithmetic:   0.1 + 0.2 = 0.3                   ✓

For accounting:
Float:   100.00 / 3 = 33.333333333333336 × 3 = 100.00000000000001  ✗
Decimal: 100.00 / 3 = 33.33 × 3 = 99.99 (explicit rounding)         ✓
```

#### Decimal Comparison
```
Use: total_debits == total_credits  (both Decimal)
Not: float(total_debits) == float(total_credits)

Decimal maintains precision:
- 1000.00 stored exactly
- No floating point errors
- Reliable equality checks
```

### Error Message Format

#### Standard Error Template
```
Entry is unbalanced: Debits ({debit_total}) ≠ Credits ({credit_total})
Difference: {abs(debit_total - credit_total)}
```

#### Example Error Messages
```
Entry is unbalanced: Debits (5000.00) ≠ Credits (4500.00)
Difference: 500.00

Entry is unbalanced: Debits (0.00) ≠ Credits (1000.00)
Difference: 1000.00

Entry is unbalanced: Debits (12345.67) ≠ Credits (12345.68)
Difference: 0.01
```

### Expected Outcome
- Core validation function operational
- Accurate debit/credit comparison
- Clear error messages for imbalanced entries
- Foundation for comprehensive entry validation

### Verification Checklist
- [ ] validators/ directory created
- [ ] validators/__init__.py file created
- [ ] entry_validators.py file created
- [ ] validate_entry_balance function defined
- [ ] Debit total calculation implemented
- [ ] Credit total calculation implemented
- [ ] Decimal comparison logic correct
- [ ] ValidationError raised for imbalance
- [ ] Error message includes totals and difference

---

## Task 28: Add Zero Balance Check

### Overview
Implement validation to detect entries where both debits and credits total zero. While technically "balanced," such entries have no accounting impact and usually indicate data entry errors or incomplete transactions. This check prevents meaningless entries from cluttering the accounting records.

### Dependencies
- Task 27: Create Balance Validator

### Instructions

1. **Open entry_validators.py file**
   - Navigate to existing validators module
   - Prepare to add zero balance check

2. **Define validate_entry_not_zero function**
   - Function name: `validate_entry_not_zero`
   - Single parameter: journal_entry
   - Returns None or raises ValidationError
   - Separate function for single responsibility

3. **Query entry lines**
   - Get all lines for the entry
   - Calculate total debits
   - Calculate total credits
   - Use same aggregation as balance validator

4. **Check for zero totals**
   - Verify total_debits > 0
   - Verify total_credits > 0
   - Both must be greater than zero
   - Use Decimal comparison with zero

5. **Handle zero debit case**
   - If total_debits equals zero
   - Raise ValidationError
   - Message: "Entry has no debit amounts"
   - Indicates incomplete or invalid entry

6. **Handle zero credit case**
   - If total_credits equals zero
   - Raise ValidationError
   - Message: "Entry has no credit amounts"
   - Indicates incomplete or invalid entry

7. **Handle both zero case**
   - If both debits and credits are zero
   - Raise ValidationError
   - Message: "Entry has no debit or credit amounts"
   - Most severe zero case

8. **Consider edge cases**
   - Entry with no lines at all
   - Entry with lines but all zero amounts
   - Entry with null amounts (treated as zero)
   - Coordination with minimum lines check

### Zero Balance Detection Logic

```
┌──────────────────────────────────┐
│  validate_entry_not_zero(entry)  │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Calculate total debits/credits  │
└────────────┬─────────────────────┘
             │
        ┌────┴─────┐
        ▼          ▼
┌─────────────┐ ┌──────────────┐
│debit = 0?   │ │credit = 0?   │
└──┬──────────┘ └───────┬──────┘
   │                    │
   Yes                 Yes
   │                    │
   ▼                    ▼
┌──────────────────┐ ┌─────────────────┐
│ Raise Error:     │ │ Raise Error:    │
│ "No debit"       │ │ "No credit"     │
└──────────────────┘ └─────────────────┘
```

### Zero Balance Scenarios

#### Scenario 1: All Zero Amounts
```
Entry: Incomplete Transaction

Line 1: Cash Account     (Debit: 0.00, Credit: 0.00)
Line 2: Revenue Account  (Debit: 0.00, Credit: 0.00)

Calculation:
Total Debits:  0.00
Total Credits: 0.00

Result: INVALID ✗
Error: "Entry has no debit or credit amounts"
```

#### Scenario 2: Only Debits Zero
```
Entry: Incomplete Purchase

Line 1: Expense Account  (Debit: 0.00, Credit: 0.00)
Line 2: Cash Account     (Debit: 0.00, Credit: 500.00)

Calculation:
Total Debits:  0.00
Total Credits: 500.00

Result: INVALID ✗
Error: "Entry has no debit amounts"
```

#### Scenario 3: Only Credits Zero
```
Entry: Incomplete Revenue

Line 1: Cash Account     (Debit: 1,000.00, Credit: 0.00)
Line 2: Revenue Account  (Debit: 0.00, Credit: 0.00)

Calculation:
Total Debits:  1,000.00
Total Credits: 0.00

Result: INVALID ✗
Error: "Entry has no credit amounts"
```

#### Scenario 4: Valid Entry (Not Zero)
```
Entry: Complete Sale

Line 1: Cash Account     (Debit: 1,000.00, Credit: 0.00)
Line 2: Revenue Account  (Debit: 0.00, Credit: 1,000.00)

Calculation:
Total Debits:  1,000.00
Total Credits: 1,000.00

Result: VALID ✓ (passes zero check)
```

### Integration with Balance Validator

```
Validation Sequence:

1. validate_entry_not_zero()
   ├─ Check debits > 0
   └─ Check credits > 0
        │
        ▼
2. validate_entry_balance()
   └─ Check debits = credits

Why this order?
- Zero check fails fast for incomplete entries
- No need to check balance if amounts are zero
- Provides more specific error messages
```

### Error Message Guidelines

| Condition | Error Message | Explanation |
|-----------|---------------|-------------|
| Debits = 0 | "Entry has no debit amounts" | No debits recorded |
| Credits = 0 | "Entry has no credit amounts" | No credits recorded |
| Both = 0 | "Entry has no debit or credit amounts" | Completely empty entry |

### Expected Outcome
- Zero balance validation operational
- Prevents meaningless entries
- Clear error messages for zero cases
- Complements main balance validator

### Verification Checklist
- [ ] validate_entry_not_zero function defined
- [ ] Zero debit detection implemented
- [ ] Zero credit detection implemented
- [ ] Both zero detection implemented
- [ ] Appropriate error messages created
- [ ] Decimal zero comparison used
- [ ] Function documented with docstring

---

## Task 29: Add Minimum Lines Check

### Overview
Implement validation to ensure every journal entry has at least two line items. This enforces the fundamental structure of double-entry bookkeeping: every transaction must affect at least two accounts (one debit, one credit minimum). Single-line entries violate accounting principles and cannot be balanced.

### Dependencies
- Task 28: Add Zero Balance Check

### Instructions

1. **Open entry_validators.py file**
   - Continue in existing validators module
   - Add minimum lines validation

2. **Define validate_entry_minimum_lines function**
   - Function name: `validate_entry_minimum_lines`
   - Single parameter: journal_entry
   - Returns None or raises ValidationError
   - Simple count-based validation

3. **Query entry lines count**
   - Get count of all lines for the entry
   - Use Django ORM count() method
   - More efficient than fetching all lines
   - Integer comparison required

4. **Define minimum lines constant**
   - Create constant: MINIMUM_LINES = 2
   - At module level for easy configuration
   - Documents business rule clearly
   - Can be referenced in error messages

5. **Check line count**
   - Compare line count to MINIMUM_LINES
   - If count < MINIMUM_LINES, raise error
   - Use descriptive error message
   - Include actual count in message

6. **Create error message**
   - Format: "Entry requires at least {min} line items (found {actual})"
   - Shows minimum required
   - Shows actual count found
   - Helps user understand shortfall

7. **Handle edge cases**
   - Entry with zero lines
   - Entry with exactly one line
   - Entry with exactly two lines (valid)
   - Newly created entry before lines added

### Minimum Lines Validation Logic

```
┌────────────────────────────────────────┐
│  validate_entry_minimum_lines(entry)   │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  Count entry lines                     │
│  line_count = entry.lines.count()      │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  line_count < MINIMUM_LINES (2)?       │
└──────────┬───────────────┬─────────────┘
           │               │
          Yes             No
           │               │
           ▼               ▼
┌─────────────────────┐  ┌────────┐
│ Raise ValidationError│  │  Pass  │
│ "Requires at least  │  └────────┘
│  2 lines (found X)" │
└─────────────────────┘
```

### Minimum Lines Scenarios

#### Invalid: No Lines
```
Entry: New Purchase Order

Lines: (none)

Line Count: 0
Minimum Required: 2

Result: INVALID ✗
Error: "Entry requires at least 2 line items (found 0)"
```

#### Invalid: Single Line
```
Entry: Incomplete Sale

Line 1: Cash Account (Debit: 1,000.00, Credit: 0.00)

Line Count: 1
Minimum Required: 2

Result: INVALID ✗
Error: "Entry requires at least 2 line items (found 1)"
```

#### Valid: Exactly Two Lines
```
Entry: Simple Purchase

Line 1: Expense Account (Debit: 500.00, Credit: 0.00)
Line 2: Cash Account    (Debit: 0.00, Credit: 500.00)

Line Count: 2
Minimum Required: 2

Result: VALID ✓
```

#### Valid: Multiple Lines
```
Entry: Complex Payroll

Line 1: Salary Expense   (Debit: 10,000.00, Credit: 0.00)
Line 2: Tax Withholding  (Debit: 0.00, Credit: 2,000.00)
Line 3: Net Pay          (Debit: 0.00, Credit: 8,000.00)

Line Count: 3
Minimum Required: 2

Result: VALID ✓
```

### Why Minimum Two Lines?

#### Double-Entry Principle
```
Every transaction affects at least TWO accounts:

Example: Purchase Office Supplies for Cash
┌─────────────────┬─────────┬─────────┐
│ Account         │  Debit  │ Credit  │
├─────────────────┼─────────┼─────────┤
│ Office Expense  │  500.00 │    0.00 │  ← Line 1
│ Cash            │    0.00 │  500.00 │  ← Line 2
└─────────────────┴─────────┴─────────┘

Cannot record:
- Just the expense (where did money come from?)
- Just the cash decrease (why did it decrease?)

Must record BOTH for complete picture.
```

#### Real-World Analogy
```
Transaction: "I spent $500"
Incomplete - Missing information

Complete Transaction: "I spent $500 cash on office supplies"
- Line 1: Office supplies increased by $500 (debit)
- Line 2: Cash decreased by $500 (credit)

Both pieces needed for full story.
```

### Validation Order Context

```
Recommended Validation Sequence:

1. validate_entry_minimum_lines()
   └─ Check: line_count >= 2
       │
       ▼ (if pass)
2. validate_entry_not_zero()
   └─ Check: amounts > 0
       │
       ▼ (if pass)
3. validate_entry_balance()
   └─ Check: debits = credits

Why this order?
- Lines must exist before checking amounts
- No point validating balance of non-existent lines
- Fail fast principle: check simplest rules first
```

### Expected Outcome
- Minimum lines validation enforced
- Prevents single-line or empty entries
- Clear error messages with counts
- Upholds double-entry structure

### Verification Checklist
- [ ] validate_entry_minimum_lines function defined
- [ ] MINIMUM_LINES constant created (value: 2)
- [ ] Line count query implemented
- [ ] Count comparison logic correct
- [ ] ValidationError raised when count < 2
- [ ] Error message includes actual count
- [ ] Function documented

---

## Task 30: Add Non-Zero Check

### Overview
Implement validation to ensure all line items have positive amounts. Each line must have either a non-zero debit or a non-zero credit (but not both). This prevents invalid entries with negative amounts, zero amounts in both fields, or amounts in both debit and credit fields simultaneously.

### Dependencies
- Task 29: Add Minimum Lines Check

### Instructions

1. **Open entry_validators.py file**
   - Continue in validators module
   - Add line amount validation

2. **Define validate_line_amounts function**
   - Function name: `validate_line_amounts`
   - Single parameter: journal_entry
   - Returns None or raises ValidationError
   - Validates each line individually

3. **Query all entry lines**
   - Get all lines for the entry
   - Iterate through each line
   - Check amounts on each line
   - Collect all validation errors

4. **Check for positive amounts**
   - Verify debit >= 0 (if present)
   - Verify credit >= 0 (if present)
   - No negative amounts allowed
   - Use Decimal comparison with zero

5. **Check for exclusive debit or credit**
   - Verify: (debit > 0 and credit = 0) OR (debit = 0 and credit > 0)
   - Cannot have both debit and credit > 0
   - Cannot have both debit and credit = 0
   - One and only one must be positive

6. **Handle negative amount error**
   - If debit < 0 or credit < 0
   - Error: "Line amounts must be positive"
   - Include line description or account
   - Show the invalid amount

7. **Handle both zero error**
   - If debit = 0 and credit = 0
   - Error: "Line must have either debit or credit amount"
   - Line contributes nothing to entry
   - Should be removed or corrected

8. **Handle both populated error**
   - If debit > 0 and credit > 0
   - Error: "Line cannot have both debit and credit amounts"
   - Violates double-entry convention
   - User must choose one side

9. **Aggregate line errors**
   - Collect errors from all lines
   - If any errors found, raise single ValidationError
   - Include line identifiers in message
   - Help user locate problem lines

### Line Amount Validation Logic

```
┌─────────────────────────────────────┐
│  validate_line_amounts(entry)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  For each line in entry.lines:      │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│ debit < 0?       │    │ credit < 0?      │
│ OR credit < 0?   │    │                  │
└───┬──────────────┘    └────┬─────────────┘
    │                        │
   Yes                      Yes
    │                        │
    ▼                        ▼
┌────────────────────────────────────────┐
│  Error: "Amounts must be positive"     │
└────────────────────────────────────────┘

        ┌──────────────────────────┐
        │                          │
        ▼                          ▼
┌───────────────────┐    ┌─────────────────────┐
│ debit=0 & credit=0│    │ debit>0 & credit>0? │
└───┬───────────────┘    └────┬────────────────┘
    │                         │
   Yes                       Yes
    │                         │
    ▼                         ▼
┌──────────────────┐    ┌─────────────────────┐
│ Error: "Must have│    │ Error: "Cannot have │
│ debit or credit" │    │ both debit & credit"│
└──────────────────┘    └─────────────────────┘
```

### Line Amount Validation Scenarios

#### Invalid: Negative Debit
```
Entry: Purchase with Error

Line 1: Office Expense  (Debit: -500.00, Credit: 0.00)  ✗
Line 2: Cash Account    (Debit: 0.00, Credit: 500.00)

Error: "Line amounts must be positive (Office Expense: debit -500.00)"
```

#### Invalid: Negative Credit
```
Entry: Sale with Error

Line 1: Cash Account     (Debit: 1,000.00, Credit: 0.00)
Line 2: Revenue Account  (Debit: 0.00, Credit: -1,000.00)  ✗

Error: "Line amounts must be positive (Revenue Account: credit -1,000.00)"
```

#### Invalid: Both Zero
```
Entry: Empty Line

Line 1: Cash Account    (Debit: 500.00, Credit: 0.00)
Line 2: Expense Account (Debit: 0.00, Credit: 0.00)  ✗
Line 3: Bank Account    (Debit: 0.00, Credit: 500.00)

Error: "Line must have either debit or credit amount (Expense Account)"
```

#### Invalid: Both Populated
```
Entry: Confused Entry

Line 1: Cash Account (Debit: 500.00, Credit: 300.00)  ✗

Error: "Line cannot have both debit and credit amounts (Cash Account)"
```

#### Valid: Proper Debit Line
```
Line: Office Expense (Debit: 500.00, Credit: 0.00)  ✓
- Debit is positive
- Credit is zero
- Follows convention
```

#### Valid: Proper Credit Line
```
Line: Cash Account (Debit: 0.00, Credit: 500.00)  ✓
- Credit is positive
- Debit is zero
- Follows convention
```

### Amount Validation Rules

| Rule | Valid | Invalid |
|------|-------|---------|
| Debit only | Debit: 100, Credit: 0 ✓ | Debit: -100, Credit: 0 ✗ |
| Credit only | Debit: 0, Credit: 100 ✓ | Debit: 0, Credit: -100 ✗ |
| Exclusive | One side > 0, other = 0 ✓ | Both > 0 ✗ |
| Non-zero | At least one > 0 ✓ | Both = 0 ✗ |

### Double-Entry Convention

```
Traditional Double-Entry Bookkeeping:

Each line records ONE side of the transaction:
┌──────────────────┬─────────┬─────────┐
│ Account          │  Debit  │ Credit  │
├──────────────────┼─────────┼─────────┤
│ Equipment        │ 5000.00 │    0.00 │  ← Debit line
│ Cash             │    0.00 │ 5000.00 │  ← Credit line
└──────────────────┴─────────┴─────────┘

NOT this (confusing/invalid):
┌──────────────────┬─────────┬─────────┐
│ Account          │  Debit  │ Credit  │
├──────────────────┼─────────┼─────────┤
│ Equipment        │ 5000.00 │ 2000.00 │  ✗ Which is it?
└──────────────────┴─────────┴─────────┘
```

### Error Message Best Practices

#### Include Context
```
Bad:  "Invalid amount"
Good: "Line amounts must be positive (Office Expense: debit -500.00)"

Bad:  "Line error"
Good: "Line must have either debit or credit amount (Cash Account)"
```

#### List Multiple Errors
```
Entry validation failed with 3 errors:
- Line 2 (Expense Account): amounts must be positive (debit -200.00)
- Line 4 (Revenue Account): must have either debit or credit amount
- Line 5 (Cash Account): cannot have both debit and credit amounts
```

### Expected Outcome
- Line amount validation operational
- Positive-only amounts enforced
- Exclusive debit/credit rule enforced
- Clear error messages with line identification

### Verification Checklist
- [ ] validate_line_amounts function defined
- [ ] Negative amount check implemented
- [ ] Both zero check implemented
- [ ] Both populated check implemented
- [ ] Decimal zero comparison used
- [ ] Error messages include line context
- [ ] Multiple errors aggregated properly

---

## Task 31: Add Account Active Check

### Overview
Implement validation to ensure all accounts referenced in journal entry lines are currently active. Inactive accounts should not be used in new entries to prevent transactions from affecting closed or obsolete accounts. This maintains data integrity and ensures financial reports only include relevant accounts.

### Dependencies
- Task 30: Add Non-Zero Check

### Instructions

1. **Open entry_validators.py file**
   - Continue in validators module
   - Add account status validation

2. **Define validate_line_accounts_active function**
   - Function name: `validate_line_accounts_active`
   - Single parameter: journal_entry
   - Returns None or raises ValidationError
   - Checks all line account statuses

3. **Query entry lines with accounts**
   - Get all lines for the entry
   - Use select_related('account') for efficiency
   - Avoid N+1 query problem
   - Access account status per line

4. **Check is_active field**
   - Verify account.is_active == True for each line
   - Collect any inactive accounts found
   - Track line information for error messages
   - Continue checking all lines (don't stop at first error)

5. **Build list of inactive accounts**
   - Create list of inactive account identifiers
   - Include account code or name
   - Include line information
   - Prepare for comprehensive error message

6. **Raise error if inactive accounts found**
   - If list not empty, raise ValidationError
   - Message: "Entry contains inactive accounts: [list]"
   - Include all inactive accounts in message
   - Help user identify all problem accounts at once

7. **Handle edge cases**
   - Lines with null account (caught by database constraints)
   - Account soft-deleted vs is_active=False
   - Account activated/deactivated during entry creation
   - Bulk validation for multiple entries

### Account Active Validation Logic

```
┌─────────────────────────────────────────────┐
│  validate_line_accounts_active(entry)       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Get all lines with accounts                │
│  lines = entry.lines.select_related(...)    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  inactive_accounts = []                     │
│  For each line:                             │
│    if not line.account.is_active:           │
│      inactive_accounts.append(account)      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  inactive_accounts is empty?                │
└──────┬───────────────────────┬──────────────┘
       │                       │
      Yes                     No
       │                       │
       ▼                       ▼
┌──────────┐          ┌────────────────────────┐
│   Pass   │          │ Raise ValidationError  │
└──────────┘          │ "Entry contains        │
                      │  inactive accounts"    │
                      └────────────────────────┘
```

### Account Active Scenarios

#### Valid: All Accounts Active
```
Entry: Office Purchase

Line 1: Office Expense (5100)  [Active ✓] - Debit: 500.00
Line 2: Cash Account (1000)    [Active ✓] - Credit: 500.00

All accounts active: VALID ✓
```

#### Invalid: One Inactive Account
```
Entry: Purchase with Closed Account

Line 1: Old Expense Account (5999)  [Inactive ✗] - Debit: 300.00
Line 2: Cash Account (1000)         [Active ✓]   - Credit: 300.00

Error: "Entry contains inactive accounts: Old Expense Account (5999)"
```

#### Invalid: Multiple Inactive Accounts
```
Entry: Entry with Multiple Closed Accounts

Line 1: Obsolete Expense (5998)    [Inactive ✗] - Debit: 200.00
Line 2: Deprecated Asset (1999)    [Inactive ✗] - Debit: 300.00
Line 3: Cash Account (1000)        [Active ✓]   - Credit: 500.00

Error: "Entry contains inactive accounts: Obsolete Expense (5998), Deprecated Asset (1999)"
```

#### Valid: Complex Entry All Active
```
Entry: Multi-Line Payroll

Line 1: Salary Expense (5200)      [Active ✓] - Debit: 10,000.00
Line 2: Tax Payable (2300)         [Active ✓] - Credit: 2,000.00
Line 3: Benefits Payable (2310)    [Active ✓] - Credit: 1,000.00
Line 4: Bank Account (1100)        [Active ✓] - Credit: 7,000.00

All accounts active: VALID ✓
```

### Why Check Account Status?

#### Prevent Transactions on Closed Accounts
```
Scenario: Account Closure

Step 1: Account "Old Marketing Expense (5990)" is closed
        - is_active = False
        - No longer used in new fiscal year

Step 2: User attempts entry with account 5990
        - Validation BLOCKS entry
        - Error message shown
        - User must select current account

Result: Financial reports remain clean and accurate
```

#### Maintain Chart of Accounts Integrity
```
Active Chart:
├─ 1000: Cash (Active) ✓
├─ 1100: Bank (Active) ✓
├─ 1999: Old Asset (Inactive) ✗
├─ 5100: Operating Expense (Active) ✓
└─ 5990: Deprecated Expense (Inactive) ✗

New entries only use:
- 1000, 1100, 5100 ✓

New entries cannot use:
- 1999, 5990 ✗ (validation prevents)
```

### Account Lifecycle

```
┌──────────────┐
│ Account      │
│ Created      │
│ is_active=   │
│    True      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ In Use       │◄─── Entries can use ✓
│ is_active=   │
│    True      │
└──────┬───────┘
       │
       │ (Business closes department)
       │
       ▼
┌──────────────┐
│ Deactivated  │
│ is_active=   │◄─── Entries BLOCKED ✗
│    False     │
└──────┬───────┘
       │
       │ (Keep for historical records)
       │
       ▼
┌──────────────┐
│ Archived     │
│ (in database │◄─── Still appears in old entries
│  but inactive)│     Cannot use in new entries ✗
└──────────────┘
```

### Performance Optimization

#### Use select_related
```
Bad (N+1 queries):
lines = entry.lines.all()
for line in lines:
    if not line.account.is_active:  # Extra query per line!
        # handle error

Good (Single query with join):
lines = entry.lines.select_related('account').all()
for line in lines:
    if not line.account.is_active:  # No extra query
        # handle error

For 10 lines:
- Bad: 1 query + 10 queries = 11 queries
- Good: 1 query = 1 query
```

### Error Message Format

#### Single Inactive Account
```
Entry contains inactive account: Office Expense (5999)
```

#### Multiple Inactive Accounts
```
Entry contains inactive accounts: 
- Old Marketing Expense (5990)
- Deprecated Asset Account (1999)
- Closed Revenue Account (4500)
```

### Expected Outcome
- Account active status validated
- Inactive accounts blocked from new entries
- Clear error messages with account details
- Performance optimized with select_related

### Verification Checklist
- [ ] validate_line_accounts_active function defined
- [ ] Lines queried with select_related
- [ ] is_active field checked per line
- [ ] Inactive accounts collected in list
- [ ] ValidationError raised if inactive found
- [ ] Error message lists all inactive accounts
- [ ] Function handles multiple inactive accounts

---

## Task 32: Add Entry Period Check

### Overview
Implement validation to ensure journal entries can only be created or modified for dates that fall within an open accounting period. Entries for dates in closed or locked periods must be rejected to maintain the integrity of finalized financial statements and prevent backdating of transactions.

### Dependencies
- Task 31: Add Account Active Check
- AccountingPeriod model exists (from earlier phase)

### Instructions

1. **Open entry_validators.py file**
   - Continue in validators module
   - Add accounting period validation

2. **Import AccountingPeriod model**
   - Import from apps.accounting.models
   - Access period status constants
   - Query periods by date range

3. **Define validate_entry_period function**
   - Function name: `validate_entry_period`
   - Single parameter: journal_entry
   - Returns None or raises ValidationError
   - Checks entry date against periods

4. **Get entry date**
   - Access entry.entry_date field
   - Date to validate against periods
   - Must fall within an open period
   - Handle timezone if date is datetime

5. **Query matching accounting period**
   - Find period where entry_date is in range
   - Query: start_date <= entry_date <= end_date
   - Use filter with date range comparison
   - Should match exactly one period

6. **Check if period exists**
   - If no matching period found
   - Raise ValidationError
   - Message: "Entry date {date} does not fall within any accounting period"
   - User must create period first

7. **Check period status**
   - Verify period.status == 'open'
   - Reject if status is 'closed' or 'locked'
   - Each status has different implications
   - Use clear status-specific messages

8. **Handle closed period**
   - If period status is 'closed'
   - Error: "Entry date {date} falls in closed period {period_name}"
   - Indicate period must be reopened
   - May require special permission

9. **Handle locked period**
   - If period status is 'locked'
   - Error: "Entry date {date} falls in locked period {period_name}"
   - Indicate period is finalized
   - Usually cannot reopen without audit trail

10. **Handle edge cases**
    - Entry date is None (should be caught by field validation)
    - Multiple periods overlap (database constraint issue)
    - Period boundaries (inclusive or exclusive)
    - Fiscal year not set up yet

### Period Validation Logic

```
┌─────────────────────────────────────┐
│  validate_entry_period(entry)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Get entry.entry_date               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Find period containing date        │
│  period = AccountingPeriod.filter(  │
│    start <= date <= end)            │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    Not Found       Found
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────────┐
│ Error: "No   │  │ Check period     │
│ period for   │  │ status           │
│ this date"   │  └────┬─────────────┘
└──────────────┘       │
                ┌──────┴──────┬──────────┐
                ▼             ▼          ▼
         ┌───────────┐ ┌──────────┐ ┌────────┐
         │ status =  │ │ status = │ │status =│
         │  'open'   │ │ 'closed' │ │'locked'│
         └─────┬─────┘ └────┬─────┘ └───┬────┘
               │            │            │
               ▼            ▼            ▼
         ┌─────────┐  ┌─────────┐  ┌─────────┐
         │  Pass   │  │ Error:  │  │ Error:  │
         └─────────┘  │ "Closed"│  │ "Locked"│
                      └─────────┘  └─────────┘
```

### Period Validation Scenarios

#### Valid: Entry in Open Period
```
Entry Date: 2025-03-15

Period: March 2025
- Start Date: 2025-03-01
- End Date: 2025-03-31
- Status: OPEN ✓

Result: VALID ✓
```

#### Invalid: Entry in Closed Period
```
Entry Date: 2025-01-15

Period: January 2025
- Start Date: 2025-01-01
- End Date: 2025-01-31
- Status: CLOSED ✗

Error: "Entry date 2025-01-15 falls in closed period January 2025"
```

#### Invalid: Entry in Locked Period
```
Entry Date: 2024-12-15

Period: December 2024
- Start Date: 2024-12-01
- End Date: 2024-12-31
- Status: LOCKED ✗

Error: "Entry date 2024-12-15 falls in locked period December 2024"
```

#### Invalid: No Period Exists
```
Entry Date: 2026-06-15

Periods: None matching date

Error: "Entry date 2026-06-15 does not fall within any accounting period"
```

### Period Status Meanings

| Status | Description | Allow Entries? | Can Reopen? |
|--------|-------------|----------------|-------------|
| OPEN | Current working period | Yes ✓ | N/A (already open) |
| CLOSED | Period closed, under review | No ✗ | Yes (with permission) |
| LOCKED | Period finalized, audited | No ✗ | Rarely (audit trail required) |

### Accounting Period Lifecycle

```
┌──────────────┐
│ Period       │
│ Created      │
│ Status: OPEN │
└──────┬───────┘
       │
       │ (Month in progress)
       │
       ▼
┌──────────────┐
│ Active Use   │◄─── Entries allowed ✓
│ Status: OPEN │
└──────┬───────┘
       │
       │ (Month ends, reconciliation begins)
       │
       ▼
┌──────────────┐
│ Month End    │
│ Status:      │◄─── Entries BLOCKED ✗
│  CLOSED      │     Can reopen if needed
└──────┬───────┘
       │
       │ (Financial statements finalized)
       │
       ▼
┌──────────────┐
│ Finalized    │
│ Status:      │◄─── Entries BLOCKED ✗
│  LOCKED      │     Permanent (normally)
└──────────────┘
```

### Why Validate Periods?

#### Prevent Backdating
```
Scenario: Closing Books

Current Date: 2025-02-15
Current Period: February 2025 (OPEN)
Previous Period: January 2025 (CLOSED)

User attempts entry dated 2025-01-25:
- Validation BLOCKS entry
- January period is closed
- Prevents manipulating prior month results

Benefit: Financial integrity maintained
```

#### Audit Trail Integrity
```
Period Timeline:
┌─────────┬─────────┬─────────┬─────────┐
│   Jan   │   Feb   │   Mar   │   Apr   │
│ LOCKED  │ CLOSED  │  OPEN   │ FUTURE  │
└─────────┴─────────┴─────────┴─────────┘
    ✗         ✗         ✓         ✗

Only March accepts new entries
- January: Finalized, audited
- February: Closed, being reviewed
- March: Current working period
- April: Not yet started

Clear separation of periods
```

### Period Boundary Examples

#### Entry on Period Boundary
```
Period: January 2025
- Start: 2025-01-01 (inclusive)
- End: 2025-01-31 (inclusive)

Entry Date: 2025-01-01 → In period ✓
Entry Date: 2025-01-31 → In period ✓
Entry Date: 2025-02-01 → Not in period ✗
```

#### Entry Between Periods
```
Period 1: January 2025 (2025-01-01 to 2025-01-31) CLOSED
Period 2: February 2025 (2025-02-01 to 2025-02-28) OPEN

Entry Date: 2025-01-31 → January (CLOSED) ✗
Entry Date: 2025-02-01 → February (OPEN) ✓
```

### Error Messages by Scenario

| Scenario | Error Message | Action Required |
|----------|---------------|-----------------|
| No period | "Entry date {date} does not fall within any accounting period" | Create period or change date |
| Closed period | "Entry date {date} falls in closed period {period_name}" | Reopen period or change date |
| Locked period | "Entry date {date} falls in locked period {period_name}" | Change date (cannot reopen) |

### Integration with Other Validators

```
Complete Validation Flow:

1. validate_entry_minimum_lines()
   └─ At least 2 lines

2. validate_line_amounts()
   └─ Positive amounts, debit OR credit

3. validate_entry_not_zero()
   └─ Non-zero debits and credits

4. validate_entry_balance()
   └─ Debits = Credits

5. validate_line_accounts_active()
   └─ All accounts active

6. validate_entry_period() ◄─── This task
   └─ Entry date in open period

All must pass for valid entry.
```

### Expected Outcome
- Period validation operational
- Closed/locked periods protected
- Clear status-specific error messages
- Maintains financial statement integrity

### Verification Checklist
- [ ] validate_entry_period function defined
- [ ] AccountingPeriod model imported
- [ ] Entry date extracted correctly
- [ ] Period query by date range implemented
- [ ] No period found case handled
- [ ] Closed period check implemented
- [ ] Locked period check implemented
- [ ] Error messages include period names
- [ ] Function handles all period statuses

---

## Summary

This document completed the comprehensive validation system for journal entries by creating six critical validators that enforce double-entry bookkeeping rules and maintain accounting integrity.

### Validators Implemented

1. **Balance Validator:** Ensures debits equal credits
2. **Zero Balance Check:** Prevents empty/meaningless entries
3. **Minimum Lines Check:** Enforces at least 2 lines per entry
4. **Non-Zero Check:** Validates positive, exclusive amounts per line
5. **Account Active Check:** Blocks inactive accounts
6. **Period Check:** Restricts to open periods only

These validators work together to maintain data integrity and uphold accounting standards in the journal entry system.

### Next Steps
Proceed to [Group-C_Auto-Generated-Entries](../Group-C_Auto-Generated-Entries/) to implement automatic journal entry generation from business transactions.
