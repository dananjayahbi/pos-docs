# Tasks 85-91: Cart Persistence and Synchronization

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** F - Persistence & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88, 89, 90, 91

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-92-96_Comprehensive-Testing.md](02_Tasks-92-96_Comprehensive-Testing.md)

---

## Document Overview

This document covers the implementation of cart persistence and synchronization mechanisms. It establishes localStorage-based cart persistence for guest users, hydration hooks for loading cart state on application start, merge logic for combining guest and authenticated user carts, API synchronization for logged-in users, cart item expiry management, stock re-validation, and price update detection. These features ensure a seamless shopping experience across sessions and user authentication states.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create localStorage Persist | Medium | 30 min |
| 86 | Create Hydration Hook | Low | 20 min |
| 87 | Create Cart Merge Logic | Medium | 35 min |
| 88 | Create API Cart Sync | Medium | 40 min |
| 89 | Create Cart Expiry | Low | 20 min |
| 90 | Create Stock Re-validation | Medium | 35 min |
| 91 | Create Price Update Check | Medium | 30 min |

---

## Task 85: Create localStorage Persist

### Overview
Implement localStorage-based persistence for the shopping cart using Zustand's persist middleware. This enables guest users to maintain their cart across browser sessions without requiring authentication. The implementation ensures cart data is automatically serialized to localStorage and rehydrated when the application loads.

### Dependencies
- Task 84 (Cart Promotion Logic)
- Zustand store configured
- cartStore.ts created

### Instructions

1. **Import Zustand persist middleware**
   - Navigate to `frontend/stores/storefront/cartStore.ts`
   - Import `persist` from `zustand/middleware`
   - Import required TypeScript types

2. **Configure persist middleware**
   - Wrap existing store creator with persist middleware
   - Set storage name to `lcc-cart` for localStorage key
   - Configure storage to use `localStorage`

3. **Define persistence configuration**
   - Specify which state properties to persist
   - Include cart items array
   - Include coupon code if applied
   - Exclude temporary UI states (loading, errors)

4. **Configure serialization options**
   - Set `version` number for migration support
   - Configure `serialize` and `deserialize` functions
   - Handle special data types (Dates) appropriately

5. **Implement storage checks**
   - Add checks for localStorage availability
   - Handle SSR environments where localStorage is undefined
   - Provide fallback for browsers with storage disabled

6. **Add merge strategy**
   - Define how persisted state merges with initial state
   - Ensure critical properties like items aren't overwritten
   - Handle version mismatches gracefully

7. **Test persistence behavior**
   - Verify data saves to localStorage on cart changes
   - Confirm data loads on page refresh
   - Test with multiple tabs open simultaneously

### Persistence Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Storage Key | `lcc-cart` | Unique identifier in localStorage |
| Storage Type | localStorage | Browser persistence |
| Version | 1 | Migration tracking |
| Partialize | Selective | Persist only relevant state |

### Persisted State Properties

| Property | Type | Persisted | Reason |
|----------|------|-----------|--------|
| items | CartItem[] | Yes | Core cart data |
| couponCode | string \| null | Yes | Applied discount |
| couponDiscount | number | Yes | Discount amount |
| lastUpdated | Date | Yes | Staleness check |
| isLoading | boolean | No | Temporary UI state |
| error | string \| null | No | Temporary error state |

### Storage Structure in localStorage

```
Key: lcc-cart
Value: {
  state: {
    items: [...],
    couponCode: "SAVE10",
    couponDiscount: 500,
    lastUpdated: "2026-01-26T10:30:00.000Z"
  },
  version: 1
}
```

### SSR and Hydration Considerations

| Scenario | Handling |
|----------|----------|
| Server Render | Skip localStorage access |
| Client Hydration | Load from localStorage after mount |
| localStorage Unavailable | Fallback to memory-only state |
| Multiple Tabs | Last write wins (localStorage sync) |

### Storage Availability Check

```
Check Sequence:
1. Is window defined? (SSR check)
2. Is localStorage defined?
3. Can write test data?
4. Can read test data?
5. Success → Use localStorage
6. Fail → Use memory fallback
```

### Migration Strategy

