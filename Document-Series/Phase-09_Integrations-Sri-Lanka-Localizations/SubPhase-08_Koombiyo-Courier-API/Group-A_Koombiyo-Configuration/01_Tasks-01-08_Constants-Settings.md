# Tasks 01-08: Constants and Settings Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** A - Koombiyo Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Model-Admin-Verify.md](02_Tasks-09-16_Model-Admin-Verify.md)

---

## Document Overview

This document covers the creation of Koombiyo API constants and Django settings configuration. It establishes the foundational configuration infrastructure for integrating with the Koombiyo courier service, including API endpoint definitions, environment-based settings, and credential management for both sandbox and production environments.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Koombiyo Constants | Low | 20 min |
| 02 | Create Sandbox URL | Low | 10 min |
| 03 | Create Production URL | Low | 10 min |
| 04 | Create Koombiyo Settings | Medium | 30 min |
| 05 | Create API Key Setting | Low | 15 min |
| 06 | Create Merchant ID Setting | Low | 15 min |
| 07 | Create Sandbox Toggle | Low | 15 min |
| 08 | Create Webhook Secret | Low | 15 min |

---

## Task 01: Create Koombiyo Constants

### Overview
Create a constants module for Koombiyo-specific values including API endpoint URLs, request/response formats, and other immutable configuration values. This centralized constants file ensures consistency across the Koombiyo integration and makes it easy to reference standard values throughout the codebase.

### Dependencies
- SubPhase-07 (Previous SubPhase) must be complete
- Backend shipping app structure exists
- Provider structure initialized

### Instructions

1. **Navigate to shipping providers directory**
   - Go to `backend/apps/shipping/providers/` directory
   - Create new directory named `koombiyo` if not exists
   - This will house all Koombiyo-related code

2. **Create constants.py file**
   - Create new file `constants.py` in `koombiyo/` directory
   - Add module-level docstring explaining purpose
   - Import necessary typing modules if needed

3. **Define API base URLs section**
   - Create section comment for API endpoints
   - Define constants for sandbox and production URLs
   - Use descriptive constant names in UPPER_SNAKE_CASE

4. **Define API endpoint paths**
   - Create dictionary or separate constants for endpoint paths
   - Include endpoints for: rate calculation, booking, tracking, label generation
   - Use relative paths (will be combined with base URL)

5. **Define request/response constants**
   - Create constants for standard request headers
   - Define timeout values for API calls
   - Set maximum retry attempts

6. **Define package-related constants**
   - Default package dimensions if not specified
   - Supported package types
   - Weight unit (kg)
   - Dimension unit (cm)

7. **Define status code mappings**
   - Map Koombiyo status codes to internal status codes
   - Include delivery statuses (pending, in_transit, delivered, etc.)
   - Map error codes to readable messages

8. **Add documentation comments**
   - Document each constant with inline comments
   - Explain expected usage where necessary
   - Note any Koombiyo-specific requirements

### Constants Structure

| Category | Constants | Purpose |
|----------|-----------|---------|
| API URLs | SANDBOX_URL, PRODUCTION_URL | Base API endpoints |
| Endpoints | RATE_ENDPOINT, BOOKING_ENDPOINT, etc. | API paths |
| Request | DEFAULT_TIMEOUT, MAX_RETRIES | Request configuration |
| Package | DEFAULT_WEIGHT, DEFAULT_DIMENSIONS | Package defaults |
| Status | STATUS_MAPPING, ERROR_CODES | Status translations |

### API Endpoints

```
Rate Calculation
├── Path: /rates
├── Method: POST
└── Purpose: Get shipping rates

Booking
├── Path: /bookings
├── Method: POST
└── Purpose: Create shipment booking

Tracking
├── Path: /tracking/{tracking_number}
├── Method: GET
└── Purpose: Track shipment status

Label
├── Path: /labels/{booking_id}
├── Method: GET
└── Purpose: Download shipping label
```

### Status Code Mapping Example

| Koombiyo Status | Internal Status | Description |
|----------------|-----------------|-------------|
| PENDING | pending | Booking created |
| PICKED_UP | in_transit | Courier collected |
| IN_TRANSIT | in_transit | En route |
| OUT_FOR_DELIVERY | out_for_delivery | Final delivery |
| DELIVERED | delivered | Successfully delivered |
| FAILED | failed | Delivery failed |
| RETURNED | returned | Returned to sender |

