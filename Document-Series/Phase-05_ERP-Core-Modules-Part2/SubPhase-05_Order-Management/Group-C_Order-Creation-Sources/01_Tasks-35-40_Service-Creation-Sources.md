# Tasks 35-40: OrderService & Order Creation Sources

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** C - Order Creation & Sources  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-46_Stock-Reservation-Editing.md](02_Tasks-41-46_Stock-Reservation-Editing.md)
- **→ Next Group:** [../Group-D_Fulfillment-Workflow/](../Group-D_Fulfillment-Workflow/)

---

## Document Overview

This document covers the creation of the main OrderService class and implementation of multiple order creation sources. The service layer handles all business logic for order creation from various channels: manual entry, quote conversion, POS transactions, webstore orders, and bulk imports.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create OrderService Class | High | 30 min |
| 36 | Implement Manual Order Creation | Medium | 25 min |
| 37 | Implement Order from Quote Conversion | Medium | 30 min |
| 38 | Implement POS Order Creation | Medium | 25 min |
| 39 | Implement Webstore Order Creation | Medium | 30 min |
| 40 | Implement Bulk Order Import | High | 35 min |

---

## Task 35: Create OrderService Class

### Overview
Create the main OrderService class that encapsulates all business logic for order operations. This service acts as the central coordinator for order creation, modification, and workflow management.

### Dependencies
- Task 18: Order Model (from Group A)
- Task 25: OrderLineItem Model (from Group B)

### Instructions

1. **Create the service directory structure**
   - Navigate to `apps/orders/` directory
   - Create `services/` directory if not exists
   - Create `__init__.py` file in services directory
   - Create `order_service.py` file

2. **Import required dependencies**
   - Import Django transaction decorators
   - Import Order and OrderLineItem models
   - Import related models: Customer, Product, Quote, POSSession
   - Import inventory service for stock checks
   - Import exceptions for validation errors

3. **Define the OrderService class structure**
   - Create class named `OrderService`
   - Add docstring explaining service purpose
   - Initialize with no constructor parameters (all methods static)

4. **Add base validation method**
   - Create private method `_validate_order_data(data, items)`
   - Validate required fields: customer, items list not empty
   - Validate customer exists and is active
   - Validate each item: product exists, quantity > 0, price >= 0
   - Raise ValueError with descriptive messages for invalid data

5. **Add order number generation method**
   - Create private method `_generate_order_number(tenant)`
   - Format: `ORD-{YEAR}-{SEQUENCE}`
   - Query last order for tenant in current year
   - Extract sequence number and increment
   - Start from 00001 if first order of year
   - Return formatted order number

6. **Add line item creation helper**
   - Create private method `_create_line_items(order, items_data, user)`
   - Loop through items_data list
   - For each item: create OrderLineItem instance
   - Link to order, set product, quantity, unit_price
   - Calculate line_total: quantity * unit_price
   - Apply discount if provided
   - Calculate tax if product is taxable
   - Set created_by to user
   - Save each line item
   - Return list of created line items

7. **Add subtotal and total calculation method**
   - Create private method `_calculate_order_totals(order)`
   - Query all line items for order
   - Calculate subtotal: sum of all line_total values
   - Calculate total_tax: sum of all tax_amount values
   - Calculate discount_amount: sum of all discount_amount values
   - Calculate shipping_charges from order field
   - Calculate grand_total: subtotal + total_tax - discount_amount + shipping_charges
   - Update order with calculated values
   - Save order

8. **Add order history logging method**
   - Create private method `_log_order_event(order, event_type, notes, user)`
   - This will be expanded in Task 48
   - For now, add placeholder comment: "History logging implemented in Task 48"

9. **Add method stub placeholders**
   - Add method signatures for upcoming tasks
   - `create_order()` - Task 36
   - `create_from_quote()` - Task 37
   - `create_from_pos()` - Task 38
   - `create_from_webstore()` - Task 39
   - `import_orders()` - Task 40
   - Each with docstring and `pass` statement

10. **Export service in __init__.py**
    - Open `apps/orders/services/__init__.py`
    - Import OrderService from order_service module
    - Add to `__all__` list

### Validation Rules

