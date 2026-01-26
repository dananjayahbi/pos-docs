# Phase-08 SubPhase-01 Group-E Document 01: Store Setup & Core Stores

**Phase:** 08 - Webstore & E-Commerce Platform  
**SubPhase:** 01 - Webstore Project Structure  
**Group:** E - Store State Management  
**Document:** 01 of 02  
**Tasks Covered:** 61-70  
**Estimated Total Duration:** 8 hours 25 minutes  
**Complexity:** Medium  

---

## Navigation

- **Parent:** [Group-E Overview](00_GROUP_OVERVIEW.md)
- **Previous:** [Group-D Doc 02 - Extended Modules & Verify](../Group-D_Store-API-Client/02_Tasks-54-60_Extended-Modules-Verify.md)
- **Next:** [Group-E Doc 02 - Extended Stores & Query](02_Tasks-71-76_Extended-Stores-Query.md)

---

## Introduction

This document provides comprehensive instructions for implementing the core state management infrastructure for the LCC Webstore using Zustand. Tasks 61-70 cover the foundational setup of client-side state management, including configuration, cart management, wishlist functionality, customer authentication state, and UI state management.

The webstore requires efficient, lightweight state management that can handle shopping cart operations, user authentication state, and UI interactions without the complexity of Redux. Zustand provides an ideal solution with minimal boilerplate, built-in TypeScript support, and seamless integration with React components.

**Key Focus Areas:**
- Zustand store configuration and setup
- Cart state management with Sri Lankan localization (LKR/රු)
- Wishlist functionality with persistence
- Customer authentication state
- UI state management for responsive components
- State persistence strategies
- Cross-tab synchronization

**Sri Lankan Localization Requirements:**
- All monetary values in LKR (රු symbol)
- Phone numbers in +94 format
- Locale set to en-LK for formatting
- Tax calculations per Sri Lankan regulations

---

## Store Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Zustand Store Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Cart Store  │  │   Wishlist   │  │   Customer   │    │
│  │              │  │    Store     │  │    Store     │    │
│  │  - items[]   │  │  - items[]   │  │  - customer  │    │
│  │  - total LKR │  │  - add()     │  │  - login()   │    │
│  │  - add()     │  │  - remove()  │  │  - logout()  │    │
│  │  - update()  │  │  - clear()   │  │  - token     │    │
│  │  - remove()  │  └──────────────┘  └──────────────┘    │
│  │  - clear()   │                                         │
│  └──────────────┘                                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │   UI Store   │  │   Recently   │                      │
│  │              │  │    Viewed    │                      │
│  │  - menuOpen  │  │  - items[]   │                      │
│  │  - cartOpen  │  │  - add()     │                      │
│  │  - searchOpen│  │  - clear()   │                      │
│  │  - quickView │  └──────────────┘                      │
│  └──────────────┘                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│               Persistence Middleware Layer                  │
│  (localStorage, sessionStorage, IndexedDB)                 │
├─────────────────────────────────────────────────────────────┤
│                  React Components Layer                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Task 61: Create Store Zustand Config

**Estimated Duration:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Task 60 (API Query Client Implementation)

### Overview

Establish the foundational Zustand configuration for the webstore state management system. This task sets up the directory structure, installs necessary dependencies, configures DevTools middleware for debugging, and creates the base patterns for store composition. The configuration will serve as the foundation for all subsequent store implementations.

### Dependencies

- Task 60 must be completed (API client infrastructure)
- Node.js and npm installed in webstore project
- TypeScript configuration present
- React project structure established

### Instructions

1. Navigate to the webstore frontend project directory and install Zustand version 4.5.0 or higher using your package manager, ensuring peer dependencies are satisfied

2. Create a dedicated store directory at src/store/ to house all state management files, maintaining separation from components and API client code

3. Within the store directory, create a types subdirectory (src/store/types/) to centralize all TypeScript interfaces and type definitions for store states

4. Create a middleware configuration file to set up Zustand DevTools integration, enabling Redux DevTools browser extension support for state inspection and time-travel debugging

5. Configure the DevTools middleware with appropriate options including store name prefixing (use 'lcc-webstore-' prefix), trace enabling for action tracking, and anonymous action filtering

6. Create a store composition pattern file that defines how multiple stores can be combined and accessed, establishing patterns for modular store architecture

7. Set up a central store exports file (src/store/index.ts) that re-exports all store hooks, types, and utilities, providing a single import point for components

8. Create a base store configuration utility that provides common functionality like persistence helpers, state reset utilities, and error handling wrappers

9. Document the store directory structure with a README file explaining the organization, naming conventions, and usage patterns for future developers

10. Configure TypeScript paths in tsconfig.json to allow clean imports from the store directory using alias like @/store

11. Set up environment variable checks to conditionally enable DevTools only in development mode, ensuring production builds don't include debugging overhead

12. Create example type definitions for store state shapes, including proper TypeScript generics for type-safe state selectors

### Expected Outcome

- Zustand package successfully installed with correct version
- Store directory structure created and organized
- DevTools middleware configured and functional
- Store composition patterns established
- Central export system operational
- TypeScript integration complete with proper typing
- Development-only debugging enabled
- Foundation ready for individual store implementations

### Verification Checklist

- [ ] Zustand version 4.5.0+ listed in package.json dependencies
- [ ] src/store/ directory exists with proper structure
- [ ] src/store/types/ subdirectory created for type definitions
- [ ] DevTools middleware configuration file present
- [ ] Store composition pattern file created
- [ ] Central index.ts exports file configured
- [ ] TypeScript path aliases working for store imports
- [ ] DevTools visible in browser extension during development
- [ ] Production builds exclude DevTools overhead
- [ ] README documentation created in store directory

---

## Task 62: Create Cart Store

