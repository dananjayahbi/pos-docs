# Tasks 07-12: AccountTypeConfig Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** A - Account Type Definitions  
> **Document:** 03 of 04  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-03-06_Account-Enums.md](02_Tasks-03-06_Account-Enums.md)
- **→ Next Document:** [04_Tasks-13-16_Migrations-Fixtures-Testing.md](04_Tasks-13-16_Migrations-Fixtures-Testing.md)

---

## Document Overview

This document covers the creation of the AccountTypeConfig model, which provides configuration and metadata for the five main account types (Asset, Liability, Equity, Revenue, Expense) in the double-entry bookkeeping system. The model defines code ranges, normal balances, display ordering, and descriptive information for each account type.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Create AccountTypeConfig Model | Medium | 30 min |
| 08 | Add Type Name Field | Low | 15 min |
| 09 | Add Type Normal Balance | Low | 15 min |
| 10 | Add Type Code Range | Medium | 25 min |
| 11 | Add Type Display Order | Low | 15 min |
| 12 | Add Type Description | Low | 15 min |

---

## Task 07: Create AccountTypeConfig Model

### Overview
Create the AccountTypeConfig model that serves as the central configuration for each of the five main account types in the Chart of Accounts. This model defines the foundational attributes, behaviors, and constraints for organizing financial accounts according to double-entry bookkeeping principles and international accounting standards.

### Dependencies
- Tasks 01-02: Accounting app created and registered
- Tasks 03-06: AccountType, AccountCategory, AccountStatus, and NormalBalance enums defined

### Purpose and Business Value

The AccountTypeConfig model serves several critical functions in the accounting system:

**System Organization**
- Defines the five fundamental account types that underpin all financial accounting
- Establishes consistent categorization for all accounts in the system
- Provides lookup configuration that rarely changes (system-level data)

**Code Range Management**
- Assigns unique numeric ranges to each account type (1xxx-5xxx)
- Prevents code collisions between different account types
- Enables logical grouping and sorting of accounts
- Supports standard accounting software conventions

**Financial Reporting**
- Controls display order in financial statements
- Ensures consistent presentation of Balance Sheet and Profit & Loss reports
- Defines normal balance side for proper debit/credit handling

**Multi-Tenant Considerations**
- May be stored in public schema if configuration is shared across all tenants
- Can be placed in tenant schema if clients require custom account type definitions
- Typically system-level data loaded via fixtures rather than user-created

### Instructions

1. **Create model file structure**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `account_type.py`
   - This file will contain AccountTypeConfig model definition

2. **Add file imports**
   - Import Django model components (models, Model)
   - Import validators where needed
   - Import the enum classes (AccountType, NormalBalance) from enums module
   - Import any necessary utilities (timezone, etc.)

3. **Add module docstring**
   - Document the purpose of account type configuration
   - Explain relationship to Chart of Accounts
   - Reference double-entry bookkeeping principles

4. **Define AccountTypeConfig model class**
   - Create model class inheriting from models.Model
   - Add comprehensive class docstring
   - Explain the five account types and their purpose

5. **Add model Meta class**
   - Set database table name: `accounting_account_type_config`
   - Add verbose name: "Account Type Configuration"
   - Add verbose name plural: "Account Type Configurations"
   - Set default ordering: `['display_order']`
   - Add indexes for frequently queried fields

6. **Plan string representation**
   - Prepare to implement `__str__()` method
   - Should return account type name for clarity
   - Format: "Asset Configuration" or just "Asset"

### Account Type Overview

| Account Type | Code Range | Normal Balance | Financial Statement | Increases With | Decreases With |
|--------------|------------|----------------|---------------------|----------------|----------------|
| Asset | 1000-1999 | DEBIT | Balance Sheet | Debit | Credit |
| Liability | 2000-2999 | CREDIT | Balance Sheet | Credit | Debit |
| Equity | 3000-3999 | CREDIT | Balance Sheet | Credit | Debit |
| Revenue | 4000-4999 | CREDIT | Profit & Loss | Credit | Debit |
| Expense | 5000-5999 | DEBIT | Profit & Loss | Debit | Credit |

### Double-Entry Bookkeeping Fundamentals

#### Basic Accounting Equation
```
ASSETS = LIABILITIES + EQUITY
```

#### Expanded Accounting Equation
```
ASSETS = LIABILITIES + EQUITY + (REVENUE - EXPENSES)
```

#### Normal Balance Explanation

**Debit Normal Balance (Assets, Expenses)**
- These accounts increase with debits
- Decrease with credits
- Typically have debit balances
- Example: Cash account increases when debited

**Credit Normal Balance (Liabilities, Equity, Revenue)**
- These accounts increase with credits
- Decrease with debits
- Typically have credit balances
- Example: Sales Revenue increases when credited

### Model Design Principles

**Simplicity**
- Model should be straightforward and easy to understand
- Each field has clear purpose
- No unnecessary complexity

**Integrity**
- Constraints prevent invalid data
- Code ranges don't overlap
- Required fields are enforced

**Auditability**
- Configuration changes should be traceable
- Consider adding created/modified timestamps if needed
- Display order changes should be logged

**Performance**
- Minimal fields for optimal query performance
- Proper indexing on frequently accessed fields
- Consider caching if frequently read

### Sri Lankan Context

In Sri Lanka's business environment:
- Standard international account type classification applies
- Code ranges align with common Sri Lankan accounting software
- Configuration supports IRD (Inland Revenue Department) reporting requirements
- Compatible with LKAS (Sri Lanka Accounting Standards)

### Expected Outcome
- AccountTypeConfig model class defined
- Proper Django model structure established
- Meta class configured with table name and ordering
- Foundation ready for field definitions
- Model follows Django conventions and best practices

