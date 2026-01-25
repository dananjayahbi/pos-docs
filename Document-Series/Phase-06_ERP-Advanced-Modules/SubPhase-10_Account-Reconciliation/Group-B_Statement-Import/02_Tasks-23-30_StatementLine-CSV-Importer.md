# Tasks 23-30: StatementLine Model and CSV Importer Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** B - Statement Import  
> **Document:** 02 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-22_BankStatement-Model.md](01_Tasks-15-22_BankStatement-Model.md)
- **→ Next Group:** [../Group-C_Matching-Engine/](../Group-C_Matching-Engine/)

---

## Document Overview

This document covers the StatementLine model for individual bank transactions and the CSV importer service. These components enable the system to parse and import bank statement files, storing each transaction line with its associated details and maintaining running balances for reconciliation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 23 | Create StatementLine model | Medium | 30 min |
| 24 | Add line transaction date | Low | 10 min |
| 25 | Add line description | Low | 10 min |
| 26 | Add line amount fields | Medium | 25 min |
| 27 | Add line reference | Low | 10 min |
| 28 | Add line balance | Low | 15 min |
| 29 | Run StatementLine migrations | Low | 10 min |
| 30 | Create CSV importer service | High | 60 min |

---

## Task 23: Create StatementLine Model

### Overview
Create the StatementLine model that represents individual transactions within a bank statement. Each line captures a single bank transaction with all relevant details including date, description, amounts, and running balance. This model serves as the detailed transaction log that gets matched against internal accounting records during reconciliation.

### Dependencies
- Task 22: BankStatement migrations completed
- BankStatement model exists
- Accounting app structure established
- Django ORM configured

### Instructions

1. **Create statement_line.py model file**
   - Create file at `apps/accounting/models/statement_line.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import BankStatement model
   - Import Decimal for precise currency handling

3. **Define StatementLine model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring

4. **Add statement field (ForeignKey)**
   - Reference to parent BankStatement
   - on_delete=CASCADE (lines deleted with statement)
   - related_name='lines' for reverse lookup
   - db_index=True for query performance

5. **Add line_number field**
   - PositiveIntegerField
   - Sequential number within statement
   - Helps maintain original order
   - Used for displaying/sorting

6. **Add is_reconciled field**
   - BooleanField, default=False
   - Indicates if line is matched to transaction
   - Used in reconciliation status tracking

7. **Add reconciled_transaction field**
   - ForeignKey to accounting Transaction (nullable)
   - Links statement line to matched transaction
   - null=True, blank=True
   - on_delete=SET_NULL (preserve line if transaction deleted)

8. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by line_number
   - Add unique_together constraint (statement, line_number)
   - Add index on (statement, is_reconciled)
   - Add index on transaction_date

9. **Add __str__ method**
   - Return descriptive representation
   - Format: "Line #X: [date] [description] [amount]"
   - Truncate description if too long

10. **Add property methods**
    - Add amount property (returns debit or credit)
    - Add transaction_type property (returns 'DEBIT' or 'CREDIT')
    - Add is_debit and is_credit boolean properties

11. **Update models/__init__.py**
    - Import StatementLine
    - Add to __all__ list

### StatementLine Structure

```
StatementLine Model
═══════════════════════════════════════════════════════════
Core Identification:
├── id (Primary Key)
├── statement (FK → BankStatement)
└── line_number (Position in statement)

Transaction Details:
├── transaction_date (Date of transaction)
├── description (Transaction narration)
├── reference (Check/reference number)
├── debit (Withdrawal amount)
├── credit (Deposit amount)
└── running_balance (Balance after transaction)

Reconciliation Tracking:
├── is_reconciled (Match status)
└── reconciled_transaction (FK → Transaction)

Audit Fields (from mixins):
├── tenant (Multi-tenancy)
├── created_at (Record creation)
└── updated_at (Last modification)
```

### StatementLine Relationships

```
         BankStatement
              │
              │ 1:N
              │
              ▼
         StatementLine ────┐
              │            │
              │            │ N:1 (optional)
              │            │
              ▼            ▼
      [Transaction Data]  Transaction
                         (Reconciled)
```

### Line Number Sequencing

```
Bank Statement #BS-2025-001
════════════════════════════════════════════════════════
Opening Balance: Rs. 50,000.00

Line #  Date        Description          Amount    Balance
────────────────────────────────────────────────────────
1       2025-01-01  Opening Balance        ---    50,000.00
2       2025-01-02  Deposit - Cash      +5,000    55,000.00
3       2025-01-03  Cheque #123456      -1,500    53,500.00
4       2025-01-05  Bank Transfer       +10,000   63,500.00
5       2025-01-07  ATM Withdrawal      -2,000    61,500.00
6       2025-01-10  Service Charges        -100    61,400.00
────────────────────────────────────────────────────────
Closing Balance: Rs. 61,400.00

Each row above = 1 StatementLine record
Line numbers maintain original statement order
```

### Expected Outcome
- Foundation for transaction line storage
- Parent-child relationship with BankStatement
- Reconciliation status tracking
- Ordered line sequencing
- Link to matched transactions

### Verification Checklist
- [ ] `statement_line.py` file created
- [ ] StatementLine model defined
- [ ] statement FK added with CASCADE
- [ ] line_number field added
- [ ] is_reconciled boolean added
- [ ] reconciled_transaction FK added (nullable)
- [ ] Model inherits TenantAwareMixin and TimestampMixin
- [ ] Meta class with ordering defined
- [ ] Unique constraint on (statement, line_number)
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 24: Add Line Transaction Date

### Overview
Add the transaction_date field to capture when each bank transaction occurred. This date is critical for matching transactions chronologically during reconciliation, as transactions must be matched within reasonable time windows. The date may differ from the value date or posting date in some banking systems.

### Dependencies
- Task 23: StatementLine model created

### Instructions

1. **Open statement_line.py file**
   - Navigate to StatementLine model
   - Locate field definitions section

2. **Add transaction_date field**
   - DateField type
   - Required field (no null, no blank)
   - Add help_text explaining purpose
   - Add db_index=True for query performance

3. **Add value_date field (optional)**
   - DateField, nullable
   - blank=True, null=True
   - Some banks distinguish transaction vs value date
   - Value date = when funds actually move

4. **Add posting_date field (optional)**
   - DateField, nullable
   - blank=True, null=True
   - Date transaction posted to account
   - May differ from transaction date

5. **Update Meta class**
   - Add index on transaction_date
   - Consider composite index (tenant, transaction_date)
   - Update ordering to include transaction_date

6. **Update __str__ method**
   - Include formatted transaction date
   - Use localized date format

### Date Field Purposes

| Date Field | Purpose | Example | Sri Lankan Context |
|------------|---------|---------|-------------------|
| transaction_date | Actual transaction occurrence | 2025-01-15 | Most commonly used |
| value_date | When funds are available | 2025-01-16 | Used for interest calculations |
| posting_date | When bank processed it | 2025-01-17 | Internal bank processing |

### Date Scenarios

#### Scenario 1: Simple Cash Deposit
```
Transaction Date: 2025-01-15 (deposit made)
Value Date:       2025-01-15 (funds available immediately)
Posting Date:     2025-01-15 (processed same day)

