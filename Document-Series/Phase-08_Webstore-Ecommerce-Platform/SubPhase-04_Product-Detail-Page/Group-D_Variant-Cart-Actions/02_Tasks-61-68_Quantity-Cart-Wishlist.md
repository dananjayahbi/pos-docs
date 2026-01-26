# Tasks 61-68: Quantity Selector, Cart Actions & Wishlist

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** D - Variant & Cart Actions  
> **Document:** 02 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-60_Variants-Selection.md](01_Tasks-53-60_Variants-Selection.md)
- **→ Next Group:** [Group-E_Tabs-Reviews](../Group-E_Tabs-Reviews/)

---

## Document Overview

This document covers implementation of quantity selection with min/max limits, primary cart action buttons including add to cart and buy now, loading and success states for cart operations, wishlist functionality requiring authentication, and comprehensive verification of all cart action features. All pricing displays use Sri Lankan Rupees (LKR) with the ₨ symbol.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 61 | Create Quantity Selector | Low | 30 min |
| 62 | Create Quantity Min/Max Limits | Low | 25 min |
| 63 | Create Add to Cart Button | Medium | 40 min |
| 64 | Create Buy Now Button | Low | 25 min |
| 65 | Create Add to Cart Loading | Low | 20 min |
| 66 | Create Add to Cart Success | Low | 25 min |
| 67 | Create Wishlist Button | Medium | 45 min |
| 68 | Verify Cart Actions | Low | 30 min |

---

## Task 61: Create Quantity Selector

### Overview
Build the quantity selector component allowing users to specify the number of items to add to cart. This component includes increment and decrement buttons with proper validation, numeric input field with keyboard entry support, visual feedback for quantity changes, and integration with stock availability limits.

### Dependencies
- Task 35: Product Info Container (parent component)
- Task 59: Variant Selection Logic (stock limits)
- Product stock data
- State management setup

### Instructions

1. **Create quantity selector component file**
   - Navigate to `frontend/components/storefront/product/QuantitySelector/` directory
   - Create `QuantitySelector.tsx` file
   - Set up TypeScript functional component structure
   - Import necessary React hooks

2. **Define TypeScript interfaces**
   - Create `QuantitySelectorProps` interface
   - Include value number (current quantity)
   - Add onChange callback function: (quantity: number) => void
   - Include min number (default 1)
   - Add max number (from stock availability)
   - Include disabled boolean
   - Add size variant (small, medium, large)

3. **Implement component structure**
   - Container div with flex layout
   - Decrement button (minus icon)
   - Quantity input field (number display)
   - Increment button (plus icon)
   - Label: "Quantity" above or beside selector
   - Horizontal arrangement of buttons and input

4. **Set up quantity state management**
   - Use controlled component pattern
   - Value prop controls displayed quantity
   - onChange callback notifies parent of changes
   - Local validation before calling onChange
   - Ensure value stays within min/max bounds

5. **Create decrement button**
   - Button with minus icon (−)
   - Click decreases quantity by 1
   - Disabled when quantity === min
   - Gray out when disabled
   - Minimum touch target: 44x44px

6. **Create increment button**
   - Button with plus icon (+)
   - Click increases quantity by 1
   - Disabled when quantity === max (stock limit)
   - Gray out when disabled
   - Show tooltip if at max: "Maximum available"

7. **Implement numeric input field**
   - Type: number or text (controlled)
   - Value bound to quantity state
   - Center-aligned text
   - Width: 60-80px
   - Prevent negative numbers
   - Allow keyboard entry
   - Validate on blur

8. **Add keyboard input handling**
   - Allow direct number entry
   - Validate input on change
   - Accept only valid numbers
   - Clamp to min/max on blur
   - Clear invalid input
   - Handle paste events

9. **Implement validation logic**
   - Function: validateQuantity(value)
   - Check value >= min
   - Check value <= max
   - Check value is integer (no decimals)
   - Check value > 0
   - Return validated value or clamp

10. **Add visual feedback**
    - Hover effects on buttons
    - Active state when clicked
    - Focus ring on input field
    - Disabled state styling (opacity 50%)
    - Smooth transitions (150ms)

11. **Set up accessibility features**
    - Buttons have aria-label: "Decrease quantity", "Increase quantity"
    - Input has aria-label: "Quantity"
    - Aria-describedby linking to stock message
    - Keyboard navigation support
    - Screen reader announces quantity changes

12. **Add stock availability messaging**
    - Show "X available" below selector
    - Highlight when approaching max
    - Red text when at maximum stock
    - Update message dynamically

### Quantity Selector Layout

```
┌──────────────────────────────┐
│  Quantity                    │  ← Label
│  ┌────┬────────┬────┐        │
│  │ −  │   5    │ +  │        │  ← Decrement, Input, Increment
│  └────┴────────┴────┘        │
│  12 available                │  ← Stock info
└──────────────────────────────┘
```

### Component Structure

| Element | Type | Width | Purpose |
|---------|------|-------|---------|
| Container | div | Auto | Flex container |
| Decrement Button | button | 44px | Decrease quantity |
| Input Field | input[number] | 60-80px | Display and edit quantity |
| Increment Button | button | 44px | Increase quantity |
| Stock Message | p | 100% | Show available stock |

### Button Styling

| State | Background | Border | Icon Color | Cursor |
|-------|-----------|--------|------------|--------|
| Default | white | gray-300 | gray-700 | pointer |
| Hover | gray-50 | gray-400 | gray-900 | pointer |
| Active | gray-100 | gray-400 | gray-900 | pointer |
| Disabled | gray-100 | gray-200 | gray-400 | not-allowed |
| Focus | white | blue-500 ring | gray-700 | pointer |

### Input Field Styling

| Property | Value | Notes |
|----------|-------|-------|
| Width | 60-80px | Accommodate 2-3 digits |
| Height | 44px | Match buttons |
| Text Align | center | Center quantity value |
| Font Size | 16px | Readable, prevents zoom on mobile |
| Border | 1px gray-300 | Top and bottom only |
| Background | white | - |
| Font Weight | 500 | Medium weight |

### Validation Logic Flow

```
User Changes Quantity
    ↓
Validate input value
    ↓
├── value < min (1): Set to min
├── value > max (stock): Set to max
├── value is decimal: Round to integer
├── value is negative: Set to min
├── value is NaN: Set to previous valid value
└── value is valid: Accept new value
    ↓
Call onChange(validatedValue)
    ↓
Parent component updates cart state
```

### Stock Availability Messages

| Stock Level | Message | Color |
|-------------|---------|-------|
| > 20 | "Available" | Green (gray-600) |
| 10-20 | "15 available" | Gray (gray-600) |
| 5-9 | "Only 7 left" | Orange (orange-600) |
| 1-4 | "Only 2 left - Order soon!" | Red (red-600) |
| 0 | "Out of stock" | Red (red-600) |
| At max | "Maximum available" | Orange (orange-600) |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Up | Increment quantity |
| Arrow Down | Decrement quantity |
| Number keys | Direct entry |
| Enter | Confirm and focus Add to Cart |
| Escape | Reset to previous value |

### Expected Outcome
- Functional quantity selector with +/− buttons
- Numeric input allowing direct entry
- Validation enforcing min/max limits
- Visual feedback for all interactions
- Stock availability message displayed
- Keyboard accessible and screen reader friendly
- Disabled states when at limits
- Smooth transitions and hover effects

### Verification Checklist
- [ ] Component renders with default quantity 1
- [ ] Decrement button decreases quantity
- [ ] Increment button increases quantity
- [ ] Decrement disabled when quantity = min (1)
- [ ] Increment disabled when quantity = max (stock)
- [ ] Direct input accepts valid numbers
- [ ] Invalid input clamped to min/max on blur
- [ ] Negative numbers prevented
- [ ] Decimal numbers rounded to integer
- [ ] onChange callback fires with valid quantity
- [ ] Stock message displays correctly
- [ ] Hover effects on buttons functional
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] TypeScript types correct

