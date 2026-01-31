# Tasks 01-07: WebXPay Constants and Settings Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** A - WebXPay Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Config-Verify.md](02_Tasks-08-14_Config-Verify.md)

---

## Document Overview

This document covers the creation of WebXPay integration constants, URL configurations, and Django settings for the Sri Lankan payment gateway. It establishes the foundational configuration needed for WebXPay API integration, including sandbox and production environments, API credentials management, and proper constants organization for seamless payment processing in LKR currency.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create WebXPay Constants | Low | 20 min |
| 02 | Create Sandbox URL | Low | 15 min |
| 03 | Create Production URL | Low | 15 min |
| 04 | Create WebXPay Settings | Medium | 30 min |
| 05 | Create API Key Setting | Low | 20 min |
| 06 | Create Secret Key Setting | Low | 20 min |
| 07 | Create Merchant ID Setting | Low | 20 min |

---

## Task 01: Create WebXPay Constants

### Overview
Create a dedicated constants file for WebXPay integration that centralizes all static values, endpoints, payment methods, currency codes, and status mappings. This ensures maintainable code and easy configuration management across the entire payment integration system.

### Dependencies
- Phase-03 (Core Backend Infrastructure) must be complete
- Django project structure is established
- Core utilities and helpers are available

### Instructions

1. **Navigate to the payments app directory**
   - Go to `backend/apps/payments/` directory
   - This is where payment-related configurations belong
   - Ensure the payments app is properly created and registered

2. **Create constants directory structure**
   - Create `constants/` subdirectory within payments app
   - Add `__init__.py` file to make it a Python package
   - Create `webxpay.py` file for WebXPay-specific constants

3. **Define payment method constants**
   - Create enumeration for supported payment methods
   - Include credit cards, debit cards, net banking options
   - Map WebXPay method codes to readable names

4. **Define currency and locale constants**
   - Set LKR as primary currency with proper ISO code
   - Define currency formatting for Sri Lankan Rupees
   - Include locale settings for Sri Lankan context

5. **Define status code mappings**
   - Map WebXPay response codes to internal statuses
   - Include success, failure, pending, and error states
   - Create reverse mapping for status lookups

6. **Define API endpoint fragments**
   - Create base path constants for different operations
   - Define payment, refund, and status check endpoints
   - Include webhook and callback URL patterns

### Constants Structure

```
Payment Methods:
├── CREDIT_CARD → "credit_card"
├── DEBIT_CARD → "debit_card"
├── NET_BANKING → "net_banking"
└── DIGITAL_WALLET → "digital_wallet"
```

### Currency Configuration

| Constant | Value | Purpose |
|----------|--------|---------|
| CURRENCY_CODE | "LKR" | ISO currency code |
| CURRENCY_SYMBOL | "Rs." | Display symbol |
| DECIMAL_PLACES | 2 | Currency precision |
| MIN_AMOUNT | 100 | Minimum payment (Rs. 1.00) |
| MAX_AMOUNT | 50000000 | Maximum payment (Rs. 500,000.00) |

### Status Code Mapping

| WebXPay Code | Internal Status | Description |
|--------------|----------------|-------------|
| "00" | SUCCESS | Payment successful |
| "01" | PENDING | Payment processing |
| "02" | FAILED | Payment failed |
| "99" | ERROR | System error |

### Expected Outcome
- Centralized constants file for WebXPay integration
- Proper enumeration of payment methods and statuses
- Currency configuration for Sri Lankan context
- Maintainable constant definitions for easy updates

### Verification Checklist
- [ ] `backend/apps/payments/constants/webxpay.py` file created
- [ ] Payment method constants defined
- [ ] Currency and locale constants configured
- [ ] Status code mappings established
- [ ] API endpoint fragments defined
- [ ] Constants properly organized and documented

---

## Task 02: Create Sandbox URL Configuration

### Overview
Configure the WebXPay sandbox environment URL and related endpoints for testing and development purposes. The sandbox environment allows safe testing of payment flows without processing real transactions, essential for development and staging environments.

### Dependencies
- Task 01: Create WebXPay Constants

### Instructions

1. **Define sandbox base URL constant**
   - Set sandbox API base URL for WebXPay test environment
   - Use HTTPS protocol for secure communication
   - Include proper domain and API version path

2. **Create sandbox-specific endpoints**
   - Define payment initiation endpoint for test transactions
   - Configure webhook URL for sandbox notifications
   - Set up status inquiry endpoint for transaction checking

