# Tasks 26-34: Payment Flow, Callback, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** B - KOKO Processor Implementation  
> **Document:** 02 of 02  
> **Tasks Covered:** 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-25_Processor-Builders.md](01_Tasks-17-25_Processor-Builders.md)
- **→ Next Group:** [Group-C_MintPay-Processor-Implementation](../Group-C_MintPay-Processor-Implementation/)

---

## Document Overview

This document completes the KOKO processor implementation by covering the payment flow, callback handling, and verification systems. It includes the final data builders for phone formatting, items, and shipping, then implements the core payment methods including initiate_payment, checkout redirect, callback handling, status mapping, error management, and comprehensive verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 26 | Create Phone Formatter | Low | 20 min |
| 27 | Create Item List Builder | Medium | 30 min |
| 28 | Create Shipping Data | Low | 25 min |
| 29 | Create initiate_payment | High | 60 min |
| 30 | Create Checkout Redirect | Medium | 35 min |
| 31 | Create Callback Handler | Medium | 45 min |
| 32 | Create Status Mapping | Low | 20 min |
| 33 | Create Error Handling | Medium | 40 min |
| 34 | Verify KOKO Processor | Low | 30 min |

---

## Task 26: Create Phone Formatter

### Overview
Create a utility to format Sri Lankan phone numbers to the +94 international format required by KOKO API. This formatter must handle various input formats including local (0XX) and international (+94) numbers, ensuring consistent output format for all phone communications.

### Dependencies
- Task 25 (NIC Formatter) must be complete
- Regular expression library available

### Instructions

1. **Add PhoneFormatter class**
   - Add to existing `builders.py` file
   - Create class for phone number formatting
   - Handle Sri Lankan phone number patterns

2. **Implement formatting methods**
   - format_phone() for standard formatting
   - validate_phone() for format validation
   - normalize_phone() for cleanup
   - get_carrier_info() for network identification

3. **Handle input formats**
   - Local format: 0771234567
   - International: +94771234567
   - International: 94771234567
   - With spaces/dashes: 077 123 4567

4. **Apply formatting rules**
   - Remove all non-numeric except +
   - Convert 0XX to 94XX format
   - Ensure output is 94XXXXXXXXX
   - Validate number length (9-10 digits after 94)

5. **Add carrier validation**
   - Mobile: 70, 71, 72, 74, 75, 76, 77, 78
   - Landline: 11, 21, 23, 24, 25, 26, 27, 31, 32, 33, 34, 35, 36, 37, 38, 41, 45, 47, 51, 52, 54, 55, 57, 63, 65, 66, 67, 81, 91
   - Toll-free: 1900, 1911, 1973, 1975, 1976, 1982

### Phone Format Conversion

| Input Format | Output Format | Notes |
|--------------|---------------|-------|
| 0771234567 | 94771234567 | Remove 0, add 94 |
| +94771234567 | 94771234567 | Remove + |
| 94771234567 | 94771234567 | Already correct |
| 077 123 4567 | 94771234567 | Remove spaces |
| 077-123-4567 | 94771234567 | Remove dashes |

### Carrier Codes

| Code Range | Carrier Type | Example |
|------------|--------------|---------|
| 70-78 | Mobile | 077XXXXXXX |
| 11, 21-27 | Fixed Line | 011XXXXXXX |
| 31-38 | Fixed Line | 031XXXXXXX |
| 41, 45, 47 | Fixed Line | 041XXXXXXX |

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Length | 9-10 digits after 94 | InvalidPhoneLength |
| Prefix | Valid carrier code | InvalidCarrierCode |
| Format | Numeric only (after +) | InvalidPhoneFormat |
| Country | Must be Sri Lanka | UnsupportedCountry |

### Expected Outcome
- Consistent +94 format phone numbers
- Validation of Sri Lankan phone patterns
- Support for all major carriers
- Proper error handling

