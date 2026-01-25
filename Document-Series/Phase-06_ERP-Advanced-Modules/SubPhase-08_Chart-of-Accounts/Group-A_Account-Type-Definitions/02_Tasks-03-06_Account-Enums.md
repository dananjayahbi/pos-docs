# Tasks 03-06: Account Enums

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** A - Account Type Definitions  
> **Document:** 02 of 04  
> **Tasks Covered:** 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-02_Accounting-App-Setup.md](01_Tasks-01-02_Accounting-App-Setup.md)
- **→ Next Document:** [03_Tasks-07-12_AccountTypeConfig-Model.md](03_Tasks-07-12_AccountTypeConfig-Model.md)

---

## Document Overview

This document covers the creation of enumeration types that form the foundation of the Chart of Accounts system. These enums define account types, categories, statuses, and normal balances following double-entry bookkeeping principles. They provide type-safe, consistent values used throughout the accounting system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 03 | Define AccountType Enum | Low | 15 min |
| 04 | Define AccountCategory Enum | Low | 20 min |
| 05 | Define AccountStatus Enum | Low | 10 min |
| 06 | Define NormalBalance Enum | Low | 15 min |

---

## Task 03: Define AccountType Enum

### Overview
Create the AccountType enumeration that defines the five fundamental account types in double-entry bookkeeping: Assets, Liabilities, Equity, Revenue, and Expenses. This enum is central to the Chart of Accounts system and financial reporting.

### Dependencies
- Task 02: Register accounting App

### Instructions

1. **Create enums module**
   - Navigate to `apps/accounting/models/`
   - Create new file: `enums.py`
   - This will house all accounting enumerations

2. **Import Django enumeration classes**
   - Import `models.TextChoices` from Django
   - TextChoices provides string-based enumerations
   - Alternative: IntegerChoices for integer-based enums

3. **Add module docstring**
   - Document the purpose of this module
   - Explain the accounting enums contained
   - Reference double-entry bookkeeping principles

4. **Create AccountType class**
   - Inherit from `models.TextChoices`
   - Name the class `AccountType`
   - Use clear, descriptive naming

5. **Define ASSET enumeration value**
   - Value: `'ASSET'`
   - Label: `'Asset'`
   - Purpose: Resources owned by the business
   - Examples: Cash, Inventory, Equipment, Accounts Receivable

6. **Define LIABILITY enumeration value**
   - Value: `'LIABILITY'`
   - Label: `'Liability'`
   - Purpose: Obligations owed by the business
   - Examples: Accounts Payable, Loans, Accrued Expenses

7. **Define EQUITY enumeration value**
   - Value: `'EQUITY'`
   - Label: `'Equity'`
   - Purpose: Owner's stake in the business
   - Examples: Capital, Retained Earnings, Drawings

8. **Define REVENUE enumeration value**
   - Value: `'REVENUE'`
   - Label: `'Revenue'`
   - Purpose: Income from business operations
   - Examples: Sales, Service Income, Interest Income

9. **Define EXPENSE enumeration value**
   - Value: `'EXPENSE'`
   - Label: `'Expense'`
   - Purpose: Costs of doing business
   - Examples: Rent, Salaries, Utilities, Cost of Goods Sold

### Double-Entry Bookkeeping Context

The five account types form the foundation of the accounting equation:

**Accounting Equation:**
```
Assets = Liabilities + Equity
```

**Expanded Equation:**
```
Assets = Liabilities + Equity + (Revenue - Expenses)
```

### Account Type Characteristics

| Type | Nature | Normal Balance | Increases With | Decreases With | Financial Statement |
|------|--------|----------------|----------------|----------------|---------------------|
| ASSET | Debit | DEBIT | Debit | Credit | Balance Sheet |
| LIABILITY | Credit | CREDIT | Credit | Debit | Balance Sheet |
| EQUITY | Credit | CREDIT | Credit | Debit | Balance Sheet |
| REVENUE | Credit | CREDIT | Credit | Debit | Income Statement |
| EXPENSE | Debit | DEBIT | Debit | Credit | Income Statement |

### Account Type Examples

#### Assets (Code Range: 1000-1999)
- Current Assets: Cash, Bank, Accounts Receivable, Inventory
- Fixed Assets: Land, Buildings, Vehicles, Equipment
- Intangible Assets: Goodwill, Patents, Trademarks

