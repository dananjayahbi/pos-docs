# Tasks 19-24: Core Account Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** B - Account Model & Hierarchy  
> **Document:** 02 of 04  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-18_MPTT-Account-Model.md](01_Tasks-17-18_MPTT-Account-Model.md)
- **→ Next Document:** [03_Tasks-25-28_Hierarchy-System-Fields.md](03_Tasks-25-28_Hierarchy-System-Fields.md)

---

## Document Overview

This document covers the core identification and classification fields for the Account model. These fields establish each account's unique identity, type classification, status, and descriptive information. They form the essential attributes that define what an account is and how it functions within the chart of accounts.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Add Account Code Field | Low | 15 min |
| 20 | Add Account Name Field | Low | 10 min |
| 21 | Add Account Type FK | Low | 15 min |
| 22 | Add Account Category | Low | 15 min |
| 23 | Add Account Status | Low | 15 min |
| 24 | Add Account Description | Low | 10 min |

---

## Task 19: Add Account Code Field

### Overview
Add the unique account code field that serves as the primary identifier for each account within the tenant's chart of accounts. The code is a numeric identifier that follows a structured numbering system, where ranges indicate account types (e.g., 1000-1999 for Assets, 2000-2999 for Liabilities).

### Dependencies
- Task 18: Create Account Model must be completed
- AccountTypeConfig model with code_range_start and code_range_end exists
- Base Account model structure is in place

### Instructions

1. **Open account.py model file**
   - Navigate to `apps/accounting/models/account.py`
   - Locate the Account model class definition

2. **Import necessary validators**
   - Import Django validators module
   - Import custom validators if available
   - Prepare for code range validation

3. **Add code field**
   - Use PositiveIntegerField
   - Set as required field (null=False, blank=False)
   - Add database index for query performance
   - Include help_text explaining the code numbering system

4. **Add code validation**
   - Implement clean method or validator
   - Ensure code falls within the account type's code range
   - Verify code is unique within the tenant
   - Check code format matches organizational standards

5. **Add code field to Meta class**
   - Include in unique_together with tenant
   - Consider adding to indexes for performance
   - Update ordering if code should be primary sort

6. **Document code numbering standards**
   - Add model-level comments explaining numbering scheme
   - Document standard code ranges by type
   - Include examples of proper code assignment

### Account Code Numbering System

```
┌──────────────────────────────────────────────────────────┐
│             Chart of Accounts Code Structure              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1000 - 1999    ASSETS                                    │
│    1000 - 1099    Current Assets (Headers end in 00)     │
│    1100 - 1199    Cash Accounts                           │
│    1200 - 1299    Bank Accounts                           │
│    1300 - 1399    Accounts Receivable                     │
│    1400 - 1499    Inventory                               │
│    1500 - 1999    Fixed Assets & Other Assets             │
│                                                           │
│  2000 - 2999    LIABILITIES                               │
│    2000 - 2099    Current Liabilities                     │
│    2100 - 2199    Accounts Payable                        │
│    2200 - 2299    Taxes Payable                           │
│    2300 - 2999    Long-term Liabilities                   │
│                                                           │
│  3000 - 3999    EQUITY                                    │
│    3000 - 3099    Capital                                 │
│    3100 - 3199    Retained Earnings                       │
│    3200 - 3999    Other Equity                            │
│                                                           │
│  4000 - 4999    REVENUE                                   │
│    4000 - 4099    Sales Revenue                           │
│    4100 - 4199    Service Revenue                         │
│    4200 - 4999    Other Revenue                           │
│                                                           │
│  5000 - 5999    COST OF GOODS SOLD                        │
│    5000 - 5099    Merchandise COGS                        │
│    5100 - 5999    Other Direct Costs                      │
│                                                           │
│  6000 - 9999    EXPENSES                                  │
│    6000 - 6999    Operating Expenses                      │
│    7000 - 7999    Administrative Expenses                 │
│    8000 - 8999    Other Expenses                          │
│    9000 - 9999    Non-operating Expenses                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Code Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | PositiveIntegerField | Numeric codes only, no negatives |
| Required | Yes | Every account must have unique code |
| Unique | Per tenant | Codes unique within tenant schema |
| Indexed | Yes | Fast lookups and sorting |
| Min Value | 1000 | Typically start at 1000 |
| Max Value | 9999 | Four-digit standard |
| Validation | Type code range | Must fall within type's allowed range |

### Code Validation Logic

```
Code Validation Flow
═══════════════════════════════════════════════

Input: Account Code = 1250
       Account Type = "Bank Account"

Step 1: Check Type Assignment
  ├─ Type code_range_start = 1200
  ├─ Type code_range_end = 1299
  └─ ✓ Type is assigned

Step 2: Validate Code Range
  ├─ Is 1250 >= 1200? ✓ Yes
  ├─ Is 1250 <= 1299? ✓ Yes
  └─ ✓ Code within valid range

Step 3: Check Uniqueness
  ├─ Query: Account.objects.filter(tenant=current_tenant, code=1250)
  ├─ Result: No existing account
  └─ ✓ Code is unique

Step 4: Format Validation
  ├─ Is numeric? ✓ Yes
  ├─ Is positive? ✓ Yes
  └─ ✓ Format valid

Result: ✅ Code 1250 is VALID
```

### Header Account Code Convention

| Account Type | Header Code | Pattern | Examples |
|--------------|-------------|---------|----------|
| Assets | 1000, 1100, 1200 | XX00 | Current Assets (1000), Cash (1100) |
| Liabilities | 2000, 2100 | XX00 | Current Liabilities (2000), AP (2100) |
| Equity | 3000, 3100 | XX00 | Capital (3000), Retained (3100) |
| Revenue | 4000, 4100 | XX00 | Sales (4000), Services (4100) |
| Expenses | 6000, 7000 | XX00 | Operating (6000), Admin (7000) |

**Convention:** Header (summary) accounts typically end in "00" to reserve detail codes from 01-99.

### Code Assignment Examples

#### Bank Account Setup
```
Code: 1200  →  Bank Accounts (Header)
  ├─ 1201  →  Commercial Bank - Main
  ├─ 1202  →  People's Bank - Payroll
  ├─ 1203  →  Sampath Bank - USD Account
  └─ 1204  →  HNB - Fixed Deposit
```

#### Accounts Receivable Setup
```
Code: 1300  →  Accounts Receivable (Header)
  ├─ 1301  →  Trade Receivables - Local
  ├─ 1302  →  Trade Receivables - Export
  ├─ 1303  →  Staff Advances
  └─ 1304  →  Other Receivables
```

#### Sri Lankan Context - VAT Accounts
```
Code: 2200  →  Taxes Payable (Header)
  ├─ 2201  →  VAT Output (15%)
  ├─ 2202  →  VAT Input (Claimable)
  ├─ 2203  →  WHT Payable
  ├─ 2204  →  NBT Payable
  └─ 2205  →  ESC Payable
