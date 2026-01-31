# Tasks 43-50: MintPay Payment Flow & Abstraction

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** C - MintPay Processor Implementation  
> **Document:** 02 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_Processor-Builders.md](01_Tasks-35-42_Processor-Builders.md)

---

## Document Overview

This document covers the implementation of MintPay payment flow, including cart items builder, payment initiation, redirect handling, webhook callbacks, status mapping, error handling, provider abstraction for unified BNPL interface, and final verification of the MintPay processor implementation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Create MintPay Cart Items Builder | Medium | 35 min |
| 44 | Create MintPay Payment Initiation | High | 60 min |
| 45 | Create MintPay Redirect Handler | Medium | 25 min |
| 46 | Create MintPay Callback Handler | Medium | 50 min |
| 47 | Create MintPay Status Mapping | Low | 20 min |
| 48 | Create MintPay Error Handling | Medium | 40 min |
| 49 | Create Provider Abstraction | High | 75 min |
| 50 | Verify MintPay Processor | Low | 30 min |

---

## Task 43: Create MintPay Cart Items Builder

### Overview
Create the cart items builder that formats order line items for MintPay API requests. This includes item details, quantities, amounts, and proper formatting according to MintPay's API specification for BNPL transaction itemization.

### Dependencies
- Task 42: Create MintPay Customer Builder
- OrderItem model structure defined
- Product model with pricing information

### Instructions

1. **Add MintPayItemsBuilder to builders.py**
   - Extend the existing builders.py file
   - Create class for cart items formatting
   - Integrate with existing amount formatter

2. **Import item-related dependencies**
   - Import OrderItem, Product models
   - Import amount formatter from Task 40
   - Import typing modules for lists

3. **Implement items data extraction**
   - `build_items_data()`: Main items builder method
   - Extract all order items from order
   - Format each item for MintPay API
   - Calculate item totals including taxes

4. **Format individual item details**
   - Item name from Product.name or OrderItem.description
   - Item quantity from OrderItem.quantity
   - Unit price from OrderItem.unit_price
   - Total amount (quantity × unit_price)

5. **Add product information**
   - Product SKU or code if available
   - Product category for BNPL analysis
   - Product description or summary
   - Product image URL if available

6. **Calculate item totals correctly**
   - Base amount: quantity × unit_price
   - Add applicable taxes per item
   - Add any item-level discounts
   - Format amounts using MintPay formatter

7. **Handle different item types**
   - Physical products with shipping
   - Digital products/services
   - Gift cards or vouchers
   - Subscription items if applicable

8. **Validate items data**
   - Ensure all items have positive quantities
   - Validate item amounts are positive
   - Check required item fields are present
   - Ensure items total matches order total

9. **Format items for MintPay API**
   - Convert to MintPay expected structure
   - Include all required item fields
   - Apply proper data types and formats
   - Aggregate similar items if needed

### Item Data Structure

| Field | Source | Format | Description |
|-------|--------|--------|-------------|
| name | Product.name | string | Item display name |
| quantity | OrderItem.quantity | integer | Number of items |
| unit_price | OrderItem.unit_price | "1000.00" | Price per unit |
| total_amount | calculated | "2000.00" | Total for this item |
| sku | Product.sku | string | Product identifier |

### Items Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Positive Quantity | quantity > 0 | "Item quantity must be positive" |
| Positive Price | unit_price > 0 | "Item price must be positive" |
| Required Name | len(name) > 0 | "Item name is required" |
| Total Match | sum(items) == order.total | "Items total mismatch" |

### Item Categories for BNPL

| Category | Description | BNPL Impact |
|----------|-------------|-------------|
| Electronics | Phones, laptops, etc. | High eligibility |
| Fashion | Clothing, accessories | Medium eligibility |
| Home & Garden | Furniture, appliances | High eligibility |
| Services | Digital services | Lower eligibility |

### Items Array Structure

```
items: [
    {
        name: "iPhone 14 Pro",
        quantity: 1,
        unit_price: "450000.00",
        total_amount: "450000.00",
        sku: "IPH14PRO256",
        category: "Electronics"
    },
    {
        name: "Phone Case",
        quantity: 2,
        unit_price: "2500.00", 
        total_amount: "5000.00",
        sku: "CASE-IPH14",
        category: "Accessories"
    }
]
```

### Expected Outcome
- Cart items builder with proper formatting
- Individual item calculation and validation
- Items array formatted for MintPay API
- Total amount validation against order

