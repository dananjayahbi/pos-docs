# Tasks 61-68: Quantity, Add to Cart & Wishlist

> **Phase:** 08 - Webstore & E-Commerce Platform | **SubPhase:** 03 - Product Catalog Pages  
> **Group:** D - Variant & Cart Actions | **Document:** 02 of 02

---

## Overview

Implement quantity controls, cart actions, and wishlist features for product cards.

### Tasks | Est. Time: 4.3 hours

| # | Task | Time |
|---|------|------|
| 61 | Quantity Selector Component | 35m |
| 62 | Quantity Validation | 30m |
| 63 | Add to Cart Button | 25m |
| 64 | Add to Cart Logic | 50m |
| 65 | Cart Feedback Notifications | 35m |
| 66 | Add to Wishlist Button | 25m |
| 67 | Wishlist Logic | 40m |
| 68 | Verify Integration | 20m |

---

## Task 61: Quantity Selector Component

### Overview
Quantity selector with increment/decrement buttons and manual input.

### Dependencies
- Variant selector (Tasks 53-60)
- Product card (Group B)

### Instructions

1. **Create**: `components/storefront/catalog/ProductCard/QuantitySelector.tsx`
2. **Props**: value, onChange, min (default: 1), max (stock-based), disabled
3. **Input field**: Number type, 60-80px width, center-aligned, no spinner arrows
4. **Decrement button**: Minus icon, left of input, disable at min, 44x44px touch
5. **Increment button**: Plus icon, right of input, disable at max, matching size
6. **Validation**: Numeric only, range (min-max), reset invalid, real-time
7. **Layout**: Horizontal flex, borders, compact design
8. **Keyboard**: Arrow up/down change, number keys input, Tab navigate

### Structure
```
┌───────────────────┐
│ [-]  [5]  [+]    │
└───────────────────┘
  40px 60px 40px = 140px
```

### Props

| Prop | Type | Default |
|------|------|---------|
| value | number | 1 |
| onChange | (qty: number) => void | - |
| min | number | 1 |
| max | number | 99 |
| disabled | boolean | false |

### Button States

| State | Minus | Plus | Input |
|-------|-------|------|-------|
| At min (1) | Disabled | Enabled | Enabled |
| At max | Enabled | Disabled | Enabled |
| Mid-range | Enabled | Enabled | Enabled |
| Disabled | Disabled | Disabled | Disabled |

### Validation

| Rule | Action |
|------|--------|
| value < min | Set to min |
| value > max | Set to max |
| isNaN(value) | Reset to previous |
| Empty on blur | Set to min |

### Expected Outcome
✓ Selector displays correctly  
✓ Buttons increment/decrement  
✓ Manual input validated  
✓ Limits enforced

---

## Task 62: Quantity Validation

### Overview
Comprehensive validation for quantity based on stock, limits, and business rules.

### Dependencies
- Task 61 (Quantity Selector)
- Inventory system

### Instructions

1. **Create utility**: `utils/cart/validateQuantity.ts`
2. **Stock validation**: Check stock, reserved quantities, active cart items
3. **Minimum rules**: Default 1, wholesale 5+, bundle requirements
4. **Maximum limits**: Stock-based, per-customer, per-order, category limits
5. **Validation response**: success, valid quantity, error message, suggested quantity
6. **Business rules**: Wholesale thresholds, bulk discounts, promo limits
7. **Real-time**: Validate on change, re-validate before cart add
8. **Special cases**: Pre-order (unlimited?), made-to-order, digital products

### Function API
```
validateQuantity(
  productId: string,
  variantId: string,
  quantity: number,
  userId?: string
): ValidationResult

{ isValid, validQuantity, maxAllowed, message?, reason? }
```

### Validation Flow
```
User enters: 25
→ Check stock: 15
→ Check per-order limit: 20
→ Check per-customer limit: 50
→ Result: Invalid - only 15 available
→ Set to 15, show message
```

### Validation Checks

| Check | Validation | Error Message |
|-------|------------|---------------|
| Stock | Qty ≤ stock | "Only X available" |
| Minimum | Qty ≥ min | "Minimum order: X" |
| Per-order | Qty ≤ limit | "Max per order: X" |
| Per-customer | Total ≤ limit | "Max per customer: X" |

### Stock Calculation
```
Available: 20
In carts: 5
Reserved: 2
Actually available: 13
User wants: 15 → Valid: 13
```

### Limit Types

