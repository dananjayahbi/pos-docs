# Tasks 77-83: Types, Hooks, and OTP Components

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** F - Frontend & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 77, 78, 79, 80, 81, 82, 83

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-E_Reconciliation-Reports/02_Tasks-71-76_Reports-Export-Verify.md](../Group-E_Reconciliation-Reports/02_Tasks-71-76_Reports-Export-Verify.md)
- **→ Next Document:** [02_Tasks-84-90_Messages-Admin-Testing.md](02_Tasks-84-90_Messages-Admin-Testing.md)

---

## Document Overview

This document covers the creation of frontend COD integration components including TypeScript types, API client, custom React hooks for eligibility and payment processing, COD button component with fee display, and OTP input component. These components provide the foundation for COD payment method in the webstore checkout flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create COD Types | Low | 15 min |
| 78 | Create COD API Client | Medium | 30 min |
| 79 | Create Eligibility Hook | Medium | 35 min |
| 80 | Create Payment Hook | Medium | 40 min |
| 81 | Create COD Button | Medium | 30 min |
| 82 | Create COD Fee Display | Low | 20 min |
| 83 | Create OTP Input | Medium | 40 min |

---

## Task 77: Create COD Types

### Overview
Create TypeScript type definitions for COD functionality including eligibility checks, payment requests, OTP verification, and API responses. These types provide type safety across the entire COD implementation and ensure consistent data structures between frontend and backend.

### Dependencies
- Task 76: Test All COD Endpoints (Backend verification complete)
- Frontend project structure established
- TypeScript configured in Next.js project

### Instructions

1. **Create COD types directory**
   - Navigate to `frontend/lib/payments/` directory
   - Create new directory named `cod`
   - This will house all COD-related utilities

2. **Create types file**
   - Create `types.ts` in `lib/payments/cod/` directory
   - Set up TypeScript type definitions structure
   - Include JSDoc comments for documentation

3. **Define COD eligibility types**
   - Create `CODEligibilityRequest` type with address and amount fields
   - Create `CODEligibilityResponse` type with eligible boolean, reason, and max_amount
   - Include postal codes, areas, and shipping address information

4. **Define COD payment types**
   - Create `CODPaymentRequest` type with order_id, amount, and customer details
   - Create `CODPaymentResponse` type with payment ID, status, and OTP info
   - Include fee calculation fields (fee_type, fee_amount, total_amount)

5. **Define OTP types**
   - Create `OTPSendRequest` type with phone number and order ID
   - Create `OTPVerifyRequest` type with OTP code, phone, and order ID
   - Create `OTPResponse` type with success status and messages

6. **Define status and enum types**
   - Create `CODStatus` enum (PENDING, OTP_SENT, VERIFIED, COLLECTED, FAILED)
   - Create `FeeType` enum (FLAT, PERCENTAGE)
   - Create `LimitReason` enum (AREA_NOT_COVERED, AMOUNT_EXCEEDED, LIMIT_REACHED)

7. **Define collection types**
   - Create `CODCollectionRecord` type for backend tracking
   - Create `ReconciliationData` type for admin interface
   - Include courier, collection status, and timestamps

### Type Structure Overview

```
types.ts
├── Eligibility Types
│   ├── CODEligibilityRequest
│   ├── CODEligibilityResponse
│   └── EligibilityCheckResult
├── Payment Types
│   ├── CODPaymentRequest
│   ├── CODPaymentResponse
│   └── CODPaymentDetails
├── OTP Types
│   ├── OTPSendRequest
│   ├── OTPVerifyRequest
│   └── OTPResponse
├── Status Enums
│   ├── CODStatus
│   ├── FeeType
│   └── LimitReason
└── Collection Types
    ├── CODCollectionRecord
    └── ReconciliationData
```

### Type Relationships Diagram

```
Customer Places Order
         │
         ▼
CODEligibilityRequest ──► Backend Check ──► CODEligibilityResponse
         │                                            │
         │ (if eligible)                              │
         ▼                                            ▼
CODPaymentRequest ──────► Backend Process ──► CODPaymentResponse
         │                                            │
         ▼                                            ▼
OTPSendRequest ─────────► Backend OTP ────────► OTPResponse
         │                                            │
         ▼                                            ▼
OTPVerifyRequest ───────► Backend Verify ──────► OTPResponse
         │                                            │
         ▼                                            ▼
   Order Confirmed                            CODCollectionRecord
```

### Key Type Fields

| Type | Critical Fields | Purpose |
|------|----------------|---------|
| CODEligibilityRequest | address, postal_code, amount | Check if COD available |
| CODEligibilityResponse | eligible, reason, max_amount | Eligibility result |
| CODPaymentRequest | order_id, amount, phone | Initiate COD payment |
| CODPaymentResponse | payment_id, status, otp_required | Payment initialization |
| OTPSendRequest | phone, order_id | Send OTP to customer |
| OTPVerifyRequest | otp_code, phone, order_id | Verify customer OTP |

### Status Flow

```
PENDING
   │
   ▼
OTP_SENT (after initiate payment)
   │
   ▼
VERIFIED (after OTP verified)
   │
   ▼
COLLECTED (courier confirms)
   │
   ▼ (or)
FAILED (if any step fails)
```

