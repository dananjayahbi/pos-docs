# Tasks 01-06: App Setup & Invoice Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** A - Invoice Model & Types  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Business-Compliance-Financial.md](02_Tasks-07-12_Business-Compliance-Financial.md)

---

## Document Overview

This document covers the initial setup of the invoices Django app and the core foundation of the Invoice model. This includes creating the app structure, registering it for multi-tenant use, defining invoice type and status enumerations, and establishing core and customer-related fields.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create invoices Django App | Low |
| 02 | Register invoices App | Low |
| 03 | Define InvoiceType Choices | Low |
| 04 | Define InvoiceStatus Choices | Low |
| 05 | Create Invoice Model Core Fields | Medium |
| 06 | Add Invoice Customer Fields | Medium |

---

## Task 01: Create invoices Django App

### Overview
Create a new Django app for the invoices module within the backend application. This app will contain all invoice-related models, services, and logic.

### Dependencies
- Phase 03: Core backend infrastructure must be complete
- Multi-tenancy setup from Phase 02

### Instructions

1. **Navigate to apps directory**
   - Open terminal in backend project root
   - Navigate to the apps directory where Django apps are located

2. **Create the invoices app**
   - Use Django management command to create new app
   - Name the app `invoices`
   - Ensure standard Django app structure is created

3. **Verify app structure**
   - Check that `__init__.py` exists
   - Verify `apps.py` is present
   - Confirm `models.py` exists (will be reorganized)
   - Check for `views.py` (will be reorganized)
   - Verify `admin.py` exists
   - Confirm `tests.py` exists

4. **Create modular structure**
   - Create `models/` directory within invoices app
   - Create `models/__init__.py`
   - Create `services/` directory for business logic
   - Create `services/__init__.py`
   - Create `serializers/` directory for API serializers
   - Create `serializers/__init__.py`
   - Create `views/` directory for viewsets
   - Create `views/__init__.py`
   - Create `constants.py` for enumerations

5. **Update apps.py configuration**
   - Set appropriate app name
   - Configure verbose name as "Invoices"
   - Set default_auto_field if needed

### Expected Directory Structure
```
backend/
└── apps/
    └── invoices/
        ├── __init__.py
        ├── apps.py
        ├── admin.py
        ├── constants.py
        ├── models/
        │   └── __init__.py
        ├── services/
        │   └── __init__.py
        ├── serializers/
        │   └── __init__.py
        ├── views/
        │   └── __init__.py
        └── tests/
            └── __init__.py
```

### Verification Checklist
- [ ] invoices app directory exists in apps/
- [ ] apps.py is configured with correct name
- [ ] models/ directory exists with __init__.py
- [ ] services/ directory exists with __init__.py
- [ ] serializers/ directory exists with __init__.py
- [ ] views/ directory exists with __init__.py
- [ ] constants.py file exists

---

## Task 02: Register invoices App

### Overview
Register the invoices app in Django settings as a TENANT_APPS entry to ensure it operates within the multi-tenant architecture with proper schema isolation.

### Dependencies
- Task 01: Create invoices Django App
- Phase 02: Multi-tenancy setup must be complete

### Instructions

1. **Locate Django settings file**
   - Navigate to settings directory
   - Identify the appropriate settings file (base.py or settings.py)
   - Locate the TENANT_APPS configuration list

2. **Add invoices to TENANT_APPS**
   - Add entry for invoices app
   - Use format: `'apps.invoices.apps.InvoicesConfig'` or `'apps.invoices'`
   - Place in appropriate position (after related apps like orders, customers)
   - Maintain alphabetical or logical grouping

3. **Verify TENANT_APPS vs SHARED_APPS**
   - Confirm invoices is in TENANT_APPS (not SHARED_APPS)
   - TENANT_APPS means each tenant has their own invoice data
   - SHARED_APPS would mean invoices are shared across tenants (incorrect)

4. **Update INSTALLED_APPS if needed**
   - If using separate INSTALLED_APPS list, add there too
   - Typically INSTALLED_APPS = SHARED_APPS + TENANT_APPS
   - Ensure no duplicate entries

5. **Check app discovery**
   - Verify Django can discover the app
   - Run `python manage.py showmigrations invoices` to test
   - Should show app is recognized (even with no migrations yet)

### TENANT_APPS Configuration Example
```python
TENANT_APPS = [
    # ... other tenant apps
    'apps.customers',
    'apps.products',
    'apps.inventory',
    'apps.orders',
    'apps.invoices',  # New entry
    'apps.payments',
    # ... more apps
]
```

