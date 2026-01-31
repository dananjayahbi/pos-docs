# Tasks 01-10: Coupon Types, API Client, and Store

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** A - Coupon System Backend Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-11-18_Validation-Verify.md](02_Tasks-11-18_Validation-Verify.md)

---

## Document Overview

This document covers the creation of the coupon system backend integration foundation, including TypeScript interfaces for coupon types, API client setup with validation/apply/remove endpoints, TanStack Query hooks for server state management, Zustand store for client-side coupon state, and core discount calculation logic for percentage, fixed amount, and free shipping coupons.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Coupon Types Interface | Medium | 30 min |
| 02 | Create Coupon API Client | Medium | 35 min |
| 03 | Create Validate Coupon API | Medium | 30 min |
| 04 | Create Apply Coupon API | Medium | 35 min |
| 05 | Create Remove Coupon API | Low | 20 min |
| 06 | Create Coupon Query Hook | Medium | 30 min |
| 07 | Create Apply Coupon Mutation | Medium | 35 min |
| 08 | Create Coupon Store | Medium | 40 min |
| 09 | Create Percentage Discount | Low | 25 min |
| 10 | Create Fixed Discount | Low | 25 min |

---

## Task 01: Create Coupon Types Interface

### Overview
Create comprehensive TypeScript interfaces for the coupon system. Define types for coupon entities, discount types (percentage, fixed, free shipping), validation responses, and restriction rules. These types ensure type safety across the coupon system and provide clear contracts between frontend and backend.

### Dependencies
- SubPhase-13 (Cart System) must be complete
- TypeScript configuration is set up
- Frontend project structure is established

### Instructions

1. **Create marketing types directory**
   - Navigate to `frontend/types/` directory
   - Create new directory named `marketing`
   - This will house all marketing-related type definitions

2. **Create coupon types file**
   - Create `coupon.types.ts` in `types/marketing/` directory
   - Import necessary base types if needed
   - Set up file structure with clear sections

3. **Define discount type enum**
   - Create `DiscountType` enum or union type
   - Include values: `percentage`, `fixed_amount`, `free_shipping`
   - Add JSDoc comments explaining each type

4. **Define coupon status enum**
   - Create `CouponStatus` enum
   - Include: `active`, `inactive`, `expired`, `exhausted`
   - Document status meanings

5. **Create base coupon interface**
   - Define `Coupon` interface with all core fields
   - Include: id, code, title, description
   - Add discount type and value fields
   - Include status and dates (start, expiry)

6. **Define restriction interfaces**
   - Create `CouponRestrictions` interface
   - Include minimum order amount field
   - Add maximum discount cap field (optional)
   - Include product IDs array (optional)
   - Add category IDs array (optional)
   - Include first order only flag
   - Add user-specific fields (usage limits)

7. **Create validation request interface**
   - Define `ValidateCouponRequest` interface
   - Include coupon code field
   - Add cart total field
   - Include user ID (optional, for logged-in users)
   - Add cart items array for product/category validation

8. **Create validation response interface**
   - Define `ValidateCouponResponse` interface
   - Include valid boolean flag
   - Add coupon object (if valid)
   - Include discount amount calculated
   - Add error message field (if invalid)
   - Include validation details object

9. **Define apply coupon request interface**
   - Create `ApplyCouponRequest` interface
   - Include coupon code field
   - Add cart total and items
   - Include user ID if applicable

10. **Define apply coupon response interface**
    - Create `ApplyCouponResponse` interface
    - Include success boolean
    - Add applied coupon object
    - Include calculated discount
    - Add new cart total after discount
    - Include message field

11. **Create remove coupon request interface**
    - Define `RemoveCouponRequest` interface
    - Include coupon code to remove
    - Add cart identifier if needed

12. **Add utility types**
    - Create `CouponFormData` type for forms
    - Add `CouponListItem` type for list displays
    - Create `CouponSummary` type for cart display

### Coupon Type Structure

```
Coupon
├── Core Fields
│   ├── id: string
│   ├── code: string (unique, uppercase)
│   ├── title: string
│   ├── description: string
│   └── status: CouponStatus
├── Discount Configuration
│   ├── discountType: DiscountType
│   ├── discountValue: number
│   └── maxDiscountCap?: number (for percentage)
├── Restrictions
│   ├── minOrderAmount?: number (LKR)
│   ├── applicableProducts?: string[]
│   ├── applicableCategories?: string[]
│   ├── firstOrderOnly?: boolean
│   ├── usageLimitPerUser?: number
│   └── totalUsageLimit?: number
└── Dates
    ├── startDate: Date | string
    ├── expiryDate: Date | string
    ├── createdAt: Date | string
    └── updatedAt: Date | string
```

### Discount Type Details

| Type | Value Field | Description | Example |
|------|-------------|-------------|---------|
| percentage | 5-50 (typical) | Percentage off cart total | 10 = 10% off |
| fixed_amount | Amount in LKR | Fixed amount off | 500 = ₨500 off |
| free_shipping | Not applicable | Waives shipping fee | N/A |

### Validation Response Structure

```
ValidateCouponResponse
├── valid: boolean
├── coupon?: Coupon (if valid)
├── discount?: number (calculated LKR)
├── message: string
└── validationDetails?: {
    ├── minOrderMet: boolean
    ├── notExpired: boolean
    ├── withinUsageLimit: boolean
    ├── productRestrictionMet: boolean
    └── categoryRestrictionMet: boolean
}
```

### Field Specifications

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| code | string | Yes | 6-20 chars, uppercase | Unique coupon code |
| discountType | enum | Yes | One of 3 types | Type of discount |
| discountValue | number | Yes | > 0 | Discount value |
| minOrderAmount | number | No | ≥ 0 | Minimum order (₨) |
| startDate | Date/string | Yes | Valid date | When coupon activates |
| expiryDate | Date/string | Yes | After startDate | When coupon expires |
| usageLimitPerUser | number | No | > 0 | Max uses per user |
| totalUsageLimit | number | No | > 0 | Total usage cap |

### Interface Relationships

```
┌─────────────────┐
│     Coupon      │
└────────┬────────┘
         │
         ├──────────────┬──────────────┬────────────────┐
         │              │              │                │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌──────▼──────┐
    │Discount │   │Restrict │   │ Status  │   │    Dates    │
    │  Type   │   │  ions   │   │         │   │             │
    └─────────┘   └─────────┘   └─────────┘   └─────────────┘
         │              │
         ▼              ▼
    Validation     Application
      Logic           Logic
```

### Expected Outcome
- Comprehensive TypeScript interfaces for coupon system
- Clear type definitions for all coupon operations
- Type safety for API requests and responses
- Documented interfaces with JSDoc comments
- Foundation for type-safe coupon implementation

### Verification Checklist
- [ ] `frontend/types/marketing/coupon.types.ts` file created
- [ ] DiscountType enum/union type defined
- [ ] CouponStatus enum defined
- [ ] Coupon interface with all core fields
- [ ] CouponRestrictions interface defined
- [ ] ValidateCouponRequest interface created
- [ ] ValidateCouponResponse interface created
- [ ] ApplyCouponRequest interface created
- [ ] ApplyCouponResponse interface created
- [ ] RemoveCouponRequest interface created
- [ ] Utility types added (FormData, ListItem, Summary)
- [ ] JSDoc comments added for clarity
- [ ] All fields properly typed with TypeScript
- [ ] File exports all interfaces correctly