---

## Task 62: Create Quantity Min/Max Limits

### Overview
Implement comprehensive quantity limit validation ensuring users cannot exceed available stock or go below minimum order quantities. This task includes enforcing stock-based maximum limits, setting business rule minimums, displaying limit messages to users, handling edge cases, and coordinating with inventory management.

### Dependencies
- Task 61: Quantity Selector (implements limits)
- Task 59: Variant Selection Logic (stock per variant)
- Product stock data
- Business rules configuration

### Instructions

1. **Define minimum quantity rules**
   - Default minimum: 1 (standard for most products)
   - Custom minimum from product settings
   - Bulk order minimum (e.g., min 10 for wholesale)
   - Configurable per product or category
   - Stored in product.minQuantity field

2. **Define maximum quantity rules**
   - Primary: Available stock (variant.stock)
   - Per-customer limit (e.g., max 5 per order)
   - Cart-wide limit (max total items)
   - Flash sale limit (limited quantity deals)
   - Priority: Smallest of all applicable limits

3. **Implement stock-based maximum**
   - Get stock from current variant selection
   - If no variant, use base product stock
   - Update max when variant changes
   - Real-time stock checking (optional)
   - Handle stock: null or undefined

4. **Create limit calculation function**
   - Function: calculateMaxQuantity()
   - Consider available stock
   - Consider per-customer limit
   - Consider existing cart quantity
   - Consider flash sale limits
   - Return smallest applicable limit

5. **Implement existing cart quantity consideration**
   - Check if product already in cart
   - Get quantity already in cart
   - Available to add: stock - cartQuantity
   - Update max limit accordingly
   - Prevent over-purchasing

6. **Add pre-order and backorder handling**
   - Pre-order: Allow ordering beyond current stock
   - Set higher or unlimited max
   - Backorder: Allow ordering with delayed fulfillment
   - Display expected ship date
   - Different validation rules

7. **Create limit validation function**
   - Function: validateQuantityLimits(quantity)
   - Check quantity >= min
   - Check quantity <= max
   - Return validation result and error message
   - Used before add to cart

8. **Implement dynamic limit updates**
   - Update limits on variant change
   - Update on stock data refresh
   - Update on cart changes (existing quantity)
   - Update on flash sale time changes
   - Real-time synchronization

9. **Add limit messaging**
   - Show min limit: "Minimum order quantity: 10"
   - Show max limit: "Maximum available: 25"
   - Show at limit: "You've reached the maximum"
   - Show per-customer: "Limit 5 per customer"
   - Display prominently near quantity selector

10. **Implement add to cart validation**
    - Validate limits before adding to cart
    - Block add to cart if below min
    - Block if above max
    - Show error toast with reason
    - Guide user to valid quantity

11. **Add special limit scenarios**
    - Limited edition: "Only X available worldwide"
    - Flash sale: "Flash sale limit: 2 per customer"
    - Bulk discount tiers: "Buy 10+ for discount"
    - Sample products: "Free sample - Limit 1"
    - Gift items: "Free gift - Limit 1 per order"

12. **Set up error handling**
    - Handle stock data fetch errors
    - Handle null or undefined stock
    - Default to safe limits (e.g., max 1)
    - Log errors for monitoring
    - User-friendly error messages

### Limit Priority Hierarchy

```
Calculate Maximum Quantity
    ↓
Factors to Consider:
1. Available Stock (variant.stock)
2. Per-Customer Limit (product.maxPerCustomer)
3. Existing Cart Quantity (current cart items)
4. Flash Sale Limit (promotion.maxQuantity)
5. Business Rule Limit (category.maxQuantity)
    ↓
Return: Math.min(...all limits)
```

### Minimum Quantity Rules

| Scenario | Min Quantity | Reason |
|----------|--------------|--------|
| Standard Product | 1 | Default minimum |
| Bulk Item | 10 | Minimum bulk order |
| Sample Product | 1 | One sample allowed |
| Pre-Order | 1 | Standard minimum |
| Custom Order | 5 | Minimum production batch |

### Maximum Quantity Rules

| Scenario | Max Quantity | Priority |
|----------|--------------|----------|
| Available Stock | variant.stock | 1 (highest) |
| Per-Customer Limit | 5 | 2 |
| Cart Item Limit | 10 total in cart | 3 |
| Flash Sale Limit | 2 | 2 |
| Pre-Order | 100 | 4 (low priority) |

### Limit Calculation Example

```
Product: T-Shirt (Blue, Size M)
- Available Stock: 25
- Per-Customer Limit: 5
- Already in Cart: 2
- Flash Sale Limit: 3

Calculate Max:
availableToAdd = stock - cartQuantity
availableToAdd = 25 - 2 = 23

max = Math.min(
  availableToAdd,      // 23
  perCustomerLimit,    // 5
  flashSaleLimit       // 3
)

max = 3  ← User can add up to 3 more
```

### Limit Messages Configuration

| Condition | Message | Placement |
|-----------|---------|-----------|
| Min not met | "Minimum order quantity is 10" | Below qty selector |
| At maximum | "Maximum available: 25" | Below qty selector |
| Per-customer limit | "Limit 5 per customer" | Below qty selector |
| Flash sale | "Flash sale limit: 2" | Near price with badge |
| Already in cart | "You have 2 in cart (3 more available)" | Below qty selector |
| Low stock | "Only 3 left - Order soon!" | Orange text |

### Validation Before Add to Cart

```
User Clicks "Add to Cart"
    ↓
Validate quantity against limits
    ↓
├── quantity < min
│   ├── Show error toast
│   └── "Minimum order quantity is {min}"
│
├── quantity > max
│   ├── Show error toast
│   └── "Maximum available is {max}"
│
└── quantity valid
    └── Proceed with add to cart
```

### Pre-Order and Backorder Limits

| Order Type | Stock Handling | Max Quantity | Message |
|------------|---------------|--------------|---------|
| In-Stock | Current stock | stock | "X available" |
| Pre-Order | Future stock | High/unlimited | "Pre-order - Ships [date]" |
| Backorder | Allow negative | 100 | "Backorder - Ships in X weeks" |
| Made-to-Order | No stock limit | 50 | "Custom made - Ships in X days" |

### Edge Case Handling

| Edge Case | Solution |
|-----------|----------|
| stock = null | Default max = 1, show "Contact for availability" |
| stock = 0 | Max = 0, disable add to cart, show "Out of stock" |
| stock < 0 | Treat as 0, log error |
| min > max | Use max, log warning, show error |
| Variant change | Recalculate limits immediately |
| Cart update | Refresh available quantity |

### Expected Outcome
- Minimum quantity enforced (default 1)
- Maximum quantity enforced (stock-based)
- Dynamic limit updates on variant change
- Existing cart quantity considered
- Clear messaging about limits
- Per-customer limits respected
- Flash sale limits applied
- Add to cart blocked if limits violated
- Error messages guide users to valid quantities
- Pre-order and backorder scenarios handled

### Verification Checklist
- [ ] Minimum quantity set correctly (default 1)
- [ ] Maximum quantity equals available stock
- [ ] Increment button disabled at maximum
- [ ] Decrement button disabled at minimum
- [ ] Limit message displays below selector
- [ ] Max updates when variant changes
- [ ] Existing cart quantity reduces available max
- [ ] Per-customer limit enforced
- [ ] Flash sale limit enforced (if applicable)
- [ ] Add to cart blocked below minimum
- [ ] Add to cart blocked above maximum
- [ ] Error toast shows if limits violated
- [ ] Pre-order allows higher quantities
- [ ] Edge cases handled (null stock, etc.)
- [ ] TypeScript types correct