### Expected Outcome
- Comprehensive TypeScript type definitions for COD
- Type safety for all COD operations
- Clear documentation via types and comments
- Foundation for API client and components

### Verification Checklist
- [ ] `frontend/lib/payments/cod/types.ts` file created
- [ ] All eligibility types defined
- [ ] All payment types defined
- [ ] All OTP types defined
- [ ] Status enums created
- [ ] Collection types defined
- [ ] JSDoc comments added
- [ ] Types export properly

---

## Task 78: Create COD API Client

### Overview
Create a COD API client module that handles all communication with the COD backend endpoints. This client provides methods for checking eligibility, initiating payments, sending OTP, and verifying OTP, with built-in error handling, request/response transformation, and authentication headers.

### Dependencies
- Task 77: Create COD Types
- Backend COD API endpoints functional
- Frontend authentication system configured

### Instructions

1. **Create API client file**
   - Create `client.ts` in `lib/payments/cod/` directory
   - Import COD types from Task 77
   - Import HTTP client utilities (axios or fetch wrapper)

2. **Set up API configuration**
   - Define base URL for COD endpoints (`/api/payments/cod/`)
   - Configure request timeout (30 seconds recommended)
   - Set up default headers (Content-Type, Authorization)

3. **Create eligibility check method**
   - Method name: `checkCODEligibility`
   - Endpoint: `POST /api/payments/cod/eligibility/`
   - Input: CODEligibilityRequest type
   - Output: CODEligibilityResponse type
   - Handle postal code validation

4. **Create payment initiation method**
   - Method name: `initiateCODPayment`
   - Endpoint: `POST /api/payments/cod/initiate/`
   - Input: CODPaymentRequest type
   - Output: CODPaymentResponse type
   - Include order validation

5. **Create OTP send method**
   - Method name: `sendCODOTP`
   - Endpoint: `POST /api/payments/cod/otp/send/`
   - Input: OTPSendRequest type
   - Output: OTPResponse type
   - Format phone number (+94 XX XXX XXXX)

6. **Create OTP verify method**
   - Method name: `verifyCODOTP`
   - Endpoint: `POST /api/payments/cod/otp/verify/`
   - Input: OTPVerifyRequest type
   - Output: OTPResponse type
   - Handle verification failures

7. **Implement error handling**
   - Create custom error types for COD errors
   - Handle network errors gracefully
   - Parse backend error messages
   - Provide user-friendly error messages

8. **Add request interceptors**
   - Attach authentication token automatically
   - Add tenant context if needed
   - Log requests in development mode

9. **Add response interceptors**
   - Transform backend responses to frontend types
   - Handle common error codes (400, 401, 403, 404, 500)
   - Extract error messages from response

### API Client Structure

```
client.ts
├── Configuration
│   ├── BASE_URL
│   ├── TIMEOUT
│   └── DEFAULT_HEADERS
├── Methods
│   ├── checkCODEligibility()
│   ├── initiateCODPayment()
│   ├── sendCODOTP()
│   └── verifyCODOTP()
├── Error Handling
│   ├── CODError class
│   ├── handleAPIError()
│   └── formatErrorMessage()
└── Utilities
    ├── formatPhoneNumber()
    └── validateRequest()
```

### API Method Flow Diagram

```
Frontend Component
       │
       ▼
Call API Client Method
       │
       ├──► checkCODEligibility()
       │         │
       │         ├──► Validate request
       │         ├──► Add auth headers
       │         ├──► POST to backend
       │         ├──► Handle response
       │         └──► Return typed data
       │
       ├──► initiateCODPayment()
       │         │
       │         └──► (same flow)
       │
       ├──► sendCODOTP()
       │         │
       │         └──► (same flow)
       │
       └──► verifyCODOTP()
                 │
                 └──► (same flow)
```

### API Methods Specifications

| Method | Endpoint | Input Type | Output Type | Purpose |
|--------|----------|------------|-------------|---------|
| checkCODEligibility | POST /eligibility/ | CODEligibilityRequest | CODEligibilityResponse | Check if COD available |
| initiateCODPayment | POST /initiate/ | CODPaymentRequest | CODPaymentResponse | Start COD payment |
| sendCODOTP | POST /otp/send/ | OTPSendRequest | OTPResponse | Send OTP to phone |
| verifyCODOTP | POST /otp/verify/ | OTPVerifyRequest | OTPResponse | Verify OTP code |

### Error Handling Strategy

| Error Type | HTTP Status | Handling |
|------------|-------------|----------|
| Validation Error | 400 | Show field-specific errors |
| Authentication Error | 401 | Redirect to login |
| Permission Error | 403 | Show access denied message |
| Not Found | 404 | Show resource not found |
| Server Error | 500 | Show generic error, log details |
| Network Error | - | Show connection error, retry option |

### Request/Response Flow

```
Component calls API method
         │
         ▼
Validate input data
         │
         ▼
Add authentication token
         │
         ▼
Format request body
         │
         ▼
Send HTTP request
         │
         ▼
Wait for response
         │
    ┌────┴────┐
    ▼         ▼
Success   Error
    │         │
    │         ▼
    │    Parse error
    │         │
    │         ▼
    │    Format message
    │         │
    ▼         ▼
Return typed data
```

