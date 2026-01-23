# Tasks 01-06: App Setup & Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** A - Quote Model & Status System  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Financial-Metadata-Discount.md](02_Tasks-07-12_Financial-Metadata-Discount.md)
- **← Previous Group:** [../SubPhase-03_Customer-Supplier-Management/](../../SubPhase-03_Customer-Supplier-Management/)

---

## Document Overview

This document covers the initial setup of the quotes Django app, including app creation, registration in the tenant schema, status choices definition, and core model fields for quote management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create quotes Django App | Low | 15 min |
| 02 | Register quotes App | Low | 10 min |
| 03 | Define QuoteStatus Choices | Low | 15 min |
| 04 | Create Quote Model Core Fields | Medium | 25 min |
| 05 | Add Quote Customer Fields | Medium | 20 min |
| 06 | Add Quote Date Fields | Medium | 20 min |

---

## Task 01: Create quotes Django App

### Overview
Create a new Django app named `quotes` to house the quote management functionality with models, services, views, serializers, and utilities.

### Dependencies
- Django project must exist
- apps/ directory structure in place

### Instructions

1. **Navigate to apps directory**
   - Change to `apps/` directory in the backend project

2. **Create Django app using management command**
   - Run Django startapp command for `quotes`
   - Creates basic app structure with default files

3. **Create models package**
   - Delete default `models.py` file
   - Create `models/` directory
   - Create `models/__init__.py` file

4. **Create services directory**
   - Create `services/` directory for business logic
   - Create `services/__init__.py` file

5. **Create serializers directory**
   - Create `serializers/` directory for DRF serializers
   - Create `serializers/__init__.py` file

6. **Create views directory**
   - Create `views/` directory for API views
   - Create `views/__init__.py` file

7. **Create utils directory**
   - Create `utils/` directory for helper functions
   - Create `utils/__init__.py` file

8. **Create constants file**
   - Create `constants.py` file for app-level constants
   - Include module-level docstring

9. **Update apps.py configuration**
   - Set `name = 'apps.quotes'`
   - Set `verbose_name = 'Quote Management'`
   - Add app description in docstring

10. **Create tests directory structure**
    - Create `tests/` directory
    - Create `tests/__init__.py` file
    - Create `tests/test_models.py` placeholder
    - Create `tests/test_services.py` placeholder
    - Create `tests/test_views.py` placeholder

### Expected Directory Structure
```
apps/quotes/
├── __init__.py
├── apps.py                  # Updated configuration
├── constants.py             # App-level constants
├── admin.py                 # Django admin (keep empty for now)
├── models/
│   └── __init__.py
├── services/
│   └── __init__.py
├── serializers/
│   └── __init__.py
├── views/
│   └── __init__.py
├── utils/
│   └── __init__.py
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_services.py
    └── test_views.py
```

### apps.py Configuration Structure
| Element | Value |
|---------|-------|
| `name` | `apps.quotes` |
| `verbose_name` | `Quote Management` |
| `default_auto_field` | `django.db.models.BigAutoField` |

### Verification Checklist
- [ ] `apps/quotes/` directory exists
- [ ] All package directories have `__init__.py` files
- [ ] `apps.py` has correct app name and verbose name
- [ ] `constants.py` file exists
- [ ] `models/` directory is a package (not single file)
- [ ] `services/`, `serializers/`, `views/`, `utils/` directories exist
- [ ] `tests/` directory with placeholder files exists

---

## Task 02: Register quotes App

### Overview
Register the quotes app in the TENANT_APPS setting so it's available in each tenant's schema.

### Dependencies
- Task 01: Create quotes Django App
- Django settings configuration exists

### Instructions

1. **Locate tenant apps configuration**
   - Find `TENANT_APPS` list in Django settings
   - Usually in `backend/config/settings/base.py` or similar

2. **Add quotes to TENANT_APPS**
   - Add `'apps.quotes'` to the TENANT_APPS list
   - Place after customer/supplier apps if they exist
   - Maintain alphabetical or logical order

