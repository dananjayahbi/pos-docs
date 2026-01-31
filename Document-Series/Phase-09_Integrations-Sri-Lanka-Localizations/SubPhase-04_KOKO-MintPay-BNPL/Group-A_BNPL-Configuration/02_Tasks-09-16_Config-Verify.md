# Tasks 09-16: MintPay Config and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** A - BNPL Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Constants-Settings.md](01_Tasks-01-08_Constants-Settings.md)

---

## Document Overview

This document covers the completion of BNPL configuration by setting up MintPay provider settings, creating the BNPL configuration model for tenant-specific settings, implementing order amount limits and installment plans, and establishing comprehensive validation and verification systems for both KOKO and MintPay integrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create MintPay Settings | Medium | 30 min |
| 10 | Create MintPay API Key | Low | 15 min |
| 11 | Create MintPay Merchant ID | Low | 15 min |
| 12 | Create BNPL Config Model | Medium | 45 min |
| 13 | Create Min/Max Order Amount | Low | 20 min |
| 14 | Create Installment Plans | Medium | 35 min |
| 15 | Create Config Validation | Medium | 40 min |
| 16 | Verify BNPL Configuration | Low | 25 min |

---

## Task 09: Create MintPay Settings

### Overview
Create Django settings module for MintPay BNPL integration with comprehensive configuration management. This settings module handles environment-specific configurations, API credentials, and operational parameters for MintPay payment processing, mirroring the KOKO settings structure for consistency.

### Dependencies
- Task 01: Create BNPL Constants
- Task 04: Create MintPay Sandbox URL
- Task 05: Create MintPay Production URL
- Task 06: Create KOKO Settings (for consistency reference)

### Instructions

1. **Create MintPay settings configuration file**
   - Navigate to `backend/apps/payments/processors/mintpay/` directory
   - Create new file named `config.py`
   - Structure should mirror KOKO config for consistency

2. **Import required Django settings utilities**
   - Import settings from django.conf
   - Import environment variable utilities
   - Add validation utilities for required settings

3. **Define MintPay environment settings**
   - Create setting for MintPay environment (sandbox/production)
   - Add automatic environment detection logic
   - Include environment-specific URL selection

4. **Create MintPay credential settings structure**
   - Define settings for API key configuration
   - Add merchant ID configuration settings
   - Include credential validation logic

5. **Add MintPay operational settings**
   - Create timeout settings for API requests
   - Add retry logic configuration
   - Include logging level settings specific to MintPay

6. **Implement settings validation**
   - Add validation for required MintPay settings
   - Create error handling for missing configurations
   - Include settings verification functions

7. **Add MintPay feature flags**
   - Create settings for enabling/disabling MintPay
   - Add feature flags for different MintPay capabilities
   - Include debugging and testing flags

### MintPay Settings Structure

| Category | Settings | Purpose |
|----------|----------|---------|
| Environment | MINTPAY_ENVIRONMENT, MINTPAY_USE_SANDBOX | Environment control |
| Credentials | MINTPAY_API_KEY, MINTPAY_MERCHANT_ID | Authentication |
| URLs | MINTPAY_BASE_URL, MINTPAY_WEBHOOK_URL | API endpoints |
| Features | MINTPAY_ENABLED, MINTPAY_DEBUG | Feature control |

### Environment Configuration

| Setting | Development | Production |
|---------|-------------|------------|
| MINTPAY_ENVIRONMENT | 'sandbox' | 'production' |
| MINTPAY_USE_SANDBOX | True | False |
| MINTPAY_DEBUG | True | False |
| MINTPAY_LOG_LEVEL | 'DEBUG' | 'INFO' |

### Django Settings Integration

```python
# Settings pattern for Django integration
MINTPAY_CONFIG = {
    'ENVIRONMENT': getattr(settings, 'MINTPAY_ENVIRONMENT', 'sandbox'),
    'API_KEY': getattr(settings, 'MINTPAY_API_KEY', None),
    'MERCHANT_ID': getattr(settings, 'MINTPAY_MERCHANT_ID', None),
    'ENABLED': getattr(settings, 'MINTPAY_ENABLED', False),
}
```

### Settings Validation Rules

