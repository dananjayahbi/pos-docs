# Tasks 45-50: Payment Plans and Installment Management

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** C - Partial & Split Payments  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-37-44_Partial-Balance-Split.md](01_Tasks-37-44_Partial-Balance-Split.md)
- **→ Next Group:** [Group-D_Refunds-Adjustments](../Group-D_Refunds-Adjustments/)

---

## Document Overview

This document implements payment plans and installment management, allowing customers to pay invoices over time with scheduled payments. This includes creating payment plans, tracking installments, managing due dates, sending reminders, and handling missed payments.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create PaymentPlan Model | Medium | 25 min |
| 46 | Implement Payment Plan Creation | High | 30 min |
| 47 | Track Installment Payments | Medium | 25 min |
| 48 | Handle Missed Installments | Medium | 20 min |
| 49 | Add Payment Plan Reminders | Medium | 25 min |
| 50 | Create Payment Plan Migrations | Low | 15 min |

---

## Task 45: Create PaymentPlan Model

### Overview
Create the PaymentPlan and PaymentPlanInstallment models to support structured payment schedules, allowing customers to pay invoices in predefined installments over time.

### Dependencies
- Invoice model exists
- Payment model exists
- Customer model exists

### Instructions

1. **Create payment_plan.py model file**
   - Create file at `apps/payments/models/payment_plan.py`
   - Import BaseModel, Invoice, Customer
   - Define PaymentPlan and PaymentPlanInstallment models

2. **Define PaymentPlan fields**
   - invoice: ForeignKey to Invoice
   - customer: ForeignKey to Customer
   - plan_name: Descriptive name (e.g., "3-Month Payment Plan")
   - total_amount: Total amount to be paid
   - installment_count: Number of installments
   - frequency: WEEKLY, BIWEEKLY, MONTHLY
   - start_date: When first payment is due
   - status: ACTIVE, COMPLETED, CANCELLED, DEFAULTED

3. **Define PaymentPlanInstallment fields**
   - payment_plan: ForeignKey to PaymentPlan
   - installment_number: Sequence (1, 2, 3...)
   - due_date: When this installment is due
   - amount_due: Amount for this installment
   - amount_paid: Amount actually paid (can be partial)
   - status: PENDING, PAID, OVERDUE, PARTIAL

4. **Add business logic methods**
   - calculate_next_due_date()
   - get_overdue_installments()
   - calculate_remaining_balance()
   - is_defaulted(): Check if too many missed payments

5. **Add validation**
   - Sum of installment amounts equals total_amount
   - Due dates in chronological order
   - Installment count matches actual installments

### Model Structure