```

### Code Validation Error Messages

| Error Type | Message | Resolution |
|-----------|---------|------------|
| Code not in type range | "Code {code} is outside the valid range {start}-{end} for account type {type}" | Choose code within type's range |
| Code already exists | "Account code {code} already exists for this tenant" | Select different unique code |
| Invalid format | "Account code must be a positive integer" | Enter numeric value |
| Out of bounds | "Account code must be between 1000 and 9999" | Use standard four-digit range |

### Sri Lankan Accounting Standards

#### Common Code Assignments (Sri Lanka)
| Code | Account | Usage |
|------|---------|-------|
| 1201 | Commercial Bank | Primary business account |
| 1301 | Trade Receivables | Customer AR |
| 2101 | Trade Payables | Supplier AP |
| 2201 | VAT Payable | 15% VAT on sales |
| 2202 | VAT Reclaimable | VAT on purchases |
| 2203 | WHT Payable | Withholding Tax |
| 4001 | Local Sales | Domestic revenue |
| 4002 | Export Sales | Foreign revenue |

### Expected Outcome
- Functional account code field with proper validation
- Unique codes per tenant enforced at database level
- Codes restricted to account type's valid range
- Fast code-based lookups via indexing
- Clear validation messages for users
- Foundation for hierarchical account organization

### Verification Checklist
- [ ] code field added as PositiveIntegerField
- [ ] Field set as required (null=False, blank=False)
- [ ] Database index created on code field
- [ ] Validation logic ensures code within type range
- [ ] unique_together constraint includes (tenant, code)
- [ ] Help text documents numbering system
- [ ] Error messages are clear and actionable
- [ ] Code field included in model's __str__ method
- [ ] Documentation includes code range examples

---

## Task 20: Add Account Name Field

### Overview
Add the account name field that provides a human-readable, descriptive label for each account. This is the primary display text users see throughout the system and should clearly indicate the account's purpose and function.

### Dependencies
- Task 18: Create Account Model
- Task 19: Add Account Code Field (for context)

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add name field**
   - Use CharField with max_length=200
   - Set as required field (null=False, blank=False)
   - Add database index for search and filtering
   - Include help_text for naming guidelines

3. **Add name validation**
   - Implement clean method to validate name format
   - Check for minimum length (e.g., at least 2 characters)
   - Trim leading/trailing whitespace
   - Consider disallowing special characters if needed

4. **Configure search capabilities**
   - Ensure name field is searchable in admin
   - Add to model's search_fields if using Django admin
   - Consider case-insensitive search support

5. **Update __str__ method**
   - Include both code and name in string representation
   - Format as "Code - Name" (e.g., "1201 - Commercial Bank")
   - This improves clarity in dropdowns and admin

6. **Document naming conventions**
   - Add comments explaining naming best practices
   - Include examples of good account names
   - Note multi-language considerations for Sri Lanka

### Account Name Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | CharField | Text-based descriptive name |
| Max Length | 200 characters | Adequate for descriptive names |
| Required | Yes | Every account must have name |
| Indexed | Yes | Fast search and filtering |
| Case-Sensitive | No (for searches) | Flexible user input |
| Trimming | Auto-trim spaces | Clean data entry |

### Account Name Best Practices

```
┌──────────────────────────────────────────────────────────┐
│              Account Naming Best Practices                │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ✓ DO:                                                    │
│    • Be specific and descriptive                          │
│    • Use consistent terminology                           │
│    • Include institution names for banks                  │
│    • Specify currency for foreign accounts                │
│    • Use clear abbreviations when needed                  │
│                                                           │
│  ✗ DON'T:                                                 │
│    • Use vague names like "Account 1"                     │
│    • Include code in name (code is separate field)        │
│    • Use overly long names (keep under 50 chars ideal)    │
│    • Mix languages within single name                     │
│    • Use special symbols unless necessary                 │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Naming Convention Examples

#### Good Account Names
| Code | Good Name | Why Good |
|------|-----------|----------|
| 1201 | Commercial Bank - Main Account | Specific, identifies institution and purpose |
| 1301 | Trade Receivables - Local Customers | Clear scope and category |
| 1401 | Finished Goods Inventory | Specific inventory type |
| 2201 | VAT Payable (15%) | Includes rate for clarity |
| 4001 | Product Sales - Sri Lanka | Geographic specificity |
| 6001 | Salaries and Wages - Permanent Staff | Detailed expense category |

#### Poor Account Names (Avoid)
| Code | Poor Name | Problem | Better Alternative |
|------|-----------|---------|-------------------|
| 1201 | 1201 - Bank | Code in name | "Commercial Bank - Main" |
| 1301 | AR | Too vague | "Trade Receivables - Local" |
| 1401 | Stuff | Unprofessional | "Inventory - Raw Materials" |
| 2201 | VAT | Lacks specificity | "VAT Payable (15%)" |
| 4001 | Money In | Informal | "Product Sales Revenue" |

### Multi-Language Support (Sri Lankan Context)

#### English Names (Standard)
```
1100  →  Cash and Cash Equivalents
1200  →  Bank Accounts
1300  →  Accounts Receivable
2100  →  Accounts Payable
2200  →  Taxes Payable
```

#### Sinhala Names (Optional)
```
1100  →  මුදල් සහ මුදල් සමාන (Cash and Cash Equivalents)
1200  →  බැංකු ගිණුම් (Bank Accounts)
1300  →  ලැබිය යුතු ගිණුම් (Accounts Receivable)
```

#### Tamil Names (Optional)
```
1100  →  பணம் மற்றும் பண சமானங்கள் (Cash and Cash Equivalents)
1200  →  வங்கி கணக்குகள் (Bank Accounts)
1300  →  பெறத்தக்க கணக்குகள் (Accounts Receivable)
```

**Note:** For multi-language support, consider using a separate translation table or JSON field rather than storing translations in the name field itself.

### Industry-Specific Naming

#### Retail Business
| Code | Account Name |
|------|-------------|
| 1401 | Finished Goods - Electronics |
| 1402 | Finished Goods - Clothing |
| 1403 | Finished Goods - Home Appliances |
| 4001 | Walk-in Sales Revenue |
| 4002 | Online Sales Revenue |

#### Service Business
| Code | Account Name |
|------|-------------|
| 4101 | Consulting Services Revenue |
| 4102 | Training Services Revenue |
| 4103 | Maintenance Services Revenue |
| 6101 | Professional Fees Expense |
| 6102 | Travel and Transportation |

#### Manufacturing
| Code | Account Name |
|------|-------------|
| 1411 | Raw Materials Inventory |
| 1412 | Work in Progress Inventory |
| 1413 | Finished Goods Inventory |
| 5001 | Direct Materials Used |
| 5002 | Direct Labor Cost |

### Bank Account Naming (Sri Lankan Banks)

| Code | Account Name | Bank |
|------|-------------|------|
| 1201 | Commercial Bank - Main Current | Commercial Bank |
| 1202 | People's Bank - Payroll Account | People's Bank |
| 1203 | Sampath Bank - USD Account | Sampath Bank |
| 1204 | HNB - Fixed Deposit | Hatton National Bank |
| 1205 | DFCC - Loan Account | DFCC Bank |
| 1206 | NDB - Import LC Account | National Development Bank |

