# Tasks 83-91: Receipt Display & Shift Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** F - Receipt, Shift & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89, 90, 91

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Payment-Processing/](../Group-E_Payment-Processing/)
- **→ Next Document:** [02_Tasks-92-98_Hold-Testing.md](02_Tasks-92-98_Hold-Testing.md)

---

## Document Overview

This document covers receipt modal creation with content formatting and print/email actions, new sale button, shift open modal with opening cash, and shift close modal with cash counting and variance tracking.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 83 | Create Receipt Modal | High |
| 84 | Create Receipt Content Formatter | Medium |
| 85 | Create Print/Email Actions | Medium |
| 86 | Create New Sale Button | Low |
| 87 | Create Shift Open Modal | Medium |
| 88 | Create Opening Cash Input | Low |
| 89 | Create Shift Close Modal | High |
| 90 | Create Cash Count Input | Medium |
| 91 | Create Shift Variance Display | Medium |

---

## Task 83: Create Receipt Modal

### Overview
Create the receipt modal component that displays a formatted receipt after sale completion with options to print, email, or start a new sale.

### Dependencies
- Group E, Task 82: Implement Sale Completion API Call

### Instructions

1. **Create receipt modal component**
   - Create `ReceiptModal.tsx` in Receipt directory
   - Create directory: `components/modules/pos/Receipt/`
   - Large modal for receipt display
   - Auto-open after sale completion

2. **Define modal structure**
   - Modal overlay (semi-transparent)
   - Modal content (receipt-sized)
   - Receipt content area (Task 84)
   - Action buttons section
   - Close button

3. **Add modal header**
   - Title: "Sale Complete" or "Receipt"
   - Success icon (checkmark)
   - Sale number/receipt number
   - Timestamp

4. **Create receipt display area**
   - White background (paper-like)
   - Receipt content component
   - Scrollable if long
   - Print-ready styling

5. **Add action buttons**
   - Print Receipt button (Task 85)
   - Email Receipt button (Task 85)
   - New Sale button (Task 86)
   - Close button
   - Horizontal layout

6. **Implement auto-open**
   - Open immediately after sale success
   - Pass sale data from API response
   - Focus on modal
   - Clear previous receipt

7. **Add keyboard support**
   - Escape: Close modal
   - P: Print receipt
   - E: Email receipt
   - N or Enter: New sale
   - Tab navigation

8. **Style for printing**
   - Use @media print
   - Hide buttons when printing
   - Clean receipt layout
   - Proper margins

### Receipt Modal Layout
```
┌────────────────────────────────────────┐
│ ✓ Sale Complete              [×]      │
│ Receipt #12345 • 2024-01-15 14:30     │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │   STORE NAME                      │ │
│ │   Address Line 1                  │ │
│ │   Phone: +94 11 234 5678         │ │
│ │                                   │ │
│ │   Receipt #: 12345                │ │
│ │   Date: 2024-01-15 14:30:25      │ │
│ │   Cashier: John Doe              │ │
│ │                                   │ │
│ │   Items:                          │ │
│ │   Product A x2      LKR 200.00   │ │
│ │   Product B x1      LKR 300.00   │ │
│ │                                   │ │
│ │   Subtotal:         LKR 500.00   │ │
│ │   Discount (10%):   LKR -50.00   │ │
│ │   Tax (15%):        LKR  67.50   │ │
│ │   ──────────────────────────────  │ │
│ │   Total:            LKR 517.50   │ │
│ │                                   │ │
│ │   Payment: Cash     LKR 550.00   │ │
│ │   Change:           LKR  32.50   │ │
│ │                                   │ │
│ │   Thank you for your purchase!   │ │
│ └────────────────────────────────────┘ │
│                                        │
│  [ Print ] [ Email ] [ New Sale ]     │
└────────────────────────────────────────┘
```

### Receipt Modal Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Title, number, timestamp | Context |
| Receipt Area | Formatted receipt (Task 84) | Display |
| Actions | Print, Email, New Sale | Options |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Receipt/ReceiptModal.tsx

