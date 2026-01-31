# Tasks 01-10: App, Choices, Method & Transaction Models

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** A - Payment Models & Core  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-11-18_Refund-Webhook-Migrations.md](02_Tasks-11-18_Refund-Webhook-Migrations.md)

---

## Document Overview

This document covers the creation of the core payment system infrastructure including the Django payment app, payment-related choices (gateway types, statuses, method types), payment method models with configuration and validation, and payment transaction models. This establishes the foundation for Sri Lankan payment gateway integrations with support for LKR currency and local payment methods.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Payment App | Low | 30 min |
| 02 | Create PaymentGateway Choices | Low | 20 min |
| 03 | Create PaymentStatus Choices | Low | 20 min |
| 04 | Create PaymentMethodType Choices | Low | 25 min |
| 05 | Create PaymentMethod Model | Medium | 45 min |
| 06 | Create PaymentMethod Config | Medium | 40 min |
| 07 | Create PaymentMethod Validation | Medium | 35 min |
| 08 | Create PaymentTransaction Model | Medium | 50 min |
| 09 | Create Transaction Order FK | Low | 15 min |
| 10 | Create Transaction Amount Fields | Low | 20 min |

---

## Task 01: Create Payment App

### Overview
Create a new Django application named `payments` that will house all payment-related models, views, and business logic. This app will manage payment gateways, payment methods, transactions, refunds, and webhook integrations for Sri Lankan payment providers.

### Dependencies
- Phase-08 (Webstore E-commerce Platform) must be complete
- Django project structure established
- Multi-tenant architecture configured

### Instructions

1. **Navigate to backend directory**
   - Go to `backend/` directory in the project root
   - Ensure Django project is properly initialized
   - Verify virtual environment is activated

2. **Create the payments Django app**
   - Run Django management command to create new app
   - Use command: `python manage.py startapp payments`
   - Verify app directory structure is created

3. **Configure app in Django settings**
   - Open `backend/config/settings/base.py`
   - Add `'payments'` to `INSTALLED_APPS` list
   - Place after core apps but before third-party apps

4. **Create app directory structure**
   - Verify standard Django app files exist: `__init__.py`, `admin.py`, `apps.py`, `models.py`, `tests.py`, `views.py`
   - Create additional directories: `migrations/`, `templates/payments/`, `static/payments/`

5. **Configure app configuration**
   - Open `payments/apps.py`
   - Update `PaymentsConfig` class with proper name and verbose name
   - Set `default_auto_field = 'django.db.models.BigAutoField'`

6. **Create initial directory structure**
   - Create `payments/managers/` for custom model managers
   - Create `payments/serializers/` for DRF serializers
   - Create `payments/utils/` for payment utilities
   - Create `payments/validators/` for custom validators
   - Create `payments/services/` for business logic services

7. **Initialize module files**
   - Add `__init__.py` files to all new directories
   - Create basic imports in main `__init__.py` if needed

### App Structure
```
backend/payments/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
├── views.py
├── migrations/
│   └── __init__.py
├── managers/
│   └── __init__.py
├── serializers/
│   └── __init__.py
├── services/
│   └── __init__.py
├── utils/
│   └── __init__.py
├── validators/
│   └── __init__.py
├── templates/payments/
└── static/payments/
```

### App Configuration Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| App Name | `payments` | Django app identifier |
| Verbose Name | `Payment System` | Human-readable name |
| Default Auto Field | `BigAutoField` | Primary key field type |

### Expected Outcome
- New Django payments app created and configured
- App registered in INSTALLED_APPS
- Directory structure established for organized development
- Ready for model development

### Verification Checklist
- [ ] `backend/payments/` directory exists
- [ ] App added to `INSTALLED_APPS` in settings
- [ ] `PaymentsConfig` properly configured
- [ ] All required subdirectories created
- [ ] `__init__.py` files added to subdirectories

---

## Task 02: Create PaymentGateway Choices

### Overview
Create Django choices for payment gateway types that will be supported in the Sri Lankan market. This includes local banks, international gateways, mobile payment systems, and digital wallets commonly used in Sri Lanka.

### Dependencies
- Task 01: Create Payment App

### Instructions

1. **Create choices module**
   - Navigate to `backend/payments/` directory
   - Create new file named `choices.py`
   - This will house all payment-related choice constants

2. **Define PaymentGateway choices**
   - Create `PAYMENT_GATEWAY_CHOICES` tuple with key-value pairs
   - Include Sri Lankan banks and payment providers
   - Include international gateways available in Sri Lanka

3. **Include Sri Lankan payment gateways**
   - **Commercial Bank**: Most popular bank gateway
   - **Sampath Bank**: Major local bank gateway  
   - **HNB (Hatton National Bank)**: Leading bank gateway
   - **BOC (Bank of Ceylon)**: State bank gateway
   - **DFCC Bank**: Digital-focused bank gateway

4. **Include mobile payment systems**
   - **Dialog eZ Cash**: Leading mobile payment system
   - **Mobitel mCash**: Major mobile payment platform
   - **Hutch PayMe**: Mobile operator payment system

5. **Include international gateways**
   - **PayPal**: International standard (limited in LK)
   - **Stripe**: International card processing
   - **Razorpay**: Regional gateway with LK support
   - **2Checkout**: International payment platform

6. **Include digital wallet options**
   - **LANKAQR**: National QR payment standard
   - **iPay**: Digital wallet solution
   - **Genie**: Bank-backed digital wallet

7. **Create gateway categorization**
   - Create additional choice sets for gateway categories
   - Categories: BANK, MOBILE, INTERNATIONAL, WALLET
   - This helps in filtering and displaying gateways

