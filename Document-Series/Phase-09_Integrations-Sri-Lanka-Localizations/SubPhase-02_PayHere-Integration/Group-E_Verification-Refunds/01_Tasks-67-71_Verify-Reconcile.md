# Tasks 67-71: Payment Verification and Reconciliation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** E - Verification & Refunds  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-72-80_Refund-Webhook-Verify.md](02_Tasks-72-80_Refund-Webhook-Verify.md)

---

## Document Overview

Implement payment verification with PayHere Verify API. Create verify_payment method to query payment status directly from PayHere, independent of webhook notifications. Build verification hash, parse responses, and reconcile payment data with webhook information to ensure accuracy and prevent fraud.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create verify_payment Method | Medium | 35 min |
| 68 | Create Verification API Call | Medium | 40 min |
| 69 | Create Verification Hash | Low | 20 min |
| 70 | Create Verification Response Parsing | Low | 25 min |
| 71 | Create Payment Reconciliation | Medium | 35 min |

---

## Task 67: Create verify_payment Method

### Overview
Create the main payment verification method in PayHereProcessor that queries PayHere's verification API to confirm payment status. This method provides an independent verification channel separate from webhook notifications, allowing manual verification, dispute resolution, and webhook validation.

### Dependencies
- Task 66: Verify Webhook Processing (from Group D)
- PayHereProcessor class exists
- Payment and Order models exist
- Configuration and hash utilities are functional

### Instructions

1. **Define method signature**
   - Add verify_payment method to PayHereProcessor class
   - Accept payment_id parameter (internal payment ID)
   - Accept order_id parameter (PayHere order_id)
   - Return PaymentResult object with verification details

2. **Retrieve payment record**
   - Query Payment model using payment_id
   - Raise exception if payment not found
   - Log verification attempt with payment details
   - Extract PayHere transaction ID if available

3. **Validate payment state**
   - Check if payment is in verifiable state
   - Skip verification if already verified and confirmed
   - Allow verification for pending or uncertain states
   - Log current payment status before verification

4. **Prepare verification request**
   - Extract merchant_id from configuration
   - Extract merchant_secret from configuration
   - Format order_id for API request
   - Call verification API (Task 68)

5. **Process verification response**
   - Parse API response (Task 70)
   - Compare response status with webhook status
   - Update payment status if needed
   - Log verification result

6. **Build PaymentResult response**
   - Set success=True if verification successful
   - Include payment status from API response
   - Include transaction ID and payment details
   - Add verification timestamp

7. **Handle verification failures**
   - Log failed verification attempts
   - Distinguish between API errors and payment failures
   - Return PaymentResult with appropriate error message
   - Don't change payment status on API errors

8. **Implement retry logic**
   - Allow manual retry for failed verifications
   - Respect rate limits on verification API
   - Log all verification attempts for audit trail

### Method Structure

```
verify_payment(payment_id, order_id)
    │
    ├──► Retrieve Payment Record
    │
    ├──► Validate Payment State
    │
    ├──► Prepare Verification Request
    │
    ├──► Call Verification API (Task 68)
    │
    ├──► Parse Response (Task 70)
    │
    ├──► Reconcile Data (Task 71)
    │
    └──► Return PaymentResult
```

### Verification Flow Diagram

```
verify_payment() called
        │
        ▼
┌─────────────────┐
│ Get Payment     │ ──► Payment not found?
└────────┬────────┘     └──► Raise Exception
         │
         ▼
┌─────────────────┐
│ Check Status    │ ──► Already verified?
└────────┬────────┘     └──► Return cached result
         │
         ▼
┌─────────────────┐
│ Build Request   │
│ (merchant_id,   │
│  order_id, hash)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Call API        │ ──► API error?
│ (Task 68)       │     └──► Log & return error
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parse Response  │
│ (Task 70)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Reconcile       │
│ (Task 71)       │
└────────┬────────┘
         │
         ▼
   Return Result
```

### PaymentResult Structure

