# Tasks 01-06: App Setup & Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** A - Order Model & Status System  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Address-Dates-Financial-Metadata.md](02_Tasks-07-12_Address-Dates-Financial-Metadata.md)
- **→ Next Group:** [../Group-B_Order-Line-Items-Pricing/](../Group-B_Order-Line-Items-Pricing/)

---

## Document Overview

This document covers the foundational setup for the Order Management module. It includes creating the Django app, registering it for multi-tenancy, defining status and source choices, and implementing the core Order model fields including customer relationship.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create orders Django App | Low | 15 min |
| 02 | Register orders App | Low | 10 min |
| 03 | Define OrderStatus Choices | Low | 15 min |
| 04 | Define OrderSource Choices | Low | 10 min |
| 05 | Create Order Model Core Fields | Medium | 25 min |
| 06 | Add Order Customer Fields | Medium | 20 min |

---

## Task 01: Create orders Django App

### Overview
Create a new Django app named `orders` within the backend services directory. This app will house all order management functionality including models, views, services, and API endpoints.

### Dependencies
- Backend Django project initialized
- Apps directory structure exists

### Instructions

1. **Navigate to apps directory**
   - Open terminal in backend services root
   - Navigate to `apps/` directory where tenant apps reside

2. **Create the orders app**
   - Use Django's `startapp` command to create the app
   - Name the app `orders`
   - Ensure it's created in the correct location

3. **Set up app configuration**
   - Open `apps.py` in the orders directory
   - Update the `name` attribute to include full path: `apps.orders`
   - Set `verbose_name` to `"Orders"`
   - Add `default_auto_field` configuration for BigAutoField

4. **Create models subdirectory**
   - Create a `models/` directory inside orders app
   - Create `__init__.py` in models directory
   - Delete the default `models.py` file
   - This allows for better organization of multiple models

5. **Create services subdirectory**
   - Create a `services/` directory for business logic
   - Create `__init__.py` in services directory
   - This separates business logic from models

6. **Create constants file**
   - Create `constants.py` in the orders app root
   - This will store enums and constants

7. **Create managers subdirectory**
   - Create a `managers/` directory for custom model managers
   - Create `__init__.py` in managers directory

8. **Create utils subdirectory**
   - Create a `utils/` directory for utility functions
   - Create `__init__.py` in utils directory

9. **Verify app structure**
   - Ensure all directories have `__init__.py` files
   - Check that the app follows Django conventions

### Expected Directory Structure
```
apps/orders/
├── __init__.py
├── apps.py                    # App configuration
├── admin.py                   # (default, will be customized later)
├── constants.py               # Status and source enums
├── models/
│   └── __init__.py
├── managers/
│   └── __init__.py
├── services/
│   └── __init__.py
├── utils/
│   └── __init__.py
├── views/
│   └── __init__.py
├── serializers/
│   └── __init__.py
└── migrations/
    └── __init__.py
```

### Verification Checklist
- [ ] Orders app directory created in `apps/` folder
- [ ] `apps.py` properly configured with full path
- [ ] `models/` subdirectory created with `__init__.py`
- [ ] `services/` subdirectory created with `__init__.py`
- [ ] `managers/` subdirectory created with `__init__.py`
- [ ] `utils/` subdirectory created with `__init__.py`
- [ ] `constants.py` file created
- [ ] App structure follows Django conventions

---

## Task 02: Register orders App

### Overview
Register the orders app in Django settings as a TENANT_APP to ensure it operates correctly in the multi-tenant architecture. This makes the app available per-tenant with isolated data.

### Dependencies
- Task 01: Create orders Django App
- Multi-tenancy configuration completed (Phase 02)

### Instructions

1. **Locate settings configuration**
   - Open the Django settings file (typically `settings/base.py` or `settings.py`)
   - Find the `TENANT_APPS` configuration section
   - This section defines which apps are tenant-specific

2. **Add orders to TENANT_APPS**
   - Add `'apps.orders'` to the `TENANT_APPS` list
   - Place it in a logical location (after customers, before invoicing)
   - Maintain alphabetical or logical grouping

