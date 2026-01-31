# Tasks 33-40: OTP Verification and Phone/Address Validation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** C - Risk Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-48_Blacklist-Risk-Verify.md](02_Tasks-41-48_Blacklist-Risk-Verify.md)

---

## Document Overview

This document covers the implementation of OTP (One-Time Password) verification service and phone/address validation for COD orders. The OTP system provides additional security for COD transactions by requiring customers to verify their phone numbers before placing high-value orders. The service includes OTP generation, SMS delivery, verification, expiry management, and retry limiting. Additionally, this document covers Sri Lanka-specific phone number validation and basic address verification to ensure customer contact information is accurate.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create OTP Verification Service | High | 90 min |
| 34 | Create OTP Generate | Low | 20 min |
| 35 | Create OTP Send SMS | Medium | 45 min |
| 36 | Create OTP Verify | Medium | 30 min |
| 37 | Create OTP Expiry | Low | 20 min |
| 38 | Create OTP Retry Limit | Low | 25 min |
| 39 | Create Phone Validation | Low | 30 min |
| 40 | Create Address Verification | Medium | 40 min |

---

## Task 33: Create OTP Verification Service

### Overview
Create the OTP verification service that manages the complete lifecycle of OTPs for COD order verification. This service will be the central component for generating, storing, sending, and verifying OTPs. It integrates with Redis for temporary storage and SMS gateway for delivery. The service provides a clean interface for other parts of the application to request and verify OTPs without dealing with the underlying complexity.

### Dependencies
- Task 32: Create COD Payment Processor (from Group B)
- Redis configuration must be complete
- SMS gateway credentials configured in environment

### Instructions

1. **Create OTP service file**
   - Navigate to `backend/apps/payments/services/` directory
   - Create new file named `otp_service.py`
   - This service handles all OTP-related operations

2. **Import required dependencies**
   - Import Redis client for temporary storage
   - Import random module for OTP generation
   - Import datetime for expiry handling
   - Import SMS gateway integration (to be created in Task 35)
   - Import Django cache framework

3. **Define OTPVerificationService class**
   - Create main service class with initialization method
   - Accept Redis connection and SMS gateway as dependencies
   - Store configuration values (expiry time, retry limits)
   - Use dependency injection pattern for testability

4. **Design service interface**
   - Define public methods: generate, send, verify, validate_phone
   - Keep methods focused and single-responsibility
   - Return consistent response format (success, message, data)
   - Use type hints for all method signatures

5. **Set up Redis key structure**
   - Define key naming convention: `cod:otp:{phone}`
   - Define retry counter key: `cod:otp:retry:{phone}`
   - Define lockout key: `cod:otp:lockout:{phone}`
   - Use consistent prefix for easy Redis management

6. **Implement error handling**
   - Handle Redis connection failures gracefully
   - Handle SMS gateway errors with fallback
   - Log all errors with appropriate severity
   - Return user-friendly error messages

7. **Add logging configuration**
   - Log OTP generation events (without actual OTP)
   - Log verification attempts (success and failure)
   - Log SMS sending status
   - Use structured logging for better monitoring

8. **Create helper methods**
   - Method to check if phone is locked out
   - Method to increment retry counter
   - Method to clear OTP data after successful verification
   - Method to format phone numbers consistently

### OTP Service Architecture

```
┌─────────────────────────────────────────────┐
│        OTPVerificationService               │
├─────────────────────────────────────────────┤
│  + generate(phone) → otp                    │
│  + send(phone, otp) → bool                  │
│  + verify(phone, otp) → bool                │
│  + validate_phone(phone) → bool             │
│  + check_lockout(phone) → bool              │
├─────────────────────────────────────────────┤
│  Internal Methods:                          │
│  - _store_otp(phone, otp)                   │
│  - _get_otp(phone)                          │
│  - _increment_retry(phone)                  │
│  - _clear_otp(phone)                        │
│  - _set_lockout(phone)                      │
└─────────────────────────────────────────────┘
         │                     │
         ▼                     ▼
    ┌─────────┐         ┌──────────┐
    │  Redis  │         │   SMS    │
    │ Storage │         │ Gateway  │
    └─────────┘         └──────────┘
```

### Service Methods Overview

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| generate | phone | otp_code | Creates 6-digit OTP |
| send | phone, otp | success | Sends OTP via SMS |
| verify | phone, otp | is_valid | Validates OTP |
| validate_phone | phone | is_valid | Checks phone format |
| check_lockout | phone | is_locked | Checks if phone is locked |

### Redis Storage Strategy

| Key Pattern | Value | TTL | Purpose |
|-------------|-------|-----|---------|
| `cod:otp:{phone}` | OTP code | 10 min | Store OTP |
| `cod:otp:retry:{phone}` | Counter | 30 min | Track attempts |
| `cod:otp:lockout:{phone}` | Timestamp | 30 min | Lockout period |

### Configuration Values

| Setting | Value | Environment Variable | Description |
|---------|-------|---------------------|-------------|
| OTP Length | 6 digits | - | Fixed format |
| Expiry Time | 10 minutes | `OTP_EXPIRY_MINUTES` | Time validity |
| Max Retries | 3 attempts | `OTP_MAX_RETRIES` | Verification attempts |
| Lockout Duration | 30 minutes | `OTP_LOCKOUT_MINUTES` | Block duration |

### Error Handling Scenarios

| Error Type | Response | User Message |
|------------|----------|--------------|
| Redis Connection Failed | Log error, use fallback | "Service temporarily unavailable" |
| SMS Gateway Failed | Log error, retry once | "Failed to send OTP. Please try again." |
| Phone Already Locked | Return lockout info | "Too many attempts. Try again in X minutes." |
| Invalid Phone Format | Validation error | "Invalid phone number format" |

### Service Response Format

```
Success Response:
{
    "success": true,
    "message": "OTP sent successfully",
    "data": {
        "phone": "+94771234567",
        "expires_at": "2026-01-31T10:10:00Z",
        "retry_count": 0
    }
}

Error Response:
{
    "success": false,
    "message": "Failed to send OTP",
    "error_code": "SMS_GATEWAY_ERROR",
    "data": null
}
```

### Logging Strategy

| Event | Log Level | Include |
|-------|-----------|---------|
| OTP Generation | INFO | Phone (masked), timestamp |
| OTP Verification | INFO | Phone, success/failure |
| SMS Sending | INFO | Phone, gateway status |
| Retry Limit Exceeded | WARNING | Phone, retry count |
| Lockout Triggered | WARNING | Phone, lockout duration |
| Service Errors | ERROR | Full error details |

### Expected Outcome
- Functional OTP verification service class
- Clean interface for OTP operations
- Redis integration for temporary storage
- Proper error handling and logging
- Foundation for subsequent OTP tasks

### Verification Checklist
- [ ] `backend/apps/payments/services/otp_service.py` file created
- [ ] OTPVerificationService class defined
- [ ] Service methods structured properly
- [ ] Redis key patterns defined
- [ ] Error handling implemented
- [ ] Logging configuration added
- [ ] Service can be imported and instantiated
- [ ] Type hints added to all methods

---

## Task 34: Create OTP Generate