### Verification Checklist
- [ ] PhoneFormatter class added
- [ ] format_phone() method implemented
- [ ] Carrier validation included
- [ ] Input format handling complete

---

## Task 27: Create Item List Builder

### Overview
Create a builder to format order line items for KOKO API requests. This builder transforms Django order items into the structured format required by KOKO, including product details, quantities, prices, and SKUs.

### Dependencies
- Task 26 (Phone Formatter) must be complete
- OrderItem models available

### Instructions

1. **Add ItemListBuilder class**
   - Add to existing `builders.py` file
   - Create class for item data transformation
   - Handle order items to API format conversion

2. **Implement core methods**
   - build_items_list() for main transformation
   - format_item_data() for individual items
   - validate_items() for data validation
   - calculate_item_totals() for amount verification

3. **Handle item properties**
   - Product name and description
   - SKU and product code
   - Quantity and unit price
   - Line total and discounts
   - Product categories and tags

4. **Format for KOKO API**
   - Transform field names to KOKO requirements
   - Handle optional product fields
   - Format monetary amounts
   - Include product metadata

5. **Implement validation**
   - Non-empty item list required
   - Valid quantities (positive integers)
   - Valid prices (positive amounts)
   - SKU format validation

### Item Data Structure

| Django Field | KOKO Field | Type | Required |
|--------------|------------|------|----------|
| product.name | item_name | String | Yes |
| product.sku | item_sku | String | Yes |
| quantity | quantity | Integer | Yes |
| unit_price | unit_price | String | Yes |
| total_price | line_total | String | Yes |

### Item Properties

| Field | Source | Validation |
|-------|--------|------------|
| item_name | Product.name | Not empty |
| item_sku | Product.sku | Valid format |
| quantity | OrderItem.quantity | > 0 |
| unit_price | OrderItem.unit_price | > 0 |
| line_total | quantity × unit_price | Match calculation |

### Optional Fields

| Field | Source | Default |
|-------|--------|---------|
| description | Product.description | item_name |
| category | Product.category.name | "General" |
| weight | Product.weight | null |
| dimensions | Product.dimensions | null |

### Expected Outcome
- Complete item list formatting for KOKO
- Proper field mapping and validation
- Line total calculations verified
- API-ready item structure

### Verification Checklist
- [ ] ItemListBuilder class added
- [ ] build_items_list() method implemented
- [ ] Item validation included
- [ ] Total calculations verified

---

## Task 28: Create Shipping Data

### Overview
Create a builder to format shipping and delivery information for KOKO API requests. This includes delivery addresses, shipping methods, and any special delivery instructions required for BNPL orders.

### Dependencies
- Task 27 (Item List Builder) must be complete
- Address and shipping models available

### Instructions

1. **Add ShippingDataBuilder class**
   - Add to existing `builders.py` file
   - Create class for shipping data formatting
   - Handle address and delivery information

2. **Implement core methods**
   - build_shipping_data() for main transformation
   - format_delivery_address() for address formatting
   - validate_shipping_info() for data validation
   - calculate_shipping_cost() for cost handling

3. **Handle shipping properties**
   - Delivery address (full address)
   - City, postal code, and district
   - Shipping method and carrier
   - Delivery instructions
   - Estimated delivery date

4. **Format address data**
   - Complete street address
   - City and postal code
   - District and province
   - Country (always Sri Lanka)
   - Landmark or special instructions

5. **Add shipping validation**
   - Complete address required
   - Valid postal code format
   - Supported delivery areas
   - Shipping method availability

### Shipping Data Structure

| Django Field | KOKO Field | Type |
|--------------|------------|------|
| street_address | delivery_address | String |
| city | delivery_city | String |
| postal_code | postal_code | String |
| district | district | String |
| instructions | delivery_notes | String |

### Address Fields

| Field | Validation | Required |
|-------|------------|----------|
| delivery_address | Not empty | Yes |
| delivery_city | Valid city | Yes |
| postal_code | 5 digits | No |
| district | Valid district | No |

