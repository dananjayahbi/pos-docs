# Tasks 58-66: Employee Bank Account Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** D - Documents & Bank Details  
> **Document:** 02 of 02  
> **Tasks Covered:** 58, 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-57_Document-Model.md](01_Tasks-51-57_Document-Model.md)

---

## Document Overview

This document covers the implementation of employee bank account management for payroll processing. Employees need to provide bank details for salary payments, and these details must be securely stored, verified, and encrypted. The system supports multiple bank accounts per employee, verification workflows, and compliance with Sri Lankan banking standards.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 58 | Create EmployeeBankAccount Model | Medium | 25 min |
| 59 | Add Bank Core Fields | Medium | 20 min |
| 60 | Add Bank SWIFT/Branch Code | Medium | 20 min |
| 61 | Add Account Type Field | Low | 15 min |
| 62 | Add Primary Account Flag | Low | 15 min |
| 63 | Add Bank Account Verification | Medium | 20 min |
| 64 | Run EmployeeBankAccount Migrations | Low | 15 min |
| 65 | Create Sri Lanka Banks List | Medium | 25 min |
| 66 | Create Bank Account Encryption | High | 30 min |

---

## Task 58: Create EmployeeBankAccount Model

### Overview
Create the core EmployeeBankAccount model that stores employee bank account information for payroll processing. This model serves as the foundation for salary payments, maintaining relationships to employees and supporting multiple accounts per employee with security features.

### Dependencies
- Employee model exists
- User model exists (for verification tracking)
- Django ORM configured

### Instructions

1. **Create employee_bank.py model file**
   - Create file at `apps/employees/models/employee_bank.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TimestampMixin if available)
   - Import Employee model
   - Import User model (Django auth)

3. **Define EmployeeBankAccount model class**
   - Inherit from Django models.Model
   - Include TimestampMixin if using base mixins
   - Add model docstring explaining purpose

4. **Add employee field**
   - ForeignKey to Employee model
   - on_delete=CASCADE (delete accounts when employee deleted)
   - related_name='bank_accounts'
   - Required field (no blank/null)
   - Enables employee.bank_accounts.all() queries

5. **Add basic metadata fields**
   - Add notes field (TextField, optional)
   - For internal HR notes about account
   - Not visible to employee

6. **Add timestamps**
   - added_at field (DateTimeField, auto_now_add)
   - updated_at field (DateTimeField, auto_now)
   - Track account additions and changes

7. **Add Meta class**
   - Set verbose_name = 'Employee Bank Account'
   - Set verbose_name_plural = 'Employee Bank Accounts'
   - Add ordering: ['employee', '-is_primary'] (primary first)
   - Add indexes on: employee, is_primary (will add later)

8. **Add __str__ method**
   - Return meaningful string representation
   - Include employee name and bank name
   - Format: "Employee Name - Bank Name"

9. **Add unique constraint planning**
   - Note: Will add unique constraint in later task
   - One primary account per employee

10. **Update models/__init__.py**
    - Import EmployeeBankAccount
    - Add to __all__ list

### EmployeeBankAccount Model Structure

```
┌─────────────────────────────────────────────────┐
│      EmployeeBankAccount Model (Core)           │
├─────────────────────────────────────────────────┤
│ Relationship Fields:                            │
│  • employee (ForeignKey → Employee)             │
│                                                 │
│ Metadata:                                       │
│  • notes (TextField, optional)                  │
│                                                 │
│ Timestamps:                                     │
│  • added_at (DateTimeField, auto)               │
│  • updated_at (DateTimeField, auto)             │
│  • created_at (if using TimestampMixin)         │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────────┐
│   Employee   │◄─────────────────────│  EmployeeBankAccount   │
└──────────────┘                      └────────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌────────────────────────┐
                                      │         User           │
                                      │    (verified_by)       │
                                      └────────────────────────┘
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| employee | ForeignKey | Yes | - | Links to employee record |
| notes | TextField | No | null | Internal HR notes |
| added_at | DateTimeField | Yes | auto | Account addition timestamp |
| updated_at | DateTimeField | Yes | auto | Last update timestamp |

### Employee Relationship

```
Employee → Bank Accounts Relationship
══════════════════════════════════════

Employee: EMP-0001 (John Silva)
  ├── Bank Account 1: Bank of Ceylon (Primary)
  ├── Bank Account 2: Commercial Bank (Secondary)
  └── Bank Account 3: Sampath Bank (Savings)

Query Examples:
  employee.bank_accounts.all()           # All accounts
  employee.bank_accounts.filter(         # Primary account
      is_primary=True
  ).first()
  employee.bank_accounts.count()         # Total accounts
```

### Multiple Accounts Scenarios

```
Why Multiple Bank Accounts?
═══════════════════════════

Scenario 1: Account Change
├── Employee switching banks
├── Keep old account temporarily
├── Transition period (1-2 months)
└── Deactivate old after transition

Scenario 2: Split Salary
├── Primary account: 70% salary
├── Secondary account: 30% salary
├── Savings strategy
└── Multiple account payroll

Scenario 3: Department Accounts
├── Main salary account
├── Expense reimbursement account
├── Bonus payment account
└── Different purposes

Scenario 4: Bank Issues
├── Primary account temporarily blocked
├── Fallback to secondary account
├── Continue payroll without interruption
└── Switch back when resolved

Most Common: One Primary Account
├── 85% of employees: 1 account
├── 12% of employees: 2 accounts
├── 3% of employees: 3+ accounts
└── Average: 1.2 accounts per employee
```

### Bank Account Lifecycle

```
Account Lifecycle States
════════════════════════

1. Added (Initial State)
   ├── Employee provides bank details
   ├── HR enters into system
   └── Status: Unverified

2. Verification Pending
   ├── HR requests verification documents
   ├── Employee submits bank statement
   └── Status: Pending Verification

3. Verified
   ├── HR verifies account details
   ├── Matches bank statement
   └── Status: Verified, Ready for Payroll

4. Active (Primary)
   ├── Set as primary account
   ├── Used for salary payments
   └── Status: Active Primary

5. Active (Secondary)
   ├── Additional account
   ├── Used for special payments
   └── Status: Active Secondary

6. Inactive/Suspended
   ├── Account issues or change
   ├── Not used for payments
   └── Status: Inactive

7. Archived
   ├── Employee no longer uses account
   ├── Kept for records
   └── Status: Archived
```

### Account Metadata Tracking

```
Account Metadata Uses
═════════════════════

notes Field Examples:

"Primary account verified with bank passbook on 2026-01-15. 
Original document scanned and stored in employee documents."

"Secondary account added for expense reimbursements. 
Approved by Finance Manager on 2026-02-01."

"Account temporarily suspended due to bank maintenance. 
Using secondary account for February payroll."

"Account changed from BOC to Commercial Bank. 
Transition period: Feb-Mar 2026. Old account closes March 31."

Benefits:
├── Audit trail
├── Context for changes
├── Problem tracking
└── Compliance documentation
```

### Expected Outcome
- Functional EmployeeBankAccount model
- Employee-account relationships
- Support for multiple accounts
- Timestamp tracking
- Foundation for bank details

### Verification Checklist
- [ ] employee_bank.py file created
- [ ] EmployeeBankAccount class defined
- [ ] employee ForeignKey added
- [ ] notes field added
- [ ] added_at field added
- [ ] updated_at field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py
- [ ] Related name set correctly

---

## Task 59: Add Bank Core Fields

### Overview
Add the essential bank identification and account fields to the EmployeeBankAccount model. These fields store the bank name, branch details, and account number - the core information required for processing salary payments through Sri Lankan banking systems.

### Dependencies
- Task 58: Create EmployeeBankAccount model

### Instructions

1. **Open employee_bank.py model file**
   - Navigate to `apps/employees/models/employee_bank.py`
   - Locate EmployeeBankAccount model class

2. **Add bank_name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Store full bank name
   - Example: "Bank of Ceylon", "Commercial Bank of Ceylon PLC"

3. **Add bank_code field**
   - CharField with max_length=20
   - Optional (blank=True, null=True)
   - Bank's unique identifier code
   - Used in automated payment systems

4. **Add branch_name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Store branch name/location
   - Example: "Colombo Main Branch", "Kandy City Branch"

5. **Add branch_code field**
   - CharField with max_length=20
   - Optional (blank=True, null=True)
   - Branch's unique identifier code
   - Used in SLIPS payments

6. **Add account_number field**
   - CharField with max_length=50
   - Required field (no blank/null)
   - Store bank account number
   - Will be encrypted in Task 66
   - Note: CharField because account numbers may have leading zeros

7. **Add account_holder_name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Name as per bank records
   - Must match bank statement
   - May differ slightly from employee name

8. **Add helper method for formatting**
   - Method: get_masked_account_number()
   - Returns masked version: "XXXX-XXXX-1234"
   - For display purposes

9. **Add validation method**
   - Method: validate_account_number()
   - Check account number format
   - Sri Lankan account numbers typically 10-16 digits

10. **Update model docstring**
    - Document all core fields
    - Explain Sri Lankan banking context
    - Note encryption requirement

### Bank Core Fields Structure

```
┌────────────────────────────────────────────────┐
│           Bank Core Fields                     │
├────────────────────────────────────────────────┤
│ Bank Identification:                           │
│  • bank_name (CharField, 200)                  │
│  • bank_code (CharField, 20, optional)         │
│                                                │
│ Branch Information:                            │
│  • branch_name (CharField, 200)                │
│  • branch_code (CharField, 20, optional)       │
│                                                │
│ Account Details:                               │
│  • account_number (CharField, 50)              │
│  • account_holder_name (CharField, 200)        │
└────────────────────────────────────────────────┘
```

### Sri Lankan Bank Account Structure

```
Typical Account Number Formats
═══════════════════════════════

Bank of Ceylon (BOC):
├── Format: 12 digits
├── Example: 001234567890
├── Branch: First 3 digits
└── Account: Remaining 9 digits

People's Bank:
├── Format: 12 digits
├── Example: 012345678901
├── Branch code embedded
└── Similar to BOC

Commercial Bank:
├── Format: 10-12 digits
├── Example: 1234567890
└── May include branch prefix

Hatton National Bank (HNB):
├── Format: 12 digits
├── Example: 123456789012
└── Branch code separate

Sampath Bank:
├── Format: 11-12 digits
├── Example: 12345678901
└── Account type prefix

General Pattern:
├── Length: 10-16 digits
├── May have dashes/spaces (format only)
├── No letters (digits only)
└── Branch code may be separate or embedded
```

### Bank and Branch Information

```
Complete Bank Details Required
═══════════════════════════════

Example 1: Bank of Ceylon
├── bank_name: "Bank of Ceylon"
├── bank_code: "BOC" or "7010"
├── branch_name: "Colombo Main Branch"
├── branch_code: "001"
├── account_number: "001234567890"
└── account_holder_name: "Silva, John Prasanna"

Example 2: Commercial Bank
├── bank_name: "Commercial Bank of Ceylon PLC"
├── bank_code: "COM" or "7056"
├── branch_name: "Kandy City Branch"
├── branch_code: "142"
├── account_number: "1234567890"
└── account_holder_name: "John Silva"

Example 3: Sampath Bank
├── bank_name: "Sampath Bank PLC"
├── bank_code: "SAMPATH" or "7278"
├── branch_name: "Nugegoda Branch"
├── branch_code: "078"
├── account_number: "12345678901"
└── account_holder_name: "J.P. Silva"
```

### Account Holder Name Considerations

```
Name Matching Rules
═══════════════════

Employee Name in System: "John Prasanna Silva"

Acceptable Bank Names:
├── "John Prasanna Silva" ✓ (exact match)
├── "Silva, John Prasanna" ✓ (surname first)
├── "J.P. Silva" ✓ (initials)
├── "John P. Silva" ✓ (middle initial)
├── "John Silva" ✓ (simplified)
└── "Silva J.P." ✓ (Sri Lankan format)

Problematic Mismatches:
├── "Jon Silva" ✗ (spelling error)
├── "John Fernando" ✗ (wrong surname)
├── "J. Silva" ✗ (too abbreviated, might fail payment)
└── "Silva" ✗ (surname only, incomplete)

Verification Process:
1. Compare bank name to employee name
2. Check for common variations (initials, order)
3. Flag significant mismatches for review
4. Require bank statement/passbook for verification
5. Manual HR approval for unusual cases
```

