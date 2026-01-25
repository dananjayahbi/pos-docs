# Tasks 77-82: Admin, ViewSet, and Routes

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Reporting-History/](../Group-E_Reporting-History/)
- **→ Next Document:** [02_Tasks-83-84_Testing-Documentation.md](02_Tasks-83-84_Testing-Documentation.md)

---

## Document Overview

This document covers the Django Admin interface, REST API implementation, and URL routing for the account reconciliation system. It establishes the administrative interface for managing bank accounts and reconciliations, creates RESTful API endpoints for frontend integration, and implements specialized endpoints for bank statement imports.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create BankAccount Admin | Low | 20 min |
| 78 | Create Reconciliation Admin | Medium | 30 min |
| 79 | Create Reconciliation Serializers | Medium | 40 min |
| 80 | Create ReconciliationViewSet | Medium | 45 min |
| 81 | Add Import Statement Endpoint | High | 60 min |
| 82 | Add URL Routes | Low | 15 min |

---

## Task 77: Create BankAccount Admin

### Overview
Create the Django Admin interface for the BankAccount model to enable administrative management of bank accounts. This interface provides CRUD operations, list filtering, search capabilities, and inline editing of related data through Django's admin panel.

### Dependencies
- BankAccount model must be created (Task 63)
- Django admin framework enabled in project
- Admin user credentials configured
- Multi-tenancy admin base classes available

### Instructions

1. **Create admin module file**
   - Navigate to `apps/reconciliation/` directory
   - Create new file named `admin.py`
   - This will contain all admin interface configurations

2. **Import required dependencies**
   - Import `admin` from `django.contrib`
   - Import `BankAccount` model from `reconciliation.models`
   - Import base admin classes that handle multi-tenancy
   - Import admin utilities for custom displays

3. **Create BankAccount admin class**
   - Define `BankAccountAdmin` class inheriting from `admin.ModelAdmin`
   - Or inherit from tenant-aware base admin if available
   - This provides the admin interface configuration

4. **Configure list display fields**
   - Add `list_display` tuple with key fields
   - Include: account name, account number, bank name, account type
   - Include: currency, current balance, is active status
   - Display tenant if multi-tenant admin

5. **Configure list filters**
   - Add `list_filter` tuple for sidebar filtering
   - Include: account type, currency, is active
   - Include: bank name for multi-bank filtering
   - Include: tenant filter for multi-tenant setups

6. **Configure search functionality**
   - Add `search_fields` tuple for search box
   - Include: account name, account number
   - Include: bank name, branch name
   - Enable partial matching with appropriate lookups

7. **Configure field organization**
   - Add `fieldsets` for organized form layout
   - Group basic information: name, type, bank details
   - Group account details: account number, currency, balance
   - Group status and timestamps: is_active, created, modified

8. **Configure read-only fields**
   - Add `readonly_fields` tuple
   - Include: current_balance (should be calculated from reconciliations)
   - Include: created_at, modified_at (audit trail)
   - Include: tenant (prevent changing after creation)

9. **Add custom admin methods**
   - Create method to display formatted balance with currency
   - Create method to show account status (active/inactive)
   - Create method to display last reconciliation date
   - Decorate methods with `@admin.display` for labels

10. **Register admin interface**
    - Use `@admin.register(BankAccount)` decorator
    - Or call `admin.site.register(BankAccount, BankAccountAdmin)`
    - Makes admin interface available in Django admin panel

### Admin Interface Features

| Feature | Purpose | Benefit |
|---------|---------|---------|
| **List Display** | Overview of all bank accounts | Quick access to account information |
| **List Filters** | Filter by type, currency, status | Find specific accounts efficiently |
| **Search** | Search by name, number, bank | Locate accounts quickly |
| **Fieldsets** | Organized form layout | Improved data entry experience |
| **Read-only Fields** | Protect calculated/audit fields | Data integrity |
| **Custom Methods** | Enhanced display formatting | Better readability |

### Admin Display Columns

| Column | Description | Format |
|--------|-------------|--------|
| Account Name | User-friendly identifier | Text |
| Account Number | Bank account number | Masked (show last 4 digits) |
| Bank Name | Financial institution | Text |
| Account Type | Checking/Savings/etc | Enum display |
| Currency | Account currency | LKR, USD, etc. |
| Current Balance | Account balance | Formatted with currency symbol |
| Is Active | Account status | Green/Red indicator |

### List Filter Options

```
Sidebar Filters:
├── By Account Type
│   ├── Checking
│   ├── Savings
│   ├── Credit Card
│   └── Other
├── By Currency
│   ├── LKR (Sri Lankan Rupee)
│   ├── USD (US Dollar)
│   └── EUR (Euro)
├── By Status
│   ├── Active
│   └── Inactive
└── By Bank
    ├── Bank of Ceylon
    ├── Commercial Bank
    ├── Sampath Bank
    └── ... (other banks)
```

### Fieldset Organization

```
BankAccount Form Layout:
├── Basic Information
│   ├── Account Name
│   ├── Account Type
│   ├── Bank Name
│   └── Branch Name
├── Account Details
│   ├── Account Number
│   ├── Currency
│   ├── Opening Balance
│   └── Current Balance (read-only)
├── Status & Settings
│   ├── Is Active
│   └── Tenant (read-only)
└── Audit Information
    ├── Created At (read-only)
    └── Modified At (read-only)
```

### Expected Outcome
- BankAccount admin interface fully functional
- List view shows key account information
- Filtering and search capabilities enabled
- Form organized into logical fieldsets
- Balance displayed with proper currency formatting
- Audit fields protected from modification

### Verification Checklist
- [ ] `admin.py` file created in `apps/reconciliation/`
- [ ] `BankAccountAdmin` class defined and registered
- [ ] List display shows: name, number, bank, type, balance, status
- [ ] List filters include: type, currency, active status
- [ ] Search works on: account name, account number, bank name
- [ ] Fieldsets organize form into logical sections
- [ ] Read-only fields include: current_balance, timestamps
- [ ] Custom display methods format balance with currency
- [ ] Admin interface accessible at `/admin/reconciliation/bankaccount/`
- [ ] CRUD operations work correctly through admin panel

---

## Task 78: Create Reconciliation Admin

### Overview
Create the Django Admin interface for the Reconciliation model to manage bank reconciliation processes. This interface provides comprehensive views of reconciliation records, status management, inline editing of reconciliation items, and filtering by various criteria.

### Dependencies
- Task 77: BankAccount admin must be created
- Reconciliation model must be created (Task 64)
- ReconciliationItem model must be created (Task 65)
- Django admin inline functionality understanding
- Multi-tenancy admin patterns established

### Instructions

1. **Create ReconciliationItem inline admin**
   - Open `apps/reconciliation/admin.py`
   - Define `ReconciliationItemInline` class
   - Inherit from `admin.TabularInline` or `admin.StackedInline`
   - This allows editing items within reconciliation form

2. **Configure inline item display**
   - Set `model = ReconciliationItem`
   - Configure `fields` to display on inline form
   - Include: transaction, statement entry, matched status
   - Include: amount, notes, matched date

3. **Set inline item options**
   - Set `extra = 0` to not show empty forms by default
   - Configure `readonly_fields` for calculated fields
   - Set `can_delete = False` for matched items
   - Enable `show_change_link` for full item editing

4. **Create Reconciliation admin class**
   - Define `ReconciliationAdmin` class
   - Inherit from tenant-aware admin base class
   - Include inline for ReconciliationItem

5. **Configure list display fields**
   - Add `list_display` tuple with key reconciliation fields
   - Include: bank account, period start, period end
   - Include: status, statement balance, system balance
   - Include: difference amount, reconciled by, completed date

6. **Configure list filters**
   - Add `list_filter` tuple for filtering
   - Include: status, bank account, reconciled by user
   - Include: date range filters for period start/end
   - Include: tenant filter for multi-tenant setups

7. **Configure search functionality**
   - Add `search_fields` for text search
   - Include: bank account name, bank account number
   - Include: notes field, reconciled by user name
   - Enable searching by reconciliation period

8. **Configure field organization**
   - Add `fieldsets` for structured form layout
   - Group period information: start/end dates, statement balance
   - Group system information: opening balance, transactions total
   - Group reconciliation results: difference, status, notes
   - Group audit information: completed date, reconciled by

