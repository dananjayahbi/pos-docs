# Tasks 28-34: Checkout, Summary, List, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** B - Coupon UI Components  
> **Document:** 02 of 02  
> **Tasks Covered:** 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-27_Input-Badge-Sections.md](01_Tasks-19-27_Input-Badge-Sections.md)

---

## Document Overview

This document covers the creation of checkout coupon integration, order summary discount display, available coupons listing, and complete verification of all coupon UI components. Finalizes the coupon UI system with customer-facing coupon discovery and checkout flow integration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 28 | Create Checkout Coupon Section | Medium | 40 min |
| 29 | Create Order Summary Discount | Low | 25 min |
| 30 | Create Available Coupons List | Medium | 50 min |
| 31 | Create Coupon Card | Medium | 45 min |
| 32 | Create Copy Coupon Code | Low | 20 min |
| 33 | Create Coupon Expiry Display | Low | 25 min |
| 34 | Verify Coupon UI | Low | 30 min |

---

## Task 28: Create Checkout Coupon Section

### Overview
Create the CheckoutCouponSection component for the checkout page, providing a compact version of the cart coupon functionality. Integrates with checkout flow, displays applied coupons in the order summary sidebar, and allows coupon application/removal during checkout without disrupting the checkout process.

### Dependencies
- Task 27: Create Cart Coupon Section
- Checkout page components from previous phases

### Instructions

1. **Create CheckoutCouponSection component file**
   - Create `CheckoutCouponSection.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Similar to CartCouponSection but checkout-focused
   - Include `orderId` or `checkoutId` for order identification
   - Include `appliedCoupon` object or null
   - Include callbacks for apply and remove actions
   - Include optional `compact` boolean for sizing

3. **Design compact layout**
   - Smaller than cart version for sidebar placement
   - Minimal padding and spacing
   - Collapsed by default with expand option
   - Clear but not prominent to avoid distraction

4. **Reuse CouponInput component**
   - Render CouponInput with compact styling
   - Adjust size for sidebar width
   - Maintain full functionality

5. **Reuse AppliedCouponBadge component**
   - Display badge when coupon is applied
   - Use compact variant if available
   - Ensure readability in sidebar

6. **Implement apply/remove logic**
   - Similar to cart section but for checkout context
   - Call checkout-specific API endpoints
   - Update order summary immediately
   - Handle checkout-specific validations

7. **Add collapsible functionality**
   - Collapse section by default
   - Show "Have a coupon?" link to expand
   - Expand to show input field
   - Collapse after successful application

8. **Position in order summary**
   - Place in order summary sidebar
   - Position above or within the totals section
   - Add subtle separator line
   - Maintain visual hierarchy

9. **Handle checkout flow integration**
   - Don't interrupt checkout progress
   - Allow coupon application at any checkout step
   - Preserve coupon when navigating checkout steps
   - Validate coupon before final order placement

10. **Add mobile optimization**
    - Adjust for mobile checkout layout
    - Ensure touch-friendly controls
    - Stack elements vertically if needed

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| checkoutId | string | Yes | - | Checkout/order identifier |
| appliedCoupon | AppliedCoupon \| null | No | null | Current coupon state |
| onCouponApplied | (coupon: AppliedCoupon) => void | Yes | - | Callback after apply |
| onCouponRemoved | () => void | Yes | - | Callback after removal |
| compact | boolean | No | true | Use compact styling |

### Checkout vs Cart Comparison

| Feature | Cart Section | Checkout Section |
|---------|--------------|------------------|
| Size | Full width | Compact sidebar |
| Prominence | Primary action | Secondary action |
| Default State | Expanded | Collapsed |
| Location | Main cart area | Order summary |
| Priority | High | Medium |

### Checkout Section Layout

```
Collapsed State:
┌────────────────────────────────┐
│  Have a coupon code? [+]       │
└────────────────────────────────┘

Expanded State (No Coupon):
┌────────────────────────────────┐
│  Have a coupon code? [-]       │
│  ┌──────────┐  ┌────────┐     │
│  │ Code     │  │ Apply  │     │
│  └──────────┘  └────────┘     │
└────────────────────────────────┘

Applied State:
┌────────────────────────────────┐
│  Coupon Applied                │
│  ┌──────────────────────────┐ │
│  │ SAVE20  ₨500 off  [×]   │ │
│  └──────────────────────────┘ │
└────────────────────────────────┘
```

### Order Summary Integration

```
Order Summary Sidebar:
┌────────────────────────────────┐
│  Order Summary                 │
├────────────────────────────────┤
│  Subtotal         ₨5,000       │
│  Shipping         ₨300         │
├────────────────────────────────┤
│  Have a coupon code? [+]       │  ← Checkout Coupon Section
├────────────────────────────────┤
│  Discount         -₨500        │  ← Shows when applied
│  Total            ₨4,800       │
└────────────────────────────────┘
```

### Checkout-Specific Validations

| Validation | Check | Error Message |
|------------|-------|---------------|
| Minimum Order | Cart total ≥ minimum | "Order must be at least ₨5,000" |
| Product Eligibility | Products match coupon | "Coupon not valid for selected items" |
| First Order Only | Check order history | "Coupon valid for first orders only" |
| User Eligibility | Check user status | "Coupon not available for your account" |

### API Integration

| Endpoint | Method | Purpose | Payload |
|----------|--------|---------|---------|
| /api/checkout/{id}/coupon | POST | Apply to checkout | { code } |
| /api/checkout/{id}/coupon | DELETE | Remove from checkout | { code } |
| /api/checkout/{id}/validate-coupon | POST | Pre-validate | { code } |

### State Synchronization

| Event | Action |
|-------|--------|
| Coupon Applied | Update order totals, show badge |
| Coupon Removed | Recalculate totals, show input |
| Navigate Steps | Preserve coupon state |
| Validation Error | Show error, keep input visible |
| Network Error | Retry option, maintain state |

### Collapsible Behavior

| Trigger | Action |
|---------|--------|
| Initial Load | Collapsed |
| Click "Have a coupon?" | Expand |
| Apply Success | Auto-collapse, show badge |
| Apply Error | Stay expanded |
| Remove Coupon | Expand input |

### Mobile Checkout Layout

```
Mobile Order Summary:
┌──────────────────┐
│  Order Summary   │
├──────────────────┤
│  Subtotal        │
│  ₨5,000          │
│                  │
│  Shipping        │
│  ₨300            │
├──────────────────┤
│  Have coupon? [+]│ ← Full width on mobile
├──────────────────┤
│  Total           │
│  ₨5,300          │
└──────────────────┘
```

### Expected Outcome
- Functional checkout coupon section
- Compact design for order summary
- Collapsible for space efficiency
- Integrates with checkout flow
- Mobile-optimized layout
- Preserves state across steps

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] Compact layout implemented
- [ ] Collapsible functionality working
- [ ] CouponInput integrated
- [ ] AppliedCouponBadge integrated
- [ ] Apply/remove logic implemented
- [ ] Positioned in order summary
- [ ] Checkout validations handled
- [ ] Mobile responsive
- [ ] Component exports properly

---

## Task 29: Create Order Summary Discount Row

### Overview
Create the OrderSummaryDiscount component to display the discount amount in the order summary breakdown. Shows the discount as a negative value with the coupon code reference, integrates with order totals, and provides clear visibility of savings throughout the cart and checkout process.

### Dependencies
- Task 26: Create Discount Display
- Task 24: Create Applied Coupon Badge

### Instructions

1. **Create OrderSummaryDiscount component file**
   - Create `OrderSummaryDiscount.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `OrderSummaryDiscountProps` interface
   - Include `couponCode` string for coupon reference
   - Include `discount` number for discount amount
   - Include `discountType` for formatting
   - Include optional `showCode` boolean to display code