| Field | Validation |
|-------|------------|
| customer | Must exist, must be active |
| items | List must not be empty |
| quantity | Must be > 0 |
| unit_price | Must be >= 0 |
| discount | Must be >= 0 and <= line_total |

### Order Number Format

```
ORD-2026-00001
ORD-2026-00002
...
ORD-2026-99999
ORD-2027-00001  (resets each year)
```

### Service Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           OrderService (Main Service)            │
├─────────────────────────────────────────────────┤
│                                                  │
│  Private Methods:                                │
│  - _validate_order_data()                        │
│  - _generate_order_number()                      │
│  - _create_line_items()                          │
│  - _calculate_order_totals()                     │
│  - _log_order_event()                            │
│                                                  │
│  Public Creation Methods:                        │
│  - create_order()          [Task 36]             │
│  - create_from_quote()     [Task 37]             │
│  - create_from_pos()       [Task 38]             │
│  - create_from_webstore()  [Task 39]             │
│  - import_orders()         [Task 40]             │
│                                                  │
│  Modification Methods:                           │
│  - duplicate_order()       [Task 44]             │
│  - edit_order()            [Task 45]             │
│  - confirm_order()         [Task 57]             │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Expected Outcomes
- OrderService class created with base structure
- Validation methods implemented
- Order number generation working
- Line item creation helper functional
- Total calculation logic implemented
- Service exported and importable

---

## Task 36: Implement Manual Order Creation

### Overview
Implement the create_order() method for manual order creation by staff users. This is the primary method for creating orders through the ERP interface.

### Dependencies
- Task 35: OrderService Class

### Instructions

1. **Define the create_order method signature**
   - Create public method `create_order(data, items_data, user, auto_confirm=False)`
   - Add type hints: data (dict), items_data (list), user (User), auto_confirm (bool)
   - Add docstring explaining parameters and return value
   - Decorate with `@transaction.atomic`

2. **Validate input data**
   - Call `_validate_order_data(data, items_data)`
   - Catch and re-raise validation errors with context

3. **Extract order data from input**
   - Extract customer from data dict
   - Extract optional fields: notes, shipping_address, billing_address
   - Extract shipping_charges (default to 0)
   - Extract discount_amount (default to 0)
   - Extract payment_terms
   - Extract priority (default to MEDIUM)

4. **Generate order number**
   - Get tenant from request context or customer
   - Call `_generate_order_number(tenant)`
   - Store result in order_number variable

5. **Create order instance**
   - Instantiate Order model with extracted data
   - Set order_number from previous step
   - Set source to ORDER_SOURCE_MANUAL
   - Set status to ORDER_STATUS_PENDING
   - Set created_by to user parameter
   - Set customer relationship
   - Set addresses if provided
   - Don't save yet

6. **Create line items**
   - Call `_create_line_items(order, items_data, user)`
   - This creates line items after order is saved
   - Actually, save order first before creating line items

7. **Save order**
   - Call order.save()
   - This generates the order ID needed for line items

8. **Create line items (after save)**
   - Now call `_create_line_items(order, items_data, user)`
   - Line items can now reference order.id

9. **Calculate totals**
   - Call `_calculate_order_totals(order)`
   - Updates order with calculated values

10. **Auto-confirm if requested**
    - Check if auto_confirm parameter is True
    - If yes, call confirm_order() method (Task 57 - add comment for now)
    - Add comment: "Auto-confirmation implemented in Task 57"

11. **Log order creation event**
    - Call `_log_order_event(order, 'CREATED', 'Order created manually', user)`

12. **Refresh and return order**
    - Call order.refresh_from_db()
    - This loads the updated totals
    - Return order instance

### Input Data Structure

```python
data = {
    'customer': customer_instance or customer_id,
    'notes': 'Special handling required',
    'shipping_address': address_dict,
    'billing_address': address_dict,
    'shipping_charges': Decimal('500.00'),
    'discount_amount': Decimal('0.00'),
    'payment_terms': 'NET_30',
    'priority': 'HIGH'
}

items_data = [
    {
        'product': product_instance or product_id,
        'quantity': 5,
        'unit_price': Decimal('1000.00'),
        'discount_percent': Decimal('5.0'),
        'notes': 'Gift wrap requested'
    },
    # ... more items
]
```

### Manual Order Creation Flow

