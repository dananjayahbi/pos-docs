# Tasks 01-08: WhatsApp Settings and Config Model

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** A - WhatsApp Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_OptIn-Migration.md](02_Tasks-09-16_OptIn-Migration.md)

---

## Document Overview

This document covers the foundational setup of WhatsApp Business API configuration for LankaCommerce Cloud. It establishes constants for the Meta WhatsApp Cloud API, creates Django settings for WhatsApp integration, and implements the WhatsAppConfig model for tenant-specific configuration. This setup enables multi-tenant WhatsApp messaging capabilities with proper security and configuration management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create WhatsApp Constants | Low | 15 min |
| 02 | Create WhatsApp Settings | Low | 20 min |
| 03 | Create WHATSAPP_ACCESS_TOKEN | Low | 15 min |
| 04 | Create WHATSAPP_PHONE_ID | Low | 10 min |
| 05 | Create WHATSAPP_BUSINESS_ID | Low | 10 min |
| 06 | Create WHATSAPP_VERIFY_TOKEN | Low | 15 min |
| 07 | Create WhatsAppConfig Model | Medium | 30 min |
| 08 | Create phone_number_id Field | Low | 10 min |

---

## Task 01: Create WhatsApp Constants

### Overview
Create a constants module for WhatsApp Business API integration. This module centralizes all WhatsApp-related constants including API version, base URLs, and timeout configurations. Centralizing these values ensures consistency across the application and simplifies version upgrades.

### Dependencies
- SubPhase-10 (SMS Integration) must be complete
- Backend project structure established
- Notifications app created

### Instructions

1. **Navigate to notifications app**
   - Go to `backend/apps/notifications/` directory
   - This is the home for all notification-related code
   - WhatsApp is one of the notification channels

2. **Create constants.py file**
   - Create new file named `constants.py`
   - This file will contain all WhatsApp-specific constants
   - Organize constants by category (API, timeouts, limits)

3. **Define API version constant**
   - Set `WHATSAPP_API_VERSION` constant
   - Current version: `v18.0` (as of 2026)
   - Use this for API endpoint construction
   - Plan for future version updates

4. **Define base URL constant**
   - Set `WHATSAPP_API_BASE_URL` constant
   - Value: `https://graph.facebook.com/`
   - This is Meta's Graph API base URL
   - All WhatsApp API calls go through this endpoint

5. **Create endpoint template constants**
   - Define template for message endpoint
   - Template format: `{base_url}{version}/{phone_id}/messages`
   - Use format strings for dynamic construction

6. **Add timeout constants**
   - Define connection timeout (default: 10 seconds)
   - Define read timeout (default: 30 seconds)
   - These prevent hanging requests to Meta's API

7. **Add rate limit constants**
   - Define messaging tier limits (free tier, standard, etc.)
   - Document Meta's rate limiting structure
   - Include default daily message limits

8. **Add message type constants**
   - Define message types: text, template, media
   - Define media types: image, video, document, audio
   - These ensure consistent message type references

### WhatsApp API Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| WHATSAPP_API_VERSION | v18.0 | API version for all calls |
| WHATSAPP_API_BASE_URL | https://graph.facebook.com/ | Base URL for API |
| CONNECTION_TIMEOUT | 10 | Connection timeout in seconds |
| READ_TIMEOUT | 30 | Response read timeout in seconds |

### API Endpoint Structure

```
Full Endpoint Construction:
{WHATSAPP_API_BASE_URL}{WHATSAPP_API_VERSION}/{phone_number_id}/messages

Example:
https://graph.facebook.com/v18.0/123456789/messages
```

### Message Type Constants

| Constant | Value | Use Case |
|----------|-------|----------|
| MESSAGE_TYPE_TEXT | text | Simple text messages |
| MESSAGE_TYPE_TEMPLATE | template | Pre-approved templates |
| MESSAGE_TYPE_IMAGE | image | Image attachments |
| MESSAGE_TYPE_VIDEO | video | Video attachments |
| MESSAGE_TYPE_DOCUMENT | document | PDF, Word files |
| MESSAGE_TYPE_AUDIO | audio | Voice messages |

### Rate Limiting Tiers

| Tier | Daily Limit | Requirements |
|------|-------------|--------------|
| Development | 1,000 | Initial setup |
| Standard | 10,000 | Phone verification |
| Standard Plus | 100,000 | Business verification |

### Expected Outcome
- Constants module created with all WhatsApp values
- API version and base URL defined
- Timeout and rate limit constants established
- Message type constants for consistency

