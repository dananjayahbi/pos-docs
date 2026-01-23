# Tasks 67-72: Return Models & Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** E - Returns & Cancellations  
> **Document:** 01 of 03  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-73-77_Return-Service-Workflow.md](02_Tasks-73-77_Return-Service-Workflow.md)

---

## Document Overview

This document covers the data models for handling product returns and RMA (Return Merchandise Authorization) requests.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create OrderReturn Model | Medium | 25 min |
| 68 | Add Return Reason Fields | Medium | 20 min |
| 69 | Add Return Status Fields | Medium | 20 min |
| 70 | Create ReturnLineItem Model | Medium | 25 min |
| 71 | Add Return Financial Fields | Medium | 20 min |
| 72 | Run Return Migrations | Low | 15 min |

---

## Task 67: Create OrderReturn Model

### Overview
Create the OrderReturn model to track return/RMA requests from customers or initiated by staff.

### Dependencies
- Order model (Group A)

### Instructions

1. **Create return model file**
   - Create `apps/orders/models/order_return.py`

2. **Import dependencies**
   - Import Django ORM components
   - Import timezone utilities
   - Import Order model

3. **Define OrderReturn model**
   - Inherit from models.Model
   - Add class Meta

4. **Add primary relationship fields**
   - `order`: ForeignKey to Order
   - Link with related_name='returns'

5. **Add identifier fields**
   - `return_number`: CharField, unique
   - Format: RET-{YEAR}-{SEQUENCE}
   - Auto-generated in save method

6. **Add request tracking fields**
   - `requested_at`: DateTimeField, auto_now_add
   - `requested_by`: ForeignKey to User (customer or staff)
   - `notes`: TextField for detailed explanation

7. **Add __str__ method**
   - Return return_number

8. **Add return number generation**
   - Override save method
   - Generate if not exists
   - Use atomic transaction

9. **Update models __init__.py**
   - Export OrderReturn

### Model Structure

```python
# Basic OrderReturn model structure (Task 67 only)

class OrderReturn(models.Model):
    """
    Represents a return request for an order.
    Supports full or partial returns.
    """
    
    # Primary relationship
    order = models.ForeignKey(
        'Order',
        on_delete=models.CASCADE,
        related_name='returns'
    )
    
    # Identifier
    return_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # Request tracking
    requested_at = models.DateTimeField(auto_now_add=True)
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='return_requests'
    )
    notes = models.TextField(blank=True)
    
    # Additional fields added in Tasks 68-71
    
    class Meta:
        db_table = 'order_returns'
        ordering = ['-requested_at']
        
    def __str__(self):
        return self.return_number
    
    def save(self, *args, **kwargs):
        if not self.return_number:
            self.return_number = self._generate_return_number()
        super().save(*args, **kwargs)
    
    def _generate_return_number(self):
        """Generate unique return number RET-{YEAR}-{SEQ}."""
        from django.db import transaction
        
        with transaction.atomic():
            year = timezone.now().year
            prefix = f"RET-{year}-"
            
            last_return = OrderReturn.objects.filter(
                return_number__startswith=prefix
            ).order_by('-return_number').first()
            
            if last_return:
                last_seq = int(last_return.return_number.split('-')[-1])
                new_seq = last_seq + 1
            else:
                new_seq = 1
            
            return f"{prefix}{new_seq:05d}"
```

### Expected Outcomes
- OrderReturn model created
- Linked to Order
- Return number auto-generated
- Request tracking fields present

---

## Task 68: Add Return Reason Fields

### Overview
Add fields to capture why the customer is returning the product.

### Dependencies
- Task 67: OrderReturn Model

### Instructions

1. **Define return reason choices**
   - Create choices tuple
   - Include common return reasons

2. **Add reason field**
   - `reason`: CharField with choices
   - Required field

3. **Add reason details field**
   - `reason_notes`: TextField
   - Additional explanation if needed

4. **Update model docstring**
   - Document reason choices

### Return Reason Choices

```python
class OrderReturn(models.Model):
    """Return request with reason tracking."""
    
    # Return Reason Choices
    REASON_DEFECTIVE = 'DEFECTIVE'
    REASON_WRONG_ITEM = 'WRONG_ITEM'
    REASON_CHANGED_MIND = 'CHANGED_MIND'
    REASON_NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED'
    REASON_BETTER_PRICE = 'BETTER_PRICE'
    REASON_DUPLICATE = 'DUPLICATE'
    REASON_OTHER = 'OTHER'
    
    REASON_CHOICES = [
        (REASON_DEFECTIVE, 'Product Defective/Damaged'),
        (REASON_WRONG_ITEM, 'Wrong Item Received'),
        (REASON_CHANGED_MIND, 'Changed Mind'),
        (REASON_NOT_AS_DESCRIBED, 'Not As Described'),
        (REASON_BETTER_PRICE, 'Found Better Price'),
        (REASON_DUPLICATE, 'Duplicate Order'),
        (REASON_OTHER, 'Other (See Notes)'),
    ]
    
    # ... existing fields ...
    
    # Reason fields
    reason = models.CharField(
        max_length=30,
        choices=REASON_CHOICES,
        help_text="Reason for return"
    )
    reason_notes = models.TextField(
        blank=True,
        help_text="Additional details about return reason"
    )
```

