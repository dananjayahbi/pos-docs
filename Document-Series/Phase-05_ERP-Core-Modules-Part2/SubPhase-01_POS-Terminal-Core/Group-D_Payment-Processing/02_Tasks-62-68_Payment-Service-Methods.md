# Tasks 62-68: Payment Service Methods

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** D - Payment Processing  
> **Document:** 02 of 03  
> **Tasks Covered:** 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-61_Payment-Model.md](01_Tasks-55-61_Payment-Model.md)
- **→ Next Document:** [03_Tasks-69-74_Transaction-Completion.md](03_Tasks-69-74_Transaction-Completion.md)

---

## Document Overview

This document covers the implementation of the PaymentService class with methods for processing different payment types including cash, card, mobile, store credit, and split payments, along with payment validation logic.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 62 | Create PaymentService | Medium | 25 min |
| 63 | Implement process_cash_payment | Medium | 25 min |
| 64 | Implement process_card_payment | Medium | 25 min |
| 65 | Implement process_mobile_payment | Medium | 25 min |
| 66 | Implement process_store_credit | Medium | 25 min |
| 67 | Implement split_payment | High | 35 min |
| 68 | Create payment validation | Medium | 20 min |

---

## Task 62: Create PaymentService

### Overview
Create the PaymentService class that encapsulates all payment processing logic, providing a clean interface for handling various payment methods.

### Dependencies
- Task 58: Create POSPayment model
- POSCart model exists
- Payment constants defined

### Instructions

1. **Create PaymentService file**
   - Create file: `apps/pos/payment/services/payment_service.py`
   - This will contain the main payment service class

2. **Import required dependencies**
   - Django utilities: `from django.db import transaction`
   - Timezone: `from django.utils import timezone`
   - Decimal: `from decimal import Decimal`
   - Models: `from apps.pos.models import POSCart, POSPayment`
   - Constants: Import all payment method and status constants
   - Exceptions: Custom exceptions for payment errors

3. **Define PaymentService class**
   - Class name: `PaymentService`
   - Purpose: Handle all payment processing operations
   - Stateless service (no instance variables except passed parameters)

4. **Add initialization method**
   - Method name: `__init__`
   - Parameters: `cart` (POSCart instance), `user` (processing user)
   - Store cart and user for use in payment methods
   - Validate cart exists and is in OPEN status

5. **Add _validate_cart method**
   - Private method to check cart validity
   - Ensures cart status is OPEN
   - Ensures cart has items
   - Ensures cart total is positive
   - Raises ValueError if validation fails

6. **Add _create_payment_record method**
   - Private helper method
   - Parameters: method, amount, status, additional_data
   - Creates POSPayment record with common fields
   - Returns created POSPayment instance
   - Sets created_at automatically

7. **Add get_remaining_amount method**
   - Calculate how much still needs to be paid
   - Sum all COMPLETED payments
   - Subtract from cart total
   - Return remaining amount
   - Used for split payment scenarios

8. **Add get_cart_payments method**
   - Return QuerySet of all payments for the cart
   - Optionally filter by status
   - Ordered by created_at

9. **Add class docstring**
   - Explain purpose of PaymentService
   - List main methods and their purpose
   - Provide usage example

### Service Layer Architecture

```
┌────────────────────────────────────────────────────────┐
│                   POS Application                       │
└────────────────────────────────────────────────────────┘
                         │
                         │ calls
                         ▼
┌────────────────────────────────────────────────────────┐
│                  PaymentService                         │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Methods:                                              │
│  ├── process_cash_payment()                            │
│  ├── process_card_payment()                            │
│  ├── process_mobile_payment()                          │
│  ├── process_store_credit()                            │
│  ├── split_payment()                                   │
│  └── validate_payment()                                │
│                                                         │
└────────────────────────────────────────────────────────┘
                         │
                         │ uses
                         ▼
┌────────────────────────────────────────────────────────┐
│              POSPayment Model (ORM)                     │
└────────────────────────────────────────────────────────┘
                         │
                         │ persists to
                         ▼
┌────────────────────────────────────────────────────────┐
│                    Database                             │
└────────────────────────────────────────────────────────┘
```

### PaymentService Responsibilities

**What PaymentService DOES:**
1. Validate payment requests
2. Calculate change for cash payments
3. Interact with payment gateways
4. Create POSPayment records
5. Update payment status
6. Handle split payments
7. Calculate remaining amounts

**What PaymentService DOES NOT do:**
1. Update inventory (done in transaction completion)
2. Generate receipts (separate service)
3. Handle cart management (separate service)
4. Manage sessions (separate concern)

### Usage Example Pattern

```python
# Initialize service
payment_service = PaymentService(cart=cart, user=request.user)

# Process cash payment
payment = payment_service.process_cash_payment(
    amount_tendered=Decimal('2000.00')
)

# Check remaining amount
remaining = payment_service.get_remaining_amount()
if remaining > 0:
    # Need more payments
    pass
```

### Expected Outcome
```python
# apps/pos/payment/services/payment_service.py

from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from apps.pos.models import POSCart, POSPayment
from apps.pos.constants import (
    PAYMENT_METHOD_CASH,
    PAYMENT_METHOD_CARD,
    PAYMENT_METHOD_MOBILE,
    PAYMENT_METHOD_STORE_CREDIT,
    PAYMENT_STATUS_PENDING,
    PAYMENT_STATUS_COMPLETED,
    PAYMENT_STATUS_FAILED,
    CART_STATUS_OPEN,
)


class PaymentService:
    """
    Service for processing payments in POS system.
    
    Handles various payment methods including:
    - Cash payments with change calculation
    - Card payments via gateway
    - Mobile payments (FriMi, Genie, eZ Cash)
    - Store credit
    - Split payments
    
    Usage:
        service = PaymentService(cart=cart, user=user)
        payment = service.process_cash_payment(amount_tendered=Decimal('2000.00'))
    """
    
    def __init__(self, cart, user):
        """
        Initialize payment service for a cart.
        
        Args:
            cart: POSCart instance
            user: User processing the payment
        """
        self.cart = cart
        self.user = user
        self._validate_cart()
    
    def _validate_cart(self):
        """Validate cart is ready for payment"""
        if not self.cart:
            raise ValueError("Cart is required")
        
        if self.cart.status != CART_STATUS_OPEN:
            raise ValueError(f"Cart must be OPEN to accept payments, current status: {self.cart.status}")
        
        if not self.cart.items.exists():
            raise ValueError("Cart has no items")
        
        if self.cart.total <= 0:
            raise ValueError("Cart total must be positive")
    
    def _create_payment_record(self, method, amount, status=PAYMENT_STATUS_PENDING, **additional_data):
        """
        Create POSPayment record with common fields.
        
        Args:
            method: Payment method constant
            amount: Payment amount
            status: Payment status constant
            **additional_data: Additional field values
            
        Returns:
            POSPayment instance
        """
        payment_data = {
            'cart': self.cart,
            'method': method,
            'amount': amount,
            'status': status,
            'processed_by': self.user,
            **additional_data
        }
        
        payment = POSPayment.objects.create(**payment_data)
        return payment
    
    def get_remaining_amount(self):
        """
        Calculate remaining amount to be paid.
        
        Returns:
            Decimal: Amount still needed to complete payment
        """
        completed_payments = self.cart.payments.filter(
            status=PAYMENT_STATUS_COMPLETED
        ).aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0.00')
        
        remaining = self.cart.total - completed_payments
        return max(remaining, Decimal('0.00'))
    
    def get_cart_payments(self, status=None):
        """
        Get all payments for the cart.
        
        Args:
            status: Optional status filter
            
        Returns:
            QuerySet of POSPayment
        """
        payments = self.cart.payments.all()
        
        if status:
            payments = payments.filter(status=status)
        
        return payments.order_by('created_at')
```