**Estimated Duration:** 1.5 hours  
**Complexity:** Medium  
**Dependencies:** Task 61 (Store Zustand Config)

### Overview

Implement the shopping cart store as the cornerstone of the e-commerce functionality. This store manages cart items, quantities, pricing calculations in Sri Lankan Rupees, and provides computed values for subtotals and totals. The implementation must handle complex cart operations while maintaining immutable state updates and type safety throughout.

### Dependencies

- Task 61 completed (Zustand configuration)
- Product types defined from API client
- Currency formatting utilities for LKR
- Sri Lankan tax calculation rules documented

### Instructions

1. Create a comprehensive CartState interface in src/store/types/cart.ts defining the complete shape of cart state including items array, loading states, error states, and metadata fields

2. Define the CartItem interface with all necessary product information fields including productId, name, sku, price in LKR (as number), quantity (integer), image URL, selected variant details, and any customization options

3. Add fields to CartItem for line-level calculations such as lineSubtotal (price × quantity), lineDiscount (if applicable), and lineTax following Sri Lankan tax regulations

4. Create the cart store file at src/store/cartStore.ts using Zustand's create function with proper TypeScript generics for full type inference

5. Initialize the store with empty default state including empty items array, zero totals, null loading states, and empty error messages

6. Implement computed values as derived state including itemCount (total number of individual items across all cart entries), subtotal (sum of all line subtotals in LKR), tax amount, and final total

7. Set up currency formatting helpers specific to Sri Lankan Rupees using Intl.NumberFormat with en-LK locale, ensuring proper comma placement and රු symbol usage

8. Create type-safe selectors for common cart queries such as getItemById, getItemByProductId, isProductInCart, and getCartSummary returning formatted LKR values

9. Implement a getCartItemCount selector that returns the total quantity of all items, used for cart badge display in the navigation

10. Add validation helpers within the store for checking cart constraints like maximum item quantity, stock availability, and cart value limits

11. Create a getCartTotal selector that calculates the final amount including tax, discounts, and any applicable fees, returning both raw number and formatted LKR string

12. Document the cart state structure with JSDoc comments explaining each field's purpose, data type, and update patterns

### Expected Outcome

- CartState interface fully defined with all required fields
- CartItem interface captures all product and variant details
- Cart store created with Zustand and proper TypeScript typing
- Initial empty state configured correctly
- Computed values (itemCount, subtotal, tax, total) working
- LKR currency formatting operational with රු symbol
- Type-safe selectors available for component usage
- Cart validation helpers implemented
- Store ready for action implementations

### Store State Structure

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| items | CartItem[] | Array of cart items | [{productId: 'p1', quantity: 2}] |
| itemCount | number | Total items (computed) | 5 |
| subtotal | number | Sum before tax (LKR) | 12500.00 |
| tax | number | Tax amount (LKR) | 1875.00 |
| total | number | Final amount (LKR) | 14375.00 |
| isLoading | boolean | Loading state | false |
| error | string \| null | Error message | null |

### CartItem Structure

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| id | string | Unique cart item ID | 'cart-item-1' |
| productId | string | Product reference | 'prod-abc-123' |
| name | string | Product name | 'Premium Tea 100g' |
| sku | string | Stock keeping unit | 'TEA-PREM-100' |
| price | number | Unit price (LKR) | 850.00 |
| quantity | number | Item quantity | 2 |
| image | string | Product image URL | '/images/tea.jpg' |
| variant | object \| null | Selected variant | {size: '100g', type: 'loose'} |
| lineSubtotal | number | Line total (LKR) | 1700.00 |

### Verification Checklist

- [ ] CartState interface defined in types/cart.ts
- [ ] CartItem interface includes all required fields
- [ ] Cart store created with Zustand create function
- [ ] Initial empty state configured
- [ ] itemCount computed selector working
- [ ] subtotal calculation correct in LKR
- [ ] tax calculation follows Sri Lankan rules
- [ ] total calculation includes all components
- [ ] LKR formatting uses රු symbol and comma separators
- [ ] Type-safe selectors available and tested
- [ ] Cart validation helpers implemented
- [ ] JSDoc documentation complete

---

## Task 63: Create Add to Cart Action

**Estimated Duration:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Task 62 (Cart Store)

### Overview

Implement the addToCart action to enable customers to add products to their shopping cart. This action must handle both new product additions and quantity updates for existing items, perform inventory validation, calculate line totals with LKR pricing, and provide user feedback through toast notifications.

### Dependencies

- Task 62 completed (Cart store with state structure)
- Product inventory data available from API
- Toast notification system configured
- Currency formatting utilities ready

### Instructions

1. Create the addToCart function within the cart store actions, accepting parameters for product object, quantity (defaulting to 1), and optional variant selection object

2. Implement product existence checking by searching the current cart items array for matching productId and variant combination, determining whether to update or add new

3. For existing products, implement quantity increment logic that adds the new quantity to the existing quantity while respecting the immutable state update pattern

4. For new products, construct a complete CartItem object with unique cart item ID, all product details, selected variant information, initial quantity, and calculated line subtotal

5. Add inventory validation that checks available stock against requested quantity, preventing cart additions that exceed inventory availability

6. Implement maximum quantity per item constraints, preventing customers from adding unreasonably large quantities even if inventory permits

7. Calculate the line subtotal by multiplying unit price by quantity, storing as precise LKR amount in the cart item for later tax calculations

8. Update the cart state immutably using Zustand's set function with the new or modified items array, triggering all computed value recalculations

9. Implement success notification showing a toast message with product name and quantity added, formatted as "Added [quantity]x [product name] to cart"

10. Add error handling for edge cases such as invalid product data, negative quantities, missing price information, or API failures during inventory checks

