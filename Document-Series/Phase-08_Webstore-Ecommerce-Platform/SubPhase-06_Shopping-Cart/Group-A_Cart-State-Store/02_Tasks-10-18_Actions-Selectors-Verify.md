# Tasks 10-18: Cart Actions, Selectors, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** A - Cart State & Store  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_Route-Store-Actions.md](01_Tasks-01-09_Route-Store-Actions.md)

---

## Document Overview

This document covers the remaining cart store actions, computed selectors for cart calculations, variant key generation utility, cart context provider setup, and comprehensive verification of all cart functionality. It completes the cart state management system with remove, update, and clear actions, implements total/subtotal/count selectors, creates the variant key generator, and establishes the cart context provider.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create Remove from Cart Action | Low | 15 min |
| 11 | Create Update Quantity Action | Low | 20 min |
| 12 | Create Clear Cart Action | Low | 10 min |
| 13 | Create Cart Total Selector | Medium | 25 min |
| 14 | Create Cart Item Count Selector | Low | 15 min |
| 15 | Create Cart Subtotal Selector | Low | 15 min |
| 16 | Create Variant Key Generator | Low | 20 min |
| 17 | Create Cart Context Provider | Low | 25 min |
| 18 | Verify Cart Store | Low | 30 min |

---

## Task 10: Create Remove from Cart Action

### Overview
Implement the removeItem action that removes a specific item from the cart. This action filters the items array to exclude the specified item and updates the cart state accordingly.

### Dependencies
- Task 06: Create Cart Store
- Task 09: Create Add to Cart Action

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Locate the placeholder removeItem method
   - Prepare to implement removal logic

2. **Define action signature**
   - Accept cart item ID as parameter
   - Use string type for ID
   - Return void (updates state directly)

3. **Implement item removal logic**
   - Use array filter to remove item
   - Match by cart item ID
   - Maintain immutability

4. **Update store state**
   - Use Zustand set function
   - Update items array with filtered result
   - Clear any existing errors
   - Keep other state unchanged

5. **Add confirmation logic (optional)**
   - Consider showing confirmation dialog
   - Prevent accidental removals
   - Add undo functionality (advanced)

6. **Handle edge cases**
   - Item ID doesn't exist (fail silently)
   - Empty cart after removal
   - Last item removal

7. **Add success feedback (optional)**
   - Show toast notification
   - Log removal in development
   - Track analytics event

### Action Signature

```typescript
removeItem: (itemId: string) => void
```

### Removal Logic Flow

```
1. Receive cart item ID
   │
   ├─→ 2. Filter items array
   │      │
   │      └─→ Exclude item with matching ID
   │
   ├─→ 3. Update store state
   │
   └─→ 4. Clear errors
```

### State Update Pattern

```typescript
set((state) => ({
  items: state.items.filter(item => item.id !== itemId),
  error: null
}))
```

### Edge Cases

| Case | Behavior | Result |
|------|----------|--------|
| Item exists | Remove from array | Item removed |
| Item doesn't exist | No change | Silent failure |
| Last item | Remove item | Empty cart |
| Invalid ID | No change | Silent failure |

### Removal Scenarios

| Before | Action | After |
|--------|--------|-------|
| [A, B, C] | Remove B | [A, C] |
| [A] | Remove A | [] (empty) |
| [A, B] | Remove C | [A, B] (no change) |

### Success Indicators

| Indicator | Type | Description |
|-----------|------|-------------|
| State update | items array | Item removed |
| No error | error = null | No issues |
| Toast | UI notification | "Item removed" |

### Expected Outcome
- Functional remove from cart action
- Item removed from items array
- State updated immutably
- Error state cleared

### Verification Checklist
- [ ] removeItem action implemented
- [ ] Accepts itemId parameter (string)
- [ ] Uses filter to remove item
- [ ] State updated immutably
- [ ] Error cleared on success
- [ ] Edge cases handled (non-existent ID)
- [ ] TypeScript types satisfied

---

## Task 11: Create Update Quantity Action

### Overview
Implement the updateQuantity action that changes the quantity of a specific cart item. This action includes validation against minimum and maximum quantity constraints and updates the item's timestamp.

### Dependencies
- Task 06: Create Cart Store
- Task 09: Create Add to Cart Action

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Locate the placeholder updateQuantity method
   - Prepare to implement update logic

2. **Define action signature**
   - Accept cart item ID as first parameter
   - Accept new quantity as second parameter
   - Use proper TypeScript types
   - Return void

3. **Find target item**
   - Search items array for matching ID
   - Get item reference
   - Handle item not found scenario

4. **Validate new quantity**
   - Check against minQuantity constraint (usually 1)
   - Check against maxQuantity constraint (stock limit)
   - Set error if validation fails
   - Return early if invalid

5. **Handle special cases**
   - If quantity is 0, remove item instead
   - If quantity exceeds max, set to max (or show error)
   - If quantity below min, set to min (or show error)

6. **Update item quantity**
   - Map over items array
   - Update matching item
   - Set new quantity
   - Update updatedAt timestamp

7. **Update store state**
   - Use Zustand set function
   - Update items array immutably
   - Clear errors on success
   - Set error on validation failure

