# Tasks 51-59: Refund Model and Workflow

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** D - Refunds & Adjustments  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Partial-Split-Payments](../Group-C_Partial-Split-Payments/)
- **→ Next Document:** [02_Tasks-60-64_Refund-Processing-Invoice-Updates.md](02_Tasks-60-64_Refund-Processing-Invoice-Updates.md)

---

## Document Overview

This document implements the refund model, workflow, and approval system for handling payment refunds. This includes creating the refund data model, defining refund reasons, implementing request and approval workflows, linking refunds to payments, and tracking refund status through the entire lifecycle.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Refund Model | Medium | 25 min |
| 52 | Define RefundReason Choices | Low | 10 min |
| 53 | Add Refund Status Tracking | Low | 15 min |
| 54 | Link Refunds to Payments | Low | 15 min |
| 55 | Implement Refund Request Flow | High | 30 min |
| 56 | Add Refund Approval Workflow | Medium | 25 min |
| 57 | Track Refund History | Medium | 20 min |
| 58 | Handle Partial Refunds | Medium | 25 min |
| 59 | Create Refund Migrations | Low | 15 min |

---

## Task 51: Create Refund Model

### Overview
Create the Refund model to store refund records with comprehensive tracking of refund requests, approvals, processing, and completion.

### Dependencies
- Payment model exists
- Invoice model exists
- Customer model exists

### Instructions

1. **Create refund.py model file**
   - Create file at `apps/payments/models/refund.py`
   - Import BaseModel, Payment, Invoice, Customer
   - Define Refund model

2. **Define core Refund fields**
   - refund_number: Unique identifier (e.g., REF-2026-00001)
   - original_payment: ForeignKey to Payment being refunded
   - invoice: ForeignKey to Invoice (if applicable)
   - customer: ForeignKey to Customer
   - refund_amount: Amount to refund
   - reason: Why refund is needed

3. **Define status and workflow fields**
   - status: REQUESTED, APPROVED, REJECTED, PROCESSING, COMPLETED, FAILED
   - refund_method: ORIGINAL_METHOD, BANK_TRANSFER, CHECK, STORE_CREDIT
   - requested_by: User who requested refund
   - requested_at: When refund was requested
   - approved_by: User who approved refund
   - approved_at: When refund was approved

4. **Add processing and completion fields**
   - processed_by: User who processed refund
   - processed_at: When refund was processed
   - completed_at: When refund was completed
   - transaction_id: External refund transaction ID
   - notes: Internal notes about refund

5. **Add validation methods**
   - validate_refund_amount(): Can't exceed payment amount
   - can_be_cancelled(): Check if cancellable
   - is_pending_approval(): Check approval status

### Model Structure