| Setting | Validation | Error Handling |
|---------|------------|----------------|
| MINTPAY_API_KEY | Not empty, proper format | ConfigurationError |
| MINTPAY_MERCHANT_ID | Not empty, alphanumeric | ConfigurationError |
| MINTPAY_ENVIRONMENT | 'sandbox' or 'production' | ValueError |

### Configuration Loading Priority

| Priority | Source | Usage |
|----------|--------|-------|
| 1 | Environment Variables | Docker/deployment |
| 2 | Django Settings | settings.py |
| 3 | Default Values | Fallback values |

### MintPay-Specific Configuration Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Payment Types | Supported BNPL plans | Configuration array |
| Currency Support | LKR-specific settings | Currency validation |
| Webhook Security | Signature validation | HMAC settings |

### Expected Outcome
- Comprehensive MintPay settings configuration
- Environment-aware configuration loading
- Proper validation and error handling
- Consistent structure with KOKO settings

### Verification Checklist
- [ ] `backend/apps/payments/processors/mintpay/config.py` created
- [ ] Django settings integration implemented
- [ ] Environment-specific configuration logic added
- [ ] Credential validation implemented
- [ ] Feature flags configured
- [ ] Settings validation functions created
- [ ] Error handling for missing configurations

---

## Task 10: Create MintPay API Key

### Overview
Configure MintPay API key management within the Django settings system. The API key authenticates requests to MintPay's BNPL services and requires secure storage, proper validation, and environment-aware configuration.

### Dependencies
- Task 09: Create MintPay Settings

### Instructions

1. **Define MintPay API key setting**
   - Add MINTPAY_API_KEY setting to MintPay configuration
   - Ensure setting supports environment variable override
   - Add setting to Django settings structure

2. **Implement API key validation**
   - Add format validation for MintPay API key
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

### MintPay API Key Configuration

| Setting | Environment | Required |
|---------|-------------|----------|
| MINTPAY_API_KEY | All environments | Yes |
| MINTPAY_SANDBOX_API_KEY | Development/Testing | Optional |
| MINTPAY_PRODUCTION_API_KEY | Production | Yes |

### API Key Validation Rules

| Validation | Criteria | Error Message |
|------------|----------|---------------|
| Format | Alphanumeric + special chars | "Invalid MintPay API key format" |
| Length | 24-64 characters | "MintPay API key length invalid" |
| Presence | Not None or empty | "MintPay API key required" |

### API Key Security Practices

| Practice | Implementation | Security Level |
|----------|----------------|----------------|
| Environment Variables | Store in .env files | High |
| No Hardcoding | Never in source code | Critical |
| Log Masking | Mask in logs/debug | High |
| Rotation Support | Regular key updates | Medium |

### Environment-Based Key Selection

```
Environment Detection → MintPay API Key Selection
├── Development → MINTPAY_SANDBOX_API_KEY or MINTPAY_API_KEY
├── Testing → MINTPAY_SANDBOX_API_KEY
└── Production → MINTPAY_PRODUCTION_API_KEY or MINTPAY_API_KEY
```

### MintPay API Authentication Pattern

| Method | Usage | Security |
|--------|-------|----------|
| Bearer Token | Authorization header | Standard |
| Request Signing | HMAC with secret | Enhanced |
| Key Validation | Format + connectivity | Recommended |

### API Key Testing and Validation

| Test | Method | Expected Result |
|------|-------|----------------|
| Format Check | Regex validation | Pass/Fail |
| Connectivity | API health check | HTTP 200 |
| Authentication | Test API call | Valid response |

### Expected Outcome
- MintPay API key properly configured in Django settings
- Robust validation and security measures implemented
- Environment-aware key management
- Comprehensive error handling for key-related issues

### Verification Checklist
- [ ] MINTPAY_API_KEY setting defined in configuration
- [ ] API key validation rules implemented
- [ ] Environment-specific key handling added
- [ ] Security measures implemented (masking, no hardcoding)
- [ ] Error handling for invalid/missing keys
- [ ] API key testing utilities created

---

## Task 11: Create MintPay Merchant ID

### Overview
Configure MintPay Merchant ID management within the Django settings system. The Merchant ID uniquely identifies the business account with MintPay and is required for all BNPL transactions, merchant verification, and account-specific operations.

