# Tasks 11-18: Validation Rules and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** A - Coupon System Backend Integration  
> **Document:** 02 of 02  
> **Tasks Covered:** 11, 12, 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-10_Types-API-Store.md](01_Tasks-01-10_Types-API-Store.md)

---

## Document Overview

This document covers the implementation of advanced coupon validation rules and verification. It includes free shipping coupons, minimum order validation, expiry checks, usage limit tracking, product-specific coupons, category-based coupons, first order restrictions, and comprehensive API integration verification to ensure the entire coupon system functions correctly.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 11 | Create Free Shipping Coupon | Low | 20 min |
| 12 | Create Minimum Order Validation | Low | 25 min |
| 13 | Create Coupon Expiry Check | Low | 25 min |
| 14 | Create Usage Limit Check | Medium | 35 min |
| 15 | Create Product-Specific Coupon | Medium | 40 min |
| 16 | Create Category Coupon | Medium | 40 min |
| 17 | Create First Order Coupon | Medium | 35 min |
| 18 | Verify Coupon API Integration | Low | 45 min |

---

## Task 11: Create Free Shipping Coupon Logic

### Overview
Implement the free shipping coupon logic that waives shipping fees when applied to the cart. This coupon type doesn't reduce the cart subtotal but instead sets the shipping cost to zero, effectively providing savings equal to the standard shipping fee.

### Dependencies
- Task 08: Create Coupon Store
- Task 10: Create Fixed Discount Logic
- Shipping calculation system from earlier SubPhases

### Instructions

1. **Extend discount utilities file**
   - Open `lib/utils/discount.ts` file
   - Add free shipping calculation function
   - Import shipping cost calculator

2. **Create calculateFreeShippingDiscount function**
   - Accept parameters: currentShippingCost
   - Return shipping cost as discount value
   - Handle cases where shipping is already free

3. **Implement free shipping logic**
   - Get current shipping cost from cart
   - Return shipping cost as discount amount
   - If shipping is ₨0, return ₨0 discount

4. **Add free shipping indicator**
   - Return flag indicating free shipping applied
   - Distinguish from other discount types in display
   - Mark shipping as "FREE" in cart summary

5. **Handle edge cases**
   - Handle zero shipping cost (already free)
   - Handle express/premium shipping options
   - Handle pickup orders (no shipping)
   - Handle shipping not yet calculated

6. **Integrate with cart calculation**
   - Apply discount to shipping line item
   - Keep cart subtotal unchanged
   - Update total to reflect free shipping
   - Preserve other discounts if applicable

7. **Add display helpers**
   - Create formatted message: "Free Shipping Applied"
   - Show savings: "You save ₨{shippingCost}"
   - Update shipping line in cart display

8. **Configure free shipping behavior**
   - Determine if it stacks with other coupons
   - Handle multiple free shipping coupons
   - Define priority if conflicts occur

### Free Shipping Discount Flow

```
Cart Calculation:
├─> Subtotal: ₨15,000
├─> Shipping: ₨350 (standard)
├─> Discount: ₨0
└─> Total: ₨15,350

After Free Shipping Coupon:
├─> Subtotal: ₨15,000 (unchanged)
├─> Shipping: ₨0 (FREE)
├─> Discount: ₨350 (shipping value)
└─> Total: ₨15,000
```

### Function Signature

```typescript
function calculateFreeShippingDiscount(
  shippingCost: number
): {
  discount: number;
  isFreeShipping: boolean;
} {
  // Implementation
}
```

### Calculation Logic

```
Input: shippingCost
       │
       ▼
┌──────────────────┐
│ Shipping Cost    │──> Get current shipping
│    > 0?          │
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Set Discount to  │──> discount = shippingCost
│  Shipping Cost   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Mark as Free     │──> isFreeShipping = true
│    Shipping      │
└────────┬─────────┘
         │
         ▼
   Return Result
```

### Shipping Scenarios

| Scenario | Shipping Cost | Discount Applied | Savings | Notes |
|----------|---------------|------------------|---------|-------|
| Standard shipping | ₨350 | ₨350 | ₨350 | Normal case |
| Express shipping | ₨750 | ₨750 | ₨750 | Premium option |
| Already free | ₨0 | ₨0 | ₨0 | No benefit |
| Pickup order | ₨0 | ₨0 | ₨0 | Not applicable |
| Not calculated | - | ₨0 | ₨0 | Calculate first |

### Cart Display Changes

```
Before Free Shipping Coupon:
┌────────────────────────────────┐
│ Subtotal:            ₨15,000   │
│ Shipping:               ₨350   │
│ ──────────────────────────────  │
│ Total:               ₨15,350   │
└────────────────────────────────┘

After Free Shipping Coupon:
┌────────────────────────────────┐
│ Subtotal:            ₨15,000   │
│ Shipping:          FREE  ₨0    │
│ Discount (FREESHIP):   -₨350   │
│ ──────────────────────────────  │
│ Total:               ₨15,000   │
│ You saved ₨350 on shipping!    │
└────────────────────────────────┘
```

### Integration with Store

```typescript
// In coupon application logic
const applyCoupon = (coupon: Coupon, cart: Cart) => {
  let discount = 0;
  
  if (coupon.discountType === 'free_shipping') {
    const result = calculateFreeShippingDiscount(cart.shippingCost);
    discount = result.discount;
    cart.isFreeShipping = result.isFreeShipping;
  }
  
  setDiscount(discount);
  setAppliedCoupon(coupon);
};
```

### Validation Rules

| Check | Condition | Error Message |
|-------|-----------|---------------|
| Has shipping | Shipping cost > 0 | "Not applicable to pickup orders" |
| Shipping calculated | Shipping cost exists | "Calculate shipping first" |
| Not already free | Current shipping ≠ 0 | "Shipping already free" |

### Stacking Behavior

| Other Discount | Free Shipping | Combined Effect |
|----------------|---------------|-----------------|
| 10% off cart | + Free shipping | Both apply |
| ₨500 off | + Free shipping | Both apply |
| Free shipping | + Free shipping | Only one applies |

### Expected Outcome
- Functional free shipping coupon logic
- Accurate shipping discount calculation
- Proper cart display with "FREE" indicator
- Integration with shipping system
- Clear savings message for users

### Verification Checklist
- [ ] calculateFreeShippingDiscount function created
- [ ] Returns shipping cost as discount
- [ ] Handles zero shipping cost
- [ ] isFreeShipping flag returned
- [ ] Integration with cart calculation
- [ ] Shipping line shows "FREE" in UI
- [ ] Savings message displays correctly
- [ ] Edge cases handled (pickup, already free)
- [ ] Function exported properly
- [ ] JSDoc comments added

---

## Task 12: Create Minimum Order Validation

### Overview
Implement minimum order amount validation for coupons. This ensures that coupons requiring a minimum purchase amount (e.g., "₨500 off on orders above ₨5,000") can only be applied when the cart total meets the requirement. The validation provides clear feedback when the threshold is not met.

### Dependencies
- Task 08: Create Coupon Store
- Task 03: Create Validate Coupon API

### Instructions

1. **Extend validation utilities**
   - Create or open `lib/utils/couponValidation.ts` file
   - Import coupon types
   - Set up validation functions structure

2. **Create validateMinimumOrder function**
   - Accept parameters: cartTotal, minOrderAmount
   - Return validation result object
   - Include pass/fail status and message

3. **Implement minimum order check**
   - Compare cartTotal with minOrderAmount
   - Return true if cartTotal >= minOrderAmount
   - Return false otherwise

4. **Generate appropriate messages**
   - Success: "Minimum order requirement met"
   - Failure: "Minimum order of ₨{amount} required"
   - Include how much more needed if failed
   - Format amounts with LKR currency

5. **Calculate shortfall amount**
   - If validation fails, calculate difference
   - shortfall = minOrderAmount - cartTotal
   - Include in message: "Add ₨{shortfall} more"

6. **Handle edge cases**
   - No minimum order set (always valid)
   - Zero minimum order (always valid)
   - Negative values (throw error)
   - Exact match (valid)

7. **Add to validation chain**
   - Integrate with validateCoupon API
   - Run check before applying coupon
   - Return validation details in response

8. **Create UI helper function**
   - Generate progress indicator
   - Show percentage toward minimum
   - Display visual progress bar data

### Minimum Order Validation Structure

```typescript
interface MinOrderValidation {
  isValid: boolean;
  message: string;
  shortfall?: number;
  percentComplete?: number;
}
```

### Function Signature

```typescript
function validateMinimumOrder(
  cartTotal: number,
  minOrderAmount?: number
): MinOrderValidation {
  // Implementation
}
```

