# Tasks 09-16: WhatsApp OptIn Model and Migration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** A - WhatsApp Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Settings-Config-Model.md](01_Tasks-01-08_Settings-Config-Model.md)
- **→ Next Group:** [Group-B_API-Client-Auth](../../Group-B_API-Client-Auth/)

---

## Document Overview

This document completes the WhatsApp configuration setup by adding the remaining fields to WhatsAppConfig model (access_token, is_enabled, daily_limit) and creating the WhatsAppOptIn model for tracking customer messaging consent. It concludes with generating migrations to apply these changes to the database. This ensures complete multi-tenant WhatsApp configuration with proper consent management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create access_token Field | Medium | 25 min |
| 10 | Create is_enabled Field | Low | 10 min |
| 11 | Create daily_limit Field | Low | 15 min |
| 12 | Create WhatsAppOptIn Model | Medium | 30 min |
| 13 | Create customer FK | Low | 15 min |
| 14 | Create opted_in_at Field | Low | 10 min |
| 15 | Create opted_out_at Field | Low | 10 min |
| 16 | Create WhatsApp Migrations | Low | 15 min |

---

## Task 09: Create access_token Field

### Overview
Add the access_token field to WhatsAppConfig model with encryption. This field stores the tenant-specific Meta access token in encrypted form. Unlike the global WHATSAPP_ACCESS_TOKEN setting, this allows each tenant to use their own WhatsApp Business Account with secure token storage at rest.

### Dependencies
- Task 07: Create WhatsAppConfig Model
- Task 08: Create phone_number_id Field
- django-fernet-fields library installed

### Instructions

1. **Install encryption library**
   - Add django-fernet-fields to requirements.txt
   - Install package via pip
   - This provides encrypted field types
   - Supports transparent encryption/decryption

2. **Configure encryption key**
   - Generate Fernet encryption key
   - Add FERNET_KEYS to Django settings
   - Store key in environment variables
   - Never commit key to version control

3. **Import encryption field**
   - Open `backend/apps/notifications/models/whatsapp_config.py`
   - Import EncryptedTextField from django-fernet-fields
   - This field encrypts data at rest in database

4. **Add access_token field**
   - Use EncryptedTextField field type
   - Set blank=True, null=True (optional configuration)
   - Add help_text explaining tenant-specific token
   - Store as encrypted text in database

5. **Add field validation**
   - Validate token format if possible
   - Check token not empty when is_enabled=True
   - Validate token starts with expected prefix (EAA, EAAA)

6. **Implement token property methods**
   - Create property to check if token configured
   - Add method to validate token format
   - Add method to safely retrieve token (decrypts automatically)

7. **Add encryption documentation**
   - Document that field is encrypted at rest
   - Explain encryption key management
   - Note key rotation procedures
   - Document backup/restore implications

8. **Handle token in admin**
   - Mask token in Django admin list view
   - Show only last 4 characters in listings
   - Allow full view only in detail page
   - Add warning about token sensitivity

### access_token Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | EncryptedTextField | Secure storage with encryption |
| Blank | True | Allow empty during setup |
| Null | True | Optional field |
| Max Length | N/A | Text field handles long tokens |
| Encryption | Fernet symmetric | AES-128 encryption at rest |

### Encryption Architecture

```
Data Flow:

Plain Token (in memory)
        ↓
Django saves to database
        ↓
EncryptedTextField encrypts
        ↓
Encrypted Token (in database)
        ↓
Django reads from database
        ↓
EncryptedTextField decrypts
        ↓
Plain Token (in memory)
```

### Fernet Encryption Setup

| Step | Action | Details |
|------|--------|---------|
| 1. Generate Key | Use Fernet.generate_key() | Returns 44-char base64 key |
| 2. Store Key | Add to environment variables | FERNET_KEYS=[key1, key2, ...] |
| 3. Configure Django | Add to settings | FERNET_KEYS from env |
| 4. Apply Migrations | Create database schema | Field stored as BYTEA/TEXT |

### Encryption Key Generation

```
Generate Fernet Key:

Python:
from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(key.decode())

Command Line:
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

Output Example:
9aF3jK8mN2pQ5rS7tU1vW4xY6zA8bC0dE2fG5hJ7kL9mN1pQ3rS6tU8vW0xY2zA=
```

### Key Management

| Aspect | Implementation | Notes |
|--------|----------------|-------|
| Storage | Environment variables | Never in code |
| Rotation | Support multiple keys | Old + new keys in list |
| Backup | Secure vault storage | Required for disaster recovery |
| Access | Restrict to app servers | Minimum necessary access |

### Token vs Global Setting

| Aspect | Global WHATSAPP_ACCESS_TOKEN | Tenant access_token |
|--------|------------------------------|---------------------|
| Scope | Application-wide | Per tenant |
| Storage | Environment variable | Database (encrypted) |
| Use Case | Single business | Multi-tenant SaaS |
| Rotation | Manual environment update | Per-tenant configuration |
| Security | Server environment only | Encrypted at rest + transit |

### Validation Rules

| Validation | Rule | Error Handling |
|------------|------|----------------|
| Format | Starts with EAA or EAAA | Log warning |
| Length | Minimum 100 characters | Log warning |
| Required | Not empty if is_enabled | Validation error |
| Encryption | Successfully decrypts | Raise exception |

### Property Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| has_access_token() | bool | Check if token configured |
| is_token_valid() | bool | Validate token format |
| get_decrypted_token() | str | Retrieve plain token |
| mask_token() | str | Get masked token (last 4 chars) |

### Security Considerations

```
Security Layers:

1. Environment Variables
   └── Encryption key stored securely

2. Encrypted Storage
   └── Token encrypted in database

3. Access Control
   └── Only authorized code can decrypt

4. Audit Logging
   └── Log token access (not value)

5. Network Security
   └── Always use HTTPS for API calls
```

### Fallback Mechanism

```
Token Resolution Logic:

1. Check tenant.whatsapp_config.access_token
        ↓
2. If exists and valid → Use tenant token
        ↓
3. If not exists → Fall back to global WHATSAPP_ACCESS_TOKEN
        ↓
4. If global not exists → Raise configuration error
```

### Django Admin Display

| View | Display Format |
|------|----------------|
| List View | Token: ****...xyz4 (masked) |
| Detail View | Full token visible (with warning) |
| Edit Form | Input field with encryption notice |
| Change Log | Hide token value in audit log |

### Key Rotation Process

```
Key Rotation Steps:

1. Generate new Fernet key
        ↓
2. Add new key to FERNET_KEYS list (keep old)
        ↓
3. Deploy updated environment variables
        ↓
4. Django re-encrypts on next save with new key
        ↓
5. After all data migrated, remove old key
        ↓
6. Complete rotation
```

### Database Storage

```sql
Table: notifications_whatsapp_config

Columns:
├── access_token (TEXT/BYTEA)
│   Stores: Fernet-encrypted token
│   Format: gAAAAABh...encrypted_data...
│   Length: ~200-300 characters encrypted
```

### Error Handling

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Missing encryption key | Raise configuration error on startup |
| Invalid encrypted data | Log error, treat as missing token |
| Decryption failure | Alert admin, disable tenant config |
| Token validation failure | Log warning, allow save but warn |

### Expected Outcome
- access_token field added with encryption
- Fernet encryption configured
- Token validation implemented
- Secure token handling in admin