```
PaymentResult:
├── success: bool (verification successful)
├── status: str (VERIFIED, PENDING, FAILED)
├── transaction_id: str (PayHere payment_id)
├── order_id: str (merchant order_id)
├── amount: Decimal (payment amount)
├── currency: str (LKR)
├── payment_method: str (card type or method)
├── verified_at: datetime (verification timestamp)
├── message: str (verification message)
└── raw_response: dict (full API response)
```

### Use Cases

**Manual Verification**
```
Use Case: Admin manually verifies payment
Trigger: Admin clicks "Verify Payment" button
Flow: verify_payment() → API call → Update status
```

**Webhook Validation**
```
Use Case: Validate webhook notification
Trigger: Webhook received with suspicious data
Flow: verify_payment() → Compare with webhook → Reconcile
```

**Dispute Resolution**
```
Use Case: Customer claims payment succeeded but order not processed
Trigger: Support ticket investigation
Flow: verify_payment() → Check actual status → Take action
```

**Scheduled Reconciliation**
```
Use Case: Daily batch verification of pending payments
Trigger: Celery scheduled task
Flow: verify_payment() for all pending → Update statuses
```

### Implementation Notes

- **Idempotency**: Safe to call multiple times for same payment
- **Rate limiting**: Respect PayHere API rate limits
- **Caching**: Consider caching verified results for short period
- **Audit trail**: Log all verification attempts with timestamps
- **Transaction safety**: Use database transaction for status updates

### Security Considerations

- Validate payment belongs to correct tenant in multi-tenant setup
- Verify merchant credentials match payment's merchant
- Log verification attempts for audit and fraud detection
- Don't expose raw API responses to frontend

### Testing Strategy

- Test verification of successful payment
- Test verification of failed payment
- Test verification of pending payment
- Test with invalid payment_id
- Test with mismatched order_id
- Test API error handling
- Test rate limit handling

---

## Task 68: Create Verification API Call

### Overview
Implement the HTTP API call to PayHere's payment verification endpoint. This call queries the actual payment status directly from PayHere's servers, providing authoritative payment information independent of webhook notifications.

### Dependencies
- Task 67: Create verify_payment Method

### Instructions

1. **Define API endpoint**
   - Use PayHere verification API: `/merchant/v1/payment/verify`
   - Sandbox URL: `https://sandbox.payhere.lk/merchant/v1/payment/verify`
   - Production URL: `https://www.payhere.lk/merchant/v1/payment/verify`
   - Select URL based on PAYHERE_SANDBOX setting

2. **Prepare request parameters**
   - merchant_id: From PayHere configuration
   - order_id: The merchant's order reference
   - hash: MD5 verification hash (Task 69)
   - No authentication headers needed (hash provides auth)

3. **Build request payload**
   - Use POST method for API call
   - Content-Type: application/x-www-form-urlencoded
   - Include merchant_id, order_id, and hash parameters
   - Encode parameters properly for URL form encoding

4. **Implement HTTP request**
   - Use requests library for HTTP calls
   - Set reasonable timeout (10 seconds recommended)
   - Include User-Agent header identifying your application
   - Handle connection errors gracefully

5. **Add request logging**
   - Log outgoing verification request (sanitize sensitive data)
   - Log request timestamp
   - Log merchant_id and order_id (not hash)
   - Log API endpoint being called

6. **Handle HTTP responses**
   - Check for 200 OK status code
   - Handle 4xx client errors (invalid request)
   - Handle 5xx server errors (PayHere API down)
   - Handle network timeouts and connection errors

7. **Parse JSON response**
   - PayHere returns JSON response
   - Extract status code from response
   - Extract payment details from response
   - Handle malformed JSON responses

8. **Implement error handling**
   - Catch requests.exceptions.RequestException
   - Catch JSON parsing errors
   - Return appropriate error result
   - Log all errors with full details

### API Request Structure

```
POST /merchant/v1/payment/verify
Host: sandbox.payhere.lk (or www.payhere.lk)
Content-Type: application/x-www-form-urlencoded

merchant_id=1234567&order_id=ORD-12345&hash=ABC123...
```

### API Call Flow