---

## Task 63: Create Add to Cart Button

### Overview
Build the primary call-to-action button that adds the selected product with chosen variants and quantity to the shopping cart. This component implements proper validation before adding, integrates with cart state management (Zustand), handles user authentication if required, manages button states, and triggers success feedback.

### Dependencies
- Task 59: Variant Selection Logic
- Task 61: Quantity Selector
- Task 62: Quantity Limits
- Task 65: Loading State (shows during add)
- Task 66: Success Toast (shows after add)
- Zustand cart store
- Authentication system

### Instructions

1. **Create add to cart button component file**
   - Navigate to `frontend/components/storefront/product/CartActions/` directory
   - Create `AddToCartButton.tsx` file
   - Set up TypeScript functional component
   - Import cart store hooks

2. **Define TypeScript interfaces**
   - Create `AddToCartButtonProps` interface
   - Include product data object
   - Include selectedVariants object
   - Add quantity number
   - Include disabled boolean
   - Add loading boolean
   - Include onSuccess callback
   - Add onError callback

3. **Implement button structure**
   - Button element with prominent styling
   - Shopping cart icon (optional, left side)
   - Text: "Add to Cart"
   - Loading spinner (when loading)
   - Full width on mobile, fixed width on desktop
   - Primary color (blue-600 or theme primary)

4. **Set up button styling**
   - Background: Primary color (blue-600)
   - Text: White color
   - Padding: 16px vertical, 32px horizontal
   - Font size: 16px (medium)
   - Font weight: Semibold (600)
   - Border radius: 8px (rounded-lg)
   - Hover: Darker shade (blue-700)
   - Active: Even darker (blue-800)

5. **Implement validation logic**
   - Function: validateBeforeAddToCart()
   - Check all required variants selected
   - Check quantity within limits (min/max)
   - Check product available
   - Check stock availability
   - Return validation result + error message

6. **Create pre-add validation checks**
   - Required variants selected: if (hasVariants && !allVariantsSelected)
   - Quantity valid: if (quantity < min || quantity > max)
   - Stock available: if (variant.stock < quantity)
   - Product active: if (product.status !== 'active')
   - Block add if any validation fails

7. **Implement add to cart logic**
   - Function: handleAddToCart()
   - Run validation checks first
   - If validation fails: Show error toast, return
   - If validation passes: Proceed to add
   - Prepare cart item object
   - Call cart store addItem method
   - Handle async if needed

8. **Prepare cart item data structure**
   - Product ID
   - Variant SKU (if variants selected)
   - Selected variant attributes (size, color)
   - Quantity
   - Price (current variant price)
   - Product name and image
   - Any customizations or options

9. **Integrate with cart state management**
   - Import useCartStore from Zustand
   - Call addItem method: cartStore.addItem(itemData)
   - Cart store handles duplication (update qty if exists)
   - Cart store updates total and count
   - Persist cart to localStorage

10. **Implement loading state**
    - Set loading state on click
    - Show loading spinner in button (Task 65)
    - Disable button during loading
    - Change text to "Adding..." (optional)
    - Simulate delay if instant (300ms for UX)

11. **Handle success scenario**
    - On successful add: Set loading to false
    - Show success toast (Task 66)
    - Call onSuccess callback
    - Update button text briefly: "Added!" (optional)
    - Reset button after 2 seconds

12. **Handle error scenario**
    - Catch errors from cart store
    - Show error toast with message
    - Call onError callback
    - Re-enable button
    - Log error for debugging

13. **Add keyboard and accessibility support**
    - Button has proper type: "button"
    - Aria-label: "Add to cart"
    - Aria-disabled when disabled
    - Focus ring visible
    - Screen reader announces action

### Add to Cart Button Layout

```
┌─────────────────────────────────┐
│  🛒  Add to Cart                │  ← Icon + Text (Default)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ⟳  Adding to Cart...           │  ← Loading state (Task 65)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ✓  Added to Cart!              │  ← Success state (brief)
└─────────────────────────────────┘
```

### Button Styling Specifications

| State | Background | Text Color | Border | Cursor | Opacity |
|-------|-----------|------------|--------|--------|---------|
| Default | blue-600 | white | none | pointer | 100% |
| Hover | blue-700 | white | none | pointer | 100% |
| Active | blue-800 | white | none | pointer | 100% |
| Loading | blue-600 | white | none | wait | 90% |
| Disabled | gray-300 | gray-500 | none | not-allowed | 60% |
| Success (brief) | green-600 | white | none | pointer | 100% |

### Validation Logic Flow

```
User Clicks "Add to Cart"
    ↓
Run validation checks
    ↓
Check 1: All required variants selected?
    ↓
├── No: Show toast "Please select size and color"
└── Yes: Continue
    ↓
Check 2: Quantity within limits?
    ↓
├── No: Show toast "Quantity must be between {min} and {max}"
└── Yes: Continue
    ↓
Check 3: Stock available for quantity?
    ↓
├── No: Show toast "Only {stock} available"
└── Yes: Continue
    ↓
Check 4: Product available for purchase?
    ↓
├── No: Show toast "Product unavailable"
└── Yes: Proceed to add
    ↓
Add item to cart
```

### Cart Item Data Structure

```typescript
interface CartItem {
  id: string;                    // Unique cart item ID
  productId: string;             // Product ID
  variantId?: string;            // Variant ID if applicable
  sku: string;                   // Product or variant SKU
  name: string;                  // Product name
  variant?: {
    size?: string;               // Selected size
    color?: string;              // Selected color
    [key: string]: any;          // Other variant attributes
  };
  quantity: number;              // Quantity to add
  price: number;                 // Unit price (LKR)
  image: string;                 // Product image URL
  stock: number;                 // Available stock
  addedAt: Date;                 // Timestamp
}
```

### Add to Cart Success Flow

```
Validation Passed
    ↓
Set loading = true
    ↓
Prepare cart item data
    ↓
Call cartStore.addItem(itemData)
    ↓
├── Item not in cart: Add new item
└── Item already in cart: Update quantity
    ↓
Cart store updates
    ↓
Set loading = false
    ↓
Show success toast (Task 66)
    ↓
Call onSuccess callback
    ↓
Briefly show "Added!" in button (optional)
    ↓
Reset button after 2 seconds
```

### Error Scenarios and Messages

| Error Scenario | User Message | Action |
|---------------|--------------|--------|
| Variants not selected | "Please select size and color" | Highlight variant selectors |
| Quantity below min | "Minimum order quantity is {min}" | Set quantity to min |
| Quantity above max | "Only {max} available" | Set quantity to max |
| Out of stock | "This product is currently out of stock" | Disable button |
| Server error | "Unable to add to cart. Please try again." | Show retry option |
| Network error | "Connection error. Check your internet." | Show retry option |

### Expected Outcome
- Prominent "Add to Cart" button styled as primary CTA
- Validation before adding (variants, quantity, stock)
- Integration with cart state management (Zustand)
- Loading state during add operation (Task 65)
- Success toast on successful add (Task 66)
- Error toast on validation failure
- Disabled state when product unavailable
- Keyboard accessible and screen reader friendly
- Smooth transitions and feedback
- Cart updates and persists correctly

### Verification Checklist
- [ ] Button renders with "Add to Cart" text
- [ ] Button has primary color styling (blue-600)
- [ ] Click without variants shows error toast
- [ ] Click with variants starts validation
- [ ] Validation checks all required fields
- [ ] Loading state shows during add (Task 65)
- [ ] Success toast shows after add (Task 66)
- [ ] Cart count increases by quantity added
- [ ] Item appears in cart with correct data
- [ ] Duplicate item updates quantity instead of duplicating
- [ ] Error toast shows if add fails
- [ ] Button disabled when out of stock
- [ ] Hover shows darker shade
- [ ] Keyboard accessible (Enter key)
- [ ] ARIA attributes present
- [ ] TypeScript types correct

