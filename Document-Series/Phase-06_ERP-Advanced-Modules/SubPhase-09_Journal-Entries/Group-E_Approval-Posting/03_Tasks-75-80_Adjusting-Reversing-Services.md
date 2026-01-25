# Tasks 75-80: Adjusting & Reversing Entry Services

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** E - Approval & Posting  
> **Document:** 03 of 03  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-70-74_Approval-Workflow.md](02_Tasks-70-74_Approval-Workflow.md)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Document Overview

This document covers the specialized services for creating adjusting and reversing journal entries. These services support GAAP/IFRS-compliant period-end adjustments including accrual and deferral entries, and automate the creation of reversing entries scheduled for the following accounting period.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Create Adjusting Entry Service | High | 45 min |
| 76 | Add Accrual Entry Method | Medium | 30 min |
| 77 | Add Deferral Entry Method | Medium | 30 min |
| 78 | Create Reversing Entry Service | High | 45 min |
| 79 | Add Create Reversal Method | Medium | 35 min |
| 80 | Add Schedule Reversal Method | Medium | 30 min |

---

## Task 75: Create Adjusting Entry Service

### Overview
Create the AdjustingEntryService class that provides specialized functionality for generating period-end adjusting entries. This service handles accrual and deferral entries that comply with GAAP/IFRS accounting standards, ensuring proper revenue and expense recognition across accounting periods.

### Dependencies
- Task 74: Add Reject Entry Method
- JournalEntry model complete
- JournalEntryLine model complete
- AccountingPeriod model available
- ChartOfAccounts model available

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/accounting/` directory
   - Create `services/` subdirectory if not exists
   - Create `__init__.py` in services directory

2. **Create adjusting_service.py file**
   - Create file at `apps/accounting/services/adjusting_service.py`
   - Prepare for service class definition

3. **Import required modules**
   - Import Django database transaction utilities
   - Import JournalEntry and JournalEntryLine models
   - Import ChartOfAccounts model for account lookups
   - Import AccountingPeriod model
   - Import Decimal from decimal module
   - Import date and datetime from datetime module

4. **Add module docstring**
   - Document service purpose (adjusting entry creation)
   - Explain GAAP/IFRS compliance
   - List supported adjustment types
   - Note usage context (month-end, year-end closing)

5. **Define AdjustingEntryService class**
   - Create class with appropriate name
   - Add class docstring explaining functionality
   - Include usage examples in docstring

6. **Add __init__ method**
   - Accept tenant parameter
   - Accept created_by user parameter
   - Store as instance attributes
   - Optional accounting_period parameter

7. **Add _validate_period method**
   - Private method for period validation
   - Check if period exists
   - Verify period is OPEN status
   - Raise ValidationError if period closed/locked
   - Return validated period instance

8. **Add _validate_accounts method**
   - Private method for account validation
   - Accept list of account codes/IDs
   - Verify accounts exist in chart of accounts
   - Check accounts are active
   - Verify accounts allow manual entries
   - Raise ValidationError for invalid accounts
   - Return list of validated account instances

9. **Add _create_entry_base method**
   - Private method for common entry creation
   - Accept entry_date, description, reference
   - Create JournalEntry instance
   - Set tenant, created_by, entry_type=ADJUSTING
   - Set status=DRAFT initially
   - Set source='adjusting_entries'
   - Return created entry instance

10. **Add _add_entry_lines method**
    - Private method for adding lines to entry
    - Accept entry instance and list of line data
    - Line data includes: account, debit/credit, description
    - Create JournalEntryLine for each item
    - Validate debits equal credits
    - Raise ValidationError if unbalanced
    - Return list of created lines

11. **Update services/__init__.py**
    - Import AdjustingEntryService
    - Add to __all__ list for clean imports

### AdjustingEntryService Structure

```
┌─────────────────────────────────────────────────┐
│       AdjustingEntryService Class               │
├─────────────────────────────────────────────────┤
│ Initialization:                                 │
│  • __init__(tenant, created_by, period)         │
│                                                 │
│ Private Validation Methods:                     │
│  • _validate_period()                           │
│  • _validate_accounts(accounts)                 │
│                                                 │
│ Private Creation Methods:                       │
│  • _create_entry_base(date, desc, ref)          │
│  • _add_entry_lines(entry, lines)               │
│                                                 │
│ Public Methods (Next Tasks):                    │
│  • create_accrual_entry() - Task 76             │
│  • create_deferral_entry() - Task 77            │
└─────────────────────────────────────────────────┘
```

### Service Usage Flow

```
Initialize Service
        │
        ├─> Set tenant
        ├─> Set created_by user
        └─> Set accounting period
        │
        ▼
Validate Period
        │
        ├─> Check period exists
        ├─> Verify status = OPEN
        └─> Raise error if closed/locked
        │
        ▼
Validate Accounts
        │
        ├─> Verify accounts exist
        ├─> Check accounts active
        └─> Verify manual entry allowed
        │
        ▼
Create Base Entry
        │
        ├─> Set entry type = ADJUSTING
        ├─> Set status = DRAFT
        ├─> Set source = adjusting_entries
        └─> Set date, description, reference
        │
        ▼
Add Entry Lines
        │
        ├─> Create debit lines
        ├─> Create credit lines
        ├─> Validate balance (DR = CR)
        └─> Raise error if unbalanced
        │
        ▼
Return Created Entry
```

### Adjusting Entry Types Overview

#### Accrual Adjustments
Recognize revenue earned or expense incurred but not yet recorded:
- **Accrued Revenue:** Revenue earned but not yet billed/received
- **Accrued Expense:** Expense incurred but not yet paid

#### Deferral Adjustments
Recognize previously recorded amounts in current period:
- **Deferred Revenue:** Recognize earned portion of advance payment
- **Deferred Expense:** Recognize used portion of prepayment

### Period Status Validation

| Period Status | Allow Adjusting Entries | Action |
|--------------|------------------------|--------|
| OPEN | Yes | Allow creation |
| CLOSED | No | Reject with error |
| LOCKED | No | Reject with error |

### Account Validation Rules

| Validation Check | Required | Error Message |
|-----------------|----------|---------------|
| Account exists | Yes | "Account not found in chart" |
| Account active | Yes | "Account is inactive" |
| Allow manual entries | Yes | "Account locked for manual entries" |
| Account type appropriate | Yes | "Invalid account type for adjustment" |

### Expected Entry Structure

```
Adjusting Entry Template
═══════════════════════
Entry Type: ADJUSTING
Status: DRAFT (initially)
Source: adjusting_entries
Entry Date: [period end date]
Description: [adjustment description]
Reference: [optional reference number]

Lines:
  DR [Expense/Asset Account]     XXX.XX
      CR [Liability/Revenue Account]     XXX.XX