```python
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal
from core.models import BaseModel


class RefundStatus(models.TextChoices):
    """Refund status choices"""
    REQUESTED = 'REQUESTED', 'Refund Requested'
    APPROVED = 'APPROVED', 'Approved (Pending Processing)'
    REJECTED = 'REJECTED', 'Rejected'
    PROCESSING = 'PROCESSING', 'Processing Refund'
    COMPLETED = 'COMPLETED', 'Refund Completed'
    FAILED = 'FAILED', 'Refund Failed'
    CANCELLED = 'CANCELLED', 'Cancelled'


class RefundMethod(models.TextChoices):
    """How refund should be issued"""
    ORIGINAL_METHOD = 'ORIGINAL_METHOD', 'Original Payment Method'
    BANK_TRANSFER = 'BANK_TRANSFER', 'Bank Transfer'
    CHECK = 'CHECK', 'Check'
    STORE_CREDIT = 'STORE_CREDIT', 'Store Credit'
    CASH = 'CASH', 'Cash'


class Refund(BaseModel):
    """
    Payment refund model
    
    Tracks refund requests, approvals, processing, and completion.
    Supports partial and full refunds.
    """
    # Reference
    refund_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text='Unique refund number (e.g., REF-2026-00001)'
    )
    
    # Links
    original_payment = models.ForeignKey(
        'Payment',
        on_delete=models.PROTECT,
        related_name='refunds',
        help_text='Payment being refunded'
    )
    invoice = models.ForeignKey(
        'invoices.Invoice',
        on_delete=models.PROTECT,
        related_name='refunds',
        blank=True,
        null=True,
        help_text='Invoice related to refund (if applicable)'
    )
    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.PROTECT,
        related_name='refunds',
        help_text='Customer receiving refund'
    )
    
    # Refund Details
    refund_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text='Amount to refund'
    )
    reason = models.CharField(
        max_length=50,
        help_text='Refund reason code'
    )
    reason_description = models.TextField(
        blank=True,
        null=True,
        help_text='Detailed refund reason explanation'
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.REQUESTED,
        db_index=True,
        help_text='Current refund status'
    )
    refund_method = models.CharField(
        max_length=20,
        choices=RefundMethod.choices,
        help_text='How refund will be issued'
    )
    
    # Request Stage
    requested_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='requested_refunds',
        help_text='User who requested refund'
    )
    requested_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When refund was requested'
    )
    
    # Approval Stage
    approved_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_refunds',
        help_text='User who approved refund'
    )
    approved_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When refund was approved'
    )
    rejection_reason = models.TextField(
        blank=True,
        null=True,
        help_text='Reason for rejection (if rejected)'
    )
    
    # Processing Stage
    processed_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_refunds',
        help_text='User who processed refund'
    )
    processed_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When refund was processed'
    )
    
    # Completion Stage
    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When refund was completed'
    )
    
    # External References
    transaction_id = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text='External refund transaction ID (payment gateway)'
    )
    reference_number = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Bank/payment processor reference number'
    )
    
    # Bank details (if refund_method = BANK_TRANSFER)
    bank_account_name = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text='Account holder name'
    )
    bank_account_number = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Bank account number'
    )
    bank_name = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text='Bank name'
    )
    bank_branch = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text='Bank branch'
    )
    
    # Check details (if refund_method = CHECK)
    check_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Check number issued'
    )
    check_date = models.DateField(
        blank=True,
        null=True,
        help_text='Check issue date'
    )
    
    # Store credit details (if refund_method = STORE_CREDIT)
    store_credit_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Store credit ID created'
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        null=True,
        help_text='Internal notes about refund'
    )
    customer_notes = models.TextField(
        blank=True,
        null=True,
        help_text='Notes visible to customer'
    )
    
    class Meta:
        db_table = 'refunds'
        ordering = ['-requested_at']
        verbose_name = 'Refund'
        verbose_name_plural = 'Refunds'
        indexes = [
            models.Index(fields=['refund_number']),
            models.Index(fields=['customer', '-requested_at']),
            models.Index(fields=['original_payment']),
            models.Index(fields=['invoice']),
            models.Index(fields=['status', '-requested_at']),
            models.Index(fields=['requested_at']),
        ]
    
    def __str__(self):
        return f'{self.refund_number} - Rs. {self.refund_amount} - {self.status}'
    
    def clean(self):
        """Validate refund"""
        super().clean()
        
        # Validate refund amount
        if self.refund_amount <= 0:
            raise ValidationError('Refund amount must be positive')
        
        # Validate against payment amount (including previous refunds)
        if self.original_payment:
            total_refunded = self.original_payment.refunds.exclude(
                id=self.id
            ).filter(
                status__in=[RefundStatus.APPROVED, RefundStatus.PROCESSING, RefundStatus.COMPLETED]
            ).aggregate(
                total=models.Sum('refund_amount')
            )['total'] or Decimal('0.00')
            
            remaining_refundable = self.original_payment.amount - total_refunded
            
            if self.refund_amount > remaining_refundable:
                raise ValidationError(
                    f'Refund amount (Rs. {self.refund_amount}) exceeds remaining '
                    f'refundable amount (Rs. {remaining_refundable})'
                )
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def can_be_cancelled(self):
        """
        Check if refund can be cancelled
        
        Returns:
            bool: True if refund can be cancelled
        """
        return self.status in [RefundStatus.REQUESTED, RefundStatus.APPROVED]
    
    def can_be_approved(self):
        """
        Check if refund can be approved
        
        Returns:
            bool: True if refund can be approved
        """
        return self.status == RefundStatus.REQUESTED
    
    def can_be_rejected(self):
        """
        Check if refund can be rejected
        
        Returns:
            bool: True if refund can be rejected
        """
        return self.status == RefundStatus.REQUESTED
    
    def can_be_processed(self):
        """
        Check if refund can be processed
        
        Returns:
            bool: True if refund can be processed
        """
        return self.status == RefundStatus.APPROVED
    
    def is_pending_approval(self):
        """
        Check if refund is pending approval
        
        Returns:
            bool: True if pending approval
        """
        return self.status == RefundStatus.REQUESTED
    
    def is_completed(self):
        """
        Check if refund is completed
        
        Returns:
            bool: True if completed
        """
        return self.status == RefundStatus.COMPLETED
    
    def get_processing_time(self):
        """
        Calculate processing time
        
        Returns:
            timedelta or None: Time from request to completion
        """
        if self.completed_at and self.requested_at:
            return self.completed_at - self.requested_at
        return None
```

### Refund Lifecycle Diagram

```
REFUND LIFECYCLE

┌─────────────┐
│  REQUESTED  │  ← Refund request created
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌────────────┐    ┌──────────┐
│  APPROVED  │    │ REJECTED │  ← Manager/admin decision
└──────┬─────┘    └──────────┘
       │
       ▼
┌─────────────┐
│ PROCESSING  │  ← Refund being processed
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌────────────┐    ┌─────────┐
│ COMPLETED  │    │ FAILED  │  ← Final states
└────────────┘    └─────────┘

Additional State:
┌───────────┐
│ CANCELLED │  ← Can cancel before processing
└───────────┘
```

### Expected Outcome
- Refund model with comprehensive status tracking
- Validation for refund amounts
- Support for multiple refund methods
- Workflow state tracking (request → approval → processing → completion)
- Bank/check/store credit details

### Verification Checklist
- [ ] refund.py created in models/
- [ ] Refund model defined
- [ ] refund_number unique field
- [ ] RefundStatus choices (7 states)
- [ ] RefundMethod choices (5 methods)
- [ ] original_payment ForeignKey
- [ ] Status workflow fields (requested_by, approved_by, processed_by)
- [ ] Bank account fields
- [ ] Check fields
- [ ] Store credit fields
- [ ] clean() validation
- [ ] Helper methods (can_be_cancelled, is_pending_approval, etc.)

---

## Task 52: Define RefundReason Choices

### Overview
Define standardized refund reason codes to categorize and track why refunds are issued.

### Dependencies
- Task 51: Refund model created

### Instructions

1. **Create RefundReason choices class**
   - Add to refund.py before Refund model
   - Define common refund reasons

2. **Define reason codes**
   - CUSTOMER_REQUEST: Customer requested refund
   - OVERPAYMENT: Customer paid too much
   - DUPLICATE_PAYMENT: Payment made twice
   - CANCELLED_ORDER: Order was cancelled
   - DEFECTIVE_PRODUCT: Product defective/damaged
   - LATE_DELIVERY: Delivery issues
   - PRICING_ERROR: Price charged incorrectly
   - SERVICE_NOT_RENDERED: Service not provided
   - OTHER: Other reason (requires description)

3. **Update Refund.reason field**
   - Change to choices field using RefundReason
   - Keep reason_description for additional details

### Implementation