8. **Add feedback (optional)**
   - Show toast for validation errors
   - Log changes in development
   - Track analytics

### Action Signature

```typescript
updateQuantity: (itemId: string, quantity: number) => void
```

### Update Logic Flow

```
1. Receive item ID and new quantity
   │
   ├─→ 2. Find item in cart
   │      │
   │      └─→ Item not found → Return/Error
   │
   ├─→ 3. Validate quantity
   │      │
   │      ├─→ quantity = 0 → Remove item
   │      ├─→ quantity < minQuantity → Set error
   │      └─→ quantity > maxQuantity → Set error
   │
   ├─→ 4. Update item quantity
   │      │
   │      └─→ Update updatedAt timestamp
   │
   └─→ 5. Update store state
```

### Quantity Validation

| Condition | Action | Error Message |
|-----------|--------|---------------|
| quantity = 0 | Remove item | None (call removeItem) |
| quantity < 1 | Set error | "Quantity must be at least 1" |
| quantity > max | Set error | "Only X items available" |
| Valid range | Update quantity | None |

### State Update Pattern

```typescript
set((state) => {
  const item = state.items.find(i => i.id === itemId)
  
  if (!item) {
    return { error: 'Item not found' }
  }
  
  if (quantity === 0) {
    // Remove item
    return {
      items: state.items.filter(i => i.id !== itemId),
      error: null
    }
  }
  
  if (quantity > item.maxQuantity) {
    return {
      error: `Only ${item.maxQuantity} items available`
    }
  }
  
  return {
    items: state.items.map(i =>
      i.id === itemId
        ? { ...i, quantity, updatedAt: new Date().toISOString() }
        : i
    ),
    error: null
  }
})
```

### Special Quantity Cases

| Quantity | Action | Behavior |
|----------|--------|----------|
| 0 | Remove | Call removeItem action |
| Negative | Error | Reject with error |
| Decimal | Round | Round to nearest integer |
| > Max | Error/Cap | Show error or cap to max |

### Validation Rules

| Rule | Condition | Result |
|------|-----------|--------|
| Min quantity | qty ≥ minQuantity | Pass |
| Max quantity | qty ≤ maxQuantity | Pass |
| Zero quantity | qty = 0 | Remove item |
| Positive | qty > 0 | Valid |

### Update Examples

| Before | Action | After | Notes |
|--------|--------|-------|-------|
| qty: 2 | Update(3) | qty: 3 | Normal update |
| qty: 5 | Update(0) | Removed | Remove item |
| qty: 3 | Update(20) | Error | Exceeds stock (max: 10) |
| qty: 1 | Update(-1) | Error | Invalid quantity |

### Expected Outcome
- Functional update quantity action
- Quantity validation against constraints
- Special handling for zero quantity
- Immutable state updates

### Verification Checklist
- [ ] updateQuantity action implemented
- [ ] Accepts itemId and quantity parameters
- [ ] Finds item in cart
- [ ] Validates against minQuantity
- [ ] Validates against maxQuantity
- [ ] Handles quantity = 0 (removes item)
- [ ] Updates updatedAt timestamp
- [ ] State updated immutably
- [ ] Error set on validation failure
- [ ] TypeScript types satisfied

---

## Task 12: Create Clear Cart Action

### Overview
Implement the clearCart action that removes all items from the cart and resets related state. This action is typically used after checkout completion or when the user explicitly wants to empty their cart.

### Dependencies
- Task 06: Create Cart Store

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Locate the placeholder clearCart method
   - Prepare to implement clear logic

2. **Define action signature**
   - No parameters required
   - Return void
   - Simple state reset

3. **Reset cart state**
   - Set items to empty array
   - Set coupon to null
   - Clear any errors
   - Reset loading state

4. **Add confirmation (optional)**
   - Consider confirmation dialog
   - Prevent accidental clears
   - Skip confirmation after checkout

5. **Update store state**
   - Use Zustand set function
   - Reset to initial state
   - Maintain type safety

6. **Handle persist middleware**
   - Ensure localStorage clears
   - Persist middleware handles automatically
   - Verify empty state persists

7. **Add feedback (optional)**
   - Show toast notification
   - Log in development
   - Track analytics event

### Action Signature

```typescript
clearCart: () => void
```

### Clear Logic Flow

```
1. Clear cart called
   │
   ├─→ 2. (Optional) Show confirmation
   │      │
   │      ├─→ Confirmed → Continue
   │      └─→ Cancelled → Return
   │
   ├─→ 3. Reset state
   │      │
   │      ├─→ items = []
   │      ├─→ coupon = null
   │      ├─→ error = null
   │      └─→ isLoading = false
   │
   └─→ 4. Update store
         │
         └─→ Persist to localStorage
```

### State Reset

```typescript
set({
  items: [],
  coupon: null,
  error: null,
  isLoading: false
})
```

### State Before/After Clear

| Property | Before | After |
|----------|--------|-------|
| items | [A, B, C] | [] |
| coupon | { code: "SAVE10" } | null |
| error | null | null |
| isLoading | false | false |

### Use Cases

| Scenario | Trigger | Result |
|----------|---------|--------|
| After checkout | Automatic | Cart cleared |
| User request | Manual | Cart emptied |
| Session expired | Automatic | Cart reset |
| New session | On mount | Fresh cart |

