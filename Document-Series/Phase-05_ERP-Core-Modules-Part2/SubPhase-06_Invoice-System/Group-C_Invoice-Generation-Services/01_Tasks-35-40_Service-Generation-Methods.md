# Tasks 35-40: InvoiceService - Generation & Status Transitions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** C - Invoice Generation Services  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-46_Validation-Overdue-Aging-History.md](02_Tasks-41-46_Validation-Overdue-Aging-History.md)

---

## Document Overview

This document covers the creation of the InvoiceService class with methods for invoice generation from orders, manual creation, duplication, and status transition workflows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create InvoiceService Class | High | 30 min |
| 36 | Implement Invoice from Order | Medium | 25 min |
| 37 | Implement Copy Order Line Items | Medium | 25 min |
| 38 | Implement Manual Invoice Creation | Medium | 25 min |
| 39 | Implement Invoice Duplication | Medium | 25 min |
| 40 | Implement Invoice Status Transitions | High | 30 min |

---

## Task 35: Create InvoiceService Class

### Overview
Create the main InvoiceService class in the services layer that will encapsulate all invoice business logic operations.

### Dependencies
- Task 34: InvoiceSettings Model (Group B)

### Instructions

1. **Create the InvoiceService file**
   - Create `apps/invoices/services/invoice_service.py`
   - Import necessary models (Invoice, InvoiceLineItem, Order)
   - Import Django transaction, timezone modules

2. **Define the InvoiceService class**
   - Create class `InvoiceService`
   - Make it stateless (no instance variables)
   - Use class methods or static methods

3. **Add initialization method**
   - Accept tenant context
   - Load InvoiceSettings for the tenant
   - Set default values from settings

4. **Add validation helper**
   - Create `_validate_invoice_data()` method
   - Check required fields
   - Validate customer reference
   - Validate date ranges

5. **Add number generation helper**
   - Create `_generate_invoice_number()` method
   - Use format from InvoiceSettings
   - Ensure uniqueness within tenant
   - Handle year rollover

6. **Add tax calculation helper**
   - Create `_calculate_line_taxes()` method
   - Apply VAT/SVAT rates
   - Calculate per-line tax amounts
   - Return subtotal and tax breakdown

7. **Add total calculation helper**
   - Create `_calculate_totals()` method
   - Sum line item subtotals
   - Add all taxes
   - Apply invoice-level discounts
   - Return final total

8. **Add error handling**
   - Define custom exceptions (InvoiceError, InvoiceValidationError)
   - Wrap operations in try-except blocks
   - Provide meaningful error messages

### Service Structure

```
InvoiceService
├── __init__(tenant)
├── _validate_invoice_data(data)
├── _generate_invoice_number()
├── _calculate_line_taxes(items)
├── _calculate_totals(invoice)
├── create_invoice(data, items, user)          [Task 38]
├── create_from_order(order_id, user)          [Task 36]
├── copy_order_line_items(order, invoice)      [Task 37]
├── duplicate_invoice(invoice_id, user)        [Task 39]
├── issue(invoice_id, user)                    [Task 40]
├── send(invoice_id, email, user)              [Task 40]
├── mark_paid(invoice_id, payment_data, user)  [Task 40]
├── cancel(invoice_id, reason, user)           [Task 40]
└── void(invoice_id, reason, user)             [Task 40]
```

### Expected Outcome
```
apps/invoices/services/
├── __init__.py
└── invoice_service.py
```

### Verification Checklist
- [ ] InvoiceService class created
- [ ] Helper methods implemented
- [ ] Tax calculation logic added
- [ ] Number generation works
- [ ] Error handling implemented
- [ ] Imports are correct

---

## Task 36: Implement Invoice from Order

### Overview
Implement the method to automatically generate an invoice from a completed order, copying all relevant details.

### Dependencies
- Task 35: Create InvoiceService Class

### Instructions

1. **Create create_from_order method**
   - Add method `create_from_order(order_id, user)` to InvoiceService
   - Accept order UUID and requesting user
   - Return created Invoice instance

2. **Validate order status**
   - Fetch Order by ID
   - Check order status is COMPLETED
   - Raise error if order not found or not completed
   - Check order doesn't already have invoice

3. **Create invoice instance**
   - Set type to STANDARD
   - Set status to DRAFT
   - Copy tenant from order
   - Generate invoice number