### Name Length Guidelines

| Length | Category | Recommendation |
|--------|----------|----------------|
| < 20 chars | Too short | May lack clarity, acceptable for simple accounts |
| 20-50 chars | Ideal | Clear and concise |
| 50-100 chars | Acceptable | Still readable in most UI contexts |
| 100-200 chars | Long | Use only when detail is necessary |
| > 200 chars | Too long | Consider shorter name, use description field |

### Display Considerations

#### Dropdown Display (Combined with Code)
```
Select Account:
┌────────────────────────────────────────┐
│ 1100 - Cash on Hand                    │
│ 1201 - Commercial Bank - Main          │
│ 1202 - People's Bank - Payroll         │
│ 1301 - Trade Receivables - Local       │
│ 2101 - Trade Payables - Suppliers      │
└────────────────────────────────────────┘
```

#### Report Display
```
TRIAL BALANCE
═══════════════════════════════════════════════════════════
Code    Account Name                          Debit    Credit
────────────────────────────────────────────────────────────
1100    Cash on Hand                       50,000         -
1201    Commercial Bank - Main            250,000         -
1301    Trade Receivables - Local         180,000         -
2101    Trade Payables - Suppliers              -   120,000
═══════════════════════════════════════════════════════════
```

### Expected Outcome
- Clear, descriptive account names
- Consistent naming conventions across chart
- Searchable account names
- User-friendly account selection
- Professional financial reporting
- Support for multi-language contexts

### Verification Checklist
- [ ] name field added as CharField(max_length=200)
- [ ] Field set as required (null=False, blank=False)
- [ ] Database index created on name field
- [ ] Validation trims whitespace
- [ ] __str__ method returns "code - name" format
- [ ] Help text provides naming guidelines
- [ ] Admin interface includes name in search_fields
- [ ] Name length is adequate for descriptive labels
- [ ] Documentation includes naming best practices

---

## Task 21: Add Account Type FK

### Overview
Add a foreign key relationship to the AccountTypeConfig model, establishing the account's classification as Asset, Liability, Equity, Revenue, or Expense. This relationship is fundamental for financial reporting, account categorization, and validation of account codes.

### Dependencies
- Task 18: Create Account Model
- Group A: AccountTypeConfig model fully implemented
- Task 19: Add Account Code Field (for code range validation)

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Import AccountTypeConfig model**
   - Add import statement for AccountTypeConfig
   - Verify model is accessible from current module

3. **Add account_type field**
   - Use ForeignKey to AccountTypeConfig
   - Set related_name='accounts' for reverse lookups
   - Set on_delete=PROTECT to prevent type deletion if accounts exist
   - Mark as required (null=False)
   - Add database index for query performance

4. **Add type validation in clean method**
   - Validate account code falls within type's code range
   - Check code_range_start <= code <= code_range_end
   - Raise ValidationError if code outside range
   - Include clear error message

5. **Consider adding type-based properties**
   - Add property methods for common type checks
   - Examples: is_asset, is_liability, is_revenue
   - Makes code more readable

6. **Update model documentation**
   - Document relationship to AccountTypeConfig
   - Explain code range validation
   - Include examples of type-based filtering

### Account Type Foreign Key Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | ForeignKey | Links to AccountTypeConfig |
| Related Model | AccountTypeConfig | Account type definition |
| Related Name | 'accounts' | Reverse relation from type to accounts |
| On Delete | PROTECT | Prevent type deletion if accounts exist |
| Required | Yes | Every account must have type |
| Indexed | Yes | Fast filtering by type |

### Account Type Relationship Diagram

```
┌──────────────────────────┐         1:N         ┌──────────────────────┐
│   AccountTypeConfig      │◄────────────────────│      Account         │
│                          │                     │                      │
│  - type_code (1-6)       │                     │  - code (1000-9999)  │
│  - name (Asset, etc)     │                     │  - name              │
│  - code_range_start      │                     │  - account_type (FK) │
│  - code_range_end        │                     │  - parent            │
│  - normal_balance        │                     │  - is_header         │
│  - category              │                     │  ...                 │
│                          │                     │                      │
└──────────────────────────┘                     └──────────────────────┘
         │                                                │
         │ One AccountTypeConfig                         │ Many Accounts
         │ (e.g., "Asset")                               │ (1100, 1200, 1300...)
         │                                               │
         └───────────────────────────────────────────────┘
```

### Type-Based Account Grouping

```
AccountTypeConfig: ASSET (Type Code: 1)
├── Code Range: 1000-1999
├── Normal Balance: DEBIT
└── Accounts:
    ├── 1100 - Cash and Cash Equivalents
    ├── 1201 - Commercial Bank - Main
    ├── 1202 - People's Bank - Payroll
    ├── 1301 - Trade Receivables - Local
    ├── 1401 - Finished Goods Inventory
    └── 1501 - Office Equipment

AccountTypeConfig: LIABILITY (Type Code: 2)
├── Code Range: 2000-2999
├── Normal Balance: CREDIT
└── Accounts:
    ├── 2101 - Trade Payables - Suppliers
    ├── 2201 - VAT Payable (15%)
    ├── 2202 - VAT Reclaimable
    └── 2301 - Bank Loan - Commercial Bank

AccountTypeConfig: REVENUE (Type Code: 4)
├── Code Range: 4000-4999
├── Normal Balance: CREDIT
└── Accounts:
    ├── 4001 - Product Sales - Local
    ├── 4002 - Product Sales - Export
    └── 4101 - Service Revenue
```

### Code Range Validation Logic

```
Validation Process
═══════════════════════════════════════════════════════════

User Input:
├─ account_type: Asset (code_range: 1000-1999)
└─ code: 1250

Step 1: Fetch Type's Code Range
  ├─ type.code_range_start = 1000
  └─ type.code_range_end = 1999

Step 2: Validate Code Falls Within Range
  ├─ Check: 1250 >= 1000 ✓
  └─ Check: 1250 <= 1999 ✓

Result: ✅ VALID

---

Invalid Example:
├─ account_type: Asset (code_range: 1000-1999)
└─ code: 2250  ← This is in LIABILITY range!

Step 1: Fetch Type's Code Range
  ├─ type.code_range_start = 1000
  └─ type.code_range_end = 1999

Step 2: Validate Code Falls Within Range
  ├─ Check: 2250 >= 1000 ✓
  └─ Check: 2250 <= 1999 ✗ FAIL!

Result: ❌ INVALID
Error: "Account code 2250 is outside the valid range 1000-1999 for type Asset"
```

### Type-Based Helper Properties

#### Implementation Pattern
```
Property Methods (pseudo-code):

@property
def is_asset():
    return account_type.type_code == 1

@property
def is_liability():
    return account_type.type_code == 2

@property
def is_equity():
    return account_type.type_code == 3

@property
def is_revenue():
    return account_type.type_code == 4

@property  
def is_expense():
    return account_type.type_code in [5, 6]

@property
def normal_balance():
    return account_type.normal_balance
```

