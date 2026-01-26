# Tasks 09-16: Panels, Context & Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** A - POS Routes & Layout Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Routes-Header.md](01_Tasks-01-08_Routes-Header.md)
- **→ Next Group:** [../Group-B_Product-Search-Quick-Buttons/](../Group-B_Product-Search-Quick-Buttons/)

---

## Document Overview

This document covers the main POS container layout with product and cart panels, state management through context provider, offline indicator, keyboard shortcuts, and final route verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Create POS Main Container | Medium |
| 10 | Create Product Panel | Low |
| 11 | Create Cart Panel | Low |
| 12 | Create POS Context Provider | Medium |
| 13 | Create POS State Types | Medium |
| 14 | Create Offline Mode Indicator | Low |
| 15 | Create POS Keyboard Shortcuts | Medium |
| 16 | Verify POS Route Structure | Low |

---

## Task 09: Create POS Main Container

### Overview
Create the main container component that divides the POS interface into two primary panels: the product selection panel on the left and the cart panel on the right, with responsive layout support.

### Dependencies
- Task 02: Create POS Layout
- Task 03: Create POS Page Route

### Instructions

1. **Create main container component**
   - Create `POSMainContainer.tsx` in `components/modules/pos/`
   - Use client component for interactivity
   - Container holds product and cart panels

2. **Define container structure**
   - Use CSS Grid or Flexbox for two-column layout
   - Left column: Product panel (60-70% width)
   - Right column: Cart panel (30-40% width)
   - Full height minus header

3. **Add responsive behavior**
   - Desktop: Side-by-side columns
   - Tablet: Adjust column ratios
   - Mobile: Stack vertically or use tabs
   - Breakpoints at 768px and 1024px

4. **Configure column sizing**
   - Left panel: Flexible width with minimum
   - Right panel: Fixed or flexible width
   - Optional resize handle between panels
   - Persist user preferences in localStorage

5. **Add gap and spacing**
   - Gap between panels (e.g., 16px)
   - Padding within container
   - Ensure panels don't touch edges
   - Maintain visual breathing room

6. **Handle overflow**
   - Each panel scrolls independently
   - Main container doesn't scroll
   - Preserve header visibility
   - Smooth scrolling behavior

7. **Add container styling**
   - Background color for main area
   - Border or shadow between panels
   - Consistent with POS theme
   - Professional appearance

### Two-Column Layout Diagram
```
┌─────────────────────────────────────────────────────────────┐
│ POS Header (From Task 06)                                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────┬───────────────────────────────┐
│ Product Panel (Left)        │ Cart Panel (Right)            │
│ 60-70% Width                │ 30-40% Width                  │
│                             │                               │
│ • Search Bar                │ • Cart Items                  │
│ • Quick Buttons             │ • Totals                      │
│ • Product Grid              │ • Payment Actions             │
│                             │                               │
│ (Scrollable)                │ (Scrollable)                  │
│                             │                               │
└─────────────────────────────┴───────────────────────────────┘
```

### Layout Configurations

| Screen Size | Product Panel | Cart Panel | Layout |
|-------------|---------------|------------|--------|
| Desktop (>1024px) | 65% | 35% | Side-by-side |
| Tablet (768-1024px) | 60% | 40% | Side-by-side |
| Mobile (<768px) | 100% | Tab/Modal | Stacked/Toggle |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/POSMainContainer.tsx

