# Tasks 75-80: POS API Serializers

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** E - POS API & Frontend Integration  
> **Document:** 01 of 03  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-81-84_ViewSets-Search.md](02_Tasks-81-84_ViewSets-Search.md)
- **← Previous Group:** [../Group-D_Payment-Processing/](../Group-D_Payment-Processing/)

---

## Document Overview

This document covers the creation of Django REST Framework serializers for the POS system. These serializers handle data validation, transformation, and representation for API requests and responses. Each serializer is designed to provide the appropriate level of detail for frontend consumption while maintaining security and performance.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Create POSTerminalSerializer | Medium | 25 min |
| 76 | Create POSSessionSerializer | Medium | 25 min |
| 77 | Create POSCartSerializer | High | 30 min |
| 78 | Create CartItemSerializer | Medium | 25 min |
| 79 | Create ProductSearchSerializer | Medium | 25 min |
| 80 | Create POSPaymentSerializer | Medium | 20 min |

---

## API Serializer Architecture

### Serializer Hierarchy

```
┌─────────────────────────────────────────────────────┐
│            POS API Serializers                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐    ┌─────────────────────┐  │
│  │ POSTerminalSerializer│────▶│POSSessionSerializer│ │
│  │  - id, code       │    │ (nested)            │  │
│  │  - name, location │    │  - current_session  │  │
│  │  - status         │    └─────────────────────┘  │
│  │  - current_session│                             │
│  └──────────────────┘                              │
│                                                     │
│  ┌──────────────────┐    ┌─────────────────────┐  │
│  │ POSCartSerializer│────▶│ CartItemSerializer  │  │
│  │  - items[]       │    │ (nested)            │  │
│  │  - totals        │    │  - product_details  │  │
│  │  - customer      │    │  - pricing          │  │
│  └──────────────────┘    └─────────────────────┘  │
│                                                     │
│  ┌──────────────────┐                              │
│  │ProductSearchSerializer                          │
│  │  - product info  │                              │
│  │  - current price │                              │
│  │  - stock level   │                              │
│  └──────────────────┘                              │
│                                                     │
│  ┌──────────────────┐                              │
│  │POSPaymentSerializer                             │
│  │  - payment method│                              │
│  │  - amount        │                              │
│  │  - status        │                              │
│  └──────────────────┘                              │
└─────────────────────────────────────────────────────┘
```

### Serializer Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Read/Write Separation** | Different fields for input vs output |
| **Nested Serializers** | Use depth for related objects |
| **Computed Fields** | SerializerMethodField for calculations |
| **Validation** | Field-level and object-level validators |
| **Security** | Write-only sensitive fields |
| **Performance** | Select_related and prefetch_related hints |

---

## Task 75: Create POSTerminalSerializer

### Overview
Create a serializer for POSTerminal model that includes terminal configuration and current session information for the POS frontend.

### Dependencies
- POSTerminal model (Group A, Task 01)
- POSSession model (Group A, Task 02)

### Instructions

#### 1. Create Terminal Serializer File Structure

1. **Navigate to terminal app**
   - Location: `apps/pos/terminal/`
   - Create `serializers.py` if it doesn't exist

2. **Add required imports**
   - Import ModelSerializer from rest_framework.serializers
   - Import serializers module for field definitions
   - Import POSTerminal model
   - Import POSSession model
   - Import timezone utilities
   - Import User model (for operator details)

#### 2. Create Simple Session Serializer (Nested)

1. **Define SimpleSessionSerializer class**
   - Use for nested representation only
   - Include essential session fields only
   - Purpose: Show current session without full details

2. **Define serializer fields**
   - `id` (UUID, read-only)
   - `session_number` (CharField, read-only)
   - `status` (CharField, read-only)
   - `opened_at` (DateTimeField, read-only)
   - `operator` (nested User serializer with id, username, full_name)
   - `opening_cash` (DecimalField, read-only)

3. **Add Meta configuration**
   - Set model to POSSession
   - Set read_only_fields for all fields
   - Set fields list

#### 3. Create POSTerminalSerializer

1. **Define POSTerminalSerializer class**
   - Inherit from ModelSerializer
   - Use for API list and detail views

2. **Define base fields**
   - `id` (UUID, read-only)
   - `terminal_code` (CharField, read-only)
   - `terminal_name` (CharField)
   - `location` (CharField)
   - `status` (ChoiceField)
   - `is_active` (BooleanField)

3. **Add computed fields**
   - `current_session` (SerializerMethodField)
   - `has_open_session` (SerializerMethodField)
   - `can_open_session` (SerializerMethodField)
   - `last_activity` (SerializerMethodField)

4. **Implement get_current_session method**
   - Check if terminal has an active session
   - Query for OPEN status session
   - Return serialized session using SimpleSessionSerializer
   - Return None if no open session

5. **Implement get_has_open_session method**
   - Return boolean indicating if terminal has open session
   - Use exists() query for performance

6. **Implement get_can_open_session method**
   - Check if terminal is ACTIVE
   - Check if terminal is enabled (is_active=True)
   - Check if no current open session exists
   - Return boolean result

7. **Implement get_last_activity method**
   - Get the most recent transaction timestamp
   - Can be from last cart completion or payment
   - Return None if no recent activity
   - Format as ISO 8601 string

#### 4. Add Validation

1. **Create validate_status method**
   - Ensure status transitions are valid
   - ACTIVE can change to MAINTENANCE or INACTIVE
   - INACTIVE can only change to ACTIVE (not MAINTENANCE)
   - MAINTENANCE can change to ACTIVE or INACTIVE

2. **Create validate method (object-level)**
   - If changing status from ACTIVE to INACTIVE/MAINTENANCE
   - Ensure no open session exists
   - Raise ValidationError if open session found

3. **Add terminal_name validation**
   - Ensure name is not empty or just whitespace
   - Maximum length validation

#### 5. Configure Meta Class

1. **Set Meta attributes**
   - `model = POSTerminal`
   - `fields` - all relevant fields
   - `read_only_fields` - id, terminal_code, created_at, updated_at
   - `extra_kwargs` for field behaviors