#### Usage Examples
```
Usage in Application Code:

# Check account type
if account.is_asset:
    # Asset-specific logic

# Get normal balance
if account.normal_balance == 'DEBIT':
    # Debit balance account

# Filter by type
assets = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=1
)

revenue_accounts = Account.objects.filter(
    tenant=tenant,
    account_type__category='REVENUE'
)
```

### On Delete Protection

```
Protection Scenario
═══════════════════════════════════════════════════════════

Attempt to Delete AccountTypeConfig:
└─ AccountTypeConfig: ASSET
   └─ Has 150 accounts linked

Database Constraint:
├─ on_delete=PROTECT
└─ Prevents deletion

Result:
❌ ProtectedError: Cannot delete AccountTypeConfig 'ASSET' 
   because it has 150 related Account objects.

Resolution:
1. Reassign all accounts to different type (not recommended)
2. Keep the type (recommended - types are foundational)
```

**Rationale:** AccountTypeConfig defines fundamental accounting structure and should not be deleted once accounts exist.

### Type-Based Queries and Reporting

#### Balance Sheet Accounts
```
Query for Balance Sheet Components:

# Assets
assets = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=1
)

# Liabilities  
liabilities = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=2
)

# Equity
equity = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=3
)
```

#### Income Statement Accounts
```
Query for Income Statement Components:

# Revenue
revenue = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=4
)

# Cost of Goods Sold
cogs = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=5
)

# Expenses
expenses = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=6
)
```

### Type-Based Business Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| Code Range Validation | Account code must be within type's range | Model clean method |
| Type Immutability | System accounts cannot change type | Admin/form validation |
| Balance Sheet Formula | Assets = Liabilities + Equity | Reporting validation |
| Income Statement Formula | Net Income = Revenue - COGS - Expenses | Reporting calculation |
| Normal Balance | Debits/credits follow type's normal balance | Transaction posting |

### Sri Lankan Accounting Context

#### Common Type Distributions
| Type | Typical Count | Examples |
|------|--------------|----------|
| Asset | 30-50 accounts | Cash, Banks, AR, Inventory, Fixed Assets |
| Liability | 15-25 accounts | AP, VAT, WHT, NBT, Loans |
| Equity | 5-10 accounts | Capital, Retained Earnings, Drawings |
| Revenue | 10-20 accounts | Sales, Services, Other Income |
| COGS | 5-10 accounts | Purchases, Direct Costs |
| Expense | 40-80 accounts | Salaries, Rent, Utilities, etc. |

### Expected Outcome
- Proper foreign key relationship to AccountTypeConfig
- Account type classification enforced
- Code range validation based on type
- Protected AccountTypeConfig from accidental deletion
- Type-based queries and filtering enabled
- Foundation for financial statement generation
- Support for accounting equation validation

### Verification Checklist
- [ ] account_type ForeignKey added to AccountTypeConfig
- [ ] related_name='accounts' configured
- [ ] on_delete=PROTECT set
- [ ] Field marked as required (null=False)
- [ ] Database index created
- [ ] Code range validation implemented in clean method
- [ ] Clear validation error messages
- [ ] Helper properties for type checking added (optional)
- [ ] Admin interface shows account type
- [ ] Documentation includes type-based examples

---

## Task 22: Add Account Category

### Overview
Add an account category field that provides additional classification within each account type. Categories offer more granular grouping of accounts for reporting and analysis purposes, beyond the basic type classification (e.g., within Assets: Current Assets vs. Fixed Assets).

### Dependencies
- Task 18: Create Account Model
- Task 21: Add Account Type FK

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Define AccountCategory enum**
   - Create choices class or tuple for categories
   - Include categories for each account type
   - Follow Django's choices pattern

3. **Add category field**
   - Use CharField with choices=AccountCategory
   - Set max_length=50
   - Optional field (blank=True, null=True) OR required based on design
   - Add database index for filtering

4. **Document category meanings**
   - Add comprehensive comments explaining each category
   - Show which categories apply to which types
   - Include reporting implications

5. **Add category validation**
   - Optionally validate category matches account type
   - Ensure category selection makes sense for type
   - Provide clear error messages

6. **Consider category-based helpers**
   - Add properties for common checks (is_current_asset, is_operating_expense)
   - Simplifies business logic in application code

### Account Category Enumeration

```
┌──────────────────────────────────────────────────────────┐
│              Account Category Definitions                 │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ASSET CATEGORIES:                                        │
│    • CURRENT_ASSET           - Cash, AR, Inventory        │
│    • FIXED_ASSET             - Property, Equipment        │
│    • INTANGIBLE_ASSET        - Goodwill, Patents          │
│    • OTHER_ASSET             - Long-term investments      │
│                                                           │
│  LIABILITY CATEGORIES:                                    │
│    • CURRENT_LIABILITY       - AP, Short-term debt        │
│    • LONG_TERM_LIABILITY     - Loans, Bonds               │
│    • OTHER_LIABILITY         - Deferred revenue           │
│                                                           │
│  EQUITY CATEGORIES:                                       │
│    • CAPITAL                 - Owner's capital            │
│    • RETAINED_EARNINGS       - Accumulated profits        │
│    • DRAWINGS                - Owner withdrawals          │
│                                                           │
│  REVENUE CATEGORIES:                                      │
│    • OPERATING_REVENUE       - Core business sales        │
│    • NON_OPERATING_REVENUE   - Interest, gains            │
│                                                           │
│  EXPENSE CATEGORIES:                                      │
│    • COST_OF_GOODS_SOLD      - Direct costs               │
│    • OPERATING_EXPENSE       - Selling, admin             │
│    • NON_OPERATING_EXPENSE   - Interest, losses           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Category Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | CharField | Text-based category code |
| Max Length | 50 characters | Accommodates category names |
| Choices | AccountCategory enum | Limited valid options |
| Required | Configurable | May be optional or required |
| Indexed | Yes | Fast category-based filtering |
| Default | None or context-specific | May infer from type |

### Category Mapping by Type

```
Type-Category Relationships
═══════════════════════════════════════════════════════════

ASSET (Type 1)
├── CURRENT_ASSET
│   ├── 1100 - Cash on Hand
│   ├── 1201 - Commercial Bank
│   ├── 1301 - Trade Receivables
│   └── 1401 - Inventory
├── FIXED_ASSET
│   ├── 1501 - Office Equipment
│   ├── 1502 - Furniture & Fixtures
│   └── 1503 - Motor Vehicles
└── OTHER_ASSET
    └── 1601 - Long-term Investments

LIABILITY (Type 2)
├── CURRENT_LIABILITY
│   ├── 2101 - Trade Payables
│   ├── 2201 - VAT Payable
│   └── 2202 - WHT Payable
└── LONG_TERM_LIABILITY
    └── 2301 - Bank Loan

EQUITY (Type 3)
├── CAPITAL
│   └── 3001 - Owner's Capital
└── RETAINED_EARNINGS
    └── 3101 - Retained Earnings

REVENUE (Type 4)
├── OPERATING_REVENUE
│   ├── 4001 - Product Sales
│   └── 4002 - Service Revenue
└── NON_OPERATING_REVENUE
    └── 4901 - Interest Income

