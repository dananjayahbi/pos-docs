# Tasks 76-82: Payment Methods, Split Payment & Sale Completion

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** E - Payment Processing  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-75_Modal-Cash.md](01_Tasks-67-75_Modal-Cash.md)
- **→ Next Group:** [../Group-F_Receipt-Shift-Testing/](../Group-F_Receipt-Shift-Testing/)

---

## Document Overview

This document covers additional payment methods (card, bank transfer), split payment functionality with multiple payment tracking, customer selection, complete sale action, and sale completion API integration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 76 | Create Card Payment Option | Medium |
| 77 | Create Bank Transfer Payment Option | Medium |
| 78 | Create Split Payment Toggle | Low |
| 79 | Create Split Payment Interface | High |
| 80 | Create Customer Selection | Medium |
| 81 | Create Complete Sale Action | Medium |
| 82 | Implement Sale Completion API Call | High |

---

## Task 76: Create Card Payment Option

### Overview
Create the card payment option component for processing credit and debit card payments with approval code tracking.

### Dependencies
- Group E, Task 71: Create Payment Methods Grid

### Instructions

1. **Create card payment component**
   - Create `CardPayment.tsx` in Payment directory
   - Shown when card method selected
   - Simple form interface

2. **Define card payment fields**
   - Card type (optional): Visa, Mastercard, etc.
   - Last 4 digits (optional)
   - Approval code (required)
   - Transaction reference (optional)

3. **Create approval code input**
   - Text or number input
   - Label: "Approval Code"
   - Required field
   - 6-12 characters typically

4. **Add card type selection**
   - Dropdown or radio buttons
   - Options: Visa, Mastercard, Amex
   - Optional field
   - Default: "Credit Card"

5. **Include amount display**
   - Show total being charged
   - Read-only
   - Clear and prominent
   - Exact amount to total

6. **Add validation**
   - Approval code required
   - Format validation (alphanumeric)
   - Minimum length
   - Clear error messages

7. **Handle terminal integration**
   - Placeholder for future integration
   - Manual entry for now
   - Note: "Enter approval code from terminal"
   - Future: Auto-read from device

### Card Payment Layout
```
┌─────────────────────────────┐
│ Card Payment                │
├─────────────────────────────┤
│ Amount:                     │
│ LKR 517.50                 │ ← Bold, read-only
│                             │
│ Card Type (Optional):       │
│ [ Visa              ▼ ]    │
│                             │
│ Last 4 Digits (Optional):  │
│ [ ____ ]                   │
│                             │
│ Approval Code *:           │
│ [ ABC123456 ]              │ ← Required
│                             │
│ Transaction Reference:      │
│ [ REF789 ]                 │
│                             │
│ Note: Enter approval code   │
│ from card terminal         │
└─────────────────────────────┘
```

### Card Payment Fields

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Amount | Display | - | - | Read-only |
| Card Type | Select | No | - | Visa/MC/Amex |
| Last 4 | Text | No | 4 digits | Optional tracking |
| Approval Code | Text | Yes | 6-12 chars | From terminal |
| Reference | Text | No | - | Optional |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/CardPayment.tsx