### Overview
Implement the OTP generation method within the OTP verification service. This method creates a secure, random 6-digit numeric code that customers will receive via SMS. The OTP is generated using Python's secure random number generator and stored in Redis with an expiration time. The method ensures each OTP is unique per phone number and replaces any existing OTP for the same phone.

### Dependencies
- Task 33: Create OTP Verification Service

### Instructions

1. **Locate OTP service file**
   - Open `backend/apps/payments/services/otp_service.py`
   - Find the OTPVerificationService class
   - Locate the `generate` method stub

2. **Import random number generator**
   - Use `secrets` module for cryptographically secure random
   - Import `randint` function for number generation
   - Consider using `SystemRandom` for additional security

3. **Implement generate method**
   - Accept phone number as parameter
   - Validate phone format first (call validate_phone)
   - Check if phone is currently locked out
   - Generate random 6-digit number (100000-999999)

4. **Handle edge cases**
   - If phone is locked out, return error immediately
   - If existing OTP exists, overwrite it (clear old OTP first)
   - Ensure generated OTP is always 6 digits
   - Handle Redis storage failures gracefully

5. **Store OTP in Redis**
   - Use key pattern: `cod:otp:{phone}`
   - Set TTL to 10 minutes (600 seconds)
   - Store as string value for consistency
   - Initialize retry counter to 0

6. **Return OTP securely**
   - Return OTP value to calling code (for SMS sending)
   - Do not log actual OTP value
   - Include expiry timestamp in response
   - Return error message if generation fails

7. **Add generation metadata**
   - Store generation timestamp
   - Track how many OTPs generated for this phone
   - Log generation event (masked phone number)
   - Update rate limiting if needed

### OTP Generation Flow

```
Start Generate OTP
        │
        ▼
  Validate Phone Format
        │
        ├─ Invalid ─────────► Return Error
        │
        ▼
  Check Lockout Status
        │
        ├─ Locked ──────────► Return Lockout Error
        │
        ▼
  Generate Random 6-Digit
        │
        ▼
  Store in Redis (10 min TTL)
        │
        ├─ Failed ──────────► Log Error, Return Error
        │
        ▼
  Initialize Retry Counter
        │
        ▼
  Return OTP + Metadata
        │
        ▼
       End
```

### Random Number Generation

| Approach | Module | Range | Security |
|----------|--------|-------|----------|
| Standard Random | random | 100000-999999 | Low (Not recommended) |
| Secrets | secrets | 100000-999999 | High (Recommended) |
| SystemRandom | random.SystemRandom | 100000-999999 | High (Alternative) |

### OTP Format Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Length | 6 digits | Standard for SMS OTP |
| Character Type | Numeric only | Easy to read/type |
| Range | 100000-999999 | Ensures 6 digits |
| Leading Zeros | Not allowed | Range prevents this |

### Redis Storage Details

| Key | Value | TTL | Notes |
|-----|-------|-----|-------|
| `cod:otp:{phone}` | "123456" | 600s | Actual OTP |
| `cod:otp:meta:{phone}` | JSON metadata | 600s | Generation time, etc |
| `cod:otp:retry:{phone}` | "0" | 1800s | Retry counter |

### Generate Method Signature

```
Method: generate
Input:
  - phone: str (E.164 format, +94XXXXXXXXX)
  
Output (Success):
  {
    "success": true,
    "otp": "123456",
    "expires_at": "2026-01-31T10:10:00Z",
    "phone": "+94771234567"
  }

Output (Error):
  {
    "success": false,
    "error": "Phone is locked out",
    "locked_until": "2026-01-31T10:30:00Z"
  }
```

### Security Considerations

| Risk | Mitigation |
|------|------------|
| Predictable OTPs | Use cryptographically secure random |
| OTP Reuse | Always generate fresh OTP |
| Timing Attacks | Constant-time comparison in verify |
| Brute Force | Implement retry limits (Task 38) |

### Rate Limiting Strategy

| Window | Limit | Action |
|--------|-------|--------|
| 1 minute | 2 generations | Throttle requests |
| 5 minutes | 5 generations | Warn user |
| 30 minutes | 10 generations | Temporary lockout |

### Expected Outcome
- Functional OTP generation method
- Cryptographically secure random OTPs
- Proper Redis storage with expiry
- Error handling for edge cases
- Foundation for SMS sending (Task 35)

### Verification Checklist
- [ ] Generate method implemented in service
- [ ] Uses secure random number generator
- [ ] Always generates 6-digit codes
- [ ] Stores OTP in Redis with 10-minute TTL
- [ ] Checks phone lockout before generating
- [ ] Returns proper success/error responses
- [ ] Logs generation events (without OTP)
- [ ] Handles Redis failures gracefully

---

## Task 35: Create OTP Send SMS

### Overview
Implement the SMS sending functionality to deliver OTPs to customers' mobile phones. This task integrates with an SMS gateway service to send verification codes to Sri Lankan phone numbers. The implementation includes message templating, retry logic, delivery status tracking, and error handling for various SMS gateway failures. The system supports Sri Lanka's +94 country code and handles formatting for local mobile operators.

### Dependencies
- Task 34: Create OTP Generate

### Instructions

1. **Choose SMS gateway provider**
   - Research Sri Lanka SMS providers (Dialog, Mobitel, etc)
   - Consider international providers (Twilio, AWS SNS)
   - Select based on cost, reliability, coverage
   - Obtain API credentials and test account

2. **Configure SMS gateway settings**
   - Add SMS gateway credentials to environment variables
   - Set `SMS_GATEWAY_API_KEY`, `SMS_GATEWAY_URL`, `SMS_SENDER_ID`
   - Configure sender ID (e.g., "LCC" or "LankaComm")
   - Set up webhook URL for delivery reports (optional)

3. **Create SMS client wrapper**
   - Create `backend/apps/payments/services/sms_client.py`
   - Implement wrapper class for SMS gateway API
   - Handle authentication with API keys
   - Provide send method with phone, message parameters

4. **Implement send method in OTP service**
   - Add `send` method to OTPVerificationService
   - Accept phone and OTP as parameters
   - Format message using template
   - Call SMS client wrapper to send message

5. **Design message template**
   - Create clear, concise message text
   - Include OTP code and expiry time
   - Keep message under 160 characters (single SMS)
   - Add brand name for recognition
   - Example: "Your LCC verification code is 123456. Valid for 10 minutes. Do not share."

6. **Handle SMS gateway responses**
   - Parse gateway API response for success/failure
   - Extract message ID for tracking
   - Handle rate limiting from gateway
   - Retry once on temporary failures
   - Log delivery status

7. **Implement error handling**
   - Handle network timeouts gracefully
   - Handle invalid phone number errors
   - Handle insufficient balance errors
   - Return descriptive error messages to users
   - Log all errors for monitoring

8. **Add retry logic**
   - Retry once automatically on transient errors
   - Use exponential backoff (5 seconds delay)
   - Do not retry on permanent failures (invalid number)
   - Track retry attempts in logs

9. **Store delivery metadata**
   - Store message ID in Redis
   - Store delivery timestamp
   - Store delivery status (pending, sent, failed)
   - Use key: `cod:otp:sms:{phone}`

### SMS Sending Flow

