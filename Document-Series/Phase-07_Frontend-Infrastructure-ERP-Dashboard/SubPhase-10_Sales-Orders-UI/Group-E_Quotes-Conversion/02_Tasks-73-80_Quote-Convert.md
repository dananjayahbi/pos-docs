# Tasks 73-80: Customer Select, Items, Validity, and Quote Conversion

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** E - Quotes & Conversion  
> **Document:** 02 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-72_Quote-Display.md](01_Tasks-65-72_Quote-Display.md)
- **→ Next Group:** [Group-F_Payment-Shipping](../Group-F_Payment-Shipping/)

---

## Document Overview

This document covers customer selection component, quote items management, validity period settings, quote details page, and quote-to-order conversion functionality. These components complete the quote workflow and conversion process.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create Customer Select Component | Medium | 35 min |
| 74 | Create Quote Items Section | High | 50 min |
| 75 | Create Validity Section | Low | 25 min |
| 76 | Create Quote Details Page | Medium | 45 min |
| 77 | Create Quote Details Header | Low | 25 min |
| 78 | Create Convert to Order Button | Medium | 35 min |
| 79 | Create Conversion Modal | Medium | 40 min |
| 80 | Implement Conversion Logic | High | 60 min |

---

## Task 73: Create Customer Select Component

### Overview
Create CustomerSelect component with searchable dropdown for selecting customer on quote form, including create new customer option.

### Dependencies
- Task 71: New Quote Page
- Customer API hooks

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `CustomerSelect.tsx`

2. **Build select structure**
   - Searchable select component
   - Display customer name and email
   - Show Create New option

3. **Implement search**
   - Debounced search input
   - Filter customers by name/email
   - Load from useCustomers hook

4. **Add customer creation**
   - Create New button
   - Open customer modal
   - Refresh list on success
   - Auto-select new customer

5. **Handle validation**
   - Required field
   - Display error message
   - Clear validation on change

6. **Add selected customer info**
   - Display billing address
   - Display contact info
   - Show customer link

### Component Flow

```
┌─────────────────────────────────┐
│ Select Customer *               │
├─────────────────────────────────┤
│ [Search customers...]           │
│                                 │
│ Results:                        │
│ ○ John Doe (john@example.com)  │
│ ○ Jane Smith (jane@example.com)│
│ ○ ABC Corp (info@abc.com)      │
│                                 │
│ + Create New Customer           │
└─────────────────────────────────┘

Selected:
┌─────────────────────────────────┐
│ ABC Corporation                 │
│ info@abc.com | +94 11 234 5678 │
│ 123 Main St, Colombo 03        │
└─────────────────────────────────┘
```

### Expected Outcome
- Customer select functional
- Search working
- Create new option
- Selected info displays

### Verification Checklist
- [ ] Component created
- [ ] Search works
- [ ] Results display
- [ ] Create new functions
- [ ] Validation works
- [ ] Selected info shows

---

## Task 74: Create Quote Items Section

### Overview
Create QuoteItemsSection component for managing quote line items with add, edit, remove, and calculate totals functionality.