### Verification Checklist
- [ ] django-fernet-fields installed
- [ ] FERNET_KEYS configured in settings
- [ ] access_token field added to WhatsAppConfig
- [ ] EncryptedTextField used for field type
- [ ] blank=True, null=True set
- [ ] Token validation methods implemented
- [ ] Admin displays masked token
- [ ] Encryption key stored securely

---

## Task 10: Create is_enabled Field

### Overview
Add the is_enabled field to WhatsAppConfig model. This boolean field allows administrators to enable or disable WhatsApp messaging for individual tenants without deleting their configuration. It provides a soft toggle for controlling feature access and troubleshooting.

### Dependencies
- Task 07: Create WhatsAppConfig Model

### Instructions

1. **Open WhatsAppConfig model file**
   - Navigate to `backend/apps/notifications/models/whatsapp_config.py`
   - Locate the WhatsAppConfig class definition
   - Add is_enabled field in configuration section

2. **Define is_enabled field**
   - Use BooleanField field type
   - Set default=False (disabled by default)
   - Add help_text explaining toggle purpose
   - Add db_index=True for filtering queries

3. **Add validation logic**
   - Create model clean() method
   - Validate required fields when is_enabled=True
   - Check phone_number_id exists if enabled
   - Check access_token exists if enabled

4. **Update model save method**
   - Override save() method
   - Call full_clean() before saving
   - Log status changes (enabled/disabled)
   - Trigger notifications on status change

5. **Create status property methods**
   - Add is_active() property (checks enabled + valid config)
   - Add can_send_messages() method
   - Add disable_reason() method (why disabled)

6. **Add admin actions**
   - Create bulk enable action
   - Create bulk disable action
   - Add confirmation for bulk operations
   - Log admin actions for audit

7. **Update __str__ method**
   - Include enabled/disabled status
   - Example: "Tenant ABC - WhatsApp (Enabled)"
   - Or: "Tenant XYZ - WhatsApp (Disabled)"

### is_enabled Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | BooleanField | Enable/disable toggle |
| Default | False | Disabled by default for safety |
| Null | False | Always has value |
| DB Index | True | Fast filtering in queries |
| Editable | True | Admins can toggle |

### Configuration States

| is_enabled | phone_number_id | access_token | State | Can Send |
|------------|----------------|--------------|-------|----------|
| False | Any | Any | Disabled | No |
| True | Empty | Any | Invalid Config | No |
| True | Set | Empty | Invalid Config | No |
| True | Set | Set | Active | Yes |

### Validation Logic

```
When is_enabled is set to True:

1. Check if phone_number_id is configured
        ↓
2. Check if access_token is configured
        ↓
3. Validate phone_number_id format
        ↓
4. Validate access_token format (if possible)
        ↓
5. If all valid → Allow save
   If any invalid → Raise ValidationError
```

### Validation Checks

| Field | Check | Error Message |
|-------|-------|---------------|
| phone_number_id | Not empty | Phone number ID required when enabled |
| access_token | Not empty | Access token required when enabled |
| Both | Valid format | Invalid configuration for WhatsApp |

### Status Property Methods

| Method | Return Type | Logic |
|--------|-------------|-------|
| is_active() | bool | is_enabled AND has_valid_config |
| can_send_messages() | bool | is_active AND not_rate_limited |
| get_status_display() | str | Human-readable status |
| disable_reason() | str | Reason why not enabled/active |

### Enable/Disable Flow

```
Enabling WhatsApp for Tenant:

1. Admin navigates to WhatsApp config
        ↓
2. Admin sets is_enabled = True
        ↓
3. Model validation runs
        ↓
4. Check phone_number_id configured
        ↓
5. Check access_token configured
        ↓
6. If valid → Save and log
   If invalid → Show error message
        ↓
7. Tenant can now send WhatsApp messages
```

### Disabling Scenarios

| Scenario | Action | Reason |
|----------|--------|--------|
| Manual Disable | Admin sets is_enabled=False | Temporary suspension |
| Validation Failure | Auto-disable on save | Invalid configuration |
| Rate Limit Exceeded | Temporary disable | Too many messages |
| Token Expiration | Auto-disable | Access token expired |
| Payment Issue | Admin disable | Billing problem |

### Database Queries

```
Filter Enabled Configs:
WhatsAppConfig.objects.filter(is_enabled=True)

Filter Active Configs:
WhatsAppConfig.objects.filter(
    is_enabled=True,
    phone_number_id__isnull=False,
    access_token__isnull=False
)

Count Enabled Tenants:
WhatsAppConfig.objects.filter(is_enabled=True).count()
```

### Index Strategy

```sql
Index for is_enabled queries:

CREATE INDEX idx_whatsapp_enabled 
ON notifications_whatsapp_config(is_enabled);

Composite index for common queries:

CREATE INDEX idx_whatsapp_enabled_tenant 
ON notifications_whatsapp_config(tenant_id, is_enabled);
```

### Admin Interface

| Element | Implementation |
|---------|----------------|
| List Display | Show enabled status with icon |
| List Filter | Add is_enabled filter |
| Bulk Actions | Enable/disable selected configs |
| Detail Form | Prominent toggle with warning |

### Admin Actions

```
Bulk Enable Action:
1. Select multiple WhatsApp configs
2. Choose "Enable WhatsApp" action
3. Validate each config
4. Enable valid configs
5. Report failures with reasons

Bulk Disable Action:
1. Select multiple configs
2. Choose "Disable WhatsApp" action
3. Confirm action (safety prompt)
4. Disable all selected
5. Log action for audit
```

### Audit Logging

| Event | Log Entry | Details |
|-------|-----------|---------|
| Enabled | WhatsApp enabled for tenant | Admin user, timestamp |
| Disabled | WhatsApp disabled for tenant | Admin user, reason |
| Auto-Disabled | Auto-disabled due to error | Error type, timestamp |
| Validation Failed | Enable failed - invalid config | Missing fields |

### Status Display Logic

```
get_status_display() method:

if not is_enabled:
    return "Disabled"
elif not phone_number_id:
    return "Enabled - Missing Phone ID"
elif not access_token:
    return "Enabled - Missing Token"
elif is_rate_limited:
    return "Enabled - Rate Limited"
else:
    return "Active"
```

### Expected Outcome
- is_enabled field added with default False
- Validation ensures required fields when enabled
- Admin actions for bulk enable/disable
- Status property methods for state checking

### Verification Checklist
- [ ] is_enabled field added to WhatsAppConfig
- [ ] BooleanField with default=False
- [ ] db_index=True for performance
- [ ] Validation in clean() method
- [ ] Property methods: is_active(), can_send_messages()
- [ ] Admin bulk actions implemented
- [ ] __str__ method updated with status
- [ ] Audit logging for status changes

---

## Task 11: Create daily_limit Field

### Overview
Add the daily_limit field to WhatsAppConfig model. This field sets the maximum number of WhatsApp messages a tenant can send per day, helping manage API usage, costs, and comply with Meta's messaging tier limits. It provides per-tenant rate limiting control.

### Dependencies
- Task 07: Create WhatsAppConfig Model

### Instructions

1. **Open WhatsAppConfig model file**
   - Navigate to `backend/apps/notifications/models/whatsapp_config.py`
   - Locate the WhatsAppConfig class definition
   - Add daily_limit field in configuration section

2. **Define daily_limit field**
   - Use IntegerField field type
   - Set default=1000 (reasonable starting limit)
   - Add validators for minimum (>0) and maximum values
   - Add help_text explaining purpose