8. **Add gateway status choices**
   - Create `GATEWAY_STATUS_CHOICES` for active/inactive states
   - Include: ACTIVE, INACTIVE, MAINTENANCE, DEPRECATED

### Payment Gateway Structure

| Category | Gateways | Local Popularity |
|----------|----------|------------------|
| Banks | Commercial, Sampath, HNB, BOC, DFCC | Very High |
| Mobile | eZ Cash, mCash, PayMe | High |
| International | PayPal, Stripe, Razorpay | Medium |
| Digital Wallets | LANKAQR, iPay, Genie | Growing |

### Choice Constants Format

```
PAYMENT_GATEWAY_CHOICES = (
    # Sri Lankan Banks
    ('commercial_bank', 'Commercial Bank Gateway'),
    ('sampath_bank', 'Sampath Bank Gateway'),
    # ... additional choices
)
```

### Gateway Categories

| Category Code | Category Name | Description |
|---------------|---------------|-------------|
| BANK | Bank Gateways | Traditional bank payment gateways |
| MOBILE | Mobile Payments | Mobile operator payment systems |
| INTERNATIONAL | International | Global payment providers |
| WALLET | Digital Wallets | Digital wallet solutions |

### Expected Outcome
- Comprehensive list of Sri Lankan payment gateways
- Proper categorization for easy management
- Status choices for gateway lifecycle management
- Ready for use in PaymentMethod model

### Verification Checklist
- [ ] `backend/payments/choices.py` file created
- [ ] `PAYMENT_GATEWAY_CHOICES` tuple defined
- [ ] Sri Lankan banks included (Commercial, Sampath, HNB, BOC, DFCC)
- [ ] Mobile payment systems included (eZ Cash, mCash, PayMe)
- [ ] International gateways included (PayPal, Stripe, Razorpay)
- [ ] Digital wallets included (LANKAQR, iPay, Genie)
- [ ] Gateway categories defined
- [ ] Gateway status choices created

---

## Task 03: Create PaymentStatus Choices

### Overview
Create Django choices for payment transaction statuses that cover the complete payment lifecycle from initiation to completion or failure. These statuses will be used to track payment state changes and enable proper handling of different payment scenarios.

### Dependencies
- Task 01: Create Payment App

### Instructions

1. **Add PaymentStatus choices to choices.py**
   - Open `backend/payments/choices.py`
   - Add `PAYMENT_STATUS_CHOICES` tuple after gateway choices
   - Include all possible payment states

2. **Define initial payment statuses**
   - **PENDING**: Payment initiated, awaiting processing
   - **PROCESSING**: Payment being processed by gateway
   - **AUTHORIZED**: Payment authorized but not captured
   - **CAPTURED**: Payment successfully captured

3. **Define completion statuses**
   - **COMPLETED**: Payment fully successful
   - **SETTLED**: Payment settled by gateway/bank
   - **CONFIRMED**: Payment confirmed by all parties

4. **Define failure statuses**
   - **FAILED**: Payment processing failed
   - **DECLINED**: Payment declined by bank/gateway
   - **CANCELLED**: Payment cancelled by user/system
   - **EXPIRED**: Payment session expired

5. **Define refund-related statuses**
   - **REFUND_PENDING**: Refund requested, awaiting processing
   - **REFUND_PROCESSING**: Refund being processed
   - **REFUNDED**: Refund completed successfully
   - **PARTIAL_REFUND**: Partial refund completed

6. **Define dispute-related statuses**
   - **DISPUTED**: Payment disputed by customer
   - **CHARGEBACK**: Chargeback initiated
   - **CHARGEBACK_RESOLVED**: Chargeback resolved

7. **Define system statuses**
   - **UNKNOWN**: Status cannot be determined
   - **ERROR**: System error occurred
   - **TIMEOUT**: Payment timed out

8. **Create status categories**
   - Create `PAYMENT_STATUS_CATEGORIES` for grouping statuses
   - Categories: SUCCESS, PENDING, FAILED, REFUND, DISPUTE

### Payment Status Flow

```
PENDING → PROCESSING → AUTHORIZED → CAPTURED → COMPLETED → SETTLED
                    ↓
                DECLINED/FAILED/CANCELLED
                    ↓
                 EXPIRED
```

### Status Categories

| Category | Statuses | Description |
|----------|----------|-------------|
| SUCCESS | COMPLETED, SETTLED, CONFIRMED | Successful payments |
| PENDING | PENDING, PROCESSING, AUTHORIZED | In-progress payments |
| FAILED | FAILED, DECLINED, CANCELLED, EXPIRED | Failed payments |
| REFUND | REFUND_PENDING, REFUNDED, PARTIAL_REFUND | Refund-related |
| DISPUTE | DISPUTED, CHARGEBACK | Dispute-related |

### Status Code Mapping

| Status Code | Display Name | Category | Description |
|-------------|--------------|----------|-------------|
| pending | Pending Payment | PENDING | Payment initiated |
| processing | Processing | PENDING | Being processed |
| authorized | Authorized | PENDING | Funds authorized |
| completed | Payment Completed | SUCCESS | Successfully paid |
| failed | Payment Failed | FAILED | Processing failed |
| cancelled | Payment Cancelled | FAILED | User cancelled |
| refunded | Refunded | REFUND | Fully refunded |

### Expected Outcome
- Comprehensive payment status choices covering all scenarios
- Proper categorization for status filtering
- Clear status flow definition
- Ready for use in PaymentTransaction model

### Verification Checklist
- [ ] `PAYMENT_STATUS_CHOICES` added to choices.py
- [ ] Initial statuses defined (PENDING, PROCESSING, AUTHORIZED)
- [ ] Completion statuses defined (COMPLETED, SETTLED, CONFIRMED)
- [ ] Failure statuses defined (FAILED, DECLINED, CANCELLED)
- [ ] Refund statuses defined (REFUND_PENDING, REFUNDED)
- [ ] Dispute statuses defined (DISPUTED, CHARGEBACK)
- [ ] System statuses defined (UNKNOWN, ERROR, TIMEOUT)
- [ ] Status categories created