### Validation Flow

```
Input: cartTotal, minOrderAmount
       │
       ▼
┌──────────────────┐
│ Min Order Set?   │──No──> Return Valid (no requirement)
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Cart >= Min?     │──Yes──> Return Valid with success message
└────────┬─────────┘
         │ No
         ▼
┌──────────────────┐
│ Calculate        │──> shortfall = minOrder - cartTotal
│   Shortfall      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Return Invalid   │──> With message and shortfall
│  with Details    │
└──────────────────┘
```

### Validation Examples

| Cart Total | Min Order | Result | Message |
|------------|-----------|--------|---------|
| ₨10,000 | ₨5,000 | ✓ Valid | "Minimum order met" |
| ₨3,000 | ₨5,000 | ✗ Invalid | "Minimum order of ₨5,000 required (add ₨2,000)" |
| ₨5,000 | ₨5,000 | ✓ Valid | "Minimum order met" |
| ₨1,000 | None | ✓ Valid | "No minimum order" |
| ₨8,500 | ₨10,000 | ✗ Invalid | "Add ₨1,500 more to qualify" |

### Validation Response Structure

```
Success Response:
{
  isValid: true
  message: "Minimum order requirement met (₨10,000 / ₨5,000)"
  shortfall: 0
  percentComplete: 100
}

Failure Response:
{
  isValid: false
  message: "Minimum order of ₨5,000 required. Add ₨2,000 more to qualify."
  shortfall: 2000
  percentComplete: 60  // (3000 / 5000 * 100)
}
```

### Progress Calculation

```
Cart Total: ₨3,000
Minimum Order: ₨5,000

Progress Calculation:
├─> Percent = (3000 / 5000) × 100 = 60%
├─> Shortfall = 5000 - 3000 = ₨2,000
└─> Message: "60% toward minimum (₨2,000 more needed)"

Visual Display:
[████████████            ] 60%
₨3,000 / ₨5,000
Add ₨2,000 to use this coupon
```

### UI Display Examples

```
Scenario 1: Below Minimum
┌─────────────────────────────────────┐
│ Coupon: SAVE500                     │
│ Status: ⚠ Not Eligible             │
│ ──────────────────────────────────  │
│ Minimum order: ₨5,000               │
│ Your cart: ₨3,000                   │
│ [████████        ] 60%              │
│ Add ₨2,000 more to qualify          │
└─────────────────────────────────────┘

Scenario 2: Meets Minimum
┌─────────────────────────────────────┐
│ Coupon: SAVE500                     │
│ Status: ✓ Eligible                  │
│ ──────────────────────────────────  │
│ Minimum order: ₨5,000 ✓             │
│ Your cart: ₨6,500                   │
│ [████████████████] 100%             │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘
```

### Integration with Validation API

```typescript
// In validateCoupon API
const validateCoupon = (request: ValidateCouponRequest) => {
  const coupon = getCouponByCode(request.code);
  
  // Minimum order check
  const minOrderCheck = validateMinimumOrder(
    request.cartTotal,
    coupon.minOrderAmount
  );
  
  if (!minOrderCheck.isValid) {
    return {
      valid: false,
      message: minOrderCheck.message,
      validationDetails: {
        minOrderMet: false,
        shortfall: minOrderCheck.shortfall
      }
    };
  }
  
  // Continue with other validations...
};
```

### Error Messages

| Scenario | Message Template |
|----------|------------------|
| Below minimum | "Minimum order of ₨{min} required. Add ₨{shortfall} more." |
| Meets minimum | "Minimum order requirement met (₨{cart} / ₨{min})" |
| No minimum | "No minimum order required" |
| Just short | "Add just ₨{shortfall} more to qualify" |
| Far below | "Cart total ₨{cart} is below minimum ₨{min}" |

### Expected Outcome
- Functional minimum order validation
- Accurate shortfall calculation
- Clear user-facing messages
- Progress indicator data
- Integration with validation API
- Helpful guidance for users

### Verification Checklist
- [ ] validateMinimumOrder function created
- [ ] Comparison logic implemented correctly
- [ ] Shortfall calculated accurately
- [ ] Clear validation messages
- [ ] Edge cases handled (no min, zero, exact match)
- [ ] Percentage completion calculated
- [ ] Integration with validation API
- [ ] Return type matches interface
- [ ] Function exported properly
- [ ] JSDoc comments with examples

---

## Task 13: Create Coupon Expiry Check

### Overview
Implement expiry date validation for coupons. This check ensures that coupons can only be used within their valid date range, preventing the use of expired coupons and providing clear feedback about coupon validity periods.

### Dependencies
- Task 08: Create Coupon Store
- Task 03: Create Validate Coupon API

### Instructions

1. **Extend validation utilities**
   - Open `lib/utils/couponValidation.ts` file
   - Import date utilities
   - Add expiry validation function

2. **Create validateCouponExpiry function**
   - Accept parameters: startDate, expiryDate, currentDate
   - Return validation result object
   - Include status and descriptive message

3. **Implement expiry date check**
   - Parse date strings to Date objects
   - Get current date/time
   - Compare with expiry date
   - Check if within valid range

4. **Check start date (activation)**
   - Verify coupon has started
   - Compare currentDate with startDate
   - Return "not yet active" if before start

5. **Check expiry date**
   - Compare currentDate with expiryDate
   - Return expired if current > expiry
   - Return valid if within range

6. **Generate time-based messages**
   - Expired: "Coupon expired on {date}"
   - Not started: "Coupon valid from {date}"
   - Active: "Valid until {date}"
   - Expires soon: "Expires in {hours} hours"

7. **Add time remaining calculation**
   - Calculate days/hours until expiry
   - Show countdown for expiring soon
   - Format: "2 days remaining" or "5 hours left"

8. **Handle timezone considerations**
   - Use UTC or server timezone consistently
   - Convert dates properly for comparison
   - Display in user's local time

9. **Add urgency indicators**
   - Flag coupons expiring within 24 hours
   - Flag coupons expiring within 7 days
   - Return urgency level in response

### Expiry Validation Structure

```typescript
interface ExpiryValidation {
  isValid: boolean;
  isExpired: boolean;
  isNotStarted: boolean;
  message: string;
  timeRemaining?: string;
  urgencyLevel?: 'high' | 'medium' | 'low';
}
```

### Function Signature

```typescript
function validateCouponExpiry(
  startDate: Date | string,
  expiryDate: Date | string,
  currentDate?: Date
): ExpiryValidation {
  // Implementation
}
```

### Validation Flow

```
Input: startDate, expiryDate, currentDate
       │
       ▼
┌──────────────────┐
│ Parse Dates      │──> Convert strings to Date objects
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Current <        │──Yes──> Return "Not yet active"
│   Start?         │
└────────┬─────────┘
         │ No
         ▼
┌──────────────────┐
│ Current >        │──Yes──> Return "Expired"
│   Expiry?        │
└────────┬─────────┘
         │ No
         ▼
┌──────────────────┐
│ Calculate Time   │──> Days/hours remaining
│   Remaining      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Determine        │──> high/medium/low
│  Urgency Level   │
└────────┬─────────┘
         │
         ▼
   Return Valid with Details
```

### Validation Scenarios

| Current Date | Start Date | Expiry Date | Status | Message |
|--------------|------------|-------------|--------|---------|
| 2026-01-31 | 2026-01-01 | 2026-02-28 | Valid | "Valid until Feb 28" |
| 2026-01-31 | 2026-02-01 | 2026-02-28 | Not Started | "Starts Feb 1" |
| 2026-01-31 | 2026-01-01 | 2026-01-30 | Expired | "Expired Jan 30" |
| 2026-01-31 | 2026-01-01 | 2026-01-31 | Valid | "Expires today!" |
| 2026-01-31 | 2026-01-01 | 2026-02-01 | Valid | "Expires in 1 day" |

### Time Remaining Calculation

```
Expiry Date: 2026-02-05 23:59:59
Current Date: 2026-01-31 10:00:00

Time Remaining:
├─> Difference = 5 days, 13 hours, 59 minutes
├─> Display: "5 days remaining"
└─> Urgency: Low

Expiry Date: 2026-02-01 08:00:00
Current Date: 2026-01-31 18:00:00

Time Remaining:
├─> Difference = 14 hours
├─> Display: "14 hours remaining"
└─> Urgency: High
```

### Urgency Levels