```python
class RefundReason(models.TextChoices):
    """Refund reason codes"""
    CUSTOMER_REQUEST = 'CUSTOMER_REQUEST', 'Customer Request'
    OVERPAYMENT = 'OVERPAYMENT', 'Overpayment'
    DUPLICATE_PAYMENT = 'DUPLICATE_PAYMENT', 'Duplicate Payment'
    CANCELLED_ORDER = 'CANCELLED_ORDER', 'Order Cancelled'
    RETURNED_GOODS = 'RETURNED_GOODS', 'Goods Returned'
    DEFECTIVE_PRODUCT = 'DEFECTIVE_PRODUCT', 'Defective/Damaged Product'
    LATE_DELIVERY = 'LATE_DELIVERY', 'Delivery Issues'
    PRICING_ERROR = 'PRICING_ERROR', 'Pricing Error'
    SERVICE_NOT_RENDERED = 'SERVICE_NOT_RENDERED', 'Service Not Rendered'
    BILLING_ERROR = 'BILLING_ERROR', 'Billing Error'
    GOODWILL = 'GOODWILL', 'Goodwill Gesture'
    OTHER = 'OTHER', 'Other Reason'


# Update in Refund model:
class Refund(BaseModel):
    # ... other fields ...
    
    reason = models.CharField(
        max_length=50,
        choices=RefundReason.choices,
        help_text='Refund reason code'
    )
```

### Refund Reason Usage Examples

**Scenario 1: Duplicate Payment**
```
Customer paid invoice twice by mistake
Reason: DUPLICATE_PAYMENT
Description: "Customer accidentally paid invoice INV-2026-00123 twice using 
             different payment methods. Refunding second payment."
```

**Scenario 2: Cancelled Order**
```
Order cancelled before shipment
Reason: CANCELLED_ORDER
Description: "Order cancelled by customer before processing. Full refund issued."
```

**Scenario 3: Overpayment**
```
Customer paid Rs. 50,000 for Rs. 45,000 invoice
Reason: OVERPAYMENT
Description: "Customer overpaid by Rs. 5,000. Refunding excess amount."
```

### Expected Outcome
- Standardized refund reason codes
- Refund.reason using RefundReason choices
- Clear categorization of refunds

### Verification Checklist
- [ ] RefundReason choices class created
- [ ] 12 reason codes defined
- [ ] Refund.reason updated to use choices
- [ ] reason_description available for details

---

## Task 53: Add Refund Status Tracking

### Overview
Implement methods to update and track refund status changes throughout the refund lifecycle.

### Dependencies
- Task 51: Refund model created

### Instructions

1. **Add status update methods to Refund model**
   - update_status(): General status update
   - mark_approved(): Approve refund
   - mark_rejected(): Reject refund
   - mark_processing(): Start processing
   - mark_completed(): Complete refund
   - mark_failed(): Mark as failed

2. **Validate status transitions**
   - Only allow valid state transitions
   - Example: Can't go from COMPLETED back to REQUESTED

3. **Update timestamp fields**
   - Set approved_at when approved
   - Set processed_at when processing starts
   - Set completed_at when completed

4. **Track user actions**
   - Record approved_by when approved
   - Record processed_by when processing

### Implementation

```python
# Add to Refund model

def update_status(self, new_status, user=None, notes=None):
    """
    Update refund status
    
    Args:
        new_status: New RefundStatus value
        user: User performing the status change
        notes: Optional notes about status change
        
    Returns:
        bool: True if status updated successfully
        
    Raises:
        ValidationError: If status transition invalid
    """
    from django.core.exceptions import ValidationError
    from django.utils import timezone
    
    # Validate status transition
    valid_transitions = {
        RefundStatus.REQUESTED: [
            RefundStatus.APPROVED,
            RefundStatus.REJECTED,
            RefundStatus.CANCELLED
        ],
        RefundStatus.APPROVED: [
            RefundStatus.PROCESSING,
            RefundStatus.CANCELLED
        ],
        RefundStatus.PROCESSING: [
            RefundStatus.COMPLETED,
            RefundStatus.FAILED
        ],
        RefundStatus.FAILED: [
            RefundStatus.PROCESSING  # Allow retry
        ]
    }
    
    current_status = self.status
    
    if current_status == new_status:
        return True  # Already in that status
    
    if current_status in valid_transitions:
        if new_status not in valid_transitions[current_status]:
            raise ValidationError(
                f'Cannot transition from {current_status} to {new_status}'
            )
    else:
        # Terminal states (COMPLETED, REJECTED, CANCELLED) cannot transition
        raise ValidationError(
            f'Cannot change status from {current_status} (terminal state)'
        )
    
    # Update status
    old_status = self.status
    self.status = new_status
    
    # Update timestamp and user fields based on new status
    now = timezone.now()
    
    if new_status == RefundStatus.APPROVED:
        self.approved_at = now
        if user:
            self.approved_by = user
    
    elif new_status == RefundStatus.PROCESSING:
        self.processed_at = now
        if user:
            self.processed_by = user
    
    elif new_status == RefundStatus.COMPLETED:
        self.completed_at = now
    
    # Add notes if provided
    if notes:
        timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
        status_note = f"[{timestamp}] Status: {old_status} → {new_status}: {notes}"
        self.notes = (self.notes or '') + '\n' + status_note
    
    self.save()
    return True


def mark_approved(self, user, notes=None):
    """
    Approve refund
    
    Args:
        user: User approving refund
        notes: Optional approval notes
    """
    self.update_status(RefundStatus.APPROVED, user=user, notes=notes)


def mark_rejected(self, user, reason):
    """
    Reject refund
    
    Args:
        user: User rejecting refund
        reason: Rejection reason
    """
    self.rejection_reason = reason
    self.update_status(RefundStatus.REJECTED, user=user, notes=f'Rejected: {reason}')


def mark_processing(self, user, notes=None):
    """
    Start processing refund
    
    Args:
        user: User starting processing
        notes: Optional processing notes
    """
    self.update_status(RefundStatus.PROCESSING, user=user, notes=notes)


def mark_completed(self, transaction_id=None, notes=None):
    """
    Complete refund
    
    Args:
        transaction_id: External transaction ID
        notes: Optional completion notes
    """
    if transaction_id:
        self.transaction_id = transaction_id
    self.update_status(RefundStatus.COMPLETED, notes=notes)


def mark_failed(self, reason, notes=None):
    """
    Mark refund as failed
    
    Args:
        reason: Failure reason
        notes: Optional additional notes
    """
    failure_notes = f'Failed: {reason}'
    if notes:
        failure_notes += f'. {notes}'
    self.update_status(RefundStatus.FAILED, notes=failure_notes)


def cancel(self, user, reason):
    """
    Cancel refund
    
    Args:
        user: User cancelling refund
        reason: Cancellation reason
        
    Raises:
        ValidationError: If refund cannot be cancelled
    """
    from django.core.exceptions import ValidationError
    
    if not self.can_be_cancelled():
        raise ValidationError(
            f'Cannot cancel refund in {self.status} status'
        )
    
    self.update_status(
        RefundStatus.CANCELLED,
        user=user,
        notes=f'Cancelled: {reason}'
    )
```

