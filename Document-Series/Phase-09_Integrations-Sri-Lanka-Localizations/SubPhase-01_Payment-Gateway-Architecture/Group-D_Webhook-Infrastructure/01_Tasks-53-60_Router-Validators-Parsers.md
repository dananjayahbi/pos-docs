# Tasks 53-60: Router, Validators, and Parsers

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** D - Webhook Infrastructure  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-61-68_Processor-Retry-Verify.md](02_Tasks-61-68_Processor-Retry-Verify.md)

---

## Document Overview

This document establishes the webhook infrastructure foundation by creating the webhook router view, URL patterns, authentication system, signature validators, and gateway-specific parsers. These components enable secure, reliable webhook processing for PayHere, WebXPay, and other payment gateways integrated within the Sri Lankan ERP ecosystem.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create Webhook Router View | Medium | 45 min |
| 54 | Create Webhook URL Patterns | Low | 15 min |
| 55 | Create Webhook Authentication | High | 60 min |
| 56 | Create Signature Validators | Medium | 40 min |
| 57 | Create PayHere Signature | Medium | 35 min |
| 58 | Create WebXPay Signature | Medium | 35 min |
| 59 | Create Webhook Parser | Medium | 40 min |
| 60 | Create PayHere Parser | Medium | 30 min |

---

## Task 53: Create Webhook Router View

### Overview
Create the main webhook router view that receives webhook requests from payment gateways and routes them to appropriate processors based on gateway type. This view serves as the central entry point for all webhook processing, handling initial validation and dispatching to gateway-specific processing chains.

### Dependencies
- Task 52 (Payment Gateway Factory from Group C) must be completed
- Django REST Framework is configured
- Celery task infrastructure is set up
- Webhook infrastructure directories exist

### Instructions

1. **Create webhook router module**
   - Navigate to `apps/payments/webhooks/`
   - Create `router.py` file
   - This will contain the main webhook router view class

2. **Import required dependencies**
   - Import Django REST Framework view classes
   - Import CSRF exempt decorator for webhook endpoints
   - Import logging utilities for webhook tracking
   - Import HttpResponse classes for various response codes
   - Import JSON parsing utilities

3. **Define WebhookRouterView class**
   - Create class inheriting from Django REST Framework's APIView
   - Apply CSRF exempt decorator to allow external webhook posts
   - Configure for POST method only (webhooks are always POST)
   - Set authentication classes to empty (webhooks have custom auth)
   - Set permission classes to allow any (custom validation applied)

4. **Implement gateway type detection**
   - Extract gateway parameter from URL path
   - Map gateway parameter to internal gateway identifiers
   - Support PayHere, WebXPay, KOKO, and extensible for future gateways
   - Validate gateway parameter exists and is supported
   - Return 404 error for unsupported gateway types

5. **Implement request validation**
   - Validate HTTP method is POST
   - Check Content-Type header (application/json or form-encoded)
   - Validate request body is not empty
   - Log incoming webhook request details
   - Capture client IP address for security logging

6. **Create webhook routing logic**
   - Route to appropriate gateway-specific processor
   - Pass raw request data to processor
   - Include gateway type in routing decision
   - Handle routing failures gracefully
   - Return appropriate HTTP status codes

7. **Implement error response handling**
   - Return 400 for malformed requests
   - Return 401 for authentication failures
   - Return 404 for unknown gateways
   - Return 500 for processing errors
   - Include minimal error details in response (security consideration)

8. **Add comprehensive logging**
   - Log webhook receipt with timestamp
   - Log gateway type and request metadata
   - Log processing start and completion
   - Log errors and exceptions with context
   - Sanitize sensitive data in logs

9. **Configure asynchronous processing**
   - Queue webhook processing as Celery task
   - Return HTTP 200 immediately for valid requests
   - Process webhook data asynchronously in background
   - Handle task queue failures gracefully

### Expected Outcome
A robust webhook router view that securely receives webhooks from multiple payment gateways, performs initial validation, and routes requests to appropriate processors while maintaining comprehensive logging and error handling.

---

## Task 54: Create Webhook URL Patterns

