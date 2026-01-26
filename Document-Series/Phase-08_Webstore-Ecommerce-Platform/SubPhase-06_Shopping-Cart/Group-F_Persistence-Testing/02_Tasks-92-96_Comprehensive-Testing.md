# Tasks 92-96: Comprehensive Cart Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** F - Persistence & Testing  
> **Document:** 02 of 02  
> **Tasks Covered:** 92, 93, 94, 95, 96

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-85-91_Persistence-Sync.md](01_Tasks-85-91_Persistence-Sync.md)

---

## Document Overview

This document covers comprehensive testing of the shopping cart functionality. It includes testing the add to cart flow, quantity update mechanisms, mini cart dropdown behavior, mobile cart page experience, and cart persistence across sessions. These tests ensure the shopping cart provides a seamless, bug-free experience for customers across all devices and scenarios.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 92 | Test Add to Cart Flow | Low | 25 min |
| 93 | Test Quantity Updates | Low | 20 min |
| 94 | Test Mini Cart | Low | 20 min |
| 95 | Test Cart Page Mobile | Low | 25 min |
| 96 | Test Cart Persistence | Low | 30 min |

---

## Task 92: Test Add to Cart Flow

### Overview
Comprehensively test the add to cart functionality from product pages, ensuring the complete flow works seamlessly including button interactions, loading states, success notifications, mini cart updates, and cart count increments.

### Dependencies
- Task 70 (Add to Cart Button with Loading State)
- All cart store actions implemented
- Toast notification system in place

### Instructions

1. **Prepare testing environment**
   - Set up test account or use guest mode
   - Clear cart to start with empty state
   - Navigate to product listing page
   - Ensure test products are available

2. **Test basic add to cart from product card**
   - Locate product card on listing page
   - Click "Add to Cart" button
   - Verify button shows loading state immediately
   - Wait for API call to complete

3. **Verify toast notification appears**
   - Check toast notification displays
   - Verify toast shows correct product name
   - Verify toast shows quantity added
   - Confirm toast has "View Cart" action button
   - Ensure toast auto-dismisses after timeout

4. **Verify cart count increment**
   - Check header cart icon badge
   - Verify count increases by 1
   - Test with multiple additions
   - Verify count sums correctly

5. **Verify mini cart updates**
   - Open mini cart dropdown
   - Verify newly added item appears
   - Check item name, image, price, quantity display
   - Verify subtotal recalculates

6. **Test add to cart from product detail page**
   - Navigate to individual product page
   - Select variant (if applicable)
   - Set quantity using number input
   - Click "Add to Cart" button
   - Verify same success indicators

7. **Test adding multiple quantities at once**
   - Set quantity to 3 on product page
   - Click "Add to Cart"
   - Verify cart count increases by 3
   - Verify cart item shows quantity 3
   - Check subtotal calculation

8. **Test adding same product multiple times**
   - Add product A (quantity 1)
   - Add product A again (quantity 1)
   - Verify cart has single entry with quantity 2
   - Ensure no duplicate cart items created

9. **Test error scenarios**
   - Attempt to add out-of-stock item
   - Verify error message displays
   - Attempt to add item with API error
   - Verify graceful error handling

10. **Test quick add button (if present)**
    - Test quick add from product grid
    - Verify immediate feedback
    - Ensure consistent behavior with regular add

### Test Scenarios Matrix

| Scenario | Location | Quantity | Expected Result |
|----------|----------|----------|-----------------|
| Single Item | Product Card | 1 | Item added, count +1 |
| Single Item | Product Page | 1 | Item added, count +1 |
| Multiple Qty | Product Page | 5 | Item added, count +5 |
| Duplicate Item | Any | 1 | Quantity increases |
| With Variant | Product Page | 2 | Variant item added |
| Out of Stock | Any | N/A | Error shown, not added |

### Add to Cart Flow Diagram

```
User Click
    │
    ▼
Button → Loading State
    │
    ▼
Call Add Action
    │
    ├─── Success
    │    │
    │    ├─── Show Toast
    │    ├─── Update Cart Count
    │    ├─── Update Mini Cart
    │    ├─── Reset Button
    │    └─── Animate Badge
    │
    └─── Error
         │
         ├─── Show Error Toast
         ├─── Reset Button
         └─── Log Error
```

