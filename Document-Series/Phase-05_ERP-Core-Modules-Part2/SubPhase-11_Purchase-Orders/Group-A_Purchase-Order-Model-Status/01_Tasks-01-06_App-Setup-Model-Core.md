# Tasks 01-06: App Setup, Model Core, and Basic Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** A - Purchase Order Model & Status  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Shipping-Financial-User-Notes.md](02_Tasks-07-12_Shipping-Financial-User-Notes.md)

---

## Document Overview

This document covers the foundational setup of the purchases module, including creating the Django app, registering it for multi-tenancy, defining purchase order status choices, and establishing the core PurchaseOrder model with vendor and date fields. These elements form the base infrastructure for the entire purchase order management system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create purchases Django App | Low | 15 min |
| 02 | Register purchases App | Low | 10 min |
| 03 | Define POStatus Choices | Low | 15 min |
| 04 | Create PurchaseOrder Model Core | Medium | 25 min |
| 05 | Add PO Vendor Fields | Medium | 20 min |
| 06 | Add PO Date Fields | Medium | 20 min |

---

## Task 01: Create Purchases Django App

### Overview
Create the `purchases` Django application to house all purchase order-related functionality. This app will manage the entire procurement lifecycle, from order creation through receiving and payment tracking.

### Dependencies
- Django project structure is established
- Multi-tenancy framework is configured

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Navigate to `apps/` directory
   - This is where all Django apps reside

2. **Create purchases app**
   - Use Django's startapp command to create purchases app
   - This generates the base app structure

3. **Create models package**
   - Delete the default `models.py` file
   - Create `models/` directory in purchases app
   - Create `__init__.py` inside models directory
   - This allows organized model separation

4. **Create services directory**
   - Create `services/` directory in purchases app
   - Create `__init__.py` inside services directory
   - Will contain business logic services

5. **Create serializers directory**
   - Create `serializers/` directory in purchases app
   - Create `__init__.py` inside serializers directory
   - Will contain DRF serializers

6. **Create views directory**
   - Create `views/` directory in purchases app
   - Create `__init__.py` inside views directory
   - Will contain ViewSets and API views

7. **Update apps.py**
   - Open `apps.py` file
   - Update app name to reflect proper module path
   - Add verbose_name for display purposes