EXPENSE (Type 5-6)
├── COST_OF_GOODS_SOLD
│   └── 5001 - Cost of Goods Sold
├── OPERATING_EXPENSE
│   ├── 6001 - Salaries and Wages
│   ├── 6002 - Rent Expense
│   └── 6003 - Utilities
└── NON_OPERATING_EXPENSE
    └── 8001 - Interest Expense
```

### Category-Based Financial Reporting

#### Balance Sheet Presentation
```
BALANCE SHEET
As at December 31, 2026
═══════════════════════════════════════════════════════════

ASSETS
  Current Assets                           Category Filter
  ├── Cash on Hand                  500,000  CURRENT_ASSET
  ├── Commercial Bank               850,000  CURRENT_ASSET
  ├── Trade Receivables             400,000  CURRENT_ASSET
  └── Inventory                     650,000  CURRENT_ASSET
  Total Current Assets            2,400,000
  
  Fixed Assets                             Category Filter
  ├── Office Equipment              300,000  FIXED_ASSET
  ├── Furniture & Fixtures          200,000  FIXED_ASSET
  └── Motor Vehicles              1,500,000  FIXED_ASSET
  Total Fixed Assets              2,000,000
  
  Total Assets                    4,400,000
  
LIABILITIES
  Current Liabilities                      Category Filter
  ├── Trade Payables                300,000  CURRENT_LIABILITY
  ├── VAT Payable                    75,000  CURRENT_LIABILITY
  └── WHT Payable                    25,000  CURRENT_LIABILITY
  Total Current Liabilities         400,000
  
  Long-term Liabilities                    Category Filter
  └── Bank Loan                   1,000,000  LONG_TERM_LIABILITY
  Total Long-term Liabilities     1,000,000
  
  Total Liabilities               1,400,000
  
EQUITY                                     Category Filter
  ├── Owner's Capital             2,500,000  CAPITAL
  └── Retained Earnings             500,000  RETAINED_EARNINGS
  Total Equity                    3,000,000
  
Total Liabilities + Equity        4,400,000
```

#### Income Statement Presentation
```
INCOME STATEMENT
For the Year Ended December 31, 2026
═══════════════════════════════════════════════════════════

REVENUE                                    Category Filter
├── Product Sales               5,000,000  OPERATING_REVENUE
├── Service Revenue               500,000  OPERATING_REVENUE
└── Interest Income                10,000  NON_OPERATING_REVENUE
Total Revenue                   5,510,000

COST OF GOODS SOLD                        Category Filter
└── Cost of Goods Sold          3,000,000  COST_OF_GOODS_SOLD

GROSS PROFIT                    2,510,000

OPERATING EXPENSES                        Category Filter
├── Salaries and Wages            800,000  OPERATING_EXPENSE
├── Rent Expense                  240,000  OPERATING_EXPENSE
├── Utilities                      60,000  OPERATING_EXPENSE
└── Other Operating Expenses      300,000  OPERATING_EXPENSE
Total Operating Expenses        1,400,000

OPERATING INCOME                1,110,000

OTHER EXPENSES                            Category Filter
└── Interest Expense               50,000  NON_OPERATING_EXPENSE

NET INCOME                      1,060,000
```

### Category Validation Rules

| Rule | Description | Implementation |
|------|-------------|----------------|
| Type-Category Match | Category must be valid for account type | Validation in clean method |
| Current Asset Classification | Cash, AR, Inventory < 1 year | Category assignment guideline |
| Fixed Asset Classification | Long-term tangible assets | Category assignment guideline |
| Operating vs Non-Operating | Core business vs incidental | Category assignment guideline |

### Sri Lankan Accounting Categories

#### Current Assets (Common in Sri Lanka)
| Account | Category | Sri Lankan Context |
|---------|----------|-------------------|
| Commercial Bank - LKR | CURRENT_ASSET | Local currency account |
| Commercial Bank - USD | CURRENT_ASSET | Foreign currency account |
| Trade Receivables - Local | CURRENT_ASSET | Domestic customers |
| Trade Receivables - Export | CURRENT_ASSET | Foreign customers |
| VAT Reclaimable | CURRENT_ASSET | Input VAT to recover |

#### Current Liabilities (Common in Sri Lanka)
| Account | Category | Sri Lankan Context |
|---------|----------|-------------------|
| Trade Payables | CURRENT_LIABILITY | Supplier obligations |
| VAT Payable (15%) | CURRENT_LIABILITY | Output VAT to remit |
| WHT Payable | CURRENT_LIABILITY | Withholding tax to IRD |
| NBT Payable | CURRENT_LIABILITY | Nation Building Tax |
| ESC Payable | CURRENT_LIABILITY | Economic Service Charge |

### Category-Based Business Intelligence

#### Working Capital Analysis
```
Query: Current Assets vs Current Liabilities

current_assets = Account.objects.filter(
    tenant=tenant,
    category='CURRENT_ASSET'
).aggregate(total=Sum('current_balance'))

current_liabilities = Account.objects.filter(
    tenant=tenant,
    category='CURRENT_LIABILITY'
).aggregate(total=Sum('current_balance'))

working_capital = current_assets['total'] - current_liabilities['total']
current_ratio = current_assets['total'] / current_liabilities['total']
```

#### Fixed Asset Management
```
Query: All Fixed Assets for Depreciation

fixed_assets = Account.objects.filter(
    tenant=tenant,
    category='FIXED_ASSET',
    is_header=False
)