---

## Task 04: Create PaymentMethodType Choices

### Overview
Create Django choices for payment method types that are commonly used in Sri Lanka. This includes various card types, bank transfers, mobile payments, digital wallets, and cash-on-delivery options specific to the Sri Lankan e-commerce market.

### Dependencies
- Task 01: Create Payment App

### Instructions

1. **Add PaymentMethodType choices to choices.py**
   - Open `backend/payments/choices.py`
   - Add `PAYMENT_METHOD_TYPE_CHOICES` tuple after status choices
   - Include all payment methods available in Sri Lanka

2. **Define card payment methods**
   - **VISA**: Visa credit/debit cards
   - **MASTERCARD**: MasterCard credit/debit cards
   - **AMEX**: American Express cards (limited acceptance)
   - **DINERS**: Diners Club cards (rare but supported)

3. **Define bank transfer methods**
   - **BANK_TRANSFER**: Direct bank transfer
   - **ONLINE_BANKING**: Internet banking transfer
   - **REAL_TIME_TRANSFER**: Real-time bank transfer
   - **SLIPS**: Bank deposit slips

4. **Define mobile payment methods**
   - **EZCASH**: Dialog eZ Cash mobile payments
   - **MCASH**: Mobitel mCash mobile payments
   - **PAYME**: Hutch PayMe mobile payments

5. **Define digital wallet methods**
   - **LANKAQR**: National QR code standard
   - **IPAY**: iPay digital wallet
   - **GENIE**: Genie digital wallet
   - **DIGITAL_WALLET**: Generic digital wallet

6. **Define alternative payment methods**
   - **COD**: Cash on Delivery (very popular in LK)
   - **BANK_DEPOSIT**: Direct bank deposit
   - **CHEQUE**: Cheque payment (for B2B)
   - **INSTALLMENTS**: Installment payment plans

7. **Define cryptocurrency options (future)**
   - **BITCOIN**: Bitcoin payments (emerging)
   - **ETHEREUM**: Ethereum payments (emerging)
   - **CRYPTO**: Generic cryptocurrency

8. **Create method categorization**
   - Create `PAYMENT_METHOD_CATEGORIES` for grouping
   - Categories: CARD, BANK, MOBILE, WALLET, ALTERNATIVE, CRYPTO

### Sri Lankan Payment Method Popularity

| Method Type | Popularity | Availability | Usage Scenario |
|-------------|------------|---------------|----------------|
| VISA/MasterCard | High | Universal | Online purchases |
| eZ Cash | Very High | Dialog users | Small transactions |
| Bank Transfer | High | All banks | Large transactions |
| COD | Very High | Nationwide | Trust-preferred |
| LANKAQR | Growing | Modern POS | QR payments |

### Payment Method Categories

| Category | Methods | Target Users |
|----------|---------|--------------|
| CARD | VISA, MasterCard, AMEX | Urban, tech-savvy |
| MOBILE | eZ Cash, mCash, PayMe | Mobile users |
| BANK | Bank Transfer, Online Banking | All users |
| WALLET | LANKAQR, iPay, Genie | Tech adopters |
| ALTERNATIVE | COD, Bank Deposit | Traditional users |

### Method Configuration

| Method | Requires Auth | Processing Time | Availability |
|--------|---------------|-----------------|--------------|
| VISA | Yes | Instant | 24/7 |
| eZ Cash | Yes | Instant | 24/7 |
| Bank Transfer | Yes | 1-24 hours | Business hours |
| COD | No | On delivery | Business hours |
| LANKAQR | Yes | Instant | 24/7 |

### Expected Outcome
- Comprehensive payment method types for Sri Lankan market
- Proper categorization for easy management
- Coverage of traditional and modern payment methods
- Ready for use in PaymentMethod model

### Verification Checklist
- [ ] `PAYMENT_METHOD_TYPE_CHOICES` added to choices.py
- [ ] Card types defined (VISA, MasterCard, AMEX)
- [ ] Bank transfer methods defined (Bank Transfer, Online Banking)
- [ ] Mobile payment methods defined (eZ Cash, mCash, PayMe)
- [ ] Digital wallet methods defined (LANKAQR, iPay, Genie)
- [ ] Alternative methods defined (COD, Bank Deposit, Cheque)
- [ ] Payment method categories created
- [ ] Future cryptocurrency options included

---

## Task 05: Create PaymentMethod Model

### Overview
Create the PaymentMethod Django model that defines individual payment methods available to customers. This model stores configuration for each payment gateway/method combination, including display settings, processing configuration, and Sri Lankan localization settings.

### Dependencies
- Task 02: Create PaymentGateway Choices
- Task 04: Create PaymentMethodType Choices

### Instructions

1. **Create PaymentMethod model in models.py**
   - Open `backend/payments/models.py`
   - Import required Django model fields and mixins
   - Import payment choices from choices.py

2. **Define core identification fields**
   - **name**: CharField(100) - Display name for the payment method
   - **slug**: SlugField(100) - URL-friendly identifier
   - **gateway**: CharField with PAYMENT_GATEWAY_CHOICES
   - **method_type**: CharField with PAYMENT_METHOD_TYPE_CHOICES

3. **Add display configuration fields**
   - **display_name_en**: CharField(100) - English display name
   - **display_name_si**: CharField(100) - Sinhala display name  
   - **display_name_ta**: CharField(100) - Tamil display name
   - **description**: TextField - Method description
   - **icon**: ImageField - Payment method icon
   - **logo_url**: URLField - External logo URL

