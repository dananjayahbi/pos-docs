# Tasks 32-36: History Tracking, Settings, and Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** B - Payment Recording Services  
> **Document:** 03 of 03  
> **Tasks Covered:** 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-26-31_Validation-Allocation-Order.md](02_Tasks-26-31_Validation-Allocation-Order.md)
- **→ Next Group:** [Group-C_Partial-Split-Payments](../Group-C_Partial-Split-Payments/)

---

## Document Overview

This document completes Group B by implementing payment history tracking, payment settings configuration, processing fee calculator service, and database migrations. These components provide audit trails, tenant-specific configurations, and proper database schema.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 32 | Create PaymentHistory Model | Medium | 20 min |
| 33 | Create PaymentSettings Model | Medium | 25 min |
| 34 | Implement Fee Calculator Service | Medium | 20 min |
| 35 | Add Payment History Tracking | Medium | 20 min |
| 36 | Create Initial Migrations | Low | 15 min |

---

## Task 32: Create PaymentHistory Model

### Overview
Create the PaymentHistory model to maintain a complete audit trail of all payment status changes, modifications, and significant events. This model is essential for compliance, dispute resolution, and financial auditing.

### Dependencies
- Payment model exists
- PaymentStatus choices defined
- User model for tracking who made changes

### Instructions

1. **Create payment_history.py model file**
   - Create file at `apps/payments/models/payment_history.py`
   - Import BaseModel, Payment, User
   - Define PaymentHistory model

2. **Define PaymentHistory fields**
   - payment: ForeignKey to Payment
   - action: Type of history event (STATUS_CHANGE, AMOUNT_MODIFIED, APPROVED, etc.)
   - old_value: Previous value (JSON)
   - new_value: New value (JSON)
   - changed_by: User who made the change
   - changed_at: Timestamp
   - description: Human-readable description
   - ip_address: Optional IP address for security audit

3. **Define history action types**
   - STATUS_CHANGE: Payment status changed
   - CREATED: Payment created
   - MODIFIED: Payment details modified
   - APPROVED: Payment approved
   - REJECTED: Payment rejected
   - ALLOCATED: Allocated to invoice
   - REFUNDED: Payment refunded
   - NOTE_ADDED: Internal note added

4. **Add helper methods**
   - get_change_summary(): Return formatted summary
   - Format old_value and new_value for display

5. **Configure model Meta**
   - Ordering by changed_at descending
   - Indexes on payment and changed_at
   - Partitioning strategy for large datasets (optional)

### Model Structure

```python
from django.db import models
from django.contrib.auth import get_user_model
from core.models import BaseModel

User = get_user_model()


class PaymentHistoryAction(models.TextChoices):
    """Payment history action types"""
    CREATED = 'CREATED', 'Payment Created'
    STATUS_CHANGE = 'STATUS_CHANGE', 'Status Changed'
    AMOUNT_MODIFIED = 'AMOUNT_MODIFIED', 'Amount Modified'
    APPROVED = 'APPROVED', 'Payment Approved'
    REJECTED = 'REJECTED', 'Payment Rejected'
    ALLOCATED = 'ALLOCATED', 'Allocated to Invoice'
    REFUNDED = 'REFUNDED', 'Payment Refunded'
    NOTE_ADDED = 'NOTE_ADDED', 'Note Added'
    METHOD_MODIFIED = 'METHOD_MODIFIED', 'Payment Method Modified'
    CUSTOMER_CHANGED = 'CUSTOMER_CHANGED', 'Customer Changed'


class PaymentHistory(BaseModel):
    """
    Payment history tracking model
    
    Records all changes and significant events for payments,
    providing complete audit trail for compliance and disputes.
    """
    payment = models.ForeignKey(
        'Payment',
        on_delete=models.CASCADE,
        related_name='history',
        help_text='Payment this history entry relates to'
    )
    action = models.CharField(
        max_length=50,
        choices=PaymentHistoryAction.choices,
        help_text='Type of action/change'
    )
    old_value = models.JSONField(
        blank=True,
        null=True,
        help_text='Previous value before change (JSON)'
    )
    new_value = models.JSONField(
        blank=True,
        null=True,
        help_text='New value after change (JSON)'
    )
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payment_changes',
        help_text='User who made the change'
    )
    changed_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When the change occurred'
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text='Human-readable description of the change'
    )
    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        help_text='IP address of user (for security audit)'
    )
    
    class Meta:
        db_table = 'payment_history'
        ordering = ['-changed_at', '-created_at']
        verbose_name = 'Payment History'
        verbose_name_plural = 'Payment Histories'
        indexes = [
            models.Index(fields=['payment', '-changed_at']),
            models.Index(fields=['action', '-changed_at']),
            models.Index(fields=['changed_by', '-changed_at']),
        ]
    
    def __str__(self):
        return f'{self.payment.payment_number} - {self.action} at {self.changed_at}'
    
    def get_change_summary(self):
        """
        Get formatted summary of the change
        
        Returns:
            str: Human-readable change summary
        """
        if self.action == PaymentHistoryAction.STATUS_CHANGE:
            old_status = self.old_value.get('status') if self.old_value else 'N/A'
            new_status = self.new_value.get('status') if self.new_value else 'N/A'
            return f'Status changed from {old_status} to {new_status}'
        
        elif self.action == PaymentHistoryAction.AMOUNT_MODIFIED:
            old_amount = self.old_value.get('amount') if self.old_value else '0'
            new_amount = self.new_value.get('amount') if self.new_value else '0'
            return f'Amount changed from Rs. {old_amount} to Rs. {new_amount}'
        
        elif self.action == PaymentHistoryAction.APPROVED:
            approver = self.changed_by.get_full_name() if self.changed_by else 'Unknown'
            return f'Payment approved by {approver}'
        
        elif self.action == PaymentHistoryAction.ALLOCATED:
            invoice_number = self.new_value.get('invoice_number') if self.new_value else 'N/A'
            allocated_amount = self.new_value.get('allocated_amount') if self.new_value else '0'
            return f'Allocated Rs. {allocated_amount} to Invoice {invoice_number}'
        
        else:
            return self.description or f'{self.action} performed'
```