```
User Input
    │
    ▼
Validate Data
    │
    ▼
Generate Order Number
    │
    ▼
Create Order (PENDING status)
    │
    ▼
Create Line Items
    │
    ▼
Calculate Totals
    │
    ▼
Auto-Confirm? ─── Yes ──→ Confirm Order [Task 57]
    │
    No
    ▼
Log Event (CREATED)
    │
    ▼
Return Order
```

### Error Handling

| Error Type | Handling |
|------------|----------|
| Customer not found | Raise ValueError with customer ID |
| Invalid product | Raise ValueError with product SKU |
| Negative quantity | Raise ValueError with item details |
| Negative price | Raise ValueError with item details |
| Database error | Rollback transaction, raise |

### Expected Outcomes
- create_order() method fully functional
- Manual orders created successfully
- All validation applied
- Line items created and totals calculated
- Order returned in PENDING status

---

## Task 37: Implement Order from Quote Conversion

### Overview
Implement the create_from_quote() method to convert accepted sales quotes into orders. This maintains a link between quote and order for traceability.

### Dependencies
- Task 36: Manual Order Creation
- Quote module (assumed to exist)

### Instructions

1. **Define the create_from_quote method signature**
   - Create public method `create_from_quote(quote_id, user, auto_confirm=False)`
   - Add type hints: quote_id (UUID or str), user (User), auto_confirm (bool)
   - Add docstring explaining quote to order conversion
   - Decorate with `@transaction.atomic`

2. **Fetch and validate quote**
   - Import Quote model from quotes app
   - Query Quote by quote_id
   - Raise ValueError if quote not found: "Quote not found"
   - Check quote status is ACCEPTED
   - Raise ValueError if not accepted: "Quote must be accepted before conversion"
   - Check quote is not already converted
   - Check quote.converted_to_order_at is None
   - Raise ValueError if already converted: "Quote already converted to order"

3. **Extract order data from quote**
   - Create data dict with quote information:
     - customer: quote.customer
     - notes: f"Converted from Quote {quote.quote_number}"
     - shipping_address: quote.shipping_address
     - billing_address: quote.billing_address
     - shipping_charges: quote.shipping_charges
     - discount_amount: quote.discount_amount
     - payment_terms: quote.payment_terms
     - priority: quote.priority if exists, else MEDIUM

4. **Extract line items from quote**
   - Query QuoteLineItem for the quote
   - Create items_data list
   - For each quote line item, create dict:
     - product: line_item.product
     - quantity: line_item.quantity
     - unit_price: line_item.unit_price
     - discount_percent: line_item.discount_percent
     - notes: line_item.notes

5. **Create order using existing method**
   - Call `create_order(data, items_data, user, auto_confirm)`
   - This reuses all validation and creation logic

6. **Link order to quote**
   - Set order.converted_from_quote to quote instance
   - Set order.external_reference to quote.quote_number
   - Save order

7. **Update quote status**
   - Set quote.converted_to_order_at to current timestamp
   - Set quote.converted_order to order instance
   - Set quote.status to CONVERTED
   - Save quote

8. **Log conversion event**
   - Call `_log_order_event(order, 'CREATED', f'Converted from Quote {quote.quote_number}', user)`

9. **Return created order**
   - Return order instance with quote linkage

### Quote to Order Conversion Flow

```
Quote (ACCEPTED)
    │
    ▼
Validate Quote Status
    │
    ▼
Check Not Already Converted
    │
    ▼
Extract Quote Data
    │
    ▼
Extract Quote Line Items
    │
    ▼
Create Order (reuse create_order)
    │
    ▼
Link Order ↔ Quote
    │
    ▼
Update Quote Status (CONVERTED)
    │
    ▼
Log Conversion Event
    │
    ▼
Return Order
```

### Quote Validation Rules

| Validation | Error Message |
|------------|---------------|
| Quote not found | "Quote {quote_id} not found" |
| Quote not accepted | "Quote must be accepted before conversion to order" |
| Already converted | "Quote {quote_number} already converted to order {order_number}" |
| Quote expired | "Quote {quote_number} has expired" |

### Data Mapping