```

### Sri Lanka Context

#### Fiscal Period Considerations
- Standard fiscal year: April 1 to March 31
- Calendar year alternative: January 1 to December 31
- Month-end adjustments common: 12 times per year
- Year-end adjustments critical: Once per fiscal year

#### Common Adjusting Scenarios

**Employee Provident Fund (EPF) Accrual:**
```
DR EPF Expense                  12,000.00
    CR EPF Payable                          12,000.00
```

**Employees' Trust Fund (ETF) Accrual:**
```
DR ETF Expense                   3,000.00
    CR ETF Payable                           3,000.00
```

**Unearned Subscription Revenue:**
```
DR Unearned Revenue             25,000.00
    CR Subscription Revenue                 25,000.00
```

**Prepaid Rent Adjustment:**
```
DR Rent Expense                 50,000.00
    CR Prepaid Rent                         50,000.00
```

### Error Handling

| Error Scenario | Validation | Error Type |
|---------------|------------|------------|
| Period closed | _validate_period() | ValidationError |
| Period locked | _validate_period() | ValidationError |
| Account not found | _validate_accounts() | ValidationError |
| Account inactive | _validate_accounts() | ValidationError |
| Unbalanced entry | _add_entry_lines() | ValidationError |
| Missing required data | Various methods | ValidationError |

### Service Instance Example

```
Usage Pattern:
══════════════
service = AdjustingEntryService(
    tenant=current_tenant,
    created_by=request.user,
    accounting_period=period_december_2025
)

# Service validates period status
# Service validates user permissions
# Ready to create adjusting entries
```

### Expected Outcome
- Functional AdjustingEntryService class
- Robust period validation
- Comprehensive account validation
- Base entry creation functionality
- Line addition with balance validation
- Foundation for accrual and deferral methods

### Verification Checklist
- [ ] services/ directory created
- [ ] services/__init__.py exists
- [ ] adjusting_service.py file created
- [ ] Module docstring added
- [ ] Required modules imported
- [ ] AdjustingEntryService class defined
- [ ] __init__ method implemented
- [ ] _validate_period method added
- [ ] _validate_accounts method added
- [ ] _create_entry_base method added
- [ ] _add_entry_lines method added
- [ ] Service imported in __init__.py
- [ ] Class docstring comprehensive

---

## Task 76: Add Accrual Entry Method

### Overview
Add the create_accrual_entry method to AdjustingEntryService for generating accrual adjusting entries. Accrual entries recognize revenue earned or expenses incurred in the current period that have not yet been recorded through normal transactions.

### Dependencies
- Task 75: Create Adjusting Entry Service

### Instructions

1. **Open adjusting_service.py file**
   - Navigate to `apps/accounting/services/adjusting_service.py`
   - Locate AdjustingEntryService class

2. **Add create_accrual_entry method**
   - Public method for accrual entry creation
   - Add comprehensive method docstring
   - Include parameters documentation
   - Document return value

3. **Define method signature**
   - Parameter: accrual_type (string: 'revenue' or 'expense')
   - Parameter: account_code (code for accrued account)
   - Parameter: offsetting_account_code (revenue/expense account)
   - Parameter: amount (Decimal, must be positive)
   - Parameter: entry_date (date object)
   - Parameter: description (string)
   - Parameter: reference (optional string)

4. **Add parameter validation**
   - Validate accrual_type is 'revenue' or 'expense'
   - Validate amount is positive Decimal
   - Validate entry_date within accounting period
   - Validate description not empty
   - Raise ValidationError for invalid parameters

5. **Validate accounting period**
   - Use _validate_period() method
   - Ensure entry_date falls within period dates
   - Verify period status is OPEN

6. **Validate accounts**
   - Use _validate_accounts() for both accounts
   - Verify accrued account type matches accrual_type
   - For 'expense': accrued account should be liability
   - For 'revenue': accrued account should be asset
   - Verify offsetting account is appropriate type

7. **Build entry description**
   - If accrual_type='expense': "Accrued Expense - {description}"
   - If accrual_type='revenue': "Accrued Revenue - {description}"
   - Include period identifier in description

8. **Create base entry**
   - Use _create_entry_base() method
   - Pass entry_date, description, reference
   - Set entry_type=ADJUSTING automatically

9. **Prepare line items**
   - For 'expense' accrual:
     - Debit: Expense account (offsetting_account)
     - Credit: Accrued Liability account (accrued_account)
   - For 'revenue' accrual:
     - Debit: Accrued Asset account (accrued_account)
     - Credit: Revenue account (offsetting_account)

10. **Add lines to entry**
    - Use _add_entry_lines() method
    - Pass prepared line items
    - Method validates balance automatically

11. **Calculate and set totals**
    - Set entry.total_debit = amount
    - Set entry.total_credit = amount
    - Save entry instance

12. **Return created entry**
    - Return JournalEntry instance
    - Entry status should be DRAFT
    - Ready for review and posting

### Accrual Entry Method Logic

```
Create Accrual Entry Flow
═════════════════════════

1. Validate Parameters
   ├─> Check accrual_type ('revenue' or 'expense')
   ├─> Validate amount > 0
   ├─> Validate entry_date
   └─> Validate description

2. Validate Period & Accounts
   ├─> Check period status
   ├─> Verify accounts exist
   └─> Confirm account types

3. Build Entry Description
   └─> Format: "Accrued [Type] - [Description]"

4. Create Base Entry
   └─> Entry type: ADJUSTING

5. Prepare Lines Based on Type
   
   Expense Accrual:
   DR Expense Account         XXX.XX
       CR Accrued Liability           XXX.XX
   
   Revenue Accrual:
   DR Accrued Asset           XXX.XX
       CR Revenue Account             XXX.XX

6. Add Lines & Set Totals

7. Return Draft Entry
```

### Accrued Expense Example

**Scenario:** Accrued salary expense of LKR 150,000 for December 2025

```
Entry Details:
══════════════
Type: Expense Accrual
Date: December 31, 2025
Description: Accrued Expense - December Salary
Amount: 150,000.00

Entry Lines:
DR Salary Expense (5010)              150,000.00
    CR Salaries Payable (2110)                    150,000.00
```

### Accrued Revenue Example

**Scenario:** Accrued service revenue of LKR 75,000 for December 2025

```
Entry Details:
══════════════
Type: Revenue Accrual
Date: December 31, 2025
Description: Accrued Revenue - December Services
Amount: 75,000.00

Entry Lines:
DR Accrued Revenue (1210)              75,000.00
    CR Service Revenue (4010)                     75,000.00