### Why TENANT_APPS?
- Each tenant needs separate invoice data
- Invoice numbers are tenant-specific
- Customer references are tenant-specific
- Financial data must be isolated per tenant
- Compliance requires data separation

### Verification Checklist
- [ ] invoices app is added to TENANT_APPS
- [ ] invoices app is NOT in SHARED_APPS
- [ ] No duplicate entries in INSTALLED_APPS
- [ ] `python manage.py showmigrations` recognizes invoices app
- [ ] App appears in Django admin when running dev server

---

## Task 03: Define InvoiceType Choices

### Overview
Create enumeration choices for invoice types to support standard invoices, simplified VAT invoices, credit notes, and debit notes. These types determine invoice numbering and compliance requirements.

### Dependencies
- Task 01: Create invoices Django App
- constants.py file must exist

### Instructions

1. **Open constants.py file**
   - Navigate to apps/invoices/constants.py
   - This file will contain all enumeration choices

2. **Create InvoiceType choices**
   - Use Django's TextChoices or tuple format
   - Define four invoice types
   - Each type has code and display name

3. **Define STANDARD invoice type**
   - Code: `'STANDARD'`
   - Display: `'Standard Invoice'`
   - Description: Regular invoice for goods/services
   - Number format: INV-{YEAR}-{SEQUENCE}

4. **Define SVAT invoice type**
   - Code: `'SVAT'`
   - Display: `'Simplified VAT Invoice'`
   - Description: Simplified VAT invoice for eligible businesses
   - Number format: SVAT-{YEAR}-{SEQUENCE}

5. **Define CREDIT_NOTE invoice type**
   - Code: `'CREDIT_NOTE'`
   - Display: `'Credit Note'`
   - Description: Reduces original invoice amount
   - Number format: CN-{YEAR}-{SEQUENCE}

6. **Define DEBIT_NOTE invoice type**
   - Code: `'DEBIT_NOTE'`
   - Display: `'Debit Note'`
   - Description: Increases original invoice amount
   - Number format: DN-{YEAR}-{SEQUENCE}

7. **Add type descriptions as comments**
   - Document when each type should be used
   - Note numbering conventions
   - Reference Sri Lanka compliance requirements

### InvoiceType Implementation
```python
class InvoiceType(models.TextChoices):
    STANDARD = 'STANDARD', 'Standard Invoice'
    SVAT = 'SVAT', 'Simplified VAT Invoice'
    CREDIT_NOTE = 'CREDIT_NOTE', 'Credit Note'
    DEBIT_NOTE = 'DEBIT_NOTE', 'Debit Note'
```

### Type Usage Guidelines

| Type | When to Use | Numbering | Reference Required |
|------|-------------|-----------|-------------------|
| STANDARD | Regular sales invoices | INV-{YEAR}-{SEQ} | Order (optional) |
| SVAT | Simplified VAT eligible | SVAT-{YEAR}-{SEQ} | Order (optional) |
| CREDIT_NOTE | Returns, overcharges | CN-{YEAR}-{SEQ} | Original invoice (required) |
| DEBIT_NOTE | Additional charges | DN-{YEAR}-{SEQ} | Original invoice (required) |

### Sri Lanka Compliance Notes
- **Standard Invoice**: Full VAT invoice with all required fields (BRN, VAT number)
- **SVAT**: For businesses with annual turnover below threshold
- **Credit/Debit Notes**: Must reference original invoice, adjust VAT accordingly

### Verification Checklist
- [ ] InvoiceType class is defined in constants.py
- [ ] STANDARD type is defined
- [ ] SVAT type is defined
- [ ] CREDIT_NOTE type is defined
- [ ] DEBIT_NOTE type is defined
- [ ] Comments document usage guidelines
- [ ] Comments reference numbering formats

---

## Task 04: Define InvoiceStatus Choices

### Overview
Create enumeration choices for invoice status to track the complete lifecycle from draft creation through payment and potential cancellation or voiding.

### Dependencies
- Task 01: Create invoices Django App
- constants.py file must exist

### Instructions

1. **Open constants.py file**
   - Navigate to apps/invoices/constants.py
   - Add InvoiceStatus choices below InvoiceType

2. **Create InvoiceStatus choices**
   - Use Django's TextChoices or tuple format
   - Define eight status values
   - Each status represents a lifecycle stage

3. **Define DRAFT status**
   - Code: `'DRAFT'`
   - Display: `'Draft'`
   - Description: Initial state, editable, no invoice number assigned