### PaymentHistory Usage Examples

**Example 1: Track Status Change**
```python
PaymentHistory.objects.create(
    tenant=payment.tenant,
    payment=payment,
    action=PaymentHistoryAction.STATUS_CHANGE,
    old_value={'status': 'PENDING'},
    new_value={'status': 'COMPLETED'},
    changed_by=user,
    description='Payment marked as completed after bank verification',
    ip_address='192.168.1.100'
)
```

**Example 2: Track Approval**
```python
PaymentHistory.objects.create(
    tenant=payment.tenant,
    payment=payment,
    action=PaymentHistoryAction.APPROVED,
    old_value={
        'approved': False,
        'approved_by': None
    },
    new_value={
        'approved': True,
        'approved_by': manager.id,
        'approved_at': timezone.now().isoformat()
    },
    changed_by=manager,
    description=f'Payment approved by {manager.get_full_name()}',
    ip_address=request.META.get('REMOTE_ADDR')
)
```

**Example 3: Track Invoice Allocation**
```python
PaymentHistory.objects.create(
    tenant=payment.tenant,
    payment=payment,
    action=PaymentHistoryAction.ALLOCATED,
    new_value={
        'invoice_id': invoice.id,
        'invoice_number': invoice.invoice_number,
        'allocated_amount': str(allocation_amount)
    },
    changed_by=user,
    description=f'Payment allocated to Invoice {invoice.invoice_number}',
    ip_address=request.META.get('REMOTE_ADDR')
)
```

### History Timeline Example

```
Payment: PAY-2026-00123 (Rs. 50,000)

Timeline:
├─ 2026-01-23 09:15 - CREATED
│  User: John Doe
│  Description: Payment created via CASH method
│
├─ 2026-01-23 09:16 - ALLOCATED
│  User: John Doe
│  Description: Allocated Rs. 50,000 to Invoice INV-2026-00456
│  Details: Invoice status changed to PAID
│
├─ 2026-01-23 14:30 - APPROVED
│  User: Jane Manager
│  Description: Payment approved by Jane Manager
│  Status: PENDING → COMPLETED
│
└─ 2026-01-24 10:00 - NOTE_ADDED
   User: Finance Team
   Description: Internal note added: "Verified against cash register report"
```

### Expected Outcome
- PaymentHistory model for audit trail
- Action types for various payment events
- Old/new value tracking with JSON
- User and timestamp tracking
- IP address logging for security
- Helper methods for formatted display

### Verification Checklist
- [ ] payment_history.py created in models/
- [ ] PaymentHistory model defined
- [ ] PaymentHistoryAction choices defined
- [ ] All required fields (payment, action, changed_by, changed_at)
- [ ] old_value and new_value JSONField
- [ ] ip_address field for security audit
- [ ] get_change_summary() helper method
- [ ] Model Meta with ordering and indexes
- [ ] __str__ method for admin display

---

## Task 33: Create PaymentSettings Model

### Overview
Create the PaymentSettings model to store tenant-specific payment configuration, such as default payment terms, grace periods, late payment fees, and payment notification settings.

### Dependencies
- BaseModel exists
- Tenant model exists

### Instructions

1. **Create payment_settings.py model file**
   - Create file at `apps/payments/models/payment_settings.py`
   - Import BaseModel
   - Define PaymentSettings model

2. **Define general payment settings fields**
   - default_payment_terms_days: Default payment terms (e.g., Net 30)
   - grace_period_days: Grace period before late fees
   - enable_late_fees: Boolean to enable/disable late fees
   - late_fee_type: PERCENTAGE or FIXED
   - late_fee_value: Fee amount/percentage

3. **Define notification settings**
   - send_payment_confirmation: Email on payment receipt
   - send_payment_receipt: Automatic receipt generation
   - payment_reminder_days: Days before due date to send reminder

4. **Define processing settings**
   - auto_allocate_to_oldest: Auto-allocate to oldest invoice
   - allow_overpayment: Allow payments exceeding balance
   - require_customer_for_payment: Enforce customer linkage

5. **Add receipt settings**
   - receipt_header_text: Custom header for receipts
   - receipt_footer_text: Custom footer with terms/contact
   - include_company_logo: Boolean for logo on receipts

6. **Use OneToOneField with Tenant**
   - One settings record per tenant
   - Auto-create on tenant creation

### Model Structure

