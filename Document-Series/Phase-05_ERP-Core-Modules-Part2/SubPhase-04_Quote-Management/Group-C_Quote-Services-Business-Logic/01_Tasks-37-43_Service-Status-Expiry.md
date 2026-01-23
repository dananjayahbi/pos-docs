# Tasks 37-43: Service, Status Transitions & Expiry

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** C - Quote Services & Business Logic  
> **Document:** 01 of 03  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42, 43

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-44-49_Conversion-Revision-History.md](02_Tasks-44-49_Conversion-Revision-History.md)

---

## Document Overview

This document covers the creation of the QuoteService class with methods for quote creation, duplication, status transitions, transition validation, expiry checking, and automated expiry tasks using Celery.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create QuoteService Class | Medium | 25 min |
| 38 | Implement Quote Creation | Medium | 25 min |
| 39 | Implement Quote Duplication | Medium | 25 min |
| 40 | Implement Quote Status Transitions | High | 30 min |
| 41 | Add Status Transition Validation | Medium | 25 min |
| 42 | Implement Quote Expiry Check | Medium | 25 min |
| 43 | Create Expiry Celery Task | Medium | 25 min |

---

## Task 37: Create QuoteService Class

### Overview
Create the QuoteService class that encapsulates all business logic operations for quotes, providing a clean service layer above the models.

### Dependencies
- Group A: Quote model exists
- Group B: QuoteLineItem and QuoteCalculationService exist

### Instructions

1. **Create quote_service.py file**
   - Navigate to `apps/quotes/services/`
   - Create new file `quote_service.py`

2. **Import required modules**
   - Import Quote, QuoteLineItem models
   - Import QuoteCalculationService
   - Import User model
   - Import typing annotations
   - Import timezone, datetime utilities
   - Import transaction decorator

3. **Define QuoteService class**
   - Add comprehensive docstring
   - Explain service purpose and responsibilities
   - List main methods

4. **Add __init__ method**
   - Optional: accept quote instance
   - Can be used for both instance and class methods
   - Store quote if provided

5. **Define status transition constants**
   - ALLOWED_TRANSITIONS dict
   - Maps current status to allowed next statuses
   - Example: 'DRAFT': ['SENT'], 'SENT': ['ACCEPTED', 'REJECTED', 'EXPIRED']

6. **Add _validate_status_transition method**
   - Private helper method
   - Check if transition is allowed
   - Raise ValueError if not allowed
   - Return True if valid

7. **Add get_quote_or_404 helper method**
   - Accept quote_id parameter
   - Query Quote model
   - Raise appropriate exception if not found
   - Return quote instance

8. **Add business rule validation methods**
   - _can_edit_quote(quote) - check if quote can be edited
   - _can_delete_quote(quote) - check if quote can be deleted
   - _can_send_quote(quote) - check if quote ready to send

9. **Update services __init__.py**
   - Import QuoteService
   - Add to __all__

10. **Add logging configuration**
    - Import logging module
    - Get logger instance
    - Log service operations

### Service Structure

```python
# apps/quotes/services/quote_service.py

import logging
from decimal import Decimal
from typing import Dict, List, Optional
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError

from apps.quotes.models import Quote, QuoteLineItem
from apps.quotes.services.calculation import QuoteCalculationService
from apps.users.models import User

logger = logging.getLogger(__name__)


class QuoteService:
    """
    Service class for quote business operations.
    
    Handles:
    - Quote creation with line items
    - Quote duplication
    - Status transitions (send, accept, reject, expire)
    - Quote to order conversion
    - Quote revisions
    - Business logic validation
    """
    
    # Allowed status transitions
    ALLOWED_TRANSITIONS = {
        'DRAFT': ['SENT'],
        'SENT': ['ACCEPTED', 'REJECTED', 'EXPIRED'],
        'ACCEPTED': ['CONVERTED'],
        'REJECTED': [],  # Terminal state
        'EXPIRED': [],   # Terminal state
        'CONVERTED': [], # Terminal state
    }
    
    def __init__(self, quote=None):
        """
        Initialize service.
        
        Args:
            quote: Optional Quote instance for instance methods
        """
        self.quote = quote
    
    def _validate_status_transition(self, from_status, to_status):
        """
        Validate if status transition is allowed.
        
        Args:
            from_status: Current status
            to_status: Target status
        
        Returns:
            bool: True if valid
        
        Raises:
            ValueError: If transition not allowed
        """
        allowed = self.ALLOWED_TRANSITIONS.get(from_status, [])
        
        if to_status not in allowed:
            raise ValueError(
                f"Cannot transition from {from_status} to {to_status}. "
                f"Allowed transitions: {', '.join(allowed) if allowed else 'None'}"
            )
        
        return True
    
    def _can_edit_quote(self, quote):
        """Check if quote can be edited."""
        return quote.status in ['DRAFT', 'SENT']
    
    def _can_delete_quote(self, quote):
        """Check if quote can be deleted."""
        return quote.status == 'DRAFT'
    
    def _can_send_quote(self, quote):
        """Check if quote is ready to send."""
        if quote.status != 'DRAFT':
            return False
        if not quote.line_items.exists():
            return False
        if not quote.customer and not quote.guest_email:
            return False
        return True
```

### Status Transition Diagram

```
┌───────┐
│ DRAFT │ ─────send()────→ ┌──────┐
└───────┘                    │ SENT │
                             └──────┘
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
             accept()      reject()      expire()
                  │             │             │
                  ▼             ▼             ▼
             ┌──────────┐  ┌──────────┐  ┌─────────┐
             │ ACCEPTED │  │ REJECTED │  │ EXPIRED │
             └──────────┘  └──────────┘  └─────────┘
                  │
            convert()
                  │
                  ▼
             ┌───────────┐
             │ CONVERTED │
             └───────────┘
```

### Expected Outcome
```
apps/quotes/services/
├── __init__.py
├── calculation.py
└── quote_service.py          # New service file
```