3. **Verify shared apps separation**
   - Ensure quotes is NOT in SHARED_APPS
   - Confirm tenant-specific placement

4. **Add to INSTALLED_APPS (if separate)**
   - If INSTALLED_APPS combines both, ensure proper order
   - Place after other ERP apps

### TENANT_APPS Placement
The quotes app should appear in TENANT_APPS after core apps but before advanced modules:

| Order | App | Purpose |
|-------|-----|---------|
| ... | `apps.customers` | Customer management |
| ... | `apps.suppliers` | Supplier management |
| → | `apps.quotes` | Quote management (NEW) |
| ... | `apps.orders` | Sales orders |
| ... | `apps.invoices` | Invoicing |

### Multi-Tenancy Considerations
- **Tenant-Specific Data:** Each quote belongs to a specific tenant
- **Schema Isolation:** Quote data isolated per tenant schema
- **No Shared Quotes:** Quotes never shared across tenants
- **Migrations:** Will run for each tenant schema

### Expected Settings Structure
```python
TENANT_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    
    # Core tenant apps
    'apps.customers',
    'apps.suppliers',
    'apps.quotes',  # <-- Added here
    
    # Additional tenant apps
    # ...
]
```

### Verification Checklist
- [ ] `apps.quotes` added to TENANT_APPS list
- [ ] Not present in SHARED_APPS list
- [ ] Proper ordering maintained
- [ ] Settings file syntax is valid
- [ ] No duplicate entries

---

## Task 03: Define QuoteStatus Choices

### Overview
Define the QuoteStatus choices class that represents all possible states a quote can be in throughout its lifecycle.

### Dependencies
- Task 01: Create quotes Django App

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/quotes/constants.py`

2. **Import TextChoices from Django**
   - Import `from django.db import models`

3. **Create QuoteStatus class**
   - Define class inheriting from `models.TextChoices`
   - Add module docstring explaining quote lifecycle

4. **Define DRAFT status**
   - Value: `'DRAFT'`
   - Label: `'Draft'`
   - Description: Initial editable state

5. **Define SENT status**
   - Value: `'SENT'`
   - Label: `'Sent'`
   - Description: Sent to customer, locked for editing

6. **Define ACCEPTED status**
   - Value: `'ACCEPTED'`
   - Label: `'Accepted'`
   - Description: Customer accepted the quote

7. **Define REJECTED status**
   - Value: `'REJECTED'`
   - Label: `'Rejected'`
   - Description: Customer rejected the quote

8. **Define EXPIRED status**
   - Value: `'EXPIRED'`
   - Label: `'Expired'`
   - Description: Quote validity period has passed

9. **Define CONVERTED status**
   - Value: `'CONVERTED'`
   - Label: `'Converted'`
   - Description: Quote converted to sales order

10. **Add docstring for status choices**
    - Explain each status meaning
    - Document allowed transitions
    - Note terminal states (cannot transition further)

### Status Lifecycle Flow

```
┌─────────┐
│  DRAFT  │ ──────────────────────┐
└────┬────┘                       │
     │                             │
     │ Send to customer            │
     │                             │
     ▼                             │
┌─────────┐    Customer accepts   │
│  SENT   │ ─────────────┐        │
└────┬────┘              │        │
     │                   ▼        │
     │              ┌──────────┐  │
     │              │ ACCEPTED │  │
     │              └────┬─────┘  │
     │                   │        │
     │                   │ Convert to order
     │                   │        │
     │                   ▼        │
     │              ┌───────────┐ │
     │              │ CONVERTED │ │ (Terminal)
     │              └───────────┘ │
     │                             │
     │ Customer rejects            │
     ├──────────────┐              │
     │              ▼              │
     │         ┌──────────┐        │
     │         │ REJECTED │        │ (Terminal)
     │         └──────────┘        │
     │                             │
     │ Validity expires            │
     └──────────────┐              │
                    ▼              │
               ┌─────────┐         │
               │ EXPIRED │         │ (Terminal)
               └─────────┘         │
                                   │
                   Manual expiry ──┘