| Version | Changes | Migration Action |
|---------|---------|------------------|
| 1 | Initial schema | N/A |
| 2 | Add new field | Merge with defaults |
| 3 | Remove field | Filter out old data |
| Future | Schema change | Custom migration function |

### Expected Outcome
- Cart persists to localStorage automatically
- Cart restores on page reload
- SSR compatibility maintained
- Graceful fallback for unsupported environments

### Verification Checklist
- [ ] Persist middleware integrated with cartStore
- [ ] Storage key set to `lcc-cart`
- [ ] Cart items persist across page reloads
- [ ] Coupon code persists correctly
- [ ] SSR compatibility verified
- [ ] localStorage availability checked
- [ ] Multiple tab behavior tested
- [ ] Version tracking implemented

---

## Task 86: Create Hydration Hook

### Overview
Create a custom React hook that manages cart hydration on application startup. This hook ensures the persisted cart state from localStorage is properly loaded into the Zustand store after the initial client-side render, preventing hydration mismatches in Next.js SSR environments.

### Dependencies
- Task 85: Create localStorage Persist

### Instructions

1. **Create hydration hook file**
   - Navigate to `frontend/hooks/store/` directory
   - Create new file `useCartHydration.ts`
   - Set up TypeScript hook structure

2. **Import required dependencies**
   - Import React hooks (useEffect, useState)
   - Import cart store from Zustand
   - Import necessary types

3. **Define hydration state tracking**
   - Create state variable to track hydration status
   - Set initial state to `false` (not hydrated)
   - Track hydration completion

4. **Implement hydration effect**
   - Use useEffect hook to run on mount
   - Check if running in browser environment
   - Wait for Zustand persist rehydration

5. **Subscribe to Zustand persist events**
   - Listen for `rehydrate` event from persist middleware
   - Update hydration state when complete
   - Handle rehydration errors gracefully

6. **Expose hydration status**
   - Return hydrated boolean state from hook
   - Return loading indicator if needed
   - Provide error state if hydration fails

7. **Implement in root layout**
   - Use hook in root layout or app component
   - Prevent rendering cart UI until hydrated
   - Show loading state during hydration

### Hook Interface

| Return Value | Type | Description |
|--------------|------|-------------|
| isHydrated | boolean | Whether cart has loaded from storage |
| isHydrating | boolean | Whether hydration is in progress |
| error | Error \| null | Hydration error if occurred |

### Hydration Lifecycle

```
App Mount
    │
    ▼
Server Render (items: [])
    │
    ▼
Client Hydration Start
    │
    ▼
Load from localStorage
    │
    ▼
Zustand Rehydrate Event
    │
    ▼
Update Hydration State
    │
    ▼
Render with Cart Data
```

### Hydration State Flow

| Phase | isHydrating | isHydrated | Render Behavior |
|-------|-------------|------------|-----------------|
| Initial Server | false | false | Empty cart UI |
| Hydration Start | true | false | Loading indicator |
| Hydration Complete | false | true | Full cart UI |
| Hydration Error | false | false | Error fallback |

### Hook Implementation Strategy

```
1. Component mounts
2. useEffect runs (client-side only)
3. Check if persist has rehydrated
4. If not, subscribe to onRehydrateStorage
5. When rehydrated, set isHydrated = true
6. Component can now safely access cart
```

### SSR Compatibility

| Environment | Behavior |
|-------------|----------|
| Server | Hook returns false, skips hydration |
| Client (Initial) | Hook starts hydration process |
| Client (Hydrated) | Hook returns true, cart available |

### Usage in Components

```
Component Pattern:
├── Call useCartHydration()
├── Check isHydrated
├── If false: Show skeleton/loading
├── If true: Render cart UI
└── Handle errors if present
```

### Error Handling

| Error Type | Cause | Handling |
|------------|-------|----------|
| Storage Access | localStorage blocked | Use empty cart |
| Parse Error | Corrupted data | Clear and reset |
| Version Mismatch | Old schema | Migrate or reset |

### Expected Outcome
- Hook provides reliable hydration state
- Prevents hydration mismatches
- SSR-compatible implementation
- Graceful error handling

### Verification Checklist
- [ ] `useCartHydration.ts` hook created
- [ ] Hook tracks hydration status
- [ ] Subscribes to Zustand persist events
- [ ] Returns isHydrated boolean
- [ ] SSR-compatible (checks for window)
- [ ] Error handling implemented
- [ ] Used in root layout/app component
- [ ] Prevents premature cart rendering