### Status Transition Diagram

```
Valid State Transitions:

REQUESTED ──→ APPROVED
   │            │
   │            └──→ PROCESSING ──→ COMPLETED
   │                    │
   │                    └──→ FAILED ──→ PROCESSING (retry)
   │
   ├──→ REJECTED
   │
   └──→ CANCELLED

Terminal States (no transitions out):
- COMPLETED
- REJECTED  
- CANCELLED
```

### Expected Outcome
- Status update methods with validation
- Automatic timestamp updates
- User tracking for status changes
- Status transition validation
- Terminal state protection

### Verification Checklist
- [ ] update_status() method with transition validation
- [ ] mark_approved() method
- [ ] mark_rejected() method
- [ ] mark_processing() method
- [ ] mark_completed() method
- [ ] mark_failed() method
- [ ] cancel() method
- [ ] Timestamp auto-updates
- [ ] User tracking
- [ ] Notes appending

---

## Task 54: Link Refunds to Payments

### Overview
Ensure proper linkage between refunds and original payments, with tracking of refunded amounts and remaining refundable amounts.

### Dependencies
- Task 51: Refund model created
- Payment model exists

### Instructions

1. **Add refund tracking fields to Payment model**
   - total_refunded: Sum of all completed refunds
   - refund_status: NOT_REFUNDED, PARTIALLY_REFUNDED, FULLY_REFUNDED

2. **Add helper methods to Payment model**
   - get_total_refunded(): Calculate total refunded
   - get_remaining_refundable(): Amount still refundable
   - can_be_refunded(): Check if refund possible

3. **Update after refund completion**
   - When refund status becomes COMPLETED
   - Update payment.total_refunded
   - Update payment.refund_status

### Implementation

```python
# Add to Payment model (apps/payments/models/payment.py)

from django.db import models
from decimal import Decimal


class RefundStatus(models.TextChoices):
    """Payment refund status"""
    NOT_REFUNDED = 'NOT_REFUNDED', 'Not Refunded'
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED', 'Partially Refunded'
    FULLY_REFUNDED = 'FULLY_REFUNDED', 'Fully Refunded'


class Payment(BaseModel):
    # ... existing fields ...
    
    # Refund Tracking
    total_refunded = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Total amount refunded from this payment'
    )
    refund_status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.NOT_REFUNDED,
        help_text='Refund status of this payment'
    )
    
    # ... rest of model ...
    
    def get_total_refunded(self):
        """
        Calculate total refunded amount (completed refunds only)
        
        Returns:
            Decimal: Total refunded amount
        """
        from apps.payments.models.refund import Refund, RefundStatus as RS
        
        total = self.refunds.filter(
            status=RS.COMPLETED
        ).aggregate(
            total=models.Sum('refund_amount')
        )['total']
        
        return total or Decimal('0.00')
    
    def get_remaining_refundable(self):
        """
        Calculate remaining refundable amount
        
        Returns:
            Decimal: Amount that can still be refunded
        """
        total_refunded = self.get_total_refunded()
        
        # Include approved/processing refunds to avoid double refunds
        pending_refunds = self.refunds.filter(
            status__in=[
                RefundStatus.APPROVED,
                RefundStatus.PROCESSING
            ]
        ).aggregate(
            total=models.Sum('refund_amount')
        )['total'] or Decimal('0.00')
        
        return self.amount - total_refunded - pending_refunds
    
    def can_be_refunded(self, amount=None):
        """
        Check if payment can be refunded
        
        Args:
            amount: Optional specific amount to check
            
        Returns:
            bool: True if payment can be refunded
        """
        if self.status != PaymentStatus.COMPLETED:
            return False
        
        remaining = self.get_remaining_refundable()
        
        if remaining <= 0:
            return False
        
        if amount is not None:
            return Decimal(str(amount)) <= remaining
        
        return True
    
    def update_refund_status(self):
        """
        Update refund_status and total_refunded based on refunds
        
        Should be called after refund completion.
        """
        total_refunded = self.get_total_refunded()
        
        self.total_refunded = total_refunded
        
        if total_refunded == 0:
            self.refund_status = RefundStatus.NOT_REFUNDED
        elif total_refunded >= self.amount:
            self.refund_status = RefundStatus.FULLY_REFUNDED
        else:
            self.refund_status = RefundStatus.PARTIALLY_REFUNDED
        
        self.save(update_fields=['total_refunded', 'refund_status'])
```

### Payment-Refund Relationship Example

```
Payment: PAY-2026-00123
Amount: Rs. 50,000
Status: COMPLETED

├─ Refund #1: REF-2026-00045
│  Amount: Rs. 15,000
│  Status: COMPLETED
│  Reason: DEFECTIVE_PRODUCT
│
├─ Refund #2: REF-2026-00067
│  Amount: Rs. 10,000
│  Status: COMPLETED
│  Reason: LATE_DELIVERY
│
└─ Refund #3: REF-2026-00089
   Amount: Rs. 5,000
   Status: REQUESTED
   Reason: CUSTOMER_REQUEST

Total Refunded: Rs. 25,000 (completed)
Pending Refunds: Rs. 5,000 (requested/approved/processing)
Remaining Refundable: Rs. 50,000 - Rs. 25,000 - Rs. 5,000 = Rs. 20,000
Refund Status: PARTIALLY_REFUNDED
```

