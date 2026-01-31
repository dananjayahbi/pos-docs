# Tasks 01-10: SMS Settings and Configuration Model

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** A - SMS Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-11-16_ABC-Factory-Migration.md](02_Tasks-11-16_ABC-Factory-Migration.md)

---

## Document Overview

This document covers the foundational SMS configuration setup, including constants for SMS status tracking, Django settings for default provider and sender ID, and the SMSConfig model for per-tenant SMS gateway configuration with provider selection, encrypted API keys, sender identification, enable/disable toggle, and monthly usage limits.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create SMS Constants | Low | 15 min |
| 02 | Create SMS Settings | Low | 20 min |
| 03 | Create DEFAULT_SMS_PROVIDER | Low | 10 min |
| 04 | Create SMS_SENDER_ID | Low | 10 min |
| 05 | Create SMSConfig Model | Medium | 35 min |
| 06 | Create provider Field | Low | 10 min |
| 07 | Create api_key Field | Medium | 25 min |
| 08 | Create sender_id Field | Low | 10 min |
| 09 | Create is_enabled Field | Low | 10 min |
| 10 | Create monthly_limit Field | Low | 10 min |

---

## Task 01: Create SMS Constants

### Overview
Create a constants module for SMS-related values. This establishes standardized status codes for tracking SMS message lifecycle from pending to delivered/failed states. These constants ensure consistent status tracking across all SMS providers (Dialog, Notify.lk, TextIt) and enable unified reporting and monitoring.

### Dependencies
- SubPhase-11 (WhatsApp Business API) should be complete
- Django project structure established
- notifications app created

### Instructions

1. **Navigate to the notifications app**
   - Go to `backend/apps/notifications/` directory
   - This is where SMS-related modules will be organized

2. **Create the constants module**
   - Create a new file named `constants.py`
   - This file will contain all SMS-related constants
   - Organize constants by category for maintainability

3. **Define SMS status constants**
   - Create constant for PENDING status (message queued)
   - Create constant for SENT status (sent to provider)
   - Create constant for DELIVERED status (confirmed delivery)
   - Create constant for FAILED status (delivery failed)

4. **Follow naming conventions**
   - Use UPPER_SNAKE_CASE for constant names
   - Prefix with SMS_STATUS_ for clarity
   - Use string values matching Django choices pattern

5. **Add documentation comments**
   - Document the purpose of each constant
   - Explain when each status is used in the SMS lifecycle
   - Note which providers use which statuses

6. **Organize for extensibility**
   - Group related constants together
   - Leave room for additional SMS-related constants
   - Consider future needs (priority levels, message types)

### SMS Status Flow

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│ PENDING  │────▶│   SENT   │────▶│  DELIVERED   │     │ SUCCESS  │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
     │                  │                                      ▲
     │                  │                                      │
     │                  └─────────────┐                        │
     │                                ▼                        │
     └──────────────────────▶  ┌──────────┐                   │
                               │  FAILED  │───────────────────┘
                               └──────────┘
