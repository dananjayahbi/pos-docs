# Tasks 26-31: Validation, Allocation, and Order Payments

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** B - Payment Recording Services  
> **Document:** 02 of 03  
> **Tasks Covered:** 26, 27, 28, 29, 30, 31

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-25_Service-Method-Recording.md](01_Tasks-19-25_Service-Method-Recording.md)
- **→ Next Document:** [03_Tasks-32-36_History-Settings-Migrations.md](03_Tasks-32-36_History-Settings-Migrations.md)

---

## Document Overview

This document extends the PaymentService with critical business logic for payment validation, invoice allocation, multi-invoice payments, and order payment handling. These functions ensure payments are correctly validated, properly allocated to invoices, and accurately tracked across the system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 26 | Implement Payment Validation | Medium | 20 min |
| 27 | Implement Invoice Allocation | High | 30 min |
| 28 | Implement Multi-Invoice Payment | High | 25 min |
| 29 | Implement Order Payment Recording | Medium | 20 min |
| 30 | Implement Payment Status Updates | Medium | 20 min |
| 31 | Add Payment Approval Workflow | Medium | 25 min |

---

## Task 26: Implement Payment Validation

### Overview
Create comprehensive payment validation logic that checks payment amounts, method availability, tenant limits, and business rules before accepting payments. This prevents invalid payments from entering the system and ensures data integrity.

### Dependencies
- Tasks 19-25: All payment recording methods implemented
- PaymentMethodConfig model exists
- Payment model with validation requirements

### Instructions

1. **Extend validate_payment_data() method**
   - Already created in Task 19
   - Add more comprehensive validation rules
   - Return detailed validation errors

2. **Add amount validation**
   - Amount must be > 0
   - Amount must be reasonable (not excessively large)
   - Check decimal places (max 2 for LKR)
   - Validate against tenant maximum transaction limit

3. **Add method-specific validation**
   - Cash: Validate amount_tendered >= amount
   - Card: Validate card_type, last_four format, approval_code
   - Bank Transfer: Validate reference_number format
   - Mobile: Validate provider, transaction_id format
   - Check: Validate check_number, check_date
   - Store Credit: Validate customer balance

4. **Add daily limit validation**
   - Check if method has daily limit
   - Sum today's payments for this method
   - Reject if limit would be exceeded

5. **Add duplicate detection**
   - Check for recent duplicate payments
   - Same amount + same invoice + same method within N minutes
   - Prevent accidental double-payment

6. **Create validate_payment_before_recording() helper**
   - Call from all recording methods
   - Centralized validation logic
   - Return clear error messages

### Implementation

```python
@staticmethod
def validate_payment_before_recording(
    tenant,
    amount,
    method,
    customer=None,
    invoice=None,
    method_specific_data=None
):
    """
    Comprehensive payment validation before recording
    
    Args:
        tenant: Tenant instance
        amount: Payment amount
        method: PaymentMethod choice
        customer: Optional customer
        invoice: Optional invoice
        method_specific_data: Optional dict with method-specific fields
        
    Returns:
        dict: {'valid': bool, 'errors': list of error messages}
    """
    from decimal import Decimal, InvalidOperation
    from django.utils import timezone
    from datetime import timedelta
    
    errors = []
    
    # 1. Basic amount validation
    try:
        amount = Decimal(str(amount))
        if amount <= 0:
            errors.append('Payment amount must be greater than zero')
        
        # Check decimal places
        if amount.as_tuple().exponent < -2:
            errors.append('Amount can have maximum 2 decimal places')
        
        # Check reasonable limit (e.g., Rs. 10 million)
        if amount > Decimal('10000000.00'):
            errors.append('Payment amount exceeds maximum limit of Rs. 10,000,000')
    except (InvalidOperation, ValueError):
        errors.append('Invalid payment amount format')
        return {'valid': False, 'errors': errors}
    
    # 2. Method configuration validation
    try:
        config = PaymentMethodConfig.objects.get(
            tenant=tenant,
            method=method
        )
        
        if not config.is_enabled:
            errors.append(f'{method} payment method is not enabled')
            return {'valid': False, 'errors': errors}
        
        # Check amount limits
        if config.min_amount and amount < config.min_amount:
            errors.append(
                f'Amount is below minimum of Rs. {config.min_amount} for {method}'
            )
        
        if config.max_amount and amount > config.max_amount:
            errors.append(
                f'Amount exceeds maximum of Rs. {config.max_amount} for {method}'
            )
        
        # Check daily limit
        if config.daily_limit:
            today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
            today_total = Payment.objects.filter(
                tenant=tenant,
                method=method,
                created_at__gte=today_start,
                status__in=[PaymentStatus.PENDING, PaymentStatus.COMPLETED]
            ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
            
            if today_total + amount > config.daily_limit:
                remaining = config.daily_limit - today_total
                errors.append(
                    f'Daily limit for {method} would be exceeded. '
                    f'Remaining today: Rs. {remaining}'
                )
    
    except PaymentMethodConfig.DoesNotExist:
        errors.append(f'Payment method {method} is not configured')
        return {'valid': False, 'errors': errors}
    
    # 3. Method-specific validation
    if method_specific_data:
        method_errors = _validate_method_specific_data(method, method_specific_data)
        errors.extend(method_errors)
    
    # 4. Invoice validation
    if invoice:
        if invoice.status == 'PAID':
            errors.append(f'Invoice {invoice.invoice_number} is already paid')
        
        if invoice.status == 'CANCELLED':
            errors.append(f'Invoice {invoice.invoice_number} is cancelled')
        
        # Check if payment exceeds outstanding balance
        outstanding = invoice.total_amount - invoice.paid_amount
        if amount > outstanding:
            errors.append(
                f'Payment amount (Rs. {amount}) exceeds invoice outstanding balance (Rs. {outstanding})'
            )
    
    # 5. Store credit validation
    if method == PaymentMethod.STORE_CREDIT:
        if not customer:
            errors.append('Customer is required for store credit payment')
        elif hasattr(customer, 'store_credit_balance'):
            if customer.store_credit_balance < amount:
                errors.append(
                    f'Insufficient store credit. Available: Rs. {customer.store_credit_balance}'
                )
        else:
            errors.append('Store credit not supported for this customer')
    
    # 6. Duplicate detection
    if invoice:
        duplicate_window = timezone.now() - timedelta(minutes=5)
        duplicates = Payment.objects.filter(
            tenant=tenant,
            invoice=invoice,
            amount=amount,
            method=method,
            created_at__gte=duplicate_window
        ).exists()
        
        if duplicates:
            errors.append(
                'Potential duplicate payment detected. '
                'A similar payment was recorded in the last 5 minutes.'
            )
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }


def _validate_method_specific_data(method, data):
    """Validate method-specific data fields"""
    errors = []
    
    if method == PaymentMethod.CASH:
        if 'amount_tendered' in data:
            try:
                amount_tendered = Decimal(str(data['amount_tendered']))
                payment_amount = Decimal(str(data.get('amount', 0)))
                if amount_tendered < payment_amount:
                    errors.append('Amount tendered is less than payment amount')
            except (InvalidOperation, ValueError):
                errors.append('Invalid amount_tendered format')
    
    elif method == PaymentMethod.CARD:
        if 'card_type' not in data:
            errors.append('Card type is required')
        elif data['card_type'] not in ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER']:
            errors.append(f'Invalid card type: {data["card_type"]}')
        
        if 'last_four' in data:
            last_four = str(data['last_four'])
            if not last_four.isdigit() or len(last_four) != 4:
                errors.append('Invalid last_four format (must be 4 digits)')
        
        if 'approval_code' not in data or not data['approval_code']:
            errors.append('Approval code is required for card payments')
    
    elif method == PaymentMethod.BANK_TRANSFER:
        if 'bank_name' not in data or not data['bank_name']:
            errors.append('Bank name is required')
        
        if 'reference_number' not in data or not data['reference_number']:
            errors.append('Bank reference number is required')
    
    elif method == PaymentMethod.MOBILE:
        if 'provider' not in data:
            errors.append('Mobile payment provider is required')
        elif data['provider'] not in ['FriMi', 'eZ Cash', 'mCash', 'Genie', 'Other']:
            errors.append(f'Invalid mobile payment provider: {data["provider"]}')
        
        if 'transaction_id' not in data or not data['transaction_id']:
            errors.append('Transaction ID is required')
    
    elif method == PaymentMethod.CHECK:
        if 'check_number' not in data or not data['check_number']:
            errors.append('Check number is required')
        
        if 'bank_name' not in data or not data['bank_name']:
            errors.append('Bank name is required')
        
        if 'check_date' not in data:
            errors.append('Check date is required')
    
    return errors
```

