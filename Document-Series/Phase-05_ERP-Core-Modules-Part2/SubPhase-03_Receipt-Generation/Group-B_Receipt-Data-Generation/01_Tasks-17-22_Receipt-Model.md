# Tasks 17-22: Receipt Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** B - Receipt Data Generation  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-28_Builder-Items-Totals.md](02_Tasks-23-28_Builder-Items-Totals.md)
- **← Previous Group:** [../Group-A_Receipt-Template-Models/](../Group-A_Receipt-Template-Models/)

---

## Document Overview

This document covers the creation of the Receipt model, which stores generated receipt data for each transaction. The receipt model acts as an archival system, preserving complete receipt information for reprinting, emailing, and auditing purposes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Receipt model | Medium | 30 min |
| 18 | Add receipt reference field | Medium | 20 min |
| 19 | Add transaction links | Low | 15 min |
| 20 | Add receipt type field | Low | 15 min |
| 21 | Add generation timestamp | Low | 15 min |
| 22 | Add receipt data JSON | Medium | 20 min |

---

## Task 17: Create Receipt Model

### Overview
Create the Receipt model to store all generated receipts with complete metadata and archival data. Each receipt is linked to a cart/transaction and preserves the exact receipt content at the time of generation.

### Dependencies
- POSCart model exists
- Receipt app is created
- Django models framework is available

### Instructions

1. **Create the model file**
   - Navigate to `apps/pos/receipts/models/` directory
   - Create `receipt.py` file
   - Import necessary Django components

2. **Define the Receipt model class**
   - Inherit from `TenantAwareModel` for multi-tenancy
   - Include all standard mixins (TimestampMixin, SoftDeleteMixin)
   - Define model name as `Receipt`

3. **Define model Meta options**
   - Set `db_table = 'pos_receipts'`
   - Set `verbose_name = 'Receipt'`
   - Set `verbose_name_plural = 'Receipts'`
   - Add `ordering = ['-generated_at']` for newest first

4. **Define default manager**
   - Use custom manager that respects tenant isolation
   - Implement QuerySet for receipt-specific filters
   - Add methods: `for_cart()`, `for_transaction()`, `by_type()`

5. **Add basic model structure**
   - Create primary key field (UUID)
   - Add basic field placeholders for next tasks
   - Prepare for relationships

6. **Set up model registration**
   - Register model in `models/__init__.py`
   - Export model for external use

### Model Structure Overview

```
Receipt Model
├── Identity Fields
│   ├── id (UUID primary key)
│   └── receipt_number (unique identifier) → Task 18
├── Relationship Fields
│   ├── cart (FK to POSCart) → Task 19
│   └── transaction_id (UUID reference) → Task 19
├── Classification Fields
│   └── receipt_type (CHOICE field) → Task 20
├── Timestamp Fields
│   ├── generated_at → Task 21
│   ├── printed_at → Task 21
│   └── emailed_at → Task 21
├── Data Fields
│   └── receipt_data (JSONField) → Task 22
├── Audit Fields
│   ├── created_at (from TimestampMixin)
│   ├── modified_at (from TimestampMixin)
│   ├── created_by (user reference)
│   └── modified_by (user reference)
└── Duplicate Handling
    └── original_receipt (self-FK) → Task 34
```

### Multi-Tenancy Considerations

**Tenant Isolation:**
- Receipt belongs to tenant schema
- receipt_number is unique per tenant
- Query sets automatically filter by tenant
- Manager respects tenant context

**Cross-Tenant Protection:**
- Receipt queries scoped to current tenant
- Prevent access to other tenant receipts
- Unique constraints scoped to tenant

### Model Methods to Prepare

| Method | Purpose | Implementation Task |
|--------|---------|---------------------|
| `__str__()` | String representation | This task |
| `get_absolute_url()` | Detail view URL | This task |
| `can_reprint()` | Check if reprint allowed | Later |
| `mark_as_printed()` | Record print time | Later |
| `mark_as_emailed()` | Record email time | Later |
| `generate_duplicate()` | Create duplicate receipt | Task 34 |

### Expected Outcome

```
apps/pos/receipts/
├── models/
│   ├── __init__.py           # Export Receipt model
│   └── receipt.py            # Receipt model definition
```

### Verification Checklist
- [ ] `receipt.py` file created in models directory
- [ ] Receipt model inherits from TenantAwareModel
- [ ] Model includes all standard mixins
- [ ] Meta options are defined correctly
- [ ] Model is registered in `__init__.py`
- [ ] Basic structure is prepared for field additions
- [ ] Model respects tenant isolation

---

## Task 18: Add Receipt Reference Field

### Overview
Add the receipt_number field that provides a human-readable, unique identifier for each receipt. This number is used on printed receipts, in customer communications, and for lookup purposes.

### Dependencies
- Task 17: Create Receipt model

### Instructions

1. **Add receipt_number field to model**
   - Add CharField with max_length=50
   - Set unique=True for database constraint
   - Set editable=False to prevent manual editing
   - Add db_index=True for query performance

2. **Define field validation**
   - Add validators for format checking
   - Ensure format matches pattern: PREFIX-YYYYMMDD-SEQUENCE
   - Validate length and character set

3. **Add field help text**
   - Explain format: "Unique receipt identifier (auto-generated)"
   - Document format pattern
   - Note that it's read-only

4. **Document field behavior**
   - Auto-generated on save if not set
   - Format: REC-20260122-00042
   - Sequential per day per tenant
   - Cannot be changed after creation