### Verification Checklist
- [ ] quote_service.py file created
- [ ] QuoteService class defined
- [ ] ALLOWED_TRANSITIONS constant defined
- [ ] __init__ method accepts optional quote
- [ ] _validate_status_transition() method
- [ ] _can_edit_quote() validation method
- [ ] _can_delete_quote() validation method
- [ ] _can_send_quote() validation method
- [ ] Logging configured
- [ ] Imported in services __init__.py

---

## Task 38: Implement Quote Creation

### Overview
Implement the create_quote method that creates a new quote with line items, applies default settings, and calculates totals.

### Dependencies
- Task 37: QuoteService class exists

### Instructions

1. **Open quote_service.py**
   - Navigate to `apps/quotes/services/quote_service.py`

2. **Add create_quote method**
   - Accept quote_data dict
   - Accept line_items list of dicts
   - Accept user (creator)
   - Use @transaction.atomic decorator
   - Return created quote

3. **Extract and validate quote data**
   - Get customer or guest fields
   - Get title, notes, terms
   - Get validity period or use default
   - Validate required fields present

4. **Generate quote number**
   - Call quote.generate_quote_number() if available
   - Or use custom numbering logic
   - Ensure uniqueness within tenant

5. **Create Quote instance**
   - Set status to DRAFT
   - Set created_by to user
   - Set issue_date to today
   - Calculate valid_until from validity days
   - Save quote

6. **Create line items**
   - Iterate through line_items list
   - Create QuoteLineItem for each
   - Link to quote
   - Set position automatically
   - Handle both product-based and custom items

7. **Apply default settings**
   - Get QuoteSettings for tenant if exists
   - Apply default discount if configured
   - Apply default tax settings
   - Apply default terms if not provided

8. **Calculate totals**
   - Create QuoteCalculationService instance
   - Call calculate_all(save=True)
   - Ensure all financial fields populated

9. **Log creation**
   - Log quote creation event
   - Include quote number, user, line item count

10. **Return created quote**
    - Refresh from database
    - Return quote with all relations loaded

### Implementation

```python
@transaction.atomic
def create_quote(
    self,
    quote_data: Dict,
    line_items: List[Dict],
    user: User
) -> Quote:
    """
    Create new quote with line items.
    
    Args:
        quote_data: Quote fields (customer, title, notes, etc.)
        line_items: List of line item dicts
        user: User creating the quote
    
    Returns:
        Quote: Created quote with calculated totals
    
    Example:
        service = QuoteService()
        quote = service.create_quote(
            quote_data={
                'customer_id': customer.id,
                'title': 'Website Development Quote',
                'validity_days': 30
            },
            line_items=[
                {
                    'product_id': product.id,
                    'quantity': 1,
                    'unit_price': 50000.00
                }
            ],
            user=request.user
        )
    """
    logger.info(f"Creating quote by user {user.email}")
    
    # Extract data
    customer_id = quote_data.get('customer_id')
    title = quote_data.get('title', 'New Quote')
    validity_days = quote_data.get('validity_days', 30)
    
    # Calculate dates
    issue_date = timezone.now().date()
    valid_until = issue_date + timezone.timedelta(days=validity_days)
    
    # Create quote
    quote = Quote.objects.create(
        customer_id=customer_id,
        guest_name=quote_data.get('guest_name'),
        guest_email=quote_data.get('guest_email'),
        guest_phone=quote_data.get('guest_phone'),
        title=title,
        status='DRAFT',
        issue_date=issue_date,
        valid_until=valid_until,
        notes=quote_data.get('notes', ''),
        terms_and_conditions=quote_data.get('terms', ''),
        discount_type=quote_data.get('discount_type'),
        discount_value=Decimal(str(quote_data.get('discount_value', 0))),
        created_by=user
    )
    
    logger.debug(f"Quote created with ID {quote.id}")
    
    # Create line items
    for idx, item_data in enumerate(line_items):
        line_item = QuoteLineItem(
            quote=quote,
            position=idx,
            product_id=item_data.get('product_id'),
            variant_id=item_data.get('variant_id'),
            product_name=item_data.get('product_name', ''),
            custom_description=item_data.get('custom_description', ''),
            quantity=Decimal(str(item_data.get('quantity', 1))),
            unit_of_measure=item_data.get('unit_of_measure', 'unit'),
            unit_price=Decimal(str(item_data.get('unit_price', 0))),
            discount_type=item_data.get('discount_type'),
            discount_value=Decimal(str(item_data.get('discount_value', 0))),
            is_taxable=item_data.get('is_taxable', True),
            tax_rate=Decimal(str(item_data.get('tax_rate', 0))),
            notes=item_data.get('notes', '')
        )
        
        # Snapshot prices if product provided
        if line_item.product:
            line_item.snapshot_from_product(
                line_item.product,
                line_item.variant
            )
        
        line_item.save()
    
    logger.debug(f"Created {len(line_items)} line items")
    
    # Calculate totals
    calc_service = QuoteCalculationService(quote)
    quote = calc_service.calculate_all(save=True)
    
    logger.info(
        f"Quote {quote.quote_number} created with "
        f"{line_items.__len__()} items, total: {quote.total}"
    )
    
    return quote
```

### Usage Example

```python
from apps.quotes.services import QuoteService

service = QuoteService()

quote = service.create_quote(
    quote_data={
        'customer_id': customer.id,
        'title': 'Office Furniture Quote',
        'validity_days': 30,
        'notes': 'Delivery included',
        'discount_type': 'PERCENTAGE',
        'discount_value': 10.00
    },
    line_items=[
        {
            'product_id': desk.id,
            'quantity': 5,
            'unit_price': 15000.00,
            'is_taxable': True,
            'tax_rate': 15.00
        },
        {
            'product_id': chair.id,
            'quantity': 10,
            'unit_price': 5000.00,
            'is_taxable': True,
            'tax_rate': 15.00
        }
    ],
    user=request.user
)

print(f"Created quote: {quote.quote_number}")
print(f"Total: ₨ {quote.total}")
```

### Validation Requirements

| Field | Validation |
|-------|------------|
| customer OR guest_email | At least one required |
| line_items | Must have at least one item |
| quantity | Must be > 0 |
| unit_price | Must be >= 0 |
| validity_days | Must be > 0 |