3. **Configure sandbox environment variables**
   - Create environment variable mapping for sandbox URLs
   - Enable easy switching between development configurations
   - Include proper environment detection logic

4. **Set up sandbox payment parameters**
   - Define test merchant identifiers
   - Configure sandbox-specific callback URLs
   - Set up proper return URL patterns for testing

5. **Establish sandbox API versioning**
   - Include API version in URL structure
   - Prepare for future API version upgrades
   - Maintain backward compatibility considerations

6. **Document sandbox limitations**
   - Note sandbox-specific behaviors and limitations
   - Document test card numbers and scenarios
   - Include sandbox transaction amount limits

### Sandbox URL Structure

```
Base URL: https://sandbox.webxpay.lk/api/v1/
├── payments/ → Payment processing
├── webhooks/ → Notification handling  
├── status/ → Transaction inquiries
└── refunds/ → Refund processing
```

### Environment Configuration

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| Development | sandbox.webxpay.lk | Local development |
| Staging | sandbox.webxpay.lk | Pre-production testing |
| Testing | sandbox.webxpay.lk | Automated test suites |

### Sandbox Features

| Feature | Availability | Notes |
|---------|--------------|-------|
| Test Cards | Available | Multiple test scenarios |
| Webhooks | Functional | Real-time notifications |
| Refunds | Simulated | Instant refund processing |
| 3D Secure | Optional | Test authentication flows |

### Expected Outcome
- Properly configured sandbox URLs for development
- Environment-specific URL management
- Ready-to-use test environment configuration
- Comprehensive documentation of sandbox features

### Verification Checklist
- [ ] Sandbox base URL constant defined
- [ ] Environment variable mapping created
- [ ] Sandbox endpoints properly structured
- [ ] API versioning included in URLs
- [ ] Callback and webhook URLs configured
- [ ] Sandbox limitations documented

---

## Task 03: Create Production URL Configuration

### Overview
Configure the WebXPay production environment URLs for live payment processing. Production URLs must be secure, reliable, and properly validated to ensure seamless payment processing for real transactions with proper error handling and monitoring capabilities.

### Dependencies
- Task 02: Create Sandbox URL Configuration

### Instructions

1. **Define production base URL constant**
   - Set production API base URL for WebXPay live environment
   - Ensure HTTPS protocol with SSL certificate validation
   - Include proper domain and current API version

2. **Create production-specific endpoints**
   - Define live payment processing endpoints
   - Configure production webhook URLs with authentication
   - Set up real-time status inquiry endpoints

3. **Configure production environment variables**
   - Create secure environment variable mapping
   - Implement production environment detection
   - Add environment-specific security validations

4. **Set up production callback URLs**
   - Define live merchant callback URLs
   - Configure success and failure return URLs
   - Establish secure webhook endpoint URLs

5. **Implement production safety measures**
   - Add production environment validation checks
   - Include proper SSL certificate verification
   - Set up connection timeout and retry logic

6. **Configure production monitoring**
   - Include request/response logging for production
   - Set up error tracking and alerting endpoints
   - Configure performance monitoring URLs

### Production URL Architecture

```
Production Environment:
├── Base: https://api.webxpay.lk/v1/
├── Payments: /payments/process
├── Webhooks: /webhooks/notify  
├── Status: /transactions/status
└── Refunds: /refunds/process
```

### Production Environment Variables

| Variable | Format | Security Level |
|----------|--------|----------------|
| WEBXPAY_PROD_BASE_URL | HTTPS URL | Public |
| WEBXPAY_PROD_API_KEY | Encrypted | Secret |
| WEBXPAY_PROD_SECRET | Encrypted | Top Secret |
| WEBXPAY_PROD_MERCHANT_ID | Alphanumeric | Private |

### Security Considerations

| Aspect | Implementation | Importance |
|--------|----------------|------------|
| SSL/TLS | Mandatory HTTPS | Critical |
| Certificate Validation | Full chain verification | Critical |
| Timeout Settings | 30 seconds max | High |
| Retry Logic | 3 attempts with backoff | High |
| Request Signing | HMAC SHA-256 | Critical |

### Production Monitoring Points

```
Monitoring Endpoints:
├── Health Check: /health
├── API Status: /status  
├── Rate Limits: /limits
└── Maintenance: /maintenance
```

### Expected Outcome
- Secure production URL configuration
- Proper environment detection and validation
- Comprehensive security measures implemented
- Production monitoring capabilities established

### Verification Checklist
- [ ] Production base URL constant defined
- [ ] HTTPS protocol enforced
- [ ] Environment variable security implemented
- [ ] SSL certificate validation configured
- [ ] Production safety measures added
- [ ] Monitoring endpoints established