| Time Remaining | Urgency | Display Style | Message Prefix |
|----------------|---------|---------------|----------------|
| > 7 days | Low | Normal | "Valid until" |
| 2-7 days | Medium | Warning | "Expires in X days" |
| < 48 hours | High | Alert | "⚠ Expires soon" |
| < 24 hours | High | Urgent | "🔥 Expires in X hours!" |
| Today | High | Critical | "⚡ Expires today!" |

### UI Display Examples

```
Low Urgency (>7 days):
┌─────────────────────────────────────┐
│ Coupon: SAVE10                      │
│ Status: ✓ Valid                     │
│ Valid until: Feb 28, 2026           │
└─────────────────────────────────────┘

High Urgency (<24 hours):
┌─────────────────────────────────────┐
│ Coupon: SAVE10                      │
│ Status: ⚠ Expires Soon              │
│ ⏰ Only 8 hours remaining!          │
│ Expires: Jan 31, 2026 6:00 PM      │
└─────────────────────────────────────┘

Expired:
┌─────────────────────────────────────┐
│ Coupon: SAVE10                      │
│ Status: ✗ Expired                   │
│ Expired on: Jan 30, 2026            │
│ Try: SAVE15 (valid until Feb 15)   │
└─────────────────────────────────────┘

Not Started:
┌─────────────────────────────────────┐
│ Coupon: FUTURE10                    │
│ Status: ⏳ Not Yet Active           │
│ Starts: Feb 1, 2026                 │
│ Save for later!                     │
└─────────────────────────────────────┘
```

### Date Formatting

| Format | Example | Use Case |
|--------|---------|----------|
| Full | "January 31, 2026" | Detailed display |
| Short | "Jan 31, 2026" | Compact display |
| Relative | "in 5 days" | Time remaining |
| Time | "6:00 PM" | Expiry time |
| ISO | "2026-01-31T18:00:00Z" | API/storage |

### Integration with Validation API

```typescript
// In validateCoupon API
const validateCoupon = (request: ValidateCouponRequest) => {
  const coupon = getCouponByCode(request.code);
  
  // Expiry check
  const expiryCheck = validateCouponExpiry(
    coupon.startDate,
    coupon.expiryDate
  );
  
  if (!expiryCheck.isValid) {
    return {
      valid: false,
      message: expiryCheck.message,
      validationDetails: {
        notExpired: false,
        isExpired: expiryCheck.isExpired,
        isNotStarted: expiryCheck.isNotStarted
      }
    };
  }
  
  // Continue with other validations...
};
```

### Expected Outcome
- Accurate expiry date validation
- Clear expiration messages
- Time remaining calculations
- Urgency level indicators
- Timezone-aware date handling
- Integration with validation API

### Verification Checklist
- [ ] validateCouponExpiry function created
- [ ] Start date check implemented
- [ ] Expiry date check implemented
- [ ] Time remaining calculated correctly
- [ ] Urgency levels determined
- [ ] Clear validation messages
- [ ] Timezone handling implemented
- [ ] Date formatting functions added
- [ ] Integration with validation API
- [ ] Function exported properly
- [ ] JSDoc comments with examples

---

## Task 14: Create Usage Limit Check

### Overview
Implement usage limit validation for coupons, including per-user limits and global total usage limits. This prevents abuse by restricting how many times a coupon can be used by individual users and across all users, with proper tracking and clear feedback when limits are reached.

### Dependencies
- Task 08: Create Coupon Store
- Task 03: Create Validate Coupon API
- User authentication system

### Instructions

1. **Extend validation utilities**
   - Open `lib/utils/couponValidation.ts` file
   - Add usage limit validation functions
   - Import user and coupon usage types

2. **Create validateUsageLimits function**
   - Accept parameters: userUsageCount, usageLimitPerUser, totalUsageCount, totalUsageLimit
   - Return validation result object
   - Check both user and global limits

3. **Implement per-user limit check**
   - Compare userUsageCount with usageLimitPerUser
   - Return invalid if limit reached
   - Allow if no per-user limit set

4. **Implement global limit check**
   - Compare totalUsageCount with totalUsageLimit
   - Return invalid if exhausted
   - Allow if no global limit set

5. **Generate appropriate messages**
   - User limit: "You've reached the usage limit for this coupon"
   - Global limit: "This coupon has been fully redeemed"
   - Remaining uses: "You can use this {X} more times"

6. **Calculate remaining uses**
   - Per user: usageLimitPerUser - userUsageCount
   - Global: totalUsageLimit - totalUsageCount
   - Show minimum of both if applicable

7. **Handle special cases**
   - No limits set (unlimited usage)
   - One-time use coupons (limit = 1)
   - First-time user (usageCount = 0)
   - Combined limits (both user and global)

8. **Add usage tracking integration**
   - Fetch usage data from backend
   - Cache usage counts temporarily
   - Increment on successful application
   - Update cache after application

9. **Implement concurrent usage protection**
   - Handle race conditions
   - Check limits again at application time
   - Return error if limit reached between validate and apply

### Usage Limit Validation Structure

```typescript
interface UsageLimitValidation {
  isValid: boolean;
  userLimitReached: boolean;
  globalLimitReached: boolean;
  message: string;
  remainingUserUses?: number;
  remainingGlobalUses?: number;
}
```

### Function Signature

```typescript
function validateUsageLimits(
  userUsageCount: number,
  usageLimitPerUser?: number,
  totalUsageCount: number,
  totalUsageLimit?: number
): UsageLimitValidation {
  // Implementation
}
```

### Validation Flow

```
Input: userUsage, userLimit, totalUsage, totalLimit
       │
       ▼
┌──────────────────┐
│ User Limit Set?  │──No──> Skip user check
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ User Usage <     │──No──> Return "User limit reached"
│   User Limit?    │
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Global Limit     │──No──> Skip global check
│    Set?          │
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Total Usage <    │──No──> Return "Coupon exhausted"
│  Total Limit?    │
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Calculate        │──> remaining uses (both)
│  Remaining Uses  │
└────────┬─────────┘
         │
         ▼
   Return Valid with Details
```

### Validation Scenarios

| User Usage | User Limit | Total Usage | Total Limit | Result | Message |
|------------|------------|-------------|-------------|--------|---------|
| 2 | 3 | 500 | 1000 | ✓ Valid | "You can use 1 more time" |
| 3 | 3 | 500 | 1000 | ✗ Invalid | "User limit reached" |
| 1 | 5 | 1000 | 1000 | ✗ Invalid | "Coupon exhausted" |
| 0 | 1 | 50 | 100 | ✓ Valid | "One-time use" |
| 0 | None | 50 | None | ✓ Valid | "Unlimited uses" |
| 2 | 3 | 999 | 1000 | ✓ Valid | "Last redemption available" |

### Usage Limit Types

```
Type 1: Per-User Limit Only
├─> usageLimitPerUser: 3
├─> totalUsageLimit: None
└─> Each user can use 3 times (no global cap)

Type 2: Global Limit Only
├─> usageLimitPerUser: None
├─> totalUsageLimit: 1000
└─> First 1000 users total (unlimited per user)

Type 3: Both Limits
├─> usageLimitPerUser: 2
├─> totalUsageLimit: 100
└─> Each user max 2 uses, 100 total redemptions

Type 4: No Limits
├─> usageLimitPerUser: None
├─> totalUsageLimit: None
└─> Unlimited usage by all users
```

### UI Display Examples

```
Scenario 1: Within Limits
┌─────────────────────────────────────┐
│ Coupon: SAVE10                      │
│ Status: ✓ Available                 │
│ Usage: 1 of 3 uses                  │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 2: User Limit Reached
┌─────────────────────────────────────┐
│ Coupon: SAVE10                      │
│ Status: ✗ Limit Reached             │
│ You've used this coupon 3 times     │
│ (maximum allowed)                   │
└─────────────────────────────────────┘

Scenario 3: Global Limit Near
┌─────────────────────────────────────┐
│ Coupon: SAVE10                      │
│ Status: ⚠ Almost Gone               │
│ Only 5 redemptions left!            │
│ 995 of 1000 used globally           │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 4: One-Time Use (Fresh)
┌─────────────────────────────────────┐
│ Coupon: WELCOME50                   │
│ Status: ✓ Available                 │
│ One-time use per customer           │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 5: Global Exhausted
┌─────────────────────────────────────┐
│ Coupon: FLASH100                    │
│ Status: ✗ Expired                   │
│ All 500 coupons have been claimed   │
│ Try: SAVE20 (still available)       │
└─────────────────────────────────────┘
```

### Usage Tracking Data Structure

```typescript
interface CouponUsageData {
  couponId: string;
  userId: string;
  userUsageCount: number;
  totalUsageCount: number;
  lastUsedAt?: Date;
  usageHistory: Array<{
    usedAt: Date;
    orderId: string;
    discountAmount: number;
  }>;
}
```

