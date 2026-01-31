# Tasks 35-42: MintPay Processor & Data Builders

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** C - MintPay Processor Implementation  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-50_Payment-Abstraction-Verify.md](02_Tasks-43-50_Payment-Abstraction-Verify.md)

---

## Document Overview

This document covers the creation of the MintPayProcessor class, processor registration, MintPay API client implementation, and data builder components. It establishes the foundational processor architecture for MintPay BNPL integration with proper Sri Lankan localization support.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create MintPayProcessor Class | High | 60 min |
| 36 | Create Processor Registration | Low | 15 min |
| 37 | Create MintPay API Client | Medium | 45 min |
| 38 | Create MintPay Authentication | Medium | 30 min |
| 39 | Create MintPay Request Signing | Medium | 45 min |
| 40 | Create MintPay Amount Formatter | Low | 20 min |
| 41 | Create MintPay Order Builder | Medium | 35 min |
| 42 | Create MintPay Customer Builder | Medium | 40 min |

---

## Task 35: Create MintPayProcessor Class

### Overview
Create the main MintPayProcessor class that extends the PaymentProcessor abstract base class. This processor handles MintPay BNPL (Buy Now, Pay Later) transactions with proper Sri Lankan localization, including LKR currency support, NIC validation, and +94 phone number formatting.

### Dependencies
- Core payment processor infrastructure (Task 34 from Group B)
- PaymentProcessor abstract base class exists
- Payment gateway enums defined

### Instructions

1. **Create processor directory structure**
   - Navigate to `backend/apps/payments/processors/`
   - Create new directory named `mintpay`
   - Create `__init__.py` file in mintpay directory

2. **Create processor.py file**
   - Create `processor.py` in the mintpay directory
   - This will contain the main MintPayProcessor class

3. **Import required dependencies**
   - Import PaymentProcessor base class
   - Import PaymentGateway enum
   - Import PaymentIntent, PaymentResult, PaymentStatus
   - Import Sri Lankan validation utilities
   - Import logging and typing modules

4. **Define MintPayProcessor class**
   - Class extends PaymentProcessor abstract base class
   - Set gateway_type = PaymentGateway.MINTPAY
   - Set provider_name = "MintPay"
   - Set supported_currencies = ["LKR"]
   - Set is_bnpl = True

5. **Initialize processor components**
   - Accept MintPay API credentials in constructor
   - Initialize MintPay API client (Task 37)
   - Initialize amount formatter (Task 40)
   - Initialize order builder (Task 41)
   - Initialize customer builder (Task 42)
   - Set up logging for processor operations

6. **Implement required abstract methods**
   - Stub implementation of initiate_payment() (completed in Task 44)
   - Stub implementation of verify_payment() (completed in Task 46)
   - Stub implementation of get_payment_status() (completed in Task 47)
   - Stub implementation of handle_webhook() (completed in Task 46)

7. **Add Sri Lankan specific configurations**
   - Set default currency to LKR
   - Configure Sri Lankan phone number format (+94)
   - Set NIC validation requirements
   - Configure minimum and maximum transaction amounts

8. **Add processor validation methods**
   - validate_amount(): Ensure amount is in valid LKR range
   - validate_customer_nic(): Validate Sri Lankan NIC format
   - validate_phone_number(): Ensure +94 format
   - validate_order_data(): Validate required order fields

### Class Structure

| Component | Description |
|-----------|-------------|
| `__init__()` | Initialize with API credentials and components |
| `gateway_type` | PaymentGateway.MINTPAY |
| `provider_name` | "MintPay" |
| `supported_currencies` | ["LKR"] |
| `is_bnpl` | True |
| `initiate_payment()` | Abstract method stub |
| `verify_payment()` | Abstract method stub |
| `get_payment_status()` | Abstract method stub |
| `handle_webhook()` | Abstract method stub |

### Configuration Properties

| Property | Value | Description |
|----------|-------|-------------|
| `gateway_type` | PaymentGateway.MINTPAY | Gateway identifier |
| `provider_name` | "MintPay" | Display name |
| `supported_currencies` | ["LKR"] | Sri Lankan Rupee only |
| `is_bnpl` | True | BNPL provider flag |
| `min_amount` | 500.00 | Minimum LKR amount |
| `max_amount` | 500000.00 | Maximum LKR amount |
| `api_timeout` | 30 | Request timeout in seconds |
| `max_retries` | 3 | Maximum retry attempts |