```python
from django.db import models
from core.models import BaseModel


class LateFeeType(models.TextChoices):
    """Late fee calculation types"""
    PERCENTAGE = 'PERCENTAGE', 'Percentage of Outstanding'
    FIXED = 'FIXED', 'Fixed Amount'


class PaymentSettings(BaseModel):
    """
    Tenant-specific payment settings and configuration
    
    Controls payment behavior, late fees, notifications,
    and receipt generation for each tenant.
    """
    # General Payment Settings
    default_payment_terms_days = models.IntegerField(
        default=30,
        help_text='Default payment terms in days (e.g., Net 30)'
    )
    grace_period_days = models.IntegerField(
        default=0,
        help_text='Grace period before applying late fees'
    )
    
    # Late Fee Configuration
    enable_late_fees = models.BooleanField(
        default=False,
        help_text='Enable late payment fees'
    )
    late_fee_type = models.CharField(
        max_length=20,
        choices=LateFeeType.choices,
        default=LateFeeType.PERCENTAGE,
        help_text='Type of late fee calculation'
    )
    late_fee_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Late fee amount (percentage or fixed amount in LKR)'
    )
    late_fee_frequency = models.CharField(
        max_length=20,
        choices=[
            ('ONCE', 'Once'),
            ('DAILY', 'Daily'),
            ('WEEKLY', 'Weekly'),
            ('MONTHLY', 'Monthly'),
        ],
        default='ONCE',
        help_text='How often to apply late fees'
    )
    
    # Notification Settings
    send_payment_confirmation = models.BooleanField(
        default=True,
        help_text='Send email confirmation on payment receipt'
    )
    send_payment_receipt = models.BooleanField(
        default=True,
        help_text='Auto-generate and send payment receipts'
    )
    payment_reminder_days = models.IntegerField(
        default=7,
        help_text='Days before due date to send payment reminder'
    )
    send_overdue_reminders = models.BooleanField(
        default=True,
        help_text='Send reminders for overdue payments'
    )
    
    # Processing Settings
    auto_allocate_to_oldest = models.BooleanField(
        default=True,
        help_text='Automatically allocate payments to oldest invoices first'
    )
    allow_overpayment = models.BooleanField(
        default=False,
        help_text='Allow payments exceeding invoice balance'
    )
    convert_overpayment_to_credit = models.BooleanField(
        default=True,
        help_text='Convert overpayments to store credit'
    )
    require_customer_for_payment = models.BooleanField(
        default=True,
        help_text='Require customer to be specified for all payments'
    )
    
    # Receipt Settings
    receipt_prefix = models.CharField(
        max_length=10,
        default='REC',
        help_text='Prefix for receipt numbers (e.g., REC-2026-00001)'
    )
    receipt_header_text = models.TextField(
        blank=True,
        null=True,
        help_text='Custom header text for payment receipts'
    )
    receipt_footer_text = models.TextField(
        blank=True,
        null=True,
        help_text='Custom footer text for payment receipts (terms, contact info)'
    )
    include_company_logo = models.BooleanField(
        default=True,
        help_text='Include company logo on receipts'
    )
    include_payment_method_details = models.BooleanField(
        default=True,
        help_text='Include payment method details (card last 4, etc.) on receipt'
    )
    
    # Currency Settings
    currency_code = models.CharField(
        max_length=3,
        default='LKR',
        help_text='Default currency code (ISO 4217)'
    )
    currency_symbol = models.CharField(
        max_length=5,
        default='Rs.',
        help_text='Currency symbol for display'
    )
    decimal_places = models.IntegerField(
        default=2,
        help_text='Number of decimal places for currency'
    )
    
    # Audit Fields
    last_modified_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='modified_payment_settings',
        help_text='User who last modified settings'
    )
    
    class Meta:
        db_table = 'payment_settings'
        verbose_name = 'Payment Settings'
        verbose_name_plural = 'Payment Settings'
    
    def __str__(self):
        return f'Payment Settings for {self.tenant.name if self.tenant else "Unknown"}'
    
    def calculate_late_fee(self, outstanding_amount):
        """
        Calculate late fee based on settings
        
        Args:
            outstanding_amount: Decimal outstanding balance
            
        Returns:
            Decimal: Late fee amount
        """
        from decimal import Decimal
        
        if not self.enable_late_fees:
            return Decimal('0.00')
        
        if self.late_fee_type == LateFeeType.PERCENTAGE:
            fee = outstanding_amount * (self.late_fee_value / 100)
        else:  # FIXED
            fee = self.late_fee_value
        
        return fee.quantize(Decimal('0.01'))
    
    def get_receipt_number_format(self):
        """
        Get receipt number format
        
        Returns:
            str: Format string for receipt numbers
        """
        return f'{self.receipt_prefix}-{{year}}-{{sequence:05d}}'
```

### PaymentSettings Usage Examples

**Example 1: Configure Late Fees**
```python
settings = PaymentSettings.objects.get(tenant=tenant)

# Enable 5% monthly late fee after 7-day grace period
settings.enable_late_fees = True
settings.grace_period_days = 7
settings.late_fee_type = LateFeeType.PERCENTAGE
settings.late_fee_value = Decimal('5.00')  # 5%
settings.late_fee_frequency = 'MONTHLY'
settings.save()

# Calculate late fee for Rs. 100,000 outstanding
late_fee = settings.calculate_late_fee(Decimal('100000.00'))
# Result: Rs. 5,000
```

**Example 2: Configure Notifications**
```python
settings = PaymentSettings.objects.get(tenant=tenant)

# Enable payment confirmations and reminders
settings.send_payment_confirmation = True
settings.send_payment_receipt = True
settings.payment_reminder_days = 7  # Send reminder 7 days before due
settings.send_overdue_reminders = True
settings.save()
```

**Example 3: Configure Auto-Allocation**
```python
settings = PaymentSettings.objects.get(tenant=tenant)

# Auto-allocate to oldest invoices
settings.auto_allocate_to_oldest = True

# Allow overpayment and convert to store credit
settings.allow_overpayment = True
settings.convert_overpayment_to_credit = True

settings.save()
```

### Sri Lankan Payment Terms Reference

| Payment Terms | Days | Description |
|---------------|------|-------------|
| Net 7 | 7 | Payment due in 7 days |
| Net 15 | 15 | Payment due in 15 days |
| Net 30 | 30 | Payment due in 30 days (most common) |
| Net 45 | 45 | Payment due in 45 days |
| Net 60 | 60 | Payment due in 60 days |
| COD | 0 | Cash on delivery |
| Due on Receipt | 0 | Payment due immediately |

### Late Fee Examples

**Percentage-Based:**
```
Invoice Amount: Rs. 250,000
Payment Terms: Net 30
Grace Period: 7 days
Late Fee: 2% per month

Timeline:
- Day 0: Invoice issued
- Day 30: Payment due
- Day 37: Grace period ends (Day 30 + 7)
- Day 38+: Late fee applies

Late Fee Calculation:
Outstanding: Rs. 250,000
Fee (2%): Rs. 5,000 per month
```

**Fixed Amount:**
```
Invoice Amount: Rs. 50,000
Payment Terms: Net 15
Grace Period: 0 days
Late Fee: Rs. 500 flat fee

Timeline:
- Day 0: Invoice issued
- Day 15: Payment due
- Day 16+: Late fee applies

Late Fee:
Flat fee: Rs. 500 (regardless of amount)
```

### Expected Outcome
- PaymentSettings model for tenant configuration
- Late fee calculation logic
- Notification preferences
- Auto-allocation settings
- Receipt customization options
- Currency settings for Sri Lankan context

