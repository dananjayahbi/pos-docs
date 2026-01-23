# Tasks 19-25: Service Class and Method-Specific Recording

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** B - Payment Recording Services  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-26-31_Validation-Allocation-Order.md](02_Tasks-26-31_Validation-Allocation-Order.md)
- **← Previous Group:** [Group-A_Payment-Model-Methods](../Group-A_Payment-Model-Methods/)

---

## Document Overview

This document implements the core payment recording service layer, creating a centralized PaymentService class and method-specific recording functions for all six payment methods supported in Sri Lankan commerce: cash, card, bank transfer, mobile payment, check, and store credit. Each method has unique validation and data handling requirements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create PaymentService Class | High | 30 min |
| 20 | Implement Cash Payment Recording | Medium | 20 min |
| 21 | Implement Card Payment Recording | Medium | 20 min |
| 22 | Implement Bank Transfer Recording | Medium | 20 min |
| 23 | Implement Mobile Payment Recording | Medium | 20 min |
| 24 | Implement Check Payment Recording | Medium | 20 min |
| 25 | Implement Store Credit Payment | Medium | 25 min |

---

## Task 19: Create PaymentService Class

### Overview
Create the PaymentService class as the central business logic layer for all payment operations. This service encapsulates payment recording, validation, status management, and integration with invoices and customer accounts. Following service-oriented architecture principles ensures clean separation between controllers and models.

### Dependencies
- Group A tasks complete (Payment model, PaymentMethod/Status choices)
- Payment model with all fields exists
- Invoice and Customer models exist

### Instructions

1. **Create payment_service.py file**
   - Create file at `apps/payments/services/payment_service.py`
   - Import necessary models (Payment, Invoice, Customer)
   - Import Django transaction support
   - Import PaymentMethod and PaymentStatus choices

2. **Define PaymentService class**
   - Class-based service pattern
   - All methods should be static or class methods
   - Handle transactions internally
   - Return consistent response structure

3. **Define standard response structure**
   - Success: `{'success': True, 'payment': payment_obj, 'message': str}`
   - Error: `{'success': False, 'error': str, 'code': error_code}`

4. **Implement base create_payment() method**
   - Accept common parameters: tenant, amount, method, etc.
   - Validate parameters
   - Create Payment record
   - Return payment object

5. **Implement get_payment() method**
   - Retrieve payment by ID
   - Include related data (invoice, customer)
   - Handle not found errors

6. **Implement validate_payment_data() method**
   - Check required fields present
   - Validate amount > 0
   - Verify payment method enabled for tenant
   - Check amount limits

7. **Implement calculate_processing_fee() method**
   - Get PaymentMethodConfig for tenant
   - Calculate fee based on type (PERCENTAGE or FIXED)
   - Return fee amount

8. **Add logging support**
   - Log payment creation
   - Log status changes
   - Log errors and validations

9. **Add exception handling**
   - Catch and wrap exceptions
   - Provide user-friendly error messages
   - Maintain stack traces for debugging

### Service Class Structure

```
PaymentService Class
├── create_payment()              # Base payment creation
├── get_payment()                 # Retrieve payment
├── validate_payment_data()       # Validate parameters
├── calculate_processing_fee()    # Calculate fees
│
├── record_cash_payment()         # Task 20
├── record_card_payment()         # Task 21
├── record_bank_transfer()        # Task 22
├── record_mobile_payment()       # Task 23
├── record_check_payment()        # Task 24
├── record_store_credit()         # Task 25
│
└── Internal helpers:
    ├── _validate_amount()
    ├── _check_method_enabled()
    ├── _create_payment_record()
    └── _log_payment_event()
```

### Response Structure Pattern

```python
# Success Response
{
    'success': True,
    'payment': <Payment object>,
    'payment_number': 'PAY-2026-00001',
    'message': 'Payment recorded successfully'
}

# Error Response
{
    'success': False,
    'error': 'Invalid payment amount',
    'code': 'INVALID_AMOUNT',
    'details': {
        'amount': -100,
        'reason': 'Amount must be positive'
    }
}
```

### Service Implementation Pattern

```python
import logging
from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError

from apps.payments.models import Payment, PaymentMethodConfig
from apps.payments.constants import PaymentMethod, PaymentStatus
from apps.invoices.models import Invoice
from apps.customers.models import Customer

logger = logging.getLogger(__name__)

class PaymentService:
    """
    Service layer for payment recording and management
    
    Handles all payment operations with proper transaction management,
    validation, and audit logging.
    """
    
    @staticmethod
    @transaction.atomic
    def create_payment(tenant, amount, method, **kwargs):
        """
        Create a payment record
        
        Args:
            tenant: Tenant instance
            amount: Decimal payment amount
            method: PaymentMethod choice
            **kwargs: Additional payment fields
            
        Returns:
            dict: Response with payment object or error
        """
        try:
            # Validate data
            validation_result = PaymentService.validate_payment_data(
                tenant=tenant,
                amount=amount,
                method=method
            )
            
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': validation_result['error'],
                    'code': 'VALIDATION_ERROR'
                }
            
            # Calculate processing fee
            fee = PaymentService.calculate_processing_fee(
                tenant=tenant,
                method=method,
                amount=amount
            )
            
            # Create payment
            payment = Payment.objects.create(
                tenant=tenant,
                amount=amount,
                method=method,
                status=PaymentStatus.PENDING,
                processing_fee=fee,
                **kwargs
            )
            
            logger.info(
                f"Payment created: {payment.payment_number} "
                f"for amount {amount} via {method}"
            )
            
            return {
                'success': True,
                'payment': payment,
                'payment_number': payment.payment_number,
                'message': 'Payment created successfully'
            }
            
        except Exception as e:
            logger.error(f"Payment creation failed: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'code': 'PAYMENT_CREATION_ERROR'
            }
    
    @staticmethod
    def get_payment(payment_id, tenant=None):
        """
        Retrieve payment by ID
        
        Args:
            payment_id: UUID of payment
            tenant: Optional tenant for filtering
            
        Returns:
            Payment object or None
        """
        try:
            query = Payment.objects.select_related(
                'customer', 'invoice', 'order', 'received_by', 'approved_by'
            )
            
            if tenant:
                query = query.filter(tenant=tenant)
            
            return query.get(id=payment_id)
            
        except Payment.DoesNotExist:
            return None
    
    @staticmethod
    def validate_payment_data(tenant, amount, method):
        """
        Validate payment parameters
        
        Returns:
            dict: {'valid': bool, 'error': str or None}
        """
        # Validate amount
        if amount <= 0:
            return {
                'valid': False,
                'error': 'Payment amount must be greater than zero'
            }
        
        # Check if method enabled for tenant
        try:
            config = PaymentMethodConfig.objects.get(
                tenant=tenant,
                method=method
            )
            
            if not config.is_enabled:
                return {
                    'valid': False,
                    'error': f'{method} payment method is not enabled'
                }
            
            # Check amount limits
            if config.min_amount and amount < config.min_amount:
                return {
                    'valid': False,
                    'error': f'Minimum amount is Rs. {config.min_amount}'
                }
            
            if config.max_amount and amount > config.max_amount:
                return {
                    'valid': False,
                    'error': f'Maximum amount is Rs. {config.max_amount}'
                }
            
        except PaymentMethodConfig.DoesNotExist:
            return {
                'valid': False,
                'error': f'Payment method {method} not configured'
            }
        
        return {'valid': True, 'error': None}
    
    @staticmethod
    def calculate_processing_fee(tenant, method, amount):
        """
        Calculate processing fee for payment method
        
        Returns:
            Decimal: Fee amount
        """
        try:
            config = PaymentMethodConfig.objects.get(
                tenant=tenant,
                method=method
            )
            
            if config.processing_fee_type == 'PERCENTAGE':
                fee = amount * (config.processing_fee_value / 100)
            elif config.processing_fee_type == 'FIXED':
                fee = config.processing_fee_value
            else:
                fee = Decimal('0.00')
            
            return fee.quantize(Decimal('0.01'))
            
        except PaymentMethodConfig.DoesNotExist:
            return Decimal('0.00')
```

