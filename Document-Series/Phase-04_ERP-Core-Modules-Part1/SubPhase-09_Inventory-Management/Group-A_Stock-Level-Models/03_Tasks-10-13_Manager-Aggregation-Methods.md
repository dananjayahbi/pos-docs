# Tasks 10-13: Manager & Aggregation Methods

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** A - Stock Level Models  
> **Document:** 03 of 04  
> **Tasks Covered:** 10, 11, 12, 13

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-09_Quantity-Fields-Meta.md](02_Tasks-06-09_Quantity-Fields-Meta.md)
- **→ Next Document:** [04_Tasks-14-18_Signals-Validation-Admin.md](04_Tasks-14-18_Signals-Validation-Admin.md)

---

## Document Overview

This document covers the creation of a custom model manager with specialized query methods and the implementation of business logic methods for stock level calculations and status determination.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 10 | Add StockLevel model manager | Medium |
| 11 | Add get_available_by_warehouse | Medium |
| 12 | Create stock status property | Medium |
| 13 | Add last_updated tracking | Low |

---

## Task 10: Add StockLevel Model Manager

### Overview
Create a custom model manager to provide convenient methods for common stock-related queries and operations.

### Dependencies
- Task 09: StockLevel Meta class complete
- SubPhase-03: Understanding of Django model managers

### Instructions

1. **Create manager class**
   - Define StockLevelManager class inheriting from models.Manager
   - Add class-level docstring explaining manager purpose
   - Place before StockLevel model definition in same file

2. **Implement get_for_product method**
   - Create method: `get_for_product(self, product, variant=None)`
   - Returns queryset of stock levels for given product
   - Filter by product FK
   - If variant provided, filter by variant as well
   - If variant is None, filter for variant__isnull=True (simple products)

3. **Implement get_total_stock method**
   - Create method: `get_total_stock(self, product, variant=None)`
   - Returns total quantity across all warehouses for a product
   - Use aggregate function with Sum on quantity field
   - Filter by product and variant (if provided)
   - Return Decimal('0') if no stock found

4. **Implement get_by_warehouse method**
   - Create method: `get_by_warehouse(self, warehouse)`
   - Returns all stock levels for given warehouse
   - Filter by warehouse FK
   - Useful for warehouse inventory reports

5. **Implement low_stock_items method**
   - Create method: `low_stock_items(self)`
   - Returns queryset of items below reorder point
   - Filter using annotation: `F('quantity') - F('reserved_quantity') <= F('reorder_point')`
   - Excludes OUT_OF_STOCK items (quantity > 0)
   - Useful for automatic reorder alerts

6. **Implement annotate_available_quantity method**
   - Create method: `annotate_available_quantity(self)`
   - Returns queryset with available_quantity annotation
   - Use F expressions: `F('quantity') - F('reserved_quantity')`
   - Annotated field name: 'available_quantity'
   - Enables filtering and ordering by available quantity

7. **Assign manager to model**
   - Add to StockLevel model: `objects = StockLevelManager()`
   - Replaces default manager
   - All queries now have access to custom methods

### Manager Methods Overview

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| get_for_product | product, variant=None | QuerySet | Stock levels for specific product |
| get_total_stock | product, variant=None | Decimal | Total quantity across all warehouses |
| get_by_warehouse | warehouse | QuerySet | All stock in a warehouse |
| low_stock_items | - | QuerySet | Items below reorder point |
| annotate_available_quantity | - | QuerySet | Add available_quantity to queryset |

### Manager Usage Examples

**Get stock for product:**
```python
# All warehouses for a product
stock_levels = StockLevel.objects.get_for_product(product)

# Specific variant
stock_levels = StockLevel.objects.get_for_product(product, variant=variant_obj)
```

**Get total stock across warehouses:**
```python
total = StockLevel.objects.get_total_stock(product)
# Returns: Decimal('150.000')
```

**Find low stock items:**
```python
low_stock = StockLevel.objects.low_stock_items()
# Returns queryset where available <= reorder_point and quantity > 0
```

**Query with available quantity:**
```python
# Annotate and filter
stock = StockLevel.objects.annotate_available_quantity()
available_stock = stock.filter(available_quantity__gt=10)

# Order by availability
stock.order_by('-available_quantity')
```

### Expected Manager Structure
```python
# Add before StockLevel model:
# class StockLevelManager(models.Manager):
#     """Custom manager for StockLevel queries."""
#     
#     def get_for_product(self, product, variant=None):
#         # Implementation
#     
#     def get_total_stock(self, product, variant=None):
#         # Implementation with aggregate
#     
#     def get_by_warehouse(self, warehouse):
#         # Implementation
#     
#     def low_stock_items(self):
#         # Implementation with F expressions
#     
#     def annotate_available_quantity(self):
#         # Implementation with annotation
```