3. **Verify app order**
   - Ensure orders app comes after dependent apps:
     - `apps.customers` (for customer relationship)
     - `apps.products` (for product relationships)
     - `apps.inventory` (for stock management)
   - This ensures proper model dependency resolution

4. **Check for conflicts**
   - Verify no duplicate entries exist
   - Ensure app name matches exactly with apps.py configuration
   - Check for any typos in the app path

5. **Update documentation**
   - Add comment in settings explaining orders app purpose
   - Note any special configuration requirements

### Multi-Tenancy Context

| Aspect | Explanation |
|--------|-------------|
| **TENANT_APPS** | Apps that are duplicated per tenant with isolated schemas |
| **SHARED_APPS** | Apps shared across all tenants in public schema |
| **Schema Isolation** | Each tenant has separate order data |
| **Migration Handling** | Migrations run per tenant schema |

### Expected Configuration
```python
TENANT_APPS = [
    # Core tenant apps
    'django.contrib.contenttypes',
    'django.contrib.auth',
    
    # Business apps
    'apps.customers',
    'apps.products',
    'apps.inventory',
    'apps.orders',          # <-- Added here
    'apps.invoicing',
    # ... other tenant apps
]
```

### Verification Checklist
- [ ] Orders app added to `TENANT_APPS` list
- [ ] App name matches configuration in apps.py
- [ ] App order respects dependencies
- [ ] No duplicate entries exist
- [ ] Settings file syntax is valid

---

## Task 03: Define OrderStatus Choices

### Overview
Define a comprehensive set of order status choices that represent the complete lifecycle of an order from creation to completion or cancellation. These statuses enable order tracking and workflow management.

### Dependencies
- Task 01: Create orders Django App

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/orders/constants.py`
   - This file will contain all order-related enums and constants

2. **Import Django TextChoices**
   - Import `models.TextChoices` from Django
   - This provides enum-like behavior with database support

3. **Create OrderStatus class**
   - Define a class named `OrderStatus` inheriting from `models.TextChoices`
   - Use uppercase naming convention for enum class

4. **Define PENDING status**
   - Value: `'pending'`
   - Label: `'Pending'`
   - Purpose: Initial status when order is created
   - Description: Order awaiting confirmation

5. **Define CONFIRMED status**
   - Value: `'confirmed'`
   - Label: `'Confirmed'`
   - Purpose: Order confirmed and accepted
   - Description: Stock reserved, ready for processing

6. **Define PROCESSING status**
   - Value: `'processing'`
   - Label: `'Processing'`
   - Purpose: Order being fulfilled
   - Description: Items being picked and packed

7. **Define SHIPPED status**
   - Value: `'shipped'`
   - Label: `'Shipped'`
   - Purpose: Order dispatched to customer
   - Description: Out for delivery with tracking

8. **Define DELIVERED status**
   - Value: `'delivered'`
   - Label: `'Delivered'`
   - Purpose: Order received by customer
   - Description: Confirmed delivery

9. **Define COMPLETED status**
   - Value: `'completed'`
   - Label: `'Completed'`
   - Purpose: Order fully fulfilled
   - Description: Transaction finalized, no further action

10. **Define CANCELLED status**
    - Value: `'cancelled'`
    - Label: `'Cancelled'`
    - Purpose: Order cancelled
    - Description: Terminated before fulfillment

11. **Define RETURNED status**
    - Value: `'returned'`
    - Label: `'Returned'`
    - Purpose: Order returned after delivery
    - Description: Customer returned items

12. **Add docstring**
    - Document each status with use cases
    - Explain status transition rules
    - Note terminal statuses (CANCELLED, RETURNED, COMPLETED)

### Order Status Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER STATUS LIFECYCLE                    │
└─────────────────────────────────────────────────────────────┘

    [NEW ORDER]
         │
         ▼
    ┌─────────┐
    │ PENDING │ ◄──────────┐
    └─────────┘            │
         │                 │
         │ confirm         │ edit
         ▼                 │
    ┌───────────┐          │
    │ CONFIRMED │──────────┘
    └───────────┘
         │
         │ start processing
         ▼
    ┌────────────┐
    │ PROCESSING │
    └────────────┘
         │
         │ dispatch
         ▼
    ┌──────────┐
    │ SHIPPED  │
    └──────────┘
         │
         │ confirm delivery
         ▼
    ┌───────────┐
    │ DELIVERED │
    └───────────┘
         │
         │ finalize
         ▼
    ┌───────────┐
    │ COMPLETED │ (terminal)
    └───────────┘

    CANCELLATION PATH:
    PENDING/CONFIRMED/PROCESSING ──cancel──> CANCELLED (terminal)

    RETURN PATH:
    DELIVERED/COMPLETED ──return──> RETURNED (terminal)
```