```

### Constant Purpose

| Constant | Value | Usage | Provider Support |
|----------|-------|-------|------------------|
| SMS_STATUS_PENDING | 'pending' | Initial state when queued | All providers |
| SMS_STATUS_SENT | 'sent' | Sent to provider API | All providers |
| SMS_STATUS_DELIVERED | 'delivered' | Confirmed receipt | Dialog, Notify.lk |
| SMS_STATUS_FAILED | 'failed' | Delivery failure | All providers |

### Status Transitions

| From | To | Trigger |
|------|----|---------| 
| None | PENDING | Message created in queue |
| PENDING | SENT | Successfully sent to provider API |
| SENT | DELIVERED | Provider delivery confirmation |
| PENDING/SENT | FAILED | Provider error or timeout |

### Expected Outcome
- Constants module created with SMS status codes
- Clear, descriptive constant names
- Proper documentation for each constant
- Foundation for SMS status tracking

### Verification Checklist
- [ ] `backend/apps/notifications/constants.py` file created
- [ ] All four SMS status constants defined
- [ ] Constant names follow UPPER_SNAKE_CASE convention
- [ ] String values use lowercase for Django compatibility
- [ ] Documentation comments explain each constant

---

## Task 02: Create SMS Settings File

### Overview
Create a dedicated settings module for SMS-related configuration. This file will contain SMS-specific settings separate from the main Django settings, providing better organization and making it easier to manage SMS configuration across different environments (development, staging, production).

### Dependencies
- Task 01: Create SMS Constants

### Instructions

1. **Navigate to backend settings directory**
   - Go to `backend/config/settings/` directory
   - This is where environment-specific settings are organized

2. **Create SMS settings module**
   - Create a new file named `sms.py`
   - This file will contain only SMS-related settings
   - Keep settings isolated from other configuration

3. **Add file header documentation**
   - Add module docstring explaining purpose
   - Document that settings are for SMS gateway configuration
   - Note which settings are required vs optional

4. **Import required dependencies**
   - Import the constants from Task 01
   - Import any Django settings utilities
   - Import environment variable helpers

5. **Prepare for setting definitions**
   - Organize settings logically (provider, sender, limits)
   - Use comments to group related settings
   - Follow Django settings conventions

6. **Plan for environment overrides**
   - Design settings to be overridable via environment variables
   - Use sensible defaults for development
   - Document production recommendations

### Settings File Structure

```
┌─────────────────────────────────────┐
│      SMS Settings Module            │
├─────────────────────────────────────┤
│  • File Header & Documentation      │
│  • Import Statements                │
│  • Provider Configuration           │
│  • Sender Configuration             │
│  • Limit Configuration              │
│  • API Endpoint URLs                │
└─────────────────────────────────────┘
```

### Settings Organization

| Section | Purpose | Settings Included |
|---------|---------|-------------------|
| Provider Config | Default provider selection | DEFAULT_SMS_PROVIDER |
| Sender Config | Default sender identification | SMS_SENDER_ID |
| Limit Config | Usage restrictions | (Future tasks) |
| API URLs | Provider endpoints | (Future tasks) |

### Settings Module Purpose

| Benefit | Description |
|---------|-------------|
| Organization | Separates SMS config from main settings |
| Maintainability | Single location for SMS configuration |
| Environment Flexibility | Easy to override per environment |
| Documentation | Clear purpose and usage guidelines |

### Expected Outcome
- Dedicated SMS settings module created
- Clear file organization and documentation
- Ready to receive specific setting definitions
- Follows Django settings best practices

### Verification Checklist
- [ ] `backend/config/settings/sms.py` file created
- [ ] File includes comprehensive docstring
- [ ] Proper import statements included
- [ ] File structure ready for setting definitions
- [ ] Follows Django settings conventions

---

## Task 03: Create DEFAULT_SMS_PROVIDER Setting

### Overview
Define the DEFAULT_SMS_PROVIDER setting that specifies which SMS gateway provider should be used system-wide when tenants haven't configured their own provider. This setting supports three Sri Lankan SMS providers: Dialog, Notify.lk, and TextIt, allowing flexibility in choosing the default gateway.

### Dependencies
- Task 02: Create SMS Settings File

### Instructions

1. **Open the SMS settings file**
   - Navigate to `backend/config/settings/sms.py`
   - Locate the provider configuration section

2. **Define the DEFAULT_SMS_PROVIDER setting**
   - Create a setting named DEFAULT_SMS_PROVIDER
   - Set the default value to one of the supported providers
   - Use string value matching provider identifiers

3. **Document provider choices**
   - Add inline comment listing valid provider options
   - Document: 'dialog', 'notifylk', 'textit'
   - Explain when this default is used

4. **Add environment variable support**
   - Allow override via environment variable
   - Use pattern: os.getenv('DEFAULT_SMS_PROVIDER', 'dialog')
   - Document environment variable name

5. **Document provider selection criteria**
   - Add comments explaining provider differences
   - Note pricing considerations
   - Document feature availability per provider

6. **Add validation notes**
   - Document that provider must match factory implementations
   - Note case sensitivity requirements
   - Reference provider implementation tasks

### Provider Options

| Provider | Value | Use Case | Features |
|----------|-------|----------|----------|
| Dialog | 'dialog' | High volume, enterprise | Delivery reports, bulk SMS |
| Notify.lk | 'notifylk' | Mid-size businesses | Good pricing, reliable |
| TextIt | 'textit' | Small businesses, testing | Simple API, affordable |

### Provider Selection Decision Tree

```
Need high volume + enterprise features?
    │
    ├─ Yes ──▶ Use 'dialog'
    │
    └─ No
        │
        Need mid-range pricing + reliability?
            │
            ├─ Yes ──▶ Use 'notifylk'
            │
            └─ No ──▶ Use 'textit' (simple, affordable)