### Dependencies
- Task 71: New Quote Page
- Product API hooks

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuoteItemsSection.tsx`

2. **Build items table structure**
   - Column headers: Product, Variant, Qty, Price, Discount, Total
   - Item rows with editable fields
   - Add Item button

3. **Create Add Item button**
   - Opens product search modal
   - Select product and variant
   - Add to items array

4. **Implement item row**
   - Product name with link
   - Variant select (if product has variants)
   - Quantity input (number, min 1)
   - Unit price input (currency)
   - Discount input (percentage)
   - Calculated line total
   - Remove button

5. **Add item actions**
   - Edit quantity
   - Edit price
   - Edit discount
   - Remove item

6. **Calculate totals**
   - Subtotal (sum of line totals)
   - Total discount amount
   - Tax amount (if applicable)
   - Grand total

7. **Add validation**
   - At least one item required
   - Positive quantities
   - Valid prices

### Items Table Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ Quote Items                                        [+ Add Item]   │
├──────────────────────────────────────────────────────────────────┤
│ Product     │ Variant │ Qty │ Price    │ Disc% │ Total    │ [X] │
│─────────────────────────────────────────────────────────────────│
│ Product A   │ Small   │  5  │ 1,000.00 │  10%  │ 4,500.00 │ [X] │
│ Product B   │ -       │  2  │ 2,500.00 │   0%  │ 5,000.00 │ [X] │
│─────────────────────────────────────────────────────────────────│
│                                         Subtotal:    9,500.00    │
│                                      Discount (-):    500.00     │
│                                     Tax (8%):         720.00     │
│                                            Total: LKR 9,720.00   │
└──────────────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Items section functional
- Add/remove items works
- Calculations accurate
- Validation applies

### Verification Checklist
- [ ] Component created
- [ ] Table renders
- [ ] Add item works
- [ ] Edit fields work
- [ ] Remove item works
- [ ] Totals calculate
- [ ] Validation functions

---

## Task 75: Create Validity Section

### Overview
Create ValiditySection component for setting quote expiry date and validity period with terms and notes fields.

### Dependencies
- Task 71: New Quote Page
- DatePicker component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `ValiditySection.tsx`

2. **Add Expiry Date picker**
   - Date picker component
   - Minimum: tomorrow
   - Required field
   - Display format

3. **Add Validity Days input**
   - Number input (1-365)
   - Auto-calculate expiry
   - Update on change

4. **Add Terms field**
   - Textarea input
   - Default terms template
   - Optional

5. **Add Notes field**
   - Textarea input
   - Internal notes
   - Optional

6. **Implement auto-calculation**
   - Set validity days → update expiry
   - Set expiry → calculate validity days

### Section Layout

```
┌─────────────────────────────────┐
│ Validity & Terms                │
├─────────────────────────────────┤
│                                 │
│ Expiry Date *                   │
│ [MMM dd, yyyy ▼]                │
│                                 │
│ Valid For (days)                │
│ [30]                            │
│                                 │
│ Terms & Conditions              │
│ ┌─────────────────────────────┐ │
│ │ Payment within 30 days      │ │
│ │ 50% advance required        │ │
│ │ Prices valid until expiry   │ │
│ └─────────────────────────────┘ │
│                                 │
│ Internal Notes                  │
│ ┌─────────────────────────────┐ │
│ │ Customer requested discount │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Expected Outcome
- Validity section functional
- Date picker works
- Auto-calculation works
- Optional fields available

### Verification Checklist
- [ ] Component created
- [ ] Expiry picker works
- [ ] Validity days input works
- [ ] Auto-calculation functions
- [ ] Terms field displays
- [ ] Notes field displays

---

## Task 76: Create Quote Details Page

### Overview
Create quote details page displaying all quote information including customer, items, validity, status, and actions.

### Dependencies
- Quote routing configured
- useQuoteDetails hook

### Instructions

1. **Create details page route**
   - Navigate to `frontend/app/(dashboard)/quotes/[id]/` directory
   - Create file `page.tsx`

2. **Build page structure**
   - Header with actions (Task 77)
   - Status banner
   - Two-column layout:
     - Left: Quote info, Items
     - Right: Customer info, Validity

3. **Fetch quote data**
   - Use useQuoteDetails hook
   - Handle loading state
   - Handle not found error

4. **Create Quote Info section**
   - Quote number
   - Quote date
   - Created by
   - Last updated

5. **Create Items Display**
   - Items table (read-only)
   - Quantities and prices
   - Totals calculation

6. **Create Customer Info section**
   - Customer name and contact
   - Billing address
   - Shipping address (if different)

7. **Create Validity Info section**
   - Expiry date
   - Days remaining
   - Status indicator
   - Terms display

8. **Add breadcrumb**
   - Path: Sales > Quotes > QUO-XXXX
   - Position above header

### Page Layout

```
┌─────────────────────────────────────────────────┐
│ Quote Details Header                            │
├─────────────────────────────────────────────────┤
│ [Status Banner]                                 │
├─────────────────────┬───────────────────────────┤
│ Quote Information   │ Customer Information      │
│                     │                           │
│ Quote Items         │ Validity Information      │
│                     │                           │
│                     │ Notes & Terms             │
└─────────────────────┴───────────────────────────┘
```

### Expected Outcome
- Quote details page functional
- All sections render
- Data displays correctly
- Actions available

