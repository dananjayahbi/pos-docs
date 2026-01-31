# Tasks 22-28: Expiry, Refund, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** B - Bank Transfer Processor  
> **Document:** 02 of 02  
> **Tasks Covered:** 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-21_Processor-Payment.md](01_Tasks-15-21_Processor-Payment.md)
- **→ Next Group:** [Group-C_Payment-Reference-Instructions](../Group-C_Payment-Reference-Instructions/)

---

## Document Overview

This document covers payment rejection handling, automatic expiry checking and processing, manual refund workflow, state transition management, and complete processor verification. These components complete the bank transfer payment lifecycle by handling negative outcomes and edge cases.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 22 | Create Reject Payment | Medium | 30 min |
| 23 | Create Expiry Check | Low | 20 min |
| 24 | Create Expiry Celery Task | Medium | 35 min |
| 25 | Create process_refund Method | Medium | 35 min |
| 26 | Create Refund Instructions | Low | 20 min |
| 27 | Create Status Transitions | Medium | 25 min |
| 28 | Verify Processor | Low | 25 min |

---

## Task 22: Create Reject Payment

### Overview
Implement the reject_payment() method that allows admin users to manually reject a bank transfer payment after reviewing the uploaded payment proof. This method updates the transaction status to REJECTED/FAILED, updates the order status accordingly, notifies the customer with the rejection reason, and optionally initiates a refund if payment was already made.

### Dependencies
- Task 21: Create Confirm Payment
- Task 20: Create verify_payment Method
- Order status transitions must support rejection

### Instructions

1. **Define method signature**
   - Method name: reject_payment
   - Parameters: transaction_id, admin_user_id, reason (required), refund_initiated (bool, optional)
   - Return type: PaymentResult
   - Add admin permission decorator

2. **Retrieve and validate transaction**
   - Load transaction by ID and tenant
   - Verify transaction status is PENDING
   - Check payment proof exists if applicable
   - Ensure not already processed (confirmed/rejected)

3. **Validate admin permissions**
   - Check admin_user has permission to reject payments
   - Check role allows payment rejection
   - Log admin user performing action
   - Prevent unauthorized rejections

4. **Validate rejection reason**
   - Ensure reason is provided and non-empty
   - Reason required for customer notification
   - Store reason in transaction metadata
   - May use predefined reason codes

5. **Update transaction status**
   - Set status to REJECTED or FAILED
   - Set rejected_at timestamp
   - Set rejected_by to admin_user_id
   - Store rejection reason in metadata

6. **Update order status**
   - Load related order
   - Change order status to PAYMENT_FAILED or CANCELLED
   - Update order payment_status field
   - Trigger order status change event

7. **Handle payment proof status**
   - Update proof status to REJECTED
   - Link rejection reason to proof
   - Store admin review notes

8. **Create transaction history entry**
   - Log status change from PENDING to REJECTED
   - Record admin user who rejected
   - Record rejection reason
   - Record timestamp

9. **Send rejection notification**
   - Send email to customer
   - Include rejection reason
   - Provide next steps (retry payment, contact support)
   - Include refund information if applicable

10. **Handle refund if needed**
    - If refund_initiated=True, create refund record
    - Call process_refund method (Task 25)
    - Include refund details in response
    - Update transaction with refund reference

11. **Return result**
    - Create PaymentResult with success=True (rejection successful)
    - Include rejection details
    - Include refund information if applicable
    - Include next steps for customer

12. **Handle errors gracefully**
    - Transaction not found or wrong status
    - Permission denied
    - Missing rejection reason
    - Return detailed error messages

### Method Flow

```
reject_payment(transaction_id, admin_id, reason, refund_initiated)
    │
    ├─→ Validate Transaction
    │       │
    │       ├─→ Load by ID and tenant
    │       ├─→ Check status is PENDING
    │       └─→ Ensure not already processed
    │
    ├─→ Validate Admin Permission
    │       │
    │       └─→ Check user has reject permission
    │
    ├─→ Validate Reason
    │       │
    │       └─→ Ensure reason provided
    │
    ├─→ Update Transaction
    │       │
    │       ├─→ status = REJECTED
    │       ├─→ rejected_at = now()
    │       ├─→ rejected_by = admin_id
    │       └─→ Store reason in metadata
    │
    ├─→ Update Order
    │       │
    │       ├─→ status = PAYMENT_FAILED
    │       └─→ Trigger status change event
    │
    ├─→ Update Payment Proof
    │       │
    │       └─→ status = REJECTED
    │
    ├─→ Send Notification
    │       │
    │       ├─→ Email customer
    │       └─→ Include rejection reason
    │
    ├─→ Handle Refund (if needed)
    │       │
    │       └─→ Create refund record
    │
    └─→ Return PaymentResult
            │
            ├─→ success: True
            ├─→ status: REJECTED
            └─→ metadata: Rejection details
```

### Status Transitions

```
┌──────────┐
│ PENDING  │
└──────────┘
     │
     │ reject_payment()
     ▼
┌──────────┐
│ REJECTED │ (Terminal state)
└──────────┘
```

### Rejection Reasons

| Reason Code | Description | Customer Message |
|-------------|-------------|------------------|
| INVALID_PROOF | Proof unclear or invalid | "Payment proof is unclear. Please upload a clear image." |
| AMOUNT_MISMATCH | Amount doesn't match order | "Payment amount doesn't match order total." |
| WRONG_REFERENCE | Incorrect payment reference | "Payment reference is incorrect or missing." |
| DUPLICATE_PROOF | Proof already used | "This payment proof has been used for another order." |
| FRAUDULENT | Suspected fraud | "Payment could not be verified. Please contact support." |
| EXPIRED_PROOF | Proof uploaded after expiry | "Payment proof submitted after expiry deadline." |

### Transaction Updates

| Field | Value | Description |
|-------|-------|-------------|
| status | REJECTED | Payment rejected |
| rejected_at | now() | Rejection timestamp |
| rejected_by | admin_user_id | Admin who rejected |
| metadata.reason | Reason code/text | Rejection reason |
| metadata.reason_details | Details | Additional context |
| metadata.refund_initiated | Boolean | Refund status |

### Order Status Update

