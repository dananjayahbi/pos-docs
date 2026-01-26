# Tasks 67-75: Payment Modal & Cash Payment

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** E - Payment Processing  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Discount-Tax-Calculations/](../Group-D_Discount-Tax-Calculations/)
- **→ Next Document:** [02_Tasks-76-82_Methods-Split-Complete.md](02_Tasks-76-82_Methods-Split-Complete.md)

---

## Document Overview

This document covers cart action buttons creation, payment modal interface with amount display, payment methods grid, cash payment option with numpad interface and quick amounts, and change calculation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create Cart Action Buttons Section | Medium |
| 68 | Create Pay Button | Low |
| 69 | Create Payment Modal | High |
| 70 | Create Payment Amount Display | Medium |
| 71 | Create Payment Methods Grid | Medium |
| 72 | Create Cash Payment Option | Medium |
| 73 | Create Numpad Component | Medium |
| 74 | Create Quick Amount Buttons | Low |
| 75 | Create Change Calculator | Medium |

---

## Task 67: Create Cart Action Buttons Section

### Overview
Create the cart action buttons section at the bottom of the cart panel with primary actions like Pay, Hold, and Clear Cart.

### Dependencies
- Group C, Task 35: Create Cart Container

### Instructions

1. **Create action buttons section**
   - Create `CartActionButtons.tsx` in Cart directory
   - Fixed at bottom of cart
   - Below totals section
   - Container for action buttons

2. **Define button layout**
   - Primary button: Pay (Task 68)
   - Secondary button: Hold Sale
   - Tertiary button: Clear Cart
   - Horizontal arrangement
   - Equal or weighted widths

3. **Position section**
   - Fixed at bottom
   - Full width of cart panel
   - Above any padding
   - Visible always

4. **Style container**
   - Background: Distinct from totals
   - Padding: 12-16px
   - Border top: Optional separator
   - Flexbox layout

5. **Make responsive**
   - Stack on very narrow widths
   - Maintain touch targets
   - Buttons remain accessible
   - Clear priorities

6. **Handle disabled states**
   - Pay: Disabled if cart empty
   - Hold: Disabled if cart empty
   - Clear: Disabled if cart empty
   - Visual feedback

7. **Add keyboard shortcuts**
   - Pay: F2 or Ctrl+Enter
   - Hold: F3
   - Clear: Shift+Delete
   - Document in help

### Action Buttons Layout
```
┌──────────────────────────────────┐
│ [      PAY - LKR 517.50      ]  │ ← Primary, full width
├──────────────────────────────────┤
│ [ Hold Sale ] [ Clear Cart ]    │ ← Secondary, side-by-side
└──────────────────────────────────┘

Alternative:
┌──────────────────────────────────┐
│ [  PAY  ] [ Hold ] [ Clear ]    │ ← All side-by-side
└──────────────────────────────────┘
```

### Button Priorities

| Button | Type | Color | Shortcut | State |
|--------|------|-------|----------|-------|
| Pay | Primary | Green/Blue | F2 | Disabled if empty |
| Hold Sale | Secondary | Gray | F3 | Disabled if empty |
| Clear Cart | Tertiary | Red outline | Shift+Del | Disabled if empty |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/CartActionButtons.tsx

// 'use client' directive
// Imports
// CartActionButtons component
//   - Section container
//   - PayButton (Task 68)
//   - HoldSaleButton
//   - ClearCartButton
//   - Keyboard shortcuts
//   - Disabled state logic
```

### Verification Checklist
- [ ] `CartActionButtons.tsx` created
- [ ] Section positioned at bottom
- [ ] All buttons rendered
- [ ] Layout responsive
- [ ] Keyboard shortcuts work
- [ ] Disabled states correct
- [ ] Styling consistent
- [ ] Touch-friendly sizes

---

## Task 68: Create Pay Button

### Overview
Create the pay button component that opens the payment modal to process the sale transaction.

### Dependencies
- Task 67: Create Cart Action Buttons Section
- Group D, Task 63: Create Grand Total Display

### Instructions

1. **Create pay button component**
   - Create `PayButton.tsx` in Cart directory
   - Primary action button
   - Most prominent button

2. **Design button UI**
   - Text: "PAY" or "Pay - LKR XXX"
   - Large, bold text
   - Primary color (green or blue)
   - Full width or prominent
   - Min height: 48-56px

3. **Show amount on button**
   - Display grand total
   - "PAY - LKR 517.50"
   - Update dynamically
   - Clear call to action

4. **Add click handler**
   - Open payment modal (Task 69)
   - Validate cart not empty
   - Check active shift (optional)
   - Handle modal state

5. **Implement disabled state**
   - Disabled if cart empty
   - Disabled if no active shift
   - Disabled during operations
   - Show tooltip explaining why

6. **Add keyboard shortcut**
   - Shortcut: F2 or Ctrl+Enter
   - Trigger button click
   - Available when cart has items
   - Document prominently

7. **Style prominently**
   - Largest button
   - Highest contrast
   - Eye-catching color
   - Clear affordance

### Pay Button States
```
Normal:
┌──────────────────────────────┐
│    PAY - LKR 517.50         │ ← Green, bold
└──────────────────────────────┘

