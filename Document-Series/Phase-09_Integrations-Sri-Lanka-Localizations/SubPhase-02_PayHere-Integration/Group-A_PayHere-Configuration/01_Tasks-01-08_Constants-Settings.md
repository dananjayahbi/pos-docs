# Tasks 01-08: Constants and Settings Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** A - PayHere Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_URLs-Config-Verify.md](02_Tasks-09-16_URLs-Config-Verify.md)

---

## Document Overview

This document covers the creation of PayHere constants, URL configurations, and Django settings for the payment gateway integration. It establishes the foundational configuration required for PayHere payment processing, including API endpoints, sandbox and production URLs, merchant credentials, sandbox toggling, and callback URL settings.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create PayHere Constants | Low | 15 min |
| 02 | Create Sandbox URL Config | Low | 10 min |
| 03 | Create Production URL Config | Low | 10 min |
| 04 | Create PayHere Settings | Medium | 25 min |
| 05 | Create Merchant ID Setting | Low | 10 min |
| 06 | Create Merchant Secret Setting | Low | 15 min |
| 07 | Create Sandbox Toggle Setting | Low | 15 min |
| 08 | Create Notify URL Setting | Low | 15 min |

---

## Task 01: Create PayHere Constants

### Overview
Create the PayHere constants module containing all fixed API endpoint paths and configuration values. This module serves as a single source of truth for PayHere-specific constants, making the codebase maintainable and reducing the risk of typos or inconsistencies across the payment integration.

### Dependencies
- SubPhase-01 (Payment Infrastructure) must be complete
- Payment app structure is established
- Processors directory exists

### Instructions

1. **Navigate to processors directory**
   - Go to `backend/apps/payments/processors/` directory
   - This is where payment processor implementations reside
   - Verify the directory structure is in place

2. **Create payhere package directory**
   - Create new directory named `payhere`
   - This will house all PayHere-specific implementation files
   - Ensures separation from other payment processors

3. **Create package initialization file**
   - Create `__init__.py` inside `payhere/` directory
   - This makes the directory a Python package
   - Leave empty or add package-level imports

4. **Create constants module**
   - Create `constants.py` file in `payhere/` directory
   - This file will contain all PayHere constants
   - Use descriptive variable names in UPPER_CASE

5. **Define API endpoint constants**
   - Create constant for checkout endpoint path
   - Create constant for payment verification endpoint path
   - Create constant for refund endpoint path
   - Use relative paths without base URL

6. **Add payment status constants**
   - Define constants for PayHere payment statuses
   - Include: SUCCESS, PENDING, FAILED, CANCELLED, REFUNDED
   - Use string values matching PayHere API responses

7. **Add currency constant**
   - Define LKR currency constant
   - PayHere only supports LKR for Sri Lankan merchants
   - Add ISO 4217 code (LKR)

8. **Add payment method constants**
   - Define available payment methods
   - Include: CARD, MOBILE_BANKING, BANK_TRANSFER
   - Use descriptive constant names

### Constants Structure

| Category | Constants | Purpose |
|----------|-----------|---------|
| API Endpoints | CHECKOUT_ENDPOINT, VERIFY_ENDPOINT, REFUND_ENDPOINT | API paths |
| Status Values | SUCCESS, PENDING, FAILED, CANCELLED, REFUNDED | Payment states |
| Currency | CURRENCY_LKR | Supported currency |
| Payment Methods | CARD, MOBILE_BANKING, BANK_TRANSFER | Payment options |

### Endpoint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| CHECKOUT_ENDPOINT | `/pay/checkout` | Initiate payment |
| VERIFY_ENDPOINT | `/merchant/v1/payment/verify` | Verify payment status |
| REFUND_ENDPOINT | `/merchant/v1/payment/refund` | Process refund |

### Status Constants Mapping

| Constant | Value | PayHere Status | Description |
|----------|-------|----------------|-------------|
| SUCCESS | `2` | Success | Payment completed |
| PENDING | `0` | Pending | Payment initiated |
| FAILED | `-1` | Failed | Payment failed |
| CANCELLED | `-2` | Cancelled | User cancelled |
| REFUNDED | `3` | Refunded | Payment refunded |

### Payment Method Constants

| Constant | Value | Description |
|----------|-------|-------------|
| CARD | `card` | Credit/Debit cards |
| MOBILE_BANKING | `mobile` | Mobile banking apps |
| BANK_TRANSFER | `bank` | Direct bank transfer |

### Directory Structure After Task 01
```
backend/apps/payments/processors/
└── payhere/
    ├── __init__.py
    └── constants.py
```

### Expected Outcome
- PayHere package directory created with proper structure
- Constants module with all API endpoints defined
- Payment status constants matching PayHere responses
- Currency and payment method constants defined
- Clean, maintainable constant definitions