```
verify_payment()
    │
    ▼
Build Request
    │
    ├──► merchant_id (from config)
    ├──► order_id (from parameter)
    └──► hash (Task 69)
    │
    ▼
Select Endpoint
    │
    ├──► Sandbox? → sandbox.payhere.lk
    └──► Production? → www.payhere.lk
    │
    ▼
Send POST Request
    │
    ├──► Success (200) → Parse JSON
    ├──► 4xx Error → Invalid request
    ├──► 5xx Error → PayHere API issue
    └──► Timeout → Network error
    │
    ▼
Return Response Data
```

### Request/Response Example

```
Request:
POST https://sandbox.payhere.lk/merchant/v1/payment/verify
Content-Type: application/x-www-form-urlencoded

merchant_id=1234567
order_id=ORD-2025-001
hash=A1B2C3D4E5F6...

Response (Success):
{
    "status": 1,
    "status_message": "Payment verified successfully",
    "payment_id": "320051234567",
    "order_id": "ORD-2025-001",
    "amount": "2500.00",
    "currency": "LKR",
    "status_code": 2,
    "card_holder_name": "John Doe",
    "card_no": "************1234",
    "card_type": "VISA"
}

Response (Not Found):
{
    "status": 0,
    "status_message": "Payment not found",
    "payment_id": null
}

Response (Invalid Hash):
{
    "status": -1,
    "status_message": "Invalid hash"
}
```

### Error Handling Matrix

| Error Type | HTTP Code | Action | Return |
|------------|-----------|--------|--------|
| Success | 200 | Parse response | Response data |
| Invalid hash | 200 (status: -1) | Log security event | Error result |
| Payment not found | 200 (status: 0) | Log not found | Not found result |
| Invalid request | 400 | Log request error | Error result |
| Unauthorized | 401 | Log config error | Error result |
| Server error | 500 | Log API error | Error result |
| Timeout | None | Log timeout | Retry result |
| Connection error | None | Log network error | Retry result |

### Implementation Notes

- **Retry logic**: Implement exponential backoff for network errors
- **Timeout handling**: Use appropriate timeouts (10s recommended)
- **Rate limiting**: Respect PayHere API rate limits
- **Connection pooling**: Reuse HTTP connections for efficiency
- **Logging**: Log all API calls for debugging and audit

### Security Considerations

- Never log the verification hash
- Use HTTPS for all API calls
- Validate SSL certificates
- Sanitize logs to remove sensitive data
- Store API credentials securely

### Testing Strategy

- Mock PayHere API for unit tests
- Test successful verification response
- Test payment not found response
- Test invalid hash response
- Test network timeout
- Test connection error
- Test malformed JSON response
- Test HTTP error codes (400, 401, 500)
- Integration test with PayHere sandbox

---

## Task 69: Create Verification Hash (MD5)

### Overview
Generate MD5 hash for payment verification API call. The hash authenticates the verification request to PayHere using merchant credentials, proving the request originates from the legitimate merchant.

### Dependencies
- Task 68: Create Verification API Call

### Instructions

1. **Define hash parameters**
   - merchant_id: PayHere merchant ID
   - order_id: Merchant's order reference
   - merchant_secret: PayHere merchant secret key
   - Parameters must be in exact order for correct hash

2. **Build hash string**
   - Concatenate: merchant_id + order_id + merchant_secret
   - No separators between components
   - Use exact values with no encoding
   - Example: "1234567ORD-12345mysecretkey"

3. **Generate MD5 hash**
   - Hash the concatenated string using MD5
   - Convert hash to hexadecimal representation
   - Convert to UPPERCASE (PayHere requirement)
   - Result is 32-character hex string

4. **Create hash generation utility**
   - Add method generate_verification_hash() to processor
   - Accept merchant_id and order_id as parameters
   - Retrieve merchant_secret from configuration
   - Return uppercase MD5 hash

5. **Add hash validation**
   - Validate all components are non-empty
   - Raise exception if merchant_secret not configured
   - Log hash generation (not the hash itself)

6. **Implement hash caching**
   - Consider caching hash for same order_id
   - Cache for short duration (5 minutes max)
   - Invalidate cache if merchant_secret changes

### Hash Generation Formula