### Verification Checklist
- [ ] StockLevelManager class created
- [ ] Manager inherits from models.Manager
- [ ] get_for_product method implemented
- [ ] get_total_stock method with aggregation
- [ ] get_by_warehouse method implemented
- [ ] low_stock_items method with F expressions
- [ ] annotate_available_quantity method implemented
- [ ] Manager assigned to StockLevel.objects
- [ ] Docstrings explain each method's purpose

---

## Task 11: Add Get Available By Warehouse Method

### Overview
Create a manager method that returns available quantity per warehouse for a product, useful for multi-warehouse availability displays.

### Dependencies
- Task 10: StockLevel model manager exists

### Instructions

1. **Add method to StockLevelManager**
   - Create method: `get_available_by_warehouse(self, product, variant=None)`
   - Returns dictionary mapping warehouse to available quantity
   - Includes all warehouses with stock for the product

2. **Implement query logic**
   - Filter stock levels by product (and variant if provided)
   - Annotate with available_quantity using F expressions
   - Select related warehouse for efficient access
   - Order by warehouse name for consistent results

3. **Build result dictionary**
   - Create dict with warehouse as key
   - Value is available quantity (Decimal)
   - Format: `{warehouse_obj: Decimal('available_qty')}`
   - Include only warehouses with stock records

4. **Handle zero and negative availability**
   - Include entries even if available is 0
   - Clamp negative values to 0 (data inconsistency protection)
   - Log warning if negative availability found

5. **Create alternate format methods** (optional)
   - Method: `get_available_by_warehouse_id` - returns {warehouse_id: qty}
   - Method: `get_available_by_warehouse_name` - returns {warehouse_name: qty}
   - Useful for API responses and reports

6. **Document use cases**
   - Add docstring explaining when to use this method:
     - Multi-warehouse availability display
     - Transfer decision support
     - Customer service stock lookups
     - Demand planning per location

### Method Signature and Return Format

**Method:**
```python
def get_available_by_warehouse(self, product, variant=None) -> dict
```

**Return format:**
```python
{
    warehouse_obj_1: Decimal('50.000'),
    warehouse_obj_2: Decimal('75.000'),
    warehouse_obj_3: Decimal('0.000'),
}
```

**Alternative formats:**
```python
# By ID
get_available_by_warehouse_id(product, variant=None)
# Returns: {1: Decimal('50.000'), 2: Decimal('75.000')}

# By name
get_available_by_warehouse_name(product, variant=None)
# Returns: {'Main Warehouse': Decimal('50.000'), 'Store A': Decimal('75.000')}
```

### Use Case Examples

**Multi-warehouse availability display:**
```python
availability = StockLevel.objects.get_available_by_warehouse(product)
for warehouse, qty in availability.items():
    print(f"{warehouse.name}: {qty} available")
```

**API response:**
```python
# Convert to serializable format
availability_dict = StockLevel.objects.get_available_by_warehouse_id(product)
# Returns: {1: 50.0, 2: 75.0} - ready for JSON
```

**Transfer planning:**
```python
availability = StockLevel.objects.get_available_by_warehouse(product)
low_stock_wh = min(availability, key=availability.get)
high_stock_wh = max(availability, key=availability.get)
# Suggest transfer from high_stock_wh to low_stock_wh
```

### Implementation Approach
```python
# Pseudocode structure:
# 1. Filter stock levels by product/variant
# 2. Annotate with available = F('quantity') - F('reserved_quantity')
# 3. Select related warehouse
# 4. Build dictionary from queryset
# 5. Handle edge cases (negative, missing)
```

### Expected Method Addition
```python
# Add to StockLevelManager:
# def get_available_by_warehouse(self, product, variant=None):
#     """Get available quantity per warehouse for a product."""
#     # Filter and annotate
#     # Build result dictionary
#     # Return {warehouse: available_qty}
# 
# def get_available_by_warehouse_id(self, product, variant=None):
#     """Get available quantity per warehouse ID."""
#     # Similar to above but returns {warehouse_id: qty}
```

### Verification Checklist
- [ ] get_available_by_warehouse method added to manager
- [ ] Method accepts product and optional variant
- [ ] Returns dictionary with warehouse as key
- [ ] Uses F expressions for available calculation
- [ ] Selects related warehouse for efficiency
- [ ] Handles zero and negative values appropriately
- [ ] Alternate format methods created (optional)
- [ ] Docstring explains use cases

---

## Task 12: Create Stock Status Property

### Overview
Add a property to dynamically determine stock status (IN_STOCK, LOW_STOCK, OUT_OF_STOCK) based on current quantity and reorder point.