### Verification Checklist
- [ ] MintPayItemsBuilder class added to builders.py
- [ ] Individual item data extraction working
- [ ] Item totals calculated correctly
- [ ] Items validation rules implemented
- [ ] MintPay API format compliance verified

---

## Task 44: Create MintPay Payment Initiation

### Overview
Implement the main payment initiation method that creates a MintPay order and initiates the BNPL payment process. This method coordinates all builders, makes API calls, and returns appropriate payment results for the frontend redirect.

### Dependencies
- Task 43: Create MintPay Cart Items Builder
- All builder classes completed (Tasks 40-43)
- MintPay API client ready (Tasks 37-39)

### Instructions

1. **Implement initiate_payment() method**
   - Complete the stubbed method in MintPayProcessor
   - Accept PaymentIntent parameter
   - Return PaymentResult with redirect information

2. **Coordinate data building**
   - Use MintPayAmountFormatter for amount formatting
   - Use MintPayOrderBuilder for order data
   - Use MintPayCustomerBuilder for customer data
   - Use MintPayItemsBuilder for cart items

3. **Build complete payment request**
   - Combine all builder outputs
   - Create comprehensive MintPay payload
   - Include all required fields for API
   - Add metadata and tracking information

4. **Make MintPay API call**
   - Use MintPayAPIClient to create payment
   - Call POST /payments/create endpoint
   - Include authentication and signing headers
   - Handle API response and errors

5. **Process MintPay response**
   - Extract payment ID from response
   - Get redirect URL for customer
   - Store payment reference for tracking
   - Parse any additional response data

6. **Create PaymentResult response**
   - Set status to PaymentStatus.PENDING
   - Include redirect URL for frontend
   - Add payment reference/ID
   - Include any error information

7. **Handle payment validation**
   - Validate customer eligibility for BNPL
   - Check order amount limits
   - Verify all required data present
   - Ensure order is in correct state

8. **Add error handling**
   - Handle API communication errors
   - Manage validation failures
   - Process MintPay rejection reasons
   - Return appropriate error messages

9. **Store payment tracking data**
   - Save payment intent mapping
   - Store MintPay payment ID
   - Log payment initiation events
   - Update order status if needed

### Payment Initiation Flow

```
1. Receive PaymentIntent from frontend
2. Validate order and customer data
3. Build MintPay payment request:
   - Order data (reference, amount)
   - Customer data (name, email, phone, NIC)
   - Items data (cart contents)
4. Make API call to MintPay
5. Process response:
   - Success: Extract redirect URL
   - Failure: Extract error details
6. Return PaymentResult to frontend
```

### MintPay API Request Structure

| Section | Builder | Required Fields |
|---------|---------|-----------------|
| order | OrderBuilder | reference, amount, currency |
| customer | CustomerBuilder | name, email, phone, nic |
| items | ItemsBuilder | name, quantity, amount per item |
| metadata | Built-in | callback_url, return_url |

### PaymentResult Response Structure

| Field | Success Value | Failure Value |
|-------|---------------|---------------|
| status | PaymentStatus.PENDING | PaymentStatus.FAILED |
| redirect_url | MintPay checkout URL | null |
| payment_id | MintPay payment ID | null |
| error_message | null | Error description |

### API Error Handling

| MintPay Error | Status Code | Action |
|---------------|-------------|--------|
| Invalid customer | 400 | Return validation error |
| Insufficient eligibility | 422 | Return eligibility error |
| Network timeout | 5xx | Retry then fail |
| Authentication error | 401 | Log and return auth error |

### Expected Outcome
- Payment initiation method fully implemented
- All builders coordinated correctly
- API communication working
- Proper error handling and responses

### Verification Checklist
- [ ] initiate_payment() method implemented
- [ ] All builders integrated correctly
- [ ] MintPay API call working
- [ ] PaymentResult properly formatted
- [ ] Error handling comprehensive

---

## Task 45: Create MintPay Redirect Handler

### Overview
Implement redirect URL handling for MintPay checkout process. After payment initiation, customers are redirected to MintPay's checkout page, and this task handles the return URLs and success/failure redirects back to the webstore.

### Dependencies
- Task 44: Create MintPay Payment Initiation
- Frontend routing structure for payment results

### Instructions