### Concurrent Usage Protection

```
Scenario: Race Condition
Time    User A          User B          Total Count
────────────────────────────────────────────────────
T0      Validate        -               999/1000
T1      -               Validate        999/1000
        (sees valid)    (sees valid)
T2      Apply           -               1000/1000
        (success)
T3      -               Apply           1000/1000
                        (fails - limit reached)

Solution: Re-check limits during application
```

### Integration with Validation API

```typescript
// In validateCoupon API
const validateCoupon = async (request: ValidateCouponRequest) => {
  const coupon = getCouponByCode(request.code);
  
  // Fetch usage data
  const usageData = await getCouponUsageData(
    coupon.id,
    request.userId
  );
  
  // Usage limit check
  const limitCheck = validateUsageLimits(
    usageData.userUsageCount,
    coupon.usageLimitPerUser,
    usageData.totalUsageCount,
    coupon.totalUsageLimit
  );
  
  if (!limitCheck.isValid) {
    return {
      valid: false,
      message: limitCheck.message,
      validationDetails: {
        withinUsageLimit: false,
        userLimitReached: limitCheck.userLimitReached,
        globalLimitReached: limitCheck.globalLimitReached
      }
    };
  }
  
  // Continue with other validations...
};
```

### Error Messages

| Scenario | Message Template |
|----------|------------------|
| User limit reached | "You've reached the {limit}-time usage limit for this coupon" |
| Global exhausted | "This coupon has been fully redeemed ({total} of {limit} used)" |
| Last use | "This is your last available use for this coupon" |
| Near global limit | "Hurry! Only {remaining} redemptions left" |
| One-time used | "You've already used this one-time coupon" |

### Expected Outcome
- Accurate usage limit validation
- Per-user limit enforcement
- Global limit enforcement
- Clear feedback on remaining uses
- Protection against concurrent usage
- Integration with usage tracking

### Verification Checklist
- [ ] validateUsageLimits function created
- [ ] Per-user limit check implemented
- [ ] Global limit check implemented
- [ ] Remaining uses calculated
- [ ] Clear validation messages
- [ ] Edge cases handled (no limits, one-time)
- [ ] Concurrent usage protection
- [ ] Integration with validation API
- [ ] Usage tracking integration
- [ ] Function exported properly
- [ ] JSDoc comments with examples

---

## Task 15: Create Product-Specific Coupon Logic

### Overview
Implement product-specific coupon validation and application logic. These coupons are restricted to specific products and only provide discounts on those products in the cart. The system validates that at least one applicable product is present and calculates discounts only on eligible items.

### Dependencies
- Task 08: Create Coupon Store
- Task 03: Create Validate Coupon API
- Product catalog access

### Instructions

1. **Extend validation utilities**
   - Open `lib/utils/couponValidation.ts` file
   - Add product-specific validation function
   - Import product types

2. **Create validateProductRestriction function**
   - Accept parameters: cartItems, applicableProductIds
   - Return validation result
   - Check if any cart products match restriction

3. **Implement product matching logic**
   - Extract product IDs from cart items
   - Compare with applicableProductIds array
   - Return valid if at least one match found

4. **Calculate partial discounts**
   - Apply discount only to matching products
   - Calculate subtotal of applicable products
   - Apply coupon percentage/fixed to that subtotal

5. **Generate appropriate messages**
   - No match: "This coupon is not valid for items in your cart"
   - Match: "Discount applied to {count} eligible items"
   - List applicable products in message

6. **Handle multiple matching products**
   - Identify all matching products in cart
   - Sum quantities of matching products
   - Calculate combined discount

7. **Add product list helpers**
   - Get list of applicable products for display
   - Show which cart items qualify
   - Display non-qualifying items separately

8. **Implement edge cases**
   - Empty applicable products list (invalid coupon config)
   - No products in cart
   - All cart items non-qualifying
   - Mix of qualifying and non-qualifying items

9. **Add UI data for display**
   - Return list of qualifying cart items
   - Include discount per item
   - Total discount for all qualifying items

### Product Restriction Structure

```typescript
interface ProductRestrictionValidation {
  isValid: boolean;
  message: string;
  matchingProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    itemSubtotal: number;
    discountApplied: number;
  }>;
  totalDiscountOnProducts: number;
  applicableProductCount: number;
}
```

### Function Signature

```typescript
function validateProductRestriction(
  cartItems: CartItem[],
  applicableProductIds: string[],
  coupon: Coupon
): ProductRestrictionValidation {
  // Implementation
}
```

### Validation Flow

```
Input: cartItems, applicableProductIds, coupon
       │
       ▼
┌──────────────────┐
│ Restriction Set? │──No──> Return Valid (applies to all)
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Find Matching    │──> Filter cart items by IDs
│    Products      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Any Matches?     │──No──> Return Invalid
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Calculate        │──> Sum subtotal of matching items
│ Applicable Total │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Apply Discount   │──> Calculate discount on applicable total
│  to Matches      │
└────────┬─────────┘
         │
         ▼
   Return Valid with Discount Details
```

### Validation Scenarios

| Cart Products | Applicable Products | Result | Discount Applied To |
|---------------|---------------------|--------|---------------------|
| [A, B, C] | [A, B] | ✓ Valid | Products A and B only |
| [A, B, C] | [D, E] | ✗ Invalid | None |
| [A, B] | [A] | ✓ Valid | Product A only |
| [A, A, B] | [A] | ✓ Valid | Both A items (qty: 2) |
| [] | [A, B] | ✗ Invalid | None (empty cart) |

### Discount Calculation Examples

```
Example 1: Percentage Discount on Specific Products
Cart:
├─> Product A (₨5,000) ✓ Applicable
├─> Product B (₨3,000) ✗ Not applicable
└─> Product C (₨2,000) ✓ Applicable

Coupon: 10% off on Products A and C
Calculation:
├─> Applicable subtotal: ₨5,000 + ₨2,000 = ₨7,000
├─> Discount: ₨7,000 × 0.10 = ₨700
└─> Final: Cart ₨10,000 - ₨700 = ₨9,300

Example 2: Fixed Discount on Specific Product
Cart:
├─> Product A (₨8,000) ✓ Applicable
└─> Product B (₨5,000) ✗ Not applicable

Coupon: ₨500 off Product A
Calculation:
├─> Applicable subtotal: ₨8,000
├─> Discount: min(₨500, ₨8,000) = ₨500
└─> Final: Cart ₨13,000 - ₨500 = ₨12,500
```

### Cart Display with Product Restrictions

```
Before Applying Product-Specific Coupon:
┌────────────────────────────────────┐
│ Cart Items:                        │
│ ├─ Product A (₨5,000) × 1          │
│ ├─ Product B (₨3,000) × 1          │
│ └─ Product C (₨2,000) × 1          │
│                                    │
│ Subtotal: ₨10,000                  │
│ Total: ₨10,000                     │
└────────────────────────────────────┘

After Applying Coupon (10% off A & C):
┌────────────────────────────────────┐
│ Cart Items:                        │
│ ├─ Product A (₨5,000) × 1  ✓ -₨500│
│ ├─ Product B (₨3,000) × 1          │
│ └─ Product C (₨2,000) × 1  ✓ -₨200│
│                                    │
│ Subtotal: ₨10,000                  │
│ Coupon (PRODUCT10): -₨700          │
│ Applied to 2 eligible items        │
│ Total: ₨9,300                      │
└────────────────────────────────────┘
```

### UI Display Examples

```
Scenario 1: All Items Qualify
┌─────────────────────────────────────┐
│ Coupon: TECH10                      │
│ Status: ✓ Valid                     │
│ ──────────────────────────────────  │
│ All items in cart qualify!          │
│ Eligible items (3):                 │
│ ├─ Laptop ₨50,000                   │
│ ├─ Mouse ₨2,000                     │
│ └─ Keyboard ₨3,000                  │
│                                     │
│ Discount: ₨5,500 (10% off)          │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 2: Partial Match
┌─────────────────────────────────────┐
│ Coupon: SHOES20                     │
│ Status: ✓ Valid                     │
│ ──────────────────────────────────  │
│ Applies to 2 of 4 items:            │
│ ✓ Running Shoes ₨8,000              │
│ ✓ Sneakers ₨6,000                   │
│ ✗ T-shirt ₨2,000                    │
│ ✗ Jeans ₨4,000                      │
│                                     │
│ Discount: ₨2,800 (20% off shoes)    │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 3: No Match
┌─────────────────────────────────────┐
│ Coupon: ELECTRONICS15               │
│ Status: ✗ Not Applicable            │
│ ──────────────────────────────────  │
│ This coupon only applies to:        │
│ • Laptops                           │
│ • Smartphones                       │
│ • Tablets                           │
│                                     │
│ Your cart contains:                 │
│ • Clothing items                    │
│                                     │
│ Add eligible products to use        │
└─────────────────────────────────────┘
```