### Shipping Methods

| Method | Code | Supported |
|--------|------|-----------|
| Standard | STD | Yes |
| Express | EXP | Yes |
| Next Day | NXT | Limited areas |
| Same Day | SMD | Colombo only |

### Expected Outcome
- Complete shipping data for KOKO API
- Address validation and formatting
- Shipping method integration
- Delivery instruction handling

### Verification Checklist
- [ ] ShippingDataBuilder class added
- [ ] build_shipping_data() method implemented
- [ ] Address validation included
- [ ] Shipping method handling added

---

## Task 29: Create initiate_payment Method

### Overview
Implement the core initiate_payment method in the KOKOProcessor class. This method orchestrates the entire payment initiation process by combining all data builders, making the API call to KOKO, and returning the appropriate payment result with checkout URL.

### Dependencies
- Task 28 (Shipping Data) must be complete
- All data builders available
- API client ready

### Instructions

1. **Implement initiate_payment method**
   - Add method to KOKOProcessor class
   - Accept PaymentIntent parameter
   - Return PaymentResult with checkout URL
   - Handle all data building and API communication

2. **Build payment data**
   - Use OrderDataBuilder for order information
   - Use CustomerDataBuilder for customer details
   - Use ItemListBuilder for order items
   - Use ShippingDataBuilder for delivery info
   - Use AmountFormatter for money values

3. **Prepare KOKO request**
   - Combine all builder outputs
   - Add payment-specific metadata
   - Include callback URLs
   - Set payment method to BNPL

4. **Make API call**
   - Use KOKOAPIClient to send request
   - Handle authentication and signing
   - Parse response for checkout URL
   - Extract payment reference

5. **Process response**
   - Create PaymentResult object
   - Set status to PENDING
   - Include checkout redirect URL
   - Store transaction reference

### Payment Flow Diagram

```
PaymentIntent
      ↓
  Data Building
      ↓
  API Request
      ↓
  KOKO Response
      ↓
  PaymentResult
```

### Data Building Process

| Builder | Input | Output |
|---------|-------|--------|
| OrderDataBuilder | Order | order_data dict |
| CustomerDataBuilder | Customer | customer_data dict |
| ItemListBuilder | OrderItems | items_list array |
| ShippingDataBuilder | Address | shipping_data dict |
| AmountFormatter | Decimal | formatted amounts |

### KOKO API Request

| Field | Source | Required |
|-------|--------|----------|
| merchant_id | Settings | Yes |
| order_data | OrderDataBuilder | Yes |
| customer_data | CustomerDataBuilder | Yes |
| items | ItemListBuilder | Yes |
| shipping | ShippingDataBuilder | Yes |
| callback_url | Settings | Yes |

### Response Handling

| KOKO Response | Action |
|---------------|--------|
| Success | Return checkout URL |
| Validation Error | Return error details |
| Network Error | Retry or return error |
| Authentication Error | Return auth failure |

### Expected Outcome
- Complete payment initiation flow
- Proper data building integration
- KOKO API integration working
- Checkout URL generation

### Verification Checklist
- [ ] initiate_payment method implemented
- [ ] Data builders integrated
- [ ] API call handling added
- [ ] Response processing complete

---

## Task 30: Create Checkout Redirect

### Overview
Implement the checkout redirect mechanism that directs customers to KOKO's payment page. This handles the redirect URL generation, parameter passing, and ensures proper callback URL configuration for payment status updates.

### Dependencies
- Task 29 (initiate_payment) must be complete
- KOKO checkout URL structure understood

### Instructions

1. **Enhance initiate_payment response**
   - Parse checkout URL from KOKO response
   - Validate URL format and parameters
   - Add callback and return URLs
   - Handle redirect method (GET/POST)

2. **Build redirect response**
   - Create PaymentResult with redirect data
   - Set status to REQUIRES_ACTION
   - Include checkout URL in redirect_url field
   - Add any required parameters

