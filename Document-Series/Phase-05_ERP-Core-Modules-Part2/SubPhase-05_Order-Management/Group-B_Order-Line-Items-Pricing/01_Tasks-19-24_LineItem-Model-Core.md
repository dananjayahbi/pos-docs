# Tasks 19-24: OrderLineItem Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** B - Order Line Items & Pricing  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-29_Tax-Status-Warehouse-Migration.md](02_Tasks-25-29_Tax-Status-Warehouse-Migration.md)
- **← Previous Group:** [../Group-A_Order-Model-Status-System/](../Group-A_Order-Model-Status-System/)

---

## Document Overview

This document covers the creation of the OrderLineItem model with core fields for product references, descriptions, quantities, pricing, and discounts. Each line item represents one product/variant in an order with complete snapshot data for order fulfillment and history.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create OrderLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Reference | Medium | 20 min |
| 21 | Add Line Item Description Fields | Medium | 20 min |
| 22 | Add Line Item Quantity Fields | Medium | 20 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Discount Fields | Medium | 20 min |

---

## Task 19: Create OrderLineItem Model

### Overview
Create the OrderLineItem model as a separate model file that represents individual items in an order. This model captures detailed information about each product ordered including quantities, pricing, and fulfillment status.

### Dependencies
- Order model from Group A (Tasks 01-18)
- Base model mixins from Phase 03
- Multi-tenancy schema configuration from Phase 02

### Instructions

1. **Create the model file**
   - Navigate to `apps/orders/models/` directory
   - Create new file `order_line_item.py`
   - Import necessary Django model components
   - Import Order model from same package

2. **Define the OrderLineItem class**
   - Inherit from tenant-aware base model
   - Add class docstring explaining line item purpose
   - Set `verbose_name` to "Order Line Item"
   - Set `verbose_name_plural` to "Order Line Items"

3. **Add primary identification fields**
   - `order`: ForeignKey to Order model with CASCADE delete
   - Use `related_name='line_items'` for reverse relation
   - Add `db_index=True` for query performance
   - Add help text describing the parent order relationship

4. **Add position field**
   - `position`: PositiveIntegerField for line item ordering
   - Set default value to 0
   - Add help text: "Position of this item in the order (for display ordering)"
   - Use this for maintaining user-defined item order

5. **Add notes field**
   - `notes`: TextField for line-specific notes
   - Make it blank=True, null=True
   - Add help text: "Special instructions or notes for this line item"
   - Use for customization requests, special handling

6. **Configure model Meta options**
   - Set `db_table = 'order_line_items'`
   - Set `ordering = ['order', 'position']` for default ordering
   - Add unique_together constraint on ['order', 'position'] if needed
   - Add indexes for frequently queried fields

7. **Add __str__ method**
   - Return string format: "Order #{order_number} - Item {position}"
   - Make it informative for admin interface
   - Include order number and position for clarity

8. **Add __repr__ method**
   - Return detailed representation for debugging
   - Include model name, order ID, position, and primary key

9. **Update model __init__.py**
   - Import OrderLineItem from order_line_item module
   - Add to __all__ list for proper exports
   - Ensure model is registered for migrations

### Model Structure

```
OrderLineItem Model
├── Core Fields
│   ├── order (FK to Order)
│   ├── position (PositiveIntegerField)
│   └── notes (TextField, optional)
├── Base Model Fields (inherited)
│   ├── id (UUID)
│   ├── created_at
│   ├── updated_at
│   └── is_active
└── Methods
    ├── __str__()
    └── __repr__()
```

### Ordering Logic

Line items should be displayed in the order specified by the position field:
- Position 0: First item (top of the list)
- Position 1: Second item
- Position 2: Third item
- And so on...

This allows for:
- Manual reordering by users
- Maintaining product bundle order
- Consistent display across interfaces

### Notes Field Usage

The notes field serves multiple purposes:
- **Custom Engraving:** "Engrave: 'Happy Birthday Sarah'"
- **Special Requests:** "Gift wrap requested"
- **Substitution Notes:** "If out of stock, substitute with similar"
- **Assembly Instructions:** "Do not assemble, ship flat"
- **Gift Messages:** "Gift card message: Happy Anniversary!"

### Expected Outcome
```
apps/orders/models/
├── __init__.py
├── order.py
└── order_line_item.py        # New file - Tasks 19-24
```

### Verification Checklist
- [ ] `order_line_item.py` file created in `apps/orders/models/`
- [ ] OrderLineItem class defined with tenant-aware base
- [ ] order ForeignKey field with CASCADE delete configured
- [ ] position field for item ordering added
- [ ] notes field for line-specific instructions added
- [ ] Model Meta with db_table and ordering configured
- [ ] __str__ method returns readable format
- [ ] __repr__ method returns debug-friendly format
- [ ] Model imported in `models/__init__.py`