```python
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta, date
from decimal import Decimal
from core.models import BaseModel


class PaymentPlanFrequency(models.TextChoices):
    """Payment plan frequency choices"""
    WEEKLY = 'WEEKLY', 'Weekly'
    BIWEEKLY = 'BIWEEKLY', 'Bi-weekly (Every 2 Weeks)'
    MONTHLY = 'MONTHLY', 'Monthly'
    CUSTOM = 'CUSTOM', 'Custom Schedule'


class PaymentPlanStatus(models.TextChoices):
    """Payment plan status choices"""
    ACTIVE = 'ACTIVE', 'Active'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'
    DEFAULTED = 'DEFAULTED', 'Defaulted'


class InstallmentStatus(models.TextChoices):
    """Installment status choices"""
    PENDING = 'PENDING', 'Pending'
    PAID = 'PAID', 'Paid'
    PARTIAL = 'PARTIAL', 'Partially Paid'
    OVERDUE = 'OVERDUE', 'Overdue'


class PaymentPlan(BaseModel):
    """
    Payment plan model for installment payments
    
    Allows customers to pay invoices over time with scheduled
    installments. Tracks progress and manages reminders.
    """
    # Reference
    plan_number = models.CharField(
        max_length=50,
        unique=True,
        help_text='Unique plan number (e.g., PLAN-2026-00001)'
    )
    plan_name = models.CharField(
        max_length=200,
        help_text='Descriptive name for plan'
    )
    
    # Links
    invoice = models.OneToOneField(
        'invoices.Invoice',
        on_delete=models.PROTECT,
        related_name='payment_plan',
        help_text='Invoice this plan applies to'
    )
    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.PROTECT,
        related_name='payment_plans',
        help_text='Customer on the payment plan'
    )
    
    # Plan Details
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text='Total amount to be paid through plan'
    )
    installment_count = models.IntegerField(
        help_text='Number of installments'
    )
    frequency = models.CharField(
        max_length=20,
        choices=PaymentPlanFrequency.choices,
        default=PaymentPlanFrequency.MONTHLY,
        help_text='Installment frequency'
    )
    start_date = models.DateField(
        help_text='Date of first installment'
    )
    end_date = models.DateField(
        help_text='Date of final installment'
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=PaymentPlanStatus.choices,
        default=PaymentPlanStatus.ACTIVE,
        help_text='Current plan status'
    )
    
    # Tracking
    total_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Total amount paid so far'
    )
    last_payment_date = models.DateField(
        blank=True,
        null=True,
        help_text='Date of most recent payment'
    )
    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When plan was completed'
    )
    
    # Settings
    allow_early_payment = models.BooleanField(
        default=True,
        help_text='Allow paying ahead of schedule'
    )
    late_fee_applicable = models.BooleanField(
        default=True,
        help_text='Apply late fees for missed installments'
    )
    grace_period_days = models.IntegerField(
        default=3,
        help_text='Grace period before marking overdue'
    )
    max_missed_installments = models.IntegerField(
        default=2,
        help_text='Max missed payments before default'
    )
    
    # Metadata
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_payment_plans',
        help_text='User who created this plan'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text='Additional notes about payment plan'
    )
    
    class Meta:
        db_table = 'payment_plans'
        ordering = ['-created_at']
        verbose_name = 'Payment Plan'
        verbose_name_plural = 'Payment Plans'
        indexes = [
            models.Index(fields=['plan_number']),
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['invoice']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f'{self.plan_number} - {self.customer.name} - Rs. {self.total_amount}'
    
    def calculate_remaining_balance(self):
        """
        Calculate remaining balance on payment plan
        
        Returns:
            Decimal: Remaining amount to be paid
        """
        return self.total_amount - self.total_paid
    
    def get_next_due_installment(self):
        """
        Get the next unpaid installment
        
        Returns:
            PaymentPlanInstallment or None
        """
        return self.installments.filter(
            status__in=[InstallmentStatus.PENDING, InstallmentStatus.PARTIAL, InstallmentStatus.OVERDUE]
        ).order_by('due_date').first()
    
    def get_overdue_installments(self):
        """
        Get all overdue installments
        
        Returns:
            QuerySet: Overdue installments
        """
        today = date.today()
        grace_date = today - timedelta(days=self.grace_period_days)
        
        return self.installments.filter(
            due_date__lte=grace_date,
            status__in=[InstallmentStatus.PENDING, InstallmentStatus.PARTIAL, InstallmentStatus.OVERDUE]
        )
    
    def is_defaulted(self):
        """
        Check if plan should be marked as defaulted
        
        Returns:
            bool: True if defaulted
        """
        overdue_count = self.get_overdue_installments().count()
        return overdue_count >= self.max_missed_installments
    
    def get_completion_percentage(self):
        """
        Get completion percentage
        
        Returns:
            float: Percentage of plan completed (0-100)
        """
        if self.total_amount == 0:
            return 0.0
        
        return float((self.total_paid / self.total_amount) * 100)


class PaymentPlanInstallment(BaseModel):
    """
    Individual installment in a payment plan
    
    Tracks due date, amount, and payment status for each
    installment in the plan.
    """
    payment_plan = models.ForeignKey(
        PaymentPlan,
        on_delete=models.CASCADE,
        related_name='installments',
        help_text='Payment plan this installment belongs to'
    )
    installment_number = models.IntegerField(
        help_text='Sequence number (1, 2, 3...)'
    )
    due_date = models.DateField(
        help_text='Date this installment is due'
    )
    amount_due = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text='Amount due for this installment'
    )
    amount_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Amount paid towards this installment'
    )
    status = models.CharField(
        max_length=20,
        choices=InstallmentStatus.choices,
        default=InstallmentStatus.PENDING,
        help_text='Current installment status'
    )
    
    # Payments
    payments = models.ManyToManyField(
        'Payment',
        related_name='installments',
        blank=True,
        help_text='Payments applied to this installment'
    )
    
    # Tracking
    paid_date = models.DateField(
        blank=True,
        null=True,
        help_text='Date installment was fully paid'
    )
    reminder_sent_date = models.DateField(
        blank=True,
        null=True,
        help_text='Date reminder was last sent'
    )
    late_fee_applied = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Late fee amount (if applicable)'
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text='Notes about this installment'
    )
    
    class Meta:
        db_table = 'payment_plan_installments'
        ordering = ['payment_plan', 'installment_number']
        verbose_name = 'Payment Plan Installment'
        verbose_name_plural = 'Payment Plan Installments'
        unique_together = [['payment_plan', 'installment_number']]
        indexes = [
            models.Index(fields=['payment_plan', 'installment_number']),
            models.Index(fields=['due_date', 'status']),
            models.Index(fields=['status', 'due_date']),
        ]
    
    def __str__(self):
        return f'{self.payment_plan.plan_number} - Installment #{self.installment_number} - Rs. {self.amount_due}'
    
    def calculate_outstanding(self):
        """
        Calculate outstanding balance for this installment
        
        Returns:
            Decimal: Amount remaining to be paid
        """
        return self.amount_due - self.amount_paid + self.late_fee_applied
    
    def is_overdue(self):
        """
        Check if installment is overdue
        
        Returns:
            bool: True if overdue
        """
        if self.status == InstallmentStatus.PAID:
            return False
        
        today = date.today()
        grace_date = self.due_date + timedelta(days=self.payment_plan.grace_period_days)
        
        return today > grace_date
    
    def days_overdue(self):
        """
        Calculate number of days overdue
        
        Returns:
            int: Days overdue (0 if not overdue)
        """
        if not self.is_overdue():
            return 0
        
        grace_date = self.due_date + timedelta(days=self.payment_plan.grace_period_days)
        return (date.today() - grace_date).days
```

### Payment Plan Structure Example

```
Payment Plan: PLAN-2026-00001
Customer: ABC Corp
Invoice: INV-2026-00456 (Rs. 90,000)
Frequency: MONTHLY
Installments: 3

├─ Installment #1
│  Due: 2026-02-01
│  Amount: Rs. 30,000
│  Status: PAID
│  Paid: Rs. 30,000
│
├─ Installment #2
│  Due: 2026-03-01
│  Amount: Rs. 30,000
│  Status: PENDING
│  Paid: Rs. 0
│
└─ Installment #3
   Due: 2026-04-01
   Amount: Rs. 30,000
   Status: PENDING
   Paid: Rs. 0

Total Paid: Rs. 30,000 / Rs. 90,000 (33.3%)
Status: ACTIVE
```