```

### Account Type Validation

| Accrual Type | Primary Account | Account Type | Offsetting Account | Account Type |
|--------------|----------------|--------------|-------------------|--------------|
| expense | Accrued Liability | LIABILITY | Expense | EXPENSE |
| revenue | Accrued Asset | ASSET | Revenue | REVENUE |

### Sri Lanka Specific Accruals

#### EPF/ETF Accrual (Expense)
```python
service.create_accrual_entry(
    accrual_type='expense',
    account_code='2120',  # EPF Payable
    offsetting_account_code='5020',  # EPF Expense
    amount=Decimal('12000.00'),
    entry_date=date(2025, 12, 31),
    description='December EPF Contribution'
)
```

**Generated Entry:**
```
DR EPF Expense (5020)                  12,000.00
    CR EPF Payable (2120)                          12,000.00
```

#### Professional Services Revenue Accrual
```python
service.create_accrual_entry(
    accrual_type='revenue',
    account_code='1210',  # Accrued Revenue
    offsetting_account_code='4020',  # Professional Services
    amount=Decimal('250000.00'),
    entry_date=date(2025, 12, 31),
    description='December Consulting Services'
)
```

**Generated Entry:**
```
DR Accrued Revenue (1210)             250,000.00
    CR Professional Services (4020)               250,000.00
```

#### Utility Expense Accrual
```python
service.create_accrual_entry(
    accrual_type='expense',
    account_code='2150',  # Utilities Payable
    offsetting_account_code='5030',  # Utility Expense
    amount=Decimal('35000.00'),
    entry_date=date(2025, 12, 31),
    description='December Electricity'
)
```

**Generated Entry:**
```
DR Utility Expense (5030)              35,000.00
    CR Utilities Payable (2150)                    35,000.00
```

### Common Use Cases

| Scenario | Accrual Type | Primary Account | Offsetting Account |
|----------|-------------|----------------|-------------------|
| Unpaid salaries | expense | Salaries Payable | Salary Expense |
| EPF contribution | expense | EPF Payable | EPF Expense |
| ETF contribution | expense | ETF Payable | ETF Expense |
| Unbilled services | revenue | Accrued Revenue | Service Revenue |
| Interest earned | revenue | Interest Receivable | Interest Income |
| Unpaid utilities | expense | Utilities Payable | Utility Expense |
| Unpaid rent | expense | Rent Payable | Rent Expense |

### Method Parameters

| Parameter | Type | Required | Validation | Default |
|-----------|------|----------|-----------|---------|
| accrual_type | str | Yes | Must be 'revenue' or 'expense' | - |
| account_code | str | Yes | Must exist, active, correct type | - |
| offsetting_account_code | str | Yes | Must exist, active, correct type | - |
| amount | Decimal | Yes | Must be positive | - |
| entry_date | date | Yes | Within period range | - |
| description | str | Yes | Not empty, max 500 chars | - |
| reference | str | No | Max 50 chars | None |

### Expected Outcome
- Functional create_accrual_entry method
- Support for both expense and revenue accruals
- Proper debit/credit positioning
- Comprehensive validation
- Clear error messages
- GAAP/IFRS compliant entries

### Verification Checklist
- [ ] create_accrual_entry method added
- [ ] Method docstring complete
- [ ] accrual_type parameter validated
- [ ] amount validated as positive
- [ ] entry_date validated in period
- [ ] Accounts validated for type
- [ ] Expense accrual logic correct (DR expense, CR liability)
- [ ] Revenue accrual logic correct (DR asset, CR revenue)
- [ ] Entry description properly formatted
- [ ] Lines balanced automatically
- [ ] Entry totals calculated
- [ ] Draft entry returned

---

## Task 77: Add Deferral Entry Method

### Overview
Add the create_deferral_entry method to AdjustingEntryService for generating deferral adjusting entries. Deferral entries recognize the earned or used portion of previously recorded advance payments or prepayments, transferring amounts from balance sheet accounts to income statement accounts.

### Dependencies
- Task 76: Add Accrual Entry Method

### Instructions

1. **Open adjusting_service.py file**
   - Continue in `apps/accounting/services/adjusting_service.py`
   - Locate AdjustingEntryService class

2. **Add create_deferral_entry method**
   - Public method for deferral entry creation
   - Add comprehensive method docstring
   - Include parameters documentation
   - Document return value and usage examples

3. **Define method signature**
   - Parameter: deferral_type (string: 'revenue' or 'expense')
   - Parameter: deferred_account_code (balance sheet account)
   - Parameter: recognition_account_code (income statement account)
   - Parameter: amount (Decimal, must be positive)
   - Parameter: entry_date (date object)
   - Parameter: description (string)
   - Parameter: reference (optional string)

4. **Add parameter validation**
   - Validate deferral_type is 'revenue' or 'expense'
   - Validate amount is positive Decimal
   - Validate entry_date within accounting period
   - Validate description not empty
   - Raise ValidationError for invalid parameters

5. **Validate accounting period**
   - Use _validate_period() method
   - Ensure entry_date falls within period dates
   - Verify period status is OPEN

6. **Validate accounts**
   - Use _validate_accounts() for both accounts
   - For 'revenue' deferral:
     - Deferred account should be LIABILITY (Unearned Revenue)
     - Recognition account should be REVENUE
   - For 'expense' deferral:
     - Deferred account should be ASSET (Prepaid Expense)
     - Recognition account should be EXPENSE

7. **Build entry description**
   - If deferral_type='revenue': "Deferred Revenue Recognition - {description}"
   - If deferral_type='expense': "Prepaid Expense Recognition - {description}"
   - Include period identifier in description

8. **Create base entry**
   - Use _create_entry_base() method
   - Pass entry_date, description, reference
   - Entry type automatically set to ADJUSTING

9. **Prepare line items**
   - For 'revenue' deferral:
     - Debit: Unearned Revenue (deferred_account)
     - Credit: Revenue account (recognition_account)
   - For 'expense' deferral:
     - Debit: Expense account (recognition_account)
     - Credit: Prepaid Expense (deferred_account)

10. **Add lines to entry**
    - Use _add_entry_lines() method
    - Pass prepared line items
    - Method validates balance automatically

11. **Calculate and set totals**
    - Set entry.total_debit = amount
    - Set entry.total_credit = amount
    - Save entry instance

12. **Return created entry**
    - Return JournalEntry instance
    - Entry status should be DRAFT
    - Ready for review and posting

### Deferral Entry Method Logic

```
Create Deferral Entry Flow
══════════════════════════

1. Validate Parameters
   ├─> Check deferral_type ('revenue' or 'expense')
   ├─> Validate amount > 0
   ├─> Validate entry_date
   └─> Validate description

2. Validate Period & Accounts
   ├─> Check period status
   ├─> Verify accounts exist
   └─> Confirm account types

3. Build Entry Description
   └─> Format: "[Type] Recognition - [Description]"

4. Create Base Entry
   └─> Entry type: ADJUSTING

5. Prepare Lines Based on Type
   
   Revenue Deferral:
   DR Unearned Revenue        XXX.XX
       CR Revenue Account             XXX.XX
   
   Expense Deferral:
   DR Expense Account         XXX.XX
       CR Prepaid Expense             XXX.XX