```
Start Send SMS
        │
        ▼
  Format Message Template
        │
        ▼
  Validate Phone Number
        │
        ├─ Invalid ─────────► Return Error
        │
        ▼
  Call SMS Gateway API
        │
        ├─ Network Error ───► Retry Once
        │                         │
        │                         ├─ Success → Continue
        │                         └─ Failed ─→ Return Error
        ▼
  Parse Gateway Response
        │
        ├─ Success ─────────► Store Metadata, Return Success
        │
        └─ Failure ─────────► Log Error, Return Error
                                      │
                                      ▼
                                  End
```

### SMS Gateway Integration Options

| Provider | Coverage | Cost/SMS | Reliability | Notes |
|----------|----------|----------|-------------|-------|
| Dialog | Excellent | ₨1-2 | High | Local operator |
| Mobitel | Excellent | ₨1-2 | High | Local operator |
| Twilio | Good | ₨3-5 | Very High | International |
| AWS SNS | Good | ₨3-4 | Very High | International |

### Message Template Design

| Element | Content | Purpose |
|---------|---------|---------|
| Intro | "Your LCC verification code is" | Context |
| OTP | "123456" | The actual code |
| Validity | "Valid for 10 minutes" | Urgency |
| Warning | "Do not share" | Security |
| Length | < 160 chars | Single SMS unit |

### Message Examples

```
Template 1 (English):
"Your LCC verification code is {otp}. Valid for 10 minutes. Do not share this code."

Template 2 (Shorter):
"LCC OTP: {otp}. Expires in 10 min. Keep confidential."

Template 3 (With Order):
"Your COD order verification: {otp}. Valid 10 min."
```

### SMS Client Wrapper Structure

```
┌──────────────────────────────┐
│      SMSClient Class         │
├──────────────────────────────┤
│  + __init__(api_key, url)    │
│  + send(phone, message)      │
│  + check_balance()           │
│  + get_delivery_status(id)   │
├──────────────────────────────┤
│  - _make_request()           │
│  - _parse_response()         │
│  - _handle_error()           │
└──────────────────────────────┘
```

### Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| SMS_GATEWAY_URL | `https://api.sms.lk/send` | API endpoint |
| SMS_GATEWAY_API_KEY | `abc123xyz...` | Authentication key |
| SMS_SENDER_ID | `LCC` | Sender name (4-11 chars) |
| SMS_TIMEOUT | `10` | Request timeout (seconds) |

### Error Handling Matrix

| Error Type | Gateway Response | Action | User Message |
|------------|------------------|--------|--------------|
| Invalid Phone | 400 | Don't retry | "Invalid phone number" |
| Insufficient Balance | 402 | Alert admin | "Service unavailable" |
| Network Timeout | Timeout | Retry once | "Failed to send, retrying..." |
| Rate Limited | 429 | Wait and retry | "Too many requests, please wait" |
| Server Error | 500 | Retry once | "Temporary error, please try again" |

### Delivery Status Tracking

| Status | Code | Description | Action |
|--------|------|-------------|--------|
| Pending | 0 | Submitted to gateway | Wait |
| Sent | 1 | Delivered to operator | Success |
| Failed | 2 | Delivery failed | Log error |
| Rejected | 3 | Invalid number | Update records |

### Redis Storage for SMS Metadata

| Key | Value | TTL | Purpose |
|-----|-------|-----|---------|
| `cod:otp:sms:{phone}` | JSON metadata | 30 min | Track SMS delivery |

Metadata Structure:
```
{
  "message_id": "msg_abc123",
  "sent_at": "2026-01-31T10:00:00Z",
  "status": "sent",
  "gateway": "twilio",
  "retry_count": 0
}
```

### Phone Number Formatting

| Input Format | Normalized Format | Valid |
|--------------|-------------------|-------|
| 0771234567 | +94771234567 | ✓ |
| +94771234567 | +94771234567 | ✓ |
| 94771234567 | +94771234567 | ✓ |
| 771234567 | +94771234567 | ✓ |
| +94112345678 | +94112345678 | ✓ (landline) |

### Expected Outcome
- Functional SMS sending via gateway
- Proper message templating
- Error handling with retry logic
- Delivery status tracking
- Integration with OTP service

### Verification Checklist
- [ ] SMS gateway provider configured
- [ ] SMS client wrapper created
- [ ] Send method implemented in OTP service
- [ ] Message template designed (< 160 chars)
- [ ] Environment variables configured
- [ ] Error handling implemented
- [ ] Retry logic added
- [ ] Delivery status tracked in Redis
- [ ] Phone number formatting handled
- [ ] Tested with real Sri Lankan numbers

---

## Task 36: Create OTP Verify

### Overview
Implement the OTP verification method that validates customer-submitted OTPs against stored values. This method retrieves the OTP from Redis, performs constant-time comparison for security, checks expiry status, and manages retry counters. Successful verification clears the OTP and resets retry counters, while failed attempts increment retry counts and may trigger lockouts.

### Dependencies
- Task 33: Create OTP Verification Service
- Task 34: Create OTP Generate

### Instructions

1. **Locate OTP service file**
   - Open `backend/apps/payments/services/otp_service.py`
   - Find the OTPVerificationService class
   - Add or complete the `verify` method

2. **Define verify method signature**
   - Accept phone and submitted_otp as parameters
   - Return dictionary with success status and message
   - Use type hints: `def verify(self, phone: str, submitted_otp: str) -> dict`

3. **Implement verification logic flow**
   - Validate phone format first
   - Check if phone is locked out
   - Retrieve stored OTP from Redis
   - Compare submitted OTP with stored OTP
   - Handle match and mismatch scenarios

4. **Retrieve stored OTP from Redis**
   - Use key: `cod:otp:{phone}`
   - Check if key exists (OTP not expired)
   - If key doesn't exist, OTP has expired or never generated
   - Return appropriate error message

5. **Implement secure OTP comparison**
   - Use constant-time comparison to prevent timing attacks
   - Use `secrets.compare_digest()` function
   - Convert both OTPs to strings for comparison
   - Never reveal if OTP is close to correct

6. **Handle successful verification**
   - Clear OTP from Redis immediately
   - Clear retry counter from Redis
   - Clear SMS metadata
   - Log successful verification (masked phone)
   - Return success response with timestamp

7. **Handle failed verification**
   - Increment retry counter in Redis
   - Check if max retries exceeded
   - If max exceeded, trigger lockout (Task 38)
   - Log failed attempt with retry count
   - Return error message without revealing details

8. **Add verification metadata**
   - Track verification attempts
   - Store last verification attempt timestamp
   - Store verification success/failure history
   - Use for analytics and fraud detection

### OTP Verification Flow

```
Start Verify OTP
        │
        ▼
  Validate Phone Format
        │
        ├─ Invalid ──────────► Return Error
        │
        ▼
  Check Lockout Status
        │
        ├─ Locked ───────────► Return Lockout Error
        │
        ▼
  Retrieve OTP from Redis
        │
        ├─ Not Found ────────► Return "Expired or Invalid"
        │
        ▼
  Constant-Time Compare
        │
        ├─ Match ────────────► Clear OTP & Counter
        │                      Return Success
        │
        └─ No Match ─────────► Increment Retry Counter
                                    │
                                    ├─ < Max ──► Return "Invalid OTP"
                                    │
                                    └─ >= Max ─► Trigger Lockout
                                                 Return "Too Many Attempts"
```