### Directory Structure
```
apps/purchases/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration (Task 01)
├── models/
│   └── __init__.py               # Models package
├── services/
│   └── __init__.py               # Services package
├── serializers/
│   └── __init__.py               # Serializers package
├── views/
│   └── __init__.py               # Views package
├── admin.py                      # Admin configurations
├── constants.py                  # Will contain status choices
└── urls.py                       # URL routing
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `apps.py` | App configuration and metadata |
| `models/` | PurchaseOrder, POLineItem, GRN models |
| `services/` | Business logic and workflows |
| `serializers/` | API serialization |
| `views/` | API endpoints |
| `constants.py` | Status choices and constants |

### Expected Outcome
- Clean Django app structure
- Organized package layout for scalability
- Foundation for purchase order system

### Verification Checklist
- [ ] `apps/purchases/` directory exists
- [ ] `apps.py` properly configured
- [ ] `models/` directory with `__init__.py`
- [ ] `services/` directory with `__init__.py`
- [ ] `serializers/` directory with `__init__.py`
- [ ] `views/` directory with `__init__.py`
- [ ] `constants.py` file created
- [ ] `urls.py` file created

---

## Task 02: Register Purchases App

### Overview
Register the purchases app in the TENANT_APPS configuration to enable multi-tenancy support. This ensures purchase orders are isolated per tenant and each tenant has their own purchase order data and sequence.

### Dependencies
- Task 01: Create purchases Django App
- Multi-tenancy configuration in settings

### Instructions

1. **Locate settings file**
   - Navigate to `config/` or `settings/` directory
   - Find tenant configuration file (usually `settings/base.py` or `settings/tenants.py`)
   - Look for TENANT_APPS or TENANT_SPECIFIC_APPS list

2. **Add purchases to TENANT_APPS**
   - Add 'apps.purchases' to the TENANT_APPS list
   - Place it after core apps (users, inventory, vendors)
   - Maintain logical ordering of apps

3. **Verify SHARED_APPS**
   - Ensure SHARED_APPS doesn't include purchases
   - Purchases must be tenant-specific, not shared
   - Shared apps would apply globally across all tenants

4. **Update installed apps reference**
   - If using combined INSTALLED_APPS, ensure it includes both SHARED_APPS and TENANT_APPS
   - Verify proper concatenation of app lists

### Multi-Tenancy Context

| Setting | Purpose |
|---------|---------|
| SHARED_APPS | Global apps (authentication, tenants) |
| TENANT_APPS | Tenant-isolated apps (purchases, sales) |
| INSTALLED_APPS | Combined list for Django |

### TENANT_APPS Order Example
```
TENANT_APPS = [
    'apps.core',
    'apps.users',
    'apps.inventory',
    'apps.vendors',
    'apps.purchases',    # Add here (Task 02)
    'apps.sales',
    'apps.pos',
]
```

### Expected Outcome
- Purchases app registered in tenant schema
- Each tenant has isolated purchase order data
- PO number sequences are tenant-specific

### Verification Checklist
- [ ] Purchases added to TENANT_APPS
- [ ] Not present in SHARED_APPS
- [ ] Proper app ordering maintained
- [ ] No import errors when starting server

---

## Task 03: Define POStatus Choices

### Overview
Define comprehensive status choices for purchase orders that track the complete lifecycle from draft creation through completion. These statuses enable workflow management, reporting, and status-based business rules.

### Dependencies
- Task 01: Create purchases Django App

### Instructions

1. **Create constants.py file**
   - Navigate to `apps/purchases/` directory
   - Create `constants.py` file
   - Add module docstring explaining purpose

2. **Add module documentation**
   - Document the purchase order lifecycle
   - Explain each status and its meaning
   - Note valid status transitions

3. **Define DRAFT status**
   - Value: 'draft'
   - Purpose: Initial editable state
   - Actions allowed: Edit all fields, add/remove lines, delete PO

4. **Define SENT status**
   - Value: 'sent'
   - Purpose: Sent to vendor
   - Actions allowed: Acknowledge, cancel

5. **Define ACKNOWLEDGED status**
   - Value: 'acknowledged'
   - Purpose: Vendor confirmed receipt
   - Actions allowed: Receive items, cancel

6. **Define PARTIAL_RECEIVED status**
   - Value: 'partial_received'
   - Purpose: Some items received, others pending
   - Actions allowed: Receive remaining items, close

7. **Define RECEIVED status**
   - Value: 'received'
   - Purpose: All items received
   - Actions allowed: Close

8. **Define CANCELLED status**
   - Value: 'cancelled'
   - Purpose: Order cancelled before completion
   - Actions allowed: None (terminal state)

9. **Define CLOSED status**
   - Value: 'closed'
   - Purpose: Order completed and archived
   - Actions allowed: None (terminal state)

10. **Create POStatus choices tuple**
    - Create tuple of (value, display_name) pairs
    - Follow Django choices pattern
    - Include all defined statuses

### Status Details

| Status | Value | Display | Terminal | Editable |
|--------|-------|---------|----------|----------|
| Draft | draft | Draft | No | Yes |
| Sent | sent | Sent to Vendor | No | No |
| Acknowledged | acknowledged | Acknowledged | No | No |
| Partial Received | partial_received | Partially Received | No | No |
| Received | received | Received | No | No |
| Cancelled | cancelled | Cancelled | Yes | No |
| Closed | closed | Closed | Yes | No |

### Status Flow Diagram
```
DRAFT
  ├─→ SENT
  │     ├─→ ACKNOWLEDGED
  │     │     ├─→ PARTIAL_RECEIVED ─→ RECEIVED ─→ CLOSED
  │     │     └─→ RECEIVED ─→ CLOSED
  │     └─→ CANCELLED
  └─→ CANCELLED