### Verification Checklist
- [ ] `payment_service.py` file created in services directory
- [ ] PaymentService class defined with proper docstring
- [ ] `__init__` method initializes cart and user
- [ ] `_validate_cart` method checks cart validity
- [ ] `_create_payment_record` helper method created
- [ ] `get_remaining_amount` method calculates unpaid balance
- [ ] `get_cart_payments` method retrieves payment records
- [ ] All necessary imports included

---

## Task 63: Implement process_cash_payment

### Overview
Implement the cash payment processing method with change calculation and validation.

### Dependencies
- Task 62: Create PaymentService
- Task 60: Add cash payment fields

### Instructions

1. **Open PaymentService file**
   - Navigate to `apps/pos/payment/services/payment_service.py`
   - Locate PaymentService class

2. **Add process_cash_payment method**
   - Method name: `process_cash_payment`
   - Parameters: `amount_tendered` (Decimal)
   - Returns: POSPayment instance
   - Decorator: `@transaction.atomic` for data consistency

3. **Validate amount tendered**
   - Check amount_tendered is provided and positive
   - Check amount_tendered >= remaining amount
   - Raise ValueError if validation fails

4. **Calculate payment amount**
   - Payment amount = minimum of (amount_tendered, remaining_amount)
   - Handles overpayment scenario

5. **Calculate change**
   - change_due = amount_tendered - payment amount
   - Must be >= 0

6. **Create payment record**
   - Use `_create_payment_record` helper
   - Method: PAYMENT_METHOD_CASH
   - Amount: calculated payment amount
   - Status: PAYMENT_STATUS_COMPLETED (cash is instant)
   - Additional fields: amount_tendered, change_due
   - Set paid_at to current time

7. **Return payment**
   - Return created POSPayment instance
   - Caller can access change_due from payment.change_due

8. **Add comprehensive docstring**
   - Explain parameters
   - Document return value
   - Provide usage examples
   - List possible exceptions

### Cash Payment Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│         process_cash_payment() Flow                     │
└────────────────────────────────────────────────────────┘

    [Input: amount_tendered]
             │
             ▼
    ┌─────────────────────┐
    │ Validate Input      │
    │ - Not null          │
    │ - Positive          │
    │ - >= remaining      │
    └─────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Calculate Amounts   │
    │ - payment amount    │
    │ - change due        │
    └─────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Create Payment      │
    │ - method: CASH      │
    │ - status: COMPLETED │
    │ - paid_at: now()    │
    └─────────────────────┘
             │
             ▼
    [Return: POSPayment with change_due]
```

### Cash Payment Scenarios

**Scenario 1: Exact Amount**
```
Cart Total: LKR 1,500.00
Remaining: LKR 1,500.00
Amount Tendered: LKR 1,500.00

Result:
- Payment Amount: LKR 1,500.00
- Change Due: LKR 0.00
- Status: COMPLETED
```

**Scenario 2: Overpayment**
```
Cart Total: LKR 1,750.00
Remaining: LKR 1,750.00
Amount Tendered: LKR 2,000.00

Result:
- Payment Amount: LKR 1,750.00
- Change Due: LKR 250.00
- Status: COMPLETED
```

**Scenario 3: Split Payment (First Payment)**
```
Cart Total: LKR 5,000.00
Remaining: LKR 5,000.00
Amount Tendered: LKR 2,000.00

Result:
- Payment Amount: LKR 2,000.00
- Change Due: LKR 0.00
- Status: COMPLETED
- Remaining After: LKR 3,000.00
```

**Scenario 4: Underpayment (Error)**
```
Cart Total: LKR 1,500.00
Remaining: LKR 1,500.00
Amount Tendered: LKR 1,000.00

Result:
- Raises ValueError: "Insufficient cash payment"
```

### Sri Lankan Cash Handling Best Practices

**Change Management:**
- Keep sufficient coins and small bills (LKR 10, 20, 50, 100)
- Warn if change > LKR 1,000 (may not have sufficient change)
- Suggest customer provides smaller bills if possible

**Large Bill Acceptance:**
- LKR 5,000 notes common but check for counterfeits
- May refuse LKR 5,000 for small purchases
- Store policy should be documented

**Rounding:**
- Sri Lanka typically doesn't round to nearest 5 or 10
- Exact change expected
- Smallest coin: LKR 1

**Cash Float:**
- Start-of-day cash float: LKR 5,000 - 10,000 typical
- Mix of coins and bills
- Documented in session opening

### Expected Outcome
```python
# In PaymentService class

@transaction.atomic
def process_cash_payment(self, amount_tendered):
    """
    Process cash payment with change calculation.
    
    Args:
        amount_tendered (Decimal): Amount of cash given by customer
        
    Returns:
        POSPayment: Created payment record with change_due
        
    Raises:
        ValueError: If amount_tendered is invalid or insufficient
        
    Example:
        >>> service = PaymentService(cart=cart, user=user)
        >>> payment = service.process_cash_payment(amount_tendered=Decimal('2000.00'))
        >>> print(f"Change: LKR {payment.change_due}")
        Change: LKR 250.00
    """
    # Validate amount tendered
    if not amount_tendered:
        raise ValueError("Amount tendered is required for cash payment")
    
    if amount_tendered <= 0:
        raise ValueError("Amount tendered must be positive")
    
    remaining = self.get_remaining_amount()
    
    if amount_tendered < remaining:
        raise ValueError(
            f"Insufficient cash payment. Required: LKR {remaining}, "
            f"Tendered: LKR {amount_tendered}"
        )
    
    # Calculate payment amount and change
    payment_amount = remaining  # Pay exactly what's remaining
    change_due = amount_tendered - payment_amount
    
    # Create payment record
    payment = self._create_payment_record(
        method=PAYMENT_METHOD_CASH,
        amount=payment_amount,
        status=PAYMENT_STATUS_COMPLETED,  # Cash is instant
        amount_tendered=amount_tendered,
        change_due=change_due,
        paid_at=timezone.now()
    )
    
    return payment