4. **Add processing configuration fields**
   - **is_active**: BooleanField(default=True) - Enable/disable method
   - **is_test_mode**: BooleanField(default=False) - Test/production mode
   - **processing_fee_percentage**: DecimalField(5,4) - Percentage fee
   - **processing_fee_fixed**: DecimalField(10,2) - Fixed fee in LKR
   - **minimum_amount**: DecimalField(10,2) - Minimum transaction amount
   - **maximum_amount**: DecimalField(15,2) - Maximum transaction amount

5. **Add Sri Lankan specific fields**
   - **supports_lkr**: BooleanField(default=True) - LKR currency support
   - **supports_installments**: BooleanField(default=False) - Installment support
   - **bank_code**: CharField(20) - Sri Lankan bank code
   - **mobile_operator**: CharField(50) - Mobile operator for mobile payments

6. **Add ordering and priority fields**
   - **sort_order**: PositiveIntegerField(default=0) - Display order
   - **priority**: CharField choices for HIGH/MEDIUM/LOW priority
   - **recommended**: BooleanField(default=False) - Mark as recommended

7. **Add meta fields**
   - **created_at**: DateTimeField(auto_now_add=True)
   - **updated_at**: DateTimeField(auto_now=True)
   - **created_by**: ForeignKey to User (optional)

8. **Define model Meta class**
   - Set proper table name: `payment_methods`
   - Add ordering by priority and sort_order
   - Create unique constraint on (gateway, method_type)
   - Add verbose names for admin

9. **Add __str__ method**
   - Return display name for admin and debugging
   - Format: "{gateway} - {method_type}"

### Model Field Specifications

| Field | Type | Max Length | Required | Default | Purpose |
|-------|------|------------|----------|---------|---------|
| name | CharField | 100 | Yes | - | Internal name |
| slug | SlugField | 100 | Yes | - | URL identifier |
| gateway | CharField | 50 | Yes | - | Payment gateway |
| method_type | CharField | 50 | Yes | - | Payment method type |
| display_name_en | CharField | 100 | Yes | - | English display |
| processing_fee_percentage | DecimalField | 5,4 | No | 0.0000 | Percentage fee |
| minimum_amount | DecimalField | 10,2 | No | 0.00 | Min amount LKR |
| maximum_amount | DecimalField | 15,2 | No | 1000000.00 | Max amount LKR |

### Sri Lankan Localization Fields

| Field | Purpose | Example Values |
|-------|---------|----------------|
| display_name_si | Sinhala display | "විස්ටා කාඩ්පත්" |
| display_name_ta | Tamil display | "விசா கார்டு" |
| bank_code | Local bank identifier | "7010" (Commercial Bank) |
| mobile_operator | Operator code | "DIALOG", "MOBITEL", "HUTCH" |

### Processing Configuration

| Setting | Data Type | Purpose |
|---------|-----------|---------|
| processing_fee_percentage | Decimal(5,4) | Gateway fee as percentage |
| processing_fee_fixed | Decimal(10,2) | Fixed fee in LKR |
| minimum_amount | Decimal(10,2) | Minimum transaction in LKR |
| maximum_amount | Decimal(15,2) | Maximum transaction in LKR |
| supports_installments | Boolean | Installment payment support |

### Expected Outcome
- Complete PaymentMethod model with all required fields
- Multi-language support for Sri Lankan languages
- Processing fee and limit configuration
- Proper model relationships and constraints

### Verification Checklist
- [ ] PaymentMethod model created in models.py
- [ ] Core identification fields added (name, slug, gateway, method_type)
- [ ] Multi-language display fields added (en, si, ta)
- [ ] Processing configuration fields added (fees, limits)
- [ ] Sri Lankan specific fields added (bank_code, mobile_operator)
- [ ] Meta class configured with proper table name and ordering
- [ ] __str__ method implemented
- [ ] Model imports and choices properly referenced

---

## Task 06: Create PaymentMethod Config

### Overview
Create a configuration system for PaymentMethod instances that stores gateway-specific settings, API credentials, and processing parameters. This configuration will be stored as JSON fields to handle varying requirements across different payment gateways.

### Dependencies
- Task 05: Create PaymentMethod Model

### Instructions

1. **Add configuration fields to PaymentMethod model**
   - Open `backend/payments/models.py`
   - Add JSON configuration fields to PaymentMethod model
   - Import JSONField from django.db.models

2. **Add gateway configuration field**
   - **gateway_config**: JSONField - Gateway-specific settings
   - Default to empty dict: `default=dict`
   - Will store API endpoints, merchant IDs, etc.

3. **Add credentials configuration field**
   - **credentials**: JSONField - Sensitive authentication data
   - Default to empty dict: `default=dict`
   - Will store API keys, secrets, certificates

4. **Add processing configuration field**
   - **processing_config**: JSONField - Processing parameters
   - Default to empty dict: `default=dict`
   - Will store timeout settings, retry logic, etc.

5. **Add UI configuration field**
   - **ui_config**: JSONField - User interface settings
   - Default to empty dict: `default=dict`
   - Will store button colors, form layouts, etc.

6. **Define configuration schemas**
   - Create sample configuration structures for each gateway type
   - Document expected configuration keys and values
   - Include validation rules for configuration data

7. **Add configuration validation methods**
   - Create `validate_gateway_config()` method
   - Create `validate_credentials()` method
   - Create `validate_processing_config()` method

8. **Create configuration helper methods**
   - **get_config_value(key, default=None)**: Retrieve specific config value
   - **set_config_value(key, value)**: Set specific config value
   - **merge_config(config_dict)**: Merge configuration updates

### Configuration Field Structure

