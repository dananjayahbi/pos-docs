# Tasks 14-18: Signals, Validation & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** A - Stock Level Models  
> **Document:** 04 of 04  
> **Tasks Covered:** 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-10-13_Manager-Aggregation-Methods.md](03_Tasks-10-13_Manager-Aggregation-Methods.md)
- **→ Next Group:** [../Group-B_Stock-Movement-Tracking/](../Group-B_Stock-Movement-Tracking/)

---

## Document Overview

This document completes the StockLevel model implementation by adding Django signals for integration, validation rules for data integrity, cost tracking functionality, and admin interface configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 14 | Create StockLevel signals | Medium |
| 15 | Add stock aggregation methods | Medium |
| 16 | Create negative stock prevention | Medium |
| 17 | Add stock cost tracking | Medium |
| 18 | Create StockLevel admin | Medium |

---

## Task 14: Create StockLevel Signals

### Overview
Implement Django signals to maintain data consistency and trigger actions when stock levels change, enabling system-wide integration.

### Dependencies
- Tasks 03-13: StockLevel model complete
- SubPhase-04: Product model with total_stock field

### Instructions

1. **Create signals file**
   - Create `signals.py` in `stock/` directory
   - Import Django signal decorators and StockLevel model
   - Add module-level docstring explaining signal purposes

2. **Create post_save signal handler**
   - Define function: `update_product_total_stock`
   - Decorate with: `@receiver(post_save, sender=StockLevel)`
   - Triggered after StockLevel is saved
   - Purpose: Update product's aggregated total_stock field

3. **Implement total stock update logic**
   - Get product from saved stock level instance
   - Calculate total quantity across all warehouses
   - Use: `StockLevel.objects.get_total_stock(product, variant)`
   - Update product.total_stock or variant.total_stock field
   - Use update() method to avoid recursive saves

4. **Create post_delete signal handler**
   - Define function: `recalculate_product_stock_on_delete`
   - Decorate with: `@receiver(post_delete, sender=StockLevel)`
   - Triggered when StockLevel deleted
   - Recalculate product total_stock after deletion

5. **Add pre_save validation signal** (optional)
   - Define function: `validate_stock_level`
   - Decorate with: `@receiver(pre_save, sender=StockLevel)`
   - Perform validation before save
   - Check: reserved_quantity <= quantity
   - Check: all quantities >= 0
   - Raise ValidationError if invalid

6. **Create stock change notification signal**
   - Define custom signal: `stock_level_changed`
   - Provide arguments: instance, old_quantity, new_quantity
   - Fire when quantity changes significantly
   - Other apps can listen and react (cache clear, notifications)

7. **Register signals in app config**
   - Import signals in `stock/__init__.py`
   - Or use ready() method in AppConfig
   - Ensures signals are connected on app startup

### Signal Handlers Overview

| Signal | Trigger | Handler | Purpose |
|--------|---------|---------|---------|
| post_save | After StockLevel saved | update_product_total_stock | Update product aggregated stock |
| post_delete | After StockLevel deleted | recalculate_product_stock_on_delete | Recalculate after deletion |
| pre_save | Before StockLevel saved | validate_stock_level | Pre-save validation |
| stock_level_changed | Custom | - | Notify other systems of changes |

### Signal Implementation Pattern
```python
# signals.py structure:
# 
# from django.db.models.signals import post_save, post_delete, pre_save
# from django.dispatch import receiver, Signal
# from .models import StockLevel
# 
# # Custom signal
# stock_level_changed = Signal()
# 
# @receiver(post_save, sender=StockLevel)
# def update_product_total_stock(sender, instance, created, **kwargs):
#     # Calculate total stock
#     # Update product.total_stock
# 
# @receiver(post_delete, sender=StockLevel)
# def recalculate_product_stock_on_delete(sender, instance, **kwargs):
#     # Recalculate without deleted instance
# 
# @receiver(pre_save, sender=StockLevel)
# def validate_stock_level(sender, instance, **kwargs):
#     # Validation logic
#     # Raise ValidationError if invalid
```

### Product Total Stock Update Logic
```
1. Get all stock levels for product (and variant if applicable)
2. Sum quantity field across all warehouses
3. Update product.total_stock or variant.total_stock
4. Use update() to bypass model save and avoid recursion
```