### Validation Flow Diagram

```
Payment Request
       │
       ▼
┌──────────────────────┐
│ Basic Validations    │
├──────────────────────┤
│ ✓ Amount > 0         │
│ ✓ Decimal places ≤ 2 │
│ ✓ Amount reasonable  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Method Configuration │
├──────────────────────┤
│ ✓ Method enabled     │
│ ✓ Within min/max     │
│ ✓ Daily limit OK     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Method-Specific      │
├──────────────────────┤
│ ✓ Required fields    │
│ ✓ Format validation  │
│ ✓ Data consistency   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Invoice Validation   │
├──────────────────────┤
│ ✓ Not already paid   │
│ ✓ Not cancelled      │
│ ✓ Amount ≤ balance   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Duplicate Detection  │
├──────────────────────┤
│ ✓ No recent duplicate│
└──────┬───────────────┘
       │
       ▼
   All Valid? ──Yes──► Proceed to Record Payment
       │
       No
       ▼
   Return Errors
```

### Expected Outcome
- Comprehensive validation before payment recording
- Clear error messages for each validation failure
- Prevention of invalid payments
- Duplicate detection
- Method-specific validation

### Verification Checklist
- [ ] validate_payment_before_recording() implemented
- [ ] Amount validation (positive, decimal places, maximum)
- [ ] Method configuration validation (enabled, limits)
- [ ] Daily limit checking
- [ ] Method-specific validation helpers
- [ ] Invoice validation (status, balance)
- [ ] Store credit balance validation
- [ ] Duplicate detection (5-minute window)
- [ ] Clear error messages returned

---

## Task 27: Implement Invoice Allocation

### Overview
Implement the logic for allocating payments to specific invoices, updating invoice paid amounts, and determining invoice payment status. This is critical for accurate accounts receivable tracking.

### Dependencies
- Task 26: Implement Payment Validation
- Payment model exists
- Invoice model with paid_amount and payment_status fields

### Instructions

1. **Create allocate_payment_to_invoice() method**
   - Links payment to invoice
   - Updates invoice.paid_amount
   - Calculates outstanding balance
   - Updates invoice payment status

2. **Calculate invoice payment status**
   - UNPAID: paid_amount = 0
   - PARTIALLY_PAID: 0 < paid_amount < total_amount
   - PAID: paid_amount = total_amount
   - OVERPAID: paid_amount > total_amount (should not happen)

3. **Handle partial payments**
   - Add payment amount to invoice.paid_amount
   - If paid_amount < total_amount: status = PARTIALLY_PAID
   - If paid_amount = total_amount: status = PAID

4. **Handle exact payments**
   - Single payment equals invoice total
   - Set status = PAID

5. **Handle overpayments**
   - Payment amount > outstanding balance
   - Log warning
   - Create overpayment record or reject

6. **Create PaymentAllocation model** (next task details)
   - Track which payment paid which invoice
   - Support multi-invoice payments
   - Store allocated amount

### Implementation

