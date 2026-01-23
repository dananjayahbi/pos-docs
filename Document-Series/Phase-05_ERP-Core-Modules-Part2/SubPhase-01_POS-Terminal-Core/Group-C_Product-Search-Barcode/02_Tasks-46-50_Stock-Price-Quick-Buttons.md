# Tasks 46-50: Stock, Price & Quick Buttons

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** C - Product Search & Barcode  
> **Document:** 02 of 03  
> **Tasks Covered:** 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-39-45_Search-Service-Methods.md](01_Tasks-39-45_Search-Service-Methods.md)
- **→ Next Document:** [03_Tasks-51-54_Barcode-Validation-Filters.md](03_Tasks-51-54_Barcode-Validation-Filters.md)

---

## Document Overview

This document covers enhancing search results with stock availability and pricing information, plus creating the quick button models for fast product access. These features improve the cashier experience by providing immediate product availability feedback and one-touch product selection.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 46 | Add stock availability check | Medium | 20 min |
| 47 | Add price inclusion | Medium | 20 min |
| 48 | Create QuickButtonGroup model | Medium | 25 min |
| 49 | Create QuickButton model | Medium | 25 min |
| 50 | Add button position management | Medium | 20 min |

---

## Task 46: Add Stock Availability Check

### Overview
Enhance search results to include real-time stock availability information, allowing cashiers to see immediately if a product can be sold.

### Dependencies
- Task 40: ProductSearchService class
- Inventory models with stock tracking
- Stock location/warehouse support

### Instructions

1. **Update _format_product_result method**
   - Modify existing method to include stock info
   - Call stock checking logic
   - Add stock-related fields to result dictionary

2. **Create _check_stock_availability method**
   - Define private class method in ProductSearchService
   - Parameters: product instance, location (optional)
   - Return dictionary with stock information

3. **Query current stock quantity**
   - Get available stock for product
   - Consider stock location (default location or all)
   - Handle multi-location scenarios if applicable

4. **Calculate available quantity**
   - Get total stock quantity
   - Subtract reserved/committed quantities
   - Subtract safety stock level
   - Result is available_to_sell quantity

5. **Determine stock status**
   - Calculate stock status based on quantity
   - Status values: 'in_stock', 'low_stock', 'out_of_stock'
   - Use configurable thresholds for low stock

6. **Add reorder information**
   - Include reorder level (min stock level)
   - Include reorder quantity
   - Flag if product below reorder point

7. **Handle product variants stock**
   - For variants, show variant-specific stock
   - For parent products with variants, aggregate or show "varies"
   - Never show parent stock if variants exist

8. **Include stock in all search results**
   - Update all search methods to use enhanced formatting
   - barcode_search, sku_search, name_search all include stock
   - combined_search inherits stock info

9. **Add stock location context**
   - Consider current POS terminal location
   - Show stock for terminal's warehouse/location
   - Option to view stock at other locations

### Stock Information Flow

```
┌─────────────────────┐
│  Product Found      │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────┐
│ _check_stock_availability │
└──────────┬───────────────┘
           │
           ├─► Query Stock Records
           │    ├─ Total quantity
           │    ├─ Reserved quantity
           │    └─ Available = Total - Reserved
           │
           ├─► Determine Status
           │    ├─ available > low_threshold → in_stock
           │    ├─ 0 < available ≤ low_threshold → low_stock
           │    └─ available ≤ 0 → out_of_stock
           │
           └─► Return Stock Info
                ├─ quantity
                ├─ status
                ├─ low_stock_threshold
                └─ reorder_level
```

### Stock Status Determination

| Available Quantity | Status | UI Indicator |
|-------------------|--------|--------------|
| > low_stock_threshold | 'in_stock' | Green / ✓ |
| 1 to low_stock_threshold | 'low_stock' | Yellow / ⚠ |
| ≤ 0 | 'out_of_stock' | Red / ✗ |

### Stock Calculation Example

```
Product: Coca-Cola 500ml

Total Stock: 100 units
Reserved (pending orders): 10 units
Safety Stock: 5 units

Available to Sell = 100 - 10 - 5 = 85 units

Low Stock Threshold: 20 units

Status: in_stock (85 > 20)
```

### Method: _check_stock_availability

```python
@classmethod
def _check_stock_availability(cls, product, location=None):
    """
    Check real-time stock availability for product.
    
    Args:
        product: Product instance to check
        location: Optional stock location (uses default if None)
        
    Returns:
        Dictionary with stock information:
        {
            'quantity': Decimal - total stock
            'available': Decimal - available to sell
            'reserved': Decimal - reserved quantity
            'status': str - 'in_stock', 'low_stock', 'out_of_stock'
            'low_stock_threshold': Decimal
            'reorder_level': Decimal
            'below_reorder': bool
        }
    """
```

### Enhanced Product Result Format

```python
{
    # Existing fields
    'id': 'uuid-1',
    'name': 'Coca-Cola 500ml',
    'sku': 'BEV-COKE-500',
    'barcode': '1234567890123',
    'price': Decimal('150.00'),
    
    # New stock fields
    'stock': {
        'quantity': Decimal('100'),
        'available': Decimal('85'),
        'reserved': Decimal('10'),
        'status': 'in_stock',
        'low_stock_threshold': Decimal('20'),
        'reorder_level': Decimal('30'),
        'below_reorder': False
    },
    
    # Stock UI helpers
    'can_sell': True,
    'stock_warning': None,  # or "Low stock" / "Out of stock"
    
    # Other fields...
}
```

### Stock Location Handling

**Single Location:**
```
Terminal: Terminal-01
Location: Main Warehouse
Action: Show Main Warehouse stock
```

**Multi-Location:**
```
Terminal: Terminal-01
Primary Location: Main Warehouse
Secondary Locations: Branch-A, Branch-B

Show:
- Main Warehouse stock (primary)
- Option to view other locations
- Transfer capability between locations
```

### Stock Status UI Indicators

| Status | Color | Icon | Message |
|--------|-------|------|---------|
| in_stock | Green | ✓ | "In Stock (85 units)" |
| low_stock | Yellow/Amber | ⚠ | "Low Stock (15 units)" |
| out_of_stock | Red | ✗ | "Out of Stock" |