### Verification Checklist
- [ ] `apps/accounting/models/account_type.py` file created
- [ ] AccountTypeConfig model class defined
- [ ] Model inherits from models.Model
- [ ] Class docstring explains purpose and usage
- [ ] Meta class defined with appropriate settings
- [ ] File imports include necessary Django components
- [ ] File imports include AccountType and NormalBalance enums
- [ ] Model prepared to accept field definitions

---

## Task 08: Add Type Name Field

### Overview
Add the type name field to the AccountTypeConfig model. This field identifies which of the five main account types (Asset, Liability, Equity, Revenue, Expense) this configuration record represents. It serves as the primary identifier and links to the AccountType enumeration.

### Dependencies
- Task 07: Create AccountTypeConfig Model

### Purpose and Impact

**Primary Identification**
- Uniquely identifies the account type configuration
- Links configuration to AccountType enum
- Serves as the natural key for the model

**Data Integrity**
- Ensures only valid account types exist
- Prevents duplicate configurations for same type
- Enforces referential integrity with enum

**System Integration**
- Used in account creation to validate type selection
- Referenced in financial report generation
- Applied in validation rules and business logic

**Query Performance**
- Enables fast lookup of configuration by type
- Supports efficient filtering and grouping
- Indexed for optimal performance

### Instructions

1. **Define type_name field**
   - Add field to AccountTypeConfig model
   - Use CharField with choices parameter
   - Set choices to AccountType.choices

2. **Configure field attributes**
   - Set max_length to accommodate longest enum value (typically 20-30)
   - Set unique=True to prevent duplicate configurations
   - Add verbose_name: "Account Type"
   - Add help_text explaining the field purpose

3. **Add validation considerations**
   - Field should be required (no null, no blank)
   - Django will automatically validate against enum choices
   - Consider adding custom validator if additional rules needed

4. **Add database index**
   - Ensure field is indexed (unique=True provides this)
   - Will be queried frequently for lookups

5. **Document field purpose**
   - Add inline comment explaining field role
   - Note that this links to AccountType enum

### AccountType Enum Values

The type_name field will accept these values (as defined in AccountType enum):

| Enum Value | String Value | Display Name | Purpose |
|------------|--------------|--------------|---------|
| ASSET | 'ASSET' | Asset | Resources owned by business |
| LIABILITY | 'LIABILITY' | Liability | Obligations owed by business |
| EQUITY | 'EQUITY' | Equity | Owner's residual interest |
| REVENUE | 'REVENUE' | Revenue | Income from operations |
| EXPENSE | 'EXPENSE' | Expense | Costs of operations |

### Usage Examples

**Account Type Configuration Query**
When creating a new cash account:
1. System looks up AccountTypeConfig with type_name='ASSET'
2. Retrieves code range (1000-1999)
3. Validates account code falls within range
4. Assigns normal balance (DEBIT)

**Financial Statement Generation**
When generating Balance Sheet:
1. Query all accounts with type in [ASSET, LIABILITY, EQUITY]
2. Look up AccountTypeConfig for each type
3. Use display_order to sort sections
4. Apply normal balance rules for debit/credit presentation

**Validation Scenario**
User attempts to create "Sales Revenue" account:
1. System retrieves AccountTypeConfig for type_name='REVENUE'
2. Checks code is between 4000-4999
3. Verifies normal balance is CREDIT
4. Creates account if validations pass

### Field Properties Summary

| Property | Value | Reason |
|----------|-------|--------|
| Type | CharField | Stores enum string value |
| Max Length | 20-30 | Accommodates enum values |
| Choices | AccountType.choices | Links to enum |
| Unique | True | One config per type |
| Null | False | Always required |
| Blank | False | Must be provided |
| Indexed | Yes (via unique) | Frequent lookups |

### Data Integrity Considerations

**Uniqueness**
- Only one configuration per account type allowed
- Prevents conflicting configurations
- Ensures single source of truth

**Enum Coupling**
- Field values tied to AccountType enum
- Changes to enum require migration
- Maintains consistency across system

**System Data**
- Typically populated via fixtures
- Not created by end users
- Changes require admin access

### Expected Outcome
- type_name field added to AccountTypeConfig model
- Field uses AccountType enum for choices
- Uniqueness constraint prevents duplicates
- Field properly configured with verbose name and help text
- Ready for migration generation

### Verification Checklist
- [ ] type_name field added to model
- [ ] Field type is CharField
- [ ] choices parameter set to AccountType.choices
- [ ] unique=True constraint added
- [ ] Appropriate max_length set
- [ ] verbose_name provided
- [ ] help_text provided
- [ ] Field is required (no null, no blank)
- [ ] Inline comment documents purpose

---

## Task 09: Add Type Normal Balance

### Overview
Add the normal_balance field to the AccountTypeConfig model. This field specifies whether the account type naturally has a debit or credit balance, which is fundamental to double-entry bookkeeping. It determines how transactions increase or decrease account balances.

### Dependencies
- Task 07: Create AccountTypeConfig Model
- Task 06: Define NormalBalance Enum

### Purpose and Impact

**Double-Entry Bookkeeping Foundation**
- Defines which side (debit/credit) increases the account
- Determines which side decreases the account
- Essential for transaction validation and posting

**Balance Calculation**
- Determines sign of balance in reports
- Affects how debits and credits accumulate
- Controls balance sheet presentation

**Transaction Validation**
- Validates that debits equal credits in journal entries
- Ensures proper accounting equation balance
- Prevents logical errors in postings

**Financial Reporting**
- Controls how balances display in financial statements
- Determines if balance shows as positive or negative
- Affects profit and loss calculations

### Instructions

1. **Define normal_balance field**
   - Add field to AccountTypeConfig model
   - Use CharField with choices parameter
   - Set choices to NormalBalance.choices