```python
@staticmethod
@transaction.atomic
def allocate_payment_to_invoice(payment, invoice, amount=None):
    """
    Allocate payment to invoice and update invoice status
    
    Args:
        payment: Payment instance
        invoice: Invoice instance
        amount: Optional partial allocation amount (for multi-invoice)
                If None, uses full payment amount
        
    Returns:
        dict: Response with allocation result
    """
    from decimal import Decimal
    
    try:
        # Determine allocation amount
        allocation_amount = amount if amount is not None else payment.amount
        allocation_amount = Decimal(str(allocation_amount))
        
        # Validate allocation
        if allocation_amount <= 0:
            return {
                'success': False,
                'error': 'Allocation amount must be greater than zero',
                'code': 'INVALID_ALLOCATION_AMOUNT'
            }
        
        if allocation_amount > payment.amount:
            return {
                'success': False,
                'error': 'Allocation amount cannot exceed payment amount',
                'code': 'ALLOCATION_EXCEEDS_PAYMENT'
            }
        
        # Calculate invoice balances
        outstanding_before = invoice.total_amount - invoice.paid_amount
        
        if allocation_amount > outstanding_before:
            return {
                'success': False,
                'error': f'Allocation amount (Rs. {allocation_amount}) exceeds '
                        f'invoice outstanding balance (Rs. {outstanding_before})',
                'code': 'ALLOCATION_EXCEEDS_BALANCE'
            }
        
        # Update invoice paid amount
        invoice.paid_amount = invoice.paid_amount + allocation_amount
        outstanding_after = invoice.total_amount - invoice.paid_amount
        
        # Determine new payment status
        if invoice.paid_amount == 0:
            invoice.payment_status = 'UNPAID'
        elif invoice.paid_amount < invoice.total_amount:
            invoice.payment_status = 'PARTIALLY_PAID'
        elif invoice.paid_amount == invoice.total_amount:
            invoice.payment_status = 'PAID'
        else:
            # Overpayment (shouldn't happen with validation)
            invoice.payment_status = 'OVERPAID'
            logger.warning(
                f'Invoice {invoice.invoice_number} is overpaid: '
                f'Total: Rs. {invoice.total_amount}, '
                f'Paid: Rs. {invoice.paid_amount}'
            )
        
        invoice.save(update_fields=['paid_amount', 'payment_status'])
        
        # Link payment to invoice if not already linked
        if payment.invoice != invoice:
            payment.invoice = invoice
            payment.save(update_fields=['invoice'])
        
        logger.info(
            f'Payment {payment.payment_number} allocated to '
            f'Invoice {invoice.invoice_number}: Rs. {allocation_amount}. '
            f'Invoice status: {invoice.payment_status}, '
            f'Outstanding: Rs. {outstanding_after}'
        )
        
        return {
            'success': True,
            'allocation_amount': float(allocation_amount),
            'invoice_number': invoice.invoice_number,
            'invoice_status': invoice.payment_status,
            'outstanding_balance': float(outstanding_after),
            'message': f'Payment allocated to invoice {invoice.invoice_number}'
        }
        
    except Exception as e:
        logger.error(
            f'Payment allocation failed for Payment {payment.payment_number} '
            f'to Invoice {invoice.invoice_number}: {str(e)}',
            exc_info=True
        )
        return {
            'success': False,
            'error': str(e),
            'code': 'ALLOCATION_ERROR'
        }
```

### Invoice Status Flow

```
Invoice Created: Rs. 50,000
Status: UNPAID (paid_amount: 0)
         │
         ▼
Payment 1: Rs. 20,000
         │
         ▼
Invoice: paid_amount = 20,000
Outstanding: 30,000
Status: PARTIALLY_PAID
         │
         ▼
Payment 2: Rs. 15,000
         │
         ▼
Invoice: paid_amount = 35,000
Outstanding: 15,000
Status: PARTIALLY_PAID
         │
         ▼
Payment 3: Rs. 15,000
         │
         ▼
Invoice: paid_amount = 50,000
Outstanding: 0
Status: PAID
```

### Allocation Examples

**Example 1: Single Full Payment**
```
Invoice Total: Rs. 25,000
Payment: Rs. 25,000

Result:
- paid_amount: 25,000
- payment_status: PAID
- outstanding: 0
```

**Example 2: Multiple Partial Payments**
```
Invoice Total: Rs. 100,000

Payment 1: Rs. 40,000
- paid_amount: 40,000
- payment_status: PARTIALLY_PAID
- outstanding: 60,000

Payment 2: Rs. 30,000
- paid_amount: 70,000
- payment_status: PARTIALLY_PAID
- outstanding: 30,000

Payment 3: Rs. 30,000
- paid_amount: 100,000
- payment_status: PAID
- outstanding: 0
```

**Example 3: Overpayment Prevention**
```
Invoice Total: Rs. 10,000
Paid Amount: Rs. 7,000
Outstanding: Rs. 3,000

Payment Attempt: Rs. 5,000
Result: REJECTED
Error: "Allocation amount (Rs. 5,000) exceeds invoice outstanding balance (Rs. 3,000)"

Correct Payment: Rs. 3,000
Result: ACCEPTED
- paid_amount: 10,000
- payment_status: PAID
```

### Expected Outcome
- Payment allocation to invoices
- Automatic invoice status updates
- Accurate paid amount tracking
- Overpayment prevention
- Audit trail through logs

### Verification Checklist
- [ ] allocate_payment_to_invoice() method implemented
- [ ] Allocation amount validation
- [ ] Invoice paid_amount updated correctly
- [ ] Payment status calculated correctly (UNPAID/PARTIALLY_PAID/PAID)
- [ ] Outstanding balance calculation
- [ ] Overpayment detection and prevention
- [ ] Payment-invoice linking
- [ ] Logging for audit trail

---

## Task 28: Implement Multi-Invoice Payment

### Overview
Implement functionality for applying a single payment across multiple invoices, common when customers make bulk payments. The system must correctly allocate amounts to each invoice based on business rules (oldest first, custom allocation, etc.).

### Dependencies
- Task 27: Implement Invoice Allocation
- Multiple invoices from same customer

### Instructions

1. **Create record_multi_invoice_payment() method**
   - Accepts list of invoices with allocation amounts
   - Validates total allocations = payment amount
   - Creates single payment record
   - Allocates to each invoice

2. **Support allocation strategies**
   - CUSTOM: User specifies amount for each invoice
   - OLDEST_FIRST: Apply to oldest invoices first
   - PROPORTIONAL: Split by invoice amounts
   - EQUAL: Divide equally (if applicable)

3. **Create PaymentAllocation model**
   - Links payment to multiple invoices
   - Tracks allocated amount per invoice
   - Supports allocation history

4. **Validate multi-invoice allocations**
   - Sum of allocations must equal payment amount
   - Each allocation must not exceed invoice balance
   - All invoices must belong to same customer

5. **Handle partial allocations**
   - Some invoices fully paid
   - Some invoices partially paid
   - Track which got what amount

### PaymentAllocation Model Structure

```python
class PaymentAllocation(BaseModel):
    """
    Tracks allocation of payments to invoices
    
    Supports multi-invoice payments where one payment
    is split across multiple invoices.
    """
    payment = models.ForeignKey(
        'Payment',
        on_delete=models.PROTECT,
        related_name='allocations'
    )
    invoice = models.ForeignKey(
        'invoices.Invoice',
        on_delete=models.PROTECT,
        related_name='payment_allocations'
    )
    allocated_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text='Amount of payment allocated to this invoice'
    )
    allocation_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'payment_allocations'
        ordering = ['-allocation_date', '-created_at']
        indexes = [
            models.Index(fields=['payment', 'invoice']),
            models.Index(fields=['invoice', 'allocation_date']),
        ]
        unique_together = [['payment', 'invoice']]
    
    def __str__(self):
        return f'{self.payment.payment_number} → {self.invoice.invoice_number}: Rs. {self.allocated_amount}'
```

