# Tasks 25-29: Tax, Status, Warehouse, and Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** B - Order Line Items & Pricing  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28, 29

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_LineItem-Model-Core.md](01_Tasks-19-24_LineItem-Model-Core.md)
- **→ Next Document:** [03_Tasks-30-34_Calculation-Services.md](03_Tasks-30-34_Calculation-Services.md)

---

## Document Overview

This document covers adding tax calculations, computed line totals, fulfillment status tracking, warehouse references, and running migrations for the OrderLineItem model. These fields complete the line item model with all information needed for order processing, fulfillment, and financial reporting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Add Line Item Tax Fields | Medium | 20 min |
| 26 | Add Line Item Total Field | Medium | 20 min |
| 27 | Add Line Item Status Field | Medium | 20 min |
| 28 | Add Line Item Warehouse Reference | Medium | 20 min |
| 29 | Run OrderLineItem Migrations | Low | 15 min |

---

## Task 25: Add Line Item Tax Fields

### Overview
Add fields to track tax calculations for each line item. These fields support flexible tax rates, computed tax amounts, and the ability to mark items as taxable or tax-exempt.

### Dependencies
- Task 24: Add Line Item Discount Fields
- Tax configuration from Phase 04

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after discount fields

2. **Add is_taxable field**
   - `is_taxable`: BooleanField
   - Set default=True
   - Add help text: "Whether this line item is subject to tax"
   - Allows marking certain items as tax-exempt

3. **Add tax_rate field**
   - `tax_rate`: DecimalField with max_digits=5, decimal_places=2
   - Set default=0.0
   - Add validators for range 0-100
   - Add help text: "Tax rate percentage applied to this line item"
   - Snapshot of tax rate at order time

4. **Add tax_amount field**
   - `tax_amount`: DecimalField with max_digits=12, decimal_places=2
   - Set default=0.0
   - Add validators for non-negative value (min_value=0)
   - Add help text: "Calculated tax amount in currency"
   - Computed from (unit_price * quantity * tax_rate)

5. **Add tax_code field**
   - `tax_code`: CharField with max_length=50
   - Make it nullable (null=True, blank=True)
   - Add help text: "Tax classification code (e.g., VAT, GST, TAX-EXEMPT)"
   - Used for tax reporting and compliance

6. **Import validators for tax_rate**
   - Import MaxValueValidator from django.core.validators
   - Apply MinValueValidator(0) and MaxValueValidator(100)

7. **Document tax calculation logic**
   - Explain how tax_amount is computed
   - Note that tax is calculated on (unit_price * quantity)
   - Document Sri Lanka VAT rate (currently 18%)
   - Explain tax-exempt scenarios

8. **Add tax validation comments**
   - Note that tax_rate should be 0-100
   - Explain that is_taxable=False means tax_amount=0
   - Document that tax is applied after discounts

### Tax Calculation Logic

```
Base Calculation:
├── Subtotal = unit_price * quantity_ordered
├── If is_taxable = True:
│   └── tax_amount = subtotal * (tax_rate / 100)
└── If is_taxable = False:
    └── tax_amount = 0

Example with Tax:
├── unit_price = ₨ 5,000
├── quantity_ordered = 2
├── subtotal = ₨ 10,000
├── tax_rate = 18.0 (VAT)
├── tax_amount = ₨ 10,000 * 0.18 = ₨ 1,800
└── total = ₨ 10,000 + ₨ 1,800 = ₨ 11,800

Example Tax-Exempt:
├── unit_price = ₨ 5,000
├── quantity_ordered = 2
├── subtotal = ₨ 10,000
├── is_taxable = False
├── tax_amount = ₨ 0
└── total = ₨ 10,000
```

### Sri Lanka Tax Context

**Standard VAT Rate:**
- Current rate: 18% (as of 2026)
- Applies to most goods and services
- May vary by product category

**Tax-Exempt Categories:**
- Essential food items (rice, bread, milk)
- Educational materials (textbooks, uniforms)
- Medical supplies and pharmaceuticals
- Agricultural inputs (fertilizer, seeds)
- Financial services

**Tax Codes:**
| Code | Description | Rate |
|------|-------------|------|
| VAT-18 | Standard VAT | 18% |
| VAT-0 | Zero-rated VAT | 0% |
| TAX-EXEMPT | Exempt from tax | 0% |
| VAT-8 | Reduced VAT (certain items) | 8% |

### Tax Calculation Scenarios

**Scenario 1: Standard Taxable Item**
```
Product: Electronics
unit_price: ₨ 10,000
quantity: 1
is_taxable: True
tax_rate: 18.0
tax_code: 'VAT-18'

Calculation:
subtotal = ₨ 10,000
tax_amount = ₨ 10,000 * 0.18 = ₨ 1,800
line_total = ₨ 11,800
```

**Scenario 2: Tax-Exempt Item**
```
Product: Educational Book
unit_price: ₨ 2,000
quantity: 3
is_taxable: False
tax_rate: 0.0
tax_code: 'TAX-EXEMPT'

Calculation:
subtotal = ₨ 6,000
tax_amount = ₨ 0
line_total = ₨ 6,000
```

**Scenario 3: Zero-Rated Item**
```
Product: Export Goods
unit_price: ₨ 50,000
quantity: 1
is_taxable: True
tax_rate: 0.0
tax_code: 'VAT-0'

Calculation:
subtotal = ₨ 50,000
tax_amount = ₨ 0 (0% rate)
line_total = ₨ 50,000
```