```

### Status Transition Matrix

| From State | Allowed Transitions | Business Logic |
|------------|---------------------|----------------|
| DRAFT | SENT, EXPIRED | Can send or manually expire |
| SENT | ACCEPTED, REJECTED, EXPIRED | Awaiting customer response |
| ACCEPTED | CONVERTED | Ready for order conversion |
| REJECTED | (none) | Terminal state |
| EXPIRED | (none) | Terminal state |
| CONVERTED | (none) | Terminal state |

### Terminal States
States that cannot transition to any other state:
- **REJECTED:** Customer declined the quote
- **EXPIRED:** Validity period passed
- **CONVERTED:** Successfully converted to order

### Status Properties

| Status | Editable? | Can Send? | Can Convert? | Auto-Transition |
|--------|-----------|-----------|--------------|-----------------|
| DRAFT | ✓ Yes | ✓ Yes | ✗ No | None |
| SENT | ✗ No | ✗ No | ✗ No | → EXPIRED (on valid_until) |
| ACCEPTED | ✗ No | ✗ No | ✓ Yes | None |
| REJECTED | ✗ No | ✗ No | ✗ No | None |
| EXPIRED | ✗ No | ✗ No | ✗ No | None |
| CONVERTED | ✗ No | ✗ No | ✗ No | None |

### Expected constants.py Structure
```python
"""
Quote Management Constants

Defines choices, constants, and configuration values for the quotes app.
"""

from django.db import models


class QuoteStatus(models.TextChoices):
    """
    Quote lifecycle status choices.
    
    Status Flow:
        DRAFT → SENT → ACCEPTED → CONVERTED
                   ↓         ↓
              REJECTED   EXPIRED
    
    Terminal States: REJECTED, EXPIRED, CONVERTED
    """
    DRAFT = 'DRAFT', 'Draft'
    SENT = 'SENT', 'Sent'
    ACCEPTED = 'ACCEPTED', 'Accepted'
    REJECTED = 'REJECTED', 'Rejected'
    EXPIRED = 'EXPIRED', 'Expired'
    CONVERTED = 'CONVERTED', 'Converted'
```

### Verification Checklist
- [ ] `QuoteStatus` class defined in `constants.py`
- [ ] Inherits from `models.TextChoices`
- [ ] All 6 status values defined
- [ ] Each status has value and label
- [ ] Docstring explains lifecycle and transitions
- [ ] Terminal states documented

---

## Task 04: Create Quote Model Core Fields

### Overview
Create the Quote model with core identification and tracking fields including quote_number, status, title, and timestamps.

### Dependencies
- Task 01: Create quotes Django App
- Task 03: Define QuoteStatus Choices

### Instructions

1. **Create quote.py in models directory**
   - Navigate to `apps/quotes/models/`
   - Create `quote.py` file

2. **Import required dependencies**
   - Import Django model classes and field types
   - Import QuoteStatus from constants
   - Import UUID for unique identifiers
   - Import timezone utilities

3. **Create Quote model class**
   - Inherit from `models.Model`
   - Add comprehensive model docstring

4. **Add id field**
   - Use UUIDField as primary key
   - Set `default=uuid.uuid4`
   - Set `editable=False`

5. **Add quote_number field**
   - CharField with max_length=20
   - Set `unique=True`
   - Set `blank=True` (auto-generated)
   - Add db_index=True for performance

6. **Add status field**
   - CharField with choices=QuoteStatus.choices
   - Set `default=QuoteStatus.DRAFT`
   - Set max_length=20
   - Add db_index=True for filtering

7. **Add title field**
   - CharField with max_length=200
   - Set `blank=True, null=True`
   - Optional descriptive title for quote

8. **Add created_at field**
   - DateTimeField with `auto_now_add=True`
   - Tracks quote creation timestamp
   - Add db_index=True for sorting

9. **Add updated_at field**
   - DateTimeField with `auto_now=True`
   - Tracks last modification timestamp

10. **Add Meta class**
    - Set `db_table = 'quotes'`
    - Set `verbose_name = 'Quote'`
    - Set `verbose_name_plural = 'Quotes'`
    - Set `ordering = ['-created_at']` (newest first)

11. **Add __str__ method**
    - Return quote_number or "New Quote" if not yet saved
    - Format: "QT-2026-00001" or "New Quote"

12. **Add __repr__ method**
    - Return technical representation
    - Include quote_number and status

13. **Update models/__init__.py**
    - Import Quote model
    - Add to `__all__` list for clean imports

### Core Model Fields Reference

| Field | Type | Purpose | Indexed? |
|-------|------|---------|----------|
| `id` | UUIDField | Primary key, globally unique | Yes (PK) |
| `quote_number` | CharField | Human-readable identifier | Yes |
| `status` | CharField | Current lifecycle status | Yes |
| `title` | CharField | Optional descriptive title | No |
| `created_at` | DateTimeField | Creation timestamp | Yes |
| `updated_at` | DateTimeField | Last modification timestamp | No |

### Quote Number Format

```
Format: QT-{YEAR}-{SEQUENCE}

