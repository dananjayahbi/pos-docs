# Tasks 39-48: OTP Model and Service

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** C - OTP System  
> **Document:** 01 of 02  
> **Tasks Covered:** 39, 40, 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-B_Provider-Implementations/03_Tasks-33-38_Factory-Config-Verify.md](../Group-B_Provider-Implementations/03_Tasks-33-38_Factory-Config-Verify.md)
- **→ Next Document:** [02_Tasks-49-54_Limits-Cleanup-Verify.md](02_Tasks-49-54_Limits-Cleanup-Verify.md)

---

## Document Overview

This document covers the implementation of the OTP model and service layer for secure phone verification. It establishes the database schema for storing OTPs with phone numbers, verification codes, expiry timestamps, attempt tracking, and verification status. The OTPService provides methods for generating cryptographically secure 6-digit codes and sending them via the SMS provider infrastructure with templated messages.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 39 | Create OTP Model | Medium | 30 min |
| 40 | Create phone Field | Low | 10 min |
| 41 | Create otp_code Field | Low | 10 min |
| 42 | Create purpose Field | Low | 15 min |
| 43 | Create expires_at Field | Low | 10 min |
| 44 | Create attempts Field | Low | 10 min |
| 45 | Create is_verified Field | Low | 10 min |
| 46 | Create OTPService | High | 40 min |
| 47 | Create generate_otp Method | Medium | 25 min |
| 48 | Create send_otp Method | Medium | 30 min |

---

## OTP System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      OTP Lifecycle Flow                      │
└─────────────────────────────────────────────────────────────┘

   User Request                      System Processing
        │                                   │
        ▼                                   ▼
   ┌─────────┐                      ┌──────────────┐
   │ Phone # │──────────────────────>│ OTPService   │
   └─────────┘                      │.generate_otp()│
        │                           └───────┬───────┘
        │                                   │
        │                           ┌───────▼────────┐
        │                           │ Create 6-digit │
        │                           │  Random Code   │
        │                           │(secrets module)│
        │                           └───────┬────────┘
        │                                   │
        │                           ┌───────▼────────┐
        │                           │  Save to DB    │
        │                           │ - Phone        │
        │                           │ - OTP Code     │
        │                           │ - Purpose      │
        │                           │ - Expires in 5m│
        │                           │ - Attempts: 0  │
        │                           └───────┬────────┘
        │                                   │
        │                           ┌───────▼────────┐
        │                           │ OTPService     │
        │                           │ .send_otp()    │
        │                           └───────┬────────┘
        │                                   │
        │                           ┌───────▼────────┐
        │                           │ SMSProvider    │
        │                           │ Factory        │
        │                           └───────┬────────┘
        │                                   │
        ▼                                   ▼
   ┌─────────┐                      ┌──────────────┐
   │SMS Rcvd │<─────────────────────│ Send via SMS │
   │123456   │                      │   Gateway    │
   └─────────┘                      └──────────────┘
```

---

## OTP Model Relationships

```
┌───────────────────────────────────────────────────────────┐
│                    OTP Model Schema                       │
└───────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              OTP Model                      │
├─────────────────────────────────────────────┤
│ PK: id (UUID)                              │
│ phone (CharField, max 15)                  │
│ otp_code (CharField, max 6)                │
│ purpose (CharField, choices)               │
│ expires_at (DateTimeField)                 │
│ attempts (IntegerField)                    │
│ is_verified (BooleanField)                 │
│ created_at (DateTimeField, auto)           │
│ updated_at (DateTimeField, auto)           │
├─────────────────────────────────────────────┤
│ Indexes:                                    │
│ - phone + purpose (composite)               │
│ - expires_at                                │
│ - created_at                                │
├─────────────────────────────────────────────┤
│ Constraints:                                │
│ - phone format: +94XXXXXXXXX                │
│ - otp_code: exactly 6 digits                │
│ - attempts: 0-3 range                       │
└─────────────────────────────────────────────┘
          │
          │ Used by
          ▼
┌─────────────────────────────────────────────┐
│           OTPService                        │
├─────────────────────────────────────────────┤
│ - sms_provider_factory                      │
├─────────────────────────────────────────────┤
│ + generate_otp(phone, purpose)             │
│ + send_otp(phone, purpose)                 │
│ + verify_otp(phone, code, purpose)         │
│ + resend_otp(phone, purpose)               │
│ + cleanup_expired()                         │
└─────────────────────────────────────────────┘
          │
          │ Uses
          ▼
┌─────────────────────────────────────────────┐
│      SMSProviderFactory                     │
├─────────────────────────────────────────────┤
│ + get_provider() → BaseSMSProvider         │
└─────────────────────────────────────────────┘
```

---

## Service Layer Flow

```
┌──────────────────────────────────────────────────────────┐
│              OTPService Method Flow                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐
│  generate_otp()  │      │    send_otp()    │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         ▼                         ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│ 1. Validate phone       │  │ 1. Call generate_otp()  │
│ 2. Check purpose enum   │  │ 2. Get OTP from result  │
│ 3. Invalidate old OTPs  │  │ 3. Build SMS message    │
│    (same phone+purpose) │  │ 4. Get SMS provider     │
│ 4. Generate 6-digit     │  │    from factory         │
│    random using         │  │ 5. Call provider        │
│    secrets.randbelow()  │  │    .send_sms()          │
│ 5. Set expires_at       │  │ 6. Log delivery status  │
│    (now + 5 minutes)    │  │ 7. Return OTP object    │
│ 6. Create OTP object    │  └─────────────────────────┘
│ 7. Save to database     │
│ 8. Return OTP object    │
└─────────────────────────┘

        ┌─────────────────────┐
        │  SMS Template       │
        ├─────────────────────┤
        │ Your OTP code is:   │
        │ {otp_code}          │
        │                     │
        │ Valid for 5 minutes.│
        │ Do not share.       │
        │                     │
        │ - LankaCommerce     │
        └─────────────────────┘