### Verification Checklist
- [ ] `backend/apps/payments/processors/payhere/` directory exists
- [ ] `__init__.py` file created in payhere directory
- [ ] `constants.py` file created with all constants
- [ ] Checkout endpoint constant defined
- [ ] Verify endpoint constant defined
- [ ] Refund endpoint constant defined
- [ ] Payment status constants defined (SUCCESS, PENDING, FAILED, etc.)
- [ ] Currency constant (LKR) defined
- [ ] Payment method constants defined
- [ ] All constants use UPPER_CASE naming convention

---

## Task 02: Create Sandbox URL Config

### Overview
Create the sandbox environment URL configuration for PayHere. The sandbox environment is used for development and testing purposes, allowing developers to test payment flows without processing real transactions. This configuration provides the base URL and related settings specific to PayHere's sandbox environment.

### Dependencies
- Task 01: Create PayHere Constants

### Instructions

1. **Open constants module**
   - Navigate to `backend/apps/payments/processors/payhere/constants.py`
   - This file was created in Task 01
   - Add sandbox configuration below existing constants

2. **Define sandbox base URL constant**
   - Create constant named `SANDBOX_BASE_URL`
   - Set value to `https://sandbox.payhere.lk`
   - This is PayHere's official sandbox endpoint

3. **Add sandbox environment indicator**
   - Create boolean constant `IS_SANDBOX_DEFAULT`
   - Set to `True` for development safety
   - This serves as default value for sandbox mode

4. **Create sandbox endpoint builder (optional)**
   - Consider adding helper constant for full URLs
   - Combine base URL with endpoint paths
   - Makes URL construction more convenient

5. **Add sandbox documentation reference**
   - Include comment with link to PayHere sandbox docs
   - Add notes about sandbox credentials
   - Document sandbox limitations if any

6. **Document sandbox characteristics**
   - Add comments explaining sandbox behavior
   - Note that sandbox doesn't process real payments
   - Mention test card numbers work in sandbox

### Sandbox Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Base URL | `https://sandbox.payhere.lk` | Sandbox endpoint |
| Default Mode | `True` | Safe default for development |
| Real Payments | No | Test environment only |

### Sandbox vs Production Comparison

| Aspect | Sandbox | Production |
|--------|---------|------------|
| Base URL | sandbox.payhere.lk | www.payhere.lk |
| Real Money | No | Yes |
| Test Cards | Accepted | Not accepted |
| Use Case | Development/Testing | Live payments |
| Credentials | Sandbox merchant ID | Live merchant ID |

### Sandbox Environment Features

| Feature | Description |
|---------|-------------|
| Test Transactions | Simulates payment processing |
| No Charges | No real money involved |
| Test Cards | Special card numbers for testing |
| Same API | Identical API structure to production |
| Quick Setup | No business verification needed |

### Test Card Numbers for Sandbox

| Card Type | Card Number | Description |
|-----------|-------------|-------------|
| Visa Success | `4916217501611292` | Always succeeds |
| Visa Failure | `4916217501611300` | Always fails |
| MasterCard | `5313581000123430` | Test MasterCard |

### Sandbox Limitations

| Limitation | Impact |
|------------|--------|
| No Real Gateway | Simulated responses only |
| Limited Features | Some features may not work |
| Test Data | Data reset periodically |
| Performance | May be slower than production |

### Expected Outcome
- Sandbox base URL constant defined
- Default sandbox mode indicator created
- Clear documentation of sandbox usage
- Foundation for environment switching

### Verification Checklist
- [ ] `SANDBOX_BASE_URL` constant defined with correct URL
- [ ] Sandbox default indicator constant created
- [ ] Comments added explaining sandbox purpose
- [ ] Documentation reference included
- [ ] Sandbox characteristics documented
- [ ] Constants follow naming conventions

---

## Task 03: Create Production URL Config

### Overview
Create the production environment URL configuration for PayHere. The production environment processes real payments from customers and requires proper merchant credentials and business verification. This configuration provides the base URL and related settings specific to PayHere's production environment.

### Dependencies
- Task 01: Create PayHere Constants
- Task 02: Create Sandbox URL Config (for consistency)

### Instructions

1. **Open constants module**
   - Navigate to `backend/apps/payments/processors/payhere/constants.py`
   - Add production configuration below sandbox config
   - Maintain consistent formatting

2. **Define production base URL constant**
   - Create constant named `PRODUCTION_BASE_URL`
   - Set value to `https://www.payhere.lk`
   - This is PayHere's official production endpoint

3. **Add production safety checks**
   - Consider adding constant for production mode verification
   - Add flags to prevent accidental production usage in development
   - Include environment validation requirements

4. **Document production requirements**
   - Add comments about business verification needs
   - Note that production requires live merchant credentials
   - Mention PCI compliance considerations

5. **Add security warnings**
   - Include comments about credential security
   - Warn against using production keys in development
   - Document environment variable requirements

6. **Create URL builder utility constants**
   - Add constants that combine base URLs with endpoints
   - Consider creating dictionary mapping for both environments
   - Make URL construction consistent

### Production Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Base URL | `https://www.payhere.lk` | Production endpoint |
| Real Payments | Yes | Live transactions |
| Security | High | PCI compliance required |

### Production Requirements

