# Tasks 06-09: Quantity Fields & Meta Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** A - Stock Level Models  
> **Document:** 02 of 04  
> **Tasks Covered:** 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Stock-Submodule-Level-Model.md](01_Tasks-01-05_Stock-Submodule-Level-Model.md)
- **→ Next Document:** [03_Tasks-10-13_Manager-Aggregation-Methods.md](03_Tasks-10-13_Manager-Aggregation-Methods.md)

---

## Document Overview

This document covers the addition of specialized quantity fields for advanced inventory tracking and the configuration of model metadata including unique constraints and indexes.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Add reserved_quantity field | Low |
| 07 | Add available_quantity property | Low |
| 08 | Add incoming_quantity field | Low |
| 09 | Create StockLevel Meta class | Medium |

---

## Task 06: Add Reserved Quantity Field

### Overview
Add a field to track quantity reserved for pending orders, enabling accurate availability calculations while maintaining physical quantity separately.

### Dependencies
- Task 03: Create StockLevel model
- Phase-04, SubPhase-01: Order module planning

### Instructions

1. **Add reserved_quantity field**
   - Add DecimalField to StockLevel model
   - Use same precision as quantity field: max_digits=15, decimal_places=3
   - Set default value to 0
   - Field tracks stock allocated to unfulfilled orders

2. **Add field validation**
   - Ensure reserved_quantity cannot be negative
   - Add validator or clean method to check >= 0
   - Ensure reserved_quantity <= quantity (available stock cannot be negative)

3. **Add help text**
   - Add help_text: "Quantity reserved for pending orders but not yet fulfilled"
   - Clarifies field purpose for developers and admin users

4. **Document reservation lifecycle**
   - Add comments explaining reservation states:
     - On order creation: reserved_quantity += order_qty
     - On order fulfillment: reserved_quantity -= order_qty, quantity -= order_qty
     - On order cancellation: reserved_quantity -= order_qty
   - Reservation does not reduce physical quantity until fulfillment

5. **Consider reservation validation rules**
   - Cannot reserve more than available (quantity - reserved_quantity)
   - Cannot reserve from OUT_OF_STOCK items
   - Reservations must be released or fulfilled within timeout period

6. **Add database index** (optional)
   - Consider adding db_index if frequently filtered by reserved stock
   - Useful for queries finding items with reservations

### Reservation States

| State | Physical Qty | Reserved Qty | Available Qty | Description |
|-------|--------------|--------------|---------------|-------------|
| Initial | 100 | 0 | 100 | Full stock available |
| Reserved | 100 | 25 | 75 | 25 units reserved for orders |
| Fulfilled | 75 | 0 | 75 | Order shipped, both quantities reduced |
| Cancelled | 100 | 0 | 100 | Reservation released, stock available |

### Reservation Business Rules
- **Reserve:** Allocate stock when order is placed or confirmed
- **Commit:** Convert reservation to sale when order is fulfilled/shipped
- **Release:** Free reservation when order is cancelled or times out
- **Validation:** reserved_quantity must not exceed quantity

### Expected Field Addition
```python
# Add to StockLevel model:
# reserved_quantity = DecimalField(
#     max_digits=15,
#     decimal_places=3,
#     default=0,
#     help_text="..."
# )
# 
# Validation: 0 <= reserved_quantity <= quantity
```

### Verification Checklist
- [ ] reserved_quantity field added to StockLevel
- [ ] Field uses same precision as quantity field
- [ ] Default value is 0
- [ ] Validation ensures non-negative value
- [ ] Validation ensures reserved <= quantity
- [ ] Help text clearly explains purpose
- [ ] Comments document reservation lifecycle

---

## Task 07: Add Available Quantity Property

### Overview
Create a calculated property that returns the quantity available for new orders, computed as physical quantity minus reserved quantity.

### Dependencies
- Task 03: Create StockLevel model (quantity field)
- Task 06: Add reserved_quantity field

### Instructions