3. **Implement discount row layout**
   - Create flex row with label and value
   - Label: "Discount" or "Discount (CODE)"
   - Value: Negative amount "-₨500"
   - Align label left, value right

4. **Format discount value**
   - Reuse DiscountDisplay component
   - Display as negative value (-₨500)
   - Use green color for emphasis
   - Format with proper currency symbol ₨

5. **Display coupon code reference**
   - Show code in parentheses: "Discount (AVURUDU20)"
   - Make code clickable to view details (optional)
   - Use smaller font for code reference

6. **Apply row styling**
   - Match other order summary rows (subtotal, shipping, tax)
   - Use consistent typography
   - Apply green color to discount amount
   - Add subtle background highlight (optional)

7. **Handle multiple discounts (future)**
   - Structure to support multiple discount rows
   - Show total discount if multiple coupons allowed
   - Break down by coupon if needed

8. **Add conditional rendering**
   - Only render when discount > 0
   - Return null if no discount applied
   - Handle loading state gracefully

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| couponCode | string | Yes | - | Coupon code to reference |
| discount | number | Yes | - | Discount amount |
| discountType | 'percentage' \| 'fixed' \| 'freeShipping' | Yes | - | Type of discount |
| showCode | boolean | No | true | Display coupon code |
| className | string | No | "" | Additional CSS classes |

### Order Summary Structure

```
Order Summary:
┌────────────────────────────────┐
│  Subtotal         ₨5,000       │
│  Shipping         ₨300         │
│  Tax (8%)         ₨400         │
│  Discount (SAVE20) -₨500       │ ← This component
├────────────────────────────────┤
│  Total            ₨5,200       │
└────────────────────────────────┘
```

### Row Layout

```
┌────────────────────────────────────────┐
│  Discount (AVURUDU20)      -₨500      │
└────────────────────────────────────────┘
   ↑ Label + Code              ↑ Value
```

### Display Variations

| Variation | Example | Use Case |
|-----------|---------|----------|
| With Code | "Discount (AVURUDU20)" | Default, clear reference |
| Without Code | "Discount" | Simplified display |
| With Description | "20% Discount (SAVE20)" | More context |
| Free Shipping | "Free Shipping (SHIP2024)" | Special type |

### Styling Specifications

| Element | Property | Value | Purpose |
|---------|----------|-------|---------|
| Container | display | flex | Row layout |
| Container | justify | space-between | Align ends |
| Label | color | text-gray-700 | Standard text |
| Code | color | text-gray-500 | Subtle reference |
| Code | font-size | text-sm | Smaller than label |
| Value | color | text-green-600 | Positive indicator |
| Value | font-weight | font-semibold | Emphasis |

### Discount Value Formatting

| Input | Formatted Output |
|-------|------------------|
| 500 (fixed) | "-₨500" |
| 1500 (fixed) | "-₨1,500" |
| 20 (percentage) | "-20%" |
| 0 (free shipping) | "Free" |

### Multiple Discounts Structure (Future)

```
Order Summary:
┌────────────────────────────────┐
│  Subtotal         ₨10,000      │
│  Shipping         ₨500         │
│  Discount (AVURUDU20) -₨1,000  │
│  Discount (FIRST10)   -₨500    │
│  Total Discount       -₨1,500  │
├────────────────────────────────┤
│  Total            ₨9,000       │
└────────────────────────────────┘
```

### Conditional Rendering Logic

| Condition | Render Behavior |
|-----------|-----------------|
| discount = 0 | Return null (don't render) |
| discount > 0 | Render discount row |
| couponCode = null | Render without code reference |
| loading | Render placeholder or skeleton |

### Integration Points

| Component | Integration |
|-----------|-------------|
| Cart Page | Show in cart totals section |
| Checkout | Show in order summary |
| Order Confirmation | Show in final order details |
| Order History | Show in past order summaries |

### Accessibility

| Feature | Implementation |
|---------|----------------|
| Label | Use semantic label element |
| Value | Clearly identify as discount |
| Screen Reader | Announce "Discount using AVURUDU20: minus 500 rupees" |
| Color | Don't rely solely on green color |

### Expected Outcome
- Functional discount row component
- Clear display in order summary
- Negative value formatting
- Coupon code reference
- Consistent with other summary rows
- Green emphasis for savings

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] Row layout implemented
- [ ] Discount formatted as negative value
- [ ] Coupon code displayed with discount
- [ ] Green color applied to amount
- [ ] Consistent with order summary styling
- [ ] Conditional rendering working
- [ ] Component exports properly