// 'use client' directive
// Imports
// POSMainContainer component
//   - Grid/Flex container
//   - Left panel slot
//   - Right panel slot
//   - Responsive classes
```

### Verification Checklist
- [ ] `POSMainContainer.tsx` created
- [ ] Two-column layout implemented
- [ ] Column widths appropriate
- [ ] Gap and spacing correct
- [ ] Responsive breakpoints work
- [ ] Independent scrolling enabled
- [ ] Styling consistent with theme
- [ ] Component exported properly

---

## Task 10: Create Product Panel

### Overview
Create the product panel component that serves as the container for product search and quick access buttons, occupying the left side of the POS interface.

### Dependencies
- Task 09: Create POS Main Container

### Instructions

1. **Create product panel component**
   - Create `ProductPanel/` directory in `components/modules/pos/`
   - Create `ProductPanel.tsx` in ProductPanel directory
   - Container for product selection features

2. **Define panel structure**
   - Vertical layout with sections
   - Search bar at top (from Group B)
   - Quick buttons below search
   - Category filters (from Group B)

3. **Add panel header**
   - Title: "Products" or "Select Items"
   - Optional icon
   - Clean, minimal design
   - Fixed at top of panel

4. **Create sections container**
   - Stack sections vertically
   - Adequate spacing between sections
   - Each section scrollable if needed
   - Smooth scroll behavior

5. **Add placeholder sections**
   - Search bar placeholder (Task 17)
   - Quick buttons placeholder (Task 23)
   - Reserve space for future components
   - Add comments for clarity

6. **Style panel appropriately**
   - Background color distinct from main
   - Border or shadow for definition
   - Padding for content breathing room
   - Professional, clean appearance

7. **Configure scrolling**
   - Panel content scrollable
   - Header remains fixed (optional)
   - Smooth scroll on touch devices
   - Hide scrollbar or style minimally

### Product Panel Layout
```
┌─────────────────────────────┐
│ Products                    │ ← Header
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Search Bar              │ │ ← Search (Task 17)
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Category Tabs           │ │ ← Filters (Task 26)
│ └─────────────────────────┘ │
│                             │
│ ┌───┬───┬───┬───┐          │
│ │ □ │ □ │ □ │ □ │          │
│ ├───┼───┼───┼───┤          │ ← Quick Buttons
│ │ □ │ □ │ □ │ □ │          │   (Task 23-25)
│ └───┴───┴───┴───┘          │
│                             │
│ (Scrollable Content)        │
└─────────────────────────────┘
```

### Panel Sections

| Section | Component | Purpose |
|---------|-----------|---------|
| Header | Panel Title | Identify panel purpose |
| Search | Search Bar | Find products quickly |
| Filters | Category Tabs | Filter by category |
| Quick Access | Button Grid | Popular products |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/ProductPanel.tsx

// 'use client' directive
// Imports
// ProductPanel component
//   - Panel header
//   - Search section placeholder
//   - Quick buttons section placeholder
//   - Scrollable container
```

### Verification Checklist
- [ ] `ProductPanel/` directory created
- [ ] `ProductPanel.tsx` exists
- [ ] Panel header present
- [ ] Vertical layout structured
- [ ] Section placeholders added
- [ ] Scrolling configured
- [ ] Styling applied
- [ ] Component exported

---

## Task 11: Create Cart Panel

### Overview
Create the cart panel component that displays selected items, quantities, totals, and payment actions, occupying the right side of the POS interface.

### Dependencies
- Task 09: Create POS Main Container

### Instructions

1. **Create cart panel component**
   - Create `CartPanel/` directory in `components/modules/pos/`
   - Create `CartPanel.tsx` in CartPanel directory
   - Container for cart and checkout features

2. **Define panel structure**
   - Vertical layout with three main sections
   - Cart header at top
   - Cart items in middle (scrollable)
   - Totals and actions at bottom (fixed)

3. **Add panel header**
   - Title: "Cart" or "Current Sale"
   - Item count badge
   - Clear cart button (small, unobtrusive)
   - Fixed at top of panel

4. **Create cart items section**
   - Scrollable list of cart items
   - Placeholder for empty state
   - Takes flexible height
   - Smooth scrolling

5. **Add cart totals section**
   - Fixed at bottom of panel
   - Subtotal, discounts, tax display
   - Grand total (prominent)
   - Payment action buttons