### Verification Checklist
- [ ] Page route created
- [ ] Layout renders
- [ ] Data fetches
- [ ] All sections display
- [ ] Loading state works
- [ ] Error handling works

---

## Task 77: Create Quote Details Header

### Overview
Create QuoteDetailsHeader component with quote number, status, and action buttons (Edit, Convert to Order, Send, Print, Delete).

### Dependencies
- Task 76: Quote Details Page

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuoteDetailsHeader.tsx`

2. **Build header layout**
   - Left: Quote number and status
   - Right: Action buttons

3. **Add action buttons**
   - Edit button (if draft)
   - Convert to Order button (Task 78)
   - Send Quote button
   - Print button
   - Delete button (dropdown)

4. **Implement Edit button**
   - Visible only for draft quotes
   - Navigate to /quotes/[id]/edit

5. **Implement Send button**
   - Open send quote modal
   - Email quote to customer
   - Update status to sent

6. **Implement Print button**
   - Generate PDF
   - Open print dialog

7. **Add status-based visibility**
   - Draft: Edit, Send, Delete
   - Sent: Convert, Resend, Print
   - Accepted: Convert, Print
   - Rejected: Delete
   - Expired: Delete

### Header Layout

```
┌─────────────────────────────────────────────────────────┐
│ QUO-0001                               [Sent Badge]     │
│                                                          │
│              [Edit] [Convert] [Send] [Print] [...More] │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Header component functional
- All buttons display
- Status-based logic works
- Actions trigger correctly

### Verification Checklist
- [ ] Header created
- [ ] Quote number displays
- [ ] Status badge shows
- [ ] All buttons render
- [ ] Visibility logic works
- [ ] Actions function

---

## Task 78: Create Convert to Order Button

### Overview
Create ConvertToOrderButton component that initiates quote-to-order conversion process with validation.

### Dependencies
- Task 77: Quote Details Header
- Conversion logic (Task 80)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `ConvertToOrderButton.tsx`

2. **Add button rendering**
   - Primary style
   - Icon: ShoppingCart or ArrowRight
   - Label: "Convert to Order"

3. **Add visibility logic**
   - Show only for: Sent, Accepted quotes
   - Hide for: Draft, Rejected, Expired
   - Disable if already converted

4. **Implement click handler**
   - Validate quote status
   - Check items availability
   - Open conversion modal (Task 79)

5. **Add tooltip**
   - Show conversion requirements
   - Explain disabled state

### Button States

| Quote Status | Visible | Enabled | Tooltip |
|--------------|---------|---------|---------|
| Draft | No | - | - |
| Sent | Yes | Yes | "Convert this quote to a sales order" |
| Accepted | Yes | Yes | "Convert this quote to a sales order" |
| Rejected | No | - | - |
| Expired | No | - | - |
| Converted | Yes | No | "Already converted to order" |

### Expected Outcome
- Button component functional
- Visibility logic correct
- Click triggers modal
- Validation works

### Verification Checklist
- [ ] Component created
- [ ] Button renders
- [ ] Visibility logic works
- [ ] Click opens modal
- [ ] Disabled states correct
- [ ] Tooltip displays

---

## Task 79: Create Conversion Modal

### Overview
Create ConversionModal component for confirming quote-to-order conversion with configuration options.

### Dependencies
- Task 78: Convert Button
- Modal component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `ConversionModal.tsx`

2. **Build modal structure**
   - Title: "Convert Quote to Order"
   - Quote summary
   - Configuration options
   - Action buttons

3. **Display quote summary**
   - Quote number
   - Customer name
   - Total amount
   - Item count

4. **Add configuration options**
   - Generate invoice checkbox
   - Send confirmation email checkbox
   - Apply discount from quote checkbox
   - Order notes field

5. **Add confirmation buttons**
   - Cancel button
   - Convert button (primary)

6. **Implement conversion**
   - Call conversion API (Task 80)
   - Show loading state
   - Handle success/error
   - Navigate to new order on success

### Modal Layout