---

## Task 30: Create Available Coupons List

### Overview
Create the AvailableCoupons component to display a list of available coupons that customers can apply. Fetches available coupons from API, filters by user eligibility and cart context, displays in card grid or list layout, and provides easy application flow. Helps customers discover savings opportunities.

### Dependencies
- Task 19: Create CouponInput Component
- API endpoint for available coupons

### Instructions

1. **Create AvailableCoupons component file**
   - Create `AvailableCoupons.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `AvailableCouponsProps` interface
   - Include `cartId` or `userId` for filtering
   - Include `onApply` callback when coupon is applied
   - Include optional `layout` prop (grid, list)
   - Include optional `limit` for number of coupons shown

3. **Implement coupon fetching**
   - Create useEffect to fetch available coupons on mount
   - Call API endpoint: GET /api/coupons/available
   - Pass user/cart context for personalized filtering
   - Handle loading and error states

4. **Define coupon data structure**
   - Create Coupon type/interface
   - Include: code, description, discountType, discount, expiryDate, minimumOrder, terms
   - Handle nullable fields gracefully

5. **Implement loading state**
   - Show skeleton loaders for coupon cards
   - Display 3-4 skeleton cards while loading
   - Maintain layout structure during loading

6. **Implement error state**
   - Show error message if fetch fails
   - Provide retry button
   - Display fallback message if no coupons available

7. **Create coupon list layout**
   - Render list of CouponCard components (Task 31)
   - Support grid layout (responsive columns)
   - Support list layout (stacked cards)
   - Add spacing between cards

8. **Implement filtering and sorting**
   - Filter by eligibility (user-specific, cart total)
   - Sort by expiry date (expiring soon first)
   - Sort by discount value (highest first)
   - Allow manual filter controls (optional)

9. **Add section header**
   - Title: "Available Coupons" or "Save More with These Coupons"
   - Optional subtitle explaining benefits
   - Show coupon count

10. **Implement pagination or limit**
    - Show limited number initially (e.g., 4 coupons)
    - Add "Show more" button if many coupons
    - Lazy load additional coupons

11. **Add empty state**
    - Show when no coupons available
    - Message: "No coupons available right now"
    - Suggest checking back later

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| cartId | string | No | - | Cart for context filtering |
| userId | string | No | - | User for eligibility filtering |
| onApply | (code: string) => void | Yes | - | Callback when coupon applied |
| layout | 'grid' \| 'list' | No | 'grid' | Display layout |
| limit | number | No | 6 | Max coupons to show |

### Coupon Type Interface

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| code | string | Coupon code |
| description | string | Coupon details |
| discountType | enum | Type of discount |
| discount | number | Discount value |
| expiryDate | string (ISO) | Expiration date |
| minimumOrder | number \| null | Minimum order requirement |
| terms | string \| null | Terms and conditions |
| usageLimit | number \| null | Max uses per user |
| usageCount | number | User's usage count |

### Layout Options

```
Grid Layout (Desktop):
┌─────────────────────────────────────────────┐
│  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │  Coupon   │  │  Coupon   │  │  Coupon   │ │
│  │  Card 1   │  │  Card 2   │  │  Card 3   │ │
│  └───────────┘  └───────────┘  └───────────┘ │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │  Coupon   │  │  Coupon   │  │  Coupon   │ │
│  │  Card 4   │  │  Card 5   │  │  Card 6   │ │
│  └───────────┘  └───────────┘  └───────────┘ │
└─────────────────────────────────────────────┘

List Layout:
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐ │
│  │  Coupon Card 1                │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Coupon Card 2                │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Coupon Card 3                │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### API Integration

| Endpoint | Method | Purpose | Query Params |
|----------|--------|---------|--------------|
| /api/coupons/available | GET | Fetch available | userId, cartId, cartTotal |
| /api/coupons/eligible | GET | Check eligibility | userId, cartId |

### Filtering Logic

| Filter | Condition | Purpose |
|--------|-----------|---------|
| Active | current date < expiryDate | Only active coupons |
| Eligible | user meets requirements | User-specific coupons |
| Applicable | cart total ≥ minimum | Cart context |
| Usage | usageCount < usageLimit | Not already used |

### Sorting Options

| Sort By | Order | Use Case |
|---------|-------|----------|
| Expiry Date | Ascending | Show expiring soon first |
| Discount Value | Descending | Show best deals first |
| Minimum Order | Ascending | Show easiest to use first |
| Created Date | Descending | Show newest first |

### Loading State