#### Liabilities (Code Range: 2000-2999)
- Current Liabilities: Accounts Payable, Short-term Loans
- Long-term Liabilities: Bank Loans, Mortgage, Bonds Payable

#### Equity (Code Range: 3000-3999)
- Owner's Capital
- Retained Earnings
- Current Year Profit/Loss

#### Revenue (Code Range: 4000-4999)
- Sales Revenue
- Service Revenue
- Interest Income
- Other Income

#### Expenses (Code Range: 5000-5999)
- Cost of Goods Sold
- Operating Expenses (Rent, Salaries, Utilities)
- Administrative Expenses
- Selling Expenses

### Expected Outcome
- AccountType enum with five standard types
- Type-safe account type references
- Foundation for account classification
- Support for financial reporting

### Verification Checklist
- [ ] `apps/accounting/models/enums.py` file created
- [ ] AccountType class defined
- [ ] ASSET enum value created
- [ ] LIABILITY enum value created
- [ ] EQUITY enum value created
- [ ] REVENUE enum value created
- [ ] EXPENSE enum value created
- [ ] All enum values follow naming convention

---

## Task 04: Define AccountCategory Enum

### Overview
Create the AccountCategory enumeration that provides sub-classification within each account type. Categories help organize accounts into more specific groupings like Current Assets vs Fixed Assets, or Operating Expenses vs Administrative Expenses.

### Dependencies
- Task 03: Define AccountType Enum

### Instructions

1. **Add AccountCategory class to enums.py**
   - Same file: `apps/accounting/models/enums.py`
   - Inherit from `models.TextChoices`
   - Positioned after AccountType definition

2. **Add category classification docstring**
   - Explain category purpose
   - Note which account types use which categories
   - Reference accounting standards

3. **Define CURRENT enumeration value**
   - Value: `'CURRENT'`
   - Label: `'Current'`
   - Used for: Assets, Liabilities
   - Meaning: Short-term (within 1 year)

4. **Define NON_CURRENT enumeration value**
   - Value: `'NON_CURRENT'`
   - Label: `'Non-Current'`
   - Used for: Assets, Liabilities
   - Meaning: Long-term (beyond 1 year)

5. **Define OPERATING enumeration value**
   - Value: `'OPERATING'`
   - Label: `'Operating'`
   - Used for: Revenue, Expenses
   - Meaning: Core business operations

6. **Define NON_OPERATING enumeration value**
   - Value: `'NON_OPERATING'`
   - Label: `'Non-Operating'`
   - Used for: Revenue, Expenses
   - Meaning: Outside normal operations

7. **Define OWNER_CAPITAL enumeration value**
   - Value: `'OWNER_CAPITAL'`
   - Label: `'Owner Capital'`
   - Used for: Equity
   - Meaning: Owner investments

8. **Define RETAINED_EARNINGS enumeration value**
   - Value: `'RETAINED_EARNINGS'`
   - Label: `'Retained Earnings'`
   - Used for: Equity
   - Meaning: Accumulated profits

9. **Define OTHER enumeration value**
   - Value: `'OTHER'`
   - Label: `'Other'`
   - Used for: All types
   - Meaning: Miscellaneous or special accounts

### Category Usage by Account Type

#### Asset Categories
- **CURRENT**: Easily converted to cash within 1 year
  - Cash and Cash Equivalents
  - Accounts Receivable
  - Inventory
  - Prepaid Expenses
  
- **NON_CURRENT**: Long-term assets
  - Property, Plant & Equipment
  - Long-term Investments
  - Intangible Assets

#### Liability Categories
- **CURRENT**: Due within 1 year
  - Accounts Payable
  - Short-term Loans
  - Accrued Expenses
  - Unearned Revenue
  
- **NON_CURRENT**: Due beyond 1 year
  - Long-term Debt
  - Mortgage Payable
  - Deferred Tax Liabilities

#### Equity Categories
- **OWNER_CAPITAL**: Owner's investment
  - Capital Contributions
  - Additional Paid-in Capital
  
- **RETAINED_EARNINGS**: Accumulated profits
  - Retained Earnings (previous years)
  - Current Year Profit/Loss

#### Revenue Categories
- **OPERATING**: Core business income
  - Sales Revenue
  - Service Revenue
  - Subscription Income
  