### Expected Outcome
- Payment refund tracking fields
- Helper methods for refund calculations
- Automatic refund status updates
- Prevention of over-refunding

### Verification Checklist
- [ ] total_refunded field in Payment
- [ ] refund_status field in Payment
- [ ] get_total_refunded() method
- [ ] get_remaining_refundable() method
- [ ] can_be_refunded() method
- [ ] update_refund_status() method
- [ ] Validation prevents exceeding payment amount

---

## Task 55: Implement Refund Request Flow

### Overview
Implement the service layer method to create refund requests with validation and initial workflow setup.

### Dependencies
- Tasks 51-54: Refund model and linkages complete

### Instructions

1. **Create request_refund() method in RefundService**
   - Validate payment eligibility
   - Validate refund amount
   - Create Refund record
   - Generate refund number
   - Set initial status to REQUESTED

2. **Validate refund eligibility**
   - Payment must be COMPLETED
   - Payment not fully refunded
   - Requested amount <= remaining refundable

3. **Generate refund number**
   - Format: REF-{YEAR}-{SEQUENCE}
   - Unique per tenant

4. **Determine refund method**
   - Default: ORIGINAL_METHOD (refund via same method)
   - Allow override for specific methods

5. **Create RefundService class**
   - Centralize refund operations
   - Similar structure to PaymentService

### Implementation

```python
# Create new file: apps/payments/services/refund_service.py

import logging
from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal

from apps.payments.models.payment import Payment, PaymentStatus
from apps.payments.models.refund import Refund, RefundStatus, RefundReason, RefundMethod

logger = logging.getLogger(__name__)


class RefundService:
    """Service for refund operations"""
    
    @staticmethod
    @transaction.atomic
    def request_refund(
        tenant,
        payment,
        amount,
        reason,
        reason_description=None,
        refund_method=None,
        requested_by=None,
        customer_notes=None,
        notes=None
    ):
        """
        Create refund request
        
        Args:
            tenant: Tenant instance
            payment: Payment to refund
            amount: Refund amount
            reason: RefundReason choice
            reason_description: Detailed reason description
            refund_method: RefundMethod choice (default: ORIGINAL_METHOD)
            requested_by: User requesting refund
            customer_notes: Notes visible to customer
            notes: Internal notes
            
        Returns:
            dict: Response with refund
        """
        try:
            # Convert amount to Decimal
            amount = Decimal(str(amount))
            
            # Validate payment status
            if payment.status != PaymentStatus.COMPLETED:
                return {
                    'success': False,
                    'error': f'Payment {payment.payment_number} is not completed',
                    'code': 'PAYMENT_NOT_COMPLETED'
                }
            
            # Validate payment can be refunded
            if not payment.can_be_refunded(amount):
                remaining = payment.get_remaining_refundable()
                return {
                    'success': False,
                    'error': (
                        f'Cannot refund Rs. {amount} from payment {payment.payment_number}. '
                        f'Remaining refundable: Rs. {remaining}'
                    ),
                    'code': 'INSUFFICIENT_REFUNDABLE_AMOUNT'
                }
            
            # Determine refund method
            if refund_method is None:
                refund_method = RefundMethod.ORIGINAL_METHOD
            
            # Generate refund number
            refund_number = _generate_refund_number(tenant)
            
            # Create refund
            refund = Refund.objects.create(
                tenant=tenant,
                refund_number=refund_number,
                original_payment=payment,
                invoice=payment.invoice,
                customer=payment.customer,
                refund_amount=amount,
                reason=reason,
                reason_description=reason_description,
                refund_method=refund_method,
                status=RefundStatus.REQUESTED,
                requested_by=requested_by,
                customer_notes=customer_notes,
                notes=notes
            )
            
            logger.info(
                f'Refund requested: {refund_number}, '
                f'Payment: {payment.payment_number}, '
                f'Amount: Rs. {amount}, '
                f'Reason: {reason}'
            )
            
            # TODO: Send notification to approvers (Task 56)
            
            return {
                'success': True,
                'refund': refund,
                'refund_number': refund_number,
                'amount': float(amount),
                'status': RefundStatus.REQUESTED,
                'message': f'Refund request created: {refund_number}'
            }
            
        except ValidationError as e:
            logger.error(f'Refund request validation failed: {str(e)}')
            return {
                'success': False,
                'error': str(e),
                'code': 'VALIDATION_ERROR'
            }
        except Exception as e:
            logger.error(f'Refund request failed: {str(e)}', exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'code': 'REFUND_REQUEST_ERROR'
            }


def _generate_refund_number(tenant):
    """Generate unique refund number"""
    from django.db.models import Max
    
    year = timezone.now().year
    prefix = f'REF-{year}-'
    
    last_refund = Refund.objects.filter(
        tenant=tenant,
        refund_number__startswith=prefix
    ).aggregate(
        max_seq=Max('refund_number')
    )['max_seq']
    
    if last_refund:
        last_seq = int(last_refund.split('-')[-1])
        new_seq = last_seq + 1
    else:
        new_seq = 1
    
    return f'{prefix}{new_seq:05d}'
```

### Refund Request Examples

**Example 1: Full Refund**
```python
result = RefundService.request_refund(
    tenant=tenant,
    payment=payment,  # Rs. 50,000
    amount=50000,
    reason=RefundReason.CANCELLED_ORDER,
    reason_description="Customer cancelled order before shipment",
    requested_by=user
)

# Result: REF-2026-00001 created with status REQUESTED
```