11. Implement optional analytics tracking for add-to-cart events, capturing product ID, price, quantity, and variant details for business intelligence

12. Ensure the action returns a boolean or result object indicating success or failure, allowing calling components to handle the outcome appropriately

### Expected Outcome

- addToCart action functional within cart store
- New products added to cart successfully
- Existing product quantities updated correctly
- Inventory validation prevents overselling
- Line totals calculated accurately in LKR
- Toast notifications provide user feedback
- Immutable state updates maintained
- Error handling covers edge cases
- Action ready for component integration

### Add to Cart Flow

```
Customer Action: Click "Add to Cart"
         │
         ▼
   ┌────────────────────────┐
   │  Validate Product Data │
   │  - Price present?      │
   │  - Quantity valid?     │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Check Inventory       │
   │  - Stock available?    │
   │  - Within max limit?   │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Product in Cart?      │
   └──────┬─────────┬───────┘
          │ No      │ Yes
          │         │
          ▼         ▼
   ┌──────────┐  ┌─────────────┐
   │ Add New  │  │ Update Qty  │
   │ CartItem │  │ Existing    │
   └─────┬────┘  └──────┬──────┘
         │               │
         └───────┬───────┘
                 ▼
   ┌────────────────────────┐
   │  Calculate Line Total  │
   │  price × quantity      │
   │  (in LKR)              │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Update Cart State     │
   │  (Immutable)           │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Show Toast            │
   │  "Added to cart"       │
   └────────────────────────┘
```

### Verification Checklist

- [ ] addToCart function defined in cart store actions
- [ ] Function accepts product, quantity, and optional variant
- [ ] Default quantity of 1 works correctly
- [ ] Existing product quantity updates properly
- [ ] New products added with complete CartItem structure
- [ ] Inventory validation prevents overselling
- [ ] Maximum quantity constraints enforced
- [ ] Line total calculation accurate in LKR
- [ ] Immutable state update pattern followed
- [ ] Toast notification displays on success
- [ ] Error handling covers invalid inputs
- [ ] Action returns success/failure indicator

---

## Task 64: Create Update Cart Action

**Estimated Duration:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Task 62 (Cart Store)

### Overview

Implement the updateCartItem action to allow customers to modify quantities of products already in their cart. This action handles quantity changes, validates against inventory constraints, recalculates line totals, and automatically removes items when quantity reaches zero.

### Dependencies

- Task 62 completed (Cart store structure)
- Cart item identification system ready
- Inventory validation available
- Recalculation logic prepared

### Instructions

1. Create the updateCartItem function within cart store actions, accepting cart item ID and new quantity value as parameters

2. Implement cart item lookup by ID to locate the specific item being updated within the items array, handling cases where item might not exist

3. Add validation logic ensuring the new quantity is a positive integer, rejecting negative values, decimals, or non-numeric inputs with appropriate error messages

4. Implement special handling for quantity zero as a removal operation, delegating to the remove functionality rather than setting quantity to zero

5. Validate the new quantity against current inventory levels for the product, preventing updates that would exceed available stock

6. Respect maximum quantity per item constraints even for updates, ensuring customers cannot incrementally reach excessive quantities

7. Recalculate the line subtotal based on the new quantity and unit price, updating the cart item's lineSubtotal field with the new LKR amount

8. Update the cart state immutably by creating a new items array with the modified item, preserving all other cart items unchanged

9. Trigger recalculation of all computed cart values (itemCount, subtotal, tax, total) through Zustand's reactive system

10. Implement optional user confirmation for large quantity increases, showing a warning if quantity jumps by more than a threshold amount

11. Add debouncing logic if the update action might be called rapidly from input fields, preventing excessive state updates during typing

12. Provide feedback through subtle notifications or UI state changes indicating the cart has been updated successfully

### Expected Outcome

- updateCartItem action operational in cart store
- Quantity updates work correctly for existing items
- Validation prevents invalid quantity values
- Zero quantity triggers item removal
- Inventory constraints enforced on updates
- Line totals recalculated accurately in LKR
- Immutable state updates maintained
- Computed values update reactively
- User feedback provided appropriately

### Update Flow Logic

```
Customer Action: Change Quantity Input
         │
         ▼
   ┌────────────────────────┐
   │  Validate Input        │
   │  - Positive integer?   │
   │  - Within range?       │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Quantity = 0?         │
   └──────┬─────────┬───────┘
     Yes  │         │ No
          │         │
          ▼         ▼
   ┌──────────┐  ┌─────────────────┐
   │ Remove   │  │ Check Inventory │
   │ Item     │  │ Available?      │
   └──────────┘  └────────┬────────┘
                           │
                           ▼
                 ┌─────────────────┐
                 │ Update Quantity │
                 │ Recalc Line     │
                 │ Total (LKR)     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Update State    │
                 │ (Immutable)     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Recompute Totals│
                 └─────────────────┘
```

### Verification Checklist

- [ ] updateCartItem function defined in cart store
- [ ] Function accepts cart item ID and new quantity
- [ ] Cart item lookup by ID working correctly
- [ ] Positive integer validation enforced
- [ ] Zero quantity triggers removal
- [ ] Inventory validation prevents overselling
- [ ] Maximum quantity constraints respected
- [ ] Line total recalculation accurate in LKR
- [ ] Immutable state update pattern maintained
- [ ] Computed values update reactively
- [ ] Debouncing implemented if needed
- [ ] User feedback provided on update

---

## Task 65: Create Remove from Cart Action

**Estimated Duration:** 20 minutes  
**Complexity:** Low  
**Dependencies:** Task 62 (Cart Store)

### Overview

Implement the removeFromCart action to allow customers to completely remove items from their shopping cart. This straightforward action filters out the specified item, recalculates all cart totals, and provides confirmation feedback to the user.

