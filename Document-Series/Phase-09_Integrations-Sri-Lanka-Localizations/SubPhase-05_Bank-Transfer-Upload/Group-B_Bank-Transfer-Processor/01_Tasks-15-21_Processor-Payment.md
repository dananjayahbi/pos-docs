# Tasks 15-21: Processor Creation and Payment Methods

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** B - Bank Transfer Processor  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-A_Bank-Account-Configuration/02_Tasks-08-14_Config-Verify.md](../Group-A_Bank-Account-Configuration/02_Tasks-08-14_Config-Verify.md)
- **→ Next Document:** [02_Tasks-22-28_Expiry-Refund-Verify.md](02_Tasks-22-28_Expiry-Refund-Verify.md)

---

## Document Overview

This document covers the creation of the BankTransferProcessor class and its core payment methods. It establishes the processor that handles manual bank transfer payments, including processor registration, payment initiation with pending transaction creation, bank details return, and manual verification/confirmation flows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create BankTransferProcessor | High | 45 min |
| 16 | Create Processor Registration | Low | 15 min |
| 17 | Create initiate_payment Method | Medium | 35 min |
| 18 | Create Pending Transaction | Medium | 30 min |
| 19 | Create Payment Intent Data | Low | 20 min |
| 20 | Create verify_payment Method | Medium | 25 min |
| 21 | Create Confirm Payment | Medium | 30 min |

---

## Task 15: Create BankTransferProcessor

### Overview
Create the BankTransferProcessor class that extends the PaymentProcessor abstract base class. This processor handles manual bank transfer payments where customers are shown bank account details, make their payment offline, and upload proof of payment for admin verification.

### Dependencies
- Phase-03 (Core Backend Infrastructure) must be complete
- Payment processing framework must exist
- PaymentProcessor ABC must be defined
- PaymentGateway enum must include BANK_TRANSFER

### Instructions

1. **Navigate to payments processors directory**
   - Go to `backend/apps/payments/processors/` directory
   - Create subdirectory named `bank_transfer/`
   - Add `__init__.py` file to make it a package

2. **Create processor.py file**
   - Create `processor.py` in `bank_transfer/` directory
   - This will contain the BankTransferProcessor class
   - Import necessary base classes and types

3. **Import required dependencies**
   - Import PaymentProcessor from processors.base
   - Import PaymentGateway enum
   - Import PaymentIntent, PaymentResult, PaymentTransaction models
   - Import BankAccount, BankTransferConfig models
   - Import typing for type hints (Dict, List, Optional)

4. **Define BankTransferProcessor class**
   - Create class that extends PaymentProcessor
   - Set gateway_type class attribute to PaymentGateway.BANK_TRANSFER
   - Override abstract methods from parent class
   - Add __init__ method if custom initialization needed

5. **Implement gateway_type property**
   - Define as class-level constant
   - Set value to PaymentGateway.BANK_TRANSFER
   - Used by factory for processor registration

6. **Add processor configuration**
   - Create method to load BankTransferConfig for tenant
   - Cache configuration to avoid repeated DB queries
   - Handle missing configuration gracefully

7. **Add helper methods**
   - Create _get_active_bank_accounts() method
   - Create _format_bank_details() method
   - Create _calculate_expiry() method
   - These support main payment flow methods

### Class Structure

```
BankTransferProcessor
├── gateway_type: PaymentGateway.BANK_TRANSFER
├── __init__(self, tenant)
├── initiate_payment(payment_intent) → PaymentResult
├── verify_payment(transaction_id) → PaymentResult
├── confirm_payment(transaction_id, admin_id) → PaymentResult
├── reject_payment(transaction_id, reason) → PaymentResult
├── process_refund(transaction_id, amount) → RefundResult
├── _get_active_bank_accounts() → List[BankAccount]
├── _format_bank_details(accounts) → Dict
└── _calculate_expiry() → datetime
```

### Processor Characteristics

| Attribute | Value | Purpose |
|-----------|-------|---------|
| gateway_type | BANK_TRANSFER | Identifies processor type |
| is_online | False | Manual offline payment |
| requires_redirect | False | No external redirect needed |
| supports_refunds | True | Manual refund processing |
| requires_verification | True | Admin must verify payment |

### Payment Flow Overview