Result: All dates same for immediate transactions
```

#### Scenario 2: Cheque Deposit
```
Transaction Date: 2025-01-15 (cheque deposited)
Value Date:       2025-01-17 (funds available after clearing)
Posting Date:     2025-01-17 (posted after clearing)

Result: 2-day delay for cheque clearing in Sri Lanka
```

#### Scenario 3: International Transfer
```
Transaction Date: 2025-01-15 (transfer initiated)
Value Date:       2025-01-18 (SWIFT processing time)
Posting Date:     2025-01-18 (posted when received)

Result: 3-day delay for international transactions
```

#### Scenario 4: Weekend Transaction
```
Transaction Date: 2025-01-13 (Saturday - ATM withdrawal)
Value Date:       2025-01-13 (immediate deduction)
Posting Date:     2025-01-15 (Monday - bank opens)

Result: Posting delayed to next business day
```

### Date Matching Logic

```
Reconciliation Date Window
══════════════════════════════════════════════════════════

Statement Line Date: 2025-01-15
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Day -2           Day 0            Day +2
  2025-01-13      2025-01-15       2025-01-17
        │                │                │
        └────────────────┴────────────────┘
              Matching Window (±2 days)

System searches for internal transactions within this
window to account for processing delays and date 
differences between internal records and bank records.
```

### Sri Lanka Banking Date Considerations

| Bank Operation | Typical Date Behavior |
|----------------|----------------------|
| Cash deposit/withdrawal | Same-day value date |
| Local cheque | 2-3 working days to clear |
| Inter-bank transfer | Same day or next day |
| International transfer | 3-5 working days |
| Standing orders | Posted on specified date |
| Direct debits | Posted on due date |
| Bank charges | Last day of month typically |

### Expected Outcome
- Accurate transaction date tracking
- Optional value and posting dates
- Proper indexing for date-based queries
- Support for date-range reconciliation
- Handle banking date complexities

### Verification Checklist
- [ ] transaction_date field added (required)
- [ ] Field type is DateField
- [ ] db_index=True set
- [ ] help_text added
- [ ] value_date field added (optional)
- [ ] posting_date field added (optional)
- [ ] Meta indexes updated
- [ ] __str__ method includes date
- [ ] Date format follows localization

---

## Task 25: Add Line Description

### Overview
Add the description field to store the transaction narration or description text from the bank statement. This field captures the human-readable explanation of what the transaction was for, often including merchant names, payment references, or transaction types. The description is crucial for manual reconciliation and transaction identification.

### Dependencies
- Task 23: StatementLine model created

### Instructions

1. **Open statement_line.py file**
   - Navigate to StatementLine model
   - Locate field definitions section

2. **Add description field**
   - TextField type (unlimited length)
   - Required field (no blank, no null)
   - Contains transaction narration from bank

3. **Add description_clean field (optional)**
   - TextField, nullable
   - blank=True, null=True
   - Stores cleaned/normalized description
   - Useful for matching algorithms

4. **Add memo field (optional)**
   - TextField, nullable
   - blank=True, null=True
   - Additional notes from user
   - Manual annotations during reconciliation

5. **Add helper method: clean_description()**
   - Remove extra whitespace
   - Normalize case
   - Remove special characters
   - Store in description_clean field

6. **Add helper method: get_merchant_name()**
   - Extract merchant/payee name
   - Parse common description patterns
   - Return None if cannot determine

### Description Field Structure

```
Description Components
══════════════════════════════════════════════════════════

Raw Description (from bank):
"POS PURCHASE 15/01/25 KEELLS SUPER RAJAGIRIYA LK"

Parsed Components:
├── Transaction Type: "POS PURCHASE"
├── Date: "15/01/25"
├── Merchant: "KEELLS SUPER"
├── Location: "RAJAGIRIYA"
└── Country: "LK"

Clean Description:
"KEELLS SUPER RAJAGIRIYA"

Extracted Merchant:
"KEELLS SUPER"
```

### Common Sri Lankan Description Patterns

#### POS/Card Transactions
```
Pattern: "POS PURCHASE [DATE] [MERCHANT] [LOCATION] LK"
Example: "POS PURCHASE 15/01/25 ARPICO SUPERCENTER NUGEGODA LK"

Cleaning:
- Remove "POS PURCHASE"
- Remove date
- Remove country code
- Result: "ARPICO SUPERCENTER NUGEGODA"
```

#### ATM Withdrawals
```
Pattern: "ATM WITHDRAWAL [ATM-ID] [LOCATION]"
Example: "ATM WITHDRAWAL 123456 COLOMBO 07"

Cleaning:
- Keep "ATM WITHDRAWAL"
- Remove ATM ID if numeric
- Keep location
- Result: "ATM WITHDRAWAL COLOMBO 07"
```

#### Bank Transfers
```
Pattern: "BANK TRANSFER [REFERENCE] [PAYEE-NAME]"
Example: "BANK TRANSFER 987654321 JOHN SILVA"

Cleaning:
- Remove reference number
- Keep payee name
- Result: "BANK TRANSFER JOHN SILVA"
```

#### Cheque Payments
```
Pattern: "CHEQUE NO [NUMBER] PAID"
Example: "CHEQUE NO 123456 PAID"

Cleaning:
- Keep cheque indicator
- Keep number
- Result: "CHEQUE 123456"
```

#### Direct Debits
```
Pattern: "DIRECT DEBIT [BILLER-NAME] [REFERENCE]"
Example: "DIRECT DEBIT SLT BB PAYMENT 445566"

Cleaning:
- Keep biller name
- Remove reference
- Result: "SLT BB PAYMENT"
```

#### Salary Credits
```
Pattern: "SALARY CREDIT [COMPANY-NAME]"
Example: "SALARY CREDIT ABC COMPANY PVT LTD"

Cleaning:
- Keep full company name
- Result: "SALARY CREDIT ABC COMPANY"
```

### Description Length Considerations

| Description Type | Typical Length | Max Observed |
|-----------------|----------------|--------------|
| Simple (e.g., "Cash Deposit") | 10-30 chars | 50 chars |
| POS Transaction | 40-80 chars | 120 chars |
| Bank Transfer | 30-60 chars | 100 chars |
| International Wire | 80-150 chars | 200+ chars |

**Recommendation:** Use TextField (unlimited) to avoid truncation issues.

### Description Matching Strategies

```
Multi-Level Matching Approach
══════════════════════════════════════════════════════════

Level 1: Exact Match
├── Raw description matches exactly
└── Confidence: 100%

Level 2: Clean Match
├── Cleaned descriptions match
├── Case-insensitive, whitespace-normalized
└── Confidence: 95%

Level 3: Keyword Match
├── Key terms present in both
├── Merchant name identified
└── Confidence: 80%

Level 4: Fuzzy Match
├── Levenshtein distance < threshold
├── Partial string matching
└── Confidence: 60%

Level 5: Manual Review
├── No automatic match found
└── Requires user intervention
```

### Description Search and Filtering

```
Description-Based Queries
══════════════════════════════════════════════════════════

Use Case 1: Find all transactions at a merchant
Query: description__icontains='KEELLS'
Result: All Keells supermarket transactions

Use Case 2: Find all ATM withdrawals
Query: description__istartswith='ATM WITHDRAWAL'
Result: All ATM transactions