---

## Task 20: Add Line Item Product Reference

### Overview
Add fields to reference the product and variant being ordered. These fields link to the product catalog but are nullable to support custom/manual line items that don't exist in the catalog.

### Dependencies
- Task 19: Create OrderLineItem Model
- Product and ProductVariant models from Phase 04

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate the field definition section

2. **Import Product and ProductVariant models**
   - Add imports from products app: `from apps.products.models import Product, ProductVariant`
   - Ensure proper import path based on project structure

3. **Add product foreign key field**
   - `product`: ForeignKey to Product model
   - Set `on_delete=models.SET_NULL` (preserve order history if product deleted)
   - Set `null=True, blank=True` (allow custom items)
   - Use `related_name='order_line_items'` for reverse queries
   - Add `db_index=True` for performance
   - Add help text: "Product being ordered (null for custom items)"

4. **Add variant foreign key field**
   - `variant`: ForeignKey to ProductVariant model
   - Set `on_delete=models.SET_NULL` (preserve order history)
   - Set `null=True, blank=True` (not all products have variants)
   - Use `related_name='order_line_items'` for reverse queries
   - Add `db_index=True` for performance
   - Add help text: "Product variant if applicable (e.g., size, color)"

5. **Add field validation logic comments**
   - Document that either product OR manual fields should be set
   - Note that variant requires product to be set
   - Explain the relationship between product and variant

### Product Reference Patterns

**Pattern 1: Catalog Product (No Variant)**
- Product: FK to "Blue T-Shirt" product
- Variant: NULL
- Use Case: Simple products without variations

**Pattern 2: Catalog Product with Variant**
- Product: FK to "Blue T-Shirt" product
- Variant: FK to "Medium" variant
- Use Case: Products with size/color/style options

**Pattern 3: Custom Line Item**
- Product: NULL
- Variant: NULL
- Use Case: Manual items (labor, custom services, one-off items)
- Requires manual description fields (Task 21)

### Why SET_NULL on Delete?

When a product is deleted from the catalog:
- Order line items remain intact
- Historical orders stay complete
- Snapshot fields preserve product data
- Reports and analytics remain accurate

This preserves:
- Order history for accounting
- Customer order records
- Sales reporting accuracy
- Audit trail compliance

### Product vs Variant Relationship

```
Product: T-Shirt (Parent)
├── Variant: Small/Red
├── Variant: Small/Blue
├── Variant: Medium/Red
├── Variant: Medium/Blue
├── Variant: Large/Red
└── Variant: Large/Blue

Line Item References:
- product = T-Shirt
- variant = Medium/Red
```

### Query Performance Considerations

Add indexes for:
- `product_id`: Fast lookup of all line items for a product
- `variant_id`: Fast lookup of variant-specific orders
- Combined index on both for variant availability queries

These support:
- "Which orders contain this product?"
- "How many units of this variant are on order?"
- "What's the demand history for this variant?"

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    order = models.ForeignKey(...)
    position = models.PositiveIntegerField(...)
    notes = models.TextField(...)
    
    # New product reference fields
    product = models.ForeignKey(Product, ...)
    variant = models.ForeignKey(ProductVariant, ...)