### Confirmation Dialog (Optional)

| Element | Content | Action |
|---------|---------|--------|
| Title | "Clear Cart?" | Display question |
| Message | "Remove all items?" | Explain action |
| Confirm | "Clear" | Execute clearCart |
| Cancel | "Cancel" | Abort action |

### Expected Outcome
- Functional clear cart action
- All items removed
- Coupon removed
- State reset to initial values

### Verification Checklist
- [ ] clearCart action implemented
- [ ] Takes no parameters
- [ ] Sets items to empty array []
- [ ] Sets coupon to null
- [ ] Clears error state
- [ ] State updated correctly
- [ ] Persist middleware works (localStorage cleared)
- [ ] TypeScript types satisfied

---

## Task 13: Create Cart Total Selector

### Overview
Implement a computed selector that calculates the final cart total including all items, applied discounts from coupons, and any additional fees. This selector provides the total amount the customer needs to pay.

### Dependencies
- Task 06: Create Cart Store
- Task 08: Create Cart State Type
- Task 09: Create Add to Cart Action

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Add selector method to store
   - Use proper TypeScript return type

2. **Define selector signature**
   - Method name: getTotal
   - No parameters (accesses store state)
   - Returns number (total in LKR)

3. **Calculate items subtotal**
   - Iterate through all items
   - Multiply price × quantity for each
   - Sum all line totals
   - Store intermediate result

4. **Calculate coupon discount**
   - Check if coupon is applied
   - Calculate discount based on type
   - Apply percentage or fixed discount
   - Consider minimum order amount
   - Apply maximum discount cap

5. **Handle coupon types**
   - Percentage: subtotal × (value / 100)
   - Fixed: value (in LKR)
   - Validate min order amount
   - Cap discount to maxDiscount

6. **Calculate final total**
   - Start with subtotal
   - Subtract coupon discount
   - Add shipping (future implementation)
   - Add tax (future implementation)
   - Ensure total ≥ 0

7. **Implement as selector method**
   - Access state via store
   - Perform calculations
   - Return final total
   - Cache if needed for performance

8. **Add number formatting**
   - Round to 2 decimal places
   - Handle currency precision
   - Prevent negative totals

### Selector Signature

```typescript
getTotal: () => number
```

### Total Calculation Flow

```
1. Get all items from state
   │
   ├─→ 2. Calculate subtotal
   │      │
   │      └─→ Sum(price × quantity) for all items
   │
   ├─→ 3. Get coupon from state
   │      │
   │      ├─→ No coupon → discount = 0
   │      │
   │      └─→ Has coupon
   │          │
   │          ├─→ Check min order amount
   │          │
   │          ├─→ Calculate discount (percentage or fixed)
   │          │
   │          └─→ Apply max discount cap
   │
   ├─→ 4. Calculate total
   │      │
   │      └─→ subtotal - discount
   │
   └─→ 5. Return total (rounded)
```

### Subtotal Calculation

```typescript
const subtotal = items.reduce((sum, item) => {
  return sum + (item.price * item.quantity)
}, 0)
```

### Coupon Discount Calculation

| Coupon Type | Formula | Example |
|-------------|---------|---------|
| Percentage | subtotal × (value / 100) | ₨10,000 × 25% = ₨2,500 |
| Fixed | value | ₨500 flat |
| With Min | Only if subtotal ≥ min | ₨5,000 minimum |
| With Cap | min(calculated, max) | Cap at ₨2,000 |

### Percentage Discount Logic

```typescript
if (coupon.type === 'percentage') {
  let discount = subtotal * (coupon.value / 100)
  
  // Apply maximum discount cap
  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount)
  }
  
  return discount
}
```

### Fixed Discount Logic

```typescript
if (coupon.type === 'fixed') {
  return coupon.value
}
```

### Minimum Order Validation

```typescript
if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
  // Coupon not applicable
  return 0
}
```

### Complete Calculation Example

| Component | Amount | Notes |
|-----------|--------|-------|
| Item 1 | ₨1,500 × 2 = ₨3,000 | T-shirt |
| Item 2 | ₨2,500 × 1 = ₨2,500 | Jeans |
| Item 3 | ₨800 × 3 = ₨2,400 | Socks |
| **Subtotal** | **₨7,900** | Sum of items |
| Coupon (10%) | -₨790 | Discount |
| **Total** | **₨7,110** | Final amount |

### Total Calculation Examples

| Subtotal | Coupon | Discount | Total |
|----------|--------|----------|-------|
| ₨10,000 | 10% off | ₨1,000 | ₨9,000 |
| ₨5,000 | ₨500 off | ₨500 | ₨4,500 |
| ₨3,000 | 25% (min ₨5,000) | ₨0 | ₨3,000 |
| ₨15,000 | 20% (max ₨2,000) | ₨2,000 | ₨13,000 |

### Implementation Pattern

```typescript
getTotal: () => {
  const { items, coupon } = get()
  
  // Calculate subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )
  
  // Calculate discount
  let discount = 0
  if (coupon) {
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      discount = 0
    } else if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.value / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
    } else {
      discount = coupon.value
    }
  }
  
  // Calculate total
  const total = Math.max(0, subtotal - discount)
  
  return Math.round(total * 100) / 100
}
```