Disabled:
┌──────────────────────────────┐
│    PAY - LKR 0.00           │ ← Gray, disabled
└──────────────────────────────┘

Hover:
┌──────────────────────────────┐
│    PAY - LKR 517.50         │ ← Highlighted
└──────────────────────────────┘

Loading:
┌──────────────────────────────┐
│    Processing...  [spinner] │
└──────────────────────────────┘
```

### Button Behavior

| Cart State | Button State | Action | Tooltip |
|------------|--------------|--------|---------|
| Has Items | Enabled | Open modal | - |
| Empty | Disabled | None | "Add items to pay" |
| No Shift | Disabled | None | "Open shift first" |
| Processing | Loading | None | "Processing..." |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/PayButton.tsx

// Imports
// PayButton component
//   - Button element
//   - Grand total display
//   - Click handler
//   - Disabled state logic
//   - Keyboard shortcut
//   - Loading state
```

### Verification Checklist
- [ ] `PayButton.tsx` created
- [ ] Button renders prominently
- [ ] Amount displayed
- [ ] Click opens payment modal
- [ ] Disabled when cart empty
- [ ] Keyboard shortcut works (F2)
- [ ] Tooltip on disabled
- [ ] Styling eye-catching

---

## Task 69: Create Payment Modal

### Overview
Create the payment modal component that provides a complete interface for processing payments with multiple methods and split payment support.

### Dependencies
- Task 68: Create Pay Button

### Instructions

1. **Create payment modal component**
   - Create `PaymentModal.tsx` in Payment directory
   - Create directory: `components/modules/pos/Payment/`
   - Large modal dialog
   - Accept onComplete and onCancel props

2. **Define modal structure**
   - Modal overlay (semi-transparent dark)
   - Modal content container (large)
   - Header with sale summary
   - Payment amount display (Task 70)
   - Payment methods grid (Task 71)
   - Payment details section (conditional)
   - Action buttons

3. **Add modal header**
   - Title: "Process Payment"
   - Sale summary: Items, total
   - Close button (X)
   - Fixed at top

4. **Create main layout**
   - Left: Payment methods and details
   - Right: Amount display, numpad (for cash)
   - Responsive: Stack on mobile
   - Clear sections

5. **Implement payment flow**
   - Select payment method
   - Enter payment details
   - Calculate change (if cash)
   - Confirm payment
   - Process transaction

6. **Add action buttons**
   - Complete Sale (primary)
   - Cancel (secondary)
   - Back (if multi-step)
   - Clear spacing

7. **Handle modal state**
   - Open/close state
   - Selected method state
   - Payment details state
   - Loading/processing state

8. **Implement keyboard support**
   - Escape to cancel
   - Enter to complete (if valid)
   - Tab navigation
   - Focus trap

9. **Add validation**
   - Validate payment method selected
   - Validate amount sufficient
   - Validate required fields
   - Show error messages