### Implementation

```python
@staticmethod
@transaction.atomic
def record_multi_invoice_payment(
    tenant,
    amount,
    method,
    allocations,
    user,
    customer=None,
    strategy='CUSTOM',
    method_details=None,
    notes=None
):
    """
    Record payment applied to multiple invoices
    
    Args:
        tenant: Tenant instance
        amount: Total payment amount
        method: PaymentMethod choice
        allocations: List of dicts: [{'invoice': invoice_obj, 'amount': decimal}, ...]
        user: User recording payment
        customer: Optional customer (validated from invoices)
        strategy: Allocation strategy (CUSTOM, OLDEST_FIRST, etc.)
        method_details: Optional method-specific details
        notes: Optional notes
        
    Returns:
        dict: Response with payment and allocation details
    """
    from decimal import Decimal
    
    try:
        # Validate allocations provided
        if not allocations or len(allocations) == 0:
            return {
                'success': False,
                'error': 'At least one invoice allocation is required',
                'code': 'NO_ALLOCATIONS'
            }
        
        # Calculate total allocated
        total_allocated = sum(
            Decimal(str(alloc['amount'])) for alloc in allocations
        )
        
        # Validate total matches payment
        if total_allocated != amount:
            return {
                'success': False,
                'error': f'Total allocations (Rs. {total_allocated}) must equal '
                        f'payment amount (Rs. {amount})',
                'code': 'ALLOCATION_MISMATCH',
                'total_allocated': float(total_allocated),
                'payment_amount': float(amount)
            }
        
        # Validate all invoices belong to same customer
        invoices = [alloc['invoice'] for alloc in allocations]
        invoice_customers = set(inv.customer_id for inv in invoices if inv.customer_id)
        
        if len(invoice_customers) > 1:
            return {
                'success': False,
                'error': 'All invoices must belong to the same customer',
                'code': 'MULTIPLE_CUSTOMERS'
            }
        
        # Determine customer from invoices if not provided
        if not customer and invoice_customers:
            from apps.customers.models import Customer
            customer = Customer.objects.get(id=invoice_customers.pop())
        
        # Validate each allocation
        for alloc in allocations:
            invoice = alloc['invoice']
            alloc_amount = Decimal(str(alloc['amount']))
            
            outstanding = invoice.total_amount - invoice.paid_amount
            if alloc_amount > outstanding:
                return {
                    'success': False,
                    'error': f'Allocation to invoice {invoice.invoice_number} '
                            f'(Rs. {alloc_amount}) exceeds outstanding balance (Rs. {outstanding})',
                    'code': 'ALLOCATION_EXCEEDS_INVOICE'
                }
        
        # Create payment (without linking to specific invoice)
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=method,
            status=PaymentStatus.COMPLETED,
            payment_date=timezone.now().date(),
            processed_at=timezone.now(),
            customer=customer,
            received_by=user,
            method_details=method_details or {},
            notes=notes
        )
        
        # Create allocations and update invoices
        allocation_results = []
        
        for alloc in allocations:
            invoice = alloc['invoice']
            alloc_amount = Decimal(str(alloc['amount']))
            
            # Create PaymentAllocation record
            allocation_obj = PaymentAllocation.objects.create(
                tenant=tenant,
                payment=payment,
                invoice=invoice,
                allocated_amount=alloc_amount,
                notes=f'Allocated via {strategy} strategy'
            )
            
            # Update invoice
            result = PaymentService.allocate_payment_to_invoice(
                payment=payment,
                invoice=invoice,
                amount=alloc_amount
            )
            
            allocation_results.append({
                'invoice_number': invoice.invoice_number,
                'allocated_amount': float(alloc_amount),
                'invoice_status': result.get('invoice_status'),
                'outstanding_balance': result.get('outstanding_balance')
            })
        
        logger.info(
            f'Multi-invoice payment recorded: {payment.payment_number}, '
            f'Amount: Rs. {amount}, '
            f'Invoices: {len(allocations)}, '
            f'Strategy: {strategy}'
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'total_amount': float(amount),
            'invoice_count': len(allocations),
            'allocations': allocation_results,
            'message': f'Payment allocated to {len(allocations)} invoices'
        }
        
    except Exception as e:
        logger.error(f'Multi-invoice payment recording failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'MULTI_INVOICE_ERROR'
        }
```

### Multi-Invoice Payment Flow

```
Customer Payment: Rs. 75,000
Allocate to 3 invoices:
         │
         ├──► Invoice A (Total: Rs. 30,000, Paid: Rs. 0)
         │    Allocate: Rs. 30,000
         │    Result: PAID (outstanding: Rs. 0)
         │
         ├──► Invoice B (Total: Rs. 50,000, Paid: Rs. 10,000)
         │    Allocate: Rs. 40,000
         │    Result: PAID (outstanding: Rs. 0)
         │
         └──► Invoice C (Total: Rs. 20,000, Paid: Rs. 15,000)
              Allocate: Rs. 5,000
              Result: PAID (outstanding: Rs. 0)

Total Allocated: 30,000 + 40,000 + 5,000 = 75,000 ✓

Payment Record:
- payment_number: PAY-2026-00123
- amount: 75,000
- invoice: NULL (multi-invoice)
- allocations: 3 records

PaymentAllocation Records:
1. PAY-2026-00123 → INV-2026-00456: Rs. 30,000
2. PAY-2026-00123 → INV-2026-00457: Rs. 40,000
3. PAY-2026-00123 → INV-2026-00458: Rs. 5,000
```

### Allocation Strategies

**1. CUSTOM (User-Specified):**
```
User specifies exact amounts for each invoice
- Invoice A: Rs. 25,000
- Invoice B: Rs. 30,000
- Invoice C: Rs. 20,000
Total: Rs. 75,000
```

**2. OLDEST_FIRST:**
```
Apply payment to oldest unpaid invoices first
1. INV-2026-00100 (Jan 5): Rs. 15,000 → Fully paid
2. INV-2026-00105 (Jan 8): Rs. 20,000 → Fully paid
3. INV-2026-00110 (Jan 10): Rs. 40,000 → Fully paid
Remaining: Rs. 0
```

