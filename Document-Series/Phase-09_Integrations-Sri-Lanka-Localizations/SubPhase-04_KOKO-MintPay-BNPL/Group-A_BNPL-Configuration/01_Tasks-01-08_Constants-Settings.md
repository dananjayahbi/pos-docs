# Tasks 01-08: BNPL Constants and Settings

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** A - BNPL Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Config-Verify.md](02_Tasks-09-16_Config-Verify.md)

---

## Document Overview

This document covers the creation of BNPL constants and settings configuration for both KOKO and MintPay providers. It establishes the foundational configuration for Buy Now Pay Later integrations with Sri Lankan payment providers, including API URL constants, environment-specific configurations, and Django settings modules with required API keys and merchant identifiers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create BNPL Constants | Low | 20 min |
| 02 | Create KOKO Sandbox URL | Low | 15 min |
| 03 | Create KOKO Production URL | Low | 15 min |
| 04 | Create MintPay Sandbox URL | Low | 15 min |
| 05 | Create MintPay Production URL | Low | 15 min |
| 06 | Create KOKO Settings | Medium | 30 min |
| 07 | Create KOKO API Key | Low | 15 min |
| 08 | Create KOKO Merchant ID | Low | 15 min |

---

## Task 01: Create BNPL Constants

### Overview
Create the foundational constants file for BNPL operations that will serve both KOKO and MintPay providers. This constants module defines API endpoints, payment statuses, error codes, and other immutable values used throughout the BNPL integration.

### Dependencies
- SubPhase-01 (Payment Gateway Infrastructure) must be complete
- Django project structure is established
- Backend payment apps structure is set up

### Instructions

1. **Navigate to the KOKO processor directory**
   - Go to `backend/apps/payments/processors/koko/` directory
   - This directory should exist from SubPhase-01 setup

2. **Create the KOKO constants file**
   - Create new file named `constants.py`
   - This will hold KOKO-specific constants and shared BNPL constants

3. **Define BNPL status constants**
   - Create constants for payment statuses: PENDING, APPROVED, REJECTED, CANCELLED
   - Define installment statuses: ACTIVE, PAID, OVERDUE, DEFAULTED
   - Add validation status constants for eligibility checks

4. **Define API endpoint constants**
   - Create constants for common BNPL endpoints
   - Include KOKO-specific endpoints: `/checkout`, `/verify`, `/eligibility`
   - Define HTTP methods for each endpoint

5. **Define payment plan constants**
   - Create constants for installment plans: 3, 4, 6 months
   - Define minimum and maximum payment amounts
   - Add currency constants (LKR only for Sri Lanka)

6. **Define error code constants**
   - Create constants for common BNPL error codes
   - Include validation error messages
   - Add API response status codes

7. **Create MintPay constants file**
   - Navigate to `backend/apps/payments/processors/mintpay/` directory
   - Create `constants.py` file for MintPay-specific constants
   - Define MintPay endpoints: `/payment`, `/status`, `/check`

### BNPL Status Constants Structure

| Category | Constants | Values |
|----------|-----------|--------|
| Payment Status | PENDING, APPROVED, REJECTED, CANCELLED | String values |
| Installment Status | ACTIVE, PAID, OVERDUE, DEFAULTED | String values |
| Validation Status | ELIGIBLE, INELIGIBLE, UNKNOWN | String values |

### API Endpoint Constants

| Provider | Endpoint | Purpose |
|----------|----------|---------|
| KOKO | `/checkout` | Initiate BNPL payment |
| KOKO | `/verify` | Verify payment status |
| KOKO | `/eligibility` | Check customer eligibility |
| MintPay | `/payment` | Process BNPL payment |
| MintPay | `/status` | Get payment status |
| MintPay | `/check` | Eligibility verification |

### Payment Plan Constants

| Plan | Duration | Payments | Target Market |
|------|----------|----------|---------------|
| Short Term | 3 months | 3 equal installments | Small purchases |
| Standard | 4 months | 4 equal installments | Medium purchases |
| Extended | 6 months | 6 equal installments | Large purchases |

### Error Code Constants

| Category | Code Range | Purpose |
|----------|------------|---------|
| Validation | 4000-4099 | Input validation errors |
| Eligibility | 4100-4199 | Customer eligibility issues |
| Payment | 4200-4299 | Payment processing errors |
| System | 5000-5099 | Internal system errors |