6. **Create empty state**
   - Display when cart is empty
   - Icon and message: "Cart is empty"
   - Instructions: "Add items to begin"
   - Centered in items section

7. **Style panel appropriately**
   - Background distinct from product panel
   - Clear section separation
   - Adequate padding
   - Professional appearance

### Cart Panel Layout
```
┌───────────────────────────┐
│ Cart (3 items)      [×]   │ ← Header
├───────────────────────────┤
│ Item 1            LKR 100 │
│ Item 2            LKR 250 │
│ Item 3            LKR 150 │ ← Items List
│                           │   (Scrollable)
│                           │
├───────────────────────────┤
│ Subtotal      LKR 500.00  │
│ Discount      LKR -50.00  │
│ Tax (15%)     LKR  67.50  │ ← Totals
│                           │   (Fixed)
│ Total         LKR 517.50  │
│                           │
│ [ Pay ]     [ Clear ]     │ ← Actions
└───────────────────────────┘
```

### Panel Sections

| Section | Position | Content |
|---------|----------|---------|
| Header | Top (Fixed) | Title, count, clear |
| Items | Middle (Scroll) | Cart item rows |
| Totals | Bottom (Fixed) | Calculations |
| Actions | Bottom (Fixed) | Pay, clear buttons |

### Empty Cart State
```
┌───────────────────────────┐
│ Cart (0 items)            │
├───────────────────────────┤
│                           │
│           🛒              │
│                           │
│     Cart is empty         │
│                           │
│  Add items to begin       │
│                           │
└───────────────────────────┘
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/CartPanel/CartPanel.tsx

// 'use client' directive
// Imports
// CartPanel component
//   - Panel header
//   - Items list (scrollable)
//   - Empty state
//   - Totals section
//   - Action buttons
```

### Verification Checklist
- [ ] `CartPanel/` directory created
- [ ] `CartPanel.tsx` exists
- [ ] Three-section layout structured
- [ ] Header with title and count
- [ ] Items section scrollable
- [ ] Empty state designed
- [ ] Totals section fixed
- [ ] Action buttons present
- [ ] Styling applied

---

## Task 12: Create POS Context Provider

### Overview
Create a React Context provider to manage global POS state, including cart items, shift information, and UI state, making data accessible throughout the POS interface.

### Dependencies
- Task 03: Create POS Page Route
- Task 13: Create POS State Types (can be done in parallel)

### Instructions

1. **Create context directory**
   - Create `context/` directory in `components/modules/pos/`
   - Create `POSContext.tsx` in context directory
   - Central state management for POS

2. **Define context interface**
   - Create POSContextType interface
   - Include state properties:
     - Cart items array
     - Current shift info
     - Customer info
     - UI state (modals, loading)
   - Include action functions

3. **Create context instance**
   - Use React.createContext()
   - Initialize with undefined
   - Export context for useContext hook

4. **Create provider component**
   - Define POSProvider component
   - Accept children prop
   - Manage state with useState/useReducer
   - Provide value to context

5. **Implement state management**
   - Cart operations:
     - addToCart(item)
     - updateQuantity(id, quantity)
     - removeFromCart(id)
     - clearCart()
   - Shift operations:
     - setShift(shift)
     - clearShift()
   - UI operations:
     - openModal(modal)
     - closeModal()

6. **Add state persistence**
   - Save cart to localStorage
   - Restore on mount
   - Clear on logout
   - Handle offline scenarios

7. **Create custom hook**
   - Create usePOS() hook
   - Wraps useContext
   - Throws error if used outside provider
   - Export for easy consumption

8. **Wrap application**
   - Add POSProvider to page.tsx
   - Wrap entire POS interface
   - Ensure context available to all children

