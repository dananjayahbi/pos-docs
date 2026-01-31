# Tasks 35-42: Payment Initiation, Token, and Lock

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** C - Payment Initialization  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-50_Error-Response-Verify.md](02_Tasks-43-50_Error-Response-Verify.md)

---

## Document Overview

Implement payment initiation as the main entry point for PayHere payments. Creates payment form data with all required parameters for PayHere checkout. Creates checkout page URL handling. Creates optional pre-approval API integration. Creates payment token system for tracking pending payments. Creates expiry handling for tokens. Creates duplicate prevention mechanism. Creates order lock to prevent concurrent payment attempts.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create initiate_payment Method | High | 50 min |
| 36 | Create Payment Form Data | Medium | 35 min |
| 37 | Create Checkout Page URL | Low | 15 min |
| 38 | Create Pre-Approval API | Medium | 40 min |
| 39 | Create Payment Token | Medium | 35 min |
| 40 | Create Expiry Handling | Low | 20 min |
| 41 | Create Duplicate Prevention | Medium | 30 min |
| 42 | Create Order Lock | Medium | 35 min |

---

## Task 35: Create initiate_payment Method

### Overview
Create the main initiate_payment method in the PayHereProcessor class. This method serves as the primary entry point for starting a PayHere payment. It accepts a PaymentIntent object containing order and payment details, builds the payment form data, creates a payment token, locks the order, and returns a PaymentResult with redirect information. This method orchestrates all steps required to initiate a PayHere payment.

### Dependencies
- Task 34: Verify Processor Implementation (from Group B)
- PaymentIntent model exists
- PaymentResult model exists

### Instructions

1. **Open processor module**
   - Navigate to `backend/apps/payments/processors/payhere/processor.py`
   - Locate PayHereProcessor class
   - Add initiate_payment method

2. **Define method signature**
   - Method name: `initiate_payment()`
   - Accept parameter: `payment_intent: PaymentIntent`
   - Return type: `PaymentResult`
   - Mark as async if using async operations

3. **Extract intent data**
   - Get order from payment_intent.order
   - Get amount from payment_intent.amount
   - Get currency from payment_intent.currency
   - Get customer from order.customer
   - Get return_url from payment_intent
   - Get cancel_url from payment_intent

4. **Validate input data**
   - Verify order exists and is valid
   - Verify amount is positive
   - Verify currency is LKR
   - Verify customer data is present
   - Raise ValidationError if any check fails

5. **Check for duplicate payment**
   - Call duplicate prevention service
   - Verify no active payment token exists for order
   - Verify order status is not already paid
   - Raise DuplicatePaymentError if check fails

6. **Acquire order lock**
   - Call order lock service
   - Lock order for payment processing
   - Prevent concurrent payment attempts
   - Store lock reference for cleanup

7. **Build form data**
   - Call build_payment_form_data() helper
   - Pass order, amount, customer details
   - Include all required PayHere fields
   - Generate hash for security

8. **Create payment token**
   - Generate unique token UUID
   - Store form data with token
   - Set expiry time (30 minutes default)
   - Save token to database

9. **Build checkout URL**
   - Get PayHere checkout URL
   - Use sandbox or production URL based on config
   - Prepare for redirect

10. **Optional pre-approval**
    - If pre-approval enabled in config
    - Call PayHere pre-approval API
    - Get pre-approval token
    - Include in form data

11. **Create payment result**
    - Build PaymentResult object
    - Set success = True
    - Include redirect_url (checkout URL)
    - Include form_data for POST
    - Include payment_token for tracking

12. **Add logging**
    - Log payment initiation start
    - Log order ID and amount
    - Log form data (sanitized, no secrets)
    - Log result status

13. **Handle errors**
    - Wrap in try-except block
    - Release order lock on error
    - Delete partial token on error
    - Re-raise with context

14. **Return result**
    - Return complete PaymentResult
    - Frontend will POST form_data to redirect_url
    - Customer will be redirected to PayHere

### Payment Initiation Flow

```
PaymentIntent
        │
        ▼
Validate Input
        │
        ├─── Check order valid
        ├─── Check amount positive
        ├─── Check currency LKR
        └─── Check customer exists
        │
        ▼
Check Duplicates
        │
        ├─── Check existing token
        ├─── Check order status
        └─── Reject if duplicate
        │
        ▼
Acquire Order Lock
        │
        lock = acquire_payment_lock(order)
        │
        ▼
Build Form Data
        │
        form = build_payment_form_data(order, amount)
        │
        ▼
Create Payment Token
        │
        token = PaymentToken.objects.create(
            order=order,
            token=uuid4(),
            form_data=form,
            expires_at=now() + 30min
        )
        │
        ▼
Get Checkout URL
        │
        url = get_checkout_url()
        │
        ▼
Optional Pre-Approval
        │
        if config.pre_approval_enabled:
            pre_token = call_preapproval_api()
            form['preapprove'] = pre_token
        │
        ▼
Build Result
        │
        result = PaymentResult(
            success=True,
            redirect_url=url,
            form_data=form,
            payment_token=token.token
        )
        │
        ▼
Return Result
```

### Method Structure

```
def initiate_payment(payment_intent: PaymentIntent) -> PaymentResult:
    Step 1: Extract data from payment_intent
    Step 2: Validate all required fields
    Step 3: Check for duplicate payment
    Step 4: Acquire order lock
    Step 5: Build payment form data
    Step 6: Create payment token
    Step 7: Get checkout URL
    Step 8: Optional pre-approval
    Step 9: Build payment result
    Step 10: Log initiation
    Step 11: Return result
```