```
Customer                    System                      Admin
    │                          │                          │
    │──initiate_payment()──────>│                          │
    │                          │                          │
    │<─Bank Details + Ref──────│                          │
    │                          │                          │
    │ [Offline Payment]        │                          │
    │                          │                          │
    │──Upload Proof──────────> │                          │
    │                          │                          │
    │                          │────Notification──────────>│
    │                          │                          │
    │                          │<──verify_payment()───────│
    │                          │                          │
    │                          │<──confirm_payment()──────│
    │                          │                          │
    │<─Payment Confirmed───────│                          │
    │                          │                          │
```

### Expected Outcome
- BankTransferProcessor class defined
- Extends PaymentProcessor ABC properly
- Gateway type configured correctly
- Helper methods created for common operations
- Ready for method implementation

### Verification Checklist
- [ ] `backend/apps/payments/processors/bank_transfer/` directory created
- [ ] `__init__.py` file exists in directory
- [ ] `processor.py` file created
- [ ] BankTransferProcessor class defined
- [ ] Extends PaymentProcessor correctly
- [ ] gateway_type set to BANK_TRANSFER
- [ ] Helper methods defined
- [ ] Proper imports included

---

## Task 16: Create Processor Registration

### Overview
Register the BankTransferProcessor with the ProcessorFactory to enable dynamic processor selection based on payment gateway type. This allows the payment system to automatically instantiate the correct processor when bank transfer payment is selected.

### Dependencies
- Task 15: Create BankTransferProcessor
- ProcessorFactory must be implemented
- Factory registration mechanism must exist

### Instructions

1. **Locate ProcessorFactory**
   - Find ProcessorFactory in payments/processors/factory.py
   - Review registration mechanism
   - Understand how processors are retrieved

2. **Import BankTransferProcessor**
   - Add import statement in factory.py
   - Import from processors.bank_transfer.processor
   - Ensure proper module path

3. **Register processor with factory**
   - Use ProcessorFactory.register() method
   - Pass PaymentGateway.BANK_TRANSFER as key
   - Pass BankTransferProcessor class as value
   - Registration typically done at module load time

4. **Update __init__.py**
   - Edit `processors/bank_transfer/__init__.py`
   - Export BankTransferProcessor class
   - Makes import cleaner: `from processors.bank_transfer import BankTransferProcessor`

5. **Verify factory mapping**
   - Ensure BANK_TRANSFER key maps to processor
   - Test factory can instantiate processor
   - Check no duplicate registrations

6. **Add processor to factory tests**
   - Create test for factory registration
   - Test factory.get_processor(BANK_TRANSFER) returns correct class
   - Test processor instantiation with tenant

### Registration Approaches

| Approach | Implementation | When |
|----------|----------------|------|
| Decorator | @ProcessorFactory.register(BANK_TRANSFER) | Class definition |
| Explicit Call | ProcessorFactory.register(BANK_TRANSFER, BankTransferProcessor) | Module init |
| Auto-discovery | Factory scans processors directory | Factory initialization |

### Factory Registration Pattern

```python
# Option 1: Decorator Pattern
@ProcessorFactory.register(PaymentGateway.BANK_TRANSFER)
class BankTransferProcessor(PaymentProcessor):
    ...

# Option 2: Explicit Registration
ProcessorFactory.register(
    gateway_type=PaymentGateway.BANK_TRANSFER,
    processor_class=BankTransferProcessor
)

# Option 3: In __init__.py
from .processor import BankTransferProcessor
ProcessorFactory.register(PaymentGateway.BANK_TRANSFER, BankTransferProcessor)
```

### Factory Lookup Flow

```
Payment Request
    │
    ▼
Determine Gateway Type (BANK_TRANSFER)
    │
    ▼
ProcessorFactory.get_processor(BANK_TRANSFER)
    │
    ▼
Factory Returns BankTransferProcessor
    │
    ▼
Instantiate with Tenant
    │
    ▼
Ready for Payment Processing
```

### Registered Processors Map

| Gateway Type | Processor Class | Status |
|--------------|----------------|--------|
| CASH | CashProcessor | Registered |
| CARD | CardProcessor | Registered |
| BANK_TRANSFER | BankTransferProcessor | ✓ This Task |
| DIGITAL_WALLET | WalletProcessor | Future |

### Expected Outcome
- BankTransferProcessor registered with factory
- Factory can locate and instantiate processor
- Payment system can use bank transfer gateway
- Clean import structure established