```
┌─────────────────────────────────────┐
│ Convert Quote to Order          [X] │
├─────────────────────────────────────┤
│                                     │
│ Quote: QUO-0001                     │
│ Customer: ABC Corporation           │
│ Amount: LKR 9,720.00                │
│ Items: 2                            │
│                                     │
│ ☑ Generate Invoice                 │
│ ☑ Send Confirmation Email          │
│ ☑ Apply Quote Discount             │
│                                     │
│ Order Notes (optional)              │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│          [Cancel] [Convert Order]   │
│                                     │
└─────────────────────────────────────┘
```

### Expected Outcome
- Modal component functional
- Summary displays
- Options configurable
- Conversion triggers

### Verification Checklist
- [ ] Modal created
- [ ] Summary displays
- [ ] Checkboxes work
- [ ] Notes field works
- [ ] Cancel closes modal
- [ ] Convert triggers action

---

## Task 80: Implement Conversion Logic

### Overview
Implement the quote-to-order conversion logic including API calls, data transformation, and state updates.

### Dependencies
- Task 79: Conversion Modal
- API hooks for quotes and orders

### Instructions

1. **Create conversion hook**
   - Navigate to `frontend/hooks/sales/` directory
   - Create file `useQuoteConversion.ts`

2. **Define conversion mutation**
   - Use useMutation from TanStack Query
   - Endpoint: POST /api/quotes/{id}/convert

3. **Build conversion payload**
   - quote_id: Source quote ID
   - generate_invoice: Boolean
   - send_email: Boolean
   - apply_discount: Boolean
   - order_notes: String

4. **Handle API response**
   - Success: Returns new order object
   - Error: Returns validation errors

5. **Implement optimistic updates**
   - Update quote status to "converted"
   - Add order_id to quote
   - Invalidate quotes queries

6. **Add success handling**
   - Show success toast
   - Navigate to new order details
   - Close modal

7. **Add error handling**
   - Display API errors
   - Keep modal open
   - Allow retry

8. **Update related data**
   - Invalidate quotes list
   - Invalidate orders list
   - Update quote cache

### Conversion Flow

```
User Click Convert
       ↓
Validate Quote Status
       ↓
Open Conversion Modal
       ↓
User Configure Options
       ↓
Submit Conversion
       ↓
API: POST /quotes/{id}/convert
       ↓
Backend Creates Order
       ↓
Returns Order Object
       ↓
Update Quote Status
       ↓
Invalidate Caches
       ↓
Navigate to Order Details
```

### API Payload

```typescript
{
  quote_id: "uuid",
  generate_invoice: boolean,
  send_email: boolean,
  apply_discount: boolean,
  order_notes: string | null
}
```

### API Response

```typescript
{
  success: boolean,
  order: {
    id: "uuid",
    order_number: "ORD-0001",
    quote_id: "uuid",
    customer_id: "uuid",
    items: [...],
    total_amount: number,
    status: "pending",
    invoice_id?: "uuid"
  },
  invoice?: {
    id: "uuid",
    invoice_number: "INV-0001"
  }
}
```

### Expected Outcome
- Conversion logic implemented
- API integration working
- State updates correct
- Navigation functional

### Verification Checklist
- [ ] Hook created
- [ ] Mutation defined
- [ ] Payload builds correctly
- [ ] API calls work
- [ ] Success handling works
- [ ] Error handling works
- [ ] Cache invalidation works
- [ ] Navigation functions
- [ ] Toast notifications show

---

## Summary

This document covered customer selection, quote items management, validity settings, quote details display, and complete quote-to-order conversion functionality.

### Completed Components

1. **CustomerSelect** - Customer selection with search
2. **QuoteItemsSection** - Line items management
3. **ValiditySection** - Expiry and terms
4. **QuoteDetailsPage** - Quote details display
5. **QuoteDetailsHeader** - Header with actions
6. **ConvertToOrderButton** - Conversion trigger
7. **ConversionModal** - Conversion configuration
8. **useQuoteConversion** - Conversion logic hook

### Conversion Capabilities

- ✓ Quote to Order conversion
- ✓ Optional invoice generation
- ✓ Email notifications
- ✓ Discount preservation
- ✓ Status tracking
- ✓ Cache synchronization

### Next Steps

Proceed to **Group-F** to implement payment processing, shipping label generation, and final testing.

---

**End of Document 02**