### Reserved Quantity Handling

Reserved quantities include:
- Pending sales orders
- Items in other carts (other terminals)
- Committed to online orders
- Transfer requests

```
Reservation Logic:

Total Stock: 100
├─ Available: 70 (can sell now)
├─ Reserved: 25 (committed elsewhere)
│   ├─ Sales Orders: 15
│   ├─ Other Carts: 5
│   └─ Online Orders: 5
└─ Safety Stock: 5 (minimum buffer)
```

### Configuration Settings

Define in POS settings:
```python
POS_STOCK_SETTINGS = {
    'low_stock_threshold': 20,  # Default low stock level
    'show_out_of_stock': True,   # Show OOS products in search
    'allow_negative_stock': False,  # Allow selling when OOS
    'check_realtime': True,      # Real-time vs cached stock
}
```

### Variant Stock Handling

**Parent with Variants:**
```python
{
    'name': 'T-Shirt',
    'has_variants': True,
    'stock': {
        'status': 'varies',  # Don't show parent stock
        'total_variants': 6,
        'in_stock_variants': 4,
        'message': '4 of 6 sizes available'
    }
}
```

**Specific Variant:**
```python
{
    'name': 'T-Shirt - Red - Large',
    'is_variant': True,
    'stock': {
        'quantity': Decimal('15'),
        'available': Decimal('15'),
        'status': 'in_stock'
    }
}
```

### Performance Optimization

- Cache stock queries for short duration (5-30 seconds)
- Use database indexes on stock tables
- Aggregate stock efficiently (sum queries)
- Consider Redis for real-time stock counts
- Batch stock checks when possible

### Out-of-Stock Product Behavior

**Option 1: Show with warning**
- Display product in search results
- Flag as out of stock with red indicator
- Prevent adding to cart
- Show expected restock date if available

**Option 2: Hide from results**
- Filter out OOS products from search
- Only show available products
- Configurable per terminal/settings

### Use Cases

**Use Case 1: Cashier searches product**
- Search returns product with stock info
- Green indicator shows good stock (85 units)
- Cashier adds to cart confidently

**Use Case 2: Low stock warning**
- Search shows yellow warning (5 units left)
- Cashier informs customer
- May suggest alternative or larger size

**Use Case 3: Out of stock**
- Product shows red indicator (0 units)
- Cannot add to cart
- Cashier offers alternative or rain check

### Verification Checklist
- [ ] _check_stock_availability method created
- [ ] Stock quantity queried correctly
- [ ] Reserved quantity subtracted
- [ ] Stock status calculated (in_stock/low/out)
- [ ] Status thresholds configurable
- [ ] Stock info included in search results
- [ ] Variant stock handled correctly
- [ ] Multi-location support (if applicable)
- [ ] Out-of-stock products handled per config
- [ ] Performance optimized with caching

---

## Task 47: Add Price Inclusion

### Overview
Enhance search results to include effective pricing information, considering customer groups, promotions, quantity discounts, and tenant-specific pricing rules.

### Dependencies
- Task 46: Stock availability feature
- Pricing models from Phase 04
- Customer and pricing rules

### Instructions

1. **Update _format_product_result method**
   - Add pricing information to result dictionary
   - Call pricing calculation logic
   - Include multiple price points if applicable

2. **Create _get_effective_price method**
   - Define private class method in ProductSearchService
   - Parameters: product, customer (optional), quantity (default 1)
   - Return dictionary with pricing information

3. **Get base product price**
   - Query product's standard selling price
   - This is the default price before adjustments
   - Handle price list selection (default or customer-specific)

4. **Apply customer group pricing**
   - If customer provided, check customer's price group
   - Apply group-specific discounts or special pricing
   - Example: Wholesale customers get 10% discount

5. **Check for active promotions**
   - Query active promotions for product
   - Check date range and conditions
   - Apply highest applicable discount
   - Include promotion details in result

6. **Calculate quantity-based pricing**
   - Check if quantity discounts exist
   - Example: Buy 10+ get 5% off
   - Show next tier threshold
   - "Buy 2 more for 10% discount"

7. **Include tax information**
   - Add tax rate to result
   - Calculate price with and without tax
   - Show tax-inclusive price if configured
   - Label clearly: "₨150.00 (incl. tax)"

8. **Format currency correctly**
   - Use Sri Lankan Rupee (LKR) format
   - Display with ₨ symbol
   - Format: "₨150.00" or "Rs. 150.00"
   - Respect tenant's currency settings

9. **Add pricing metadata**
   - Original price (before discounts)
   - Discounted price (after all adjustments)
   - Discount amount and percentage
   - Reason for discount (promotion name, customer group)

10. **Include price in all search results**
    - Update all search methods to include pricing
    - Show relevant price for context (customer, quantity)

### Pricing Calculation Flow

```
┌─────────────────────┐
│  Product Found      │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────┐
│ _get_effective_price     │
└──────────┬───────────────┘
           │
           ├─► Get Base Price
           │    └─ Standard selling price
           │
           ├─► Apply Customer Group Discount
           │    ├─ Wholesale: -10%
           │    └─ VIP: -15%
           │
           ├─► Check Promotions
           │    ├─ Seasonal Sale: -20%
           │    ├─ BOGO: Buy 1 Get 1
           │    └─ Apply best offer
           │
           ├─► Check Quantity Discounts
           │    ├─ 1-9: Base price
           │    ├─ 10-49: -5%
           │    └─ 50+: -10%
           │
           └─► Calculate Tax
                ├─ Add VAT (8%)
                └─ Return final price
```

### Pricing Hierarchy

```
Priority Order (highest to lowest):

1. Manual Price Override (POS manager)
2. Promotional Price (time-limited)
3. Customer Group Price (ongoing)
4. Quantity Discount (volume-based)
5. Standard Price (base price)
```

### Method: _get_effective_price