4. **Define ISSUED status**
   - Code: `'ISSUED'`
   - Display: `'Issued'`
   - Description: Invoice finalized, invoice number assigned, immutable

5. **Define SENT status**
   - Code: `'SENT'`
   - Display: `'Sent'`
   - Description: Invoice email sent to customer

6. **Define PAID status**
   - Code: `'PAID'`
   - Display: `'Paid'`
   - Description: Full payment received, terminal state

7. **Define PARTIAL status**
   - Code: `'PARTIAL'`
   - Display: `'Partially Paid'`
   - Description: Partial payment received, balance remaining

8. **Define OVERDUE status**
   - Code: `'OVERDUE'`
   - Display: `'Overdue'`
   - Description: Past due date without full payment

9. **Define CANCELLED status**
   - Code: `'CANCELLED'`
   - Display: `'Cancelled'`
   - Description: Cancelled before issuing, terminal state

10. **Define VOID status**
    - Code: `'VOID'`
    - Display: `'Void'`
    - Description: Voided after issuing (for corrections), terminal state

11. **Add status transition documentation**
    - Document allowed state transitions
    - Note which states are terminal
    - Reference business rules for transitions

### InvoiceStatus Implementation
```python
class InvoiceStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    ISSUED = 'ISSUED', 'Issued'
    SENT = 'SENT', 'Sent'
    PAID = 'PAID', 'Paid'
    PARTIAL = 'PARTIAL', 'Partially Paid'
    OVERDUE = 'OVERDUE', 'Overdue'
    CANCELLED = 'CANCELLED', 'Cancelled'
    VOID = 'VOID', 'Void'
```

### Status Lifecycle Flow
```
DRAFT → ISSUED → SENT → PAID (terminal)
  ↓       ↓       ↓       ↑
CANCELLED VOID   PARTIAL → OVERDUE
(terminal) (terminal)  ↓
                     PAID
```

### Status Transition Rules

| From State | Allowed Transitions | Business Rule |
|------------|---------------------|---------------|
| DRAFT | ISSUED, CANCELLED | Can edit, no invoice number yet |
| ISSUED | SENT, PAID, PARTIAL, VOID | Invoice number assigned, immutable |
| SENT | PAID, PARTIAL, OVERDUE, VOID | Email sent to customer |
| PAID | None | Terminal state, fully paid |
| PARTIAL | PAID, OVERDUE, VOID | Some payment received |
| OVERDUE | PAID, PARTIAL, VOID | Past due date |
| CANCELLED | None | Terminal state, cancelled before issue |
| VOID | None | Terminal state, voided after issue |

### Terminal States
- **PAID**: Invoice fully paid, no further action needed
- **CANCELLED**: Draft cancelled before issue, not sent to customer
- **VOID**: Issued invoice voided (corrected with credit/debit note)

### Verification Checklist
- [ ] InvoiceStatus class is defined in constants.py
- [ ] DRAFT status is defined
- [ ] ISSUED status is defined
- [ ] SENT status is defined
- [ ] PAID status is defined
- [ ] PARTIAL status is defined
- [ ] OVERDUE status is defined
- [ ] CANCELLED status is defined
- [ ] VOID status is defined
- [ ] Comments document status transitions
- [ ] Terminal states are identified

---

## Task 05: Create Invoice Model Core Fields

### Overview
Create the Invoice model with core identifying fields including unique invoice number, type, status, and timestamp tracking.

### Dependencies
- Task 01: Create invoices Django App
- Task 03: Define InvoiceType Choices
- Task 04: Define InvoiceStatus Choices
- Phase 03: Base models and mixins

### Instructions

1. **Create invoice.py in models directory**
   - Navigate to apps/invoices/models/
   - Create file named `invoice.py`
   - Import necessary Django modules

2. **Import required dependencies**
   - Import Django models module
   - Import UUID for primary key
   - Import timezone utilities
   - Import InvoiceType and InvoiceStatus from constants
   - Import tenant-aware base model or mixins

3. **Create Invoice model class**
   - Inherit from appropriate base model (TenantAwareModel or similar)
   - Add class docstring explaining purpose
   - Note Sri Lanka compliance requirements

4. **Add id field**
   - Use UUIDField as primary key
   - Set default to uuid.uuid4
   - Set editable=False
   - This provides globally unique invoice identifiers