### Edge Cases

| Case | Behavior | Result |
|------|----------|--------|
| Empty cart | Subtotal = 0 | Total = 0 |
| No coupon | Discount = 0 | Total = subtotal |
| Discount > subtotal | Cap at subtotal | Total = 0 |
| Negative total | Return 0 | Total = 0 |

### Expected Outcome
- Functional total selector
- Accurate calculations including discounts
- Proper coupon validation
- Type-safe implementation

### Verification Checklist
- [ ] getTotal selector implemented
- [ ] Calculates subtotal correctly
- [ ] Handles percentage coupons
- [ ] Handles fixed amount coupons
- [ ] Validates minimum order amount
- [ ] Applies maximum discount cap
- [ ] Returns number (LKR)
- [ ] Rounds to 2 decimal places
- [ ] Handles empty cart (returns 0)
- [ ] TypeScript types satisfied

---

## Task 14: Create Cart Item Count Selector

### Overview
Implement a computed selector that returns the total number of items in the cart. This can calculate either the count of unique items (number of different products) or the total quantity (sum of all quantities).

### Dependencies
- Task 06: Create Cart Store

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Add selector method to store
   - Use proper TypeScript return type

2. **Define selector signature**
   - Method name: getItemCount
   - No parameters
   - Returns number

3. **Decide count type**
   - Option A: Unique items count (items.length)
   - Option B: Total quantity (sum of quantities)
   - Choose based on requirements
   - Document choice clearly

4. **Implement unique items count**
   - Return items array length
   - Simple and straightforward
   - Use: "3 items in cart"

5. **OR implement total quantity count**
   - Sum all item quantities
   - Use reduce to accumulate
   - Use: "5 units in cart"

6. **Consider creating both selectors**
   - getItemCount: unique items
   - getTotalQuantity: total units
   - Provide both options
   - Use appropriately in UI

7. **Add to store interface**
   - Export selector method
   - Ensure proper typing
   - Document purpose

### Selector Signatures

```typescript
// Option A: Unique items count
getItemCount: () => number

// Option B: Total quantity
getTotalQuantity: () => number

// Both (recommended)
getItemCount: () => number       // Unique items
getTotalQuantity: () => number   // Total units
```

### Unique Items Count

```typescript
getItemCount: () => {
  const { items } = get()
  return items.length
}
```

### Total Quantity Count

```typescript
getTotalQuantity: () => {
  const { items } = get()
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
```

### Count Type Comparison

| Type | Calculation | Example Cart | Result |
|------|-------------|--------------|--------|
| Unique Items | items.length | [A×2, B×1, C×3] | 3 items |
| Total Quantity | Σ quantities | [A×2, B×1, C×3] | 6 units |

### Use Cases

| UI Element | Count Type | Display |
|------------|------------|---------|
| Cart badge | Total quantity | "5" |
| Cart header | Unique items | "3 items" |
| Mini cart | Both | "3 items (5 units)" |
| Summary | Unique items | "3 products" |

### Count Examples

| Cart State | Unique Count | Quantity Count |
|------------|--------------|----------------|
| [] | 0 | 0 |
| [A×1] | 1 | 1 |
| [A×2, B×3] | 2 | 5 |
| [A×1, B×1, C×1] | 3 | 3 |
| [A×5, B×2, C×10] | 3 | 17 |

### Implementation (Both Selectors)

```typescript
getItemCount: () => {
  const { items } = get()
  return items.length
},

getTotalQuantity: () => {
  const { items } = get()
  return items.reduce((total, item) => total + item.quantity, 0)
}
```

### Display Formatting

| Selector | Format | Example |
|----------|--------|---------|
| getItemCount | "X items" | "3 items in cart" |
| getTotalQuantity | "X units" | "5 units total" |
| Combined | "X items (Y units)" | "3 items (5 units)" |

### Expected Outcome
- Functional item count selector(s)
- Clear understanding of count type
- Proper calculation implementation
- Type-safe returns

### Verification Checklist
- [ ] getItemCount selector implemented
- [ ] Returns correct count
- [ ] Works with empty cart (returns 0)
- [ ] OR getTotalQuantity implemented
- [ ] Sums quantities correctly
- [ ] OR both selectors implemented
- [ ] TypeScript types satisfied
- [ ] Purpose documented clearly

---

## Task 15: Create Cart Subtotal Selector

### Overview
Implement a computed selector that calculates the cart subtotal (total before discounts). This provides the base amount before any coupons or discounts are applied, useful for displaying in cart summaries.

### Dependencies
- Task 13: Create Cart Total Selector

### Instructions

1. **Open cartStore.ts file**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Add selector method to store
   - Use proper TypeScript return type

2. **Define selector signature**
   - Method name: getSubtotal
   - No parameters
   - Returns number (amount in LKR)

3. **Calculate items subtotal**
   - Iterate through all cart items
   - Multiply price × quantity for each item
   - Sum all line totals
   - Return total amount

4. **Implement calculation**
   - Use array reduce method
   - Accumulate line totals
   - Start with 0 as initial value
   - Return final sum