---

## Task 64: Create Buy Now Button

### Overview
Implement the "Buy Now" button that allows users to immediately proceed to checkout with the current product, bypassing the cart view. This button adds the product to cart and redirects to checkout in one action, provides a faster path to purchase, handles the same validation as add to cart, and serves as a secondary call-to-action.

### Dependencies
- Task 63: Add to Cart Button (similar validation)
- Task 59: Variant Selection Logic
- Task 61: Quantity Selector
- Cart state management
- Checkout route configured

### Instructions

1. **Create buy now button component file**
   - Navigate to `frontend/components/storefront/product/CartActions/` directory
   - Create `BuyNowButton.tsx` file
   - Set up TypeScript functional component
   - Import cart hooks and routing

2. **Define TypeScript interfaces**
   - Create `BuyNowButtonProps` interface
   - Include product data object
   - Include selectedVariants object
   - Add quantity number
   - Include disabled boolean
   - Add loading boolean
   - Include onError callback

3. **Implement button structure**
   - Button element with secondary styling
   - Lightning bolt icon (optional, suggests speed)
   - Text: "Buy Now"
   - Loading spinner when processing
   - Positioned beside or below Add to Cart button
   - Slightly less prominent than Add to Cart

4. **Set up button styling**
   - Background: White or light gray
   - Border: 2px primary color (blue-600)
   - Text: Primary color (blue-600)
   - Padding: 16px vertical, 32px horizontal
   - Font size: 16px (medium)
   - Font weight: Semibold (600)
   - Hover: Light primary background (blue-50)
   - Active: Slightly darker (blue-100)

5. **Implement validation logic**
   - Use same validation as Add to Cart (Task 63)
   - Check all required variants selected
   - Check quantity within limits
   - Check stock availability
   - Check product active
   - Block if validation fails

6. **Create buy now handler**
   - Function: handleBuyNow()
   - Run validation checks
   - If failed: Show error toast, return
   - If passed: Add to cart silently
   - Redirect to checkout immediately
   - Pass product data to checkout

7. **Implement add to cart and redirect flow**
   - Set loading state
   - Add item to cart using cart store
   - Don't show success toast (silent add)
   - On success: Navigate to checkout
   - Pass current cart to checkout page
   - Handle redirect failures

8. **Set up checkout navigation**
   - Use Next.js router: router.push('/checkout')
   - Alternative: window.location.href = '/checkout'
   - Ensure cart persisted before redirect
   - Pass any required query params
   - Handle authentication if required

9. **Add loading state during process**
   - Show loading spinner in button
   - Disable button during processing
   - Change text to "Processing..." (optional)
   - Prevent multiple clicks
   - Timeout after 5 seconds if stuck

10. **Handle authentication requirement**
    - Check if user logged in
    - If not: Redirect to login with return URL
    - Store intended action (buy now)
    - After login: Complete buy now action
    - Alternative: Allow guest checkout

11. **Implement error handling**
    - Catch errors during add to cart
    - Catch navigation errors
    - Show error toast with message
    - Re-enable button
    - Log errors for debugging
    - Provide retry option

12. **Add accessibility features**
    - Button type: "button"
    - Aria-label: "Buy now - Proceed to checkout"
    - Aria-disabled when disabled
    - Focus ring visible
    - Screen reader describes fast checkout

### Buy Now Button Layout

```
Add to Cart Button
┌─────────────────────────────────┐
│  🛒  Add to Cart                │  ← Primary button (blue filled)
└─────────────────────────────────┘

Buy Now Button
┌─────────────────────────────────┐
│  ⚡  Buy Now                     │  ← Secondary button (blue outlined)
└─────────────────────────────────┘
```

### Button Styling Comparison

| Aspect | Add to Cart | Buy Now |
|--------|-------------|---------|
| Background | blue-600 (filled) | white (outlined) |
| Border | none | 2px blue-600 |
| Text Color | white | blue-600 |
| Icon | Shopping cart | Lightning bolt |
| Priority | Primary | Secondary |
| Hover BG | blue-700 | blue-50 |

### Button Positioning Options

| Layout | Description | Use Case |
|--------|-------------|----------|
| Side-by-side | Buttons horizontally aligned | Desktop, enough width |
| Stacked | Buttons vertically stacked | Mobile, limited width |
| Add to Cart prominent | Buy Now smaller/link | Encourage cart usage |
| Equal prominence | Both same size | Neutral preference |

### Buy Now Flow Diagram

```
User Clicks "Buy Now"
    ↓
Run validation (same as Add to Cart)
    ↓
├── Validation Failed
│   └── Show error toast → Return
│
└── Validation Passed
    ↓
    Set loading = true
    ↓
    Add product to cart silently
    ↓
    ├── Add Failed
    │   ├── Show error toast
    │   └── Re-enable button
    │
    └── Add Successful
        ↓
        Check authentication
        ↓
        ├── Not logged in (if required)
        │   └── Redirect to login → Return to checkout
        │
        └── Logged in or guest allowed
            ↓
            Navigate to checkout
            ↓
            /checkout route
```

### Authentication Handling

| Checkout Type | User State | Action |
|--------------|------------|--------|
| Requires Login | Not logged in | Redirect to /login?return=/checkout |
| Requires Login | Logged in | Proceed to checkout |
| Guest Allowed | Not logged in | Proceed to checkout (guest) |
| Guest Allowed | Logged in | Proceed to checkout (account) |

### Error Scenarios

| Error | Message | Recovery Action |
|-------|---------|-----------------|
| Validation failed | Same as Add to Cart | Show error toast, focus invalid field |
| Add to cart failed | "Unable to proceed. Please try again." | Retry button |
| Already in checkout | "You're already in checkout" | Redirect to existing checkout |
| Network error | "Connection error. Please check your internet." | Retry button |
| Timeout | "Request timed out. Please try again." | Retry button |

### Loading State Implementation

```typescript
const handleBuyNow = async () => {
  setLoading(true);
  
  try {
    // Validate
    const validation = validateBeforeAddToCart();
    if (!validation.isValid) {
      showErrorToast(validation.message);
      return;
    }
    
    // Add to cart
    await cartStore.addItem(prepareCartItem());
    
    // Navigate to checkout
    router.push('/checkout');
    
  } catch (error) {
    showErrorToast('Unable to proceed. Please try again.');
    console.error('Buy now error:', error);
  } finally {
    setLoading(false);
  }
};
```

### Expected Outcome
- "Buy Now" button styled as secondary CTA
- Same validation as Add to Cart button
- Adds product to cart silently (no success toast)
- Immediately redirects to checkout page
- Loading state during processing
- Error handling for add and navigation failures
- Authentication check before checkout
- Faster purchase path for customers
- Accessible and keyboard friendly

### Verification Checklist
- [ ] Button renders with "Buy Now" text
- [ ] Button has outlined styling (blue border, white bg)
- [ ] Positioned beside or below Add to Cart button
- [ ] Click validates variants and quantity
- [ ] Validation errors show error toast
- [ ] Successful validation adds to cart
- [ ] Item added to cart (verified in cart store)
- [ ] Immediately redirects to /checkout
- [ ] Loading state shows during process
- [ ] Error toast if add to cart fails
- [ ] Error toast if navigation fails
- [ ] Authentication check performed
- [ ] Unauthenticated redirects to login (if required)
- [ ] Hover shows blue-50 background
- [ ] Keyboard accessible
- [ ] ARIA attributes present
- [ ] TypeScript types correct