**Scenario 4: Reduced Rate Item**
```
Product: Essential Food
unit_price: ₨ 1,000
quantity: 5
is_taxable: True
tax_rate: 8.0
tax_code: 'VAT-8'

Calculation:
subtotal = ₨ 5,000
tax_amount = ₨ 5,000 * 0.08 = ₨ 400
line_total = ₨ 5,400
```

### Tax After Discounts

Tax should be calculated on the discounted price:

```
Step 1: Calculate Discounted Price
original_price = ₨ 10,000
discount (10%) = ₨ 1,000
unit_price = ₨ 9,000

Step 2: Calculate Subtotal
quantity = 2
subtotal = ₨ 9,000 * 2 = ₨ 18,000

Step 3: Calculate Tax
tax_rate = 18%
tax_amount = ₨ 18,000 * 0.18 = ₨ 3,240

Step 4: Calculate Total
line_total = ₨ 18,000 + ₨ 3,240 = ₨ 21,240
```

### Tax Snapshot Pattern

Tax rates can change over time. Snapshotting ensures:
- Historical accuracy in reports
- Legal compliance with rate at sale time
- Correct invoice recreation
- Audit trail preservation

**Example:**
```
Order Date: January 2026
Tax Rate at Time: 18%
Order Total: ₨ 11,800 (including tax)

Tax Rate Changes: March 2026
New Tax Rate: 20%

Original order still shows:
tax_rate: 18.0
tax_amount: ₨ 1,800
(Does not recalculate with new rate)
```

### Tax Reporting Benefits

With tax fields:
- **Tax Liability Reports:** Total tax collected by period
- **Tax-Exempt Sales:** Track exempt vs taxable sales
- **Tax by Category:** Revenue by tax classification
- **Compliance Reports:** Data for tax authority filing
- **Audit Trail:** Complete tax calculation history

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Previous fields...
    
    # New tax fields
    is_taxable = models.BooleanField(default=True)
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    tax_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0)]
    )
    tax_code = models.CharField(
        max_length=50, null=True, blank=True
    )
```

### Verification Checklist
- [ ] is_taxable BooleanField added with default=True
- [ ] tax_rate DecimalField added with 0-100 validation
- [ ] tax_amount DecimalField added with non-negative validation
- [ ] tax_code CharField added as nullable field
- [ ] All tax fields have appropriate help_text
- [ ] Tax calculation logic documented in comments
- [ ] Sri Lanka VAT rates documented
- [ ] Tax-exempt scenarios explained
- [ ] Tax-after-discount calculation documented

---

## Task 26: Add Line Item Total Field

### Overview
Add a computed field that stores the total amount for the line item including all calculations (quantity × unit price + tax). This denormalized field improves query performance and simplifies reporting.

### Dependencies
- Task 25: Add Line Item Tax Fields

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after tax fields

2. **Add line_total field**
   - `line_total`: DecimalField with max_digits=12, decimal_places=2
   - Set default=0.0
   - Add help text: "Total amount for this line (quantity × unit_price + tax)"
   - This is a computed/cached field
   - Add `db_index=True` for reporting queries

3. **Document line total calculation**
   - Formula: line_total = (quantity_ordered * unit_price) + tax_amount
   - Note that this excludes order-level discounts
   - Explain that it includes line-level discounts (in unit_price)
   - Mention that it includes line-level tax

4. **Add calculation method**
   - Create `calculate_line_total()` method
   - Method should compute: (quantity_ordered * unit_price) + tax_amount
   - Return Decimal value
   - Use Decimal for precision

5. **Add recalculation comments**
   - Note when line_total should be recalculated
   - Mention that it should update on quantity/price/tax changes
   - Reference the recalculation signal (Task 34)

6. **Document read vs computed field**
   - Explain that line_total is stored (not a property)
   - Note performance benefit for queries
   - Mention that it can become stale if not recalculated

### Line Total Calculation Formula

```
line_total = (quantity_ordered × unit_price) + tax_amount

Where:
- quantity_ordered: from Task 22
- unit_price: from Task 23 (after line discount)
- tax_amount: from Task 25

Example:
├── quantity_ordered = 3
├── unit_price = ₨ 5,000 (after discount)
├── subtotal = 3 × ₨ 5,000 = ₨ 15,000
├── tax_amount = ₨ 2,700 (18% VAT)
└── line_total = ₨ 15,000 + ₨ 2,700 = ₨ 17,700
```

### Complete Calculation Flow

```
Step-by-Step Line Total Calculation

1. Start with original_price
   original_price = ₨ 10,000

2. Apply line discount (Task 24)
   discount_type = 'PERCENTAGE'
   discount_value = 10.0
   discount_amount = ₨ 1,000
   unit_price = ₨ 10,000 - ₨ 1,000 = ₨ 9,000

3. Calculate subtotal
   quantity_ordered = 2
   subtotal = ₨ 9,000 × 2 = ₨ 18,000

4. Calculate tax (Task 25)
   tax_rate = 18.0
   tax_amount = ₨ 18,000 × 0.18 = ₨ 3,240

5. Calculate line total
   line_total = ₨ 18,000 + ₨ 3,240 = ₨ 21,240
```

### Calculation Method Implementation

```python
def calculate_line_total(self):
    """
    Calculate the total amount for this line item.
    
    Formula: (quantity_ordered × unit_price) + tax_amount
    
    Returns:
        Decimal: The calculated line total
    """
    from decimal import Decimal
    
    subtotal = self.quantity_ordered * self.unit_price
    total = subtotal + self.tax_amount
    
    return Decimal(str(total)).quantize(Decimal('0.01'))