### Expected Outcome
- PaymentPlan model for installment tracking
- PaymentPlanInstallment model for individual payments
- Status tracking (ACTIVE/COMPLETED/CANCELLED/DEFAULTED)
- Helper methods for balance and overdue calculation
- Grace period support
- Default threshold configuration

### Verification Checklist
- [ ] payment_plan.py created in models/
- [ ] PaymentPlan model defined
- [ ] PaymentPlanInstallment model defined
- [ ] Status choices (PaymentPlanStatus, InstallmentStatus)
- [ ] Frequency choices (WEEKLY, BIWEEKLY, MONTHLY)
- [ ] plan_number unique field
- [ ] OneToOneField with Invoice
- [ ] calculate_remaining_balance() method
- [ ] get_next_due_installment() method
- [ ] get_overdue_installments() method
- [ ] is_defaulted() method
- [ ] Installment outstanding calculation
- [ ] is_overdue() and days_overdue() methods

---

## Task 46: Implement Payment Plan Creation

### Overview
Implement the service layer method to create payment plans with automatically calculated installment schedules based on frequency and date range.

### Dependencies
- Task 45: PaymentPlan model created
- Invoice model exists

### Instructions

1. **Create create_payment_plan() method in PaymentService**
   - Accept invoice, installment_count, frequency, start_date
   - Calculate installment amounts (equal or weighted)
   - Generate installment due dates
   - Create PaymentPlan and all installments
   - Link to invoice

2. **Implement date calculation logic**
   - WEEKLY: Add 7 days for each installment
   - BIWEEKLY: Add 14 days for each installment
   - MONTHLY: Add 1 month for each installment
   - Handle month-end edge cases (e.g., Jan 31 → Feb 28)

3. **Implement amount distribution**
   - EQUAL: Divide total evenly (handle remainder)
   - WEIGHTED: First installment larger (e.g., 40%, 30%, 30%)
   - CUSTOM: User specifies each amount

4. **Validate plan creation**
   - Invoice not already on payment plan
   - Invoice not fully paid
   - Reasonable installment count (2-24)
   - Start date not in past

5. **Generate plan number**
   - Format: PLAN-{YEAR}-{SEQUENCE}
   - Unique per tenant

### Implementation

```python
@staticmethod
@transaction.atomic
def create_payment_plan(
    tenant,
    invoice,
    installment_count,
    frequency,
    start_date,
    customer=None,
    distribution='EQUAL',
    custom_amounts=None,
    user=None,
    notes=None
):
    """
    Create payment plan for invoice
    
    Args:
        tenant: Tenant instance
        invoice: Invoice to create plan for
        installment_count: Number of installments (2-24)
        frequency: PaymentPlanFrequency choice
        start_date: Date of first installment
        customer: Optional customer (defaults to invoice customer)
        distribution: EQUAL, WEIGHTED, or CUSTOM
        custom_amounts: List of amounts if distribution=CUSTOM
        user: User creating plan
        notes: Optional notes
        
    Returns:
        dict: Response with payment plan
    """
    from django.utils import timezone
    from dateutil.relativedelta import relativedelta
    from decimal import Decimal
    import calendar
    
    try:
        # Validate invoice eligible for payment plan
        if hasattr(invoice, 'payment_plan') and invoice.payment_plan:
            return {
                'success': False,
                'error': f'Invoice {invoice.invoice_number} already has a payment plan',
                'code': 'PLAN_EXISTS'
            }
        
        if invoice.payment_status == 'PAID':
            return {
                'success': False,
                'error': 'Cannot create payment plan for fully paid invoice',
                'code': 'INVOICE_PAID'
            }
        
        # Validate installment count
        if installment_count < 2 or installment_count > 24:
            return {
                'success': False,
                'error': 'Installment count must be between 2 and 24',
                'code': 'INVALID_INSTALLMENT_COUNT'
            }
        
        # Validate start date
        if isinstance(start_date, str):
            from datetime import datetime
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        
        if start_date < date.today():
            return {
                'success': False,
                'error': 'Start date cannot be in the past',
                'code': 'INVALID_START_DATE'
            }
        
        # Determine customer
        customer = customer or invoice.customer
        if not customer:
            return {
                'success': False,
                'error': 'Customer is required for payment plan',
                'code': 'CUSTOMER_REQUIRED'
            }
        
        # Calculate total amount (outstanding balance)
        total_amount = invoice.total_amount - (invoice.paid_amount or Decimal('0.00'))
        
        # Generate plan number
        plan_number = _generate_plan_number(tenant)
        
        # Calculate installment amounts
        if distribution == 'CUSTOM':
            if not custom_amounts or len(custom_amounts) != installment_count:
                return {
                    'success': False,
                    'error': 'Custom amounts must be provided for each installment',
                    'code': 'INVALID_CUSTOM_AMOUNTS'
                }
            
            installment_amounts = [Decimal(str(amt)) for amt in custom_amounts]
            
            if sum(installment_amounts) != total_amount:
                return {
                    'success': False,
                    'error': f'Sum of custom amounts must equal total (Rs. {total_amount})',
                    'code': 'CUSTOM_AMOUNTS_MISMATCH'
                }
        
        elif distribution == 'WEIGHTED':
            # First installment 40%, rest divided equally
            first_amount = (total_amount * Decimal('0.40')).quantize(Decimal('0.01'))
            remaining = total_amount - first_amount
            subsequent_amount = (remaining / (installment_count - 1)).quantize(Decimal('0.01'))
            
            installment_amounts = [first_amount]
            for i in range(installment_count - 2):
                installment_amounts.append(subsequent_amount)
            
            # Last installment gets remainder
            last_amount = total_amount - sum(installment_amounts)
            installment_amounts.append(last_amount)
        
        else:  # EQUAL (default)
            base_amount = (total_amount / installment_count).quantize(Decimal('0.01'))
            installment_amounts = [base_amount] * installment_count
            
            # Adjust last installment for rounding
            total_allocated = sum(installment_amounts)
            if total_allocated != total_amount:
                difference = total_amount - total_allocated
                installment_amounts[-1] += difference
        
        # Calculate installment due dates
        due_dates = []
        current_date = start_date
        
        for i in range(installment_count):
            due_dates.append(current_date)
            
            if frequency == PaymentPlanFrequency.WEEKLY:
                current_date = current_date + timedelta(days=7)
            elif frequency == PaymentPlanFrequency.BIWEEKLY:
                current_date = current_date + timedelta(days=14)
            elif frequency == PaymentPlanFrequency.MONTHLY:
                current_date = current_date + relativedelta(months=1)
                # Handle month-end: if original day > days in new month, use last day
                if start_date.day > calendar.monthrange(current_date.year, current_date.month)[1]:
                    current_date = current_date.replace(
                        day=calendar.monthrange(current_date.year, current_date.month)[1]
                    )
        
        end_date = due_dates[-1]
        
        # Create PaymentPlan
        payment_plan = PaymentPlan.objects.create(
            tenant=tenant,
            plan_number=plan_number,
            plan_name=f'{installment_count}-Installment {frequency} Plan',
            invoice=invoice,
            customer=customer,
            total_amount=total_amount,
            installment_count=installment_count,
            frequency=frequency,
            start_date=start_date,
            end_date=end_date,
            status=PaymentPlanStatus.ACTIVE,
            created_by=user,
            notes=notes
        )
        
        # Create installments
        installments = []
        for i in range(installment_count):
            installment = PaymentPlanInstallment.objects.create(
                tenant=tenant,
                payment_plan=payment_plan,
                installment_number=i + 1,
                due_date=due_dates[i],
                amount_due=installment_amounts[i],
                status=InstallmentStatus.PENDING
            )
            installments.append({
                'number': i + 1,
                'due_date': due_dates[i].isoformat(),
                'amount': float(installment_amounts[i])
            })
        
        logger.info(
            f'Payment plan created: {plan_number}, '
            f'Invoice: {invoice.invoice_number}, '
            f'Total: Rs. {total_amount}, '
            f'Installments: {installment_count}, '
            f'Frequency: {frequency}'
        )
        
        return {
            'success': True,
            'payment_plan': payment_plan,
            'plan_number': plan_number,
            'total_amount': float(total_amount),
            'installment_count': installment_count,
            'frequency': frequency,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'installments': installments,
            'message': f'Payment plan created with {installment_count} installments'
        }
        
    except Exception as e:
        logger.error(f'Payment plan creation failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'PLAN_CREATION_ERROR'
        }


def _generate_plan_number(tenant):
    """Generate unique payment plan number"""
    from django.utils import timezone
    from django.db.models import Max
    
    year = timezone.now().year
    prefix = f'PLAN-{year}-'
    
    last_plan = PaymentPlan.objects.filter(
        tenant=tenant,
        plan_number__startswith=prefix
    ).aggregate(
        max_seq=Max('plan_number')
    )['max_seq']
    
    if last_plan:
        last_seq = int(last_plan.split('-')[-1])
        new_seq = last_seq + 1
    else:
        new_seq = 1
    
    return f'{prefix}{new_seq:05d}'
```