### Signal Registration
```python
# In stock/__init__.py:
# default_app_config = 'apps.inventory.stock.apps.StockConfig'
# 
# # Import signals to ensure they're registered
# from . import signals
```

Or in apps.py:
```python
# class StockConfig(AppConfig):
#     def ready(self):
#         from . import signals
```

### Verification Checklist
- [ ] signals.py file created in stock/ directory
- [ ] post_save signal updates product total_stock
- [ ] post_delete signal recalculates total_stock
- [ ] pre_save signal validates data (optional)
- [ ] Custom stock_level_changed signal defined
- [ ] Signals registered in app initialization
- [ ] Signal handlers have proper error handling
- [ ] Docstrings explain each signal's purpose

---

## Task 15: Add Stock Aggregation Methods

### Overview
Create utility methods for aggregating stock data across multiple dimensions, supporting reporting and analytics requirements.

### Dependencies
- Task 10: StockLevel model manager exists
- Tasks 06-08: Quantity fields complete

### Instructions

1. **Add method to get total available stock**
   - Add to StockLevelManager: `get_total_available(product, variant=None)`
   - Returns sum of available_quantity across all warehouses
   - Use annotation with F expressions for calculation
   - Return Decimal('0') if no stock found

2. **Add method to get total reserved stock**
   - Add to manager: `get_total_reserved(product, variant=None)`
   - Returns sum of reserved_quantity across all warehouses
   - Useful for demand planning and fulfillment tracking

3. **Add method for warehouse stock summary**
   - Add to manager: `get_warehouse_summary(warehouse)`
   - Returns aggregated data for all products in warehouse:
     - Total items (count of distinct products)
     - Total quantity
     - Total reserved
     - Total available
     - List of low stock items
   - Return as dictionary

4. **Add method for product stock summary**
   - Add to manager: `get_product_summary(product, variant=None)`
   - Returns comprehensive stock data:
     - Total quantity (all warehouses)
     - Total reserved
     - Total available
     - Total incoming
     - Projected availability
     - Stock status (based on total available)
     - Warehouses with stock (count)
   - Return as dictionary

5. **Add method for low stock report**
   - Add to manager: `get_low_stock_report()`
   - Returns queryset or list of low stock items
   - Include product details, warehouse, quantities
   - Annotate with available_quantity and status
   - Order by urgency (lowest available first)

6. **Add method for stock value calculation**
   - Add to manager: `calculate_stock_value(warehouse=None)`
   - Calculate total inventory value
   - Sum: quantity * cost_per_unit for each item
   - Filter by warehouse if provided
   - Return Decimal value

### Aggregation Methods Overview

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| get_total_available | product, variant | Decimal | Sum of available across warehouses |
| get_total_reserved | product, variant | Decimal | Sum of reserved across warehouses |
| get_warehouse_summary | warehouse | dict | Aggregate stats for warehouse |
| get_product_summary | product, variant | dict | Comprehensive product stock data |
| get_low_stock_report | - | QuerySet | Items needing reorder |
| calculate_stock_value | warehouse | Decimal | Total inventory value |

### Summary Response Formats

**Warehouse Summary:**
```python
{
    'warehouse': warehouse_obj,
    'total_items': 150,  # Distinct products
    'total_quantity': Decimal('5000.000'),
    'total_reserved': Decimal('800.000'),
    'total_available': Decimal('4200.000'),
    'low_stock_count': 12,
    'out_of_stock_count': 3,
}
```

**Product Summary:**
```python
{
    'product': product_obj,
    'variant': variant_obj,  # or None
    'total_quantity': Decimal('150.000'),
    'total_reserved': Decimal('25.000'),
    'total_available': Decimal('125.000'),
    'total_incoming': Decimal('50.000'),
    'projected_available': Decimal('175.000'),
    'warehouses_with_stock': 3,
    'status': 'in_stock',
}
```

### Low Stock Report Format
```python
# QuerySet with annotations:
# - product details (name, SKU)
# - warehouse details
# - quantity, reserved, available
# - reorder_point
# - shortage = reorder_point - available
# Ordered by shortage DESC (most critical first)
```

### Stock Value Calculation
```python
# Pseudocode:
# stock_value = sum(
#     stock_level.quantity * stock_level.cost_per_unit
#     for all stock_levels in warehouse
# )
```

