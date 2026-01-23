# Tasks 19-24: Movement Types & Model Structure

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** B - Stock Movement Tracking  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-30_Location-Reference-Fields.md](02_Tasks-25-30_Location-Reference-Fields.md)

---

## Document Overview

This document establishes the foundation for stock movement tracking by defining movement types, reasons, and creating the core StockMovement model with warehouse relationships.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Define movement type constants | Low |
| 20 | Define movement reason constants | Low |
| 21 | Create StockMovement model | Medium |
| 22 | Add variant FK | Low |
| 23 | Add source warehouse FK | Low |
| 24 | Add destination warehouse FK | Low |

---

## Task 19: Define Movement Type Constants

### Overview
Define constants for different types of stock movements to maintain consistency and enable proper validation of movement operations.

### Dependencies
- Group A: Stock module structure exists
- Task 02 (Group A): constants.py file created

### Instructions

1. **Update constants.py file**
   - Open `apps/inventory/stock/constants.py`
   - Add new section for movement type constants
   - Add section header comment

2. **Define movement type constants**
   - STOCK_IN: "stock_in" - Receiving goods into warehouse
   - STOCK_OUT: "stock_out" - Removing goods from warehouse
   - TRANSFER: "transfer" - Moving between warehouses
   - ADJUSTMENT: "adjustment" - Manual stock correction
   - RESERVED: "reserved" - Stock reserved for order
   - RELEASED: "released" - Reserved stock released

3. **Create movement type choices tuple**
   - Define MOVEMENT_TYPE_CHOICES
   - Include all types with human-readable descriptions
   - Format: `[(value, display_name), ...]`

4. **Document movement type usage**
   - Add detailed comments explaining each type:
     - STOCK_IN: Purchase receipts, returns from customers
     - STOCK_OUT: Sales, shipments, returns to supplier
     - TRANSFER: Between warehouses or locations
     - ADJUSTMENT: Physical count corrections, damage, theft
     - RESERVED: Allocated to orders but not yet fulfilled
     - RELEASED: Reservation cancelled or expired

5. **Define warehouse requirement rules**
   - Document which warehouses required for each type:
     - STOCK_IN: destination only (receiving)
     - STOCK_OUT: source only (shipping)
     - TRANSFER: both source and destination
     - ADJUSTMENT: either or both depending on correction type
     - RESERVED/RELEASED: single warehouse (where reserved)

### Movement Type Definitions

| Constant | Value | From WH | To WH | Description |
|----------|-------|---------|-------|-------------|
| STOCK_IN | stock_in | None | Required | Receiving goods |
| STOCK_OUT | stock_out | Required | None | Shipping goods |
| TRANSFER | transfer | Required | Required | Inter-warehouse movement |
| ADJUSTMENT | adjustment | Optional | Optional | Manual correction |
| RESERVED | reserved | N/A | N/A | Allocation to order |
| RELEASED | released | N/A | N/A | Release allocation |

### Warehouse Validation Rules

```
STOCK_IN:
- from_warehouse must be NULL
- to_warehouse must be NOT NULL

STOCK_OUT:
- from_warehouse must be NOT NULL
- to_warehouse must be NULL

TRANSFER:
- from_warehouse must be NOT NULL
- to_warehouse must be NOT NULL
- from_warehouse != to_warehouse

ADJUSTMENT:
- Flexible: can have either or both
- Depends on adjustment type

RESERVED/RELEASED:
- Special handling
- Update reserved_quantity only
- No physical movement
```

### Movement Type Use Cases

**STOCK_IN Examples:**
- Receiving purchase order
- Customer return
- Manufactured goods completion
- Found items (physical count discovered)

**STOCK_OUT Examples:**
- Order fulfillment / shipment
- Return to supplier
- Damaged goods disposal
- Theft/loss recording

**TRANSFER Examples:**
- Warehouse to warehouse
- Location to location within warehouse
- Store replenishment from main warehouse

**ADJUSTMENT Examples:**
- Physical count correction
- Damage write-off
- Expiry write-off
- Data correction