### Input Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| payment_intent | PaymentIntent | Yes | Contains order and payment info |
| payment_intent.order | Order | Yes | Order being paid |
| payment_intent.amount | Decimal | Yes | Payment amount |
| payment_intent.currency | str | Yes | Must be "LKR" |
| payment_intent.return_url | str | Yes | Success redirect URL |
| payment_intent.cancel_url | str | Yes | Cancel redirect URL |

### Output PaymentResult

| Field | Type | Always Present | Description |
|-------|------|----------------|-------------|
| success | bool | Yes | Always True (errors raise exception) |
| redirect_url | str | Yes | PayHere checkout URL |
| form_data | dict | Yes | Form fields to POST |
| payment_token | UUID | Yes | Token for tracking |
| message | str | No | Optional success message |
| metadata | dict | No | Optional additional data |

### Validation Rules

| Check | Condition | Error Type |
|-------|-----------|------------|
| Order exists | order is not None | ValidationError |
| Order valid | order.status == 'pending' | ValidationError |
| Amount positive | amount > 0 | ValidationError |
| Currency valid | currency == 'LKR' | CurrencyNotSupportedError |
| Customer exists | order.customer is not None | ValidationError |
| Return URL valid | return_url is valid URL | ValidationError |

### Error Handling

| Error Type | When Raised | Action |
|------------|-------------|--------|
| ValidationError | Invalid input | Release lock, re-raise |
| DuplicatePaymentError | Payment already exists | Don't lock, re-raise |
| PaymentLockError | Can't acquire lock | Re-raise |
| PayHereAPIError | Pre-approval fails | Release lock, re-raise |

---

## Task 36: Create Payment Form Data

### Overview
Create a function to build the complete payment form data required by PayHere. PayHere accepts payments through a form POST to their checkout page. The form must include all required fields such as merchant_id, order_id, amount, currency, customer details, URLs for return/cancel/notify, and a security hash. This function gathers all required data and formats it correctly.

### Dependencies
- Task 35: Create initiate_payment Method
- Task 21: Create Uppercase MD5 (for hash)
- Task 26: Create Customer Data Builder
- Task 27: Create Address Builder

### Instructions

1. **Create builders helper file**
   - Navigate to `backend/apps/payments/processors/payhere/`
   - Create or open `builders.py`
   - Add build_payment_form_data function

2. **Define function signature**
   - Function name: `build_payment_form_data()`
   - Accept parameters: order, amount, merchant_config, return_url, cancel_url, notify_url
   - Return dict with all form fields

3. **Extract merchant configuration**
   - Get merchant_id from config
   - Get merchant_secret from config (for hash)
   - Get return_url from parameters or config
   - Get cancel_url from parameters or config
   - Get notify_url from config

4. **Generate order ID**
   - Use order.order_number
   - Or generate unique ID with prefix
   - Format: "PAY-ORDER-{order_id}-{timestamp}"
   - Must be unique per payment attempt

5. **Format amount**
   - Convert Decimal to string
   - Format to 2 decimal places
   - Example: "1250.00" for LKR 1250
   - Use format_amount() from Task 22

6. **Set currency**
   - Always "LKR" for Sri Lanka
   - Validate currency is supported
   - PayHere requires currency code

7. **Build items string**
   - Get order line items
   - Format as comma-separated list
   - Example: "Item 1, Item 2, Item 3"
   - Limit to 255 characters
   - Use build_item_name() from Task 25

8. **Extract customer data**
   - Call build_customer_data() from Task 26
   - Get first_name, last_name, email, phone
   - Format phone for Sri Lanka (+94)

9. **Extract address data**
   - Call build_address_data() from Task 27
   - Get address, city, country
   - Default country to "Sri Lanka"

10. **Add additional fields**
    - platform: "Web"
    - custom_1: Order reference or tracking ID
    - custom_2: Additional metadata if needed

11. **Generate hash**
    - Call generate_hash() from Task 19
    - Include: merchant_id, order_id, amount, currency, merchant_secret
    - Hash format: MD5(merchant_id + order_id + amount + currency + uppercase(merchant_secret))
    - Must be uppercase

12. **Assemble form dictionary**
    - Create dict with all fields
    - All values must be strings
    - Include all required fields
    - Include optional fields if available

13. **Validate form data**
    - Check all required fields present
    - Check field lengths within limits
    - Check no empty required fields
    - Raise FormDataError if invalid

### Payment Form Fields

| Field | PayHere Name | Required | Max Length | Source |
|-------|--------------|----------|------------|--------|
| Merchant ID | merchant_id | Yes | 10 | Config |
| Order ID | order_id | Yes | 50 | Generated |
| Items | items | Yes | 255 | Order items |
| Currency | currency | Yes | 3 | "LKR" |
| Amount | amount | Yes | 12 | Order total |
| First Name | first_name | Yes | 50 | Customer |
| Last Name | last_name | Yes | 50 | Customer |
| Email | email | Yes | 100 | Customer |
| Phone | phone | Yes | 15 | Customer |
| Address | address | Yes | 255 | Billing |
| City | city | Yes | 50 | Billing |
| Country | country | Yes | 50 | "Sri Lanka" |
| Return URL | return_url | Yes | 255 | Config |
| Cancel URL | cancel_url | Yes | 255 | Config |
| Notify URL | notify_url | Yes | 255 | Config |
| Hash | hash | Yes | 32 | Generated |

### Optional Fields

| Field | PayHere Name | Max Length | Purpose |
|-------|--------------|------------|---------|
| Platform | platform | 20 | "Web" indicator |
| Custom 1 | custom_1 | 100 | Order reference |
| Custom 2 | custom_2 | 100 | Additional data |
| Delivery Address | delivery_address | 255 | If different from billing |
| Delivery City | delivery_city | 50 | If different from billing |
| Delivery Country | delivery_country | 50 | If different from billing |

