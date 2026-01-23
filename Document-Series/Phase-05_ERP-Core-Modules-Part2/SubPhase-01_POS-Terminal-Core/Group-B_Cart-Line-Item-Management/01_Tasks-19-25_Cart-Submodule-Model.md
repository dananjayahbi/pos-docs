# Tasks 19-25: Cart Submodule & POSCart Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** B - Cart & Line Item Management  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-26-31_Cart-Items-Model.md](02_Tasks-26-31_Cart-Items-Model.md)
- **← Previous Group:** [../Group-A_POS-Terminal-Session-Models/](../Group-A_POS-Terminal-Session-Models/)

---

## Document Overview

This document covers the creation of the cart submodule structure and the POSCart model. The cart system manages transaction building in the POS terminal, allowing cashiers to add products, apply discounts, and calculate totals before finalizing the sale.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create cart submodule | Low | 10 min |
| 20 | Define cart status constants | Low | 10 min |
| 21 | Create POSCart model | Medium | 30 min |
| 22 | Add cart reference number | Medium | 20 min |
| 23 | Add cart timestamps | Low | 15 min |
| 24 | Add cart totals fields | Medium | 20 min |
| 25 | Add cart discount fields | Low | 15 min |

**Total Estimated Time:** 2 hours

---

## Task 19: Create Cart Submodule

### Overview
Create the cart submodule structure within the POS app to organize all cart-related functionality. This establishes a clean separation of concerns for cart models and business logic.

### Dependencies
- Phase 03: Core Backend Infrastructure completed
- `apps/pos/` app exists

### Purpose
The cart submodule encapsulates all shopping cart functionality:
- Models for carts and cart items
- Service layer for cart operations
- Business logic for discounts and totals
- Clear separation from other POS concerns

### Instructions

1. **Create cart directory structure**
   - Navigate to `apps/pos/` directory
   - Create `cart/` directory
   - This becomes the main container for cart functionality

2. **Create cart __init__.py**
   - Create empty `__init__.py` in `apps/pos/cart/`
   - This makes cart a Python package
   - Allows importing cart components

3. **Create models directory**
   - Create `models/` directory inside `apps/pos/cart/`
   - Create empty `__init__.py` in `apps/pos/cart/models/`
   - This will contain POSCart and POSCartItem models

4. **Create services directory**
   - Create `services/` directory inside `apps/pos/cart/`
   - Create empty `__init__.py` in `apps/pos/cart/services/`
   - This will contain CartService business logic

### Directory Structure

```
apps/pos/
├── __init__.py
├── cart/                          # NEW: Cart submodule
│   ├── __init__.py               # NEW: Package marker
│   ├── models/                   # NEW: Cart models
│   │   └── __init__.py
│   └── services/                 # NEW: Cart services
│       └── __init__.py
├── terminal/
│   └── ...
└── session/
    └── ...
```

### Expected Outcome
```
apps/pos/cart/
├── __init__.py
├── models/
│   └── __init__.py
└── services/
    └── __init__.py
```

### Verification Checklist
- [ ] `apps/pos/cart/` directory exists
- [ ] `apps/pos/cart/__init__.py` exists
- [ ] `apps/pos/cart/models/` directory exists
- [ ] `apps/pos/cart/models/__init__.py` exists
- [ ] `apps/pos/cart/services/` directory exists
- [ ] `apps/pos/cart/services/__init__.py` exists

---

## Task 20: Define Cart Status Constants

### Overview
Define cart status constants that represent the lifecycle states of a shopping cart in the POS system. These constants ensure consistent cart state management across the application.

### Dependencies
- Task 19: Cart submodule created
- `apps/pos/constants.py` exists (from Group A)

### Purpose
Cart status tracking enables:
- Current transaction management (ACTIVE)
- Parking transactions for later (HELD)
- Finalizing completed sales (COMPLETED)
- Cancelling transactions (VOIDED)
- Cleaning up stale carts (ABANDONED)

### Instructions

1. **Open constants file**
   - Navigate to `apps/pos/constants.py`
   - This file already contains terminal and session constants

2. **Add cart status section comment**
   - Add clear section divider comment
   - Label: "# Cart Status Constants"

3. **Define CART_STATUS_ACTIVE constant**
   - Define constant for active carts
   - Value: `'ACTIVE'`
   - Represents current transaction being built

4. **Define CART_STATUS_HELD constant**
   - Define constant for held carts
   - Value: `'HELD'`
   - Represents parked transaction for later completion

5. **Define CART_STATUS_COMPLETED constant**
   - Define constant for completed carts
   - Value: `'COMPLETED'`
   - Represents finalized transaction with payment

6. **Define CART_STATUS_VOIDED constant**
   - Define constant for voided carts
   - Value: `'VOIDED'`
   - Represents cancelled transaction before payment

7. **Define CART_STATUS_ABANDONED constant**
   - Define constant for abandoned carts
   - Value: `'ABANDONED'`
   - Represents timed out or orphaned carts

8. **Create CART_STATUS_CHOICES tuple**
   - Create tuple for Django model choices
   - Contains all status constants with display labels
   - Format: `(value, display_label)` tuples

9. **Add DEFAULT_CART_STATUS constant**
   - Define default status for new carts
   - Value: `CART_STATUS_ACTIVE`
   - Used when creating new cart instances