```

---

## Task 39: Create OTP Model

### Overview
Create the OTP Django model to store one-time passwords for phone verification. This model serves as the central data structure for tracking verification codes, their validity periods, usage attempts, and verification status. The model is designed to be tenant-aware and supports multiple verification purposes (login, registration, password reset, phone verification).

### Dependencies
- Task 38: Verify SMS Provider System (from Group-B)
- Django models framework
- Multi-tenancy system (from Phase-02)
- Base model mixins (from Phase-03)

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/notifications/` Django app
   - Create new file `models/otp.py`
   - This file contains the OTP model definition

2. **Import required dependencies**
   - Import Django model fields (CharField, DateTimeField, BooleanField, IntegerField)
   - Import UUID field for primary key
   - Import timezone utilities from `django.utils.timezone`
   - Import validators from `django.core.validators`
   - Import base model mixins (TenantAwareModel, TimestampedModel)

3. **Define OTP model class**
   - Create class `OTP` inheriting from TenantAwareModel and TimestampedModel
   - Set `db_table = 'otp'` for explicit table naming
   - Define verbose name and plural for admin interface

4. **Add primary key field**
   - Define `id` as UUIDField with primary_key=True
   - Set default to uuid.uuid4 for automatic UUID generation
   - Set editable=False to prevent manual editing

5. **Add Meta class**
   - Define database indexes for performance
   - Create composite index on (phone, purpose) for lookup optimization
   - Add index on expires_at for cleanup queries
   - Add index on created_at for time-based queries
   - Set ordering by ['-created_at'] for recent-first display

6. **Add __str__ method**
   - Return string representation showing phone and purpose
   - Format: "OTP for {phone} ({purpose})"
   - Useful for admin interface and debugging

7. **Add model to app's __init__.py**
   - Import OTP model in `models/__init__.py`
   - Ensure Django recognizes the model

8. **Register model with admin**
   - Create admin class in `admin.py`
   - Configure list display, filters, and search
   - Make read-only in admin for security

### Model Purpose

| Feature | Benefit |
|---------|---------|
| Tenant Awareness | Each tenant has isolated OTP records |
| UUID Primary Key | Prevents enumeration attacks |
| Indexed Fields | Fast lookups by phone and purpose |
| Timestamped | Automatic created_at and updated_at tracking |

### Model Characteristics

| Characteristic | Implementation |
|----------------|----------------|
| Inheritance | TenantAwareModel, TimestampedModel |
| Table Name | otp |
| Primary Key | UUID (auto-generated) |
| Soft Delete | No (hard delete for security) |
| Audit Trail | Created/updated timestamps |

### Expected Outcome
- OTP model defined with proper inheritance
- Database table structure ready for fields
- Model registered with Django app
- Admin interface configured

### Verification Checklist
- [ ] OTP model class created in `models/otp.py`
- [ ] Model inherits from TenantAwareModel and TimestampedModel
- [ ] Primary key is UUID field
- [ ] Meta class defines indexes and ordering
- [ ] __str__ method implemented
- [ ] Model imported in `models/__init__.py`
- [ ] Admin class registered

---

## Task 40: Create phone Field

### Overview
Create the phone number field in the OTP model to store the recipient's phone number in E.164 international format. This field must validate that phone numbers follow Sri Lankan format (+94XXXXXXXXX) with proper area codes and length validation. The field is indexed for fast lookups and forms part of a composite unique constraint with the purpose field.

### Dependencies
- Task 39: Create OTP Model

### Instructions

1. **Add phone field to OTP model**
   - Navigate to `backend/apps/notifications/models/otp.py`
   - Add field after the id field definition
   - Use CharField for phone storage

2. **Configure field parameters**
   - Set max_length to 15 to accommodate international format
   - Set db_index=True for query performance
   - Set blank=False, null=False to enforce requirement
   - Add help_text explaining format: "Phone number in format +94XXXXXXXXX"

3. **Create custom validator**
   - Create `validators/phone_validator.py` file
   - Define `validate_sri_lankan_phone` function
   - Check format matches regex: `^\+94[1-9]\d{8}$`
   - Validate area code (7 for mobile, 11/21/23/etc for landline)
   - Raise ValidationError for invalid formats

4. **Apply validator to field**
   - Import validator in model file
   - Add validators=[validate_sri_lankan_phone] to field definition
   - Ensures only valid Sri Lankan numbers are stored

5. **Add field to composite index**
   - In Meta class, ensure (phone, purpose) composite index exists
   - This enables fast lookups for OTP retrieval
   - Format: `Index(fields=['phone', 'purpose'], name='otp_phone_purpose_idx')`

6. **Update admin configuration**
   - Add phone to list_display in admin
   - Add phone to search_fields for searching
   - Make phone searchable in admin interface

### Phone Format Specification

| Component | Format | Example |
|-----------|--------|---------|
| Country Code | +94 | +94 |
| Mobile (Dialog) | +94 7X XXX XXXX | +94 77 123 4567 |
| Mobile (Mobitel) | +94 7X XXX XXXX | +94 71 234 5678 |
| Mobile (Hutch) | +94 7X XXX XXXX | +94 76 345 6789 |
| Landline (Colombo) | +94 11 XXX XXXX | +94 11 234 5678 |
| Landline (Kandy) | +94 81 XXX XXXX | +94 81 234 5678 |

### Validation Rules