```
┌─────────────────────────────────────┐
│  ┌───────────┐  ┌───────────┐      │
│  │ ░░░░░░░░░ │  │ ░░░░░░░░░ │      │
│  │ ░░░░░░░░░ │  │ ░░░░░░░░░ │      │
│  │ ░░░░░     │  │ ░░░░░     │      │
│  └───────────┘  └───────────┘      │
└─────────────────────────────────────┘
   ↑ Skeleton loaders
```

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│         📋                          │
│   No Coupons Available              │
│   Check back soon for savings!      │
│                                     │
└─────────────────────────────────────┘
```

### Responsive Grid

| Breakpoint | Columns | Card Width |
|------------|---------|------------|
| Mobile | 1 | Full width |
| Tablet | 2 | 50% each |
| Desktop | 3 | 33% each |
| Large | 4 | 25% each |

### Expected Outcome
- Functional available coupons list
- Fetches from API
- Displays in grid or list layout
- Loading and error states handled
- Filters by user eligibility
- Sorted by relevance
- Responsive design

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] API fetch implemented
- [ ] Loading state with skeletons
- [ ] Error state with retry
- [ ] Empty state handled
- [ ] Grid and list layouts working
- [ ] CouponCard components rendered
- [ ] Filtering logic implemented
- [ ] Sorting applied
- [ ] Responsive design
- [ ] Component exports properly

---

## Task 31: Create Coupon Card

### Overview
Create the CouponCard component to display individual coupon details in the available coupons list. Shows coupon code, discount details, expiry date, minimum order requirements, and action buttons. Provides attractive, informative card design that encourages coupon usage.

### Dependencies
- Task 30: Create Available Coupons List

### Instructions

1. **Create CouponCard component file**
   - Create `CouponCard.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CouponCardProps` interface
   - Include `coupon` object with all coupon details
   - Include `onApply` callback for apply action
   - Include `onCopy` callback for copy code action
   - Include optional `layout` prop (compact, full)

3. **Design card structure**
   - Container with border and shadow
   - Header: Discount badge or highlight
   - Body: Code, description, terms
   - Footer: Expiry, apply/copy buttons

4. **Display discount prominently**
   - Show discount value in large text
   - Format: "20% OFF" or "₨500 OFF"
   - Use accent color or brand color
   - Position at top or side of card

5. **Display coupon code**
   - Show code in monospace or emphasized font
   - Make code easily readable
   - Format in uppercase
   - Add background box around code

6. **Show coupon description**
   - Display brief description of discount
   - Example: "Save on your entire order"
   - Use 2-3 lines maximum
   - Keep text concise

7. **Display requirements**
   - Show minimum order if applicable
   - Display: "Min. order ₨5,000"
   - Show usage limits if relevant
   - Display terms link (expandable/modal)

8. **Integrate CouponExpiryDisplay**
   - Use component from Task 33
   - Show expiry date/countdown
   - Position in card footer
   - Use urgent styling for expiring soon

9. **Add action buttons**
   - "Apply" button: Calls onApply with code
   - "Copy Code" button: Copies code to clipboard
   - Style as primary (Apply) and secondary (Copy)
   - Position in card footer

10. **Apply card styling**
    - White background with border
    - Shadow on hover for depth
    - Rounded corners
    - Padding for content spacing
    - Responsive width

11. **Add visual enhancements**
    - Discount badge/chip at corner
    - Icon for discount type (%, tag, truck)
    - Hover effects (lift, shadow increase)
    - Accent color stripe or border

12. **Handle disabled state**
    - Disable if not eligible or already used
    - Gray out card and disable buttons
    - Show reason: "Not eligible" or "Already used"

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| coupon | Coupon | Yes | - | Coupon data object |
| onApply | (code: string) => void | Yes | - | Apply coupon callback |
| onCopy | (code: string) => void | Yes | - | Copy code callback |
| layout | 'compact' \| 'full' | No | 'full' | Card layout variant |
| disabled | boolean | No | false | Disable card |

### Card Layout Structure

```
┌─────────────────────────────────────┐
│  [20% OFF]                          │ ← Discount badge
│                                     │
│  AVURUDU20                          │ ← Code
│  ─────────────────────              │
│                                     │
│  Get 20% off your entire order      │ ← Description
│  Min. order ₨5,000                  │ ← Requirements
│                                     │
│  Expires in 5 days                  │ ← Expiry
│  ┌─────────────┐  ┌──────────────┐ │
│  │    APPLY    │  │  COPY CODE   │ │ ← Actions
│  └─────────────┘  └──────────────┘ │
└─────────────────────────────────────┘
```

### Discount Display Variations

| Type | Display | Style |
|------|---------|-------|
| Percentage | "20% OFF" | Large, bold |
| Fixed Amount | "₨500 OFF" | Large, bold |
| Free Shipping | "FREE SHIPPING" | Large, bold |

### Card Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | background | bg-white |
| Container | border | border border-gray-200 |
| Container | shadow | shadow-md hover:shadow-lg |
| Container | radius | rounded-lg |
| Container | padding | p-4 md:p-6 |
| Discount | color | text-primary or text-green-600 |
| Discount | size | text-2xl md:text-3xl |
| Code | background | bg-gray-100 |
| Code | font | font-mono |
| Code | padding | px-3 py-1 |

### Coupon Code Display

```
┌─────────────────┐
│   AVURUDU20     │ ← Monospace font, gray background
└─────────────────┘
```

### Action Buttons Layout

| Button | Style | Action | Icon |
|--------|-------|--------|------|
| Apply | Primary, solid | Call onApply | - |
| Copy Code | Secondary, outline | Copy to clipboard | 📋 |

### Card States

| State | Visual Change | Interaction |
|-------|---------------|-------------|
| Normal | Standard styling | Clickable |
| Hover | Shadow increase, slight lift | Shows interactivity |
| Disabled | Gray opacity, no shadow | Not clickable |
| Applied | Green border, checkmark | Shows applied |

### Requirements Display

| Requirement | Display Format |
|-------------|----------------|
| Minimum Order | "Min. order ₨5,000" |
| First Order Only | "For new customers only" |
| Specific Products | "Valid on electronics" |
| Usage Limit | "One use per customer" |

### Compact vs Full Layout

```
Full Layout (Default):
- All details visible
- Two-column button layout
- Larger spacing

Compact Layout:
- Condensed spacing
- Single-column buttons or icons only
- Smaller text
```

### Visual Enhancements

| Enhancement | Implementation | Purpose |
|-------------|----------------|---------|
| Discount Badge | Corner ribbon or chip | Grab attention |
| Accent Border | Colored left border | Visual interest |
| Icon | Discount type icon | Quick recognition |
| Hover Lift | translateY(-2px) | Interactivity |

### Disabled State

```
┌─────────────────────────────────────┐
│  [20% OFF]        [USED]            │
│                                     │
│  SAVE20                             │
│  ─────────────────────              │
│  Get 20% off your entire order      │
│                                     │
│  You've already used this coupon    │ ← Reason
│                                     │
│  [ APPLY ]  [ COPY CODE ]           │ ← Disabled
└─────────────────────────────────────┘
   ↑ Grayed out