// 'use client' directive
// Imports
// ReceiptModal props
// ReceiptModal component
//   - Modal overlay
//   - Modal content
//   - Header
//   - ReceiptContent (Task 84)
//   - Action buttons
//   - PrintButton (Task 85)
//   - EmailButton (Task 85)
//   - NewSaleButton (Task 86)
//   - Close button
//   - Keyboard handlers
//   - Print styles
```

### Verification Checklist
- [ ] `ReceiptModal.tsx` created
- [ ] Receipt directory created
- [ ] Modal opens after sale
- [ ] Receipt displays correctly
- [ ] Action buttons render
- [ ] Keyboard shortcuts work
- [ ] Print styling implemented
- [ ] Close button works
- [ ] Auto-opens on sale complete

---

## Task 84: Create Receipt Content Formatter

### Overview
Create the receipt content formatter component that generates a properly formatted receipt with store information, items, totals, and payment details.

### Dependencies
- Task 83: Create Receipt Modal

### Instructions

1. **Create receipt content component**
   - Create `ReceiptContent.tsx` in Receipt directory
   - Format receipt data
   - Accept sale data prop

2. **Add store header**
   - Store name (from settings)
   - Store address
   - Phone number
   - Logo (optional)
   - Tax ID (optional)

3. **Add transaction details**
   - Receipt number
   - Date and time
   - Cashier name
   - Shift number (optional)

4. **Format items section**
   - Item name and quantity
   - Unit price
   - Line total
   - Right-aligned amounts
   - Clear columns

5. **Add totals section**
   - Subtotal
   - Discount (if applied)
   - Tax
   - Separator line
   - Grand total (bold)

6. **Show payment details**
   - Payment method(s)
   - Amount paid
   - Change given (if cash)
   - Multiple payments if split

7. **Add footer**
   - Thank you message
   - Return policy note
   - Website/social media
   - Barcode (optional, for returns)

8. **Style for readability**
   - Monospace font (optional)
   - Clear spacing
   - Aligned columns
   - Receipt-like appearance

### Receipt Content Format
```
════════════════════════════════
      STORE NAME
   123 Main Street
   Colombo, Sri Lanka
   Tel: +94 11 234 5678
   TIN: 123456789V
════════════════════════════════

Receipt #: 12345
Date: 2024-01-15 14:30:25
Cashier: John Doe
Shift: #42

────────────────────────────────
Items:
────────────────────────────────
Product A
  2 x 100.00          200.00

Product B
  1 x 300.00          300.00

────────────────────────────────
Subtotal:             500.00
Discount (10%):       -50.00
Tax (15%):             67.50
────────────────────────────────
TOTAL:                517.50
════════════════════════════════

Payment:
  Cash:               550.00
  Change:              32.50

────────────────────────────────
Thank you for your purchase!

Return policy: 7 days with receipt
www.example.com
────────────────────────────────
```

### Receipt Sections

| Section | Content | Required |
|---------|---------|----------|
| Store Header | Name, address, contact | Yes |
| Transaction | Receipt #, date, cashier | Yes |
| Items | Products with prices | Yes |
| Totals | Subtotal, discount, tax, total | Yes |
| Payment | Method, amount, change | Yes |
| Footer | Thank you, policy | No |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Receipt/ReceiptContent.tsx

// Imports
// ReceiptContent props
// ReceiptContent component
//   - Store header section
//   - Transaction details section
//   - Items list
//   - Totals section
//   - Payment details section
//   - Footer section
//   - Formatting helpers
```

### Verification Checklist
- [ ] `ReceiptContent.tsx` created
- [ ] Store header displays
- [ ] Transaction details show
- [ ] Items formatted correctly
- [ ] Totals calculate correctly
- [ ] Payment details show
- [ ] Footer displays
- [ ] Styling receipt-like
- [ ] Print-ready format

---

## Task 85: Create Print/Email Actions

### Overview
Create the print and email action components that allow printing the receipt or sending it via email to the customer.

### Dependencies
- Task 83: Create Receipt Modal

### Instructions

1. **Create print button component**
   - Create `PrintReceiptButton.tsx` in Receipt directory
   - Trigger browser print dialog
   - Shortcut: P key

2. **Implement print functionality**
   - Use window.print()
   - Focus receipt content
   - Print only receipt area
   - Handle print styles

3. **Add print preparation**
   - Hide buttons before print
   - Optimize layout for printing
   - Set print styles
   - Restore after print

4. **Create email button component**
   - Create `EmailReceiptButton.tsx` in Receipt directory
   - Open email input dialog
   - Send receipt via email API