### Expected Outcome
- MintPayProcessor class created and properly structured
- All abstract methods stubbed for future implementation
- Sri Lankan localization properties configured
- Processor ready for registration and API client integration

### Verification Checklist
- [ ] `backend/apps/payments/processors/mintpay/` directory exists
- [ ] `processor.py` file contains MintPayProcessor class
- [ ] Class extends PaymentProcessor properly
- [ ] Gateway type set to MINTPAY
- [ ] Sri Lankan configurations in place
- [ ] All abstract methods stubbed

---

## Task 36: Create Processor Registration

### Overview
Register the MintPayProcessor with the ProcessorFactory to enable automatic processor discovery and instantiation. This allows the payment system to dynamically load and use the MintPay processor based on configuration settings.

### Dependencies
- Task 35: Create MintPayProcessor Class
- ProcessorFactory class exists in payment system

### Instructions

1. **Locate processor factory**
   - Navigate to `backend/apps/payments/`
   - Find the `factory.py` or similar processor factory file

2. **Import MintPayProcessor**
   - Add import statement for MintPayProcessor
   - Import from `processors.mintpay.processor`

3. **Register with factory**
   - Use ProcessorFactory.register() method
   - Register with key PaymentGateway.MINTPAY
   - Associate with MintPayProcessor class

4. **Update processor initialization**
   - Ensure factory can instantiate MintPayProcessor
   - Pass required API credentials during instantiation
   - Handle configuration loading for MintPay settings

5. **Update processor discovery**
   - Add MintPay to list of available processors
   - Include in processor enumeration methods
   - Update processor selection logic

6. **Add configuration mapping**
   - Map MINTPAY gateway to MintPay settings
   - Load API key and secret from environment/config
   - Configure default settings for MintPay processor

### Registration Structure

| Component | Value |
|-----------|-------|
| Factory Key | PaymentGateway.MINTPAY |
| Processor Class | MintPayProcessor |
| Config Section | "mintpay" |
| Environment Vars | MINTPAY_API_KEY, MINTPAY_SECRET |

### Configuration Requirements

| Setting | Environment Variable | Description |
|---------|---------------------|-------------|
| API Key | MINTPAY_API_KEY | MintPay API authentication key |
| API Secret | MINTPAY_SECRET | MintPay signing secret |
| Base URL | MINTPAY_BASE_URL | MintPay API base URL |
| Webhook URL | MINTPAY_WEBHOOK_URL | Callback URL for notifications |
| Environment | MINTPAY_ENVIRONMENT | sandbox/production |

### Expected Outcome
- MintPayProcessor registered with ProcessorFactory
- Factory can instantiate processor automatically
- Configuration properly loaded from environment
- Processor discoverable by payment system

### Verification Checklist
- [ ] ProcessorFactory.register() call added
- [ ] MintPayProcessor import statement added
- [ ] Registration uses correct gateway key
- [ ] Configuration mapping established
- [ ] Environment variables documented

---

## Task 37: Create MintPay API Client

### Overview
Create the MintPay API client that handles HTTP communication with MintPay's REST API. The client manages request/response formatting, error handling, timeout configuration, and retry logic with proper authentication headers.

### Dependencies
- Task 35: Create MintPayProcessor Class
- HTTP client library (httpx or requests)

### Instructions

1. **Create client.py file**
   - Create `client.py` in `backend/apps/payments/processors/mintpay/`
   - This will contain the MintPayAPIClient class

2. **Import required dependencies**
   - Import HTTP client library (httpx recommended)
   - Import JSON, typing, logging modules
   - Import custom exceptions for payment errors
   - Import authentication utilities

3. **Define MintPayAPIClient class**
   - Initialize with base_url, api_key, api_secret
   - Configure HTTP client with timeout settings
   - Set up retry logic with exponential backoff

4. **Implement core HTTP methods**
   - `_make_request()`: Core request method with error handling
   - `get()`: HTTP GET requests
   - `post()`: HTTP POST requests with JSON payload
   - `put()`: HTTP PUT requests for updates

5. **Add request/response handling**
   - Format JSON payloads properly
   - Parse JSON responses with validation
   - Handle HTTP status codes appropriately
   - Extract error messages from responses

6. **Implement authentication handling**
   - Add Bearer token to Authorization header
   - Implement request signing (Task 38)
   - Handle authentication errors and refresh

7. **Add error handling and retries**
   - Network timeout handling with retries
   - HTTP error status code handling
   - Rate limiting detection and backoff
   - Connection error recovery