### Verification Checklist
- [ ] `backend/apps/notifications/constants.py` file created
- [ ] WHATSAPP_API_VERSION constant defined
- [ ] WHATSAPP_API_BASE_URL constant defined
- [ ] Timeout constants defined
- [ ] Message type constants defined
- [ ] Rate limit constants documented

---

## Task 02: Create WhatsApp Settings

### Overview
Create a dedicated settings module for WhatsApp configuration within the Django settings structure. This module follows Django's best practice of separating settings by functionality and provides a clean namespace for all WhatsApp-related configuration values.

### Dependencies
- Task 01: Create WhatsApp Constants

### Instructions

1. **Navigate to settings directory**
   - Go to `backend/config/settings/` directory
   - This directory contains modular Django settings
   - Each integration has its own settings file

2. **Create whatsapp.py settings file**
   - Create new file named `whatsapp.py`
   - This file contains all WhatsApp-specific settings
   - Keeps settings organized and maintainable

3. **Import required modules**
   - Import `os` for environment variable access
   - Import constants from `apps.notifications.constants`
   - Import any required utility functions

4. **Add file documentation**
   - Add docstring explaining file purpose
   - Document that this is for WhatsApp Business API
   - Note that settings are loaded from environment variables
   - Include security warnings for sensitive values

5. **Create settings structure**
   - Group settings by category
   - Authentication settings section
   - Configuration settings section
   - Feature flags section
   - Default values section

6. **Import settings into main settings**
   - Open `backend/config/settings/__init__.py` or base settings
   - Import WhatsApp settings module
   - Ensure settings are loaded in correct order

7. **Add settings documentation**
   - Document each setting's purpose
   - Specify environment variable names
   - Note required vs optional settings
   - Include example values (sanitized)

### Settings File Structure

```
WhatsApp Settings Module Organization:
├── File Header (docstring, imports)
├── API Configuration
│   ├── Access token
│   ├── Phone number ID
│   └── Business account ID
├── Webhook Configuration
│   └── Verify token
├── Feature Flags
│   └── Enable/disable WhatsApp
└── Default Values
    └── Message limits, timeouts
```

### Settings Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| API Configuration | Connection to WhatsApp API | Access token, phone ID |
| Webhook Configuration | Webhook verification | Verify token |
| Feature Flags | Enable/disable features | Is enabled globally |
| Default Values | Fallback values | Daily limits, timeouts |

### Environment Variable Naming

| Setting Type | Naming Convention | Example |
|--------------|-------------------|---------|
| API Credentials | WHATSAPP_{NAME} | WHATSAPP_ACCESS_TOKEN |
| Configuration | WHATSAPP_{NAME} | WHATSAPP_PHONE_ID |
| Feature Flags | WHATSAPP_ENABLE_{FEATURE} | WHATSAPP_ENABLE_TEMPLATES |

### Settings Loading Order

```
1. Load base Django settings
2. Load database settings
3. Load cache settings
4. Load email settings
5. Load WhatsApp settings ← New
6. Load environment-specific overrides
```

### Security Considerations

| Concern | Implementation |
|---------|----------------|
| Secret Storage | Use environment variables, never hardcode |
| Access Control | Restrict settings file permissions |
| Version Control | Add .env to .gitignore |
| Documentation | Never commit example values with real tokens |

### Expected Outcome
- WhatsApp settings module created and organized
- Settings grouped by category
- Environment variable pattern established
- Settings imported into main configuration

### Verification Checklist
- [ ] `backend/config/settings/whatsapp.py` file created
- [ ] File docstring explains purpose
- [ ] Settings organized by category
- [ ] Environment variable naming consistent
- [ ] Settings imported in main settings file
- [ ] Security best practices followed

---

## Task 03: Create WHATSAPP_ACCESS_TOKEN

### Overview
Configure the WHATSAPP_ACCESS_TOKEN setting that stores the Meta access token for authenticating API requests. This is the most critical security credential for WhatsApp integration, used in the Authorization header of every API call to Meta's WhatsApp Business API.

### Dependencies
- Task 02: Create WhatsApp Settings

### Instructions

1. **Add setting to whatsapp.py**
   - Open `backend/config/settings/whatsapp.py`
   - Add WHATSAPP_ACCESS_TOKEN setting
   - Load value from environment variable

2. **Define environment variable name**
   - Environment variable: `WHATSAPP_ACCESS_TOKEN`
   - This matches Django's naming conventions
   - Clear and descriptive naming