2. **Configure field attributes**
   - Set max_length to 10 (sufficient for 'DEBIT' or 'CREDIT')
   - Add verbose_name: "Normal Balance Side"
   - Add help_text explaining debit vs credit increases
   - Field should be required (no null, no blank)

3. **Add field documentation**
   - Add inline comment explaining double-entry bookkeeping role
   - Note impact on balance calculation
   - Reference accounting equation

4. **Consider validation**
   - Django validates against enum choices automatically
   - Consider adding clean() method to validate type/balance combinations
   - Ensure Assets/Expenses have DEBIT, others have CREDIT

### Normal Balance by Account Type

| Account Type | Normal Balance | Increases With | Decreases With | Example |
|--------------|----------------|----------------|----------------|---------|
| **Asset** | **DEBIT** | Debit | Credit | Cash: Debit to add, Credit to reduce |
| **Liability** | **CREDIT** | Credit | Debit | Accounts Payable: Credit to add, Debit to reduce |
| **Equity** | **CREDIT** | Credit | Debit | Owner's Equity: Credit to add, Debit to reduce |
| **Revenue** | **CREDIT** | Credit | Debit | Sales: Credit to record income |
| **Expense** | **DEBIT** | Debit | Credit | Rent Expense: Debit to record cost |

### Double-Entry Bookkeeping Rules

#### The T-Account Visual

**Asset Account (Debit Normal Balance)**
```
        Asset Account (e.g., Cash)
    ┌─────────────┬──────────────┐
    │   DEBIT     │    CREDIT    │
    │  (Normal)   │              │
    ├─────────────┼──────────────┤
    │  Increases  │  Decreases   │
    │    +500     │     -200     │
    │    +300     │              │
    ├─────────────┼──────────────┤
    │  Balance:   │              │
    │    600 DR   │              │
    └─────────────┴──────────────┘
```

**Liability Account (Credit Normal Balance)**
```
    Liability Account (e.g., Accounts Payable)
    ┌─────────────┬──────────────┐
    │   DEBIT     │    CREDIT    │
    │             │   (Normal)   │
    ├─────────────┼──────────────┤
    │  Decreases  │  Increases   │
    │    -200     │     +500     │
    │             │     +300     │
    ├─────────────┼──────────────┤
    │             │  Balance:    │
    │             │    600 CR    │
    └─────────────┴──────────────┘
```

### Balance Calculation Logic

**For Debit Normal Balance (Assets, Expenses)**
```
Account Balance = Total Debits - Total Credits

Example (Cash - Asset):
  Debits:  1000 + 500 + 300 = 1800
  Credits: 200 + 100 = 300
  Balance: 1800 - 300 = 1500 (Debit)
```

**For Credit Normal Balance (Liabilities, Equity, Revenue)**
```
Account Balance = Total Credits - Total Debits

Example (Sales Revenue):
  Credits: 5000 + 3000 = 8000
  Debits:  500 (returns) = 500
  Balance: 8000 - 500 = 7500 (Credit)
```

### Impact on Financial Statements

#### Balance Sheet Presentation
```
ASSETS (Debit Balance)              LIABILITIES (Credit Balance)
Cash                    50,000      Accounts Payable       30,000
Accounts Receivable     25,000      Loan Payable          100,000
Equipment               75,000      
                       -------      EQUITY (Credit Balance)
                       150,000      Owner's Capital       150,000
                                    Retained Earnings     (30,000)
                                                         ---------
                                                          250,000
```

#### Profit & Loss Presentation
```
REVENUE (Credit Balance)
Sales Revenue                       500,000
Service Revenue                      50,000
                                   --------
Total Revenue                       550,000

EXPENSES (Debit Balance)
Cost of Goods Sold                  300,000
Rent Expense                         24,000
Salaries Expense                     80,000
                                   --------
Total Expenses                      404,000
                                   --------
NET PROFIT                          146,000
```

### Validation Rules

**Required Combinations**
| Account Type | Required Normal Balance | Validation Rule |
|--------------|-------------------------|-----------------|
| ASSET | DEBIT | Must be DEBIT |
| LIABILITY | CREDIT | Must be CREDIT |
| EQUITY | CREDIT | Must be CREDIT |
| REVENUE | CREDIT | Must be CREDIT |
| EXPENSE | DEBIT | Must be DEBIT |

**Invalid Combinations**
- Asset with CREDIT normal balance (violates accounting rules)
- Revenue with DEBIT normal balance (violates accounting rules)
- Liability with DEBIT normal balance (violates accounting rules)

### Sri Lankan Accounting Context

**LKAS Compliance**
- Normal balance rules align with LKAS (Sri Lanka Accounting Standards)
- Standard debit/credit conventions apply
- Required for proper financial statement preparation

**IRD Reporting**
- Correct normal balances ensure accurate tax reporting
- Profit calculations depend on proper balance treatment
- Audit trails require consistent balance handling

### Expected Outcome
- normal_balance field added to AccountTypeConfig model
- Field uses NormalBalance enum for choices
- Properly configured with verbose name and help text
- Field is required and validated
- Foundation for double-entry validation logic

### Verification Checklist
- [ ] normal_balance field added to model
- [ ] Field type is CharField
- [ ] choices parameter set to NormalBalance.choices
- [ ] Appropriate max_length set (10)
- [ ] verbose_name provided
- [ ] help_text explains debit vs credit increases
- [ ] Field is required (no null, no blank)
- [ ] Inline comment documents purpose
- [ ] Consider validation for type/balance combinations

---

## Task 10: Add Type Code Range

### Overview
Add code range fields (start_code and end_code) to the AccountTypeConfig model. These fields define the numeric range of account codes that can be assigned to each account type, establishing a structured numbering system for the Chart of Accounts.