---

## Task 65: Create Add to Cart Loading

### Overview
Implement the loading state for the Add to Cart button that displays during the cart addition process. This component shows visual feedback that the action is processing, disables interaction during loading, provides a loading spinner or animation, and ensures users understand their action is being processed.

### Dependencies
- Task 63: Add to Cart Button (parent component)
- Loading spinner component or icon library
- Button state management

### Instructions

1. **Define loading state trigger**
   - Loading starts when Add to Cart clicked
   - Lasts during validation and cart addition
   - Minimum duration: 300-500ms (UX smoothness)
   - Actual duration: Based on operation time
   - Loading ends on success or error

2. **Implement loading state management**
   - Use local state: const [loading, setLoading] = useState(false)
   - Set loading = true on button click
   - Set loading = false on operation complete
   - Prevent multiple simultaneous operations
   - Track operation completion

3. **Update button appearance during loading**
   - Show loading spinner icon
   - Change button text to "Adding..." (optional)
   - Reduce button opacity slightly (90%)
   - Change cursor to "wait" or "not-allowed"
   - Disable button clicks (disabled prop)

4. **Create loading spinner component**
   - Circular spinning animation
   - Size: 16-20px (matches text height)
   - Color: White (matches button text)
   - Position: Replace cart icon or left of text
   - Smooth rotation animation (1s infinite)

5. **Implement button text changes**
   - Default: "Add to Cart"
   - Loading: "Adding to Cart..." or "Adding..."
   - Keep text change optional (icon may be enough)
   - Maintain button width (prevent layout shift)
   - Use min-width if text changes

6. **Set up loading animation**
   - Spinner rotates continuously
   - Smooth animation (ease-in-out)
   - No jerky movements
   - Clear visual indicator of activity
   - Stop animation on completion

7. **Add loading state to button props**
   - Pass loading boolean to button component
   - Button internally handles loading UI
   - Or parent manages loading state externally
   - Use controlled component pattern
   - Consistent across all buttons

8. **Implement minimum loading duration**
   - Even if operation instant, show loading briefly
   - Minimum: 300-500ms for perceived responsiveness
   - Use setTimeout to enforce minimum
   - Prevents flash of loading state (too quick)
   - Better user experience

9. **Handle loading state cancellation**
   - If operation times out, end loading
   - If user navigates away, clear loading
   - If error occurs, end loading
   - Cleanup on component unmount
   - Prevent stuck loading state

10. **Add accessibility during loading**
    - Aria-busy="true" on button
    - Aria-label: "Adding to cart..."
    - Screen reader announces loading
    - Button disabled (aria-disabled="true")
    - Focus remains on button

### Loading State Visual Progression

```
Default State
┌─────────────────────────────────┐
│  🛒  Add to Cart                │
└─────────────────────────────────┘

Loading State (Option 1: Icon Only)
┌─────────────────────────────────┐
│  ⟳  Add to Cart                 │  ← Spinner replaces cart icon
└─────────────────────────────────┘

Loading State (Option 2: Text Change)
┌─────────────────────────────────┐
│  ⟳  Adding to Cart...           │  ← Text also changes
└─────────────────────────────────┘

Success State (Task 66)
┌─────────────────────────────────┐
│  ✓  Added to Cart!              │
└─────────────────────────────────┘
```

### Loading Spinner Styling

| Property | Value | Notes |
|----------|-------|-------|
| Size | 16-20px | Match text height |
| Color | white | Match button text |
| Animation | rotate 1s linear infinite | Smooth rotation |
| Position | Left side (replace cart icon) | Consistent placement |

### Button State Styling During Loading

| Aspect | Default | Loading |
|--------|---------|---------|
| Background | blue-600 | blue-600 (same) |
| Opacity | 100% | 90% |
| Cursor | pointer | wait |
| Disabled | false | true |
| Pointer Events | auto | none |
| Icon | Shopping cart | Spinner |
| Text | "Add to Cart" | "Adding..." (optional) |

### Minimum Loading Duration Logic

```typescript
const handleAddToCart = async () => {
  setLoading(true);
  const startTime = Date.now();
  
  try {
    await cartStore.addItem(itemData);
    
    // Ensure minimum loading duration
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
    
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }
    
    setLoading(false);
    showSuccessToast();
    
  } catch (error) {
    setLoading(false);
    showErrorToast();
  }
};

const MIN_LOADING_MS = 500; // 500ms minimum
```

### Loading State Timeout

| Timeout | Action |
|---------|--------|
| 5 seconds | Show warning toast "Still processing..." |
| 10 seconds | End loading, show error "Request timed out" |
| On error | Immediately end loading |
| On unmount | Clear loading state |

### Accessibility During Loading

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-busy | "true" | Indicate busy state |
| aria-disabled | "true" | Indicate disabled |
| aria-label | "Adding to cart, please wait" | Describe action |
| role | "button" | Semantic role |
| tabindex | "0" | Maintain focus |

### Loading Implementation Example

```typescript
// In AddToCartButton component
const [loading, setLoading] = useState(false);

return (
  <button
    onClick={handleAddToCart}
    disabled={loading || disabled}
    aria-busy={loading}
    aria-label={loading ? "Adding to cart" : "Add to cart"}
    className={cn(
      "btn-primary",
      loading && "opacity-90 cursor-wait"
    )}
  >
    {loading ? (
      <>
        <Spinner className="animate-spin" />
        <span>Adding...</span>
      </>
    ) : (
      <>
        <ShoppingCartIcon />
        <span>Add to Cart</span>
      </>
    )}
  </button>
);
```

### Expected Outcome
- Loading state displays when adding to cart
- Spinner icon shows in button
- Button text changes to "Adding..." (optional)
- Button disabled during loading
- Minimum loading duration enforced (300-500ms)
- Smooth spinner animation
- Loading ends on success or error
- Accessible to screen readers
- Prevents multiple simultaneous adds
- No stuck loading states

### Verification Checklist
- [ ] Loading state triggers on button click
- [ ] Spinner icon displays in button
- [ ] Button text changes to "Adding..." (if implemented)
- [ ] Button opacity reduces to 90%
- [ ] Cursor changes to "wait"
- [ ] Button disabled during loading
- [ ] Additional clicks prevented during loading
- [ ] Loading persists for minimum 300-500ms
- [ ] Loading ends on successful add
- [ ] Loading ends on error
- [ ] Spinner animation smooth (rotates continuously)
- [ ] No layout shift when loading starts
- [ ] Aria-busy="true" during loading
- [ ] Screen reader announces loading state
- [ ] TypeScript types correct

---

## Task 66: Create Add to Cart Success

### Overview
Implement success feedback that displays after successfully adding a product to the cart. This task creates a toast notification confirming the action, displays product details in the toast, provides quick actions (view cart, checkout), uses Sonner toast library, and ensures users receive clear confirmation of their action.

### Dependencies
- Task 63: Add to Cart Button (triggers success)
- Task 65: Loading State (precedes success)
- Sonner toast library configured
- Cart state management

### Instructions

1. **Set up Sonner toast library**
   - Install: npm install sonner
   - Import: import { toast } from 'sonner'
   - Add Toaster component to app layout
   - Configure toast position (bottom-right or top-right)
   - Set default duration: 4-5 seconds

2. **Create success toast trigger**
   - Trigger after successful cart addition
   - Call toast.success() with message
   - Include product details in toast
   - Show immediately after loading ends
   - Coordinate with loading state (Task 65)

3. **Design success toast content**
   - Success icon (checkmark)
   - Message: "Added to cart"
   - Product name
   - Product image thumbnail (optional)
   - Quantity added: "(2 items)"
   - Action buttons: "View Cart" and "Checkout"