---

## Task 04: Create WebXPay Settings Module

### Overview
Create a comprehensive Django settings module specifically for WebXPay configuration that integrates with the main settings system. This module manages environment-specific configurations, security settings, and provides a centralized location for all WebXPay-related settings with proper validation and error handling.

### Dependencies
- Task 03: Create Production URL Configuration
- Django settings architecture is established

### Instructions

1. **Create settings module structure**
   - Navigate to `backend/config/settings/` directory
   - Create `webxpay.py` file for WebXPay settings
   - Import necessary Django settings utilities

2. **Import base configurations**
   - Import constants from Task 01
   - Import URL configurations from Tasks 02 and 03
   - Include Django environment detection utilities

3. **Define environment detection logic**
   - Create function to detect current environment
   - Implement logic to switch between sandbox/production
   - Add validation for environment-specific requirements

4. **Configure base WebXPay settings**
   - Set default timeout values for API requests
   - Configure retry logic and backoff strategies  
   - Define logging levels for different environments

5. **Implement settings validation**
   - Add validation for required environment variables
   - Create checks for API key format and validity
   - Implement merchant ID validation rules

6. **Create settings integration**
   - Import WebXPay settings in main Django settings
   - Set up proper namespace for WebXPay configurations
   - Ensure settings are available across the application

### Settings Module Structure

```
WebXPay Settings:
├── Environment Detection
├── URL Configuration  
├── API Credentials
├── Timeout & Retry Logic
├── Logging Configuration
└── Validation Rules
```

### Environment Detection Logic

| Environment | Detection Method | Configuration Source |
|-------------|-----------------|---------------------|
| Development | DEBUG=True | Local env vars |
| Staging | STAGE=True | Staging env vars |
| Production | DEBUG=False | Encrypted secrets |

### Default Configuration Values

| Setting | Development | Production | Description |
|---------|------------|------------|-------------|
| API_TIMEOUT | 60 seconds | 30 seconds | Request timeout |
| RETRY_ATTEMPTS | 5 | 3 | Failed request retries |
| LOG_LEVEL | DEBUG | INFO | Logging verbosity |
| CACHE_TTL | 300 seconds | 3600 seconds | Cache duration |

### Settings Validation Rules

```
Validation Checks:
├── API Key: 32+ characters, alphanumeric
├── Secret Key: 64+ characters, base64
├── Merchant ID: 8-16 characters, alphanumeric
└── URLs: Valid HTTPS format
```

### Expected Outcome
- Comprehensive WebXPay settings module
- Environment-specific configuration management
- Proper validation and error handling
- Seamless integration with Django settings system

### Verification Checklist
- [ ] `backend/config/settings/webxpay.py` file created
- [ ] Environment detection logic implemented
- [ ] Settings validation functions added
- [ ] Default configuration values set
- [ ] Integration with main settings completed
- [ ] Proper namespace organization established

---

## Task 05: Create API Key Setting Configuration

### Overview
Configure the WebXPay API key setting with proper security measures, environment-specific handling, and validation rules. The API key is critical for authentication with WebXPay services and requires secure storage, proper encryption, and environment-appropriate management.

### Dependencies
- Task 04: Create WebXPay Settings Module

### Instructions

1. **Define API key environment variables**
   - Set up separate environment variables for different environments
   - Use descriptive names: WEBXPAY_SANDBOX_API_KEY, WEBXPAY_PROD_API_KEY
   - Implement proper environment variable validation

2. **Configure API key security**
   - Implement encryption for API key storage
   - Add validation for API key format and length
   - Set up secure retrieval methods with error handling

3. **Create API key validation logic**
   - Validate API key format (alphanumeric, specific length)
   - Implement checksum validation if provided by WebXPay
   - Add environment-specific validation rules

4. **Set up API key rotation support**
   - Prepare configuration for API key rotation
   - Implement fallback mechanism for key updates
   - Add logging for API key usage and validation

5. **Configure API key headers**
   - Define proper HTTP header names for API key transmission
   - Set up header formatting and encoding rules
   - Implement secure header construction methods

6. **Add API key error handling**
   - Create specific error messages for invalid API keys
   - Implement proper error logging without exposing keys
   - Set up alerting for API key validation failures

### API Key Configuration Structure

```
API Key Management:
├── Environment Variables
├── Validation Rules
├── Security Encryption  
├── Header Construction
├── Error Handling
└── Rotation Support
```

### Environment Variable Naming