```python
@classmethod
def _get_effective_price(cls, product, customer=None, quantity=1):
    """
    Calculate effective price for product considering all factors.
    
    Args:
        product: Product instance
        customer: Optional Customer instance for group pricing
        quantity: Quantity for volume discounts (default 1)
        
    Returns:
        Dictionary with pricing information:
        {
            'base_price': Decimal - original price
            'unit_price': Decimal - final price per unit
            'discount_amount': Decimal - discount per unit
            'discount_percent': Decimal - discount percentage
            'discount_reason': str - why discounted
            'tax_rate': Decimal - tax percentage
            'price_with_tax': Decimal - price including tax
            'currency': str - 'LKR'
            'promotion': dict - promotion details if applicable
        }
    """
```

### Enhanced Product Result with Pricing

```python
{
    # Product identification
    'id': 'uuid-1',
    'name': 'Coca-Cola 500ml',
    'sku': 'BEV-COKE-500',
    
    # Pricing information
    'pricing': {
        'base_price': Decimal('150.00'),
        'unit_price': Decimal('135.00'),
        'discount_amount': Decimal('15.00'),
        'discount_percent': Decimal('10.00'),
        'discount_reason': 'Customer Group: Wholesale',
        'tax_rate': Decimal('8.00'),
        'price_with_tax': Decimal('145.80'),
        'currency': 'LKR',
        'formatted_price': '₨135.00',
        'formatted_price_with_tax': '₨145.80',
        'promotion': {
            'id': 'promo-1',
            'name': 'Summer Sale',
            'discount_percent': 10,
            'valid_until': '2026-03-31'
        }
    },
    
    # Stock and other fields...
}
```

### Customer Group Pricing Example

```
Product: Coffee Beans 1kg
Base Price: ₨1,500.00

Customer Groups:
├─ Retail (default):    ₨1,500.00 (0% discount)
├─ Wholesale:           ₨1,350.00 (10% discount)
├─ VIP:                 ₨1,275.00 (15% discount)
└─ Staff:               ₨1,200.00 (20% discount)

When searching with customer context:
- Retail customer sees: ₨1,500.00
- Wholesale customer sees: ₨1,350.00
- VIP customer sees: ₨1,275.00
```

### Promotion Pricing

**Promotion Types:**

1. **Percentage Discount**
   - 10% off all beverages
   - Applied to base price
   - Time-limited

2. **Fixed Amount Discount**
   - ₨50 off on purchase
   - Applied per unit
   - Minimum purchase may apply

3. **Buy X Get Y (BOGO)**
   - Buy 2 Get 1 Free
   - Effective 33% discount
   - Requires quantity threshold

4. **Bundle Pricing**
   - 6-pack for ₨800 (regular ₨900)
   - Fixed bundle price
   - Must buy exact quantity

### Quantity Discount Tiers

```
Product: Paper Towels

Quantity Tiers:
┌─────────┬────────────┬───────────┐
│ Qty     │ Unit Price │ Discount  │
├─────────┼────────────┼───────────┤
│ 1-9     │ ₨100.00   │ 0%        │
│ 10-24   │ ₨95.00    │ 5%        │
│ 25-49   │ ₨90.00    │ 10%       │
│ 50+     │ ₨85.00    │ 15%       │
└─────────┴────────────┴───────────┘

For quantity 8:
- Current: ₨100.00 per unit
- Message: "Buy 2 more for ₨95/unit"

For quantity 15:
- Current: ₨95.00 per unit
- Message: "Buy 10 more for ₨90/unit"
```

### Tax Calculation

**Tax-Exclusive Display (default):**
```
Base Price: ₨100.00
Tax (8%): ₨8.00
Total: ₨108.00

Display: "₨100.00 + tax"
```

**Tax-Inclusive Display:**
```
Total Price: ₨108.00
(includes ₨8.00 tax)

Display: "₨108.00 (incl. tax)"
```

### Currency Formatting

Sri Lankan Rupee formats:
- Symbol: ₨ or Rs.
- Format: ₨150.00 or Rs. 150.00
- Thousands separator: ₨1,500.00
- Decimal places: 2 (for LKR)

```python
Format Examples:
₨150.00
₨1,500.00
₨15,000.00
₨150,000.00

Or alternative:
Rs. 150.00
Rs. 1,500.00
```

### Price Comparison Display

Show price savings:
```
Original Price: ₨200.00
Discount: -₨30.00 (15% off)
──────────────────────
Your Price: ₨170.00
You Save: ₨30.00
```

### Variant Pricing

**Parent with Variants:**
```python
{
    'name': 'T-Shirt',
    'has_variants': True,
    'pricing': {
        'price_range': {
            'min': Decimal('500.00'),
            'max': Decimal('800.00'),
            'formatted': '₨500 - ₨800'
        },
        'message': 'Varies by size and color'
    }
}
```

**Specific Variant:**
```python
{
    'name': 'T-Shirt - Red - Large',
    'is_variant': True,
    'pricing': {
        'unit_price': Decimal('600.00'),
        'formatted_price': '₨600.00'
    }
}
```

### Multi-Currency Support

For future international expansion:
- Store prices in base currency (LKR)
- Convert to customer currency on display
- Show both prices: "₨150.00 (≈$0.50)"
- Use exchange rate from settings

### Price List Support

Different price lists per:
- Customer type (retail, wholesale)
- Region/location
- Time of day (happy hour pricing)
- Season (peak/off-peak)

```
Price Lists:
├─ Default (Retail)
├─ Wholesale
├─ Online Store
└─ Staff/Employee
```

### Configuration Settings

```python
POS_PRICING_SETTINGS = {
    'default_currency': 'LKR',
    'currency_symbol': '₨',
    'decimal_places': 2,
    'show_tax_inclusive': True,  # Show prices with tax
    'apply_customer_pricing': True,  # Use customer group pricing
    'apply_promotions': True,  # Apply active promotions
    'show_price_comparison': True,  # Show original vs discounted
}
```

### Use Cases

**Use Case 1: Regular customer search**
- Searches for "Coca-Cola"
- Sees standard price ₨150.00
- No discounts applied

**Use Case 2: Wholesale customer search**
- Same search
- Sees discounted price ₨135.00
- Shows "Wholesale: -10%"

**Use Case 3: Active promotion**
- All beverages 20% off this week
- Price shows ₨120.00
- Shows "Summer Sale: -20%"
- Shows original ₨150.00 strikethrough