9. **Configure read-only fields**
   - Add `readonly_fields` tuple
   - Include: opening balance (from previous reconciliation)
   - Include: system balance (calculated from transactions)
   - Include: difference (calculated field)
   - Include: audit fields (created, modified, tenant)

10. **Add custom display methods**
    - Create method to display balance difference with color coding
    - Create method to show status badge (pending/in-progress/completed)
    - Create method to display reconciliation summary
    - Create method to show matched vs unmatched item counts
    - Use `@admin.display` decorator for proper labels

11. **Add custom admin actions**
    - Create action to mark reconciliations as completed
    - Create action to reopen completed reconciliations
    - Create action to export reconciliation report
    - Add confirmation steps for critical actions

12. **Configure inline admin**
    - Add `inlines = [ReconciliationItemInline]` to admin class
    - This embeds item management within reconciliation form
    - Allows viewing and editing items directly

13. **Register Reconciliation admin**
    - Use `@admin.register(Reconciliation)` decorator
    - Makes admin interface available for reconciliations

### Admin Interface Features

| Feature | Purpose | Implementation |
|---------|---------|----------------|
| **Inline Items** | Manage reconciliation items | TabularInline for ReconciliationItem |
| **Status Badges** | Visual status indicators | Custom display method with color coding |
| **Balance Comparison** | Show differences clearly | Calculated fields with highlighting |
| **Date Filters** | Filter by period | DateFieldListFilter on period dates |
| **Custom Actions** | Bulk operations | Admin actions for status changes |
| **Summary Display** | Overview statistics | Custom display methods |

### List Display Columns

| Column | Description | Format |
|--------|-------------|--------|
| Bank Account | Associated account | Link to account |
| Period | Reconciliation period | "Jan 1 - Jan 31, 2026" |
| Status | Current status | Badge (Pending/In Progress/Completed) |
| Statement Balance | Bank statement balance | Formatted currency |
| System Balance | Calculated system balance | Formatted currency |
| Difference | Balance difference | Red if non-zero, green if zero |
| Reconciled By | User who completed | Username or "—" if incomplete |
| Completed Date | When finalized | Date or "—" if incomplete |

### List Filter Options

```
Sidebar Filters:
├── By Status
│   ├── Pending
│   ├── In Progress
│   └── Completed
├── By Bank Account
│   ├── Account 1
│   ├── Account 2
│   └── ... (all accounts)
├── By Reconciled By
│   ├── User 1
│   ├── User 2
│   └── ... (all users)
├── By Period Start Date
│   ├── Today
│   ├── Past 7 days
│   ├── This month
│   └── Custom range
└── By Period End Date
    ├── Today
    ├── Past 7 days
    └── This month
```

### Fieldset Organization

```
Reconciliation Form Layout:
├── Period Information
│   ├── Bank Account (select)
│   ├── Period Start Date
│   ├── Period End Date
│   └── Statement Balance
├── System Information (read-only)
│   ├── Opening Balance
│   ├── Transactions Total
│   └── System Balance
├── Reconciliation Status
│   ├── Status (select)
│   ├── Difference (calculated, read-only)
│   └── Notes (textarea)
├── Completion Information
│   ├── Reconciled By (read-only)
│   └── Completed Date (read-only)
├── Reconciliation Items (inline)
│   └── [ReconciliationItem inline table]
└── Audit Information
    ├── Tenant (read-only)
    ├── Created At (read-only)
    └── Modified At (read-only)
```

### ReconciliationItem Inline Display

```
Inline Items Table:
┌──────────────┬───────────────┬────────────┬──────────┬─────────────┐
│ Transaction  │ Statement     │ Amount     │ Matched  │ Notes       │
├──────────────┼───────────────┼────────────┼──────────┼─────────────┤
│ JV-001       │ CHQ-12345     │ 5,000.00   │ Yes      │ Check clr   │
│ JV-002       │ DEP-67890     │ 10,000.00  │ Yes      │ Deposit     │
│ —            │ FEE-001       │ -150.00    │ No       │ Bank fee    │
│ JV-003       │ —             │ 2,500.00   │ No       │ Pending     │
└──────────────┴───────────────┴────────────┴──────────┴─────────────┘
```

### Custom Admin Actions

| Action | Purpose | Confirmation |
|--------|---------|--------------|
| Mark as Completed | Finalize reconciliations | "Are you sure? This will lock the reconciliation." |
| Reopen Reconciliation | Unlock for changes | "This will allow modifications. Proceed?" |
| Export to PDF | Generate report | No confirmation needed |
| Export to Excel | Data export | No confirmation needed |

### Status Display Logic

```
Status Badge Display:
├── PENDING
│   ├── Color: Gray
│   ├── Icon: Clock
│   └── Text: "Pending"
├── IN_PROGRESS
│   ├── Color: Blue
│   ├── Icon: Spinner
│   └── Text: "In Progress"
└── COMPLETED
    ├── Color: Green
    ├── Icon: Checkmark
    └── Text: "Completed"
```

### Balance Difference Display

```
Difference Display Logic:
├── Difference = 0
│   ├── Color: Green
│   ├── Icon: Checkmark
│   └── Text: "LKR 0.00 ✓"
└── Difference ≠ 0
    ├── Color: Red
    ├── Icon: Warning
    └── Text: "LKR 1,500.00 ⚠"
```

### Expected Outcome
- Reconciliation admin interface fully functional
- Inline editing of reconciliation items enabled
- Status badges provide visual indicators
- Balance differences highlighted clearly
- Custom actions available for bulk operations
- Filtering and search work efficiently
- Form organized into logical sections
- Read-only fields protect calculated values

### Verification Checklist
- [ ] `ReconciliationItemInline` class defined
- [ ] Inline displays: transaction, statement, amount, matched, notes
- [ ] `ReconciliationAdmin` class defined and registered
- [ ] List display shows: account, period, status, balances, difference
- [ ] List filters include: status, account, reconciled by, dates
- [ ] Search works on: account name, notes, user name
- [ ] Fieldsets organize form into logical sections
- [ ] Read-only fields include: calculated balances, audit fields
- [ ] Custom display methods show status badges and colored differences
- [ ] Custom actions include: mark completed, reopen, export
- [ ] Inline items display properly within reconciliation form
- [ ] Admin interface accessible at `/admin/reconciliation/reconciliation/`
- [ ] Status changes work correctly through admin panel
- [ ] Difference calculation displays accurately

---

## Task 79: Create Reconciliation Serializers

### Overview
Create Django REST Framework serializers for the Reconciliation and related models to enable API-based data exchange. These serializers handle validation, nested relationships, and data transformation between Python objects and JSON representations for frontend consumption.

### Dependencies
- Task 77: BankAccount admin created
- Task 78: Reconciliation admin created
- Django REST Framework installed and configured
- BankAccount, Reconciliation, ReconciliationItem models exist
- DRF serializer patterns established in project

### Instructions

1. **Create serializers module**
   - Navigate to `apps/reconciliation/` directory
   - Create new file named `serializers.py`
   - This will contain all API serializers

2. **Import required dependencies**
   - Import `serializers` from `rest_framework`
   - Import models: BankAccount, Reconciliation, ReconciliationItem
   - Import validators from DRF or Django
   - Import helper utilities for date handling

3. **Create BankAccount serializer**
   - Define `BankAccountSerializer` class
   - Inherit from `serializers.ModelSerializer`
   - This provides basic CRUD serialization

4. **Configure BankAccount Meta class**
   - Set `model = BankAccount`
   - Define `fields` to expose via API
   - Include: id, name, account_number, bank_name, branch
   - Include: account_type, currency, opening_balance, current_balance
   - Include: is_active, created_at, modified_at

5. **Add BankAccount read-only fields**
   - Set `read_only_fields` for computed/audit fields
   - Include: id, current_balance, created_at, modified_at
   - These fields should not be modifiable via API

6. **Add BankAccount custom validation**
   - Create `validate_account_number` method
   - Ensure account number format is valid
   - Check for duplicate account numbers within tenant
   - Raise `ValidationError` if invalid

7. **Create ReconciliationItem serializer**
   - Define `ReconciliationItemSerializer` class
   - Inherit from `serializers.ModelSerializer`
   - This handles individual reconciliation items

8. **Configure ReconciliationItem Meta class**
   - Set `model = ReconciliationItem`
   - Define `fields` for API exposure
   - Include: id, transaction, statement_entry, amount
   - Include: is_matched, matched_date, notes
   - Include: created_at, modified_at