| Requirement | Description |
|-------------|-------------|
| Business Verification | PayHere must verify business |
| Live Credentials | Requires production merchant ID and secret |
| SSL Certificate | HTTPS required for callbacks |
| PCI Compliance | Must follow payment card security standards |
| Privacy Policy | Required on website |

### Production vs Sandbox URL Structure

| Component | Sandbox | Production |
|-----------|---------|------------|
| Protocol | `https://` | `https://` |
| Subdomain | `sandbox` | `www` |
| Domain | `payhere.lk` | `payhere.lk` |
| API Paths | Same as production | Same as sandbox |

### Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Credential Storage | Environment variables only |
| Secret Encryption | Encrypt merchant secret in database |
| HTTPS Required | All callbacks must use HTTPS |
| IP Whitelisting | Consider for webhook endpoints |
| Logging | Never log sensitive credentials |

### Production Environment Checks

| Check | Purpose |
|-------|---------|
| DEBUG=False | Ensure not in debug mode |
| HTTPS Enabled | Verify SSL certificate |
| Environment Variables | Confirm production credentials loaded |
| Database | Verify using production database |

### Environment Switching Logic

```
┌─────────────────────────────────────┐
│     Environment Detection           │
├─────────────────────────────────────┤
│  Is DEBUG=True?                     │
│  ├─ Yes → Use SANDBOX_BASE_URL     │
│  └─ No  → Use PRODUCTION_BASE_URL  │
│                                     │
│  PAYHERE_SANDBOX override exists?  │
│  ├─ Yes → Use specified value      │
│  └─ No  → Use DEBUG-based logic    │
└─────────────────────────────────────┘
```

### Expected Outcome
- Production base URL constant defined
- Security warnings and documentation added
- Clear distinction between sandbox and production
- Foundation for safe production deployment

### Verification Checklist
- [ ] `PRODUCTION_BASE_URL` constant defined with correct URL
- [ ] Security warnings documented in comments
- [ ] Production requirements documented
- [ ] Clear separation from sandbox configuration
- [ ] URL structure consistent with sandbox
- [ ] Environment switching logic planned

---

## Task 04: Create PayHere Settings

### Overview
Create the Django settings module for PayHere configuration. This module centralizes all PayHere-related settings in the Django settings system, including merchant credentials, environment toggles, and callback URLs. Proper settings structure enables environment-specific configurations and maintains security best practices.

### Dependencies
- Task 01: Create PayHere Constants
- Core Django settings structure exists

### Instructions

1. **Locate Django settings directory**
   - Navigate to `backend/config/settings/` directory
   - Identify the appropriate settings file (base.py, production.py, etc.)
   - Understand the project's settings structure

2. **Create PayHere settings section**
   - Add a dedicated section for PayHere configuration
   - Use clear section comments (e.g., "# PayHere Payment Gateway Settings")
   - Place after other third-party integrations

3. **Plan settings organization**
   - Group related settings together
   - Use consistent naming convention (PAYHERE_ prefix)
   - Separate credentials, URLs, and toggles

4. **Define settings reading strategy**
   - Use environment variables for sensitive data
   - Use `os.getenv()` or `django-environ` for reading
   - Set sensible defaults where appropriate

5. **Create base settings structure**
   - Define setting names that will be implemented in next tasks
   - Add placeholder comments for each setting
   - Document expected data types and formats

6. **Add settings validation placeholder**
   - Plan for settings validation on startup
   - Consider using Django system checks
   - Document required vs optional settings

7. **Document settings dependencies**
   - Note which settings require others
   - Document relationship between settings
   - Add examples in comments

### Settings Module Structure

```
┌─────────────────────────────────────┐
│  Django Settings (settings/base.py) │
├─────────────────────────────────────┤
│  # PayHere Payment Gateway          │
│  ├─ Merchant Credentials            │
│  ├─ Environment Toggle              │
│  ├─ Callback URLs                   │
│  └─ Optional Configurations         │
└─────────────────────────────────────┘
```

### Settings Categories

| Category | Settings | Purpose |
|----------|----------|---------|
| Credentials | Merchant ID, Merchant Secret | Authentication |
| Environment | Sandbox Toggle | Mode selection |
| Callbacks | Notify, Return, Cancel URLs | Payment lifecycle |
| Optional | Timeout, Retry settings | Fine-tuning |

### Settings Naming Convention

| Setting Name | Format | Example |
|--------------|--------|---------|
| All Settings | `PAYHERE_*` | `PAYHERE_MERCHANT_ID` |
| Boolean Flags | `PAYHERE_*_ENABLED` | `PAYHERE_SANDBOX` |
| URLs | `PAYHERE_*_URL` | `PAYHERE_NOTIFY_URL` |
| Credentials | `PAYHERE_*_SECRET` | `PAYHERE_MERCHANT_SECRET` |

### Settings Reading Pattern