### Status Transition Matrix

| From Status | Allowed Transitions | Business Rules |
|-------------|---------------------|----------------|
| PENDING | CONFIRMED, CANCELLED | Can edit order details |
| CONFIRMED | PROCESSING, CANCELLED | Stock reserved |
| PROCESSING | SHIPPED, CANCELLED | Items being prepared |
| SHIPPED | DELIVERED | With tracking info |
| DELIVERED | COMPLETED, RETURNED | Customer confirmation |
| COMPLETED | RETURNED | Within return window |
| CANCELLED | - | Terminal state |
| RETURNED | - | Terminal state |

### Status Meanings

| Status | When to Use | System Actions |
|--------|-------------|----------------|
| **PENDING** | Order just created | No stock reservation |
| **CONFIRMED** | Payment verified | Reserve stock |
| **PROCESSING** | Fulfillment started | Generate pick list |
| **SHIPPED** | Package dispatched | Update tracking |
| **DELIVERED** | Customer received | Trigger feedback |
| **COMPLETED** | All done | Release resources |
| **CANCELLED** | Order terminated | Restore stock |
| **RETURNED** | Items returned | Process refund |

### Verification Checklist
- [ ] `OrderStatus` class created in constants.py
- [ ] All 8 status values defined
- [ ] Values use lowercase snake_case
- [ ] Labels use proper capitalization
- [ ] Docstring documents lifecycle
- [ ] Status transitions documented

---

## Task 04: Define OrderSource Choices

### Overview
Define order source choices that track where orders originate from. This enables source-based analytics, routing, and business logic differentiation.

### Dependencies
- Task 01: Create orders Django App
- Task 03: Define OrderStatus Choices

### Instructions

1. **Open constants.py file**
   - Same file as OrderStatus definition
   - Add OrderSource below OrderStatus class

2. **Import Django TextChoices**
   - Should already be imported from Task 03
   - Ensure import statement is present

3. **Create OrderSource class**
   - Define class named `OrderSource` inheriting from `models.TextChoices`
   - Use uppercase naming convention

4. **Define POS source**
   - Value: `'pos'`
   - Label: `'Point of Sale'`
   - Purpose: Orders created from POS terminals
   - Context: In-store purchases, immediate fulfillment

5. **Define WEBSTORE source**
   - Value: `'webstore'`
   - Label: `'Webstore'`
   - Purpose: Orders from e-commerce website
   - Context: Online purchases, shipping required

6. **Define QUOTE source**
   - Value: `'quote'`
   - Label: `'Quote Conversion'`
   - Purpose: Orders converted from quotes
   - Context: B2B sales, pre-negotiated terms

7. **Define MANUAL source**
   - Value: `'manual'`
   - Label: `'Manual Entry'`
   - Purpose: Orders manually entered by staff
   - Context: Phone orders, special cases

8. **Define IMPORT source**
   - Value: `'import'`
   - Label: `'Import'`
   - Purpose: Orders imported from external systems
   - Context: Data migration, integrations

9. **Add docstring**
   - Document each source with use cases
   - Explain source-specific behavior
   - Note integration points

