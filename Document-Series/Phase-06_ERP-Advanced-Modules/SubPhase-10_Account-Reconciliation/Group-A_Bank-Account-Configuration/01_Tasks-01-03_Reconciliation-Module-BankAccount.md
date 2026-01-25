# Tasks 01-03: Reconciliation Module and BankAccount Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** A - Bank Account Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-04-10_Bank-Configuration-Fields.md](02_Tasks-04-10_Bank-Configuration-Fields.md)

---

## Document Overview

This document covers the foundational setup for account reconciliation functionality. It establishes the reconciliation submodule within the accounting application, defines bank account type classifications, and creates the core BankAccount model. These elements provide the infrastructure for tracking bank accounts and linking them to the general ledger for automated reconciliation processes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Extend accounting App | Low | 15 min |
| 02 | Define BankAccountType Enum | Low | 15 min |
| 03 | Create BankAccount Model | Medium | 35 min |

---

## Task 01: Extend Accounting App

### Overview
Extend the accounting application with a reconciliation submodule to organize bank reconciliation functionality. This submodule will contain models, services, and utilities for managing bank accounts and performing reconciliation operations.

### Dependencies
- Accounting application (`apps/accounting/`) must exist
- Django project structure is established
- Multi-tenancy infrastructure configured

### Instructions

1. **Create reconciliation directory structure**
   - Navigate to `apps/accounting/` directory
   - Create new directory named `reconciliation`
   - This will house all bank reconciliation functionality

2. **Create package initialization file**
   - Create `__init__.py` in `reconciliation/` directory
   - Add module docstring explaining purpose
   - Include brief description of reconciliation functionality

3. **Create models subdirectory**
   - Create `models/` directory inside `reconciliation/`
   - This will contain bank account and reconciliation models

4. **Create models package initialization**
   - Create `__init__.py` in `models/` directory
   - Leave empty initially (will import models later)

5. **Create enums module**
   - Create `enums.py` in `reconciliation/` directory
   - Will contain bank account types and status enums

6. **Create services directory**
   - Create `services/` directory inside `reconciliation/`
   - Will contain reconciliation business logic

7. **Create services package initialization**
   - Create `__init__.py` in `services/` directory
   - Leave empty initially