**Use Case 4: Quantity discount incentive**
- Cashier scanning 8 units
- Shows "Buy 2 more for 5% off"
- Encourages larger purchase

### Verification Checklist
- [ ] _get_effective_price method created
- [ ] Base price retrieved correctly
- [ ] Customer group pricing applied
- [ ] Promotions checked and applied
- [ ] Quantity discounts calculated
- [ ] Tax calculated and included
- [ ] Currency formatted for LKR
- [ ] Price metadata included in results
- [ ] Price range shown for variants
- [ ] Pricing info included in all search results

---

## Task 48: Create QuickButtonGroup Model

### Overview
Create the QuickButtonGroup model to organize quick access buttons into logical groups (e.g., "Beverages", "Snacks", "Frequently Sold").

### Dependencies
- Django models framework
- Multi-tenant schema support
- POS app structure

### Instructions

1. **Create model file**
   - Navigate to `apps/pos/search/models/`
   - Create file named `quick_button_group.py`
   - Import required Django model classes

2. **Define QuickButtonGroup model**
   - Create class inheriting from tenant-aware base model
   - Add class Meta with table name and ordering
   - Add docstring describing model purpose

3. **Add identification fields**
   - **id**: UUID primary key (or auto-increment)
   - **name**: CharField for group display name
   - **code**: CharField for unique group identifier (slug)

4. **Add display configuration**
   - **icon**: CharField for icon identifier (optional)
   - **color**: CharField for group color (hex or preset)
   - **description**: TextField for group description (optional)

5. **Add positioning fields**
   - **display_order**: IntegerField for group ordering
   - **is_active**: BooleanField (default True)
   - **is_default**: BooleanField (default group on load)

6. **Add grid configuration**
   - **rows**: IntegerField (default 5)
   - **columns**: IntegerField (default 4)
   - Defines button grid size for this group

7. **Add terminal assignment**
   - **terminals**: ManyToManyField to Terminal model (optional)
   - Allows group to be terminal-specific
   - If empty, visible to all terminals

8. **Add audit fields**
   - **created_at**: DateTimeField (auto_now_add)
   - **updated_at**: DateTimeField (auto_now)
   - **created_by**: ForeignKey to User (optional)

9. **Add model methods**
   - `__str__()`: Return group name
   - `get_button_count()`: Count buttons in group
   - `get_grid_capacity()`: Calculate total button slots (rows × columns)

10. **Add model validation**
    - Validate rows and columns are positive integers
    - Validate color format if hex color
    - Ensure code is unique per tenant

11. **Update models __init__.py**
    - Import QuickButtonGroup
    - Add to __all__ export list

12. **Create database migration**
    - Run makemigrations command
    - Review generated migration
    - Ensure tenant-aware migration structure

### Model Diagram

```
┌────────────────────────────────┐
│     QuickButtonGroup            │
├────────────────────────────────┤
│ PK  id (UUID)                  │
│     name (str)                 │
│     code (str, unique)         │
│     icon (str, optional)       │
│     color (str)                │
│     description (text)         │
│     display_order (int)        │
│     rows (int, default 5)      │
│     columns (int, default 4)   │
│     is_active (bool)           │
│     is_default (bool)          │
│     created_at (datetime)      │
│     updated_at (datetime)      │
├────────────────────────────────┤
│ M2M terminals                  │
│ FK  created_by (User)          │
└────────────────────────────────┘
        │
        │ 1:N
        ▼
  QuickButton
```

### Field Specifications

| Field | Type | Options | Description |
|-------|------|---------|-------------|
| id | UUIDField | PK | Unique identifier |
| name | CharField | max_length=100 | Display name |
| code | CharField | max_length=50, unique | Slug identifier |
| icon | CharField | max_length=50, null=True | Icon name/class |
| color | CharField | max_length=20 | Hex or preset color |
| description | TextField | blank=True | Group description |
| display_order | IntegerField | default=0 | Sort order |
| rows | IntegerField | default=5 | Button grid rows |
| columns | IntegerField | default=4 | Button grid columns |
| is_active | BooleanField | default=True | Active status |
| is_default | BooleanField | default=False | Default group flag |
| created_at | DateTimeField | auto_now_add | Creation timestamp |
| updated_at | DateTimeField | auto_now | Update timestamp |

### Model Methods

**__str__ method:**
```python
def __str__(self):
    """
    String representation of group.
    Returns group name.
    """
    return self.name
```

**get_button_count method:**
```python
def get_button_count(self):
    """
    Count number of buttons in this group.
    
    Returns:
        Integer count of QuickButton instances
    """
    return self.buttons.count()
```

**get_grid_capacity method:**
```python
def get_grid_capacity(self):
    """
    Calculate total available button slots.
    
    Returns:
        Integer: rows × columns
    """
    return self.rows * self.columns
```

**is_grid_full method:**
```python
def is_grid_full(self):
    """
    Check if all button slots are occupied.
    
    Returns:
        Boolean: True if button count >= capacity
    """
    return self.get_button_count() >= self.get_grid_capacity()
```

### Example Group Configurations

**Group 1: Beverages**
```python
{
    'name': 'Beverages',
    'code': 'beverages',
    'icon': 'drink',
    'color': '#3498db',  # Blue
    'rows': 5,
    'columns': 4,
    'is_active': True,
    'is_default': True,
    'display_order': 1
}
```

**Group 2: Snacks**
```python
{
    'name': 'Snacks & Chips',
    'code': 'snacks',
    'icon': 'food',
    'color': '#e67e22',  # Orange
    'rows': 5,
    'columns': 4,
    'is_active': True,
    'is_default': False,
    'display_order': 2
}
```

**Group 3: Top Sellers**
```python
{
    'name': 'Top Sellers',
    'code': 'top-sellers',
    'icon': 'star',
    'color': '#f39c12',  # Gold
    'rows': 3,
    'columns': 3,
    'is_active': True,
    'is_default': False,
    'display_order': 3
}
```

### Color Presets