8. **Create MintPay specific methods**
   - `create_payment()`: Initiate payment request
   - `get_payment()`: Get payment status
   - `verify_callback()`: Verify webhook signature
   - `get_customer_eligibility()`: Check BNPL eligibility

### HTTP Client Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Timeout | 30 seconds | Request timeout |
| Retries | 3 attempts | Maximum retry count |
| Backoff | Exponential | Retry delay strategy |
| User-Agent | "LankaCommerce/1.0" | Client identification |

### API Endpoints Structure

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/create` | Create new payment |
| GET | `/payments/{id}` | Get payment details |
| POST | `/payments/{id}/verify` | Verify payment status |
| POST | `/eligibility/check` | Check customer eligibility |

### Error Handling Categories

| Error Type | Status Codes | Action |
|------------|--------------|--------|
| Network | Connection errors | Retry with backoff |
| Authentication | 401, 403 | Re-authenticate |
| Rate Limit | 429 | Wait and retry |
| Client Error | 400-499 | Return error details |
| Server Error | 500-599 | Retry if retryable |

### Expected Outcome
- MintPayAPIClient class created with full HTTP handling
- Authentication headers properly configured
- Error handling and retry logic implemented
- API methods ready for MintPay communication

### Verification Checklist
- [ ] `client.py` file created in mintpay directory
- [ ] MintPayAPIClient class properly structured
- [ ] HTTP methods implemented with error handling
- [ ] Timeout and retry configuration in place
- [ ] Authentication header handling ready

---

## Task 38: Create MintPay Authentication

### Overview
Implement Bearer token authentication for MintPay API requests. Unlike KOKO's signature-based authentication, MintPay uses Bearer tokens in the Authorization header for API access, with additional request signing for sensitive operations.

### Dependencies
- Task 37: Create MintPay API Client
- MintPay API credentials available

### Instructions

1. **Extend MintPayAPIClient with authentication**
   - Add authentication methods to existing client class
   - Store API key and secret securely
   - Implement token management if needed

2. **Implement Bearer token authentication**
   - Add Authorization header to all requests
   - Format: "Authorization: Bearer {api_key}"
   - Ensure API key is loaded from environment variables

3. **Add authentication validation**
   - Validate API key format before use
   - Check for authentication errors in responses
   - Handle 401 Unauthorized responses appropriately

4. **Create authentication helper methods**
   - `_add_auth_header()`: Add Bearer token to request headers
   - `_validate_credentials()`: Validate API credentials
   - `_handle_auth_error()`: Handle authentication failures

5. **Configure authentication for all requests**
   - Automatically add auth header to every API call
   - Ensure authentication is applied consistently
   - Log authentication events for debugging

6. **Add credential management**
   - Load credentials from environment variables
   - Validate credential format during initialization
   - Provide clear error messages for missing credentials

7. **Handle authentication errors gracefully**
   - Detect 401/403 responses as auth failures
   - Provide meaningful error messages
   - Log authentication issues for troubleshooting

### Authentication Configuration

| Component | Value | Description |
|-----------|-------|-------------|
| Header Name | Authorization | HTTP header for token |
| Token Format | Bearer {api_key} | Authorization format |
| Environment Variable | MINTPAY_API_KEY | API key storage |
| Error Handling | 401, 403 | Auth failure codes |

### Header Structure

| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {api_key} | Yes |
| Content-Type | application/json | Yes |
| Accept | application/json | Yes |
| User-Agent | LankaCommerce/1.0 | Recommended |

### Authentication Flow

```
1. Load API key from environment
2. Validate key format and presence  
3. Add "Authorization: Bearer {key}" header
4. Send request with auth header
5. Handle auth errors if they occur
6. Retry with fresh token if needed
```

### Expected Outcome
- Bearer token authentication implemented
- Authorization header added to all requests
- Authentication error handling in place
- Credential validation and management ready

### Verification Checklist
- [ ] Bearer token format implemented correctly
- [ ] Authorization header added to all requests
- [ ] API key loaded from environment variables
- [ ] Authentication error handling implemented
- [ ] Credential validation methods created

---

## Task 39: Create MintPay Request Signing

### Overview
Implement HMAC-based request signing for MintPay API calls to ensure request integrity and authenticity. This adds an additional security layer beyond Bearer token authentication for sensitive operations like payment creation and verification.

### Dependencies
- Task 38: Create MintPay Authentication
- HMAC and hashing libraries available

### Instructions

1. **Add signing dependencies**
   - Import hmac, hashlib, and time modules
   - Import base64 for encoding if needed
   - Import json for payload serialization

2. **Implement signature generation**
   - Create `_generate_signature()` method in MintPayAPIClient
   - Use HMAC-SHA256 with API secret as key
   - Include timestamp to prevent replay attacks

3. **Define signing payload structure**
   - HTTP method (GET, POST, PUT)
   - Request URL path
   - Request timestamp (Unix timestamp)
   - Request body (for POST/PUT requests)

4. **Create signature headers**
   - Add timestamp header: "X-MintPay-Timestamp"
   - Add signature header: "X-MintPay-Signature" 
   - Format signature as hex or base64 string

5. **Implement signing for different request types**
   - GET requests: Sign method + path + timestamp
   - POST requests: Sign method + path + timestamp + body
   - PUT requests: Sign method + path + timestamp + body

6. **Add signature verification for webhooks**
   - `verify_webhook_signature()`: Verify incoming webhook signatures
   - Compare calculated signature with provided signature
   - Check timestamp to prevent replay attacks

7. **Configure signing for sensitive operations**
   - Payment creation requests
   - Payment verification requests
   - Customer eligibility checks
   - All webhook validations

8. **Add signature validation**
   - Validate signature format before sending
   - Check timestamp is within acceptable range
   - Handle signature verification failures

### Signing Algorithm

| Component | Method | Description |
|-----------|--------|-------------|
| Hash Algorithm | HMAC-SHA256 | Cryptographic signing |
| Key | API Secret | Signing key from config |
| Timestamp | Unix timestamp | Prevents replay attacks |
| Encoding | Hexadecimal | Signature format |

### Signature Payload Structure

| Request Type | Payload Components |
|-------------|-------------------|
| GET | method + url_path + timestamp |
| POST | method + url_path + timestamp + json_body |
| PUT | method + url_path + timestamp + json_body |
| DELETE | method + url_path + timestamp |

### Required Headers for Signed Requests

| Header | Format | Example |
|--------|--------|---------|
| X-MintPay-Timestamp | Unix timestamp | 1674567890 |
| X-MintPay-Signature | HMAC-SHA256 hex | a1b2c3d4e5f6... |
| Authorization | Bearer token | Bearer mp_12345... |

### Webhook Signature Verification

```
1. Extract signature from webhook headers
2. Extract timestamp from webhook headers
3. Validate timestamp is recent (within 5 minutes)
4. Calculate expected signature from payload
5. Compare signatures using secure comparison
6. Accept webhook if signatures match
```

### Expected Outcome
- Request signing implemented with HMAC-SHA256
- Signature headers added to sensitive requests
- Webhook signature verification functional
- Replay attack protection through timestamps

### Verification Checklist
- [ ] HMAC-SHA256 signature generation implemented
- [ ] Timestamp headers added to signed requests
- [ ] Signature headers formatted correctly
- [ ] Webhook signature verification working
- [ ] Replay attack protection in place

---

## Task 40: Create MintPay Amount Formatter

### Overview
Create amount formatting utilities specifically for MintPay API requirements. Handle conversion between internal decimal amounts and MintPay's expected format, with proper LKR currency handling and validation for Sri Lankan transaction limits.

### Dependencies
- Task 35: Create MintPayProcessor Class
- Decimal arithmetic libraries

### Instructions

1. **Create builders.py file**
   - Create `builders.py` in `backend/apps/payments/processors/mintpay/`
   - This will contain all data formatting utilities

2. **Import required dependencies**
   - Import Decimal for precise arithmetic
   - Import typing modules for type hints
   - Import validation utilities

3. **Create MintPayAmountFormatter class**
   - Handle amount conversion and validation
   - Format amounts for MintPay API requirements
   - Validate amounts against Sri Lankan limits

4. **Implement amount formatting methods**
   - `format_amount()`: Convert Decimal to MintPay format
   - `parse_amount()`: Convert MintPay format to Decimal
   - `validate_amount()`: Check amount limits and format
   - `format_currency()`: Add LKR currency formatting

5. **Configure MintPay amount requirements**
   - Use 2 decimal places for LKR amounts
   - Example: 10000.00 for LKR 10,000
   - Minimum amount: LKR 500.00
   - Maximum amount: LKR 500,000.00

6. **Add Sri Lankan specific validations**
   - Validate minimum transaction amount (LKR 500)
   - Validate maximum transaction amount (LKR 500,000)
   - Ensure amount is positive and non-zero
   - Check decimal precision (max 2 places)

7. **Implement currency formatting**
   - Format amounts with proper decimal places
   - Add currency symbol for display (Rs.)
   - Handle thousand separators for readability
   - Convert between display and API formats

8. **Add error handling for invalid amounts**
   - Handle negative or zero amounts
   - Handle amounts exceeding precision limits
   - Handle amounts outside allowed ranges
   - Provide clear error messages

### Amount Format Specifications

| Property | Value | Description |
|----------|-------|-------------|
| Decimal Places | 2 | Always 2 decimal places |
| Minimum Amount | 500.00 | LKR 500 minimum |
| Maximum Amount | 500000.00 | LKR 500,000 maximum |
| Currency Code | LKR | Sri Lankan Rupee |
| Format Example | 10000.00 | Ten thousand rupees |

### Amount Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Positive | amount > 0 | "Amount must be positive" |
| Minimum | amount >= 500.00 | "Minimum amount is LKR 500" |
| Maximum | amount <= 500000.00 | "Maximum amount is LKR 500,000" |
| Precision | 2 decimal places | "Amount precision exceeded" |

### Format Conversion Methods

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `format_amount()` | Decimal(10000.5) | "10000.50" | API format |
| `parse_amount()` | "10000.50" | Decimal("10000.50") | Parse from API |
| `format_currency()` | Decimal(10000) | "Rs. 10,000.00" | Display format |
| `validate_amount()` | any | bool + errors | Validation check |

### Expected Outcome
- Amount formatter class with LKR handling
- Proper decimal precision and validation
- Sri Lankan transaction limits enforced
- Clear error messages for invalid amounts

### Verification Checklist
- [ ] `builders.py` file created in mintpay directory
- [ ] MintPayAmountFormatter class implemented
- [ ] LKR currency formatting working correctly
- [ ] Amount validation rules implemented
- [ ] Min/max amount limits configured

---

## Task 41: Create MintPay Order Builder

### Overview
Create the order data builder that formats order information for MintPay API requests. This includes order reference generation, total amount calculation, and order metadata formatting according to MintPay's API specification.

### Dependencies
- Task 40: Create MintPay Amount Formatter
- Order model structure defined

### Instructions

1. **Add MintPayOrderBuilder to builders.py**
   - Extend the existing builders.py file
   - Create class for order data formatting
   - Integrate with MintPayAmountFormatter

2. **Import order-related dependencies**
   - Import Order, OrderItem models
   - Import amount formatter from Task 40
   - Import UUID and datetime utilities

3. **Implement order data extraction**
   - `build_order_data()`: Main order builder method
   - Extract order ID as reference
   - Calculate total amount including taxes
   - Format order metadata

4. **Create order reference generation**
   - Use Order.id as primary reference
   - Add prefix for identification (e.g., "MP-")
   - Ensure reference uniqueness
   - Format: "MP-{order_id}" or similar

5. **Calculate order totals**
   - Sum all order item totals
   - Include tax amounts if applicable
   - Include shipping costs if present
   - Use amount formatter for proper formatting

6. **Add order metadata formatting**
   - Order creation timestamp
   - Customer reference if available
   - Order description or summary
   - Special instructions or notes

7. **Implement order validation**
   - Validate order has items
   - Ensure total amount is positive
   - Check required fields are present
   - Validate order is in correct status

8. **Handle order item aggregation**
   - Collect all order items
   - Calculate individual item totals
   - Group similar items if needed
   - Prepare for items builder (Task 42)

### Order Data Structure

| Field | Source | Format | Description |
|-------|--------|--------|-------------|
| reference | Order.id | "MP-{id}" | Unique order reference |
| amount | Order.total | "10000.00" | Total amount formatted |
| currency | Fixed | "LKR" | Sri Lankan Rupee |
| description | Order.summary | string | Order description |
| created_at | Order.created_at | ISO timestamp | Order creation time |

### Order Reference Format

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | "MP-" | MintPay identifier |
| Order ID | UUID or integer | 12345 or uuid4 |
| Full Reference | "MP-{order_id}" | "MP-12345" |

### Order Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Has Items | len(items) > 0 | "Order must have items" |
| Positive Total | total > 0 | "Order total must be positive" |
| Valid Status | status in allowed | "Invalid order status" |
| Required Fields | all fields present | "Missing required field" |

### Builder Method Structure

```
build_order_data(order: Order) -> dict:
    1. Validate order object
    2. Generate unique reference
    3. Calculate total amount
    4. Format currency and amounts
    5. Add metadata and timestamps
    6. Return formatted order dict