### Verification Checklist
- [ ] payment_settings.py created in models/
- [ ] PaymentSettings model defined
- [ ] Late fee settings (type, value, frequency)
- [ ] Notification settings (confirmation, reminders)
- [ ] Processing settings (auto-allocate, overpayment)
- [ ] Receipt settings (prefix, header, footer)
- [ ] Currency settings (LKR default)
- [ ] calculate_late_fee() method implemented
- [ ] OneToOneField with Tenant (in BaseModel)
- [ ] __str__ method for admin display

---

## Task 34: Implement Fee Calculator Service

### Overview
Create a dedicated FeeCalculatorService to calculate processing fees, late fees, and other charges associated with payments. This centralizes fee calculation logic and ensures consistency across the application.

### Dependencies
- Task 33: Create PaymentSettings Model
- PaymentMethodConfig model exists

### Instructions

1. **Create fee_calculator_service.py file**
   - Create file at `apps/payments/services/fee_calculator_service.py`
   - Import necessary models (PaymentSettings, PaymentMethodConfig)
   - Define FeeCalculatorService class

2. **Implement calculate_processing_fee() method**
   - Get PaymentMethodConfig for tenant and method
   - Calculate based on PERCENTAGE or FIXED
   - Return fee amount

3. **Implement calculate_late_fee() method**
   - Get PaymentSettings for tenant
   - Check if late fees enabled
   - Calculate based on days overdue and settings
   - Handle grace period

4. **Implement calculate_early_payment_discount() method**
   - If invoice paid before terms
   - Calculate discount (e.g., 2% if paid within 10 days on Net 30)
   - Return discount amount

5. **Implement get_fee_breakdown() method**
   - Return detailed breakdown of all fees
   - For display on invoices/receipts

### Implementation