9. **Add ReconciliationItem read-only fields**
   - Set `read_only_fields` appropriately
   - Include: id, matched_date (auto-set on match), timestamps
   - Prevent modification of matched items

10. **Add ReconciliationItem nested fields**
    - Use `SerializerMethodField` to include transaction details
    - Use `SerializerMethodField` to include statement entry details
    - Provide method like `get_transaction_details()` to return transaction info
    - Provide method like `get_statement_details()` to return statement info

11. **Create Reconciliation list serializer**
    - Define `ReconciliationListSerializer` class
    - Lighter serializer for list views (no nested items)
    - Include summary information only

12. **Configure Reconciliation list Meta class**
    - Set `model = Reconciliation`
    - Include: id, bank_account (nested), period_start, period_end
    - Include: status, statement_balance, system_balance, difference
    - Include: reconciled_by (user info), completed_date
    - Exclude: full item details to keep response light

13. **Create Reconciliation detail serializer**
    - Define `ReconciliationDetailSerializer` class
    - Full serializer with nested items
    - Used for detail views and create/update operations

14. **Configure Reconciliation detail Meta class**
    - Set `model = Reconciliation`
    - Include all fields from list serializer
    - Add: notes, opening_balance, transactions_total
    - Include nested items field

15. **Add nested items field to detail serializer**
    - Define `items` field using `ReconciliationItemSerializer`
    - Set `many=True` for list of items
    - Set `read_only=True` or make writable for creation

16. **Add nested bank account field**
    - Use `BankAccountSerializer` for nested account info
    - Or use `PrimaryKeyRelatedField` with `queryset`
    - Provide enough account info for display

17. **Add computed fields to Reconciliation serializers**
    - Create `SerializerMethodField` for `matched_count`
    - Create `SerializerMethodField` for `unmatched_count`
    - Create `SerializerMethodField` for `completion_percentage`
    - Provide methods: `get_matched_count()`, etc.

18. **Add Reconciliation validation**
    - Create `validate()` method for cross-field validation
    - Ensure period_end >= period_start
    - Ensure statement_balance is provided
    - Validate status transitions

19. **Add Reconciliation create/update logic**
    - Override `create()` method if needed
    - Handle nested item creation
    - Set default values (opening_balance, status)
    - Override `update()` method to handle status changes

### Serializer Architecture

```
Serializer Hierarchy:
├── BankAccountSerializer
│   ├── Basic CRUD fields
│   ├── Read-only: current_balance, timestamps
│   └── Validation: account_number format
├── ReconciliationItemSerializer
│   ├── Item fields
│   ├── Nested: transaction_details, statement_details
│   └── Read-only: matched_date, timestamps
├── ReconciliationListSerializer (lightweight)
│   ├── Summary fields only
│   ├── Nested: bank_account (basic info)
│   └── Computed: matched_count, completion_percentage
└── ReconciliationDetailSerializer (complete)
    ├── All reconciliation fields
    ├── Nested: items (full list)
    ├── Nested: bank_account (full details)
    └── Computed: statistics and percentages
```

### BankAccount Serializer Fields

| Field | Type | Read-only | Validation |
|-------|------|-----------|------------|
| id | Integer | Yes | Auto-generated |
| name | String | No | Required, max 200 chars |
| account_number | String | No | Required, unique per tenant |
| bank_name | String | No | Required |
| branch | String | No | Optional |
| account_type | Choice | No | Must be valid enum value |
| currency | String | No | Required, max 3 chars |
| opening_balance | Decimal | No | Required |
| current_balance | Decimal | Yes | Calculated |
| is_active | Boolean | No | Default True |
| created_at | DateTime | Yes | Auto-set |
| modified_at | DateTime | Yes | Auto-updated |

### ReconciliationItem Serializer Fields

| Field | Type | Read-only | Nested |
|-------|------|-----------|--------|
| id | Integer | Yes | No |
| transaction | Integer (FK) | No | Transaction details via method |
| statement_entry | Integer (FK) | No | Statement details via method |
| amount | Decimal | Yes | Calculated |
| is_matched | Boolean | No | Default False |
| matched_date | DateTime | Yes | Auto-set when matched |
| notes | String | No | Optional |
| transaction_details | Object | Yes | Nested object with transaction info |
| statement_details | Object | Yes | Nested object with statement info |

### ReconciliationList Serializer Fields

| Field | Type | Read-only | Purpose |
|-------|------|-----------|---------|
| id | Integer | Yes | Unique identifier |
| bank_account | Object | Yes | Nested account summary |
| period_start | Date | No | Period start date |
| period_end | Date | No | Period end date |
| status | Choice | No | PENDING/IN_PROGRESS/COMPLETED |
| statement_balance | Decimal | No | Bank statement ending balance |
| system_balance | Decimal | Yes | Calculated system balance |
| difference | Decimal | Yes | Calculated difference |
| matched_count | Integer | Yes | Count of matched items |
| unmatched_count | Integer | Yes | Count of unmatched items |
| completion_percentage | Integer | Yes | Matching completion % |
| reconciled_by | Object | Yes | User info if completed |
| completed_date | DateTime | Yes | When completed |

### ReconciliationDetail Serializer Fields

```
ReconciliationDetail Additional Fields:
├── All fields from ReconciliationList
├── notes (String)
├── opening_balance (Decimal)
├── transactions_total (Decimal)
└── items (Array of ReconciliationItem objects)
    └── Each item includes:
        ├── id
        ├── transaction_details
        ├── statement_details
        ├── amount
        ├── is_matched
        ├── matched_date
        └── notes
```

### Nested Object Structures

**Bank Account Nested Object:**
```
{
  "id": 1,
  "name": "Primary Checking Account",
  "account_number": "****1234",
  "bank_name": "Commercial Bank of Ceylon",
  "account_type": "CHECKING",
  "currency": "LKR"
}
```

**Transaction Details Nested Object:**
```
{
  "id": 42,
  "reference": "JV-2026-001",
  "date": "2026-01-15",
  "description": "Payment to Supplier",
  "amount": 15000.00,
  "transaction_type": "PAYMENT"
}
```

**Statement Entry Details Nested Object:**
```
{
  "id": 83,
  "reference": "CHQ-123456",
  "date": "2026-01-16",
  "description": "Check Payment",
  "amount": 15000.00,
  "entry_type": "WITHDRAWAL"
}
```

### Validation Rules

| Validation | Field(s) | Rule | Error Message |
|------------|----------|------|---------------|
| Date range | period_start, period_end | end >= start | "End date must be after or equal to start date" |
| Statement balance | statement_balance | required, not null | "Statement balance is required" |
| Account number format | account_number | matches bank format | "Invalid account number format" |
| Status transition | status | follow workflow | "Invalid status transition" |
| Matched date | matched_date | set only if is_matched | "Matched date requires is_matched=True" |

### Status Transition Validation

```
Valid Status Transitions:
PENDING → IN_PROGRESS → COMPLETED
   ↓           ↓
   ↓           PENDING
   COMPLETED

Invalid Transitions:
PENDING → COMPLETED (must go through IN_PROGRESS)
COMPLETED → IN_PROGRESS (can only reopen to PENDING)
```

### Computed Field Calculations

| Field | Calculation | Formula |
|-------|-------------|---------|
| matched_count | Count of matched items | `items.filter(is_matched=True).count()` |
| unmatched_count | Count of unmatched items | `items.filter(is_matched=False).count()` |
| completion_percentage | Matching progress | `(matched_count / total_items) * 100` |
| difference | Balance discrepancy | `statement_balance - system_balance` |
| system_balance | Calculated balance | `opening_balance + transactions_total` |

### Expected Outcome
- BankAccountSerializer handles account CRUD operations
- ReconciliationItemSerializer manages item data
- ReconciliationListSerializer provides efficient list views
- ReconciliationDetailSerializer includes complete nested data
- All serializers include proper validation
- Nested relationships populated correctly
- Computed fields provide useful statistics
- Error messages are clear and actionable

