# Tasks 81-88: PayHere Types, Hook, and Frontend Components

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** F - Frontend Integration & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-92_Testing-Documentation.md](02_Tasks-89-92_Testing-Documentation.md)

---

## Document Overview

Create frontend integration for PayHere payment gateway. Implement TypeScript types, API client, React hooks, redirect handler, success/cancel pages, and payment button with loading states. This enables webstore customers to pay via PayHere's hosted checkout page.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create PayHere Types | Low | 25 min |
| 82 | Create PayHere API Client | Medium | 35 min |
| 83 | Create Initiate Payment Hook | Medium | 40 min |
| 84 | Create Redirect Handler | Medium | 35 min |
| 85 | Create Success Page | Medium | 45 min |
| 86 | Create Cancel Page | Low | 25 min |
| 87 | Create PayHere Button | Medium | 40 min |
| 88 | Create Loading State | Low | 20 min |

---

## Task 81: Create PayHere Types

### Overview
Create comprehensive TypeScript types for PayHere payment flow. Define interfaces for payment initiation requests/responses, form data, customer information, webhook payloads, and status codes. These types provide compile-time safety and IDE autocomplete for all PayHere interactions.

### Dependencies
- Task 80: Verify Refund Processing (backend complete)
- TypeScript configured in Next.js project
- Payment types from Phase 08 exist

### Instructions

1. **Create types directory**
   - Navigate to `frontend/lib/payments/payhere/` directory
   - Create new file named `types.ts`
   - This will contain all PayHere TypeScript types

2. **Define PayHere status codes**
   - Create enum `PayHereStatus`
   - Define SUCCESS = 2
   - Define PENDING = 0
   - Define CANCELED = -1
   - Define FAILED = -2
   - Define CHARGEDBACK = -3
   - Include JSDoc comments with descriptions

3. **Define payment initiation request type**
   - Create interface `PayHereInitRequest`
   - Include order_id (string, required)
   - Include gateway (literal 'payhere', required)
   - Include return_url (string, optional)
   - Include cancel_url (string, optional)
   - Include metadata (Record<string, any>, optional)

4. **Define form data type**
   - Create interface `PayHereFormData`
   - Include merchant_id (string)
   - Include return_url (string)
   - Include cancel_url (string)
   - Include notify_url (string)
   - Include order_id (string)
   - Include items (string)
   - Include currency (string, default 'LKR')
   - Include amount (string, formatted to 2 decimals)
   - Include first_name (string)
   - Include last_name (string)
   - Include email (string)
   - Include phone (string)
   - Include address (string)
   - Include city (string)
   - Include country (string, default 'Sri Lanka')
   - Include hash (string, MD5 signature)
   - Include delivery_address (string, optional)
   - Include delivery_city (string, optional)
   - Include delivery_country (string, optional)
   - Include custom_1 (string, optional)
   - Include custom_2 (string, optional)

5. **Define payment initiation response type**
   - Create interface `PayHereInitResponse`
   - Include success (boolean)
   - Include payment_intent_id (string)
   - Include redirect_url (string)
   - Include form_data (PayHereFormData)
   - Include expires_at (string, ISO date)
   - Include error (string, optional)

6. **Define customer information type**
   - Create interface `PayHereCustomer`
   - Include first_name (string)
   - Include last_name (string)
   - Include email (string)
   - Include phone (string)
   - Include address (string)
   - Include city (string)
   - Include country (string)

7. **Define webhook notification type**
   - Create interface `PayHereWebhookPayload`
   - Include merchant_id (string)
   - Include order_id (string)
   - Include payhere_amount (string)
   - Include payhere_currency (string)
   - Include status_code (number)
   - Include md5sig (string)
   - Include payment_id (string)
   - Include method (string)
   - Include card_holder_name (string, optional)
   - Include card_no (string, optional)

8. **Define verification request type**
   - Create interface `PayHereVerifyRequest`
   - Include order_id (string)
   - Include payment_intent_id (string)

9. **Define verification response type**
   - Create interface `PayHereVerifyResponse`
   - Include success (boolean)
   - Include status (PayHereStatus)
   - Include payment_id (string, optional)
   - Include amount (number, optional)
   - Include currency (string, optional)
   - Include error (string, optional)

10. **Define refund request type**
    - Create interface `PayHereRefundRequest`
    - Include payment_id (string)
    - Include amount (number, optional for partial)
    - Include reason (string)

11. **Define configuration type**
    - Create interface `PayHereConfig`
    - Include merchant_id (string)
    - Include sandbox (boolean)
    - Include checkout_url (string)
    - Include verify_url (string, optional)

12. **Export all types**
    - Export all interfaces and enums
    - Add JSDoc comments for each type
    - Include usage examples in comments

### Type Structure Diagram

```
PayHere Type Hierarchy
│
├─ PayHereStatus (enum)
│  ├─ SUCCESS = 2
│  ├─ PENDING = 0
│  ├─ CANCELED = -1
│  ├─ FAILED = -2
│  └─ CHARGEDBACK = -3
│
├─ Request Types
│  ├─ PayHereInitRequest
│  │  ├─ order_id: string
│  │  ├─ gateway: 'payhere'
│  │  ├─ return_url?: string
│  │  └─ cancel_url?: string
│  │
│  ├─ PayHereVerifyRequest
│  │  ├─ order_id: string
│  │  └─ payment_intent_id: string
│  │
│  └─ PayHereRefundRequest
│     ├─ payment_id: string
│     ├─ amount?: number
│     └─ reason: string
│
├─ Response Types
│  ├─ PayHereInitResponse
│  │  ├─ success: boolean
│  │  ├─ payment_intent_id: string
│  │  ├─ redirect_url: string
│  │  ├─ form_data: PayHereFormData
│  │  └─ expires_at: string
│  │
│  └─ PayHereVerifyResponse
│     ├─ success: boolean
│     ├─ status: PayHereStatus
│     ├─ payment_id?: string
│     └─ amount?: number
│
├─ Data Types
│  ├─ PayHereFormData
│  │  ├─ merchant_id: string
│  │  ├─ order_id: string
│  │  ├─ amount: string
│  │  ├─ currency: string
│  │  ├─ hash: string
│  │  └─ ... (customer fields)
│  │
│  ├─ PayHereCustomer
│  │  ├─ first_name: string
│  │  ├─ last_name: string
│  │  ├─ email: string
│  │  └─ ... (address fields)
│  │
│  └─ PayHereWebhookPayload
│     ├─ order_id: string
│     ├─ status_code: number
│     ├─ md5sig: string
│     └─ ... (payment details)
│
└─ Config Types
   └─ PayHereConfig
      ├─ merchant_id: string
      ├─ sandbox: boolean
      └─ checkout_url: string
```

### Validation Rules

Document validation rules for each type:

**PayHereInitRequest Validation**
- order_id must be non-empty string
- gateway must be literal 'payhere'
- return_url must be valid URL if provided
- cancel_url must be valid URL if provided

**PayHereFormData Validation**
- amount must be formatted as decimal with 2 places
- currency must be 'LKR'
- email must be valid email format
- phone must be Sri Lankan format (+94XXXXXXXXX)
- hash must be 32-character uppercase hex string

**PayHereCustomer Validation**
- first_name must be 1-50 characters
- last_name must be 1-50 characters
- email must be valid email
- phone must match Sri Lankan format
- address must be non-empty
- city must be non-empty