### Payment Modal Layout
```
┌────────────────────────────────────────────────────────┐
│ Process Payment                               [×]      │
│ 3 items • Total: LKR 517.50                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌──────────────────────┐  ┌─────────────────────────┐ │
│ │ Payment Methods      │  │ Amount Due              │ │
│ │                      │  │ LKR 517.50              │ │
│ │ [Cash] [Card]        │  │                         │ │
│ │ [Bank] [Split]       │  │ Amount Tendered         │ │
│ │                      │  │ ┌─────────────────────┐ │ │
│ │ Selected: Cash       │  │ │      500.00         │ │ │
│ │                      │  │ └─────────────────────┘ │ │
│ │ Quick Amounts:       │  │                         │ │
│ │ [500] [1000] [2000]  │  │ [ 7 ][ 8 ][ 9 ]        │ │
│ │                      │  │ [ 4 ][ 5 ][ 6 ]        │ │
│ │                      │  │ [ 1 ][ 2 ][ 3 ]        │ │
│ │                      │  │ [ . ][ 0 ][ ← ]        │ │
│ │                      │  │                         │ │
│ │                      │  │ Change:                 │ │
│ │                      │  │ LKR -17.50             │ │
│ └──────────────────────┘  └─────────────────────────┘ │
│                                                        │
│               [ Cancel ] [ Complete Sale ]            │
└────────────────────────────────────────────────────────┘
```

### Modal Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Title, summary, close | Context |
| Methods | Payment method grid | Selection |
| Details | Method-specific inputs | Data entry |
| Amount Display | Total, paid, change | Calculation |
| Numpad | Number input | Cash amounts |
| Actions | Complete, cancel | Confirmation |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/PaymentModal.tsx

// 'use client' directive
// Imports
// PaymentModal props
// PaymentModal component
//   - Modal overlay
//   - Modal content
//   - Header
//   - PaymentAmountDisplay (Task 70)
//   - PaymentMethodsGrid (Task 71)
//   - Payment details section (conditional)
//   - CashPayment (Task 72) if selected
//   - CardPayment if selected
//   - Action buttons
//   - Validation logic
//   - Payment processing
```

### Verification Checklist
- [ ] `PaymentModal.tsx` created
- [ ] Payment directory created
- [ ] Modal opens/closes
- [ ] Layout responsive
- [ ] All sections render
- [ ] Method selection works
- [ ] Validation implemented
- [ ] Complete processes payment
- [ ] Cancel closes modal
- [ ] Keyboard support works
- [ ] Focus trapped

---

## Task 70: Create Payment Amount Display

### Overview
Create the payment amount display component that shows the total due, amount tendered, and change calculation in the payment modal.

### Dependencies
- Task 69: Create Payment Modal

### Instructions

1. **Create amount display component**
   - Create `PaymentAmountDisplay.tsx` in Payment directory
   - Card or panel component
   - Right side of payment modal

2. **Display total due**
   - Label: "Amount Due" or "Total"
   - Grand total from cart
   - Large, bold text
   - LKR formatted

3. **Show amount tendered**
   - Label: "Amount Tendered" or "Paying"
   - Input amount or sum of payments
   - Updates dynamically
   - Bold text

4. **Calculate and show change**
   - Label: "Change" or "Change Due"
   - Formula: Tendered - Total
   - Large text if > 0
   - Green color
   - Red if insufficient

5. **Style amount card**
   - Clear sections for each amount
   - Good spacing
   - Visual hierarchy
   - Easy to read

6. **Update in real-time**
   - Recalculate on amount change
   - Update on method change (split)
   - Smooth transitions
   - No lag

7. **Handle split payments**
   - Show total of all payments
   - Show remaining balance
   - List payment breakdown
   - Clear status

### Amount Display Layout
```
┌─────────────────────────┐
│ Amount Due              │
│ LKR 517.50             │ ← Large, bold
├─────────────────────────┤
│ Amount Tendered         │
│ LKR 550.00             │ ← Bold
├─────────────────────────┤
│ Change                  │
│ LKR 32.50              │ ← Green, large
└─────────────────────────┘

Insufficient:
┌─────────────────────────┐
│ Amount Due              │
│ LKR 517.50             │
├─────────────────────────┤
│ Amount Tendered         │
│ LKR 400.00             │
├─────────────────────────┤
│ Balance Remaining       │
│ LKR 117.50             │ ← Red
└─────────────────────────┘
```

### Amount States

| Total | Tendered | Difference | Label | Color |
|-------|----------|------------|-------|-------|
| 517.50 | 0 | -517.50 | Balance Due | Red |
| 517.50 | 400 | -117.50 | Remaining | Red |
| 517.50 | 517.50 | 0 | Exact | Green |
| 517.50 | 550 | 32.50 | Change Due | Green |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/PaymentAmountDisplay.tsx

// Imports
// PaymentAmountDisplay props
// PaymentAmountDisplay component
//   - Card container
//   - Amount due section
//   - Amount tendered section
//   - Change calculation section
//   - Color coding
//   - Format currency
```