```

### Setting Configuration

| Aspect | Value | Notes |
|--------|-------|-------|
| Setting Name | DEFAULT_SMS_PROVIDER | All caps, underscores |
| Default Value | 'dialog' | Recommended for production |
| Type | String | Lowercase provider identifier |
| Environment Override | DEFAULT_SMS_PROVIDER | Same name as setting |

### Setting Usage Context

| Scenario | Behavior |
|----------|----------|
| New tenant | Uses DEFAULT_SMS_PROVIDER initially |
| No tenant config | Falls back to DEFAULT_SMS_PROVIDER |
| Tenant configured | Ignores default, uses tenant's choice |
| Invalid provider | Validation error, falls back to default |

### Expected Outcome
- DEFAULT_SMS_PROVIDER setting defined with sensible default
- Environment variable override support configured
- Comprehensive documentation for provider options
- Clear guidance on when setting is used

### Verification Checklist
- [ ] DEFAULT_SMS_PROVIDER setting defined in sms.py
- [ ] Default value set to valid provider ('dialog', 'notifylk', or 'textit')
- [ ] Environment variable override support added
- [ ] Provider options documented in comments
- [ ] Usage scenarios explained

---

## Task 04: Create SMS_SENDER_ID Setting

### Overview
Define the SMS_SENDER_ID setting that specifies the default sender identification displayed to SMS recipients. This setting is crucial for brand recognition and compliance with SMS gateway requirements. The sender ID must be 11 characters or less and should represent the business name (default: 'LCC' for LankaCommerce Cloud).

### Dependencies
- Task 02: Create SMS Settings File

### Instructions

1. **Open the SMS settings file**
   - Navigate to `backend/config/settings/sms.py`
   - Locate the sender configuration section

2. **Define the SMS_SENDER_ID setting**
   - Create a setting named SMS_SENDER_ID
   - Set the default value to 'LCC'
   - Use string value for the sender identifier

3. **Add length constraint documentation**
   - Document maximum length of 11 characters
   - Explain this is an SMS gateway industry standard
   - Note that longer IDs will be truncated or rejected

4. **Add environment variable support**
   - Allow override via SMS_SENDER_ID environment variable
   - Use pattern: os.getenv('SMS_SENDER_ID', 'LCC')
   - Document environment variable name

5. **Document sender ID guidelines**
   - Explain sender ID should represent business brand
   - Note alphanumeric characters only (no special chars)
   - Document provider-specific restrictions

6. **Add validation recommendations**
   - Document need for validation in model layer
   - Note that validation should check length
   - Explain character restrictions per provider

### Sender ID Requirements

| Requirement | Specification | Reason |
|-------------|---------------|---------|
| Max Length | 11 characters | SMS gateway standard |
| Characters | Alphanumeric only | Provider restrictions |
| Case | Can be mixed | Displayed as configured |
| Spaces | Generally avoided | Provider compatibility |

### Sender ID Best Practices

| Practice | Recommendation | Example |
|----------|----------------|---------|
| Brand Name | Use recognizable business name | 'LankaShop' |
| Abbreviation | Use initials for long names | 'LCC' for LankaCommerce Cloud |
| Consistency | Same ID across all messages | Always 'LCC' |
| Avoid Special Chars | Alphanumeric only | 'ABC123' not 'ABC-123' |

### Provider-Specific Sender ID Rules

```
┌────────────────────────────────────────────┐
│          Provider Requirements             │
├────────────┬───────────────────────────────┤
│  Dialog    │  Max 11 chars, A-Z, 0-9      │
│            │  Registration required        │
├────────────┼───────────────────────────────┤
│ Notify.lk  │  Max 11 chars, alphanumeric  │
│            │  Pre-approval recommended     │
├────────────┼───────────────────────────────┤
│  TextIt    │  Max 11 chars, alphanumeric  │
│            │  Flexible, fewer restrictions │
└────────────┴───────────────────────────────┘
```

### Sender ID Examples

| Business Type | Sender ID | Length | Valid? |
|---------------|-----------|--------|--------|
| LankaCommerce Cloud | 'LCC' | 3 | ✓ Yes |
| Lanka Shop | 'LankaShop' | 9 | ✓ Yes |
| ABC Trading Company | 'ABCTrading' | 10 | ✓ Yes |
| XYZ Corporation Ltd | 'XYZCorpLtd' | 10 | ✓ Yes |
| Super Long Business Name | 'SuperLongBz' | 11 | ✓ Yes (truncated) |
| Test Company | 'Test-Company' | 12 | ✗ No (special char + too long) |

### Setting Configuration

| Aspect | Value | Notes |
|--------|-------|-------|
| Setting Name | SMS_SENDER_ID | All caps, underscores |
| Default Value | 'LCC' | Short, recognizable |
| Type | String | Alphanumeric characters |
| Max Length | 11 characters | SMS industry standard |
| Environment Override | SMS_SENDER_ID | Same name as setting |

### Expected Outcome
- SMS_SENDER_ID setting defined with appropriate default
- Length constraint documented clearly
- Environment variable override support configured
- Guidelines for choosing sender IDs documented

### Verification Checklist
- [ ] SMS_SENDER_ID setting defined in sms.py
- [ ] Default value set to 'LCC'
- [ ] Maximum length constraint documented
- [ ] Environment variable override support added
- [ ] Sender ID guidelines and best practices documented
- [ ] Provider-specific restrictions noted

---

## Task 05: Create SMSConfig Model

### Overview
Create the SMSConfig model that stores per-tenant SMS gateway configuration. This model enables each tenant in the multi-tenant SaaS system to configure their own SMS provider, API credentials, sender ID, and usage limits. The model establishes the foundation for tenant-specific SMS functionality while maintaining data isolation through django-tenants.

### Dependencies
- Task 02: Create SMS Settings File
- Django tenants infrastructure is established
- Base model mixins are available

### Instructions

1. **Navigate to notifications models directory**
   - Go to `backend/apps/notifications/models/` directory
   - Create the directory if it doesn't exist
   - This directory will contain all notification-related models

2. **Create the SMSConfig model file**
   - Create a new file named `sms_config.py`
   - This file will contain the SMSConfig model definition
   - Keep it separate from other notification models

3. **Import required dependencies**
   - Import Django model classes and field types
   - Import tenant model from django_tenants schema
   - Import base model mixins (TimestampedModel, etc.)
   - Import constants from Task 01

4. **Define the SMSConfig model class**
   - Create class inheriting from appropriate base models
   - Name the class SMSConfig for clarity
   - Add comprehensive docstring explaining purpose

5. **Define the tenant foreign key relationship**
   - Create ForeignKey to tenant model
   - Set on_delete to CASCADE (delete config when tenant deleted)
   - Set related_name to 'sms_config' for reverse access
   - Add help_text documenting the relationship

6. **Plan for additional fields**
   - Prepare structure for provider field (Task 06)
   - Prepare structure for encrypted API key (Task 07)
   - Prepare structure for sender ID (Task 08)
   - Prepare structure for enabled flag (Task 09)
   - Prepare structure for monthly limit (Task 10)

7. **Add model metadata**
   - Define Meta class with appropriate options
   - Set verbose_name to "SMS Configuration"
   - Set verbose_name_plural to "SMS Configurations"
   - Define ordering if needed

8. **Add string representation**
   - Implement __str__ method
   - Return meaningful representation (e.g., tenant name + provider)
   - Make it useful for admin interface

9. **Add model documentation**
   - Document model purpose in docstring
   - Explain multi-tenant considerations
   - Note security considerations for API keys
   - Reference related models and views

### Model Structure Overview

```
┌─────────────────────────────────────────┐
│          SMSConfig Model                │
├─────────────────────────────────────────┤
│  Fields:                                │
│  • tenant (FK to Tenant)                │
│  • provider (CharField)                 │
│  • api_key (EncryptedField)            │
│  • sender_id (CharField)               │
│  • is_enabled (BooleanField)           │
│  • monthly_limit (IntegerField)        │
│  • created_at (DateTimeField)          │
│  • updated_at (DateTimeField)          │
├─────────────────────────────────────────┤
│  Methods:                               │
│  • __str__()                           │
│  • clean()                             │
│  • save()                              │
└─────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         ┌──────────────┐
│   Tenant     │1      1 │  SMSConfig   │
│              │◀────────│              │
│ • name       │         │ • provider   │
│ • schema     │         │ • api_key    │
└──────────────┘         └──────────────┘
                                │
                                │ (uses)
                                ▼
                         ┌──────────────┐
                         │  SMS Message │
                         │              │
                         │ • to         │
                         │ • message    │
                         └──────────────┘
