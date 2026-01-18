# SubPhase 08: Chart of Accounts - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 08 of 14  
> **SubPhase Goal:** Establish double-entry bookkeeping foundation with hierarchical account structure  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_Payslip-Generation](../SubPhase-07_Payslip-Generation/)
- **→ Next SubPhase:** [SubPhase-09_Journal-Entries](../SubPhase-09_Journal-Entries/)

---

## SubPhase Overview

This sub-phase implements the Chart of Accounts (COA) system, the foundation of double-entry bookkeeping. Includes hierarchical account structures, account types (Assets, Liabilities, Equity, Revenue, Expenses), Sri Lanka-specific default accounts, and tenant-customizable configurations.

### Key Outcomes
- Account type definitions (5 main types)
- Hierarchical account structure (MPTT)
- Standard account code numbering (1xxx-5xxx)
- Pre-configured default chart of accounts
- Custom account creation by tenants
- Account balance tracking
- Multi-currency support foundation
- Account activation/deactivation

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Hierarchy:** django-mptt for tree structure
- **Frontend:** Next.js 14+ with TypeScript
- **Reporting:** Balance aggregation queries

### Dependencies
- Phase-03: Multi-tenant infrastructure
- Phase-04: Currency settings

---

## Task Execution Order

```
TASK GROUP A: Account Type Definitions (Tasks 01-16)
        │
        ▼
TASK GROUP B: Account Model & Hierarchy (Tasks 17-34)
        │
        ▼
TASK GROUP C: Default Chart Setup (Tasks 35-50)
        │
        ▼
TASK GROUP D: Account Management Features (Tasks 51-66)
        │
        ▼
TASK GROUP E: Admin & Serializers (Tasks 67-78)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 79-86)
```

---

## Task Index

### Group A: Account Type Definitions (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create accounting App** | Initialize Django app for accounting module | None | 🔴 Not Created |
| 02 | **Register accounting App** | Add to TENANT_APPS in settings | Task 01 | 🔴 Not Created |
| 03 | **Define AccountType Enum** | Create: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE | Task 02 | 🔴 Not Created |
| 04 | **Define AccountCategory Enum** | Create: CURRENT, NON_CURRENT, OPERATING, etc. | Task 03 | 🔴 Not Created |
| 05 | **Define AccountStatus Enum** | Create: ACTIVE, INACTIVE, ARCHIVED | Task 04 | 🔴 Not Created |
| 06 | **Define NormalBalance Enum** | Create: DEBIT, CREDIT (determines increase side) | Task 05 | 🔴 Not Created |
| 07 | **Create AccountTypeConfig Model** | System configuration for account types | Task 06 | 🔴 Not Created |
| 08 | **Add Type Name Field** | Add name, code (e.g., ASSET, 1) | Task 07 | 🔴 Not Created |
| 09 | **Add Type Normal Balance** | Link normal_balance (debit/credit) | Task 07 | 🔴 Not Created |
| 10 | **Add Type Code Range** | Add code_start, code_end (1000-1999) | Task 07 | 🔴 Not Created |
| 11 | **Add Type Display Order** | Add display_order for reports | Task 07 | 🔴 Not Created |
| 12 | **Add Type Description** | Add description field | Task 07 | 🔴 Not Created |
| 13 | **Run AccountTypeConfig Migrations** | Generate and apply migrations | Task 12 | 🔴 Not Created |
| 14 | **Create AccountType Fixture** | JSON fixture for 5 main types | Task 13 | 🔴 Not Created |
| 15 | **Create Load Fixture Command** | Management command to load fixtures | Task 14 | 🔴 Not Created |
| 16 | **Test AccountType Configuration** | Verify fixture loading | Task 15 | 🔴 Not Created |

---