### Directory Structure
```
apps/accounting/reconciliation/
├── __init__.py                    # Package initialization
├── models/
│   └── __init__.py               # Models package init
├── enums.py                      # Enumerations
└── services/
    └── __init__.py               # Services package init
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `reconciliation/__init__.py` | Package entry point and module exports |
| `models/__init__.py` | Model imports and exports |
| `enums.py` | Bank account types, statuses, match types |
| `services/__init__.py` | Service class exports |

### Integration with Accounting App
The reconciliation module integrates with existing accounting components:
- Links to Chart of Accounts via GL account foreign keys
- Uses Journal Entry models for matching transactions
- Follows multi-tenant data isolation patterns
- Adheres to accounting app conventions

### Expected Outcome
- Clean submodule structure within accounting app
- Organized location for reconciliation functionality
- Foundation for bank reconciliation system
- Proper separation of concerns

### Verification Checklist
- [ ] `apps/accounting/reconciliation/` directory exists
- [ ] `reconciliation/__init__.py` file created
- [ ] `reconciliation/models/` directory exists
- [ ] `reconciliation/models/__init__.py` file created
- [ ] `reconciliation/enums.py` file created
- [ ] `reconciliation/services/` directory exists
- [ ] `reconciliation/services/__init__.py` file created

---

## Task 02: Define BankAccountType Enum

### Overview
Define a bank account type enumeration to classify different kinds of bank accounts in the system. This classification determines the account's treatment in financial reports and reconciliation processes, and ensures proper General Ledger account linking.

### Dependencies
- Task 01: Extend accounting App

### Instructions

1. **Open enums.py file**
   - Navigate to `apps/accounting/reconciliation/enums.py`
   - Prepare to define bank account type enumeration

2. **Add module docstring**
   - Add comprehensive module documentation
   - Explain the purpose of enumerations
   - Note usage context (account classification, GL linking)

3. **Import enum module**
   - Import Python's enum module
   - Use TextChoices for Django integration
   - Follow Django's enumeration patterns

4. **Define BankAccountType class**
   - Inherit from models.TextChoices
   - Create enumeration for account classification

5. **Define CHECKING constant**
   - Value: 'CHECKING'
   - Label: 'Checking Account'
   - Purpose: Standard business checking accounts
   - GL Category: Asset (Current Assets)

6. **Define SAVINGS constant**
   - Value: 'SAVINGS'
   - Label: 'Savings Account'
   - Purpose: Interest-bearing savings/deposit accounts
   - GL Category: Asset (Current Assets)

7. **Define CREDIT_CARD constant**
   - Value: 'CREDIT_CARD'
   - Label: 'Credit Card'
   - Purpose: Credit card accounts (business credit cards)
   - GL Category: Liability (Current Liabilities)

8. **Define CASH constant**
   - Value: 'CASH'
   - Label: 'Cash Account'
   - Purpose: Petty cash, cash registers, physical cash
   - GL Category: Asset (Cash Accounts)

### Bank Account Type Details

| Type | Value | Label | Balance Type | GL Account Range | Typical Use Case |
|------|-------|-------|--------------|------------------|------------------|
| CHECKING | 'CHECKING' | Checking Account | Debit | 1100-1120 | Daily business transactions |
| SAVINGS | 'SAVINGS' | Savings Account | Debit | 1130-1140 | Reserve funds, short-term savings |
| CREDIT_CARD | 'CREDIT_CARD' | Credit Card | Credit | 2100-2120 | Business expense cards |
| CASH | 'CASH' | Cash Account | Debit | 1100-1110 | Petty cash, till cash |

### Account Type Usage Scenarios

#### Checking Account
- Primary operating account for business
- Receives customer payments
- Pays supplier invoices
- Frequent transactions
- Reconciled monthly
- Linked to primary cash GL account

#### Savings Account
- Holds reserve funds
- Earns interest income
- Less frequent transactions
- Reconciled monthly or quarterly
- Linked to savings GL account
- May have minimum balance requirements

#### Credit Card Account
- Business credit card for expenses
- Liability balance (credit balance)
- Reconciled against credit card statements
- Linked to credit card payable GL account
- Payments reduce liability balance
- Interest charges tracked

#### Cash Account
- Physical cash in register
- Petty cash fund
- Small expense payments
- Daily reconciliation
- Linked to cash on hand GL account
- Security and control important

### Sri Lanka Banking Context

Common account types in Sri Lankan businesses:
- **Current Account (Checking):** Standard business account at Bank of Ceylon, People's Bank, or commercial banks
- **Savings Account:** Interest-bearing accounts for reserves
- **Credit Facilities:** Business credit cards, overdraft facilities
- **Cash in Hand:** Physical rupee notes for daily operations

### Expected Outcome
- Clear bank account type classification
- Proper GL account category mapping
- Support for various banking instruments
- Foundation for reconciliation logic

### Verification Checklist
- [ ] BankAccountType enumeration defined
- [ ] CHECKING type with proper label
- [ ] SAVINGS type with proper label
- [ ] CREDIT_CARD type with proper label
- [ ] CASH type with proper label
- [ ] All types follow naming conventions
- [ ] Labels are user-friendly

---

## Task 03: Create BankAccount Model

### Overview
Create the core BankAccount model that represents bank accounts in the system. This model stores essential bank account information and serves as the foundation for reconciliation operations. It links bank accounts to General Ledger accounts for automated journal entry posting and tracks reconciliation status.

### Dependencies
- Task 01: Extend accounting App
- Task 02: Define BankAccountType Enum
- Tenant model exists
- Account model (Chart of Accounts) exists
- Django ORM configured

### Instructions

1. **Create bank_account.py model file**
   - Create file at `apps/accounting/reconciliation/models/bank_account.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields and validators
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import BankAccountType enumeration
   - Import Tenant model
   - Import Account model from accounting.models

3. **Define BankAccount model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain purpose and relationships

4. **Add tenant foreign key**
   - ForeignKey to Tenant model
   - Required field (no blank/null)
   - Establishes multi-tenant isolation
   - Add on_delete=models.CASCADE
   - Add related_name='bank_accounts'

5. **Add account_type field**
   - CharField with choices from BankAccountType
   - Required field (no blank/null)
   - Determines account classification
   - Affects GL account validation

6. **Add is_active field**
   - BooleanField, default=True
   - Controls account availability
   - Inactive accounts cannot be used for new reconciliations
   - Historical data preserved

7. **Add created_by field**
   - ForeignKey to User model
   - Optional (blank=True, null=True)
   - Tracks who created the account
   - Add on_delete=models.SET_NULL
   - Add related_name='created_bank_accounts'

8. **Add updated_by field**
   - ForeignKey to User model
   - Optional (blank=True, null=True)
   - Tracks who last updated the account
   - Add on_delete=models.SET_NULL
   - Add related_name='updated_bank_accounts'

9. **Add Meta class**
   - Set verbose_name = 'Bank Account'
   - Set verbose_name_plural = 'Bank Accounts'
   - Add ordering = ['bank_name', 'account_name']
   - Add db_table = 'accounting_bank_account'
   - Add indexes for performance

