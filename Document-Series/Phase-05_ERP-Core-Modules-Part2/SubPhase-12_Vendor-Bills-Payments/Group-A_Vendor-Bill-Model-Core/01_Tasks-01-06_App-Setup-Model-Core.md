# Tasks 01-06: App Setup, Model Core, Status Choices

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** A - Vendor Bill Model & Core  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Date-Financial-User-Notes-Document.md](02_Tasks-07-12_Date-Financial-User-Notes-Document.md)

---

## Document Overview

This document covers the foundation of the vendor bills system, including the Django app creation, app registration in tenant settings, bill status choices definition, and the core VendorBill model with vendor and purchase order relationships. These elements establish the base infrastructure for vendor bill management and payment tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create vendor_bills Django App | Low | 15 min |
| 02 | Register vendor_bills App | Low | 10 min |
| 03 | Define BillStatus Choices | Low | 15 min |
| 04 | Create VendorBill Model Core | Medium | 25 min |
| 05 | Add Bill Vendor Fields | Medium | 20 min |
| 06 | Add Bill PO Reference | Medium | 20 min |

---

## Task 01: Create vendor_bills Django App

### Overview
Create the `vendor_bills` Django application to manage all vendor billing functionality. This app will handle vendor invoices, bill matching against purchase orders and goods received notes, payment tracking, and vendor statement generation.

### Dependencies
- Django project structure established
- Multi-tenancy configured with django-tenants
- Core tenant infrastructure in place

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Change directory to `apps/`
   - This is where all Django applications reside

2. **Create vendor_bills app**
   - Use Django management command to create app
   - Name must be `vendor_bills` to maintain consistency
   - Creates standard Django app structure

3. **Create models subdirectory**
   - Navigate to `apps/vendor_bills/`
   - Create `models/` directory for organizing models
   - Better organization for multiple model files

4. **Initialize models package**
   - Create `__init__.py` in `models/` directory
   - Will import and export models later
   - Allows importing from models package

5. **Create constants module**
   - Create `constants.py` in app root
   - Will store bill status choices and payment terms
   - Centralized constants management

6. **Create services directory**
   - Create `services/` directory in app root
   - Will contain business logic and utilities
   - Separates concerns from models

7. **Create admin configuration**
   - Ensure `admin.py` exists in app root
   - Will register models for Django admin
   - Administrative interface for bill management

### Directory Structure
```
apps/vendor_bills/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration
├── models/
│   └── __init__.py               # Models package
├── constants.py                  # Status and payment terms
├── services/
│   └── __init__.py               # Services package
├── admin.py                      # Admin configurations
├── views.py                      # API views (future)
└── migrations/
    └── __init__.py               # Migrations directory
```

### App Purpose

| Component | Purpose |
|-----------|---------|
| `models/` | VendorBill, BillLineItem models |
| `constants.py` | BillStatus, PaymentTerms choices |
| `services/` | Bill matching, payment processing |
| `admin.py` | Admin interface customization |

### Expected Outcome
- Clean app structure for vendor bills
- Organized location for bill functionality
- Foundation for vendor payment tracking
- Multi-tenant aware application

### Verification Checklist
- [ ] `apps/vendor_bills/` directory exists
- [ ] `apps.py` file created with proper configuration
- [ ] `models/` directory exists with `__init__.py`
- [ ] `constants.py` file created
- [ ] `services/` directory exists with `__init__.py`
- [ ] `admin.py` file exists
- [ ] `migrations/` directory initialized

---

## Task 02: Register vendor_bills App

### Overview
Register the vendor_bills application in the TENANT_APPS setting to ensure it operates within the multi-tenant architecture. This makes the app available to all tenant schemas and ensures proper database isolation.

### Dependencies
- Task 01: Create vendor_bills Django App
- Multi-tenancy settings configured
- TENANT_APPS list defined in settings

### Instructions

1. **Locate tenant settings file**
   - Navigate to project settings directory
   - Find the file containing TENANT_APPS configuration
   - Usually in `config/settings/base.py` or similar

2. **Find TENANT_APPS list**
   - Locate the TENANT_APPS list in settings
   - This list contains all tenant-specific applications
   - Apps here are installed per tenant schema

3. **Add vendor_bills to TENANT_APPS**
   - Add 'apps.vendor_bills' to TENANT_APPS list
   - Place after related apps (purchasing, inventory)
   - Maintain logical grouping of related apps

4. **Verify app configuration**
   - Check apps.py in vendor_bills
   - Ensure name = 'apps.vendor_bills'
   - Verify AppConfig class is properly defined