2. **Define extra_kwargs**
   - `terminal_name`: required=True
   - `location`: allow_blank=True
   - `status`: default='ACTIVE'

### POSTerminalSerializer Response Structure

```json
{
    "id": "uuid-string",
    "terminal_code": "POS-T01",
    "terminal_name": "Main Counter Terminal",
    "location": "Ground Floor - Counter 1",
    "status": "ACTIVE",
    "is_active": true,
    "current_session": {
        "id": "session-uuid",
        "session_number": "S-20260123-0001",
        "status": "OPEN",
        "opened_at": "2026-01-23T09:00:00Z",
        "operator": {
            "id": "user-uuid",
            "username": "cashier01",
            "full_name": "John Doe"
        },
        "opening_cash": "10000.00"
    },
    "has_open_session": true,
    "can_open_session": false,
    "last_activity": "2026-01-23T14:30:15Z",
    "created_at": "2026-01-20T08:00:00Z",
    "updated_at": "2026-01-23T09:00:00Z"
}
```

### Validation Rules

| Field | Validation |
|-------|------------|
| **terminal_name** | Required, not blank, max 100 chars |
| **status** | Must be valid choice (ACTIVE/INACTIVE/MAINTENANCE) |
| **status transition** | Must follow allowed transition rules |
| **close terminal** | Cannot close if open session exists |

### Usage Examples

#### API Endpoint Usage
- `GET /api/pos/terminals/` - List all terminals
- `GET /api/pos/terminals/{id}/` - Terminal detail with current session
- `PATCH /api/pos/terminals/{id}/` - Update terminal settings
- `POST /api/pos/terminals/` - Create new terminal (admin only)

### Expected Outcome
```
apps/pos/terminal/
├── models.py
├── serializers.py           # POSTerminalSerializer created
└── views.py
```

### Verification Checklist
- [ ] POSTerminalSerializer class created
- [ ] SimpleSessionSerializer created for nested use
- [ ] All base fields included
- [ ] Computed fields (current_session, has_open_session, can_open_session)
- [ ] Field validation methods implemented
- [ ] Object-level validation implemented
- [ ] Meta class configured with read_only_fields
- [ ] Can serialize terminal with current session
- [ ] Can serialize terminal without session

---

## Task 76: Create POSSessionSerializer

### Overview
Create a serializer for POSSession model with transaction counts, totals, and duration calculations for the POS frontend.

### Dependencies
- POSSession model (Group A, Task 02)
- POSTerminal model (Group A, Task 01)
- Task 75: POSTerminalSerializer

### Instructions

#### 1. Create Session Serializer Structure

1. **Open terminal serializers file**
   - Location: `apps/pos/terminal/serializers.py`
   - Add to existing file

2. **Add additional imports**
   - Import POSCart model
   - Import POSPayment model
   - Import timedelta from datetime
   - Import timezone utilities
   - Import Decimal from decimal

#### 2. Create POSSessionSerializer

1. **Define POSSessionSerializer class**
   - Inherit from ModelSerializer
   - Handle both read and write operations

2. **Define base fields**
   - `id` (UUID, read-only)
   - `session_number` (CharField, read-only)
   - `terminal` (PrimaryKeyRelatedField or nested)
   - `operator` (nested user serializer)
   - `status` (CharField, read-only)
   - `opened_at` (DateTimeField, read-only)
   - `closed_at` (DateTimeField, read-only)
   - `opening_cash` (DecimalField, write-only on create)
   - `expected_cash` (DecimalField, read-only)
   - `actual_cash` (DecimalField, write-only on close)
   - `cash_difference` (DecimalField, read-only)

3. **Add statistics fields (computed)**
   - `transaction_count` (SerializerMethodField)
   - `completed_sales` (SerializerMethodField)
   - `total_sales_amount` (SerializerMethodField)
   - `total_cash_amount` (SerializerMethodField)
   - `total_card_amount` (SerializerMethodField)
   - `total_other_amount` (SerializerMethodField)
   - `session_duration` (SerializerMethodField)
   - `average_transaction_value` (SerializerMethodField)

4. **Add nested terminal representation**
   - Use POSTerminalSerializer for read operations
   - Use PrimaryKeyRelatedField for write operations
   - Define separate fields for read and write if needed

#### 3. Implement Computed Fields

1. **Implement get_transaction_count method**
   - Query completed POSCart objects for this session
   - Filter by status=COMPLETED
   - Return count

2. **Implement get_completed_sales method**
   - Same as transaction_count
   - Represents successful checkouts

3. **Implement get_total_sales_amount method**
   - Sum grand_total from all completed carts
   - Use aggregate with Sum
   - Return Decimal, default to 0

4. **Implement get_total_cash_amount method**
   - Query POSPayment objects for this session
   - Filter by payment_method=CASH and status=COMPLETED
   - Sum amounts
   - Return Decimal

5. **Implement get_total_card_amount method**
   - Query POSPayment objects
   - Filter by payment_method=CARD and status=COMPLETED
   - Sum amounts
   - Return Decimal

6. **Implement get_total_other_amount method**
   - Query POSPayment objects
   - Filter by other payment methods (MOBILE, ONLINE)
   - Filter by status=COMPLETED
   - Sum amounts
   - Return Decimal

7. **Implement get_session_duration method**
   - If session is open, calculate from opened_at to now
   - If session is closed, calculate from opened_at to closed_at
   - Return duration in minutes or formatted string (HH:MM)
   - Return None if opened_at is None

8. **Implement get_average_transaction_value method**
   - Divide total_sales_amount by transaction_count
   - Return Decimal rounded to 2 places
   - Return 0 if no transactions

#### 4. Add Terminal Field Handling

1. **Define terminal_detail field**
   - Use SerializerMethodField for read operations
   - Provides full terminal details in responses

2. **Implement get_terminal_detail method**
   - Return serialized terminal using POSTerminalSerializer
   - Include only essential fields (exclude current_session to avoid recursion)

3. **Define terminal field for write operations**
   - Use PrimaryKeyRelatedField
   - Set queryset to active terminals only
   - Write-only field for session creation

#### 5. Add Operator Field Handling

1. **Define operator field**
   - Nested read-only serializer
   - Include: id, username, full_name, email