5. **Create email dialog**
   - Email input field
   - Validation
   - Send button
   - Loading state

6. **Implement email sending**
   - Collect email address
   - Call email API
   - Show success/error
   - Close dialog

7. **Handle email API**
   - POST to `/api/pos/receipts/:id/email`
   - Pass email address
   - Pass receipt data
   - Handle response

### Print/Email Button Layout
```
Action Buttons:
┌──────────────────────────────┐
│ [ 🖨️ Print ] [ 📧 Email ]   │
└──────────────────────────────┘

Email Dialog:
┌─────────────────────────────┐
│ Email Receipt               │
├─────────────────────────────┤
│ Send receipt to:            │
│ ┌─────────────────────────┐ │
│ │ customer@example.com    │ │
│ └─────────────────────────┘ │
│                             │
│   [ Cancel ]  [ Send ]     │
└─────────────────────────────┘

Sending:
┌─────────────────────────────┐
│ Sending receipt...          │
│ [spinner]                   │
└─────────────────────────────┘

Success:
┌─────────────────────────────┐
│ ✓ Receipt sent successfully │
└─────────────────────────────┘
```

### Print Flow
```
1. Click Print button
   ↓
2. Prepare receipt for print
   ↓
3. Hide non-printable elements
   ↓
4. Trigger window.print()
   ↓
5. Show print dialog
   ↓
6. User prints
   ↓
7. Restore normal view
```

### Email Flow
```
1. Click Email button
   ↓
2. Show email dialog
   ↓
3. Enter email address
   ↓
4. Validate email
   ↓
5. Click Send
   ↓
6. Call API
   ↓
7. Show success/error
   ↓
8. Close dialog
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Receipt/PrintReceiptButton.tsx

// Imports
// PrintReceiptButton component
//   - Button element
//   - Click handler
//   - Print preparation
//   - window.print() call
//   - Keyboard shortcut (P)

// File: frontend/components/modules/pos/Receipt/EmailReceiptButton.tsx

// 'use client' directive
// Imports
// EmailReceiptButton component
//   - Button element
//   - Email dialog state
//   - Email input
//   - Send handler
//   - API call
//   - Success/error messages

// File: frontend/services/api/pos/emailReceipt.ts

// Imports
// emailReceipt function
//   - Input: Receipt ID, email
//   - POST to API
//   - Return success/error
```

### Verification Checklist
- [ ] `PrintReceiptButton.tsx` created
- [ ] `EmailReceiptButton.tsx` created
- [ ] `emailReceipt.ts` API service created
- [ ] Print button triggers print
- [ ] Print styles applied
- [ ] Email button opens dialog
- [ ] Email input validates
- [ ] Email API call works
- [ ] Success/error messages show
- [ ] Keyboard shortcut works (P)

---

## Task 86: Create New Sale Button

### Overview
Create the new sale button component that clears the current receipt and returns to the POS interface to start a new sale.

### Dependencies
- Task 83: Create Receipt Modal

### Instructions

1. **Create new sale button component**
   - Create `NewSaleButton.tsx` in Receipt directory
   - Primary action button
   - Most prominent in modal

2. **Design button UI**
   - Text: "New Sale" or "Start New Sale"
   - Large, prominent
   - Primary color (green or blue)
   - Call-to-action style
   - Icon: Plus or cart

3. **Implement button action**
   - Clear cart store
   - Close receipt modal
   - Reset POS interface
   - Focus on product search

4. **Add keyboard shortcut**
   - Shortcut: N or Enter key
   - Auto-focused after delay
   - Quick new sale start
   - Document shortcut

5. **Handle cleanup**
   - Clear all cart data
   - Reset discount
   - Reset customer
   - Reset payment state
   - Fresh start

6. **Add confirmation**
   - Optional: Confirm if receipt not printed
   - "Are you sure? Receipt not printed"
   - Skip if printed
   - Prevent accidental loss

7. **Auto-focus**
   - Focus button after delay (2-3s)
   - Allow quick Enter press
   - Smooth workflow
   - Efficient for cashier

### New Sale Button States
```
Normal:
┌────────────────────────────┐
│   🛒 New Sale              │ ← Green, bold
└────────────────────────────┘

Focused (auto-focus):
┌────────────────────────────┐
│   🛒 New Sale              │ ← Highlighted
└────────────────────────────┘

Confirmation:
┌─────────────────────────────┐
│ Receipt not printed!        │
│ Start new sale anyway?      │
│                             │
│  [ Cancel ]  [ New Sale ]  │
└─────────────────────────────┘
```

