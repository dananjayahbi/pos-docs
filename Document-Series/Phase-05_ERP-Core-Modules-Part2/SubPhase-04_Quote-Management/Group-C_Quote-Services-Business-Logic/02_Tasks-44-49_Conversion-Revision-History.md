# Tasks 44-49: Conversion, Revision, Locking & History

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** C - Quote Services & Business Logic  
> **Document:** 02 of 03  
> **Tasks Covered:** 44, 45, 46, 47, 48, 49

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-37-43_Service-Status-Expiry.md](01_Tasks-37-43_Service-Status-Expiry.md)
- **→ Next Document:** [03_Tasks-50-52_Settings-Validity-Migration.md](03_Tasks-50-52_Settings-Validity-Migration.md)

---

## Document Overview

This document covers implementing quote to order conversion, inventory validation, quote revision, quote locking, history tracking model, and history logging.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 44 | Implement Quote to Order Conversion | High | 35 min |
| 45 | Add Inventory Validation on Conversion | Medium | 25 min |
| 46 | Implement Quote Revision | Medium | 25 min |
| 47 | Add Quote Locking Logic | Medium | 20 min |
| 48 | Create Quote History Model | Medium | 25 min |
| 49 | Implement History Logging | Medium | 25 min |

---

## Task 44: Implement Quote to Order Conversion

### Overview
Implement the convert_to_order method that converts an accepted quote into a sales order, transferring all line items and linking the records.

### Dependencies
- Task 40: Status transitions exist
- Phase 04: Order model exists

### Instructions

1. **Import Order models**
   - Import Order, OrderLineItem from sales app
   - Import related models

2. **Add convert_to_order method to QuoteService**
   - Accept quote_id and user
   - Validate quote is ACCEPTED
   - Use @transaction.atomic decorator
   - Return created order

3. **Validate conversion requirements**
   - Check quote status is ACCEPTED
   - Check quote not already converted
   - Check customer is valid
   - Check quote not expired (optional)

4. **Create Order from Quote**
   - Copy customer information
   - Copy order details
   - Set order_type to 'SALES' or 'FROM_QUOTE'
   - Generate order number
   - Set status to 'PENDING' or 'CONFIRMED'
   - Link quote reference

5. **Copy line items to Order**
   - Iterate quote line items
   - Create OrderLineItem for each
   - Copy all relevant fields
   - Maintain pricing from quote
   - Set product references

6. **Calculate order totals**
   - Use OrderCalculationService if available
   - Or copy totals from quote
   - Ensure financial consistency

7. **Update Quote status**
   - Change quote status to CONVERTED
   - Set converted_at timestamp
   - Set converted_to_order reference
   - Set converted_by user

8. **Create history entries**
   - Log quote conversion
   - Log order creation
   - Link records

9. **Handle inventory reservation (optional)**
   - Reserve inventory for order
   - Or mark for fulfillment
   - Based on business logic

10. **Return created order**
    - Return order with line items
    - Include quote reference

### Implementation

```python
@transaction.atomic
def convert_to_order(
    self,
    quote_id: int,
    user: User
) -> 'Order':
    """
    Convert accepted quote to sales order.
    
    Args:
        quote_id: Quote ID
        user: User performing conversion
    
    Returns:
        Order: Created sales order
    
    Raises:
        ValueError: If quote cannot be converted
    """
    from apps.sales.models import Order, OrderLineItem
    from apps.sales.services import OrderCalculationService
    
    # Load quote with line items
    quote = Quote.objects.prefetch_related(
        'line_items__product',
        'line_items__variant'
    ).select_for_update().get(id=quote_id)
    
    logger.info(
        f"Converting quote {quote.quote_number} to order "
        f"by user {user.email}"
    )
    
    # Validate
    self._validate_status_transition(quote.status, 'CONVERTED')
    
    if quote.status != 'ACCEPTED':
        raise ValueError("Can only convert ACCEPTED quotes")
    
    if hasattr(quote, 'converted_to_order') and quote.converted_to_order:
        raise ValueError("Quote already converted to order")
    
    # Create Order
    order = Order.objects.create(
        customer=quote.customer,
        order_type='FROM_QUOTE',
        status='CONFIRMED',
        quote=quote,
        notes=quote.notes,
        terms_and_conditions=quote.terms_and_conditions,
        discount_type=quote.discount_type,
        discount_value=quote.discount_value,
        created_by=user
    )
    
    logger.debug(f"Created order {order.order_number}")
    
    # Copy line items
    for quote_item in quote.line_items.all():
        OrderLineItem.objects.create(
            order=order,
            position=quote_item.position,
            product=quote_item.product,
            variant=quote_item.variant,
            product_name=quote_item.product_name,
            custom_description=quote_item.custom_description,
            quantity=quote_item.quantity,
            unit_of_measure=quote_item.unit_of_measure,
            unit_price=quote_item.unit_price,
            discount_type=quote_item.discount_type,
            discount_value=quote_item.discount_value,
            is_taxable=quote_item.is_taxable,
            tax_rate=quote_item.tax_rate
        )
    
    logger.debug(f"Copied {quote.line_items.count()} line items to order")
    
    # Calculate order totals
    if OrderCalculationService:
        calc_service = OrderCalculationService(order)
        order = calc_service.calculate_all(save=True)
    else:
        # Copy totals from quote
        order.subtotal = quote.subtotal
        order.discount_amount = quote.discount_amount
        order.tax_amount = quote.tax_amount
        order.total = quote.total
        order.save()
    
    # Update quote
    quote.status = 'CONVERTED'
    quote.converted_at = timezone.now()
    quote.converted_to_order = order
    quote.converted_by = user
    quote.save(update_fields=[
        'status',
        'converted_at',
        'converted_to_order',
        'converted_by',
        'updated_at'
    ])
    
    logger.info(
        f"Quote {quote.quote_number} converted to "
        f"order {order.order_number}"
    )
    
    return order
```