### Verification Checklist
- [ ] `serializers.py` file created in `apps/reconciliation/`
- [ ] `BankAccountSerializer` defined with all account fields
- [ ] BankAccount read-only fields: id, current_balance, timestamps
- [ ] BankAccount validation includes account_number format check
- [ ] `ReconciliationItemSerializer` defined with item fields
- [ ] ReconciliationItem includes nested transaction and statement details
- [ ] `ReconciliationListSerializer` defined for list views
- [ ] ReconciliationList includes computed fields: matched/unmatched counts
- [ ] `ReconciliationDetailSerializer` defined for detail views
- [ ] ReconciliationDetail includes nested items array
- [ ] Validation methods enforce business rules
- [ ] Status transition validation implemented
- [ ] Date range validation implemented
- [ ] Computed fields calculate correctly
- [ ] Serializers can be imported from `apps.reconciliation.serializers`

---

## Task 80: Create ReconciliationViewSet

### Overview
Create the Django REST Framework ViewSet for the Reconciliation API, providing RESTful endpoints for listing, creating, retrieving, updating, and deleting reconciliation records. The ViewSet handles authentication, permissions, filtering, pagination, and custom actions for the reconciliation workflow.

### Dependencies
- Task 79: Reconciliation serializers must be created
- Django REST Framework configured with routers
- Authentication and permission classes available
- Filtering backend configured (django-filter)
- Pagination classes defined

### Instructions

1. **Create views module**
   - Navigate to `apps/reconciliation/` directory
   - Create new file named `views.py` or `viewsets.py`
   - This will contain all API viewsets

2. **Import required dependencies**
   - Import `viewsets` from `rest_framework`
   - Import `Response`, `status` from `rest_framework`
   - Import `action` decorator for custom endpoints
   - Import authentication and permission classes
   - Import filtering and pagination classes

3. **Import models and serializers**
   - Import `Reconciliation`, `ReconciliationItem`, `BankAccount`
   - Import serializers from `reconciliation.serializers`
   - Import any service classes for business logic

4. **Create ReconciliationViewSet class**
   - Define `ReconciliationViewSet` class
   - Inherit from `viewsets.ModelViewSet`
   - This provides standard CRUD operations

5. **Configure queryset**
   - Set `queryset = Reconciliation.objects.all()`
   - Apply tenant filtering if multi-tenant
   - Use `select_related()` for bank_account
   - Use `prefetch_related()` for items

6. **Configure authentication and permissions**
   - Set `authentication_classes` (TokenAuth, SessionAuth, etc.)
   - Set `permission_classes` (IsAuthenticated, custom permissions)
   - Ensure tenant-based access control

7. **Configure filtering**
   - Set `filter_backends` (DjangoFilterBackend, SearchFilter, OrderingFilter)
   - Set `filterset_fields` for query parameters
   - Include: bank_account, status, period_start, period_end
   - Include: reconciled_by for filtering by user

8. **Configure search**
   - Set `search_fields` for text search
   - Include: bank_account__name, bank_account__account_number
   - Include: notes field for searching notes

9. **Configure ordering**
   - Set `ordering_fields` for sortable columns
   - Include: period_start, period_end, statement_balance, status
   - Set `ordering` default to `['-period_end']` (newest first)

10. **Configure pagination**
    - Set `pagination_class` if not using default
    - Standard page size: 20-50 items per page
    - Ensure consistent with other API endpoints

11. **Override get_serializer_class method**
    - Return `ReconciliationDetailSerializer` for retrieve/create/update
    - Return `ReconciliationListSerializer` for list action
    - Optimizes API responses based on action

12. **Override get_queryset method**
    - Apply tenant filtering based on request user
    - Apply permission-based filtering
    - Optimize query with select_related and prefetch_related
    - Return filtered queryset

13. **Override create method**
    - Validate incoming data
    - Set default values (status, opening_balance)
    - Create reconciliation record
    - Return appropriate response with created data

14. **Override update method**
    - Validate status transitions
    - Prevent updates to completed reconciliations
    - Update reconciliation record
    - Return updated data

15. **Override destroy method**
    - Prevent deletion of completed reconciliations
    - Implement soft delete if applicable
    - Return appropriate response

16. **Add custom action: start_reconciliation**
    - Use `@action(detail=True, methods=['post'])` decorator
    - Transition reconciliation from PENDING to IN_PROGRESS
    - Validate state transition
    - Return updated reconciliation

17. **Add custom action: complete_reconciliation**
    - Use `@action(detail=True, methods=['post'])` decorator
    - Finalize reconciliation (set status to COMPLETED)
    - Set reconciled_by to current user
    - Set completed_date to current datetime
    - Validate all items are matched or explained
    - Return completion confirmation

18. **Add custom action: reopen_reconciliation**
    - Use `@action(detail=True, methods=['post'])` decorator
    - Reopen completed reconciliation for modifications
    - Change status from COMPLETED to PENDING
    - Clear reconciled_by and completed_date
    - Return reopened reconciliation

19. **Add custom action: match_items**
    - Use `@action(detail=True, methods=['post'])` decorator
    - Bulk match transaction and statement items
    - Accept array of match pairs: [{transaction_id, statement_id}]
    - Create ReconciliationItem records
    - Return match results

20. **Add custom action: unmatch_items**
    - Use `@action(detail=True, methods=['post'])` decorator
    - Bulk unmatch reconciliation items
    - Accept array of item IDs to unmatch
    - Update is_matched to False, clear matched_date
    - Return unmatch results

21. **Add custom action: get_suggestions**
    - Use `@action(detail=True, methods=['get'])` decorator
    - Return suggested matches based on amount and date
    - Use matching algorithm from service layer
    - Return array of suggested match pairs

22. **Add error handling**
    - Wrap operations in try-except blocks
    - Return appropriate HTTP status codes
    - Provide clear error messages
    - Log errors for debugging

### ViewSet Architecture

```
ReconciliationViewSet:
├── Standard CRUD Operations
│   ├── list() → GET /reconciliations/
│   ├── create() → POST /reconciliations/
│   ├── retrieve() → GET /reconciliations/{id}/
│   ├── update() → PUT /reconciliations/{id}/
│   ├── partial_update() → PATCH /reconciliations/{id}/
│   └── destroy() → DELETE /reconciliations/{id}/
├── Custom Actions
│   ├── start_reconciliation() → POST /reconciliations/{id}/start/
│   ├── complete_reconciliation() → POST /reconciliations/{id}/complete/
│   ├── reopen_reconciliation() → POST /reconciliations/{id}/reopen/
│   ├── match_items() → POST /reconciliations/{id}/match_items/
│   ├── unmatch_items() → POST /reconciliations/{id}/unmatch_items/
│   └── get_suggestions() → GET /reconciliations/{id}/get_suggestions/
├── Filtering & Search
│   ├── Filter by bank_account, status, dates
│   ├── Search by account name, notes
│   └── Order by date, status, balance
└── Permissions & Auth
    ├── IsAuthenticated required
    ├── Tenant-based filtering
    └── Action-based permissions
```

### Standard CRUD Endpoints

| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| GET | `/api/reconciliations/` | list | List all reconciliations with filters |
| POST | `/api/reconciliations/` | create | Create new reconciliation |
| GET | `/api/reconciliations/{id}/` | retrieve | Get single reconciliation details |
| PUT | `/api/reconciliations/{id}/` | update | Full update of reconciliation |
| PATCH | `/api/reconciliations/{id}/` | partial_update | Partial update of reconciliation |
| DELETE | `/api/reconciliations/{id}/` | destroy | Delete reconciliation |

### Custom Action Endpoints

| Method | Endpoint | Purpose | Request Body |
|--------|----------|---------|--------------|
| POST | `/reconciliations/{id}/start/` | Begin reconciliation | None |
| POST | `/reconciliations/{id}/complete/` | Finalize reconciliation | `{notes: "..."}` |
| POST | `/reconciliations/{id}/reopen/` | Unlock for changes | `{reason: "..."}` |
| POST | `/reconciliations/{id}/match_items/` | Match transactions | `{matches: [{transaction_id, statement_id}]}` |
| POST | `/reconciliations/{id}/unmatch_items/` | Unmatch items | `{item_ids: [1, 2, 3]}` |
| GET | `/reconciliations/{id}/get_suggestions/` | Get match suggestions | None (query params) |