5. **Handle empty cart**
   - Return 0 for empty cart
   - No error on empty array
   - Reduce handles this automatically

6. **Add number formatting**
   - Round to 2 decimal places
   - Handle currency precision
   - Consistent with other selectors

7. **Consider using in getTotal**
   - Avoid duplicate calculation
   - Call getSubtotal from getTotal
   - DRY principle
   - Maintain consistency

### Selector Signature

```typescript
getSubtotal: () => number
```

### Subtotal Calculation

```typescript
getSubtotal: () => {
  const { items } = get()
  
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
  
  return Math.round(subtotal * 100) / 100
}
```

### Calculation Flow

```
1. Get items from state
   │
   ├─→ 2. For each item
   │      │
   │      ├─→ Calculate line total (price × quantity)
   │      │
   │      └─→ Add to running sum
   │
   ├─→ 3. Return total sum
   │
   └─→ 4. Round to 2 decimals
```

### Line Total Calculation

| Item | Price | Quantity | Line Total |
|------|-------|----------|------------|
| T-Shirt | ₨1,500 | × 2 | ₨3,000 |
| Jeans | ₨2,500 | × 1 | ₨2,500 |
| Socks | ₨400 | × 3 | ₨1,200 |
| **Subtotal** | | | **₨6,700** |

### Subtotal Examples

| Cart Contents | Calculation | Subtotal |
|---------------|-------------|----------|
| [] | 0 | ₨0 |
| [A: ₨1,000 × 1] | 1,000 × 1 | ₨1,000 |
| [A: ₨500 × 2, B: ₨750 × 3] | (500×2) + (750×3) | ₨3,250 |
| [A: ₨1,200 × 4] | 1,200 × 4 | ₨4,800 |

### Using Subtotal in Total Calculation

```typescript
getTotal: () => {
  const { coupon } = get()
  
  // Use subtotal selector
  const subtotal = get().getSubtotal()
  
  // Calculate discount
  let discount = 0
  if (coupon) {
    // ... discount logic
  }
  
  return Math.max(0, subtotal - discount)
}
```

### Subtotal vs Total

| Property | Calculation | Includes Discount |
|----------|-------------|-------------------|
| Subtotal | Sum of items | No |
| Total | Subtotal - discount | Yes |

### Display Usage

| UI Element | Shows | Format |
|------------|-------|--------|
| Cart summary | Subtotal | "Subtotal: ₨6,700" |
| Discount line | Subtotal (reference) | "10% off ₨6,700" |
| Total line | Total | "Total: ₨6,030" |

### Expected Outcome
- Functional subtotal selector
- Accurate line total calculations
- Proper summation of all items
- Type-safe implementation

### Verification Checklist
- [ ] getSubtotal selector implemented
- [ ] Calculates line totals correctly (price × quantity)
- [ ] Sums all line totals
- [ ] Returns number (LKR)
- [ ] Rounds to 2 decimal places
- [ ] Handles empty cart (returns 0)
- [ ] Used in getTotal selector
- [ ] TypeScript types satisfied

---

## Task 16: Create Variant Key Generator

### Overview
Create a utility function that generates unique keys for cart items based on product ID and variant attributes. This key is used to identify duplicate items in the cart when the same product with the same variant is added multiple times.

### Dependencies
- Task 07: Create CartItem Type

### Instructions

1. **Create utilities directory**
   - Navigate to `frontend/lib/` or `frontend/utils/`
   - Create `storefront` subdirectory if needed
   - Location: `frontend/lib/storefront/`

2. **Create cart utility file**
   - Create file named `cartUtils.ts`
   - This file houses cart-related utilities
   - Export all utility functions

3. **Define function signature**
   - Function name: `generateVariantKey`
   - Parameters: productId, variant selection
   - Returns: string (unique key)

4. **Import required types**
   - Import VariantSelection type
   - Import any other needed types
   - Ensure type safety

5. **Implement key generation logic**
   - Start with product ID
   - Add variant attributes (size, color, etc.)
   - Sort attributes for consistency
   - Join with delimiter (e.g., "-")

6. **Handle variant attributes**
   - Extract size, color, material, etc.
   - Filter out undefined values
   - Sort alphabetically for consistency
   - Create deterministic key

7. **Ensure uniqueness**
   - Same product + variant = same key
   - Different variants = different keys
   - Order-independent (sorted attributes)
   - No collisions

8. **Add helper functions**
   - parseVariantKey: Extract components from key
   - compareVariants: Check if variants match
   - Export all utilities

9. **Add documentation**
   - JSDoc comments
   - Explain key format
   - Provide usage examples

### Function Signature

```typescript
export function generateVariantKey(
  productId: string,
  variant: VariantSelection
): string
```

### Key Generation Logic

```typescript
export function generateVariantKey(
  productId: string,
  variant: VariantSelection
): string {
  // Extract and sort variant attributes
  const attributes = Object.entries(variant)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|')
  
  // Generate key
  return attributes
    ? `${productId}|${attributes}`
    : productId
}
```

### Key Format

```
productId|attribute1:value1|attribute2:value2
```

### Key Generation Flow

