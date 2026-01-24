# Tasks 81-86: DRF Serializers, ViewSet & Custom Actions

**Phase**: 05_ERP-Core-Modules-Part2  
**SubPhase**: 12_Vendor-Bills-Payments  
**Group**: F_API-Testing-Documentation  
**Tasks**: 81-86  

---

## Navigation

- **Parent**: [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous**: [Group-E_Document-03](../Group-E_Workflows-Reports/03_Tasks-76-80_Payment-Processing-Reports.md)
- **Next**: [Group-F_Document-02](02_Tasks-87-90_API-Endpoints-Testing.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 81: VendorBill Serializer](#task-81-vendorbill-serializer)
3. [Task 82: BillLineItem Serializer](#task-82-billlineitem-serializer)
4. [Task 83: VendorPayment Serializer](#task-83-vendorpayment-serializer)
5. [Task 84: VendorBillViewSet CRUD Operations](#task-84-vendorbillviewset-crud-operations)
6. [Task 85: Filtering and Search Implementation](#task-85-filtering-and-search-implementation)
7. [Task 86: Custom ViewSet Actions](#task-86-custom-viewset-actions)
8. [Integration Requirements](#integration-requirements)
9. [Security Considerations](#security-considerations)
10. [Performance Optimization](#performance-optimization)
11. [Validation Summary](#validation-summary)
12. [Testing Strategy](#testing-strategy)

---

## Overview

### Purpose

This document outlines the implementation of Django REST Framework (DRF) serializers and ViewSet components for the Vendor Bills and Payments module. These components provide the API layer that enables frontend applications and external systems to interact with vendor bill management, payment processing, and related operations.

### Scope

**Tasks Covered:**
- **Task 81**: VendorBill master serializer with nested line items
- **Task 82**: BillLineItem detail serializer with product/service references
- **Task 83**: VendorPayment serializer with allocation tracking
- **Task 84**: VendorBillViewSet with full CRUD operations
- **Task 85**: Advanced filtering, search, and ordering capabilities
- **Task 86**: Custom actions for workflow operations

### Key Objectives

1. **Comprehensive Serialization**: Support complex nested structures for bills with multiple line items
2. **Flexible API Design**: Provide both list and detail serializers for optimal performance
3. **Robust Validation**: Implement field-level and object-level validation
4. **Advanced Filtering**: Enable complex queries with multiple filter criteria
5. **Custom Actions**: Support workflow operations (approve, reject, mark paid, etc.)
6. **Permission Integration**: Enforce role-based access control at the API layer
7. **Performance Optimization**: Use select_related and prefetch_related for efficiency
8. **Error Handling**: Provide clear, actionable error messages

### Dependencies

**Models Required:**
- VendorBill (Task 61)
- BillLineItem (Task 62)
- VendorPayment (Task 63)
- PaymentAllocation (Task 64)
- Vendor (from SubPhase-11)
- Product/Service models
- Tax models

**Framework Components:**
- Django REST Framework 3.14+
- djangorestframework-filters or django-filter
- drf-spectacular for API documentation

**Authentication:**
- JWT token authentication
- Session authentication (for browsable API)
- API key authentication (for integrations)

---

## Task 81: VendorBill Serializer

### Objective

Implement comprehensive serializers for VendorBill model supporting both list and detail views, with nested line items in detail view and proper validation.

### Serializer Architecture

#### VendorBillListSerializer

**Purpose**: Optimized for list views with minimal data transfer

**Fields Included:**
- `id`: Primary key (UUID)
- `bill_number`: Auto-generated or manual number
- `vendor`: Nested vendor basic info (ID, name, code)
- `bill_date`: Date of bill
- `due_date`: Payment due date
- `status`: Current status (draft, pending_approval, approved, etc.)
- `currency`: Currency code
- `total_amount`: Calculated total
- `outstanding_amount`: Remaining unpaid amount
- `is_overdue`: Computed field based on due_date
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Read-Only Fields:**
- `id`
- `bill_number` (if auto-generated)
- `total_amount` (calculated)
- `outstanding_amount` (calculated)
- `is_overdue` (computed)
- `created_at`
- `updated_at`

**Performance Considerations:**
- No nested line items (use detail serializer for that)
- Vendor represented as nested serializer, not full object
- Use `select_related('vendor', 'currency', 'tenant')` in viewset
- Annotate outstanding_amount to avoid N+1 queries

#### VendorBillDetailSerializer

**Purpose**: Complete representation with all related data

**Additional Fields:**
- `line_items`: Nested BillLineItem serializer (many=True)
- `payments`: Summary of applied payments (read-only)
- `attachments`: Related document attachments
- `vendor_address`: Nested address information
- `billing_address`: Tenant's billing address
- `terms_and_conditions`: Payment terms text
- `notes`: Internal notes
- `tax_summary`: Grouped tax totals by rate
- `approval_history`: Nested approval records
- `audit_trail`: Creation/modification history

**Nested Serializers:**
- `BillLineItemSerializer` (writable nested)
- `VendorBasicSerializer` (read-only)
- `PaymentSummarySerializer` (read-only)
- `AttachmentSerializer` (read-only or writable)
- `ApprovalHistorySerializer` (read-only)

**Write Operations:**
- Support create with nested line items
- Support update with partial line item changes
- Handle line item deletion (mark as deleted or remove)
- Validate total amounts match sum of line items

#### VendorBillCreateUpdateSerializer

**Purpose**: Optimized for create/update operations

**Behavior:**
- Accept nested line_items as list of objects
- Validate each line item
- Calculate totals automatically
- Handle currency consistency
- Support partial updates (PATCH)

**Validation Rules:**
- At least one line item required
- All line items must have valid product/service reference
- Quantities must be positive
- Unit prices must be positive
- Tax rates must be valid and active
- Vendor must be active
- Bill date cannot be in future (configurable)
- Due date must be >= bill_date

### Field Validation

#### bill_number

**Validation:**
- If provided, must be unique within tenant
- Match configured format pattern
- If auto-generated, ensure sequence integrity

**Error Messages:**
- "Bill number already exists for this tenant"
- "Invalid bill number format. Expected: {pattern}"

#### bill_date

**Validation:**
- Cannot be more than X days in the future (configurable)
- Cannot be before tenant activation date
- Must be valid date format

**Business Rules:**
- If not provided, default to today
- Timezone-aware (use tenant timezone)

**Error Messages:**
- "Bill date cannot be in the future"
- "Bill date is before tenant activation date"

#### due_date

**Validation:**
- Must be >= bill_date
- Cannot be more than X years in future (configurable)
- If not provided, calculate based on payment_terms

**Calculation:**
- If payment_terms = "NET_30", due_date = bill_date + 30 days
- If payment_terms = "NET_60", due_date = bill_date + 60 days
- Custom payment terms can have custom calculations

**Error Messages:**
- "Due date must be on or after bill date"
- "Due date is too far in the future"

#### vendor

**Validation:**
- Must be a valid vendor ID within tenant
- Vendor must be active
- Vendor must have valid payment terms
- If vendor on credit hold, restrict bill creation (configurable)

**Error Messages:**
- "Invalid vendor"
- "Vendor is inactive"
- "Vendor is on credit hold and cannot receive new bills"

#### currency

**Validation:**
- Must be a valid active currency code
- Should match vendor's default currency (warning if different)
- If different from tenant base currency, exchange rate required

**Error Messages:**
- "Invalid currency code"
- "Currency is inactive"
- "Exchange rate required for non-base currency"

#### status

**Validation:**
- Must be a valid status from BILL_STATUS_CHOICES
- Status transitions must follow workflow rules
- Cannot skip required approval statuses

**Allowed Transitions:**
- `DRAFT` → `PENDING_APPROVAL`, `CANCELLED`
- `PENDING_APPROVAL` → `APPROVED`, `REJECTED`, `CANCELLED`
- `APPROVED` → `PARTIALLY_PAID`, `PAID`, `CANCELLED`
- `PARTIALLY_PAID` → `PAID`, `CANCELLED`
- `PAID` → (terminal state, limited changes)
- `CANCELLED` → (terminal state, no changes)

**Error Messages:**
- "Invalid status value"
- "Cannot transition from {current_status} to {new_status}"
- "Bill must be approved before payment"

#### payment_terms

**Validation:**
- Must be a valid payment term code
- Should match vendor's default terms (warning if different)
- Must define valid due date calculation

**Error Messages:**
- "Invalid payment terms"
- "Payment terms do not match vendor default"

### Nested Line Items Handling

#### Create Operation

**Process Flow:**
1. Validate bill-level data
2. Validate each line item in line_items array
3. Check for duplicate products (warning, not error)
4. Calculate line totals
5. Calculate tax for each line
6. Calculate bill total
7. Create VendorBill instance
8. Create BillLineItem instances
9. Update calculated totals
10. Return serialized data

**Validation:**
- Minimum one line item required
- Maximum 1000 line items per bill (configurable)
- Each line must have valid product/service
- No duplicate line_number within bill

**Error Handling:**
- If bill creation succeeds but line item fails, rollback transaction
- Provide detailed error for each invalid line item
- Include line_number or array index in error

#### Update Operation

**Process Flow:**
1. Identify existing line items
2. Separate line items into: create, update, delete
3. Line items with `id`: update existing
4. Line items without `id`: create new
5. Existing line items not in request: delete or error (configurable)
6. Recalculate totals
7. Update VendorBill instance

**Update Strategies:**

**Strategy 1: Replace All** (default)
- Delete all existing line items
- Create all line items from request
- Simpler logic, but loses history

**Strategy 2: Differential Update**
- Keep line items with matching ID and update
- Add new line items
- Remove line items not in request
- More complex, preserves IDs

**Strategy 3: Append Only**
- Only allow adding new line items
- Existing line items immutable (unless bill in DRAFT)
- Most restrictive, best audit trail

**Configuration:**
- Setting: `VENDOR_BILL_LINE_ITEM_UPDATE_STRATEGY`
- Options: `replace_all`, `differential`, `append_only`

#### Delete Operation

**Handling:**
- If bill is DRAFT: hard delete allowed
- If bill is PENDING_APPROVAL or beyond: soft delete only
- If bill is PAID: no deletion allowed

**Soft Delete:**
- Set `is_deleted = True`
- Keep line item for audit trail
- Exclude from total calculations

### Calculated Fields

#### total_amount

**Calculation:**
```
total_amount = SUM(line_items.subtotal + line_items.tax_amount)
```

**When to Recalculate:**
- After create
- After update (any line item change)
- After line item delete
- On tax rate changes (if configured)

**Storage:**
- Store in database for performance
- Recompute on demand if mismatch detected
- Background task to validate and fix mismatches

#### outstanding_amount

**Calculation:**
```
outstanding_amount = total_amount - SUM(payment_allocations.amount)
```

**Considerations:**
- Include only non-cancelled payments
- Handle partial payments
- Handle overpayments (credit memos)
- Update when payment is applied or reversed

**Performance:**
- Use database aggregation
- Cache for frequently accessed bills
- Invalidate cache on payment changes

#### is_overdue

**Calculation:**
```
is_overdue = (due_date < today) AND (outstanding_amount > 0)
```

**Considerations:**
- Use tenant timezone for "today"
- Computed field (not stored)
- Include grace period (configurable)

### Method Fields (SerializerMethodField)

#### get_is_overdue

**Implementation:**
- Compare due_date with current date (tenant timezone)
- Check outstanding_amount > 0
- Consider grace period settings
- Return boolean

#### get_vendor_name

**Implementation:**
- Extract vendor.name
- Avoids additional query if vendor prefetched
- Return string or None

#### get_payment_status_display

**Implementation:**
- Provide human-readable status
- "Unpaid", "Partially Paid", "Paid", "Overdue"
- Include days overdue if applicable
- Return string

#### get_tax_summary

**Implementation:**
- Group line items by tax rate
- Calculate total tax per rate
- Return list of {tax_rate, tax_name, tax_amount}

**Example Return:**
```
[
  {
    "tax_rate": "10.00",
    "tax_name": "VAT 10%",
    "tax_amount": "150.00"
  },
  {
    "tax_rate": "5.00",
    "tax_name": "Service Tax 5%",
    "tax_amount": "75.00"
  }
]
```

#### get_approval_status

**Implementation:**
- Check approval workflow state
- Return current approver if pending
- Include approval level if multi-level
- Return object with status and details

### Representation Methods

#### to_representation

**Customizations:**
- Format currency amounts with appropriate precision
- Convert dates to ISO 8601 format
- Include timezone information
- Add computed fields not in model
- Filter sensitive data based on permissions

#### to_internal_value

**Customizations:**
- Normalize currency input (remove commas, symbols)
- Parse flexible date formats
- Convert string IDs to proper types
- Handle null vs empty string

### Meta Configuration

**Model:**
- `model = VendorBill`

**Fields:**
- List view: Subset of fields
- Detail view: All relevant fields including nested

**Read-Only Fields:**
- Auto-generated fields (id, timestamps)
- Calculated fields (totals, balances)
- System fields (created_by, tenant)

**Extra Kwargs:**
- `bill_number`: `{required: False}`
- `status`: `{default: 'DRAFT'}`
- `currency`: `{required: True}`

---

## Task 82: BillLineItem Serializer

### Objective

Implement serializers for BillLineItem model with proper validation, product/service reference handling, and tax calculations.

### Serializer Variants

#### BillLineItemListSerializer

**Purpose**: Lightweight representation for nested use in bill lists

**Fields:**
- `id`: UUID
- `line_number`: Sequence within bill
- `product_name`: Product or service name
- `quantity`: Ordered quantity
- `unit_price`: Price per unit
- `subtotal`: Quantity × unit_price
- `tax_amount`: Calculated tax
- `total`: Subtotal + tax_amount

**Usage:**
- Nested in VendorBillListSerializer
- Quick overview without full details
- Optimized for performance

#### BillLineItemDetailSerializer

**Purpose**: Complete line item with all references

**Fields:**
- All fields from list serializer
- `product`: Nested product/service details
- `unit_of_measure`: UOM details
- `tax_rate`: Applied tax rate object
- `discount_percent`: Discount percentage
- `discount_amount`: Calculated discount
- `description`: Line item description
- `notes`: Internal notes
- `project`: Project reference (if applicable)
- `department`: Department allocation
- `cost_center`: Cost center allocation
- `gl_account`: GL account override

**Nested Objects:**
- ProductBasicSerializer (read-only)
- UOMSerializer (read-only)
- TaxRateSerializer (read-only)

#### BillLineItemWriteSerializer

**Purpose**: Create and update operations

**Behavior:**
- Accept product ID or product details
- Calculate subtotal automatically
- Calculate tax based on product and vendor settings
- Support both percentage and fixed discounts
- Validate quantity and price constraints

### Field Validation

#### line_number

**Validation:**
- Must be unique within bill
- Must be positive integer
- Sequential numbering recommended but not enforced
- If not provided, auto-assign next number

**Error Messages:**
- "Line number must be unique within bill"
- "Line number must be positive"

#### product vs product_name

**Validation:**
- Either `product` (ForeignKey) or `product_name` (CharField) required
- If product provided, product_name auto-populated from product
- If only product_name, it's a free-text item (no inventory link)

**Business Rules:**
- Inventory-linked items: require product reference
- Service items: can use product or product_name
- One-off items: only product_name

**Error Messages:**
- "Either product or product_name must be provided"
- "Product must be active and available for purchase"

#### quantity

**Validation:**
- Must be positive decimal
- Must be greater than 0
- Precision based on UOM settings
- Maximum quantity limits (configurable per product)

**Error Messages:**
- "Quantity must be greater than zero"
- "Quantity exceeds maximum allowed for this product"
- "Quantity precision exceeds allowed decimal places"

#### unit_price

**Validation:**
- Must be positive or zero (free items allowed with approval)
- Maximum price validation (configurable)
- Minimum price validation (prevent underpricing)
- Compare with product's standard cost (warning if below)

**Error Messages:**
- "Unit price must be positive"
- "Unit price exceeds maximum allowed"
- "Unit price is below minimum allowed"

**Warnings:**
- "Unit price is significantly different from standard cost"

#### unit_of_measure

**Validation:**
- Must be valid UOM for the product
- If product has multiple UOMs, must be one of them
- If product has single UOM, auto-populate if not provided

**Conversion:**
- If different from product's base UOM, convert quantity
- Example: Product in "cases", line item in "units"
- Apply conversion factor

**Error Messages:**
- "Invalid unit of measure for this product"
- "Unit of measure not available for this product"

#### tax_rate

**Validation:**
- Must be valid active tax rate
- Must be applicable for purchase transactions
- Should match product's default purchase tax (warning if different)
- Consider vendor's tax registration status

**Auto-Selection:**
1. Check product's purchase_tax_rate
2. Check vendor's default tax rate
3. Check tenant's default purchase tax rate
4. Default to no tax (0%) with warning

**Error Messages:**
- "Invalid tax rate"
- "Tax rate is not applicable for purchases"
- "Tax rate is inactive"

#### discount_percent

**Validation:**
- Must be between 0 and 100
- Maximum discount limits based on user permissions
- Discounts above threshold require approval

**Error Messages:**
- "Discount percent must be between 0 and 100"
- "Discount exceeds authorized limit"

#### discount_amount

**Validation:**
- Must be between 0 and subtotal
- Either discount_percent or discount_amount (not both)
- If both provided, discount_amount takes precedence

**Error Messages:**
- "Discount amount cannot exceed subtotal"
- "Cannot specify both discount_percent and discount_amount"

### Calculations

#### subtotal

**Formula:**
```
subtotal = (quantity × unit_price) - discount_amount
```

**Or with percentage:**
```
discount_amount = (quantity × unit_price) × (discount_percent / 100)
subtotal = (quantity × unit_price) - discount_amount
```

**Precision:**
- Round to currency's decimal places
- Store exact value, display rounded

#### tax_amount

**Formula (Simple):**
```
tax_amount = subtotal × (tax_rate / 100)
```

**Formula (Compound Tax):**
```
For each tax component:
  tax_component_amount = (subtotal + previous_tax) × (component_rate / 100)
  tax_amount += tax_component_amount
```

**Considerations:**
- Handle inclusive vs exclusive tax
- Round each tax component separately
- Store tax breakdown for audit

#### total

**Formula:**
```
total = subtotal + tax_amount
```

**Storage:**
- Store in database for quick retrieval
- Validate against calculated value
- Flag discrepancies for review

### Product Reference Handling

#### Product Selection

**Options:**
1. **Existing Product**: Select from product catalog
2. **Product Variant**: Select variant if applicable
3. **Service**: Select from service catalog
4. **Free Text**: Enter product_name manually

**Serializer Support:**
- Accept `product` (UUID or ID)
- Accept `product_variant` (UUID or ID)
- Accept `product_name` (string)
- Auto-populate related fields from product

#### Auto-Population from Product

**Fields Auto-Filled:**
- `product_name`: From product.name
- `description`: From product.description
- `unit_of_measure`: From product.purchase_uom
- `unit_price`: From product.standard_cost or last_purchase_price
- `tax_rate`: From product.purchase_tax_rate
- `gl_account`: From product.purchase_account

**Override Capability:**
- Allow manual override of auto-filled values
- Track overrides for audit (optional)
- Require reason for significant overrides (optional)

#### Product Validation

**Checks:**
- Product exists and is active
- Product is purchasable (product_type allows purchases)
- Product is not discontinued
- Vendor is approved supplier for product (optional)
- Product within authorized category (optional)

**Warnings (not errors):**
- Product price differs from standard cost
- Product not purchased recently
- First purchase from this vendor

### Service Reference Handling

**Service Types:**
- Professional services
- Maintenance services
- Subscription services
- Utility services

**Special Fields:**
- `service_period_start`: Start date of service
- `service_period_end`: End date of service
- `billing_frequency`: One-time, monthly, annually
- `recurring`: Boolean for subscription services

**Validation:**
- Service period required for time-based services
- End date must be after start date
- For recurring, validate billing frequency

### UOM Handling

**Validation:**
- UOM must be valid for selected product
- If product has UOM group, select from group
- Support UOM conversions

**Conversion Logic:**
- Convert quantity to base UOM for inventory
- Store both original and converted quantities
- Display in user's preferred UOM

**Example:**
- Product base UOM: "Each"
- Purchase UOM: "Case" (1 Case = 24 Each)
- Quantity: 5 Cases = 120 Each

### Allocation Fields

#### project

**Purpose**: Allocate expense to specific project

**Validation:**
- Project must be active
- User must have access to project
- Project must allow purchases

**Impact:**
- Project cost tracking
- Project budget consumption
- Job costing integration

#### department

**Purpose**: Allocate expense to department

**Validation:**
- Department must be active
- Department must exist within tenant

**Impact:**
- Departmental expense tracking
- Budget monitoring by department

#### cost_center

**Purpose**: Allocate to cost center for accounting

**Validation:**
- Cost center must be active
- Cost center must allow purchases

**Impact:**
- Cost center reporting
- Financial dimension analysis

#### gl_account

**Purpose**: Override default expense GL account

**Validation:**
- Account must be expense type
- Account must be active
- User must have permission to override

**Default Behavior:**
- If not provided, use product's expense account
- If product has no account, use default purchase account
- If no defaults, error

### Nested Serializer Usage

**In VendorBillSerializer:**

**Create:**
- Accept array of line item objects
- Validate each line item
- Create line items with bill reference

**Update:**
- Support updating existing line items by ID
- Support adding new line items
- Support removing line items (soft delete)

**Read:**
- Include full line item details in bill detail view
- Include minimal line items in bill list view

---

## Task 83: VendorPayment Serializer

### Objective

Implement comprehensive serializers for VendorPayment model with payment allocation tracking, multiple payment methods, and reconciliation support.

### Serializer Variants

#### VendorPaymentListSerializer

**Purpose**: Optimized for list views

**Fields:**
- `id`: UUID
- `payment_number`: Reference number
- `vendor`: Nested vendor basic info
- `payment_date`: Date of payment
- `payment_method`: Method used (check, transfer, etc.)
- `amount`: Total payment amount
- `currency`: Currency code
- `status`: Payment status
- `reference_number`: External reference (check number, etc.)
- `is_reconciled`: Boolean
- `created_at`: Timestamp

**Performance:**
- Use select_related for vendor, currency
- No nested allocations (use detail view)
- Lightweight for pagination

#### VendorPaymentDetailSerializer

**Purpose**: Complete payment information

**Additional Fields:**
- `allocations`: Nested payment allocation details
- `unallocated_amount`: Amount not yet allocated
- `payment_account`: Bank/cash account used
- `exchange_rate`: For foreign currency payments
- `exchange_date`: Date of exchange rate
- `notes`: Payment notes
- `attachments`: Related documents (receipts, etc.)
- `reconciliation_date`: When reconciled
- `reconciliation_reference`: Reconciliation batch reference
- `created_by`: User who created payment
- `approved_by`: User who approved payment

**Nested Serializers:**
- `PaymentAllocationSerializer` (many=True)
- `VendorBasicSerializer` (read-only)
- `PaymentAccountSerializer` (read-only)
- `AttachmentSerializer` (many=True)

#### VendorPaymentWriteSerializer

**Purpose**: Create and update operations

**Behavior:**
- Accept nested allocations
- Validate total allocations <= payment amount
- Support unallocated payments (credit on account)
- Calculate remaining balance
- Handle multi-currency payments

### Field Validation

#### payment_number

**Validation:**
- If provided, must be unique within tenant
- Match configured format pattern
- If auto-generated, ensure sequence integrity

**Format Examples:**
- `PAY-{year}-{sequence}`: PAY-2026-00001
- `{vendor_code}-PAY-{sequence}`: V001-PAY-00123

**Error Messages:**
- "Payment number already exists"
- "Invalid payment number format"

#### vendor

**Validation:**
- Must be valid active vendor
- Vendor must have outstanding bills (or allow credit payments)
- Check for credit hold status

**Error Messages:**
- "Invalid vendor"
- "Vendor is inactive"
- "No outstanding bills for this vendor"

#### payment_date

**Validation:**
- Cannot be in future (configurable)
- Cannot be before bill date of allocated bills
- Must be within open accounting period

**Business Rules:**
- Default to today if not provided
- Use tenant timezone
- Validate against fiscal calendar

**Error Messages:**
- "Payment date cannot be in the future"
- "Payment date is before bill date"
- "Accounting period is closed for this date"

#### payment_method

**Validation:**
- Must be valid payment method from choices
- Payment method must be active
- Payment method must be allowed for vendor payments

**Choices:**
- `CASH`: Cash payment
- `CHECK`: Check/Cheque
- `BANK_TRANSFER`: Bank transfer/wire
- `ACH`: ACH/Direct debit
- `CREDIT_CARD`: Credit card
- `DEBIT_CARD`: Debit card
- `ONLINE`: Online payment portal
- `OTHER`: Other method

**Method-Specific Requirements:**
- **CHECK**: Requires check_number
- **BANK_TRANSFER**: Requires reference_number
- **CREDIT_CARD**: May require last 4 digits

**Error Messages:**
- "Invalid payment method"
- "Payment method is not active"
- "Check number required for check payments"

#### amount

**Validation:**
- Must be positive
- Cannot exceed configured maximum payment amount
- Should not exceed total outstanding for vendor (warning)
- Precision based on currency

**Business Rules:**
- Allow overpayment (creates vendor credit)
- Require approval for payments above threshold
- Validate against available funds (optional)

**Error Messages:**
- "Payment amount must be positive"
- "Payment amount exceeds maximum allowed"
- "Insufficient funds in payment account" (if checking)

#### currency

**Validation:**
- Must be valid active currency
- Should match vendor's currency preference
- If different from payment account currency, exchange rate required

**Multi-Currency Handling:**
- Store payment in original currency
- Store payment in base currency
- Track exchange rate and date
- Validate exchange rates against acceptable range

**Error Messages:**
- "Invalid currency code"
- "Exchange rate required for foreign currency payment"
- "Exchange rate is outside acceptable range"

#### payment_account

**Validation:**
- Must be valid bank or cash account
- Account must be active
- Account must have sufficient balance (optional check)
- Account currency must match payment currency (or conversion allowed)

**Account Types:**
- Bank account: Checking, savings
- Cash account: Petty cash, cash on hand
- Credit card account: Corporate card

**Error Messages:**
- "Invalid payment account"
- "Payment account is inactive"
- "Account currency does not match payment currency"

#### status

**Validation:**
- Must be valid status from PAYMENT_STATUS_CHOICES
- Status transitions must follow workflow

**Status Options:**
- `DRAFT`: Being prepared
- `PENDING_APPROVAL`: Awaiting approval
- `APPROVED`: Approved, ready to process
- `PROCESSED`: Payment executed
- `RECONCILED`: Matched with bank statement
- `CANCELLED`: Cancelled
- `FAILED`: Payment failed

**Allowed Transitions:**
- `DRAFT` → `PENDING_APPROVAL`, `CANCELLED`
- `PENDING_APPROVAL` → `APPROVED`, `CANCELLED`
- `APPROVED` → `PROCESSED`, `CANCELLED`
- `PROCESSED` → `RECONCILED`, `FAILED`
- `RECONCILED` → (terminal state)
- `FAILED` → `DRAFT` (retry)

**Error Messages:**
- "Invalid status transition"
- "Payment cannot be modified after reconciliation"

#### reference_number

**Validation:**
- Required for certain payment methods
- Must be unique for check payments (per account)
- Format validation based on payment method

**Examples:**
- Check number: "12345"
- Wire reference: "WIRE-2026-001"
- ACH trace number: "123456789012345"

**Error Messages:**
- "Reference number required for this payment method"
- "Check number already used"

### Payment Allocation Handling

#### PaymentAllocationSerializer

**Purpose**: Track which bills this payment applies to

**Fields:**
- `id`: UUID
- `bill`: Reference to VendorBill
- `amount`: Amount allocated to this bill
- `allocation_date`: When allocated
- `notes`: Allocation notes

**Validation:**
- Bill must belong to same vendor as payment
- Bill must be in approved or partially_paid status
- Allocation amount must be positive
- Allocation cannot exceed bill's outstanding amount
- Sum of allocations cannot exceed payment amount

**Error Messages:**
- "Bill does not belong to this vendor"
- "Bill is not in payable status"
- "Allocation exceeds outstanding bill amount"
- "Total allocations exceed payment amount"

#### Auto-Allocation Logic

**When Payment Created Without Allocations:**

**Strategy 1: Oldest First**
1. Get all outstanding bills for vendor
2. Sort by due_date ascending (oldest first)
3. Allocate payment to bills in order
4. Continue until payment fully allocated

**Strategy 2: Overdue Priority**
1. Get all overdue bills first
2. Sort by days overdue descending
3. Allocate to overdue bills
4. Then allocate to non-overdue bills by due date

**Strategy 3: Manual**
1. Do not auto-allocate
2. Leave as unallocated payment (credit on account)
3. User must manually allocate later

**Configuration:**
- Setting: `VENDOR_PAYMENT_AUTO_ALLOCATION_STRATEGY`
- Options: `oldest_first`, `overdue_priority`, `manual`, `none`

#### Partial Allocation

**Scenario**: Payment amount doesn't fully cover any single bill

**Handling:**
- Allow partial allocation to one or more bills
- Track remaining outstanding per bill
- Update bill status to `PARTIALLY_PAID`
- Allow multiple payments to same bill

**Example:**
- Bill total: $1,000
- Payment 1: $300 → Bill outstanding: $700
- Payment 2: $500 → Bill outstanding: $200
- Payment 3: $200 → Bill fully paid

#### Unallocated Payments

**Purpose**: Payment without specific bill allocation

**Use Cases:**
- Advance payment (payment before bill received)
- Credit on account
- Deposit
- Prepayment

**Handling:**
- Store payment with allocations = []
- Track unallocated_amount = payment.amount
- Allow allocation to future bills
- Show as vendor credit in reports

**Allocation Later:**
- Provide action to allocate to specific bill
- Auto-apply to next bill (optional)
- Apply when new bill created (optional)

### Multi-Currency Payment Handling

#### Exchange Rate Management

**Exchange Rate Fields:**
- `exchange_rate`: Conversion rate
- `exchange_date`: Date of rate
- `base_currency_amount`: Converted amount
- `exchange_rate_source`: Where rate came from

**Validation:**
- Exchange rate required if payment currency ≠ base currency
- Exchange rate must be positive
- Exchange rate within acceptable range (e.g., ±10% of official rate)
- Exchange date should be close to payment date

**Rate Sources:**
- Manual entry
- API lookup (live rates)
- Tenant configured rates
- Bank provided rates

**Error Messages:**
- "Exchange rate required for foreign currency payment"
- "Exchange rate is outside acceptable range"
- "Exchange date differs significantly from payment date"

#### Currency Conversion

**Process:**
1. Validate payment currency
2. Get exchange rate
3. Convert to base currency: `base_amount = amount × exchange_rate`
4. Store both amounts
5. When allocating, convert bill amounts to payment currency

**Allocation Across Currencies:**
- Payment in USD, Bill in LKR
- Convert using exchange rate
- Track conversion for each allocation
- Store both original and converted amounts

### Reconciliation Integration

#### Reconciliation Fields

**Fields:**
- `is_reconciled`: Boolean flag
- `reconciliation_date`: When reconciled
- `reconciliation_reference`: Bank statement reference
- `reconciliation_batch`: Link to reconciliation batch
- `bank_transaction_id`: Matching bank transaction

**Reconciliation Process:**
1. Import bank statement
2. Match payments to bank transactions
3. Mark as reconciled
4. Lock payment from modification

**Validation:**
- Only PROCESSED payments can be reconciled
- Reconciliation date must be >= payment_date
- Cannot un-reconcile without special permission

**Error Messages:**
- "Payment must be processed before reconciliation"
- "Cannot modify reconciled payment"

#### Bank Statement Matching

**Matching Criteria:**
- Amount matches (within tolerance)
- Date matches (within date range)
- Reference number matches
- Vendor name matches

**Fuzzy Matching:**
- Allow slight amount differences (e.g., ±$1 for fees)
- Allow date range (e.g., ±3 days)
- Partial reference number match

**Manual Matching:**
- User can manually match payment to transaction
- Require confirmation
- Store match reason

### Method Fields

#### get_unallocated_amount

**Calculation:**
```
unallocated_amount = amount - SUM(allocations.amount)
```

**Return:**
- Decimal value
- 0 if fully allocated
- Positive if some amount unallocated

#### get_allocated_bills

**Purpose**: List of bills this payment is allocated to

**Return:**
- Array of bill objects with bill_number and allocated_amount
- Sorted by allocation date

**Example:**
```
[
  {
    "bill_id": "uuid",
    "bill_number": "BILL-2026-001",
    "allocated_amount": "500.00"
  },
  {
    "bill_id": "uuid",
    "bill_number": "BILL-2026-002",
    "allocated_amount": "300.00"
  }
]
```

#### get_payment_status_display

**Purpose**: Human-readable payment status

**Return:**
- "Draft", "Pending Approval", "Approved", "Processed", "Reconciled"
- Include additional context if relevant
- "Processed - Not Reconciled" if processed but not reconciled

#### get_reconciliation_status

**Purpose**: Detailed reconciliation status

**Return:**
- "Not Reconciled"
- "Reconciled - [date]"
- "Partially Reconciled" (if partial match)
- "Reconciliation Failed"

### Nested Allocations Create/Update

#### Create Payment with Allocations

**Request Structure:**
```
{
  "vendor": "vendor-uuid",
  "payment_date": "2026-01-15",
  "payment_method": "BANK_TRANSFER",
  "amount": "1500.00",
  "currency": "USD",
  "payment_account": "account-uuid",
  "allocations": [
    {
      "bill": "bill-uuid-1",
      "amount": "1000.00"
    },
    {
      "bill": "bill-uuid-2",
      "amount": "500.00"
    }
  ]
}
```

**Validation Steps:**
1. Validate payment-level data
2. Validate each allocation
3. Verify sum of allocations = payment amount (or allow difference)
4. Verify each bill belongs to vendor
5. Verify each bill has sufficient outstanding amount
6. Create payment
7. Create allocations
8. Update bill outstanding amounts
9. Update bill statuses

**Transaction Handling:**
- All operations in single database transaction
- If any step fails, rollback all
- Provide detailed error for each validation failure

#### Update Payment Allocations

**Scenarios:**

**Scenario 1: Add New Allocation**
- Payment has unallocated amount
- Add allocation to new bill
- Reduce unallocated amount

**Scenario 2: Modify Allocation**
- Change amount allocated to specific bill
- Re-validate total allocations
- Update bill outstanding amounts

**Scenario 3: Remove Allocation**
- Delete allocation
- Increase unallocated amount
- Update bill outstanding amount
- Update bill status if needed

**Restrictions:**
- Cannot modify allocations after reconciliation
- Cannot remove allocations if bill is paid
- Require approval for allocation changes above threshold

---

## Task 84: VendorBillViewSet CRUD Operations

### Objective

Implement comprehensive ViewSet for VendorBill with full CRUD operations, proper permissions, multi-tenancy support, and error handling.

### ViewSet Configuration

#### Base Configuration

**Inheritance:**
- Extend `viewsets.ModelViewSet` from DRF
- Mixin order: List, Create, Retrieve, Update, Destroy
- Optional: Extend custom base viewset for common functionality

**Essential Attributes:**
- `queryset`: Base queryset for VendorBill
- `serializer_class`: Default serializer (VendorBillDetailSerializer)
- `permission_classes`: List of permission classes
- `authentication_classes`: List of authentication methods
- `filter_backends`: List of filter backends
- `pagination_class`: Pagination configuration
- `lookup_field`: Primary key field (default: 'pk')

**Multi-Tenancy:**
- Override `get_queryset()` to filter by tenant
- Extract tenant from request (middleware or JWT)
- Apply tenant filter to all queries
- Prevent cross-tenant data access

### CRUD Operations

#### Create (POST /api/vendor-bills/)

**Purpose**: Create new vendor bill

**Process Flow:**
1. Receive request data
2. Validate request user has `add_vendorbill` permission
3. Extract and validate data using serializer
4. Set tenant from request context
5. Set created_by from request user
6. Validate nested line items
7. Calculate totals
8. Create VendorBill instance
9. Create BillLineItem instances
10. Return serialized response with 201 status

**Serializer Selection:**
- Use `VendorBillCreateUpdateSerializer` for create
- Use `get_serializer_class()` to return appropriate serializer

**Validation:**
- Run serializer validation
- Run custom validation in `perform_create()`
- Check business rules (e.g., vendor credit limit)

**Response:**
- 201 Created on success
- Return full serialized bill with nested line items
- Include location header with bill URL

**Error Handling:**
- 400 Bad Request: Validation errors
- 403 Forbidden: Permission denied
- 500 Internal Server Error: Unexpected errors

**Example Success Response:**
```
HTTP/1.1 201 Created
Location: /api/vendor-bills/{bill_id}/
Content-Type: application/json

{
  "id": "uuid",
  "bill_number": "BILL-2026-001",
  "vendor": {...},
  "line_items": [...],
  ...
}
```

#### Retrieve (GET /api/vendor-bills/{id}/)

**Purpose**: Get single bill details

**Process Flow:**
1. Receive bill ID
2. Validate user has `view_vendorbill` permission
3. Get bill from database (filtered by tenant)
4. Serialize with detail serializer
5. Return 200 response

**Optimizations:**
- Use `select_related()` for vendor, currency, tenant
- Use `prefetch_related()` for line_items, payments, attachments
- Minimize database queries

**Response:**
- 200 OK: Bill found and returned
- 404 Not Found: Bill doesn't exist or wrong tenant

**Caching:**
- Consider caching for frequently accessed bills
- Invalidate cache on update
- Cache key includes tenant ID

#### List (GET /api/vendor-bills/)

**Purpose**: Get list of bills with filtering and pagination

**Process Flow:**
1. Receive request with optional filters
2. Validate user has `view_vendorbill` permission
3. Apply tenant filter
4. Apply additional filters (status, vendor, date range)
5. Apply ordering
6. Paginate results
7. Serialize with list serializer
8. Return paginated response

**Queryset Optimizations:**
- Select only needed fields for list view
- Use `select_related()` for foreign keys
- Use `prefetch_related()` for reverse relations
- Use `annotate()` for calculated fields

**Pagination:**
- Default page size: 25 (configurable)
- Max page size: 100
- Support page number or cursor pagination
- Include page count and total count in response

**Response:**
- 200 OK with paginated results

**Example Response:**
```
{
  "count": 150,
  "next": "/api/vendor-bills/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "bill_number": "BILL-2026-001",
      ...
    },
    ...
  ]
}
```

#### Update (PUT/PATCH /api/vendor-bills/{id}/)

**Purpose**: Update existing bill

**Process Flow:**
1. Receive bill ID and update data
2. Validate user has `change_vendorbill` permission
3. Get existing bill (filtered by tenant)
4. Validate bill is editable (status check)
5. Validate and deserialize update data
6. Update bill and related line items
7. Recalculate totals if needed
8. Return updated bill

**PUT vs PATCH:**
- **PUT**: Full replacement, all fields required
- **PATCH**: Partial update, only changed fields

**Serializer Selection:**
- Use `VendorBillCreateUpdateSerializer` for updates

**Status-Based Restrictions:**
- **DRAFT**: All fields editable
- **PENDING_APPROVAL**: Limited fields editable
- **APPROVED**: Very limited (dates, notes only)
- **PAID**: No edits (or very specific fields with approval)
- **CANCELLED**: Read-only

**Line Items Update:**
- Support adding new line items
- Support updating existing line items (by ID)
- Support removing line items (explicit delete or omit)
- Recalculate totals after line item changes

**Response:**
- 200 OK: Update successful
- 400 Bad Request: Validation errors
- 403 Forbidden: Permission denied or bill not editable
- 404 Not Found: Bill not found

#### Delete (DELETE /api/vendor-bills/{id}/)

**Purpose**: Delete bill (soft delete preferred)

**Process Flow:**
1. Receive bill ID
2. Validate user has `delete_vendorbill` permission
3. Get bill (filtered by tenant)
4. Validate bill is deletable (status check)
5. Perform soft delete (set is_deleted=True) or hard delete
6. Return 204 No Content

**Soft Delete vs Hard Delete:**
- **Soft Delete** (Recommended):
  - Set `is_deleted = True`
  - Set `deleted_at = now()`
  - Set `deleted_by = request.user`
  - Keep in database for audit
  - Exclude from normal queries
- **Hard Delete**:
  - Only for DRAFT bills
  - Permanent removal
  - Cascading delete of line items

**Status-Based Restrictions:**
- **DRAFT**: Can be deleted (soft or hard)
- **PENDING_APPROVAL**: Can be cancelled (soft delete)
- **APPROVED**: Cannot be deleted (must cancel first)
- **PAID**: Cannot be deleted (immutable)
- **CANCELLED**: Already soft deleted

**Response:**
- 204 No Content: Delete successful
- 403 Forbidden: Bill cannot be deleted
- 404 Not Found: Bill not found

**Alternative: Cancel Action**
- Provide custom action `cancel` instead of delete
- Updates status to CANCELLED
- More explicit than soft delete

### Permission Handling

#### Permission Classes

**Standard DRF Permissions:**
- `IsAuthenticated`: User must be logged in
- `DjangoModelPermissions`: Check model-level permissions
- `DjangoObjectPermissions`: Check object-level permissions

**Custom Permissions:**
- `TenantPermission`: Verify user belongs to bill's tenant
- `BillEditPermission`: Check if bill is editable based on status
- `BillApprovalPermission`: Check if user can approve bills
- `AmountThresholdPermission`: Check if bill amount requires special approval

**Permission Combination:**
```
permission_classes = [
    IsAuthenticated,
    TenantPermission,
    DjangoModelPermissions,
    BillEditPermission
]
```

#### Model Permissions

**Required Permissions:**
- `vendor_bills.add_vendorbill`: Create bills
- `vendor_bills.view_vendorbill`: View bills
- `vendor_bills.change_vendorbill`: Edit bills
- `vendor_bills.delete_vendorbill`: Delete bills
- `vendor_bills.approve_vendorbill`: Approve bills (custom)
- `vendor_bills.manage_all_bills`: See all bills (admin)

**Permission Checks in ViewSet:**
- Override `check_permissions()` for custom logic
- Override `check_object_permissions()` for object-level checks
- Use `@permission_classes()` decorator on actions

#### Object-Level Permissions

**Scenarios:**
- User can only edit their own bills
- Managers can edit bills in their department
- Admins can edit all bills

**Implementation:**
- Check bill.created_by == request.user
- Check bill.department in user.departments
- Check user role is admin

**Example:**
```python
def get_queryset(self):
    queryset = super().get_queryset()
    user = self.request.user
    
    if user.is_admin:
        return queryset
    elif user.is_manager:
        return queryset.filter(department__in=user.departments)
    else:
        return queryset.filter(created_by=user)
```

### Multi-Tenancy Implementation

#### Tenant Isolation

**Requirement**: Users can only access bills within their tenant

**Implementation Approach:**

**Option 1: Queryset Filtering**
```python
def get_queryset(self):
    tenant = self.request.tenant  # From middleware or JWT
    return VendorBill.objects.filter(tenant=tenant)
```

**Option 2: Manager Method**
```python
# In model manager
def for_tenant(self, tenant):
    return self.filter(tenant=tenant)

# In viewset
def get_queryset(self):
    return VendorBill.objects.for_tenant(self.request.tenant)
```

**Option 3: Middleware**
- Middleware sets tenant on request
- QuerySet automatically filtered by custom manager
- Most transparent approach

#### Tenant Assignment on Create

**Process:**
```python
def perform_create(self, serializer):
    tenant = self.request.tenant
    serializer.save(
        tenant=tenant,
        created_by=self.request.user
    )
```

**Validation:**
- Ensure related objects (vendor, products) belong to same tenant
- Prevent cross-tenant references

#### Tenant Validation

**Custom Validator:**
```python
def validate_vendor(self, vendor):
    if vendor.tenant != self.request.tenant:
        raise ValidationError("Vendor does not belong to your tenant")
    return vendor
```

### Error Handling

#### Exception Handler

**DRF Default Handler:**
- Handles standard exceptions (ValidationError, PermissionDenied, etc.)
- Returns JSON error responses

**Custom Exception Handler:**
- Extend default handler for custom exceptions
- Add tenant context to errors
- Log errors for monitoring
- Return consistent error format

**Custom Exceptions:**
- `BillNotEditableException`: Bill status prevents editing
- `InsufficientPermissionException`: User lacks required permission
- `TenantMismatchException`: Cross-tenant access attempt
- `BillCalculationException`: Error in total calculations

#### Error Response Format

**Standard Format:**
```
{
  "error": {
    "code": "validation_error",
    "message": "Invalid data provided",
    "details": {
      "bill_date": ["Bill date cannot be in the future"],
      "line_items": [
        {
          "line_number": 1,
          "quantity": ["Quantity must be positive"]
        }
      ]
    }
  }
}
```

**HTTP Status Codes:**
- 400: Validation errors, bad request
- 401: Authentication required
- 403: Permission denied
- 404: Resource not found
- 409: Conflict (e.g., concurrent update)
- 422: Unprocessable entity (semantic errors)
- 500: Server error

#### Validation Error Handling

**Field Errors:**
- Clear field name
- Human-readable message
- Suggestion for fix (when possible)

**Non-Field Errors:**
- General errors not tied to specific field
- Business rule violations

**Nested Object Errors:**
- Include object context (e.g., line item number)
- Preserve hierarchy in error structure

### Serializer Selection

#### get_serializer_class()

**Purpose**: Return appropriate serializer based on action

**Implementation:**
```python
def get_serializer_class(self):
    if self.action == 'list':
        return VendorBillListSerializer
    elif self.action in ['create', 'update', 'partial_update']:
        return VendorBillCreateUpdateSerializer
    elif self.action == 'retrieve':
        return VendorBillDetailSerializer
    return VendorBillDetailSerializer  # default
```

**Benefits:**
- Optimize payload size for list views
- Use detailed serializer only when needed
- Custom serializers for specific actions

#### Dynamic Serializer Fields

**Use Case**: Different users see different fields

**Implementation:**
- Override `get_serializer_context()`
- Pass user role, permissions to serializer
- Serializer conditionally includes fields

**Example:**
- Basic users: See limited fields
- Managers: See all fields including costs
- Admins: See all fields including audit trails

---

## Task 85: Filtering and Search Implementation

### Objective

Implement comprehensive filtering, searching, and ordering capabilities for vendor bills using django-filter, DRF search, and custom filter backends.

### Filter Backend Configuration

#### DjangoFilterBackend

**Installation:**
```
pip install django-filter
```

**ViewSet Configuration:**
```python
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class VendorBillViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VendorBillFilter
    search_fields = ['bill_number', 'vendor__name', 'reference_number']
    ordering_fields = ['bill_date', 'due_date', 'total_amount', 'status']
    ordering = ['-bill_date']  # default ordering
```

### Filter Classes

#### VendorBillFilter

**Purpose**: Define filterable fields and custom filters

**Basic Filters:**

**Exact Matches:**
- `vendor`: Filter by vendor ID
- `status`: Filter by status (draft, approved, etc.)
- `currency`: Filter by currency code
- `is_overdue`: Filter overdue bills (boolean)

**Range Filters:**
- `bill_date__gte`: Bills on or after date
- `bill_date__lte`: Bills on or before date
- `due_date__gte`: Due on or after date
- `due_date__lte`: Due on or before date
- `total_amount__gte`: Amount greater than or equal
- `total_amount__lte`: Amount less than or equal

**Choice Filters:**
- `status__in`: Filter by multiple statuses (comma-separated)
- `payment_terms`: Filter by payment terms

**Boolean Filters:**
- `is_overdue`: True/False
- `has_attachments`: True/False
- `is_approved`: True/False

**Custom Filters:**
- `vendor_name`: Filter by vendor name (icontains)
- `date_range`: Custom date range filter
- `amount_range`: Custom amount range filter
- `outstanding_balance`: Filter by outstanding amount

#### Filter Implementation Examples

**Date Range Filter:**
```python
class DateRangeFilter(django_filters.Filter):
    """
    Custom filter for date ranges
    Accepts: 'today', 'this_week', 'this_month', 'last_month', etc.
    """
    def filter(self, qs, value):
        if not value:
            return qs
        
        today = timezone.now().date()
        
        if value == 'today':
            return qs.filter(bill_date=today)
        elif value == 'this_week':
            start = today - timedelta(days=today.weekday())
            return qs.filter(bill_date__gte=start, bill_date__lte=today)
        elif value == 'this_month':
            return qs.filter(
                bill_date__year=today.year,
                bill_date__month=today.month
            )
        # ... more options
        
        return qs
```

**Outstanding Balance Filter:**
```python
class OutstandingBalanceFilter(django_filters.NumberFilter):
    """
    Filter bills by outstanding balance
    Supports: exact, gt, gte, lt, lte
    """
    def filter(self, qs, value):
        if value is None:
            return qs
        
        # Annotate queryset with outstanding balance
        qs = qs.annotate(
            outstanding=F('total_amount') - Coalesce(
                Sum('payment_allocations__amount'),
                Decimal('0.00')
            )
        )
        
        lookup = self.lookup_expr or 'exact'
        return qs.filter(**{f'outstanding__{lookup}': value})
```

**Vendor Name Filter:**
```python
class VendorNameFilter(django_filters.CharFilter):
    """
    Filter by vendor name (case-insensitive partial match)
    """
    def filter(self, qs, value):
        if not value:
            return qs
        return qs.filter(vendor__name__icontains=value)
```

### Search Implementation

#### SearchFilter Configuration

**Purpose**: Enable full-text search across multiple fields

**Search Fields:**
- `bill_number`: Bill reference number
- `vendor__name`: Vendor name
- `vendor__code`: Vendor code
- `reference_number`: External reference
- `notes`: Bill notes
- `line_items__description`: Line item descriptions

**ViewSet Configuration:**
```python
from rest_framework.filters import SearchFilter

class VendorBillViewSet(viewsets.ModelViewSet):
    filter_backends = [SearchFilter]
    search_fields = [
        'bill_number',
        'vendor__name',
        'vendor__code',
        'reference_number',
        'notes',
        'line_items__description'
    ]
```

**Search Syntax:**

**Basic Search:**
```
GET /api/vendor-bills/?search=ABC Corp
```
Searches all configured fields for "ABC Corp"

**Exact Match:**
```
GET /api/vendor-bills/?search="BILL-2026-001"
```
Exact match for bill number

**Multiple Terms:**
```
GET /api/vendor-bills/?search=ABC urgent
```
Both terms must be present (AND logic)

#### Advanced Search Options

**Field-Specific Search:**
```python
search_fields = [
    '=bill_number',  # Exact match
    '^vendor__name',  # Starts with
    '@notes',  # Full-text search (PostgreSQL)
    'reference_number'  # Default: icontains
]
```

**Prefix Meanings:**
- `^`: Starts-with search
- `=`: Exact matches
- `@`: Full-text search (requires database support)
- `$`: Regex search (use with caution)
- No prefix: Default (icontains)

**Custom Search Filter:**
```python
class VendorBillSearchFilter(SearchFilter):
    """
    Custom search with additional logic
    """
    def filter_queryset(self, request, queryset, view):
        search_term = request.query_params.get('search', '')
        
        # Check if search term is a bill number pattern
        if re.match(r'^BILL-\d{4}-\d+$', search_term):
            return queryset.filter(bill_number=search_term)
        
        # Check if search term is a vendor code
        if re.match(r'^V\d{3,}$', search_term):
            return queryset.filter(vendor__code=search_term)
        
        # Default search behavior
        return super().filter_queryset(request, queryset, view)
```

### Ordering Implementation

#### OrderingFilter Configuration

**Purpose**: Allow client to specify sort order

**Orderable Fields:**
- `bill_date`: Sort by bill date
- `due_date`: Sort by due date
- `total_amount`: Sort by total amount
- `outstanding_amount`: Sort by outstanding balance
- `status`: Sort by status
- `vendor__name`: Sort by vendor name
- `created_at`: Sort by creation date

**ViewSet Configuration:**
```python
from rest_framework.filters import OrderingFilter

class VendorBillViewSet(viewsets.ModelViewSet):
    filter_backends = [OrderingFilter]
    ordering_fields = [
        'bill_date',
        'due_date',
        'total_amount',
        'status',
        'vendor__name',
        'created_at'
    ]
    ordering = ['-bill_date']  # default: newest first
```

**Usage:**
```
GET /api/vendor-bills/?ordering=bill_date
```
Sort ascending by bill date

```
GET /api/vendor-bills/?ordering=-due_date
```
Sort descending by due date

```
GET /api/vendor-bills/?ordering=vendor__name,bill_date
```
Sort by vendor name, then bill date

#### Custom Ordering

**Annotated Fields:**
```python
def get_queryset(self):
    queryset = super().get_queryset()
    
    # Add computed fields for ordering
    queryset = queryset.annotate(
        outstanding_amount=F('total_amount') - Coalesce(
            Sum('payment_allocations__amount'),
            Decimal('0.00')
        ),
        days_overdue=Case(
            When(
                due_date__lt=timezone.now().date(),
                then=timezone.now().date() - F('due_date')
            ),
            default=0,
            output_field=IntegerField()
        )
    )
    
    return queryset
```

**Allow Ordering by Computed Fields:**
```python
ordering_fields = [
    'bill_date',
    'outstanding_amount',  # computed
    'days_overdue'  # computed
]
```

### Combined Filtering Examples

#### Example 1: Overdue Bills for Specific Vendor

**Request:**
```
GET /api/vendor-bills/?vendor=vendor-uuid&is_overdue=true&ordering=-days_overdue
```

**Result:**
- Filter by vendor
- Only overdue bills
- Sorted by most overdue first

#### Example 2: High-Value Approved Bills This Month

**Request:**
```
GET /api/vendor-bills/?status=approved&total_amount__gte=10000&bill_date__gte=2026-01-01&bill_date__lte=2026-01-31&ordering=-total_amount
```

**Result:**
- Approved bills
- Amount >= $10,000
- Billed in January 2026
- Sorted by highest amount first

#### Example 3: Search with Filters

**Request:**
```
GET /api/vendor-bills/?search=ABC Corp&status__in=draft,pending_approval&ordering=bill_date
```

**Result:**
- Search for "ABC Corp" in vendor name and other fields
- Status is draft or pending approval
- Sorted by bill date (oldest first)

### Performance Optimization

#### Query Optimization

**Select Related:**
```python
def get_queryset(self):
    queryset = super().get_queryset()
    return queryset.select_related(
        'vendor',
        'currency',
        'created_by',
        'tenant'
    )
```

**Prefetch Related:**
```python
def get_queryset(self):
    queryset = super().get_queryset()
    return queryset.prefetch_related(
        'line_items',
        'line_items__product',
        'payment_allocations',
        'attachments'
    )
```

**Conditional Prefetch:**
```python
def get_queryset(self):
    queryset = super().get_queryset()
    
    # Only prefetch line items for detail view
    if self.action == 'retrieve':
        queryset = queryset.prefetch_related('line_items')
    
    return queryset
```

#### Database Indexes

**Recommended Indexes:**
- `vendor_id`: For vendor filtering
- `status`: For status filtering
- `bill_date`: For date filtering and ordering
- `due_date`: For overdue checks
- `tenant_id, bill_date`: Compound index for multi-tenancy
- `tenant_id, vendor_id, status`: For common filter combinations

**Index Creation:**
```python
class Meta:
    indexes = [
        models.Index(fields=['vendor', 'status']),
        models.Index(fields=['tenant', 'bill_date']),
        models.Index(fields=['due_date', 'status']),
        models.Index(fields=['-bill_date']),  # For DESC ordering
    ]
```

#### Pagination

**Purpose**: Limit result set size for performance

**Pagination Classes:**

**PageNumberPagination:**
```python
class VendorBillPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100
```

**CursorPagination:**
```python
class VendorBillCursorPagination(CursorPagination):
    page_size = 25
    ordering = '-bill_date'
    cursor_query_param = 'cursor'
```

**Configuration:**
```python
class VendorBillViewSet(viewsets.ModelViewSet):
    pagination_class = VendorBillPagination
```

---

## Task 86: Custom ViewSet Actions

### Objective

Implement custom actions for vendor bill workflows including approval, rejection, payment marking, duplication, and bulk operations.

### Custom Action Decorator

**DRF @action Decorator:**
```python
from rest_framework.decorators import action
from rest_framework.response import Response

@action(detail=True, methods=['post'])
def approve(self, request, pk=None):
    """Approve vendor bill"""
    pass
```

**Parameters:**
- `detail`: True for single object actions, False for collection actions
- `methods`: HTTP methods allowed (post, get, put, etc.)
- `url_path`: Custom URL path (default: function name)
- `url_name`: Name for URL reversing
- `permission_classes`: Override default permissions
- `serializer_class`: Custom serializer for this action

### Approval Workflow Actions

#### approve

**Purpose**: Approve a pending vendor bill

**Configuration:**
```python
@action(
    detail=True,
    methods=['post'],
    permission_classes=[IsAuthenticated, CanApproveBills],
    url_path='approve'
)
def approve(self, request, pk=None):
    """
    Approve vendor bill
    
    Transitions bill from PENDING_APPROVAL to APPROVED
    Records approver and timestamp
    Triggers notifications
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/approve/`

**Request Body:**
```
{
  "notes": "Approved for payment",
  "approval_level": 1  # if multi-level approval
}
```

**Process:**
1. Get bill instance
2. Validate bill is in PENDING_APPROVAL status
3. Validate user has approval permission
4. Check approval limits (amount thresholds)
5. Create approval record
6. Update bill status to APPROVED
7. Set approved_by and approved_at
8. Trigger notifications (email to requestor, finance team)
9. Log action in audit trail
10. Return updated bill

**Validation:**
- Bill must be in PENDING_APPROVAL status
- User must have approval permission
- If multi-level approval, check current approval level
- If amount-based approval, check user's approval limit
- Cannot approve own bill (configurable)

**Response:**
```
HTTP 200 OK
{
  "message": "Bill approved successfully",
  "bill": {
    "id": "uuid",
    "bill_number": "BILL-2026-001",
    "status": "approved",
    "approved_by": "John Doe",
    "approved_at": "2026-01-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: Bill not in pending approval status
- 403: User cannot approve this bill
- 404: Bill not found

#### reject

**Purpose**: Reject a pending vendor bill

**Configuration:**
```python
@action(
    detail=True,
    methods=['post'],
    permission_classes=[IsAuthenticated, CanApproveBills]
)
def reject(self, request, pk=None):
    """
    Reject vendor bill
    
    Transitions bill to REJECTED status
    Requires rejection reason
    Notifies bill creator
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/reject/`

**Request Body:**
```
{
  "reason": "Incorrect pricing, please review and resubmit",
  "rejection_type": "pricing_error"  # Optional categorization
}
```

**Process:**
1. Get bill instance
2. Validate bill is in PENDING_APPROVAL status
3. Validate rejection reason is provided
4. Create rejection record with reason
5. Update bill status to REJECTED
6. Set rejected_by and rejected_at
7. Notify bill creator
8. Allow creator to edit and resubmit
9. Return response

**Validation:**
- Bill must be in PENDING_APPROVAL status
- Rejection reason is required (minimum length)
- User must have approval permission

**Response:**
```
HTTP 200 OK
{
  "message": "Bill rejected",
  "bill": {
    "id": "uuid",
    "status": "rejected",
    "rejected_by": "Jane Smith",
    "rejected_at": "2026-01-15T11:00:00Z",
    "rejection_reason": "Incorrect pricing..."
  }
}
```

#### request_approval

**Purpose**: Submit draft bill for approval

**Configuration:**
```python
@action(detail=True, methods=['post'])
def request_approval(self, request, pk=None):
    """
    Submit bill for approval
    
    Transitions from DRAFT to PENDING_APPROVAL
    Assigns to appropriate approver
    Triggers approval workflow
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/request_approval/`

**Request Body:**
```
{
  "notes": "Please review and approve",
  "urgency": "normal"  # normal, high, urgent
}
```

**Process:**
1. Get bill instance
2. Validate bill is in DRAFT status
3. Validate bill has all required data
4. Validate bill totals are correct
5. Update status to PENDING_APPROVAL
6. Assign to appropriate approver (based on amount, department, etc.)
7. Send notification to approver
8. Return response

**Validation:**
- Bill must be in DRAFT status
- Bill must have at least one line item
- All required fields must be filled
- Totals must be calculated and valid
- Vendor must be active

**Approver Assignment Logic:**
- Based on bill amount (approval limits by role)
- Based on department (department managers)
- Based on project (project approvers)
- Round-robin or workload-based assignment

**Response:**
```
HTTP 200 OK
{
  "message": "Bill submitted for approval",
  "bill": {
    "id": "uuid",
    "status": "pending_approval",
    "assigned_approver": "Manager Name",
    "submitted_at": "2026-01-15T09:00:00Z"
  }
}
```

### Payment Actions

#### mark_as_paid

**Purpose**: Mark bill as fully paid (manual override)

**Configuration:**
```python
@action(
    detail=True,
    methods=['post'],
    permission_classes=[IsAuthenticated, CanMarkPaid]
)
def mark_as_paid(self, request, pk=None):
    """
    Manually mark bill as paid
    
    Use when payment processed outside system
    Requires payment details
    Updates outstanding balance to zero
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/mark_as_paid/`

**Request Body:**
```
{
  "payment_date": "2026-01-15",
  "payment_method": "BANK_TRANSFER",
  "payment_reference": "TXN-12345",
  "notes": "Paid via online banking"
}
```

**Process:**
1. Get bill instance
2. Validate bill is in APPROVED or PARTIALLY_PAID status
3. Validate user has permission
4. Create payment record (if configured)
5. Create payment allocation
6. Update bill outstanding_amount to 0
7. Update bill status to PAID
8. Set paid_at timestamp
9. Return response

**Validation:**
- Bill must be approved
- Payment date must be valid
- Payment date must be >= bill_date
- Cannot mark already paid bill

**Use Cases:**
- Cash payments not tracked in system
- Payments from external systems
- Corrections/adjustments
- Manual reconciliation

**Response:**
```
HTTP 200 OK
{
  "message": "Bill marked as paid",
  "bill": {
    "id": "uuid",
    "status": "paid",
    "outstanding_amount": "0.00",
    "paid_at": "2026-01-15T14:00:00Z"
  }
}
```

#### apply_payment

**Purpose**: Apply existing payment to bill

**Configuration:**
```python
@action(detail=True, methods=['post'])
def apply_payment(self, request, pk=None):
    """
    Apply existing payment to this bill
    
    Creates payment allocation
    Updates outstanding balance
    Updates bill status if fully paid
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/apply_payment/`

**Request Body:**
```
{
  "payment_id": "payment-uuid",
  "amount": "500.00"
}
```

**Process:**
1. Get bill instance
2. Get payment instance
3. Validate payment belongs to same vendor
4. Validate payment has unallocated amount
5. Validate allocation amount <= payment unallocated amount
6. Validate allocation amount <= bill outstanding amount
7. Create payment allocation
8. Update bill outstanding amount
9. Update bill status (partially_paid or paid)
10. Update payment unallocated amount
11. Return response

**Validation:**
- Payment must belong to same vendor as bill
- Payment must be in PROCESSED status
- Allocation amount must be positive
- Allocation cannot exceed payment's unallocated amount
- Allocation cannot exceed bill's outstanding amount

**Response:**
```
HTTP 200 OK
{
  "message": "Payment applied successfully",
  "bill": {
    "id": "uuid",
    "outstanding_amount": "500.00",
    "status": "partially_paid"
  },
  "allocation": {
    "id": "uuid",
    "amount": "500.00",
    "payment": "payment-uuid"
  }
}
```

### Bill Management Actions

#### duplicate

**Purpose**: Create copy of existing bill

**Configuration:**
```python
@action(detail=True, methods=['post'])
def duplicate(self, request, pk=None):
    """
    Duplicate vendor bill
    
    Creates new bill with same details
    New bill in DRAFT status
    New line items created
    New bill number assigned
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/duplicate/`

**Request Body:**
```
{
  "update_dates": true,  # Set dates to today
  "include_attachments": false
}
```

**Process:**
1. Get original bill
2. Create new bill instance
3. Copy bill fields (excluding id, bill_number, status, timestamps)
4. Generate new bill_number
5. Set status to DRAFT
6. Copy line items
7. Optionally copy attachments
8. Set created_by to current user
9. Return new bill

**Fields Not Copied:**
- id (new UUID)
- bill_number (new auto-generated)
- status (always DRAFT)
- approval fields (approved_by, approved_at)
- payment fields (outstanding_amount reset to total)
- timestamps (created_at, updated_at)

**Fields Optionally Updated:**
- bill_date (to today if update_dates=true)
- due_date (calculated from new bill_date)

**Use Cases:**
- Recurring bills (same vendor, similar items monthly)
- Template bills for common purchases
- Correcting mistakes (duplicate and edit)

**Response:**
```
HTTP 201 Created
{
  "message": "Bill duplicated successfully",
  "original_bill": "BILL-2026-001",
  "new_bill": {
    "id": "new-uuid",
    "bill_number": "BILL-2026-025",
    "status": "draft"
  }
}
```

#### cancel

**Purpose**: Cancel a bill

**Configuration:**
```python
@action(detail=True, methods=['post'])
def cancel(self, request, pk=None):
    """
    Cancel vendor bill
    
    Transitions to CANCELLED status
    Requires cancellation reason
    Reverses any allocations
    """
    pass
```

**URL:** `POST /api/vendor-bills/{id}/cancel/`

**Request Body:**
```
{
  "reason": "Bill received in error, vendor will re-issue",
  "cancellation_type": "vendor_error"
}
```

**Process:**
1. Get bill instance
2. Validate bill can be cancelled (status check)
3. Validate cancellation reason provided
4. Check for applied payments (must be reversed first or allow automatic reversal)
5. Update bill status to CANCELLED
6. Set cancelled_by and cancelled_at
7. Reverse any payment allocations (if configured)
8. Log cancellation in audit trail
9. Notify relevant parties
10. Return response

**Validation:**
- Bill must not be PAID (unless force option used)
- Cancellation reason required
- User must have cancellation permission
- For paid bills, require special permission

**Payment Handling:**
- **Option 1**: Prevent cancellation if payments applied
- **Option 2**: Auto-reverse payment allocations, create credit
- **Option 3**: Require manual payment reversal first

**Response:**
```
HTTP 200 OK
{
  "message": "Bill cancelled",
  "bill": {
    "id": "uuid",
    "status": "cancelled",
    "cancelled_by": "User Name",
    "cancelled_at": "2026-01-15T15:00:00Z",
    "cancellation_reason": "..."
  }
}
```

### Bulk Operations

#### bulk_approve

**Purpose**: Approve multiple bills at once

**Configuration:**
```python
@action(
    detail=False,
    methods=['post'],
    permission_classes=[IsAuthenticated, CanBulkApprove]
)
def bulk_approve(self, request):
    """
    Bulk approve multiple bills
    
    Accepts list of bill IDs
    Validates each bill
    Approves all or none (transaction)
    """
    pass
```

**URL:** `POST /api/vendor-bills/bulk_approve/`

**Request Body:**
```
{
  "bill_ids": [
    "uuid-1",
    "uuid-2",
    "uuid-3"
  ],
  "notes": "Batch approval for January bills"
}
```

**Process:**
1. Receive list of bill IDs
2. Validate all bills exist and belong to tenant
3. Validate all bills are in PENDING_APPROVAL status
4. Validate user can approve all bills (amount limits, permissions)
5. Begin database transaction
6. Approve each bill
7. Commit transaction (all or none)
8. Return summary

**Validation:**
- All bill IDs must be valid
- All bills must be in PENDING_APPROVAL
- User must have permission for each bill
- Maximum batch size (e.g., 50 bills)

**Response:**
```
HTTP 200 OK
{
  "message": "3 bills approved successfully",
  "approved_count": 3,
  "failed_count": 0,
  "approved_bills": [
    {"id": "uuid-1", "bill_number": "BILL-2026-001"},
    {"id": "uuid-2", "bill_number": "BILL-2026-002"},
    {"id": "uuid-3", "bill_number": "BILL-2026-003"}
  ],
  "failed_bills": []
}
```

**Error Handling:**
- If any bill fails validation, roll back entire transaction
- Return details of which bill failed and why
- Alternatively, use "continue on error" mode with partial success

#### bulk_export

**Purpose**: Export multiple bills to file (PDF, Excel, CSV)

**Configuration:**
```python
@action(
    detail=False,
    methods=['post'],
    permission_classes=[IsAuthenticated]
)
def bulk_export(self, request):
    """
    Export bills to file
    
    Accepts filter criteria
    Generates file (PDF, Excel, CSV)
    Returns download URL or file
    """
    pass
```

**URL:** `POST /api/vendor-bills/bulk_export/`

**Request Body:**
```
{
  "format": "excel",  # pdf, excel, csv
  "filters": {
    "status": "approved",
    "bill_date__gte": "2026-01-01",
    "bill_date__lte": "2026-01-31"
  },
  "include_line_items": true
}
```

**Process:**
1. Parse filter criteria
2. Apply filters to queryset
3. Validate result count (limit for large exports)
4. Generate export file based on format
5. Save to temporary storage or cloud storage
6. Return file URL or stream file
7. Schedule cleanup of temp file

**Export Formats:**

**CSV:**
- Flat structure
- One row per bill (or per line item if included)
- All text fields

**Excel:**
- Multiple sheets: Bills, Line Items, Summary
- Formatted numbers, dates
- Charts/graphs in summary sheet

**PDF:**
- Formatted report
- One bill per page or condensed list
- Include totals, summaries

**Response:**
```
HTTP 200 OK
{
  "message": "Export generated successfully",
  "file_url": "https://storage/exports/bills_2026-01-15.xlsx",
  "expires_at": "2026-01-16T00:00:00Z",
  "record_count": 45
}
```

### Report Actions

#### aging_report

**Purpose**: Generate accounts payable aging report

**Configuration:**
```python
@action(detail=False, methods=['get'])
def aging_report(self, request):
    """
    AP Aging Report
    
    Groups outstanding bills by age
    Shows: Current, 1-30 days, 31-60 days, 61-90 days, 90+ days
    Can group by vendor
    """
    pass
```

**URL:** `GET /api/vendor-bills/aging_report/?as_of_date=2026-01-15`

**Query Parameters:**
- `as_of_date`: Aging as of this date (default: today)
- `group_by_vendor`: True/False
- `include_zero_balance`: Include fully paid bills

**Process:**
1. Get as_of_date (default today)
2. Get all unpaid or partially paid bills
3. Calculate days outstanding from due_date
4. Group into aging buckets
5. Calculate totals per bucket
6. Optionally group by vendor
7. Return structured report

**Aging Buckets:**
- **Current**: Not yet due (due_date >= as_of_date)
- **1-30 days**: Overdue 1-30 days
- **31-60 days**: Overdue 31-60 days
- **61-90 days**: Overdue 61-90 days
- **90+ days**: Overdue more than 90 days

**Response:**
```
HTTP 200 OK
{
  "report_date": "2026-01-15",
  "summary": {
    "current": "50000.00",
    "days_1_30": "25000.00",
    "days_31_60": "10000.00",
    "days_61_90": "5000.00",
    "days_90_plus": "2000.00",
    "total_outstanding": "92000.00"
  },
  "by_vendor": [
    {
      "vendor_name": "ABC Corp",
      "current": "30000.00",
      "days_1_30": "10000.00",
      ...
    },
    ...
  ]
}
```

---

## Integration Requirements

### Related Module Integration

#### Vendor Management Integration

**Dependencies:**
- Vendor model from SubPhase-11
- Vendor payment terms
- Vendor contacts
- Vendor addresses

**Integration Points:**
- Validate vendor is active when creating bill
- Fetch default payment terms from vendor
- Use vendor's currency preference
- Apply vendor-specific discounts or pricing

#### Product/Service Integration

**Dependencies:**
- Product catalog
- Service catalog
- UOM (Unit of Measure) system
- Pricing

**Integration Points:**
- Validate products in line items
- Fetch product standard cost
- Apply product tax rates
- Track purchase quantities for inventory

#### Inventory Integration

**Dependencies:**
- Stock tracking
- Warehouse management
- Goods receipt

**Integration Points:**
- Link bills to goods receipts
- Update inventory on bill approval
- Three-way matching: PO, GR, Bill
- Track received vs billed quantities

#### Accounting Integration

**Dependencies:**
- Chart of Accounts
- Journal entries
- GL accounts
- Cost centers

**Integration Points:**
- Generate journal entries on bill approval
- Post to AP (Accounts Payable) account
- Post to expense/asset accounts from line items
- Support departmental/cost center allocation

#### Payment Processing Integration

**Dependencies:**
- Bank accounts
- Payment methods
- Payment batches
- Check printing

**Integration Points:**
- Create payments from approved bills
- Batch payments for multiple bills
- Integrate with bank payment files (ACH, wire)
- Track payment status and reconciliation

### External System Integration

#### ERP System Integration

**Scenarios:**
- Sync bills from external ERP
- Push bills to external ERP
- Bi-directional sync

**Implementation:**
- REST API endpoints
- Webhook for real-time sync
- Batch import/export
- ID mapping between systems

#### Bank Integration

**Scenarios:**
- Import bank statements
- Initiate payments
- Reconcile payments
- Get account balances

**Implementation:**
- Bank API integration (varies by bank)
- OFX/QFX file import
- NACHA file generation for ACH
- SWIFT message generation for wires

#### Document Management Integration

**Scenarios:**
- Attach scanned bills
- OCR bill data extraction
- Store approved bills
- Retrieve for audit

**Implementation:**
- Cloud storage (S3, Azure Blob, etc.)
- DMS (Document Management System) integration
- OCR service integration (AWS Textract, Google Vision)
- Attachment handling in serializers

---

## Security Considerations

### Authentication

**Methods:**
- JWT token authentication (recommended for APIs)
- Session authentication (for browsable API)
- API key authentication (for integrations)
- OAuth 2.0 (for third-party access)

**Configuration:**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

**Token Security:**
- Use short-lived access tokens (15-30 min)
- Use refresh tokens for extended sessions
- Rotate refresh tokens on use
- Store tokens securely (httpOnly cookies or secure storage)

### Authorization

**Permission Levels:**
- View: Can see bills
- Create: Can create bills
- Edit: Can modify bills
- Approve: Can approve bills
- Delete: Can delete bills
- Manage All: Admin access

**Role-Based Access Control (RBAC):**
- Define roles (Accountant, Accounts Payable Clerk, Manager, CFO)
- Assign permissions to roles
- Assign roles to users
- Check permissions at viewset level and object level

**Object-Level Permissions:**
- User can only edit their own bills
- Manager can edit bills in their department
- Approvers can only approve (not edit)

### Data Validation

**Input Validation:**
- Validate all input data types
- Validate ranges (amounts, dates)
- Validate foreign key references
- Sanitize text inputs (prevent XSS)
- Validate file uploads (type, size, content)

**Business Rule Validation:**
- Enforce workflow states
- Enforce approval limits
- Prevent duplicate bills
- Validate calculation accuracy

**SQL Injection Prevention:**
- Use Django ORM (parameterized queries)
- Avoid raw SQL queries
- Validate any dynamic query construction

### Sensitive Data Protection

**PII Protection:**
- Limit exposure of vendor contact information
- Redact sensitive fields in logs
- Encrypt sensitive data at rest

**Financial Data:**
- Mask account numbers in responses
- Limit access to payment details
- Audit access to financial data

**Audit Trail:**
- Log all create, update, delete operations
- Log all approval/rejection actions
- Log all payment applications
- Include user, timestamp, IP address
- Store immutable audit logs

### Rate Limiting

**API Rate Limits:**
- Per user: 1000 requests/hour
- Per IP: 5000 requests/hour
- Bulk operations: Lower limits

**Configuration:**
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

**DDoS Protection:**
- Use reverse proxy with rate limiting (Nginx, CloudFlare)
- Implement CAPTCHA for suspicious traffic
- Monitor for unusual patterns

---

## Performance Optimization

### Database Optimization

**Query Optimization:**
- Use `select_related()` for foreign keys
- Use `prefetch_related()` for many-to-many and reverse foreign keys
- Use `only()` and `defer()` to limit fields
- Use `annotate()` for calculated fields
- Avoid N+1 queries

**Indexing:**
- Index frequently filtered fields
- Index frequently joined fields
- Compound indexes for common filter combinations
- Partial indexes for specific conditions

**Example:**
```python
class Meta:
    indexes = [
        models.Index(fields=['tenant', 'vendor', 'status']),
        models.Index(fields=['tenant', 'bill_date']),
        models.Index(fields=['-due_date'], condition=Q(status='approved')),
    ]
```

### Caching

**Queryset Caching:**
- Cache frequently accessed bills
- Cache vendor lists
- Cache configuration data (statuses, payment terms)
- Use Redis or Memcached

**Cache Keys:**
- Include tenant ID in cache key
- Include version/timestamp for invalidation
- Use consistent key patterns

**Cache Invalidation:**
- Invalidate on update
- Invalidate on delete
- Time-based expiration as fallback

**Example:**
```python
from django.core.cache import cache

def get_bill_from_cache(bill_id, tenant_id):
    cache_key = f"bill:{tenant_id}:{bill_id}"
    bill = cache.get(cache_key)
    
    if not bill:
        bill = VendorBill.objects.get(id=bill_id, tenant=tenant_id)
        cache.set(cache_key, bill, timeout=3600)  # 1 hour
    
    return bill
```

### Pagination

**Purpose:**
- Limit result set size
- Reduce memory usage
- Improve response time

**Implementation:**
- Page number pagination for UI
- Cursor pagination for API clients
- Limit max page size

**Optimization:**
- Use `count=False` if total count not needed
- Use cursor pagination for large datasets
- Prefetch related objects within page

### Async Processing

**Use Cases:**
- Bulk operations (bulk approve, bulk export)
- Email notifications
- Report generation
- External API calls

**Implementation:**
- Use Celery for background tasks
- Use Django channels for real-time updates
- Queue long-running operations

**Example:**
```python
from celery import shared_task

@shared_task
def bulk_approve_bills(bill_ids, user_id):
    # Process bills in background
    # Update status
    # Send notifications
    pass

# In viewset
@action(detail=False, methods=['post'])
def bulk_approve(self, request):
    bill_ids = request.data.get('bill_ids')
    task = bulk_approve_bills.delay(bill_ids, request.user.id)
    return Response({
        'task_id': task.id,
        'message': 'Approval in progress'
    })
```

---

## Validation Summary

### Serializer Validation

**Field-Level Validation:**
- Data type validation
- Range validation
- Format validation
- Uniqueness validation
- Foreign key existence validation

**Object-Level Validation:**
- Cross-field validation
- Business rule enforcement
- Status-based constraints
- Calculation verification

**Custom Validators:**
- Reusable validator functions
- Validator classes
- Async validators (for external checks)

### ViewSet Validation

**Pre-Save Validation:**
- In `perform_create()`
- In `perform_update()`
- Check permissions
- Check business rules

**Post-Save Actions:**
- Trigger workflows
- Send notifications
- Update related objects
- Invalidate caches

### Error Handling

**Validation Errors:**
- Clear, actionable error messages
- Field-specific errors
- Nested object errors
- Error codes for programmatic handling

**Business Rule Violations:**
- Distinguish from validation errors
- Provide suggestions for resolution
- Include context (current status, requirements)

---

## Testing Strategy

### Unit Tests

**Serializer Tests:**
- Test field validation
- Test create with valid data
- Test create with invalid data
- Test update scenarios
- Test nested object handling
- Test calculated fields
- Test method fields

**ViewSet Tests:**
- Test CRUD operations
- Test permissions
- Test filters
- Test ordering
- Test search
- Test custom actions
- Test error handling

### Integration Tests

**Workflow Tests:**
- Test full bill lifecycle (create → approve → pay)
- Test multi-level approval
- Test payment application
- Test cancellation

**Multi-Tenancy Tests:**
- Test tenant isolation
- Test cross-tenant access prevention
- Test tenant-specific configuration

### API Tests

**Endpoint Tests:**
- Test all endpoints with valid requests
- Test with invalid requests
- Test authentication requirements
- Test permission enforcement
- Test rate limiting

**Performance Tests:**
- Test pagination with large datasets
- Test complex filters
- Test bulk operations
- Measure query counts

### Test Data

**Fixtures:**
- Create test tenants
- Create test vendors
- Create test products
- Create test bills in various statuses

**Factory Pattern:**
- Use factory_boy for test object creation
- Create realistic test scenarios
- Randomize test data

**Example:**
```python
class VendorBillFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = VendorBill
    
    tenant = factory.SubFactory(TenantFactory)
    vendor = factory.SubFactory(VendorFactory)
    bill_date = factory.Faker('date_this_year')
    due_date = factory.LazyAttribute(
        lambda obj: obj.bill_date + timedelta(days=30)
    )
    status = 'draft'
    currency = 'USD'
```

---

## Summary

This document covered the implementation of DRF serializers and ViewSets for the Vendor Bills and Payments module:

**Task 81**: Comprehensive VendorBill serializers with nested line items, validation, and calculated fields

**Task 82**: BillLineItem serializers with product references, UOM handling, tax calculations, and allocation fields

**Task 83**: VendorPayment serializers with payment allocations, multi-currency support, and reconciliation integration

**Task 84**: VendorBillViewSet with full CRUD operations, permissions, multi-tenancy, and error handling

**Task 85**: Advanced filtering, searching, and ordering with performance optimizations

**Task 86**: Custom actions for workflows (approve, reject, mark paid), bill management (duplicate, cancel), bulk operations, and reporting

The API layer provides a robust, secure, and performant interface for managing vendor bills and payments, with comprehensive validation, proper authorization, and extensive functionality for complex business workflows.

---

## Navigation

- **Parent**: [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous**: [Group-E_Document-03](../Group-E_Workflows-Reports/03_Tasks-76-80_Payment-Processing-Reports.md)
- **Next**: [Group-F_Document-02](02_Tasks-87-90_API-Endpoints-Testing.md)

---

**Document End**