6. Add Lines & Set Totals

7. Return Draft Entry
```

### Deferred Revenue Example

**Scenario:** Recognize LKR 100,000 of 12-month subscription received in advance

```
Original Receipt Entry (July 1, 2025):
DR Cash                              1,200,000.00
    CR Unearned Revenue                           1,200,000.00

Monthly Deferral Entry (December 31, 2025):
═════════════════════════════════════════════
Type: Revenue Deferral
Date: December 31, 2025
Description: Deferred Revenue Recognition - December Subscription
Amount: 100,000.00

Entry Lines:
DR Unearned Revenue (2410)           100,000.00
    CR Subscription Revenue (4050)               100,000.00
```

### Prepaid Expense Example

**Scenario:** Recognize LKR 50,000 of 12-month insurance prepayment

```
Original Payment Entry (January 1, 2025):
DR Prepaid Insurance                   600,000.00
    CR Cash                                        600,000.00

Monthly Deferral Entry (December 31, 2025):
═════════════════════════════════════════════
Type: Expense Deferral
Date: December 31, 2025
Description: Prepaid Expense Recognition - December Insurance
Amount: 50,000.00

Entry Lines:
DR Insurance Expense (5050)           50,000.00
    CR Prepaid Insurance (1310)                   50,000.00
```

### Account Type Validation

| Deferral Type | Deferred Account | Account Type | Recognition Account | Account Type |
|--------------|------------------|--------------|---------------------|--------------|
| revenue | Unearned Revenue | LIABILITY | Revenue | REVENUE |
| expense | Prepaid Expense | ASSET | Expense | EXPENSE |

### Debit/Credit Rules

```
Revenue Deferral (Recognizing Earned Portion):
═══════════════════════════════════════════════
    Unearned Revenue (LIABILITY ↓)      →  Debit
    Revenue (REVENUE ↑)                 →  Credit

Expense Deferral (Recognizing Used Portion):
════════════════════════════════════════════
    Expense (EXPENSE ↑)                 →  Debit
    Prepaid Expense (ASSET ↓)           →  Credit
```

### Sri Lanka Specific Deferrals

#### Annual Software License Deferral
```python
service.create_deferral_entry(
    deferral_type='expense',
    deferred_account_code='1320',  # Prepaid Software
    recognition_account_code='5060',  # Software Expense
    amount=Decimal('25000.00'),
    entry_date=date(2025, 12, 31),
    description='December Software License'
)
```

**Generated Entry:**
```
DR Software Expense (5060)             25,000.00
    CR Prepaid Software (1320)                     25,000.00
```

#### Advance Maintenance Contract Deferral
```python
service.create_deferral_entry(
    deferral_type='revenue',
    deferred_account_code='2420',  # Unearned Maintenance
    recognition_account_code='4030',  # Maintenance Revenue
    amount=Decimal('40000.00'),
    entry_date=date(2025, 12, 31),
    description='December Maintenance Service'
)
```

**Generated Entry:**
```
DR Unearned Maintenance (2420)         40,000.00
    CR Maintenance Revenue (4030)                  40,000.00
```

#### Prepaid Rent Deferral
```python
service.create_deferral_entry(
    deferral_type='expense',
    deferred_account_code='1330',  # Prepaid Rent
    recognition_account_code='5070',  # Rent Expense
    amount=Decimal('75000.00'),
    entry_date=date(2025, 12, 31),
    description='December Rent Expense'
)
```

**Generated Entry:**
```
DR Rent Expense (5070)                 75,000.00
    CR Prepaid Rent (1330)                         75,000.00
```

### Common Deferral Scenarios

| Scenario | Deferral Type | Deferred Account | Recognition Account | Frequency |
|----------|--------------|------------------|---------------------|-----------|
| Annual subscription | revenue | Unearned Revenue | Subscription Revenue | Monthly |
| Prepaid insurance | expense | Prepaid Insurance | Insurance Expense | Monthly |
| Advance maintenance | revenue | Unearned Maintenance | Maintenance Revenue | As earned |
| Prepaid rent | expense | Prepaid Rent | Rent Expense | Monthly |
| Annual software license | expense | Prepaid Software | Software Expense | Monthly |
| Retainer fees | revenue | Unearned Fees | Service Revenue | As earned |

### Calculation Examples

#### 12-Month Subscription (LKR 1,200,000)
```
Total Amount: 1,200,000.00
Period: 12 months
Monthly Recognition: 1,200,000 / 12 = 100,000.00

Month 1 (July):   DR Unearned Revenue 100,000  CR Revenue 100,000
Month 2 (August): DR Unearned Revenue 100,000  CR Revenue 100,000
...
Month 6 (Dec):    DR Unearned Revenue 100,000  CR Revenue 100,000

Remaining Balance: 1,200,000 - (6 × 100,000) = 600,000
```

#### 6-Month Insurance (LKR 300,000)
```
Total Amount: 300,000.00
Period: 6 months
Monthly Recognition: 300,000 / 6 = 50,000.00

Month 1: DR Insurance Expense 50,000  CR Prepaid Insurance 50,000
Month 2: DR Insurance Expense 50,000  CR Prepaid Insurance 50,000
...
Month 6: DR Insurance Expense 50,000  CR Prepaid Insurance 50,000