### New Sale Flow
```
1. Sale completed
   ↓
2. Receipt modal shown
   ↓
3. User views receipt
   ↓
4. Print/Email (optional)
   ↓
5. Click New Sale
   ↓
6. Confirm (if not printed)
   ↓
7. Clear cart and state
   ↓
8. Close modal
   ↓
9. Return to POS
   ↓
10. Focus search input
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Receipt/NewSaleButton.tsx

// 'use client' directive
// Imports
// NewSaleButton props
// NewSaleButton component
//   - Button element
//   - Click handler
//   - Confirmation dialog
//   - Clear cart action
//   - Close modal action
//   - Reset state
//   - Keyboard shortcut (N/Enter)
//   - Auto-focus logic
```

### Verification Checklist
- [ ] `NewSaleButton.tsx` created
- [ ] Button renders prominently
- [ ] Click clears cart
- [ ] Modal closes
- [ ] POS resets
- [ ] Confirmation shows (if not printed)
- [ ] Keyboard shortcut works
- [ ] Auto-focus after delay
- [ ] Search input focused after

---

## Task 87: Create Shift Open Modal

### Overview
Create the shift open modal component that allows cashiers to start a new shift by entering opening cash and recording shift start details.

### Dependencies
- Group A, Task 10: Shift Status Display

### Instructions

1. **Create shift open modal component**
   - Create `ShiftOpenModal.tsx` in Shift directory
   - Create directory: `components/modules/pos/Shift/`
   - Modal dialog for shift opening
   - Auto-open if no active shift

2. **Define modal structure**
   - Modal overlay (non-dismissible)
   - Modal content
   - Header: "Open Shift"
   - Cashier information
   - Opening cash input (Task 88)
   - Shift notes (optional)
   - Action buttons

3. **Show cashier information**
   - Cashier name (from auth)
   - Cashier ID
   - Date and time
   - Shift number (auto-generated)

4. **Add opening cash input**
   - OpeningCashInput component (Task 88)
   - Required field
   - Cash amount in drawer
   - Numpad for input

5. **Add shift notes**
   - Optional text area
   - Notes about shift
   - Example: "Till 5, Day shift"
   - Multi-line input

6. **Implement action buttons**
   - Open Shift (primary)
   - Cancel (if allowed)
   - Validate before opening
   - Loading state

7. **Handle shift opening**
   - Validate opening cash
   - Call API to create shift
   - Store shift ID
   - Close modal
   - Enable POS

8. **Add validation**
   - Opening cash required
   - Must be positive
   - Reasonable amount
   - Clear errors

### Shift Open Modal Layout
```
┌────────────────────────────────┐
│ Open Shift                     │
├────────────────────────────────┤
│ Cashier: John Doe              │
│ ID: EMP001                     │
│ Date: 2024-01-15               │
│ Shift: #42                     │
│                                │
│ Opening Cash *:                │
│ ┌────────────────────────────┐ │
│ │ LKR    5000.00             │ │
│ └────────────────────────────┘ │
│                                │
│ [ 7 ][ 8 ][ 9 ]               │
│ [ 4 ][ 5 ][ 6 ]               │
│ [ 1 ][ 2 ][ 3 ]               │
│ [ . ][ 0 ][ ← ]               │
│                                │
│ Shift Notes (Optional):        │
│ ┌────────────────────────────┐ │
│ │ Till 5, Day shift          │ │
│ └────────────────────────────┘ │
│                                │
│     [ Cancel ]  [ Open Shift ] │
└────────────────────────────────┘
```

### Shift Open Flow
```
1. User accesses POS
   ↓
2. Check for active shift
   ↓
3. No active shift found
   ↓
4. Show Shift Open Modal
   ↓
5. Enter opening cash
   ↓
6. Enter notes (optional)
   ↓
7. Click Open Shift
   ↓
8. Validate data
   ↓
9. Call API
   ↓
10. Store shift ID
   ↓
11. Close modal
   ↓
12. Enable POS interface
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Shift/ShiftOpenModal.tsx

// 'use client' directive
// Imports
// ShiftOpenModal props
// ShiftOpenModal component
//   - Modal overlay (non-dismissible)
//   - Modal content
//   - Header
//   - Cashier information
//   - OpeningCashInput (Task 88)
//   - Shift notes input
//   - Action buttons
//   - Validation
//   - API call
```