3. **Implement secure loading**
   - Use `os.environ.get()` for loading
   - Do NOT provide default value (must be explicit)
   - Raise error if missing in production
   - Allow None in development for testing

4. **Add validation logic**
   - Check that token is not empty string
   - Verify token format (if possible)
   - Log warning if token appears invalid

5. **Document token requirements**
   - Token type: Long-lived access token
   - Where to obtain: Meta Business Manager
   - Rotation policy: Rotate every 90 days
   - Permissions required: whatsapp_business_messaging

6. **Add token to .env.example**
   - Open `.env.example` file
   - Add WHATSAPP_ACCESS_TOKEN with placeholder
   - Include comment explaining where to obtain
   - Note that this is a sensitive credential

7. **Configure token storage**
   - Token should never be committed to git
   - Store in environment variables or secrets manager
   - In production, use secrets management service
   - Document rotation procedure

### Access Token Details

| Property | Value |
|----------|-------|
| Setting Name | WHATSAPP_ACCESS_TOKEN |
| Environment Variable | WHATSAPP_ACCESS_TOKEN |
| Required | Yes (in production) |
| Type | String (bearer token) |
| Sensitivity | Critical - Never expose |
| Rotation | Every 90 days recommended |

### Token Obtaining Process

```
Step 1: Access Meta Business Manager
        ↓
Step 2: Navigate to WhatsApp Business Account
        ↓
Step 3: Go to API Setup section
        ↓
Step 4: Generate or retrieve access token
        ↓
Step 5: Save token securely
        ↓
Step 6: Add to environment variables
```

### Token Format

| Component | Description |
|-----------|-------------|
| Type | Bearer token |
| Format | Long alphanumeric string |
| Length | Typically 200+ characters |
| Prefix | Usually starts with "EAA" or "EAAA" |

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Storage | Environment variables or secrets manager |
| Access | Restrict to backend services only |
| Rotation | Rotate every 90 days |
| Logging | Never log token values |
| Version Control | Never commit tokens |
| Transmission | Always use HTTPS |

### Token Usage

```
API Request Authorization Header:
Authorization: Bearer {WHATSAPP_ACCESS_TOKEN}

Example Flow:
1. Load token from environment
2. Validate token exists
3. Include in request header
4. Make API call to Meta
```

### Environment Variable Setup

| Environment | Storage Method |
|-------------|----------------|
| Development | .env file (not committed) |
| Staging | CI/CD secrets or vault |
| Production | Secrets manager (AWS, Azure, etc.) |

### Expected Outcome
- WHATSAPP_ACCESS_TOKEN setting configured
- Secure loading from environment variables
- Validation and error handling implemented
- Documentation and examples provided

### Verification Checklist
- [ ] WHATSAPP_ACCESS_TOKEN setting defined in whatsapp.py
- [ ] Environment variable loading implemented
- [ ] No default value provided (security)
- [ ] Token added to .env.example
- [ ] Documentation explains where to obtain token
- [ ] Security warnings documented

---

## Task 04: Create WHATSAPP_PHONE_ID

### Overview
Configure the WHATSAPP_PHONE_ID setting that stores the phone number ID from Meta. This ID represents the WhatsApp Business phone number and is used in API endpoint construction. Each WhatsApp Business Account can have multiple phone numbers, each with a unique ID.

### Dependencies
- Task 02: Create WhatsApp Settings

### Instructions

1. **Add setting to whatsapp.py**
   - Open `backend/config/settings/whatsapp.py`
   - Add WHATSAPP_PHONE_ID setting
   - Load from environment variable

2. **Define environment variable**
   - Environment variable name: `WHATSAPP_PHONE_ID`
   - This is different from the actual phone number
   - Phone ID is used in API calls, not the phone number itself

3. **Implement phone ID loading**
   - Use `os.environ.get()` for loading
   - Provide empty string as default for development
   - In production, require explicit value

4. **Add validation**
   - Check that phone ID is numeric string
   - Verify length is reasonable (typically 15-16 digits)
   - Log warning if phone ID appears invalid

5. **Document phone ID vs phone number**
   - Phone ID: Meta's internal identifier
   - Phone Number: Actual WhatsApp number (+94...)
   - Phone ID is used in API endpoints
   - Phone number is used for display

6. **Add to environment files**
   - Add WHATSAPP_PHONE_ID to .env.example
   - Include comment explaining the difference
   - Provide example format (not real ID)

7. **Document retrieval process**
   - Where to find: Meta Business Manager
   - Navigate to WhatsApp Business Account
   - Found in API Setup or Dashboard
   - Copy phone number ID (not display number)