### Expected Outcome
- Centralized constants file for Koombiyo integration
- All API URLs and endpoints defined
- Standard values for timeouts, retries, and defaults
- Status code mappings established
- Well-documented constants for maintainability

### Verification Checklist
- [ ] `backend/apps/shipping/providers/koombiyo/constants.py` file created
- [ ] Sandbox and production URLs defined
- [ ] All API endpoint paths included
- [ ] Request/response constants configured
- [ ] Package-related defaults set
- [ ] Status code mappings complete
- [ ] Inline documentation added
- [ ] File imports without errors

---

## Task 02: Create Sandbox URL

### Overview
Define and configure the Koombiyo sandbox environment URL constant for testing and development purposes. The sandbox URL provides a safe environment to test API integration without affecting live data or incurring actual shipping charges.

### Dependencies
- Task 01: Create Koombiyo Constants

### Instructions

1. **Locate sandbox URL documentation**
   - Review Koombiyo API documentation for sandbox URL
   - Verify current sandbox endpoint (may change)
   - Note any authentication differences from production

2. **Define sandbox URL constant**
   - Open `constants.py` file
   - Create constant named `SANDBOX_BASE_URL`
   - Set value to Koombiyo sandbox API base URL

3. **Set complete sandbox URL**
   - URL should be: `https://sandbox.koombiyo.lk/api/`
   - Ensure URL includes trailing slash if required
   - Verify URL format matches Koombiyo documentation

4. **Add version information if applicable**
   - If Koombiyo uses API versioning, include version
   - Example: `https://sandbox.koombiyo.lk/api/v1/`
   - Document version number in comments

5. **Document sandbox characteristics**
   - Add comment explaining sandbox environment purpose
   - Note that sandbox data is not persistent
   - Mention sandbox-specific test credentials if available

6. **Add sandbox feature notes**
   - Document which features are available in sandbox
   - Note any limitations vs production environment
   - Explain test data behavior

### Sandbox Configuration

| Property | Value | Notes |
|----------|-------|-------|
| URL | https://sandbox.koombiyo.lk/api/ | Test environment |
| SSL | Required | HTTPS only |
| Rate Limiting | More lenient | Higher limits for testing |
| Data Persistence | Temporary | Resets periodically |
| Test Cards | Available | For COD simulation |

### Sandbox vs Production

```
Sandbox Environment
├── Purpose: Development and testing
├── URL: sandbox.koombiyo.lk
├── Data: Test data only
├── Credentials: Sandbox API keys
├── Charges: No real costs
└── Rate Limits: Relaxed

Production Environment
├── Purpose: Live operations
├── URL: api.koombiyo.lk
├── Data: Real customer data
├── Credentials: Production API keys
├── Charges: Actual costs apply
└── Rate Limits: Standard limits
```

### Testing Capabilities

| Feature | Sandbox | Production |
|---------|---------|------------|
| Rate Calculation | ✓ Test rates | ✓ Actual rates |
| Booking Creation | ✓ Mock bookings | ✓ Real bookings |
| Tracking | ✓ Simulated | ✓ Live tracking |
| Label Generation | ✓ Test labels | ✓ Real labels |
| Webhooks | ✓ Available | ✓ Available |
| COD | ✓ Simulated | ✓ Real money |

### Expected Outcome
- Sandbox URL properly defined in constants
- Clear documentation of sandbox purpose
- Understanding of sandbox limitations
- Ready for development testing

### Verification Checklist
- [ ] `SANDBOX_BASE_URL` constant defined
- [ ] URL matches Koombiyo documentation
- [ ] Proper URL format with protocol and path
- [ ] Comments explain sandbox purpose
- [ ] Notes added about sandbox limitations
- [ ] Constant can be imported without errors

---

## Task 03: Create Production URL

### Overview
Define and configure the Koombiyo production environment URL constant for live operations. The production URL connects to the live Koombiyo API where actual bookings are created, real charges apply, and customer shipments are processed.

### Dependencies
- Task 01: Create Koombiyo Constants

### Instructions

1. **Locate production URL documentation**
   - Review Koombiyo API documentation for production URL
   - Verify current production endpoint
   - Ensure URL is for live environment