### Receipt Number Format

**Format Pattern:**
```
{PREFIX}-{YYYYMMDD}-{SEQUENCE}

Components:
- PREFIX: "REC" (3 chars)
- YYYY: 4-digit year
- MM: 2-digit month
- DD: 2-digit day
- SEQUENCE: 5-digit daily counter (00001-99999)

Example: REC-20260122-00042
```

**Format Breakdown:**

| Component | Description | Example |
|-----------|-------------|---------|
| Prefix | Receipt identifier | REC |
| Separator | Hyphen | - |
| Date | YYYYMMDD format | 20260122 |
| Separator | Hyphen | - |
| Sequence | 5-digit daily counter | 00042 |

**Complete Format:** `REC-20260122-00042`

### Sequence Management

**Daily Reset:**
- Counter resets to 00001 each day
- Scoped to tenant
- Thread-safe incrementing
- Handles concurrent requests

**Sequence Flow:**
```
Day 1 (2026-01-22):
REC-20260122-00001
REC-20260122-00002
REC-20260122-00003

Day 2 (2026-01-23):
REC-20260123-00001  ← Reset to 00001
REC-20260123-00002
REC-20260123-00003
```

### Field Configuration

| Attribute | Value | Reason |
|-----------|-------|--------|
| field_type | CharField | Text identifier |
| max_length | 50 | Accommodate format + future expansion |
| unique | True | No duplicates in database |
| editable | False | Auto-generated only |
| db_index | True | Fast lookups |
| null | False | Always required |
| blank | False | Always required |

### Database Constraints

**Uniqueness:**
- Database-level unique constraint
- Prevents race conditions
- Error handling for conflicts

**Index Strategy:**
- Primary index on receipt_number
- Composite index with (tenant, generated_at)
- Support common query patterns

### Error Handling

**Duplicate Number Prevention:**
- Retry logic if number exists
- Max 5 retry attempts
- Raise exception if all retries fail

**Number Generation Failure:**
- Log error with context
- Fallback to timestamp-based UUID
- Alert admin for investigation

### Display and Formatting

**Display Format:**
- Show full format: REC-20260122-00042
- Use monospace font for receipts
- Include in search/filter interfaces

**Formatting Rules:**
- Always uppercase prefix
- Zero-pad sequence number
- Preserve hyphens for readability

### Expected Outcome

```python
# Model field added
receipt_number = models.CharField(
    max_length=50,
    unique=True,
    editable=False,
    db_index=True
)

# Example usage
receipt = Receipt.objects.get(receipt_number='REC-20260122-00042')
print(receipt.receipt_number)  # Output: REC-20260122-00042
```

### Verification Checklist
- [ ] receipt_number field added to Receipt model
- [ ] Field is unique and indexed
- [ ] Field is not editable in admin
- [ ] Help text explains auto-generation
- [ ] Format pattern is documented
- [ ] Sequence logic is planned (Task 33 will implement)
- [ ] Error handling is considered

---

## Task 19: Add Transaction Links

### Overview
Add fields that link the receipt to its source transaction data. This includes a foreign key to the POSCart and a UUID reference to the transaction record, enabling bidirectional lookups and data integrity.

### Dependencies
- Task 17: Create Receipt model
- POSCart model exists
- Transaction models exist

### Instructions

1. **Add cart foreign key field**
   - Add ForeignKey to POSCart model
   - Set related_name='receipts' for reverse lookup
   - Set on_delete=PROTECT to prevent cart deletion
   - Add db_index=True for query performance

2. **Add transaction_id UUID field**
   - Add UUIDField for transaction reference
   - Set null=True, blank=True (optional)
   - Add db_index=True for lookups
   - Store transaction UUID for external references

3. **Add field validation**
   - Validate cart belongs to same tenant
   - Validate transaction_id format if provided
   - Ensure cart is in completed state

4. **Add field help text**
   - cart: "The POS cart this receipt was generated from"
   - transaction_id: "External transaction identifier (optional)"

5. **Add related query methods**
   - Add manager method `for_cart(cart)`
   - Add manager method `for_transaction(transaction_id)`
   - Enable efficient filtering

6. **Define relationship behavior**
   - Cart deletion protection
   - Cascade considerations
   - Orphan handling

### Relationship Diagram

```
┌─────────────────┐
│    POSCart      │
│  (Transaction)  │
└────────┬────────┘
         │ 1
         │
         │ has many
         │
         │ N
┌────────▼────────┐
│     Receipt     │
│                 │
│ - cart (FK)     │
│ - transaction_id│
└─────────────────┘
```

**Relationship Flow:**
```
POSCart (id=123)
    ↓
    └── Cart completed and payment confirmed
         ↓
         └── Receipt generated
              ├── cart_id = 123 (FK)
              └── transaction_id = "abc-def-123" (UUID)
```

### Cart Foreign Key

**Field Configuration:**

| Attribute | Value | Reason |
|-----------|-------|--------|
| to | 'pos.POSCart' | Link to cart model |
| related_name | 'receipts' | Access receipts from cart |
| on_delete | PROTECT | Prevent cart deletion if receipt exists |
| db_index | True | Fast reverse lookups |
| null | False | Receipt must have cart |
| blank | False | Required field |

**Protection Behavior:**
```
cart.delete()  →  Error: Cannot delete cart with receipts
                   Must delete receipts first
```