4. **Implement success message**
   - Primary message: "Added to cart" or "Product added successfully"
   - Include product name: "Blue T-Shirt added to cart"
   - Include quantity if > 1: "(3 items added)"
   - Keep message concise
   - Use success tone

5. **Add product thumbnail to toast**
   - Small product image (48x48px)
   - Show selected variant image
   - Position on left side of toast
   - Rounded corners (4-6px)
   - Fallback icon if no image

6. **Create action buttons in toast**
   - "View Cart" button: Navigate to /cart
   - "Checkout" button: Navigate to /checkout
   - Style as text links or small buttons
   - Position at bottom of toast
   - Close toast on click

7. **Implement View Cart action**
   - Button text: "View Cart"
   - Click: router.push('/cart')
   - Close toast on navigation
   - Secondary button style
   - Open in same window

8. **Implement Checkout action**
   - Button text: "Checkout"
   - Click: router.push('/checkout')
   - Close toast on navigation
   - Primary button style (more prominent)
   - Optional: Add items and go directly

9. **Configure toast appearance**
   - Position: bottom-right or top-right
   - Duration: 4-5 seconds (long enough to read)
   - Auto-dismiss: Yes
   - Close button: Yes (X icon)
   - Animation: Slide in from side
   - Max width: 360-400px

10. **Add toast dismiss functionality**
    - Auto-dismiss after duration
    - Manual dismiss via X button
    - Dismiss on action click (View Cart/Checkout)
    - Swipe to dismiss (mobile)
    - Escape key to dismiss

11. **Handle multiple adds**
    - If product added again, update existing toast
    - Or show new toast with updated quantity
    - Don't spam toasts for rapid adds
    - Debounce or batch notifications

12. **Implement accessibility**
    - Toast has role="status" or "alert"
    - ARIA live region for screen readers
    - Screen reader announces success
    - Keyboard accessible buttons
    - Focus management

### Success Toast Structure

```
┌──────────────────────────────────────┐
│  ✓  Added to cart                    │  ← Success icon + message
│                                       │
│  [Image]  Blue Cotton T-Shirt        │  ← Product thumbnail + name
│           Size: M, Color: Blue       │  ← Variant details
│           Quantity: 2                │  ← Quantity
│                                       │
│  [View Cart]  [Checkout]             │  ← Action buttons
└──────────────────────────────────────┘
```

### Toast Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Position | bottom-right | Non-intrusive, common pattern |
| Duration | 4-5 seconds | Enough time to read and act |
| Max Width | 360px | Readable, not too wide |
| Auto Dismiss | Yes | Don't clutter screen |
| Close Button | Yes | User control |
| Animation | Slide in | Smooth entrance |

### Success Message Variations

| Scenario | Toast Message |
|----------|---------------|
| Single item | "Blue T-Shirt added to cart" |
| Multiple items | "Blue T-Shirt added to cart (3 items)" |
| Generic | "Product added successfully" |
| With variant | "Blue T-Shirt (Size M) added to cart" |
| Update qty | "Cart updated - Blue T-Shirt (5 items)" |

### Toast Actions

| Button | Label | Action | Style |
|--------|-------|--------|-------|
| View Cart | "View Cart" | Navigate to /cart | Secondary (outlined) |
| Checkout | "Checkout" | Navigate to /checkout | Primary (filled) |
| Dismiss | X icon | Close toast | Icon button |

### Sonner Toast Implementation

```typescript
import { toast } from 'sonner';

const showSuccessToast = (product, quantity) => {
  toast.success('Added to cart', {
    description: `${product.name} ${quantity > 1 ? `(${quantity} items)` : ''}`,
    duration: 4500,
    action: [
      {
        label: 'View Cart',
        onClick: () => router.push('/cart')
      },
      {
        label: 'Checkout',
        onClick: () => router.push('/checkout')
      }
    ]
  });
};

// Usage in AddToCartButton
const handleAddToCart = async () => {
  setLoading(true);
  try {
    await cartStore.addItem(itemData);
    setLoading(false);
    showSuccessToast(product, quantity);
  } catch (error) {
    setLoading(false);
    toast.error('Failed to add to cart');
  }
};
```

### Toast Position Options

| Position | Use Case | Mobile Friendly |
|----------|----------|-----------------|
| top-right | Desktop default | Less ideal |
| top-center | Important alerts | Good |
| bottom-right | Non-intrusive | Good |
| bottom-center | Mobile default | Excellent |
| top-left | Alternative | Less common |

### Accessibility Implementation

```typescript
// Toaster component setup
<Toaster
  position="bottom-right"
  toastOptions={{
    duration: 4500,
    className: 'toast-success',
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  }}
/>
```

### Expected Outcome
- Success toast displays after adding to cart
- Toast shows checkmark icon with "Added to cart"
- Product name and quantity displayed
- Optional product thumbnail shown
- "View Cart" and "Checkout" action buttons
- Toast auto-dismisses after 4-5 seconds
- Manual dismiss via X button
- Actions navigate to cart or checkout
- Accessible to screen readers
- Smooth slide-in animation

### Verification Checklist
- [ ] Success toast displays after add to cart
- [ ] Toast shows checkmark success icon
- [ ] Message reads "Added to cart" or similar
- [ ] Product name displayed in toast
- [ ] Quantity shown if > 1
- [ ] Product thumbnail displayed (optional)
- [ ] "View Cart" button present and functional
- [ ] Click "View Cart" navigates to /cart
- [ ] "Checkout" button present and functional
- [ ] Click "Checkout" navigates to /checkout
- [ ] Toast auto-dismisses after 4-5 seconds
- [ ] X button closes toast immediately
- [ ] Toast positioned correctly (bottom-right)
- [ ] Screen reader announces success
- [ ] Keyboard accessible buttons
- [ ] TypeScript types correct

---

## Task 67: Create Wishlist Button

### Overview
Implement the wishlist toggle button allowing authenticated users to save products to their wishlist for later. This component handles authentication requirements, toggles saved state, integrates with wishlist data management, provides visual feedback, and displays appropriate prompts for non-authenticated users.

### Dependencies
- Task 35: Product Info Container (positioning)
- Authentication system (user login state)
- Wishlist API endpoints or state management
- Icon library (heart icons)

### Instructions

1. **Create wishlist button component file**
   - Navigate to `frontend/components/storefront/product/CartActions/` directory
   - Create `WishlistButton.tsx` file
   - Set up TypeScript functional component
   - Import authentication and wishlist hooks

2. **Define TypeScript interfaces**
   - Create `WishlistButtonProps` interface
   - Include productId string
   - Add initialSaved boolean (from server/cache)
   - Include size variant (small, medium, large)
   - Add showLabel boolean (default false)
   - Include onToggle callback (optional)

3. **Implement button structure**
   - Button element with heart icon
   - Filled heart when saved (in wishlist)
   - Outlined heart when not saved
   - Optional text label: "Add to Wishlist" / "Saved"
   - Icon-only by default (save space)
   - Positioned near product title or actions

4. **Set up button styling**
   - Icon-only: Transparent bg, gray border
   - Hover: Light background (gray-50)
   - Saved state: Red/pink filled heart
   - Not saved: Gray outlined heart
   - Size: 40x40px (icon button) or larger with label
   - Border radius: Rounded (8px)

5. **Implement authentication check**
   - Check if user is logged in
   - Use useAuth or similar hook
   - If not logged in: Prompt to login
   - Redirect to login with return URL
   - Alternative: Show login modal

6. **Create wishlist state management**
   - Track saved state: const [saved, setSaved] = useState(initialSaved)
   - Sync with backend wishlist API
   - Optimistic UI update (immediate feedback)
   - Revert on API failure
   - Persist to database