2. **Define production URL constant**
   - Open `constants.py` file
   - Create constant named `PRODUCTION_BASE_URL`
   - Set value to Koombiyo production API base URL

3. **Set complete production URL**
   - URL should be: `https://api.koombiyo.lk/api/`
   - Ensure URL includes trailing slash if required
   - Double-check URL format for accuracy

4. **Add version information if applicable**
   - If Koombiyo uses API versioning, include version
   - Example: `https://api.koombiyo.lk/api/v1/`
   - Document version number in comments

5. **Document production warnings**
   - Add prominent comment warning about production use
   - Note that production operations incur real costs
   - Emphasize careful credential management

6. **Add security reminders**
   - Document that production requires valid credentials
   - Note importance of HTTPS/SSL
   - Mention rate limiting considerations

### Production Configuration

| Property | Value | Notes |
|----------|-------|-------|
| URL | https://api.koombiyo.lk/api/ | Live environment |
| SSL | Required | HTTPS enforced |
| Rate Limiting | Standard | Per merchant limits |
| Data Persistence | Permanent | Real shipment data |
| Charges | Real costs | Actual billing applies |

### Security Considerations

```
Production Environment Security
├── Credentials
│   ├── Store in environment variables
│   ├── Never commit to repository
│   └── Rotate periodically
├── SSL/TLS
│   ├── Always use HTTPS
│   ├── Verify certificates
│   └── No insecure connections
├── Rate Limiting
│   ├── Respect API limits
│   ├── Implement backoff strategy
│   └── Monitor usage
└── Error Handling
    ├── Log errors securely
    ├── Don't expose credentials in logs
    └── Implement proper retry logic
```

### Production Readiness Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Valid credentials | Must verify | Live API key required |
| SSL certificate | Automatic | Handled by HTTPS |
| Rate limiting | Implement | Prevent API abuse |
| Error logging | Configure | Production monitoring |
| Backup strategy | Required | Handle failures |
| Cost monitoring | Essential | Track API usage costs |

### Environment Selection Logic

```
URL Selection Flow
├── Check KOOMBIYO_SANDBOX setting
│   ├── If True → Use SANDBOX_BASE_URL
│   └── If False → Use PRODUCTION_BASE_URL
├── Default Behavior
│   ├── Development: Sandbox
│   ├── Staging: Sandbox
│   └── Production: Production
└── Environment Variable Override
    └── KOOMBIYO_ENVIRONMENT (sandbox|production)
```

### Expected Outcome
- Production URL properly defined in constants
- Clear documentation of production implications
- Security considerations documented
- Ready for live operations when credentials configured

### Verification Checklist
- [ ] `PRODUCTION_BASE_URL` constant defined
- [ ] URL matches Koombiyo documentation
- [ ] Proper URL format with HTTPS protocol
- [ ] Warning comments about production use added
- [ ] Security considerations documented
- [ ] Constant can be imported without errors
- [ ] URL does not include test/sandbox references

---

## Task 04: Create Koombiyo Settings

### Overview
Create a dedicated Django settings module for Koombiyo-specific configuration. This module centralizes all Koombiyo-related settings, making them easy to manage and override across different environments (development, staging, production).

### Dependencies
- Task 01: Create Koombiyo Constants

### Instructions

1. **Navigate to Django settings directory**
   - Go to `backend/config/settings/` directory
   - This contains environment-specific settings modules
   - Verify base settings structure

2. **Create koombiyo.py settings file**
   - Create new file `koombiyo.py` in settings directory
   - Add module-level docstring
   - Import necessary modules (os, environ)

3. **Structure settings into sections**
   - Create comment headers for different setting categories
   - Sections: Authentication, URLs, Timeouts, Features, Webhooks
   - Keep related settings grouped together

4. **Import from environment variables**
   - Use `os.environ.get()` or Django environ library
   - Provide sensible defaults where appropriate
   - Mark required vs optional settings

5. **Define setting precedence**
   - Environment variables take highest priority
   - Django settings.py can override defaults
   - Constants file provides base values

6. **Add validation comments**
   - Document which settings are required
   - Explain expected format/values
   - Note any interdependencies between settings

7. **Configure environment-specific defaults**
   - Development: Sandbox mode enabled
   - Staging: Sandbox mode enabled
   - Production: Sandbox mode disabled

