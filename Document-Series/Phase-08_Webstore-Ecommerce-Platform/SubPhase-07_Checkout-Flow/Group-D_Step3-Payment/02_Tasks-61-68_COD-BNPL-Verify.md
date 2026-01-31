# Tasks 61-68: COD, BNPL, and Payment Step Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** D of F  
> **Document:** 02 of 02  
> **Tasks Covered:** 61-68  
> **Document Goal:** Create Cash on Delivery option with conditions, BNPL payment methods (KOKO and MintPay), payment validation, and verify complete step 3 payment flow

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-60_Methods-Bank-Transfer.md](01_Tasks-53-60_Methods-Bank-Transfer.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 61: Create Cash on Delivery (COD) Option](#task-61-create-cash-on-delivery-cod-option)
3. [Task 62: Create COD Conditions and Fee Display](#task-62-create-cod-conditions-and-fee-display)
4. [Task 63: Create KOKO BNPL Option](#task-63-create-koko-bnpl-option)
5. [Task 64: Create MintPay BNPL Option](#task-64-create-mintpay-bnpl-option)
6. [Task 65: Create Payment Selection State Management](#task-65-create-payment-selection-state-management)
7. [Task 66: Create Payment Method Icons](#task-66-create-payment-method-icons)
8. [Task 67: Create Payment Validation Logic](#task-67-create-payment-validation-logic)
9. [Task 68: Verify Complete Step 3 Payment Flow](#task-68-verify-complete-step-3-payment-flow)
10. [Integration Testing](#integration-testing)
11. [Quality Checklist](#quality-checklist)

---

## Overview

This document covers the completion of the payment step (step 3) with Cash on Delivery (COD) and Buy Now Pay Later (BNPL) payment methods. It implements COD with proper conditions checking and fee calculation, adds KOKO and MintPay BNPL options, creates comprehensive payment validation, and verifies the complete payment flow. These payment methods are highly popular in Sri Lanka and essential for local e-commerce success.

### Key Outcomes

- Cash on Delivery (COD) payment option with ₨200 delivery fee
- COD eligibility conditions checking (order limits, location restrictions)
- COD fee display and order total calculation
- KOKO BNPL integration (3 installments, 0% interest)
- MintPay BNPL integration (3 installments, minimum order)
- Payment selection state management hook
- Payment method icons and branding components
- Comprehensive payment validation logic
- Payment method error handling
- Complete step 3 verification with all methods
- API integration preparation for Phase-09

### Technology Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Hook Form for validation
- Custom hooks for state management
- Zustand for checkout state
- Date-fns for installment calculations

### Sri Lanka E-Commerce Context

This document addresses the most popular payment methods in Sri Lanka:

- **Cash on Delivery (COD):** The MOST popular payment method in Sri Lanka due to trust issues with online payment. Many customers prefer COD despite the delivery fee.
- **COD Fee:** Standard ₨200 delivery fee is common practice for COD orders in Sri Lanka
- **Order Limits:** COD typically limited to ₨25,000 maximum to reduce business risk
- **BNPL Growth:** Buy Now Pay Later is rapidly growing in Sri Lanka among younger demographics
- **KOKO:** Local BNPL provider with 0% interest on timely payments
- **MintPay:** Growing BNPL provider with flexible installment options
- **Trust Building:** Offering multiple payment methods builds customer trust and increases conversion

---

## Task 61: Create Cash on Delivery (COD) Option

**Complexity:** Low  
**Dependencies:** Task 55 (Payment Method Card)  
**Priority:** Critical Path

### Objective

Create the Cash on Delivery (COD) payment option component that allows customers to pay in cash when their order is delivered. This is the most popular payment method in Sri Lanka and must be prominently featured with clear information about the delivery fee and payment process.

### Requirements

#### Functional Requirements

1. **COD Payment Method Card**
   - Display "Cash on Delivery" as method name
   - Show cash/money icon (Banknote icon from Lucide)
   - Display "Pay when you receive your order" as description
   - Show ₨200 delivery fee prominently
   - Radio button selection integration

2. **Method Selection**
   - Selectable via payment method card
   - Expand to show COD details when selected
   - Show fee calculation breakdown
   - Display delivery instructions

3. **Fee Display**
   - Show ₨200 COD delivery fee clearly
   - Display fee as line item in expanded view
   - Update order total to include COD fee
   - Show subtotal + COD fee = total calculation

4. **Information Display**
   - "Pay with cash when your order arrives" message
   - "Please keep exact change ready" instruction
   - "Delivery person will collect payment" note
   - "Receipt will be provided" assurance

5. **Visual Indicators**
   - Cash icon (Banknote from Lucide)
   - Green "Popular" badge on card
   - Clear fee display in red or accent color
   - Checkmark when selected

#### Non-Functional Requirements

1. **User Experience**
   - Clear and simple interface
   - Prominent fee display to avoid surprises
   - Trust-building messaging
   - Mobile-optimized layout

2. **Performance**
   - Fast rendering
   - Smooth expand/collapse animation
   - No lag when selecting

3. **Accessibility**
   - ARIA label: "Cash on Delivery payment method"
   - Screen reader announcement of fee
   - Keyboard navigation support
   - High contrast for fee display

4. **Responsive Design**
   - Mobile-first layout
   - Touch-friendly selection
   - Readable text on all devices
   - Icon scales appropriately

### Component Structure

#### CODOption.tsx Elements

| Element | Purpose | Details |
|---------|---------|---------|
| Method Card Wrapper | Container | Uses PaymentMethodCard component |
| Cash Icon | Visual identifier | Banknote icon from Lucide |
| Method Name | Primary label | "Cash on Delivery (COD)" |
| Popular Badge | Trust indicator | Green badge "Most Popular" |
| Fee Display | Cost transparency | "₨200 delivery fee applies" |
| Expanded Content | Details section | Shows when selected |
| Instructions | User guidance | Payment process information |
| Fee Breakdown | Cost calculation | Subtotal + Fee = Total |
| Selection State | Active indicator | Checkmark and border highlight |

### Information Architecture

#### Main Card Content

| Content | Value |
|---------|-------|
| Title | Cash on Delivery |
| Icon | Banknote (Lucide) |
| Badge | "Most Popular in Sri Lanka" |
| Description | Pay with cash when your order arrives |
| Fee Notice | +₨200 delivery fee |

#### Expanded Content (When Selected)

| Section | Content |
|---------|---------|
| How it Works | 1. Select COD as payment method<br>2. Complete your order<br>3. Receive delivery call<br>4. Pay driver in cash |
| Instructions | - Keep exact change ready<br>- Payment due on delivery<br>- Receipt provided by driver |
| Fee Breakdown | Subtotal: ₨[amount]<br>COD Fee: ₨200<br>**Total: ₨[amount + 200]** |
| Important Note | COD fee is non-refundable |

### Visual Design Specifications

#### Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Icon | text-green-600 | Positive, cash association |
| Popular Badge | bg-green-100, text-green-800 | Trust indicator |
| Fee Text | text-red-600 | Draw attention to fee |
| Selected Border | border-green-500 | Active state |
| Card Background | bg-white/bg-gray-50 | Clean, readable |

#### Typography

| Element | Style | Size |
|---------|-------|------|
| Method Name | font-semibold | text-lg |
| Description | font-normal | text-sm |
| Fee Notice | font-medium | text-sm |
| Instructions | font-normal | text-xs |
| Total Amount | font-bold | text-lg |

#### Spacing

| Element | Spacing |
|---------|---------|
| Card Padding | p-4 |
| Icon Margin | mr-3 |
| Badge Margin | ml-2 |
| Section Gap | space-y-3 |
| Instructions List | space-y-1 |

### State Management

#### Component State

| State | Type | Purpose |
|-------|------|---------|
| isSelected | boolean | Track if COD is selected |
| showFeeBreakdown | boolean | Toggle fee breakdown visibility |
| codFee | number | COD fee amount (200) |
| orderSubtotal | number | Order amount before COD fee |
| orderTotal | number | Subtotal + COD fee |

#### State Updates

| Action | State Change | Effect |
|--------|-------------|--------|
| Select COD | isSelected = true | Expand details, show fee |
| Deselect COD | isSelected = false | Collapse details |
| Calculate Total | orderTotal = subtotal + 200 | Update checkout total |

### Integration Points

#### With Payment Method Card

| Integration | Description |
|-------------|-------------|
| Card Props | Pass icon, title, description, badge |
| Selection Handler | Handle radio button selection |
| Expand/Collapse | Control expanded content visibility |

#### With Checkout Store

| Integration | Description |
|-------------|-------------|
| Set Payment Method | Update method to 'cod' |
| Update Total | Add ₨200 to order total |
| Store Selection | Persist COD selection |

#### With Order Summary

| Integration | Description |
|-------------|-------------|
| Add Fee Line | Show "COD Fee: ₨200" |
| Update Total | Display new total amount |
| Highlight Change | Show total increase |

### Data Flow

#### Selection Flow

1. User clicks COD payment card
2. Component calls onSelect handler
3. Update checkout store: `method: 'cod'`
4. Add COD fee to order total: `total += 200`
5. Expand card to show details
6. Display fee breakdown
7. Enable "Continue" button

#### Fee Calculation Flow

1. Get order subtotal from checkout store
2. Define COD fee: `const COD_FEE = 200`
3. Calculate new total: `total = subtotal + COD_FEE`
4. Update checkout store with new total
5. Notify order summary component
6. Display updated total in UI

### Validation Requirements

#### Selection Validation

| Check | Validation | Error Message |
|-------|-----------|---------------|
| Method Selected | COD is selected | "Please select a payment method" |
| Conditions Met | See Task 62 | Various condition errors |

### Error Handling

#### Error Scenarios

| Error | Cause | User Message |
|-------|-------|--------------|
| Conditions Not Met | Order exceeds limit | "COD not available for orders over ₨25,000" |
| Invalid Location | Address outside Sri Lanka | "COD only available within Sri Lanka" |
| Low Order Value | Order below minimum | "Minimum order ₨500 required for COD" |

### User Experience Considerations

#### Trust Building

| Element | Purpose |
|---------|---------|
| Popular Badge | Shows COD is widely used and trusted |
| Clear Instructions | Reduces uncertainty about process |
| Receipt Assurance | Guarantees proof of payment |
| No Surprises | Fee displayed upfront, not at end |

#### Mobile Optimization

| Consideration | Implementation |
|---------------|----------------|
| Touch Target | Minimum 44px touch area |
| Readable Text | Minimum 14px font size |
| Clear Hierarchy | Bold amounts, clear labels |
| Easy Collapse | Tap anywhere to collapse |

### Best Practices

#### Implementation Guidelines

1. **Fee Transparency**
   - Display fee on main card before selection
   - Show fee again in expanded view
   - Include fee in total calculation
   - Never hide the fee

2. **Clear Communication**
   - Use simple, direct language
   - Explain the payment process
   - Set proper expectations
   - Build trust with assurances

3. **Visual Clarity**
   - Use cash/money icon universally recognized
   - Green for positive/popular association
   - Red for fee to draw attention
   - Clear visual hierarchy

4. **State Management**
   - Update total immediately on selection
   - Persist selection across navigation
   - Clear selection if deselected
   - Validate before allowing continue

### Testing Checklist

#### Functional Tests

- [ ] COD method displays correctly
- [ ] Popular badge appears
- [ ] ₨200 fee shown prominently
- [ ] Selection toggles card state
- [ ] Expanded content shows when selected
- [ ] Fee breakdown displays correctly
- [ ] Order total updates with fee
- [ ] Selection state persists
- [ ] Instructions display clearly
- [ ] Icon renders properly

#### Visual Tests

- [ ] Card layout matches design
- [ ] Icon color correct (green)
- [ ] Fee text highlighted (red)
- [ ] Badge styled properly
- [ ] Spacing consistent
- [ ] Mobile layout responsive
- [ ] Typography correct
- [ ] Colors match palette

#### Integration Tests

- [ ] Updates checkout store on selection
- [ ] Adds fee to order total
- [ ] Integrates with payment card component
- [ ] Updates order summary
- [ ] Enables continue button
- [ ] Validates conditions (Task 62)

---

## Task 62: Create COD Conditions and Fee Display

**Complexity:** Low  
**Dependencies:** Task 61 (COD Option)  
**Priority:** Critical Path

### Objective

Implement business rules and conditions for Cash on Delivery availability, validate eligibility based on order value and delivery location, and provide clear feedback when conditions are not met. This ensures COD is only offered when appropriate and reduces business risk.

### Requirements

#### Functional Requirements

1. **Order Value Limits**
   - Minimum order: ₨500
   - Maximum order: ₨25,000
   - Check subtotal before COD fee
   - Block selection if outside limits

2. **Location Restrictions**
   - COD available only within Sri Lanka
   - Check shipping address country
   - Validate delivery area availability
   - Block if international delivery

3. **Fee Application**
   - Fixed fee: ₨200
   - Applied automatically on selection
   - Removed if method deselected
   - Clearly shown in order summary

4. **Eligibility Display**
   - Show checkmark if eligible
   - Show warning icon if ineligible
   - Display specific reason for ineligibility
   - Disable selection if ineligible

5. **Condition Messages**
   - "COD available for this order" (eligible)
   - "Order must be between ₨500 and ₨25,000" (out of range)
   - "COD only available within Sri Lanka" (location issue)
   - "COD not available for this order" (general)

#### Non-Functional Requirements

1. **Performance**
   - Real-time validation
   - Instant feedback on changes
   - No delay in eligibility check
   - Efficient condition evaluation

2. **Accuracy**
   - Correct limit calculations
   - Accurate location checking
   - Proper fee application
   - Reliable validation

3. **User Experience**
   - Clear eligibility status
   - Helpful error messages
   - Suggestion for alternatives
   - No confusing states

4. **Data Integrity**
   - Validate on client and server
   - Prevent invalid submissions
   - Maintain consistency
   - Handle edge cases

### Business Rules

#### COD Availability Matrix

| Condition | Requirement | Valid Range | Action if Failed |
|-----------|-------------|-------------|------------------|
| Order Minimum | Subtotal ≥ ₨500 | ₨500 - unlimited | Show minimum message, disable COD |
| Order Maximum | Subtotal ≤ ₨25,000 | ₨0 - ₨25,000 | Show maximum message, disable COD |
| Delivery Location | Country = Sri Lanka | Sri Lanka only | Show location message, disable COD |
| Combined Check | All conditions met | - | Enable COD, show eligible |

#### Fee Structure

| Order Value | COD Fee | Total Minimum | Total Maximum |
|-------------|---------|---------------|---------------|
| ₨500 - ₨25,000 | ₨200 | ₨700 | ₨25,200 |
| < ₨500 | N/A (Not available) | - | - |
| > ₨25,000 | N/A (Not available) | - | - |

### Validation Logic

#### Eligibility Calculation

| Step | Check | Pass Criteria | Fail Action |
|------|-------|---------------|-------------|
| 1 | Get order subtotal | Has valid number | Return ineligible |
| 2 | Check minimum | subtotal ≥ 500 | Show min message |
| 3 | Check maximum | subtotal ≤ 25000 | Show max message |
| 4 | Get shipping address | Has address | Return ineligible |
| 5 | Check country | country === 'LK' or 'Sri Lanka' | Show location message |
| 6 | All passed | All true | Return eligible |

#### Validation Response Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| isEligible | boolean | Overall eligibility | true/false |
| reason | string | Failure reason | 'ORDER_TOO_HIGH' |
| message | string | User-friendly message | 'Order exceeds ₨25,000 limit' |
| suggestedMethods | string[] | Alternative methods | ['bank_transfer', 'payhere'] |

### UI Component Structure

#### Eligibility Indicator

| Element | Eligible State | Ineligible State |
|---------|----------------|------------------|
| Icon | CheckCircle (green) | AlertTriangle (red) |
| Status Text | "COD Available" | "COD Not Available" |
| Details | Fee amount | Reason message |
| Card State | Enabled, clickable | Disabled, grayed out |
| Badge | "Popular" shown | Warning badge |

#### Condition Display Sections

| Section | Content | When Shown |
|---------|---------|------------|
| Eligibility Status | Icon + message | Always |
| Order Limits | Min/max requirements | When out of range |
| Fee Notice | ₨200 fee amount | When eligible |
| Location Notice | Sri Lanka only | When location invalid |
| Suggested Alternatives | Other payment methods | When ineligible |

### Condition Messages

#### Order Value Messages

| Condition | Message | Icon | Action |
|-----------|---------|------|--------|
| Too Low | "Order minimum is ₨500 for COD. Add ₨[difference] more to qualify." | Info | Suggest continue shopping |
| Too High | "COD available for orders up to ₨25,000. Please choose another payment method." | Warning | Show alternatives |
| In Range | "Your order qualifies for COD. ₨200 fee applies." | Check | Allow selection |

#### Location Messages

| Condition | Message | Icon | Action |
|-----------|---------|------|--------|
| International | "COD is only available for delivery within Sri Lanka." | X | Show PayHere |
| No Address | "Please complete shipping address to check COD availability." | Info | Redirect to shipping |
| Valid Location | "COD delivery available to your area." | Check | Allow selection |

### Fee Display Specifications

#### Fee Presentation

| Location | Format | Emphasis | Example |
|----------|--------|----------|---------|
| Card Header | "+ ₨200 fee" | Medium | Small text, gray |
| Expanded View | "COD Fee: ₨200" | High | Bold, red |
| Order Summary | "COD Delivery Fee" | High | Line item |
| Total Calculation | Included in total | High | Bold total |

#### Fee Calculation Display

| Item | Amount | Format |
|------|--------|--------|
| Subtotal | ₨[amount] | Normal weight |
| COD Fee | ₨200 | Medium weight, red |
| Divider | - | Thin line |
| Total | ₨[amount + 200] | Bold, large |

### State Management

#### Eligibility State

| State Variable | Type | Purpose |
|---------------|------|---------|
| isEligible | boolean | COD can be used |
| minOrderMet | boolean | ≥ ₨500 check |
| maxOrderMet | boolean | ≤ ₨25,000 check |
| validLocation | boolean | Sri Lanka check |
| ineligibilityReason | string | Why not eligible |

#### Fee State

| State Variable | Type | Purpose |
|---------------|------|---------|
| COD_FEE | number | Fixed fee (200) |
| feeApplied | boolean | Fee added to total |
| subtotal | number | Order before fee |
| total | number | Order with fee |

### Integration Points

#### With COD Option Component

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| Pass Eligibility | Parent → Child | Enable/disable option |
| Pass Message | Parent → Child | Show reason text |
| Pass Fee | Parent → Child | Display fee amount |
| Handle Selection | Child → Parent | Validate before select |

#### With Checkout Store

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| Get Subtotal | Store → Component | Check limits |
| Get Address | Store → Component | Check location |
| Update Total | Component → Store | Add fee |
| Store Validation | Component → Store | Save result |

#### With Order Summary

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| Add Fee Line | Component → Summary | Show COD fee |
| Update Total | Component → Summary | Show new total |
| Remove Fee | Component → Summary | Remove on deselect |

### Validation Flow

#### Real-Time Validation Process

1. **On Component Mount**
   - Get order subtotal from store
   - Get shipping address from store
   - Run eligibility check
   - Display initial status

2. **On Order Amount Change**
   - Cart updated
   - Subtotal recalculated
   - Re-run eligibility check
   - Update UI status
   - If became ineligible and selected, deselect

3. **On Address Change**
   - User returns from shipping step
   - Address updated
   - Re-run location check
   - Update UI status

4. **On Method Selection**
   - User clicks COD card
   - Run final validation
   - If eligible, allow selection
   - If ineligible, show modal with details
   - Suggest alternative methods

### Error Handling

#### Validation Error Scenarios

| Error Code | Condition | User Message | Recovery Action |
|-----------|-----------|--------------|-----------------|
| COD_MIN_NOT_MET | Order < ₨500 | "Add ₨[X] more to use COD" | Show cart, suggest adding items |
| COD_MAX_EXCEEDED | Order > ₨25,000 | "Order too large for COD. Use bank transfer or PayHere." | Show alternatives |
| COD_INVALID_LOCATION | Country ≠ Sri Lanka | "COD only available in Sri Lanka" | Show online payments |
| COD_NO_ADDRESS | Missing address | "Complete shipping info first" | Redirect to shipping |
| COD_CALCULATION_ERROR | Fee calc failed | "Unable to calculate fee" | Retry or support |

#### Error Display

| Error Type | Display Method | Duration | Action Button |
|-----------|----------------|----------|---------------|
| Minor | Inline message | Persistent | None |
| Major | Toast notification | 5 seconds | "View Alternatives" |
| Blocking | Modal dialog | User dismissed | "Choose Another Method" |

### Alternative Suggestions

#### When COD Unavailable

| Reason | Suggested Methods | Priority |
|--------|------------------|----------|
| Order too low | Continue shopping | Primary |
| Order too high | Bank Transfer, PayHere | Equal |
| International | PayHere, Credit Card | PayHere primary |
| General | All online methods | PayHere primary |

### Accessibility

#### Screen Reader Announcements

| Event | Announcement |
|-------|--------------|
| Eligible | "Cash on Delivery available. Fee 200 rupees applies." |
| Ineligible | "Cash on Delivery not available. [Reason]" |
| Minimum not met | "Order minimum 500 rupees required. [X] rupees needed." |
| Maximum exceeded | "Order exceeds 25,000 rupees limit for Cash on Delivery." |

#### ARIA Labels

| Element | ARIA Label |
|---------|-----------|
| Eligibility Icon | "COD eligibility status" |
| Condition Message | "COD availability conditions" |
| Fee Amount | "COD delivery fee amount" |
| Alternative Methods | "Suggested alternative payment methods" |

### Testing Checklist

#### Eligibility Logic Tests

- [ ] Order ₨500 → Eligible
- [ ] Order ₨499 → Not eligible (too low)
- [ ] Order ₨25,000 → Eligible
- [ ] Order ₨25,001 → Not eligible (too high)
- [ ] Sri Lanka address → Eligible
- [ ] International address → Not eligible
- [ ] No address → Not eligible
- [ ] All conditions met → Eligible
- [ ] Any condition failed → Not eligible

#### Fee Application Tests

- [ ] Select COD → Fee added (₨200)
- [ ] Deselect COD → Fee removed
- [ ] Fee shown in order summary
- [ ] Total updated correctly
- [ ] Fee persists across navigation
- [ ] Fee removed if becomes ineligible

#### Message Display Tests

- [ ] Correct message for too low
- [ ] Correct message for too high
- [ ] Correct message for location
- [ ] Correct message for eligible
- [ ] Alternatives suggested when needed
- [ ] Icons match condition status

#### Real-Time Validation Tests

- [ ] Updates when cart changes
- [ ] Updates when address changes
- [ ] Deselects if becomes ineligible
- [ ] Re-enables if becomes eligible
- [ ] Recalculates on every change

---

## Task 63: Create KOKO BNPL Option

**Complexity:** Low  
**Dependencies:** Task 55 (Payment Method Card)  
**Priority:** High

### Objective

Create the KOKO Buy Now Pay Later (BNPL) payment option that allows customers to split their purchase into 3 interest-free installments. KOKO is a growing BNPL provider in Sri Lanka popular among younger demographics and increases conversion rates for medium to high value orders.

### Requirements

#### Functional Requirements

1. **KOKO Payment Method Card**
   - Display "KOKO - Pay in 3" as method name
   - Show KOKO brand logo/icon
   - Display "Split into 3 interest-free payments" as description
   - Show "0% interest if paid on time" badge
   - Radio button selection integration

2. **Method Selection**
   - Selectable via payment method card
   - Expand to show installment breakdown when selected
   - Display payment schedule
   - Show terms and conditions link

3. **Installment Calculation**
   - Split order total into 3 equal payments
   - Calculate payment dates (Day 1, Day 30, Day 60)
   - Display each installment amount
   - Show first payment due immediately

4. **Information Display**
   - How KOKO works explanation
   - Payment schedule with dates
   - Terms: 0% interest if paid on time
   - Late payment warning
   - Automatic payment information

5. **Visual Indicators**
   - KOKO brand color (typically purple/blue)
   - "0% Interest" badge
   - Calendar icon for dates
   - Checkmark when selected

#### Non-Functional Requirements

1. **User Experience**
   - Clear installment breakdown
   - Easy to understand payment schedule
   - Trust-building messaging
   - Mobile-optimized layout

2. **Performance**
   - Fast installment calculation
   - Smooth expand/collapse animation
   - No lag when selecting

3. **Accessibility**
   - ARIA label: "KOKO buy now pay later payment method"
   - Screen reader announcement of installments
   - Keyboard navigation support
   - Clear visual hierarchy

4. **Responsive Design**
   - Mobile-first layout
   - Touch-friendly selection
   - Readable installment schedule
   - Icon scales appropriately

### Component Structure

#### KOKOOption.tsx Elements

| Element | Purpose | Details |
|---------|---------|---------|
| Method Card Wrapper | Container | Uses PaymentMethodCard component |
| KOKO Logo | Brand identifier | Custom SVG or placeholder |
| Method Name | Primary label | "KOKO - Pay in 3" |
| Interest Badge | Key benefit | "0% Interest" in brand color |
| Expanded Content | Details section | Shows when selected |
| Installment Schedule | Payment breakdown | 3 payments with dates |
| How It Works | Explanation | Process steps |
| Terms Link | Legal info | Link to KOKO terms |
| Selection State | Active indicator | Checkmark and border highlight |

### Information Architecture

#### Main Card Content

| Content | Value |
|---------|-------|
| Title | KOKO - Pay in 3 |
| Logo | KOKO brand icon |
| Badge | "0% Interest" |
| Description | Split your purchase into 3 easy payments |
| Benefit | No interest if paid on time |

#### Expanded Content (When Selected)

| Section | Content |
|---------|---------|
| Installment Breakdown | **Payment 1:** ₨[X] - Due today<br>**Payment 2:** ₨[X] - Due in 30 days<br>**Payment 3:** ₨[X] - Due in 60 days |
| How It Works | 1. Choose KOKO at checkout<br>2. Create account (if new)<br>3. First payment charged today<br>4. Auto-charges every 30 days |
| Key Benefits | ✓ 0% interest on time<br>✓ Automatic payments<br>✓ No hidden fees<br>✓ Easy to manage |
| Requirements | - Minimum order ₨1,000<br>- Valid credit/debit card<br>- Sri Lankan mobile number |

### Visual Design Specifications

#### Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Brand Primary | #6B46C1 (purple) | KOKO brand color |
| Interest Badge | bg-purple-100, text-purple-800 | Highlight 0% benefit |
| Selected Border | border-purple-500 | Active state |
| Payment Amounts | text-purple-600 | Emphasize installments |
| Card Background | bg-white | Clean, readable |

#### Typography

| Element | Style | Size |
|---------|-------|------|
| Method Name | font-semibold | text-lg |
| Description | font-normal | text-sm |
| Installment Amount | font-bold | text-base |
| Date Text | font-normal | text-xs |
| Badge Text | font-medium | text-xs |

#### Spacing

| Element | Spacing |
|---------|---------|
| Card Padding | p-4 |
| Logo Margin | mr-3 |
| Badge Margin | ml-2 |
| Installment Gap | space-y-2 |
| Section Gap | space-y-4 |

### Installment Calculation Logic

#### Payment Split Formula

| Calculation | Formula | Example (₨3,000 order) |
|-------------|---------|------------------------|
| Installment Amount | total ÷ 3 | 3000 ÷ 3 = 1000 |
| Remainder | total % 3 | 3000 % 3 = 0 |
| First Payment | (total ÷ 3) + remainder | 1000 + 0 = 1000 |
| Payments 2 & 3 | total ÷ 3 | 1000 each |

#### Payment Schedule Dates

| Payment | Timing | Date Calculation | Example |
|---------|--------|------------------|---------|
| Payment 1 | Today | new Date() | Jan 31, 2026 |
| Payment 2 | +30 days | addDays(today, 30) | Mar 2, 2026 |
| Payment 3 | +60 days | addDays(today, 60) | Apr 1, 2026 |

### State Management

#### Component State

| State | Type | Purpose |
|-------|------|---------|
| isSelected | boolean | Track if KOKO selected |
| orderTotal | number | Total order amount |
| installmentAmount | number | Amount per payment |
| paymentDates | Date[] | Schedule dates |
| isEligible | boolean | Meets minimum order |

#### Calculated Values

| Value | Calculation | Purpose |
|-------|-------------|---------|
| firstPayment | Math.ceil(total / 3) | First installment |
| otherPayments | Math.floor(total / 3) | Payments 2 & 3 |
| payment2Date | today + 30 days | Due date for payment 2 |
| payment3Date | today + 60 days | Due date for payment 3 |

### Integration Points

#### With Payment Method Card

| Integration | Description |
|-------------|-------------|
| Card Props | Pass logo, title, description, badge |
| Selection Handler | Handle radio button selection |
| Expand/Collapse | Control installment view visibility |

#### With Checkout Store

| Integration | Description |
|-------------|-------------|
| Set Payment Method | Update method to 'koko' |
| Store Installments | Save payment schedule |
| Store Selection | Persist KOKO selection |

#### With API (Phase-09)

| Integration | Description |
|-------------|-------------|
| Create KOKO Session | Initialize BNPL session |
| Verify Eligibility | Check customer credit |
| Process First Payment | Charge initial installment |
| Setup Auto-Pay | Schedule future payments |

### Eligibility Requirements

#### Minimum Requirements

| Requirement | Value | Check |
|-------------|-------|-------|
| Minimum Order | ₨1,000 | Order total ≥ 1000 |
| Maximum Order | No limit | Always eligible |
| Valid Card | Required | Check with KOKO API (Phase-09) |
| Location | Sri Lanka | Country = LK |

#### Eligibility Display

| Condition | Message | Action |
|-----------|---------|--------|
| Order ≥ ₨1,000 | "Available for your order" | Enable selection |
| Order < ₨1,000 | "Minimum order ₨1,000 required" | Disable selection |
| Not available | "KOKO not available" | Hide option |

### Data Flow

#### Selection Flow

1. User clicks KOKO payment card
2. Check order total ≥ ₨1,000
3. If eligible:
   - Calculate 3 installments
   - Calculate payment dates
   - Update checkout store: `method: 'koko'`
   - Expand card to show schedule
   - Enable "Continue" button
4. If not eligible:
   - Show minimum order message
   - Keep card disabled

#### Payment Schedule Flow

1. Get order total from checkout store
2. Calculate installments:
   - First payment: `Math.ceil(total / 3)`
   - Other payments: `Math.floor(total / 3)`
3. Calculate dates:
   - Payment 1: Today
   - Payment 2: Today + 30 days
   - Payment 3: Today + 60 days
4. Format for display
5. Show in expanded view

### Validation Requirements

#### Selection Validation

| Check | Validation | Error Message |
|-------|-----------|---------------|
| Method Selected | KOKO is selected | "Please select a payment method" |
| Minimum Met | Order ≥ ₨1,000 | "Minimum order ₨1,000 for KOKO" |
| Card Valid | (Phase-09) | "Please add valid payment card" |

### Error Handling

#### Error Scenarios

| Error | Cause | User Message |
|-------|-------|--------------|
| Below Minimum | Order < ₨1,000 | "Add ₨[X] more to use KOKO (minimum ₨1,000)" |
| KOKO API Error | Service down | "KOKO temporarily unavailable. Try another method." |
| Card Declined | Invalid card | "Card verification failed. Try another card." |
| Verification Failed | Credit check fail | "KOKO not approved. Choose another payment method." |

### User Experience Considerations

#### Trust Building

| Element | Purpose |
|---------|---------|
| 0% Interest Badge | Shows no hidden costs |
| Clear Schedule | Transparency about payments |
| Automatic Payments | Convenience messaging |
| Brand Recognition | KOKO logo builds trust |

#### Mobile Optimization

| Consideration | Implementation |
|---------------|----------------|
| Touch Target | Large card, easy to tap |
| Installment Display | Vertical list on mobile |
| Readable Amounts | Large, bold numbers |
| Schedule Format | Compact date format |

### Best Practices

#### Implementation Guidelines

1. **Clear Communication**
   - Explain installment structure clearly
   - Show all dates upfront
   - Disclose automatic payment
   - Explain late fees policy

2. **Visual Clarity**
   - Use KOKO brand colors
   - Bold installment amounts
   - Clear date formatting
   - Checkmarks for benefits

3. **State Management**
   - Recalculate on total change
   - Update dates based on today
   - Persist selection
   - Validate before continue

4. **Error Prevention**
   - Check minimum before enabling
   - Disable if not eligible
   - Clear eligibility messaging
   - Suggest alternatives

### Testing Checklist

#### Functional Tests

- [ ] KOKO method displays correctly
- [ ] 0% interest badge appears
- [ ] Selection toggles card state
- [ ] Installments calculated correctly
- [ ] Payment dates calculated correctly
- [ ] First payment includes remainder
- [ ] Schedule displays when expanded
- [ ] Minimum order check works (₨1,000)
- [ ] Selection state persists
- [ ] Logo/icon renders properly

#### Calculation Tests

- [ ] ₨3,000 order = 3 × ₨1,000
- [ ] ₨3,001 order = ₨1,001 + ₨1,000 + ₨1,000
- [ ] ₨3,002 order = ₨1,001 + ₨1,001 + ₨1,000
- [ ] Dates are 30 days apart
- [ ] First date is today
- [ ] Amounts sum to total

#### Visual Tests

- [ ] Card layout matches design
- [ ] KOKO brand colors correct
- [ ] Badge styled properly
- [ ] Installment schedule readable
- [ ] Mobile layout responsive
- [ ] Typography correct

#### Integration Tests

- [ ] Updates checkout store on selection
- [ ] Stores installment schedule
- [ ] Integrates with payment card component
- [ ] Updates order summary
- [ ] Enables continue button
- [ ] Validates minimum order

---

## Task 64: Create MintPay BNPL Option

**Complexity:** Low  
**Dependencies:** Task 55 (Payment Method Card)  
**Priority:** High

### Objective

Create the MintPay Buy Now Pay Later (BNPL) payment option that allows customers to split purchases into 3 installments. MintPay is a growing alternative to KOKO in Sri Lanka, offering similar functionality with slightly different terms and branding.

### Requirements

#### Functional Requirements

1. **MintPay Payment Method Card**
   - Display "MintPay - Buy Now Pay Later" as method name
   - Show MintPay brand logo/icon
   - Display "3 easy installments" as description
   - Show "Flexible payments" badge
   - Radio button selection integration

2. **Method Selection**
   - Selectable via payment method card
   - Expand to show installment breakdown when selected
   - Display payment schedule with dates
   - Show terms and conditions link

3. **Installment Calculation**
   - Split order total into 3 equal payments
   - Calculate payment dates (Now, +30 days, +60 days)
   - Display each installment amount
   - Show first payment due at checkout

4. **Information Display**
   - How MintPay works explanation
   - Payment schedule with specific dates
   - Fee structure information
   - Automatic debit information
   - Late payment policy

5. **Visual Indicators**
   - MintPay brand color (typically teal/mint green)
   - "Flexible" badge
   - Calendar icon for dates
   - Checkmark when selected

#### Non-Functional Requirements

1. **User Experience**
   - Clear installment breakdown
   - Easy to understand payment schedule
   - Trust-building messaging
   - Mobile-optimized layout

2. **Performance**
   - Fast installment calculation
   - Smooth expand/collapse animation
   - No lag when selecting

3. **Accessibility**
   - ARIA label: "MintPay buy now pay later payment method"
   - Screen reader announcement of installments
   - Keyboard navigation support
   - Clear visual hierarchy

4. **Responsive Design**
   - Mobile-first layout
   - Touch-friendly selection
   - Readable installment schedule
   - Icon scales appropriately

### Component Structure

#### MintPayOption.tsx Elements

| Element | Purpose | Details |
|---------|---------|---------|
| Method Card Wrapper | Container | Uses PaymentMethodCard component |
| MintPay Logo | Brand identifier | Custom SVG or placeholder |
| Method Name | Primary label | "MintPay - Buy Now Pay Later" |
| Flexible Badge | Key benefit | "Flexible Payments" in brand color |
| Expanded Content | Details section | Shows when selected |
| Installment Schedule | Payment breakdown | 3 payments with dates |
| How It Works | Explanation | Process steps |
| Terms Link | Legal info | Link to MintPay terms |
| Selection State | Active indicator | Checkmark and border highlight |

### Information Architecture

#### Main Card Content

| Content | Value |
|---------|-------|
| Title | MintPay - Buy Now Pay Later |
| Logo | MintPay brand icon |
| Badge | "Flexible Payments" |
| Description | Split into 3 easy installments |
| Benefit | No interest, pay over time |

#### Expanded Content (When Selected)

| Section | Content |
|---------|---------|
| Installment Breakdown | **Today:** ₨[X] - Charged now<br>**In 30 days:** ₨[X]<br>**In 60 days:** ₨[X] |
| How It Works | 1. Select MintPay at checkout<br>2. Sign up or log in<br>3. First installment charged<br>4. Remaining auto-charged monthly |
| Key Features | ✓ 3 equal installments<br>✓ No signup fees<br>✓ Automatic payments<br>✓ Easy account management |
| Requirements | - Minimum order ₨1,000<br>- Valid debit/credit card<br>- Sri Lankan mobile number<br>- Age 18+ |

### Visual Design Specifications

#### Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Brand Primary | #10B981 (teal/mint) | MintPay brand color |
| Flexible Badge | bg-teal-100, text-teal-800 | Highlight flexibility |
| Selected Border | border-teal-500 | Active state |
| Payment Amounts | text-teal-600 | Emphasize installments |
| Card Background | bg-white | Clean, readable |

#### Typography

| Element | Style | Size |
|---------|-------|------|
| Method Name | font-semibold | text-lg |
| Description | font-normal | text-sm |
| Installment Amount | font-bold | text-base |
| Date Text | font-normal | text-xs |
| Badge Text | font-medium | text-xs |

#### Spacing

| Element | Spacing |
|---------|---------|
| Card Padding | p-4 |
| Logo Margin | mr-3 |
| Badge Margin | ml-2 |
| Installment Gap | space-y-2 |
| Section Gap | space-y-4 |

### Installment Calculation Logic

#### Payment Split Formula

| Calculation | Formula | Example (₨3,600 order) |
|-------------|---------|------------------------|
| Installment Amount | total ÷ 3 | 3600 ÷ 3 = 1200 |
| Remainder | total % 3 | 3600 % 3 = 0 |
| First Payment | (total ÷ 3) + remainder | 1200 + 0 = 1200 |
| Payments 2 & 3 | total ÷ 3 | 1200 each |

#### Payment Schedule Dates

| Payment | Timing | Date Calculation | Example |
|---------|--------|------------------|---------|
| Payment 1 | Now | new Date() | Jan 31, 2026 |
| Payment 2 | +30 days | addDays(now, 30) | Mar 2, 2026 |
| Payment 3 | +60 days | addDays(now, 60) | Apr 1, 2026 |

### State Management

#### Component State

| State | Type | Purpose |
|-------|------|---------|
| isSelected | boolean | Track if MintPay selected |
| orderTotal | number | Total order amount |
| installmentAmount | number | Amount per payment |
| paymentSchedule | Payment[] | Array of payment objects |
| isEligible | boolean | Meets minimum order |

#### Payment Object Structure

| Field | Type | Description |
|-------|------|-------------|
| number | number | Payment number (1, 2, 3) |
| amount | number | Payment amount in LKR |
| dueDate | Date | When payment is due |
| status | string | 'pending', 'due', 'paid' |

### Integration Points

#### With Payment Method Card

| Integration | Description |
|-------------|-------------|
| Card Props | Pass logo, title, description, badge |
| Selection Handler | Handle radio button selection |
| Expand/Collapse | Control installment view visibility |

#### With Checkout Store

| Integration | Description |
|-------------|-------------|
| Set Payment Method | Update method to 'mintpay' |
| Store Installments | Save payment schedule |
| Store Selection | Persist MintPay selection |

#### With API (Phase-09)

| Integration | Description |
|-------------|-------------|
| Create Session | Initialize MintPay session |
| Credit Check | Verify customer eligibility |
| Process Payment | Charge first installment |
| Setup Recurring | Schedule future payments |

### Eligibility Requirements

#### Minimum Requirements

| Requirement | Value | Check |
|-------------|-------|-------|
| Minimum Order | ₨1,000 | Order total ≥ 1000 |
| Maximum Order | ₨50,000 | Order total ≤ 50000 |
| Valid Card | Required | Card on file |
| Location | Sri Lanka | Country = LK |
| Age | 18+ | Birth date check (Phase-09) |

#### Eligibility Display

| Condition | Message | Action |
|-----------|---------|--------|
| Order ₨1,000-₨50,000 | "Available for your order" | Enable selection |
| Order < ₨1,000 | "Minimum order ₨1,000 required" | Disable selection |
| Order > ₨50,000 | "Maximum order ₨50,000 for MintPay" | Disable selection |

### Data Flow

#### Selection Flow

1. User clicks MintPay payment card
2. Check eligibility (₨1,000 ≤ order ≤ ₨50,000)
3. If eligible:
   - Calculate 3 installments
   - Calculate payment dates
   - Update checkout store: `method: 'mintpay'`
   - Expand card to show schedule
   - Enable "Continue" button
4. If not eligible:
   - Show eligibility message
   - Keep card disabled

#### Payment Schedule Flow

1. Get order total from checkout store
2. Calculate installments:
   - Payment amount: `total ÷ 3`
   - First payment gets remainder
3. Calculate dates:
   - Payment 1: Now
   - Payment 2: Now + 30 days
   - Payment 3: Now + 60 days
4. Create payment objects array
5. Display in schedule table

### Validation Requirements

#### Selection Validation

| Check | Validation | Error Message |
|-------|-----------|---------------|
| Method Selected | MintPay is selected | "Please select a payment method" |
| Minimum Met | Order ≥ ₨1,000 | "Minimum order ₨1,000 for MintPay" |
| Maximum Met | Order ≤ ₨50,000 | "Maximum order ₨50,000 for MintPay" |
| Card Valid | (Phase-09) | "Please add valid payment card" |

### Error Handling

#### Error Scenarios

| Error | Cause | User Message |
|-------|-------|--------------|
| Below Minimum | Order < ₨1,000 | "Add ₨[X] more to use MintPay (minimum ₨1,000)" |
| Above Maximum | Order > ₨50,000 | "Order exceeds ₨50,000 MintPay limit. Use bank transfer." |
| API Error | Service down | "MintPay temporarily unavailable. Try another method." |
| Card Declined | Invalid card | "Card could not be verified. Try another card." |
| Account Issue | MintPay account problem | "MintPay account issue. Contact support or use another method." |

### User Experience Considerations

#### Trust Building

| Element | Purpose |
|---------|---------|
| Flexible Badge | Shows payment convenience |
| Clear Schedule | Transparency about charges |
| Automatic Payments | Set-and-forget convenience |
| No Hidden Fees | Builds trust |

#### Mobile Optimization

| Consideration | Implementation |
|---------------|----------------|
| Touch Target | Large card area |
| Schedule Display | Stacked list on mobile |
| Readable Amounts | Large font for amounts |
| Date Format | Short format (Jan 31) |

### Best Practices

#### Implementation Guidelines

1. **Clear Communication**
   - Explain 3-payment structure
   - Show all payment dates
   - Disclose automatic debit
   - Explain terms clearly

2. **Visual Clarity**
   - Use MintPay brand colors
   - Bold installment amounts
   - Clear date formatting
   - Icon for each payment

3. **State Management**
   - Recalculate on total change
   - Update dates dynamically
   - Persist selection
   - Validate eligibility

4. **Error Prevention**
   - Check min/max before enabling
   - Disable if not eligible
   - Clear eligibility messaging
   - Suggest alternatives

### Comparison: KOKO vs MintPay

#### Feature Comparison

| Feature | KOKO | MintPay |
|---------|------|---------|
| Installments | 3 payments | 3 payments |
| Interest | 0% on time | No interest |
| Min Order | ₨1,000 | ₨1,000 |
| Max Order | Unlimited | ₨50,000 |
| Schedule | 0, 30, 60 days | 0, 30, 60 days |
| Brand Color | Purple | Teal/Mint |
| Badge | "0% Interest" | "Flexible" |

#### When to Suggest Each

| Scenario | Recommended | Reason |
|----------|-------------|--------|
| High-value order (> ₨50,000) | KOKO | No max limit |
| Medium order (₨1,000-₨50,000) | Either | User preference |
| First-time BNPL user | KOKO | Clearer 0% messaging |
| Budget-conscious | MintPay | Flexibility focus |

### Testing Checklist

#### Functional Tests

- [ ] MintPay method displays correctly
- [ ] Flexible badge appears
- [ ] Selection toggles card state
- [ ] Installments calculated correctly
- [ ] Payment dates calculated correctly
- [ ] First payment includes remainder
- [ ] Schedule displays when expanded
- [ ] Min order check works (₨1,000)
- [ ] Max order check works (₨50,000)
- [ ] Selection state persists
- [ ] Logo/icon renders properly

#### Calculation Tests

- [ ] ₨3,000 order = 3 × ₨1,000
- [ ] ₨3,001 order = ₨1,001 + ₨1,000 + ₨1,000
- [ ] ₨3,002 order = ₨1,001 + ₨1,001 + ₨1,000
- [ ] Dates are 30 days apart
- [ ] First date is now
- [ ] Amounts sum to total

#### Edge Cases

- [ ] Order exactly ₨1,000
- [ ] Order exactly ₨50,000
- [ ] Order ₨999 → Disabled
- [ ] Order ₨50,001 → Disabled
- [ ] Odd amounts divide correctly

#### Visual Tests

- [ ] Card layout matches design
- [ ] MintPay brand colors correct
- [ ] Badge styled properly
- [ ] Schedule readable
- [ ] Mobile layout responsive
- [ ] Typography correct

#### Integration Tests

- [ ] Updates checkout store on selection
- [ ] Stores payment schedule
- [ ] Integrates with payment card component
- [ ] Updates order summary
- [ ] Enables continue button
- [ ] Validates eligibility

---

## Task 65: Create Payment Selection State Management

**Complexity:** Low  
**Dependencies:** Task 54 (Payment Methods Section)  
**Priority:** Critical Path

### Objective

Create a custom React hook and state management solution for handling payment method selection, payment data storage, validation state, and integration with the checkout store. This hook centralizes payment logic and provides a clean API for payment components.

### Requirements

#### Functional Requirements

1. **Payment Method Selection**
   - Track currently selected payment method
   - Store previous selection for comparison
   - Handle method change events
   - Validate selection before allowing change

2. **Payment Data Storage**
   - Store method-specific data (bank receipt, card info, etc.)
   - Clear data when method changes
   - Validate data completeness
   - Persist data across navigation

3. **Validation State**
   - Track validation status for current method
   - Store validation errors
   - Provide validation functions
   - Clear errors on valid input

4. **Fee Calculation**
   - Calculate method-specific fees (COD: ₨200)
   - Update order total with fees
   - Recalculate on method change
   - Handle fee removal

5. **Eligibility Checking**
   - Check COD eligibility (order limits, location)
   - Check BNPL eligibility (minimum order)
   - Check bank transfer availability
   - Disable ineligible methods

6. **Integration with Checkout**
   - Sync with checkout store
   - Update step completion status
   - Provide data to next step
   - Handle navigation validation

#### Non-Functional Requirements

1. **Performance**
   - Efficient state updates
   - Memoized calculations
   - Minimal re-renders
   - Fast validation

2. **Reliability**
   - Consistent state across components
   - No race conditions
   - Proper cleanup on unmount
   - Error recovery

3. **Maintainability**
   - Clear API
   - Well-documented
   - TypeScript types
   - Testable functions

4. **Extensibility**
   - Easy to add new methods
   - Flexible data structure
   - Pluggable validation
   - Configurable rules

### Hook Structure

#### usePaymentSelection.ts API

| Export | Type | Description |
|--------|------|-------------|
| selectedMethod | string \| null | Current method ID |
| paymentData | PaymentData | Method-specific data |
| validationErrors | ValidationErrors | Current errors |
| isValid | boolean | Overall validity |
| selectMethod | Function | Select a method |
| updatePaymentData | Function | Update data |
| validate | Function | Run validation |
| resetPayment | Function | Clear all data |
| getMethodFee | Function | Get fee for method |
| isMethodEligible | Function | Check eligibility |

### Type Definitions

#### PaymentMethod Type

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| icon | ReactNode | Icon component |
| description | string | Short description |
| fee | number | Additional fee amount |
| minOrder | number \| null | Minimum order value |
| maxOrder | number \| null | Maximum order value |
| requiresData | boolean | Needs additional input |
| isEnabled | boolean | Currently available |

#### PaymentData Type

| Field | Type | Description |
|-------|------|-------------|
| method | string \| null | Selected method ID |
| bankTransfer | BankTransferData \| null | Bank transfer specifics |
| card | CardData \| null | Card payment specifics |
| payhere | PayHereData \| null | PayHere specifics |
| cod | CODData \| null | COD specifics |
| koko | BNPLData \| null | KOKO specifics |
| mintpay | BNPLData \| null | MintPay specifics |

#### BankTransferData Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bankName | string | Yes | Selected bank |
| accountNumber | string | Yes | Account number |
| receiptFile | File \| null | Yes | Payment slip |
| referenceNumber | string | No | Transaction reference |
| transferDate | Date | Yes | Payment date |

#### CardData Type (Placeholder for Phase-09)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| cardNumber | string | Yes | Masked card number |
| cardHolderName | string | Yes | Name on card |
| expiryDate | string | Yes | MM/YY format |
| cvv | string | Yes | Security code |

#### CODData Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| acceptedTerms | boolean | Yes | Accepted COD terms |
| fee | number | Yes | Always 200 |
| confirmedAmount | number | Yes | Order total + fee |

#### BNPLData Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| installments | number | Yes | Always 3 |
| schedule | PaymentSchedule[] | Yes | Payment dates/amounts |
| acceptedTerms | boolean | Yes | Accepted BNPL terms |

### State Management Structure

#### Internal State

| State Variable | Type | Initial Value | Purpose |
|---------------|------|---------------|---------|
| selectedMethod | string \| null | null | Current method |
| paymentData | PaymentData | {} | Method-specific data |
| validationErrors | object | {} | Validation errors |
| methodFees | object | {} | Cached fee calculations |
| eligibilityStatus | object | {} | Cached eligibility |

#### Derived State

| Computed Value | Calculation | Purpose |
|---------------|-------------|---------|
| isValid | All validations pass | Enable continue button |
| totalFee | Sum of applicable fees | Update order total |
| currentMethodFee | Fee for selected method | Display in UI |
| isMethodComplete | Required data present | Track completion |

### Hook Functions

#### selectMethod(methodId: string)

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Validate eligibility | Ensure method available |
| 2 | Check if different | Skip if same method |
| 3 | Remove old fee | Clean up previous method |
| 4 | Clear old data | Reset method-specific data |
| 5 | Set new method | Update selected method |
| 6 | Apply new fee | Add method fee to total |
| 7 | Initialize data | Set default values |
| 8 | Run validation | Check initial validity |

#### updatePaymentData(methodId: string, data: Partial<MethodData>)

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Validate method match | Ensure updating correct method |
| 2 | Merge with existing | Preserve other fields |
| 3 | Update state | Store new data |
| 4 | Run validation | Check data validity |
| 5 | Clear relevant errors | Remove fixed errors |
| 6 | Update checkout store | Sync with global state |

#### validate()

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Check method selected | Ensure method chosen |
| 2 | Get method requirements | Load validation rules |
| 3 | Validate required fields | Check completeness |
| 4 | Run custom validation | Method-specific checks |
| 5 | Check eligibility | Re-verify eligibility |
| 6 | Compile errors | Collect all errors |
| 7 | Update error state | Store errors |
| 8 | Return validity | Boolean result |

#### getMethodFee(methodId: string)

| Method | Fee | Condition |
|--------|-----|-----------|
| cod | ₨200 | Always |
| payhere | ₨0 | No fee |
| card | ₨0 | No fee |
| bank_transfer | ₨0 | No fee |
| koko | ₨0 | No fee |
| mintpay | ₨0 | No fee |

#### isMethodEligible(methodId: string)

| Method | Eligibility Check |
|--------|------------------|
| cod | Order ₨500-₨25,000, Sri Lanka |
| koko | Order ≥ ₨1,000 |
| mintpay | Order ₨1,000-₨50,000 |
| bank_transfer | Always eligible |
| payhere | Always eligible |
| card | Always eligible |

### Validation Rules

#### COD Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| method | Must be 'cod' | "Invalid payment method" |
| acceptedTerms | Must be true | "Please accept COD terms" |
| order.subtotal | ≥ ₨500 | "Order minimum ₨500" |
| order.subtotal | ≤ ₨25,000 | "Order maximum ₨25,000" |
| shipping.country | 'LK' | "COD only in Sri Lanka" |

#### Bank Transfer Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| method | Must be 'bank_transfer' | "Invalid payment method" |
| bankName | Not empty | "Please select a bank" |
| accountNumber | Not empty | "Account number required" |
| receiptFile | File present | "Please upload receipt" |
| receiptFile.size | ≤ 5MB | "Receipt too large (max 5MB)" |
| transferDate | Valid date | "Invalid transfer date" |

#### KOKO/MintPay Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| method | 'koko' or 'mintpay' | "Invalid payment method" |
| acceptedTerms | Must be true | "Please accept BNPL terms" |
| order.total | ≥ ₨1,000 | "Minimum order ₨1,000" |
| order.total (MintPay) | ≤ ₨50,000 | "Maximum order ₨50,000" |
| installments | Must be 3 | "Invalid installment count" |

### Integration with Checkout Store

#### Actions Dispatched

| Action | When | Data |
|--------|------|------|
| SET_PAYMENT_METHOD | Method selected | { method: string } |
| UPDATE_PAYMENT_DATA | Data changed | { method: string, data: object } |
| ADD_FEE | Fee applied | { type: 'cod', amount: 200 } |
| REMOVE_FEE | Fee removed | { type: 'cod' } |
| UPDATE_TOTAL | Total changed | { total: number } |
| SET_STEP_COMPLETE | Valid payment | { step: 3, complete: true } |

#### Selectors Used

| Selector | Purpose |
|----------|---------|
| getOrderSubtotal | For eligibility checks |
| getOrderTotal | For total with fees |
| getShippingAddress | For location checks |
| getPaymentMethod | Current method |
| getPaymentData | Current payment data |

### Error Handling

#### Error Types

| Error Type | When | Recovery |
|-----------|------|----------|
| ValidationError | Invalid data | Show inline error |
| EligibilityError | Method not available | Disable method |
| DataError | Missing required field | Highlight field |
| MethodError | Method switch failed | Revert to previous |
| FeeError | Fee calculation failed | Show notification |

#### Error Display

| Error Location | Display Method |
|----------------|----------------|
| Field-level | Below input field |
| Method-level | In expanded card |
| Step-level | Top of page |
| Global | Toast notification |

### Performance Optimization

#### Memoization

| Memoized Value | Dependency | Purpose |
|---------------|------------|---------|
| methodFees | selectedMethod | Avoid recalculation |
| eligibilityStatus | orderTotal, address | Cache checks |
| validationResult | paymentData | Skip redundant validation |
| methodOptions | availableMethods | Optimize rendering |

#### Re-render Prevention

| Technique | Application |
|-----------|-------------|
| React.memo | Payment option components |
| useMemo | Expensive calculations |
| useCallback | Event handlers |
| Zustand shallow | Store subscriptions |

### Testing Strategy

#### Unit Tests

| Test Category | Tests |
|--------------|-------|
| Method Selection | Select, deselect, switch |
| Data Updates | Update, merge, clear |
| Validation | Each method's rules |
| Fee Calculation | COD fee, total update |
| Eligibility | Each method's conditions |

#### Integration Tests

| Test Category | Tests |
|--------------|-------|
| Store Sync | Actions dispatched correctly |
| Component Integration | Hook with payment options |
| Navigation | Step completion |
| Error Handling | Error display and recovery |

### Usage Example

#### In Payment Component

**Hook Initialization:**
- Call `usePaymentSelection()`
- Destructure needed values and functions

**Rendering Payment Options:**
- Map over payment methods
- Pass `selectedMethod` for active state
- Pass `isMethodEligible` for disabled state
- Pass `selectMethod` as click handler

**Handling Data Updates:**
- Call `updatePaymentData` on input change
- Pass method ID and partial data
- Display `validationErrors` for field

**Navigation:**
- Check `isValid` before continue
- Call `validate()` on continue click
- Show errors if validation fails

### Testing Checklist

#### Hook Functionality

- [ ] Initializes with null method
- [ ] selectMethod updates state
- [ ] updatePaymentData merges correctly
- [ ] validate returns correct boolean
- [ ] getMethodFee returns correct amount
- [ ] isMethodEligible checks correctly
- [ ] resetPayment clears all data

#### State Updates

- [ ] Selected method persists
- [ ] Payment data stored correctly
- [ ] Validation errors tracked
- [ ] Fees calculated accurately
- [ ] Eligibility cached properly

#### Integration

- [ ] Syncs with checkout store
- [ ] Updates order total
- [ ] Enables/disables continue
- [ ] Persists across navigation

#### Error Handling

- [ ] Validation errors displayed
- [ ] Eligibility errors shown
- [ ] Invalid method blocked
- [ ] Missing data prevented

---

## Task 66: Create Payment Method Icons

**Complexity:** Low  
**Dependencies:** Task 55 (Payment Method Card)  
**Priority:** Medium

### Objective

Create a standardized icon component and icon set for all payment methods, ensuring consistent visual branding, proper sizing, accessibility, and responsive design across all payment options. Icons should be recognizable, professional, and match each payment method's brand identity.

### Requirements

#### Functional Requirements

1. **Icon Component**
   - Reusable PaymentIcon component
   - Support for different payment methods
   - Configurable size (sm, md, lg)
   - Color customization support

2. **Payment Method Icons**
   - PayHere logo
   - Credit/Debit card icon
   - Bank building icon
   - Cash/money icon (COD)
   - KOKO logo
   - MintPay logo

3. **Icon States**
   - Default state
   - Active/selected state
   - Disabled/inactive state
   - Hover state

4. **Responsive Behavior**
   - Scale appropriately on mobile
   - Maintain aspect ratio
   - Touch-friendly sizing
   - High DPI support

5. **Fallback Handling**
   - Default icon if logo unavailable
   - Placeholder for missing icons
   - Error state icon
   - Loading state

#### Non-Functional Requirements

1. **Performance**
   - Optimized SVG files
   - Lazy loading for logos
   - Minimal bundle impact
   - Fast rendering

2. **Accessibility**
   - Alt text for images
   - ARIA labels
   - Color contrast compliance
   - Screen reader support

3. **Brand Compliance**
   - Official logos where available
   - Correct brand colors
   - Proper spacing/padding
   - Logo usage guidelines

4. **Maintainability**
   - Easy to add new icons
   - Centralized icon registry
   - TypeScript types
   - Clear documentation

### Component Structure

#### PaymentIcons.tsx Structure

| Component | Purpose |
|-----------|---------|
| PaymentIcon | Main icon component |
| PayHereIcon | PayHere logo |
| CardIcon | Credit/debit card icon |
| BankIcon | Bank building icon |
| CashIcon | Money/banknote icon |
| KOKOIcon | KOKO logo |
| MintPayIcon | MintPay logo |
| DefaultPaymentIcon | Fallback icon |

### Icon Specifications

#### PayHere Icon

| Property | Value |
|----------|-------|
| Type | Logo (SVG or image) |
| Primary Color | #F37021 (orange) |
| Size (default) | 40×40 px |
| Format | SVG preferred |
| Fallback | Credit card icon |

#### Card Icon

| Property | Value |
|----------|-------|
| Type | Lucide icon |
| Icon | CreditCard |
| Color | text-blue-600 |
| Size (default) | 24×24 px |
| Style | Outline |

#### Bank Icon

| Property | Value |
|----------|-------|
| Type | Lucide icon |
| Icon | Landmark |
| Color | text-indigo-600 |
| Size (default) | 24×24 px |
| Style | Outline |

#### Cash Icon (COD)

| Property | Value |
|----------|-------|
| Type | Lucide icon |
| Icon | Banknote |
| Color | text-green-600 |
| Size (default) | 24×24 px |
| Style | Outline |

#### KOKO Icon

| Property | Value |
|----------|-------|
| Type | Logo (SVG or image) |
| Primary Color | #6B46C1 (purple) |
| Size (default) | 40×40 px |
| Format | SVG preferred |
| Fallback | Calendar icon |

#### MintPay Icon

| Property | Value |
|----------|-------|
| Type | Logo (SVG or image) |
| Primary Color | #10B981 (teal) |
| Size (default) | 40×40 px |
| Format | SVG preferred |
| Fallback | Wallet icon |

### Size Variants

#### Icon Sizes

| Size | Dimensions | Use Case |
|------|-----------|----------|
| sm | 20×20 px | Inline text, small cards |
| md | 24×24 px | Default, payment cards |
| lg | 32×32 px | Large cards, headers |
| xl | 40×40 px | Prominent display, logos |

### State Styles

#### Visual States

| State | Effect | Implementation |
|-------|--------|----------------|
| Default | Base styling | Standard colors |
| Active | Highlighted | Saturated colors, bold |
| Disabled | Muted | opacity-50, grayscale |
| Hover | Slightly larger | scale-105 transition |
| Selected | Border/glow | ring-2, ring-primary |

### Color Schemes

#### Method-Specific Colors

| Method | Primary Color | Background | Border |
|--------|--------------|------------|--------|
| PayHere | #F37021 | bg-orange-50 | border-orange-200 |
| Card | #2563EB | bg-blue-50 | border-blue-200 |
| Bank | #4F46E5 | bg-indigo-50 | border-indigo-200 |
| COD | #059669 | bg-green-50 | border-green-200 |
| KOKO | #6B46C1 | bg-purple-50 | border-purple-200 |
| MintPay | #10B981 | bg-teal-50 | border-teal-200 |

### Icon Registry

#### Method-Icon Mapping

| Method ID | Icon Component | Icon Name | Fallback |
|-----------|----------------|-----------|----------|
| payhere | PayHereIcon | PayHere logo | CreditCard |
| card | CardIcon | CreditCard | CreditCard |
| bank_transfer | BankIcon | Landmark | Building |
| cod | CashIcon | Banknote | DollarSign |
| koko | KOKOIcon | KOKO logo | Calendar |
| mintpay | MintPayIcon | MintPay logo | Wallet |

### Component Props

#### PaymentIcon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| method | PaymentMethodId | required | Method identifier |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Icon size |
| className | string | '' | Additional CSS classes |
| active | boolean | false | Active/selected state |
| disabled | boolean | false | Disabled state |
| showFallback | boolean | true | Show fallback on error |

### Accessibility Features

#### ARIA Support

| Attribute | Value | Purpose |
|-----------|-------|---------|
| role | "img" | Identify as image |
| aria-label | Method name | Screen reader text |
| aria-hidden | true (decorative) | Hide if redundant |
| alt | Method name | Image alt text |

#### Screen Reader Text

| Method | Announcement |
|--------|--------------|
| PayHere | "PayHere payment gateway" |
| Card | "Credit or debit card payment" |
| Bank | "Bank transfer payment" |
| COD | "Cash on delivery payment" |
| KOKO | "KOKO buy now pay later" |
| MintPay | "MintPay buy now pay later" |

### Responsive Design

#### Mobile Considerations

| Breakpoint | Icon Size | Spacing |
|-----------|-----------|---------|
| < 640px | sm (20px) | Compact |
| 640px+ | md (24px) | Normal |
| 1024px+ | lg (32px) | Spacious |

### Loading & Error States

#### Loading State

| Element | Display |
|---------|---------|
| Icon | Skeleton/shimmer |
| Duration | Until loaded |
| Fallback | Show after 2s |

#### Error State

| Scenario | Display |
|----------|---------|
| Logo fails to load | Show fallback icon |
| Invalid method ID | Show default icon |
| Missing icon | Show AlertCircle icon |

### SVG Optimization

#### Optimization Guidelines

| Aspect | Guideline |
|--------|-----------|
| File Size | < 5KB per icon |
| Colors | Use currentColor when possible |
| ViewBox | Consistent across icons |
| Accessibility | Include title element |
| Compression | Minify SVG |

### Implementation Guidelines

#### Icon Usage

**In Payment Method Card:**
- Display method icon at 40px (xl)
- Place on left side of card
- Add margin-right for spacing
- Show in brand color

**In Payment Summary:**
- Display method icon at 24px (md)
- Show next to method name
- Use default color

**In Navigation:**
- Display method icon at 20px (sm)
- Show in step indicator
- Use muted color

### Brand Asset Management

#### Logo Sources

| Method | Source | License | Format |
|--------|--------|---------|--------|
| PayHere | Official brand assets | Fair use | SVG |
| KOKO | Partner assets | Licensed | SVG |
| MintPay | Partner assets | Licensed | SVG |
| Others | Lucide React | MIT | SVG |

### Testing Checklist

#### Visual Tests

- [ ] All icons render correctly
- [ ] Correct sizes for each variant
- [ ] Brand colors accurate
- [ ] Icons align properly
- [ ] Fallbacks work
- [ ] High DPI displays crisp

#### State Tests

- [ ] Default state styled correctly
- [ ] Active state highlighted
- [ ] Disabled state muted
- [ ] Hover effect works
- [ ] Selected state visible

#### Accessibility Tests

- [ ] ARIA labels present
- [ ] Alt text descriptive
- [ ] Screen reader announces correctly
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient

#### Responsive Tests

- [ ] Icons scale on mobile
- [ ] Aspect ratio maintained
- [ ] Touch targets adequate
- [ ] Spacing appropriate

#### Integration Tests

- [ ] Icons integrate with payment cards
- [ ] Method mapping works
- [ ] Fallbacks trigger correctly
- [ ] Loading states display
- [ ] Error states handled

---

## Task 67: Create Payment Validation Logic

**Complexity:** Low  
**Dependencies:** Task 65 (Payment Selection State)  
**Priority:** Critical Path

### Objective

Implement comprehensive validation logic for the payment step that ensures all payment methods have required data, validates data format and completeness, checks method-specific conditions, and provides clear error messages. This validation ensures only valid payment selections can proceed to the review step.

### Requirements

#### Functional Requirements

1. **Method Selection Validation**
   - Ensure a payment method is selected
   - Verify method is eligible
   - Check method is enabled
   - Validate method for current order

2. **Method-Specific Validation**
   - COD: Terms accepted, conditions met
   - Bank Transfer: Bank selected, receipt uploaded
   - PayHere: (Stub for Phase-09)
   - Card: (Stub for Phase-09)
   - KOKO: Terms accepted, minimum order
   - MintPay: Terms accepted, order limits

3. **Data Completeness**
   - All required fields present
   - Required files uploaded
   - Terms and conditions accepted
   - Additional info if needed

4. **Format Validation**
   - File types correct (images, PDF)
   - File sizes within limits
   - Dates valid
   - Numbers in correct format

5. **Business Rules**
   - Order value limits
   - Location restrictions
   - Service availability
   - Terms compliance

6. **Error Messaging**
   - Clear, specific error messages
   - Field-level errors
   - Method-level errors
   - Step-level errors

7. **Real-Time Validation**
   - Validate on field blur
   - Validate on method selection
   - Validate on data change
   - Validate before navigation

#### Non-Functional Requirements

1. **Performance**
   - Fast validation execution
   - Debounced real-time checks
   - Cached validation results
   - Minimal re-validation

2. **User Experience**
   - Clear error messages
   - Helpful suggestions
   - Progressive disclosure
   - No blocking validations

3. **Reliability**
   - Consistent results
   - No false positives
   - No false negatives
   - Proper edge case handling

4. **Maintainability**
   - Clear validation rules
   - Reusable validators
   - Well-documented
   - Easy to extend

### Validation Structure

#### Validation Layers

| Layer | Purpose | When |
|-------|---------|------|
| Field Level | Individual input validation | On blur, on change |
| Method Level | Method-specific rules | On method select |
| Step Level | Overall payment completion | On continue click |
| Final | Pre-submission check | Before order creation |

### Validation Rules

#### Payment Method Selection

| Rule | Check | Error Message |
|------|-------|---------------|
| Method Selected | selectedMethod !== null | "Please select a payment method" |
| Method Eligible | isMethodEligible(method) | "[Method] not available for this order" |
| Method Enabled | method.isEnabled === true | "[Method] temporarily unavailable" |

#### COD Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Terms Accepted | acceptedTerms === true | "Please accept COD terms and conditions" |
| Minimum Order | orderSubtotal ≥ 500 | "Minimum order ₨500 required for COD" |
| Maximum Order | orderSubtotal ≤ 25000 | "COD available for orders up to ₨25,000 only" |
| Location Valid | shippingCountry === 'LK' | "COD only available within Sri Lanka" |
| Fee Acknowledged | confirmedAmount === total | "Please confirm order total with COD fee" |

#### Bank Transfer Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Bank Selected | bankName !== null && bankName !== '' | "Please select a bank" |
| Account Valid | accountNumber !== null | "Bank account number required" |
| Receipt Uploaded | receiptFile !== null | "Please upload payment receipt/slip" |
| File Type Valid | isValidFileType(receiptFile) | "Only images (JPG, PNG) or PDF allowed" |
| File Size Valid | receiptFile.size ≤ 5MB | "Receipt file too large (max 5MB)" |
| Transfer Date | transferDate is valid date | "Please enter valid transfer date" |
| Date Not Future | transferDate ≤ today | "Transfer date cannot be in future" |

#### PayHere Validation Rules (Stub)

| Rule | Check | Error Message |
|------|-------|---------------|
| Method Selected | method === 'payhere' | N/A |
| API Ready | (Phase-09 check) | "PayHere temporarily unavailable" |

#### Card Payment Validation Rules (Stub)

| Rule | Check | Error Message |
|------|-------|---------------|
| Method Selected | method === 'card' | N/A |
| Card Entered | (Phase-09 check) | "Please enter card details" |

#### KOKO Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Terms Accepted | acceptedTerms === true | "Please accept KOKO terms and conditions" |
| Minimum Order | orderTotal ≥ 1000 | "Minimum order ₨1,000 required for KOKO" |
| Installments Valid | installments === 3 | "KOKO requires 3 installments" |
| Schedule Valid | schedule.length === 3 | "Payment schedule invalid" |
| Dates Valid | all dates in future | "Payment dates must be in future" |

#### MintPay Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Terms Accepted | acceptedTerms === true | "Please accept MintPay terms and conditions" |
| Minimum Order | orderTotal ≥ 1000 | "Minimum order ₨1,000 required for MintPay" |
| Maximum Order | orderTotal ≤ 50000 | "Maximum order ₨50,000 for MintPay" |
| Installments Valid | installments === 3 | "MintPay requires 3 installments" |
| Schedule Valid | schedule.length === 3 | "Payment schedule invalid" |

### Validation Functions

#### validatePaymentMethod()

| Step | Check | Result |
|------|-------|--------|
| 1 | Method selected | Pass/Fail |
| 2 | Method eligible | Pass/Fail |
| 3 | Method enabled | Pass/Fail |
| Return | All passed | Boolean |

#### validateCOD()

| Step | Check | Result |
|------|-------|--------|
| 1 | Terms accepted | Pass/Fail |
| 2 | Order ≥ ₨500 | Pass/Fail |
| 3 | Order ≤ ₨25,000 | Pass/Fail |
| 4 | Location = Sri Lanka | Pass/Fail |
| 5 | Fee acknowledged | Pass/Fail |
| Return | All passed | Boolean |

#### validateBankTransfer()

| Step | Check | Result |
|------|-------|--------|
| 1 | Bank selected | Pass/Fail |
| 2 | Account entered | Pass/Fail |
| 3 | Receipt uploaded | Pass/Fail |
| 4 | File type valid | Pass/Fail |
| 5 | File size ≤ 5MB | Pass/Fail |
| 6 | Date valid | Pass/Fail |
| Return | All passed | Boolean |

#### validateBNPL(method)

| Step | Check | Result |
|------|-------|--------|
| 1 | Terms accepted | Pass/Fail |
| 2 | Order ≥ minimum | Pass/Fail |
| 3 | Order ≤ maximum (MintPay) | Pass/Fail |
| 4 | Installments = 3 | Pass/Fail |
| 5 | Schedule valid | Pass/Fail |
| Return | All passed | Boolean |

### Error Structure

#### ValidationError Type

| Field | Type | Description |
|-------|------|-------------|
| field | string | Field identifier |
| message | string | User-friendly error |
| code | string | Error code |
| severity | 'error' \| 'warning' | Error level |

#### Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| REQUIRED | Missing required field | "COD_TERMS_REQUIRED" |
| INVALID | Invalid format | "FILE_TYPE_INVALID" |
| OUT_OF_RANGE | Value outside limits | "ORDER_TOO_LOW" |
| NOT_ELIGIBLE | Condition not met | "LOCATION_INVALID" |
| UNAVAILABLE | Service not available | "METHOD_DISABLED" |

### Validation Response

#### ValidationResult Type

| Field | Type | Description |
|-------|------|-------------|
| isValid | boolean | Overall validity |
| errors | ValidationError[] | Array of errors |
| warnings | ValidationError[] | Array of warnings |
| methodValid | boolean | Method selection valid |
| dataComplete | boolean | All data present |
| canProceed | boolean | Can go to next step |

### Real-Time Validation

#### Validation Triggers

| Trigger | Action | Debounce |
|---------|--------|----------|
| Method Select | Validate method eligibility | None |
| Field Blur | Validate field value | None |
| Field Change | Validate field format | 500ms |
| Data Update | Validate completeness | 500ms |
| Continue Click | Full validation | None |

#### Validation Timing

| Validation Type | When | Purpose |
|----------------|------|---------|
| Eager | On change | Immediate feedback |
| Lazy | On blur | Avoid annoying user |
| Submit | On continue | Final check |
| Continuous | Real-time | Progress tracking |

### Error Display

#### Error Locations

| Location | Type | Example |
|----------|------|---------|
| Inline | Field-level | Below input field |
| Card | Method-level | In expanded card |
| Banner | Step-level | Top of page |
| Modal | Blocking | Confirmation required |
| Toast | Non-blocking | Transient notification |

#### Error Styling

| Severity | Color | Icon | Duration |
|----------|-------|------|----------|
| Error | Red | XCircle | Persistent |
| Warning | Yellow | AlertTriangle | Persistent |
| Info | Blue | Info | 5 seconds |

### File Validation

#### Accepted File Types

| Method | Accepted | MIME Types |
|--------|----------|------------|
| Bank Transfer Receipt | Images, PDF | image/jpeg, image/png, application/pdf |

#### File Size Limits

| File Type | Maximum Size |
|-----------|-------------|
| Images | 5MB |
| PDF | 5MB |

#### File Validation Function

| Check | Validation | Error |
|-------|-----------|--------|
| Type | File extension & MIME | "Invalid file type" |
| Size | File.size ≤ limit | "File too large" |
| Name | Not empty | "File name invalid" |
| Content | (Phase-09) | "File corrupted" |

### Helper Functions

#### validateFileType(file: File)

| Step | Check | Result |
|------|-------|--------|
| 1 | Get file extension | Extract from name |
| 2 | Check MIME type | Compare to allowed |
| 3 | Validate extension | Match MIME |
| Return | Valid or not | Boolean |

#### validateFileSize(file: File, maxSize: number)

| Step | Check | Result |
|------|-------|--------|
| 1 | Get file.size | Bytes |
| 2 | Compare to maxSize | size ≤ maxSize |
| Return | Within limit | Boolean |

#### validateDate(date: Date)

| Step | Check | Result |
|------|-------|--------|
| 1 | Is valid date | Not NaN |
| 2 | Not in future | ≤ today |
| 3 | Not too old | > 30 days ago |
| Return | Valid or not | Boolean |

### Edge Cases

#### Edge Case Handling

| Edge Case | Handling | Result |
|-----------|----------|--------|
| Order exactly ₨500 | Valid for COD | Allow |
| Order exactly ₨25,000 | Valid for COD | Allow |
| Order ₨25,001 | Invalid for COD | Block |
| File exactly 5MB | Valid | Allow |
| File 5MB + 1 byte | Invalid | Block |
| International SL address | Check country code | Validate |
| No shipping address | Block payment step | Redirect |

### Integration Points

#### With Payment Selection Hook

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| Get Selected Method | Hook → Validator | Determine which rules |
| Get Payment Data | Hook → Validator | Data to validate |
| Set Errors | Validator → Hook | Display errors |
| Get Validation Status | Hook → Validator | Check if valid |

#### With Checkout Store

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| Get Order Total | Store → Validator | Check limits |
| Get Shipping Address | Store → Validator | Check location |
| Set Step Valid | Validator → Store | Enable navigation |

#### With Continue Button

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| Check Validity | Button → Validator | Enable/disable button |
| Run Validation | Button click → Validator | Final check |
| Show Errors | Validator → UI | Display issues |

### Accessibility

#### Error Announcements

| Event | Announcement |
|-------|--------------|
| Validation Failed | "Payment validation failed. [N] errors found." |
| Method Invalid | "[Method] is not available for this order." |
| Field Error | "[Field] is required." or "[Field] is invalid." |
| Validation Passed | "Payment information validated successfully." |

#### ARIA Attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| aria-invalid | true/false | Input fields |
| aria-describedby | error-[field] | Input fields |
| aria-live | polite | Error container |
| role | alert | Error messages |

### Testing Strategy

#### Unit Tests

| Test Category | Tests |
|--------------|-------|
| Method Validation | Each method's rules |
| Field Validation | Each field's format |
| File Validation | Type, size, content |
| Date Validation | Format, range |
| Error Messages | Correct messages |

#### Integration Tests

| Test Category | Tests |
|--------------|-------|
| Real-Time Validation | Triggers work |
| Error Display | Errors shown correctly |
| State Updates | Validation updates state |
| Navigation | Blocks if invalid |

### Testing Checklist

#### Method Validation

- [ ] No method selected → Error
- [ ] COD selected, eligible → Valid
- [ ] COD selected, not eligible → Error
- [ ] Bank transfer selected → Valid
- [ ] KOKO selected, order ≥ ₨1,000 → Valid
- [ ] KOKO selected, order < ₨1,000 → Error
- [ ] MintPay selected, order ≤ ₨50,000 → Valid
- [ ] MintPay selected, order > ₨50,000 → Error

#### COD Validation

- [ ] Terms not accepted → Error
- [ ] Order ₨499 → Error "Minimum ₨500"
- [ ] Order ₨500 → Valid
- [ ] Order ₨25,000 → Valid
- [ ] Order ₨25,001 → Error "Maximum ₨25,000"
- [ ] International address → Error "Sri Lanka only"
- [ ] Sri Lanka address → Valid

#### Bank Transfer Validation

- [ ] No bank selected → Error
- [ ] No receipt uploaded → Error
- [ ] Invalid file type → Error
- [ ] File > 5MB → Error
- [ ] File ≤ 5MB → Valid
- [ ] Future date → Error
- [ ] Past date → Valid
- [ ] All fields complete → Valid

#### BNPL Validation

- [ ] Terms not accepted → Error
- [ ] KOKO order ₨999 → Error
- [ ] KOKO order ₨1,000 → Valid
- [ ] MintPay order ₨50,001 → Error
- [ ] MintPay order ₨50,000 → Valid
- [ ] Invalid installments → Error
- [ ] Valid schedule → Valid

#### Real-Time Validation

- [ ] Validates on field blur
- [ ] Validates on method select
- [ ] Debounces input validation
- [ ] Updates errors immediately
- [ ] Clears errors when fixed

#### Error Display

- [ ] Field errors show inline
- [ ] Method errors in card
- [ ] Step errors at top
- [ ] Error icon displayed
- [ ] Error color correct
- [ ] Screen reader announces

---

## Task 68: Verify Complete Step 3 Payment Flow

**Complexity:** Low  
**Dependencies:** Task 67 (Payment Validation)  
**Priority:** Critical Path

### Objective

Perform comprehensive verification of the entire payment step (step 3) to ensure all payment methods work correctly, navigation flows properly, data persists accurately, and the complete user journey from method selection to review step is seamless and bug-free.

### Requirements

#### Functional Requirements

1. **Component Rendering**
   - Payment page loads correctly
   - All payment method cards display
   - Icons and badges render
   - Layout responsive on all devices
   - No console errors

2. **Payment Method Selection**
   - Each method selectable
   - Radio button toggle works
   - Expand/collapse functions
   - Only one method selected at a time
   - Visual feedback on selection

3. **Method-Specific Functionality**
   - PayHere: Displays correctly (stub)
   - Card: Displays correctly (stub)
   - Bank Transfer: Bank select, receipt upload work
   - COD: Fee displays, conditions check
   - KOKO: Installments calculate, schedule displays
   - MintPay: Installments calculate, limits check

4. **Validation**
   - Real-time validation works
   - Field-level errors display
   - Method-level errors display
   - Continue button disabled when invalid
   - Continue button enabled when valid

5. **Data Persistence**
   - Selected method persists
   - Payment data saved
   - Survives navigation back/forward
   - Survives page refresh
   - Syncs with checkout store

6. **Fee Calculation**
   - COD fee (₨200) applied correctly
   - Order total updates
   - Fee shown in order summary
   - Fee removed if method changed

7. **Navigation**
   - Back button returns to shipping
   - Continue button goes to review
   - Cannot continue if invalid
   - Step indicator updates
   - Data carries to next step

8. **Error Handling**
   - Invalid method selection prevented
   - File upload errors handled
   - Eligibility errors shown
   - Validation errors clear

#### Non-Functional Requirements

1. **Performance**
   - Page loads < 1 second
   - No lag on selection
   - Smooth animations
   - Fast validation

2. **Usability**
   - Clear visual hierarchy
   - Easy to understand
   - Intuitive flow
   - Helpful error messages

3. **Accessibility**
   - Keyboard navigation works
   - Screen reader compatible
   - ARIA labels present
   - Color contrast sufficient

4. **Browser Compatibility**
   - Works in Chrome
   - Works in Firefox
   - Works in Safari
   - Works in Edge

5. **Mobile Compatibility**
   - Touch-friendly
   - Readable text
   - Proper scaling
   - No horizontal scroll

### Verification Checklist

#### Initial Load

- [ ] Payment page renders without errors
- [ ] All payment method cards visible
- [ ] Icons display correctly
- [ ] Layout matches design
- [ ] Order summary shows on sidebar
- [ ] Order total correct
- [ ] Step indicator shows step 3
- [ ] Back button visible
- [ ] Continue button visible (disabled)

#### PayHere Method

- [ ] Card displays with PayHere logo
- [ ] Description clear
- [ ] Selectable
- [ ] Expands when selected
- [ ] Shows "Integration in Phase-09" message
- [ ] No fees applied
- [ ] Selection state persists

#### Card Payment Method

- [ ] Card displays with card icon
- [ ] Description clear
- [ ] Selectable
- [ ] Expands when selected
- [ ] Shows "Integration in Phase-09" message
- [ ] No fees applied
- [ ] Selection state persists

#### Bank Transfer Method

- [ ] Card displays with bank icon
- [ ] Description clear
- [ ] Selectable
- [ ] Expands when selected
- [ ] Bank dropdown appears
- [ ] Can select Commercial Bank
- [ ] Can select Bank of Ceylon
- [ ] Can select Sampath Bank
- [ ] Bank details display correctly
- [ ] Account number shown
- [ ] Copy button works
- [ ] Receipt upload button visible
- [ ] Can upload image file
- [ ] Can upload PDF file
- [ ] File preview shows
- [ ] File name displays
- [ ] File size shown
- [ ] Can remove uploaded file
- [ ] Transfer date input works
- [ ] Date validation works
- [ ] All required fields validated
- [ ] Error messages display
- [ ] Continue enabled when complete
- [ ] Selection state persists

#### COD Method

- [ ] Card displays with cash icon
- [ ] "Most Popular" badge shows
- [ ] "₨200 fee" displayed on card
- [ ] Description clear
- [ ] Selectable (if eligible)
- [ ] Expands when selected
- [ ] How it works section shows
- [ ] Instructions display
- [ ] Fee breakdown shows:
  - [ ] Subtotal
  - [ ] COD Fee: ₨200
  - [ ] Total (subtotal + 200)
- [ ] Terms checkbox appears
- [ ] Terms must be checked
- [ ] Fee added to order total
- [ ] Order summary updates
- [ ] "COD Fee" line item shows
- [ ] Total updated correctly
- [ ] Eligibility checked:
  - [ ] Order ≥ ₨500
  - [ ] Order ≤ ₨25,000
  - [ ] Sri Lanka location
- [ ] Disabled if order < ₨500
- [ ] Shows "Minimum ₨500" message
- [ ] Disabled if order > ₨25,000
- [ ] Shows "Maximum ₨25,000" message
- [ ] Disabled if international
- [ ] Shows "Sri Lanka only" message
- [ ] Fee removed if deselected
- [ ] Continue enabled when terms accepted
- [ ] Selection state persists

#### KOKO Method

- [ ] Card displays with KOKO logo
- [ ] "0% Interest" badge shows
- [ ] Description clear
- [ ] Selectable (if eligible)
- [ ] Expands when selected
- [ ] Installment breakdown displays:
  - [ ] Payment 1: ₨[X] - Due today
  - [ ] Payment 2: ₨[X] - Due in 30 days
  - [ ] Payment 3: ₨[X] - Due in 60 days
- [ ] Amounts calculate correctly
- [ ] Dates calculate correctly
- [ ] Dates 30 days apart
- [ ] How it works section shows
- [ ] Key benefits listed
- [ ] Requirements shown
- [ ] Terms checkbox appears
- [ ] Terms must be checked
- [ ] Disabled if order < ₨1,000
- [ ] Shows "Minimum ₨1,000" message
- [ ] No maximum limit
- [ ] Continue enabled when terms accepted
- [ ] Selection state persists

#### MintPay Method

- [ ] Card displays with MintPay logo
- [ ] "Flexible Payments" badge shows
- [ ] Description clear
- [ ] Selectable (if eligible)
- [ ] Expands when selected
- [ ] Installment breakdown displays:
  - [ ] Today: ₨[X]
  - [ ] In 30 days: ₨[X]
  - [ ] In 60 days: ₨[X]
- [ ] Amounts calculate correctly
- [ ] Dates calculate correctly
- [ ] How it works section shows
- [ ] Key features listed
- [ ] Requirements shown
- [ ] Terms checkbox appears
- [ ] Terms must be checked
- [ ] Disabled if order < ₨1,000
- [ ] Shows "Minimum ₨1,000" message
- [ ] Disabled if order > ₨50,000
- [ ] Shows "Maximum ₨50,000" message
- [ ] Continue enabled when terms accepted
- [ ] Selection state persists

#### Method Selection Behavior

- [ ] Only one method selected at time
- [ ] Selecting new method deselects old
- [ ] Expanded content collapses on deselect
- [ ] Method-specific data clears on change
- [ ] Fees update on change
- [ ] Validation runs on change
- [ ] Error state clears on change

#### Validation Behavior

- [ ] Continue disabled by default
- [ ] Enabled when method selected and valid
- [ ] Real-time validation on field blur
- [ ] Debounced validation on field change
- [ ] Error messages display inline
- [ ] Error messages clear on fix
- [ ] File validation works
- [ ] Date validation works
- [ ] Terms validation works
- [ ] Eligibility validation works
- [ ] All errors must be fixed to continue

#### Order Summary Integration

- [ ] Shows order items
- [ ] Shows subtotal
- [ ] Shows shipping method
- [ ] Shows shipping cost
- [ ] Shows payment fee (if COD)
- [ ] Shows tax (if applicable)
- [ ] Shows grand total
- [ ] Updates when payment changes
- [ ] Highlights changes
- [ ] All amounts formatted correctly (₨)

#### Navigation Forward

- [ ] Click continue (valid payment)
- [ ] Validation runs
- [ ] No errors shown
- [ ] Navigate to review step
- [ ] Payment data saved
- [ ] Step 3 marked complete
- [ ] Step indicator shows step 4

#### Navigation Backward

- [ ] Click back button
- [ ] Return to shipping step
- [ ] Payment data persists
- [ ] Can return to payment step
- [ ] Data still present
- [ ] Selection still active

#### Data Persistence

- [ ] Selected method saved to store
- [ ] Payment data saved to store
- [ ] Navigate back and forward
- [ ] Data persists
- [ ] Navigate to different page
- [ ] Return to checkout
- [ ] Data still present
- [ ] Refresh page (if session stored)
- [ ] Data restored (if applicable)

#### Error Scenarios

- [ ] Try continue with no method → Error
- [ ] Try continue with incomplete data → Errors
- [ ] Upload wrong file type → Error
- [ ] Upload file too large → Error
- [ ] Enter future date → Error
- [ ] Forget terms checkbox → Error
- [ ] Select ineligible method → Prevented
- [ ] All errors display correctly
- [ ] All errors provide helpful messages

#### Responsive Design

- [ ] Desktop layout (≥1024px):
  - [ ] Sidebar order summary
  - [ ] Two-column layout
  - [ ] Large icons
  - [ ] Spacious padding
- [ ] Tablet layout (768-1023px):
  - [ ] Sidebar order summary
  - [ ] Adjusted spacing
  - [ ] Medium icons
- [ ] Mobile layout (<768px):
  - [ ] Stacked layout
  - [ ] Order summary below
  - [ ] Small icons
  - [ ] Compact spacing
  - [ ] Touch-friendly targets
  - [ ] No horizontal scroll

#### Accessibility

- [ ] Keyboard navigation:
  - [ ] Tab through methods
  - [ ] Enter to select
  - [ ] Tab through fields
  - [ ] Enter to submit
- [ ] Screen reader:
  - [ ] Announces step
  - [ ] Announces method selection
  - [ ] Announces errors
  - [ ] Announces fee changes
  - [ ] Reads labels
  - [ ] Reads instructions
- [ ] ARIA attributes:
  - [ ] Labels present
  - [ ] Roles correct
  - [ ] States accurate
  - [ ] Live regions work
- [ ] Visual:
  - [ ] Color contrast sufficient
  - [ ] Focus indicators visible
  - [ ] Error colors clear
  - [ ] Text readable

#### Performance

- [ ] Initial load < 1 second
- [ ] Method selection instant
- [ ] Validation < 100ms
- [ ] No UI freezing
- [ ] Smooth animations
- [ ] No console errors
- [ ] No console warnings
- [ ] No memory leaks

#### Browser Compatibility

- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work
- [ ] Mobile Chrome: All features work
- [ ] Mobile Safari: All features work

### User Journey Verification

#### Complete Happy Path: COD

1. **Start:**
   - [ ] Navigate to payment step
   - [ ] Page loads

2. **Select COD:**
   - [ ] Click COD card
   - [ ] Card expands
   - [ ] Fee breakdown shows
   - [ ] Order total updates (+₨200)
   - [ ] Order summary shows fee

3. **Accept Terms:**
   - [ ] Check terms checkbox
   - [ ] Continue button enables

4. **Navigate:**
   - [ ] Click continue
   - [ ] Go to review step
   - [ ] COD data saved
   - [ ] Fee included in total

5. **Go Back:**
   - [ ] Click back from review
   - [ ] Return to payment
   - [ ] COD still selected
   - [ ] Fee still applied

#### Complete Happy Path: Bank Transfer

1. **Start:**
   - [ ] Navigate to payment step
   - [ ] Page loads

2. **Select Bank Transfer:**
   - [ ] Click bank transfer card
   - [ ] Card expands
   - [ ] Bank dropdown shows

3. **Select Bank:**
   - [ ] Choose Commercial Bank
   - [ ] Bank details display
   - [ ] Account number shown

4. **Upload Receipt:**
   - [ ] Click upload button
   - [ ] Select image file
   - [ ] File uploads
   - [ ] Preview shows

5. **Enter Date:**
   - [ ] Click date input
   - [ ] Select today
   - [ ] Date validates

6. **Navigate:**
   - [ ] Continue button enables
   - [ ] Click continue
   - [ ] Go to review step
   - [ ] Bank data saved

#### Complete Happy Path: KOKO

1. **Start:**
   - [ ] Navigate to payment step
   - [ ] Order total ≥ ₨1,000

2. **Select KOKO:**
   - [ ] Click KOKO card
   - [ ] Card expands
   - [ ] Installment schedule shows

3. **Verify Schedule:**
   - [ ] 3 payments displayed
   - [ ] Amounts correct
   - [ ] Dates correct

4. **Accept Terms:**
   - [ ] Check terms checkbox
   - [ ] Continue button enables

5. **Navigate:**
   - [ ] Click continue
   - [ ] Go to review step
   - [ ] KOKO data saved
   - [ ] Schedule saved

### Edge Case Verification

#### COD Edge Cases

- [ ] Order exactly ₨500 → Eligible
- [ ] Order exactly ₨25,000 → Eligible
- [ ] Order ₨499 → Not eligible
- [ ] Order ₨25,001 → Not eligible
- [ ] Cart updated to ₨499 while COD selected → Auto-deselect
- [ ] Cart updated to ₨25,001 while COD selected → Auto-deselect
- [ ] Change to international address while COD selected → Auto-deselect

#### BNPL Edge Cases

- [ ] Order exactly ₨1,000 → Eligible for both
- [ ] Order exactly ₨50,000 → Only KOKO eligible
- [ ] Order ₨50,001 → Only KOKO eligible
- [ ] Order ₨999 → Neither eligible
- [ ] ₨1,001 order → ₨334 + ₨334 + ₨333
- [ ] ₨1,002 order → ₨334 + ₨334 + ₨334

#### File Upload Edge Cases

- [ ] File exactly 5MB → Accepted
- [ ] File 5MB + 1 byte → Rejected
- [ ] Invalid file type → Rejected
- [ ] Upload same file twice → Second overwrites
- [ ] Upload then remove → Can upload again

### Acceptance Criteria

All of the following must pass:

- [ ] All payment methods display correctly
- [ ] All payment methods selectable when eligible
- [ ] All method-specific features work
- [ ] All validation rules enforce correctly
- [ ] All error messages clear and helpful
- [ ] All navigation flows work
- [ ] All data persists correctly
- [ ] Order total calculates correctly
- [ ] Order summary updates correctly
- [ ] All responsive breakpoints work
- [ ] All accessibility features work
- [ ] All browsers supported
- [ ] No console errors
- [ ] No performance issues
- [ ] Complete user journeys work end-to-end

### Sign-Off

#### Developer Sign-Off

- [ ] All functional requirements met
- [ ] All components implemented
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No known bugs
- [ ] Documentation complete

#### QA Sign-Off

- [ ] All verification checklist items passed
- [ ] All user journeys tested
- [ ] All edge cases tested
- [ ] All browsers tested
- [ ] All devices tested
- [ ] Accessibility verified
- [ ] Performance verified

#### Ready for Next Step

- [ ] Payment step complete
- [ ] Data structure verified
- [ ] API integration points documented
- [ ] Ready for Group E (Review & Confirm)

---

## Integration Testing

### Overview

Integration testing ensures all components of the payment step work together seamlessly, data flows correctly between components and state management, and the payment step integrates properly with the overall checkout flow.

### Test Scenarios

#### Scenario 1: Method Selection Integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load payment page | All methods display |
| 2 | Click COD | COD expands, others collapse |
| 3 | Check fee applied | Order total increases ₨200 |
| 4 | Click Bank Transfer | Bank expands, COD collapses |
| 5 | Check fee removed | Order total decreases ₨200 |
| 6 | Verify state | Only bank transfer selected |

#### Scenario 2: Data Persistence Integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select bank transfer | Method selected |
| 2 | Choose bank | Bank data saved |
| 3 | Upload receipt | File saved |
| 4 | Navigate back | Return to shipping |
| 5 | Navigate forward | Return to payment |
| 6 | Verify state | All data still present |

#### Scenario 3: Validation Integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select COD | Method selected |
| 2 | Don't check terms | Continue disabled |
| 3 | Check terms | Continue enabled |
| 4 | Click continue | Validation passes |
| 5 | Navigate to review | Data carried forward |

#### Scenario 4: Eligibility Integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Order ₨600 | COD enabled |
| 2 | Select COD | COD selected |
| 3 | Add items to reach ₨26,000 | COD auto-deselects |
| 4 | Check COD card | Disabled with message |
| 5 | Remove items to ₨600 | COD re-enables |

#### Scenario 5: Fee Calculation Integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Subtotal ₨5,000 | Total ₨5,000 (no shipping yet) |
| 2 | Complete shipping | Total ₨5,000 + shipping |
| 3 | Select COD | Total + ₨200 |
| 4 | Verify order summary | Shows COD fee line item |
| 5 | Deselect COD | Fee removed |
| 6 | Verify total | Back to subtotal + shipping |

#### Scenario 6: BNPL Installment Integration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Order ₨3,000 | Both BNPL methods enabled |
| 2 | Select KOKO | Schedule: 3 × ₨1,000 |
| 3 | Switch to MintPay | Schedule updates |
| 4 | Verify dates | All dates correct |
| 5 | Check terms | Terms checkbox works |
| 6 | Continue | Schedule saved |

### API Integration Preparation (Phase-09)

#### PayHere Integration Points

| Endpoint | Purpose | Data Required |
|----------|---------|---------------|
| /create-session | Initialize PayHere | Order ID, Amount, Customer |
| /verify-payment | Confirm payment | Transaction ID |
| /webhook | Handle callback | Payment status |

#### Bank Transfer Integration Points

| Endpoint | Purpose | Data Required |
|----------|---------|---------------|
| /upload-receipt | Save receipt | File, Order ID |
| /verify-transfer | Manual verification | Order ID, Bank, Amount |
| /confirm-payment | Approve payment | Order ID |

#### COD Integration Points

| Endpoint | Purpose | Data Required |
|----------|---------|---------------|
| /create-cod-order | Create COD order | Order ID, Fee |
| /verify-delivery | Confirm delivery | Order ID, Amount collected |

#### BNPL Integration Points

| Endpoint | Purpose | Data Required |
|----------|---------|---------------|
| /koko/create-session | Initialize KOKO | Order, Customer, Schedule |
| /koko/verify-customer | Credit check | Customer ID |
| /mintpay/create-session | Initialize MintPay | Order, Customer, Schedule |
| /mintpay/verify-customer | Eligibility check | Customer ID |

---

## Quality Checklist

### Code Quality

- [ ] TypeScript types defined for all data structures
- [ ] Components properly typed
- [ ] Props interfaces documented
- [ ] No `any` types used
- [ ] All functions have return types
- [ ] Enums used for payment method IDs
- [ ] Constants for magic numbers (fees, limits)

### Component Quality

- [ ] Components follow single responsibility
- [ ] Reusable components extracted
- [ ] Proper component hierarchy
- [ ] No prop drilling (use context/store)
- [ ] Components memoized where appropriate
- [ ] No unnecessary re-renders

### State Management Quality

- [ ] Clear state structure
- [ ] Minimal state duplication
- [ ] State updates immutable
- [ ] Side effects handled properly
- [ ] Store actions well-defined
- [ ] State persistence configured

### Validation Quality

- [ ] All business rules enforced
- [ ] Clear error messages
- [ ] Proper error handling
- [ ] Edge cases covered
- [ ] Real-time validation smooth
- [ ] No false positives/negatives

### UI/UX Quality

- [ ] Consistent design language
- [ ] Clear visual hierarchy
- [ ] Intuitive user flow
- [ ] Helpful feedback
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Empty states designed

### Accessibility Quality

- [ ] Semantic HTML used
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Error announcements work

### Performance Quality

- [ ] Fast initial load
- [ ] Smooth interactions
- [ ] Optimized images/icons
- [ ] Code splitting used
- [ ] Lazy loading where appropriate
- [ ] No memory leaks
- [ ] No performance warnings

### Testing Quality

- [ ] Unit tests for validation
- [ ] Unit tests for calculations
- [ ] Integration tests for flow
- [ ] Component tests
- [ ] Edge case tests
- [ ] Browser compatibility tests
- [ ] Accessibility tests

### Documentation Quality

- [ ] Components documented
- [ ] Props documented
- [ ] Functions documented
- [ ] Business rules documented
- [ ] Integration points documented
- [ ] API stubs documented

### Security Quality

- [ ] File uploads validated
- [ ] File types restricted
- [ ] File sizes limited
- [ ] No sensitive data in state
- [ ] Proper data sanitization
- [ ] CSRF protection (Phase-09)

---

## Completion Criteria

### All Tasks Complete

- [x] Task 61: COD option created
- [x] Task 62: COD conditions implemented
- [x] Task 63: KOKO option created
- [x] Task 64: MintPay option created
- [x] Task 65: Payment state management
- [x] Task 66: Payment icons created
- [x] Task 67: Payment validation implemented
- [x] Task 68: Complete flow verified

### All Deliverables Present

- [ ] CODOption.tsx component
- [ ] KOKOOption.tsx component
- [ ] MintPayOption.tsx component
- [ ] PaymentIcons.tsx component
- [ ] usePaymentSelection.ts hook
- [ ] Payment validation functions
- [ ] COD eligibility logic
- [ ] BNPL installment calculation
- [ ] Fee calculation logic
- [ ] All tests passing

### Quality Standards Met

- [ ] Code review completed
- [ ] All tests passing
- [ ] Accessibility verified
- [ ] Performance verified
- [ ] Documentation complete
- [ ] No known bugs
- [ ] Ready for Phase-09 integration

### Integration Ready

- [ ] API endpoints documented
- [ ] Data structures defined
- [ ] Integration stubs in place
- [ ] Error handling prepared
- [ ] Testing strategy defined

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Status:** Complete  
**Next Document:** N/A (Final document in group)  
**Related:** Group-E_Step4-5-Review-Confirm for next checkout steps