### Authentication Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Authorization | Bearer {token} | User authentication |
| X-Tenant-ID | {tenant_id} | Multi-tenant routing |
| Content-Type | application/json | Request format |

### Expected Outcome
- Fully functional COD API client
- Type-safe method signatures
- Comprehensive error handling
- Easy integration with React components

### Verification Checklist
- [ ] `frontend/lib/payments/cod/client.ts` file created
- [ ] All four API methods implemented
- [ ] Type imports from types.ts working
- [ ] Error handling implemented
- [ ] Authentication headers configured
- [ ] Request/response transformation working
- [ ] Phone number formatting utility added
- [ ] Client exports properly

---

## Task 79: Create Eligibility Hook

### Overview
Create a custom React hook `useCODEligibility` that checks COD availability based on delivery address and order amount. This hook manages the eligibility check state, handles loading states, provides error messages, and returns the eligibility result with maximum COD limit information.

### Dependencies
- Task 78: Create COD API Client
- Task 77: Create COD Types
- React hooks understanding (useState, useEffect, useCallback)

### Instructions

1. **Create hooks file**
   - Create `hooks.ts` in `lib/payments/cod/` directory
   - Import React hooks (useState, useEffect, useCallback)
   - Import COD types and API client

2. **Define hook interface**
   - Create `UseCODEligibilityResult` interface
   - Include fields: isLoading, eligible, reason, maxAmount, error
   - Include method: checkEligibility()

3. **Implement useCODEligibility hook**
   - Accept parameters: address, postalCode, amount
   - Initialize state for loading, result, and error
   - Return eligibility check function and current state

4. **Create eligibility check function**
   - Use useCallback to memoize function
   - Call checkCODEligibility from API client
   - Set loading state during API call
   - Update state with API response

5. **Handle eligibility response**
   - Parse eligible boolean from response
   - Extract reason if not eligible
   - Store max_amount for display
   - Clear previous errors on success

6. **Implement error handling**
   - Catch API errors from client
   - Set user-friendly error messages
   - Reset loading state on error
   - Provide error recovery suggestions

7. **Add automatic checking**
   - Use useEffect to check on mount if address provided
   - Re-check when address or amount changes
   - Debounce amount changes to avoid excessive API calls

8. **Add caching mechanism (optional)**
   - Cache eligibility results by postal code
   - Set cache expiration (5-10 minutes)
   - Return cached result if valid

### Hook Structure

```
useCODEligibility()
├── Parameters
│   ├── address (string)
│   ├── postalCode (string)
│   └── amount (number)
├── State
│   ├── isLoading (boolean)
│   ├── eligible (boolean | null)
│   ├── reason (string | null)
│   ├── maxAmount (number | null)
│   └── error (string | null)
├── Methods
│   └── checkEligibility()
└── Return Value
    └── UseCODEligibilityResult
```

### Hook Usage Flow

```
Component mounts
       │
       ▼
useCODEligibility({ address, postalCode, amount })
       │
       ▼
Hook initializes state
       │
       ▼
useEffect runs on mount
       │
       ▼
checkEligibility() called
       │
       ▼
Set isLoading = true
       │
       ▼
Call API client checkCODEligibility()
       │
   ┌───┴───┐
   ▼       ▼
Success  Error
   │       │
   │       ▼
   │   Set error state
   │   Set isLoading = false
   │       │
   ▼       ▼
Parse response
   │
   ▼
Update state:
- eligible
- reason
- maxAmount
   │
   ▼
Set isLoading = false
   │
   ▼
Component re-renders with result
```

### Hook Return Interface

| Field | Type | Description |
|-------|------|-------------|
| isLoading | boolean | API request in progress |
| eligible | boolean \| null | COD available for this order |
| reason | string \| null | Reason if not eligible |
| maxAmount | number \| null | Maximum COD limit for area |
| error | string \| null | Error message if check failed |
| checkEligibility | () => Promise<void> | Manual eligibility check |

### Eligibility Check States

```
Initial State
├── isLoading: false
├── eligible: null
├── reason: null
├── maxAmount: null
└── error: null

Loading State
├── isLoading: true
├── eligible: null (previous value)
├── reason: null
├── maxAmount: null
└── error: null

Success State (Eligible)
├── isLoading: false
├── eligible: true
├── reason: null
├── maxAmount: 50000
└── error: null

Success State (Not Eligible)
├── isLoading: false
├── eligible: false
├── reason: "Area not covered"
├── maxAmount: null
└── error: null

Error State
├── isLoading: false
├── eligible: null
├── reason: null
├── maxAmount: null
└── error: "Network error"
```

### Eligibility Reasons

| Reason | Display Message | User Action |
|--------|----------------|-------------|
| area_not_covered | COD is not available for your area | Try online payment |
| amount_exceeded | Order exceeds COD limit of ₨X | Reduce order or use online payment |
| limit_reached | Daily COD limit reached for this area | Try again tomorrow or use online payment |

### Auto-Check Logic

```
useEffect dependencies: [address, postalCode, amount]
       │
       ▼
Check if all required fields present
       │
   ┌───┴────┐
   ▼        ▼
 Yes       No
   │        │
   │        └──► Return (don't check)
   ▼
Debounce delay (500ms for amount)
   │
   ▼
Call checkEligibility()
```

### Expected Outcome
- Reusable eligibility check hook
- Automatic checking on parameter changes
- Loading and error state management
- Clear eligibility result with reasoning