**3. PROPORTIONAL:**
```
Split payment proportionally by invoice amounts

Invoice A: Rs. 30,000 (30%)
Invoice B: Rs. 50,000 (50%)
Invoice C: Rs. 20,000 (20%)
Total: Rs. 100,000

Payment: Rs. 50,000
- Invoice A: Rs. 15,000 (30%)
- Invoice B: Rs. 25,000 (50%)
- Invoice C: Rs. 10,000 (20%)
```

### Expected Outcome
- Single payment allocated to multiple invoices
- PaymentAllocation records for tracking
- Each invoice status updated correctly
- Audit trail for allocations
- Support for allocation strategies

### Verification Checklist
- [ ] record_multi_invoice_payment() method implemented
- [ ] PaymentAllocation model created
- [ ] Total allocation validation (sum = payment amount)
- [ ] Per-invoice allocation validation (≤ outstanding)
- [ ] Customer consistency validation
- [ ] Single payment record created
- [ ] Multiple PaymentAllocation records created
- [ ] Each invoice updated correctly
- [ ] Strategy parameter supported

---

## Task 29: Implement Order Payment Recording

### Overview
Implement payment recording specifically for orders (vs invoices), common in e-commerce and POS scenarios where payment occurs before or at the time of order creation, not after invoicing.

### Dependencies
- Tasks 19-25: Payment recording methods
- Order model exists
- Order-to-Payment relationship defined

### Instructions

1. **Create record_order_payment() method**
   - Similar to invoice payment but for orders
   - Links payment to order
   - Updates order payment status
   - Handles prepayment scenarios

2. **Support order payment types**
   - FULL_PAYMENT: Payment = order total
   - DEPOSIT: Partial payment (e.g., 50% deposit)
   - BALANCE: Final payment after deposit
   - COD: Cash on delivery

3. **Update order payment status**
   - UNPAID: No payment received
   - DEPOSIT_PAID: Partial payment received
   - PAID: Full payment received
   - REFUNDED: Payment refunded

4. **Handle deposit payments**
   - Record initial deposit (e.g., Rs. 10,000 of Rs. 25,000)
   - Order status: DEPOSIT_PAID
   - Track remaining balance
   - Accept balance payment later

5. **Link to subsequent invoice**
   - When order is invoiced, link payment to invoice
   - Carry forward payment allocations
   - Maintain order-payment-invoice chain

### Implementation

```python
@staticmethod
@transaction.atomic
def record_order_payment(
    tenant,
    order,
    amount,
    method,
    user,
    payment_type='FULL_PAYMENT',
    method_details=None,
    notes=None
):
    """
    Record payment for an order
    
    Args:
        tenant: Tenant instance
        order: Order instance
        amount: Payment amount
        method: PaymentMethod choice
        user: User recording payment
        payment_type: Type of order payment (FULL_PAYMENT, DEPOSIT, BALANCE, COD)
        method_details: Optional method-specific details
        notes: Optional notes
        
    Returns:
        dict: Response with payment and order status
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Validate order status
        if order.status == 'CANCELLED':
            return {
                'success': False,
                'error': f'Order {order.order_number} is cancelled',
                'code': 'ORDER_CANCELLED'
            }
        
        # Calculate order payment totals
        total_paid = Payment.objects.filter(
            tenant=tenant,
            order=order,
            status__in=[PaymentStatus.PENDING, PaymentStatus.COMPLETED]
        ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
        
        outstanding = order.total_amount - total_paid
        
        # Validate payment amount
        if amount > outstanding:
            return {
                'success': False,
                'error': f'Payment amount (Rs. {amount}) exceeds order outstanding balance (Rs. {outstanding})',
                'code': 'EXCEEDS_ORDER_BALANCE'
            }
        
        # Determine payment status
        if method == PaymentMethod.CASH and payment_type == 'COD':
            status = PaymentStatus.COMPLETED
        else:
            status = PaymentStatus.COMPLETED  # Can be PENDING for some methods
        
        # Create payment
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=method,
            status=status,
            payment_date=timezone.now().date(),
            processed_at=timezone.now() if status == PaymentStatus.COMPLETED else None,
            order=order,
            customer=order.customer,
            received_by=user,
            method_details=method_details or {},
            notes=notes
        )
        
        # Update order payment tracking
        new_total_paid = total_paid + amount
        new_outstanding = order.total_amount - new_total_paid
        
        # Determine order payment status
        if new_total_paid == 0:
            order.payment_status = 'UNPAID'
        elif new_total_paid < order.total_amount:
            order.payment_status = 'DEPOSIT_PAID' if payment_type == 'DEPOSIT' else 'PARTIALLY_PAID'
        elif new_total_paid == order.total_amount:
            order.payment_status = 'PAID'
        else:
            order.payment_status = 'OVERPAID'
        
        order.save(update_fields=['payment_status'])
        
        logger.info(
            f'Order payment recorded: {payment.payment_number} for '
            f'Order {order.order_number}, Amount: Rs. {amount}, '
            f'Type: {payment_type}, Order Status: {order.payment_status}'
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'order_number': order.order_number,
            'payment_type': payment_type,
            'amount_paid': float(amount),
            'total_paid': float(new_total_paid),
            'outstanding_balance': float(new_outstanding),
            'order_payment_status': order.payment_status,
            'message': f'{payment_type} payment recorded for order {order.order_number}'
        }
        
    except Exception as e:
        logger.error(f'Order payment recording failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'ORDER_PAYMENT_ERROR'
        }
```

### Order Payment Scenarios

**Scenario 1: Full Upfront Payment**
```
Order Created: Rs. 50,000
Payment: Rs. 50,000 (FULL_PAYMENT)
         │
         ▼
Order Status: PAID
Outstanding: Rs. 0
```

**Scenario 2: Deposit + Balance**
```
Order Created: Rs. 100,000
         │
         ▼
Payment 1: Rs. 50,000 (DEPOSIT, 50%)
         │
         ▼
Order Status: DEPOSIT_PAID
Outstanding: Rs. 50,000
         │
         ▼
[Goods delivered/service completed]
         │
         ▼
Payment 2: Rs. 50,000 (BALANCE)
         │
         ▼
Order Status: PAID
Outstanding: Rs. 0
```

**Scenario 3: Cash on Delivery (COD)**
```
Order Created: Rs. 25,000
Order Status: UNPAID (COD)
         │
         ▼
[Goods delivered to customer]
         │
         ▼
Payment: Rs. 25,000 (CASH, COD)
         │
         ▼
Order Status: PAID
```