8. **Import settings in main settings file**
   - Open `backend/config/settings/base.py` or appropriate file
   - Add import statement for koombiyo settings
   - Alternatively use settings module pattern

### Settings Structure

| Section | Purpose | Settings |
|---------|---------|----------|
| Authentication | API credentials | API_KEY, MERCHANT_ID |
| Environment | Sandbox toggle | SANDBOX, BASE_URL |
| Timeouts | Request limits | TIMEOUT, MAX_RETRIES |
| Features | Feature flags | COD_ENABLED, TRACKING_ENABLED |
| Webhooks | Webhook config | WEBHOOK_SECRET, WEBHOOK_URL |

### Settings Categories

```
Koombiyo Settings Module
├── Authentication Settings
│   ├── KOOMBIYO_API_KEY
│   └── KOOMBIYO_MERCHANT_ID
├── Environment Settings
│   ├── KOOMBIYO_SANDBOX
│   └── KOOMBIYO_BASE_URL (computed)
├── Request Settings
│   ├── KOOMBIYO_TIMEOUT
│   ├── KOOMBIYO_MAX_RETRIES
│   └── KOOMBIYO_RETRY_DELAY
├── Feature Flags
│   ├── KOOMBIYO_COD_ENABLED
│   ├── KOOMBIYO_TRACKING_ENABLED
│   └── KOOMBIYO_LABEL_AUTO_GENERATE
└── Webhook Settings
    ├── KOOMBIYO_WEBHOOK_SECRET
    └── KOOMBIYO_WEBHOOK_URL
```

### Environment Variable Mapping

| Setting Name | Environment Variable | Default | Required |
|--------------|---------------------|---------|----------|
| API_KEY | KOOMBIYO_API_KEY | None | Yes |
| MERCHANT_ID | KOOMBIYO_MERCHANT_ID | None | Yes |
| SANDBOX | KOOMBIYO_SANDBOX | True (dev) | No |
| TIMEOUT | KOOMBIYO_TIMEOUT | 30 | No |
| WEBHOOK_SECRET | KOOMBIYO_WEBHOOK_SECRET | None | Yes (if webhooks) |

### Settings Import Pattern

```
Import Method 1: Direct Import
└── from backend.config.settings.koombiyo import KOOMBIYO_API_KEY

Import Method 2: Django Settings
├── In base.py: from .koombiyo import *
└── Access via: from django.conf import settings

Import Method 3: Lazy Import
└── Import in module when needed (preferred for circular imports)
```

### Expected Outcome
- Dedicated settings module for Koombiyo configuration
- Environment variable integration
- Clear documentation of each setting
- Proper defaults for different environments
- Easy to override settings per environment

### Verification Checklist
- [ ] `backend/config/settings/koombiyo.py` file created
- [ ] All required settings defined
- [ ] Environment variable integration working
- [ ] Sensible defaults provided
- [ ] Documentation comments added
- [ ] Settings imported in main settings file
- [ ] No syntax errors
- [ ] Settings accessible via Django settings

---

## Task 05: Create API Key Setting

### Overview
Configure the Koombiyo API key setting for authentication with the Koombiyo API. The API key is a secret credential provided by Koombiyo that authenticates API requests and must be stored securely and never committed to version control.

### Dependencies
- Task 04: Create Koombiyo Settings

### Instructions

1. **Define API key setting**
   - Open `backend/config/settings/koombiyo.py`
   - Locate authentication settings section
   - Add `KOOMBIYO_API_KEY` setting

2. **Load from environment variable**
   - Use `os.environ.get('KOOMBIYO_API_KEY')`
   - Do not provide a default value (should fail if missing in production)
   - For development, allow None or empty string

3. **Add environment-specific handling**
   - Development: Allow empty/None for testing without API
   - Staging: Require sandbox API key
   - Production: Require production API key, fail if missing

4. **Document API key format**
   - Add comment explaining expected format
   - Note that different keys for sandbox vs production
   - Explain where to obtain API key

5. **Add security reminders**
   - Comment warning never to commit API key
   - Note to use environment variables or secret management
   - Remind to rotate keys periodically

6. **Create .env.example entry**
   - Open or create `.env.example` in project root
   - Add `KOOMBIYO_API_KEY=your_api_key_here`
   - Add comment explaining purpose