### Success Indicators Checklist

| Indicator | Visual Feedback | Timing |
|-----------|-----------------|--------|
| Button State | Spinner icon | Immediate |
| Toast | Slide in from top/bottom | 200ms delay |
| Cart Count | Number increment + badge pulse | Immediate |
| Mini Cart | Item appears + highlight | When opened |
| Button Reset | Returns to normal state | After success |

### Toast Notification Test Cases

| Test Case | Content | Action Button | Auto-Dismiss |
|-----------|---------|---------------|--------------|
| Single item | "Product A added to cart" | "View Cart" | 3 seconds |
| Multiple qty | "3 × Product A added" | "View Cart" | 3 seconds |
| Duplicate | "Product A quantity updated" | "View Cart" | 3 seconds |
| Error | "Failed to add item" | "Retry" | 5 seconds |

### Cart Count Increment Tests

```
Initial: 0 items
Add Product A (qty 1) → Count: 1
Add Product B (qty 1) → Count: 2
Add Product C (qty 3) → Count: 5
Add Product A (qty 1) → Count: 6 (not 7)
Remove Product B → Count: 5
```

### Expected Outcome
- Add to cart works reliably across all scenarios
- All success indicators function correctly
- Error cases handled gracefully
- User receives clear feedback for every action

### Verification Checklist
- [ ] Add from product card works
- [ ] Add from product page works
- [ ] Loading state displays correctly
- [ ] Toast notification appears and auto-dismisses
- [ ] Cart count increments accurately
- [ ] Mini cart updates immediately
- [ ] Multiple quantities handled correctly
- [ ] Duplicate items merge quantities
- [ ] Variant selection respected
- [ ] Out-of-stock items blocked
- [ ] Error messages clear and helpful
- [ ] Button returns to normal state after action

---

## Task 93: Test Quantity Updates

### Overview
Test all quantity update mechanisms in the cart, including increment/decrement buttons, direct number input, minimum/maximum constraints, stock limit enforcement, and total recalculation. Ensure quantity changes work correctly on both cart page and mini cart.

### Dependencies
- Task 70 (Add to Cart functionality)
- Quantity controls implemented
- Cart total calculations working

### Instructions

1. **Prepare test cart with items**
   - Add multiple products to cart
   - Include products with varying stock levels
   - Include products with and without variants
   - Start with known quantities

2. **Test increment button**
   - Click "+" button on cart item
   - Verify quantity increases by 1
   - Verify subtotal recalculates
   - Verify total updates
   - Test increment animation/feedback

3. **Test decrement button**
   - Click "-" button on cart item
   - Verify quantity decreases by 1
   - Verify subtotal recalculates
   - Verify total updates
   - Test minimum quantity enforcement