### Reason Usage Examples

```
Customer Returns:
─────────────────
DEFECTIVE → Product arrived broken
WRONG_ITEM → Ordered blue, received red
CHANGED_MIND → No longer need it
NOT_AS_DESCRIBED → Photo showed leather, received vinyl

Staff-Initiated Returns:
────────────────────────
WRONG_ITEM → Warehouse picked wrong item
DEFECTIVE → Quality control identified defect
```

### Expected Outcomes
- Reason field with choices added
- Reason notes for details added
- Common return scenarios covered

---

## Task 69: Add Return Status Fields

### Overview
Add status tracking fields to manage the return workflow from request to completion.

### Dependencies
- Task 68: Return Reason Fields

### Instructions

1. **Define return status choices**
   - Create status choices tuple
   - Follow return workflow stages

2. **Add status field**
   - `status`: CharField with choices
   - Default to REQUESTED

3. **Add workflow timestamp fields**
   - `approved_at`: DateTimeField, nullable
   - `rejected_at`: DateTimeField, nullable
   - `received_at`: DateTimeField, nullable
   - `refunded_at`: DateTimeField, nullable

4. **Add approval fields**
   - `approved_by`: ForeignKey to User, nullable
   - `approval_notes`: TextField

5. **Add rejection fields**
   - `rejection_reason`: TextField

6. **Add status check methods**
   - `is_approved()`
   - `is_completed()`
   - `can_receive()`

### Status Fields Structure

```python
class OrderReturn(models.Model):
    """Return request with status workflow."""
    
    # Status Choices
    STATUS_REQUESTED = 'REQUESTED'
    STATUS_APPROVED = 'APPROVED'
    STATUS_REJECTED = 'REJECTED'
    STATUS_RECEIVED = 'RECEIVED'
    STATUS_REFUNDED = 'REFUNDED'
    
    STATUS_CHOICES = [
        (STATUS_REQUESTED, 'Requested - Pending Approval'),
        (STATUS_APPROVED, 'Approved - Awaiting Return'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_RECEIVED, 'Received - Processing Refund'),
        (STATUS_REFUNDED, 'Refunded - Complete'),
    ]
    
    # ... existing fields ...
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_REQUESTED
    )
    
    # Workflow timestamps
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    
    # Approval/rejection
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_returns'
    )
    approval_notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    def is_approved(self):
        """Check if return is approved."""
        return self.status == self.STATUS_APPROVED
    
    def is_completed(self):
        """Check if return process is complete."""
        return self.status in [self.STATUS_REFUNDED, self.STATUS_REJECTED]
    
    def can_receive(self):
        """Check if items can be marked as received."""
        return self.status == self.STATUS_APPROVED
```

### Return Status Flow

```
REQUESTED (New return request)
    │
    ├─→ APPROVED (Staff approves)
    │       │
    │       ▼
    │   RECEIVED (Items returned)
    │       │
    │       ▼
    │   REFUNDED (Money refunded)
    │
    └─→ REJECTED (Staff rejects)
```

### Expected Outcomes
- Status field with workflow states
- Timestamp fields for each stage
- Approval tracking fields
- Status check methods

---

## Task 70: Create ReturnLineItem Model

### Overview
Create ReturnLineItem model to link returns to specific order line items with quantity and condition tracking.

### Dependencies
- Task 67: OrderReturn Model
- OrderLineItem model

### Instructions

1. **Create ReturnLineItem model**
   - In same file as OrderReturn
   - Inherit from models.Model

2. **Add relationship fields**
   - `order_return`: ForeignKey to OrderReturn
   - `order_line_item`: ForeignKey to OrderLineItem

3. **Add quantity field**
   - `quantity`: PositiveIntegerField
   - Cannot exceed line item quantity

4. **Add condition tracking**
   - `condition`: CharField with choices
   - UNOPENED, OPENED, DAMAGED

5. **Add inspection fields**
   - `inspection_notes`: TextField
   - `inspected_by`: ForeignKey to User
   - `inspected_at`: DateTimeField

6. **Add financial tracking**
   - `refund_amount`: DecimalField
   - Calculated per line item