### Conversion Mapping

| Quote Field | Order Field |
|-------------|-------------|
| customer | customer |
| quote_number | Reference field |
| line_items | Copy to order line items |
| subtotal | subtotal |
| discount_amount | discount_amount |
| tax_amount | tax_amount |
| total | total |
| notes | notes |
| terms_and_conditions | terms_and_conditions |

### Usage Example

```python
service = QuoteService()

# Convert accepted quote
order = service.convert_to_order(
    quote_id=quote.id,
    user=sales_rep
)

print(f"Order created: {order.order_number}")
print(f"Total: ₨ {order.total}")

# Quote is now converted
quote.refresh_from_db()
assert quote.status == 'CONVERTED'
assert quote.converted_to_order == order
```

### Expected Outcome
```python
# Before conversion
quote.status  # 'ACCEPTED'
quote.converted_to_order  # None

# After conversion
quote.status  # 'CONVERTED'
quote.converted_to_order  # <Order: ORD-2026-001>
order.quote  # <Quote: QT-2026-001>
order.line_items.count()  # Same as quote.line_items.count()
order.total  # Same as quote.total
```

### Verification Checklist
- [ ] convert_to_order() method implemented
- [ ] Validates quote is ACCEPTED
- [ ] Transaction wrapper for atomicity
- [ ] Creates Order instance
- [ ] Links order to quote
- [ ] Copies all line items
- [ ] Maintains pricing from quote
- [ ] Calculates order totals
- [ ] Updates quote status to CONVERTED
- [ ] Sets conversion timestamps
- [ ] Links converted_to_order
- [ ] Logs conversion event

---

## Task 45: Add Inventory Validation on Conversion

### Overview
Add inventory checking before converting quote to order to ensure sufficient stock is available for all products.

### Dependencies
- Task 44: Order conversion implemented
- Inventory models exist

### Instructions

1. **Create validate_inventory_availability method**
   - Accept quote parameter
   - Check each line item with product
   - Query inventory for availability
   - Return validation result

2. **Check stock levels**
   - For each line item with product
   - Get available quantity from inventory
   - Compare with quote quantity
   - Identify insufficient items

3. **Handle variants**
   - Check variant-specific inventory if variant set
   - Fall back to product inventory
   - Consider location/warehouse

4. **Return validation details**
   - Return dict with validation result
   - Include list of items with insufficient stock
   - Include available vs required quantities
   - Provide actionable information

5. **Add validation to convert_to_order**
   - Call validation before conversion
   - Raise exception if insufficient stock
   - Provide clear error message
   - Option to override for backorders

6. **Add allow_backorder parameter**
   - Optional parameter in convert_to_order
   - Allow conversion even if out of stock
   - Mark items as backordered
   - Set expected fulfillment dates

7. **Create inventory reservation**
   - Reserve inventory for order items
   - Prevent overselling
   - Link reservations to order
   - Release on cancellation

### Implementation

```python
def validate_inventory_availability(
    self,
    quote: Quote
) -> Dict:
    """
    Validate inventory available for quote conversion.
    
    Args:
        quote: Quote to validate
    
    Returns:
        dict: Validation result with details
    
    Example result:
        {
            'valid': False,
            'insufficient_items': [
                {
                    'line_item': <QuoteLineItem>,
                    'product_name': 'Product A',
                    'required': 10,
                    'available': 5,
                    'shortage': 5
                }
            ],
            'message': '1 item(s) have insufficient stock'
        }
    """
    from apps.inventory.models import InventoryItem
    
    logger.debug(f"Validating inventory for quote {quote.quote_number}")
    
    insufficient_items = []
    
    # Check each line item
    for line_item in quote.line_items.filter(product__isnull=False):
        # Get inventory
        if line_item.variant:
            inventory = InventoryItem.objects.filter(
                variant=line_item.variant
            ).first()
        else:
            inventory = InventoryItem.objects.filter(
                product=line_item.product,
                variant__isnull=True
            ).first()
        
        if not inventory:
            # No inventory record = out of stock
            insufficient_items.append({
                'line_item': line_item,
                'product_name': line_item.product_name,
                'required': float(line_item.quantity),
                'available': 0,
                'shortage': float(line_item.quantity)
            })
            continue
        
        # Check availability
        available = inventory.available_quantity
        required = line_item.quantity
        
        if available < required:
            insufficient_items.append({
                'line_item': line_item,
                'product_name': line_item.product_name,
                'required': float(required),
                'available': float(available),
                'shortage': float(required - available)
            })
    
    # Build result
    is_valid = len(insufficient_items) == 0
    
    result = {
        'valid': is_valid,
        'insufficient_items': insufficient_items,
        'message': (
            'All items in stock' if is_valid
            else f"{len(insufficient_items)} item(s) have insufficient stock"
        )
    }
    
    logger.debug(
        f"Inventory validation: {'valid' if is_valid else 'invalid'}"
    )
    
    return result

@transaction.atomic
def convert_to_order(
    self,
    quote_id: int,
    user: User,
    allow_backorder: bool = False
) -> 'Order':
    """
    Convert accepted quote to sales order.
    
    Args:
        quote_id: Quote ID
        user: User performing conversion
        allow_backorder: Allow conversion with insufficient stock
    
    Returns:
        Order: Created sales order
    
    Raises:
        ValueError: If quote cannot be converted or insufficient inventory
    """
    # ... existing code ...
    
    # Validate inventory before conversion
    if not allow_backorder:
        validation = self.validate_inventory_availability(quote)
        
        if not validation['valid']:
            insufficient = validation['insufficient_items']
            details = "\n".join([
                f"  - {item['product_name']}: "
                f"need {item['required']}, have {item['available']}"
                for item in insufficient
            ])
            
            raise ValueError(
                f"Insufficient inventory for conversion:\n{details}\n"
                f"Set allow_backorder=True to convert anyway."
            )
    
    # Continue with conversion...
    # ... rest of conversion code ...
```