Final Balance: 0 (fully recognized)
```

### Method Parameters

| Parameter | Type | Required | Validation | Default |
|-----------|------|----------|-----------|---------|
| deferral_type | str | Yes | Must be 'revenue' or 'expense' | - |
| deferred_account_code | str | Yes | Must exist, active, correct type | - |
| recognition_account_code | str | Yes | Must exist, active, correct type | - |
| amount | Decimal | Yes | Must be positive | - |
| entry_date | date | Yes | Within period range | - |
| description | str | Yes | Not empty, max 500 chars | - |
| reference | str | No | Max 50 chars | None |

### Expected Outcome
- Functional create_deferral_entry method
- Support for both revenue and expense deferrals
- Proper account type validation
- Correct debit/credit positioning
- Clear entry descriptions
- GAAP/IFRS compliant recognition

### Verification Checklist
- [ ] create_deferral_entry method added
- [ ] Method docstring complete
- [ ] deferral_type parameter validated
- [ ] amount validated as positive
- [ ] entry_date validated in period
- [ ] Deferred account validated for type
- [ ] Recognition account validated for type
- [ ] Revenue deferral logic correct (DR liability, CR revenue)
- [ ] Expense deferral logic correct (DR expense, CR asset)
- [ ] Entry description properly formatted
- [ ] Lines balanced automatically
- [ ] Entry totals calculated
- [ ] Draft entry returned

---

## Task 78: Create Reversing Entry Service

### Overview
Create the ReversingEntryService class that automates the creation of reversing journal entries. This service generates exact opposite entries for adjusting entries that should reverse in the following accounting period, commonly used for accrual-basis adjustments that will be replaced by actual transactions.

### Dependencies
- Task 77: Add Deferral Entry Method
- JournalEntry model with reversal_of FK field
- AccountingPeriod model available

### Instructions

1. **Create reversing_service.py file**
   - Create file at `apps/accounting/services/reversing_service.py`
   - Prepare for service class definition

2. **Import required modules**
   - Import Django database transaction utilities
   - Import JournalEntry and JournalEntryLine models
   - Import AccountingPeriod model
   - Import Decimal from decimal module
   - Import date, timedelta from datetime module
   - Import Q from django.db.models for complex queries

3. **Add module docstring**
   - Document service purpose (reversing entry automation)
   - Explain when reversing entries are used
   - List common scenarios (accruals, prepayments)
   - Note automatic posting behavior

4. **Define ReversingEntryService class**
   - Create class with appropriate name
   - Add class docstring explaining functionality
   - Include usage examples in docstring

5. **Add __init__ method**
   - Accept tenant parameter
   - Accept created_by user parameter
   - Store as instance attributes
   - Optional next_period parameter

6. **Add _get_next_period method**
   - Private method for retrieving next accounting period
   - Accept current_period parameter
   - Query AccountingPeriod for next period
   - Filter by tenant, year/month following current period
   - Return next period instance or None
   - Raise ValidationError if next period not found

7. **Add _get_first_day_of_next_period method**
   - Private method for calculating reversal date
   - Accept current_period or entry_date
   - Determine first day of next period
   - Return date object
   - Used as default reversal date

8. **Add _validate_reversible_entry method**
   - Private method for entry validation
   - Accept entry instance
   - Verify entry is posted (status=POSTED)
   - Verify entry type is ADJUSTING
   - Check entry not already reversed
   - Raise ValidationError if not reversible
   - Return True if valid

9. **Add _swap_debit_credit method**
   - Private method for swapping line amounts
   - Accept JournalEntryLine instance
   - Return new line data with swapped DR/CR
   - If original has debit, new has credit (same amount)
   - If original has credit, new has debit (same amount)

10. **Update services/__init__.py**
    - Import ReversingEntryService
    - Add to __all__ list for clean imports

### ReversingEntryService Structure

```
┌─────────────────────────────────────────────────┐
│       ReversingEntryService Class               │
├─────────────────────────────────────────────────┤
│ Initialization:                                 │
│  • __init__(tenant, created_by)                 │
│                                                 │
│ Private Helper Methods:                         │
│  • _get_next_period(current_period)             │
│  • _get_first_day_of_next_period(date)          │
│  • _validate_reversible_entry(entry)            │
│  • _swap_debit_credit(line)                     │
│                                                 │
│ Public Methods (Next Tasks):                    │
│  • create_reversal(entry, reversal_date)        │
│  • schedule_reversal(entry)                     │
└─────────────────────────────────────────────────┘
```

### Reversing Entry Concept

```
Original Adjusting Entry (December 31, 2025):
═════════════════════════════════════════════
DR Salary Expense                  150,000.00
    CR Salaries Payable                        150,000.00

Reversing Entry (January 1, 2026):
══════════════════════════════════
DR Salaries Payable               150,000.00
    CR Salary Expense                          150,000.00

Effect: Zeros out the accrual when actual payment recorded
```

### Reversal Process Flow

```
Step 1: Identify Adjusting Entry
        ├─> Entry must be POSTED
        ├─> Entry type = ADJUSTING
        └─> Not already reversed

Step 2: Determine Reversal Date
        ├─> First day of next period
        └─> Or custom date specified

Step 3: Create Reversal Entry
        ├─> Copy entry metadata
        ├─> Set entry_type = REVERSING
        ├─> Set reversal_of FK
        └─> Set reversal date

Step 4: Swap All Lines
        ├─> For each original line
        ├─> Swap debit ↔ credit
        └─> Keep same account

Step 5: Post Reversal
        └─> Auto-post on creation or schedule
```

### Reversible Entry Validation

| Validation Check | Required Value | Error if Not Met |
|-----------------|----------------|------------------|
| Entry status | POSTED | "Only posted entries can be reversed" |
| Entry type | ADJUSTING | "Only adjusting entries can be reversed" |
| Already reversed | False | "Entry already has a reversal" |
| Lines exist | True | "Entry has no lines to reverse" |

### Debit/Credit Swap Logic

```
Original Line Structure:
═══════════════════════
Account: Salary Expense (5010)
Debit: 150,000.00
Credit: 0.00

Reversed Line Structure:
═══════════════════════
Account: Salary Expense (5010)
Debit: 0.00
Credit: 150,000.00

Original Line Structure:
═══════════════════════
Account: Salaries Payable (2110)
Debit: 0.00
Credit: 150,000.00

Reversed Line Structure:
═══════════════════════
Account: Salaries Payable (2110)
Debit: 150,000.00
Credit: 0.00
```

### Next Period Calculation

| Current Period | Current End Date | Next Period Start | Reversal Date |
|---------------|------------------|-------------------|---------------|
| Dec 2025 | 2025-12-31 | 2026-01-01 | 2026-01-01 |
| Mar 2026 | 2026-03-31 | 2026-04-01 | 2026-04-01 |
| Jun 2026 | 2026-06-30 | 2026-07-01 | 2026-07-01 |

### Common Reversing Scenarios

#### Accrued Salary Reversal
```
Original (Dec 31, 2025):
DR Salary Expense                  150,000.00
    CR Salaries Payable                        150,000.00

Reversal (Jan 1, 2026):
DR Salaries Payable               150,000.00
    CR Salary Expense                          150,000.00

Actual Payment (Jan 10, 2026):
DR Salary Expense                  150,000.00
    CR Cash                                    150,000.00

Net Effect:
- December: Expense recognized
- January: Reversal clears accrual, actual payment records correctly
```

#### Accrued Revenue Reversal
```
Original (Dec 31, 2025):
DR Accrued Revenue                  75,000.00
    CR Service Revenue                          75,000.00

Reversal (Jan 1, 2026):
DR Service Revenue                  75,000.00
    CR Accrued Revenue                          75,000.00

Actual Invoice (Jan 5, 2026):
DR Accounts Receivable              75,000.00
    CR Service Revenue                          75,000.00

Net Effect:
- December: Revenue recognized
- January: Reversal clears accrual, actual invoice records correctly
```

### Sri Lanka Context

#### EPF/ETF Accrual Reversal
```
December Accrual:
DR EPF Expense (5020)                12,000.00
DR ETF Expense (5025)                 3,000.00
    CR EPF Payable (2120)                        12,000.00
    CR ETF Payable (2125)                         3,000.00

January Reversal:
DR EPF Payable (2120)                12,000.00
DR ETF Payable (2125)                 3,000.00
    CR EPF Expense (5020)                        12,000.00
    CR ETF Expense (5025)                         3,000.00