### Form Building Flow

```
Order + Amount + Config
        │
        ▼
Extract Merchant Config
        │
        merchant_id = config.merchant_id
        merchant_secret = config.merchant_secret
        │
        ▼
Generate Order ID
        │
        order_id = f"PAY-{order.id}-{timestamp}"
        │
        ▼
Format Amount
        │
        amount = format_amount(order.total)
        │
        ▼
Build Items String
        │
        items = ", ".join(order.items.names)
        │
        ▼
Get Customer Data
        │
        customer = build_customer_data(order.customer)
        first_name, last_name, email, phone = customer
        │
        ▼
Get Address Data
        │
        address = build_address_data(order.billing_address)
        address, city, country = address
        │
        ▼
Generate Hash
        │
        hash = generate_hash(
            merchant_id, order_id, amount, "LKR", merchant_secret
        )
        │
        ▼
Assemble Form Dict
        │
        form = {
            "merchant_id": merchant_id,
            "order_id": order_id,
            "items": items,
            "currency": "LKR",
            "amount": amount,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "address": address,
            "city": city,
            "country": country,
            "return_url": return_url,
            "cancel_url": cancel_url,
            "notify_url": notify_url,
            "hash": hash,
            "platform": "Web"
        }
        │
        ▼
Validate Form
        │
        validate_form_data(form)
        │
        ▼
Return Form Dict
```

### Hash Generation

```
Hash Input Components:
    merchant_id = "1234567"
    order_id = "PAY-ORDER-123-1234567890"
    amount = "1250.00"
    currency = "LKR"
    merchant_secret = "secret123"

Hash Calculation:
    hash_string = merchant_id + order_id + amount + currency + uppercase(merchant_secret)
    hash_string = "1234567PAY-ORDER-123-12345678901250.00LKRSECRET123"
    hash = MD5(hash_string).hexdigest().upper()
    hash = "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6"

Include in Form:
    form["hash"] = hash
```

### Field Validation Rules

| Field | Validation |
|-------|------------|
| merchant_id | Not empty, alphanumeric |
| order_id | Not empty, max 50 chars |
| items | Not empty, max 255 chars |
| currency | Must be "LKR" |
| amount | Positive decimal, 2 decimals |
| first_name | Not empty, max 50 chars |
| last_name | Not empty, max 50 chars |
| email | Valid email format |
| phone | Valid Sri Lanka phone |
| address | Not empty, max 255 chars |
| city | Not empty, max 50 chars |
| country | Not empty, max 50 chars |
| return_url | Valid URL, https preferred |
| cancel_url | Valid URL, https preferred |
| notify_url | Valid URL, https required |
| hash | 32 character hex string |

### Example Form Data

```
{
    "merchant_id": "1234567",
    "order_id": "PAY-ORDER-123-1234567890",
    "items": "Product A, Product B, Product C",
    "currency": "LKR",
    "amount": "1250.00",
    "first_name": "Kasun",
    "last_name": "Perera",
    "email": "kasun.perera@example.com",
    "phone": "+94771234567",
    "address": "123 Galle Road, Colombo 03",
    "city": "Colombo",
    "country": "Sri Lanka",
    "return_url": "https://example.com/payment/return",
    "cancel_url": "https://example.com/payment/cancel",
    "notify_url": "https://example.com/payment/notify",
    "hash": "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6",
    "platform": "Web",
    "custom_1": "ORDER-123",
    "custom_2": "WEBSTORE"
}
```

---

## Task 37: Create Checkout Page URL

### Overview
Create a function to get the correct PayHere checkout page URL based on the environment configuration. PayHere provides separate URLs for sandbox (testing) and production environments. The function determines which URL to use based on the processor configuration and returns the appropriate checkout URL where the payment form will be submitted.

### Dependencies
- Task 35: Create initiate_payment Method
- PayHere configuration with sandbox flag

### Instructions

1. **Create URL helper function**
   - Navigate to `backend/apps/payments/processors/payhere/`
   - Open `processor.py` or create `urls.py`
   - Add get_checkout_url function

2. **Define function signature**
   - Function name: `get_checkout_url()`
   - Accept parameter: `is_sandbox: bool`
   - Return string URL

3. **Define PayHere URLs**
   - Sandbox URL: `https://sandbox.payhere.lk/pay/checkout`
   - Production URL: `https://www.payhere.lk/pay/checkout`
   - Store as constants

4. **Implement URL selection**
   - If is_sandbox is True, return sandbox URL
   - If is_sandbox is False, return production URL
   - Simple conditional logic

5. **Add validation**
   - Ensure URL is properly formatted
   - Ensure HTTPS protocol
   - Verify URL is not empty

6. **Add logging**
   - Log which environment URL is being used
   - Include in payment initiation log
   - Helps debugging environment issues

7. **Create helper for processor**
   - Add method to PayHereProcessor class
   - Name: `_get_checkout_url()`
   - Uses processor's is_sandbox config
   - Returns appropriate URL

8. **Use in initiate_payment**
   - Call get_checkout_url in initiate_payment method
   - Pass result as redirect_url in PaymentResult
   - Frontend will POST form to this URL

### URL Selection Logic

```
Configuration
        │
        is_sandbox = config.sandbox_mode
        │
        ▼
Check Environment
        │
        ├─── If is_sandbox == True
        │       │
        │       ▼
        │   Return Sandbox URL
        │   "https://sandbox.payhere.lk/pay/checkout"
        │
        └─── If is_sandbox == False
                │
                ▼
            Return Production URL
            "https://www.payhere.lk/pay/checkout"
```