### Verification Checklist
- [ ] `useCODEligibility` hook created in hooks.ts
- [ ] Hook accepts address, postalCode, amount parameters
- [ ] Loading state managed correctly
- [ ] Eligibility result parsed and returned
- [ ] Error handling implemented
- [ ] Auto-check on parameter changes
- [ ] Hook exports properly
- [ ] TypeScript types defined for return value

---

## Task 80: Create Payment Hook

### Overview
Create a custom React hook `useCODPayment` that manages the entire COD payment flow including payment initiation, OTP sending, OTP verification, and order confirmation. This hook provides a comprehensive interface for executing the COD payment process with state management for each step.

### Dependencies
- Task 78: Create COD API Client
- Task 77: Create COD Types
- React hooks understanding

### Instructions

1. **Add to hooks.ts file**
   - Continue in `lib/payments/cod/hooks.ts`
   - Import additional React hooks if needed
   - Import payment-related types

2. **Define hook interface**
   - Create `UseCODPaymentResult` interface
   - Include fields: status, paymentId, error, isLoading
   - Include methods: initiatePayment(), sendOTP(), verifyOTP(), reset()

3. **Implement useCODPayment hook**
   - Accept optional callbacks (onSuccess, onError)
   - Initialize state for payment status tracking
   - Return payment methods and current state

4. **Create initiate payment method**
   - Accept orderId, amount, customerDetails
   - Call initiateCODPayment from API client
   - Set status to "initiating"
   - Store payment ID from response
   - Automatically trigger sendOTP() on success

5. **Create send OTP method**
   - Accept phone number parameter
   - Call sendCODOTP from API client
   - Set status to "otp_sent"
   - Store OTP reference or session ID
   - Handle rate limiting errors

6. **Create verify OTP method**
   - Accept OTP code parameter
   - Call verifyCODOTP from API client
   - Set status to "verified" on success
   - Trigger onSuccess callback
   - Handle invalid OTP errors

7. **Implement status state machine**
   - Define payment status flow (idle → initiating → otp_sent → verifying → verified)
   - Prevent invalid state transitions
   - Allow reset to restart flow

8. **Add error recovery**
   - Store error messages for each step
   - Provide retry mechanism for failed steps
   - Clear errors on new attempt

9. **Implement timeout handling**
   - Add timeout for OTP validity (10 minutes)
   - Show expiration warning
   - Allow OTP resend

### Hook Structure

```
useCODPayment()
├── Parameters
│   ├── onSuccess (callback)
│   └── onError (callback)
├── State
│   ├── status (CODPaymentStatus)
│   ├── paymentId (string | null)
│   ├── otpSessionId (string | null)
│   ├── isLoading (boolean)
│   └── error (string | null)
├── Methods
│   ├── initiatePayment()
│   ├── sendOTP()
│   ├── verifyOTP()
│   └── reset()
└── Return Value
    └── UseCODPaymentResult
```

### Payment Flow State Machine

```
IDLE
 │
 │ initiatePayment()
 ▼
INITIATING
 │
 │ (success)
 ▼
OTP_SENT
 │
 │ verifyOTP()
 ▼
VERIFYING
 │
 │ (success)
 ▼
VERIFIED
 │
 │ onSuccess callback
 ▼
Order Confirmed

(Any step can transition to ERROR state)
```

### Hook Return Interface

| Field | Type | Description |
|-------|------|-------------|
| status | PaymentStatus | Current payment flow status |
| paymentId | string \| null | COD payment ID from backend |
| isLoading | boolean | Operation in progress |
| error | string \| null | Error message if operation failed |
| initiatePayment | (orderId, amount, details) => Promise<void> | Start COD payment |
| sendOTP | (phone) => Promise<void> | Send OTP to customer phone |
| verifyOTP | (code) => Promise<void> | Verify OTP code |
| reset | () => void | Reset payment flow to initial state |

### Payment Status Values

| Status | Description | Next Actions |
|--------|-------------|--------------|
| idle | Initial state, no payment initiated | initiatePayment() |
| initiating | Creating payment record | Wait for response |
| otp_sent | OTP sent to customer phone | verifyOTP() or resend |
| verifying | Verifying OTP code | Wait for response |
| verified | Payment verified, order can proceed | Complete order |
| error | Error occurred in any step | Check error, retry or reset |

### Payment Flow Sequence

```
1. Customer clicks "Place Order with COD"
         │
         ▼
2. Component calls initiatePayment(orderId, amount, customerDetails)
         │
         ▼
3. Hook sets status = "initiating", isLoading = true
         │
         ▼
4. API call to initiate COD payment
         │
    ┌────┴────┐
    ▼         ▼
Success   Error
    │         │
    │         ▼
    │    status = "error"
    │    error = message
    │    isLoading = false
    │         │
    ▼         ▼
Store paymentId     Return (show error)
    │
    ▼
5. Hook automatically calls sendOTP(phone)
    │
    ▼
6. status = "otp_sent", isLoading = false
    │
    ▼
7. Component shows OTP input
    │
    ▼
8. Customer enters OTP, component calls verifyOTP(code)
    │
    ▼
9. status = "verifying", isLoading = true
    │
    ▼
10. API call to verify OTP
    │
    ┌────┴────┐
    ▼         ▼
Success   Error
    │         │
    │         ▼
    │    status = "error"
    │    error = "Invalid OTP"
    │         │
    ▼         ▼
status = "verified"    Return (allow retry)
isLoading = false
    │
    ▼
11. onSuccess callback triggered
    │
    ▼
12. Component completes order
```