3. **Configure callback URLs**
   - Set success callback URL
   - Set failure callback URL
   - Set cancel callback URL
   - Include webhook URL for status updates

4. **Add URL validation**
   - Verify KOKO domain
   - Check HTTPS requirement
   - Validate URL parameters
   - Handle malformed responses

5. **Implement redirect handling**
   - Support browser redirects
   - Handle mobile app integration
   - Add timeout handling
   - Include user experience guidance

### Redirect URL Structure

```
https://checkout.koko.lk/pay?
  order_id=ORDER123&
  merchant_id=MERCHANT&
  amount=10000.00&
  callback_url=https://shop.example.com/callback&
  return_url=https://shop.example.com/return
```

### Callback URL Configuration

| URL Type | Purpose | Method |
|----------|---------|--------|
| callback_url | Webhook notifications | POST |
| success_url | User success redirect | GET |
| failure_url | User failure redirect | GET |
| cancel_url | User cancel redirect | GET |

### PaymentResult Structure

| Field | Value | Purpose |
|-------|-------|---------|
| status | REQUIRES_ACTION | Needs user action |
| redirect_url | KOKO checkout URL | Redirect target |
| payment_method | koko_bnpl | Payment type |
| transaction_id | KOKO reference | Track payment |

### Expected Outcome
- Working checkout redirect flow
- Proper URL configuration
- Callback URL setup complete
- User redirect experience ready

### Verification Checklist
- [ ] Checkout URL parsing implemented
- [ ] Redirect response created
- [ ] Callback URLs configured
- [ ] URL validation added

---

## Task 31: Create Callback Handler

### Overview
Implement the webhook callback handler that processes payment status notifications from KOKO. This handler must verify signatures, parse status updates, and update the internal payment records accordingly.

### Dependencies
- Task 30 (Checkout Redirect) must be complete
- Webhook endpoint routing configured

### Instructions

1. **Implement handle_callback method**
   - Add method to KOKOProcessor class
   - Accept webhook request data
   - Verify request signature
   - Parse payment status update

2. **Add signature verification**
   - Extract signature from headers
   - Recreate signature using webhook secret
   - Compare signatures securely
   - Reject invalid signatures

3. **Parse callback data**
   - Extract payment reference
   - Get payment status from KOKO
   - Parse amount and currency
   - Get customer and order info

4. **Update payment record**
   - Find payment by reference
   - Update status based on KOKO status
   - Record callback timestamp
   - Log status change

5. **Handle callback response**
   - Return success response (HTTP 200)
   - Include acknowledgment data
   - Handle processing errors
   - Log callback for debugging

### Callback Data Structure

```json
{
  "order_id": "ORDER123",
  "payment_reference": "KOKO456",
  "status": "APPROVED",
  "amount": "10000.00",
  "currency": "LKR",
  "customer_id": "CUST789",
  "timestamp": "2024-01-31T10:30:00Z"
}
```

### Signature Verification

| Header | Value | Purpose |
|--------|-------|---------|
| X-KOKO-Signature | HMAC signature | Request integrity |
| X-KOKO-Timestamp | Unix timestamp | Replay protection |

### Status Processing

| KOKO Status | Action |
|-------------|--------|
| APPROVED | Mark payment successful |
| REJECTED | Mark payment failed |
| PENDING | Keep status pending |
| CANCELLED | Mark payment cancelled |
| EXPIRED | Mark payment expired |

### Response Format

```json
{
  "status": "success",
  "message": "Callback processed",
  "order_id": "ORDER123",
  "acknowledged_at": "2024-01-31T10:30:05Z"
}
```

### Expected Outcome
- Working webhook callback handler
- Signature verification implemented
- Payment status updates working
- Proper error handling

### Verification Checklist
- [ ] handle_callback method implemented
- [ ] Signature verification added
- [ ] Status parsing complete
- [ ] Payment updates working

---

## Task 32: Create Status Mapping