// 'use client' directive
// Imports
// CardPayment props
// CardPayment component
//   - Amount display
//   - Card type select
//   - Last 4 digits input
//   - Approval code input
//   - Reference input
//   - Validation
//   - Note about terminal
```

### Verification Checklist
- [ ] `CardPayment.tsx` created
- [ ] Amount displayed
- [ ] Card type selection works
- [ ] Approval code input works
- [ ] Validation implemented
- [ ] Required fields enforced
- [ ] Note about terminal shown
- [ ] Styling consistent

---

## Task 77: Create Bank Transfer Payment Option

### Overview
Create the bank transfer payment option component for processing bank transfer payments with reference number tracking.

### Dependencies
- Group E, Task 71: Create Payment Methods Grid

### Instructions

1. **Create bank transfer component**
   - Create `BankTransferPayment.tsx` in Payment directory
   - Shown when bank transfer selected
   - Simple form interface

2. **Define bank transfer fields**
   - Transfer reference number (required)
   - Bank name (optional)
   - Account number (optional, last 4)
   - Transfer date/time (optional)

3. **Create reference input**
   - Text input
   - Label: "Transfer Reference Number"
   - Required field
   - Alphanumeric

4. **Add bank selection**
   - Dropdown of common banks
   - Sri Lankan banks
   - Optional field
   - Free text alternative

5. **Include amount display**
   - Show total expected
   - Read-only
   - Must match transfer amount
   - Clear display

6. **Add validation**
   - Reference number required
   - Minimum length (4-20 chars)
   - Format validation
   - Clear errors

7. **Add instructions**
   - Note: Verify transfer in bank system
   - Note: Transfer amount must match
   - Warning: Confirm before processing
   - Clear guidance

### Bank Transfer Layout
```
┌─────────────────────────────┐
│ Bank Transfer Payment       │
├─────────────────────────────┤
│ Amount:                     │
│ LKR 517.50                 │ ← Bold, read-only
│                             │
│ Transfer Reference *:       │
│ [ TRF20240115001234 ]      │ ← Required
│                             │
│ Bank Name (Optional):       │
│ [ Commercial Bank   ▼ ]    │
│                             │
│ Account Last 4 (Optional):  │
│ [ ____ ]                   │
│                             │
│ Transfer Date/Time:         │
│ [ 2024-01-15 14:30 ]       │
│                             │
│ ⚠️ Important:               │
│ Verify transfer in bank     │
│ system before completing    │
└─────────────────────────────┘
```

### Bank Transfer Fields

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Amount | Display | - | - | Read-only |
| Reference | Text | Yes | 4-20 chars | From bank |
| Bank Name | Select | No | - | Sri Lankan banks |
| Account Last 4 | Text | No | 4 digits | Optional |
| Date/Time | DateTime | No | - | Transfer time |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/BankTransferPayment.tsx

// 'use client' directive
// Imports
// BankTransferPayment props
// BankTransferPayment component
//   - Amount display
//   - Reference input
//   - Bank name select
//   - Account last 4 input
//   - Date/time input
//   - Validation
//   - Warning message
```

### Verification Checklist
- [ ] `BankTransferPayment.tsx` created
- [ ] Amount displayed
- [ ] Reference input works
- [ ] Bank selection works
- [ ] Validation implemented
- [ ] Required fields enforced
- [ ] Warning message shown
- [ ] Styling consistent

---

## Task 78: Create Split Payment Toggle

### Overview
Create the split payment toggle component that enables split payment mode allowing multiple payment methods for a single transaction.

### Dependencies
- Group E, Task 71: Create Payment Methods Grid

### Instructions

1. **Create split payment toggle**
   - Create `SplitPaymentToggle.tsx` in Payment directory
   - Toggle switch or checkbox
   - Enable/disable split mode

2. **Design toggle UI**
   - Switch or checkbox
   - Label: "Split Payment" or "Pay with Multiple Methods"
   - Icon: Split or multiple cards
   - Clear state

3. **Position toggle**
   - Above or near payment methods
   - Prominent but not intrusive
   - Before method selection
   - Clear purpose

4. **Handle toggle state**
   - Off: Single payment mode
   - On: Split payment mode (Task 79)
   - Clear mode change
   - Reset payments if changed

5. **Add informational tooltip**
   - Hover tooltip
   - Explain split payment
   - Example: "Pay using multiple methods"
   - Help icon

6. **Implement toggle action**
   - Call onChange handler
   - Change payment interface
   - Show/hide split interface
   - Smooth transition

7. **Style appropriately**
   - Clear on/off states
   - Good contrast
   - Touch-friendly
   - Accessible

### Split Payment Toggle Layouts
```
Switch:
Split Payment  [====○    ]  ℹ️

Checkbox:
☐ Split Payment (Pay with multiple methods)

Active:
Split Payment  [○====    ]  ℹ️
                ↑ ON

With Icon:
[➗] Split Payment  [○====]
```

### Toggle States