### Error Handling by Step

| Step | Possible Errors | Recovery Action |
|------|----------------|-----------------|
| initiatePayment | Order not found, Amount invalid | Show error, fix data, retry |
| sendOTP | Phone invalid, Rate limit | Verify phone, wait, retry |
| verifyOTP | Invalid OTP, Expired OTP | Re-enter OTP, resend OTP |

### Callback Usage

```
Component using hook:

const { initiatePayment, verifyOTP, status } = useCODPayment({
  onSuccess: () => {
    // Navigate to order confirmation
    // Show success message
  },
  onError: (error) => {
    // Show error toast
    // Log error for debugging
  }
});
```

### Reset Functionality

```
reset() method:
├── status = "idle"
├── paymentId = null
├── otpSessionId = null
├── isLoading = false
└── error = null

Use cases:
├── User cancels COD payment
├── Starts new order
└── Recovers from error
```

### Expected Outcome
- Complete payment flow management hook
- State machine for payment status
- Automatic OTP sending after initiation
- Error handling for each step
- Easy integration with checkout UI

### Verification Checklist
- [ ] `useCODPayment` hook created in hooks.ts
- [ ] Payment status state machine implemented
- [ ] initiatePayment() method working
- [ ] sendOTP() method working
- [ ] verifyOTP() method working
- [ ] reset() method working
- [ ] Error handling for all steps
- [ ] onSuccess and onError callbacks functional
- [ ] TypeScript types defined

---

## Task 81: Create COD Button

### Overview
Create a CODButton component that displays the Cash on Delivery payment option in the checkout flow. This button shows COD availability status, disables when not eligible, displays fee information, and triggers the COD payment flow when clicked. It integrates with the eligibility and payment hooks.

### Dependencies
- Task 79: Create Eligibility Hook
- Task 80: Create Payment Hook
- Shadcn/UI Button component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/checkout/` directory
   - Create `CODButton.tsx` file
   - Import React and necessary hooks

2. **Import dependencies**
   - Import useCODEligibility hook
   - Import useCODPayment hook
   - Import Button from Shadcn/UI
   - Import relevant icons (Banknote, AlertCircle)

3. **Define component props**
   - Create `CODButtonProps` interface
   - Include: orderId, amount, shippingAddress, onPaymentStart, onPaymentSuccess

4. **Implement component structure**
   - Use useCODEligibility to check availability
   - Use useCODPayment to handle payment flow
   - Render button with appropriate state

5. **Handle eligibility checking**
   - Extract address and postal code from shippingAddress
   - Pass to useCODEligibility hook
   - Display loading state during check

6. **Implement button states**
   - Available state: Enabled, shows "Cash on Delivery" with fee
   - Not available state: Disabled, shows reason
   - Loading state: Disabled, shows spinner
   - Processing state: Disabled, shows "Processing..."

7. **Handle button click**
   - Trigger onPaymentStart callback
   - Call initiatePayment from useCODPayment
   - Show OTP modal or navigate to OTP page

8. **Display eligibility information**
   - Show checkmark icon when eligible
   - Show warning icon when not eligible
   - Display fee amount (handled by CODFeeDisplay in Task 82)

9. **Add accessibility features**
   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader announcements

### Component Structure

```
CODButton
├── Props
│   ├── orderId (string)
│   ├── amount (number)
│   ├── shippingAddress (Address)
│   ├── onPaymentStart (() => void)
│   └── onPaymentSuccess ((paymentId) => void)
├── Hooks
│   ├── useCODEligibility({ address, postalCode, amount })
│   └── useCODPayment({ onSuccess, onError })
├── Render Logic
│   ├── If checking eligibility → Show loading
│   ├── If not eligible → Show disabled with reason
│   ├── If eligible → Show enabled with fee
│   └── If processing → Show processing state
└── Event Handlers
    └── handleClick()
```

### Button State Diagram

```
Component Mounts
       │
       ▼
Check Eligibility (useCODEligibility)
       │
   ┌───┴────┐
   ▼        ▼
Eligible  Not Eligible
   │            │
   │            ▼
   │      Show Disabled Button
   │      "COD not available"
   │      "Reason: Area not covered"
   │
   ▼
Show Enabled Button
"Cash on Delivery"
"+ ₨100 COD fee"
   │
   │ (User clicks)
   ▼
handleClick()
   │
   ▼
onPaymentStart callback
   │
   ▼
initiatePayment(orderId, amount, details)
   │
   ▼
Show Processing State
"Processing..."
   │
   ▼
Payment Hook handles OTP flow
   │
   ▼