### Context Structure Diagram
```
POSProvider
    │
    ├─── Cart State
    │    ├─── items: CartItem[]
    │    ├─── addToCart()
    │    ├─── updateQuantity()
    │    └─── removeFromCart()
    │
    ├─── Shift State
    │    ├─── currentShift: Shift | null
    │    ├─── setShift()
    │    └─── clearShift()
    │
    ├─── Customer State
    │    ├─── customer: Customer | null
    │    └─── setCustomer()
    │
    └─── UI State
         ├─── modals: ModalState
         ├─── loading: boolean
         └─── openModal()
```

### Context State Properties

| Property | Type | Purpose |
|----------|------|---------|
| cartItems | CartItem[] | Current cart items |
| currentShift | Shift \| null | Active shift info |
| customer | Customer \| null | Attached customer |
| isLoading | boolean | Loading state |
| activeModal | string \| null | Current modal |

### Expected File Structure
```typescript
// File: frontend/components/modules/pos/context/POSContext.tsx

// Imports
// POSContextType interface
// Context creation
// POSProvider component
//   - State management
//   - Action functions
//   - Context value
// usePOS hook
// Exports
```

### Verification Checklist
- [ ] `context/` directory created
- [ ] `POSContext.tsx` exists
- [ ] Context interface defined
- [ ] Context created with createContext
- [ ] Provider component implemented
- [ ] State management functions added
- [ ] usePOS hook created
- [ ] localStorage persistence added
- [ ] Provider wraps POS page

---

## Task 13: Create POS State Types

### Overview
Define comprehensive TypeScript types and interfaces for all POS-related state, ensuring type safety and clear data structures throughout the POS module.

### Dependencies
- Task 12: Create POS Context Provider (can be done in parallel)

### Instructions

1. **Create types file**
   - Create `types.ts` in `components/modules/pos/`
   - Define all POS-related types
   - Export for use throughout module

2. **Define CartItem type**
   - Product ID and name
   - Variant information (optional)
   - Quantity and unit price
   - Line discount (optional)
   - Calculated line total
   - Metadata (added timestamp, etc.)

3. **Define Shift type**
   - Shift ID
   - Cashier user ID and name
   - Opening/closing timestamps
   - Opening cash amount
   - Current status (open, paused, closed)
   - Transaction count
   - Total sales amount

4. **Define Customer type**
   - Customer ID
   - Name and contact info
   - Customer type (regular, loyalty)
   - Loyalty points (optional)
   - Discount eligibility

5. **Define Payment types**
   - Payment method enum (cash, card, bank)
   - Payment record interface:
     - Method
     - Amount
     - Reference (for card/bank)
     - Timestamp
   - Split payment support

6. **Define Discount type**
   - Discount type (percentage, fixed)
   - Value
   - Reason (optional)
   - Applied by user
   - Timestamp

7. **Define Modal state types**
   - Modal name enum
   - Modal data interface
   - Modal callback functions

8. **Define Sale type**
   - Sale ID
   - Items array
   - Customer (optional)
   - Discounts
   - Tax calculations
   - Payments
   - Timestamps
   - Status (pending, completed, held)

### Type Definitions Overview

| Type | Purpose | Key Properties |
|------|---------|----------------|
| CartItem | Shopping cart item | product, variant, quantity, price |
| Shift | Cashier shift | id, cashier, timestamps, totals |
| Customer | Customer info | id, name, contact, loyalty |
| Payment | Payment record | method, amount, reference |
| Discount | Discount record | type, value, reason |
| Sale | Complete transaction | items, customer, payments, status |

### CartItem Structure
```
CartItem
├── id: string
├── productId: string
├── productName: string
├── variantId?: string
├── variantName?: string
├── quantity: number
├── unitPrice: number
├── discount?: Discount
├── lineTotal: number
└── addedAt: Date
```

### Shift Structure
```
Shift
├── id: string
├── cashierId: string
├── cashierName: string
├── status: 'open' | 'paused' | 'closed'
├── openedAt: Date
├── closedAt?: Date
├── openingCash: number
├── expectedCash: number
├── actualCash?: number
├── transactionCount: number
└── totalSales: number
```