| State | Mode | Interface | Actions |
|-------|------|-----------|---------|
| Off | Single | One method | Select one |
| On | Split | Multiple methods | Add multiple |
| Disabled | - | - | Not available |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/SplitPaymentToggle.tsx

// Imports
// SplitPaymentToggle props
// SplitPaymentToggle component
//   - Toggle switch
//   - Label
//   - Info icon with tooltip
//   - Change handler
//   - Active state styling
```

### Verification Checklist
- [ ] `SplitPaymentToggle.tsx` created
- [ ] Toggle renders correctly
- [ ] On/off states clear
- [ ] Tooltip shows info
- [ ] onChange called
- [ ] Icon visible
- [ ] Touch-friendly
- [ ] Accessible

---

## Task 79: Create Split Payment Interface

### Overview
Create the split payment interface component that allows adding and managing multiple payments for a single transaction.

### Dependencies
- Task 78: Create Split Payment Toggle

### Instructions

1. **Create split payment component**
   - Create `SplitPaymentInterface.tsx` in Payment directory
   - Shown when split mode enabled
   - Manage multiple payments

2. **Define split payment structure**
   - List of added payments
   - Add payment button
   - Total paid display
   - Remaining balance

3. **Create payment list**
   - Show all added payments
   - Method, amount, details
   - Edit/Remove actions
   - Scrollable if many

4. **Add "Add Payment" interface**
   - Select method
   - Enter amount
   - Enter details
   - Add to list button

5. **Calculate totals**
   - Sum all payments
   - Show total paid
   - Calculate remaining
   - Highlight if insufficient/overpaid

6. **Implement payment actions**
   - Add payment: Append to list
   - Edit payment: Modify existing
   - Remove payment: Delete from list
   - Clear all: Reset

7. **Add validation**
   - Each payment valid
   - Total not exceeding too much
   - All required details present
   - Clear error messages

8. **Show remaining balance**
   - Prominent display
   - Update in real-time
   - Color coding
   - Clear status

### Split Payment Interface Layout
```
┌────────────────────────────────────┐
│ Split Payment Mode                 │
├────────────────────────────────────┤
│ Total Due: LKR 517.50             │
│                                    │
│ Payments:                          │
│ ┌────────────────────────────────┐ │
│ │ 1. Cash         LKR 300.00     │ │
│ │    [Edit][Remove]              │ │
│ ├────────────────────────────────┤ │
│ │ 2. Card         LKR 217.50     │ │
│ │    Approval: ABC123            │ │
│ │    [Edit][Remove]              │ │
│ └────────────────────────────────┘ │
│                                    │
│ Total Paid: LKR 517.50            │ ← Bold
│ Remaining:  LKR 0.00              │ ← Green
│                                    │
│ [ + Add Payment ]                 │
└────────────────────────────────────┘

Add Payment Form:
┌────────────────────────────────┐
│ Add Payment                    │
├────────────────────────────────┤
│ Payment Method:                │
│ [ Cash              ▼ ]       │
│                                │
│ Amount:                        │
│ [ 300.00 ]                    │
│                                │
│ Details: (method-specific)     │
│                                │
│ [ Cancel ]  [ Add Payment ]   │
└────────────────────────────────┘
```

### Split Payment Flow
```
1. Enable split mode
   ↓
2. Click "Add Payment"
   ↓
3. Select method (Cash, Card, Bank)
   ↓
4. Enter amount
   ↓
5. Enter method details
   ↓
6. Add to list
   ↓
7. Repeat until total paid ≥ total due
   ↓
8. Complete sale
```

### Split Payment Structure

| Field | Description | Required |
|-------|-------------|----------|
| Payments | Array of payment objects | Yes |
| Payment.method | Payment method | Yes |
| Payment.amount | Payment amount | Yes |
| Payment.details | Method-specific details | Varies |
| Total Paid | Sum of all payments | Calculated |
| Remaining | Total - Total Paid | Calculated |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/SplitPaymentInterface.tsx

// 'use client' directive
// Imports
// SplitPaymentInterface props
// SplitPaymentInterface component
//   - Total due display
//   - Payments list
//   - Payment item component
//     - Method, amount, details
//     - Edit/Remove actions
//   - Add payment form/modal
//   - Total paid display
//   - Remaining balance
//   - Validation
```