### Inventory Check Flow

```
Convert Quote to Order
         │
         ▼
Check Inventory
         │
    ┌────┴────┐
    │         │
Sufficient  Insufficient
    │         │
    │         ▼
    │    allow_backorder?
    │         │
    │    ┌────┴────┐
    │   Yes       No
    │    │         │
    │    │         ▼
    │    │    Raise Error
    │    │
    └────┴────┐
         │
         ▼
  Convert to Order
         │
         ▼
Reserve Inventory
```

### Usage Examples

```python
service = QuoteService()

# Check inventory first
validation = service.validate_inventory_availability(quote)
if not validation['valid']:
    for item in validation['insufficient_items']:
        print(f"{item['product_name']}: {item['shortage']} short")

# Try conversion with validation
try:
    order = service.convert_to_order(
        quote_id=quote.id,
        user=user,
        allow_backorder=False  # Enforce stock check
    )
except ValueError as e:
    print(f"Cannot convert: {e}")

# Or allow backorder
order = service.convert_to_order(
    quote_id=quote.id,
    user=user,
    allow_backorder=True  # Convert anyway
)
```

### Expected Outcome
```python
# Sufficient stock
validation = service.validate_inventory_availability(quote)
# {
#     'valid': True,
#     'insufficient_items': [],
#     'message': 'All items in stock'
# }

# Insufficient stock
validation = service.validate_inventory_availability(quote)
# {
#     'valid': False,
#     'insufficient_items': [
#         {
#             'product_name': 'Product A',
#             'required': 10,
#             'available': 5,
#             'shortage': 5
#         }
#     ],
#     'message': '1 item(s) have insufficient stock'
# }
```

### Verification Checklist
- [ ] validate_inventory_availability() method
- [ ] Checks each product line item
- [ ] Handles variant-specific inventory
- [ ] Returns detailed validation result
- [ ] Lists insufficient items with quantities
- [ ] Integrated into convert_to_order()
- [ ] allow_backorder parameter
- [ ] Clear error messages
- [ ] Prevents overselling by default

---

## Task 46: Implement Quote Revision

### Overview
Implement quote revision functionality that creates a new version of a quote linked to the original, useful for price updates or changes after sending.

### Dependencies
- Task 39: Quote duplication exists

### Instructions

1. **Add revision_of field to Quote model**
   - ForeignKey to self
   - null=True, blank=True
   - related_name='revisions'
   - Tracks original quote

2. **Add revision_number field**
   - IntegerField, default=1
   - Increments for each revision
   - Original is version 1

3. **Add is_latest_revision field**
   - BooleanField, default=True
   - Only one version marked as latest
   - Used for queries

4. **Implement create_revision method**
   - Accept quote_id and user
   - Similar to duplicate but linked
   - Mark original as superseded
   - Return new revision

5. **Update previous revision**
   - Set is_latest_revision=False on original
   - Link new revision to original
   - Increment revision_number

6. **Add get_revision_history method**
   - Return all revisions for a quote
   - Order by revision_number
   - Include changes summary

7. **Add get_latest_revision method**
   - Get latest version of quote
   - Follow revision chain
   - Return most recent

8. **Handle revision chain**
   - Support multiple revisions
   - Track entire history
   - Link back to original

### Implementation