---

## Task 87: Create Cart Merge Logic

### Overview
Implement logic to merge guest cart items with authenticated user cart when a user logs in. This ensures a seamless transition from guest browsing to authenticated shopping, combining items from both carts intelligently and handling conflicts such as duplicate items and quantity limits.

### Dependencies
- Task 86: Create Hydration Hook

### Instructions

1. **Create cart merge utility file**
   - Navigate to `frontend/lib/utils/` directory
   - Create new file `cartMerge.ts`
   - Set up TypeScript utility functions

2. **Define merge strategy types**
   - Define TypeScript interface for merge options
   - Specify conflict resolution strategies
   - Define merge result type

3. **Implement cart item comparison**
   - Create function to check if items are identical
   - Compare product ID, variant ID, and customizations
   - Handle items with different attributes separately

4. **Create quantity merging logic**
   - For duplicate items, add guest quantity to user quantity
   - Check against stock availability limits
   - Cap at maximum allowed quantity per item

5. **Implement merge function**
   - Accept guest cart items array
   - Accept user cart items array
   - Return merged cart items array

6. **Handle merge conflicts**
   - Same item in both carts: Sum quantities
   - Quantity exceeds stock: Use stock limit
   - Price differences: Use current price
   - Out of stock items: Remove or flag

7. **Integrate with authentication flow**
   - Trigger merge on successful login
   - Call merge function with both cart states
   - Update Zustand store with merged items
   - Clear guest cart from localStorage after merge

8. **Preserve user cart priority**
   - User cart items take precedence
   - Guest cart adds missing items only
   - User preferences override guest preferences

### Merge Strategy

| Scenario | Action | Example |
|----------|--------|---------|
| Item only in guest cart | Add to merged cart | Guest has A, User has B,C → Merged: A,B,C |
| Item only in user cart | Keep in merged cart | Guest has A, User has B,C → Merged: A,B,C |
| Item in both carts | Sum quantities | Guest has 2×A, User has 3×A → Merged: 5×A |
| Quantity exceeds stock | Cap at stock level | Guest has 5×A, User has 6×A, Stock=8 → 8×A |
| Item out of stock | Remove from merged | Item A out of stock → Exclude from merged cart |

### Cart Item Comparison Logic

```
Items are identical if:
├── Product ID matches
├── Variant ID matches (if applicable)
├── Customizations match (if applicable)
└── All match → Same item
    └── Different → Separate items
```

### Merge Algorithm Flow

```
1. Initialize merged cart array
2. Add all user cart items
3. For each guest cart item:
   ├── Find matching item in user cart
   ├── If match found:
   │   ├── Add quantities
   │   ├── Check stock limit
   │   └── Update quantity
   └── If no match:
       └── Add as new item
4. Validate all items
5. Return merged cart
```

### Conflict Resolution Rules

| Conflict Type | Resolution | Priority |
|---------------|------------|----------|
| Duplicate item | Merge quantities | Sum |
| Exceeds stock | Cap at stock | Stock limit |
| Price changed | Use current | Current price |
| Item unavailable | Remove | Availability |
| Quantity = 0 | Remove | Validation |

### Merge Trigger Points

| Event | Action |
|-------|--------|
| User logs in | Trigger merge automatically |
| Guest adds item then logs in | Merge includes new item |
| User logs out | Preserve guest cart |
| Session expires | Keep guest cart only |

### Merge Notification Strategy

| Scenario | User Notification |
|----------|-------------------|
| Items added | "X items from your cart have been added" |
| Quantities adjusted | "Some quantities adjusted due to stock" |
| Items removed | "Y items no longer available" |
| No changes | Silent merge |

### Expected Outcome
- Seamless cart merge on user login
- Duplicate items combined intelligently
- Stock limits respected
- User informed of merge results

### Verification Checklist
- [ ] `cartMerge.ts` utility file created
- [ ] Item comparison function implemented
- [ ] Quantity merging logic working
- [ ] Merge function combines carts correctly
- [ ] Stock limits enforced
- [ ] Out of stock items handled
- [ ] Integrated with login flow
- [ ] User notifications displayed
- [ ] Guest cart cleared after merge