### Verification Checklist
- [ ] `ShiftOpenModal.tsx` created
- [ ] Shift directory created
- [ ] Modal shows if no shift
- [ ] Cashier info displays
- [ ] Opening cash input works
- [ ] Notes input works
- [ ] Validation implemented
- [ ] API call works
- [ ] Modal closes on success
- [ ] POS enables after open

---

## Task 88: Create Opening Cash Input

### Overview
Create the opening cash input component that allows cashiers to enter the cash amount in the drawer at shift start.

### Dependencies
- Task 87: Create Shift Open Modal

### Instructions

1. **Create opening cash input component**
   - Create `OpeningCashInput.tsx` in Shift directory
   - Cash amount input
   - With numpad or keyboard

2. **Design input field**
   - Large, clear input
   - Label: "Opening Cash Amount"
   - LKR prefix
   - Read-only or formatted

3. **Add numpad input**
   - Include numpad component
   - Or allow keyboard input
   - Format as currency
   - Two decimal places

4. **Implement validation**
   - Required field
   - Must be positive
   - Reasonable range (0-100,000)
   - Clear error message

5. **Add suggested amounts**
   - Quick buttons: 5000, 10000, 20000
   - Common starting amounts
   - One-click entry
   - Editable after

6. **Show current value**
   - Display entered amount
   - Large, clear text
   - Currency formatted
   - Real-time update

7. **Handle edge cases**
   - Zero cash (allowed but warn)
   - Very large amounts (warn)
   - Decimal precision
   - Clear/reset option

### Opening Cash Input Layout
```
┌────────────────────────────┐
│ Opening Cash Amount *      │
├────────────────────────────┤
│ ┌────────────────────────┐ │
│ │ LKR    5000.00         │ │ ← Large display
│ └────────────────────────┘ │
│                            │
│ Quick Amounts:             │
│ [5000][10000][20000]      │
│                            │
│ [ 7 ][ 8 ][ 9 ]           │
│ [ 4 ][ 5 ][ 6 ]           │
│ [ 1 ][ 2 ][ 3 ]           │
│ [ . ][ 0 ][ ← ]           │
└────────────────────────────┘

With Warning:
┌────────────────────────────┐
│ LKR    50000.00           │
│ ⚠️ Large amount. Confirm? │
└────────────────────────────┘
```

### Opening Cash Validation

| Amount | Valid | Warning |
|--------|-------|---------|
| 0 | Yes | "Starting with no cash" |
| 1-50000 | Yes | None |
| 50000+ | Yes | "Large amount. Confirm?" |
| Negative | No | "Must be positive" |
| Empty | No | "Required field" |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Shift/OpeningCashInput.tsx