### Verify Method Signature

```
Method: verify
Input:
  - phone: str (E.164 format)
  - submitted_otp: str (6 digits)
  
Output (Success):
  {
    "success": true,
    "message": "OTP verified successfully",
    "verified_at": "2026-01-31T10:05:00Z"
  }

Output (Invalid OTP):
  {
    "success": false,
    "message": "Invalid OTP",
    "retries_left": 2
  }

Output (Expired):
  {
    "success": false,
    "message": "OTP has expired",
    "retries_left": 0
  }

Output (Locked):
  {
    "success": false,
    "message": "Too many attempts. Try again later.",
    "locked_until": "2026-01-31T10:30:00Z"
  }
```

### Secure Comparison Implementation

| Method | Security | Performance | Recommendation |
|--------|----------|-------------|----------------|
| `==` operator | Low (timing attacks) | Fast | Never use |
| `secrets.compare_digest()` | High | Slightly slower | Use this |
| Manual loop | High | Slowest | Not needed |

### Verification Scenarios

| Scenario | Stored OTP | Submitted OTP | Retry Count | Result |
|----------|-----------|---------------|-------------|--------|
| Valid OTP | 123456 | 123456 | 0 | Success |
| Invalid OTP (1st) | 123456 | 123457 | 1 | Failure, 2 left |
| Invalid OTP (2nd) | 123456 | 654321 | 2 | Failure, 1 left |
| Invalid OTP (3rd) | 123456 | 111111 | 3 | Lockout |
| Expired | (not found) | 123456 | N/A | Expired |
| Lockout | 123456 | 123456 | N/A | Locked |

### Redis Operations

| Operation | Key | Action | Purpose |
|-----------|-----|--------|---------|
| Read | `cod:otp:{phone}` | GET | Retrieve stored OTP |
| Read | `cod:otp:retry:{phone}` | GET | Check retry count |
| Write | `cod:otp:retry:{phone}` | INCR | Increment retries |
| Delete | `cod:otp:{phone}` | DEL | Clear on success |
| Delete | `cod:otp:retry:{phone}` | DEL | Clear on success |
| Write | `cod:otp:lockout:{phone}` | SET | Trigger lockout |

### Error Messages Strategy

| Situation | Message Shown to User | Reason |
|-----------|----------------------|--------|
| Invalid OTP | "Invalid verification code" | Generic, no hints |
| Expired OTP | "Verification code has expired. Request a new one." | Clear action |
| Locked Out | "Too many attempts. Try again in 30 minutes." | Specific timeframe |
| System Error | "Verification failed. Please try again." | Generic |

### Verification Metadata Storage

```
Key: cod:otp:verify_history:{phone}
Value: List of verification attempts (JSON)
TTL: 24 hours

Structure:
[
  {
    "timestamp": "2026-01-31T10:00:00Z",
    "success": false,
    "ip_address": "192.168.1.100"
  },
  {
    "timestamp": "2026-01-31T10:02:00Z",
    "success": false,
    "ip_address": "192.168.1.100"
  },
  {
    "timestamp": "2026-01-31T10:05:00Z",
    "success": true,
    "ip_address": "192.168.1.100"
  }
]
```

### Security Considerations

| Risk | Mitigation |
|------|------------|
| Timing Attacks | Use constant-time comparison |
| Brute Force | Implement retry limits |
| OTP Reuse | Delete OTP after verification |
| Replay Attacks | One-time use only |

### Logging Strategy

| Event | Log Level | Information Logged |
|-------|-----------|-------------------|
| Verification Success | INFO | Phone (masked), timestamp |
| Verification Failure | WARNING | Phone (masked), retry count |
| Lockout Triggered | WARNING | Phone (masked), lockout duration |
| Expired OTP | INFO | Phone (masked) |
| System Errors | ERROR | Full error details |

### Expected Outcome
- Functional OTP verification method
- Secure constant-time comparison
- Proper retry counter management
- Clear error messaging
- Integration with lockout mechanism

### Verification Checklist
- [ ] Verify method implemented in service
- [ ] Uses secrets.compare_digest() for comparison
- [ ] Retrieves OTP from Redis correctly
- [ ] Handles expired OTPs properly
- [ ] Increments retry counter on failure
- [ ] Clears OTP and counter on success
- [ ] Checks lockout before verifying
- [ ] Returns appropriate error messages
- [ ] Logs verification attempts
- [ ] Handles Redis failures gracefully

---

## Task 37: Create OTP Expiry

### Overview
Implement OTP expiry mechanism using Redis TTL (Time To Live) functionality. This task ensures that OTPs automatically expire after 10 minutes, preventing old codes from being used and reducing the window for potential attacks. The expiry is handled automatically by Redis, but the implementation includes explicit expiry checking, remaining time calculations, and clear messaging to users about time constraints.

### Dependencies
- Task 33: Create OTP Verification Service
- Task 34: Create OTP Generate

### Instructions

1. **Configure expiry duration**
   - Set default expiry to 10 minutes (600 seconds)
   - Make expiry configurable via environment variable
   - Store constant: `OTP_EXPIRY_SECONDS = 600`
   - Add to service configuration

2. **Set TTL during OTP generation**
   - In generate method, set Redis TTL when storing OTP
   - Use Redis SETEX command: `SET key value EX 600`
   - Ensure TTL is applied atomically with storage
   - Verify TTL is set correctly

3. **Add expiry timestamp metadata**
   - Calculate expiry timestamp when generating OTP
   - Store expiry time: `current_time + 10 minutes`
   - Include in generation response
   - Format as ISO 8601: `2026-01-31T10:10:00Z`

4. **Implement remaining time calculation**
   - Add method: `get_remaining_time(phone)`
   - Use Redis TTL command to get remaining seconds
   - Convert to human-readable format (X minutes Y seconds)
   - Return -1 if OTP doesn't exist or expired

5. **Handle expired OTP attempts**
   - In verify method, check if OTP exists
   - If OTP not found, assume expired or never generated
   - Return specific "expired" error message
   - Suggest user request new OTP

6. **Add expiry warning to SMS**
   - Include expiry time in SMS template
   - Example: "Valid for 10 minutes"
   - Make time obvious to create urgency
   - Keep message concise

7. **Implement expiry extension (optional)**
   - Consider adding method to extend OTP validity
   - Useful if customer reports delayed SMS
   - Limit extensions to once per OTP
   - Log all extension requests

8. **Add expiry monitoring**
   - Track OTP expiry rates
   - Monitor how many OTPs expire unused
   - Alert if expiry rate is unusually high
   - Use metrics for optimization

### OTP Expiry Timeline

```
Time: 0:00          OTP Generated & SMS Sent
         │
Time: 5:00          Halfway Point (50% remaining)
         │
Time: 8:00          Warning Zone (20% remaining)
         │
Time: 10:00         OTP Expires (TTL = 0)
         │
         ▼
    Redis Auto-Deletes Key
```

### Redis TTL Implementation

| Command | Syntax | Purpose |
|---------|--------|---------|
| SETEX | `SETEX key 600 value` | Set with expiry |
| TTL | `TTL key` | Get remaining seconds |
| EXPIRE | `EXPIRE key 600` | Set expiry on existing key |
| PERSIST | `PERSIST key` | Remove expiry (not recommended) |