### Expected Outcome
- KOKO constants file with comprehensive BNPL constants
- MintPay constants file with provider-specific values
- Consistent naming conventions across both providers
- Well-documented constants for future maintenance

### Verification Checklist
- [ ] `backend/apps/payments/processors/koko/constants.py` created
- [ ] `backend/apps/payments/processors/mintpay/constants.py` created
- [ ] Payment status constants defined
- [ ] API endpoint constants defined
- [ ] Payment plan constants defined
- [ ] Error code constants defined
- [ ] Constants follow Python naming conventions (UPPER_CASE)

---

## Task 02: Create KOKO Sandbox URL

### Overview
Configure KOKO sandbox environment URL for development and testing purposes. The sandbox environment provides a safe testing environment for BNPL integration without processing real payments or affecting production data.

### Dependencies
- Task 01: Create BNPL Constants

### Instructions

1. **Define sandbox base URL constant**
   - Add KOKO sandbox base URL to the KOKO constants file
   - Use KOKO's official sandbox URL (obtain from KOKO documentation)
   - Ensure URL includes proper protocol (HTTPS)

2. **Create sandbox endpoint URLs**
   - Combine base URL with endpoint paths from Task 01
   - Create full URLs for checkout, verify, and eligibility endpoints
   - Ensure URLs are properly formatted and tested

3. **Add sandbox configuration flags**
   - Create boolean constant to identify sandbox environment
   - Add debugging flags for sandbox-specific logging
   - Include rate limiting constants for sandbox testing

4. **Define sandbox-specific settings**
   - Add sandbox merchant ID placeholder
   - Create sandbox API key placeholder constants
   - Include test data constants for sandbox testing

5. **Document sandbox limitations**
   - Add comments about sandbox restrictions
   - Document test scenarios supported
   - Note differences from production environment

### KOKO Sandbox Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| SANDBOX_BASE_URL | KOKO sandbox URL | API base endpoint |
| IS_SANDBOX | True | Environment identification |
| RATE_LIMIT | Higher limits | Testing flexibility |
| DEBUG_MODE | True | Enhanced logging |

### Sandbox Endpoint Structure

```
Base URL: https://sandbox.koko.lk/api/v1/
├── checkout/     # Payment initiation
├── verify/       # Payment verification  
├── eligibility/  # Customer eligibility
└── webhook/      # Payment notifications
```

### Sandbox Testing Features

| Feature | Description | Testing Capability |
|---------|-------------|-------------------|
| Mock Payments | Simulated transactions | End-to-end flow testing |
| Test Cards | Predefined card numbers | Various scenario testing |
| Instant Responses | No real processing delays | Rapid development |
| Reset Capability | Clear test data | Clean testing environment |

### Environment Detection

| Method | Implementation | Purpose |
|--------|----------------|---------|
| Settings Flag | KOKO_USE_SANDBOX = True | Manual environment control |
| Environment Variable | ENVIRONMENT = 'sandbox' | Automatic detection |
| URL Pattern | URL contains 'sandbox' | Validation check |

### Expected Outcome
- KOKO sandbox URL constants properly configured
- Environment detection mechanisms in place
- Testing-friendly configuration for development
- Clear documentation of sandbox capabilities

### Verification Checklist
- [ ] KOKO sandbox base URL constant defined
- [ ] Sandbox endpoint URLs constructed correctly
- [ ] Environment detection flags added
- [ ] Sandbox-specific configuration documented
- [ ] URL format validation implemented

---

## Task 03: Create KOKO Production URL

### Overview
Configure KOKO production environment URL for live payment processing. The production configuration ensures secure, reliable BNPL payment processing for real customer transactions with proper error handling and monitoring.

### Dependencies
- Task 01: Create BNPL Constants
- Task 02: Create KOKO Sandbox URL (for reference)

### Instructions

1. **Define production base URL constant**
   - Add KOKO production base URL to the constants file
   - Use KOKO's official production URL from their documentation
   - Ensure URL uses HTTPS protocol for security

2. **Create production endpoint URLs**
   - Combine production base URL with endpoint paths
   - Create full URLs for all KOKO endpoints
   - Validate URL formats and accessibility

3. **Add production security settings**
   - Create constants for production security requirements
   - Define SSL/TLS verification settings
   - Add timeout constants for production reliability