2. **Set operator from request context**
   - Use context['request'].user
   - Set automatically on create

#### 6. Implement Validation

1. **Create validate_opening_cash method**
   - Ensure opening_cash is provided on create
   - Must be >= 0
   - Cannot be negative
   - Maximum reasonable limit (e.g., 1,000,000)

2. **Create validate_actual_cash method**
   - Only allowed when closing session
   - Must be >= 0
   - Validate against expected_cash (warn if large difference)

3. **Create validate method (object-level)**
   - On create: Ensure terminal doesn't have open session
   - On close: Ensure actual_cash is provided
   - Validate status transitions

#### 7. Configure Meta Class

1. **Set Meta attributes**
   - `model = POSSession`
   - `fields` - all relevant fields
   - `read_only_fields` - id, session_number, status, opened_at, closed_at, etc.

2. **Define extra_kwargs**
   - `opening_cash`: required on create, write_only
   - `actual_cash`: write_only
   - `operator`: read_only

### POSSessionSerializer Response Structure

```json
{
    "id": "uuid-string",
    "session_number": "S-20260123-0001",
    "terminal_detail": {
        "id": "terminal-uuid",
        "terminal_code": "POS-T01",
        "terminal_name": "Main Counter Terminal",
        "location": "Ground Floor - Counter 1"
    },
    "operator": {
        "id": "user-uuid",
        "username": "cashier01",
        "full_name": "John Doe",
        "email": "cashier01@example.com"
    },
    "status": "OPEN",
    "opened_at": "2026-01-23T09:00:00Z",
    "closed_at": null,
    "opening_cash": "10000.00",
    "expected_cash": "10000.00",
    "cash_difference": "0.00",
    "transaction_count": 45,
    "completed_sales": 45,
    "total_sales_amount": "125500.00",
    "total_cash_amount": "45000.00",
    "total_card_amount": "60500.00",
    "total_other_amount": "20000.00",
    "session_duration": "5:30",
    "average_transaction_value": "2788.89"
}
```

### Session Open Request

```json
{
    "terminal": "terminal-uuid",
    "opening_cash": "10000.00"
}
```

### Session Close Request

```json
{
    "actual_cash": "55250.75"
}
```

### Validation Rules

| Operation | Validation |
|-----------|------------|
| **Open Session** | Terminal must not have open session, opening_cash >= 0 |
| **Close Session** | Session must be OPEN, actual_cash must be provided |
| **Opening Cash** | Must be non-negative, reasonable maximum |
| **Actual Cash** | Must be non-negative |

### Usage Examples

#### API Endpoint Usage
- `POST /api/pos/sessions/` - Open new session
- `GET /api/pos/sessions/current/` - Get current session for terminal
- `GET /api/pos/sessions/{id}/` - Session details with statistics
- `POST /api/pos/sessions/{id}/close/` - Close session with actual cash

### Expected Outcome
```
apps/pos/terminal/
├── models.py
├── serializers.py           # POSSessionSerializer added
└── views.py
```

### Verification Checklist
- [ ] POSSessionSerializer class created
- [ ] Base fields defined (session_number, status, dates, cash fields)
- [ ] Computed statistics fields implemented
- [ ] Terminal field handling (read/write separation)
- [ ] Operator field handling
- [ ] Opening cash validation
- [ ] Actual cash validation
- [ ] Object-level validation for session state
- [ ] Meta class configured
- [ ] Can serialize open session with statistics
- [ ] Can serialize closed session with totals

---

## Task 77: Create POSCartSerializer

### Overview
Create a comprehensive serializer for POSCart model with nested items, customer details, and automatic total calculations.

### Dependencies
- POSCart model (Group B, Task 09)
- CartItem model (Group B, Task 10)
- Task 78: CartItemSerializer (create together)

### Instructions

#### 1. Create Cart Serializer File Structure

1. **Navigate to cart app**
   - Location: `apps/pos/cart/`
   - Create `serializers.py` if it doesn't exist

2. **Add required imports**
   - Import ModelSerializer, serializers from rest_framework
   - Import POSCart, CartItem models
   - Import Product, ProductVariant models
   - Import Customer model
   - Import Decimal, ValidationError
   - Import timezone utilities

#### 2. Create POSCartSerializer

1. **Define POSCartSerializer class**
   - Inherit from ModelSerializer
   - Handle cart with nested items

2. **Define base fields**
   - `id` (UUID, read-only)
   - `reference_number` (CharField, read-only)
   - `session` (PrimaryKeyRelatedField)
   - `customer` (nested or PrimaryKeyRelatedField, optional)
   - `status` (CharField, read-only)
   - `created_at` (DateTimeField, read-only)
   - `updated_at` (DateTimeField, read-only)

3. **Add nested items field**
   - `items` (SerializerMethodField for read)
   - Use CartItemSerializer (many=True)
   - Computed field to include all cart items

4. **Add computed total fields**
   - `subtotal` (SerializerMethodField)
   - `discount_total` (SerializerMethodField)
   - `tax_total` (SerializerMethodField)
   - `grand_total` (SerializerMethodField)
   - `item_count` (SerializerMethodField)

5. **Add discount fields**
   - `cart_discount_type` (CharField, optional)
   - `cart_discount_value` (DecimalField, optional)
   - `cart_discount_amount` (DecimalField, read-only)

6. **Add customer detail field**
   - `customer_detail` (SerializerMethodField)
   - Full customer object for display
   - Include: name, phone, email, loyalty_points

#### 3. Implement Items Field

1. **Implement get_items method**
   - Query cart.items.all()
   - Use select_related for product and variant
   - Serialize with CartItemSerializer
   - Return serialized data

2. **Add prefetch optimization**
   - Use prefetch_related in viewset
   - Optimize queries for items.product, items.variant

#### 4. Implement Total Calculation Methods

1. **Implement get_subtotal method**
   - Sum line_total from all items
   - Use cart.calculate_subtotal() if method exists
   - Return Decimal rounded to 2 places

2. **Implement get_discount_total method**
   - Calculate line item discounts
   - Add cart-level discount
   - Use cart.calculate_discount_total() if exists
   - Return Decimal