### Sri Lankan Name Conventions

```
Common Name Formats in Banking
═══════════════════════════════

Format 1: Full Name
├── "Kasun Maduranga Perera"
└── All names spelled out

Format 2: Surname First
├── "Perera, Kasun Maduranga"
├── "Silva, John Prasanna"
└── Traditional format

Format 3: Initials + Surname
├── "K.M. Perera"
├── "J.P. Silva"
└── Common in professional contexts

Format 4: First Name + Surname
├── "Kasun Perera"
├── "John Silva"
└── Simplified format

Special Characters:
├── Hyphens in names: "Fernando-Silva"
├── Apostrophes: "D'Silva"
├── Name titles: "Dr. John Silva"
└── System should support these
```

### Account Number Validation

```
Account Number Validation Rules
════════════════════════════════

Valid Account Numbers:
├── "1234567890" ✓ (10 digits)
├── "123456789012" ✓ (12 digits)
├── "12345678901234" ✓ (14 digits)
└── "0012345678" ✓ (leading zeros preserved)

Invalid Account Numbers:
├── "12345" ✗ (too short)
├── "12345ABC890" ✗ (contains letters)
├── "1234-5678-90" ✗ (contains dashes - remove before saving)
├── "1234 5678 90" ✗ (contains spaces - remove before saving)
└── "" ✗ (empty)

Validation Steps:
1. Remove all spaces and dashes
2. Check if all characters are digits
3. Check length (10-16 digits)
4. Preserve leading zeros
5. Reject if validation fails
```

### Account Number Formatting

```
Display vs. Storage Format
══════════════════════════

Storage Format (Database):
├── Remove all formatting
├── Digits only
├── Example: "001234567890"
└── Will be encrypted

Display Format (Masked):
├── Show last 4 digits only
├── Mask rest with X
├── Example: "XXXX-XXXX-7890"
└── Security protection

Full Display (Authorized Only):
├── Format with dashes for readability
├── Example: "0012-3456-7890"
├── Only for HR/authorized users
└── Payroll processing views
```

### Masked Account Number Method

```
Method: get_masked_account_number()
════════════════════════════════════

Purpose: Display account number securely

Logic:
1. Get account number length
2. If length <= 4: Return fully masked "XXXX"
3. Else: Show last 4 digits
4. Mask remaining with X
5. Format with dashes for readability

Examples:
├── "001234567890" → "XXXX-XXXX-7890"
├── "1234567890" → "XXXX-XX-7890"
├── "12345678" → "XXXX-5678"
└── "123" → "XXXX" (too short, fully mask)

Usage:
├── Employee self-service portal
├── Manager views
├── General HR screens
└── Anywhere full number shouldn't be visible
```

### Bank Code Systems

```
Sri Lankan Bank Codes
══════════════════════

SLIPS (Sri Lanka Interbank Payment System):
├── 4-digit bank codes
├── Assigned by Central Bank
├── Used for interbank transfers
└── Example: 7010 = Bank of Ceylon

Common Bank Codes:
├── 7010: Bank of Ceylon
├── 7135: People's Bank
├── 7056: Commercial Bank
├── 7083: Hatton National Bank
├── 7278: Sampath Bank
├── 7287: Seylan Bank
├── 7214: National Development Bank
├── 7719: National Savings Bank
├── 7454: DFCC Bank
└── 7386: Pan Asia Bank

Purpose:
├── Electronic fund transfers
├── SLIPS payment processing
├── Automated payroll systems
└── Bank reconciliation
```

### Branch Code Importance

```
Branch Codes in Sri Lanka
═════════════════════════

Structure:
├── 3-4 digit codes
├── Unique per branch
├── Assigned by bank
└── Required for SLIPS

Example: Bank of Ceylon Branches
├── 001: Colombo Main Branch
├── 142: Kandy Branch
├── 078: Nugegoda Branch
├── 095: Gampaha Branch
└── 210: Matara Branch

Usage:
├── SLIPS transfers
├── Cheque clearing
├── Salary payments
├── Direct deposits
└── Bank reconciliation

Without Correct Branch Code:
├── Payment delays
├── Payment rejections
├── Manual intervention required
└── Increased processing costs
```

### Expected Outcome
- Complete bank and branch information
- Account number storage (ready for encryption)
- Account holder name tracking
- Sri Lankan banking compliance
- Validation and formatting methods

### Verification Checklist
- [ ] bank_name field added
- [ ] bank_code field added
- [ ] branch_name field added
- [ ] branch_code field added
- [ ] account_number field added
- [ ] account_holder_name field added
- [ ] get_masked_account_number method implemented
- [ ] validate_account_number method implemented
- [ ] Sri Lankan formats supported
- [ ] Leading zeros preserved
- [ ] Model docstring updated

---

## Task 60: Add Bank SWIFT/Branch Code

### Overview
Add international banking fields to the EmployeeBankAccount model. While most Sri Lankan payroll is domestic, some organizations need to support international transfers for expatriate employees or foreign payments. SWIFT codes and additional routing information enable international payments.

### Dependencies
- Task 59: Add bank core fields

### Instructions

1. **Open employee_bank.py model file**
   - Continue in `apps/employees/models/employee_bank.py`
   - Locate EmployeeBankAccount model class

2. **Add swift_code field**
   - CharField with max_length=11
   - Optional (blank=True, null=True)
   - SWIFT/BIC code for international transfers
   - Format: 8 or 11 characters (AAAA BB CC DDD)

3. **Add iban field**
   - CharField with max_length=34
   - Optional (blank=True, null=True)
   - International Bank Account Number
   - Rarely used in Sri Lanka, but included for completeness

4. **Add routing_number field**
   - CharField with max_length=20
   - Optional (blank=True, null=True)
   - Additional routing information
   - Used in some international systems

5. **Add is_international field**
   - BooleanField, default=False
   - Indicates if account is for international payments
   - Affects validation and processing

6. **Add currency field**
   - CharField with max_length=3
   - Default='LKR'
   - ISO 4217 currency code
   - Supports foreign currency accounts

7. **Add helper method for SWIFT validation**
   - Method: validate_swift_code()
   - Check SWIFT code format
   - Format: AAAA-BB-CC-DDD (8 or 11 chars)

8. **Add helper method for international checks**
   - Method: requires_swift()
   - Returns True if SWIFT code needed
   - Based on is_international flag

9. **Update model docstring**
   - Document international fields
   - Explain SWIFT code usage
   - Note when these fields are required

### International Banking Fields Structure

```
┌────────────────────────────────────────────────┐
│       International Banking Fields             │
├────────────────────────────────────────────────┤
│ International Codes:                           │
│  • swift_code (CharField, 11, optional)        │
│  • iban (CharField, 34, optional)              │
│  • routing_number (CharField, 20, optional)    │
│                                                │
│ International Flags:                           │
│  • is_international (BooleanField)             │
│  • currency (CharField, 3)                     │
└────────────────────────────────────────────────┘
```

### SWIFT Code Structure

```
SWIFT/BIC Code Format
═════════════════════

Format: AAAA BB CC DDD

Components:
├── AAAA: Bank Code (4 letters)
│   └── Example: BOCE (Bank of Ceylon)
│
├── BB: Country Code (2 letters, ISO 3166)
│   └── Example: LK (Sri Lanka)
│
├── CC: Location Code (2 characters)
│   └── Example: CM (Colombo)
│
└── DDD: Branch Code (3 characters, optional)
    ├── If omitted, use 8-character code
    └── Example: XXX or specific branch code

8-Character SWIFT (Primary Office):
└── BOCECLCM (Bank of Ceylon, Colombo)

11-Character SWIFT (Specific Branch):
└── BOCECLCMXXX (Bank of Ceylon, Colombo, Main Branch)
```

### Sri Lankan Bank SWIFT Codes

```
Major Banks SWIFT Codes
═══════════════════════

Bank of Ceylon:
├── SWIFT: BCEYLKLX
├── Full: BCEYLKLXXXX
└── Location: Colombo

People's Bank:
├── SWIFT: PSBKLKLX
├── Full: PSBKLKLXXXX
└── Location: Colombo

Commercial Bank of Ceylon:
├── SWIFT: CCEYLKLX
├── Full: CCEYLKLXXXX
└── Location: Colombo

Hatton National Bank:
├── SWIFT: HBLILKLX
├── Full: HBLILKLXXXX
└── Location: Colombo

Sampath Bank:
├── SWIFT: BSAMLKLX
├── Full: BSAMLKLXXXX
└── Location: Colombo

Seylan Bank:
├── SWIFT: SEYLLKLX
├── Full: SEYLLKLXXXX
└── Location: Colombo

National Development Bank:
├── SWIFT: NDBSLKLX
├── Full: NDBSLKLXXXX
└── Location: Colombo

DFCC Bank:
├── SWIFT: DFCCLKLX
├── Full: DFCCLKLXXXX
└── Location: Colombo
```

### SWIFT Code Validation

```
SWIFT Validation Rules
══════════════════════

Valid SWIFT Codes:
├── "BCEYLKLX" ✓ (8 characters)
├── "BCEYLKLXXXX" ✓ (11 characters)
├── "PSBKLKLX" ✓ (8 characters)
└── "CCEYLKLXCMB" ✓ (11 characters, Colombo branch)

Invalid SWIFT Codes:
├── "BOCECMB" ✗ (7 characters, too short)
├── "BOCECLCMXXX1" ✗ (12 characters, too long)
├── "bocelklx" ✗ (lowercase, must be uppercase)
├── "BOCE1KLX" ✗ (contains digit in bank code)
└── "BOCEKLXXX" ✗ (9 characters, invalid length)

Validation Steps:
1. Check length (8 or 11 characters)
2. Convert to uppercase
3. Validate format pattern
4. Check country code (position 5-6)
5. Verify bank code format (4 letters)
```

### IBAN Structure (Rare in Sri Lanka)

```
IBAN Format
═══════════

Sri Lanka does not commonly use IBAN
Most banks use account number + bank code + branch code

However, if supporting international accounts:

Format: LLCCBBBBSSSSSSAAAAAAAAAAAAAA
├── LL: Country Code (2 letters)
├── CC: Check Digits (2 digits)
├── BBBB: Bank Code (4 characters)
├── SSSS: Sort Code (4 characters)
└── AAAA...: Account Number (up to 22 characters)

Example (hypothetical Sri Lankan IBAN):
LK12BOCE0001001234567890
├── LK: Sri Lanka
├── 12: Check digits
├── BOCE: Bank of Ceylon
├── 0001: Branch code
└── 001234567890: Account number

Note: Field included for future-proofing and expatriates
```

### International vs Domestic Accounts

```
Account Type Determination
══════════════════════════

Domestic Account (Most Common):
├── is_international: False
├── currency: LKR
├── swift_code: Optional (for receiving international payments)
├── iban: Not used
├── routing_number: Not used
└── Processing: SLIPS, local bank transfers

International Account:
├── is_international: True
├── currency: USD, EUR, GBP, etc.
├── swift_code: Required
├── iban: May be required
├── routing_number: May be required
└── Processing: SWIFT network, correspondent banks

Hybrid (Receiving International):
├── is_international: False (domestic account)
├── currency: LKR
├── swift_code: Provided (for incoming SWIFT)
├── Process: Convert foreign currency to LKR
└── Use: Expatriates receiving from abroad
```

### Currency Support

```
ISO 4217 Currency Codes
═══════════════════════

Sri Lankan Rupee:
├── Code: LKR
├── Symbol: Rs. or රු
└── Default for Sri Lankan payroll

Common Foreign Currencies:
├── USD: United States Dollar
├── EUR: Euro
├── GBP: British Pound
├── AUD: Australian Dollar
├── CAD: Canadian Dollar
├── SGD: Singapore Dollar
├── AED: UAE Dirham
└── SAR: Saudi Riyal

Usage Scenarios:
├── Expatriate employees paid in foreign currency
├── Overseas assignments
├── Foreign subsidiary payroll
└── Consultant payments
```

### International Payment Scenarios