```
Hash Components:
├── merchant_id: "1234567"
├── order_id: "ORD-2025-001"
└── merchant_secret: "MTIzNDU2Nzg5MDEyMzQ1Njc4OTA="

Concatenation (no separators):
"1234567ORD-2025-001MTIzNDU2Nzg5MDEyMzQ1Njc4OTA="

MD5 Hash:
md5("1234567ORD-2025-001MTIzNDU2...") = "a1b2c3d4..."

Uppercase:
"A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6"
```

### Hash Generation Flow

```
generate_verification_hash(merchant_id, order_id)
    │
    ▼
Validate Inputs
    │
    ├──► merchant_id empty? → Raise error
    ├──► order_id empty? → Raise error
    └──► merchant_secret missing? → Raise error
    │
    ▼
Build Hash String
    │
    └──► merchant_id + order_id + merchant_secret
    │
    ▼
Generate MD5
    │
    └──► hashlib.md5(string.encode('utf-8'))
    │
    ▼
Convert to Hex
    │
    └──► hexdigest()
    │
    ▼
Convert to Uppercase
    │
    └──► upper()
    │
    ▼
Return Hash (32 chars)
```

### Verification Hash vs Payment Hash

```
Payment Hash (Checkout):
├── Components: merchant_id + order_id + amount + currency + ...
├── Purpose: Authenticate checkout initiation
└── More components (includes amount, currency, etc.)

Verification Hash:
├── Components: merchant_id + order_id + merchant_secret
├── Purpose: Authenticate verification request
└── Fewer components (only IDs and secret)
```

### Hash Component Details

| Component | Source | Format | Example |
|-----------|--------|--------|---------|
| merchant_id | PayHere Config | Numeric string | "1234567" |
| order_id | Payment record | Alphanumeric | "ORD-2025-001" |
| merchant_secret | PayHere Config | Base64 string | "MTIzNDU2..." |

### Implementation Notes

- **Case sensitivity**: UPPERCASE required by PayHere
- **No separators**: Concatenate directly with no spaces or delimiters
- **Encoding**: Use UTF-8 encoding for hash input
- **Hash algorithm**: Must be MD5 (not SHA256 or others)
- **Order matters**: Components must be in exact order

### Security Considerations

- Never log the generated hash
- Never expose hash in API responses
- Never store hash in database
- Generate hash fresh for each request
- Protect merchant_secret in configuration

### Common Pitfalls

- **Lowercase hash**: PayHere requires uppercase
- **Wrong order**: Components in wrong sequence
- **Added separators**: Spaces or delimiters between components
- **Wrong encoding**: Not using UTF-8
- **Trailing whitespace**: Spaces in components

### Testing Strategy

- Test hash generation with known values
- Verify hash is exactly 32 characters
- Verify hash is uppercase
- Test with empty merchant_id (should fail)
- Test with empty order_id (should fail)
- Test with missing merchant_secret (should fail)
- Compare generated hash with PayHere test vectors

---

## Task 70: Create Verification Response Parsing

### Overview
Parse and interpret the JSON response from PayHere verification API. Extract payment status, transaction details, and error information. Transform PayHere response format into internal PaymentResult objects that the application can process consistently.

### Dependencies
- Task 68: Create Verification API Call

### Instructions

1. **Define response parser method**
   - Create parse_verification_response() method
   - Accept raw JSON response from API
   - Return structured PaymentResult object
   - Handle missing or null fields gracefully

2. **Extract status information**
   - Read status field (1=success, 0=not found, -1=error)
   - Read status_message field for human-readable message
   - Read status_code field (PayHere payment status)
   - Map status_code to internal status enum

3. **Parse payment details**
   - Extract payment_id (PayHere transaction ID)
   - Extract order_id (merchant order reference)
   - Extract amount and currency
   - Extract payment date/time if available

4. **Parse card/payment method details**
   - Extract card_holder_name
   - Extract card_no (masked card number)
   - Extract card_type (VISA, MASTER, AMEX)
   - Handle non-card payment methods

5. **Map PayHere status codes**
   - status_code 2: Payment success (COMPLETED)
   - status_code 0: Payment pending (PENDING)
   - status_code -1, -2, -3: Payment failed (FAILED)
   - status_code -4: Chargeback (REFUNDED/DISPUTED)