### Dependencies
- Task 09: Create MintPay Settings
- Task 10: Create MintPay API Key

### Instructions

1. **Define MintPay Merchant ID setting**
   - Add MINTPAY_MERCHANT_ID setting to MintPay configuration
   - Support environment variable override
   - Integrate with Django settings system

2. **Implement Merchant ID validation**
   - Add format validation for MintPay merchant ID
   - Create alphanumeric validation rules
   - Include presence and length validation

3. **Add environment-specific merchant ID handling**
   - Support separate sandbox and production merchant IDs
   - Add automatic merchant ID selection based on environment
   - Include merchant ID verification with MintPay API

4. **Create merchant ID verification utilities**
   - Add function to verify merchant ID with MintPay
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

### MintPay Merchant ID Configuration

| Setting | Environment | Format | Required |
|---------|-------------|--------|----------|
| MINTPAY_MERCHANT_ID | All | Alphanumeric | Yes |
| MINTPAY_SANDBOX_MERCHANT_ID | Development | Test format | Optional |
| MINTPAY_PRODUCTION_MERCHANT_ID | Production | Live format | Yes |

### Merchant ID Validation Rules

| Validation | Criteria | Error Handling |
|------------|----------|----------------|
| Format | Alphanumeric + underscores | ValueError with message |
| Length | 6-24 characters | ValidationError |
| Presence | Not None or empty | ConfigurationError |
| Verification | Valid with MintPay API | ConnectionError |

### Environment-Based Merchant ID Selection

```
Environment → MintPay Merchant ID Selection Logic
├── Sandbox → MINTPAY_SANDBOX_MERCHANT_ID → MINTPAY_MERCHANT_ID
├── Production → MINTPAY_PRODUCTION_MERCHANT_ID → MINTPAY_MERCHANT_ID
└── Fallback → MINTPAY_MERCHANT_ID (must be present)
```

### Merchant ID Security Measures

| Security Practice | Implementation | Purpose |
|-------------------|----------------|---------|
| Log Masking | Show only first/last 3 chars | Privacy protection |
| No Hardcoding | Environment variables only | Security compliance |
| Verification | Regular API validation | Account status monitoring |

### Merchant Account Verification

| Check | Method | Frequency |
|-------|--------|-----------|
| Account Active | MintPay API call | Startup + periodic |
| BNPL Enabled | Feature availability check | Per transaction |
| Credit Limits | Account limits verification | Daily |

### Error Scenarios and Handling

| Scenario | Error Type | Action |
|----------|------------|--------|
| Missing Merchant ID | ConfigurationError | Fail application startup |
| Invalid Format | ValidationError | Log error, use fallback |
| Account Inactive | AccountError | Disable MintPay, alert admin |
| Verification Failed | ConnectionError | Retry with exponential backoff |

### Expected Outcome
- MintPay Merchant ID properly configured and validated
- Environment-aware merchant ID management
- Robust error handling for merchant account issues
- Security measures implemented for merchant ID protection

### Verification Checklist
- [ ] MINTPAY_MERCHANT_ID setting defined and configured
- [ ] Merchant ID validation rules implemented
- [ ] Environment-specific merchant ID handling
- [ ] Merchant ID verification utilities created
- [ ] Error handling for invalid/missing merchant IDs
- [ ] Security measures implemented (masking, verification)

---

## Task 12: Create BNPL Config Model

### Overview
Create a Django model to store tenant-specific BNPL configuration settings. This model enables different tenants to have customized BNPL settings, including provider preferences, order limits, payment plan options, and feature flags for both KOKO and MintPay integrations.

### Dependencies
- Task 06: Create KOKO Settings
- Task 09: Create MintPay Settings
- SubPhase-02 (Multi-tenancy) must be complete for tenant model reference

### Instructions

1. **Create BNPL models file**
   - Navigate to `backend/apps/payments/models/` directory
   - Create or update existing models file to include BNPL config
   - Import required Django model fields and validators

2. **Define BNPLConfig model structure**
   - Create model class inheriting from Django's Model
   - Add tenant foreign key relationship
   - Include provider-specific configuration fields