| Type | Scope | Example |
|------|-------|---------|
| Stock | Per variant | 15 in stock |
| Order | Per transaction | Max 10/order |
| Customer | Per customer/period | Max 50/month |
| Category | Product category | Max 5 electronics |

### Expected Outcome
✓ Robust validation  
✓ Clear errors  
✓ Auto-correction  
✓ Real-time feedback

---

## Task 63: Add to Cart Button

### Overview
Add to Cart button with loading, success states, and proper styling.

### Dependencies
- Task 61 (Quantity)
- Task 60 (Variants)

### Instructions

1. **Create**: `AddToCartButton.tsx` in ProductCard components
2. **Props**: onClick, disabled, loading, variant (primary/secondary), fullWidth
3. **States**: Default (blue), Hover (darker), Active (pressed), Disabled (gray), Loading (spinner)
4. **Icon**: Shopping cart, left of text, 20x20px, hide on mobile (optional)
5. **Text**: Desktop: "Add to Cart", Mobile: "Add", Loading: "Adding...", Success: "Added!"
6. **Style**: Height 44-48px, full width on mobile, rounded 6-8px, bold
7. **Loading spinner**: Circular, replace icon, animate rotation
8. **Success state**: "Added!" + green checkmark, fade to default after 2s

### Button States
```
Default: [🛒 Add to Cart]
Loading: [⏳ Adding...]
Success: [✓ Added!]
```

### Props

| Prop | Type | Default |
|------|------|---------|
| onClick | () => void | - |
| disabled | boolean | false |
| loading | boolean | false |
| variant | string | "primary" |
| fullWidth | boolean | false |

### Visual States

| State | BG | Text | Cursor |
|-------|----|----|---------|
| Default | Primary blue | White | Pointer |
| Hover | Darker blue | White | Pointer |
| Disabled | Light gray | Dark gray | Not-allowed |
| Loading | Primary blue | White | Wait |
| Success | Green | White | Default |

### Responsive

| Screen | Width | Text |
|--------|-------|------|
| Mobile (< 640px) | Full | "Add" |
| Desktop (> 640px) | Auto | "Add to Cart" |

### Animations

| Animation | Duration |
|-----------|----------|
| Hover scale | 200ms |
| Success fade | 2000ms |
| Spinner rotate | 1000ms loop |

### Expected Outcome
✓ Button displays correctly  
✓ All states work  
✓ Smooth animations  
✓ Responsive

---

## Task 64: Add to Cart Logic

### Overview
Core functionality: validate, API call, update cart state, handle errors.

### Dependencies
- Task 63 (Button)
- Task 62 (Validation)
- Cart API

### Instructions

1. **Create hook**: `hooks/store/useAddToCart.ts`
2. **Parameters**: productId, variantId, quantity, userId, optional metadata
3. **Pre-validation**: Verify variant selected, validate quantity, check stock, confirm product
4. **API integration**: POST to `/api/cart/items`, handle auth, process response
5. **Update cart state**: Optimistic update (immediate UI), actual on success, rollback on fail
6. **Error handling**: Network, validation, out of stock, authentication errors
7. **Success handling**: Update state, show notification, return status
8. **Cart merge**: Merge guest cart on login, handle duplicates, update quantities

### Hook API
```
const { addToCart, isLoading, error } = useAddToCart()

await addToCart({
  productId: "prod_123",
  variantId: "var_456",
  quantity: 2
})
```

### Add to Cart Flow
```
Click Add
→ Validate selections
→ Validate quantity
→ Check stock
→ API call
→ Update cart state
→ Show success
```

### API Request
```
POST /api/cart/items
{
  product_id: "prod_123",
  variant_id: "var_456",
  quantity: 2,
  session_id: "sess_abc"
}
```

### API Response
```
Success: { success: true, cart: {...}, item: {...}, cart_count: 5 }
Error: { success: false, error: "Out of stock", code: "OUT_OF_STOCK" }
```

### Validation Checks

| Check | Error |
|-------|-------|
| Variant required | "Select size/color" |
| Valid quantity | "Invalid quantity" |
| Stock available | "Out of stock" |
| Product exists | "Product not found" |

### Error Handling

| Error | Message | Action |
|-------|---------|--------|
| No variant | "Select size and color" | Focus selector |
| Out of stock | "Out of stock" | Disable button |
| Invalid qty | "Quantity adjusted" | Update qty |
| Network | "Try again" | Retry button |

### Optimistic Updates
```
Before API: Cart 2 → 3 (immediate)
Success: Cart 3 (confirmed)
Failure: Cart 3 → 2 (rollback) + error
```