```
Quote Field              →  Order Field
─────────────────────────────────────────────────────
quote_number            →  external_reference
customer                →  customer
quote_date              →  (reference only)
valid_until             →  (check for expiry)
shipping_address        →  shipping_address
billing_address         →  billing_address
shipping_charges        →  shipping_charges
discount_amount         →  discount_amount
payment_terms           →  payment_terms
notes                   →  notes (append conversion info)
line_items              →  line_items (copy all fields)
```

### Expected Outcomes
- create_from_quote() method functional
- Quotes converted to orders successfully
- Quote-Order linkage maintained
- Quote status updated to CONVERTED
- Order contains all quote data and line items

---

## Task 38: Implement POS Order Creation

### Overview
Implement the create_from_pos() method to create orders from Point of Sale transactions. POS orders are typically auto-confirmed and paid at creation.

### Dependencies
- Task 36: Manual Order Creation
- POS module (assumed to exist)

### Instructions

1. **Define the create_from_pos method signature**
   - Create public method `create_from_pos(session_id, cart_data, payment_data, user)`
   - Add type hints: session_id (UUID), cart_data (dict), payment_data (dict), user (User)
   - Add docstring explaining POS order creation
   - Decorate with `@transaction.atomic`

2. **Fetch and validate POS session**
   - Import POSSession model from pos app
   - Query POSSession by session_id
   - Raise ValueError if session not found
   - Check session status is OPEN
   - Raise ValueError if session not open: "POS session must be open"
   - Extract till and location information

3. **Extract customer from cart**
   - Get customer from cart_data
   - If customer is None or not provided, use walk-in customer
   - Query or create walk-in customer for tenant
   - Customer name: "Walk-in Customer"
   - Set is_walk_in flag to True

4. **Extract order data**
   - Create data dict:
     - customer: extracted customer
     - notes: f"POS Order - Till: {till.name}, Session: {session.session_number}"
     - shipping_address: None (in-store pickup)
     - billing_address: customer.default_address if exists
     - shipping_charges: Decimal('0.00') (no shipping)
     - discount_amount: cart_data.get('discount_amount', Decimal('0.00'))
     - payment_terms: 'IMMEDIATE'
     - priority: 'HIGH' (POS orders priority)

5. **Extract line items from cart**
   - Get items list from cart_data
   - Create items_data list
   - For each cart item, create dict:
     - product: item['product']
     - quantity: item['quantity']
     - unit_price: item['price'] (current POS price)
     - discount_percent: item.get('discount_percent', Decimal('0.00'))
     - notes: item.get('notes', '')

6. **Create order with auto-confirm**
   - Call `create_order(data, items_data, user, auto_confirm=True)`
   - POS orders should always auto-confirm
   - This reserves stock immediately

7. **Set POS-specific fields**
   - Set order.source to ORDER_SOURCE_POS
   - Set order.pos_session to session instance
   - Set order.location to session.location
   - Set order.external_reference to session.session_number
   - Save order

8. **Record payment**
   - Import PaymentTransaction model
   - Create PaymentTransaction instance:
     - order: order instance
     - amount: order.grand_total
     - payment_method: payment_data['method']
     - payment_status: PAYMENT_STATUS_COMPLETED
     - transaction_reference: payment_data.get('reference')
     - paid_at: current timestamp
   - Save payment transaction
   - Update order.payment_status to PAID
   - Save order

9. **Update POS session totals**
   - Add order.grand_total to session.total_sales
   - Increment session.transaction_count
   - Save session

10. **Log POS order event**
    - Call `_log_order_event(order, 'CREATED', f'POS Order - Session {session.session_number}', user)`

11. **Return order with payment**
    - Refresh order from database
    - Return order instance

### POS Order Creation Flow

```
POS Transaction
    │
    ▼
Validate Session (OPEN)
    │
    ▼
Identify Customer (or Walk-in)
    │
    ▼
Extract Cart Items
    │
    ▼
Create Order (auto_confirm=True)
    │
    ▼
Reserve Stock [Task 41]
    │
    ▼
Record Payment (PAID)
    │
    ▼
Update Session Totals
    │
    ▼
Return Order (CONFIRMED + PAID)
```

### Cart Data Structure