3. **Add provider enablement fields**
   - Create boolean fields for KOKO and MintPay enablement
   - Add default values for provider activation
   - Include validation for at least one provider enabled

4. **Implement order amount configuration**
   - Add decimal fields for minimum and maximum order amounts
   - Include currency field (defaulting to LKR)
   - Add validation to ensure min < max amounts

5. **Add installment plan configuration**
   - Create fields for supported payment plans
   - Include plan duration options (3, 4, 6 months)
   - Add custom plan configuration support

6. **Implement model metadata and methods**
   - Add model Meta class with appropriate settings
   - Create string representation method
   - Include validation methods for configuration consistency

7. **Add audit and timestamp fields**
   - Include created and updated timestamp fields
   - Add fields for tracking configuration changes
   - Include active/inactive status field

### BNPL Config Model Structure

| Field | Type | Purpose | Validation |
|-------|------|---------|------------|
| tenant | ForeignKey | Tenant association | Required |
| koko_enabled | BooleanField | KOKO provider status | Default False |
| mintpay_enabled | BooleanField | MintPay provider status | Default False |
| min_order_amount | DecimalField | Minimum order limit | > 0, < max_amount |
| max_order_amount | DecimalField | Maximum order limit | > min_amount |

### Model Field Definitions

```python
class BNPLConfig(models.Model):
    # Tenant relationship
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE)
    
    # Provider enablement
    koko_enabled = models.BooleanField(default=False)
    mintpay_enabled = models.BooleanField(default=False)
    
    # Order limits
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    max_order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Configuration status
    is_active = models.BooleanField(default=True)
```

### Model Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Provider Required | At least one provider enabled | "Enable at least one BNPL provider" |
| Amount Validation | min_amount < max_amount | "Minimum must be less than maximum" |
| Positive Amounts | amounts > 0 | "Order amounts must be positive" |
| Tenant Unique | One config per tenant | "BNPL config already exists" |

### Model Meta Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| db_table | 'payments_bnpl_config' | Database table name |
| verbose_name | 'BNPL Configuration' | Admin interface display |
| ordering | ['tenant__name'] | Default ordering |
| unique_together | ['tenant'] | One config per tenant |

### Model Methods

| Method | Purpose | Return Type |
|--------|---------|-------------|
| __str__ | String representation | String |
| clean() | Model validation | None/ValidationError |
| save() | Custom save logic | None |
| get_enabled_providers() | List active providers | List[str] |

### Database Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| Primary | id | Primary key |
| Foreign Key | tenant_id | Tenant lookup |
| Composite | tenant_id, is_active | Active configs |

### Expected Outcome
- Django model for tenant-specific BNPL configuration
- Comprehensive validation and constraints
- Proper database relationships and indexes
- Support for both KOKO and MintPay providers

### Verification Checklist
- [ ] BNPLConfig model created with proper fields
- [ ] Tenant relationship established
- [ ] Provider enablement fields added
- [ ] Order amount fields with validation
- [ ] Model Meta configuration implemented
- [ ] Validation methods created
- [ ] Database migration ready

---

## Task 13: Create Min/Max Order Amount

### Overview
Implement minimum and maximum order amount validation and configuration for BNPL transactions. These limits ensure that BNPL services are offered within appropriate transaction ranges, protecting both customers and merchants from unsuitable payment plans.

### Dependencies
- Task 12: Create BNPL Config Model

### Instructions

1. **Define default order amount constants**
   - Add minimum order amount constant (₨5,000)
   - Add maximum order amount constant (₨250,000)
   - Include currency-specific formatting

2. **Implement order amount validation logic**
   - Create validation function for minimum amount compliance
   - Add validation function for maximum amount compliance
   - Include range validation (min < amount < max)

3. **Add order amount field validation**
   - Implement Django field validators for BNPLConfig model
   - Add custom validation methods for amount ranges
   - Include error messages for validation failures

4. **Create order amount utility functions**
   - Add function to check order eligibility
   - Create amount formatting utilities for display
   - Include currency conversion support (if needed)

5. **Implement tenant-specific overrides**
   - Allow tenants to set custom min/max amounts
   - Add validation to ensure custom amounts are within system limits
   - Include audit logging for amount changes

