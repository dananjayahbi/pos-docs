# Tasks 45-52: State & Persistence

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** C - Cart Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_CartUI-Items.md](01_Tasks-35-44_CartUI-Items.md)
- **→ Next Group:** [../Group-D_Discount-Tax-Calculations/](../Group-D_Discount-Tax-Calculations/)

---

## Document Overview

This document covers the cart state management using Zustand, cart actions implementation, empty state handling, and localStorage persistence for offline capability.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Create Empty Cart State | Low |
| 46 | Create Cart State Store | Medium |
| 47 | Create Add to Cart Action | Medium |
| 48 | Create Update Quantity Action | Low |
| 49 | Create Remove from Cart Action | Low |
| 50 | Create Clear Cart Action | Low |
| 51 | Create Clear Cart Dialog | Low |
| 52 | Create Cart Persistence | Medium |

---

## Task 45: Create Empty Cart State

### Overview
Create the empty cart state component that displays when no items are in the cart, providing visual feedback and guidance to users.

### Dependencies
- Task 36: Create Cart Items List

### Instructions

1. **Create empty cart component**
   - Create `EmptyCart.tsx` in Cart directory
   - Display when cart items array is empty
   - Centered in items list area

2. **Design empty state UI**
   - Large icon (shopping cart or basket)
   - Primary message: "Cart is empty"
   - Secondary message: Instructions or help text
   - Visual hierarchy with spacing

3. **Add helpful messaging**
   - Primary: "Cart is empty"
   - Secondary: "Search or select products to add items"
   - Optional: "Scan barcode to get started"
   - Clear, friendly tone

4. **Include visual elements**
   - Icon: Shopping cart outline (large, 64-80px)
   - Subtle animation (optional)
   - Muted colors (gray palette)
   - Centered layout

5. **Add call-to-action**
   - Optional: "Browse Products" button
   - Or: Focus search bar hint
   - Link to quick buttons
   - Keyboard shortcut reminder (F2)

6. **Style empty state**
   - Centered vertically and horizontally
   - Ample whitespace
   - Subtle background (optional)
   - Professional appearance

### Empty Cart State Layout
```
┌─────────────────────────────┐
│                             │
│          🛒                 │  ← Large Icon
│                             │
│      Cart is empty          │  ← Primary Message
│                             │
│   Search or select products │  ← Secondary Message
│   to add items              │
│                             │
│   [Browse Products]         │  ← Optional CTA
│                             │
└─────────────────────────────┘
```

### Message Variations

| Context | Primary | Secondary |
|---------|---------|-----------|
| Initial | Cart is empty | Search or scan to begin |
| After Clear | Cart cleared | Start a new sale |
| After Payment | Sale complete | Begin next transaction |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/EmptyCart.tsx

// Imports
// EmptyCart component
//   - Container div (centered)
//   - Icon element
//   - Primary message
//   - Secondary message
//   - Optional CTA button
```

### Verification Checklist
- [ ] `EmptyCart.tsx` created
- [ ] Icon displays
- [ ] Messages clear and helpful
- [ ] Centered properly
- [ ] Spacing appropriate
- [ ] Optional CTA works (if included)
- [ ] Appears when cart empty
- [ ] Professional appearance

---

## Task 46: Create Cart State Store

### Overview
Create a Zustand store for managing cart state with actions for adding, updating, and removing items, providing centralized state management for the POS cart.

### Dependencies
- Group A, Task 12: POS Context Provider

### Instructions

1. **Create store directory**
   - Create `store/pos/` directory in frontend root
   - Create `cart.ts` in store/pos directory
   - Zustand store for cart management

2. **Define cart state interface**
   - items: CartItem[] - array of cart items
   - discount: CartDiscount | null - cart-level discount
   - customer: Customer | null - attached customer
   - lastUpdate: Date - timestamp of last change

3. **Create Zustand store**
   - Use create from Zustand
   - Define initial state (empty cart)
   - Define actions as methods
   - Export useCartStore hook

4. **Add state properties**
   - items array (initially empty)
   - Discount object (initially null)
   - Customer object (initially null)
   - Computed values (subtotal, itemCount)

5. **Implement computed getters**
   - itemCount: total number of items
   - subtotal: sum of all item line totals
   - hasItems: boolean if items exist
   - Use memoization or computed patterns

6. **Add store devtools**
   - Zustand devtools middleware (dev only)
   - Name store: "POS Cart"
   - Enable time-travel debugging
   - Log actions for debugging

7. **Structure store properly**
   - State at top level
   - Actions below state
   - Getters/computed at bottom
   - Clear organization

### Cart Store Structure
```typescript
{
  // State
  items: CartItem[],
  discount: CartDiscount | null,
  customer: Customer | null,
  lastUpdate: Date,
  
  // Computed
  itemCount: number,
  subtotal: number,
  hasItems: boolean,
  
  // Actions (Tasks 47-50)
  addItem: (product, variant?, quantity) => void,
  updateQuantity: (itemId, quantity) => void,
  removeItem: (itemId) => void,
  clearCart: () => void,
  setDiscount: (discount) => void,
  setCustomer: (customer) => void
}
```

### State Structure

| Property | Type | Purpose |
|----------|------|---------|
| items | CartItem[] | Array of cart items |
| discount | CartDiscount \| null | Cart-level discount |
| customer | Customer \| null | Attached customer |
| lastUpdate | Date | Last modification time |
| itemCount | number (computed) | Total items count |
| subtotal | number (computed) | Sum before discount/tax |

### Expected File Structure
```typescript
// File: frontend/store/pos/cart.ts