Define standard color options:
```python
COLOR_CHOICES = [
    ('#3498db', 'Blue'),
    ('#2ecc71', 'Green'),
    ('#e74c3c', 'Red'),
    ('#f39c12', 'Orange'),
    ('#9b59b6', 'Purple'),
    ('#1abc9c', 'Teal'),
    ('#34495e', 'Dark Gray'),
]
```

### Icon Options

Common icon identifiers (using icon library):
- 'drink', 'coffee', 'beer' - Beverages
- 'food', 'utensils', 'pizza' - Food items
- 'star', 'fire' - Popular/Featured
- 'tag', 'percent' - Promotions
- 'gift', 'surprise' - Special items

### Grid Size Variations

| Use Case | Rows | Cols | Total | Description |
|----------|------|------|-------|-------------|
| Standard | 5 | 4 | 20 | Default grid |
| Compact | 4 | 3 | 12 | Smaller screen |
| Expanded | 6 | 5 | 30 | Large display |
| Favorites | 2 | 5 | 10 | Quick access |

### Terminal Assignment

**All Terminals (default):**
- terminals field empty
- Group visible on all POS terminals
- Most common configuration

**Specific Terminals:**
- Link to Terminal 1, Terminal 3
- Group only visible on those terminals
- Use for location-specific products

```
Example:
Group: "Cold Drinks" → All terminals
Group: "Lottery Tickets" → Terminal 1, 3 only (licensed locations)
Group: "Pharmacy Items" → Terminal 5 only (pharmacy counter)
```

### Default Group Behavior

- Only one group can be is_default=True per tenant
- Default group loads when terminal opens
- Cashiers can switch between groups
- Setting new default unsets previous default

### Model Constraints

**Database Constraints:**
- Unique constraint on code per tenant
- Positive integer check on rows/columns
- Only one is_default=True per tenant (check)

**Business Rules:**
- Minimum 1 row, 1 column
- Maximum 10 rows, 10 columns (configurable)
- At least one active group required

### Usage in POS UI

```
POS Terminal Screen:

┌──────────────────────────────────┐
│ Group Tabs:                      │
│ [Beverages] [Snacks] [Top Sellers]│
├──────────────────────────────────┤
│                                  │
│  ┌────┬────┬────┬────┐          │
│  │ 🥤 │ ☕  │ 🍺 │ 🥛 │          │
│  ├────┼────┼────┼────┤          │
│  │ 🍷 │ 🧃 │ 🧋 │ 🧊 │          │
│  ├────┼────┼────┼────┤          │
│  │ ... button grid ...│          │
│  └────┴────┴────┴────┘          │
│                                  │
└──────────────────────────────────┘

Selected Group: Beverages (5x4 grid)
```

### Admin Interface Considerations

- List display: name, code, button count, active status
- Filters: is_active, is_default, created date
- Search: name, code
- Inline: Show buttons in group
- Actions: Activate/deactivate groups, set as default

### Verification Checklist
- [ ] quick_button_group.py file created
- [ ] QuickButtonGroup model defined
- [ ] All identification fields added
- [ ] Display configuration fields added
- [ ] Grid configuration (rows, columns) added
- [ ] Terminal assignment M2M relationship
- [ ] Audit fields included
- [ ] __str__ method implemented
- [ ] get_button_count method implemented
- [ ] get_grid_capacity method implemented
- [ ] Model validation added
- [ ] Exported from models/__init__.py
- [ ] Migration created successfully

---

## Task 49: Create QuickButton Model

### Overview
Create the QuickButton model representing individual product shortcut buttons within quick button groups.

### Dependencies
- Task 48: QuickButtonGroup model
- Product model from inventory
- Django models framework

### Instructions

1. **Create model file**
   - Navigate to `apps/pos/search/models/`
   - Create file named `quick_button.py`
   - Import required models and Django classes

2. **Define QuickButton model**
   - Create class inheriting from tenant-aware base model
   - Add class Meta with table name and ordering
   - Add docstring describing model purpose

3. **Add relationship fields**
   - **group**: ForeignKey to QuickButtonGroup (related_name='buttons')
   - **product**: ForeignKey to Product
   - CASCADE delete on group deletion

4. **Add display fields**
   - **label**: CharField for custom button text (optional)
   - **image**: ImageField for button image (optional)
   - **color**: CharField for button color (optional, inherits from group)

5. **Add position fields**
   - **row**: IntegerField (1-based row position)
   - **column**: IntegerField (1-based column position)
   - Unique together with group (one button per cell)

6. **Add configuration fields**
   - **is_active**: BooleanField (default True)
   - **quick_quantity**: DecimalField (default 1) - quantity added on click

7. **Add audit fields**
   - **created_at**: DateTimeField (auto_now_add)
   - **updated_at**: DateTimeField (auto_now)
   - **created_by**: ForeignKey to User (optional)

8. **Add model methods**
   - `__str__()`: Return label or product name
   - `get_display_label()`: Return label or fallback to product name
   - `get_position_string()`: Return "Row 1, Col 2" format

9. **Add model validation**
   - Validate row within group's row count
   - Validate column within group's column count
   - Validate position not already occupied
   - Validate product is active and available

10. **Add model properties**
    - `position_tuple`: Return (row, column) tuple
    - `is_valid_position`: Check if position within grid bounds

11. **Update models __init__.py**
    - Import QuickButton
    - Add to __all__ export list

12. **Create database migration**
    - Run makemigrations command
    - Review generated migration
    - Ensure unique constraint on (group, row, column)

### Model Diagram

```
┌────────────────────────────────┐
│  QuickButtonGroup               │
└────────────┬───────────────────┘
             │ 1:N
             ▼
┌────────────────────────────────┐
│     QuickButton                 │
├────────────────────────────────┤
│ PK  id (UUID)                  │
│ FK  group                      │
│ FK  product                    │
│     label (str, optional)      │
│     image (ImageField)         │
│     color (str, optional)      │
│     row (int)                  │
│     column (int)               │
│     quick_quantity (decimal)   │
│     is_active (bool)           │
│     created_at (datetime)      │
│     updated_at (datetime)      │
│ FK  created_by (User)          │
└────────────────────────────────┘
             │ N:1
             ▼
┌────────────────────────────────┐
│         Product                 │
└────────────────────────────────┘
```