| Rule | Description |
|------|-------------|
| Format | Must match `^\+94[1-9]\d{8}$` |
| Length | Exactly 13 characters with country code |
| Prefix | Must start with +94 |
| First Digit | Cannot be 0 after country code |
| Mobile Prefix | 7X for mobile numbers |
| Landline Prefix | 11, 21, 23, 24, 25, 26, 27, 31, 32, etc. |

### Expected Outcome
- Phone field added to OTP model
- Field validates Sri Lankan phone format
- Composite index (phone, purpose) exists
- Field displayed and searchable in admin

### Verification Checklist
- [ ] phone field added as CharField(max_length=15)
- [ ] Custom validator created and applied
- [ ] Field is indexed (db_index=True)
- [ ] Composite index includes phone
- [ ] Admin displays and searches phone
- [ ] Validation rejects invalid formats
- [ ] Validation accepts valid Sri Lankan numbers

---

## Task 41: Create otp_code Field

### Overview
Create the otp_code field to store the 6-digit verification code. This field must validate that codes are exactly 6 numeric digits, providing the security token for phone verification. The field is not indexed individually but is used in verification lookups combined with phone and purpose.

### Dependencies
- Task 39: Create OTP Model

### Instructions

1. **Add otp_code field to OTP model**
   - Navigate to `backend/apps/notifications/models/otp.py`
   - Add field after phone field
   - Use CharField to store code (not IntegerField to preserve leading zeros)

2. **Configure field parameters**
   - Set max_length=6 for exactly 6 characters
   - Set db_index=False (lookups use phone+purpose, not code alone)
   - Set blank=False, null=False to enforce requirement
   - Add help_text: "6-digit verification code"

3. **Create OTP code validator**
   - Create or update `validators/otp_validator.py` file
   - Define `validate_otp_code` function
   - Check code matches regex: `^\d{6}$`
   - Verify exactly 6 numeric characters
   - Raise ValidationError if pattern doesn't match

4. **Apply validator to field**
   - Import validator in model file
   - Add validators=[validate_otp_code] to field definition
   - Ensures only 6-digit numeric codes are stored

5. **Add security measures**
   - Mark field as sensitive in logging configuration
   - Ensure OTP codes are never logged in plaintext
   - Configure Django to mask codes in error reports

6. **Update admin configuration**
   - Add otp_code to list_display (masked)
   - Display only last 2 digits in list view for security
   - Format: "****56"
   - Full code visible only in detail view with permissions

7. **Add method for masked display**
   - Create model method `get_masked_code()`
   - Return string showing "****" + last 2 digits
   - Use in admin list display and user-facing messages

### OTP Code Characteristics

| Property | Value |
|----------|-------|
| Length | Exactly 6 digits |
| Format | Numeric only (0-9) |
| Range | 000000 to 999999 |
| Storage | CharField (preserves leading zeros) |
| Display | Masked as ****XX |
| Logging | Never log full code |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Storage | Plain text (short-lived, not hashed) |
| Display | Masked in lists, full in details |
| Logging | Excluded from all logs |
| Error Messages | Never reveal code in errors |
| Admin Access | Restricted to superusers only |

### Expected Outcome
- otp_code field added to OTP model
- Field validates exactly 6 digits
- Masked display method implemented
- Admin shows masked codes in list view
- Security measures prevent code logging

### Verification Checklist
- [ ] otp_code field added as CharField(max_length=6)
- [ ] Validator ensures exactly 6 digits
- [ ] Field is not indexed
- [ ] get_masked_code() method returns ****XX format
- [ ] Admin list view shows masked codes
- [ ] Admin detail view requires permissions
- [ ] Logging excludes OTP codes

---

## Task 42: Create purpose Field

### Overview
Create the purpose field as an enumerated choice field to categorize why the OTP is being generated. This field distinguishes between login verification, new user registration, password reset, and phone number verification scenarios. Each purpose may have different validation rules, expiry times, and message templates.

### Dependencies
- Task 39: Create OTP Model

### Instructions

1. **Define purpose choices enumeration**
   - Create `enums/otp_purpose.py` file in notifications app
   - Define Python Enum class `OTPPurpose` inheriting from `str, models.TextChoices`
   - Add four purpose types with display labels

2. **Define enum values**
   - LOGIN = "LOGIN", "Login Verification"
   - REGISTER = "REGISTER", "Registration Verification"
   - RESET = "RESET", "Password Reset"
   - VERIFY = "VERIFY", "Phone Verification"

3. **Add purpose field to OTP model**
   - Navigate to `backend/apps/notifications/models/otp.py`
   - Import OTPPurpose enum
   - Add field after phone field
   - Use CharField with choices parameter

4. **Configure field parameters**
   - Set max_length=20 to accommodate enum values
   - Set choices=OTPPurpose.choices
   - Set default=None (no default, must be explicit)
   - Set db_index=True (used in composite index)
   - Set blank=False, null=False
   - Add help_text: "Purpose of this OTP"

5. **Add to composite index**
   - Ensure Meta class includes (phone, purpose) composite index
   - This enables efficient lookups for active OTPs
   - Index name: 'otp_phone_purpose_idx'

6. **Add purpose-based validation**
   - Create method `get_template_for_purpose()`
   - Return appropriate SMS template based on purpose
   - Different messages for LOGIN vs REGISTER vs RESET

7. **Update admin configuration**
   - Add purpose to list_display
   - Add purpose to list_filter for filtering by type
   - Show purpose in search results

### Purpose Definitions

| Purpose | Use Case | Template Message |
|---------|----------|------------------|
| LOGIN | User logging in with OTP | "Your login code is {code}" |
| REGISTER | New user registration | "Welcome! Your verification code is {code}" |
| RESET | Password reset flow | "Your password reset code is {code}" |
| VERIFY | Phone number verification | "Verify your phone with code {code}" |