```python
import logging
from decimal import Decimal
from datetime import date, timedelta
from django.utils import timezone

from apps.payments.models import PaymentSettings, PaymentMethodConfig
from apps.payments.constants import PaymentMethod

logger = logging.getLogger(__name__)


class FeeCalculatorService:
    """
    Service for calculating payment-related fees
    
    Centralizes fee calculation logic for processing fees,
    late fees, and early payment discounts.
    """
    
    @staticmethod
    def calculate_processing_fee(tenant, method, amount):
        """
        Calculate processing fee for payment method
        
        Args:
            tenant: Tenant instance
            method: PaymentMethod choice
            amount: Payment amount (Decimal)
            
        Returns:
            Decimal: Processing fee amount
        """
        from decimal import Decimal
        
        try:
            config = PaymentMethodConfig.objects.get(
                tenant=tenant,
                method=method
            )
            
            if not config.is_enabled:
                return Decimal('0.00')
            
            if config.processing_fee_type == 'PERCENTAGE':
                fee = amount * (config.processing_fee_value / 100)
            elif config.processing_fee_type == 'FIXED':
                fee = config.processing_fee_value
            else:
                fee = Decimal('0.00')
            
            # Apply minimum fee if configured
            if config.min_processing_fee and fee < config.min_processing_fee:
                fee = config.min_processing_fee
            
            # Apply maximum fee if configured
            if config.max_processing_fee and fee > config.max_processing_fee:
                fee = config.max_processing_fee
            
            return fee.quantize(Decimal('0.01'))
            
        except PaymentMethodConfig.DoesNotExist:
            logger.warning(
                f'PaymentMethodConfig not found for tenant {tenant.name}, method {method}'
            )
            return Decimal('0.00')
    
    @staticmethod
    def calculate_late_fee(tenant, invoice, as_of_date=None):
        """
        Calculate late fee for overdue invoice
        
        Args:
            tenant: Tenant instance
            invoice: Invoice instance
            as_of_date: Optional date to calculate as of (defaults to today)
            
        Returns:
            dict: {
                'fee_amount': Decimal,
                'days_overdue': int,
                'grace_period_expired': bool,
                'calculation_details': str
            }
        """
        from decimal import Decimal
        
        try:
            settings = PaymentSettings.objects.get(tenant=tenant)
            
            # Check if late fees enabled
            if not settings.enable_late_fees:
                return {
                    'fee_amount': Decimal('0.00'),
                    'days_overdue': 0,
                    'grace_period_expired': False,
                    'calculation_details': 'Late fees not enabled'
                }
            
            # Determine comparison date
            comparison_date = as_of_date or date.today()
            
            # Check if invoice is overdue
            if not invoice.due_date or invoice.due_date >= comparison_date:
                return {
                    'fee_amount': Decimal('0.00'),
                    'days_overdue': 0,
                    'grace_period_expired': False,
                    'calculation_details': 'Invoice not yet due'
                }
            
            # Calculate days overdue
            days_overdue = (comparison_date - invoice.due_date).days
            
            # Apply grace period
            effective_overdue_days = max(0, days_overdue - settings.grace_period_days)
            grace_period_expired = days_overdue > settings.grace_period_days
            
            if effective_overdue_days <= 0:
                return {
                    'fee_amount': Decimal('0.00'),
                    'days_overdue': days_overdue,
                    'grace_period_expired': False,
                    'calculation_details': f'Within {settings.grace_period_days}-day grace period'
                }
            
            # Calculate outstanding amount
            outstanding = invoice.total_amount - invoice.paid_amount
            
            if outstanding <= 0:
                return {
                    'fee_amount': Decimal('0.00'),
                    'days_overdue': days_overdue,
                    'grace_period_expired': True,
                    'calculation_details': 'Invoice fully paid'
                }
            
            # Calculate fee based on frequency
            if settings.late_fee_frequency == 'ONCE':
                # Apply once after grace period
                fee = settings.calculate_late_fee(outstanding)
                details = f'One-time late fee on Rs. {outstanding}'
            
            elif settings.late_fee_frequency == 'MONTHLY':
                # Apply per month overdue
                months_overdue = effective_overdue_days / 30
                fee = settings.calculate_late_fee(outstanding) * Decimal(str(months_overdue))
                details = f'Monthly late fee for {months_overdue:.1f} months on Rs. {outstanding}'
            
            elif settings.late_fee_frequency == 'WEEKLY':
                # Apply per week overdue
                weeks_overdue = effective_overdue_days / 7
                fee = settings.calculate_late_fee(outstanding) * Decimal(str(weeks_overdue))
                details = f'Weekly late fee for {weeks_overdue:.1f} weeks on Rs. {outstanding}'
            
            elif settings.late_fee_frequency == 'DAILY':
                # Apply per day overdue
                fee = settings.calculate_late_fee(outstanding) * effective_overdue_days
                details = f'Daily late fee for {effective_overdue_days} days on Rs. {outstanding}'
            
            else:
                fee = Decimal('0.00')
                details = 'Unknown fee frequency'
            
            return {
                'fee_amount': fee.quantize(Decimal('0.01')),
                'days_overdue': days_overdue,
                'effective_overdue_days': effective_overdue_days,
                'grace_period_expired': grace_period_expired,
                'calculation_details': details
            }
            
        except PaymentSettings.DoesNotExist:
            logger.warning(f'PaymentSettings not found for tenant {tenant.name}')
            return {
                'fee_amount': Decimal('0.00'),
                'days_overdue': 0,
                'grace_period_expired': False,
                'calculation_details': 'Settings not configured'
            }
    
    @staticmethod
    def calculate_early_payment_discount(tenant, invoice, payment_date=None):
        """
        Calculate early payment discount if applicable
        
        Args:
            tenant: Tenant instance
            invoice: Invoice instance
            payment_date: Optional payment date (defaults to today)
            
        Returns:
            dict: {
                'discount_amount': Decimal,
                'discount_percentage': Decimal,
                'days_early': int,
                'eligible': bool
            }
        """
        from decimal import Decimal
        
        try:
            settings = PaymentSettings.objects.get(tenant=tenant)
            
            # Check if early payment discounts configured
            # (Assuming additional fields added to PaymentSettings)
            if not hasattr(settings, 'enable_early_payment_discount'):
                return {
                    'discount_amount': Decimal('0.00'),
                    'discount_percentage': Decimal('0.00'),
                    'days_early': 0,
                    'eligible': False
                }
            
            if not settings.enable_early_payment_discount:
                return {
                    'discount_amount': Decimal('0.00'),
                    'discount_percentage': Decimal('0.00'),
                    'days_early': 0,
                    'eligible': False
                }
            
            payment_date = payment_date or date.today()
            
            # Check if paid early
            if not invoice.due_date or payment_date >= invoice.due_date:
                return {
                    'discount_amount': Decimal('0.00'),
                    'discount_percentage': Decimal('0.00'),
                    'days_early': 0,
                    'eligible': False
                }
            
            days_early = (invoice.due_date - payment_date).days
            
            # Check if within discount window
            if days_early < settings.early_payment_discount_days:
                return {
                    'discount_amount': Decimal('0.00'),
                    'discount_percentage': Decimal('0.00'),
                    'days_early': days_early,
                    'eligible': False
                }
            
            # Calculate discount
            discount_percentage = settings.early_payment_discount_percentage
            discount_amount = invoice.total_amount * (discount_percentage / 100)
            
            return {
                'discount_amount': discount_amount.quantize(Decimal('0.01')),
                'discount_percentage': discount_percentage,
                'days_early': days_early,
                'eligible': True
            }
            
        except PaymentSettings.DoesNotExist:
            logger.warning(f'PaymentSettings not found for tenant {tenant.name}')
            return {
                'discount_amount': Decimal('0.00'),
                'discount_percentage': Decimal('0.00'),
                'days_early': 0,
                'eligible': False
            }
    
    @staticmethod
    def get_fee_breakdown(tenant, method, amount, invoice=None):
        """
        Get detailed breakdown of all fees
        
        Args:
            tenant: Tenant instance
            method: PaymentMethod choice
            amount: Payment amount
            invoice: Optional invoice for late fee calculation
            
        Returns:
            dict: Complete fee breakdown
        """
        from decimal import Decimal
        
        breakdown = {
            'payment_amount': amount,
            'processing_fee': Decimal('0.00'),
            'late_fee': Decimal('0.00'),
            'early_payment_discount': Decimal('0.00'),
            'total_amount': amount,
            'details': []
        }
        
        # Calculate processing fee
        processing_fee = FeeCalculatorService.calculate_processing_fee(
            tenant, method, amount
        )
        breakdown['processing_fee'] = processing_fee
        
        if processing_fee > 0:
            breakdown['details'].append({
                'type': 'processing_fee',
                'description': f'{method} processing fee',
                'amount': float(processing_fee)
            })
        
        # Calculate late fee if invoice provided
        if invoice:
            late_fee_result = FeeCalculatorService.calculate_late_fee(tenant, invoice)
            breakdown['late_fee'] = late_fee_result['fee_amount']
            
            if late_fee_result['fee_amount'] > 0:
                breakdown['details'].append({
                    'type': 'late_fee',
                    'description': late_fee_result['calculation_details'],
                    'amount': float(late_fee_result['fee_amount']),
                    'days_overdue': late_fee_result['days_overdue']
                })
        
        # Calculate total
        breakdown['total_amount'] = (
            amount + 
            processing_fee + 
            breakdown['late_fee'] - 
            breakdown['early_payment_discount']
        )
        
        return breakdown
```

### Fee Calculation Examples

**Example 1: Card Processing Fee**
```python
# Card payment: Rs. 50,000
# Processing fee: 2.5%

fee = FeeCalculatorService.calculate_processing_fee(
    tenant=tenant,
    method=PaymentMethod.CARD,
    amount=Decimal('50000.00')
)

# Result: Rs. 1,250.00
# Total charged: Rs. 51,250.00
```

**Example 2: Late Fee Calculation**
```python
# Invoice: Rs. 100,000
# Due date: 2026-01-15
# Today: 2026-02-01 (17 days overdue)
# Grace period: 7 days
# Late fee: 2% monthly

result = FeeCalculatorService.calculate_late_fee(
    tenant=tenant,
    invoice=invoice,
    as_of_date=date(2026, 2, 1)
)

# Result:
{
    'fee_amount': Decimal('666.67'),  # (100,000 * 2%) * (10 days / 30 days per month)
    'days_overdue': 17,
    'effective_overdue_days': 10,  # After 7-day grace
    'grace_period_expired': True,
    'calculation_details': 'Monthly late fee for 0.3 months on Rs. 100,000'
}
```