### Overview
Implement the status mapping system that translates KOKO payment statuses to internal payment system statuses. This ensures consistent status representation across the entire application.

### Dependencies
- Task 31 (Callback Handler) must be complete
- PaymentStatus enum available

### Instructions

1. **Define status mapping dictionary**
   - Create mapping from KOKO to internal statuses
   - Handle all possible KOKO statuses
   - Include edge cases and unknowns
   - Document status meanings

2. **Implement map_status method**
   - Add method to KOKOProcessor class
   - Accept KOKO status string
   - Return internal PaymentStatus enum
   - Handle unknown statuses gracefully

3. **Add reverse mapping**
   - Create internal to KOKO mapping
   - Support status queries to KOKO
   - Handle status synchronization
   - Enable bi-directional mapping

4. **Handle special cases**
   - Partial payments (not supported in BNPL)
   - Refunded payments
   - Disputed payments
   - Expired authorizations

5. **Add logging and monitoring**
   - Log status changes
   - Track unknown statuses
   - Monitor status distribution
   - Alert on critical status changes

### Status Mapping Table

| KOKO Status | Internal Status | Description |
|-------------|----------------|-------------|
| APPROVED | SUCCESS | Payment completed |
| REJECTED | FAILED | Payment declined |
| PENDING | PENDING | Awaiting approval |
| CANCELLED | CANCELLED | User cancelled |
| EXPIRED | EXPIRED | Payment expired |
| PROCESSING | PROCESSING | Being processed |

### Special Status Handling

| Status | Action | Notes |
|--------|--------|-------|
| UNKNOWN | PENDING | Log for investigation |
| null | PENDING | Default fallback |
| ERROR | FAILED | Technical failure |

### Reverse Mapping

| Internal Status | KOKO Status | Use Case |
|----------------|-------------|----------|
| SUCCESS | APPROVED | Status queries |
| FAILED | REJECTED | Status sync |
| PENDING | PENDING | Status checks |

### Expected Outcome
- Complete status mapping system
- Consistent status representation
- Unknown status handling
- Bidirectional mapping support

### Verification Checklist
- [ ] Status mapping dictionary created
- [ ] map_status method implemented
- [ ] Reverse mapping added
- [ ] Unknown status handling included

---

## Task 33: Create Error Handling

### Overview
Implement comprehensive error handling throughout the KOKO processor. This includes network errors, API errors, validation errors, and business logic errors with proper logging, retry mechanisms, and user-friendly error messages.

### Dependencies
- Task 32 (Status Mapping) must be complete
- Logging system configured

### Instructions

1. **Define error types**
   - Create custom exception classes
   - Inherit from base payment exceptions
   - Include error codes and messages
   - Support error categorization

2. **Implement network error handling**
   - Handle connection timeouts
   - Manage API rate limiting
   - Process HTTP status codes
   - Add retry logic with backoff

3. **Add validation error handling**
   - Customer data validation errors
   - Order amount validation errors
   - NIC and phone format errors
   - Address validation errors

4. **Handle API response errors**
   - KOKO API error responses
   - Authentication failures
   - Merchant configuration errors
   - Business rule violations

5. **Implement error recovery**
   - Retry transient errors
   - Fallback mechanisms
   - Error reporting and alerting
   - Graceful degradation

### Custom Exception Classes

```python
class KOKOProcessorError(PaymentProcessorError):
    """Base KOKO processor error"""

class KOKOAPIError(KOKOProcessorError):
    """KOKO API communication error"""

class KOKOValidationError(KOKOProcessorError):
    """Data validation error"""

class KOKOAuthenticationError(KOKOProcessorError):
    """Authentication failure"""
```

### Error Categories

| Category | Examples | Handling |
|----------|----------|----------|
| Network | Timeout, connection refused | Retry with backoff |
| Authentication | Invalid API key | Return immediately |
| Validation | Invalid NIC, phone | Return with details |
| Business | Amount limits | Return with explanation |

### Retry Strategy