```

### Verification Checklist
- [ ] Product and ProductVariant models imported
- [ ] product ForeignKey field added with SET_NULL
- [ ] product field is nullable and indexed
- [ ] variant ForeignKey field added with SET_NULL
- [ ] variant field is nullable and indexed
- [ ] Related names configured for reverse queries
- [ ] Help text explains nullable nature for custom items
- [ ] Field validation logic documented in comments

---

## Task 21: Add Line Item Description Fields

### Overview
Add snapshot fields that capture product information at the time of order. These fields preserve product details even if the catalog product is modified or deleted, ensuring order history remains accurate.

### Dependencies
- Task 20: Add Line Item Product Reference

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate the field definition section after product references

2. **Add item_name field**
   - `item_name`: CharField with max_length=255
   - Make it non-nullable (blank=False)
   - Add help text: "Product name snapshot at time of order"
   - This preserves the name even if product name changes
   - Add `db_index=True` for search performance

3. **Add item_sku field**
   - `item_sku`: CharField with max_length=100
   - Make it nullable (null=True, blank=True) for custom items
   - Add help text: "Product SKU snapshot at time of order"
   - Preserves SKU even if product SKU changes
   - Add `db_index=True` for reporting queries

4. **Add item_description field**
   - `item_description`: TextField
   - Make it nullable (null=True, blank=True)
   - Add help text: "Product description snapshot at time of order"
   - Stores full product description for reference
   - Useful for customer service and disputes

5. **Add item_category field**
   - `item_category`: CharField with max_length=100
   - Make it nullable (null=True, blank=True)
   - Add help text: "Product category at time of order"
   - Preserves category for reporting even if categorization changes

6. **Add item_image_url field**
   - `item_image_url`: URLField with max_length=500
   - Make it nullable (null=True, blank=True)
   - Add help text: "Product primary image URL at time of order"
   - Snapshot of product image for order history display

7. **Document snapshot strategy in comments**
   - Explain that these fields capture point-in-time data
   - Note that they should be populated from product at order creation
   - Mention that they remain unchanged after order is placed

### Snapshot Pattern Rationale

**Why Snapshot Product Data?**

1. **Price Integrity:** Product prices change; orders must reflect prices at purchase time
2. **Historical Accuracy:** Reports show what was actually sold, not current catalog
3. **Customer Service:** Support staff see exactly what customer ordered
4. **Legal Requirements:** Invoices must match what was agreed at transaction time
5. **Product Changes:** Products evolve; orders should reflect specific version sold

**Example Scenario:**

```
Time: January 2026
- Product: "Wireless Mouse Pro"
- Price: ₨ 3,500
- Description: "Ergonomic wireless mouse with 5 buttons"
- Category: "Computer Accessories"

Customer places order → Fields snapshot this data

Time: March 2026
- Product renamed: "ErgoMouse Professional"
- Price increased: ₨ 4,200
- Description enhanced with new features
- Category changed: "Peripherals > Mice"

Original order still shows:
- Name: "Wireless Mouse Pro"
- Price: ₨ 3,500 (from pricing fields in Task 23)
- Description: "Ergonomic wireless mouse with 5 buttons"
- Category: "Computer Accessories"
```

### Field Population Flow

```
Order Creation
├── Check product FK
│   ├── If product exists:
│   │   ├── Copy product.name → item_name
│   │   ├── Copy product.sku → item_sku
│   │   ├── Copy product.description → item_description
│   │   ├── Copy product.category.name → item_category
│   │   └── Copy product.primary_image.url → item_image_url
│   └── If custom item:
│       ├── User provides item_name (required)
│       └── Other fields remain null/blank
└── Fields never change after order placement
```

### Search and Reporting Benefits

These indexed fields enable:
- **Search Orders by Product Name:** "Find all orders containing 'Mouse'"
- **SKU-Based Reports:** "Total sales for SKU ABC123"
- **Category Analysis:** "Revenue by category over time"
- **Historical Price Analysis:** Compare historical vs current prices

### Custom Item Handling

For manual/custom line items (product=NULL):
- `item_name`: User must provide (required)
- `item_sku`: Optional (can be left blank)
- `item_description`: Optional (can be left blank)
- `item_category`: Optional (could be "Custom" or "Services")
- `item_image_url`: Optional (no image for custom items)

Examples:
- "Installation Service"
- "Custom Engraving"
- "Rush Delivery Fee"
- "Special Order Item"

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Core fields
    order = models.ForeignKey(...)
    position = models.PositiveIntegerField(...)
    notes = models.TextField(...)
    
    # Product references
    product = models.ForeignKey(Product, ...)
    variant = models.ForeignKey(ProductVariant, ...)
    
    # New snapshot description fields
    item_name = models.CharField(max_length=255, db_index=True)
    item_sku = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    item_description = models.TextField(null=True, blank=True)
    item_category = models.CharField(max_length=100, null=True, blank=True)
    item_image_url = models.URLField(max_length=500, null=True, blank=True)
```

### Verification Checklist
- [ ] item_name CharField added as required field with index
- [ ] item_sku CharField added as nullable field with index
- [ ] item_description TextField added as nullable field
- [ ] item_category CharField added as nullable field
- [ ] item_image_url URLField added as nullable field
- [ ] All fields have appropriate help_text
- [ ] Snapshot strategy documented in comments
- [ ] Fields marked as immutable after order creation (in comments)

---

## Task 22: Add Line Item Quantity Fields

### Overview
Add fields to track ordered, fulfilled, and returned quantities for each line item. These fields enable partial fulfillment tracking and return management throughout the order lifecycle.

### Dependencies
- Task 21: Add Line Item Description Fields

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after description fields