1. **Configure redirect URLs in payment request**
   - Add success_url to payment initiation
   - Add failure_url for failed payments
   - Add cancel_url for cancelled payments
   - Use webstore domain with proper endpoints

2. **Implement redirect URL generation**
   - Create `_build_redirect_urls()` method
   - Generate URLs with payment reference
   - Include order ID for tracking
   - Add security tokens if needed

3. **Handle MintPay checkout redirect**
   - Extract redirect_url from MintPay response
   - Validate URL format and security
   - Include any additional parameters
   - Prepare frontend redirect response

4. **Configure success return handling**
   - Success URL: `/payments/success?payment_id={id}&order_id={order}`
   - Include payment reference for verification
   - Add success message parameters
   - Redirect to order confirmation page

5. **Configure failure return handling**
   - Failure URL: `/payments/failed?payment_id={id}&reason={reason}`
   - Include error reason from MintPay
   - Add failure message parameters
   - Redirect to payment retry page

6. **Configure cancel return handling**
   - Cancel URL: `/payments/cancelled?order_id={order}`
   - Allow customer to try different payment method
   - Preserve cart and order state
   - Redirect to checkout page

7. **Add URL security measures**
   - Include HMAC signatures in URLs
   - Add timestamp to prevent replay
   - Validate return URLs on webstore
   - Check order ownership

8. **Handle mobile app redirects**
   - Support deep links for mobile apps
   - Configure app-specific return URLs
   - Handle both web and mobile contexts
   - Provide fallback URLs

### Redirect URL Structure

| URL Type | Template | Example |
|----------|----------|---------|
| Success | `/payments/success?payment_id={id}&order_id={order}&sig={sig}` | `/payments/success?payment_id=mp_123&order_id=456&sig=abc123` |
| Failure | `/payments/failed?payment_id={id}&reason={reason}&sig={sig}` | `/payments/failed?payment_id=mp_123&reason=declined&sig=def456` |
| Cancel | `/payments/cancelled?order_id={order}&sig={sig}` | `/payments/cancelled?order_id=456&sig=ghi789` |

### MintPay Redirect Flow

```
1. Customer clicks "Pay with MintPay"
2. Backend initiates payment with MintPay
3. MintPay returns checkout URL
4. Frontend redirects customer to MintPay
5. Customer completes/cancels payment
6. MintPay redirects back to configured URL
7. Webstore processes return and shows result
```

### Return URL Validation

| Validation | Check | Action |
|------------|-------|--------|
| Signature | HMAC verification | Accept/reject request |
| Timestamp | Within time window | Accept/reject request |
| Order ownership | Customer owns order | Allow/deny access |
| Payment status | Valid state transition | Update/maintain status |

### Frontend Integration

| Component | Responsibility |
|-----------|----------------|
| Payment page | Handle redirect to MintPay |
| Success page | Show order confirmation |
| Failure page | Show error and retry options |
| Cancel page | Return to checkout |

### Expected Outcome
- Redirect URLs properly configured
- MintPay checkout flow working
- Return URL handling implemented
- Security measures in place

### Verification Checklist
- [ ] Redirect URLs configured in payment request
- [ ] URL generation method implemented
- [ ] Success/failure/cancel URLs working
- [ ] URL security measures implemented
- [ ] Frontend integration points defined

---

## Task 46: Create MintPay Callback Handler

### Overview
Implement webhook callback handling for MintPay payment notifications. This processes POST requests from MintPay when payment status changes, verifies signatures, updates payment status, and triggers appropriate order processing workflows.

### Dependencies
- Task 45: Create MintPay Redirect Handler
- Webhook signature verification from Task 39
- Order status management system

### Instructions

1. **Implement handle_webhook() method**
   - Complete the stubbed method in MintPayProcessor
   - Accept HTTP request with MintPay callback data
   - Verify webhook authenticity and process payload

2. **Create webhook endpoint routing**
   - Define endpoint: `/api/webhooks/mintpay/`
   - Accept POST requests only
   - Route to MintPayProcessor.handle_webhook()
   - Add CSRF exemption for external calls

3. **Implement signature verification**
   - Extract signature from headers
   - Use verification method from Task 39
   - Validate timestamp to prevent replay attacks
   - Reject invalid or missing signatures

4. **Process webhook payload**
   - Parse JSON payload from request body
   - Extract payment ID, status, and metadata
   - Validate required fields are present
   - Handle different event types