### Cart Status Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Cart Lifecycle                         │
└──────────────────────────────────────────────────────────┘

                        [Create Cart]
                             │
                             ▼
                        ┌──────────┐
                        │  ACTIVE  │
                        └──────────┘
                         │   │   │
             ┌───────────┘   │   └───────────┐
             │               │               │
             ▼               ▼               ▼
        ┌────────┐     ┌───────────┐   ┌──────────┐
        │  HELD  │     │ COMPLETED │   │  VOIDED  │
        └────────┘     └───────────┘   └──────────┘
             │               │               │
             │               ▼               │
             │         [Transaction         │
             │          Finalized]          │
             │                              │
             └──────────────┬───────────────┘
                            ▼
                      ┌───────────┐
                      │ ABANDONED │
                      └───────────┘
                      [Timeout/Cleanup]
```

### Status Descriptions

| Status | Description | Use Case |
|--------|-------------|----------|
| **ACTIVE** | Current transaction in progress | Cashier actively adding items |
| **HELD** | Parked for later | Customer steps away temporarily |
| **COMPLETED** | Sale finalized | Payment processed successfully |
| **VOIDED** | Cancelled by user | Cashier cancels transaction |
| **ABANDONED** | Auto-closed | Session ends or timeout |

### Constants Structure

```python
# Cart Status Constants
CART_STATUS_ACTIVE = 'ACTIVE'
CART_STATUS_HELD = 'HELD'
CART_STATUS_COMPLETED = 'COMPLETED'
CART_STATUS_VOIDED = 'VOIDED'
CART_STATUS_ABANDONED = 'ABANDONED'

CART_STATUS_CHOICES = (
    (CART_STATUS_ACTIVE, 'Active'),
    (CART_STATUS_HELD, 'Held'),
    (CART_STATUS_COMPLETED, 'Completed'),
    (CART_STATUS_VOIDED, 'Voided'),
    (CART_STATUS_ABANDONED, 'Abandoned'),
)

DEFAULT_CART_STATUS = CART_STATUS_ACTIVE
```

### Expected Outcome
```python
# apps/pos/constants.py now contains:
# - Terminal status constants (from Group A)
# - Session status constants (from Group A)
# - Cart status constants (NEW)
```

### Verification Checklist
- [ ] `apps/pos/constants.py` contains cart status section
- [ ] All five cart status constants defined
- [ ] CART_STATUS_CHOICES tuple created
- [ ] DEFAULT_CART_STATUS constant defined
- [ ] Constants follow naming convention

---

## Task 21: Create POSCart Model

### Overview
Create the POSCart model to represent a shopping cart in the POS system. This model stores the cart's core information including session link, customer link, status, and serves as the parent for all cart items.

### Dependencies
- Task 19: Cart submodule created
- Task 20: Cart status constants defined
- Group A: POSSession model created
- Core Infrastructure: Base models and mixins

### Purpose
The POSCart model:
- Links to active POS session
- Optionally links to customer
- Tracks cart status lifecycle
- Serves as parent for cart items
- Stores cart-level metadata
- Enables cart operations and queries

### Instructions

1. **Create pos_cart.py file**
   - Navigate to `apps/pos/cart/models/`
   - Create `pos_cart.py` file
   - This will contain the POSCart model

2. **Import required dependencies**
   - Import Django model components (models, transaction)
   - Import base models from core (TenantAwareModel, TimestampedModel)
   - Import cart status constants from pos.constants
   - Import User model
   - Import Decimal for currency handling
   - Import timezone utilities

3. **Define POSCart model class**
   - Inherit from TenantAwareModel and TimestampedModel
   - This provides tenant isolation and timestamp fields
   - Ensures cart is tenant-specific and tracked

4. **Add session foreign key**
   - Field name: `session`
   - Type: ForeignKey to POSSession
   - on_delete: CASCADE (cart deleted when session deleted)
   - related_name: `'carts'`
   - db_index: True for query performance
   - help_text: "POS session this cart belongs to"

5. **Add customer foreign key**
   - Field name: `customer`
   - Type: ForeignKey to User
   - on_delete: SET_NULL (keep cart if customer deleted)
   - null: True, blank: True (customer optional)
   - related_name: `'pos_carts'`
   - help_text: "Customer associated with this cart"
   - limit_choices_to: `{'is_customer': True}`

6. **Add status field**
   - Field name: `status`
   - Type: CharField
   - max_length: 20
   - choices: CART_STATUS_CHOICES
   - default: DEFAULT_CART_STATUS
   - db_index: True for filtering
   - help_text: "Current status of the cart"

7. **Add Meta class**
   - Set db_table: `'pos_carts'`
   - Set verbose_name: `'POS Cart'`
   - Set verbose_name_plural: `'POS Carts'`
   - Set ordering: `['-created_at']` (newest first)
   - Add indexes for common queries
   - Add unique_together constraint if needed

8. **Add __str__ method**
   - Return formatted string with session and status
   - Example: "Cart for Session S001 (ACTIVE)"
   - Helps in admin and debugging

9. **Add get_status_display method**
   - Custom method for formatted status display
   - Returns human-readable status
   - Used in API responses and admin

10. **Add is_active property**
    - Returns True if status is ACTIVE
    - Convenient helper for business logic
    - Used in cart validation

11. **Add is_modifiable property**
    - Returns True if cart can be modified
    - Check: status in [ACTIVE, HELD]
    - Prevents modifying completed/voided carts

12. **Update models __init__.py**
    - Import POSCart from pos_cart module
    - Add to __all__ list
    - Makes POSCart available for imports

### Model Relationships

```
┌────────────────────────────────────────────────────────┐
│                  POSCart Model                          │
└────────────────────────────────────────────────────────┘

          ┌─────────────┐
          │ POSSession  │
          └─────────────┘
                │
                │ session (FK)
                ▼
          ┌─────────────┐
          │  POSCart    │◄────────┐
          └─────────────┘         │ customer (FK, optional)
                │                 │
                │                 │
                │          ┌──────────┐
                │          │   User   │
                │          └──────────┘
                │
                ▼
          [Cart Items]
          (Next Task)