### Dependencies

- Task 62 completed (Cart store foundation)
- Cart item identification available
- Notification system configured
- State update patterns established

### Instructions

1. Create the removeFromCart function within cart store actions, accepting a cart item ID as the sole parameter to identify the item for removal

2. Implement item filtering logic using array filter method to create a new items array excluding the item matching the provided ID

3. Add existence checking before removal to provide appropriate feedback if the item ID doesn't exist in the current cart

4. Update the cart state immutably with the filtered items array, allowing Zustand to trigger reactive updates throughout dependent components

5. Trigger automatic recalculation of all computed values (itemCount, subtotal, tax, total) through the store's derived state system

6. Implement success notification displaying a toast message confirming the item removal with format "Removed [product name] from cart"

7. Add optional "undo" functionality that temporarily stores the removed item for a brief period, allowing customers to restore it if the removal was accidental

8. Implement analytics tracking for cart removals, capturing product ID, price, and quantity removed for abandonment analysis

9. Handle edge cases such as attempting to remove an already-removed item or invalid item IDs gracefully with appropriate error messages

10. Ensure the action works seamlessly with cart persistence, immediately reflecting the removal in localStorage or session storage

### Expected Outcome

- removeFromCart action functional in cart store
- Items successfully removed from cart by ID
- Items array filtered correctly
- State updates immutably maintained
- Cart totals recalculated automatically
- Toast notification confirms removal
- Optional undo functionality available
- Analytics tracking captures removal data
- Edge cases handled gracefully

### Verification Checklist

- [ ] removeFromCart function defined in cart store
- [ ] Function accepts cart item ID parameter
- [ ] Item filtering logic removes correct item
- [ ] Non-existent item IDs handled gracefully
- [ ] Immutable state update implemented
- [ ] Computed values recalculate automatically
- [ ] Toast notification displays on removal
- [ ] Optional undo feature functional (if implemented)
- [ ] Analytics tracking captures removal events
- [ ] Persistence layer syncs removal immediately

---

## Task 66: Create Clear Cart Action

**Estimated Duration:** 20 minutes  
**Complexity:** Low  
**Dependencies:** Task 62 (Cart Store)

### Overview

Implement the clearCart action to enable complete cart emptying, resetting all cart state to initial values. This action is used during checkout completion, when customers want to start over, or when cart data becomes corrupted and needs a clean reset.

### Dependencies

- Task 62 completed (Cart store with initial state)
- Confirmation dialog component available
- localStorage clearing capability
- Notification system ready

### Instructions

1. Create the clearCart function within cart store actions, accepting an optional confirmation parameter to control whether a dialog is shown before clearing

2. Implement optional confirmation dialog logic that shows a warning modal asking "Are you sure you want to clear your entire cart?" with confirm/cancel options

3. Define the initial empty cart state as a constant that can be reused, including empty items array, zero totals, null errors, and false loading states

4. Reset the cart state to the initial empty state using Zustand's set function with the complete initial state object

5. Clear the persisted cart data from localStorage by removing the cart storage key (typically 'lcc-store-cart')

6. Implement synchronization across browser tabs by dispatching a storage event that notifies other tabs of the cart clearing

7. Add success notification displaying "Cart cleared" or similar message to confirm the action to the user

8. Implement optional analytics tracking for cart clear events, capturing the cart value and item count before clearing for abandonment analysis

9. Handle post-clear navigation if appropriate, potentially redirecting users away from checkout flows if cart was cleared during checkout

10. Ensure the clear action is idempotent, safely handling multiple consecutive calls without errors or side effects

11. Add a clearCartAfterCheckout variant that skips confirmation and notifications, used internally after successful order placement

### Expected Outcome

- clearCart action implemented in cart store
- Optional confirmation dialog functional
- Cart state resets to initial empty state
- localStorage cart data cleared
- Cross-tab synchronization working
- Success notification displayed
- Analytics tracking cart clear events
- Action is idempotent and safe
- Special checkout variant available

### Clear Cart Scenarios

```
┌─────────────────────────────────────────────┐
│         Clear Cart Use Cases               │
├─────────────────────────────────────────────┤
│                                             │
│  1. Manual Clear                           │
│     User clicks "Clear Cart" button        │
│     → Show confirmation dialog             │
│     → Clear cart                           │
│     → Show notification                    │
│                                             │
│  2. Post-Checkout Clear                    │
│     Order successfully placed              │
│     → Clear cart silently                  │
│     → No confirmation needed               │
│     → No notification shown                │
│                                             │
│  3. Error Recovery Clear                   │
│     Cart data corrupted                    │
│     → Clear cart automatically             │
│     → Show error message                   │
│     → Redirect to home                     │
│                                             │
│  4. Logout Clear                           │
│     User logs out                          │
│     → Optionally clear cart                │
│     → Or merge with guest cart             │
│                                             │
└─────────────────────────────────────────────┘
```

### Verification Checklist

- [ ] clearCart function defined in cart store
- [ ] Optional confirmation parameter supported
- [ ] Confirmation dialog shows when enabled
- [ ] Cart state resets to initial empty state
- [ ] localStorage cleared completely
- [ ] Cross-tab sync notification sent
- [ ] Success notification displays
- [ ] Analytics tracks clear events
- [ ] Action is idempotent
- [ ] clearCartAfterCheckout variant available
- [ ] No errors on multiple consecutive calls

---

## Task 67: Create Cart Persistence

**Estimated Duration:** 1 hour  
**Complexity:** Medium  
**Dependencies:** Task 62 (Cart Store)

### Overview

Implement comprehensive cart persistence using Zustand's persist middleware to maintain cart state across browser sessions, page refreshes, and tab closures. This task includes localStorage integration, hydration handling, cross-tab synchronization, and intelligent cart merging for guest-to-authenticated user transitions.

