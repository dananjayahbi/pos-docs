# Tasks 81-88: Types and Components

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** F - Frontend & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Installment-Management](../Group-E_Installment-Management/)
- **→ Next Document:** [02_Tasks-89-94_Modal-Testing-Docs.md](02_Tasks-89-94_Modal-Testing-Docs.md)

---

## Document Overview

This document covers the frontend implementation of BNPL (Buy Now Pay Later) integration for Sri Lankan customers. It includes TypeScript types definition, API client implementation, React hooks for eligibility checking and payment initiation, and UI components for KOKO and MintPay payment buttons, installment preview, and BNPL product badges.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create BNPL Types | Low | 20 min |
| 82 | Create BNPL API Client | Medium | 40 min |
| 83 | Create Eligibility Hook | Medium | 35 min |
| 84 | Create Payment Hook | Medium | 35 min |
| 85 | Create KOKO Button | Medium | 30 min |
| 86 | Create MintPay Button | Medium | 30 min |
| 87 | Create Installment Preview | Medium | 45 min |
| 88 | Create BNPL Badge | Low | 25 min |

---

## Task 81: Create BNPL Types

### Overview
Create comprehensive TypeScript type definitions for BNPL functionality. These types will ensure type safety across the frontend application and provide clear interfaces for all BNPL-related data structures, API requests, and responses.

### Dependencies
- Task 80 (Verify Installments) must be complete
- TypeScript project structure established
- Backend API specifications available

### Instructions

1. **Create types.ts file**
   - Navigate to `frontend/lib/payments/bnpl/`
   - Create `types.ts` file for all BNPL type definitions
   - This will be the central location for BNPL TypeScript types

2. **Define BNPL provider enum**
   - Create BNPLProvider enum with KOKO and MINTPAY values
   - Use string enums for better debugging
   - Include display names and provider codes

3. **Define eligibility types**
   - EligibilityRequest interface with nic, phone, and order_amount
   - EligibilityResponse interface with eligible flag, plans, and limits
   - EligibilityError interface for error handling

4. **Define payment types**
   - PaymentRequest interface with provider and order details
   - PaymentResponse interface with redirect URLs
   - PaymentStatus enum for tracking payment states

5. **Define installment types**
   - InstallmentPlan interface with months, amounts, and dates
   - InstallmentBreakdown interface for payment schedule
   - InstallmentDisplay interface for UI components

6. **Add Sri Lankan specific types**
   - NICFormat enum for old and new NIC formats
   - PhoneFormat interface for +94 number handling
   - CurrencyAmount interface with LKR formatting

### Type Structure

| Category | Types |
|----------|-------|
| Providers | BNPLProvider enum |
| Eligibility | EligibilityRequest, EligibilityResponse |
| Payments | PaymentRequest, PaymentResponse |
| Installments | InstallmentPlan, InstallmentBreakdown |

### BNPL Provider Types

| Provider | Code | Display Name |
|----------|------|--------------|
| KOKO | 'koko' | 'KOKO' |
| MINTPAY | 'mintpay' | 'MintPay' |

### Eligibility Request Types

| Field | Type | Required |
|-------|------|----------|
| nic | string | Yes |
| phone | string | Yes |
| order_amount | number | Yes |
| provider | BNPLProvider | Yes |

### Payment Plan Types

| Field | Type | Description |
|-------|------|-------------|
| months | 3 \| 4 \| 6 | Plan duration |
| first_payment | number | Initial payment |
| monthly_amount | number | Monthly installment |
| total_amount | number | Order total |

### Expected Outcome
- Complete TypeScript type definitions for BNPL
- Type safety across all BNPL components
- Clear interfaces for API communication
- Sri Lankan localization support in types

### Verification Checklist
- [ ] types.ts file created
- [ ] BNPLProvider enum defined
- [ ] Eligibility types complete
- [ ] Payment types defined
- [ ] Installment types included
- [ ] Sri Lankan specific types added

---

## Task 82: Create BNPL API Client

### Overview
Implement the API client for communicating with the backend BNPL services. This client will handle eligibility checking, payment initiation, and all other BNPL-related API calls with proper error handling and type safety.

### Dependencies
- Task 81 (BNPL Types) must be complete
- HTTP client library (axios or fetch) available
- API endpoints configured

### Instructions