```

### Expected Outcome
- Attractive, informative coupon card
- Clear display of discount and code
- Expiry date with urgency indicator
- Apply and copy actions functional
- Responsive card design
- Hover effects for interactivity

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] Card layout implemented
- [ ] Discount displayed prominently
- [ ] Coupon code formatted correctly
- [ ] Description and terms shown
- [ ] Expiry date integrated (Task 33)
- [ ] Apply button functional
- [ ] Copy button integrated (Task 32)
- [ ] Card styling applied
- [ ] Hover effects working
- [ ] Disabled state handled
- [ ] Component exports properly

---

## Task 32: Create Copy Coupon Code

### Overview
Implement copy-to-clipboard functionality for coupon codes, allowing users to easily copy codes for use elsewhere or for quick application. Uses Clipboard API, provides visual feedback with toast notifications, and handles browser compatibility gracefully.

### Dependencies
- Task 31: Create Coupon Card

### Instructions

1. **Create copy utility function**
   - Create `useCopyToClipboard` hook or utility function
   - Use Clipboard API: `navigator.clipboard.writeText()`
   - Handle promise resolution and errors
   - Provide feedback on success/failure

2. **Implement copy handler in CouponCard**
   - Add onClick handler to copy button
   - Call copy utility with coupon code
   - Handle success with toast notification
   - Handle errors gracefully

3. **Add visual feedback on copy**
   - Show toast message: "Code copied!"
   - Change button icon temporarily (checkmark)
   - Animate button on successful copy
   - Reset button after 2 seconds

4. **Implement fallback for old browsers**
   - Check for Clipboard API support
   - Use document.execCommand('copy') as fallback
   - Create temporary textarea for fallback method
   - Handle fallback errors

5. **Add copy button to badge (optional)**
   - Allow copying from AppliedCouponBadge
   - Show clipboard icon next to code
   - Same copy functionality as card

6. **Create toast notification**
   - Use toast library or custom component
   - Display at top or bottom of screen
   - Auto-dismiss after 2-3 seconds
   - Include success icon

7. **Add keyboard accessibility**
   - Allow keyboard activation (Enter/Space)
   - Focus management after copy
   - Screen reader announcement

8. **Track copy events (optional)**
   - Log copy events for analytics
   - Track which coupons are copied most
   - Send to analytics service

### Copy Utility Hook

```typescript
useCopyToClipboard Hook:

Input: text (string)
Output: { copyToClipboard, isCopied, error }

Methods:
- copyToClipboard(text): Promise<boolean>
- reset(): void

State:
- isCopied: boolean
- error: Error | null
```

### Copy Flow Diagram

```
User Clicks Copy Button
    ↓
Call copyToClipboard(code)
    ↓
Check Clipboard API Support
    ↓
Yes                         No
    ↓                       ↓
Use navigator.clipboard    Use fallback
writeText(code)            document.execCommand
    ↓                       ↓
Success                    Success
    ↓                       ↓
Set isCopied = true
Show Toast "Code copied!"
Change Button Icon to Checkmark
    ↓
Wait 2 seconds
    ↓
Reset Button
Set isCopied = false
```

### Button State Changes

| State | Icon | Text | Duration |
|-------|------|------|----------|
| Normal | 📋 | "Copy Code" | Default |
| Copying | ⟳ | "Copying..." | < 100ms |
| Copied | ✓ | "Copied!" | 2 seconds |
| Error | ✗ | "Failed" | 2 seconds |

### Toast Notification

```
┌────────────────────────────┐
│  ✓  Code copied!           │
│     AVURUDU20              │
└────────────────────────────┘
  ↑ Auto-dismiss after 2s