### Verification Checklist
- [ ] `SplitPaymentInterface.tsx` created
- [ ] Payments list displays
- [ ] Add payment works
- [ ] Edit payment works
- [ ] Remove payment works
- [ ] Totals calculate correctly
- [ ] Remaining balance updates
- [ ] Validation implemented
- [ ] Styling clear

---

## Task 80: Create Customer Selection

### Overview
Create the customer selection component that allows associating a customer with the sale for loyalty, invoicing, or tracking purposes.

### Dependencies
- Group E, Task 69: Create Payment Modal

### Instructions

1. **Create customer selection component**
   - Create `CustomerSelection.tsx` in Payment directory
   - Search and select customer
   - Optional field

2. **Design customer search**
   - Search input
   - Search by name, phone, email
   - Dropdown results
   - Select customer

3. **Display selected customer**
   - Customer name
   - Phone number
   - Loyalty points (if applicable)
   - Clear display

4. **Add "Walk-in Customer" option**
   - Default option
   - No customer selected
   - Radio or button
   - Most common

5. **Implement customer search**
   - API call to search customers
   - Debounced search
   - Min 2-3 characters
   - Show loading state

6. **Show search results**
   - Dropdown below input
   - Customer name, phone
   - Highlight match
   - Click to select

7. **Add quick actions**
   - Clear selection button
   - Add new customer (optional, link)
   - Edit customer (optional)
   - Manage customers link

### Customer Selection Layout
```
┌─────────────────────────────────┐
│ Customer (Optional)             │
├─────────────────────────────────┤
│ ( ) Walk-in Customer           │ ← Default
│ (•) Select Customer            │
│                                 │
│ Search Customer:                │
│ ┌─────────────────────────────┐ │
│ │ John Smith             🔍   │ │
│ └─────────────────────────────┘ │
│                                 │
│ Results:                        │
│ ┌─────────────────────────────┐ │
│ │ John Smith                  │ │
│ │ +94 77 123 4567            │ │
│ ├─────────────────────────────┤ │
│ │ John Doe                    │ │
│ │ +94 77 987 6543            │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

Selected:
┌─────────────────────────────────┐
│ Customer:                       │
│ John Smith                      │
│ +94 77 123 4567                │
│ Loyalty Points: 1,250          │
│                  [Clear][Edit] │
└─────────────────────────────────┘
```

### Customer Selection States

| State | Display | Actions |
|-------|---------|---------|
| None | Walk-in option selected | Search |
| Searching | Loading indicator | Wait |
| Results | Dropdown list | Select |
| Selected | Customer details | Clear/Edit |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/CustomerSelection.tsx

// 'use client' directive
// Imports
// CustomerSelection props
// CustomerSelection component
//   - Walk-in option
//   - Select customer option
//   - Search input
//   - Search results dropdown
//   - Selected customer display
//   - Clear button
//   - API integration
```

### Verification Checklist
- [ ] `CustomerSelection.tsx` created
- [ ] Walk-in option works
- [ ] Search input functional
- [ ] API search implemented
- [ ] Results display correctly
- [ ] Customer selection works
- [ ] Selected customer shows
- [ ] Clear button works
- [ ] Styling consistent

---

## Task 81: Create Complete Sale Action

### Overview
Create the complete sale action component that validates all payment data and triggers the sale completion process.

### Dependencies
- Task 82: Implement Sale Completion API Call

### Instructions

1. **Create complete sale button**
   - Create `CompleteSaleButton.tsx` in Payment directory
   - Primary action button
   - Bottom of payment modal

2. **Design button UI**
   - Text: "Complete Sale" or "Finish & Print"
   - Large, prominent button
   - Primary color (green)
   - Full width or prominent
   - Min height: 48px

3. **Implement validation**
   - Validate cart not empty
   - Validate payment sufficient
   - Validate required payment details
   - Validate active shift

4. **Add click handler**
   - Validate all data
   - Show confirmation (optional)
   - Call API (Task 82)
   - Handle response

5. **Show loading state**
   - During API call
   - Disable button
   - Show spinner
   - "Processing..." text

6. **Handle errors**
   - API errors
   - Validation errors
   - Network errors
   - Show error message

7. **Add keyboard shortcut**
   - Shortcut: Ctrl+Enter or F4
   - Available when valid
   - Document in help
   - Quick completion

### Complete Sale Button States
```
Normal:
┌────────────────────────────┐
│   Complete Sale            │ ← Green, bold
└────────────────────────────┘