| Environment | Variable Name | Usage |
|-------------|---------------|-------|
| Development | WEBXPAY_DEV_API_KEY | Local development |
| Sandbox | WEBXPAY_SANDBOX_API_KEY | Testing environment |
| Staging | WEBXPAY_STAGE_API_KEY | Pre-production |
| Production | WEBXPAY_PROD_API_KEY | Live environment |

### API Key Validation Rules

| Rule | Requirement | Error Message |
|------|-------------|---------------|
| Length | 32-64 characters | "Invalid API key length" |
| Format | Alphanumeric only | "Invalid API key format" |
| Prefix | Starts with "wxp_" | "Invalid API key prefix" |
| Environment | Matches current env | "API key environment mismatch" |

### Security Measures

```
Security Implementation:
├── At Rest: AES-256 encryption
├── In Transit: HTTPS only
├── In Memory: Secure strings
├── Logging: Key masking/redaction
└── Storage: Environment variables only
```

### Expected Outcome
- Secure API key configuration and management
- Environment-specific API key handling
- Comprehensive validation and error handling
- Support for API key rotation and updates

### Verification Checklist
- [ ] Environment variables properly defined
- [ ] API key validation rules implemented
- [ ] Security encryption configured
- [ ] Header construction methods created
- [ ] Error handling and logging added
- [ ] Rotation support mechanisms prepared

---

## Task 06: Create Secret Key Setting Configuration

### Overview
Configure the WebXPay secret key setting for request signing and webhook verification. The secret key provides cryptographic security for API communications and webhook authentication, requiring the highest level of security measures and proper HMAC implementation.

### Dependencies
- Task 05: Create API Key Setting Configuration

### Instructions

1. **Define secret key environment variables**
   - Set up environment-specific secret key variables
   - Use clear naming: WEBXPAY_SANDBOX_SECRET, WEBXPAY_PROD_SECRET
   - Implement secure environment variable loading

2. **Configure secret key security**
   - Implement advanced encryption for secret key storage
   - Add Base64 decoding for secret key format
   - Set up secure memory handling for secret keys

3. **Create HMAC signing methods**
   - Implement HMAC-SHA256 signature generation
   - Create request payload signing functions
   - Add signature verification for webhook validation

4. **Set up signature validation**
   - Create methods to validate incoming webhook signatures
   - Implement timestamp-based signature validation
   - Add replay attack protection mechanisms

5. **Configure signature headers**
   - Define signature header names and formats
   - Set up proper timestamp inclusion in signatures
   - Implement signature encoding and decoding

6. **Add secret key rotation support**
   - Prepare configuration for secret key updates
   - Implement dual-key validation during rotation
   - Add secure key migration procedures

### Secret Key Security Architecture

```
Secret Key Security:
├── Encryption: AES-256-GCM
├── Storage: Environment variables
├── Access: Controlled methods only
├── Signing: HMAC-SHA256
├── Validation: Timestamp + signature
└── Rotation: Dual-key support
```

### HMAC Signing Process

| Step | Process | Purpose |
|------|---------|---------|
| 1 | Payload preparation | Canonical request format |
| 2 | Timestamp addition | Replay attack prevention |
| 3 | HMAC generation | Cryptographic signature |
| 4 | Header construction | Signature transmission |
| 5 | Validation | Request authenticity |

### Signature Header Format

```
Signature Header Structure:
X-WebXPay-Signature: t={timestamp},v1={signature}
├── t: Unix timestamp
├── v1: HMAC-SHA256 signature
└── Format: Base64 encoded
```

### Webhook Verification Process

| Step | Validation | Action |
|------|------------|--------|
| 1 | Extract signature header | Parse timestamp and signature |
| 2 | Check timestamp validity | Reject old requests (>5 min) |
| 3 | Reconstruct payload | Canonical format matching |
| 4 | Generate signature | HMAC with secret key |
| 5 | Compare signatures | Constant-time comparison |

### Security Best Practices

```
Implementation Guidelines:
├── Constant-time comparison for signatures
├── Secure memory clearing after use
├── Timestamp validation (5-minute window)
├── Rate limiting for failed validations
└── Comprehensive audit logging
```

### Expected Outcome
- Secure secret key configuration and storage
- Robust HMAC signing and verification system
- Comprehensive webhook security validation
- Support for secure key rotation procedures

### Verification Checklist
- [ ] Secret key environment variables configured
- [ ] Advanced encryption implemented
- [ ] HMAC signing methods created
- [ ] Signature validation functions added
- [ ] Webhook verification system established
- [ ] Key rotation support implemented