```
1. Receive productId and variant
   │
   ├─→ 2. Extract variant attributes
   │      │
   │      └─→ Filter out undefined/null values
   │
   ├─→ 3. Sort attributes alphabetically
   │      │
   │      └─→ Ensure consistent ordering
   │
   ├─→ 4. Format attributes
   │      │
   │      └─→ key:value pairs
   │
   ├─→ 5. Join with delimiter
   │      │
   │      └─→ productId|attr1:val1|attr2:val2
   │
   └─→ 6. Return unique key
```

### Key Examples

| Product ID | Variant | Generated Key |
|------------|---------|---------------|
| prod_123 | { size: "M", color: "Red" } | `prod_123\|color:Red\|size:M` |
| prod_123 | { size: "L", color: "Red" } | `prod_123\|color:Red\|size:L` |
| prod_123 | { size: "M", color: "Blue" } | `prod_123\|color:Blue\|size:M` |
| prod_456 | { size: "M" } | `prod_456\|size:M` |
| prod_789 | {} | `prod_789` |

### Uniqueness Examples

| Scenario | Same Key? | Behavior |
|----------|-----------|----------|
| Same product, same variant | ✓ | Increase quantity |
| Same product, different size | ✗ | Add as new item |
| Same product, different color | ✗ | Add as new item |
| Different products | ✗ | Add as new item |

### Attribute Sorting Importance

| Input Order | Without Sort | With Sort | Consistent? |
|-------------|--------------|-----------|-------------|
| size:M, color:Red | prod\|size:M\|color:Red | prod\|color:Red\|size:M | ✓ |
| color:Red, size:M | prod\|color:Red\|size:M | prod\|color:Red\|size:M | ✓ |

### Helper Functions

```typescript
// Parse variant key into components
export function parseVariantKey(key: string): {
  productId: string
  variant: VariantSelection
} {
  const parts = key.split('|')
  const productId = parts[0]
  const variant: VariantSelection = {}
  
  parts.slice(1).forEach(attr => {
    const [key, value] = attr.split(':')
    variant[key] = value
  })
  
  return { productId, variant }
}

// Compare two variants for equality
export function compareVariants(
  variant1: VariantSelection,
  variant2: VariantSelection
): boolean {
  const key1 = generateVariantKey('_', variant1)
  const key2 = generateVariantKey('_', variant2)
  return key1 === key2
}
```

### Usage in Cart Store

```typescript
// In addItem action
const variantKey = generateVariantKey(productId, variant)
const existingItem = items.find(item => 
  generateVariantKey(item.productId, item.variant) === variantKey
)
```

### Edge Cases

| Case | Behavior | Result |
|------|----------|--------|
| No variant | Use product ID only | `prod_123` |
| Empty variant {} | Use product ID only | `prod_123` |
| Null values | Filter out | Ignored |
| Undefined values | Filter out | Ignored |

### Expected Outcome
- Utility function for variant key generation
- Consistent, unique keys for cart items
- Proper handling of variant attributes
- Helper functions for key operations

### Verification Checklist
- [ ] `frontend/lib/storefront/cartUtils.ts` file created
- [ ] generateVariantKey function implemented
- [ ] Accepts productId and variant parameters
- [ ] Returns string key
- [ ] Attributes sorted alphabetically
- [ ] Filters out null/undefined values
- [ ] Same inputs produce same keys
- [ ] Different variants produce different keys
- [ ] parseVariantKey helper implemented (optional)
- [ ] JSDoc comments added
- [ ] Function exported properly
- [ ] TypeScript types satisfied

---

## Task 17: Create Cart Context Provider

### Overview
Create a React Context Provider that wraps the cart store and provides cart state and actions to the component tree. This provider initializes the cart on mount, handles hydration from localStorage, and makes cart functionality available throughout the application.

### Dependencies
- Task 06: Create Cart Store

### Instructions

1. **Create providers directory**
   - Navigate to `frontend/providers/` or `frontend/components/providers/`
   - Create directory if not exists
   - Location: `frontend/providers/`

2. **Create CartProvider file**
   - Create file named `CartProvider.tsx`
   - This is a React component
   - Uses client-side hooks

3. **Add use client directive**
   - Add `'use client'` at top of file
   - Required for Next.js App Router
   - Enables client-side hooks

4. **Import dependencies**
   - Import React, ReactNode, useEffect
   - Import useCartStore hook
   - Import any initialization utilities

5. **Define provider props interface**
   - Accept children (ReactNode)
   - Accept optional initialData
   - Proper TypeScript typing

6. **Create provider component**
   - Function name: CartProvider
   - Accept children prop
   - Return JSX wrapper

7. **Initialize cart on mount**
   - Use useEffect hook
   - Run on component mount
   - Check for persisted data
   - Validate and hydrate store

8. **Handle hydration**
   - Load cart from localStorage
   - Validate stored data structure
   - Update store if needed
   - Handle migration/versioning

9. **Provide context value**
   - Create context with store access
   - Wrap children with provider
   - Make store available to tree

10. **Add error boundary (optional)**
    - Wrap in error boundary
    - Handle initialization errors
    - Provide fallback UI
    - Log errors for debugging

11. **Export provider and hook**
    - Export CartProvider component
    - Export useCart hook (optional)
    - Export context if needed

### Provider Component Structure