onPaymentSuccess callback
```

### Button Variants

| State | Appearance | Text | Icon | Clickable |
|-------|------------|------|------|-----------|
| Checking | Muted, spinner | "Checking availability..." | Spinner | No |
| Eligible | Primary, emphasis | "Cash on Delivery + ₨100" | Banknote | Yes |
| Not Eligible | Disabled, muted | "COD not available (reason)" | AlertCircle | No |
| Processing | Disabled, spinner | "Processing..." | Spinner | No |

### Component Layout

```
┌──────────────────────────────────────────┐
│  [Icon]  Cash on Delivery        + ₨100 │ ← Eligible
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  [!]  COD not available                  │ ← Not Eligible
│       Area not covered by COD service    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  [Spinner]  Checking availability...     │ ← Loading
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  [Spinner]  Processing...                │ ← Processing
└──────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| orderId | string | Yes | Order ID for COD payment |
| amount | number | Yes | Order total amount |
| shippingAddress | Address | Yes | Delivery address for eligibility |
| onPaymentStart | () => void | No | Callback when payment starts |
| onPaymentSuccess | (paymentId: string) => void | Yes | Callback when payment verified |

### Integration with Other Components

```
CheckoutPage
      │
      ├──► PaymentMethodSelector
      │         │
      │         ├──► CreditCardButton
      │         ├──► BankTransferButton
      │         └──► CODButton ◄── This component
      │                  │
      │                  ├──► useCODEligibility (Task 79)
      │                  ├──► useCODPayment (Task 80)
      │                  ├──► CODFeeDisplay (Task 82)
      │                  └──► OTPInput (Task 83) ◄── Opens modal
      │
      └──► OrderSummary
```

### Click Handler Flow

```
User clicks CODButton
       │
       ▼
handleClick() triggered
       │
       ▼
Call onPaymentStart() callback
       │
       ▼
Set local processing state
       │
       ▼
Call initiatePayment(orderId, amount, customerDetails)
       │
       ▼
useCODPayment hook handles API call
       │
       ▼
OTP sent automatically
       │
       ▼
Component shows OTP input (Task 83)
       │
       ▼
User verifies OTP
       │
       ▼
Call onPaymentSuccess(paymentId)
       │
       ▼
Parent completes order
```

### Expected Outcome
- Interactive COD button component
- Automatic eligibility checking
- Clear visual feedback for all states
- Integration with payment flow hooks

### Verification Checklist
- [ ] `frontend/components/checkout/CODButton.tsx` created
- [ ] Component accepts all required props
- [ ] useCODEligibility integration working
- [ ] useCODPayment integration working
- [ ] Button states render correctly
- [ ] Click handler initiates payment flow
- [ ] Eligibility check runs on mount
- [ ] Disabled state shows reason
- [ ] Loading states display properly
- [ ] Component exports properly

---

## Task 82: Create COD Fee Display

### Overview
Create a CODFeeDisplay component that shows the COD fee information to customers. This component displays the fee type (flat or percentage), fee amount in LKR, and explains how the fee is calculated. It can be used standalone or integrated into the CODButton.

### Dependencies
- Task 81: Create COD Button
- Task 77: Create COD Types

### Instructions

1. **Create component file**
   - Create `CODFeeDisplay.tsx` in `components/checkout/` directory
   - Import React and COD types
   - Import formatting utilities

2. **Define component props**
   - Create `CODFeeDisplayProps` interface
   - Include: feeType (flat or percentage), feeAmount, orderAmount, showCalculation

3. **Implement fee calculation**
   - For flat fee: Display fixed amount (e.g., "₨100 COD fee")
   - For percentage fee: Calculate percentage of order (e.g., "2% COD fee (₨120)")
   - Handle edge cases (zero fee, maximum cap)

4. **Create display formats**
   - Compact format: "+ ₨100" (for button integration)
   - Detailed format: "Cash on Delivery Fee: ₨100" (for order summary)
   - Explanation format: "₨100 COD handling fee applies to this order"

5. **Implement formatting**
   - Use Sri Lankan Rupee symbol (₨)
   - Format numbers with commas for thousands
   - Handle decimal places (0 or 2 decimals)

6. **Add visual indicators**
   - Use appropriate color (text-muted for subtle display)
   - Add icon for fee (optional)
   - Use different styling for different contexts

7. **Create calculation tooltip**
   - Show how fee is calculated on hover
   - Explain flat vs percentage fees
   - Display breakdown if applicable

### Component Structure

```
CODFeeDisplay
├── Props
│   ├── feeType (FeeType enum)
│   ├── feeAmount (number)
│   ├── orderAmount (number, optional)
│   ├── variant ("compact" | "detailed" | "explanation")
│   └── showCalculation (boolean)
├── Calculations
│   ├── calculateFinalFee()
│   └── formatCurrency()
└── Render Variants
    ├── Compact: "+ ₨100"
    ├── Detailed: "COD Fee: ₨100"
    └── Explanation: "₨100 handling fee"
```

### Fee Display Variants

```
Compact (for button):
┌──────────────┐
│    + ₨100   │
└──────────────┘

Detailed (for summary):
┌───────────────────────────┐
│ Cash on Delivery Fee      │
│ ₨100                      │
└───────────────────────────┘

Explanation (for info):
┌──────────────────────────────────────┐
│ A ₨100 handling fee applies to       │
│ Cash on Delivery orders              │
└──────────────────────────────────────┘

With Calculation (tooltip):
┌──────────────────────────────────────┐
│ COD Fee: 2% of order total           │
│ Order: ₨5,000                        │
│ Fee: ₨100                            │
└──────────────────────────────────────┘
```