### Overview
Create Django URL patterns for webhook endpoints, providing clean, RESTful URLs for each payment gateway. These patterns enable payment gateways to send webhook notifications to gateway-specific endpoints while maintaining consistent URL structure.

### Dependencies
- Task 53 (Webhook Router View) must be completed
- Django URL configuration is set up
- Payment gateway types are defined

### Instructions

1. **Create webhook URL configuration file**
   - Navigate to `apps/payments/api/`
   - Create `webhook_urls.py` file
   - This will contain all webhook-related URL patterns

2. **Import required URL utilities**
   - Import Django path function for URL patterns
   - Import webhook router view from previous task
   - Import include function for URL namespace organization

3. **Define gateway-specific URL patterns**
   - Create URL pattern for PayHere: `/api/webhooks/payhere/`
   - Create URL pattern for WebXPay: `/api/webhooks/webxpay/`
   - Create URL pattern for KOKO: `/api/webhooks/koko/`
   - Use consistent naming convention for all gateway URLs

4. **Configure URL parameters**
   - Pass gateway type as URL parameter to router view
   - Use path parameter `<str:gateway>` in URL pattern
   - Ensure gateway parameter matches expected values
   - Configure case-insensitive matching if needed

5. **Create URL namespace**
   - Define `app_name = 'webhook_api'` for URL namespacing
   - Group all webhook URLs under common namespace
   - Enable reverse URL resolution for webhook endpoints

6. **Add URL pattern validation**
   - Validate gateway parameter values
   - Restrict to known gateway types only
   - Provide clear error messages for invalid URLs

7. **Configure URL routing**
   - Route all patterns to WebhookRouterView
   - Pass gateway type as keyword argument
   - Ensure proper URL resolution for testing

8. **Document URL endpoints**
   - Add docstring documenting available endpoints
   - Include example URLs for each gateway
   - Document expected request formats

9. **Add development and testing URLs**
   - Create test webhook endpoints for development
   - Add debug URLs if in DEBUG mode
   - Include webhook testing utilities

### Expected Outcome
Clean, organized URL patterns that route gateway-specific webhook requests to the appropriate handler, with proper namespacing and parameter passing.

---

## Task 55: Create Webhook Authentication

### Overview
Create a comprehensive webhook authentication system that validates incoming webhooks using signature verification, IP address validation (where applicable), and other security measures. This ensures only legitimate payment gateway webhooks are processed.

### Dependencies
- Task 53 (Webhook Router View) must be completed
- Django security utilities are available
- Gateway credentials are configured

### Instructions

1. **Create webhook authentication module**
   - Navigate to `apps/payments/webhooks/`
   - Create `authentication.py` file
   - This will contain authentication classes and utilities

2. **Define base webhook authenticator**
   - Create BaseWebhookAuthenticator abstract class
   - Define authentication interface methods
   - Include common authentication utilities
   - Provide logging and error handling framework

3. **Implement signature verification base**
   - Create signature verification base methods
   - Handle different signature algorithms (MD5, HMAC-SHA256)
   - Provide utility methods for signature comparison
   - Include timing-safe comparison to prevent timing attacks

4. **Create IP address validation**
   - Implement IP whitelist checking where supported
   - Extract client IP from request headers
   - Handle proxy forwarded headers (X-Forwarded-For, etc.)
   - Support CIDR range validation for gateway IP ranges
   - Log IP validation results

5. **Implement gateway-specific authenticators**
   - Create PayHereWebhookAuthenticator class
   - Create WebXPayWebhookAuthenticator class
   - Create extensible pattern for future gateways
   - Each authenticator handles gateway-specific requirements

6. **Configure authentication workflow**
   - Define authentication step ordering
   - First: IP address validation (if supported)
   - Second: Signature validation
   - Third: Additional gateway-specific checks
   - Return authentication result with details

7. **Implement authentication result handling**
   - Create AuthenticationResult class
   - Include success/failure status
   - Provide detailed error messages
   - Include security event information for logging

8. **Add authentication middleware integration**
   - Create authentication middleware for webhook views
   - Apply authentication before request processing
   - Handle authentication failures gracefully
   - Return appropriate HTTP status codes