#### Scenario 1: Domestic Employee (Standard)
```
Employee: Local Sri Lankan employee
Account Type: Domestic

Bank Details:
├── bank_name: "Bank of Ceylon"
├── branch_name: "Colombo Main Branch"
├── account_number: "001234567890" (encrypted)
├── swift_code: "BCEYLKLXXXX" (optional, for receiving)
├── is_international: False
├── currency: "LKR"

Payment Method: SLIPS transfer
Processing: Domestic banking system
```

#### Scenario 2: Expatriate Employee
```
Employee: Foreign national working in Sri Lanka
Account Type: Foreign currency account in Sri Lanka

Bank Details:
├── bank_name: "Commercial Bank of Ceylon"
├── branch_name: "Colombo Fort Branch"
├── account_number: "9876543210"
├── swift_code: "CCEYLKLXXXX"
├── is_international: True
├── currency: "USD"

Payment Method: Foreign currency transfer
Processing: SWIFT network, converted at bank
```

#### Scenario 3: Overseas Transfer
```
Employee: Remote worker living abroad
Account Type: Foreign bank account

Bank Details:
├── bank_name: "Overseas Bank Name"
├── branch_name: "Foreign Branch"
├── account_number: "Foreign Account Number"
├── swift_code: "AAAABBCCDDD" (required)
├── iban: "LLCCBBBBSSSSAAAAAAA" (if applicable)
├── is_international: True
├── currency: "USD" or local currency

Payment Method: International SWIFT transfer
Processing: Correspondent banking
Additional Costs: SWIFT fees, currency conversion
```

### SWIFT Payment Processing

```
SWIFT Transfer Workflow
═══════════════════════

Step 1: Payroll Calculation
├── Calculate salary in LKR
├── Convert to foreign currency if needed
└── Apply exchange rate

Step 2: SWIFT Message Creation
├── MT103 format (single customer credit transfer)
├── Include SWIFT codes
├── Account details
└── Payment reference

Step 3: Bank Processing
├── Debit from company account
├── Send SWIFT message
├── Correspondent bank handling
└── Credit to recipient account

Step 4: Confirmation
├── SWIFT confirmation received
├── Payment tracking number
├── Estimated arrival (1-5 days)
└── Reconciliation

Costs:
├── SWIFT transfer fee: $15-$50
├── Correspondent bank fee: $10-$30
├── Currency conversion spread
└── Total: Can be significant
```

### Validation Methods

#### validate_swift_code Method
```
Purpose: Validate SWIFT/BIC code format

Validation Rules:
1. Length must be 8 or 11 characters
2. First 4 characters: Bank code (letters only)
3. Characters 5-6: Country code (letters only)
4. Characters 7-8: Location code (letters or digits)
5. Characters 9-11: Branch code (letters or digits, optional)

Returns: True if valid, False otherwise

Raises: ValidationError if invalid format
```

#### requires_swift Method
```
Purpose: Determine if SWIFT code is required

Logic:
├── If is_international == True: SWIFT required
├── If currency != 'LKR': SWIFT required
├── Else: SWIFT optional
└── Return: Boolean

Usage:
├── Form validation
├── Payment processing
└── Account setup
```

### Expected Outcome
- SWIFT code support for international payments
- IBAN field for future use
- Currency flexibility
- International payment capability
- Validation for international fields

### Verification Checklist
- [ ] swift_code field added
- [ ] iban field added
- [ ] routing_number field added
- [ ] is_international field added
- [ ] currency field with default='LKR'
- [ ] validate_swift_code method implemented
- [ ] requires_swift method implemented
- [ ] SWIFT format validation working
- [ ] International flag logic correct
- [ ] Model docstring updated

---

## Task 61: Add Account Type Field

### Overview
Add account type classification to the EmployeeBankAccount model. Sri Lankan banks offer different types of accounts (savings, current/checking), and knowing the account type helps with payment processing, bank reconciliation, and understanding account capabilities.

### Dependencies
- Task 60: Add SWIFT/branch code fields

### Instructions

1. **Open employee_bank.py model file**
   - Continue in `apps/employees/models/employee_bank.py`
   - Locate EmployeeBankAccount model class

2. **Define account type constants**
   - Create ACCOUNT_TYPE_CHOICES tuple
   - Include SAVINGS and CURRENT types
   - May add others if needed

3. **Define ACCOUNT_TYPE_SAVINGS constant**
   - Value: 'SAVINGS'
   - Display: 'Savings Account'
   - Most common for employees

4. **Define ACCOUNT_TYPE_CURRENT constant**
   - Value: 'CURRENT'
   - Display: 'Current Account'
   - Used by some employees

5. **Add account_type field**
   - CharField with choices=ACCOUNT_TYPE_CHOICES
   - Max length 20
   - Default='SAVINGS'
   - Most employees have savings accounts

6. **Add helper method**
   - Method: is_savings_account()
   - Returns True if account type is SAVINGS

7. **Add helper method**
   - Method: is_current_account()
   - Returns True if account type is CURRENT

8. **Update model docstring**
   - Document account types
   - Explain differences
   - Note Sri Lankan context

### Account Type Structure

```
┌────────────────────────────────────────────────┐
│          Account Type Classification           │
├────────────────────────────────────────────────┤
│ Account Type:                                  │
│  • account_type (CharField with choices)       │
│    - SAVINGS: Savings Account                  │
│    - CURRENT: Current Account                  │
└────────────────────────────────────────────────┘
```

### Sri Lankan Account Types

```
Savings Account (SAVINGS)
═════════════════════════

Characteristics:
├── Personal account for individuals
├── Earns interest (typically 4-6% p.a.)
├── Minimum balance requirements (Rs. 500-1,000)
├── Transaction limits may apply
└── Most common for salary deposits

Features:
├── ATM card provided
├── Online banking
├── Mobile banking
├── Free deposits
└── Limited free withdrawals per month

Sri Lankan Context:
├── Mahajana Sampatha (People's Wealth) accounts
├── EPF credited to savings accounts
├── Tax-free interest up to threshold
└── Preferred by most employees

Usage:
├── Monthly salary deposits ✓
├── EPF/ETF deposits ✓
├── Personal savings ✓
├── Business transactions ✗
└── High-volume transactions ✗
```

```
Current Account (CURRENT)
═════════════════════════

Characteristics:
├── Checking account, often for business
├── No interest earned (or very low)
├── Higher minimum balance (Rs. 10,000-50,000)
├── Unlimited transactions
└── Overdraft facilities available

Features:
├── Checkbook provided
├── Business banking features
├── Higher transaction limits
├── Better for cash flow
└── May have account fees

Sri Lankan Context:
├── Used by business owners
├── Sole proprietors
├── Consultants/freelancers
└── Side business income

Usage:
├── Monthly salary deposits ✓
├── Business transactions ✓
├── High-volume transactions ✓
├── Overdraft facility ✓
└── Checkbook usage ✓
```

### Account Type Distribution

```
Employee Account Type Statistics
═════════════════════════════════

Typical Organization:
├── Savings Accounts: 85-90%
├── Current Accounts: 10-15%
└── Other: <1%

By Employee Level:
├── Entry Level: 95% Savings
├── Mid Level: 85% Savings, 15% Current
├── Senior Level: 75% Savings, 25% Current
└── Executives: 60% Savings, 40% Current

Reasons for Current Accounts:
├── Side business/consultancy
├── Prefer business features
├── Need overdraft facility
├── High transaction volume
└── Business ownership
```

### Account Type Selection Guide

| Scenario | Recommended Type | Reason |
|----------|-----------------|--------|
| Regular employee | SAVINGS | Most suitable, earns interest |
| Business owner | CURRENT | Business transactions, overdraft |
| Consultant | CURRENT | Professional services, checkbook |
| Part-time employee | SAVINGS | Simple, low fees |
| Senior executive | Either | Personal preference |

### Account Type Implications

```
Payment Processing Differences
═══════════════════════════════

Savings Account:
├── Payment Processing: Standard
├── Clearing Time: 1-2 business days
├── Transaction Limits: May apply
├── Rejection Risk: Low
└── Additional Fees: Rare

Current Account:
├── Payment Processing: Priority
├── Clearing Time: Same or next day
├── Transaction Limits: High/None
├── Rejection Risk: Very low
├── Additional Fees: May apply for services

SLIPS Transfer:
├── Both account types supported
├── No difference in processing
├── Standard 2-hour processing window
└── Same fees apply
```

### Account Type Validation

```
Account Type Business Rules
════════════════════════════

Validation Rules:
1. Account type must be one of: SAVINGS, CURRENT
2. Cannot be null or empty
3. Must match bank records during verification

Verification Process:
├── Check bank statement/passbook
├── Account type should be visible
├── Confirm with employee if unclear
└── Update if type changes

Type Changes:
├── Employee can convert account at bank
├── Update account_type in system
├── Note change in verification notes
└── No impact on salary processing
```

### Helper Methods Usage

#### is_savings_account Method
```
Purpose: Check if account is a savings account

Returns: Boolean
├── True if account_type == 'SAVINGS'
└── False otherwise

Usage Example:
if bank_account.is_savings_account():
    # Apply savings account logic
    interest_note = "Interest earned quarterly"
```

#### is_current_account Method
```
Purpose: Check if account is a current account

Returns: Boolean
├── True if account_type == 'CURRENT'
└── False otherwise

Usage Example:
if bank_account.is_current_account():
    # Apply current account logic
    overdraft_available = True
```

### Account Type in Payroll

```
Payroll Processing Considerations
══════════════════════════════════

No Processing Difference:
├── Both types receive salary deposits
├── Same SLIPS processing
├── Same timing and fees
└── No special handling needed

Reporting Differences:
├── May report by account type
├── Statistics for bank relationships
├── Negotiating better rates
└── Understanding employee preferences

Bank Relationship Management:
├── Current account holders: Better banking services
├── Savings account holders: Interest income
├── May negotiate bulk rates with banks
└── Consider employee banking needs
```

### Expected Outcome
- Account type classification
- Savings vs Current distinction
- Helper methods for type checking
- Sri Lankan banking context support
- Foundation for account management

### Verification Checklist
- [ ] ACCOUNT_TYPE_CHOICES defined
- [ ] ACCOUNT_TYPE_SAVINGS constant created
- [ ] ACCOUNT_TYPE_CURRENT constant created
- [ ] account_type field added
- [ ] Default set to SAVINGS
- [ ] is_savings_account method implemented
- [ ] is_current_account method implemented
- [ ] Constants imported in model
- [ ] Model docstring updated

---

## Task 62: Add Primary Account Flag

### Overview
Add the primary account flag to the EmployeeBankAccount model. When employees have multiple bank accounts, one must be designated as the primary account for salary payments. This flag ensures only one primary account per employee and provides clear identification for payroll processing.

### Dependencies
- Task 61: Add account type field

### Instructions

1. **Open employee_bank.py model file**
   - Continue in `apps/employees/models/employee_bank.py`
   - Locate EmployeeBankAccount model class

2. **Add is_primary field**
   - BooleanField, default=False
   - Indicates if this is the employee's primary account
   - Used for salary payments
   - Only one primary account per employee

3. **Add unique constraint**
   - Add unique_together in Meta class
   - Constraint: One primary account per employee
   - Implementation: unique_together = [['employee', 'is_primary']]
   - Note: This allows multiple non-primary accounts

4. **Override save method**
   - Ensure only one primary account per employee
   - If setting is_primary=True, unset other accounts
   - Automatic management of primary flag

5. **Add helper method: set_as_primary**
   - Method: set_as_primary()
   - Sets this account as primary
   - Unsets other accounts automatically
   - Saves all changes

6. **Add helper method: get_primary_account**
   - Class method or manager method
   - Returns primary account for employee
   - Returns None if no primary set
   - Used in payroll processing

7. **Add validation in clean method**
   - Ensure employee has at least one primary account
   - Prevent removal of last primary account
   - Validation before deletion

8. **Update indexes**
   - Add index on (employee, is_primary)
   - Improve query performance
   - Fast lookup of primary accounts

9. **Update model docstring**
   - Document primary account logic
   - Explain uniqueness constraint
   - Note payroll implications

### Primary Account Structure