3. **Add field validation**
   - Validate limit is positive integer
   - Set minimum value: 1
   - Set maximum value: 100000 (or based on Meta tier)
   - Add validator for reasonable limits

4. **Create limit tracking model**
   - Consider separate model for daily usage tracking
   - Or add to existing tracking mechanism
   - Store date, tenant, message count
   - Reset counter at midnight

5. **Implement limit checking methods**
   - Add has_remaining_quota() method
   - Add get_remaining_messages() method
   - Add get_messages_sent_today() method
   - Add can_send_message() method

6. **Add limit enforcement logic**
   - Check limit before sending messages
   - Raise exception if limit exceeded
   - Log limit exceeded events
   - Notify admin when limit reached

7. **Create admin display**
   - Show current usage vs limit
   - Display as "450 / 1000" format
   - Add progress bar visualization
   - Color code based on percentage (green/yellow/red)

8. **Add limit tier mapping**
   - Document Meta's messaging tier limits
   - Map tenant plans to daily limits
   - Auto-set limits based on Meta verification level
   - Allow manual override by admin

### daily_limit Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Store message limit |
| Default | 1000 | Reasonable starting limit |
| Validators | MinValueValidator(1), MaxValueValidator(100000) | Ensure valid range |
| Null | False | Always has value |
| Help Text | Maximum messages per day | Clear explanation |

### Limit Tiers

| Meta Tier | Default Limit | Requirements | Suggested Setting |
|-----------|---------------|--------------|-------------------|
| Development | 1,000 | Initial setup | 1,000 |
| Standard | 10,000 | Phone verification | 5,000 - 10,000 |
| Standard Plus | 100,000 | Business verification | 50,000 - 100,000 |
| Custom | Varies | Enterprise agreement | Custom value |

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Minimum | daily_limit >= 1 | Daily limit must be at least 1 |
| Maximum | daily_limit <= 100000 | Daily limit cannot exceed 100,000 |
| Positive | daily_limit > 0 | Daily limit must be positive |
| Integer | Type check | Daily limit must be an integer |

### Daily Usage Tracking

```
Usage Tracking Flow:

1. Message send requested
        ↓
2. Check get_messages_sent_today()
        ↓
3. Compare with daily_limit
        ↓
4. If under limit → Allow send, increment counter
   If at/over limit → Reject send, log event
        ↓
5. Update usage counter
        ↓
6. Check if approaching limit (80%, 90%, 100%)
        ↓
7. Send alerts if thresholds crossed
```

### Rate Limiting Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| get_messages_sent_today() | int | Count messages today |
| has_remaining_quota() | bool | Check if under limit |
| get_remaining_messages() | int | How many left today |
| can_send_message(count=1) | bool | Check if can send N messages |
| get_usage_percentage() | float | Usage as percentage |

### Usage Tracking Model (Optional)

```
WhatsAppUsage Model (if separate):
├── whatsapp_config (ForeignKey)
├── date (DateField)
├── message_count (IntegerField)
├── created_at (DateTimeField)
└── updated_at (DateTimeField)

Or use existing message log:
├── Query Message model
├── Filter by tenant + date
├── Count messages
└── Compare with limit
```

### Limit Checking Logic

```
Before sending message:

def can_send_message():
    if not self.is_enabled:
        return False, "WhatsApp disabled"
    
    sent_today = self.get_messages_sent_today()
    
    if sent_today >= self.daily_limit:
        return False, "Daily limit exceeded"
    
    return True, "OK"
```

### Usage Percentage Thresholds

| Percentage | Color | Action |
|------------|-------|--------|
| 0-70% | Green | Normal operation |
| 71-85% | Yellow | Warning notification |
| 86-95% | Orange | Alert admin |
| 96-100% | Red | Block further messages |

### Admin Display Format

```
Django Admin List View:

| Tenant | Limit | Today's Usage | Status |
|--------|-------|---------------|--------|
| ABC    | 1000  | 450 / 1000    | ████████████░░░░ 45% |
| XYZ    | 5000  | 4700 / 5000   | ████████████████▓ 94% |
| DEF    | 1000  | 1000 / 1000   | ████████████████ 100% |
```

### Limit Override Scenarios

| Scenario | Action | Implementation |
|----------|--------|----------------|
| Special Campaign | Temporarily increase limit | Admin sets higher daily_limit |
| Trial Account | Enforce low limit | Set daily_limit = 100 |
| Premium Tier | Higher limit | Set daily_limit = 50000 |
| Suspected Abuse | Reduce limit | Admin lowers daily_limit |

### Reset Mechanism

```
Daily Counter Reset:

Option 1: Celery Scheduled Task
- Run at midnight (Asia/Colombo)
- Reset all counters to 0
- Log reset action

Option 2: Lazy Reset
- Check date on each send attempt
- If date changed, reset counter
- More efficient, no scheduled task

Option 3: Database Query
- Filter messages by date
- Count real-time
- No counter to reset (always accurate)
```

### Notification Thresholds

| Threshold | Recipients | Message |
|-----------|-----------|---------|
| 80% | Tenant admins | "You've used 80% of daily WhatsApp limit" |
| 90% | Tenant admins + support | "You've used 90% of daily limit" |
| 100% | All stakeholders | "Daily WhatsApp limit reached" |

### Cost Management

```
Limit-Based Cost Control:

1. Each tenant has daily_limit
        ↓
2. Limit prevents excessive usage
        ↓
3. Usage tracked per tenant
        ↓
4. Billing calculated from usage
        ↓
5. Limits adjusted based on plan
```

### API Response Handling

```
When limit exceeded:

API Response:
{
    "success": false,
    "error": "DAILY_LIMIT_EXCEEDED",
    "message": "Daily WhatsApp message limit reached",
    "limit": 1000,
    "sent_today": 1000,
    "resets_at": "2026-02-01T00:00:00+05:30"
}
```

### Expected Outcome
- daily_limit field added with default value
- Validation ensures positive reasonable values
- Methods for checking and enforcing limits
- Admin display shows usage vs limit

### Verification Checklist
- [ ] daily_limit field added to WhatsAppConfig
- [ ] IntegerField with default=1000
- [ ] MinValueValidator(1) and MaxValueValidator applied
- [ ] Help text explains purpose
- [ ] Methods: has_remaining_quota(), get_remaining_messages()
- [ ] Limit checking logic before message send
- [ ] Admin displays usage with progress bar
- [ ] Notification system for limit thresholds

---

## Task 12: Create WhatsAppOptIn Model

### Overview
Create the WhatsAppOptIn model to track customer consent for receiving WhatsApp messages. This model is critical for GDPR compliance and Meta's messaging policies, which require explicit opt-in consent before sending marketing messages. It maintains an audit trail of consent status changes.

### Dependencies
- Task 07: Create WhatsAppConfig Model
- Customer model exists (from ERP modules)
- Tenant model exists

### Instructions

1. **Create WhatsAppOptIn model file**
   - Navigate to `backend/apps/notifications/models/`
   - Create `whatsapp_optin.py` file
   - This model tracks customer consent

2. **Import required dependencies**
   - Import Django model classes
   - Import Customer model from customers app
   - Import timezone utilities
   - Import User model for audit fields

3. **Define WhatsAppOptIn class**
   - Inherit from models.Model
   - Add class docstring explaining purpose
   - This tracks explicit WhatsApp consent per customer