10. **Add __str__ method**
    - Return formatted string with account name and bank
    - Format: "Account Name - Bank Name (Account Number)"
    - Provide human-readable identification

11. **Add save method override**
    - Validate GL account type matches bank account type
    - Checking/Savings must link to Asset accounts
    - Credit Card must link to Liability accounts
    - Call parent save method

12. **Update models/__init__.py**
    - Import BankAccount model
    - Import BankAccountType enum
    - Add to __all__ list

### BankAccount Model Structure

```
┌─────────────────────────────────────────────────┐
│           BankAccount Model                     │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • account_type (CharField with choices)        │
│  • is_active (BooleanField)                     │
│  • created_by (ForeignKey to User)              │
│  • updated_by (ForeignKey to User)              │
│                                                 │
│ Bank Details (Added in Next Document):         │
│  • account_name, account_number                 │
│  • bank_name, branch_name, branch_code          │
│  • currency                                     │
│                                                 │
│ GL Integration:                                 │
│  • gl_account (FK to Account)                   │
│                                                 │
│ Reconciliation Tracking:                        │
│  • last_reconciled_date                         │
│  • last_reconciled_balance                      │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│   BankAccount      │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
┌──────────────┐                      ┌────────────────────┐
│     User     │◄─────────────────────│   (created_by,     │
│              │      (creator/       │    updated_by)     │
└──────────────┘       modifier)      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
┌──────────────┐                      ┌────────────────────┐
│   Account    │◄─────────────────────│   (gl_account FK)  │
│ (Chart of    │                      │                    │
│  Accounts)   │                      └────────────────────┘
└──────────────┘                               │
                                               │ 1:N
                                               ▼
                                      ┌────────────────────┐
                                      │ BankStatement      │
                                      │ Reconciliation     │
                                      │ (Future Groups)    │
                                      └────────────────────┘
```

### Field Details (Initial Fields Only)

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| tenant | ForeignKey(Tenant) | Yes | - | Multi-tenant isolation |
| account_type | CharField | Yes | - | Account classification |
| is_active | BooleanField | Yes | True | Availability status |
| created_by | ForeignKey(User) | No | null | Creation audit trail |
| updated_by | ForeignKey(User) | No | null | Update audit trail |

### Account Type and GL Account Validation

```
Account Type Validation Rules
═════════════════════════════

CHECKING or SAVINGS:
  ├─ Must link to Asset account
  ├─ Account code: 1100-1199
  └─ Normal balance: Debit

CREDIT_CARD:
  ├─ Must link to Liability account
  ├─ Account code: 2100-2199
  └─ Normal balance: Credit

CASH:
  ├─ Must link to Cash account
  ├─ Account code: 1100-1110
  └─ Normal balance: Debit
```

### Active/Inactive Status Logic

```
Active Status Management
═══════════════════════

Active Account (is_active=True):
  ├─ Can create new reconciliations
  ├─ Appears in account selection lists
  ├─ Can import bank statements
  └─ Can create transactions

Inactive Account (is_active=False):
  ├─ Cannot create new reconciliations
  ├─ Hidden from selection lists
  ├─ Historical reconciliations preserved
  ├─ Existing data remains queryable
  └─ Can be reactivated if needed
```

### Multi-Tenant Isolation

Each tenant's bank accounts are isolated:
- Tenant A cannot access Tenant B's bank accounts
- GL account links must be within same tenant
- Reconciliations scoped to tenant's accounts
- Queries automatically filtered by tenant

### Expected Outcome
- Functional BankAccount model foundation
- Tenant-specific bank accounts
- Account type classification
- Active/inactive control
- Audit trail with created_by/updated_by
- Foundation for bank details and reconciliation tracking

### Verification Checklist
- [ ] bank_account.py file created
- [ ] BankAccount class defined
- [ ] tenant foreign key added
- [ ] account_type field with choices
- [ ] is_active field added
- [ ] created_by field added
- [ ] updated_by field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] save method with validation logic
- [ ] Model imported in __init__.py
- [ ] BankAccountType enum imported

---

## Summary

This document established the foundation for account reconciliation by creating the reconciliation submodule structure, defining bank account type classifications, and implementing the core BankAccount model. The next document will add bank identification fields, GL account linking, and currency configuration.

### Completed Tasks
- ✅ Task 01: Extend accounting App
- ✅ Task 02: Define BankAccountType Enum
- ✅ Task 03: Create BankAccount Model (base structure)

### Next Steps
- Add bank identification fields (account name, number, bank name, branch)
- Link bank account to Chart of Accounts
- Add currency support for multi-currency accounts
- Configure reconciliation tracking fields
