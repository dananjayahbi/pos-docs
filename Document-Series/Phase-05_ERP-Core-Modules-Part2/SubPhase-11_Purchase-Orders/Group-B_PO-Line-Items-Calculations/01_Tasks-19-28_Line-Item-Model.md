# Tasks 19-28: POLineItem Model and Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** B - PO Line Items & Calculations  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-29-34_Calculation-Service.md](02_Tasks-29-34_Calculation-Service.md)

---

## Document Overview

This document creates the POLineItem model that represents individual line items within a purchase order. Each line captures product details, quantities, pricing, and receiving status. This granular tracking enables partial receiving, accurate costing, and detailed inventory management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create POLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Fields | Medium | 20 min |
| 21 | Add Line Item Description | Low | 15 min |
| 22 | Add Line Item Quantity Fields | Medium | 20 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Total Field | Medium | 20 min |
| 25 | Add Line Item Status Field | Low | 15 min |
| 26 | Add Line Item Expected Date | Low | 15 min |
| 27 | Add Line Item Warehouse | Medium | 20 min |
| 28 | Run POLineItem Migrations | Low | 15 min |

---

## Task 19: Create POLineItem Model

### Overview
Create the POLineItem model as the foundation for purchase order line items. This model establishes the relationship with PurchaseOrder and provides core infrastructure for detailed item tracking.

### Dependencies
- Group A completed (PurchaseOrder model exists)
- Product and ProductVariant models exist (from inventory app)

### Instructions

1. **Create po_line_item.py file**
   - Navigate to `apps/purchases/models/` directory
   - Create `po_line_item.py` file
   - Add module docstring explaining purpose

2. **Import required dependencies**
   - Import models from django.db
   - Import PurchaseOrder from same models package
   - Import Product, ProductVariant from inventory
   - Import User model
   - Import Decimal for calculations

3. **Define POLineItem model class**
   - Inherit from models.Model
   - Add comprehensive class docstring
   - Explain line item purpose and relationship

4. **Add primary key field**
   - Use UUIDField with UUID4 default
   - Set as primary_key=True
   - Set editable=False

5. **Add purchase_order foreign key**
   - Add purchase_order as ForeignKey to PurchaseOrder
   - Set on_delete=models.CASCADE (delete lines when PO deleted)
   - Set related_name='line_items'
   - Make required (no blank, no null)

6. **Add line_number field**
   - Add line_number as PositiveIntegerField
   - Sequential number within PO (1, 2, 3...)
   - Set default=1
   - Used for ordering and display

7. **Add timestamp fields**
   - created_at: DateTimeField with auto_now_add=True
   - updated_at: DateTimeField with auto_now=True

8. **Configure Meta class**
   - Set verbose_name='PO Line Item'
   - Set verbose_name_plural='PO Line Items'
   - Set ordering=['line_number']
   - Add unique_together for (purchase_order, line_number)

9. **Add __str__ method**
   - Return descriptive string with PO number and line number
   - Format: "PO-2026-00001 Line 1"

### Model Relationships

```
PurchaseOrder (1) ────< (Many) POLineItem

One purchase order has many line items
Each line item belongs to exactly one purchase order
Cascade delete: Deleting PO deletes all its line items
```

### Core Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| id | UUIDField | Primary key | Yes |
| purchase_order | ForeignKey | Parent PO | Yes |
| line_number | PositiveIntegerField | Sequential ordering | Yes |
| created_at | DateTimeField | Creation timestamp | Yes |
| updated_at | DateTimeField | Modification timestamp | Yes |

### Line Number Usage

| Scenario | Line Numbers |
|----------|--------------|
| New PO with 3 items | 1, 2, 3 |
| Add item to existing PO | 4 |
| Delete line 2 | 1, 3 (gaps OK) |
| Reorder lines | Can renumber: 1, 2 |

### Cascade Behavior

| Action | Result |
|--------|--------|
| Delete PurchaseOrder | All POLineItems deleted |
| Delete POLineItem | PO remains, other lines intact |
| Update PO | Line items unaffected |