### Dependencies

- Task 62 completed (Cart store implementation)
- Zustand persist middleware available
- localStorage API accessible
- Customer authentication system ready

### Instructions

1. Import the persist middleware from zustand/middleware and prepare to wrap the cart store creation with persistence capabilities

2. Configure the persist middleware with storage options specifying localStorage as the storage mechanism and 'lcc-store-cart' as the storage key for namespace isolation

3. Implement a storage serialization strategy that safely handles the cart state object, ensuring all fields serialize correctly including dates, numbers, and nested objects

4. Add deserialization logic with version checking to handle schema migrations if the cart state structure changes between application versions

5. Set up hydration handling on application mount, ensuring the cart store properly rehydrates from localStorage before any components attempt to read cart state

6. Implement storage quota exceeded error handling for cases where localStorage is full, falling back to in-memory storage with user notification

7. Configure cross-tab synchronization using storage events, ensuring cart updates in one browser tab immediately reflect in all other open tabs

8. Implement automatic cart clearing logic that triggers after successful checkout, removing persisted cart data once an order is confirmed

9. Create guest cart merging functionality that activates on user login, intelligently combining the guest cart with any existing cart from the authenticated user's previous session

10. Add merge conflict resolution for cases where the guest cart and user cart contain the same products, typically preferring higher quantities or more recent additions

11. Implement cart expiration logic that automatically clears persisted carts after a configurable period (e.g., 30 days) to prevent stale data accumulation

12. Add security considerations for cart persistence, ensuring no sensitive payment information is ever stored in localStorage

13. Create a manual rehydration trigger for development and testing purposes, allowing developers to reset or reload cart state

14. Implement fallback behavior for browsers with disabled localStorage, gracefully degrading to session-only cart state without breaking functionality

### Expected Outcome

- Cart persist middleware integrated successfully
- Cart state persists across page refreshes
- localStorage key properly namespaced
- Hydration occurs reliably on app mount
- Storage quota exceeded handled gracefully
- Cross-tab synchronization functional
- Post-checkout cart clearing automated
- Guest-to-user cart merging implemented
- Cart expiration prevents stale data
- Security considerations addressed
- Fallback for disabled localStorage working

### Persistence Flow

```
┌─────────────────────────────────────────────┐
│         Cart Persistence Flow              │
└─────────────────────────────────────────────┘

App Mount
   │
   ▼
┌──────────────────┐
│ Check localStorage│
│ for 'lcc-store-  │
│ cart' key        │
└────────┬─────────┘
         │
         ▼
   ┌────────────┐
   │ Cart Data  │◄── No: Initialize Empty Cart
   │ Exists?    │
   └─────┬──────┘
     Yes │
         ▼
   ┌────────────┐
   │ Deserialize│
   │ Cart State │
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │ Validate   │
   │ Schema     │
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │ Hydrate    │
   │ Store      │
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │ Cart Ready │
   └────────────┘

User Login Event
   │
   ▼
┌──────────────────┐
│ Fetch User Cart  │
│ from Backend     │
└────────┬─────────┘
         │
         ▼
   ┌────────────┐
   │ Merge with │
   │ Guest Cart │
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │ Resolve    │
   │ Conflicts  │
   └─────┬──────┘
         │
         ▼
   ┌────────────┐
   │ Persist    │
   │ Merged Cart│
   └────────────┘
```

### Verification Checklist

- [ ] Persist middleware imported and configured
- [ ] localStorage key set to 'lcc-store-cart'
- [ ] Cart persists across page refreshes
- [ ] Hydration completes before component render
- [ ] Storage quota exceeded handled gracefully
- [ ] Cross-tab sync updates all open tabs
- [ ] Cart clears after successful checkout
- [ ] Guest cart merges on login
- [ ] Merge conflicts resolved intelligently
- [ ] Cart expiration logic implemented
- [ ] No sensitive data persisted
- [ ] Fallback for disabled localStorage works
- [ ] Manual rehydration available for testing

---

## Task 68: Create Wishlist Store

**Estimated Duration:** 1 hour  
**Complexity:** Medium  
**Dependencies:** Task 61 (Store Zustand Config)

### Overview

Implement the wishlist store to enable customers to save products for future consideration. This store manages a collection of favorited products, provides quick access to check wishlist status, syncs with backend for authenticated users, and persists wishlist data locally for guest users.

### Dependencies

- Task 61 completed (Zustand configuration)
- Product type definitions available
- Backend wishlist API endpoints ready
- Persistence middleware configured

### Instructions

1. Create the WishlistState interface in src/store/types/wishlist.ts defining the shape including items array of Product objects, loading states, and sync status

2. Define the wishlist store file at src/store/wishlistStore.ts using Zustand create function with TypeScript generics for full type safety

3. Initialize the store with empty default state including empty items array, false loading flag, null error state, and last sync timestamp

4. Implement the addToWishlist action that accepts a Product object and adds it to the items array if not already present, preventing duplicates

5. Add duplicate checking logic using productId comparison before adding items, silently ignoring attempts to add already-wishlisted products

6. Create the removeFromWishlist action accepting a product ID and filtering it out of the items array immutably

7. Implement the isInWishlist selector function accepting a product ID and returning a boolean indicating whether that product exists in the wishlist

8. Create the clearWishlist action that resets the wishlist to an empty state, typically used on logout or data corruption scenarios

9. Set up persist middleware wrapping the wishlist store with localStorage storage using 'lcc-store-wishlist' as the storage key

10. Implement backend synchronization for authenticated users that fetches the user's wishlist from the server on login and merges with local wishlist

11. Add optimistic updates for add and remove operations, immediately updating local state while queuing backend sync operations