```

### When to Recalculate Line Total

Line total should be recalculated when:
- quantity_ordered changes
- unit_price changes
- discount_value or discount_type changes
- tax_rate or is_taxable changes
- On initial order creation
- When line item is added/updated

Recalculation triggers:
- Pre-save signal (automatic)
- Explicit service method call
- Order recalculation service (Task 34)

### Stored vs Computed Field Trade-offs

**Stored Field (Current Approach):**
- ✅ Fast queries and aggregations
- ✅ No repeated calculations
- ✅ Efficient for reporting
- ❌ Can become stale
- ❌ Requires recalculation logic

**Computed Property:**
- ✅ Always accurate
- ✅ No storage needed
- ❌ Slow for large datasets
- ❌ Cannot query/filter efficiently
- ❌ Repeated calculations

**Hybrid Approach (Recommended):**
- Store in database (line_total field)
- Provide calculation method (calculate_line_total)
- Auto-update via signals (Task 34)
- Validate in admin/API

### Line Total in Order Context

```
Order Calculation Hierarchy

Order
├── Line Item 1
│   └── line_total = ₨ 17,700
├── Line Item 2
│   └── line_total = ₨ 8,500
└── Line Item 3
    └── line_total = ₨ 12,300

Order Subtotal = Sum of all line_totals
            = ₨ 17,700 + ₨ 8,500 + ₨ 12,300
            = ₨ 38,500

