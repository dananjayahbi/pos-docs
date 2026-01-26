# Tasks 81-88: Payment Recording and Processing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** F - Payment & Shipping  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Quotes-Conversion](../Group-E_Quotes-Conversion/)
- **→ Next Document:** [02_Tasks-89-96_Shipping-Testing.md](02_Tasks-89-96_Shipping-Testing.md)

---

## Document Overview

This document covers payment recording functionality including record payment modal, payment form with validation, payment method selection, amount input, reference tracking, and submission logic. These components enable comprehensive payment management for orders and invoices.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Record Payment Modal | Medium | 40 min |
| 82 | Create Payment Form Schema | Medium | 35 min |
| 83 | Create Payment Method Select | Low | 25 min |
| 84 | Create Amount Input Component | Medium | 30 min |
| 85 | Create Reference Number Input | Low | 20 min |
| 86 | Create Payment Date Picker | Low | 20 min |
| 87 | Create Payment Notes Field | Low | 15 min |
| 88 | Implement Submit Payment Action | High | 50 min |

---

## Task 81: Create Record Payment Modal

### Overview
Create RecordPaymentModal component for recording payments against orders and invoices with comprehensive payment form.

### Dependencies
- Order/Invoice details pages
- Payment form components (Tasks 82-87)
- Modal component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Payments/`
   - Create file `RecordPaymentModal.tsx`

2. **Build modal structure**
   - Title: "Record Payment"
   - Order/Invoice summary
   - Payment form sections
   - Action buttons

3. **Display order/invoice summary**
   - Order/Invoice number
   - Customer name
   - Total amount
   - Amount paid
   - Amount due

4. **Add form sections**
   - Payment method (Task 83)
   - Payment amount (Task 84)
   - Reference number (Task 85)
   - Payment date (Task 86)
   - Payment notes (Task 87)

5. **Initialize form**
   - Use React Hook Form
   - Apply validation schema (Task 82)
   - Set default amount to full due

6. **Add action buttons**
   - Cancel button
   - Record Payment button (primary)

7. **Handle modal state**
   - Open/close controls
   - Reset form on close
   - Loading state during submission

### Modal Layout

```
┌─────────────────────────────────────────┐
│ Record Payment                      [X] │
├─────────────────────────────────────────┤
│                                         │
│ Order: ORD-0001                         │
│ Customer: ABC Corporation               │
│                                         │
│ Total:     LKR 10,000.00                │
│ Paid:      LKR  2,000.00                │
│ Due:       LKR  8,000.00                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Payment Method *                    │ │
│ │ [Cash ▼]                            │ │
│ │                                     │ │
│ │ Payment Amount *                    │ │
│ │ [8,000.00]                          │ │
│ │                                     │ │
│ │ Reference Number                    │ │
│ │ [TXN-12345]                         │ │
│ │                                     │ │
│ │ Payment Date *                      │ │
│ │ [Jan 15, 2025 ▼]                    │ │
│ │                                     │ │
│ │ Notes                               │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │                                 │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│          [Cancel] [Record Payment]      │
│                                         │
└─────────────────────────────────────────┘
```

### Expected Outcome
- Payment modal functional
- Summary displays correctly
- Form renders properly
- Validation applies

### Verification Checklist
- [ ] Modal component created
- [ ] Opens/closes correctly
- [ ] Summary displays
- [ ] Form initializes
- [ ] All fields render
- [ ] Buttons functional

---

## Task 82: Create Payment Form Schema

### Overview
Create Zod validation schema for payment form ensuring valid payment data with proper constraints.

### Dependencies
- Task 81: Record Payment Modal
- Zod validation library

### Instructions

1. **Create validation schema file**
   - Navigate to `frontend/lib/validations/` directory
   - Create file `payment.ts`

2. **Define payment schema**
   - payment_method: Required, one of valid methods
   - amount: Required, positive, <= amount_due
   - reference_number: Optional string
   - payment_date: Required, not future
   - notes: Optional string

3. **Add custom validations**
   - Amount must be positive
   - Amount cannot exceed due amount
   - Payment date cannot be future
   - Reference format validation

4. **Define payment method enum**
   - cash, bank_transfer, credit_card, debit_card, cheque, online

5. **Export schema and types**
   - Export paymentSchema
   - Export PaymentFormData type
   - Export PaymentMethod type

### Schema Structure

```typescript
paymentMethodEnum = z.enum([
  'cash',
  'bank_transfer',
  'credit_card',
  'debit_card',
  'cheque',
  'online'
]);