### Expected Outcome
```python
# Complete quote with all calculations
quote = service.create_quote(...)

# Quote properties:
assert quote.status == 'DRAFT'
assert quote.quote_number is not None
assert quote.line_items.count() > 0
assert quote.subtotal > 0
assert quote.total > 0
assert quote.created_by == user
```

### Verification Checklist
- [ ] create_quote() method implemented
- [ ] Accepts quote_data, line_items, user parameters
- [ ] Transaction wrapper for atomicity
- [ ] Validates required fields
- [ ] Generates/sets quote number
- [ ] Creates Quote with DRAFT status
- [ ] Sets issue_date and valid_until
- [ ] Creates all line items
- [ ] Snapshots product prices
- [ ] Calculates totals using QuoteCalculationService
- [ ] Logs creation event
- [ ] Returns fully populated quote

---

## Task 39: Implement Quote Duplication

### Overview
Implement the duplicate_quote method that creates a copy of an existing quote as a new draft with all line items.

### Dependencies
- Task 38: Quote creation implemented

### Instructions

1. **Add duplicate_quote method**
   - Accept quote_id or quote instance
   - Accept user (duplicator)
   - Use @transaction.atomic decorator
   - Return new quote

2. **Load source quote**
   - Get original quote by ID
   - Prefetch line_items for efficiency
   - Verify user has permission to duplicate

3. **Create new quote instance**
   - Copy all relevant fields from original
   - Set status to DRAFT
   - Generate new quote_number
   - Set created_by to user
   - Set new issue_date (today)
   - Calculate new valid_until
   - Clear conversion references

4. **Update title**
   - Append " (Copy)" or " (Duplicate)"
   - Or increment number if already numbered
   - Make clear it's a duplicate

5. **Copy line items**
   - Iterate through original line items
   - Create new line item for each
   - Copy all fields including prices (snapshot)
   - Maintain same ordering (position)
   - Don't recalculate prices from products

6. **Recalculate totals**
   - Use QuoteCalculationService
   - Calculate all totals for new quote
   - Save quote

7. **Log duplication**
   - Log source quote number
   - Log new quote number
   - Log user who duplicated

8. **Return new quote**
   - Return duplicated quote
   - Include line items in response

### Implementation

```python
@transaction.atomic
def duplicate_quote(
    self,
    quote_id: int,
    user: User
) -> Quote:
    """
    Duplicate existing quote as new draft.
    
    Args:
        quote_id: ID of quote to duplicate
        user: User performing duplication
    
    Returns:
        Quote: New draft quote with copied line items
    
    Example:
        service = QuoteService()
        new_quote = service.duplicate_quote(
            quote_id=original_quote.id,
            user=request.user
        )
    """
    # Load original quote
    original_quote = Quote.objects.prefetch_related(
        'line_items'
    ).get(id=quote_id)
    
    logger.info(
        f"Duplicating quote {original_quote.quote_number} "
        f"by user {user.email}"
    )
    
    # Create new quote
    new_quote = Quote.objects.create(
        customer=original_quote.customer,
        guest_name=original_quote.guest_name,
        guest_email=original_quote.guest_email,
        guest_phone=original_quote.guest_phone,
        title=f"{original_quote.title} (Copy)",
        status='DRAFT',
        issue_date=timezone.now().date(),
        valid_until=timezone.now().date() + timezone.timedelta(days=30),
        notes=original_quote.notes,
        terms_and_conditions=original_quote.terms_and_conditions,
        discount_type=original_quote.discount_type,
        discount_value=original_quote.discount_value,
        created_by=user
    )
    
    logger.debug(f"Created new quote with ID {new_quote.id}")
    
    # Copy line items
    for original_item in original_quote.line_items.all():
        QuoteLineItem.objects.create(
            quote=new_quote,
            position=original_item.position,
            product=original_item.product,
            variant=original_item.variant,
            product_name=original_item.product_name,
            custom_description=original_item.custom_description,
            custom_sku=original_item.custom_sku,
            quantity=original_item.quantity,
            unit_of_measure=original_item.unit_of_measure,
            unit_price=original_item.unit_price,
            original_price=original_item.original_price,
            cost_price=original_item.cost_price,
            discount_type=original_item.discount_type,
            discount_value=original_item.discount_value,
            is_taxable=original_item.is_taxable,
            tax_rate=original_item.tax_rate,
            notes=original_item.notes
        )
    
    line_count = original_quote.line_items.count()
    logger.debug(f"Copied {line_count} line items")
    
    # Calculate totals
    calc_service = QuoteCalculationService(new_quote)
    new_quote = calc_service.calculate_all(save=True)
    
    logger.info(
        f"Quote duplicated: {original_quote.quote_number} → "
        f"{new_quote.quote_number}"
    )
    
    return new_quote
```

### Duplication Behavior

| Original Field | Duplicated Value |
|----------------|------------------|
| customer | Same customer |
| line_items | All copied with same prices |
| status | Always DRAFT |
| quote_number | New unique number |
| issue_date | Today's date |
| valid_until | Calculated from today |
| title | Appended with "(Copy)" |
| created_by | Duplicating user |
| Financial totals | Recalculated |

### Usage Examples

```python
# Duplicate a sent quote to revise
original_quote = Quote.objects.get(quote_number='QT-2026-001')
service = QuoteService()

new_quote = service.duplicate_quote(
    quote_id=original_quote.id,
    user=request.user
)

# New quote is editable draft
assert new_quote.status == 'DRAFT'
assert new_quote.quote_number != original_quote.quote_number
assert new_quote.title == f"{original_quote.title} (Copy)"
assert new_quote.line_items.count() == original_quote.line_items.count()
```

### Use Cases

1. **Customer wants revised quote**
   - Duplicate original
   - Modify prices/items
   - Send new quote

2. **Similar quote for different customer**
   - Duplicate
   - Change customer
   - Adjust as needed

3. **Template-based quotes**
   - Keep template quote
   - Duplicate for each customer
   - Customize