### Expiry Configuration

| Setting | Value | Environment Variable | Adjustable |
|---------|-------|---------------------|------------|
| Default Expiry | 10 minutes | `OTP_EXPIRY_MINUTES` | Yes |
| Minimum Expiry | 5 minutes | - | No |
| Maximum Expiry | 15 minutes | - | No |
| Extension Time | +5 minutes | `OTP_EXTENSION_MINUTES` | Yes (optional) |

### Expiry Checking Logic

```
Check OTP Expiry
        │
        ▼
  Get OTP from Redis (GET key)
        │
        ├─ Key Exists ───────► OTP Valid (check TTL for time left)
        │
        └─ Key Not Found ────► OTP Expired or Never Generated
                                    │
                                    └─ Return "Expired" Error
```

### Remaining Time Calculation

```
Method: get_remaining_time
Input: phone (str)

Redis Command: TTL cod:otp:{phone}

Returns:
  - N seconds: OTP exists, N seconds remaining
  - -1: Key exists but no TTL set (error state)
  - -2: Key doesn't exist (expired or never generated)

Processing:
  - If N > 0: Convert to "X min Y sec" format
  - If -1: Log error, return "unknown"
  - If -2: Return "expired"
```

### Remaining Time Formatting

| Seconds Remaining | Display Format | Color Code |
|------------------|----------------|------------|
| 600 (10 min) | "10 minutes" | Green |
| 300 (5 min) | "5 minutes" | Yellow |
| 120 (2 min) | "2 minutes" | Orange |
| 60 (1 min) | "1 minute" | Red |
| 30 (30 sec) | "30 seconds" | Red (urgent) |
| 0 | "Expired" | Gray |

### Error Messages for Expired OTPs

| Scenario | User Message | Action Suggested |
|----------|-------------|------------------|
| Expired during verification | "Your verification code has expired. Please request a new one." | "Request New Code" button |
| Expired before entry | "Code expired. A new code has been sent." | Auto-resend |
| Checking expired OTP | "This code is no longer valid." | Request new |

### Expiry Metadata Storage

```
Key: cod:otp:meta:{phone}
Value: JSON
TTL: Same as OTP (600 seconds)

Structure:
{
  "generated_at": "2026-01-31T10:00:00Z",
  "expires_at": "2026-01-31T10:10:00Z",
  "otp_length": 6,
  "sent_via": "sms"
}
```

### Monitoring Expiry Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Expiry Rate | % of OTPs that expire unused | > 50% |
| Average Time to Verify | Time between generation and verification | > 5 min |
| Expired Attempts | # of verification attempts on expired OTPs | High spikes |
| Extension Requests | # of requests to extend OTP | > 10/hour |

### Optional: Expiry Extension Method

```
Method: extend_expiry
Input: phone (str)
Output: success (bool), new_expiry_time (str)

Logic:
1. Check if OTP exists
2. Check if already extended
3. Add 5 minutes to TTL (EXPIRE key +300)
4. Mark as extended to prevent multiple extensions
5. Return new expiry time

Constraints:
- Only one extension per OTP
- Cannot extend expired OTP
- Log all extension requests
```

### Expected Outcome
- Automatic OTP expiry after 10 minutes
- Clear expiry messaging to users
- Remaining time calculations
- Monitoring of expiry patterns
- Optional extension capability

### Verification Checklist
- [ ] OTP expiry configured to 10 minutes
- [ ] Redis TTL set correctly during generation
- [ ] Expiry timestamp included in metadata
- [ ] Remaining time calculation method added
- [ ] Expired OTP attempts handled gracefully
- [ ] Error messages mention expiry clearly
- [ ] SMS template includes expiry notice
- [ ] Expiry metrics tracked
- [ ] Optional extension method implemented (if required)
- [ ] Tested expiry with manual time delays

---

## Task 38: Create OTP Retry Limit

### Overview
Implement retry limiting mechanism to prevent brute force attacks on OTP verification. This system tracks failed verification attempts per phone number and enforces a maximum of 3 attempts within a 30-minute window. After exceeding the limit, the phone number is locked out for 30 minutes, during which no new OTPs can be generated or verified. The implementation uses Redis counters and lockout keys for tracking and enforcement.

### Dependencies
- Task 33: Create OTP Verification Service
- Task 36: Create OTP Verify

### Instructions

1. **Configure retry limits**
   - Set maximum retry attempts to 3
   - Set lockout duration to 30 minutes (1800 seconds)
   - Make configurable via environment variables
   - Store as service constants

2. **Initialize retry counter on OTP generation**
   - When generating new OTP, reset retry counter to 0
   - Use Redis key: `cod:otp:retry:{phone}`
   - Set TTL to 30 minutes (longer than OTP expiry)
   - Reset only if phone is not locked out

3. **Increment counter on failed verification**
   - In verify method, increment counter on OTP mismatch
   - Use Redis INCR command for atomic increment
   - Check counter value after increment
   - If >= 3, trigger lockout immediately

4. **Implement lockout mechanism**
   - Create method: `set_lockout(phone)`
   - Set Redis key: `cod:otp:lockout:{phone}`
   - Store lockout timestamp as value
   - Set TTL to 30 minutes (1800 seconds)

5. **Add lockout checking**
   - Create method: `check_lockout(phone)`
   - Check if lockout key exists in Redis
   - Calculate remaining lockout time
   - Return lockout status and remaining time

6. **Enforce lockout in all operations**
   - Check lockout before generating new OTP
   - Check lockout before verifying OTP
   - Return clear lockout message with time remaining
   - Prevent any OTP operations during lockout

7. **Clear counters on successful verification**
   - When verification succeeds, delete retry counter
   - Delete lockout key if exists
   - Reset to clean state for future OTPs
   - Log counter reset event

8. **Add lockout notifications**
   - Log when lockout is triggered
   - Consider sending notification email/SMS (optional)
   - Alert security team if multiple lockouts from same IP
   - Track lockout patterns for fraud detection

### Retry Limit Flow

```
Verification Attempt
        │
        ▼
  Check Lockout
        │
        ├─ Locked ──────────► Return Lockout Error
        │                     Show Time Remaining
        │
        ▼
  Verify OTP
        │
        ├─ Success ─────────► Clear Retry Counter
        │                     Clear Lockout (if any)
        │                     Return Success
        │
        └─ Failure ─────────► Increment Retry Counter
                                      │
                                      ├─ Count < 3 ──► Return Error
                                      │                 Show Retries Left
                                      │
                                      └─ Count >= 3 ─► Trigger Lockout
                                                       Set Lockout Key (30 min)
                                                       Return Lockout Error
```

### Retry Limit Configuration

| Setting | Value | Environment Variable | Purpose |
|---------|-------|---------------------|----------|
| Max Retries | 3 | `OTP_MAX_RETRIES` | Attempts allowed |
| Lockout Duration | 30 minutes | `OTP_LOCKOUT_MINUTES` | Block time |
| Retry Window | 30 minutes | - | Counter TTL |
| Lockout TTL | 1800 seconds | - | Redis key TTL |

### Redis Keys for Retry Tracking