**PayHereWebhookPayload Validation**
- status_code must be valid PayHereStatus value
- md5sig must be 32-character hex string
- payhere_amount must be numeric string
- order_id must match existing order

### Type Usage Examples

Provide examples in JSDoc comments:

**Example 1: Payment Initiation**
```
// Request
{
  order_id: "ORD-2026-00123",
  gateway: "payhere",
  return_url: "https://example.com/checkout/success",
  cancel_url: "https://example.com/checkout/cancel"
}

// Response
{
  success: true,
  payment_intent_id: "pi_1234567890",
  redirect_url: "https://sandbox.payhere.lk/pay",
  form_data: { ... },
  expires_at: "2026-01-31T10:15:00Z"
}
```

**Example 2: Webhook Payload**
```
{
  merchant_id: "1234567",
  order_id: "ORD-2026-00123",
  payhere_amount: "5000.00",
  payhere_currency: "LKR",
  status_code: 2,
  md5sig: "ABC123...",
  payment_id: "320012345678",
  method: "VISA"
}
```

**Example 3: Verification**
```
// Request
{
  order_id: "ORD-2026-00123",
  payment_intent_id: "pi_1234567890"
}

// Response
{
  success: true,
  status: PayHereStatus.SUCCESS,
  payment_id: "320012345678",
  amount: 5000.00,
  currency: "LKR"
}
```

### Expected Output

After completing this task:
- File `frontend/lib/payments/payhere/types.ts` created
- All PayHere types defined with JSDoc
- Enum for status codes created
- Request/response types complete
- Customer and webhook types defined
- Configuration types available
- Validation rules documented
- Usage examples included
- Types exported properly

---

## Task 82: Create PayHere API Client

### Overview
Create API client for PayHere payment operations. Implement functions to initiate payments, verify payment status, and process refunds. The client handles HTTP requests to backend payment API, includes proper error handling, and provides typed responses using types from Task 81.

### Dependencies
- Task 81: Create PayHere Types (types available)
- Backend payment API endpoints exist
- Fetch API or HTTP client available

### Instructions

1. **Create client file**
   - Navigate to `frontend/lib/payments/payhere/` directory
   - Create new file named `client.ts`
   - Import types from `./types`
   - Import HTTP client utility

2. **Define base configuration**
   - Create constant `PAYHERE_API_BASE` with value '/api/payments'
   - Create function `getPayHereConfig()` to fetch config from API
   - Include error handling for config fetching
   - Cache config after first fetch

3. **Create initiate payment function**
   - Create async function `initiatePayHerePayment`
   - Accept parameter `request: PayHereInitRequest`
   - Make POST request to `/api/payments/initiate/`
   - Include request body with JSON data
   - Include Content-Type header
   - Parse response as `PayHereInitResponse`
   - Throw typed error on failure

4. **Implement error handling**
   - Create custom error class `PayHereError`
   - Include error code property
   - Include error message property
   - Include original error property
   - Map HTTP status codes to error messages

5. **Create verify payment function**
   - Create async function `verifyPayHerePayment`
   - Accept parameter `request: PayHereVerifyRequest`
   - Make POST request to `/api/payments/verify/`
   - Include request body with JSON data
   - Parse response as `PayHereVerifyResponse`
   - Return verification result

6. **Create refund payment function**
   - Create async function `refundPayHerePayment`
   - Accept parameter `request: PayHereRefundRequest`
   - Make POST request to `/api/payments/refund/`
   - Include request body with JSON data
   - Parse response
   - Return refund result

7. **Add request validation**
   - Validate request objects before sending
   - Check required fields are present
   - Validate data types and formats
   - Throw validation error if invalid

8. **Implement retry logic**
   - Add retry for network failures
   - Maximum 3 retry attempts
   - Exponential backoff between retries
   - Only retry on network errors, not validation errors

9. **Add timeout handling**
   - Set request timeout to 30 seconds
   - Throw timeout error if exceeded
   - Cancel pending request on timeout

10. **Create response validation**
    - Validate API response structure
    - Check for required response fields
    - Validate response data types
    - Throw error if response invalid

11. **Add logging**
    - Log payment initiation attempts
    - Log API request/response (sanitize sensitive data)
    - Log errors with context
    - Use console.error for errors in development

12. **Export client functions**
    - Export all public functions
    - Export PayHereError class
    - Add JSDoc comments
    - Include usage examples

### API Client Structure

```
PayHere API Client
│
├─ Configuration
│  ├─ PAYHERE_API_BASE: string
│  └─ getPayHereConfig(): Promise<PayHereConfig>
│
├─ Payment Operations
│  ├─ initiatePayHerePayment(request)
│  │  ├─ Validate request
│  │  ├─ POST /api/payments/initiate/
│  │  ├─ Parse response
│  │  └─ Return PayHereInitResponse
│  │
│  ├─ verifyPayHerePayment(request)
│  │  ├─ Validate request
│  │  ├─ POST /api/payments/verify/
│  │  ├─ Parse response
│  │  └─ Return PayHereVerifyResponse
│  │
│  └─ refundPayHerePayment(request)
│     ├─ Validate request
│     ├─ POST /api/payments/refund/
│     ├─ Parse response
│     └─ Return refund result
│
├─ Error Handling
│  ├─ PayHereError (custom class)
│  ├─ Validation errors
│  ├─ Network errors
│  ├─ Timeout errors
│  └─ API errors
│
├─ Request Processing
│  ├─ Validation
│  ├─ HTTP request
│  ├─ Retry logic
│  ├─ Timeout handling
│  └─ Response parsing
│
└─ Utilities
   ├─ Request validation
   ├─ Response validation
   ├─ Error mapping
   └─ Logging
```

### API Endpoints

Document the backend endpoints used:

**Initiate Payment**
- Method: POST
- Path: `/api/payments/initiate/`
- Body: PayHereInitRequest
- Response: PayHereInitResponse
- Auth: Required (session or token)

**Verify Payment**
- Method: POST
- Path: `/api/payments/verify/`
- Body: PayHereVerifyRequest
- Response: PayHereVerifyResponse
- Auth: Required

**Refund Payment**
- Method: POST
- Path: `/api/payments/refund/`
- Body: PayHereRefundRequest
- Response: RefundResponse
- Auth: Required (admin only)

### Error Codes

Define error codes for PayHereError:

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Request validation failed |
| NETWORK_ERROR | Network request failed |
| TIMEOUT_ERROR | Request timed out |
| API_ERROR | Backend API error |
| INVALID_RESPONSE | Response validation failed |
| PAYMENT_FAILED | Payment processing failed |
| REFUND_FAILED | Refund processing failed |

### Client Usage Examples

Provide usage examples:

**Example 1: Initiate Payment**
```
try {
  const response = await initiatePayHerePayment({
    order_id: "ORD-2026-00123",
    gateway: "payhere",
    return_url: "/checkout/success",
    cancel_url: "/checkout/cancel"
  });
  
  // Redirect to PayHere
  redirectToPayHere(response.form_data);
} catch (error) {
  if (error instanceof PayHereError) {
    console.error(error.code, error.message);
  }
}
```