### Expected Outcome
```python
# Original quote remains unchanged
original.status  # 'SENT' or 'ACCEPTED'
original.quote_number  # 'QT-2026-001'

# New quote is independent copy
duplicate.status  # 'DRAFT'
duplicate.quote_number  # 'QT-2026-015'
duplicate.title  # 'Original Title (Copy)'
duplicate.line_items.count()  # Same as original
```

### Verification Checklist
- [ ] duplicate_quote() method implemented
- [ ] Accepts quote_id and user parameters
- [ ] Transaction wrapper for atomicity
- [ ] Loads original quote with line items
- [ ] Creates new quote with DRAFT status
- [ ] Generates new unique quote_number
- [ ] Sets new issue_date and valid_until
- [ ] Appends "(Copy)" to title
- [ ] Copies all line items with prices
- [ ] Maintains line item ordering
- [ ] Recalculates totals
- [ ] Logs duplication
- [ ] Original quote unchanged

---

## Task 40: Implement Quote Status Transitions

### Overview
Implement methods for quote status transitions: send_quote, accept_quote, reject_quote for managing the quote lifecycle.

### Dependencies
- Task 37: Status transition validation exists

### Instructions

1. **Implement send_quote method**
   - Accept quote_id and user
   - Validate quote is DRAFT
   - Validate quote has line items
   - Validate customer/guest info present
   - Change status to SENT
   - Record sent_at timestamp
   - Lock quote from editing (optional)
   - Return updated quote

2. **Implement accept_quote method**
   - Accept quote_id and user
   - Validate quote is SENT
   - Change status to ACCEPTED
   - Record accepted_at timestamp
   - Record accepted_by user
   - Return updated quote

3. **Implement reject_quote method**
   - Accept quote_id, user, and optional reason
   - Validate quote is SENT
   - Change status to REJECTED
   - Record rejected_at timestamp
   - Record rejection_reason
   - Return updated quote

4. **Add status timestamps to Quote model (if not exists)**
   - sent_at: DateTimeField (null=True)
   - accepted_at: DateTimeField (null=True)
   - rejected_at: DateTimeField (null=True)
   - expired_at: DateTimeField (null=True)
   - converted_at: DateTimeField (null=True)

5. **Add validation helpers**
   - _ensure_has_line_items(quote)
   - _ensure_has_recipient(quote)
   - _ensure_not_expired(quote)

6. **Add status change notifications**
   - Trigger email notifications
   - Update history (Task 49)
   - Log status changes

7. **Use transactions**
   - Wrap each method in @transaction.atomic
   - Ensure atomicity

### Implementation

```python
@transaction.atomic
def send_quote(
    self,
    quote_id: int,
    user: User
) -> Quote:
    """
    Send quote to customer (DRAFT → SENT).
    
    Args:
        quote_id: Quote ID
        user: User sending the quote
    
    Returns:
        Quote: Updated quote
    
    Raises:
        ValueError: If quote cannot be sent
    """
    quote = Quote.objects.select_for_update().get(id=quote_id)
    
    logger.info(
        f"Sending quote {quote.quote_number} by user {user.email}"
    )
    
    # Validate current status
    self._validate_status_transition(quote.status, 'SENT')
    
    # Validate quote is ready
    if not quote.line_items.exists():
        raise ValueError("Cannot send quote without line items")
    
    if not quote.customer and not quote.guest_email:
        raise ValueError("Cannot send quote without customer or guest email")
    
    # Update status
    quote.status = 'SENT'
    quote.sent_at = timezone.now()
    quote.sent_by = user
    quote.save(update_fields=['status', 'sent_at', 'sent_by', 'updated_at'])
    
    logger.info(f"Quote {quote.quote_number} sent successfully")
    
    return quote

@transaction.atomic
def accept_quote(
    self,
    quote_id: int,
    user: User
) -> Quote:
    """
    Accept quote (SENT → ACCEPTED).
    
    Args:
        quote_id: Quote ID
        user: User accepting (customer or staff)
    
    Returns:
        Quote: Updated quote
    """
    quote = Quote.objects.select_for_update().get(id=quote_id)
    
    logger.info(
        f"Accepting quote {quote.quote_number} by user {user.email}"
    )
    
    # Validate transition
    self._validate_status_transition(quote.status, 'ACCEPTED')
    
    # Check not expired
    if quote.valid_until < timezone.now().date():
        raise ValueError("Cannot accept expired quote")
    
    # Update status
    quote.status = 'ACCEPTED'
    quote.accepted_at = timezone.now()
    quote.accepted_by = user
    quote.save(update_fields=[
        'status',
        'accepted_at',
        'accepted_by',
        'updated_at'
    ])
    
    logger.info(f"Quote {quote.quote_number} accepted")
    
    return quote

@transaction.atomic
def reject_quote(
    self,
    quote_id: int,
    user: User,
    reason: str = ''
) -> Quote:
    """
    Reject quote (SENT → REJECTED).
    
    Args:
        quote_id: Quote ID
        user: User rejecting
        reason: Optional rejection reason
    
    Returns:
        Quote: Updated quote
    """
    quote = Quote.objects.select_for_update().get(id=quote_id)
    
    logger.info(
        f"Rejecting quote {quote.quote_number} by user {user.email}"
    )
    
    # Validate transition
    self._validate_status_transition(quote.status, 'REJECTED')
    
    # Update status
    quote.status = 'REJECTED'
    quote.rejected_at = timezone.now()
    quote.rejected_by = user
    quote.rejection_reason = reason
    quote.save(update_fields=[
        'status',
        'rejected_at',
        'rejected_by',
        'rejection_reason',
        'updated_at'
    ])
    
    logger.info(f"Quote {quote.quote_number} rejected: {reason}")
    
    return quote
```

### Status Transition Rules

```python
ALLOWED_TRANSITIONS = {
    'DRAFT': ['SENT'],
    'SENT': ['ACCEPTED', 'REJECTED', 'EXPIRED'],
    'ACCEPTED': ['CONVERTED'],
    'REJECTED': [],
    'EXPIRED': [],
    'CONVERTED': []
}
```

### Usage Examples