| Field | Type | Purpose | Security Level |
|-------|------|---------|----------------|
| gateway_config | JSONField | Gateway settings | Low |
| credentials | JSONField | API keys, secrets | High |
| processing_config | JSONField | Processing rules | Medium |
| ui_config | JSONField | Display settings | Low |

### Gateway Configuration Examples

**Commercial Bank Gateway Config:**
```json
{
  "api_url": "https://testpayments.combank.lk/api/",
  "merchant_id": "TEST_MERCHANT_001",
  "currency": "LKR",
  "timeout": 30,
  "callback_url": "/payments/callback/commercial/"
}
```

**eZ Cash Mobile Config:**
```json
{
  "api_url": "https://api.ezcash.lk/v1/",
  "service_code": "ECOMMERCE",
  "operator_code": "DIALOG",
  "timeout": 60
}
```

### Credentials Configuration

| Gateway Type | Required Credentials |
|--------------|---------------------|
| Bank Gateways | merchant_id, api_key, secret_key |
| Mobile Payments | app_id, app_secret, service_token |
| International | public_key, private_key, webhook_secret |
| Digital Wallets | client_id, client_secret, callback_token |

### Processing Configuration

| Setting | Type | Purpose | Default |
|---------|------|---------|---------|
| timeout_seconds | Integer | Request timeout | 30 |
| max_retries | Integer | Retry attempts | 3 |
| auto_capture | Boolean | Auto capture payments | true |
| send_receipt | Boolean | Send email receipt | true |

### UI Configuration

| Setting | Type | Purpose | Example |
|---------|------|---------|---------|
| button_color | String | Payment button color | "#0066CC" |
| button_text | String | Button label | "Pay with Visa" |
| show_logo | Boolean | Display gateway logo | true |
| form_theme | String | Form styling theme | "modern" |

### Expected Outcome
- Flexible JSON-based configuration system
- Separate storage for different config types
- Helper methods for config management
- Validation methods for configuration data

### Verification Checklist
- [ ] gateway_config JSONField added to PaymentMethod
- [ ] credentials JSONField added to PaymentMethod
- [ ] processing_config JSONField added to PaymentMethod
- [ ] ui_config JSONField added to PaymentMethod
- [ ] Configuration validation methods created
- [ ] Helper methods for config management implemented
- [ ] Sample configuration schemas documented

---

## Task 07: Create PaymentMethod Validation

### Overview
Create comprehensive validation logic for PaymentMethod instances to ensure configuration correctness, security compliance, and Sri Lankan regulatory requirements. This includes field validation, configuration validation, and business rule enforcement.

### Dependencies
- Task 06: Create PaymentMethod Config

### Instructions

1. **Create custom validators module**
   - Create `backend/payments/validators.py` file
   - Import Django validation utilities
   - Import payment choices and constants

2. **Create basic field validators**
   - **validate_payment_amount**: Validate LKR amounts (positive, 2 decimals)
   - **validate_percentage_fee**: Validate fee percentages (0-100%)
   - **validate_bank_code**: Validate Sri Lankan bank codes
   - **validate_mobile_operator**: Validate mobile operator codes

3. **Add PaymentMethod model validation**
   - Override `clean()` method in PaymentMethod model
   - Add field-level validation using validators
   - Implement custom validation logic

4. **Create amount validation logic**
   - Validate minimum_amount < maximum_amount
   - Check amount limits are reasonable for LKR
   - Ensure amounts are positive and have max 2 decimal places

5. **Create fee validation logic**
   - Validate processing fees are within acceptable ranges
   - Check total fees don't exceed reasonable limits
   - Ensure percentage fees are between 0-25%

6. **Create configuration validation**
   - **validate_gateway_config**: Check required config keys exist
   - **validate_credentials_config**: Ensure sensitive data is properly formatted
   - **validate_processing_config**: Check processing parameters are valid

7. **Create business rule validation**
   - Ensure only one recommended method per gateway
   - Check active methods have valid configuration
   - Validate Sri Lankan regulatory compliance

8. **Add security validation**
   - Validate credential formats (API keys, secrets)
   - Check for common security misconfigurations
   - Ensure test/production environment consistency

### Field Validation Rules

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| minimum_amount | >= 1.00 LKR | "Minimum amount must be at least 1.00 LKR" |
| maximum_amount | <= 10,000,000 LKR | "Maximum amount cannot exceed 10M LKR" |
| processing_fee_percentage | 0% - 25% | "Processing fee must be between 0% and 25%" |
| processing_fee_fixed | >= 0 LKR | "Fixed fee cannot be negative" |

### Configuration Validation Schema

**Gateway Config Required Keys:**
```python
REQUIRED_GATEWAY_CONFIG = {
    'commercial_bank': ['api_url', 'merchant_id', 'currency'],
    'ezcash': ['api_url', 'service_code', 'operator_code'],
    'paypal': ['client_id', 'environment', 'currency'],
}
```

### Business Rule Validations

| Rule | Description | Enforcement |
|------|-------------|-------------|
| Amount Limits | minimum < maximum | Model clean() |
| Fee Reasonableness | Total fees < 25% | Custom validator |
| Currency Support | LKR support required | Business rule |
| Active Configuration | Active methods need valid config | Model clean() |

### Sri Lankan Regulatory Compliance

| Requirement | Validation | Implementation |
|-------------|------------|----------------|
| LKR Currency | All methods support LKR | Field validation |
| Bank Codes | Valid CBSL bank codes | Custom validator |
| Mobile Operators | Licensed operators only | Choice validation |
| Transaction Limits | Comply with forex limits | Amount validation |

### Security Validations