4. **Define production monitoring constants**
   - Add logging level constants for production
   - Create error reporting thresholds
   - Include performance monitoring flags

5. **Implement production safeguards**
   - Add production environment validation
   - Create constants for rate limiting
   - Define fallback mechanisms for failures

### KOKO Production Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| PRODUCTION_BASE_URL | KOKO production URL | Live API endpoint |
| IS_PRODUCTION | True | Environment identification |
| SSL_VERIFY | True | Security enforcement |
| TIMEOUT | 30 seconds | Reliability setting |

### Production Endpoint Structure

```
Base URL: https://api.koko.lk/v1/
├── checkout/     # Live payment processing
├── verify/       # Real-time verification
├── eligibility/  # Live eligibility checks
└── webhook/      # Production notifications
```

### Production Security Features

| Security Layer | Implementation | Purpose |
|----------------|----------------|---------|
| HTTPS Only | SSL/TLS enforcement | Data encryption |
| API Authentication | Key-based access | Request validation |
| Rate Limiting | Request throttling | System protection |
| Request Signing | HMAC signatures | Request integrity |

### Production Monitoring

| Metric | Threshold | Action |
|--------|-----------|--------|
| Response Time | > 5 seconds | Alert operations |
| Error Rate | > 1% | Investigate immediately |
| Availability | < 99.5% | Escalate to KOKO |

### Environment Validation

| Check | Method | Failure Action |
|-------|--------|----------------|
| API Key Present | Setting verification | Raise configuration error |
| Merchant ID Valid | Format validation | Log error and fail |
| URL Reachable | Connectivity test | Use fallback or fail gracefully |

### Expected Outcome
- KOKO production URL constants securely configured
- Production-grade security settings implemented
- Monitoring and alerting mechanisms in place
- Robust error handling for production scenarios

### Verification Checklist
- [ ] KOKO production base URL constant defined
- [ ] Production endpoint URLs configured
- [ ] Security settings implemented (HTTPS, SSL verification)
- [ ] Monitoring and logging constants added
- [ ] Production environment validation implemented
- [ ] Rate limiting and timeout constants defined

---

## Task 04: Create MintPay Sandbox URL

### Overview
Configure MintPay sandbox environment URL for development and testing of BNPL integration. The MintPay sandbox provides testing capabilities for their payment processing system with simulated transactions and test scenarios.

### Dependencies
- Task 01: Create BNPL Constants
- Task 02: Create KOKO Sandbox URL (for consistency reference)

### Instructions

1. **Define MintPay sandbox base URL**
   - Add MintPay sandbox base URL to MintPay constants file
   - Use MintPay's official sandbox endpoint from documentation
   - Ensure HTTPS protocol for secure testing

2. **Create MintPay sandbox endpoints**
   - Combine base URL with MintPay-specific endpoint paths
   - Create full URLs for payment, status, and check endpoints
   - Validate endpoint accessibility and format

3. **Add MintPay sandbox configuration**
   - Create sandbox identification flags
   - Add testing-specific configuration options
   - Include sandbox rate limiting settings

4. **Define MintPay test data constants**
   - Add test merchant credentials placeholders
   - Create test transaction amount constants
   - Include test customer data templates

5. **Implement sandbox debugging features**
   - Add enhanced logging for sandbox environment
   - Create debug mode flags for detailed tracing
   - Include test scenario constants

### MintPay Sandbox Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| MINTPAY_SANDBOX_URL | MintPay sandbox URL | Testing API endpoint |
| MINTPAY_IS_SANDBOX | True | Environment flag |
| MINTPAY_DEBUG | True | Enhanced testing logs |
| MINTPAY_TEST_MODE | True | Test transaction mode |

### MintPay Endpoint Structure

```
Base URL: https://sandbox.mintpay.lk/api/
├── payment/      # BNPL payment initiation
├── status/       # Payment status inquiry
├── check/        # Eligibility verification
└── notify/       # Payment notifications
```

### MintPay Testing Features

| Feature | Description | Testing Value |
|---------|-------------|---------------|
| Mock Customers | Predefined test customers | Eligibility testing |
| Test Scenarios | Success/failure cases | Error handling validation |
| Instant Processing | No real payment delays | Rapid development |
| Transaction Reset | Clear test history | Clean slate testing |

### MintPay Test Constants