5. **Add invoice_number field**
   - Use CharField with max_length appropriate for format
   - Set unique=True (within tenant schema)
   - Set blank=True, null=True (assigned on issue)
   - Add help_text explaining auto-generation
   - Add db_index=True for query performance

6. **Add type field**
   - Use CharField with choices=InvoiceType.choices
   - Set default=InvoiceType.STANDARD
   - Set max_length to accommodate choice values
   - Add help_text explaining invoice types
   - Add db_index=True for filtering

7. **Add status field**
   - Use CharField with choices=InvoiceStatus.choices
   - Set default=InvoiceStatus.DRAFT
   - Set max_length to accommodate choice values
   - Add help_text explaining status lifecycle
   - Add db_index=True for filtering

8. **Add created_at field**
   - Use DateTimeField with auto_now_add=True
   - Records when invoice record was created
   - Immutable after creation

9. **Add updated_at field**
   - Use DateTimeField with auto_now=True
   - Automatically updates on any save
   - Tracks last modification time

10. **Add __str__ method**
    - Return invoice_number if exists
    - Otherwise return formatted string with id and status
    - Example: "INV-2026-00001" or "Draft Invoice (uuid)"

11. **Add Meta class**
    - Set db_table name appropriately
    - Set verbose_name and verbose_name_plural
    - Add ordering by creation date (newest first)
    - Add indexes for common queries

### Model Structure
```python
class Invoice(TenantAwareModel):
    """
    Invoice model for tracking sales invoices, SVAT, credit notes, and debit notes.
    Complies with Sri Lanka VAT and invoicing regulations.
    """
    id = models.UUIDField(...)
    invoice_number = models.CharField(...)
    type = models.CharField(choices=InvoiceType.choices, ...)
    status = models.CharField(choices=InvoiceStatus.choices, ...)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'invoices'
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
        ordering = ['-created_at']
```

### Core Fields Summary

| Field | Type | Purpose | Indexed |
|-------|------|---------|---------|
| id | UUID | Primary key | Yes (PK) |
| invoice_number | CharField | Unique invoice identifier | Yes |
| type | CharField | Invoice type (STANDARD, SVAT, etc.) | Yes |
| status | CharField | Current lifecycle status | Yes |
| created_at | DateTime | Record creation timestamp | No |
| updated_at | DateTime | Last modification timestamp | No |

### Verification Checklist
- [ ] invoice.py file exists in models/
- [ ] Invoice model class is defined
- [ ] id field is UUID primary key
- [ ] invoice_number field is defined with unique constraint
- [ ] type field uses InvoiceType choices
- [ ] status field uses InvoiceStatus choices
- [ ] created_at and updated_at fields are present
- [ ] __str__ method returns meaningful representation
- [ ] Meta class defines table name and ordering
- [ ] Model has appropriate docstring

---

## Task 06: Add Invoice Customer Fields

### Overview
Add fields to the Invoice model for storing customer information, including both a foreign key reference to the Customer model and denormalized snapshot fields for historical accuracy.

### Dependencies
- Task 05: Create Invoice Model Core Fields
- Customer model from Phase 04 or Phase 05 must exist

### Instructions

1. **Open invoice.py model file**
   - Navigate to apps/invoices/models/invoice.py
   - Locate the Invoice model class

2. **Import Customer model**
   - Add import for Customer model
   - Use appropriate import path based on project structure
   - Example: `from apps.customers.models import Customer`

3. **Add customer foreign key field**
   - Use ForeignKey to Customer model
   - Set on_delete=models.PROTECT (prevent deletion of customers with invoices)
   - Set related_name='invoices'
   - Add db_index=True for query optimization
   - Add help_text explaining the relationship

4. **Add customer_name field**
   - Use CharField with max_length=255
   - Purpose: Snapshot of customer name at invoice time
   - Set blank=False to ensure it's always populated
   - Add help_text: "Customer name at time of invoice"

5. **Add customer_email field**
   - Use EmailField with max_length=255
   - Purpose: Snapshot of customer email for sending invoice
   - Set blank=True, null=True (email may not be required)
   - Add help_text explaining snapshot purpose

6. **Add customer_phone field**
   - Use CharField with max_length=20
   - Purpose: Snapshot of customer phone number
   - Set blank=True, null=True (phone may be optional)
   - Add help_text explaining snapshot purpose

7. **Add customer_address field**
   - Use TextField
   - Purpose: Snapshot of full billing address
   - Set blank=True, null=True (address may be optional)
   - Add help_text: "Customer billing address at time of invoice"