// 'use client' directive
// Imports
// OpeningCashInput props
// OpeningCashInput component
//   - Input display
//   - Quick amount buttons
//   - Numpad
//   - Validation
//   - Warning messages
//   - Change handler
```

### Verification Checklist
- [ ] `OpeningCashInput.tsx` created
- [ ] Input displays correctly
- [ ] Numpad input works
- [ ] Quick amounts work
- [ ] Validation implemented
- [ ] Warnings show appropriately
- [ ] Currency formatted
- [ ] Required field enforced

---

## Task 89: Create Shift Close Modal

### Overview
Create the shift close modal component that allows cashiers to end their shift by counting cash, entering closing details, and viewing shift summary.

### Dependencies
- Task 87: Create Shift Open Modal
- Group A, Task 10: Shift Status Display

### Instructions

1. **Create shift close modal component**
   - Create `ShiftCloseModal.tsx` in Shift directory
   - Modal dialog for shift closing
   - Triggered by "Close Shift" action

2. **Define modal structure**
   - Modal overlay (non-dismissible)
   - Modal content (large)
   - Header: "Close Shift"
   - Shift summary section
   - Cash count input (Task 90)
   - Variance display (Task 91)
   - Closing notes (optional)
   - Action buttons

3. **Show shift summary**
   - Shift number and cashier
   - Start time and duration
   - Opening cash amount
   - Total sales count
   - Total sales amount
   - Expected cash (opening + cash sales - cash withdrawals)

4. **Add cash count input**
   - CashCountInput component (Task 90)
   - Count cash in drawer
   - Denomination breakdown
   - Total calculated

5. **Display variance**
   - ShiftVarianceDisplay component (Task 91)
   - Expected vs Actual
   - Over/Short amount
   - Color-coded

6. **Add closing notes**
   - Optional text area
   - Explain variance if any
   - Incident notes
   - Multi-line input

7. **Implement action buttons**
   - Close Shift (primary)
   - Cancel (return to POS)
   - Validate before closing
   - Confirm if variance

8. **Handle shift closing**
   - Validate cash count
   - Calculate variance
   - Call API to close shift
   - Generate shift report
   - Clear shift ID
   - Return to shift open or logout

### Shift Close Modal Layout
```
┌────────────────────────────────────────┐
│ Close Shift #42                        │
├────────────────────────────────────────┤
│ Shift Summary:                         │
│ ┌────────────────────────────────────┐ │
│ │ Cashier: John Doe                  │ │
│ │ Start: 2024-01-15 08:00           │ │
│ │ Duration: 8h 30m                   │ │
│ │ Opening Cash: LKR 5,000.00        │ │
│ │ Sales Count: 47                    │ │
│ │ Sales Total: LKR 24,375.50        │ │
│ │ Cash Sales: LKR 18,200.00         │ │
│ │ Expected Cash: LKR 23,200.00      │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Cash Count:                            │
│ [CashCountInput component]             │
│ Total: LKR 23,150.00                  │
│                                        │
│ Variance:                              │
│ Expected: LKR 23,200.00               │
│ Actual:   LKR 23,150.00               │
│ Variance: LKR -50.00 (Short)          │ ← Red
│                                        │
│ Closing Notes (Optional):              │
│ ┌────────────────────────────────────┐ │
│ │ One customer short-paid 50         │ │
│ └────────────────────────────────────┘ │
│                                        │
│    [ Cancel ]  [ Close Shift ]        │
└────────────────────────────────────────┘
```

### Shift Close Flow
```
1. Cashier clicks "Close Shift"
   ↓
2. Show Shift Close Modal
   ↓
3. Display shift summary
   ↓
4. Count cash in drawer
   ↓
5. Enter cash count
   ↓
6. Calculate variance
   ↓
7. Enter notes (if variance)
   ↓
8. Click Close Shift
   ↓
9. Confirm if variance
   ↓
10. Call API
   ↓
11. Generate shift report
   ↓
12. Clear shift
   ↓
13. Return to shift open or logout
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Shift/ShiftCloseModal.tsx

// 'use client' directive
// Imports
// ShiftCloseModal props
// ShiftCloseModal component
//   - Modal overlay (non-dismissible)
//   - Modal content
//   - Header
//   - Shift summary section
//   - CashCountInput (Task 90)
//   - ShiftVarianceDisplay (Task 91)
//   - Closing notes input
//   - Action buttons
//   - Confirmation dialog
//   - API call
```

### Verification Checklist
- [ ] `ShiftCloseModal.tsx` created
- [ ] Modal shows on close action
- [ ] Shift summary displays
- [ ] Cash count input works
- [ ] Variance calculates
- [ ] Notes input works
- [ ] Confirmation on variance
- [ ] API call works
- [ ] Shift report generated
- [ ] Shift cleared on success

---

## Task 90: Create Cash Count Input

### Overview
Create the cash count input component that allows cashiers to enter the denomination breakdown of cash in the drawer at shift end.

### Dependencies
- Task 89: Create Shift Close Modal

### Instructions

1. **Create cash count input component**
   - Create `CashCountInput.tsx` in Shift directory
   - Denomination breakdown table
   - Calculate total automatically

2. **Define Sri Lankan denominations**
   - Notes: 5000, 1000, 500, 100, 50, 20, 10
   - Coins: 5, 2, 1
   - Quantity input for each
   - Value calculation

3. **Create denomination table**
   - Column: Denomination
   - Column: Quantity (input)
   - Column: Value (calculated)
   - Rows for each denomination
   - Total row at bottom

4. **Implement quantity inputs**
   - Number input for each row
   - Min: 0
   - Step: 1
   - Auto-calculate value
   - Focus next on Enter

5. **Calculate values**
   - Value = Denomination × Quantity
   - Sum all values for total
   - Update in real-time
   - Display total prominently

6. **Add total cash display**
   - Sum of all denominations
   - Large, bold text
   - LKR formatted
   - Highlighted

7. **Add quick clear**
   - Button to clear all counts
   - Reset to zero
   - Confirm before clear
   - Fresh start

### Cash Count Input Layout
```
┌─────────────────────────────────┐
│ Count Cash in Drawer            │
├─────────────────────────────────┤
│ Denom.  | Qty   | Value         │
├─────────┼───────┼───────────────┤
│ 5000    │ [  2] │    10,000.00 │
│ 1000    │ [  8] │     8,000.00 │
│  500    │ [  6] │     3,000.00 │
│  100    │ [ 15] │     1,500.00 │
│   50    │ [  8] │       400.00 │
│   20    │ [ 10] │       200.00 │
│   10    │ [  5] │        50.00 │
│    5    │ [  0] │         0.00 │
│    2    │ [  0] │         0.00 │
│    1    │ [  0] │         0.00 │
├─────────┴───────┼───────────────┤
│ TOTAL           │ 23,150.00    │ ← Bold
└─────────────────┴───────────────┘
         [ Clear All ]