### Group B: Account Model & Hierarchy (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Install django-mptt** | Add django-mptt to requirements | Task 16 | 🔴 Not Created |
| 18 | **Create Account Model** | Core account model with MPTT | Task 17 | 🔴 Not Created |
| 19 | **Add Account Code Field** | Unique account code (e.g., 1100) | Task 18 | 🔴 Not Created |
| 20 | **Add Account Name Field** | Descriptive name (e.g., Cash on Hand) | Task 18 | 🔴 Not Created |
| 21 | **Add Account Type FK** | Link to AccountTypeConfig | Task 18 | 🔴 Not Created |
| 22 | **Add Account Category** | Add category using AccountCategory enum | Task 18 | 🔴 Not Created |
| 23 | **Add Account Status** | Add status using AccountStatus enum | Task 18 | 🔴 Not Created |
| 24 | **Add Account Description** | Add optional description field | Task 18 | 🔴 Not Created |
| 25 | **Add Account Parent FK** | Self-referential parent for hierarchy | Task 18 | 🔴 Not Created |
| 26 | **Configure MPTT Fields** | Add tree_id, level, lft, rght fields | Task 25 | 🔴 Not Created |
| 27 | **Add Account Is Header** | Boolean for parent/summary accounts | Task 26 | 🔴 Not Created |
| 28 | **Add Account Is System** | Boolean for system-protected accounts | Task 26 | 🔴 Not Created |
| 29 | **Add Account Currency** | Optional currency override | Task 26 | 🔴 Not Created |
| 30 | **Add Account Opening Balance** | Opening balance for migration | Task 26 | 🔴 Not Created |
| 31 | **Add Account Current Balance** | Current calculated balance | Task 26 | 🔴 Not Created |
| 32 | **Add Account Timestamps** | Add created_at, updated_at | Task 26 | 🔴 Not Created |
| 33 | **Run Account Migrations** | Generate and apply migrations | Task 32 | 🔴 Not Created |
| 34 | **Add Account Model Constraints** | Unique code per tenant, validate ranges | Task 33 | 🔴 Not Created |

---

### Group C: Default Chart Setup (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Define Asset Accounts** | Default assets (1000-1999) | Task 34 | 🔴 Not Created |
| 36 | **Add Cash Accounts** | Cash on Hand (1100), Petty Cash (1101) | Task 35 | 🔴 Not Created |
| 37 | **Add Bank Accounts** | Bank accounts header (1110) | Task 35 | 🔴 Not Created |
| 38 | **Add Receivables Accounts** | Accounts Receivable (1200), AR Control | Task 35 | 🔴 Not Created |
| 39 | **Add Inventory Accounts** | Inventory (1300), Inventory Adjustments | Task 35 | 🔴 Not Created |
| 40 | **Add Fixed Asset Accounts** | Equipment (1500), Accumulated Depreciation | Task 35 | 🔴 Not Created |
| 41 | **Define Liability Accounts** | Default liabilities (2000-2999) | Task 40 | 🔴 Not Created |
| 42 | **Add Payables Accounts** | Accounts Payable (2100), AP Control | Task 41 | 🔴 Not Created |
| 43 | **Add Tax Payable Accounts** | VAT Payable, PAYE Payable | Task 41 | 🔴 Not Created |
| 44 | **Add EPF/ETF Payable Accounts** | EPF Payable (2200), ETF Payable (2201) | Task 41 | 🔴 Not Created |
| 45 | **Define Equity Accounts** | Default equity (3000-3999) | Task 44 | 🔴 Not Created |
| 46 | **Add Owner Equity Accounts** | Owner's Equity (3000), Retained Earnings | Task 45 | 🔴 Not Created |
| 47 | **Define Revenue Accounts** | Default revenue (4000-4999) | Task 46 | 🔴 Not Created |
| 48 | **Add Sales Revenue Accounts** | Sales Revenue (4100), Service Revenue | Task 47 | 🔴 Not Created |
| 49 | **Define Expense Accounts** | Default expenses (5000-5999) | Task 48 | 🔴 Not Created |
| 50 | **Add Common Expense Accounts** | COGS, Salaries, Rent, Utilities | Task 49 | 🔴 Not Created |

---

### Group D: Account Management Features (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Default COA Fixture** | JSON fixture with all default accounts | Task 50 | 🔴 Not Created |
| 52 | **Create COA Template Model** | Predefined templates (Retail, Service) | Task 51 | 🔴 Not Created |
| 53 | **Add Template Name Field** | Add name, description, industry | Task 52 | 🔴 Not Created |
| 54 | **Add Template Accounts JSON** | JSON field for template accounts | Task 52 | 🔴 Not Created |
| 55 | **Run Template Migrations** | Generate and apply migrations | Task 54 | 🔴 Not Created |
| 56 | **Create COA Initializer Service** | Service to initialize tenant COA | Task 55 | 🔴 Not Created |
| 57 | **Add Create From Template Method** | Initialize from template | Task 56 | 🔴 Not Created |
| 58 | **Add Create Default Method** | Initialize with standard defaults | Task 56 | 🔴 Not Created |
| 59 | **Create Account Balance Service** | Service for balance calculations | Task 58 | 🔴 Not Created |
| 60 | **Add Calculate Balance Method** | Compute current balance from journals | Task 59 | 🔴 Not Created |
| 61 | **Add Update Balance Method** | Update cached current_balance | Task 60 | 🔴 Not Created |
| 62 | **Add Get Children Balances** | Get balances for child accounts | Task 61 | 🔴 Not Created |
| 63 | **Create Account Validator** | Validation logic for accounts | Task 62 | 🔴 Not Created |
| 64 | **Add Code Range Validation** | Validate code within type range | Task 63 | 🔴 Not Created |
| 65 | **Add Deletion Validation** | Prevent delete if has transactions | Task 64 | 🔴 Not Created |
| 66 | **Add Archive Functionality** | Soft archive instead of delete | Task 65 | 🔴 Not Created |