2. **Add quantity_ordered field**
   - `quantity_ordered`: DecimalField with max_digits=10, decimal_places=2
   - Set default=1.0
   - Add validators for positive value (min_value=0.01)
   - Add help text: "Quantity originally ordered by customer"
   - This is the primary quantity field for the line

3. **Add quantity_fulfilled field**
   - `quantity_fulfilled`: DecimalField with max_digits=10, decimal_places=2
   - Set default=0.0
   - Add validators for non-negative value (min_value=0)
   - Add help text: "Quantity shipped/delivered to customer"
   - Track fulfillment progress

4. **Add quantity_returned field**
   - `quantity_returned`: DecimalField with max_digits=10, decimal_places=2
   - Set default=0.0
   - Add validators for non-negative value (min_value=0)
   - Add help text: "Quantity returned by customer after fulfillment"
   - Support return/refund processing

5. **Add quantity_cancelled field**
   - `quantity_cancelled`: DecimalField with max_digits=10, decimal_places=2
   - Set default=0.0
   - Add validators for non-negative value (min_value=0)
   - Add help text: "Quantity cancelled before fulfillment"
   - Track pre-fulfillment cancellations

6. **Import validators**
   - Import MinValueValidator from django.core.validators
   - Apply to quantity fields for validation

7. **Document quantity relationships in comments**
   - Note invariants: quantity_fulfilled + quantity_cancelled <= quantity_ordered
   - Note: quantity_returned <= quantity_fulfilled
   - Explain partial fulfillment scenarios

8. **Add computed property method (optional)**
   - Create `quantity_remaining` property
   - Calculate: quantity_ordered - quantity_fulfilled - quantity_cancelled
   - Returns unfulfilled quantity still pending

### Quantity Tracking States

```
Quantity Lifecycle

quantity_ordered = 10
        │
        ├──→ quantity_fulfilled = 8    (shipped)
        │    └──→ quantity_returned = 2 (returned after delivery)
        │
        └──→ quantity_cancelled = 2     (cancelled before shipping)

Remaining: quantity_ordered - quantity_fulfilled - quantity_cancelled = 0
```

### Use Cases for Different Quantities

**Full Fulfillment:**
```
quantity_ordered = 5
quantity_fulfilled = 5
quantity_cancelled = 0
quantity_returned = 0
Status: Complete
```

**Partial Fulfillment:**
```
quantity_ordered = 10
quantity_fulfilled = 6    (first shipment)
quantity_cancelled = 0
quantity_returned = 0
Status: Partially Fulfilled (4 remaining)
```

**Partial Cancellation:**
```
quantity_ordered = 8
quantity_fulfilled = 5
quantity_cancelled = 3    (customer cancelled 3 units)
quantity_returned = 0
Status: Partially Fulfilled, Partially Cancelled
```

**With Returns:**
```
quantity_ordered = 12
quantity_fulfilled = 12
quantity_cancelled = 0
quantity_returned = 2     (customer returned 2 after delivery)
Status: Complete with Partial Return
```

### Why Decimal Instead of Integer?

DecimalField allows for:
- **Fractional Units:** 0.5 kg, 1.25 meters, 2.75 liters
- **Precise Measurements:** No floating-point rounding errors
- **Bulk Products:** Items sold by weight or volume
- **Consistency:** Same precision as pricing calculations

Examples:
- Rice sold by kilogram: 2.5 kg
- Fabric sold by meter: 3.75 m
- Paint sold by liter: 1.5 L
- Cable sold by meter: 10.25 m

### Validation Rules

**Quantity Ordered:**
- Must be > 0 (cannot order zero or negative)
- Typically set once at order creation
- Can be edited before fulfillment starts

**Quantity Fulfilled:**
- Must be >= 0
- Cannot exceed (quantity_ordered - quantity_cancelled)
- Increments as shipments are made
- Final value should equal shipped quantity

**Quantity Returned:**
- Must be >= 0
- Cannot exceed quantity_fulfilled
- Typically set after return is received
- Triggers refund/credit processing

**Quantity Cancelled:**
- Must be >= 0
- Cannot exceed (quantity_ordered - quantity_fulfilled)
- Can only be set before/during fulfillment
- Reduces the amount to fulfill

### Inventory Implications

```
Order Placed (quantity_ordered = 10)
├── Reserve Stock: -10 available
│
├── Fulfillment (quantity_fulfilled = 10)
│   └── Commit Stock: -10 committed (already reserved)
│
├── Cancellation (quantity_cancelled = 2)
│   └── Release Stock: +2 available (back to inventory)
│
└── Return (quantity_returned = 3)
    └── Return to Stock: +3 available (if resalable)
```

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Previous fields...
    
    # New quantity tracking fields
    quantity_ordered = models.DecimalField(
        max_digits=10, decimal_places=2, default=1.0,
        validators=[MinValueValidator(0.01)]
    )
    quantity_fulfilled = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0)]
    )
    quantity_returned = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0)]
    )
    quantity_cancelled = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0)]
    )
    
    @property
    def quantity_remaining(self):
        return self.quantity_ordered - self.quantity_fulfilled - self.quantity_cancelled