### Verification Checklist
- [ ] BankTransferProcessor imported in factory
- [ ] Processor registered with factory
- [ ] Registration uses PaymentGateway.BANK_TRANSFER key
- [ ] `__init__.py` exports processor class
- [ ] Factory.get_processor(BANK_TRANSFER) works
- [ ] Processor instantiation successful
- [ ] No duplicate registrations

---

## Task 17: Create initiate_payment Method

### Overview
Implement the initiate_payment() method that handles the initial payment request. This method creates a pending transaction, retrieves active bank accounts, formats bank details with payment reference, calculates expiry time, and returns a PaymentResult with all necessary information for the customer to complete their payment.

### Dependencies
- Task 15: Create BankTransferProcessor
- Task 16: Create Processor Registration
- Group-A (BankAccount model) must be complete
- BankTransferConfig must exist

### Instructions

1. **Define method signature**
   - Method name: initiate_payment
   - Parameter: payment_intent (PaymentIntent object)
   - Return type: PaymentResult
   - Mark as async if using async pattern

2. **Validate payment intent**
   - Check payment_intent.amount > 0
   - Verify payment_intent.order exists
   - Validate tenant context
   - Raise appropriate errors if invalid

3. **Load tenant configuration**
   - Retrieve BankTransferConfig for current tenant
   - Get expiry_hours setting
   - Handle missing configuration (use defaults)
   - Check if bank transfer is enabled

4. **Retrieve active bank accounts**
   - Query BankAccount model
   - Filter by tenant and is_active=True
   - Order by display_order
   - Raise error if no accounts configured

5. **Calculate expiry datetime**
   - Use config.expiry_hours or default (24-48 hours)
   - Calculate: now + timedelta(hours=expiry_hours)
   - Ensure timezone-aware datetime
   - Store for transaction and display

6. **Generate payment reference**
   - Create unique reference for this payment
   - Format: BT-{order_id}-{timestamp}-{random}
   - Ensure uniqueness within tenant
   - Customer uses this for bank transfer reference

7. **Create pending transaction**
   - Call Task 18 implementation
   - Pass payment_intent, expiry, reference
   - Store transaction in database
   - Transaction status = PENDING

8. **Format bank details for response**
   - Call _format_bank_details() helper
   - Include account number, name, bank, branch, SWIFT
   - Add payment reference and amount
   - Add expiry datetime

9. **Create and return PaymentResult**
   - Set success=True
   - Set transaction_id from created transaction
   - Set status=PENDING
   - Include bank_details in metadata
   - Include payment reference and expiry

10. **Handle errors gracefully**
    - Catch database errors
    - Catch configuration errors
    - Return PaymentResult with success=False
    - Include error message in result

### Method Flow Diagram

```
initiate_payment(payment_intent)
    │
    ├─→ Validate Payment Intent
    │       │
    │       ├─→ Check amount > 0
    │       ├─→ Verify order exists
    │       └─→ Validate tenant
    │
    ├─→ Load Configuration
    │       │
    │       ├─→ Get BankTransferConfig
    │       ├─→ Get expiry_hours
    │       └─→ Check enabled status
    │
    ├─→ Retrieve Bank Accounts
    │       │
    │       ├─→ Query active accounts
    │       ├─→ Order by display_order
    │       └─→ Validate at least one exists
    │
    ├─→ Calculate Expiry
    │       │
    │       └─→ now + expiry_hours
    │
    ├─→ Generate Reference
    │       │
    │       └─→ BT-{order}-{time}-{rand}
    │
    ├─→ Create Transaction
    │       │
    │       ├─→ Status: PENDING
    │       ├─→ Store reference
    │       └─→ Store expiry
    │
    ├─→ Format Bank Details
    │       │
    │       ├─→ Account information
    │       ├─→ Payment reference
    │       └─→ Amount and expiry
    │
    └─→ Return PaymentResult
            │
            ├─→ success: True
            ├─→ status: PENDING
            ├─→ transaction_id
            └─→ metadata: bank_details
```

### Payment Intent Input

| Field | Type | Description |
|-------|------|-------------|
| order | Order | Related order object |
| amount | Decimal | Payment amount |
| currency | str | Currency code (LKR) |
| customer | Customer | Customer making payment |
| tenant | Tenant | Current tenant context |

### PaymentResult Output

| Field | Type | Value |
|-------|------|-------|
| success | bool | True |
| transaction_id | str | Generated transaction ID |
| status | str | PENDING |
| gateway_type | str | BANK_TRANSFER |
| metadata | dict | Bank details, reference, expiry |
| message | str | Instructions for customer |