```
┌────────────────────────────────────────────────┐
│          Primary Account Management            │
├────────────────────────────────────────────────┤
│ Primary Flag:                                  │
│  • is_primary (BooleanField, default False)    │
│                                                │
│ Constraints:                                   │
│  • One primary account per employee            │
│  • Unique together: (employee, is_primary)     │
│                                                │
│ Methods:                                       │
│  • set_as_primary()                            │
│  • get_primary_account(employee)               │
└────────────────────────────────────────────────┘
```

### Primary Account Logic

```
Primary Account Rules
═════════════════════

Rule 1: One Primary Per Employee
├── Each employee must have exactly one primary account
├── Primary account receives salary payments
├── Cannot delete primary without setting another
└── System enforces uniqueness

Rule 2: Automatic Management
├── Setting account as primary unsets others
├── No manual intervention needed
├── Transactional update (all or nothing)
└── No risk of multiple primaries

Rule 3: Default Behavior
├── First account added: Automatically primary
├── Additional accounts: Non-primary by default
├── User can change primary at any time
└── Payroll uses current primary
```

### Single vs Multiple Accounts

#### Single Account (85% of cases)
```
Employee: John Silva (EMP-0001)
  └── Bank Account 1
      ├── Bank: Bank of Ceylon
      ├── is_primary: True
      └── Used for: All salary payments

Simple Case:
├── One account only
├── Automatically primary
├── No complexity
└── Standard scenario
```

#### Multiple Accounts (15% of cases)
```
Employee: Jane Fernando (EMP-0002)
  ├── Bank Account 1
  │   ├── Bank: Commercial Bank
  │   ├── is_primary: True ← Primary for salary
  │   └── Used for: Monthly salary
  │
  ├── Bank Account 2
  │   ├── Bank: Sampath Bank
  │   ├── is_primary: False
  │   └── Used for: Bonuses, special payments
  │
  └── Bank Account 3
      ├── Bank: BOC
      ├── is_primary: False
      └── Used for: Savings transfers

Complex Case:
├── Multiple accounts
├── One designated primary
├── Others for specific purposes
└── Flexibility in payment distribution
```

### Primary Account Scenarios

#### Scenario 1: First Account Added
```
Action: Employee adds first bank account

Before:
└── No bank accounts

Add Account:
├── Bank: Bank of Ceylon
├── Account: 001234567890
└── is_primary: True (automatic)

After:
└── One account, automatically primary

System Behavior:
├── Detect first account for employee
├── Automatically set is_primary = True
├── No user action needed
└── Ready for payroll
```

#### Scenario 2: Adding Second Account
```
Action: Employee adds additional account

Before:
└── Account 1 (Primary)
    ├── Bank: BOC
    └── is_primary: True

Add Account:
├── Bank: Commercial Bank
└── is_primary: False (default)

After:
├── Account 1 (Primary)
│   └── is_primary: True
└── Account 2 (Secondary)
    └── is_primary: False

System Behavior:
├── New account defaults to non-primary
├── Existing primary unchanged
├── Employee can change if desired
└── Payroll continues using Account 1
```

#### Scenario 3: Changing Primary Account
```
Action: Employee switches primary account

Before:
├── Account 1 (Primary)
│   ├── Bank: BOC
│   └── is_primary: True
└── Account 2
    ├── Bank: Commercial Bank
    └── is_primary: False

Change Primary to Account 2:
├── Account 2.set_as_primary()

After:
├── Account 1
│   ├── Bank: BOC
│   └── is_primary: False ← Automatically unset
└── Account 2 (New Primary)
    ├── Bank: Commercial Bank
    └── is_primary: True ← Now primary

System Behavior:
├── Unset Account 1 primary flag
├── Set Account 2 primary flag
├── Both updates in same transaction
├── Payroll now uses Account 2
```

#### Scenario 4: Deleting Non-Primary Account
```
Action: Delete secondary account

Before:
├── Account 1 (Primary)
│   └── is_primary: True
└── Account 2
    └── is_primary: False

Delete Account 2:
└── Deletion allowed ✓

After:
└── Account 1 (Primary)
    └── is_primary: True

System Behavior:
├── Non-primary account deleted
├── Primary account unaffected
├── No validation issues
└── Payroll continues normally
```

#### Scenario 5: Attempting to Delete Primary Account
```
Action: Try to delete only primary account

Before:
└── Account 1 (Primary, only account)
    └── is_primary: True

Delete Attempt:
└── Deletion blocked ✗

Error:
"Cannot delete primary account. Please set another 
account as primary before deleting this account."

System Behavior:
├── Validate before deletion
├── Prevent deletion of sole primary
├── Require user to add/set another primary
└── Maintain payroll integrity

Correct Process:
1. Add new account (becomes secondary)
2. Set new account as primary
3. Delete old account (now non-primary)
```

### Save Method Override

```
Primary Account Save Logic
═══════════════════════════

When saving bank account:

Step 1: Check if setting as primary
├── If is_primary == False: Save normally
└── If is_primary == True: Continue to Step 2

Step 2: Unset other primary accounts
├── Query: employee.bank_accounts.filter(is_primary=True)
├── Exclude: Current account (self)
├── Update: Set is_primary = False for all
└── Transaction: Ensure atomicity

Step 3: Save current account
├── Save with is_primary = True
└── Commit transaction

Result:
├── Only one primary account
├── All others automatically non-primary
└── No orphaned primaries
```

### set_as_primary Method

```
Method: set_as_primary()
════════════════════════

Purpose: Set this account as primary for employee

Steps:
1. Start database transaction
2. Get all other accounts for same employee
3. Update all to is_primary = False
4. Set self.is_primary = True
5. Save all changes
6. Commit transaction

Usage:
account = employee.bank_accounts.get(id=2)
account.set_as_primary()

Result:
├── Account 2 is now primary
├── Previous primary now non-primary
├── Atomic operation
└── No data inconsistency
```

### get_primary_account Method

```
Method: get_primary_account(employee)
═════════════════════════════════════

Purpose: Retrieve primary account for employee

Implementation as Manager Method:
class BankAccountManager(models.Manager):
    def get_primary_account(self, employee):
        try:
            return self.get(employee=employee, is_primary=True)
        except self.model.DoesNotExist:
            return None

Usage in Payroll:
primary_account = EmployeeBankAccount.objects.get_primary_account(employee)
if primary_account:
    process_salary_payment(primary_account)
else:
    raise PayrollError("No primary account set")

Returns:
├── EmployeeBankAccount instance if found
└── None if no primary account
```

### Payroll Integration

```
Payroll Processing with Primary Account
════════════════════════════════════════

Step 1: Calculate Salary
├── Gross salary
├── Deductions
└── Net salary

Step 2: Get Primary Account
├── Query: employee.bank_accounts.filter(is_primary=True)
├── Validate: Ensure exactly one found
└── Error if none or multiple

Step 3: Verify Account
├── Check is_verified flag
├── Check verification date
├── Ensure not expired
└── Block payment if not verified

Step 4: Process Payment
├── Bank: primary_account.bank_name
├── Account: primary_account.account_number (decrypt)
├── Amount: net_salary
└── SLIPS transfer

Step 5: Record Transaction
├── Payment date
├── Account used
├── Amount paid
└── Transaction reference
```

### Database Constraints

```
Unique Constraint Implementation
═════════════════════════════════

Django Meta:
class Meta:
    unique_together = [['employee', 'is_primary']]

Database Effect:
├── Allows: Multiple accounts with is_primary=False
├── Allows: One account with is_primary=True per employee
├── Prevents: Multiple is_primary=True for same employee
└── Ensures: Data integrity

Example Valid State:
Employee EMP-0001:
├── Account 1: is_primary=True ✓
├── Account 2: is_primary=False ✓
└── Account 3: is_primary=False ✓

Example Invalid State (Prevented):
Employee EMP-0001:
├── Account 1: is_primary=True
└── Account 2: is_primary=True ✗ (Constraint violation)
```

### Expected Outcome
- Primary account designation
- Automatic uniqueness enforcement
- Helper methods for primary management
- Payroll integration ready
- Data integrity ensured

### Verification Checklist
- [ ] is_primary field added
- [ ] Default set to False
- [ ] unique_together constraint added
- [ ] Save method overridden
- [ ] set_as_primary method implemented
- [ ] get_primary_account method implemented
- [ ] Validation in clean method
- [ ] Index on (employee, is_primary)
- [ ] Deletion validation added
- [ ] Model docstring updated

---

## Task 63: Add Bank Account Verification

### Overview
Add verification tracking fields to the EmployeeBankAccount model. Before using a bank account for payroll, HR must verify the account details against official documents (bank statement, passbook). This verification process ensures accuracy, prevents payment errors, and provides an audit trail for compliance.

### Dependencies
- Task 62: Add primary account flag

### Instructions

1. **Open employee_bank.py model file**
   - Continue in `apps/employees/models/employee_bank.py`
   - Locate EmployeeBankAccount model class

2. **Add is_verified field**
   - BooleanField, default=False
   - Indicates if account details verified by HR
   - Must be True before payroll processing

3. **Add verified_by field**
   - ForeignKey to User model
   - on_delete=SET_NULL, null=True, blank=True
   - Tracks which HR user verified the account
   - related_name='verified_bank_accounts'

4. **Add verified_at field**
   - DateTimeField, null=True, blank=True
   - Timestamp when verification occurred
   - Used for audit trails

5. **Add verification_notes field**
   - TextField, blank=True, null=True
   - HR notes from verification process
   - Document verification method and findings

6. **Add verification_document field**
   - ForeignKey to EmployeeDocument model (optional)
   - Links to uploaded bank statement/passbook
   - Evidence of verification
   - null=True, blank=True

7. **Add verification_expiry field**
   - DateField, null=True, blank=True
   - When verification expires (if applicable)
   - Some organizations require periodic re-verification

8. **Add helper method: mark_as_verified**
   - Method: mark_as_verified(user, notes='')
   - Sets verification fields
   - Records who verified and when

9. **Add helper method: is_verification_expired**
   - Property method
   - Returns True if verification expired
   - Checks verification_expiry field

10. **Add helper method: requires_verification**
    - Method: requires_verification()
    - Returns True if account needs verification
    - Considers expiry and status

11. **Add validation for payroll**
    - Method: validate_for_payroll()
    - Ensures account verified before use
    - Raises exception if not ready

12. **Update model docstring**
    - Document verification process
    - Explain verification fields
    - Note compliance requirements

### Bank Verification Structure

```
┌────────────────────────────────────────────────┐
│          Bank Account Verification             │
├────────────────────────────────────────────────┤
│ Verification Status:                           │
│  • is_verified (BooleanField)                  │
│  • verified_by (ForeignKey → User)             │
│  • verified_at (DateTimeField)                 │
│  • verification_notes (TextField)              │
│  • verification_document (FK → Document)       │
│  • verification_expiry (DateField)             │
│                                                │
│ Methods:                                       │
│  • mark_as_verified(user, notes)               │
│  • is_verification_expired                     │
│  • requires_verification()                     │
│  • validate_for_payroll()                      │
└────────────────────────────────────────────────┘
```

### Verification Workflow

```
Bank Account Verification Process
══════════════════════════════════

Step 1: Account Added
├── Employee or HR adds bank details
├── Status: is_verified = False
├── Cannot be used for payroll yet
└── Verification required

Step 2: Document Submission
├── Employee submits bank statement or passbook
├── Document uploaded to system
├── HR notified for verification
└── Document linked to account record

Step 3: HR Verification
├── HR officer reviews bank statement
├── Verifies: Bank name, branch, account number, holder name
├── Compares with physical document if available
├── Checks for any discrepancies
└── Documents findings in notes

Step 4: Verification Decision
├── Option A: Approve
│   ├── mark_as_verified(hr_user, notes)
│   ├── is_verified = True
│   ├── verified_by = HR user
│   ├── verified_at = Current timestamp
│   └── Account ready for payroll
│
└── Option B: Reject
    ├── is_verified remains False
    ├── Add notes explaining issues
    ├── Request employee to correct/resubmit
    └── Cannot use for payroll

Step 5: Periodic Re-verification (Optional)
├── Some organizations require annual re-verification
├── verification_expiry date set
├── System alerts when approaching expiry
└── Re-verification process similar to initial
```