5. **Update app imports if needed**
   - If using models package, update `models/__init__.py`
   - Ensure proper model exports
   - Allows importing models from app

### TENANT_APPS Configuration

The TENANT_APPS list should include vendor_bills alongside related ERP modules:

```
TENANT_APPS = [
    # ... other apps
    'apps.purchasing',      # Purchase orders
    'apps.inventory',       # Goods received notes
    'apps.vendors',         # Vendor management
    'apps.vendor_bills',    # NEW: Vendor bills
    'apps.payments',        # Payment processing (if exists)
    # ... other apps
]
```

### App Configuration Details

| Setting | Value | Purpose |
|---------|-------|---------|
| App name | 'apps.vendor_bills' | Full Python path to app |
| App type | TENANT_APPS | Tenant-specific installation |
| Dependencies | vendors, purchasing | Related modules |

### Why TENANT_APPS?

#### Multi-Tenant Isolation
- Each tenant has separate bill records
- Bills are isolated per tenant schema
- No cross-tenant bill access
- Proper data segregation

#### Schema-Based Tables
- VendorBill table created in each tenant schema
- Independent bill sequences per tenant
- Tenant-specific configurations
- Isolated migrations

### Expected Outcome
- vendor_bills app available to all tenants
- Proper multi-tenant isolation
- App appears in tenant schemas
- Ready for model migrations

### Verification Checklist
- [ ] TENANT_APPS includes 'apps.vendor_bills'
- [ ] App placed logically with related apps
- [ ] apps.py has correct name configuration
- [ ] No import errors when loading settings
- [ ] App appears in Django admin (after models)

---

## Task 03: Define BillStatus Choices

### Overview
Define the BillStatus choice field constants that represent the lifecycle states of a vendor bill. These statuses track bills from draft creation through approval, payment, and potential disputes or cancellations.

### Dependencies
- Task 01: Create vendor_bills Django App
- constants.py file created

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/vendor_bills/constants.py`
   - Prepare to define bill status constants

2. **Add module docstring**
   - Add comprehensive module documentation
   - Explain bill status lifecycle
   - Document payment terms options

3. **Define BILL_STATUS_DRAFT constant**
   - Value: 'draft'
   - Initial bill state
   - Fully editable, not submitted

4. **Define BILL_STATUS_PENDING constant**
   - Value: 'pending'
   - Submitted for approval
   - Awaiting review by authorized personnel

5. **Define BILL_STATUS_APPROVED constant**
   - Value: 'approved'
   - Approved for payment
   - Ready to schedule payment

6. **Define BILL_STATUS_PARTIAL_PAID constant**
   - Value: 'partial_paid'
   - Partial payment made
   - Outstanding balance remains

7. **Define BILL_STATUS_PAID constant**
   - Value: 'paid'
   - Fully paid
   - No outstanding balance

8. **Define BILL_STATUS_CANCELLED constant**
   - Value: 'cancelled'
   - Bill cancelled
   - No payment will be made

9. **Define BILL_STATUS_DISPUTED constant**
   - Value: 'disputed'
   - Under dispute
   - Payment on hold pending resolution

10. **Create BILL_STATUS_CHOICES tuple**
    - Combine all statuses into Django choices tuple
    - Format: (value, display_name) pairs
    - Used in model field definition

### Bill Status Definitions

| Status | Value | Display Name | Description |
|--------|-------|--------------|-------------|
| DRAFT | 'draft' | Draft | Initial creation, editable |
| PENDING | 'pending' | Pending Approval | Awaiting authorization |
| APPROVED | 'approved' | Approved | Ready for payment |
| PARTIAL_PAID | 'partial_paid' | Partially Paid | Partial payment made |
| PAID | 'paid' | Paid | Fully paid |
| CANCELLED | 'cancelled' | Cancelled | Bill cancelled |
| DISPUTED | 'disputed' | Disputed | Under dispute |

### Bill Status Lifecycle

```
┌──────────┐
│  DRAFT   │  Initial creation
└────┬─────┘
     │
     ▼
┌──────────┐
│ PENDING  │  Submitted for approval
└────┬─────┘
     │
     ▼
┌──────────┐     ┌──────────┐
│ APPROVED │────▶│ DISPUTED │  Dispute raised
└────┬─────┘     └────┬─────┘
     │                │
     │                ▼
     │           ┌──────────┐
     │           │CANCELLED │  Dispute not resolved
     │           └──────────┘
     ▼
┌──────────┐
│PARTIAL   │  First payment made
│PAID      │
└────┬─────┘
     │
     ▼