Use Case 3: Find all salary credits
Query: description__icontains='SALARY CREDIT'
Result: All salary deposits

Use Case 4: Find specific cheque
Query: description__icontains='CHEQUE NO 123456'
Result: Specific cheque payment
```

### Expected Outcome
- Complete transaction description storage
- Support for variable-length descriptions
- Optional cleaned description for matching
- Memo field for user annotations
- Description parsing utilities

### Verification Checklist
- [ ] description field added (TextField)
- [ ] Field is required (no blank/null)
- [ ] description_clean field added (optional)
- [ ] memo field added (optional)
- [ ] clean_description() method implemented
- [ ] get_merchant_name() method implemented
- [ ] Description included in __str__ method
- [ ] Support for Unicode characters (Sinhala/Tamil)

---

## Task 26: Add Line Amount Fields

### Overview
Add debit and credit amount fields to store transaction values. Using separate debit and credit fields follows standard banking convention and simplifies reconciliation logic. Most bank statements show withdrawals in the debit column and deposits in the credit column. This structure prevents confusion and eliminates the need for positive/negative number handling.

### Dependencies
- Task 23: StatementLine model created

### Instructions

1. **Open statement_line.py file**
   - Navigate to StatementLine model
   - Locate field definitions section

2. **Add debit field**
   - DecimalField type
   - max_digits=15, decimal_places=2
   - null=True, blank=True
   - Represents withdrawals/outflows
   - Add validators for positive values only

3. **Add credit field**
   - DecimalField type
   - max_digits=15, decimal_places=2
   - null=True, blank=True
   - Represents deposits/inflows
   - Add validators for positive values only

4. **Add validation in clean() method**
   - Ensure exactly one of debit or credit is set
   - Both cannot be set simultaneously
   - Both cannot be null simultaneously
   - Raise ValidationError if invalid

5. **Add amount property**
   - Return debit as negative if debit is set
   - Return credit as positive if credit is set
   - Used for calculations

6. **Add absolute_amount property**
   - Return debit or credit (whichever is set)
   - Always positive value
   - Used for display purposes

7. **Add transaction_type property**
   - Return 'DEBIT' if debit is set
   - Return 'CREDIT' if credit is set
   - Used for categorization

8. **Add is_debit and is_credit properties**
   - Boolean properties for quick checks
   - is_debit: True if debit is set
   - is_credit: True if credit is set

### Debit vs Credit Convention

```
Banking Convention
══════════════════════════════════════════════════════════

DEBIT (Left Side)              CREDIT (Right Side)
─────────────────              ──────────────────
Money OUT                      Money IN
Withdrawals                    Deposits
Payments                       Receipts
Expenses                       Income
Checks written                 Checks received
ATM withdrawals                Salary credits
Bank charges                   Interest earned
```

### Field Structure Comparison

```
Option 1: Single Amount Field (NOT USED)
═════════════════════════════════════════════════════════
amount: DecimalField (can be positive or negative)

Example:
- Withdrawal: -1,500.00
- Deposit:    +5,000.00

Problems:
✗ Confusing sign conventions
✗ Harder to query (WHERE amount < 0)
✗ Not standard banking format
✗ Risk of sign errors


Option 2: Separate Debit/Credit Fields (USED)
═════════════════════════════════════════════════════════
debit:  DecimalField (null=True)
credit: DecimalField (null=True)

Example:
- Withdrawal: debit=1500.00, credit=NULL
- Deposit:    debit=NULL, credit=5000.00

Benefits:
✓ Matches bank statement format
✓ Clear transaction direction
✓ Standard accounting practice
✓ Easy to query (WHERE debit IS NOT NULL)
✓ No sign confusion
```

### Amount Validation Rules

```
Validation Logic
══════════════════════════════════════════════════════════

Rule 1: Mutually Exclusive
├── IF debit is set THEN credit must be NULL
└── IF credit is set THEN debit must be NULL

Rule 2: At Least One Required
├── debit IS NULL AND credit IS NULL → INVALID
└── At least one must have a value

Rule 3: Positive Values Only
├── debit > 0 (if set)
└── credit > 0 (if set)

Rule 4: Precision
├── Maximum 15 digits total
└── Exactly 2 decimal places
```

### Field Size Justification

```
max_digits=15, decimal_places=2

Maximum Value: 9,999,999,999,999.99
(9.99 trillion)

Sri Lankan Context:
──────────────────────────────────────────────────────────
Typical Transaction:         Rs. 10,000.00      (5 digits)
Large Transaction:           Rs. 1,000,000.00   (7 digits)
Very Large Transaction:      Rs. 100,000,000.00 (9 digits)
Corporate Transaction:       Rs. 10,000,000,000 (11 digits)

15 digits provides comfortable headroom for:
✓ Large corporate transactions
✓ International wire transfers
✓ Multi-currency conversions
✓ Future currency inflation
```

### Sample Statement Lines

```
Bank Statement Extract
══════════════════════════════════════════════════════════
Date        Description                    Debit      Credit
──────────────────────────────────────────────────────────
2025-01-02  Opening Balance                   -      50,000.00
2025-01-03  ATM Withdrawal                2,000.00        -
2025-01-05  Salary Credit                     -     150,000.00
2025-01-07  POS - Keells Super            3,456.75        -
2025-01-08  Bank Transfer IN                  -      25,000.00
2025-01-10  Cheque No 123456             50,000.00        -
2025-01-12  Service Charges                 100.00        -
2025-01-15  Interest Earned                   -         250.50
──────────────────────────────────────────────────────────

Database Records:
─────────────────
Line 1: debit=NULL,      credit=50000.00
Line 2: debit=2000.00,   credit=NULL
Line 3: debit=NULL,      credit=150000.00
Line 4: debit=3456.75,   credit=NULL
Line 5: debit=NULL,      credit=25000.00
Line 6: debit=50000.00,  credit=NULL
Line 7: debit=100.00,    credit=NULL
Line 8: debit=NULL,      credit=250.50
```

### Query Examples

```
Query Debits (Withdrawals):
──────────────────────────────────────────────────────────
StatementLine.objects.filter(debit__isnull=False)

Query Credits (Deposits):
──────────────────────────────────────────────────────────
StatementLine.objects.filter(credit__isnull=False)

Total Debits:
──────────────────────────────────────────────────────────
StatementLine.objects.aggregate(
    total_debit=Sum('debit')
)

Total Credits:
──────────────────────────────────────────────────────────
StatementLine.objects.aggregate(
    total_credit=Sum('credit')
)