```

### Verification Checklist
- [ ] `process_cash_payment` method implemented
- [ ] Input validation for amount_tendered
- [ ] Change calculation logic implemented
- [ ] Payment record created with COMPLETED status
- [ ] paid_at timestamp set
- [ ] Method decorated with @transaction.atomic
- [ ] Comprehensive docstring with examples
- [ ] Error messages are clear and helpful

---

## Task 64: Implement process_card_payment

### Overview
Implement card payment processing with payment gateway integration placeholder and authorization code handling.

### Dependencies
- Task 62: Create PaymentService
- Task 59: Add payment reference fields

### Instructions

1. **Open PaymentService file**
   - Navigate to `apps/pos/payment/services/payment_service.py`
   - Locate PaymentService class

2. **Add process_card_payment method**
   - Method name: `process_card_payment`
   - Parameters: `amount`, `card_details` (dict), `authorization_code` (optional)
   - Returns: POSPayment instance
   - Decorator: `@transaction.atomic`

3. **Validate parameters**
   - Amount must be positive
   - Amount must not exceed remaining amount
   - card_details should contain: card_type, last4, etc.

4. **Create pending payment record**
   - Initial status: PAYMENT_STATUS_PENDING
   - Store card details in notes or gateway_response
   - Set created_at automatically

5. **Integrate with payment gateway (placeholder)**
   - Call gateway API (simulated for now)
   - Parameters: amount, card_details
   - Return: authorization_code, transaction_id, gateway_response
   - TODO: Implement actual gateway integration

6. **Handle gateway response**
   - If successful:
     - Update status to COMPLETED
     - Store authorization_code
     - Store transaction_id
     - Set paid_at timestamp
   - If failed:
     - Update status to FAILED
     - Store error message
     - Set failed_at timestamp
   - Store full gateway_response as JSON

7. **Refresh and return payment**
   - Refresh payment from database
   - Return updated POSPayment instance

8. **Add error handling**
   - Try-except block for gateway calls
   - Handle network errors, timeouts
   - Set status to FAILED on exception
   - Log error details

### Card Payment Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│          process_card_payment() Flow                    │
└────────────────────────────────────────────────────────┘

    [Input: amount, card_details]
             │
             ▼
    ┌─────────────────────┐
    │ Validate Input      │
    │ - Amount valid      │
    │ - Card details OK   │
    └─────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Create PENDING      │
    │ Payment Record      │
    └─────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Call Gateway API    │
    │ - Send card details │
    │ - Request auth      │
    └─────────────────────┘
             │
        ┌────┴────┐
        │         │
        ▼         ▼
    Success    Failure
        │         │
        ▼         ▼
    ┌──────┐  ┌──────┐
    │Update│  │Update│
    │  to  │  │  to  │
    │COMP  │  │FAIL  │
    │LETED │  │ED    │
    └──────┘  └──────┘
        │         │
        └────┬────┘
             ▼
    [Return: POSPayment]
```

### Sri Lankan Card Payment Context

**Popular Cards in Sri Lanka:**
- Visa (most common)
- Mastercard (common)
- Amex (less common, premium)
- Union Pay (growing, Chinese tourists)

**Local Banks:**
- Sampath Bank
- Commercial Bank
- HNB (Hatton National Bank)
- NSB (National Savings Bank)
- BOC (Bank of Ceylon)

**Payment Gateways:**
- PayHere (most popular)
- iPay
- OnlinePay (DFCC)
- Paygate (Sampath)

**Card Types:**
- Debit cards (more common than credit)
- Credit cards (growing adoption)
- Prepaid cards

**Processing Fees:**
- Typically 2-3% for merchants
- May be higher for international cards

### Payment Gateway Integration (Placeholder)

```python
def _call_payment_gateway(self, amount, card_details):
    """
    Placeholder for payment gateway integration.
    
    TODO: Implement actual gateway integration
    Options:
    - PayHere API
    - iPay API
    - Direct bank integration
    
    Returns:
        dict: {
            'success': bool,
            'authorization_code': str,
            'transaction_id': str,
            'message': str,
            'gateway_response': dict
        }
    """
    # PLACEHOLDER: Simulate gateway call
    # In production, this would:
    # 1. Call actual payment gateway API
    # 2. Handle encryption/security
    # 3. Process 3D Secure if required
    # 4. Return real authorization codes
    
    import random
    success = random.choice([True, True, True, False])  # 75% success rate
    
    if success:
        return {
            'success': True,
            'authorization_code': f'AUTH{random.randint(100000, 999999)}',
            'transaction_id': f'TXN{random.randint(1000000, 9999999)}',
            'message': 'Payment approved',
            'gateway_response': {
                'card_type': card_details.get('card_type', 'VISA'),
                'last4': card_details.get('last4', '****'),
                'approval_code': f'APP{random.randint(1000, 9999)}'
            }
        }
    else:
        return {
            'success': False,
            'authorization_code': None,
            'transaction_id': None,
            'message': 'Card declined - Insufficient funds',
            'gateway_response': {
                'error_code': 'DECLINED',
                'error_message': 'Insufficient funds'
            }
        }
```

### Expected Outcome
```python
# In PaymentService class

@transaction.atomic
def process_card_payment(self, amount, card_details, authorization_code=None):
    """
    Process card payment via payment gateway.
    
    Args:
        amount (Decimal): Payment amount
        card_details (dict): Card information {card_type, last4, etc.}
        authorization_code (str, optional): Pre-authorized code if available
        
    Returns:
        POSPayment: Payment record with gateway response
        
    Raises:
        ValueError: If validation fails
        
    Example:
        >>> card_details = {'card_type': 'VISA', 'last4': '1234'}
        >>> payment = service.process_card_payment(
        ...     amount=Decimal('1500.00'),
        ...     card_details=card_details
        ... )
        >>> print(payment.authorization_code)
        AUTH123456
    """
    # Validate amount
    if not amount or amount <= 0:
        raise ValueError("Payment amount must be positive")
    
    remaining = self.get_remaining_amount()
    if amount > remaining:
        raise ValueError(
            f"Payment amount (LKR {amount}) exceeds remaining balance (LKR {remaining})"
        )
    
    # Create pending payment record
    payment = self._create_payment_record(
        method=PAYMENT_METHOD_CARD,
        amount=amount,
        status=PAYMENT_STATUS_PENDING,
        notes=f"Card: {card_details.get('card_type', 'Unknown')} ending {card_details.get('last4', '****')}"
    )
    
    try:
        # Call payment gateway
        # TODO: Replace with actual gateway integration
        gateway_result = self._call_payment_gateway(amount, card_details)
        
        if gateway_result['success']:
            # Payment approved
            payment.status = PAYMENT_STATUS_COMPLETED
            payment.authorization_code = gateway_result['authorization_code']
            payment.transaction_id = gateway_result['transaction_id']
            payment.gateway_response = str(gateway_result['gateway_response'])
            payment.paid_at = timezone.now()
        else:
            # Payment declined
            payment.status = PAYMENT_STATUS_FAILED
            payment.gateway_response = str(gateway_result['gateway_response'])
            payment.notes += f"\nError: {gateway_result['message']}"
            payment.failed_at = timezone.now()
        
        payment.save()
        
    except Exception as e:
        # Gateway error (network, timeout, etc.)
        payment.status = PAYMENT_STATUS_FAILED
        payment.notes += f"\nException: {str(e)}"
        payment.failed_at = timezone.now()
        payment.save()
        raise
    
    payment.refresh_from_db()
    return payment

def _call_payment_gateway(self, amount, card_details):
    """
    Placeholder for payment gateway integration.
    TODO: Implement actual gateway (PayHere, iPay, etc.)
    """
    # Placeholder implementation
    import random
    success = random.choice([True, True, True, False])
    
    if success:
        return {
            'success': True,
            'authorization_code': f'AUTH{random.randint(100000, 999999)}',
            'transaction_id': f'TXN{random.randint(1000000, 9999999)}',
            'message': 'Payment approved',
            'gateway_response': {
                'card_type': card_details.get('card_type', 'VISA'),
                'last4': card_details.get('last4', '****'),
            }
        }
    else:
        return {
            'success': False,
            'message': 'Card declined',
            'gateway_response': {'error': 'Insufficient funds'}
        }
```