### Dependencies
- Task 07: Create AccountTypeConfig Model

### Purpose and Impact

**Organized Account Numbering**
- Establishes clear numeric boundaries for each account type
- Prevents code collisions between different account types
- Enables logical grouping and sorting of accounts
- Follows international accounting software conventions

**Code Assignment Validation**
- Validates new account codes fall within appropriate range
- Ensures accounts are properly categorized
- Prevents miscategorization errors
- Supports data integrity

**System Scalability**
- 1000-number range per type allows for extensive account creation
- Supports sub-categorization within ranges
- Enables hierarchical account structures
- Room for growth as business expands

**Reporting and Organization**
- Account codes sort naturally into type groups
- Financial statements can be generated by code range
- Trial balance lists accounts in logical order
- Chart of Accounts displays in standardized format

### Instructions

1. **Define start_code field**
   - Add PositiveIntegerField to AccountTypeConfig model
   - Set verbose_name: "Code Range Start"
   - Add help_text explaining it's the beginning of the code range
   - Field should be required (no null, no blank)

2. **Define end_code field**
   - Add PositiveIntegerField to AccountTypeConfig model
   - Set verbose_name: "Code Range End"
   - Add help_text explaining it's the end of the code range
   - Field should be required (no null, no blank)

3. **Add uniqueness constraint**
   - Consider adding constraints to prevent overlapping ranges
   - Add index for performance on range queries
   - Use Meta.constraints if Django version supports it

4. **Add validation method**
   - Consider creating clean() method to validate start_code < end_code
   - Validate range doesn't overlap with other types
   - Ensure range is reasonable (e.g., at least 100 numbers)

5. **Document code range structure**
   - Add inline comments explaining standard ranges
   - Note that ranges align with international standards
   - Reference fixture data that will populate these

### Standard Account Code Ranges

| Account Type | Start Code | End Code | Range Size | Example Accounts |
|--------------|------------|----------|------------|------------------|
| **ASSET** | 1000 | 1999 | 1000 codes | 1000: Cash, 1100: Bank, 1200: Accounts Receivable |
| **LIABILITY** | 2000 | 2999 | 1000 codes | 2000: Accounts Payable, 2100: Loans Payable |
| **EQUITY** | 3000 | 3999 | 1000 codes | 3000: Owner's Capital, 3100: Retained Earnings |
| **REVENUE** | 4000 | 4999 | 1000 codes | 4000: Sales Revenue, 4100: Service Revenue |
| **EXPENSE** | 5000 | 5999 | 1000 codes | 5000: Cost of Goods Sold, 5100: Rent Expense |

### Code Range Subdivision Strategy

#### Asset Range Breakdown (1000-1999)
```
1000-1099: Current Assets - Cash & Cash Equivalents
1100-1199: Current Assets - Bank Accounts
1200-1299: Current Assets - Accounts Receivable
1300-1399: Current Assets - Inventory
1400-1499: Current Assets - Prepaid Expenses
1500-1699: Non-Current Assets - Property, Plant & Equipment
1700-1799: Non-Current Assets - Intangible Assets
1800-1899: Non-Current Assets - Investments
1900-1999: Non-Current Assets - Other
```

#### Liability Range Breakdown (2000-2999)
```
2000-2099: Current Liabilities - Accounts Payable
2100-2199: Current Liabilities - Short-term Loans
2200-2299: Current Liabilities - Accrued Expenses
2300-2399: Current Liabilities - Payroll Liabilities
2400-2499: Current Liabilities - Sales Tax Payable
2500-2799: Non-Current Liabilities - Long-term Loans
2800-2899: Non-Current Liabilities - Deferred Revenue
2900-2999: Non-Current Liabilities - Other
```

#### Equity Range Breakdown (3000-3999)
```
3000-3099: Owner's Capital/Share Capital
3100-3199: Retained Earnings
3200-3299: Drawings/Dividends
3300-3399: Current Year Profit/Loss
3400-3999: Other Equity Accounts
```

#### Revenue Range Breakdown (4000-4999)
```
4000-4099: Sales Revenue - Product Sales
4100-4199: Sales Revenue - Service Revenue
4200-4299: Sales Revenue - Other Income
4300-4399: Revenue Adjustments - Sales Returns
4400-4499: Revenue Adjustments - Discounts
4500-4999: Other Revenue
```

#### Expense Range Breakdown (5000-5999)
```
5000-5099: Cost of Goods Sold
5100-5199: Operating Expenses - Rent
5200-5299: Operating Expenses - Salaries & Wages
5300-5399: Operating Expenses - Utilities
5400-5499: Operating Expenses - Marketing
5500-5599: Operating Expenses - Insurance
5600-5699: Operating Expenses - Depreciation
5700-5799: Financial Expenses - Interest
5800-5899: Administrative Expenses
5900-5999: Other Expenses
```

### Code Range Visualization