### Phone ID Configuration

| Property | Value |
|----------|-------|
| Setting Name | WHATSAPP_PHONE_ID |
| Environment Variable | WHATSAPP_PHONE_ID |
| Required | Yes (for sending messages) |
| Type | Numeric string |
| Example Format | 123456789012345 |

### Phone ID vs Phone Number

| Aspect | Phone ID | Phone Number |
|--------|----------|--------------|
| Purpose | API identifier | Display & dialing |
| Format | Numeric string (15-16 digits) | +94 XX XXX XXXX |
| Usage | API endpoints | User interface |
| Source | Meta dashboard | Verified number |
| Example | 123456789012345 | +94 77 123 4567 |

### API Endpoint Usage

```
Message Send Endpoint:
https://graph.facebook.com/v18.0/{phone_number_id}/messages

Example:
https://graph.facebook.com/v18.0/123456789012345/messages

Note: Use phone_number_id, NOT the actual phone number
```

### Phone ID Retrieval Steps

```
1. Log into Meta Business Manager
        ↓
2. Select WhatsApp Business Account
        ↓
3. Navigate to API Setup or Overview
        ↓
4. Locate "Phone number ID" field
        ↓
5. Copy the numeric ID value
        ↓
6. Add to environment variables
```

### Multi-Phone Support

| Scenario | Implementation |
|----------|----------------|
| Single Phone | Store global phone ID in settings |
| Multiple Phones | Store per-tenant in WhatsAppConfig |
| Default Phone | Global setting as fallback |
| Tenant Override | Tenant-specific phone ID in database |

### Validation Rules

| Rule | Check | Error Handling |
|------|-------|----------------|
| Not Empty | phone_id != "" | Raise error in production |
| Numeric | phone_id.isdigit() | Log warning |
| Length | 15-16 characters | Log warning |
| Valid Format | Matches Meta pattern | Optional validation |

### Expected Outcome
- WHATSAPP_PHONE_ID setting configured
- Environment variable loading implemented
- Validation for numeric format
- Documentation explains difference from phone number

### Verification Checklist
- [ ] WHATSAPP_PHONE_ID setting defined in whatsapp.py
- [ ] Environment variable loading implemented
- [ ] Validation for numeric string format
- [ ] Setting added to .env.example
- [ ] Documentation explains phone ID vs phone number
- [ ] Retrieval process documented

---

## Task 05: Create WHATSAPP_BUSINESS_ID

### Overview
Configure the WHATSAPP_BUSINESS_ID setting that stores the WhatsApp Business Account ID from Meta. This ID represents the business account and is used for certain API operations, particularly for retrieving account-level information and managing business settings.

### Dependencies
- Task 02: Create WhatsApp Settings

### Instructions

1. **Add setting to whatsapp.py**
   - Open `backend/config/settings/whatsapp.py`
   - Add WHATSAPP_BUSINESS_ID setting
   - Load from environment variable

2. **Define environment variable**
   - Environment variable name: `WHATSAPP_BUSINESS_ID`
   - This represents the business account
   - Different from phone ID and phone number

3. **Implement business ID loading**
   - Use `os.environ.get()` for loading
   - Provide empty string default for development
   - Require explicit value in production

4. **Add validation logic**
   - Verify business ID is numeric string
   - Check reasonable length (typically 15-17 digits)
   - Log warning if format appears incorrect

5. **Document business ID purpose**
   - Used for account-level API calls
   - Required for business profile operations
   - Links phone numbers to business entity
   - Manages business verification status

6. **Add to environment configuration**
   - Add WHATSAPP_BUSINESS_ID to .env.example
   - Include comment explaining purpose
   - Provide example format

7. **Document retrieval location**
   - Found in Meta Business Manager
   - WhatsApp Business Account dashboard
   - Listed in account settings or overview
   - Same for all phone numbers under account

### Business ID Configuration

| Property | Value |
|----------|-------|
| Setting Name | WHATSAPP_BUSINESS_ID |
| Environment Variable | WHATSAPP_BUSINESS_ID |
| Required | Yes (for business operations) |
| Type | Numeric string |
| Example Format | 12345678901234567 |
| Scope | Account-level (spans all phone numbers) |

### ID Hierarchy in WhatsApp API

```
WhatsApp Business Account (Business ID)
        └── Phone Number 1 (Phone ID 1)
                └── Messages
                └── Templates
        └── Phone Number 2 (Phone ID 2)
                └── Messages
                └── Templates
```

### Business ID vs Phone ID

