# Document 02 of 02: OTP Verification, Rate Limiting & Cleanup

**Phase:** 09 - Integrations & Sri Lanka Localizations  
**SubPhase:** 12 - SMS Gateway Integration  
**Group:** C - OTP System  
**Document:** 02 of 02  
**Tasks:** 49-54

---

## Navigation

- **Previous Document:** [01_Tasks-39-48_Model-Service.md](./01_Tasks-39-48_Model-Service.md)
- **Parent Overview:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Next Group:** [../Group-D_SMS-Template-System/00_GROUP_OVERVIEW.md](../Group-D_SMS-Template-System/00_GROUP_OVERVIEW.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 49: Create verify_otp Method](#task-49-create-verify_otp-method)
3. [Task 50: Implement OTP Expiry Logic](#task-50-implement-otp-expiry-logic)
4. [Task 51: Implement Max Attempts Limit](#task-51-implement-max-attempts-limit)
5. [Task 52: Implement Resend Cooldown](#task-52-implement-resend-cooldown)
6. [Task 53: Create OTP Cleanup Task](#task-53-create-otp-cleanup-task)
7. [Task 54: End-to-End OTP System Testing](#task-54-end-to-end-otp-system-testing)
8. [Verification Flows](#verification-flows)
9. [Rate Limiting Architecture](#rate-limiting-architecture)
10. [Cleanup Schedule Diagram](#cleanup-schedule-diagram)
11. [Error Handling Matrix](#error-handling-matrix)
12. [Summary](#summary)

---

## Overview

This document covers the **verification, rate limiting, and cleanup** aspects of the OTP system. These tasks ensure security, prevent abuse, and maintain data hygiene by implementing verification logic, enforcing rate limits, and automatically cleaning expired OTPs.

### Document Scope

| **Aspect**            | **Description**                                           |
|-----------------------|-----------------------------------------------------------|
| **Purpose**           | Secure OTP verification with rate limiting and cleanup    |
| **Tasks Covered**     | 49-54                                                     |
| **Key Components**    | Verification method, expiry checks, rate limits, cleanup  |
| **Security Focus**    | Prevent brute force, timing attacks, resource exhaustion  |
| **Data Hygiene**      | Automated cleanup of expired OTPs                         |

### Security Principles

```
┌─────────────────────────────────────────────────────────────┐
│                    OTP Security Layers                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Time-Based Expiry (5 minutes)                    │
│  └─ Prevents replay attacks and stale codes                │
│                                                             │
│  Layer 2: Attempt Limiting (3 max attempts)                │
│  └─ Prevents brute force attacks                           │
│                                                             │
│  Layer 3: Resend Cooldown (60 seconds)                     │
│  └─ Prevents SMS flooding and abuse                        │
│                                                             │
│  Layer 4: Single-Use Enforcement                           │
│  └─ OTP invalidated after successful verification          │
│                                                             │
│  Layer 5: Automatic Cleanup (hourly)                       │
│  └─ Removes expired data to reduce attack surface          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Task 49: Create verify_otp Method

### Overview

Create the core OTP verification method that validates codes, checks expiry, manages attempt counts, and handles verification failures securely.

| **Attribute**       | **Details**                                              |
|---------------------|----------------------------------------------------------|
| **Task ID**         | 49                                                       |
| **Component**       | OTPService.verify_otp()                                  |
| **File Location**   | `backend/apps/integrations/services/otp_service.py`      |
| **Dependencies**    | Task 39-48 (OTP model, generation, sending)              |
| **Estimated Time**  | 3 hours                                                  |

### Purpose

| **Purpose Category** | **Description**                                         |
|----------------------|---------------------------------------------------------|
| **Security**         | Validate OTPs securely with timing attack resistance    |
| **User Experience**  | Clear error messages for different failure scenarios    |
| **Audit Trail**      | Track all verification attempts for security analysis   |
| **Resource Control** | Prevent brute force through attempt limiting            |

### Dependencies

```
verify_otp() depends on:
├─ OTP Model (Task 39-41)
│  ├─ code field
│  ├─ expires_at field
│  ├─ attempts field
│  └─ verified_at field
├─ Database Transaction Support
│  └─ Atomic updates for attempt counter
└─ Timezone Handling
   └─ Accurate expiry calculations
```

### Instructions

#### Step 1: Method Signature and Input Validation

Create the verify_otp method in OTPService class:

**Method Parameters:**
- `phone_number` (str): The recipient's phone number
- `code` (str): The OTP code to verify
- `purpose` (str): The purpose of the OTP (e.g., 'login', 'password_reset')
- `tenant` (Tenant): The tenant context

**Input Validation:**
1. Validate phone number format (E.164)
2. Validate code format (6 digits)
3. Validate purpose is non-empty
4. Check tenant exists and is active

#### Step 2: OTP Retrieval Logic

Query for the OTP record:

**Query Criteria:**
- Match phone_number exactly
- Match purpose exactly
- Filter by tenant
- Order by created_at descending (get most recent)
- Filter only unverified OTPs (verified_at is NULL)

**Handling No Record Found:**
- Return failure result with "Invalid OTP" message
- Do not reveal whether phone/purpose combination exists
- Log the failed attempt for security monitoring

#### Step 3: Expiry Check Implementation

Before validating the code:

**Expiry Validation:**
1. Get current time with timezone awareness
2. Compare current time with otp.expires_at
3. If expired:
   - Mark OTP as expired (set a flag or update status)
   - Return failure with "OTP has expired" message
   - Suggest user request new OTP
   - Do NOT increment attempts counter

**Edge Cases:**
- Handle timezone mismatches
- Consider clock skew (1-2 second tolerance)
- Ensure consistent timezone usage (UTC recommended)

#### Step 4: Attempt Limiting

Check and update attempt counter:

**Attempt Validation:**
1. Check if otp.attempts >= MAX_ATTEMPTS (3)
2. If max reached:
   - Return failure with "Too many attempts" message
   - Mark OTP as blocked
   - Log security event
   - Do NOT allow further attempts on this OTP

**Atomic Counter Update:**
- Use database transaction to increment attempts
- Ensure no race conditions with concurrent requests
- Update attempts BEFORE code validation to prevent timing attacks

#### Step 5: Code Validation

Validate the provided code against stored code:

**Validation Method:**
- Use timing-safe comparison (constant-time)
- Compare code strings directly (case-sensitive)
- Do NOT use simple == operator (timing attack vulnerable)

**Python Implementation Note:**
Use `hmac.compare_digest()` or `secrets.compare_digest()` for constant-time comparison

**On Validation Failure:**
1. Increment attempts counter (already done in Step 4)
2. Calculate remaining attempts
3. Return failure with attempts remaining count
4. Log failed verification attempt

#### Step 6: Successful Verification Handling

On successful code match:

**Success Actions:**
1. Set verified_at to current timestamp
2. Mark OTP as used (prevents re-use)
3. Log successful verification
4. Return success result with verification details

**Return Data Structure:**
```
{
    'success': True,
    'verified_at': timestamp,
    'phone_number': masked_phone,
    'purpose': purpose
}
```

#### Step 7: Error Response Structure

Standardize error responses:

**Error Response Format:**
```
{
    'success': False,
    'error_code': 'OTP_EXPIRED' | 'OTP_INVALID' | 'OTP_MAX_ATTEMPTS' | 'OTP_NOT_FOUND',
    'message': User-friendly error message,
    'attempts_remaining': int (if applicable),
    'can_resend': boolean
}
```

**Error Codes:**
- `OTP_EXPIRED`: OTP has passed expiry time
- `OTP_INVALID`: Code does not match
- `OTP_MAX_ATTEMPTS`: Maximum attempts reached
- `OTP_NOT_FOUND`: No OTP record found

#### Step 8: Logging and Audit Trail

Implement comprehensive logging:

**Log Events:**
1. Every verification attempt (success/failure)
2. Include: timestamp, tenant, phone (masked), purpose, result
3. Log security events: max attempts reached, expired OTP used
4. Do NOT log actual OTP codes

**Log Levels:**
- INFO: Successful verifications
- WARNING: Failed attempts, approaching max attempts
- ERROR: Security violations, suspicious patterns

### Expected Outcome

✅ **Success Criteria:**
- verify_otp method correctly validates OTPs
- Expiry checks prevent use of old OTPs
- Attempt limiting prevents brute force
- Timing-safe comparison prevents timing attacks
- Clear error messages guide users
- All attempts logged for audit

### Verification

**Test Cases:**

1. **Valid OTP Verification:**
   - Generate OTP
   - Immediately verify with correct code
   - Assert success response
   - Check verified_at is set
   - Verify cannot use same OTP again

2. **Invalid OTP Code:**
   - Generate OTP
   - Attempt verification with wrong code
   - Assert failure response
   - Check attempts counter incremented
   - Verify remaining attempts returned

3. **Expired OTP:**
   - Generate OTP
   - Mock time to be past expiry
   - Attempt verification
   - Assert expiry error
   - Verify attempts NOT incremented

4. **Max Attempts Reached:**
   - Generate OTP
   - Attempt verification 3 times with wrong code
   - Assert all 3 attempts fail
   - Fourth attempt should return max_attempts error
   - Verify OTP blocked

5. **Timing Attack Resistance:**
   - Verify constant-time comparison used
   - Measure response times for correct vs incorrect codes
   - Assert no significant timing difference

---

## Task 50: Implement OTP Expiry Logic

### Overview

Implement time-based expiry for OTPs with a default 5-minute lifetime to prevent replay attacks and ensure time-sensitive verification.

| **Attribute**       | **Details**                                              |
|---------------------|----------------------------------------------------------|
| **Task ID**         | 50                                                       |
| **Component**       | OTP Expiry System                                        |
| **Configuration**   | `settings.OTP_EXPIRY_MINUTES = 5`                        |
| **Dependencies**    | Task 39-49 (OTP model and verification)                  |
| **Estimated Time**  | 2 hours                                                  |

### Purpose

| **Purpose Category** | **Description**                                         |
|----------------------|---------------------------------------------------------|
| **Security**         | Limit window of opportunity for code interception       |
| **UX Balance**       | Long enough for user to receive and enter code          |
| **Compliance**       | Meet industry standards for OTP expiry (3-10 minutes)   |
| **Resource Control** | Prevent accumulation of long-lived verification codes   |

### Dependencies

```
OTP Expiry depends on:
├─ Django Settings
│  └─ OTP_EXPIRY_MINUTES configuration
├─ Timezone Support
│  ├─ django.utils.timezone
│  └─ UTC timestamp handling
├─ OTP Model
│  ├─ created_at field
│  └─ expires_at field
└─ Database Index
   └─ Index on expires_at for efficient queries
```

### Instructions

#### Step 1: Configuration Setup

Add OTP expiry settings:

**Django Settings File:** `backend/config/settings/base.py`

**Configuration Values:**
- `OTP_EXPIRY_MINUTES`: Default 5 minutes
- `OTP_EXPIRY_SECONDS`: Calculated (5 * 60 = 300)
- Allow override in environment variables

**Environment Variable:**
- `OTP_EXPIRY_MINUTES`: Override default in .env file
- Validation: Must be between 1 and 30 minutes

#### Step 2: Expiry Calculation on Generation

Update OTP generation (Task 42-43) to set expires_at:

**Calculation Method:**
1. Get current time: `timezone.now()`
2. Add expiry duration: `timedelta(minutes=OTP_EXPIRY_MINUTES)`
3. Store in expires_at field

**Timezone Handling:**
- Always use UTC for storage
- Use Django's `timezone.now()` for timezone-aware timestamps
- Ensure created_at and expires_at are timezone-aware

#### Step 3: Expiry Check Logic

Implement expiry checking (used in Task 49):

**Check Method:**
```
def is_expired(otp_record):
    current_time = timezone.now()
    return current_time > otp_record.expires_at
```

**Edge Cases:**
- Handle None values in expires_at (treat as expired)
- Consider clock skew (1-2 second tolerance)
- Ensure consistent timezone across all services

#### Step 4: Database Query Optimization

Add indexes for expiry-based queries:

**Index Creation:**
- Create index on expires_at column
- Create composite index on (phone_number, expires_at, verified_at)
- Improves performance for cleanup queries

**Query Optimization:**
- Filter expired OTPs: `expires_at < timezone.now()`
- Filter valid OTPs: `expires_at >= timezone.now()`
- Use database-level comparison for efficiency

#### Step 5: Expiry Extension (Optional)

Consider allowing expiry extension in special cases:

**Extension Rules:**
- Only extend if not yet expired
- Maximum 1 extension per OTP
- Add extension_count field to track
- Log all extensions for audit

**Use Cases:**
- User requests more time
- System detected delivery delay
- Tenant-specific requirements

#### Step 6: User Communication

Update user-facing messages to include expiry info:

**SMS Message Template:**
Include expiry info:
"Your verification code is {code}. Valid for 5 minutes."

**Error Messages:**
- Clear expiry notification
- Suggest requesting new OTP
- Show time elapsed since generation

### Expected Outcome

✅ **Success Criteria:**
- OTPs expire after 5 minutes by default
- Expiry time configurable via settings
- Timezone-aware expiry calculations
- Efficient database queries with indexes
- Clear expiry messages to users

### Verification

**Test Cases:**

1. **Default Expiry Time:**
   - Generate OTP
   - Check expires_at is 5 minutes in future
   - Verify timezone-aware timestamp

2. **Expiry Detection:**
   - Generate OTP
   - Mock time to 4 minutes later (within expiry)
   - Verify OTP still valid
   - Mock time to 6 minutes later (past expiry)
   - Verify OTP marked as expired

3. **Custom Expiry Configuration:**
   - Set OTP_EXPIRY_MINUTES = 10
   - Generate OTP
   - Check expires_at is 10 minutes in future

4. **Timezone Handling:**
   - Generate OTP in different timezone
   - Verify expiry calculation uses UTC
   - Check consistent expiry across timezones

5. **Query Performance:**
   - Create 10,000 expired OTPs
   - Query for valid OTPs
   - Measure query execution time
   - Verify index usage with EXPLAIN

---

## Task 51: Implement Max Attempts Limit

### Overview

Enforce a maximum of 3 verification attempts per OTP to prevent brute force attacks on 6-digit codes (1 million possible combinations).

| **Attribute**       | **Details**                                              |
|---------------------|----------------------------------------------------------|
| **Task ID**         | 51                                                       |
| **Component**       | Attempt Limiting System                                  |
| **Configuration**   | `settings.OTP_MAX_ATTEMPTS = 3`                          |
| **Dependencies**    | Task 49 (verify_otp method)                              |
| **Estimated Time**  | 2 hours                                                  |

### Purpose

| **Purpose Category** | **Description**                                         |
|----------------------|---------------------------------------------------------|
| **Security**         | Prevent brute force attacks on OTP codes                |
| **Risk Mitigation**  | Reduce probability of successful guessing attack        |
| **Resource Control** | Prevent abuse of verification endpoint                  |
| **User Protection**  | Detect potential account compromise attempts            |

### Dependencies

```
Max Attempts depends on:
├─ OTP Model
│  └─ attempts field (IntegerField)
├─ verify_otp Method (Task 49)
│  └─ Atomic attempt counter increment
├─ Database Transactions
│  └─ Prevent race conditions
└─ Configuration Settings
   └─ OTP_MAX_ATTEMPTS setting
```

### Instructions

#### Step 1: Configuration Setup

Add max attempts setting:

**Django Settings:** `backend/config/settings/base.py`

**Configuration Values:**
- `OTP_MAX_ATTEMPTS`: Default 3
- `OTP_LOCKOUT_DURATION`: Optional lockout period (e.g., 15 minutes)
- Allow override via environment variables

**Security Considerations:**
- 3 attempts provides balance between security and UX
- Lower values (1-2) too restrictive for users
- Higher values (4+) increase brute force risk

**Attack Probability:**
- 1 attempt: 1/1,000,000 (0.0001%)
- 3 attempts: 3/1,000,000 (0.0003%)
- 5 attempts: 5/1,000,000 (0.0005%)

#### Step 2: Atomic Counter Implementation

Ensure thread-safe attempt counting:

**Database Transaction:**
Use Django's atomic transactions for counter updates

**Update Method:**
1. Lock OTP record for update
2. Read current attempts value
3. Increment counter
4. Save and release lock

**Concurrency Handling:**
- Prevent race conditions from simultaneous requests
- Use F() expressions for atomic increments
- Handle database-level constraints

#### Step 3: Pre-Validation Attempt Check

Check attempt count BEFORE validating code:

**Validation Flow:**
1. Retrieve OTP record
2. Check if attempts >= MAX_ATTEMPTS
3. If max reached, return error immediately
4. If under max, increment counter
5. Validate code
6. Return result

**Why Pre-Validation Matters:**
- Prevents timing attacks on attempt counter
- Ensures consistent response time regardless of code validity
- Blocks further attempts once limit reached

#### Step 4: Lockout Implementation

Implement OTP lockout after max attempts:

**Lockout Strategy:**
- Mark OTP as locked/blocked after max attempts
- Prevent any further validation attempts
- Require user to request new OTP
- Log lockout event for security monitoring

**Lockout Fields:**
Consider adding to OTP model:
- `locked_at`: Timestamp when locked
- `locked`: Boolean flag
- `lock_reason`: Description (e.g., "max_attempts_exceeded")

#### Step 5: User Feedback

Provide clear feedback on attempts:

**Remaining Attempts:**
After each failed attempt, inform user:
- "Incorrect code. X attempts remaining."
- Increase urgency as attempts decrease

**Max Attempts Reached:**
Clear message when locked:
- "Too many incorrect attempts. Please request a new code."
- Provide clear path to request new OTP

**Progressive Warning:**
- Attempt 1 failed: "Incorrect code. 2 attempts remaining."
- Attempt 2 failed: "Incorrect code. 1 attempt remaining. Please double-check your code."
- Attempt 3 failed: "Maximum attempts exceeded. Please request a new verification code."

#### Step 6: Security Monitoring

Implement alerting for suspicious patterns:

**Monitor For:**
- Multiple OTPs reaching max attempts from same user
- Multiple max-attempt failures across different users
- Automated attack patterns (rapid requests)

**Alert Thresholds:**
- 5+ locked OTPs per user per day
- 50+ locked OTPs per tenant per hour
- 100+ locked OTPs system-wide per hour

**Response Actions:**
- Log to security monitoring system
- Send admin notifications
- Consider temporary phone number blocks
- Implement progressive delays (rate limiting)

### Expected Outcome

✅ **Success Criteria:**
- Maximum 3 attempts per OTP enforced
- Atomic counter updates prevent race conditions
- Clear user feedback on remaining attempts
- Locked OTPs cannot be retried
- Security events logged and monitored

### Verification

**Test Cases:**

1. **Single User - Max Attempts:**
   - Generate OTP
   - Attempt 1: Wrong code → 2 remaining
   - Attempt 2: Wrong code → 1 remaining
   - Attempt 3: Wrong code → Locked
   - Attempt 4: Should return max_attempts error without checking code

2. **Concurrent Attempt Race Condition:**
   - Generate OTP
   - Simulate 5 simultaneous wrong verification attempts
   - Verify only 3 attempts recorded
   - Ensure no counter corruption

3. **Successful Verification on Last Attempt:**
   - Generate OTP
   - Attempt 1: Wrong code
   - Attempt 2: Wrong code
   - Attempt 3: Correct code → Success
   - Verify OTP marked as verified, not locked

4. **Attempt Counter Reset:**
   - Generate OTP for user
   - Exhaust attempts
   - Request new OTP
   - Verify new OTP has fresh attempt counter

5. **Security Monitoring:**
   - Trigger 10 max-attempt lockouts
   - Verify security events logged
   - Check monitoring alerts triggered

---

## Task 52: Implement Resend Cooldown

### Overview

Implement a 60-second cooldown between OTP resend requests to prevent SMS flooding, abuse, and cost control while maintaining good user experience.

| **Attribute**       | **Details**                                              |
|---------------------|----------------------------------------------------------|
| **Task ID**         | 52                                                       |
| **Component**       | OTP Resend Rate Limiting                                 |
| **Configuration**   | `settings.OTP_RESEND_COOLDOWN_SECONDS = 60`              |
| **Dependencies**    | Task 42-48 (OTP generation and sending)                  |
| **Estimated Time**  | 2.5 hours                                                |

### Purpose

| **Purpose Category** | **Description**                                         |
|----------------------|---------------------------------------------------------|
| **Cost Control**     | Prevent excessive SMS costs from repeated sends         |
| **Abuse Prevention** | Block SMS flooding attacks on system                    |
| **User Protection**  | Prevent harassment via SMS spam                         |
| **Resource Control** | Protect SMS gateway from rate limit violations          |

### Dependencies

```
Resend Cooldown depends on:
├─ OTP Model
│  ├─ created_at field
│  └─ last_sent_at field (optional)
├─ generate_and_send_otp Method
│  └─ Check cooldown before generation
├─ Cache Layer (Optional)
│  └─ Fast cooldown lookups
└─ Configuration Settings
   └─ OTP_RESEND_COOLDOWN_SECONDS
```

### Instructions

#### Step 1: Configuration Setup

Add resend cooldown settings:

**Django Settings:** `backend/config/settings/base.py`

**Configuration Values:**
- `OTP_RESEND_COOLDOWN_SECONDS`: Default 60 seconds
- `OTP_RESEND_MAX_PER_HOUR`: Optional additional limit (e.g., 5)
- `OTP_RESEND_MAX_PER_DAY`: Optional daily limit (e.g., 10)

**Cooldown Duration Rationale:**
- 60 seconds: Balance between UX and abuse prevention
- 30 seconds: Too short, easily abused
- 120 seconds: Too long, frustrates users with delivery delays

#### Step 2: Cooldown Check Implementation

Add cooldown validation to generate_and_send_otp:

**Check Logic:**
1. Query for last OTP sent to phone number
2. Calculate time since last send
3. If less than cooldown period, reject request
4. If cooldown passed, proceed with generation

**Query for Last Send:**
```
Filter: phone_number, tenant
Order by: created_at DESC
Limit: 1
Get: created_at or last_sent_at
```

**Time Calculation:**
```
time_since_last = timezone.now() - last_otp.created_at
cooldown_remaining = COOLDOWN_SECONDS - time_since_last.total_seconds()
```

#### Step 3: Cache-Based Cooldown (Performance Optimization)

Use cache for fast cooldown checks:

**Cache Key Format:**
```
otp_cooldown:{tenant_id}:{phone_number}
```

**Cache Strategy:**
1. On OTP send: Set cache key with TTL = cooldown duration
2. On resend check: Check if cache key exists
3. If exists: Return cooldown error with remaining time
4. If not exists: Proceed with generation

**Cache Backend:**
- Use Redis for distributed systems
- Use in-memory cache for single-server setups
- Fallback to database if cache unavailable

#### Step 4: Error Response with Countdown

Return informative cooldown error:

**Response Format:**
```
{
    'success': False,
    'error_code': 'OTP_RESEND_COOLDOWN',
    'message': 'Please wait before requesting another code',
    'cooldown_remaining_seconds': int,
    'can_resend_at': ISO timestamp,
    'retry_after': int (seconds)
}
```

**User-Friendly Message:**
- "Please wait X seconds before requesting a new code"
- Show countdown timer in UI
- Explain reason: "This helps protect your account"

#### Step 5: Hourly/Daily Limits

Implement additional rate limits:

**Hourly Limit (Optional):**
- Track OTP sends per phone per hour
- Limit to 5 sends per hour
- Reset counter every hour

**Daily Limit (Optional):**
- Track OTP sends per phone per day
- Limit to 10 sends per day
- Reset at midnight (tenant timezone)

**Implementation Options:**
1. Database: Query count in time window
2. Cache: Increment counter with TTL
3. Redis: Use INCR with EXPIRE

#### Step 6: Bypass Mechanism for Support

Allow admin bypass of cooldown:

**Bypass Scenarios:**
- User reports no SMS received
- Support staff manually triggers resend
- Emergency account recovery

**Bypass Implementation:**
- Add `bypass_cooldown` parameter to generate_and_send_otp
- Require admin permissions
- Log all bypass events
- Rate limit bypass usage per support staff

#### Step 7: Progressive Cooldown (Advanced)

Implement escalating cooldown for repeated resends:

**Progressive Strategy:**
- 1st resend: 60 seconds
- 2nd resend: 120 seconds (2 minutes)
- 3rd resend: 300 seconds (5 minutes)
- 4th+ resend: 600 seconds (10 minutes)

**Reset Conditions:**
- Successful OTP verification resets cooldown tier
- 1 hour of no resend requests resets to base tier

**Tracking:**
- Store resend count in cache or database
- Include timestamp of first request in window
- Calculate appropriate cooldown based on tier

### Expected Outcome

✅ **Success Criteria:**
- 60-second cooldown enforced between resends
- Cache-based implementation for performance
- Clear error messages with countdown
- Optional hourly/daily limits configured
- Admin bypass capability for support cases
- All cooldown violations logged

### Verification

**Test Cases:**

1. **Basic Cooldown Enforcement:**
   - Send OTP
   - Immediately request resend
   - Assert cooldown error returned
   - Wait 60 seconds
   - Request resend again
   - Assert success

2. **Countdown Accuracy:**
   - Send OTP
   - Wait 30 seconds
   - Request resend
   - Assert cooldown_remaining ≈ 30 seconds
   - Verify can_resend_at timestamp accurate

3. **Cache Performance:**
   - Send 1000 OTPs to different numbers
   - Request immediate resends
   - Measure response time
   - Assert < 50ms response for cooldown check

4. **Hourly Limit:**
   - Send 5 OTPs to same number (waiting cooldown between each)
   - 6th request should fail with hourly_limit error
   - Wait 1 hour
   - Verify can send again

5. **Admin Bypass:**
   - Send OTP
   - Admin requests resend with bypass_cooldown=True
   - Assert success despite cooldown
   - Verify bypass logged

6. **Progressive Cooldown:**
   - Trigger 3 consecutive resends
   - Verify cooldown increases: 60s → 120s → 300s
   - Wait 1 hour
   - Verify cooldown reset to 60s

---

## Task 53: Create OTP Cleanup Task

### Overview

Implement a Celery periodic task to automatically delete expired OTPs on an hourly schedule, maintaining database hygiene and reducing attack surface.

| **Attribute**       | **Details**                                              |
|---------------------|----------------------------------------------------------|
| **Task ID**         | 53                                                       |
| **Component**       | OTP Cleanup Celery Task                                  |
| **File Location**   | `backend/apps/integrations/tasks/otp_tasks.py`           |
| **Dependencies**    | Task 39-41 (OTP model), Celery setup                     |
| **Estimated Time**  | 2.5 hours                                                |

### Purpose

| **Purpose Category** | **Description**                                         |
|----------------------|---------------------------------------------------------|
| **Data Hygiene**     | Remove obsolete OTPs from database                      |
| **Security**         | Reduce attack surface by deleting expired codes         |
| **Performance**      | Prevent table bloat and maintain query performance      |
| **Compliance**       | Data minimization - don't retain unnecessary data       |

### Dependencies

```
OTP Cleanup depends on:
├─ Celery
│  ├─ Celery app configuration
│  ├─ Celery beat scheduler
│  └─ Task retry mechanism
├─ OTP Model
│  ├─ expires_at field
│  └─ verified_at field
├─ Database
│  └─ Bulk delete support
└─ Logging
   └─ Cleanup audit trail
```

### Instructions

#### Step 1: Create Cleanup Task

Create Celery task for OTP cleanup:

**File:** `backend/apps/integrations/tasks/otp_tasks.py`

**Task Decorator:**
```
@shared_task(
    name='integrations.cleanup_expired_otps',
    bind=True,
    max_retries=3,
    default_retry_delay=300  # 5 minutes
)
```

**Task Configuration:**
- `bind=True`: Access task instance (for retry)
- `max_retries=3`: Retry up to 3 times on failure
- `default_retry_delay`: Wait 5 minutes between retries

#### Step 2: Deletion Criteria

Define which OTPs to delete:

**Deletion Rules:**
1. **Expired and Unverified:**
   - `expires_at < now()` AND `verified_at IS NULL`
   - Never used but expired

2. **Verified and Old:**
   - `verified_at < now() - 24 hours`
   - Successfully used but keeping for 24h audit trail

3. **Failed and Old:**
   - `attempts >= MAX_ATTEMPTS` AND `created_at < now() - 24 hours`
   - Locked OTPs older than 24 hours

**Grace Period:**
- Keep verified OTPs for 24 hours for audit
- Keep failed OTPs for 24 hours for security analysis
- Delete immediately: Expired unverified OTPs past grace period

#### Step 3: Query and Delete Logic

Implement efficient bulk deletion:

**Query Strategy:**
```
Step 1: Query expired unverified OTPs
  Filter: expires_at < (now - grace_period)
  AND verified_at IS NULL
  
Step 2: Query old verified OTPs
  Filter: verified_at < (now - 24 hours)
  
Step 3: Query old failed OTPs
  Filter: attempts >= MAX_ATTEMPTS
  AND created_at < (now - 24 hours)
```

**Bulk Delete:**
- Use queryset.delete() for efficiency
- Delete in batches of 1000 if large volume
- Use database transactions

**Batch Processing:**
```
while True:
    batch = query.filter(...)[:1000]
    if not batch:
        break
    count, details = batch.delete()
    total_deleted += count
```

#### Step 4: Logging and Metrics

Implement comprehensive logging:

**Log Information:**
- Task start time
- Number of OTPs deleted (by category)
- Task duration
- Any errors encountered
- Task end time

**Metrics to Track:**
- Total OTPs deleted
- Breakdown by deletion reason
- Database space reclaimed
- Task execution time

**Log Example:**
```
INFO: OTP cleanup task started
INFO: Deleted 1,234 expired unverified OTPs
INFO: Deleted 567 old verified OTPs  
INFO: Deleted 89 old failed OTPs
INFO: Total deleted: 1,890 OTPs
INFO: Task completed in 2.3 seconds
```

#### Step 5: Schedule Configuration

Configure Celery Beat schedule:

**File:** `backend/config/celery.py` or `backend/config/settings/base.py`

**Schedule Definition:**
```
CELERY_BEAT_SCHEDULE = {
    'cleanup-expired-otps': {
        'task': 'integrations.cleanup_expired_otps',
        'schedule': crontab(minute=0),  # Every hour
        'options': {
            'expires': 3000,  # Task expires after 50 min
        }
    }
}
```

**Schedule Options:**
- Every hour at :00 minutes
- Alternative: Every 6 hours at midnight, 6am, noon, 6pm
- Alternative: Daily at 2am (low traffic time)

#### Step 6: Error Handling and Retry

Implement robust error handling:

**Error Scenarios:**
- Database connection failure
- Lock timeout
- Query timeout
- Unexpected exceptions

**Retry Strategy:**
```
try:
    # Cleanup logic
except OperationalError as e:
    # Database error - retry
    raise self.retry(exc=e)
except Exception as e:
    # Unexpected error - log and fail
    logger.error(f"OTP cleanup failed: {e}")
    raise
```

**Max Retry Handling:**
- After 3 retries, send alert to admins
- Log to error tracking system (Sentry)
- Continue on next scheduled run

#### Step 7: Monitoring and Alerting

Set up monitoring for cleanup task:

**Monitor Metrics:**
- Task execution success/failure rate
- Number of OTPs deleted per run
- Task execution duration
- Database query performance

**Alert Conditions:**
- Task failure 3 times consecutively
- Unusually high deletion count (>10,000)
- Task execution time >5 minutes
- Task not executed in last 2 hours

**Alert Channels:**
- Admin email notifications
- Slack/Teams webhook
- Error tracking system
- System monitoring dashboard

### Expected Outcome

✅ **Success Criteria:**
- Celery task deletes expired OTPs hourly
- Efficient bulk deletion prevents performance impact
- Comprehensive logging and metrics
- Error handling with retry mechanism
- Monitoring and alerting configured
- Database space reclaimed automatically

### Verification

**Test Cases:**

1. **Manual Task Execution:**
   - Create 10 expired OTPs
   - Run cleanup task manually
   - Verify all expired OTPs deleted
   - Check logs for deletion count

2. **Grace Period Enforcement:**
   - Create verified OTP 1 hour ago
   - Run cleanup task
   - Verify OTP NOT deleted (within 24h grace)
   - Mock time to 25 hours later
   - Run cleanup again
   - Verify OTP deleted

3. **Batch Processing:**
   - Create 5,000 expired OTPs
   - Run cleanup task
   - Verify all deleted in batches
   - Check task completes in <30 seconds

4. **Scheduled Execution:**
   - Start Celery beat scheduler
   - Wait for next hour mark
   - Verify task automatically executed
   - Check logs for scheduled run

5. **Error Handling:**
   - Simulate database connection failure
   - Run cleanup task
   - Verify task retries 3 times
   - Check error logged after max retries

6. **Metrics Accuracy:**
   - Create mix of OTP types:
     - 100 expired unverified
     - 50 old verified
     - 25 old failed
   - Run cleanup task
   - Verify metrics report correct counts

---

## Task 54: End-to-End OTP System Testing

### Overview

Comprehensive end-to-end testing of the complete OTP system including generation, delivery, verification, rate limiting, and cleanup to ensure production readiness.

| **Attribute**       | **Details**                                              |
|---------------------|----------------------------------------------------------|
| **Task ID**         | 54                                                       |
| **Component**       | Full OTP System Integration                              |
| **Test Coverage**   | All Tasks 39-53                                          |
| **Dependencies**    | All previous OTP tasks completed                         |
| **Estimated Time**  | 4 hours                                                  |

### Purpose

| **Purpose Category** | **Description**                                         |
|----------------------|---------------------------------------------------------|
| **Quality Assurance**| Validate entire OTP workflow functions correctly        |
| **Security Testing** | Verify security controls prevent abuse                  |
| **Performance**      | Ensure system handles expected load                     |
| **Integration**      | Confirm all components work together                    |

### Dependencies

```
E2E Testing depends on:
├─ All OTP Components (Task 39-53)
│  ├─ OTP Model
│  ├─ OTP Service
│  ├─ SMS Integration
│  ├─ Rate Limiting
│  └─ Cleanup Tasks
├─ Test Framework
│  ├─ Django TestCase
│  ├─ Factory Boy (test data)
│  └─ Mock objects
├─ Test Database
│  └─ Isolated test schema
└─ Mock SMS Gateway
   └─ Capture sent messages
```

### Instructions

#### Step 1: Test Environment Setup

Configure isolated test environment:

**Test Settings:**
- Use test database (separate from dev/prod)
- Mock SMS gateway (capture messages)
- Reduce timeouts for faster tests
- Enable all OTP features
- Configure test-specific rate limits

**Test Configuration:**
```
OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 5
OTP_MAX_ATTEMPTS = 3
OTP_RESEND_COOLDOWN_SECONDS = 60
SMS_PROVIDER = 'mock'  # Mock provider for testing
```

**Mock SMS Gateway:**
- Create mock SMS service
- Capture all "sent" messages
- Simulate success/failure scenarios
- Track message count and content

#### Step 2: Happy Path Testing

Test complete successful OTP flow:

**Test: Successful Login with OTP**
1. User requests OTP for login
2. System generates 6-digit code
3. SMS sent to user's phone (captured by mock)
4. User enters correct code
5. System validates code
6. OTP marked as verified
7. User authenticated successfully

**Assertions:**
- OTP created with correct attributes
- SMS message contains correct code
- Verification succeeds on first attempt
- verified_at timestamp set
- OTP cannot be reused

**Test: Successful Password Reset with OTP**
1. User requests password reset
2. OTP generated with purpose='password_reset'
3. SMS sent with code
4. User verifies OTP
5. User resets password
6. Process completes successfully

#### Step 3: Expiry Testing

Test OTP expiry behavior:

**Test: Expired OTP Rejection**
1. Generate OTP
2. Mock time to 6 minutes later (past expiry)
3. Attempt verification
4. Assert expiry error returned
5. Verify attempts counter NOT incremented

**Test: Near-Expiry Success**
1. Generate OTP
2. Mock time to 4 minutes 59 seconds later
3. Attempt verification with correct code
4. Assert success (still within expiry window)

**Test: Multiple Expiry Checks**
1. Generate 5 OTPs at different times
2. Mock various time progressions
3. Verify expiry checked correctly for each

#### Step 4: Attempt Limiting Testing

Test max attempts enforcement:

**Test: Max Attempts Lockout**
1. Generate OTP
2. Attempt 1: Wrong code → 2 remaining
3. Attempt 2: Wrong code → 1 remaining  
4. Attempt 3: Wrong code → Locked
5. Attempt 4: Any code → Max attempts error
6. Verify OTP cannot be verified anymore

**Test: Success on Final Attempt**
1. Generate OTP
2. Attempt 1: Wrong code
3. Attempt 2: Wrong code
4. Attempt 3: Correct code → Success
5. Verify OTP marked verified, not locked

**Test: Concurrent Attempt Protection**
1. Generate OTP
2. Simulate 10 simultaneous verification attempts
3. Verify only 3 attempts processed
4. Assert thread-safe counter updates

#### Step 5: Rate Limiting Testing

Test resend cooldown and rate limits:

**Test: Resend Cooldown**
1. Send OTP
2. Immediately request resend
3. Assert cooldown error with countdown
4. Mock time 60 seconds forward
5. Request resend again
6. Assert success

**Test: Hourly Limit (if implemented)**
1. Send OTP 5 times (waiting cooldown between)
2. Attempt 6th send
3. Assert hourly limit error
4. Mock time 1 hour forward
5. Verify can send again

**Test: Progressive Cooldown (if implemented)**
1. Trigger 3 consecutive resends
2. Verify cooldown escalates: 60s → 120s → 300s
3. Mock 1 hour later
4. Verify cooldown reset

#### Step 6: Cleanup Testing

Test automated OTP cleanup:

**Test: Expired OTP Deletion**
1. Create 50 expired OTPs (various tenants)
2. Create 10 valid OTPs (should not delete)
3. Run cleanup task manually
4. Assert 50 deleted, 10 remain
5. Verify correct OTPs deleted

**Test: Grace Period Enforcement**
1. Create verified OTP 1 hour ago
2. Run cleanup
3. Assert NOT deleted (within 24h grace)
4. Mock time 25 hours forward
5. Run cleanup again
6. Assert deleted

**Test: Cleanup Performance**
1. Create 10,000 expired OTPs
2. Run cleanup task
3. Measure execution time
4. Assert completes in <60 seconds
5. Verify all expired OTPs deleted

#### Step 7: Security Testing

Test security controls and attack scenarios:

**Test: Brute Force Prevention**
1. Generate OTP
2. Attempt verification 100 times with wrong codes
3. Verify only 3 attempts processed
4. Assert account not compromised

**Test: Timing Attack Resistance**
1. Generate OTP
2. Measure verification time with correct code
3. Measure verification time with wrong code
4. Assert no significant timing difference (<10ms)

**Test: Replay Attack Prevention**
1. Generate and verify OTP successfully
2. Attempt to use same OTP again
3. Assert rejected (already used)

**Test: Code Guessing Prevention**
1. Calculate probability: 3 attempts / 1,000,000 codes
2. Verify < 0.001% success rate
3. Confirm acceptable security level

#### Step 8: Multi-Tenant Testing

Test tenant isolation and tenant-specific features:

**Test: Tenant Isolation**
1. Create OTP for Tenant A
2. Attempt verification from Tenant B context
3. Assert verification fails (tenant mismatch)

**Test: Concurrent Tenant Operations**
1. Generate OTPs for 10 different tenants simultaneously
2. Verify all succeed without interference
3. Check tenant-specific rate limits enforced

#### Step 9: Error Handling Testing

Test error scenarios and recovery:

**Test: SMS Gateway Failure**
1. Configure mock SMS to fail
2. Attempt OTP generation
3. Verify error handled gracefully
4. Check OTP not created if send fails

**Test: Database Connection Loss**
1. Simulate database disconnect during verification
2. Verify appropriate error returned
3. Check retry logic if applicable

**Test: Invalid Input Handling**
1. Test with invalid phone numbers
2. Test with non-numeric codes
3. Test with missing parameters
4. Verify validation errors returned

#### Step 10: Performance and Load Testing

Test system under load:

**Test: Concurrent OTP Generation**
1. Generate 100 OTPs simultaneously
2. Measure total time
3. Assert all succeed
4. Verify no database deadlocks

**Test: High-Volume Verification**
1. Generate 1000 OTPs
2. Verify all with correct codes
3. Measure total time
4. Assert acceptable performance

**Test: Database Query Performance**
1. Create 100,000 OTP records
2. Perform verification
3. Measure query execution time
4. Verify indexes used efficiently

### Expected Outcome

✅ **Success Criteria:**
- All happy path scenarios pass
- Security controls prevent all tested attacks
- Rate limiting prevents abuse
- Expiry and cleanup work correctly
- Multi-tenant isolation maintained
- System handles expected load
- Error handling graceful and informative
- 100% test coverage for OTP system

### Verification

**Test Execution:**

1. **Run Full Test Suite:**
   ```
   pytest backend/apps/integrations/tests/test_otp_system.py -v --cov
   ```

2. **Coverage Report:**
   - Target: >95% code coverage
   - All critical paths tested
   - Edge cases covered

3. **Test Categories:**
   - Unit tests: 50+ tests
   - Integration tests: 20+ tests
   - E2E tests: 10+ tests
   - Performance tests: 5+ tests

4. **Continuous Integration:**
   - Tests run on every commit
   - Failed tests block merges
   - Coverage tracked over time

---

## Verification Flows

### OTP Verification Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    OTP Verification Process                     │
└─────────────────────────────────────────────────────────────────┘

    User                    System                    Database
     │                        │                          │
     │   Verify OTP Request   │                          │
     │──────────────────────>│                          │
     │   (phone, code, purpose)                         │
     │                        │                          │
     │                        │   Query OTP Record       │
     │                        │────────────────────────>│
     │                        │                          │
     │                        │   Return OTP             │
     │                        │<────────────────────────│
     │                        │                          │
     │                        ├─[Check Expiry]          │
     │                        │                          │
     │                   ┌────┴────┐                    │
     │                   │ Expired? │                    │
     │                   └────┬────┘                    │
     │                        │                          │
     │             ┌──────────┴──────────┐              │
     │             │                     │              │
     │           YES                    NO              │
     │             │                     │              │
     │   Expiry Error                   │              │
     │<──────────┤                     │              │
     │             │                     │              │
     │             X                     ├─[Check Attempts]
     │                                   │              │
     │                              ┌────┴────┐        │
     │                              │ Max Reached?      │
     │                              └────┬────┘        │
     │                                   │              │
     │                        ┌──────────┴──────────┐  │
     │                        │                     │  │
     │                      YES                    NO  │
     │                        │                     │  │
     │         Max Attempts Error                   │  │
     │<───────────────────┤                        │  │
     │                        │                     │  │
     │                        X           Increment Attempts
     │                                             │  │
     │                                             │  │
     │                                    Update Counter
     │                                             │──>│
     │                                             │  │
     │                                    Validate Code
     │                                             │  │
     │                                        ┌────┴────┐
     │                                        │ Valid?   │
     │                                        └────┬────┘
     │                                             │
     │                                  ┌──────────┴──────────┐
     │                                  │                     │
     │                                YES                    NO
     │                                  │                     │
     │                         Mark as Verified              │
     │                                  │───────────────────>│
     │                                  │                     │
     │                         Success Response     Invalid Code Error
     │<─────────────────────────────────┤<───────────────────│
     │                                  │                     │
     │                                  │                     X
     ▼                                  ▼                     
```

### Rate Limiting Decision Tree

```
┌───────────────────────────────────────────────────────────────────┐
│                   OTP Rate Limiting Decision Flow                 │
└───────────────────────────────────────────────────────────────────┘

                        Resend OTP Request
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Check Resend Cooldown │
                    │   (60 seconds)         │
                    └───────────┬───────────┘
                                │
                        ┌───────┴───────┐
                        │               │
                    In Cooldown?       No
                        │               │
                       Yes              ▼
                        │      ┌─────────────────┐
                        │      │ Check Hourly    │
                        │      │ Limit (5 sends) │
                        │      └────────┬────────┘
                        │               │
                        │       ┌───────┴───────┐
                        │       │               │
                        │   Limit Reached?     No
                        │       │               │
                        │      Yes              ▼
                        │       │      ┌─────────────────┐
                        │       │      │ Check Daily     │
                        │       │      │ Limit (10 sends)│
                        │       │      └────────┬────────┘
                        │       │               │
                        │       │       ┌───────┴───────┐
                        │       │       │               │
                        │       │   Limit Reached?     No
                        │       │       │               │
                        │       │      Yes              ▼
                        ▼       ▼       ▼      ┌────────────────┐
                    ┌───────────────────────┐  │ Generate & Send │
                    │   REJECT REQUEST      │  │ New OTP         │
                    │                       │  └────────┬────────┘
                    │ Return Error:         │           │
                    │ - Cooldown remaining  │          Yes
                    │ - Hourly limit hit    │           │
                    │ - Daily limit hit     │           ▼
                    │                       │  ┌────────────────┐
                    │ Log rate limit event  │  │ SUCCESS        │
                    └───────────────────────┘  │                │
                                │              │ Set cooldown   │
                                │              │ Log send event │
                                ▼              └────────────────┘
                           Return to User              │
                                                       ▼
                                                  Return to User


Progressive Cooldown Strategy:
┌────────────┬──────────────┬─────────────────┐
│ Resend #   │ Cooldown     │ Reason          │
├────────────┼──────────────┼─────────────────┤
│ 1st        │ 60 seconds   │ Normal          │
│ 2nd        │ 120 seconds  │ Repeated request│
│ 3rd        │ 300 seconds  │ Suspicious      │
│ 4th+       │ 600 seconds  │ Abuse suspected │
└────────────┴──────────────┴─────────────────┘
```

---

## Rate Limiting Architecture

### Multi-Layer Rate Limiting

```
┌─────────────────────────────────────────────────────────────────┐
│              OTP Rate Limiting Architecture                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Layer 1: Resend Cooldown (60 seconds)                     │ │
│  │                                                            │ │
│  │  Purpose: Prevent rapid successive resends                │ │
│  │  Implementation: Cache-based (Redis)                      │ │
│  │  Key: otp_cooldown:{tenant}:{phone}                       │ │
│  │  TTL: 60 seconds                                          │ │
│  │                                                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │  Send 1  │  │   Wait   │  │  Send 2  │                │ │
│  │  │  (t=0)   │─>│ 60 sec   │─>│ (t=60)   │                │ │
│  │  └──────────┘  └──────────┘  └──────────┘                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Layer 2: Hourly Limit (5 sends)                           │ │
│  │                                                            │ │
│  │  Purpose: Prevent hourly abuse                            │ │
│  │  Implementation: Cache counter                            │ │
│  │  Key: otp_hourly:{tenant}:{phone}                         │ │
│  │  TTL: 1 hour (rolling)                                    │ │
│  │                                                            │ │
│  │  Hour Window:                                             │ │
│  │  [════════════════════════════════════════]                │ │
│  │   │    │    │    │    │     X  (6th blocked)              │ │
│  │   1    2    3    4    5                                   │ │
│  │  OK   OK   OK   OK   OK    REJECT                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Layer 3: Daily Limit (10 sends)                           │ │
│  │                                                            │ │
│  │  Purpose: Prevent daily abuse and cost control            │ │
│  │  Implementation: Database query + cache                   │ │
│  │  Reset: Midnight (tenant timezone)                        │ │
│  │                                                            │ │
│  │  Day Window (00:00 - 23:59):                              │ │
│  │  [════════════════════════════════════════════════════]    │ │
│  │   1  2  3  4  5  6  7  8  9  10  X  (11th blocked)        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Layer 4: IP-Based Limiting (Optional)                     │ │
│  │                                                            │ │
│  │  Purpose: Prevent distributed attacks                     │ │
│  │  Implementation: Request rate limiting                    │ │
│  │  Limit: 100 requests per IP per hour                      │ │
│  │  Tool: Django rate limiting or nginx                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Rate Limit Storage Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                 Rate Limit Data Storage                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Redis (Primary - Fast Lookups):                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Key                          Value       TTL           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ otp_cooldown:t1:+94771234567  1        60s            │ │
│  │ otp_hourly:t1:+94771234567    3        3600s          │ │
│  │ otp_daily:t1:+94771234567     7        86400s         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Database (Secondary - Audit Trail):                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Table: otp_rate_limit_log                              │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ id | tenant | phone | timestamp | action | success     │ │
│  │ 1  | t1     | +947.. | 10:30:00 | send   | true        │ │
│  │ 2  | t1     | +947.. | 10:30:15 | resend | false       │ │
│  │ 3  | t1     | +947.. | 10:31:20 | resend | true        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Cleanup Schedule Diagram

### Celery Beat Schedule Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│               OTP Cleanup Schedule (Hourly)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Timeline (24 hours):                                           │
│  ═══════════════════════════════════════════════════════════   │
│  │    │    │    │    │    │    │    │    │    │    │    │      │
│  00   02   04   06   08   10   12   14   16   18   20   22     │
│  ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼      │
│  CLEAN CLEAN CLEAN CLEAN CLEAN CLEAN CLEAN CLEAN CLEAN CLEAN   │
│                                                                 │
│  Each Hour:                                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. Query expired OTPs (expires_at < now)              │    │
│  │ 2. Query old verified OTPs (verified_at < now - 24h)  │    │
│  │ 3. Query old failed OTPs (attempts >= 3, age > 24h)   │    │
│  │ 4. Delete in batches of 1000                          │    │
│  │ 5. Log deletion counts                                │    │
│  │ 6. Update metrics                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### OTP Lifecycle and Cleanup

```
┌──────────────────────────────────────────────────────────────────┐
│                     OTP Lifecycle States                         │
└──────────────────────────────────────────────────────────────────┘

    CREATED                VERIFIED              CLEANUP
       │                      │                      │
       ▼                      ▼                      ▼
    
  ┌─────────┐          ┌──────────┐          ┌──────────┐
  │ Active  │──────────│ Used &   │──────────│ Deleted  │
  │ (5 min) │  Verify  │ Retained │  After   │          │
  │         │          │ (24 hrs) │  24 hrs  │          │
  └────┬────┘          └──────────┘          └──────────┘
       │
       │ Expires
       ▼
  ┌─────────┐                              ┌──────────┐
  │ Expired │──────────────────────────────│ Deleted  │
  │ (grace) │       Cleanup Task           │          │
  │         │       (Immediate)            │          │
  └─────────┘                              └──────────┘
       │
       │ Max Attempts
       ▼
  ┌─────────┐                              ┌──────────┐
  │ Failed  │──────────────────────────────│ Deleted  │
  │ Locked  │       Cleanup Task           │          │
  │ (24 hrs)│       After 24 hrs           │          │
  └─────────┘                              └──────────┘


Deletion Criteria:
┌─────────────────┬──────────────────┬────────────────────┐
│ OTP State       │ Age Condition    │ Deletion Time      │
├─────────────────┼──────────────────┼────────────────────┤
│ Expired         │ expires_at < now │ Immediate          │
│ Unverified      │ + grace period   │ + grace (0-5 min)  │
├─────────────────┼──────────────────┼────────────────────┤
│ Verified        │ verified_at      │ After 24 hours     │
│ Successfully    │ < now - 24h      │ (audit retention)  │
├─────────────────┼──────────────────┼────────────────────┤
│ Failed          │ attempts >= 3    │ After 24 hours     │
│ (Max attempts)  │ && age > 24h     │ (security audit)   │
└─────────────────┴──────────────────┴────────────────────┘
```

### Cleanup Task Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 Cleanup Task Execution Flow                     │
└─────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
┌─────────────────┐
│ Task Triggered  │
│ (Celery Beat)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Log: Cleanup task started       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Query Expired Unverified OTPs   │
│ Filter: expires_at < now        │
│         verified_at IS NULL     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Delete in Batches (1000)        │
│ Count: N1                       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Query Old Verified OTPs         │
│ Filter: verified_at < now-24h   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Delete in Batches (1000)        │
│ Count: N2                       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Query Old Failed OTPs           │
│ Filter: attempts >= 3           │
│         created_at < now-24h    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Delete in Batches (1000)        │
│ Count: N3                       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Calculate Total: N1 + N2 + N3   │
│ Log: Deleted X OTPs             │
│ Update Metrics                  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Success: Return to scheduler    │
│ OR                              │
│ Error: Retry (max 3)            │
└────────┬────────────────────────┘
         │
         ▼
      DONE
```

---

## Error Handling Matrix

### Comprehensive Error Scenarios

| **Error Code**          | **Scenario**                        | **User Message**                                     | **Action**                    | **Retry** |
|-------------------------|-------------------------------------|------------------------------------------------------|-------------------------------|-----------|
| `OTP_NOT_FOUND`         | No OTP record exists                | "Invalid verification code"                          | Request new OTP               | No        |
| `OTP_EXPIRED`           | OTP past expiry time                | "Code has expired. Request a new one"                | Request new OTP               | No        |
| `OTP_INVALID`           | Code doesn't match                  | "Incorrect code. X attempts remaining"               | Try again or request new      | Yes       |
| `OTP_MAX_ATTEMPTS`      | 3 failed attempts                   | "Too many attempts. Request a new code"              | Request new OTP               | No        |
| `OTP_ALREADY_USED`      | OTP already verified                | "Code already used. Request a new one"               | Request new OTP               | No        |
| `OTP_RESEND_COOLDOWN`   | Resend too soon                     | "Wait X seconds before requesting new code"          | Wait and retry                | Yes       |
| `OTP_HOURLY_LIMIT`      | Hourly limit reached                | "Too many requests. Try again in an hour"            | Wait 1 hour                   | No        |
| `OTP_DAILY_LIMIT`       | Daily limit reached                 | "Daily limit reached. Try again tomorrow"            | Wait until midnight           | No        |
| `SMS_SEND_FAILED`       | Gateway error                       | "Unable to send SMS. Try again later"                | Retry or contact support      | Yes       |
| `PHONE_INVALID`         | Invalid phone format                | "Invalid phone number format"                        | Correct phone number          | Yes       |
| `TENANT_INACTIVE`       | Tenant disabled                     | "Service unavailable"                                | Contact admin                 | No        |
| `DATABASE_ERROR`        | Database connection issue           | "Temporary error. Please try again"                  | Retry after delay             | Yes       |
| `RATE_LIMIT_IP`         | Too many requests from IP           | "Too many requests. Slow down"                       | Wait and retry                | Yes       |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "OTP_INVALID",
    "message": "Incorrect verification code",
    "details": {
      "attempts_remaining": 2,
      "max_attempts": 3,
      "can_resend": true,
      "cooldown_remaining": 0
    }
  },
  "timestamp": "2026-01-31T10:30:45Z"
}
```

### Error Logging Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Logging Levels                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DEBUG: Development debugging only                              │
│  ├─ OTP generation details                                      │
│  └─ Validation step-by-step                                     │
│                                                                 │
│  INFO: Normal operations                                        │
│  ├─ Successful OTP generation                                   │
│  ├─ Successful verification                                     │
│  └─ Cleanup task execution                                      │
│                                                                 │
│  WARNING: Concerning but not critical                           │
│  ├─ Failed verification attempts                                │
│  ├─ Expired OTP usage attempts                                  │
│  ├─ Approaching rate limits                                     │
│  └─ Resend cooldown violations                                  │
│                                                                 │
│  ERROR: Operational errors                                      │
│  ├─ SMS gateway failures                                        │
│  ├─ Database errors                                             │
│  ├─ Max attempts lockouts                                       │
│  └─ Rate limit violations                                       │
│                                                                 │
│  CRITICAL: System failures                                      │
│  ├─ Complete SMS service outage                                 │
│  ├─ Database connection lost                                    │
│  ├─ Cleanup task repeated failures                              │
│  └─ Security breach attempts                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

### Task Completion Checklist

| **Task** | **Component**                  | **Status** | **Dependencies**        |
|----------|--------------------------------|------------|-------------------------|
| 49       | verify_otp Method              | ☐          | Tasks 39-48             |
| 50       | OTP Expiry Logic               | ☐          | Task 49                 |
| 51       | Max Attempts Limit             | ☐          | Task 49                 |
| 52       | Resend Cooldown                | ☐          | Tasks 42-48             |
| 53       | OTP Cleanup Task               | ☐          | Tasks 39-41, Celery     |
| 54       | End-to-End Testing             | ☐          | All Tasks 39-53         |

### Security Controls Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                OTP Security Controls Summary                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ Time-Based Expiry: 5 minutes                                 │
│  ✓ Attempt Limiting: 3 max attempts                             │
│  ✓ Timing-Safe Comparison: Prevents timing attacks              │
│  ✓ Single-Use Enforcement: Cannot reuse verified OTPs           │
│  ✓ Resend Cooldown: 60 seconds between sends                    │
│  ✓ Hourly Rate Limit: 5 sends per hour (optional)               │
│  ✓ Daily Rate Limit: 10 sends per day (optional)                │
│  ✓ Automatic Cleanup: Removes expired OTPs hourly               │
│  ✓ Audit Logging: All events logged for security analysis       │
│  ✓ Multi-Tenant Isolation: Tenant-specific OTP storage          │
│                                                                 │
│  Attack Resistance:                                             │
│  ├─ Brute Force: < 0.0003% success rate                         │
│  ├─ Timing Attacks: Constant-time comparison                    │
│  ├─ Replay Attacks: Single-use enforcement                      │
│  ├─ SMS Flooding: Rate limiting prevents abuse                  │
│  └─ Resource Exhaustion: Cleanup maintains hygiene              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Next Steps

After completing Tasks 49-54:

1. **Proceed to Group D:** SMS Template System
2. **Integration:** Connect OTP system to authentication flow
3. **Monitoring:** Set up dashboards for OTP metrics
4. **Documentation:** Update API documentation with OTP endpoints
5. **Testing:** Run security audit on complete OTP system

---

## Document Information

| **Attribute**          | **Value**                                             |
|------------------------|-------------------------------------------------------|
| **Document Version**   | 1.0                                                   |
| **Last Updated**       | 2026-01-31                                            |
| **Status**             | Active                                                |
| **Tasks Covered**      | 49-54                                                 |
| **Estimated Duration** | 16 hours (all tasks)                                  |
| **Dependencies**       | Group C Document 01 (Tasks 39-48)                     |

---

**End of Document 02 - Tasks 49-54: OTP Verification, Rate Limiting & Cleanup**