```
┌─────────────────────────────────────────────────────────┐
│           Chart of Accounts Code Structure              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1000 ─────────────────────────────── 1999            │
│  │                                     │               │
│  │    ASSET ACCOUNTS                   │               │
│  │                                     │               │
│  └─────────────────────────────────────┘               │
│                                                         │
│  2000 ─────────────────────────────── 2999            │
│  │                                     │               │
│  │    LIABILITY ACCOUNTS               │               │
│  │                                     │               │
│  └─────────────────────────────────────┘               │
│                                                         │
│  3000 ─────────────────────────────── 3999            │
│  │                                     │               │
│  │    EQUITY ACCOUNTS                  │               │
│  │                                     │               │
│  └─────────────────────────────────────┘               │
│                                                         │
│  4000 ─────────────────────────────── 4999            │
│  │                                     │               │
│  │    REVENUE ACCOUNTS                 │               │
│  │                                     │               │
│  └─────────────────────────────────────┘               │
│                                                         │
│  5000 ─────────────────────────────── 5999            │
│  │                                     │               │
│  │    EXPENSE ACCOUNTS                 │               │
│  │                                     │               │
│  └─────────────────────────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Validation Logic

**Range Validation Rules**
1. start_code must be less than end_code
2. Range must be at least 100 codes (end_code - start_code >= 99)
3. start_code must be positive integer
4. No overlapping ranges between types
5. Ranges should follow 1000-based increments (1000-1999, 2000-2999, etc.)

**Overlap Prevention**
```
Type A: 1000-1999  ✓ Valid (no overlap)
Type B: 2000-2999  ✓ Valid (no overlap)
Type C: 2500-3499  ✗ Invalid (overlaps with B and D)
Type D: 3000-3999  ✓ Valid (no overlap)
```

### Query Performance Considerations

**Range Queries**
- Code range queries will be common for validation
- Consider adding database index on both start_code and end_code
- Use efficient BETWEEN queries for code validation

**Example Range Query Pattern**
When user creates account with code 1250:
1. Query: Find AccountTypeConfig where 1250 BETWEEN start_code AND end_code
2. Returns: ASSET configuration
3. Validates: Code is valid for asset account

### Sri Lankan Business Context

**Alignment with Local Practices**
- Code ranges align with common Sri Lankan accounting software
- Compatible with QuickBooks, Tally, and other local systems
- Supports import/export with standard formats
- Meets IRD reporting requirements

**Flexibility for Local Needs**
- Ranges can accommodate Sri Lankan-specific accounts
- Supports VAT accounts within appropriate ranges
- Allows for NBT (Nation Building Tax) accounts
- Accommodates EPF/ETF payroll accounts

### Field Properties Summary

| Field | Type | Required | Validation | Purpose |
|-------|------|----------|------------|---------|
| start_code | PositiveIntegerField | Yes | > 0, < end_code | Beginning of code range |
| end_code | PositiveIntegerField | Yes | > start_code | End of code range |

### Expected Outcome
- start_code and end_code fields added to AccountTypeConfig model
- Fields properly configured with verbose names and help text
- Validation ensures start_code < end_code
- Validation prevents overlapping ranges
- Database indexed for efficient range queries
- Foundation for account code validation logic

### Verification Checklist
- [ ] start_code field added to model
- [ ] end_code field added to model
- [ ] Both fields are PositiveIntegerField
- [ ] Both fields are required (no null, no blank)
- [ ] Appropriate verbose_name provided for each
- [ ] help_text explains purpose of each field
- [ ] Inline comments document standard ranges
- [ ] Consider clean() method for validation
- [ ] Consider Meta.constraints for overlap prevention
- [ ] Consider database indexes for range queries

---

## Task 11: Add Type Display Order

### Overview
Add the display_order field to the AccountTypeConfig model. This field controls the sequence in which account types appear in financial reports, ensuring consistent and standard presentation of financial statements (Balance Sheet, Profit & Loss, Trial Balance).

### Dependencies
- Task 07: Create AccountTypeConfig Model

### Purpose and Impact

**Financial Report Presentation**
- Controls order of account type sections in reports
- Ensures Balance Sheet shows Assets, Liabilities, then Equity
- Ensures Profit & Loss shows Revenue before Expenses
- Maintains professional and standard report layouts

**Consistency Across Reports**
- All financial reports use same ordering logic
- Trial Balance lists accounts in standard order
- Chart of Accounts displays in logical sequence
- Audit reports follow standard presentation

**International Standards Compliance**
- Aligns with IFRS/GAAP presentation requirements
- Follows Sri Lankan Accounting Standards (LKAS)
- Meets stakeholder expectations for report format
- Supports regulatory compliance

**User Experience**
- Users see accounts in expected order
- Reduces confusion when reading reports
- Matches accounting textbook presentations
- Facilitates comparison with other systems

### Instructions

1. **Define display_order field**
   - Add PositiveIntegerField to AccountTypeConfig model
   - Set verbose_name: "Display Order"
   - Add help_text explaining its role in report sequencing
   - Field should be required (no null, no blank)

2. **Set default ordering**
   - Add default value support (though values will come from fixtures)
   - Consider uniqueness to prevent duplicate orders
   - Add database index for efficient sorting

3. **Configure Meta ordering**
   - Ensure Meta.ordering uses display_order
   - This makes all queries return types in correct sequence
   - Simplifies report generation logic

4. **Document standard ordering**
   - Add inline comment explaining standard order
   - Reference which reports use this field
   - Note that lower numbers display first

### Standard Display Order

| Display Order | Account Type | Financial Statement | Reasoning |
|---------------|--------------|---------------------|-----------|
| **1** | **ASSET** | Balance Sheet | Assets listed first, in decreasing liquidity |
| **2** | **LIABILITY** | Balance Sheet | Liabilities listed after assets |
| **3** | **EQUITY** | Balance Sheet | Equity listed last (residual interest) |
| **4** | **REVENUE** | Profit & Loss | Income listed before expenses |
| **5** | **EXPENSE** | Profit & Loss | Costs listed after revenue |

### Financial Statement Structure

#### Balance Sheet Layout
```
┌─────────────────────────────────────────────────────────┐
│                    BALANCE SHEET                        │
│                  As at 31/12/2025                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ASSETS (Display Order: 1)                            │
│  ├─ Current Assets                     150,000         │
│  └─ Non-Current Assets                 350,000         │
│                                        ────────         │
│  Total Assets                          500,000         │
│                                                         │
│  LIABILITIES (Display Order: 2)                       │
│  ├─ Current Liabilities                 80,000         │
│  └─ Non-Current Liabilities            170,000         │
│                                        ────────         │
│  Total Liabilities                     250,000         │
│                                                         │
│  EQUITY (Display Order: 3)                            │
│  ├─ Owner's Capital                    200,000         │
│  └─ Retained Earnings                   50,000         │
│                                        ────────         │
│  Total Equity                          250,000         │
│                                        ────────         │
│  Total Liabilities & Equity            500,000         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Profit & Loss Statement Layout
```
┌─────────────────────────────────────────────────────────┐
│              PROFIT & LOSS STATEMENT                    │
│         For the Year Ended 31/12/2025                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  REVENUE (Display Order: 4)                           │
│  ├─ Sales Revenue                      800,000         │
│  └─ Service Revenue                    100,000         │
│                                        ────────         │
│  Total Revenue                         900,000         │
│                                                         │
│  EXPENSES (Display Order: 5)                          │
│  ├─ Cost of Goods Sold                 500,000         │
│  ├─ Operating Expenses                 200,000         │
│  └─ Financial Expenses                  50,000         │
│                                        ────────         │
│  Total Expenses                        750,000         │
│                                        ────────         │
│  NET PROFIT                            150,000         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Trial Balance Layout
```
┌─────────────────────────────────────────────────────────┐
│                    TRIAL BALANCE                        │
│                  As at 31/12/2025                       │
├──────────────────────────────┬──────────┬───────────────┤
│  Account Name                │  Debit   │    Credit     │
├──────────────────────────────┼──────────┼───────────────┤
│                              │          │               │
│  ASSETS (Order: 1)           │          │               │
│  Cash                        │  50,000  │               │
│  Bank                        │ 100,000  │               │
│  Accounts Receivable         │  30,000  │               │
│  Inventory                   │  70,000  │               │
│  Equipment                   │ 250,000  │               │
│                              │          │               │
│  LIABILITIES (Order: 2)      │          │               │
│  Accounts Payable            │          │    40,000     │
│  Loan Payable                │          │   210,000     │
│                              │          │               │
│  EQUITY (Order: 3)           │          │               │
│  Owner's Capital             │          │   200,000     │
│  Retained Earnings           │          │    50,000     │
│                              │          │               │
│  REVENUE (Order: 4)          │          │               │
│  Sales Revenue               │          │   800,000     │
│  Service Revenue             │          │   100,000     │
│                              │          │               │
│  EXPENSES (Order: 5)         │          │               │
│  Cost of Goods Sold          │ 500,000  │               │
│  Salaries Expense            │ 150,000  │               │
│  Rent Expense                │  50,000  │               │
│                              │          │               │
├──────────────────────────────┼──────────┼───────────────┤
│  TOTALS                      │1,400,000 │  1,400,000    │
└──────────────────────────────┴──────────┴───────────────┘
```

### Display Order Logic

**Query Pattern for Reports**
When generating financial reports:
1. Query AccountTypeConfig ordered by display_order
2. For each type, query accounts with matching type
3. Display accounts grouped by type in correct sequence
4. Calculate subtotals per type
5. Calculate grand totals

**Example Query Logic**
```
For Balance Sheet:
  1. Get AccountTypeConfig for types [ASSET, LIABILITY, EQUITY]
     Ordered by display_order (gives [1, 2, 3])
  
  2. For each type:
     - Query accounts with that type
     - Calculate total debits and credits
     - Apply normal balance rules
     - Display section with totals
  
  3. Verify accounting equation:
     Assets = Liabilities + Equity