5. **Update payment and order status**
   - Map MintPay status to internal status
   - Update PaymentIntent status
   - Update Order status accordingly
   - Trigger order fulfillment workflows

6. **Handle different webhook events**
   - `payment.completed`: Payment successful
   - `payment.failed`: Payment declined/failed
   - `payment.cancelled`: Customer cancelled
   - `payment.refunded`: Payment refunded

7. **Add idempotency handling**
   - Track processed webhooks
   - Prevent duplicate processing
   - Handle retries from MintPay
   - Store webhook processing logs

8. **Implement error handling**
   - Handle malformed payloads
   - Manage network timeouts
   - Process partial data gracefully
   - Return appropriate HTTP status codes

9. **Add notification triggers**
   - Send customer email confirmations
   - Trigger admin notifications
   - Update inventory if successful
   - Process refunds if needed

### Webhook Endpoint Structure

| Component | Value | Description |
|-----------|-------|-------------|
| URL | `/api/webhooks/mintpay/` | Webhook endpoint |
| Method | POST | HTTP method |
| Content-Type | application/json | Request format |
| Authentication | Signature header | HMAC verification |

### Expected Webhook Payload

```json
{
    "event_type": "payment.completed",
    "payment_id": "mp_1234567890",
    "order_reference": "MP-12345",
    "status": "SUCCESS",
    "amount": "10000.00",
    "currency": "LKR",
    "timestamp": "2024-01-15T10:30:00Z",
    "customer": {
        "email": "customer@example.com"
    }
}
```

### Webhook Event Types

| Event Type | Description | Action |
|------------|-------------|--------|
| payment.completed | Payment successful | Mark order as paid |
| payment.failed | Payment failed | Mark order as failed |
| payment.cancelled | Customer cancelled | Mark order as cancelled |
| payment.refunded | Payment refunded | Process refund |

### Status Mapping (Task 47 integration)

| MintPay Status | Internal Status | Order Action |
|----------------|-----------------|--------------|
| SUCCESS | PaymentStatus.SUCCESS | Mark as paid |
| FAILED | PaymentStatus.FAILED | Mark as failed |
| CANCELLED | PaymentStatus.CANCELLED | Mark as cancelled |
| REFUNDED | PaymentStatus.REFUNDED | Process refund |

### Response Codes

| Scenario | HTTP Code | Description |
|----------|-----------|-------------|
| Success | 200 | Webhook processed |
| Invalid signature | 401 | Unauthorized |
| Malformed payload | 400 | Bad request |
| Processing error | 500 | Internal error |

### Expected Outcome
- Webhook handling method implemented
- Signature verification working
- Payment status updates functioning
- Order workflow triggers operational

### Verification Checklist
- [ ] handle_webhook() method implemented
- [ ] Webhook endpoint routing configured
- [ ] Signature verification working
- [ ] Payment status updates functional
- [ ] Order workflow integration complete

---

## Task 47: Create MintPay Status Mapping

### Overview
Implement status mapping between MintPay payment statuses and internal payment system statuses. This ensures consistent status handling across the platform and proper order workflow triggers based on payment state changes.

### Dependencies
- Task 46: Create MintPay Callback Handler
- PaymentStatus enum defined in payment system

### Instructions

1. **Create status mapping dictionary**
   - Define mapping in MintPayProcessor class
   - Map MintPay statuses to PaymentStatus enum
   - Handle all possible MintPay status values
   - Include error status mappings

2. **Implement status conversion method**
   - Create `_map_payment_status()` method
   - Accept MintPay status string
   - Return PaymentStatus enum value
   - Handle unknown statuses gracefully

3. **Define MintPay status values**
   - SUCCESS: Payment completed successfully
   - FAILED: Payment declined or failed
   - PENDING: Payment in progress
   - CANCELLED: Customer cancelled payment
   - REFUNDED: Payment refunded
   - EXPIRED: Payment session expired

4. **Map to internal PaymentStatus enum**
   - PaymentStatus.SUCCESS for completed payments
   - PaymentStatus.FAILED for declined/failed
   - PaymentStatus.PENDING for in-progress
   - PaymentStatus.CANCELLED for cancelled
   - PaymentStatus.REFUNDED for refunded
   - PaymentStatus.EXPIRED for expired

5. **Handle edge cases and unknowns**
   - Default to PaymentStatus.PENDING for unknown
   - Log warnings for unmapped statuses
   - Provide fallback mapping strategy
   - Handle case-insensitive status strings