| Error Type | Max Retries | Backoff |
|------------|-------------|---------|
| Network timeout | 3 | Exponential |
| Rate limit | 3 | Linear |
| Server error | 2 | Fixed |
| Client error | 0 | No retry |

### Error Response Format

```json
{
  "error": {
    "code": "KOKO_VALIDATION_ERROR",
    "message": "Invalid customer NIC format",
    "details": {
      "field": "customer.nic",
      "value": "invalid_nic",
      "expected": "Old: 9 digits + V/X, New: 12 digits"
    }
  }
}
```

### Expected Outcome
- Comprehensive error handling system
- Proper error categorization
- Retry mechanisms implemented
- User-friendly error messages

### Verification Checklist
- [ ] Custom exception classes created
- [ ] Network error handling implemented
- [ ] Validation error handling added
- [ ] Retry mechanisms configured

---

## Task 34: Verify KOKO Processor

### Overview
Perform comprehensive verification of the complete KOKO processor implementation. This includes unit testing, integration testing, error scenario testing, and end-to-end payment flow validation to ensure the processor works correctly in all scenarios.

### Dependencies
- Task 33 (Error Handling) must be complete
- All KOKO processor components implemented

### Instructions

1. **Create verification test suite**
   - Unit tests for each component
   - Integration tests for complete flow
   - Error scenario tests
   - Performance and load tests

2. **Test data builders**
   - AmountFormatter with various inputs
   - OrderDataBuilder with complex orders
   - CustomerDataBuilder with Sri Lankan data
   - NICFormatter with both old/new formats
   - PhoneFormatter with various formats
   - ItemListBuilder with multiple items
   - ShippingDataBuilder with addresses

3. **Test payment flow**
   - Complete initiate_payment flow
   - Checkout redirect functionality
   - Callback handling and verification
   - Status mapping accuracy
   - Error handling scenarios

4. **Test API integration**
   - Authentication with valid/invalid keys
   - Request signing and verification
   - Response parsing and error handling
   - Network failure scenarios

5. **Perform end-to-end testing**
   - Full payment journey
   - Webhook callback processing
   - Status update propagation
   - Error recovery testing

### Test Categories

| Category | Focus | Test Count |
|----------|-------|------------|
| Unit | Individual methods | 25+ tests |
| Integration | Component interaction | 15+ tests |
| Error | Exception handling | 20+ tests |
| End-to-End | Complete flow | 5+ tests |

### Test Data

| Component | Test Cases |
|-----------|------------|
| NICFormatter | Old format, new format, invalid |
| PhoneFormatter | Local, international, invalid |
| AmountFormatter | Min/max amounts, decimals |
| OrderDataBuilder | Simple/complex orders |

### Payment Flow Tests

| Scenario | Expected Result |
|----------|----------------|
| Valid payment | Checkout URL returned |
| Invalid customer | Validation error |
| Network failure | Retry then error |
| API rejection | Failed status |

### Verification Checklist

| Component | Status | Notes |
|-----------|--------|-------|
| KOKOProcessor | ✓ | Core class verified |
| Factory Registration | ✓ | Processor available |
| API Client | ✓ | Communication working |
| Authentication | ✓ | Credentials validated |
| Data Builders | ✓ | All formatters working |
| Payment Flow | ✓ | End-to-end tested |
| Error Handling | ✓ | Errors properly handled |

### Performance Metrics

| Metric | Target | Measured |
|--------|--------|----------|
| Payment initiation | < 3 seconds | TBD |
| Callback processing | < 1 second | TBD |
| Error response | < 500ms | TBD |

### Expected Outcome
- Fully verified KOKO processor
- All tests passing
- Performance within targets
- Error scenarios handled
- Ready for production deployment

### Verification Checklist
- [ ] Test suite created and running
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Error scenarios tested
- [ ] End-to-end flow verified
- [ ] Performance metrics met
- [ ] Documentation complete
- [ ] KOKO processor ready for use