### Environment URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Sandbox | https://sandbox.payhere.lk/pay/checkout | Testing |
| Production | https://www.payhere.lk/pay/checkout | Live payments |

### URL Constants

```
Define constants for URLs:

PAYHERE_SANDBOX_CHECKOUT_URL = "https://sandbox.payhere.lk/pay/checkout"
PAYHERE_PRODUCTION_CHECKOUT_URL = "https://www.payhere.lk/pay/checkout"

Function implementation:
    if is_sandbox:
        return PAYHERE_SANDBOX_CHECKOUT_URL
    else:
        return PAYHERE_PRODUCTION_CHECKOUT_URL
```

### Function Implementation

```
def get_checkout_url(is_sandbox: bool) -> str:
    Determine PayHere checkout URL based on environment
    
    Parameters:
        is_sandbox: Whether to use sandbox or production
    
    Returns:
        Checkout URL string
    
    Implementation:
        Step 1: Check is_sandbox flag
        Step 2: Return appropriate URL
        Step 3: Log selected URL
        Step 4: Validate URL format
```

### Usage in Processor

```
PayHereProcessor Class:

    def _get_checkout_url(self) -> str:
        Get checkout URL for current configuration
        
        return get_checkout_url(self.is_sandbox)
    
    def initiate_payment(self, payment_intent):
        ... build form data ...
        
        checkout_url = self._get_checkout_url()
        
        result = PaymentResult(
            redirect_url=checkout_url,
            form_data=form_data
        )
        
        return result
```

### Validation Checks

| Check | Validation |
|-------|------------|
| URL not empty | len(url) > 0 |
| HTTPS protocol | url.startswith('https://') |
| Valid domain | 'payhere.lk' in url |

---

## Task 38: Create Pre-Approval API

### Overview
Create an optional pre-approval API integration with PayHere. PayHere offers a pre-approval API that can be called before redirecting the customer to the checkout page. This API pre-authorizes the payment and returns a pre-approval token that can be included in the payment form. Pre-approval is optional but can improve success rates and provide early validation.

### Dependencies
- Task 35: Create initiate_payment Method
- PayHere API credentials
- HTTP client library (requests)

### Instructions

1. **Create pre-approval module**
   - Navigate to `backend/apps/payments/processors/payhere/`
   - Create new file `preapproval.py`
   - Add pre-approval API functions

2. **Define API endpoints**
   - Sandbox: `https://sandbox.payhere.lk/merchant/v1/preapprove`
   - Production: `https://www.payhere.lk/merchant/v1/preapprove`
   - Store as constants

3. **Create pre-approval request function**
   - Function name: `request_preapproval()`
   - Accept parameters: merchant_id, order_id, amount, currency, merchant_secret
   - Return pre-approval token or None

4. **Build request payload**
   - Include merchant_id
   - Include order_id
   - Include amount (formatted)
   - Include currency (LKR)
   - Generate authentication hash

5. **Generate auth hash**
   - Hash format: MD5(merchant_id + order_id + amount + merchant_secret)
   - Convert to uppercase
   - Include in request as 'hash' field

6. **Make API request**
   - Use POST method
   - Set Content-Type: application/json
   - Include timeout (10 seconds)
   - Handle connection errors

7. **Parse API response**
   - Check status code (200 for success)
   - Parse JSON response
   - Extract pre-approval token
   - Extract status and message

8. **Handle success response**
   - Status: "success"
   - Token: pre-approval token string
   - Return token for inclusion in form

9. **Handle error response**
   - Status: "error"
   - Message: error description
   - Log error details
   - Return None (pre-approval failed, continue without it)

10. **Add retry logic**
    - Retry once on network error
    - Retry once on timeout
    - Don't retry on validation errors
    - Return None if all retries fail

11. **Add logging**
    - Log pre-approval request start
    - Log request parameters (sanitized)
    - Log response status
    - Log token received or failure

12. **Integrate with initiate_payment**
    - Check if pre-approval enabled in config
    - If enabled, call request_preapproval
    - If token received, add to form data as 'preapprove' field
    - If pre-approval fails, continue without it (optional feature)

13. **Add configuration flag**
    - Add `enable_preapproval` to PayHere config
    - Default to False (disabled)
    - Enable only if needed

### Pre-Approval Flow

```
Payment Initiation
        │
        ▼
Check Pre-Approval Enabled
        │
        ├─── If disabled
        │       │
        │       ▼
        │   Skip pre-approval
        │   Continue with form
        │
        └─── If enabled
                │
                ▼
            Build Pre-Approval Request
                │
                payload = {
                    "merchant_id": merchant_id,
                    "order_id": order_id,
                    "amount": amount,
                    "currency": "LKR",
                    "hash": auth_hash
                }
                │
                ▼
            Call PayHere API
                │
                POST to /merchant/v1/preapprove
                │
                ▼
            Parse Response
                │
                ├─── Success
                │       │
                │       ▼
                │   Extract token
                │   Add to form as 'preapprove'
                │
                └─── Error
                        │
                        ▼
                    Log error
                    Continue without pre-approval
                │
                ▼
            Continue Payment Flow
```

### Pre-Approval Request

| Field | Value | Required |
|-------|-------|----------|
| merchant_id | From config | Yes |
| order_id | Generated order ID | Yes |
| amount | Formatted amount | Yes |
| currency | "LKR" | Yes |
| hash | Auth hash | Yes |

### Pre-Approval Response