1. **Create client.ts file**
   - Navigate to `frontend/lib/payments/bnpl/`
   - Create `client.ts` file for API client implementation
   - Import types from types.ts file

2. **Implement base API client**
   - Create BNPLAPIClient class with base configuration
   - Set base URL and default headers
   - Include error handling and retry logic
   - Add request/response interceptors

3. **Add eligibility methods**
   - checkEligibility() method with EligibilityRequest parameter
   - Return typed EligibilityResponse
   - Handle validation errors and network issues
   - Include provider-specific logic

4. **Add payment methods**
   - initiateBNPLPayment() method with PaymentRequest
   - Return PaymentResponse with redirect information
   - Handle payment processing errors
   - Support both KOKO and MintPay flows

5. **Implement helper methods**
   - getAvailableProviders() for provider listing
   - calculateInstallments() for plan calculations
   - validateNIC() for NIC format checking
   - formatPhone() for phone number handling

6. **Add error handling**
   - Custom error classes for BNPL errors
   - Network error handling with retries
   - Validation error formatting
   - User-friendly error messages

### API Client Structure

| Method | Endpoint | Purpose |
|--------|----------|---------|
| checkEligibility | POST /api/payments/bnpl/eligibility/ | Check customer eligibility |
| initiateBNPLPayment | POST /api/payments/bnpl/initiate/ | Start payment process |
| getProviders | GET /api/payments/bnpl/providers/ | List available providers |

### Error Handling

| Error Type | Handling | User Message |
|------------|----------|--------------|
| Network | Retry 3 times | "Connection issue, please try again" |
| Validation | Return details | "Please check your information" |
| Eligibility | Show reason | "Not eligible at this time" |
| Payment | Log and show | "Payment failed, please try again" |

### Request Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Timeout | 10 seconds | Prevent hanging |
| Retries | 3 attempts | Handle network issues |
| Headers | Content-Type: application/json | API format |
| CSRF | Include token | Security |

### Expected Outcome
- Robust API client for BNPL operations
- Type-safe API communication
- Comprehensive error handling
- Support for both BNPL providers

### Verification Checklist
- [ ] client.ts file created
- [ ] BNPLAPIClient class implemented
- [ ] Eligibility methods added
- [ ] Payment methods included
- [ ] Error handling comprehensive
- [ ] Helper methods available

---

## Task 83: Create Eligibility Hook

### Overview
Create a React hook for BNPL eligibility checking using TanStack Query. This hook will manage the eligibility checking process, cache results, and provide loading states and error handling for UI components.

### Dependencies
- Task 82 (BNPL API Client) must be complete
- TanStack Query configured in the project
- React hooks knowledge available

### Instructions

1. **Create hooks.ts file**
   - Navigate to `frontend/lib/payments/bnpl/`
   - Create `hooks.ts` file for all BNPL React hooks
   - Import necessary dependencies and types

2. **Implement useBNPLEligibility hook**
   - Create hook using useQuery from TanStack Query
   - Accept NIC, phone, and order amount as parameters
   - Return eligibility status, available plans, and credit limits
   - Include loading and error states

3. **Add query configuration**
   - Set appropriate cache time (5 minutes)
   - Configure stale time (2 minutes)
   - Add retry logic for failed requests
   - Include query key structure

4. **Handle eligibility states**
   - Loading state while checking eligibility
   - Success state with eligibility results
   - Error state with user-friendly messages
   - Idle state before checking starts

5. **Add provider selection**
   - Support checking multiple providers
   - Return best available option
   - Handle provider-specific responses
   - Include fallback logic

6. **Implement caching strategy**
   - Cache eligibility results by customer
   - Invalidate cache on customer data changes
   - Background refetch for updated results
   - Manual refresh capability

### Hook Interface

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| nic | string | Yes | Sri Lankan NIC |
| phone | string | Yes | Phone number |
| orderAmount | number | Yes | Order total |
| provider | BNPLProvider | No | Preferred provider |

### Return Values

| Field | Type | Description |
|-------|------|-------------|
| data | EligibilityResponse \| undefined | Eligibility results |
| isLoading | boolean | Loading state |
| error | Error \| null | Error information |
| refetch | Function | Manual refresh |

### Query Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| cacheTime | 5 minutes | Hold results in cache |
| staleTime | 2 minutes | Consider fresh data |
| retry | 2 attempts | Network error handling |
| enabled | When params valid | Conditional execution |