### Transaction Management

```python
@transaction.atomic
def record_payment_with_allocation(invoice_id, amount, method, user):
    """
    Example of transaction management
    
    All database operations within this function are atomic:
    - If any operation fails, entire transaction rolls back
    - Ensures data consistency
    """
    # Create payment
    payment = PaymentService.create_payment(...)
    
    # Allocate to invoice
    AllocationService.allocate_to_invoice(payment, invoice)
    
    # Update invoice status
    invoice.update_payment_status()
    
    # All succeed or all fail together
    return payment
```

### Error Code Reference

| Code | Description | User Action |
|------|-------------|-------------|
| VALIDATION_ERROR | Input validation failed | Check and correct input |
| PAYMENT_CREATION_ERROR | Failed to create payment | Retry or contact support |
| METHOD_NOT_ENABLED | Payment method disabled | Choose different method |
| AMOUNT_BELOW_MINIMUM | Amount too small | Increase payment amount |
| AMOUNT_ABOVE_MAXIMUM | Amount too large | Reduce or split payment |
| DAILY_LIMIT_EXCEEDED | Daily limit reached | Try tomorrow or different method |

### Expected Outcome
- Centralized payment service class
- Consistent response structure
- Transaction management
- Comprehensive validation
- Error handling and logging

### Verification Checklist
- [ ] `payment_service.py` created in services/
- [ ] PaymentService class defined
- [ ] create_payment() base method implemented
- [ ] get_payment() retrieval method implemented
- [ ] validate_payment_data() implemented
- [ ] calculate_processing_fee() implemented
- [ ] Response structure standardized
- [ ] Transaction management in place
- [ ] Logging configured
- [ ] Error handling implemented

---

## Task 20: Implement Cash Payment Recording

### Overview
Implement the method for recording cash payments, the most common payment method in Sri Lankan retail. Cash payments require tracking the amount tendered by the customer and calculating change. This method handles immediate payment completion with no processing delay.

### Dependencies
- Task 19: Create PaymentService Class
- Payment model exists
- PaymentMethod.CASH defined

### Instructions

1. **Add record_cash_payment() method to PaymentService**
   - Accepts: tenant, amount, invoice (optional), customer (optional)
   - Accepts: amount_tendered, user
   - Calculates: change_given
   - Creates Payment with CASH method

2. **Validate amount_tendered**
   - Must be >= payment amount
   - Calculate change: amount_tendered - amount
   - Store in method_details JSONField

3. **Store cash-specific details**
   - method_details: {amount_tendered, change_given, register_id, cashier_name}
   - Optional: register_id (POS terminal)
   - Optional: cashier_name (from user)

4. **Set immediate completion**
   - Status: COMPLETED (cash is immediate)
   - processed_at: Current timestamp
   - payment_date: Current date