| Current | After Rejection | Action |
|---------|----------------|--------|
| PENDING_PAYMENT | PAYMENT_FAILED | Allow retry |
| PENDING_PAYMENT | CANCELLED | If expired or fraudulent |

### Notification Template

```
Subject: Payment Verification Failed - Order #ORD123

Dear Customer,

We were unable to verify your payment for Order #ORD123.

Reason: {rejection_reason}

Details: {reason_details}

Next Steps:
- Please review the rejection reason above
- Ensure payment proof is clear and complete
- Upload a new payment proof if the issue can be resolved
- Contact our support team if you need assistance

{refund_information_if_applicable}

Order Details:
- Order Number: ORD123
- Amount: LKR 15,000.00
- Payment Reference: BT-ORD123-20260131-ABC123

Thank you for your understanding.

Best regards,
LankaCommerce Cloud Team
```

### Refund Initiation Logic

```
If refund_initiated = True:
    │
    ├─→ Create refund record
    │       │
    │       ├─→ amount = transaction.amount
    │       ├─→ reason = rejection_reason
    │       └─→ status = PENDING
    │
    ├─→ Link to transaction
    │
    └─→ Notify finance team
```

### Admin Permissions

| Permission | Required For |
|------------|--------------|
| payments.reject_payment | Reject payments |
| payments.view_payment_proof | View uploaded proofs |
| payments.initiate_refund | Initiate refunds (optional) |

### Expected Outcome
- Functional reject_payment method
- Transaction status updated to REJECTED
- Order status updated appropriately
- Customer notified with clear reason
- Refund initiated if requested

### Verification Checklist
- [ ] Method signature correct with reason parameter
- [ ] Transaction retrieved and validated
- [ ] Status check ensures PENDING only
- [ ] Admin permissions validated
- [ ] Rejection reason required and stored
- [ ] Transaction status updated to REJECTED
- [ ] rejected_at and rejected_by set
- [ ] Order status updated appropriately
- [ ] Payment proof status updated
- [ ] Transaction history logged
- [ ] Rejection email sent to customer
- [ ] Refund initiated if requested
- [ ] Error handling implemented
- [ ] PaymentResult returned correctly

---

## Task 23: Create Expiry Check

### Overview
Create a method to check if a pending bank transfer payment has expired based on the expires_at timestamp. This check is used by the expiry Celery task and can also be called manually to determine if a transaction should be auto-expired.

### Dependencies
- Task 18: Create Pending Transaction
- Transaction model includes expires_at field

### Instructions

1. **Define method signature**
   - Method name: is_expired or check_expiry
   - Parameter: transaction (PaymentTransaction object) or transaction_id
   - Return type: bool or dict with expiry details
   - Can be static method or instance method

2. **Retrieve transaction if ID provided**
   - If transaction_id passed, load transaction
   - Filter by tenant
   - Handle not found

3. **Check transaction status**
   - Only check PENDING transactions
   - Already processed (CONFIRMED/REJECTED) can't expire
   - Return False if not PENDING

4. **Get current datetime**
   - Use timezone-aware datetime
   - Get current time in same timezone as expires_at
   - Ensure timezone consistency

5. **Compare with expires_at**
   - Check if current_time > transaction.expires_at
   - Return True if expired
   - Return False if still valid

6. **Calculate time remaining**
   - If not expired, calculate time until expiry
   - Return timedelta or seconds remaining
   - Useful for display and scheduling