┌──────────┐
│  PAID    │  Final payment
└──────────┘
```

### Status Transition Rules

#### From DRAFT
- Can move to: PENDING, CANCELLED
- Actions: Submit for approval, cancel
- Permissions: Creator or manager

#### From PENDING
- Can move to: APPROVED, CANCELLED
- Actions: Approve, reject/cancel
- Permissions: Approver role required

#### From APPROVED
- Can move to: PARTIAL_PAID, DISPUTED, CANCELLED
- Actions: Record payment, raise dispute, cancel
- Permissions: Payment processor, manager

#### From PARTIAL_PAID
- Can move to: PAID, DISPUTED
- Actions: Record remaining payment, raise dispute
- Permissions: Payment processor

#### From DISPUTED
- Can move to: APPROVED, CANCELLED
- Actions: Resolve dispute, cancel
- Permissions: Manager or dispute resolver

#### From PAID
- Terminal state
- No further transitions
- Bill complete

#### From CANCELLED
- Terminal state
- No further transitions
- Bill closed

### Status-Based Behavior

| Status | Editable? | Can Pay? | Can Dispute? |
|--------|-----------|----------|--------------|
| DRAFT | Yes | No | No |
| PENDING | Limited | No | No |
| APPROVED | No | Yes | Yes |
| PARTIAL_PAID | No | Yes | Yes |
| PAID | No | No | No |
| CANCELLED | No | No | No |
| DISPUTED | Limited | No | N/A |

### Expected Outcome
- Clear bill status categorization
- Defined status transition rules
- Foundation for workflow automation
- Consistent status handling

### Verification Checklist
- [ ] All seven status constants defined
- [ ] BILL_STATUS_CHOICES tuple created
- [ ] Display names are user-friendly
- [ ] Status values follow naming convention
- [ ] Module docstring explains statuses
- [ ] Status flow documented in comments

---

## Task 04: Create VendorBill Model Core

### Overview
Create the core VendorBill model with essential fields including bill number, status, and timestamps. This model serves as the central entity for tracking vendor invoices and managing payment obligations.

### Dependencies
- Task 01: Create vendor_bills Django App
- Task 03: Define BillStatus Choices
- Base model mixins available
- Vendor model exists in vendors app

### Instructions

1. **Create vendor_bill.py model file**
   - Navigate to `apps/vendor_bills/models/`
   - Create file named `vendor_bill.py`
   - Will contain VendorBill model definition

2. **Import required dependencies**
   - Import Django model components
   - Import base model mixins (TimestampedModel, etc.)
   - Import bill status choices from constants
   - Import related models (User)

3. **Define VendorBill model class**
   - Inherit from appropriate base models
   - Use TimestampedModel for created_at/updated_at
   - Include tenant-aware functionality

4. **Add bill_number field**
   - CharField with max_length=50
   - Unique constraint for tenant
   - Will be auto-generated (Task 14)
   - Format: BILL-YYYY-NNNNN

5. **Add status field**
   - CharField with choices=BILL_STATUS_CHOICES
   - Default value: BILL_STATUS_DRAFT
   - Index this field for filtering
   - Required field

6. **Add created_at field**
   - DateTimeField with auto_now_add=True
   - Tracks bill creation timestamp
   - Usually from TimestampedModel mixin
   - Non-editable after creation

7. **Add updated_at field**
   - DateTimeField with auto_now=True
   - Tracks last modification
   - Usually from TimestampedModel mixin
   - Updates automatically

8. **Define model Meta class**
   - Set verbose_name to "Vendor Bill"
   - Set verbose_name_plural to "Vendor Bills"
   - Add ordering by created_at descending
   - Define indexes for performance

9. **Add __str__ method**
   - Return bill_number and vendor name
   - Format: "BILL-2026-00001 - Vendor Name"
   - Useful for admin and debugging

10. **Add model docstring**
    - Explain model purpose
    - Document key fields
    - Note relationships
    - Describe status workflow

### VendorBill Core Fields

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| bill_number | CharField | max_length=50, unique | Unique bill identifier |
| status | CharField | choices, default=DRAFT | Bill lifecycle status |
| created_at | DateTimeField | auto_now_add | Creation timestamp |
| updated_at | DateTimeField | auto_now | Last update timestamp |

### Model Inheritance Structure

```
django.db.models.Model
         │
         ▼
   TimestampedModel  (provides created_at, updated_at)
         │
         ▼
    VendorBill
         │
         ├── Core Fields (bill_number, status)
         ├── Vendor Fields (Task 05)
         ├── Date Fields (Task 07)
         ├── Financial Fields (Task 08)
         └── ... other field groups
```

### Bill Number Format

```
BILL-{YEAR}-{SEQUENCE}