| Constant | Value | Usage |
|----------|-------|-------|
| TEST_AMOUNT_MIN | 5000 LKR | Minimum test amount |
| TEST_AMOUNT_MAX | 250000 LKR | Maximum test amount |
| TEST_CUSTOMER_ID | "TEST_CUST_001" | Default test customer |
| TEST_MERCHANT_ID | "TEST_MERCH_001" | Test merchant identifier |

### Sandbox Environment Detection

| Method | Implementation | Reliability |
|--------|----------------|-------------|
| URL Pattern | 'sandbox' in URL | High |
| Environment Variable | MINTPAY_ENV = 'sandbox' | High |
| Configuration Flag | MINTPAY_USE_SANDBOX | Manual control |

### Expected Outcome
- MintPay sandbox URL constants properly configured
- Testing environment clearly identified and isolated
- Comprehensive test data constants available
- Debug and logging capabilities enabled for development

### Verification Checklist
- [ ] MintPay sandbox base URL constant defined
- [ ] Sandbox endpoint URLs created and validated
- [ ] Sandbox environment flags configured
- [ ] Test data constants defined
- [ ] Debug and logging settings enabled
- [ ] Environment detection mechanisms implemented

---

## Task 05: Create MintPay Production URL

### Overview
Configure MintPay production environment URL for live BNPL payment processing. The production configuration ensures secure, reliable payment processing for real customer transactions with proper security measures and monitoring capabilities.

### Dependencies
- Task 01: Create BNPL Constants
- Task 04: Create MintPay Sandbox URL (for consistency)

### Instructions

1. **Define MintPay production base URL**
   - Add MintPay production base URL to constants file
   - Use MintPay's official production endpoint
   - Ensure HTTPS protocol for security compliance

2. **Create MintPay production endpoints**
   - Combine production base URL with endpoint paths
   - Create full URLs for payment, status, and check endpoints
   - Validate production endpoint accessibility

3. **Add production security configuration**
   - Create SSL/TLS verification constants
   - Define request timeout values for production
   - Add security headers requirements

4. **Define production reliability settings**
   - Add retry logic constants for failed requests
   - Create circuit breaker thresholds
   - Include fallback mechanism configurations

5. **Implement production monitoring**
   - Add performance monitoring constants
   - Create error threshold definitions
   - Include alerting configuration constants

### MintPay Production Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| MINTPAY_PRODUCTION_URL | MintPay production URL | Live API endpoint |
| MINTPAY_IS_PRODUCTION | True | Production environment flag |
| MINTPAY_SSL_VERIFY | True | Security enforcement |
| MINTPAY_TIMEOUT | 30 seconds | Request timeout |

### Production Endpoint Structure

```
Base URL: https://api.mintpay.lk/
├── payment/      # Live BNPL processing
├── status/       # Real-time status checks
├── check/        # Live eligibility verification
└── notify/       # Production webhooks
```

### Production Security Measures

| Security Feature | Implementation | Protection Level |
|------------------|----------------|------------------|
| TLS 1.2+ | Enforced encryption | High |
| API Key Validation | Required authentication | Critical |
| Request Signatures | HMAC validation | High |
| Rate Limiting | Request throttling | Medium |

### Production Reliability Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| MAX_RETRIES | 3 attempts | Handle temporary failures |
| RETRY_DELAY | 2 seconds | Exponential backoff |
| CIRCUIT_BREAKER | 5 failures | Prevent cascade failures |
| HEALTH_CHECK | 60 seconds | Monitor availability |

### Production Monitoring Metrics

| Metric | Threshold | Alert Level |
|--------|-----------|-------------|
| Response Time | > 3 seconds | Warning |
| Error Rate | > 0.5% | Critical |
| Availability | < 99.9% | Critical |
| Timeout Rate | > 1% | Warning |

### Production Environment Validation

| Validation | Check | Failure Handling |
|------------|-------|------------------|
| API Connectivity | Health check endpoint | Graceful degradation |
| Credentials Valid | Authentication test | Configuration error |
| SSL Certificate | Certificate validation | Security alert |

### Expected Outcome
- MintPay production URL constants securely configured
- Production-grade security and reliability settings
- Comprehensive monitoring and alerting capabilities
- Robust error handling and fallback mechanisms

### Verification Checklist
- [ ] MintPay production base URL constant defined
- [ ] Production endpoint URLs configured and validated
- [ ] Security settings implemented (HTTPS, SSL, timeouts)
- [ ] Reliability settings configured (retries, circuit breaker)
- [ ] Monitoring constants defined
- [ ] Production environment validation implemented