3. **Implement get_tax_total method**
   - Calculate tax on taxable items
   - Use tax rate from settings or model
   - Use cart.calculate_tax_total() if exists
   - Return Decimal

4. **Implement get_grand_total method**
   - Formula: subtotal - discount_total + tax_total
   - Use cart.calculate_grand_total() if exists
   - Return Decimal rounded to 2 places

5. **Implement get_item_count method**
   - Return total number of items in cart
   - Use cart.items.count()

#### 5. Implement Customer Detail Field

1. **Implement get_customer_detail method**
   - If cart has customer, serialize full details
   - Include: id, name, phone, email, loyalty_points, loyalty_tier
   - Return None if no customer

2. **Add customer field for write**
   - PrimaryKeyRelatedField
   - Allow null
   - Used for adding customer to cart

#### 6. Add Cart Actions Support

1. **Define action context**
   - Support for 'add_item' action
   - Support for 'apply_discount' action
   - Support for 'remove_item' action

2. **Add validation for actions**
   - Validate cart is in ACTIVE status for modifications
   - Validate session is OPEN
   - Validate cart not already completed

#### 7. Implement Validation

1. **Create validate_status method**
   - Cannot change status directly via serializer
   - Status changes through specific actions only
   - Raise ValidationError if attempt to change

2. **Create validate_customer method**
   - Ensure customer belongs to same tenant
   - Customer must be active
   - Validate customer exists

3. **Create validate method (object-level)**
   - Ensure session is provided and open
   - Cannot modify completed cart
   - Cannot modify cart from different session

#### 8. Configure Meta Class

1. **Set Meta attributes**
   - `model = POSCart`
   - `fields` - all relevant fields
   - `read_only_fields` - id, reference_number, status, totals, created_at, updated_at

2. **Define extra_kwargs**
   - `session`: required on create
   - `customer`: allow_null=True
   - `status`: read_only

### POSCartSerializer Response Structure

```json
{
    "id": "cart-uuid",
    "reference_number": "POS-2024-T01-000123",
    "session": "session-uuid",
    "customer": "customer-uuid",
    "customer_detail": {
        "id": "customer-uuid",
        "name": "John Doe",
        "phone": "+94771234567",
        "email": "john@example.com",
        "loyalty_points": 150,
        "loyalty_tier": "SILVER"
    },
    "status": "ACTIVE",
    "items": [
        {
            "id": "item-uuid",
            "product": {
                "id": "product-uuid",
                "name": "Apple iPhone 15",
                "sku": "IP15-128-BLK"
            },
            "variant": null,
            "quantity": 1,
            "unit_price": "125000.00",
            "original_price": "125000.00",
            "line_total": "125000.00",
            "discount_type": null,
            "discount_value": null,
            "discount_amount": "0.00"
        }
    ],
    "item_count": 1,
    "subtotal": "125000.00",
    "discount_total": "0.00",
    "tax_total": "0.00",
    "grand_total": "125000.00",
    "cart_discount_type": null,
    "cart_discount_value": null,
    "cart_discount_amount": "0.00",
    "created_at": "2026-01-23T14:30:00Z",
    "updated_at": "2026-01-23T14:35:00Z"
}
```

### Cart Creation Request

```json
{
    "session": "session-uuid",
    "customer": "customer-uuid"
}
```

### Validation Rules

| Field | Validation |
|-------|------------|
| **session** | Required, must be OPEN |
| **customer** | Optional, must belong to tenant if provided |
| **status** | Cannot be changed directly |
| **modifications** | Only allowed on ACTIVE carts |

### Usage Examples

#### API Endpoint Usage
- `POST /api/pos/cart/` - Create new cart
- `GET /api/pos/cart/{id}/` - Get cart with items and totals
- `PATCH /api/pos/cart/{id}/` - Update cart (add customer)
- `POST /api/pos/cart/{id}/add/` - Add item to cart
- `POST /api/pos/cart/{id}/discount/` - Apply cart discount

### Expected Outcome
```
apps/pos/cart/
├── models.py
├── serializers.py           # POSCartSerializer created
└── views.py
```

### Verification Checklist
- [ ] POSCartSerializer class created
- [ ] Base fields defined
- [ ] Nested items field with CartItemSerializer
- [ ] Total calculation methods implemented
- [ ] Customer detail field implemented
- [ ] Validation methods implemented
- [ ] Meta class configured
- [ ] Can serialize cart with items
- [ ] Can serialize cart without customer
- [ ] Totals calculate correctly

---

## Task 78: Create CartItemSerializer

### Overview
Create a serializer for CartItem model with product details, pricing, and discount calculations.

### Dependencies
- CartItem model (Group B, Task 10)
- Product model
- ProductVariant model

### Instructions

#### 1. Update Cart Serializer File

1. **Open cart serializers file**
   - Location: `apps/pos/cart/serializers.py`
   - Add to existing file

2. **Add additional imports if needed**
   - Import Product, ProductVariant models
   - Import UnitOfMeasure if used

#### 2. Create ProductDetailSerializer (Nested)

1. **Define ProductDetailSerializer**
   - Simple serializer for product info
   - Used within CartItemSerializer

2. **Define fields**
   - `id` (UUID)
   - `name` (CharField)
   - `sku` (CharField)
   - `barcode` (CharField, optional)
   - `image_url` (SerializerMethodField)
   - `category` (CharField, optional)

3. **Implement get_image_url method**
   - Return primary product image URL
   - Return placeholder if no image
   - Use request context for absolute URL

#### 3. Create VariantDetailSerializer (Nested)

1. **Define VariantDetailSerializer**
   - Simple serializer for variant info
   - Used within CartItemSerializer

2. **Define fields**
   - `id` (UUID)
   - `sku` (CharField)
   - `name` (CharField)
   - `attributes` (JSONField, read-only)

#### 4. Create CartItemSerializer

1. **Define CartItemSerializer class**
   - Inherit from ModelSerializer
   - Handle item with nested product/variant