```typescript
'use client'

import { ReactNode, useEffect } from 'react'
import { useCartStore } from '@/stores/storefront/cartStore'

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  // Initialize cart on mount
  useEffect(() => {
    // Initialization logic
  }, [])
  
  return <>{children}</>
}
```

### Initialization Logic

```typescript
useEffect(() => {
  // Cart automatically loads from localStorage via persist middleware
  // Optional: Validate cart items, check stock, etc.
  
  const validateCart = async () => {
    const { items } = useCartStore.getState()
    
    // Validate each item
    for (const item of items) {
      // Check if product still exists
      // Check if variant still available
      // Validate prices, stock, etc.
    }
  }
  
  validateCart()
}, [])
```

### Provider Usage

```typescript
// In app/layout.tsx or app/(storefront)/layout.tsx

import { CartProvider } from '@/providers/CartProvider'

export default function Layout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
```

### Custom Hook (Optional)

```typescript
export function useCart() {
  const store = useCartStore()
  
  return {
    // State
    items: store.items,
    itemCount: store.getItemCount(),
    total: store.getTotal(),
    
    // Actions
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}
```

### Provider Placement

```
app/
├── layout.tsx (root)
│   └── CartProvider
│       └── (storefront)/
│           └── layout.tsx
│               └── pages use cart
```

### Initialization Flow

```
1. CartProvider mounts
   │
   ├─→ 2. Zustand persist middleware loads cart from localStorage
   │
   ├─→ 3. useEffect runs
   │      │
   │      ├─→ Validate cart items
   │      ├─→ Check product availability
   │      ├─→ Verify prices
   │      └─→ Update if needed
   │
   └─→ 4. Cart ready for use
```

### Validation Checks

| Check | Purpose | Action |
|-------|---------|--------|
| Product exists | Still available | Remove if deleted |
| Variant available | Still in stock | Update or remove |
| Price changed | Updated price | Notify user |
| Stock changed | Quantity available | Adjust quantity |

### Error Handling

```typescript
useEffect(() => {
  try {
    // Initialization logic
  } catch (error) {
    console.error('Cart initialization failed:', error)
    // Optionally clear corrupted cart
    useCartStore.getState().clearCart()
  }
}, [])
```

### Expected Outcome
- React Context Provider for cart
- Initialization on mount
- Hydration from localStorage handled
- Store accessible throughout app

### Verification Checklist
- [ ] `frontend/providers/CartProvider.tsx` file created
- [ ] 'use client' directive at top of file
- [ ] CartProvider component defined
- [ ] Accepts children prop
- [ ] useEffect for initialization
- [ ] Cart hydrates from localStorage
- [ ] Provider wraps children
- [ ] Component exports correctly
- [ ] Optional useCart hook created
- [ ] TypeScript types satisfied

---

## Task 18: Verify Cart Store

### Overview
Comprehensively test and verify all cart store functionality including actions, selectors, persistence, and edge cases. This ensures the cart system works correctly before proceeding to UI implementation.

### Dependencies
- Task 17: Create Cart Context Provider
- All previous tasks in Group A

### Instructions

1. **Create test plan document**
   - List all features to test
   - Define test scenarios
   - Prepare test data
   - Document expected outcomes

2. **Test add to cart action**
   - Add first item to empty cart
   - Add same item (should increase quantity)
   - Add different variant (should add new item)
   - Add item exceeding stock limit
   - Verify state updates correctly

3. **Test remove from cart action**
   - Remove item from cart
   - Remove last item (empty cart)
   - Remove non-existent item
   - Verify state updates correctly

4. **Test update quantity action**
   - Increase quantity within limit
   - Decrease quantity
   - Set quantity to 0 (should remove)
   - Set quantity exceeding max
   - Set negative quantity
   - Verify validation works

5. **Test clear cart action**
   - Clear cart with multiple items
   - Clear already empty cart
   - Verify all items removed
   - Verify coupon cleared

6. **Test cart total selector**
   - Calculate with single item
   - Calculate with multiple items
   - Calculate with percentage coupon
   - Calculate with fixed coupon
   - Calculate with min order amount
   - Calculate with max discount cap
   - Verify all scenarios correct

7. **Test item count selector**
   - Count on empty cart (0)
   - Count on single item
   - Count on multiple items
   - Verify correct count

8. **Test subtotal selector**
   - Calculate with no items
   - Calculate with single item
   - Calculate with multiple items
   - Verify line totals correct

9. **Test variant key generator**
   - Generate key with size and color
   - Generate key with size only
   - Generate key with no variant
   - Verify same inputs = same key
   - Verify different inputs = different keys

10. **Test persistence**
    - Add items to cart
    - Refresh browser
    - Verify cart persists
    - Clear localStorage
    - Verify cart empty

11. **Test edge cases**
    - Rapid add/remove actions
    - Very large quantities
    - Decimal quantities (should round)
    - Special characters in product names
    - Missing product images
    - Expired coupons

12. **Test TypeScript types**
    - Verify all actions type-safe
    - Verify selectors return correct types
    - Test with strict TypeScript
    - No type errors

13. **Document test results**
    - Create verification checklist
    - Mark passed/failed tests
    - Document any issues found
    - Create bug tickets if needed

### Test Scenarios