**Example 2: Verify Payment**
```
const result = await verifyPayHerePayment({
  order_id: "ORD-2026-00123",
  payment_intent_id: "pi_1234567890"
});

if (result.success && result.status === PayHereStatus.SUCCESS) {
  // Payment successful
  showSuccessMessage();
}
```

**Example 3: Error Handling**
```
try {
  await initiatePayHerePayment(request);
} catch (error) {
  if (error instanceof PayHereError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        // Handle validation error
        break;
      case 'NETWORK_ERROR':
        // Retry or show offline message
        break;
      case 'PAYMENT_FAILED':
        // Show payment error
        break;
    }
  }
}
```

### Expected Output

After completing this task:
- File `frontend/lib/payments/payhere/client.ts` created
- PayHereError class defined
- initiatePayHerePayment function implemented
- verifyPayHerePayment function implemented
- refundPayHerePayment function implemented
- Request validation added
- Error handling complete
- Retry logic implemented
- Timeout handling added
- Response validation included
- Logging added
- Functions exported with JSDoc

---

## Task 83: Create Initiate Payment Hook

### Overview
Create React hook `usePayHerePayment` for payment initiation. Implement using TanStack Query mutation for state management, loading states, error handling, and success callbacks. The hook abstracts payment API calls and provides clean interface for components.

### Dependencies
- Task 82: Create PayHere API Client (client available)
- TanStack Query installed and configured
- React hooks available

### Instructions

1. **Create hooks file**
   - Navigate to `frontend/lib/payments/payhere/` directory
   - Create new file named `hooks.ts`
   - Import types from `./types`
   - Import client functions from `./client`
   - Import TanStack Query hooks

2. **Define hook options interface**
   - Create interface `UsePayHerePaymentOptions`
   - Include onSuccess callback (optional)
   - Include onError callback (optional)
   - Include onSettled callback (optional)
   - Include retry configuration (optional)

3. **Create usePayHerePayment hook**
   - Accept parameter `options?: UsePayHerePaymentOptions`
   - Use `useMutation` from TanStack Query
   - Set mutation function to `initiatePayHerePayment`
   - Include mutation key `['payhere', 'initiate']`

4. **Implement mutation configuration**
   - Set onSuccess handler to call options.onSuccess
   - Set onError handler to call options.onError
   - Set onSettled handler to call options.onSettled
   - Configure retry based on options

5. **Add success handling**
   - Call onSuccess callback with response
   - Log successful initiation
   - Return payment intent data

6. **Add error handling**
   - Call onError callback with error
   - Log error with context
   - Transform error for display

7. **Create initiate function**
   - Wrap mutate function with type safety
   - Accept PayHereInitRequest parameter
   - Return void (async operation)
   - Include JSDoc documentation

8. **Create initiateAsync function**
   - Wrap mutateAsync function
   - Accept PayHereInitRequest parameter
   - Return Promise<PayHereInitResponse>
   - Allow awaiting result

9. **Expose loading states**
   - Return isLoading from mutation
   - Return isPending from mutation
   - Return isSuccess from mutation
   - Return isError from mutation

10. **Expose data and error**
    - Return data (PayHereInitResponse or undefined)
    - Return error (Error or null)
    - Include type safety

11. **Add reset function**
    - Expose reset function from mutation
    - Allows resetting mutation state
    - Clear data and error

12. **Export hook**
    - Export usePayHerePayment hook
    - Export UsePayHerePaymentOptions interface
    - Add JSDoc comments
    - Include usage examples

### Hook Structure

```
usePayHerePayment Hook
│
├─ Input
│  └─ options: UsePayHerePaymentOptions
│     ├─ onSuccess?: (data) => void
│     ├─ onError?: (error) => void
│     ├─ onSettled?: () => void
│     └─ retry?: number | boolean
│
├─ Mutation Setup
│  ├─ useMutation configuration
│  ├─ Mutation key: ['payhere', 'initiate']
│  ├─ Mutation function: initiatePayHerePayment
│  └─ Callbacks: onSuccess, onError, onSettled
│
├─ Return Object
│  ├─ initiate: (request) => void
│  ├─ initiateAsync: (request) => Promise<response>
│  ├─ isLoading: boolean
│  ├─ isPending: boolean
│  ├─ isSuccess: boolean
│  ├─ isError: boolean
│  ├─ data: PayHereInitResponse | undefined
│  ├─ error: Error | null
│  └─ reset: () => void
│
└─ Internal Logic
   ├─ Call API client
   ├─ Handle success
   ├─ Handle error
   └─ Update state
```

### Hook Usage Examples

Provide usage examples:

**Example 1: Basic Usage**
```
const {
  initiate,
  isLoading,
  data,
  error
} = usePayHerePayment();

const handlePayment = () => {
  initiate({
    order_id: orderId,
    gateway: 'payhere'
  });
};

// In component
<button onClick={handlePayment} disabled={isLoading}>
  {isLoading ? 'Processing...' : 'Pay with PayHere'}
</button>
```

**Example 2: With Callbacks**
```
const { initiate } = usePayHerePayment({
  onSuccess: (response) => {
    console.log('Payment initiated:', response.payment_intent_id);
    redirectToPayHere(response.form_data);
  },
  onError: (error) => {
    console.error('Payment failed:', error);
    showErrorToast('Payment initiation failed');
  }
});
```

**Example 3: Async/Await**
```
const { initiateAsync, isLoading } = usePayHerePayment();

const handlePayment = async () => {
  try {
    const response = await initiateAsync({
      order_id: orderId,
      gateway: 'payhere',
      return_url: '/checkout/success',
      cancel_url: '/checkout/cancel'
    });
    
    // Redirect to PayHere
    redirectToPayHere(response.form_data);
  } catch (error) {
    // Handle error
    showErrorMessage(error.message);
  }
};
```

**Example 4: With Retry**
```
const { initiate } = usePayHerePayment({
  retry: 3, // Retry up to 3 times
  onError: (error, variables, context) => {
    if (context.failureCount === 3) {
      // Final failure after 3 retries
      showErrorToast('Unable to initiate payment');
    }
  }
});
```

### State Management

Document state flow:

**Initial State**
- isLoading: false
- isPending: false
- isSuccess: false
- isError: false
- data: undefined
- error: null

**Loading State**
- isLoading: true
- isPending: true
- data: undefined
- error: null

**Success State**
- isLoading: false
- isSuccess: true
- data: PayHereInitResponse
- error: null

**Error State**
- isLoading: false
- isError: true
- data: undefined
- error: Error

### Integration with TanStack Query

**Query Client Setup**
Ensure query client is configured:
- Retry configuration
- Cache time settings
- Stale time settings
- Error handling

**Mutation Key**
Use consistent mutation key:
- `['payhere', 'initiate']` for payment initiation
- Allows query invalidation
- Enables cache management

### Expected Output

After completing this task:
- File `frontend/lib/payments/payhere/hooks.ts` created
- usePayHerePayment hook implemented
- UsePayHerePaymentOptions interface defined
- TanStack Query mutation configured
- Success/error callbacks supported
- Loading states exposed
- Data and error exposed
- Reset function available
- Async variant available
- JSDoc comments added
- Usage examples documented
- Hook exported

---

## Task 84: Create Redirect Handler

### Overview
Create redirect handler to POST form data to PayHere checkout. Implement function that dynamically creates hidden form, populates with payment data, and auto-submits to redirect user to PayHere's hosted payment page. Handle form creation, field population, and cleanup.