**Example 3: Complete Fee Breakdown**
```python
breakdown = FeeCalculatorService.get_fee_breakdown(
    tenant=tenant,
    method=PaymentMethod.CARD,
    amount=Decimal('75000.00'),
    invoice=overdue_invoice
)

# Result:
{
    'payment_amount': Decimal('75000.00'),
    'processing_fee': Decimal('1875.00'),  # 2.5% of 75,000
    'late_fee': Decimal('1500.00'),  # 2% of 75,000
    'early_payment_discount': Decimal('0.00'),
    'total_amount': Decimal('78375.00'),
    'details': [
        {
            'type': 'processing_fee',
            'description': 'CARD processing fee',
            'amount': 1875.00
        },
        {
            'type': 'late_fee',
            'description': 'Monthly late fee for 1.0 months on Rs. 75,000',
            'amount': 1500.00,
            'days_overdue': 37
        }
    ]
}
```

### Expected Outcome
- Centralized fee calculation service
- Processing fee calculation
- Late fee calculation with grace period
- Early payment discount support
- Complete fee breakdown method
- Consistent fee logic across application

### Verification Checklist
- [ ] fee_calculator_service.py created
- [ ] FeeCalculatorService class defined
- [ ] calculate_processing_fee() implemented
- [ ] calculate_late_fee() with grace period
- [ ] calculate_early_payment_discount() implemented
- [ ] get_fee_breakdown() for detailed view
- [ ] Min/max fee caps honored
- [ ] Logging for debugging

---

## Task 35: Add Payment History Tracking

### Overview
Implement automatic payment history tracking by integrating PaymentHistory model with PaymentService methods. Every payment creation, modification, and status change should automatically create history records.

### Dependencies
- Task 32: Create PaymentHistory Model
- PaymentService methods exist

### Instructions

1. **Create payment_history_service.py**
   - Create helper service for creating history records
   - Simplify history tracking calls

2. **Add create_history_entry() method**
   - Accept payment, action, user, old_value, new_value
   - Create PaymentHistory record
   - Capture IP address if available

3. **Integrate with PaymentService**
   - Add history tracking to create_payment()
   - Add history tracking to update_payment_status()
   - Add history tracking to approve_payment()
   - Add history tracking to allocate_payment_to_invoice()

4. **Add history tracking to signal handlers**
   - Use Django signals (post_save, pre_save)
   - Automatically track changes
   - Alternative to manual calls

5. **Create get_payment_history() query method**
   - Retrieve full history for a payment
   - Filter by action type
   - Format for display

### Implementation

```python
import logging
from django.utils import timezone

from apps.payments.models import PaymentHistory, PaymentHistoryAction

logger = logging.getLogger(__name__)


class PaymentHistoryService:
    """
    Service for tracking payment history
    
    Provides helpers for creating and querying payment history records.
    """
    
    @staticmethod
    def create_history_entry(
        payment,
        action,
        user,
        old_value=None,
        new_value=None,
        description=None,
        request=None
    ):
        """
        Create payment history entry
        
        Args:
            payment: Payment instance
            action: PaymentHistoryAction choice
            user: User making the change
            old_value: Optional dict of old values
            new_value: Optional dict of new values
            description: Optional description
            request: Optional HTTP request for IP capture
            
        Returns:
            PaymentHistory instance
        """
        # Capture IP address if request provided
        ip_address = None
        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            
            # Handle proxied requests
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0].strip()
        
        history = PaymentHistory.objects.create(
            tenant=payment.tenant,
            payment=payment,
            action=action,
            old_value=old_value,
            new_value=new_value,
            changed_by=user,
            description=description,
            ip_address=ip_address
        )
        
        logger.info(
            f'Payment history created: {payment.payment_number}, '
            f'Action: {action}, User: {user.get_full_name() if user else "System"}'
        )
        
        return history
    
    @staticmethod
    def track_payment_creation(payment, user, request=None):
        """Track payment creation"""
        return PaymentHistoryService.create_history_entry(
            payment=payment,
            action=PaymentHistoryAction.CREATED,
            user=user,
            new_value={
                'payment_number': payment.payment_number,
                'amount': str(payment.amount),
                'method': payment.method,
                'status': payment.status
            },
            description=f'Payment created via {payment.method} for Rs. {payment.amount}',
            request=request
        )
    
    @staticmethod
    def track_status_change(payment, old_status, new_status, user, reason=None, request=None):
        """Track payment status change"""
        description = f'Status changed from {old_status} to {new_status}'
        if reason:
            description += f': {reason}'
        
        return PaymentHistoryService.create_history_entry(
            payment=payment,
            action=PaymentHistoryAction.STATUS_CHANGE,
            user=user,
            old_value={'status': old_status},
            new_value={'status': new_status},
            description=description,
            request=request
        )
    
    @staticmethod
    def track_approval(payment, user, request=None):
        """Track payment approval"""
        return PaymentHistoryService.create_history_entry(
            payment=payment,
            action=PaymentHistoryAction.APPROVED,
            user=user,
            new_value={
                'approved_by': user.id,
                'approved_at': timezone.now().isoformat()
            },
            description=f'Payment approved by {user.get_full_name()}',
            request=request
        )
    
    @staticmethod
    def track_allocation(payment, invoice, amount, user, request=None):
        """Track payment allocation to invoice"""
        return PaymentHistoryService.create_history_entry(
            payment=payment,
            action=PaymentHistoryAction.ALLOCATED,
            user=user,
            new_value={
                'invoice_id': str(invoice.id),
                'invoice_number': invoice.invoice_number,
                'allocated_amount': str(amount)
            },
            description=f'Allocated Rs. {amount} to Invoice {invoice.invoice_number}',
            request=request
        )
    
    @staticmethod
    def get_payment_history(payment, action=None):
        """
        Get payment history
        
        Args:
            payment: Payment instance
            action: Optional action type filter
            
        Returns:
            QuerySet: PaymentHistory records
        """
        query = PaymentHistory.objects.filter(payment=payment)
        
        if action:
            query = query.filter(action=action)
        
        return query.select_related('changed_by').order_by('-changed_at')
    
    @staticmethod
    def get_payment_history_summary(payment):
        """
        Get formatted history summary for payment
        
        Returns:
            list: List of formatted history entries
        """
        history = PaymentHistoryService.get_payment_history(payment)
        
        summary = []
        for entry in history:
            summary.append({
                'timestamp': entry.changed_at.isoformat(),
                'action': entry.action,
                'user': entry.changed_by.get_full_name() if entry.changed_by else 'System',
                'summary': entry.get_change_summary(),
                'ip_address': entry.ip_address
            })
        
        return summary
```