**Success Response:**
```
{
    "status": "success",
    "preapprove_token": "PREAPPROVE-TOKEN-123456",
    "message": "Pre-approval successful"
}
```

**Error Response:**
```
{
    "status": "error",
    "message": "Invalid merchant credentials"
}
```

### Hash Generation for Pre-Approval

```
Hash Components:
    merchant_id = "1234567"
    order_id = "PAY-ORDER-123-1234567890"
    amount = "1250.00"
    merchant_secret = "secret123"

Hash Calculation:
    hash_string = merchant_id + order_id + amount + merchant_secret
    hash_string = "1234567PAY-ORDER-123-12345678901250.00secret123"
    hash = MD5(hash_string).hexdigest().upper()

Include in Request:
    payload["hash"] = hash
```

### API Endpoints

| Environment | Endpoint |
|-------------|----------|
| Sandbox | https://sandbox.payhere.lk/merchant/v1/preapprove |
| Production | https://www.payhere.lk/merchant/v1/preapprove |

### Error Handling

| Error Type | Action |
|------------|--------|
| Network error | Retry once, then continue without |
| Timeout | Retry once, then continue without |
| Invalid credentials | Log error, continue without |
| Invalid amount | Log error, continue without |
| API error | Log error, continue without |

### Configuration

```
PayHere Configuration:
    enable_preapproval: bool = False
    preapproval_timeout: int = 10  # seconds

Usage:
    if config.enable_preapproval:
        token = request_preapproval(...)
        if token:
            form_data['preapprove'] = token
```

---

## Task 39: Create Payment Token

### Overview
Create a PaymentToken model to track pending payment attempts. When a payment is initiated, a token is created to store the payment form data, track the payment state, and associate it with an order. The token has an expiry time and can be used to verify the payment callback. This model provides a record of all payment attempts and their current state.

### Dependencies
- Task 35: Create initiate_payment Method
- Django models framework
- UUID field support

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/payments/models/`
   - Create new file `payment_token.py`
   - Import required Django model classes

2. **Define PaymentToken model**
   - Extend Django models.Model
   - Add model name: PaymentToken
   - Add model docstring

3. **Add token field**
   - Field type: UUIDField
   - Default: uuid.uuid4
   - Unique: True
   - Primary key: No (use auto ID)
   - Index: Yes

4. **Add order relationship**
   - Field type: ForeignKey to Order
   - Related name: payment_tokens
   - On delete: CASCADE
   - Db index: Yes

5. **Add payment gateway field**
   - Field type: CharField
   - Max length: 50
   - Choices: PaymentGateway enum
   - Default: PAYHERE

6. **Add form data field**
   - Field type: JSONField
   - Store complete form data
   - Allows recreation of payment form
   - Include all fields from Task 36

7. **Add status field**
   - Field type: CharField
   - Max length: 20
   - Choices: pending, completed, expired, failed
   - Default: pending
   - Index: Yes

8. **Add creation timestamp**
   - Field type: DateTimeField
   - Auto now add: True
   - Db index: Yes

9. **Add expiry timestamp**
   - Field type: DateTimeField
   - No default (set in save or during creation)
   - Db index: Yes

10. **Add used timestamp**
    - Field type: DateTimeField
    - Null: True
    - Blank: True
    - Set when payment completed

11. **Add metadata field**
    - Field type: JSONField
    - Null: True
    - Blank: True
    - Store additional tracking data

12. **Define Meta class**
    - Ordering: ['-created_at']
    - Indexes: token, order, status, created_at
    - Verbose name: "Payment Token"

13. **Add __str__ method**
    - Return format: "Token {token} - Order {order_id}"

14. **Add is_expired property**
    - Check if current time > expires_at
    - Return boolean
    - Use in validation

15. **Add is_active property**
    - Check status is pending
    - Check not expired
    - Return boolean

16. **Add mark_used method**
    - Set status to completed
    - Set used_at to now
    - Save model

17. **Add mark_expired method**
    - Set status to expired
    - Save model

18. **Register in models/__init__.py**
    - Import PaymentToken
    - Add to __all__

19. **Create migration**
    - Run makemigrations
    - Review migration file
    - Apply migration

### PaymentToken Model Structure

```
PaymentToken Model:
    ├─── id (AutoField, PK)
    ├─── token (UUIDField, unique, indexed)
    ├─── order (ForeignKey to Order)
    ├─── gateway (CharField, choices)
    ├─── form_data (JSONField)
    ├─── status (CharField, choices)
    ├─── created_at (DateTimeField, auto)
    ├─── expires_at (DateTimeField)
    ├─── used_at (DateTimeField, null)
    └─── metadata (JSONField, null)

Properties:
    ├─── is_expired -> bool
    └─── is_active -> bool

Methods:
    ├─── mark_used()
    └─── mark_expired()
```

### Field Definitions

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | AutoField | Primary key | Database ID |
| token | UUIDField | Unique, indexed | Token identifier |
| order | ForeignKey | Not null | Associated order |
| gateway | CharField | Max 50 | Payment gateway type |
| form_data | JSONField | Not null | Payment form data |
| status | CharField | Max 20, choices | Token status |
| created_at | DateTimeField | Auto now add | Creation time |
| expires_at | DateTimeField | Not null | Expiry time |
| used_at | DateTimeField | Nullable | Completion time |
| metadata | JSONField | Nullable | Additional data |

### Status Choices

| Status | Description |
|--------|-------------|
| pending | Token created, payment not completed |
| completed | Payment successful, token used |
| expired | Token expired before use |
| failed | Payment failed |

### Token Creation Example

```
Create token during payment initiation:

token = PaymentToken.objects.create(
    token=uuid.uuid4(),
    order=order,
    gateway=PaymentGateway.PAYHERE,
    form_data=form_data,
    status='pending',
    expires_at=timezone.now() + timedelta(minutes=30),
    metadata={
        'ip_address': request.META.get('REMOTE_ADDR'),
        'user_agent': request.META.get('HTTP_USER_AGENT')
    }
)
```

### Token Validation

```
Check if token is valid:

token = PaymentToken.objects.get(token=token_uuid)

if not token.is_active:
    if token.is_expired:
        raise TokenExpiredError()
    if token.status == 'completed':
        raise TokenAlreadyUsedError()
    if token.status == 'failed':
        raise TokenFailedError()
```

### Indexes

```
Database indexes for performance:

Index on: token (for lookups)
Index on: order_id (for order queries)
Index on: status (for status filtering)
Index on: created_at (for time-based queries)
Index on: expires_at (for expiry checks)
```

---

## Task 40: Create Expiry Handling

### Overview
Implement token expiry handling to ensure payment tokens are only valid for a limited time. Payment tokens should expire after 30 minutes (configurable) to prevent stale payment attempts. The system must check expiry before using a token and provide mechanisms to handle expired tokens gracefully. This prevents security issues and ensures payment data freshness.

### Dependencies
- Task 39: Create Payment Token

### Instructions

1. **Add expiry configuration**
   - Navigate to PayHere configuration
   - Add setting: `token_expiry_minutes`
   - Default value: 30 minutes
   - Make configurable per environment

2. **Set expiry on token creation**
   - In initiate_payment method
   - Calculate expires_at when creating token
   - Formula: expires_at = now() + token_expiry_minutes
   - Store in expires_at field

3. **Create expiry check function**
   - Function name: `check_token_expiry()`
   - Accept token as parameter
   - Return boolean (is_expired)
   - Use property from Task 39

4. **Implement is_expired property**
   - In PaymentToken model
   - Compare current time with expires_at
   - Return True if current > expires_at
   - Return False otherwise

5. **Add expiry validation**
   - Before using token for verification
   - Call check_token_expiry
   - Raise TokenExpiredError if expired
   - Log expiry event

6. **Create cleanup task**
   - Celery task to clean expired tokens
   - Query tokens where expires_at < now()
   - Mark status as 'expired'
   - Run periodically (every hour)

7. **Add auto-expiry marking**
   - In is_active property
   - If expired and status still pending
   - Auto-mark as expired
   - Update status in database

8. **Handle expiry in callback**
   - When PayHere sends notification
   - Load token by token UUID
   - Check if expired
   - If expired, reject payment
   - Log expired payment attempt

9. **Add expiry warning**
   - If token close to expiry (5 min remaining)
   - Log warning
   - Consider showing warning to customer

10. **Add grace period**
    - Optional grace period (2 minutes)
    - Allow payment completion slightly after expiry
    - Only for in-progress payments
    - Configurable

11. **Create expiry report**
    - Query for expired tokens
    - Group by reason (timeout, abandonment)
    - Use for analytics

### Expiry Flow

```
Token Creation
        │
        created_at = now()
        expires_at = now() + 30 minutes
        │
        ▼
Store Token
        │
        ▼
Token Usage
        │
        ▼
Check Expiry
        │
        current_time = now()
        │
        ├─── If current_time <= expires_at
        │       │
        │       ▼
        │   Token valid
        │   Continue processing
        │
        └─── If current_time > expires_at
                │
                ▼
            Token expired
            Mark as expired
            Raise TokenExpiredError
```

### Expiry Calculation

```
Token Creation:
    created_at = timezone.now()
    expiry_minutes = config.token_expiry_minutes  # 30
    expires_at = created_at + timedelta(minutes=expiry_minutes)

Token Validation:
    token = PaymentToken.objects.get(token=token_uuid)
    current_time = timezone.now()
    
    if current_time > token.expires_at:
        # Token expired
        token.mark_expired()
        raise TokenExpiredError()
```

### Expiry Property

```
PaymentToken Model:

    @property
    def is_expired(self) -> bool:
        Check if token has expired
        
        return timezone.now() > self.expires_at
    
    @property
    def is_active(self) -> bool:
        Check if token is active and not expired
        
        if self.status != 'pending':
            return False
        
        if self.is_expired:
            # Auto-mark as expired
            self.mark_expired()
            return False
        
        return True
```

### Expiry Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| token_expiry_minutes | 30 | Minutes until token expires |
| grace_period_minutes | 2 | Extra time for in-progress |
| cleanup_interval_hours | 1 | Cleanup task frequency |

### Cleanup Task

```
Celery periodic task:

@shared_task
def cleanup_expired_tokens():
    Clean up expired payment tokens
    
    expired_tokens = PaymentToken.objects.filter(
        status='pending',
        expires_at__lt=timezone.now()
    )
    
    count = expired_tokens.update(status='expired')
    
    logger.info(f"Marked {count} tokens as expired")