7. **Handle edge cases**
   - Transaction without expires_at (shouldn't happen)
   - Very old transactions (beyond normal expiry)
   - Timezone edge cases

8. **Add logging**
   - Log expiry checks for monitoring
   - Track how many transactions checked
   - Alert if unusual expiry patterns

### Method Implementation Patterns

```python
# Pattern 1: Simple boolean
def is_expired(self, transaction: PaymentTransaction) -> bool:
    if transaction.status != TransactionStatus.PENDING:
        return False
    return timezone.now() > transaction.expires_at

# Pattern 2: Detailed result
def check_expiry(self, transaction: PaymentTransaction) -> dict:
    now = timezone.now()
    is_expired = now > transaction.expires_at
    time_remaining = transaction.expires_at - now if not is_expired else None
    
    return {
        'is_expired': is_expired,
        'expires_at': transaction.expires_at,
        'current_time': now,
        'time_remaining': time_remaining,
        'time_remaining_seconds': time_remaining.total_seconds() if time_remaining else 0
    }
```

### Expiry Logic Flow

```
check_expiry(transaction)
    │
    ├─→ Check Status
    │       │
    │       ├─→ If not PENDING: return False
    │       └─→ Continue if PENDING
    │
    ├─→ Get Current Time
    │       │
    │       └─→ timezone.now()
    │
    ├─→ Compare Times
    │       │
    │       ├─→ now > expires_at: True (expired)
    │       └─→ now <= expires_at: False (valid)
    │
    └─→ Return Result
            │
            ├─→ Boolean: True/False
            └─→ Or dict with details
```

### Time Comparison

| Scenario | expires_at | Current Time | Result |
|----------|-----------|--------------|--------|
| Valid | 2026-02-02 15:00 | 2026-01-31 10:00 | False (not expired) |
| Expired | 2026-01-30 15:00 | 2026-01-31 10:00 | True (expired) |
| Just Expired | 2026-01-31 10:00:00 | 2026-01-31 10:00:01 | True (expired) |
| Edge | 2026-01-31 10:00:00 | 2026-01-31 10:00:00 | False (not expired) |

### Timezone Considerations

| Issue | Solution |
|-------|----------|
| Naive datetime | Always use timezone.now() |
| Different timezones | Convert to common timezone (UTC) |
| DST transitions | Use timezone-aware datetimes |
| Display to user | Convert to user's local timezone |

### Usage Scenarios

```
# Scenario 1: Celery Task
expired_transactions = PaymentTransaction.objects.filter(
    status=PENDING,
    expires_at__lt=timezone.now()
)
for txn in expired_transactions:
    if processor.is_expired(txn):
        processor.expire_transaction(txn)

# Scenario 2: Customer Status Check
result = processor.check_expiry(transaction)
if result['is_expired']:
    show_expired_message()
else:
    show_time_remaining(result['time_remaining'])

# Scenario 3: Admin Dashboard
for txn in pending_transactions:
    expiry_info = processor.check_expiry(txn)
    display_expiry_warning(expiry_info)
```

### Return Value Options

| Return Type | Use Case | Example |
|-------------|----------|---------|
| bool | Simple yes/no check | True/False |
| dict | Detailed information | {'is_expired': True, 'time_remaining': None} |
| tuple | Multiple values | (is_expired, time_remaining) |
| ExpiryResult | Type-safe object | ExpiryResult(expired=True, ...) |

### Expected Outcome
- Functional expiry check method
- Accurate time comparison
- Handles timezone correctly
- Returns useful information
- Used by expiry Celery task

### Verification Checklist
- [ ] Method signature defined
- [ ] Status check for PENDING only
- [ ] Current time retrieved with timezone
- [ ] Comparison with expires_at correct
- [ ] Timezone-aware datetime handling
- [ ] Edge cases handled
- [ ] Time remaining calculated (optional)
- [ ] Logging implemented
- [ ] Return value documented
- [ ] Works with both transaction object and ID

---

## Task 24: Create Expiry Celery Task

### Overview
Create a Celery periodic task that automatically expires pending bank transfer payments that have exceeded their expiry deadline. This task runs on a schedule (e.g., hourly), queries for expired transactions, updates their status to EXPIRED, updates order status to CANCELLED, and notifies customers.

### Dependencies
- Task 23: Create Expiry Check
- Task 18: Create Pending Transaction
- Celery configured and running
- Celery Beat scheduler configured

### Instructions

1. **Create Celery task file**
   - Navigate to `backend/apps/payments/tasks/` directory
   - Create file named `expiry_task.py` or add to existing tasks
   - Import Celery decorators and models

2. **Import required dependencies**
   - Import shared_task from celery
   - Import timezone from django.utils
   - Import PaymentTransaction, TransactionStatus models
   - Import Order model
   - Import notification services

3. **Define Celery task**
   - Use @shared_task decorator
   - Name task: expire_pending_payments
   - Set task properties (bind, retry, etc.)
   - Add error handling with retry logic

4. **Query expired transactions**
   - Filter by status=PENDING
   - Filter by expires_at < now()
   - Filter by gateway_type=BANK_TRANSFER (if mixed gateways)
   - Use select_related to load order

5. **Process each expired transaction**
   - Iterate through queryset
   - Update transaction status to EXPIRED
   - Set expired_at timestamp
   - Log expiry event

6. **Update related orders**
   - Load transaction.order
   - Update order status to CANCELLED
   - Update order payment_status to EXPIRED
   - Trigger order status change event

7. **Send expiry notifications**
   - Send email to customer
   - Notify about payment expiry
   - Provide options to retry or cancel
   - Include order and payment details

8. **Handle payment proofs**
   - Check if payment proof was uploaded
   - Flag for manual review if proof exists
   - Don't auto-expire if proof pending review (optional)

9. **Log task execution**
   - Log number of transactions processed
   - Log any errors encountered
   - Track task execution time
   - Alert on unusual patterns

10. **Configure periodic schedule**
    - Add to Celery Beat schedule
    - Set to run every hour (or desired interval)
    - Configure timezone for schedule
    - Use crontab for specific times if needed

11. **Add task monitoring**
    - Track task success/failure
    - Monitor processing time
    - Alert if task fails repeatedly
    - Use Celery monitoring tools

12. **Implement atomic operations**
    - Use transaction.atomic() for DB operations
    - Ensure all-or-nothing updates
    - Handle partial failures gracefully

### Task Structure

```python
@shared_task(bind=True, max_retries=3)
def expire_pending_payments(self):
    """
    Periodic task to expire pending bank transfer payments
    that have exceeded their expiry deadline.
    """
    expired_count = 0
    errors = []
    
    try:
        # Query expired transactions
        expired_transactions = PaymentTransaction.objects.select_related(
            'order', 'tenant'
        ).filter(
            status=TransactionStatus.PENDING,
            gateway_type=PaymentGateway.BANK_TRANSFER,
            expires_at__lt=timezone.now()
        )
        
        # Process each transaction
        for transaction in expired_transactions:
            try:
                with transaction.atomic():
                    # Update transaction
                    # Update order
                    # Send notification
                    expired_count += 1
            except Exception as e:
                errors.append((transaction.id, str(e)))
        
        # Log results
        logger.info(f"Expired {expired_count} transactions")
        
    except Exception as exc:
        logger.error(f"Expiry task failed: {exc}")
        raise self.retry(exc=exc, countdown=300)
    
    return {
        'expired_count': expired_count,
        'errors': errors
    }
```

### Task Flow

```
Celery Beat Schedule
    │
    ▼
expire_pending_payments() [Hourly]
    │
    ├─→ Query Expired Transactions
    │       │
    │       ├─→ status = PENDING
    │       ├─→ expires_at < now()
    │       └─→ gateway = BANK_TRANSFER
    │
    ├─→ For Each Transaction:
    │       │
    │       ├─→ Update status to EXPIRED
    │       ├─→ Set expired_at timestamp
    │       ├─→ Update order status
    │       ├─→ Send notification
    │       └─→ Log event
    │
    ├─→ Log Summary
    │       │
    │       ├─→ Total processed
    │       ├─→ Errors encountered
    │       └─→ Execution time
    │
    └─→ Return Result
```

### Celery Beat Schedule Configuration

```python
# In settings.py or celery.py
CELERY_BEAT_SCHEDULE = {
    'expire-pending-payments': {
        'task': 'payments.tasks.expire_pending_payments',
        'schedule': crontab(minute=0),  # Every hour
        # Or: 'schedule': 3600,  # Every 3600 seconds
    },
}
```

### Status Transitions

```
PENDING (expired)
    │
    │ Auto-expiry task
    ▼
EXPIRED (terminal)
    │
    └─→ Order: CANCELLED
```

### Transaction Updates

| Field | Value | Description |
|-------|-------|-------------|
| status | EXPIRED | Automatically expired |
| expired_at | now() | Expiry timestamp |
| metadata.expired_by | system | Automated expiry |
| metadata.expiry_reason | auto_expired | Reason code |

### Notification Template

```
Subject: Payment Expired - Order #ORD123

Dear Customer,

Your payment for Order #ORD123 has expired as we did not receive
payment verification within the allowed time period.

Order Details:
- Order Number: ORD123
- Amount: LKR 15,000.00
- Expired At: 2026-02-02 15:30

If you have already made the payment, please contact our support
team immediately with your payment proof.

To proceed with your order:
1. Place a new order
2. Or contact support to reinstate this order

We apologize for any inconvenience.

Best regards,
LankaCommerce Cloud Team
```

### Error Handling

| Error Type | Handling | Retry |
|------------|----------|-------|
| Database error | Log and retry | Yes, 3 times |
| Email send failure | Log, continue processing | No |
| Lock timeout | Retry with backoff | Yes |
| Unexpected exception | Log and retry task | Yes |

### Monitoring Metrics

| Metric | Purpose |
|--------|---------|
| Expired transactions per run | Track volume |
| Task execution time | Performance monitoring |
| Error rate | Quality monitoring |
| Time since last run | Scheduler health |

### Special Cases

```
Transaction with uploaded proof but pending review:
    ├─→ Option 1: Don't auto-expire, flag for urgent review
    └─→ Option 2: Expire but notify admin for manual review

Transaction where customer claims payment made:
    ├─→ Auto-expire per policy
    └─→ Allow customer to contact support with proof

Grace period:
    ├─→ Add buffer time (e.g., +2 hours) before expiring
    └─→ Configurable per tenant
```

### Expected Outcome
- Functional Celery periodic task
- Runs on schedule (hourly)
- Automatically expires pending payments
- Updates transaction and order status
- Sends customer notifications
- Robust error handling

### Verification Checklist
- [ ] Task file created in tasks directory
- [ ] @shared_task decorator applied
- [ ] Query filters expired transactions correctly
- [ ] Transaction status updated to EXPIRED
- [ ] expired_at timestamp set
- [ ] Order status updated to CANCELLED
- [ ] Customer notification sent
- [ ] Transaction history logged
- [ ] Error handling implemented
- [ ] Celery Beat schedule configured
- [ ] Task retries on failures
- [ ] Atomic transactions used
- [ ] Monitoring/logging implemented
- [ ] Task tested with sample data

---

## Task 25: Create process_refund Method

### Overview
Implement the process_refund() method that handles manual bank transfer refunds. Since bank transfers are manual offline payments, refunds cannot be processed automatically. This method creates a refund record with instructions for the finance team to process the refund manually and notifies the customer about the refund timeline.

### Dependencies
- Task 21: Create Confirm Payment
- Refund model or refund tracking must exist
- Transaction must be in CONFIRMED status

### Instructions

1. **Define method signature**
   - Method name: process_refund
   - Parameters: transaction_id, amount (optional, defaults to full), reason, admin_user_id
   - Return type: RefundResult or PaymentResult
   - Add admin permission decorator

2. **Retrieve and validate transaction**
   - Load transaction by ID and tenant
   - Verify transaction status is CONFIRMED
   - Can't refund PENDING, REJECTED, or EXPIRED
   - Ensure not already fully refunded

3. **Validate refund amount**
   - If amount not provided, use full transaction amount
   - If partial refund, validate amount <= transaction.amount
   - Check previous refunds if partial refunds allowed
   - Ensure total refunds don't exceed original amount

4. **Validate admin permissions**
   - Check admin_user has permission to process refunds
   - Check role allows refund processing
   - Log admin user performing action

5. **Validate refund reason**
   - Ensure reason is provided
   - Store reason for audit trail
   - May use predefined reason codes

6. **Create refund record**
   - Create Refund model instance
   - Link to transaction
   - Set amount, reason, status=PENDING
   - Set requested_by to admin_user_id
   - Set requested_at timestamp

7. **Update transaction status**
   - If full refund: status = REFUNDED
   - If partial refund: status = PARTIALLY_REFUNDED (if supported)
   - Update refunded_amount field
   - Store refund details in metadata

8. **Retrieve customer bank details**
   - Load customer's bank account information
   - Required for refund processing
   - Validate bank details exist and are complete
   - Prompt customer if missing

9. **Generate refund instructions**
   - Call Task 26 implementation
   - Create instructions for finance team
   - Include customer bank details
   - Include refund amount and reference

10. **Create transaction history entry**
    - Log refund request
    - Record admin user who requested
    - Record reason and amount
    - Record timestamp

11. **Send notifications**
    - Notify customer about refund
    - Include timeline (3-5 business days)
    - Notify finance team to process
    - Include refund instructions

12. **Return refund result**
    - Create RefundResult with success=True
    - Include refund ID
    - Include instructions
    - Include expected timeline

13. **Handle errors gracefully**
    - Transaction not in CONFIRMED status
    - Invalid refund amount
    - Missing customer bank details
    - Permission denied

### Method Flow

```
process_refund(transaction_id, amount, reason, admin_id)
    │
    ├─→ Validate Transaction
    │       │
    │       ├─→ Load by ID and tenant
    │       ├─→ Check status is CONFIRMED
    │       └─→ Check not fully refunded
    │
    ├─→ Validate Refund Amount
    │       │
    │       ├─→ Use full amount if not specified
    │       ├─→ Check <= original amount
    │       └─→ Check previous refunds
    │
    ├─→ Validate Admin Permission
    │       │
    │       └─→ Check refund permission
    │
    ├─→ Create Refund Record
    │       │
    │       ├─→ amount, reason, status=PENDING
    │       ├─→ requested_by = admin_id
    │       └─→ requested_at = now()
    │
    ├─→ Update Transaction
    │       │
    │       ├─→ status = REFUNDED
    │       └─→ refunded_amount += amount
    │
    ├─→ Get Customer Bank Details
    │       │
    │       └─→ Load from customer profile
    │
    ├─→ Generate Instructions
    │       │
    │       └─→ For finance team processing
    │
    ├─→ Send Notifications
    │       │
    │       ├─→ Customer: Refund initiated
    │       └─→ Finance: Process refund
    │
    └─→ Return RefundResult
            │
            ├─→ success: True
            ├─→ refund_id
            └─→ instructions
```

### Status Transitions

```
┌───────────┐
│ CONFIRMED │
└───────────┘
      │
      │ process_refund()
      ▼
┌───────────┐
│ REFUNDED  │ (Terminal state)
└───────────┘
```

### Refund Record Fields

| Field | Value | Description |
|-------|-------|-------------|
| transaction | Foreign key | Related transaction |
| amount | Decimal | Refund amount |
| reason | Text | Refund reason |
| status | PENDING | Initial status |
| requested_by | admin_user_id | Who requested |
| requested_at | now() | Request timestamp |
| processed_at | null | Completed timestamp |
| refund_reference | Generated | Unique reference |

### Refund Reasons

| Reason Code | Description | Scenario |
|-------------|-------------|----------|
| CUSTOMER_REQUEST | Customer requested cancellation | Order cancellation |
| DUPLICATE_PAYMENT | Customer paid twice | Error recovery |
| AMOUNT_OVERPAID | Customer overpaid | Partial refund |
| ORDER_CANCELLED | Order cancelled by admin | Admin action |
| DEFECTIVE_PRODUCT | Product issue | Quality issue |
| OUT_OF_STOCK | Product unavailable | Fulfillment failure |

### Transaction Updates

| Field | Value | Description |
|-------|-------|-------------|
| status | REFUNDED | Refund processed |
| refunded_amount | amount | Amount refunded |
| refunded_at | now() | Refund timestamp |
| refunded_by | admin_user_id | Who processed |
| metadata.refund_id | refund.id | Link to refund |
| metadata.refund_reason | reason | Refund reason |

### Customer Bank Details Required

| Field | Required | Purpose |
|-------|----------|---------|
| Bank Name | Yes | Identify bank |
| Account Number | Yes | Transfer destination |
| Account Holder Name | Yes | Verify recipient |
| Branch | Optional | Additional routing |

### Expected Outcome
- Functional process_refund method
- Refund record created
- Transaction status updated
- Instructions generated for finance team
- Customer and finance team notified

### Verification Checklist
- [ ] Method signature correct with parameters
- [ ] Transaction retrieved and validated
- [ ] Status check ensures CONFIRMED only
- [ ] Refund amount validated
- [ ] Admin permissions validated
- [ ] Refund record created
- [ ] Transaction status updated to REFUNDED
- [ ] refunded_amount and refunded_at set
- [ ] Customer bank details retrieved
- [ ] Refund instructions generated (Task 26)
- [ ] Transaction history logged
- [ ] Customer notification sent
- [ ] Finance team notified
- [ ] Error handling implemented
- [ ] RefundResult returned correctly

---

## Task 26: Create Refund Instructions

### Overview
Create comprehensive refund instructions that guide the finance team through the manual process of refunding a bank transfer payment. These instructions include customer bank details, refund amount, refund reference, and step-by-step processing guidelines.

### Dependencies
- Task 25: Create process_refund Method
- Customer bank details must be available

### Instructions

1. **Define instruction format**
   - Create structured document or data object
   - Include all necessary information
   - Make it easy to follow for finance team
   - Support both display and print formats

2. **Include refund header information**
   - Refund ID/reference
   - Transaction ID/reference
   - Original payment reference
   - Order number
   - Refund date and time

3. **Include refund amount details**
   - Original transaction amount
   - Refund amount
   - Currency
   - Calculation if partial refund

4. **Include customer information**
   - Customer name
   - Customer email
   - Customer phone
   - Customer ID for reference

5. **Include customer bank details**
   - Bank name
   - Account number
   - Account holder name
   - Branch name (if available)
   - SWIFT code (if available)

6. **Include refund reason**
   - Clear explanation of why refund is needed
   - Reference to admin who approved
   - Any special notes or conditions

7. **Provide processing steps**
   - Step-by-step instructions for finance team
   - How to initiate bank transfer
   - How to mark refund as processed
   - How to notify customer upon completion

8. **Add verification checklist**
   - Verify customer bank details
   - Verify refund amount
   - Verify refund authorization
   - Confirm transfer completion
   - Update system status

9. **Include timeline expectations**
   - When refund should be processed
   - Standard processing time (3-5 business days)
   - Customer notification timeline

10. **Add contact information**
    - Admin who requested refund
    - Customer support contact
    - Finance team contact

11. **Generate PDF or printable format**
    - Create PDF document
    - Include company branding
    - Clear formatting for readability
    - Attachment for email

### Instruction Template Structure

```
═══════════════════════════════════════════════════════════
                    REFUND PROCESSING INSTRUCTIONS
               LankaCommerce Cloud - Finance Department
═══════════════════════════════════════════════════════════

REFUND DETAILS
───────────────────────────────────────────────────────────
Refund Reference:      REF-2026-001234
Transaction ID:        TXN-ABC123
Payment Reference:     BT-ORD123-20260131-ABC123
Order Number:          ORD123
Refund Date:           2026-01-31 15:30:00
Requested By:          Admin User (admin@company.com)

AMOUNT INFORMATION
───────────────────────────────────────────────────────────
Original Payment:      LKR 15,000.00
Refund Amount:         LKR 15,000.00
Currency:              LKR
Refund Type:           Full Refund

CUSTOMER DETAILS
───────────────────────────────────────────────────────────
Name:                  John Doe
Email:                 john@example.com
Phone:                 +94 77 123 4567
Customer ID:           CUST-456

CUSTOMER BANK ACCOUNT (Refund Destination)
───────────────────────────────────────────────────────────
Bank Name:             Bank of Ceylon
Account Number:        1234567890123456
Account Holder:        John Doe
Branch:                Colombo Main Branch
SWIFT Code:            BCEYLKLX (if needed for international)

REFUND REASON
───────────────────────────────────────────────────────────
Reason Code:           CUSTOMER_REQUEST
Details:               Customer requested order cancellation
                       Order cancelled before shipment

PROCESSING INSTRUCTIONS
───────────────────────────────────────────────────────────
1. Verify customer bank details are correct
2. Verify refund amount matches authorization
3. Initiate bank transfer from company account:
   - From: LCC Operating Account
   - To: Customer account (details above)
   - Amount: LKR 15,000.00
   - Reference: REF-2026-001234
4. Keep transfer receipt for records
5. Mark refund as PROCESSED in system
6. System will auto-notify customer

VERIFICATION CHECKLIST
───────────────────────────────────────────────────────────
[ ] Bank details verified with customer
[ ] Refund amount confirmed correct
[ ] Authorization approved by: Admin User
[ ] Bank transfer initiated
[ ] Transfer receipt obtained
[ ] System status updated to PROCESSED
[ ] Customer notification sent

TIMELINE
───────────────────────────────────────────────────────────
Process By:            2026-02-02 (within 2 business days)
Customer Expectation:  3-5 business days
Notification:          Automatic upon marking as PROCESSED

CONTACT INFORMATION
───────────────────────────────────────────────────────────
Requesting Admin:      admin@company.com
Customer Support:      support@lcc.lk / +94 11 234 5678
Finance Manager:       finance@lcc.lk

═══════════════════════════════════════════════════════════
Generated: 2026-01-31 15:30:00 | Page 1 of 1
═══════════════════════════════════════════════════════════
```

### Instruction Components

| Component | Content | Purpose |
|-----------|---------|---------|
| Header | Company branding, title | Identification |
| Refund Details | IDs, references, dates | Tracking |
| Amount Info | Payment, refund, currency | Financial accuracy |
| Customer Details | Name, contact, ID | Recipient identification |
| Bank Account | Account details | Transfer destination |
| Reason | Code and explanation | Context |
| Steps | Processing instructions | Execution guide |
| Checklist | Verification items | Quality control |
| Timeline | Deadlines, expectations | Scheduling |
| Contacts | Support information | Communication |

### Data Structure

```python
refund_instructions = {
    "refund_reference": "REF-2026-001234",
    "transaction_id": "TXN-ABC123",
    "payment_reference": "BT-ORD123-20260131-ABC123",
    "order_number": "ORD123",
    "refund_date": "2026-01-31T15:30:00Z",
    "requested_by": {
        "name": "Admin User",
        "email": "admin@company.com"
    },
    "amount": {
        "original": "15000.00",
        "refund": "15000.00",
        "currency": "LKR",
        "type": "full"
    },
    "customer": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+94 77 123 4567",
        "id": "CUST-456"
    },
    "bank_account": {
        "bank_name": "Bank of Ceylon",
        "account_number": "1234567890123456",
        "account_holder": "John Doe",
        "branch": "Colombo Main Branch",
        "swift_code": "BCEYLKLX"
    },
    "reason": {
        "code": "CUSTOMER_REQUEST",
        "details": "Customer requested order cancellation..."
    },
    "timeline": {
        "process_by": "2026-02-02",
        "customer_expectation": "3-5 business days"
    }
}
```

### Expected Outcome
- Comprehensive refund instructions
- All information needed for processing
- Clear step-by-step guidance
- Printable/PDF format available
- Finance team can process efficiently

### Verification Checklist
- [ ] Instruction format defined
- [ ] Refund reference included
- [ ] Transaction IDs included
- [ ] Refund amount details clear
- [ ] Customer information complete
- [ ] Customer bank details included
- [ ] Refund reason explained
- [ ] Processing steps listed
- [ ] Verification checklist provided
- [ ] Timeline expectations set
- [ ] Contact information included
- [ ] PDF generation implemented (optional)
- [ ] Template supports full and partial refunds

---

## Task 27: Create Status Transitions

### Overview
Define and implement valid status transition rules for bank transfer payments. Create validation logic that ensures transactions can only move between allowed states, preventing invalid state changes and maintaining data integrity throughout the payment lifecycle.

### Dependencies
- Task 15: Create BankTransferProcessor
- All payment methods (Tasks 17-26) must be complete
- Transaction status enum must be defined

### Instructions

1. **Define status enum or constants**
   - PENDING: Awaiting payment
   - CONFIRMED: Payment verified
   - REJECTED: Payment rejected
   - EXPIRED: Payment deadline passed
   - REFUNDED: Payment refunded
   - Ensure all statuses are defined

2. **Create transition matrix**
   - Define allowed transitions from each status
   - Document business rules for each transition
   - Identify terminal states (no further transitions)

3. **Implement transition validation**
   - Create method: can_transition_to(current_status, new_status)
   - Return True if transition is valid
   - Return False if transition is invalid
   - Include reason for invalid transitions

4. **Add transition guards**
   - Additional conditions beyond status
   - Example: Can only confirm if proof uploaded
   - Example: Can only refund if confirmed
   - Check business rules

5. **Create transition triggers**
   - Method for each major transition
   - trigger_confirmation(), trigger_rejection(), etc.
   - Wrap status update with validation
   - Call appropriate handlers

6. **Add transition logging**
   - Log every status change
   - Record old status, new status
   - Record who triggered change
   - Record timestamp and reason

7. **Implement state machine (optional)**
   - Use state machine library if available
   - Define states and transitions formally
   - Add entry/exit actions for states
   - Enforce constraints automatically

8. **Add transition history**
   - Store history of all transitions
   - Include transition path
   - Support audit requirements
   - Enable status rollback if needed

9. **Handle invalid transitions**
   - Raise appropriate exceptions
   - Provide clear error messages
   - Log invalid attempts
   - Alert on suspicious patterns

10. **Create transition diagrams**
    - Visual representation of state machine
    - Document in code comments or docs
    - Include in API documentation
    - Help developers understand flow

### Transition Matrix

| From Status | To Status | Allowed? | Trigger Method | Conditions |
|-------------|-----------|----------|----------------|------------|
| PENDING | CONFIRMED | ✓ Yes | confirm_payment() | Proof verified by admin |
| PENDING | REJECTED | ✓ Yes | reject_payment() | Proof rejected by admin |
| PENDING | EXPIRED | ✓ Yes | Auto (Celery) | expires_at passed |
| CONFIRMED | REFUNDED | ✓ Yes | process_refund() | Admin requests refund |
| REJECTED | * | ✗ No | - | Terminal state |
| EXPIRED | * | ✗ No | - | Terminal state |
| REFUNDED | * | ✗ No | - | Terminal state |
| CONFIRMED | PENDING | ✗ No | - | Can't revert |
| CONFIRMED | REJECTED | ✗ No | - | Can't reject after confirm |
| CONFIRMED | EXPIRED | ✗ No | - | Can't expire after confirm |

### State Diagram

```
                  ┌─────────────┐
                  │   PENDING   │ ← Initial State
                  └─────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         │               │               │
    Confirm          Reject           Expire
      Admin           Admin          Celery
         │               │               │
         ▼               ▼               ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │CONFIRMED │    │ REJECTED │    │ EXPIRED  │
  └──────────┘    └──────────┘    └──────────┘
       │               │               │
   Refund         (Terminal)      (Terminal)
    Admin              │               │
       │               │               │
       ▼               │               │
  ┌──────────┐        │               │
  │ REFUNDED │        │               │
  └──────────┘        │               │
       │              │               │
   (Terminal)         │               │
       └──────────────┴───────────────┘
```

### Transition Validation Implementation

```python
class BankTransferProcessor:
    
    TRANSITION_MATRIX = {
        TransactionStatus.PENDING: [
            TransactionStatus.CONFIRMED,
            TransactionStatus.REJECTED,
            TransactionStatus.EXPIRED
        ],
        TransactionStatus.CONFIRMED: [
            TransactionStatus.REFUNDED
        ],
        TransactionStatus.REJECTED: [],  # Terminal
        TransactionStatus.EXPIRED: [],   # Terminal
        TransactionStatus.REFUNDED: []   # Terminal
    }
    
    def can_transition_to(
        self,
        current_status: TransactionStatus,
        new_status: TransactionStatus
    ) -> tuple[bool, str]:
        """
        Check if transition is valid.
        Returns: (is_valid, reason)
        """
        allowed_transitions = self.TRANSITION_MATRIX.get(current_status, [])
        
        if new_status in allowed_transitions:
            return (True, "Transition allowed")
        else:
            return (False, f"Cannot transition from {current_status} to {new_status}")
    
    def transition_status(
        self,
        transaction: PaymentTransaction,
        new_status: TransactionStatus,
        triggered_by: str,
        reason: str = None
    ) -> bool:
        """
        Perform status transition with validation.
        """
        is_valid, message = self.can_transition_to(
            transaction.status,
            new_status
        )
        
        if not is_valid:
            raise InvalidTransitionError(message)
        
        # Log transition
        self._log_transition(
            transaction,
            old_status=transaction.status,
            new_status=new_status,
            triggered_by=triggered_by,
            reason=reason
        )
        
        # Update status
        transaction.status = new_status
        transaction.save()
        
        return True
```

### Terminal States

| Status | Terminal | Reason | Next Action |
|--------|----------|--------|-------------|
| REJECTED | Yes | Admin rejected | Customer can retry with new order |
| EXPIRED | Yes | Time limit exceeded | Customer can place new order |
| REFUNDED | Yes | Refund completed | Transaction complete |
| CONFIRMED | No | Can be refunded | May transition to REFUNDED |
| PENDING | No | Awaiting action | Will transition eventually |

### Transition Guards

```python
def can_confirm_payment(transaction):
    """Additional checks beyond status"""
    if transaction.status != TransactionStatus.PENDING:
        return False, "Not in PENDING status"
    
    if not transaction.has_payment_proof():
        return False, "No payment proof uploaded"
    
    if transaction.is_expired():
        return False, "Transaction has expired"
    
    return True, "Can confirm"

def can_refund_payment(transaction):
    """Check refund eligibility"""
    if transaction.status != TransactionStatus.CONFIRMED:
        return False, "Must be CONFIRMED to refund"
    
    if transaction.refunded_amount >= transaction.amount:
        return False, "Already fully refunded"
    
    return True, "Can refund"
```

### Expected Outcome
- Clear transition rules defined
- Validation prevents invalid transitions
- All transitions logged
- Terminal states enforced
- State machine documented

### Verification Checklist
- [ ] All statuses defined
- [ ] Transition matrix created
- [ ] Validation method implemented
- [ ] Guards for business rules added
- [ ] Terminal states identified
- [ ] Transition logging implemented
- [ ] Invalid transitions rejected
- [ ] Error messages clear
- [ ] State diagram documented
- [ ] All methods use validation
- [ ] Tests for all transitions
- [ ] Edge cases handled

---

## Task 28: Verify Processor

### Overview
Perform comprehensive verification of the BankTransferProcessor to ensure all components work correctly together. Test the complete payment lifecycle, validate all methods, verify error handling, and ensure the processor integrates properly with the payment system.

### Dependencies
- All Tasks 15-27 must be complete
- Test data and fixtures prepared
- Test environment configured

### Instructions

1. **Create processor test suite**
   - Navigate to tests directory
   - Create test file for BankTransferProcessor
   - Import necessary models and fixtures
   - Set up test database

2. **Test processor instantiation**
   - Verify processor can be instantiated
   - Test gateway_type is correct
   - Test with valid tenant
   - Test without tenant (should error)

3. **Test factory registration**
   - Verify processor registered with factory
   - Test factory can retrieve processor
   - Test factory instantiates correctly
   - Verify gateway type mapping

4. **Test initiate_payment flow**
   - Create test payment intent
   - Call initiate_payment()
   - Verify PaymentResult returned
   - Verify transaction created
   - Verify status is PENDING
   - Verify bank details in result
   - Verify payment reference generated
   - Verify expiry calculated

5. **Test verify_payment method**
   - Create test transaction
   - Call verify_payment()
   - Verify correct status returned
   - Test with expired transaction
   - Test with invalid transaction_id

6. **Test confirm_payment flow**
   - Create pending transaction
   - Upload test payment proof
   - Call confirm_payment()
   - Verify status changed to CONFIRMED
   - Verify order status updated
   - Verify confirmation email sent (mock)

7. **Test reject_payment flow**
   - Create pending transaction
   - Call reject_payment() with reason
   - Verify status changed to REJECTED
   - Verify rejection reason stored
   - Verify notification sent (mock)

8. **Test expiry checking**
   - Create expired transaction
   - Call is_expired()
   - Verify returns True
   - Test with valid transaction
   - Verify returns False

9. **Test expiry Celery task**
   - Create multiple expired transactions
   - Run expire_pending_payments task
   - Verify all marked as EXPIRED
   - Verify orders cancelled
   - Check task return value

10. **Test process_refund flow**
    - Create confirmed transaction
    - Call process_refund()
    - Verify refund record created
    - Verify instructions generated
    - Verify status changed to REFUNDED

11. **Test status transitions**
    - Test each valid transition
    - Test invalid transitions (should error)
    - Verify guards work correctly
    - Test terminal states

12. **Test error scenarios**
    - Invalid payment intent
    - No bank accounts configured
    - Missing configuration
    - Invalid transaction ID
    - Permission denied scenarios
    - Database errors

13. **Test multi-tenancy isolation**
    - Create transactions for multiple tenants
    - Verify tenant A can't access tenant B transactions
    - Test cross-tenant security

14. **Integration testing**
    - Test complete flow: initiate → upload proof → confirm
    - Test rejection flow: initiate → upload proof → reject
    - Test expiry flow: initiate → wait → expire
    - Test refund flow: initiate → confirm → refund

15. **Performance testing**
    - Test with large number of bank accounts
    - Test expiry task with many transactions
    - Monitor query counts
    - Check for N+1 queries

16. **Document test results**
    - Record test coverage percentage
    - Document any issues found
    - Create test report
    - Update documentation

### Test Structure

```python
class BankTransferProcessorTestCase(TestCase):
    
    def setUp(self):
        # Create test tenant
        # Create test bank accounts
        # Create test configuration
        # Create test users
        pass
    
    def test_processor_instantiation(self):
        """Test processor can be created"""
        pass
    
    def test_initiate_payment_success(self):
        """Test successful payment initiation"""
        pass
    
    def test_initiate_payment_no_accounts(self):
        """Test error when no bank accounts"""
        pass
    
    def test_confirm_payment_success(self):
        """Test successful payment confirmation"""
        pass
    
    def test_confirm_payment_invalid_status(self):
        """Test error when confirming non-pending"""
        pass
    
    def test_reject_payment_success(self):
        """Test successful payment rejection"""
        pass
    
    def test_expiry_task(self):
        """Test Celery expiry task"""
        pass
    
    def test_process_refund_success(self):
        """Test successful refund processing"""
        pass
    
    def test_status_transitions(self):
        """Test valid and invalid transitions"""
        pass
    
    def test_multi_tenancy_isolation(self):
        """Test tenant data isolation"""
        pass
```

### Test Scenarios

| Scenario | Test Cases | Expected Result |
|----------|------------|-----------------|
| Happy Path | Initiate → Upload → Confirm → Order Fulfilled | All steps succeed |
| Rejection | Initiate → Upload → Reject | Transaction rejected, order cancelled |
| Expiry | Initiate → Wait → Auto-expire | Transaction expired, order cancelled |
| Refund | Initiate → Confirm → Refund | Refund record created with instructions |
| No Accounts | Initiate payment with no accounts | Error raised |
| Invalid Status | Confirm already confirmed | Error raised |
| Expired Confirm | Confirm expired transaction | Error raised |
| Cross-Tenant | Access other tenant's transaction | Permission denied |

### Verification Checklist

```
Processor Core:
[ ] Processor instantiates correctly
[ ] Gateway type is BANK_TRANSFER
[ ] Registered with factory
[ ] Factory retrieves processor

Initiate Payment:
[ ] Creates pending transaction
[ ] Generates payment reference
[ ] Calculates expiry correctly
[ ] Returns bank details
[ ] Handles no accounts error

Verify Payment:
[ ] Returns current status
[ ] Includes payment proof status
[ ] Handles not found
[ ] Checks expiry

Confirm Payment:
[ ] Updates to CONFIRMED
[ ] Updates order status
[ ] Sends notification
[ ] Logs transaction history
[ ] Validates permissions
[ ] Rejects invalid statuses

Reject Payment:
[ ] Updates to REJECTED
[ ] Stores rejection reason
[ ] Updates order status
[ ] Sends notification
[ ] Handles refund if needed

Expiry:
[ ] is_expired() works correctly
[ ] Celery task finds expired
[ ] Updates to EXPIRED status
[ ] Cancels orders
[ ] Task logs execution

Refund:
[ ] Creates refund record
[ ] Updates to REFUNDED
[ ] Generates instructions
[ ] Notifies finance team
[ ] Validates amount

Status Transitions:
[ ] Valid transitions allowed
[ ] Invalid transitions blocked
[ ] Guards work correctly
[ ] Terminal states enforced

Error Handling:
[ ] Invalid inputs handled
[ ] Database errors caught
[ ] Permission errors raised
[ ] Clear error messages

Security:
[ ] Tenant isolation works
[ ] Permissions enforced
[ ] Cross-tenant blocked

Performance:
[ ] No N+1 queries
[ ] Expiry task efficient
[ ] Reasonable response times
```

### Expected Outcome
- Complete test coverage of processor
- All components verified working
- Edge cases handled correctly
- Security validated
- Performance acceptable
- Documentation updated

### Verification Checklist
- [ ] Test suite created
- [ ] All methods have tests
- [ ] Happy path tested
- [ ] Error cases tested
- [ ] Edge cases covered
- [ ] Security tested
- [ ] Multi-tenancy validated
- [ ] Integration tests pass
- [ ] Performance acceptable
- [ ] Code coverage > 80%
- [ ] All tests passing
- [ ] Issues documented
- [ ] Test report created

---

## Summary

This document completed the BankTransferProcessor implementation with rejection handling, automatic expiry processing, manual refund workflow, state transition management, and comprehensive verification. The processor now handles the complete bank transfer payment lifecycle including all success and failure scenarios.

### Completed Tasks
1. ✓ Created reject_payment method for payment rejection
2. ✓ Implemented expiry check logic
3. ✓ Created Celery periodic task for auto-expiry
4. ✓ Implemented process_refund for manual refunds
5. ✓ Generated refund instructions for finance team
6. ✓ Defined and enforced status transitions
7. ✓ Verified complete processor functionality

### Next Steps
Proceed to [Group-C_Payment-Reference-Instructions](../Group-C_Payment-Reference-Instructions/) to implement payment reference generation, customer instructions, receipt handling, and frontend integration for the bank transfer payment flow.