4. **Copy customer details**
   - Copy customer reference from order
   - Copy billing_name, billing_email, billing_phone
   - Copy billing_address_line1, billing_address_line2
   - Copy billing_city, billing_postal_code, billing_country

5. **Copy order metadata**
   - Link to order via related_order FK
   - Copy order_reference
   - Copy order notes to invoice notes

6. **Set dates**
   - Set issue_date to today
   - Calculate due_date from InvoiceSettings default_due_days
   - Set created_by to user

7. **Call copy line items**
   - Call Task 37 method: `copy_order_line_items(order, invoice)`
   - This populates InvoiceLineItem records

8. **Apply order-level discounts**
   - If order has discount_percentage, copy to invoice
   - If order has discount_amount, copy to invoice

9. **Calculate and save**
   - Call `_calculate_totals(invoice)`
   - Save invoice instance
   - Return invoice

### Order to Invoice Mapping

| Order Field | Invoice Field |
|-------------|---------------|
| order_number | order_reference |
| customer | customer |
| billing_name | billing_name |
| billing_address_* | billing_address_* |
| discount_percentage | discount_percentage |
| discount_amount | discount_amount |
| notes | notes |
| - | issue_date (today) |
| - | due_date (calculated) |

### Order-to-Invoice Flow Diagram

```
┌──────────────────┐
│  Order COMPLETED │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Validate Order       │
│ - Status COMPLETED   │
│ - No existing invoice│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Create Invoice       │
│ - Type: STANDARD     │
│ - Status: DRAFT      │
│ - Generate number    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Copy Details         │
│ - Customer info      │
│ - Billing address    │
│ - Order metadata     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Copy Line Items      │
│ [Task 37]            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Calculate Totals     │
│ - Subtotal           │
│ - Taxes              │
│ - Discounts          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Save & Return        │
│ Invoice (DRAFT)      │
└──────────────────────┘
```

### Expected Outcome
- Invoice created with DRAFT status
- All customer details copied
- Line items ready to be populated (Task 37)
- Invoice linked to order

### Verification Checklist
- [ ] Method `create_from_order()` implemented
- [ ] Order validation works
- [ ] Customer details copied correctly
- [ ] Invoice number generated
- [ ] Due date calculated
- [ ] Order linkage established

---

## Task 37: Implement Copy Order Line Items

### Overview
Implement the method to copy all line items from an order to an invoice, creating a price snapshot at the time of invoicing.

### Dependencies
- Task 36: Implement Invoice from Order

### Instructions

1. **Create copy_order_line_items method**
   - Add method `copy_order_line_items(order, invoice)` to InvoiceService
   - Accept Order and Invoice instances
   - Process all order line items

2. **Fetch order line items**
   - Query OrderLineItem.objects.filter(order=order)
   - Order by line_number or created_at
   - Include related product details

3. **Loop through order line items**
   - For each OrderLineItem, create InvoiceLineItem
   - Maintain same line_number sequence

4. **Copy product details**
   - Copy product reference (FK)
   - Copy product_name (snapshot)
   - Copy product_code/SKU (snapshot)
   - Copy description

5. **Copy pricing details**
   - Copy quantity from order line
   - Copy unit_price (price snapshot)
   - Calculate line_total = quantity × unit_price
   - Copy discount_percentage (if any)
   - Copy discount_amount (if any)

6. **Copy tax details**
   - Copy tax_rate from order line
   - Copy tax_type (VAT/SVAT)
   - Calculate tax_amount = (line_total - discount) × tax_rate
   - Copy is_tax_inclusive flag

7. **Link to invoice**
   - Set invoice FK to the new invoice
   - Set tenant from invoice
   - Set line_number sequentially

8. **Calculate net amount**
   - Calculate net_amount = line_total - discount_amount + tax_amount
   - Or if tax inclusive: extract tax from line_total
   - Store all calculated fields

9. **Save each line item**
   - Validate each InvoiceLineItem
   - Save to database
   - Track created line items

10. **Return summary**
    - Return count of line items created
    - Return total subtotal
    - Return total tax amount

### Price Snapshot Concept

The invoice captures prices at the time of invoicing, not current prices:

| Field | Source | Purpose |
|-------|--------|---------|
| product | FK | Link to product (can change) |
| product_name | Snapshot | Name at invoice time |
| product_code | Snapshot | SKU at invoice time |
| unit_price | Snapshot | Price at invoice time |
| tax_rate | Snapshot | Tax rate at invoice time |

### Line Item Mapping

| OrderLineItem Field | InvoiceLineItem Field |
|---------------------|----------------------|
| product | product |
| product_name | product_name |
| product_code | product_code |
| description | description |
| quantity | quantity |
| unit_price | unit_price |
| discount_percentage | discount_percentage |
| discount_amount | discount_amount |
| tax_rate | tax_rate |
| tax_type | tax_type |
| is_tax_inclusive | is_tax_inclusive |
| line_number | line_number |

### Expected Outcome
- All order line items copied to invoice line items
- Pricing snapshot captured
- Tax amounts calculated
- Line sequence preserved

### Verification Checklist
- [ ] Method `copy_order_line_items()` implemented
- [ ] All line items copied
- [ ] Price snapshot captured
- [ ] Tax calculations correct
- [ ] Line numbers sequential
- [ ] All amounts accurate

---

## Task 38: Implement Manual Invoice Creation

### Overview
Implement the method to manually create an invoice without linking to an order, for ad-hoc invoicing scenarios.

### Dependencies
- Task 35: Create InvoiceService Class

### Instructions

1. **Create create_invoice method**
   - Add method `create_invoice(data, items, user)` to InvoiceService
   - Accept invoice data dict, line items list, user
   - Return created Invoice instance

2. **Validate input data**
   - Call `_validate_invoice_data(data)`
   - Check customer is provided
   - Validate dates (issue_date, due_date)
   - Validate invoice type

3. **Create invoice instance**
   - Create Invoice with provided data
   - Set status to DRAFT
   - Generate invoice number
   - Set tenant from user context

4. **Set customer details**
   - Set customer FK from data
   - Copy billing_name, billing_email, billing_phone
   - Copy billing_address fields
   - Allow override if provided in data

5. **Set invoice metadata**
   - Set invoice_type (default: STANDARD)
   - Set issue_date (default: today)
   - Calculate due_date if not provided
   - Set notes if provided

6. **Set created_by**
   - Set created_by to user
   - Set created_at to now

7. **Save invoice**
   - Save invoice instance (without line items yet)
   - Get invoice ID

8. **Create line items**
   - Loop through items list
   - For each item dict, create InvoiceLineItem
   - Set product, quantity, unit_price
   - Calculate line_total, tax_amount
   - Set line_number sequentially
   - Save each line item

9. **Calculate totals**
   - Call `_calculate_totals(invoice)`
   - Update invoice with calculated amounts
   - Save invoice again

10. **Return invoice**
    - Return the created invoice instance

### Manual Invoice Data Structure

```python
data = {
    'customer_id': 'uuid',
    'invoice_type': 'STANDARD',  # or SVAT
    'issue_date': '2026-01-23',
    'due_date': '2026-02-22',  # optional
    'billing_name': 'Customer Name',  # optional override
    'billing_email': 'email@example.com',
    'billing_address_line1': 'Address',
    'notes': 'Invoice notes',
    'discount_percentage': 0,
    'discount_amount': 0
}

items = [
    {
        'product_id': 'uuid',  # optional
        'product_name': 'Service Name',
        'description': 'Service description',
        'quantity': 1,
        'unit_price': 5000.00,
        'tax_rate': 12.00,
        'tax_type': 'VAT',
        'discount_percentage': 0
    },
    # ... more items
]
```

### Manual vs Order-Based Invoice

| Feature | Manual Invoice | Order-Based Invoice |
|---------|----------------|---------------------|
| Order Link | None | related_order FK |
| Line Items | Manually entered | Copied from order |
| Customer | Must specify | Copied from order |
| Pricing | Current prices | Order prices (snapshot) |
| Use Case | Services, ad-hoc | Product sales |

### Expected Outcome
- Invoice created without order link
- Line items created from provided data
- All calculations performed
- Status set to DRAFT

### Verification Checklist
- [ ] Method `create_invoice()` implemented
- [ ] Data validation works
- [ ] Invoice number generated
- [ ] Line items created
- [ ] Totals calculated correctly
- [ ] No order linkage

---

## Task 39: Implement Invoice Duplication

### Overview
Implement the method to duplicate an existing invoice as a new draft invoice, useful for recurring invoices or templates.