Net Movement:
──────────────────────────────────────────────────────────
Sum(credit) - Sum(debit) = Net Change in Balance
```

### Expected Outcome
- Separate debit and credit fields
- Validation ensuring mutual exclusivity
- Helper properties for calculations
- Standard banking format compliance
- Precise decimal handling

### Verification Checklist
- [ ] debit field added (DecimalField)
- [ ] credit field added (DecimalField)
- [ ] max_digits=15, decimal_places=2
- [ ] Both fields nullable (null=True, blank=True)
- [ ] Positive value validators added
- [ ] clean() method validates mutual exclusivity
- [ ] amount property implemented (signed)
- [ ] absolute_amount property implemented
- [ ] transaction_type property implemented
- [ ] is_debit property implemented
- [ ] is_credit property implemented

---

## Task 27: Add Line Reference

### Overview
Add the reference field to store transaction reference numbers, check numbers, or other identifying codes from the bank statement. Reference numbers are crucial for matching transactions, tracking payment instruments, and providing audit trails. Different transaction types use different reference formats in Sri Lankan banking.

### Dependencies
- Task 23: StatementLine model created

### Instructions

1. **Open statement_line.py file**
   - Navigate to StatementLine model
   - Locate field definitions section

2. **Add reference field**
   - CharField with max_length=100
   - blank=True, null=True (optional)
   - Stores check numbers, transfer IDs, etc.
   - Add db_index=True for reference lookups

3. **Add reference_type field (optional)**
   - CharField with choices
   - Categorizes reference type
   - Choices: CHEQUE, TRANSFER, CARD, DIRECT_DEBIT, OTHER

4. **Add external_reference field (optional)**
   - CharField with max_length=100
   - blank=True, null=True
   - Stores references from external systems
   - Bank's internal transaction IDs

5. **Add helper method: parse_reference()**
   - Extract reference from description if not explicitly provided
   - Identify reference patterns
   - Update reference field automatically

6. **Update Meta class**
   - Add index on reference field
   - Add composite index (tenant, reference) for lookups

### Reference Types and Formats

```
Sri Lankan Bank Reference Formats
══════════════════════════════════════════════════════════

Cheque Numbers:
Format: 6-8 digit number
Example: "123456", "00123456"
Pattern: ^[0-9]{6,8}$

Bank Transfer Reference:
Format: 12-16 alphanumeric
Example: "TRF2501150001234"
Pattern: ^TRF[0-9]{12,13}$

Card Transaction Reference:
Format: Variable alphanumeric
Example: "POS2501150123456"
Pattern: ^POS[0-9]{10,12}$

Direct Debit Reference:
Format: Variable, often includes biller code
Example: "DD-CEB-445566"
Pattern: ^DD-[A-Z]+-[0-9]+$

SLIPS/CEFTS Reference:
Format: Sri Lanka Interbank Payment System
Example: "SLIPS2501150000123"
Pattern: ^SLIPS[0-9]{12,15}$

International Wire Reference:
Format: SWIFT reference
Example: "SWIFT20250115ABCD1234"
Pattern: ^SWIFT[0-9]{8}[A-Z0-9]+$
```

### Reference Type Enumeration

| Reference Type | Description | Example Format | Usage in SL |
|----------------|-------------|----------------|-------------|
| CHEQUE | Cheque/Check number | 123456 | Very Common |
| TRANSFER | Bank transfer ID | TRF2501150001234 | Very Common |
| CARD | Card transaction ref | POS2501150123456 | Very Common |
| DIRECT_DEBIT | DD reference | DD-CEB-445566 | Common |
| SLIPS | Interbank payment | SLIPS2501150000123 | Common |
| RTGS | Real-time gross settlement | RTGS2501150001 | Less Common |
| SWIFT | International wire | SWIFT20250115... | Less Common |
| OTHER | Miscellaneous | Various | As needed |

### Reference Extraction from Description

```
Pattern Recognition Examples
══════════════════════════════════════════════════════════

Example 1: Cheque in Description
Description: "CHEQUE NO 123456 PAID TO XYZ COMPANY"
Extracted Reference: "123456"
Reference Type: CHEQUE

Example 2: Transfer in Description
Description: "BANK TRANSFER TRF2501150001234 JOHN SILVA"
Extracted Reference: "TRF2501150001234"
Reference Type: TRANSFER

Example 3: Card Transaction
Description: "POS PURCHASE POS2501150123456 KEELLS"
Extracted Reference: "POS2501150123456"
Reference Type: CARD

Example 4: Direct Debit
Description: "DIRECT DEBIT DD-CEB-445566 ELECTRICITY"
Extracted Reference: "DD-CEB-445566"
Reference Type: DIRECT_DEBIT

Example 5: SLIPS Payment
Description: "SLIPS PAYMENT SLIPS2501150000123"
Extracted Reference: "SLIPS2501150000123"
Reference Type: SLIPS
```

### Reference-Based Matching Logic

```
Matching Priority by Reference Type
══════════════════════════════════════════════════════════

Priority 1: CHEQUE Numbers (Exact Match)
├── Cheque numbers are unique within account
├── Exact match = 100% confidence
└── Query: reference='123456' AND reference_type='CHEQUE'

Priority 2: TRANSFER References (Exact Match)
├── Transfer IDs are system-generated unique
├── Exact match = 100% confidence
└── Query: reference='TRF2501150001234'

Priority 3: CARD Transaction References
├── Card refs usually unique
├── Match with ±1 day date tolerance
└── Confidence: 95%

Priority 4: DIRECT_DEBIT References
├── Recurring references may repeat
├── Match with date and amount
└── Confidence: 90%

Priority 5: No Reference Available
├── Fall back to date, amount, description
├── Requires multiple criteria
└── Confidence: Variable (60-80%)
```

### Reference Indexing Strategy

```
Database Indexes for Reference Queries
══════════════════════════════════════════════════════════

Index 1: Single Column
CREATE INDEX idx_statement_line_reference 
ON statement_line(reference);

Usage: Fast lookup by reference number
Query: WHERE reference = '123456'


Index 2: Composite (Tenant + Reference)
CREATE INDEX idx_statement_line_tenant_ref 
ON statement_line(tenant_id, reference);

Usage: Multi-tenant reference lookup
Query: WHERE tenant_id = 1 AND reference = '123456'


Index 3: Composite (Type + Reference)
CREATE INDEX idx_statement_line_type_ref 
ON statement_line(reference_type, reference);

Usage: Typed reference lookup
Query: WHERE reference_type = 'CHEQUE' AND reference = '123456'
```

### Reference Validation and Cleaning

```
Reference Cleaning Process
══════════════════════════════════════════════════════════

Step 1: Trim Whitespace
Input:  "  123456  "
Output: "123456"

Step 2: Remove Non-Alphanumeric (selective)
Input:  "CHQ-#123456"
Output: "123456"

Step 3: Uppercase Conversion (for alpha)
Input:  "trf2501150001234"
Output: "TRF2501150001234"

Step 4: Leading Zero Handling
Input:  "00123456" (cheque)
Output: "123456" or preserve based on bank