```python
# In Quote model
revision_of = models.ForeignKey(
    'self',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='revisions',
    help_text="Original quote if this is a revision"
)
revision_number = models.PositiveIntegerField(
    default=1,
    help_text="Revision number (1 for original)"
)
is_latest_revision = models.BooleanField(
    default=True,
    help_text="Whether this is the latest revision"
)

def get_revision_history(self):
    """Get all revisions of this quote."""
    root = self.revision_of or self
    return Quote.objects.filter(
        models.Q(id=root.id) | models.Q(revision_of=root)
    ).order_by('revision_number')

def get_latest_revision(self):
    """Get latest revision of this quote."""
    if self.is_latest_revision:
        return self
    
    root = self.revision_of or self
    return root.revisions.filter(
        is_latest_revision=True
    ).first() or self


# In QuoteService
@transaction.atomic
def create_revision(
    self,
    quote_id: int,
    user: User,
    reason: str = ''
) -> Quote:
    """
    Create new revision of quote.
    
    Args:
        quote_id: Original quote ID
        user: User creating revision
        reason: Reason for revision
    
    Returns:
        Quote: New revision quote
    """
    original = Quote.objects.select_for_update().get(id=quote_id)
    
    logger.info(
        f"Creating revision of quote {original.quote_number} "
        f"by user {user.email}"
    )
    
    # Determine revision number
    if original.revision_of:
        # This is already a revision
        root = original.revision_of
    else:
        root = original
    
    next_revision = root.revisions.count() + 2  # +1 for root, +1 for new
    
    # Mark current as not latest
    if original.is_latest_revision:
        original.is_latest_revision = False
        original.save(update_fields=['is_latest_revision'])
    
    # Create revision (similar to duplicate)
    revision = Quote.objects.create(
        customer=original.customer,
        guest_name=original.guest_name,
        guest_email=original.guest_email,
        guest_phone=original.guest_phone,
        title=original.title,
        status='DRAFT',
        issue_date=timezone.now().date(),
        valid_until=timezone.now().date() + timezone.timedelta(days=30),
        notes=original.notes,
        terms_and_conditions=original.terms_and_conditions,
        discount_type=original.discount_type,
        discount_value=original.discount_value,
        created_by=user,
        revision_of=root,
        revision_number=next_revision,
        is_latest_revision=True
    )
    
    # Copy line items
    for original_item in original.line_items.all():
        QuoteLineItem.objects.create(
            quote=revision,
            position=original_item.position,
            product=original_item.product,
            variant=original_item.variant,
            product_name=original_item.product_name,
            custom_description=original_item.custom_description,
            quantity=original_item.quantity,
            unit_of_measure=original_item.unit_of_measure,
            unit_price=original_item.unit_price,
            original_price=original_item.original_price,
            discount_type=original_item.discount_type,
            discount_value=original_item.discount_value,
            is_taxable=original_item.is_taxable,
            tax_rate=original_item.tax_rate
        )
    
    # Calculate totals
    calc_service = QuoteCalculationService(revision)
    revision = calc_service.calculate_all(save=True)
    
    logger.info(
        f"Created revision {revision.quote_number} "
        f"(v{next_revision}) of {original.quote_number}"
    )
    
    return revision
```

### Revision Flow

```
Original Quote (v1)
  quote_number: QT-2026-001
  revision_number: 1
  is_latest_revision: False
       │
       ▼ create_revision()
Revision 1 (v2)
  quote_number: QT-2026-015
  revision_of: QT-2026-001
  revision_number: 2
  is_latest_revision: False
       │
       ▼ create_revision()
Revision 2 (v3)
  quote_number: QT-2026-023
  revision_of: QT-2026-001
  revision_number: 3
  is_latest_revision: True ✓
```

### Usage Examples

```python
service = QuoteService()

# Create revision of sent quote
original_quote = Quote.objects.get(quote_number='QT-2026-001')
revision = service.create_revision(
    quote_id=original_quote.id,
    user=sales_rep,
    reason="Customer requested price adjustment"
)

# Revision is editable draft
assert revision.status == 'DRAFT'
assert revision.revision_of == original_quote
assert revision.revision_number == 2
assert revision.is_latest_revision == True

# Original is superseded
original_quote.refresh_from_db()
assert original_quote.is_latest_revision == False

# Get revision history
history = original_quote.get_revision_history()
# [<Quote: QT-2026-001 v1>, <Quote: QT-2026-015 v2>]

# Get latest revision
latest = original_quote.get_latest_revision()
assert latest == revision
```

### Expected Outcome
```python
# Revision chain
original.revision_number  # 1
original.is_latest_revision  # False
original.revisions.count()  # 2

revision1.revision_number  # 2
revision1.revision_of  # original
revision1.is_latest_revision  # False

revision2.revision_number  # 3
revision2.revision_of  # original
revision2.is_latest_revision  # True ✓
```

### Verification Checklist
- [ ] revision_of field added to Quote model
- [ ] revision_number field added
- [ ] is_latest_revision field added
- [ ] create_revision() method implemented
- [ ] Marks previous revision as not latest
- [ ] Increments revision_number correctly
- [ ] Copies all line items
- [ ] Links to original quote
- [ ] get_revision_history() method
- [ ] get_latest_revision() method
- [ ] Handles revision chains
- [ ] Logs revision creation

---

## Task 47: Add Quote Locking Logic

### Overview
Implement quote locking mechanism to prevent editing quotes that have been sent or accepted, ensuring data integrity.

### Dependencies
- Task 40: Status transitions exist

### Instructions

1. **Add is_locked property to Quote model**
   - @property decorator
   - Return True if status in ['SENT', 'ACCEPTED', 'CONVERTED', 'REJECTED', 'EXPIRED']
   - Return False if DRAFT

2. **Add can_edit method**
   - Check if quote can be edited
   - Return not is_locked
   - Consider user permissions

3. **Add can_delete method**
   - Check if quote can be deleted
   - Only DRAFT quotes can be deleted
   - Check no linked orders

4. **Create validate_not_locked decorator**
   - Decorator for service methods
   - Check quote not locked before operation
   - Raise QuoteLockedError if locked

5. **Add locking to model save**
   - Override save method
   - Prevent changes to locked quotes
   - Allow specific fields (e.g., status transitions)