Loading:
┌────────────────────────────┐
│   Processing...  [spinner] │ ← Disabled
└────────────────────────────┘

Disabled:
┌────────────────────────────┐
│   Complete Sale            │ ← Gray, disabled
└────────────────────────────┘

Error:
┌────────────────────────────┐
│   Complete Sale            │
└────────────────────────────┘
⚠️ Payment insufficient
```

### Validation Checklist

| Check | Condition | Error Message |
|-------|-----------|---------------|
| Cart | Not empty | "Cart is empty" |
| Payment | Sufficient | "Payment insufficient" |
| Payment Details | All required | "Enter payment details" |
| Active Shift | Shift open | "No active shift" |
| Network | Online | "No connection" |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Payment/CompleteSaleButton.tsx

// 'use client' directive
// Imports
// CompleteSaleButton props
// CompleteSaleButton component
//   - Button element
//   - Validation logic
//   - Click handler
//   - Loading state
//   - Error handling
//   - Keyboard shortcut
```

### Verification Checklist
- [ ] `CompleteSaleButton.tsx` created
- [ ] Button renders prominently
- [ ] Validation implemented
- [ ] Click triggers API call
- [ ] Loading state shows
- [ ] Errors display
- [ ] Keyboard shortcut works
- [ ] Disabled appropriately

---

## Task 82: Implement Sale Completion API Call

### Overview
Implement the sale completion API call that sends the complete transaction data to the backend to process and record the sale.

### Dependencies
- Task 81: Create Complete Sale Action
- Group C, Task 46: Cart State Store
- Backend: Sales API endpoint

### Instructions

1. **Create API service function**
   - Create `completeSale.ts` in API services
   - Function: `completeSale(saleData)`
   - POST request to `/api/pos/sales/`
   - Return sale response

2. **Define sale data structure**
   - Cart items with quantities and prices
   - Payment information
   - Customer information (if selected)
   - Discount details
   - Tax amount
   - Totals
   - Shift ID
   - Cashier ID
   - Timestamp

3. **Prepare request payload**
   - Collect all cart data
   - Format items array
   - Format payments array
   - Include metadata
   - Validate before send

4. **Make API request**
   - Use fetch or axios
   - POST method
   - JSON content type
   - Include auth token
   - Handle timeout

5. **Handle API response**
   - Success: Sale ID, receipt data
   - Parse response
   - Extract sale ID
   - Extract receipt URL
   - Return to caller

6. **Handle API errors**
   - Network errors
   - Validation errors
   - Server errors
   - User-friendly messages
   - Retry option

7. **Update application state**
   - On success: Clear cart
   - Close payment modal
   - Show receipt modal (Task 83)
   - Update shift totals
   - Log transaction

8. **Add offline support**
   - Queue if offline
   - Sync when online
   - Show offline indicator
   - Warn user

### Sale Data Structure
```typescript
{
  items: [
    {
      productId: string,
      variantId?: string,
      quantity: number,
      unitPrice: number,
      lineTotal: number,
      discount?: number,
      tax?: number
    }
  ],
  payments: [
    {
      method: 'cash' | 'card' | 'bank_transfer',
      amount: number,
      details: {
        // Method-specific details
        approvalCode?: string,
        reference?: string,
        change?: number
      }
    }
  ],
  customer?: {
    id: string,
    name: string,
    phone: string
  },
  discount?: {
    type: 'percentage' | 'fixed',
    value: number,
    reason?: string
  },
  subtotal: number,
  discountAmount: number,
  taxAmount: number,
  total: number,
  shiftId: string,
  cashierId: string,
  timestamp: string
}
```