### Expected Constants Addition
```python
# Add to constants.py:
# 
# # Movement Type Constants
# STOCK_IN = 'stock_in'
# STOCK_OUT = 'stock_out'
# TRANSFER = 'transfer'
# ADJUSTMENT = 'adjustment'
# RESERVED = 'reserved'
# RELEASED = 'released'
# 
# MOVEMENT_TYPE_CHOICES = [
#     (STOCK_IN, 'Stock In'),
#     (STOCK_OUT, 'Stock Out'),
#     (TRANSFER, 'Transfer'),
#     (ADJUSTMENT, 'Adjustment'),
#     (RESERVED, 'Reserved'),
#     (RELEASED, 'Released'),
# ]
```

### Verification Checklist
- [ ] Six movement type constants defined
- [ ] MOVEMENT_TYPE_CHOICES tuple created
- [ ] Each type has clear description
- [ ] Warehouse requirements documented
- [ ] Use cases explained for each type
- [ ] Comments explain validation rules

---

## Task 20: Define Movement Reason Constants

### Overview
Define specific reasons for each movement type to provide detailed audit trail and enable better reporting and analysis.

### Dependencies
- Task 19: Movement type constants defined

### Instructions

1. **Add movement reason section to constants.py**
   - Add section header for movement reasons
   - Organize by movement type where applicable

2. **Define general reason constants**
   - PURCHASE: "purchase" - Goods from supplier
   - SALE: "sale" - Goods to customer
   - RETURN_FROM_CUSTOMER: "return_from_customer" - Customer return
   - RETURN_TO_SUPPLIER: "return_to_supplier" - Return to supplier
   - TRANSFER_OUT: "transfer" - Warehouse transfer

3. **Define adjustment reason constants**
   - DAMAGE: "damage" - Damaged goods
   - THEFT: "theft" - Theft or loss
   - EXPIRED: "expired" - Expired products
   - FOUND: "found" - Found during count (surplus)
   - CORRECTION: "correction" - Manual data correction
   - WRITE_OFF: "write_off" - General write-off

4. **Define reservation reason constants**
   - ORDER_PLACED: "order_placed" - Reserved for order
   - ORDER_CANCELLED: "order_cancelled" - Released from cancellation
   - ORDER_TIMEOUT: "order_timeout" - Released from timeout
   - MANUAL_RELEASE: "manual_release" - Manually released

5. **Create reason choices tuple**
   - Define MOVEMENT_REASON_CHOICES
   - Include all reasons with descriptions
   - Consider grouping by category in choices

6. **Document reason-to-type mapping**
   - Create comments showing which reasons apply to which types
   - Example: PURCHASE only for STOCK_IN
   - Example: SALE only for STOCK_OUT

7. **Add notes field guidance**
   - Document when additional notes are recommended
   - Example: CORRECTION always needs detailed notes
   - Example: THEFT may need incident reference

### Movement Reason Definitions

| Reason | Applies To | Description |
|--------|------------|-------------|
| PURCHASE | STOCK_IN | Receiving from supplier |
| SALE | STOCK_OUT | Selling to customer |
| RETURN_FROM_CUSTOMER | STOCK_IN | Customer return |
| RETURN_TO_SUPPLIER | STOCK_OUT | Return to supplier |
| TRANSFER_OUT | TRANSFER | Warehouse transfer |
| DAMAGE | ADJUSTMENT | Damaged goods |
| THEFT | ADJUSTMENT | Theft/loss |
| EXPIRED | ADJUSTMENT | Expired products |
| FOUND | ADJUSTMENT | Surplus from count |
| CORRECTION | ADJUSTMENT | Manual correction |
| WRITE_OFF | ADJUSTMENT | General write-off |
| ORDER_PLACED | RESERVED | Order reservation |
| ORDER_CANCELLED | RELEASED | Cancellation release |

### Reason-to-Type Mapping

```
STOCK_IN reasons:
- PURCHASE (most common)
- RETURN_FROM_CUSTOMER
- FOUND (adjustment as stock in)

STOCK_OUT reasons:
- SALE (most common)
- RETURN_TO_SUPPLIER
- DAMAGE (adjustment as stock out)
- THEFT (adjustment as stock out)
- EXPIRED (adjustment as stock out)
- WRITE_OFF

TRANSFER reasons:
- TRANSFER_OUT (generic)

ADJUSTMENT reasons:
- DAMAGE
- THEFT
- EXPIRED
- FOUND
- CORRECTION

RESERVED reasons:
- ORDER_PLACED

RELEASED reasons:
- ORDER_CANCELLED
- ORDER_TIMEOUT
- MANUAL_RELEASE
```