### Verification Checklist
- [ ] `PaymentAmountDisplay.tsx` created
- [ ] All amounts displayed
- [ ] Change calculated correctly
- [ ] Color coding implemented
- [ ] Updates in real-time
- [ ] Split payments handled
- [ ] Formatting consistent
- [ ] Styling clear

---

## Task 71: Create Payment Methods Grid

### Overview
Create the payment methods grid component that displays all available payment options as selectable buttons in a grid layout.

### Dependencies
- Task 69: Create Payment Modal

### Instructions

1. **Create payment methods grid**
   - Create `PaymentMethodsGrid.tsx` in Payment directory
   - Grid of payment method buttons
   - Support 4-6 methods

2. **Define payment methods**
   - Cash (Task 72)
   - Card (Credit/Debit)
   - Bank Transfer
   - Split Payment (Task 76)
   - Other: Mobile Payment, Voucher

3. **Create method buttons**
   - Button for each method
   - Icon + label
   - Grid layout (2x2 or 3x2)
   - Large, touch-friendly

4. **Style method buttons**
   - Icons: Clear, recognizable
   - Labels: Short, clear
   - Size: Min 100x100px
   - Active state when selected

5. **Handle selection**
   - Single selection (or multiple for split)
   - Highlight selected method
   - Call onChange handler
   - Load method details

6. **Make responsive**
   - Adjust grid columns
   - Maintain button sizes
   - Stack on mobile if needed
   - Keep usable

7. **Disable unavailable methods**
   - Gray out if disabled
   - Show tooltip explaining why
   - Skip in keyboard navigation
   - Clear feedback

### Payment Methods Grid Layout
```
┌─────────────────────────────────┐
│ Select Payment Method           │
├─────────────────────────────────┤
│ ┌───────────┐  ┌───────────┐   │
│ │ 💵 Cash   │  │ 💳 Card   │   │
│ │           │  │           │   │
│ └───────────┘  └───────────┘   │
│                                 │
│ ┌───────────┐  ┌───────────┐   │
│ │ 🏦 Bank   │  │ ➗ Split   │   │
│ │ Transfer  │  │ Payment   │   │
│ └───────────┘  └───────────┘   │
└─────────────────────────────────┘

Active State:
┌───────────┐
│ 💵 Cash   │ ← Highlighted border
│ ✓         │ ← Checkmark
└───────────┘
```

### Payment Methods

| Method | Icon | Description | Details Required |
|--------|------|-------------|------------------|
| Cash | 💵 | Cash payment | Amount, numpad |
| Card | 💳 | Credit/Debit | Approval code |
| Bank | 🏦 | Bank transfer | Reference |
| Split | ➗ | Multiple methods | Sub-payments |
| Mobile | 📱 | Mobile payment | Transaction ID |
| Voucher | 🎫 | Gift voucher | Code |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/PaymentMethodsGrid.tsx

// Imports
// PaymentMethodsGrid props
// PaymentMethodsGrid component
//   - Grid container
//   - Method buttons
//   - Selection state
//   - Active styling
//   - Disabled methods
//   - Change handler
```

### Verification Checklist
- [ ] `PaymentMethodsGrid.tsx` created
- [ ] All methods displayed
- [ ] Grid layout works
- [ ] Selection changes
- [ ] Active state visible
- [ ] Icons clear
- [ ] Touch-friendly sizes
- [ ] Responsive layout

---

## Task 72: Create Cash Payment Option

### Overview
Create the cash payment option component that provides a complete cash payment interface with numpad input and change calculation.

### Dependencies
- Task 71: Create Payment Methods Grid

### Instructions

1. **Create cash payment component**
   - Create `CashPayment.tsx` in Payment directory
   - Shown when cash method selected
   - Contains numpad and quick amounts

2. **Define cash payment interface**
   - Amount input display
   - Numpad component (Task 73)
   - Quick amount buttons (Task 74)
   - Change calculator (Task 75)

3. **Create amount input display**
   - Large, read-only input
   - Shows entered amount
   - LKR formatted
   - Auto-focus

4. **Implement amount entry**
   - Use numpad for input
   - Or quick amount buttons
   - Or keyboard input
   - Clear functionality

5. **Calculate change automatically**
   - Change = Tendered - Total
   - Show in real-time
   - Highlight if positive
   - Alert if insufficient

6. **Add exact amount button**
   - Button: "Exact Amount"
   - Sets tendered to total
   - No change due
   - Quick shortcut

7. **Handle validation**
   - Minimum: 0
   - Maximum: Reasonable limit (100,000)
   - Warn if very large
   - Prevent negative

### Cash Payment Layout
```
┌─────────────────────────────┐
│ Cash Payment                │
├─────────────────────────────┤
│ Amount Tendered:            │
│ ┌─────────────────────────┐ │
│ │      550.00             │ │ ← Large input
│ └─────────────────────────┘ │
│                             │
│ Quick Amounts:              │
│ [ 500 ][ 1000 ][ 2000 ]    │
│ [ 5000 ][ Exact ]           │
│                             │
│ ┌───────────────────────┐   │
│ │ [ 7 ][ 8 ][ 9 ]      │   │ ← Numpad
│ │ [ 4 ][ 5 ][ 6 ]      │   │
│ │ [ 1 ][ 2 ][ 3 ]      │   │
│ │ [ . ][ 0 ][ ← ]      │   │
│ └───────────────────────┘   │
│                             │
│ Change Due: LKR 32.50      │ ← Large, green
└─────────────────────────────┘
```

### Cash Payment Flow
```
1. Select Cash method
   ↓