6. **Add order amount business logic**
   - Create business rules for amount determination
   - Include provider-specific amount limits if different
   - Add seasonal or promotional amount adjustments

### Default Order Amount Configuration

| Setting | Value | Justification |
|---------|-------|---------------|
| BNPL_MIN_ORDER_AMOUNT | ₨5,000 | Viable for 3-month plans |
| BNPL_MAX_ORDER_AMOUNT | ₨250,000 | Risk management limit |
| CURRENCY | LKR | Sri Lankan market |

### Order Amount Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Minimum Compliance | amount >= min_amount | "Order below minimum BNPL amount" |
| Maximum Compliance | amount <= max_amount | "Order exceeds maximum BNPL amount" |
| Positive Value | amount > 0 | "Order amount must be positive" |
| Currency Format | Valid decimal format | "Invalid amount format" |

### Provider-Specific Limits

| Provider | Min Amount | Max Amount | Reason |
|----------|------------|------------|---------|
| KOKO | ₨5,000 | ₨200,000 | Risk policy |
| MintPay | ₨3,000 | ₨250,000 | Different risk appetite |
| System Default | ₨5,000 | ₨250,000 | Conservative approach |

### Amount Validation Implementation

```python
def validate_order_amount(amount, config):
    """Validate order amount against BNPL limits"""
    if amount < config.min_order_amount:
        raise ValidationError("Order below minimum BNPL amount")
    if amount > config.max_order_amount:
        raise ValidationError("Order exceeds maximum BNPL amount")
    return True
```

### Tenant Configuration Override

| Override Type | Validation | Business Rule |
|---------------|------------|---------------|
| Lower Minimum | >= system minimum | Cannot go below system limit |
| Higher Maximum | <= system maximum | Cannot exceed system limit |
| Custom Range | min < max | Range must be valid |

### Order Amount Business Logic

| Scenario | Logic | Action |
|----------|-------|--------|
| Cart Total Check | Before BNPL option | Show/hide BNPL |
| Payment Initiation | At checkout | Validate eligibility |
| Plan Calculation | Amount-based plans | Select appropriate plan |

### Expected Outcome
- Robust order amount validation system
- Configurable tenant-specific limits
- Clear error messaging for invalid amounts
- Integration with BNPL configuration model

### Verification Checklist
- [ ] Default order amount constants defined
- [ ] Order amount validation functions implemented
- [ ] Django field validators added to model
- [ ] Tenant-specific override capability
- [ ] Error handling for invalid amounts
- [ ] Business logic for amount-based decisions

---

## Task 14: Create Installment Plans

### Overview
Implement installment plan configuration and management for BNPL services. This system defines available payment plans (3, 4, 6 months), calculates payment schedules, and manages plan-specific rules for both KOKO and MintPay providers.

### Dependencies
- Task 12: Create BNPL Config Model
- Task 13: Create Min/Max Order Amount

### Instructions

1. **Create InstallmentPlan model**
   - Define Django model for installment plan configuration
   - Add fields for plan duration, description, and availability
   - Include provider-specific plan support

2. **Define standard installment plans**
   - Create 3-month plan configuration
   - Add 4-month plan configuration
   - Include 6-month plan configuration

3. **Implement plan calculation logic**
   - Create function to calculate monthly payment amounts
   - Add logic for handling remainder cents distribution
   - Include interest/fee calculation if applicable

4. **Add plan eligibility rules**
   - Create amount-based plan eligibility
   - Add customer-specific plan restrictions
   - Include provider-specific plan availability

5. **Implement plan selection logic**
   - Create function to determine available plans for order
   - Add automatic plan recommendation based on amount
   - Include customer preference handling

6. **Add plan validation and constraints**
   - Validate plan configuration consistency
   - Add constraints for plan activation
   - Include business rule validation

### Installment Plan Model Structure

| Field | Type | Purpose | Validation |
|-------|------|---------|------------|
| name | CharField | Plan identifier | Unique |
| duration_months | IntegerField | Payment period | 3, 4, or 6 |
| description | TextField | Plan description | Required |
| is_active | BooleanField | Plan availability | Default True |

### Standard Installment Plans