| Key Pattern | Value | TTL | Purpose |
|-------------|-------|-----|---------|
| `cod:otp:retry:{phone}` | Counter (0-3) | 1800s | Track attempts |
| `cod:otp:lockout:{phone}` | Timestamp | 1800s | Lockout marker |
| `cod:otp:lockout_reason:{phone}` | Reason text | 1800s | Why locked |

### Retry Counter States

| Counter Value | Status | Action | Message |
|--------------|--------|--------|---------|
| 0 | Fresh | Allow verify | - |
| 1 | First failure | Allow verify | "2 attempts remaining" |
| 2 | Second failure | Allow verify | "1 attempt remaining" |
| 3 | Third failure | Trigger lockout | "Too many attempts. Locked for 30 min." |

### Lockout Implementation

```
Method: set_lockout
Input: phone (str), reason (optional)

Steps:
1. Calculate lockout_until timestamp (now + 30 min)
2. Set Redis key: cod:otp:lockout:{phone}
3. Value: lockout_until timestamp
4. TTL: 1800 seconds
5. Store reason: cod:otp:lockout_reason:{phone}
6. Log lockout event
7. Return lockout info

Output:
{
  "locked": true,
  "locked_until": "2026-01-31T10:30:00Z",
  "reason": "Too many failed verification attempts"
}
```

### Lockout Checking

```
Method: check_lockout
Input: phone (str)

Steps:
1. Check if lockout key exists: cod:otp:lockout:{phone}
2. If exists, get TTL to calculate remaining time
3. Return lockout status with remaining time
4. If not exists, return not locked

Output (Locked):
{
  "is_locked": true,
  "locked_until": "2026-01-31T10:30:00Z",
  "remaining_seconds": 1234,
  "remaining_minutes": 20
}

Output (Not Locked):
{
  "is_locked": false
}
```

### Error Messages

| Situation | Message to User |
|-----------|----------------|
| 1st Failed Attempt | "Invalid code. You have 2 attempts remaining." |
| 2nd Failed Attempt | "Invalid code. You have 1 attempt remaining." |
| 3rd Failed Attempt | "Too many failed attempts. Your account is locked for 30 minutes." |
| During Lockout | "Your account is locked. Please try again in 25 minutes." |
| Generate During Lockout | "Cannot generate OTP. Account locked for 20 more minutes." |

### Lockout Bypass (Admin Only)

```
Method: clear_lockout (Admin function)
Input: phone (str), admin_user_id (int)

Steps:
1. Verify admin privileges
2. Delete lockout key: cod:otp:lockout:{phone}
3. Delete retry counter: cod:otp:retry:{phone}
4. Log bypass event with admin ID
5. Return success

Use Cases:
- Customer service assistance
- False positive lockouts
- Testing and troubleshooting
```

### Security Considerations

| Risk | Mitigation |
|------|------------|
| Brute Force | 3 attempts max |
| Account Lockout DOS | 30-min limit (not permanent) |
| Distributed Attacks | Track by IP + phone (future) |
| Lockout Bypass | Admin audit log |

### Monitoring Lockout Patterns

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| Lockouts per Hour | > 10 | Investigate fraud |
| Unique Phones Locked | > 50 | System issue? |
| Same IP, Multiple Phones | > 5 | Block IP |
| Lockout Bypass Frequency | > 20/day | Review admin actions |

### Lockout Notification (Optional)

When lockout occurs:
1. Send SMS: "Too many OTP attempts. Try again in 30 minutes. Contact support if you didn't request this."
2. Send Email: Detailed lockout notification with support link
3. Log event: Phone, timestamp, IP address
4. Alert security team if suspicious pattern

### Expected Outcome
- Retry limiting prevents brute force attacks
- 3-attempt limit enforced per phone
- 30-minute lockout after max attempts
- Clear messaging about remaining attempts
- Automatic lockout enforcement

### Verification Checklist
- [ ] Max retry limit set to 3
- [ ] Lockout duration set to 30 minutes
- [ ] Retry counter initialized on OTP generation
- [ ] Counter incremented on failed verification
- [ ] Lockout triggered after 3rd failure
- [ ] Lockout checked before all OTP operations
- [ ] Remaining attempts shown in error messages
- [ ] Lockout time remaining shown to users
- [ ] Counters cleared on successful verification
- [ ] Admin lockout bypass implemented (if required)
- [ ] Lockout events logged for monitoring
- [ ] Tested lockout flow with multiple failures

---

## Task 39: Create Phone Validation

### Overview
Implement phone number validation specifically for Sri Lankan phone numbers. This validation ensures that only properly formatted and valid Sri Lankan mobile and landline numbers can receive OTPs. The validation includes format checking, country code verification, mobile operator prefix validation, and number length verification. The implementation supports multiple input formats and normalizes them to E.164 international format (+94XXXXXXXXX).

### Dependencies
- Task 33: Create OTP Verification Service

### Instructions

1. **Define Sri Lankan phone number formats**
   - Mobile format: +94 7X XXX XXXX (10 digits after +94)
   - Landline format: +94 XX XXX XXXX (9 digits after +94)
   - Focus primarily on mobile numbers for COD
   - Document all valid operator prefixes

2. **Create phone validation method**
   - Add method: `validate_phone(phone)`
   - Accept various input formats
   - Return normalized format or validation error
   - Use regex for format validation

3. **Implement format normalization**
   - Accept: "0771234567", "+94771234567", "94771234567", "771234567"
   - Convert all to: "+94771234567"
   - Remove spaces, hyphens, parentheses
   - Ensure consistent E.164 format output

4. **Validate mobile operator prefixes**
   - Dialog: 077, 076
   - Mobitel: 071, 070
   - Hutch/Etisalat: 078, 072
   - Airtel: 075
   - Create prefix validation list
   - Reject invalid prefixes

5. **Implement validation rules**
   - Must start with +94 (after normalization)
   - Must have correct length (12 chars with +94)
   - Must contain only digits (after country code)
   - Must have valid operator prefix
   - Must be mobile number (landlines optional)

6. **Create regex patterns**
   - Pattern for E.164: `^\+94[0-9]{9}$`
   - Pattern for mobile only: `^\+947[0-8][0-9]{7}$`
   - Pattern for landline: `^\+94[1-9][0-9]{8}$`
   - Use compiled regex for performance

7. **Add validation error messages**
   - "Invalid phone number format"
   - "Phone number must be a Sri Lankan number (+94)"
   - "Invalid mobile operator"
   - "Phone number too short/long"
   - Keep messages user-friendly

8. **Integrate with OTP operations**
   - Validate phone before generating OTP
   - Validate phone before sending SMS
   - Validate phone before verifying OTP
   - Return validation error immediately if invalid

### Phone Number Formats for Sri Lanka

| Format | Example | Valid | Notes |
|--------|---------|-------|-------|
| Local Mobile | 0771234567 | ✓ | Most common input |
| International | +94771234567 | ✓ | Standard E.164 |
| Without Plus | 94771234567 | ✓ | Accept and normalize |
| Without Country Code | 771234567 | ✓ | Accept and normalize |
| With Spaces | +94 77 123 4567 | ✓ | Remove spaces |
| With Hyphens | +94-77-123-4567 | ✓ | Remove hyphens |
| Landline | +94112345678 | ✓ (optional) | For future use |

### Sri Lankan Mobile Operators