### Integration with Validation API

```typescript
// In validateCoupon API
const validateCoupon = (request: ValidateCouponRequest) => {
  const coupon = getCouponByCode(request.code);
  
  // Product restriction check
  if (coupon.applicableProducts?.length > 0) {
    const productCheck = validateProductRestriction(
      request.items,
      coupon.applicableProducts,
      coupon
    );
    
    if (!productCheck.isValid) {
      return {
        valid: false,
        message: productCheck.message,
        validationDetails: {
          productRestrictionMet: false
        }
      };
    }
    
    // Use partial discount amount
    discount = productCheck.totalDiscountOnProducts;
  }
  
  // Continue with other validations...
};
```

### Error Messages

| Scenario | Message |
|----------|---------|
| No matching products | "This coupon doesn't apply to any items in your cart" |
| Specific products only | "This coupon applies to: {product names}" |
| Partial match | "Discount applied to {count} eligible items" |
| Empty cart | "Add eligible products to use this coupon" |

### Expected Outcome
- Accurate product restriction validation
- Partial discount calculation for qualifying items
- Clear indication of which items qualify
- Detailed breakdown for users
- Integration with validation API
- Proper cart display updates

### Verification Checklist
- [ ] validateProductRestriction function created
- [ ] Product matching logic implemented
- [ ] Partial discount calculation correct
- [ ] Clear validation messages
- [ ] List of matching products returned
- [ ] Edge cases handled (no match, empty cart)
- [ ] UI helper data included
- [ ] Integration with validation API
- [ ] Cart display logic updated
- [ ] Function exported properly
- [ ] JSDoc comments with examples

---

## Task 16: Create Category Coupon Logic

### Overview
Implement category-specific coupon validation and application logic. These coupons are restricted to products within specific categories and only provide discounts on those category products in the cart. Similar to product-specific coupons but operating at the category level for broader applicability.

### Dependencies
- Task 08: Create Coupon Store
- Task 15: Create Product-Specific Coupon Logic (for pattern reference)
- Category/product taxonomy access

### Instructions

1. **Extend validation utilities**
   - Open `lib/utils/couponValidation.ts` file
   - Add category-specific validation function
   - Import category types

2. **Create validateCategoryRestriction function**
   - Accept parameters: cartItems, applicableCategoryIds
   - Return validation result
   - Check if any cart products belong to applicable categories

3. **Implement category matching logic**
   - Extract category IDs from cart items
   - Compare with applicableCategoryIds array
   - Return valid if at least one match found

4. **Calculate category-based discounts**
   - Apply discount only to matching category products
   - Calculate subtotal of products in applicable categories
   - Apply coupon discount to that subtotal

5. **Generate appropriate messages**
   - No match: "This coupon is for {category names} only"
   - Match: "Discount applied to {count} items in {categories}"
   - List applicable categories

6. **Handle multiple categories**
   - Support multiple applicable categories
   - Identify all matching products across categories
   - Sum quantities and values

7. **Add category hierarchy support (optional)**
   - Handle parent/child category relationships
   - Apply to subcategories if parent selected
   - Validate category tree structure

8. **Implement edge cases**
   - Empty applicable categories (invalid config)
   - No category match in cart
   - All items from non-qualifying categories
   - Mix of qualifying and non-qualifying categories

9. **Add UI data for display**
   - Return list of qualifying categories
   - Show which cart items qualify by category
   - Display non-qualifying items separately

### Category Restriction Structure

```typescript
interface CategoryRestrictionValidation {
  isValid: boolean;
  message: string;
  matchingCategories: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    categorySubtotal: number;
    discountApplied: number;
  }>;
  matchingItems: Array<{
    productId: string;
    productName: string;
    categoryName: string;
    quantity: number;
    discountApplied: number;
  }>;
  totalDiscountOnCategories: number;
}
```

### Function Signature

```typescript
function validateCategoryRestriction(
  cartItems: CartItem[],
  applicableCategoryIds: string[],
  coupon: Coupon
): CategoryRestrictionValidation {
  // Implementation
}
```

### Validation Flow

```
Input: cartItems, applicableCategoryIds, coupon
       │
       ▼
┌──────────────────┐
│ Restriction Set? │──No──> Return Valid (all categories)
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Find Products in │──> Filter by category IDs
│    Categories    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Any Matches?     │──No──> Return Invalid
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Group by         │──> Organize by category
│   Category       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate        │──> Sum subtotal per category
│ Category Totals  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Apply Discount   │──> Calculate discount on applicable total
└────────┬─────────┘
         │
         ▼
   Return Valid with Details
```

### Validation Scenarios

| Cart Items (Categories) | Applicable Categories | Result | Discount Applied To |
|------------------------|----------------------|--------|---------------------|
| [Electronics, Clothing] | [Electronics] | ✓ Valid | Electronics only |
| [Electronics, Clothing] | [Books] | ✗ Invalid | None |
| [Shoes, Shirts] | [Clothing] | ✓ Valid | Both (if Clothing parent) |
| [Laptops × 2, Mouse] | [Electronics] | ✓ Valid | All items |

### Discount Calculation Examples

```
Example 1: Single Category Discount
Cart:
├─> Laptop (Electronics) ₨50,000 ✓
├─> Mouse (Electronics) ₨2,000 ✓
├─> T-shirt (Clothing) ₨1,500 ✗
└─> Book (Books) ₨800 ✗

Coupon: 15% off Electronics
Calculation:
├─> Electronics subtotal: ₨52,000
├─> Discount: ₨52,000 × 0.15 = ₨7,800
└─> Final: Cart ₨54,300 - ₨7,800 = ₨46,500

Example 2: Multiple Categories
Cart:
├─> Laptop (Electronics) ₨50,000 ✓
├─> Phone (Electronics) ₨30,000 ✓
├─> Shoes (Footwear) ₨8,000 ✓
└─> Book (Books) ₨1,000 ✗

Coupon: 10% off Electronics & Footwear
Calculation:
├─> Applicable subtotal: ₨88,000
├─> Discount: ₨88,000 × 0.10 = ₨8,800
└─> Final: Cart ₨89,000 - ₨8,800 = ₨80,200
```

### Category Hierarchy Example

```
Category Tree:
Clothing (parent)
├─> Men's Clothing
│   ├─> Shirts
│   ├─> Pants
│   └─> Shoes
└─> Women's Clothing
    ├─> Dresses
    ├─> Tops
    └─> Shoes

Coupon: 20% off "Clothing"
Applies to: All subcategories
├─> Men's Shirts ✓
├─> Men's Pants ✓
├─> Women's Dresses ✓
└─> Women's Tops ✓

Coupon: 20% off "Men's Clothing"
Applies to: Men's subcategories only
├─> Men's Shirts ✓
├─> Men's Pants ✓
├─> Women's Dresses ✗
└─> Women's Tops ✗
```

### UI Display Examples

```
Scenario 1: Category Match
┌─────────────────────────────────────┐
│ Coupon: ELECTRONICS20               │
│ Status: ✓ Valid                     │
│ ──────────────────────────────────  │
│ Categories: Electronics              │
│ Eligible items (3):                 │
│                                     │
│ Electronics:                        │
│ ├─ Laptop ₨50,000 (-₨10,000)       │
│ ├─ Mouse ₨2,000 (-₨400)            │
│ └─ Keyboard ₨3,000 (-₨600)         │
│                                     │
│ Total discount: ₨11,000             │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 2: Multiple Categories
┌─────────────────────────────────────┐
│ Coupon: FASHION15                   │
│ Status: ✓ Valid                     │
│ ──────────────────────────────────  │
│ Categories: Clothing, Footwear      │
│ Eligible items (4):                 │
│                                     │
│ Clothing:                           │
│ ├─ T-shirt ₨1,500 (-₨225)          │
│ └─ Jeans ₨4,000 (-₨600)            │
│                                     │
│ Footwear:                           │
│ ├─ Sneakers ₨6,000 (-₨900)         │
│ └─ Sandals ₨2,000 (-₨300)          │
│                                     │
│ Total discount: ₨2,025              │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 3: No Match
┌─────────────────────────────────────┐
│ Coupon: BOOKS25                     │
│ Status: ✗ Not Applicable            │
│ ──────────────────────────────────  │
│ This coupon applies to:             │
│ • Books                             │
│ • Magazines                         │
│                                     │
│ Your cart contains:                 │
│ • Electronics                       │
│ • Clothing                          │
│                                     │
│ Browse Books to use this coupon     │
└─────────────────────────────────────┘
```