# Calculate depreciation for each asset
```

### Optional vs Required Category

#### Design Option 1: Optional Category
- **Pros:** Flexible, not all accounts need categorization
- **Cons:** May lead to inconsistent categorization
- **Use Case:** Simple businesses, minimal reporting needs

#### Design Option 2: Required Category
- **Pros:** Ensures complete categorization, better reporting
- **Cons:** Forces categorization decision for every account
- **Use Case:** Professional businesses, detailed financial analysis

**Recommendation:** Make category required for better reporting consistency.

### Expected Outcome
- Granular account classification beyond type
- Support for detailed financial statement presentation
- Category-based filtering and reporting
- Balance sheet sub-totaling (current vs fixed)
- Income statement segmentation (operating vs non-operating)
- Working capital and ratio analysis support

### Verification Checklist
- [ ] AccountCategory choices defined
- [ ] category field added as CharField with choices
- [ ] Field configured as optional or required (design decision)
- [ ] Database index created on category
- [ ] Categories cover all necessary classifications
- [ ] Type-category validation implemented (optional)
- [ ] Admin interface includes category filter
- [ ] Documentation explains each category
- [ ] Examples show category usage in reports

---

## Task 23: Add Account Status

### Overview
Add an account status field to control the lifecycle and usability of accounts within the system. Status determines whether an account is active for transactions, temporarily disabled, or archived for historical purposes only. This provides essential account lifecycle management.

### Dependencies
- Task 18: Create Account Model
- Basic account fields implemented

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Define AccountStatus enum**
   - Create choices class or tuple for status values
   - Include: ACTIVE, INACTIVE, ARCHIVED
   - Follow Django's choices pattern

3. **Add status field**
   - Use CharField with choices=AccountStatus
   - Set max_length=20
   - Default to 'ACTIVE'
   - Mark as required (null=False, blank=False)
   - Add database index for filtering

4. **Document status meanings**
   - Add comprehensive docstring explaining each status
   - Define rules for status transitions
   - Explain business impact of each status

5. **Add status validation**
   - Implement business rules for status changes
   - Prevent changing status of system accounts (optional)
   - Validate no active transactions for INACTIVE/ARCHIVED

6. **Add status-based query managers**
   - Consider custom manager for active accounts
   - Add convenience methods for status filtering

### Account Status Enumeration

```
┌──────────────────────────────────────────────────────────┐
│              Account Status Definitions                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ACTIVE                                                   │
│    • Account is fully operational                         │
│    • Can receive transactions                             │
│    • Appears in account selection dropdowns               │
│    • Included in all reports                              │
│    • Default status for new accounts                      │
│                                                           │
│  INACTIVE                                                 │
│    • Account temporarily disabled                         │
│    • Cannot receive new transactions                      │
│    • Hidden from dropdowns (with option to show)          │
│    • Still appears in reports if has balance/history      │
│    • Can be reactivated                                   │
│                                                           │
│  ARCHIVED                                                 │
│    • Account permanently closed                           │
│    • Cannot receive transactions                          │
│    • Hidden from standard views                           │
│    • Only appears in historical reports                   │
│    • Typically has zero balance                           │
│    • Should not be reactivated (create new account)       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Status Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | CharField | Text-based status code |
| Max Length | 20 characters | Accommodates status names |
| Choices | AccountStatus enum | Limited valid options |
| Required | Yes | Every account must have status |
| Default | 'ACTIVE' | New accounts are active |
| Indexed | Yes | Fast filtering by status |

### Account Status Lifecycle

```
Account Status State Machine
═══════════════════════════════════════════════════════════

        ┌─────────────────┐
        │   NEW ACCOUNT   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
   ┌───►│     ACTIVE      │◄────┐
   │    └────────┬────────┘     │
   │             │               │
   │  Reactivate │ Deactivate   │ Reactivate
   │             │               │
   │             ▼               │
   │    ┌─────────────────┐     │
   └────│    INACTIVE     │─────┘
        └────────┬────────┘
                 │
                 │ Archive
                 │ (one-way)
                 ▼
        ┌─────────────────┐
        │    ARCHIVED     │
        └─────────────────┘
                 │
                 ▼
        (Permanent state,
         no reactivation)
```

### Status Transition Rules

| From Status | To Status | Allowed? | Conditions | Common Use Case |
|------------|-----------|----------|------------|-----------------|
| ACTIVE | INACTIVE | ✅ Yes | Any time | Temporarily stop using account |
| ACTIVE | ARCHIVED | ✅ Yes | Balance should be zero | Close account permanently |
| INACTIVE | ACTIVE | ✅ Yes | Any time | Resume using account |
| INACTIVE | ARCHIVED | ✅ Yes | Balance should be zero | Close unused account |
| ARCHIVED | ACTIVE | ❌ No | Not allowed | Create new account instead |
| ARCHIVED | INACTIVE | ❌ No | Not allowed | Archived is permanent |

### Status-Based Transaction Rules

```
Transaction Posting Rules by Status
═══════════════════════════════════════════════════════════

ACTIVE Account:
├─ Create new transactions: ✅ ALLOWED
├─ View transactions: ✅ ALLOWED
├─ Edit existing transactions: ✅ ALLOWED
├─ Appears in dropdowns: ✅ YES
└─ Included in reports: ✅ YES

INACTIVE Account:
├─ Create new transactions: ❌ BLOCKED
│  └─ Error: "Cannot post to inactive account"
├─ View transactions: ✅ ALLOWED
├─ Edit existing transactions: ⚠️ CONDITIONAL (existing only)
├─ Appears in dropdowns: ⚠️ OPTIONAL (with filter)
└─ Included in reports: ✅ YES (if has balance/history)

ARCHIVED Account:
├─ Create new transactions: ❌ BLOCKED
│  └─ Error: "Cannot post to archived account"
├─ View transactions: ✅ ALLOWED (historical)
├─ Edit existing transactions: ❌ BLOCKED
├─ Appears in dropdowns: ❌ NO
└─ Included in reports: ⚠️ HISTORICAL ONLY
```

### Status Use Cases

#### ACTIVE Status Scenarios
| Scenario | Description |
|----------|-------------|
| Normal Operations | Day-to-day business accounts in use |
| New Account | Just created and ready for use |
| Reactivated Account | Previously inactive, now back in use |

#### INACTIVE Status Scenarios
| Scenario | Description |
|----------|-------------|
| Seasonal Business | Account used only during specific seasons |
| Pending Closure | Account being phased out, clearing remaining balance |
| Temporary Suspension | Temporarily not in use, may reactivate |
| Bank Account Frozen | Bank account temporarily inaccessible |
| Pending Investigation | Account under review, paused temporarily |

#### ARCHIVED Status Scenarios
| Scenario | Description |
|----------|-------------|
| Closed Bank Account | Bank account permanently closed |
| Discontinued Product | Inventory account for product no longer sold |
| Completed Project | Project-specific account, project finished |
| Business Restructure | Old accounts replaced by new structure |
| Historical Record | Keep for audit trail, no future use |

### Status-Based Queries

#### Active Accounts Only (Default View)
```
Query Pattern:

accounts = Account.objects.filter(
    tenant=tenant,
    status='ACTIVE'
)

# Or with custom manager:
accounts = Account.active.filter(tenant=tenant)
```

#### Include Inactive Accounts (Admin View)
```
Query Pattern:

accounts = Account.objects.filter(
    tenant=tenant,
    status__in=['ACTIVE', 'INACTIVE']
)
```

#### All Accounts Including Archived (Audit View)
```
Query Pattern:

accounts = Account.objects.filter(
    tenant=tenant
)
# No status filter - includes all statuses
```

### Status Indicators in UI

#### Dropdown Display
```
Select Account:
┌────────────────────────────────────────┐
│ 1201 - Commercial Bank [ACTIVE]        │
│ 1202 - People's Bank [ACTIVE]          │
│ 1203 - Sampath Bank [INACTIVE]         │ ← Grayed out
│ Show inactive accounts ☐               │
└────────────────────────────────────────┘
```

#### Account List View
```
CHART OF ACCOUNTS
═══════════════════════════════════════════════════════════
Code    Account Name                    Status     Balance
───────────────────────────────────────────────────────────
1201    Commercial Bank - Main          ACTIVE    250,000
1202    People's Bank - Payroll         ACTIVE    100,000
1203    Sampath Bank - Old Account      INACTIVE   50,000
1204    HNB - Closed in 2025           ARCHIVED        0
═══════════════════════════════════════════════════════════
```

### Status Validation Examples