```

### Verification Checklist
- [ ] quantity_ordered DecimalField added with positive validation
- [ ] quantity_fulfilled DecimalField added with non-negative validation
- [ ] quantity_returned DecimalField added with non-negative validation
- [ ] quantity_cancelled DecimalField added with non-negative validation
- [ ] All quantity fields use max_digits=10, decimal_places=2
- [ ] MinValueValidator imported and applied
- [ ] Help text explains each quantity field purpose
- [ ] Quantity relationships documented in comments
- [ ] Optional quantity_remaining property method added

---

## Task 23: Add Line Item Pricing Fields

### Overview
Add fields to capture pricing information for each line item including unit price, original price, and cost price. These snapshot fields preserve pricing at the time of order for accurate financial records and margin analysis.

### Dependencies
- Task 22: Add Line Item Quantity Fields

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after quantity fields

2. **Add unit_price field**
   - `unit_price`: DecimalField with max_digits=12, decimal_places=2
   - Make it non-nullable (no default)
   - Add help text: "Price per unit at time of order (after line discount)"
   - This is the final price per unit the customer pays
   - Add `db_index=True` for reporting

3. **Add original_price field**
   - `original_price`: DecimalField with max_digits=12, decimal_places=2
   - Make it nullable (null=True, blank=True)
   - Add help text: "Original price per unit before any discounts"
   - Used to show discount amount to customer
   - Useful for promotional reporting

4. **Add cost_price field**
   - `cost_price`: DecimalField with max_digits=12, decimal_places=2
   - Make it nullable (null=True, blank=True)
   - Add help text: "Cost price per unit for margin calculation"
   - Snapshot of product cost at order time
   - Used for profit margin analysis

5. **Add currency field**
   - `currency`: CharField with max_length=3
   - Set default='LKR'
   - Add help text: "Currency code (ISO 4217) for this line item"
   - Supports multi-currency orders in future
   - Typically matches order.currency

6. **Document pricing snapshot strategy**
   - Explain that prices are captured at order creation
   - Note that these fields never change after order is placed
   - Describe relationship between original_price and unit_price

7. **Add price validation comments**
   - Note that unit_price should be <= original_price
   - Explain that cost_price < unit_price ensures profitability
   - Document margin calculation: (unit_price - cost_price) / unit_price

### Pricing Field Relationships

```
Product Catalog Price: ₨ 5,000 (original_price)
        │
        ├──→ Line Discount: -10% (Task 24)
        │
        ├──→ Unit Price: ₨ 4,500 (unit_price)
        │
        └──→ Cost: ₨ 3,000 (cost_price)
             │
             └──→ Margin: (4,500 - 3,000) / 4,500 = 33.3%