Examples:
- QT-2026-00001
- QT-2026-00142
- QT-2027-00001  (resets yearly)

Components:
- Prefix: "QT" (fixed)
- Year: 4-digit current year
- Sequence: 5-digit zero-padded number
```

### UUID vs Auto-Increment ID

| Aspect | UUID | Auto-Increment |
|--------|------|----------------|
| Uniqueness | Globally unique | Tenant-unique only |
| Predictability | Unpredictable | Sequential, predictable |
| URL Exposure | Safe to expose | Reveals record count |
| Migration | Easy to merge | Conflicts possible |
| Performance | Slightly slower | Faster |
| **Choice** | ✓ Use UUID | Not used |

### Model Inheritance Strategy
- **Direct from models.Model:** No shared base class for now
- **Future Enhancement:** May add BaseModel with common fields
- **Tenant Isolation:** Handled by django-tenants at middleware level

### Expected quote.py Structure
```python
"""
Quote Model

Represents a sales quote/quotation in the system.
"""

import uuid
from django.db import models
from django.utils import timezone

from apps.quotes.constants import QuoteStatus


class Quote(models.Model):
    """
    Sales Quote Model
    
    Represents a quotation sent to customers with pricing and terms.
    Tracks lifecycle from draft through sending, acceptance, and conversion.
    """
    
    # Core identification
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    quote_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        db_index=True,
        help_text="Auto-generated quote number (QT-YYYY-NNNNN)"
    )
    
    status = models.CharField(
        max_length=20,
        choices=QuoteStatus.choices,
        default=QuoteStatus.DRAFT,
        db_index=True,
        help_text="Current status of the quote"
    )
    
    title = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Optional descriptive title for the quote"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )
    
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'quotes'
        verbose_name = 'Quote'
        verbose_name_plural = 'Quotes'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.quote_number or "New Quote"
    
    def __repr__(self):
        return f"<Quote: {self.quote_number} ({self.status})>"