### Bank Details Format

```python
{
    "accounts": [
        {
            "bank_name": "Bank of Ceylon",
            "account_number": "1234567890",
            "account_name": "LCC Pvt Ltd",
            "branch": "Colombo Main",
            "swift_code": "BCEYLKLX"
        },
        # ... more accounts
    ],
    "payment_reference": "BT-ORD123-20260131-ABC123",
    "amount": "15000.00",
    "currency": "LKR",
    "expires_at": "2026-02-01T15:30:00Z",
    "instructions": "Please use the payment reference..."
}
```

### Expected Outcome
- Functional initiate_payment method
- Creates pending transaction successfully
- Returns formatted bank details to customer
- Generates unique payment reference
- Calculates proper expiry time

### Verification Checklist
- [ ] Method signature correct with types
- [ ] Payment intent validation implemented
- [ ] Configuration loaded properly
- [ ] Active bank accounts retrieved
- [ ] Expiry datetime calculated
- [ ] Payment reference generated uniquely
- [ ] Pending transaction created (Task 18)
- [ ] Bank details formatted correctly
- [ ] PaymentResult returned with all fields
- [ ] Error handling implemented
- [ ] Timezone handling correct

---

## Task 18: Create Pending Transaction

### Overview
Create the logic to instantiate and save a PaymentTransaction with PENDING status when payment is initiated. This transaction records the payment attempt and stores all necessary information for later verification and confirmation.

### Dependencies
- Task 17: Create initiate_payment Method
- PaymentTransaction model must exist
- Transaction status enum must include PENDING

### Instructions

1. **Create transaction instantiation logic**
   - Use PaymentTransaction model
   - Set in initiate_payment method
   - Instantiate new transaction object

2. **Set required transaction fields**
   - tenant: Current tenant from payment_intent
   - order: payment_intent.order
   - amount: payment_intent.amount
   - currency: payment_intent.currency
   - gateway_type: PaymentGateway.BANK_TRANSFER
   - status: TransactionStatus.PENDING

3. **Set transaction reference**
   - transaction_reference: Generated payment reference
   - Unique identifier for this transaction
   - Used by customer when making payment

4. **Set expiry datetime**
   - expires_at: Calculated expiry datetime
   - Used by expiry checker to auto-expire
   - Display to customer as deadline

5. **Store payment intent data**
   - Store original payment_intent data if needed
   - May include customer info, metadata
   - Store in JSON field if available

6. **Set initial metadata**
   - Create metadata dict
   - Include bank accounts shown to customer
   - Include generation timestamp
   - Store any additional context

7. **Save transaction to database**
   - Call transaction.save()
   - Handle potential errors (duplicate reference, etc.)
   - Use transaction.atomic() if needed

8. **Generate transaction ID**
   - Use auto-generated ID or UUID
   - Return transaction.id or transaction.transaction_id
   - Store for reference in PaymentResult

9. **Create transaction history entry**
   - Log transaction creation event
   - Record status change to PENDING
   - Include timestamp and initiator

10. **Handle transaction creation errors**
    - Catch IntegrityError (duplicate reference)
    - Catch ValidationError (invalid data)
    - Log errors appropriately
    - Re-raise or return error result

### Transaction Fields

| Field | Value | Description |
|-------|-------|-------------|
| tenant | Current tenant | Multi-tenancy isolation |
| order | Related order | Associated order |
| amount | Payment amount | Transaction amount |
| currency | LKR | Currency code |
| gateway_type | BANK_TRANSFER | Payment method |
| status | PENDING | Initial status |
| transaction_reference | BT-{order}-{time}-{rand} | Unique reference |
| expires_at | now + expiry_hours | Auto-expiry deadline |
| metadata | JSON | Bank details, context |
| created_at | now() | Creation timestamp |
| updated_at | now() | Last update timestamp |

### Transaction Status Flow

```
┌─────────────┐
│   PENDING   │ ← Created in this task
└─────────────┘
       │
       ├──→ CONFIRMED (Task 21)
       ├──→ REJECTED (Task 22)
       └──→ EXPIRED (Task 24)
```

### Database Constraints

| Constraint | Purpose |
|------------|---------|
| Unique transaction_reference per tenant | Prevent duplicates |
| Foreign key to order | Data integrity |
| Check amount > 0 | Valid amounts |
| Not null on required fields | Data completeness |

### Transaction Creation Code Structure