### Payment Plan Creation Examples

**Example 1: Equal Monthly Installments**
```python
# Invoice: Rs. 90,000
# 3 monthly installments

result = PaymentService.create_payment_plan(
    tenant=tenant,
    invoice=invoice,
    installment_count=3,
    frequency=PaymentPlanFrequency.MONTHLY,
    start_date=date(2026, 2, 1),
    distribution='EQUAL'
)

# Result:
Installments:
  #1: 2026-02-01 - Rs. 30,000
  #2: 2026-03-01 - Rs. 30,000
  #3: 2026-04-01 - Rs. 30,000
```

**Example 2: Weighted Installments (40% down)**
```python
# Invoice: Rs. 100,000
# 4 installments (40%, 20%, 20%, 20%)

result = PaymentService.create_payment_plan(
    tenant=tenant,
    invoice=invoice,
    installment_count=4,
    frequency=PaymentPlanFrequency.MONTHLY,
    start_date=date(2026, 2, 15),
    distribution='WEIGHTED'
)

# Result:
Installments:
  #1: 2026-02-15 - Rs. 40,000 (40%)
  #2: 2026-03-15 - Rs. 20,000 (20%)
  #3: 2026-04-15 - Rs. 20,000 (20%)
  #4: 2026-05-15 - Rs. 20,000 (20%)
```

**Example 3: Custom Amounts**
```python
# Invoice: Rs. 75,000
# Custom schedule

result = PaymentService.create_payment_plan(
    tenant=tenant,
    invoice=invoice,
    installment_count=3,
    frequency=PaymentPlanFrequency.MONTHLY,
    start_date=date(2026, 3, 1),
    distribution='CUSTOM',
    custom_amounts=[20000, 30000, 25000]
)

# Result:
Installments:
  #1: 2026-03-01 - Rs. 20,000
  #2: 2026-04-01 - Rs. 30,000
  #3: 2026-05-01 - Rs. 25,000
```

### Expected Outcome
- Payment plan creation service method
- Automatic installment schedule generation
- Date calculation for different frequencies
- Amount distribution strategies (EQUAL, WEIGHTED, CUSTOM)
- Plan number generation
- Validation for plan eligibility