```

### Model Purpose

| Purpose | Description |
|---------|-------------|
| Per-Tenant Config | Each tenant has own SMS gateway settings |
| Provider Selection | Tenant chooses Dialog, Notify.lk, or TextIt |
| Credential Storage | Securely stores encrypted API keys |
| Usage Control | Tracks and limits monthly SMS usage |
| Sender Identity | Customizes sender ID per tenant |

### Multi-Tenant Considerations

| Consideration | Implementation |
|---------------|----------------|
| Data Isolation | One config per tenant via FK |
| Schema Isolation | Model stored in public schema |
| Access Control | Filter by tenant in views |
| Migration Safety | Careful with tenant-aware migrations |

### Security Considerations

| Aspect | Requirement |
|--------|-------------|
| API Key Storage | Must be encrypted (Fernet) |
| Access Control | Only tenant admins can modify |
| Audit Logging | Log config changes |
| Key Rotation | Support updating API keys |

### Model Field Planning

| Field | Type | Purpose | Task |
|-------|------|---------|------|
| tenant | ForeignKey | Links config to tenant | Task 05 |
| provider | CharField | Dialog/Notify.lk/TextIt | Task 06 |
| api_key | EncryptedField | Provider API credential | Task 07 |
| sender_id | CharField | Sender identification | Task 08 |
| is_enabled | BooleanField | Enable/disable SMS | Task 09 |
| monthly_limit | IntegerField | Usage limit | Task 10 |

### Expected Outcome
- SMSConfig model class created with proper structure
- Tenant foreign key relationship established
- Model metadata and documentation complete
- Foundation ready for field definitions
- Proper inheritance from base models

### Verification Checklist
- [ ] `backend/apps/notifications/models/sms_config.py` file created
- [ ] SMSConfig model class defined
- [ ] Tenant ForeignKey relationship created
- [ ] Model Meta class configured
- [ ] __str__ method implemented
- [ ] Comprehensive docstring added
- [ ] Proper imports included
- [ ] Inherits from appropriate base models

---

## Task 06: Create provider Field

### Overview
Add the provider field to the SMSConfig model. This CharField stores the selected SMS gateway provider for each tenant, with choices restricted to the three supported Sri Lankan providers: Dialog, Notify.lk, and TextIt. The field uses Django's choices parameter to ensure data integrity and provide a user-friendly admin interface.

### Dependencies
- Task 05: Create SMSConfig Model

### Instructions

1. **Open the SMSConfig model file**
   - Navigate to `backend/apps/notifications/models/sms_config.py`
   - Locate the SMSConfig model class definition

2. **Define provider choices tuple**
   - Create a tuple named PROVIDER_CHOICES above the model
   - Define three choice tuples: ('dialog', 'Dialog'), ('notifylk', 'Notify.lk'), ('textit', 'TextIt')
   - First value is stored in database, second is human-readable

3. **Add the provider field**
   - Create a CharField named 'provider'
   - Set max_length to 20 characters
   - Set choices parameter to PROVIDER_CHOICES

4. **Configure field constraints**
   - Set blank=False to make field required
   - Set null=False to enforce database constraint
   - Add default value from DEFAULT_SMS_PROVIDER setting

5. **Add field documentation**
   - Set help_text explaining provider options
   - Document which providers are supported
   - Note that provider cannot be changed after messages sent

6. **Add field validation**
   - Provider choice is automatically validated by Django
   - Consider adding custom validation in clean() method
   - Validate that provider has required configuration

7. **Update model string representation**
   - Modify __str__ method to include provider
   - Format as "TenantName - Provider"
   - Make it useful for admin dropdown selections

### Provider Choices Structure

| Database Value | Display Value | Description |
|----------------|---------------|-------------|
| 'dialog' | 'Dialog' | Dialog Axiata SMS gateway |
| 'notifylk' | 'Notify.lk' | Notify.lk SMS service |
| 'textit' | 'TextIt' | TextIt SMS platform |

### Provider Selection Flow

```
┌─────────────────────────────────────────┐
│      Tenant Creates SMS Config          │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Select Provider│
         └───────┬───────┘
                 │
        ┌────────┴────────┬────────────┐
        ▼                 ▼            ▼
   ┌─────────┐      ┌──────────┐  ┌────────┐
   │ Dialog  │      │Notify.lk │  │ TextIt │
   └─────────┘      └──────────┘  └────────┘
        │                 │            │
        └────────┬────────┴────────────┘
                 ▼
        ┌──────────────────┐
        │  Save Selection  │
        │  to provider     │
        │  field           │
        └──────────────────┘