```python
service = QuoteService()

# Send quote to customer
quote = service.send_quote(
    quote_id=quote.id,
    user=sales_rep
)
# quote.status = 'SENT'
# quote.sent_at = now()

# Customer accepts
quote = service.accept_quote(
    quote_id=quote.id,
    user=customer_user
)
# quote.status = 'ACCEPTED'
# quote.accepted_at = now()

# Or customer rejects
quote = service.reject_quote(
    quote_id=quote.id,
    user=customer_user,
    reason="Budget constraints"
)
# quote.status = 'REJECTED'
```

### Validation Scenarios

| Scenario | Result |
|----------|--------|
| Send DRAFT quote with items | Success |
| Send DRAFT quote without items | Error: No line items |
| Send DRAFT without customer/email | Error: No recipient |
| Accept SENT quote | Success |
| Accept DRAFT quote | Error: Invalid transition |
| Accept expired quote | Error: Quote expired |
| Reject SENT quote | Success |

### Expected Outcome
```python
# Lifecycle example
quote.status  # 'DRAFT'

service.send_quote(quote.id, user)
quote.refresh_from_db()
quote.status  # 'SENT'
quote.sent_at  # datetime

service.accept_quote(quote.id, customer)
quote.refresh_from_db()
quote.status  # 'ACCEPTED'
quote.accepted_at  # datetime
```

### Verification Checklist
- [ ] send_quote() method implemented
- [ ] accept_quote() method implemented
- [ ] reject_quote() method implemented
- [ ] Each method validates transition
- [ ] Each method uses transaction
- [ ] Timestamps recorded correctly
- [ ] User tracking (sent_by, accepted_by, etc.)
- [ ] Rejection reason captured
- [ ] Validates line items before sending
- [ ] Validates recipient before sending
- [ ] Checks expiry before accepting
- [ ] Logging for all transitions

---

## Task 41: Add Status Transition Validation

### Overview
Enhance status transition validation with comprehensive business rules and error messages.

### Dependencies
- Task 40: Status transition methods exist

### Instructions

1. **Create ValidationError custom exceptions**
   - QuoteValidationError base class
   - InvalidStatusTransition exception
   - QuoteExpiredError exception
   - QuoteLockedError exception

2. **Enhance _validate_status_transition**
   - Return detailed error messages
   - Suggest valid actions
   - Include current and target states

3. **Add validate_before_send method**
   - Check quote has line items
   - Check recipient (customer or guest email)
   - Check valid_until is future date
   - Check line items have prices
   - Return list of validation errors

4. **Add validate_before_accept method**
   - Check quote is SENT
   - Check not expired
   - Check totals calculated
   - Return validation results

5. **Add validate_before_convert method**
   - Check quote is ACCEPTED
   - Check inventory available (if needed)
   - Check customer is valid
   - Return validation results

6. **Create get_available_actions method**
   - Return list of allowed actions for current status
   - Include action names and labels
   - Useful for UI button rendering

7. **Add can_perform_action method**
   - Check if specific action allowed
   - Return boolean
   - Example: can_perform_action('send')

8. **Update transition methods**
   - Call validation before transition
   - Raise appropriate exceptions
   - Provide clear error messages

### Implementation

```python
# Custom exceptions
class QuoteValidationError(Exception):
    """Base exception for quote validation errors."""
    pass


class InvalidStatusTransition(QuoteValidationError):
    """Raised when invalid status transition attempted."""
    pass


class QuoteExpiredError(QuoteValidationError):
    """Raised when operation on expired quote attempted."""
    pass


class QuoteLockedError(QuoteValidationError):
    """Raised when editing locked quote attempted."""
    pass


# Enhanced validation
def validate_before_send(self, quote) -> List[str]:
    """
    Validate quote is ready to send.
    
    Returns:
        List of validation error messages (empty if valid)
    """
    errors = []
    
    # Check line items
    if not quote.line_items.exists():
        errors.append("Quote must have at least one line item")
    
    # Check recipient
    if not quote.customer and not quote.guest_email:
        errors.append("Quote must have customer or guest email")
    
    # Check validity period
    if quote.valid_until <= timezone.now().date():
        errors.append("Quote validity period must be in the future")
    
    # Check line item prices
    zero_price_items = quote.line_items.filter(unit_price=0)
    if zero_price_items.exists():
        errors.append(
            f"{zero_price_items.count()} line item(s) have zero price"
        )
    
    # Check totals calculated
    if quote.total is None or quote.total <= 0:
        errors.append("Quote totals not calculated")
    
    return errors

def get_available_actions(self, quote) -> List[Dict]:
    """
    Get list of available actions for quote status.
    
    Returns:
        List of action dicts with name, label, and enabled status
    """
    actions = []
    current_status = quote.status
    allowed_next = self.ALLOWED_TRANSITIONS.get(current_status, [])
    
    # Map statuses to actions
    if 'SENT' in allowed_next:
        actions.append({
            'name': 'send',
            'label': 'Send to Customer',
            'enabled': len(self.validate_before_send(quote)) == 0
        })
    
    if 'ACCEPTED' in allowed_next:
        actions.append({
            'name': 'accept',
            'label': 'Accept Quote',
            'enabled': not quote.is_expired()
        })
    
    if 'REJECTED' in allowed_next:
        actions.append({
            'name': 'reject',
            'label': 'Reject Quote',
            'enabled': True
        })
    
    if 'CONVERTED' in allowed_next:
        actions.append({
            'name': 'convert',
            'label': 'Convert to Order',
            'enabled': quote.status == 'ACCEPTED'
        })
    
    # Always available for drafts
    if current_status == 'DRAFT':
        actions.extend([
            {'name': 'edit', 'label': 'Edit Quote', 'enabled': True},
            {'name': 'delete', 'label': 'Delete Quote', 'enabled': True},
            {'name': 'duplicate', 'label': 'Duplicate', 'enabled': True}
        ])
    
    return actions

def can_perform_action(self, quote, action: str) -> bool:
    """
    Check if action can be performed on quote.
    
    Args:
        quote: Quote instance
        action: Action name (send, accept, reject, etc.)
    
    Returns:
        bool: True if action allowed
    """
    actions = self.get_available_actions(quote)
    for act in actions:
        if act['name'] == action:
            return act.get('enabled', False)
    return False
```