### Verification Checklist
- [ ] `process_card_payment` method implemented
- [ ] Input validation for amount and card_details
- [ ] PENDING payment created before gateway call
- [ ] Gateway integration placeholder added
- [ ] Success path updates to COMPLETED with auth code
- [ ] Failure path updates to FAILED with error message
- [ ] Exception handling for gateway errors
- [ ] Method decorated with @transaction.atomic
- [ ] Comprehensive docstring

---

## Task 65: Implement process_mobile_payment

### Overview
Implement mobile payment processing for Sri Lankan mobile payment methods like FriMi, Dialog Genie, and eZ Cash.

### Dependencies
- Task 62: Create PaymentService
- Task 64: Implement process_card_payment (similar pattern)

### Instructions

1. **Open PaymentService file**
   - Navigate to `apps/pos/payment/services/payment_service.py`
   - Locate PaymentService class

2. **Add process_mobile_payment method**
   - Method name: `process_mobile_payment`
   - Parameters: `amount`, `mobile_provider`, `phone_number`, `reference_number`
   - Returns: POSPayment instance
   - Decorator: `@transaction.atomic`

3. **Define supported providers**
   - Create constant: SUPPORTED_MOBILE_PROVIDERS
   - Include: 'FRIMI', 'GENIE', 'EZCASH', 'PAYHERE_QR'

4. **Validate parameters**
   - Amount must be positive and not exceed remaining
   - mobile_provider must be in SUPPORTED_MOBILE_PROVIDERS
   - phone_number must be valid Sri Lankan format (07xxxxxxxx)
   - reference_number may be optional (some providers generate later)

5. **Create pending payment record**
   - Status: PAYMENT_STATUS_PENDING
   - Store mobile_provider in notes
   - Store phone_number in notes (masked for privacy)
   - Store reference_number if provided

6. **Integrate with mobile provider API (placeholder)**
   - Different APIs for each provider
   - FriMi: Sampath Bank API
   - Genie: Dialog API
   - eZ Cash: eZ Cash API
   - PayHere: QR code or deep link

7. **Handle provider response**
   - Success: Update to COMPLETED, store reference_number
   - Pending: Keep as PENDING (customer needs to confirm OTP)
   - Failed: Update to FAILED
   - Store provider response

8. **Add support for OTP confirmation**
   - Some providers require customer OTP
   - May need separate method: `confirm_mobile_payment_otp`
   - Update payment status after OTP verified

### Mobile Payment Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│        process_mobile_payment() Flow                    │
└────────────────────────────────────────────────────────┘

    [Input: amount, provider, phone, reference]
                      │
                      ▼
    ┌──────────────────────────────────┐
    │ Validate Input                   │
    │ - Amount OK                      │
    │ - Provider supported             │
    │ - Phone number valid (07...)     │
    └──────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────┐
    │ Create PENDING Payment           │
    │ - Store provider info            │
    │ - Store phone (masked)           │
    └──────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────┐
    │ Call Mobile Provider API         │
    │ - Send payment request           │
    │ - Customer receives OTP          │
    └──────────────────────────────────┘
                      │
                ┌─────┴─────┐
                │           │
                ▼           ▼
          ┌─────────┐  ┌────────┐
          │Customer │  │Timeout │
          │Confirms │  │/Decline│
          │  OTP    │  │        │
          └─────────┘  └────────┘
                │           │
                ▼           ▼
          ┌─────────┐  ┌────────┐
          │COMPLETED│  │ FAILED │
          └─────────┘  └────────┘
                │           │
                └─────┬─────┘
                      ▼
            [Return: POSPayment]
```

### Sri Lankan Mobile Payment Providers

**1. FriMi (Sampath Bank)**
- Prefix: "FM"
- Phone: 077, 071, 075, 076, 078
- Reference: "FM" + date + sequence
- OTP: Required
- Processing: 5-30 seconds

**2. Dialog Genie**
- Prefix: "DG" or "GENIE"
- Phone: 077 (Dialog subscribers)
- Reference: "DG" + sequence
- OTP: Required
- Processing: 5-15 seconds

**3. eZ Cash**
- Prefix: "EZ"
- Phone: Any operator
- Reference: "EZ" + sequence
- OTP: Required
- Processing: 10-30 seconds

**4. PayHere QR**
- QR code scanned by customer
- Reference: "PH" + transaction ID
- Instant confirmation via app
- Processing: 2-5 seconds

### Phone Number Validation (Sri Lanka)

**Valid Formats:**
- 07X XXX XXXX (10 digits)
- +947X XXX XXXX (with country code)
- 007X XXX XXXX (international format)

**Operators:**
- 070: Mobitel
- 071: Mobitel
- 072: Hutch
- 075: Airtel
- 076: Dialog
- 077: Dialog
- 078: Hutch

### Expected Outcome
```python
# In PaymentService class

SUPPORTED_MOBILE_PROVIDERS = ['FRIMI', 'GENIE', 'EZCASH', 'PAYHERE_QR']

@transaction.atomic
def process_mobile_payment(self, amount, mobile_provider, phone_number, reference_number=None):
    """
    Process mobile payment (FriMi, Genie, eZ Cash, etc.).
    
    Args:
        amount (Decimal): Payment amount
        mobile_provider (str): Mobile payment provider (FRIMI, GENIE, EZCASH, PAYHERE_QR)
        phone_number (str): Customer phone number (07xxxxxxxx)
        reference_number (str, optional): Transaction reference if already available
        
    Returns:
        POSPayment: Payment record (may be PENDING awaiting OTP)
        
    Raises:
        ValueError: If validation fails
        
    Example:
        >>> payment = service.process_mobile_payment(
        ...     amount=Decimal('1500.00'),
        ...     mobile_provider='FRIMI',
        ...     phone_number='0771234567'
        ... )
        >>> print(payment.status)
        PENDING  # Waiting for customer OTP
    """
    # Validate amount
    if not amount or amount <= 0:
        raise ValueError("Payment amount must be positive")
    
    remaining = self.get_remaining_amount()
    if amount > remaining:
        raise ValueError(
            f"Payment amount (LKR {amount}) exceeds remaining balance (LKR {remaining})"
        )
    
    # Validate provider
    if mobile_provider not in self.SUPPORTED_MOBILE_PROVIDERS:
        raise ValueError(
            f"Unsupported mobile provider: {mobile_provider}. "
            f"Supported: {', '.join(self.SUPPORTED_MOBILE_PROVIDERS)}"
        )
    
    # Validate phone number (Sri Lankan format)
    if not phone_number or not phone_number.startswith('07') or len(phone_number) != 10:
        raise ValueError(
            "Invalid phone number. Must be Sri Lankan format: 07XXXXXXXX"
        )
    
    # Create pending payment record
    masked_phone = phone_number[:3] + 'XXXX' + phone_number[-3:]
    payment = self._create_payment_record(
        method=PAYMENT_METHOD_MOBILE,
        amount=amount,
        status=PAYMENT_STATUS_PENDING,
        reference_number=reference_number,
        notes=f"Mobile: {mobile_provider}, Phone: {masked_phone}"
    )
    
    try:
        # Call mobile provider API
        # TODO: Implement actual provider integrations
        provider_result = self._call_mobile_provider_api(
            mobile_provider, amount, phone_number
        )
        
        if provider_result['status'] == 'COMPLETED':
            # Instant confirmation (rare)
            payment.status = PAYMENT_STATUS_COMPLETED
            payment.reference_number = provider_result['reference_number']
            payment.paid_at = timezone.now()
        elif provider_result['status'] == 'PENDING':
            # Awaiting OTP (most common)
            payment.status = PAYMENT_STATUS_PENDING
            payment.reference_number = provider_result.get('reference_number')
            payment.notes += f"\nAwaiting OTP confirmation"
        else:
            # Failed
            payment.status = PAYMENT_STATUS_FAILED
            payment.failed_at = timezone.now()
            payment.notes += f"\nError: {provider_result.get('message', 'Unknown error')}"
        
        payment.gateway_response = str(provider_result)
        payment.save()
        
    except Exception as e:
        payment.status = PAYMENT_STATUS_FAILED
        payment.notes += f"\nException: {str(e)}"
        payment.failed_at = timezone.now()
        payment.save()
        raise
    
    payment.refresh_from_db()
    return payment