### Field Specifications

| Field | Type | Options | Description |
|-------|------|---------|-------------|
| id | UUIDField | PK | Unique identifier |
| group | ForeignKey | QuickButtonGroup, CASCADE | Parent group |
| product | ForeignKey | Product, PROTECT | Linked product |
| label | CharField | max_length=50, null=True | Custom label |
| image | ImageField | upload_to=..., null=True | Button image |
| color | CharField | max_length=20, null=True | Button color |
| row | IntegerField | | Grid row (1-based) |
| column | IntegerField | | Grid column (1-based) |
| quick_quantity | DecimalField | default=1 | Qty to add |
| is_active | BooleanField | default=True | Active status |
| created_at | DateTimeField | auto_now_add | Creation time |
| updated_at | DateTimeField | auto_now | Update time |

### Model Methods

**__str__ method:**
```python
def __str__(self):
    """
    String representation of button.
    Returns label or product name.
    """
    return self.get_display_label()
```

**get_display_label method:**
```python
def get_display_label(self):
    """
    Get display label for button.
    Uses custom label if set, otherwise product name.
    
    Returns:
        String label for button
    """
    if self.label:
        return self.label
    return self.product.name
```

**get_position_string method:**
```python
def get_position_string(self):
    """
    Get human-readable position string.
    
    Returns:
        String like "Row 1, Col 2"
    """
    return f"Row {self.row}, Col {self.column}"
```

**get_effective_color method:**
```python
def get_effective_color(self):
    """
    Get button color (own or inherited from group).
    
    Returns:
        Hex color string
    """
    if self.color:
        return self.color
    return self.group.color
```

### Model Properties

**position_tuple property:**
```python
@property
def position_tuple(self):
    """
    Return position as tuple for easy comparison.
    
    Returns:
        Tuple: (row, column)
    """
    return (self.row, self.column)
```

**is_valid_position property:**
```python
@property
def is_valid_position(self):
    """
    Check if position is within group grid bounds.
    
    Returns:
        Boolean: True if position valid
    """
    return (1 <= self.row <= self.group.rows and
            1 <= self.column <= self.group.columns)
```

### Example Button Configurations

**Button 1: Coca-Cola**
```python
{
    'group': beverages_group,
    'product': cocacola_product,
    'label': 'Coke',  # Custom short label
    'image': '/media/buttons/coke.jpg',
    'color': '#e74c3c',  # Red
    'row': 1,
    'column': 1,
    'quick_quantity': 1,
    'is_active': True
}
```

**Button 2: Water 6-Pack**
```python
{
    'group': beverages_group,
    'product': water_product,
    'label': None,  # Use product name
    'image': None,  # Use product image
    'color': None,  # Inherit from group
    'row': 1,
    'column': 2,
    'quick_quantity': 6,  # Adds 6-pack on click
    'is_active': True
}
```

### Grid Position Visualization

```
Group: Beverages (5 rows × 4 columns)

┌─────────────────────────────────────┐
│  Col 1    Col 2    Col 3    Col 4   │
├─────────────────────────────────────┤
│  (1,1)    (1,2)    (1,3)    (1,4)   │  Row 1
│  Coke     Sprite   Water    Juice   │
├─────────────────────────────────────┤
│  (2,1)    (2,2)    (2,3)    (2,4)   │  Row 2
│  Pepsi    Fanta    Soda     Tea     │
├─────────────────────────────────────┤
│  (3,1)    (3,2)    (3,3)    (3,4)   │  Row 3
│  ...      ...      ...      ...     │
└─────────────────────────────────────┘

Each cell = QuickButton instance with unique (row, column)
```

### Button Label Options

1. **No Label (None)** - Use product name
2. **Short Label** - "Coke" instead of "Coca-Cola 500ml"
3. **Descriptive Label** - "Cold Coffee" for specific variant
4. **Price Label** - "₨150 Coke" to show price

### Button Image Handling

**Image Sources (priority):**
1. Custom button image (if set)
2. Product variant image
3. Product main image
4. Category default image
5. Placeholder icon

**Image Requirements:**
- Format: JPG, PNG, WebP
- Size: 200x200px recommended (square)
- Aspect ratio: 1:1 preferred
- File size: < 100KB for performance

### Quick Quantity Feature

Default: 1 unit added per click

**Use Cases:**
- Quantity 1: Individual items (Coke bottle)
- Quantity 6: 6-pack beverages
- Quantity 0.5: Half kg of bulk item
- Quantity 12: Dozen eggs

**Behavior:**
- Single click: Add quick_quantity to cart
- Long press (future): Open quantity selector

### Unique Position Constraint

Database constraint:
```sql
UNIQUE (group_id, row, column) per tenant
```

**Prevents:**
- Two buttons at same position
- Overlapping buttons
- Grid conflicts

**Allows:**
- Empty cells (no button)
- Sparse grids (not all cells filled)
- Flexible button placement

### Model Validation

**Pre-save validation:**
1. **Position Bounds Check**
   - row must be 1 to group.rows
   - column must be 1 to group.columns

2. **Position Uniqueness**
   - No other active button at (row, column) in same group
   - Allow inactive buttons at same position

3. **Product Active Check**
   - Product must be is_active=True
   - Product must have stock or allow backorder

4. **Quantity Validation**
   - quick_quantity must be positive
   - Reasonable maximum (e.g., 100)

### Button States

| State | Condition | Visual |
|-------|-----------|--------|
| Active | is_active=True, product active, in stock | Normal display |
| Inactive | is_active=False | Grayed out or hidden |
| Out of Stock | Product stock = 0 | Red indicator, disabled |
| Disabled | Product inactive | Hidden from grid |

### Usage Flow

```
Cashier Action: Click Button
       │
       ▼
┌─────────────────────┐
│ Get QuickButton     │
│ - group, product    │
│ - quick_quantity    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Check Availability  │
│ - Product active?   │
│ - Stock available?  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Add to Cart         │
│ - quantity from btn │
│ - get effective     │
│   price            │
└─────────┬───────────┘
          │
          ▼
    Cart Updated
```

### Admin Interface