### Expected Outcome
- POLineItem model foundation established
- Relationship with PurchaseOrder defined
- Sequential line numbering supported
- Timestamp tracking for audit

### Verification Checklist
- [ ] po_line_item.py file created
- [ ] Model class defined
- [ ] UUID primary key configured
- [ ] purchase_order ForeignKey added
- [ ] line_number field added
- [ ] Timestamp fields added
- [ ] Meta class configured
- [ ] __str__ method implemented

---

## Task 20: Add Line Item Product Fields

### Overview
Add product identification fields to link line items with inventory products, variants, and vendor SKUs. These fields enable accurate product tracking and cross-referencing with vendor catalogs.

### Dependencies
- Task 19: Create POLineItem Model
- Product and ProductVariant models from inventory app
- Vendor model exists

### Instructions

1. **Import Product and ProductVariant models**
   - Add imports from inventory app
   - Ensure proper module paths

2. **Add product foreign key field**
   - Add product as ForeignKey to Product
   - Set on_delete=models.PROTECT (can't delete product with PO lines)
   - Set related_name='po_line_items'
   - Set blank=True, null=True (optional for non-product items)
   - Add db_index=True for fast lookups

3. **Add variant foreign key field**
   - Add variant as ForeignKey to ProductVariant
   - Set on_delete=models.PROTECT
   - Set related_name='po_line_items'
   - Set blank=True, null=True (only if product has variants)
   - Add db_index=True

4. **Add vendor_sku field**
   - Add vendor_sku as CharField
   - Set max_length=100
   - Set blank=True (not all vendors provide SKUs)
   - Store vendor's product code

5. **Add product_name field**
   - Add product_name as CharField
   - Set max_length=255
   - Store product name at time of PO creation
   - Preserves name even if product renamed later

6. **Update model docstring**
   - Document product field relationships
   - Explain variant usage
   - Note vendor_sku purpose

### Product Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| product | ForeignKey | Inventory product | No |
| variant | ForeignKey | Product variant | No |
| vendor_sku | CharField | Vendor's product code | No |
| product_name | CharField | Product name snapshot | Yes |

### Product vs Variant Scenarios

| Item Type | product | variant | Example |
|-----------|---------|---------|---------|
| Simple product | Set | NULL | Standard item |
| Product with variant | Set | Set | Size/Color option |
| Non-product item | NULL | NULL | Service/Custom |

### Vendor SKU Usage

| Scenario | vendor_sku | Purpose |
|----------|------------|---------|
| Vendor catalog match | "ABC-TV-55" | Cross-reference |
| Vendor system sync | "VEND-12345" | API integration |
| No vendor SKU | Empty/NULL | Manual entry |

### Product Name Snapshot

| Reason | Benefit |
|--------|---------|
| Historical accuracy | PO shows original product name |
| Product renaming | Old POs still make sense |
| Reporting | Consistent historical reports |
| Audit trail | Know exactly what was ordered |

### Product Linking

```
POLineItem
    ├─→ product (Samsung TV 55")
    │       └─→ Inventory tracking
    ├─→ variant (4K HDR Model)
    │       └─→ Specific configuration
    ├─→ vendor_sku ("ABC-TV-55")
    │       └─→ Vendor catalog reference
    └─→ product_name ("Samsung 55\" 4K Smart TV")
            └─→ Historical name
```

### Expected Outcome
- Product identification and linking
- Variant support for configurable products
- Vendor catalog cross-reference
- Historical product name preservation

### Verification Checklist
- [ ] product ForeignKey added
- [ ] variant ForeignKey added
- [ ] vendor_sku field added
- [ ] product_name field added
- [ ] PROTECT on_delete configured
- [ ] Optional fields allow NULL
- [ ] Indexes added

---

## Task 21: Add Line Item Description

### Overview
Add description field to allow detailed item information, supporting both product-linked items and custom/non-product items like services or special orders.

### Dependencies
- Task 19: Create POLineItem Model

### Instructions

1. **Add item_description field**
   - Add item_description as TextField
   - Set blank=True
   - Allows detailed description beyond product name
   - Essential for non-product items

2. **Add is_service field**
   - Add is_service as BooleanField
   - Set default=False
   - Flag for service items vs physical products

3. **Update model docstring**
   - Document description usage
   - Explain service item handling
   - Note when to use vs product fields

### Description Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| item_description | TextField | Detailed description | No |
| is_service | BooleanField | Service item flag | Yes (default False) |

### Description Usage Scenarios

| Scenario | product | item_description | is_service |
|----------|---------|------------------|------------|
| Standard product | Set | Empty or details | False |
| Custom product | NULL | Full description | False |
| Service item | NULL | Service details | True |
| Special order | NULL | Specifications | False |

### Item Description Examples

| Item Type | Description |
|-----------|-------------|
| Product | "Additional warranty coverage - 3 years" |
| Service | "Installation service for CCTV system, includes cabling and configuration" |
| Custom | "Custom-built server rack, 42U, black finish, with cable management" |
| Special | "Imported electronics, specific model as per attached specs" |

### Non-Product Item Handling

```
Line Item: Installation Service
├── product: NULL (no inventory product)
├── item_description: "Professional installation of CCTV cameras..."
├── is_service: True
├── quantity_ordered: 1
├── unit_price: Rs. 25,000
└── line_total: Rs. 25,000
```

### Product vs Description Priority

| Situation | Display Priority |
|-----------|------------------|
| Product linked | product_name (description as additional) |
| No product | item_description (primary) |
| Both present | product_name + description |
| Neither | Error - must have one |

### Expected Outcome
- Support for non-product items
- Detailed item descriptions
- Service item tracking
- Flexible line item types

### Verification Checklist
- [ ] item_description TextField added
- [ ] is_service BooleanField added
- [ ] Optional blank=True on description
- [ ] Usage scenarios documented

---

## Task 22: Add Line Item Quantity Fields

### Overview
Add quantity tracking fields to manage ordered, received, and pending quantities. These fields enable partial receiving and back-order management.

### Dependencies
- Task 19: Create POLineItem Model

### Instructions

1. **Add quantity_ordered field**
   - Add quantity_ordered as PositiveIntegerField
   - Make required (no blank, no null)
   - Must be > 0
   - Initial ordered quantity

2. **Add quantity_received field**
   - Add quantity_received as PositiveIntegerField
   - Set default=0
   - Tracks cumulative received amount
   - Updated during receiving process

3. **Add quantity_rejected field**
   - Add quantity_rejected as PositiveIntegerField
   - Set default=0
   - Tracks quality-failed items
   - Doesn't add to inventory

4. **Add quantity_cancelled field**
   - Add quantity_cancelled as PositiveIntegerField
   - Set default=0
   - Tracks cancelled portions
   - Back-order cancellations

5. **Add quantity_pending property**
   - Create @property method
   - Calculate: ordered - received - cancelled
   - Returns remaining quantity to receive
   - Read-only computed value

6. **Add validation for quantities**
   - received + cancelled + rejected <= ordered
   - All quantities >= 0
   - Add clean() method for validation

### Quantity Fields Summary

| Field | Type | Purpose | Editable |
|-------|------|---------|----------|
| quantity_ordered | PositiveIntegerField | Original order | Yes |
| quantity_received | PositiveIntegerField | Successfully received | Yes |
| quantity_rejected | PositiveIntegerField | Quality rejected | Yes |
| quantity_cancelled | PositiveIntegerField | Cancelled amount | Yes |
| quantity_pending | Property | Remaining to receive | No (computed) |

### Quantity Calculation

```
quantity_pending = quantity_ordered - quantity_received - quantity_cancelled

Example:
Ordered: 100
Received: 60
Rejected: 5
Cancelled: 10
Pending: 100 - 60 - 10 = 30
```

### Receiving Scenarios

| Scenario | Ordered | Received | Rejected | Cancelled | Pending |
|----------|---------|----------|----------|-----------|---------|
| Not started | 100 | 0 | 0 | 0 | 100 |
| Partial receive | 100 | 60 | 5 | 0 | 40 |
| Full receive | 100 | 95 | 5 | 0 | 0 |
| Partial cancel | 100 | 60 | 5 | 30 | 10 |
| Full cancel | 100 | 0 | 0 | 100 | 0 |

### Quantity Timeline

```
Order Created: 100 units ordered
     ↓
First Receiving: 60 received, 5 rejected
     ├─→ quantity_received = 60
     ├─→ quantity_rejected = 5
     └─→ quantity_pending = 35
     ↓
Second Receiving: 30 received
     ├─→ quantity_received = 90
     └─→ quantity_pending = 5
     ↓
Cancel Remaining: 5 cancelled
     ├─→ quantity_cancelled = 5
     └─→ quantity_pending = 0
```

### Validation Rules

| Rule | Purpose |
|------|---------|
| quantity_ordered > 0 | Must order at least 1 |
| quantity_received <= ordered | Can't receive more than ordered |
| received + cancelled <= ordered | Total can't exceed order |
| All quantities >= 0 | No negative quantities |

### Expected Outcome
- Comprehensive quantity tracking
- Partial receiving support
- Back-order management
- Quality rejection tracking

### Verification Checklist
- [ ] quantity_ordered field added
- [ ] quantity_received field added
- [ ] quantity_rejected field added
- [ ] quantity_cancelled field added
- [ ] quantity_pending property created
- [ ] Validation logic implemented

---

## Task 23: Add Line Item Pricing Fields

### Overview
Add pricing and discount fields to calculate line item costs. These fields support item-level discounts and taxes, enabling accurate financial calculations.

### Dependencies
- Task 19: Create POLineItem Model

### Instructions

1. **Add unit_price field**
   - Add unit_price as DecimalField
   - Set max_digits=12, decimal_places=2
   - Make required (no blank, no null)
   - Price per single unit

2. **Add discount_percentage field**
   - Add discount_percentage as DecimalField
   - Set max_digits=5, decimal_places=2
   - Set default=0.00
   - Percentage discount (0-100)

3. **Add discount_amount field**
   - Add discount_amount as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Fixed amount discount per unit

4. **Add tax_rate field**
   - Add tax_rate as DecimalField
   - Set max_digits=5, decimal_places=2
   - Set default=0.00
   - Tax percentage (e.g., 18 for 18%)

5. **Add tax_amount field**
   - Add tax_amount as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Calculated total tax for line

6. **Update model docstring**
   - Document pricing calculation
   - Explain discount priority
   - Note tax calculation method

### Pricing Fields Summary

| Field | Type | Purpose | Default |
|-------|------|---------|---------|
| unit_price | DecimalField | Price per unit | Required |
| discount_percentage | DecimalField | Discount % | 0.00 |
| discount_amount | DecimalField | Discount amount | 0.00 |
| tax_rate | DecimalField | Tax percentage | 0.00 |
| tax_amount | DecimalField | Total tax | 0.00 |

### Price Calculation Flow

```
Base Price: unit_price × quantity_ordered
     ↓
Apply Discount:
  If discount_percentage > 0:
    discount = base_price × (discount_percentage / 100)
  Else:
    discount = discount_amount × quantity_ordered
     ↓
Price After Discount: base_price - discount
     ↓
Calculate Tax:
  tax_amount = price_after_discount × (tax_rate / 100)
     ↓
Line Total: price_after_discount + tax_amount
```

### Pricing Example

```
Product: Samsung TV
Unit Price: Rs. 85,000
Quantity: 10
Discount: 5%
Tax Rate: 18%

Calculation:
├── Base: 85,000 × 10 = Rs. 850,000
├── Discount: 850,000 × 5% = Rs. 42,500
├── After Discount: 850,000 - 42,500 = Rs. 807,500
├── Tax: 807,500 × 18% = Rs. 145,350
└── Line Total: 807,500 + 145,350 = Rs. 952,850
```

### Discount Handling

| Type | Priority | Calculation |
|------|----------|-------------|
| Percentage | If > 0, use percentage | base × (pct / 100) |
| Fixed Amount | If percentage = 0 | amount × quantity |
| None | Both = 0 | No discount |

### Tax Scenarios

| Tax Rate | Application | Example |
|----------|-------------|---------|
| 0% | Tax-exempt items | 0 |
| 5% | Reduced rate | Books |
| 18% | Standard VAT | Electronics |
| Multiple | Complex tax | State + Federal |

### Expected Outcome
- Flexible pricing support
- Discount calculations
- Tax tracking
- Accurate line costing

### Verification Checklist
- [ ] unit_price field added
- [ ] discount_percentage field added
- [ ] discount_amount field added
- [ ] tax_rate field added
- [ ] tax_amount field added
- [ ] Pricing logic documented

---

## Task 24: Add Line Item Total Field

### Overview
Add line total field and calculation method to compute the complete cost for a line item. This field aggregates quantity, price, discounts, and taxes into a single total.

### Dependencies
- Task 22: Add Line Item Quantity Fields
- Task 23: Add Line Item Pricing Fields

### Instructions

1. **Add line_total field**
   - Add line_total as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Stores calculated total

2. **Create calculate_total method**
   - Define instance method
   - Calculate using pricing formula
   - Update line_total field
   - Return calculated value

3. **Implement pricing calculation**
   - Start with unit_price × quantity_ordered
   - Apply discount (percentage or fixed)
   - Calculate subtotal after discount
   - Apply tax to subtotal
   - Sum to get line_total

4. **Override save method**
   - Call calculate_total before saving
   - Ensure line_total always current
   - Use super().save() to persist

5. **Add recalculate_total method**
   - Separate method for manual recalculation
   - Update tax_amount as well
   - Save after calculation

### Line Total Calculation

```python
def calculate_total(self):
    # Base amount
    base_amount = self.unit_price * self.quantity_ordered
    
    # Apply discount
    if self.discount_percentage > 0:
        discount = base_amount * (self.discount_percentage / 100)
    else:
        discount = self.discount_amount * self.quantity_ordered
    
    # Subtotal after discount
    subtotal = base_amount - discount
    
    # Calculate tax
    tax = subtotal * (self.tax_rate / 100)
    self.tax_amount = tax
    
    # Line total
    self.line_total = subtotal + tax
    
    return self.line_total
```

### Calculation Components

| Component | Formula | Example |
|-----------|---------|---------|
| Base Amount | unit_price × quantity | 85,000 × 10 = 850,000 |
| Discount | base × (pct/100) | 850,000 × 5% = 42,500 |
| Subtotal | base - discount | 850,000 - 42,500 = 807,500 |
| Tax | subtotal × (rate/100) | 807,500 × 18% = 145,350 |
| Line Total | subtotal + tax | 807,500 + 145,350 = 952,850 |

### Calculation Trigger Points

| Event | Action |
|-------|--------|
| Model save | Auto-calculate |
| Price change | Recalculate |
| Quantity change | Recalculate |
| Discount change | Recalculate |
| Tax rate change | Recalculate |

### Example Scenarios

| Scenario | unit_price | qty | discount % | tax % | line_total |
|----------|------------|-----|------------|-------|------------|
| Simple | 1,000 | 10 | 0 | 0 | 10,000 |
| With discount | 1,000 | 10 | 10 | 0 | 9,000 |
| With tax | 1,000 | 10 | 0 | 18 | 11,800 |
| Discount + tax | 1,000 | 10 | 10 | 18 | 10,620 |

### Decimal Precision

| Aspect | Handling |
|--------|----------|
| Intermediate | Use Decimal, not float |
| Rounding | Round to 2 decimal places |
| Currency | Always 2 decimals for money |
| Display | Format with currency symbol |

### Expected Outcome
- Automatic total calculation
- Accurate financial tracking
- Consistent pricing logic
- Always up-to-date totals

### Verification Checklist
- [ ] line_total field added
- [ ] calculate_total method implemented
- [ ] save method overridden
- [ ] recalculate_total method added
- [ ] Calculation formula correct
- [ ] Decimal precision maintained

---

## Task 25: Add Line Item Status Field

### Overview
Add status field to track the receiving state of each line item independently. This enables partial receiving where some lines are complete while others are pending.

### Dependencies
- Task 19: Create POLineItem Model
- Task 22: Add Line Item Quantity Fields

### Instructions

1. **Create line status constants**
   - Add to constants.py or inline
   - Define LINE_ITEM_STATUS_PENDING = 'pending'
   - Define LINE_ITEM_STATUS_PARTIAL = 'partial'
   - Define LINE_ITEM_STATUS_RECEIVED = 'received'
   - Define LINE_ITEM_STATUS_CANCELLED = 'cancelled'

2. **Create status choices tuple**
   - PENDING: Not yet received
   - PARTIAL: Some received, some pending
   - RECEIVED: Fully received
   - CANCELLED: Line cancelled

3. **Add status field**
   - Add status as CharField
   - Set max_length=20
   - Use status choices
   - Set default='pending'
   - Add db_index=True for filtering

4. **Add status update logic**
   - Create update_status method
   - Auto-update based on quantities
   - Called after receiving operations

5. **Update model docstring**
   - Document status meanings
   - Explain auto-update logic
   - Note status transitions

### Line Status Choices

| Status | Value | Meaning |
|--------|-------|---------|
| PENDING | pending | Not started receiving |
| PARTIAL | partial | Partially received |
| RECEIVED | received | Fully received |
| CANCELLED | cancelled | Line cancelled |

### Status Update Logic

```
def update_status(self):
    if self.quantity_cancelled == self.quantity_ordered:
        self.status = 'cancelled'
    elif self.quantity_received == 0:
        self.status = 'pending'
    elif self.quantity_received >= self.quantity_ordered:
        self.status = 'received'
    else:
        self.status = 'partial'
```

### Status Transitions

```
PENDING
    ├─→ PARTIAL (some received)
    ├─→ RECEIVED (all received)
    └─→ CANCELLED (cancelled)

PARTIAL
    ├─→ RECEIVED (remaining received)
    └─→ CANCELLED (remaining cancelled)

RECEIVED (terminal)
CANCELLED (terminal)
```

### Status Examples

| Ordered | Received | Cancelled | Status |
|---------|----------|-----------|--------|
| 100 | 0 | 0 | PENDING |
| 100 | 60 | 0 | PARTIAL |
| 100 | 100 | 0 | RECEIVED |
| 100 | 95 | 5 | RECEIVED |
| 100 | 60 | 40 | RECEIVED |
| 100 | 0 | 100 | CANCELLED |

### Status-Based Filtering

| Query | Use Case |
|-------|----------|
| status='pending' | Lines awaiting delivery |
| status='partial' | Back-order tracking |
| status='received' | Completed lines |
| status!='received' | Outstanding orders |

### Expected Outcome
- Line-level status tracking
- Partial receiving support
- Automatic status updates
- Status-based reporting

### Verification Checklist
- [ ] Status constants defined
- [ ] Status choices tuple created
- [ ] status field added
- [ ] update_status method implemented
- [ ] Status transitions documented
- [ ] Index added for filtering

---

## Task 26: Add Line Item Expected Date

### Overview
Add optional expected delivery date field for line items that may arrive at different times. This enables per-line scheduling for split shipments.

### Dependencies
- Task 19: Create POLineItem Model

### Instructions

1. **Add expected_delivery_date field**
   - Add expected_delivery_date as DateField
   - Set blank=True, null=True (optional)
   - Allows per-line delivery dates
   - Overrides PO-level expected date if set

2. **Add date validation**
   - Should be >= PO order_date
   - Can be different from PO expected_delivery_date
   - Validate in clean() method

3. **Update model docstring**
   - Document per-line delivery dates
   - Explain use in split shipments
   - Note relationship to PO date

### Expected Delivery Date Usage

| Scenario | PO Date | Line 1 Date | Line 2 Date |
|----------|---------|-------------|-------------|
| Single shipment | 2026-01-25 | NULL | NULL |
| Split shipment | 2026-01-25 | 2026-01-20 | 2026-01-30 |
| Back-order | 2026-01-25 | 2026-01-25 | 2026-02-15 |

### Split Shipment Example

```
PO-2026-00001 (Expected: 2026-01-25)
├── Line 1: Samsung TVs (10 units)
│   └── Expected: 2026-01-20 (in stock, early)
├── Line 2: LG Soundbars (20 units)
│   └── Expected: 2026-01-25 (normal)
└── Line 3: Sony Speakers (15 units)
    └── Expected: 2026-02-10 (back-order)
```

### Date Priority

| Condition | Use Date |
|-----------|----------|
| Line date set | Use line expected_delivery_date |
| Line date NULL | Use PO expected_delivery_date |
| Both NULL | No expected date |

### Expected Outcome
- Per-line delivery scheduling
- Split shipment support
- Flexible delivery management

### Verification Checklist
- [ ] expected_delivery_date field added
- [ ] Optional (blank=True, null=True)
- [ ] Date validation logic planned
- [ ] Split shipment scenarios documented

---

## Task 27: Add Line Item Warehouse

### Overview
Add warehouse location fields to specify where each line item should be received. This supports receiving to different locations within or across warehouses.

### Dependencies
- Task 19: Create POLineItem Model
- Warehouse and WarehouseLocation models exist

### Instructions

1. **Import Warehouse and WarehouseLocation models**
   - Add imports from inventory app
   - Ensure proper module paths

2. **Add receiving_warehouse field**
   - Add receiving_warehouse as ForeignKey to Warehouse
   - Set on_delete=models.PROTECT
   - Set related_name='po_line_items'
   - Set blank=True, null=True (defaults to PO warehouse)
   - Add db_index=True

3. **Add receiving_location field**
   - Add receiving_location as ForeignKey to WarehouseLocation
   - Set on_delete=models.SET_NULL
   - Set related_name='po_line_items'
   - Set blank=True, null=True (optional specific location)
   - More granular than warehouse

4. **Add location validation**
   - If receiving_location set, must belong to receiving_warehouse
   - Validate in clean() method

5. **Update model docstring**
   - Document warehouse/location hierarchy
   - Explain per-line allocation
   - Note default behavior

### Warehouse Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| receiving_warehouse | ForeignKey | Target warehouse | No |
| receiving_location | ForeignKey | Specific location in warehouse | No |

### Warehouse Hierarchy

```
Warehouse: Main Warehouse
├── Location: Bay 1 (Electronics)
├── Location: Bay 2 (Appliances)
├── Location: Bay 3 (Small Items)
└── Location: Bay 4 (Overstock)

Line Item Assignment:
├── receiving_warehouse: Main Warehouse
└── receiving_location: Bay 1 (Electronics)
```

### Per-Line Warehouse Scenarios

| Scenario | PO Warehouse | Line 1 Warehouse | Line 2 Warehouse |
|----------|--------------|------------------|------------------|
| Single warehouse | Main | NULL (inherit) | NULL (inherit) |
| Multi-warehouse | Main | Store A | Store B |
| Direct-to-location | Main | Main/Bay 1 | Main/Bay 2 |

### Location Granularity

| Level | Example | Use Case |
|-------|---------|----------|
| Warehouse | Main Warehouse | General receiving |
| Zone | Electronics Section | Department-specific |
| Bay | Bay 3 | Physical location |
| Shelf | Shelf A5 | Exact position |

### Expected Outcome
- Per-line warehouse allocation
- Granular location tracking
- Multi-warehouse receiving
- Efficient stock placement

### Verification Checklist
- [ ] receiving_warehouse ForeignKey added
- [ ] receiving_location ForeignKey added
- [ ] Optional fields (blank=True, null=True)
- [ ] Location validation planned
- [ ] Indexes added

---

## Task 28: Run POLineItem Migrations

### Overview
Generate and apply Django migrations for the POLineItem model. This creates the database table with all fields, indexes, and constraints.

### Dependencies
- Tasks 19-27: All POLineItem model fields complete

### Instructions

1. **Update models __init__.py**
   - Open `apps/purchases/models/__init__.py`
   - Import POLineItem model
   - Export alongside PurchaseOrder

2. **Verify model completeness**
   - Review all fields added
   - Check Meta class configuration
   - Ensure all imports present

3. **Generate migration**
   - Run makemigrations purchases
   - Review generated migration file
   - Should be 0002_po_line_item.py or similar

4. **Review migration operations**
   - CreateModel for POLineItem
   - All fields present
   - Foreign keys correct
   - Indexes included

5. **Test migration (dry run)**
   - Run migrate --plan
   - Check for warnings

6. **Apply migration to public schema**
   - Run migrate command
   - Verify success

7. **Apply to tenant schemas**
   - Run tenant migrations
   - Apply to all tenants

8. **Verify database table**
   - Check purchases_polineitem table exists
   - Verify all columns present
   - Confirm foreign keys
   - Check indexes

9. **Test model operations**
   - Create test POLineItem
   - Verify relationships
   - Test calculations
   - Check status updates

### Expected Table Structure

```
Table: purchases_polineitem
├── id (uuid, PK)
├── purchase_order_id (uuid, FK)
├── line_number (integer)
├── product_id (uuid, FK, nullable)
├── variant_id (uuid, FK, nullable)
├── vendor_sku (varchar)
├── product_name (varchar)
├── item_description (text)
├── is_service (boolean)
├── quantity_ordered (integer)
├── quantity_received (integer)
├── quantity_rejected (integer)
├── quantity_cancelled (integer)
├── unit_price (decimal)
├── discount_percentage (decimal)
├── discount_amount (decimal)
├── tax_rate (decimal)
├── tax_amount (decimal)
├── line_total (decimal)
├── status (varchar, indexed)
├── expected_delivery_date (date)
├── receiving_warehouse_id (uuid, FK)
├── receiving_location_id (uuid, FK)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Expected Outcome
- POLineItem table created
- All fields in database
- Foreign key relationships established
- Ready for line item operations

### Verification Checklist
- [ ] models/__init__.py updated
- [ ] makemigrations executed
- [ ] Migration file reviewed
- [ ] Migration applied to public
- [ ] Migration applied to tenants
- [ ] Database table verified
- [ ] Test line items created
- [ ] Relationships working

---

## Summary

This document created the complete POLineItem model:

| Category | Fields Added | Purpose |
|----------|--------------|---------|
| Core | 3 fields | ID, PO link, line number |
| Product | 4 fields | Product identification |
| Description | 2 fields | Item details |
| Quantities | 5 fields | Order/receive tracking |
| Pricing | 5 fields | Cost calculations |
| Total | 1 field | Line total |
| Status | 1 field | Receiving state |
| Scheduling | 1 field | Delivery date |
| Location | 2 fields | Warehouse allocation |
| Timestamps | 2 fields | Audit trail |

### Total Fields: 26 fields

### Next Steps
- **Document 02**: Create calculation service with line total, tax, and PO total calculations
- Implement recalculation signals
- Add vendor price lookup

---

## Validation Points

Before proceeding to the next document:
- [ ] All 10 tasks completed
- [ ] POLineItem model complete with 26 fields
- [ ] Product linking implemented
- [ ] Quantity tracking enabled
- [ ] Pricing fields added
- [ ] Calculation logic implemented
- [ ] Status management added
- [ ] Warehouse allocation supported
- [ ] Migrations applied
- [ ] Model tested and verified