| Check | Purpose | Implementation |
|-------|---------|----------------|
| API Key Format | Prevent malformed keys | Regex validation |
| Environment Consistency | Test/prod separation | Config validation |
| Sensitive Data | Proper credential storage | Field validation |
| URL Validation | Valid gateway URLs | URL validator |

### Validation Method Structure

```python
def validate_payment_amount(value):
    """Validate LKR payment amounts"""
    if value < Decimal('1.00'):
        raise ValidationError('Amount must be at least 1.00 LKR')
    if value.as_tuple().exponent < -2:
        raise ValidationError('Amount cannot have more than 2 decimal places')
```

### Expected Outcome
- Comprehensive validation system for PaymentMethod
- Field-level and model-level validation
- Business rule enforcement
- Security and regulatory compliance

### Verification Checklist
- [ ] validators.py module created
- [ ] Basic field validators implemented
- [ ] PaymentMethod clean() method overridden
- [ ] Amount and fee validation logic added
- [ ] Configuration validation methods created
- [ ] Business rule validation implemented
- [ ] Security validation checks added
- [ ] Sri Lankan regulatory compliance validated

---

## Task 08: Create PaymentTransaction Model

### Overview
Create the PaymentTransaction Django model that records individual payment attempts and their complete lifecycle. This model will track payment details, status changes, gateway responses, and integration with the order system for the Sri Lankan e-commerce platform.

### Dependencies
- Task 03: Create PaymentStatus Choices
- Phase-08 complete (for Order model reference)

### Instructions

1. **Create PaymentTransaction model**
   - Open `backend/payments/models.py`
   - Create new PaymentTransaction model class
   - Import required fields and relationships

2. **Add transaction identification fields**
   - **transaction_id**: CharField(100, unique=True) - Internal transaction ID
   - **gateway_transaction_id**: CharField(200) - Gateway's transaction ID
   - **reference_number**: CharField(100) - Customer reference number
   - **invoice_number**: CharField(100) - Invoice/receipt number

3. **Add order relationship field**
   - **order**: ForeignKey to Order model - Associated order (Task 09)
   - Use related_name='transactions'
   - Allow null for standalone transactions

4. **Add payment method relationship**
   - **payment_method**: ForeignKey to PaymentMethod
   - Use related_name='transactions'
   - Set on_delete=PROTECT to prevent accidental deletion

5. **Add amount and currency fields** (Task 10)
   - **amount**: DecimalField(15,2) - Transaction amount
   - **currency**: CharField(3, default='LKR') - Currency code
   - **exchange_rate**: DecimalField(10,6) - Exchange rate if not LKR

6. **Add status and timing fields**
   - **status**: CharField with PAYMENT_STATUS_CHOICES
   - **initiated_at**: DateTimeField(auto_now_add=True)
   - **completed_at**: DateTimeField(null=True, blank=True)
   - **expires_at**: DateTimeField(null=True, blank=True)

7. **Add customer information fields**
   - **customer_name**: CharField(200) - Payer name
   - **customer_email**: EmailField - Payer email
   - **customer_phone**: CharField(20) - Payer phone (Sri Lankan format)
   - **billing_address**: JSONField - Billing address details

8. **Add gateway response fields**
   - **gateway_response**: JSONField - Complete gateway response
   - **gateway_error**: TextField - Error messages from gateway
   - **gateway_callback_data**: JSONField - Callback/webhook data

9. **Add processing fields**
   - **processing_fee**: DecimalField(10,2) - Gateway processing fee
   - **net_amount**: DecimalField(15,2) - Amount after fees
   - **attempts**: PositiveIntegerField(default=1) - Payment attempts
   - **is_test_transaction**: BooleanField(default=False) - Test mode flag

10. **Add audit fields**
    - **created_by**: ForeignKey to User (optional)
    - **created_at**: DateTimeField(auto_now_add=True)
    - **updated_at**: DateTimeField(auto_now=True)
    - **ip_address**: GenericIPAddressField - Customer IP

### Model Field Specifications

| Field | Type | Length | Required | Default | Purpose |
|-------|------|--------|----------|---------|---------|
| transaction_id | CharField | 100 | Yes | Generated | Unique identifier |
| gateway_transaction_id | CharField | 200 | No | None | Gateway's ID |
| amount | DecimalField | 15,2 | Yes | - | Payment amount |
| currency | CharField | 3 | Yes | 'LKR' | Currency code |
| status | CharField | 50 | Yes | 'pending' | Payment status |
| customer_name | CharField | 200 | Yes | - | Payer name |
| customer_email | EmailField | 254 | Yes | - | Payer email |

### Relationship Configuration

| Relationship | Model | Type | Cascade | Purpose |
|--------------|-------|------|---------|---------|
| order | Order | ForeignKey | CASCADE | Order payment |
| payment_method | PaymentMethod | ForeignKey | PROTECT | Payment method used |
| created_by | User | ForeignKey | SET_NULL | Transaction creator |

### Status Tracking Fields

| Field | Purpose | Type |
|-------|---------|------|
| status | Current transaction status | CharField |
| initiated_at | Transaction start time | DateTimeField |
| completed_at | Transaction end time | DateTimeField |
| expires_at | Transaction expiry | DateTimeField |

### Customer Information Schema

| Field | Format | Example |
|-------|--------|---------|
| customer_name | Full name | "John Silva" |
| customer_email | Valid email | "john@example.lk" |
| customer_phone | LK format | "+94771234567" |
| billing_address | JSON object | {"city": "Colombo", "district": "Colombo"} |

### Gateway Integration Fields

| Field | Purpose | Content Type |
|-------|---------|--------------|
| gateway_response | Full response from gateway | JSON |
| gateway_error | Error messages | Text |
| gateway_callback_data | Webhook/callback data | JSON |