```

### Verification Checklist
- [ ] `quote.py` file created in `models/` directory
- [ ] Quote model class defined
- [ ] UUID primary key field added
- [ ] quote_number field with unique constraint
- [ ] status field with QuoteStatus choices
- [ ] title field (optional)
- [ ] created_at and updated_at timestamps
- [ ] Meta class with db_table and ordering
- [ ] `__str__` and `__repr__` methods implemented
- [ ] Model imported in `models/__init__.py`

---

## Task 05: Add Quote Customer Fields

### Overview
Add fields to link the quote to a customer or store guest customer details when the quote is for a non-registered customer.

### Dependencies
- Task 04: Create Quote Model Core Fields
- Customer model must exist in apps.customers

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Import Customer model**
   - Add import: `from apps.customers.models import Customer`

3. **Add customer foreign key field**
   - ForeignKey to Customer model
   - Set `on_delete=models.PROTECT` (cannot delete customer with quotes)
   - Set `related_name='quotes'`
   - Set `null=True, blank=True`
   - Add db_index=True for filtering

4. **Add guest_name field**
   - CharField with max_length=100
   - Set `blank=True, null=True`
   - For quotes to non-registered customers

5. **Add guest_email field**
   - EmailField
   - Set `blank=True, null=True`
   - For sending quote to guest customers

6. **Add guest_phone field**
   - CharField with max_length=20
   - Set `blank=True, null=True`
   - For contacting guest customers

7. **Add guest_company field**
   - CharField with max_length=150
   - Set `blank=True, null=True`
   - Optional company name for B2B guests

8. **Add help_text to fields**
   - Document when to use customer vs guest fields
   - Explain validation logic

9. **Add field documentation in docstring**
   - Explain customer vs guest quote scenarios
   - Document required field combinations

### Customer Relationship Options

| Scenario | customer | guest_name | guest_email | guest_phone |
|----------|----------|------------|-------------|-------------|
| Registered Customer | ✓ Required | Empty | Empty | Empty |
| Guest Customer | Empty | ✓ Required | ✓ Required | Optional |
| Walk-in Quote | Empty | Optional | Empty | Optional |

### Field Validation Logic

**Rule 1:** Either `customer` OR `guest_name` must be provided
- Cannot have both empty
- Cannot have both filled (choose one approach)

**Rule 2:** If guest_name provided, guest_email should be provided
- For sending quote PDF via email
- Phone is optional backup contact

**Rule 3:** If customer provided, guest fields ignored
- Use customer.name, customer.email from FK
- Guest fields should remain empty

### Customer Foreign Key Behavior

| Action | Behavior | Reasoning |
|--------|----------|-----------|
| Delete Customer | PROTECT | Cannot delete customer with existing quotes |
| Update Customer | CASCADE | Quote references updated automatically |
| Customer.quotes | Access all quotes | Reverse relationship available |

### Guest vs Registered Customer Use Cases

**Registered Customer Quotes:**
- Customer has account in system
- Full customer history available
- Can view quotes in customer portal
- Automatic contact info from customer record

**Guest Customer Quotes:**
- One-time or preliminary quotes
- Customer doesn't want to register yet
- Quick quote generation
- No access to customer portal
- May convert to registered customer later

### Sri Lanka Context
- **Guest Names:** Support Sinhala Unicode characters
- **Phone Format:** Support LK format (+94 XX XXX XXXX)
- **Company Names:** Common for B2B quotes in LK market
- **Email Optional:** Phone primary contact in some cases

### Expected Field Additions
```python
# Customer relationship (in Quote model)
customer = models.ForeignKey(
    'customers.Customer',
    on_delete=models.PROTECT,
    related_name='quotes',
    null=True,
    blank=True,
    db_index=True,
    help_text="Registered customer for this quote"
)

# Guest customer details (alternative to customer FK)
guest_name = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    help_text="Name for guest customer (if not registered)"
)

guest_email = models.EmailField(
    blank=True,
    null=True,
    help_text="Email for guest customer"
)

guest_phone = models.CharField(
    max_length=20,
    blank=True,
    null=True,
    help_text="Phone for guest customer"
)