---

### Group E: Admin & Serializers (Tasks 67-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create Account Admin Config** | Django admin for Account model | Task 66 | 🔴 Not Created |
| 68 | **Add Admin List Display** | Show code, name, type, balance, status | Task 67 | 🔴 Not Created |
| 69 | **Add Admin Filters** | Filter by type, category, status | Task 68 | 🔴 Not Created |
| 70 | **Add Admin Tree View** | Display hierarchical structure | Task 69 | 🔴 Not Created |
| 71 | **Add Admin Search** | Search by code, name | Task 70 | 🔴 Not Created |
| 72 | **Create AccountSerializer** | DRF serializer for Account | Task 71 | 🔴 Not Created |
| 73 | **Add Nested Children Serializer** | Include child accounts | Task 72 | 🔴 Not Created |
| 74 | **Create AccountTreeSerializer** | Full tree structure serializer | Task 73 | 🔴 Not Created |
| 75 | **Create AccountTypeSerializer** | Serializer for AccountTypeConfig | Task 74 | 🔴 Not Created |
| 76 | **Create COATemplateSerializer** | Serializer for COA templates | Task 75 | 🔴 Not Created |
| 77 | **Add Create Account Validation** | Custom validation in serializer | Task 76 | 🔴 Not Created |
| 78 | **Add Update Account Validation** | Prevent type change if has transactions | Task 77 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 79-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create AccountViewSet** | Full CRUD ViewSet for accounts | Task 78 | 🔴 Not Created |
| 80 | **Add Tree List Endpoint** | GET /accounts/tree/ for hierarchy | Task 79 | 🔴 Not Created |
| 81 | **Add Account Types Endpoint** | GET /accounts/types/ for types | Task 80 | 🔴 Not Created |
| 82 | **Add Initialize COA Endpoint** | POST to create default COA | Task 81 | 🔴 Not Created |
| 83 | **Add Account URL Routes** | Register routes in urls.py | Task 82 | 🔴 Not Created |
| 84 | **Write Account Model Tests** | Unit tests for Account model | Task 83 | 🔴 Not Created |
| 85 | **Write COA Service Tests** | Test initialization and balance calc | Task 84 | 🔴 Not Created |
| 86 | **Create Accounting API Documentation** | Document all COA endpoints | Task 85 | 🔴 Not Created |

---

## Expected File Structure