### Order Source Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    ORDER SOURCE FLOWS                     │
└──────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   POS       │──────────> Quick order entry
    │  Terminal   │            Immediate payment
    └─────────────┘            In-store fulfillment
         │
         ├──> Order [source=POS]
         │
         └──> Auto-confirm on payment

    ┌─────────────┐
    │  Webstore   │──────────> Customer self-service
    │   Website   │            Online payment
    └─────────────┘            Shipping required
         │
         ├──> Order [source=WEBSTORE]
         │
         └──> Email confirmation

    ┌─────────────┐
    │   Quote     │──────────> Pre-negotiated terms
    │  Document   │            Custom pricing
    └─────────────┘            Convert to order
         │
         ├──> Order [source=QUOTE]
         │
         └──> Link to original quote

    ┌─────────────┐
    │   Manual    │──────────> Phone orders
    │    Entry    │            Special requests
    └─────────────┘            Staff-assisted
         │
         ├──> Order [source=MANUAL]
         │
         └──> Flexibility in terms

    ┌─────────────┐
    │   Import    │──────────> Data migration
    │   System    │            Bulk orders
    └─────────────┘            External systems
         │
         ├──> Order [source=IMPORT]
         │
         └──> Preserve external ref
```

### Source-Specific Behaviors

| Source | Default Status | Payment | Fulfillment | Special Features |
|--------|---------------|---------|-------------|-----------------|
| **POS** | CONFIRMED | Immediate | In-store pickup | Receipt printing |
| **WEBSTORE** | PENDING | Online gateway | Shipping | Email notifications |
| **QUOTE** | CONFIRMED | Terms-based | Custom | Quote reference |
| **MANUAL** | PENDING | Flexible | Variable | Staff notes |
| **IMPORT** | PENDING | Variable | Variable | External ID tracking |

### Source Analytics Use Cases

| Use Case | Description |
|----------|-------------|
| **Channel Performance** | Compare sales across POS vs Webstore |
| **Conversion Tracking** | Monitor quote-to-order conversion |
| **Staff Efficiency** | Analyze manual entry patterns |
| **Integration Health** | Monitor imported order quality |

### Verification Checklist
- [ ] `OrderSource` class created in constants.py
- [ ] All 5 source values defined
- [ ] Values use lowercase
- [ ] Labels are descriptive
- [ ] Docstring documents use cases
- [ ] Source behaviors documented

---

## Task 05: Create Order Model Core Fields

### Overview
Create the Order model with essential core fields including order number, status, source, and timestamp tracking. This establishes the foundation for all order functionality.

### Dependencies
- Task 01: Create orders Django App
- Task 02: Register orders App
- Task 03: Define OrderStatus Choices
- Task 04: Define OrderSource Choices
- Base tenant model mixins (from Phase 03)

### Instructions

1. **Create order.py in models directory**
   - Navigate to `apps/orders/models/`
   - Create new file named `order.py`
   - This will contain the Order model definition

2. **Import required modules**
   - Import Django models module
   - Import UUID for unique identifiers
   - Import timezone utilities
   - Import base mixins (TenantModelMixin, TimestampMixin, SoftDeleteMixin)
   - Import OrderStatus and OrderSource from constants

3. **Create Order model class**
   - Define class named `Order` inheriting from base mixins
   - Inheritance order: TenantModelMixin, TimestampMixin, SoftDeleteMixin, models.Model
   - Add Meta class for configuration

4. **Add primary key field**
   - Use UUIDField as primary key
   - Set default to uuid.uuid4
   - Make it non-editable
   - This ensures globally unique identifiers

5. **Add order_number field**
   - Use CharField with max_length=50
   - Make it unique=True
   - Make it blank=True (auto-generated)
   - Add db_index=True for query performance
   - Add help_text explaining format

6. **Add status field**
   - Use CharField with choices=OrderStatus.choices
   - Set default=OrderStatus.PENDING
   - Set max_length=20
   - Add db_index=True for filtering
   - Add help_text explaining lifecycle

7. **Add source field**
   - Use CharField with choices=OrderSource.choices
   - Set default=OrderSource.MANUAL
   - Set max_length=20
   - Add db_index=True for analytics
   - Add help_text explaining origins

8. **Add order_date field**
   - Use DateTimeField
   - Set default=timezone.now
   - Add db_index=True for date-based queries
   - Add help_text for clarity

9. **Add priority field**
   - Use IntegerField with default=5
   - Range: 1 (highest) to 10 (lowest)
   - Add help_text explaining scale
   - Used for order fulfillment prioritization

10. **Add is_draft field**
    - Use BooleanField with default=False
    - Indicates if order is still being edited
    - Draft orders don't reserve stock

11. **Configure Meta class**
    - Set verbose_name to "Order"
    - Set verbose_name_plural to "Orders"
    - Set db_table to "orders_order"
    - Define ordering: ['-created_at']
    - Will add indexes in Task 16

12. **Add __str__ method**
    - Return order_number if exists, else "Draft Order {id}"
    - Provides readable representation

13. **Add __repr__ method**
    - Return technical representation with id and status
    - Useful for debugging

14. **Update models __init__.py**
    - Import Order model
    - Add to __all__ list for clean imports

### Order Model Core Structure Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    ORDER MODEL CORE                      │
└─────────────────────────────────────────────────────────┘

    Order
    ├── id (UUID, PK)                  [Unique identifier]
    ├── order_number (CharField)       [Human-readable ID]
    │   └── Format: ORD-YYYY-NNNNN
    │
    ├── status (CharField)             [Order lifecycle]
    │   └── Choices: OrderStatus
    │
    ├── source (CharField)             [Order origin]
    │   └── Choices: OrderSource
    │
    ├── order_date (DateTimeField)     [Order timestamp]
    │
    ├── priority (IntegerField)        [Fulfillment priority]
    │   └── Range: 1-10 (1=highest)
    │
    ├── is_draft (BooleanField)        [Edit mode flag]
    │
    └── [Mixin Fields]
        ├── tenant (FK)                [Multi-tenancy]
        ├── created_at                 [Audit trail]
        ├── updated_at
        ├── deleted_at                 [Soft delete]
        └── is_deleted
```