Step 5: Validate Format
Check against expected patterns
Flag anomalies for review
```

### Expected Outcome
- Reference number storage
- Reference type categorization
- Pattern recognition for extraction
- Indexed for fast lookups
- Support for various reference formats

### Verification Checklist
- [ ] reference field added (CharField)
- [ ] max_length=100 set
- [ ] Field is optional (blank=True, null=True)
- [ ] db_index=True set
- [ ] reference_type field added (optional)
- [ ] external_reference field added (optional)
- [ ] parse_reference() method implemented
- [ ] Reference included in __str__ method
- [ ] Indexes on reference field added
- [ ] Reference validation implemented

---

## Task 28: Add Line Balance

### Overview
Add the running_balance field to store the account balance after each transaction. This running balance is crucial for detecting discrepancies, validating statement integrity, and identifying missing transactions. The balance progression should match the bank's calculations and can be used to verify the accuracy of imported data.

### Dependencies
- Task 23: StatementLine model created
- Task 26: Amount fields (debit/credit) added

### Instructions

1. **Open statement_line.py file**
   - Navigate to StatementLine model
   - Locate field definitions section

2. **Add running_balance field**
   - DecimalField type
   - max_digits=15, decimal_places=2
   - null=True, blank=True (optional in some formats)
   - Stores balance after this transaction

3. **Add balance_verified field**
   - BooleanField, default=False
   - Indicates if balance has been verified
   - Set to True after validation passes

4. **Add balance_discrepancy field**
   - DecimalField, nullable
   - null=True, blank=True
   - Stores calculated vs actual balance difference
   - Non-zero indicates problem

5. **Add helper method: calculate_expected_balance()**
   - Calculate balance based on previous line
   - previous_balance + credit - debit
   - Return expected balance

6. **Add helper method: verify_balance()**
   - Compare running_balance to calculated balance
   - Update balance_verified flag
   - Update balance_discrepancy if mismatch
   - Return True if match, False if discrepancy

7. **Add helper method: get_previous_balance()**
   - Get balance from previous line in statement
   - Used for balance calculation
   - Handle first line (use statement opening balance)

### Running Balance Calculation

```
Balance Progression Logic
══════════════════════════════════════════════════════════

Formula:
New Balance = Previous Balance + Credits - Debits

For Each Line:
running_balance = previous_line.running_balance 
                  + current_line.credit (if set)
                  - current_line.debit (if set)
```

### Balance Verification Example

```
Bank Statement with Running Balance
══════════════════════════════════════════════════════════

Opening Balance: Rs. 50,000.00

Line  Date        Description      Debit    Credit  Balance
─────────────────────────────────────────────────────────
1     2025-01-02  Salary            -      150,000  200,000 ✓
      Calculation: 50,000 + 150,000 = 200,000

2     2025-01-03  ATM Withdrawal  2,000      -      198,000 ✓
      Calculation: 200,000 - 2,000 = 198,000

3     2025-01-05  POS Purchase    3,500      -      194,500 ✓
      Calculation: 198,000 - 3,500 = 194,500

4     2025-01-07  Deposit           -       5,000   199,500 ✓
      Calculation: 194,500 + 5,000 = 199,500

5     2025-01-10  Bank Charges      100      -      199,400 ✓
      Calculation: 199,500 - 100 = 199,400

Closing Balance: Rs. 199,400.00 ✓

All balances verified successfully!
```

### Balance Discrepancy Detection

```
Scenario: Missing Transaction
══════════════════════════════════════════════════════════

Line  Date        Description      Debit    Credit  Balance  Status
──────────────────────────────────────────────────────────────────
1     2025-01-02  Salary            -      150,000  200,000  ✓
      Expected: 50,000 + 150,000 = 200,000
      Actual: 200,000
      Match: YES

2     2025-01-03  ATM Withdrawal  2,000      -      198,000  ✓
      Expected: 200,000 - 2,000 = 198,000
      Actual: 198,000
      Match: YES

3     2025-01-07  Deposit           -       5,000   200,500  ✗
      Expected: 198,000 + 5,000 = 203,000
      Actual: 200,500
      Match: NO!
      Discrepancy: -2,500

Analysis:
The balance shows 200,500 but should be 203,000.
This suggests a missing transaction of 2,500 debit
between lines 2 and 3.

Action Required:
- Check bank statement for missing lines
- Verify import was complete
- Investigate 2,500 debit transaction
```

### Balance Discrepancy Types

| Discrepancy Type | Cause | Detection | Resolution |
|------------------|-------|-----------|------------|
| Missing Transaction | Import skipped a line | Balance jump doesn't match | Re-import complete statement |
| Duplicate Transaction | Line imported twice | Balance drop unexpected | Remove duplicate |
| Incorrect Amount | Data entry error | Balance calculation off | Correct amount |
| Wrong Opening Balance | Statement header error | First line doesn't match | Update opening balance |
| Calculation Error | Bank error (rare) | Running balance wrong | Contact bank |

### Balance Verification Algorithm

```
Pseudo-code for Balance Verification
══════════════════════════════════════════════════════════

function verify_statement_balances(statement):
    lines = statement.lines.order_by('line_number')
    current_balance = statement.opening_balance
    all_valid = True
    
    for line in lines:
        # Calculate expected balance
        if line.debit:
            expected_balance = current_balance - line.debit
        elif line.credit:
            expected_balance = current_balance + line.credit
        else:
            expected_balance = current_balance
        
        # Compare with running balance if available
        if line.running_balance is not None:
            discrepancy = expected_balance - line.running_balance
            
            if abs(discrepancy) > 0.01:  # Allow 1 cent rounding
                line.balance_verified = False
                line.balance_discrepancy = discrepancy
                all_valid = False
                log_error(f"Line {line.line_number}: "
                         f"Expected {expected_balance}, "
                         f"Got {line.running_balance}")
            else:
                line.balance_verified = True
                line.balance_discrepancy = None
        
        # Update current balance for next iteration
        current_balance = expected_balance
        line.save()
    
    # Verify closing balance matches
    if abs(current_balance - statement.closing_balance) > 0.01:
        log_error("Closing balance mismatch: "
                 f"Expected {current_balance}, "
                 f"Got {statement.closing_balance}")
        all_valid = False
    
    return all_valid
```

### Balance Field Usage Scenarios

```
Scenario 1: CSV with Running Balance Column
═══════════════════════════════════════════════════════════
CSV has balance column → Import directly to running_balance
Verification: Calculate and compare with imported value
Result: High confidence in data integrity

Scenario 2: CSV without Balance Column
═══════════════════════════════════════════════════════════
CSV has only amounts → running_balance = NULL on import
Calculation: Compute from opening balance + transactions
Result: Store calculated balance, mark as computed

Scenario 3: Balance Discrepancy Found
═══════════════════════════════════════════════════════════
Imported balance ≠ calculated balance
Action: Set balance_verified = False
Flag: balance_discrepancy = difference amount
Review: Manual verification required
```

### Expected Outcome
- Running balance storage
- Balance verification capability
- Discrepancy detection and tracking
- Integrity validation support
- Support for statements with/without balances

### Verification Checklist
- [ ] running_balance field added (DecimalField)
- [ ] max_digits=15, decimal_places=2
- [ ] Field is optional (null=True, blank=True)
- [ ] balance_verified field added
- [ ] balance_discrepancy field added
- [ ] calculate_expected_balance() method implemented
- [ ] verify_balance() method implemented
- [ ] get_previous_balance() method implemented
- [ ] Balance verification on save
- [ ] Closing balance validation against statement

---

## Task 29: Run StatementLine Migrations

### Overview
Generate and apply Django migrations for the StatementLine model. This task creates the database schema for statement lines, establishes the relationship with BankStatement, and sets up all necessary indexes and constraints. Proper migration ensures data integrity and optimal query performance.

### Dependencies
- Task 28: All StatementLine fields added
- Task 22: BankStatement migrations completed
- Database connection configured
- Django migrations framework operational

### Instructions

1. **Review model completeness**
   - Verify all fields are defined
   - Check all relationships are correct
   - Ensure indexes are specified
   - Validate Meta class configuration

2. **Generate migration file**
   - Run makemigrations command
   - Review generated migration file
   - Check field definitions
   - Verify foreign key relationships

3. **Inspect migration operations**
   - CreateModel operation for StatementLine
   - AddField operations for all fields
   - CreateIndex operations for indexes
   - AlterUniqueTogether for constraints

4. **Review migration dependencies**
   - Ensure depends_on includes BankStatement migration
   - Check tenant model dependency
   - Verify all FK targets exist

5. **Test migration in development**
   - Apply migration to dev database
   - Verify table creation
   - Check indexes are created
   - Test foreign key constraints

6. **Apply migration to database**
   - Run migrate command
   - Verify successful application
   - Check for any errors or warnings

7. **Verify database schema**
   - Inspect created table structure
   - Verify column types and constraints
   - Check indexes exist
   - Test basic CRUD operations

8. **Document migration**
   - Note migration file name
   - Document any special considerations
   - Update migration tracking

### Migration Structure

```
Migration File: 0012_statementline.py
══════════════════════════════════════════════════════════