**Example 2: Partial Refund**
```python
result = RefundService.request_refund(
    tenant=tenant,
    payment=payment,  # Rs. 50,000
    amount=10000,
    reason=RefundReason.DEFECTIVE_PRODUCT,
    reason_description="1 item defective, refunding for that item",
    refund_method=RefundMethod.STORE_CREDIT,
    requested_by=user
)

# Result: REF-2026-00002 created for Rs. 10,000
# Remaining refundable: Rs. 40,000
```

### Expected Outcome
- Refund request creation service
- Payment eligibility validation
- Refund amount validation
- Refund number generation
- Initial status set to REQUESTED

### Verification Checklist
- [ ] RefundService class created
- [ ] request_refund() method implemented
- [ ] Payment status validation
- [ ] Refund amount validation (can_be_refunded)
- [ ] Refund number generation (REF-YYYY-NNNNN)
- [ ] Refund record creation
- [ ] Transaction atomic
- [ ] Logging

---

## Task 56: Add Refund Approval Workflow

### Overview
Implement approval workflow for refund requests, allowing authorized users to approve or reject refunds based on configurable thresholds.

### Dependencies
- Task 55: Refund request flow implemented

### Instructions

1. **Create approve_refund() method**
   - Check user has approval permission
   - Check refund is in REQUESTED status
   - Update status to APPROVED
   - Record approved_by and approved_at

2. **Create reject_refund() method**
   - Check user has approval permission
   - Check refund is in REQUESTED status
   - Update status to REJECTED
   - Record rejection_reason

3. **Add approval threshold logic**
   - Small refunds: Auto-approve (if enabled)
   - Medium refunds: Manager approval required
   - Large refunds: Admin approval required

4. **Validate approver permissions**
   - Check user role/permissions
   - Prevent self-approval

5. **Notification on approval/rejection**
   - Notify requester
   - Notify customer (on approval)

### Implementation

```python
# Add to RefundService

@staticmethod
@transaction.atomic
def approve_refund(
    refund,
    approved_by,
    notes=None
):
    """
    Approve refund request
    
    Args:
        refund: Refund instance
        approved_by: User approving refund
        notes: Optional approval notes
        
    Returns:
        dict: Result
    """
    try:
        # Validate refund can be approved
        if not refund.can_be_approved():
            return {
                'success': False,
                'error': f'Refund {refund.refund_number} cannot be approved (status: {refund.status})',
                'code': 'INVALID_STATUS'
            }
        
        # Validate approver has permission
        # TODO: Check user role/permission for refund approval
        # if not approved_by.has_perm('payments.approve_refund'):
        #     return {
        #         'success': False,
        #         'error': 'User does not have refund approval permission',
        #         'code': 'PERMISSION_DENIED'
        #     }
        
        # Prevent self-approval
        if refund.requested_by and refund.requested_by.id == approved_by.id:
            return {
                'success': False,
                'error': 'Cannot approve own refund request',
                'code': 'SELF_APPROVAL'
            }
        
        # Approve refund
        refund.mark_approved(user=approved_by, notes=notes)
        
        logger.info(
            f'Refund approved: {refund.refund_number} by {approved_by.username}, '
            f'Amount: Rs. {refund.refund_amount}'
        )
        
        # TODO: Send approval notification (Task 49)
        
        return {
            'success': True,
            'refund_number': refund.refund_number,
            'status': refund.status,
            'approved_by': approved_by.username,
            'approved_at': refund.approved_at.isoformat() if refund.approved_at else None,
            'message': f'Refund {refund.refund_number} approved'
        }
        
    except Exception as e:
        logger.error(f'Refund approval failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'APPROVAL_ERROR'
        }


@staticmethod
@transaction.atomic
def reject_refund(
    refund,
    rejected_by,
    rejection_reason
):
    """
    Reject refund request
    
    Args:
        refund: Refund instance
        rejected_by: User rejecting refund
        rejection_reason: Reason for rejection
        
    Returns:
        dict: Result
    """
    try:
        # Validate refund can be rejected
        if not refund.can_be_rejected():
            return {
                'success': False,
                'error': f'Refund {refund.refund_number} cannot be rejected (status: {refund.status})',
                'code': 'INVALID_STATUS'
            }
        
        # Reject refund
        refund.mark_rejected(user=rejected_by, reason=rejection_reason)
        
        logger.info(
            f'Refund rejected: {refund.refund_number} by {rejected_by.username}, '
            f'Reason: {rejection_reason}'
        )
        
        # TODO: Send rejection notification
        
        return {
            'success': True,
            'refund_number': refund.refund_number,
            'status': refund.status,
            'rejected_by': rejected_by.username,
            'rejection_reason': rejection_reason,
            'message': f'Refund {refund.refund_number} rejected'
        }
        
    except Exception as e:
        logger.error(f'Refund rejection failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'REJECTION_ERROR'
        }


@staticmethod
def check_auto_approval_eligibility(refund):
    """
    Check if refund qualifies for auto-approval
    
    Args:
        refund: Refund instance
        
    Returns:
        bool: True if can be auto-approved
    """
    # Get auto-approval settings (from PaymentSettings or similar)
    # For this example, using hardcoded thresholds
    
    AUTO_APPROVE_ENABLED = True
    AUTO_APPROVE_THRESHOLD = Decimal('5000.00')  # Rs. 5,000
    AUTO_APPROVE_REASONS = [
        RefundReason.OVERPAYMENT,
        RefundReason.DUPLICATE_PAYMENT
    ]
    
    if not AUTO_APPROVE_ENABLED:
        return False
    
    # Check amount threshold
    if refund.refund_amount > AUTO_APPROVE_THRESHOLD:
        return False
    
    # Check reason
    if refund.reason not in AUTO_APPROVE_REASONS:
        return False
    
    return True
```

### Approval Workflow Diagram