- **NON_OPERATING**: Outside core operations
  - Interest Income
  - Gain on Sale of Assets
  - Other Income

#### Expense Categories
- **OPERATING**: Running the business
  - Cost of Goods Sold
  - Rent Expense
  - Salaries & Wages
  - Utilities
  
- **NON_OPERATING**: Not regular operations
  - Interest Expense
  - Loss on Sale of Assets
  - Depreciation (sometimes classified here)

### Category Application Matrix

| Account Type | Applicable Categories |
|--------------|----------------------|
| ASSET | CURRENT, NON_CURRENT, OTHER |
| LIABILITY | CURRENT, NON_CURRENT, OTHER |
| EQUITY | OWNER_CAPITAL, RETAINED_EARNINGS, OTHER |
| REVENUE | OPERATING, NON_OPERATING, OTHER |
| EXPENSE | OPERATING, NON_OPERATING, OTHER |

### Expected Outcome
- AccountCategory enum with comprehensive categories
- Support for proper account sub-classification
- Foundation for financial statement grouping
- Flexible categorization system

### Verification Checklist
- [ ] AccountCategory class defined in enums.py
- [ ] CURRENT enum value created
- [ ] NON_CURRENT enum value created
- [ ] OPERATING enum value created
- [ ] NON_OPERATING enum value created
- [ ] OWNER_CAPITAL enum value created
- [ ] RETAINED_EARNINGS enum value created
- [ ] OTHER enum value created
- [ ] Docstrings explain category usage

---

## Task 05: Define AccountStatus Enum

### Overview
Create the AccountStatus enumeration to manage the lifecycle state of accounts in the Chart of Accounts. Status controls whether accounts are actively used, temporarily disabled, or permanently archived, supporting account management and historical data retention.

### Dependencies
- Task 04: Define AccountCategory Enum

### Instructions

1. **Add AccountStatus class to enums.py**
   - Same file: `apps/accounting/models/enums.py`
   - Inherit from `models.TextChoices`
   - Positioned after AccountCategory definition

2. **Add status lifecycle docstring**
   - Explain status purpose and transitions
   - Document account lifecycle management
   - Note impact on transactions

3. **Define ACTIVE enumeration value**
   - Value: `'ACTIVE'`
   - Label: `'Active'`
   - Meaning: Account is in use
   - Default status for new accounts

4. **Define INACTIVE enumeration value**
   - Value: `'INACTIVE'`
   - Label: `'Inactive'`
   - Meaning: Temporarily disabled
   - Prevents new transactions

5. **Define ARCHIVED enumeration value**
   - Value: `'ARCHIVED'`
   - Label: `'Archived'`
   - Meaning: Permanently closed
   - Maintains historical data

6. **Document status transition rules**
   - Add docstring or comments explaining transitions
   - ACTIVE → INACTIVE (temporary suspension)
   - INACTIVE → ACTIVE (reactivation)
   - ACTIVE/INACTIVE → ARCHIVED (permanent closure)
   - ARCHIVED → (no transitions out)

### Account Status Lifecycle

```
┌──────────┐
│  ACTIVE  │ ←──────┐
│ (default)│        │
└────┬─────┘        │
     │              │
     │ suspend      │ reactivate
     ▼              │
┌──────────┐        │
│ INACTIVE │ ───────┘
└────┬─────┘
     │
     │ close permanently
     ▼
┌──────────┐
│ ARCHIVED │ (terminal state)
└──────────┘
```

### Status Behavior and Rules

#### ACTIVE Status
- **Allowed Operations:**
  - Create new transactions
  - Post journal entries
  - View in reports
  - Edit account details
  - Change to INACTIVE or ARCHIVED
  
- **Display in UI:**
  - Shown in dropdown lists
  - Available for selection
  - Highlighted as available

#### INACTIVE Status
- **Allowed Operations:**
  - View historical transactions
  - View in historical reports
  - Edit account details (limited)
  - Reactivate to ACTIVE
  - Archive to ARCHIVED
  
- **Restricted Operations:**
  - Cannot create new transactions
  - Cannot post new journal entries
  - Hidden from active dropdown lists
  
- **Display in UI:**
  - Shown in "Include Inactive" views
  - Grayed out or marked as inactive
  - Warning when attempting to use