```

### Clipboard API Implementation

| Method | Browser Support | Use Case |
|--------|-----------------|----------|
| navigator.clipboard.writeText() | Modern browsers | Primary method |
| document.execCommand('copy') | Older browsers | Fallback |
| Clipboard.write() | Modern (complex) | For rich content |

### Fallback Copy Implementation

```javascript
Fallback Process:
1. Create temporary textarea
2. Set textarea value to code
3. Append to document body
4. Select textarea content
5. Execute copy command
6. Remove textarea
7. Return success/failure
```

### Error Handling

| Error | Cause | User Message |
|-------|-------|--------------|
| NotAllowedError | Permissions | "Copy not allowed. Please copy manually." |
| NotFoundError | API not available | "Copy failed. Please copy manually." |
| Generic Error | Unknown | "Failed to copy code" |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Button Label | aria-label="Copy coupon code" |
| State Announcement | aria-live="polite" announces "Code copied" |
| Keyboard | Enter and Space trigger copy |
| Focus | Maintain focus on button after copy |

### Analytics Tracking (Optional)

| Event | Data | Purpose |
|-------|------|---------|
| coupon_code_copied | { code, source } | Track popularity |
| copy_failed | { code, error } | Monitor issues |
| copy_method_used | { method: 'api' \| 'fallback' } | Browser support |

### Integration Points

| Component | Copy Functionality |
|-----------|-------------------|
| CouponCard | Copy button in footer |
| AppliedCouponBadge | Copy icon next to code (optional) |
| Available Coupons | Each card has copy |
| Coupon Details Modal | Copy in header |

### Expected Outcome
- One-click copy to clipboard
- Visual feedback with toast
- Button state change on copy
- Fallback for older browsers
- Accessible copy functionality
- Smooth user experience

### Verification Checklist
- [ ] Copy utility function/hook created
- [ ] Clipboard API implemented
- [ ] Fallback method implemented
- [ ] Copy button functional in CouponCard
- [ ] Toast notification shows on copy
- [ ] Button icon changes to checkmark
- [ ] Button resets after 2 seconds
- [ ] Error handling implemented
- [ ] Keyboard accessible
- [ ] Works in all supported browsers

---

## Task 33: Create Coupon Expiry Display

### Overview
Create the CouponExpiryDisplay component to show coupon expiration information in a user-friendly format. Displays days remaining, absolute dates, and urgent styling for expiring coupons. Helps users prioritize coupon usage and creates urgency for soon-to-expire discounts.

### Dependencies
- Task 31: Create Coupon Card

### Instructions

1. **Create CouponExpiryDisplay component file**
   - Create `CouponExpiryDisplay.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CouponExpiryDisplayProps` interface
   - Include `expiryDate` string (ISO format date)
   - Include optional `format` enum (relative, absolute, both)
   - Include optional `urgentThreshold` number (days for urgent styling)
   - Include optional `size` prop (small, medium)

3. **Calculate days until expiry**
   - Parse expiry date from ISO string
   - Calculate difference from current date
   - Return number of days remaining
   - Handle expired coupons (negative days)

4. **Implement relative date formatting**
   - 0 days: "Expires today"
   - 1 day: "Expires tomorrow"
   - 2-6 days: "Expires in X days"
   - 7-13 days: "Expires in 1 week"
   - 14+ days: "Expires in X weeks"
   - Already expired: "Expired"

5. **Implement absolute date formatting**
   - Format: "Valid until Dec 31, 2025"
   - Use locale-specific date format
   - Show month and day, year if not current

6. **Implement urgent styling**
   - Default threshold: 3 days
   - Red color for urgent (< 3 days)
   - Orange color for warning (3-7 days)
   - Gray/default for normal (> 7 days)
   - Gray for expired

7. **Add urgency indicator icon**
   - Clock icon for normal
   - Warning icon for urgent
   - Exclamation for expiring today
   - X icon for expired

8. **Create format variants**
   - Relative only: "Expires in 5 days"
   - Absolute only: "Valid until Jan 31"
   - Both: "Expires in 5 days (Jan 31)"

9. **Handle expired coupons**
   - Display "Expired" text
   - Gray out styling
   - Optional strikethrough
   - Disable parent card/component

10. **Add tooltip with details (optional)**
    - Show exact expiry date and time
    - Display on hover
    - Use native title or custom tooltip

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| expiryDate | string (ISO) | Yes | - | Expiry date |
| format | 'relative' \| 'absolute' \| 'both' | No | 'relative' | Date format |
| urgentThreshold | number | No | 3 | Days for urgent style |
| size | 'small' \| 'medium' | No | 'medium' | Text size |
| showIcon | boolean | No | true | Show icon indicator |

### Days Remaining Calculation

```javascript
Calculate Days:
1. Parse expiryDate to Date object
2. Get current date
3. Calculate difference in milliseconds
4. Convert to days: Math.ceil(diff / (1000 * 60 * 60 * 24))
5. Return days remaining
```

### Relative Format Examples

| Days Remaining | Display |
|----------------|---------|
| 0 | "Expires today" |
| 1 | "Expires tomorrow" |
| 2 | "Expires in 2 days" |
| 5 | "Expires in 5 days" |
| 10 | "Expires in 10 days" |
| 14 | "Expires in 2 weeks" |
| 30 | "Expires in 1 month" |
| -1 | "Expired" |

### Absolute Format Examples

| Date | Display |
|------|---------|
| 2025-12-31 | "Valid until Dec 31, 2025" |
| 2025-05-15 (current year) | "Valid until May 15" |
| Yesterday | "Expired on Dec 30, 2025" |

### Urgency Styling

| Days Remaining | Color | Icon | Border/BG |
|----------------|-------|------|-----------|
| Expired | text-gray-500 | ✗ | None |
| 0 (today) | text-red-600 | ⚠️ | bg-red-50 |
| 1-2 | text-red-600 | 🕐 | bg-red-50 |
| 3-7 | text-orange-600 | 🕐 | bg-orange-50 |
| 8+ | text-gray-600 | 🕐 | None |

### Display Component Structure

```
┌────────────────────────────┐
│  🕐 Expires in 5 days       │
└────────────────────────────┘
   ↑ Icon  ↑ Text

Urgent:
┌────────────────────────────┐
│  ⚠️ Expires today!          │  ← Red text, bg-red-50
└────────────────────────────┘