### Integration with PaymentService

**Update PaymentService methods to include history tracking:**

```python
# In PaymentService.create_payment():
payment = Payment.objects.create(...)

# Track creation
PaymentHistoryService.track_payment_creation(
    payment=payment,
    user=user,
    request=request  # Pass from view
)

# In PaymentService.update_payment_status():
old_status = payment.status
payment.status = new_status
payment.save()

# Track status change
PaymentHistoryService.track_status_change(
    payment=payment,
    old_status=old_status,
    new_status=new_status,
    user=user,
    reason=reason,
    request=request
)

# In PaymentService.approve_payment():
payment.approved_by = user
payment.save()

# Track approval
PaymentHistoryService.track_approval(
    payment=payment,
    user=user,
    request=request
)

# In PaymentService.allocate_payment_to_invoice():
# After allocation
PaymentHistoryService.track_allocation(
    payment=payment,
    invoice=invoice,
    amount=allocation_amount,
    user=user,
    request=request
)
```

### History Timeline Display

```python
# Get payment history summary
summary = PaymentHistoryService.get_payment_history_summary(payment)

# Display in admin or API:
[
    {
        'timestamp': '2026-01-23T09:15:00Z',
        'action': 'CREATED',
        'user': 'John Doe',
        'summary': 'Payment created via CASH for Rs. 50,000',
        'ip_address': '192.168.1.100'
    },
    {
        'timestamp': '2026-01-23T09:16:00Z',
        'action': 'ALLOCATED',
        'user': 'John Doe',
        'summary': 'Allocated Rs. 50,000 to Invoice INV-2026-00456',
        'ip_address': '192.168.1.100'
    },
    {
        'timestamp': '2026-01-23T14:30:00Z',
        'action': 'APPROVED',
        'user': 'Jane Manager',
        'summary': 'Payment approved by Jane Manager',
        'ip_address': '192.168.1.105'
    }
]
```

### Expected Outcome
- Automatic payment history tracking
- Integration with all PaymentService methods
- IP address capture for security audit
- Query methods for history retrieval
- Formatted history summaries

### Verification Checklist
- [ ] payment_history_service.py created
- [ ] PaymentHistoryService class defined
- [ ] create_history_entry() helper method
- [ ] track_payment_creation() implemented
- [ ] track_status_change() implemented
- [ ] track_approval() implemented
- [ ] track_allocation() implemented
- [ ] Integration with PaymentService methods
- [ ] IP address capture from request
- [ ] get_payment_history() query method
- [ ] get_payment_history_summary() for display

---

## Task 36: Create Initial Migrations

### Overview
Generate and apply Django migrations for all payment models created in this subphase. Migrations should be organized, properly ordered, and tested for both creation and rollback.

### Dependencies
- All payment models created (Tasks 1-35)
- Django migration system configured

### Instructions

1. **Review all models created**
   - Payment
   - PaymentAllocation
   - PaymentHistory
   - PaymentSettings
   - PaymentMethodConfig

2. **Generate initial migrations**
   - Run `python manage.py makemigrations payments`
   - Review generated migration file
   - Check for any warnings or issues

3. **Add custom migration operations if needed**
   - Create PaymentSettings for existing tenants
   - Create default PaymentMethodConfig records
   - Populate initial data

4. **Test migrations**
   - Apply: `python manage.py migrate payments`
   - Verify all tables created
   - Check indexes and constraints
   - Test rollback: `python manage.py migrate payments zero`

5. **Create data migration for defaults**
   - Separate data migration after schema migration
   - Create default settings and configs
   - Run after initial schema migration

### Migration Commands

```bash
# 1. Generate migrations for payment models
python manage.py makemigrations payments

# Expected output:
# Migrations for 'payments':
#   payments/migrations/0001_initial.py
#     - Create model Payment
#     - Create model PaymentMethodConfig
#     - Create model PaymentSettings
#     - Create model PaymentAllocation
#     - Create model PaymentHistory
#     - Add indexes
#     - Add constraints

# 2. Review the migration file
# Check: e:\tmp\pos-arch\apps\payments\migrations\0001_initial.py

# 3. Apply migrations
python manage.py migrate payments

# Expected output:
# Running migrations:
#   Applying payments.0001_initial... OK

# 4. Verify tables created
python manage.py dbshell
\dt payments_*

# Expected tables:
# - payments_payment
# - payments_payment_method_config
# - payments_payment_settings
# - payments_payment_allocation
# - payments_payment_history

# 5. Create data migration for defaults
python manage.py makemigrations payments --empty --name create_default_payment_settings

# 6. Edit migration to populate defaults
# (See data migration example below)

# 7. Apply data migration
python manage.py migrate payments
```

### Data Migration Example