### Reason Selection Logic
```
if movement_type == STOCK_IN:
    allowed_reasons = [PURCHASE, RETURN_FROM_CUSTOMER, FOUND, CORRECTION]
elif movement_type == STOCK_OUT:
    allowed_reasons = [SALE, RETURN_TO_SUPPLIER, DAMAGE, THEFT, EXPIRED, WRITE_OFF]
elif movement_type == TRANSFER:
    allowed_reasons = [TRANSFER_OUT]
elif movement_type == ADJUSTMENT:
    allowed_reasons = [DAMAGE, THEFT, EXPIRED, FOUND, CORRECTION, WRITE_OFF]
elif movement_type == RESERVED:
    allowed_reasons = [ORDER_PLACED]
elif movement_type == RELEASED:
    allowed_reasons = [ORDER_CANCELLED, ORDER_TIMEOUT, MANUAL_RELEASE]
```

### Expected Constants Addition
```python
# Add to constants.py:
# 
# # Movement Reason Constants
# # General
# PURCHASE = 'purchase'
# SALE = 'sale'
# RETURN_FROM_CUSTOMER = 'return_from_customer'
# RETURN_TO_SUPPLIER = 'return_to_supplier'
# TRANSFER_OUT = 'transfer'
# 
# # Adjustments
# DAMAGE = 'damage'
# THEFT = 'theft'
# EXPIRED = 'expired'
# FOUND = 'found'
# CORRECTION = 'correction'
# WRITE_OFF = 'write_off'
# 
# # Reservations
# ORDER_PLACED = 'order_placed'
# ORDER_CANCELLED = 'order_cancelled'
# ORDER_TIMEOUT = 'order_timeout'
# MANUAL_RELEASE = 'manual_release'
# 
# MOVEMENT_REASON_CHOICES = [
#     # General
#     (PURCHASE, 'Purchase from Supplier'),
#     (SALE, 'Sale to Customer'),
#     # ... all others
# ]
```

### Verification Checklist
- [ ] All reason constants defined
- [ ] MOVEMENT_REASON_CHOICES tuple created
- [ ] Reasons organized by category
- [ ] Reason-to-type mapping documented
- [ ] Comments explain appropriate usage
- [ ] Notes guidance provided

---

## Task 21: Create StockMovement Model

### Overview
Create the core StockMovement model to record all stock changes, providing complete audit trail and movement history.

### Dependencies
- Tasks 19-20: Movement types and reasons defined
- Group A: StockLevel model exists

### Instructions

1. **Create stock_movement.py file**
   - Create in `apps/inventory/stock/models/` directory
   - Add file-level docstring explaining purpose
   - Import necessary dependencies

2. **Import required modules**
   - Import Django models and fields
   - Import base model mixins (TenantAwareModel)
   - Import Product, Warehouse models
   - Import movement constants

3. **Define StockMovement model class**
   - Inherit from TenantAwareModel
   - Add comprehensive class docstring
   - Purpose: "Records all stock movements for audit trail"

4. **Add product foreign key**
   - ForeignKey to Product model
   - on_delete=PROTECT (preserve history)
   - related_name="stock_movements"
   - db_index=True for query performance

5. **Add movement type field**
   - CharField with movement type choices
   - max_length=20
   - Use MOVEMENT_TYPE_CHOICES
   - Required field (not null)

6. **Add quantity field**
   - DecimalField for movement quantity
   - max_digits=15, decimal_places=3
   - Always positive (direction determined by type)
   - Validation: must be > 0

7. **Add movement date field**
   - DateTimeField for when movement occurred
   - auto_now_add=True for automatic timestamp
   - Or allow manual entry for backdated movements
   - db_index=True for date range queries