---

## Task 06: Create KOKO Settings

### Overview
Create Django settings module for KOKO BNPL integration with proper configuration management. This settings module will handle environment-specific configurations, API credentials, and operational parameters for KOKO payment processing.

### Dependencies
- Task 01: Create BNPL Constants
- Task 02: Create KOKO Sandbox URL
- Task 03: Create KOKO Production URL

### Instructions

1. **Create KOKO settings configuration file**
   - Navigate to `backend/apps/payments/processors/koko/` directory
   - Create new file named `config.py`
   - This will hold KOKO-specific Django settings

2. **Import required Django settings utilities**
   - Import settings from django.conf
   - Import environment variable utilities
   - Add validation utilities for required settings

3. **Define KOKO environment settings**
   - Create setting for KOKO environment (sandbox/production)
   - Add automatic environment detection logic
   - Include environment-specific URL selection

4. **Create KOKO credential settings structure**
   - Define settings for API key configuration
   - Add merchant ID configuration settings
   - Include credential validation logic

5. **Add KOKO operational settings**
   - Create timeout settings for API requests
   - Add retry logic configuration
   - Include logging level settings

6. **Implement settings validation**
   - Add validation for required KOKO settings
   - Create error handling for missing configurations
   - Include settings verification functions

7. **Add KOKO feature flags**
   - Create settings for enabling/disabling KOKO
   - Add feature flags for different KOKO capabilities
   - Include debugging and testing flags

### KOKO Settings Structure

| Category | Settings | Purpose |
|----------|----------|---------|
| Environment | KOKO_ENVIRONMENT, KOKO_USE_SANDBOX | Environment control |
| Credentials | KOKO_API_KEY, KOKO_MERCHANT_ID | Authentication |
| URLs | KOKO_BASE_URL, KOKO_WEBHOOK_URL | API endpoints |
| Features | KOKO_ENABLED, KOKO_DEBUG | Feature control |

### Environment Configuration

| Setting | Development | Production |
|---------|-------------|------------|
| KOKO_ENVIRONMENT | 'sandbox' | 'production' |
| KOKO_USE_SANDBOX | True | False |
| KOKO_DEBUG | True | False |
| KOKO_LOG_LEVEL | 'DEBUG' | 'INFO' |

### Django Settings Integration

```python
# Settings pattern for Django integration
KOKO_CONFIG = {
    'ENVIRONMENT': getattr(settings, 'KOKO_ENVIRONMENT', 'sandbox'),
    'API_KEY': getattr(settings, 'KOKO_API_KEY', None),
    'MERCHANT_ID': getattr(settings, 'KOKO_MERCHANT_ID', None),
    'ENABLED': getattr(settings, 'KOKO_ENABLED', False),
}
```

### Settings Validation Rules

| Setting | Validation | Error Handling |
|---------|------------|----------------|
| KOKO_API_KEY | Not empty, proper format | ConfigurationError |
| KOKO_MERCHANT_ID | Not empty, alphanumeric | ConfigurationError |
| KOKO_ENVIRONMENT | 'sandbox' or 'production' | ValueError |

### Configuration Loading Priority

| Priority | Source | Usage |
|----------|--------|-------|
| 1 | Environment Variables | Docker/deployment |
| 2 | Django Settings | settings.py |
| 3 | Default Values | Fallback values |

### Settings Categories

```
KOKO Configuration
├── Authentication
│   ├── API Key
│   └── Merchant ID
├── Environment
│   ├── Base URL
│   └── Sandbox Mode
├── Features
│   ├── Enabled Status
│   └── Debug Mode
└── Operations
    ├── Timeouts
    └── Retry Logic
```

### Expected Outcome
- Comprehensive KOKO settings configuration
- Environment-aware configuration loading
- Proper validation and error handling
- Integration with Django settings system

### Verification Checklist
- [ ] `backend/apps/payments/processors/koko/config.py` created
- [ ] Django settings integration implemented
- [ ] Environment-specific configuration logic added
- [ ] Credential validation implemented
- [ ] Feature flags configured
- [ ] Settings validation functions created
- [ ] Error handling for missing configurations

---

## Task 07: Create KOKO API Key