### Field Details

| Field | Type | Purpose | Indexed | Required |
|-------|------|---------|---------|----------|
| `id` | UUID | Primary key | Yes (PK) | Yes |
| `order_number` | CharField(50) | Human-readable ID | Yes | Auto |
| `status` | CharField(20) | Lifecycle state | Yes | Yes |
| `source` | CharField(20) | Order origin | Yes | Yes |
| `order_date` | DateTime | Order timestamp | Yes | Yes |
| `priority` | Integer | Fulfillment order | No | Yes |
| `is_draft` | Boolean | Edit mode | No | Yes |

### Order Number Format

```
Format: ORD-{YEAR}-{SEQUENCE}

Examples:
- ORD-2026-00001
- ORD-2026-00234
- ORD-2026-12500

Components:
- Prefix: "ORD"
- Year: 4-digit current year
- Sequence: 5-digit zero-padded number (resets yearly)
```

### Status Field Behavior

| Status | Meaning | Can Edit | Stock Reserved |
|--------|---------|----------|----------------|
| PENDING | New order | Yes | No |
| CONFIRMED | Accepted | Limited | Yes |
| PROCESSING | In progress | No | Yes |
| SHIPPED | Dispatched | No | N/A |
| DELIVERED | Received | No | N/A |
| COMPLETED | Finished | No | N/A |
| CANCELLED | Terminated | No | No |
| RETURNED | Refunded | No | No |

### Priority System

| Priority | Use Case | Example |
|----------|----------|---------|
| 1-2 | Critical/Urgent | Rush orders, VIP customers |
| 3-5 | High Priority | Same-day delivery |
| 6-7 | Normal | Standard orders |
| 8-10 | Low Priority | Backorders, pre-orders |

### Verification Checklist
- [ ] `order.py` created in models directory
- [ ] All required imports included
- [ ] Order model class defined
- [ ] UUID primary key configured
- [ ] order_number field with unique constraint
- [ ] status field with OrderStatus choices
- [ ] source field with OrderSource choices
- [ ] order_date field with default
- [ ] priority field with range 1-10
- [ ] is_draft field for edit mode
- [ ] Meta class properly configured
- [ ] `__str__` method implemented
- [ ] Order model imported in `models/__init__.py`