// Imports
// CartStore interface
// Initial state
// create() Zustand store
//   - State properties
//   - Computed properties
//   - Action methods (placeholders for 47-50)
// Export useCartStore
```

### Verification Checklist
- [ ] `store/pos/` directory created
- [ ] `cart.ts` file created
- [ ] CartStore interface defined
- [ ] Zustand store created
- [ ] Initial state set
- [ ] Computed properties added
- [ ] Devtools enabled (dev)
- [ ] Store exported as hook

---

## Task 47: Create Add to Cart Action

### Overview
Implement the addItem action in the cart store that adds products to the cart, handling duplicates by incrementing quantity and creating new items as needed.

### Dependencies
- Task 46: Create Cart State Store

### Instructions

1. **Implement addItem action**
   - Add to cart store actions
   - Parameters: product, variant (optional), quantity (default 1)
   - Returns: void or success boolean

2. **Check for duplicate items**
   - Search existing items by product ID and variant ID
   - If found: increment quantity (Task 48)
   - If not found: add new item
   - Handle variant matching correctly

3. **Create new cart item**
   - Generate unique item ID (UUID or timestamp)
   - Product ID and name
   - Variant ID and name (if applicable)
   - Unit price from product
   - Quantity from parameter
   - Calculate line total
   - Add timestamp (addedAt)

4. **Validate before adding**
   - Check stock availability
   - Verify product is active
   - Check variant stock (if applicable)
   - Reject if out of stock

5. **Update cart state**
   - Add new item to items array
   - Update lastUpdate timestamp
   - Trigger re-render
   - Persist to localStorage (Task 52)

6. **Handle errors**
   - Stock validation failures
   - Invalid product data
   - Missing required fields
   - Return error or throw

7. **Show feedback**
   - Success: Brief toast notification (optional)
   - Error: Display error message
   - Cart badge update
   - Visual confirmation

### Add to Cart Flow
```
addItem(product, variant, qty)
    │
    ▼
Validate Stock
    │
    ├─── Out of Stock ──► Reject & Show Error
    │
    └─── In Stock
            │
            ▼
    Check for Duplicate
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
   Exists      New Item
      │           │
      ▼           │
  Increment    Create Item
   Quantity         │
      │           │
      └─────┬─────┘
            │
            ▼
   Update Cart State
            │
            ▼
   Persist to Storage
            │
            ▼
   Show Feedback
```

### Duplicate Detection Logic

| Match By | Product ID | Variant ID | Result |
|----------|------------|------------|--------|
| Simple | Match | N/A | Increment qty |
| Variant | Match | Match | Increment qty |
| Variant Different | Match | No Match | New item |
| New Product | No Match | N/A | New item |

### Expected Implementation
```typescript
// In cart.ts store:

addItem: (product, variant, quantity = 1) => set((state) => {
  // Validate stock
  // Check for duplicate
  // Either increment or create new
  // Update state
  // Return new state
})
```

### Verification Checklist
- [ ] addItem action implemented
- [ ] Stock validation works
- [ ] Duplicate detection correct
- [ ] New items created properly
- [ ] Quantity incremented for duplicates
- [ ] State updates correctly
- [ ] Errors handled
- [ ] Feedback shown (if implemented)

---

## Task 48: Create Update Quantity Action

### Overview
Implement the updateQuantity action that modifies the quantity of an existing cart item with validation and auto-removal for zero quantities.

### Dependencies
- Task 46: Create Cart State Store

### Instructions

1. **Implement updateQuantity action**
   - Add to cart store actions
   - Parameters: itemId, newQuantity
   - Returns: void or success boolean

2. **Find target item**
   - Search items array by itemId
   - Handle item not found error
   - Get current quantity
   - Prepare for update

3. **Validate new quantity**
   - Check against stock quantity
   - Minimum: 1 (or 0 for remove)
   - Maximum: available stock
   - Reject invalid quantities

4. **Handle zero quantity**
   - If newQuantity === 0: remove item (Task 49)
   - Optional: Prompt confirmation
   - Or: Set minimum to 1
   - Prevent accidental removal

5. **Update item quantity**
   - Set item.quantity to newQuantity
   - Recalculate lineTotal (quantity × unitPrice)
   - Update lastUpdate timestamp
   - Trigger re-render

6. **Update cart state**
   - Modify items array immutably
   - Map and update target item
   - Keep other items unchanged
   - Persist to storage

7. **Handle errors**
   - Item not found
   - Invalid quantity
   - Stock exceeded
   - Display error message

### Update Quantity Flow
```
updateQuantity(itemId, newQty)
    │
    ▼
Find Item in Cart
    │
    ├─── Not Found ──► Error: Item not found
    │
    └─── Found
            │
            ▼
    Validate Quantity
            │
      ┌─────┼─────┐
      │     │     │
      ▼     ▼     ▼
  qty=0  Valid  Invalid
      │     │     │
      ▼     │     └──► Error: Invalid
  Remove  │
   Item   │
      │   ▼
      │ Update Item
      │   Quantity
      │     │
      └──┬──┘
         │
         ▼
  Update State
         │
         ▼
  Persist Storage
```

### Quantity Validation Rules

| New Quantity | Action | Note |
|--------------|--------|------|
| 0 | Remove item | Or prompt confirmation |
| 1 to Stock | Update | Valid range |
| > Stock | Reject | Insufficient stock |
| < 0 | Reject | Invalid negative |
| Decimal | Round | Or reject |

### Expected Implementation
```typescript
// In cart.ts store:

updateQuantity: (itemId, newQuantity) => set((state) => {
  // Find item
  // Validate quantity
  // Handle zero (remove)
  // Update item
  // Return new state
})
```

### Verification Checklist
- [ ] updateQuantity action implemented
- [ ] Item found correctly
- [ ] Quantity validated
- [ ] Zero quantity handled
- [ ] Line total recalculated
- [ ] State updates immutably
- [ ] Errors handled
- [ ] Storage persisted

---

## Task 49: Create Remove from Cart Action

### Overview
Implement the removeItem action that deletes an item from the cart with optional confirmation for safety.

### Dependencies
- Task 46: Create Cart State Store

### Instructions

1. **Implement removeItem action**
   - Add to cart store actions
   - Parameters: itemId
   - Returns: void or removed item

2. **Find target item**
   - Search items array by itemId
   - Handle item not found
   - Store item data (for undo)
   - Prepare for removal

3. **Remove item from array**
   - Filter items array
   - Remove item with matching ID
   - Keep all other items
   - Immutable update

4. **Update cart state**
   - Set new items array
   - Update lastUpdate
   - Recalculate totals
   - Trigger re-render

5. **Add undo capability**
   - Store removed item temporarily (optional)
   - Show "Undo" toast (optional)
   - Timeout after 5 seconds
   - Clear undo after timeout

6. **Handle empty cart**
   - Check if last item removed
   - Clear discount if applicable
   - Clear customer (optional)
   - Show empty cart state

7. **Persist changes**
   - Update localStorage
   - Sync with server (optional)
   - Log action for audit
   - Show feedback

### Remove Item Flow
```
removeItem(itemId)
    │
    ▼