**Reverse Lookup Usage:**
```python
# From cart to receipts
cart = POSCart.objects.get(id=123)
receipts = cart.receipts.all()

# Filter receipts by type
sale_receipts = cart.receipts.filter(receipt_type='SALE')
```

### Transaction ID Field

**Field Configuration:**

| Attribute | Value | Reason |
|-----------|-------|--------|
| field_type | UUIDField | External transaction reference |
| null | True | Optional field |
| blank | True | Optional field |
| db_index | True | Support lookups |
| editable | True | Can be set manually |

**Purpose:**
- Link to payment gateway transaction
- Link to accounting system transaction
- Support external integrations
- Enable cross-system reconciliation

**Usage Examples:**
```
Scenario 1: Payment Gateway
- transaction_id = "stripe_ch_3MmlLrJFRl"
- Links receipt to Stripe charge

Scenario 2: Accounting System
- transaction_id = "acc_txn_567890"
- Links receipt to accounting entry

Scenario 3: Not Used
- transaction_id = None
- Cash transaction, no external ID
```

### Validation Logic

**Cart Validation:**
1. Cart must belong to current tenant
2. Cart must be in COMPLETED status
3. Cart must have payment confirmation
4. Cart cannot be cancelled or voided

**Transaction ID Validation:**
1. If provided, must be valid UUID format
2. Should not duplicate existing transaction_id
3. Optional - can be null

**Validation Flow:**
```
Receipt Creation Request
    ↓
    ├── Validate cart exists
    ├── Validate cart.tenant == current_tenant
    ├── Validate cart.status == COMPLETED
    ├── Validate cart.payment_status == PAID
    ├── Validate transaction_id format (if provided)
    ├── Validate transaction_id uniqueness (if provided)
    ↓
    Create Receipt
```

### Query Methods

**Manager Methods:**

```python
# Get receipts for specific cart
receipts = Receipt.objects.for_cart(cart_id=123)

# Get receipt by transaction ID
receipt = Receipt.objects.for_transaction(transaction_id="uuid-here")

# Get all receipts for a cart including duplicates
all_receipts = Receipt.objects.filter(cart_id=123)
```

**Query Patterns:**

| Query | Method | Use Case |
|-------|--------|----------|
| Cart's receipts | `cart.receipts.all()` | List all receipts for cart |
| Original receipt | `cart.receipts.filter(receipt_type='SALE').first()` | Get first sale receipt |
| Duplicate receipts | `cart.receipts.filter(receipt_type='DUPLICATE')` | Get all reprints |
| By transaction | `Receipt.objects.for_transaction(uuid)` | External lookup |

### Database Indexes

**Index Strategy:**

```sql
-- Indexes created:
CREATE INDEX idx_receipt_cart ON pos_receipts(cart_id);
CREATE INDEX idx_receipt_transaction ON pos_receipts(transaction_id);
CREATE INDEX idx_receipt_cart_type ON pos_receipts(cart_id, receipt_type);
```

**Performance Optimization:**
- cart_id index: Fast cart → receipts lookup
- transaction_id index: Fast external ID lookup
- Composite index: Filter by cart and type

### Expected Outcome

```python
# Model fields added
class Receipt(TenantAwareModel):
    cart = models.ForeignKey(
        'pos.POSCart',
        related_name='receipts',
        on_delete=models.PROTECT
    )
    
    transaction_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True
    )
    
    # Usage example
    receipt = Receipt.objects.create(
        cart=my_cart,
        transaction_id=payment_transaction.id
    )
```

### Verification Checklist
- [ ] cart field added as ForeignKey to POSCart
- [ ] related_name='receipts' is set
- [ ] on_delete=PROTECT prevents cart deletion
- [ ] transaction_id field added as UUIDField
- [ ] Both fields have db_index=True
- [ ] Help text added to both fields
- [ ] Validation logic is documented
- [ ] Manager methods are planned

---

## Task 20: Add Receipt Type Field

### Overview
Add the receipt_type field to classify receipts by their purpose: SALE (original transaction), REFUND (return transaction), VOID (cancelled transaction), or DUPLICATE (reprint of original). This classification drives different formatting and business logic.

### Dependencies
- Task 17: Create Receipt model

### Instructions

1. **Define receipt type choices**
   - Create RECEIPT_TYPE_CHOICES tuple
   - Define four types: SALE, REFUND, VOID, DUPLICATE
   - Use uppercase values for consistency

2. **Add receipt_type field**
   - Add CharField with max_length=20
   - Set choices=RECEIPT_TYPE_CHOICES
   - Set default='SALE' for normal transactions
   - Add db_index=True for filtering

3. **Add field validation**
   - Validate value is in allowed choices
   - Add model validation for type-specific rules
   - Document constraints per type

4. **Add field help text**
   - Explain each receipt type purpose
   - Document when each type is used
   - Note default behavior

5. **Add type-specific methods**
   - Add is_sale() boolean method
   - Add is_refund() boolean method
   - Add is_void() boolean method
   - Add is_duplicate() boolean method

6. **Document type behaviors**
   - SALE: Normal purchase receipt
   - REFUND: Return/refund receipt
   - VOID: Cancelled transaction receipt
   - DUPLICATE: Reprint of existing receipt

### Receipt Type Definitions

**Type Overview:**

| Type | Code | Purpose | Printed Mark |
|------|------|---------|--------------|
| Sale | SALE | Original purchase receipt | None |
| Refund | REFUND | Customer return receipt | "REFUND" watermark |
| Void | VOID | Cancelled transaction | "VOID" watermark |
| Duplicate | DUPLICATE | Reprint of original | "DUPLICATE" watermark |