### Verification Requirements

```
What HR Verifies
════════════════

Account Details Match:
├── Bank name matches statement
├── Branch name matches statement
├── Account number matches exactly
├── Account holder name matches (or acceptable variation)
└── Account type matches (savings/current)

Document Quality:
├── Bank statement recent (within 3 months)
├── Statement clearly legible
├── Bank logo and header visible
├── Account details clearly printed
└── No signs of tampering

Additional Checks:
├── Account is active (not closed)
├── Account in employee's name (not family member)
├── No negative remarks on statement
├── Sufficient for direct deposit
└── Bank and branch codes correct
```

### Verification Scenarios

#### Scenario 1: Initial Verification - Successful
```
Context: New employee, first bank account

Step 1: Account Details Entered
├── Bank: Bank of Ceylon
├── Branch: Colombo Main
├── Account: 001234567890
├── Holder: John Silva
└── Status: Unverified

Step 2: Document Submitted
├── Employee uploads bank passbook photo
├── Document clear and recent
└── All details visible

Step 3: HR Verification
├── Reviewer: hr_admin@company.lk
├── Verification Method: Passbook photo review
├── Findings: All details match, account active
└── Decision: Approve

Step 4: Mark as Verified
account.mark_as_verified(
    user=hr_admin,
    notes="Verified against bank passbook photo. 
           Account number, holder name, and bank details 
           confirmed. Passbook shows active account with 
           recent transactions. Ready for payroll."
)

Result:
├── is_verified: True
├── verified_by: hr_admin@company.lk
├── verified_at: 2026-01-24 10:30:00
├── verification_notes: [as above]
└── Ready for salary payment
```

#### Scenario 2: Verification - Discrepancy Found
```
Context: Account number mismatch

Step 1: Account Details Entered
├── Bank: Commercial Bank
├── Account: 1234567890 (entered)
└── Status: Unverified

Step 2: Document Submitted
├── Employee uploads bank statement
└── Document shows account: 0987654321

Step 3: HR Verification
├── Reviewer: hr_admin@company.lk
├── Finding: Account number doesn't match
└── Decision: Reject

Step 4: Add Verification Notes
account.verification_notes = """
Verification FAILED. Account number mismatch:
- System: 1234567890
- Statement: 0987654321

Action Required: Employee must verify correct account 
number and update. Resubmit statement for re-verification.
"""
account.save()

Result:
├── is_verified: False (still)
├── verification_notes: [as above]
├── Employee notified to correct
└── Cannot use for payroll until corrected
```

#### Scenario 3: Re-verification (Annual)
```
Context: Annual verification policy

Initial Verification:
├── verified_at: 2025-01-15
├── verification_expiry: 2026-01-15
└── Status: Expired on 2026-01-15

Alert Generated:
├── 30 days before expiry: Warning to employee
├── 15 days before expiry: Warning to HR
├── On expiry: Account flagged for re-verification
└── Payroll blocked until re-verified

Re-verification Process:
1. Employee submits current bank statement
2. HR reviews (faster than initial verification)
3. If no changes: Quick re-verification
4. If changes: Full verification process
5. Update verification_expiry: +1 year

Result:
├── is_verified: True (maintained)
├── verified_at: Updated to current date
├── verification_expiry: 2027-01-15
└── Account continues in payroll
```

### Verification Documentation

```
Acceptable Verification Documents
══════════════════════════════════

Primary Documents (Best):
├── Bank passbook (photo of account page)
│   ├── Shows: Account number, name, bank, branch
│   └── Validity: Current and active
│
├── Bank statement (last 3 months)
│   ├── Shows: All account details, transactions
│   └── Validity: Recent transactions prove active account
│
└── Bank letter (on bank letterhead)
    ├── Shows: Account confirmation letter
    └── Validity: Issued within last month

Secondary Documents (Acceptable):
├── ATM card photo (with account number)
├── Online banking screenshot
├── Mobile banking screenshot
└── Checkbook leaf photo (for current accounts)

Unacceptable:
├── Handwritten details (no proof)
├── Verbal confirmation (no documentation)
├── Old statements (>6 months)
└── Third-party confirmation (must be official)
```

### Verification Notes Examples

#### Successful Verification
```
"Verified on 2026-01-24 using bank passbook photo. 
Account details match:
- Bank: Bank of Ceylon
- Branch: Colombo Main Branch
- Account: 001234567890 (matches)
- Holder: Silva, John Prasanna (matches employee name)
- Type: Savings Account
- Status: Active with recent transactions

Document Reference: DOC-2026-0145 (Employee Documents)
Verification Method: Visual comparison with passbook
Verified By: HR Admin (hr_admin@company.lk)
Ready for payroll processing."
```

#### Failed Verification - Name Mismatch
```
"Verification FAILED on 2026-01-24. Issue: Name mismatch.

Discrepancy Found:
- Employee Name: John Silva
- Bank Account Name: J. Fernando

This appears to be a different person's account. Employee 
must provide account in their own name or proof that 
Fernando is their legal name.

Action Required:
1. Verify legal name with employee
2. If Fernando is legal name: Update employee record
3. If Silva is correct: Provide correct bank account

Status: Cannot process payroll until resolved.
Verified By: HR Admin (hr_admin@company.lk)"
```

### Verification Expiry

```
Verification Expiry Logic
═════════════════════════

Purpose:
├── Ensure account details remain current
├── Detect closed or changed accounts
├── Maintain compliance with audit requirements
└── Periodic confirmation of accuracy

Expiry Policies:
├── Option 1: No expiry (verify once)
│   └── Trust initial verification indefinitely
│
├── Option 2: Annual expiry
│   ├── Verify every 12 months
│   └── Most common policy
│
├── Option 3: Biennial expiry
│   ├── Verify every 24 months
│   └── Less strict policy
│
└── Option 4: On change only
    └── Re-verify only if employee reports change

Recommended: Annual expiry for compliance
```

### Payroll Validation

```
validate_for_payroll Method
════════════════════════════

Purpose: Ensure account ready for salary payment

Validation Checks:
1. Check is_verified == True
   └── Error if False: "Account not verified"

2. Check verification_expiry (if set)
   └── Error if expired: "Verification expired"

3. Check account_number is not empty
   └── Error if empty: "Account number missing"

4. Check bank_name and branch_name present
   └── Error if missing: "Bank details incomplete"

5. For primary accounts: Additional checks
   └── Ensure employee has exactly one primary

Usage in Payroll:
try:
    primary_account.validate_for_payroll()
    process_payment(primary_account)
except ValidationError as e:
    block_payment(employee, reason=str(e))
    notify_hr(employee, issue=str(e))

Benefits:
├── Prevent payment to unverified accounts
├── Catch missing data before payment
├── Ensure compliance
└── Clear error messages for HR
```

### mark_as_verified Method

```
Method: mark_as_verified(user, notes='', expiry_months=12)
═══════════════════════════════════════════════════════════

Purpose: Mark account as verified by HR

Parameters:
├── user: User instance (HR officer)
├── notes: Verification notes (optional)
└── expiry_months: Months until re-verification (default 12)

Actions:
1. Set is_verified = True
2. Set verified_by = user
3. Set verified_at = current timestamp
4. Set verification_notes = notes
5. Set verification_expiry = today + expiry_months (if > 0)
6. Save account

Usage:
account.mark_as_verified(
    user=request.user,
    notes="Verified against bank statement dated 2026-01-20. 
           All details match. Account active.",
    expiry_months=12
)

Result:
├── Account verified and ready for payroll
├── Audit trail recorded
├── Expiry date set for future re-verification
└── Compliance maintained
```

### Expected Outcome
- Bank account verification workflow
- Verification tracking and audit trail
- Payroll validation
- Verification expiry management
- Compliance support

### Verification Checklist
- [ ] is_verified field added
- [ ] verified_by ForeignKey added
- [ ] verified_at field added
- [ ] verification_notes field added
- [ ] verification_document ForeignKey added
- [ ] verification_expiry field added
- [ ] mark_as_verified method implemented
- [ ] is_verification_expired property added
- [ ] requires_verification method implemented
- [ ] validate_for_payroll method implemented
- [ ] Verification workflow documented
- [ ] Model docstring updated

---

## Task 64: Run EmployeeBankAccount Migrations

### Overview
Generate and apply Django migrations for the EmployeeBankAccount model. This task creates the database schema for bank account storage, including all fields, indexes, relationships, and constraints defined in previous tasks.

### Dependencies
- Task 58: Create EmployeeBankAccount model
- Task 59: Add bank core fields
- Task 60: Add SWIFT/branch code
- Task 61: Add account type field
- Task 62: Add primary account flag
- Task 63: Add bank account verification
- All model code complete and tested

### Instructions

1. **Verify model implementation**
   - Review EmployeeBankAccount model code
   - Check all fields defined correctly
   - Verify all imports present
   - Ensure no syntax errors
   - Check constants defined

2. **Check model is registered**
   - Verify model imported in `models/__init__.py`
   - Check model added to `__all__` list
   - Ensure employees app in INSTALLED_APPS

3. **Generate migration file**
   - Run makemigrations command
   - Command: `python manage.py makemigrations employees`
   - Review generated migration file
   - Check field definitions accurate

4. **Review migration file**
   - Open generated migration file
   - Verify all fields present (20+ fields)
   - Check indexes created correctly
   - Verify foreign key relationships
   - Check unique constraints (primary flag)
   - Verify default values appropriate

5. **Check migration dependencies**
   - Verify dependency on previous employee migrations
   - Check dependency on auth.User model
   - Verify EmployeeDocument dependency (if used)

6. **Apply migration to database**
   - Run migrate command
   - Command: `python manage.py migrate employees`
   - Verify migration applied successfully
   - Check no errors in output

7. **Verify database schema**
   - Connect to database
   - Check table created: `employees_employeebankaccount`
   - Verify all columns present
   - Check indexes created
   - Verify foreign key constraints
   - Check unique constraints

8. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import EmployeeBankAccount model
   - Try creating test instance
   - Verify save operation works
   - Test relationships and queries
   - Test primary account logic

9. **Create database indexes**
   - Verify indexes on frequently queried fields:
     - employee (foreign key)
     - is_primary
     - is_verified
     - (employee, is_primary) composite
   - Check index creation in migration

10. **Update migration tracking**
    - Note migration number (e.g., 0008_employeebankaccount.py)
    - Update documentation with migration info
    - Add to version control

### Migration Generation

```
Command: Generate Migration
════════════════════════════

$ python manage.py makemigrations employees

Expected Output:
Migrations for 'employees':
  employees/migrations/0008_employeebankaccount.py
    - Create model EmployeeBankAccount
    - Add field employee
    - Add field bank_name
    - Add field bank_code
    - Add field branch_name
    - Add field branch_code
    - Add field account_number
    - Add field account_holder_name
    - Add field account_type
    - Add field swift_code
    - Add field iban
    - Add field routing_number
    - Add field is_international
    - Add field currency
    - Add field is_primary
    - Add field is_verified
    - Add field verified_by
    - Add field verified_at
    - Add field verification_notes
    - Add field verification_document
    - Add field verification_expiry
    - Add field notes
    - Add field added_at
    - Add field updated_at
    - Add indexes
    - Add unique constraint
```

### Migration Application

```
Command: Apply Migration
════════════════════════

$ python manage.py migrate employees

Expected Output:
Running migrations:
  Applying employees.0008_employeebankaccount... OK

Database Changes:
├── Table created: employees_employeebankaccount
├── Indexes created: 6-8 indexes
├── Foreign keys created: 4 relationships
├── Unique constraint: (employee, is_primary)
└── Default values applied
```

### Database Schema Verification