### Filtering Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| bank_account | Integer | `?bank_account=5` | Filter by bank account ID |
| status | String | `?status=PENDING` | Filter by reconciliation status |
| period_start__gte | Date | `?period_start__gte=2026-01-01` | Period starts on or after date |
| period_start__lte | Date | `?period_start__lte=2026-01-31` | Period starts on or before date |
| period_end__gte | Date | `?period_end__gte=2026-01-31` | Period ends on or after date |
| period_end__lte | Date | `?period_end__lte=2026-12-31` | Period ends on or before date |
| reconciled_by | Integer | `?reconciled_by=3` | Filter by user who completed |
| search | String | `?search=checking` | Search in account name, notes |
| ordering | String | `?ordering=-period_end` | Sort by field (- for descending) |

### Search and Ordering

```
Search Examples:
├── ?search=checking
│   └── Searches: bank_account name, account_number, notes
├── ?search=january
│   └── Searches in notes and related text fields
└── ?search=BOC
    └── Finds reconciliations for "Bank of Ceylon"

Ordering Examples:
├── ?ordering=period_start (oldest first)
├── ?ordering=-period_end (newest first)
├── ?ordering=status (by status alphabetically)
└── ?ordering=-statement_balance (highest balance first)
```

### Start Reconciliation Action

**Endpoint:** `POST /api/reconciliations/{id}/start/`

**Request:**
```
POST /api/reconciliations/42/start/
Authorization: Token abc123...
```

**Response (Success):**
```
{
  "id": 42,
  "status": "IN_PROGRESS",
  "message": "Reconciliation started successfully",
  "started_at": "2026-01-25T10:30:00Z"
}
```

**Business Logic:**
- Validate status is PENDING
- Change status to IN_PROGRESS
- Record timestamp
- Return updated reconciliation

### Complete Reconciliation Action

**Endpoint:** `POST /api/reconciliations/{id}/complete/`

**Request:**
```
POST /api/reconciliations/42/complete/
Content-Type: application/json
Authorization: Token abc123...

{
  "notes": "All transactions matched successfully"
}
```

**Response (Success):**
```
{
  "id": 42,
  "status": "COMPLETED",
  "reconciled_by": {
    "id": 5,
    "username": "accountant1",
    "email": "accountant@company.com"
  },
  "completed_date": "2026-01-25T11:45:00Z",
  "difference": 0.00,
  "message": "Reconciliation completed successfully"
}
```

**Validation:**
- Status must be IN_PROGRESS
- All items must be matched or have explanations
- Difference should be zero (or within tolerance)
- Set reconciled_by to current user
- Set completed_date to now

### Match Items Action

**Endpoint:** `POST /api/reconciliations/{id}/match_items/`

**Request:**
```
POST /api/reconciliations/42/match_items/
Content-Type: application/json
Authorization: Token abc123...

{
  "matches": [
    {
      "transaction_id": 101,
      "statement_id": 501,
      "notes": "Check payment cleared"
    },
    {
      "transaction_id": 102,
      "statement_id": 502,
      "notes": "Direct deposit"
    }
  ]
}
```

**Response (Success):**
```
{
  "matched_count": 2,
  "items": [
    {
      "id": 1,
      "transaction_id": 101,
      "statement_id": 501,
      "amount": 5000.00,
      "is_matched": true,
      "matched_date": "2026-01-25T12:00:00Z"
    },
    {
      "id": 2,
      "transaction_id": 102,
      "statement_id": 502,
      "amount": 10000.00,
      "is_matched": true,
      "matched_date": "2026-01-25T12:00:00Z"
    }
  ],
  "message": "2 items matched successfully"
}
```

### Get Suggestions Action

**Endpoint:** `GET /api/reconciliations/{id}/get_suggestions/`

**Request:**
```
GET /api/reconciliations/42/get_suggestions/?confidence=high
Authorization: Token abc123...
```

**Response (Success):**
```
{
  "suggestions": [
    {
      "transaction": {
        "id": 103,
        "reference": "JV-2026-045",
        "date": "2026-01-15",
        "amount": 7500.00,
        "description": "Vendor payment"
      },
      "statement": {
        "id": 503,
        "reference": "CHQ-987654",
        "date": "2026-01-16",
        "amount": 7500.00,
        "description": "Check clearance"
      },
      "confidence": "HIGH",
      "match_score": 95,
      "reasons": [
        "Exact amount match",
        "Dates within 1 day",
        "Similar description"
      ]
    }
  ],
  "total_suggestions": 1
}
```

### Permission Matrix

| Action | Permission Required | Additional Check |
|--------|---------------------|------------------|
| list | IsAuthenticated | Tenant filtering |
| retrieve | IsAuthenticated | Tenant ownership |
| create | IsAuthenticated + CanCreateReconciliation | Bank account access |
| update | IsAuthenticated + CanEditReconciliation | Not completed |
| destroy | IsAuthenticated + CanDeleteReconciliation | Not completed |
| start | IsAuthenticated + CanStartReconciliation | Status = PENDING |
| complete | IsAuthenticated + CanCompleteReconciliation | Status = IN_PROGRESS |
| reopen | IsAuthenticated + CanReopenReconciliation | Status = COMPLETED |
| match_items | IsAuthenticated + CanMatchItems | Not completed |
| unmatch_items | IsAuthenticated + CanUnmatchItems | Not completed |

### Error Responses

| Status Code | Scenario | Response |
|-------------|----------|----------|
| 400 Bad Request | Invalid data | `{"error": "Invalid period dates"}` |
| 401 Unauthorized | Not authenticated | `{"detail": "Authentication required"}` |
| 403 Forbidden | No permission | `{"detail": "Permission denied"}` |
| 404 Not Found | Reconciliation not found | `{"detail": "Not found"}` |
| 409 Conflict | Invalid state transition | `{"error": "Cannot complete pending reconciliation"}` |
| 500 Server Error | Server error | `{"error": "Internal server error"}` |

### Expected Outcome
- ReconciliationViewSet provides complete CRUD API
- Standard endpoints handle basic operations
- Custom actions support reconciliation workflow
- Filtering and search work efficiently
- Permissions enforce security rules
- Error handling provides clear feedback
- Status transitions validated properly
- Tenant isolation maintained

### Verification Checklist
- [ ] `views.py` or `viewsets.py` file created in `apps/reconciliation/`
- [ ] `ReconciliationViewSet` class defined
- [ ] Inherits from `viewsets.ModelViewSet`
- [ ] Queryset configured with proper joins
- [ ] Authentication and permission classes set
- [ ] Filtering configured: bank_account, status, dates
- [ ] Search configured: account name, notes
- [ ] Ordering configured with default sort
- [ ] `get_serializer_class()` returns appropriate serializer
- [ ] `get_queryset()` applies tenant filtering
- [ ] `create()` method validates and creates reconciliation
- [ ] `update()` method prevents updating completed records
- [ ] `destroy()` method prevents deleting completed records
- [ ] Custom action `start_reconciliation` implemented
- [ ] Custom action `complete_reconciliation` implemented
- [ ] Custom action `reopen_reconciliation` implemented
- [ ] Custom action `match_items` implemented
- [ ] Custom action `unmatch_items` implemented
- [ ] Custom action `get_suggestions` implemented
- [ ] Error handling returns proper HTTP status codes
- [ ] ViewSet can be imported from `apps.reconciliation.views`

---

## Task 81: Add Import Statement Endpoint

### Overview
Create a specialized API endpoint for importing bank statements into the reconciliation system. This endpoint handles file uploads (CSV, Excel, OFX), parses statement data, validates entries, and creates StatementEntry records for reconciliation matching.

### Dependencies
- Task 80: ReconciliationViewSet must be created
- StatementEntry model must exist
- File upload handling configured in Django
- CSV, Excel, OFX parsing libraries installed
- File validation utilities available

### Instructions

1. **Install required libraries**
   - Install `openpyxl` for Excel file parsing
   - Install `pandas` for data manipulation (optional but recommended)
   - Install `ofxparse` for OFX file parsing
   - Add to requirements.txt

2. **Create statement import service**
   - Navigate to `apps/reconciliation/` directory
   - Create new file named `services.py` or `import_service.py`
   - This will contain import logic separate from view

3. **Create statement parser classes**
   - Create base `StatementParser` class
   - Create `CSVStatementParser` for CSV files
   - Create `ExcelStatementParser` for Excel files
   - Create `OFXStatementParser` for OFX files
   - Each parser implements `parse()` method

4. **Implement CSV parser**
   - Handle various CSV formats from different banks
   - Parse columns: date, description, reference, amount, balance
   - Handle different date formats
   - Handle debit/credit columns or signed amounts
   - Return standardized data structure