```

### Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Store string choice |
| max_length | 20 | Accommodate provider names |
| choices | PROVIDER_CHOICES | Restrict to valid providers |
| blank | False | Field is required |
| null | False | Database NOT NULL constraint |
| default | DEFAULT_SMS_PROVIDER | Use system default initially |

### Field Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| Required | Cannot be blank | "Provider is required" |
| Valid Choice | Must be in PROVIDER_CHOICES | "Invalid provider selected" |
| Immutable (optional) | Cannot change after use | "Cannot change provider" |

### Provider Field Usage

| Context | Usage |
|---------|-------|
| Model Creation | Defaults to DEFAULT_SMS_PROVIDER |
| Admin Interface | Dropdown with provider choices |
| API Serialization | Returns string value ('dialog') |
| Provider Factory | Used to instantiate correct provider class |

### Expected Outcome
- Provider field added to SMSConfig model
- PROVIDER_CHOICES tuple defined with three options
- Field properly configured with constraints
- Default value set from settings
- Help text and validation in place

### Verification Checklist
- [ ] PROVIDER_CHOICES tuple defined with three providers
- [ ] provider CharField added to SMSConfig model
- [ ] max_length set to 20 characters
- [ ] choices parameter set to PROVIDER_CHOICES
- [ ] blank and null set to False
- [ ] default value references DEFAULT_SMS_PROVIDER setting
- [ ] help_text added explaining provider options
- [ ] __str__ method updated to include provider

---

## Task 07: Create api_key Field

### Overview
Add the api_key field to the SMSConfig model using encrypted storage to securely store SMS provider API credentials. This field uses django-fernet-fields to encrypt sensitive API keys at rest, ensuring that even if the database is compromised, the credentials remain protected. The encryption is transparent to application code while providing strong security.

### Dependencies
- Task 05: Create SMSConfig Model
- django-fernet-fields package is installed

### Instructions

1. **Install django-fernet-fields package**
   - Add django-fernet-fields to requirements.txt
   - Run pip install to install the package
   - Verify installation in virtual environment

2. **Configure Fernet encryption key**
   - Generate a Fernet key for encryption
   - Store key in environment variable FERNET_KEY
   - Document key generation process
   - Add key to .env.example (with placeholder)

3. **Configure Django settings for Fernet**
   - Import Fernet configuration in settings
   - Set FERNET_KEYS in Django settings
   - Use environment variable for key value
   - Add validation for key presence

4. **Import EncryptedTextField**
   - Add import: from fernet_fields import EncryptedTextField
   - Ensure package is available
   - Check compatibility with Django version

5. **Add the api_key field**
   - Create an EncryptedTextField named 'api_key'
   - Set blank=False to require API key
   - Set null=False for database constraint
   - Add comprehensive help_text

6. **Add field documentation**
   - Document that field is encrypted at rest
   - Explain Fernet encryption mechanism
   - Note that key must be kept secure
   - Warn about key rotation procedures

7. **Add validation considerations**
   - Validate API key format per provider
   - Consider adding custom validation in clean()
   - Validate key before saving to database
   - Test encryption/decryption functionality

8. **Add security documentation**
   - Document encryption key management
   - Explain backup procedures for encrypted data
   - Note performance implications of encryption
   - Document key rotation strategy

### Encryption Flow

```
┌─────────────────────────────────────────┐
│     API Key Submission                  │
│     (plaintext from admin/API)          │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Fernet Encrypt │
         │ (automatic)    │
         └───────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Store Encrypted  │
        │  in Database      │
        └────────┬───────────┘
                 │
                 ▼
        ┌──────────────────┐
        │   Retrieve from   │
        │   Database        │
        └────────┬───────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Fernet Decrypt │
         │ (automatic)    │
         └───────┬───────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│     Plaintext API Key                   │
│     (used to call provider API)         │
└─────────────────────────────────────────┘
```

### Fernet Encryption Specifications

| Aspect | Specification |
|--------|---------------|
| Algorithm | AES-128-CBC with HMAC |
| Key Size | 32 bytes (URL-safe base64) |
| Encryption | Automatic on save |
| Decryption | Automatic on access |
| Performance | Minimal overhead |

### Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | EncryptedTextField | Encrypted string storage |
| blank | False | Field is required |
| null | False | Database NOT NULL constraint |
| help_text | Documentation | Explain encryption |

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Key Storage | Environment variable only |
| Key Backup | Secure offline storage |
| Key Rotation | Planned procedure |
| Access Control | Restricted to admins |
| Audit Logging | Log key access |

### Fernet Key Management

```
┌──────────────────────────────────────┐
│      Generate Fernet Key             │
│  (cryptography.fernet.Fernet.        │
│   generate_key())                    │
└────────────────┬─────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Store in      │
         │ .env file     │
         │ FERNET_KEY=...│
         └───────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Load in Django   │
        │ settings         │
        └────────┬───────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Used by Fernet   │
        │ Fields           │
        └──────────────────┘
```

### API Key Format by Provider

| Provider | Key Format | Example Length |
|----------|------------|----------------|
| Dialog | Alphanumeric string | 32-64 chars |
| Notify.lk | API token with prefix | 40-50 chars |
| TextIt | UUID-style token | 36 chars |

### Encryption Performance

| Operation | Performance Impact |
|-----------|-------------------|
| Save (encrypt) | ~1-2ms overhead |
| Retrieve (decrypt) | ~1-2ms overhead |
| Bulk Operations | Minimal impact |
| Database Size | Slightly larger |

### Expected Outcome
- django-fernet-fields package installed and configured
- Fernet encryption key generated and stored securely
- api_key field added with encrypted storage
- Comprehensive documentation for key management
- Transparent encryption/decryption functionality

### Verification Checklist
- [ ] django-fernet-fields added to requirements.txt
- [ ] Fernet key generated and stored in environment
- [ ] FERNET_KEYS configured in Django settings
- [ ] EncryptedTextField imported from fernet_fields
- [ ] api_key field added to SMSConfig model
- [ ] blank and null set to False
- [ ] help_text documents encryption
- [ ] Key management procedures documented
- [ ] Encryption tested with sample API key

---

## Task 08: Create sender_id Field

### Overview
Add the sender_id field to the SMSConfig model to store the tenant-specific sender identification that appears on SMS messages. This CharField allows each tenant to customize their sender ID while enforcing the 11-character maximum length required by SMS gateways. The field provides flexibility for brand customization while maintaining compliance with SMS industry standards.

### Dependencies
- Task 05: Create SMSConfig Model

### Instructions

1. **Open the SMSConfig model file**
   - Navigate to `backend/apps/notifications/models/sms_config.py`
   - Locate the SMSConfig model class definition

2. **Add the sender_id field**
   - Create a CharField named 'sender_id'
   - Set max_length to 11 characters
   - This enforces SMS gateway industry standard

3. **Configure field constraints**
   - Set blank=True to make field optional
   - Set null=False with default value
   - Add default value from SMS_SENDER_ID setting

4. **Add field documentation**
   - Set help_text explaining sender ID purpose
   - Document 11-character limit
   - Note alphanumeric character requirements
   - Explain how sender ID appears to recipients

5. **Add field validation**
   - Plan custom validation in clean() method
   - Validate alphanumeric characters only
   - Check length constraints
   - Validate against provider-specific rules

6. **Add validation helper method**
   - Consider creating validate_sender_id() method
   - Check for invalid characters
   - Ensure compatibility with all providers
   - Provide clear validation error messages

7. **Update model documentation**
   - Document sender ID best practices
   - Explain provider registration requirements
   - Note that some providers require pre-approval
   - Reference SMS_SENDER_ID setting

### Sender ID Validation Rules

| Rule | Requirement | Example |
|------|-------------|---------|
| Max Length | 11 characters | 'LankaShop' ✓ 'VeryLongName' ✗ |
| Characters | Alphanumeric only | 'ABC123' ✓ 'ABC-123' ✗ |
| Spaces | Generally avoided | 'LankaShop' ✓ 'Lanka Shop' ~ |
| Case | Mixed allowed | 'LankaShop' ✓ |
| Numbers | Allowed | 'Shop123' ✓ |

### Sender ID Validation Flow

```
┌─────────────────────────────────────┐
│   Tenant Inputs Sender ID           │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Check Length  │
         │ (<= 11 chars) │
         └───────┬───────┘
                 │
         ┌───────┴───────┐
         │ Valid │ Invalid│
         ▼       ▼        
    ┌─────┐   ┌──────────┐
    │Next │   │ Error:   │
    └──┬──┘   │ Too long │
       │      └──────────┘
       ▼