#### ARCHIVED Status
- **Allowed Operations:**
  - View historical transactions (read-only)
  - View in historical reports
  - Export historical data
  
- **Restricted Operations:**
  - Cannot create new transactions
  - Cannot edit account details
  - Cannot reactivate
  - Cannot delete (maintains audit trail)
  
- **Display in UI:**
  - Hidden from all selection lists
  - Only visible in archived accounts view
  - Read-only display
  - Clearly marked as archived

### Use Cases for Each Status

#### When to use ACTIVE
- Newly created accounts
- Accounts in regular use
- Standard operational accounts
- Default state for most accounts

#### When to use INACTIVE
- Seasonal accounts (temporarily not needed)
- Accounts under review
- Accounts pending approval for closure
- Testing accounts no longer needed
- Preparing for year-end closure

#### When to use ARCHIVED
- Accounts permanently closed
- Merged accounts (consolidated elsewhere)
- Obsolete account structures
- Completed project accounts
- Historical accounts for compliance

### Impact on Financial Reports

| Report Type | ACTIVE | INACTIVE | ARCHIVED |
|-------------|--------|----------|----------|
| Trial Balance | ✓ Show | Optional | ✗ Hide |
| Balance Sheet | ✓ Show | ✗ Hide | ✗ Hide |
| Income Statement | ✓ Show | ✗ Hide | ✗ Hide |
| Historical Reports | ✓ Show | ✓ Show | ✓ Show |
| Audit Trail | ✓ Show | ✓ Show | ✓ Show |

### Expected Outcome
- AccountStatus enum with three lifecycle states
- Clear status transition rules
- Support for account lifecycle management
- Historical data preservation

### Verification Checklist
- [ ] AccountStatus class defined in enums.py
- [ ] ACTIVE enum value created
- [ ] INACTIVE enum value created
- [ ] ARCHIVED enum value created
- [ ] Status transitions documented
- [ ] Status rules clearly defined

---

## Task 06: Define NormalBalance Enum

### Overview
Create the NormalBalance enumeration that specifies whether an account increases with debits or credits. This fundamental double-entry bookkeeping concept determines how transactions affect account balances and is essential for accurate financial reporting.

### Dependencies
- Task 05: Define AccountStatus Enum

### Instructions

1. **Add NormalBalance class to enums.py**
   - Same file: `apps/accounting/models/enums.py`
   - Inherit from `models.TextChoices`
   - Positioned after AccountStatus definition

2. **Add double-entry bookkeeping docstring**
   - Explain normal balance concept
   - Reference debit/credit accounting principles
   - Note impact on account increases/decreases

3. **Define DEBIT enumeration value**
   - Value: `'DEBIT'`
   - Label: `'Debit'`
   - Meaning: Account increases with debits
   - Used for: Assets and Expenses

4. **Define CREDIT enumeration value**
   - Value: `'CREDIT'`
   - Label: `'Credit'`
   - Meaning: Account increases with credits
   - Used for: Liabilities, Equity, and Revenue

5. **Document normal balance rules**
   - Add comments explaining which account types use which balance
   - Reference the accounting equation
   - Explain impact on transaction posting

### Double-Entry Bookkeeping Principles

#### Fundamental Rule
Every transaction has equal debits and credits, maintaining the accounting equation:
```
Assets = Liabilities + Equity + (Revenue - Expenses)
```

#### Normal Balance by Account Type

| Account Type | Normal Balance | Increases With | Decreases With |
|--------------|----------------|----------------|----------------|
| Asset | DEBIT | Debit entry | Credit entry |
| Liability | CREDIT | Credit entry | Debit entry |
| Equity | CREDIT | Credit entry | Debit entry |
| Revenue | CREDIT | Credit entry | Debit entry |
| Expense | DEBIT | Debit entry | Credit entry |

### Normal Balance Rules Explained

#### DEBIT Normal Balance (Assets & Expenses)

**Assets:**
- Normal balance is on the debit side
- Debiting an asset account increases it
- Crediting an asset account decreases it
- Example: Receiving cash (debit Cash) increases the Cash account

**Expenses:**
- Normal balance is on the debit side
- Debiting an expense account increases it
- Crediting an expense account decreases it
- Example: Paying rent (debit Rent Expense) increases expense

#### CREDIT Normal Balance (Liabilities, Equity & Revenue)