### Expected Outcome
- React hook for eligibility checking
- Proper caching and state management
- Loading and error state handling
- Support for both BNPL providers

### Verification Checklist
- [ ] hooks.ts file created
- [ ] useBNPLEligibility hook implemented
- [ ] Query configuration set
- [ ] State handling complete
- [ ] Provider selection added
- [ ] Caching strategy implemented

---

## Task 84: Create Payment Hook

### Overview
Create a React hook for BNPL payment initiation using TanStack Query's useMutation. This hook will handle the payment initiation process, manage loading states, and provide success/error callbacks for UI integration.

### Dependencies
- Task 83 (Eligibility Hook) must be complete
- useMutation from TanStack Query available

### Instructions

1. **Add useBNPLPayment hook to hooks.ts**
   - Use useMutation for payment initiation
   - Accept payment request parameters
   - Handle success and error callbacks
   - Return mutation functions and states

2. **Implement payment mutation**
   - Call BNPLAPIClient.initiateBNPLPayment()
   - Handle redirect URLs in success response
   - Manage error states and retry logic
   - Include payment tracking

3. **Add success handling**
   - Extract redirect URL from response
   - Trigger onSuccess callback with payment data
   - Update payment state in cache
   - Prepare for redirect to provider

4. **Handle error scenarios**
   - Network errors with retry capability
   - Validation errors with field-specific messages
   - Payment rejection with reason codes
   - Provider unavailability fallback

5. **Support payment tracking**
   - Generate unique payment request IDs
   - Store payment attempts for retry
   - Track payment status changes
   - Log payment events for debugging

6. **Add provider-specific logic**
   - Handle KOKO-specific requirements
   - Support MintPay workflow differences
   - Manage provider failover scenarios
   - Include provider preference handling

### Hook Interface

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| onSuccess | Function | No | Success callback |
| onError | Function | No | Error callback |
| onSettled | Function | No | Always called |

### Mutation Variables

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| provider | BNPLProvider | Yes | Selected provider |
| orderId | string | Yes | Order identifier |
| customerData | object | Yes | Customer information |
| plan | InstallmentPlan | Yes | Selected plan |

### Return Values

| Field | Type | Description |
|-------|------|-------------|
| mutate | Function | Trigger payment |
| data | PaymentResponse \| undefined | Payment results |
| isLoading | boolean | Mutation in progress |
| error | Error \| null | Error information |
| reset | Function | Reset mutation state |

### Expected Outcome
- React hook for payment initiation
- Proper mutation state management
- Success and error handling
- Provider-specific logic support

### Verification Checklist
- [ ] useBNPLPayment hook added
- [ ] Mutation configuration set
- [ ] Success handling implemented
- [ ] Error scenarios covered
- [ ] Payment tracking added
- [ ] Provider logic included

---

## Task 85: Create KOKO Button

### Overview
Create a React component for KOKO payment button with proper branding, loading states, and payment initiation integration. The button will provide a user-friendly interface for customers to select KOKO as their BNPL provider.

### Dependencies
- Task 84 (Payment Hook) must be complete
- KOKO branding assets available
- Button styling components ready

### Instructions

1. **Create KOKOButton.tsx component**
   - Navigate to `frontend/components/checkout/`
   - Create `KOKOButton.tsx` file for KOKO payment button
   - Use TypeScript and proper component structure

2. **Implement button functionality**
   - Accept order ID, amount, and callback props
   - Use useBNPLPayment hook for payment initiation
   - Handle loading states during payment processing
   - Include error handling and user feedback

3. **Add KOKO branding**
   - Include KOKO logo and colors
   - Use official KOKO branding guidelines
   - Add "Pay with KOKO" text
   - Include installment messaging

4. **Implement button states**
   - Default state with KOKO branding
   - Loading state with spinner
   - Disabled state for invalid orders
   - Error state with retry option

5. **Add eligibility integration**
   - Check eligibility before showing button
   - Hide button if customer not eligible
   - Show installment preview on hover
   - Include eligibility messaging

6. **Handle payment flow**
   - Trigger payment initiation on click
   - Show loading state during processing
   - Redirect to KOKO checkout on success
   - Display error messages on failure

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| orderId | string | Yes | Order identifier |
| amount | number | Yes | Order total |
| onSuccess | Function | No | Success callback |
| onError | Function | No | Error callback |
| disabled | boolean | No | Disable button |

### Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | KOKO logo + text | Clickable |
| Loading | Spinner + "Processing..." | Disabled |
| Error | Error icon + "Try again" | Retry click |
| Disabled | Grayed out | No interaction |

### KOKO Branding

| Element | Specification |
|---------|---------------|
| Logo | KOKO official logo |
| Colors | Primary: #FF6B35, Secondary: #1A1A1A |
| Text | "Pay with KOKO" |
| Font | System font, bold |

### Expected Outcome
- KOKO-branded payment button component
- Proper payment flow integration
- Loading and error state handling
- Eligibility checking integration

### Verification Checklist
- [ ] KOKOButton.tsx component created
- [ ] Button functionality implemented
- [ ] KOKO branding applied
- [ ] Button states handled
- [ ] Eligibility integration added
- [ ] Payment flow complete

---

## Task 86: Create MintPay Button

### Overview
Create a React component for MintPay payment button with proper branding, loading states, and payment initiation integration. The button will provide a user-friendly interface for customers to select MintPay as their BNPL provider.

### Dependencies
- Task 85 (KOKO Button) must be complete
- MintPay branding assets available
- Consistent button styling established

### Instructions

1. **Create MintPayButton.tsx component**
   - Navigate to `frontend/components/checkout/`
   - Create `MintPayButton.tsx` file for MintPay payment button
   - Follow similar structure to KOKO button

2. **Implement button functionality**
   - Use same props interface as KOKO button
   - Integrate with useBNPLPayment hook
   - Handle MintPay-specific payment flow
   - Include proper error handling

3. **Add MintPay branding**
   - Include MintPay logo and brand colors
   - Use official MintPay branding guidelines
   - Add "Pay with MintPay" text
   - Include MintPay-specific messaging

4. **Implement consistent states**
   - Follow same state pattern as KOKO button
   - Customize messages for MintPay
   - Include MintPay-specific loading states
   - Handle MintPay error responses

5. **Add MintPay eligibility**
   - Check MintPay eligibility requirements
   - Show/hide based on eligibility
   - Include MintPay-specific eligibility rules
   - Display appropriate messaging

6. **Handle MintPay payment flow**
   - Initiate MintPay payment on click
   - Handle MintPay-specific parameters
   - Process MintPay redirect URLs
   - Manage MintPay error codes

### Component Consistency

| Feature | KOKO Button | MintPay Button |
|---------|-------------|----------------|
| Props | Same interface | Same interface |
| States | Same states | Same states |
| Flow | KOKO-specific | MintPay-specific |
| Branding | KOKO colors | MintPay colors |

### MintPay Branding

| Element | Specification |
|---------|---------------|
| Logo | MintPay official logo |
| Colors | Primary: #00C851, Secondary: #333333 |
| Text | "Pay with MintPay" |
| Font | System font, bold |

### MintPay Specifics

| Aspect | Implementation |
|--------|----------------|
| Provider | BNPLProvider.MINTPAY |
| API | MintPay endpoints |
| Flow | MintPay checkout |
| Errors | MintPay error codes |

### Expected Outcome
- MintPay-branded payment button component
- Consistent behavior with KOKO button
- MintPay-specific payment integration
- Proper branding and messaging

### Verification Checklist
- [ ] MintPayButton.tsx component created
- [ ] Consistent functionality with KOKO
- [ ] MintPay branding applied
- [ ] MintPay-specific flow implemented
- [ ] Eligibility checking added
- [ ] Payment integration complete

---

## Task 87: Create Installment Preview

### Overview
Create a React component that displays BNPL installment breakdown for customers. This component will show payment schedules, amounts, and due dates in a clear, user-friendly format to help customers understand their payment obligations.

### Dependencies
- Task 86 (MintPay Button) must be complete
- Installment calculation logic available
- Date formatting utilities ready

### Instructions

1. **Create InstallmentPreview.tsx component**
   - Navigate to `frontend/components/checkout/`
   - Create `InstallmentPreview.tsx` file for installment display
   - Use table or list format for payment schedule

2. **Accept installment data**
   - Take InstallmentPlan as prop
   - Accept order amount and plan duration
   - Include provider information
   - Support currency formatting

3. **Display payment schedule**
   - Show installment number and dates
   - Display payment amounts in LKR
   - Include first payment highlight
   - Show total order amount