9. **Configure authentication settings**
   - Create settings for authentication configuration
   - Include gateway credentials and secrets
   - Support environment-specific settings
   - Provide secure credential storage patterns

10. **Implement security logging**
    - Log authentication attempts and results
    - Log security violations and suspicious activity
    - Sanitize sensitive data in security logs
    - Include timestamp and request metadata

11. **Create authentication testing utilities**
    - Provide utilities for testing authentication
    - Create mock authentication for development
    - Include authentication bypass for testing
    - Document testing procedures

### Expected Outcome
A robust, secure webhook authentication system that validates incoming webhooks using multiple security layers, providing comprehensive protection against unauthorized webhook requests.

---

## Task 56: Create Signature Validators

### Overview
Create signature validation utilities that verify webhook signatures using various cryptographic algorithms. These validators ensure webhook authenticity and prevent tampering by validating signatures provided by payment gateways.

### Dependencies
- Task 55 (Webhook Authentication) must be completed
- Cryptographic libraries are available
- Gateway signature documentation is accessible

### Instructions

1. **Create signature validator module**
   - Navigate to `apps/payments/webhooks/`
   - Create `validators.py` file
   - This will contain signature validation classes

2. **Import cryptographic utilities**
   - Import hashlib for MD5 and SHA algorithms
   - Import hmac for HMAC signature verification
   - Import base64 for signature encoding/decoding
   - Import secure comparison utilities

3. **Define base signature validator**
   - Create BaseSignatureValidator abstract class
   - Define signature validation interface
   - Include common validation utilities
   - Provide error handling and logging framework

4. **Implement MD5 signature validator**
   - Create MD5SignatureValidator class
   - Handle PayHere MD5 signature format
   - Implement field concatenation for signature generation
   - Support custom field ordering and separators

5. **Implement HMAC signature validator**
   - Create HMACSignatureValidator class
   - Support HMAC-SHA256 algorithm
   - Handle WebXPay HMAC signature format
   - Support full payload signing

6. **Create signature comparison utilities**
   - Implement timing-safe signature comparison
   - Prevent timing attacks on signature validation
   - Handle signature encoding differences
   - Support case-insensitive comparison where needed

7. **Implement signature extraction methods**
   - Extract signatures from request headers
   - Extract signatures from request body
   - Handle different signature formats and locations
   - Validate signature format before comparison

8. **Create signature generation utilities**
   - Generate expected signatures for comparison
   - Handle gateway-specific signature algorithms
   - Support different payload formats
   - Include field selection and ordering logic

9. **Add validation result handling**
   - Create SignatureValidationResult class
   - Include success/failure status
   - Provide detailed validation information
   - Include signature debugging information

10. **Implement validation configuration**
    - Create configurable signature validation settings
    - Support different algorithms per gateway
    - Include signature secret management
    - Provide validation rule customization

11. **Add comprehensive logging**
    - Log signature validation attempts
    - Log validation successes and failures
    - Sanitize sensitive signature data
    - Include validation timing and performance metrics

12. **Create validation testing utilities**
    - Provide signature generation for testing
    - Create mock signatures for development
    - Include validation test cases
    - Document testing procedures

### Expected Outcome
Flexible, secure signature validation system that supports multiple cryptographic algorithms and gateway-specific signature formats, providing robust webhook authenticity verification.

---

## Task 57: Create PayHere Signature

### Overview
Create PayHere-specific signature validation that handles MD5 signature verification using PayHere's signature algorithm. This validator ensures PayHere webhooks are authentic by validating the MD5 signature against expected values.

### Dependencies
- Task 56 (Signature Validators) must be completed
- PayHere API documentation is available
- PayHere merchant credentials are configured

### Instructions

1. **Create PayHere signature validator**
   - Navigate to `apps/payments/webhooks/validators.py`
   - Create PayHereSignatureValidator class
   - Extend MD5SignatureValidator base class
   - Implement PayHere-specific signature logic