```
apps/accounting/
├── __init__.py
├── admin.py                # Account admin configuration
├── apps.py                 # App config
├── models/
│   ├── __init__.py
│   ├── account_type.py     # AccountTypeConfig model
│   ├── account.py          # Account model with MPTT
│   └── coa_template.py     # COA Template model
├── serializers/
│   ├── __init__.py
│   ├── account.py          # Account serializers
│   ├── account_tree.py     # Tree structure serializer
│   └── account_type.py     # Type serializers
├── views/
│   ├── __init__.py
│   └── account.py          # Account ViewSet
├── services/
│   ├── __init__.py
│   ├── coa_initializer.py  # COA initialization service
│   ├── balance_service.py  # Balance calculation service
│   └── validators.py       # Account validators
├── fixtures/
│   ├── account_types.json  # 5 main account types
│   └── default_coa.json    # Default chart of accounts
├── management/
│   └── commands/
│       └── load_account_types.py
├── urls.py                 # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   └── test_api.py
└── migrations/

frontend/src/app/(dashboard)/accounting/
├── accounts/
│   ├── page.tsx            # Chart of accounts list
│   ├── [id]/
│   │   └── page.tsx        # Account detail
│   └── new/
│       └── page.tsx        # Create account
├── components/
│   ├── AccountTree.tsx     # Hierarchical tree view
│   ├── AccountForm.tsx     # Account create/edit form
│   └── AccountTypeIcon.tsx # Type-based icons
└── hooks/
    ├── useAccounts.ts
    └── useAccountTree.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Account Type Definitions | 16 | 0 | 0% |
| Group B: Account Model & Hierarchy | 18 | 0 | 0% |
| Group C: Default Chart Setup | 16 | 0 | 0% |
| Group D: Account Management Features | 16 | 0 | 0% |
| Group E: Admin & Serializers | 12 | 0 | 0% |
| Group F: API, Testing & Documentation | 8 | 0 | 0% |
| **TOTAL** | **86** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **Account Code Structure:**
   ```
   Type Range:
   - 1000-1999: Assets
   - 2000-2999: Liabilities
   - 3000-3999: Equity
   - 4000-4999: Revenue
   - 5000-5999: Expenses
   
   Category within Type:
   - xx00-xx99: Header accounts
   - Subcategories beneath
   ```

2. **Normal Balance Rules:**
   - Assets: DEBIT (increases with debit)
   - Liabilities: CREDIT (increases with credit)
   - Equity: CREDIT
   - Revenue: CREDIT
   - Expenses: DEBIT

3. **MPTT Hierarchy:**
   - Use django-mptt for efficient tree queries
   - Account can be header (parent) or detail (leaf)
   - Balance aggregation for parent accounts

4. **Balance Calculation:**
   - Current Balance = Opening Balance + Net Change
   - Net Change = Sum(Debits) - Sum(Credits) for DEBIT normal
   - Net Change = Sum(Credits) - Sum(Debits) for CREDIT normal

5. **System Accounts:**
   - Mark essential accounts as is_system=True
   - Prevent deletion of system accounts
   - Include AR Control, AP Control, etc.

### Sri Lanka Specific

1. **EPF/ETF Accounts:**
   - EPF Payable (2200): Employee + Employer EPF
   - ETF Payable (2201): Employer ETF contribution
   - Separate tracking for compliance

2. **VAT Accounts:**
   - VAT Output (2150): Sales VAT collected
   - VAT Input (1250): Purchase VAT paid
   - Net VAT Payable calculation

3. **PAYE Account:**
   - PAYE Payable (2210): Employee tax deductions

### Default Account Structure

```
ASSETS (1xxx)
├── Current Assets (1000) [Header]
│   ├── Cash (1100) [Header]
│   │   ├── Cash on Hand (1101)
│   │   └── Petty Cash (1102)
│   ├── Bank (1110) [Header]
│   │   └── [Tenant adds bank accounts]
│   ├── Accounts Receivable (1200) [Header]
│   │   └── Trade Receivables (1201)
│   ├── VAT Input (1250)
│   └── Inventory (1300) [Header]
│       └── Merchandise Inventory (1301)
└── Fixed Assets (1500) [Header]
    ├── Equipment (1501)
    └── Accumulated Depreciation (1599)

LIABILITIES (2xxx)
├── Current Liabilities (2000) [Header]
│   ├── Accounts Payable (2100) [Header]
│   │   └── Trade Payables (2101)
│   ├── VAT Output (2150)
│   ├── EPF Payable (2200)
│   ├── ETF Payable (2201)
│   └── PAYE Payable (2210)
└── Long-term Liabilities (2500) [Header]

EQUITY (3xxx)
├── Owner's Equity (3000)
└── Retained Earnings (3100)

REVENUE (4xxx)
├── Sales Revenue (4100)
├── Service Revenue (4200)
└── Other Income (4900)

EXPENSES (5xxx)
├── Cost of Goods Sold (5100)
├── Salaries & Wages (5200)
├── EPF/ETF Expense (5210)
├── Rent Expense (5300)
├── Utilities Expense (5400)
└── Other Expenses (5900)
```

### Workflow Summary

```
Tenant Created
        │
        ▼
COA Initialized (Template or Default)
        │
        ▼
Accounts Available for:
├── Journal Entries (SubPhase-09)
├── Sales Integration (auto-posting)
├── Purchase Integration (auto-posting)
├── Payroll Integration (salary expense)
└── Financial Reports (SubPhase-11)
```

---

## Completion Checklist

- [ ] Account type configuration (5 types)
- [ ] Account model with MPTT hierarchy
- [ ] Default chart of accounts fixture
- [ ] COA templates for different industries
- [ ] COA initialization service
- [ ] Balance calculation service
- [ ] Account validators
- [ ] Django admin with tree view
- [ ] DRF serializers with nested children
- [ ] API endpoints (CRUD + tree + initialize)
- [ ] Unit and integration tests
- [ ] API documentation