```

### Importance of Correct Ordering

**Why Assets Come First**
- Most liquid resources listed first
- Current assets before non-current
- Shows what company owns
- Critical for liquidity analysis

**Why Liabilities Follow Assets**
- Shows what company owes
- Current obligations before long-term
- Enables debt analysis
- Required for solvency assessment

**Why Equity Comes Last**
- Represents residual interest (Assets - Liabilities)
- Shows owner's stake
- Includes retained earnings
- Completes balance sheet equation

**Why Revenue Before Expenses**
- Shows what was earned before what was spent
- Natural flow of business operations
- Positive presentation (income first)
- Standard accounting practice

### Uniqueness Consideration

**Should display_order be unique?**
- Yes: Prevents duplicate ordering, enforces clear sequence
- Ensures each type has distinct position
- Simplifies report generation logic
- Prevents ambiguity in presentation

**Setting Uniqueness**
- Add unique=True to field definition
- Database enforces constraint
- Application prevents duplicate values

### Flexibility for Custom Reports

**Potential Custom Orderings**
Some reports might require different ordering:
- Reverse order for certain analyses
- Grouping Revenue/Expense together
- Custom management reports

**Solution**
- Default ordering uses display_order
- Custom reports can override with explicit ORDER BY
- Standard reports always use display_order
- Maintains consistency while allowing flexibility

### Sri Lankan Context

**LKAS Presentation Requirements**
- Display order aligns with LKAS 1 (Presentation of Financial Statements)
- Balance Sheet structure follows Sri Lankan standards
- Profit & Loss format meets regulatory requirements
- Compatible with IRD reporting formats

**Stakeholder Expectations**
- Banks expect standard Balance Sheet format
- Auditors require LKAS-compliant presentation
- Tax authorities need standard Profit & Loss
- Business partners recognize standard layouts

### Field Properties Summary

| Property | Value | Reason |
|----------|-------|--------|
| Type | PositiveIntegerField | Sequential ordering |
| Required | Yes | Must specify order |
| Unique | Yes | One position per type |
| Default | No default | Set via fixtures |
| Indexed | Yes | Frequent sorting |

### Expected Outcome
- display_order field added to AccountTypeConfig model
- Field properly configured with verbose name and help text
- Uniqueness constraint prevents duplicate orders
- Model Meta class orders by this field
- Foundation for consistent financial report presentation

### Verification Checklist
- [ ] display_order field added to model
- [ ] Field type is PositiveIntegerField
- [ ] unique=True constraint added
- [ ] Field is required (no null, no blank)
- [ ] verbose_name provided
- [ ] help_text explains report ordering purpose
- [ ] Meta.ordering includes display_order
- [ ] Database index added for sorting
- [ ] Inline comment documents standard order values

---

## Task 12: Add Type Description

### Overview
Add the description field to the AccountTypeConfig model. This field provides human-readable documentation explaining the purpose, characteristics, and usage of each account type. It serves as built-in system documentation and helps users understand the accounting framework.

### Dependencies
- Task 07: Create AccountTypeConfig Model

### Purpose and Impact

**User Education**
- Explains what each account type represents
- Helps users understand double-entry bookkeeping
- Provides context for account creation
- Reduces need for external documentation

**System Documentation**
- Built-in documentation within the data model
- Describes accounting rules for each type
- Explains normal balance and usage
- Supports training and onboarding

**Administrative Clarity**
- Helps administrators understand system configuration
- Provides reference when creating accounts
- Clarifies distinction between types
- Supports decision-making in account setup

**Audit and Compliance**
- Documents system configuration choices
- Explains accounting treatment
- Supports audit trails
- Facilitates regulatory compliance

### Instructions

1. **Define description field**
   - Add TextField to AccountTypeConfig model
   - Set verbose_name: "Description"
   - Add help_text explaining it describes the account type
   - Allow field to be optional (null=True, blank=True) or required based on requirements

2. **Configure field attributes**
   - Use TextField (not CharField) for longer text
   - Consider max_length if constraint needed
   - No default value (populated via fixtures)

3. **Plan description content**
   - Descriptions should explain type purpose
   - Include examples of accounts in this type
   - Reference normal balance and typical transactions
   - Note financial statement placement

4. **Document field purpose**
   - Add inline comment explaining documentation role
   - Note that descriptions appear in admin interface
   - Reference use in help text and user guidance

### Recommended Description Content

#### Asset Description
```
Assets represent resources owned or controlled by the business that 
provide future economic benefits. Assets include cash, bank balances, 
inventory, equipment, vehicles, buildings, and amounts owed by customers 
(accounts receivable). Assets have a debit normal balance, meaning they 
increase with debits and decrease with credits. Assets appear on the 
Balance Sheet and are typically listed in order of liquidity, with 
current assets (those convertible to cash within one year) listed before 
non-current assets.