---

## Task 02: Create Coupon API Client

### Overview
Create a centralized coupon API client that handles all HTTP communications with the backend coupon service. This client provides methods for validating, applying, and removing coupons, with built-in error handling, request/response transformation, and integration with the application's authentication system.

### Dependencies
- Task 01: Create Coupon Types Interface
- API configuration setup from earlier SubPhases
- Axios or fetch client configuration

### Instructions

1. **Create marketing lib directory**
   - Navigate to `frontend/lib/` directory
   - Create `marketing` subdirectory if not exists
   - This houses all marketing-related API clients

2. **Create coupon API client file**
   - Create `coupon.ts` in `lib/marketing/` directory
   - Import coupon types from Task 01
   - Import base API client or HTTP client

3. **Import dependencies**
   - Import Axios or native fetch
   - Import coupon types (Coupon, ValidateCouponRequest, etc.)
   - Import API error handler
   - Import authentication token getter

4. **Define API endpoint constants**
   - Create constants for coupon endpoints
   - Base path: `/api/webstore/coupons`
   - Validate endpoint: `/api/webstore/coupons/validate`
   - Apply endpoint: `/api/webstore/coupons/apply`
   - Remove endpoint: `/api/webstore/coupons/remove`

5. **Create API client class or object**
   - Structure as class or plain object with methods
   - Include base URL configuration
   - Set up default headers (Content-Type, Authorization)

6. **Implement validateCoupon method**
   - Accept ValidateCouponRequest parameter
   - Make POST request to validate endpoint
   - Include cart total and coupon code in body
   - Return ValidateCouponResponse
   - Handle validation errors appropriately

7. **Implement applyCoupon method**
   - Accept ApplyCouponRequest parameter
   - Make POST request to apply endpoint
   - Include cart details and coupon code
   - Return ApplyCouponResponse with discount
   - Handle application errors

8. **Implement removeCoupon method**
   - Accept RemoveCouponRequest parameter
   - Make DELETE or POST request to remove endpoint
   - Include coupon code or cart identifier
   - Return success confirmation
   - Handle removal errors

9. **Add request interceptor**
   - Attach authentication token to all requests
   - Add tenant identifier if multi-tenant
   - Include common headers

10. **Add response interceptor**
    - Transform successful responses
    - Handle common error scenarios
    - Map backend errors to frontend format
    - Log errors for debugging

11. **Implement error handling**
    - Create custom error types for coupon errors
    - Handle network errors gracefully
    - Provide user-friendly error messages
    - Return appropriate error objects

12. **Add helper methods (optional)**
    - Create formatCouponCode method (uppercase, trim)
    - Add parseCouponResponse helper
    - Include retry logic for failed requests

### API Client Structure

```
CouponAPI
├── Configuration
│   ├── baseURL
│   ├── timeout
│   └── headers
├── Methods
│   ├── validateCoupon(request): Promise<ValidateCouponResponse>
│   ├── applyCoupon(request): Promise<ApplyCouponResponse>
│   ├── removeCoupon(request): Promise<void>
│   └── getCouponDetails(code): Promise<Coupon>
├── Interceptors
│   ├── Request Interceptor (auth, headers)
│   └── Response Interceptor (transform, errors)
└── Error Handling
    ├── Network errors
    ├── Validation errors
    └── Server errors
```

### API Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/api/webstore/coupons/validate` | Validate coupon | code, cartTotal, items | ValidateCouponResponse |
| POST | `/api/webstore/coupons/apply` | Apply to cart | code, cartTotal, items, userId | ApplyCouponResponse |
| DELETE | `/api/webstore/coupons/remove` | Remove from cart | code or cartId | Success message |
| GET | `/api/webstore/coupons/:code` | Get details | - | Coupon object |

### Request/Response Flow

```
Frontend Component
       │
       ▼
   API Client Method
       │
       ├──> Request Interceptor
       │    └─> Add auth token
       │    └─> Add headers
       │
       ▼
   HTTP Request
       │
       ▼
   Backend API
       │
       ▼
   HTTP Response
       │
       ├──> Response Interceptor
       │    └─> Transform data
       │    └─> Handle errors
       │
       ▼
   Component (with data or error)
```

### Error Handling Strategy

| Error Type | Status Code | Handling |
|------------|-------------|----------|
| Invalid Code | 400 | Return validation error |
| Expired | 400 | Return expiry message |
| Not Applicable | 400 | Return restriction message |
| Unauthorized | 401 | Redirect to login |
| Not Found | 404 | Return "Code not found" |
| Server Error | 500 | Return generic error |
| Network Error | - | Return connection error |

### Request Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Type | application/json | JSON payload |
| Authorization | Bearer {token} | Authentication |
| X-Tenant-ID | {tenantId} | Multi-tenancy |
| Accept | application/json | Expected response |

### Expected Outcome
- Fully functional coupon API client
- Type-safe API methods with TypeScript
- Proper error handling for all scenarios
- Request/response interceptors configured
- Ready for integration with React Query hooks

### Verification Checklist
- [ ] `frontend/lib/marketing/coupon.ts` file created
- [ ] API endpoint constants defined
- [ ] validateCoupon method implemented
- [ ] applyCoupon method implemented
- [ ] removeCoupon method implemented
- [ ] Request interceptor adds authentication
- [ ] Response interceptor handles errors
- [ ] Custom error types defined
- [ ] Helper methods for code formatting
- [ ] All methods return typed promises
- [ ] JSDoc comments for all methods
- [ ] File exports API client properly

---

## Task 03: Create Validate Coupon API

### Overview
Implement the validate coupon API integration that checks whether a coupon code is valid for the current cart without actually applying it. This provides real-time validation feedback to users as they enter coupon codes, checking expiry, usage limits, minimum order requirements, and restrictions before committing the coupon to the cart.

### Dependencies
- Task 02: Create Coupon API Client
- Cart state available (from SubPhase-13)

### Instructions

1. **Extend coupon API client**
   - Open `lib/marketing/coupon.ts` file
   - Ensure validateCoupon method is complete
   - Verify type imports from Task 01

2. **Define validation request structure**
   - Structure request with required fields
   - Include coupon code (string)
   - Add current cart total (number in LKR)
   - Include cart items array with product IDs
   - Add user ID if user is logged in

3. **Implement validation endpoint call**
   - Use POST method to validation endpoint
   - Send request payload with cart context
   - Set appropriate timeout (5 seconds)
   - Include error handling

4. **Process validation response**
   - Parse response from backend
   - Extract validation result (valid boolean)
   - Get discount amount if valid
   - Extract error messages if invalid
   - Parse validation details object

5. **Handle validation success**
   - Return full coupon details
   - Include calculated discount amount
   - Provide applicable message
   - Return validation breakdown

6. **Handle validation failures**
   - Map backend error codes to messages
   - Return user-friendly error messages
   - Include validation failure reasons
   - Provide helpful guidance

7. **Implement specific validation checks**
   - Coupon exists check
   - Active status verification
   - Expiry date validation
   - Minimum order amount check
   - Product restriction validation
   - Category restriction validation
   - Usage limit verification

8. **Add validation caching (optional)**
   - Cache validation results temporarily
   - Invalidate cache on cart changes
   - Reduce redundant API calls

### Validation Request Structure