### Expected Outcome
✓ Smooth add experience  
✓ Proper validation  
✓ Error handling complete  
✓ Cart updates correctly

---

## Task 65: Cart Feedback Notifications

### Overview
User-friendly notifications providing immediate add-to-cart feedback.

### Dependencies
- Task 64 (Add to Cart Logic)
- Toast/notification library

### Instructions

1. **Choose approach**: Toast notification, slide-in preview, mini modal, or combo
2. **Create toast**: `AddToCartToast.tsx` in `components/common/`, auto-dismiss 3-4s
3. **Content**: Product thumbnail, name, quantity added, "View Cart" link
4. **Cart preview**: Slide from right/top, cart summary, quick checkout, auto-close 5s
5. **Animation**: Slide in from corner, fade out, smooth, non-intrusive
6. **Position**: Top-right (desktop), top-center (mobile), above bottom nav
7. **Dismiss**: Auto-timer, manual close button, click outside, swipe (mobile)
8. **Multiple**: Queue notifications, combine similar, update existing, limit visible

### Toast Design
```
┌──────────────────────────┐
│ ✓ Added to cart!    [×] │
│ [IMG] Product Name       │
│       Qty: 2             │
│ [View Cart] [Continue]   │
└──────────────────────────┘
```

### Cart Preview
```
┌────────────────┐
│ Your Cart (3)  │
├────────────────┤
│ [IMG] Item 1   │
│ ₨2,499        │
│ [IMG] Item 2   │
│ ₨1,999        │
├────────────────┤
│ Total: ₨4,498 │
│ [Checkout]     │
└────────────────┘
```

### Notification Types

| Type | Use | Duration |
|------|-----|----------|
| Success toast | Item added | 3-4s |
| Error toast | Failed | 4-5s |
| Cart preview | Success + preview | 5s |
| Update toast | Qty updated | 2-3s |

### Animation

| Animation | Duration | Direction |
|-----------|----------|-----------|
| Slide in | 300ms | From right |
| Fade out | 200ms | Opacity 0 |
| Auto-dismiss | 3000ms | - |

### Positioning

| Screen | Position |
|--------|----------|
| Desktop | Top-right, 20px offset |
| Mobile | Top-center, below header |

### Expected Outcome
✓ Clear feedback  
✓ Non-intrusive  
✓ Professional animations  
✓ Mobile-friendly

---

## Task 66: Add to Wishlist Button

### Overview
Heart icon button for saving products, with animation and toggle functionality.

### Dependencies
- Product card
- Wishlist API

### Instructions

1. **Create**: `WishlistButton.tsx` in ProductCard components
2. **Props**: productId, variantId (optional), isWishlisted, onToggle
3. **Icon**: Heart outline (not wishlisted), filled red heart (wishlisted), 20-24px
4. **Toggle**: Click to add/remove, optimistic UI, loading during API, error rollback
5. **Animation**: Scale up on click, fill animation (outline → filled), smooth transition
6. **Style**: Circular/square, 36-44px touch target, transparent/subtle bg, hover effect
7. **Position**: Top-right corner of card image, absolute, z-index above, visible on hover (desktop)
8. **Accessibility**: Button role, ARIA label ("Add/Remove from wishlist"), keyboard, focus visible

### Button States
```
Not Wishlisted: ♡ (outline)
Wishlisted: ❤ (filled red)
Loading: ⏳
```

### Props

| Prop | Type | Required |
|------|------|----------|
| productId | string | Yes |
| variantId | string | No |
| isWishlisted | boolean | Yes |
| onToggle | () => void | Yes |

### Visual States

| State | Icon | Color | BG |
|-------|------|-------|-----|
| Default | Outline | Gray | Transparent |
| Hover | Outline | Red | Light gray |
| Active | Filled | Red | White |
| Loading | Spinner | Gray | Transparent |

### Animation
```
Click: Scale 1.0 → 1.3 → 1.0 (300ms)
Add: Outline → Filled + Red (200ms)
Remove: Filled → Outline (200ms)
```

### Position on Card
```
┌────────────────────┐
│ [♡]                │ ← Top-right
│   [Product Image]  │
└────────────────────┘
```

### Expected Outcome
✓ Button displays correctly  
✓ Toggle works  
✓ Smooth animation  
✓ Responsive

---

## Task 67: Wishlist Logic

### Overview
Complete wishlist functionality: add/remove, sync with backend, guest support.