```

### Price Snapshot Scenarios

**Scenario 1: Regular Sale (No Discount)**
```
original_price = ₨ 10,000
unit_price = ₨ 10,000
cost_price = ₨ 7,000
discount = None
Customer Pays: 10,000 per unit
Margin: 30%
```

**Scenario 2: Promotional Discount**
```
original_price = ₨ 10,000
unit_price = ₨ 8,500 (15% off)
cost_price = ₨ 7,000
discount = 15% PERCENTAGE
Customer Pays: 8,500 per unit
Margin: 17.6%
```

**Scenario 3: Bulk Discount**
```
original_price = ₨ 10,000
unit_price = ₨ 9,000 (₨ 1,000 off)
cost_price = ₨ 7,000
discount = ₨ 1,000 FIXED
Customer Pays: 9,000 per unit
Margin: 22.2%
```

**Scenario 4: Cost Price Not Tracked**
```
original_price = ₨ 10,000
unit_price = ₨ 10,000
cost_price = NULL
Customer Pays: 10,000 per unit
Margin: Cannot calculate
```

### Currency Considerations

**Current Implementation:**
- Default currency: LKR (Sri Lankan Rupees)
- Symbol: ₨
- Format: ₨ 10,000.00

**Future Multi-Currency Support:**
- USD for international orders
- Conversion rate snapshot needed
- Currency field enables this expansion

**Sri Lanka Currency Formatting:**
- Standard: ₨ 1,234.56
- Large amounts: ₨ 1,234,567.89
- Decimal precision: 2 places (cents)

### Margin Analysis Benefits

With cost_price tracked:
- **Product Profitability:** Which products generate best margins?
- **Discount Impact:** How do discounts affect profitability?
- **Customer Profitability:** Which customers buy high-margin products?
- **Seasonal Analysis:** Margin trends over time
- **Vendor Performance:** Track cost changes from suppliers

### Pricing Data Flow

```
Order Creation Process
│
├── Load Product Price
│   ├── Get product.price → original_price
│   └── Get product.cost → cost_price
│
├── Apply Line Discounts (Task 24)
│   ├── Calculate discount amount
│   └── Set unit_price = original_price - discount
│
├── Calculate Line Total (Task 26)
│   └── line_total = quantity_ordered * unit_price
│
└── Never modify prices after order placed
```

### Why Decimal Precision 12,2?

**12 Total Digits:**
- Max value: 9,999,999,999.99 (nearly 10 billion)
- Supports high-value B2B orders
- Handles bulk quantities * unit price

**2 Decimal Places:**
- Standard currency precision
- LKR has 100 cents per rupee
- Matches accounting standards

**Examples:**
- Small item: ₨ 125.50
- Medium item: ₨ 15,750.00
- Large item: ₨ 1,250,000.00
- Bulk order: ₨ 50,000,000.00

### Price Immutability

Once order is placed:
- Prices NEVER change
- Historical accuracy preserved
- Legal compliance maintained
- Audit trail complete

If price adjustment needed:
- Cancel original order
- Create new order with new prices
- OR apply order-level discount (Task 12-13)
- OR issue credit note/refund

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Previous fields...
    
    # New pricing fields
    unit_price = models.DecimalField(
        max_digits=12, decimal_places=2,
        db_index=True
    )
    original_price = models.DecimalField(
        max_digits=12, decimal_places=2,
        null=True, blank=True
    )
    cost_price = models.DecimalField(
        max_digits=12, decimal_places=2,
        null=True, blank=True
    )
    currency = models.CharField(
        max_length=3, default='LKR'
    )
```

### Verification Checklist
- [ ] unit_price DecimalField added as required field with index
- [ ] original_price DecimalField added as nullable field
- [ ] cost_price DecimalField added as nullable field
- [ ] All price fields use max_digits=12, decimal_places=2
- [ ] currency CharField added with default='LKR'
- [ ] Help text explains each pricing field purpose
- [ ] Price snapshot strategy documented in comments
- [ ] Price immutability documented in comments
- [ ] Margin calculation formula documented

---

## Task 24: Add Line Item Discount Fields

### Overview
Add fields to track line-level discounts applied to individual items. These fields support both percentage and fixed amount discounts, enabling promotional pricing and customer-specific deals.

### Dependencies
- Task 23: Add Line Item Pricing Fields

### Instructions

1. **Open the OrderLineItem model file**
   - Navigate to `apps/orders/models/order_line_item.py`
   - Locate field definition section after pricing fields

2. **Create discount type choices**
   - Define DISCOUNT_TYPE_CHOICES at class level
   - Add choice: 'PERCENTAGE' - "Percentage (%)"
   - Add choice: 'FIXED' - "Fixed Amount"
   - Add choice: 'NONE' - "No Discount"

3. **Add discount_type field**
   - `discount_type`: CharField with max_length=20
   - Set choices=DISCOUNT_TYPE_CHOICES
   - Set default='NONE'
   - Add help text: "Type of discount applied to this line item"
   - Add `db_index=True` for reporting

4. **Add discount_value field**
   - `discount_value`: DecimalField with max_digits=10, decimal_places=2
   - Set default=0.0
   - Add validators for non-negative value (min_value=0)
   - Add help text: "Discount value (percentage or fixed amount depending on type)"
   - For PERCENTAGE: value between 0-100
   - For FIXED: absolute amount in currency

5. **Add discount_amount field**
   - `discount_amount`: DecimalField with max_digits=12, decimal_places=2
   - Set default=0.0
   - Add validators for non-negative value (min_value=0)
   - Add help text: "Calculated discount amount in currency"
   - This is the computed discount applied
   - Read-only computed field

6. **Add discount_reason field**
   - `discount_reason`: CharField with max_length=200
   - Make it nullable (null=True, blank=True)
   - Add help text: "Reason for discount (e.g., promo code, loyalty, manual)"
   - Useful for tracking discount sources

7. **Import validators for discount_value**
   - Import MaxValueValidator from django.core.validators
   - For PERCENTAGE type, value should be <= 100
   - Note this in validation comments