```
ValidateCouponRequest {
  code: "SAVE10"
  cartTotal: 15000  (₨)
  items: [
    { productId: "p123", quantity: 2, categoryId: "cat1" }
    { productId: "p456", quantity: 1, categoryId: "cat2" }
  ]
  userId?: "user789"  (optional, for logged-in users)
}
```

### Validation Response Structure

```
Success Response:
{
  valid: true
  coupon: { /* Full coupon object */ }
  discount: 1500  (₨)
  message: "Coupon applied successfully! You save ₨1,500"
  validationDetails: {
    minOrderMet: true
    notExpired: true
    withinUsageLimit: true
    productRestrictionMet: true
    categoryRestrictionMet: true
  }
}

Failure Response:
{
  valid: false
  message: "Minimum order of ₨20,000 required"
  validationDetails: {
    minOrderMet: false
    notExpired: true
    withinUsageLimit: true
  }
}
```

### Validation Checks Flow

```
Validate Coupon Request
       │
       ▼
┌──────────────────┐
│  Code Exists?    │──No──> Error: "Invalid code"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│  Is Active?      │──No──> Error: "Coupon inactive"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│  Not Expired?    │──No──> Error: "Coupon expired"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│  Min Order Met?  │──No──> Error: "Minimum ₨X required"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Usage Limit OK?  │──No──> Error: "Usage limit reached"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Product Valid?   │──No──> Error: "Not applicable to cart items"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Category Valid?  │──No──> Error: "Not applicable to categories"
└────────┬─────────┘
         │ Yes
         ▼
    Valid! Calculate Discount
```

### Validation Error Messages

| Validation Failure | Error Message | User Action |
|-------------------|---------------|-------------|
| Code not found | "Invalid coupon code" | Check code spelling |
| Inactive | "This coupon is not active" | Contact support |
| Expired | "This coupon has expired" | Use different code |
| Min order not met | "Minimum order of ₨{amount} required" | Add more items |
| Usage limit | "You've reached usage limit for this coupon" | Use different code |
| Product restriction | "This coupon is not valid for items in your cart" | Check applicable products |
| Category restriction | "This coupon doesn't apply to selected categories" | Check applicable categories |
| First order only | "This coupon is for first-time customers only" | Use different code |

### Discount Calculation Examples

| Type | Cart Total | Coupon Value | Calculated Discount |
|------|------------|--------------|---------------------|
| Percentage | ₨10,000 | 10% | ₨1,000 |
| Percentage (capped) | ₨50,000 | 20% (max ₨5,000) | ₨5,000 |
| Fixed Amount | ₨8,000 | ₨500 | ₨500 |
| Fixed (exceeds total) | ₨300 | ₨500 | ₨300 (max total) |
| Free Shipping | ₨5,000 | N/A | ₨350 (shipping fee) |

### Expected Outcome
- Functional validation API integration
- Real-time coupon validation capability
- Clear validation error messages
- Calculated discount preview before applying
- Foundation for user feedback UI

### Verification Checklist
- [ ] validateCoupon method in API client is complete
- [ ] Request includes all required fields
- [ ] Response handling for valid coupons
- [ ] Response handling for invalid coupons
- [ ] All validation checks mapped to errors
- [ ] Discount calculation returned correctly
- [ ] User-friendly error messages defined
- [ ] TypeScript types used correctly
- [ ] Error handling for network failures
- [ ] Method returns typed promise

---

## Task 04: Create Apply Coupon API

### Overview
Implement the apply coupon API integration that actually applies a validated coupon to the user's cart. This endpoint commits the coupon application, updates the cart with the discount, and returns the new cart total. It includes final validation checks to ensure the coupon is still valid at application time.

### Dependencies
- Task 03: Create Validate Coupon API
- Cart update mechanism available

### Instructions

1. **Extend coupon API client**
   - Open `lib/marketing/coupon.ts` file
   - Implement applyCoupon method
   - Ensure proper typing from Task 01

2. **Define apply request structure**
   - Include coupon code to apply
   - Add complete cart details (items, quantities)
   - Include cart total (pre-discount)
   - Add user ID for tracking
   - Include session or cart identifier

3. **Implement apply endpoint call**
   - Use POST method to apply endpoint
   - Send comprehensive cart state
   - Include authentication token
   - Set reasonable timeout (10 seconds)

4. **Process apply response**
   - Extract success status
   - Get applied coupon object
   - Parse calculated discount amount
   - Extract new cart total after discount
   - Get application timestamp

5. **Handle successful application**
   - Return complete application result
   - Include discount breakdown
   - Provide success message
   - Return updated cart summary

6. **Handle application failures**
   - Catch validation failures (coupon became invalid)
   - Handle concurrent usage issues
   - Manage server errors gracefully
   - Provide clear failure reasons

7. **Implement post-application actions**
   - Trigger cart state update
   - Update coupon usage tracking
   - Log application for analytics
   - Invalidate validation cache

8. **Add optimistic update handling**
   - Prepare for optimistic UI updates
   - Include rollback mechanism
   - Handle race conditions

9. **Implement usage tracking**
   - Record application in backend
   - Increment user usage count
   - Increment global usage count
   - Update last used timestamp

### Apply Request Structure

```
ApplyCouponRequest {
  code: "SAVE10"
  cartTotal: 15000  (₨)
  items: [
    {
      productId: "p123"
      productName: "Product A"
      quantity: 2
      price: 5000
      categoryId: "cat1"
    }
    {
      productId: "p456"
      productName: "Product B"
      quantity: 1
      price: 5000
      categoryId: "cat2"
    }
  ]
  userId: "user789"
  cartId: "cart_abc123"
  sessionId: "session_xyz789"
}
```

### Apply Response Structure

```
Success Response:
{
  success: true
  appliedCoupon: {
    id: "coupon_123"
    code: "SAVE10"
    discountType: "percentage"
    discountValue: 10
  }
  discount: 1500  (₨)
  originalTotal: 15000  (₨)
  newTotal: 13500  (₨)
  message: "Coupon applied! You save ₨1,500"
  appliedAt: "2026-01-31T10:30:00Z"
}

Failure Response:
{
  success: false
  message: "Coupon expired since validation"
  error: {
    code: "COUPON_EXPIRED"
    details: "Coupon expired at 2026-01-31T10:00:00Z"
  }
}
```

### Application Flow

```
User Clicks "Apply"
       │
       ▼
┌──────────────────┐
│ Validate Again   │──> Re-check all conditions
└────────┬─────────┘
         │ Valid
         ▼
┌──────────────────┐
│ Calculate Final  │──> Compute exact discount
│    Discount      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Apply to Cart    │──> Update cart state
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Track Usage      │──> Increment counters
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Return Result    │──> Success + new total
└──────────────────┘
```

### Application Scenarios

| Scenario | Outcome | Message |
|----------|---------|---------|
| Valid application | Success | "Coupon applied! You save ₨{amount}" |
| Expired between validate and apply | Failure | "Coupon expired, please try another" |
| Usage limit reached | Failure | "Usage limit reached while processing" |
| Cart changed | Failure | "Cart changed, please validate again" |
| Concurrent application | Failure | "Coupon already applied" |
| Server error | Failure | "Unable to apply coupon, try again" |

### Discount Application Logic