┌──────────────┐
│Check Chars   │
│(Alphanumeric)│
└──────┬───────┘
       │
  ┌────┴────┐
  │Valid│Invalid│
  ▼     ▼
┌────┐ ┌──────────┐
│Save│ │Error:    │
└────┘ │Bad chars │
       └──────────┘
```

### Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | CharField | Store string value |
| max_length | 11 | SMS gateway limit |
| blank | True | Optional (uses default) |
| null | False | Always has value |
| default | SMS_SENDER_ID setting | System default |
| help_text | Documentation | Usage guidance |

### Provider Sender ID Requirements

| Provider | Registration | Approval Time | Restrictions |
|----------|--------------|---------------|--------------|
| Dialog | Required | 1-2 business days | Must match registered business |
| Notify.lk | Recommended | Same day | Flexible, pre-approval preferred |
| TextIt | Optional | Instant | Very flexible |

### Sender ID Customization by Tenant Type

| Tenant Type | Recommended Sender ID | Example |
|-------------|----------------------|---------|
| Retail Business | Business name | 'ShopMart' |
| Service Provider | Service name | 'TechSupport' |
| Restaurant | Restaurant name | 'CafeXYZ' |
| E-commerce | Brand name | 'OnlineStore' |
| Corporate | Company abbreviation | 'ABCCorp' |

### Sender ID Impact on Delivery

| Aspect | Impact |
|--------|--------|
| Brand Recognition | Higher with custom sender ID |
| Trust Level | Increased with known sender |
| Spam Filters | Custom IDs may reduce spam flagging |
| Delivery Rate | Generally unchanged |

### Expected Outcome
- sender_id field added to SMSConfig model
- 11-character maximum length enforced
- Default value from SMS_SENDER_ID setting
- Validation rules planned for alphanumeric check
- Comprehensive documentation for usage

### Verification Checklist
- [ ] sender_id CharField added to SMSConfig model
- [ ] max_length set to 11 characters
- [ ] blank set to True, null set to False
- [ ] default value references SMS_SENDER_ID setting
- [ ] help_text added explaining sender ID purpose
- [ ] Validation considerations documented
- [ ] Provider requirements documented

---

## Task 09: Create is_enabled Field

### Overview
Add the is_enabled field to the SMSConfig model to provide a simple on/off toggle for SMS functionality per tenant. This BooleanField allows administrators to quickly enable or disable SMS sending without deleting the configuration, making it easy to temporarily suspend SMS services for maintenance, cost control, or compliance reasons.

### Dependencies
- Task 05: Create SMSConfig Model

### Instructions

1. **Open the SMSConfig model file**
   - Navigate to `backend/apps/notifications/models/sms_config.py`
   - Locate the SMSConfig model class definition

2. **Add the is_enabled field**
   - Create a BooleanField named 'is_enabled'
   - Set default to False for safety
   - This requires explicit enabling by tenant admin

3. **Configure field constraints**
   - Set blank=False (always has value)
   - No null needed for BooleanField
   - Default=False for conservative approach

4. **Add field documentation**
   - Set help_text explaining toggle functionality
   - Document that False blocks all SMS sending
   - Note that configuration is preserved when disabled
   - Explain use cases for disabling

5. **Add field usage documentation**
   - Document impact on SMS sending logic
   - Explain that disabled config blocks all messages
   - Note that messages are not queued when disabled
   - Document admin interface behavior

6. **Plan integration with SMS sending logic**
   - SMS service should check is_enabled before sending
   - Raise appropriate error if disabled
   - Log attempts to send with disabled config
   - Return clear error message to user

7. **Add validation considerations**
   - Consider warning user when disabling active config
   - Check for pending messages when disabling
   - Provide clear feedback about disabled state
   - Allow re-enabling without data loss

### Enable/Disable Flow

```
┌─────────────────────────────────────┐
│   Tenant SMS Config                 │
│   is_enabled = False (default)      │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Admin Enables │
         │ is_enabled =  │
         │ True          │
         └───────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │  SMS Sending     │
        │  Active          │
        └────────┬───────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Admin Disables│
         │ is_enabled =  │
         │ False         │
         └───────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │  SMS Blocked     │
        │  Config Preserved│
        └──────────────────┘