### Expected Outcome
- Complete PaymentTransaction model for tracking payments
- Proper relationships with Order and PaymentMethod
- Comprehensive status and timing tracking
- Gateway integration and response storage

### Verification Checklist
- [ ] PaymentTransaction model created
- [ ] Transaction identification fields added
- [ ] Order and PaymentMethod relationships defined
- [ ] Status and timing fields configured
- [ ] Customer information fields added
- [ ] Gateway response fields included
- [ ] Processing and audit fields implemented
- [ ] Model relationships properly configured

---

## Task 09: Create Transaction Order FK

### Overview
Configure the foreign key relationship between PaymentTransaction and Order models, ensuring proper database integrity and enabling efficient queries between payment and order data. This relationship is crucial for tracking order payments in the e-commerce system.

### Dependencies
- Task 08: Create PaymentTransaction Model
- Phase-08 complete (Order model exists)

### Instructions

1. **Verify Order model import**
   - Open `backend/payments/models.py`
   - Add import for Order model from webstore app
   - Format: `from webstore.models import Order`

2. **Configure order foreign key field**
   - Locate order field in PaymentTransaction model
   - Set proper ForeignKey configuration with all parameters
   - Use proper related_name for reverse lookups

3. **Set foreign key parameters**
   - **to**: Order model reference
   - **on_delete**: models.CASCADE - Delete transactions when order is deleted
   - **related_name**: 'payment_transactions' - Reverse lookup name
   - **null**: True - Allow transactions without orders (for refunds)
   - **blank**: True - Allow empty in forms

4. **Add order validation in clean method**
   - Override clean() method in PaymentTransaction
   - Validate order exists and is in valid state for payment
   - Check order amount matches transaction amount
   - Ensure order currency matches transaction currency

5. **Create order-related helper methods**
   - **get_order_amount()**: Return associated order total amount
   - **is_order_payment()**: Check if transaction is for an order
   - **get_order_number()**: Return order number for display

6. **Add order status checking methods**
   - **can_process_order_payment()**: Check if order allows new payments
   - **is_order_fully_paid()**: Check if order is completely paid
   - **get_order_payment_balance()**: Calculate remaining payment needed

7. **Create database indexes**
   - Add database index on order field for query performance
   - Add composite index on (order, status) for efficient filtering
   - Add index on (order, created_at) for chronological ordering

8. **Update model Meta class**
   - Add indexes configuration to Meta class
   - Update verbose names to reflect order relationship
   - Add ordering that considers order relationship

### Foreign Key Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| to | 'webstore.Order' | Target model |
| on_delete | CASCADE | Delete behavior |
| related_name | 'payment_transactions' | Reverse lookup |
| null | True | Allow null values |
| blank | True | Allow blank in forms |

### Order Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Order exists | order is not None | "Transaction must be linked to an order" |
| Amount match | transaction.amount <= order.total | "Payment amount exceeds order total" |
| Currency match | transaction.currency == order.currency | "Payment currency must match order currency" |
| Order status | order.status in PAYABLE_STATUSES | "Order is not in a payable state" |

### Helper Methods Implementation

```python
def get_order_amount(self):
    """Get the total amount of the associated order"""
    if self.order:
        return self.order.total_amount
    return Decimal('0.00')

def is_order_payment(self):
    """Check if this transaction is for an order payment"""
    return self.order is not None
```

### Database Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| payment_order_idx | order | Fast order lookups |
| payment_order_status_idx | order, status | Order payment filtering |
| payment_order_created_idx | order, created_at | Chronological ordering |

### Query Performance Optimization

| Query Type | Index Used | Performance Benefit |
|------------|------------|-------------------|
| Get order payments | payment_order_idx | Fast order filtering |
| Filter by status | payment_order_status_idx | Efficient status queries |
| Order by date | payment_order_created_idx | Fast chronological sorting |
| Payment history | Composite indexes | Multi-field optimization |

### Related Manager Usage

```python
# Get all payments for an order
order = Order.objects.get(pk=123)
payments = order.payment_transactions.all()

# Get successful payments only
successful_payments = order.payment_transactions.filter(
    status='completed'
)
```

### Expected Outcome
- Properly configured foreign key relationship
- Order validation in transaction processing
- Helper methods for order-payment interaction
- Optimized database indexes for performance

### Verification Checklist
- [ ] Order model imported correctly
- [ ] Foreign key field configured with all parameters
- [ ] Order validation added to clean() method
- [ ] Helper methods for order interaction implemented
- [ ] Database indexes configured in Meta class
- [ ] Query performance optimization implemented
- [ ] Related manager usage documented

---

## Task 10: Create Transaction Amount Fields

### Overview
Configure comprehensive amount-related fields in the PaymentTransaction model to handle Sri Lankan Rupee (LKR) transactions, multi-currency support, fees calculation, and amount breakdowns. This ensures accurate financial tracking and reporting.

### Dependencies
- Task 08: Create PaymentTransaction Model

### Instructions

1. **Configure primary amount fields**
   - Verify **amount** field: DecimalField(max_digits=15, decimal_places=2)
   - Verify **currency** field: CharField(max_length=3, default='LKR')
   - Add **original_amount**: DecimalField - Amount before any conversions

2. **Add currency conversion fields**
   - **exchange_rate**: DecimalField(max_digits=10, decimal_places=6) - Conversion rate
   - **base_amount**: DecimalField(max_digits=15, decimal_places=2) - Amount in base currency
   - **conversion_timestamp**: DateTimeField - When rate was applied

3. **Add fee breakdown fields**
   - **gateway_fee**: DecimalField(max_digits=10, decimal_places=2) - Gateway processing fee
   - **platform_fee**: DecimalField(max_digits=10, decimal_places=2) - Platform service fee
   - **total_fees**: DecimalField(max_digits=10, decimal_places=2) - Combined fees
   - **net_amount**: DecimalField(max_digits=15, decimal_places=2) - Amount after fees