12. Implement conflict resolution for cases where server wishlist differs from local wishlist, typically preferring the union of both sets

13. Create sync status indicators that show when wishlist is being synchronized with backend, providing visual feedback to users

14. Add error handling for network failures during sync operations, gracefully degrading to local-only mode with retry logic

15. Implement wishlist item limits if business requirements dictate a maximum wishlist size, showing appropriate warnings when limit is approached

### Expected Outcome

- WishlistState interface fully defined
- Wishlist store created with proper TypeScript typing
- addToWishlist action prevents duplicates
- removeFromWishlist filters items correctly
- isInWishlist selector provides quick status checks
- clearWishlist resets state properly
- localStorage persistence operational
- Backend sync for authenticated users working
- Optimistic updates provide responsive UX
- Error handling ensures graceful degradation
- Store ready for component integration

### Wishlist State Structure

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| items | Product[] | Wishlisted products | [{id: 'p1', name: 'Tea'}] |
| isLoading | boolean | Loading state | false |
| isSyncing | boolean | Syncing with backend | false |
| error | string \| null | Error message | null |
| lastSync | Date \| null | Last sync timestamp | 2026-01-26T10:30:00Z |

### Wishlist Operations Flow

```
Add to Wishlist
      │
      ▼
┌────────────┐
│ Check if   │
│ Already in │
│ Wishlist?  │
└─────┬──────┘
  No  │
      ▼
┌────────────┐
│ Add to     │
│ Local State│
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Persist to │
│ localStorage│
└─────┬──────┘
      │
      ▼
┌────────────┐      ┌──────────┐
│ User       │ Yes  │ Sync to  │
│ Logged In? ├─────►│ Backend  │
└─────┬──────┘      └──────────┘
  No  │
      ▼
   Done
```

### Verification Checklist

- [ ] WishlistState interface defined in types/wishlist.ts
- [ ] Wishlist store created with Zustand
- [ ] Initial empty state configured
- [ ] addToWishlist action functional
- [ ] Duplicate prevention working
- [ ] removeFromWishlist filters correctly
- [ ] isInWishlist selector returns accurate results
- [ ] clearWishlist resets state
- [ ] Persist middleware configured with 'lcc-store-wishlist'
- [ ] Backend sync for authenticated users working
- [ ] Optimistic updates provide responsive feedback
- [ ] Conflict resolution handles server/local differences
- [ ] Error handling covers network failures

---

## Task 69: Create Customer Store

**Estimated Duration:** 1.5 hours  
**Complexity:** Medium  
**Dependencies:** Task 61 (Store Zustand Config)

### Overview

Implement the customer authentication store managing user login state, customer profile information, authentication tokens, and session management. This store serves as the central authority for authentication state across the webstore, coordinating with the backend API for authentication operations and maintaining secure token storage.

### Dependencies

- Task 61 completed (Store configuration)
- Authentication API endpoints ready
- Token management utilities available
- Secure storage mechanism configured

### Instructions

1. Create the CustomerState interface in src/store/types/customer.ts defining the complete authentication state including customer object, isLoggedIn boolean, isLoading flags, and error messages

2. Define the Customer interface capturing all user profile fields including name, email, phone in +94 format, addresses array, preferences, and account metadata

3. Create the customer store file at src/store/customerStore.ts using Zustand with TypeScript generics for comprehensive type safety

4. Initialize the store with logged-out default state including null customer object, false isLoggedIn flag, and empty error states

5. Implement the login action as an async function accepting email and password, calling the authentication API endpoint and handling the response

6. Add token handling logic that securely stores access tokens and refresh tokens received from the login response, using httpOnly cookies or secure localStorage patterns

7. Create the logout action that clears customer state, removes authentication tokens, invalidates backend sessions via API call, and optionally clears related stores like cart

8. Implement the register action as an async function accepting registration data including name, email, phone +94, password, and optional marketing preferences

9. Add form validation within register action ensuring phone numbers follow Sri Lankan format (+94 XX XXX XXXX), email format is valid, and password meets security requirements

10. Create the updateProfile action allowing authenticated users to modify their profile information, calling the backend API and updating local state on success

11. Implement customer address management within the store including addAddress, updateAddress, removeAddress, and setDefaultAddress actions

12. Add automatic token expiration handling that monitors token expiry times and triggers logout or token refresh before expiration occurs

13. Implement token refresh logic that automatically requests new access tokens using refresh tokens before the access token expires, maintaining seamless authentication

14. Create session persistence that optionally stores authentication state across browser sessions based on "Remember Me" functionality

15. Add security measures ensuring tokens are never logged, exposed in URLs, or accessible to third-party scripts, following OWASP guidelines

16. Implement loading states for all async actions, allowing UI components to show appropriate loading indicators during authentication operations

17. Add comprehensive error handling for authentication failures including network errors, invalid credentials, expired sessions, and server errors, providing user-friendly messages

### Expected Outcome

- CustomerState and Customer interfaces fully defined
- Customer store created with authentication logic
- login action calls API and stores tokens securely
- logout action clears state and invalidates sessions
- register action creates new customer accounts
- updateProfile action modifies customer data
- Address management actions operational
- Token expiration handling automated
- Token refresh prevents session interruption
- Security best practices followed
- Loading states provide UI feedback
- Error handling covers all failure scenarios
- Store ready for authentication flows

### Customer State Structure

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| customer | Customer \| null | Customer object | {name: 'Kasun Silva', email: '...'} |
| isLoggedIn | boolean | Authentication status | true |
| isLoading | boolean | Loading state | false |
| error | string \| null | Error message | null |
| token | string \| null | Access token | 'eyJhbGc...' (internal only) |
| tokenExpiry | Date \| null | Token expiration | 2026-01-26T12:00:00Z |