### Expected File Structure
```typescript
// File: frontend/components/modules/pos/types.ts

// CartItem interface
// Shift interface
// Customer interface
// Payment types
// Discount interface
// Modal types
// Sale interface
// Utility types
// Exports
```

### Verification Checklist
- [ ] `types.ts` file created
- [ ] CartItem interface defined
- [ ] Shift interface defined
- [ ] Customer interface defined
- [ ] Payment types defined
- [ ] Discount interface defined
- [ ] Modal types defined
- [ ] Sale interface defined
- [ ] All types exported
- [ ] Used in POSContext

---

## Task 14: Create Offline Mode Indicator

### Overview
Create an offline mode indicator that displays connection status and alerts users when the application is offline, ensuring awareness of connectivity issues during POS operations.

### Dependencies
- Task 02: Create POS Layout

### Instructions

1. **Create indicator component**
   - Create `OfflineIndicator.tsx` in `components/modules/pos/`
   - Use client component for network detection
   - Add to POS layout or header

2. **Implement connection detection**
   - Use navigator.onLine property
   - Listen to online/offline events
   - Update state on connection change
   - Check periodically with ping

3. **Design indicator UI**
   - Small, unobtrusive when online
   - Prominent banner when offline
   - Color coding: green (online), red (offline)
   - Icon: Wi-Fi or connection symbol

4. **Add offline banner**
   - Display at top when offline
   - Message: "No internet connection - Working offline"
   - Warning about limited functionality
   - Dismiss option (but keep indicator)

5. **Handle offline functionality**
   - Document what works offline:
     - Cart operations (local)
     - Price calculations
     - Sale holding
   - Document what doesn't work:
     - Product search (server)
     - Payment processing (server)
     - Sale completion (server)

6. **Add sync indicator**
   - Show when syncing pending data
   - Count of pending operations
   - Manual sync button
   - Auto-sync when online

7. **Style indicator appropriately**
   - Fixed position (top or corner)
   - High z-index (above other content)
   - Smooth transitions
   - Accessible (screen reader announcements)

### Connection States

| State | Indicator | Banner | Functionality |
|-------|-----------|--------|---------------|
| Online | Green dot | Hidden | Full |
| Offline | Red dot | Visible | Limited |
| Syncing | Yellow pulse | Visible | Full |

### Offline Banner Layout
```
┌─────────────────────────────────────────────────────┐
│ ⚠️  No internet connection - Working offline    [×] │
│ Some features unavailable. Sales will sync when     │
│ connection is restored.                             │
└─────────────────────────────────────────────────────┘
```

### Indicator Positions
```
Header Position:
┌─────────────────────────────────────────┐
│ POS Header              ● Online   [×]  │ ← Small indicator
└─────────────────────────────────────────┘

Banner Position:
┌─────────────────────────────────────────┐
│ ⚠️  Offline Warning Banner              │ ← Full banner
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ POS Header                              │
└─────────────────────────────────────────┘
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/OfflineIndicator.tsx

// 'use client' directive
// Imports
// OfflineIndicator component
//   - Connection state
//   - Event listeners
//   - Indicator UI
//   - Offline banner
//   - Sync status
```

### Verification Checklist
- [ ] `OfflineIndicator.tsx` created
- [ ] Connection detection implemented
- [ ] Online/offline events handled
- [ ] Indicator displays correctly
- [ ] Offline banner appears when offline
- [ ] Color coding appropriate
- [ ] Sync status shown
- [ ] Accessible announcements
- [ ] Component positioned correctly

---

## Task 15: Create POS Keyboard Shortcuts

### Overview
Implement keyboard shortcuts for common POS operations to improve efficiency and speed for experienced cashiers, enabling rapid transaction processing without mouse usage.

### Dependencies
- Task 03: Create POS Page Route
- Task 12: Create POS Context Provider

### Instructions