4. **Add tenant relationship**
   - Since Customer is tenant-aware, inherit tenant context
   - No explicit tenant FK needed (through customer)
   - Consent is always tenant-specific

5. **Add audit fields**
   - Add created_at timestamp (auto_now_add)
   - Add updated_at timestamp (auto_now)
   - Add opted_in_by ForeignKey to User (who processed opt-in)
   - Add opted_out_by ForeignKey to User (who processed opt-out)
   - Add ip_address for tracking (optional)
   - Add user_agent for tracking (optional)

6. **Define Meta class**
   - Set table name: 'notifications_whatsapp_optin'
   - Add verbose_name: 'WhatsApp Opt-In'
   - Add verbose_name_plural: 'WhatsApp Opt-Ins'
   - Add ordering: ['-created_at']
   - Add unique constraint on customer (one record per customer)

7. **Add status property methods**
   - Add is_opted_in() property
   - Add is_opted_out() property
   - Add opt_in_duration() method (how long opted in)
   - Add can_receive_messages() method

8. **Create consent management methods**
   - Add opt_in() method with user parameter
   - Add opt_out() method with user parameter
   - Log consent changes
   - Trigger webhooks on status change

9. **Add string representation**
   - Define __str__ method
   - Return customer name + status
   - Example: "John Doe - Opted In"

10. **Import in models __init__.py**
    - Add WhatsAppOptIn to models imports
    - Make available for use across app

### WhatsAppOptIn Model Purpose

| Aspect | Description |
|--------|-------------|
| Purpose | Track WhatsApp messaging consent |
| Scope | Per customer, per tenant |
| Compliance | GDPR, Meta policies |
| Audit | Full consent history |
| Required | Must opt-in before marketing messages |

### Model Structure Overview

```
WhatsAppOptIn Model
├── Customer Relationship (ForeignKey) - Task 13
├── Consent Status Fields (Tasks 14, 15)
│   ├── opted_in_at
│   └── opted_out_at
├── Audit Fields
│   ├── created_at
│   ├── updated_at
│   ├── opted_in_by (User)
│   ├── opted_out_by (User)
│   ├── ip_address (optional)
│   └── user_agent (optional)
└── Methods
    ├── is_opted_in()
    ├── opt_in(user)
    └── opt_out(user)
```

### Consent Requirements

| Message Type | Requires Opt-In | Notes |
|--------------|-----------------|-------|
| Marketing | Yes | Must have active opt-in |
| Promotional | Yes | Requires consent |
| Order Updates | No (if transactional) | Business messages allowed |
| Shipping Updates | No (if transactional) | Part of purchase flow |
| Account Alerts | No (if transactional) | Security messages |
| Newsletter | Yes | Marketing content |

### Opt-In Status Logic

```
Determining Opt-In Status:

if opted_in_at is not None and opted_out_at is None:
    → Currently Opted In
    
elif opted_in_at is None and opted_out_at is None:
    → Never Opted In (default)
    
elif opted_out_at is not None and opted_out_at > opted_in_at:
    → Currently Opted Out
    
elif opted_in_at is not None and opted_in_at > opted_out_at:
    → Opted Back In
```

### Consent State Transitions

```
State Machine:

Never Opted In (Initial)
    ↓ opt_in()
Opted In
    ↓ opt_out()
Opted Out
    ↓ opt_in()
Opted In (again)
```

### Meta Class Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| db_table | notifications_whatsapp_optin | Explicit table name |
| verbose_name | WhatsApp Opt-In | Admin display |
| ordering | ['-created_at'] | Newest first |
| unique_together | ['customer'] | One record per customer |
| indexes | [customer, opted_in_at] | Query optimization |

### Audit Trail Fields

| Field | Type | Purpose |
|-------|------|---------|
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Last modification |
| opted_in_by | ForeignKey(User) | Who processed opt-in |
| opted_out_by | ForeignKey(User) | Who processed opt-out |
| ip_address | GenericIPAddressField | Request IP (optional) |
| user_agent | CharField | Browser/app info (optional) |

### Property Methods

| Method | Return Type | Logic |
|--------|-------------|-------|
| is_opted_in() | bool | opted_in_at exists and > opted_out_at |
| is_opted_out() | bool | opted_out_at exists and > opted_in_at |
| never_opted_in() | bool | Both timestamps are None |
| opt_in_duration() | timedelta | Time since opted in |
| can_receive_messages() | bool | is_opted_in() |

### Consent Management Methods

```
opt_in(user, ip_address=None, user_agent=None):
    - Set opted_in_at to current timestamp
    - Set opted_in_by to user
    - Store ip_address and user_agent if provided
    - Clear opted_out_at (if re-opting in)
    - Log consent change
    - Trigger opt-in webhook
    - Save record

opt_out(user, ip_address=None, user_agent=None):
    - Set opted_out_at to current timestamp
    - Set opted_out_by to user
    - Store ip_address and user_agent if provided
    - Log consent change
    - Trigger opt-out webhook
    - Save record
```

### GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| Explicit Consent | opt_in() must be called explicitly |
| Easy Opt-Out | opt_out() method available |
| Audit Trail | All changes logged with timestamps |
| Data Access | Customer can view their consent status |
| Data Deletion | Cascade delete with customer |

### Usage Example

```
Check if customer can receive WhatsApp:

customer = get_current_customer()
optin = WhatsAppOptIn.objects.get_or_create(customer=customer)

if optin.can_receive_messages():
    send_whatsapp_message(customer, message)
else:
    # Cannot send marketing message
    log_blocked_message(customer, "No WhatsApp consent")
```

### Database Indexes

```sql
CREATE INDEX idx_optin_customer 
ON notifications_whatsapp_optin(customer_id);

CREATE INDEX idx_optin_status 
ON notifications_whatsapp_optin(opted_in_at, opted_out_at);

CREATE INDEX idx_optin_created 
ON notifications_whatsapp_optin(created_at);
```

### Admin Interface

| Feature | Implementation |
|---------|----------------|
| List View | Show customer, status, dates |
| Filters | Status (opted in/out), date range |
| Actions | Bulk opt-in, bulk opt-out |
| Detail View | Full audit trail |
| Readonly Fields | Timestamps, user refs |

### Expected Outcome
- WhatsAppOptIn model created with structure
- Tenant-aware through customer relationship
- Audit fields for compliance
- Status property methods implemented

### Verification Checklist
- [ ] `backend/apps/notifications/models/whatsapp_optin.py` created
- [ ] WhatsAppOptIn class defined
- [ ] Audit fields included (created_at, updated_at, users)
- [ ] Meta class configured with unique constraint
- [ ] Property methods: is_opted_in(), is_opted_out()
- [ ] Consent methods: opt_in(), opt_out()
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 13: Create customer FK

### Overview
Add the customer ForeignKey field to WhatsAppOptIn model. This field establishes the relationship between the opt-in record and the customer, ensuring each customer has one opt-in record per tenant. It's the primary link for tracking consent.

### Dependencies
- Task 12: Create WhatsAppOptIn Model
- Customer model exists in customers app

### Instructions

1. **Open WhatsAppOptIn model file**
   - Navigate to `backend/apps/notifications/models/whatsapp_optin.py`
   - Locate the WhatsAppOptIn class definition

2. **Import Customer model**
   - Add import for Customer model
   - From apps.customers.models import Customer
   - Ensure customers app is available