8. **Add string representation**
   - Define __str__ method
   - Format: "STOCK_IN: Product Name - Qty: 100 - Date"
   - Provides clear identification in logs

9. **Add verbose names**
   - Set verbose_name="Stock Movement"
   - Set verbose_name_plural="Stock Movements"

### StockMovement Core Fields

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| product | ForeignKey | Product moved | PROTECT, indexed |
| movement_type | CharField | Type of movement | choices, required |
| quantity | DecimalField | Amount moved | > 0, 3 decimals |
| movement_date | DateTimeField | When occurred | auto or manual, indexed |

### Movement Direction

Movement type determines direction:
- **Positive quantity (increases stock):** STOCK_IN, TRANSFER (destination)
- **Negative effect (decreases stock):** STOCK_OUT, TRANSFER (source)
- **No stock change:** RESERVED, RELEASED (affects reserved_quantity only)
- **Either:** ADJUSTMENT (can increase or decrease)

Note: quantity field always stores positive number. Sign determined by movement_type and warehouse (source vs destination).

### Model Design Decisions

**Why quantity is always positive:**
- Easier to understand and validate
- Movement type determines the effect
- Prevents confusion with negative numbers
- Clearer in reports and UI

**Why PROTECT on product FK:**
- Preserve complete audit history
- Prevent data loss from accidental deletion
- Movement history is critical for accounting

**Why index on movement_date:**
- Common query: movements in date range
- Required for reports and analytics
- Performance critical for large datasets

### Expected Model Structure
```python
# Create stock_movement.py:
# 
# from django.db import models
# from apps.core.models import TenantAwareModel
# from ..constants import MOVEMENT_TYPE_CHOICES
# 
# class StockMovement(TenantAwareModel):
#     """
#     Records all stock movements for complete audit trail.
#     
#     Tracks every change to stock levels including purchases, sales,
#     transfers, adjustments, and reservations.
#     """
#     
#     product = models.ForeignKey(
#         'products.Product',
#         on_delete=models.PROTECT,
#         related_name='stock_movements',
#         db_index=True
#     )
#     
#     movement_type = models.CharField(
#         max_length=20,
#         choices=MOVEMENT_TYPE_CHOICES
#     )
#     
#     quantity = models.DecimalField(
#         max_digits=15,
#         decimal_places=3
#     )
#     
#     movement_date = models.DateTimeField(
#         auto_now_add=True,
#         db_index=True
#     )
#     
#     def __str__(self):
#         return f"{self.movement_type}: {self.product.name} - {self.quantity}"
#     
#     class Meta:
#         verbose_name = "Stock Movement"
#         verbose_name_plural = "Stock Movements"
```

### Verification Checklist
- [ ] stock_movement.py file created
- [ ] StockMovement model inherits from TenantAwareModel
- [ ] product FK with PROTECT and index
- [ ] movement_type CharField with choices
- [ ] quantity DecimalField with positive constraint
- [ ] movement_date DateTimeField with index
- [ ] __str__ method provides clear representation
- [ ] Verbose names defined

---

## Task 22: Add Variant FK

### Overview
Add product variant support to stock movements, enabling tracking of movements for specific variants.

### Dependencies
- Task 21: StockMovement model created
- SubPhase-04: ProductVariant model exists

### Instructions

1. **Add variant foreign key**
   - Add ForeignKey to ProductVariant model
   - null=True, blank=True (optional)
   - on_delete=CASCADE (variant deleted = cascade movements)
   - related_name="stock_movements"
   - db_index=True

2. **Add help text**
   - help_text="Product variant if applicable"
   - Clarify that NULL means product has no variants

3. **Document variant usage logic**
   - Add comments explaining:
     - NULL variant: Product has no variants
     - Populated variant: Movement for specific variant
     - Variant must belong to the product (validate in service layer)

4. **Update string representation** (optional)
   - Include variant in __str__ if present
   - Format: "STOCK_IN: Product Name (Variant) - Qty: 100"
   - Show variant only if not NULL

5. **Consider variant-product validation**
   - Note: Service layer should validate variant belongs to product
   - Database constraint difficult due to NULL handling
   - Add to clean() method or service validation

### Variant Field Configuration