```
Table: employees_employeebankaccount
════════════════════════════════════

Columns:
├── id (BigAutoField, Primary Key)
├── employee_id (BigInteger, Foreign Key)
├── bank_name (VARCHAR(200))
├── bank_code (VARCHAR(20), nullable)
├── branch_name (VARCHAR(200))
├── branch_code (VARCHAR(20), nullable)
├── account_number (VARCHAR(50))
├── account_holder_name (VARCHAR(200))
├── account_type (VARCHAR(20), default 'SAVINGS')
├── swift_code (VARCHAR(11), nullable)
├── iban (VARCHAR(34), nullable)
├── routing_number (VARCHAR(20), nullable)
├── is_international (BOOLEAN, default False)
├── currency (VARCHAR(3), default 'LKR')
├── is_primary (BOOLEAN, default False)
├── is_verified (BOOLEAN, default False)
├── verified_by_id (BigInteger, Foreign Key, nullable)
├── verified_at (TIMESTAMP, nullable)
├── verification_notes (TEXT, nullable)
├── verification_document_id (BigInteger, FK, nullable)
├── verification_expiry (DATE, nullable)
├── notes (TEXT, nullable)
├── added_at (TIMESTAMP, auto_now_add)
├── updated_at (TIMESTAMP, auto_now)
├── created_at (TIMESTAMP, auto)
└── updated_at (TIMESTAMP, auto)

Indexes:
├── PRIMARY KEY (id)
├── INDEX idx_employee (employee_id)
├── INDEX idx_is_primary (is_primary)
├── INDEX idx_is_verified (is_verified)
├── INDEX idx_composite_emp_primary (employee_id, is_primary)
└── INDEX idx_verification_expiry (verification_expiry)

Foreign Keys:
├── FK employee_id → employees_employee.id
├── FK verified_by_id → auth_user.id
└── FK verification_document_id → employees_employeedocument.id

Unique Constraints:
└── UNIQUE (employee_id, is_primary) WHERE is_primary = True

Note: Exact constraint implementation may vary by database backend
```

### Django Shell Testing

```
Test Model in Django Shell
═══════════════════════════

$ python manage.py shell

>>> from apps.employees.models import EmployeeBankAccount, Employee
>>> from django.contrib.auth.models import User

# Test 1: Create bank account
>>> employee = Employee.objects.first()
>>> user = User.objects.first()
>>> account = EmployeeBankAccount(
...     employee=employee,
...     bank_name='Bank of Ceylon',
...     branch_name='Colombo Main Branch',
...     account_number='001234567890',
...     account_holder_name='John Silva',
...     account_type='SAVINGS',
...     is_primary=True
... )
>>> account.save()
>>> print(account)
John Silva - Bank of Ceylon

# Test 2: Query bank accounts
>>> accounts = EmployeeBankAccount.objects.filter(employee=employee)
>>> print(accounts.count())
1

# Test 3: Test relationships
>>> account.employee
<Employee: EMP-0001 - John Silva>
>>> account.bank_name
'Bank of Ceylon'

# Test 4: Test verification
>>> account.mark_as_verified(
...     user=user,
...     notes='Verified against bank passbook'
... )
>>> account.is_verified
True
>>> account.verified_by
<User: hr_admin>

# Test 5: Test primary account logic
>>> account2 = EmployeeBankAccount(
...     employee=employee,
...     bank_name='Commercial Bank',
...     branch_name='Kandy Branch',
...     account_number='9876543210',
...     account_holder_name='John Silva',
...     is_primary=False
... )
>>> account2.save()
>>> account2.set_as_primary()
>>> account.refresh_from_db()
>>> account.is_primary
False  # Automatically unset
>>> account2.is_primary
True  # Now primary

# Test 6: Test validation
>>> account2.validate_for_payroll()  # Should succeed
>>> account.is_verified = False
>>> account.save()
>>> account.validate_for_payroll()  # Should raise error
ValidationError: Account not verified
```

### Common Migration Issues

#### Issue 1: Circular Import
```
Error: "Cannot import name 'EmployeeDocument'"

Cause: Circular dependency between models

Solution:
1. Use string reference for foreign keys
2. Change: ForeignKey(EmployeeDocument, ...)
3. To: ForeignKey('EmployeeDocument', ...)
4. Django resolves string references after all models loaded
```

#### Issue 2: Missing Dependency Migration
```
Error: "No such table: employees_employee"

Cause: Employee model migration not run first

Solution:
1. Check Employee model migration exists
2. Run: python manage.py migrate employees
3. Ensure all dependencies migrated
4. Retry BankAccount migration
```

#### Issue 3: Unique Constraint Violation
```
Error: "Duplicate key violates unique constraint"

Cause: Existing data conflicts with new constraint

Solution:
1. Check existing bank accounts
2. Find employees with multiple is_primary=True
3. Fix data before migration:
   UPDATE employees_employeebankaccount
   SET is_primary = False
   WHERE id NOT IN (
       SELECT MIN(id) FROM employees_employeebankaccount
       WHERE is_primary = True
       GROUP BY employee_id
   )
4. Retry migration
```

### Migration File Example

```python
# Generated migration file structure
# employees/migrations/0008_employeebankaccount.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('employees', '0007_employeedocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeBankAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True)),
                ('bank_name', models.CharField(max_length=200)),
                ('bank_code', models.CharField(blank=True, max_length=20, null=True)),
                # ... other fields ...
                ('is_primary', models.BooleanField(default=False)),
                ('is_verified', models.BooleanField(default=False)),
                # ... more fields ...
                ('employee', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='bank_accounts',
                    to='employees.employee'
                )),
                ('verified_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='verified_bank_accounts',
                    to=settings.AUTH_USER_MODEL
                )),
            ],
            options={
                'verbose_name': 'Employee Bank Account',
                'verbose_name_plural': 'Employee Bank Accounts',
                'ordering': ['employee', '-is_primary'],
            },
        ),
        migrations.AddIndex(
            model_name='employeebankaccount',
            index=models.Index(fields=['employee'], name='idx_employee_bank'),
        ),
        migrations.AddConstraint(
            model_name='employeebankaccount',
            constraint=models.UniqueConstraint(
                fields=['employee', 'is_primary'],
                condition=models.Q(is_primary=True),
                name='unique_primary_per_employee'
            ),
        ),
    ]
```

### Post-Migration Verification

```
Verification Checklist
══════════════════════

Database Level:
├── [ ] Table employees_employeebankaccount exists
├── [ ] All columns present and correct type
├── [ ] Foreign keys created correctly
├── [ ] Indexes created
├── [ ] Unique constraint working
└── [ ] Default values applied

Application Level:
├── [ ] Model imports without errors
├── [ ] Can create model instances
├── [ ] Can save to database
├── [ ] Can query from database
├── [ ] Relationships work correctly
├── [ ] Primary account logic works
├── [ ] Verification methods work
└── [ ] Properties and methods function

Business Logic:
├── [ ] Only one primary per employee enforced
├── [ ] Verification workflow functional
├── [ ] Account type choices available
├── [ ] SWIFT code validation works
└── [ ] Payroll validation functional
```

### Expected Outcome
- Database table created successfully
- All fields and indexes in place
- Model fully functional
- Relationships working correctly
- Primary account logic enforced
- Verification workflow ready
- Ready for admin, API, and encryption

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] All fields present in migration
- [ ] Migration applied successfully
- [ ] Database table created
- [ ] All columns present
- [ ] Indexes created
- [ ] Foreign keys working
- [ ] Unique constraint working
- [ ] Model tested in Django shell
- [ ] No migration errors
- [ ] Can create and save accounts
- [ ] Relationships functional
- [ ] Primary account logic works
- [ ] Verification methods work

---

## Task 65: Create Sri Lanka Banks List

### Overview
Create a comprehensive reference list of Sri Lankan banks with their codes, SWIFT codes, and other identifiers. This list will be used for validation, autocomplete, and ensuring accurate bank data entry. The list supports both manual reference and potential integration into forms and APIs.

### Dependencies
- Constants module exists

### Instructions

1. **Open or create constants.py file**
   - Navigate to `apps/employees/constants.py`
   - Add Sri Lankan banks section

2. **Add module docstring for banks section**
   - Document purpose of banks list
   - Explain data sources
   - Note usage context

3. **Define SRI_LANKA_BANKS constant**
   - Create list/tuple of bank dictionaries
   - Each entry contains: code, name, SWIFT code
   - Include all major banks

4. **Add major commercial banks**
   - Bank of Ceylon (BOC)
   - People's Bank
   - Commercial Bank
   - Hatton National Bank (HNB)
   - Sampath Bank
   - Seylan Bank
   - Nations Trust Bank (NTB)
   - DFCC Bank
   - National Development Bank (NDB)
   - Pan Asia Banking Corporation

5. **Add specialized banks**
   - National Savings Bank (NSB)
   - Regional Development Bank
   - Sanasa Development Bank

6. **Add foreign banks operating in Sri Lanka**
   - Standard Chartered Bank
   - Citibank
   - HSBC
   - (Others as needed)

7. **Include bank data structure**
   - bank_code: SLIPS/internal code
   - bank_name: Official bank name
   - swift_code: SWIFT/BIC code
   - short_name: Common abbreviation

8. **Add helper function**
   - Function: get_bank_by_code(bank_code)
   - Returns bank details dictionary
   - Returns None if not found

9. **Add helper function**
   - Function: get_bank_by_swift(swift_code)
   - Returns bank details dictionary
   - Useful for international lookups

10. **Add validation function**
    - Function: is_valid_bank_code(bank_code)
    - Returns True if code exists in list
    - Used in form validation

11. **Add export function**
    - Function: get_bank_choices()
    - Returns list of tuples for Django choices
    - Format: [(code, name), ...]

12. **Update module docstring**
    - Document all functions
    - Explain data maintenance
    - Note update frequency

### Sri Lankan Banks Data Structure

```
Bank Entry Format
═════════════════

Each bank entry contains:
{
    'bank_code': '7010',           # SLIPS code
    'bank_name': 'Bank of Ceylon', # Official name
    'short_name': 'BOC',           # Abbreviation
    'swift_code': 'BCEYLKLX',      # SWIFT/BIC
    'type': 'Commercial',          # Bank type
}

Usage:
├── Form validation
├── Autocomplete dropdowns
├── SWIFT code lookup
├── Bank code validation
└── Payment processing
```

### Major Sri Lankan Banks

```
SRI_LANKA_BANKS = [
    {
        'bank_code': '7010',
        'bank_name': 'Bank of Ceylon',
        'short_name': 'BOC',
        'swift_code': 'BCEYLKLX',
        'type': 'State Commercial',
        'established': 1939,
    },
    {
        'bank_code': '7135',
        'bank_name': "People's Bank",
        'short_name': 'PB',
        'swift_code': 'PSBKLKLX',
        'type': 'State Commercial',
        'established': 1961,
    },
    {
        'bank_code': '7056',
        'bank_name': 'Commercial Bank of Ceylon PLC',
        'short_name': 'ComBank',
        'swift_code': 'CCEYLKLX',
        'type': 'Private Commercial',
        'established': 1969,
    },
    {
        'bank_code': '7083',
        'bank_name': 'Hatton National Bank PLC',
        'short_name': 'HNB',
        'swift_code': 'HBLILKLX',
        'type': 'Private Commercial',
        'established': 1888,
    },
    {
        'bank_code': '7278',
        'bank_name': 'Sampath Bank PLC',
        'short_name': 'Sampath',
        'swift_code': 'BSAMLKLX',
        'type': 'Private Commercial',
        'established': 1987,
    },
    {
        'bank_code': '7287',
        'bank_name': 'Seylan Bank PLC',
        'short_name': 'Seylan',
        'swift_code': 'SEYLLKLX',
        'type': 'Private Commercial',
        'established': 1987,
    },
    {
        'bank_code': '7214',
        'bank_name': 'National Development Bank PLC',
        'short_name': 'NDB',
        'swift_code': 'NDBSLKLX',
        'type': 'Private Commercial',
        'established': 1979,
    },
    {
        'bank_code': '7454',
        'bank_name': 'DFCC Bank PLC',
        'short_name': 'DFCC',
        'swift_code': 'DFCCLKLX',
        'type': 'Private Commercial',
        'established': 1955,
    },
    {
        'bank_code': '7386',
        'bank_name': 'Pan Asia Banking Corporation PLC',
        'short_name': 'PABC',
        'swift_code': 'PABCLKLX',
        'type': 'Private Commercial',
        'established': 1995,
    },
    {
        'bank_code': '7777',
        'bank_name': 'Nations Trust Bank PLC',
        'short_name': 'NTB',
        'swift_code': 'NTBSLKLX',
        'type': 'Private Commercial',
        'established': 1999,
    },
    {
        'bank_code': '7719',
        'bank_name': 'National Savings Bank',
        'short_name': 'NSB',
        'swift_code': 'NSBSLKLX',
        'type': 'State Development',
        'established': 1971,
    },
    {
        'bank_code': '7777',
        'bank_name': 'Regional Development Bank',
        'short_name': 'RDB',
        'swift_code': 'RDBSLKLX',
        'type': 'State Development',
        'established': 1985,
    },
    {
        'bank_code': '7777',
        'bank_name': 'Sanasa Development Bank PLC',
        'short_name': 'SDB',
        'swift_code': 'SDBSLKLX',
        'type': 'Private Development',
        'established': 1997,
    },
    {
        'bank_code': '7777',
        'bank_name': 'Standard Chartered Bank',
        'short_name': 'SCB',
        'swift_code': 'SCBLLKLX',
        'type': 'Foreign',
        'established': 1892,
    },
    {
        'bank_code': '7777',
        'bank_name': 'Citibank N.A.',
        'short_name': 'Citi',
        'swift_code': 'CITILKLX',
        'type': 'Foreign',
        'established': 1979,
    },
    {
        'bank_code': '7777',
        'bank_name': 'HSBC',
        'short_name': 'HSBC',
        'swift_code': 'HSBCLKLX',
        'type': 'Foreign',
        'established': 1982,
    },
]

Note: Some bank_codes marked '7777' are placeholders. 
Update with actual SLIPS codes from Central Bank of Sri Lanka.
```