```

### Model Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| **session** | ForeignKey | Links cart to POS session |
| **customer** | ForeignKey | Optional customer link |
| **status** | CharField | Cart lifecycle status |
| **created_at** | DateTime | From TimestampedModel |
| **updated_at** | DateTime | From TimestampedModel |
| **tenant** | ForeignKey | From TenantAwareModel |

### Business Rules

1. **Session Linkage**
   - Every cart must belong to a session
   - Cart inherits tenant from session
   - Cart deleted if session deleted

2. **Customer Optional**
   - Walk-in sales: customer = NULL
   - Registered customers: link to User
   - Customer type validated via limit_choices_to

3. **Status Management**
   - New carts default to ACTIVE
   - Only ACTIVE/HELD carts modifiable
   - COMPLETED carts are read-only
   - VOIDED/ABANDONED for cleanup

4. **Tenant Isolation**
   - Cart inherits tenant from session
   - Cart queries filtered by tenant
   - Multi-tenant data separation enforced

### Expected Outcome
```python
# apps/pos/cart/models/pos_cart.py
from django.db import models
from apps.core.models import TenantAwareModel, TimestampedModel
from apps.pos.constants import CART_STATUS_CHOICES, DEFAULT_CART_STATUS

class POSCart(TenantAwareModel, TimestampedModel):
    """Shopping cart for POS transactions"""
    session = models.ForeignKey(...)
    customer = models.ForeignKey(...)
    status = models.CharField(...)
    
    class Meta:
        db_table = 'pos_carts'
        ...
    
    def __str__(self):
        return f"Cart for Session {self.session.reference} ({self.status})"
    
    @property
    def is_active(self):
        return self.status == 'ACTIVE'
    
    @property
    def is_modifiable(self):
        return self.status in ['ACTIVE', 'HELD']
```

### Verification Checklist
- [ ] `pos_cart.py` file created
- [ ] POSCart model class defined
- [ ] Inherits from TenantAwareModel and TimestampedModel
- [ ] session ForeignKey to POSSession added
- [ ] customer ForeignKey to User added (nullable)
- [ ] status CharField with choices added
- [ ] Meta class configured properly
- [ ] __str__ method implemented
- [ ] is_active property added
- [ ] is_modifiable property added
- [ ] Model imported in `models/__init__.py`

---

## Task 22: Add Cart Reference Number

### Overview
Add an auto-generated unique reference number field to the POSCart model. This provides a human-readable identifier for each cart that can be used in receipts, reports, and customer communications.

### Dependencies
- Task 21: POSCart model created

### Purpose
The reference number:
- Provides unique cart identifier
- Supports receipt printing
- Enables cart tracking and lookup
- Facilitates customer service
- Allows audit trail

### Instructions

1. **Open pos_cart.py**
   - Navigate to `apps/pos/cart/models/pos_cart.py`
   - Locate POSCart model class

2. **Add reference_number field**
   - Field name: `reference_number`
   - Type: CharField
   - max_length: 50
   - unique: True (enforces uniqueness)
   - blank: True (allows empty during creation)
   - editable: False (not manually editable)
   - db_index: True for lookup performance
   - help_text: "Unique reference number for this cart"

3. **Create generate_reference method**
   - Create private method `_generate_reference_number`
   - Generate format: `POS-{YEAR}-{TERMINAL_CODE}-{SEQUENCE}`
   - Extract year from current date
   - Extract terminal code from session.terminal.code
   - Generate sequence number (6 digits, zero-padded)
   - Example: "POS-2024-T01-000123"

4. **Implement sequence logic**
   - Query existing carts with same terminal and year
   - Extract highest sequence number
   - Increment by 1
   - Handle edge case: first cart of year for terminal

5. **Override save method**
   - Override the save method
   - Check if reference_number is empty
   - If empty, call _generate_reference_number
   - Ensure reference generated before first save
   - Handle potential race conditions with transaction

6. **Add generate on creation logic**
   - Use Django signals (post_save) OR
   - Generate in save method on creation
   - Ensure atomic operation with database transaction

7. **Add validation method**
   - Create `clean` method
   - Validate reference format if manually set
   - Ensure uniqueness constraints

### Reference Number Format

```
┌────────────────────────────────────────────────┐
│          POS-2024-T01-000123                   │
└────────────────────────────────────────────────┘
     │    │    │    │
     │    │    │    └── Sequence (6 digits)
     │    │    └──────── Terminal Code
     │    └───────────── Year
     └────────────────── Prefix

Components:
- Prefix: "POS" (identifies as POS cart)
- Year: 4-digit year (e.g., 2024)
- Terminal Code: From session.terminal.code (e.g., T01)
- Sequence: 6-digit zero-padded number (e.g., 000123)
```

### Reference Generation Flow

```
┌────────────────────────────────────────────────┐
│        Cart Reference Generation                │
└────────────────────────────────────────────────┘