6. **Add status validation**
   - Validate status transitions are valid
   - Prevent invalid status changes
   - Log status change events
   - Ensure idempotency of status updates

7. **Integrate with webhook handler**
   - Use mapping in handle_webhook() method
   - Apply mapped status to PaymentIntent
   - Trigger appropriate workflow actions
   - Update order status accordingly

8. **Add reverse mapping if needed**
   - Map internal status to MintPay format
   - Use for API requests to MintPay
   - Ensure bidirectional compatibility
   - Handle API query requirements

### Status Mapping Table

| MintPay Status | PaymentStatus Enum | Description |
|----------------|-------------------|-------------|
| SUCCESS | PaymentStatus.SUCCESS | Payment completed |
| FAILED | PaymentStatus.FAILED | Payment declined |
| PENDING | PaymentStatus.PENDING | Payment processing |
| CANCELLED | PaymentStatus.CANCELLED | Customer cancelled |
| REFUNDED | PaymentStatus.REFUNDED | Payment refunded |
| EXPIRED | PaymentStatus.EXPIRED | Session expired |
| UNKNOWN | PaymentStatus.PENDING | Default fallback |

### Status Transition Rules

| From Status | To Status | Valid | Action |
|-------------|-----------|-------|--------|
| PENDING | SUCCESS | ✓ | Complete order |
| PENDING | FAILED | ✓ | Cancel order |
| PENDING | CANCELLED | ✓ | Cancel order |
| SUCCESS | REFUNDED | ✓ | Process refund |
| FAILED | SUCCESS | ✗ | Not allowed |

### Mapping Method Structure

```python
def _map_payment_status(self, mintpay_status: str) -> PaymentStatus:
    """Map MintPay status to internal PaymentStatus enum"""
    status_mapping = {
        'SUCCESS': PaymentStatus.SUCCESS,
        'FAILED': PaymentStatus.FAILED,
        'PENDING': PaymentStatus.PENDING,
        'CANCELLED': PaymentStatus.CANCELLED,
        'REFUNDED': PaymentStatus.REFUNDED,
        'EXPIRED': PaymentStatus.EXPIRED,
    }
    
    normalized_status = mintpay_status.upper()
    return status_mapping.get(normalized_status, PaymentStatus.PENDING)
```

### Error Handling

| Scenario | Action | Log Level |
|----------|--------|-----------|
| Unknown status | Default to PENDING | WARNING |
| Invalid transition | Keep current status | ERROR |
| Missing status | Default to PENDING | WARNING |

### Expected Outcome
- Status mapping dictionary implemented
- Conversion method working correctly
- All MintPay statuses handled
- Integration with webhook processing

### Verification Checklist
- [ ] Status mapping dictionary created
- [ ] Conversion method implemented
- [ ] All status values mapped correctly
- [ ] Unknown status handling in place
- [ ] Integration with webhook handler complete

---

## Task 48: Create MintPay Error Handling

### Overview
Implement comprehensive error handling for MintPay processor operations. This includes network errors, API errors, validation errors, and business logic errors with proper logging, retry mechanisms, and user-friendly error messages.

### Dependencies
- Task 47: Create MintPay Status Mapping
- Logging system configured
- Custom payment exception classes

### Instructions

1. **Define MintPay specific exceptions**
   - Create MintPayAPIError for API errors
   - Create MintPayAuthenticationError for auth failures
   - Create MintPayValidationError for data validation
   - Create MintPayNetworkError for network issues

2. **Implement API error handling**
   - Parse error responses from MintPay API
   - Extract error codes and messages
   - Map to appropriate exception types
   - Provide actionable error information

3. **Add network error handling**
   - Handle connection timeouts
   - Manage request/response errors
   - Implement retry logic with exponential backoff
   - Set maximum retry limits

4. **Create validation error handling**
   - Validate customer data before API calls
   - Check order data completeness
   - Verify amount limits and formats
   - Return detailed validation messages

5. **Implement business logic error handling**
   - Handle customer eligibility rejections
   - Manage insufficient BNPL limits
   - Process payment declines
   - Handle order state conflicts

6. **Add error logging and monitoring**
   - Log all errors with appropriate levels
   - Include request/response data in logs
   - Track error frequencies and patterns
   - Send alerts for critical errors