guest_company = models.CharField(
    max_length=150,
    blank=True,
    null=True,
    help_text="Company name for B2B guest customers"
)
```

### Verification Checklist
- [ ] Customer ForeignKey field added
- [ ] `on_delete=models.PROTECT` set
- [ ] `related_name='quotes'` set
- [ ] guest_name field added (CharField)
- [ ] guest_email field added (EmailField)
- [ ] guest_phone field added (CharField)
- [ ] guest_company field added (CharField)
- [ ] All guest fields are nullable
- [ ] help_text added to all fields
- [ ] Customer model import added

---

## Task 06: Add Quote Date Fields

### Overview
Add date fields to track quote validity period and status change timestamps throughout the quote lifecycle.

### Dependencies
- Task 04: Create Quote Model Core Fields

### Instructions

1. **Open quote.py model file**
   - Navigate to `apps/quotes/models/quote.py`

2. **Add issue_date field**
   - DateField for when quote was created/issued
   - Set `default=timezone.now().date`
   - Add db_index=True for filtering
   - Represents the quote creation date

3. **Add valid_until field**
   - DateField for quote expiry date
   - Set `null=True, blank=True`
   - Add db_index=True for expiry checking
   - Represents when the quote becomes invalid

4. **Add sent_at field**
   - DateTimeField for when quote was sent to customer
   - Set `null=True, blank=True`
   - Tracks DRAFT → SENT transition

5. **Add accepted_at field**
   - DateTimeField for when customer accepted quote
   - Set `null=True, blank=True`
   - Tracks SENT → ACCEPTED transition

6. **Add rejected_at field**
   - DateTimeField for when customer rejected quote
   - Set `null=True, blank=True`
   - Tracks SENT → REJECTED transition

7. **Add expired_at field**
   - DateTimeField for when quote expired
   - Set `null=True, blank=True`
   - Tracks automatic or manual expiry

8. **Add converted_at field**
   - DateTimeField for when quote was converted to order
   - Set `null=True, blank=True`
   - Tracks ACCEPTED → CONVERTED transition

9. **Add help_text to all date fields**
   - Explain field purpose
   - Document auto-population timing

10. **Add field grouping comment**
    - Group date fields with comment header
    - Improve code organization

### Date Field Categories

| Category | Fields | Purpose |
|----------|--------|---------|
| **Issue Dates** | issue_date, valid_until | Quote validity period |
| **Status Timestamps** | sent_at, accepted_at, rejected_at, expired_at, converted_at | Track status changes |
| **Auto Timestamps** | created_at, updated_at | System tracking |

### Date vs DateTime Usage

| Field Type | When to Use | Example Fields |
|------------|-------------|----------------|
| **DateField** | Business dates, no time needed | issue_date, valid_until |
| **DateTimeField** | Precise timestamps, audit trail | sent_at, accepted_at, created_at |

### Default Validity Period
Common validity periods for quotes:
- **30 days:** Standard validity (most common)
- **15 days:** Short-term quotes
- **60 days:** Long-term quotes
- **90 days:** Project quotes

**Calculation:** `valid_until = issue_date + timedelta(days=30)`

### Status Timestamp Population

| Status Change | Timestamp Field | When Set |
|---------------|----------------|----------|
| DRAFT → SENT | sent_at | Quote sent to customer |
| SENT → ACCEPTED | accepted_at | Customer accepts |
| SENT → REJECTED | rejected_at | Customer rejects |
| ANY → EXPIRED | expired_at | Manual or auto expiry |
| ACCEPTED → CONVERTED | converted_at | Converted to order |

### Expiry Logic Flow

```
┌─────────────────────────────────────────┐
│ Nightly Cron Job: Check Quote Expiry   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────┐
    │ Query: status=SENT              │
    │    AND valid_until < today      │
    │    AND expired_at IS NULL       │
    └──────────────┬──────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │ For each quote:     │
         │ - status = EXPIRED  │
         │ - expired_at = now()│
         └─────────────────────┘
```

### Date Field Validation Rules

| Validation | Rule | Enforced Where |
|------------|------|----------------|
| valid_until > issue_date | End date must be after start | Model clean() |
| sent_at ≥ created_at | Cannot send before creation | Service layer |
| accepted_at > sent_at | Cannot accept before sending | Service layer |
| converted_at > accepted_at | Cannot convert before acceptance | Service layer |

### Sri Lanka Context
- **Timezone:** Asia/Colombo (UTC+5:30)
- **Date Format:** DD/MM/YYYY preferred in UI
- **Business Days:** Monday-Friday (Saturday half-day)
- **Holidays:** Poya days and public holidays affect validity

### Expected Field Additions
```python
# Date fields (in Quote model)

# Quote validity period
issue_date = models.DateField(
    default=timezone.now,
    db_index=True,
    help_text="Date when quote was issued"
)