8. **Add customer_tax_id field**
   - Use CharField with max_length=50
   - Purpose: Customer's tax identification number (TIN/VAT)
   - Set blank=True, null=True (may not have tax ID)
   - Add help_text: "Customer VAT or Tax ID number"

9. **Update __str__ method if needed**
   - Consider including customer name in string representation
   - Example: "INV-2026-00001 - ABC Company"

### Why Denormalize Customer Data?
- **Historical Accuracy**: Customer details may change over time
- **Audit Trail**: Invoice must reflect data at time of issuance
- **Legal Compliance**: Invoice must show exact details sent to customer
- **Data Independence**: Invoice remains valid even if customer is modified
- **Performance**: Avoid joins when displaying invoice details

### Customer Fields Structure
```python
class Invoice(TenantAwareModel):
    # ... core fields from Task 05 ...
    
    # Customer reference and snapshot
    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name='invoices',
        db_index=True,
        help_text="Reference to customer record"
    )
    customer_name = models.CharField(
        max_length=255,
        help_text="Customer name at time of invoice"
    )
    customer_email = models.EmailField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Customer email at time of invoice"
    )
    customer_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Customer phone at time of invoice"
    )
    customer_address = models.TextField(
        blank=True,
        null=True,
        help_text="Customer billing address at time of invoice"
    )
    customer_tax_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Customer VAT or Tax ID number"
    )
```

### Customer Data Flow
```
Customer Record → Invoice Creation → Snapshot to Invoice
     │                    │
     │                    ├─ customer (FK)
     │                    ├─ customer_name (snapshot)
     │                    ├─ customer_email (snapshot)
     │                    ├─ customer_phone (snapshot)
     │                    └─ customer_address (snapshot)
     │
     ▼
Customer Updated
     │
     ▼
Invoice Unchanged (historical accuracy preserved)
```

### Data Population Strategy
When creating invoice from service:
1. Set customer FK to Customer instance
2. Copy customer.name → customer_name
3. Copy customer.email → customer_email
4. Copy customer.phone → customer_phone
5. Copy customer.billing_address → customer_address
6. Copy customer.tax_id → customer_tax_id

### Verification Checklist
- [ ] customer ForeignKey field is added
- [ ] on_delete=PROTECT is set to prevent customer deletion
- [ ] customer_name field is added
- [ ] customer_email field is added
- [ ] customer_phone field is added
- [ ] customer_address field is added
- [ ] customer_tax_id field is added
- [ ] All snapshot fields have appropriate help_text
- [ ] Related_name='invoices' is set on FK
- [ ] db_index=True is set on customer FK

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create invoices Django App | Django app structure |
| 02 | Register invoices App | TENANT_APPS registration |
| 03 | Define InvoiceType Choices | InvoiceType enumeration |
| 04 | Define InvoiceStatus Choices | InvoiceStatus enumeration |
| 05 | Create Invoice Model Core Fields | Invoice model with core fields |
| 06 | Add Invoice Customer Fields | Customer FK and snapshot fields |

### Current Invoice Model Structure
```python
Invoice Model:
├── Core Fields (Task 05)
│   ├── id (UUID, PK)
│   ├── invoice_number (unique)
│   ├── type (STANDARD, SVAT, CREDIT_NOTE, DEBIT_NOTE)
│   ├── status (DRAFT, ISSUED, SENT, PAID, etc.)
│   ├── created_at
│   └── updated_at
└── Customer Fields (Task 06)
    ├── customer (FK)
    ├── customer_name
    ├── customer_email
    ├── customer_phone
    ├── customer_address
    └── customer_tax_id
```

### Next Steps
Proceed to [02_Tasks-07-12_Business-Compliance-Financial.md](02_Tasks-07-12_Business-Compliance-Financial.md) to add:
- Business information fields
- Sri Lanka compliance fields (BRN, VAT)
- Date fields (issue_date, due_date, etc.)
- Financial fields (subtotal, tax, total, etc.)
- Tax breakdown structure
- Reference fields (order, related_invoice)

---

## Notes for AI Agents

1. **Execution Order**: Tasks must be executed in sequence 01→02→03→04→05→06
2. **Multi-Tenancy**: Invoices MUST be in TENANT_APPS for data isolation
3. **Status Transitions**: Implement validation in service layer (not model)
4. **Customer Snapshots**: Always copy customer data on invoice creation
5. **No Migrations Yet**: Migrations will be created in Task 18 after all fields are added
6. **Sri Lanka Focus**: Keep VAT, BRN, and LKR requirements in mind