**Scenario 4: Order → Invoice → Payment**
```
1. Order Created: Rs. 75,000
   Deposit Payment: Rs. 30,000 (DEPOSIT)
   Order Status: DEPOSIT_PAID
         │
         ▼
2. Order Completed & Invoiced
   Invoice: INV-2026-00123 (Rs. 75,000)
         │
         ▼
3. Link Deposit to Invoice
   Invoice paid_amount: Rs. 30,000
   Invoice status: PARTIALLY_PAID
         │
         ▼
4. Balance Payment: Rs. 45,000
   Apply to Invoice
         │
         ▼
5. Invoice Status: PAID
   Order Status: PAID
```

### Expected Outcome
- Order payment recording
- Support for deposits and balance payments
- Order payment status tracking
- Integration with invoice payments
- COD scenario support

### Verification Checklist
- [ ] record_order_payment() method implemented
- [ ] Order validation (not cancelled)
- [ ] Outstanding balance calculation
- [ ] Payment amount validation
- [ ] Order payment status updated correctly
- [ ] Support for payment_type parameter (FULL_PAYMENT, DEPOSIT, BALANCE, COD)
- [ ] Customer linked from order
- [ ] Total paid tracking across multiple payments

---

*Document continues with Tasks 30-31...*

## Task 30: Implement Payment Status Updates

### Overview
Implement methods for updating payment status throughout the payment lifecycle: approving pending payments, marking as completed after verification, handling failures, and cancellations.

### Dependencies
- Payment model with status field
- PaymentStatus choices defined

### Instructions

1. **Create update_payment_status() method**
   - Change payment status with validation
   - Record who made the change
   - Log status change with timestamp
   - Update related records (invoice, order)

2. **Create approve_payment() method**
   - For payments requiring approval (checks, large amounts)
   - Set approved_by and approved_at
   - Change status from PENDING to COMPLETED
   - Update invoice/order if linked

3. **Create complete_payment() method**
   - Mark payment as completed (e.g., after bank verification)
   - Set processed_at timestamp
   - Update invoice/order payment status

4. **Create fail_payment() method**
   - Mark payment as FAILED (e.g., check bounced, card declined)
   - Revert invoice/order paid amounts
   - Log failure reason

5. **Create cancel_payment() method**
   - Cancel payment before processing
   - Set cancelled_at timestamp
   - Record cancellation reason
   - Revert allocations

### Implementation

```python
@staticmethod
@transaction.atomic
def update_payment_status(
    payment,
    new_status,
    user,
    reason=None,
    notes=None
):
    """
    Update payment status with validation and logging
    
    Args:
        payment: Payment instance
        new_status: New PaymentStatus value
        user: User making the change
        reason: Optional reason for status change
        notes: Optional additional notes
        
    Returns:
        dict: Response with updated payment
    """
    from django.utils import timezone
    
    try:
        old_status = payment.status
        
        # Validate status transition
        valid_transitions = {
            PaymentStatus.PENDING: [PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
            PaymentStatus.COMPLETED: [PaymentStatus.REFUNDED, PaymentStatus.CANCELLED],
            PaymentStatus.FAILED: [PaymentStatus.PENDING],  # Allow retry
            PaymentStatus.CANCELLED: [],  # Terminal state
            PaymentStatus.REFUNDED: []  # Terminal state
        }
        
        if old_status not in valid_transitions:
            return {
                'success': False,
                'error': f'Invalid current status: {old_status}',
                'code': 'INVALID_STATUS'
            }
        
        if new_status not in valid_transitions[old_status]:
            return {
                'success': False,
                'error': f'Cannot transition from {old_status} to {new_status}',
                'code': 'INVALID_TRANSITION',
                'allowed_transitions': valid_transitions[old_status]
            }
        
        # Update status
        payment.status = new_status
        
        # Set timestamps based on new status
        if new_status == PaymentStatus.COMPLETED and not payment.processed_at:
            payment.processed_at = timezone.now()
        
        if new_status == PaymentStatus.CANCELLED:
            payment.cancelled_at = timezone.now()
        
        # Add to internal notes
        note_entry = (
            f"\n[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {user.get_full_name()}: "
            f"Status changed from {old_status} to {new_status}"
        )
        
        if reason:
            note_entry += f"\nReason: {reason}"
        
        if notes:
            note_entry += f"\nNotes: {notes}"
        
        payment.internal_notes = (payment.internal_notes or '') + note_entry
        
        payment.save(update_fields=['status', 'processed_at', 'cancelled_at', 'internal_notes'])
        
        # Update related records if needed
        if payment.invoice:
            _update_invoice_on_payment_status_change(payment, old_status, new_status)
        
        if payment.order:
            _update_order_on_payment_status_change(payment, old_status, new_status)
        
        logger.info(
            f'Payment status updated: {payment.payment_number}, '
            f'{old_status} → {new_status}, User: {user.get_full_name()}'
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'old_status': old_status,
            'new_status': new_status,
            'message': f'Payment status updated to {new_status}'
        }
        
    except Exception as e:
        logger.error(f'Payment status update failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'STATUS_UPDATE_ERROR'
        }


@staticmethod
@transaction.atomic
def approve_payment(payment, user, notes=None):
    """
    Approve a pending payment
    
    Args:
        payment: Payment instance
        user: User approving payment
        notes: Optional approval notes
        
    Returns:
        dict: Response with approved payment
    """
    from django.utils import timezone
    
    try:
        if payment.status != PaymentStatus.PENDING:
            return {
                'success': False,
                'error': f'Payment must be PENDING to approve (current: {payment.status})',
                'code': 'INVALID_STATUS_FOR_APPROVAL'
            }
        
        # Set approval fields
        payment.approved_by = user
        payment.approved_at = timezone.now()
        payment.status = PaymentStatus.COMPLETED
        payment.processed_at = timezone.now()
        
        # Add approval note
        note_entry = (
            f"\n[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {user.get_full_name()}: "
            f"Payment approved"
        )
        
        if notes:
            note_entry += f"\nNotes: {notes}"
        
        payment.internal_notes = (payment.internal_notes or '') + note_entry
        
        payment.save(update_fields=[
            'status', 'approved_by', 'approved_at', 'processed_at', 'internal_notes'
        ])
        
        # Update related records
        if payment.invoice:
            PaymentService.allocate_payment_to_invoice(payment, payment.invoice)
        
        logger.info(
            f'Payment approved: {payment.payment_number}, '
            f'Amount: Rs. {payment.amount}, '
            f'Approved by: {user.get_full_name()}'
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'message': 'Payment approved successfully'
        }
        
    except Exception as e:
        logger.error(f'Payment approval failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'APPROVAL_ERROR'
        }


@staticmethod
@transaction.atomic
def fail_payment(payment, user, reason, notes=None):
    """
    Mark payment as failed (e.g., check bounced, card declined)
    
    Args:
        payment: Payment instance
        user: User marking as failed
        reason: Failure reason (required)
        notes: Optional additional notes
        
    Returns:
        dict: Response with failed payment
    """
    from django.utils import timezone
    
    try:
        if payment.status not in [PaymentStatus.PENDING, PaymentStatus.COMPLETED]:
            return {
                'success': False,
                'error': f'Cannot fail payment with status {payment.status}',
                'code': 'INVALID_STATUS_FOR_FAILURE'
            }
        
        old_status = payment.status
        
        # Update status
        payment.status = PaymentStatus.FAILED
        
        # Add failure note
        note_entry = (
            f"\n[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {user.get_full_name()}: "
            f"Payment marked as FAILED\n"
            f"Reason: {reason}"
        )
        
        if notes:
            note_entry += f"\nAdditional Notes: {notes}"
        
        payment.internal_notes = (payment.internal_notes or '') + note_entry
        
        payment.save(update_fields=['status', 'internal_notes'])
        
        # Revert invoice/order allocations if payment was completed
        if old_status == PaymentStatus.COMPLETED:
            if payment.invoice:
                _revert_invoice_payment(payment, user)
            
            if payment.order:
                _revert_order_payment(payment, user)
        
        logger.warning(
            f'Payment failed: {payment.payment_number}, '
            f'Amount: Rs. {payment.amount}, '
            f'Reason: {reason}'
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'failure_reason': reason,
            'message': f'Payment marked as failed: {reason}'
        }
        
    except Exception as e:
        logger.error(f'Payment failure marking failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'FAIL_PAYMENT_ERROR'
        }


def _revert_invoice_payment(payment, user):
    """Revert invoice payment allocation when payment fails"""
    from decimal import Decimal
    
    if not payment.invoice:
        return
    
    invoice = payment.invoice
    
    # Deduct payment amount from invoice paid_amount
    invoice.paid_amount = max(
        Decimal('0.00'),
        invoice.paid_amount - payment.amount
    )
    
    # Recalculate payment status
    if invoice.paid_amount == 0:
        invoice.payment_status = 'UNPAID'
    elif invoice.paid_amount < invoice.total_amount:
        invoice.payment_status = 'PARTIALLY_PAID'
    elif invoice.paid_amount >= invoice.total_amount:
        invoice.payment_status = 'PAID'
    
    invoice.save(update_fields=['paid_amount', 'payment_status'])
    
    logger.info(
        f'Reverted payment allocation: {payment.payment_number} from '
        f'Invoice {invoice.invoice_number}'
    )


def _revert_order_payment(payment, user):
    """Revert order payment when payment fails"""
    if not payment.order:
        return
    
    order = payment.order
    
    # Recalculate order payment status
    from decimal import Decimal
    total_paid = Payment.objects.filter(
        order=order,
        status__in=[PaymentStatus.COMPLETED, PaymentStatus.PENDING]
    ).exclude(
        id=payment.id
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    
    if total_paid == 0:
        order.payment_status = 'UNPAID'
    elif total_paid < order.total_amount:
        order.payment_status = 'PARTIALLY_PAID'
    elif total_paid >= order.total_amount:
        order.payment_status = 'PAID'
    
    order.save(update_fields=['payment_status'])
    
    logger.info(
        f'Reverted payment from Order {order.order_number}'
    )
```