| Aspect | Business ID | Phone ID |
|--------|-------------|----------|
| Level | Account | Phone number |
| Quantity | One per business | Multiple per business |
| Usage | Account operations | Messaging operations |
| API Calls | Business profile, settings | Send messages, templates |
| Example | 12345678901234567 | 123456789012345 |

### Business ID Use Cases

| Operation | Requires Business ID | Endpoint Example |
|-----------|---------------------|------------------|
| Get Business Profile | Yes | /{business_id}/whatsapp_business_profile |
| List Phone Numbers | Yes | /{business_id}/phone_numbers |
| Manage Message Templates | No (uses phone ID) | /{phone_id}/message_templates |
| Send Messages | No (uses phone ID) | /{phone_id}/messages |

### Business ID Retrieval

```
Step 1: Access Meta Business Manager
        ↓
Step 2: Select your WhatsApp Business Account
        ↓
Step 3: View account settings or dashboard
        ↓
Step 4: Locate "WhatsApp Business Account ID"
        ↓
Step 5: Copy numeric ID value
        ↓
Step 6: Add to environment variables
```

### Configuration Levels

| Configuration | Storage Location | Use Case |
|---------------|------------------|----------|
| Global Business ID | Django settings | Single business setup |
| Tenant Business ID | WhatsAppConfig model | Multi-business setup |
| Default Fallback | Django settings | When tenant not configured |

### Validation Requirements

| Check | Rule | Action if Failed |
|-------|------|------------------|
| Not Empty | business_id != "" | Error in production |
| Numeric | business_id.isdigit() | Warning |
| Length | 15-17 characters | Warning |
| Valid Format | Matches Meta pattern | Optional |

### Expected Outcome
- WHATSAPP_BUSINESS_ID setting configured
- Environment variable loading implemented
- Business ID validation added
- Documentation explains use cases

### Verification Checklist
- [ ] WHATSAPP_BUSINESS_ID setting defined in whatsapp.py
- [ ] Environment variable loading implemented
- [ ] Numeric validation added
- [ ] Setting added to .env.example
- [ ] Documentation explains business ID vs phone ID
- [ ] Use cases documented

---

## Task 06: Create WHATSAPP_VERIFY_TOKEN

### Overview
Configure the WHATSAPP_VERIFY_TOKEN setting used for webhook verification. When Meta sends webhook events, they first verify the webhook endpoint by sending a verification request. This token ensures that only Meta can register webhooks with your application.

### Dependencies
- Task 02: Create WhatsApp Settings

### Instructions

1. **Add setting to whatsapp.py**
   - Open `backend/config/settings/whatsapp.py`
   - Add WHATSAPP_VERIFY_TOKEN setting
   - Load from environment variable

2. **Define environment variable**
   - Environment variable name: `WHATSAPP_VERIFY_TOKEN`
   - This is a custom token you create
   - Not provided by Meta - you generate it

3. **Implement token loading**
   - Use `os.environ.get()` for loading
   - Generate random default for development
   - Require explicit value in production

4. **Document token generation**
   - Generate random secure string
   - Length: 32-64 characters recommended
   - Use alphanumeric characters
   - Can use UUID or random token generator

5. **Explain verification process**
   - Meta sends GET request to webhook URL
   - Request includes hub.mode, hub.challenge, hub.verify_token
   - Your endpoint checks hub.verify_token matches setting
   - If matches, return hub.challenge value
   - If doesn't match, return 403 Forbidden

6. **Add security considerations**
   - Token should be unpredictable
   - Don't use simple strings like "password"
   - Rotate token if compromised
   - Store securely like other secrets

7. **Add to environment files**
   - Add WHATSAPP_VERIFY_TOKEN to .env.example
   - Include comment explaining it's self-generated
   - Provide example of generating secure token

### Verify Token Configuration

| Property | Value |
|----------|-------|
| Setting Name | WHATSAPP_VERIFY_TOKEN |
| Environment Variable | WHATSAPP_VERIFY_TOKEN |
| Required | Yes (for webhooks) |
| Type | String (alphanumeric) |
| Length | 32-64 characters |
| Source | Self-generated (not from Meta) |

### Token Generation Methods

| Method | Command/Tool | Example Output |
|--------|-------------|----------------|
| UUID | Python uuid.uuid4() | a1b2c3d4-e5f6-7890-abcd-ef1234567890 |
| Random String | secrets.token_urlsafe(32) | dGhpc2lzYXJhbmRvbXRva2Vu... |
| OpenSSL | openssl rand -hex 32 | 3a7b9c2d1e4f8a6b5c9d2e... |
| Online Generator | Random.org, etc. | (Various formats) |