```

### Sri Lankan Denominations

| Type | Denomination | Common |
|------|--------------|--------|
| Note | 5000 | High value |
| Note | 1000 | Very common |
| Note | 500 | Very common |
| Note | 100 | Common |
| Note | 50 | Common |
| Note | 20 | Less common |
| Note | 10 | Rare |
| Coin | 5 | Common |
| Coin | 2 | Common |
| Coin | 1 | Less common |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Shift/CashCountInput.tsx

// 'use client' directive
// Imports
// CashCountInput props
// CashCountInput component
//   - Denomination table
//   - Quantity inputs
//   - Value calculations
//   - Total calculation
//   - Total display
//   - Clear all button
//   - Change handler (pass total up)
```

### Verification Checklist
- [ ] `CashCountInput.tsx` created
- [ ] All denominations listed
- [ ] Quantity inputs work
- [ ] Values calculate correctly
- [ ] Total calculates correctly
- [ ] Total displayed prominently
- [ ] Clear all button works
- [ ] Focus navigation works (Enter)

---

## Task 91: Create Shift Variance Display

### Overview
Create the shift variance display component that shows the difference between expected cash and actual cash counted at shift end.

### Dependencies
- Task 89: Create Shift Close Modal
- Task 90: Create Cash Count Input

### Instructions

1. **Create variance display component**
   - Create `ShiftVarianceDisplay.tsx` in Shift directory
   - Show expected vs actual
   - Calculate and display variance

2. **Display expected cash**
   - Label: "Expected Cash"
   - Amount: Opening + Cash Sales - Withdrawals
   - LKR formatted
   - Clear display

3. **Display actual cash**
   - Label: "Actual Cash (Counted)"
   - Amount: From cash count (Task 90)
   - LKR formatted
   - Bold text

4. **Calculate variance**
   - Formula: Actual - Expected
   - Positive: Over (extra cash)
   - Negative: Short (missing cash)
   - Zero: Balanced

5. **Show variance amount**
   - Label: "Variance"
   - Amount with + or -
   - Description: "Over" or "Short"
   - Large, prominent

6. **Add color coding**
   - Zero variance: Green (Balanced)
   - Small variance (< 100): Yellow (Minor)
   - Large variance (≥ 100): Red (Significant)
   - Clear visual feedback

7. **Add variance status**
   - "Balanced" if zero
   - "Minor shortage" if small negative
   - "Significant shortage" if large negative
   - "Overage" if positive
   - Explain significance

### Variance Display Layouts
```
Balanced:
┌─────────────────────────────┐
│ Expected Cash: 23,150.00    │
│ Actual Cash:   23,150.00    │
│ ──────────────────────────   │
│ Variance: LKR 0.00          │ ← Green
│ ✓ Balanced                  │
└─────────────────────────────┘

Short:
┌─────────────────────────────┐
│ Expected Cash: 23,200.00    │
│ Actual Cash:   23,150.00    │
│ ──────────────────────────   │
│ Variance: LKR -50.00        │ ← Yellow/Red
│ ⚠️ Short by 50.00           │
└─────────────────────────────┘

Over:
┌─────────────────────────────┐
│ Expected Cash: 23,200.00    │
│ Actual Cash:   23,250.00    │
│ ──────────────────────────   │
│ Variance: LKR +50.00        │ ← Yellow
│ ⚠️ Over by 50.00            │
└─────────────────────────────┘
```