### Expected Method Additions
```python
# Add to StockLevelManager:
# 
# def get_total_available(self, product, variant=None):
#     # Filter and aggregate available_quantity
# 
# def get_warehouse_summary(self, warehouse):
#     # Aggregate all metrics for warehouse
#     # Return comprehensive dictionary
# 
# def get_product_summary(self, product, variant=None):
#     # Aggregate all metrics for product
#     # Return comprehensive dictionary
# 
# def get_low_stock_report(self):
#     # Query low stock items
#     # Annotate with details
#     # Order by urgency
# 
# def calculate_stock_value(self, warehouse=None):
#     # Calculate total value
```

### Verification Checklist
- [ ] get_total_available method added
- [ ] get_total_reserved method added
- [ ] get_warehouse_summary method implemented
- [ ] get_product_summary method implemented
- [ ] get_low_stock_report method implemented
- [ ] calculate_stock_value method implemented
- [ ] All methods use appropriate aggregation functions
- [ ] Methods handle edge cases (no stock, None values)
- [ ] Docstrings explain return formats

---

## Task 16: Create Negative Stock Prevention

### Overview
Implement validation logic to prevent negative stock quantities, ensuring data integrity and preventing overselling.

### Dependencies
- Task 03: StockLevel model complete
- Task 06: reserved_quantity field exists

### Instructions

1. **Add clean method to model**
   - Override `clean(self)` method in StockLevel model
   - Called during model validation
   - Raise ValidationError for invalid states

2. **Validate quantity is non-negative**
   - Check: `self.quantity >= 0`
   - Raise ValidationError if negative
   - Message: "Quantity cannot be negative"

3. **Validate reserved_quantity is non-negative**
   - Check: `self.reserved_quantity >= 0`
   - Raise ValidationError if negative
   - Message: "Reserved quantity cannot be negative"

4. **Validate incoming_quantity is non-negative**
   - Check: `self.incoming_quantity >= 0`
   - Raise ValidationError if negative
   - Message: "Incoming quantity cannot be negative"

5. **Validate reserved does not exceed quantity**
   - Check: `self.reserved_quantity <= self.quantity`
   - Raise ValidationError if exceeded
   - Message: "Reserved quantity cannot exceed available quantity"
   - This prevents negative available_quantity

6. **Add reorder_point validation**
   - Check: `self.reorder_point >= 0`
   - Warn if reorder_point > quantity (configurable)
   - Consider reasonable thresholds

7. **Create custom validator functions**
   - Create validators.py in stock/ directory
   - Define: `validate_positive_quantity(value)`
   - Use in field definitions with validators parameter
   - DRY principle for quantity validations

8. **Add save override for additional checks**
   - Override `save()` method
   - Call `self.full_clean()` to trigger validation
   - Catch ValidationError and handle appropriately
   - Prevents invalid data from bypassing clean()

9. **Document validation rules**
   - Add comments explaining each validation
   - Document edge cases and exceptions
   - Explain impact of validation failures

### Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| quantity | >= 0 | "Quantity cannot be negative" |
| reserved_quantity | >= 0 | "Reserved quantity cannot be negative" |
| reserved_quantity | <= quantity | "Reserved quantity cannot exceed available quantity" |
| incoming_quantity | >= 0 | "Incoming quantity cannot be negative" |
| reorder_point | >= 0 | "Reorder point cannot be negative" |

### Clean Method Implementation
```python
# Add to StockLevel model:
# 
# def clean(self):
#     """Validate stock level data."""
#     super().clean()
#     
#     # Validate non-negative quantities
#     if self.quantity < 0:
#         raise ValidationError({'quantity': 'Quantity cannot be negative'})
#     
#     if self.reserved_quantity < 0:
#         raise ValidationError({'reserved_quantity': 'Reserved quantity cannot be negative'})
#     
#     if self.incoming_quantity < 0:
#         raise ValidationError({'incoming_quantity': 'Incoming quantity cannot be negative'})
#     
#     # Validate reserved <= quantity
#     if self.reserved_quantity > self.quantity:
#         raise ValidationError({
#             'reserved_quantity': 'Reserved quantity cannot exceed available quantity'
#         })
#     
#     # Additional validations...
```