---

## Task 06: Add Order Customer Fields

### Overview
Add customer relationship fields to the Order model, supporting both registered customers and guest checkout scenarios. This enables proper customer tracking and order history.

### Dependencies
- Task 05: Create Order Model Core Fields
- Customer model exists (from Phase 04 or earlier)

### Instructions

1. **Open order.py model file**
   - Navigate to `apps/orders/models/order.py`
   - Locate the Order model class

2. **Import Customer model**
   - Add import for Customer model from customers app
   - Use proper import path: `from apps.customers.models import Customer`

3. **Add customer field**
   - Use ForeignKey to Customer model
   - Set on_delete=models.PROTECT (prevent customer deletion with orders)
   - Set related_name='orders'
   - Make it null=True, blank=True (supports guest orders)
   - Add db_index=True for query performance
   - Add help_text explaining registered customer link

4. **Add customer_name field**
   - Use CharField with max_length=200
   - Make it blank=True for registered customers
   - Required for guest orders
   - Add help_text explaining guest usage

5. **Add customer_email field**
   - Use EmailField with max_length=254
   - Make it blank=True for registered customers
   - Required for guest orders
   - Add db_index=True for lookups
   - Add help_text explaining contact purpose

6. **Add customer_phone field**
   - Use CharField with max_length=20
   - Make it blank=True
   - Support Sri Lankan format (+94 XX XXX XXXX)
   - Add help_text with format example

7. **Add is_guest_order field**
   - Use BooleanField with default=False
   - Auto-computed based on customer FK
   - Indicates if order is from guest checkout

8. **Add customer_notes field**
   - Use TextField
   - Make it blank=True
   - Stores customer comments/requests
   - Add help_text explaining usage

9. **Add property method is_guest**
   - Create @property decorator method
   - Return True if customer is None
   - Simplifies guest order checks in code

10. **Add get_customer_name method**
    - Return customer.full_name if customer exists
    - Otherwise return customer_name
    - Provides consistent name retrieval

11. **Add get_customer_email method**
    - Return customer.email if customer exists
    - Otherwise return customer_email
    - Provides consistent email retrieval

12. **Add get_customer_phone method**
    - Return customer.phone if customer exists
    - Otherwise return customer_phone
    - Provides consistent phone retrieval

13. **Update __str__ method**
    - Include customer name in string representation
    - Format: "Order {order_number} - {customer_name}"

### Customer Relationship Diagram

```
┌───────────────────────────────────────────────────────────┐
│              ORDER CUSTOMER RELATIONSHIPS                  │
└───────────────────────────────────────────────────────────┘

    REGISTERED CUSTOMER ORDER:
    
    ┌────────────┐         ┌─────────────┐
    │  Customer  │◄────────│    Order    │
    │   Model    │ FK      │    Model    │
    └────────────┘         └─────────────┘
         │                       │
         │                       ├─ customer (FK) ──> Customer
         ├─ full_name            ├─ customer_name (empty)
         ├─ email                ├─ customer_email (empty)
         └─ phone                └─ customer_phone (empty)
    
    
    GUEST ORDER:
    
    ┌────────────┐         ┌─────────────┐
    │  Customer  │    X    │    Order    │
    │   Model    │  None   │    Model    │
    └────────────┘         └─────────────┘
                                 │
                                 ├─ customer (NULL)
                                 ├─ customer_name ──> "John Doe"
                                 ├─ customer_email ──> "john@example.com"
                                 └─ customer_phone ──> "+94771234567"
```

### Customer Field Logic

| Scenario | customer FK | customer_name | customer_email | customer_phone |
|----------|-------------|---------------|----------------|----------------|
| **Registered** | → Customer | Empty | Empty | Empty |
| **Guest** | NULL | Required | Required | Optional |
| **Mixed** | → Customer | Override name | Override email | Override phone |