```

### Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | BooleanField | True/False toggle |
| default | False | Disabled by default (safe) |
| blank | False | Always has value |
| help_text | Documentation | Explain toggle |

### SMS Sending Logic with is_enabled Check

```
┌─────────────────────────────────────┐
│   Request to Send SMS               │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Get Tenant    │
         │ SMSConfig     │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │ Check         │
         │ is_enabled    │
         └───┬───────┬───┘
             │       │
     False   │       │   True
             ▼       ▼
    ┌──────────┐  ┌──────────┐
    │ Raise    │  │ Proceed  │
    │ Error    │  │ with Send│
    └──────────┘  └──────────┘
```

### Use Cases for Disabling SMS

| Use Case | Scenario | Action |
|----------|----------|--------|
| Cost Control | Approaching monthly limit | Disable until next month |
| Maintenance | Provider maintenance window | Temporarily disable |
| Testing | Setting up configuration | Keep disabled during setup |
| Compliance | Regulatory requirements | Disable when needed |
| Billing Issues | Payment problems | Disable until resolved |

### is_enabled States and Behaviors

| State | SMS Sending | Configuration | Admin Interface |
|-------|-------------|---------------|-----------------|
| False (default) | Blocked | Preserved | Show "Disabled" badge |
| True | Active | Preserved | Show "Active" badge |

### Impact on SMS Operations

| Operation | Behavior When Disabled |
|-----------|------------------------|
| Send SMS | Raises error, blocks sending |
| Check Balance | Still allowed (config access) |
| Update Config | Still allowed |
| View Messages | Still allowed (historical) |

### Error Handling

| Error Scenario | Error Message | HTTP Status |
|----------------|---------------|-------------|
| Send when disabled | "SMS is disabled for this tenant" | 403 Forbidden |
| No config found | "SMS not configured" | 404 Not Found |
| Invalid config | "Invalid SMS configuration" | 400 Bad Request |

### Expected Outcome
- is_enabled BooleanField added to SMSConfig model
- Default value set to False for safety
- Clear documentation of toggle functionality
- Integration points planned for SMS sending logic

### Verification Checklist
- [ ] is_enabled BooleanField added to SMSConfig model
- [ ] default set to False
- [ ] blank set to False
- [ ] help_text added explaining toggle purpose
- [ ] Use cases documented
- [ ] Integration with SMS sending logic planned
- [ ] Error handling scenarios documented

---

## Task 10: Create monthly_limit Field

### Overview
Add the monthly_limit field to the SMSConfig model to implement usage controls for SMS sending. This IntegerField sets the maximum number of SMS messages a tenant can send per month, helping control costs, prevent abuse, and enable tiered service plans. The field provides built-in safeguards against unexpected high usage while allowing flexible limits per tenant.

### Dependencies
- Task 05: Create SMSConfig Model

### Instructions

1. **Open the SMSConfig model file**
   - Navigate to `backend/apps/notifications/models/sms_config.py`
   - Locate the SMSConfig model class definition

2. **Add the monthly_limit field**
   - Create an IntegerField named 'monthly_limit'
   - Set default to 1000 messages
   - This provides reasonable limit for typical business

3. **Configure field constraints**
   - Set blank=False to ensure value always exists
   - Set null=False for database constraint
   - Add validators for minimum value (greater than 0)

4. **Add field documentation**
   - Set help_text explaining monthly limit purpose
   - Document that limit resets monthly
   - Note consequences of reaching limit
   - Explain how to increase limit

5. **Add field validation**
   - Validate that limit is positive integer
   - Consider maximum reasonable limit (e.g., 100,000)
   - Add custom validation in clean() method
   - Provide clear validation error messages

6. **Plan usage tracking integration**
   - Document need for current month usage counter
   - Plan integration with SMS sending logic
   - Design monthly reset mechanism
   - Consider creating separate usage tracking model

7. **Plan limit enforcement logic**
   - Check usage before sending SMS
   - Block sending when limit reached
   - Send notifications approaching limit
   - Log limit-related events

8. **Document tiered limits**
   - Suggest limits for different subscription tiers
   - Document how to set custom limits
   - Explain unlimited option (very high number)
   - Note cost implications of high limits

### Monthly Limit Architecture

```
┌─────────────────────────────────────┐
│   SMSConfig Model                   │
│   monthly_limit = 1000              │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Usage Tracker   │
        │  current_month   │
        │  messages_sent   │
        └────────┬───────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Before Send   │
         │ Check Limit   │
         └───┬───────┬───┘
             │       │
      Under  │       │   At/Over
             ▼       ▼
    ┌──────────┐  ┌──────────┐
    │ Allow    │  │ Block    │
    │ Send     │  │ Send     │
    └──────────┘  └──────────┘
```

### Field Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| field_type | IntegerField | Store numeric limit |
| default | 1000 | Reasonable default |
| blank | False | Always has value |
| null | False | Database constraint |
| validators | MinValueValidator(1) | Must be positive |
| help_text | Documentation | Explain limit |

### Suggested Monthly Limits by Tier

| Subscription Tier | Monthly Limit | Target User | Use Case |
|-------------------|---------------|-------------|----------|
| Free Trial | 50 | Testing | Evaluation |
| Basic | 500 | Small business | Order notifications |
| Professional | 2,500 | Medium business | Marketing + notifications |
| Enterprise | 10,000 | Large business | High volume |
| Unlimited | 1,000,000 | Very large | No practical limit |

### Limit Enforcement Flow

```
┌─────────────────────────────────────┐
│   Request to Send SMS               │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Get monthly   │
         │ usage count   │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │ Compare to    │
         │ monthly_limit │
         └───┬───────┬───┘
             │       │
     Under   │       │   At/Over
             ▼       ▼
    ┌──────────┐  ┌──────────┐
    │ Increment│  │ Raise    │
    │ & Send   │  │ Error    │
    └──────────┘  └──────────┘
                      │
                      ▼
              ┌──────────────┐
              │ Notify Admin │
              │ Limit Reached│
              └──────────────┘