7. **Add validation helper**
   - Create function to validate API key format if needed
   - Check that key is not empty in production
   - Optionally validate key format/length

### API Key Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Setting Name | KOOMBIYO_API_KEY | Django setting |
| Env Variable | KOOMBIYO_API_KEY | Environment variable |
| Format | String | Alphanumeric token |
| Required | Yes (production) | Optional (dev) |
| Sandbox Key | Different | Separate key for testing |

### Security Best Practices

```
API Key Security
├── Storage
│   ├── Use environment variables
│   ├── Use secret management service (AWS Secrets, etc.)
│   └── Never hardcode in source code
├── Access Control
│   ├── Limit who can view keys
│   ├── Use different keys per environment
│   └── Rotate keys periodically
├── Version Control
│   ├── Add .env to .gitignore
│   ├── Never commit keys
│   └── Use .env.example with placeholders
└── Logging
    ├── Never log API keys
    ├── Redact in error messages
    └── Mask in admin interfaces
```

### Environment Variable Setup

```
.env File (Development)
KOOMBIYO_API_KEY=sandbox_key_abc123xyz789

.env File (Production)
KOOMBIYO_API_KEY=prod_key_xyz789abc123

Docker Compose (Development)
environment:
  - KOOMBIYO_API_KEY=${KOOMBIYO_API_KEY}

Kubernetes (Production)
secretKeyRef:
  name: koombiyo-secrets
  key: api-key
```

### Obtaining API Keys

| Environment | How to Obtain | Where to Find |
|-------------|--------------|---------------|
| Sandbox | Register for test account | Koombiyo developer portal |
| Production | Apply for merchant account | Koombiyo merchant dashboard |
| Rotation | Request new key | Account settings |

### Expected Outcome
- API key setting properly configured
- Environment variable integration working
- Security best practices documented
- .env.example updated with placeholder
- Validation in place for production

### Verification Checklist
- [ ] `KOOMBIYO_API_KEY` setting defined in koombiyo.py
- [ ] Environment variable loading implemented
- [ ] Security warnings added in comments
- [ ] .env.example updated with placeholder
- [ ] Setting accessible in Django code
- [ ] No default API key hardcoded
- [ ] Production validation ensures key is present
- [ ] Documentation explains where to obtain key

---

## Task 06: Create Merchant ID Setting

### Overview
Configure the Koombiyo merchant ID setting for identifying the merchant account in API requests. The merchant ID is provided by Koombiyo during account setup and uniquely identifies each merchant using the courier service.

### Dependencies
- Task 04: Create Koombiyo Settings

### Instructions

1. **Define merchant ID setting**
   - Open `backend/config/settings/koombiyo.py`
   - Locate authentication settings section (near API key)
   - Add `KOOMBIYO_MERCHANT_ID` setting

2. **Load from environment variable**
   - Use `os.environ.get('KOOMBIYO_MERCHANT_ID')`
   - Do not provide a default value (should fail if missing in production)
   - For development, allow None or empty string

3. **Add environment-specific handling**
   - Development: Allow empty/None for mock testing
   - Staging: Require sandbox merchant ID
   - Production: Require production merchant ID

4. **Document merchant ID format**
   - Add comment explaining expected format
   - Note that different IDs for sandbox vs production
   - Explain where to find merchant ID

5. **Add relationship to API key**
   - Document that merchant ID and API key must match
   - Note that they come from same account
   - Explain authentication flow uses both

6. **Create .env.example entry**
   - Open `.env.example` file
   - Add `KOOMBIYO_MERCHANT_ID=your_merchant_id_here`
   - Add comment about relationship with API key

7. **Add validation helper**
   - Create function to validate merchant ID format
   - Ensure both API key and merchant ID are set together
   - Validate ID format if known

### Merchant ID Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Setting Name | KOOMBIYO_MERCHANT_ID | Django setting |
| Env Variable | KOOMBIYO_MERCHANT_ID | Environment variable |
| Format | String | Numeric or alphanumeric |
| Required | Yes (production) | Optional (dev) |
| Sandbox ID | Different | Separate ID for testing |

### Merchant ID vs API Key