### Bank Categories

```
Sri Lankan Banking Sector
══════════════════════════

State Commercial Banks (2):
├── Bank of Ceylon
└── People's Bank

Private Commercial Banks (Licensed) (~15):
├── Commercial Bank
├── Hatton National Bank
├── Sampath Bank
├── Seylan Bank
├── NDB Bank
├── DFCC Bank
├── Nations Trust Bank
├── Pan Asia Bank
├── Union Bank
├── Amana Bank
├── Cargills Bank
├── MCB Bank
└── Others

Development Banks:
├── National Savings Bank (State)
├── Regional Development Bank (State)
└── Sanasa Development Bank (Private)

Foreign Banks:
├── Standard Chartered
├── Citibank
├── HSBC
└── Others (limited branches)

Total Licensed Banks: ~25-30
```

### Helper Functions

#### get_bank_by_code Function
```
Function: get_bank_by_code(bank_code)
══════════════════════════════════════

Purpose: Look up bank details by SLIPS code

Parameters:
└── bank_code: String (e.g., '7010')

Returns:
├── Dictionary with bank details if found
└── None if not found

Implementation:
def get_bank_by_code(bank_code):
    for bank in SRI_LANKA_BANKS:
        if bank['bank_code'] == bank_code:
            return bank
    return None

Usage:
bank = get_bank_by_code('7010')
if bank:
    print(bank['bank_name'])  # "Bank of Ceylon"
    print(bank['swift_code'])  # "BCEYLKLX"
```

#### get_bank_by_swift Function
```
Function: get_bank_by_swift(swift_code)
════════════════════════════════════════

Purpose: Look up bank details by SWIFT code

Parameters:
└── swift_code: String (e.g., 'BCEYLKLX')

Returns:
├── Dictionary with bank details if found
└── None if not found

Implementation:
def get_bank_by_swift(swift_code):
    # Normalize SWIFT code (8 or 11 chars)
    swift = swift_code.upper()[:8]
    for bank in SRI_LANKA_BANKS:
        if bank['swift_code'][:8] == swift:
            return bank
    return None

Usage:
bank = get_bank_by_swift('BCEYLKLX')
if bank:
    print(bank['bank_name'])  # "Bank of Ceylon"
```

#### get_bank_choices Function
```
Function: get_bank_choices()
════════════════════════════

Purpose: Get bank list formatted for Django form choices

Returns:
└── List of tuples: [(code, name), ...]

Implementation:
def get_bank_choices():
    return [
        (bank['bank_code'], bank['bank_name'])
        for bank in sorted(SRI_LANKA_BANKS, key=lambda x: x['bank_name'])
    ]

Usage in Django Form:
class BankAccountForm(forms.ModelForm):
    bank_code = forms.ChoiceField(
        choices=get_bank_choices(),
        label='Select Bank'
    )
```

#### is_valid_bank_code Function
```
Function: is_valid_bank_code(bank_code)
════════════════════════════════════════

Purpose: Validate if bank code exists

Parameters:
└── bank_code: String

Returns:
├── True if code exists
└── False if not found

Implementation:
def is_valid_bank_code(bank_code):
    return any(
        bank['bank_code'] == bank_code
        for bank in SRI_LANKA_BANKS
    )

Usage in Model Validation:
def clean_bank_code(self):
    code = self.cleaned_data['bank_code']
    if not is_valid_bank_code(code):
        raise ValidationError('Invalid bank code')
    return code
```

### Usage Examples

#### Example 1: Form Autocomplete
```
Use Case: Bank selection dropdown

Implementation:
1. Generate bank choices list
2. Sort alphabetically
3. Display in dropdown

User Experience:
├── Dropdown shows: "Bank of Ceylon"
├── On selection: Populates bank_code '7010'
├── Auto-fills: SWIFT code 'BCEYLKLX'
└── Reduces errors: No manual typing
```

#### Example 2: Validation
```
Use Case: Validate bank code during import

Process:
1. Import CSV with employee bank details
2. Check each bank_code against list
3. Flag invalid codes
4. Report errors to user

Validation:
for row in csv_data:
    if not is_valid_bank_code(row['bank_code']):
        errors.append(f"Invalid bank code: {row['bank_code']}")
```

#### Example 3: SWIFT Lookup
```
Use Case: International payment setup

Process:
1. User enters bank name
2. System looks up SWIFT code
3. Auto-fills SWIFT field

Implementation:
bank = get_bank_by_code(selected_bank_code)
if bank:
    swift_code_field.value = bank['swift_code']
```

### Data Maintenance

```
Keeping Bank List Current
═════════════════════════

Update Frequency:
├── Annually: Check for new banks
├── As needed: Bank mergers/closures
└── Source: Central Bank of Sri Lanka

Sources of Information:
├── Central Bank of Sri Lanka (CBSL)
│   └── www.cbsl.gov.lk/licensed-banks
│
├── SLIPS documentation
│   └── Bank codes and routing
│
├── SWIFT registry
│   └── www.swift.com
│
└── Individual bank websites
    └── Verify SWIFT codes

Change Management:
├── Bank name change: Update bank_name
├── SWIFT code change: Update swift_code
├── Bank merger: Mark old bank inactive
├── New bank: Add entry with all details
└── Bank closure: Mark as inactive, don't delete
```

### Expected Outcome
- Comprehensive Sri Lankan banks list
- Helper functions for lookups
- Support for validation and autocomplete
- Accurate SWIFT and bank codes
- Easy maintenance and updates