#### Preventing Transaction to Inactive Account
```
Validation Flow:

User attempts to post transaction to account 1203 (INACTIVE)

Step 1: Validate Account Status
  ├─ account.status = 'INACTIVE'
  └─ ❌ VALIDATION FAIL

Error Message:
"Cannot post transaction to inactive account '1203 - Sampath Bank'.
Please reactivate the account or choose a different account."
```

#### Preventing Archive with Non-Zero Balance
```
Validation Flow:

User attempts to archive account 1201 with balance 250,000

Step 1: Check Balance
  ├─ account.current_balance = 250,000
  └─ ❌ VALIDATION FAIL

Error Message:
"Cannot archive account '1201 - Commercial Bank' with non-zero balance.
Current balance: Rs. 250,000. Please transfer the balance first."
```

### Sri Lankan Context Examples

#### Closed Bank Account
```
Account: 1205 - DFCC Bank - Current Account
Status: ARCHIVED
Reason: Company switched to Commercial Bank
Balance: 0.00
Archived Date: March 15, 2026
```

#### Seasonal Account
```
Account: 4105 - Festival Season Sales
Status: INACTIVE (April-November)
Status: ACTIVE (December-March during peak season)
Reason: Tracks sales during festive period only
```

#### Suspended Due to Audit
```
Account: 1350 - Receivables - Under Investigation
Status: INACTIVE
Reason: Under audit review, temporarily paused
Expected Reactivation: After audit completion
```

### Custom Manager for Active Accounts

```
Custom Manager Pattern (pseudo-code):

class ActiveAccountManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='ACTIVE')

# In Account model:
objects = models.Manager()  # Default manager
active = ActiveAccountManager()  # Active accounts only

# Usage:
Account.active.filter(tenant=tenant)  # Only active accounts
Account.objects.filter(tenant=tenant)  # All accounts
```

### Expected Outcome
- Complete account lifecycle management
- Transaction control based on status
- Clear status transition rules
- Status-based filtering in UI
- Audit trail preservation via archiving
- Prevention of accidental transactions to inactive accounts
- Support for temporary and permanent account closure

### Verification Checklist
- [ ] AccountStatus choices defined (ACTIVE, INACTIVE, ARCHIVED)
- [ ] status field added as CharField with choices
- [ ] Default status set to 'ACTIVE'
- [ ] Field marked as required (null=False)
- [ ] Database index created on status
- [ ] Status transition rules documented
- [ ] Validation prevents transactions to inactive/archived accounts
- [ ] Admin interface includes status filter
- [ ] UI shows status indicators
- [ ] Custom manager for active accounts (optional)

---

## Task 24: Add Account Description

### Overview
Add an optional description field to the Account model that allows users to store detailed notes, usage guidelines, and additional context about each account. This field serves as internal documentation helping users understand the account's purpose, when to use it, and any special considerations.

### Dependencies
- Task 18: Create Account Model
- Basic account fields implemented

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add description field**
   - Use TextField for unlimited text length
   - Set as optional (blank=True, null=True)
   - Add helpful help_text explaining usage
   - No database index needed (free-text field)

3. **Document description usage**
   - Add model-level comments explaining purpose
   - Provide examples of good descriptions
   - Explain difference between name and description

4. **Consider rich text support**
   - Decide if plain text or markdown supported
   - Document any formatting capabilities
   - Consider UI editor requirements

5. **Add description to admin**
   - Ensure description appears in admin forms
   - Consider using textarea widget for better UX
   - May display in read-only views

6. **Usage guidelines**
   - Document when description is necessary
   - Provide templates for common account types
   - Include multi-language considerations

### Description Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | TextField | Unlimited text length |
| Required | No (optional) | Not all accounts need description |
| Blank | True | Can be left empty |
| Null | True | Can be null in database |
| Help Text | Yes | Guide users on usage |
| Indexed | No | Free-text field, not for filtering |
| Format | Plain text or Markdown | Depends on implementation |

### Description vs Name

```
┌──────────────────────────────────────────────────────────┐
│            Name vs Description Comparison                 │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  NAME FIELD:                                              │
│    • Short identifier (< 50 chars recommended)            │
│    • Appears in dropdowns and reports                     │
│    • Should be concise and clear                          │
│    • Example: "Commercial Bank - Main Account"            │
│                                                           │
│  DESCRIPTION FIELD:                                       │
│    • Detailed explanation (unlimited length)              │
│    • Internal documentation                               │
│    • Usage guidelines and notes                           │
│    • Example: "This is the company's primary operating    │
│      bank account at Commercial Bank, Colombo 03 branch.  │
│      Used for all day-to-day receipts and payments.       │
│      Account number: 1234567890. Authorized signatories:  │
│      John Silva (MD), Sarah Fernando (Finance Manager)."  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Description Usage Scenarios

#### When Description is Beneficial

| Account Type | Need Description? | Why? |
|--------------|------------------|------|
| System Accounts | ⭐⭐⭐ High | Explain restrictions, automated behavior |
| Bank Accounts | ⭐⭐⭐ High | Account numbers, signatories, purpose |
| Tax Accounts | ⭐⭐⭐ High | Tax rates, filing requirements |
| Special Purpose | ⭐⭐⭐ High | Project accounts, grant accounts |
| Standard Accounts | ⭐ Low | Usually self-explanatory |
| Header Accounts | ⭐⭐ Medium | Summarize child accounts |

### Description Content Examples

#### Bank Account Description
```
Account: 1201 - Commercial Bank - Main Account
Description:

Primary operating bank account for daily transactions.

Bank Details:
- Bank: Commercial Bank of Ceylon PLC
- Branch: Colombo 03 (Galle Road Branch)
- Account Number: 1234567890
- Account Type: Current Account
- Currency: LKR

Authorized Signatories:
- John Silva (Managing Director) - Single signatory up to Rs. 500,000
- Sarah Fernando (Finance Manager) - Single signatory up to Rs. 100,000
- Joint signatory required above Rs. 500,000

Usage Guidelines:
- All supplier payments
- Customer receipts (cheques and bank transfers)
- Payroll transfers
- Utility bill payments
- Petty cash reimbursements

Note: Reconcile monthly by 5th of following month.
```

#### Tax Account Description
```
Account: 2201 - VAT Payable (15%)
Description:

Value Added Tax liability account for standard-rated sales.

Tax Details:
- Tax Type: VAT (Value Added Tax)
- Rate: 15% (as of January 2026)
- Tax Registration Number: 123456789V

When to Use:
- Record VAT on all sales invoices
- Standard rated goods and services only
- Zero-rated and exempt items use different accounts

Filing Requirements:
- Monthly filing via RAMIS portal
- Payment due 20th of following month
- File even if nil return

Related Accounts:
- 2202 - VAT Reclaimable (Input VAT)
- Net VAT = 2201 (Output) - 2202 (Input)

Reconciliation:
- Reconcile with VAT return before filing
- Verify against sales reports
```

#### System Account Description
```
Account: 1301 - Trade Receivables Control Account
Description:

⚠️ SYSTEM ACCOUNT - DO NOT POST DIRECTLY