Examples: Cash, Bank Accounts, Accounts Receivable, Inventory, 
Equipment, Vehicles, Buildings, Land, Prepaid Expenses.
```

#### Liability Description
```
Liabilities represent obligations or debts owed by the business to 
external parties. These are amounts the business must pay in the future, 
including supplier debts (accounts payable), loans, accrued expenses, 
and taxes payable. Liabilities have a credit normal balance, meaning 
they increase with credits and decrease with debits. Liabilities appear 
on the Balance Sheet, with current liabilities (due within one year) 
listed before non-current liabilities.

Examples: Accounts Payable, Loans Payable, Accrued Expenses, Sales Tax 
Payable, Employee Payables (EPF/ETF), Unearned Revenue.
```

#### Equity Description
```
Equity represents the owner's residual interest in the business after 
deducting liabilities from assets. It includes the owner's original 
investment (capital), retained earnings from profitable operations, and 
current period profit or loss. Equity has a credit normal balance, 
increasing with credits and decreasing with debits. Equity appears on 
the Balance Sheet and represents what the business owes to its owners. 
The basic accounting equation is: Assets = Liabilities + Equity.

Examples: Owner's Capital, Share Capital, Retained Earnings, Current 
Year Profit/Loss, Drawings (reduces equity).
```

#### Revenue Description
```
Revenue represents income earned by the business from its operating 
activities, including sales of goods, provision of services, and other 
income sources. Revenue has a credit normal balance, increasing with 
credits and decreasing with debits (such as sales returns). Revenue 
appears on the Profit & Loss Statement and increases equity when earned. 
Revenue is recognized when earned, not necessarily when cash is received.

Examples: Sales Revenue, Service Revenue, Rental Income, Interest 
Income, Commission Income, Discount Received.
```

#### Expense Description
```
Expenses represent costs incurred by the business in generating revenue 
and operating the business. This includes costs of goods sold, salaries, 
rent, utilities, and other operating costs. Expenses have a debit normal 
balance, increasing with debits and decreasing with credits. Expenses 
appear on the Profit & Loss Statement and reduce equity when incurred. 
The difference between revenue and expenses determines profit or loss.