### Purpose-Based Behavior

| Purpose | Expiry Time | Max Attempts | Cooldown | Post-Verification Action |
|---------|-------------|--------------|----------|--------------------------|
| LOGIN | 5 minutes | 3 | 60 seconds | Create session token |
| REGISTER | 10 minutes | 3 | 60 seconds | Create user account |
| RESET | 10 minutes | 3 | 120 seconds | Allow password change |
| VERIFY | 5 minutes | 3 | 60 seconds | Mark phone as verified |

### Expected Outcome
- OTPPurpose enum defined with 4 values
- purpose field added to OTP model
- Field uses enum for validation
- Composite index includes purpose
- Admin filters and displays purpose

### Verification Checklist
- [ ] OTPPurpose enum created with 4 choices
- [ ] purpose field added as CharField with choices
- [ ] Field included in composite index
- [ ] get_template_for_purpose() method exists
- [ ] Admin shows purpose in list and filters
- [ ] Each purpose has appropriate template
- [ ] Enum values are uppercase strings

---

## Task 43: Create expires_at Field

### Overview
Create the expires_at timestamp field to track when each OTP becomes invalid. This field stores the exact datetime after which the OTP cannot be used for verification. The default expiry is 5 minutes from creation, though this may vary by purpose (e.g., registration OTPs might have 10-minute expiry).

### Dependencies
- Task 39: Create OTP Model
- Task 42: Create purpose Field

### Instructions

1. **Add expires_at field to OTP model**
   - Navigate to `backend/apps/notifications/models/otp.py`
   - Add field after purpose field
   - Use DateTimeField to store expiry timestamp

2. **Configure field parameters**
   - Set db_index=True for efficient expiry queries
   - Set blank=False, null=False
   - Add help_text: "When this OTP expires"
   - Do not set auto_now or auto_now_add

3. **Create expiry calculation function**
   - Define static method `get_expiry_time(purpose=None)`
   - Import timezone from django.utils
   - Import timedelta from datetime
   - Calculate: timezone.now() + timedelta(minutes=X)
   - Return datetime object

4. **Define purpose-based expiry durations**
   - LOGIN: 5 minutes
   - REGISTER: 10 minutes
   - RESET: 10 minutes
   - VERIFY: 5 minutes
   - Default: 5 minutes if purpose not specified

5. **Set default value using callable**
   - Set default=get_default_expiry where get_default_expiry returns timezone.now() + timedelta(minutes=5)
   - This ensures each OTP gets calculated expiry at creation
   - Avoid using lambda in default (not serializable for migrations)

6. **Add expiry check method**
   - Define model method `is_expired()`
   - Compare timezone.now() with self.expires_at
   - Return True if current time > expires_at
   - Return False otherwise

7. **Add time remaining method**
   - Define model method `time_remaining()`
   - Calculate self.expires_at - timezone.now()
   - Return timedelta object
   - Return None if already expired

8. **Update admin configuration**
   - Add expires_at to list_display
   - Add custom admin method `expiry_status()`
   - Display "Expired" in red if expired
   - Display time remaining if active
   - Add expires_at to list_filter with "expired" option

### Expiry Calculation

```
Creation Time: 2026-01-31 10:00:00
Expiry Duration: 5 minutes
Expiry Time: 2026-01-31 10:05:00

Timeline:
├─────────────────────────────────────────────────┤
10:00:00                                      10:05:00
  (Created)                                  (Expires)
           ← Valid Period (5 minutes) →
```

### Purpose-Based Expiry

| Purpose | Expiry Duration | Reason |
|---------|----------------|--------|
| LOGIN | 5 minutes | Quick login flow |
| REGISTER | 10 minutes | User might need time to check email/phone |
| RESET | 10 minutes | Security-sensitive, allow time |
| VERIFY | 5 minutes | Simple verification |

### Expected Outcome
- expires_at field added to OTP model
- Field indexed for cleanup queries
- Default expiry calculated at creation (5 minutes)
- is_expired() method checks validity
- time_remaining() shows countdown
- Admin displays expiry status

### Verification Checklist
- [ ] expires_at field added as DateTimeField
- [ ] Field is indexed (db_index=True)
- [ ] get_expiry_time() calculates purpose-based duration
- [ ] Default expiry set to callable function
- [ ] is_expired() method returns boolean
- [ ] time_remaining() returns timedelta
- [ ] Admin shows expiry status with color coding
- [ ] Purpose-based expiry durations implemented

---

## Task 44: Create attempts Field

### Overview
Create the attempts counter field to track how many times a user has tried to verify the OTP. This field implements a security measure to prevent brute-force attacks by limiting the number of verification attempts to 3. After 3 failed attempts, the OTP is invalidated and the user must request a new one.

### Dependencies
- Task 39: Create OTP Model

### Instructions

1. **Add attempts field to OTP model**
   - Navigate to `backend/apps/notifications/models/otp.py`
   - Add field after expires_at field
   - Use IntegerField to store attempt count

2. **Configure field parameters**
   - Set default=0 (no attempts at creation)
   - Set blank=False, null=False
   - Set db_index=False (not used in lookups)
   - Add help_text: "Number of verification attempts"

3. **Add validation for attempts**
   - Import MinValueValidator, MaxValueValidator
   - Add validators=[MinValueValidator(0), MaxValueValidator(3)]
   - Ensures attempts stay in 0-3 range
   - 3 is maximum before invalidation

4. **Create attempt increment method**
   - Define model method `increment_attempts()`
   - Increment self.attempts by 1
   - Call self.save(update_fields=['attempts'])
   - Return current attempts count