2. **Define base fields**
   - `id` (UUID, read-only)
   - `cart` (PrimaryKeyRelatedField, write-only)
   - `product` (PrimaryKeyRelatedField for write, nested for read)
   - `variant` (PrimaryKeyRelatedField for write, nested for read, optional)
   - `quantity` (DecimalField)
   - `unit_price` (DecimalField)
   - `original_price` (DecimalField, read-only)

3. **Add computed price fields**
   - `line_total` (SerializerMethodField)
   - `discount_amount` (SerializerMethodField)
   - `final_unit_price` (SerializerMethodField)

4. **Add discount fields**
   - `discount_type` (CharField, optional)
   - `discount_value` (DecimalField, optional)
   - `has_discount` (SerializerMethodField)

5. **Add nested product/variant details**
   - `product_detail` (SerializerMethodField)
   - `variant_detail` (SerializerMethodField)

#### 5. Implement Product/Variant Detail Fields

1. **Implement get_product_detail method**
   - Serialize product using ProductDetailSerializer
   - Include full product information
   - Return None if product deleted

2. **Implement get_variant_detail method**
   - If item has variant, serialize it
   - Use VariantDetailSerializer
   - Return None if no variant

#### 6. Implement Price Calculation Methods

1. **Implement get_line_total method**
   - Calculate: quantity * final_unit_price
   - Apply any line-level discounts
   - Return Decimal rounded to 2 places

2. **Implement get_discount_amount method**
   - If discount_type is PERCENTAGE:
     - Calculate: unit_price * quantity * (discount_value / 100)
   - If discount_type is FIXED:
     - Return: discount_value * quantity
   - Return 0 if no discount
   - Return Decimal

3. **Implement get_final_unit_price method**
   - Calculate unit price after discount
   - Formula: unit_price - (discount_amount / quantity)
   - Return Decimal rounded to 2 places

4. **Implement get_has_discount method**
   - Return boolean indicating if item has discount
   - Check if discount_type is not None

#### 7. Implement Validation

1. **Create validate_quantity method**
   - Must be > 0
   - Must not exceed stock quantity (check inventory)
   - Maximum reasonable quantity (e.g., 10000)
   - Raise ValidationError if invalid

2. **Create validate_unit_price method**
   - Must be >= 0
   - Should match product price (warning if different)
   - Maximum reasonable price validation

3. **Create validate_product method**
   - Ensure product exists and is active
   - Ensure product is sellable
   - Check if product is in stock
   - Raise ValidationError if issues

4. **Create validate_variant method**
   - If variant provided, must belong to product
   - Variant must be active
   - Variant must have stock if inventory tracked

5. **Create validate method (object-level)**
   - If discount provided, validate discount_type and discount_value together
   - Ensure discount doesn't exceed unit_price
   - Validate cart is in modifiable state

#### 8. Configure Meta Class

1. **Set Meta attributes**
   - `model = CartItem`
   - `fields` - all relevant fields
   - `read_only_fields` - id, original_price, created_at, updated_at

2. **Define extra_kwargs**
   - `quantity`: required=True, min_value=0.01
   - `unit_price`: required=True, min_value=0
   - `discount_type`: allow_null=True
   - `discount_value`: allow_null=True

### CartItemSerializer Response Structure

```json
{
    "id": "item-uuid",
    "product_detail": {
        "id": "product-uuid",
        "name": "Apple iPhone 15",
        "sku": "IP15-128-BLK",
        "barcode": "8801234567890",
        "image_url": "https://example.com/media/products/iphone15.jpg",
        "category": "Smartphones"
    },
    "variant_detail": null,
    "quantity": 2,
    "unit_price": "125000.00",
    "original_price": "125000.00",
    "discount_type": "PERCENTAGE",
    "discount_value": "10.00",
    "discount_amount": "25000.00",
    "has_discount": true,
    "final_unit_price": "112500.00",
    "line_total": "225000.00"
}
```

### Add Item Request

```json
{
    "product": "product-uuid",
    "variant": null,
    "quantity": 2,
    "unit_price": "125000.00"
}
```

### Validation Rules

| Field | Validation |
|-------|------------|
| **quantity** | > 0, <= stock_quantity, reasonable max |
| **unit_price** | >= 0, should match product price |
| **product** | Must exist, be active, and sellable |
| **variant** | If provided, must belong to product |
| **discount** | If applied, type and value must be provided |

### Usage Examples

#### API Endpoint Usage
- `POST /api/pos/cart/{cart_id}/add/` - Add item to cart
- `PATCH /api/pos/cart/{cart_id}/items/{item_id}/` - Update quantity
- `DELETE /api/pos/cart/{cart_id}/items/{item_id}/` - Remove item
- `POST /api/pos/cart/{cart_id}/items/{item_id}/discount/` - Apply discount

### Expected Outcome
```
apps/pos/cart/
├── models.py
├── serializers.py           # CartItemSerializer added
└── views.py
```

### Verification Checklist
- [ ] ProductDetailSerializer created
- [ ] VariantDetailSerializer created
- [ ] CartItemSerializer class created
- [ ] Base fields defined
- [ ] Product/variant detail fields implemented
- [ ] Price calculation methods implemented
- [ ] Discount calculation methods implemented
- [ ] Quantity validation implemented
- [ ] Product validation implemented
- [ ] Variant validation implemented
- [ ] Meta class configured
- [ ] Can serialize item with product details
- [ ] Can serialize item with discount

---

## Task 79: Create ProductSearchSerializer

### Overview
Create a specialized serializer for product search results in POS, including pricing, stock availability, and quick-add information.

### Dependencies
- Product model
- ProductVariant model
- Inventory models

### Instructions

#### 1. Create Search Serializer File Structure

1. **Create search app structure**
   - Location: `apps/pos/search/`
   - Create `__init__.py`, `serializers.py`

2. **Add required imports**
   - Import ModelSerializer, serializers from rest_framework
   - Import Product, ProductVariant models
   - Import Inventory or Stock models
   - Import Decimal, Q for queries

#### 2. Create ProductVariantSearchSerializer (Nested)

1. **Define ProductVariantSearchSerializer**
   - Lightweight variant representation
   - Used within product search results