Examples: Cost of Goods Sold, Salaries & Wages, Rent Expense, Utilities, 
Marketing Expenses, Depreciation, Interest Expense, Insurance.
```

### Description Content Table

| Account Type | Key Points to Include | Example Accounts | Normal Balance |
|--------------|------------------------|------------------|----------------|
| Asset | Resources owned, future benefits, liquidity order | Cash, Bank, Inventory, Equipment | DEBIT |
| Liability | Obligations owed, payment timing, external parties | Accounts Payable, Loans, Taxes | CREDIT |
| Equity | Owner's interest, residual claim, accounting equation | Capital, Retained Earnings | CREDIT |
| Revenue | Income earned, operating activities, equity increase | Sales, Service Revenue | CREDIT |
| Expense | Costs incurred, operating activities, equity decrease | COGS, Salaries, Rent | DEBIT |

### Usage in User Interface

**Account Creation Form**
When user creates new account:
- Display description of selected account type
- Help user understand what type to choose
- Provide examples of accounts in that type
- Clarify normal balance and usage

**Admin Interface**
In Django admin:
- Description appears in list view or detail view
- Helps administrators understand configuration
- Provides reference without leaving system
- Supports maintenance and troubleshooting

**Help System**
- Description can be used in tooltips
- Appears in user documentation
- Supports in-app help features
- Reduces support requests

### Content Guidelines

**Clarity**
- Use simple, non-technical language where possible
- Explain accounting terms when used
- Provide concrete examples
- Avoid jargon unless necessary

**Completeness**
- Cover purpose and definition
- Explain normal balance
- Note financial statement placement
- List common examples

**Accuracy**
- Align with accounting standards
- Reference double-entry principles
- Match Sri Lankan context where relevant
- Maintain consistency with terminology

**Length**
- Balance detail with brevity
- Aim for 3-5 sentences per type
- Include examples in separate line
- Use paragraphs for readability

### Sri Lankan Context in Descriptions

**Include Local References**
- Reference EPF/ETF in liability/expense descriptions
- Mention VAT/NBT in liability descriptions
- Note IRD requirements where relevant
- Use Sri Lankan business examples

**Example Local References**
- "Liabilities include EPF and ETF payables to employees"
- "Revenue may include VAT collected from customers"
- "Expenses include NBT paid on liable transactions"
- "Assets include deposits with Sri Lankan banks"

### Field Properties Summary

| Property | Value | Reason |
|----------|-------|--------|
| Type | TextField | Allows longer text |
| Required | Optional or Required | Business decision |
| Max Length | None or set limit | Flexible or constrained |
| Default | None | Set via fixtures |
| Help Text | Yes | Explains field purpose |

### Internationalization Consideration

**Multi-Language Support**
- Consider if descriptions need translation
- Plan for future i18n implementation
- Use Django's translation framework if needed
- Keep descriptions in English initially

**Future Enhancement**
- May add translated description fields
- Could use separate translation model
- Plan for localization in admin interface

### Expected Outcome
- description field added to AccountTypeConfig model
- Field properly configured with verbose name and help text
- Descriptions will be populated via fixtures with comprehensive content
- Field supports user education and system documentation
- Foundation for in-app help and guidance features

### Verification Checklist
- [ ] description field added to model
- [ ] Field type is TextField
- [ ] verbose_name provided
- [ ] help_text explains purpose
- [ ] Null/blank settings determined based on requirements
- [ ] Inline comment documents usage
- [ ] Content guidelines documented for fixture creation
- [ ] Consider max_length constraint if needed
- [ ] Plan for description content in fixtures (Task 14)

---

## Summary and Next Steps

### Completed in This Document
- **Task 07:** Created AccountTypeConfig model structure with Meta class and base configuration
- **Task 08:** Added type_name field linking to AccountType enum with uniqueness constraint
- **Task 09:** Added normal_balance field defining debit/credit increase side for each type
- **Task 10:** Added start_code and end_code fields establishing account numbering ranges
- **Task 11:** Added display_order field controlling financial statement presentation sequence
- **Task 12:** Added description field providing user documentation for each account type

### Model Structure Overview

```
AccountTypeConfig Model
├── type_name (CharField, unique)          → Links to AccountType enum
├── normal_balance (CharField)             → Links to NormalBalance enum
├── start_code (PositiveIntegerField)      → Beginning of code range (1000, 2000, etc.)
├── end_code (PositiveIntegerField)        → End of code range (1999, 2999, etc.)
├── display_order (PositiveIntegerField)   → Report sequencing (1-5)
└── description (TextField)                → Documentation and user guidance
```

### Account Type Configuration Data

| Type Name | Normal Balance | Code Range | Display Order | Purpose |
|-----------|----------------|------------|---------------|---------|
| ASSET | DEBIT | 1000-1999 | 1 | Resources owned by business |
| LIABILITY | CREDIT | 2000-2999 | 2 | Obligations owed by business |
| EQUITY | CREDIT | 3000-3999 | 3 | Owner's residual interest |
| REVENUE | CREDIT | 4000-4999 | 4 | Income from operations |
| EXPENSE | DEBIT | 5000-5999 | 5 | Costs of operations |

### Validation Rules Summary

**Field Validations**
- type_name: Must be unique, must match AccountType enum value
- normal_balance: Must match NormalBalance enum value
- start_code: Must be positive, must be less than end_code
- end_code: Must be positive, must be greater than start_code
- display_order: Should be unique to prevent duplicate positions
- description: Optional or required based on business requirements

**Cross-Field Validations**
- Code ranges must not overlap between types
- Normal balance must match standard rules (Assets/Expenses=DEBIT, others=CREDIT)
- Display order should follow standard sequence (1-5)

### Integration Points

**Used By**
- Account model (for type validation and code range checking)
- Financial report generators (for ordering and grouping)
- Account creation forms (for guidance and validation)
- Admin interface (for system configuration)

**Integrates With**
- AccountType enum (type_name field)
- NormalBalance enum (normal_balance field)
- Account model (future implementation)
- Reporting system (future implementation)

### Next Document

The next document [04_Tasks-13-16_Migrations-Fixtures-Testing.md](04_Tasks-13-16_Migrations-Fixtures-Testing.md) will cover:

- **Task 13:** Run migrations to create database table
- **Task 14:** Create JSON fixture with 5 account type configurations
- **Task 15:** Create management command to load fixtures
- **Task 16:** Test AccountTypeConfig functionality

### Pre-Migration Checklist

Before proceeding to migrations, verify:
- [ ] All fields added to AccountTypeConfig model
- [ ] Meta class configured with ordering and verbose names
- [ ] __str__() method implemented for string representation
- [ ] Clean() method added if custom validation needed
- [ ] Model imports include all required enums
- [ ] Model file saved and free of syntax errors
- [ ] No conflicting field names
- [ ] All required dependencies available

---

**End of Document 03**