6. **Update service methods**
   - Apply locking checks to edit operations
   - Allow status transitions even when locked
   - Provide clear error messages

7. **Add unlock mechanism (admin only)**
   - Optional: allow admins to unlock quotes
   - Log unlock operations
   - Require justification

### Implementation

```python
# In Quote model
@property
def is_locked(self):
    """Check if quote is locked from editing."""
    return self.status in [
        'SENT',
        'ACCEPTED',
        'CONVERTED',
        'REJECTED',
        'EXPIRED'
    ]

def can_edit(self, user=None):
    """
    Check if quote can be edited.
    
    Args:
        user: Optional user for permission check
    
    Returns:
        bool: True if can edit
    """
    if self.is_locked:
        return False
    
    # Additional permission checks if needed
    if user and hasattr(user, 'has_perm'):
        if not user.has_perm('quotes.change_quote'):
            return False
    
    return True

def can_delete(self, user=None):
    """Check if quote can be deleted."""
    if self.status != 'DRAFT':
        return False
    
    # Check for linked records
    if hasattr(self, 'converted_to_order') and self.converted_to_order:
        return False
    
    return True

def save(self, *args, **kwargs):
    """
    Save quote with locking logic.
    
    Prevents changes to locked quotes except status transitions.
    """
    # Allow new quotes
    if not self.pk:
        return super().save(*args, **kwargs)
    
    # Get original state
    original = Quote.objects.get(pk=self.pk)
    
    # Allow status changes even when locked
    update_fields = kwargs.get('update_fields', None)
    if update_fields and 'status' in update_fields:
        return super().save(*args, **kwargs)
    
    # Prevent editing locked quotes
    if original.is_locked:
        # Only allow specific field updates
        allowed_fields = {'status', 'updated_at', 'converted_to_order',
                         'converted_at', 'expired_at', 'accepted_at',
                         'rejected_at', 'sent_at'}
        
        if update_fields:
            if not set(update_fields).issubset(allowed_fields):
                raise QuoteLockedError(
                    f"Cannot edit locked quote {self.quote_number}. "
                    f"Status: {self.status}"
                )
        else:
            # Full save attempted on locked quote
            raise QuoteLockedError(
                f"Quote {self.quote_number} is locked (status: {self.status})"
            )
    
    return super().save(*args, **kwargs)


# In QuoteService - decorator
from functools import wraps

def validate_not_locked(func):
    """
    Decorator to ensure quote is not locked before operation.
    """
    @wraps(func)
    def wrapper(self, quote_id, *args, **kwargs):
        quote = Quote.objects.get(id=quote_id)
        
        if quote.is_locked:
            raise QuoteLockedError(
                f"Cannot perform operation on locked quote "
                f"{quote.quote_number} (status: {quote.status})"
            )
        
        return func(self, quote_id, *args, **kwargs)
    
    return wrapper


# Apply to service methods
@validate_not_locked
def update_quote(self, quote_id, data, user):
    """Update quote (only if not locked)."""
    # ... update logic ...
    pass

@validate_not_locked
def delete_quote(self, quote_id, user):
    """Delete quote (only if DRAFT)."""
    quote = Quote.objects.get(id=quote_id)
    
    if not quote.can_delete():
        raise ValueError("Cannot delete this quote")
    
    quote.delete()
    logger.info(f"Quote {quote.quote_number} deleted by {user.email}")
```

### Locking Rules

| Status | Can Edit? | Can Delete? | Notes |
|--------|-----------|-------------|-------|
| DRAFT | ✓ Yes | ✓ Yes | Fully editable |
| SENT | ✗ No | ✗ No | Locked to customer |
| ACCEPTED | ✗ No | ✗ No | Committed |
| REJECTED | ✗ No | ✗ No | Historical record |
| EXPIRED | ✗ No | ✗ No | Historical record |
| CONVERTED | ✗ No | ✗ No | Linked to order |

### Usage Examples

```python
# Check if can edit
if quote.can_edit():
    quote.title = "Updated Title"
    quote.save()
else:
    print("Quote is locked")

# Try to edit locked quote
try:
    locked_quote.title = "New Title"
    locked_quote.save()
except QuoteLockedError as e:
    print(f"Error: {e}")
    # "Quote QT-2026-001 is locked (status: SENT)"

# Use decorator in service
try:
    service.update_quote(locked_quote.id, data, user)
except QuoteLockedError as e:
    print(f"Cannot update: {e}")
```

### Expected Outcome
```python
# Draft quote - editable
draft_quote.status = 'DRAFT'
draft_quote.is_locked  # False
draft_quote.can_edit()  # True
draft_quote.can_delete()  # True

# Sent quote - locked
sent_quote.status = 'SENT'
sent_quote.is_locked  # True
sent_quote.can_edit()  # False
sent_quote.can_delete()  # False

# Attempt to edit raises error
try:
    sent_quote.notes = "Updated notes"
    sent_quote.save()
except QuoteLockedError:
    pass  # Expected
```

### Verification Checklist
- [ ] is_locked property in Quote model
- [ ] can_edit() method with permission check
- [ ] can_delete() method with validation
- [ ] save() override enforces locking
- [ ] Allows status transitions when locked
- [ ] validate_not_locked decorator
- [ ] Applied to service update/delete methods
- [ ] QuoteLockedError exception raised
- [ ] Clear error messages
- [ ] Logged locking violations

---

## Task 48: Create Quote History Model