January Actual Payment:
DR EPF Expense (5020)                12,000.00
DR ETF Expense (5025)                 3,000.00
    CR Cash (1010)                               15,000.00
```

### Reversal FK Relationship

```
Original Entry (ID: 1234)
    ├─> reversal_of: NULL
    └─> status: POSTED

Reversing Entry (ID: 1235)
    ├─> reversal_of: 1234
    └─> status: POSTED

Query original's reversal:
JournalEntry.objects.get(reversal_of=1234)

Query if entry has reversal:
entry.journalentry_set.filter(
    entry_type='REVERSING'
).exists()
```

### Expected Outcome
- Functional ReversingEntryService class
- Next period calculation logic
- Reversible entry validation
- Debit/credit swap mechanism
- Foundation for reversal creation

### Verification Checklist
- [ ] reversing_service.py file created
- [ ] Module docstring added
- [ ] Required modules imported
- [ ] ReversingEntryService class defined
- [ ] __init__ method implemented
- [ ] _get_next_period method added
- [ ] _get_first_day_of_next_period method added
- [ ] _validate_reversible_entry method added
- [ ] _swap_debit_credit method added
- [ ] Service imported in __init__.py
- [ ] Class docstring comprehensive

---

## Task 79: Add Create Reversal Method

### Overview
Add the create_reversal method to ReversingEntryService that generates a reversing journal entry for a given adjusting entry. This method creates an exact opposite entry with swapped debits and credits, linking it to the original entry and scheduling it for the next accounting period.

### Dependencies
- Task 78: Create Reversing Entry Service

### Instructions

1. **Open reversing_service.py file**
   - Navigate to `apps/accounting/services/reversing_service.py`
   - Locate ReversingEntryService class

2. **Add create_reversal method**
   - Public method for reversal entry creation
   - Add comprehensive method docstring
   - Include parameters documentation
   - Document return value

3. **Define method signature**
   - Parameter: original_entry (JournalEntry instance)
   - Parameter: reversal_date (date object, optional)
   - Parameter: description_override (string, optional)
   - Parameter: auto_post (boolean, default=True)

4. **Validate original entry**
   - Use _validate_reversible_entry() method
   - Ensures entry is posted and adjusting type
   - Verifies not already reversed

5. **Determine reversal date**
   - If reversal_date not provided:
     - Use _get_first_day_of_next_period()
     - Calculate from original entry date
   - If provided, validate date is after original entry date
   - Ensure date within next accounting period

6. **Build reversal description**
   - If description_override provided, use it
   - Otherwise format: "Reversal of Entry #{entry_number}"
   - Include original entry date in description
   - Make clear this is automatic reversal

7. **Create reversal entry instance**
   - Copy tenant from original entry
   - Set entry_type = REVERSING
   - Set reversal_of FK to original entry
   - Set entry_date = reversal_date
   - Set created_by to service user
   - Set source = 'auto_reversal'
   - Set status = DRAFT initially

8. **Copy and swap entry lines**
   - Query original entry's lines
   - For each line:
     - Create new JournalEntryLine
     - Copy account, description
     - Use _swap_debit_credit() to reverse amounts
     - Link to new reversal entry

9. **Calculate totals**
   - Sum all debit amounts
   - Sum all credit amounts
   - Set reversal_entry.total_debit
   - Set reversal_entry.total_credit
   - Should match original amounts

10. **Auto-post if requested**
    - If auto_post=True:
      - Set status = POSTED
      - Set posted_at = now()
      - Set posted_by = service user
    - Otherwise leave as DRAFT for manual review

11. **Save and return**
    - Save reversal entry
    - Return created JournalEntry instance

### Create Reversal Method Flow

```
Create Reversal Entry
═════════════════════

1. Validate Original Entry
   ├─> Must be POSTED
   ├─> Must be ADJUSTING type
   └─> Must not have existing reversal

2. Determine Reversal Date
   ├─> Use provided date OR
   └─> Calculate first day of next period

3. Build Description
   └─> Format: "Reversal of Entry #[number]"

4. Create New Entry
   ├─> entry_type = REVERSING
   ├─> reversal_of = original.id
   ├─> entry_date = reversal_date
   └─> source = 'auto_reversal'

5. Swap and Copy Lines
   ├─> For each original line:
   │   ├─> Copy account
   │   ├─> Swap debit ↔ credit
   │   └─> Copy description
   └─> Validate balance

6. Set Totals
   ├─> total_debit = sum(debit_amounts)
   └─> total_credit = sum(credit_amounts)

7. Post Entry (if auto_post=True)
   ├─> status = POSTED
   ├─> posted_at = now()
   └─> posted_by = user

8. Return Reversal Entry
```

### Complete Reversal Example

```
Original Adjusting Entry (December 31, 2025):
══════════════════════════════════════════════
ID: 1234
Entry Number: JE-2025-1234
Entry Type: ADJUSTING
Status: POSTED
Entry Date: 2025-12-31
Description: Accrued December Salary
Source: adjusting_entries

Lines:
  DR Salary Expense (5010)         150,000.00
      CR Salaries Payable (2110)              150,000.00

Total Debit:  150,000.00
Total Credit: 150,000.00


Reversing Entry Created (January 1, 2026):
═══════════════════════════════════════════
ID: 1235
Entry Number: JE-2026-0001
Entry Type: REVERSING
Status: POSTED (auto-posted)
Entry Date: 2026-01-01
Description: Reversal of Entry #JE-2025-1234
Source: auto_reversal
Reversal Of: 1234

Lines:
  DR Salaries Payable (2110)       150,000.00
      CR Salary Expense (5010)                150,000.00

Total Debit:  150,000.00
Total Credit: 150,000.00
```

### Line Swap Details

```
Original Entry Lines:
═════════════════════
Line 1:
  Account: 5010 (Salary Expense)
  Debit: 150,000.00
  Credit: 0.00
  Description: "December salary accrual"

Line 2:
  Account: 2110 (Salaries Payable)
  Debit: 0.00
  Credit: 150,000.00
  Description: "December salary accrual"


Reversed Entry Lines:
═════════════════════
Line 1:
  Account: 5010 (Salary Expense)
  Debit: 0.00                    ← Swapped from credit
  Credit: 150,000.00             ← Swapped from debit
  Description: "Reversal - December salary accrual"

Line 2:
  Account: 2110 (Salaries Payable)
  Debit: 150,000.00              ← Swapped from credit
  Credit: 0.00                   ← Swapped from debit
  Description: "Reversal - December salary accrual"
```

### Sri Lanka Example: EPF Reversal

```python
# Original EPF accrual entry
original_entry = JournalEntry.objects.get(
    entry_number='JE-2025-1250'
)

# Create reversal
service = ReversingEntryService(
    tenant=current_tenant,
    created_by=request.user
)