def _call_mobile_provider_api(self, provider, amount, phone_number):
    """
    Placeholder for mobile provider API integration.
    TODO: Implement actual provider APIs
    
    - FriMi: Sampath Bank API
    - Genie: Dialog API
    - eZ Cash: eZ Cash API
    - PayHere: QR/Deep link
    """
    # Placeholder
    import random
    
    # Most mobile payments start as PENDING (OTP required)
    status = random.choice(['PENDING', 'PENDING', 'COMPLETED', 'FAILED'])
    
    if status == 'COMPLETED':
        return {
            'status': 'COMPLETED',
            'reference_number': f'{provider[:2]}{random.randint(100000000, 999999999)}',
            'message': 'Payment confirmed'
        }
    elif status == 'PENDING':
        return {
            'status': 'PENDING',
            'reference_number': f'{provider[:2]}{random.randint(100000000, 999999999)}',
            'message': 'OTP sent to customer. Awaiting confirmation.'
        }
    else:
        return {
            'status': 'FAILED',
            'message': 'Payment declined by customer'
        }

@transaction.atomic
def confirm_mobile_payment_otp(self, payment_id, otp_code):
    """
    Confirm mobile payment after customer enters OTP.
    
    Args:
        payment_id (int): POSPayment ID
        otp_code (str): OTP entered by customer
        
    Returns:
        POSPayment: Updated payment record
    """
    payment = POSPayment.objects.get(id=payment_id)
    
    if payment.status != PAYMENT_STATUS_PENDING:
        raise ValueError(f"Payment is not pending. Current status: {payment.status}")
    
    # Verify OTP with provider
    # TODO: Implement actual OTP verification
    otp_valid = True  # Placeholder
    
    if otp_valid:
        payment.status = PAYMENT_STATUS_COMPLETED
        payment.paid_at = timezone.now()
        payment.notes += "\nOTP confirmed"
    else:
        payment.status = PAYMENT_STATUS_FAILED
        payment.failed_at = timezone.now()
        payment.notes += "\nInvalid OTP"
    
    payment.save()
    return payment
```

### Verification Checklist
- [ ] `process_mobile_payment` method implemented
- [ ] SUPPORTED_MOBILE_PROVIDERS constant defined
- [ ] Provider validation implemented
- [ ] Phone number validation (Sri Lankan format)
- [ ] Phone number masking for privacy
- [ ] PENDING status for OTP scenarios
- [ ] `confirm_mobile_payment_otp` method added
- [ ] Mobile provider API placeholder created
- [ ] Comprehensive docstring with examples

---

## Task 66: Implement process_store_credit

### Overview
Implement store credit payment processing, allowing customers to use their account balance for purchases.

### Dependencies
- Task 62: Create PaymentService
- Customer model with credit balance field (assumed to exist)

### Instructions

1. **Open PaymentService file**
   - Navigate to `apps/pos/payment/services/payment_service.py`
   - Locate PaymentService class

2. **Add process_store_credit method**
   - Method name: `process_store_credit`
   - Parameters: `amount`, `customer` (optional, can use cart.customer)
   - Returns: POSPayment instance
   - Decorator: `@transaction.atomic`

3. **Validate customer exists**
   - Customer must be associated with cart
   - If customer parameter provided, use it; else use cart.customer
   - Raise ValueError if no customer

4. **Validate customer has store credit**
   - Check customer.store_credit_balance (or similar field)
   - Must have sufficient balance >= amount
   - Raise ValueError if insufficient credit

5. **Validate payment amount**
   - Amount must be positive
   - Amount must not exceed remaining cart balance
   - Amount must not exceed customer credit balance

6. **Deduct from customer balance**
   - Reduce customer.store_credit_balance by amount
   - Save customer record
   - Use F() expression for atomic update

7. **Create payment record**
   - Method: PAYMENT_METHOD_STORE_CREDIT
   - Status: PAYMENT_STATUS_COMPLETED (instant)
   - Store customer ID in notes
   - Set paid_at timestamp

8. **Add note about credit used**
   - Include previous balance and new balance in notes
   - Helps with audit trail

### Store Credit Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│        process_store_credit() Flow                      │
└────────────────────────────────────────────────────────┘

    [Input: amount, customer]
             │
             ▼
    ┌─────────────────────┐
    │ Validate Customer   │
    │ - Exists            │
    │ - Has account       │
    └─────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Check Credit        │
    │ - Balance >= amount │
    └─────────────────────┘
             │
        ┌────┴────┐
        │         │
        ▼         ▼
    Sufficient  Insufficient
        │         │
        ▼         ▼
    ┌─────┐   ┌──────┐
    │Deduct│  │ Error │
    │Credit│  └──────┘
    └─────┘
        │
        ▼
    ┌─────────────────────┐
    │ Create Payment      │
    │ - STORE_CREDIT      │
    │ - COMPLETED         │
    └─────────────────────┘
        │
        ▼
    [Return: POSPayment]
```

### Store Credit Use Cases

**Scenario 1: Full Payment with Credit**
```
Cart Total: LKR 1,000.00
Customer Credit: LKR 2,500.00
Amount to Use: LKR 1,000.00

Result:
- Payment: LKR 1,000.00 (COMPLETED)
- New Credit Balance: LKR 1,500.00
```

**Scenario 2: Partial Payment with Credit**
```
Cart Total: LKR 3,000.00
Customer Credit: LKR 800.00
Amount to Use: LKR 800.00

Result:
- Payment: LKR 800.00 (COMPLETED)
- New Credit Balance: LKR 0.00
- Remaining Cart: LKR 2,200.00 (need another payment)
```

**Scenario 3: Insufficient Credit**
```
Cart Total: LKR 1,500.00
Customer Credit: LKR 500.00
Amount Requested: LKR 1,500.00

Result:
- Error: Insufficient store credit
- Suggest: Use LKR 500.00 credit + another payment method
```

### Sri Lankan Store Credit Context