**List Display:**
- Button label/product name
- Group name
- Position (row, col)
- Active status
- Quick quantity

**Filters:**
- Group
- Active status
- Row/column
- Product category

**Search:**
- Label
- Product name
- Product SKU

**Inline:**
- Show in QuickButtonGroup admin as inline
- Visual grid preview (future enhancement)

### Verification Checklist
- [ ] quick_button.py file created
- [ ] QuickButton model defined
- [ ] group ForeignKey to QuickButtonGroup
- [ ] product ForeignKey to Product
- [ ] label, image, color fields added
- [ ] row, column position fields added
- [ ] quick_quantity field added
- [ ] is_active flag included
- [ ] Audit fields (created_at, etc.) added
- [ ] __str__ method implemented
- [ ] get_display_label method implemented
- [ ] get_position_string method implemented
- [ ] position_tuple property implemented
- [ ] is_valid_position property implemented
- [ ] Unique constraint (group, row, column) added
- [ ] Model validation implemented
- [ ] Exported from models/__init__.py
- [ ] Migration created successfully

---

## Task 50: Add Button Position Management

### Overview
Implement methods and utilities for managing button positions within the grid, including swapping buttons, auto-positioning, and gap management.

### Dependencies
- Task 48: QuickButtonGroup model
- Task 49: QuickButton model

### Instructions

1. **Add position management methods to QuickButton**
   - Create class method `find_next_available_position()`
   - Create instance method `swap_position_with()`
   - Create class method `get_occupied_positions()`

2. **Implement find_next_available_position**
   - Find first empty cell in grid
   - Parameters: group instance
   - Scan row by row, column by column
   - Return (row, column) tuple or None if full

3. **Implement swap_position_with**
   - Swap positions of two buttons
   - Parameters: other button instance
   - Must be in same group
   - Atomic transaction to prevent conflicts

4. **Implement get_occupied_positions**
   - Get all occupied positions in group
   - Return list of (row, column) tuples
   - Used for visualization and validation

5. **Add move_to method**
   - Move button to new position
   - Parameters: new_row, new_column
   - Validate position available
   - Check bounds within grid

6. **Add grid utility class methods**
   - Create `GridUtils` helper class
   - Method: `visualize_grid(group)` - ASCII grid representation
   - Method: `get_empty_cells(group)` - List empty positions
   - Method: `compact_grid(group)` - Remove gaps, shift buttons left/up

7. **Implement auto-position feature**
   - When creating button without position
   - Automatically assign next available position
   - Override save() method to call find_next_available_position

8. **Add position validation**
   - Validate on save: position within bounds
   - Validate on save: position not occupied
   - Raise ValidationError if invalid

9. **Create admin actions**
   - Admin action: "Compact Grid" - remove gaps
   - Admin action: "Reset Positions" - auto-arrange all buttons
   - Batch position updates

10. **Add position queries**
    - QuerySet method: `at_position(row, column)`
    - QuerySet method: `in_row(row_number)`
    - QuerySet method: `in_column(column_number)`

### Position Management Flow

```
Create New Button (no position specified)
       │
       ▼
┌─────────────────────────────┐
│ find_next_available_position │
└─────────┬───────────────────┘
          │
          ├─► Scan Grid (row by row)
          │    ├─ Check (1,1) - Occupied
          │    ├─ Check (1,2) - Occupied
          │    ├─ Check (1,3) - Empty ✓
          │    └─ Return (1, 3)
          │
          ▼
┌─────────────────────────────┐
│ Assign Position to Button    │
│ row = 1, column = 3          │
└─────────┬───────────────────┘
          │
          ▼
      Save Button
```

### Method: find_next_available_position

```python
@classmethod
def find_next_available_position(cls, group):
    """
    Find next available position in group grid.
    
    Scans grid row by row, left to right.
    
    Args:
        group: QuickButtonGroup instance
        
    Returns:
        Tuple (row, column) if available position found
        None if grid is full
        
    Example:
        position = QuickButton.find_next_available_position(beverages_group)
        if position:
            button.row, button.column = position
    """
```

**Implementation Logic:**
```
For each row (1 to group.rows):
    For each column (1 to group.columns):
        If position not occupied:
            Return (row, column)
Return None  # Grid full
```

### Method: swap_position_with

```python
def swap_position_with(self, other_button):
    """
    Swap positions with another button in same group.
    
    Args:
        other_button: QuickButton instance to swap with
        
    Raises:
        ValueError: If buttons not in same group
        
    Example:
        button1.swap_position_with(button2)
        # button1 now at button2's old position and vice versa
    """
```

**Implementation:**
```
Validate: both buttons in same group
Store: temp_row, temp_column = self.row, self.column
Update: self.row, self.column = other.row, other.column
Update: other.row, other.column = temp_row, temp_column
Save: both buttons in transaction
```

### Method: move_to

```python
def move_to(self, row, column):
    """
    Move button to new position.
    
    Args:
        row: Target row number (1-based)
        column: Target column number (1-based)
        
    Raises:
        ValidationError: If position invalid or occupied
        
    Example:
        button.move_to(3, 2)  # Move to row 3, column 2
    """
```

**Validation Checks:**
1. Row within bounds: 1 <= row <= group.rows
2. Column within bounds: 1 <= column <= group.columns
3. Position not occupied by another active button
4. If occupied, optionally swap or fail

### GridUtils Helper Class

```python
class GridUtils:
    """
    Utility class for grid position management.
    """
    
    @staticmethod
    def visualize_grid(group):
        """
        Create ASCII visualization of button grid.
        
        Returns:
            String with grid layout
        """
    
    @staticmethod
    def get_empty_cells(group):
        """
        Get list of all empty positions.
        
        Returns:
            List of (row, column) tuples
        """
    
    @staticmethod
    def compact_grid(group):
        """
        Remove gaps and shift buttons to fill grid.
        Moves buttons to leftmost, topmost positions.
        
        Returns:
            Number of buttons repositioned
        """
```

### Grid Visualization Example