paymentSchema = z.object({
  payment_method: paymentMethodEnum,
  amount: z.number().positive().refine(
    (val) => val <= amountDue,
    "Amount cannot exceed due amount"
  ),
  reference_number: z.string().optional(),
  payment_date: z.date().max(today),
  notes: z.string().optional()
});
```

### Validation Rules

| Field | Rule | Message |
|-------|------|---------|
| payment_method | Required, Valid enum | "Payment method is required" |
| amount | Positive, <= due | "Invalid payment amount" |
| payment_date | Not future | "Payment date cannot be in future" |
| reference_number | Optional | - |
| notes | Optional | - |

### Expected Outcome
- Validation schema created
- All rules implemented
- Custom validations working
- Types exported

### Verification Checklist
- [ ] Schema file created
- [ ] paymentSchema defined
- [ ] Enum defined
- [ ] Custom validations added
- [ ] Error messages clear
- [ ] Types exported

---

## Task 83: Create Payment Method Select

### Overview
Create PaymentMethodSelect component with dropdown for selecting payment method with icons and descriptions.

### Dependencies
- Task 81: Record Payment Modal
- Select component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Payments/`
   - Create file `PaymentMethodSelect.tsx`

2. **Define payment methods**
   - Cash
   - Bank Transfer
   - Credit Card
   - Debit Card
   - Cheque
   - Online Payment

3. **Add method icons**
   - Cash: Banknote icon
   - Bank Transfer: Building icon
   - Credit Card: CreditCard icon
   - Debit Card: CreditCard icon
   - Cheque: FileText icon
   - Online: Smartphone icon

4. **Build select component**
   - Display method with icon
   - Show description on hover
   - Required field

5. **Handle validation**
   - Required field validation
   - Display error message

### Payment Methods

| Method | Icon | Description |
|--------|------|-------------|
| Cash | Banknote | Cash payment received |
| Bank Transfer | Building | Direct bank transfer |
| Credit Card | CreditCard | Credit card payment |
| Debit Card | CreditCard | Debit card payment |
| Cheque | FileText | Cheque payment |
| Online | Smartphone | Online payment gateway |

### Expected Outcome
- Payment method select functional
- All methods listed
- Icons display
- Validation works

### Verification Checklist
- [ ] Component created
- [ ] All methods defined
- [ ] Icons display
- [ ] Select works
- [ ] Validation applies

---

## Task 84: Create Amount Input Component

### Overview
Create PaymentAmountInput component with currency formatting, validation, and quick amount selection buttons.

### Dependencies
- Task 81: Record Payment Modal
- Currency input component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Payments/`
   - Create file `PaymentAmountInput.tsx`

2. **Build amount input**
   - Currency input field
   - Format: LKR with decimals
   - Show amount due below input

3. **Add quick amount buttons**
   - Full Amount button (amount due)
   - Half Amount button (50%)
   - Custom amount

4. **Implement validation**
   - Must be positive
   - Cannot exceed amount due
   - Display validation errors

5. **Add amount due indicator**
   - Show remaining amount
   - Update on input change
   - Highlight if overpaid

6. **Format currency**
   - Thousands separator
   - Two decimal places
   - LKR prefix

### Component Layout

```
┌─────────────────────────────────┐
│ Payment Amount *                │
│ ┌─────────────────────────────┐ │
│ │ LKR 8,000.00                │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Full (8,000)] [Half (4,000)]  │
│                                 │
│ Amount Due: LKR 8,000.00        │
└─────────────────────────────────┘
```

### Expected Outcome
- Amount input functional
- Quick buttons work
- Validation applies
- Currency formats correctly

### Verification Checklist
- [ ] Component created
- [ ] Input renders
- [ ] Quick buttons work
- [ ] Validation functions
- [ ] Currency formats
- [ ] Due amount displays

---

## Task 85: Create Reference Number Input

### Overview
Create PaymentReferenceInput component for entering transaction reference numbers with optional format validation.

### Dependencies
- Task 81: Record Payment Modal
- Input component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Payments/`
   - Create file `PaymentReferenceInput.tsx`