8. **Document discount calculation logic**
   - Explain how discount_amount is computed from discount_value
   - Note relationship to original_price and unit_price
   - Document that unit_price = original_price - (discount per unit)

9. **Add discount validation comments**
   - Note that PERCENTAGE discount_value should be 0-100
   - Note that FIXED discount should not exceed original_price
   - Explain that discount_amount is always positive

### Discount Types Explained

**PERCENTAGE Discount:**
```
original_price = ₨ 10,000
discount_type = 'PERCENTAGE'
discount_value = 15.0 (15%)
discount_amount = ₨ 10,000 * 0.15 = ₨ 1,500
unit_price = ₨ 10,000 - ₨ 1,500 = ₨ 8,500
```

**FIXED Amount Discount:**
```
original_price = ₨ 10,000
discount_type = 'FIXED'
discount_value = 2000.0 (₨ 2,000)
discount_amount = ₨ 2,000
unit_price = ₨ 10,000 - ₨ 2,000 = ₨ 8,000
```

**NO Discount:**
```
original_price = ₨ 10,000
discount_type = 'NONE'
discount_value = 0.0
discount_amount = ₨ 0
unit_price = ₨ 10,000
```

### Discount Calculation Flow

```
Step 1: Determine Discount Type
├── PERCENTAGE
│   ├── discount_amount = original_price * (discount_value / 100)
│   └── unit_price = original_price - discount_amount
│
├── FIXED
│   ├── discount_amount = discount_value
│   └── unit_price = original_price - discount_amount
│
└── NONE
    ├── discount_amount = 0
    └── unit_price = original_price

Step 2: Validate
├── Ensure discount_amount >= 0
├── Ensure unit_price >= 0
└── Ensure discount_amount <= original_price
```

### Line Discount vs Order Discount

**Line-Level Discount (This Task):**
- Applied to individual line items
- Product-specific promotions
- "Buy 5, get 10% off each"
- Variant-specific deals
- Examples: Product sale, bulk discount per item

**Order-Level Discount (Tasks 12-13 in Group A):**
- Applied to entire order total
- Cart-wide promotions
- "₨ 1,000 off orders over ₨ 10,000"
- Loyalty discounts
- Examples: Coupon codes, member discounts

**Both Can Apply:**
```
Line Item 1:
  original_price: ₨ 5,000
  line_discount: -10% (₨ 500)
  unit_price: ₨ 4,500
  quantity: 2
  line_total: ₨ 9,000

Order:
  subtotal: ₨ 9,000 (sum of line totals)
  order_discount: -₨ 1,000
  total: ₨ 8,000
```

### Common Discount Scenarios

**Bulk Purchase Discount:**
```
discount_type = 'PERCENTAGE'
discount_value = 10.0
discount_reason = 'Bulk purchase (10+ units)'
Applied when: quantity_ordered >= 10
```

**Loyalty Member Discount:**
```
discount_type = 'PERCENTAGE'
discount_value = 5.0
discount_reason = 'Platinum member discount'
Applied to: All items for platinum members
```

**Promotional Sale:**
```
discount_type = 'PERCENTAGE'
discount_value = 25.0
discount_reason = 'New Year Sale 2026'
Applied when: Product in promotion
```

**Manual Price Adjustment:**
```
discount_type = 'FIXED'
discount_value = 1500.0
discount_reason = 'Manager approval - customer loyalty'
Applied by: Admin/Manager manually
```

**Damaged Item Discount:**
```
discount_type = 'PERCENTAGE'
discount_value = 30.0
discount_reason = 'Display model - minor scratches'
Applied to: Specific items marked as damaged
```

### Discount Reason Examples

| Discount Reason | Description |
|----------------|-------------|
| "PROMO2026NY" | New Year promo code |
| "BULK10" | Bulk purchase discount |
| "LOYALTY_PLATINUM" | Loyalty tier discount |
| "CLEARANCE" | Clearance sale |
| "BOGO50" | Buy one get 50% off |
| "EMPLOYEE" | Employee discount |
| "PRICE_MATCH" | Competitor price match |
| "MANUAL_ADJ" | Manual adjustment by staff |
| "DAMAGED_ITEM" | Damage/defect discount |

### Validation Rules

**For PERCENTAGE:**
- discount_value must be 0-100
- discount_amount = original_price * (discount_value / 100)
- Cannot exceed 100%

**For FIXED:**
- discount_value must be >= 0
- discount_value should not exceed original_price * quantity
- discount_amount = discount_value

**For NONE:**
- discount_value should be 0
- discount_amount should be 0

**Universal Rules:**
- unit_price must be >= 0 after discount
- discount_amount must be >= 0
- original_price should be >= unit_price