### API Request Flow
```
1. Validate sale data
   ↓
2. Format request payload
   ↓
3. Send POST request
   ↓
4. Wait for response
   ↓
5. Parse response
   ↓
6. Handle success/error
   ↓
7. Update application state
```

### API Response Structure
```typescript
// Success
{
  success: true,
  data: {
    saleId: string,
    receiptNumber: string,
    timestamp: string,
    total: number,
    receiptUrl?: string
  }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### Expected Service Structure
```typescript
// File: frontend/services/api/pos/completeSale.ts

// Imports
// Types for sale data and response
// completeSale function
//   - Input: Sale data
//   - Validate data
//   - Format payload
//   - Make API request
//   - Handle response
//   - Handle errors
//   - Output: Sale response or error

// Helper functions
// - formatSalePayload
// - validateSaleData
// - handleSaleResponse
// - handleSaleError
```

### Verification Checklist
- [ ] `completeSale.ts` created
- [ ] API service function implemented
- [ ] Request payload formatted correctly
- [ ] POST request sent
- [ ] Response parsed
- [ ] Success handled
- [ ] Errors handled
- [ ] Cart cleared on success
- [ ] Receipt shown on success
- [ ] Offline queuing (if implemented)
- [ ] Auth token included
- [ ] Validation before send

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 76 | Create Card Payment Option | Card payment form |
| 77 | Create Bank Transfer Payment Option | Bank transfer form |
| 78 | Create Split Payment Toggle | Split mode toggle |
| 79 | Create Split Payment Interface | Multi-payment manager |
| 80 | Create Customer Selection | Customer search/select |
| 81 | Create Complete Sale Action | Complete sale button |
| 82 | Implement Sale Completion API Call | API integration |

### Current Progress
```
frontend/
├── components/modules/pos/Payment/
│   ├── CardPayment.tsx              # Task 76 ✓
│   ├── BankTransferPayment.tsx      # Task 77 ✓
│   ├── SplitPaymentToggle.tsx       # Task 78 ✓
│   ├── SplitPaymentInterface.tsx    # Task 79 ✓
│   ├── CustomerSelection.tsx        # Task 80 ✓
│   ├── CompleteSaleButton.tsx       # Task 81 ✓
│   └── index.ts
└── services/api/pos/
    ├── completeSale.ts              # Task 82 ✓
    └── index.ts
```

### Group E Complete - Payment Processing Status
✓ **All Tasks Completed:**
- Cart action buttons and pay button (Doc 1)
- Payment modal with amount display (Doc 1)
- Payment methods grid (Doc 1)
- Cash payment with numpad and change (Doc 1)
- Card payment option (Doc 2)
- Bank transfer payment (Doc 2)
- Split payment toggle and interface (Doc 2)
- Customer selection (Doc 2)
- Complete sale action (Doc 2)
- Sale completion API call (Doc 2)

⏳ **Next Group: F - Receipt, Shift & Testing**
- Receipt modal with print/email (Tasks 83-85)
- New sale button (Task 86)
- Shift management (Tasks 87-91)
- Hold/retrieve sales (Tasks 92-94)
- Documentation and testing (Tasks 95-98)

### Next Steps
Proceed to [../Group-F_Receipt-Shift-Testing/](../Group-F_Receipt-Shift-Testing/) to implement receipt display, shift management, hold sales, and final testing.

---

## Notes for AI Agents

1. **Card Payment:** Approval code required, future integration with card terminals
2. **Bank Transfer:** Reference number required, verification warning important
3. **Split Payment:** Complex feature allowing multiple payment methods for one sale
4. **Customer Selection:** Optional but useful for loyalty and invoicing
5. **Sale Completion:** Critical API call, must handle errors gracefully
6. **Offline Support:** Consider queuing sales when offline for later sync
7. **Validation:** Multi-level validation before allowing sale completion
8. **Next Group:** Receipt display, shift open/close, hold sales, comprehensive testing