1. **Add available_quantity property**
   - Create Python @property method on StockLevel model
   - Property name: `available_quantity`
   - Not a database field - calculated dynamically

2. **Implement calculation logic**
   - Return formula: `quantity - reserved_quantity`
   - This represents stock that can be sold or reserved
   - Result may be 0 if all stock is reserved

3. **Add property docstring**
   - Document that this is a calculated field
   - Explain formula: "Physical quantity minus reserved quantity"
   - Note: "Represents stock available for new orders"

4. **Handle edge cases**
   - If result is negative (data inconsistency), return 0
   - Log warning if calculation yields negative value
   - Indicates reserved_quantity > quantity (invalid state)

5. **Document property usage**
   - Add comments explaining where to use this property:
     - Order validation: Check available_quantity before reserving
     - Stock availability API: Show available_quantity to users
     - Low stock alerts: Alert when available_quantity < reorder_point
   - Do NOT use this in database queries (use annotation instead)

6. **Create database annotation method** (optional for performance)
   - For queryset operations, create manager method that annotates available_quantity
   - Use F expressions: `F('quantity') - F('reserved_quantity')`
   - Enables filtering and ordering by available quantity

### Available Quantity Calculation

```
available_quantity = max(0, quantity - reserved_quantity)
```

### Use Cases

| Use Case | Query Type | Method |
|----------|------------|--------|
| Single instance | Model property | `stock_level.available_quantity` |
| Display in list | Model property | Loop and access property |
| Filter/order by available | QuerySet annotation | Use manager method with F expressions |
| API serialization | Model property | Include in serializer |

### Example Scenarios

| Quantity | Reserved | Available | Interpretation |
|----------|----------|-----------|----------------|
| 100 | 0 | 100 | All stock available |
| 100 | 25 | 75 | 75 units can be ordered |
| 100 | 100 | 0 | No stock available for new orders |
| 100 | 105 | 0 | Invalid state (log warning) |

### Expected Property Implementation
```python
# Add to StockLevel model:
# @property
# def available_quantity(self):
#     """Calculate available quantity for new orders."""
#     result = self.quantity - self.reserved_quantity
#     if result < 0:
#         # Log warning about data inconsistency
#         return Decimal('0')
#     return result
```

### Verification Checklist
- [ ] available_quantity property added to model
- [ ] Property uses @property decorator
- [ ] Calculation: quantity - reserved_quantity
- [ ] Returns 0 if result is negative
- [ ] Logs warning for negative results
- [ ] Docstring explains calculation and purpose
- [ ] Comments document usage scenarios

---

## Task 08: Add Incoming Quantity Field

### Overview
Add a field to track expected stock from pending purchase orders, enabling better stock planning and availability projections.

### Dependencies
- Task 03: Create StockLevel model
- Phase-04: Purchase Order module planning

### Instructions

1. **Add incoming_quantity field**
   - Add DecimalField to StockLevel model
   - Use same precision as quantity: max_digits=15, decimal_places=3
   - Set default value to 0
   - Field tracks expected stock from approved purchase orders

2. **Add field validation**
   - Ensure incoming_quantity cannot be negative
   - Add validator or clean method to check >= 0
   - No upper limit (multiple POs can be pending)

3. **Add help text**
   - Add help_text: "Expected quantity from pending purchase orders"
   - Helps users understand this is projected, not physical stock

4. **Document incoming stock lifecycle**
   - Add comments explaining lifecycle:
     - On PO approval: incoming_quantity += PO_qty
     - On goods receipt: incoming_quantity -= received_qty, quantity += received_qty
     - On PO cancellation: incoming_quantity -= PO_qty
   - Incoming quantity does not affect available quantity calculation

5. **Create projected availability property** (optional)
   - Consider adding property: `projected_quantity`
   - Formula: `quantity + incoming_quantity - reserved_quantity`
   - Shows future stock availability after pending receipts