1. **Create keyboard handler hook**
   - Create `hooks/` directory in `components/modules/pos/`
   - Create `useKeyboardShortcuts.ts`
   - Custom hook for shortcut management

2. **Define shortcut mappings**
   - Create shortcut configuration object
   - Map keys to actions
   - Consider common POS workflows
   - Document each shortcut

3. **Implement core shortcuts**
   - F2: Focus search bar
   - F3: Open payment modal
   - F4: Hold current sale
   - F5: Retrieve held sale
   - Escape: Cancel/close modal
   - Enter: Confirm action
   - Delete: Remove selected cart item

4. **Add quantity shortcuts**
   - Number keys (1-9): Quick quantity entry
   - + / -: Increment/decrement quantity
   - * : Open quantity input
   - / : Open discount modal

5. **Implement global listener**
   - Add keydown event listener
   - Check for modifier keys (Ctrl, Alt)
   - Prevent default browser actions
   - Only when POS page active

6. **Handle input focus**
   - Disable shortcuts when typing in inputs
   - Check event.target.tagName
   - Allow shortcuts in specific contexts
   - Prevent conflicts with normal typing

7. **Add shortcut help modal**
   - Create modal to display all shortcuts
   - Triggered by ? key or F1
   - Categorize shortcuts
   - Printable reference guide

8. **Provide visual feedback**
   - Show key hints in UI (optional)
   - Display active shortcut
   - Confirmation on action
   - Error handling for invalid shortcuts

### Keyboard Shortcuts Reference

| Shortcut | Action | Category |
|----------|--------|----------|
| F2 | Focus search | Navigation |
| F3 | Open payment | Transaction |
| F4 | Hold sale | Transaction |
| F5 | Retrieve sale | Transaction |
| F12 | Close shift | Shift |
| Escape | Close modal | Navigation |
| Enter | Confirm | Action |
| Delete | Remove item | Cart |
| + | Increase quantity | Cart |
| - | Decrease quantity | Cart |
| * | Set quantity | Cart |
| / | Apply discount | Cart |
| 1-9 | Quick quantity | Cart |

### Shortcut Categories
```
Navigation Shortcuts
├── F2: Focus search bar
├── Escape: Close modal/cancel
└── Tab: Navigate fields

Transaction Shortcuts
├── F3: Open payment modal
├── F4: Hold current sale
├── F5: Retrieve held sale
└── F12: Close shift

Cart Shortcuts
├── +/-: Adjust quantity
├── *: Set quantity
├── /: Apply discount
└── Delete: Remove item
```

### Shortcut Help Modal
```
┌─────────────────────────────────────────┐
│ Keyboard Shortcuts              [×]     │
├─────────────────────────────────────────┤
│ Navigation                              │
│ F2     Focus search bar                 │
│ Esc    Close modal                      │
│                                         │
│ Transactions                            │
│ F3     Open payment                     │
│ F4     Hold sale                        │
│ F5     Retrieve sale                    │
│                                         │
│ Cart Operations                         │
│ +/-    Adjust quantity                  │
│ Del    Remove item                      │
│                                         │
│ [ Print Reference ]                     │
└─────────────────────────────────────────┘
```

### Expected File Structure
```typescript
// File: frontend/components/modules/pos/hooks/useKeyboardShortcuts.ts

// Imports
// Shortcut configuration
// useKeyboardShortcuts hook
//   - Event listener setup
//   - Shortcut handler
//   - Input focus check
//   - Action dispatcher
// Export hook
```

### Verification Checklist
- [ ] `hooks/` directory created
- [ ] `useKeyboardShortcuts.ts` exists
- [ ] Shortcut mappings defined
- [ ] Core shortcuts implemented
- [ ] Global listener added
- [ ] Input focus handled
- [ ] Help modal created
- [ ] Visual feedback provided
- [ ] Hook used in POS page
- [ ] All shortcuts tested

---

## Task 16: Verify POS Route Structure