```
Grid for Group "Beverages" (5x4):

  C1   C2   C3   C4
┌────┬────┬────┬────┐
│ AA │ BB │    │ CC │ R1
├────┼────┼────┼────┤
│    │ DD │ EE │    │ R2
├────┼────┼────┼────┤
│ FF │    │ GG │    │ R3
├────┼────┼────┼────┤
│    │    │    │    │ R4 (Empty)
├────┼────┼────┼────┤
│    │    │    │    │ R5 (Empty)
└────┴────┴────┴────┘

AA-GG: Buttons (first 2 chars of product name)
Empty: Available positions
```

### Grid Compacting

**Before Compact:**
```
┌────┬────┬────┬────┐
│ AA │    │ BB │    │
├────┼────┼────┼────┤
│    │ CC │    │    │
├────┼────┼────┼────┤
│    │    │ DD │    │
└────┴────┴────┴────┘
```

**After Compact:**
```
┌────┬────┬────┬────┐
│ AA │ BB │ CC │ DD │
├────┼────┼────┼────┤
│    │    │    │    │
├────┼────┼────┼────┤
│    │    │    │    │
└────┴────┴────┴────┘
```

Buttons moved to fill gaps, maintaining relative order.

### Auto-Position on Save

```python
def save(self, *args, **kwargs):
    """
    Override save to auto-assign position if not set.
    """
    if not self.row or not self.column:
        # Find next available position
        position = self.find_next_available_position(self.group)
        if position:
            self.row, self.column = position
        else:
            raise ValidationError("Button grid is full")
    
    # Call parent save
    super().save(*args, **kwargs)
```

### QuerySet Methods

Add to QuickButton manager:

```python
class QuickButtonQuerySet(models.QuerySet):
    def at_position(self, row, column):
        """Get button at specific position."""
        return self.filter(row=row, column=column)
    
    def in_row(self, row):
        """Get all buttons in row."""
        return self.filter(row=row).order_by('column')
    
    def in_column(self, column):
        """Get all buttons in column."""
        return self.filter(column=column).order_by('row')
    
    def active_buttons(self):
        """Get only active buttons."""
        return self.filter(is_active=True)
```

### Admin Actions

**Action 1: Compact Grid**
```python
def compact_grid_action(modeladmin, request, queryset):
    """
    Admin action to compact button grid.
    Removes gaps and shifts buttons.
    """
    for group in queryset:
        count = GridUtils.compact_grid(group)
        messages.success(request, f"Compacted {group.name}: {count} buttons moved")
```

**Action 2: Auto-Arrange**
```python
def auto_arrange_action(modeladmin, request, queryset):
    """
    Admin action to auto-arrange all buttons.
    Assigns positions based on product name alphabetically.
    """
    # Sort buttons, assign sequential positions
```

### Position Conflict Resolution

**Scenario: Two admins editing simultaneously**

1. **Optimistic Locking**
   - Check updated_at timestamp before save
   - Fail if changed since last read

2. **Database Constraint**
   - Unique constraint on (group, row, column)
   - Database prevents conflicts

3. **Atomic Transaction**
   - Wrap position changes in transaction
   - Rollback if conflict detected

### Bulk Position Updates

For reorganizing many buttons:

```python
def bulk_update_positions(button_position_map):
    """
    Update positions for multiple buttons atomically.
    
    Args:
        button_position_map: Dict {button_id: (row, column), ...}
    """
    with transaction.atomic():
        for button_id, (row, col) in button_position_map.items():
            button = QuickButton.objects.get(id=button_id)
            button.row = row
            button.column = col
            button.save()
```

### Use Cases

**Use Case 1: Add new button**
- Admin creates button, doesn't specify position
- System auto-assigns next available position
- Button appears in first empty cell

**Use Case 2: Rearrange buttons**
- Admin drags button from (1,1) to (2,3)
- System checks if (2,3) is available
- If occupied, optionally swap or fail
- If empty, move button

**Use Case 3: Delete button leaves gap**
- Button at (2,2) deleted
- Gap remains in grid
- Admin runs "Compact Grid" action
- Buttons shift to fill gap

**Use Case 4: Grid full**
- All 20 positions occupied
- Admin tries to add 21st button
- System returns error: "Grid is full"
- Options: expand grid or remove button

### Performance Considerations

- Cache occupied positions for group
- Invalidate cache on button save/delete
- Use bulk updates for compacting
- Avoid N+1 queries when loading grid

### Verification Checklist
- [ ] find_next_available_position method created
- [ ] swap_position_with method implemented
- [ ] get_occupied_positions method created
- [ ] move_to method implemented
- [ ] GridUtils class created
- [ ] visualize_grid method implemented
- [ ] get_empty_cells method implemented
- [ ] compact_grid method implemented
- [ ] Auto-position on save implemented
- [ ] Position validation on save
- [ ] QuerySet methods (at_position, in_row, in_column) added
- [ ] Admin actions for grid management
- [ ] Position conflict handling
- [ ] Bulk update support

---

## Summary

This document covered stock availability, pricing, and quick button functionality:

1. **Task 46**: Added real-time stock availability checking to search results
2. **Task 47**: Included effective pricing with customer groups, promotions, and tax
3. **Task 48**: Created QuickButtonGroup model for organizing button layouts
4. **Task 49**: Created QuickButton model for product shortcut buttons
5. **Task 50**: Implemented button position management and grid utilities

**Key Outcomes:**
- Search results now include stock status and availability
- Pricing information with discounts and promotions
- Quick access button system for fast product selection
- Grid-based button layout with position management
- Auto-positioning and grid compacting utilities

**Next Steps:**
- Add barcode format validators (Task 51)
- Implement weight-based barcode parsing (Task 52)
- Create search history tracking (Task 53)
- Add category quick filters (Task 54)

---

## Related Documentation

- [Group Overview](00_GROUP_OVERVIEW.md)
- [Previous Document: Search Service Methods](01_Tasks-39-45_Search-Service-Methods.md)
- [Next Document: Barcode Validation & Filters](03_Tasks-51-54_Barcode-Validation-Filters.md)
- [Phase 04: Product & Pricing Models](../../Phase-04_ERP-Core-Modules-Part1/)

---

*Document maintained by LankaCommerce Development Team*  
*Last Updated: January 2026*