valid_until = models.DateField(
    null=True,
    blank=True,
    db_index=True,
    help_text="Date when quote expires"
)

# Status change timestamps
sent_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when quote was sent to customer"
)

accepted_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when customer accepted quote"
)

rejected_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when customer rejected quote"
)

expired_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when quote expired"
)

converted_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when quote was converted to order"
)
```

### Verification Checklist
- [ ] issue_date field added (DateField with default)
- [ ] valid_until field added (DateField, nullable)
- [ ] sent_at field added (DateTimeField, nullable)
- [ ] accepted_at field added (DateTimeField, nullable)
- [ ] rejected_at field added (DateTimeField, nullable)
- [ ] expired_at field added (DateTimeField, nullable)
- [ ] converted_at field added (DateTimeField, nullable)
- [ ] db_index=True on issue_date and valid_until
- [ ] help_text added to all fields
- [ ] Fields logically grouped with comments

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create quotes Django App | Complete app structure with directories |
| 02 | Register quotes App | Added to TENANT_APPS configuration |
| 03 | Define QuoteStatus Choices | QuoteStatus enum with 6 lifecycle states |
| 04 | Create Quote Model Core Fields | Quote model with UUID, number, status, title |
| 05 | Add Quote Customer Fields | Customer FK and guest customer fields |
| 06 | Add Quote Date Fields | Issue date, validity, and status timestamps |

### Current Quote Model Structure
```python
class Quote(models.Model):
    # Core identification
    id                # UUIDField (PK)
    quote_number      # CharField (unique, indexed)
    status            # CharField (choices, indexed)
    title             # CharField (optional)
    
    # Customer relationship
    customer          # FK to Customer (PROTECT)
    guest_name        # CharField (optional)
    guest_email       # EmailField (optional)
    guest_phone       # CharField (optional)
    guest_company     # CharField (optional)
    
    # Date tracking
    issue_date        # DateField (indexed)
    valid_until       # DateField (indexed)
    sent_at           # DateTimeField (nullable)
    accepted_at       # DateTimeField (nullable)
    rejected_at       # DateTimeField (nullable)
    expired_at        # DateTimeField (nullable)
    converted_at      # DateTimeField (nullable)
    created_at        # DateTimeField (auto)
    updated_at        # DateTimeField (auto)
```

### Quote Model Capabilities (So Far)
✅ Unique identification with UUID and quote number  
✅ Lifecycle status tracking with 6 states  
✅ Support for both registered and guest customers  
✅ Complete date tracking for quote validity  
✅ Status change audit trail  
✅ Proper database indexing for performance  

### Still To Come
- Financial fields (subtotal, discount, tax, total) - Task 07
- Metadata fields (notes, terms, tags) - Task 08
- User references (created_by, sent_by) - Task 09
- Currency support - Task 10
- Discount configuration - Task 11
- Quote number auto-generation - Task 12
- PDF storage - Task 13
- Email tracking - Task 14
- Order conversion reference - Task 15
- Database indexes - Task 16
- Model constraints - Task 17
- Migrations - Task 18

### Next Steps
Proceed to [02_Tasks-07-12_Financial-Metadata-Discount.md](02_Tasks-07-12_Financial-Metadata-Discount.md) to add financial calculation fields, metadata, user references, currency support, discount configuration, and quote number generation.

---

## Notes for AI Agents

1. **No Migrations Yet:** Do not run makemigrations/migrate until Task 18
2. **Import Order:** Follow Django best practices for import organization
3. **Field Help Text:** Always include for API documentation
4. **Database Indexes:** Added strategically for common queries
5. **Null vs Blank:** Use both for optional fields in this model
6. **UUID Primary Key:** Preferred over auto-increment for multi-tenant
7. **Status Timestamps:** Set programmatically in service layer, not model
8. **Guest Validation:** Implement in model clean() method or serializer
9. **Date Validation:** valid_until > issue_date check in model clean()
10. **Sri Lanka Support:** Ensure CharField max_length supports Unicode