### Dependencies
- Task 02: Stock status constants defined
- Task 07: Available quantity property exists

### Instructions

1. **Add stock_status property**
   - Create property method: `stock_status(self)`
   - Use @property decorator
   - Returns one of the stock status constants
   - Based on available quantity and reorder point

2. **Implement status determination logic**
   - If quantity <= 0: return OUT_OF_STOCK
   - Else if available_quantity <= 0: return OUT_OF_STOCK (all reserved)
   - Else if available_quantity <= reorder_point: return LOW_STOCK
   - Else: return IN_STOCK

3. **Add status display method**
   - Create method: `get_stock_status_display(self)`
   - Returns human-readable status
   - Use STOCK_STATUS_CHOICES for display values
   - Mimics Django's auto-generated get_FOO_display() methods

4. **Add status color method** (optional)
   - Create method: `get_stock_status_color(self)`
   - Returns CSS color class or hex code
   - IN_STOCK: green
   - LOW_STOCK: yellow/orange
   - OUT_OF_STOCK: red
   - Useful for UI displays

5. **Add status icon method** (optional)
   - Create method: `get_stock_status_icon(self)`
   - Returns icon name or emoji
   - IN_STOCK: ✓ or 'check'
   - LOW_STOCK: ⚠ or 'warning'
   - OUT_OF_STOCK: ✗ or 'cross'

6. **Document status determination**
   - Add docstring explaining logic
   - Note that status uses available_quantity, not just quantity
   - Explain that reserved stock affects status

### Status Determination Logic

```
quantity <= 0
    → OUT_OF_STOCK

available_quantity <= 0
    → OUT_OF_STOCK (all stock is reserved)

available_quantity <= reorder_point
    → LOW_STOCK (below threshold)

available_quantity > reorder_point
    → IN_STOCK (sufficient stock)
```

### Status Examples

| Quantity | Reserved | Available | Reorder Pt | Status |
|----------|----------|-----------|------------|--------|
| 0 | 0 | 0 | 10 | OUT_OF_STOCK |
| 50 | 50 | 0 | 10 | OUT_OF_STOCK |
| 5 | 0 | 5 | 10 | LOW_STOCK |
| 10 | 0 | 10 | 10 | LOW_STOCK |
| 50 | 10 | 40 | 10 | IN_STOCK |
| 100 | 0 | 100 | 10 | IN_STOCK |

### UI Presentation Mapping

| Status | Color | Icon | CSS Class |
|--------|-------|------|-----------|
| IN_STOCK | Green | ✓ | status-in-stock |
| LOW_STOCK | Orange | ⚠ | status-low-stock |
| OUT_OF_STOCK | Red | ✗ | status-out-of-stock |

### Expected Property Implementation
```python
# Add to StockLevel model:
# @property
# def stock_status(self):
#     """Determine current stock status based on availability."""
#     if self.quantity <= 0:
#         return OUT_OF_STOCK
#     
#     available = self.available_quantity
#     if available <= 0:
#         return OUT_OF_STOCK
#     elif available <= self.reorder_point:
#         return LOW_STOCK
#     else:
#         return IN_STOCK
# 
# def get_stock_status_display(self):
#     """Get human-readable status."""
#     # Lookup in STOCK_STATUS_CHOICES
# 
# def get_stock_status_color(self):
#     """Get color for status display."""
#     # Return color based on status
```

### Verification Checklist
- [ ] stock_status property added to model
- [ ] Property returns correct status constant
- [ ] Logic considers available_quantity, not just quantity
- [ ] Handles edge cases (zero, negative)
- [ ] get_stock_status_display method added
- [ ] Optional: get_stock_status_color method
- [ ] Optional: get_stock_status_icon method
- [ ] Docstring explains determination logic

---

## Task 13: Add Last Updated Tracking

### Overview
Add automatic timestamp tracking to monitor when stock levels were last modified, supporting audit trails and cache invalidation.

### Dependencies
- Task 03: StockLevel model exists
- SubPhase-03: Base model mixins with timestamp fields

### Instructions

1. **Verify timestamp fields from base model**
   - Check if TenantAwareModel or TimeStampedModel provides:
     - created_at field
     - updated_at field (auto_now=True)
   - If provided by base model, no additional fields needed

2. **Add last_stock_update field** (if not using base model timestamps)
   - Add DateTimeField: `last_stock_update`
   - Set auto_now=True to update on every save
   - Set editable=False
   - Add help_text: "Last time stock quantity was modified"

3. **Create method to track quantity changes**
   - Override save() method to detect quantity changes
   - Compare self.quantity with original value from database
   - Only update timestamp if quantity, reserved, or incoming changed
   - Call super().save() after modifications