2. Enter amount (numpad or quick)
   ↓
3. Calculate change
   ↓
4. Validate sufficient
   ↓
5. Complete sale
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/CashPayment.tsx

// 'use client' directive
// Imports
// CashPayment props
// CashPayment component
//   - Amount input display
//   - QuickAmountButtons (Task 74)
//   - Numpad (Task 73)
//   - ChangeCalculator (Task 75)
//   - Exact amount button
//   - Validation
```

### Verification Checklist
- [ ] `CashPayment.tsx` created
- [ ] Amount input displays
- [ ] Numpad input works
- [ ] Quick amounts work
- [ ] Exact amount button works
- [ ] Change calculates
- [ ] Validation implemented
- [ ] Styling clear

---

## Task 73: Create Numpad Component

### Overview
Create a reusable numpad component for numeric input in the cash payment interface.

### Dependencies
- Task 72: Create Cash Payment Option

### Instructions

1. **Create numpad component**
   - Create `Numpad.tsx` in shared components
   - 4x3 button grid
   - Accept value and onChange props

2. **Define numpad layout**
   - Buttons: 0-9
   - Decimal point button
   - Backspace button
   - Clear button (optional)
   - 4 rows x 3 columns

3. **Design button grid**
   - Row 1: 7, 8, 9
   - Row 2: 4, 5, 6
   - Row 3: 1, 2, 3
   - Row 4: ., 0, Backspace
   - Large, touch-friendly

4. **Implement button actions**
   - Number buttons: Append digit
   - Decimal: Add decimal point (once)
   - Backspace: Remove last character
   - Clear: Reset to 0 (if included)

5. **Handle decimal input**
   - Allow only one decimal point
   - Format to 2 decimal places
   - Disable decimal button if present
   - Clear indication

6. **Style numpad**
   - Button size: Min 60x60px
   - Clear labels
   - Good spacing (8-12px)
   - Responsive sizing

7. **Add keyboard support**
   - Number keys: 0-9
   - Decimal: . or ,
   - Backspace: Delete last
   - Enter: Accept (optional)

### Numpad Layout
```
┌─────────────────────┐
│ [ 7 ][ 8 ][ 9 ]    │
│ [ 4 ][ 5 ][ 6 ]    │
│ [ 1 ][ 2 ][ 3 ]    │
│ [ . ][ 0 ][ ← ]    │
└─────────────────────┘

With Clear:
┌──────────────────────┐
│ [ 7 ][ 8 ][ 9 ][C]  │
│ [ 4 ][ 5 ][ 6 ]     │
│ [ 1 ][ 2 ][ 3 ]     │
│ [ . ][ 0 ][ ← ]     │
└──────────────────────┘
```

### Button Actions

| Button | Action | Notes |
|--------|--------|-------|
| 0-9 | Append digit | Build number |
| . | Add decimal | Once only |
| ← | Remove last | Backspace |
| C | Clear all | Reset to 0 |

### Expected Component Structure
```typescript
// File: frontend/components/shared/Numpad.tsx