3. **Define customer ForeignKey**
   - Use ForeignKey field type
   - Link to Customer model
   - Set on_delete=CASCADE (delete opt-in with customer)
   - Set related_name='whatsapp_optin'

4. **Add field constraints**
   - Set unique=True (one opt-in per customer)
   - This prevents duplicate opt-in records
   - Enforced at database level

5. **Add database index**
   - db_index=True for performance
   - Customer lookups are frequent
   - Improves query speed

6. **Add help text**
   - Explain field purpose
   - Note one-to-one relationship
   - Mention cascade behavior

7. **Update Meta class**
   - Verify unique constraint on customer
   - Add composite indexes if needed
   - Consider index on (customer, opted_in_at)

### customer Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | ForeignKey | Link to Customer model |
| To | Customer | Target model |
| On Delete | CASCADE | Delete opt-in with customer |
| Related Name | whatsapp_optin | Reverse relationship |
| Unique | True | One opt-in per customer |
| DB Index | True | Fast lookups |

### Relationship Type

| Aspect | Configuration |
|--------|---------------|
| Type | One-to-One (via unique constraint) |
| Direction | WhatsAppOptIn → Customer |
| Cardinality | 1 WhatsAppOptIn : 1 Customer |
| Optional | No (customer required) |

### CASCADE Behavior

```
When Customer is deleted:

Customer record deleted
        ↓
CASCADE triggered
        ↓
WhatsAppOptIn record deleted automatically
        ↓
Consent history removed
        ↓
(Consider soft delete for audit)
```

### Reverse Relationship

```
Accessing from Customer:

customer = Customer.objects.get(id=123)
optin = customer.whatsapp_optin  # Access via related_name

Check opt-in status:
if hasattr(customer, 'whatsapp_optin'):
    if customer.whatsapp_optin.is_opted_in():
        send_message()
else:
    # No opt-in record exists yet
    create_optin_record()
```

### Unique Constraint

```sql
UNIQUE Constraint:

ALTER TABLE notifications_whatsapp_optin
ADD CONSTRAINT unique_customer_optin
UNIQUE (customer_id);

Prevents:
- Multiple opt-in records per customer
- Duplicate consent entries
- Data integrity issues
```

### Database Schema

```sql
Table: notifications_whatsapp_optin

Columns:
├── id (Primary Key, Auto Increment)
├── customer_id (Foreign Key, UNIQUE, NOT NULL)
│   References: customers_customer(id)
│   On Delete: CASCADE
│   Indexed: Yes
├── opted_in_at (TIMESTAMP, NULL)
├── opted_out_at (TIMESTAMP, NULL)
├── created_at (TIMESTAMP, NOT NULL)
└── updated_at (TIMESTAMP, NOT NULL)

Constraints:
├── PRIMARY KEY (id)
├── FOREIGN KEY (customer_id) REFERENCES customers_customer(id)
├── UNIQUE (customer_id)
└── INDEX (customer_id)
```

### Query Patterns

| Query | Implementation |
|-------|----------------|
| Get customer's opt-in | WhatsAppOptIn.objects.get(customer=customer) |
| Check if exists | WhatsAppOptIn.objects.filter(customer=customer).exists() |
| Get or create | WhatsAppOptIn.objects.get_or_create(customer=customer) |
| From customer | customer.whatsapp_optin |

### Multi-Tenancy Context

```
Tenant Isolation:

Tenant A → Customer A1 → WhatsAppOptIn A1
        → Customer A2 → WhatsAppOptIn A2

Tenant B → Customer B1 → WhatsAppOptIn B1
        → Customer B2 → WhatsAppOptIn B2

Each customer scoped to tenant via Customer model
WhatsAppOptIn inherits tenant context through customer FK
```

### Manager Methods (Optional)

```
Custom Manager for WhatsAppOptIn:

class WhatsAppOptInManager(models.Manager):
    def opted_in(self):
        return self.filter(
            opted_in_at__isnull=False
        ).exclude(
            opted_out_at__gt=F('opted_in_at')
        )
    
    def opted_out(self):
        return self.filter(
            opted_out_at__gt=F('opted_in_at')
        ) | self.filter(
            opted_in_at__isnull=True
        )
    
    def for_customer(self, customer):
        return self.get_or_create(customer=customer)
```

### Error Handling

| Error | Scenario | Handling |
|-------|----------|----------|
| Customer.DoesNotExist | Invalid customer ID | Return 404 |
| IntegrityError | Duplicate customer FK | Handle in code (get_or_create) |
| Customer is None | Missing customer | Validation error |

### Admin Display

```
Django Admin List:

| Customer | Phone | Status | Opted In At | Opted Out At |
|----------|-------|--------|-------------|--------------|
| John Doe | +94771234567 | ✓ Opted In | 2026-01-15 | - |
| Jane Smith | +94779876543 | ✗ Opted Out | 2026-01-10 | 2026-01-20 |
| Bob Wilson | +94775555555 | - Never | - | - |
```

### Expected Outcome
- customer ForeignKey added to model
- One-to-one relationship established via unique constraint
- CASCADE delete configured
- Reverse relationship available from Customer

### Verification Checklist
- [ ] customer field added to WhatsAppOptIn model
- [ ] ForeignKey to Customer model
- [ ] on_delete=CASCADE configured
- [ ] related_name='whatsapp_optin'
- [ ] unique=True constraint
- [ ] db_index=True for performance
- [ ] Help text added
- [ ] Relationship works both directions

---

## Task 14: Create opted_in_at Field

### Overview
Add the opted_in_at field to WhatsAppOptIn model. This timestamp field records when the customer explicitly consented to receive WhatsApp messages. It's critical for compliance audits and determining current opt-in status.

### Dependencies
- Task 12: Create WhatsAppOptIn Model
- Task 13: Create customer FK

### Instructions

1. **Open WhatsAppOptIn model file**
   - Navigate to `backend/apps/notifications/models/whatsapp_optin.py`
   - Locate the WhatsAppOptIn class definition
   - Add opted_in_at field in consent tracking section

2. **Define opted_in_at field**
   - Use DateTimeField field type
   - Set null=True, blank=True (optional - set when opt-in occurs)
   - Do NOT use auto_now or auto_now_add
   - Set manually when customer opts in

3. **Add database index**
   - Set db_index=True for filtering
   - Queries often filter by opt-in date
   - Improves performance for reporting

4. **Add help text**
   - Explain when field is set
   - Note significance for compliance
   - Mention timezone considerations

5. **Configure timezone handling**
   - Ensure timezone-aware datetime
   - Use timezone.now() when setting
   - Store in UTC, display in Asia/Colombo

6. **Update opt_in() method**
   - Set opted_in_at = timezone.now()
   - Clear opted_out_at (if re-opting in)
   - Record who performed action
   - Log timestamp for audit

7. **Add validation**
   - Validate opted_in_at not in future
   - Ensure timezone-aware datetime
   - Check logical consistency with opted_out_at

### opted_in_at Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DateTimeField | Timestamp of opt-in |
| Null | True | Optional (until customer opts in) |
| Blank | True | Not required in forms |
| DB Index | True | Fast filtering/sorting |
| Auto Now | False | Set manually |
| Auto Now Add | False | Set manually |

### Field Behavior

| State | opted_in_at Value | Meaning |
|-------|------------------|---------|
| Never Opted In | None (NULL) | Customer hasn't consented |
| Currently Opted In | Timestamp | Customer consented at this time |
| Opted Out Later | Timestamp | Shows when they originally opted in |
| Re-Opted In | Latest timestamp | Most recent opt-in time |