### Fee Calculation Logic

```
Fee Type: FLAT
├── Fee Amount: ₨100
└── Display: "+ ₨100"

Fee Type: PERCENTAGE
├── Fee Rate: 2%
├── Order Amount: ₨5,000
├── Calculated Fee: ₨100
└── Display: "+ ₨100 (2%)"
    (with tooltip showing calculation)

Fee Type: PERCENTAGE with CAP
├── Fee Rate: 2%
├── Order Amount: ₨20,000
├── Calculated Fee: ₨400
├── Maximum Cap: ₨300
└── Display: "+ ₨300 (max fee)"
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| feeType | "FLAT" \| "PERCENTAGE" | Yes | - | Fee calculation method |
| feeAmount | number | Yes | - | Fee amount or percentage |
| orderAmount | number | No | - | Order total (for percentage) |
| variant | "compact" \| "detailed" \| "explanation" | No | "compact" | Display style |
| showCalculation | boolean | No | false | Show calculation breakdown |

### Currency Formatting

| Amount | Formatted Output |
|--------|------------------|
| 100 | ₨100 |
| 1500 | ₨1,500 |
| 15000 | ₨15,000 |
| 1234.56 | ₨1,234.56 |

### Usage Examples

```
In CODButton:
<CODButton orderId="123" amount={5000} shippingAddress={address}>
  <CODFeeDisplay 
    feeType="FLAT" 
    feeAmount={100} 
    variant="compact" 
  />
</CODButton>

In Order Summary:
<div className="order-line-item">
  <CODFeeDisplay 
    feeType="PERCENTAGE" 
    feeAmount={2} 
    orderAmount={5000}
    variant="detailed"
    showCalculation={true}
  />
</div>

In Info Section:
<CODFeeDisplay 
  feeType="FLAT" 
  feeAmount={100} 
  variant="explanation" 
/>
```

### Integration Points

```
CODButton Component
       │
       ▼
Shows CODFeeDisplay (compact)
       │
       ▼
User clicks button
       │
       ▼
Order Summary Page
       │
       ▼
Shows CODFeeDisplay (detailed)
       │
       ▼
Order Confirmation
       │
       ▼
Shows CODFeeDisplay (explanation)
```

### Expected Outcome
- Reusable fee display component
- Multiple display variants
- Accurate fee calculation
- Sri Lankan currency formatting

### Verification Checklist
- [ ] `frontend/components/checkout/CODFeeDisplay.tsx` created
- [ ] Component accepts all required props
- [ ] Flat fee display working
- [ ] Percentage fee calculation working
- [ ] Currency formatting correct (₨ symbol)
- [ ] All variants (compact, detailed, explanation) working
- [ ] Calculation breakdown tooltip implemented
- [ ] Integration with CODButton tested
- [ ] Component exports properly

---

## Task 83: Create OTP Input

### Overview
Create an OTPInput component that displays a user-friendly interface for entering the 6-digit OTP code sent to the customer's phone. This component features individual input boxes for each digit, automatic focus management, paste support, and integration with the payment verification flow.

### Dependencies
- Task 80: Create Payment Hook
- Shadcn/UI Input component
- React hooks for input management

### Instructions

1. **Create component file**
   - Create `OTPInput.tsx` in `components/checkout/` directory
   - Import React, useState, useRef, useEffect
   - Import Input from Shadcn/UI

2. **Define component props**
   - Create `OTPInputProps` interface
   - Include: onVerify (callback with OTP code), onResend, phone number, isLoading

3. **Implement input structure**
   - Create 6 individual input boxes for each digit
   - Use array of refs to manage focus
   - Style inputs consistently with brand

4. **Create input state**
   - Use useState to store array of 6 digits
   - Initialize with empty strings
   - Update on user input

5. **Implement input handling**
   - Handle single digit input per box
   - Automatically move focus to next box on input
   - Move focus to previous box on backspace
   - Allow only numeric input (0-9)

6. **Add paste support**
   - Detect paste event
   - Extract 6 digits from pasted content
   - Distribute across input boxes
   - Remove non-numeric characters

7. **Implement auto-submit**
   - Detect when all 6 digits entered
   - Automatically call onVerify with complete OTP
   - Clear inputs if verification fails

8. **Add visual feedback**
   - Highlight active input box
   - Show error state if verification fails
   - Display success state if verified
   - Show loading spinner during verification

9. **Implement accessibility**
   - Proper ARIA labels for each input
   - Screen reader announcements
   - Keyboard navigation support

10. **Add display features**
    - Show masked phone number ("+94 77 XXX XX45")
    - Display instructions ("Enter 6-digit code sent to your phone")
    - Show error messages below inputs

### Component Structure

```
OTPInput
├── Props
│   ├── onVerify ((code: string) => void)
│   ├── onResend (() => void)
│   ├── phone (string)
│   ├── isLoading (boolean)
│   └── error (string | null)
├── State
│   ├── digits (string[6])
│   └── activeIndex (number)
├── Refs
│   └── inputRefs (RefObject<HTMLInputElement>[6])
├── Handlers
│   ├── handleChange(index, value)
│   ├── handleKeyDown(index, event)
│   ├── handlePaste(event)
│   └── handleResend()
└── Render
    ├── Instructions
    ├── OTP Input Boxes (6)
    ├── Error Message
    ├── Resend Button (Task 84, 85)
    └── Timer (Task 84)