Examples:
- BILL-2026-00001
- BILL-2026-00002
- BILL-2027-00001  (sequence resets annually)

Components:
- Prefix: "BILL" (configurable)
- Year: 4-digit current year
- Sequence: 5-digit zero-padded number
```

### Model Meta Configuration

| Meta Property | Value | Purpose |
|---------------|-------|---------|
| verbose_name | "Vendor Bill" | Singular name |
| verbose_name_plural | "Vendor Bills" | Plural name |
| ordering | ['-created_at'] | Latest first |
| indexes | bill_number, status | Query performance |

### Expected Outcome
- Core VendorBill model created
- Essential tracking fields defined
- Foundation for additional fields
- Ready for vendor relationship

### Verification Checklist
- [ ] vendor_bill.py file created
- [ ] VendorBill model class defined
- [ ] bill_number field added
- [ ] status field with choices added
- [ ] Timestamp fields included
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model docstring added

---

## Task 05: Add Bill Vendor Fields

### Overview
Add vendor relationship fields to the VendorBill model, including the foreign key to the Vendor model and the vendor's invoice number. These fields establish the connection between bills and vendors and allow cross-referencing with vendor-provided invoice numbers.

### Dependencies
- Task 04: Create VendorBill Model Core
- Vendor model exists in vendors app
- ForeignKey relationships understood

### Instructions

1. **Import Vendor model**
   - Add import statement for Vendor
   - From apps.vendors.models import Vendor
   - Ensures proper model reference

2. **Add vendor field**
   - ForeignKey to Vendor model
   - on_delete=PROTECT to prevent vendor deletion
   - related_name='bills' for reverse lookup
   - Required field (not nullable)

3. **Add vendor_invoice_number field**
   - CharField with max_length=100
   - Stores vendor's own invoice reference
   - Allow blank for manual bills
   - Index for quick lookup

4. **Update model constraints**
   - Add unique_together for (vendor, vendor_invoice_number)
   - Prevents duplicate vendor invoice entries
   - Only for non-blank invoice numbers
   - Tenant-scoped uniqueness

5. **Update __str__ method**
   - Include vendor name in string representation
   - Format: "BILL-2026-00001 - Acme Corp"
   - Helpful for admin interface

6. **Add vendor-related properties**
   - Property for vendor_name (if needed)
   - Property for vendor_email (if needed)
   - Convenience accessors to vendor data

### Vendor Relationship Fields

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| vendor | ForeignKey | to=Vendor, PROTECT, required | Link to vendor |
| vendor_invoice_number | CharField | max_length=100, blank=True | Vendor's invoice ref |

### ForeignKey Configuration

```
Field: vendor
├── Model: Vendor
├── on_delete: PROTECT
│   └── Prevents vendor deletion if bills exist
├── related_name: 'bills'
│   └── Access via: vendor.bills.all()
├── db_index: True (automatic)
└── null: False (required)
```

### Vendor Invoice Number Usage

#### Purpose
- Cross-reference with vendor's records
- Reconciliation with vendor statements
- Dispute resolution
- Audit trail

#### Examples
```
Vendor Invoice Number Formats:
- INV-2026-1234 (vendor's system)
- 20260124-001 (date-based)
- A/2026/0045 (custom format)
- May be blank for manually created bills
```

### Reverse Relationship Access

#### From Vendor to Bills
```
# Get all bills for a vendor
vendor_bills = vendor.bills.all()

# Filter by status
pending_bills = vendor.bills.filter(status='pending')

# Aggregate total due
from django.db.models import Sum
total_due = vendor.bills.filter(
    status__in=['approved', 'partial_paid']
).aggregate(Sum('amount_due'))
```

### Data Integrity Rules

| Rule | Implementation |
|------|----------------|
| Vendor required | null=False on ForeignKey |
| No orphan bills | on_delete=PROTECT |
| Unique vendor invoices | unique_together constraint |
| Valid vendor reference | Foreign key constraint |

### Expected Outcome
- Vendor relationship established
- Vendor invoice tracking enabled
- Reverse relationship accessible
- Data integrity enforced

### Verification Checklist
- [ ] Vendor model imported
- [ ] vendor ForeignKey field added
- [ ] vendor_invoice_number field added
- [ ] on_delete=PROTECT configured
- [ ] related_name='bills' set
- [ ] unique_together constraint added
- [ ] __str__ method updated
- [ ] Vendor data accessible

---

## Task 06: Add Bill PO Reference

### Overview
Add an optional purchase order reference to the VendorBill model. This allows bills to be linked to purchase orders for three-way matching (PO, GRN, Bill) and automated bill validation against expected quantities and prices.

### Dependencies
- Task 05: Add Bill Vendor Fields
- PurchaseOrder model exists in purchasing app
- Three-way matching concept understood

### Instructions

1. **Import PurchaseOrder model**
   - Add import for PurchaseOrder
   - From apps.purchasing.models import PurchaseOrder
   - Required for ForeignKey reference

2. **Add purchase_order field**
   - ForeignKey to PurchaseOrder model
   - on_delete=SET_NULL (bill survives PO deletion)
   - null=True, blank=True (optional field)
   - related_name='bills'

3. **Add PO-related validation notes**
   - Comment explaining three-way matching
   - Note about manual bills without PO
   - Explain validation workflow

4. **Update model docstring**
   - Document PO relationship
   - Explain when PO is required vs optional
   - Note matching scenarios

5. **Add convenience properties**
   - Property: has_purchase_order
   - Property: po_number (if PO exists)
   - Quick access to PO data

### Purchase Order Relationship

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| purchase_order | ForeignKey | to=PurchaseOrder, SET_NULL, optional | Link to PO for matching |

### Three-Way Matching Concept

```
Three-Way Match Validation:
┌─────────────────┐
│ Purchase Order  │  What was ordered
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Goods Received  │  What was received
│     Note        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vendor Bill    │  What vendor invoiced
└─────────────────┘

Validation checks:
✓ Items match between PO, GRN, Bill
✓ Quantities are consistent
✓ Prices match PO terms
✓ Totals calculated correctly
```

### Bill Types Based on PO

#### Bills with Purchase Order
- **PO-Based Bills**: Most common
- **Characteristics:**
  - Linked to approved PO
  - Can be auto-matched with GRN
  - Prices validated against PO
  - Line items reference PO items
  
#### Bills without Purchase Order
- **Manual Bills**: Direct bills
- **Characteristics:**
  - No PO reference (null)
  - Manual line item entry
  - No automated matching
  - Require manual approval
  - Examples: utility bills, subscriptions, one-time purchases

### PO Reference Benefits

| Benefit | Description |
|---------|-------------|
| Automated matching | System matches bill to PO and GRN |
| Price validation | Verify bill prices match PO |
| Quantity checks | Ensure quantities align |
| Approval workflow | Auto-approve if match is perfect |
| Discrepancy detection | Flag variances for review |

### Reverse Relationship Access

```
# From PurchaseOrder to Bills
po_bills = purchase_order.bills.all()

# Check if PO has pending bills
has_pending_bills = purchase_order.bills.filter(
    status__in=['pending', 'approved']
).exists()

# Calculate total billed for PO
total_billed = purchase_order.bills.aggregate(
    Sum('total')
)['total__sum'] or 0
```

### When PO is Required vs Optional

#### Required PO Scenarios
- Inventory purchases (materials, products)
- Approved capital expenditures
- Pre-negotiated contracts
- Large value purchases

#### Optional PO Scenarios
- Utility bills (electricity, water)
- Subscription services
- Small value purchases (under threshold)
- Emergency purchases (retrospective PO)
- Recurring vendor services

### Expected Outcome
- Optional PO relationship added
- Foundation for three-way matching
- Supports both PO-based and manual bills
- Flexible billing workflow

### Verification Checklist
- [ ] PurchaseOrder model imported
- [ ] purchase_order ForeignKey added
- [ ] null=True, blank=True configured
- [ ] on_delete=SET_NULL set
- [ ] related_name='bills' defined
- [ ] Model docstring updated
- [ ] Convenience properties added
- [ ] Comments explain matching logic

---

## Summary

This document established the foundation of the vendor bills system by creating the Django app structure, registering it in tenant settings, defining comprehensive bill status choices, and building the core VendorBill model with vendor and purchase order relationships.

### Completed Tasks
✅ Task 01: Created vendor_bills Django app with organized structure  
✅ Task 02: Registered app in TENANT_APPS for multi-tenant operation  
✅ Task 03: Defined seven bill status choices with clear lifecycle  
✅ Task 04: Created VendorBill model core with bill_number and status  
✅ Task 05: Added vendor relationship and invoice number fields  
✅ Task 06: Added optional purchase order reference for three-way matching

### Key Deliverables
- Functional vendor_bills Django application
- Multi-tenant bill tracking capability
- Comprehensive status workflow
- Vendor and PO relationship structure
- Foundation for bill matching and payment processing

### Next Steps
Continue to [02_Tasks-07-12_Date-Financial-User-Notes-Document.md](02_Tasks-07-12_Date-Financial-User-Notes-Document.md) to add date fields, financial tracking, user assignments, notes, and document attachment capabilities.