### Verification Checklist
- [ ] SRI_LANKA_BANKS list created
- [ ] All major banks included (BOC, People's Bank, etc.)
- [ ] SWIFT codes verified
- [ ] Bank codes (SLIPS) included
- [ ] get_bank_by_code function implemented
- [ ] get_bank_by_swift function implemented
- [ ] is_valid_bank_code function implemented
- [ ] get_bank_choices function implemented
- [ ] Data structure documented
- [ ] Module docstring added
- [ ] Foreign banks included
- [ ] Update process documented

---

## Task 66: Create Bank Account Encryption

### Overview
Implement encryption for sensitive bank account fields, specifically the account number. Account numbers must be encrypted at rest to protect sensitive financial information. Use Django's encryption libraries or field-level encryption to ensure account numbers are never stored in plain text, meeting security and compliance requirements.

### Dependencies
- Task 64: Run EmployeeBankAccount migrations
- Encryption library installed (django-fernet-fields or similar)
- Encryption key generated and stored securely

### Instructions

1. **Install encryption package**
   - Add to requirements.txt: django-fernet-fields
   - Install package: pip install django-fernet-fields
   - Alternative: django-cryptography or custom solution

2. **Generate encryption key**
   - Generate Fernet key
   - Store in environment variable
   - Never commit key to version control
   - Document key management process

3. **Add encryption key to settings**
   - Open Django settings.py
   - Add FERNET_KEYS setting
   - Load from environment variable
   - Set up key rotation if needed

4. **Update EmployeeBankAccount model**
   - Change account_number field type
   - From: CharField
   - To: EncryptedCharField (from django-fernet-fields)

5. **Create data migration**
   - Generate empty migration
   - Add migration code to encrypt existing data
   - Encrypt all existing account numbers
   - Verify encryption successful

6. **Update model methods**
   - Modify get_masked_account_number to handle encrypted field
   - Ensure decryption only when necessary
   - Update display methods

7. **Add decryption helper**
   - Method: get_decrypted_account_number()
   - Only for authorized users
   - Log decryption attempts
   - Return decrypted account number

8. **Create encryption utils module**
   - Create file: `apps/employees/utils/encryption.py`
   - Add encryption/decryption utilities
   - Add audit logging functions

9. **Add audit logging**
   - Log when account numbers are decrypted
   - Record user, timestamp, purpose
   - Store in dedicated audit log table

10. **Update admin interface**
    - Mask account numbers in list view
    - Allow decryption for authorized staff only
    - Show audit trail on admin page

11. **Update API serializers**
    - Never expose decrypted account number in API
    - Return masked version only
    - Special endpoint for authorized decryption

12. **Test encryption**
    - Create test bank account
    - Verify account number encrypted in database
    - Test decryption works correctly
    - Verify masking works

13. **Document encryption process**
    - Update documentation with encryption details
    - Document key management
    - Explain recovery process if key lost

### Encryption Architecture

```
Bank Account Encryption Flow
════════════════════════════

Application Layer:
├── User enters: "001234567890"
│
├── Django Model (EncryptedCharField):
│   ├── Encrypt on save
│   └── Store encrypted: "gAAAAABf..."
│
├── Database Storage:
│   └── account_number: "gAAAAABf..." (encrypted)
│
└── On retrieval:
    ├── Decrypt automatically (if accessed)
    ├── Mask for display: "XXXX-XXXX-7890"
    └── Decrypt only when needed

Security Benefits:
├── Data breach protection
├── Compliance (PCI-DSS-like)
├── Access control
└── Audit trail
```

### Encryption Implementation

#### Install django-fernet-fields
```
Requirements
════════════

requirements.txt:
django-fernet-fields==2.5.0
cryptography==41.0.5

Installation:
$ pip install django-fernet-fields

Dependencies:
└── cryptography library (symmetric encryption)
```

#### Generate Encryption Key
```
Generate Fernet Key
═══════════════════

Command (Python):
from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(key.decode())

Example Output:
XEpv8Y5NLG4h9_3QJKLhZq8-F2M1w9R4PqV7nX2K1bA=

Store in Environment:
├── Development: .env file
├── Production: Environment variable
├── Docker: Docker secrets
└── Cloud: Secret manager (AWS Secrets, Azure Key Vault)

.env file:
FERNET_KEY=XEpv8Y5NLG4h9_3QJKLhZq8-F2M1w9R4PqV7nX2K1bA=

CRITICAL: Never commit this key to version control!
```

#### Update Django Settings
```
Settings Configuration
══════════════════════

settings.py:
import os

# Encryption configuration
FERNET_KEYS = [
    os.environ.get('FERNET_KEY'),
]

# For key rotation (advanced):
# FERNET_KEYS = [
#     os.environ.get('FERNET_KEY_NEW'),  # Current key
#     os.environ.get('FERNET_KEY_OLD'),  # Previous key
# ]

# Fallback for development (NOT FOR PRODUCTION):
if not FERNET_KEYS[0]:
    raise ImproperlyConfigured(
        'FERNET_KEY environment variable must be set'
    )
```

#### Update Model Field
```
Model Field Change
══════════════════

Before (Plain Text):
from django.db import models

class EmployeeBankAccount(models.Model):
    account_number = models.CharField(max_length=50)

After (Encrypted):
from django.db import models
from fernet_fields import EncryptedCharField

class EmployeeBankAccount(models.Model):
    account_number = EncryptedCharField(max_length=50)

Changes:
├── Import EncryptedCharField
├── Replace CharField with EncryptedCharField
├── No other changes needed (same interface)
└── Transparent encryption/decryption
```

### Data Migration for Existing Records

```
Encrypt Existing Data
═════════════════════

Create Empty Migration:
$ python manage.py makemigrations --empty employees --name encrypt_account_numbers

Migration File (0009_encrypt_account_numbers.py):
from django.db import migrations
from fernet_fields import EncryptedCharField

def encrypt_existing_accounts(apps, schema_editor):
    EmployeeBankAccount = apps.get_model('employees', 'EmployeeBankAccount')
    
    # Get all accounts
    for account in EmployeeBankAccount.objects.all():
        # Account number will be automatically encrypted on save
        # because field is now EncryptedCharField
        account.save()

def reverse_encryption(apps, schema_editor):
    # Reverse migration not needed (decrypt happens automatically)
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('employees', '0008_employeebankaccount'),
    ]

    operations = [
        migrations.RunPython(
            encrypt_existing_accounts,
            reverse_encryption
        ),
    ]

Run Migration:
$ python manage.py migrate employees

Result:
├── All existing account numbers encrypted
├── Database now contains encrypted values
└── Application continues to work normally
```

### Encryption Utils Module

```
File: apps/employees/utils/encryption.py
════════════════════════════════════════

from django.conf import settings
from cryptography.fernet import Fernet
import logging

logger = logging.getLogger(__name__)

def get_fernet():
    """Get Fernet cipher instance"""
    key = settings.FERNET_KEYS[0]
    if not key:
        raise ValueError('Encryption key not configured')
    return Fernet(key.encode())

def encrypt_value(value):
    """Encrypt a string value"""
    if not value:
        return value
    
    f = get_fernet()
    encrypted = f.encrypt(value.encode())
    return encrypted.decode()

def decrypt_value(encrypted_value):
    """Decrypt an encrypted string"""
    if not encrypted_value:
        return encrypted_value
    
    f = get_fernet()
    decrypted = f.decrypt(encrypted_value.encode())
    return decrypted.decode()

def mask_account_number(account_number, show_last=4):
    """
    Mask account number for display
    Shows only last N digits
    """
    if not account_number or len(account_number) <= show_last:
        return 'XXXX'
    
    masked = 'X' * (len(account_number) - show_last)
    visible = account_number[-show_last:]
    return f"{masked[:4]}-{masked[4:8]}-{visible}" if len(masked) > 4 else f"{masked}{visible}"
```

### Audit Logging

```
Audit Log Model
═══════════════

Create EncryptionAuditLog model to track decryption:

File: apps/employees/models/audit_log.py

from django.db import models
from django.conf import settings

class EncryptionAuditLog(models.Model):
    """Track when encrypted data is accessed"""
    
    ACTION_DECRYPT = 'DECRYPT'
    ACTION_VIEW = 'VIEW'
    ACTION_EXPORT = 'EXPORT'
    
    ACTION_CHOICES = [
        (ACTION_DECRYPT, 'Decrypted'),
        (ACTION_VIEW, 'Viewed'),
        (ACTION_EXPORT, 'Exported'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='encryption_audit_logs'
    )
    
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES
    )
    
    model_name = models.CharField(max_length=100)
    object_id = models.BigIntegerField()
    field_name = models.CharField(max_length=100)
    
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    
    purpose = models.TextField(
        blank=True,
        help_text='Reason for accessing encrypted data'
    )
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Encryption Audit Log'
        verbose_name_plural = 'Encryption Audit Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['model_name', 'object_id']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"
```

### Updated Model Methods

```
EmployeeBankAccount Model Updates
══════════════════════════════════

Method: get_decrypted_account_number
─────────────────────────────────────
from apps.employees.models.audit_log import EncryptionAuditLog

def get_decrypted_account_number(self, user, purpose='', request=None):
    """
    Get decrypted account number with audit logging
    
    Args:
        user: User requesting decryption
        purpose: Reason for decryption
        request: HTTP request object (for IP, user agent)
    
    Returns:
        Decrypted account number string
    """
    # Log the decryption attempt
    EncryptionAuditLog.objects.create(
        user=user,
        action=EncryptionAuditLog.ACTION_DECRYPT,
        model_name='EmployeeBankAccount',
        object_id=self.id,
        field_name='account_number',
        ip_address=request.META.get('REMOTE_ADDR') if request else None,
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:255] if request else '',
        purpose=purpose
    )
    
    # Return decrypted value
    return self.account_number  # Auto-decrypted by EncryptedCharField


Method: get_masked_account_number (Updated)
────────────────────────────────────────────
from apps.employees.utils.encryption import mask_account_number

def get_masked_account_number(self):
    """
    Get masked account number for display
    Does NOT log (safe for general display)
    """
    if not self.account_number:
        return 'XXXX'
    
    # Decrypt (happens automatically)
    decrypted = self.account_number
    
    # Mask and return
    return mask_account_number(decrypted, show_last=4)
```

### Admin Interface Updates

```
Admin Configuration with Encryption
════════════════════════════════════

File: apps/employees/admin.py

from django.contrib import admin
from django.utils.html import format_html
from apps.employees.models import EmployeeBankAccount

@admin.register(EmployeeBankAccount)
class EmployeeBankAccountAdmin(admin.ModelAdmin):
    list_display = [
        'employee',
        'bank_name',
        'masked_account_number',
        'is_primary',
        'is_verified',
    ]
    
    readonly_fields = [
        'masked_account_number',
        'added_at',
        'updated_at',
        'audit_trail',
    ]
    
    def masked_account_number(self, obj):
        """Display masked account number in list view"""
        return obj.get_masked_account_number()
    masked_account_number.short_description = 'Account Number'
    
    def audit_trail(self, obj):
        """Show recent decryption audit logs"""
        from apps.employees.models.audit_log import EncryptionAuditLog
        
        logs = EncryptionAuditLog.objects.filter(
            model_name='EmployeeBankAccount',
            object_id=obj.id,
            field_name='account_number'
        )[:10]
        
        if not logs:
            return 'No access logs'
        
        html = '<table><tr><th>User</th><th>Action</th><th>Time</th><th>Purpose</th></tr>'
        for log in logs:
            html += f'<tr><td>{log.user}</td><td>{log.action}</td><td>{log.timestamp}</td><td>{log.purpose}</td></tr>'
        html += '</table>'
        
        return format_html(html)
    audit_trail.short_description = 'Recent Access Logs'
```

### API Serializer Updates

```
Serializer with Encryption
═══════════════════════════

File: apps/employees/serializers.py

from rest_framework import serializers
from apps.employees.models import EmployeeBankAccount

class BankAccountSerializer(serializers.ModelSerializer):
    """Standard serializer - returns masked account number"""
    
    account_number_masked = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeBankAccount
        fields = [
            'id',
            'bank_name',
            'branch_name',
            'account_number_masked',  # Masked only
            'account_holder_name',
            'is_primary',
            'is_verified',
        ]
    
    def get_account_number_masked(self, obj):
        return obj.get_masked_account_number()

class BankAccountDecryptedSerializer(serializers.ModelSerializer):
    """
    Special serializer for authorized decryption
    Use only in secure endpoints with proper permissions
    """
    
    account_number_decrypted = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeBankAccount
        fields = [
            'id',
            'account_number_decrypted',  # Decrypted
        ]
    
    def get_account_number_decrypted(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        purpose = self.context.get('purpose', 'API access')
        
        return obj.get_decrypted_account_number(
            user=user,
            purpose=purpose,
            request=request
        )
```

### Security Best Practices

```
Encryption Security Guidelines
═══════════════════════════════

Key Management:
├── Generate strong keys (Fernet.generate_key())
├── Store in environment variables, NOT in code
├── Use secret management service in production
├── Rotate keys periodically (key rotation)
└── Never commit keys to version control

Access Control:
├── Limit who can decrypt (permissions)
├── Audit all decryption attempts
├── Require purpose/justification for decryption
├── Monitor unusual access patterns
└── Restrict API endpoints that return decrypted data

Backup and Recovery:
├── Backup encryption keys securely
├── Document key recovery process
├── Test key recovery procedure
├── Store backup keys in different location
└── If key lost: Data cannot be recovered

Compliance:
├── Encryption at rest (database)
├── Encryption in transit (HTTPS)
├── Audit logging (who, when, why)
├── Access controls (role-based)
└── Regular security audits
```

### Testing Encryption

```
Encryption Test Cases
═════════════════════

Test 1: Encryption on Save
from apps.employees.models import EmployeeBankAccount, Employee

employee = Employee.objects.first()
account = EmployeeBankAccount.objects.create(
    employee=employee,
    bank_name='Bank of Ceylon',
    branch_name='Colombo Main',
    account_number='001234567890',  # Plain text input
    account_holder_name='John Silva'
)

# Check database directly (raw SQL)
from django.db import connection
cursor = connection.cursor()
cursor.execute(
    'SELECT account_number FROM employees_employeebankaccount WHERE id = %s',
    [account.id]
)
encrypted_value = cursor.fetchone()[0]

print(f"Encrypted in DB: {encrypted_value}")
# Should print: gAAAAABf... (not plain text)

assert encrypted_value.startswith('gAAAAA'), "Not encrypted!"

Test 2: Decryption on Retrieval
account = EmployeeBankAccount.objects.get(id=account.id)
decrypted = account.account_number

print(f"Decrypted: {decrypted}")
assert decrypted == '001234567890', "Decryption failed!"

Test 3: Masking
masked = account.get_masked_account_number()
print(f"Masked: {masked}")
assert '7890' in masked, "Masking failed!"
assert 'XXXX' in masked, "Masking failed!"

Test 4: Audit Logging
from django.contrib.auth.models import User
user = User.objects.first()

decrypted = account.get_decrypted_account_number(
    user=user,
    purpose='Testing decryption'
)

from apps.employees.models.audit_log import EncryptionAuditLog
log_count = EncryptionAuditLog.objects.filter(
    user=user,
    object_id=account.id
).count()

assert log_count > 0, "Audit logging failed!"
```

### Expected Outcome
- Account numbers encrypted at rest
- Transparent encryption/decryption
- Audit logging for all decryption
- Secure key management
- Compliance-ready solution
- Production-grade security

### Verification Checklist
- [ ] django-fernet-fields installed
- [ ] Encryption key generated
- [ ] Key stored in environment variable
- [ ] Settings configured with FERNET_KEYS
- [ ] account_number field changed to EncryptedCharField
- [ ] Data migration created and run
- [ ] Existing data encrypted
- [ ] Encryption utils module created
- [ ] Audit logging model created
- [ ] get_decrypted_account_number method added
- [ ] Audit logging working
- [ ] Admin interface updated
- [ ] API serializers updated
- [ ] Encryption tested
- [ ] Decryption tested
- [ ] Audit logs verified
- [ ] Documentation updated
- [ ] Key backup procedure documented

---

## Summary

This document established the employee bank account management system:

### Completed Infrastructure
- ✅ Core EmployeeBankAccount model with relationships
- ✅ Bank and branch information fields
- ✅ SWIFT code and international support
- ✅ Account type classification (Savings/Current)
- ✅ Primary account flag with uniqueness enforcement
- ✅ Verification workflow with audit trail
- ✅ Database migrations applied
- ✅ Comprehensive Sri Lankan banks list
- ✅ Field-level encryption for account numbers

### Key Achievements
1. **Bank Details Storage** - Comprehensive bank and account information
2. **International Support** - SWIFT codes for foreign payments
3. **Primary Account Logic** - Automatic management of default account
4. **Verification Workflow** - HR verification before payroll use
5. **Sri Lankan Context** - Local banks list with codes
6. **Security** - Encrypted account numbers with audit logging
7. **Compliance** - Meets security and data protection requirements

### Next Steps
Proceed to **Group E: Employee Services & History** to implement:
- Leave management and accrual
- Attendance tracking
- Employment history and promotions
- Disciplinary actions
- Training records
- Exit management

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9 (58-66)  
**Total Lines:** ~1390