### Custom Validators
```python
# validators.py:
# 
# from django.core.exceptions import ValidationError
# from decimal import Decimal
# 
# def validate_positive_quantity(value):
#     """Ensure quantity is non-negative."""
#     if value < Decimal('0'):
#         raise ValidationError('Quantity must be non-negative')
# 
# def validate_reserved_quantity(value):
#     """Validate reserved quantity."""
#     # Implementation
```

### Save Override Pattern
```python
# def save(self, *args, **kwargs):
#     # Run validation
#     self.full_clean()
#     
#     # Additional business logic
#     
#     # Save
#     super().save(*args, **kwargs)
```

### Bypassing Validation (Advanced)
For system operations that need to bypass validation:
```python
# skip_validation parameter (custom)
# Use with caution, only for system operations
# Document why validation is bypassed
```

### Verification Checklist
- [ ] clean() method added to StockLevel model
- [ ] All quantity fields validated as non-negative
- [ ] Reserved quantity validated <= quantity
- [ ] Custom validator functions created
- [ ] Validators applied to field definitions
- [ ] save() method calls full_clean()
- [ ] Appropriate error messages for each validation
- [ ] Edge cases documented and handled

---

## Task 17: Add Stock Cost Tracking

### Overview
Implement cost tracking functionality to calculate inventory value using weighted average cost method.

### Dependencies
- Task 03: StockLevel model exists
- Understanding of inventory costing methods

### Instructions

1. **Add cost_per_unit field**
   - Add DecimalField to StockLevel model
   - max_digits=15, decimal_places=2 (currency precision)
   - Set default to Decimal('0.00')
   - Represents weighted average cost per unit

2. **Add help text and documentation**
   - help_text: "Weighted average cost per unit in LKR"
   - Add comments explaining weighted average method
   - Document cost calculation triggers

3. **Create cost update method**
   - Add method: `update_average_cost(self, new_quantity, new_cost)`
   - Calculate weighted average when new stock arrives
   - Formula: `new_avg = (old_qty * old_cost + new_qty * new_cost) / (old_qty + new_qty)`
   - Update cost_per_unit field

4. **Add total stock value property**
   - Create property: `stock_value`
   - Calculate: `quantity * cost_per_unit`
   - Returns total value of stock at this location
   - Use Decimal for precision

5. **Document costing method**
   - Add model-level docstring section on costing
   - Explain weighted average cost method
   - Document when cost is updated:
     - On stock in/purchase receipt
     - On stock adjustments (if cost provided)
   - Note: Cost NOT updated on stock out/sales

6. **Add currency field** (optional)
   - If multi-currency supported
   - Add currency field: default='LKR'
   - Foreign key to Currency model or CharField

7. **Create cost history tracking** (optional)
   - Separate model: StockCostHistory
   - Track cost changes over time
   - Fields: stock_level FK, date, old_cost, new_cost, reason
   - Useful for cost analysis and reporting

8. **Add validation for cost**
   - Cost should be >= 0
   - Add validator in clean() method
   - Warn if cost is 0 (might indicate missing data)

### Weighted Average Cost Formula

```
New Average Cost = (Existing Quantity × Existing Cost) + (New Quantity × New Cost)
                   ────────────────────────────────────────────────────────────
                            Existing Quantity + New Quantity
```

### Example Calculation

| Operation | Quantity | Cost/Unit | Total Cost | New Avg Cost |
|-----------|----------|-----------|------------|--------------|
| Initial | 100 | 10.00 | 1,000.00 | 10.00 |
| Purchase | +50 | 12.00 | 600.00 | (1000+600)/150 = 10.67 |
| Sale | -30 | - | - | 10.67 (unchanged) |
| Purchase | +40 | 11.00 | 440.00 | (1067+440)/160 = 10.69 |

### Cost Update Scenarios

| Event | Update Cost? | Method |
|-------|--------------|--------|
| Purchase received | Yes | Calculate weighted average |
| Stock adjustment (add) | Yes (if cost provided) | Recalculate average |
| Stock out/sale | No | Cost remains same |
| Transfer | No | Use existing cost |
| Stock adjustment (reduce) | No | Cost remains same |