4. **Add tax and regulatory fields**
   - **vat_amount**: DecimalField(max_digits=10, decimal_places=2) - VAT on fees (Sri Lankan requirement)
   - **withholding_tax**: DecimalField(max_digits=10, decimal_places=2) - Withholding tax if applicable
   - **service_charge**: DecimalField(max_digits=10, decimal_places=2) - Service charges

5. **Add amount validation methods**
   - **validate_amount_fields()**: Validate all amount fields are consistent
   - **calculate_total_fees()**: Calculate combined fees automatically
   - **calculate_net_amount()**: Calculate final amount after all deductions

6. **Add currency handling methods**
   - **convert_to_lkr()**: Convert foreign currency to LKR
   - **get_display_amount()**: Get amount in display format
   - **format_amount_for_gateway()**: Format amount for gateway API

7. **Add amount field properties**
   - **gross_amount**: Property returning amount + fees
   - **fee_percentage**: Property calculating total fee as percentage
   - **is_multi_currency**: Property checking if conversion occurred

8. **Configure decimal precision and constraints**
   - Ensure all amount fields use proper precision (15,2)
   - Add database constraints for positive amounts
   - Add check constraints for logical amount relationships

### Amount Field Specifications

| Field | Max Digits | Decimal Places | Required | Default | Purpose |
|-------|------------|----------------|----------|---------|---------|
| amount | 15 | 2 | Yes | - | Transaction amount |
| original_amount | 15 | 2 | No | amount | Pre-conversion amount |
| exchange_rate | 10 | 6 | No | 1.000000 | Currency conversion rate |
| gateway_fee | 10 | 2 | No | 0.00 | Gateway processing fee |
| platform_fee | 10 | 2 | No | 0.00 | Platform service fee |
| net_amount | 15 | 2 | No | Calculated | Final amount |

### Sri Lankan Currency Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Default Currency | LKR | Sri Lankan Rupee |
| Decimal Places | 2 | Standard currency precision |
| Max Transaction | 10,000,000.00 LKR | Reasonable upper limit |
| Min Transaction | 1.00 LKR | Minimum viable amount |

### Fee Calculation Logic

```python
def calculate_total_fees(self):
    """Calculate total fees from all fee components"""
    return (self.gateway_fee or 0) + (self.platform_fee or 0)

def calculate_net_amount(self):
    """Calculate net amount after all fees and taxes"""
    total_fees = self.calculate_total_fees()
    vat = self.vat_amount or 0
    return self.amount - total_fees - vat
```

### Currency Conversion Handling

| Scenario | Fields Used | Calculation |
|----------|-------------|-------------|
| LKR Only | amount, net_amount | No conversion |
| USD to LKR | original_amount, exchange_rate, amount | amount = original * rate |
| EUR to LKR | original_amount, exchange_rate, amount | amount = original * rate |

### Amount Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| Positive Amount | amount > 0 | "Amount must be positive" |
| Reasonable Limit | amount <= 10M LKR | "Amount exceeds maximum limit" |
| Fee Logic | total_fees <= amount * 0.25 | "Fees cannot exceed 25% of amount" |
| Net Calculation | net_amount = amount - fees | "Net amount calculation error" |

### Database Constraints

```sql
-- Positive amount constraint
ALTER TABLE payment_transactions 
ADD CONSTRAINT positive_amount CHECK (amount > 0);

-- Fee limit constraint  
ALTER TABLE payment_transactions
ADD CONSTRAINT reasonable_fees CHECK (total_fees <= amount * 0.25);
```

### Display Formatting Methods

| Method | Return Format | Example |
|--------|---------------|---------|
| get_display_amount() | "LKR 1,500.00" | Formatted with currency |
| format_for_gateway() | "150000" | Gateway API format |
| get_fee_percentage() | "2.5%" | Fee as percentage |

### Expected Outcome
- Complete amount field configuration for LKR transactions
- Multi-currency support with conversion tracking
- Comprehensive fee breakdown and calculation
- Proper validation and formatting methods

### Verification Checklist
- [ ] Primary amount fields configured with proper precision
- [ ] Currency conversion fields added
- [ ] Fee breakdown fields implemented
- [ ] Tax and regulatory fields included
- [ ] Amount validation methods created
- [ ] Currency handling methods implemented
- [ ] Amount properties and calculations added
- [ ] Database constraints configured for data integrity

---

## Summary

This document established the core payment system infrastructure for Sri Lankan payment gateway integration, including the Django payments app, comprehensive choice definitions for gateways and payment methods, and complete payment models with transaction tracking. The implementation provides multi-language support, LKR currency handling, and integration with the existing order system.

### Completed Tasks
1. ✓ Created payments Django app with proper structure
2. ✓ Created PaymentGateway choices for Sri Lankan payment providers
3. ✓ Created PaymentStatus choices covering complete payment lifecycle
4. ✓ Created PaymentMethodType choices for Sri Lankan payment methods
5. ✓ Created PaymentMethod model with multi-language support and configuration
6. ✓ Created PaymentMethod configuration system with JSON field storage
7. ✓ Created comprehensive validation system for PaymentMethod instances
8. ✓ Created PaymentTransaction model for tracking payment lifecycle
9. ✓ Configured transaction-order relationship with proper foreign key
10. ✓ Configured comprehensive amount fields with LKR support and fee calculation

### Next Steps
Proceed to [02_Tasks-11-18_Refund-Webhook-Migrations.md](02_Tasks-11-18_Refund-Webhook-Migrations.md) to create payment refund models, webhook handling system, database migrations, and complete the payment gateway architecture setup.