```python
transaction = PaymentTransaction(
    tenant=self.tenant,
    order=payment_intent.order,
    amount=payment_intent.amount,
    currency=payment_intent.currency,
    gateway_type=PaymentGateway.BANK_TRANSFER,
    status=TransactionStatus.PENDING,
    transaction_reference=payment_reference,
    expires_at=expiry_datetime,
    metadata={
        'bank_accounts': formatted_accounts,
        'initiated_at': timezone.now().isoformat(),
        'customer_id': payment_intent.customer.id,
    }
)
transaction.save()
```

### Expected Outcome
- PaymentTransaction created successfully
- Status set to PENDING
- All required fields populated
- Unique reference assigned
- Expiry datetime set
- Transaction saved to database

### Verification Checklist
- [ ] Transaction object created
- [ ] All required fields set correctly
- [ ] Status is PENDING
- [ ] Unique reference generated and stored
- [ ] Expiry datetime calculated and stored
- [ ] Metadata includes bank details
- [ ] Transaction saved to database
- [ ] Transaction ID/UUID retrieved
- [ ] Error handling implemented
- [ ] Transaction history logged

---

## Task 19: Create Payment Intent Data

### Overview
Define and format the payment intent data structure that is returned to the frontend/customer. This includes all information needed for the customer to complete their bank transfer payment: bank account details, payment reference, amount, expiry time, and payment instructions.

### Dependencies
- Task 17: Create initiate_payment Method
- Task 18: Create Pending Transaction
- Group-A (BankAccount model) complete

### Instructions

1. **Define data structure**
   - Create dictionary structure for payment intent data
   - Include all necessary fields
   - Ensure JSON-serializable

2. **Include bank account list**
   - Array of active bank accounts
   - Each account includes: bank_name, account_number, account_name, branch, swift_code
   - Ordered by display_order from BankAccount model

3. **Add payment reference**
   - Include generated transaction reference
   - Format: "BT-ORD123-20260131-ABC123"
   - Prominent display to ensure customer uses it

4. **Add amount and currency**
   - Total amount to pay
   - Currency code (LKR)
   - Formatted amount for display (e.g., "15,000.00")

5. **Add expiry information**
   - Expiry datetime (ISO format)
   - Time remaining calculation
   - Display deadline clearly

6. **Add payment instructions**
   - Step-by-step instructions for customer
   - Emphasize importance of payment reference
   - Include upload requirement
   - Mention verification timeline

7. **Add order information**
   - Order ID
   - Order date
   - Items summary (optional)

8. **Format for frontend consumption**
   - Camel case or snake case (consistent with API)
   - Proper date formatting
   - Localized strings if applicable

9. **Store in transaction metadata**
   - Save complete intent data in transaction
   - Allows recreation if needed
   - Audit trail

### Payment Intent Data Structure

```python
{
    "transaction_id": "uuid-or-id",
    "payment_reference": "BT-ORD123-20260131-ABC123",
    "order": {
        "order_id": "ORD123",
        "order_number": "2026-0123",
        "order_date": "2026-01-31"
    },
    "amount": {
        "value": "15000.00",
        "currency": "LKR",
        "formatted": "LKR 15,000.00"
    },
    "bank_accounts": [
        {
            "id": 1,
            "bank_name": "Bank of Ceylon",
            "account_number": "1234567890",
            "account_name": "LankaCommerce Cloud Pvt Ltd",
            "branch": "Colombo Main Branch",
            "swift_code": "BCEYLKLX"
        },
        {
            "id": 2,
            "bank_name": "Hatton National Bank",
            "account_number": "9876543210",
            "account_name": "LankaCommerce Cloud Pvt Ltd",
            "branch": "Kandy Branch",
            "swift_code": "HBLILKLX"
        }
    ],
    "expires_at": "2026-02-02T15:30:00Z",
    "expiry_hours": 48,
    "instructions": [
        "Transfer the exact amount to any of the bank accounts listed above",
        "Use the payment reference 'BT-ORD123-20260131-ABC123' for your transfer",
        "Upload a clear photo/screenshot of your payment receipt",
        "Your order will be confirmed within 24 hours after verification"
    ],
    "status": "PENDING",
    "gateway_type": "BANK_TRANSFER"
}
```

### Instructions Text