### Category Breakdown Display

```
Cart Summary with Category Coupon:
┌────────────────────────────────────┐
│ Cart Items:                        │
│                                    │
│ Electronics (Eligible):            │
│ ├─ Laptop ₨50,000    -₨10,000 ✓   │
│ ├─ Mouse ₨2,000      -₨400 ✓      │
│ └─ Subtotal: ₨52,000 -₨10,400     │
│                                    │
│ Clothing (Not eligible):           │
│ ├─ T-shirt ₨1,500                  │
│ └─ Subtotal: ₨1,500                │
│                                    │
│ ────────────────────────────────   │
│ Subtotal: ₨53,500                  │
│ Coupon (TECH20): -₨10,400          │
│ Total: ₨43,100                     │
│                                    │
│ ℹ Applied to Electronics only      │
└────────────────────────────────────┘
```

### Integration with Validation API

```typescript
// In validateCoupon API
const validateCoupon = (request: ValidateCouponRequest) => {
  const coupon = getCouponByCode(request.code);
  
  // Category restriction check
  if (coupon.applicableCategories?.length > 0) {
    const categoryCheck = validateCategoryRestriction(
      request.items,
      coupon.applicableCategories,
      coupon
    );
    
    if (!categoryCheck.isValid) {
      return {
        valid: false,
        message: categoryCheck.message,
        validationDetails: {
          categoryRestrictionMet: false
        }
      };
    }
    
    // Use category-based discount
    discount = categoryCheck.totalDiscountOnCategories;
  }
  
  // Continue with other validations...
};
```

### Error Messages

| Scenario | Message |
|----------|---------|
| No matching categories | "This coupon applies to {category names} only" |
| Specific categories | "Add items from {categories} to use this coupon" |
| Partial match | "Discount applied to {count} items in {categories}" |
| All match | "All cart items qualify! {category names}" |

### Expected Outcome
- Accurate category restriction validation
- Category-based discount calculation
- Clear indication of qualifying categories
- Detailed breakdown by category
- Support for multiple categories
- Integration with validation API

### Verification Checklist
- [ ] validateCategoryRestriction function created
- [ ] Category matching logic implemented
- [ ] Category-based discount calculation correct
- [ ] Clear validation messages
- [ ] List of matching categories returned
- [ ] Edge cases handled (no match, multiple categories)
- [ ] Category hierarchy support (optional)
- [ ] UI helper data included
- [ ] Integration with validation API
- [ ] Cart display logic updated
- [ ] Function exported properly
- [ ] JSDoc comments with examples

---

## Task 17: Create First Order Coupon Logic

### Overview
Implement first order coupon validation logic that restricts coupons to customers making their first purchase. This encourages new customer acquisition by offering special discounts for first-time buyers, with validation against order history to prevent misuse.

### Dependencies
- Task 08: Create Coupon Store
- Task 03: Create Validate Coupon API
- User order history access
- User authentication system

### Instructions

1. **Extend validation utilities**
   - Open `lib/utils/couponValidation.ts` file
   - Add first order validation function
   - Import user and order types

2. **Create validateFirstOrderRestriction function**
   - Accept parameters: userId, isFirstOrder flag
   - Return validation result
   - Check order history for user

3. **Implement order history check**
   - Query user's order history
   - Count completed orders
   - Return valid if count is 0 (first order)

4. **Handle user authentication states**
   - Logged-in users: Check order history
   - Guest users: Consider as potential first order
   - Anonymous checkout: Validate by email

5. **Generate appropriate messages**
   - Valid: "Welcome offer for first-time customers!"
   - Invalid: "This coupon is for first-time customers only"
   - Guest: "Sign in to verify first order eligibility"

6. **Add order status considerations**
   - Count only completed orders
   - Ignore cancelled orders
   - Exclude pending/draft orders
   - Consider refunded orders

7. **Implement guest checkout handling**
   - Check email for previous orders
   - Allow if email has no order history
   - Validate after order placement

8. **Add fraud prevention**
   - Track by email and user ID
   - Flag suspicious patterns
   - Limit based on device/IP (optional)

9. **Create welcome messaging**
   - Special messaging for new customers
   - Encourage account creation
   - Highlight first order benefits

### First Order Validation Structure

```typescript
interface FirstOrderValidation {
  isValid: boolean;
  isFirstOrder: boolean;
  message: string;
  orderCount: number;
  requiresAuth?: boolean;
}
```

### Function Signature

```typescript
async function validateFirstOrderRestriction(
  userId: string | null,
  userEmail?: string
): Promise<FirstOrderValidation> {
  // Implementation
}
```

### Validation Flow

```
Input: userId, userEmail
       │
       ▼
┌──────────────────┐
│ User Logged In?  │──No──> Check guest email
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Fetch Order      │──> Query user's orders
│    History       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Count Completed  │──> Filter by status
│     Orders       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Order Count = 0? │──No──> Return Invalid
└────────┬─────────┘
         │ Yes
         ▼
   Return Valid (First Order)

Guest Flow:
Input: userEmail
       │
       ▼
┌──────────────────┐
│ Email Provided?  │──No──> Return "Auth required"
└────────┬─────────┘
         │ Yes
         ▼
┌──────────────────┐
│ Check Email      │──> Query orders by email
│   History        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Order Count = 0? │──No──> Return Invalid
└────────┬─────────┘
         │ Yes
         ▼
   Return Valid (First Order)
```

### Validation Scenarios

| User Type | Order Count | Result | Message |
|-----------|-------------|--------|---------|
| Logged-in | 0 | ✓ Valid | "Welcome! First order discount" |
| Logged-in | 1+ | ✗ Invalid | "For first-time customers only" |
| Guest (new email) | 0 | ✓ Valid | "Welcome offer applied" |
| Guest (existing email) | 1+ | ✗ Invalid | "Email has previous orders" |
| Not logged in | - | ⚠ Pending | "Sign in to verify eligibility" |

### Order Status Considerations

```
Order Statuses to Count:
├─> Completed ✓ (Count as order)
├─> Delivered ✓ (Count as order)
├─> Shipped ✓ (Count as order)
├─> Pending ✗ (Don't count - not finalized)
├─> Cancelled ✗ (Don't count)
├─> Refunded ? (Configurable - depends on policy)
└─> Draft ✗ (Don't count)

Query Example:
SELECT COUNT(*) FROM orders
WHERE user_id = ?
AND status IN ('completed', 'delivered', 'shipped')
```

### UI Display Examples

```
Scenario 1: First Order (Logged In)
┌─────────────────────────────────────┐
│ Coupon: WELCOME50                   │
│ Status: ✓ Eligible                  │
│ ──────────────────────────────────  │
│ 🎉 Welcome to LCC!                  │
│ Get 50% off your first order        │
│                                     │
│ This is your first purchase         │
│ Enjoy exclusive new customer savings│
│                                     │
│ Discount: ₨2,500 off                │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘

Scenario 2: Not First Order
┌─────────────────────────────────────┐
│ Coupon: WELCOME50                   │
│ Status: ✗ Not Eligible              │
│ ──────────────────────────────────  │
│ This coupon is for first-time       │
│ customers only                      │
│                                     │
│ You've completed 3 orders with us   │
│                                     │
│ Try these instead:                  │
│ • SAVE20 - 20% off any order        │
│ • LOYAL100 - ₨100 off ₨5,000+       │
└─────────────────────────────────────┘

Scenario 3: Guest Checkout
┌─────────────────────────────────────┐
│ Coupon: WELCOME50                   │
│ Status: ⚠ Verification Needed       │
│ ──────────────────────────────────  │
│ Sign in to verify eligibility       │
│                                     │
│ [Sign In] or [Continue as Guest]    │
│                                     │
│ New customers get 50% off!          │
│ Create account to apply this coupon │
└─────────────────────────────────────┘

Scenario 4: Guest (New Email)
┌─────────────────────────────────────┐
│ Coupon: WELCOME50                   │
│ Status: ✓ Eligible                  │
│ ──────────────────────────────────  │
│ 🎉 Welcome new customer!            │
│                                     │
│ Email: john@example.com             │
│ No previous orders found            │
│                                     │
│ Get 50% off your first order        │
│ [Apply Coupon]                      │
└─────────────────────────────────────┘
```

### Guest Validation Logic