---

## Task 88: Create API Cart Sync

### Overview
Implement API synchronization for shopping carts of authenticated users. This feature persists cart data to the backend database, enabling cart access across devices and browsers. The implementation includes API endpoints for fetching, updating, and syncing cart state with the backend.

### Dependencies
- Task 86: Create Hydration Hook
- Authentication system in place
- Backend cart API endpoints available

### Instructions

1. **Create cart service file**
   - Navigate to `frontend/services/store/` directory
   - Create new file `cartService.ts`
   - Set up API service structure

2. **Define cart sync API endpoints**
   - GET `/api/store/cart` - Fetch user cart
   - POST `/api/store/cart` - Update entire cart
   - PUT `/api/store/cart/item` - Update single item
   - DELETE `/api/store/cart/item/{id}` - Remove item

3. **Implement fetch cart function**
   - Create async function to fetch cart from API
   - Include authentication token in headers
   - Handle response and parse cart data
   - Handle errors (network, auth, server)

4. **Implement save cart function**
   - Create async function to save cart to API
   - Send cart items array in request body
   - Include metadata (updated timestamp, coupon)
   - Handle success and error responses

5. **Create sync on cart change**
   - Subscribe to cart store changes in Zustand
   - Debounce sync calls to avoid excessive API requests
   - Only sync if user is authenticated
   - Queue sync requests if offline

6. **Implement sync on login**
   - Fetch user cart from API immediately after login
   - Merge with local cart if present (use Task 87)
   - Save merged cart back to API
   - Update local store with synced data

7. **Handle sync conflicts**
   - Compare timestamps between local and server cart
   - Most recent cart takes precedence
   - Allow user to choose in case of significant conflict
   - Prevent data loss during sync

8. **Implement offline queue**
   - Store pending sync operations when offline
   - Retry sync when connection restored
   - Handle failed syncs with retry logic
   - Show sync status to user (synced, syncing, error)

### API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/store/cart` | Fetch user cart | Yes |
| POST | `/api/store/cart` | Replace entire cart | Yes |
| PUT | `/api/store/cart/item` | Update single item | Yes |
| DELETE | `/api/store/cart/item/{id}` | Remove item | Yes |
| POST | `/api/store/cart/sync` | Full sync with merge | Yes |

### Cart Sync Request Body

```
POST /api/store/cart
{
  items: [
    {
      productId: "prod_123",
      variantId: "var_456",
      quantity: 2,
      price: 1500
    },
    ...
  ],
  couponCode: "SAVE10",
  lastUpdated: "2026-01-26T10:30:00.000Z"
}
```

### Sync Trigger Events

| Event | Sync Action |
|-------|-------------|
| User logs in | Fetch cart and merge |
| Item added | Sync cart to API |
| Item removed | Sync cart to API |
| Quantity changed | Debounced sync |
| Coupon applied | Sync cart to API |
| Page unload | Final sync attempt |

### Sync Flow Diagram

```
User Action (Add Item)
    │
    ▼
Update Local Store
    │
    ▼
Check Auth Status
    │
    ├─── Not Authenticated → Skip API sync
    │
    └─── Authenticated
            │
            ▼
        Debounce (500ms)
            │
            ▼
        Call API Sync
            │
            ├─── Success → Update sync status
            │
            └─── Error → Queue for retry
```

### Conflict Resolution Strategy

| Scenario | Resolution |
|----------|------------|
| Local newer | Upload local to server |
| Server newer | Download server to local |
| Timestamps equal | Merge both carts |
| Offline changes | Queue until online |

### Debounce Configuration

| Action | Debounce Time | Reason |
|--------|---------------|--------|
| Add item | 500ms | User may add multiple items |
| Update quantity | 1000ms | User may adjust multiple times |
| Remove item | 200ms | Immediate sync preferred |
| Apply coupon | 300ms | Validate quickly |

### Error Handling

| Error Type | User Feedback | Action |
|------------|---------------|--------|
| Network error | "Changes will sync when online" | Queue sync |
| Auth error | "Please log in again" | Redirect to login |
| Server error | "Failed to save cart" | Retry 3 times |
| Validation error | Show specific error | Don't sync |