```
Refund Request Created (REQUESTED)
         │
         ▼
    ┌─────────┐
    │ Check   │
    │ Approval│
    │ Required│
    └────┬────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
   ┌──────────┐          ┌───────────┐
   │ Amount < │          │ Amount >= │
   │ Rs.5,000 │          │ Rs.5,000  │
   │          │          │           │
   │ Reason:  │          │    OR     │
   │ OVER/DUP │          │           │
   └────┬─────┘          │ Other     │
        │                │ Reasons   │
        │                └─────┬─────┘
        │                      │
        ▼                      ▼
   ┌──────────┐          ┌───────────┐
   │   AUTO-  │          │  MANUAL   │
   │ APPROVED │          │ APPROVAL  │
   └────┬─────┘          │ REQUIRED  │
        │                └─────┬─────┘
        │                      │
        │                      ├──────────────┐
        │                      │              │
        │                      ▼              ▼
        │                ┌──────────┐   ┌──────────┐
        │                │ APPROVED │   │ REJECTED │
        │                └────┬─────┘   └──────────┘
        │                     │
        └─────────────────────┘
                              │
                              ▼
                        Ready for Processing
```

### Expected Outcome
- Refund approval workflow
- approve_refund() and reject_refund() methods
- Auto-approval logic for eligible refunds
- Permission validation
- Self-approval prevention

### Verification Checklist
- [ ] approve_refund() method
- [ ] reject_refund() method
- [ ] check_auto_approval_eligibility() method
- [ ] Permission validation (placeholder)
- [ ] Self-approval prevention
- [ ] Status validation (can_be_approved, can_be_rejected)
- [ ] Logging for approvals/rejections

---

## Task 57: Track Refund History

### Overview
Implement refund history tracking to maintain an audit trail of all status changes and actions taken on refunds.

### Dependencies
- Task 56: Refund approval workflow
- PaymentHistory model (from Group B)

### Instructions

1. **Create RefundHistory model**
   - Similar to PaymentHistory
   - Track status changes
   - Track user actions

2. **Define history fields**
   - refund: ForeignKey to Refund
   - action: Status change or action taken
   - old_status: Previous status
   - new_status: New status
   - performed_by: User who performed action
   - performed_at: Timestamp
   - notes: Description of action

3. **Auto-create history entries**
   - On refund creation
   - On status changes
   - On approval/rejection

4. **Add get_history() method to Refund**
   - Return chronological history

### Implementation

```python
# Create apps/payments/models/refund_history.py

from django.db import models
from core.models import BaseModel


class RefundHistory(BaseModel):
    """
    Refund history for audit trail
    
    Tracks all status changes and actions on refunds.
    """
    refund = models.ForeignKey(
        'Refund',
        on_delete=models.CASCADE,
        related_name='history',
        help_text='Refund this history belongs to'
    )
    action = models.CharField(
        max_length=100,
        help_text='Action performed'
    )
    old_status = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='Previous refund status'
    )
    new_status = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='New refund status'
    )
    performed_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='refund_history_entries',
        help_text='User who performed action'
    )
    performed_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When action was performed'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text='Additional notes about action'
    )
    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        help_text='IP address of user'
    )
    
    class Meta:
        db_table = 'refund_history'
        ordering = ['-performed_at']
        verbose_name = 'Refund History'
        verbose_name_plural = 'Refund Histories'
        indexes = [
            models.Index(fields=['refund', '-performed_at']),
            models.Index(fields=['performed_by', '-performed_at']),
        ]
    
    def __str__(self):
        return f'{self.refund.refund_number} - {self.action} - {self.performed_at}'


# Add to Refund model:
def get_history(self):
    """
    Get refund history
    
    Returns:
        QuerySet: Refund history ordered by time
    """
    return self.history.all().select_related('performed_by')


# Create RefundHistoryService
# apps/payments/services/refund_history_service.py

import logging
from apps.payments.models.refund_history import RefundHistory

logger = logging.getLogger(__name__)


class RefundHistoryService:
    """Service for refund history tracking"""
    
    @staticmethod
    def log_refund_action(
        refund,
        action,
        old_status=None,
        new_status=None,
        user=None,
        notes=None,
        ip_address=None
    ):
        """
        Log refund action to history
        
        Args:
            refund: Refund instance
            action: Action description
            old_status: Previous status
            new_status: New status
            user: User performing action
            notes: Additional notes
            ip_address: User's IP address
        """
        try:
            RefundHistory.objects.create(
                tenant=refund.tenant,
                refund=refund,
                action=action,
                old_status=old_status,
                new_status=new_status,
                performed_by=user,
                notes=notes,
                ip_address=ip_address
            )
            
            logger.debug(f'Refund history logged: {refund.refund_number} - {action}')
            
        except Exception as e:
            logger.error(f'Failed to log refund history: {str(e)}', exc_info=True)
    
    @staticmethod
    def log_refund_created(refund, user=None):
        """Log refund creation"""
        RefundHistoryService.log_refund_action(
            refund=refund,
            action='Refund Created',
            new_status=refund.status,
            user=user,
            notes=f'Refund requested for Rs. {refund.refund_amount}'
        )
    
    @staticmethod
    def log_status_change(refund, old_status, new_status, user=None, notes=None):
        """Log status change"""
        RefundHistoryService.log_refund_action(
            refund=refund,
            action=f'Status Changed: {old_status} → {new_status}',
            old_status=old_status,
            new_status=new_status,
            user=user,
            notes=notes
        )
```

### Refund History Example

```
Refund: REF-2026-00045
History:

1. 2026-01-15 09:30:00 - Refund Created
   User: john.doe
   Status: → REQUESTED
   Notes: Refund requested for Rs. 15,000

2. 2026-01-15 14:20:00 - Status Changed: REQUESTED → APPROVED
   User: manager.smith
   Status: REQUESTED → APPROVED
   Notes: Approved by manager

3. 2026-01-16 10:00:00 - Status Changed: APPROVED → PROCESSING
   User: accounts.team
   Status: APPROVED → PROCESSING
   Notes: Processing refund via bank transfer

4. 2026-01-17 11:30:00 - Status Changed: PROCESSING → COMPLETED
   User: accounts.team
   Status: PROCESSING → COMPLETED
   Notes: Refund completed. Transaction ID: TXN123456
```