### Customer Object Structure

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| id | string | Customer ID | 'cust-abc-123' |
| name | string | Full name | 'Kasun Silva' |
| email | string | Email address | 'kasun@example.lk' |
| phone | string | Phone (+94 format) | '+94 77 123 4567' |
| addresses | Address[] | Saved addresses | [{street: '123 Galle Rd', ...}] |
| preferences | object | User preferences | {newsletter: true, locale: 'en-LK'} |
| createdAt | Date | Account creation | 2025-06-15T08:00:00Z |

### Authentication Flow

```
Login Flow
    │
    ▼
┌─────────────┐
│ User enters │
│ credentials │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Validate    │
│ input       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Call API    │
│ POST /login │
└──────┬──────┘
       │
   ┌───┴────┐
   │Success?│
   └───┬────┘
  Yes  │ No
       │ │
       │ └──►  Show Error
       │
       ▼
┌─────────────┐
│ Store tokens│
│ (secure)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Store       │
│ customer    │
│ data        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Set         │
│ isLoggedIn  │
│ = true      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Redirect to │
│ dashboard   │
└─────────────┘
```

### Verification Checklist

- [ ] CustomerState interface defined in types/customer.ts
- [ ] Customer interface includes all profile fields
- [ ] Customer store created with Zustand
- [ ] Initial logged-out state configured
- [ ] login action calls API correctly
- [ ] Tokens stored securely (not in plain localStorage)
- [ ] logout action clears all authentication state
- [ ] register action creates new accounts
- [ ] Phone validation enforces +94 format
- [ ] updateProfile action updates backend and state
- [ ] Address management actions functional
- [ ] Token expiration monitoring active
- [ ] Token refresh prevents session interruption
- [ ] Security measures prevent token exposure
- [ ] Loading states implemented for all async actions
- [ ] Error handling provides user-friendly messages

---

## Task 70: Create UI Store

**Estimated Duration:** 45 minutes  
**Complexity:** Low  
**Dependencies:** Task 61 (Store Zustand Config)

### Overview

Implement the UI state store to manage ephemeral user interface state such as mobile menu visibility, cart drawer open/closed status, search overlay state, and quick view modal state. This store provides centralized control over UI components that need to coordinate across the application without prop drilling.

### Dependencies

- Task 61 completed (Store configuration)
- UI component architecture defined
- Modal and drawer components ready
- Responsive design breakpoints established

### Instructions

1. Create the UIState interface in src/store/types/ui.ts defining all ephemeral UI state flags including menu states, drawer states, modal states, and temporary UI conditions

2. Define the UI store file at src/store/uiStore.ts using Zustand create function with TypeScript for type-safe state management

3. Initialize the store with closed/false default state for all UI elements including mobileMenuOpen false, cartDrawerOpen false, searchOpen false, and quickViewProduct null

4. Implement the toggleMobileMenu action that flips the mobileMenuOpen boolean state, used when users click the hamburger menu icon on mobile devices

5. Add body scroll locking logic within mobile menu toggle to prevent background scrolling when the mobile menu is open, improving mobile UX

6. Create the toggleCartDrawer action controlling the cart drawer visibility, typically triggered by clicking the cart icon in the navigation

7. Implement the toggleSearch action for opening and closing the search overlay or search modal, including focus management to automatically focus search input when opened

8. Create the openQuickView action accepting a Product object or product ID, storing it in quickViewProduct state to trigger the quick view modal display

9. Implement the closeQuickView action that sets quickViewProduct back to null, closing the quick view modal and clearing the viewed product

10. Add keyboard event handling considerations for Escape key to close modals and drawers, ensuring accessible keyboard navigation

11. Create compound actions like openCartDrawerAndCloseMenu that coordinate multiple UI state changes in a single action for complex UI transitions

12. Implement breakpoint awareness that automatically closes mobile menu when viewport exceeds mobile breakpoint, handling screen orientation changes gracefully

13. Add analytics tracking for UI interactions such as menu opens, cart drawer views, and quick view usage for UX insights

14. Ensure no persistence is applied to UI store as these states should reset on page load, keeping UI state session-only

### Expected Outcome

- UIState interface fully defined
- UI store created with Zustand
- All toggle actions functional
- Mobile menu toggle with scroll locking works
- Cart drawer toggle operational
- Search toggle with focus management ready
- Quick view actions handle product display
- Keyboard accessibility supported
- Compound actions coordinate UI changes
- Breakpoint-aware behavior implemented
- No unwanted persistence
- Store ready for UI component integration

### UI State Structure

| Field | Type | Description | Example Value |
|-------|------|-------------|---------------|
| mobileMenuOpen | boolean | Mobile menu visibility | false |
| cartDrawerOpen | boolean | Cart drawer visibility | false |
| searchOpen | boolean | Search overlay visibility | false |
| quickViewProduct | Product \| null | Quick view product | null |
| filtersOpen | boolean | Filters sidebar (mobile) | false |
| notificationOpen | boolean | Notification panel | false |

### UI State Interactions

```
┌──────────────────────────────────────────────┐
│            UI Store Actions                  │
├──────────────────────────────────────────────┤
│                                              │
│  Toggle Mobile Menu                          │
│    ├─► Lock body scroll if opening          │
│    ├─► Unlock body scroll if closing        │
│    └─► Update mobileMenuOpen state          │
│                                              │
│  Toggle Cart Drawer                          │
│    ├─► Close mobile menu if open            │
│    ├─► Lock body scroll if opening          │
│    └─► Update cartDrawerOpen state          │
│                                              │
│  Toggle Search                               │
│    ├─► Close mobile menu if open            │
│    ├─► Focus search input if opening        │
│    └─► Update searchOpen state              │
│                                              │
│  Open Quick View                             │
│    ├─► Set quickViewProduct state           │
│    ├─► Lock body scroll                     │
│    └─► Load product details if needed       │
│                                              │
│  Close Quick View                            │
│    ├─► Clear quickViewProduct state         │
│    └─► Unlock body scroll                   │
│                                              │
│  Escape Key Pressed                          │
│    ├─► Close all modals                     │
│    ├─► Close all drawers                    │
│    └─► Reset UI to default state            │
│                                              │
└──────────────────────────────────────────────┘
```