[Cart.save() called]
        │
        ▼
    [Check if reference_number empty?]
        │
        ├── No ──► [Continue with save]
        │
        └── Yes ──► [Generate reference]
                         │
                         ▼
              [Get current year]
                         │
                         ▼
              [Get terminal code from session]
                         │
                         ▼
              [Query existing carts for this year + terminal]
                         │
                         ▼
              [Find max sequence number]
                         │
                         ▼
              [Increment sequence by 1]
                         │
                         ▼
              [Format: POS-YYYY-TERM-NNNNNN]
                         │
                         ▼
              [Set reference_number]
                         │
                         ▼
              [Continue with save]
```

### Implementation Pattern

```python
def _generate_reference_number(self):
    """Generate unique reference number"""
    from django.utils import timezone
    from django.db import transaction
    
    with transaction.atomic():
        # Get current year
        year = timezone.now().year
        
        # Get terminal code
        terminal_code = self.session.terminal.code
        
        # Find max sequence for this year and terminal
        prefix = f"POS-{year}-{terminal_code}-"
        last_cart = POSCart.objects.filter(
            reference_number__startswith=prefix
        ).order_by('-reference_number').first()
        
        if last_cart:
            # Extract sequence and increment
            last_seq = int(last_cart.reference_number[-6:])
            next_seq = last_seq + 1
        else:
            # First cart for this year and terminal
            next_seq = 1
        
        # Format reference
        return f"{prefix}{next_seq:06d}"

def save(self, *args, **kwargs):
    """Override save to generate reference"""
    if not self.reference_number:
        self.reference_number = self._generate_reference_number()
    super().save(*args, **kwargs)
```

### Reference Number Examples

```
POS-2024-T01-000001  # First cart of 2024 on Terminal 01
POS-2024-T01-000002  # Second cart of 2024 on Terminal 01
POS-2024-T02-000001  # First cart of 2024 on Terminal 02
POS-2025-T01-000001  # First cart of 2025 on Terminal 01 (resets yearly)
```

### Business Rules

1. **Uniqueness**
   - Each reference must be globally unique
   - Database constraint enforces uniqueness
   - Generation logic prevents duplicates

2. **Sequence Reset**
   - Sequence resets each year
   - Sequence unique per terminal
   - Pattern: {YEAR}-{TERMINAL}-{SEQUENCE}

3. **Immutability**
   - Reference cannot be changed after creation
   - editable=False prevents manual editing
   - Used for permanent identification

4. **Auto-Generation**
   - Generated automatically on first save
   - No manual intervention required
   - Atomic generation prevents race conditions

### Expected Outcome
```python
# POSCart model now includes:
reference_number = models.CharField(
    max_length=50,
    unique=True,
    blank=True,
    editable=False,
    db_index=True,
    help_text="Unique reference number"
)

def _generate_reference_number(self):
    # Generation logic here
    pass

def save(self, *args, **kwargs):
    if not self.reference_number:
        self.reference_number = self._generate_reference_number()
    super().save(*args, **kwargs)
```

### Verification Checklist
- [ ] reference_number field added to POSCart
- [ ] Field is CharField with unique=True
- [ ] _generate_reference_number method implemented
- [ ] save method overridden to generate reference
- [ ] Reference format follows POS-YYYY-TERM-NNNNNN pattern
- [ ] Sequence increments correctly per terminal per year
- [ ] Transaction atomic for generation
- [ ] Reference is immutable after creation

---

## Task 23: Add Cart Timestamps

### Overview
Add timestamp fields to track cart lifecycle events including creation time, last update time, and optional completion/void timestamps. These timestamps support audit trails, reporting, and cart lifecycle management.

### Dependencies
- Task 21: POSCart model created
- TimestampedModel mixin provides created_at and updated_at

### Purpose
Timestamps enable:
- Cart lifecycle tracking
- Performance metrics (time to complete)
- Audit trails for compliance
- Abandoned cart cleanup
- Reporting and analytics

### Instructions

1. **Verify inherited timestamps**
   - POSCart inherits from TimestampedModel
   - created_at: Auto-set on creation
   - updated_at: Auto-updated on save
   - These fields already exist, no addition needed

2. **Add completed_at field**
   - Field name: `completed_at`
   - Type: DateTimeField
   - null: True, blank: True
   - help_text: "When the cart was completed (sale finalized)"
   - Set when status changes to COMPLETED
   - Used for transaction history

3. **Add voided_at field**
   - Field name: `voided_at`
   - Type: DateTimeField
   - null: True, blank: True
   - help_text: "When the cart was voided (cancelled)"
   - Set when status changes to VOIDED
   - Used for audit trail

4. **Add held_at field**
   - Field name: `held_at`
   - Type: DateTimeField
   - null: True, blank: True
   - help_text: "When the cart was put on hold"
   - Set when status changes to HELD
   - Used for hold time tracking

5. **Add abandoned_at field**
   - Field name: `abandoned_at`
   - Type: DateTimeField
   - null: True, blank: True
   - help_text: "When the cart was marked as abandoned"
   - Set when status changes to ABANDONED
   - Used for cleanup processes

6. **Create update_status method**
   - Method: `update_status(new_status)`
   - Updates status field
   - Sets appropriate timestamp based on new status
   - Validates status transitions

7. **Implement status timestamp logic**
   - When status -> COMPLETED: set completed_at
   - When status -> VOIDED: set voided_at
   - When status -> HELD: set held_at
   - When status -> ABANDONED: set abandoned_at
   - Use timezone.now() for timestamps

8. **Add duration properties**
   - Create `@property` methods
   - `duration_to_complete`: completed_at - created_at
   - `duration_active`: updated_at - created_at (for ACTIVE carts)
   - Return timedelta or None

### Timestamp Lifecycle

```
┌────────────────────────────────────────────────┐
│            Cart Timestamp Lifecycle             │
└────────────────────────────────────────────────┘