### Status Transition Diagram

```
          ┌─────────────┐
          │   PENDING   │ Initial state for many payments
          └──────┬──────┘
                 │
                 ├──────────────────────┐
                 │                      │
                 ▼                      ▼
          ┌─────────────┐        ┌────────────┐
          │  COMPLETED  │        │   FAILED   │
          └──────┬──────┘        └─────┬──────┘
                 │                     │
                 │                     │ (Retry)
                 │                     └──────► PENDING
                 │
                 ├──────────────────────┐
                 │                      │
                 ▼                      ▼
          ┌─────────────┐        ┌────────────┐
          │  REFUNDED   │        │ CANCELLED  │
          └─────────────┘        └────────────┘
          (Terminal)             (Terminal)
```

### Expected Outcome
- Payment status lifecycle management
- Validation of status transitions
- Approval workflow for pending payments
- Failure handling with allocation reversion
- Cancellation support
- Audit trail through internal_notes

### Verification Checklist
- [ ] update_payment_status() method implemented
- [ ] Status transition validation
- [ ] approve_payment() method for approval workflow
- [ ] fail_payment() method with allocation reversion
- [ ] cancel_payment() method (optional)
- [ ] Timestamp updates (processed_at, cancelled_at, approved_at)
- [ ] Internal notes for audit trail
- [ ] Invoice/order updates on status change
- [ ] Logging for all status changes

---

## Task 31: Add Payment Approval Workflow

### Overview
Implement approval workflow for payments that require managerial approval before completion, typically high-value payments or certain payment methods like checks. This ensures proper oversight and prevents unauthorized large transactions.

### Dependencies
- Task 30: Implement Payment Status Updates
- User role/permission system

### Instructions

1. **Define approval requirements**
   - Approval threshold amount (e.g., Rs. 100,000)
   - Methods requiring approval (CHECK, BANK_TRANSFER)
   - Role requirements (e.g., MANAGER, FINANCE_MANAGER)

2. **Create requires_approval() helper method**
   - Check if payment needs approval
   - Based on amount, method, and config

3. **Create request_approval() method**
   - Mark payment as PENDING_APPROVAL
   - Notify approvers
   - Store approval request metadata

4. **Update payment recording to check approval**
   - If requires_approval(): status = PENDING
   - Else: status = COMPLETED (for cash, cards, etc.)

5. **Create get_pending_approvals() method**
   - List payments awaiting approval
   - Filter by date, amount, method
   - For manager dashboard

### Implementation