```
Original Cart Total: ₨15,000

Percentage Discount (10%):
├─> Discount Amount: ₨15,000 × 0.10 = ₨1,500
└─> New Total: ₨15,000 - ₨1,500 = ₨13,500

Fixed Amount Discount (₨500):
├─> Discount Amount: ₨500
└─> New Total: ₨15,000 - ₨500 = ₨14,500

Free Shipping:
├─> Shipping Fee: ₨350
├─> Discount Amount: ₨350
├─> Cart Subtotal: ₨15,000 (unchanged)
└─> New Total: ₨15,000 + ₨0 = ₨15,000
```

### Usage Tracking

| Field | Purpose | Update Trigger |
|-------|---------|----------------|
| userUsageCount | Track per-user usage | On successful apply |
| totalUsageCount | Track global usage | On successful apply |
| lastUsedAt | Last application time | On successful apply |
| lastUsedBy | Last user ID | On successful apply |

### Error Codes

| Code | Description | User Message |
|------|-------------|--------------|
| COUPON_EXPIRED | Coupon expired | "This coupon has expired" |
| USAGE_LIMIT_REACHED | Max usage hit | "Usage limit reached" |
| CART_CHANGED | Cart modified | "Cart changed, validate again" |
| ALREADY_APPLIED | Duplicate application | "Coupon already applied" |
| INVALID_CART | Cart data invalid | "Unable to process cart" |
| SERVER_ERROR | Backend error | "Try again in a moment" |

### Expected Outcome
- Functional apply coupon API integration
- Reliable coupon application to cart
- Accurate discount calculation and cart update
- Proper usage tracking implementation
- Clear success/failure feedback

### Verification Checklist
- [ ] applyCoupon method implemented in API client
- [ ] Request includes complete cart details
- [ ] Response includes discount and new total
- [ ] Success response handled properly
- [ ] Failure scenarios handled with messages
- [ ] Re-validation performed before application
- [ ] Usage tracking incremented on success
- [ ] Cart state update triggered
- [ ] TypeScript types used correctly
- [ ] Error handling for all scenarios
- [ ] Method returns typed promise

---

## Task 05: Create Remove Coupon API

### Overview
Implement the remove coupon API integration that removes an applied coupon from the cart, reverting the discount and restoring the original cart total. This provides users the ability to remove coupons and try different ones or proceed without a discount.

### Dependencies
- Task 04: Create Apply Coupon API

### Instructions

1. **Extend coupon API client**
   - Open `lib/marketing/coupon.ts` file
   - Implement removeCoupon method
   - Import necessary types

2. **Define remove request structure**
   - Include coupon code to remove (or "current")
   - Add cart identifier
   - Include user ID if applicable
   - Add session identifier

3. **Implement remove endpoint call**
   - Use DELETE or POST method to remove endpoint
   - Send cart and coupon identifiers
   - Include authentication token
   - Set short timeout (3 seconds)

4. **Process remove response**
   - Extract success confirmation
   - Get original cart total (restored)
   - Parse removal message
   - Extract updated cart state

5. **Handle successful removal**
   - Return success status
   - Include restored cart total
   - Provide confirmation message
   - Clear coupon from state

6. **Handle removal failures**
   - Handle "no coupon applied" scenario
   - Manage server errors
   - Provide user-friendly messages

7. **Implement post-removal actions**
   - Trigger cart state update
   - Clear coupon from local state
   - Invalidate query cache
   - Reset discount calculations

8. **Add optimistic removal handling**
   - Enable instant UI update
   - Rollback on failure
   - Maintain cart consistency

### Remove Request Structure

```
RemoveCouponRequest {
  code?: "SAVE10"  (optional, or remove current)
  cartId: "cart_abc123"
  userId?: "user789"
  action: "remove"
}

Or simplified:
{
  cartId: "cart_abc123"
}
```

### Remove Response Structure

```
Success Response:
{
  success: true
  message: "Coupon removed"
  restoredTotal: 15000  (₨)
  previousDiscount: 1500  (₨)
}

Failure Response:
{
  success: false
  message: "No coupon applied to cart"
}
```

### Removal Flow

```
User Clicks "Remove Coupon"
       │
       ▼
┌──────────────────┐
│ Check Coupon     │──> Verify coupon exists
│    Applied       │
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Send Remove      │──> POST/DELETE to API
│   Request        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Clear Discount   │──> Reset cart total
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update UI        │──> Remove coupon display
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Show Message     │──> "Coupon removed"
└──────────────────┘
```

### Removal Scenarios

| Scenario | API Call | Outcome | Message |
|----------|----------|---------|---------|
| Coupon applied | Yes | Success | "Coupon removed" |
| No coupon | No | Skip | "No coupon to remove" |
| Server error | Yes | Failure | "Try again" |
| Network error | Yes | Failure | "Connection error" |

### State Changes on Removal

| State | Before | After |
|-------|--------|-------|
| appliedCoupon | Coupon object | null |
| discount | ₨1,500 | ₨0 |
| cartTotal | ₨13,500 | ₨15,000 |
| isLoading | false | true → false |

### Optimistic Update Example

```
Optimistic Removal (Instant UI Update):
1. User clicks "Remove"
2. UI immediately:
   ├─> Sets appliedCoupon to null
   ├─> Sets discount to 0
   ├─> Restores original total
   └─> Shows "Coupon removed" message

3. API call sent in background
4. On Success:
   └─> Confirm state (already updated)
5. On Failure:
   ├─> Rollback to previous state
   ├─> Reapply coupon
   └─> Show error message
```

### Expected Outcome
- Functional remove coupon API integration
- Clean coupon removal from cart
- Cart total restoration to original amount
- Clear user feedback on removal
- Proper state management after removal

### Verification Checklist
- [ ] removeCoupon method implemented in API client
- [ ] Request includes cart identifier
- [ ] Success response handled properly
- [ ] Failure scenarios handled gracefully
- [ ] Cart total restored correctly
- [ ] Coupon state cleared in store
- [ ] Success message displayed
- [ ] Optimistic update implemented (optional)
- [ ] TypeScript types used correctly
- [ ] Method returns typed promise

---

## Task 06: Create Coupon Query Hook

### Overview
Create a TanStack Query (React Query) hook for validating coupons with automatic caching, refetching, and state management. This hook provides a declarative way to validate coupons with loading states, error handling, and automatic cache invalidation, improving user experience with instant feedback and reduced API calls.

### Dependencies
- Task 03: Create Validate Coupon API
- TanStack Query setup from earlier SubPhases
- Cart state access

### Instructions

1. **Create hooks directory structure**
   - Navigate to `frontend/hooks/` directory
   - Create `marketing` subdirectory if not exists
   - This houses marketing-related hooks

2. **Create coupon hooks file**
   - Create `useCoupon.ts` in `hooks/marketing/` directory
   - Import TanStack Query hooks (useQuery)
   - Import coupon API client from Task 02
   - Import coupon types from Task 01

3. **Define query key factory**
   - Create `couponKeys` object for query keys
   - Define validation key: `['coupons', 'validate', code, cartTotal]`
   - Ensure proper key structure for cache management
   - Add detail key: `['coupons', 'detail', code]`

4. **Create useCouponValidation hook**
   - Accept parameters: couponCode, cartTotal, cartItems
   - Include enabled flag (default: false, validate on demand)
   - Return useQuery result with validation data

5. **Configure query options**
   - Set staleTime (30 seconds for caching)
   - Configure cacheTime (5 minutes)
   - Set retry options (retry once on failure)
   - Add refetchOnWindowFocus (false for this case)

6. **Implement query function**
   - Call couponAPI.validateCoupon()
   - Pass request with code, cart total, items
   - Handle response transformation
   - Return validation result