| Operator | Prefixes | Market Share | Notes |
|----------|----------|--------------|-------|
| Dialog | 077, 076 | ~45% | Largest operator |
| Mobitel | 071, 070 | ~30% | Second largest |
| Hutch | 078, 072 | ~15% | Etisalat brand |
| Airtel | 075 | ~10% | Smallest |

### Valid Mobile Prefixes

```
Sri Lanka Mobile Prefixes (7X format):
- 070: Mobitel
- 071: Mobitel
- 072: Hutch/Etisalat
- 075: Airtel
- 076: Dialog
- 077: Dialog
- 078: Hutch/Etisalat

Pattern: 7[0-8]
Exception: 073, 074, 079 are NOT currently assigned
```

### Phone Normalization Algorithm

```
Input: Raw phone string
Output: E.164 format (+94XXXXXXXXX) or error

Steps:
1. Remove all spaces, hyphens, parentheses: "071-123-4567" → "0711234567"
2. Remove leading zeros: "0711234567" → "711234567"
3. Remove leading "94" if present: "94711234567" → "711234567"
4. Add "+94" prefix: "711234567" → "+94711234567"
5. Validate final format: Matches ^\+94[0-9]{9}$
6. Validate mobile prefix: Matches ^\+947[0-8][0-9]{7}$
7. Return normalized number or error
```

### Regex Patterns

| Pattern Name | Regex | Purpose |
|--------------|-------|---------|
| E.164 General | `^\+94[0-9]{9}$` | Any Sri Lankan number |
| Mobile Only | `^\+947[0-8][0-9]{7}$` | Mobile numbers only |
| Valid Operators | `^\+94(70\|71\|72\|75\|76\|77\|78)[0-9]{7}$` | Known operators |
| Landline | `^\+94[1-9][0-9]{8}$` | Landline format |

### Validation Method Structure

```
Method: validate_phone
Input: phone (str)
Output: dict

Success Response:
{
  "valid": true,
  "normalized": "+94771234567",
  "operator": "Dialog",
  "type": "mobile"
}

Error Response:
{
  "valid": false,
  "error": "Invalid mobile operator prefix",
  "input": "0731234567"
}
```

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Not Empty | `len(phone) > 0` | "Phone number is required" |
| Valid Characters | Only digits, +, -, (), spaces | "Phone number contains invalid characters" |
| Correct Length | 12 chars after normalization | "Phone number has incorrect length" |
| Country Code | Starts with +94 | "Must be a Sri Lankan number (+94)" |
| Mobile Prefix | Starts with +947X | "Invalid mobile operator" |
| Known Operator | Prefix in [70,71,72,75,76,77,78] | "Unknown mobile operator" |

### Validation Error Examples

| Input | Error | Reason |
|-------|-------|--------|
| 0731234567 | Invalid prefix | 073 not assigned |
| +95771234567 | Wrong country | +95 is Myanmar |
| 07712345 | Too short | Only 8 digits |
| 077123456789 | Too long | 12 digits |
| +94112345678 | Landline | Not mobile (optional: allow) |
| abc123 | Invalid format | Contains letters |

### Integration Points

| Operation | Validation Point | Action on Invalid |
|-----------|------------------|-------------------|
| Generate OTP | Before generation | Return error, don't generate |
| Send SMS | Before sending | Return error, don't send |
| Verify OTP | Before verification | Return error, don't verify |
| Check Lockout | Before checking | Return error |

### Phone Metadata Storage

```
Consider storing normalized phone with metadata:

Key: cod:phone_meta:{phone}
Value: JSON
TTL: 7 days

{
  "normalized": "+94771234567",
  "original_input": "0771234567",
  "operator": "Dialog",
  "validated_at": "2026-01-31T10:00:00Z",
  "validation_count": 5
}
```

### Expected Outcome
- Robust phone number validation
- Support for multiple input formats
- Normalization to E.164 standard
- Operator prefix validation
- Clear error messaging

### Verification Checklist
- [ ] Validate_phone method created
- [ ] Handles all common input formats
- [ ] Normalizes to +94XXXXXXXXX format
- [ ] Validates Sri Lankan operator prefixes
- [ ] Checks correct length (12 chars)
- [ ] Returns clear error messages
- [ ] Integrated with OTP generation
- [ ] Integrated with OTP verification
- [ ] Regex patterns compiled for performance
- [ ] Tested with valid and invalid numbers
- [ ] Tested with all operator prefixes (70,71,72,75,76,77,78)
- [ ] Rejects invalid prefixes (73, 74, 79)

---

## Task 40: Create Address Verification

### Overview
Implement basic address verification for COD orders to ensure delivery information is complete and valid. This verification checks for required address fields, validates district names against Sri Lankan districts, verifies postal code formats, and performs basic sanity checks on address strings. While not as strict as phone validation, address verification helps reduce delivery failures and fraud attempts.

### Dependencies
- Task 32: Create COD Payment Processor (from Group B)

### Instructions

1. **Define required address fields**
   - Street address or house number (required)
   - City or town (required)
   - District (required)
   - Postal code (required)
   - Additional landmark (optional)
   - Validate presence of all required fields

2. **Create Sri Lankan districts list**
   - Define all 25 districts
   - Colombo, Gampaha, Kalutara, Kandy, Matale, etc.
   - Support both Sinhala and English names (optional)
   - Create constant list for validation

3. **Implement address validation method**
   - Create method: `validate_address(address_dict)`
   - Accept address as dictionary with fields
   - Return validation result with specific errors
   - Check each field according to rules

4. **Validate street address**
   - Minimum length: 10 characters
   - Maximum length: 200 characters
   - Must contain alphanumeric characters
   - Cannot be only special characters or numbers

5. **Validate city/town**
   - Minimum length: 3 characters
   - Maximum length: 50 characters
   - Must contain letters
   - Remove excessive spaces

6. **Validate district**
   - Must match one of 25 Sri Lankan districts
   - Case-insensitive matching
   - Support common abbreviations (optional)
   - Reject invalid district names

7. **Validate postal code**
   - Sri Lanka format: 5 digits (e.g., 10100)
   - Must be numeric only
   - Valid range: 10000-99999
   - Check against known postal code ranges per district (optional)

8. **Implement sanity checks**
   - Detect suspicious patterns (all same characters)
   - Detect fake addresses ("test", "fake", "asdf")
   - Check for minimum word count (address too short)
   - Flag for manual review if suspicious

9. **Create address scoring system**
   - Assign completeness score (0-100)
   - Complete required fields: +25 each
   - Valid district: +10
   - Valid postal code: +10
   - Landmark provided: +5
   - Minimum score for approval: 75

10. **Add verification metadata**
    - Store verification result
    - Store validation timestamp
    - Store score and warnings
    - Use for risk assessment (Task 46)

### Address Verification Flow

```
Start Address Verification
        │
        ▼
  Check Required Fields
        │
        ├─ Missing Field ────► Return Error (field name)
        │
        ▼
  Validate Street Address
        │
        ├─ Invalid ──────────► Return Error (too short/long)
        │
        ▼
  Validate City
        │
        ├─ Invalid ──────────► Return Error (invalid format)
        │
        ▼
  Validate District
        │
        ├─ Not in List ──────► Return Error (unknown district)
        │
        ▼
  Validate Postal Code
        │
        ├─ Invalid Format ───► Return Error (not 5 digits)
        │
        ▼
  Run Sanity Checks
        │
        ├─ Suspicious ───────► Flag for Review
        │
        ▼
  Calculate Completeness Score
        │
        ├─ Score < 75 ───────► Return Warning (incomplete)
        │
        ▼
  Return Success + Score
        │
        ▼
       End
```