5. **Create max attempts check method**
   - Define model method `has_max_attempts()`
   - Return True if self.attempts >= 3
   - Return False otherwise
   - Used before allowing verification

6. **Add remaining attempts method**
   - Define model method `remaining_attempts()`
   - Calculate 3 - self.attempts
   - Return integer (0-3)
   - Used in error messages to inform user

7. **Update verification logic preparation**
   - Document that verify method should check has_max_attempts()
   - If True, raise ValidationError("Maximum attempts exceeded")
   - If False, proceed with verification
   - On failed verification, call increment_attempts()

8. **Update admin configuration**
   - Add attempts to list_display
   - Add custom admin method `attempts_status()`
   - Display "3/3 (LOCKED)" in red if max reached
   - Display "X/3" in normal color if under limit
   - Add attempts to readonly_fields (prevent manual editing)

### Attempt Lifecycle

```
OTP Created
   │
   ├─> Attempt 1 (Wrong) ─> attempts = 1 ─> 2 remaining
   │
   ├─> Attempt 2 (Wrong) ─> attempts = 2 ─> 1 remaining
   │
   ├─> Attempt 3 (Wrong) ─> attempts = 3 ─> LOCKED
   │
   └─> has_max_attempts() = True
       └─> Verification blocked
           └─> User must request new OTP
```

### Attempt Tracking

| Attempts | Status | Action Allowed | User Message |
|----------|--------|----------------|--------------|
| 0 | Fresh | Yes | - |
| 1 | 1st fail | Yes | "2 attempts remaining" |
| 2 | 2nd fail | Yes | "1 attempt remaining" |
| 3 | Max reached | No | "Maximum attempts exceeded. Request new OTP." |

### Security Rationale

| Risk | Mitigation |
|------|------------|
| Brute Force | 3-attempt limit reduces success probability to 0.0003% (3/1,000,000) |
| Time-based Attack | Combined with 5-minute expiry limits attack window |
| Sequential Testing | Each failed attempt incremented before response |
| Rate Limiting | Cooldown period required between OTP requests |

### Expected Outcome
- attempts field added to OTP model
- Field defaults to 0 at creation
- Validation ensures 0-3 range
- increment_attempts() method updates count
- has_max_attempts() checks for lockout
- Admin displays attempt status with visual indicator

### Verification Checklist
- [ ] attempts field added as IntegerField
- [ ] Default value is 0
- [ ] Validators enforce 0-3 range
- [ ] increment_attempts() increments and saves
- [ ] has_max_attempts() returns boolean
- [ ] remaining_attempts() calculates remaining tries
- [ ] Admin shows X/3 format with color coding
- [ ] Field is read-only in admin

---

## Task 45: Create is_verified Field

### Overview
Create the is_verified boolean flag to mark when an OTP has been successfully verified. This field transitions from False to True upon successful verification and prevents the same OTP from being reused. Once verified, the OTP is considered consumed and cannot be used again, even if within its expiry window.

### Dependencies
- Task 39: Create OTP Model
- Task 44: Create attempts Field

### Instructions

1. **Add is_verified field to OTP model**
   - Navigate to `backend/apps/notifications/models/otp.py`
   - Add field after attempts field
   - Use BooleanField for True/False verification status

2. **Configure field parameters**
   - Set default=False (unverified at creation)
   - Set blank=False, null=False
   - Set db_index=True for filtering unverified OTPs
   - Add help_text: "Whether this OTP has been verified"

3. **Create verification marking method**
   - Define model method `mark_as_verified()`
   - Set self.is_verified = True
   - Update self.updated_at to current time
   - Call self.save(update_fields=['is_verified', 'updated_at'])
   - Prevents reuse of same OTP

4. **Add reuse check method**
   - Define model method `can_be_used()`
   - Return False if is_verified is True
   - Return False if is_expired() is True
   - Return False if has_max_attempts() is True
   - Return True otherwise

5. **Create status property**
   - Define property `status` that returns string
   - "VERIFIED" if is_verified
   - "EXPIRED" if is_expired()
   - "LOCKED" if has_max_attempts()
   - "ACTIVE" otherwise

6. **Update database indexes**
   - Add composite index on (phone, purpose, is_verified)
   - This optimizes queries for active unverified OTPs
   - Index name: 'otp_active_lookup_idx'

7. **Add invalidation method**
   - Define method `invalidate()`
   - Sets is_verified = True (marks as consumed)
   - Prevents reuse even if not successfully verified
   - Used when new OTP requested for same phone+purpose

8. **Update admin configuration**
   - Add is_verified to list_display
   - Add custom admin method `verification_status()`
   - Display green checkmark ✓ if True
   - Display red X ✗ if False
   - Add is_verified to list_filter
   - Add is_verified to readonly_fields

### Verification State Transitions

```
┌─────────────────────────────────────────────────────┐
│              OTP Verification States                │
└─────────────────────────────────────────────────────┘

   [CREATED]
  is_verified=False
  attempts=0
      │
      ▼
   [ACTIVE]
  Waiting for verification
      │
      ├─────────────┬──────────────┬─────────────┐
      ▼             ▼              ▼             ▼
  [SUCCESS]    [EXPIRED]      [LOCKED]    [INVALIDATED]
is_verified  time >       attempts>=3    new OTP
   =True     expires_at                  requested
      │             │              │             │
      └─────────────┴──────────────┴─────────────┘
                         │
                         ▼
                   [UNUSABLE]
              Cannot be used again
```

### OTP Usability Logic