reversal = service.create_reversal(
    original_entry=original_entry,
    reversal_date=date(2026, 1, 1),
    auto_post=True
)
```

**Original Entry (Dec 31, 2025):**
```
DR EPF Expense (5020)                12,000.00
    CR EPF Payable (2120)                        12,000.00
```

**Reversal Entry (Jan 1, 2026):**
```
DR EPF Payable (2120)                12,000.00
    CR EPF Expense (5020)                        12,000.00
```

### Multi-Line Entry Reversal

```
Original Entry (Dec 31, 2025):
DR Salary Expense (5010)             100,000.00
DR EPF Expense (5020)                 12,000.00
DR ETF Expense (5025)                  3,000.00
    CR Salaries Payable (2110)                  100,000.00
    CR EPF Payable (2120)                        12,000.00
    CR ETF Payable (2125)                         3,000.00

Reversal Entry (Jan 1, 2026):
DR Salaries Payable (2110)           100,000.00
DR EPF Payable (2120)                 12,000.00
DR ETF Payable (2125)                  3,000.00
    CR Salary Expense (5010)                    100,000.00
    CR EPF Expense (5020)                        12,000.00
    CR ETF Expense (5025)                         3,000.00
```

### Auto-Post Behavior

| auto_post | Entry Status | posted_at | posted_by | Use Case |
|-----------|-------------|-----------|-----------|----------|
| True | POSTED | Current timestamp | Service user | Automatic reversals |
| False | DRAFT | NULL | NULL | Manual review needed |

### Method Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| original_entry | JournalEntry | Yes | - | Entry to reverse |
| reversal_date | date | No | Next period first day | Date for reversal |
| description_override | str | No | Auto-generated | Custom description |
| auto_post | bool | No | True | Auto-post on creation |

### Error Scenarios

| Error Condition | Validation Method | Error Message |
|----------------|------------------|---------------|
| Entry not posted | _validate_reversible_entry | "Entry must be posted" |
| Not adjusting type | _validate_reversible_entry | "Only adjusting entries reversible" |
| Already reversed | _validate_reversible_entry | "Entry already reversed" |
| Invalid date | create_reversal | "Reversal date must be after original" |
| No lines | create_reversal | "Entry has no lines to reverse" |

### Expected Outcome
- Functional create_reversal method
- Automatic line swapping
- Proper FK linking via reversal_of
- Optional auto-posting
- Complete reversal entries ready for use

### Verification Checklist
- [ ] create_reversal method added
- [ ] Method docstring complete
- [ ] original_entry parameter validated
- [ ] reversal_date calculated or validated
- [ ] Reversal entry instance created
- [ ] entry_type set to REVERSING
- [ ] reversal_of FK linked correctly
- [ ] All lines copied and swapped
- [ ] Line descriptions updated
- [ ] Totals calculated correctly
- [ ] Auto-post logic implemented
- [ ] Method returns reversal entry

---

## Task 80: Add Schedule Reversal Method

### Overview
Add the schedule_reversal method to ReversingEntryService that schedules a reversing entry for automatic posting on the first day of the next accounting period. This method creates a reversal entry in DRAFT status with a future entry date, allowing for batch processing of reversals when the period opens.

### Dependencies
- Task 79: Add Create Reversal Method

### Instructions

1. **Open reversing_service.py file**
   - Continue in `apps/accounting/services/reversing_service.py`
   - Locate ReversingEntryService class

2. **Add schedule_reversal method**
   - Public method for scheduling future reversals
   - Add comprehensive method docstring
   - Include parameters documentation
   - Document return value and scheduling behavior

3. **Define method signature**
   - Parameter: original_entry (JournalEntry instance)
   - Parameter: next_period (AccountingPeriod, optional)
   - Parameter: mark_for_auto_post (boolean, default=True)

4. **Validate original entry**
   - Use _validate_reversible_entry() method
   - Ensures entry is posted and adjusting type

5. **Determine next accounting period**
   - If next_period parameter provided, use it
   - Otherwise use _get_next_period() method
   - Validate next period exists
   - Raise ValidationError if no next period found

6. **Calculate reversal date**
   - Use next_period.start_date as reversal date
   - Ensures reversal occurs on first day of period
   - Store date for reversal entry

7. **Create reversal entry**
   - Call create_reversal() method
   - Pass original_entry
   - Pass calculated reversal_date
   - Set auto_post=False (kept as DRAFT)
   - Entry remains unposted until scheduled date

8. **Add scheduling metadata**
   - Add custom metadata field or note
   - Indicate entry scheduled for auto-post
   - Store scheduled_post_date if field exists
   - Mark with 'scheduled_reversal' flag

9. **Update original entry**
   - Optionally add metadata to original
   - Indicate reversal scheduled
   - Store reversal entry ID reference
   - Helps prevent duplicate scheduling

10. **Return scheduled entry**
    - Return reversal JournalEntry instance
    - Entry status should be DRAFT
    - Ready for batch processing on scheduled date

### Schedule Reversal Method Flow

```
Schedule Reversal Entry
═══════════════════════

1. Validate Original Entry
   ├─> Must be POSTED
   ├─> Must be ADJUSTING type
   └─> Must not have existing reversal

2. Determine Next Period
   ├─> Use provided period OR
   └─> Query next period from database

3. Calculate Reversal Date
   └─> Use next_period.start_date

4. Create Draft Reversal
   ├─> Call create_reversal()
   ├─> auto_post = False
   └─> Entry status = DRAFT

5. Add Scheduling Metadata
   ├─> Mark for auto-post
   ├─> Store scheduled date
   └─> Link to original

6. Update Original Entry
   └─> Mark as "reversal scheduled"

7. Return Scheduled Entry
   └─> Ready for batch processing
```

### Scheduled vs Immediate Reversal

| Method | Entry Status | Entry Date | Post Time | Use Case |
|--------|-------------|------------|-----------|----------|
| create_reversal() | POSTED | Immediate/custom | Immediately | Manual reversals, same-day |
| schedule_reversal() | DRAFT | Next period start | On period open | Automated, batch processing |

### Scheduling Workflow

```
December 31, 2025: Create Adjusting Entry
        │
        ├─> DR Salary Expense       150,000
        └─> CR Salaries Payable                150,000
        │
        ▼
December 31, 2025: Schedule Reversal
        │
        ├─> Create reversal entry (DRAFT)
        ├─> Entry date: January 1, 2026
        ├─> Mark for auto-post
        └─> Link to original entry
        │
        ▼
January 1, 2026: Period Opens
        │
        ▼
Batch Process: Auto-Post Scheduled Reversals
        │
        ├─> Find all DRAFT entries
        ├─> Filter: entry_date = today
        ├─> Filter: entry_type = REVERSING
        ├─> Filter: mark_for_auto_post = True
        └─> Post all matching entries
        │
        ▼