```

### Expected Outcome
- Order builder class with data extraction
- Unique order reference generation
- Total amount calculation and formatting
- Order validation and error handling

### Verification Checklist
- [ ] MintPayOrderBuilder class added to builders.py
- [ ] Order reference generation implemented
- [ ] Total amount calculation working
- [ ] Order validation rules in place
- [ ] Integration with amount formatter complete

---

## Task 42: Create MintPay Customer Builder

### Overview
Create the customer data builder that formats customer information for MintPay API requests with Sri Lankan localization. This includes NIC validation, +94 phone number formatting, and proper customer data structure for BNPL eligibility checks.

### Dependencies
- Task 41: Create MintPay Order Builder
- Customer model structure defined
- Sri Lankan validation utilities

### Instructions

1. **Add MintPayCustomerBuilder to builders.py**
   - Extend the existing builders.py file
   - Create class for customer data formatting
   - Include Sri Lankan specific validations

2. **Import customer-related dependencies**
   - Import Customer, User models
   - Import Sri Lankan validation utilities
   - Import phone number formatting tools
   - Import NIC validation functions

3. **Implement customer data extraction**
   - `build_customer_data()`: Main customer builder method
   - Extract customer personal information
   - Format data for MintPay API requirements
   - Apply Sri Lankan localization

4. **Format customer personal information**
   - Full name from Customer.full_name or User.first_name + last_name
   - Email address with validation
   - Sri Lankan NIC with format validation
   - Date of birth if available

5. **Implement Sri Lankan phone formatting**
   - Convert to +94 international format
   - Handle local numbers starting with 0
   - Remove spaces, hyphens, parentheses
   - Validate mobile number format (07X, 071, etc.)

6. **Add NIC validation and formatting**
   - Validate old format NIC (9 digits + V/X)
   - Validate new format NIC (12 digits)
   - Extract date of birth from NIC if needed
   - Ensure NIC belongs to valid person

7. **Create customer address formatting**
   - Format billing address if available
   - Include city, postal code
   - Add province/district information
   - Use Sri Lankan address format

8. **Add customer eligibility data**
   - Income information if available
   - Employment status
   - Credit history indicators
   - BNPL eligibility flags

9. **Implement customer validation**
   - Validate required fields are present
   - Check email format is valid
   - Ensure phone number is Sri Lankan mobile
   - Validate NIC format and checksum

### Customer Data Structure

| Field | Source | Format | Description |
|-------|--------|--------|-------------|
| name | Customer.full_name | string | Customer full name |
| email | Customer.email | email | Valid email address |
| phone | Customer.phone | +94XXXXXXXXX | Sri Lankan mobile format |
| nic | Customer.nic | XXXXXXXXXV or XXXXXXXXXXXX | NIC validation |

### Phone Number Formatting

| Input Format | Output Format | Example |
|-------------|---------------|---------|
| 0771234567 | +94771234567 | +94771234567 |
| 071-123-4567 | +94711234567 | +94711234567 |
| +94 77 123 4567 | +94771234567 | +94771234567 |
| 94771234567 | +94771234567 | +94771234567 |

### NIC Validation Rules

| Format | Pattern | Example | Description |
|--------|---------|---------|-------------|
| Old NIC | 9 digits + V/X | 871234567V | Pre-2016 format |
| New NIC | 12 digits | 200012345678 | Post-2016 format |
| Validation | Checksum + format | Valid pattern | Mathematical validation |

### Customer Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Name Required | len(name) > 0 | "Customer name required" |
| Valid Email | email format valid | "Invalid email format" |
| Valid Phone | +94 mobile format | "Invalid Sri Lankan mobile" |
| Valid NIC | NIC format + checksum | "Invalid Sri Lankan NIC" |

### Sri Lankan Mobile Prefixes

| Operator | Prefixes | Example |
|----------|----------|---------|
| Dialog | 071, 076, 077 | +94771234567 |
| Mobitel | 070, 071, 072 | +94701234567 |
| Hutch | 078 | +94781234567 |
| Airtel | 075 | +94751234567 |

### Expected Outcome
- Customer builder with Sri Lankan localization
- Phone number formatting to +94 format
- NIC validation for both old and new formats
- Customer data validation and error handling

### Verification Checklist
- [ ] MintPayCustomerBuilder class added to builders.py
- [ ] Sri Lankan phone formatting implemented
- [ ] NIC validation for both formats working
- [ ] Customer data extraction complete
- [ ] Validation rules implemented with clear errors