```python
# Add to StockMovement model:
# variant = models.ForeignKey(
#     'products.ProductVariant',
#     on_delete=models.CASCADE,
#     null=True,
#     blank=True,
#     related_name='stock_movements',
#     db_index=True,
#     help_text="Product variant if applicable"
# )
```

### Variant Tracking Scenarios

| Scenario | Product | Variant | Valid? |
|----------|---------|---------|--------|
| Simple product | Product A | NULL | Yes |
| Product with variants | Product B | Variant 1 | Yes |
| Product with variants | Product B | Variant 2 | Yes |
| Product with variants | Product B | NULL | No - must specify variant |
| Mismatched | Product A | Variant from Product B | No - validation error |

### Verification Checklist
- [ ] variant FK added to model
- [ ] Field is nullable and optional
- [ ] on_delete=CASCADE set
- [ ] db_index=True for performance
- [ ] Help text explains usage
- [ ] Comments document validation logic
- [ ] String representation updated (optional)

---

## Task 23: Add Source Warehouse FK

### Overview
Add source warehouse foreign key to track where stock is coming from in movements.

### Dependencies
- Task 21: StockMovement model exists
- SubPhase-08: Warehouse model exists

### Instructions

1. **Add from_warehouse foreign key**
   - Add ForeignKey to Warehouse model
   - null=True, blank=True (optional - not required for all types)
   - on_delete=PROTECT (preserve movement history)
   - related_name="outgoing_movements"
   - db_index=True

2. **Add help text**
   - help_text="Source warehouse (required for STOCK_OUT and TRANSFER)"
   - Clarifies when field is required

3. **Document warehouse requirement rules**
   - Add comments explaining per movement type:
     - STOCK_IN: from_warehouse must be NULL
     - STOCK_OUT: from_warehouse required, to_warehouse NULL
     - TRANSFER: from_warehouse required
     - ADJUSTMENT: optional (depends on adjustment type)
     - RESERVED/RELEASED: single warehouse reference

4. **Add validation notes**
   - Note: Validation enforced in service layer
   - Clean method should validate based on movement_type
   - Cannot be same as to_warehouse for TRANSFER

### Source Warehouse Rules

| Movement Type | from_warehouse | Validation |
|---------------|----------------|------------|
| STOCK_IN | NULL | Must be NULL (receiving from external) |
| STOCK_OUT | Required | Must NOT be NULL (shipping from warehouse) |
| TRANSFER | Required | Must NOT be NULL, != to_warehouse |
| ADJUSTMENT | Optional | Flexible based on adjustment type |
| RESERVED | Either | Warehouse where stock is reserved |
| RELEASED | Either | Warehouse where stock was reserved |

### Expected Field Addition
```python
# Add to StockMovement model:
# from_warehouse = models.ForeignKey(
#     'warehouse.Warehouse',
#     on_delete=models.PROTECT,
#     null=True,
#     blank=True,
#     related_name='outgoing_movements',
#     db_index=True,
#     help_text="Source warehouse (required for STOCK_OUT and TRANSFER)"
# )
```

### Verification Checklist
- [ ] from_warehouse FK added to model
- [ ] Field is nullable (optional)
- [ ] on_delete=PROTECT preserves history
- [ ] related_name is "outgoing_movements"
- [ ] db_index=True for query performance
- [ ] Help text explains requirement rules
- [ ] Comments document validation logic

---

## Task 24: Add Destination Warehouse FK

### Overview
Add destination warehouse foreign key to track where stock is going in movements.

### Dependencies
- Task 23: Source warehouse FK exists

### Instructions

1. **Add to_warehouse foreign key**
   - Add ForeignKey to Warehouse model
   - null=True, blank=True (optional - not required for all types)
   - on_delete=PROTECT (preserve history)
   - related_name="incoming_movements"
   - db_index=True

2. **Add help text**
   - help_text="Destination warehouse (required for STOCK_IN and TRANSFER)"
   - Clarifies requirement rules

3. **Document warehouse requirement rules**
   - Add comments for each movement type:
     - STOCK_IN: to_warehouse required, from_warehouse NULL
     - STOCK_OUT: to_warehouse must be NULL
     - TRANSFER: to_warehouse required
     - Others: as documented for source warehouse