7. **Implement toggle functionality**
   - Function: handleToggleWishlist()
   - Check authentication first
   - If not logged in: Prompt login
   - If logged in: Toggle saved state
   - API call: Add or remove from wishlist
   - Update UI optimistically

8. **Create API integration**
   - POST /api/wishlist/add - Add product to wishlist
   - DELETE /api/wishlist/remove/:productId - Remove from wishlist
   - GET /api/wishlist - Fetch user's wishlist
   - Handle loading and error states
   - Authenticate requests with token

9. **Implement optimistic UI updates**
   - Update saved state immediately on click
   - Don't wait for API response
   - If API fails: Revert state
   - Show error toast on failure
   - Better user experience (feels fast)

10. **Add visual feedback**
    - Heart icon animates on toggle (scale pulse)
    - Smooth color transition (150ms)
    - Filled heart: Red or pink (#ef4444, #ec4899)
    - Outlined heart: Gray (#9ca3af)
    - Hover: Slight scale (1.05)

11. **Create login prompt for unauthenticated users**
    - Show toast: "Please log in to save to wishlist"
    - Redirect to login page: /login?return=[current-page]
    - Alternative: Open login modal
    - After login: Return to product page
    - Automatically save to wishlist (optional)

12. **Handle wishlist count update**
    - Increment/decrement user's wishlist count
    - Update global wishlist state
    - Show count in header wishlist icon
    - Sync across components

13. **Add accessibility features**
    - Button type: "button"
    - Aria-label: "Add to wishlist" / "Remove from wishlist"
    - Aria-pressed for toggle state
    - Screen reader announces state change
    - Keyboard accessible (Enter/Space)

### Wishlist Button States

```
Not Saved (Default)
┌────────┐
│   ♡    │  ← Outlined heart (gray)
└────────┘

Saved (In Wishlist)
┌────────┐
│   ♥    │  ← Filled heart (red/pink)
└────────┘

With Label (Not Saved)
┌──────────────────────┐
│  ♡  Add to Wishlist  │
└──────────────────────┘

With Label (Saved)
┌──────────────────────┐
│  ♥  Saved            │
└──────────────────────┘
```

### Button Styling Specifications

| State | Icon | Icon Color | Background | Border | Hover BG |
|-------|------|-----------|------------|--------|----------|
| Not Saved | Outlined heart | gray-400 | white | gray-300 | gray-50 |
| Saved | Filled heart | red-500 | white | red-300 | red-50 |
| Hover (not saved) | Outlined | gray-600 | gray-50 | gray-400 | - |
| Hover (saved) | Filled | red-600 | red-50 | red-400 | - |

### Authentication Flow

```
User Clicks Wishlist Button
    ↓
Check if user is authenticated
    ↓
├── Not Authenticated
│   ├── Show toast: "Please log in to save to wishlist"
│   ├── Redirect to: /login?return=/products/[slug]
│   └── After login: Return to product page
│       └── Optional: Auto-save to wishlist
│
└── Authenticated
    ↓
    Toggle wishlist state
    ↓
    ├── Currently saved: Remove from wishlist
    │   ├── API: DELETE /api/wishlist/remove/:productId
    │   ├── Update saved = false (optimistic)
    │   └── Decrement wishlist count
    │
    └── Not saved: Add to wishlist
        ├── API: POST /api/wishlist/add
        ├── Update saved = true (optimistic)
        └── Increment wishlist count
```

### Optimistic UI Update Pattern

```typescript
const handleToggleWishlist = async () => {
  if (!isAuthenticated) {
    toast.info('Please log in to save to wishlist');
    router.push(`/login?return=${router.asPath}`);
    return;
  }

  // Optimistic update
  const previousSaved = saved;
  setSaved(!saved);

  try {
    if (saved) {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      await addToWishlist(productId);
      toast.success('Added to wishlist');
    }
  } catch (error) {
    // Revert on failure
    setSaved(previousSaved);
    toast.error('Failed to update wishlist');
  }
};
```

### Heart Icon Animation

```css
.wishlist-button:active .heart-icon {
  animation: heartPulse 300ms ease-in-out;
}

@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

### Positioning Options

| Location | Use Case | Benefits |
|----------|----------|----------|
| Near title | Below or beside product title | Prominent, easy to find |
| Above price | In product info section | Grouped with key info |
| With cart buttons | Beside Add to Cart | Action grouping |
| Floating icon | Top-right on product image | Doesn't disrupt layout |

### Login Prompt Messages

| Scenario | Message | Action |
|----------|---------|--------|
| Click when logged out | "Please log in to save to wishlist" | Redirect to login |
| Add to wishlist success | "Added to wishlist" | Dismiss |
| Remove from wishlist | "Removed from wishlist" | Dismiss |
| API error | "Failed to update wishlist. Please try again." | Retry option |

### Expected Outcome
- Wishlist button with heart icon displayed
- Outlined heart when not saved
- Filled red/pink heart when saved
- Authentication check before toggle
- Login prompt for unauthenticated users
- Optimistic UI update on click
- API integration to persist wishlist
- Visual feedback (animation, color change)
- Toast notifications for actions
- Accessible to keyboard and screen readers
- Sync with global wishlist count

### Verification Checklist
- [ ] Button renders with heart icon
- [ ] Icon outlined (gray) when not saved
- [ ] Icon filled (red/pink) when saved
- [ ] Click checks authentication
- [ ] Unauthenticated shows login prompt
- [ ] Unauthenticated redirects to login
- [ ] Authenticated toggles wishlist state
- [ ] Saved state updates immediately (optimistic)
- [ ] API call to add/remove from wishlist
- [ ] Success toast shows after toggle
- [ ] Error toast shows on API failure
- [ ] State reverts on API failure
- [ ] Heart animates on click (pulse)
- [ ] Hover effects functional
- [ ] Keyboard accessible (Enter/Space)
- [ ] Aria-label describes action
- [ ] Screen reader announces state change
- [ ] TypeScript types correct

---

## Task 68: Verify Cart Actions

### Overview
Conduct comprehensive verification of all cart action functionality to ensure proper integration, validate user flows, test edge cases, confirm accessibility compliance, and verify that all cart-related features work correctly across different scenarios and devices.

### Dependencies
- All previous Group D tasks (53-67)
- Task 61: Quantity Selector
- Task 63: Add to Cart Button
- Task 64: Buy Now Button
- Task 67: Wishlist Button
- Cart state management
- Authentication system

### Instructions

1. **Verify variant selection integration**
   - Select size variant
   - Select color variant
   - Confirm price updates correctly (Task 60)
   - Verify gallery images update
   - Check stock status updates
   - Ensure unavailable variants cannot be selected

2. **Test quantity selector functionality**
   - Increment quantity with + button
   - Decrement quantity with - button
   - Type quantity directly in input field
   - Verify min limit enforced (cannot go below 1)
   - Verify max limit enforced (cannot exceed stock)
   - Check stock message displays correctly

3. **Validate add to cart flow**
   - Test without variant selection (should show error)
   - Select all required variants
   - Set quantity to valid amount
   - Click Add to Cart button
   - Verify loading state displays (Task 65)
   - Confirm success toast appears (Task 66)
   - Check item added to cart correctly

4. **Verify cart data accuracy**
   - Open cart drawer/page
   - Confirm product name correct
   - Verify selected variants displayed (size, color)
   - Check quantity matches selected amount
   - Confirm price is correct (variant price)
   - Verify product image is correct (variant image)
   - Check SKU matches variant

5. **Test buy now functionality**
   - Select variants and quantity
   - Click Buy Now button
   - Verify item added to cart
   - Confirm redirect to checkout page
   - Check cart state persisted
   - Verify checkout page shows correct items

6. **Validate wishlist functionality**
   - Click wishlist button when logged out
   - Verify login prompt appears
   - Log in and return to product
   - Click wishlist button
   - Confirm item added to wishlist
   - Check wishlist count incremented
   - Click again to remove
   - Verify item removed and count decremented

7. **Test duplicate item handling**
   - Add item to cart (size M, color Blue, qty 2)
   - Change to different variant (size L, color Red)
   - Add to cart again
   - Verify two separate items in cart
   - Add same variant again (size M, color Blue, qty 1)
   - Confirm quantity updated (not duplicated)
   - Check total quantity is 3 for size M, color Blue

8. **Verify stock limit enforcement**
   - Find product with low stock (e.g., 3 available)
   - Set quantity to max (3)
   - Add to cart successfully
   - Return to product page
   - Verify max quantity now 0 (all in cart)
   - Attempt to add more
   - Confirm error message: "Maximum available reached"

9. **Test error handling**
   - Disconnect network (simulate offline)
   - Attempt to add to cart
   - Verify error toast with retry option
   - Reconnect network
   - Retry add to cart
   - Confirm success
   - Test with invalid data (corrupt variant ID)
   - Verify graceful error handling

10. **Validate responsive behavior**
    - Test on desktop (>1024px)
    - Test on tablet (768-1024px)
    - Test on mobile (<768px)
    - Verify button layouts adapt
    - Check touch targets minimum 44x44px
    - Confirm modals/toasts display correctly

11. **Test keyboard navigation**
    - Tab through all interactive elements
    - Verify focus indicators visible
    - Use Enter/Space on buttons
    - Test quantity input with arrow keys
    - Navigate variant selectors with keyboard
    - Confirm all actions accessible via keyboard

12. **Verify accessibility compliance**
    - Screen reader announces variant selections
    - Button actions described clearly
    - Loading states announced
    - Success/error toasts read aloud
    - ARIA attributes present and correct
    - Color contrast meets WCAG standards
    - Focus management logical

13. **Test edge cases**
    - Product with no variants (simple product)
    - Product with only size variant (no color)
    - Product with 10+ variants
    - Product with stock = 0 (out of stock)
    - Product with price = 0 (free item)
    - Pre-order product
    - Discontinued product

14. **Verify cart persistence**
    - Add items to cart
    - Refresh page
    - Confirm cart items persisted
    - Close browser
    - Reopen and check cart
    - Verify items still in cart (localStorage)

15. **Check multi-product scenario**
    - Add Product A to cart
    - Navigate to Product B
    - Add Product B to cart
    - Verify both in cart
    - Check cart count shows 2 products
    - Verify totals calculated correctly

### Verification Checklist - Variant Selection

- [ ] Size selector displays all sizes
- [ ] Color selector shows color swatches
- [ ] Unavailable variants marked clearly
- [ ] Selected variants highlighted
- [ ] Price updates on variant change
- [ ] Gallery updates on color change
- [ ] Stock status updates on selection
- [ ] Validation prevents unselected variants

### Verification Checklist - Quantity Selector

- [ ] Default quantity is 1
- [ ] Increment button increases quantity
- [ ] Decrement button decreases quantity
- [ ] Cannot decrement below min (1)
- [ ] Cannot increment above max (stock)
- [ ] Direct input accepts valid numbers
- [ ] Invalid input clamped to limits
- [ ] Stock message displays correctly

### Verification Checklist - Add to Cart

- [ ] Button disabled without variants (if required)
- [ ] Loading state displays on click
- [ ] Spinner animation smooth
- [ ] Button disabled during loading
- [ ] Success toast appears after add
- [ ] Toast shows product details
- [ ] Item appears in cart
- [ ] Cart count increments
- [ ] Quantity and variant data correct

### Verification Checklist - Buy Now

- [ ] Button validates variants
- [ ] Loading state displays
- [ ] Item added to cart
- [ ] Redirect to checkout successful
- [ ] Cart persisted to checkout page
- [ ] Checkout shows correct items

### Verification Checklist - Wishlist

- [ ] Button displays heart icon
- [ ] Unauthenticated shows login prompt
- [ ] Authenticated can toggle wishlist
- [ ] Icon changes on toggle
- [ ] API call successful
- [ ] Wishlist count updates
- [ ] Toast notifications shown

### Verification Checklist - Accessibility

- [ ] All buttons keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader support confirmed
- [ ] Color contrast WCAG compliant
- [ ] Touch targets minimum 44x44px
- [ ] Error messages announced

### Verification Checklist - Edge Cases

- [ ] Simple product (no variants) works
- [ ] Out of stock prevents add to cart
- [ ] Multiple variants handled
- [ ] Duplicate items update quantity
- [ ] Stock limits enforced
- [ ] Network errors handled gracefully
- [ ] Cart persists across sessions

### Test Scenarios Summary

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Add without variants | Error toast | ☐ Pass |
| Add with variants | Success toast, item in cart | ☐ Pass |
| Add at max stock | Cannot add more | ☐ Pass |
| Duplicate item | Quantity updated | ☐ Pass |
| Buy now flow | Redirect to checkout | ☐ Pass |
| Wishlist unauthenticated | Login prompt | ☐ Pass |
| Wishlist authenticated | Toggle works | ☐ Pass |
| Keyboard navigation | All accessible | ☐ Pass |
| Screen reader | All announced | ☐ Pass |
| Mobile responsive | Layout adapts | ☐ Pass |

### Expected Outcome
- All cart actions function correctly
- Variant selection integrated properly
- Quantity selector enforces limits
- Add to cart validates and adds items
- Buy now redirects to checkout
- Wishlist requires authentication
- Error handling graceful
- Accessibility compliant
- Responsive across devices
- Edge cases handled appropriately
- Cart data persists correctly

### Final Verification Checklist

- [ ] All variant selectors functional
- [ ] Quantity selector works correctly
- [ ] Add to cart validates properly
- [ ] Loading states display
- [ ] Success toasts appear
- [ ] Buy now redirects correctly
- [ ] Wishlist toggles properly
- [ ] Cart data accurate
- [ ] Cart persists across sessions
- [ ] Duplicate items handled
- [ ] Stock limits enforced
- [ ] Error handling graceful
- [ ] Keyboard navigation complete
- [ ] Screen reader accessible
- [ ] Responsive on all devices
- [ ] Touch targets adequate
- [ ] ARIA attributes correct
- [ ] Color contrast compliant
- [ ] Edge cases tested
- [ ] Multi-product cart works

---

## End of Document

### Summary of Tasks Completed

This document covered 8 tasks related to quantity selection, cart actions, wishlist functionality, and comprehensive verification:

- ✅ Task 61: Quantity Selector - Increment/decrement with validation
- ✅ Task 62: Quantity Min/Max Limits - Stock-based limits enforced
- ✅ Task 63: Add to Cart Button - Primary CTA with validation
- ✅ Task 64: Buy Now Button - Express checkout flow
- ✅ Task 65: Add to Cart Loading - Loading state and feedback
- ✅ Task 66: Add to Cart Success - Toast notification with actions
- ✅ Task 67: Wishlist Button - Save for later functionality
- ✅ Task 68: Verify Cart Actions - Comprehensive testing

### Group D Complete

All tasks in Group D (Variant & Cart Actions) have been documented:

**Document 01:** Tasks 53-60 - Variant selection container, size/color selectors, unavailable states, selection logic, and price updates

**Document 02:** Tasks 61-68 - Quantity selector, cart action buttons, loading and success states, wishlist functionality, and verification

### Next Steps

Continue to Group E to implement:
- Product tabs (description, specifications, shipping)
- Reviews and ratings system
- Review submission form
- Review display and sorting
- Related products section
- Comprehensive testing

**→ Next Group:** [Group-E_Tabs-Reviews](../Group-E_Tabs-Reviews/)