| Instruction | Purpose |
|-------------|---------|
| Transfer exact amount | Avoid payment amount confusion |
| Use payment reference | Enable matching payment to order |
| Choose any listed account | Customer convenience |
| Upload payment proof | Enable admin verification |
| Verification timeline | Set expectations |
| Expiry warning | Create urgency |

### Display Formatting

| Field | Format | Example |
|-------|--------|---------|
| Amount | Thousand separator | 15,000.00 |
| Currency | ISO code + symbol | LKR or Rs. |
| Date/Time | ISO 8601 | 2026-02-02T15:30:00Z |
| Reference | Uppercase, hyphenated | BT-ORD123-20260131-ABC123 |

### Frontend Usage

```
Customer View:
┌─────────────────────────────────────┐
│ Payment Details                     │
├─────────────────────────────────────┤
│ Amount: LKR 15,000.00              │
│ Reference: BT-ORD123-20260131-ABC123│
│ Expires: 2 days from now           │
├─────────────────────────────────────┤
│ Bank Accounts:                      │
│                                     │
│ 1. Bank of Ceylon                   │
│    Account: 1234567890             │
│    Name: LCC Pvt Ltd               │
│    Branch: Colombo Main            │
│                                     │
│ 2. Hatton National Bank            │
│    Account: 9876543210             │
│    ...                             │
├─────────────────────────────────────┤
│ [Upload Payment Proof]             │
└─────────────────────────────────────┘
```

### Expected Outcome
- Complete payment intent data structure
- All information customer needs to pay
- Properly formatted for display
- Stored in transaction metadata

### Verification Checklist
- [ ] Data structure defined
- [ ] Bank accounts list included
- [ ] Payment reference included
- [ ] Amount and currency formatted
- [ ] Expiry datetime included
- [ ] Payment instructions clear
- [ ] Order information included
- [ ] JSON-serializable structure
- [ ] Consistent field naming
- [ ] Stored in transaction metadata

---

## Task 20: Create verify_payment Method

### Overview
Implement the verify_payment() method that allows checking the current status of a bank transfer payment. This method retrieves the transaction by ID and returns its current status, used by both customers to check status and admins before confirming/rejecting.

### Dependencies
- Task 15: Create BankTransferProcessor
- Task 18: Create Pending Transaction
- PaymentTransaction model complete

### Instructions

1. **Define method signature**
   - Method name: verify_payment
   - Parameter: transaction_id (str or UUID)
   - Return type: PaymentResult
   - Mark as async if using async pattern

2. **Retrieve transaction from database**
   - Query PaymentTransaction by ID
   - Filter by tenant for security
   - Filter by gateway_type = BANK_TRANSFER
   - Handle transaction not found

3. **Validate transaction ownership**
   - Ensure transaction belongs to current tenant
   - Check user permissions if needed
   - Prevent cross-tenant access

4. **Check if transaction has expired**
   - Compare expires_at with current time
   - If expired and still PENDING, mark as EXPIRED
   - Update status and save
   - Call expiry handling logic

5. **Retrieve related data**
   - Load related order
   - Load payment proof if uploaded
   - Load admin actions/comments
   - Include in response metadata

6. **Check for uploaded payment proof**
   - Query for related PaymentProof record
   - Include proof status in response
   - Include upload timestamp
   - Flag if proof pending review

7. **Build status information**
   - Current transaction status
   - Status change history
   - Last updated timestamp
   - Next possible actions

8. **Create PaymentResult response**
   - Set success=True if found
   - Include current status
   - Include transaction details
   - Include metadata with proof info

9. **Handle not found scenarios**
   - Return PaymentResult with success=False
   - Set appropriate error message
   - Don't expose sensitive information

10. **Add transaction history log**
    - Log verification attempt
    - Record who checked (customer/admin)
    - Record timestamp

### Method Flow

```
verify_payment(transaction_id)
    │
    ├─→ Retrieve Transaction
    │       │
    │       ├─→ Query by ID and tenant
    │       └─→ Handle not found
    │
    ├─→ Check Expiry
    │       │
    │       ├─→ Compare with current time
    │       └─→ Update status if expired
    │
    ├─→ Load Related Data
    │       │
    │       ├─→ Order details
    │       ├─→ Payment proof
    │       └─→ Action history
    │
    ├─→ Build Status Info
    │       │
    │       ├─→ Current status
    │       ├─→ Status history
    │       └─→ Next actions
    │
    └─→ Return PaymentResult
            │
            ├─→ success: True/False
            ├─→ status: Current status
            └─→ metadata: Details
```