Expired:
┌────────────────────────────┐
│  ✗ Expired                  │  ← Gray text
└────────────────────────────┘
```

### Format Variants

| Format | Example Display |
|--------|-----------------|
| Relative | "Expires in 5 days" |
| Absolute | "Valid until Dec 31" |
| Both | "Expires in 5 days (Dec 31)" |

### Styling Specifications

| Element | Urgent | Warning | Normal |
|---------|--------|---------|--------|
| Text Color | text-red-600 | text-orange-600 | text-gray-600 |
| Background | bg-red-50 | bg-orange-50 | transparent |
| Font Weight | font-semibold | font-medium | font-normal |
| Icon Color | text-red-500 | text-orange-500 | text-gray-500 |

### Size Variants

| Size | Text Class | Icon Size | Use Case |
|------|------------|-----------|----------|
| Small | text-xs | 12px | Compact cards |
| Medium | text-sm | 16px | Standard cards |

### Tooltip Content (Optional)

```
Hover Tooltip:
┌─────────────────────────────┐
│  Expires on:                │
│  January 31, 2026           │
│  11:59 PM                   │
└─────────────────────────────┘
```

### Integration in CouponCard

```
In Card Footer:
┌─────────────────────────────────────┐
│  ...                                │
│  🕐 Expires in 5 days               │ ← CouponExpiryDisplay
│  ┌──────────┐  ┌──────────────┐   │
│  │  APPLY   │  │  COPY CODE   │   │
│  └──────────┘  └──────────────┘   │
└─────────────────────────────────────┘
```

### Expired Coupon Handling

| Component | Behavior When Expired |
|-----------|----------------------|
| CouponCard | Gray out, disable buttons |
| AvailableCoupons | Filter out or show as expired |
| CouponInput | Reject with "Coupon expired" error |

### Expected Outcome
- Clear expiry information display
- User-friendly date formatting
- Urgent styling for soon-to-expire coupons
- Multiple format options
- Icon indicators for urgency
- Responsive to different contexts

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] Days remaining calculated correctly
- [ ] Relative format implemented
- [ ] Absolute format implemented
- [ ] Urgent styling applied (< 3 days)
- [ ] Warning styling applied (3-7 days)
- [ ] Expired state handled
- [ ] Icon indicators shown
- [ ] Size variants working
- [ ] Component exports properly

---

## Task 34: Verify Coupon UI

### Overview
Conduct comprehensive verification of all coupon UI components to ensure correct functionality, visual consistency, user experience quality, and integration across cart and checkout flows. This verification covers component behavior, API integration, accessibility, responsive design, and edge cases.

### Dependencies
- All previous tasks (19-33) completed

### Instructions

1. **Create verification checklist document**
   - Create comprehensive checklist for all components
   - Organize by component and functionality
   - Include pass/fail criteria

2. **Verify CouponInput component**
   - Test input accepts alphanumeric codes
   - Verify uppercase transformation
   - Test apply button triggers callback
   - Verify loading state disables input/button
   - Test error state displays correctly
   - Verify success state transitions to badge
   - Test form submission (Enter key)
   - Check input validation debouncing

3. **Verify AppliedCouponBadge component**
   - Test badge displays code and discount
   - Verify remove button functionality
   - Test discount formatting (%, fixed, free ship)
   - Verify badge styling consistency
   - Test hover effects
   - Check mobile responsiveness

4. **Verify DiscountDisplay component**
   - Test all discount type displays (%, fixed, free shipping)
   - Verify currency formatting (₨ symbol, commas)
   - Test size variants
   - Verify color consistency
   - Test negative format for order summary

5. **Verify CartCouponSection component**
   - Test coupon application flow in cart
   - Verify API integration for apply/remove
   - Test cart totals update after apply/remove
   - Verify state transitions (input ↔ badge)
   - Test error handling
   - Check loading states
   - Verify mobile layout

6. **Verify CheckoutCouponSection component**
   - Test coupon section in checkout page
   - Verify collapsible functionality
   - Test compact layout in order summary
   - Verify coupon preservation across checkout steps
   - Test checkout-specific validations
   - Check mobile checkout integration

7. **Verify OrderSummaryDiscount component**
   - Test discount row display in order summary
   - Verify correct placement in totals breakdown
   - Test coupon code display with discount
   - Verify conditional rendering (only when discount > 0)
   - Check styling consistency with other rows

8. **Verify AvailableCoupons component**
   - Test coupon fetching from API
   - Verify loading state with skeletons
   - Test error state and retry
   - Verify empty state display
   - Test grid and list layouts
   - Check filtering logic
   - Verify sorting functionality
   - Test pagination/limiting

9. **Verify CouponCard component**
   - Test all card elements display correctly
   - Verify discount badge prominence
   - Test apply button functionality
   - Verify copy button integration
   - Test expiry display integration
   - Check hover effects
   - Verify disabled state
   - Test responsive card layout

10. **Verify Copy Coupon Code functionality**
    - Test copy to clipboard in multiple browsers
    - Verify toast notification appears
    - Test button state changes (icon, text)
    - Verify fallback for older browsers
    - Test keyboard accessibility
    - Check mobile clipboard behavior

11. **Verify CouponExpiryDisplay component**
    - Test relative date formatting
    - Test absolute date formatting
    - Verify urgent styling (< 3 days)
    - Test expired coupon handling
    - Verify icon indicators
    - Test tooltip (if implemented)

12. **Test end-to-end user flows**
    - Flow 1: Apply coupon in cart → Proceed to checkout → Complete order
    - Flow 2: Browse available coupons → Copy code → Apply in cart
    - Flow 3: Apply coupon in checkout → Remove → Apply different code
    - Flow 4: Try invalid code → See error → Apply valid code
    - Flow 5: Apply expiring coupon → View urgency indicator

13. **Verify API integration**
    - Test apply coupon endpoint
    - Test remove coupon endpoint
    - Test fetch available coupons endpoint
    - Verify error handling for all endpoints
    - Test network error scenarios
    - Verify request/response payloads

14. **Test accessibility**
    - Screen reader announcements for all states
    - Keyboard navigation through all components
    - Focus management
    - ARIA labels and roles
    - Color contrast ratios
    - Error announcements

15. **Test responsive design**
    - Mobile (< 640px): All components stack properly
    - Tablet (640-1024px): Grid adjusts to 2 columns
    - Desktop (> 1024px): Full layout with 3+ columns
    - Touch targets (min 44x44px)
    - Mobile input usability

16. **Test edge cases**
    - Empty coupon code input
    - Very long coupon codes
    - Expired coupons
    - Already used coupons
    - Multiple coupon attempts
    - Coupon not meeting minimum order
    - Coupon removed and reapplied
    - Network timeout during apply
    - Rapid clicking apply button

17. **Verify visual consistency**
    - Brand colors used throughout
    - Typography consistency
    - Spacing and padding uniform
    - Border radius consistency
    - Shadow styles consistent
    - Icon styles and sizes

18. **Test performance**
    - Component render times
    - API call response times
    - Animation smoothness
    - Debounce effectiveness
    - No memory leaks
    - Smooth transitions

19. **Document test results**
    - Create test report document
    - List all tests performed
    - Document pass/fail status
    - Note any bugs found
    - List recommendations for improvements

20. **Create bug report for issues found**
    - Document each bug with steps to reproduce
    - Include screenshots or videos
    - Assign severity levels
    - Create issue tickets
    - Track bug fixes

### Verification Checklist Template

```markdown
## CouponInput Component
- [ ] Input accepts alphanumeric input
- [ ] Uppercase transformation works
- [ ] Apply button triggers callback
- [ ] Loading state disables controls
- [ ] Error message displays correctly
- [ ] Success state transitions to badge
- [ ] Validation debouncing works (500ms)
- [ ] Enter key submits form

## AppliedCouponBadge Component
- [ ] Badge displays code correctly
- [ ] Discount shows correct amount
- [ ] Remove button calls callback
- [ ] Styling consistent with design
- [ ] Hover effects present