Find Item in Cart
    │
    ├─── Not Found ──► Error: Item not found
    │
    └─── Found
            │
            ▼
    Store Item (for undo)
            │
            ▼
    Filter Items Array
            │
            ▼
    Update Cart State
            │
            ▼
    Check if Last Item
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
   Last Item   More Items
      │           │
      ▼           │
  Clear Extra    │
   (discount)    │
      │           │
      └─────┬─────┘
            │
            ▼
   Persist Storage
            │
            ▼
   Show Feedback
            │
            ▼
   Optional: Undo Toast
```

### Post-Removal Actions

| Condition | Action |
|-----------|--------|
| Last item removed | Clear discount, show empty state |
| More items remain | Update totals only |
| Discount applied | Recalculate discount |
| Customer attached | Keep customer (optional) |

### Expected Implementation
```typescript
// In cart.ts store:

removeItem: (itemId) => set((state) => {
  // Find and store item (for undo)
  // Filter items array
  // Check if empty
  // Clear extras if empty
  // Return new state
})
```

### Verification Checklist
- [ ] removeItem action implemented
- [ ] Item removed correctly
- [ ] State updates immutably
- [ ] Empty cart handled
- [ ] Undo capability added (optional)
- [ ] Storage persisted
- [ ] Feedback shown
- [ ] Errors handled

---

## Task 50: Create Clear Cart Action

### Overview
Implement the clearCart action that removes all items from the cart, typically used after payment completion or to start fresh.

### Dependencies
- Task 46: Create Cart State Store

### Instructions

1. **Implement clearCart action**
   - Add to cart store actions
   - No parameters
   - Returns: void or cleared items count

2. **Store cart backup**
   - Save current cart state (optional)
   - For undo or audit trail
   - Temporary storage only
   - Clear after timeout

3. **Reset cart state**
   - Clear items array (empty array)
   - Clear discount (null)
   - Clear customer (optional, based on settings)
   - Reset lastUpdate

4. **Handle confirmation**
   - Require confirmation if items exist (Task 51)
   - Skip confirmation if already empty
   - Cancel if user declines
   - Proceed on confirmation

5. **Clear related data**
   - Remove applied discounts
   - Clear item-level discounts
   - Optionally clear customer
   - Reset to initial state

6. **Update persistence**
   - Clear localStorage cart data
   - Sync clear action to server (optional)
   - Log clear action
   - Update timestamp

7. **Show feedback**
   - Success message: "Cart cleared"
   - Brief notification
   - Display empty cart state
   - Ready for next sale

### Clear Cart Flow
```
clearCart()
    │
    ▼
Check if Items Exist
    │
    ├─── Empty ──────► Return (no action)
    │
    └─── Has Items
            │
            ▼
    Show Confirmation (Task 51)
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
  Confirm     Cancel
      │           │
      ▼           └──► Return (no action)
  Store Backup
   (optional)
      │
      ▼
  Reset State
      │
      ├──► items = []
      ├──► discount = null
      ├──► customer = null (optional)
      └──► lastUpdate = now
      │
      ▼
  Clear Storage
      │
      ▼
  Show Feedback
```

### Clear Cart Scenarios

| Scenario | Confirmation | Customer | Discount |
|----------|--------------|----------|----------|
| After Payment | No | Optional keep | Clear |
| Manual Clear | Yes | Optional keep | Clear |
| New Sale | No | Clear | Clear |
| Error Recovery | Yes | Keep | Clear |

### Expected Implementation
```typescript
// In cart.ts store:

clearCart: () => set((state) => {
  // Optional: Store backup
  // Reset all cart state
  // Return initial state
  return {
    items: [],
    discount: null,
    customer: null,  // or keep based on settings
    lastUpdate: new Date()
  }
})
```

### Verification Checklist
- [ ] clearCart action implemented
- [ ] Confirmation prompted (if items exist)
- [ ] State reset completely
- [ ] Items array emptied
- [ ] Discount cleared
- [ ] Customer handling correct
- [ ] Storage cleared
- [ ] Feedback shown

---

## Task 51: Create Clear Cart Dialog

### Overview
Create a confirmation dialog component that prompts users before clearing the cart to prevent accidental data loss.

### Dependencies
- Task 50: Create Clear Cart Action

### Instructions

1. **Create confirmation dialog component**
   - Create `ClearCartDialog.tsx` in Cart directory
   - Modal dialog component
   - Accept onConfirm and onCancel props

2. **Design dialog UI**
   - Clear warning message
   - Item count display
   - Two action buttons
   - Modal overlay

3. **Add warning message**
   - Title: "Clear Cart?"
   - Message: "Remove all X items from cart?"
   - Warning icon
   - Clear, concise text

4. **Show item summary**
   - Number of items
   - Total value (optional)
   - "This action cannot be undone"
   - Emphasize consequences

5. **Add action buttons**
   - Cancel button (secondary, left)
   - Clear Cart button (primary danger, right)
   - Keyboard support (Escape = cancel)
   - Enter key handling

6. **Implement dialog state**
   - Open/close state
   - Trigger from Clear Cart button
   - Close on action or cancel
   - Backdrop click closes

7. **Style dialog appropriately**
   - Modal center screen
   - Semi-transparent backdrop
   - Shadow and border
   - Danger color for clear button

### Clear Cart Dialog Layout
```
┌─────────────────────────────────┐
│                                 │
│         ⚠️  Clear Cart?          │
│                                 │
│ Remove all 3 items from cart?  │
│                                 │
│ This action cannot be undone.  │
│                                 │
│  [ Cancel ]  [ Clear Cart ]    │
│                                 │
└─────────────────────────────────┘
```

### Dialog Elements

| Element | Content | Style |
|---------|---------|-------|
| Icon | Warning (⚠️) | Yellow/Orange |
| Title | "Clear Cart?" | Bold, large |
| Message | "Remove all X items?" | Normal |
| Warning | "Cannot be undone" | Small, red |
| Cancel | "Cancel" | Secondary button |
| Confirm | "Clear Cart" | Danger button |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ClearCartDialog.tsx

// Imports
// ClearCartDialog props
// ClearCartDialog component
//   - Modal overlay
//   - Dialog content
//   - Warning icon
//   - Message text
//   - Item count
//   - Action buttons
//   - Keyboard handlers
```

### Verification Checklist
- [ ] `ClearCartDialog.tsx` created
- [ ] Dialog displays correctly
- [ ] Warning message clear
- [ ] Item count shown
- [ ] Cancel button works
- [ ] Clear button confirms
- [ ] Escape closes dialog
- [ ] Backdrop click closes
- [ ] Styling appropriate (danger)

---

## Task 52: Create Cart Persistence

### Overview
Implement cart persistence to localStorage enabling cart recovery after page refresh and providing offline capability for the POS system.

### Dependencies
- Task 46: Create Cart State Store

### Instructions

1. **Add persistence middleware**
   - Use Zustand persist middleware
   - Or custom localStorage sync
   - Configure storage key: 'pos_cart'
   - Handle serialization

2. **Define persistence config**
   - Storage: localStorage
   - Key: 'pos_cart'
   - Whitelist: items, discount, customer
   - Blacklist: temporary UI state

3. **Implement save to storage**
   - Triggered on cart state changes
   - Debounce saves (100-200ms)
   - Serialize cart data to JSON
   - Handle storage quota errors

4. **Implement load from storage**
   - Load on app/component mount
   - Deserialize JSON to cart state
   - Validate loaded data
   - Handle corrupt data gracefully

5. **Add data validation**
   - Check data structure integrity
   - Validate item properties
   - Remove invalid items
   - Log validation errors

6. **Handle storage errors**
   - Quota exceeded: warn and clear old data
   - Parse errors: reset to empty cart
   - Security errors: fallback to memory
   - Log errors for debugging

7. **Implement storage clearing**
   - Clear on successful payment
   - Clear on logout
   - Clear on error recovery
   - Manual clear option

8. **Add storage versioning**
   - Version key in stored data
   - Migration for schema changes
   - Backward compatibility
   - Clear on version mismatch