**Liabilities:**
- Normal balance is on the credit side
- Crediting a liability account increases it
- Debiting a liability account decreases it
- Example: Taking a loan (credit Loan Payable) increases liability

**Equity:**
- Normal balance is on the credit side
- Crediting an equity account increases it
- Debiting an equity account decreases it
- Example: Owner investment (credit Capital) increases equity

**Revenue:**
- Normal balance is on the credit side
- Crediting a revenue account increases it
- Debiting a revenue account decreases it
- Example: Making a sale (credit Sales Revenue) increases revenue

### Transaction Examples

#### Example 1: Purchasing Inventory with Cash
```
Debit: Inventory (Asset increases)           $1,000
Credit: Cash (Asset decreases)               $1,000
```

#### Example 2: Making a Sale on Credit
```
Debit: Accounts Receivable (Asset increases) $1,500
Credit: Sales Revenue (Revenue increases)    $1,500
```

#### Example 3: Paying Salary Expense
```
Debit: Salary Expense (Expense increases)    $2,000
Credit: Cash (Asset decreases)               $2,000
```

#### Example 4: Taking a Bank Loan
```
Debit: Cash (Asset increases)                $10,000
Credit: Loan Payable (Liability increases)   $10,000
```

#### Example 5: Owner Investment
```
Debit: Cash (Asset increases)                $5,000
Credit: Capital (Equity increases)           $5,000
```

### Impact on Account Balances

#### Account with DEBIT Normal Balance
- Positive balance shown on debit side
- Debit entries increase balance
- Credit entries decrease balance
- If credits exceed debits, balance is negative (unusual)

#### Account with CREDIT Normal Balance
- Positive balance shown on credit side
- Credit entries increase balance
- Debit entries decrease balance
- If debits exceed credits, balance is negative (unusual)

### Normal Balance Mapping

| Account Type | Normal Balance | Code Range |
|--------------|----------------|------------|
| ASSET | DEBIT | 1000-1999 |
| LIABILITY | CREDIT | 2000-2999 |
| EQUITY | CREDIT | 3000-3999 |
| REVENUE | CREDIT | 4000-4999 |
| EXPENSE | DEBIT | 5000-5999 |

### Expected Outcome
- NormalBalance enum with DEBIT and CREDIT values
- Clear mapping to account types
- Foundation for transaction posting logic
- Support for double-entry validation

### Verification Checklist
- [ ] NormalBalance class defined in enums.py
- [ ] DEBIT enum value created
- [ ] CREDIT enum value created
- [ ] Normal balance rules documented
- [ ] Mapping to account types explained
- [ ] Transaction examples provided (in docstring)

---

## Group A Progress

After completing these tasks, you will have:
- ✅ Accounting Django app created and structured
- ✅ App registered in tenant configuration
- ✅ All enumeration types defined (AccountType, AccountCategory, AccountStatus, NormalBalance)
- ⬜ AccountTypeConfig model (next document)
- ⬜ Fixtures and testing (final document)

### Next Steps
Proceed to [03_Tasks-07-12_AccountTypeConfig-Model.md](03_Tasks-07-12_AccountTypeConfig-Model.md) to create the AccountTypeConfig model that uses these enums to configure the five main account types.

---

## Notes for AI Agents

### Enum Design Considerations
1. **TextChoices vs IntegerChoices**: Use TextChoices for better readability and database clarity
2. **Value Format**: Uppercase values match common accounting terminology
3. **Label Format**: Title case for user-friendly display
4. **Extensibility**: OTHER category allows for custom classifications

### Sri Lankan Accounting Context
- Enums align with Sri Lankan accounting standards
- Support for local business structures (sole proprietor, partnership, company)
- Compatible with Sri Lankan tax requirements
- Multi-language labels (to be added via translation system)

### Double-Entry Validation
- Normal balance determines transaction posting logic
- System should validate that debits equal credits
- Account balance calculations depend on normal balance
- Financial reports use normal balance for proper display

### Testing Considerations
- Test enum value access and display
- Verify enum choices in model fields
- Test enum-based filtering and queries
- Validate enum usage in serializers and forms

### Import Structure
The enums.py file should be imported in models/__init__.py:
```python
from .enums import AccountType, AccountCategory, AccountStatus, NormalBalance
```

This allows clean imports throughout the app:
```python
from apps.accounting.models import AccountType, NormalBalance
```