### Dependencies
- Task 83: Create Initiate Payment Hook (hook available)
- Task 81: Create PayHere Types (PayHereFormData type available)
- DOM manipulation available

### Instructions

1. **Create redirect utility file**
   - Navigate to `frontend/lib/payments/payhere/` directory
   - Add to existing file or create `redirect.ts`
   - Import PayHereFormData type

2. **Create redirectToPayHere function**
   - Accept parameter `formData: PayHereFormData`
   - Create hidden HTML form element
   - Set form method to 'POST'
   - Set form action to PayHere checkout URL

3. **Determine PayHere URL**
   - Check if sandbox mode from formData or config
   - Use `https://sandbox.payhere.lk/pay` for sandbox
   - Use `https://www.payhere.lk/pay` for production
   - Extract from formData.checkout_url if provided

4. **Create form fields**
   - Loop through formData properties
   - Create hidden input for each field
   - Set input name to property name
   - Set input value to property value
   - Append input to form

5. **Handle optional fields**
   - Skip undefined or null fields
   - Skip empty string fields
   - Only add fields with values

6. **Add form to document**
   - Append form to document.body
   - Ensure form is hidden (display: none)
   - Position form off-screen as backup

7. **Submit form**
   - Call form.submit() to POST to PayHere
   - Browser will navigate to PayHere page
   - Form POST includes all payment data

8. **Clean up form**
   - Remove form from document after submit
   - Use setTimeout for cleanup (100ms delay)
   - Prevent memory leaks

9. **Add error handling**
   - Wrap in try-catch block
   - Catch form creation errors
   - Catch submit errors
   - Log errors to console
   - Throw error for caller handling

10. **Create form validation**
    - Validate required fields present
    - Check merchant_id exists
    - Check order_id exists
    - Check amount is valid
    - Check hash is present

11. **Add logging**
    - Log redirect initiation
    - Log PayHere URL being used
    - Log form data (sanitize sensitive fields)
    - Log any errors

12. **Export function**
    - Export redirectToPayHere function
    - Add JSDoc comments
    - Include usage examples

### Redirect Flow Diagram

```
redirectToPayHere() Flow
│
├─ 1. Validate Form Data
│  ├─ Check required fields
│  ├─ Validate merchant_id
│  ├─ Validate order_id
│  ├─ Validate amount
│  └─ Validate hash
│
├─ 2. Determine URL
│  ├─ Check sandbox flag
│  ├─ Sandbox: sandbox.payhere.lk
│  └─ Production: www.payhere.lk
│
├─ 3. Create Form
│  ├─ Create <form> element
│  ├─ Set method='POST'
│  ├─ Set action to PayHere URL
│  └─ Set style display='none'
│
├─ 4. Populate Fields
│  ├─ Loop formData properties
│  ├─ Create <input type="hidden">
│  ├─ Set name and value
│  └─ Append to form
│
├─ 5. Submit Form
│  ├─ Append form to body
│  ├─ Call form.submit()
│  └─ Browser redirects to PayHere
│
└─ 6. Cleanup
   ├─ setTimeout 100ms
   ├─ Remove form from body
   └─ Complete
```

### Form Structure

Document the HTML form structure:

```
<form method="POST" action="https://sandbox.payhere.lk/pay" style="display:none">
  <input type="hidden" name="merchant_id" value="1234567" />
  <input type="hidden" name="return_url" value="https://..." />
  <input type="hidden" name="cancel_url" value="https://..." />
  <input type="hidden" name="notify_url" value="https://..." />
  <input type="hidden" name="order_id" value="ORD-2026-00123" />
  <input type="hidden" name="items" value="Order #123" />
  <input type="hidden" name="currency" value="LKR" />
  <input type="hidden" name="amount" value="5000.00" />
  <input type="hidden" name="first_name" value="John" />
  <input type="hidden" name="last_name" value="Doe" />
  <input type="hidden" name="email" value="john@example.com" />
  <input type="hidden" name="phone" value="+94771234567" />
  <input type="hidden" name="address" value="123 Main St" />
  <input type="hidden" name="city" value="Colombo" />
  <input type="hidden" name="country" value="Sri Lanka" />
  <input type="hidden" name="hash" value="ABC123..." />
  <!-- Optional fields -->
  <input type="hidden" name="custom_1" value="..." />
  <input type="hidden" name="custom_2" value="..." />
</form>
```

### Required Form Fields

List required fields that must be present:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| merchant_id | string | Yes | PayHere merchant ID |
| return_url | string | Yes | Success redirect URL |
| cancel_url | string | Yes | Cancel redirect URL |
| notify_url | string | Yes | Webhook URL |
| order_id | string | Yes | Unique order ID |
| items | string | Yes | Item description |
| currency | string | Yes | Currency (LKR) |
| amount | string | Yes | Amount (2 decimals) |
| first_name | string | Yes | Customer first name |
| last_name | string | Yes | Customer last name |
| email | string | Yes | Customer email |
| phone | string | Yes | Customer phone |
| address | string | Yes | Customer address |
| city | string | Yes | Customer city |
| country | string | Yes | Customer country |
| hash | string | Yes | MD5 signature |

### Usage Examples

Provide usage examples:

**Example 1: Basic Redirect**
```
const { initiateAsync } = usePayHerePayment();

const handlePayment = async () => {
  try {
    const response = await initiateAsync({
      order_id: orderId,
      gateway: 'payhere'
    });
    
    // Redirect to PayHere
    redirectToPayHere(response.form_data);
  } catch (error) {
    console.error('Redirect failed:', error);
  }
};
```

**Example 2: With Loading State**
```
const [isRedirecting, setIsRedirecting] = useState(false);

const handlePayment = async () => {
  setIsRedirecting(true);
  try {
    const response = await initiateAsync({...});
    redirectToPayHere(response.form_data);
  } catch (error) {
    setIsRedirecting(false);
    showError(error.message);
  }
};
```

**Example 3: Direct Call**
```
// If you already have form data
const formData: PayHereFormData = {
  merchant_id: '1234567',
  order_id: 'ORD-123',
  amount: '5000.00',
  currency: 'LKR',
  hash: 'ABC123...',
  // ... other fields
};

redirectToPayHere(formData);
// User is redirected to PayHere
```

### Error Handling

Document error scenarios:

**Missing Required Fields**
- Validate before creating form
- Throw error with field name
- Prevent redirect

**Invalid Form Data**
- Validate data types
- Validate formats (email, phone)
- Throw descriptive error

**DOM Manipulation Errors**
- Catch document.createElement errors
- Catch form.submit errors
- Log and re-throw

**Network Issues**
- Cannot prevent network errors during redirect
- User will see PayHere error page
- PayHere handles network issues

### Expected Output

After completing this task:
- redirectToPayHere function implemented
- Form validation added
- Form creation logic complete
- Field population implemented
- Auto-submit working
- Cleanup logic added
- Error handling included
- Logging added
- Function exported
- JSDoc comments added
- Usage examples documented

---

## Task 85: Create Success Page

### Overview
Create payment success page displayed after successful PayHere payment. Implement order confirmation display, payment verification, order details, receipt generation, and next steps. Page verifies payment status with backend before showing success message.

### Dependencies
- Task 84: Create Redirect Handler (redirect working)
- Order verification API exists
- Order details API exists