### Verification Checklist
- [ ] create_payment_plan() method implemented
- [ ] Invoice eligibility validation
- [ ] Installment count validation (2-24)
- [ ] Start date validation (not in past)
- [ ] Date calculation for WEEKLY/BIWEEKLY/MONTHLY
- [ ] EQUAL distribution with rounding handling
- [ ] WEIGHTED distribution (40% first)
- [ ] CUSTOM distribution with validation
- [ ] Plan number generation (PLAN-YYYY-NNNNN)
- [ ] PaymentPlan record creation
- [ ] PaymentPlanInstallment records creation
- [ ] Transaction atomic

---

## Task 47: Track Installment Payments

### Overview
Implement functionality to track and apply payments to specific installments, updating installment status and payment plan progress.

### Dependencies
- Task 46: Payment plan creation implemented
- Payment recording methods exist

### Instructions

1. **Create apply_payment_to_installment() method**
   - Accept payment and installment
   - Update installment amount_paid
   - Update installment status
   - Update payment plan total_paid

2. **Support partial installment payments**
   - If payment < installment outstanding: status = PARTIAL
   - If payment >= installment outstanding: status = PAID

3. **Auto-allocate to next due installment**
   - If no installment specified, apply to next due
   - Overflow to subsequent installments

4. **Update payment plan status**
   - If all installments paid: COMPLETED
   - If active: ACTIVE
   - If too many missed: DEFAULTED

5. **Link payments to installments**
   - ManyToMany relationship
   - Track which payments paid which installments

### Implementation

```python
@staticmethod
@transaction.atomic
def apply_payment_to_installment(
    payment,
    installment=None,
    amount=None,
    user=None
):
    """
    Apply payment to installment
    
    Args:
        payment: Payment instance
        installment: Optional specific installment (None = auto-allocate to next due)
        amount: Optional partial amount (None = full payment)
        user: Optional user for history
        
    Returns:
        dict: Result with updated installment
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Determine installment
        if not installment:
            # Auto-allocate to next due installment
            payment_plan = payment.invoice.payment_plan if payment.invoice else None
            if not payment_plan:
                return {
                    'success': False,
                    'error': 'No payment plan found for this payment',
                    'code': 'NO_PLAN'
                }
            
            installment = payment_plan.get_next_due_installment()
            if not installment:
                return {
                    'success': False,
                    'error': 'No pending installments found',
                    'code': 'NO_PENDING_INSTALLMENTS'
                }
        
        payment_plan = installment.payment_plan
        
        # Determine amount to apply
        allocation_amount = amount if amount is not None else payment.amount
        allocation_amount = Decimal(str(allocation_amount))
        
        # Calculate installment outstanding
        outstanding = installment.calculate_outstanding()
        
        # Validate amount
        if allocation_amount > payment.amount:
            return {
                'success': False,
                'error': f'Allocation amount (Rs. {allocation_amount}) exceeds payment amount (Rs. {payment.amount})',
                'code': 'EXCEEDS_PAYMENT'
            }
        
        # Apply payment
        old_paid = installment.amount_paid
        installment.amount_paid += allocation_amount
        new_outstanding = installment.calculate_outstanding()
        
        # Update installment status
        if installment.amount_paid >= installment.amount_due:
            installment.status = InstallmentStatus.PAID
            installment.paid_date = date.today()
        elif installment.amount_paid > 0:
            installment.status = InstallmentStatus.PARTIAL
        
        installment.save(update_fields=['amount_paid', 'status', 'paid_date'])
        
        # Link payment to installment
        installment.payments.add(payment)
        
        # Update payment plan total_paid
        payment_plan.total_paid += allocation_amount
        payment_plan.last_payment_date = date.today()
        
        # Check if plan is completed
        if payment_plan.calculate_remaining_balance() == 0:
            payment_plan.status = PaymentPlanStatus.COMPLETED
            payment_plan.completed_at = timezone.now()
        
        payment_plan.save(update_fields=[
            'total_paid', 'last_payment_date', 'status', 'completed_at'
        ])
        
        logger.info(
            f'Payment {payment.payment_number} applied to '
            f'Installment #{installment.installment_number} of {payment_plan.plan_number}: '
            f'Rs. {allocation_amount}, New status: {installment.status}'
        )
        
        return {
            'success': True,
            'installment_number': installment.installment_number,
            'amount_applied': float(allocation_amount),
            'previous_paid': float(old_paid),
            'new_paid': float(installment.amount_paid),
            'outstanding': float(new_outstanding),
            'installment_status': installment.status,
            'plan_status': payment_plan.status,
            'plan_remaining': float(payment_plan.calculate_remaining_balance()),
            'message': f'Payment applied to installment #{installment.installment_number}'
        }
        
    except Exception as e:
        logger.error(f'Payment application to installment failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'APPLICATION_ERROR'
        }


@staticmethod
@transaction.atomic
def record_installment_payment(
    tenant,
    payment_plan,
    installment_number,
    amount,
    method,
    user,
    method_details=None,
    notes=None
):
    """
    Record payment for specific installment
    
    Combines payment recording with installment application.
    
    Args:
        tenant: Tenant instance
        payment_plan: PaymentPlan instance
        installment_number: Which installment to pay
        amount: Payment amount
        method: PaymentMethod choice
        user: User recording payment
        method_details: Method-specific details
        notes: Optional notes
        
    Returns:
        dict: Response with payment and installment update
    """
    try:
        # Get installment
        try:
            installment = payment_plan.installments.get(
                installment_number=installment_number
            )
        except PaymentPlanInstallment.DoesNotExist:
            return {
                'success': False,
                'error': f'Installment #{installment_number} not found',
                'code': 'INSTALLMENT_NOT_FOUND'
            }
        
        # Create payment
        payment_result = PaymentService.create_payment(
            tenant=tenant,
            amount=amount,
            method=method,
            invoice=payment_plan.invoice,
            customer=payment_plan.customer,
            received_by=user,
            method_details=method_details or {},
            notes=notes or f'Payment for installment #{installment_number} of {payment_plan.plan_number}'
        )
        
        if not payment_result['success']:
            return payment_result
        
        payment = payment_result['payment']
        
        # Apply to installment
        apply_result = PaymentService.apply_payment_to_installment(
            payment=payment,
            installment=installment,
            user=user
        )
        
        if not apply_result['success']:
            # Rollback will happen automatically due to @transaction.atomic
            return apply_result
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'installment_result': apply_result,
            'message': f'Installment #{installment_number} payment recorded'
        }
        
    except Exception as e:
        logger.error(f'Installment payment recording failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'INSTALLMENT_PAYMENT_ERROR'
        }
```