6. **Build PaymentResult object**
   - Set success based on status field
   - Set payment status based on status_code
   - Include all extracted payment details
   - Add verification timestamp

7. **Handle error responses**
   - Parse error messages from status_message
   - Handle "Payment not found" response
   - Handle "Invalid hash" response
   - Return appropriate error PaymentResult

8. **Validate response data**
   - Verify required fields are present
   - Validate amount is numeric and positive
   - Validate currency is LKR
   - Check order_id matches request

### Response Parsing Flow

```
parse_verification_response(json_response)
    │
    ▼
Extract Status
    │
    ├──► status: 1 → Success
    ├──► status: 0 → Not found
    └──► status: -1 → Error
    │
    ▼
Extract Payment Details
    │
    ├──► payment_id
    ├──► order_id
    ├──► amount
    └──► currency
    │
    ▼
Map Status Code
    │
    ├──► 2 → COMPLETED
    ├──► 0 → PENDING
    ├──► -1,-2,-3 → FAILED
    └──► -4 → REFUNDED
    │
    ▼
Build PaymentResult
    │
    └──► Return structured result
```

### PayHere Response Structure

```
Successful Verification:
{
    "status": 1,
    "status_message": "Payment verified successfully",
    "payment_id": "320051234567",
    "order_id": "ORD-2025-001",
    "amount": "2500.00",
    "currency": "LKR",
    "status_code": 2,
    "card_holder_name": "John Doe",
    "card_no": "************1234",
    "card_type": "VISA",
    "method": "VISA",
    "date": "2025-01-31 14:30:00"
}

Payment Not Found:
{
    "status": 0,
    "status_message": "Payment not found",
    "payment_id": null,
    "order_id": "ORD-2025-001"
}

Invalid Hash:
{
    "status": -1,
    "status_message": "Invalid hash"
}

Failed Payment:
{
    "status": 1,
    "status_message": "Payment found",
    "payment_id": "320051234568",
    "order_id": "ORD-2025-002",
    "status_code": -2,
    "status_message": "Cancelled by customer"
}
```

### Status Code Mapping

| PayHere Code | Meaning | Internal Status | Action |
|--------------|---------|-----------------|--------|
| 2 | Success | COMPLETED | Mark order paid |
| 0 | Pending | PENDING | Keep monitoring |
| -1 | Cancelled | FAILED | Cancel order |
| -2 | Failed | FAILED | Cancel order |
| -3 | Charged back | REFUNDED | Process refund |
| -4 | Chargeback | DISPUTED | Handle dispute |

### PaymentResult Mapping

```
PayHere Response → PaymentResult:

payment_id → transaction_id
order_id → order_id
amount → amount (Decimal conversion)
currency → currency
status_code → status (enum mapping)
card_type → payment_method
card_no → card_last_4 (extract last 4 digits)
card_holder_name → customer_name
date → transaction_date
```

### Implementation Notes

- **Null handling**: Handle null/missing fields gracefully
- **Type conversion**: Convert string amounts to Decimal
- **Date parsing**: Parse PayHere date format to datetime
- **Card masking**: Extract only last 4 digits from masked card number
- **Validation**: Validate all critical fields before returning

### Error Cases to Handle

- Missing required fields (payment_id, order_id)
- Invalid amount format (non-numeric)
- Invalid currency (not LKR)
- Unknown status_code values
- Malformed JSON structure
- Empty response

### Testing Strategy

- Test parsing successful verification response
- Test parsing payment not found response
- Test parsing invalid hash response
- Test parsing failed payment response
- Test with missing fields
- Test with null values
- Test with invalid amount format
- Test with unknown status code
- Test card number extraction
- Test date parsing

---

## Task 71: Create Payment Reconciliation

### Overview
Reconcile payment verification API data with webhook notification data. Compare information from both sources to detect discrepancies, ensure data consistency, and prevent fraud. Update payment records with verified information and resolve any conflicts between webhook and API data.

### Dependencies
- Task 70: Create Verification Response Parsing

### Instructions

1. **Create reconciliation method**
   - Add reconcile_payment() method to PayHereProcessor
   - Accept webhook_data parameter (from webhook notification)
   - Accept api_data parameter (from verification API)
   - Return reconciliation result with actions taken