### Receipt Type Details

**SALE Receipt:**
```
Type: SALE
Purpose: Original transaction receipt
When Generated: After successful payment
Characteristics:
- No special markings
- Standard formatting
- Original receipt number
- Positive amounts
- Normal footer
```

**REFUND Receipt:**
```
Type: REFUND
Purpose: Return/refund transaction
When Generated: After processing return
Characteristics:
- "REFUND" watermark/header
- Negative amounts
- References original receipt
- Different footer text
- Refund policy information
```

**VOID Receipt:**
```
Type: VOID
Purpose: Cancelled transaction
When Generated: When transaction is voided
Characteristics:
- "VOID" watermark
- Original amounts shown
- Void reason displayed
- No QR code
- Manager approval signature
```

**DUPLICATE Receipt:**
```
Type: DUPLICATE
Purpose: Reprint of original
When Generated: Customer requests reprint
Characteristics:
- "DUPLICATE COPY" watermark
- Original receipt number shown
- Original date/time shown
- Reprint date/time added
- Links to original receipt
```

### Type Behavior Matrix

| Behavior | SALE | REFUND | VOID | DUPLICATE |
|----------|------|--------|------|-----------|
| Show amounts | Positive | Negative | Positive | Same as original |
| Watermark | None | REFUND | VOID | DUPLICATE |
| QR Code | Yes | Yes | No | Same as original |
| Original ref | N/A | Required | N/A | Required |
| Approval | No | Maybe | Yes | No |
| Email allowed | Yes | Yes | No | Yes |
| Counts in sales | Yes | Yes (negative) | No | No |

### Field Configuration

```python
RECEIPT_TYPE_CHOICES = [
    ('SALE', 'Sale Receipt'),
    ('REFUND', 'Refund Receipt'),
    ('VOID', 'Void Receipt'),
    ('DUPLICATE', 'Duplicate Receipt'),
]

receipt_type = models.CharField(
    max_length=20,
    choices=RECEIPT_TYPE_CHOICES,
    default='SALE',
    db_index=True,
    help_text="Type of receipt: SALE, REFUND, VOID, or DUPLICATE"
)
```

### Type-Specific Validation

**SALE Type:**
- Cart must be in COMPLETED status
- Payment must be confirmed
- Cannot reference another receipt

**REFUND Type:**
- Must reference original SALE receipt
- Cart must be REFUND type
- Amounts should be negative

**VOID Type:**
- Must have void reason
- Requires manager approval
- Cannot be reprinted

**DUPLICATE Type:**
- Must reference original receipt (Task 34)
- Original receipt must exist
- Maintains original data

### Helper Methods

```python
# Type checking methods
def is_sale(self):
    """Returns True if this is a sale receipt"""
    return self.receipt_type == 'SALE'

def is_refund(self):
    """Returns True if this is a refund receipt"""
    return self.receipt_type == 'REFUND'

def is_void(self):
    """Returns True if this is a void receipt"""
    return self.receipt_type == 'VOID'

def is_duplicate(self):
    """Returns True if this is a duplicate receipt"""
    return self.receipt_type == 'DUPLICATE'

def get_watermark_text(self):
    """Returns watermark text for receipt type"""
    if self.is_refund():
        return "REFUND"
    elif self.is_void():
        return "VOID"
    elif self.is_duplicate():
        return "DUPLICATE COPY"
    return None
```

### Query Filtering

**Common Queries:**

```python
# Get all sale receipts
sales = Receipt.objects.filter(receipt_type='SALE')

# Get all refund receipts
refunds = Receipt.objects.filter(receipt_type='REFUND')

# Get original receipts (exclude duplicates)
originals = Receipt.objects.exclude(receipt_type='DUPLICATE')

# Get receipts that count in sales
counted = Receipt.objects.filter(
    receipt_type__in=['SALE', 'REFUND']
)
```

### Formatting Impact

**Type-Driven Formatting:**

```
SALE Receipt:
┌──────────────────────┐
│   ABC Store          │
│   Sale Receipt       │
│                      │
│   Items...           │
│   Total: Rs. 1,250   │
└──────────────────────┘

REFUND Receipt:
┌──────────────────────┐
│   ABC Store          │
│   *** REFUND ***     │
│   Original: REC-...  │
│                      │
│   Items...           │
│   Total: -Rs. 1,250  │
└──────────────────────┘

DUPLICATE Receipt:
┌──────────────────────┐
│   ABC Store          │
│ ** DUPLICATE COPY ** │
│   Original Date:...  │
│                      │
│   Items...           │
│   Total: Rs. 1,250   │
│   Reprinted: ...     │
└──────────────────────┘
```

### Expected Outcome

```python
# Model field added with choices
RECEIPT_TYPE_CHOICES = [...]

receipt_type = models.CharField(
    max_length=20,
    choices=RECEIPT_TYPE_CHOICES,
    default='SALE',
    db_index=True
)

# Helper methods added
def is_sale(self): ...
def is_refund(self): ...
def is_void(self): ...
def is_duplicate(self): ...
```

### Verification Checklist
- [ ] RECEIPT_TYPE_CHOICES defined with 4 types
- [ ] receipt_type field added with choices
- [ ] Default value set to 'SALE'
- [ ] Field is indexed for filtering
- [ ] Help text documents all types
- [ ] Type-specific helper methods added
- [ ] Validation rules documented per type
- [ ] Query filtering patterns documented