### Sync Status Indicator

| Status | Icon | Display |
|--------|------|---------|
| Synced | ✓ | "All changes saved" |
| Syncing | ⟳ | "Saving changes..." |
| Error | ⚠ | "Sync failed. Retrying..." |
| Offline | ⊘ | "Offline. Changes saved locally." |

### Expected Outcome
- Cart syncs to backend for authenticated users
- Cart accessible across devices
- Offline changes queued and synced
- Conflicts resolved gracefully

### Verification Checklist
- [ ] `cartService.ts` created with API functions
- [ ] Fetch cart endpoint working
- [ ] Save cart endpoint working
- [ ] Sync triggers on cart changes
- [ ] Debounce implemented correctly
- [ ] Sync on login functional
- [ ] Conflict resolution working
- [ ] Offline queue implemented
- [ ] Sync status shown to user
- [ ] Error handling robust

---

## Task 89: Create Cart Expiry

### Overview
Implement cart item expiration functionality to automatically remove stale items from the cart after a configurable period. This prevents users from checking out with outdated cart data and ensures cart items remain relevant and available.

### Dependencies
- Task 85: Create localStorage Persist

### Instructions

1. **Define expiry configuration**
   - Navigate to `frontend/config/cart.ts`
   - Create configuration for cart expiry duration
   - Set default expiry to 7-30 days (configurable)
   - Store as milliseconds for calculation

2. **Add timestamp to cart items**
   - Update CartItem type to include `addedAt` timestamp
   - Set timestamp when item is added to cart
   - Persist timestamp with cart in localStorage

3. **Create expiry check function**
   - Create utility function `checkItemExpiry`
   - Accept cart item and current date as parameters
   - Calculate age of item in cart
   - Return boolean indicating if expired

4. **Implement expiry validation on load**
   - Check expiry status when cart hydrates
   - Filter out expired items automatically
   - Update cart store with remaining items
   - Log removed items for debugging

5. **Add expiry check on critical actions**
   - Before checkout: Validate all items
   - On cart page load: Check and remove expired
   - On price recalculation: Validate freshness
   - Before API sync: Clean expired items

6. **Notify user of expired items**
   - Show toast notification when items expire
   - List expired item names if applicable
   - Provide option to re-add items if still available
   - Don't show notification if cart is empty

7. **Implement manual expiry trigger**
   - Create function to manually clean cart
   - Expose as "Refresh Cart" action if needed
   - Can be triggered by user or automatically

### Expiry Configuration

| Setting | Default Value | Description |
|---------|---------------|-------------|
| CART_EXPIRY_DAYS | 30 days | Default expiry duration |
| CHECK_ON_LOAD | true | Check expiry on app start |
| CHECK_BEFORE_CHECKOUT | true | Validate before checkout |
| NOTIFY_USER | true | Show notification on expiry |

### CartItem with Timestamp

| Property | Type | Purpose |
|----------|------|---------|
| productId | string | Item identifier |
| quantity | number | Item count |
| price | number | Item price |
| addedAt | Date | When item was added |
| updatedAt | Date | Last quantity update |

### Expiry Check Algorithm

```
For each cart item:
1. Get current date/time
2. Get item.addedAt date/time
3. Calculate difference in days
4. If difference > CART_EXPIRY_DAYS:
   ├── Mark as expired
   └── Remove from cart
5. Else:
   └── Keep in cart
```

### Expiry Trigger Points

| Trigger | Action |
|---------|--------|
| App load | Check all items |
| Cart page visit | Check all items |
| Checkout start | Check all items |
| Manual refresh | Check all items |
| Daily background | Check all items (if app open) |

### Expiry Notification

```
Toast Message:
┌────────────────────────────────┐
│ ⚠ Cart Updated                 │
│                                │
│ 2 items removed due to age:    │
│ • Product A                    │
│ • Product B                    │
│                                │
│ [Dismiss]                      │
└────────────────────────────────┘
```

### Grace Period Strategy

| Approach | Description | Use Case |
|----------|-------------|----------|
| Hard Expiry | Remove at exact date | Strict expiry |
| Soft Expiry | Warn, allow checkout | User-friendly |
| Extend on Update | Reset timer on quantity change | Keep active items |