**When Store Credit is Issued:**
- Product returns/refunds
- Customer complaints (goodwill gesture)
- Loyalty rewards
- Prepaid store cards
- Business accounts (B2B credit terms)

**Credit Management:**
- Track issue date
- May have expiry date (e.g., 6 months)
- Non-transferable to other customers
- Some stores allow gifting

**Reporting:**
- Outstanding credit liability
- Credit redemption rates
- Expired unused credit

### Expected Outcome
```python
# In PaymentService class

@transaction.atomic
def process_store_credit(self, amount, customer=None):
    """
    Process payment using customer store credit balance.
    
    Args:
        amount (Decimal): Amount to pay using store credit
        customer: Customer object (optional, uses cart.customer if not provided)
        
    Returns:
        POSPayment: Payment record with credit deducted
        
    Raises:
        ValueError: If customer not found, insufficient credit, or invalid amount
        
    Example:
        >>> payment = service.process_store_credit(amount=Decimal('500.00'))
        >>> print(f"New balance: LKR {payment.cart.customer.store_credit_balance}")
        New balance: LKR 1500.00
    """
    # Get customer
    if not customer:
        customer = self.cart.customer
    
    if not customer:
        raise ValueError(
            "Customer is required for store credit payment. "
            "Please associate customer with cart first."
        )
    
    # Validate amount
    if not amount or amount <= 0:
        raise ValueError("Payment amount must be positive")
    
    remaining = self.get_remaining_amount()
    if amount > remaining:
        raise ValueError(
            f"Payment amount (LKR {amount}) exceeds remaining balance (LKR {remaining})"
        )
    
    # Check customer credit balance
    if not hasattr(customer, 'store_credit_balance'):
        raise ValueError("Customer does not have store credit enabled")
    
    if customer.store_credit_balance < amount:
        raise ValueError(
            f"Insufficient store credit. Available: LKR {customer.store_credit_balance}, "
            f"Required: LKR {amount}"
        )
    
    # Store old balance for notes
    old_balance = customer.store_credit_balance
    
    # Deduct from customer credit balance (atomic update)
    from django.db.models import F
    customer.__class__.objects.filter(pk=customer.pk).update(
        store_credit_balance=F('store_credit_balance') - amount
    )
    customer.refresh_from_db()
    
    new_balance = customer.store_credit_balance
    
    # Create payment record
    payment = self._create_payment_record(
        method=PAYMENT_METHOD_STORE_CREDIT,
        amount=amount,
        status=PAYMENT_STATUS_COMPLETED,  # Store credit is instant
        paid_at=timezone.now(),
        notes=(
            f"Store credit used by {customer.name or customer.email}\n"
            f"Previous balance: LKR {old_balance}\n"
            f"Amount used: LKR {amount}\n"
            f"New balance: LKR {new_balance}"
        )
    )
    
    return payment
```

### Verification Checklist
- [ ] `process_store_credit` method implemented
- [ ] Customer validation (exists and has credit enabled)
- [ ] Credit balance validation (sufficient funds)
- [ ] Amount validation (positive, not exceeding remaining)
- [ ] Atomic balance deduction using F() expression
- [ ] Payment created with COMPLETED status
- [ ] Notes include old/new balance for audit
- [ ] Method decorated with @transaction.atomic
- [ ] Comprehensive docstring

---

## Task 67: Implement split_payment

### Overview
Implement split payment functionality allowing customers to pay using multiple payment methods for a single cart.

### Dependencies
- Task 63: Implement process_cash_payment
- Task 64: Implement process_card_payment
- Task 65: Implement process_mobile_payment
- Task 66: Implement process_store_credit

### Instructions

1. **Open PaymentService file**
   - Navigate to `apps/pos/payment/services/payment_service.py`
   - Locate PaymentService class

2. **Add split_payment method**
   - Method name: `split_payment`
   - Parameters: `payment_splits` (list of dict)
   - Returns: List of POSPayment instances
   - Decorator: `@transaction.atomic`

3. **Define payment_splits structure**
   - Each split is a dict with: method, amount, and method-specific parameters
   - Example: `{'method': 'CASH', 'amount': 1000, 'amount_tendered': 1000}`
   - Example: `{'method': 'CARD', 'amount': 1500, 'card_details': {...}}`

4. **Validate payment_splits parameter**
   - Must be a non-empty list
   - Each split must have 'method' and 'amount'
   - Sum of all split amounts must equal remaining cart balance
   - Raise ValueError if validation fails

5. **Validate total of splits**
   - Calculate total of all split amounts
   - Must equal get_remaining_amount()
   - Can't be over or under

6. **Process each payment split**
   - Iterate through payment_splits list
   - Call appropriate payment method based on split['method']
   - CASH → process_cash_payment
   - CARD → process_card_payment
   - MOBILE → process_mobile_payment
   - STORE_CREDIT → process_store_credit

7. **Collect results**
   - Store each created payment in results list
   - If any payment fails, rollback entire transaction
   - Return list of all successful payments

8. **Add validation for partial completion**
   - All splits must succeed for transaction to complete
   - If one fails, entire split payment fails
   - User must retry or use different split

### Split Payment Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│           split_payment() Flow                          │
└────────────────────────────────────────────────────────┘

    [Input: list of payment splits]
                │
                ▼
    ┌──────────────────────────┐
    │ Validate Splits          │
    │ - Non-empty list         │
    │ - Each has method+amount │
    │ - Total = remaining      │
    └──────────────────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │ Process Split 1          │
    │ (e.g., CASH: 2000)       │
    └──────────────────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │ Process Split 2          │
    │ (e.g., CARD: 3000)       │
    └──────────────────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │ Process Split 3          │
    │ (e.g., CREDIT: 500)      │
    └──────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
    All Success    Any Failed
        │               │
        ▼               ▼
    ┌──────┐      ┌─────────┐
    │Commit│      │Rollback │
    │      │      │All      │
    └──────┘      └─────────┘
        │               │
        └───────┬───────┘
                ▼
    [Return: List of POSPayment]
```

### Split Payment Scenarios

**Scenario 1: Cash + Card**
```
Cart Total: LKR 5,000.00

Split:
1. CASH: LKR 2,000.00 (tendered: 2,000)
2. CARD: LKR 3,000.00 (Visa ending 1234)

Result:
- Payment 1: CASH, LKR 2,000, change: 0
- Payment 2: CARD, LKR 3,000, auth: AUTH123
- Total Paid: LKR 5,000.00 ✓
```

**Scenario 2: Credit + Cash**
```
Cart Total: LKR 1,800.00
Customer Credit: LKR 500.00

Split:
1. STORE_CREDIT: LKR 500.00
2. CASH: LKR 1,300.00 (tendered: 1,500)

Result:
- Payment 1: CREDIT, LKR 500, new balance: 0
- Payment 2: CASH, LKR 1,300, change: 200
- Total Paid: LKR 1,800.00 ✓
```

**Scenario 3: Three-Way Split**
```
Cart Total: LKR 10,000.00

Split:
1. CASH: LKR 3,000.00
2. CARD: LKR 5,000.00
3. MOBILE: LKR 2,000.00 (FriMi)

Result:
- Payment 1: CASH, LKR 3,000
- Payment 2: CARD, LKR 5,000
- Payment 3: MOBILE, LKR 2,000
- Total Paid: LKR 10,000.00 ✓
```

**Scenario 4: Invalid Total (Error)**
```
Cart Total: LKR 5,000.00