| Method | Use Case | Example |
|--------|----------|---------|
| Required | Must have value | `os.environ['PAYHERE_MERCHANT_ID']` |
| Optional | Can be None | `os.getenv('PAYHERE_TIMEOUT', '30')` |
| Boolean | True/False flag | `os.getenv('PAYHERE_SANDBOX', 'True') == 'True'` |
| URL | Full URL paths | `os.getenv('PAYHERE_NOTIFY_URL')` |

### Environment Variables Mapping

| Django Setting | Environment Variable | Type | Required |
|----------------|---------------------|------|----------|
| PAYHERE_MERCHANT_ID | PAYHERE_MERCHANT_ID | String | Yes |
| PAYHERE_MERCHANT_SECRET | PAYHERE_MERCHANT_SECRET | String | Yes |
| PAYHERE_SANDBOX | PAYHERE_SANDBOX | Boolean | No (default: True) |
| PAYHERE_NOTIFY_URL | PAYHERE_NOTIFY_URL | URL | Yes |

### Settings File Location Strategy

| File | Settings | Purpose |
|------|----------|---------|
| base.py | Common settings | Shared across all environments |
| development.py | Dev overrides | Development-specific values |
| production.py | Prod overrides | Production-specific values |
| .env | Credentials | Secret values (not in git) |

### Settings Documentation Format

```
# Setting Name: PAYHERE_MERCHANT_ID
# Type: String
# Required: Yes
# Description: PayHere merchant identification number
# Example: '1234567'
# Environment Variable: PAYHERE_MERCHANT_ID
```

### Expected Outcome
- Dedicated section for PayHere settings in Django settings
- Clear structure for adding individual settings
- Environment variable reading strategy defined
- Documentation framework for each setting

### Verification Checklist
- [ ] PayHere settings section created in Django settings file
- [ ] Section clearly commented and separated
- [ ] Naming convention established (PAYHERE_ prefix)
- [ ] Environment variable reading method chosen
- [ ] Settings categories planned (credentials, URLs, toggles)
- [ ] Documentation format defined for each setting

---

## Task 05: Create Merchant ID Setting

### Overview
Create the merchant ID setting for PayHere integration. The merchant ID is a unique identifier provided by PayHere that identifies your business in all payment transactions. This setting is required for both sandbox and production environments and must be properly configured before any payment processing can occur.

### Dependencies
- Task 04: Create PayHere Settings

### Instructions

1. **Open Django settings file**
   - Navigate to the appropriate settings file (base.py or integrations.py)
   - Locate the PayHere settings section created in Task 04
   - Position cursor where merchant ID setting will be added

2. **Add setting documentation**
   - Add multi-line comment explaining the merchant ID
   - Document that it's provided by PayHere
   - Note that sandbox and production have different IDs

3. **Define the setting**
   - Create `PAYHERE_MERCHANT_ID` setting
   - Read value from environment variable
   - Use `os.getenv()` or equivalent method

4. **Implement required validation**
   - Make this a required setting (no default value)
   - Raise error if not provided in production
   - Consider allowing None in development with warning

5. **Add value format validation**
   - Document expected format (numeric string)
   - Note typical length (7-8 digits)
   - Add comment about obtaining from PayHere dashboard

6. **Configure environment-specific values**
   - Plan for different IDs in sandbox vs production
   - Document how to switch between environments
   - Add example values in comments (use fake IDs)

7. **Add to environment template**
   - Update `.env.example` file with this setting
   - Add explanatory comments
   - Provide placeholder value

### Merchant ID Setting Details

| Property | Value |
|----------|-------|
| Setting Name | `PAYHERE_MERCHANT_ID` |
| Environment Variable | `PAYHERE_MERCHANT_ID` |
| Type | String (numeric) |
| Required | Yes |
| Example | `'1234567'` (sandbox) |

### Merchant ID Format

| Aspect | Specification |
|--------|---------------|
| Type | Numeric string |
| Length | 7-8 characters typically |
| Characters | Digits only |
| Case | N/A |
| Example | `'1234567'` |

### Obtaining Merchant ID

| Environment | How to Obtain |
|-------------|---------------|
| Sandbox | Register at sandbox.payhere.lk → Get test merchant ID |
| Production | Complete business verification → Receive live merchant ID |

### Environment-Specific Configuration

```
┌─────────────────────────────────────┐
│     Environment Configuration       │
├─────────────────────────────────────┤
│  Development (.env.development)     │
│  └─ PAYHERE_MERCHANT_ID=1234567    │
│                                     │
│  Production (.env.production)       │
│  └─ PAYHERE_MERCHANT_ID=7654321    │
└─────────────────────────────────────┘
```

### Setting Implementation Pattern

| Step | Implementation |
|------|----------------|
| 1. Read | Get value from environment variable |
| 2. Validate | Check if value exists and valid format |
| 3. Store | Assign to Django setting |
| 4. Document | Add inline comments |

### Validation Requirements

| Check | Requirement | Error Message |
|-------|-------------|---------------|
| Not Empty | Value must exist | "PAYHERE_MERCHANT_ID is required" |
| Format | Must be numeric string | "PAYHERE_MERCHANT_ID must be numeric" |
| Length | Should be 6-10 chars | Warning only (format may vary) |