### Installment Payment Flow

```
Payment Plan: PLAN-2026-00001
├─ Installment #1: Rs. 30,000 (PENDING)
├─ Installment #2: Rs. 30,000 (PENDING)
└─ Installment #3: Rs. 30,000 (PENDING)
         │
         ▼
Customer pays Rs. 30,000 for Installment #1
         │
         ▼
apply_payment_to_installment()
├─ Link payment PAY-2026-00123 to Installment #1
├─ Update amount_paid: 0 → 30,000
├─ Update status: PENDING → PAID
├─ Set paid_date: 2026-02-01
├─ Update plan total_paid: 0 → 30,000
└─ Plan status: ACTIVE (remaining balance: 60,000)
         │
         ▼
Installment #1: PAID ✓
Installment #2: PENDING (next due)
Installment #3: PENDING
```

### Expected Outcome
- Payment application to installments
- Automatic next-due allocation
- Partial payment support
- Status updates (installment and plan)
- Payment-installment linkage tracking

### Verification Checklist
- [ ] apply_payment_to_installment() method implemented
- [ ] Auto-allocation to next due installment
- [ ] Partial payment handling (PARTIAL status)
- [ ] Full payment handling (PAID status)
- [ ] Payment plan total_paid update
- [ ] Payment plan status update (COMPLETED when done)
- [ ] Payment-installment ManyToMany link
- [ ] record_installment_payment() convenience method
- [ ] Transaction atomic

---

## Task 48: Handle Missed Installments

### Overview
Implement logic to detect missed installments, apply late fees, mark as overdue, and handle payment plan defaults.

### Dependencies
- Task 47: Installment payment tracking
- PaymentSettings for late fee configuration

### Instructions

1. **Create check_overdue_installments() scheduled task**
   - Run daily to check for overdue installments
   - Apply grace period before marking overdue
   - Update status to OVERDUE

2. **Apply late fees to overdue installments**
   - Get late fee from PaymentSettings
   - Calculate based on amount outstanding
   - Add to installment.late_fee_applied

3. **Detect payment plan default**
   - Count overdue installments
   - If >= max_missed_installments: mark DEFAULTED
   - Notify customer and accounts team

4. **Create mark_installment_overdue() method**
   - Update status to OVERDUE
   - Apply late fee
   - Record in history

5. **Create default_payment_plan() method**
   - Mark plan as DEFAULTED
   - Notify stakeholders
   - Optional: revert invoice to normal billing

### Implementation