### Expected Outcome
- Old cart items removed automatically
- Users notified of expired items
- Cart stays fresh and relevant
- Configurable expiry duration

### Verification Checklist
- [ ] Expiry configuration defined
- [ ] `addedAt` timestamp added to cart items
- [ ] Expiry check function created
- [ ] Expiry validation runs on load
- [ ] Expired items removed automatically
- [ ] User notified of removals
- [ ] Expiry checked before checkout
- [ ] Manual refresh option available
- [ ] Configurable expiry duration

---

## Task 90: Create Stock Re-validation

### Overview
Implement stock re-validation functionality to check product availability and quantity limits when the cart is loaded or the cart page is accessed. This ensures users cannot checkout with unavailable or over-allocated items, providing real-time stock updates and preventing order failures.

### Dependencies
- Task 88: Create API Cart Sync

### Instructions

1. **Create stock validation service**
   - Navigate to `frontend/services/store/` directory
   - Create new file `stockValidation.ts`
   - Set up stock checking functions

2. **Define stock check API endpoint**
   - Use endpoint: GET `/api/store/products/stock-check`
   - Send array of product/variant IDs
   - Receive current stock levels for each item
   - Include real-time availability status

3. **Implement bulk stock check function**
   - Create async function `validateCartStock`
   - Accept cart items array as parameter
   - Call stock check API with all product IDs
   - Return validation results for each item

4. **Create validation result type**
   - Define TypeScript interface for validation result
   - Include: isAvailable, currentStock, maxQuantity
   - Include: stockLevel (high, low, out-of-stock)
   - Include: hasChanged boolean flag

5. **Implement validation on cart load**
   - Trigger validation when cart page is accessed
   - Trigger validation after cart hydration
   - Run validation in background (non-blocking)
   - Show loading state during validation

6. **Handle validation results**
   - Compare cart quantities with available stock
   - If item out of stock: Remove or disable
   - If quantity exceeds stock: Reduce to available
   - If stock unchanged: No action needed

7. **Update cart store with validated data**
   - Update quantities based on validation
   - Mark items as unavailable if out of stock
   - Update stock level indicators
   - Trigger re-calculation of totals

8. **Notify user of stock changes**
   - Show notification when items updated
   - List items with reduced quantities
   - List items removed due to unavailability
   - Provide option to continue or review

### Stock Validation Endpoint

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/store/products/stock-check` | POST | `{ productIds: [...] }` | Stock data array |

### Stock Check Request

```
POST /api/store/products/stock-check
{
  items: [
    { productId: "prod_123", variantId: "var_456", quantity: 5 },
    { productId: "prod_789", variantId: null, quantity: 2 }
  ]
}
```

### Stock Check Response

```
{
  results: [
    {
      productId: "prod_123",
      variantId: "var_456",
      isAvailable: true,
      currentStock: 15,
      stockLevel: "high",
      maxQuantity: 10,
      hasChanged: false
    },
    {
      productId: "prod_789",
      isAvailable: false,
      currentStock: 0,
      stockLevel: "out-of-stock",
      hasChanged: true
    }
  ]
}
```

### Validation Trigger Points

| Trigger | Timing | Frequency |
|---------|--------|-----------|
| Cart page load | On page mount | Once per visit |
| Cart hydration | After localStorage load | Once per session |
| Before checkout | Checkout button click | Every checkout attempt |
| Manual refresh | User clicks refresh | On demand |
| Background | Every 5 minutes | If cart page open |

### Stock Level Indicators

| Level | Range | Display | Color |
|-------|-------|---------|-------|
| High | > 10 items | "In Stock" | Green |
| Medium | 5-10 items | "Limited Stock" | Yellow |
| Low | 1-4 items | "Only X left" | Orange |
| Out of Stock | 0 items | "Out of Stock" | Red |

### Validation Actions

| Validation Result | Action | User Notification |
|-------------------|--------|-------------------|
| Stock sufficient | No change | None |
| Quantity reduced | Update cart | "Quantity adjusted for Product A" |
| Item unavailable | Remove/disable | "Product B no longer available" |
| Stock increased | No change | None (beneficial) |

### Cart Update Flow

```
1. Load cart from storage
2. Extract product IDs
3. Call stock validation API
4. Receive stock data
5. For each cart item:
   ├── Compare cart.quantity with stock.currentStock
   ├── If cart.quantity > stock.currentStock:
   │   ├── Update cart.quantity = stock.currentStock
   │   └── Add to changes array
   ├── If stock.isAvailable = false:
   │   ├── Mark item as unavailable
   │   └── Add to unavailable array
   └── If no change:
       └── Keep as is
