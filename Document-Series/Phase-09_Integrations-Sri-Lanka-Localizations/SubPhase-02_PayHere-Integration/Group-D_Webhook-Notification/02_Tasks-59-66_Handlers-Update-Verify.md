# Tasks 59-66: Status Handlers, Updates, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** D - Webhook & Notification  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-58_View-Signature-Parser.md](01_Tasks-51-58_View-Signature-Parser.md)

---

## Document Overview

Implement PayHere webhook status handlers, order updates, transaction recording, and verification. Map PayHere status codes to internal payment statuses, handle each status type appropriately, update orders and payment records, and verify complete webhook processing.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Status Code Mapping | Low | 15 min |
| 60 | Create Success Handler | Medium | 35 min |
| 61 | Create Pending Handler | Low | 20 min |
| 62 | Create Failed Handler | Low | 25 min |
| 63 | Create Chargeback Handler | Medium | 30 min |
| 64 | Create Order Update | Medium | 35 min |
| 65 | Create Transaction Record | Medium | 30 min |
| 66 | Verify Webhook Processing | Low | 25 min |

---

## Task 59: Create Status Code Mapping

### Overview
Map PayHere status codes to internal PaymentStatus enum values. PayHere uses numeric status codes (2, 0, -1, -2, -3, -4) to indicate payment outcomes. Create a clear mapping that translates these codes to meaningful internal statuses.

### Dependencies
- Task 58: Create Webhook Parser
- PaymentStatus enum exists (from core payment infrastructure)

### Instructions

1. **Review PayHere status codes**
   - Understand PayHere's status code system
   - 2 = Success (payment completed)
   - 0 = Pending (awaiting confirmation)
   - -1 = Cancelled (user cancelled payment)
   - -2 = Failed (payment processing failed)
   - -3 = Charged back (payment reversed)
   - -4 = Chargeback (additional chargeback code)

2. **Create status mapping dictionary**
   - Create constant named PAYHERE_STATUS_MAP
   - Map each PayHere code to PaymentStatus enum
   - Place in payments/constants.py or webhooks/payhere.py

3. **Define status mapping**
   - Map 2 → PaymentStatus.SUCCESS
   - Map 0 → PaymentStatus.PENDING
   - Map -1 → PaymentStatus.CANCELLED
   - Map -2 → PaymentStatus.FAILED
   - Map -3 → PaymentStatus.CHARGEDBACK (or FAILED if no chargeback status)
   - Map -4 → PaymentStatus.CHARGEDBACK

4. **Create mapping function**
   - Create function named `map_payhere_status`
   - Accept status_code parameter (integer)
   - Return corresponding PaymentStatus enum value
   - Raise ValueError for unknown status codes

5. **Add default handling**
   - Handle unknown status codes gracefully
   - Log warning for unmapped codes
   - Consider returning PENDING or UNKNOWN for safety
   - Document that PayHere may introduce new codes

6. **Add reverse mapping (optional)**
   - Create reverse map for internal status → PayHere code
   - Useful for API responses or logging
   - Named INTERNAL_TO_PAYHERE_STATUS

7. **Document status meanings**
   - Add comments explaining each status
   - Note when each status occurs
   - Include handling recommendations

### PayHere Status Codes

```
PayHere Status Codes:
├── 2: Success
│   ├── Payment successfully completed
│   ├── Funds captured
│   └── Order can be fulfilled
│
├── 0: Pending
│   ├── Payment initiated but not confirmed
│   ├── Awaiting bank confirmation
│   └── Will receive another webhook with final status
│
├── -1: Cancelled
│   ├── User cancelled payment
│   ├── Deliberately abandoned
│   └── No funds captured
│
├── -2: Failed
│   ├── Payment processing failed
│   ├── Card declined or error
│   └── No funds captured
│
├── -3: Charged Back (older code)
│   ├── Payment was reversed
│   ├── Customer disputed charge
│   └── Funds withdrawn from merchant
│
└── -4: Chargeback (current code)
    ├── Payment was reversed
    ├── Customer disputed charge
    └── Funds withdrawn from merchant
```

### Status Mapping Structure

```
PAYHERE_STATUS_MAP = {
    2: PaymentStatus.SUCCESS,
    0: PaymentStatus.PENDING,
    -1: PaymentStatus.CANCELLED,
    -2: PaymentStatus.FAILED,
    -3: PaymentStatus.CHARGEDBACK,
    -4: PaymentStatus.CHARGEDBACK,
}

PAYHERE_STATUS_DESCRIPTIONS = {
    2: "Payment successfully completed",
    0: "Payment pending confirmation",
    -1: "Payment cancelled by user",
    -2: "Payment failed during processing",
    -3: "Payment charged back (old code)",
    -4: "Payment charged back",
}
```

### Mapping Function

```
def map_payhere_status(status_code: int) -> PaymentStatus:
    """
    Map PayHere status code to internal PaymentStatus.
    
    Args:
        status_code: PayHere numeric status code
        
    Returns:
        Corresponding PaymentStatus enum value
        
    Raises:
        ValueError: If status code is unknown
    """
    if status_code not in PAYHERE_STATUS_MAP:
        logger.warning(f"Unknown PayHere status code: {status_code}")
        # Option 1: Raise error
        raise ValueError(f"Unknown PayHere status: {status_code}")
        # Option 2: Return default (safer)
        # return PaymentStatus.PENDING
    
    return PAYHERE_STATUS_MAP[status_code]
```

### Implementation Notes

- **Integer keys**: PayHere sends status_code as integer, not string
- **Negative numbers**: Many failure codes are negative (use proper integer keys)
- **Case handling**: Decide whether to error or default for unknown codes
- **Future codes**: PayHere may add new codes; plan for extensibility

### Status Flow Diagram

```
PayHere Status → Internal Status

    2 ──────────► SUCCESS
                  (Mark order paid, fulfill)

    0 ──────────► PENDING
                  (Wait for final webhook)

   -1 ──────────► CANCELLED
                  (User action, no retry)

   -2 ──────────► FAILED
                  (Processing error, can retry)

   -3 ──────────► CHARGEDBACK
   -4 ──────────► (Disputed payment, investigate)
```

### Testing Strategy

- Test mapping for all known status codes
- Test with unknown status code
- Test status code type (integer vs string)
- Verify enum values are correct
- Test reverse mapping if implemented

---

## Task 60: Create Success Handler

### Overview
Handle successful payment webhooks (status_code=2). Update payment status, mark order as paid, emit payment success signals, and trigger order fulfillment processes. This is the most important handler as it represents completed payments.

### Dependencies
- Task 59: Create Status Code Mapping
- Task 58: Create Webhook Parser
- Task 64: Create Order Update (implemented together)

### Instructions

1. **Create success handler function**
   - Create function named `handle_payment_success`
   - Accept webhook_data parameter (parsed data dict)
   - Accept payment instance (Payment model)
   - Return success boolean or raise exception