Order Discount = ₨ 3,000 (order-level discount)
Shipping Fee = ₨ 500
Order Total = ₨ 38,500 - ₨ 3,000 + ₨ 500 = ₨ 36,000
```

### Reporting Queries Enabled

With line_total stored:

**Total Sales by Product:**
```sql
SELECT product_id, SUM(line_total) as total_sales
FROM order_line_items
GROUP BY product_id
```

**Average Order Line Value:**
```sql
SELECT AVG(line_total) as avg_line_value
FROM order_line_items
WHERE created_at >= '2026-01-01'
```

**Top Revenue Products:**
```sql
SELECT item_name, SUM(line_total) as revenue
FROM order_line_items
GROUP BY item_name
ORDER BY revenue DESC
LIMIT 10
```

### Precision and Rounding

Line total should:
- Use Decimal type for accuracy
- Round to 2 decimal places (cents)
- Round to nearest even number (banker's rounding)
- Match invoice precision

**Example:**
```
₨ 17,699.995 → ₨ 17,700.00
₨ 17,699.994 → ₨ 17,699.99
₨ 17,700.005 → ₨ 17,700.00 (banker's rounding)
```

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Previous fields...
    
    # New line total field
    line_total = models.DecimalField(
        max_digits=12, decimal_places=2,
        default=0.0,
        db_index=True
    )
    
    def calculate_line_total(self):
        """Calculate and return line total."""
        from decimal import Decimal
        subtotal = self.quantity_ordered * self.unit_price
        total = subtotal + self.tax_amount
        return Decimal(str(total)).quantize(Decimal('0.01'))
```

### Verification Checklist
- [ ] line_total DecimalField added with default=0.0
- [ ] line_total field indexed for reporting queries
- [ ] Help text explains calculation formula
- [ ] calculate_line_total() method implemented
- [ ] Method uses Decimal for precision
- [ ] Calculation formula documented in comments
- [ ] Recalculation triggers documented
- [ ] Stored vs computed trade-offs explained

---

## Task 27: Add Line Item Status Field

### Overview
Add status tracking field for individual line item fulfillment. This enables tracking each item through picking, packing, and shipping independently of other line items in the order.

### Dependencies
- Task 26: Add Line Item Total Field

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after line_total

2. **Create line item status choices**
   - Define LINE_STATUS_CHOICES at class level
   - Add choice: 'PENDING' - "Pending Allocation"
   - Add choice: 'ALLOCATED' - "Stock Allocated"
   - Add choice: 'PICKED' - "Picked from Warehouse"
   - Add choice: 'PACKED' - "Packed for Shipping"
   - Add choice: 'SHIPPED' - "Shipped to Customer"
   - Add choice: 'DELIVERED' - "Delivered to Customer"
   - Add choice: 'CANCELLED' - "Cancelled"
   - Add choice: 'RETURNED' - "Returned by Customer"

3. **Add status field**
   - `status`: CharField with max_length=20
   - Set choices=LINE_STATUS_CHOICES
   - Set default='PENDING'
   - Add help text: "Fulfillment status of this line item"
   - Add `db_index=True` for filtering

4. **Add status timestamp fields**
   - `allocated_at`: DateTimeField, nullable
   - `picked_at`: DateTimeField, nullable
   - `packed_at`: DateTimeField, nullable
   - `shipped_at`: DateTimeField, nullable
   - `delivered_at`: DateTimeField, nullable
   - All with help text describing status change time

5. **Add fulfillment_notes field**
   - `fulfillment_notes`: TextField
   - Make it nullable (null=True, blank=True)
   - Add help text: "Notes about fulfillment, picking issues, substitutions"
   - Used by warehouse staff

6. **Document status flow**
   - Create comments showing typical status progression
   - Note which statuses are terminal (end states)
   - Explain partial fulfillment handling

7. **Add status validation comments**
   - Document valid status transitions
   - Note that timestamps should be set when status changes
   - Explain relationship to quantity_fulfilled

### Line Item Status Flow

```
Status Progression

PENDING
   │
   ├──→ ALLOCATED (stock reserved)
   │       │
   │       ├──→ PICKED (removed from location)
   │       │       │
   │       │       ├──→ PACKED (ready for shipping)
   │       │       │       │
   │       │       │       ├──→ SHIPPED (dispatched)
   │       │       │       │       │
   │       │       │       │       ├──→ DELIVERED (received)
   │       │       │       │       │
   │       │       │       │       └──→ RETURNED (customer return)
   │       │       │       │
   │       │       │       └──→ CANCELLED (before ship)
   │       │       │
   │       │       └──→ CANCELLED (before pack)
   │       │
   │       └──→ CANCELLED (before pick)
   │
   └──→ CANCELLED (before allocation)
```

### Status Definitions

**PENDING:**
- Initial state when order is placed
- Awaiting stock allocation
- No warehouse action taken yet
- quantity_fulfilled = 0

**ALLOCATED:**
- Stock has been reserved for this order
- Inventory reduced from available
- Awaiting warehouse picking
- Still quantity_fulfilled = 0 (not physically moved)

**PICKED:**
- Item physically picked from warehouse location
- Verified by warehouse staff
- Awaiting packing
- Still quantity_fulfilled = 0 (not shipped)

**PACKED:**
- Item packed in shipping container
- Shipping label generated
- Ready for carrier pickup
- Still quantity_fulfilled = 0 (not left warehouse)

**SHIPPED:**
- Item handed to carrier
- Tracking number assigned
- In transit to customer
- quantity_fulfilled = quantity_ordered (or partial quantity)

**DELIVERED:**
- Item received by customer
- Confirmed via tracking or signature
- Transaction complete
- quantity_fulfilled unchanged (already set at ship)

**CANCELLED:**
- Item cancelled before shipping
- Stock returned to inventory
- quantity_cancelled = pending quantity
- Terminal state

**RETURNED:**
- Item returned by customer after delivery
- Return received and verified
- quantity_returned updated
- Terminal state

### Status Timestamps

Track when each status was achieved:

```
Line Item Timeline

allocated_at: 2026-01-23 09:15:00
   ↓ (30 minutes)
picked_at: 2026-01-23 09:45:00
   ↓ (45 minutes)
packed_at: 2026-01-23 10:30:00
   ↓ (2 hours - awaiting carrier)
shipped_at: 2026-01-23 12:30:00
   ↓ (2 days)
delivered_at: 2026-01-25 14:20:00

Metrics:
- Pick time: 30 minutes
- Pack time: 45 minutes
- Carrier pickup delay: 2 hours
- Delivery time: 2 days
```

### Partial Fulfillment Scenarios

**Scenario 1: Split Shipment**
```
Order: 10 units of Product A

Initial Line Item:
├── quantity_ordered = 10
├── status = 'PENDING'

Stock Check: Only 6 available
├── Split into two line items (or adjust quantities)
├── Line Item 1: 6 units → ALLOCATED → SHIPPED
└── Line Item 2: 4 units → PENDING (backorder)
```

**Scenario 2: Partial Return**
```
Line Item:
├── quantity_ordered = 5
├── quantity_fulfilled = 5
├── status = 'DELIVERED'

Customer returns 2 units:
├── quantity_returned = 2
├── status = 'DELIVERED' (main status unchanged)
└── fulfillment_notes: "2 units returned - damaged in transit"
```

### Status and Inventory Integration

```
Status Change Inventory Impact

PENDING → ALLOCATED:
├── Inventory.available -= quantity
├── Inventory.allocated += quantity
└── allocated_at = now()

ALLOCATED → PICKED:
├── No inventory change (already allocated)
├── Location.quantity -= quantity
└── picked_at = now()

PICKED → PACKED:
├── No inventory change
├── Generate shipping label
└── packed_at = now()

PACKED → SHIPPED:
├── Inventory.allocated -= quantity
├── Inventory.committed += quantity
├── quantity_fulfilled = quantity_ordered
└── shipped_at = now()

SHIPPED → DELIVERED:
├── Inventory.committed -= quantity
├── No further inventory impact
└── delivered_at = now()

ANY → CANCELLED:
├── If allocated: release stock
├── Inventory.allocated -= quantity
├── Inventory.available += quantity
└── quantity_cancelled = pending quantity

DELIVERED → RETURNED:
├── Inventory.available += quantity_returned
├── quantity_returned updated
└── May require inspection/restocking
```

### Valid Status Transitions

| From Status | Valid Next Status | Notes |
|-------------|------------------|-------|
| PENDING | ALLOCATED, CANCELLED | Normal flow or cancel |
| ALLOCATED | PICKED, CANCELLED | Pick or cancel before pick |
| PICKED | PACKED, CANCELLED | Pack or cancel before pack |
| PACKED | SHIPPED, CANCELLED | Ship or last chance cancel |
| SHIPPED | DELIVERED, RETURNED | Complete or return in transit |
| DELIVERED | RETURNED | Can return after delivery |
| CANCELLED | (none) | Terminal state |
| RETURNED | (none) | Terminal state |

### Fulfillment Notes Usage

```
fulfillment_notes Examples:

"Picked from Location A-15-3"
"Substituted blue for red - customer approved"
"Damaged unit found, selected replacement"
"Split shipment - 5 units in first batch"
"Held for backorder - ETA 2026-02-01"
"Rush shipping requested - priority pick"
"Gift wrap applied as requested"
"Picked by: John Doe, Verified by: Jane Smith"
```

### Order Status Derived from Line Statuses

Order-level status can be derived from line item statuses:

**All Lines PENDING:**
- Order Status: PENDING

**All Lines ALLOCATED:**
- Order Status: ALLOCATED

**Mixed Statuses:**
- Order Status: PARTIALLY_FULFILLED

**All Lines SHIPPED or DELIVERED:**
- Order Status: FULFILLED

**Any Lines CANCELLED, Rest PENDING:**
- Order Status: PARTIALLY_CANCELLED

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Line status choices
    LINE_STATUS_CHOICES = [
        ('PENDING', 'Pending Allocation'),
        ('ALLOCATED', 'Stock Allocated'),
        ('PICKED', 'Picked from Warehouse'),
        ('PACKED', 'Packed for Shipping'),
        ('SHIPPED', 'Shipped to Customer'),
        ('DELIVERED', 'Delivered to Customer'),
        ('CANCELLED', 'Cancelled'),
        ('RETURNED', 'Returned by Customer'),
    ]
    
    # Previous fields...
    
    # New status fields
    status = models.CharField(
        max_length=20,
        choices=LINE_STATUS_CHOICES,
        default='PENDING',
        db_index=True
    )
    
    # Status timestamps
    allocated_at = models.DateTimeField(null=True, blank=True)
    picked_at = models.DateTimeField(null=True, blank=True)
    packed_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Fulfillment notes
    fulfillment_notes = models.TextField(null=True, blank=True)
```

### Verification Checklist
- [ ] LINE_STATUS_CHOICES defined with all 8 statuses
- [ ] status CharField added with choices and default
- [ ] allocated_at DateTimeField added as nullable
- [ ] picked_at DateTimeField added as nullable
- [ ] packed_at DateTimeField added as nullable
- [ ] shipped_at DateTimeField added as nullable
- [ ] delivered_at DateTimeField added as nullable
- [ ] fulfillment_notes TextField added as nullable
- [ ] Status flow diagram documented in comments
- [ ] Valid status transitions documented
- [ ] Terminal states identified

---

## Task 28: Add Line Item Warehouse Reference

### Overview
Add fields to reference the warehouse and location from which the line item should be fulfilled. This enables multi-warehouse management and efficient picking.

### Dependencies
- Task 27: Add Line Item Status Field
- Warehouse and WarehouseLocation models from Phase 04

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after status fields

2. **Import Warehouse and WarehouseLocation models**
   - Add imports from warehouse app
   - Ensure proper import path based on project structure

3. **Add warehouse foreign key field**
   - `warehouse`: ForeignKey to Warehouse model
   - Set `on_delete=models.SET_NULL` (preserve order if warehouse deleted)
   - Set `null=True, blank=True` (assigned during allocation)
   - Use `related_name='order_line_items'` for reverse queries
   - Add `db_index=True` for performance
   - Add help text: "Warehouse from which this item will be fulfilled"

4. **Add location foreign key field**
   - `location`: ForeignKey to WarehouseLocation model
   - Set `on_delete=models.SET_NULL` (preserve order if location changed)
   - Set `null=True, blank=True` (assigned during picking)
   - Use `related_name='order_line_items'` for reverse queries
   - Add `db_index=True` for performance
   - Add help text: "Specific warehouse location for picking"

5. **Add picker_assigned_to field**
   - `picker_assigned_to`: ForeignKey to User model (staff)
   - Set `on_delete=models.SET_NULL` (preserve if user deleted)
   - Set `null=True, blank=True` (assigned for picking)
   - Use `related_name='assigned_pick_items'`
   - Add help text: "Staff member assigned to pick this item"

6. **Document warehouse assignment logic**
   - Explain that warehouse is assigned during allocation
   - Note that location is assigned during picking
   - Describe multi-warehouse routing logic

7. **Add warehouse field validation comments**
   - Note that warehouse should be set when status = ALLOCATED
   - Note that location should be set when status = PICKED
   - Explain relationship between warehouse and location

### Warehouse Assignment Flow

```
Order Placement
├── Line items created with warehouse = NULL
│
├── Order Routing Service
│   ├── Analyze inventory across warehouses
│   ├── Consider customer delivery address
│   ├── Apply business rules (proximity, capacity)
│   └── Assign warehouse to each line item
│
├── Stock Allocation (Status: PENDING → ALLOCATED)
│   ├── Reserve stock in assigned warehouse
│   ├── Set line_item.warehouse
│   ├── location still NULL (assigned at pick time)
│   └── Set allocated_at timestamp
│
├── Pick Task Creation (Status: ALLOCATED → PICKED)
│   ├── Create pick list for warehouse staff
│   ├── System determines optimal location
│   ├── Set line_item.location
│   ├── Set line_item.picker_assigned_to
│   └── Set picked_at timestamp
│
└── Fulfillment Complete (Status: PICKED → SHIPPED)
    ├── Item packed and shipped from warehouse
    └── Warehouse and location remain for audit trail
```

### Multi-Warehouse Scenarios

**Scenario 1: Single Warehouse Fulfillment**
```
Order: 3 items
├── Item A: warehouse = "Colombo Main"
├── Item B: warehouse = "Colombo Main"
└── Item C: warehouse = "Colombo Main"

Result: Single shipment from one warehouse
```

**Scenario 2: Split Warehouse Fulfillment**
```
Order: 3 items
├── Item A: warehouse = "Colombo Main" (in stock)
├── Item B: warehouse = "Kandy Branch" (only available here)
└── Item C: warehouse = "Colombo Main" (in stock)

Result: Two separate shipments
- Shipment 1: Items A & C from Colombo
- Shipment 2: Item B from Kandy
```

**Scenario 3: Proximity-Based Routing**
```
Customer Location: Kandy
Inventory Check:
├── Colombo Warehouse: Item available (500km away)
└── Kandy Warehouse: Item available (5km away)

Result: Assign to Kandy warehouse (closer delivery)
```

**Scenario 4: Load Balancing**
```
Multiple Orders at Same Time
├── Colombo Warehouse: 200 pending picks
├── Galle Warehouse: 50 pending picks
└── Both have stock available

Result: Route to Galle to balance workload
```

### Warehouse Location Specificity

```
Warehouse: "Colombo Main"
├── Zone A (Electronics)
│   ├── Location A-01-01 (Smartphones)
│   ├── Location A-01-02 (Laptops)
│   └── Location A-01-03 (Accessories)
├── Zone B (Clothing)
│   ├── Location B-01-01 (Shirts)
│   └── Location B-01-02 (Pants)
└── Zone C (Bulk Items)
    └── Location C-01-01 (Large Boxes)

Line Item Assignment:
├── Product: Smartphone
├── Warehouse: "Colombo Main"
├── Location: A-01-01
└── Picker: "John Doe"
```

### Picker Assignment Logic

```
Pick Task Assignment

1. Order reaches ALLOCATED status
2. System creates pick tasks
3. Assign to available warehouse staff:
   ├── Check staff shift schedule
   ├── Check current workload
   ├── Consider zone familiarity
   └── Assign picker_assigned_to

4. Picker receives notification:
   ├── "Pick 5 items from Zone A"
   ├── Shows location for each item
   ├── Shows item details and images
   └── Mobile device for scanning

5. Picker completes task:
   ├── Scans item barcode
   ├── Confirms quantity picked
   ├── Updates status to PICKED
   └── Sets picked_at timestamp
```

### Warehouse Field Relationships

**warehouse → location:**
- Location must belong to the specified warehouse
- Validate location.warehouse_id == line_item.warehouse_id
- Location is more specific than warehouse

**warehouse → picker:**
- Picker must work at the specified warehouse
- Check user.assigned_warehouses contains warehouse
- Picker may work at multiple warehouses

**SET_NULL Rationale:**
- If warehouse is deleted/renamed: preserve order history
- If location is deleted/reorganized: maintain audit trail
- If picker user is deleted: keep fulfillment record

### Warehouse Reporting Queries

With warehouse fields:

**Orders by Warehouse:**
```sql
SELECT warehouse_id, COUNT(*) as order_count
FROM order_line_items
GROUP BY warehouse_id
```

**Picker Performance:**
```sql
SELECT picker_assigned_to, AVG(picked_at - allocated_at) as avg_pick_time
FROM order_line_items
WHERE picked_at IS NOT NULL
GROUP BY picker_assigned_to
```

**Location Utilization:**
```sql
SELECT location_id, COUNT(*) as picks_count
FROM order_line_items
WHERE status IN ('PICKED', 'PACKED', 'SHIPPED')
GROUP BY location_id
ORDER BY picks_count DESC
```

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Previous fields...
    
    # New warehouse reference fields
    warehouse = models.ForeignKey(
        'warehouses.Warehouse',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='order_line_items',
        db_index=True
    )
    location = models.ForeignKey(
        'warehouses.WarehouseLocation',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='order_line_items',
        db_index=True
    )
    picker_assigned_to = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_pick_items'
    )
```

### Verification Checklist
- [ ] Warehouse and WarehouseLocation models imported
- [ ] warehouse ForeignKey added with SET_NULL
- [ ] location ForeignKey added with SET_NULL
- [ ] picker_assigned_to ForeignKey added with SET_NULL
- [ ] All warehouse fields are nullable and indexed
- [ ] Related names configured for reverse queries
- [ ] Help text explains warehouse assignment timing
- [ ] Warehouse assignment flow documented
- [ ] Multi-warehouse scenarios explained
- [ ] Location validation logic documented

---

## Task 29: Run OrderLineItem Migrations

### Overview
Generate and apply Django migrations for the OrderLineItem model with all fields added in Tasks 19-28. This creates the database table and establishes relationships with other models.

### Dependencies
- All Tasks 19-28 completed (all fields added to model)
- Order model migrations from Group A
- Product and Variant models from Phase 04
- Warehouse models from Phase 04

### Instructions

1. **Verify model completion**
   - Open `apps/orders/models/order_line_item.py`
   - Verify all fields from Tasks 19-28 are present
   - Check that model is imported in `apps/orders/models/__init__.py`
   - Confirm no syntax errors in model file

2. **Review existing migrations**
   - Navigate to `apps/orders/migrations/` directory
   - List existing migration files
   - Note the most recent migration number
   - Ensure Order model migration (0001) exists

3. **Create migration for OrderLineItem**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations orders`
   - Review generated migration file
   - Should be named `0002_orderlineitem.py` (or next sequential)

4. **Review generated migration**
   - Open the generated migration file
   - Verify all fields are included
   - Check foreign key relationships
   - Verify indexes are created
   - Confirm default values are set
   - Check field choices are defined

5. **Check for migration warnings**
   - Review makemigrations output for warnings
   - Address any "You are trying to add non-nullable field" warnings
   - Confirm default values or null=True for new fields
   - Resolve any dependency issues

6. **Apply migration to database**
   - Run: `python manage.py migrate orders`
   - Verify migration applies successfully
   - Check for any SQL errors
   - Confirm table creation

7. **Verify database schema**
   - Connect to PostgreSQL database
   - Check that `order_line_items` table exists
   - Verify all columns are present
   - Confirm foreign key constraints
   - Check indexes are created

8. **Test model in Django shell**
   - Run: `python manage.py shell`
   - Import OrderLineItem model
   - Create a test line item (don't save)
   - Verify field access works
   - Check model methods function

9. **Verify admin interface (if registered)**
   - Start development server
   - Access Django admin
   - Check OrderLineItem appears in admin
   - Verify all fields are displayed
   - Test creating a line item via admin

10. **Document migration**
    - Note migration number in project docs
    - Update schema documentation
    - Note any special migration considerations
    - Commit migration files to version control

### Migration File Structure

Expected migration file structure:

```python
# 0002_orderlineitem.py

from django.db import migrations, models
import django.db.models.deletion
from django.core.validators import MinValueValidator, MaxValueValidator

class Migration(migrations.Migration):
    dependencies = [
        ('orders', '0001_initial'),  # Order model
        ('products', '0002_product_variant'),
        ('warehouses', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='OrderLineItem',
            fields=[
                # Core fields
                ('id', models.UUIDField(...)),
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
                ('order', models.ForeignKey(...)),
                ('position', models.PositiveIntegerField(...)),
                ('notes', models.TextField(...)),
                
                # Product references
                ('product', models.ForeignKey(...)),
                ('variant', models.ForeignKey(...)),
                
                # Description snapshots
                ('item_name', models.CharField(...)),
                ('item_sku', models.CharField(...)),
                ('item_description', models.TextField(...)),
                ('item_category', models.CharField(...)),
                ('item_image_url', models.URLField(...)),
                
                # Quantities
                ('quantity_ordered', models.DecimalField(...)),
                ('quantity_fulfilled', models.DecimalField(...)),
                ('quantity_returned', models.DecimalField(...)),
                ('quantity_cancelled', models.DecimalField(...)),
                
                # Pricing
                ('unit_price', models.DecimalField(...)),
                ('original_price', models.DecimalField(...)),
                ('cost_price', models.DecimalField(...)),
                ('currency', models.CharField(...)),
                
                # Discounts
                ('discount_type', models.CharField(...)),
                ('discount_value', models.DecimalField(...)),
                ('discount_amount', models.DecimalField(...)),
                ('discount_reason', models.CharField(...)),
                
                # Tax
                ('is_taxable', models.BooleanField(...)),
                ('tax_rate', models.DecimalField(...)),
                ('tax_amount', models.DecimalField(...)),
                ('tax_code', models.CharField(...)),
                
                # Line total
                ('line_total', models.DecimalField(...)),
                
                # Status
                ('status', models.CharField(...)),
                ('allocated_at', models.DateTimeField(...)),
                ('picked_at', models.DateTimeField(...)),
                ('packed_at', models.DateTimeField(...)),
                ('shipped_at', models.DateTimeField(...)),
                ('delivered_at', models.DateTimeField(...)),
                ('fulfillment_notes', models.TextField(...)),
                
                # Warehouse
                ('warehouse', models.ForeignKey(...)),
                ('location', models.ForeignKey(...)),
                ('picker_assigned_to', models.ForeignKey(...)),
            ],
            options={
                'db_table': 'order_line_items',
                'ordering': ['order', 'position'],
            },
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='orderlineitem',
            index=models.Index(fields=['order', 'position']),
        ),
        migrations.AddIndex(
            model_name='orderlineitem',
            index=models.Index(fields=['product']),
        ),
        migrations.AddIndex(
            model_name='orderlineitem',
            index=models.Index(fields=['status']),
        ),
    ]
```

### Pre-Migration Checklist

Before running makemigrations:
- [ ] All fields properly defined with correct types
- [ ] All ForeignKey fields have on_delete specified
- [ ] All nullable fields have null=True
- [ ] All choice fields have choices defined
- [ ] Default values set where appropriate
- [ ] Validators imported and applied
- [ ] Model Meta options configured
- [ ] Model imported in __init__.py
- [ ] No syntax errors in model file

### Migration Commands

**Create Migration:**
```bash
# Activate virtual environment first
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Create migration for orders app
python manage.py makemigrations orders

# Create migration with custom name
python manage.py makemigrations orders --name orderlineitem_model

# Check what migrations will be created (dry run)
python manage.py makemigrations orders --dry-run
```

**Apply Migration:**
```bash
# Apply all pending migrations
python manage.py migrate

# Apply migrations for specific app
python manage.py migrate orders

# Apply up to specific migration
python manage.py migrate orders 0002

# Show migration plan without applying
python manage.py migrate --plan

# Show SQL that will be executed
python manage.py sqlmigrate orders 0002
```

**Verify Migrations:**
```bash
# Show migration status
python manage.py showmigrations orders

# Check for missing migrations
python manage.py makemigrations --check

# Validate models
python manage.py check
```

### Database Verification Queries

After migration, verify in PostgreSQL:

```sql
-- Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'order_line_items';

-- View table structure
\d order_line_items

-- Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'order_line_items'
ORDER BY ordinal_position;

-- Check foreign keys
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name = 'order_line_items'
AND constraint_name LIKE '%_fkey';

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'order_line_items';
```

### Common Migration Issues

**Issue 1: Non-nullable field without default**
```
Error: You are trying to add a non-nullable field 'item_name' 
to orderlineitem without a default
```
Solution: Add default value or make field nullable

**Issue 2: Dependency cycle**
```
Error: Circular dependency detected
```
Solution: Review and reorder dependencies in migration

**Issue 3: Foreign key constraint fails**
```
Error: relation "products_product" does not exist
```
Solution: Ensure product migrations run first, check dependencies

**Issue 4: Decimal field precision**
```
Warning: Decimal field precision may lose data
```
Solution: Verify max_digits and decimal_places are sufficient

### Django Shell Testing

After migration, test in shell:

```python
# Start shell
python manage.py shell

# Import models
from apps.orders.models import Order, OrderLineItem
from apps.products.models import Product
from decimal import Decimal

# Create test data (don't save to avoid constraints)
line_item = OrderLineItem()
line_item.item_name = "Test Product"
line_item.quantity_ordered = Decimal('5.00')
line_item.unit_price = Decimal('1000.00')
line_item.tax_rate = Decimal('18.00')

# Test calculation method
total = line_item.calculate_line_total()
print(f"Calculated total: {total}")

# Test field access
print(f"Status: {line_item.status}")
print(f"Status choices: {OrderLineItem.LINE_STATUS_CHOICES}")
```

### Rollback Plan

If migration fails or needs reversal:

```bash
# Rollback to previous migration
python manage.py migrate orders 0001

# Show current migration state
python manage.py showmigrations orders

# If needed, delete migration file and recreate
rm apps/orders/migrations/0002_orderlineitem.py
python manage.py makemigrations orders
```

### Expected Outcome

After successful migration:
```
apps/orders/migrations/
├── __init__.py
├── 0001_initial.py          # Order model
└── 0002_orderlineitem.py    # New migration

Database:
└── order_line_items table created with:
    ├── All 40+ columns
    ├── Foreign key constraints to orders, products, warehouses
    ├── Indexes on key fields
    └── Check constraints for validators
```

### Verification Checklist
- [ ] `makemigrations` command executed successfully
- [ ] Migration file generated (0002_orderlineitem.py)
- [ ] Migration file reviewed and contains all fields
- [ ] No migration warnings or errors
- [ ] Dependencies correctly listed in migration
- [ ] `migrate` command executed successfully
- [ ] Database table `order_line_items` created
- [ ] All columns present in database
- [ ] Foreign key constraints established
- [ ] Indexes created on key fields
- [ ] Django shell tests pass
- [ ] Model accessible from code
- [ ] Migration file committed to version control

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Add Line Item Tax Fields | is_taxable, tax_rate, tax_amount, tax_code |
| 26 | Add Line Item Total Field | line_total with calculation method |
| 27 | Add Line Item Status Field | Status flow with timestamps |
| 28 | Add Line Item Warehouse Reference | warehouse, location, picker ForeignKeys |
| 29 | Run OrderLineItem Migrations | Database table created |

### Complete OrderLineItem Model

```python
class OrderLineItem(TenantAwareModel):
    # Core fields (Task 19)
    order, position, notes
    
    # Product references (Task 20)
    product, variant
    
    # Snapshot descriptions (Task 21)
    item_name, item_sku, item_description, item_category, item_image_url
    
    # Quantities (Task 22)
    quantity_ordered, quantity_fulfilled, quantity_returned, quantity_cancelled
    
    # Pricing (Task 23)
    unit_price, original_price, cost_price, currency
    
    # Discounts (Task 24)
    discount_type, discount_value, discount_amount, discount_reason
    
    # Tax (Task 25)
    is_taxable, tax_rate, tax_amount, tax_code
    
    # Line total (Task 26)
    line_total, calculate_line_total()
    
    # Status (Task 27)
    status, allocated_at, picked_at, packed_at, shipped_at, delivered_at, fulfillment_notes
    
    # Warehouse (Task 28)
    warehouse, location, picker_assigned_to
```

### Database Schema Created

```
Table: order_line_items
├── 40+ columns
├── 6 Foreign Keys (order, product, variant, warehouse, location, picker)
├── 8 Indexes (FKs + status + key fields)
├── 3 Choice fields (discount_type, status)
└── 10+ validators (min/max values)
```

### Next Steps

1. **Proceed to Document 03** for calculation services (Tasks 30-34)
2. **Implement calculation logic** for line totals and taxes
3. **Add recalculation signals** for automatic updates
4. **Test with sample data** to verify calculations
5. **Integrate with Order model** for total calculation

---

## Notes for AI Agents

1. **Migration Best Practice:** Always review generated migration before applying
2. **Database Backup:** In production, backup database before running migrations
3. **Field Organization:** Group related fields together in model file
4. **Status Flow:** Enforce status transitions in business logic, not database constraints
5. **Warehouse Assignment:** Should happen in allocation service, not on model save
6. **Calculation Timing:** line_total should be calculated and stored, not computed on-the-fly
7. **Timestamp Management:** Use Django's `auto_now` or signal handlers for timestamps
8. **Sri Lanka Tax:** Default VAT rate is 18% but should be configurable
9. **Testing:** Write unit tests for line item calculations before production use
10. **Performance:** Indexes on foreign keys are critical for query performance