2. **Compare payment status**
   - Extract status from webhook (status_code)
   - Extract status from API verification
   - Check if statuses match
   - Log discrepancy if statuses differ

3. **Compare payment amounts**
   - Extract amount from webhook notification
   - Extract amount from API verification
   - Compare amounts (must match exactly)
   - Raise security alert if amounts differ

4. **Compare transaction IDs**
   - Extract payment_id from webhook
   - Extract payment_id from API
   - Verify both IDs reference same transaction
   - Flag suspicious if IDs don't match

5. **Compare timestamps**
   - Extract payment time from webhook
   - Extract payment time from API
   - Verify times are reasonably close (within minutes)
   - Log if timestamps are too far apart

6. **Implement resolution rules**
   - If API says success but webhook says failed: Trust API
   - If API says failed but webhook says success: Investigate
   - If amounts differ: Reject payment, refund if needed
   - If webhook missing but API confirms: Trust API

7. **Update payment record**
   - Update status to match API verification
   - Store both webhook and API data
   - Add reconciliation flag to payment
   - Mark payment as verified

8. **Handle discrepancies**
   - Log all discrepancies with details
   - Send notification to admin for manual review
   - Place payment in review status if serious discrepancy
   - Create audit log entry

9. **Implement reconciliation scoring**
   - Assign confidence score to reconciliation
   - 100% = perfect match on all fields
   - Lower score if minor discrepancies
   - 0% = critical mismatch requiring investigation

### Reconciliation Flow

```
reconcile_payment(webhook_data, api_data)
    │
    ▼
Compare Status Codes
    │
    ├──► Match? → Continue
    └──► Mismatch? → Flag discrepancy
    │
    ▼
Compare Amounts
    │
    ├──► Match? → Continue
    └──► Mismatch? → CRITICAL ALERT
    │
    ▼
Compare Transaction IDs
    │
    ├──► Match? → Continue
    └──► Mismatch? → Investigate
    │
    ▼
Compare Timestamps
    │
    ├──► Within 5 min? → Continue
    └──► Far apart? → Flag timing issue
    │
    ▼
Calculate Confidence Score
    │
    ▼
Apply Resolution Rules
    │
    ├──► Perfect match → Auto-approve
    ├──► Minor issues → Log & approve
    └──► Critical issues → Manual review
    │
    ▼
Update Payment Record
    │
    └──► Mark as reconciled
```

### Reconciliation Scenarios

**Scenario 1: Perfect Match**
```
Webhook: status=2, amount=2500.00, payment_id=123
API: status=2, amount=2500.00, payment_id=123
Result: APPROVED - Auto-processed
Action: Update order status, send confirmation
```

**Scenario 2: Status Mismatch (Minor)**
```
Webhook: status=0 (pending), payment_id=123
API: status=2 (success), amount=2500.00, payment_id=123
Result: API TRUSTED - Webhook delayed
Action: Update status to success based on API
```

**Scenario 3: Amount Mismatch (Critical)**
```
Webhook: status=2, amount=2500.00, payment_id=123
API: status=2, amount=3000.00, payment_id=123
Result: REJECTED - Fraud risk
Action: Hold payment, alert admin, investigate
```

**Scenario 4: Missing Webhook**
```
Webhook: Not received
API: status=2, amount=2500.00, payment_id=123
Result: API ONLY - Webhook failed to arrive
Action: Process payment based on API verification
```

**Scenario 5: Transaction ID Mismatch (Critical)**
```
Webhook: status=2, payment_id=123
API: status=2, payment_id=456
Result: REJECTED - Possible manipulation
Action: Freeze payment, security investigation
```

### Comparison Matrix

| Field | Source 1 | Source 2 | Match? | Severity | Action |
|-------|----------|----------|--------|----------|--------|
| Status | Webhook | API | ✓ | Medium | Proceed |
| Status | Webhook | API | ✗ | High | Trust API |
| Amount | Webhook | API | ✓ | Critical | Proceed |
| Amount | Webhook | API | ✗ | Critical | Reject, alert |
| Payment ID | Webhook | API | ✓ | Critical | Proceed |
| Payment ID | Webhook | API | ✗ | Critical | Investigate |
| Timestamp | Webhook | API | ✓ | Low | Proceed |
| Timestamp | Webhook | API | ~✓ | Low | Proceed (if <5 min) |
| Timestamp | Webhook | API | ✗ | Medium | Log discrepancy |