6. **Document planning use cases**
   - Add comments on when to use incoming_quantity:
     - Procurement planning: Avoid duplicate orders
     - Customer commitments: Promise delivery dates
     - Reorder point alerts: Factor in incoming stock
     - Demand forecasting: Include pipeline inventory

### Incoming Stock States

| State | Quantity | Incoming | Reserved | Available | Projected |
|-------|----------|----------|----------|-----------|-----------|
| Initial | 50 | 0 | 10 | 40 | 40 |
| PO Created | 50 | 100 | 10 | 40 | 140 |
| Received | 150 | 0 | 10 | 140 | 140 |
| Orders Reserved | 150 | 0 | 50 | 100 | 100 |

### Incoming Quantity Business Rules
- **Add to Incoming:** When purchase order is approved/confirmed
- **Reduce Incoming:** When goods are received (partial or full)
- **Cancel Incoming:** When purchase order is cancelled
- **Not Part of Available:** Incoming stock cannot be reserved until received

### Projected Quantity Formula
```
projected_quantity = quantity + incoming_quantity - reserved_quantity
```

This represents the expected available stock after all pending receipts and reservations.

### Expected Field Addition
```python
# Add to StockLevel model:
# incoming_quantity = DecimalField(
#     max_digits=15,
#     decimal_places=3,
#     default=0,
#     help_text="..."
# )
#
# Optional property:
# @property
# def projected_quantity(self):
#     return self.quantity + self.incoming_quantity - self.reserved_quantity
```

### Verification Checklist
- [ ] incoming_quantity field added to StockLevel
- [ ] Field uses same precision as quantity field
- [ ] Default value is 0
- [ ] Validation ensures non-negative value
- [ ] Help text explains purpose
- [ ] Comments document lifecycle and use cases
- [ ] Consider adding projected_quantity property

---

## Task 09: Create StockLevel Meta Class

### Overview
Configure model metadata including database constraints, indexes, and ordering to ensure data integrity and query performance.

### Dependencies
- Tasks 03-08: All StockLevel model fields defined

### Instructions

1. **Create Meta class**
   - Add inner Meta class to StockLevel model
   - Place at end of model definition, before methods

2. **Define verbose names**
   - Set verbose_name = "Stock Level"
   - Set verbose_name_plural = "Stock Levels"
   - Used in admin interface and error messages

3. **Define database table name**
   - Set db_table = "inventory_stock_level"
   - Explicit table naming for clarity
   - Follows convention: app_model

4. **Configure unique constraint**
   - Add unique_together constraint
   - Fields: `(product, variant, warehouse, location)`
   - Prevents duplicate stock records for same product/location
   - Note: NULL values in variant and location must be handled carefully

5. **Define indexes**
   - Create composite indexes for common query patterns:
     - Index on (product, warehouse) - most common lookup
     - Index on (warehouse, location) - warehouse operations
     - Index on created_at - time-based queries
   - Single-field indexes already exist via db_index=True on FKs

6. **Set default ordering**
   - Order by: product name, warehouse name
   - Add ordering = ['product__name', 'warehouse__name']
   - Consistent ordering in admin and querysets

7. **Add model permissions** (optional)
   - Define custom permissions if needed:
     - can_adjust_stock
     - can_view_stock_levels
     - can_approve_adjustments
   - Default add/change/delete/view permissions auto-created

8. **Handle NULL values in unique constraint**
   - Document that PostgreSQL treats NULL values as distinct
   - Same product with NULL variant at same warehouse = multiple records possible
   - Consider adding database constraint or validation to prevent this
   - Option: Use Django's UniqueConstraint with condition parameter

### Meta Class Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| verbose_name | "Stock Level" | Human-readable singular name |
| verbose_name_plural | "Stock Levels" | Human-readable plural name |
| db_table | "inventory_stock_level" | Explicit table name |
| ordering | ['product__name', 'warehouse__name'] | Default sort order |
| unique_together | (product, variant, warehouse, location) | Prevent duplicates |

### Index Strategy