---

## Task 07: Create Merchant ID Setting Configuration

### Overview
Configure the WebXPay merchant ID setting that identifies the business account for all payment transactions. The merchant ID is essential for transaction routing, settlement, and reporting, requiring proper validation, environment-specific configuration, and integration with other WebXPay settings.

### Dependencies
- Task 06: Create Secret Key Setting Configuration

### Instructions

1. **Define merchant ID environment variables**
   - Set up environment-specific merchant ID variables
   - Use descriptive names: WEBXPAY_SANDBOX_MERCHANT_ID, WEBXPAY_PROD_MERCHANT_ID
   - Implement validation for merchant ID format

2. **Configure merchant ID validation**
   - Implement format validation (alphanumeric, specific length)
   - Add checksum validation if provided by WebXPay
   - Create environment-specific validation rules

3. **Set up merchant account integration**
   - Configure merchant ID for payment request headers
   - Implement merchant-specific configuration loading
   - Add merchant account status validation

4. **Create merchant configuration mapping**
   - Map merchant IDs to business configurations
   - Set up currency and locale preferences per merchant
   - Configure merchant-specific fee structures

5. **Implement merchant ID verification**
   - Create methods to verify merchant ID validity with WebXPay
   - Add periodic merchant account status checks
   - Implement merchant account health monitoring

6. **Configure multi-merchant support preparation**
   - Prepare configuration for multiple merchant accounts
   - Set up merchant ID selection logic
   - Add support for merchant account switching

### Merchant ID Configuration Structure

```
Merchant Configuration:
├── Environment Variables
├── Format Validation
├── Account Integration
├── Configuration Mapping
├── Verification Methods
└── Multi-merchant Support
```

### Merchant ID Validation Rules

| Rule | Requirement | Format |
|------|-------------|---------|
| Length | 8-16 characters | Fixed length |
| Format | Alphanumeric | [A-Za-z0-9] |
| Prefix | Environment-specific | SAND_ or PROD_ |
| Checksum | WebXPay algorithm | Validated |

### Environment-Specific Configuration

| Environment | Merchant ID Format | Validation |
|-------------|-------------------|------------|
| Sandbox | SAND_12345678 | Test account |
| Production | PROD_87654321 | Live account |
| Development | DEV_00000001 | Local testing |

### Merchant Account Mapping

```
Merchant Configuration:
├── merchant_id: Account identifier
├── business_name: Legal business name
├── currency: Default currency (LKR)
├── locale: Country/language (LK/en)
├── fee_structure: Commission rates
└── settlement_account: Bank details
```

### Account Verification Methods

| Method | Purpose | Frequency |
|--------|---------|-----------|
| startup_verify() | Initial validation | Application start |
| periodic_check() | Account status | Every 4 hours |
| transaction_verify() | Pre-payment check | Per transaction |

### Multi-Merchant Preparation

```
Future Multi-Merchant Support:
├── Merchant selection logic
├── Account-specific configurations
├── Dynamic merchant switching
├── Tenant-based merchant mapping
└── Consolidated reporting
```

### Expected Outcome
- Comprehensive merchant ID configuration system
- Robust validation and verification mechanisms
- Environment-specific merchant account handling
- Foundation for future multi-merchant support

### Verification Checklist
- [ ] Merchant ID environment variables defined
- [ ] Format validation rules implemented
- [ ] Account integration methods created
- [ ] Configuration mapping established
- [ ] Verification methods added
- [ ] Multi-merchant support prepared

---

## Summary

This document established the foundational WebXPay configuration system, including constants definition, URL configurations for sandbox and production environments, comprehensive Django settings integration, and secure credential management for API keys, secret keys, and merchant IDs. These elements provide a secure, maintainable foundation for WebXPay payment integration.

### Completed Tasks
1. ✓ Created WebXPay constants with payment methods, currency, and status mappings
2. ✓ Configured sandbox URL structure for development and testing
3. ✓ Established production URL configuration with security measures
4. ✓ Created comprehensive WebXPay settings module with environment detection
5. ✓ Implemented secure API key configuration with validation and rotation support
6. ✓ Configured secret key management with HMAC signing and webhook verification
7. ✓ Established merchant ID configuration with validation and multi-merchant preparation

### Next Steps
Proceed to [02_Tasks-08-14_Config-Verify.md](02_Tasks-08-14_Config-Verify.md) to implement configuration verification, health checks, connection testing, error handling, logging setup, and documentation completion for the WebXPay integration system.