dependencies = [
    ('accounting', '0011_bankstatement'),
    ('tenants', '0001_initial'),
]

operations = [
    migrations.CreateModel(
        name='StatementLine',
        fields=[
            ('id', AutoField...),
            ('tenant', ForeignKey...),
            ('statement', ForeignKey to BankStatement...),
            ('line_number', PositiveIntegerField...),
            ('transaction_date', DateField...),
            ('description', TextField...),
            ('debit', DecimalField...),
            ('credit', DecimalField...),
            ('reference', CharField...),
            ('running_balance', DecimalField...),
            ('is_reconciled', BooleanField...),
            ('reconciled_transaction', ForeignKey...),
            ('balance_verified', BooleanField...),
            ('balance_discrepancy', DecimalField...),
            ('created_at', DateTimeField...),
            ('updated_at', DateTimeField...),
        ],
    ),
    migrations.AddIndex(
        model_name='statementline',
        index=Index(fields=['statement', 'line_number']),
    ),
    migrations.AddIndex(
        model_name='statementline',
        index=Index(fields=['transaction_date']),
    ),
    migrations.AddIndex(
        model_name='statementline',
        index=Index(fields=['reference']),
    ),
    migrations.AddIndex(
        model_name='statementline',
        index=Index(fields=['tenant', 'is_reconciled']),
    ),
    migrations.AlterUniqueTogether(
        name='statementline',
        unique_together={('statement', 'line_number')},
    ),
]
```

### Database Schema Verification

```
Table: accounting_statementline
══════════════════════════════════════════════════════════

Columns:
├── id (bigint, PRIMARY KEY)
├── tenant_id (bigint, FOREIGN KEY → tenants_tenant)
├── statement_id (bigint, FOREIGN KEY → accounting_bankstatement)
├── line_number (integer, NOT NULL)
├── transaction_date (date, NOT NULL)
├── description (text, NOT NULL)
├── debit (numeric(15,2), NULL)
├── credit (numeric(15,2), NULL)
├── reference (varchar(100), NULL)
├── running_balance (numeric(15,2), NULL)
├── is_reconciled (boolean, DEFAULT false)
├── reconciled_transaction_id (bigint, NULL, FK → accounting_transaction)
├── balance_verified (boolean, DEFAULT false)
├── balance_discrepancy (numeric(15,2), NULL)
├── created_at (timestamp, DEFAULT now())
└── updated_at (timestamp, AUTO UPDATE)

Indexes:
├── PRIMARY KEY (id)
├── idx_statementline_statement_line (statement_id, line_number)
├── idx_statementline_transaction_date (transaction_date)
├── idx_statementline_reference (reference)
├── idx_statementline_tenant_reconciled (tenant_id, is_reconciled)
└── UNIQUE (statement_id, line_number)

Foreign Keys:
├── FK tenant_id → tenants_tenant.id (CASCADE)
├── FK statement_id → accounting_bankstatement.id (CASCADE)
└── FK reconciled_transaction_id → accounting_transaction.id (SET NULL)
```

### Post-Migration Testing

```
Test 1: Create Statement Line
══════════════════════════════════════════════════════════
from apps.accounting.models import StatementLine

line = StatementLine.objects.create(
    tenant=tenant,
    statement=statement,
    line_number=1,
    transaction_date='2025-01-15',
    description='Test Transaction',
    credit=Decimal('1000.00'),
    running_balance=Decimal('51000.00')
)

Expected: Line created successfully


Test 2: Verify Unique Constraint
══════════════════════════════════════════════════════════
# Try to create duplicate line number in same statement
duplicate_line = StatementLine.objects.create(
    tenant=tenant,
    statement=statement,
    line_number=1,  # Same as above
    ...
)

Expected: IntegrityError raised


Test 3: Test Cascade Delete
══════════════════════════════════════════════════════════
statement.delete()

Expected: All related statement lines deleted automatically


Test 4: Query Performance
══════════════════════════════════════════════════════════
# Should use index
lines = StatementLine.objects.filter(
    statement=statement,
    is_reconciled=False
).order_by('line_number')

Expected: Fast query using indexes
```

### Migration Rollback Plan

```
If Migration Fails or Issues Arise:
══════════════════════════════════════════════════════════

Step 1: Identify the issue
- Check error messages
- Review migration file
- Verify dependencies

Step 2: Rollback migration
Command: python manage.py migrate accounting 0011

Step 3: Fix the model or migration
- Correct field definitions
- Fix relationships
- Update constraints

Step 4: Delete migration file
Remove: 0012_statementline.py

Step 5: Regenerate migration
Command: python manage.py makemigrations