7. **Add derived state selectors**
   - Extract isValid from response
   - Parse discount amount
   - Get error message
   - Extract validation details

8. **Implement error handling**
   - Catch API errors
   - Transform to user-friendly messages
   - Return error state
   - Log errors for debugging

9. **Add optimistic validation (optional)**
   - Perform client-side pre-checks
   - Validate format before API call
   - Show instant feedback for obvious errors

10. **Create validation trigger function**
    - Export validate function to manually trigger
    - Use refetch from useQuery
    - Return promise for async handling

### Hook Structure

```
useCouponValidation(code, cartTotal, items, options)
  │
  ├─> Query Key: ['coupons', 'validate', code, cartTotal]
  │
  ├─> Query Function: couponAPI.validateCoupon()
  │
  └─> Returns: {
      data: ValidateCouponResponse
      isLoading: boolean
      isError: boolean
      error: Error | null
      refetch: () => Promise
      isValid: boolean (derived)
      discount: number (derived)
    }
```

### Query Key Structure

| Key Component | Purpose | Example |
|---------------|---------|---------|
| Scope | Query category | `'coupons'` |
| Operation | Query type | `'validate'` |
| Code | Coupon identifier | `'SAVE10'` |
| Cart Total | Validation context | `15000` |

### Hook Usage Example

```typescript
// In a React component:
const {
  data,
  isLoading,
  isError,
  error,
  refetch: validateCoupon
} = useCouponValidation(
  couponCode,        // "SAVE10"
  cartTotal,         // 15000
  cartItems,         // [...items]
  { enabled: false } // Manual trigger
);

// Trigger validation:
const handleValidate = async () => {
  const result = await validateCoupon();
  if (result.data.valid) {
    // Show success message
  }
};

// Access validation results:
if (data?.valid) {
  console.log(`Discount: ₨${data.discount}`);
}
```

### Query Configuration

| Option | Value | Reason |
|--------|-------|--------|
| staleTime | 30000 (30s) | Cache validation briefly |
| cacheTime | 300000 (5m) | Keep for retries |
| retry | 1 | Retry once on failure |
| refetchOnWindowFocus | false | Manual validation only |
| enabled | false (default) | Validate on demand |

### Caching Strategy

```
First Validation:
├─> API Call → Response → Cache (30s fresh)
└─> Display result

Same Code (within 30s):
├─> Cache Hit → Instant Response
└─> No API call

Same Code (after 30s):
├─> Stale Cache → Refetch → New Cache
└─> Display updated result

Different Code:
├─> New Cache Entry → API Call
└─> Multiple codes cached separately
```

### Derived State

| Property | Source | Description |
|----------|--------|-------------|
| isValid | data.valid | Boolean validation result |
| discount | data.discount | Calculated discount (₨) |
| message | data.message | User-facing message |
| canApply | isValid && !isLoading | Ready to apply |

### Error States

| Error Scenario | isError | error.message | User Action |
|----------------|---------|---------------|-------------|
| Invalid code | true | "Invalid coupon code" | Try different code |
| Network error | true | "Connection failed" | Retry |
| Server error | true | "Try again later" | Wait and retry |
| Validation failure | false | (in data.message) | Check requirements |

### Expected Outcome
- Reusable validation query hook
- Automatic caching and state management
- Loading and error states handled
- Manual validation trigger capability
- Foundation for coupon validation UI

### Verification Checklist
- [ ] `frontend/hooks/marketing/useCoupon.ts` file created
- [ ] useCouponValidation hook implemented
- [ ] Query key factory defined
- [ ] useQuery configured properly
- [ ] staleTime and cacheTime set
- [ ] Query function calls API client
- [ ] Derived state selectors added
- [ ] Error handling implemented
- [ ] TypeScript types used correctly
- [ ] Hook exports properly
- [ ] JSDoc comments added

---

## Task 07: Create Apply Coupon Mutation

### Overview
Create a TanStack Query mutation hook for applying coupons to the cart. This hook handles the coupon application process with loading states, optimistic updates, error handling, and automatic cache invalidation. It integrates with the cart state and provides seamless user experience when applying discounts.

### Dependencies
- Task 04: Create Apply Coupon API
- Task 06: Create Coupon Query Hook
- TanStack Query mutation setup

### Instructions

1. **Extend coupon hooks file**
   - Open `hooks/marketing/useCoupon.ts` file
   - Import useMutation from TanStack Query
   - Import cart store or cart context
   - Import toast/notification system

2. **Create useApplyCoupon hook**
   - Define hook function
   - Return useMutation result
   - Configure mutation function
   - Set up callbacks (onSuccess, onError)

3. **Implement mutation function**
   - Call couponAPI.applyCoupon()
   - Pass request with code and cart details
   - Return application result
   - Handle response transformation

4. **Configure optimistic updates**
   - Set onMutate callback
   - Update cart state optimistically
   - Store previous state for rollback
   - Update UI instantly

5. **Implement onSuccess callback**
   - Update cart with actual discount
   - Invalidate cart queries
   - Invalidate validation cache
   - Show success notification
   - Update coupon store

6. **Implement onError callback**
   - Rollback optimistic update
   - Restore previous cart state
   - Show error notification
   - Log error for debugging

7. **Implement onSettled callback**
   - Run cleanup tasks
   - Reset loading states
   - Refetch related queries

8. **Add mutation helpers**
   - Create applyCoupon wrapper function
   - Include validation before apply (optional)
   - Add confirmation logic
   - Return promise for async handling

9. **Integrate with cart store**
   - Update cart total on success
   - Set applied coupon in store
   - Update discount amount
   - Trigger cart recalculation

10. **Add analytics tracking (optional)**
    - Track successful applications
    - Log failed attempts
    - Monitor coupon usage patterns

### Mutation Structure

```
useApplyCoupon()
  │
  ├─> Mutation Function: couponAPI.applyCoupon()
  │
  ├─> Callbacks:
  │   ├─> onMutate (Optimistic update)
  │   ├─> onSuccess (Update state, invalidate cache)
  │   ├─> onError (Rollback, show error)
  │   └─> onSettled (Cleanup)
  │
  └─> Returns: {
      mutate: (request) => void
      mutateAsync: (request) => Promise
      isLoading: boolean
      isError: boolean
      isSuccess: boolean
      data: ApplyCouponResponse
      error: Error | null
      reset: () => void
    }
```

### Hook Usage Example

```typescript
// In a React component:
const {
  mutate: applyCoupon,
  mutateAsync,
  isLoading,
  isSuccess,
  isError
} = useApplyCoupon();

// Apply coupon:
const handleApply = () => {
  applyCoupon({
    code: "SAVE10",
    cartTotal: 15000,
    items: cartItems,
    userId: user.id,
    cartId: cart.id
  });
};

// Or with async/await:
const handleApplyAsync = async () => {
  try {
    const result = await mutateAsync(request);
    console.log(`Saved ₨${result.discount}`);
  } catch (error) {
    console.error("Failed to apply");
  }
};
```

### Optimistic Update Flow