Split:
1. CASH: LKR 2,000.00
2. CARD: LKR 2,500.00

Total: LKR 4,500.00
Error: Split total (4,500) doesn't match cart total (5,000)
```

### Sri Lankan Split Payment Context

**Common Split Scenarios:**
- Cash (for small amount) + Card (for bulk)
- Store credit + Cash (use available credit first)
- Card + Mobile (company card + personal payment)
- Multiple cards (different bank limits)

**Business Rules:**
- Minimum split amount: LKR 100 (configurable)
- Maximum splits per transaction: 5 (configurable)
- Each split must be > 0
- Total must exactly match cart total

### Expected Outcome
```python
# In PaymentService class

@transaction.atomic
def split_payment(self, payment_splits):
    """
    Process payment using multiple payment methods (split payment).
    
    Args:
        payment_splits (list): List of payment split dictionaries
            Each dict must contain:
            - 'method': Payment method constant
            - 'amount': Amount for this split
            - Additional method-specific parameters
            
    Returns:
        list: List of created POSPayment instances
        
    Raises:
        ValueError: If validation fails or any payment fails
        
    Example:
        >>> splits = [
        ...     {'method': 'CASH', 'amount': Decimal('2000'), 'amount_tendered': Decimal('2000')},
        ...     {'method': 'CARD', 'amount': Decimal('3000'), 'card_details': {'card_type': 'VISA', 'last4': '1234'}}
        ... ]
        >>> payments = service.split_payment(splits)
        >>> print(f"Total payments: {len(payments)}")
        Total payments: 2
    """
    # Validate payment_splits
    if not payment_splits or not isinstance(payment_splits, list):
        raise ValueError("payment_splits must be a non-empty list")
    
    if len(payment_splits) < 2:
        raise ValueError("Split payment requires at least 2 payment methods")
    
    # Validate each split has required fields
    for i, split in enumerate(payment_splits):
        if 'method' not in split:
            raise ValueError(f"Split {i+1} missing 'method' field")
        if 'amount' not in split:
            raise ValueError(f"Split {i+1} missing 'amount' field")
        if split['amount'] <= 0:
            raise ValueError(f"Split {i+1} amount must be positive")
    
    # Validate total of splits
    total_splits = sum(Decimal(str(split['amount'])) for split in payment_splits)
    remaining = self.get_remaining_amount()
    
    if total_splits != remaining:
        raise ValueError(
            f"Split payment total (LKR {total_splits}) does not match "
            f"remaining cart balance (LKR {remaining})"
        )
    
    # Process each payment split
    payments = []
    
    try:
        for split in payment_splits:
            method = split['method']
            amount = Decimal(str(split['amount']))
            
            if method == PAYMENT_METHOD_CASH:
                amount_tendered = split.get('amount_tendered')
                if not amount_tendered:
                    amount_tendered = amount  # Exact change
                payment = self.process_cash_payment(
                    amount_tendered=Decimal(str(amount_tendered))
                )
            
            elif method == PAYMENT_METHOD_CARD:
                card_details = split.get('card_details', {})
                payment = self.process_card_payment(
                    amount=amount,
                    card_details=card_details
                )
                # Check if card payment succeeded
                if payment.status != PAYMENT_STATUS_COMPLETED:
                    raise ValueError(f"Card payment failed: {payment.notes}")
            
            elif method == PAYMENT_METHOD_MOBILE:
                mobile_provider = split.get('mobile_provider')
                phone_number = split.get('phone_number')
                payment = self.process_mobile_payment(
                    amount=amount,
                    mobile_provider=mobile_provider,
                    phone_number=phone_number
                )
                # Mobile may be PENDING (OTP), allow it
                if payment.status == PAYMENT_STATUS_FAILED:
                    raise ValueError(f"Mobile payment failed: {payment.notes}")
            
            elif method == PAYMENT_METHOD_STORE_CREDIT:
                customer = split.get('customer')
                payment = self.process_store_credit(
                    amount=amount,
                    customer=customer
                )
            
            else:
                raise ValueError(f"Unsupported payment method in split: {method}")
            
            payments.append(payment)
        
        return payments
    
    except Exception as e:
        # If any payment fails, transaction.atomic will rollback all
        raise ValueError(f"Split payment failed: {str(e)}")
```

### Verification Checklist
- [ ] `split_payment` method implemented
- [ ] payment_splits parameter validation
- [ ] Total amount validation (must equal remaining)
- [ ] Each split routed to correct payment method
- [ ] All splits processed in single transaction
- [ ] Rollback on any failure
- [ ] Returns list of successful payments
- [ ] Method decorated with @transaction.atomic
- [ ] Comprehensive docstring with example

---

## Task 68: Create Payment Validation

### Overview
Create validation methods to ensure payment integrity and prevent common payment errors.

### Dependencies
- Task 62: Create PaymentService
- All payment processing methods implemented

### Instructions

1. **Open PaymentService file**
   - Navigate to `apps/pos/payment/services/payment_service.py`
   - Locate PaymentService class

2. **Add validate_payment_complete method**
   - Checks if cart is fully paid
   - Sum all COMPLETED payments
   - Compare to cart total
   - Return True if fully paid, False otherwise

3. **Add validate_no_overpayment method**
   - Ensures total payments don't exceed cart total
   - Should be called before adding new payment
   - Raises ValueError if overpayment would occur

4. **Add validate_payment_amount method**
   - Validates a proposed payment amount
   - Checks: positive, not exceeding remaining
   - Returns True if valid
   - Raises ValueError with clear message if invalid

5. **Add get_payment_summary method**
   - Returns dict with payment breakdown
   - Total completed, total pending, total failed
   - Remaining balance
   - Payment count by method

6. **Add can_complete_cart method**
   - Checks if cart can be completed
   - All payments must be COMPLETED (no PENDING)
   - Total payments must equal cart total
   - Returns bool

7. **Add get_failed_payments method**
   - Returns list of failed payments for retry
   - Useful for retry logic

8. **Add validate_refund_eligibility method**
   - Check if payment can be refunded
   - Must be COMPLETED status
   - Must have valid authorization codes (for cards)
   - Within refund window (configurable days)

### Payment Validation Flow

```
┌────────────────────────────────────────────────────────┐
│          Payment Validation Checks                      │
└────────────────────────────────────────────────────────┘

Before Adding Payment:
├── validate_payment_amount()
│   ├── Amount > 0?
│   ├── Amount <= remaining?
│   └── Cart status OK?
│
└── validate_no_overpayment()
    └── Would this cause overpayment?

Before Completing Cart:
├── validate_payment_complete()
│   ├── Sum(completed) == total?
│   └── No pending payments?
│
└── can_complete_cart()
    ├── All payments COMPLETED?
    ├── Total matches cart?
    └── Cart has items?

Before Refund:
└── validate_refund_eligibility()
    ├── Payment COMPLETED?
    ├── Within refund window?
    └── Has valid auth codes?
```

### Expected Outcome
```python
# In PaymentService class