### Validation Error Messages

| Validation | Error Message |
|------------|---------------|
| No line items | "Quote must have at least one line item" |
| No recipient | "Quote must have customer or guest email" |
| Expired validity | "Quote validity period must be in the future" |
| Zero prices | "N line item(s) have zero price" |
| Invalid transition | "Cannot transition from X to Y" |
| Quote expired | "Quote expired on {date}" |
| Quote locked | "Cannot edit quote in {status} status" |

### Usage Examples

```python
service = QuoteService()

# Validate before sending
errors = service.validate_before_send(quote)
if errors:
    for error in errors:
        print(f"❌ {error}")
else:
    service.send_quote(quote.id, user)

# Get available actions for UI
actions = service.get_available_actions(quote)
# [
#   {'name': 'send', 'label': 'Send to Customer', 'enabled': True},
#   {'name': 'edit', 'label': 'Edit Quote', 'enabled': True}
# ]

# Check specific action
if service.can_perform_action(quote, 'send'):
    service.send_quote(quote.id, user)
```

### Expected Outcome
```python
# Comprehensive validation
try:
    service.send_quote(quote.id, user)
except QuoteValidationError as e:
    # Clear error message for user
    print(str(e))
    # "Quote must have at least one line item"
```

### Verification Checklist
- [ ] Custom exception classes defined
- [ ] QuoteValidationError base exception
- [ ] InvalidStatusTransition exception
- [ ] QuoteExpiredError exception
- [ ] QuoteLockedError exception
- [ ] validate_before_send() comprehensive checks
- [ ] validate_before_accept() method
- [ ] validate_before_convert() method
- [ ] get_available_actions() returns action list
- [ ] can_perform_action() checks permissions
- [ ] Clear, actionable error messages
- [ ] Transition methods use validation

---

## Task 42: Implement Quote Expiry Check

### Overview
Implement methods to check if quotes have expired and mark them as expired, including logic to handle expired quotes.

### Dependencies
- Task 40: Status transition methods exist

### Instructions

1. **Add is_expired property to Quote model**
   - @property decorator
   - Check if valid_until < today
   - Return boolean
   - Only check if status is SENT

2. **Add days_until_expiry property**
   - @property decorator
   - Calculate: valid_until - today
   - Return number of days
   - Negative if expired

3. **Implement expire_quote method in QuoteService**
   - Accept quote_id
   - Validate quote is SENT
   - Check if actually expired
   - Change status to EXPIRED
   - Record expired_at timestamp
   - Return updated quote

4. **Add check_and_expire_quote method**
   - Check if quote should be expired
   - Call expire_quote if needed
   - Return True if expired, False otherwise
   - Use in automated checks

5. **Add get_expiring_soon method**
   - Class method
   - Query quotes expiring in N days
   - Filter by SENT status
   - Return QuerySet
   - Useful for reminders

6. **Add get_expired_quotes method**
   - Class method
   - Query quotes that should be expired
   - Filter: status=SENT and valid_until < today
   - Return QuerySet
   - Used by Celery task

7. **Add bulk_expire_quotes method**
   - Accept QuerySet of quotes
   - Expire multiple quotes efficiently
   - Use bulk_update for performance
   - Return count of expired quotes

### Implementation

```python
# In Quote model (quote.py)
@property
def is_expired(self):
    """Check if quote has expired."""
    if self.status != 'SENT':
        return False
    return self.valid_until < timezone.now().date()

@property
def days_until_expiry(self):
    """Get days until quote expires (negative if expired)."""
    delta = self.valid_until - timezone.now().date()
    return delta.days


# In QuoteService
@transaction.atomic
def expire_quote(
    self,
    quote_id: int
) -> Quote:
    """
    Mark quote as expired (SENT → EXPIRED).
    
    Args:
        quote_id: Quote ID
    
    Returns:
        Quote: Updated quote
    """
    quote = Quote.objects.select_for_update().get(id=quote_id)
    
    logger.info(f"Expiring quote {quote.quote_number}")
    
    # Validate transition
    self._validate_status_transition(quote.status, 'EXPIRED')
    
    # Check actually expired
    if not quote.is_expired:
        raise ValueError(
            f"Quote {quote.quote_number} not yet expired "
            f"(valid until {quote.valid_until})"
        )
    
    # Update status
    quote.status = 'EXPIRED'
    quote.expired_at = timezone.now()
    quote.save(update_fields=['status', 'expired_at', 'updated_at'])
    
    logger.info(f"Quote {quote.quote_number} marked as expired")
    
    return quote

def check_and_expire_quote(self, quote_id: int) -> bool:
    """
    Check and expire quote if expired.
    
    Args:
        quote_id: Quote ID
    
    Returns:
        bool: True if quote was expired
    """
    try:
        quote = Quote.objects.get(id=quote_id)
        
        if quote.status == 'SENT' and quote.is_expired:
            self.expire_quote(quote_id)
            return True
        
        return False
    
    except Exception as e:
        logger.error(f"Error checking quote expiry: {e}")
        return False

@classmethod
def get_expired_quotes(cls):
    """
    Get all quotes that should be marked as expired.
    
    Returns:
        QuerySet: Quotes to expire
    """
    today = timezone.now().date()
    return Quote.objects.filter(
        status='SENT',
        valid_until__lt=today
    ).select_related('customer')

@classmethod
def get_expiring_soon(cls, days: int = 7):
    """
    Get quotes expiring within N days.
    
    Args:
        days: Number of days threshold
    
    Returns:
        QuerySet: Quotes expiring soon
    """
    today = timezone.now().date()
    threshold = today + timezone.timedelta(days=days)
    
    return Quote.objects.filter(
        status='SENT',
        valid_until__gte=today,
        valid_until__lte=threshold
    ).select_related('customer')

@classmethod
def bulk_expire_quotes(cls, quotes):
    """
    Expire multiple quotes efficiently.
    
    Args:
        quotes: QuerySet or list of Quote instances
    
    Returns:
        int: Number of quotes expired
    """
    now = timezone.now()
    count = 0
    
    with transaction.atomic():
        for quote in quotes:
            if quote.status == 'SENT' and quote.is_expired:
                quote.status = 'EXPIRED'
                quote.expired_at = now
                quote.save(update_fields=[
                    'status',
                    'expired_at',
                    'updated_at'
                ])
                count += 1
                logger.debug(f"Expired quote {quote.quote_number}")
    
    logger.info(f"Bulk expired {count} quotes")
    return count
```