```python
can_be_used():
    if is_verified:
        return False  # Already used
    if is_expired():
        return False  # Time expired
    if has_max_attempts():
        return False  # Too many tries
    return True  # Can be verified
```

### Status Matrix

| is_verified | is_expired() | has_max_attempts() | Status | can_be_used() |
|-------------|--------------|-------------------|--------|---------------|
| False | False | False | ACTIVE | True |
| False | False | True | LOCKED | False |
| False | True | - | EXPIRED | False |
| True | - | - | VERIFIED | False |

### Expected Outcome
- is_verified field added to OTP model
- Field defaults to False
- mark_as_verified() sets to True and saves
- can_be_used() checks all conditions
- status property returns string label
- Admin displays verification status with icons

### Verification Checklist
- [ ] is_verified field added as BooleanField
- [ ] Default value is False
- [ ] Field is indexed
- [ ] mark_as_verified() sets True and saves
- [ ] can_be_used() checks all invalidation conditions
- [ ] status property returns appropriate label
- [ ] invalidate() marks as consumed
- [ ] Admin shows checkmark/X icon
- [ ] Composite index includes is_verified

---

## Task 46: Create OTPService

### Overview
Create the OTPService class to encapsulate all OTP-related business logic. This service acts as the facade for OTP operations, providing high-level methods for generating, sending, and verifying OTPs. It integrates with the SMSProviderFactory to send codes via SMS and manages the lifecycle of OTP records in the database.

### Dependencies
- Task 45: Create is_verified Field
- Task 38: Verify SMS Provider System (Group-B)
- SMSProviderFactory (from Group-B)
- OTP Model with all fields complete

### Instructions

1. **Create service file**
   - Navigate to `backend/apps/notifications/` Django app
   - Create new directory `services/` if not exists
   - Create file `services/otp_service.py`
   - This file contains the OTPService class

2. **Import required dependencies**
   - Import OTP model from `models.otp`
   - Import OTPPurpose enum from `enums.otp_purpose`
   - Import SMSProviderFactory from `services.sms_provider_factory`
   - Import Django exceptions (ValidationError)
   - Import timezone utilities from django.utils.timezone
   - Import logging module for error tracking

3. **Define OTPService class**
   - Create class OTPService
   - No inheritance (plain Python class)
   - Define __init__ method to initialize dependencies
   - Create logger instance for this service

4. **Initialize SMS provider factory**
   - In __init__, create self.sms_factory instance
   - Store as: self.sms_factory = SMSProviderFactory()
   - This will be used to get SMS provider for sending

5. **Add logger configuration**
   - Create module-level logger: logger = logging.getLogger(__name__)
   - Use logger for info, warning, and error messages
   - Log all OTP operations for audit trail

6. **Plan service methods structure**
   - generate_otp(phone, purpose) -> OTP object
   - send_otp(phone, purpose) -> OTP object
   - verify_otp(phone, code, purpose) -> bool
   - resend_otp(phone, purpose) -> OTP object
   - cleanup_expired() -> int (count of deleted)

7. **Add docstring for class**
   - Document service purpose
   - List all public methods
   - Provide usage examples
   - Document exception handling

8. **Create service initialization in apps.py**
   - Add ready() method to NotificationsConfig
   - Initialize service on app startup
   - Make service available app-wide

### Service Architecture

```
┌──────────────────────────────────────────────────┐
│              OTPService Layer                    │
└──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           OTPService                            │
├─────────────────────────────────────────────────┤
│ Dependencies:                                    │
│  - OTP Model                                    │
│  - SMSProviderFactory                           │
│  - Logger                                        │
├─────────────────────────────────────────────────┤
│ Public Methods:                                  │
│  + generate_otp(phone, purpose)                 │
│  + send_otp(phone, purpose)                     │
│  + verify_otp(phone, code, purpose)             │
│  + resend_otp(phone, purpose)                   │
│  + cleanup_expired()                             │
├─────────────────────────────────────────────────┤
│ Private Methods:                                 │
│  - _invalidate_existing(phone, purpose)         │
│  - _generate_code()                              │
│  - _get_message_template(purpose)               │
│  - _can_resend(phone, purpose)                  │
└─────────────────────────────────────────────────┘
         │                           │
         │ Uses                      │ Uses
         ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│   OTP Model      │       │ SMSProvider      │
│   (Database)     │       │   Factory        │
└──────────────────┘       └──────────────────┘
```

### Service Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| OTP Generation | Create secure 6-digit codes |
| OTP Storage | Save to database with metadata |
| SMS Sending | Use factory to get provider and send |
| Verification | Check code, expiry, attempts |
| Cleanup | Remove expired OTPs from database |
| Logging | Audit trail of all operations |

### Service Interface

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| generate_otp | phone, purpose | OTP object | Create new OTP record |
| send_otp | phone, purpose | OTP object | Generate and send via SMS |
| verify_otp | phone, code, purpose | bool | Validate OTP code |
| resend_otp | phone, purpose | OTP object | Resend with cooldown check |
| cleanup_expired | - | int | Delete expired OTPs |

### Expected Outcome
- OTPService class created with structure
- Dependencies initialized in __init__
- SMSProviderFactory instance stored
- Logger configured for audit trail
- Service ready for method implementation

### Verification Checklist
- [ ] services/otp_service.py file created
- [ ] OTPService class defined
- [ ] __init__ method initializes dependencies
- [ ] sms_factory stored as instance variable
- [ ] Logger configured at module level
- [ ] Class docstring documents methods
- [ ] Service registered in apps.py ready() method

---

## Task 47: Create generate_otp Method

### Overview
Implement the generate_otp method in OTPService to create new OTP records with cryptographically secure random 6-digit codes. This method invalidates any existing unverified OTPs for the same phone and purpose, generates a new code using Python's secrets module, calculates the appropriate expiry time based on purpose, and saves the OTP record to the database.