5. **Link to cashier**
   - received_by: User who recorded payment
   - approved_by: NULL (cash under threshold doesn't need approval)
   - Unless amount exceeds threshold, then require approval

6. **Return formatted response**
   - Include change_given in response
   - For POS display or receipt printing

### Implementation

```python
@staticmethod
@transaction.atomic
def record_cash_payment(
    tenant,
    amount,
    amount_tendered,
    user,
    invoice=None,
    customer=None,
    register_id=None,
    notes=None
):
    """
    Record cash payment
    
    Args:
        tenant: Tenant instance
        amount: Payment amount (Decimal)
        amount_tendered: Amount given by customer (Decimal)
        user: User recording payment
        invoice: Optional invoice to apply payment
        customer: Optional customer
        register_id: Optional POS register ID
        notes: Optional payment notes
        
    Returns:
        dict: Response with payment and change_given
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Validate amount tendered
        if amount_tendered < amount:
            return {
                'success': False,
                'error': f'Amount tendered (Rs. {amount_tendered}) is less than '
                        f'payment amount (Rs. {amount})',
                'code': 'INSUFFICIENT_TENDERED'
            }
        
        # Calculate change
        change_given = amount_tendered - amount
        
        # Prepare method details
        method_details = {
            'amount_tendered': str(amount_tendered),
            'change_given': str(change_given),
        }
        
        if register_id:
            method_details['register_id'] = register_id
        
        if user:
            method_details['cashier_name'] = user.get_full_name()
        
        # Create payment
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=PaymentMethod.CASH,
            status=PaymentStatus.COMPLETED,  # Immediate completion
            payment_date=timezone.now().date(),
            processed_at=timezone.now(),
            invoice=invoice,
            customer=customer,
            received_by=user,
            method_details=method_details,
            notes=notes,
            processing_fee=Decimal('0.00')  # No fee for cash
        )
        
        logger.info(
            f"Cash payment recorded: {payment.payment_number}, "
            f"Amount: Rs. {amount}, Tendered: Rs. {amount_tendered}, "
            f"Change: Rs. {change_given}"
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'amount': amount,
            'change_given': change_given,
            'message': 'Cash payment recorded successfully'
        }
        
    except Exception as e:
        logger.error(f"Cash payment recording failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'CASH_PAYMENT_ERROR'
        }
```

### Cash Payment Flow

```
Customer Purchase: Rs. 4,750
         │
         ▼
Customer tenders: Rs. 5,000
         │
         ▼
System validates: 5,000 >= 4,750 ✓
         │
         ▼
Calculate change: 5,000 - 4,750 = Rs. 250
         │
         ▼
Create Payment:
  - amount: 4,750
  - method: CASH
  - status: COMPLETED
  - method_details: {
      amount_tendered: 5,000,
      change_given: 250
    }
         │
         ▼
Return change to customer: Rs. 250
         │
         ▼
Print receipt
```

### Sri Lankan Cash Handling

**Common Denominations:**
```
Notes:
- Rs. 5,000 (purple)
- Rs. 1,000 (brown)
- Rs. 500 (purple/red)
- Rs. 100 (red)
- Rs. 50 (green)
- Rs. 20 (orange)

Coins:
- Rs. 10
- Rs. 5
- Rs. 2
- Rs. 1
- 50 cents
- 25 cents
```

**Change Calculation Examples:**
```
Purchase: Rs. 175
Tendered: Rs. 200
Change: Rs. 25

Purchase: Rs. 4,850
Tendered: Rs. 5,000
Change: Rs. 150

Purchase: Rs. 1,234.50
Tendered: Rs. 1,500
Change: Rs. 265.50
```

### Expected Outcome
- Cash payment recording with change calculation
- Immediate COMPLETED status
- method_details with tender and change amounts
- No processing fees
- User accountability

### Verification Checklist
- [ ] record_cash_payment() method added to PaymentService
- [ ] Amount tendered validation implemented
- [ ] Change calculation correct
- [ ] method_details populated with cash-specific info
- [ ] Status set to COMPLETED immediately
- [ ] processed_at timestamp set
- [ ] User (received_by) linked
- [ ] No processing fee applied

---

## Task 21: Implement Card Payment Recording

### Overview
Implement card payment recording for Visa, MasterCard, and other payment cards. Card payments in Sri Lanka often include processing fees and require capturing card details (type, last 4 digits, approval code) for reconciliation. Integration with payment gateways may process asynchronously.

### Dependencies
- Task 20: Implement Cash Payment Recording
- PaymentMethod.CARD defined
- Payment gateway configuration (optional)

### Instructions

1. **Add record_card_payment() method to PaymentService**
   - Accepts: tenant, amount, card_details, user
   - card_details: {card_type, last_four, approval_code, etc.}
   - Creates Payment with CARD method

2. **Validate and store card details**
   - card_type: VISA, MASTERCARD, AMEX
   - last_four: Last 4 digits only (PCI compliance - never full number)
   - approval_code: From payment terminal/gateway
   - Optional: terminal_id, merchant_id, card_holder_name

3. **Calculate processing fee**
   - Use PaymentMethodConfig for tenant
   - Typically 2-3% in Sri Lanka
   - Add to total charged to customer

4. **Set initial status**
   - Status: PENDING (if gateway processing required)
   - Or COMPLETED (if immediate approval from terminal)
   - processed_at: Set when status changes to COMPLETED

5. **Handle gateway reference**
   - reference_number: Approval code or gateway transaction ID
   - Store for reconciliation and chargebacks

### Implementation

```python
@staticmethod
@transaction.atomic
def record_card_payment(
    tenant,
    amount,
    card_details,
    user,
    invoice=None,
    customer=None,
    immediate_approval=True,
    notes=None
):
    """
    Record card payment (Visa/MasterCard/AMEX)
    
    Args:
        tenant: Tenant instance
        amount: Payment amount before fees
        card_details: dict with card_type, last_four, approval_code
        user: User recording payment
        invoice: Optional invoice
        customer: Optional customer
        immediate_approval: If True, set COMPLETED immediately
        notes: Optional notes
        
    Returns:
        dict: Response with payment
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Validate required card details
        required_fields = ['card_type', 'last_four', 'approval_code']
        missing = [f for f in required_fields if f not in card_details]
        
        if missing:
            return {
                'success': False,
                'error': f'Missing required card details: {", ".join(missing)}',
                'code': 'MISSING_CARD_DETAILS'
            }
        
        # Validate card type is accepted
        accepted_types = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER']
        if card_details['card_type'] not in accepted_types:
            return {
                'success': False,
                'error': f'Card type {card_details["card_type"]} not accepted',
                'code': 'INVALID_CARD_TYPE'
            }
        
        # Calculate processing fee
        fee = PaymentService.calculate_processing_fee(
            tenant=tenant,
            method=PaymentMethod.CARD,
            amount=amount
        )
        
        # Prepare method details
        method_details = {
            'card_type': card_details['card_type'],
            'last_four': card_details['last_four'],
            'approval_code': card_details['approval_code'],
        }
        
        # Optional fields
        optional_fields = ['terminal_id', 'merchant_id', 'card_holder_name', 'transaction_type']
        for field in optional_fields:
            if field in card_details:
                method_details[field] = card_details[field]
        
        # Determine status
        status = PaymentStatus.COMPLETED if immediate_approval else PaymentStatus.PENDING
        processed_at = timezone.now() if immediate_approval else None
        
        # Create payment
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=PaymentMethod.CARD,
            status=status,
            payment_date=timezone.now().date(),
            processed_at=processed_at,
            invoice=invoice,
            customer=customer,
            received_by=user,
            method_details=method_details,
            reference_number=card_details['approval_code'],
            notes=notes,
            processing_fee=fee
        )
        
        logger.info(
            f"Card payment recorded: {payment.payment_number}, "
            f"Card: {card_details['card_type']} ending {card_details['last_four']}, "
            f"Amount: Rs. {amount}, Fee: Rs. {fee}"
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'amount': amount,
            'processing_fee': fee,
            'total_charged': amount + fee,
            'message': 'Card payment recorded successfully'
        }
        
    except Exception as e:
        logger.error(f"Card payment recording failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'CARD_PAYMENT_ERROR'
        }
```

### Card Payment Flow

```
Customer swipes card
         │
         ▼
POS terminal connects to gateway
         │
         ▼
Authorization request
         │
         ▼
Gateway approves: AUTH123456
         │
         ▼
Record payment:
  - amount: 10,000
  - processing_fee: 250 (2.5%)
  - total_charged: 10,250
  - method_details: {
      card_type: "VISA",
      last_four: "1234",
      approval_code: "AUTH123456"
    }
         │
         ▼
Print receipt with last 4 digits
```

### Card Processing Fees (Sri Lankan Context)

| Card Type | Typical Fee | Example (Rs. 10,000) |
|-----------|-------------|----------------------|
| Visa/MasterCard (local) | 2-2.5% | Rs. 200-250 |
| Visa/MasterCard (foreign) | 3-3.5% | Rs. 300-350 |
| AMEX | 3.5-4% | Rs. 350-400 |

**Fee Calculation:**
```
Purchase amount: Rs. 10,000
Processing fee (2.5%): Rs. 250
Total charged to customer: Rs. 10,250

In method_details:
{
  "amount_before_fee": "10000.00",
  "processing_fee": "250.00",
  "total_charged": "10250.00"
}
```

### PCI Compliance Guidelines

**What to Store:**
- ✅ First 6 and last 4 digits (for BIN and card identification)
- ✅ Cardholder name
- ✅ Expiration date
- ✅ Service code

**What NEVER to Store:**
- ❌ Full magnetic stripe data
- ❌ CVV/CVC/CVV2/CVC2 security codes
- ❌ PIN or PIN block

**In Our Implementation:**
- Store last 4 digits only
- Store approval code (not sensitive)
- Store card type (VISA, etc.)
- Never store full card number or CVV

### Expected Outcome
- Card payment recording with last 4 digits
- Processing fee calculation and application
- Approval code for reconciliation
- PCI-compliant data storage
- Gateway integration ready

### Verification Checklist
- [ ] record_card_payment() method added
- [ ] Card details validation (card_type, last_four, approval_code)
- [ ] Accepted card types checked (VISA, MASTERCARD, AMEX)
- [ ] Processing fee calculated and stored
- [ ] method_details with card-specific info
- [ ] Approval code stored in reference_number
- [ ] PCI compliance verified (no full card number)
- [ ] Status PENDING or COMPLETED based on gateway

---

## Task 22: Implement Bank Transfer Recording

### Overview
Implement bank transfer payment recording for direct bank-to-bank transfers, common in Sri Lankan B2B transactions. Bank transfers require verification with bank statements and reference numbers from banks like Commercial Bank, Sampath Bank, HNB, etc.

### Dependencies
- Task 21: Implement Card Payment Recording
- PaymentMethod.BANK_TRANSFER defined

### Instructions

1. **Add record_bank_transfer() method to PaymentService**
   - Accepts: tenant, amount, bank_details, user
   - bank_details: {bank_name, reference_number, account_number_last_four}
   - Creates Payment with BANK_TRANSFER method

2. **Validate and store bank details**
   - bank_name: Name of bank (required)
   - reference_number: Bank's transaction reference (required)
   - branch_name: Optional bank branch
   - account_number_last_four: Optional last 4 digits of account
   - transfer_date: Date of transfer (may differ from recording date)

3. **Set pending status initially**
   - Status: PENDING (requires bank verification)
   - processed_at: NULL initially
   - Will be updated after bank reconciliation

4. **Store reference for reconciliation**
   - reference_number: Bank's transaction reference
   - Critical for matching with bank statements
   - Examples: "CBL/TRF/2026/012345", "SPB-TRF-20260123-1234"

5. **Add verification tracking**
   - verified_by: User who verified with bank
   - internal_notes: Verification details
   - Update status to COMPLETED after verification

### Implementation

```python
@staticmethod
@transaction.atomic
def record_bank_transfer(
    tenant,
    amount,
    bank_details,
    user,
    invoice=None,
    customer=None,
    notes=None
):
    """
    Record bank transfer payment
    
    Args:
        tenant: Tenant instance
        amount: Payment amount
        bank_details: dict with bank_name, reference_number, etc.
        user: User recording payment
        invoice: Optional invoice
        customer: Optional customer
        notes: Optional notes
        
    Returns:
        dict: Response with payment
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Validate required bank details
        if 'bank_name' not in bank_details:
            return {
                'success': False,
                'error': 'Bank name is required',
                'code': 'MISSING_BANK_NAME'
            }
        
        if 'reference_number' not in bank_details:
            return {
                'success': False,
                'error': 'Bank reference number is required',
                'code': 'MISSING_REFERENCE_NUMBER'
            }
        
        # Prepare method details
        method_details = {
            'bank_name': bank_details['bank_name'],
            'reference_number': bank_details['reference_number'],
        }
        
        # Optional fields
        optional_fields = [
            'branch_name',
            'account_number_last_four',
            'transfer_date',
            'verified_by',
            'verification_date'
        ]
        for field in optional_fields:
            if field in bank_details:
                method_details[field] = bank_details[field]
        
        # Determine transfer date
        transfer_date = bank_details.get('transfer_date')
        if isinstance(transfer_date, str):
            from datetime import datetime
            transfer_date = datetime.strptime(transfer_date, '%Y-%m-%d').date()
        
        # Create payment (initially PENDING)
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=PaymentMethod.BANK_TRANSFER,
            status=PaymentStatus.PENDING,  # Requires verification
            payment_date=transfer_date or timezone.now().date(),
            invoice=invoice,
            customer=customer,
            received_by=user,
            method_details=method_details,
            reference_number=bank_details['reference_number'],
            notes=notes,
            processing_fee=Decimal('0.00')  # Usually no fee for transfers
        )
        
        # Add internal note about verification needed
        payment.internal_notes = (
            f"[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {user.get_full_name()}: "
            f"Bank transfer recorded. Verification required.\n"
            f"Bank: {bank_details['bank_name']}\n"
            f"Reference: {bank_details['reference_number']}"
        )
        payment.save(update_fields=['internal_notes'])
        
        logger.info(
            f"Bank transfer recorded: {payment.payment_number}, "
            f"Bank: {bank_details['bank_name']}, "
            f"Reference: {bank_details['reference_number']}, "
            f"Amount: Rs. {amount}"
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'status': 'PENDING',
            'message': 'Bank transfer recorded. Verification required.',
            'verification_required': True
        }
        
    except Exception as e:
        logger.error(f"Bank transfer recording failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'BANK_TRANSFER_ERROR'
        }
```

### Bank Transfer Flow

```
Customer initiates transfer at bank
         │
         ▼
Bank processes transfer
Bank Reference: CBL/TRF/2026/012345
         │
         ▼
Customer provides reference to merchant
         │
         ▼
Merchant records payment:
  - amount: 50,000
  - status: PENDING
  - method_details: {
      bank_name: "Commercial Bank",
      reference_number: "CBL/TRF/2026/012345",
      branch_name: "Colombo Main"
    }
         │
         ▼
Accounts team verifies with bank statement (next day)
         │
         ▼
Update payment:
  - status: COMPLETED
  - processed_at: 2026-01-24 09:00
  - verified_by: Accounts Manager
```

### Common Sri Lankan Banks and Reference Formats

| Bank | Reference Format | Example |
|------|------------------|---------|
| Commercial Bank | CBL/TRF/YYYY/NNNNNN | CBL/TRF/2026/012345 |
| Sampath Bank | SPB-TRF-YYYYMMDD-NNNN | SPB-TRF-20260123-1234 |
| Hatton National Bank | HNB-YYYYMMDD-NNNNNN | HNB-20260123-123456 |
| Bank of Ceylon | BOC-TRF-NNNNNNNN | BOC-TRF-12345678 |
| Nations Trust Bank | NTB/TRF/YYYY/NNN | NTB/TRF/2026/789 |
| DFCC Bank | DFCC-YYYYMMDD-NNNNN | DFCC-20260123-45678 |
| NSB (National Savings Bank) | NSB-TRF-NNNNNNN | NSB-TRF-1234567 |

### Bank Reconciliation Process

```
Daily Reconciliation:
1. Download bank statement
2. Extract transfer references
3. Match with PENDING bank transfer payments
4. Verify amounts match
5. Update payment status to COMPLETED
6. Set processed_at timestamp
7. Add verification notes
```

**Verification SQL Query:**
```sql
-- Find unverified bank transfers
SELECT 
    payment_number,
    reference_number,
    amount,
    created_at
FROM payments
WHERE method = 'BANK_TRANSFER'
  AND status = 'PENDING'
  AND created_at < NOW() - INTERVAL '1 day'
ORDER BY created_at;
```

### Expected Outcome
- Bank transfer recording with reference tracking
- PENDING status requiring verification
- Bank reference stored for reconciliation
- Integration-ready for bank statement matching
- No processing fees

### Verification Checklist
- [ ] record_bank_transfer() method added
- [ ] Bank name validation
- [ ] Reference number validation and storage
- [ ] method_details with bank-specific info
- [ ] Status PENDING initially
- [ ] reference_number stored for reconciliation
- [ ] Internal notes for verification tracking
- [ ] No processing fee applied

---

## Task 23: Implement Mobile Payment Recording

### Overview
Implement mobile payment recording for popular Sri Lankan mobile wallet services like FriMi (Sampath/LOLC), eZ Cash, mCash (Dialog), and Genie (HNB). Mobile payments are growing in Sri Lanka's urban areas and require capturing provider-specific transaction IDs.

### Dependencies
- Task 22: Implement Bank Transfer Recording
- PaymentMethod.MOBILE defined

### Instructions

1. **Add record_mobile_payment() method to PaymentService**
   - Accepts: tenant, amount, mobile_details, user
   - mobile_details: {provider, transaction_id, mobile_number_last_four}
   - Creates Payment with MOBILE method

2. **Validate and store mobile payment details**
   - provider: FriMi, eZ Cash, mCash, Genie (required)
   - transaction_id: Provider's unique transaction ID (required)
   - mobile_number_last_four: Optional last 4 digits of mobile
   - timestamp: Transaction timestamp from provider

3. **Calculate processing fee**
   - Use PaymentMethodConfig for tenant
   - Mobile payments typically 0.5-1.5% in Sri Lanka
   - Less than card fees

4. **Set status based on confirmation**
   - If immediate confirmation: COMPLETED
   - If pending provider confirmation: PENDING
   - Most mobile payments are immediate

5. **Store provider transaction ID**
   - reference_number: Provider's transaction ID
   - Critical for dispute resolution
   - Examples: "FRI20260123456789", "EZ-20260123103045-123"

### Implementation

```python
@staticmethod
@transaction.atomic
def record_mobile_payment(
    tenant,
    amount,
    mobile_details,
    user,
    invoice=None,
    customer=None,
    immediate_confirmation=True,
    notes=None
):
    """
    Record mobile payment (FriMi, eZ Cash, mCash, Genie)
    
    Args:
        tenant: Tenant instance
        amount: Payment amount
        mobile_details: dict with provider, transaction_id
        user: User recording payment
        invoice: Optional invoice
        customer: Optional customer
        immediate_confirmation: If True, set COMPLETED immediately
        notes: Optional notes
        
    Returns:
        dict: Response with payment
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Validate required mobile details
        required_fields = ['provider', 'transaction_id']
        missing = [f for f in required_fields if f not in mobile_details]
        
        if missing:
            return {
                'success': False,
                'error': f'Missing required mobile payment details: {", ".join(missing)}',
                'code': 'MISSING_MOBILE_DETAILS'
            }
        
        # Validate provider
        accepted_providers = ['FriMi', 'eZ Cash', 'mCash', 'Genie', 'Other']
        if mobile_details['provider'] not in accepted_providers:
            return {
                'success': False,
                'error': f'Mobile payment provider {mobile_details["provider"]} not accepted',
                'code': 'INVALID_PROVIDER'
            }
        
        # Calculate processing fee
        fee = PaymentService.calculate_processing_fee(
            tenant=tenant,
            method=PaymentMethod.MOBILE,
            amount=amount
        )
        
        # Prepare method details
        method_details = {
            'provider': mobile_details['provider'],
            'transaction_id': mobile_details['transaction_id'],
        }
        
        # Optional fields
        optional_fields = ['mobile_number_last_four', 'timestamp']
        for field in optional_fields:
            if field in mobile_details:
                method_details[field] = mobile_details[field]
        
        # Determine status
        status = PaymentStatus.COMPLETED if immediate_confirmation else PaymentStatus.PENDING
        processed_at = timezone.now() if immediate_confirmation else None
        
        # Create payment
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=PaymentMethod.MOBILE,
            status=status,
            payment_date=timezone.now().date(),
            processed_at=processed_at,
            invoice=invoice,
            customer=customer,
            received_by=user,
            method_details=method_details,
            reference_number=mobile_details['transaction_id'],
            notes=notes,
            processing_fee=fee
        )
        
        logger.info(
            f"Mobile payment recorded: {payment.payment_number}, "
            f"Provider: {mobile_details['provider']}, "
            f"Transaction: {mobile_details['transaction_id']}, "
            f"Amount: Rs. {amount}, Fee: Rs. {fee}"
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'provider': mobile_details['provider'],
            'transaction_id': mobile_details['transaction_id'],
            'processing_fee': fee,
            'message': 'Mobile payment recorded successfully'
        }
        
    except Exception as e:
        logger.error(f"Mobile payment recording failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'MOBILE_PAYMENT_ERROR'
        }
```

### Mobile Payment Flow

```
Customer selects mobile payment
         │
         ▼
Merchant initiates payment request
         │
         ▼
Customer receives push notification on phone
         │
         ▼
Customer approves payment with PIN
         │
         ▼
Provider processes payment
Transaction ID: FRI20260123456789
         │
         ▼
Merchant receives confirmation
         │
         ▼
Record payment:
  - amount: 2,500
  - processing_fee: 25 (1%)
  - method_details: {
      provider: "FriMi",
      transaction_id: "FRI20260123456789",
      mobile_number_last_four: "9876"
    }
         │
         ▼
Payment completed
```

### Sri Lankan Mobile Payment Providers

| Provider | Owner | Transaction ID Format | Market Share |
|----------|-------|----------------------|--------------|
| **FriMi** | Sampath Bank + LOLC Finance | FRI-YYMMDDHHMMSSNNN | High |
| **eZ Cash** | Dialog Axiata | EZ-YYYYMMDDHHMMSS-NNN | High |
| **mCash** | Dialog | MCASH-NNNNNNNNNN | Medium |
| **Genie** | HNB | GENIE-YYYYMMDD-NNNN | Medium |

**Provider Details:**

**FriMi:**
- Most popular in urban areas
- Wide merchant acceptance
- QR code and NFC support
- Transaction limit: Rs. 200,000 per day

**eZ Cash:**
- Extensive agent network
- Bill payment integration
- Mobile top-up
- Transaction limit: Rs. 100,000 per transaction

**mCash:**
- Dialog subscriber base advantage
- Airtime purchase integration
- Growing merchant network
- Transaction limit: Rs. 50,000 per transaction

**Genie:**
- HNB banking integration
- QR code payments
- Growing acceptance
- Transaction limit: Rs. 150,000 per day

### Mobile Payment Processing Fees

| Provider | Fee Type | Typical Rate | Example (Rs. 10,000) |
|----------|----------|--------------|----------------------|
| FriMi | Percentage | 1-1.5% | Rs. 100-150 |
| eZ Cash | Percentage | 1-2% | Rs. 100-200 |
| mCash | Percentage | 0.5-1% | Rs. 50-100 |
| Genie | Percentage | 1-1.5% | Rs. 100-150 |

### Expected Outcome
- Mobile payment recording with provider tracking
- Transaction ID for dispute resolution
- Processing fee calculation
- Support for major Sri Lankan providers
- Immediate or pending confirmation

### Verification Checklist
- [ ] record_mobile_payment() method added
- [ ] Provider validation (FriMi, eZ Cash, mCash, Genie)
- [ ] Transaction ID validation and storage
- [ ] method_details with mobile-specific info
- [ ] Processing fee calculated
- [ ] reference_number stores transaction_id
- [ ] Status based on immediate_confirmation parameter
- [ ] Logging includes provider and transaction ID

---

*Document continues with Tasks 24-25...*

## Task 24: Implement Check Payment Recording

### Overview
Implement check (cheque) payment recording for bank checks, still commonly used in Sri Lankan B2B transactions. Checks require special handling for post-dated checks, clearing periods, and potential bounced check scenarios.

### Dependencies
- Task 23: Implement Mobile Payment Recording
- PaymentMethod.CHECK defined

### Instructions

1. **Add record_check_payment() method to PaymentService**
   - Accepts: tenant, amount, check_details, user
   - check_details: {check_number, bank_name, check_date}
   - Creates Payment with CHECK method

2. **Validate and store check details**
   - check_number: Required
   - bank_name: Required
   - check_date: Date on check (may be future for post-dated)
   - branch: Optional bank branch
   - account_number_last_four: Optional
   - drawer_name: Name on check (if different from customer)

3. **Handle post-dated checks**
   - Check if check_date is future
   - Set is_post_dated flag in method_details
   - Payment_date = check_date (not today)
   - Status = PENDING until check date arrives

4. **Set clearing period**
   - Use PaymentMethodConfig.check_clearing_days (default 3)
   - Expected clearing date = check_date + clearing_days
   - Store in method_details

5. **Require approval**
   - Checks typically require manager approval
   - Set status PENDING until approved
   - approved_by and approved_at set on approval

6. **Track check lifecycle**
   - PENDING → Received, awaiting deposit
   - COMPLETED → Check cleared
   - FAILED → Check bounced (NSF - non-sufficient funds)

### Implementation

```python
@staticmethod
@transaction.atomic
def record_check_payment(
    tenant,
    amount,
    check_details,
    user,
    invoice=None,
    customer=None,
    notes=None
):
    """
    Record check payment
    
    Args:
        tenant: Tenant instance
        amount: Payment amount
        check_details: dict with check_number, bank_name, check_date
        user: User recording payment
        invoice: Optional invoice
        customer: Optional customer
        notes: Optional notes
        
    Returns:
        dict: Response with payment
    """
    from django.utils import timezone
    from datetime import datetime, timedelta, date
    from decimal import Decimal
    
    try:
        # Validate required check details
        required_fields = ['check_number', 'bank_name', 'check_date']
        missing = [f for f in required_fields if f not in check_details]
        
        if missing:
            return {
                'success': False,
                'error': f'Missing required check details: {", ".join(missing)}',
                'code': 'MISSING_CHECK_DETAILS'
            }
        
        # Parse check date
        check_date_str = check_details['check_date']
        if isinstance(check_date_str, str):
            check_date = datetime.strptime(check_date_str, '%Y-%m-%d').date()
        elif isinstance(check_date_str, date):
            check_date = check_date_str
        else:
            return {
                'success': False,
                'error': 'Invalid check_date format',
                'code': 'INVALID_CHECK_DATE'
            }
        
        # Check if post-dated
        today = date.today()
        is_post_dated = check_date > today
        
        # Get check clearing days from config
        try:
            config = PaymentMethodConfig.objects.get(
                tenant=tenant,
                method=PaymentMethod.CHECK
            )
            clearing_days = config.check_clearing_days or 3
            
            # Check if post-dated checks allowed
            if is_post_dated and not config.allow_post_dated_checks:
                return {
                    'success': False,
                    'error': 'Post-dated checks not accepted',
                    'code': 'POST_DATED_NOT_ALLOWED'
                }
            
            # Check max post-dated days
            if is_post_dated and config.max_post_dated_days:
                days_ahead = (check_date - today).days
                if days_ahead > config.max_post_dated_days:
                    return {
                        'success': False,
                        'error': f'Check cannot be dated more than {config.max_post_dated_days} days ahead',
                        'code': 'CHECK_DATE_TOO_FAR'
                    }
        except PaymentMethodConfig.DoesNotExist:
            clearing_days = 3  # Default
        
        # Calculate expected clearing date
        clearing_date = check_date + timedelta(days=clearing_days)
        
        # Prepare method details
        method_details = {
            'check_number': check_details['check_number'],
            'bank_name': check_details['bank_name'],
            'check_date': check_date.isoformat(),
            'is_post_dated': is_post_dated,
            'clearing_days': clearing_days,
            'expected_clearing_date': clearing_date.isoformat(),
        }
        
        # Optional fields
        optional_fields = ['branch', 'account_number_last_four', 'drawer_name']
        for field in optional_fields:
            if field in check_details:
                method_details[field] = check_details[field]
        
        # Create payment
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=PaymentMethod.CHECK,
            status=PaymentStatus.PENDING,  # Always pending initially
            payment_date=check_date,  # Date on check, not today
            invoice=invoice,
            customer=customer,
            received_by=user,
            method_details=method_details,
            reference_number=check_details['check_number'],
            notes=notes,
            processing_fee=Decimal('0.00')  # No fee for checks
        )
        
        # Add internal note
        note_text = (
            f"[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {user.get_full_name()}: "
            f"Check received.\n"
            f"Check #: {check_details['check_number']}\n"
            f"Bank: {check_details['bank_name']}\n"
            f"Check Date: {check_date}\n"
        )
        
        if is_post_dated:
            note_text += f"POST-DATED CHECK - Do not deposit before {check_date}\n"
        
        note_text += f"Expected clearing date: {clearing_date}"
        
        payment.internal_notes = note_text
        payment.save(update_fields=['internal_notes'])
        
        logger.info(
            f"Check payment recorded: {payment.payment_number}, "
            f"Check #{check_details['check_number']}, "
            f"Bank: {check_details['bank_name']}, "
            f"Amount: Rs. {amount}, "
            f"Post-dated: {is_post_dated}"
        )
        
        message = 'Check payment recorded'
        if is_post_dated:
            message += f' (POST-DATED - {check_date})'
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'is_post_dated': is_post_dated,
            'check_date': check_date.isoformat(),
            'expected_clearing_date': clearing_date.isoformat(),
            'message': message,
            'approval_required': True
        }
        
    except Exception as e:
        logger.error(f"Check payment recording failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'CHECK_PAYMENT_ERROR'
        }
```

### Check Payment Flow

```
Customer provides check
         │
         ▼
Staff records check details:
  - Check #123456
  - Commercial Bank
  - Date: 2026-02-15 (post-dated)
         │
         ▼
System validates:
  - Post-dated checks allowed? ✓
  - Within max days ahead? ✓
         │
         ▼
Create payment:
  - status: PENDING
  - payment_date: 2026-02-15
  - method_details: {
      check_number: "123456",
      is_post_dated: true,
      check_date: "2026-02-15",
      clearing_days: 3,
      expected_clearing_date: "2026-02-18"
    }
         │
         ▼
Manager approves (if required)
         │
         ▼
On check_date (2026-02-15):
  - Deposit check at bank
  - Update internal_notes
         │
         ▼
On clearing_date (2026-02-18):
  - Verify check cleared
  - Update status: COMPLETED
  - Set processed_at
```

### Check Lifecycle States

```
┌─────────────┐
│   RECEIVED  │ Check received from customer
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   PENDING   │ Awaiting deposit date (if post-dated)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  DEPOSITED  │ Check deposited at bank (optional status)
└──────┬──────┘
       │
       ├────────► ┌─────────────┐
       │          │  COMPLETED  │ Check cleared
       │          └─────────────┘
       │
       └────────► ┌─────────────┐
                  │   FAILED    │ Check bounced (NSF)
                  └─────────────┘
```

### Post-Dated Check Handling

**Example Scenario:**
```
Today: 2026-01-23
Check Date: 2026-02-15 (23 days ahead)
Clearing Period: 3 business days

Timeline:
├─ 2026-01-23: Check received and recorded
│              Status: PENDING
│              payment_date: 2026-02-15
│
├─ 2026-02-15: Check date arrives
│              Action: Deposit check at bank
│              Update internal_notes
│
├─ 2026-02-18: Expected clearing date
│              Action: Verify with bank
│              Status: COMPLETED (if cleared)
│              Set processed_at
│
└─ If bounced: Status: FAILED
               Notify customer
               Request alternative payment
```

### Check Bounced Handling

```
Check bounced (NSF - Non-Sufficient Funds):
         │
         ▼
Update payment:
  - status: FAILED
  - internal_notes: "Check bounced - NSF"
         │
         ▼
Notify accounts team and customer
         │
         ▼
Options:
  1. Request replacement check
  2. Request alternative payment method
  3. Revert invoice to UNPAID
  4. Apply returned check fees (if applicable)
```

### Expected Outcome
- Check payment recording with all details
- Post-dated check support
- Clearing period tracking
- Manager approval workflow
- Bounce/NSF handling ready

### Verification Checklist
- [ ] record_check_payment() method added
- [ ] Check details validation (number, bank, date)
- [ ] Post-dated check detection and validation
- [ ] Clearing days calculation
- [ ] method_details with check-specific info
- [ ] Status PENDING initially
- [ ] reference_number stores check_number
- [ ] Internal notes for lifecycle tracking
- [ ] Post-dated check restrictions enforced

---

## Task 25: Implement Store Credit Payment

### Overview
Implement store credit payment recording for when customers use their accumulated store credit balance (from refunds, promotional credits, or loyalty rewards). Store credit payments require balance verification and deduction from customer account.

### Dependencies
- Task 24: Implement Check Payment Recording
- PaymentMethod.STORE_CREDIT defined
- Customer model with store credit balance field

### Instructions

1. **Add record_store_credit_payment() method to PaymentService**
   - Accepts: tenant, amount, customer (required), user
   - Validates customer has sufficient balance
   - Deducts from customer's store credit
   - Creates Payment with STORE_CREDIT method

2. **Validate customer store credit balance**
   - Customer must be provided (required for store credit)
   - Customer must have sufficient balance
   - Balance >= payment amount

3. **Deduct from customer balance**
   - Get current balance
   - Subtract payment amount
   - Update customer record
   - Store balance_before and balance_after in method_details

4. **Track credit source**
   - Original source: REFUND, PROMOTION, LOYALTY, MANUAL
   - If from refund, link to original refund record
   - Store in method_details

5. **Set immediate completion**
   - Status: COMPLETED (internal credit, no external verification)
   - processed_at: Current timestamp
   - No processing fees

6. **Ensure atomic transaction**
   - Payment creation and balance deduction must be atomic
   - If either fails, both rollback
   - Prevent race conditions on balance

### Implementation

```python
@staticmethod
@transaction.atomic
def record_store_credit_payment(
    tenant,
    amount,
    customer,
    user,
    invoice=None,
    credit_source=None,
    refund_reference=None,
    notes=None
):
    """
    Record store credit payment
    
    Args:
        tenant: Tenant instance
        amount: Payment amount
        customer: Customer instance (required for store credit)
        user: User recording payment
        invoice: Optional invoice
        credit_source: Optional source (REFUND, PROMOTION, LOYALTY, MANUAL)
        refund_reference: Optional refund ID if from refund
        notes: Optional notes
        
    Returns:
        dict: Response with payment and updated balance
    """
    from django.utils import timezone
    from decimal import Decimal
    
    try:
        # Validate customer provided
        if not customer:
            return {
                'success': False,
                'error': 'Customer is required for store credit payment',
                'code': 'CUSTOMER_REQUIRED'
            }
        
        # Check customer has store_credit_balance field
        if not hasattr(customer, 'store_credit_balance'):
            return {
                'success': False,
                'error': 'Store credit not supported for this customer',
                'code': 'STORE_CREDIT_NOT_SUPPORTED'
            }
        
        # Get current balance
        balance_before = customer.store_credit_balance or Decimal('0.00')
        
        # Validate sufficient balance
        if balance_before < amount:
            return {
                'success': False,
                'error': f'Insufficient store credit. Available: Rs. {balance_before}, Required: Rs. {amount}',
                'code': 'INSUFFICIENT_BALANCE',
                'available_balance': float(balance_before),
                'required_amount': float(amount)
            }
        
        # Calculate new balance
        balance_after = balance_before - amount
        
        # Prepare method details
        method_details = {
            'balance_before': str(balance_before),
            'amount_used': str(amount),
            'balance_after': str(balance_after),
        }
        
        if credit_source:
            method_details['credit_source'] = credit_source
        
        if refund_reference:
            method_details['refund_reference'] = refund_reference
        
        # Create payment
        payment = Payment.objects.create(
            tenant=tenant,
            amount=amount,
            method=PaymentMethod.STORE_CREDIT,
            status=PaymentStatus.COMPLETED,  # Immediate completion
            payment_date=timezone.now().date(),
            processed_at=timezone.now(),
            invoice=invoice,
            customer=customer,
            received_by=user,
            method_details=method_details,
            notes=notes,
            processing_fee=Decimal('0.00')  # No fee for store credit
        )
        
        # Deduct from customer balance (atomic with payment creation)
        customer.store_credit_balance = balance_after
        customer.save(update_fields=['store_credit_balance'])
        
        logger.info(
            f"Store credit payment recorded: {payment.payment_number}, "
            f"Customer: {customer.name}, "
            f"Amount: Rs. {amount}, "
            f"Balance before: Rs. {balance_before}, "
            f"Balance after: Rs. {balance_after}"
        )
        
        return {
            'success': True,
            'payment': payment,
            'payment_number': payment.payment_number,
            'balance_before': float(balance_before),
            'balance_after': float(balance_after),
            'message': f'Store credit payment recorded. Remaining balance: Rs. {balance_after}'
        }
        
    except Exception as e:
        logger.error(f"Store credit payment recording failed: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e),
            'code': 'STORE_CREDIT_ERROR'
        }
```

### Store Credit Flow

```
Customer has store credit: Rs. 15,000
(from previous refund)
         │
         ▼
Customer purchases items: Rs. 10,000
         │
         ▼
Choose payment: Store Credit
         │
         ▼
System validates:
  - Customer has credit? ✓
  - Sufficient balance? ✓
  - 15,000 >= 10,000 ✓
         │
         ▼
Create payment:
  - amount: 10,000
  - method: STORE_CREDIT
  - status: COMPLETED
  - method_details: {
      balance_before: "15000.00",
      amount_used: "10000.00",
      balance_after: "5000.00",
      credit_source: "REFUND"
    }
         │
         ▼
Deduct from customer balance:
  - Old balance: 15,000
  - New balance: 5,000
         │
         ▼
Payment completed
Remaining credit: Rs. 5,000
```

### Store Credit Sources

| Source | Description | Typical Amount |
|--------|-------------|----------------|
| **REFUND** | From product return refund | Variable (refund amount) |
| **PROMOTION** | Marketing promotion credit | Rs. 500-5,000 |
| **LOYALTY** | Loyalty program reward | Rs. 100-1,000 |
| **MANUAL** | Manual adjustment by staff | Variable |
| **COMPENSATION** | Service recovery | Rs. 1,000-10,000 |

### Store Credit Accounting

```
Customer Store Credit Balance Ledger:

Initial Balance:     Rs. 0
         │
         ▼
+ Refund (REF-2025-00789):  Rs. 5,000
Balance:            Rs. 5,000
         │
         ▼
+ Promotion (PROMO-NY2026):  Rs. 1,000
Balance:            Rs. 6,000
         │
         ▼
- Payment (PAY-2026-00123):  Rs. 2,500
Balance:            Rs. 3,500
         │
         ▼
- Payment (PAY-2026-00234):  Rs. 1,000
Balance:            Rs. 2,500
```

### Race Condition Prevention

```python
# Problem: Two payments at same time
Payment 1: Amount 10,000
Payment 2: Amount 8,000
Customer Balance: 15,000

Without @transaction.atomic:
├─ Payment 1 reads balance: 15,000
├─ Payment 2 reads balance: 15,000  (before Payment 1 saves)
├─ Payment 1 deducts: 15,000 - 10,000 = 5,000
├─ Payment 2 deducts: 15,000 - 8,000 = 7,000  (using old balance!)
└─ Final balance: 7,000 ❌ (should be 5,000 - 10,000 - 8,000 = negative!)

With @transaction.atomic and select_for_update:
├─ Payment 1 locks customer record
├─ Payment 2 waits for lock
├─ Payment 1 completes: balance = 5,000
├─ Payment 2 starts: reads balance = 5,000
├─ Payment 2 validates: 5,000 < 8,000 ❌
└─ Payment 2 rejected: Insufficient balance ✓
```

**Enhanced Implementation with Locking:**
```python
@transaction.atomic
def record_store_credit_payment(tenant, amount, customer, user, **kwargs):
    # Lock customer record for update
    customer = Customer.objects.select_for_update().get(id=customer.id)
    
    balance_before = customer.store_credit_balance
    
    # Validate and process...
    # (implementation continues as above)
```

### Expected Outcome
- Store credit payment with balance deduction
- Customer balance tracking
- Atomic transaction ensuring data consistency
- Source tracking for audit
- No processing fees
- Immediate completion

### Verification Checklist
- [ ] record_store_credit_payment() method added
- [ ] Customer requirement validated
- [ ] Balance sufficiency check implemented
- [ ] method_details with balance before/after
- [ ] Customer balance deduction atomic with payment
- [ ] Status COMPLETED immediately
- [ ] processed_at timestamp set
- [ ] No processing fee applied
- [ ] Race condition prevention (select_for_update)
- [ ] Source tracking (refund, promotion, etc.)

---

## Summary

This document implemented the core payment recording service layer:

1. ✅ **PaymentService Class** (Task 19): Centralized service with validation, transaction management, and error handling
2. ✅ **Cash Payment** (Task 20): Amount tendered, change calculation, immediate completion
3. ✅ **Card Payment** (Task 21): Card details (PCI-compliant), processing fees, approval codes
4. ✅ **Bank Transfer** (Task 22): Bank reference tracking, pending verification workflow
5. ✅ **Mobile Payment** (Task 23): Provider support (FriMi, eZ Cash), transaction IDs, processing fees
6. ✅ **Check Payment** (Task 24): Post-dated check support, clearing periods, approval workflow
7. ✅ **Store Credit** (Task 25): Balance validation, atomic deduction, source tracking

**All six payment methods now have dedicated recording functions!**

**Next Steps:** Proceed to [02_Tasks-26-31_Validation-Allocation-Order.md](02_Tasks-26-31_Validation-Allocation-Order.md) to implement payment validation, invoice allocation, and multi-invoice payment support.