### Expiry Logic

```python
# Quote is expired if:
status == 'SENT' AND valid_until < today

# Days until expiry:
days = (valid_until - today).days
# Positive: days remaining
# Zero: expires today
# Negative: expired N days ago
```

### Usage Examples

```python
service = QuoteService()

# Check if specific quote expired
quote = Quote.objects.get(id=1)
if quote.is_expired:
    service.expire_quote(quote.id)

# Get all expired quotes
expired = QuoteService.get_expired_quotes()
print(f"Found {expired.count()} expired quotes")

# Bulk expire
count = QuoteService.bulk_expire_quotes(expired)
print(f"Expired {count} quotes")

# Get quotes expiring soon (for reminders)
expiring_soon = QuoteService.get_expiring_soon(days=3)
for quote in expiring_soon:
    print(f"{quote.quote_number} expires in {quote.days_until_expiry} days")
```

### Expiry States

| Days Until Expiry | State | Action |
|-------------------|-------|--------|
| > 7 | Active | Normal |
| 1-7 | Expiring Soon | Send reminder |
| 0 | Expires Today | Urgent reminder |
| < 0 | Expired | Mark as EXPIRED |

### Expected Outcome
```python
# Automatic expiry detection
quote = Quote.objects.get(quote_number='QT-2026-001')
quote.status = 'SENT'
quote.valid_until = date(2026, 1, 15)

# Today is 2026-01-23
print(quote.is_expired)  # True
print(quote.days_until_expiry)  # -8

# Mark as expired
service = QuoteService()
quote = service.expire_quote(quote.id)
print(quote.status)  # 'EXPIRED'
```

### Verification Checklist
- [ ] is_expired property in Quote model
- [ ] days_until_expiry property
- [ ] expire_quote() method in service
- [ ] Validates transition to EXPIRED
- [ ] Records expired_at timestamp
- [ ] check_and_expire_quote() helper method
- [ ] get_expired_quotes() class method
- [ ] get_expiring_soon() class method
- [ ] bulk_expire_quotes() for efficiency
- [ ] Logging for expiry operations

---

## Task 43: Create Expiry Celery Task

### Overview
Create a Celery periodic task that automatically checks and expires quotes daily, with configurable scheduling.

### Dependencies
- Task 42: Expiry methods implemented
- Celery configured in project

### Instructions

1. **Create tasks directory and file**
   - Create directory `apps/quotes/tasks/`
   - Create `__init__.py`
   - Create `expiry.py`

2. **Import required modules**
   - from celery import shared_task
   - Import Quote model
   - Import QuoteService
   - Import logging

3. **Create expire_old_quotes task**
   - Use @shared_task decorator
   - Set task name
   - Add docstring explaining purpose
   - Return dict with results

4. **Implement task logic**
   - Get all expired quotes via QuoteService
   - Call bulk_expire_quotes
   - Count quotes expired
   - Return count and details

5. **Add error handling**
   - Try/except wrapper
   - Log errors
   - Return error info in result
   - Don't fail silently

6. **Add task monitoring**
   - Log task start
   - Log task completion
   - Log number of quotes processed
   - Include execution time

7. **Configure Celery Beat schedule**
   - Add to project celery.py or settings
   - Schedule for daily execution
   - Configure time (e.g., midnight)
   - Add timezone handling

8. **Add send_expiry_reminders task (optional)**
   - Send reminders for expiring soon quotes
   - Separate task from expiry
   - Can run more frequently

9. **Add task result storage**
   - Store task results in database/cache
   - Track last run time
   - Track success/failure

10. **Add manual trigger option**
    - Allow manual task execution
    - Management command wrapper
    - Admin action

### Implementation

```python
# apps/quotes/tasks/expiry.py

import logging
from datetime import datetime
from celery import shared_task
from django.utils import timezone

from apps.quotes.models import Quote
from apps.quotes.services import QuoteService

logger = logging.getLogger(__name__)


@shared_task(
    name='quotes.expire_old_quotes',
    bind=True,
    max_retries=3
)
def expire_old_quotes(self):
    """
    Celery task to automatically expire old quotes.
    
    Runs daily to mark quotes with status=SENT and
    valid_until < today as EXPIRED.
    
    Returns:
        dict: Task results with counts and details
    """
    start_time = datetime.now()
    logger.info("Starting expire_old_quotes task")
    
    try:
        # Get expired quotes
        expired_quotes = QuoteService.get_expired_quotes()
        total_count = expired_quotes.count()
        
        logger.info(f"Found {total_count} expired quotes")
        
        if total_count == 0:
            return {
                'success': True,
                'expired_count': 0,
                'message': 'No quotes to expire',
                'execution_time_seconds': (
                    datetime.now() - start_time
                ).total_seconds()
            }
        
        # Bulk expire quotes
        expired_count = QuoteService.bulk_expire_quotes(expired_quotes)
        
        duration = (datetime.now() - start_time).total_seconds()
        
        logger.info(
            f"Expired {expired_count} quotes in {duration:.2f} seconds"
        )
        
        return {
            'success': True,
            'expired_count': expired_count,
            'execution_time_seconds': duration,
            'timestamp': timezone.now().isoformat()
        }
    
    except Exception as exc:
        logger.error(f"Error expiring quotes: {exc}", exc_info=True)
        
        # Retry with exponential backoff
        raise self.retry(
            exc=exc,
            countdown=60 * (self.request.retries + 1)
        )


@shared_task(name='quotes.send_expiry_reminders')
def send_expiry_reminders(days_threshold=3):
    """
    Send email reminders for quotes expiring soon.
    
    Args:
        days_threshold: Days before expiry to send reminder
    
    Returns:
        dict: Task results
    """
    logger.info(
        f"Sending expiry reminders for quotes expiring "
        f"in {days_threshold} days"
    )
    
    try:
        # Get quotes expiring soon
        expiring_quotes = QuoteService.get_expiring_soon(days_threshold)
        count = expiring_quotes.count()
        
        logger.info(f"Found {count} quotes expiring soon")
        
        sent_count = 0
        for quote in expiring_quotes:
            # Send reminder email (implement in Task 77-79)
            # email_service.send_expiry_reminder(quote)
            sent_count += 1
        
        return {
            'success': True,
            'reminders_sent': sent_count,
            'timestamp': timezone.now().isoformat()
        }
    
    except Exception as exc:
        logger.error(f"Error sending reminders: {exc}", exc_info=True)
        return {
            'success': False,
            'error': str(exc)
        }
```