---

## Task 21: Add Generation Timestamp Fields

### Overview
Add timestamp fields that track when receipts are generated, printed, and emailed. These timestamps are essential for audit trails, customer service, and analytics. They enable tracking of receipt lifecycle events.

### Dependencies
- Task 17: Create Receipt model

### Instructions

1. **Add generated_at field**
   - Add DateTimeField for generation timestamp
   - Set auto_now_add=False (manual control)
   - Set db_index=True for date filtering
   - Default to timezone.now() on creation

2. **Add printed_at field**
   - Add DateTimeField for print timestamp
   - Set null=True, blank=True (optional)
   - Record when receipt is printed
   - Can be updated multiple times

3. **Add emailed_at field**
   - Add DateTimeField for email timestamp
   - Set null=True, blank=True (optional)
   - Record when receipt is emailed
   - Can be updated multiple times

4. **Add field help text**
   - generated_at: "When this receipt was generated"
   - printed_at: "When this receipt was last printed (null if never printed)"
   - emailed_at: "When this receipt was last emailed (null if never emailed)"

5. **Add timestamp management methods**
   - Add mark_as_printed() method
   - Add mark_as_emailed() method
   - Add was_printed() boolean property
   - Add was_emailed() boolean property

6. **Add timezone handling**
   - Use timezone-aware datetimes
   - Store in UTC
   - Display in business timezone (Asia/Colombo)

### Timestamp Field Overview

| Field | Type | Required | Purpose | When Set |
|-------|------|----------|---------|----------|
| generated_at | DateTime | Yes | Receipt creation | On generation |
| printed_at | DateTime | No | Print tracking | On print |
| emailed_at | DateTime | No | Email tracking | On email |

### Generated At Field

**Purpose:**
- Record exact moment receipt was generated
- Immutable after creation
- Used for audit trails and analytics

**Behavior:**
```python
# Set on creation
receipt = Receipt.objects.create(
    cart=cart,
    generated_at=timezone.now()
)

# Never changed after creation
# Even if receipt is duplicated, generated_at stays same
```

**Field Configuration:**

| Attribute | Value | Reason |
|-----------|-------|--------|
| auto_now_add | False | Manual control |
| auto_now | False | Immutable |
| null | False | Always required |
| blank | False | Always required |
| db_index | True | Date range queries |
| editable | False | Prevent changes |

**Usage in Queries:**
```python
# Receipts generated today
today_receipts = Receipt.objects.filter(
    generated_at__date=timezone.now().date()
)

# Receipts in date range
range_receipts = Receipt.objects.filter(
    generated_at__range=[start_date, end_date]
)

# Receipts this month
this_month = Receipt.objects.filter(
    generated_at__year=2026,
    generated_at__month=1
)
```

### Printed At Field

**Purpose:**
- Track when receipt was physically printed
- Support "never printed" state (null)
- Can be updated if reprinted
- Analytics: print frequency

**Behavior:**
```python
# Initially null
receipt.printed_at = None

# After first print
receipt.mark_as_printed()
# printed_at = 2026-01-22 14:30:00

# After reprint
receipt.mark_as_printed()
# printed_at = 2026-01-22 15:45:00 (updated)
```

**Field Configuration:**

| Attribute | Value | Reason |
|-----------|-------|--------|
| null | True | Optional/nullable |
| blank | True | Optional |
| db_index | False | Low query frequency |
| editable | True | Can be updated |

**Print Tracking:**
```
Receipt Lifecycle:
1. Generated → printed_at = None
2. Printed → printed_at = first_print_time
3. Reprinted → printed_at = latest_print_time

States:
- Never printed: printed_at is None
- Printed once: printed_at has value
- Printed multiple times: printed_at = last print time
```

### Emailed At Field

**Purpose:**
- Track when receipt was emailed to customer
- Support "never emailed" state (null)
- Can be updated if resent
- Customer service: verify email sent

**Behavior:**
```python
# Initially null
receipt.emailed_at = None

# After email sent
receipt.mark_as_emailed()
# emailed_at = 2026-01-22 14:35:00

# After resending
receipt.mark_as_emailed()
# emailed_at = 2026-01-23 09:15:00 (updated)
```

**Field Configuration:**

| Attribute | Value | Reason |
|-----------|-------|--------|
| null | True | Optional/nullable |
| blank | True | Optional |
| db_index | False | Low query frequency |
| editable | True | Can be updated |

### Management Methods

**mark_as_printed() Method:**
```python
def mark_as_printed(self):
    """
    Mark receipt as printed with current timestamp.
    Updates printed_at to current time.
    Can be called multiple times (updates timestamp).
    """
    self.printed_at = timezone.now()
    self.save(update_fields=['printed_at'])
```

**mark_as_emailed() Method:**
```python
def mark_as_emailed(self):
    """
    Mark receipt as emailed with current timestamp.
    Updates emailed_at to current time.
    Can be called multiple times (updates timestamp).
    """
    self.emailed_at = timezone.now()
    self.save(update_fields=['emailed_at'])
```

**Boolean Properties:**
```python
@property
def was_printed(self):
    """Returns True if receipt was ever printed"""
    return self.printed_at is not None

@property
def was_emailed(self):
    """Returns True if receipt was ever emailed"""
    return self.emailed_at is not None
```

### Timezone Handling