```python
cart_data = {
    'customer': customer_id or None,  # None = walk-in
    'discount_amount': Decimal('100.00'),
    'items': [
        {
            'product': product_id,
            'quantity': 2,
            'price': Decimal('500.00'),  # Current POS price
            'discount_percent': Decimal('5.0'),
            'notes': ''
        },
        # ... more items
    ]
}

payment_data = {
    'method': 'CASH',  # or CARD, MOBILE, etc.
    'amount': Decimal('1000.00'),
    'reference': 'CASH-20260123-001'
}
```

### POS Order Characteristics

| Characteristic | Value |
|----------------|-------|
| Source | ORDER_SOURCE_POS |
| Auto-Confirm | Always True |
| Payment Status | PAID at creation |
| Shipping | None (in-store) |
| Payment Terms | IMMEDIATE |
| Priority | HIGH |

### Walk-in Customer Handling

```
Cart has no customer
    │
    ▼
Query: Walk-in Customer for tenant
    │
    ├─ Found ──→ Use existing
    │
    └─ Not Found ──→ Create walk-in customer
                         │
                         └─ name: "Walk-in Customer"
                            email: "walkin@{tenant.domain}"
                            is_walk_in: True
```

### Expected Outcomes
- create_from_pos() method functional
- POS orders created and confirmed instantly
- Payment recorded at order creation
- Stock reserved immediately
- Session totals updated
- Order linked to POS session

---

## Task 39: Implement Webstore Order Creation

### Overview
Implement the create_from_webstore() method to handle e-commerce orders from the online store. Webstore orders include customer validation, shipping calculations, and optional auto-confirmation.

### Dependencies
- Task 36: Manual Order Creation
- Webstore/Cart module (assumed to exist)

### Instructions

1. **Define the create_from_webstore method signature**
   - Create public method `create_from_webstore(cart_id, customer_id, shipping_data, user=None)`
   - Add type hints: cart_id (UUID), customer_id (UUID), shipping_data (dict), user (User or None)
   - Add docstring explaining webstore order creation
   - Decorate with `@transaction.atomic`

2. **Fetch and validate cart**
   - Import Cart and CartItem models from webstore app
   - Query Cart by cart_id
   - Raise ValueError if cart not found: "Cart not found"
   - Check cart status is ACTIVE
   - Check cart is not empty
   - Query CartItem for cart, check count > 0
   - Raise ValueError if empty: "Cart is empty"

3. **Fetch and validate customer**
   - Query Customer by customer_id
   - Raise ValueError if customer not found
   - Check customer is active
   - Raise ValueError if not active: "Customer account is inactive"
   - Verify customer email is verified
   - Raise ValueError if not verified: "Email must be verified to place order"

4. **Validate product availability**
   - Loop through cart items
   - For each item, check product is active
   - Check product is_available flag is True
   - Raise ValueError if product unavailable: "Product {name} is no longer available"
   - Check stock availability (if stock tracking enabled)
   - Add warning if low stock but continue

5. **Calculate shipping charges**
   - Import shipping service or calculator
   - Extract shipping method from shipping_data
   - Extract shipping address from shipping_data
   - Calculate shipping cost based on:
     - Cart weight/dimensions
     - Shipping method (standard, express, etc.)
     - Destination address
   - Store in shipping_charges variable

6. **Extract order data**
   - Create data dict:
     - customer: customer instance
     - notes: cart.notes or ''
     - shipping_address: shipping_data['address']
     - billing_address: customer.default_billing_address
     - shipping_charges: calculated shipping_charges
     - discount_amount: cart.discount_amount (from coupons)
     - payment_terms: 'PREPAID' or 'COD' from shipping_data
     - priority: 'MEDIUM'

7. **Extract line items from cart**
   - Query CartItem for cart
   - Create items_data list
   - For each cart item, create dict:
     - product: item.product
     - quantity: item.quantity
     - unit_price: item.unit_price (webstore price at time of add)
     - discount_percent: item.discount_percent (from coupon)
     - notes: item.notes or ''