### Webhook Verification Flow

```
1. Meta Initiates Verification
        ↓
2. Meta sends GET request:
   GET /webhooks/whatsapp?
       hub.mode=subscribe&
       hub.challenge=12345&
       hub.verify_token={your_token}
        ↓
3. Your webhook endpoint receives request
        ↓
4. Extract hub.verify_token from query params
        ↓
5. Compare with WHATSAPP_VERIFY_TOKEN setting
        ↓
6. If matches: return hub.challenge (status 200)
   If doesn't match: return 403 Forbidden
```

### Verification Request Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| hub.mode | Always "subscribe" | subscribe |
| hub.challenge | Random string from Meta | 1234567890 |
| hub.verify_token | Your verify token | your-custom-token-here |

### Verification Endpoint Logic

```
Webhook Verification Handler:
1. Check if request is GET
2. Extract query parameters
3. Verify hub.mode == "subscribe"
4. Verify hub.verify_token == WHATSAPP_VERIFY_TOKEN
5. If valid: return hub.challenge
6. If invalid: return 403
```

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Randomness | Use cryptographically secure random generator |
| Length | Minimum 32 characters |
| Complexity | Mix of letters, numbers, special chars |
| Storage | Environment variables only |
| Rotation | Change if compromised |
| Never Hardcode | Always load from environment |

### Token in Meta Dashboard

```
When configuring webhook in Meta Business Manager:

1. Navigate to Webhook Configuration
2. Enter your webhook URL
3. Enter your custom Verify Token
4. Click "Verify and Save"
        ↓
Meta sends verification request with your token
        ↓
Your endpoint validates and responds
        ↓
Webhook is activated
```

### Environment Setup Example

```
.env file (development):
WHATSAPP_VERIFY_TOKEN=dev-webhook-token-a1b2c3d4

.env.example (template):
WHATSAPP_VERIFY_TOKEN=your-random-secure-token-here

Production (secrets manager):
WHATSAPP_VERIFY_TOKEN=prod-random-token-x9y8z7w6
```

### Expected Outcome
- WHATSAPP_VERIFY_TOKEN setting configured
- Token generation documented
- Webhook verification process explained
- Security best practices documented

### Verification Checklist
- [ ] WHATSAPP_VERIFY_TOKEN setting defined in whatsapp.py
- [ ] Environment variable loading implemented
- [ ] Token generation methods documented
- [ ] Setting added to .env.example
- [ ] Webhook verification flow explained
- [ ] Security recommendations included

---

## Task 07: Create WhatsAppConfig Model

### Overview
Create the WhatsAppConfig model to store tenant-specific WhatsApp configuration. This model allows each tenant to have their own WhatsApp phone number, access token, and settings while sharing the same application codebase. It's a core component of the multi-tenant WhatsApp integration.

### Dependencies
- Task 02: Create WhatsApp Settings
- SubPhase-02 (Django Tenants Installation) complete
- Tenant model created

### Instructions

1. **Create models directory**
   - Navigate to `backend/apps/notifications/`
   - Create `models/` directory if not exists
   - Create `__init__.py` in models directory
   - This allows multiple model files

2. **Create WhatsAppConfig model file**
   - Create `whatsapp_config.py` in models directory
   - This file contains WhatsAppConfig model
   - Separate file for better organization

3. **Import required dependencies**
   - Import Django model base classes
   - Import tenant model from tenants app
   - Import field types (CharField, BooleanField, etc.)
   - Import timezone utilities
   - Import encryption field library

4. **Define WhatsAppConfig class**
   - Inherit from `models.Model`
   - Add class docstring explaining purpose
   - This stores per-tenant WhatsApp configuration

5. **Add tenant relationship**
   - Create ForeignKey to Tenant model
   - Set on_delete to CASCADE (delete config when tenant deleted)
   - Set related_name to 'whatsapp_config'
   - Add unique constraint (one config per tenant)

6. **Add common base fields**
   - Add created_at timestamp field (auto_now_add)
   - Add updated_at timestamp field (auto_now)
   - Add created_by ForeignKey (optional)
   - Add updated_by ForeignKey (optional)

7. **Define model Meta class**
   - Set table name: 'notifications_whatsapp_config'
   - Add verbose_name: 'WhatsApp Configuration'
   - Add verbose_name_plural: 'WhatsApp Configurations'
   - Add ordering: ['-created_at']
   - Add indexes for performance