### Expected Outcome
- RefundHistory model for audit trail
- Automatic history logging on status changes
- get_history() method on Refund
- RefundHistoryService for centralized logging

### Verification Checklist
- [ ] RefundHistory model created
- [ ] History fields (action, old_status, new_status, etc.)
- [ ] Indexes on refund and performed_at
- [ ] get_history() method on Refund
- [ ] RefundHistoryService class
- [ ] log_refund_action() method
- [ ] log_refund_created() helper
- [ ] log_status_change() helper

---

## Task 58: Handle Partial Refunds

### Overview
Implement support for partial refunds, allowing multiple refunds to be issued against a single payment up to the payment amount.

### Dependencies
- Task 54: Payment-refund linkage
- Task 55: Refund request flow

### Instructions

1. **Validate partial refund amount**
   - Already implemented in can_be_refunded()
   - Ensure sum of refunds doesn't exceed payment

2. **Track multiple refunds per payment**
   - Payment.refunds relationship (already exists)
   - Calculate total refunded across all completed refunds

3. **Update payment refund_status**
   - NOT_REFUNDED: No completed refunds
   - PARTIALLY_REFUNDED: Some amount refunded
   - FULLY_REFUNDED: Fully refunded

4. **Test partial refund scenarios**
   - Multiple partial refunds
   - Final partial refund bringing total to full
   - Prevent over-refunding

### Partial Refund Scenarios

**Scenario 1: Multiple Partial Refunds**
```
Payment: PAY-2026-00100 - Rs. 100,000

Refund #1: REF-2026-00050
Amount: Rs. 30,000
Reason: DEFECTIVE_PRODUCT
Status: COMPLETED
→ Payment refund_status: PARTIALLY_REFUNDED
→ Remaining refundable: Rs. 70,000

Refund #2: REF-2026-00051
Amount: Rs. 20,000
Reason: LATE_DELIVERY
Status: COMPLETED
→ Payment refund_status: PARTIALLY_REFUNDED
→ Remaining refundable: Rs. 50,000

Refund #3: REF-2026-00052
Amount: Rs. 50,000
Reason: CANCELLED_ORDER
Status: COMPLETED
→ Payment refund_status: FULLY_REFUNDED
→ Remaining refundable: Rs. 0
```

**Scenario 2: Preventing Over-Refunding**
```
Payment: PAY-2026-00101 - Rs. 50,000
Total Refunded: Rs. 30,000
Remaining: Rs. 20,000

Refund Request: Rs. 25,000
Result: REJECTED - Exceeds remaining refundable amount (Rs. 20,000)
```

### Expected Outcome
- Multiple partial refunds supported
- Automatic calculation of remaining refundable
- Prevention of over-refunding
- Payment refund_status updates

### Verification Checklist
- [ ] can_be_refunded() validates against remaining
- [ ] get_remaining_refundable() accounts for all refunds
- [ ] update_refund_status() sets PARTIALLY_REFUNDED correctly
- [ ] Validation prevents exceeding payment amount
- [ ] Tests for multiple partial refunds

---

## Task 59: Create Refund Migrations

### Overview
Generate and apply Django migrations for Refund and RefundHistory models.

### Dependencies
- Tasks 51-58: All refund models complete

### Instructions

1. **Update __init__.py to include new models**
   - Import Refund in apps/payments/models/__init__.py
   - Import RefundHistory

2. **Generate migrations**
   - Run `python manage.py makemigrations payments`

3. **Apply migrations**
   - Run `python manage.py migrate payments`

4. **Verify tables created**
   - Check refunds table
   - Check refund_history table

### Migration Commands

```bash
# Update apps/payments/models/__init__.py
# Add:
from .refund import Refund, RefundStatus, RefundReason, RefundMethod
from .refund_history import RefundHistory

# Generate migrations
python manage.py makemigrations payments

# Expected: 0004_refund.py (or similar)
# - Create model Refund
# - Create model RefundHistory
# - Add indexes and constraints
# - Alter Payment model (add total_refunded, refund_status)

# Apply migrations
python manage.py migrate payments

# Verify tables
python manage.py dbshell
\dt refund*

# Expected:
# - refunds
# - refund_history
```

### Expected Outcome
- Refund and RefundHistory tables created
- Payment model updated with refund tracking fields
- All indexes and constraints applied

### Verification Checklist
- [ ] Models imported in __init__.py
- [ ] makemigrations run successfully
- [ ] Migration files generated
- [ ] migrate applied successfully
- [ ] refunds table exists
- [ ] refund_history table exists
- [ ] Payment.total_refunded field added
- [ ] Payment.refund_status field added

---

## Summary

This document completed the first half of Group D (Refunds & Adjustments):

1. ✅ **Refund Model** (Task 51): Comprehensive refund model with status tracking
2. ✅ **Refund Reasons** (Task 52): Standardized RefundReason choices
3. ✅ **Status Tracking** (Task 53): Status update methods with validation
4. ✅ **Payment Linkage** (Task 54): Refund tracking on Payment model
5. ✅ **Refund Request Flow** (Task 55): Service method for creating refund requests
6. ✅ **Approval Workflow** (Task 56): Approve/reject methods with auto-approval logic
7. ✅ **Refund History** (Task 57): Audit trail for refund actions
8. ✅ **Partial Refunds** (Task 58): Support for multiple partial refunds
9. ✅ **Migrations** (Task 59): Database schema for refunds

**Next Document:** [02_Tasks-60-64_Refund-Processing-Invoice-Updates.md](02_Tasks-60-64_Refund-Processing-Invoice-Updates.md) - Complete refund processing, store credit refunds, invoice updates, and comprehensive testing.