| Index Type | Fields | Purpose |
|------------|--------|---------|
| Single | product, warehouse, variant, location | FK indexes (from db_index=True) |
| Composite | (product, warehouse) | Common lookup pattern |
| Composite | (warehouse, location) | Warehouse operations |
| Single | created_at | Time-based queries |

### Unique Constraint Handling

**Challenge:** unique_together with NULL values
- PostgreSQL: NULL != NULL (allows multiple NULLs)
- Same product + NULL variant + same warehouse = multiple records allowed
- Solution options:
  1. Application-level validation in clean() method
  2. Database constraint with COALESCE
  3. Django 2.2+ UniqueConstraint with condition

**Recommended Approach:**
- Use Django's UniqueConstraint with condition parameter
- Create constraint that includes NULL handling logic
- Example: Constraint applies only when variant IS NOT NULL

### Expected Meta Class
```python
# Add to StockLevel model:
# class Meta:
#     verbose_name = "Stock Level"
#     verbose_name_plural = "Stock Levels"
#     db_table = "inventory_stock_level"
#     unique_together = [('product', 'variant', 'warehouse', 'location')]
#     ordering = ['product__name', 'warehouse__name']
#     indexes = [
#         # Composite indexes for common queries
#     ]
```

### Verification Checklist
- [ ] Meta class added to StockLevel model
- [ ] verbose_name and verbose_name_plural set
- [ ] db_table explicitly defined
- [ ] unique_together constraint defined
- [ ] Ordering specified for consistent results
- [ ] Indexes defined for common query patterns
- [ ] NULL handling in unique constraint documented
- [ ] Consider custom permissions if needed

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 06 | Add reserved_quantity field | Field tracking allocated stock |
| 07 | Add available_quantity property | Calculated available stock |
| 08 | Add incoming_quantity field | Expected stock from POs |
| 09 | Create StockLevel Meta class | Constraints, indexes, metadata |

### StockLevel Model - Complete Field List

**Database Fields:**
- product (ForeignKey) - Product being tracked
- warehouse (ForeignKey) - Storage location
- variant (ForeignKey, optional) - Product variant
- location (ForeignKey, optional) - Warehouse location
- quantity (DecimalField) - Physical stock on hand
- reserved_quantity (DecimalField) - Stock allocated to orders
- incoming_quantity (DecimalField) - Expected from POs
- reorder_point (DecimalField) - Low stock threshold

**Calculated Properties:**
- available_quantity - quantity - reserved_quantity
- projected_quantity (optional) - quantity + incoming - reserved

**Meta Configuration:**
- Unique constraint on product/variant/warehouse/location
- Indexes on common query patterns
- Default ordering by product and warehouse

### Quantity Fields Relationship

```
┌─────────────────────────────────────────┐
│         Physical Stock (quantity)        │
│                 = 100                    │
├─────────────────────┬───────────────────┤
│  Reserved (25)      │  Available (75)   │
│  For pending orders │  For new orders   │
└─────────────────────┴───────────────────┘

       Incoming Stock (incoming_quantity) = 50
       (Expected from purchase orders)

Projected Availability = 100 + 50 - 25 = 125
```

### Next Steps
Proceed to [03_Tasks-10-13_Manager-Aggregation-Methods.md](03_Tasks-10-13_Manager-Aggregation-Methods.md) to add custom model manager and aggregation methods.

---

## Notes for AI Agents

1. **Quantity Relationships:** Physical quantity >= reserved_quantity at all times
2. **Available vs Projected:** Available = current sellable; Projected = future sellable after receipts
3. **NULL Handling:** unique_together with NULL fields requires careful constraint design
4. **Property Performance:** Use properties for single instance; use annotations for querysets
5. **Incoming Stock:** Does not affect availability until goods are received
6. **Validation Order:** Validate reserved <= quantity in model clean() method
7. **Index Strategy:** Index fields used in WHERE, ORDER BY, and JOIN clauses
8. **Next Document:** Continue with model manager and business logic methods