### Celery Beat Configuration

```python
# project/celery.py or settings/celery.py

from celery import Celery
from celery.schedules import crontab

app = Celery('lankacommerce')

# Periodic task schedule
app.conf.beat_schedule = {
    'expire-old-quotes-daily': {
        'task': 'quotes.expire_old_quotes',
        'schedule': crontab(hour=0, minute=0),  # Daily at midnight
        'options': {
            'expires': 3600,  # Task expires after 1 hour
        }
    },
    'send-expiry-reminders': {
        'task': 'quotes.send_expiry_reminders',
        'schedule': crontab(hour=9, minute=0),  # Daily at 9 AM
        'kwargs': {'days_threshold': 3},
        'options': {
            'expires': 1800,
        }
    }
}

# Timezone
app.conf.timezone = 'Asia/Colombo'
```

### Management Command (Optional)

```python
# apps/quotes/management/commands/expire_quotes.py

from django.core.management.base import BaseCommand
from apps.quotes.tasks import expire_old_quotes


class Command(BaseCommand):
    help = 'Manually expire old quotes'
    
    def handle(self, *args, **options):
        self.stdout.write("Expiring old quotes...")
        
        result = expire_old_quotes.delay()
        task_result = result.get(timeout=60)
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Expired {task_result['expired_count']} quotes"
            )
        )
```

### Task Monitoring

```python
# View task results
from apps.quotes.tasks import expire_old_quotes

# Run task
result = expire_old_quotes.delay()

# Get result
task_result = result.get()
print(task_result)
# {
#     'success': True,
#     'expired_count': 5,
#     'execution_time_seconds': 1.23,
#     'timestamp': '2026-01-23T00:00:00+05:30'
# }
```

### Celery Configuration Checklist

| Component | Configuration |
|-----------|---------------|
| Broker | Redis or RabbitMQ URL |
| Result Backend | Redis or Database |
| Timezone | Asia/Colombo |
| Beat Schedule | Crontab for daily run |
| Task Routing | Default queue |
| Retry Policy | 3 retries with backoff |

### Expected Outcome

```bash
# Celery worker logs
[2026-01-23 00:00:00: INFO] Starting expire_old_quotes task
[2026-01-23 00:00:01: INFO] Found 5 expired quotes
[2026-01-23 00:00:02: INFO] Expired 5 quotes in 1.23 seconds

# Quote statuses updated
QT-2026-001: SENT → EXPIRED
QT-2026-005: SENT → EXPIRED
QT-2026-012: SENT → EXPIRED
```

### Testing Celery Task

```python
# In tests
from apps.quotes.tasks import expire_old_quotes
from apps.quotes.models import Quote
from datetime import date, timedelta

def test_expire_old_quotes_task():
    # Create expired quote
    quote = Quote.objects.create(
        status='SENT',
        valid_until=date.today() - timedelta(days=5)
    )
    
    # Run task
    result = expire_old_quotes.delay()
    task_result = result.get()
    
    # Verify
    assert task_result['success'] is True
    assert task_result['expired_count'] == 1
    
    quote.refresh_from_db()
    assert quote.status == 'EXPIRED'
```

### Verification Checklist
- [ ] tasks/ directory created
- [ ] expiry.py file created
- [ ] expire_old_quotes task defined
- [ ] @shared_task decorator used
- [ ] Comprehensive error handling
- [ ] Logging for monitoring
- [ ] Return dict with results
- [ ] Retry logic on failure
- [ ] Celery Beat schedule configured
- [ ] Runs daily at midnight
- [ ] Timezone set to Asia/Colombo
- [ ] send_expiry_reminders task (optional)
- [ ] Management command for manual trigger
- [ ] Task monitoring and logging

---

## Summary

After completing Tasks 37-43, the Quote Service will have:

### QuoteService Class
- Centralized business logic
- Status transition management
- ALLOWED_TRANSITIONS rules
- Validation helpers

### Quote Operations
- create_quote() with line items
- duplicate_quote() for copying
- Transaction-safe operations

### Status Transitions
- send_quote() - DRAFT → SENT
- accept_quote() - SENT → ACCEPTED
- reject_quote() - SENT → REJECTED
- expire_quote() - SENT → EXPIRED

### Validation
- Comprehensive business rules
- Custom exception classes
- validate_before_send/accept/convert
- get_available_actions() for UI
- can_perform_action() checks

### Expiry Management
- is_expired property
- days_until_expiry calculation
- Manual expiry via service
- Bulk expiry for efficiency
- get_expired_quotes() query
- get_expiring_soon() for reminders

### Automated Expiry
- Celery periodic task
- Runs daily at midnight
- Bulk processes expired quotes
- Error handling and retries
- Task monitoring and logging
- Manual trigger via management command

### Status Flow

```
DRAFT
  ↓ send()
SENT
  ├→ accept() → ACCEPTED → convert() → CONVERTED
  ├→ reject() → REJECTED (terminal)
  └→ expire() → EXPIRED (terminal)
```

### Next Steps
Proceed to [02_Tasks-44-49_Conversion-Revision-History.md](02_Tasks-44-49_Conversion-Revision-History.md) to implement order conversion, revision, and history tracking.