### Environment File Template Entry

```
# PayHere Merchant ID
# Obtain from PayHere dashboard
# Sandbox: Use test merchant ID from sandbox.payhere.lk
# Production: Use live merchant ID from payhere.lk
PAYHERE_MERCHANT_ID=your_merchant_id_here
```

### Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Not Secret | Can be in version control (but not recommended) |
| Environment-Specific | Different values for different environments |
| Validation | Validate format on application startup |
| Documentation | Keep track of which ID is for which environment |

### Expected Outcome
- Merchant ID setting properly configured in Django settings
- Environment variable reading implemented
- Required validation in place
- Documentation clear and complete
- Environment template updated

### Verification Checklist
- [ ] `PAYHERE_MERCHANT_ID` setting added to Django settings
- [ ] Setting reads from environment variable
- [ ] Documentation comments added above setting
- [ ] Required validation implemented
- [ ] Format validation documented
- [ ] `.env.example` file updated with template
- [ ] Example values provided in comments
- [ ] Distinction between sandbox and production IDs documented

---

## Task 06: Create Merchant Secret Setting

### Overview
Create the merchant secret setting for PayHere integration. The merchant secret is a confidential key used to sign and verify payment requests and responses. This setting requires maximum security as it proves your application's authenticity to PayHere and prevents unauthorized payment manipulation.

### Dependencies
- Task 04: Create PayHere Settings
- Task 05: Create Merchant ID Setting (for consistency)

### Instructions

1. **Open Django settings file**
   - Navigate to the PayHere settings section
   - Position below merchant ID setting
   - Maintain consistent formatting

2. **Add security warning documentation**
   - Add prominent comment warning about secret security
   - Note that this should NEVER be exposed or logged
   - Document that different secrets exist for sandbox vs production

3. **Define the setting**
   - Create `PAYHERE_MERCHANT_SECRET` setting
   - Read value from environment variable
   - Never provide a default value (security)

4. **Implement strict validation**
   - Make this strictly required with no exceptions
   - Raise clear error if missing
   - Fail application startup if not configured

5. **Add security guidelines**
   - Document that secret should never be in version control
   - Never log this value in any circumstance
   - Use environment variables only
   - Encrypt if storing in database

6. **Plan secret rotation strategy**
   - Document how to rotate secrets safely
   - Add notes about grace period during rotation
   - Consider versioning mechanism

7. **Update environment template with warnings**
   - Add to `.env.example` with strong security warnings
   - Use placeholder that clearly isn't real
   - Document how to obtain from PayHere

### Merchant Secret Setting Details

| Property | Value |
|----------|-------|
| Setting Name | `PAYHERE_MERCHANT_SECRET` |
| Environment Variable | `PAYHERE_MERCHANT_SECRET` |
| Type | String (alphanumeric) |
| Required | Yes (strict) |
| Security Level | Maximum |

### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Never in Code | Only in environment variables |
| Never Logged | Exclude from all logging |
| Never Exposed | Never sent to frontend |
| Encrypted Storage | Encrypt if in database |
| Limited Access | Only backend processes |

### Secret Format

| Aspect | Specification |
|--------|---------------|
| Type | Alphanumeric string |
| Length | Varies (typically 32+ characters) |
| Characters | Letters, numbers, special chars possible |
| Case Sensitive | Yes |

### Obtaining Merchant Secret

| Environment | How to Obtain |
|-------------|---------------|
| Sandbox | PayHere sandbox dashboard → API credentials |
| Production | PayHere production dashboard → API credentials (after verification) |

### Secret Storage Best Practices

```
┌─────────────────────────────────────┐
│      Secret Storage Priority        │
├─────────────────────────────────────┤
│  1. Environment Variables (.env)    │
│     ├─ Not in version control       │
│     └─ Server environment only      │
│                                     │
│  2. Secrets Management Service      │
│     ├─ AWS Secrets Manager          │
│     ├─ Azure Key Vault              │
│     └─ HashiCorp Vault              │
│                                     │
│  ✗ NEVER in code                    │
│  ✗ NEVER in version control         │
│  ✗ NEVER in logs                    │
│  ✗ NEVER in frontend                │
└─────────────────────────────────────┘
```

### Secret Validation

| Check | Requirement | Error Message |
|-------|-------------|---------------|
| Exists | Must be provided | "PAYHERE_MERCHANT_SECRET is required" |
| Not Empty | Must have value | "PAYHERE_MERCHANT_SECRET cannot be empty" |
| Min Length | At least 20 chars | "PAYHERE_MERCHANT_SECRET too short" |

### Environment File Template Entry

```
# PayHere Merchant Secret
# ⚠️ CRITICAL: Keep this secret secure!
# ⚠️ NEVER commit real secret to version control
# ⚠️ NEVER expose to frontend or logs
# Obtain from PayHere dashboard → API Credentials
# Sandbox: Use test merchant secret
# Production: Use live merchant secret
PAYHERE_MERCHANT_SECRET=your_secret_key_here_NEVER_COMMIT_REAL_VALUE
```