```
Authentication Components
├── Merchant ID
│   ├── Identifies merchant account
│   ├── Used in API requests
│   ├── Public identifier
│   └── Not sensitive (but don't expose unnecessarily)
└── API Key
    ├── Authenticates requests
    ├── Proves merchant identity
    ├── Highly sensitive
    └── Keep secret

Both Required For API Calls
└── Included in request headers or payload
```

### Finding Merchant ID

| Source | Location | Notes |
|--------|----------|-------|
| Dashboard | Koombiyo merchant dashboard | Settings or account page |
| Email | Account creation email | Sent after approval |
| Documentation | API docs provided by Koombiyo | Integration guide |
| Support | Contact Koombiyo support | If unable to locate |

### Environment Setup Example

```
Development (.env)
KOOMBIYO_API_KEY=sandbox_key_abc123
KOOMBIYO_MERCHANT_ID=TEST_MERCHANT_001

Production (.env)
KOOMBIYO_API_KEY=prod_key_xyz789
KOOMBIYO_MERCHANT_ID=MERCHANT_123456

Validation Check
if settings.KOOMBIYO_API_KEY and not settings.KOOMBIYO_MERCHANT_ID:
    raise ImproperlyConfigured("Merchant ID required with API key")
```

### Configuration Validation

| Check | Purpose | Action |
|-------|---------|--------|
| Both Present | API key and merchant ID set | Allow API calls |
| Only One | Incomplete config | Raise configuration error |
| Neither | No credentials | Disable Koombiyo integration |
| Format | Valid format | Log warning if unexpected format |

### Expected Outcome
- Merchant ID setting properly configured
- Environment variable integration working
- Validation ensures both credentials present
- .env.example updated with placeholder
- Clear documentation of purpose

### Verification Checklist
- [ ] `KOOMBIYO_MERCHANT_ID` setting defined in koombiyo.py
- [ ] Environment variable loading implemented
- [ ] Validation checks both API key and merchant ID
- [ ] .env.example updated with placeholder
- [ ] Setting accessible in Django code
- [ ] No default merchant ID hardcoded
- [ ] Documentation explains where to find ID
- [ ] Comments explain relationship with API key

---

## Task 07: Create Sandbox Toggle

### Overview
Create a boolean setting to toggle between Koombiyo sandbox and production environments. This setting determines which API base URL is used and should default to sandbox in development and production mode in live environments.

### Dependencies
- Task 04: Create Koombiyo Settings

### Instructions

1. **Define sandbox toggle setting**
   - Open `backend/config/settings/koombiyo.py`
   - Locate environment settings section
   - Add `KOOMBIYO_SANDBOX` boolean setting

2. **Load from environment variable**
   - Use `os.environ.get('KOOMBIYO_SANDBOX', 'True')`
   - Convert string to boolean properly
   - Handle various true/false representations

3. **Set environment-specific defaults**
   - Development: Default to True (sandbox)
   - Staging: Default to True (sandbox)
   - Production: Default to False (live API)

4. **Create base URL selector**
   - Add `KOOMBIYO_BASE_URL` computed setting
   - Select `SANDBOX_BASE_URL` if `KOOMBIYO_SANDBOX` is True
   - Select `PRODUCTION_BASE_URL` if `KOOMBIYO_SANDBOX` is False

5. **Import constants for URLs**
   - Import `SANDBOX_BASE_URL` and `PRODUCTION_BASE_URL` from constants
   - Use these in base URL computation
   - Ensure constants are available

6. **Add safety checks**
   - Warn if production mode in development environment
   - Log which environment is active on startup
   - Prevent accidental production use

7. **Create .env.example entry**
   - Add `KOOMBIYO_SANDBOX=True` to .env.example
   - Document that `True`, `true`, `1` all mean sandbox
   - Document that `False`, `false`, `0` mean production

8. **Add documentation comments**
   - Explain purpose of sandbox toggle
   - Warn about production charges
   - Document URL selection logic

### Sandbox Toggle Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Setting Name | KOOMBIYO_SANDBOX | Django setting |
| Env Variable | KOOMBIYO_SANDBOX | Environment variable |
| Type | Boolean | True or False |
| Default (Dev) | True | Safe default |
| Default (Prod) | False | Live API |

### Boolean Conversion Logic