Result: Reversal Posted Automatically
```

### Batch Processing Query

```python
# Query to find reversals ready for auto-posting
from django.utils import timezone

today = timezone.now().date()

scheduled_reversals = JournalEntry.objects.filter(
    tenant=current_tenant,
    entry_type='REVERSING',
    status='DRAFT',
    entry_date=today,
    # Assuming metadata field for scheduling flag
    metadata__auto_post=True
)

# Post each scheduled reversal
for entry in scheduled_reversals:
    entry.post()  # Using post() method from earlier tasks
```

### Complete Scheduling Example

```python
# December 31, 2025 - Close month with accruals
service = ReversingEntryService(
    tenant=current_tenant,
    created_by=accounting_manager
)

# Get December accrual entries
accrual_entries = JournalEntry.objects.filter(
    tenant=current_tenant,
    entry_type='ADJUSTING',
    status='POSTED',
    entry_date__month=12,
    entry_date__year=2025
)

# Schedule reversals for each accrual
for entry in accrual_entries:
    reversal = service.schedule_reversal(
        original_entry=entry,
        mark_for_auto_post=True
    )
    print(f"Scheduled reversal {reversal.entry_number} for {reversal.entry_date}")

# Output:
# Scheduled reversal JE-2026-0001 for 2026-01-01
# Scheduled reversal JE-2026-0002 for 2026-01-01
# Scheduled reversal JE-2026-0003 for 2026-01-01
```

### Sri Lanka Month-End Close Example

```python
# December 31, 2025 - Schedule all statutory accruals
service = ReversingEntryService(
    tenant=current_tenant,
    created_by=request.user
)

# EPF Accrual
epf_entry = JournalEntry.objects.get(entry_number='JE-2025-1250')
epf_reversal = service.schedule_reversal(epf_entry)

# ETF Accrual
etf_entry = JournalEntry.objects.get(entry_number='JE-2025-1251')
etf_reversal = service.schedule_reversal(etf_entry)

# Salary Accrual
salary_entry = JournalEntry.objects.get(entry_number='JE-2025-1252')
salary_reversal = service.schedule_reversal(salary_entry)

# All will auto-post on January 1, 2026
```

**Scheduled Entries:**
```
Entry: JE-2026-0001 (DRAFT)
Date: 2026-01-01
Type: REVERSING
Description: Reversal of Entry #JE-2025-1250
Auto-Post: Enabled

Entry: JE-2026-0002 (DRAFT)
Date: 2026-01-01
Type: REVERSING
Description: Reversal of Entry #JE-2025-1251
Auto-Post: Enabled

Entry: JE-2026-0003 (DRAFT)
Date: 2026-01-01
Type: REVERSING
Description: Reversal of Entry #JE-2025-1252
Auto-Post: Enabled
```

### Metadata Structure

```python
# If using JSONField for metadata
reversal_entry.metadata = {
    'auto_post': True,
    'scheduled_date': '2026-01-01',
    'scheduling_type': 'period_reversal',
    'original_entry_id': original_entry.id,
    'original_entry_number': 'JE-2025-1250',
    'scheduled_by': 'accounting_manager',
    'scheduled_at': '2025-12-31T23:45:00Z'
}
```

### Reversal Status Tracking

```
Original Entry:
  ├─> entry_number: JE-2025-1250
  ├─> status: POSTED
  └─> metadata: {
          'has_scheduled_reversal': true,
          'reversal_entry_id': 1235,
          'reversal_scheduled_for': '2026-01-01'
      }

Reversal Entry:
  ├─> entry_number: JE-2026-0001
  ├─> status: DRAFT
  ├─> reversal_of: 1234
  └─> metadata: {
          'auto_post': true,
          'scheduled_date': '2026-01-01'
      }
```

### Preventing Duplicate Scheduling

```python
def schedule_reversal(self, original_entry, next_period=None, mark_for_auto_post=True):
    # Check if already scheduled
    existing_reversal = JournalEntry.objects.filter(
        tenant=self.tenant,
        reversal_of=original_entry,
        status='DRAFT'
    ).first()
    
    if existing_reversal:
        raise ValidationError(
            f"Reversal already scheduled for {existing_reversal.entry_date}"
        )
    
    # Proceed with scheduling...
```

### Period Transition Handling

| Scenario | Current Period | Next Period | Action |
|----------|---------------|-------------|--------|
| Normal month-end | December (OPEN) | January (OPEN) | Schedule for Jan 1 |
| Year-end close | March (CLOSING) | April (PENDING) | Wait until April opens |
| No next period | March 2026 | Not created yet | Raise ValidationError |
| Period locked | December (LOCKED) | January (OPEN) | Allow (operates on next period) |

### Method Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| original_entry | JournalEntry | Yes | - | Entry to reverse |
| next_period | AccountingPeriod | No | Auto-calculated | Target period for reversal |
| mark_for_auto_post | bool | No | True | Enable auto-posting |

### Expected Outcome
- Functional schedule_reversal method
- Draft reversal entries created
- Reversals dated for next period start
- Auto-post flag set for batch processing
- Duplicate scheduling prevented
- Foundation for automated period transitions

### Verification Checklist
- [ ] schedule_reversal method added
- [ ] Method docstring complete
- [ ] original_entry parameter validated
- [ ] Next period determined/validated
- [ ] Reversal date set to period start
- [ ] create_reversal() called with auto_post=False
- [ ] Metadata added for scheduling
- [ ] mark_for_auto_post flag stored
- [ ] Original entry updated (optional)
- [ ] Duplicate scheduling prevented
- [ ] Method returns draft reversal entry

---

## Summary

This document implemented specialized services for adjusting and reversing journal entries:

### Completed Services
- ✅ AdjustingEntryService with validation methods
- ✅ Accrual entry creation (revenue and expense)
- ✅ Deferral entry creation (revenue and expense)
- ✅ ReversingEntryService with helper methods
- ✅ Immediate reversal creation
- ✅ Scheduled reversal for batch processing

### Key Achievements
1. **GAAP/IFRS Compliance** - Proper accrual and deferral accounting
2. **Automated Reversals** - Automatic entry reversal creation
3. **Period Management** - Proper handling of accounting period transitions
4. **Batch Processing** - Scheduled reversals for automated posting
5. **Sri Lanka Context** - EPF/ETF and local business scenarios

### Service Capabilities

| Service | Methods | Purpose |
|---------|---------|---------|
| AdjustingEntryService | create_accrual_entry | Recognize unrecorded revenue/expenses |
| AdjustingEntryService | create_deferral_entry | Recognize earned/used prepayments |
| ReversingEntryService | create_reversal | Generate immediate reversal entry |
| ReversingEntryService | schedule_reversal | Schedule future auto-post reversal |

### Next Steps
Proceed to [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/) to implement Django admin configuration, REST API endpoints, comprehensive testing, and complete documentation for the journal entry module.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~969