[Cart Created]
    │
    ├── created_at: 2024-01-15 10:00:00
    └── updated_at: 2024-01-15 10:00:00
    
[Items Added/Modified]
    │
    └── updated_at: 2024-01-15 10:05:23

[Cart Held]
    │
    ├── held_at: 2024-01-15 10:06:00
    └── updated_at: 2024-01-15 10:06:00

[Cart Resumed] (HELD → ACTIVE)
    │
    └── updated_at: 2024-01-15 10:10:15

[Cart Completed]
    │
    ├── completed_at: 2024-01-15 10:12:45
    ├── updated_at: 2024-01-15 10:12:45
    └── status: COMPLETED

Alternative Endings:

[Cart Voided]
    │
    ├── voided_at: 2024-01-15 10:08:30
    └── updated_at: 2024-01-15 10:08:30

[Cart Abandoned]
    │
    ├── abandoned_at: 2024-01-15 11:00:00
    └── updated_at: 2024-01-15 11:00:00
```

### Timestamp Fields Summary

| Field | Type | Set When | Purpose |
|-------|------|----------|---------|
| **created_at** | DateTime | Cart created | Initial creation time |
| **updated_at** | DateTime | Any change | Last modification time |
| **held_at** | DateTime | Status → HELD | Hold time tracking |
| **completed_at** | DateTime | Status → COMPLETED | Transaction finalized |
| **voided_at** | DateTime | Status → VOIDED | Cancellation time |
| **abandoned_at** | DateTime | Status → ABANDONED | Cleanup time |

### Update Status Method Pattern

```python
def update_status(self, new_status, save=True):
    """Update cart status and set appropriate timestamp"""
    from django.utils import timezone
    
    old_status = self.status
    self.status = new_status
    
    # Set timestamp based on new status
    if new_status == CART_STATUS_COMPLETED:
        self.completed_at = timezone.now()
    elif new_status == CART_STATUS_VOIDED:
        self.voided_at = timezone.now()
    elif new_status == CART_STATUS_HELD:
        self.held_at = timezone.now()
    elif new_status == CART_STATUS_ABANDONED:
        self.abandoned_at = timezone.now()
    
    if save:
        self.save()
    
    return old_status, new_status
```

### Duration Properties

```python
@property
def duration_to_complete(self):
    """Time taken to complete cart"""
    if self.completed_at and self.created_at:
        return self.completed_at - self.created_at
    return None

@property
def duration_active(self):
    """Current duration for active carts"""
    if self.status in ['ACTIVE', 'HELD']:
        return timezone.now() - self.created_at
    return None

@property
def time_since_held(self):
    """Time since cart was held"""
    if self.held_at:
        return timezone.now() - self.held_at
    return None
```

### Business Rules

1. **Automatic Timestamps**
   - created_at: Set on creation (from mixin)
   - updated_at: Updated on every save (from mixin)
   - Status timestamps: Set on status change

2. **Status-Specific Timestamps**
   - Each terminal status has its own timestamp
   - Timestamps are immutable once set
   - Used for audit and reporting

3. **Duration Calculations**
   - Time to complete: critical performance metric
   - Time since held: for abandonment detection
   - Active duration: for session analytics

4. **Timezone Awareness**
   - All timestamps use timezone-aware datetimes
   - Use Django's timezone.now()
   - Respect tenant timezone settings

### Expected Outcome
```python
# POSCart model now includes:

# Inherited from TimestampedModel
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)

# New timestamp fields
completed_at = models.DateTimeField(null=True, blank=True)
voided_at = models.DateTimeField(null=True, blank=True)
held_at = models.DateTimeField(null=True, blank=True)
abandoned_at = models.DateTimeField(null=True, blank=True)

def update_status(self, new_status, save=True):
    # Status update with timestamp logic
    pass

@property
def duration_to_complete(self):
    # Duration calculation
    pass