**Storage:**
- All timestamps stored in UTC
- Database timezone: UTC
- Use timezone-aware datetimes

**Display:**
- Convert to business timezone (Asia/Colombo)
- Format for receipt display
- Show timezone in admin

**Sri Lanka Timezone:**
```python
# Business timezone
BUSINESS_TZ = 'Asia/Colombo'  # UTC+5:30

# Convert for display
local_time = receipt.generated_at.astimezone(
    timezone.get_timezone(BUSINESS_TZ)
)
```

### Receipt Lifecycle Tracking

**Timeline Example:**
```
2026-01-22 14:30:00 UTC → Generated
    generated_at = 2026-01-22 14:30:00
    printed_at = None
    emailed_at = None

2026-01-22 14:30:15 UTC → Printed
    generated_at = 2026-01-22 14:30:00 (unchanged)
    printed_at = 2026-01-22 14:30:15
    emailed_at = None

2026-01-22 14:35:00 UTC → Emailed
    generated_at = 2026-01-22 14:30:00 (unchanged)
    printed_at = 2026-01-22 14:30:15 (unchanged)
    emailed_at = 2026-01-22 14:35:00

2026-01-23 09:00:00 UTC → Reprinted
    generated_at = 2026-01-22 14:30:00 (unchanged)
    printed_at = 2026-01-23 09:00:00 (updated)
    emailed_at = 2026-01-22 14:35:00 (unchanged)
```

### Analytics and Reporting

**Key Metrics:**
```python
# Never printed receipts (email-only)
never_printed = Receipt.objects.filter(printed_at__isnull=True)

# Email delivery rate
total = Receipt.objects.count()
emailed = Receipt.objects.filter(emailed_at__isnull=False).count()
email_rate = (emailed / total) * 100

# Average time to print
avg_print_delay = Receipt.objects.filter(
    printed_at__isnull=False
).aggregate(
    avg_delay=Avg(F('printed_at') - F('generated_at'))
)

# Receipts printed but not emailed
printed_only = Receipt.objects.filter(
    printed_at__isnull=False,
    emailed_at__isnull=True
)
```

### Expected Outcome

```python
# Model fields added
class Receipt(TenantAwareModel):
    generated_at = models.DateTimeField(
        db_index=True,
        editable=False
    )
    
    printed_at = models.DateTimeField(
        null=True,
        blank=True
    )
    
    emailed_at = models.DateTimeField(
        null=True,
        blank=True
    )
    
    def mark_as_printed(self): ...
    def mark_as_emailed(self): ...
    
    @property
    def was_printed(self): ...
    
    @property
    def was_emailed(self): ...
```

### Verification Checklist
- [ ] generated_at field added (required, indexed)
- [ ] printed_at field added (nullable)
- [ ] emailed_at field added (nullable)
- [ ] Help text added to all three fields
- [ ] mark_as_printed() method implemented
- [ ] mark_as_emailed() method implemented
- [ ] was_printed property added
- [ ] was_emailed property added
- [ ] Timezone handling configured (UTC storage)
- [ ] Display timezone set to Asia/Colombo

---

## Task 22: Add Receipt Data JSON Field

### Overview
Add the receipt_data JSONField that stores the complete receipt structure in JSON format. This field archives the exact receipt content at generation time, enabling perfect reprints and historical accuracy even if templates or data change later.

### Dependencies
- Task 17: Create Receipt model
- PostgreSQL database (for JSONField)

### Instructions

1. **Add receipt_data field**
   - Add JSONField to model
   - Set default=dict for empty JSON
   - Set blank=True for optional initial state
   - Use PostgreSQL-specific features

2. **Define JSON structure schema**
   - Document expected JSON structure
   - Define required keys
   - Define optional keys
   - Document data types for each field

3. **Add field validation**
   - Validate JSON structure on save
   - Check required keys exist
   - Validate data types
   - Add schema version field

4. **Add field help text**
   - Explain purpose: "Complete receipt data in JSON format"
   - Note immutability after generation
   - Reference schema documentation

5. **Add data access methods**
   - Add get_header_data() method
   - Add get_items_data() method
   - Add get_totals_data() method
   - Add get_qr_code_data() method

6. **Document archival behavior**
   - Data never changes after generation
   - Preserves receipt exactly as printed
   - Independent of template changes
   - Independent of product changes

### Receipt Data JSON Structure

**Top-Level Schema:**
```json
{
  "schema_version": "1.0",
  "generated_at": "2026-01-22T14:30:00Z",
  "header": { ... },
  "transaction": { ... },
  "items": [ ... ],
  "totals": { ... },
  "payments": [ ... ],
  "footer": { ... },
  "qr_code": { ... }
}
```

### JSON Schema Sections

**1. Schema Version:**
```json
{
  "schema_version": "1.0"
}
```
- Tracks data structure version
- Enables migration of old receipts
- Format: "major.minor"

**2. Header Section:**
```json
{
  "header": {
    "business_name": "ABC Store",
    "address_line_1": "123 Main Street",
    "address_line_2": "Colombo 03",
    "phone": "011-2345678",
    "email": "info@abcstore.lk",
    "vat_number": "VAT123456789",
    "custom_lines": [
      "Welcome to ABC Store",
      "Quality Products Since 1990"
    ]
  }
}
```

**3. Transaction Section:**
```json
{
  "transaction": {
    "receipt_number": "REC-20260122-00042",
    "date": "2026-01-22",
    "time": "14:30:00",
    "cashier_name": "John Perera",
    "cashier_id": "CASH001",
    "terminal_id": "POS-01",
    "transaction_id": "abc-def-123"
  }
}
```