2. **Define fields**
   - `id` (UUID)
   - `sku` (CharField)
   - `name` (CharField)
   - `attributes` (JSONField)
   - `price` (DecimalField)
   - `stock_quantity` (SerializerMethodField)
   - `is_available` (SerializerMethodField)

3. **Implement get_stock_quantity method**
   - Query inventory for variant
   - Return available quantity
   - Return 0 if not tracked

4. **Implement get_is_available method**
   - Check if stock_quantity > 0 or not tracked
   - Return boolean

#### 3. Create ProductSearchSerializer

1. **Define ProductSearchSerializer class**
   - Inherit from ModelSerializer
   - Optimized for search results

2. **Define base fields**
   - `id` (UUID)
   - `name` (CharField)
   - `sku` (CharField)
   - `barcode` (CharField)
   - `description` (CharField, truncated)
   - `category` (nested, minimal)
   - `image_url` (SerializerMethodField)

3. **Add pricing fields**
   - `price` (SerializerMethodField)
   - `cost_price` (DecimalField, if user has permission)
   - `has_variants` (SerializerMethodField)
   - `price_range` (SerializerMethodField, if has variants)

4. **Add stock fields**
   - `stock_quantity` (SerializerMethodField)
   - `is_in_stock` (SerializerMethodField)
   - `low_stock_warning` (SerializerMethodField)
   - `track_inventory` (BooleanField)

5. **Add POS-specific fields**
   - `can_sell` (SerializerMethodField)
   - `requires_variant_selection` (SerializerMethodField)
   - `tax_rate` (DecimalField, optional)
   - `unit_of_measure` (CharField, optional)

6. **Add variants field (optional)**
   - `variants` (SerializerMethodField)
   - List of available variants
   - Only if product has variants

#### 4. Implement Pricing Methods

1. **Implement get_price method**
   - If product has no variants, return base price
   - If product has variants, return lowest variant price
   - Return Decimal rounded to 2 places

2. **Implement get_has_variants method**
   - Return boolean indicating if product has variants
   - Check if variants.exists()

3. **Implement get_price_range method**
   - If no variants, return None
   - Get min and max variant prices
   - Return dict: {"min": min_price, "max": max_price}
   - Return None if prices are the same

#### 5. Implement Stock Methods

1. **Implement get_stock_quantity method**
   - If track_inventory is False, return None
   - If has variants, sum variant stock
   - If no variants, return product stock
   - Return integer

2. **Implement get_is_in_stock method**
   - If not tracking inventory, return True
   - If stock_quantity > 0, return True
   - Return False

3. **Implement get_low_stock_warning method**
   - If not tracking inventory, return False
   - Check if stock_quantity <= low_stock_threshold
   - Return boolean

#### 6. Implement POS-Specific Methods

1. **Implement get_can_sell method**
   - Check if product is active
   - Check if is_sellable flag is True
   - Check if has stock (if tracking inventory)
   - Return boolean

2. **Implement get_requires_variant_selection method**
   - Return True if product has variants
   - Indicates POS should show variant picker
   - Return False if no variants

3. **Implement get_image_url method**
   - Return primary image URL
   - Use request context for absolute URL
   - Return placeholder if no image

4. **Implement get_variants method**
   - If product has no variants, return empty list
   - Serialize available variants using ProductVariantSearchSerializer
   - Limit to available variants only (has stock)
   - Return list

#### 7. Add Category Field

1. **Define category field**
   - Nested serializer or SerializerMethodField
   - Include: id, name, path

2. **Implement get_category method**
   - Return minimal category info
   - Include full category path if needed
   - Return None if no category

#### 8. Add Permission-Based Fields

1. **Add cost_price field logic**
   - Only include if user has view_cost permission
   - Use SerializerMethodField with permission check
   - Return None if no permission

2. **Implement get_cost_price method**
   - Check if request.user has permission
   - Return cost_price if permitted
   - Return None otherwise

#### 9. Configure Meta Class

1. **Set Meta attributes**
   - `model = Product`
   - `fields` - all relevant fields
   - `read_only_fields` - all fields (search is read-only)

### ProductSearchSerializer Response Structure

```json
{
    "id": "product-uuid",
    "name": "Apple iPhone 15",
    "sku": "IP15-128-BLK",
    "barcode": "8801234567890",
    "description": "Latest iPhone with advanced features...",
    "category": {
        "id": "category-uuid",
        "name": "Smartphones",
        "path": "Electronics > Mobile Phones > Smartphones"
    },
    "image_url": "https://example.com/media/products/iphone15.jpg",
    "price": "125000.00",
    "has_variants": true,
    "price_range": {
        "min": "125000.00",
        "max": "175000.00"
    },
    "stock_quantity": 15,
    "is_in_stock": true,
    "low_stock_warning": false,
    "track_inventory": true,
    "can_sell": true,
    "requires_variant_selection": true,
    "tax_rate": "0.00",
    "unit_of_measure": "EA",
    "variants": [
        {
            "id": "variant-uuid",
            "sku": "IP15-128-BLK",
            "name": "128GB Black",
            "attributes": {"storage": "128GB", "color": "Black"},
            "price": "125000.00",
            "stock_quantity": 5,
            "is_available": true
        },
        {
            "id": "variant-uuid-2",
            "sku": "IP15-256-BLK",
            "name": "256GB Black",
            "attributes": {"storage": "256GB", "color": "Black"},
            "price": "145000.00",
            "stock_quantity": 10,
            "is_available": true
        }
    ]
}
```

### Search Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| **q** | Search term | `?q=iphone` |
| **category** | Category filter | `?category=smartphones` |
| **in_stock** | Only in-stock items | `?in_stock=true` |
| **barcode** | Exact barcode match | `?barcode=8801234567890` |
| **min_price** | Minimum price | `?min_price=10000` |
| **max_price** | Maximum price | `?max_price=200000` |

### Usage Examples

#### API Endpoint Usage
- `GET /api/pos/search/?q=iphone` - Search products by name/SKU
- `GET /api/pos/search/?barcode=8801234567890` - Search by barcode
- `GET /api/pos/search/?category=smartphones&in_stock=true` - Filtered search

### Expected Outcome
```
apps/pos/search/
├── __init__.py
├── serializers.py           # ProductSearchSerializer created
└── views.py
```