2. **Configure PayHere signature fields**
   - Define required fields for signature generation
   - Include: merchant_id, order_id, payhere_amount, payhere_currency
   - Add: status_code, md5sig (for validation)
   - Support additional fields as per PayHere documentation

3. **Implement signature generation logic**
   - Concatenate signature fields in PayHere order
   - Use merchant secret from configuration
   - Generate MD5 hash of concatenated string
   - Convert hash to uppercase hexadecimal format

4. **Create signature extraction methods**
   - Extract md5sig field from PayHere webhook
   - Handle both POST body and form data formats
   - Validate md5sig field exists and is valid
   - Log signature extraction details

5. **Implement signature validation workflow**
   - Generate expected signature from webhook data
   - Compare with provided md5sig value
   - Use timing-safe comparison for security
   - Return validation result with details

6. **Add PayHere field validation**
   - Validate required fields are present
   - Check field format and data types
   - Validate merchant_id matches configuration
   - Ensure amount and currency are valid

7. **Configure PayHere settings**
   - Add PayHere merchant secret to settings
   - Support environment-specific configurations
   - Include signature validation settings
   - Provide secure credential management

8. **Implement error handling**
   - Handle missing signature fields gracefully
   - Provide clear error messages for validation failures
   - Log validation errors with context
   - Return appropriate error codes

9. **Add PayHere-specific logging**
   - Log PayHere signature validation attempts
   - Include PayHere order and payment details
   - Sanitize sensitive PayHere data
   - Track validation performance metrics

10. **Create PayHere testing utilities**
    - Generate test PayHere signatures
    - Create mock PayHere webhook data
    - Include PayHere validation test cases
    - Document PayHere testing procedures

11. **Support PayHere signature variations**
    - Handle different PayHere signature formats
    - Support legacy and current signature methods
    - Include fallback validation if needed
    - Document signature format changes

### Expected Outcome
Robust PayHere signature validation that accurately verifies webhook authenticity using PayHere's MD5 signature algorithm, ensuring secure payment processing for Sri Lankan businesses.

---

## Task 58: Create WebXPay Signature

### Overview
Create WebXPay-specific signature validation that handles HMAC-SHA256 signature verification using WebXPay's signature algorithm. This validator ensures WebXPay webhooks are authentic by validating the HMAC signature against the full request payload.

### Dependencies
- Task 56 (Signature Validators) must be completed
- WebXPay API documentation is available
- WebXPay API credentials are configured

### Instructions

1. **Create WebXPay signature validator**
   - Navigate to `apps/payments/webhooks/validators.py`
   - Create WebXPaySignatureValidator class
   - Extend HMACSignatureValidator base class
   - Implement WebXPay-specific signature logic

2. **Configure WebXPay signature method**
   - Use HMAC-SHA256 algorithm
   - Sign complete request payload (body)
   - Extract signature from X-Signature header
   - Support base64-encoded signature format

3. **Implement signature generation logic**
   - Get complete raw request body
   - Use WebXPay API secret from configuration
   - Generate HMAC-SHA256 signature
   - Encode signature as base64 string

4. **Create signature extraction methods**
   - Extract X-Signature header from request
   - Handle missing or malformed signature headers
   - Validate signature format and encoding
   - Log signature extraction details

5. **Implement payload handling**
   - Capture raw request body for signing
   - Handle different content types (JSON, form data)
   - Preserve original payload formatting
   - Avoid payload modifications that affect signature

6. **Create signature validation workflow**
   - Generate expected signature from request body
   - Compare with provided X-Signature value
   - Use timing-safe comparison for security
   - Return validation result with details

7. **Add WebXPay field validation**
   - Validate WebXPay webhook payload structure
   - Check required fields are present
   - Validate field formats and data types
   - Ensure API credentials match configuration

8. **Configure WebXPay settings**
   - Add WebXPay API secret to settings
   - Support environment-specific configurations
   - Include signature validation settings
   - Provide secure credential management

9. **Implement error handling**
   - Handle missing signature headers gracefully
   - Provide clear error messages for validation failures
   - Log validation errors with context
   - Return appropriate HTTP status codes