### Persistence Flow
```
Cart State Changes
    │
    ▼
Debounce (200ms)
    │
    ▼
Serialize Cart Data
    │
    ├──► items: [...items]
    ├──► discount: {...}
    ├──► customer: {...}
    └──► version: 1
    │
    ▼
Save to localStorage
    │
    ▼
Handle Errors
    │
    ├─── Success ──► Continue
    │
    └─── Error
            │
            ├──► Quota ──► Warn & Clear Old
            ├──► Parse ──► Log & Skip
            └──► Security ──► Fallback

App Mount/Refresh
    │
    ▼
Load from localStorage
    │
    ▼
Deserialize & Validate
    │
    ├─── Valid ──► Restore State
    │
    └─── Invalid ──► Empty Cart
```

### Persisted Data Structure
```typescript
{
  version: 1,
  cart: {
    items: CartItem[],
    discount: CartDiscount | null,
    customer: Customer | null,
    lastUpdate: string  // ISO date
  },
  timestamp: string  // ISO date
}
```

### Storage Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Key | 'pos_cart' | LocalStorage key |
| Version | 1 | Schema version |
| Debounce | 200ms | Save throttling |
| Max Age | 24 hours | Data expiration |

### Expected Implementation
```typescript
// In cart.ts store:

// Using Zustand persist middleware:
export const useCartStore = create(
  persist(
    (set, get) => ({
      // Store definition from Task 46
    }),
    {
      name: 'pos_cart',
      storage: createJSONStorage(() => localStorage),
      partialPersist: true,
      version: 1
    }
  )
)

// Or custom implementation:
// - useEffect to save on changes
// - useEffect to load on mount
// - Error handling
```

### Verification Checklist
- [ ] Persistence middleware added
- [ ] Storage key configured
- [ ] Save on state change works
- [ ] Load on mount works
- [ ] Data validated on load
- [ ] Errors handled gracefully
- [ ] Clear on payment/logout
- [ ] Versioning implemented
- [ ] Storage quota handled
- [ ] Cart recovers after refresh

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 45 | Create Empty Cart State | Empty cart display component |
| 46 | Create Cart State Store | Zustand store with state |
| 47 | Create Add to Cart Action | addItem action with validation |
| 48 | Create Update Quantity Action | updateQuantity action |
| 49 | Create Remove from Cart Action | removeItem action |
| 50 | Create Clear Cart Action | clearCart action |
| 51 | Create Clear Cart Dialog | Confirmation dialog |
| 52 | Create Cart Persistence | localStorage persistence |

### Complete Group C Progress
```
frontend/
├── components/modules/pos/Cart/
│   ├── CartContainer.tsx               ✓
│   ├── CartItemsList.tsx               ✓
│   ├── CartItem.tsx                    ✓
│   ├── ItemName.tsx                    ✓
│   ├── QuantityControls.tsx            ✓
│   ├── QuantityInput.tsx               ✓
│   ├── ItemPrice.tsx                   ✓
│   ├── RemoveItemButton.tsx            ✓
│   ├── ItemOptionsMenu.tsx             ✓
│   ├── ItemDiscount.tsx                ✓
│   ├── EmptyCart.tsx                   # Task 45 ✓
│   ├── ClearCartDialog.tsx             # Task 51 ✓
│   └── index.ts
└── store/pos/
    ├── cart.ts                         # Tasks 46-50, 52 ✓
    └── index.ts
```

### Group C Complete: Cart Management Ready
✓ **All Tasks Completed (35-52)**
- Complete cart UI with item management
- Zustand store for centralized state
- Cart actions (add, update, remove, clear)
- Empty state and clear confirmation
- localStorage persistence for offline support

### Next Steps
Proceed to **Group D: Discount & Tax Calculations** to implement cart totals, discount modal, and tax calculations.

Navigate to: [../Group-D_Discount-Tax-Calculations/01_Tasks-53-60_Totals-Discount.md](../Group-D_Discount-Tax-Calculations/01_Tasks-53-60_Totals-Discount.md)

---

## Notes for AI Agents

1. **Zustand Store:** Use Zustand for predictable state management with minimal boilerplate
2. **Persistence:** localStorage provides offline capability and cart recovery after refresh
3. **Validation:** Always validate stock and quantity before cart operations
4. **Immutability:** Update Zustand state immutably using set() function properly
5. **Error Handling:** Gracefully handle storage quota, parsing, and network errors
6. **Confirmation:** Require confirmation for destructive actions like clear cart
7. **Performance:** Debounce localStorage saves to prevent excessive writes
8. **Next Group:** Focus on calculations (subtotal, discount, tax, total) and totals display