### Overview
Configure KOKO API key management within the Django settings system. The API key is a critical security credential that authenticates requests to KOKO's BNPL services and must be securely stored and properly validated.

### Dependencies
- Task 06: Create KOKO Settings

### Instructions

1. **Define KOKO API key setting**
   - Add KOKO_API_KEY setting to the KOKO configuration
   - Ensure setting supports environment variable override
   - Add setting to Django settings structure

2. **Implement API key validation**
   - Add format validation for KOKO API key
   - Create length and character validation rules
   - Include API key presence validation

3. **Add API key security measures**
   - Implement API key masking for logs
   - Add secure storage recommendations
   - Create API key rotation support structure

4. **Create API key environment configuration**
   - Add environment-specific API key handling
   - Support separate sandbox and production keys
   - Include automatic key selection based on environment

5. **Implement API key testing utilities**
   - Create API key validation test function
   - Add connection testing with API key
   - Include API key format verification

6. **Add API key error handling**
   - Create specific exceptions for invalid API keys
   - Add error messages for missing API keys
   - Include API key authentication failure handling

### KOKO API Key Configuration

| Setting | Environment | Required |
|---------|-------------|----------|
| KOKO_API_KEY | All environments | Yes |
| KOKO_SANDBOX_API_KEY | Development/Testing | Optional |
| KOKO_PRODUCTION_API_KEY | Production | Yes |

### API Key Validation Rules

| Validation | Criteria | Error Message |
|------------|----------|---------------|
| Format | Alphanumeric + special chars | "Invalid API key format" |
| Length | 32-128 characters | "API key length invalid" |
| Presence | Not None or empty | "KOKO API key required" |

### API Key Security Practices

| Practice | Implementation | Security Level |
|----------|----------------|----------------|
| Environment Variables | Store in .env files | High |
| No Hardcoding | Never in source code | Critical |
| Log Masking | Mask in logs/debug | High |
| Rotation Support | Regular key updates | Medium |

### Environment-Based Key Selection

```
Environment Detection → API Key Selection
├── Development → KOKO_SANDBOX_API_KEY or KOKO_API_KEY
├── Testing → KOKO_SANDBOX_API_KEY
└── Production → KOKO_PRODUCTION_API_KEY or KOKO_API_KEY
```

### API Key Usage Patterns

| Usage | Pattern | Security |
|-------|---------|----------|
| Request Headers | Authorization: Bearer {key} | Standard |
| Request Signing | HMAC with key | Enhanced |
| Key Validation | Format + connectivity test | Recommended |

### Error Handling Scenarios

| Scenario | Error Type | Response |
|----------|------------|----------|
| Missing Key | ConfigurationError | Application startup failure |
| Invalid Format | ValidationError | Configuration warning |
| Auth Failure | AuthenticationError | Request failure with retry |

### Expected Outcome
- KOKO API key properly configured in Django settings
- Robust validation and security measures implemented
- Environment-aware key management
- Comprehensive error handling for key-related issues

### Verification Checklist
- [ ] KOKO_API_KEY setting defined in configuration
- [ ] API key validation rules implemented
- [ ] Environment-specific key handling added
- [ ] Security measures implemented (masking, no hardcoding)
- [ ] Error handling for invalid/missing keys
- [ ] API key testing utilities created

---

## Task 08: Create KOKO Merchant ID

### Overview
Configure KOKO Merchant ID management within the Django settings system. The Merchant ID uniquely identifies the business account with KOKO and is required for all BNPL transactions and merchant-specific operations.

### Dependencies
- Task 06: Create KOKO Settings
- Task 07: Create KOKO API Key

### Instructions

1. **Define KOKO Merchant ID setting**
   - Add KOKO_MERCHANT_ID setting to KOKO configuration
   - Support environment variable override
   - Integrate with Django settings system

2. **Implement Merchant ID validation**
   - Add format validation for merchant ID
   - Create alphanumeric validation rules
   - Include presence and length validation

3. **Add environment-specific merchant ID handling**
   - Support separate sandbox and production merchant IDs
   - Add automatic merchant ID selection based on environment
   - Include merchant ID verification with KOKO API

4. **Create merchant ID verification utilities**
   - Add function to verify merchant ID with KOKO
   - Create merchant account status checking
   - Include merchant ID format validation

5. **Implement merchant ID error handling**
   - Create specific exceptions for invalid merchant IDs
   - Add error messages for missing merchant IDs
   - Include merchant verification failure handling