10. **Add WebXPay-specific logging**
    - Log WebXPay signature validation attempts
    - Include WebXPay transaction details
    - Sanitize sensitive WebXPay data
    - Track validation performance metrics

11. **Create WebXPay testing utilities**
    - Generate test WebXPay signatures
    - Create mock WebXPay webhook data
    - Include WebXPay validation test cases
    - Document WebXPay testing procedures

12. **Support signature debugging**
    - Include signature debugging utilities
    - Log signature generation steps
    - Compare byte-by-byte for troubleshooting
    - Document common signature issues

### Expected Outcome
Secure WebXPay signature validation that accurately verifies webhook authenticity using HMAC-SHA256 signatures, ensuring reliable payment processing for WebXPay integration.

---

## Task 59: Create Webhook Parser

### Overview
Create a base webhook parser that transforms raw webhook payloads into standardized, internal data structures. This parser provides a consistent interface for processing different gateway webhook formats while maintaining gateway-specific parsing capabilities.

### Dependencies
- Task 53 (Webhook Router View) must be completed
- Payment gateway data models are defined
- Webhook data structures are established

### Instructions

1. **Create webhook parser module**
   - Navigate to `apps/payments/webhooks/`
   - Create `parsers.py` file
   - This will contain parser classes and utilities

2. **Define base webhook parser**
   - Create BaseWebhookParser abstract class
   - Define parsing interface methods
   - Include common parsing utilities
   - Provide error handling and validation framework

3. **Create webhook event data structure**
   - Define WebhookEvent dataclass or model
   - Include standardized fields: transaction_id, order_id, status
   - Add: amount, currency, gateway_reference, timestamp
   - Include: raw_data, signature, metadata fields

4. **Implement base parsing methods**
   - Create parse_webhook method interface
   - Define payload validation methods
   - Include field extraction utilities
   - Provide data transformation helpers

5. **Add payload format handling**
   - Support JSON payload parsing
   - Handle form-encoded payload parsing
   - Support XML payload parsing (if needed)
   - Include content-type detection and routing

6. **Create field mapping utilities**
   - Map gateway-specific fields to standard fields
   - Handle field name differences between gateways
   - Support field type conversion and validation
   - Include default value handling

7. **Implement data validation**
   - Validate required fields are present
   - Check field formats and data types
   - Validate business logic constraints
   - Return validation errors with details

8. **Add timestamp handling**
   - Parse gateway-specific timestamp formats
   - Convert to standardized datetime objects
   - Handle timezone conversions
   - Support different date/time formats

9. **Create status mapping**
   - Map gateway-specific status codes to internal status
   - Handle success, pending, failed, and cancelled statuses
   - Support gateway-specific status variations
   - Include status validation and normalization

10. **Implement amount and currency handling**
    - Parse amount values and formats
    - Handle currency code extraction and validation
    - Support different currency formats
    - Include amount precision handling

11. **Add error handling and logging**
    - Handle parsing errors gracefully
    - Log parsing attempts and results
    - Sanitize sensitive data in logs
    - Return detailed error information

12. **Create parsing result structure**
    - Define ParsingResult class
    - Include success/failure status
    - Provide parsed webhook event data
    - Include error details and context

### Expected Outcome
Flexible webhook parsing system that converts raw gateway webhooks into standardized internal data structures, supporting multiple payload formats and providing comprehensive validation.

---

## Task 60: Create PayHere Parser

### Overview
Create PayHere-specific webhook parser that transforms PayHere webhook payloads into standardized internal data structures. This parser handles PayHere's specific field names, data formats, and business logic while integrating with the base parsing framework.

### Dependencies
- Task 59 (Webhook Parser) must be completed
- PayHere webhook documentation is available
- PayHere data formats are understood

### Instructions

1. **Create PayHere parser class**
   - Navigate to `apps/payments/webhooks/parsers.py`
   - Create PayHereWebhookParser class
   - Extend BaseWebhookParser base class
   - Implement PayHere-specific parsing logic

2. **Configure PayHere field mappings**
   - Map PayHere order_id to standard order_id
   - Map PayHere payment_id to standard transaction_id
   - Map PayHere payhere_amount to standard amount
   - Map PayHere payhere_currency to standard currency