### Sri Lankan Districts (All 25)

| District | Province | Major Cities |
|----------|----------|--------------|
| Colombo | Western | Colombo, Dehiwala, Moratuwa |
| Gampaha | Western | Gampaha, Negombo, Ja-Ela |
| Kalutara | Western | Kalutara, Panadura, Horana |
| Kandy | Central | Kandy, Katugastota, Gampola |
| Matale | Central | Matale, Dambulla |
| Nuwara Eliya | Central | Nuwara Eliya, Hatton |
| Galle | Southern | Galle, Hikkaduwa, Ambalangoda |
| Matara | Southern | Matara, Weligama |
| Hambantota | Southern | Hambantota, Tangalle |
| Jaffna | Northern | Jaffna, Point Pedro |
| Kilinochchi | Northern | Kilinochchi |
| Mannar | Northern | Mannar |
| Vavuniya | Northern | Vavuniya |
| Mullaitivu | Northern | Mullaitivu |
| Batticaloa | Eastern | Batticaloa, Kattankudy |
| Ampara | Eastern | Ampara, Kalmunai |
| Trincomalee | Eastern | Trincomalee |
| Kurunegala | North Western | Kurunegala, Kuliyapitiya |
| Puttalam | North Western | Puttalam, Chilaw |
| Anuradhapura | North Central | Anuradhapura |
| Polonnaruwa | North Central | Polonnaruwa |
| Badulla | Uva | Badulla, Bandarawela |
| Monaragala | Uva | Monaragala |
| Ratnapura | Sabaragamuwa | Ratnapura, Embilipitiya |
| Kegalle | Sabaragamuwa | Kegalle, Mawanella |

### Address Field Validation Rules

| Field | Min Length | Max Length | Pattern | Required |
|-------|-----------|------------|---------|----------|
| Street Address | 10 | 200 | Alphanumeric + special | ✓ |
| City | 3 | 50 | Letters, spaces | ✓ |
| District | 3 | 50 | Must match list | ✓ |
| Postal Code | 5 | 5 | Numeric only | ✓ |
| Landmark | 0 | 100 | Any | ✗ |

### Postal Code Ranges (Examples)

| District | Postal Code Range | Examples |
|----------|------------------|-----------|
| Colombo | 00100-01500 | 00100 (Fort), 00800 (Borella) |
| Gampaha | 11000-11830 | 11000 (Gampaha), 11540 (Negombo) |
| Kandy | 20000-20850 | 20000 (Kandy), 20500 (Peradeniya) |
| Galle | 80000-80650 | 80000 (Galle), 80240 (Hikkaduwa) |

### Address Validation Method

```
Method: validate_address
Input: address (dict)

Expected Keys:
- street_address: str
- city: str
- district: str
- postal_code: str
- landmark: str (optional)

Output (Success):
{
  "valid": true,
  "score": 95,
  "normalized": {
    "street_address": "No 123, Main Street",
    "city": "Colombo",
    "district": "Colombo",
    "postal_code": "00800"
  }
}

Output (Error):
{
  "valid": false,
  "errors": [
    {"field": "district", "message": "Unknown district name"},
    {"field": "postal_code", "message": "Invalid format"}
  ],
  "score": 45
}
```

### Sanity Check Patterns

| Pattern | Example | Action |
|---------|---------|--------|
| All same char | "aaaaaaa" | Reject |
| Test/Fake words | "test address", "fake" | Reject |
| Keyboard mashing | "asdfghjkl" | Reject |
| Too short | "123" | Reject |
| No letters | "12345678" | Reject |
| All special chars | "@#$%^&*" | Reject |

### Address Scoring System

| Component | Points | Condition |
|-----------|--------|-----------|
| Street Address | 25 | Valid format |
| City | 25 | Valid format |
| District | 25 | Valid district |
| Postal Code | 25 | Valid format |
| Landmark Provided | +5 | Optional bonus |
| District-Postal Match | +10 | Postal code matches district |
| **Total** | 100 | Maximum possible |

### Suspicious Address Flags

| Flag | Trigger | Risk Level |
|------|---------|------------|
| TOO_SHORT | Total < 30 chars | High |
| INVALID_DISTRICT | Not in list | High |
| TEST_ADDRESS | Contains "test", "fake" | High |
| REPEATED_CHARS | Same char > 5 times | Medium |
| NO_NUMBERS | No house/building number | Medium |
| POSTAL_MISMATCH | Postal code doesn't match district | Low |

### Address Verification Response

```
Full Response Structure:
{
  "valid": true,
  "score": 85,
  "normalized": { ... },
  "flags": [
    {
      "flag": "NO_NUMBERS",
      "severity": "medium",
      "message": "Address doesn't contain house number"
    }
  ],
  "recommendations": [
    "Add house or building number",
    "Provide a landmark for easier delivery"
  ]
}
```

### Integration with Risk Management

Address verification score and flags feed into risk assessment:
- Score < 50: +20 risk points
- Score 50-75: +10 risk points
- Score > 75: +0 risk points
- Suspicious flags: +5 risk points each

### Expected Outcome
- Functional address validation
- District verification against Sri Lankan list
- Postal code format validation
- Sanity checks for fake addresses
- Completeness scoring system

### Verification Checklist
- [ ] Validate_address method created
- [ ] Checks all required fields present
- [ ] Validates street address (10-200 chars)
- [ ] Validates city (3-50 chars)
- [ ] Validates district against 25 Sri Lankan districts
- [ ] Validates postal code (5 digits)
- [ ] Implements sanity checks for suspicious patterns
- [ ] Calculates address completeness score
- [ ] Returns specific validation errors
- [ ] Flags suspicious addresses for review
- [ ] Tested with valid Sri Lankan addresses
- [ ] Tested with invalid/fake addresses
- [ ] Integration point added for risk scoring

---

## Summary

This document established the OTP verification system and phone/address validation for COD orders. The OTP system provides secure customer verification with generation, SMS delivery, verification, expiry, and retry limiting. Phone validation ensures only valid Sri Lankan mobile numbers can receive OTPs. Address verification performs basic checks to ensure delivery information is complete and valid.

### Completed Tasks
1. ✓ Created OTP verification service with clean interface
2. ✓ Implemented secure 6-digit OTP generation
3. ✓ Integrated SMS gateway for OTP delivery
4. ✓ Created OTP verification with constant-time comparison
5. ✓ Configured 10-minute automatic expiry
6. ✓ Implemented 3-attempt retry limit with 30-minute lockout
7. ✓ Validated Sri Lankan phone numbers (+94 format)
8. ✓ Verified addresses with district and postal code checks

### Next Steps
Proceed to [02_Tasks-41-48_Blacklist-Risk-Verify.md](02_Tasks-41-48_Blacklist-Risk-Verify.md) to implement blacklist management, previous order history checking, success rate calculation, dynamic COD limits, risk scoring, and risk threshold enforcement.