7. **Create user-friendly error messages**
   - Convert technical errors to user messages
   - Provide Sri Lankan context where appropriate
   - Include next steps or solutions
   - Support multiple languages if needed

8. **Implement error recovery strategies**
   - Automatic retry for transient errors
   - Fallback to alternative payment methods
   - Graceful degradation of features
   - Clear error reporting to frontend

9. **Add error categorization**
   - Retriable errors (network, temporary API issues)
   - Non-retriable errors (validation, business rules)
   - Critical errors (authentication, system failures)
   - User errors (insufficient funds, cancelled)

### Error Categories

| Category | Examples | Retry | User Message |
|----------|----------|-------|--------------|
| Network | Timeout, connection refused | Yes | "Payment service temporarily unavailable" |
| Authentication | Invalid API key | No | "Payment configuration error" |
| Validation | Invalid NIC, phone | No | "Please check your {field}" |
| Business | Ineligible for BNPL | No | "BNPL not available for this purchase" |
| User | Payment declined | No | "Payment was declined by MintPay" |

### MintPay API Error Codes

| API Error Code | Description | Action |
|----------------|-------------|--------|
| 400 | Bad request/validation | Return validation error |
| 401 | Authentication failed | Check API credentials |
| 422 | Eligibility declined | Return eligibility message |
| 429 | Rate limited | Retry with backoff |
| 500 | Server error | Retry then fail |

### Error Response Structure

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid customer NIC format",
        "field": "customer.nic",
        "retry_after": null
    }
}
```

### Retry Logic Configuration

| Error Type | Max Retries | Backoff | Example |
|------------|-------------|---------|---------|
| Network timeout | 3 | Exponential | 1s, 2s, 4s |
| Server error (5xx) | 2 | Linear | 2s, 4s |
| Rate limit (429) | 3 | From header | As specified |
| Client error (4xx) | 0 | None | Immediate fail |

### Error Logging Format

| Level | Scenario | Include |
|-------|----------|---------|
| ERROR | API failures, network errors | Request/response, stack trace |
| WARNING | Retryable errors | Error details, retry attempt |
| INFO | Successful retries | Final outcome |
| DEBUG | All API interactions | Full request/response |

### User Message Localization

| Technical Error | User Message (English) | User Message (Sinhala) |
|----------------|------------------------|------------------------|
| Invalid NIC | "Please enter a valid NIC number" | "වලංගු ජා.හැ. අංකයක් ඇතුළත් කරන්න" |
| Invalid phone | "Please enter a valid mobile number (+94)" | "වලංගු ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (+94)" |
| Insufficient funds | "Payment was declined by your bank" | "ඔබගේ බැංකුව විසින් ගෙවීම ප්‍රතික්ෂේප කරන ලදී" |

### Expected Outcome
- Comprehensive error handling implemented
- User-friendly error messages
- Appropriate retry mechanisms
- Detailed error logging

### Verification Checklist
- [ ] Custom exception classes created
- [ ] API error parsing implemented
- [ ] Network error handling with retries
- [ ] User-friendly error messages
- [ ] Error logging and monitoring setup

---

## Task 49: Create Provider Abstraction

### Overview
Create a unified BNPL provider abstraction that allows the payment system to work with both KOKO and MintPay processors through a common interface. This abstraction enables easy switching between providers and supports future BNPL integrations.

### Dependencies
- Task 48: Create MintPay Error Handling
- KOKO processor implementation (from Group B)
- Provider design patterns established

### Instructions

1. **Create BNPL provider directory**
   - Navigate to `backend/apps/payments/processors/`
   - Create new directory named `bnpl`
   - Create `__init__.py` file in bnpl directory

2. **Define BNPLProcessor abstract base class**
   - Create `base.py` in bnpl directory
   - Define abstract methods for BNPL operations
   - Include provider identification properties
   - Add eligibility checking interface

3. **Define common BNPL interface methods**
   - `check_eligibility()`: Check customer BNPL eligibility
   - `initiate()`: Start BNPL payment process
   - `verify()`: Verify payment completion
   - `get_installments()`: Get available installment plans
   - `calculate_fees()`: Calculate BNPL fees

4. **Create provider registration system**
   - Extend ProcessorFactory for BNPL providers
   - Register KOKO and MintPay as BNPL providers
   - Add provider selection logic
   - Support multiple BNPL options per order

5. **Implement unified BNPL service**
   - Create BNPLService class for business logic
   - Coordinate between different providers
   - Handle provider selection logic
   - Manage fallback scenarios

6. **Add eligibility aggregation**
   - Check eligibility across all BNPL providers
   - Combine eligibility results
   - Return best available options
   - Handle provider-specific requirements

7. **Create provider comparison logic**
   - Compare interest rates and fees
   - Evaluate installment options
   - Check eligibility requirements
   - Rank providers for customer

8. **Implement provider failover**
   - Try primary BNPL provider first
   - Fallback to secondary provider if needed
   - Handle provider unavailability
   - Maintain payment flow continuity

9. **Add unified configuration**
   - Configure BNPL provider priorities
   - Set eligibility thresholds
   - Define fallback rules
   - Manage provider-specific settings

### BNPLProcessor Abstract Interface

```python
class BNPLProcessor(ABC):
    @abstractmethod
    def check_eligibility(self, customer: Customer, amount: Decimal) -> EligibilityResult:
        """Check if customer is eligible for BNPL"""
        pass
    
    @abstractmethod 
    def initiate(self, payment_intent: PaymentIntent) -> PaymentResult:
        """Initiate BNPL payment process"""
        pass
    
    @abstractmethod
    def verify(self, payment_id: str) -> PaymentStatus:
        """Verify payment status"""
        pass
    
    @abstractmethod
    def get_installments(self, amount: Decimal) -> List[InstallmentPlan]:
        """Get available installment options"""
        pass