### Verification Checklist
- [ ] ProductVariantSearchSerializer created
- [ ] ProductSearchSerializer class created
- [ ] Base product fields defined
- [ ] Pricing methods implemented (price, price_range)
- [ ] Stock methods implemented (quantity, in_stock, warning)
- [ ] POS-specific methods implemented (can_sell, requires_variant)
- [ ] Image URL method implemented
- [ ] Category field implemented
- [ ] Variants field implemented (optional)
- [ ] Permission-based cost_price field
- [ ] Meta class configured
- [ ] Optimized for search performance

---

## Task 80: Create POSPaymentSerializer

### Overview
Create a serializer for payment requests and responses in POS, handling validation for different payment methods and amounts.

### Dependencies
- POSPayment model (Group D, Task 67)
- POSCart model (Group B, Task 09)
- Payment method integrations

### Instructions

#### 1. Create Payment Serializer File Structure

1. **Create payment app structure**
   - Location: `apps/pos/payment/`
   - Create `serializers.py` if it doesn't exist

2. **Add required imports**
   - Import ModelSerializer, serializers from rest_framework
   - Import POSPayment, POSCart models
   - Import Decimal, ValidationError
   - Import timezone utilities
   - Import payment method choices

#### 2. Create PaymentMethodSerializer (Reference)

1. **Define PaymentMethodSerializer**
   - Reference serializer for available methods
   - Used in dropdown/selection UI

2. **Define fields**
   - `code` (CharField)
   - `name` (CharField)
   - `requires_reference` (BooleanField)
   - `is_available` (BooleanField)

#### 3. Create POSPaymentRequestSerializer

1. **Define POSPaymentRequestSerializer**
   - Used for payment initiation requests
   - Validate payment details before processing

2. **Define request fields**
   - `cart` (PrimaryKeyRelatedField)
   - `payment_method` (ChoiceField)
   - `amount` (DecimalField)
   - `reference_number` (CharField, optional)
   - `card_last_four` (CharField, optional for card payments)
   - `card_type` (CharField, optional)
   - `authorization_code` (CharField, optional)

3. **Add computed validation fields**
   - `change_amount` (DecimalField, computed for cash)
   - `tendered_amount` (DecimalField, for cash payments)

#### 4. Implement Request Validation

1. **Create validate_cart method**
   - Ensure cart exists and is ACTIVE
   - Ensure cart belongs to current session
   - Ensure cart has items
   - Ensure cart.grand_total > 0
   - Raise ValidationError if issues

2. **Create validate_payment_method method**
   - Ensure method is in allowed choices
   - Check if payment method is enabled
   - For cash, no additional validation
   - For card, ensure card_last_four provided
   - For mobile, ensure reference_number provided

3. **Create validate_amount method**
   - Must be > 0
   - For split payments, can be <= cart.grand_total
   - For full payment, should equal cart.grand_total
   - Validate not exceeding cart total by large margin

4. **Create validate method (object-level)**
   - If payment_method is CARD:
     - Ensure card_last_four is provided
     - Validate card_last_four format (4 digits)
   - If payment_method is MOBILE or ONLINE:
     - Ensure reference_number is provided
     - Validate reference format
   - If payment_method is CASH:
     - Can have tendered_amount
     - Calculate change_amount

#### 5. Create POSPaymentSerializer (Response)

1. **Define POSPaymentSerializer class**
   - Used for payment responses
   - Inherit from ModelSerializer

2. **Define response fields**
   - `id` (UUID, read-only)
   - `cart` (PrimaryKeyRelatedField, read-only)
   - `payment_method` (CharField, read-only)
   - `amount` (DecimalField, read-only)
   - `status` (CharField, read-only)
   - `reference_number` (CharField, read-only)
   - `card_last_four` (CharField, read-only)
   - `authorization_code` (CharField, read-only)
   - `processed_at` (DateTimeField, read-only)
   - `created_at` (DateTimeField, read-only)

3. **Add computed fields**
   - `is_successful` (SerializerMethodField)
   - `can_refund` (SerializerMethodField)
   - `payment_method_display` (SerializerMethodField)

4. **Add cart reference fields**
   - `cart_reference` (SerializerMethodField)
   - `cart_total` (SerializerMethodField)

#### 6. Implement Response Computed Fields

1. **Implement get_is_successful method**
   - Return True if status is COMPLETED
   - Return False otherwise

2. **Implement get_can_refund method**
   - Check if payment is COMPLETED
   - Check if refund not already issued
   - Check if within refund period (if applicable)
   - Return boolean

3. **Implement get_payment_method_display method**
   - Return human-readable payment method name
   - Map: CASH → "Cash", CARD → "Card", etc.

4. **Implement get_cart_reference method**
   - Return cart.reference_number
   - Used for receipt display

5. **Implement get_cart_total method**
   - Return cart.grand_total
   - Used for verification

#### 7. Create Split Payment Support

1. **Define SplitPaymentSerializer**
   - Handle multiple payments for one cart
   - Validate total of splits equals cart total

2. **Define split fields**
   - `cart` (PrimaryKeyRelatedField)
   - `payments` (List of payment detail dicts)
   - `total_amount` (computed)

3. **Implement split validation**
   - Sum of all payment amounts must equal cart.grand_total
   - Each payment must be valid
   - Cannot have duplicate payment methods (unless allowed)

#### 8. Configure Meta Classes

1. **Set POSPaymentRequestSerializer Meta**
   - No model (plain serializer)
   - Define all required fields

2. **Set POSPaymentSerializer Meta**
   - `model = POSPayment`
   - `fields` - all relevant fields
   - `read_only_fields` - all fields (responses are read-only)

### POSPaymentRequestSerializer Structure

```json
{
    "cart": "cart-uuid",
    "payment_method": "CARD",
    "amount": "125000.00",
    "reference_number": null,
    "card_last_four": "4532",
    "card_type": "VISA",
    "authorization_code": "AUTH123456"
}
```

### POSPaymentSerializer Response Structure