8. **Add string representation method**
   - Define __str__ method
   - Return tenant name + status
   - Example: "Tenant ABC - WhatsApp (Enabled)"

9. **Import in models __init__.py**
   - Open `models/__init__.py`
   - Import WhatsAppConfig class
   - Make it available for import

### WhatsAppConfig Model Purpose

| Aspect | Description |
|--------|-------------|
| Purpose | Store tenant-specific WhatsApp configuration |
| Scope | One config per tenant |
| Fields | Phone ID, access token, settings, limits |
| Relationship | Belongs to Tenant |
| Usage | API client uses this for tenant context |

### Model Structure Overview

```
WhatsAppConfig Model
├── Tenant Relationship (ForeignKey)
├── Authentication Fields (Task 08, 09)
│   ├── phone_number_id
│   └── access_token (encrypted)
├── Configuration Fields (Task 10, 11)
│   ├── is_enabled
│   └── daily_limit
└── Audit Fields
    ├── created_at
    ├── updated_at
    ├── created_by
    └── updated_by
```

### Tenant Relationship

| Field | Type | Options | Purpose |
|-------|------|---------|---------|
| tenant | ForeignKey | CASCADE, unique=True | Links to tenant |
| related_name | - | 'whatsapp_config' | Reverse relationship |

### Multi-Tenancy Support

```
Multi-Tenant WhatsApp Architecture:

Tenant A                    Tenant B
   ↓                           ↓
WhatsAppConfig A         WhatsAppConfig B
   ↓                           ↓
Phone ID: 111            Phone ID: 222
Token: AAA               Token: BBB
Limit: 1000              Limit: 5000
   ↓                           ↓
Send Messages            Send Messages
```

### Audit Fields

| Field | Type | Options | Purpose |
|-------|------|---------|---------|
| created_at | DateTimeField | auto_now_add=True | Record creation time |
| updated_at | DateTimeField | auto_now=True | Track last update |
| created_by | ForeignKey | User, null=True | Who created |
| updated_by | ForeignKey | User, null=True | Who last updated |

### Model Meta Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| db_table | notifications_whatsapp_config | Explicit table name |
| verbose_name | WhatsApp Configuration | Admin display name |
| ordering | ['-created_at'] | Default sort order |
| indexes | [tenant, is_enabled] | Performance optimization |

### Database Table Naming

```
App: notifications
Model: WhatsAppConfig
Table: notifications_whatsapp_config

Convention: {app}_{model_name_snake_case}
```

### Import Structure

```
File: backend/apps/notifications/models/__init__.py

from .whatsapp_config import WhatsAppConfig
from .whatsapp_optin import WhatsAppOptIn  # (Task 12)

__all__ = [
    'WhatsAppConfig',
    'WhatsAppOptIn',
]
```

### Usage Example

```
Accessing tenant's WhatsApp configuration:

tenant = get_current_tenant()
whatsapp_config = tenant.whatsapp_config

if whatsapp_config.is_enabled:
    send_message(whatsapp_config)
```

### Expected Outcome
- WhatsAppConfig model created with proper structure
- Tenant relationship established
- Audit fields included
- Model registered in models __init__.py

### Verification Checklist
- [ ] `backend/apps/notifications/models/whatsapp_config.py` created
- [ ] WhatsAppConfig class defined
- [ ] Tenant ForeignKey added with CASCADE
- [ ] Audit fields included (created_at, updated_at)
- [ ] Model Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 08: Create phone_number_id Field

### Overview
Add the phone_number_id field to WhatsAppConfig model. This field stores the Meta-assigned phone number ID for the tenant's WhatsApp Business phone number. It's used in API endpoint construction and is required for sending messages through the tenant's specific phone number.

### Dependencies
- Task 07: Create WhatsAppConfig Model

### Instructions

1. **Open WhatsAppConfig model file**
   - Navigate to `backend/apps/notifications/models/whatsapp_config.py`
   - Locate the WhatsAppConfig class definition
   - Add phone_number_id field in configuration section

2. **Define phone_number_id field**
   - Use CharField field type
   - Set max_length to 20 characters (sufficient for phone IDs)
   - Set blank=True, null=True (optional during initial setup)
   - Add help_text explaining field purpose

3. **Add field validation**
   - Add validators for numeric-only content
   - Validate minimum length (15 characters typical)
   - Consider regex validator for format

4. **Add database index**
   - Add db_index=True for query performance
   - Phone ID used frequently in lookups
   - Improves query speed for message sending