### Confidence Score Calculation

```
Confidence Score = Base (100%) - Penalties

Penalties:
├── Status mismatch: -20 points
├── Amount mismatch: -100 points (auto-reject)
├── Transaction ID mismatch: -100 points (auto-reject)
├── Timestamp off by 5-30 min: -5 points
├── Timestamp off by >30 min: -10 points
├── Card details mismatch: -10 points
└── Missing data fields: -5 points per field

Thresholds:
├── 100%: Perfect match - auto-approve
├── 80-99%: Minor issues - approve with logging
├── 50-79%: Moderate issues - approve with admin notification
└── <50%: Critical issues - hold for manual review
```

### Resolution Rules

**Rule 1: API is authoritative**
- Verification API is queried directly from PayHere
- More reliable than webhook notifications
- Trust API data over webhook when conflict arises

**Rule 2: Amount must match exactly**
- No tolerance for amount discrepancies
- Even 1 cent difference triggers investigation
- Critical security measure against fraud

**Rule 3: Transaction ID must be unique**
- Same transaction ID should appear in webhook and API
- Different IDs indicate serious problem
- Requires immediate investigation

**Rule 4: Time discrepancy allowance**
- Allow up to 5 minutes difference (network delays)
- More than 30 minutes requires investigation
- Could indicate replay attack or system issues

### Implementation Notes

- **Database transaction**: Use atomic transaction for updates
- **Audit logging**: Log all reconciliation attempts
- **Admin notification**: Alert on critical discrepancies
- **Fraud detection**: Implement fraud score calculation
- **Idempotency**: Safe to reconcile multiple times

### Security Considerations

- Never auto-approve amount mismatches
- Log all discrepancies for security analysis
- Alert on repeated reconciliation failures
- Implement rate limiting for reconciliation attempts
- Store both webhook and API data for audit

### Testing Strategy

- Test perfect match scenario
- Test status mismatch (webhook pending, API success)
- Test amount mismatch (critical)
- Test transaction ID mismatch (critical)
- Test timestamp discrepancy
- Test missing webhook with API success
- Test missing API with webhook success
- Test multiple reconciliation attempts
- Test confidence score calculation
- Test admin notification triggers

---

## Additional Resources

### PayHere Verification API Documentation
- Endpoint: `/merchant/v1/payment/verify`
- Method: POST
- Authentication: MD5 hash signature
- Response: JSON with payment details

### Reconciliation Best Practices
- Always verify payments before fulfillment
- Use verification API as source of truth
- Log all discrepancies for analysis
- Implement fraud detection rules
- Monitor verification failure rates

### Common Issues

**Issue: Webhook not received**
- Solution: Use verification API to confirm payment
- Set up monitoring for missed webhooks
- Implement scheduled reconciliation job

**Issue: Status mismatch between webhook and API**
- Solution: Trust API verification result
- Investigate webhook delivery delays
- Check PayHere webhook configuration

**Issue: Amount discrepancy**
- Solution: Reject payment immediately
- Investigate potential fraud
- Contact PayHere support

### Monitoring and Alerts

- Monitor verification API success rate
- Alert on verification failures
- Track reconciliation confidence scores
- Monitor discrepancy patterns
- Alert on critical mismatches

---

## Summary

This document covered payment verification and reconciliation implementation:

- **Task 67**: Created verify_payment method for querying payment status
- **Task 68**: Implemented verification API call to PayHere servers
- **Task 69**: Generated MD5 verification hash for authentication
- **Task 70**: Parsed verification API responses into PaymentResult
- **Task 71**: Reconciled webhook data with API data for accuracy

**Next Steps:** Proceed to [02_Tasks-72-80_Refund-Webhook-Verify.md](02_Tasks-72-80_Refund-Webhook-Verify.md) to implement refund processing and refund webhook handling.