7. **Add validation methods**
   - `clean()`: Validate quantity
   - Check against original line item

8. **Add __str__ method**

9. **Update models __init__.py**
   - Export ReturnLineItem

### ReturnLineItem Structure

```python
class ReturnLineItem(models.Model):
    """
    Individual items being returned as part of a return request.
    Links to original order line items.
    """
    
    # Condition Choices
    CONDITION_UNOPENED = 'UNOPENED'
    CONDITION_OPENED = 'OPENED'
    CONDITION_DAMAGED = 'DAMAGED'
    
    CONDITION_CHOICES = [
        (CONDITION_UNOPENED, 'Unopened - Like New'),
        (CONDITION_OPENED, 'Opened - Used'),
        (CONDITION_DAMAGED, 'Damaged - Not Resalable'),
    ]
    
    # Relationships
    order_return = models.ForeignKey(
        'OrderReturn',
        on_delete=models.CASCADE,
        related_name='line_items'
    )
    order_line_item = models.ForeignKey(
        'OrderLineItem',
        on_delete=models.CASCADE,
        related_name='returns'
    )
    
    # Quantity
    quantity = models.PositiveIntegerField(
        help_text="Quantity being returned"
    )
    
    # Condition
    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default=CONDITION_UNOPENED
    )
    
    # Inspection
    inspection_notes = models.TextField(blank=True)
    inspected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='inspected_returns'
    )
    inspected_at = models.DateTimeField(null=True, blank=True)
    
    # Financial
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    
    class Meta:
        db_table = 'order_return_line_items'
        unique_together = [['order_return', 'order_line_item']]
        
    def __str__(self):
        return f"{self.order_return.return_number} - {self.order_line_item.product.name}"
    
    def clean(self):
        """Validate return quantity."""
        if self.quantity > self.order_line_item.quantity:
            raise ValidationError(
                f"Cannot return {self.quantity} items. "
                f"Only {self.order_line_item.quantity} were ordered."
            )
        
        # Check already returned quantity
        already_returned = ReturnLineItem.objects.filter(
            order_line_item=self.order_line_item,
            order_return__status__in=['APPROVED', 'RECEIVED', 'REFUNDED']
        ).exclude(pk=self.pk).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        available = self.order_line_item.quantity - already_returned
        if self.quantity > available:
            raise ValidationError(
                f"Only {available} items available to return. "
                f"{already_returned} already returned."
            )
```

### Return Line Item Examples

```
Order Line Item: Product A x 10
────────────────────────────────
Return 1: 3 units (UNOPENED)
Return 2: 2 units (DAMAGED)
──────────────────────────────
Remaining: 5 units (not returned)
```

### Expected Outcomes
- ReturnLineItem model created
- Linked to OrderReturn and OrderLineItem
- Quantity validation working
- Condition tracking present

---

## Task 71: Add Return Financial Fields

### Overview
Add fields to track refund amounts, fees, and payment methods for returns.

### Dependencies
- Task 69: Return Status Fields

### Instructions

1. **Add refund calculation fields to OrderReturn**
   - `refund_amount`: DecimalField
   - `restocking_fee`: DecimalField
   - `refund_shipping`: BooleanField

2. **Add refund method field**
   - `refund_method`: CharField with choices
   - ORIGINAL_METHOD, STORE_CREDIT, CASH, BANK_TRANSFER

3. **Add refund tracking fields**
   - `refund_reference`: CharField
   - Reference from payment gateway

4. **Add cost tracking fields**
   - `return_shipping_cost`: DecimalField
   - Who pays return shipping

5. **Add refund calculation method**
   - `calculate_refund_amount()`
   - Sum line items minus fees

6. **Add refund eligibility method**
   - `is_refund_eligible()`
   - Check policies

### Financial Fields Structure