### Dependencies
- Task 66 (Wishlist Button)
- Wishlist API

### Instructions

1. **Create hook**: `hooks/store/useWishlist.ts`
2. **Add to wishlist**: `addToWishlist(productId, variantId?)`, POST `/api/wishlist/items`, optimistic update
3. **Remove**: `removeFromWishlist(itemId)`, DELETE `/api/wishlist/items/{id}`, optimistic removal, undo option
4. **State**: Array of items, loading, errors, total count
5. **Guest support**: Store in localStorage, sync on login, merge with user wishlist, persist 90 days
6. **Check function**: `isWishlisted(productId)` returns boolean for button state
7. **Batch ops**: Add/remove multiple, move to cart (all/selected), clear wishlist
8. **Sync**: On app load, login/logout, background sync, conflict resolution

### Hook API
```
const {
  wishlist,
  wishlistCount,
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
  moveToCart
} = useWishlist()
```

### Add Flow
```
Click heart
→ Check auth
→ Optimistic add
→ API: POST /api/wishlist
→ Success: keep | Failure: rollback
→ Show feedback
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/wishlist | GET | Fetch all |
| /api/wishlist/items | POST | Add item |
| /api/wishlist/items/{id} | DELETE | Remove |
| /api/wishlist/sync | POST | Sync guest |

### Guest vs User

| Feature | Guest | User |
|---------|-------|------|
| Storage | localStorage | Database |
| Persistence | 90 days | Permanent |
| Sync | On login | Real-time |
| Cross-device | No | Yes |

### Sync on Login
```
Guest: [A, B, C]
User: [B, D]
Merged: [A, B, C, D] (duplicates removed)
```

### Optimistic Updates
```
Add: Update state → API call → Keep on success, rollback on error
Remove: Remove from state → API → Re-add on error
```

### Expected Outcome
✓ Complete wishlist functionality  
✓ Smooth add/remove  
✓ Guest and user support  
✓ Cross-device sync

---

## Task 68: Verify Cart & Wishlist Integration

### Overview
Comprehensive testing of all cart and wishlist features.

### Dependencies
- Tasks 61-67 (All features)

### Instructions

1. **Add to cart flow**: Select variant → set quantity → add → verify notification → check cart count & contents
2. **Quantity validation**: Try invalid, min, max, stock checks, verify error messages
3. **Wishlist**: Add → remove → check persistence → test guest → test logged-in
4. **Errors**: Network failure, API errors, out of stock, invalid selections, concurrent mods
5. **Persistence**: Refresh page, navigate away/back, login/logout, cross-device (logged in)
6. **Mobile**: Touch interactions, button sizes, notification placement, responsive layouts
7. **Performance**: Button response < 100ms, API < 500ms, animation 60 FPS
8. **Accessibility**: Keyboard nav, screen reader, focus management, ARIA labels

### Test Scenarios

| Scenario | Expected |
|----------|----------|
| Select → Add | Item in cart, notification |
| No variant → Add | Error message |
| Change qty → Add | Correct qty in cart |
| Click heart | Item wishlisted |
| Guest → Login | Cart/wishlist preserved |

### Cart Tests

| Test | Expected |
|------|----------|
| Valid add (M + Blue + 2) | Success |
| No variant selected | "Select variant" error |
| Qty 100 (stock 10) | Adjusted to 10 |
| Add same twice | Quantity increased |

### Wishlist Tests

| Test | Expected |
|------|----------|
| Add item | Heart filled |
| Remove | Heart outline |
| Page reload | State preserved |
| Guest → Login | Items merged |

### Performance

| Metric | Target |
|--------|--------|
| Button response | < 100ms |
| API call | < 500ms |
| Animation | 60 FPS |

### Accessibility

| Test | Expected |
|------|----------|
| Tab through | All reachable |
| Screen reader | Proper labels |
| Focus visible | Clear rings |

### Expected Outcome
✓ All features working  
✓ Smooth UX  
✓ No errors  
✓ Accessible  
✓ Performant  
✓ Mobile-friendly

---

## Summary

### Components Created
- Quantity Selector
- Add to Cart Button
- Cart Notifications
- Wishlist Button

### Logic Implemented
- Quantity validation
- Cart functionality
- Wishlist management
- State synchronization

### Key Features
- Flexible quantity selection
- Real-time validation
- Optimistic UI updates
- Guest and user support
- Cross-device sync
- Error handling
- Success feedback

**Completion:** Group D (Variant & Cart Actions) complete. Continue to Group E (Category & Collection Pages).