**4. Items Section:**
```json
{
  "items": [
    {
      "line_number": 1,
      "sku": "PROD-001",
      "name": "Product Name",
      "variant_display": "Large / Blue",
      "quantity": 2,
      "unit_price": 500.00,
      "discount": 50.00,
      "line_total": 950.00,
      "tax_rate": 15.0,
      "tax_amount": 123.91
    }
  ]
}
```

**5. Totals Section:**
```json
{
  "totals": {
    "subtotal": 950.00,
    "discount_total": 50.00,
    "tax_total": 123.91,
    "grand_total": 1073.91,
    "tax_breakdown": [
      {
        "tax_name": "VAT",
        "tax_rate": 15.0,
        "taxable_amount": 826.00,
        "tax_amount": 123.91
      }
    ]
  }
}
```

**6. Payments Section:**
```json
{
  "payments": [
    {
      "method": "CASH",
      "amount": 1100.00,
      "reference": null,
      "change": 26.09
    }
  ]
}
```

**7. Footer Section:**
```json
{
  "footer": {
    "custom_lines": [
      "Thank you for shopping with us!",
      "Return policy: 7 days with receipt"
    ],
    "website": "www.abcstore.lk",
    "social_media": "@abcstore"
  }
}
```

**8. QR Code Section:**
```json
{
  "qr_code": {
    "data": "https://receipt.abcstore.lk/REC-20260122-00042",
    "format": "QR_CODE",
    "size": "medium"
  }
}
```

### Field Configuration

```python
from django.contrib.postgres.fields import JSONField

receipt_data = models.JSONField(
    default=dict,
    blank=True,
    help_text="Complete receipt data in JSON format (immutable after generation)"
)
```

**Field Attributes:**

| Attribute | Value | Reason |
|-----------|-------|--------|
| field_type | JSONField | Store structured data |
| default | dict | Empty dict if not set |
| blank | True | Can be empty initially |
| null | False | Use empty dict, not null |
| editable | False | Set once, never changed |

### Data Validation

**Required Keys Validation:**
```python
REQUIRED_KEYS = [
    'schema_version',
    'header',
    'transaction',
    'items',
    'totals',
    'payments',
    'footer'
]

def validate_receipt_data(data):
    """Validate receipt data structure"""
    for key in REQUIRED_KEYS:
        if key not in data:
            raise ValidationError(f"Missing required key: {key}")
    
    # Validate schema version
    if 'schema_version' not in data:
        raise ValidationError("schema_version is required")
    
    # Validate header has business name
    if 'business_name' not in data['header']:
        raise ValidationError("header.business_name is required")
    
    # Validate items is list
    if not isinstance(data['items'], list):
        raise ValidationError("items must be a list")
    
    return True
```

### Data Access Methods

**get_header_data():**
```python
def get_header_data(self):
    """
    Get header section from receipt data.
    Returns dict with business info.
    """
    return self.receipt_data.get('header', {})
```

**get_items_data():**
```python
def get_items_data(self):
    """
    Get items section from receipt data.
    Returns list of item dicts.
    """
    return self.receipt_data.get('items', [])
```

**get_totals_data():**
```python
def get_totals_data(self):
    """
    Get totals section from receipt data.
    Returns dict with subtotal, tax, total.
    """
    return self.receipt_data.get('totals', {})
```

**get_payments_data():**
```python
def get_payments_data(self):
    """
    Get payments section from receipt data.
    Returns list of payment dicts.
    """
    return self.receipt_data.get('payments', [])
```

**get_qr_code_data():**
```python
def get_qr_code_data(self):
    """
    Get QR code section from receipt data.
    Returns dict with QR code info.
    """
    return self.receipt_data.get('qr_code', {})
```

### Archival Behavior

**Immutability:**
```
Once receipt is generated and receipt_data is set:
├── Data never changes
├── Template changes don't affect it
├── Product changes don't affect it
└── Price changes don't affect it

Purpose:
├── Historical accuracy
├── Legal compliance
├── Audit trail
└── Perfect reprints
```

**Example Scenario:**
```
Day 1:
- Generate receipt for "Widget - Red"
- Price: Rs. 100
- receipt_data stores: "Widget - Red, Rs. 100"

Day 30:
- Product renamed to "Super Widget - Red"
- Price changed to Rs. 120

Original receipt reprint:
- Still shows "Widget - Red, Rs. 100"
- receipt_data unchanged
- Historical accuracy maintained
```

### JSON Querying (PostgreSQL)

**Query JSON Fields:**
```python
# Find receipts with specific business name
receipts = Receipt.objects.filter(
    receipt_data__header__business_name='ABC Store'
)

# Find receipts over certain amount
receipts = Receipt.objects.filter(
    receipt_data__totals__grand_total__gte=1000
)

# Find receipts with cash payment
receipts = Receipt.objects.filter(
    receipt_data__payments__0__method='CASH'
)
```

### Storage Considerations

**Size Estimates:**
```
Typical Receipt JSON Size:
├── Header: ~300 bytes
├── Transaction: ~200 bytes
├── Items (5 items): ~1 KB
├── Totals: ~200 bytes
├── Payments: ~200 bytes
├── Footer: ~200 bytes
└── QR Code: ~100 bytes
─────────────────────────
Total: ~2 KB per receipt

Storage for 10,000 receipts: ~20 MB
Storage for 1 million receipts: ~2 GB
```