| Plan | Duration | Description | Target Use |
|------|----------|-------------|------------|
| Short | 3 months | 3 equal payments | Small purchases (₨5K-₨25K) |
| Standard | 4 months | 4 equal payments | Medium purchases (₨25K-₨100K) |
| Extended | 6 months | 6 equal payments | Large purchases (₨100K-₨250K) |

### Payment Calculation Logic

```python
def calculate_installments(amount, months):
    """Calculate equal installment amounts"""
    base_amount = amount // months
    remainder = amount % months
    
    installments = [base_amount] * months
    # Distribute remainder to first payments
    for i in range(remainder):
        installments[i] += 1
    
    return installments
```

### Plan Eligibility Matrix

| Order Amount | 3-Month | 4-Month | 6-Month | Recommended |
|--------------|---------|---------|---------|-------------|
| ₨5K - ₨25K | ✓ | ✓ | ✗ | 3-Month |
| ₨25K - ₨100K | ✓ | ✓ | ✓ | 4-Month |
| ₨100K - ₨250K | ✗ | ✓ | ✓ | 6-Month |

### Provider-Specific Plan Support

| Provider | 3-Month | 4-Month | 6-Month | Custom Plans |
|----------|---------|---------|---------|--------------|
| KOKO | ✓ | ✓ | ✓ | No |
| MintPay | ✓ | ✓ | ✓ | Limited |

### Plan Selection Algorithm

```
Order Amount Analysis
├── Amount < ₨25K → Recommend 3-month
├── ₨25K ≤ Amount < ₨100K → Recommend 4-month
└── Amount ≥ ₨100K → Recommend 6-month

Provider Availability Check
├── KOKO Plans → All standard plans
└── MintPay Plans → All standard plans

Customer Preference
├── Previous Plan Usage → Suggest same
└── Payment History → Adjust recommendation
```

### Plan Validation Rules

| Rule | Validation | Error Handling |
|------|------------|----------------|
| Duration Valid | 3, 4, or 6 months | ValidationError |
| Amount Compatible | Plan suits order amount | Show alternative |
| Provider Support | Plan available for provider | Filter options |

### Expected Outcome
- Comprehensive installment plan management system
- Flexible plan calculation and selection logic
- Provider-aware plan availability
- Customer-friendly plan recommendations

### Verification Checklist
- [ ] InstallmentPlan model created
- [ ] Standard plans (3, 4, 6 months) configured
- [ ] Payment calculation logic implemented
- [ ] Plan eligibility rules defined
- [ ] Plan selection algorithm created
- [ ] Provider-specific plan support added

---

## Task 15: Create Config Validation

### Overview
Implement comprehensive validation system for BNPL configuration to ensure all settings are properly configured, consistent, and operational before enabling BNPL services. This validation covers API credentials, provider settings, order limits, and system integration points.

### Dependencies
- Task 06: Create KOKO Settings
- Task 09: Create MintPay Settings
- Task 12: Create BNPL Config Model
- Task 14: Create Installment Plans

### Instructions

1. **Create BNPLConfigValidator class**
   - Define validator class for comprehensive config validation
   - Add methods for different validation categories
   - Include error collection and reporting

2. **Implement credential validation**
   - Validate KOKO API key presence and format
   - Validate MintPay API key presence and format
   - Check merchant ID configurations for both providers

3. **Add connectivity validation**
   - Test API connectivity to KOKO endpoints
   - Test API connectivity to MintPay endpoints
   - Validate webhook endpoint accessibility

4. **Implement business rule validation**
   - Validate order amount ranges are logical
   - Check installment plan configurations
   - Ensure at least one provider is enabled

5. **Add environment consistency validation**
   - Validate environment-specific settings match
   - Check sandbox/production URL consistency
   - Ensure credential environments align

6. **Create validation reporting system**
   - Generate validation reports with detailed errors
   - Include warnings for suboptimal configurations
   - Provide recommendations for fixing issues

### BNPL Config Validation Categories

| Category | Validations | Criticality |
|----------|-------------|-------------|
| Credentials | API keys, merchant IDs | Critical |
| Connectivity | API endpoints, webhooks | Critical |
| Business Rules | Amount limits, plans | High |
| Configuration | Settings consistency | Medium |