### Secret Rotation Process

| Step | Action | Consideration |
|------|--------|---------------|
| 1. Generate | Get new secret from PayHere | Keep old one active |
| 2. Update | Add new secret to environment | Test in staging first |
| 3. Deploy | Deploy with new secret | Monitor for errors |
| 4. Verify | Confirm payments working | Allow grace period |
| 5. Deactivate | Remove old secret | After sufficient time |

### Security Incidents Handling

| Scenario | Action |
|----------|--------|
| Secret Exposed | Rotate immediately, notify PayHere |
| Committed to Git | Rotate, update repository history |
| Found in Logs | Rotate, fix logging code |
| Unauthorized Access | Rotate, investigate access |

### Expected Outcome
- Merchant secret setting configured with maximum security
- Strong validation preventing startup without secret
- Clear security warnings and documentation
- Environment template with security notices
- No defaults or fallbacks for this critical value

### Verification Checklist
- [ ] `PAYHERE_MERCHANT_SECRET` setting added to Django settings
- [ ] Setting reads from environment variable only
- [ ] No default value provided
- [ ] Security warnings documented prominently
- [ ] Required validation implemented (strict)
- [ ] `.env.example` updated with security warnings
- [ ] Placeholder value clearly not real
- [ ] Documented never to log this value
- [ ] Encryption strategy documented for database storage

---

## Task 07: Create Sandbox Toggle Setting

### Overview
Create the sandbox toggle setting that controls whether PayHere operates in sandbox (test) or production (live) mode. This setting provides a safe mechanism to switch between environments, with smart defaults that prevent accidentally using production mode in development and vice versa.

### Dependencies
- Task 04: Create PayHere Settings
- Task 06: Create Merchant Secret Setting (for setting sequence)

### Instructions

1. **Open Django settings file**
   - Navigate to the PayHere settings section
   - Position below credential settings
   - Add environment control subsection comment

2. **Add setting documentation**
   - Document purpose of sandbox toggle
   - Explain behavior in different environments
   - Note relationship with DEBUG setting

3. **Define the setting**
   - Create `PAYHERE_SANDBOX` setting
   - Read value from environment variable
   - Implement smart default based on DEBUG setting

4. **Implement DEBUG-based default**
   - Default to True when DEBUG=True (development)
   - Default to False when DEBUG=False (production)
   - Allow explicit override via environment variable

5. **Add safety checks**
   - Warn if DEBUG=True but PAYHERE_SANDBOX=False
   - Warn if DEBUG=False but PAYHERE_SANDBOX=True
   - Consider preventing production mode in development

6. **Document toggle behavior**
   - Explain what changes when toggled
   - Note that it switches between sandbox and production URLs
   - Document credential differences

7. **Update environment template**
   - Add PAYHERE_SANDBOX to `.env.example`
   - Document default behavior
   - Provide examples for different scenarios

### Sandbox Toggle Details

| Property | Value |
|----------|-------|
| Setting Name | `PAYHERE_SANDBOX` |
| Environment Variable | `PAYHERE_SANDBOX` |
| Type | Boolean |
| Default | True if DEBUG=True, False if DEBUG=False |
| Required | No (has default) |

### Toggle Behavior

| DEBUG | PAYHERE_SANDBOX (default) | Result |
|-------|---------------------------|--------|
| True | True | Sandbox mode (safe) |
| False | False | Production mode (safe) |
| True | False | Production in dev (warning) |
| False | True | Sandbox in prod (warning) |

### Environment-Based Logic

```
┌─────────────────────────────────────┐
│    Sandbox Toggle Logic             │
├─────────────────────────────────────┤
│  Check PAYHERE_SANDBOX env var      │
│  ├─ Explicitly set? Use that value │
│  └─ Not set? Use DEBUG as default  │
│                                     │
│  Validate combination:              │
│  ├─ DEBUG=True + SANDBOX=False     │
│  │   → Warning: Prod mode in dev   │
│  └─ DEBUG=False + SANDBOX=True     │
│      → Warning: Sandbox in prod    │
└─────────────────────────────────────┘
```

### What Changes with Toggle

| Aspect | Sandbox (True) | Production (False) |
|--------|----------------|-------------------|
| Base URL | sandbox.payhere.lk | www.payhere.lk |
| Credentials | Test merchant ID/secret | Live merchant ID/secret |
| Payments | Simulated | Real transactions |
| Test Cards | Accepted | Not accepted |
| Real Money | No | Yes |

### Safe Environment Configurations

| Environment | DEBUG | PAYHERE_SANDBOX | Status |
|-------------|-------|-----------------|--------|
| Local Dev | True | True | ✓ Safe |
| Staging | False | True | ✓ Safe (testing) |
| Production | False | False | ✓ Safe |

### Unsafe Environment Configurations

| Environment | DEBUG | PAYHERE_SANDBOX | Issue |
|-------------|-------|-----------------|-------|
| Local Dev | True | False | ⚠️ Real payments in dev |
| Production | True | Any | ⚠️ Debug mode in production |
| Production | False | True | ⚠️ Sandbox in production |