4. **Add visual enhancements**
   - Use icons for payment status
   - Include progress indicators
   - Add hover effects for details
   - Include mobile-responsive design

5. **Handle different plan types**
   - Support 3, 4, and 6-month plans
   - Show plan-specific information
   - Include provider differences
   - Display zero-interest messaging

6. **Add interactive features**
   - Allow plan switching
   - Include payment reminders
   - Show calculation breakdown
   - Add terms and conditions links

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| plan | InstallmentPlan | Yes | Payment plan data |
| amount | number | Yes | Order total |
| provider | BNPLProvider | Yes | BNPL provider |
| onPlanChange | Function | No | Plan change callback |

### Display Format

| Column | Content | Example |
|--------|---------|---------|
| Payment | Payment number | "1 of 4" |
| Date | Due date | "Feb 15, 2024" |
| Amount | Payment amount | "₨2,500" |
| Status | Payment status | "Due" |

### Plan Display

| Plan Type | First Payment | Monthly | Total |
|-----------|---------------|---------|-------|
| 3-month | ₨3,333 | ₨3,333 | ₨10,000 |
| 4-month | ₨2,500 | ₨2,500 | ₨10,000 |
| 6-month | ₨1,667 | ₨1,667 | ₨10,000 |

### Expected Outcome
- Clear installment payment preview
- User-friendly payment schedule display
- Support for all BNPL plan types
- Mobile-responsive design

### Verification Checklist
- [ ] InstallmentPreview.tsx component created
- [ ] Payment schedule display implemented
- [ ] Plan type support added
- [ ] Visual enhancements included
- [ ] Interactive features added
- [ ] Mobile responsiveness ensured

---

## Task 88: Create BNPL Badge

### Overview
Create a small badge component that displays BNPL availability on product pages and throughout the storefront. This badge will inform customers about BNPL options and help drive BNPL adoption with clear messaging about payment plans.

### Dependencies
- Task 87 (Installment Preview) must be complete
- Product page integration points identified
- Badge styling components available

### Instructions

1. **Create BNPLBadge.tsx component**
   - Navigate to `frontend/components/checkout/`
   - Create `BNPLBadge.tsx` file for BNPL messaging
   - Design as small, unobtrusive badge

2. **Implement badge functionality**
   - Accept minimum order amount as prop
   - Calculate lowest monthly payment
   - Show BNPL availability message
   - Include provider logos

3. **Design badge appearance**
   - Small, eye-catching design
   - Include BNPL provider icons
   - Use attractive colors and typography
   - Ensure mobile compatibility

4. **Add messaging logic**
   - Show "Pay in 4 from ₨X/month" message
   - Calculate based on 4-month plan
   - Include zero-interest messaging
   - Add eligibility disclaimer

5. **Implement click behavior**
   - Open installment preview on click
   - Show more details about BNPL
   - Include eligibility information
   - Link to BNPL terms

6. **Add conditional display**
   - Only show for eligible order amounts
   - Hide if BNPL not available
   - Include A/B testing support
   - Add admin configuration options

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| amount | number | Yes | Product/order amount |
| size | 'small' \| 'medium' | No | Badge size |
| providers | BNPLProvider[] | No | Available providers |
| onClick | Function | No | Click handler |

### Badge Messaging

| Amount Range | Message | Example |
|--------------|---------|---------|
| ₨5,000-₨20,000 | "Pay in 4 from ₨X/month" | "Pay in 4 from ₨1,250/month" |
| ₨20,000-₨50,000 | "Pay in 4 from ₨X/month" | "Pay in 4 from ₨5,000/month" |
| Above ₨50,000 | "BNPL available" | "BNPL available" |

### Badge Design

| Element | Specification |
|---------|---------------|
| Size | Small (80px width max) |
| Colors | Soft gradient background |
| Text | White or dark contrast |
| Icons | Provider logos |
| Border | Rounded corners |

### Expected Outcome
- Attractive BNPL badge component
- Clear BNPL messaging for customers
- Integration points for product pages
- Conditional display logic

### Verification Checklist
- [ ] BNPLBadge.tsx component created
- [ ] Badge functionality implemented
- [ ] Messaging logic added
- [ ] Design appearance finalized
- [ ] Click behavior implemented
- [ ] Conditional display added