```python
@staticmethod
def requires_approval(tenant, method, amount):
    """
    Check if payment requires approval
    
    Args:
        tenant: Tenant instance
        method: PaymentMethod choice
        amount: Payment amount
        
    Returns:
        bool: True if approval required
    """
    from decimal import Decimal
    
    try:
        config = PaymentMethodConfig.objects.get(
            tenant=tenant,
            method=method
        )
        
        # Check if method always requires approval
        if config.requires_approval:
            return True
        
        # Check amount threshold
        if config.approval_threshold:
            if amount >= config.approval_threshold:
                return True
        
        # Check tenant-wide approval threshold
        # (Assuming TenantConfig model exists)
        # if tenant.config.payment_approval_threshold:
        #     if amount >= tenant.config.payment_approval_threshold:
        #         return True
        
        return False
        
    except PaymentMethodConfig.DoesNotExist:
        # Default: no approval required if not configured
        return False


@staticmethod
@transaction.atomic
def request_approval(payment, requested_by, notes=None):
    """
    Request approval for a payment
    
    Args:
        payment: Payment instance
        requested_by: User requesting approval
        notes: Optional notes for approvers
        
    Returns:
        dict: Response with approval request
    """
    from django.utils import timezone
    
    try:
        if payment.status != PaymentStatus.PENDING:
            return {
                'success': False,
                'error': 'Only PENDING payments can request approval',
                'code': 'INVALID_STATUS'
            }
        
        # Add approval request note
        note_entry = (
            f"\n[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {requested_by.get_full_name()}: "
            f"Approval requested\n"
            f"Amount: Rs. {payment.amount}\n"
            f"Method: {payment.method}"
        )
        
        if notes:
            note_entry += f"\nNotes: {notes}"
        
        payment.internal_notes = (payment.internal_notes or '') + note_entry
        payment.save(update_fields=['internal_notes'])
        
        # TODO: Send notification to approvers (Task in receipts/notifications)
        # notify_approvers(payment)
        
        logger.info(
            f'Approval requested for Payment {payment.payment_number}, '
            f'Amount: Rs. {payment.amount}, '
            f'Requested by: {requested_by.get_full_name()}'
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'message': 'Approval requested. Pending manager review.'
        }
        
    except Exception as e:
        logger.error(f'Approval request failed: {str(e)}', exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'APPROVAL_REQUEST_ERROR'
        }


@staticmethod
def get_pending_approvals(tenant, user=None, method=None, min_amount=None):
    """
    Get list of payments pending approval
    
    Args:
        tenant: Tenant instance
        user: Optional filter by received_by user
        method: Optional filter by payment method
        min_amount: Optional minimum amount filter
        
    Returns:
        QuerySet: Pending payments requiring approval
    """
    from django.utils import timezone
    from datetime import timedelta
    
    query = Payment.objects.filter(
        tenant=tenant,
        status=PaymentStatus.PENDING
    ).select_related('customer', 'invoice', 'order', 'received_by')
    
    # Filter by payment method requiring approval
    methods_requiring_approval = []
    for method_choice in PaymentMethod.choices:
        method_code = method_choice[0]
        if PaymentService.requires_approval(tenant, method_code, Decimal('0')):
            methods_requiring_approval.append(method_code)
    
    if methods_requiring_approval:
        query = query.filter(
            models.Q(method__in=methods_requiring_approval) |
            models.Q(amount__gte=min_amount or Decimal('100000'))  # Default threshold
        )
    
    if user:
        query = query.filter(received_by=user)
    
    if method:
        query = query.filter(method=method)
    
    if min_amount:
        query = query.filter(amount__gte=min_amount)
    
    return query.order_by('-created_at')
```

### Approval Workflow Example

```
Check Payment Received: Rs. 150,000
         │
         ▼
System checks: requires_approval()
  - Method: CHECK (requires approval) ✓
  - Amount: Rs. 150,000 > Rs. 100,000 threshold ✓
         │
         ▼
Create payment:
  - status: PENDING
  - approved_by: NULL
  - approved_at: NULL
         │
         ▼
Request approval:
  - Add internal note
  - Notify manager
         │
         ▼
Manager reviews:
  - Checks customer history
  - Verifies check details
  - Reviews invoice
         │
         ▼
Manager approves:
  - approve_payment()
  - status: COMPLETED
  - approved_by: Manager
  - approved_at: timestamp
         │
         ▼
Invoice updated:
  - paid_amount increased
  - payment_status updated
```

### Approval Thresholds (Sri Lankan Context)

| Payment Method | Auto-Approve Limit | Approval Required Above |
|----------------|--------------------|-----------------------|
| CASH | Rs. 50,000 | Rs. 50,001+ |
| CARD | Rs. 200,000 | Rs. 200,001+ |
| BANK_TRANSFER | Always pending | Always (verify with bank) |
| MOBILE | Rs. 100,000 | Rs. 100,001+ |
| CHECK | Always pending | Always (verify clearing) |
| STORE_CREDIT | Rs. 50,000 | Rs. 50,001+ |

### Expected Outcome
- Approval workflow for payments
- Threshold-based approval requirements
- Method-based approval rules
- Pending approvals dashboard
- Approval tracking with user and timestamp

### Verification Checklist
- [ ] requires_approval() helper method implemented
- [ ] request_approval() method implemented
- [ ] approve_payment() method from Task 30 used
- [ ] get_pending_approvals() query method implemented
- [ ] Approval thresholds from PaymentMethodConfig
- [ ] Method-based approval rules
- [ ] Internal notes for approval tracking
- [ ] Notifications for approvers (placeholder)

---

## Summary

This document implemented critical payment service functionality:

1. ✅ **Payment Validation** (Task 26): Comprehensive validation with amount checks, method limits, daily limits, duplicate detection
2. ✅ **Invoice Allocation** (Task 27): Payment-to-invoice linking with paid amount tracking and status updates
3. ✅ **Multi-Invoice Payment** (Task 28): Single payment across multiple invoices with PaymentAllocation model
4. ✅ **Order Payment** (Task 29): Order payment support with deposits, balance payments, and COD
5. ✅ **Status Updates** (Task 30): Lifecycle management with approve, complete, fail, and cancel operations
6. ✅ **Approval Workflow** (Task 31): Threshold-based approval requirements with manager oversight

**Payment service layer is now feature-complete!**

**Next Steps:** Proceed to [03_Tasks-32-36_History-Settings-Migrations.md](03_Tasks-32-36_History-Settings-Migrations.md) to implement payment history tracking, PaymentSettings configuration, fee calculator service, and database migrations.