### Overview
Create the QuoteHistory model to track all changes and transitions in quote lifecycle for audit trail and visibility.

### Dependencies
- Quote model complete

### Instructions

1. **Create history.py model file**
   - Navigate to `apps/quotes/models/`
   - Create new file `history.py`

2. **Import required modules**
   - Import Django model classes
   - Import JSONField
   - Import Quote, User models

3. **Define QuoteHistory model**
   - Link to Quote via ForeignKey
   - Track event type
   - Store old and new values
   - Record user and timestamp

4. **Add quote relationship**
   - ForeignKey to Quote
   - related_name='history'
   - on_delete=models.CASCADE

5. **Define EVENT_TYPE_CHOICES**
   - CREATED: Quote created
   - UPDATED: Quote modified
   - SENT: Sent to customer
   - ACCEPTED: Customer accepted
   - REJECTED: Customer rejected
   - EXPIRED: Quote expired
   - CONVERTED: Converted to order
   - REVISION_CREATED: New revision created
   - STATUS_CHANGED: Generic status change

6. **Add event_type field**
   - CharField with choices
   - max_length=50
   - Index for queries

7. **Add user field**
   - ForeignKey to User
   - null=True (for system events)
   - Who performed the action

8. **Add timestamp field**
   - DateTimeField auto_now_add=True
   - When event occurred

9. **Add old_values and new_values fields**
   - JSONField for storing changes
   - Store dict of field: value
   - null=True, blank=True

10. **Add notes field**
    - TextField for event description
    - Optional context or reason
    - blank=True

11. **Add Meta class**
    - ordering = ['-timestamp']
    - indexes on quote + timestamp
    - verbose names

12. **Add __str__ method**
    - Return event summary
    - Include quote, event type, timestamp

13. **Add get_changes_summary method**
    - Format changes for display
    - Compare old_values and new_values
    - Return readable summary

14. **Update models __init__.py**
    - Import QuoteHistory
    - Add to __all__

### Implementation

```python
# apps/quotes/models/history.py

from django.db import models
from django.utils import timezone


class QuoteHistory(models.Model):
    """
    Audit trail for quote changes and lifecycle events.
    
    Tracks all significant events in quote lifecycle including
    status transitions, edits, and conversions.
    """
    
    # Event types
    CREATED = 'CREATED'
    UPDATED = 'UPDATED'
    SENT = 'SENT'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'
    EXPIRED = 'EXPIRED'
    CONVERTED = 'CONVERTED'
    REVISION_CREATED = 'REVISION_CREATED'
    STATUS_CHANGED = 'STATUS_CHANGED'
    
    EVENT_TYPE_CHOICES = [
        (CREATED, 'Quote Created'),
        (UPDATED, 'Quote Updated'),
        (SENT, 'Sent to Customer'),
        (ACCEPTED, 'Customer Accepted'),
        (REJECTED, 'Customer Rejected'),
        (EXPIRED, 'Quote Expired'),
        (CONVERTED, 'Converted to Order'),
        (REVISION_CREATED, 'Revision Created'),
        (STATUS_CHANGED, 'Status Changed'),
    ]
    
    # Fields
    quote = models.ForeignKey(
        'Quote',
        on_delete=models.CASCADE,
        related_name='history',
        help_text="Quote this event relates to"
    )
    
    event_type = models.CharField(
        max_length=50,
        choices=EVENT_TYPE_CHOICES,
        db_index=True,
        help_text="Type of event"
    )
    
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="User who performed the action"
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When the event occurred"
    )
    
    old_values = models.JSONField(
        null=True,
        blank=True,
        help_text="Field values before change"
    )
    
    new_values = models.JSONField(
        null=True,
        blank=True,
        help_text="Field values after change"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Additional notes or context"
    )
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Quote History"
        verbose_name_plural = "Quote History"
        indexes = [
            models.Index(fields=['quote', '-timestamp']),
            models.Index(fields=['event_type', '-timestamp']),
        ]
    
    def __str__(self):
        return (
            f"{self.quote.quote_number} - "
            f"{self.get_event_type_display()} - "
            f"{self.timestamp.strftime('%Y-%m-%d %H:%M')}"
        )
    
    def get_changes_summary(self):
        """
        Get human-readable summary of changes.
        
        Returns:
            str: Formatted change summary
        """
        if not self.old_values or not self.new_values:
            return "No detailed changes recorded"
        
        changes = []
        for field, new_value in self.new_values.items():
            old_value = self.old_values.get(field)
            if old_value != new_value:
                changes.append(
                    f"{field}: {old_value} → {new_value}"
                )
        
        return "\n".join(changes) if changes else "No changes"
```

### History Event Types

| Event Type | When Logged | Example |
|------------|-------------|---------|
| CREATED | Quote first created | New quote QT-2026-001 |
| UPDATED | Quote fields modified | Title changed |
| SENT | Status changed to SENT | Sent to customer |
| ACCEPTED | Customer accepts | Quote accepted |
| REJECTED | Customer rejects | Quote rejected |
| EXPIRED | Quote expires | Auto-expired |
| CONVERTED | Convert to order | Order ORD-2026-001 created |
| REVISION_CREATED | New revision made | Revision v2 created |

### Field Structure