### Verification Checklist

- [ ] UIState interface defined in types/ui.ts
- [ ] UI store created with Zustand
- [ ] Initial state sets all UI elements closed
- [ ] toggleMobileMenu flips menu state
- [ ] Body scroll locking works with mobile menu
- [ ] toggleCartDrawer controls drawer visibility
- [ ] toggleSearch controls search overlay
- [ ] openQuickView sets product correctly
- [ ] closeQuickView clears product state
- [ ] Escape key closes modals/drawers
- [ ] Compound actions coordinate state changes
- [ ] Breakpoint changes handled gracefully
- [ ] No persistence middleware applied
- [ ] Analytics tracking implemented for UI events

---

## Summary

This document covered Tasks 61-70, establishing the foundational state management infrastructure for the LCC Webstore using Zustand. The implementation provides efficient, type-safe state management for cart operations, wishlist functionality, customer authentication, and UI state coordination.

### Tasks Completed (61-70)

**Configuration & Foundation:**
- **Task 61:** Zustand store configuration with DevTools middleware
- Directory structure and type definitions established
- Store composition patterns configured

**Cart Management:**
- **Task 62:** Cart store with state structure and computed values
- **Task 63:** Add to cart action with inventory validation
- **Task 64:** Update cart action with quantity management
- **Task 65:** Remove from cart action with filtering
- **Task 66:** Clear cart action with confirmation
- **Task 67:** Cart persistence with localStorage and cross-tab sync

**Additional Stores:**
- **Task 68:** Wishlist store with backend synchronization
- **Task 69:** Customer store with authentication and token management
- **Task 70:** UI store for ephemeral interface state

### Key Deliverables

**Store Infrastructure:**
- Zustand configuration with DevTools integration
- Type-safe store definitions with TypeScript
- Persist middleware for cart and wishlist
- Store composition and export patterns

**Cart Store Capabilities:**
- Complete cart item management (add, update, remove, clear)
- LKR currency formatting with රු symbol
- Computed totals (subtotal, tax, total)
- Inventory validation
- Cross-tab synchronization
- Guest-to-user cart merging

**Wishlist Store Features:**
- Product favoriting functionality
- Backend synchronization for authenticated users
- Local persistence for guest users
- Duplicate prevention
- Optimistic updates

**Customer Store Functionality:**
- Login and logout operations
- User registration with validation
- Profile management
- Address management
- Secure token storage
- Automatic token refresh
- Session persistence

**UI Store Components:**
- Mobile menu state control
- Cart drawer visibility management
- Search overlay state
- Quick view modal coordination
- Body scroll locking
- Keyboard accessibility support

### Integration Points

**Store Interconnections:**
- Cart store coordinates with customer store for user-specific carts
- Cart persistence merges guest and authenticated user carts on login
- Wishlist syncs with backend using customer authentication
- UI store coordinates cart drawer with mobile menu state
- Customer logout triggers cart and wishlist clearing (configurable)

**Component Integration:**
- Cart components consume cart store for display and actions
- Navigation uses cart store for item count badge
- Product components use wishlist store for favorite status
- Authentication forms use customer store for login/register
- Layout components use UI store for responsive navigation

**API Integration:**
- Cart store validates inventory via API client
- Wishlist syncs with backend wishlist endpoints
- Customer store authenticates via backend API
- Token refresh uses API client for renewal
- Analytics tracking sends events to backend

### Sri Lankan Localization Applied

**Currency Formatting:**
- All prices displayed in LKR with රු symbol
- Intl.NumberFormat with en-LK locale
- Comma separators per Sri Lankan conventions (e.g., රු 12,500.00)

**Phone Number Format:**
- Customer phone stored in +94 XX XXX XXXX format
- Validation enforces Sri Lankan mobile patterns
- Display formatting with proper spacing

**Tax Calculations:**
- Tax rates follow Sri Lankan regulations
- VAT calculations where applicable
- Tax amounts clearly separated in cart totals

### Next Steps

With the core store infrastructure complete, proceed to:

1. **Group-E Document 02 (Tasks 71-76):**
   - Recently viewed products store
   - Compare products store
   - Product filters store
   - TanStack Query integration
   - Optimistic updates configuration
   - Store performance optimization

2. **Store Testing:**
   - Unit tests for all store actions
   - Integration tests for store interactions
   - Persistence layer testing
   - Cross-tab synchronization verification

3. **Component Integration:**
   - Connect cart components to cart store
   - Implement wishlist UI with wishlist store
   - Build authentication forms with customer store
   - Create responsive navigation with UI store

4. **Performance Optimization:**
   - Implement store selectors for efficient re-renders
   - Add memoization for computed values
   - Optimize persistence strategies
   - Profile store performance

5. **Security Hardening:**
   - Audit token storage security
   - Implement CSP for token protection
   - Add XSS prevention measures
   - Review localStorage security

**Navigation:**
- **Current:** [Group-E Doc 01 - Store Setup & Core Stores]
- **Next:** [Group-E Doc 02 - Extended Stores & Query](02_Tasks-71-76_Extended-Stores-Query.md)

---

**Document End** | Tasks 61-70 Complete | Total Lines: ~990 | Proceed to Document 02