6. **Add merchant ID logging and monitoring**
   - Implement secure logging of merchant ID (masked)
   - Add monitoring for merchant ID verification failures
   - Create alerts for merchant account issues

### KOKO Merchant ID Configuration

| Setting | Environment | Format | Required |
|---------|-------------|--------|----------|
| KOKO_MERCHANT_ID | All | Alphanumeric | Yes |
| KOKO_SANDBOX_MERCHANT_ID | Development | Test format | Optional |
| KOKO_PRODUCTION_MERCHANT_ID | Production | Live format | Yes |

### Merchant ID Validation Rules

| Validation | Criteria | Error Handling |
|------------|----------|----------------|
| Format | Alphanumeric only | ValueError with message |
| Length | 8-32 characters | ValidationError |
| Presence | Not None or empty | ConfigurationError |
| Verification | Valid with KOKO API | ConnectionError |

### Environment-Based Merchant ID Selection

```
Environment → Merchant ID Selection Logic
├── Sandbox → KOKO_SANDBOX_MERCHANT_ID → KOKO_MERCHANT_ID
├── Production → KOKO_PRODUCTION_MERCHANT_ID → KOKO_MERCHANT_ID
└── Fallback → KOKO_MERCHANT_ID (must be present)
```

### Merchant ID Security Measures

| Security Practice | Implementation | Purpose |
|-------------------|----------------|---------|
| Log Masking | Show only first/last 4 chars | Privacy protection |
| No Hardcoding | Environment variables only | Security compliance |
| Verification | Regular API validation | Account status monitoring |

### Merchant Account Verification

| Check | Method | Frequency |
|-------|--------|-----------|
| Account Active | KOKO API call | Startup + periodic |
| Permissions | Feature availability check | Per transaction |
| Status | Account standing verification | Daily |

### Error Scenarios and Handling

| Scenario | Error Type | Action |
|----------|------------|--------|
| Missing Merchant ID | ConfigurationError | Fail application startup |
| Invalid Format | ValidationError | Log error, use fallback |
| Account Suspended | AccountError | Disable KOKO, alert admin |
| Verification Failed | ConnectionError | Retry with backoff |

### Merchant ID Usage Context

| Context | Usage | Validation Level |
|---------|-------|------------------|
| Transaction Initiation | Required field | Full validation |
| Status Queries | Identifier parameter | Format validation |
| Webhook Verification | Merchant matching | Security validation |

### Expected Outcome
- KOKO Merchant ID properly configured and validated
- Environment-aware merchant ID management
- Robust error handling for merchant account issues
- Security measures implemented for merchant ID protection

### Verification Checklist
- [ ] KOKO_MERCHANT_ID setting defined and configured
- [ ] Merchant ID validation rules implemented
- [ ] Environment-specific merchant ID handling
- [ ] Merchant ID verification utilities created
- [ ] Error handling for invalid/missing merchant IDs
- [ ] Security measures implemented (masking, verification)
- [ ] Integration with KOKO settings configuration

---

## Summary

This document has covered the foundational configuration for BNPL integration with both KOKO and MintPay providers. The tasks completed include:

### Completed Tasks (01-08)
- **Task 01:** Created comprehensive BNPL constants for both providers
- **Task 02:** Configured KOKO sandbox URL for development testing
- **Task 03:** Set up KOKO production URL for live payment processing
- **Task 04:** Configured MintPay sandbox URL for testing integration
- **Task 05:** Established MintPay production URL for live operations
- **Task 06:** Created KOKO settings module with Django integration
- **Task 07:** Implemented KOKO API key configuration and validation
- **Task 08:** Set up KOKO Merchant ID with proper validation and security

### Key Achievements
- Established dual-provider BNPL infrastructure
- Implemented environment-aware configuration (sandbox/production)
- Created robust validation and error handling systems
- Ensured security compliance for API credentials
- Built foundation for BNPL payment processing

### Next Steps
The next document [02_Tasks-09-16_Config-Verify.md](02_Tasks-09-16_Config-Verify.md) will cover:
- MintPay settings configuration (Tasks 09-11)
- BNPL config model creation (Task 12)
- Order amount limits and installment plans (Tasks 13-14)
- Configuration validation and verification (Tasks 15-16)

This foundation provides a secure, scalable base for Sri Lankan BNPL integration with proper environment management and credential security.