... (Continue for all components)
```

### Test User Flows

| Flow # | Steps | Expected Outcome |
|--------|-------|------------------|
| 1 | Cart → Enter "SAVE20" → Apply → Checkout | Discount preserved in checkout |
| 2 | Available coupons → Copy → Paste in input → Apply | Coupon applied successfully |
| 3 | Apply coupon → Remove → Apply different | Both coupons work correctly |
| 4 | Enter invalid code → Error → Valid code | Error clears, valid applies |
| 5 | Apply expiring coupon | Urgent styling shows |

### API Integration Tests

| Endpoint | Test | Expected Response |
|----------|------|-------------------|
| POST /cart/coupon | Valid code | 200, coupon details |
| POST /cart/coupon | Invalid code | 400, error message |
| DELETE /cart/coupon | Remove existing | 200, success |
| GET /coupons/available | Fetch coupons | 200, coupon array |
| POST /coupons/validate | Check format | 200, valid boolean |

### Accessibility Checklist

| Component | Test | Requirement |
|-----------|------|-------------|
| CouponInput | Screen reader | Announces input label and errors |
| CouponInput | Keyboard | Tab navigation works |
| AppliedCouponBadge | Screen reader | Announces code and discount |
| CouponCard | Keyboard | Apply button keyboard accessible |
| All Components | Color contrast | Min 4.5:1 ratio |

### Responsive Design Tests

| Breakpoint | Components | Expected Layout |
|------------|------------|-----------------|
| Mobile (320px) | All | Single column, full width |
| Mobile (480px) | AvailableCoupons | 1 column grid |
| Tablet (768px) | AvailableCoupons | 2 column grid |
| Desktop (1024px) | AvailableCoupons | 3 column grid |
| Large (1440px) | AvailableCoupons | 4 column grid |

### Edge Cases to Test

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty input, click apply | Show validation error |
| Code with spaces | Trim and apply |
| Expired coupon | Show "Coupon expired" error |
| Used coupon | Show "Already used" error |
| Minimum not met | Show minimum order message |
| Network timeout | Show network error, retry option |
| Apply same code twice | Show "Already applied" |

### Performance Metrics

| Metric | Target | Test Method |
|--------|--------|-------------|
| Component render | < 100ms | React DevTools |
| API response | < 500ms | Network tab |
| Animation FPS | 60fps | Performance monitor |
| Debounce delay | 500ms | Manual timing |
| Toast duration | 2-3s | Manual timing |

### Visual Consistency Checks

| Element | Standard | Verification |
|---------|----------|--------------|
| Primary Color | Brand blue | All buttons, badges |
| Success Color | Green (#10b981) | Discount, success states |
| Error Color | Red (#ef4444) | Error messages, urgent |
| Border Radius | 0.375rem (6px) | All cards, buttons |
| Shadow | shadow-md | All cards |

### Browser Compatibility

| Browser | Version | Features to Test |
|---------|---------|------------------|
| Chrome | Latest | Clipboard API, all features |
| Firefox | Latest | Clipboard API, all features |
| Safari | Latest | Clipboard API fallback |
| Edge | Latest | All features |
| Mobile Safari | iOS 14+ | Touch interactions, clipboard |
| Chrome Mobile | Latest | Touch interactions |

### Bug Report Template

```markdown
## Bug #001: [Brief Description]

**Severity:** High / Medium / Low
**Component:** CouponInput
**Steps to Reproduce:**
1. Navigate to cart
2. Enter coupon code "TEST123"
3. Click Apply
4. Observe error

**Expected Behavior:**
Coupon should apply successfully

**Actual Behavior:**
Error message displays "Coupon not found"

**Screenshot:** [Attach]
**Browser:** Chrome 120
**Device:** Desktop
```

### Final Verification Sign-Off

| Component | Status | Verifier | Date | Notes |
|-----------|--------|----------|------|-------|
| CouponInput | ✅ Pass | - | - | All tests passed |
| AppliedCouponBadge | ✅ Pass | - | - | - |
| DiscountDisplay | ✅ Pass | - | - | - |
| CartCouponSection | ⚠️ Minor Issues | - | - | Mobile spacing |
| CheckoutCouponSection | ✅ Pass | - | - | - |
| OrderSummaryDiscount | ✅ Pass | - | - | - |
| AvailableCoupons | ✅ Pass | - | - | - |
| CouponCard | ✅ Pass | - | - | - |
| Copy Functionality | ✅ Pass | - | - | - |
| CouponExpiryDisplay | ✅ Pass | - | - | - |

### Expected Outcome
- All components verified and functional
- End-to-end flows tested successfully
- API integration working correctly
- Accessibility standards met
- Responsive design confirmed
- Edge cases handled gracefully
- Bug reports created for issues
- Documentation updated with test results

### Verification Checklist
- [ ] All individual components tested
- [ ] Integration between components verified
- [ ] API endpoints tested
- [ ] Accessibility compliance checked
- [ ] Responsive design confirmed
- [ ] Edge cases tested
- [ ] Performance metrics within targets
- [ ] Visual consistency verified
- [ ] Browser compatibility checked
- [ ] User flows tested end-to-end
- [ ] Bug reports created for issues
- [ ] Test documentation completed

---

## Group B Completion Summary

### Components Created
```
frontend/components/marketing/coupons/
├── CouponInput.tsx                    (Task 19)
├── AppliedCouponBadge.tsx            (Task 24)
├── DiscountDisplay.tsx               (Task 26)
├── CartCouponSection.tsx             (Task 27)
├── CheckoutCouponSection.tsx         (Task 28)
├── OrderSummaryDiscount.tsx          (Task 29)
├── AvailableCoupons.tsx              (Task 30)
├── CouponCard.tsx                    (Task 31)
├── CouponExpiryDisplay.tsx           (Task 33)
└── index.ts                          (Export all components)
```

### Features Implemented
- Coupon code input with real-time validation
- Loading, error, and success states
- Applied coupon badge with remove functionality
- Discount display in various formats
- Cart and checkout coupon sections
- Order summary discount row
- Available coupons list with filtering
- Coupon cards with apply/copy actions
- Copy to clipboard functionality
- Expiry date display with urgency styling

### Integration Points
| Location | Component | Purpose |
|----------|-----------|---------|
| Cart Page | CartCouponSection | Apply/remove coupons |
| Checkout | CheckoutCouponSection | Compact coupon application |
| Order Summary | OrderSummaryDiscount | Show discount amount |
| Marketing Pages | AvailableCoupons | Display available offers |

### Next Steps
- Proceed to Group C: Flash Sales System
- Integrate coupon UI with existing cart/checkout pages
- Implement analytics tracking for coupon usage
- Add A/B testing for coupon visibility
- Create admin dashboard for coupon performance

---