```python
# payments/migrations/0002_create_default_payment_settings.py

from django.db import migrations
from decimal import Decimal


def create_default_payment_settings(apps, schema_editor):
    """Create default PaymentSettings for all tenants"""
    Tenant = apps.get_model('core', 'Tenant')
    PaymentSettings = apps.get_model('payments', 'PaymentSettings')
    
    for tenant in Tenant.objects.all():
        PaymentSettings.objects.get_or_create(
            tenant=tenant,
            defaults={
                'default_payment_terms_days': 30,
                'grace_period_days': 7,
                'enable_late_fees': False,
                'late_fee_type': 'PERCENTAGE',
                'late_fee_value': Decimal('2.00'),
                'send_payment_confirmation': True,
                'send_payment_receipt': True,
                'payment_reminder_days': 7,
                'auto_allocate_to_oldest': True,
                'allow_overpayment': False,
                'require_customer_for_payment': True,
                'receipt_prefix': 'REC',
                'currency_code': 'LKR',
                'currency_symbol': 'Rs.',
                'decimal_places': 2
            }
        )


def create_default_payment_method_configs(apps, schema_editor):
    """Create default PaymentMethodConfig for all tenants"""
    Tenant = apps.get_model('core', 'Tenant')
    PaymentMethodConfig = apps.get_model('payments', 'PaymentMethodConfig')
    
    # Default configurations for each payment method
    default_configs = {
        'CASH': {
            'is_enabled': True,
            'min_amount': Decimal('0.00'),
            'max_amount': None,
            'processing_fee_type': 'FIXED',
            'processing_fee_value': Decimal('0.00'),
            'requires_approval': False,
            'approval_threshold': Decimal('50000.00'),
        },
        'CARD': {
            'is_enabled': True,
            'min_amount': Decimal('100.00'),
            'max_amount': None,
            'processing_fee_type': 'PERCENTAGE',
            'processing_fee_value': Decimal('2.50'),  # 2.5%
            'requires_approval': False,
            'approval_threshold': Decimal('200000.00'),
        },
        'BANK_TRANSFER': {
            'is_enabled': True,
            'min_amount': Decimal('1000.00'),
            'max_amount': None,
            'processing_fee_type': 'FIXED',
            'processing_fee_value': Decimal('0.00'),
            'requires_approval': True,  # Always requires verification
            'approval_threshold': Decimal('0.00'),
        },
        'MOBILE': {
            'is_enabled': True,
            'min_amount': Decimal('100.00'),
            'max_amount': Decimal('100000.00'),  # Sri Lankan mobile payment limit
            'processing_fee_type': 'PERCENTAGE',
            'processing_fee_value': Decimal('1.00'),  # 1%
            'requires_approval': False,
            'approval_threshold': Decimal('100000.00'),
        },
        'CHECK': {
            'is_enabled': True,
            'min_amount': Decimal('5000.00'),
            'max_amount': None,
            'processing_fee_type': 'FIXED',
            'processing_fee_value': Decimal('0.00'),
            'requires_approval': True,  # Always requires approval for checks
            'approval_threshold': Decimal('0.00'),
            'check_clearing_days': 3,
            'allow_post_dated_checks': True,
            'max_post_dated_days': 90,
        },
        'STORE_CREDIT': {
            'is_enabled': True,
            'min_amount': Decimal('0.00'),
            'max_amount': None,
            'processing_fee_type': 'FIXED',
            'processing_fee_value': Decimal('0.00'),
            'requires_approval': False,
            'approval_threshold': Decimal('50000.00'),
        },
    }
    
    for tenant in Tenant.objects.all():
        for method, config in default_configs.items():
            PaymentMethodConfig.objects.get_or_create(
                tenant=tenant,
                method=method,
                defaults=config
            )


def reverse_func(apps, schema_editor):
    """Reverse migration - delete all default records"""
    PaymentSettings = apps.get_model('payments', 'PaymentSettings')
    PaymentMethodConfig = apps.get_model('payments', 'PaymentMethodConfig')
    
    PaymentSettings.objects.all().delete()
    PaymentMethodConfig.objects.all().delete()


class Migration(migrations.Migration):
    
    dependencies = [
        ('payments', '0001_initial'),
    ]
    
    operations = [
        migrations.RunPython(
            create_default_payment_settings,
            reverse_func
        ),
        migrations.RunPython(
            create_default_payment_method_configs,
            reverse_func
        ),
    ]
```

### Migration Verification

```bash
# 1. Check migration status
python manage.py showmigrations payments

# Expected output:
# payments
#  [X] 0001_initial
#  [X] 0002_create_default_payment_settings

# 2. Verify tables exist
python manage.py dbshell
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'payment%';

# Expected tables:
# payments_payment
# payments_payment_method_config
# payments_payment_settings
# payments_payment_allocation
# payments_payment_history

# 3. Verify indexes
SELECT indexname FROM pg_indexes 
WHERE tablename LIKE 'payment%'
ORDER BY tablename, indexname;

# 4. Verify default data created
SELECT COUNT(*) FROM payments_payment_settings;
SELECT COUNT(*) FROM payments_payment_method_config;

# Should have records for each tenant

# 5. Test rollback (in development only!)
python manage.py migrate payments zero

# 6. Re-apply
python manage.py migrate payments
```

### Expected Outcome
- All payment models migrated to database
- Indexes and constraints properly created
- Default settings and configurations populated
- Migration tested for both apply and rollback
- Clean migration history

### Verification Checklist
- [ ] makemigrations command run successfully
- [ ] 0001_initial.py migration generated
- [ ] Migration includes all models (Payment, PaymentAllocation, PaymentHistory, PaymentSettings, PaymentMethodConfig)
- [ ] Indexes defined in migration
- [ ] Constraints included
- [ ] migrate command applied successfully
- [ ] All tables created in database
- [ ] Data migration created (0002_create_default_payment_settings.py)
- [ ] Default PaymentSettings created for tenants
- [ ] Default PaymentMethodConfig created for all methods
- [ ] Rollback tested (migrate zero)
- [ ] Re-apply successful

---

## Summary

This document completed Group B with essential supporting components:

1. ✅ **PaymentHistory Model** (Task 32): Complete audit trail with action tracking, old/new values, user tracking, IP logging
2. ✅ **PaymentSettings Model** (Task 33): Tenant-specific configuration for late fees, notifications, auto-allocation, receipts, currency
3. ✅ **Fee Calculator Service** (Task 34): Centralized fee calculation for processing fees, late fees, early discounts
4. ✅ **History Tracking** (Task 35): Automatic history creation integrated with PaymentService, query methods for retrieval
5. ✅ **Initial Migrations** (Task 36): Database schema creation, default data population, tested apply/rollback

**Group B (Payment Recording Services) is now complete!**

**Next Steps:** Proceed to [Group-C_Partial-Split-Payments](../Group-C_Partial-Split-Payments/) to implement partial payment support, split payment functionality, and payment plan features.