### Transaction Status Meanings

| Status | Meaning | Customer View | Admin View |
|--------|---------|---------------|------------|
| PENDING | Awaiting payment proof | "Upload proof" | "Awaiting proof" |
| PENDING (with proof) | Awaiting verification | "Under review" | "Review proof" |
| CONFIRMED | Payment verified | "Payment confirmed" | "Confirmed" |
| REJECTED | Payment invalid | "Payment rejected" | "Rejected" |
| EXPIRED | Time limit exceeded | "Payment expired" | "Expired" |

### PaymentResult Output

```python
{
    "success": True,
    "transaction_id": "uuid-or-id",
    "status": "PENDING",
    "gateway_type": "BANK_TRANSFER",
    "message": "Payment pending verification",
    "metadata": {
        "transaction_reference": "BT-ORD123-20260131-ABC123",
        "amount": "15000.00",
        "currency": "LKR",
        "created_at": "2026-01-31T10:00:00Z",
        "expires_at": "2026-02-02T15:30:00Z",
        "is_expired": False,
        "payment_proof": {
            "uploaded": True,
            "uploaded_at": "2026-01-31T14:30:00Z",
            "status": "PENDING_REVIEW"
        },
        "can_confirm": True,
        "can_reject": True,
        "next_actions": ["confirm", "reject"]
    }
}
```

### Security Considerations

| Concern | Solution |
|---------|----------|
| Cross-tenant access | Filter by tenant ID |
| Unauthorized verification | Check user permissions |
| Sensitive data exposure | Return only necessary fields |
| Transaction tampering | Read-only operation |

### Expected Outcome
- Functional verify_payment method
- Returns current transaction status
- Includes payment proof information
- Handles expired transactions
- Secure tenant isolation

### Verification Checklist
- [ ] Method signature correct
- [ ] Transaction retrieved by ID
- [ ] Tenant filtering applied
- [ ] Expiry check implemented
- [ ] Payment proof status included
- [ ] Related data loaded
- [ ] PaymentResult created correctly
- [ ] Not found handled gracefully
- [ ] Security validated
- [ ] Transaction history logged

---

## Task 21: Create Confirm Payment

### Overview
Implement the confirm_payment() method that allows admin users to manually confirm a bank transfer payment after verifying the uploaded payment proof. This method updates the transaction status to CONFIRMED/SUCCESS, updates the order status to PAID, and triggers order fulfillment.

### Dependencies
- Task 20: Create verify_payment Method
- Task 18: Create Pending Transaction
- Order model status transitions must be defined

### Instructions

1. **Define method signature**
   - Method name: confirm_payment
   - Parameters: transaction_id, admin_user_id, notes (optional)
   - Return type: PaymentResult
   - Add admin permission decorator if applicable

2. **Retrieve and validate transaction**
   - Load transaction by ID and tenant
   - Verify transaction status is PENDING
   - Check payment proof exists and reviewed
   - Ensure not already confirmed

3. **Validate admin permissions**
   - Check admin_user has permission to confirm payments
   - Check role allows payment confirmation
   - Log admin user performing action
   - Prevent unauthorized confirmations

4. **Check transaction not expired**
   - If expired, return error
   - Cannot confirm expired transactions
   - Suggest refund if payment was made

5. **Update transaction status**
   - Set status to CONFIRMED or SUCCESS
   - Set confirmed_at timestamp
   - Set confirmed_by to admin_user_id
   - Add notes to metadata if provided

6. **Update order status**
   - Load related order
   - Change order status to PAID or PROCESSING
   - Trigger order status change event
   - Update order payment_status field

7. **Create transaction history entry**
   - Log status change from PENDING to CONFIRMED
   - Record admin user who confirmed
   - Record timestamp
   - Include any notes provided

8. **Trigger post-confirmation actions**
   - Send confirmation email to customer
   - Trigger order fulfillment workflow
   - Update inventory if needed
   - Fire webhooks if configured

9. **Handle payment proof status**
   - Update proof status to VERIFIED
   - Link proof to transaction confirmation
   - Store admin review notes

10. **Return success result**
    - Create PaymentResult with success=True
    - Include updated transaction details
    - Include order status update
    - Include confirmation details

11. **Handle errors gracefully**
    - Transaction not found or wrong status
    - Permission denied
    - Order update failures
    - Return detailed error messages

### Method Flow