```python
class OrderReturn(models.Model):
    """Return request with financial tracking."""
    
    # Refund Method Choices
    REFUND_ORIGINAL = 'ORIGINAL_METHOD'
    REFUND_STORE_CREDIT = 'STORE_CREDIT'
    REFUND_CASH = 'CASH'
    REFUND_BANK_TRANSFER = 'BANK_TRANSFER'
    
    REFUND_METHOD_CHOICES = [
        (REFUND_ORIGINAL, 'Original Payment Method'),
        (REFUND_STORE_CREDIT, 'Store Credit'),
        (REFUND_CASH, 'Cash'),
        (REFUND_BANK_TRANSFER, 'Bank Transfer'),
    ]
    
    # ... existing fields ...
    
    # Financial fields
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total refund amount"
    )
    restocking_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Fee charged for restocking"
    )
    refund_shipping = models.BooleanField(
        default=False,
        help_text="Whether to refund original shipping cost"
    )
    
    # Refund method
    refund_method = models.CharField(
        max_length=30,
        choices=REFUND_METHOD_CHOICES,
        default=REFUND_ORIGINAL
    )
    refund_reference = models.CharField(
        max_length=100,
        blank=True,
        help_text="Payment gateway refund reference"
    )
    
    # Cost tracking
    return_shipping_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Cost of return shipping"
    )
    
    def calculate_refund_amount(self):
        """Calculate total refund amount."""
        # Sum refund amounts from line items
        items_total = self.line_items.aggregate(
            total=Sum('refund_amount')
        )['total'] or Decimal('0')
        
        # Add shipping if applicable
        shipping = self.order.shipping_cost if self.refund_shipping else Decimal('0')
        
        # Subtract restocking fee
        refund = items_total + shipping - self.restocking_fee
        
        # Cannot be negative
        return max(refund, Decimal('0'))
    
    def is_refund_eligible(self):
        """Check if return is eligible for refund."""
        # Check return window
        days_since_order = (timezone.now().date() - self.order.created_at.date()).days
        if days_since_order > 30:  # 30-day return policy
            return False
        
        # Check order is paid
        if self.order.payment_status != 'PAID':
            return False
        
        return True
```

### Refund Calculation Example

```
Order Total: $150.00
  - Item A: $100.00
  - Item B: $30.00
  - Shipping: $20.00

Return: Item A only
────────────────────
Line item refund: $100.00
Restocking fee: -$10.00
Shipping (not refunded): $0.00
────────────────────────────
Total refund: $90.00
```

### Expected Outcomes
- Financial fields added
- Refund calculation method
- Fee tracking
- Refund method choices

---

## Task 72: Run Return Migrations

### Overview
Generate and apply migrations for the OrderReturn and ReturnLineItem models.

### Dependencies
- Tasks 67-71: All return model fields

### Instructions

1. **Ensure all model changes saved**

2. **Generate migration**
   - Run: `python manage.py makemigrations orders`
   - Review generated migration file
   - Should be named `0005_return.py`

3. **Review migration operations**
   - Check CreateModel operations
   - Verify field definitions
   - Check indexes and constraints

4. **Apply migration**
   - Run: `python manage.py migrate orders`

5. **Verify in database**
   - Check `order_returns` table exists
   - Check `order_return_line_items` table exists
   - Verify all fields present

6. **Test model creation**
   - Create test OrderReturn in Django shell
   - Create test ReturnLineItem
   - Verify relationships work

### Migration File Structure

```python
# Generated migration: 0005_return.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_fulfillment'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderReturn',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('return_number', models.CharField(max_length=50, unique=True)),
                ('reason', models.CharField(max_length=30, choices=[...])),
                ('reason_notes', models.TextField(blank=True)),
                ('status', models.CharField(max_length=20, choices=[...])),
                # ... all other fields ...
                ('order', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='returns',
                    to='orders.order'
                )),
                # ... other foreign keys ...
            ],
            options={
                'db_table': 'order_returns',
                'ordering': ['-requested_at'],
            },
        ),
        migrations.CreateModel(
            name='ReturnLineItem',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('quantity', models.PositiveIntegerField()),
                ('condition', models.CharField(max_length=20, choices=[...])),
                # ... all other fields ...
                ('order_return', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='line_items',
                    to='orders.orderreturn'
                )),
                ('order_line_item', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='returns',
                    to='orders.orderlineitem'
                )),
            ],
            options={
                'db_table': 'order_return_line_items',
                'unique_together': {('order_return', 'order_line_item')},
            },
        ),
    ]
```

### Verification Checklist

```
□ Migration file generated
□ No migration conflicts
□ Migration applied successfully
□ order_returns table created
□ order_return_line_items table created
□ All fields present in database
□ Foreign keys working
□ Unique constraints active
□ Test records can be created
```

### Expected Outcomes
- Migration 0005_return.py created
- Migration applied successfully
- Database tables created
- Models functional

---

## Summary

This document completed return data models:

**Completed:**
- ✅ OrderReturn model with auto-generated numbers
- ✅ Return reason tracking (DEFECTIVE, WRONG_ITEM, etc.)
- ✅ Return status workflow (REQUESTED → APPROVED → RECEIVED → REFUNDED)
- ✅ ReturnLineItem for item-level tracking
- ✅ Financial fields for refund calculation
- ✅ Database migrations applied

**Key Achievements:**
- Complete return data structure
- Status-based workflow
- Item condition tracking
- Refund calculation logic

**Next Steps:**
- Proceed to [02_Tasks-73-77_Return-Service-Workflow.md](02_Tasks-73-77_Return-Service-Workflow.md) for return service implementation