2. **Build reference input**
   - Text input field
   - Optional field
   - Placeholder text

3. **Add format hint**
   - Display expected format
   - Example: TXN-12345

4. **Add method-specific hints**
   - Bank Transfer: Transaction ID
   - Credit/Debit: Last 4 digits
   - Cheque: Cheque number
   - Online: Gateway reference

5. **Implement validation**
   - Optional field
   - Format validation if provided
   - Max length

### Reference Format Hints

| Payment Method | Reference Example | Label |
|----------------|-------------------|-------|
| Cash | - | Receipt Number (optional) |
| Bank Transfer | TXN-123456 | Transaction ID |
| Credit Card | XXXX-1234 | Last 4 digits |
| Debit Card | XXXX-1234 | Last 4 digits |
| Cheque | CHQ-789012 | Cheque Number |
| Online | PAY-ABC123 | Gateway Reference |

### Expected Outcome
- Reference input functional
- Hints display correctly
- Validation works
- Optional field

### Verification Checklist
- [ ] Component created
- [ ] Input renders
- [ ] Hints display
- [ ] Validation works
- [ ] Optional logic correct

---

## Task 86: Create Payment Date Picker

### Overview
Create PaymentDatePicker component for selecting payment date with constraint that date cannot be in the future.

### Dependencies
- Task 81: Record Payment Modal
- DatePicker component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Payments/`
   - Create file `PaymentDatePicker.tsx`

2. **Build date picker**
   - Date picker component
   - Default: today
   - Required field

3. **Add date constraints**
   - Maximum: today
   - Cannot select future dates
   - Display validation error

4. **Add quick date buttons**
   - Today button
   - Yesterday button
   - Custom date

5. **Format display**
   - Format: MMM dd, yyyy
   - Show day of week

### Date Picker Layout

```
┌─────────────────────────────────┐
│ Payment Date *                  │
│ ┌─────────────────────────────┐ │
│ │ Jan 15, 2025 ▼              │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Today] [Yesterday]             │
└─────────────────────────────────┘
```

### Expected Outcome
- Date picker functional
- Constraints working
- Quick buttons function
- Validation applies

### Verification Checklist
- [ ] Component created
- [ ] Picker renders
- [ ] Future dates disabled
- [ ] Quick buttons work
- [ ] Validation applies
- [ ] Format correct

---

## Task 87: Create Payment Notes Field

### Overview
Create PaymentNotesField component for adding optional notes about the payment transaction.

### Dependencies
- Task 81: Record Payment Modal
- Textarea component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Payments/`
   - Create file `PaymentNotesField.tsx`

2. **Build notes textarea**
   - Multi-line textarea
   - Optional field
   - Placeholder text

3. **Add character limit**
   - Max 500 characters
   - Show character count
   - Prevent overflow

4. **Add common templates**
   - "Partial payment received"
   - "Full payment completed"
   - "Payment via [method]"

### Notes Field Layout

```
┌─────────────────────────────────┐
│ Notes (optional)                │
│ ┌─────────────────────────────┐ │
│ │ Partial payment received    │ │
│ │ Balance to be paid next     │ │
│ │ month.                      │ │
│ └─────────────────────────────┘ │
│ 45 / 500 characters             │
└─────────────────────────────────┘
```