```

### Status Transition Rules

| From Status | To Status | Condition |
|-------------|-----------|-----------|
| DRAFT | SENT | All required fields filled |
| DRAFT | CANCELLED | Any time |
| SENT | ACKNOWLEDGED | Vendor confirmation received |
| SENT | CANCELLED | Before acknowledgment |
| ACKNOWLEDGED | PARTIAL_RECEIVED | Some items received |
| ACKNOWLEDGED | RECEIVED | All items received at once |
| ACKNOWLEDGED | CANCELLED | Before any receiving |
| PARTIAL_RECEIVED | RECEIVED | All items now received |
| PARTIAL_RECEIVED | CLOSED | Accept partial as complete |
| RECEIVED | CLOSED | Final closure |

### Expected Outcome
- Clear status choices for PO lifecycle
- Defined workflow progression
- Foundation for status-based permissions

### Verification Checklist
- [ ] `constants.py` file created
- [ ] All 7 statuses defined
- [ ] POStatus choices tuple created
- [ ] Module documentation added
- [ ] Status flow documented

---

## Task 04: Create PurchaseOrder Model Core

### Overview
Create the core PurchaseOrder model with essential fields including primary key, status, and timestamp tracking. This model serves as the central entity for all purchase order operations.

### Dependencies
- Task 01: Create purchases Django App
- Task 03: Define POStatus Choices
- Vendor model exists (from vendors app)
- TenantMixin available (from multi-tenancy)

### Instructions

1. **Create purchase_order.py file**
   - Navigate to `apps/purchases/models/` directory
   - Create `purchase_order.py` file
   - Add imports for Django models and mixins

2. **Import required dependencies**
   - Import models from django.db
   - Import TenantMixin for multi-tenancy
   - Import POStatus from constants
   - Import User model
   - Import timezone utilities

3. **Define PurchaseOrder model class**
   - Inherit from TenantMixin and models.Model
   - Add class-level docstring explaining model purpose
   - Set Meta class with appropriate options

4. **Add primary key field**
   - Use UUIDField with UUID4 default
   - Set as primary_key=True
   - Set editable=False
   - Ensures globally unique identifiers

5. **Add po_number field**
   - CharField with max_length=50
   - Set unique=True for uniqueness per tenant
   - Set blank=True (auto-generated)
   - Add db_index=True for fast lookups

6. **Add status field**
   - CharField with max_length=20
   - Use POStatus choices
   - Set default='draft'
   - Add db_index=True for filtering

7. **Add timestamp fields**
   - created_at: DateTimeField with auto_now_add=True
   - updated_at: DateTimeField with auto_now=True
   - Track record creation and modifications

8. **Add tenant field**
   - Inherited from TenantMixin
   - ForeignKey to Tenant model
   - Ensures data isolation

9. **Configure Meta class**
   - Set verbose_name='Purchase Order'
   - Set verbose_name_plural='Purchase Orders'
   - Set ordering=['-created_at']
   - Add indexes for common queries

10. **Add __str__ method**
    - Return po_number or "New PO" if not yet generated
    - Provide human-readable representation

### Model Structure

| Field | Type | Purpose |
|-------|------|---------|
| id | UUIDField | Primary key |
| po_number | CharField | Unique PO identifier |
| status | CharField | Current lifecycle status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Last modification timestamp |

### Meta Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| verbose_name | Purchase Order | Singular display |
| verbose_name_plural | Purchase Orders | Plural display |
| ordering | ['-created_at'] | Newest first |
| db_table | (default) | Auto-generated table name |

### Expected Outcome
- PurchaseOrder model with core fields
- UUID primary keys for uniqueness
- Status tracking capability
- Timestamp audit trail

### Verification Checklist
- [ ] `purchase_order.py` file created
- [ ] Model inherits TenantMixin
- [ ] UUID primary key configured
- [ ] po_number field with unique constraint
- [ ] status field with choices
- [ ] Timestamp fields added
- [ ] Meta class configured
- [ ] __str__ method implemented

---

## Task 05: Add PO Vendor Fields

### Overview
Add vendor-related fields to the PurchaseOrder model, including the vendor foreign key and vendor's reference number. These fields establish the relationship between purchase orders and suppliers.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- Vendor model exists in vendors app

### Instructions

1. **Import Vendor model**
   - Add import for Vendor model from vendors app
   - Ensure proper app reference path

2. **Add vendor foreign key field**
   - Add vendor field as ForeignKey to Vendor
   - Set on_delete=models.PROTECT (prevent vendor deletion with active POs)
   - Set related_name='purchase_orders'
   - Add db_index=True for fast joins
   - Make required (no blank, no null)

3. **Add vendor_reference field**
   - Add vendor_reference as CharField
   - Set max_length=100
   - Set blank=True, null=True (optional)
   - Purpose: Store vendor's own order number

4. **Update model docstring**
   - Document vendor relationship
   - Explain vendor_reference purpose
   - Note PROTECT behavior on deletion

5. **Add vendor validation**
   - Ensure vendor is active (can add in clean method later)
   - Verify vendor has contact information

### Vendor Field Details

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| vendor | ForeignKey | Supplier for this PO | Required, PROTECT on delete |
| vendor_reference | CharField | Vendor's order number | Optional, max 100 chars |

### Foreign Key Relationship

```
Vendor (1) ────< (Many) PurchaseOrder