| Test # | Scenario | Expected Result |
|--------|----------|-----------------|
| 1 | Add item to empty cart | Item added, qty = 1 |
| 2 | Add same item again | Qty increases to 2 |
| 3 | Add different variant | New item added |
| 4 | Remove item | Item removed from cart |
| 5 | Update quantity | Quantity updated |
| 6 | Clear cart | All items removed |
| 7 | Calculate total | Correct amount |
| 8 | Apply coupon | Discount applied |
| 9 | Persist cart | Cart survives refresh |
| 10 | Validate stock | Exceeding max rejected |

### Add Item Test Cases

| Test Case | Input | Expected State |
|-----------|-------|----------------|
| Add first item | Product A, qty 1 | items: [A×1] |
| Add same item | Product A, qty 1 | items: [A×2] |
| Add variant | Product A (L), qty 1 | items: [A(M)×2, A(L)×1] |
| Exceed stock | Product A, qty 100 | Error, no update |

### Remove Item Test Cases

| Test Case | Initial State | Action | Expected State |
|-----------|---------------|--------|----------------|
| Remove item | [A, B, C] | Remove B | [A, C] |
| Remove last | [A] | Remove A | [] |
| Remove invalid | [A, B] | Remove C | [A, B] |

### Update Quantity Test Cases

| Test Case | Initial | Action | Expected |
|-----------|---------|--------|----------|
| Increase | A×2 | Update(3) | A×3 |
| Decrease | A×3 | Update(1) | A×1 |
| Set to 0 | A×2 | Update(0) | Removed |
| Exceed max | A×2 | Update(50) | Error, A×2 |
| Negative | A×2 | Update(-1) | Error, A×2 |

### Total Calculation Test Cases

| Test Case | Subtotal | Coupon | Expected Total |
|-----------|----------|--------|----------------|
| No discount | ₨10,000 | None | ₨10,000 |
| 10% off | ₨10,000 | 10% | ₨9,000 |
| ₨500 off | ₨10,000 | ₨500 | ₨9,500 |
| Min not met | ₨3,000 | 10% (min ₨5,000) | ₨3,000 |
| Max cap | ₨15,000 | 20% (max ₨2,000) | ₨13,000 |

### Persistence Test

```
1. Open browser
2. Add items to cart
3. Close browser (localStorage should save)
4. Reopen browser
5. Verify cart still has items
6. Clear localStorage
7. Refresh page
8. Verify cart is empty
```

### Manual Testing Checklist

- [ ] Add item to cart (success)
- [ ] Add same item increases quantity (success)
- [ ] Add different variant adds new item (success)
- [ ] Add item with stock limit validation (success)
- [ ] Remove item from cart (success)
- [ ] Update item quantity (success)
- [ ] Clear entire cart (success)
- [ ] Calculate subtotal correctly (success)
- [ ] Calculate total with coupon (success)
- [ ] Get item count correctly (success)
- [ ] Variant key generation works (success)
- [ ] Cart persists across refresh (success)
- [ ] LocalStorage updates properly (success)
- [ ] TypeScript types all correct (success)
- [ ] No console errors (success)

### DevTools Verification

| Tool | Check | Expected |
|------|-------|----------|
| Redux DevTools | Actions logged | All actions visible |
| LocalStorage | cart-storage key | Contains cart data |
| Console | No errors | Clean console |
| Network | No API calls yet | Store is local-only |

### Performance Verification

| Metric | Threshold | Result |
|--------|-----------|--------|
| Add item | < 10ms | Pass/Fail |
| Calculate total | < 5ms | Pass/Fail |
| Persist to storage | < 20ms | Pass/Fail |
| Hydrate on load | < 50ms | Pass/Fail |

### Expected Outcome
- All cart store features verified
- All actions working correctly
- All selectors returning correct values
- Persistence working across sessions
- No TypeScript errors
- Ready for UI implementation

### Verification Checklist
- [ ] All cart actions tested
- [ ] All selectors tested
- [ ] Variant key generator tested
- [ ] Persistence verified
- [ ] Edge cases handled
- [ ] No TypeScript errors
- [ ] DevTools show correct state
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Ready for Group B (Mini Cart UI)

---

## Summary

This document completed the cart store implementation with all remaining actions, computed selectors for calculations, variant key generation utility, cart context provider setup, and comprehensive verification of the entire cart system.

### Completed Tasks
10. ✓ Implemented remove from cart action
11. ✓ Implemented update quantity action with validation
12. ✓ Implemented clear cart action
13. ✓ Created cart total selector with discount calculation
14. ✓ Created cart item count selector
15. ✓ Created cart subtotal selector
16. ✓ Created variant key generator utility
17. ✓ Created cart context provider with hydration
18. ✓ Verified all cart store functionality

### Next Steps
The cart state management system is now complete. Proceed to **Group B: Mini Cart Component** to create the UI components that display cart contents in a dropdown/sidebar, including the mini cart trigger button, cart item display, and quick actions.

### Key Achievements
- ✓ Complete cart CRUD operations
- ✓ Advanced calculation selectors
- ✓ Unique variant identification
- ✓ Persistent cart state
- ✓ Type-safe implementation
- ✓ Comprehensive testing
- ✓ Ready for UI integration