### Instructions

1. **Create success page file**
   - Navigate to `frontend/app/(storefront)/checkout/success/` directory
   - Create file `page.tsx`
   - Set up Next.js page component

2. **Define page component**
   - Create async server component `SuccessPage`
   - Extract query parameters from URL
   - Get order_id from searchParams
   - Get payment_intent_id from searchParams

3. **Implement verification logic**
   - Call backend API to verify payment
   - Use verifyPayHerePayment from client
   - Check payment status is SUCCESS
   - Throw error if verification fails

4. **Fetch order details**
   - Call order details API with order_id
   - Get order information
   - Get payment information
   - Get customer information

5. **Create page layout**
   - Create success page container
   - Add success icon or checkmark
   - Add "Payment Successful" heading
   - Add order confirmation message

6. **Display order summary**
   - Show order number
   - Show order date
   - Show payment method (PayHere)
   - Show payment ID from PayHere
   - Show total amount paid

7. **Display order items**
   - List all order items
   - Show item name
   - Show quantity
   - Show price
   - Show item subtotal

8. **Display customer information**
   - Show customer name
   - Show email address
   - Show phone number
   - Show delivery address

9. **Add order actions**
   - Add "View Order Details" button
   - Add "Download Receipt" button
   - Add "Continue Shopping" button
   - Add "Track Order" button (if applicable)

10. **Implement email confirmation**
    - Trigger email send on page load (if not sent)
    - Show "Confirmation email sent to [email]"
    - Handle email send errors gracefully

11. **Add loading state**
    - Show loading spinner during verification
    - Show "Verifying payment..." message
    - Prevent premature rendering

12. **Add error handling**
    - Handle verification failure
    - Handle order not found
    - Show appropriate error message
    - Provide retry option or contact support

### Success Page Structure

```
Success Page Layout
│
├─ Header Section
│  ├─ Success icon (✓ checkmark)
│  ├─ "Payment Successful!" heading
│  └─ "Thank you for your order" message
│
├─ Order Summary Section
│  ├─ Order number
│  ├─ Order date
│  ├─ Payment method
│  ├─ Payment ID
│  └─ Total amount
│
├─ Order Items Section
│  ├─ Item 1
│  │  ├─ Name
│  │  ├─ Quantity
│  │  ├─ Price
│  │  └─ Subtotal
│  ├─ Item 2
│  └─ ...
│
├─ Customer Information Section
│  ├─ Name
│  ├─ Email
│  ├─ Phone
│  └─ Delivery address
│
├─ Next Steps Section
│  ├─ Email confirmation message
│  ├─ Order tracking info
│  └─ Estimated delivery date
│
└─ Action Buttons Section
   ├─ View Order Details
   ├─ Download Receipt
   ├─ Track Order
   └─ Continue Shopping
```

### URL Parameters

Document expected URL parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | string | Yes | Order identifier |
| payment_intent_id | string | Yes | Payment intent ID |
| payhere_payment_id | string | No | PayHere payment ID |
| status | string | No | Payment status (for display) |

**Example URL:**
```
/checkout/success?order_id=ORD-2026-00123&payment_intent_id=pi_1234567890&status=success
```

### Verification Flow

```
Success Page Load
│
├─ 1. Extract Parameters
│  ├─ Get order_id
│  ├─ Get payment_intent_id
│  └─ Validate parameters present
│
├─ 2. Verify Payment
│  ├─ Call verifyPayHerePayment()
│  ├─ Check status === SUCCESS
│  └─ Get payment details
│
├─ 3. Fetch Order
│  ├─ Call order details API
│  ├─ Get order data
│  └─ Get customer data
│
├─ 4. Render Success
│  ├─ Show success message
│  ├─ Display order summary
│  ├─ Display order items
│  └─ Display customer info
│
└─ 5. Post-Actions
   ├─ Send confirmation email
   ├─ Track conversion event
   └─ Clear cart
```

### Page Content

**Success Message**
- "Payment Successful!"
- "Thank you for your order"
- "Your order has been confirmed"
- "Order number: [ORDER_ID]"

**Confirmation Message**
- "A confirmation email has been sent to [EMAIL]"
- "You will receive order updates at this email address"
- "Please check your spam folder if you don't see the email"

**Next Steps**
- "What happens next?"
- "We're processing your order"
- "You'll receive a shipping confirmation when your order ships"
- "Estimated delivery: [DATE]"

### Component Example

Basic structure (not full code):

```
async function SuccessPage({ searchParams }) {
  // Extract parameters
  const { order_id, payment_intent_id } = searchParams;
  
  // Verify payment
  const paymentResult = await verifyPayment(order_id, payment_intent_id);
  
  if (!paymentResult.success) {
    // Handle verification failure
    return <ErrorDisplay />;
  }
  
  // Fetch order details
  const order = await fetchOrder(order_id);
  
  return (
    <div className="success-page">
      <SuccessIcon />
      <h1>Payment Successful!</h1>
      <OrderSummary order={order} />
      <OrderItems items={order.items} />
      <CustomerInfo customer={order.customer} />
      <ActionButtons orderId={order_id} />
    </div>
  );
}
```

### Styling Guidelines