One vendor can have multiple purchase orders
Each purchase order belongs to exactly one vendor
```

### On Delete Behavior

| Action | Behavior |
|--------|----------|
| PROTECT | Prevents vendor deletion if POs exist |
| Related Name | Access POs via vendor.purchase_orders.all() |

### Vendor Reference Usage

| Scenario | Example |
|----------|---------|
| Vendor provides their order number | "VEN-ORDER-12345" |
| Vendor acknowledgment | "ABC-PO-2026-001" |
| Cross-reference | Link to vendor's system |

### Expected Outcome
- Vendor relationship established
- Vendor reference tracking available
- Protected vendor deletion
- Bidirectional relationship access

### Verification Checklist
- [ ] Vendor ForeignKey added
- [ ] on_delete=PROTECT configured
- [ ] related_name='purchase_orders' set
- [ ] vendor_reference field added
- [ ] Fields documented in docstring

---

## Task 06: Add PO Date Fields

### Overview
Add date-related fields to track the purchase order timeline, including order date, expected delivery, acknowledgment date, and receipt date. These fields enable delivery tracking, reporting, and SLA monitoring.

### Dependencies
- Task 04: Create PurchaseOrder Model Core

### Instructions

1. **Add order_date field**
   - Add order_date as DateField
   - Set default=date.today
   - Make required (no blank, no null)
   - Purpose: When PO was created/sent

2. **Add expected_delivery_date field**
   - Add expected_delivery_date as DateField
   - Set blank=True, null=True (optional)
   - Add db_index=True for delivery tracking
   - Purpose: Vendor's promised delivery date

3. **Add acknowledged_at field**
   - Add acknowledged_at as DateTimeField
   - Set blank=True, null=True
   - Purpose: When vendor confirmed the order

4. **Add received_at field**
   - Add received_at as DateTimeField
   - Set blank=True, null=True
   - Purpose: When all items were received

5. **Update Meta class indexes**
   - Add index on order_date
   - Add index on expected_delivery_date
   - Enable efficient date range queries

6. **Add date validation**
   - Expected delivery should be >= order_date
   - Acknowledged_at should be >= order_date
   - Received_at should be >= acknowledged_at

### Date Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| order_date | DateField | Yes | Order creation date |
| expected_delivery_date | DateField | No | Promised delivery date |
| acknowledged_at | DateTimeField | No | Vendor confirmation timestamp |
| received_at | DateTimeField | No | Full receipt timestamp |

### Date Timeline Example
```
Order Date: 2026-01-15
     ↓
Expected Delivery: 2026-01-25 (10 days lead time)
     ↓
Acknowledged At: 2026-01-16 10:30 (vendor confirmed)
     ↓
Received At: 2026-01-24 14:15 (received early)
```

### Date-Based Queries

| Query Type | Use Case |
|------------|----------|
| Order date range | Monthly/quarterly reports |
| Expected delivery today | Delivery schedule |
| Overdue orders | expected_delivery_date < today and not received |
| Average lead time | received_at - order_date |

### SLA Monitoring

| Metric | Calculation |
|--------|-------------|
| On-time delivery | received_at <= expected_delivery_date |
| Lead time | received_at - order_date |
| Acknowledgment time | acknowledged_at - order_date |

### Expected Outcome
- Complete date tracking for PO lifecycle
- Delivery schedule management
- SLA and performance reporting capability

### Verification Checklist
- [ ] order_date field added with default
- [ ] expected_delivery_date field added
- [ ] acknowledged_at field added
- [ ] received_at field added
- [ ] Indexes added for date fields
- [ ] Date validation logic planned

---

## Summary

This document established the foundation of the purchase order system:

| Accomplishment | Impact |
|----------------|--------|
| Purchases app created | Dedicated module for procurement |
| Multi-tenancy registered | Isolated PO data per tenant |
| Status choices defined | Clear lifecycle workflow |
| Core model created | Base PO entity with tracking |
| Vendor relationship | Link to suppliers |
| Date tracking | Timeline and SLA monitoring |

### Next Steps
- **Document 02**: Add shipping, financial, user, and notes fields
- Complete the PurchaseOrder model with all business attributes
- Enable full purchase order management capability

---

## Validation Points

Before proceeding to the next document:
- [ ] All 6 tasks completed
- [ ] Purchases app properly structured
- [ ] TENANT_APPS registration verified
- [ ] POStatus choices comprehensive
- [ ] PurchaseOrder model created with core fields
- [ ] Vendor relationship established
- [ ] Date fields for timeline tracking added