```

### OTP Input Layout

```
┌─────────────────────────────────────────────┐
│  Enter verification code                    │
│  Sent to +94 77 XXX XX45                   │
│                                             │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐     │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │     │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘     │
│                                             │
│  [!] Invalid code. Please try again.       │ ← Error
│                                             │
│  Resend code in 45s                        │ ← Timer (Task 84)
│  [Resend Code] ← Resend button (Task 85)  │
└─────────────────────────────────────────────┘
```

### Input Focus Flow

```
User clicks first input
       │
       ▼
Input [0] focused
       │
       │ User types digit
       ▼
Store digit in digits[0]
       │
       ▼
Auto-focus Input [1]
       │
       │ User types digit
       ▼
Store digit in digits[1]
       │
       ▼
Auto-focus Input [2]
       │
       ▼
... (continue for all 6 inputs)
       │
       ▼
All 6 digits entered
       │
       ▼
Join digits: "123456"
       │
       ▼
Call onVerify("123456")
       │
   ┌───┴────┐
   ▼        ▼
Success  Error
   │        │
   │        ▼
   │   Show error message
   │   Clear inputs
   │   Focus first input
   │
   ▼
Payment verified
```

### Input Handling Logic

```
handleChange(index, value):
├── If value is not numeric
│   └── Ignore input, return
├── If value is empty (backspace)
│   ├── Clear digits[index]
│   └── Focus previous input if index > 0
├── If value is single digit
│   ├── Store in digits[index]
│   ├── Focus next input if index < 5
│   └── If index === 5, call onVerify()
└── If value is multiple digits (paste)
    └── Handle via handlePaste()

handlePaste(event):
├── Prevent default behavior
├── Get clipboard text
├── Remove non-numeric characters
├── Take first 6 digits
├── Distribute across input boxes
├── Focus last filled input
└── If 6 digits, call onVerify()
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onVerify | (code: string) => void | Yes | Callback with complete OTP |
| onResend | () => void | Yes | Callback to resend OTP |
| phone | string | Yes | Customer phone (for display) |
| isLoading | boolean | No | Verification in progress |
| error | string \| null | No | Error message to display |

### Input Box States

| State | Border Color | Background | Description |
|-------|--------------|------------|-------------|
| Default | border-gray-300 | bg-white | Unfilled input |
| Active | border-blue-500 | bg-white | Currently focused |
| Filled | border-gray-300 | bg-white | Contains digit |
| Error | border-red-500 | bg-red-50 | Verification failed |
| Disabled | border-gray-200 | bg-gray-100 | During verification |

### Phone Number Masking

| Full Number | Masked Display |
|-------------|----------------|
| +94771234567 | +94 77 XXX XX67 |
| +94112345678 | +94 11 XXX XX78 |

```
maskPhoneNumber(phone):
├── Extract last 2 digits
├── Extract area code (first 2-3 digits after country code)
├── Replace middle digits with X
└── Format with spaces: "+94 77 XXX XX67"
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| 0-9 | Enter digit in current input |
| Backspace | Clear current input, move to previous |
| Delete | Clear current input |
| Left Arrow | Move to previous input |
| Right Arrow | Move to next input |
| Ctrl+V / Cmd+V | Paste 6-digit code |

### Auto-Submit Logic

```
After user enters 6th digit:
├── Join all digits: digits.join("")
├── Validate format (6 numeric digits)
├── Call onVerify(otpCode)
├── Set isLoading = true
├── Disable all inputs
└── Wait for verification result
    ├── Success: Keep inputs filled, show success
    └── Error: Clear inputs, focus first, show error
```

### Expected Outcome
- User-friendly OTP input interface
- Automatic focus management
- Paste support for convenience
- Auto-submit on complete OTP
- Clear error feedback

### Verification Checklist
- [ ] `frontend/components/checkout/OTPInput.tsx` created
- [ ] 6 individual input boxes rendered
- [ ] Input state managed correctly
- [ ] Focus moves automatically on input
- [ ] Backspace moves to previous input
- [ ] Paste support working
- [ ] Auto-submit on 6 digits
- [ ] onVerify callback triggered
- [ ] Error state displays correctly
- [ ] Phone number masked properly
- [ ] Loading state disables inputs
- [ ] Component exports properly

---

## Summary

This document established the foundation for COD frontend integration. We created TypeScript types for type safety, an API client for backend communication, custom React hooks for eligibility checking and payment processing, a COD button component with eligibility integration, fee display component, and OTP input component with auto-focus and paste support.

### Completed Tasks
1. ✓ Created COD TypeScript types for all data structures
2. ✓ Created COD API client with error handling
3. ✓ Created useCODEligibility hook for availability checking
4. ✓ Created useCODPayment hook for payment flow management
5. ✓ Created CODButton component with eligibility integration
6. ✓ Created CODFeeDisplay component for fee information
7. ✓ Created OTPInput component with auto-focus and paste support

### Next Steps
Proceed to [02_Tasks-84-90_Messages-Admin-Testing.md](02_Tasks-84-90_Messages-Admin-Testing.md) to create OTP timer and resend components, not available and limit messages, admin reconciliation UI, integration tests, and COD documentation.