### Dependencies
- Task 38: Implement Manual Invoice Creation

### Instructions

1. **Create duplicate_invoice method**
   - Add method `duplicate_invoice(invoice_id, user)` to InvoiceService
   - Accept invoice UUID and user
   - Return new Invoice instance

2. **Fetch source invoice**
   - Get Invoice by invoice_id
   - Check invoice exists
   - Fetch with related line items (prefetch)

3. **Create new invoice instance**
   - Copy all fields from source invoice
   - Set status to DRAFT
   - Generate new invoice_number
   - Clear invoice_date, payment_date
   - Set issue_date to today

4. **Reset financial fields**
   - Set amount_paid to 0
   - Set balance_due to total_amount
   - Clear payment_method
   - Clear payment_reference

5. **Clear linkages**
   - Clear related_order (make independent)
   - Clear order_reference
   - Don't copy credit_notes or debit_notes
   - Don't copy invoice history

6. **Copy customer details**
   - Copy all customer information
   - Copy all billing address fields
   - Copy contact details

7. **Set metadata**
   - Set created_by to user
   - Set created_at to now
   - Set updated_at to now
   - Clear sent_at, issued_at dates

8. **Save new invoice**
   - Save the new invoice instance
   - Get new invoice ID

9. **Duplicate line items**
   - Loop through source invoice line items
   - Create new InvoiceLineItem for each
   - Copy all fields (product, prices, taxes)
   - Link to new invoice
   - Save each line item

10. **Recalculate totals**
    - Call `_calculate_totals(new_invoice)`
    - Verify amounts match source
    - Save new invoice

11. **Add note to original**
    - Optionally add note: "Duplicated as {new_number}"

### Duplication Flow Diagram

```
┌──────────────────────┐
│ Source Invoice       │
│ INV-2026-00001       │
│ Status: ISSUED       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Copy Invoice Fields  │
│ - Customer details   │
│ - Billing address    │
│ - Line items         │
│ - Tax config         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Reset Fields         │
│ - New number         │
│ - Status: DRAFT      │
│ - Clear payments     │
│ - Clear linkages     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Save New Invoice     │
│ INV-2026-00099       │
│ Status: DRAFT        │
└──────────────────────┘
```

### Fields to Copy vs Reset

| Field Category | Action |
|---------------|---------|
| Customer details | ✓ Copy |
| Billing address | ✓ Copy |
| Line items | ✓ Copy |
| Totals | ✓ Copy (recalculate) |
| Invoice number | ✗ Generate new |
| Status | ✗ Set to DRAFT |
| Payments | ✗ Clear all |
| Dates | ✗ Reset to today |
| Order link | ✗ Clear |
| Notes | ✓ Copy (optional) |

### Expected Outcome
- New invoice created as DRAFT
- All line items duplicated
- Financial fields reset
- Independent of source invoice

### Verification Checklist
- [ ] Method `duplicate_invoice()` implemented
- [ ] Source invoice fetched correctly
- [ ] All fields copied appropriately
- [ ] New invoice number generated
- [ ] Line items duplicated
- [ ] Status set to DRAFT
- [ ] Totals match source

---

## Task 40: Implement Invoice Status Transitions

### Overview
Implement all invoice status transition methods (issue, send, mark_paid, cancel, void) with proper validation and business logic.

### Dependencies
- Task 35: Create InvoiceService Class

### Instructions

1. **Create issue() method**
   - Add method `issue(invoice_id, user)` to InvoiceService
   - Validate invoice is DRAFT status
   - Set status to ISSUED
   - Set issued_at to now
   - Set issued_by to user
   - Generate invoice number if not set
   - Calculate final totals
   - Save and log history

2. **Create send() method**
   - Add method `send(invoice_id, email, user)` to InvoiceService
   - Validate invoice is ISSUED or SENT status
   - Set status to SENT
   - Set sent_at to now
   - Set sent_to_email to email
   - Prepare email (call EmailService - Task 78)
   - Save and log history

3. **Create mark_paid() method**
   - Add method `mark_paid(invoice_id, payment_data, user)` to InvoiceService
   - Accept payment_data dict (amount, method, reference, date)
   - Validate invoice is ISSUED/SENT/OVERDUE/PARTIAL
   - Add amount to amount_paid
   - Recalculate balance_due
   - If balance_due = 0, set status to PAID
   - If balance_due > 0, set status to PARTIAL
   - Set payment_date, payment_method, payment_reference
   - Save and log history