### Expected Outcome
- Notes field functional
- Character limit enforced
- Templates available
- Optional field

### Verification Checklist
- [ ] Component created
- [ ] Textarea renders
- [ ] Character count works
- [ ] Limit enforced
- [ ] Optional logic correct

---

## Task 88: Implement Submit Payment Action

### Overview
Implement payment submission logic including API call, validation, state updates, and success handling.

### Dependencies
- Task 81: Record Payment Modal
- All form components (Tasks 82-87)
- Payment API hooks

### Instructions

1. **Create payment hook**
   - Navigate to `frontend/hooks/sales/` directory
   - Create file `useRecordPayment.ts`

2. **Define payment mutation**
   - Use useMutation from TanStack Query
   - Endpoint: POST /api/payments

3. **Build payment payload**
   - order_id or invoice_id
   - payment_method
   - amount
   - reference_number
   - payment_date
   - notes

4. **Implement form submission**
   - Validate all fields
   - Disable submit during loading
   - Show loading state

5. **Handle API response**
   - Success: Payment recorded
   - Error: Display validation errors

6. **Update UI on success**
   - Close modal
   - Show success toast
   - Refresh order/invoice data
   - Update payment history

7. **Add error handling**
   - Display API errors
   - Keep modal open on error
   - Allow retry

8. **Invalidate related queries**
   - Invalidate orders/invoices
   - Invalidate payments list
   - Update cache

### Submission Flow

```
User Fill Form
       ↓
Validate Fields
       ↓
Click Record Payment
       ↓
Disable Submit Button
       ↓
API: POST /api/payments
       ↓
Backend Process Payment
       ↓
Returns Payment Object
       ↓
Update Order/Invoice Status
       ↓
Update Payment Balance
       ↓
Invalidate Caches
       ↓
Show Success Toast
       ↓
Close Modal
       ↓
Refresh Parent Data
```

### API Payload

```typescript
{
  order_id?: "uuid",
  invoice_id?: "uuid",
  payment_method: "cash" | "bank_transfer" | ...,
  amount: number,
  reference_number?: string,
  payment_date: "YYYY-MM-DD",
  notes?: string
}
```

### API Response

```typescript
{
  success: boolean,
  payment: {
    id: "uuid",
    payment_number: "PAY-0001",
    order_id?: "uuid",
    invoice_id?: "uuid",
    payment_method: string,
    amount: number,
    reference_number?: string,
    payment_date: string,
    notes?: string,
    created_at: string
  },
  updated_balance: {
    total_amount: number,
    paid_amount: number,
    due_amount: number,
    payment_status: "pending" | "partial" | "paid"
  }
}
```

### Expected Outcome
- Payment submission working
- API integration functional
- State updates correct
- Success handling complete

### Verification Checklist
- [ ] Hook created
- [ ] Mutation defined
- [ ] Payload builds correctly
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Success toast shows
- [ ] Modal closes
- [ ] Data refreshes
- [ ] Cache invalidates
- [ ] Error handling works

---

## Summary

This document covered complete payment recording functionality including modal interface, validation schema, form components, and submission logic.

### Completed Components

1. **RecordPaymentModal** - Payment recording interface
2. **PaymentFormSchema** - Validation schema
3. **PaymentMethodSelect** - Payment method selector
4. **PaymentAmountInput** - Amount input with validation
5. **PaymentReferenceInput** - Reference number field
6. **PaymentDatePicker** - Date selection
7. **PaymentNotesField** - Notes textarea
8. **useRecordPayment** - Submission logic hook

### Payment Features

- ✓ Multiple payment methods
- ✓ Amount validation
- ✓ Reference tracking
- ✓ Date constraints
- ✓ Optional notes
- ✓ Balance calculation
- ✓ Status updates
- ✓ Cache synchronization

### Next Steps

Proceed to **Document 02** to implement shipping label generation, carrier selection, tracking management, and final module testing.

---

**End of Document 01**