```
User Clicks "Apply"
       │
       ▼
┌──────────────────┐
│  onMutate        │──> Save current state
│  (Optimistic)    │    Update UI instantly
└────────┬─────────┘    Show discount immediately
         │
         ▼
┌──────────────────┐
│  API Call        │──> Send request to backend
│  (Background)    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
Success   Failure
    │         │
    ▼         ▼
┌──────┐  ┌──────────┐
│onSuc │  │ onError  │──> Rollback state
│cess │  │          │    Restore original
└──┬───┘  └────┬─────┘    Show error
   │           │
   └─────┬─────┘
         ▼
   ┌──────────┐
   │onSettled │──> Cleanup
   │          │    Refetch queries
   └──────────┘
```

### Callback Functions

| Callback | Purpose | Actions |
|----------|---------|---------|
| onMutate | Before API call | Save state, optimistic update |
| onSuccess | API call succeeded | Update store, invalidate cache, notify |
| onError | API call failed | Rollback, show error, log |
| onSettled | After API call (always) | Cleanup, refetch queries |

### Cache Invalidation

| Cache | Invalidation Trigger | Reason |
|-------|---------------------|--------|
| Cart queries | onSuccess | Cart updated with discount |
| Validation cache | onSuccess | Previous validation stale |
| Coupon list | onSuccess (optional) | Update usage counts |

### State Updates on Success

```
Cart Store Updates:
├─> appliedCoupon: Coupon object
├─> discount: ₨1,500
├─> subtotal: ₨15,000 (unchanged)
├─> total: ₨13,500 (subtotal - discount)
└─> couponAppliedAt: timestamp

UI Updates:
├─> Display coupon badge
├─> Show discount amount
├─> Update total price
├─> Enable "Remove" button
└─> Show success message
```

### Notification Messages

| Scenario | Type | Message |
|----------|------|---------|
| Success | Success | "Coupon applied! You save ₨{amount}" |
| Expired | Error | "Coupon expired, please try another" |
| Invalid | Error | "Unable to apply coupon: {reason}" |
| Network error | Error | "Connection error, please try again" |

### Error Handling

```typescript
onError: (error, variables, context) => {
  // Rollback optimistic update
  if (context?.previousCart) {
    setCart(context.previousCart);
  }
  
  // Show user-friendly error
  toast.error(error.message || "Failed to apply coupon");
  
  // Log for debugging
  console.error("Apply coupon failed:", error);
}
```

### Expected Outcome
- Functional apply coupon mutation hook
- Optimistic UI updates for instant feedback
- Proper error handling with rollback
- Cache invalidation on success
- Success/error notifications
- Integration with cart state

### Verification Checklist
- [ ] useApplyCoupon hook implemented
- [ ] useMutation configured properly
- [ ] Mutation function calls API client
- [ ] onMutate callback with optimistic update
- [ ] onSuccess callback with state update
- [ ] onError callback with rollback
- [ ] onSettled callback for cleanup
- [ ] Cache invalidation implemented
- [ ] Notifications for success/error
- [ ] Cart store integration
- [ ] TypeScript types used correctly
- [ ] Hook exports properly

---

## Task 08: Create Coupon Store

### Overview
Create a Zustand store for managing coupon state on the client side. This store maintains the currently applied coupon, discount amount, loading states, and error messages. It provides actions for setting, clearing, and updating coupon data, serving as the single source of truth for coupon state across the application.

### Dependencies
- Task 01: Create Coupon Types Interface
- Zustand library setup from earlier SubPhases

### Instructions

1. **Create store directory structure**
   - Navigate to `frontend/store/` directory
   - Prepare to create coupon-specific store file

2. **Create coupon store file**
   - Create `coupon-store.ts` in `store/` directory
   - Import create from Zustand
   - Import persist middleware (optional)
   - Import coupon types from Task 01

3. **Define store state interface**
   - Create `CouponState` interface
   - Include appliedCoupon field (Coupon | null)
   - Add discount field (number, in LKR)
   - Include isLoading field (boolean)
   - Add error field (string | null)
   - Include validationMessage field

4. **Define store actions interface**
   - Create `CouponActions` interface
   - Include setAppliedCoupon action
   - Add clearCoupon action
   - Include setDiscount action
   - Add setLoading action
   - Include setError action
   - Add reset action

5. **Create store with create function**
   - Use Zustand's create function
   - Combine state and actions
   - Return store hook

6. **Implement setAppliedCoupon action**
   - Accept coupon object parameter
   - Set appliedCoupon in state
   - Calculate and set discount
   - Clear error message
   - Set validationMessage

7. **Implement clearCoupon action**
   - Set appliedCoupon to null
   - Reset discount to 0
   - Clear error and messages
   - Update isLoading to false

8. **Implement setDiscount action**
   - Accept discount amount parameter
   - Update discount field
   - Validate discount value (non-negative)

9. **Implement setLoading action**
   - Accept boolean parameter
   - Update isLoading state
   - Use for validation/apply operations

10. **Implement setError action**
    - Accept error message parameter
    - Set error field
    - Clear loading state
    - Optionally clear applied coupon

11. **Implement reset action**
    - Reset all state to initial values
    - Clear applied coupon
    - Reset discount to 0
    - Clear loading and error states

12. **Add persistence (optional)**
    - Wrap store with persist middleware
    - Configure storage (localStorage)
    - Set storage key ('coupon-store')
    - Define which fields to persist

13. **Add computed/derived values (optional)**
    - Add hasCoupon getter (computed from appliedCoupon)
    - Include isValid getter
    - Add formattedDiscount getter (with currency)

14. **Add store selectors (optional)**
    - Create selector hooks for specific state
    - Add useAppliedCoupon selector
    - Include useDiscount selector

### Store Structure

```
CouponStore
├── State
│   ├── appliedCoupon: Coupon | null
│   ├── discount: number (₨)
│   ├── isLoading: boolean
│   ├── error: string | null
│   └── validationMessage: string | null
└── Actions
    ├── setAppliedCoupon(coupon: Coupon)
    ├── clearCoupon()
    ├── setDiscount(amount: number)
    ├── setLoading(loading: boolean)
    ├── setError(message: string | null)
    └── reset()
```

### State Interface

```typescript
interface CouponState {
  // Current state
  appliedCoupon: Coupon | null;
  discount: number; // Amount in LKR
  isLoading: boolean;
  error: string | null;
  validationMessage: string | null;
  
  // Computed/derived (optional)
  hasCoupon: boolean;
  formattedDiscount: string;
}
```

### Actions Interface

```typescript
interface CouponActions {
  setAppliedCoupon: (coupon: Coupon, discount: number) => void;
  clearCoupon: () => void;
  setDiscount: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  reset: () => void;
}
```

### Store Usage Example

```typescript
// In a React component:
import { useCouponStore } from '@/store/coupon-store';

const Component = () => {
  const appliedCoupon = useCouponStore(state => state.appliedCoupon);
  const discount = useCouponStore(state => state.discount);
  const setAppliedCoupon = useCouponStore(state => state.setAppliedCoupon);
  const clearCoupon = useCouponStore(state => state.clearCoupon);
  
  // Apply coupon
  const handleApply = (coupon: Coupon, discountAmount: number) => {
    setAppliedCoupon(coupon, discountAmount);
  };
  
  // Remove coupon
  const handleRemove = () => {
    clearCoupon();
  };
  
  return (
    <div>
      {appliedCoupon && (
        <div>
          Coupon: {appliedCoupon.code}
          Discount: ₨{discount}
        </div>
      )}
    </div>
  );
};
```

### State Transitions