### Expected Field and Method Additions
```python
# Add to StockLevel model:
# 
# cost_per_unit = DecimalField(
#     max_digits=15,
#     decimal_places=2,
#     default=Decimal('0.00'),
#     help_text="Weighted average cost per unit in LKR"
# )
# 
# def update_average_cost(self, new_quantity, new_cost):
#     """Update weighted average cost with new purchase."""
#     if new_quantity <= 0:
#         return
#     
#     old_value = self.quantity * self.cost_per_unit
#     new_value = new_quantity * new_cost
#     total_quantity = self.quantity + new_quantity
#     
#     if total_quantity > 0:
#         self.cost_per_unit = (old_value + new_value) / total_quantity
# 
# @property
# def stock_value(self):
#     """Calculate total value of stock."""
#     return self.quantity * self.cost_per_unit
```

### Currency Considerations
- Default currency: LKR (Sri Lankan Rupee)
- Display with ₨ symbol in UI
- Store as Decimal for precision
- Consider exchange rate if multi-currency

### Verification Checklist
- [ ] cost_per_unit field added to model
- [ ] Field uses appropriate decimal precision
- [ ] update_average_cost method implemented
- [ ] Weighted average formula correctly implemented
- [ ] stock_value property added
- [ ] Cost validation in clean() method
- [ ] Docstrings explain costing method
- [ ] Comments document update scenarios

---

## Task 18: Create StockLevel Admin

### Overview
Configure Django admin interface for StockLevel model with filters, search, and custom displays for effective inventory management.

### Dependencies
- Tasks 03-17: StockLevel model complete
- Django admin framework

### Instructions

1. **Create admin file**
   - Create or update `admin.py` in `stock/` directory
   - Import Django admin and StockLevel model
   - Import related models for inlines

2. **Create ModelAdmin class**
   - Define class: `StockLevelAdmin(admin.ModelAdmin)`
   - Register with decorator: `@admin.register(StockLevel)`

3. **Configure list display**
   - Set list_display with columns:
     - product name
     - variant (if applicable)
     - warehouse name
     - location (if applicable)
     - quantity
     - reserved_quantity
     - available_quantity (custom method)
     - stock_status (custom method with colored indicator)
     - cost_per_unit
     - stock_value
     - last_stock_update
   - Use callables for calculated fields

4. **Add list filters**
   - Set list_filter:
     - warehouse (filter by warehouse)
     - stock status (custom filter)
     - product__category (product category)
     - created_at (date hierarchy)
   - Add search_fields:
     - product__name
     - product__sku
     - warehouse__name

5. **Create custom admin methods**
   - Method: `get_available_quantity(obj)` - display available
   - Method: `get_stock_status_colored(obj)` - status with color
   - Method: `get_stock_value(obj)` - formatted value
   - Set short_description for column headers
   - Add ordering preference

6. **Configure readonly fields**
   - Set readonly_fields:
     - available_quantity (calculated)
     - stock_status
     - stock_value
     - created_at
     - updated_at
   - Prevent manual editing of calculated values

7. **Add fieldsets for organization**
   - Group fields logically:
     - Product Information (product, variant)
     - Location Information (warehouse, location)
     - Quantity Information (quantity, reserved, incoming)
     - Costing (cost_per_unit, stock_value)
     - Thresholds (reorder_point)
     - System Info (timestamps, status)

8. **Create custom stock status filter**
   - Define SimpleListFilter: `StockStatusFilter`
   - Filter options: In Stock, Low Stock, Out of Stock
   - Override lookups() and queryset() methods
   - Use annotations for filtering

9. **Add inline for related data** (if applicable)
   - Consider TabularInline for StockMovement
   - Show recent movements for context
   - Set max_num and ordering

10. **Configure admin actions**
    - Action: Adjust reorder point (bulk update)
    - Action: Export to CSV
    - Action: Generate stock report
    - Set actions list

11. **Add admin permissions**
    - Override has_add_permission (restrict if needed)
    - Override has_change_permission
    - Override has_delete_permission (prevent accidental deletion)
    - Consider making mostly read-only, changes via API

### Admin Configuration Overview

| Section | Configuration | Purpose |
|---------|---------------|---------|
| list_display | 10+ columns | Overview of stock levels |
| list_filter | Status, warehouse, category | Quick filtering |
| search_fields | Product name, SKU | Find specific items |
| readonly_fields | Calculated values | Prevent manual editing |
| fieldsets | Logical grouping | Organized edit form |
| actions | Bulk operations | Efficiency |