4. **Create cancel() method**
   - Add method `cancel(invoice_id, reason, user)` to InvoiceService
   - Validate invoice is DRAFT or ISSUED (not paid/sent)
   - Set status to CANCELLED
   - Set cancelled_at to now
   - Set cancelled_by to user
   - Set cancellation_reason to reason
   - Save and log history

5. **Create void() method**
   - Add method `void(invoice_id, reason, user)` to InvoiceService
   - Validate invoice is ISSUED/SENT (can void sent invoices)
   - Set status to VOID
   - Set voided_at to now
   - Set voided_by to user
   - Set void_reason to reason
   - Don't affect accounting (use credit notes for that)
   - Save and log history

6. **Add transition validation**
   - Create `_can_transition(invoice, from_status, to_status)` method
   - Check if transition is allowed
   - Return boolean and error message if not allowed

7. **Add logging calls**
   - After each transition, log to InvoiceHistory (Task 46)
   - Include user, timestamp, old status, new status
   - Include action-specific metadata

### Status Transition Rules

| From Status | Allowed Transitions |
|------------|---------------------|
| DRAFT | → ISSUED, CANCELLED |
| ISSUED | → SENT, PAID, PARTIAL, CANCELLED, VOID |
| SENT | → PAID, PARTIAL, OVERDUE, VOID |
| PARTIAL | → PAID, OVERDUE |
| OVERDUE | → PAID, PARTIAL, VOID |
| PAID | None (final) |
| CANCELLED | None (final) |
| VOID | None (final) |

### Status Transition Diagram

```
         ┌─────┐
         │DRAFT│
         └──┬──┘
            │ issue()
            ▼
        ┌────────┐
        │ISSUED  │
        └───┬────┘
            │ send()
            ▼
        ┌────────┐         cancel()
        │ SENT   │◄─────────────┐
        └───┬────┘              │
            │                   │
            ├─ mark_paid() ─────┼─→ CANCELLED
            │                   │
            ├─→ PAID            │
            │                   │
            ├─→ PARTIAL ────────┤
            │                   │
            └─→ OVERDUE         │
                │               │
                └─ void() ──────┼─→ VOID
                                │
```

### Payment Data Structure

```python
payment_data = {
    'amount': 50000.00,  # Payment amount
    'payment_method': 'BANK_TRANSFER',  # or CASH, CARD, etc.
    'payment_reference': 'TXN123456',
    'payment_date': '2026-01-23',
    'notes': 'Payment received via bank transfer'
}
```

### Transition Method Signatures

```python
# Issue invoice
invoice = InvoiceService.issue(invoice_id='uuid', user=request.user)

# Send invoice
invoice = InvoiceService.send(
    invoice_id='uuid', 
    email='customer@example.com',
    user=request.user
)

# Mark paid
invoice = InvoiceService.mark_paid(
    invoice_id='uuid',
    payment_data={...},
    user=request.user
)

# Cancel invoice
invoice = InvoiceService.cancel(
    invoice_id='uuid',
    reason='Customer cancelled order',
    user=request.user
)

# Void invoice
invoice = InvoiceService.void(
    invoice_id='uuid',
    reason='Duplicate invoice created',
    user=request.user
)
```

### Expected Outcome
- All status transition methods implemented
- Proper validation for each transition
- History logging integrated
- Business logic enforced

### Verification Checklist
- [ ] `issue()` method implemented
- [ ] `send()` method implemented
- [ ] `mark_paid()` method implemented
- [ ] `cancel()` method implemented
- [ ] `void()` method implemented
- [ ] Transition validation works
- [ ] History logging integrated
- [ ] All status rules enforced

---

## Summary

This document covered the core InvoiceService methods for invoice generation and status management. Next, we'll add validation, overdue checking, aging calculations, and history tracking.

**Key Deliverables:**
- InvoiceService class with helper methods
- Order-to-invoice generation
- Line item copying with price snapshot
- Manual invoice creation
- Invoice duplication
- Complete status transition workflow

**Next Steps:**
- Proceed to [02_Tasks-41-46_Validation-Overdue-Aging-History.md](02_Tasks-41-46_Validation-Overdue-Aging-History.md)