5. **Update Meta class**
   - Add phone_number_id to indexes list
   - Consider composite index with tenant
   - Optimize for common query patterns

6. **Add field documentation**
   - Add comment explaining phone ID vs phone number
   - Document where to obtain this value
   - Include example format

7. **Create property methods (optional)**
   - Add property to check if phone_number_id configured
   - Add method to validate phone_number_id format
   - Add method to build API endpoint URL

### phone_number_id Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store phone number ID |
| Max Length | 20 | Accommodate Meta's ID format |
| Blank | True | Allow empty during setup |
| Null | True | Optional field |
| DB Index | True | Fast lookups |
| Unique | False | Multiple tenants can share (in theory) |

### Field Validation

| Validation | Rule | Error Message |
|------------|------|---------------|
| Format | Numeric only | Must contain only digits |
| Length | 15-16 characters | Invalid phone number ID length |
| Required | Not empty if enabled | Phone number ID required when enabled |

### Phone ID Usage in API

```
Message Endpoint Construction:

Base URL: https://graph.facebook.com/v18.0/
Phone ID: {tenant.whatsapp_config.phone_number_id}
Endpoint: /messages

Full URL:
https://graph.facebook.com/v18.0/{phone_number_id}/messages

Example:
https://graph.facebook.com/v18.0/123456789012345/messages
```

### Database Schema

```sql
Table: notifications_whatsapp_config

Columns:
├── id (Primary Key)
├── tenant_id (Foreign Key, Unique)
├── phone_number_id (VARCHAR(20), Indexed)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Property Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| has_phone_number_id() | bool | Check if phone ID configured |
| is_phone_id_valid() | bool | Validate phone ID format |
| get_api_endpoint() | str | Build message endpoint URL |

### Configuration States

| State | phone_number_id | is_enabled | Can Send Messages |
|-------|----------------|------------|-------------------|
| Not Configured | None/Empty | False | No |
| Configured Only | Set | False | No (disabled) |
| Fully Active | Set | True | Yes |
| Invalid Config | Invalid | True | No (validation fails) |

### Index Strategy

```
Single Field Index:
CREATE INDEX idx_phone_number_id 
ON notifications_whatsapp_config(phone_number_id);

Composite Index (optional):
CREATE INDEX idx_tenant_phone 
ON notifications_whatsapp_config(tenant_id, phone_number_id);
```

### Validation Logic Flow

```
When validating phone_number_id:

1. Check if not empty
        ↓
2. Check if numeric only
        ↓
3. Check length (15-16 chars)
        ↓
4. Optional: Validate with Meta API
        ↓
5. Return validation result
```

### Admin Display

| List Display | Value |
|--------------|-------|
| Tenant | tenant.name |
| Phone ID | phone_number_id (masked if desired) |
| Status | is_enabled status |
| Last Updated | updated_at |

### Expected Outcome
- phone_number_id field added to model
- Field indexed for performance
- Validation rules implemented
- Helper methods created

### Verification Checklist
- [ ] phone_number_id field added to WhatsAppConfig model
- [ ] CharField with max_length=20
- [ ] blank=True, null=True for optional setup
- [ ] db_index=True for performance
- [ ] Validation for numeric format
- [ ] Help text explaining purpose
- [ ] Property methods for validation (optional)

---

## Summary

This document established the foundational WhatsApp Business API configuration for LankaCommerce Cloud. We created WhatsApp constants for API endpoints, configured Django settings for authentication and verification, and implemented the WhatsAppConfig model with the phone_number_id field for tenant-specific configuration.

### Completed Tasks
1. ✓ Created WhatsApp constants for API version and URLs
2. ✓ Created WhatsApp settings module structure
3. ✓ Configured WHATSAPP_ACCESS_TOKEN for API authentication
4. ✓ Configured WHATSAPP_PHONE_ID for message endpoints
5. ✓ Configured WHATSAPP_BUSINESS_ID for account operations
6. ✓ Configured WHATSAPP_VERIFY_TOKEN for webhook verification
7. ✓ Created WhatsAppConfig model for tenant configuration
8. ✓ Added phone_number_id field for phone identification

### Next Steps
Proceed to [02_Tasks-09-16_OptIn-Migration.md](02_Tasks-09-16_OptIn-Migration.md) to complete the WhatsAppConfig model with access_token, is_enabled, and daily_limit fields, create the WhatsAppOptIn model for customer consent tracking, and generate database migrations.

---

**Document Status:** Complete  
**Last Updated:** January 31, 2026  
**Next Review:** Phase 09 Completion