```
Initial State:
├─> appliedCoupon: null
├─> discount: 0
├─> isLoading: false
└─> error: null

After Apply:
├─> appliedCoupon: { code: "SAVE10", ... }
├─> discount: 1500
├─> isLoading: false
└─> error: null

After Clear:
├─> appliedCoupon: null
├─> discount: 0
├─> isLoading: false
└─> error: null

On Error:
├─> appliedCoupon: null (or unchanged)
├─> discount: 0 (or unchanged)
├─> isLoading: false
└─> error: "Error message"
```

### Persistence Configuration (Optional)

```typescript
persist(
  (set, get) => ({
    // State and actions
  }),
  {
    name: 'coupon-store',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      appliedCoupon: state.appliedCoupon,
      discount: state.discount,
    }),
  }
)
```

### Integration with Hooks

| Hook | Store Action | When |
|------|--------------|------|
| useApplyCoupon | setAppliedCoupon | On success |
| useApplyCoupon | setError | On error |
| useCouponValidation | setLoading | During validation |
| useRemoveCoupon | clearCoupon | On remove success |

### Expected Outcome
- Functional Zustand store for coupon state
- Clear actions for state management
- Type-safe state and actions
- Optional persistence configuration
- Single source of truth for coupon data
- Easy integration with React components

### Verification Checklist
- [ ] `frontend/store/coupon-store.ts` file created
- [ ] CouponState interface defined
- [ ] CouponActions interface defined
- [ ] Store created with Zustand
- [ ] setAppliedCoupon action implemented
- [ ] clearCoupon action implemented
- [ ] setDiscount action implemented
- [ ] setLoading action implemented
- [ ] setError action implemented
- [ ] reset action implemented
- [ ] TypeScript types used correctly
- [ ] Store exports useCouponStore hook
- [ ] Optional persistence configured
- [ ] JSDoc comments added

---

## Task 09: Create Percentage Discount Logic

### Overview
Implement the percentage discount calculation logic within the coupon store or utility functions. This handles percentage-based discounts with support for maximum discount caps, ensuring accurate calculations and proper handling of edge cases like exceeding cart total or applying discount caps.

### Dependencies
- Task 08: Create Coupon Store

### Instructions

1. **Create discount utilities file (option A)**
   - Create `lib/utils/discount.ts` file
   - Import coupon types
   - Set up pure functions for calculations

   **OR extend coupon store (option B)**
   - Add calculation methods to coupon store
   - Keep calculations close to state

2. **Create calculatePercentageDiscount function**
   - Accept parameters: cartTotal, percentage, maxCap
   - Validate input parameters
   - Return calculated discount amount

3. **Implement percentage calculation**
   - Calculate discount: cartTotal * (percentage / 100)
   - Round result to 2 decimal places
   - Ensure non-negative result

4. **Apply maximum discount cap**
   - Check if maxCap is defined
   - Compare calculated discount with maxCap
   - Return minimum of calculated and maxCap
   - Use Math.min() for comparison

5. **Implement edge case handling**
   - Handle zero cart total (return 0)
   - Handle invalid percentage (0 or negative)
   - Handle percentage > 100 (cap at 100%)
   - Prevent discount from exceeding cart total

6. **Add validation checks**
   - Validate cartTotal is positive number
   - Validate percentage is between 0 and 100
   - Validate maxCap if provided (positive number)
   - Throw or return error for invalid inputs

7. **Create helper function for formatted output**
   - Format discount with LKR currency symbol
   - Return string: "₨1,500"
   - Include thousand separators

8. **Add calculation documentation**
   - Document formula in JSDoc
   - Include examples for different scenarios
   - Explain cap behavior

### Percentage Discount Formula

```
Basic Formula:
Discount = Cart Total × (Percentage ÷ 100)

Example 1 (No Cap):
Cart Total: ₨10,000
Percentage: 10%
Discount = ₨10,000 × 0.10 = ₨1,000

Example 2 (With Cap):
Cart Total: ₨50,000
Percentage: 20%
Max Cap: ₨5,000
Calculated = ₨50,000 × 0.20 = ₨10,000
Applied = min(₨10,000, ₨5,000) = ₨5,000

Example 3 (Cap Not Reached):
Cart Total: ₨20,000
Percentage: 10%
Max Cap: ₨5,000
Calculated = ₨20,000 × 0.10 = ₨2,000
Applied = min(₨2,000, ₨5,000) = ₨2,000
```

### Function Signature

```typescript
function calculatePercentageDiscount(
  cartTotal: number,
  percentage: number,
  maxCap?: number
): number {
  // Implementation
}
```

### Calculation Flow

```
Input: cartTotal, percentage, maxCap?
       │
       ▼
┌──────────────────┐
│ Validate Inputs  │──> Ensure positive values
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Base   │──> cartTotal × (percentage / 100)
│    Discount      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Apply Max Cap?  │──No──> Return calculated discount
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Compare with Cap │──> Math.min(calculated, maxCap)
└────────┬─────────┘
         │
         ▼
   Return Final Discount
```

### Calculation Examples

| Cart Total | Percentage | Max Cap | Calculated | Applied | Reason |
|------------|------------|---------|------------|---------|--------|
| ₨10,000 | 10% | None | ₨1,000 | ₨1,000 | No cap |
| ₨50,000 | 20% | ₨5,000 | ₨10,000 | ₨5,000 | Cap applied |
| ₨5,000 | 50% | ₨5,000 | ₨2,500 | ₨2,500 | Under cap |
| ₨100 | 10% | ₨500 | ₨10 | ₨10 | Small cart |
| ₨1,000 | 100% | None | ₨1,000 | ₨1,000 | Full discount |

### Edge Cases

| Scenario | Input | Handling | Output |
|----------|-------|----------|--------|
| Zero total | cartTotal = 0 | Return 0 | ₨0 |
| Negative total | cartTotal < 0 | Throw error or 0 | Error |
| Zero percentage | percentage = 0 | Return 0 | ₨0 |
| >100% | percentage = 150 | Cap at 100% | Max = total |
| No maxCap | maxCap undefined | Skip cap check | Calculated |

### Validation Logic

```typescript
// Input validation
if (cartTotal <= 0) {
  return 0; // or throw error
}

if (percentage <= 0 || percentage > 100) {
  throw new Error("Invalid percentage");
}

if (maxCap !== undefined && maxCap <= 0) {
  throw new Error("Invalid max cap");
}
```

### Integration with Store

```typescript
// In coupon store or mutation
const applyCoupon = (coupon: Coupon) => {
  let discount = 0;
  
  if (coupon.discountType === 'percentage') {
    discount = calculatePercentageDiscount(
      cartTotal,
      coupon.discountValue,
      coupon.maxDiscountCap
    );
  }
  
  setDiscount(discount);
  setAppliedCoupon(coupon);
};
```

### Expected Outcome
- Accurate percentage discount calculation
- Support for maximum discount caps
- Proper edge case handling
- Validation for input parameters
- Reusable calculation function
- Integration with coupon system

### Verification Checklist
- [ ] Discount calculation function created
- [ ] Percentage formula implemented correctly
- [ ] Maximum cap logic applied
- [ ] Edge cases handled (zero, negative, >100%)
- [ ] Input validation implemented
- [ ] Function returns number (LKR amount)
- [ ] JSDoc comments with examples
- [ ] Unit tests for various scenarios (optional but recommended)
- [ ] Function exported properly
- [ ] Integration with store/mutation verified

---

## Task 10: Create Fixed Discount Logic