### Timezone Handling

```
Timezone Configuration:

1. Store in database: UTC
        ↓
2. Application timezone: Asia/Colombo
        ↓
3. Set field: timezone.now() (returns UTC)
        ↓
4. Display: Convert to Asia/Colombo
        ↓
5. Example: 
   Stored: 2026-01-15 08:30:00 UTC
   Display: 2026-01-15 14:00:00 Asia/Colombo
```

### Setting opted_in_at

```
When customer opts in:

def opt_in(self, user, ip_address=None):
    from django.utils import timezone
    
    self.opted_in_at = timezone.now()
    self.opted_in_by = user
    self.opted_out_at = None  # Clear if re-opting in
    self.ip_address = ip_address
    self.save()
    
    log_consent_change(self, 'opted_in')
```

### Query Patterns

| Query | Purpose | Implementation |
|-------|---------|----------------|
| Opted in customers | Find all with consent | filter(opted_in_at__isnull=False) |
| Opted in date range | Consent in period | filter(opted_in_at__range=[start, end]) |
| Recent opt-ins | Last 30 days | filter(opted_in_at__gte=thirty_days_ago) |
| Active opt-ins | Currently opted in | filter(opted_in_at__isnull=False, opted_out_at__isnull=True) |

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Not Future | opted_in_at <= now() | Cannot set opt-in date in future |
| Timezone Aware | has tzinfo | Must be timezone-aware datetime |
| Logical Order | opted_in_at < opted_out_at (if both set) | Opt-in must precede opt-out |

### Status Determination Logic

```
Determining Opt-In Status:

def is_opted_in(self):
    if self.opted_in_at is None:
        return False  # Never opted in
    
    if self.opted_out_at is None:
        return True  # Opted in, never opted out
    
    # Both timestamps exist, compare
    return self.opted_in_at > self.opted_out_at
```

### Database Index

```sql
CREATE INDEX idx_optin_opted_in_at 
ON notifications_whatsapp_optin(opted_in_at);

For combined queries:
CREATE INDEX idx_optin_status 
ON notifications_whatsapp_optin(opted_in_at, opted_out_at);
```

### Reporting Queries

| Report | Query |
|--------|-------|
| Total Opt-Ins | count(opted_in_at__isnull=False) |
| Opt-Ins This Month | filter(opted_in_at__month=this_month) |
| Opt-In Rate | (opt_ins / total_customers) * 100 |
| Average Time to Opt-In | avg(opted_in_at - customer.created_at) |

### Audit Trail Display

```
Admin History:

Customer: John Doe
Action: Opted In
Timestamp: 2026-01-15 14:00:00 Asia/Colombo
User: Admin User
IP: 192.168.1.100
```

### Date Range Filtering

```
Filter opt-ins by date range:

from datetime import timedelta
from django.utils import timezone

last_30_days = timezone.now() - timedelta(days=30)

recent_optins = WhatsAppOptIn.objects.filter(
    opted_in_at__gte=last_30_days
)
```

### Expected Outcome
- opted_in_at field added to model
- Timezone-aware datetime storage
- Database index for performance
- Set manually when customer opts in

### Verification Checklist
- [ ] opted_in_at field added to WhatsAppOptIn model
- [ ] DateTimeField with null=True, blank=True
- [ ] db_index=True for query performance
- [ ] No auto_now or auto_now_add
- [ ] Set manually in opt_in() method
- [ ] Timezone-aware datetime handling
- [ ] Validation for logical consistency
- [ ] Help text explains usage

---

## Task 15: Create opted_out_at Field

### Overview
Add the opted_out_at field to WhatsAppOptIn model. This timestamp records when the customer withdrew consent to receive WhatsApp messages. Along with opted_in_at, it provides complete consent history and determines current opt-in status.

### Dependencies
- Task 12: Create WhatsAppOptIn Model
- Task 14: Create opted_in_at Field

### Instructions

1. **Open WhatsAppOptIn model file**
   - Navigate to `backend/apps/notifications/models/whatsapp_optin.py`
   - Locate the WhatsAppOptIn class definition
   - Add opted_out_at field next to opted_in_at

2. **Define opted_out_at field**
   - Use DateTimeField field type
   - Set null=True, blank=True (optional - set when opt-out occurs)
   - Do NOT use auto_now or auto_now_add
   - Set manually when customer opts out

3. **Add database index**
   - Set db_index=True for filtering
   - Often queried with opted_in_at
   - Consider composite index

4. **Add help text**
   - Explain when field is set
   - Note significance for compliance
   - Mention can be cleared if customer re-opts in

5. **Update opt_out() method**
   - Set opted_out_at = timezone.now()
   - Keep opted_in_at (historical record)
   - Record who performed action
   - Log timestamp for audit

6. **Add validation**
   - Validate opted_out_at not in future
   - Ensure timezone-aware datetime
   - If both timestamps exist, opted_out_at should be > opted_in_at

7. **Update is_opted_in() logic**
   - Compare both timestamps
   - If opted_out_at > opted_in_at, customer is opted out
   - If opted_in_at > opted_out_at, customer is opted in
   - If only opted_in_at exists, customer is opted in

### opted_out_at Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DateTimeField | Timestamp of opt-out |
| Null | True | Optional (until customer opts out) |
| Blank | True | Not required in forms |
| DB Index | True | Fast filtering/sorting |
| Auto Now | False | Set manually |
| Auto Now Add | False | Set manually |

### Field Behavior States

| opted_in_at | opted_out_at | Status | Meaning |
|-------------|--------------|--------|---------|
| None | None | Never Opted In | Customer hasn't taken action |
| Timestamp | None | Opted In | Currently consented |
| Timestamp | Timestamp (newer) | Opted Out | Withdrew consent |
| Timestamp (newer) | Timestamp | Opted In | Re-opted in after opt-out |

### Status Determination Matrix

```
Status Logic:

┌─────────────────┬─────────────────┬──────────────┐
│ opted_in_at     │ opted_out_at    │ Status       │
├─────────────────┼─────────────────┼──────────────┤
│ NULL            │ NULL            │ Never Opted  │
│ 2026-01-15      │ NULL            │ Opted In     │
│ 2026-01-15      │ 2026-01-20      │ Opted Out    │
│ 2026-01-25      │ 2026-01-20      │ Opted In     │
└─────────────────┴─────────────────┴──────────────┘
```

### Setting opted_out_at

```
When customer opts out:

def opt_out(self, user, ip_address=None):
    from django.utils import timezone
    
    self.opted_out_at = timezone.now()
    self.opted_out_by = user
    # Keep opted_in_at for historical record
    self.ip_address = ip_address
    self.save()
    
    log_consent_change(self, 'opted_out')
```

### Complete Status Logic