### Reporting Benefits

Track discount effectiveness:
- **Most Used Discounts:** Which reasons appear most?
- **Discount Impact:** Revenue lost to discounts
- **Promotional ROI:** Did discounted items drive sales?
- **Customer Segments:** Who uses discounts most?
- **Product Performance:** Which products need discounts to sell?

### Expected Outcome
```python
# OrderLineItem model now includes:
class OrderLineItem(TenantAwareModel):
    # Discount type choices
    DISCOUNT_TYPE_CHOICES = [
        ('PERCENTAGE', 'Percentage (%)'),
        ('FIXED', 'Fixed Amount'),
        ('NONE', 'No Discount'),
    ]
    
    # Previous fields...
    
    # New discount fields
    discount_type = models.CharField(
        max_length=20,
        choices=DISCOUNT_TYPE_CHOICES,
        default='NONE',
        db_index=True
    )
    discount_value = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0)]
    )
    discount_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.0,
        validators=[MinValueValidator(0)]
    )
    discount_reason = models.CharField(
        max_length=200, null=True, blank=True
    )
```

### Verification Checklist
- [ ] DISCOUNT_TYPE_CHOICES defined with PERCENTAGE, FIXED, NONE
- [ ] discount_type CharField added with choices and default
- [ ] discount_value DecimalField added with non-negative validation
- [ ] discount_amount DecimalField added with non-negative validation
- [ ] discount_reason CharField added as nullable field
- [ ] Help text explains each discount field purpose
- [ ] Discount calculation logic documented in comments
- [ ] Validation rules documented for each discount type
- [ ] Relationship to original_price and unit_price documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Create OrderLineItem Model | Base model with order FK, position, notes |
| 20 | Add Line Item Product Reference | product and variant ForeignKeys |
| 21 | Add Line Item Description Fields | Snapshot fields: name, SKU, description, category, image |
| 22 | Add Line Item Quantity Fields | quantity_ordered, fulfilled, returned, cancelled |
| 23 | Add Line Item Pricing Fields | unit_price, original_price, cost_price, currency |
| 24 | Add Line Item Discount Fields | discount_type, value, amount, reason |

### OrderLineItem Model Progress

```python
class OrderLineItem(TenantAwareModel):
    # Core fields (Task 19)
    order = ForeignKey(Order)
    position = PositiveIntegerField
    notes = TextField
    
    # Product references (Task 20)
    product = ForeignKey(Product, null=True)
    variant = ForeignKey(ProductVariant, null=True)
    
    # Snapshot descriptions (Task 21)
    item_name = CharField
    item_sku = CharField
    item_description = TextField
    item_category = CharField
    item_image_url = URLField
    
    # Quantities (Task 22)
    quantity_ordered = DecimalField
    quantity_fulfilled = DecimalField
    quantity_returned = DecimalField
    quantity_cancelled = DecimalField
    
    # Pricing (Task 23)
    unit_price = DecimalField
    original_price = DecimalField
    cost_price = DecimalField
    currency = CharField
    
    # Discounts (Task 24)
    discount_type = CharField(choices)
    discount_value = DecimalField
    discount_amount = DecimalField
    discount_reason = CharField
```

### Key Design Decisions

1. **Snapshot Pattern:** Description and pricing fields snapshot product data at order time
2. **Decimal Precision:** Financial fields use Decimal for accuracy
3. **Nullable References:** product/variant nullable for custom items
4. **Quantity Tracking:** Multiple quantity fields for full lifecycle tracking
5. **Flexible Discounts:** Support both percentage and fixed amount discounts

### Next Steps

1. **Proceed to Document 02** for tax fields, line total, status, and warehouse reference
2. **Run migrations** after completing all field additions (Document 02, Task 29)
3. **Implement calculation services** in Document 03 for computing totals

---

## Notes for AI Agents

1. **No Code Generation:** These are instructions only; model implementation is done by developer
2. **Field Order:** Organize fields logically in model file (core → references → snapshot → quantities → pricing → discounts)
3. **Indexes:** Add indexes to foreign keys and commonly queried fields
4. **Validators:** Import and apply Django validators for field constraints
5. **Help Text:** Every field should have clear, descriptive help text
6. **Comments:** Add inline comments explaining business logic and relationships
7. **Snapshot Immutability:** Emphasize that snapshot fields never change after order creation
8. **Decimal Usage:** Always use DecimalField for financial and quantity data
9. **Sri Lanka Context:** Default currency='LKR', support local pricing formats
10. **Testing:** After implementation, test with various discount types and quantity scenarios