**Success Icon**
- Large checkmark icon
- Green color (#10B981 or similar)
- Animated appearance (fade in or scale)

**Heading**
- Large, bold font
- Positive, friendly tone
- Clear hierarchy

**Order Summary**
- Clean, organized layout
- Important info highlighted
- Easy to scan

**Action Buttons**
- Clear call-to-action
- Primary: "View Order Details"
- Secondary: "Continue Shopping"
- Distinct visual styles

### Expected Output

After completing this task:
- File `frontend/app/(storefront)/checkout/success/page.tsx` created
- Success page component implemented
- Payment verification added
- Order details fetched
- Order summary displayed
- Order items displayed
- Customer info displayed
- Action buttons added
- Email confirmation triggered
- Error handling included
- Loading state implemented
- Styling applied
- Page exported

---

## Task 86: Create Cancel Page

### Overview
Create payment cancellation page displayed when user cancels PayHere payment. Implement cancellation message, order preservation, retry option, and return to cart. Page explains cancellation and provides clear next steps for customer.

### Dependencies
- Task 84: Create Redirect Handler (redirect working)
- Order API exists
- Cart API exists

### Instructions

1. **Create cancel page file**
   - Navigate to `frontend/app/(storefront)/checkout/cancel/` directory
   - Create file `page.tsx`
   - Set up Next.js page component

2. **Define page component**
   - Create async server component `CancelPage`
   - Extract query parameters from URL
   - Get order_id from searchParams
   - Get reason from searchParams (optional)

3. **Fetch order details**
   - Call order details API with order_id (if provided)
   - Get order information
   - Get cart information
   - Handle missing order gracefully

4. **Create page layout**
   - Create cancel page container
   - Add warning icon or info icon
   - Add "Payment Canceled" heading
   - Add cancellation explanation message

5. **Display cancellation message**
   - Explain payment was canceled
   - Assure order is still saved
   - Explain no charges were made
   - Provide reassurance

6. **Show order information**
   - Display order number (if available)
   - Show order total
   - List order items (summary)
   - Show order status (pending payment)

7. **Add retry payment section**
   - Add "Try Again" button
   - Redirect to checkout page
   - Pre-populate order information
   - Allow selecting different payment method

8. **Add alternative actions**
   - Add "Return to Cart" button
   - Add "Edit Order" button
   - Add "Continue Shopping" button
   - Add "Contact Support" button

9. **Implement order preservation**
   - Ensure order is not deleted
   - Keep order in pending status
   - Preserve cart for retry
   - Show order expiry time (if applicable)

10. **Add helpful information**
    - Show why payment might be canceled
    - Show alternative payment methods
    - Show customer support contact
    - Show FAQs link

11. **Implement logging**
    - Log cancellation event
    - Track cancellation reason
    - Record for analytics
    - Help improve checkout flow

12. **Add SEO and meta tags**
    - Set page title
    - Set meta description
    - Prevent indexing (noindex)
    - Set robots meta tag

### Cancel Page Structure

```
Cancel Page Layout
│
├─ Header Section
│  ├─ Info icon (ℹ️ or ⚠️)
│  ├─ "Payment Canceled" heading
│  └─ "No worries!" subheading
│
├─ Explanation Section
│  ├─ Payment canceled message
│  ├─ No charges made assurance
│  ├─ Order still saved message
│  └─ Order expiry information
│
├─ Order Summary Section (if order exists)
│  ├─ Order number
│  ├─ Order total
│  ├─ Item count
│  └─ Order status
│
├─ Retry Section
│  ├─ "Ready to complete your order?" heading
│  ├─ "Try Again" button (primary)
│  └─ Payment method options
│
├─ Help Section
│  ├─ "Why did this happen?" FAQ
│  ├─ Common reasons
│  ├─ Alternative payment methods
│  └─ Contact support link
│
└─ Action Buttons Section
   ├─ Try Again (primary)
   ├─ Return to Cart
   ├─ Edit Order
   └─ Continue Shopping
```

### URL Parameters

Document expected URL parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | string | No | Order identifier |
| reason | string | No | Cancellation reason |
| source | string | No | Cancel source (user/timeout) |

**Example URLs:**
```
/checkout/cancel?order_id=ORD-2026-00123
/checkout/cancel?order_id=ORD-2026-00123&reason=user_canceled
/checkout/cancel
```

### Cancellation Messages

**Primary Message**
- "Payment Canceled"
- "You canceled the payment process"
- "No charges were made to your account"

**Reassurance Message**
- "Don't worry, your order is still saved"
- "You can try again or choose a different payment method"
- "Your cart items are still reserved"

**Expiry Warning (if applicable)**
- "Your order will be held for 30 minutes"
- "Complete your payment before [TIME] to keep your order"

### Cancellation Reasons

Document common cancellation reasons:

| Reason | Description | Message |
|--------|-------------|---------|
| user_canceled | User clicked cancel | "You canceled the payment" |
| timeout | Payment session expired | "Payment session timed out" |
| bank_decline | Bank declined payment | "Payment was declined" |
| insufficient_funds | Not enough funds | "Insufficient funds" |
| invalid_card | Card details invalid | "Card details were invalid" |
| unknown | Unknown reason | "Payment could not be processed" |

### Component Example

Basic structure (not full code):

```
async function CancelPage({ searchParams }) {
  // Extract parameters
  const { order_id, reason } = searchParams;
  
  // Fetch order if order_id provided
  let order = null;
  if (order_id) {
    order = await fetchOrder(order_id);
  }
  
  return (
    <div className="cancel-page">
      <InfoIcon />
      <h1>Payment Canceled</h1>
      <p>No charges were made to your account.</p>
      
      {order && (
        <OrderSummary order={order} />
      )}
      
      <RetrySection order={order} />
      <HelpSection />
      <ActionButtons orderId={order_id} />
    </div>
  );
}
```

### Action Button Behaviors

**Try Again Button**
- Redirect to checkout page
- Pass order_id as parameter
- Pre-select PayHere or allow method selection
- Start new payment flow

**Return to Cart Button**
- Redirect to cart page
- Show cart items
- Allow editing quantities
- Allow proceeding to checkout

**Edit Order Button**
- Redirect to order edit page
- Allow changing items
- Allow changing quantities
- Allow changing delivery details

**Continue Shopping Button**
- Redirect to products page or home
- Keep cart items
- Allow adding more items
- Preserve order

### Helpful Information

**Why Payment Canceled**
- User clicked "Cancel" on PayHere page
- User closed browser/tab
- Payment session expired
- Bank declined payment
- Network connection lost

**What Happens Next**
- Order remains in pending status
- Cart items are preserved
- Can retry payment anytime
- Order expires after 30 minutes (configurable)

**Alternative Options**
- Try different card
- Try different payment method
- Contact support for help
- Request bank transfer instructions

### Expected Output

After completing this task:
- File `frontend/app/(storefront)/checkout/cancel/page.tsx` created
- Cancel page component implemented
- Cancellation message displayed
- Order information shown (if available)
- Retry payment section added
- Alternative actions provided
- Help section included
- Order preservation ensured
- Logging implemented
- Action buttons added
- Styling applied
- Meta tags set
- Page exported

---

## Task 87: Create PayHere Button Component

### Overview
Create reusable PayHere payment button component. Implement button with loading states, error handling, success callbacks, and proper styling. Component integrates with usePayHerePayment hook and redirectToPayHere function to provide complete payment flow.

### Dependencies
- Task 83: Create Initiate Payment Hook (hook available)
- Task 84: Create Redirect Handler (redirect available)
- React component setup available

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create file `PayHereButton.tsx`
   - Import required dependencies

2. **Define component props**
   - Create interface `PayHereButtonProps`
   - Include orderId (string, required)
   - Include amount (number, required)
   - Include onSuccess callback (optional)
   - Include onError callback (optional)
   - Include disabled (boolean, optional)
   - Include className (string, optional)
   - Include children (ReactNode, optional for custom text)

3. **Create component**
   - Create functional component `PayHereButton`
   - Accept props `PayHereButtonProps`
   - Use usePayHerePayment hook
   - Use redirectToPayHere function

4. **Implement click handler**
   - Create handlePayment function
   - Call initiateAsync from hook
   - Pass orderId and gateway='payhere'
   - Handle response
   - Call redirectToPayHere with form_data

5. **Add success handling**
   - Call onSuccess callback if provided
   - Log successful initiation
   - Redirect to PayHere automatically

6. **Add error handling**
   - Catch errors from initiateAsync
   - Call onError callback if provided
   - Show error message (toast or inline)
   - Log error for debugging

7. **Implement loading state**
   - Get isLoading from hook
   - Disable button when loading
   - Show loading spinner
   - Change button text to "Processing..."

8. **Create button UI**
   - Use button element
   - Apply styling classes
   - Include PayHere logo or icon (optional)
   - Make button visually appealing

9. **Add disabled state handling**
   - Combine disabled prop with isLoading
   - Disable button when disabled prop is true
   - Disable button when isLoading is true
   - Apply disabled styling

10. **Implement custom content**
    - Support children prop for custom text
    - Default text: "Pay with PayHere"
    - Loading text: "Processing Payment..."
    - Allow full customization

11. **Add accessibility**
    - Add aria-label attribute
    - Add aria-disabled when disabled
    - Add aria-busy when loading
    - Support keyboard navigation
    - Add focus styles

12. **Export component**
    - Export PayHereButton component
    - Export PayHereButtonProps interface
    - Add JSDoc comments
    - Include usage examples

### Component Structure

```
PayHereButton Component
│
├─ Props
│  ├─ orderId: string
│  ├─ amount: number
│  ├─ onSuccess?: () => void
│  ├─ onError?: (error) => void
│  ├─ disabled?: boolean
│  ├─ className?: string
│  └─ children?: ReactNode
│
├─ State
│  ├─ isLoading (from hook)
│  ├─ error (from hook)
│  └─ data (from hook)
│
├─ Handlers
│  └─ handlePayment: async () => void
│     ├─ Call initiateAsync()
│     ├─ Get form_data
│     ├─ Call redirectToPayHere()
│     ├─ Handle success
│     └─ Handle error
│
├─ Render
│  └─ <button>
│     ├─ disabled={disabled || isLoading}
│     ├─ onClick={handlePayment}
│     ├─ className={...}
│     ├─ aria-label
│     └─ Content
│        ├─ Loading: Spinner + "Processing..."
│        └─ Idle: "Pay with PayHere" or children
│
└─ Export
   └─ PayHereButton component
```

### Button States

Document button states:

**Idle State**
- Button enabled
- Default text shown
- Cursor pointer
- Default styling
- Ready for click

**Loading State**
- Button disabled
- Loading spinner shown
- Text: "Processing Payment..."
- Cursor not-allowed
- Dimmed styling

**Disabled State**
- Button disabled
- Default text shown
- Cursor not-allowed
- Dimmed styling
- Cannot click

**Error State** (optional)
- Button enabled again
- Error message shown (inline or toast)
- Error styling (red border)
- Retry available

### Component Usage Examples

Provide usage examples:

**Example 1: Basic Usage**
```
<PayHereButton
  orderId="ORD-2026-00123"
  amount={5000}
/>
```

**Example 2: With Callbacks**
```
<PayHereButton
  orderId={orderId}
  amount={totalAmount}
  onSuccess={() => {
    console.log('Payment initiated successfully');
  }}
  onError={(error) => {
    toast.error(`Payment failed: ${error.message}`);
  }}
/>
```

**Example 3: Custom Text**
```
<PayHereButton orderId={orderId} amount={total}>
  <span>Complete Payment (LKR {total})</span>
</PayHereButton>
```

**Example 4: With Conditional Disable**
```
<PayHereButton
  orderId={orderId}
  amount={total}
  disabled={!termsAccepted}
  onError={(error) => {
    if (!termsAccepted) {
      toast.error('Please accept terms and conditions');
    }
  }}
/>
```

**Example 5: Custom Styling**
```
<PayHereButton
  orderId={orderId}
  amount={total}
  className="w-full bg-blue-600 hover:bg-blue-700"
/>
```

### Styling Guidelines

**Button Appearance**
- Background: PayHere brand color or primary color
- Text: White or contrasting color
- Border: Rounded corners
- Padding: Comfortable click target
- Font: Medium weight, readable size

**Hover State**
- Darken background slightly
- Show subtle transition
- Change cursor to pointer

**Disabled State**
- Reduce opacity to 0.6
- Change cursor to not-allowed
- Remove hover effects

**Loading State**
- Show spinner icon
- Keep button same size
- Animate spinner rotation

### Accessibility Features

**ARIA Attributes**
```
aria-label="Pay with PayHere"
aria-disabled={disabled || isLoading}
aria-busy={isLoading}
role="button"
```

**Keyboard Support**
- Tab to focus button
- Enter/Space to trigger payment
- Focus visible indicator
- Focus ring on keyboard focus

**Screen Reader Support**
- Announce button purpose
- Announce loading state
- Announce errors
- Provide helpful context

### Component Example

Basic structure (not full code):

```
interface PayHereButtonProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function PayHereButton({
  orderId,
  amount,
  onSuccess,
  onError,
  disabled = false,
  className,
  children
}: PayHereButtonProps) {
  const { initiateAsync, isLoading } = usePayHerePayment({
    onSuccess: (response) => {
      redirectToPayHere(response.form_data);
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    }
  });
  
  const handlePayment = async () => {
    try {
      await initiateAsync({
        order_id: orderId,
        gateway: 'payhere'
      });
    } catch (error) {
      // Error handled by hook
    }
  };
  
  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={className}
      aria-label="Pay with PayHere"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner />
          Processing Payment...
        </>
      ) : (
        children || 'Pay with PayHere'
      )}
    </button>
  );
}
```

### Expected Output

After completing this task:
- File `frontend/components/checkout/PayHereButton.tsx` created
- PayHereButton component implemented
- PayHereButtonProps interface defined
- Click handler implemented
- Success callback supported
- Error callback supported
- Loading state implemented
- Disabled state handled
- Custom content supported
- Accessibility features added
- Styling applied
- Component exported
- Usage examples documented

---

## Task 88: Create Loading State

### Overview
Create comprehensive loading state UI for PayHere payment processing. Implement loading indicator, progress messages, timeout handling, and user feedback during payment initiation and redirect. Provide clear visual feedback to prevent user confusion during asynchronous operations.

### Dependencies
- Task 87: Create PayHere Button (button component exists)
- Task 83: Create Initiate Payment Hook (hook available)
- Loading spinner component available

### Instructions

1. **Create loading state component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create file `PayHereLoadingState.tsx`
   - Import spinner or loading indicator

2. **Define component props**
   - Create interface `PayHereLoadingStateProps`
   - Include message (string, optional)
   - Include progress (number 0-100, optional)
   - Include onCancel (callback, optional)
   - Include timeout (number in ms, optional)

3. **Create loading component**
   - Create functional component `PayHereLoadingState`
   - Accept props `PayHereLoadingStateProps`
   - Display loading indicator
   - Display progress message

4. **Implement loading indicator**
   - Use spinner component
   - Or create CSS spinner animation
   - Center on screen or within container
   - Make visually prominent

5. **Add progress messages**
   - Default: "Processing payment..."
   - After 2s: "Connecting to PayHere..."
   - After 5s: "Almost ready..."
   - After 10s: "This is taking longer than expected..."
   - Support custom messages via props

6. **Implement timeout handling**
   - Accept timeout prop (default 30s)
   - Start timer when component mounts
   - Show timeout message after timeout
   - Call onCancel callback if provided

7. **Add cancel button** (optional)
   - Show "Cancel" button after 10 seconds
   - Call onCancel callback on click
   - Disable if redirect already started
   - Confirm before canceling

8. **Create overlay variant**
   - Full-screen overlay option
   - Semi-transparent background
   - Block user interaction
   - Show loading in center

9. **Create inline variant**
   - Inline loading indicator
   - No overlay
   - Smaller size
   - For button loading state

10. **Add animation**
    - Fade in animation on mount
    - Spinner rotation animation
    - Progress bar animation (if used)
    - Smooth transitions

11. **Implement accessibility**
    - Add role="status" or role="alert"
    - Add aria-live="polite"
    - Add aria-busy="true"
    - Announce loading messages to screen readers

12. **Export component**
    - Export PayHereLoadingState component
    - Export PayHereLoadingStateProps interface
    - Add JSDoc comments
    - Include usage examples

### Loading State Structure

```
PayHereLoadingState Component
│
├─ Props
│  ├─ message?: string
│  ├─ progress?: number (0-100)
│  ├─ onCancel?: () => void
│  ├─ timeout?: number (milliseconds)
│  └─ variant?: 'overlay' | 'inline'
│
├─ State
│  ├─ currentMessage: string
│  ├─ timeElapsed: number
│  └─ timedOut: boolean
│
├─ Effects
│  ├─ Update message based on elapsed time
│  ├─ Check for timeout
│  └─ Cleanup on unmount
│
├─ Render (Overlay Variant)
│  └─ <div className="overlay">
│     ├─ <div className="loading-container">
│     │  ├─ <Spinner />
│     │  ├─ <p>{currentMessage}</p>
│     │  ├─ <ProgressBar /> (optional)
│     │  └─ <CancelButton /> (if timeout)
│     └─ </div>
│
└─ Export
   └─ PayHereLoadingState component
```

### Loading Messages

Document progressive loading messages:

| Time Elapsed | Message |
|--------------|---------|
| 0-2s | "Processing payment..." |
| 2-5s | "Connecting to PayHere..." |
| 5-10s | "Preparing secure checkout..." |
| 10-15s | "Almost ready..." |
| 15-30s | "This is taking longer than expected..." |
| 30s+ | "Request timed out. Please try again." |

### Timeout Handling

**Timeout Flow**
```
Loading Started
│
├─ 0-30s: Normal loading
│  ├─ Show loading spinner
│  ├─ Update progress messages
│  └─ Wait for completion
│
├─ 30s+: Timeout
│  ├─ Stop loading indicator
│  ├─ Show timeout message
│  ├─ Show "Try Again" button
│  └─ Call onCancel callback
│
└─ Cleanup
   ├─ Clear timers
   └─ Remove loading state
```

### Component Variants

**Overlay Variant**
- Full-screen overlay
- Semi-transparent background (#000 opacity 0.5)
- Center loading indicator
- Block all interactions
- High z-index

**Inline Variant**
- No overlay
- Smaller spinner
- Inline with content
- No background
- Normal z-index

### Usage Examples

Provide usage examples:

**Example 1: Basic Overlay**
```
{isInitiating && (
  <PayHereLoadingState
    message="Processing your payment..."
  />
)}
```

**Example 2: With Timeout**
```
<PayHereLoadingState
  message="Initializing PayHere..."
  timeout={30000} // 30 seconds
  onCancel={() => {
    setIsInitiating(false);
    toast.error('Payment initialization timed out');
  }}
/>
```

**Example 3: With Progress**
```
<PayHereLoadingState
  message="Processing payment..."
  progress={75}
/>
```

**Example 4: Inline Variant**
```
<PayHereLoadingState
  variant="inline"
  message="Loading..."
/>
```

**Example 5: In Button**
```
function PayHereButton() {
  const { isLoading } = usePayHerePayment();
  
  return (
    <button disabled={isLoading}>
      {isLoading ? (
        <PayHereLoadingState
          variant="inline"
          message="Processing..."
        />
      ) : (
        'Pay with PayHere'
      )}
    </button>
  );
}
```

### Styling Guidelines

**Overlay Styling**
```
.payhere-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  max-width: 400px;
}
```

**Spinner Animation**
```
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
}
```

**Fade In Animation**
```
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.payhere-loading-overlay {
  animation: fadeIn 0.3s ease-in;
}
```

### Accessibility Features

**ARIA Attributes**
```
<div
  role="status"
  aria-live="polite"
  aria-busy="true"
  aria-label="Payment processing"
>
  <span className="sr-only">Processing payment, please wait</span>
  {/* Visible loading UI */}
</div>
```

**Screen Reader Support**
- Announce loading start
- Announce progress messages
- Announce completion
- Announce timeout

### Integration Points

**With Payment Button**
- Show loading when button clicked
- Replace button with loading state
- Disable button during loading
- Hide loading on success/error

**With Payment Hook**
- Trigger on isLoading from hook
- Hide when mutation complete
- Show on initiateAsync call
- Clear on success or error

**With Page Navigation**
- Show during redirect
- Prevent back navigation during loading
- Clear on page unload

### Component Example

Basic structure (not full code):

```
interface PayHereLoadingStateProps {
  message?: string;
  progress?: number;
  onCancel?: () => void;
  timeout?: number;
  variant?: 'overlay' | 'inline';
}

export function PayHereLoadingState({
  message,
  progress,
  onCancel,
  timeout = 30000,
  variant = 'overlay'
}: PayHereLoadingStateProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(
    message || 'Processing payment...'
  );
  
  useEffect(() => {
    // Update message based on time elapsed
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1000);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Update message based on timeElapsed
    if (timeElapsed > 15000) {
      setCurrentMessage('This is taking longer than expected...');
    } else if (timeElapsed > 10000) {
      setCurrentMessage('Almost ready...');
    } else if (timeElapsed > 5000) {
      setCurrentMessage('Preparing secure checkout...');
    } else if (timeElapsed > 2000) {
      setCurrentMessage('Connecting to PayHere...');
    }
    
    // Check timeout
    if (timeElapsed >= timeout) {
      onCancel?.();
    }
  }, [timeElapsed, timeout, onCancel]);
  
  if (variant === 'inline') {
    return (
      <div className="inline-loading">
        <Spinner size="small" />
        <span>{currentMessage}</span>
      </div>
    );
  }
  
  return (
    <div className="payhere-loading-overlay">
      <div className="loading-container">
        <Spinner />
        <p>{currentMessage}</p>
        {progress !== undefined && (
          <ProgressBar value={progress} />
        )}
        {timeElapsed > 10000 && onCancel && (
          <button onClick={onCancel}>Cancel</button>
        )}
      </div>
    </div>
  );
}
```

### Expected Output

After completing this task:
- File `frontend/components/checkout/PayHereLoadingState.tsx` created
- PayHereLoadingState component implemented
- PayHereLoadingStateProps interface defined
- Loading indicator implemented
- Progress messages added
- Timeout handling implemented
- Cancel button added (optional)
- Overlay variant created
- Inline variant created
- Animations added
- Accessibility features included
- Component exported
- Usage examples documented

---

## Summary

This document covered Tasks 81-88 for PayHere frontend integration:

### Completed Tasks
1. **Task 81** - PayHere Types: Created comprehensive TypeScript types
2. **Task 82** - PayHere API Client: Created HTTP client for payment operations
3. **Task 83** - Initiate Payment Hook: Created usePayHerePayment React hook
4. **Task 84** - Redirect Handler: Created form POST redirect to PayHere
5. **Task 85** - Success Page: Created payment success confirmation page
6. **Task 86** - Cancel Page: Created payment cancellation page
7. **Task 87** - PayHere Button: Created reusable payment button component
8. **Task 88** - Loading State: Created loading indicators and progress feedback

### Key Deliverables
- TypeScript types for all PayHere interactions
- API client for payment operations
- React hook for payment initiation
- Redirect handler for PayHere checkout
- Success and cancel pages
- Reusable payment button component
- Loading state components

### Next Steps
Proceed to [02_Tasks-89-92_Testing-Documentation.md](02_Tasks-89-92_Testing-Documentation.md) to implement sandbox testing, test cards, E2E tests, and integration documentation.

---

**Document Status:** ✅ Complete | **Tasks:** 81-88 of 92 | **Progress:** 87.0%