8. **Determine auto-confirmation**
   - Query OrderSettings for tenant
   - Get auto_confirm_webstore setting (default False)
   - Set auto_confirm variable based on setting
   - Override if payment is COD (don't auto-confirm)

9. **Create order**
   - Call `create_order(data, items_data, user or system_user, auto_confirm)`
   - System user if no user provided (public webstore)

10. **Set webstore-specific fields**
    - Set order.source to ORDER_SOURCE_WEBSTORE
    - Set order.external_reference to cart.cart_number
    - Set order.webstore_cart to cart instance
    - Save order

11. **Mark cart as converted**
    - Set cart.status to CONVERTED
    - Set cart.converted_to_order to order
    - Set cart.converted_at to current timestamp
    - Save cart

12. **Send order confirmation email**
    - Add comment: "Email notification implemented in Task 65"
    - Placeholder for sending confirmation email to customer

13. **Log webstore order event**
    - Call `_log_order_event(order, 'CREATED', f'Webstore Order - Cart {cart.cart_number}', user or system_user)`

14. **Return order**
    - Refresh order from database
    - Return order instance

### Webstore Order Creation Flow

```
Customer Checkout
    │
    ▼
Validate Cart (Active, Not Empty)
    │
    ▼
Validate Customer (Active, Email Verified)
    │
    ▼
Validate Product Availability
    │
    ▼
Calculate Shipping Charges
    │
    ▼
Apply Discount Coupons
    │
    ▼
Create Order (auto_confirm based on settings)
    │
    ▼
Mark Cart as Converted
    │
    ▼
Send Confirmation Email [Task 65]
    │
    ▼
Return Order
```

### Shipping Data Structure

```python
shipping_data = {
    'method': 'STANDARD',  # or EXPRESS, OVERNIGHT
    'address': {
        'line1': '123 Main Street',
        'line2': 'Apt 4B',
        'city': 'Colombo',
        'province': 'Western Province',
        'postal_code': '00100',
        'country': 'LK'
    },
    'payment_terms': 'PREPAID',  # or COD
    'delivery_instructions': 'Ring doorbell twice'
}
```

### Webstore Validation Checklist

| Validation | Error Message |
|------------|---------------|
| Cart not found | "Cart {cart_id} not found" |
| Cart empty | "Cannot create order from empty cart" |
| Customer inactive | "Customer account is not active" |
| Email not verified | "Email address must be verified to place order" |
| Product unavailable | "Product {name} is no longer available" |
| Insufficient stock | "Insufficient stock for {name}" (warning, not error) |

### Shipping Method Mapping

```
Shipping Method    Cost Calculation
─────────────────────────────────────────
STANDARD          Base rate + weight
EXPRESS           Base rate × 1.5 + weight × 1.5
OVERNIGHT         Base rate × 2.5 + weight × 2
INTERNATIONAL     Base rate + weight + customs
FREE              LKR 0 (if order > threshold)
```

### Auto-Confirmation Logic

```
OrderSettings.auto_confirm_webstore
    │
    ├─ True AND Payment = PREPAID ──→ Auto-Confirm
    │
    ├─ True AND Payment = COD ──→ Manual Confirm
    │
    └─ False ──→ Manual Confirm (default)
```

### Expected Outcomes
- create_from_webstore() method functional
- Webstore orders created with validation
- Shipping charges calculated correctly
- Cart marked as converted
- Order linked to cart
- Auto-confirmation based on settings

---

## Task 40: Implement Bulk Order Import

### Overview
Implement the import_orders() method to import multiple orders from CSV or Excel files. This is useful for migrating from other systems or importing bulk orders from partners.

### Dependencies
- Task 36: Manual Order Creation
- pandas library for file parsing

### Instructions

1. **Install pandas dependency**
   - Add pandas to requirements.txt
   - Add openpyxl for Excel support

2. **Create import service module**
   - Create `apps/orders/services/import_service.py`
   - This separates import logic from main OrderService

3. **Define the import_orders method signature**
   - In OrderService, create public method `import_orders(file, user, source='IMPORT')`
   - Add type hints: file (UploadedFile), user (User), source (str)
   - Add docstring explaining bulk import
   - This method delegates to ImportService

4. **Create ImportService class**
   - In import_service.py, create class `ImportService`
   - Add docstring explaining import functionality

5. **Add file validation method**
   - Create method `validate_file(file)`
   - Check file extension: .csv, .xlsx, .xls
   - Raise ValueError if unsupported format
   - Check file size < 10MB
   - Raise ValueError if too large
   - Return file type (CSV or EXCEL)

6. **Add file parsing method**
   - Create method `parse_file(file, file_type)`
   - If CSV: use pandas.read_csv()
   - If Excel: use pandas.read_excel()
   - Return pandas DataFrame

7. **Add column validation method**
   - Create method `validate_columns(df)`
   - Required columns:
     - customer_id or customer_email
     - product_sku
     - quantity
     - unit_price
   - Optional columns:
     - order_number (external)
     - shipping_address
     - billing_address
     - notes
     - discount_percent
   - Raise ValueError if required columns missing
   - Return validated DataFrame

8. **Add row validation method**
   - Create method `validate_row(row, row_number)`
   - Validate customer exists
   - Validate product exists by SKU
   - Validate quantity is positive integer
   - Validate unit_price is positive decimal
   - Collect validation errors
   - Return tuple: (is_valid, errors_list)

9. **Add order grouping method**
   - Create method `group_orders(df)`
   - Group rows by order_number (if provided)
   - If no order_number, each row is separate order
   - Return list of order groups
   - Each group has: customer, items list

10. **Add import execution method**
    - Create method `execute_import(file, user)`
    - Call validate_file()
    - Call parse_file()
    - Call validate_columns()
    - Initialize results dict: {success: [], failed: [], errors: []}
    - Loop through rows with validation
    - Call validate_row() for each
    - Group validated rows by order
    - For each order group:
      - Try to create order using OrderService.create_order()
      - Add to success list if successful
      - Add to failed list with error if failed
    - Return results dict

11. **Add import from OrderService**
    - In OrderService, implement import_orders()
    - Create ImportService instance
    - Call execute_import()
    - Log import event with results summary
    - Return results dict

12. **Add import results logging**
    - Create ImportLog model (if not exists)
    - Fields: file_name, uploaded_by, total_rows, success_count, failed_count, errors
    - Save import log for each import operation
    - Link successful orders to import log

### CSV Format Specification

```csv
customer_email,product_sku,quantity,unit_price,discount_percent,notes
john@example.com,SKU-001,5,1000.00,0.00,Rush order
john@example.com,SKU-002,2,500.00,10.00,
jane@example.com,SKU-003,10,200.00,5.00,Bulk order
```

### Excel Format Specification

```
Column A: customer_email
Column B: product_sku
Column C: quantity
Column D: unit_price
Column E: discount_percent
Column F: notes
Column G: order_number (optional - groups items)
```

### Import Flow Diagram

```
Upload File
    │
    ▼
Validate File Type & Size
    │
    ▼
Parse File (CSV/Excel → DataFrame)
    │
    ▼
Validate Required Columns
    │
    ▼
Validate Each Row
    │
    ├─ Invalid ──→ Add to Failed List
    │
    └─ Valid ──→ Continue
                    │
                    ▼
            Group by Order Number
                    │
                    ▼
            Create Orders (loop)
                    │
                    ├─ Success ──→ Add to Success List
                    │
                    └─ Error ──→ Add to Failed List
                                      │
                                      ▼
                              Return Results Summary
```

### Validation Rules for Import

| Field | Validation |
|-------|------------|
| customer_email | Must exist in system |
| product_sku | Must exist and be active |
| quantity | Positive integer |
| unit_price | Positive decimal |
| discount_percent | 0-100 |
| order_number | Optional, groups items |

### Import Results Structure

```python
results = {
    'success': [
        {
            'order': order_instance,
            'order_number': 'ORD-2026-00123',
            'row_numbers': [1, 2, 3]  # Rows that formed this order
        },
        # ... more successful orders
    ],
    'failed': [
        {
            'row_number': 5,
            'errors': ['Customer not found: invalid@example.com'],
            'data': {'customer_email': 'invalid@example.com', ...}
        },
        # ... more failed rows
    ],
    'summary': {
        'total_rows': 100,
        'successful_orders': 35,
        'failed_rows': 5,
        'total_items_imported': 95
    }
}
```

### Error Handling Strategy

```
Row Level Errors:
- Customer not found ──→ Skip row, continue
- Product not found ──→ Skip row, continue
- Invalid quantity ──→ Skip row, continue
- Invalid price ──→ Skip row, continue

File Level Errors:
- Invalid format ──→ Abort import
- Missing columns ──→ Abort import
- File too large ──→ Abort import
- Parsing error ──→ Abort import
```

### Import Log Model

```
ImportLog Model:
─────────────────────────────────────────
- id: UUID
- file_name: CharField
- file_size: IntegerField (bytes)
- uploaded_by: FK to User
- uploaded_at: DateTimeField
- status: PROCESSING, COMPLETED, FAILED
- total_rows: IntegerField
- successful_orders: IntegerField
- failed_rows: IntegerField
- error_summary: JSONField
- completed_at: DateTimeField
```

### Expected Outcomes
- import_orders() method functional
- CSV and Excel files parsed correctly
- Row-level validation implemented
- Orders created from import data
- Import results returned with success/failure details
- Import logs maintained for audit

---

## Cross-Task Integration

### Service Method Dependencies

```
_validate_order_data()
    ↓
Used by: create_order(), create_from_quote(), 
         create_from_pos(), create_from_webstore()

_generate_order_number()
    ↓
Used by: create_order() (all sources)

_create_line_items()
    ↓
Used by: create_order() (all sources)

_calculate_order_totals()
    ↓
Used by: create_order() (all sources)
```

### Order Source Comparison

| Feature | Manual | Quote | POS | Webstore | Import |
|---------|--------|-------|-----|----------|--------|
| Auto-Confirm | Optional | Optional | Always | Optional | No |
| Payment | Later | Later | Immediate | Prepaid/COD | Later |
| Stock Reserve | On Confirm | On Confirm | Immediate | On Confirm | On Confirm |
| Shipping | Yes | Yes | No | Yes | Yes |
| Customer | Required | From Quote | Optional | Required | Required |
| Priority | Variable | From Quote | HIGH | MEDIUM | Variable |

### Common Validation Points

All creation methods validate:
1. Customer exists and is active
2. Products exist and are available
3. Quantities are positive
4. Prices are valid
5. Required fields present
6. Business rules (credit limits, etc.)

---

## Testing Checklist

### Task 35: OrderService Class
- [ ] Service class instantiates correctly
- [ ] Validation method catches invalid data
- [ ] Order number generation works
- [ ] Order numbers increment correctly
- [ ] Line item creation works
- [ ] Total calculation is accurate

### Task 36: Manual Order Creation
- [ ] Manual order creates successfully
- [ ] Validation errors raised correctly
- [ ] Line items created with order
- [ ] Totals calculated correctly
- [ ] Order status is PENDING
- [ ] Source is set to MANUAL

### Task 37: Quote Conversion
- [ ] Quote converts to order
- [ ] Quote-Order linkage maintained
- [ ] Quote status updates to CONVERTED
- [ ] Line items copied correctly
- [ ] Cannot convert same quote twice
- [ ] Cannot convert non-accepted quote

### Task 38: POS Order Creation
- [ ] POS order creates and confirms
- [ ] Payment recorded immediately
- [ ] Session totals updated
- [ ] Walk-in customer handled
- [ ] Stock reserved immediately
- [ ] Source is set to POS

### Task 39: Webstore Order Creation
- [ ] Webstore order creates from cart
- [ ] Cart validation works
- [ ] Customer validation works
- [ ] Shipping charges calculated
- [ ] Cart marked as converted
- [ ] Auto-confirm works per settings

### Task 40: Bulk Import
- [ ] CSV files parsed correctly
- [ ] Excel files parsed correctly
- [ ] Column validation works
- [ ] Row validation works
- [ ] Orders created from import
- [ ] Import results returned correctly
- [ ] Failed rows reported with errors

---

## Summary

This document established the OrderService foundation and implemented all order creation sources:

**Completed:**
- ✅ OrderService class with validation and helpers
- ✅ Manual order creation for ERP users
- ✅ Quote to order conversion
- ✅ POS order creation with immediate payment
- ✅ Webstore order creation with shipping
- ✅ Bulk order import from CSV/Excel

**Key Achievements:**
- Single service handles all order sources
- Consistent validation across all sources
- Source-specific logic encapsulated
- Order number generation standardized
- Line item creation standardized
- Total calculation centralized

**Next Steps:**
- Proceed to [02_Tasks-41-46_Stock-Reservation-Editing.md](02_Tasks-41-46_Stock-Reservation-Editing.md) for stock reservation and order editing
- Implement stock reservation logic for confirmed orders
- Add order duplication and editing capabilities