```
String to Boolean Conversion
├── True Values
│   ├── "True", "true", "TRUE"
│   ├── "1", "yes", "Yes", "YES"
│   └── "on", "On", "ON"
└── False Values
    ├── "False", "false", "FALSE"
    ├── "0", "no", "No", "NO"
    └── "off", "Off", "OFF"

Implementation Example:
SANDBOX_STR = os.environ.get('KOOMBIYO_SANDBOX', 'True')
KOOMBIYO_SANDBOX = SANDBOX_STR.lower() in ('true', '1', 'yes', 'on')
```

### Base URL Selection

```
URL Selection Logic
├── Check KOOMBIYO_SANDBOX
│   ├── If True
│   │   └── Use https://sandbox.koombiyo.lk/api/
│   └── If False
│       └── Use https://api.koombiyo.lk/api/
├── Computed Setting
│   └── KOOMBIYO_BASE_URL = SANDBOX_URL if SANDBOX else PRODUCTION_URL
└── Usage
    └── All API calls use KOOMBIYO_BASE_URL
```

### Environment Configuration Examples

```
Development (.env)
KOOMBIYO_SANDBOX=True
# Uses sandbox, test data, no charges

Staging (.env)
KOOMBIYO_SANDBOX=True
# Uses sandbox for final testing

Production (.env)
KOOMBIYO_SANDBOX=False
# Uses production API, real charges apply

Local Testing Production
KOOMBIYO_SANDBOX=False
# ⚠️ Use with caution! Real API calls
```

### Safety Mechanisms

| Mechanism | Purpose | Implementation |
|-----------|---------|----------------|
| Default Safe | Prevent accidental production use | Default to sandbox |
| Environment Check | Warn about mismatches | Log if prod mode in dev |
| Startup Log | Visibility of current mode | Print mode on app start |
| Admin Display | Show current mode in admin | Display badge in dashboard |

### Expected Outcome
- Sandbox toggle properly configured
- Base URL automatically selected based on toggle
- Safe defaults for each environment
- Clear documentation and warnings
- Easy to override per environment

### Verification Checklist
- [ ] `KOOMBIYO_SANDBOX` setting defined as boolean
- [ ] Environment variable loading with proper conversion
- [ ] `KOOMBIYO_BASE_URL` computed based on toggle
- [ ] Constants imported for URL selection
- [ ] Default to sandbox in development
- [ ] .env.example updated with documentation
- [ ] Safety warnings added in comments
- [ ] Setting accessible throughout application

---

## Task 08: Create Webhook Secret

### Overview
Configure the webhook secret setting for verifying the authenticity of webhook requests from Koombiyo. The webhook secret is used to create and verify HMAC signatures, ensuring that incoming webhook notifications genuinely originate from Koombiyo.

### Dependencies
- Task 04: Create Koombiyo Settings

### Instructions

1. **Define webhook secret setting**
   - Open `backend/config/settings/koombiyo.py`
   - Locate webhook settings section
   - Add `KOOMBIYO_WEBHOOK_SECRET` setting