```python
# old_values and new_values format
{
    'status': 'DRAFT',
    'total': '10000.00',
    'discount_value': '10.00'
}

# Example history entry
QuoteHistory(
    quote=quote,
    event_type='UPDATED',
    user=user,
    old_values={'total': '10000.00', 'discount_value': '0.00'},
    new_values={'total': '9000.00', 'discount_value': '10.00'},
    notes="Applied 10% discount"
)
```

### Expected Outcome
```
apps/quotes/models/
├── __init__.py
├── quote.py
├── line_item.py
└── history.py                # New model
```

### Verification Checklist
- [ ] history.py file created
- [ ] QuoteHistory model defined
- [ ] ForeignKey to Quote with CASCADE
- [ ] EVENT_TYPE_CHOICES defined
- [ ] event_type CharField with choices
- [ ] user ForeignKey (nullable)
- [ ] timestamp auto_now_add
- [ ] old_values JSONField
- [ ] new_values JSONField
- [ ] notes TextField
- [ ] Meta class with ordering
- [ ] Indexes on quote + timestamp
- [ ] __str__ method
- [ ] get_changes_summary() method
- [ ] Imported in models __init__.py

---

## Task 49: Implement History Logging

### Overview
Implement automatic history logging for quote events using signals and service methods.

### Dependencies
- Task 48: QuoteHistory model exists

### Instructions

1. **Create history logging service**
   - Add log_history method to QuoteService
   - Accept quote, event_type, user, notes, old_values, new_values
   - Create QuoteHistory entry

2. **Add history logging to status transitions**
   - In send_quote: log SENT event
   - In accept_quote: log ACCEPTED event
   - In reject_quote: log REJECTED event
   - In expire_quote: log EXPIRED event
   - In convert_to_order: log CONVERTED event

3. **Add history logging to create/update**
   - In create_quote: log CREATED event
   - In update operations: log UPDATED event with changes

4. **Create signal handler for quote changes**
   - Use post_save signal
   - Compare old and new values
   - Log significant changes
   - Exclude routine fields (updated_at)

5. **Add helper methods**
   - get_quote_field_values: extract relevant fields
   - compare_field_values: find differences
   - format_change_description: human-readable

6. **Add history retrieval methods**
   - get_quote_history: retrieve all history for quote
   - get_recent_history: last N events
   - filter_by_event_type: specific events only

7. **Add history to API responses (optional)**
   - Include history in quote detail API
   - Allow filtering by event type
   - Pagination for long histories

### Implementation

```python
# In QuoteService
def log_history(
    self,
    quote: Quote,
    event_type: str,
    user: 'User' = None,
    notes: str = '',
    old_values: dict = None,
    new_values: dict = None
):
    """
    Log quote history event.
    
    Args:
        quote: Quote instance
        event_type: Type of event (use QuoteHistory constants)
        user: User who performed action
        notes: Additional context
        old_values: Previous field values
        new_values: New field values
    """
    from apps.quotes.models import QuoteHistory
    
    QuoteHistory.objects.create(
        quote=quote,
        event_type=event_type,
        user=user,
        old_values=old_values,
        new_values=new_values,
        notes=notes
    )
    
    logger.debug(
        f"Logged {event_type} event for quote {quote.quote_number}"
    )

# Update status transition methods
@transaction.atomic
def send_quote(self, quote_id: int, user: User) -> Quote:
    # ... existing logic ...
    
    quote.status = 'SENT'
    quote.sent_at = timezone.now()
    quote.save()
    
    # Log history
    self.log_history(
        quote=quote,
        event_type=QuoteHistory.SENT,
        user=user,
        notes=f"Quote sent to {quote.get_recipient_email()}",
        old_values={'status': 'DRAFT'},
        new_values={'status': 'SENT'}
    )
    
    return quote

@transaction.atomic
def accept_quote(self, quote_id: int, user: User) -> Quote:
    # ... existing logic ...
    
    quote.status = 'ACCEPTED'
    quote.accepted_at = timezone.now()
    quote.save()
    
    # Log history
    self.log_history(
        quote=quote,
        event_type=QuoteHistory.ACCEPTED,
        user=user,
        notes="Quote accepted by customer",
        old_values={'status': 'SENT'},
        new_values={'status': 'ACCEPTED'}
    )
    
    return quote

@transaction.atomic
def convert_to_order(self, quote_id: int, user: User) -> 'Order':
    # ... existing conversion logic ...
    
    # Log history
    self.log_history(
        quote=quote,
        event_type=QuoteHistory.CONVERTED,
        user=user,
        notes=f"Converted to order {order.order_number}",
        new_values={'converted_to_order_id': order.id}
    )
    
    return order

# History retrieval methods
def get_quote_history(self, quote_id: int, event_type: str = None):
    """
    Get history for quote.
    
    Args:
        quote_id: Quote ID
        event_type: Optional filter by event type
    
    Returns:
        QuerySet: History entries
    """
    from apps.quotes.models import QuoteHistory
    
    qs = QuoteHistory.objects.filter(quote_id=quote_id)
    
    if event_type:
        qs = qs.filter(event_type=event_type)
    
    return qs.select_related('user')

def get_recent_history(self, quote_id: int, limit: int = 10):
    """Get most recent history events."""
    return self.get_quote_history(quote_id)[:limit]
```

### Signal Handler for Auto-Logging