### Boolean Value Parsing

| String Value | Parsed As | Result |
|--------------|-----------|--------|
| "True" | Boolean | True |
| "true" | Boolean | True |
| "1" | Boolean | True |
| "False" | Boolean | False |
| "false" | Boolean | False |
| "0" | Boolean | False |
| Empty/None | Default | Based on DEBUG |

### Environment File Template Entry

```
# PayHere Sandbox Mode
# Controls whether to use sandbox (test) or production (live) mode
# Default: True if DEBUG=True, False if DEBUG=False
# Development: Leave as True or unset
# Production: Set to False explicitly
# Values: True, False
PAYHERE_SANDBOX=True
```

### Setting Implementation Pattern

| Step | Implementation |
|------|----------------|
| 1. Read | Get PAYHERE_SANDBOX from environment |
| 2. Default | If not set, use DEBUG value |
| 3. Parse | Convert string to boolean |
| 4. Validate | Check for unsafe combinations |
| 5. Warn | Log warnings for suspicious configurations |

### Expected Outcome
- Sandbox toggle setting with smart defaults
- Automatic mode selection based on DEBUG
- Safety warnings for misconfigured environments
- Clear documentation of behavior
- Explicit override capability

### Verification Checklist
- [ ] `PAYHERE_SANDBOX` setting added to Django settings
- [ ] Default value based on DEBUG setting
- [ ] Environment variable override implemented
- [ ] Boolean value parsing correct
- [ ] Safety warnings for misconfigurations documented
- [ ] `.env.example` updated with toggle setting
- [ ] Documentation explains default behavior
- [ ] Relationship with DEBUG setting clear

---

## Task 08: Create Notify URL Setting

### Overview
Create the notify URL setting for PayHere webhooks. The notify URL is the endpoint where PayHere sends payment status notifications (IPN - Instant Payment Notification). This is a critical callback URL that must be publicly accessible and properly configured for payment verification to work correctly.

### Dependencies
- Task 04: Create PayHere Settings
- Task 07: Create Sandbox Toggle Setting (for setting sequence)

### Instructions

1. **Open Django settings file**
   - Navigate to the PayHere settings section
   - Add callback URLs subsection comment
   - Position below environment control settings

2. **Add notify URL documentation**
   - Document purpose of notify URL
   - Explain IPN (Instant Payment Notification)
   - Note that this must be publicly accessible

3. **Define the setting**
   - Create `PAYHERE_NOTIFY_URL` setting
   - Read value from environment variable
   - Make this setting required

4. **Define URL format requirements**
   - Must be full URL (not relative path)
   - Must use HTTPS in production
   - Must be publicly accessible from internet
   - Should include /api/webhooks/payhere/ path

5. **Add validation requirements**
   - Document URL format validation
   - Note HTTPS requirement for production
   - Add path structure guidelines

6. **Document URL construction**
   - Explain how to build URL for different environments
   - Local dev: Use ngrok or similar tunnel
   - Staging/Production: Use actual domain
   - Note that localhost URLs won't work

7. **Add PayHere dashboard configuration note**
   - Document that this URL must be configured in PayHere dashboard
   - Note that PayHere will send POST requests to this URL
   - Mention IP whitelisting if applicable

8. **Update environment template**
   - Add PAYHERE_NOTIFY_URL to `.env.example`
   - Provide example URL format
   - Add development vs production notes

### Notify URL Setting Details

| Property | Value |
|----------|-------|
| Setting Name | `PAYHERE_NOTIFY_URL` |
| Environment Variable | `PAYHERE_NOTIFY_URL` |
| Type | String (URL) |
| Required | Yes |
| Format | Full URL with HTTPS |
| Example | `https://yourdomain.com/api/webhooks/payhere/` |

### Notify URL Format

| Component | Requirement | Example |
|-----------|-------------|---------|
| Protocol | HTTPS (production) | `https://` |
| Domain | Your application domain | `yourdomain.com` |
| Path | Webhook endpoint path | `/api/webhooks/payhere/` |
| Query Params | Optional | `?source=payhere` |

### URL Requirements by Environment

| Environment | Protocol | Domain | Example |
|-------------|----------|--------|---------|
| Local Dev | HTTP/HTTPS | ngrok/localhost tunnel | `https://abc123.ngrok.io/api/webhooks/payhere/` |
| Staging | HTTPS | Staging domain | `https://staging.yourdomain.com/api/webhooks/payhere/` |
| Production | HTTPS | Production domain | `https://yourdomain.com/api/webhooks/payhere/` |

### IPN (Instant Payment Notification) Flow

```
┌─────────────────────────────────────┐
│   Payment IPN Flow                  │
├─────────────────────────────────────┤
│  1. Customer completes payment      │
│     on PayHere                      │
│           │                         │
│           ▼                         │
│  2. PayHere sends POST request      │
│     to NOTIFY_URL                   │
│           │                         │
│           ▼                         │
│  3. Your webhook receives           │
│     payment data                    │
│           │                         │
│           ▼                         │
│  4. Verify payment with PayHere API │
│           │                         │
│           ▼                         │
│  5. Update payment status in DB     │
└─────────────────────────────────────┘
```