```

### Verification Checklist
- [ ] created_at and updated_at from TimestampedModel verified
- [ ] completed_at field added
- [ ] voided_at field added
- [ ] held_at field added
- [ ] abandoned_at field added
- [ ] All timestamp fields nullable
- [ ] update_status method implemented
- [ ] Status change sets appropriate timestamp
- [ ] duration_to_complete property added
- [ ] duration_active property added
- [ ] Timezone-aware datetime usage

---

## Task 24: Add Cart Totals Fields

### Overview
Add decimal fields to the POSCart model for tracking cart financial totals including subtotal, discount total, tax total, and grand total. These fields store calculated values for efficient querying and reporting.

### Dependencies
- Task 21: POSCart model created
- Task 23: Timestamp fields added

### Purpose
Cart totals fields enable:
- Efficient financial queries
- Quick total display without calculation
- Reporting and analytics
- Transaction history
- Audit trails

### Instructions

1. **Import Decimal module**
   - Import Decimal from decimal module
   - Ensure DecimalField precision handling
   - Import Decimal validators if needed

2. **Add subtotal field**
   - Field name: `subtotal`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - help_text: "Sum of all line totals before cart discount"
   - Represents total before discounts and tax

3. **Add discount_total field**
   - Field name: `discount_total`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - help_text: "Total discount amount applied (line + cart discounts)"
   - Sum of all discounts

4. **Add tax_total field**
   - Field name: `tax_total`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - help_text: "Total tax amount"
   - Sum of all item taxes

5. **Add grand_total field**
   - Field name: `grand_total`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - db_index: True (for filtering/sorting)
   - help_text: "Final amount to pay (subtotal - discount + tax)"
   - The amount customer pays

6. **Add validation method**
   - Create `clean` method
   - Validate: grand_total >= 0
   - Validate: discount_total <= subtotal
   - Validate: All totals are non-negative (except if returns allowed)

7. **Add recalculation placeholder**
   - Add method: `recalculate_totals()`
   - This will be implemented in Task 38
   - Add docstring explaining future implementation
   - Method signature only, no implementation yet

8. **Add total display properties**
   - Property: `formatted_subtotal` returns "₨ 1,250.00"
   - Property: `formatted_grand_total` returns "₨ 1,125.00"
   - Use Sri Lankan Rupee symbol (₨)
   - Format with thousand separators

### Cart Totals Calculation Flow

```
┌────────────────────────────────────────────────┐
│         Cart Totals Calculation                 │
└────────────────────────────────────────────────┘

[Line Items]
    │
    ├── Item 1: Qty 2 × ₨500 = ₨1,000
    ├── Item 2: Qty 1 × ₨750 = ₨750
    └── Item 3: Qty 3 × ₨200 = ₨600
                    │
                    ▼
            ┌───────────────┐
            │   Subtotal    │ = ₨2,350
            └───────────────┘
                    │
                    ▼
        [Apply Line Discounts]
            ₨50 + ₨25 = ₨75
                    │
                    ▼
        [Apply Cart Discount]
            10% of ₨2,275 = ₨227.50
                    │
                    ▼
            ┌───────────────┐
            │ Discount Total│ = ₨302.50
            └───────────────┘
                    │
                    ▼
        [Calculate Tax]
            12% of ₨2,047.50 = ₨245.70
                    │
                    ▼
            ┌───────────────┐
            │   Tax Total   │ = ₨245.70
            └───────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  Grand Total  │ = ₨2,293.20
            └───────────────┘
            (Subtotal - Discount + Tax)
```

### Totals Relationship

```
Grand Total = Subtotal - Discount Total + Tax Total

Where:
- Subtotal = Sum of (item.quantity × item.unit_price)
- Discount Total = Line Discounts + Cart Discount
- Tax Total = Sum of (item.tax_amount)
```

### Field Specifications

| Field | Max Digits | Decimal Places | Max Value | Purpose |
|-------|------------|----------------|-----------|---------|
| **subtotal** | 12 | 2 | ₨9,999,999,999.99 | Items total |
| **discount_total** | 12 | 2 | ₨9,999,999,999.99 | Total discounts |
| **tax_total** | 12 | 2 | ₨9,999,999,999.99 | Total tax |
| **grand_total** | 12 | 2 | ₨9,999,999,999.99 | Final amount |

### Decimal Precision

```python
from decimal import Decimal, ROUND_HALF_UP

# Always use Decimal for currency
subtotal = Decimal('1250.50')
discount = Decimal('125.05')
tax = Decimal('135.06')

# Rounding
grand_total = (subtotal - discount + tax).quantize(
    Decimal('0.01'), 
    rounding=ROUND_HALF_UP
)
```

### Implementation Pattern

```python
from decimal import Decimal
from django.core.validators import MinValueValidator

class POSCart(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Sum of all line totals"
    )
    
    discount_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Total discounts applied"
    )
    
    tax_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Total tax amount"
    )
    
    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        db_index=True,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Final amount to pay"
    )
    
    @property
    def formatted_grand_total(self):
        """Format grand total with currency symbol"""
        return f"₨ {self.grand_total:,.2f}"
    
    def recalculate_totals(self):
        """Recalculate all cart totals (implemented in Task 38)"""
        pass
```

### Business Rules

1. **Calculation Order**
   - Calculate line totals first
   - Sum for subtotal
   - Apply discounts
   - Calculate tax on discounted amount
   - Sum for grand total

2. **Precision**
   - All calculations use Decimal
   - Round to 2 decimal places
   - Use ROUND_HALF_UP rounding mode

3. **Validation**
   - All totals must be >= 0
   - discount_total cannot exceed subtotal
   - grand_total must be reasonable

4. **Storage**
   - Store calculated values in database
   - Recalculate when items change
   - No need to calculate on every query

### Sri Lankan Currency Format

```
Format: ₨ X,XXX.XX

Examples:
₨ 50.00
₨ 1,250.50
₨ 125,000.00
₨ 1,250,000.00

Rules:
- Symbol: ₨ (Sri Lankan Rupee)
- Thousand separator: comma (,)
- Decimal separator: period (.)
- Always 2 decimal places
```

### Expected Outcome
```python
# POSCart model now includes:
subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

@property
def formatted_grand_total(self):
    return f"₨ {self.grand_total:,.2f}"

def recalculate_totals(self):
    # To be implemented in Task 38
    pass