4. **Add validation constraint notes**
   - For TRANSFER: from_warehouse != to_warehouse
   - Validation in clean() method or service layer
   - Both warehouses should belong to same tenant (if multi-tenant)

5. **Update model documentation**
   - Add/update class docstring
   - Explain source and destination warehouse usage
   - Provide examples for each movement type

### Destination Warehouse Rules

| Movement Type | to_warehouse | Validation |
|---------------|--------------|------------|
| STOCK_IN | Required | Must NOT be NULL (receiving into warehouse) |
| STOCK_OUT | NULL | Must be NULL (shipping to external) |
| TRANSFER | Required | Must NOT be NULL, != from_warehouse |
| ADJUSTMENT | Optional | Flexible based on adjustment type |
| RESERVED | Either | Warehouse where reservation is made |
| RELEASED | Either | Warehouse where reservation was made |

### Transfer Movement Pattern
```
TRANSFER movement requires both warehouses:
- from_warehouse: Source (stock decreases)
- to_warehouse: Destination (stock increases)
- Quantity: Same for both (what leaves = what arrives)
- from_warehouse != to_warehouse (cannot transfer to self)
```

### Expected Field Addition
```python
# Add to StockMovement model:
# to_warehouse = models.ForeignKey(
#     'warehouse.Warehouse',
#     on_delete=models.PROTECT,
#     null=True,
#     blank=True,
#     related_name='incoming_movements',
#     db_index=True,
#     help_text="Destination warehouse (required for STOCK_IN and TRANSFER)"
# )
```

### Warehouse Validation Summary
```python
# Validation rules in clean() or service:
# 
# if movement_type == STOCK_IN:
#     assert from_warehouse is None
#     assert to_warehouse is not None
# 
# elif movement_type == STOCK_OUT:
#     assert from_warehouse is not None
#     assert to_warehouse is None
# 
# elif movement_type == TRANSFER:
#     assert from_warehouse is not None
#     assert to_warehouse is not None
#     assert from_warehouse != to_warehouse
```

### Verification Checklist
- [ ] to_warehouse FK added to model
- [ ] Field is nullable (optional)
- [ ] on_delete=PROTECT preserves history
- [ ] related_name is "incoming_movements"
- [ ] db_index=True for performance
- [ ] Help text explains requirements
- [ ] Comments document validation rules
- [ ] Model docstring updated with examples

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Define movement type constants | 6 movement type constants |
| 20 | Define movement reason constants | 14+ reason constants |
| 21 | Create StockMovement model | Core model structure |
| 22 | Add variant FK | Variant-level movement tracking |
| 23 | Add source warehouse FK | Source tracking |
| 24 | Add destination warehouse FK | Destination tracking |

### Current StockMovement Model Structure

**Core Fields:**
- product (ForeignKey) - Required
- variant (ForeignKey) - Optional
- movement_type (CharField) - Required, choices
- quantity (DecimalField) - Required, positive
- movement_date (DateTimeField) - Auto timestamp
- from_warehouse (ForeignKey) - Optional, depends on type
- to_warehouse (ForeignKey) - Optional, depends on type

**Pending (Next Documents):**
- Location FKs (source/destination)
- Reason field
- Reference fields (link to orders, POs)
- Notes field
- Cost tracking
- Created_by user
- Meta class and validation
- Manager methods
- Admin interface

### Next Steps
Proceed to [02_Tasks-25-30_Location-Reference-Fields.md](02_Tasks-25-30_Location-Reference-Fields.md) to add location tracking, reference fields, and additional metadata.

---

## Notes for AI Agents

1. **Warehouse Logic:** Carefully validate warehouse requirements per movement type
2. **Quantity Sign:** Always positive; direction determined by movement_type and warehouse
3. **PROTECT vs CASCADE:** Use PROTECT for critical relationships (product, warehouse) to preserve history
4. **Indexing:** Index all FKs and date fields for query performance
5. **Validation:** Enforce warehouse rules in service layer and clean() method
6. **Related Names:** Distinguish incoming vs outgoing movements for warehouse queries
7. **Next Document:** Add location tracking and reference linking