**Performance:**
- Indexed queries on JSON fields
- GIN index for JSON searches
- Consider partitioning for large datasets

### Schema Versioning

**Version Migration:**
```python
def migrate_receipt_data(receipt):
    """
    Migrate old receipt data to new schema version.
    """
    version = receipt.receipt_data.get('schema_version', '1.0')
    
    if version == '1.0' and CURRENT_VERSION == '1.1':
        # Migrate from 1.0 to 1.1
        receipt.receipt_data['new_field'] = 'default_value'
        receipt.receipt_data['schema_version'] = '1.1'
        receipt.save()
```

### Expected Outcome

```python
# Model field added
class Receipt(TenantAwareModel):
    receipt_data = models.JSONField(
        default=dict,
        blank=True
    )
    
    def get_header_data(self): ...
    def get_items_data(self): ...
    def get_totals_data(self): ...
    def get_payments_data(self): ...
    def get_qr_code_data(self): ...

# Usage example
receipt = Receipt.objects.get(receipt_number='REC-20260122-00042')
header = receipt.get_header_data()
print(header['business_name'])  # ABC Store
```

### Verification Checklist
- [ ] receipt_data field added as JSONField
- [ ] Default set to dict (not null)
- [ ] Field marked as non-editable
- [ ] JSON schema structure documented
- [ ] Required keys defined
- [ ] Validation method created
- [ ] Data access methods implemented
- [ ] Archival behavior documented
- [ ] PostgreSQL JSON queries documented
- [ ] Schema versioning strategy defined

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Create Receipt model | Base Receipt model with mixins |
| 18 | Add receipt reference field | receipt_number with auto-generation |
| 19 | Add transaction links | cart FK and transaction_id UUID |
| 20 | Add receipt type field | SALE, REFUND, VOID, DUPLICATE types |
| 21 | Add generation timestamp | generated_at, printed_at, emailed_at |
| 22 | Add receipt data JSON | Complete receipt archive in JSON |

### Receipt Model Structure
```python
class Receipt(TenantAwareModel, TimestampMixin, SoftDeleteMixin):
    # Identity
    id = UUIDField(primary_key=True)
    receipt_number = CharField(unique=True)
    
    # Relationships
    cart = ForeignKey('POSCart')
    transaction_id = UUIDField(null=True)
    
    # Classification
    receipt_type = CharField(choices=RECEIPT_TYPE_CHOICES)
    
    # Timestamps
    generated_at = DateTimeField()
    printed_at = DateTimeField(null=True)
    emailed_at = DateTimeField(null=True)
    
    # Data Archive
    receipt_data = JSONField(default=dict)
    
    # Duplicate handling (Task 34)
    original_receipt = ForeignKey('self', null=True)
```

### Receipt Data Flow
```
POSCart (completed) → Receipt Generation
         │
         ├── Generate receipt_number (Task 33)
         ├── Set receipt_type (SALE/REFUND/VOID)
         ├── Record generated_at timestamp
         ├── Build receipt_data JSON (Tasks 23-32)
         └── Save Receipt record
         
Receipt → Print/Email
    ├── mark_as_printed() → Set printed_at
    └── mark_as_emailed() → Set emailed_at

Receipt → Reprint
    └── Generate duplicate (Task 34)
        ├── receipt_type = DUPLICATE
        └── original_receipt = original Receipt FK
```

### Next Steps
1. **Proceed to Document 02** - [02_Tasks-23-28_Builder-Items-Totals.md](02_Tasks-23-28_Builder-Items-Totals.md)
2. **Implement ReceiptBuilder service** - Generate receipt data from cart
3. **Create receipt number generator** - Task 33 in Document 03

### Database Schema Generated
```sql
CREATE TABLE pos_receipts (
    id UUID PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    cart_id UUID NOT NULL REFERENCES pos_carts(id),
    transaction_id UUID,
    receipt_type VARCHAR(20) NOT NULL DEFAULT 'SALE',
    generated_at TIMESTAMP NOT NULL,
    printed_at TIMESTAMP,
    emailed_at TIMESTAMP,
    receipt_data JSONB NOT NULL DEFAULT '{}',
    original_receipt_id UUID REFERENCES pos_receipts(id),
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_receipt_number ON pos_receipts(receipt_number);
CREATE INDEX idx_receipt_cart ON pos_receipts(cart_id);
CREATE INDEX idx_receipt_transaction ON pos_receipts(transaction_id);
CREATE INDEX idx_receipt_type ON pos_receipts(receipt_type);
CREATE INDEX idx_receipt_generated ON pos_receipts(generated_at);
CREATE INDEX idx_receipt_data ON pos_receipts USING GIN(receipt_data);
```

---

## Notes for AI Agents

1. **Model Implementation:** The Receipt model is now fully defined with all core fields
2. **Number Generation:** Task 33 will implement the actual receipt number generation logic
3. **Data Population:** Tasks 23-32 will implement the ReceiptBuilder service to populate receipt_data
4. **Duplicate Handling:** Task 34 will add original_receipt FK and duplicate generation logic
5. **Multi-Tenancy:** All queries automatically filter by tenant through TenantAwareModel
6. **Time zones:** Store in UTC, display in Asia/Colombo for Sri Lankan businesses
7. **Immutability:** receipt_data and receipt_number should never change after generation
8. **Validation:** Add model clean() method to validate receipt_data structure before saving