### Field Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| **Guest requires name** | If customer is None, customer_name required | "Guest order must have customer name" |
| **Guest requires email** | If customer is None, customer_email required | "Guest order must have customer email" |
| **Email format** | Valid email format | "Enter a valid email address" |
| **Phone format** | Optional format validation | "Invalid phone format" |

### Property Methods Behavior

```python
# Example usage of property methods:

# Registered customer order
order.customer = customer_instance
order.get_customer_name()   # Returns: customer_instance.full_name
order.get_customer_email()  # Returns: customer_instance.email
order.is_guest              # Returns: False

# Guest order
order.customer = None
order.customer_name = "Jane Smith"
order.customer_email = "jane@example.com"
order.get_customer_name()   # Returns: "Jane Smith"
order.get_customer_email()  # Returns: "jane@example.com"
order.is_guest              # Returns: True
```

### Sri Lankan Phone Format

| Format | Example | Notes |
|--------|---------|-------|
| Mobile | +94 77 123 4567 | Leading +94 |
| Mobile | 0771234567 | Local format |
| Landline | +94 11 234 5678 | Colombo area |
| Landline | 0112345678 | Local format |

### Customer Data Flow

```
ORDER CREATION:

1. Registered Customer:
   ┌───────────┐
   │ Customer  │
   │  Logged   │
   │    In     │
   └───────────┘
        │
        ▼
   [Populate customer FK]
        │
        ▼
   [Get name/email from FK]
        │
        ▼
   [Create Order]

2. Guest Checkout:
   ┌───────────┐
   │   Guest   │
   │  Enters   │
   │   Info    │
   └───────────┘
        │
        ▼
   [customer = None]
        │
        ▼
   [Populate guest fields]
        │
        ▼
   [Create Order]
```

### Customer Notes Use Cases

| Use Case | Example Note |
|----------|--------------|
| **Delivery instructions** | "Leave at front door" |
| **Gift message** | "Happy Birthday! - Mom" |
| **Special requests** | "Please include extra packaging" |
| **Allergies/Restrictions** | "No dairy products" |
| **Timing** | "Deliver between 2-4 PM" |

### Verification Checklist
- [ ] Customer model imported
- [ ] customer FK field added with PROTECT
- [ ] customer_name field added (CharField)
- [ ] customer_email field added (EmailField)
- [ ] customer_phone field added (CharField)
- [ ] is_guest_order field added (BooleanField)
- [ ] customer_notes field added (TextField)
- [ ] `is_guest` property method created
- [ ] `get_customer_name()` method created
- [ ] `get_customer_email()` method created
- [ ] `get_customer_phone()` method created
- [ ] `__str__` method updated with customer name
- [ ] Comments document guest vs registered logic

---

## End of Document

**Progress:** Tasks 01-06 completed. Foundation for Order model established with app setup, status/source enums, core fields, and customer relationships.

**Next Steps:** Continue to [02_Tasks-07-12_Address-Dates-Financial-Metadata.md](02_Tasks-07-12_Address-Dates-Financial-Metadata.md) to add address, date tracking, financial calculations, and metadata fields.

---

## Summary of Deliverables

| Task | Deliverable | Location |
|------|-------------|----------|
| 01 | Orders Django app | `apps/orders/` |
| 02 | App registration | `settings.py` TENANT_APPS |
| 03 | OrderStatus choices | `apps/orders/constants.py` |
| 04 | OrderSource choices | `apps/orders/constants.py` |
| 05 | Order model core | `apps/orders/models/order.py` |
| 06 | Customer fields | `apps/orders/models/order.py` |

### Key Concepts Established

1. **Multi-tenant orders** - Each tenant has isolated order data
2. **Status lifecycle** - 8 statuses covering complete order flow
3. **Source tracking** - 5 sources for analytics and routing
4. **UUID primary keys** - Globally unique order identifiers
5. **Order numbering** - Human-readable format (ORD-YYYY-NNNNN)
6. **Guest support** - Orders without customer accounts
7. **Flexible customer data** - Support registered and guest scenarios

---