2. **Extract payment details**
   - Extract payment_id (PayHere transaction ID)
   - Extract payhere_amount (paid amount)
   - Extract method (payment method used)
   - Extract card details if available

3. **Validate payment amount**
   - Compare payhere_amount with payment.amount
   - Allow small discrepancies (rounding differences)
   - Log warning if amounts don't match
   - Consider failing if difference is significant

4. **Update payment record**
   - Set payment.status = PaymentStatus.SUCCESS
   - Set payment.gateway_reference = payment_id
   - Set payment.paid_at = timezone.now()
   - Set payment.gateway_response = webhook_data (full data)
   - Save payment instance

5. **Update related order**
   - Get payment.order
   - Call update_order_on_success() (Task 64)
   - Mark order as paid
   - Set order.paid_at timestamp

6. **Emit payment success signal**
   - Define Django signal: payment_success
   - Send signal with payment instance
   - Include order and webhook_data
   - Listeners can trigger fulfillment, emails, etc.

7. **Trigger post-payment actions**
   - Send payment confirmation email to customer
   - Notify admin of successful payment
   - Log payment success for audit trail
   - Consider queuing order fulfillment task

8. **Handle idempotency**
   - Check if payment already marked as success
   - If already successful, log warning and skip processing
   - Return success without re-processing
   - Prevent duplicate email/fulfillment triggers

9. **Add comprehensive logging**
   - Log payment success with order_id and payment_id
   - Log payment amount and method
   - Log any amount discrepancies
   - Include customer information for support

### Success Handler Flow

```
┌─────────────────────────┐
│ Webhook: status_code=2  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Parse Webhook Data     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Find Payment Record    │ ──► By order_id
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Check Already Success  │
└───────────┬─────────────┘
            │
       ┌────┴────┐
       │         │
   Already   Not Yet
   Success   Success
       │         │
       │         ▼
       │    Validate Amount
       │         │
       │         ▼
       │    Update Payment
       │    ├─ status = SUCCESS
       │    ├─ gateway_reference
       │    ├─ paid_at
       │    └─ gateway_response
       │         │
       │         ▼
       │    Update Order (Task 64)
       │    ├─ status = PAID
       │    └─ paid_at
       │         │
       │         ▼
       │    Emit Signal
       │    └─ payment_success
       │         │
       │         ▼
       │    Post-Payment Actions
       │    ├─ Send email
       │    ├─ Notify admin
       │    └─ Queue fulfillment
       │         │
       └─────────┴──► Return Success
```

### Payment Update Structure

```
Payment Record Updates:
├── status: PENDING → SUCCESS
├── gateway_reference: "PH123456789" (PayHere payment_id)
├── paid_at: timezone.now()
├── gateway_response: {full webhook data}
├── amount_paid: Decimal from webhook
├── payment_method: "VISA", "MASTER", etc.
└── card_details: {masked card info}

Order Record Updates (Task 64):
├── status: PENDING → PAID
├── paid_at: timezone.now()
├── payment_method: "PayHere VISA"
└── payment_gateway: "PayHere"
```

### Amount Validation

```
Amount Comparison:
├── Expected: payment.amount (from order)
├── Received: payhere_amount (from webhook)
├── Match: Amounts equal → Continue
├── Close: Difference < 0.01 → Warn and continue
└── Mismatch: Difference > 0.01 → Error and investigate

Example:
Expected: 5000.00 LKR
Received: 5000.00 LKR
Action: Continue (exact match)

Expected: 5000.00 LKR
Received: 5000.01 LKR
Action: Log warning, continue (rounding difference)

Expected: 5000.00 LKR
Received: 4500.00 LKR
Action: Log error, investigate (significant difference)
```

### Signal Definition

```
# Define signal
payment_success = django.dispatch.Signal()

# Send signal
payment_success.send(
    sender=Payment,
    payment=payment_instance,
    order=order_instance,
    webhook_data=webhook_data,
    amount=Decimal('5000.00'),
    payment_method='VISA'
)

# Signal listeners (registered elsewhere)
@receiver(payment_success)
def send_confirmation_email(sender, payment, **kwargs):
    """Send payment confirmation email to customer"""
    ...

@receiver(payment_success)
def queue_fulfillment(sender, order, **kwargs):
    """Queue order for fulfillment"""
    ...
```

### Implementation Notes

- **Idempotency is critical**: Webhooks can be sent multiple times
- **Atomic operations**: Use database transactions for payment+order updates
- **Signal vs direct calls**: Signals allow decoupled post-payment actions
- **Email throttling**: Prevent duplicate emails on webhook retries

### Error Handling

```
Payment Not Found:
├── Log error with order_id
├── Return 200 OK (webhook might be delayed)
└── Consider queuing for retry

Amount Mismatch:
├── Log error with both amounts
├── Update payment but flag for review
├── Notify admin for investigation
└── Continue processing (user paid, honor it)

Order Already Paid:
├── Log warning with payment IDs
├── Skip duplicate processing
├── Return success
└── Check for double-charge issue

Database Error:
├── Log exception with traceback
├── Retry transaction
├── Return 200 OK (will retry webhook)
└── Alert admin if persistent
```

### Testing Strategy