```python
# In apps/quotes/signals/recalculation.py or new history.py

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver


@receiver(pre_save, sender=Quote)
def capture_quote_pre_save(sender, instance, **kwargs):
    """Capture old values before save."""
    if instance.pk:
        try:
            instance._pre_save_instance = Quote.objects.get(pk=instance.pk)
        except Quote.DoesNotExist:
            instance._pre_save_instance = None


@receiver(post_save, sender=Quote)
def log_quote_changes(sender, instance, created, **kwargs):
    """Log quote changes to history."""
    from apps.quotes.models import QuoteHistory
    
    if created:
        # Quote creation
        QuoteHistory.objects.create(
            quote=instance,
            event_type=QuoteHistory.CREATED,
            user=getattr(instance, 'created_by', None),
            new_values={
                'quote_number': instance.quote_number,
                'customer': str(instance.customer) if instance.customer else None,
                'total': str(instance.total)
            },
            notes="Quote created"
        )
    else:
        # Quote update - check for significant changes
        old = getattr(instance, '_pre_save_instance', None)
        if old:
            changes = {}
            
            # Track important field changes
            for field in ['status', 'total', 'discount_value', 'valid_until']:
                old_val = getattr(old, field, None)
                new_val = getattr(instance, field, None)
                
                if old_val != new_val:
                    changes[field] = {
                        'old': str(old_val),
                        'new': str(new_val)
                    }
            
            if changes:
                QuoteHistory.objects.create(
                    quote=instance,
                    event_type=QuoteHistory.UPDATED,
                    old_values={k: v['old'] for k, v in changes.items()},
                    new_values={k: v['new'] for k, v in changes.items()},
                    notes=f"Fields updated: {', '.join(changes.keys())}"
                )
```

### Usage Examples

```python
service = QuoteService()

# Get quote history
history = service.get_quote_history(quote.id)
for entry in history:
    print(f"{entry.timestamp}: {entry.get_event_type_display()}")
    print(f"  By: {entry.user.email if entry.user else 'System'}")
    print(f"  Notes: {entry.notes}")
    print(f"  Changes: {entry.get_changes_summary()}")

# Filter specific events
sent_events = service.get_quote_history(
    quote.id,
    event_type=QuoteHistory.SENT
)

# Get recent history
recent = service.get_recent_history(quote.id, limit=5)
```

### History Timeline Example

```
2026-01-23 14:30 - Quote Created
  By: sales@example.com
  Notes: Quote created
  Total: ₨10,000.00

2026-01-23 14:35 - Quote Updated
  By: sales@example.com
  Changes: discount_value: 0.00 → 10.00
           total: 10,000.00 → 9,000.00

2026-01-23 15:00 - Sent to Customer
  By: sales@example.com
  Notes: Quote sent to customer@example.com

2026-01-24 09:15 - Customer Accepted
  By: customer@example.com
  Notes: Quote accepted by customer

2026-01-24 10:00 - Converted to Order
  By: sales@example.com
  Notes: Converted to order ORD-2026-001
```

### Expected Outcome
```python
# Automatic history tracking
quote = service.create_quote(...)
# History: CREATED event logged

service.send_quote(quote.id, user)
# History: SENT event logged

# View history
history = quote.history.all()
# [
#   <QuoteHistory: SENT>,
#   <QuoteHistory: CREATED>
# ]
```

### Verification Checklist
- [ ] log_history() method in QuoteService
- [ ] History logged in send_quote()
- [ ] History logged in accept_quote()
- [ ] History logged in reject_quote()
- [ ] History logged in expire_quote()
- [ ] History logged in convert_to_order()
- [ ] Signal handler for automatic logging
- [ ] Captures old values before save
- [ ] Logs significant field changes
- [ ] get_quote_history() retrieval method
- [ ] get_recent_history() method
- [ ] Event type filtering
- [ ] User tracking in history
- [ ] Notes/context captured

---

## Summary

After completing Tasks 44-49, the Quote Service will have:

### Order Conversion
- convert_to_order() method
- Creates Order from Quote
- Copies all line items
- Updates quote status to CONVERTED
- Links quote and order

### Inventory Validation
- validate_inventory_availability()
- Checks stock before conversion
- Detailed shortage reporting
- allow_backorder option
- Prevents overselling

### Quote Revision
- create_revision() method
- Linked revision chain
- revision_number tracking
- is_latest_revision flag
- get_revision_history()
- Maintains full audit trail

### Quote Locking
- is_locked property
- can_edit() and can_delete() methods
- Prevents editing sent/accepted quotes
- save() enforcement
- validate_not_locked decorator
- Clear error messages

### History Tracking
- QuoteHistory model
- Event types for all transitions
- old_values and new_values JSONFields
- User and timestamp tracking
- Notes for context

### History Logging
- Automatic logging via signals
- Manual logging in service methods
- Change detection and comparison
- History retrieval methods
- Timeline view capability

### Complete Lifecycle

```
DRAFT
  │ [CREATED event logged]
  ▼
Edit & Update
  │ [UPDATED events logged]
  ▼
Send to Customer
  │ [SENT event logged]
  ▼
Customer Response
  ├→ Accept [ACCEPTED event logged]
  │   └→ Convert [CONVERTED event logged]
  ├→ Reject [REJECTED event logged]
  └→ Expire [EXPIRED event logged]
```

### Next Steps
Proceed to [03_Tasks-50-52_Settings-Validity-Migration.md](03_Tasks-50-52_Settings-Validity-Migration.md) to implement quote settings and finalize migrations.