// 'use client' directive
// Imports
// Numpad props
// Numpad component
//   - Grid container
//   - Number buttons (0-9)
//   - Decimal button
//   - Backspace button
//   - Button click handler
//   - Keyboard listener
```

### Verification Checklist
- [ ] `Numpad.tsx` created
- [ ] 4x3 grid layout
- [ ] All buttons render
- [ ] Number input works
- [ ] Decimal point works (once)
- [ ] Backspace works
- [ ] Keyboard support works
- [ ] Touch-friendly sizes
- [ ] Reusable component

---

## Task 74: Create Quick Amount Buttons

### Overview
Create quick amount buttons that allow cashiers to instantly enter common cash denominations for faster payment processing.

### Dependencies
- Task 72: Create Cash Payment Option

### Instructions

1. **Create quick amounts component**
   - Create `QuickAmountButtons.tsx` in Payment directory
   - Row of amount buttons
   - Above or near numpad

2. **Define common amounts**
   - LKR 500
   - LKR 1,000
   - LKR 2,000
   - LKR 5,000
   - "Exact" button
   - Optional: LKR 100, 200

3. **Create amount buttons**
   - Button for each amount
   - Clear label with currency
   - Horizontal layout
   - Medium size

4. **Implement button actions**
   - Click sets tendered amount
   - Replace current value
   - Or add to value (configurable)
   - Trigger change calculation

5. **Add exact amount button**
   - Special button
   - Sets tendered = total
   - No change due
   - Highlighted differently

6. **Style buttons**
   - Consistent sizing
   - Clear labels
   - Touch-friendly
   - Wrap if needed

7. **Make responsive**
   - Wrap buttons on narrow widths
   - Maintain readability
   - Keep usable
   - Good spacing

### Quick Amount Buttons Layout
```
Horizontal:
[ 500 ][ 1000 ][ 2000 ][ 5000 ][ Exact ]

With More Options:
[ 100 ][ 200 ][ 500 ][ 1000 ]
[ 2000 ][ 5000 ][ Exact ]

Wrapped:
[ 500 ][ 1000 ][ 2000 ]
[ 5000 ][ Exact ]
```

### Common Amounts (Sri Lanka)

| Amount | Usage | Frequency |
|--------|-------|-----------|
| 100 | Small purchases | Common |
| 500 | Medium purchases | Very Common |
| 1000 | Larger purchases | Very Common |
| 2000 | Bills < 2000 | Common |
| 5000 | Large bills | Occasional |
| Exact | No change | Very Common |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/QuickAmountButtons.tsx

// Imports
// QuickAmountButtons props
// QuickAmountButtons component
//   - Button container
//   - Amount buttons (500, 1000, etc.)
//   - Exact amount button
//   - Click handlers
//   - Responsive layout
```

### Verification Checklist
- [ ] `QuickAmountButtons.tsx` created
- [ ] All amount buttons render
- [ ] Buttons set amount
- [ ] Exact button works
- [ ] Labels clear
- [ ] Responsive wrapping
- [ ] Touch-friendly sizes
- [ ] Styling consistent

---

## Task 75: Create Change Calculator

### Overview
Create the change calculator component that calculates and displays the change due for cash payments.

### Dependencies
- Task 72: Create Cash Payment Option

### Instructions

1. **Create change calculator component**
   - Create `ChangeCalculator.tsx` in Payment directory
   - Calculate change amount
   - Display prominently

2. **Implement calculation**
   - Formula: Tendered - Total Due
   - Can be positive (change) or negative (insufficient)
   - Round to 2 decimals
   - Update in real-time

3. **Display change amount**
   - Large, bold text
   - Label: "Change Due" or "Change"
   - LKR formatted
   - Right or center aligned

4. **Add color coding**
   - Positive (change): Green
   - Zero (exact): Green or neutral
   - Negative (insufficient): Red
   - Clear visual feedback

5. **Show denomination breakdown**
   - Optional: Break change into notes/coins
   - Show optimal denominations
   - Help cashier prepare change
   - Example: 1×20, 1×10, 1×2

6. **Handle edge cases**
   - No amount entered: Show "Enter amount"
   - Exact amount: Show "Exact payment"
   - Insufficient: Show "Insufficient amount"
   - Clear messaging

7. **Update reactively**
   - Recalculate on amount change
   - Recalculate on total change
   - Instant updates
   - Smooth transitions