```

### Usage Tracking Components

| Component | Purpose | Location |
|-----------|---------|----------|
| monthly_limit | Maximum allowed | SMSConfig model |
| current_usage | Messages sent this month | Usage tracking model |
| reset_date | Next reset date | Calculated field |
| warning_threshold | Alert at 80% | Configuration |

### Limit Warning Thresholds

| Threshold | Action | Recipient |
|-----------|--------|-----------|
| 80% | Email warning | Tenant admin |
| 90% | Urgent warning | Tenant admin |
| 100% | Block + notify | Tenant admin |
| Exceeded attempts | Log & alert | System admin |

### Monthly Reset Logic

```
┌─────────────────────────────────────┐
│   End of Month (Cron Job)           │
└────────────────┬────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ For each      │
         │ tenant config │
         └───────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Reset usage     │
        │  count to 0      │
        └────────┬───────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Set reset_date  │
        │  to next month   │
        └────────┬───────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Send usage      │
        │  summary email   │
        └──────────────────┘
```

### Error Handling for Limits

| Error Scenario | Error Message | HTTP Status | Action |
|----------------|---------------|-------------|--------|
| Limit reached | "Monthly SMS limit reached" | 429 Too Many Requests | Block send |
| Invalid limit | "Limit must be positive" | 400 Bad Request | Reject save |
| Negative limit | "Limit cannot be negative" | 400 Bad Request | Reject save |

### Cost Control Benefits

| Benefit | Description |
|---------|-------------|
| Predictable Costs | Known maximum monthly spend |
| Abuse Prevention | Prevents runaway usage |
| Budget Management | Aligns with business budgets |
| Tiered Pricing | Enables subscription tiers |
| Resource Planning | Providers can plan capacity |

### Expected Outcome
- monthly_limit IntegerField added to SMSConfig model
- Default value of 1000 messages configured
- Validation ensures positive integers only
- Foundation for usage tracking and enforcement
- Tiered limit suggestions documented

### Verification Checklist
- [ ] monthly_limit IntegerField added to SMSConfig model
- [ ] default set to 1000
- [ ] blank and null set to False
- [ ] MinValueValidator(1) added to ensure positive values
- [ ] help_text explains monthly limit purpose
- [ ] Tiered limit suggestions documented
- [ ] Integration with usage tracking planned
- [ ] Monthly reset logic designed
- [ ] Warning threshold strategy defined
- [ ] Error handling scenarios documented

---

## Summary and Next Steps

### Completed in This Document

This document covered the foundational SMS gateway configuration setup:

1. **SMS Constants** - Standardized status codes for SMS lifecycle tracking
2. **SMS Settings File** - Dedicated settings module for SMS configuration
3. **DEFAULT_SMS_PROVIDER** - System-wide default provider selection
4. **SMS_SENDER_ID** - Default sender identification setting
5. **SMSConfig Model** - Per-tenant SMS configuration model structure
6. **provider Field** - Provider selection with three Sri Lankan options
7. **api_key Field** - Encrypted API credential storage using Fernet
8. **sender_id Field** - Tenant-specific sender identification
9. **is_enabled Field** - SMS functionality toggle switch
10. **monthly_limit Field** - Usage control and cost management

### Overall Progress

```
Group A: SMS Configuration
├─ Document 01 (Tasks 01-10) ✓ [THIS DOCUMENT]
│   ├─ Constants & Settings ✓
│   └─ SMSConfig Model with Fields ✓
└─ Document 02 (Tasks 11-16) → [NEXT]
    ├─ SMSProvider ABC
    ├─ Abstract Methods
    ├─ SMSProviderFactory
    └─ Migrations
```

### Key Outcomes Achieved

| Component | Status | Purpose |
|-----------|--------|---------|
| SMS Constants | ✓ Complete | Status tracking across providers |
| SMS Settings | ✓ Complete | Centralized configuration |
| SMSConfig Model | ✓ Complete | Per-tenant SMS configuration |
| Security | ✓ Complete | Encrypted API key storage |
| Usage Controls | ✓ Complete | Monthly limits and toggles |

### Next Document

**Document 02: Tasks 11-16 - ABC, Factory, and Migration**

This document will cover:
- Task 11: Create SMSProvider abstract base class
- Task 12: Create send abstract method
- Task 13: Create check_balance abstract method  
- Task 14: Create get_status abstract method
- Task 15: Create SMSProviderFactory
- Task 16: Generate and run SMS migrations

### Integration Points

The SMSConfig model created in this document will be used by:

- **Group B:** Provider implementations (Dialog, Notify.lk, TextIt)
- **Group C:** SMS message model and queue management
- **Group D:** SMS sending service and API endpoints
- **Group E:** Admin interface for SMS configuration
- **Group F:** Testing and validation

### Database Schema Created

```sql
-- SMSConfig Model (simplified representation)
CREATE TABLE notifications_smsconfig (
    id INTEGER PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants_tenant(id),
    provider VARCHAR(20) NOT NULL DEFAULT 'dialog',
    api_key TEXT NOT NULL,  -- Encrypted
    sender_id VARCHAR(11) NOT NULL DEFAULT 'LCC',
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    monthly_limit INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### Documentation Standards Maintained

- ✓ Clear task structure with overview, dependencies, instructions
- ✓ Purpose tables explaining rationale
- ✓ Diagrams illustrating flows and relationships
- ✓ Expected outcomes and verification checklists
- ✓ No code snippets (instructions only)
- ✓ Under 1000 lines
- ✓ Comprehensive but concise

---

**End of Document 01**

Continue to [02_Tasks-11-16_ABC-Factory-Migration.md](02_Tasks-11-16_ABC-Factory-Migration.md) →