2. **Load from environment variable**
   - Use `os.environ.get('KOOMBIYO_WEBHOOK_SECRET')`
   - No default value (webhooks won't work without it)
   - Optional setting (only required if webhooks enabled)

3. **Document webhook secret purpose**
   - Add comment explaining HMAC signature verification
   - Note that Koombiyo sends signature in webhook headers
   - Explain how secret is used to verify authenticity

4. **Add webhook secret format notes**
   - Document expected format (usually long random string)
   - Note where to obtain webhook secret (Koombiyo dashboard)
   - Explain different secrets for sandbox vs production

5. **Create webhook URL setting**
   - Add `KOOMBIYO_WEBHOOK_URL` setting
   - Should be full URL to webhook endpoint
   - Example: `https://yourdomain.com/api/webhooks/koombiyo/`

6. **Document webhook event types**
   - List webhook events Koombiyo sends (if known)
   - Events might include: booking_created, status_updated, delivered, etc.
   - Add as comments for reference

7. **Add security reminders**
   - Note that webhook secret should be kept confidential
   - Explain importance of signature verification
   - Warn about replay attack prevention

8. **Create .env.example entries**
   - Add `KOOMBIYO_WEBHOOK_SECRET=your_webhook_secret_here`
   - Add `KOOMBIYO_WEBHOOK_URL=https://yourdomain.com/webhooks/koombiyo/`
   - Add comments explaining each setting

### Webhook Configuration

| Property | Value | Notes |
|----------|-------|-------|
| Setting Name | KOOMBIYO_WEBHOOK_SECRET | Django setting |
| Env Variable | KOOMBIYO_WEBHOOK_SECRET | Environment variable |
| Format | String | Random secure string |
| Required | Optional | Only if webhooks used |
| Purpose | Signature verification | Security |

### Webhook Flow

```
Webhook Request Flow
├── Koombiyo Event Occurs
│   └── (Status update, delivery confirmation, etc.)
├── Koombiyo Sends Webhook
│   ├── POST to KOOMBIYO_WEBHOOK_URL
│   ├── Includes event payload (JSON)
│   └── Includes signature header (HMAC)
├── Your Application Receives Webhook
│   ├── Extract signature from header
│   ├── Compute HMAC of payload using KOOMBIYO_WEBHOOK_SECRET
│   ├── Compare computed signature with received signature
│   └── If match → Process webhook
│       If mismatch → Reject (possible tampering)
└── Process Event
    └── Update shipment status, notify customer, etc.
```

### Webhook Event Types

| Event | Webhook Payload | Action |
|-------|----------------|--------|
| booking_created | Booking details | Confirm shipment |
| status_updated | New status, tracking | Update database |
| out_for_delivery | Courier assigned | Notify customer |
| delivered | Delivery proof | Complete order |
| failed | Failure reason | Handle exception |
| returned | Return details | Process return |

### Signature Verification

```
HMAC Signature Verification Process
├── Step 1: Extract Signature
│   └── Get signature from request header (X-Koombiyo-Signature)
├── Step 2: Get Payload
│   └── Read raw request body (before parsing)
├── Step 3: Compute HMAC
│   ├── Use KOOMBIYO_WEBHOOK_SECRET as key
│   ├── Hash raw payload with SHA256
│   └── Encode result as hex string
├── Step 4: Compare
│   ├── Compare computed signature with received signature
│   └── Use timing-safe comparison (prevent timing attacks)
└── Step 5: Decision
    ├── If match → Process webhook
    └── If mismatch → Log and reject (return 400)
```

### Security Considerations

| Aspect | Implementation | Reason |
|--------|----------------|--------|
| Signature Verification | Always verify HMAC | Prevent fake webhooks |
| Timing-Safe Compare | Use `hmac.compare_digest()` | Prevent timing attacks |
| HTTPS Only | Require SSL | Prevent man-in-the-middle |
| IP Whitelist | Optional: Check Koombiyo IPs | Additional security |
| Idempotency | Track processed webhook IDs | Prevent duplicate processing |
| Rate Limiting | Limit webhook requests | Prevent DoS |

### Expected Outcome
- Webhook secret setting properly configured
- Webhook URL setting defined
- Signature verification process documented
- Security best practices noted
- .env.example updated with placeholders

### Verification Checklist
- [ ] `KOOMBIYO_WEBHOOK_SECRET` setting defined
- [ ] `KOOMBIYO_WEBHOOK_URL` setting defined
- [ ] Environment variable loading implemented
- [ ] Documentation explains signature verification
- [ ] Webhook event types documented
- [ ] Security reminders added
- [ ] .env.example updated with both settings
- [ ] Settings accessible in Django code
- [ ] Comments explain when webhooks are optional

---

## Summary

This document established the foundational constants and settings configuration for Koombiyo courier API integration. We created a centralized constants module with API URLs and standard values, and a comprehensive settings module that integrates with environment variables for secure credential management across development, staging, and production environments.

### Completed Tasks
1. ✓ Created Koombiyo constants module with API endpoints and status mappings
2. ✓ Defined sandbox URL for testing environment
3. ✓ Defined production URL for live operations
4. ✓ Created Koombiyo settings module with proper structure
5. ✓ Configured API key setting with security best practices
6. ✓ Configured merchant ID setting with validation
7. ✓ Created sandbox toggle for environment selection
8. ✓ Configured webhook secret for secure webhook verification

### Next Steps
Proceed to [02_Tasks-09-16_Model-Admin-Verify.md](02_Tasks-09-16_Model-Admin-Verify.md) to create the KoombiyoConfig model with tenant-specific configuration, pickup address fields, contact details, defaults, and Django admin interface.