Step 6: Reapply
Command: python manage.py migrate
```

### Expected Outcome
- StatementLine table created in database
- All fields properly typed and constrained
- Foreign key relationships established
- Indexes created for optimal performance
- Unique constraints enforced
- Model ready for use

### Verification Checklist
- [ ] Migration file generated (0012_statementline.py)
- [ ] Migration dependencies correct
- [ ] CreateModel operation present
- [ ] All fields included in migration
- [ ] Foreign keys correctly defined
- [ ] Indexes created
- [ ] Unique constraint on (statement, line_number)
- [ ] Migration applied successfully
- [ ] Database table exists
- [ ] Can create StatementLine records
- [ ] Cascade delete works
- [ ] Indexes are performant

---

## Task 30: Create CSV Importer Service

### Overview
Create the CSV importer service that parses bank statement files and imports them into the BankStatement and StatementLine models. This service must handle various CSV formats from different Sri Lankan banks, support configurable column mapping, detect date formats, parse amounts correctly, and validate data integrity. The importer provides the core functionality for automated statement import.

### Dependencies
- Task 29: StatementLine migrations completed
- Task 22: BankStatement model exists
- Python CSV library available
- File storage configured

### Instructions

1. **Create importers directory structure**
   - Create `apps/accounting/services/importers/` directory
   - Create `__init__.py` in importers/
   - Create `base.py` for abstract base class
   - Create `csv_importer.py` for CSV implementation

2. **Define BaseImporter abstract class**
   - Create abstract base class in base.py
   - Define interface for all importers
   - Methods: parse_file(), validate_data(), import_statement()
   - Properties: supported_formats, required_columns

3. **Create CSVImporter class**
   - Inherit from BaseImporter
   - Initialize with configuration dictionary
   - Store tenant and bank_account references

4. **Add column mapping configuration**
   - Define DEFAULT_COLUMN_MAPPING dictionary
   - Map standard columns: date, description, debit, credit, reference, balance
   - Support column index or column name mapping
   - Allow custom mapping per bank

5. **Implement detect_delimiter() method**
   - Auto-detect CSV delimiter (comma, semicolon, tab)
   - Read first few lines
   - Return most likely delimiter

6. **Implement detect_date_format() method**
   - Analyze date column samples
   - Try common formats: DD/MM/YYYY, YYYY-MM-DD, DD-MMM-YY
   - Return detected format string

7. **Implement detect_skip_rows() method**
   - Identify header rows to skip
   - Detect where actual data begins
   - Return number of rows to skip

8. **Implement parse_amount() method**
   - Handle different number formats
   - Support comma vs period decimal separators
   - Handle thousand separators
   - Parse negative amounts
   - Return Decimal value

9. **Implement parse_date() method**
   - Parse date string using detected format
   - Handle various date formats
   - Return date object

10. **Implement parse_csv_file() method**
    - Read CSV file
    - Apply column mapping
    - Parse each row into structured data
    - Return list of dictionaries

11. **Implement validate_statement() method**
    - Check all required columns present
    - Validate date range
    - Verify opening/closing balances
    - Check for duplicate lines
    - Return validation results

12. **Implement import_statement() method**
    - Create BankStatement record
    - Create StatementLine records in bulk
    - Link lines to statement
    - Verify balances
    - Set import status
    - Handle errors gracefully

13. **Add error handling**
    - Wrap in try-except blocks
    - Log errors with details
    - Set statement import_status to FAILED on error
    - Rollback transaction on failure

14. **Create utility functions**
    - clean_description()
    - extract_reference()
    - normalize_amount()
    - validate_balance_progression()

### CSV Importer Architecture

```
CSV Import Flow
══════════════════════════════════════════════════════════

Step 1: File Upload
└── User uploads CSV file through UI

Step 2: File Validation
├── Check file format (CSV)
├── Check file size limits
└── Virus scan (if configured)

Step 3: Format Detection
├── Detect delimiter (comma, semicolon, tab)
├── Detect date format
├── Detect skip rows (headers)
└── Detect column structure

Step 4: Column Mapping
├── Apply bank-specific mapping (if configured)
├── Or use default mapping
├── Or prompt user for mapping
└── Validate required columns present

Step 5: Data Parsing
├── Read CSV rows
├── Parse dates
├── Parse amounts
├── Extract references
└── Build data structures

Step 6: Data Validation
├── Check date ranges
├── Validate amounts
├── Verify balance progression
├── Check for duplicates
└── Flag anomalies

Step 7: Database Import
├── Create BankStatement record
├── Bulk create StatementLine records
├── Link lines to statement
├── Set import metadata
└── Commit transaction

Step 8: Post-Import Processing
├── Verify balances
├── Calculate statistics
├── Mark as imported
└── Trigger reconciliation (if auto)
```

### Column Mapping Configuration

```
Default Column Mapping (Index-Based)
══════════════════════════════════════════════════════════
{
    'date_column': 0,          # First column
    'description_column': 1,   # Second column
    'debit_column': 2,         # Third column
    'credit_column': 3,        # Fourth column
    'balance_column': 4,       # Fifth column
    'reference_column': None,  # Not present
    'date_format': '%d/%m/%Y',
    'skip_rows': 1,            # Skip header row
    'delimiter': ',',
    'encoding': 'utf-8'
}


Name-Based Column Mapping
══════════════════════════════════════════════════════════
{
    'date_column': 'Date',
    'description_column': 'Description',
    'debit_column': 'Withdrawals',
    'credit_column': 'Deposits',
    'balance_column': 'Balance',
    'reference_column': 'Reference',
    'date_format': '%Y-%m-%d',
    'skip_rows': 1,
    'delimiter': ',',
    'encoding': 'utf-8'
}


Bank-Specific Configurations
══════════════════════════════════════════════════════════

Bank of Ceylon:
{
    'date_column': 0,
    'description_column': 1,
    'reference_column': 2,
    'debit_column': 3,
    'credit_column': 4,
    'balance_column': 5,
    'date_format': '%d/%m/%Y',
    'skip_rows': 3,  # Bank logo and header rows
    'delimiter': ',',
    'encoding': 'utf-8'
}

Commercial Bank:
{
    'date_column': 'Transaction Date',
    'description_column': 'Narration',
    'debit_column': 'Debit',
    'credit_column': 'Credit',
    'balance_column': 'Running Balance',
    'reference_column': 'Reference No',
    'date_format': '%Y-%m-%d',
    'skip_rows': 1,
    'delimiter': ',',
    'encoding': 'utf-8'
}

Sampath Bank:
{
    'date_column': 0,
    'description_column': 2,
    'amount_column': 3,  # Single column with +/-
    'balance_column': 4,
    'date_format': '%d-%b-%y',  # 15-Jan-25
    'skip_rows': 2,
    'delimiter': ',',
    'encoding': 'utf-8',
    'amount_combined': True  # Single amount column
}
```

### Sample CSV Formats

```
Format 1: Separate Debit/Credit Columns
══════════════════════════════════════════════════════════
Date,Description,Debit,Credit,Balance
01/01/2025,Opening Balance,,,50000.00
02/01/2025,Salary Credit,,150000.00,200000.00
03/01/2025,ATM Withdrawal,2000.00,,198000.00
05/01/2025,POS Purchase,3500.00,,194500.00


Format 2: Combined Amount Column with +/-
══════════════════════════════════════════════════════════
Date,Reference,Description,Amount,Balance
01/01/2025,,-,50000.00
02/01/2025,SAL-001,Salary Credit,+150000.00,200000.00
03/01/2025,ATM-456,ATM Withdrawal,-2000.00,198000.00
05/01/2025,POS-789,POS Purchase,-3500.00,194500.00


Format 3: Different Date Format
══════════════════════════════════════════════════════════
Date,Narration,Cheque No,Debit,Credit,Balance
2025-01-01,Opening Balance,,,,50000.00
2025-01-02,Salary Credit,,,150000.00,200000.00
2025-01-03,ATM Withdrawal,,2000.00,,198000.00


Format 4: With Header and Footer Rows
══════════════════════════════════════════════════════════
Bank of Ceylon - Statement
Account: 123456789
Period: 01/01/2025 to 31/01/2025

Date,Description,Ref,Debit,Credit,Balance
01/01/2025,Opening Balance,,,50000.00,50000.00
02/01/2025,Salary Credit,SAL,0.00,150000.00,200000.00
...

Generated on: 01/02/2025
[Skip above header (rows 1-4) and below footer]
```

### Amount Parsing Logic

```
Amount Parsing Scenarios
══════════════════════════════════════════════════════════

Scenario 1: Standard Format
Input: "1234.56"
Output: Decimal('1234.56')

Scenario 2: With Thousand Separator (Comma)
Input: "1,234.56"
Process: Remove commas
Output: Decimal('1234.56')

Scenario 3: European Format (Period Separator)
Input: "1.234,56"
Process: Replace . with empty, replace , with .
Output: Decimal('1234.56')