3. **Implement PayHere status mapping**
   - Map PayHere status_code to internal status values
   - Handle PayHere success codes (2, 1)
   - Handle PayHere pending codes (0, -1)
   - Handle PayHere failed codes (-2, -3, etc.)

4. **Add PayHere-specific field handling**
   - Extract PayHere merchant_id and validate
   - Parse PayHere customer details (first_name, last_name, email)
   - Handle PayHere custom_1, custom_2 fields
   - Extract PayHere card details if provided

5. **Implement PayHere amount parsing**
   - Parse PayHere amount format (decimal string)
   - Handle PayHere currency codes (LKR, USD, etc.)
   - Validate amount precision and format
   - Support PayHere fee calculations

6. **Create PayHere timestamp handling**
   - Parse PayHere timestamp format
   - Convert to standardized datetime object
   - Handle PayHere timezone (Sri Lanka Standard Time)
   - Support PayHere date format variations

7. **Add PayHere validation logic**
   - Validate PayHere required fields are present
   - Check PayHere field formats and constraints
   - Validate PayHere merchant_id matches configuration
   - Ensure PayHere amount and currency are valid

8. **Implement PayHere error handling**
   - Handle PayHere-specific parsing errors
   - Provide PayHere error code interpretations
   - Log PayHere parsing issues with context
   - Return PayHere-specific error details

9. **Create PayHere data sanitization**
   - Sanitize PayHere sensitive data for logging
   - Mask PayHere card details if present
   - Handle PayHere customer information privacy
   - Include PayHere audit trail information

10. **Add PayHere testing utilities**
    - Create mock PayHere webhook payloads
    - Generate test PayHere data structures
    - Include PayHere parsing test cases
    - Document PayHere testing procedures

11. **Support PayHere webhook variations**
    - Handle different PayHere webhook types
    - Support PayHere subscription webhooks
    - Include PayHere refund webhook parsing
    - Handle PayHere dispute notifications

12. **Create PayHere integration helpers**
    - Extract PayHere integration metadata
    - Support PayHere custom field mapping
    - Handle PayHere business logic requirements
    - Include PayHere compliance features

### Expected Outcome
Comprehensive PayHere webhook parser that accurately transforms PayHere webhook data into standardized internal formats, supporting all PayHere webhook types and business requirements for Sri Lankan payment processing.

---

## Quality Assurance Checklist

### Code Quality
- [ ] All webhook components follow Django and DRF best practices
- [ ] Proper error handling implemented throughout
- [ ] Comprehensive logging added to all components
- [ ] Security best practices followed for webhook handling
- [ ] Code is documented with clear docstrings

### Security Validation
- [ ] Signature validation is timing-safe
- [ ] Sensitive data is properly sanitized in logs
- [ ] CSRF protection correctly bypassed for webhooks
- [ ] IP validation implemented where supported
- [ ] Authentication failures are properly handled

### Integration Testing
- [ ] Webhook routing works for all supported gateways
- [ ] URL patterns resolve correctly
- [ ] Authentication succeeds with valid signatures
- [ ] Signature validators work with gateway test data
- [ ] Parsers correctly transform webhook payloads

### Performance Considerations
- [ ] Webhook processing is asynchronous where possible
- [ ] Signature validation is efficient
- [ ] Parsing operations are optimized
- [ ] Logging does not impact performance
- [ ] Memory usage is minimized for large payloads

### Documentation
- [ ] All components are properly documented
- [ ] Gateway-specific requirements are clearly noted
- [ ] Testing procedures are documented
- [ ] Configuration requirements are specified
- [ ] Security considerations are highlighted

---

## Next Steps

Upon completion of these tasks, proceed to [02_Tasks-61-68_Processor-Retry-Verify.md](02_Tasks-61-68_Processor-Retry-Verify.md) to implement webhook processing, retry logic, and verification components that complete the webhook infrastructure.

The webhook router, validators, and parsers established in this document provide the foundation for secure, reliable webhook processing. The next document will build upon this foundation to create the asynchronous processing pipeline and comprehensive webhook management system.