5. **Implement Excel parser**
   - Use openpyxl to read Excel files
   - Support .xlsx and .xls formats
   - Parse worksheets (usually first sheet)
   - Handle similar columns as CSV
   - Return standardized data structure

6. **Implement OFX parser**
   - Use ofxparse library
   - Parse OFX/QFX files from banks
   - Extract transaction date, amount, memo, reference
   - Handle both OFX 1.0 and 2.0 formats
   - Return standardized data structure

7. **Create format detection logic**
   - Implement `detect_format()` function
   - Check file extension (.csv, .xlsx, .ofx, .qfx)
   - Validate file mime type
   - Return appropriate parser class

8. **Create validation logic**
   - Validate required fields are present
   - Validate date formats are parseable
   - Validate amounts are numeric
   - Check for duplicate entries within import
   - Check for duplicates against existing statements

9. **Create data transformation logic**
   - Standardize date format to YYYY-MM-DD
   - Normalize amount to decimal (positive/negative)
   - Clean up description text (trim, remove special chars)
   - Extract reference numbers from description if needed
   - Map bank-specific fields to standard fields

10. **Add import endpoint to viewset**
    - Add custom action to ReconciliationViewSet
    - Use `@action(detail=True, methods=['post'])`
    - URL: `/reconciliations/{id}/import_statement/`
    - Accept file upload via multipart/form-data

11. **Configure file upload handling**
    - Accept file via `request.FILES`
    - Validate file size (limit to 5-10 MB)
    - Validate file type (CSV, Excel, OFX only)
    - Save file temporarily for processing

12. **Implement import workflow**
    - Receive uploaded file
    - Detect file format
    - Instantiate appropriate parser
    - Parse file content
    - Validate parsed data
    - Transform data to standard format
    - Create StatementEntry records
    - Link entries to reconciliation
    - Return import results

13. **Handle import errors**
    - Catch file format errors
    - Catch parsing errors
    - Catch validation errors
    - Return detailed error messages with line numbers
    - Provide sample of failed rows
    - Suggest corrections

14. **Implement dry-run mode**
    - Add `dry_run` parameter to endpoint
    - Parse and validate without saving
    - Return preview of what would be imported
    - Show validation errors without creating records
    - Allow user to review before final import

15. **Add duplicate detection**
    - Check for duplicate entries within import file
    - Check against existing statements for same account
    - Use combination of: date + amount + reference
    - Report duplicates to user
    - Optionally skip or flag duplicates

16. **Create import result response**
    - Return count of successful imports
    - Return count of failed/skipped entries
    - Return list of created statement entries
    - Return list of errors with details
    - Return duplicate warnings

17. **Add import history tracking**
    - Create ImportLog model or record import metadata
    - Track: who imported, when, file name, result counts
    - Store import file for audit trail
    - Link import batch to entries

18. **Add bank-specific templates**
    - Create CSV templates for common Sri Lankan banks
    - Bank of Ceylon format
    - Commercial Bank format
    - Sampath Bank format
    - Document expected column names and formats

### Import Endpoint Architecture

```
Import Statement Workflow:
1. Upload File
   ├── Validate file size and type
   └── Save temporarily
2. Detect Format
   ├── Check file extension
   └── Select appropriate parser
3. Parse File
   ├── Extract rows from file
   └── Map columns to fields
4. Validate Data
   ├── Check required fields
   ├── Validate formats
   └── Check for duplicates
5. Transform Data
   ├── Standardize dates
   ├── Normalize amounts
   └── Clean descriptions
6. Import (or Preview if dry_run)
   ├── Create StatementEntry records
   └── Link to reconciliation
7. Return Results
   ├── Success count
   ├── Error details
   └── Duplicate warnings
```

### Import Endpoint Details

**Endpoint:** `POST /api/reconciliations/{id}/import_statement/`

**Request:**
```
POST /api/reconciliations/42/import_statement/
Content-Type: multipart/form-data
Authorization: Token abc123...

--boundary
Content-Disposition: form-data; name="file"; filename="statement.csv"
Content-Type: text/csv

Date,Description,Reference,Debit,Credit,Balance
2026-01-01,Opening Balance,,,50000.00
2026-01-05,Check Payment,CHQ-123,5000.00,,45000.00
2026-01-10,Deposit,DEP-456,,10000.00,55000.00
--boundary
Content-Disposition: form-data; name="dry_run"

false
--boundary--
```

**Response (Success):**
```
{
  "success": true,
  "imported_count": 3,
  "failed_count": 0,
  "duplicate_count": 0,
  "entries": [
    {
      "id": 201,
      "date": "2026-01-01",
      "description": "Opening Balance",
      "amount": 0.00,
      "balance": 50000.00
    },
    {
      "id": 202,
      "date": "2026-01-05",
      "description": "Check Payment",
      "reference": "CHQ-123",
      "amount": -5000.00,
      "balance": 45000.00
    },
    {
      "id": 203,
      "date": "2026-01-10",
      "description": "Deposit",
      "reference": "DEP-456",
      "amount": 10000.00,
      "balance": 55000.00
    }
  ],
  "message": "Successfully imported 3 statement entries"
}
```

**Response (Validation Errors):**
```
{
  "success": false,
  "imported_count": 0,
  "failed_count": 2,
  "errors": [
    {
      "row": 5,
      "field": "date",
      "value": "invalid-date",
      "message": "Invalid date format. Expected YYYY-MM-DD"
    },
    {
      "row": 8,
      "field": "amount",
      "value": "abc",
      "message": "Amount must be numeric"
    }
  ],
  "message": "Import failed. Please correct errors and try again."
}
```

### Supported File Formats

| Format | Extension | Library | Sri Lankan Banks |
|--------|-----------|---------|------------------|
| CSV | .csv | Python csv | Bank of Ceylon, Commercial Bank |
| Excel | .xlsx, .xls | openpyxl | Sampath Bank, HNB |
| OFX | .ofx, .qfx | ofxparse | International banks, online banking |

### CSV Format Examples

**Standard Format (Commercial Bank):**
```
Date,Description,Reference,Debit,Credit,Balance
01/01/2026,Opening Balance,,,50000.00
05/01/2026,Check Payment,CHQ-123,5000.00,,45000.00
10/01/2026,Deposit,DEP-456,,10000.00,55000.00
```

**Alternative Format (Bank of Ceylon):**
```
Transaction Date,Particulars,Cheque No,Withdrawal,Deposit,Running Balance
2026-01-01,Opening Balance,,,50000.00
2026-01-05,Chq Payment,CHQ-123,5000.00,,45000.00
2026-01-10,Cash Deposit,DEP-456,,10000.00,55000.00
```

**Single Amount Column Format:**
```
Date,Description,Reference,Amount,Balance
2026-01-01,Opening Balance,,0.00,50000.00
2026-01-05,Check Payment,CHQ-123,-5000.00,45000.00
2026-01-10,Deposit,DEP-456,10000.00,55000.00
```

### Column Mapping Configuration

| Standard Field | Possible Column Names | Transformation |
|----------------|----------------------|----------------|
| date | Date, Transaction Date, Value Date | Parse to YYYY-MM-DD |
| description | Description, Particulars, Narration, Details | Trim whitespace |
| reference | Reference, Ref No, Cheque No, Transaction ID | Extract alphanumeric |
| amount | Amount, Debit/Credit, Withdrawal/Deposit | Combine debit (-) credit (+) |
| balance | Balance, Running Balance, Closing Balance | Parse to decimal |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Required date | Date field not empty | "Date is required for row {n}" |
| Valid date format | Date parseable | "Invalid date format at row {n}" |
| Required amount | Debit or Credit present | "Amount is required for row {n}" |
| Numeric amount | Amount is number | "Amount must be numeric at row {n}" |
| Numeric balance | Balance is number | "Balance must be numeric at row {n}" |
| Future date | Date not in future | "Date cannot be in future at row {n}" |

### Duplicate Detection Logic

```
Duplicate Check:
1. Calculate hash for each entry
   ├── Hash = MD5(date + amount + reference)
   └── Store hash with entry
2. Check within import file
   ├── If hash exists in current batch → DUPLICATE
   └── Flag as duplicate, skip or warn
3. Check against existing statements
   ├── Query: date=? AND amount=? AND reference=?
   ├── If found → POTENTIAL DUPLICATE
   └── Warn user, allow override
```