```python
def is_opted_in(self):
    """
    Determine if customer is currently opted in.
    Returns True if opted in, False otherwise.
    """
    # Never opted in
    if self.opted_in_at is None:
        return False
    
    # Opted in, never opted out
    if self.opted_out_at is None:
        return True
    
    # Both exist, compare timestamps
    # Most recent action determines status
    return self.opted_in_at > self.opted_out_at


def is_opted_out(self):
    """
    Determine if customer is currently opted out.
    Returns True if opted out, False otherwise.
    """
    # Never took any action
    if self.opted_in_at is None and self.opted_out_at is None:
        return False  # Not opted out, just never opted in
    
    # Only opted out (unusual case)
    if self.opted_in_at is None and self.opted_out_at is not None:
        return True
    
    # Only opted in
    if self.opted_out_at is None:
        return False
    
    # Both exist, compare
    return self.opted_out_at > self.opted_in_at
```

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Not Future | opted_out_at <= now() | Cannot set opt-out date in future |
| Timezone Aware | has tzinfo | Must be timezone-aware datetime |
| Logical Order | If both exist, check chronology | Validate timestamp sequence |

### Query Patterns

| Query | Purpose | Implementation |
|-------|---------|----------------|
| Currently Opted In | Active consent | filter(opted_in_at__isnull=False, opted_out_at__isnull=True) \| filter(opted_in_at__gt=F('opted_out_at')) |
| Currently Opted Out | Withdrawn consent | filter(opted_out_at__gt=F('opted_in_at')) |
| Never Opted In | No action taken | filter(opted_in_at__isnull=True) |
| Opt-Out Date Range | Opt-outs in period | filter(opted_out_at__range=[start, end]) |

### Composite Index

```sql
CREATE INDEX idx_optin_timestamps 
ON notifications_whatsapp_optin(opted_in_at, opted_out_at);

Improves performance for queries checking status:
- WHERE opted_in_at > opted_out_at
- WHERE opted_in_at IS NOT NULL AND opted_out_at IS NULL
```

### Re-Opt-In Handling

```
Customer opts out, then opts back in:

Initial State:
├── opted_in_at: 2026-01-15 10:00:00
└── opted_out_at: NULL

After Opt-Out:
├── opted_in_at: 2026-01-15 10:00:00
└── opted_out_at: 2026-01-20 15:00:00
    Status: Opted Out

After Re-Opt-In:
├── opted_in_at: 2026-01-25 11:00:00  ← Updated
└── opted_out_at: 2026-01-20 15:00:00  ← Kept for history
    Status: Opted In (opted_in_at > opted_out_at)
```

### Admin Display

```
History View:

Customer: Jane Smith
Timeline:
├── 2026-01-15 10:00 - Opted In (by: Customer)
├── 2026-01-20 15:00 - Opted Out (by: Customer)
└── 2026-01-25 11:00 - Opted In (by: Customer)

Current Status: ✓ Opted In
```

### Reporting Metrics

| Metric | Calculation |
|--------|-------------|
| Opt-Out Rate | (count opted out / count opted in) * 100 |
| Opt-Out Reasons | Track in separate field/model |
| Time to Opt-Out | avg(opted_out_at - opted_in_at) |
| Re-Opt-In Rate | (count re-opted in / count opted out) * 100 |

### Compliance Requirements

| Requirement | Implementation |
|-------------|----------------|
| Record Opt-Out | Store exact timestamp |
| Honor Immediately | Check before every message |
| Audit Trail | Keep opted_in_at for history |
| Re-Permission | Allow opt-in again, update opted_in_at |

### Expected Outcome
- opted_out_at field added to model
- Complete status determination logic
- Historical record maintained
- Compliance with opt-out requirements

### Verification Checklist
- [ ] opted_out_at field added to WhatsAppOptIn model
- [ ] DateTimeField with null=True, blank=True
- [ ] db_index=True for query performance
- [ ] No auto_now or auto_now_add
- [ ] Set manually in opt_out() method
- [ ] Status logic compares both timestamps
- [ ] Validation for logical consistency
- [ ] Historical opt-in timestamp preserved

---

## Task 16: Create WhatsApp Migrations

### Overview
Generate and apply Django migrations for the WhatsAppConfig and WhatsAppOptIn models. Migrations create the database schema, indexes, and constraints required for WhatsApp functionality. This is the final step that makes all previous configuration changes active in the database.

### Dependencies
- Task 08: Create phone_number_id Field
- Task 09: Create access_token Field
- Task 10: Create is_enabled Field
- Task 11: Create daily_limit Field
- Task 15: Create opted_out_at Field
- All models finalized

### Instructions

1. **Prepare for migration generation**
   - Ensure all model changes saved
   - Verify no syntax errors in model files
   - Check imports are correct
   - Confirm django-fernet-fields installed

2. **Generate migrations**
   - Open terminal in backend directory
   - Run: `python manage.py makemigrations notifications`
   - Review generated migration file
   - Check for both WhatsAppConfig and WhatsAppOptIn

3. **Review migration file**
   - Open generated migration in `apps/notifications/migrations/`
   - Verify all fields present
   - Check field types correct
   - Verify indexes created
   - Confirm constraints applied

4. **Check migration dependencies**
   - Ensure migration depends on tenant migrations
   - Ensure migration depends on customer migrations
   - Verify dependency chain correct
   - Check for any circular dependencies

5. **Add data migration (if needed)**
   - If WhatsAppConfig already exists, add data migration
   - Encrypt existing access tokens
   - Set default values for new fields
   - Handle NULL values appropriately

6. **Test migration in development**
   - Run: `python manage.py migrate notifications --plan`
   - Review planned operations
   - Check for any warnings or errors
   - Verify SQL statements look correct

7. **Apply migrations**
   - Run: `python manage.py migrate notifications`
   - Monitor for errors or warnings
   - Verify tables created successfully
   - Check indexes applied

8. **Verify database schema**
   - Connect to database
   - Check tables exist
   - Verify columns and types
   - Confirm indexes created
   - Test constraints work

9. **Test model operations**
   - Create test WhatsAppConfig instance
   - Create test WhatsAppOptIn instance
   - Test field encryption/decryption
   - Verify foreign key relationships
   - Test unique constraints

10. **Document migration**
    - Add migration notes to documentation
    - Document any manual steps required
    - Note breaking changes (if any)
    - Update deployment guide

### Migration Generation

```
Generate migrations command:

python manage.py makemigrations notifications

Output:
Migrations for 'notifications':
  apps/notifications/migrations/0001_initial.py
    - Create model WhatsAppConfig
    - Create model WhatsAppOptIn
    - Add index whatsappconfig_idx_enabled
    - Add index whatsappoptin_idx_customer
```

### Expected Migration Contents

| Operation | Model | Details |
|-----------|-------|---------|
| CreateModel | WhatsAppConfig | All fields, Meta options |
| CreateModel | WhatsAppOptIn | All fields, Meta options |
| AddField | All fields | Types, constraints, defaults |
| AddIndex | Multiple | Performance indexes |
| AlterUniqueTogether | WhatsAppOptIn | customer unique constraint |

### Migration File Structure

```python
# Generated migration file structure:

from django.db import migrations, models
import django_fernet_fields.fields

class Migration(migrations.Migration):
    dependencies = [
        ('tenants', '0001_initial'),
        ('customers', '0001_initial'),
        ('notifications', 'previous_migration'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='WhatsAppConfig',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('tenant', models.ForeignKey(...)),
                ('phone_number_id', models.CharField(...)),
                ('access_token', django_fernet_fields.fields.EncryptedTextField(...)),
                ('is_enabled', models.BooleanField(default=False)),
                ('daily_limit', models.IntegerField(default=1000)),
                # ... other fields
            ],
            options={'db_table': 'notifications_whatsapp_config'},
        ),
        migrations.CreateModel(
            name='WhatsAppOptIn',
            # ... fields
        ),
        migrations.AddIndex(
            model_name='whatsappconfig',
            index=models.Index(fields=['is_enabled']),
        ),
        # ... more operations
    ]
```