```typescript
async function validateGuestFirstOrder(email: string): Promise<boolean> {
  // Check if email has previous orders
  const orderCount = await getOrderCountByEmail(email);
  
  if (orderCount === 0) {
    return true; // First order
  }
  
  // Check if any orders are from authenticated user
  const userOrders = await getUserOrdersByEmail(email);
  
  if (userOrders.length === 0) {
    // Orders exist but user never authenticated
    // Policy decision: allow or deny?
    return policyAllowsGuestWithPreviousOrders;
  }
  
  return false; // Has previous orders
}
```

### Integration with Validation API

```typescript
// In validateCoupon API
const validateCoupon = async (request: ValidateCouponRequest) => {
  const coupon = getCouponByCode(request.code);
  
  // First order check
  if (coupon.firstOrderOnly) {
    const firstOrderCheck = await validateFirstOrderRestriction(
      request.userId,
      request.userEmail
    );
    
    if (!firstOrderCheck.isValid) {
      return {
        valid: false,
        message: firstOrderCheck.message,
        validationDetails: {
          firstOrderRestrictionMet: false,
          orderCount: firstOrderCheck.orderCount
        }
      };
    }
  }
  
  // Continue with other validations...
};
```

### Fraud Prevention Strategies

| Strategy | Implementation | Purpose |
|----------|----------------|---------|
| Email tracking | Check order history by email | Prevent multiple first orders |
| IP tracking | Log IP addresses | Flag suspicious patterns |
| Device fingerprinting | Track device IDs | Identify same device |
| Account linking | Link guest to user | Prevent exploitation |
| Velocity checks | Limit applications per time | Prevent abuse |

### Error Messages

| Scenario | Message |
|----------|---------|
| Not first order | "This coupon is for first-time customers only" |
| Has X orders | "You've already completed {count} orders with us" |
| Sign in required | "Sign in to verify first order eligibility" |
| Guest valid | "Welcome! First order discount applied" |
| Guest invalid | "This email has previous orders with us" |

### Expected Outcome
- Accurate first order validation
- Support for logged-in and guest users
- Clear eligibility messaging
- Order history verification
- Fraud prevention measures
- Integration with validation API

### Verification Checklist
- [ ] validateFirstOrderRestriction function created
- [ ] Order history query implemented
- [ ] Completed order count accurate
- [ ] Guest email validation included
- [ ] Clear validation messages
- [ ] Edge cases handled (no auth, guest)
- [ ] Order status filtering correct
- [ ] Fraud prevention measures added
- [ ] Integration with validation API
- [ ] Function exported properly
- [ ] JSDoc comments with examples

---

## Task 18: Verify Coupon API Integration

### Overview
Conduct comprehensive verification of the entire coupon system API integration. This includes testing all endpoints (validate, apply, remove), verifying all validation rules work correctly, ensuring state management functions properly, and confirming the complete user flow from validation to application to removal.

### Dependencies
- Tasks 01-17: All previous coupon system tasks

### Instructions

1. **Create verification test plan**
   - Document all test scenarios
   - Create test data (various coupon types)
   - Prepare test cart configurations
   - Define success criteria

2. **Test validate coupon endpoint**
   - Test with valid coupon codes
   - Test with invalid/non-existent codes
   - Test all validation rules individually
   - Test combined validation scenarios
   - Verify error messages are clear

3. **Test apply coupon endpoint**
   - Apply valid coupons
   - Attempt to apply invalid coupons
   - Test concurrent applications
   - Verify discount calculations
   - Check cart state updates

4. **Test remove coupon endpoint**
   - Remove applied coupons
   - Attempt to remove non-applied coupons
   - Verify cart total restoration
   - Check state cleanup

5. **Verify discount calculations**
   - Test percentage discounts (with and without caps)
   - Test fixed amount discounts
   - Test free shipping coupons
   - Verify accuracy of all calculations
   - Test edge cases (exceeding cart total, etc.)

6. **Verify all validation rules**
   - Minimum order amount validation
   - Expiry date checking (expired, not started, valid)
   - Usage limits (per-user and global)
   - Product-specific restrictions
   - Category restrictions
   - First order restrictions
   - Test combinations of restrictions

7. **Test state management**
   - Verify Zustand store updates
   - Check TanStack Query cache
   - Test optimistic updates
   - Verify rollback on errors
   - Check persistence (if enabled)

8. **Test error handling**
   - Network errors
   - Server errors (500)
   - Validation errors (400)
   - Timeout scenarios
   - Retry logic

9. **Verify user experience flows**
   - Enter coupon code → Validate → See result
   - Valid coupon → Apply → See discount
   - Applied coupon → Remove → Restore total
   - Invalid code → See helpful error
   - Almost valid → See guidance (e.g., add ₨X more)

10. **Test edge cases**
    - Empty cart with coupon
    - Multiple coupons (if allowed)
    - Coupon expires during session
    - Cart changes after validation
    - User logs out with applied coupon

11. **Verify UI updates**
    - Loading states display correctly
    - Success messages appear
    - Error messages are clear
    - Discount shows in cart
    - "Remove coupon" button works

12. **Performance testing**
    - Response times acceptable
    - Caching working correctly
    - No unnecessary API calls
    - Optimistic updates smooth

13. **Document verification results**
    - Create test result report
    - Document any issues found
    - List items needing fixes
    - Create regression test checklist

### Verification Test Plan

```
┌─────────────────────────────────────────────────────┐
│ Coupon System Integration Verification              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1. API Endpoints                                    │
│    ├─ Validate API        [Test 10 scenarios]      │
│    ├─ Apply API           [Test 8 scenarios]       │
│    └─ Remove API          [Test 5 scenarios]       │
│                                                     │
│ 2. Discount Types                                   │
│    ├─ Percentage          [Test 6 cases]           │
│    ├─ Fixed Amount        [Test 5 cases]           │
│    └─ Free Shipping       [Test 4 cases]           │
│                                                     │
│ 3. Validation Rules                                 │
│    ├─ Minimum Order       [Test 4 cases]           │
│    ├─ Expiry Date         [Test 5 cases]           │
│    ├─ Usage Limits        [Test 6 cases]           │
│    ├─ Product Restriction [Test 5 cases]           │
│    ├─ Category Restriction[Test 5 cases]           │
│    └─ First Order         [Test 4 cases]           │
│                                                     │
│ 4. State Management                                 │
│    ├─ Store Updates       [Test 5 scenarios]       │
│    ├─ Query Cache         [Test 4 scenarios]       │
│    └─ Optimistic Updates  [Test 3 scenarios]       │
│                                                     │
│ 5. Error Handling                                   │
│    ├─ Network Errors      [Test 3 scenarios]       │
│    ├─ Validation Errors   [Test 8 scenarios]       │
│    └─ Server Errors       [Test 2 scenarios]       │
│                                                     │
│ 6. User Flows                                       │
│    └─ End-to-End          [Test 6 complete flows]  │
│                                                     │
│ Total Test Cases: 98                                │
└─────────────────────────────────────────────────────┘
```

### Test Scenarios by Category

| Category | Scenario | Expected Result | Priority |
|----------|----------|-----------------|----------|
| **Validate API** | Valid code, all requirements met | { valid: true, discount: calculated } | High |
| | Invalid code | { valid: false, message: "Invalid code" } | High |
| | Expired coupon | { valid: false, message: "Expired" } | High |
| | Min order not met | { valid: false, message: "Add ₨X more" } | High |
| | Usage limit reached | { valid: false, message: "Limit reached" } | Medium |
| | Product not in cart | { valid: false, message: "Not applicable" } | Medium |
| | Category not in cart | { valid: false, message: "Not applicable" } | Medium |
| | Not first order | { valid: false, message: "First order only" } | Medium |
| | Valid with warnings | { valid: true, warnings: [...] } | Low |
| | Network error | Error handling triggered | High |

| Category | Scenario | Expected Result | Priority |
|----------|----------|-----------------|----------|
| **Apply API** | Apply valid coupon | { success: true, discount: X, newTotal: Y } | High |
| | Apply invalid code | { success: false, error: message } | High |
| | Apply expired code | { success: false, error: "Expired" } | High |
| | Apply with insufficient cart | { success: false, error: "Min order" } | Medium |
| | Concurrent application | Second fails gracefully | Medium |
| | Cart changed since validate | Re-validates and fails/succeeds | Medium |
| | Apply when already applied | { success: false, error: "Already applied" } | Low |
| | Network error during apply | Error handling, rollback | High |