### Dry Run Mode

**Request with Dry Run:**
```
POST /api/reconciliations/42/import_statement/
Content-Type: multipart/form-data

file: statement.csv
dry_run: true
```

**Dry Run Response:**
```
{
  "dry_run": true,
  "would_import": 15,
  "would_skip": 2,
  "duplicates": 1,
  "preview": [
    {
      "date": "2026-01-05",
      "description": "Check Payment",
      "amount": -5000.00,
      "status": "will_create"
    },
    {
      "date": "2026-01-10",
      "description": "Deposit",
      "amount": 10000.00,
      "status": "duplicate",
      "duplicate_id": 195
    }
  ],
  "message": "Preview mode. No records created."
}
```

### Bank-Specific Configuration

```
Bank Configuration:
├── Bank of Ceylon
│   ├── Date Format: DD/MM/YYYY
│   ├── Columns: Transaction Date, Particulars, Cheque No, Withdrawal, Deposit
│   └── Encoding: UTF-8
├── Commercial Bank
│   ├── Date Format: DD/MM/YYYY
│   ├── Columns: Date, Description, Reference, Debit, Credit
│   └── Encoding: UTF-8
├── Sampath Bank
│   ├── Date Format: YYYY-MM-DD
│   ├── Columns: TxnDate, Description, RefNo, Dr, Cr
│   └── Encoding: UTF-8
└── Generic/Unknown
    ├── Auto-detect date format
    ├── Auto-map columns by similarity
    └── Prompt user for confirmation
```

### Error Handling

| Error Type | Handling | Response |
|------------|----------|----------|
| File too large | Reject upload | "File size exceeds 10 MB limit" |
| Invalid file type | Reject upload | "Only CSV, Excel, OFX files allowed" |
| Corrupt file | Catch parse error | "Unable to parse file. File may be corrupt" |
| Missing columns | Validation error | "Required column 'Date' not found" |
| Invalid data | Row-level errors | List of row errors with line numbers |
| Duplicate entries | Warning | "3 duplicate entries detected" |
| Server error | Log and return 500 | "Import failed. Please try again" |

### Expected Outcome
- Import statement endpoint functional
- Supports CSV, Excel, OFX formats
- Automatic format detection works
- Column mapping handles various bank formats
- Validation catches data errors
- Duplicate detection prevents redundant entries
- Dry run mode allows preview
- Clear error messages guide users
- Import history tracked for audit

### Verification Checklist
- [ ] `services.py` or `import_service.py` file created
- [ ] Base `StatementParser` class defined
- [ ] `CSVStatementParser` class implemented
- [ ] `ExcelStatementParser` class implemented
- [ ] `OFXStatementParser` class implemented (optional)
- [ ] Format detection function implemented
- [ ] Column mapping logic handles multiple formats
- [ ] Data validation checks required fields and formats
- [ ] Duplicate detection checks within file and against DB
- [ ] Custom action `import_statement` added to ReconciliationViewSet
- [ ] Endpoint: `POST /reconciliations/{id}/import_statement/`
- [ ] File upload handling configured
- [ ] Dry run mode parameter supported
- [ ] Error handling returns detailed validation errors
- [ ] Success response includes imported entry details
- [ ] Import works for CSV files with sample bank formats
- [ ] Import works for Excel files
- [ ] Import handles date format variations
- [ ] Import handles debit/credit column variations
- [ ] Import creates StatementEntry records correctly
- [ ] Endpoint can be tested via API client

---

## Task 82: Add URL Routes

### Overview
Configure URL routing for the reconciliation API endpoints by registering ViewSets with Django REST Framework routers and defining any additional custom URL patterns. This task establishes the final URL structure for accessing all reconciliation features via HTTP.

### Dependencies
- Task 80: ReconciliationViewSet must be created
- Task 81: Import statement endpoint must be added
- Django REST Framework routers configured in project
- Main API URL configuration exists
- URL namespace structure established

### Instructions

1. **Create reconciliation urls module**
   - Navigate to `apps/reconciliation/` directory
   - Create new file named `urls.py`
   - This will contain reconciliation-specific URL patterns

2. **Import required dependencies**
   - Import `DefaultRouter` from `rest_framework.routers`
   - Import `path`, `include` from `django.urls`
   - Import viewsets from `reconciliation.views`
   - Import any standalone views if created

3. **Create router instance**
   - Instantiate `DefaultRouter()`
   - This provides automatic URL generation for ViewSets
   - Supports standard CRUD operations and custom actions

4. **Register ReconciliationViewSet**
   - Call `router.register()` method
   - First argument: URL prefix (e.g., `'reconciliations'`)
   - Second argument: ViewSet class (`ReconciliationViewSet`)
   - Third argument: basename (e.g., `'reconciliation'`)
   - This generates all standard CRUD URLs

5. **Register BankAccountViewSet if created**
   - If BankAccountViewSet exists, register it
   - URL prefix: `'bank-accounts'`
   - Basename: `'bankaccount'`
   - Generates bank account CRUD URLs

6. **Register ReconciliationItemViewSet if needed**
   - If standalone ReconciliationItemViewSet exists, register it
   - URL prefix: `'reconciliation-items'`
   - Basename: `'reconciliationitem'`
   - Usually items are accessed via reconciliation nested routes

7. **Define app name for namespacing**
   - Set `app_name = 'reconciliation'`
   - Enables reverse URL lookups with namespace
   - Example: `reverse('reconciliation:reconciliation-list')`

8. **Define urlpatterns**
   - Create `urlpatterns` list
   - Include router URLs: `path('', include(router.urls))`
   - This makes all registered ViewSet URLs available

9. **Add custom URL patterns if needed**
   - Add any standalone views not in ViewSets
   - Example: utility endpoints, webhooks, callbacks
   - Use `path()` for explicit URL patterns

10. **Update main API urls**
    - Navigate to project's main `urls.py` (usually `config/urls.py`)
    - Or navigate to API urls if separate (`api/urls.py`)
    - Include reconciliation URLs with namespace

11. **Add reconciliation URL include**
    - In main urlpatterns, add:
    - `path('api/reconciliation/', include('apps.reconciliation.urls'))`
    - Or: `path('reconciliation/', include('apps.reconciliation.urls'))`
    - Adjust based on project URL structure

12. **Verify URL namespace**
    - Ensure namespace is correctly set
    - If using include with namespace: `include(('apps.reconciliation.urls', 'reconciliation'))`
    - Test reverse lookups work

### URL Structure

```
API URL Structure:
/api/
└── reconciliation/
    ├── reconciliations/
    │   ├── GET     /                                       → list
    │   ├── POST    /                                       → create
    │   ├── GET     /{id}/                                  → retrieve
    │   ├── PUT     /{id}/                                  → update
    │   ├── PATCH   /{id}/                                  → partial_update
    │   ├── DELETE  /{id}/                                  → destroy
    │   ├── POST    /{id}/start/                            → start_reconciliation
    │   ├── POST    /{id}/complete/                         → complete_reconciliation
    │   ├── POST    /{id}/reopen/                           → reopen_reconciliation
    │   ├── POST    /{id}/match_items/                      → match_items
    │   ├── POST    /{id}/unmatch_items/                    → unmatch_items
    │   ├── GET     /{id}/get_suggestions/                  → get_suggestions
    │   └── POST    /{id}/import_statement/                 → import_statement
    └── bank-accounts/
        ├── GET     /                                       → list
        ├── POST    /                                       → create
        ├── GET     /{id}/                                  → retrieve
        ├── PUT     /{id}/                                  → update
        ├── PATCH   /{id}/                                  → partial_update
        └── DELETE  /{id}/                                  → destroy
```

### Router-Generated URLs

| URL Pattern | View Name | HTTP Methods | Description |
|-------------|-----------|--------------|-------------|
| `/reconciliations/` | reconciliation-list | GET, POST | List/Create reconciliations |
| `/reconciliations/{id}/` | reconciliation-detail | GET, PUT, PATCH, DELETE | Retrieve/Update/Delete reconciliation |
| `/reconciliations/{id}/start/` | reconciliation-start | POST | Start reconciliation |
| `/reconciliations/{id}/complete/` | reconciliation-complete | POST | Complete reconciliation |
| `/reconciliations/{id}/reopen/` | reconciliation-reopen | POST | Reopen reconciliation |
| `/reconciliations/{id}/match_items/` | reconciliation-match-items | POST | Match items |
| `/reconciliations/{id}/unmatch_items/` | reconciliation-unmatch-items | POST | Unmatch items |
| `/reconciliations/{id}/get_suggestions/` | reconciliation-get-suggestions | GET | Get match suggestions |
| `/reconciliations/{id}/import_statement/` | reconciliation-import-statement | POST | Import bank statement |