4. **Test minimum quantity constraint (1)**
   - Set item quantity to 1
   - Click "-" button
   - Verify quantity stays at 1 (doesn't go to 0)
   - Alternatively, verify item removed if allowed
   - Check for confirmation modal if required

5. **Test maximum quantity constraint (stock limit)**
   - Find item with limited stock (e.g., 5 available)
   - Set quantity to maximum
   - Click "+" button
   - Verify quantity doesn't exceed stock
   - Verify error message or disabled button

6. **Test direct number input**
   - Click quantity number to focus input
   - Type new quantity (e.g., 10)
   - Press Enter or blur input
   - Verify quantity updates
   - Verify validation occurs

7. **Test invalid number input**
   - Enter 0 or negative number
   - Verify validation error
   - Verify quantity resets to previous value
   - Enter non-numeric characters
   - Verify input rejected or sanitized

8. **Test quantity exceeding stock**
   - Enter quantity greater than available stock
   - Submit/blur input
   - Verify quantity capped at stock limit
   - Verify user notification shown

9. **Test quantity update debouncing**
   - Rapidly click increment button multiple times
   - Verify updates batched appropriately
   - Verify final quantity is accurate
   - Test with direct input as well

10. **Test total recalculation on quantity change**
    - Note original subtotal and total
    - Increase quantity of one item
    - Verify item subtotal updates
    - Verify cart total updates
    - Verify shipping/taxes recalculate if applicable

11. **Test quantity update in mini cart**
    - Open mini cart dropdown
    - Test increment/decrement buttons
    - Verify updates work same as cart page
    - Verify mini cart total updates

12. **Test quantity persistence**
    - Update quantities
    - Navigate away from cart page
    - Return to cart page
    - Verify quantities retained
    - Refresh page and verify persistence

### Quantity Control Test Matrix

| Action | Initial Qty | Expected Qty | Validation |
|--------|-------------|--------------|------------|
| Click + | 1 | 2 | Success |
| Click - | 2 | 1 | Success |
| Click - | 1 | 1 or removed | Min constraint |
| Click + | 5 (max stock) | 5 | Max constraint |
| Input 10 | 2 | 10 or max stock | Stock check |
| Input 0 | 2 | 2 (reject) or 1 (min) | Min validation |
| Input -5 | 2 | 2 (reject) | Validation |
| Input "abc" | 2 | 2 (reject) | Type validation |

### Quantity Update Flow

```
User Action (+ button)
    │
    ▼
Validate Current Quantity
    │
    ├─── At Max Stock?
    │    └─── Show Error → Stop
    │
    └─── Can Increment
         │
         ▼
    Update Zustand Store
         │
         ▼
    Recalculate Subtotal
         │
         ▼
    Recalculate Total
         │
         ▼
    Update UI
         │
         ▼
    Persist to Storage
         │
         └─── If Authenticated: Sync to API
```

### Calculation Test Cases

```
Product A: ₨1,000 × 2 = ₨2,000
Product B: ₨500 × 3 = ₨1,500
Subtotal: ₨3,500

Update Product A to 5:
Product A: ₨1,000 × 5 = ₨5,000
Product B: ₨500 × 3 = ₨1,500
Subtotal: ₨6,500

Update Product B to 1:
Product A: ₨1,000 × 5 = ₨5,000
Product B: ₨500 × 1 = ₨500
Subtotal: ₨5,500
```

### Stock Limit Enforcement

| Stock Available | User Input | Result | User Feedback |
|-----------------|------------|--------|---------------|
| 10 | 5 | Accepted | None |
| 10 | 10 | Accepted | "Max quantity" |
| 10 | 15 | Capped at 10 | "Limited to available stock" |
| 0 | 1 | Rejected | "Out of stock" |

### Debounce Behavior

```
User clicks + button 5 times rapidly:
├── Local state updates immediately (UI)
├── API calls debounced (wait 500ms)
├── After 500ms idle: Single API call
└── Final quantity: +5
```

### Error Messages

| Scenario | Error Message |
|----------|---------------|
| Below min | "Minimum quantity is 1" |
| Exceeds stock | "Only X available in stock" |
| Invalid input | "Please enter a valid quantity" |
| API error | "Failed to update quantity. Please try again." |

### Expected Outcome
- Quantity updates work reliably in all scenarios
- Constraints enforced (min, max, stock)
- Totals recalculate correctly
- User feedback clear and immediate

### Verification Checklist
- [ ] Increment button works correctly
- [ ] Decrement button works correctly
- [ ] Minimum quantity (1) enforced
- [ ] Maximum quantity (stock) enforced
- [ ] Direct number input functional
- [ ] Invalid inputs rejected
- [ ] Zero and negative numbers handled
- [ ] Quantities exceeding stock capped
- [ ] Item subtotal recalculates
- [ ] Cart total recalculates
- [ ] Shipping/taxes update if applicable
- [ ] Debouncing prevents excessive API calls
- [ ] Mini cart quantity updates work
- [ ] Quantities persist correctly
- [ ] Error messages displayed appropriately

---

## Task 94: Test Mini Cart

### Overview
Thoroughly test the mini cart dropdown functionality, including opening/closing behavior, item display, quantity controls, remove item functionality, navigation to cart page, and proceed to checkout action. Ensure mini cart provides a quick overview and basic cart management.

### Dependencies
- Task 36 (Mini Cart implementation)
- Cart store fully functional
- Dropdown component working

### Instructions

1. **Test mini cart trigger and opening**
   - Click cart icon in header
   - Verify dropdown opens smoothly
   - Check animation/transition effect
   - Verify backdrop/overlay appears
   - Test clicking on backdrop to close

2. **Test mini cart with empty cart**
   - Open mini cart with no items
   - Verify "Your cart is empty" message displays
   - Verify no item list shown
   - Verify "Continue Shopping" button present
   - Click button and verify navigation works

3. **Test mini cart with items**
   - Add 1-3 items to cart
   - Open mini cart
   - Verify all items display
   - Check item order (most recent first or consistent order)

4. **Verify item display in mini cart**
   - Check product image displays correctly
   - Verify product name shown
   - Verify variant details shown (if applicable)
   - Verify price displayed
   - Verify quantity shown

5. **Test item limit in mini cart**
   - Add more than display limit (e.g., 5+ items)
   - Open mini cart
   - Verify only first 3-4 items shown
   - Verify "View full cart" link or message
   - Verify scroll or overflow handling

6. **Test quantity display and updates**
   - Verify each item shows current quantity
   - If quantity controls present in mini cart:
     - Test increment/decrement buttons
     - Verify updates work correctly
     - Verify totals recalculate
   - If no controls present, verify static display

7. **Test remove item from mini cart**
   - Locate remove button (X icon or trash icon)
   - Click remove button
   - Verify confirmation modal appears (if applicable)
   - Confirm removal
   - Verify item removed from mini cart
   - Verify cart count decrements
   - Verify total recalculates

8. **Test subtotal display**
   - Verify subtotal shows sum of all items
   - Verify currency format correct (₨X,XXX)
   - Update quantity and verify subtotal updates
   - Add/remove items and verify recalculation

9. **Test "View Cart" button**
   - Locate "View Cart" or "Go to Cart" button
   - Click button
   - Verify navigation to cart page (`/cart`)
   - Verify mini cart closes on navigation
   - Verify cart page shows same items

10. **Test "Checkout" button**
    - Locate "Proceed to Checkout" button
    - Verify button is enabled with items in cart
    - Click button
    - Verify navigation to checkout page
    - Verify mini cart closes on navigation

11. **Test mini cart closing**
    - Click backdrop/overlay to close
    - Click cart icon again to toggle close
    - Press Escape key to close
    - Verify smooth close animation
    - Test clicking inside mini cart doesn't close it

12. **Test mini cart responsiveness**
    - Test on desktop (dropdown position)
    - Test on tablet (dropdown or full overlay)
    - Test on mobile (full screen drawer or overlay)
    - Verify touch interactions work

### Mini Cart Structure

```
┌─────────────────────────────┐
│ Shopping Cart         [X]   │
├─────────────────────────────┤
│ [Image] Product A           │
│         Qty: 2  ₨2,000  [x] │
├─────────────────────────────┤
│ [Image] Product B           │
│         Qty: 1  ₨500    [x] │
├─────────────────────────────┤
│ + 2 more items              │
├─────────────────────────────┤
│ Subtotal:          ₨2,500   │
├─────────────────────────────┤
│ [View Cart] [Checkout]      │
└─────────────────────────────┘
```

### Mini Cart States

| State | Display | Actions Available |
|-------|---------|-------------------|
| Empty | "Cart is empty" message | Continue Shopping |
| 1-3 Items | Show all items | View Cart, Checkout, Remove |
| 4+ Items | Show first 3 + "X more" | View Cart, Checkout, Remove |
| Loading | Skeleton loader | None (disabled) |
| Error | Error message | Retry, Close |

### Item Display Test Cases

| Element | Expected Display | Format |
|---------|------------------|--------|
| Image | Product thumbnail | 60×60px |
| Name | Product title | Truncate if > 40 chars |
| Variant | Size, Color, etc. | Small text below name |
| Quantity | "Qty: X" or "× X" | Left side |
| Price | Item total | ₨X,XXX (formatted) |
| Remove | X or trash icon | Right side |

### Mini Cart Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Open | Click cart icon | Dropdown appears |
| Close | Click backdrop | Dropdown closes |
| Close | Press Escape | Dropdown closes |
| Close | Click cart icon again | Dropdown closes |
| Remove Item | Click X button | Item removed, cart updates |
| View Cart | Click button | Navigate to /cart |
| Checkout | Click button | Navigate to /checkout |
| Continue Shopping | Click button (empty) | Close dropdown |

### Item Limit Behavior

```
1-3 items:
└── Show all items fully

4 items:
├── Show first 3 items
└── Show "1 more item" link

5+ items:
├── Show first 3 items
└── Show "X more items" link

Click "X more items":
└── Navigate to cart page
```

### Subtotal Calculation Display

```
Item A: ₨1,000 × 2 = ₨2,000
Item B: ₨500 × 1 = ₨500
Item C: ₨300 × 3 = ₨900
─────────────────────────────
Subtotal:           ₨3,400
```

### Expected Outcome
- Mini cart opens and closes smoothly
- Items display correctly with all details
- Remove item functionality works
- Navigation buttons work correctly
- Responsive on all devices

### Verification Checklist
- [ ] Cart icon click opens mini cart
- [ ] Empty cart shows appropriate message
- [ ] Items display with image, name, price, quantity
- [ ] Variant details shown when applicable
- [ ] Item limit enforced (3-4 items visible)
- [ ] "X more items" link works
- [ ] Remove item button functional
- [ ] Removal updates cart count and total
- [ ] Subtotal calculates correctly
- [ ] Subtotal updates on changes
- [ ] "View Cart" button navigates correctly
- [ ] "Checkout" button navigates correctly
- [ ] Mini cart closes on navigation
- [ ] Backdrop click closes mini cart
- [ ] Escape key closes mini cart
- [ ] Cart icon toggle closes mini cart
- [ ] Clicking inside doesn't close mini cart
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Touch interactions work on mobile

---

## Task 95: Test Cart Page Mobile

### Overview
Comprehensively test the cart page experience on mobile devices, ensuring responsive layout, touch-friendly controls, proper single-column display, accessible quantity adjustments, smooth scrolling, and easy checkout access. Verify that mobile users have an optimal cart management experience.

### Dependencies
- Task 54 (Cart Page with Summary)
- Responsive design implemented
- Mobile breakpoints configured

### Instructions

1. **Test on actual mobile devices**
   - Test on iPhone (iOS Safari)
   - Test on Android phone (Chrome)
   - Test on various screen sizes (375px, 390px, 414px widths)
   - Use device simulators and real devices

2. **Verify single-column layout**
   - Open cart page on mobile
   - Verify items stack vertically (not side-by-side)
   - Verify cart summary appears below items (not sidebar)
   - Check spacing and padding appropriate for mobile

3. **Test item card layout mobile**
   - Verify product image size appropriate
   - Verify text remains readable
   - Verify price and subtotal clearly visible
   - Check that content doesn't overflow or cut off

4. **Test quantity controls touch targets**
   - Tap increment button with thumb
   - Tap decrement button with thumb
   - Verify buttons are large enough (min 44×44px)
   - Verify sufficient spacing to prevent mis-taps

5. **Test number input on mobile**
   - Tap quantity number
   - Verify mobile keyboard appears
   - Verify numeric keypad opens (not full keyboard)
   - Enter new quantity
   - Tap outside or press done to close keyboard
   - Verify update applies correctly

6. **Test remove item on mobile**
   - Locate remove button or icon
   - Verify button is touch-friendly size
   - Tap remove button
   - Verify confirmation modal (if present) is readable
   - Confirm removal
   - Verify item removed smoothly

7. **Test swipe-to-remove (if implemented)**
   - Swipe item card left or right
   - Verify remove action reveals
   - Confirm deletion
   - Verify smooth animation
   - Test canceling swipe gesture

8. **Test cart summary mobile layout**
   - Scroll to cart summary section
   - Verify summary positioned below items
   - Verify all summary details readable
   - Check price breakdown (subtotal, shipping, tax, total)
   - Verify proper spacing and alignment

9. **Test coupon code input mobile**
   - Locate coupon code field
   - Tap to focus input
   - Enter coupon code on mobile keyboard
   - Tap apply button
   - Verify button is touch-friendly
   - Verify feedback appears

10. **Test checkout button mobile**
    - Scroll to checkout button
    - Verify button is full-width or prominently placed
    - Verify button is large enough (min 48px height)
    - Tap checkout button
    - Verify navigation to checkout page
    - Test sticky checkout button (if implemented)

11. **Test scrolling behavior**
    - Scroll through cart items
    - Verify smooth scrolling on mobile
    - Test rubber-band effect (iOS)
    - Verify no horizontal scroll
    - Test pull-to-refresh (if enabled)

12. **Test sticky elements (if present)**
    - Test sticky header with cart count
    - Test sticky checkout button at bottom
    - Verify sticky elements don't obscure content
    - Test scrolling with sticky elements

13. **Test landscape orientation**
    - Rotate device to landscape
    - Verify layout adjusts appropriately
    - Verify all controls still accessible
    - Test quantity adjustments in landscape

14. **Test performance on mobile**
    - Verify page loads quickly
    - Test with slow 3G connection simulation
    - Verify images load progressively
    - Check for layout shifts during load

### Mobile Viewport Sizes to Test

| Device | Width | Common Models |
|--------|-------|---------------|
| Small Mobile | 375px | iPhone SE, iPhone 12/13 Mini |
| Standard Mobile | 390px | iPhone 12/13/14, Pixel 5 |
| Large Mobile | 414px | iPhone 14 Plus, Samsung Galaxy |
| Tablet | 768px | iPad Mini, small tablets |

### Mobile Layout Structure

```
┌──────────────────────────────┐
│ ← Cart (3)                   │ ← Header
├──────────────────────────────┤
│                              │
│ ┌──────────────────────────┐ │
│ │ [Img] Product A          │ │
│ │ ₨1,000                   │ │
│ │ [−] 2 [+]  ×  ₨2,000     │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [Img] Product B          │ │
│ │ ₨500                     │ │
│ │ [−] 1 [+]  ×  ₨500       │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Order Summary            │ │
│ │ Subtotal:        ₨2,500  │ │
│ │ Shipping:          ₨300  │ │
│ │ ─────────────────────── │ │
│ │ Total:           ₨2,800  │ │
│ └──────────────────────────┘ │
│                              │
│ [    Proceed to Checkout   ] │ ← Full-width button
│                              │
└──────────────────────────────┘
```

### Touch Target Sizes

| Element | Minimum Size | Recommended |
|---------|--------------|-------------|
| Buttons | 44×44px | 48×48px |
| Quantity Controls | 44×44px | 48×48px |
| Remove Button | 44×44px | 48×48px |
| Input Fields | 44px height | 48px height |
| Checkbox/Radio | 44×44px | 48×48px |

### Mobile-Specific Features

| Feature | Behavior |
|---------|----------|
| Numeric Keypad | Opens for quantity input |
| Swipe to Remove | Alternative to remove button |
| Pull to Refresh | Refreshes cart data |
| Sticky Checkout | Button always accessible |
| Tap Highlighting | Visual feedback on tap |

### Scroll Behavior Tests

```
Test Scenarios:
1. Long cart (10+ items)
   └── Verify smooth scrolling

2. Short cart (1-2 items)
   └── Verify no excessive whitespace

3. Scroll to bottom
   └── Verify checkout button accessible

4. Scroll to top
   └── Verify header visible/accessible
```

### Error Handling on Mobile

| Error | Mobile Display |
|-------|----------------|
| Out of stock | Inline alert, not modal |
| API error | Toast at bottom |
| Validation error | Below input field |
| Network error | Banner at top |

### Expected Outcome
- Cart page fully functional on mobile devices
- Single-column layout clear and organized
- All controls touch-friendly and accessible
- Smooth scrolling and navigation
- Checkout easily accessible

### Verification Checklist
- [ ] Tested on iPhone Safari
- [ ] Tested on Android Chrome
- [ ] Single-column layout displays correctly
- [ ] Items stack vertically
- [ ] Cart summary below items (not sidebar)
- [ ] Product images appropriate size
- [ ] Text remains readable
- [ ] Quantity buttons are touch-friendly (44×44px+)
- [ ] Increment button works on touch
- [ ] Decrement button works on touch
- [ ] Number input shows numeric keypad
- [ ] Remove button touch-friendly
- [ ] Swipe-to-remove works (if implemented)
- [ ] Cart summary readable and complete
- [ ] Coupon input functional on mobile
- [ ] Checkout button prominent and accessible
- [ ] Scrolling smooth without horizontal scroll
- [ ] Sticky elements functional (if present)
- [ ] Landscape orientation works
- [ ] Performance acceptable on mobile network
- [ ] No layout shifts during load

---

## Task 96: Test Cart Persistence

### Overview
Thoroughly test cart persistence functionality across various scenarios including page refreshes, browser restarts, tab closures, user login/logout, and device switches. Verify that localStorage persistence works for guest users and API sync maintains cart for authenticated users across devices.

### Dependencies
- Task 91 (Cart persistence and sync complete)
- All persistence mechanisms implemented
- API sync functional

### Instructions

1. **Test localStorage persistence (guest user)**
   - Open site in incognito/private browsing mode
   - Add 3-4 items to cart
   - Note cart contents and quantities
   - Verify cart saved to localStorage

2. **Test cart after page refresh**
   - Refresh the page (F5 or Cmd+R)
   - Wait for page to fully load
   - Verify cart icon shows correct count immediately
   - Open mini cart or cart page
   - Verify all items present with correct quantities
   - Verify totals calculated correctly

3. **Test cart after navigating away and back**
   - Navigate to homepage or product page
   - Browse other pages
   - Return to cart page
   - Verify cart contents unchanged
   - Verify quantities and prices intact

4. **Test cart after browser close and reopen**
   - Close browser completely (all windows)
   - Wait 30 seconds
   - Reopen browser
   - Navigate to site
   - Verify cart restored automatically
   - Verify items and quantities correct

5. **Test cart persistence across tabs**
   - Open site in first tab with items in cart
   - Open same site in second tab
   - Verify cart shows same items in both tabs
   - Add item in first tab
   - Switch to second tab
   - Refresh second tab or check if auto-updates
   - Verify both tabs show updated cart

6. **Test cart persistence with login**
   - As guest, add items to cart (cart A)
   - Log in to existing account
   - Verify guest cart (A) maintained initially
   - If account has saved cart (cart B), verify merge occurs
   - Verify combined cart shows all items
   - Verify quantities summed for duplicates

7. **Test cart persistence after logout**
   - As logged-in user, add items to cart
   - Log out of account
   - Verify cart retained as guest cart
   - Verify items still present
   - Add more items as guest
   - Verify new items added to cart

8. **Test API sync for authenticated users**
   - Log in to account
   - Add items to cart
   - Verify cart syncs to backend
   - Close browser
   - Open browser on different device or in incognito
   - Log in to same account
   - Verify cart loaded from API
   - Verify items match across devices

9. **Test cart after session expiry**
   - Log in and add items to cart
   - Wait for session to expire (or manually expire)
   - Refresh page
   - Verify guest cart retained locally
   - Log in again
   - Verify cart restored or merged

10. **Test cart expiry (if implemented)**
    - Add items to cart
    - Note timestamp
    - Manually advance system time (or wait for expiry)
    - Reload page
    - Verify expired items removed
    - Verify notification shown (if implemented)

11. **Test cart conflict resolution**
    - Device 1: Add Product A (qty 2) to cart
    - Device 2 (same account): Add Product A (qty 3) to cart
    - Device 1: Refresh or make another change
    - Verify conflict handled gracefully
    - Verify most recent or merged cart shown

12. **Test cart migration after updates**
    - Simulate cart schema version change
    - Verify old cart data migrates to new format
    - Verify no data loss during migration
    - Verify cart functions normally after migration

### Persistence Test Matrix

| Scenario | User Type | Action | Expected Result |
|----------|-----------|--------|-----------------|
| Page Refresh | Guest | F5 | Cart restored from localStorage |
| Page Refresh | Logged In | F5 | Cart restored from localStorage + API sync check |
| Browser Close | Guest | Close & Reopen | Cart restored from localStorage |
| Browser Close | Logged In | Close & Reopen | Cart restored from localStorage + API sync |
| Login | Guest → User | Login | Guest cart merged with user cart |
| Logout | User → Guest | Logout | User cart retained as guest cart |
| New Device | Logged In | Login on new device | Cart loaded from API |
| Multiple Tabs | Any | Open multiple tabs | Cart synced across tabs |
| Session Expire | Logged In | Wait/Expire | Cart retained as guest cart |

### Cart Merge Scenarios

```
Scenario 1: Guest cart only
Guest cart: [Product A × 2, Product B × 1]
User cart: []
After login: [Product A × 2, Product B × 1]

Scenario 2: User cart only
Guest cart: []
User cart: [Product C × 3]
After login: [Product C × 3]

Scenario 3: Both carts with different items
Guest cart: [Product A × 2]
User cart: [Product B × 1]
After login: [Product A × 2, Product B × 1]

Scenario 4: Both carts with same item
Guest cart: [Product A × 2]
User cart: [Product A × 3]
After login: [Product A × 5]

Scenario 5: Quantity exceeds stock
Guest cart: [Product A × 5]
User cart: [Product A × 6]
Stock: 8
After login: [Product A × 8] with notification
```

### API Sync Verification

```
Step-by-Step:
1. Log in on Device A
2. Add Product X to cart
3. Check Developer Tools → Network
4. Verify POST/PUT to /api/store/cart
5. Verify response 200 OK
6. Log in on Device B (same account)
7. Load cart page
8. Verify GET from /api/store/cart
9. Verify Product X appears
10. Verify quantities match
```

### localStorage Inspection

```
Browser Developer Tools:
1. Open DevTools (F12)
2. Navigate to Application/Storage tab
3. Expand Local Storage
4. Find key: lcc-cart
5. Verify JSON structure:
   {
     state: {
       items: [...],
       couponCode: "...",
       lastUpdated: "..."
     },
     version: 1
   }
```

### Conflict Resolution Tests

| Conflict Type | Resolution Strategy | Verification |
|---------------|---------------------|--------------|
| Same item, different qty | Sum quantities | Check final qty = sum |
| Local newer timestamp | Use local cart | Verify local items present |
| Server newer timestamp | Use server cart | Verify server items present |
| Network error during sync | Keep local, queue sync | Verify retry occurs |

### Cross-Browser Testing

| Browser | Test Persistence | Test Sync | Notes |
|---------|------------------|-----------|-------|
| Chrome | ✓ | ✓ | Test incognito mode |
| Firefox | ✓ | ✓ | Test private window |
| Safari | ✓ | ✓ | Test iOS Safari |
| Edge | ✓ | ✓ | Test Windows Edge |

### Expected Outcome
- Cart persists reliably across all scenarios
- Guest cart uses localStorage
- Authenticated cart syncs to API
- Cart accessible across devices for logged-in users
- Merge logic works correctly
- No data loss during transitions

### Verification Checklist
- [ ] Cart restored after page refresh
- [ ] Cart restored after browser close/reopen
- [ ] Cart synced across multiple tabs
- [ ] Cart items have correct quantities after restore
- [ ] Totals calculated correctly after restore
- [ ] localStorage contains cart data (inspect DevTools)
- [ ] Guest cart merges with user cart on login
- [ ] Duplicate items have quantities summed
- [ ] Cart retained as guest cart after logout
- [ ] API sync works for authenticated users
- [ ] Cart accessible on different device (same account)
- [ ] Cart persists after session expiry
- [ ] Expired items removed (if expiry enabled)
- [ ] Conflict resolution works correctly
- [ ] Cart migration works (if schema changed)
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Tested on desktop and mobile
- [ ] Network errors handled gracefully
- [ ] Sync status indicators show correctly

---

## Summary

This document established comprehensive testing procedures for the shopping cart functionality. The add to cart flow ensures reliable item additions with proper feedback. Quantity update tests verify controls work correctly with proper constraints. Mini cart tests confirm the dropdown provides quick cart management. Mobile cart tests ensure an optimal experience on touch devices. Cart persistence tests validate localStorage and API sync work reliably across sessions, devices, and authentication states.

### Completed Tasks
1. ✓ Tested add to cart flow from product cards and pages
2. ✓ Tested quantity updates with increment, decrement, and direct input
3. ✓ Tested mini cart dropdown functionality and item management
4. ✓ Tested cart page mobile experience with touch-friendly controls
5. ✓ Tested cart persistence across sessions, devices, and auth states

### Next Steps
All tasks in SubPhase-06 (Shopping Cart) are now complete. Proceed to **SubPhase-07: Checkout Flow** to implement the checkout process including shipping address, payment method selection, order review, and order placement functionality.