### Webhook Data Sent by PayHere

| Field | Description | Example |
|-------|-------------|---------|
| merchant_id | Your merchant ID | `1234567` |
| order_id | Your order reference | `ORDER-001` |
| payment_id | PayHere payment ID | `320012345678` |
| payhere_amount | Payment amount | `1000.00` |
| payhere_currency | Currency | `LKR` |
| status_code | Payment status | `2` (success) |
| md5sig | Security signature | Hash value |

### URL Validation Requirements

| Check | Requirement | Error Message |
|-------|-------------|---------------|
| Not Empty | Must have value | "PAYHERE_NOTIFY_URL is required" |
| Valid URL | Must be proper URL format | "PAYHERE_NOTIFY_URL must be valid URL" |
| HTTPS | HTTPS required in production | "PAYHERE_NOTIFY_URL must use HTTPS" |
| Public | Must be publicly accessible | "PAYHERE_NOTIFY_URL must be public" |

### Local Development Setup

| Tool | Purpose | Example |
|------|---------|---------|
| ngrok | Create public tunnel | `ngrok http 8000` |
| localtunnel | Alternative to ngrok | `lt --port 8000` |
| serveo | SSH-based tunnel | `ssh -R 80:localhost:8000 serveo.net` |

### PayHere Dashboard Configuration

| Step | Action |
|------|--------|
| 1. Login | Access PayHere merchant dashboard |
| 2. Navigate | Go to Settings → API Configuration |
| 3. Enter URL | Input notify URL |
| 4. Save | Save configuration |
| 5. Test | Use PayHere test payment to verify |

### Environment File Template Entry

```
# PayHere Notify URL (Webhook endpoint)
# This is where PayHere sends payment status notifications
# Must be publicly accessible (PayHere needs to reach it)
# Format: https://yourdomain.com/api/webhooks/payhere/
# 
# Local Development:
#   - Use ngrok or similar: https://abc123.ngrok.io/api/webhooks/payhere/
#   - Localhost URLs won't work (not publicly accessible)
#
# Production:
#   - Must use HTTPS
#   - Use your actual domain
#
# Note: Configure this URL in PayHere dashboard as well
PAYHERE_NOTIFY_URL=https://yourdomain.com/api/webhooks/payhere/
```

### Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Signature Verification | Verify md5sig from PayHere |
| IP Whitelisting | Consider whitelisting PayHere IPs |
| HTTPS Required | Encrypt data in transit |
| Request Validation | Validate all incoming data |

### Expected Outcome
- Notify URL setting properly configured
- Required validation in place
- Clear documentation for setup
- Environment-specific configuration examples
- Foundation for webhook implementation

### Verification Checklist
- [ ] `PAYHERE_NOTIFY_URL` setting added to Django settings
- [ ] Setting reads from environment variable
- [ ] Required validation implemented
- [ ] URL format requirements documented
- [ ] HTTPS requirement noted for production
- [ ] IPN flow explained
- [ ] `.env.example` updated with notify URL
- [ ] Local development setup documented (ngrok)
- [ ] PayHere dashboard configuration noted
- [ ] Security considerations documented

---

## Summary

This document established the foundational configuration for PayHere payment gateway integration, including constants, URL configurations, and core Django settings. These elements provide the base layer for PayHere payment processing with proper environment management and security.

### Completed Tasks
1. ✓ Created PayHere constants with API endpoints and status codes
2. ✓ Created sandbox URL configuration for development/testing
3. ✓ Created production URL configuration for live payments
4. ✓ Created PayHere settings structure in Django settings
5. ✓ Created merchant ID setting for authentication
6. ✓ Created merchant secret setting with maximum security
7. ✓ Created sandbox toggle setting with smart defaults
8. ✓ Created notify URL setting for payment webhooks

### Configuration Summary

| Component | Status | Purpose |
|-----------|--------|---------|
| Constants Module | ✓ Complete | API endpoints and values |
| Sandbox URLs | ✓ Complete | Development environment |
| Production URLs | ✓ Complete | Live environment |
| Merchant ID | ✓ Complete | Authentication identifier |
| Merchant Secret | ✓ Complete | Authentication secret |
| Sandbox Toggle | ✓ Complete | Environment control |
| Notify URL | ✓ Complete | Webhook endpoint |

### Next Steps
Proceed to [02_Tasks-09-16_URLs-Config-Verify.md](02_Tasks-09-16_URLs-Config-Verify.md) to create remaining callback URLs (return, cancel), implement the PayHere config model, add encryption, validation, environment detection, client initialization, and verify the complete configuration.

---

**Document Status:** Complete  
**Tasks Covered:** 01-08  
**Next Document:** [02_Tasks-09-16_URLs-Config-Verify.md](02_Tasks-09-16_URLs-Config-Verify.md)