| Category | Scenario | Expected Result | Priority |
|----------|----------|-----------------|----------|
| **Remove API** | Remove applied coupon | { success: true, restoredTotal: X } | High |
| | Remove when none applied | { success: false, message: "None applied" } | Medium |
| | Network error during remove | Error handling triggered | Medium |
| | Remove and reapply different | Both operations succeed | Low |
| | Remove with optimistic update | UI updates immediately | Low |

### Discount Calculation Verification

```
Test Case 1: Percentage Discount (No Cap)
├─ Coupon: 10% off
├─ Cart Total: ₨10,000
├─ Expected Discount: ₨1,000
└─ Expected Total: ₨9,000

Test Case 2: Percentage with Cap
├─ Coupon: 20% off (max ₨5,000)
├─ Cart Total: ₨50,000
├─ Calculated: ₨10,000
├─ Expected Discount: ₨5,000 (capped)
└─ Expected Total: ₨45,000

Test Case 3: Fixed Amount
├─ Coupon: ₨500 off
├─ Cart Total: ₨8,000
├─ Expected Discount: ₨500
└─ Expected Total: ₨7,500

Test Case 4: Fixed Exceeding Total
├─ Coupon: ₨500 off
├─ Cart Total: ₨300
├─ Expected Discount: ₨300 (capped at total)
└─ Expected Total: ₨0

Test Case 5: Free Shipping
├─ Coupon: Free shipping
├─ Cart Total: ₨10,000
├─ Shipping Cost: ₨350
├─ Expected Discount: ₨350
└─ Expected Total: ₨10,000
```

### State Management Verification

```
Test: Apply Coupon State Updates
Initial State:
├─ appliedCoupon: null
├─ discount: 0
└─ isLoading: false

During Application:
├─ appliedCoupon: null
├─ discount: 0
└─ isLoading: true

After Success:
├─ appliedCoupon: { code: "SAVE10", ... }
├─ discount: 1500
└─ isLoading: false

After Remove:
├─ appliedCoupon: null
├─ discount: 0
└─ isLoading: false
```

### User Flow Verification

```
Flow 1: Successful Coupon Application
1. User enters coupon code "SAVE10"
2. Click "Validate" or auto-validate
3. API call to /validate
4. Response: { valid: true, discount: 1500 }
5. UI shows: "Valid! You save ₨1,500"
6. "Apply Coupon" button enabled
7. Click "Apply Coupon"
8. API call to /apply
9. Response: { success: true, newTotal: 13500 }
10. Store updated with coupon
11. Cart displays discount: -₨1,500
12. Total updated to ₨13,500
13. "Remove Coupon" button displayed
✓ Flow complete

Flow 2: Invalid Coupon (Expired)
1. User enters code "EXPIRED10"
2. Auto-validate triggers
3. API call to /validate
4. Response: { valid: false, message: "Coupon expired on Jan 30" }
5. UI shows error: "This coupon has expired"
6. "Apply Coupon" button disabled
7. Helpful message: "Try SAVE15 (valid until Feb 15)"
✓ Flow complete

Flow 3: Almost Valid (Min Order)
1. User enters code "BIG500"
2. Cart total: ₨4,000
3. API call to /validate
4. Response: { valid: false, message: "Minimum ₨5,000 required (add ₨1,000)" }
5. UI shows: Progress bar 80%
6. Message: "Add ₨1,000 more to use this coupon"
7. User adds item worth ₨1,500
8. Cart total now: ₨5,500
9. Auto-revalidate triggers
10. Response: { valid: true, discount: 500 }
11. "Apply Coupon" button enabled
12. User applies successfully
✓ Flow complete
```

### Error Handling Verification

| Error Type | Trigger | Expected Behavior | Verified |
|------------|---------|-------------------|----------|
| Network error | Disconnect internet | Show "Connection error, try again" | [ ] |
| Server error (500) | Backend crash | Show "Server error, try later" | [ ] |
| Invalid code (400) | Non-existent code | Show "Invalid coupon code" | [ ] |
| Validation failure | Min order not met | Show specific requirement | [ ] |
| Timeout | Slow network | Show "Request timed out, retry" | [ ] |
| Concurrent limit | Two users, last spot | One succeeds, one gets "exhausted" | [ ] |
| Optimistic rollback | Apply fails after optimistic | UI reverts to previous state | [ ] |

### Verification Checklist

```
API Endpoints:
[ ] Validate endpoint responds correctly
[ ] Apply endpoint updates cart properly
[ ] Remove endpoint restores cart
[ ] All endpoints have proper error handling
[ ] Response formats match TypeScript types

Discount Calculations:
[ ] Percentage discounts accurate
[ ] Percentage caps work correctly
[ ] Fixed discounts accurate
[ ] Fixed discounts capped at cart total
[ ] Free shipping applies correctly

Validation Rules:
[ ] Minimum order validation works
[ ] Expiry date checking accurate
[ ] Per-user usage limits enforced
[ ] Global usage limits enforced
[ ] Product restrictions validated
[ ] Category restrictions validated
[ ] First order restriction works

State Management:
[ ] Zustand store updates on apply
[ ] Store clears on remove
[ ] TanStack Query caches responses
[ ] Cache invalidates appropriately
[ ] Optimistic updates work
[ ] Rollback works on error

User Experience:
[ ] Loading states display
[ ] Success messages clear
[ ] Error messages helpful
[ ] Discount visible in cart
[ ] Remove button functional
[ ] Flows feel smooth and responsive

Performance:
[ ] API responses < 500ms (p95)
[ ] No unnecessary duplicate calls
[ ] Caching reduces API calls
[ ] Optimistic updates feel instant
```

### Verification Report Template

```
┌─────────────────────────────────────────────┐
│ Coupon System Verification Report          │
│ Date: January 31, 2026                     │
│ Tested by: [Name]                          │
├─────────────────────────────────────────────┤
│                                            │
│ Summary:                                   │
│ ├─ Total Tests: 98                        │
│ ├─ Passed: 94                             │
│ ├─ Failed: 2                              │
│ └─ Skipped: 2                             │
│                                            │
│ Issues Found:                              │
│ 1. [Critical] Usage limit race condition   │
│    └─ Fix: Add server-side locking        │
│                                            │
│ 2. [Minor] Error message unclear for       │
│    category restriction                    │
│    └─ Fix: Update message copy            │
│                                            │
│ Recommendations:                           │
│ ├─ Add rate limiting to validation API    │
│ ├─ Implement more aggressive caching       │
│ └─ Add analytics tracking                 │
│                                            │
│ Sign-off:                                  │
│ [ ] API Integration verified              │
│ [ ] All discount types working            │
│ [ ] Validation rules functional           │
│ [ ] State management correct              │
│ [ ] Ready for QA testing                  │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Comprehensive verification of coupon system
- All API endpoints tested and functional
- All validation rules verified
- State management confirmed working
- User flows tested end-to-end
- Issues documented for resolution
- System ready for production use

### Verification Checklist (Final)
- [ ] Verification test plan created
- [ ] All API endpoints tested
- [ ] All discount types verified
- [ ] All validation rules checked
- [ ] State management confirmed
- [ ] Error handling verified
- [ ] User flows tested
- [ ] Edge cases checked
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Issues logged
- [ ] Verification report completed
- [ ] Sign-off obtained
- [ ] System ready for next phase

---

## Summary

This document completed the coupon system backend integration by implementing all advanced validation rules and conducting comprehensive verification. The system now supports free shipping coupons, minimum order validation, expiry checking, usage limits (per-user and global), product-specific coupons, category-based coupons, and first order restrictions. Complete API integration verification ensures the entire coupon system functions correctly and is ready for production use.

### Completed Tasks
11. ✓ Created free shipping coupon logic with proper discount calculation
12. ✓ Created minimum order validation with shortfall calculation
13. ✓ Created coupon expiry check with urgency indicators
14. ✓ Created usage limit check (per-user and global)
15. ✓ Created product-specific coupon validation and application
16. ✓ Created category coupon validation and application
17. ✓ Created first order coupon restriction logic
18. ✓ Verified complete coupon API integration

### System Capabilities
- ✓ Three discount types: percentage, fixed amount, free shipping
- ✓ Six validation rules: minimum order, expiry, usage limits, product/category restrictions, first order
- ✓ Complete API integration: validate, apply, remove
- ✓ State management: Zustand store + TanStack Query
- ✓ Type-safe implementation with TypeScript
- ✓ Error handling and user feedback
- ✓ Sri Lanka localization (LKR currency ₨)

### Next Phase
The coupon system backend is complete. Proceed to **Group B: Coupon UI Components** to implement the user interface for coupon input, validation feedback, discount display, and coupon management in the webstore cart.