- Test successful payment processing
- Test idempotency (duplicate webhooks)
- Test amount validation (exact, close, mismatch)
- Test signal emission and listeners
- Test order status updates
- Test email sending (don't send duplicates)
- Test with various payment methods (VISA, MASTER, etc.)
- Use PayHere sandbox for real webhook tests

---

## Task 61: Create Pending Handler

### Overview
Handle pending payment webhooks (status_code=0). Keep payment in pending state, log the pending notification, and wait for final status webhook. Pending status occurs when payment is initiated but not yet confirmed by the bank.

### Dependencies
- Task 59: Create Status Code Mapping
- Task 58: Create Webhook Parser

### Instructions

1. **Create pending handler function**
   - Create function named `handle_payment_pending`
   - Accept webhook_data parameter
   - Accept payment instance
   - Return success (no major processing needed)

2. **Update payment status**
   - Keep or set payment.status = PaymentStatus.PENDING
   - Update payment.gateway_response with webhook data
   - Set payment.last_updated = timezone.now()
   - Do NOT mark order as paid

3. **Log pending notification**
   - Log that payment is pending confirmation
   - Include order_id and payment_id
   - Note: Awaiting final status webhook
   - Log for customer support reference

4. **Store webhook data**
   - Save webhook_data to payment.gateway_response
   - Maintain history of all webhooks (optional)
   - Update payment.updated_at timestamp

5. **Handle repeat pending webhooks**
   - Check if payment already pending
   - Log if receiving multiple pending webhooks
   - This can indicate delayed processing
   - Don't send customer notifications yet

6. **Set timeout monitoring (optional)**
   - Record when pending status received
   - Consider setting up timeout check (e.g., 30 minutes)
   - If no final status after timeout, investigate
   - Alert admin for stuck payments

7. **No customer notification**
   - Do NOT send confirmation email yet
   - Do NOT mark order as successful
   - Do NOT trigger fulfillment
   - Wait for final status (success or failed)

### Pending Handler Flow

```
┌─────────────────────────┐
│ Webhook: status_code=0  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Parse Webhook Data     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Find Payment Record    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Check Current Status   │
└───────────┬─────────────┘
            │
       ┌────┴────┐
       │         │
   Already   Not Pending
   Pending   Yet
       │         │
       │         ▼
       │    Update Status
       │    └─ status = PENDING
       │         │
       │         ▼
       │    Update Metadata
       │    ├─ gateway_response
       │    └─ updated_at
       │         │
       │         ▼
       │    Log Pending Status
       │         │
       │         ▼
       │    Set Timeout Monitor
       │         │
       └─────────┴──► Return Success
```

### Payment Update Structure

```
Payment Record Updates:
├── status: PENDING (no change or set to pending)
├── gateway_response: {latest webhook data}
├── updated_at: timezone.now()
└── pending_since: First pending webhook time

Metadata:
├── pending_webhook_count: Track repeat webhooks
├── first_pending_at: When first pending received
└── status_message: PayHere's status message
```

### Pending Status States

```
Pending Webhook Scenarios:

1. Initial Payment:
   ├── User initiated payment
   ├── Pending webhook received
   └── Awaiting bank confirmation
   Action: Wait for final webhook

2. Delayed Processing:
   ├── Payment processing taking longer than usual
   ├── Multiple pending webhooks received
   └── Bank confirmation pending
   Action: Continue waiting, monitor timeout

3. Timeout:
   ├── Pending for > 30 minutes (example threshold)
   ├── No final status received
   └── Possible stuck payment
   Action: Alert admin, contact PayHere

4. Final Status Received:
   ├── Success (status_code=2) → Process payment
   ├── Failed (status_code=-2) → Mark failed
   └── Cancelled (status_code=-1) → Mark cancelled
   Action: Handle with appropriate handler
```

### Timeout Monitoring

```
Optional Timeout Check:
├── Record payment.pending_since = timezone.now()
├── Create background task (Celery)
├── Check payments pending > threshold
├── Alert admin for investigation
└── Contact PayHere if necessary

Example Celery Task:
@periodic_task(run_every=timedelta(minutes=10))
def check_stuck_pending_payments():
    threshold = timezone.now() - timedelta(minutes=30)
    stuck_payments = Payment.objects.filter(
        status=PaymentStatus.PENDING,
        pending_since__lt=threshold
    )
    if stuck_payments.exists():
        alert_admin(stuck_payments)
```

### Implementation Notes

- **Pending is temporary**: Should resolve to success or failed
- **Don't alert customer**: Wait for final status to avoid confusion
- **Monitor timeouts**: Catch stuck payments early
- **Keep order unpaid**: Order should remain in unpaid state

### Error Handling

```
Payment Not Found:
├── Log warning with order_id
├── Payment might not be created yet
├── Return 200 OK
└── Will receive another webhook later

Multiple Pending Webhooks:
├── Log count of pending webhooks
├── Update timestamp each time
├── Normal for slow bank processing
└── Continue monitoring

Payment Already Completed:
├── Payment status is SUCCESS or FAILED
├── Receiving pending after completion
├── Log warning (timing issue)
└── Ignore pending webhook
```

### Testing Strategy

- Test pending webhook processing
- Test multiple pending webhooks for same payment
- Test pending followed by success webhook
- Test pending followed by failed webhook
- Test timeout monitoring if implemented
- Test that orders remain unpaid during pending
- Test no customer notifications sent
- Use PayHere sandbox with delayed confirmations

---

## Task 62: Create Failed Handler

### Overview
Handle failed payment webhooks (status_code=-1, -2, -3). Update payment status to failed, log failure reason, notify customer, and allow retry if appropriate. Different failure codes have different meanings and retry strategies.

### Dependencies
- Task 59: Create Status Code Mapping
- Task 58: Create Webhook Parser

### Instructions

1. **Create failed handler function**
   - Create function named `handle_payment_failed`
   - Accept webhook_data parameter
   - Accept payment instance
   - Handle multiple failure status codes

2. **Identify failure type**
   - Status code -1: User cancelled (deliberate)
   - Status code -2: Payment failed (technical/card issue)
   - Status code -3: Fraud/security rejection
   - Map to specific failure reasons

3. **Update payment record**
   - Set payment.status = PaymentStatus.FAILED (or CANCELLED)
   - Set payment.failure_reason from status_message
   - Set payment.failed_at = timezone.now()
   - Set payment.gateway_response = webhook_data

4. **Categorize failure reasons**
   - User cancellation: No retry needed
   - Card declined: Can retry with different card
   - Insufficient funds: Can retry when funded
   - Fraud detection: Requires investigation
   - Technical error: Can retry same payment method

5. **Update order status**
   - Keep order in PENDING or set to PAYMENT_FAILED
   - Do NOT mark order as paid
   - Increment order.payment_attempts
   - Consider order.max_payment_attempts limit

6. **Emit payment failed signal**
   - Define Django signal: payment_failed
   - Send signal with payment, order, and failure reason
   - Listeners can handle notifications, retries, etc.

7. **Notify customer**
   - Send payment failed email
   - Include failure reason (user-friendly message)
   - Provide retry link if retry allowed
   - Offer alternative payment methods

8. **Determine retry eligibility**
   - Allow retry for technical failures (-2)
   - Allow retry for card declined
   - NO retry for user cancellation (-1)
   - Investigate before retry for fraud (-3)

9. **Log failure details**
   - Log payment failure with reason
   - Include order_id, payment_id, status_code
   - Log customer information for support
   - Track failure patterns for analysis

### Failed Handler Flow

```
┌─────────────────────────────┐
│ Webhook: status_code=-1,-2  │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│  Parse Webhook Data         │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│  Find Payment Record        │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│  Identify Failure Type      │
└───────────┬─────────────────┘
            │
      ┌─────┼─────┬─────┐
      │     │     │     │
      ▼     ▼     ▼     ▼
   -1:    -2:   -3:   Other
  Cancel  Failed Fraud  Error
      │     │     │     │
      │     │     │     │
      └─────┴─────┴─────┘
            │
            ▼
┌─────────────────────────────┐
│  Update Payment             │
│  ├─ status = FAILED         │
│  ├─ failure_reason          │
│  ├─ failed_at               │
│  └─ gateway_response        │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│  Update Order               │
│  ├─ status = PAYMENT_FAILED │
│  └─ payment_attempts++      │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│  Emit payment_failed Signal │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│  Determine Retry Eligibility│
└───────────┬─────────────────┘
            │
       ┌────┴────┐
       │         │
   Retryable  No Retry
       │         │
       ▼         ▼
   Send Email  Send Email
   + Retry     (no retry)
     Link
       │         │
       └─────────┴──► Return Success
```

### Failure Status Codes

```
PayHere Failure Codes:

-1: Cancelled
├── User clicked cancel button
├── Deliberately abandoned payment
├── No technical issue
└── Action: Don't retry automatically

-2: Failed
├── Card declined by bank
├── Insufficient funds
├── Invalid card details
├── Technical processing error
└── Action: Allow retry with same or different card

-3: Fraud/Security
├── Payment flagged as suspicious
├── Security checks failed
├── Possible fraud attempt
└── Action: Investigate before allowing retry
```

### Payment Update Structure

```
Payment Record Updates:
├── status: PENDING → FAILED (or CANCELLED)
├── failure_reason: User-readable reason
├── failure_code: PayHere status_code (-1, -2, -3)
├── failed_at: timezone.now()
├── gateway_response: {full webhook data}
└── retry_eligible: Boolean based on failure type

Order Record Updates:
├── status: PAYMENT_FAILED
├── payment_attempts: Increment counter
├── last_payment_attempt: timezone.now()
└── payment_failure_reason: Store for display
```

### Failure Reasons Mapping

```
Status Message → User-Friendly Reason:

"Card declined" → "Your card was declined. Please try a different card or contact your bank."
"Insufficient funds" → "Insufficient funds. Please try a different card or add funds to your account."
"Invalid card details" → "Invalid card details. Please check your card information and try again."
"User cancelled" → "Payment was cancelled."
"Technical error" → "A technical error occurred. Please try again."
"Fraud detection" → "Payment could not be processed. Please contact support."
```

### Signal Definition

```
# Define signal
payment_failed = django.dispatch.Signal()

# Send signal
payment_failed.send(
    sender=Payment,
    payment=payment_instance,
    order=order_instance,
    failure_reason=failure_reason,
    status_code=status_code,
    retry_eligible=retry_eligible
)

# Signal listeners
@receiver(payment_failed)
def send_failure_email(sender, payment, failure_reason, retry_eligible, **kwargs):
    """Send payment failed email with retry link if eligible"""
    ...

@receiver(payment_failed)
def log_failure_analytics(sender, payment, failure_reason, **kwargs):
    """Track failure patterns for analysis"""
    ...
```

### Retry Logic

```
Retry Eligibility:

User Cancelled (-1):
├── retry_eligible = False
├── Don't show retry link
└── Offer to start new payment

Technical Failed (-2):
├── retry_eligible = True
├── Allow retry immediately
├── Suggest trying different card
└── Max 3 attempts per order

Fraud Detected (-3):
├── retry_eligible = False (initially)
├── Require admin review
├── Contact customer for verification
└── Enable retry after verification
```

### Implementation Notes

- **Distinguish failure types**: Different codes need different handling
- **User-friendly messages**: Don't expose technical details
- **Retry limits**: Prevent infinite retry attempts
- **Analytics**: Track failure patterns to identify issues

### Error Handling

```
Payment Not Found:
├── Log error with order_id
├── Return 200 OK
└── May be legitimate if order expired

Payment Already Completed:
├── Payment status is SUCCESS
├── Receiving failed after success (rare)
├── Log critical warning
└── Investigate potential double-charge

Multiple Failure Webhooks:
├── Payment already failed
├── Update with latest failure info
├── Don't send duplicate emails
└── Check idempotency
```

### Testing Strategy

- Test each failure status code (-1, -2, -3)
- Test failure reason extraction
- Test user notification emails
- Test retry link generation
- Test retry eligibility logic
- Test payment attempt counter
- Test max attempts limit
- Use PayHere sandbox with test card failures

---

## Task 63: Create Chargeback Handler

### Overview
Handle chargeback webhooks (status_code=-4). Chargebacks occur when customers dispute a payment through their bank. This is a serious issue requiring immediate attention, investigation, and admin notification.

### Dependencies
- Task 59: Create Status Code Mapping
- Task 58: Create Webhook Parser

### Instructions

1. **Create chargeback handler function**
   - Create function named `handle_payment_chargeback`
   - Accept webhook_data parameter
   - Accept payment instance
   - Prioritize as critical alert

2. **Update payment record**
   - Set payment.status = PaymentStatus.CHARGEDBACK
   - Set payment.chargedback_at = timezone.now()
   - Set payment.gateway_response = webhook_data
   - Set payment.requires_investigation = True

3. **Update order status**
   - Set order.status = CHARGEDBACK or DISPUTED
   - Do NOT automatically refund or cancel order
   - Flag order for manual review
   - Preserve order data for investigation

4. **Record chargeback details**
   - Create ChargebackRecord model (if not exists)
   - Store chargeback reason from webhook
   - Store chargeback date and amount
   - Link to original payment and order

5. **Emit chargeback signal**
   - Define Django signal: payment_chargedback
   - Send signal with payment and chargeback details
   - High priority signal for immediate action

6. **Alert administrators immediately**
   - Send urgent email to admin/finance team
   - Include order details, customer info, payment amount
   - Include PayHere payment_id for reference
   - Flag for immediate investigation

7. **Notify customer**
   - Send chargeback notification email
   - Request customer contact for resolution
   - Provide dispute process information
   - Include order details for reference

8. **Create investigation task**
   - Create task in admin panel for investigation
   - Assign to customer service or finance team
   - Set high priority flag
   - Include all relevant details

9. **Prevent fulfillment/access**
   - If order already fulfilled, flag for review
   - If not fulfilled, hold fulfillment
   - Revoke digital access if applicable
   - Prevent future orders from customer (optional)

10. **Log comprehensive details**
    - Log chargeback with full details
    - Include customer payment history
    - Include order fulfillment status
    - Create audit trail

### Chargeback Handler Flow

```
┌─────────────────────────┐
│ Webhook: status_code=-4 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Parse Webhook Data     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Find Payment Record    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Update Payment         │
│  └─ status = CHARGEDBACK│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Update Order           │
│  └─ status = DISPUTED   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Create Chargeback      │
│  Record                 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  URGENT: Alert Admin    │ ──► Email + SMS
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Notify Customer        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Create Investigation   │
│  Task                   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Hold/Revoke Fulfillment│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Emit Chargeback Signal │
└───────────┬─────────────┘
            │
            ▼
         Return Success
```

### Chargeback Data Structure

```
Payment Record Updates:
├── status: SUCCESS → CHARGEDBACK
├── chargedback_at: timezone.now()
├── chargeback_reason: From webhook
├── gateway_response: {full webhook data}
└── requires_investigation: True

Order Record Updates:
├── status: DISPUTED
├── hold_fulfillment: True
└── investigation_required: True

ChargebackRecord Model:
├── payment: ForeignKey(Payment)
├── order: ForeignKey(Order)
├── chargeback_date: DateTimeField
├── chargeback_amount: DecimalField
├── chargeback_reason: TextField
├── investigation_status: CharField
├── resolution: TextField
├── resolved_at: DateTimeField
└── resolved_by: ForeignKey(User)
```

### Chargeback Reasons

```
Common Chargeback Reasons:

1. Fraudulent Transaction:
   ├── Customer claims didn't make purchase
   ├── Card was stolen/compromised
   └── Action: Investigate order details, IP, delivery

2. Product Not Received:
   ├── Customer claims non-delivery
   ├── Fulfilled but customer disputes
   └── Action: Check delivery proof, tracking

3. Product Not as Described:
   ├── Customer claims product differs
   ├── Quality or description issues
   └── Action: Review product listing, photos

4. Duplicate Charge:
   ├── Customer charged multiple times
   ├── Error in processing
   └── Action: Check transaction history

5. Subscription Cancellation:
   ├── Customer claims cancelled subscription
   ├── Still charged
   └── Action: Review cancellation records

6. Credit Not Processed:
   ├── Refund promised but not given
   ├── Return accepted but no credit
   └── Action: Check refund records
```

### Admin Alert Format

```
Email Subject: [URGENT] Payment Chargeback - Order #ORD-123

Body:
═══════════════════════════════════════
🚨 PAYMENT CHARGEBACK ALERT
═══════════════════════════════════════

Order ID: ORD-123
Payment ID: PAY-456
PayHere Transaction: PH123456789
Chargeback Amount: LKR 5,000.00
Chargeback Date: 2026-01-31 14:30:00

CUSTOMER INFORMATION:
Name: John Doe
Email: john@example.com
Phone: +94771234567

ORDER STATUS:
Order Date: 2026-01-25
Fulfillment Status: Shipped
Tracking: TRK-789

CHARGEBACK REASON:
Fraudulent transaction

ACTION REQUIRED:
1. Review order and payment details
2. Check fulfillment/delivery status
3. Gather evidence for dispute
4. Contact customer if needed
5. Respond to PayHere within 7 days

INVESTIGATION TASK CREATED:
Task ID: INV-789
Assigned To: Finance Team
Priority: URGENT
Deadline: 2026-02-07

═══════════════════════════════════════
```

### Signal Definition

```
# Define signal
payment_chargedback = django.dispatch.Signal()

# Send signal
payment_chargedback.send(
    sender=Payment,
    payment=payment_instance,
    order=order_instance,
    chargeback_reason=chargeback_reason,
    chargeback_amount=chargeback_amount,
    webhook_data=webhook_data
)

# Signal listeners
@receiver(payment_chargedback)
def alert_admin_urgent(sender, payment, order, **kwargs):
    """Send urgent alert to administrators"""
    ...

@receiver(payment_chargedback)
def create_investigation_task(sender, payment, order, **kwargs):
    """Create investigation task in admin"""
    ...

@receiver(payment_chargedback)
def hold_order_fulfillment(sender, order, **kwargs):
    """Hold or revoke order fulfillment"""
    ...
```

### Implementation Notes

- **Chargebacks are serious**: They affect merchant standing with PayHere
- **Time-sensitive**: Usually 7-14 days to respond with evidence
- **Financial impact**: Chargeback fees + lost revenue
- **Prevention**: Better fraud detection, clear policies, good customer service

### Chargeback Prevention

```
Prevention Strategies:
├── Clear product descriptions
├── Visible refund/return policies
├── Proactive customer support
├── Fraud detection systems
├── Order confirmation emails
├── Delivery tracking and proof
├── Customer verification for high-value orders
└── Clear billing descriptor
```

### Testing Strategy

- Test chargeback webhook processing
- Test admin alert sending
- Test order status updates
- Test fulfillment hold
- Test investigation task creation
- Test customer notification
- Test chargeback record creation
- Use PayHere sandbox if chargeback testing available

---

## Task 64: Create Order Update

### Overview
Update order status and related fields when payment succeeds. Mark order as paid, set payment timestamp, update order status, and prepare for fulfillment. This bridges payment success to order processing.

### Dependencies
- Task 60: Create Success Handler
- Order model with payment relationship exists

### Instructions

1. **Create order update function**
   - Create function named `update_order_on_success`
   - Accept order instance parameter
   - Accept payment instance parameter
   - Update all relevant order fields

2. **Update order status**
   - Set order.status = OrderStatus.PAID
   - Previous status likely PENDING_PAYMENT
   - Transition to PAID confirms payment received

3. **Set payment timestamp**
   - Set order.paid_at = timezone.now()
   - Store when payment was confirmed
   - Used for reporting and fulfillment timing

4. **Store payment details**
   - Set order.payment_method from webhook (e.g., "PayHere VISA")
   - Set order.payment_gateway = "PayHere"
   - Set order.payment_reference = PayHere payment_id
   - Link to payment instance

5. **Update order metadata**
   - Set order.updated_at = timezone.now()
   - Set order.payment_confirmed = True
   - Increment order.payment_success_count if tracking
   - Clear any payment_failed flags

6. **Emit order paid signal**
   - Define Django signal: order_paid
   - Send signal with order and payment instances
   - Listeners trigger fulfillment, inventory update, etc.

7. **Queue fulfillment process**
   - If auto-fulfillment enabled, queue fulfillment task
   - Create FulfillmentTask for order
   - Update inventory reservations
   - Generate picking lists if physical goods

8. **Handle order transitions**
   - Use state machine if implemented
   - Validate transition PENDING_PAYMENT → PAID is allowed
   - Log state transition
   - Handle transition errors gracefully

9. **Add logging**
   - Log order payment confirmation
   - Include order_id, payment_id, amount
   - Log transition from previous status
   - Include customer info for support

### Order Update Flow

```
┌──────────────────────────┐
│  Payment Success         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Get Related Order       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Validate State          │
│  Transition              │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Update Order Status     │
│  └─ status = PAID        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Set Payment Timestamp   │
│  └─ paid_at = now()      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Store Payment Details   │
│  ├─ payment_method       │
│  ├─ payment_gateway      │
│  └─ payment_reference    │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Link Payment Instance   │
│  └─ order.payment = payment│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Emit order_paid Signal  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Queue Fulfillment       │
└──────────┬───────────────┘
           │
           ▼
         Return Success
```

### Order Status Transitions

```
Order Status Flow:

DRAFT
  │
  ▼
PENDING_PAYMENT ──► Payment Initiated
  │
  │ Payment Success
  ▼
PAID ──► Ready for Fulfillment
  │
  ▼
PROCESSING ──► Picking/Packing
  │
  ▼
SHIPPED ──► In Transit
  │
  ▼
DELIVERED ──► Complete

Failed Paths:
PENDING_PAYMENT ──► PAYMENT_FAILED ──► Retry or Cancel
PAID ──► REFUNDED ──► Payment Reversed
```

### Order Update Structure

```
Order Model Updates:

Status Fields:
├── status: PENDING_PAYMENT → PAID
├── payment_confirmed: False → True
└── can_be_fulfilled: True

Payment Fields:
├── paid_at: timezone.now()
├── payment_method: "PayHere VISA"
├── payment_gateway: "PayHere"
├── payment_reference: "PH123456789"
├── payment: ForeignKey to Payment instance
└── transaction_id: Gateway transaction ID

Metadata:
├── updated_at: timezone.now()
├── updated_by: System
└── payment_success_count: 1

Flags:
├── payment_failed: False
├── requires_manual_review: False (cleared if was set)
└── hold_fulfillment: False
```

### Signal Definition

```
# Define signal
order_paid = django.dispatch.Signal()

# Send signal
order_paid.send(
    sender=Order,
    order=order_instance,
    payment=payment_instance,
    amount=payment.amount,
    method=payment.payment_method
)

# Signal listeners
@receiver(order_paid)
def queue_fulfillment(sender, order, **kwargs):
    """Queue order for fulfillment"""
    if order.auto_fulfill:
        FulfillmentTask.create_for_order(order)

@receiver(order_paid)
def update_inventory(sender, order, **kwargs):
    """Convert inventory reservations to actual"""
    order.confirm_inventory_allocation()

@receiver(order_paid)
def send_order_confirmation(sender, order, **kwargs):
    """Send order confirmation email"""
    send_mail_template(
        'order_confirmed',
        to=order.customer.email,
        context={'order': order}
    )

@receiver(order_paid)
def sync_to_erp(sender, order, **kwargs):
    """Sync paid order to ERP system"""
    erp_sync.create_sales_order(order)
```

### Implementation Notes

- **Atomic updates**: Use database transactions for order+payment updates
- **State validation**: Ensure order can transition to PAID status
- **Idempotency**: Handle duplicate payment success webhooks
- **Signal timing**: Emit signals after database commit

### Error Handling

```
Order Not Found:
├── Payment has no related order
├── Log critical error
├── Alert admin
└── Don't fail payment processing

Invalid State Transition:
├── Order already paid or in wrong status
├── Log warning with current status
├── Check for duplicate webhook
└── Return success (already processed)

Database Error:
├── Transaction rollback
├── Retry update
├── Log error with traceback
└── Alert admin if persistent

Fulfillment Queue Error:
├── Order updated but fulfillment not queued
├── Log error
├── Retry fulfillment queue
└── Don't rollback order update
```

### Testing Strategy

- Test order status update on payment success
- Test payment timestamp setting
- Test payment details storage
- Test signal emission and listeners
- Test fulfillment queuing
- Test invalid state transitions
- Test duplicate payment webhooks
- Test with various order types (physical, digital, mixed)

---

## Task 65: Create Transaction Record

### Overview
Create and save comprehensive transaction records for all webhook events. Store complete payment transaction data including webhook payload, status changes, and audit trail. This ensures full payment history for reconciliation, debugging, and compliance.

### Dependencies
- Task 64: Create Order Update
- PaymentTransaction model exists (or create it)

### Instructions

1. **Create/verify transaction model**
   - Ensure PaymentTransaction model exists
   - Should track all payment events
   - Supports multiple transactions per payment

2. **Create transaction record function**
   - Create function named `create_transaction_record`
   - Accept payment instance parameter
   - Accept webhook_data parameter
   - Accept transaction_type parameter

3. **Define transaction types**
   - Create TransactionType enum
   - AUTHORIZATION: Payment authorized
   - CAPTURE: Payment captured/completed
   - REFUND: Payment refunded
   - CHARGEBACK: Payment charged back
   - WEBHOOK: General webhook event

4. **Store transaction details**
   - Link to payment instance
   - Link to order instance
   - Store gateway_reference (PayHere payment_id)
   - Store transaction_type
   - Store amount from webhook
   - Store currency

5. **Store webhook data**
   - Save full webhook_data as JSON
   - Store in gateway_response field
   - Include all PayHere fields
   - Useful for debugging and reconciliation

6. **Store status information**
   - Store previous payment status
   - Store new payment status
   - Store PayHere status_code
   - Store status_message from webhook

7. **Store metadata**
   - Transaction timestamp (from webhook or now)
   - IP address of webhook request
   - User agent if available
   - Request ID for correlation

8. **Create audit trail**
   - Record created_at timestamp
   - Record created_by (system)
   - Record all status transitions
   - Link to related transactions

9. **Handle transaction uniqueness**
   - Use gateway_reference as unique key
   - Check if transaction already recorded
   - Skip duplicate transaction creation
   - Update existing if needed

10. **Add logging**
    - Log transaction record creation
    - Include order_id, payment_id, transaction_id
    - Log transaction type and amount
    - Include status change information

### Transaction Record Flow

```
┌──────────────────────────┐
│  Webhook Processing      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Extract Transaction Data│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Check Existing Record   │
└──────────┬───────────────┘
           │
      ┌────┴────┐
      │         │
   Exists   Not Exists
      │         │
      │         ▼
      │    Create New Record
      │    ├─ payment
      │    ├─ order
      │    ├─ gateway_reference
      │    ├─ transaction_type
      │    ├─ amount
      │    ├─ status
      │    └─ gateway_response
      │         │
      └─────────┴──► Link to Payment
                     │
                     ▼
                Save Transaction
                     │
                     ▼
                Log Creation
                     │
                     ▼
                Return Transaction
```

### PaymentTransaction Model Structure

```
PaymentTransaction Model:
├── id: AutoField
├── payment: ForeignKey(Payment)
├── order: ForeignKey(Order)
├── gateway_reference: CharField (PayHere payment_id)
├── transaction_type: CharField (choices)
├── amount: DecimalField
├── currency: CharField (default "LKR")
├── status: CharField (PaymentStatus)
├── previous_status: CharField (for status changes)
├── status_code: IntegerField (PayHere status code)
├── status_message: TextField (from webhook)
├── gateway_response: JSONField (full webhook data)
├── ip_address: GenericIPAddressField
├── metadata: JSONField (additional data)
├── created_at: DateTimeField (auto_now_add)
├── updated_at: DateTimeField (auto_now)
└── processed: BooleanField (processing flag)

Indexes:
├── Index on gateway_reference (unique)
├── Index on payment + created_at
├── Index on order + created_at
└── Index on created_at (for reporting)
```

### Transaction Types

```
TransactionType Choices:

AUTHORIZATION:
├── Payment authorized but not captured
├── Funds reserved on card
└── Used by some gateways (not PayHere)

CAPTURE:
├── Payment captured/completed
├── Funds transferred
└── PayHere status_code=2

REFUND:
├── Payment refunded
├── Funds returned to customer
└── Triggered by refund API

CHARGEBACK:
├── Payment disputed
├── Chargeback initiated
└── PayHere status_code=-4

WEBHOOK_SUCCESS:
├── General success webhook
└── Status code 2

WEBHOOK_PENDING:
├── Pending status webhook
└── Status code 0

WEBHOOK_FAILED:
├── Failed payment webhook
└── Status codes -1, -2, -3

WEBHOOK_OTHER:
├── Other webhook events
└── For unknown status codes
```

### Stored Webhook Data

```
gateway_response Example:
{
    "merchant_id": "1234567",
    "order_id": "ORD-123",
    "payment_id": "PH123456789",
    "payhere_amount": "5000.00",
    "payhere_currency": "LKR",
    "status_code": 2,
    "status_message": "Success",
    "md5sig": "ABC123...",
    "method": "VISA",
    "card_holder_name": "JOHN DOE",
    "card_no": "************1234",
    "custom_1": "tenant:123",
    "custom_2": "user:456"
}

metadata Example:
{
    "ip_address": "123.45.67.89",
    "user_agent": "PayHere-Webhook/1.0",
    "webhook_received_at": "2026-01-31T14:30:00Z",
    "processing_duration_ms": 250,
    "previous_status": "PENDING",
    "new_status": "SUCCESS"
}
```

### Transaction Uniqueness

```
Unique Transaction Check:

By gateway_reference:
├── gateway_reference = PayHere payment_id
├── Should be unique per PayHere transaction
├── Check before creating new record
└── Update existing if duplicate webhook

Example:
existing = PaymentTransaction.objects.filter(
    gateway_reference=payment_id
).first()

if existing:
    # Duplicate webhook - update if needed
    existing.updated_at = timezone.now()
    existing.save()
    return existing
else:
    # New transaction - create record
    transaction = PaymentTransaction.objects.create(...)
    return transaction
```

### Implementation Notes

- **Store everything**: Complete webhook data for debugging
- **Immutable records**: Don't modify existing transactions
- **Audit trail**: Track all payment state changes
- **Reconciliation**: Use for payment reconciliation reports

### Error Handling

```
Duplicate Transaction:
├── gateway_reference already exists
├── Log warning about duplicate
├── Update timestamp
└── Return existing record

Missing Required Data:
├── webhook_data incomplete
├── Log error with available data
├── Create partial transaction record
└── Flag for review

Database Error:
├── Transaction creation failed
├── Log error with full webhook data
├── Retry creation
└── Alert admin if persistent

JSON Serialization Error:
├── webhook_data not JSON-serializable
├── Convert to string
├── Store as string in metadata
└── Log serialization error
```

### Reporting and Reconciliation

```
Transaction Reports:

Daily Reconciliation:
├── Query all transactions for date
├── Sum amounts by status
├── Compare with PayHere reports
└── Flag discrepancies

Payment History:
├── Get all transactions for payment
├── Show status progression
├── Display timeline
└── Link to order

Customer Payment History:
├── Get all transactions for customer
├── Show payment patterns
├── Track failures
└── Identify issues

Financial Reports:
├── Sum successful transactions
├── Sum refunds
├── Sum chargebacks
└── Calculate net revenue
```

### Testing Strategy

- Test transaction creation on webhook
- Test duplicate transaction handling
- Test transaction uniqueness (gateway_reference)
- Test all transaction types
- Test gateway_response storage
- Test transaction querying and filtering
- Test payment history retrieval
- Test reconciliation reports
- Use PayHere sandbox webhooks

---

## Task 66: Verify Webhook Processing

### Overview
Verify complete webhook processing flow end-to-end. Test all webhook scenarios, validate data integrity, check signal emissions, verify logging, and ensure idempotency. Create comprehensive tests and monitoring to ensure webhook reliability.

### Dependencies
- All previous tasks in this group (51-65)
- Test utilities and fixtures

### Instructions

1. **Create webhook test suite**
   - Create tests/test_payhere_webhook.py
   - Use Django TestCase or pytest
   - Mock PayHere webhook requests
   - Cover all status codes and scenarios

2. **Test webhook endpoint**
   - Test POST to /api/webhooks/payhere/
   - Verify 200 OK response always returned
   - Test CSRF exemption works
   - Test IP whitelist validation
   - Test invalid request method (GET, PUT, etc.)

3. **Test signature verification**
   - Test with valid PayHere signature
   - Test with invalid signature
   - Test with missing md5sig field
   - Test with tampered POST data
   - Verify security logging

4. **Test webhook parsing**
   - Test with complete webhook data
   - Test with missing optional fields
   - Test with missing required fields
   - Test with invalid data types
   - Test amount and currency parsing

5. **Test success handler**
   - Mock successful payment webhook (status_code=2)
   - Verify payment status updated to SUCCESS
   - Verify order status updated to PAID
   - Verify transaction record created
   - Verify signals emitted
   - Verify emails sent

6. **Test pending handler**
   - Mock pending webhook (status_code=0)
   - Verify payment remains PENDING
   - Verify order remains unpaid
   - Verify no customer notification
   - Test multiple pending webhooks

7. **Test failed handler**
   - Mock failed webhooks (status_code=-1, -2)
   - Verify payment status updated to FAILED
   - Verify failure reason stored
   - Verify customer notification sent
   - Test retry eligibility logic

8. **Test chargeback handler**
   - Mock chargeback webhook (status_code=-4)
   - Verify payment status updated to CHARGEDBACK
   - Verify order flagged for investigation
   - Verify admin alert sent
   - Verify transaction record created

9. **Test idempotency**
   - Send duplicate success webhooks
   - Verify only processed once
   - Verify no duplicate emails
   - Verify transaction uniqueness
   - Test with different orderings

10. **Test error handling**
    - Test with payment not found
    - Test with database errors (mock)
    - Test with signal handler errors
    - Verify always returns 200 OK
    - Verify error logging

11. **Create monitoring dashboard**
    - Track webhook success/failure rates
    - Monitor webhook processing time
    - Alert on signature verification failures
    - Alert on unusual patterns

12. **Create manual verification tools**
    - Admin action to resend webhook processing
    - Webhook log viewer
    - Transaction history viewer
    - Payment reconciliation report

### Test Structure

```
tests/test_payhere_webhook.py

class PayHereWebhookTestCase(TestCase):
    
    def setUp(self):
        """Create test data"""
        self.order = create_test_order()
        self.payment = create_test_payment(order=self.order)
        self.webhook_url = reverse('payhere-webhook')
    
    def test_webhook_success_status_code_2(self):
        """Test successful payment webhook"""
        ...
    
    def test_webhook_pending_status_code_0(self):
        """Test pending payment webhook"""
        ...
    
    def test_webhook_failed_status_code_minus_2(self):
        """Test failed payment webhook"""
        ...
    
    def test_webhook_chargeback_status_code_minus_4(self):
        """Test chargeback webhook"""
        ...
    
    def test_signature_verification_valid(self):
        """Test valid signature passes"""
        ...
    
    def test_signature_verification_invalid(self):
        """Test invalid signature rejected"""
        ...
    
    def test_webhook_idempotency(self):
        """Test duplicate webhooks handled correctly"""
        ...
    
    def test_webhook_parsing(self):
        """Test POST data parsing"""
        ...
    
    def test_transaction_record_creation(self):
        """Test transaction records created"""
        ...
    
    def test_order_update_on_success(self):
        """Test order updated when payment succeeds"""
        ...
```

### Verification Checklist

```
Webhook Endpoint:
☐ POST requests accepted
☐ Other methods return 200 OK
☐ CSRF exemption works
☐ IP whitelist validated (if enabled)
☐ Always returns 200 OK

Signature Verification:
☐ Valid signatures pass
☐ Invalid signatures rejected
☐ Missing signatures rejected
☐ Tampered data detected
☐ Timing-safe comparison used

Data Parsing:
☐ All required fields extracted
☐ Optional fields handled
☐ Data types validated
☐ Amounts parsed correctly
☐ Status codes mapped correctly

Success Handler (status_code=2):
☐ Payment status → SUCCESS
☐ Order status → PAID
☐ paid_at timestamp set
☐ Transaction record created
☐ payment_success signal emitted
☐ order_paid signal emitted
☐ Confirmation email sent
☐ Fulfillment queued

Pending Handler (status_code=0):
☐ Payment status → PENDING
☐ Order remains unpaid
☐ No customer notification
☐ Webhook data stored
☐ Multiple pending webhooks handled

Failed Handler (status_code=-1,-2,-3):
☐ Payment status → FAILED
☐ Failure reason stored
☐ payment_failed signal emitted
☐ Customer notification sent
☐ Retry eligibility determined
☐ Order payment_attempts incremented

Chargeback Handler (status_code=-4):
☐ Payment status → CHARGEDBACK
☐ Order flagged for investigation
☐ Admin alert sent (urgent)
☐ Customer notification sent
☐ Investigation task created
☐ Fulfillment held/revoked

Transaction Records:
☐ Created for all webhooks
☐ Full webhook data stored
☐ Unique by gateway_reference
☐ Audit trail complete
☐ Status changes tracked

Idempotency:
☐ Duplicate webhooks detected
☐ Only processed once
☐ No duplicate emails
☐ No duplicate transactions
☐ Safe to retry

Error Handling:
☐ Payment not found handled
☐ Invalid data handled
☐ Database errors handled
☐ Always returns 200 OK
☐ Errors logged

Logging:
☐ All webhooks logged
☐ IP addresses logged
☐ Processing time logged
☐ Errors logged with details
☐ Success logged

Signals:
☐ payment_success signal works
☐ payment_failed signal works
☐ payment_chargedback signal works
☐ order_paid signal works
☐ Signal listeners called
```

### Manual Testing with PayHere Sandbox

```
Test Scenarios:

1. Successful Payment:
   ├── Complete payment in sandbox
   ├── Verify webhook received
   ├── Check payment status updated
   ├── Check order marked paid
   └── Verify email sent

2. Cancelled Payment:
   ├── Initiate payment and cancel
   ├── Verify webhook received
   ├── Check payment status failed
   └── Check retry link provided

3. Failed Card:
   ├── Use test card that fails
   ├── Verify webhook received
   ├── Check failure reason stored
   └── Verify customer notified

4. Pending Then Success:
   ├── Payment goes pending first
   ├── Verify pending webhook processed
   ├── Then success webhook received
   └── Verify final status correct

5. Duplicate Webhooks:
   ├── PayHere may send multiple times
   ├── Verify idempotency
   ├── Check no duplicate processing
   └── Verify single email sent
```

### Monitoring Setup

```
Webhook Monitoring Metrics:

Response Time:
├── Track webhook processing time
├── Alert if > 5 seconds
└── Investigate slow webhooks

Success Rate:
├── Track signature verification success rate
├── Alert if < 95%
└── Investigate failures

Status Distribution:
├── Track status code distribution
├── Success (2): Should be highest
├── Pending (0): Should be low
├── Failed (-1,-2): Monitor trend
└── Chargeback (-4): Alert on any

Error Rate:
├── Track webhook processing errors
├── Alert if > 1%
└── Investigate causes

Volume:
├── Track webhook volume
├── Detect unusual spikes
└── Identify patterns
```

### Admin Tools

```
Django Admin Actions:

Resend Webhook Processing:
├── Select payment records
├── Re-run webhook processing
├── Useful for stuck webhooks
└── Logs re-processing

View Webhook History:
├── Show all webhooks for payment
├── Display timeline
├── Show status changes
└── Download raw webhook data

Reconciliation Report:
├── Compare with PayHere reports
├── Identify missing webhooks
├── Flag discrepancies
└── Export to CSV

Payment Audit Trail:
├── Show full payment history
├── All transactions
├── All status changes
└── Webhook data
```

### Implementation Notes

- **Comprehensive testing**: Cover all scenarios including edge cases
- **Monitoring**: Set up alerts for webhook issues
- **Documentation**: Document webhook flow for support team
- **Regular audits**: Periodically verify webhook processing

### Testing Strategy

- Unit tests for each handler
- Integration tests for full webhook flow
- Manual tests with PayHere sandbox
- Load testing for webhook endpoint
- Idempotency testing with duplicates
- Error scenario testing
- End-to-end verification with real payments

---

## Summary

This document covered webhook processing and verification:

### Completed Components
- **Task 59**: Status code mapping from PayHere to internal
- **Task 60**: Success handler for completed payments
- **Task 61**: Pending handler for awaiting confirmation
- **Task 62**: Failed handler for payment failures
- **Task 63**: Chargeback handler for disputed payments
- **Task 64**: Order update logic on payment success
- **Task 65**: Transaction record creation for audit trail
- **Task 66**: Comprehensive webhook verification and testing

### Status Handling Matrix

```
PayHere Code | Internal Status | Handler        | Actions
-------------|-----------------|----------------|------------------
2            | SUCCESS         | handle_success | Pay order, fulfill
0            | PENDING         | handle_pending | Wait for final
-1           | CANCELLED       | handle_failed  | Allow retry
-2           | FAILED          | handle_failed  | Allow retry
-3           | FAILED          | handle_failed  | Investigate
-4           | CHARGEDBACK     | handle_chargeback | URGENT alert
```

### Security Layers

```
Webhook Security:
├── 1. IP Whitelist (Task 54)
├── 2. Signature Verification (Task 55-57)
├── 3. Data Validation (Task 58-59)
├── 4. Idempotency Checks (Task 60-65)
└── 5. Comprehensive Logging (Task 66)
```

### Next Group

Group E: Verification & Refunds (Tasks 67+)
- Payment verification API
- Refund processing
- Partial refunds
- Refund webhooks
- Verification tests

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-58_View-Signature-Parser.md](01_Tasks-51-58_View-Signature-Parser.md)