6. Update cart store
7. Show notification with changes
```

### Notification Example

```
Toast Notification:
┌────────────────────────────────┐
│ ⚠ Cart Updated                 │
│                                │
│ Stock availability changed:    │
│                                │
│ • Product A: Reduced to 3      │
│   (was 5)                      │
│                                │
│ • Product B: No longer         │
│   available                    │
│                                │
│ [Review Cart] [Dismiss]        │
└────────────────────────────────┘
```

### Error Handling

| Error | Handling | User Impact |
|-------|----------|-------------|
| API unavailable | Use cached data | Show warning banner |
| Network timeout | Retry 3 times | Delay validation |
| Invalid response | Log error | Use last known state |
| Rate limited | Delay next check | Minimal impact |

### Expected Outcome
- Real-time stock validation for cart items
- Quantities adjusted automatically
- Unavailable items identified
- Users informed of stock changes

### Verification Checklist
- [ ] Stock validation service created
- [ ] Stock check API integrated
- [ ] Bulk validation function working
- [ ] Validation triggers on cart load
- [ ] Out-of-stock items handled
- [ ] Quantity adjustments applied
- [ ] Stock level indicators shown
- [ ] User notifications displayed
- [ ] Cart totals recalculated
- [ ] Error handling implemented

---

## Task 91: Create Price Update Check

### Overview
Implement price update detection and notification system to alert users when product prices have changed since items were added to the cart. This transparency builds trust and prevents checkout surprises, clearly displaying old and new prices for affected items.

### Dependencies
- Task 90: Create Stock Re-validation

### Instructions

1. **Store original price with cart item**
   - Update CartItem type to include `priceWhenAdded`
   - Capture product price when item is added to cart
   - Persist this price with cart item data
   - Use for price comparison

2. **Implement price comparison function**
   - Create utility function `checkPriceChanges`
   - Compare `priceWhenAdded` with current product price
   - Calculate price difference (absolute and percentage)
   - Return array of items with price changes

3. **Fetch current prices from API**
   - Use stock validation API or separate price endpoint
   - GET `/api/store/products/prices` with product IDs
   - Receive current prices for all cart items
   - Include variant prices if applicable

4. **Detect price changes on validation**
   - Run price check alongside stock validation
   - Compare stored price with API price
   - Identify price increases and decreases
   - Flag items with significant changes (>5%)

5. **Update cart items with new prices**
   - Update `price` property with current price
   - Keep `priceWhenAdded` for comparison display
   - Add `priceChanged` flag to item
   - Add `priceChangeType` (increase/decrease)

6. **Display price change badges on UI**
   - Show "Price Updated" badge on affected items
   - Display old price (strikethrough)
   - Display new price (highlighted)
   - Show savings if price decreased

7. **Create price change notification**
   - Show toast when prices change
   - List affected items with old and new prices
   - Highlight savings or increases
   - Allow user to acknowledge changes

8. **Implement price update acknowledgment**
   - Add "Acknowledge Price Changes" step before checkout
   - Require user to confirm awareness of increases
   - Auto-acknowledge for price decreases
   - Store acknowledgment state in cart

### CartItem with Price Tracking

| Property | Type | Purpose |
|----------|------|---------|
| price | number | Current product price |
| priceWhenAdded | number | Original price when added |
| priceChanged | boolean | Flag indicating price change |
| priceChangeType | "increase" \| "decrease" \| null | Change direction |
| priceChangePercent | number | Percentage change |

### Price Check API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/store/products/prices` | POST | Get current prices |

### Price Check Request

```
POST /api/store/products/prices
{
  items: [
    { productId: "prod_123", variantId: "var_456" },
    { productId: "prod_789", variantId: null }
  ]
}
```

### Price Check Response