```

### Verification Checklist
- [ ] Decimal module imported
- [ ] subtotal field added with correct specs
- [ ] discount_total field added
- [ ] tax_total field added
- [ ] grand_total field added with db_index
- [ ] All fields use DecimalField with 12 digits, 2 decimals
- [ ] Default values set to Decimal('0.00')
- [ ] MinValueValidator added to fields
- [ ] formatted_grand_total property added
- [ ] recalculate_totals method placeholder added
- [ ] Sri Lankan Rupee symbol used in formatting

---

## Task 25: Add Cart Discount Fields

### Overview
Add fields to the POSCart model for tracking cart-level discounts. These discounts apply to the entire cart after all line item totals are calculated, providing flexibility for promotional pricing and special offers.

### Dependencies
- Task 21: POSCart model created
- Task 24: Cart totals fields added

### Purpose
Cart-level discounts enable:
- Promotional campaigns (10% off entire purchase)
- Loyalty rewards (₨500 off for members)
- Seasonal sales
- Coupon codes
- Manager overrides

### Instructions

1. **Add discount type constants (if not in constants.py)**
   - Navigate to `apps/pos/constants.py`
   - Add DISCOUNT_TYPE_PERCENT = 'PERCENT'
   - Add DISCOUNT_TYPE_FIXED = 'FIXED'
   - Add DISCOUNT_TYPE_CHOICES tuple

2. **Add cart_discount_type field**
   - Field name: `cart_discount_type`
   - Type: CharField
   - max_length: 10
   - choices: DISCOUNT_TYPE_CHOICES
   - null: True, blank: True
   - help_text: "Type of cart discount (PERCENT or FIXED)"
   - Determines how discount_value is interpreted

3. **Add cart_discount_value field**
   - Field name: `cart_discount_value`
   - Type: DecimalField
   - max_digits: 10
   - decimal_places: 2
   - null: True, blank: True
   - default: Decimal('0.00')
   - help_text: "Cart discount value (percentage or fixed amount)"
   - Stores discount amount or percentage

4. **Add cart_discount_reason field**
   - Field name: `cart_discount_reason`
   - Type: CharField
   - max_length: 200
   - null: True, blank: True
   - help_text: "Reason for cart discount"
   - Track why discount was applied

5. **Add coupon_code field**
   - Field name: `coupon_code`
   - Type: CharField
   - max_length: 50
   - null: True, blank: True
   - db_index: True
   - help_text: "Coupon code applied to cart"
   - Links to promotions system

6. **Add cart_discount_amount field**
   - Field name: `cart_discount_amount`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - help_text: "Calculated cart discount amount in currency"
   - Stores actual discount in LKR

7. **Add validation method**
   - Add to `clean` method
   - If cart_discount_type is PERCENT: value must be 0-100
   - If cart_discount_type is FIXED: value must be <= subtotal
   - Ensure discount doesn't exceed cart value

8. **Add discount calculation method**
   - Method: `calculate_cart_discount()`
   - Calculate discount based on type and value
   - PERCENT: subtotal × (value / 100)
   - FIXED: value directly
   - Update cart_discount_amount field

9. **Add discount display properties**
   - Property: `formatted_cart_discount` returns "10% (₨125.00)"
   - Property: `has_cart_discount` returns boolean
   - Show both type and calculated amount

### Cart Discount Types

```
┌────────────────────────────────────────────────┐
│            Cart Discount Types                  │
└────────────────────────────────────────────────┘

1. PERCENT Discount:
   ┌──────────────────────────┐
   │ Subtotal:     ₨2,500.00  │
   │ Discount:     10%         │
   │ Amount:       ₨250.00     │
   │ After:        ₨2,250.00   │
   └──────────────────────────┘

2. FIXED Discount:
   ┌──────────────────────────┐
   │ Subtotal:     ₨2,500.00  │
   │ Discount:     ₨500.00     │
   │ Amount:       ₨500.00     │
   │ After:        ₨2,000.00   │
   └──────────────────────────┘
```

### Discount Application Flow

```
┌────────────────────────────────────────────────┐
│        Cart Discount Application                │
└────────────────────────────────────────────────┘

[Calculate Line Totals]
         │
         ▼
   ┌──────────┐
   │ Subtotal │ = ₨2,500.00
   └──────────┘
         │
         ▼
[Check Cart Discount Type]
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[PERCENT]  [FIXED]
    │         │
    │         │
    ▼         ▼
  10% off   ₨500 off
    │         │
    │         │
    ▼         ▼
 ₨250.00   ₨500.00
    │         │
    └────┬────┘
         │
         ▼
  ┌──────────────┐
  │ Discount Amt │
  └──────────────┘
         │
         ▼
[Discounted Subtotal]
  ₨2,500 - ₨250 = ₨2,250
```

### Field Specifications

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| **cart_discount_type** | CharField | Discount type | 'PERCENT' |
| **cart_discount_value** | DecimalField | Discount value | 10.00 |
| **cart_discount_reason** | CharField | Discount reason | 'New Year Sale' |
| **coupon_code** | CharField | Coupon code | 'NEWYEAR10' |
| **cart_discount_amount** | DecimalField | Calculated amount | 250.00 |

### Discount Validation Rules

```python
def clean(self):
    """Validate cart discount fields"""
    super().clean()
    
    if self.cart_discount_type:
        if self.cart_discount_type == 'PERCENT':
            # Percentage must be 0-100
            if not (0 <= self.cart_discount_value <= 100):
                raise ValidationError({
                    'cart_discount_value': 
                    'Percentage must be between 0 and 100'
                })
        
        elif self.cart_discount_type == 'FIXED':
            # Fixed discount cannot exceed subtotal
            if self.cart_discount_value > self.subtotal:
                raise ValidationError({
                    'cart_discount_value': 
                    'Discount cannot exceed subtotal'
                })