### Overview
Perform comprehensive verification of the complete POS route structure, layout, components, and functionality to ensure all foundational elements are correctly implemented and working together.

### Dependencies
- All previous tasks (01-15)

### Instructions

1. **Verify directory structure**
   - Check all directories exist
   - Verify file naming conventions
   - Ensure proper organization
   - Confirm exports and imports

2. **Test route navigation**
   - Navigate to `/pos` URL
   - Verify layout loads correctly
   - Check that sidebar is hidden
   - Confirm full-screen display

3. **Test loading states**
   - Verify loading.tsx displays
   - Check loading animation
   - Confirm transition to page
   - Test slow network simulation

4. **Test error boundary**
   - Trigger intentional error
   - Verify error.tsx displays
   - Test "Try Again" button
   - Test "Return to Dashboard" link

5. **Test header components**
   - Verify header displays
   - Test exit button and confirmation
   - Check shift status display
   - Test shift info popover

6. **Test panel layout**
   - Verify two-column layout
   - Check responsive behavior
   - Test panel scrolling
   - Verify independent scroll

7. **Test context provider**
   - Verify context wraps page
   - Test usePOS hook
   - Check state updates
   - Verify persistence

8. **Test offline indicator**
   - Simulate offline mode
   - Verify indicator appears
   - Check banner display
   - Test online transition

9. **Test keyboard shortcuts**
   - Test each shortcut
   - Verify actions execute
   - Check help modal
   - Test input focus handling

10. **Document test results**
    - Create checklist of tests
    - Note any issues found
    - Document resolutions
    - Confirm all tests pass

### Verification Checklist

#### Directory Structure
- [ ] `frontend/app/(pos)/` exists
- [ ] `frontend/app/(pos)/layout.tsx` exists
- [ ] `frontend/app/(pos)/pos/page.tsx` exists
- [ ] `frontend/app/(pos)/pos/loading.tsx` exists
- [ ] `frontend/app/(pos)/pos/error.tsx` exists
- [ ] `frontend/components/modules/pos/` directory structured

#### Components
- [ ] POSHeader component renders
- [ ] ExitPOSButton works with confirmation
- [ ] ShiftStatus displays correctly
- [ ] POSMainContainer shows two panels
- [ ] ProductPanel renders
- [ ] CartPanel renders
- [ ] OfflineIndicator displays

#### State Management
- [ ] POSContext provider wraps page
- [ ] usePOS hook accessible
- [ ] State updates correctly
- [ ] localStorage persistence works
- [ ] Types defined and used

#### Functionality
- [ ] Route accessible at `/pos`
- [ ] Full-screen layout (no sidebar)
- [ ] Loading state displays
- [ ] Error boundary catches errors
- [ ] Exit confirmation works
- [ ] Keyboard shortcuts active
- [ ] Offline detection works

#### Responsiveness
- [ ] Desktop layout correct
- [ ] Tablet layout adjusts
- [ ] Mobile layout stacks
- [ ] Touch targets appropriate
- [ ] Scrolling smooth

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] ARIA attributes correct

### Test Scenarios

| Test | Action | Expected Result |
|------|--------|-----------------|
| Route Access | Navigate to /pos | POS page loads |
| Layout | Check display | Full-screen, no sidebar |
| Exit | Click exit, confirm | Returns to dashboard |
| Shift Status | Click status | Popover shows details |
| Offline | Disable network | Banner appears |
| Shortcut | Press F2 | Search focused |
| Error | Trigger error | Error boundary catches |