### Credential Validation Rules

| Provider | Validation | Method |
|----------|------------|--------|
| KOKO | API key format | Regex pattern match |
| KOKO | Merchant ID presence | Not null/empty check |
| MintPay | API key format | Format validation |
| MintPay | Merchant ID presence | Required field check |

### Connectivity Validation Tests

| Test | Endpoint | Expected Response |
|------|---------|-------------------|
| KOKO Health | /health or /status | HTTP 200 |
| MintPay Health | /ping or /status | HTTP 200 |
| API Authentication | Provider-specific | Valid auth response |

### Business Rule Validations

| Rule | Validation | Error Action |
|------|------------|--------------|
| Min < Max Amount | min_amount < max_amount | ConfigurationError |
| Positive Amounts | amounts > 0 | ValidationError |
| Provider Enabled | At least one provider active | ConfigurationError |
| Plan Availability | Valid installment plans exist | BusinessLogicError |

### Validation Implementation Structure

```python
class BNPLConfigValidator:
    def __init__(self, config):
        self.config = config
        self.errors = []
        self.warnings = []
    
    def validate_all(self):
        """Run all validation checks"""
        self.validate_credentials()
        self.validate_connectivity()
        self.validate_business_rules()
        return self.get_validation_result()
    
    def validate_credentials(self):
        """Validate API credentials"""
        # Implementation for credential validation
        
    def validate_connectivity(self):
        """Test API connectivity"""
        # Implementation for connectivity testing
```

### Validation Error Categories

| Category | Severity | Action Required |
|----------|----------|-----------------|
| Critical Error | High | Block BNPL activation |
| Configuration Error | Medium | Fix before production |
| Warning | Low | Recommend improvement |

### Validation Report Format

| Section | Content | Purpose |
|---------|---------|---------|
| Summary | Pass/fail status | Quick overview |
| Critical Issues | Blocking errors | Immediate attention |
| Warnings | Improvement suggestions | Optimization |
| Recommendations | Best practices | Configuration guidance |

### Environment-Specific Validation

| Environment | Additional Checks | Purpose |
|-------------|------------------|---------|
| Production | SSL certificate validation | Security |
| Production | Rate limit compliance | Performance |
| Sandbox | Test data availability | Development |

### Expected Outcome
- Comprehensive BNPL configuration validation system
- Clear error reporting and remediation guidance
- Confidence in BNPL system reliability
- Prevention of runtime configuration errors

### Verification Checklist
- [ ] BNPLConfigValidator class created
- [ ] Credential validation implemented
- [ ] Connectivity testing added
- [ ] Business rule validation created
- [ ] Environment consistency checks
- [ ] Validation reporting system implemented
- [ ] Error categorization and handling

---

## Task 16: Verify BNPL Configuration

### Overview
Implement comprehensive verification system to test the complete BNPL configuration and ensure all components work together correctly. This verification process runs the validation suite, tests integration points, and confirms the system is ready for BNPL operations.

### Dependencies
- Task 15: Create Config Validation
- All previous tasks in this group (01-15)

### Instructions

1. **Create BNPL verification command**
   - Create Django management command for verification
   - Add command-line options for different verification levels
   - Include output formatting for verification results

2. **Implement comprehensive verification suite**
   - Run config validation from Task 15
   - Test actual API calls to both providers
   - Verify database model operations

3. **Add integration testing**
   - Test BNPL workflow from order to payment
   - Verify webhook handling and processing
   - Test error scenarios and fallback mechanisms

4. **Create verification reporting**
   - Generate detailed verification reports
   - Include performance metrics and response times
   - Provide pass/fail status for each component

5. **Implement continuous verification**
   - Add verification to application startup
   - Create periodic verification scheduling
   - Include monitoring integration for ongoing checks

6. **Add verification documentation**
   - Document verification procedures
   - Include troubleshooting guide for failures
   - Provide verification best practices

### BNPL Verification Command Structure

```python
class Command(BaseCommand):
    help = 'Verify BNPL configuration and connectivity'
    
    def add_arguments(self, parser):
        parser.add_argument('--level', choices=['basic', 'full'])
        parser.add_argument('--provider', choices=['koko', 'mintpay', 'all'])
    
    def handle(self, *args, **options):
        # Implementation for verification
```