### Dependencies
- Task 46: Create OTPService

### Instructions

1. **Implement generate_otp method signature**
   - Navigate to `services/otp_service.py`
   - Define method: `def generate_otp(self, phone: str, purpose: str) -> OTP:`
   - Add type hints for parameters and return value
   - Add comprehensive docstring

2. **Validate input parameters**
   - Check phone is not empty
   - Validate phone format using validate_sri_lankan_phone validator
   - Check purpose is valid OTPPurpose enum value
   - Raise ValidationError for invalid inputs

3. **Invalidate existing OTPs**
   - Query for existing OTPs with same phone and purpose
   - Filter for is_verified=False (only unverified)
   - Call invalidate() method on each existing OTP
   - Log count of invalidated OTPs

4. **Generate secure OTP code**
   - Import secrets module (not random module)
   - Use secrets.randbelow(1000000) to get 0-999999
   - Format as 6-digit string with leading zeros
   - Code format: str(code).zfill(6)

5. **Calculate expiry time**
   - Call OTP.get_expiry_time(purpose) static method
   - Get purpose-specific duration (5 or 10 minutes)
   - Store as expires_at value

6. **Create OTP record**
   - Create new OTP instance
   - Set phone, otp_code, purpose, expires_at
   - Set attempts=0, is_verified=False (defaults)
   - Set tenant to current tenant from context

7. **Save to database**
   - Call otp.save()
   - Wrap in try-except for database errors
   - Log error and raise if save fails

8. **Log OTP generation**
   - Log phone (masked for security)
   - Log purpose
   - Log expiry time
   - Do NOT log the actual OTP code

9. **Return OTP object**
   - Return the created OTP instance
   - Caller can access otp_code if needed

### Code Generation Logic

```python
import secrets

def _generate_code() -> str:
    """
    Generate cryptographically secure 6-digit code.
    
    Uses secrets.randbelow() for unpredictability.
    Range: 000000 to 999999
    """
    code = secrets.randbelow(1000000)
    return str(code).zfill(6)

# Examples:
# 123 -> "000123"
# 5678 -> "005678"
# 999999 -> "999999"
```

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Randomness | Use secrets module, not random |
| Predictability | Each code independent of previous |
| Range | Full 6-digit range (000000-999999) |
| Uniqueness | Time + randomness makes collision unlikely |
| Logging | Never log actual code |

### Generation Flow

```
generate_otp(phone, purpose)
    │
    ├─> 1. Validate phone format
    │
    ├─> 2. Validate purpose enum
    │
    ├─> 3. Query existing OTPs
    │      (phone=X, purpose=Y, is_verified=False)
    │
    ├─> 4. Invalidate existing OTPs
    │      (prevents multiple active OTPs)
    │
    ├─> 5. Generate 6-digit code
    │      code = secrets.randbelow(1000000)
    │      formatted = str(code).zfill(6)
    │
    ├─> 6. Calculate expiry
    │      expires_at = now + duration(purpose)
    │
    ├─> 7. Create OTP object
    │      OTP(phone, code, purpose, expires_at)
    │
    ├─> 8. Save to database
    │
    ├─> 9. Log operation (no code)
    │
    └─> 10. Return OTP object
```

### Method Signature

```python
def generate_otp(
    self,
    phone: str,
    purpose: str
) -> OTP:
    """
    Generate new OTP for phone verification.
    
    Args:
        phone: Phone number in +94XXXXXXXXX format
        purpose: OTPPurpose enum value
        
    Returns:
        OTP object with generated code
        
    Raises:
        ValidationError: If phone or purpose invalid
        DatabaseError: If save fails
    """
```

### Expected Outcome
- generate_otp method implemented and functional
- Method invalidates existing OTPs
- Generates cryptographically secure 6-digit code
- Calculates purpose-based expiry time
- Saves OTP to database successfully
- Logs operation without exposing code

### Verification Checklist
- [ ] generate_otp method signature with type hints
- [ ] Phone format validation implemented
- [ ] Purpose enum validation implemented
- [ ] Existing OTPs invalidated before creation
- [ ] Code generated using secrets.randbelow()
- [ ] Code formatted as 6-digit string with leading zeros
- [ ] Expiry calculated based on purpose
- [ ] OTP saved to database with all fields
- [ ] Logging excludes actual OTP code
- [ ] Method returns OTP object

---

## Task 48: Create send_otp Method

### Overview
Implement the send_otp method in OTPService to generate an OTP and send it via SMS in a single operation. This method combines OTP generation with SMS delivery, using the SMSProviderFactory to get the configured provider, formatting the message with the appropriate template based on purpose, and handling delivery errors gracefully.

### Dependencies
- Task 47: Create generate_otp Method
- Task 38: Verify SMS Provider System (Group-B)

### Instructions

1. **Implement send_otp method signature**
   - Navigate to `services/otp_service.py`
   - Define method: `def send_otp(self, phone: str, purpose: str) -> OTP:`
   - Add type hints for parameters and return value
   - Add comprehensive docstring

2. **Call generate_otp**
   - Use self.generate_otp(phone, purpose) to create OTP
   - Store returned OTP object
   - This handles validation, generation, and saving

3. **Get SMS provider**
   - Call self.sms_factory.get_provider() to get active provider
   - Store provider instance
   - Handle case where no provider is configured

4. **Build SMS message**
   - Call self._get_message_template(purpose, otp.otp_code)
   - Template includes OTP code and instructions
   - Different messages for different purposes