4. **Add method to get last change info**
   - Create method: `get_last_change_info(self)`
   - Returns dict with last change details:
     - timestamp
     - changed fields
     - changed by (if user tracking exists)
   - Requires integration with audit/history system

5. **Create stock age property**
   - Add property: `days_since_last_change`
   - Calculate days between last_stock_update and now
   - Useful for identifying stale inventory
   - Return None if never updated

6. **Add indexes for timestamp queries**
   - Add index on last_stock_update field in Meta.indexes
   - Enables efficient queries for recent changes
   - Useful for change reports and notifications

7. **Document tracking purpose**
   - Add comments explaining use cases:
     - Cache invalidation triggers
     - Change audit trails
     - Stale inventory identification
     - Activity reports

### Timestamp Fields

| Field | Type | Auto Update | Purpose |
|-------|------|-------------|---------|
| created_at | DateTimeField | On creation | Record creation time |
| updated_at | DateTimeField | On every save | Last modification time |
| last_stock_update | DateTimeField | On quantity change | Stock-specific changes |

### Save Override Pattern
```python
# Override save method:
# def save(self, *args, **kwargs):
#     # Detect quantity changes
#     if self.pk:
#         old_instance = StockLevel.objects.get(pk=self.pk)
#         if (old_instance.quantity != self.quantity or
#             old_instance.reserved_quantity != self.reserved_quantity):
#             # Quantity changed, timestamp updates automatically
#             pass
#     
#     super().save(*args, **kwargs)
```

### Stock Age Calculation
```python
# @property
# def days_since_last_change(self):
#     if not self.last_stock_update:
#         return None
#     delta = timezone.now() - self.last_stock_update
#     return delta.days
```

### Use Cases for Timestamps

**Cache invalidation:**
- Invalidate product availability cache when stock updated
- Compare cache timestamp with last_stock_update

**Stale inventory reports:**
- Find stock unchanged for 90+ days
- Query: `days_since_last_change > 90`

**Activity dashboards:**
- Show recent stock movements
- Filter by last_stock_update within last 24 hours

**Change notifications:**
- Trigger alerts when stock updated
- Use signal on post_save with timestamp check

### Expected Implementation
```python
# If not in base model, add to StockLevel:
# last_stock_update = DateTimeField(
#     auto_now=True,
#     editable=False,
#     help_text="Last time stock quantity was modified"
# )
# 
# def save(self, *args, **kwargs):
#     # Detect changes and update timestamp
#     super().save(*args, **kwargs)
# 
# @property
# def days_since_last_change(self):
#     # Calculate age
```

### Verification Checklist
- [ ] Timestamp fields verified from base model
- [ ] last_stock_update field added (if needed)
- [ ] save() method override detects changes
- [ ] days_since_last_change property added
- [ ] Index on timestamp added to Meta
- [ ] Comments explain tracking use cases
- [ ] Integration with audit system considered

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 10 | Add StockLevel model manager | Custom manager with query methods |
| 11 | Add get_available_by_warehouse | Per-warehouse availability mapping |
| 12 | Create stock status property | Dynamic status determination |
| 13 | Add last_updated tracking | Timestamp and change tracking |

### StockLevel Model - Complete Method List

**Manager Methods (StockLevel.objects):**
- get_for_product(product, variant) - Filter by product/variant
- get_total_stock(product, variant) - Sum across warehouses
- get_by_warehouse(warehouse) - Filter by warehouse
- low_stock_items() - Items below reorder point
- annotate_available_quantity() - Add available to queryset
- get_available_by_warehouse(product, variant) - Per-warehouse availability

**Instance Properties:**
- available_quantity - Calculated from quantity - reserved
- projected_quantity - Includes incoming stock
- stock_status - IN_STOCK/LOW_STOCK/OUT_OF_STOCK
- days_since_last_change - Stock age in days

**Instance Methods:**
- get_stock_status_display() - Human-readable status
- get_stock_status_color() - Color for UI
- get_stock_status_icon() - Icon for UI
- save() - Override to track changes

### Next Steps
Proceed to [04_Tasks-14-18_Signals-Validation-Admin.md](04_Tasks-14-18_Signals-Validation-Admin.md) to implement signals, validation, cost tracking, and admin interface.

---

## Notes for AI Agents

1. **Manager vs Property:** Use manager methods for querysets; use properties for single instances
2. **F Expressions:** Use F() for database-level calculations in queries
3. **Aggregation:** Use aggregate() for single values; use annotate() for per-row values
4. **Status Logic:** Status based on available_quantity (considers reservations)
5. **Timestamp Strategy:** Leverage base model fields when available
6. **Performance:** Always select_related and prefetch_related for related objects
7. **Next Document:** Complete model with signals, validation, and admin interface