```

### Discount Calculation Method

```python
def calculate_cart_discount(self):
    """Calculate cart discount amount"""
    if not self.cart_discount_type or not self.cart_discount_value:
        self.cart_discount_amount = Decimal('0.00')
        return self.cart_discount_amount
    
    if self.cart_discount_type == 'PERCENT':
        # Calculate percentage of subtotal
        discount = self.subtotal * (self.cart_discount_value / 100)
    else:  # FIXED
        # Use fixed amount directly
        discount = self.cart_discount_value
    
    # Round to 2 decimal places
    self.cart_discount_amount = discount.quantize(
        Decimal('0.01'), 
        rounding=ROUND_HALF_UP
    )
    
    return self.cart_discount_amount
```

### Discount Display Properties

```python
@property
def formatted_cart_discount(self):
    """Format cart discount for display"""
    if not self.cart_discount_type:
        return "No discount"
    
    if self.cart_discount_type == 'PERCENT':
        return f"{self.cart_discount_value}% (₨ {self.cart_discount_amount:,.2f})"
    else:  # FIXED
        return f"₨ {self.cart_discount_amount:,.2f}"

@property
def has_cart_discount(self):
    """Check if cart has a discount"""
    return bool(self.cart_discount_type and self.cart_discount_value)
```

### Business Rules

1. **Discount Types**
   - PERCENT: Value represents percentage (0-100)
   - FIXED: Value represents absolute amount in LKR
   - Only one type per cart

2. **Discount Priority**
   - Line item discounts applied first
   - Cart discount applied to subtotal after line discounts
   - Total discount = line discounts + cart discount

3. **Validation**
   - Percent: 0-100 range
   - Fixed: Cannot exceed subtotal
   - All discounts must result in non-negative total

4. **Tracking**
   - Reason field for audit trail
   - Coupon code links to promotion system
   - Calculated amount stored for reporting

### Discount Examples

```
Example 1: Percentage Discount
Cart:
  - Subtotal: ₨2,500.00
  - Discount Type: PERCENT
  - Discount Value: 10.00
  - Discount Amount: ₨250.00
  - After Discount: ₨2,250.00

Example 2: Fixed Discount
Cart:
  - Subtotal: ₨2,500.00
  - Discount Type: FIXED
  - Discount Value: 500.00
  - Discount Amount: ₨500.00
  - After Discount: ₨2,000.00

Example 3: Coupon Code
Cart:
  - Subtotal: ₨3,000.00
  - Coupon Code: SAVE15
  - Discount Type: PERCENT
  - Discount Value: 15.00
  - Discount Reason: "Loyalty Coupon"
  - Discount Amount: ₨450.00
  - After Discount: ₨2,550.00
```

### Expected Outcome
```python
# In apps/pos/constants.py:
DISCOUNT_TYPE_PERCENT = 'PERCENT'
DISCOUNT_TYPE_FIXED = 'FIXED'
DISCOUNT_TYPE_CHOICES = (
    (DISCOUNT_TYPE_PERCENT, 'Percentage'),
    (DISCOUNT_TYPE_FIXED, 'Fixed Amount'),
)

# In POSCart model:
cart_discount_type = models.CharField(max_length=10, choices=..., null=True)
cart_discount_value = models.DecimalField(max_digits=10, decimal_places=2, null=True)
cart_discount_reason = models.CharField(max_length=200, null=True, blank=True)
coupon_code = models.CharField(max_length=50, null=True, blank=True, db_index=True)
cart_discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

def calculate_cart_discount(self):
    # Implementation
    pass

@property
def formatted_cart_discount(self):
    # Implementation
    pass
```

### Verification Checklist
- [ ] Discount type constants added to constants.py
- [ ] cart_discount_type field added with choices
- [ ] cart_discount_value field added
- [ ] cart_discount_reason field added
- [ ] coupon_code field added with db_index
- [ ] cart_discount_amount field added
- [ ] Validation logic added to clean method
- [ ] calculate_cart_discount method implemented
- [ ] formatted_cart_discount property added
- [ ] has_cart_discount property added
- [ ] Both PERCENT and FIXED types supported

---

## Summary

This document covered the foundational structure for cart management:

### Completed Tasks
1. ✅ Task 19: Cart submodule structure created
2. ✅ Task 20: Cart status constants defined (ACTIVE, HELD, COMPLETED, VOIDED, ABANDONED)
3. ✅ Task 21: POSCart model created with session and customer links
4. ✅ Task 22: Auto-generated reference number (POS-YYYY-TERM-NNNNNN)
5. ✅ Task 23: Timestamp fields for lifecycle tracking
6. ✅ Task 24: Cart totals fields (subtotal, discount_total, tax_total, grand_total)
7. ✅ Task 25: Cart-level discount fields (type, value, reason, coupon)

### Key Deliverables
```
apps/pos/
├── cart/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── pos_cart.py        # POSCart model with all fields
│   └── services/
│       └── __init__.py
└── constants.py                # Cart status and discount constants
```

### Next Steps
Proceed to [02_Tasks-26-31_Cart-Items-Model.md](02_Tasks-26-31_Cart-Items-Model.md) to implement:
- POSCartItem model
- Line item quantity and pricing
- Line-level discounts
- Item tax fields

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [02_Tasks-26-31_Cart-Items-Model.md](02_Tasks-26-31_Cart-Items-Model.md)