5. **Send SMS**
   - Call provider.send_sms(phone, message)
   - Wrap in try-except for SMS delivery errors
   - Catch exceptions without failing entire operation

6. **Handle SMS delivery failure**
   - If SMS fails, log error with details
   - Do NOT delete OTP from database
   - Return OTP object anyway (user can resend)
   - Raise warning but don't fail the request

7. **Log successful send**
   - Log phone (masked)
   - Log purpose
   - Log provider name used
   - Log success status

8. **Return OTP object**
   - Return the OTP instance
   - Caller knows code was generated even if SMS failed

### SMS Message Templates

```python
def _get_message_template(purpose: str, code: str) -> str:
    """Get SMS message template for purpose."""
    templates = {
        'LOGIN': f"""Your LankaCommerce login code is:

{code}

Valid for 5 minutes. Do not share this code.

- LankaCommerce Cloud""",
        
        'REGISTER': f"""Welcome to LankaCommerce!

Your verification code is:

{code}

Valid for 10 minutes.

- LankaCommerce Cloud""",
        
        'RESET': f"""Your password reset code is:

{code}

Valid for 10 minutes. If you didn't request this, ignore this message.

- LankaCommerce Cloud""",
        
        'VERIFY': f"""Verify your phone number:

{code}

Valid for 5 minutes.

- LankaCommerce Cloud"""
    }
    return templates.get(purpose, templates['VERIFY'])
```

### Send Flow

```
send_otp(phone, purpose)
    │
    ├─> 1. Call generate_otp(phone, purpose)
    │      ├─> Validate inputs
    │      ├─> Invalidate existing OTPs
    │      ├─> Generate code
    │      ├─> Save to DB
    │      └─> Return OTP object
    │
    ├─> 2. Get SMS provider
    │      provider = sms_factory.get_provider()
    │
    ├─> 3. Build message template
    │      message = _get_message_template(purpose, code)
    │
    ├─> 4. Send SMS
    │      try:
    │          provider.send_sms(phone, message)
    │      except SMSDeliveryError:
    │          Log error but continue
    │
    ├─> 5. Log send operation
    │
    └─> 6. Return OTP object
```

### Error Handling

| Error Type | Handling | User Impact |
|------------|----------|-------------|
| Invalid Phone | Raise ValidationError | Request rejected |
| Invalid Purpose | Raise ValidationError | Request rejected |
| No SMS Provider | Log warning, return OTP | OTP created but not sent |
| SMS Delivery Fail | Log error, return OTP | OTP created, can resend |
| Database Error | Raise exception | Request failed |

### Message Format

| Component | Content |
|-----------|---------|
| Greeting | Purpose-specific (Welcome, Login code, etc.) |
| Code Display | OTP code on separate line, prominent |
| Validity | Expiry time (5 or 10 minutes) |
| Security Warning | Do not share (for sensitive purposes) |
| Signature | - LankaCommerce Cloud |
| Length | ~100-150 characters (single SMS) |

### Expected Outcome
- send_otp method implemented and functional
- Method generates OTP via generate_otp
- SMS provider fetched from factory
- Message formatted with purpose-specific template
- SMS sent via provider
- Errors handled gracefully
- OTP returned regardless of SMS delivery status

### Verification Checklist
- [ ] send_otp method signature with type hints
- [ ] Calls generate_otp internally
- [ ] Gets SMS provider from factory
- [ ] _get_message_template method creates messages
- [ ] Different templates for each purpose
- [ ] SMS sent via provider.send_sms()
- [ ] SMS delivery errors caught and logged
- [ ] Operation continues even if SMS fails
- [ ] Success logged with masked phone
- [ ] Returns OTP object

---

## Summary

This document established the foundation for OTP-based phone verification by implementing the OTP model with all required fields and creating the OTPService with generation and sending capabilities. The OTP model stores verification codes with phone numbers, purposes, expiry timestamps, attempt tracking, and verification status. The OTPService provides secure code generation using Python's secrets module and integrates with the SMS provider infrastructure to deliver codes via SMS.

### Completed Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| OTP Model | Store verification codes | phone, otp_code, purpose, expires_at, attempts, is_verified |
| phone Field | Store recipient number | +94XXXXXXXXX format validation |
| otp_code Field | Store 6-digit code | Secure generation, masked display |
| purpose Field | Categorize OTP usage | LOGIN, REGISTER, RESET, VERIFY |
| expires_at Field | Track validity | 5-10 minute expiry based on purpose |
| attempts Field | Prevent brute force | 3-attempt maximum |
| is_verified Field | Prevent reuse | Single-use enforcement |
| OTPService | Business logic layer | Facade for OTP operations |
| generate_otp | Create OTP records | Secure code generation, invalidation |
| send_otp | Deliver via SMS | Template formatting, provider integration |

### Next Document Preview

Document 02 will complete the OTP system by implementing verification logic, enforcing rate limits, creating cleanup tasks, and verifying the end-to-end OTP flow. This includes the verify_otp method for code validation, expiry checking (5 minutes), max attempts enforcement (3 attempts), resend cooldown (60 seconds), a Celery cleanup task to remove expired OTPs, and comprehensive system verification.

### Integration Points

- **SMS Provider System (Group-B):** Uses SMSProviderFactory to send OTPs via configured gateway
- **Multi-tenancy (Phase-02):** OTP model is tenant-aware for data isolation
- **Authentication System (Phase-03):** Provides verification for login and registration flows
- **Celery Tasks (Phase-03):** Cleanup task removes expired OTPs on schedule

---

**Document Status:** Complete  
**Next Steps:** Proceed to [02_Tasks-49-54_Limits-Cleanup-Verify.md](02_Tasks-49-54_Limits-Cleanup-Verify.md)