This is an automatically managed control account. The balance is 
calculated from subsidiary customer ledgers.

Automated Behavior:
- Automatically updated when customer invoices are posted
- Automatically updated when customer payments are recorded
- Balance always equals sum of individual customer accounts

DO:
✓ Review balance for accuracy
✓ Reconcile with customer aging report
✓ Investigate discrepancies

DO NOT:
✗ Post journal entries directly to this account
✗ Manually adjust the balance
✗ Delete or deactivate this account

For customer-specific transactions, post to individual customer 
accounts, which will automatically update this control account.

Reconciliation Schedule: Weekly
Responsible: Accounts Receivable Manager
```

#### Project Account Description
```
Account: 1350 - Project Receivables - Highway Project
Description:

Receivables for the Colombo-Kandy Highway Construction Project.

Project Details:
- Project Code: CKHW-2026-001
- Client: Road Development Authority
- Contract Value: Rs. 500,000,000
- Duration: January 2026 - December 2027
- Project Manager: Eng. Nimal Perera

Billing Terms:
- Monthly progress billing
- 10% retention held until project completion
- 90-day payment terms
- Separate retention receivable account: 1351

Progress Payment Process:
1. Engineer certifies completed work
2. Invoice raised against this account
3. Customer payment received
4. Track aging closely (government payments can delay)

Project Completion:
- Transfer any outstanding balance to standard receivables
- Close account once all payments received
- Archive for future reference
```

#### Special Purpose Account Description
```
Account: 1420 - Inventory - Damaged Goods
Description:

Temporary holding account for damaged or defective inventory.

Purpose:
Track inventory that is damaged, defective, or pending return to 
suppliers. Items in this account are not available for sale.

Process Flow:
1. Damaged goods identified during receiving or inspection
2. Transfer from regular inventory to this account
3. Initiate return to supplier or write-off process
4. Clear account within 30 days

Authorized Actions:
- Warehouse Manager: Transfer items in
- Purchasing Manager: Approve supplier returns
- Finance Manager: Approve write-offs over Rs. 50,000

Monitoring:
- Review weekly
- Target: Keep balance below Rs. 100,000
- Investigate items older than 30 days

Write-off Threshold:
- Under Rs. 50,000: Finance Manager approval
- Over Rs. 50,000: Director approval required
```

### Description Templates by Account Type

#### Template: Bank Account
```
Bank Details:
- Bank: [Bank Name]
- Branch: [Branch Name and Location]
- Account Number: [Account Number]
- Account Type: [Current/Savings/Fixed Deposit]
- Currency: [LKR/USD/Other]

Authorized Signatories:
- [Name] ([Title]) - [Authority Level]

Usage Guidelines:
- [When to use this account]

Reconciliation: [Frequency]
```

#### Template: Expense Account
```
Purpose:
[What this expense category covers]

Includes:
- [Specific items included]

Excludes:
- [Items that belong to other accounts]

Budget: [Annual budget amount if applicable]
Approval Required: [Threshold for management approval]
```

#### Template: Revenue Account
```
Revenue Type:
[Description of revenue stream]

Recognition Criteria:
[When revenue is recognized]

Related Accounts:
- [Associated expense accounts]
- [Related receivable accounts]

Budget/Target: [Annual target if applicable]
```

### Multi-Language Support

#### English Description (Standard)
```
Description: Main operating bank account for daily business transactions.
```

#### Bilingual Description (Sri Lankan Context)
```
Description:

English:
Main operating bank account for daily business transactions.

Sinhala:
දෛනික ව්‍යාපාර ගනුදෙනු සඳහා ප්‍රධාන මෙහෙයුම් බැංකු ගිණුම.

Tamil:
தினசரி வணிக பரிவர்த்தனைகளுக்கான முதன்மை செயல்பாட்டு வங்கி கணக்கு.
```

**Note:** For production multi-language support, consider using Django's translation framework or separate translation models rather than embedding multiple languages in the description field.

### Markdown Support (Optional)

#### Plain Text
```
Description: 
Simple text description without formatting.
```

#### Markdown (If Supported)
```
Description:

# Primary Operating Account

This account is used for:
- Supplier payments
- Customer receipts
- **Important:** Requires dual signatory over Rs. 500,000

See [Treasury Policy](link) for details.
```

### Description Best Practices

```
┌──────────────────────────────────────────────────────────┐
│          Description Writing Best Practices               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ✓ DO:                                                    │
│    • Write clear, concise descriptions                    │
│    • Include account-specific details                     │
│    • List authorized signatories for bank accounts        │
│    • Document usage guidelines                            │
│    • Note restrictions or special rules                   │
│    • Include reconciliation requirements                  │
│    • Reference related accounts                           │
│    • Update when account purpose changes                  │
│                                                           │
│  ✗ DON'T:                                                 │
│    • Repeat information already in name field             │
│    • Use description as a transaction log                 │
│    • Include sensitive data (passwords, etc.)             │
│    • Write overly long essays (be concise)                │
│    • Leave outdated information                           │
│    • Use jargon without explanation                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Optional detailed documentation for each account
- Internal usage guidelines captured
- Bank account details recorded
- System account restrictions explained
- Project and special purpose accounts documented
- Better account understanding for all users
- Reduced training time for new staff
- Improved account usage consistency

### Verification Checklist
- [ ] description field added as TextField
- [ ] Field set as optional (blank=True, null=True)
- [ ] Help text explains purpose and usage
- [ ] Field appears in admin forms
- [ ] Textarea widget used for better UX
- [ ] Documentation includes example descriptions
- [ ] Templates provided for common account types
- [ ] Multi-language considerations documented
- [ ] Markdown support decision documented (if applicable)

---

## Summary

This document implemented the core identification and classification fields for the Account model:

### Completed Fields
- ✅ Account Code (Task 19) - Unique numeric identifier with type-based range validation
- ✅ Account Name (Task 20) - Human-readable descriptive label
- ✅ Account Type FK (Task 21) - Foreign key to AccountTypeConfig for type classification
- ✅ Account Category (Task 22) - Granular categorization (Current, Fixed, Operating, etc.)
- ✅ Account Status (Task 23) - Lifecycle management (Active, Inactive, Archived)
- ✅ Account Description (Task 24) - Optional detailed documentation and notes

### Key Achievements
1. **Unique Identification** - Code field with tenant-specific uniqueness
2. **Type Classification** - Proper FK relationship with code range validation
3. **Lifecycle Management** - Status field controlling account usability
4. **Enhanced Categorization** - Category field for detailed reporting
5. **User Clarity** - Name and description fields for understanding
6. **Sri Lankan Context** - Examples and patterns for local accounting practices

### Data Integrity Features
- Code uniqueness enforced per tenant
- Code range validation against account type
- Protected foreign key relationships (PROTECT on delete)
- Status-based transaction controls
- Clear validation error messages

### Next Steps
Proceed to [03_Tasks-25-28_Hierarchy-System-Fields.md](03_Tasks-25-28_Hierarchy-System-Fields.md) to implement the MPTT hierarchy system with parent relationships, tree configuration, and header/system account flags.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~950