### Database Tables Created

```
Tables:
├── notifications_whatsapp_config
│   ├── id (BIGINT, PRIMARY KEY)
│   ├── tenant_id (BIGINT, FOREIGN KEY, UNIQUE)
│   ├── phone_number_id (VARCHAR(20), INDEXED)
│   ├── access_token (TEXT, ENCRYPTED)
│   ├── is_enabled (BOOLEAN, INDEXED)
│   ├── daily_limit (INTEGER)
│   ├── created_at (TIMESTAMP)
│   └── updated_at (TIMESTAMP)
│
└── notifications_whatsapp_optin
    ├── id (BIGINT, PRIMARY KEY)
    ├── customer_id (BIGINT, FOREIGN KEY, UNIQUE)
    ├── opted_in_at (TIMESTAMP, INDEXED)
    ├── opted_out_at (TIMESTAMP, INDEXED)
    ├── opted_in_by_id (BIGINT, FOREIGN KEY, NULL)
    ├── opted_out_by_id (BIGINT, FOREIGN KEY, NULL)
    ├── created_at (TIMESTAMP)
    └── updated_at (TIMESTAMP)
```

### Indexes Created

| Table | Index Name | Columns | Type |
|-------|------------|---------|------|
| whatsapp_config | idx_phone_number_id | phone_number_id | Single |
| whatsapp_config | idx_is_enabled | is_enabled | Single |
| whatsapp_config | idx_tenant_unique | tenant_id | Unique |
| whatsapp_optin | idx_customer_unique | customer_id | Unique |
| whatsapp_optin | idx_opted_in_at | opted_in_at | Single |
| whatsapp_optin | idx_opted_out_at | opted_out_at | Single |
| whatsapp_optin | idx_timestamps | opted_in_at, opted_out_at | Composite |

### Migration Plan Review

```
Check migration plan:

python manage.py migrate notifications --plan

Output:
Planned operations:
notifications.0001_initial
  Create model WhatsAppConfig
  Create model WhatsAppOptIn
  Create index notifications_whatsapp_config_phone_number_id_abc123_idx
  Create index notifications_whatsapp_config_is_enabled_def456_idx
  Create constraint notifications_whatsapp_config_tenant_id_unique
  Create constraint notifications_whatsapp_optin_customer_id_unique
```

### Applying Migrations

```
Apply migrations:

python manage.py migrate notifications

Output:
Running migrations:
  Applying notifications.0001_initial... OK

Verify:
python manage.py showmigrations notifications

Output:
notifications
 [X] 0001_initial
```

### Post-Migration Verification

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Tables Exist | `\dt notifications_*` (PostgreSQL) | 2 tables listed |
| Indexes | `\di notifications_*` | Multiple indexes |
| Foreign Keys | `\d notifications_whatsapp_config` | Shows FK to tenant |
| Constraints | `\d notifications_whatsapp_optin` | Shows unique on customer |

### Testing After Migration

```
Test in Django shell:

python manage.py shell

>>> from apps.notifications.models import WhatsAppConfig, WhatsAppOptIn
>>> from apps.tenants.models import Tenant
>>> from apps.customers.models import Customer

# Test WhatsAppConfig
>>> tenant = Tenant.objects.first()
>>> config = WhatsAppConfig.objects.create(
...     tenant=tenant,
...     phone_number_id='123456789',
...     is_enabled=True,
...     daily_limit=1000
... )
>>> config.save()
>>> print(config)  # Should work

# Test WhatsAppOptIn
>>> customer = Customer.objects.first()
>>> optin = WhatsAppOptIn.objects.create(customer=customer)
>>> optin.opt_in(user=request.user)
>>> optin.is_opted_in()  # Should return True
```

### Rollback Procedure

```
If migration fails or needs rollback:

# Show current migrations
python manage.py showmigrations notifications

# Rollback to previous
python manage.py migrate notifications 0000_previous_migration

# Or rollback all notifications migrations
python manage.py migrate notifications zero

# WARNING: Rollback destroys data in affected tables
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|---------|
| Dependency Error | Missing dependency | Add to migration dependencies |
| Encryption Error | FERNET_KEYS not set | Set encryption key in settings |
| FK Constraint Fails | Referenced model missing | Run dependencies first |
| Duplicate Column | Previous migration incomplete | Rollback and regenerate |
| Index Already Exists | Name collision | Rename index in migration |

### Data Migration Example

```
If existing data needs migration:

# Create empty migration
python manage.py makemigrations notifications --empty --name encrypt_tokens

# Edit migration file
def encrypt_existing_tokens(apps, schema_editor):
    WhatsAppConfig = apps.get_model('notifications', 'WhatsAppConfig')
    for config in WhatsAppConfig.objects.all():
        if config.old_token_field:
            config.access_token = config.old_token_field
            config.save()

class Migration(migrations.Migration):
    dependencies = [
        ('notifications', '0001_initial'),
    ]
    
    operations = [
        migrations.RunPython(encrypt_existing_tokens),
    ]
```

### Expected Outcome
- Migrations generated for both models
- Database schema created successfully
- Indexes and constraints applied
- Models functional and tested

### Verification Checklist
- [ ] Migrations generated with `makemigrations`
- [ ] Migration file reviewed for correctness
- [ ] Dependencies checked and correct
- [ ] Migration plan reviewed with `--plan`
- [ ] Migrations applied successfully
- [ ] Tables exist in database
- [ ] Indexes created properly
- [ ] Constraints working (unique, FK)
- [ ] Model operations tested in shell
- [ ] Documentation updated with migration notes

---

## Summary

This document completed the WhatsApp configuration setup by adding the remaining critical fields to WhatsAppConfig (encrypted access_token, is_enabled toggle, daily_limit), creating the WhatsAppOptIn model for customer consent tracking with full audit trail, and generating migrations to apply all changes to the database. The WhatsApp Business API integration is now fully configured at the infrastructure level.

### Completed Tasks
1. ✓ Added access_token field with encryption for secure token storage
2. ✓ Added is_enabled field for per-tenant WhatsApp toggle
3. ✓ Added daily_limit field for rate limiting control
4. ✓ Created WhatsAppOptIn model for consent management
5. ✓ Added customer FK for consent tracking
6. ✓ Added opted_in_at field for opt-in timestamp
7. ✓ Added opted_out_at field for opt-out timestamp
8. ✓ Generated and applied database migrations

### Infrastructure Complete

```
WhatsApp Configuration Infrastructure:

✓ Constants (API version, URLs)
✓ Settings (tokens, IDs)
✓ WhatsAppConfig Model
  ├── Tenant relationship
  ├── Phone number ID
  ├── Encrypted access token
  ├── Enabled toggle
  └── Daily message limit
✓ WhatsAppOptIn Model
  ├── Customer relationship
  ├── Opt-in timestamp
  ├── Opt-out timestamp
  └── Consent audit trail
✓ Database Migrations
  ├── Tables created
  ├── Indexes applied
  └── Constraints enforced
```

### Next Steps
Proceed to **Group-B: API Client & Auth** to implement the WhatsApp API client, authentication handler, and message sending functionality that will utilize the configuration infrastructure created in this group.

---

**Document Status:** Complete  
**Last Updated:** January 31, 2026  
**Next Review:** Phase 09 Completion