```

### Expiry Error Handling

| Scenario | Action |
|----------|--------|
| Token expired before redirect | Generate new token |
| Token expired during payment | Show error message |
| Token expired in callback | Reject payment |
| Token close to expiry | Log warning |

---

## Task 41: Create Duplicate Prevention

### Overview
Implement duplicate payment prevention to ensure an order can only have one active payment attempt at a time. This prevents customers from initiating multiple payments for the same order, which could lead to double charges or payment conflicts. The system checks for existing active payment tokens and pending payments before allowing a new payment initiation.

### Dependencies
- Task 39: Create Payment Token
- Task 40: Create Expiry Handling

### Instructions

1. **Create duplicate check function**
   - Function name: `check_duplicate_payment()`
   - Accept order as parameter
   - Return boolean or raise exception
   - Call before creating new token

2. **Check existing active tokens**
   - Query PaymentToken for order
   - Filter by status = 'pending'
   - Filter by not expired
   - If exists, raise DuplicatePaymentError

3. **Check order status**
   - Get order payment status
   - If status is 'paid' or 'processing'
   - Raise OrderAlreadyPaidError
   - Prevent payment for completed orders

4. **Check recent payments**
   - Query payments for order
   - Check if payment in last 5 minutes
   - If exists and status pending/processing
   - Raise DuplicatePaymentError

5. **Implement duplicate prevention logic**
   - In initiate_payment method
   - Call check_duplicate_payment early
   - Before acquiring lock
   - Fail fast if duplicate detected

6. **Create custom exceptions**
   - Define DuplicatePaymentError
   - Define OrderAlreadyPaidError
   - Include order ID in error message
   - Return clear error to frontend

7. **Add duplicate check with lock**
   - Use database transaction
   - Select for update on order
   - Check duplicates within transaction
   - Prevents race conditions

8. **Handle expired token cleanup**
   - If checking returns expired tokens
   - Auto-mark them as expired
   - Allow new payment after cleanup
   - Improves user experience

9. **Add retry after expiry**
   - If active token exists but close to expiry
   - Wait for expiry and retry
   - Or invalidate old token and create new
   - Configurable behavior

10. **Log duplicate attempts**
    - Log when duplicate detected
    - Include order ID and customer
    - Include reason for rejection
    - Use for fraud detection

11. **Add admin override**
    - Optional admin flag to bypass check
    - For manual payment recovery
    - Require admin permission
    - Log override action

### Duplicate Check Flow

```
Payment Initiation Request
        │
        order_id = request.order_id
        │
        ▼
Check Duplicate Payment
        │
        ▼
Query Active Tokens
        │
        active_tokens = PaymentToken.objects.filter(
            order_id=order_id,
            status='pending'
        )
        │
        ▼
Check Token Status
        │
        ├─── Active token exists and not expired
        │       │
        │       ▼
        │   Raise DuplicatePaymentError
        │   "Payment already in progress"
        │
        ├─── Active token exists but expired
        │       │
        │       ▼
        │   Mark token as expired
        │   Allow new payment
        │
        └─── No active token
                │
                ▼
            Check Order Status
                │
                ├─── Order status is 'paid'
                │       │
                │       ▼
                │   Raise OrderAlreadyPaidError
                │   "Order already paid"
                │
                └─── Order status is 'pending'
                        │
                        ▼
                    Allow Payment
                    Continue to token creation
```

### Duplicate Check Function

```
def check_duplicate_payment(order: Order) -> None:
    Check for duplicate payment attempts
    
    Raises:
        DuplicatePaymentError: If active payment exists
        OrderAlreadyPaidError: If order already paid
    
    # Check for active tokens
    active_tokens = PaymentToken.objects.filter(
        order=order,
        status='pending'
    )
    
    for token in active_tokens:
        if token.is_active:
            raise DuplicatePaymentError(
                f"Active payment already exists for order {order.id}"
            )
        else:
            # Token expired, mark it
            token.mark_expired()
    
    # Check order status
    if order.payment_status in ['paid', 'processing']:
        raise OrderAlreadyPaidError(
            f"Order {order.id} is already paid or being processed"
        )
```

### Duplicate Scenarios

| Scenario | Detection | Action |
|----------|-----------|--------|
| Active token exists | Query pending tokens | Reject new payment |
| Token expired | Check is_expired | Mark expired, allow new |
| Order already paid | Check order status | Reject new payment |
| Payment processing | Check payment status | Reject new payment |
| Multiple clicks | Race condition check | Use database lock |

### Database Lock for Race Condition

```
Prevent race condition with lock:

from django.db import transaction

def initiate_payment(payment_intent):
    with transaction.atomic():
        # Lock the order row
        order = Order.objects.select_for_update().get(
            id=payment_intent.order_id
        )
        
        # Check duplicates within lock
        check_duplicate_payment(order)
        
        # Create token (still within lock)
        token = PaymentToken.objects.create(...)
        
        # Lock released when transaction commits
```

### Custom Exceptions

```
class DuplicatePaymentError(PaymentException):
    Raised when attempting duplicate payment
    
    default_message = "A payment is already in progress for this order"

class OrderAlreadyPaidError(PaymentException):
    Raised when order is already paid
    
    default_message = "This order has already been paid"
```

### Duplicate Logging

```
Log duplicate attempts:

logger.warning(
    "Duplicate payment attempt",
    extra={
        'order_id': order.id,
        'customer_id': order.customer_id,
        'existing_token_count': active_tokens.count(),
        'order_status': order.payment_status
    }
)
```

---

## Task 42: Create Order Lock

### Overview
Implement order locking to prevent concurrent modifications during payment processing. When a payment is initiated, the order must be locked to prevent inventory changes, price updates, or other modifications that could affect payment integrity. The lock is held during payment processing and released when payment completes or fails.

### Dependencies
- Task 41: Create Duplicate Prevention
- Redis or database locking mechanism

### Instructions

1. **Choose lock implementation**
   - Preferred: Redis distributed lock
   - Fallback: Database row lock (select_for_update)
   - Consider lock timeout and expiry

2. **Create lock service**
   - Navigate to `backend/apps/payments/services/`
   - Create new file `payment_lock.py`
   - Add lock and unlock functions

3. **Define lock key format**
   - Key pattern: `payment:lock:order:{order_id}`
   - Unique per order
   - Include timestamp or TTL

4. **Create acquire lock function**
   - Function name: `acquire_payment_lock()`
   - Accept order_id parameter
   - Return lock object or raise error
   - Set timeout (5 minutes default)

5. **Implement Redis lock**
   - Use Redis SET with NX (not exists) flag
   - Set expiry time (300 seconds)
   - If SET fails, lock already held
   - Return lock key if successful

6. **Create release lock function**
   - Function name: `release_payment_lock()`
   - Accept order_id and lock object
   - Delete lock key from Redis
   - Handle lock already released

7. **Add lock timeout**
   - Lock auto-expires after timeout
   - Default: 5 minutes
   - Prevents deadlock if process crashes
   - Configurable per environment

8. **Implement with context manager**
   - Create PaymentLock context manager
   - Acquires lock on __enter__
   - Releases lock on __exit__
   - Use with statement for safety

9. **Add lock validation**
   - Check lock still held before operations
   - Verify lock not expired
   - Refresh lock if needed
   - Extend lock for long operations

10. **Handle lock acquisition failure**
    - If lock can't be acquired
    - Raise OrderLockError
    - Include reason (already locked)
    - Return error to frontend

11. **Integrate with payment flow**
    - Acquire lock in initiate_payment
    - Hold lock during token creation
    - Release lock after response
    - Release lock in error handler (finally block)

12. **Add lock monitoring**
    - Log when lock acquired
    - Log when lock released
    - Log lock timeouts
    - Track lock duration

13. **Create lock cleanup task**
    - Celery task to clean stale locks
    - Query expired locks
    - Delete from Redis
    - Run periodically

14. **Add database fallback**
    - If Redis unavailable
    - Use select_for_update on order
    - Less efficient but reliable
    - Log fallback usage

### Payment Lock Flow

```
Payment Initiation
        │
        ▼
Acquire Order Lock
        │
        lock_key = f"payment:lock:order:{order.id}"
        │
        ▼
Try Redis SET NX
        │
        ├─── Lock acquired (SET successful)
        │       │
        │       ▼
        │   Set lock expiry (5 minutes)
        │   Continue payment processing
        │       │
        │       ▼
        │   Create payment token
        │   Build form data
        │   Generate response
        │       │
        │       ▼
        │   Release Lock
        │   Delete lock key
        │   Return result
        │
        └─── Lock acquisition failed (lock exists)
                │
                ▼
            Check lock age
                │
                ├─── Lock recently acquired (<1 min)
                │       │
                │       ▼
                │   Raise OrderLockError
                │   "Payment already in progress"
                │
                └─── Lock stale (>4 min)
                        │
                        ▼
                    Force release old lock
                    Retry acquisition
```

### Redis Lock Implementation

```
Acquire lock:

def acquire_payment_lock(order_id: int, timeout: int = 300) -> str:
    Acquire payment lock for order
    
    Args:
        order_id: Order ID to lock
        timeout: Lock expiry in seconds
    
    Returns:
        Lock key if successful
    
    Raises:
        OrderLockError: If lock can't be acquired
    
    lock_key = f"payment:lock:order:{order_id}"
    lock_value = f"{uuid.uuid4()}"  # Unique lock identifier
    
    # Try to set lock with NX (not exists) flag
    acquired = redis_client.set(
        lock_key,
        lock_value,
        nx=True,  # Only set if doesn't exist
        ex=timeout  # Expiry time
    )
    
    if not acquired:
        raise OrderLockError(f"Order {order_id} is locked")
    
    return lock_key
```

```
Release lock:

def release_payment_lock(lock_key: str) -> None:
    Release payment lock
    
    Args:
        lock_key: Lock key to release
    
    deleted = redis_client.delete(lock_key)
    
    if deleted:
        logger.info(f"Released lock: {lock_key}")
    else:
        logger.warning(f"Lock already released: {lock_key}")
```

### Context Manager

```
class PaymentLock:
    Context manager for payment locks
    
    def __init__(self, order_id: int, timeout: int = 300):
        self.order_id = order_id
        self.timeout = timeout
        self.lock_key = None
    
    def __enter__(self):
        Acquire lock
        
        self.lock_key = acquire_payment_lock(
            self.order_id,
            self.timeout
        )
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        Release lock
        
        if self.lock_key:
            release_payment_lock(self.lock_key)

Usage:

def initiate_payment(payment_intent):
    with PaymentLock(payment_intent.order_id):
        # Lock held
        check_duplicate_payment(order)
        token = create_payment_token(...)
        form_data = build_payment_form_data(...)
        # Lock automatically released
    
    return result
```

### Lock Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| lock_timeout | 300 seconds | Lock expiry time |
| lock_retry_count | 3 | Retry attempts |
| lock_retry_delay | 1 second | Delay between retries |
| stale_lock_threshold | 240 seconds | Consider lock stale after |

### Database Lock Fallback

```
If Redis unavailable:

from django.db import transaction

def initiate_payment(payment_intent):
    with transaction.atomic():
        # Database row lock
        order = Order.objects.select_for_update().get(
            id=payment_intent.order_id
        )
        
        # Process payment
        ...
        
        # Lock released on transaction commit
```

### Lock Error Handling

| Error | Cause | Action |
|-------|-------|--------|
| OrderLockError | Lock held by another process | Retry or return error |
| LockTimeoutError | Lock acquisition timeout | Return error |
| RedisUnavailableError | Redis connection failed | Use database lock |

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-50_Error-Response-Verify.md](02_Tasks-43-50_Error-Response-Verify.md)

---

**Document End - Tasks 35-42 Complete**