```json
{
    "id": "payment-uuid",
    "cart": "cart-uuid",
    "cart_reference": "POS-2024-T01-000123",
    "cart_total": "125000.00",
    "payment_method": "CARD",
    "payment_method_display": "Credit Card",
    "amount": "125000.00",
    "status": "COMPLETED",
    "reference_number": "PAY-20260123-001",
    "card_last_four": "4532",
    "card_type": "VISA",
    "authorization_code": "AUTH123456",
    "is_successful": true,
    "can_refund": true,
    "processed_at": "2026-01-23T14:45:00Z",
    "created_at": "2026-01-23T14:44:55Z"
}
```

### Cash Payment Request

```json
{
    "cart": "cart-uuid",
    "payment_method": "CASH",
    "amount": "125000.00",
    "tendered_amount": "150000.00"
}
```

### Split Payment Request

```json
{
    "cart": "cart-uuid",
    "payments": [
        {
            "payment_method": "CASH",
            "amount": "50000.00"
        },
        {
            "payment_method": "CARD",
            "amount": "75000.00",
            "card_last_four": "4532"
        }
    ]
}
```

### Validation Rules

| Field | Validation |
|-------|------------|
| **cart** | Must be ACTIVE, have items, belong to current session |
| **payment_method** | Must be valid choice and enabled |
| **amount** | > 0, <= cart.grand_total |
| **card_last_four** | Required for CARD, must be 4 digits |
| **reference_number** | Required for MOBILE/ONLINE |
| **split total** | Sum of splits must equal cart.grand_total |

### Usage Examples

#### API Endpoint Usage
- `POST /api/pos/payment/` - Initiate payment
- `POST /api/pos/payment/complete/` - Complete payment transaction
- `GET /api/pos/payment/{id}/` - Get payment details
- `POST /api/pos/payment/{id}/refund/` - Process refund

### Expected Outcome
```
apps/pos/payment/
├── models.py
├── serializers.py           # Payment serializers created
└── views.py
```

### Verification Checklist
- [ ] PaymentMethodSerializer created
- [ ] POSPaymentRequestSerializer created
- [ ] POSPaymentSerializer (response) created
- [ ] Cart validation implemented
- [ ] Payment method validation implemented
- [ ] Amount validation implemented
- [ ] Card payment validation (card_last_four)
- [ ] Mobile payment validation (reference_number)
- [ ] Cash payment handling (tendered, change)
- [ ] Split payment support implemented
- [ ] Response computed fields implemented
- [ ] Meta classes configured
- [ ] Can validate payment requests
- [ ] Can serialize payment responses

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 75 | Create POSTerminalSerializer | Terminal with current session |
| 76 | Create POSSessionSerializer | Session with statistics and totals |
| 77 | Create POSCartSerializer | Cart with nested items and totals |
| 78 | Create CartItemSerializer | Item with product details and pricing |
| 79 | Create ProductSearchSerializer | Search results with stock and pricing |
| 80 | Create POSPaymentSerializer | Payment request/response validation |

### Serializers Created
```
apps/pos/
├── terminal/
│   ├── serializers.py           # POSTerminalSerializer, POSSessionSerializer
├── cart/
│   ├── serializers.py           # POSCartSerializer, CartItemSerializer
├── search/
│   ├── serializers.py           # ProductSearchSerializer
└── payment/
    ├── serializers.py           # POSPaymentSerializer
```

### Data Flow Architecture

```
┌────────────��────────────────────────────────────────────┐
│                   POS Data Flow                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend Request                                       │
│        │                                                │
│        ▼                                                │
│  [ViewSet] ──────▶ [Serializer.validate()]            │
│        │                  │                             │
│        │                  ▼                             │
│        │            [Model.save()]                      │
│        │                  │                             │
│        ▼                  ▼                             │
│  [Serializer.data] ──▶ JSON Response                   │
│                                                         │
│  Example: Add to Cart                                   │
│  1. POST /api/pos/cart/{id}/add/                       │
│  2. CartItemSerializer.validate(data)                  │
│  3. CartItem.objects.create()                          │
│  4. POSCartSerializer.data (with new item)             │
│  5. Return cart with updated totals                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns Used

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Nested Serializers** | Items within Cart, Session within Terminal | Complete data in single request |
| **SerializerMethodField** | Computed totals, statistics | Dynamic calculations |
| **Read/Write Separation** | Different fields for input vs output | Security and clarity |
| **Permission-Based Fields** | cost_price only with permission | Data access control |
| **Validation Layers** | Field-level and object-level | Data integrity |

### Common Validation Patterns

All serializers follow these validation practices:
- **Field-level validation** for individual field constraints
- **Object-level validation** for cross-field rules
- **Business logic validation** (e.g., cart must be ACTIVE)
- **Permission checks** for sensitive data
- **Existence checks** for foreign keys
- **State validation** (e.g., session must be OPEN)

### Next Steps

All serializers are now complete. Proceed to:
1. [02_Tasks-81-84_ViewSets-Search.md](02_Tasks-81-84_ViewSets-Search.md) - Create ViewSets and Search View
2. Implement the DRF ViewSets that use these serializers
3. Add URL routing for all endpoints
4. Test serialization and deserialization

---

## Notes for AI Agents

### Serializer Testing Approach
1. **Unit test each serializer** separately
2. **Test validation rules** with invalid data
3. **Test nested serializers** for proper data structure
4. **Test computed fields** with various scenarios
5. **Test read/write separation** ensure write-only fields not exposed

### Performance Optimization
1. **Use select_related** for foreign keys in viewsets
2. **Use prefetch_related** for reverse relations (items)
3. **Limit nested depth** to avoid N+1 queries
4. **Cache computed fields** when appropriate
5. **Use database aggregation** for statistics

### Security Considerations
1. **Never expose sensitive fields** (cost_price without permission)
2. **Validate tenant isolation** in all serializers
3. **Use write_only** for payment details
4. **Sanitize user input** in all validators
5. **Check permissions** before returning data

### DRF Best Practices Applied
1. **Explicit field definitions** instead of fields='__all__'
2. **Read-only fields** properly marked
3. **Validation in serializers** not in views
4. **Computed fields** using SerializerMethodField
5. **Consistent error messages** across serializers