```python
@staticmethod
def check_overdue_installments(tenant):
    """
    Check for and mark overdue installments (scheduled task)
    
    Args:
        tenant: Tenant instance or None for all tenants
        
    Returns:
        dict: Summary of overdue checks
    """
    from django.utils import timezone
    
    if tenant:
        plans = PaymentPlan.objects.filter(
            tenant=tenant,
            status=PaymentPlanStatus.ACTIVE
        )
    else:
        plans = PaymentPlan.objects.filter(
            status=PaymentPlanStatus.ACTIVE
        )
    
    total_checked = 0
    newly_overdue = 0
    defaulted_plans = 0
    
    for plan in plans:
        # Check each installment
        for installment in plan.installments.filter(
            status__in=[InstallmentStatus.PENDING, InstallmentStatus.PARTIAL]
        ):
            if installment.is_overdue():
                # Mark as overdue and apply late fee
                result = PaymentService.mark_installment_overdue(installment)
                if result['success'] and result.get('newly_marked'):
                    newly_overdue += 1
            
            total_checked += 1
        
        # Check if plan should be defaulted
        if plan.is_defaulted() and plan.status != PaymentPlanStatus.DEFAULTED:
            PaymentService.default_payment_plan(plan)
            defaulted_plans += 1
    
    logger.info(
        f'Overdue check completed: {total_checked} installments checked, '
        f'{newly_overdue} newly overdue, {defaulted_plans} plans defaulted'
    )
    
    return {
        'total_checked': total_checked,
        'newly_overdue': newly_overdue,
        'defaulted_plans': defaulted_plans
    }


@staticmethod
@transaction.atomic
def mark_installment_overdue(installment):
    """
    Mark installment as overdue and apply late fee
    
    Args:
        installment: PaymentPlanInstallment instance
        
    Returns:
        dict: Result with fee applied
    """
    try:
        # Check if already overdue
        if installment.status == InstallmentStatus.OVERDUE:
            return {
                'success': True,
                'newly_marked': False,
                'message': 'Already marked overdue'
            }
        
        old_status = installment.status
        installment.status = InstallmentStatus.OVERDUE
        
        # Calculate and apply late fee
        payment_plan = installment.payment_plan
        
        if payment_plan.late_fee_applicable:
            # Get late fee from settings
            late_fee_result = FeeCalculatorService.calculate_late_fee(
                tenant=payment_plan.tenant,
                invoice=payment_plan.invoice
            )
            
            if late_fee_result['fee_amount'] > 0:
                installment.late_fee_applied += late_fee_result['fee_amount']
        
        installment.save(update_fields=['status', 'late_fee_applied'])
        
        logger.warning(
            f'Installment #{installment.installment_number} of {payment_plan.plan_number} '
            f'marked OVERDUE. Days overdue: {installment.days_overdue()}, '
            f'Late fee: Rs. {installment.late_fee_applied}'
        )
        
        # TODO: Send overdue notification (Task 49)
        
        return {
            'success': True,
            'newly_marked': True,
            'old_status': old_status,
            'new_status': installment.status,
            'late_fee': float(installment.late_fee_applied),
            'days_overdue': installment.days_overdue(),
            'message': 'Installment marked overdue'
        }
        
    except Exception as e:
        logger.error(f'Failed to mark installment overdue: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e)
        }


@staticmethod
@transaction.atomic
def default_payment_plan(payment_plan, reason=None):
    """
    Mark payment plan as defaulted
    
    Args:
        payment_plan: PaymentPlan instance
        reason: Optional reason for default
        
    Returns:
        dict: Result
    """
    from django.utils import timezone
    
    try:
        if payment_plan.status == PaymentPlanStatus.DEFAULTED:
            return {
                'success': True,
                'message': 'Already defaulted'
            }
        
        old_status = payment_plan.status
        payment_plan.status = PaymentPlanStatus.DEFAULTED
        payment_plan.save(update_fields=['status'])
        
        # Add note about default
        overdue_count = payment_plan.get_overdue_installments().count()
        default_reason = reason or f'{overdue_count} missed installments exceeded threshold'
        
        payment_plan.notes = (payment_plan.notes or '') + (
            f"\n[{timezone.now().strftime('%Y-%m-%d')}] DEFAULTED: {default_reason}"
        )
        payment_plan.save(update_fields=['notes'])
        
        logger.error(
            f'Payment plan {payment_plan.plan_number} DEFAULTED. '
            f'Reason: {default_reason}, '
            f'Overdue installments: {overdue_count}'
        )
        
        # TODO: Send default notification (Task 49)
        # TODO: Optional: revert invoice to normal billing
        
        return {
            'success': True,
            'old_status': old_status,
            'new_status': payment_plan.status,
            'reason': default_reason,
            'overdue_count': overdue_count,
            'message': 'Payment plan defaulted'
        }
        
    except Exception as e:
        logger.error(f'Failed to default payment plan: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e)
        }
```

### Overdue Detection Flow

```
Daily Scheduled Task (e.g., 6:00 AM)
         │
         ▼
check_overdue_installments()
         │
         ▼
For each ACTIVE payment plan:
  ├─ Check each PENDING/PARTIAL installment
  │  ├─ Due date: 2026-02-01
  │  ├─ Grace period: 3 days
  │  ├─ Grace ends: 2026-02-04
  │  └─ Today: 2026-02-05 → OVERDUE
  │
  ├─ mark_installment_overdue()
  │  ├─ Update status: PENDING → OVERDUE
  │  ├─ Apply late fee: Rs. 500 (2%)
  │  └─ Send notification
  │
  └─ Check if plan should default
     ├─ Overdue count: 2
     ├─ Max allowed: 2
     └─ Threshold reached → default_payment_plan()
```

### Expected Outcome
- Automatic overdue detection
- Late fee application
- Payment plan default handling
- Scheduled task for daily checks
- Notifications for overdue and default

### Verification Checklist
- [ ] check_overdue_installments() scheduled task
- [ ] mark_installment_overdue() method
- [ ] Late fee calculation and application
- [ ] default_payment_plan() method
- [ ] Overdue count tracking
- [ ] Default threshold check (max_missed_installments)
- [ ] Logging for overdue and defaults
- [ ] Notification placeholders (Task 49)

---

## Task 49: Add Payment Plan Reminders

### Overview
Implement payment reminder system for upcoming and overdue installments, sending notifications to customers via email and optionally SMS.

### Dependencies
- Task 48: Overdue handling
- Email service configured
- (Optional) SMS service

### Instructions

1. **Create send_installment_reminder() method**
   - Remind customers before due date
   - Send X days before (configurable)
   - Include installment details and payment link

2. **Create check_upcoming_installments() scheduled task**
   - Run daily
   - Find installments due in N days
   - Send reminders if not already sent recently

3. **Create send_overdue_reminder() method**
   - Remind for overdue installments
   - Include late fee information
   - Escalate after multiple reminders

4. **Track reminder history**
   - Update installment.reminder_sent_date
   - Prevent duplicate reminders
   - Log all reminder attempts

5. **Create reminder email templates**
   - Upcoming installment reminder
   - Overdue installment reminder
   - Payment plan completion notification

### Implementation Outline