```

### Provider Implementation Requirements

| Provider | Extends | Implements | Additional Methods |
|----------|---------|------------|-------------------|
| KOKOProcessor | PaymentProcessor, BNPLProcessor | All abstract methods | get_credit_limit() |
| MintPayProcessor | PaymentProcessor, BNPLProcessor | All abstract methods | check_bnpl_eligibility() |

### BNPL Service Usage

```python
class BNPLService:
    def get_available_providers(self, customer: Customer, amount: Decimal) -> List[BNPLProvider]:
        """Return eligible BNPL providers for customer/amount"""
        
    def get_best_option(self, customer: Customer, amount: Decimal) -> BNPLProvider:
        """Return best BNPL provider based on criteria"""
        
    def initiate_with_fallback(self, payment_intent: PaymentIntent) -> PaymentResult:
        """Try providers in order until success"""
```

### Eligibility Result Structure

```python
@dataclass
class EligibilityResult:
    is_eligible: bool
    max_amount: Decimal
    min_amount: Decimal
    installment_options: List[InstallmentPlan]
    rejection_reason: Optional[str] = None
```

### Provider Selection Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| Eligibility | 100% | Must be eligible |
| Interest Rate | 40% | Lower rates preferred |
| Max Amount | 30% | Higher limits preferred |
| Processing Speed | 20% | Faster processing preferred |
| User Experience | 10% | Better UX preferred |

### Configuration Structure

```yaml
bnpl:
  providers:
    - name: "koko"
      priority: 1
      min_amount: 1000
      max_amount: 1000000
    - name: "mintpay" 
      priority: 2
      min_amount: 500
      max_amount: 500000
  fallback_enabled: true
  eligibility_cache_ttl: 300