### Change Calculator Display
```
Positive Change:
┌─────────────────────────┐
│ Change Due              │
│ LKR 32.50              │ ← Large, green, bold
└─────────────────────────┘

With Breakdown:
┌─────────────────────────┐
│ Change Due              │
│ LKR 32.50              │
│                         │
│ 1 × LKR 20.00          │
│ 1 × LKR 10.00          │
│ 1 × LKR 2.00           │
│ 1 × LKR 0.50           │
└─────────────────────────┘

Insufficient:
┌─────────────────────────┐
│ Balance Remaining       │
│ LKR 117.50             │ ← Red
└─────────────────────────┘
```

### Change States

| Tendered | Total | Change | Display | Color |
|----------|-------|--------|---------|-------|
| 0 | 517.50 | -517.50 | Enter amount | Gray |
| 400 | 517.50 | -117.50 | Insufficient | Red |
| 517.50 | 517.50 | 0 | Exact | Green |
| 550 | 517.50 | 32.50 | Change Due | Green |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/ChangeCalculator.tsx

// Imports
// ChangeCalculator props
// ChangeCalculator component
//   - Calculate change
//   - Display amount
//   - Color coding
//   - Optional: Denomination breakdown
//   - Handle edge cases
```

### Verification Checklist
- [ ] `ChangeCalculator.tsx` created
- [ ] Change calculated correctly
- [ ] Display prominent
- [ ] Color coding implemented
- [ ] Edge cases handled
- [ ] Updates in real-time
- [ ] Denomination breakdown (optional)
- [ ] Styling clear

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | Create Cart Action Buttons Section | Action buttons container |
| 68 | Create Pay Button | Primary pay button |
| 69 | Create Payment Modal | Complete payment interface |
| 70 | Create Payment Amount Display | Amount due/tendered/change |
| 71 | Create Payment Methods Grid | Payment method selection |
| 72 | Create Cash Payment Option | Cash payment interface |
| 73 | Create Numpad Component | Numeric input component |
| 74 | Create Quick Amount Buttons | Quick cash amounts |
| 75 | Create Change Calculator | Change calculation display |

### Current Progress
```
frontend/components/modules/pos/
├── Cart/
│   ├── CartActionButtons.tsx        # Task 67 ✓
│   ├── PayButton.tsx                # Task 68 ✓
│   └── index.ts
├── Payment/
│   ├── PaymentModal.tsx             # Task 69 ✓
│   ├── PaymentAmountDisplay.tsx     # Task 70 ✓
│   ├── PaymentMethodsGrid.tsx       # Task 71 ✓
│   ├── CashPayment.tsx              # Task 72 ✓
│   ├── QuickAmountButtons.tsx       # Task 74 ✓
│   ├── ChangeCalculator.tsx         # Task 75 ✓
│   └── index.ts
└── shared/
    ├── Numpad.tsx                   # Task 73 ✓
    └── index.ts
```

### Payment Processing Status
✓ **Completed Components:**
- Cart action buttons with Pay, Hold, Clear
- Pay button with amount display
- Payment modal with complete interface
- Amount display (due, tendered, change)
- Payment methods grid selection
- Cash payment option with numpad
- Numpad component for numeric input
- Quick amount buttons
- Change calculator with color coding

⏳ **Pending (Next Document):**
- Card payment option (Task 76)
- Bank transfer payment (Task 77)
- Split payment interface (Task 78-79)
- Customer selection (Task 80)
- Complete sale action (Task 81)
- Sale completion API call (Task 82)

### Next Steps
Proceed to [02_Tasks-76-82_Methods-Split-Complete.md](02_Tasks-76-82_Methods-Split-Complete.md) to implement additional payment methods, split payments, and sale completion.

---

## Notes for AI Agents

1. **Payment Modal:** Large modal with clear sections, left for methods, right for amounts
2. **Numpad:** Reusable component, 4x3 grid, touch-friendly (60x60px minimum)
3. **Quick Amounts:** Sri Lankan denominations (500, 1000, 2000, 5000)
4. **Change Calculation:** Real-time, color-coded (green for change, red for insufficient)
5. **Keyboard Shortcuts:** F2 for Pay, support numpad keyboard input
6. **Validation:** Ensure sufficient payment before allowing completion
7. **Focus Management:** Auto-focus on payment modal open, trap focus
8. **Next Document:** Additional payment methods, split payments, customer selection, sale completion