### Verification Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| Configuration | Settings validation | Config correctness |
| Connectivity | API endpoint tests | Network connectivity |
| Authentication | Credential verification | Access validation |
| Business Logic | Amount/plan validation | Rule enforcement |
| Integration | End-to-end workflow | System integration |

### Provider-Specific Verification Tests

| Provider | Test | Expected Result |
|----------|------|----------------|
| KOKO | Authentication test | Valid auth response |
| KOKO | Eligibility check | Proper eligibility response |
| MintPay | Authentication test | Valid auth response |
| MintPay | Account verification | Account status confirmed |

### Integration Verification Workflow

```
1. Configuration Validation
   ├── Credentials present and valid
   ├── URLs accessible
   └── Business rules consistent

2. Provider Connectivity
   ├── KOKO API accessible
   ├── MintPay API accessible
   └── Response times acceptable

3. Business Logic Testing
   ├── Order amount validation
   ├── Plan calculation accuracy
   └── Eligibility determination

4. Error Handling Verification
   ├── Invalid credential handling
   ├── Network failure responses
   └── Business rule violations
```

### Verification Reporting Format

| Section | Content | Detail Level |
|---------|---------|--------------|
| Executive Summary | Overall pass/fail | High level |
| Configuration Status | Setting validation results | Medium |
| Provider Status | Individual provider health | Detailed |
| Performance Metrics | Response times, availability | Technical |
| Recommendations | Improvement suggestions | Actionable |

### Verification Levels

| Level | Scope | Use Case |
|-------|-------|----------|
| Basic | Config and connectivity | Quick health check |
| Full | Complete integration testing | Deployment verification |
| Continuous | Ongoing monitoring checks | Production monitoring |

### Startup Verification Integration

| Check | Timing | Action on Failure |
|-------|--------|-------------------|
| Critical Config | Application startup | Fail to start |
| Provider Connectivity | After startup | Log warning |
| Business Rules | Before first transaction | Graceful degradation |

### Verification Monitoring

| Metric | Threshold | Alert Action |
|--------|-----------|-------------|
| Verification Success Rate | < 95% | Notify operations |
| API Response Time | > 5 seconds | Performance alert |
| Configuration Errors | > 0 | Configuration alert |

### Expected Outcome
- Comprehensive BNPL system verification
- Confidence in system reliability and correctness
- Early detection of configuration issues
- Operational readiness confirmation

### Verification Checklist
- [ ] Django management command created
- [ ] Comprehensive verification suite implemented
- [ ] Provider-specific tests added
- [ ] Integration workflow testing
- [ ] Verification reporting system
- [ ] Continuous monitoring integration
- [ ] Documentation and troubleshooting guide

---

## Summary

This document has completed the BNPL configuration by implementing MintPay settings, creating the configuration model, and establishing comprehensive validation and verification systems.

### Completed Tasks (09-16)
- **Task 09:** Created comprehensive MintPay settings module
- **Task 10:** Implemented MintPay API key configuration and validation
- **Task 11:** Set up MintPay Merchant ID with proper security measures
- **Task 12:** Created BNPL configuration model for tenant-specific settings
- **Task 13:** Implemented order amount limits with validation
- **Task 14:** Created installment plan system with calculation logic
- **Task 15:** Built comprehensive configuration validation system
- **Task 16:** Established complete BNPL verification and monitoring

### Key Achievements
- Complete dual-provider BNPL infrastructure (KOKO and MintPay)
- Tenant-specific configuration management
- Robust validation and verification systems
- Comprehensive error handling and monitoring
- Production-ready security and reliability measures

### Final System Capabilities
- **Multi-Provider Support:** Both KOKO and MintPay fully configured
- **Tenant Flexibility:** Customizable settings per tenant
- **Order Management:** Smart amount limits and plan selection
- **Reliability:** Comprehensive validation and verification
- **Security:** Proper credential management and validation
- **Monitoring:** Continuous health checking and alerting

The BNPL configuration is now complete and ready for integration with the payment processing workflow. The next group will implement the actual BNPL processors that use these configurations to process payments.