```
confirm_payment(transaction_id, admin_id, notes)
    │
    ├─→ Validate Transaction
    │       │
    │       ├─→ Load by ID and tenant
    │       ├─→ Check status is PENDING
    │       ├─→ Check not expired
    │       └─→ Check proof exists
    │
    ├─→ Validate Admin Permission
    │       │
    │       └─→ Check user has confirm permission
    │
    ├─→ Update Transaction
    │       │
    │       ├─→ status = CONFIRMED
    │       ├─→ confirmed_at = now()
    │       ├─→ confirmed_by = admin_id
    │       └─→ Save notes to metadata
    │
    ├─→ Update Order
    │       │
    │       ├─→ status = PAID
    │       ├─→ payment_status = COMPLETED
    │       └─→ Trigger status change event
    │
    ├─→ Post-Confirmation Actions
    │       │
    │       ├─→ Send confirmation email
    │       ├─→ Trigger fulfillment
    │       ├─→ Update payment proof
    │       └─→ Fire webhooks
    │
    └─→ Return PaymentResult
            │
            ├─→ success: True
            ├─→ status: CONFIRMED
            └─→ metadata: Confirmation details
```

### Status Transitions

```
┌──────────┐
│ PENDING  │
└──────────┘
     │
     │ confirm_payment()
     ▼
┌──────────┐
│CONFIRMED │
└──────────┘
     │
     │ (Later: refund if needed)
     ▼
┌──────────┐
│ REFUNDED │
└──────────┘
```

### Order Status Update

| Before | After | Trigger |
|--------|-------|---------|
| PENDING_PAYMENT | PAID | Payment confirmed |
| PAID | PROCESSING | Auto or manual |
| PROCESSING | SHIPPED | Fulfillment |

### Transaction Updates

| Field | Value | Description |
|-------|-------|-------------|
| status | CONFIRMED | Payment verified |
| confirmed_at | now() | Confirmation timestamp |
| confirmed_by | admin_user_id | Admin who confirmed |
| metadata.notes | Admin notes | Review comments |
| metadata.verified_at | now() | Verification time |

### Post-Confirmation Actions

```
Confirm Payment
    │
    ├─→ Update Transaction (CONFIRMED)
    │
    ├─→ Update Order (PAID)
    │
    ├─→ Send Email
    │       │
    │       ├─→ Customer: Payment confirmed
    │       └─→ Admin: Notification
    │
    ├─→ Trigger Fulfillment
    │       │
    │       ├─→ Generate packing slip
    │       ├─→ Update inventory
    │       └─→ Create shipment task
    │
    └─→ Fire Webhooks
            │
            └─→ External systems notified
```

### Admin Permissions

| Permission | Required For |
|------------|--------------|
| payments.confirm_payment | Confirm payments |
| payments.view_payment_proof | View uploaded proofs |
| orders.change_order_status | Update order status |

### Expected Outcome
- Functional confirm_payment method
- Transaction status updated to CONFIRMED
- Order status updated to PAID
- Customer notified of confirmation
- Order fulfillment triggered

### Verification Checklist
- [ ] Method signature correct with admin_user_id
- [ ] Transaction retrieved and validated
- [ ] Status check ensures PENDING only
- [ ] Admin permissions validated
- [ ] Expiry check implemented
- [ ] Transaction status updated to CONFIRMED
- [ ] confirmed_at and confirmed_by set
- [ ] Order status updated to PAID
- [ ] Transaction history logged
- [ ] Confirmation email sent
- [ ] Payment proof status updated
- [ ] Fulfillment workflow triggered
- [ ] Error handling implemented
- [ ] PaymentResult returned correctly

---

## Summary

This document established the BankTransferProcessor foundation and core payment methods. The processor handles payment initiation by creating pending transactions and returning bank details, and provides verification and confirmation flows for manual payment processing.

### Completed Tasks
1. ✓ Created BankTransferProcessor class extending PaymentProcessor
2. ✓ Registered processor with ProcessorFactory
3. ✓ Implemented initiate_payment method with bank details return
4. ✓ Created pending transaction with expiry
5. ✓ Defined payment intent data structure
6. ✓ Implemented verify_payment for status checking
7. ✓ Created confirm_payment for admin verification

### Next Steps
Proceed to [02_Tasks-22-28_Expiry-Refund-Verify.md](02_Tasks-22-28_Expiry-Refund-Verify.md) to implement payment rejection, automatic expiry handling with Celery tasks, refund processing, and complete processor verification.