### Directory Structure Verification
```
frontend/
├── app/
│   └── (pos)/
│       ├── layout.tsx                    ✓
│       └── pos/
│           ├── page.tsx                  ✓
│           ├── loading.tsx               ✓
│           └── error.tsx                 ✓
└── components/
    └── modules/
        └── pos/
            ├── POSMainContainer.tsx      ✓
            ├── ProductPanel/
            │   └── ProductPanel.tsx      ✓
            ├── CartPanel/
            │   └── CartPanel.tsx         ✓
            ├── Header/
            │   ├── POSHeader.tsx         ✓
            │   ├── ExitPOSButton.tsx     ✓
            │   └── ShiftStatus.tsx       ✓
            ├── context/
            │   └── POSContext.tsx        ✓
            ├── hooks/
            │   └── useKeyboardShortcuts.ts ✓
            ├── types.ts                  ✓
            └── OfflineIndicator.tsx      ✓
```

### Verification Steps

1. **Manual Testing**
   - Open browser to `/pos`
   - Interact with each component
   - Test all shortcuts
   - Verify responsive design

2. **Console Checks**
   - No error messages
   - No warning messages
   - State updates logged correctly
   - Network requests monitored

3. **Performance**
   - Initial load time reasonable
   - No layout shifts
   - Smooth scrolling
   - Responsive interactions

4. **Cross-Browser**
   - Test in Chrome
   - Test in Firefox
   - Test in Safari
   - Test on mobile devices

### Expected Outcome
Complete, functional POS route structure ready for feature implementation in subsequent groups.

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Create POS Main Container | Two-column responsive layout |
| 10 | Create Product Panel | Left panel for product selection |
| 11 | Create Cart Panel | Right panel for cart and checkout |
| 12 | Create POS Context Provider | Global state management |
| 13 | Create POS State Types | TypeScript interfaces |
| 14 | Create Offline Mode Indicator | Connection status display |
| 15 | Create POS Keyboard Shortcuts | Efficiency shortcuts |
| 16 | Verify POS Route Structure | Complete verification |

### Complete Group A Progress
```
frontend/
├── app/
│   └── (pos)/
│       ├── layout.tsx                          ✓
│       └── pos/
│           ├── page.tsx                        ✓
│           ├── loading.tsx                     ✓
│           └── error.tsx                       ✓
└── components/
    └── modules/
        └── pos/
            ├── POSMainContainer.tsx            ✓
            ├── ProductPanel/
            │   └── ProductPanel.tsx            ✓
            ├── CartPanel/
            │   └── CartPanel.tsx               ✓
            ├── Header/
            │   ├── POSHeader.tsx               ✓
            │   ├── ExitPOSButton.tsx           ✓
            │   └── ShiftStatus.tsx             ✓
            ├── context/
            │   └── POSContext.tsx              ✓
            ├── hooks/
            │   └── useKeyboardShortcuts.ts     ✓
            ├── types.ts                        ✓
            └── OfflineIndicator.tsx            ✓
```

### Group A Complete: Foundation Ready
✓ **All Tasks Completed (01-16)**
- Route structure with dedicated layout
- Header with exit and shift status
- Two-panel layout
- State management with context
- TypeScript types
- Offline detection
- Keyboard shortcuts
- Verified and tested

### Next Steps
Proceed to **Group B: Product Search & Quick Buttons** to implement product selection features.

Navigate to: [../Group-B_Product-Search-Quick-Buttons/01_Tasks-17-28_Search-QuickButtons.md](../Group-B_Product-Search-Quick-Buttons/01_Tasks-17-28_Search-QuickButtons.md)

---

## Notes for AI Agents

1. **Two-Column Layout:** Product panel (left, 60-70%) and Cart panel (right, 30-40%) with independent scrolling
2. **Context Provider:** Centralized state management using React Context, persisted to localStorage
3. **Type Safety:** Comprehensive TypeScript types for all POS entities ensure type safety
4. **Offline Support:** Detect connectivity, show status, and handle offline operations gracefully
5. **Keyboard Shortcuts:** Enable power users to work faster without mouse navigation
6. **Verification:** Always verify complete implementation before proceeding to next group
7. **Next Group:** Product search, quick buttons, and category filtering features
8. **Integration:** All foundation components ready for feature implementation