### URL Name Patterns

```
URL Name Pattern (for reverse lookups):
{basename}-{suffix}

Examples:
├── reconciliation-list           → /reconciliations/
├── reconciliation-detail         → /reconciliations/{id}/
├── reconciliation-start          → /reconciliations/{id}/start/
├── reconciliation-complete       → /reconciliations/{id}/complete/
└── bankaccount-list             → /bank-accounts/
```

### Reverse URL Lookups

**In Python Code:**
```
from django.urls import reverse

# List view
url = reverse('reconciliation:reconciliation-list')
# Result: '/api/reconciliation/reconciliations/'

# Detail view
url = reverse('reconciliation:reconciliation-detail', kwargs={'pk': 42})
# Result: '/api/reconciliation/reconciliations/42/'

# Custom action
url = reverse('reconciliation:reconciliation-start', kwargs={'pk': 42})
# Result: '/api/reconciliation/reconciliations/42/start/'
```

**In Templates (if applicable):**
```
{% url 'reconciliation:reconciliation-list' %}
{% url 'reconciliation:reconciliation-detail' pk=reconciliation.id %}
{% url 'reconciliation:reconciliation-complete' pk=reconciliation.id %}
```

### URL Parameters

| Parameter | Type | Location | Example | Description |
|-----------|------|----------|---------|-------------|
| id / pk | Integer | Path | `/reconciliations/42/` | Primary key of reconciliation |
| bank_account | Integer | Query | `?bank_account=5` | Filter by bank account |
| status | String | Query | `?status=PENDING` | Filter by status |
| search | String | Query | `?search=checking` | Search text |
| ordering | String | Query | `?ordering=-period_end` | Sort order |
| page | Integer | Query | `?page=2` | Pagination page |
| page_size | Integer | Query | `?page_size=50` | Items per page |

### Complete URL Examples

```
Standard CRUD:
├── GET    /api/reconciliation/reconciliations/
├── GET    /api/reconciliation/reconciliations/?status=PENDING
├── GET    /api/reconciliation/reconciliations/?search=BOC
├── GET    /api/reconciliation/reconciliations/42/
├── POST   /api/reconciliation/reconciliations/
├── PUT    /api/reconciliation/reconciliations/42/
├── PATCH  /api/reconciliation/reconciliations/42/
└── DELETE /api/reconciliation/reconciliations/42/

Custom Actions:
├── POST   /api/reconciliation/reconciliations/42/start/
├── POST   /api/reconciliation/reconciliations/42/complete/
├── POST   /api/reconciliation/reconciliations/42/reopen/
├── POST   /api/reconciliation/reconciliations/42/match_items/
├── POST   /api/reconciliation/reconciliations/42/unmatch_items/
├── GET    /api/reconciliation/reconciliations/42/get_suggestions/
└── POST   /api/reconciliation/reconciliations/42/import_statement/

Bank Accounts:
├── GET    /api/reconciliation/bank-accounts/
├── GET    /api/reconciliation/bank-accounts/5/
├── POST   /api/reconciliation/bank-accounts/
├── PUT    /api/reconciliation/bank-accounts/5/
└── DELETE /api/reconciliation/bank-accounts/5/
```

### Integration with Main URLs

**Project Main URLs (`config/urls.py`):**
```
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/accounting/', include('apps.accounting.urls')),
    path('api/reconciliation/', include('apps.reconciliation.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    # ... other apps
]
```

**API Versioning (if applicable):**
```
urlpatterns = [
    path('api/v1/reconciliation/', include('apps.reconciliation.urls')),
    path('api/v2/reconciliation/', include('apps.reconciliation.urls_v2')),
]
```

### Router Options

| Option | Value | Effect |
|--------|-------|--------|
| `trailing_slash` | True (default) | URLs end with `/` |
| `trailing_slash` | False | URLs without trailing `/` |
| `include_root_view` | True (default) | Adds root view listing all endpoints |
| `include_format_suffixes` | True (default) | Allows `.json`, `.api` suffixes |

### URL Access Control

```
Authentication & Permission Flow:
1. Request to URL → Middleware
   └── Check authentication (Token, Session, JWT)
2. View → Permission Classes
   └── Check permissions (IsAuthenticated, custom)
3. ViewSet → get_queryset()
   └── Apply tenant filtering
4. Action → Custom permission check
   └── Validate action-specific permissions
5. Return Response or 401/403
```

### Expected Outcome
- URL routing configured for all reconciliation endpoints
- ReconciliationViewSet registered with router
- All CRUD URLs automatically generated
- Custom action URLs accessible
- URL namespacing works correctly
- Reverse URL lookups functional
- URL structure consistent with project standards
- API browsable interface works (if DRF browsable API enabled)

### Verification Checklist
- [ ] `urls.py` file created in `apps/reconciliation/`
- [ ] `DefaultRouter` instance created
- [ ] `ReconciliationViewSet` registered with router
- [ ] Basename set to `'reconciliation'`
- [ ] `app_name` set for namespace
- [ ] `urlpatterns` includes router URLs
- [ ] Reconciliation URLs included in main API urls
- [ ] URL prefix is `/api/reconciliation/` or similar
- [ ] List URL accessible: `GET /api/reconciliation/reconciliations/`
- [ ] Detail URL accessible: `GET /api/reconciliation/reconciliations/{id}/`
- [ ] Custom actions accessible (start, complete, reopen, etc.)
- [ ] Import statement URL accessible: `POST /api/reconciliation/reconciliations/{id}/import_statement/`
- [ ] URL reverse lookups work: `reverse('reconciliation:reconciliation-list')`
- [ ] Filtering works: `?status=PENDING`
- [ ] Search works: `?search=BOC`
- [ ] Pagination works: `?page=2`
- [ ] DRF browsable API displays endpoints correctly
- [ ] Authentication required for endpoints
- [ ] Tenant filtering applies automatically

---

## Summary

This document covered Tasks 77-82, establishing the administrative interface, REST API, and URL routing for the account reconciliation system:

### Completed Components

1. **Django Admin Interfaces (Tasks 77-78)**
   - BankAccount admin with list display, filters, and search
   - Reconciliation admin with inline items and custom actions
   - Status badges and balance difference visualization
   - Organized fieldsets and read-only field protection

2. **API Serializers (Task 79)**
   - BankAccountSerializer for account CRUD operations
   - ReconciliationItemSerializer with nested details
   - ReconciliationListSerializer for efficient list views
   - ReconciliationDetailSerializer with complete nested data
   - Validation logic and computed fields

3. **API ViewSet (Task 80)**
   - ReconciliationViewSet with standard CRUD operations
   - Custom actions: start, complete, reopen, match/unmatch items
   - Filtering, search, and ordering capabilities
   - Permission checks and tenant isolation
   - Suggestion endpoint for automated matching

4. **Statement Import (Task 81)**
   - Multi-format support: CSV, Excel, OFX
   - Automatic format detection and column mapping
   - Data validation and duplicate detection
   - Dry run mode for preview
   - Detailed error reporting

5. **URL Routing (Task 82)**
   - Router-based URL configuration
   - Automatic CRUD endpoint generation
   - Custom action URL registration
   - Namespace configuration
   - Integration with main API URLs

### Key Features Implemented

- Complete admin interface for data management
- RESTful API for frontend integration
- File upload and statement import
- Automated match suggestions
- Comprehensive validation and error handling
- Multi-format file support
- Tenant-based access control
- Audit trail and history tracking

### Next Steps

The next document (Tasks 83-84) will cover:
- Comprehensive testing for all components
- API documentation and usage examples
- Admin interface testing
- Integration testing
- Performance testing
- Documentation for end users and developers

---

**Document Status:** Complete  
**Total Tasks:** 6 (Tasks 77-82)  
**Estimated Total Time:** 3 hours 30 minutes  
**Last Updated:** January 25, 2026