### Overview
Implement the fixed amount discount calculation logic for coupons that provide a specific monetary discount (e.g., ₨500 off). This logic ensures that fixed discounts never exceed the cart total and handles edge cases where the discount amount is larger than the cart value.

### Dependencies
- Task 08: Create Coupon Store
- Task 09: Create Percentage Discount Logic (for consistency)

### Instructions

1. **Extend discount utilities file**
   - Open `lib/utils/discount.ts` file (from Task 09)
   - Add fixed discount calculation function
   - Maintain consistency with percentage logic

2. **Create calculateFixedDiscount function**
   - Accept parameters: cartTotal, fixedAmount
   - Validate input parameters
   - Return calculated discount amount

3. **Implement fixed discount logic**
   - Return fixedAmount directly (if less than total)
   - Cap at cartTotal if fixedAmount exceeds it
   - Use Math.min(fixedAmount, cartTotal)

4. **Implement edge case handling**
   - Handle zero cart total (return 0)
   - Handle discount exceeding total (return total)
   - Handle negative values (throw error or return 0)
   - Handle zero discount amount (return 0)

5. **Add validation checks**
   - Validate cartTotal is positive number
   - Validate fixedAmount is positive number
   - Ensure discount doesn't exceed cart
   - Throw errors for invalid inputs

6. **Create comparison with cart total**
   - Compare fixedAmount with cartTotal
   - Return minimum of the two values
   - Prevent negative final totals

7. **Add documentation**
   - Document behavior in JSDoc
   - Include examples for different scenarios
   - Explain capping behavior

8. **Ensure consistency**
   - Match return type with percentage function
   - Use same validation patterns
   - Follow same error handling approach

### Fixed Discount Formula

```
Basic Formula:
Discount = min(Fixed Amount, Cart Total)

Example 1 (Normal Case):
Cart Total: ₨10,000
Fixed Amount: ₨500
Discount = min(₨500, ₨10,000) = ₨500

Example 2 (Exceeds Total):
Cart Total: ₨300
Fixed Amount: ₨500
Discount = min(₨500, ₨300) = ₨300
(Cannot discount more than total)

Example 3 (Equals Total):
Cart Total: ₨1,000
Fixed Amount: ₨1,000
Discount = min(₨1,000, ₨1,000) = ₨1,000
(Free order!)
```

### Function Signature

```typescript
function calculateFixedDiscount(
  cartTotal: number,
  fixedAmount: number
): number {
  // Implementation
}
```

### Calculation Flow

```
Input: cartTotal, fixedAmount
       │
       ▼
┌──────────────────┐
│ Validate Inputs  │──> Ensure positive values
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Compare Amounts  │──> Math.min(fixedAmount, cartTotal)
└────────┬─────────┘
         │
         ▼
   Return Discount
```

### Calculation Examples

| Cart Total | Fixed Amount | Applied Discount | Final Total | Notes |
|------------|--------------|------------------|-------------|-------|
| ₨10,000 | ₨500 | ₨500 | ₨9,500 | Normal case |
| ₨10,000 | ₨2,000 | ₨2,000 | ₨8,000 | Large discount |
| ₨300 | ₨500 | ₨300 | ₨0 | Capped at total |
| ₨5,000 | ₨5,000 | ₨5,000 | ₨0 | Free order |
| ₨100 | ₨50 | ₨50 | ₨50 | Small amounts |

### Edge Cases

| Scenario | Cart Total | Fixed Amount | Applied | Reason |
|----------|------------|--------------|---------|--------|
| Discount exceeds | ₨200 | ₨500 | ₨200 | Capped at total |
| Zero total | ₨0 | ₨500 | ₨0 | No cart value |
| Zero discount | ₨1,000 | ₨0 | ₨0 | No discount |
| Equal values | ₨1,000 | ₨1,000 | ₨1,000 | Free order |
| Negative total | -₨500 | ₨100 | Error | Invalid input |

### Validation Logic

```typescript
// Input validation
if (cartTotal <= 0) {
  return 0; // or throw error
}

if (fixedAmount <= 0) {
  throw new Error("Invalid fixed discount amount");
}

// Ensure discount doesn't exceed cart
const discount = Math.min(fixedAmount, cartTotal);

return discount;
```

### Comparison with Percentage Discount

| Aspect | Percentage | Fixed |
|--------|------------|-------|
| Formula | cartTotal × percentage | Min of amount and total |
| Maximum | Optional maxCap | Always capped at cartTotal |
| Scales | Yes (with cart size) | No (fixed amount) |
| Example | 10% of ₨10,000 = ₨1,000 | ₨500 off regardless of cart |

### Integration with Store

```typescript
// In coupon store or mutation
const applyCoupon = (coupon: Coupon) => {
  let discount = 0;
  
  if (coupon.discountType === 'percentage') {
    discount = calculatePercentageDiscount(
      cartTotal,
      coupon.discountValue,
      coupon.maxDiscountCap
    );
  } else if (coupon.discountType === 'fixed_amount') {
    discount = calculateFixedDiscount(
      cartTotal,
      coupon.discountValue
    );
  }
  
  setDiscount(discount);
  setAppliedCoupon(coupon);
};
```

### Usage Example

```typescript
import { calculateFixedDiscount } from '@/lib/utils/discount';

// Calculate discount
const cartTotal = 10000;
const fixedAmount = 500;
const discount = calculateFixedDiscount(cartTotal, fixedAmount);
console.log(`Discount: ₨${discount}`); // ₨500

// Edge case: discount exceeds total
const smallCart = 300;
const largeDiscount = 500;
const cappedDiscount = calculateFixedDiscount(smallCart, largeDiscount);
console.log(`Discount: ₨${cappedDiscount}`); // ₨300
```

### Expected Outcome
- Accurate fixed discount calculation
- Automatic capping at cart total
- Proper edge case handling
- Input validation for safety
- Consistent with percentage discount function
- Integration with coupon system

### Verification Checklist
- [ ] calculateFixedDiscount function created
- [ ] Fixed amount applied correctly
- [ ] Capping at cart total implemented
- [ ] Edge cases handled (exceeds total, zero values)
- [ ] Input validation implemented
- [ ] Function returns number (LKR amount)
- [ ] JSDoc comments with examples
- [ ] Consistency with percentage function
- [ ] Function exported properly
- [ ] Integration with store/mutation verified

---

## Summary

This document established the foundation for the coupon system backend integration, including comprehensive TypeScript interfaces, API client with validation/apply/remove endpoints, TanStack Query hooks for server state management, Zustand store for client-side state, and core discount calculation logic for percentage and fixed amount coupons. These components provide a robust, type-safe foundation for implementing coupon functionality in the webstore.

### Completed Tasks
1. ✓ Created coupon types interface with comprehensive definitions
2. ✓ Created coupon API client with all endpoints
3. ✓ Created validate coupon API integration
4. ✓ Created apply coupon API integration
5. ✓ Created remove coupon API integration
6. ✓ Created coupon validation query hook
7. ✓ Created apply coupon mutation hook
8. ✓ Created Zustand coupon store for state management
9. ✓ Created percentage discount calculation logic
10. ✓ Created fixed discount calculation logic

### Next Steps
Proceed to [02_Tasks-11-18_Validation-Verify.md](02_Tasks-11-18_Validation-Verify.md) to implement additional validation rules (free shipping, minimum order, expiry, usage limits, product-specific, category-specific, first order) and verify the complete coupon API integration.