### Variance Thresholds

| Variance | Range | Color | Status | Action |
|----------|-------|-------|--------|--------|
| Zero | 0 | Green | Balanced | None |
| Minor | 1-99 | Yellow | Minor | Note |
| Significant | 100+ | Red | Significant | Investigate |
| Minor Over | 1-99 | Yellow | Minor Overage | Note |
| Significant Over | 100+ | Red | Significant Overage | Investigate |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Shift/ShiftVarianceDisplay.tsx

// Imports
// ShiftVarianceDisplay props
// ShiftVarianceDisplay component
//   - Expected cash display
//   - Actual cash display
//   - Separator
//   - Variance calculation
//   - Variance display
//   - Color coding
//   - Variance status
//   - Icon (✓ or ⚠️)
```

### Verification Checklist
- [ ] `ShiftVarianceDisplay.tsx` created
- [ ] Expected cash displays
- [ ] Actual cash displays
- [ ] Variance calculates correctly
- [ ] Color coding implemented
- [ ] Status message shows
- [ ] Icon displays appropriately
- [ ] Styling clear and prominent

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 83 | Create Receipt Modal | Receipt display modal |
| 84 | Create Receipt Content Formatter | Formatted receipt layout |
| 85 | Create Print/Email Actions | Print and email functionality |
| 86 | Create New Sale Button | New sale reset button |
| 87 | Create Shift Open Modal | Shift opening interface |
| 88 | Create Opening Cash Input | Opening cash entry |
| 89 | Create Shift Close Modal | Shift closing interface |
| 90 | Create Cash Count Input | Denomination count table |
| 91 | Create Shift Variance Display | Variance calculation display |

### Current Progress
```
frontend/components/modules/pos/
├── Receipt/
│   ├── ReceiptModal.tsx             # Task 83 ✓
│   ├── ReceiptContent.tsx           # Task 84 ✓
│   ├── PrintReceiptButton.tsx       # Task 85 ✓
│   ├── EmailReceiptButton.tsx       # Task 85 ✓
│   ├── NewSaleButton.tsx            # Task 86 ✓
│   └── index.ts
└── Shift/
    ├── ShiftOpenModal.tsx           # Task 87 ✓
    ├── OpeningCashInput.tsx         # Task 88 ✓
    ├── ShiftCloseModal.tsx          # Task 89 ✓
    ├── CashCountInput.tsx           # Task 90 ✓
    ├── ShiftVarianceDisplay.tsx     # Task 91 ✓
    └── index.ts
```

### Receipt & Shift Management Status
✓ **Completed Components:**
- Receipt modal with formatted content
- Receipt content formatter with sections
- Print and email functionality
- New sale button with reset
- Shift open modal with opening cash
- Opening cash input with numpad
- Shift close modal with summary
- Cash count input with denominations
- Shift variance display with color coding

⏳ **Pending (Next Document):**
- Cash count input continuation (Task 92)
- Shift variance display detail (Task 93)
- Close shift action (Task 94)
- Hold sale feature (Task 95)
- Retrieve hold feature (Task 96)
- POS module documentation (Task 97)
- Final verification and testing (Task 98)

### Next Steps
Proceed to [02_Tasks-92-98_Hold-Testing.md](02_Tasks-92-98_Hold-Testing.md) to implement hold sale functionality, comprehensive documentation, and final testing procedures.

---

## Notes for AI Agents

1. **Receipt Modal:** Auto-opens after sale, print-ready styling with @media print
2. **Receipt Format:** Sri Lankan business receipt format with store header and footer
3. **Print/Email:** Browser print API and backend email API integration
4. **New Sale:** Clears all state and returns to fresh POS interface
5. **Shift Management:** Critical for cash accountability and reporting
6. **Opening Cash:** Required to start shift, typically 5000-10000 LKR
7. **Cash Count:** Sri Lankan denominations (5000, 1000, 500, 100, 50, 20, 10, 5, 2, 1)
8. **Variance:** Color-coded (green=balanced, yellow=minor, red=significant)
9. **Next Document:** Hold sales, comprehensive documentation, final testing