```python
@staticmethod
def send_installment_reminder(installment, reminder_type='UPCOMING'):
    """
    Send reminder for installment payment
    
    Args:
        installment: PaymentPlanInstallment instance
        reminder_type: UPCOMING or OVERDUE
        
    Returns:
        dict: Result
    """
    try:
        payment_plan = installment.payment_plan
        customer = payment_plan.customer
        
        # Check if reminder already sent recently
        if installment.reminder_sent_date:
            days_since = (date.today() - installment.reminder_sent_date).days
            if days_since < 3:  # Don't send more than once per 3 days
                return {
                    'success': False,
                    'message': 'Reminder sent recently'
                }
        
        # Prepare reminder email context
        context = {
            'customer_name': customer.name,
            'plan_number': payment_plan.plan_number,
            'installment_number': installment.installment_number,
            'installment_count': payment_plan.installment_count,
            'amount_due': installment.amount_due,
            'due_date': installment.due_date,
            'days_until_due': (installment.due_date - date.today()).days,
            'payment_link': _generate_payment_link(installment)
        }
        
        if reminder_type == 'OVERDUE':
            context.update({
                'days_overdue': installment.days_overdue(),
                'late_fee': installment.late_fee_applied,
                'total_due': installment.calculate_outstanding()
            })
        
        # Send email (placeholder - actual implementation in Task Group E)
        # send_email(
        #     to=customer.email,
        #     template=f'installment_{reminder_type.lower()}_reminder',
        #     context=context
        # )
        
        # Update reminder date
        installment.reminder_sent_date = date.today()
        installment.save(update_fields=['reminder_sent_date'])
        
        logger.info(
            f'{reminder_type} reminder sent for Installment #{installment.installment_number} '
            f'of {payment_plan.plan_number} to {customer.email}'
        )
        
        return {
            'success': True,
            'reminder_type': reminder_type,
            'message': f'{reminder_type} reminder sent'
        }
        
    except Exception as e:
        logger.error(f'Failed to send installment reminder: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e)
        }


@staticmethod
def check_upcoming_installments(tenant, days_ahead=7):
    """
    Check for installments due soon and send reminders
    
    Args:
        tenant: Tenant instance or None for all
        days_ahead: Days before due date to send reminder
        
    Returns:
        dict: Summary of reminders sent
    """
    from datetime import timedelta
    
    target_date = date.today() + timedelta(days=days_ahead)
    
    if tenant:
        installments = PaymentPlanInstallment.objects.filter(
            tenant=tenant,
            due_date=target_date,
            status__in=[InstallmentStatus.PENDING, InstallmentStatus.PARTIAL]
        ).select_related('payment_plan', 'payment_plan__customer')
    else:
        installments = PaymentPlanInstallment.objects.filter(
            due_date=target_date,
            status__in=[InstallmentStatus.PENDING, InstallmentStatus.PARTIAL]
        ).select_related('payment_plan', 'payment_plan__customer')
    
    reminders_sent = 0
    
    for installment in installments:
        result = PaymentService.send_installment_reminder(
            installment=installment,
            reminder_type='UPCOMING'
        )
        
        if result['success']:
            reminders_sent += 1
    
    logger.info(
        f'Upcoming installment check: {installments.count()} due in {days_ahead} days, '
        f'{reminders_sent} reminders sent'
    )
    
    return {
        'installments_checked': installments.count(),
        'reminders_sent': reminders_sent,
        'days_ahead': days_ahead
    }


def _generate_payment_link(installment):
    """Generate payment link for installment (placeholder)"""
    # In actual implementation, generate secure link to payment page
    # Example: https://yourdomain.com/payments/installment/{token}
    return f'/payments/installment/{installment.id}'
```

### Expected Outcome
- Reminder system for upcoming installments
- Overdue reminders
- Email notification infrastructure
- Reminder tracking (don't spam)
- Scheduled task for reminders

### Verification Checklist
- [ ] send_installment_reminder() method
- [ ] check_upcoming_installments() scheduled task
- [ ] Reminder type support (UPCOMING, OVERDUE)
- [ ] reminder_sent_date tracking
- [ ] Duplicate reminder prevention
- [ ] Email template placeholders
- [ ] Logging for reminders sent

---

## Task 50: Create Payment Plan Migrations

### Overview
Generate and apply Django migrations for PaymentPlan and PaymentPlanInstallment models.

### Dependencies
- Tasks 45-49: All payment plan models and logic

### Instructions

1. **Generate migrations**
   - Run `python manage.py makemigrations payments`
   - Review generated migration files

2. **Apply migrations**
   - Run `python manage.py migrate payments`
   - Verify tables created

3. **Test rollback**
   - Ensure migration can be reversed if needed

### Migration Commands

```bash
# Generate migrations
python manage.py makemigrations payments

# Expected: 0003_payment_plan.py (or similar number)
# - Create model PaymentPlan
# - Create model PaymentPlanInstallment
# - Add indexes

# Apply migrations
python manage.py migrate payments

# Verify tables
python manage.py dbshell
\dt payment_plan*

# Expected:
# - payment_plans
# - payment_plan_installments
```

### Expected Outcome
- PaymentPlan and PaymentPlanInstallment tables created
- All indexes and constraints applied
- Migration tested

### Verification Checklist
- [ ] makemigrations run successfully
- [ ] Migration file generated
- [ ] migrate applied successfully
- [ ] Tables created in database
- [ ] Indexes exist
- [ ] Rollback tested

---

## Summary

This document completed Group C with payment plans and installment management:

1. ✅ **PaymentPlan Model** (Task 45): Payment plan and installment models with status tracking
2. ✅ **Payment Plan Creation** (Task 46): Service method for creating plans with auto-calculated schedules
3. ✅ **Installment Payment Tracking** (Task 47): Apply payments to installments, update status
4. ✅ **Missed Installments** (Task 48): Overdue detection, late fees, default handling
5. ✅ **Payment Reminders** (Task 49): Reminder system for upcoming and overdue payments
6. ✅ **Migrations** (Task 50): Database schema for payment plans

**Group C (Partial & Split Payments) is now complete!**

**Next Steps:** Proceed to [Group-D_Refunds-Adjustments](../Group-D_Refunds-Adjustments/) to implement refund management, adjustment handling, and store credit functionality.