### Custom Admin Methods
```python
# Add to StockLevelAdmin:
# 
# def get_available_quantity(self, obj):
#     """Display available quantity."""
#     return obj.available_quantity
# get_available_quantity.short_description = 'Available'
# get_available_quantity.admin_order_field = 'quantity'
# 
# def get_stock_status_colored(self, obj):
#     """Display stock status with color."""
#     status = obj.stock_status
#     colors = {
#         'in_stock': 'green',
#         'low_stock': 'orange',
#         'out_of_stock': 'red',
#     }
#     color = colors.get(status, 'black')
#     return format_html(
#         '<span style="color: {};">{}</span>',
#         color,
#         obj.get_stock_status_display()
#     )
# get_stock_status_colored.short_description = 'Status'
```

### Custom Status Filter
```python
# class StockStatusFilter(admin.SimpleListFilter):
#     title = 'stock status'
#     parameter_name = 'stock_status'
#     
#     def lookups(self, request, model_admin):
#         return [
#             ('in_stock', 'In Stock'),
#             ('low_stock', 'Low Stock'),
#             ('out_of_stock', 'Out of Stock'),
#         ]
#     
#     def queryset(self, request, queryset):
#         # Apply filters based on selection
#         # Use annotations and conditions
```

### Fieldsets Configuration
```python
# fieldsets = [
#     ('Product Information', {
#         'fields': ['product', 'variant']
#     }),
#     ('Location Information', {
#         'fields': ['warehouse', 'location']
#     }),
#     ('Quantities', {
#         'fields': ['quantity', 'reserved_quantity', 'incoming_quantity', 'available_quantity']
#     }),
#     ('Costing', {
#         'fields': ['cost_per_unit', 'stock_value']
#     }),
#     ('Settings', {
#         'fields': ['reorder_point']
#     }),
#     ('System Information', {
#         'fields': ['stock_status', 'created_at', 'updated_at'],
#         'classes': ['collapse']
#     }),
# ]
```

### Verification Checklist
- [ ] StockLevelAdmin class created and registered
- [ ] list_display configured with relevant fields
- [ ] list_filter includes status, warehouse, category
- [ ] search_fields enable product/SKU search
- [ ] Custom methods for calculated fields
- [ ] Colored stock status indicator
- [ ] readonly_fields for calculated values
- [ ] fieldsets organize form logically
- [ ] Custom stock status filter implemented
- [ ] Admin actions for common operations
- [ ] Permissions configured appropriately

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 14 | Create StockLevel signals | Signal handlers for integration |
| 15 | Add stock aggregation methods | Reporting and analytics methods |
| 16 | Create negative stock prevention | Validation rules and clean() method |
| 17 | Add stock cost tracking | Cost field and weighted average calculation |
| 18 | Create StockLevel admin | Admin interface configuration |

### Group A Complete Deliverables

**Files Created:**
```
apps/inventory/stock/
├── __init__.py               # Module initialization
├── constants.py              # Stock status constants
├── signals.py                # Django signals
├── validators.py             # Custom validators
├── admin.py                  # Admin configuration
└── models/
    ├── __init__.py
    └── stock_level.py        # Complete StockLevel model
```

**StockLevel Model - Complete Features:**
- ✓ Product, variant, warehouse, location foreign keys
- ✓ Quantity fields (quantity, reserved, incoming)
- ✓ Calculated properties (available, projected, status)
- ✓ Custom manager with query methods
- ✓ Aggregation methods for reporting
- ✓ Cost tracking with weighted average
- ✓ Validation preventing negative stock
- ✓ Django signals for integration
- ✓ Admin interface with filters and actions

### Next Steps
Group A (Stock Level Models) is now complete. Proceed to:
- **[../Group-B_Stock-Movement-Tracking/](../Group-B_Stock-Movement-Tracking/)** - Implement stock movement history and audit trail

---

## Notes for AI Agents

1. **Signal Order:** Register signals in AppConfig.ready() or import in __init__.py
2. **Validation Layers:** Use both clean() for model validation and service layer for business rules
3. **Cost Updates:** Only update cost on stock in operations, never on stock out
4. **Admin Performance:** Use select_related and prefetch_related in admin queryset
5. **Colored Status:** Use format_html for safe HTML rendering in admin
6. **Weighted Average:** Formula must handle zero quantities to avoid division by zero
7. **Next Group:** Group B will create StockMovement model for audit trail
8. **Integration:** Signals enable loose coupling between stock and other modules