```
{
  prices: [
    {
      productId: "prod_123",
      variantId: "var_456",
      currentPrice: 1650,
      previousPrice: 1500,
      hasChanged: true,
      changePercent: 10
    },
    {
      productId: "prod_789",
      currentPrice: 800,
      hasChanged: false
    }
  ]
}
```

### Price Change Detection Logic

```
For each cart item:
1. Get item.priceWhenAdded
2. Fetch currentPrice from API
3. Calculate difference = currentPrice - priceWhenAdded
4. Calculate percent = (difference / priceWhenAdded) × 100
5. If percent > 0:
   └── Type = "increase"
6. Else if percent < 0:
   └── Type = "decrease"
7. If |percent| >= 5%:
   └── Mark as significant change
```

### Price Display on Cart Item

```
Price Increased:
┌────────────────────────┐
│ Product Name           │
│                        │
│ ₨1,500 → ₨1,650       │
│ ⚠ Price increased      │
└────────────────────────┘

Price Decreased:
┌────────────────────────┐
│ Product Name           │
│                        │
│ ₨1,500 → ₨1,200       │
│ ✓ You save ₨300       │
└────────────────────────┘
```

### Price Change Notification

```
Toast Notification:
┌────────────────────────────────┐
│ ℹ Prices Updated               │
│                                │
│ Some prices have changed:      │
│                                │
│ • Product A                    │
│   ₨1,500 → ₨1,650 (+10%)      │
│                                │
│ • Product B                    │
│   ₨800 → ₨700 (-12.5%)        │
│   You save ₨100!               │
│                                │
│ [Review Cart] [Continue]       │
└────────────────────────────────┘
```

### Price Change Severity

| Change % | Category | Display |
|----------|----------|---------|
| < 5% | Minor | Subtle indicator |
| 5-15% | Moderate | Badge + notification |
| > 15% | Significant | Banner + require acknowledgment |

### Checkout Price Validation

```
Before Checkout:
1. Re-check all prices
2. If any price increased:
   ├── Show confirmation modal
   ├── List all increases
   ├── Show new total
   └── Require user confirmation
3. If all prices decreased or same:
   └── Proceed to checkout
```

### Price Acknowledgment Modal

```
Modal Content:
┌────────────────────────────────┐
│ Price Confirmation Required    │
│                                │
│ The following prices have      │
│ increased since you added      │
│ them to your cart:             │
│                                │
│ • Product A: ₨1,500 → ₨1,650  │
│ • Product C: ₨500 → ₨600      │
│                                │
│ New Total: ₨15,250             │
│ (was ₨14,900)                  │
│                                │
│ [Cancel] [Confirm & Checkout]  │
└────────────────────────────────┘
```

### Expected Outcome
- Price changes detected automatically
- Users notified of price updates
- Old and new prices displayed clearly
- Price increases require acknowledgment

### Verification Checklist
- [ ] `priceWhenAdded` stored with cart items
- [ ] Price comparison function created
- [ ] Current prices fetched from API
- [ ] Price changes detected accurately
- [ ] Cart items updated with new prices
- [ ] Price change badges displayed
- [ ] Notification shown for price changes
- [ ] Acknowledgment required for increases
- [ ] Savings highlighted for decreases
- [ ] Checkout validation includes price check

---

## Summary

This document established comprehensive cart persistence and synchronization mechanisms. localStorage persistence ensures guest users maintain their carts across sessions. Cart hydration handles SSR compatibility. Merge logic seamlessly combines guest and authenticated user carts. API sync enables cross-device cart access. Cart expiry removes stale items. Stock re-validation prevents unavailable item checkouts. Price update checks provide transparency and build user trust.

### Completed Tasks
1. ✓ Created localStorage persistence with Zustand persist middleware
2. ✓ Created hydration hook for SSR-compatible cart loading
3. ✓ Created cart merge logic for guest-to-user cart combination
4. ✓ Created API cart sync for authenticated users
5. ✓ Created cart expiry for automatic stale item removal
6. ✓ Created stock re-validation for real-time availability checks
7. ✓ Created price update check with user notification

### Next Steps
Proceed to [02_Tasks-92-96_Comprehensive-Testing.md](02_Tasks-92-96_Comprehensive-Testing.md) to perform comprehensive testing of the shopping cart functionality including add to cart flow, quantity updates, mini cart, mobile cart page, and cart persistence.