def validate_payment_complete(self):
    """
    Check if cart is fully paid.
    
    Returns:
        bool: True if total completed payments equal cart total
    """
    from django.db.models import Sum
    
    completed_total = self.cart.payments.filter(
        status=PAYMENT_STATUS_COMPLETED
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    
    return completed_total >= self.cart.total

def validate_no_overpayment(self, proposed_amount):
    """
    Ensure adding this payment won't cause overpayment.
    
    Args:
        proposed_amount (Decimal): Amount to be added
        
    Raises:
        ValueError: If overpayment would occur
    """
    remaining = self.get_remaining_amount()
    
    if proposed_amount > remaining:
        raise ValueError(
            f"Payment amount (LKR {proposed_amount}) would exceed "
            f"remaining balance (LKR {remaining})"
        )

def validate_payment_amount(self, amount):
    """
    Validate a proposed payment amount.
    
    Args:
        amount (Decimal): Proposed payment amount
        
    Returns:
        bool: True if valid
        
    Raises:
        ValueError: If amount is invalid
    """
    if not amount or amount <= 0:
        raise ValueError("Payment amount must be positive")
    
    self.validate_no_overpayment(amount)
    return True

def get_payment_summary(self):
    """
    Get summary of all payments for this cart.
    
    Returns:
        dict: Payment summary with totals and breakdown
    """
    from django.db.models import Sum, Count
    
    payments = self.cart.payments.all()
    
    summary = {
        'cart_total': self.cart.total,
        'total_completed': Decimal('0.00'),
        'total_pending': Decimal('0.00'),
        'total_failed': Decimal('0.00'),
        'remaining': self.get_remaining_amount(),
        'payment_count': payments.count(),
        'by_method': {},
        'by_status': {}
    }
    
    # Sum by status
    for status in [PAYMENT_STATUS_COMPLETED, PAYMENT_STATUS_PENDING, PAYMENT_STATUS_FAILED]:
        total = payments.filter(status=status).aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        if status == PAYMENT_STATUS_COMPLETED:
            summary['total_completed'] = total
        elif status == PAYMENT_STATUS_PENDING:
            summary['total_pending'] = total
        elif status == PAYMENT_STATUS_FAILED:
            summary['total_failed'] = total
        
        summary['by_status'][status] = total
    
    # Count by method
    method_counts = payments.values('method').annotate(
        count=Count('id'),
        total=Sum('amount')
    )
    
    for item in method_counts:
        summary['by_method'][item['method']] = {
            'count': item['count'],
            'total': item['total'] or Decimal('0.00')
        }
    
    return summary

def can_complete_cart(self):
    """
    Check if cart can be completed (all payments settled).
    
    Returns:
        bool: True if cart can be completed
    """
    # No pending payments allowed
    if self.cart.payments.filter(status=PAYMENT_STATUS_PENDING).exists():
        return False
    
    # Must be fully paid
    if not self.validate_payment_complete():
        return False
    
    return True

def get_failed_payments(self):
    """
    Get list of failed payments for potential retry.
    
    Returns:
        QuerySet: Failed payments
    """
    return self.cart.payments.filter(status=PAYMENT_STATUS_FAILED)

def validate_refund_eligibility(self, payment, refund_days=30):
    """
    Check if payment is eligible for refund.
    
    Args:
        payment (POSPayment): Payment to check
        refund_days (int): Days within which refund is allowed
        
    Returns:
        tuple: (bool, str) - (is_eligible, reason)
    """
    from django.utils import timezone
    from datetime import timedelta
    
    # Must be completed
    if payment.status != PAYMENT_STATUS_COMPLETED:
        return False, f"Payment not completed. Status: {payment.status}"
    
    # Check refund window
    if payment.paid_at:
        refund_deadline = payment.paid_at + timedelta(days=refund_days)
        if timezone.now() > refund_deadline:
            return False, f"Refund window expired. Deadline was {refund_deadline}"
    
    # Card payments need valid authorization
    if payment.method == PAYMENT_METHOD_CARD:
        if not payment.authorization_code:
            return False, "Card payment missing authorization code"
    
    return True, "Eligible for refund"
```

### Verification Checklist
- [ ] `validate_payment_complete` method checks full payment
- [ ] `validate_no_overpayment` prevents overpayment
- [ ] `validate_payment_amount` validates proposed amounts
- [ ] `get_payment_summary` provides comprehensive summary
- [ ] `can_complete_cart` checks if cart ready to complete
- [ ] `get_failed_payments` returns failed payments
- [ ] `validate_refund_eligibility` checks refund rules
- [ ] All methods have clear docstrings
- [ ] Return types documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 62 | Create PaymentService | PaymentService class with base structure |
| 63 | Implement process_cash_payment | Cash payment with change calculation |
| 64 | Implement process_card_payment | Card payment with gateway integration |
| 65 | Implement process_mobile_payment | Mobile payment (FriMi, Genie, eZ Cash) |
| 66 | Implement process_store_credit | Store credit payment processing |
| 67 | Implement split_payment | Multi-method payment support |
| 68 | Create payment validation | Payment integrity validation |

### PaymentService Methods Summary

```
PaymentService:
├── Initialization
│   ├── __init__(cart, user)
│   └── _validate_cart()
│
├── Payment Processing
│   ├── process_cash_payment(amount_tendered)
│   ├── process_card_payment(amount, card_details)
│   ├── process_mobile_payment(amount, provider, phone)
│   ├── process_store_credit(amount, customer)
│   └── split_payment(payment_splits)
│
├── Validation
│   ├── validate_payment_complete()
│   ├── validate_no_overpayment(amount)
│   ├── validate_payment_amount(amount)
│   ├── can_complete_cart()
│   └── validate_refund_eligibility(payment)
│
├── Queries
│   ├── get_remaining_amount()
│   ├── get_cart_payments(status)
│   ├── get_payment_summary()
│   └── get_failed_payments()
│
└── Helpers
    ├── _create_payment_record(...)
    ├── _call_payment_gateway(...)
    └── _call_mobile_provider_api(...)
```

### Payment Methods Supported
- **CASH:** Instant completion with change calculation
- **CARD:** Gateway integration with authorization codes
- **MOBILE:** FriMi, Genie, eZ Cash with OTP support
- **STORE_CREDIT:** Customer balance deduction
- **SPLIT:** Multiple methods per transaction

### Files Created/Modified
```
apps/pos/payment/services/
└── payment_service.py           # NEW (Tasks 62-68)
```

### Next Steps
1. **Test PaymentService** with unit tests
2. **Configure payment gateways** (PayHere, bank APIs)
3. Proceed to [03_Tasks-69-74_Transaction-Completion.md](03_Tasks-69-74_Transaction-Completion.md) to implement transaction completion

---

## Notes for AI Agents

1. **Transaction Safety:** All payment methods use @transaction.atomic
2. **Gateway Placeholders:** Replace _call_payment_gateway() and _call_mobile_provider_api() with actual implementations
3. **OTP Handling:** Mobile payments may remain PENDING awaiting customer OTP
4. **Split Payment:** Atomic - all splits must succeed or all rollback
5. **Validation:** Always validate before processing payment
6. **Sri Lankan Context:** FriMi, Genie, eZ Cash are popular mobile payment methods
7. **Change Calculation:** Auto-calculated for cash payments
8. **Store Credit:** Uses F() expression for atomic balance updates
9. **Error Messages:** Clear, actionable error messages for validation failures
10. **Audit Trail:** gateway_response field stores complete API responses