Scenario 4: Negative Amount (Parentheses)
Input: "(1234.56)"
Process: Remove parentheses, add negative sign
Output: Decimal('-1234.56')

Scenario 5: Negative Amount (Minus Sign)
Input: "-1234.56"
Output: Decimal('-1234.56')

Scenario 6: Amount with Currency Symbol
Input: "Rs. 1,234.56"
Process: Remove currency symbol and spaces
Output: Decimal('1234.56')

Scenario 7: Empty or Dash
Input: "" or "-" or "---"
Output: None (NULL)
```

### Date Format Detection

```
Common Sri Lankan Date Formats
══════════════════════════════════════════════════════════

Format 1: DD/MM/YYYY
Examples: 15/01/2025, 01/12/2025
Pattern: %d/%m/%Y

Format 2: DD-MM-YYYY
Examples: 15-01-2025, 01-12-2025
Pattern: %d-%m-%Y

Format 3: DD/MM/YY
Examples: 15/01/25, 01/12/25
Pattern: %d/%m/%y

Format 4: YYYY-MM-DD (ISO)
Examples: 2025-01-15, 2025-12-01
Pattern: %Y-%m-%d

Format 5: DD-MMM-YY
Examples: 15-Jan-25, 01-Dec-25
Pattern: %d-%b-%y

Format 6: DD-MMM-YYYY
Examples: 15-Jan-2025, 01-Dec-2025
Pattern: %d-%b-%Y


Auto-Detection Algorithm:
1. Sample first 5-10 date entries
2. Try parsing with each format
3. Count successful parses per format
4. Select format with most successes
5. Validate all dates can parse
```

### Error Handling Strategy

```
Import Error Scenarios and Handling
══════════════════════════════════════════════════════════

Error 1: Invalid CSV Format
├── Cause: Not a valid CSV file
├── Detection: CSV parsing exception
├── Action: Set status to FAILED
└── Message: "Invalid CSV format. Please upload a valid CSV file."

Error 2: Missing Required Columns
├── Cause: Column mapping incorrect
├── Detection: Required column not found
├── Action: Prompt for column mapping
└── Message: "Could not find [column]. Please configure mapping."

Error 3: Invalid Date Format
├── Cause: Date format not recognized
├── Detection: Date parsing fails
├── Action: Try alternate formats or prompt
└── Message: "Could not parse dates. Expected format: DD/MM/YYYY."

Error 4: Invalid Amount Format
├── Cause: Non-numeric data in amount column
├── Detection: Decimal conversion fails
├── Action: Log row, skip or prompt
└── Message: "Invalid amount on line X: [value]"

Error 5: Balance Discrepancy
├── Cause: Running balance doesn't match calculation
├── Detection: Balance verification fails
├── Action: Import but flag for review
└── Message: "Balance discrepancy detected. Review required."

Error 6: Duplicate Statement
├── Cause: Statement for same period already imported
├── Detection: Date range overlap check
├── Action: Warn user, offer to replace
└── Message: "Statement for this period exists. Replace?"

Error 7: Missing Opening Balance
├── Cause: First line doesn't have balance
├── Detection: balance_column is null on first line
├── Action: Prompt user for opening balance
└── Message: "Please provide opening balance."
```

### Import Performance Optimization

```
Bulk Import Strategy
══════════════════════════════════════════════════════════

Method 1: Individual Inserts (Slow)
for line_data in csv_data:
    StatementLine.objects.create(**line_data)

Performance: 1000 lines ≈ 30-60 seconds
Problem: N queries to database


Method 2: Bulk Create (Fast)
line_objects = [
    StatementLine(**line_data) 
    for line_data in csv_data
]
StatementLine.objects.bulk_create(line_objects)

Performance: 1000 lines ≈ 1-2 seconds
Benefit: Single query to database


Method 3: Bulk Create with Batching (Optimal)
line_objects = [...]
StatementLine.objects.bulk_create(
    line_objects, 
    batch_size=500
)

Performance: 10,000 lines ≈ 5-10 seconds
Benefit: Balanced memory usage and speed
```

### Validation Rules

```
Statement Import Validation
══════════════════════════════════════════════════════════

Rule 1: Date Range Validation
├── start_date <= all transaction_dates <= end_date
└── Reject: Dates outside statement period

Rule 2: Amount Validation
├── All amounts must be positive (if present)
├── At least one of debit or credit must be set
└── Reject: Both debit and credit set, or both null

Rule 3: Balance Progression
├── Each line balance = previous balance ± amount
├── Tolerance: ±0.01 for rounding
└── Warn: Balance discrepancies > tolerance

Rule 4: Closing Balance Match
├── Last line balance = statement closing balance
└── Reject: Significant discrepancy (>0.10)

Rule 5: Duplicate Detection
├── Check for duplicate lines within statement
├── Compare: date + amount + description
└── Warn: Potential duplicates found

Rule 6: Required Field Check
├── transaction_date: required
├── description: required
├── amount (debit or credit): required
└── Reject: Missing required fields
```

### Expected Outcome
- Flexible CSV import capability
- Support for multiple CSV formats
- Configurable column mapping
- Automatic format detection
- Robust error handling
- Bulk import performance
- Data validation and integrity checks
- Support for Sri Lankan bank formats

### Verification Checklist
- [ ] importers/ directory created
- [ ] BaseImporter abstract class defined
- [ ] CSVImporter class implemented
- [ ] Column mapping configuration supported
- [ ] detect_delimiter() method works
- [ ] detect_date_format() method works
- [ ] detect_skip_rows() method works
- [ ] parse_amount() handles various formats
- [ ] parse_date() handles various formats
- [ ] parse_csv_file() reads and maps columns
- [ ] validate_statement() checks integrity
- [ ] import_statement() creates records
- [ ] Bulk create used for performance
- [ ] Error handling comprehensive
- [ ] Balance verification implemented
- [ ] Tested with multiple bank formats
- [ ] Documentation for adding new banks
- [ ] Transaction rollback on errors

---

## Summary

This document implemented the StatementLine model and CSV importer service:

### Completed Infrastructure
- ✅ StatementLine model with comprehensive fields
- ✅ Transaction date with optional value/posting dates
- ✅ Description field with cleaning utilities
- ✅ Separate debit/credit amount fields
- ✅ Reference number tracking
- ✅ Running balance with verification
- ✅ StatementLine database migrations
- ✅ CSV importer service with format detection

### Key Achievements
1. **Detailed Transaction Storage** - Capture all transaction details
2. **Flexible Date Handling** - Support various date formats and types
3. **Standard Banking Format** - Separate debit/credit columns
4. **Reference Tracking** - Support multiple reference types
5. **Balance Integrity** - Running balance verification
6. **Configurable Import** - Handle various CSV formats
7. **Sri Lankan Bank Support** - Tested with local bank formats
8. **Performance Optimized** - Bulk import for large statements

### Sri Lankan Context Integration
- Support for local bank CSV formats
- Handle Sinhala/Tamil Unicode in descriptions
- Recognize Sri Lankan reference patterns (SLIPS, CEFTS)
- Account for local banking date conventions
- Support LKR currency formatting

### Next Steps
Proceed to **Group-C: Matching Engine** to implement automated transaction matching algorithms that compare imported statement lines against internal accounting records for reconciliation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~986