```

### Expected Outcome
- BNPL provider abstraction implemented
- Common interface for all BNPL providers
- Provider selection and fallback logic
- Unified service for BNPL operations

### Verification Checklist
- [ ] BNPLProcessor abstract class created
- [ ] Common interface methods defined
- [ ] Provider registration system working
- [ ] BNPL service implemented
- [ ] Provider selection logic functional

---

## Task 50: Verify MintPay Processor Implementation

### Overview
Perform comprehensive verification of the complete MintPay processor implementation. This includes testing all components, validating integration points, checking error handling, and ensuring the processor works correctly within the broader payment system.

### Dependencies
- Task 49: Create Provider Abstraction
- All previous MintPay implementation tasks completed
- Testing framework available

### Instructions

1. **Create processor verification tests**
   - Create test file: `test_mintpay_processor.py`
   - Test processor initialization and configuration
   - Verify all abstract methods are implemented
   - Test processor registration with factory

2. **Verify API client functionality**
   - Test MintPay API client initialization
   - Verify authentication header handling
   - Test request signing implementation
   - Check error handling and retries

3. **Test data builders**
   - Verify amount formatter with LKR amounts
   - Test order builder with sample orders
   - Validate customer builder with Sri Lankan data
   - Check items builder with cart data

4. **Test payment flow integration**
   - Create mock PaymentIntent and test initiation
   - Verify payment request format
   - Test redirect URL generation
   - Validate PaymentResult response format

5. **Verify webhook handling**
   - Test webhook signature verification
   - Verify payload processing
   - Test status mapping functionality
   - Check order status updates

6. **Test error handling scenarios**
   - Network timeout handling
   - API error response processing
   - Validation error handling
   - Retry mechanism verification

7. **Verify BNPL abstraction integration**
   - Test BNPLProcessor interface implementation
   - Verify provider registration
   - Test eligibility checking
   - Check fallback functionality

8. **Validate Sri Lankan localization**
   - Test NIC validation (old and new formats)
   - Verify phone number formatting (+94)
   - Test LKR amount formatting
   - Check transaction limit validation

9. **Perform integration testing**
   - Test with mock MintPay API responses
   - Verify database transactions
   - Test order workflow integration
   - Check notification triggers

10. **Create verification documentation**
    - Document test results
    - Create troubleshooting guide
    - List known limitations
    - Provide configuration examples

### Verification Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| Unit Tests | Individual methods | Verify component logic |
| Integration Tests | Component interaction | Test system integration |
| API Tests | MintPay API calls | Verify external communication |
| Error Tests | Error scenarios | Test error handling |
| Localization Tests | Sri Lankan data | Verify local requirements |

### Required Test Scenarios

| Scenario | Expected Result | Pass/Fail Criteria |
|----------|-----------------|-------------------|
| Processor initialization | Successful setup | All components initialized |
| Valid payment initiation | Payment created | PaymentResult with redirect URL |
| Invalid customer data | Validation error | Clear error message returned |
| Network timeout | Retry then fail | Retry attempts logged |
| Successful webhook | Order updated | Payment and order status updated |
| Invalid webhook signature | Rejection | 401 response returned |

### Mock Data Requirements

| Data Type | Mock Values | Purpose |
|-----------|-------------|---------|
| Customer | Valid Sri Lankan NIC, +94 phone | Test localization |
| Order | LKR amounts, valid items | Test order processing |
| API Responses | Success/error scenarios | Test response handling |
| Webhooks | Valid/invalid signatures | Test webhook processing |

### Configuration Verification

| Setting | Expected Value | Verification Method |
|---------|----------------|-------------------|
| Gateway Type | PaymentGateway.MINTPAY | Check processor property |
| Supported Currency | ["LKR"] | Test currency validation |
| BNPL Flag | True | Check is_bnpl property |
| API Timeout | 30 seconds | Test timeout configuration |

### Performance Benchmarks

| Operation | Target Time | Acceptable Range |
|-----------|-------------|------------------|
| Payment initiation | < 2 seconds | 1-3 seconds |
| Webhook processing | < 500ms | 100ms-1s |
| Eligibility check | < 1 second | 500ms-2s |
| Status update | < 200ms | 50ms-500ms |

### Security Verification

| Security Aspect | Check | Status |
|-----------------|-------|--------|
| API key protection | Environment variables | ✓ Required |
| Request signing | HMAC-SHA256 | ✓ Required |
| Webhook verification | Signature validation | ✓ Required |
| Sensitive data logging | No credentials in logs | ✓ Required |

### Integration Points Checklist

| Integration | Component | Status |
|-------------|-----------|--------|
| ProcessorFactory | Registration | ✓ Required |
| PaymentIntent | Initiation | ✓ Required |
| Order Management | Status updates | ✓ Required |
| Customer Data | Sri Lankan validation | ✓ Required |
| Notification System | Email/SMS triggers | ✓ Required |

### Final Verification Report

Create comprehensive report including:
- All test results with pass/fail status
- Performance benchmark results
- Security verification outcomes
- Integration testing results
- Known issues and limitations
- Recommendations for production deployment

### Expected Outcome
- Complete MintPay processor verification
- All tests passing successfully
- Integration points working correctly
- Security measures validated
- Ready for production deployment

### Verification Checklist
- [ ] All unit tests passing
- [ ] Integration tests successful
- [ ] API communication verified
- [ ] Error handling tested
- [ ] Sri Lankan localization validated
- [ ] BNPL abstraction working
- [ ] Security measures verified
- [ ] Performance benchmarks met
- [ ] Documentation completed
- [ ] Ready for production