# Tasks 31-36: Meta, Manager, Validation & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** B - Stock Movement Tracking  
> **Document:** 03 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-30_Location-Reference-Fields.md](02_Tasks-25-30_Location-Reference-Fields.md)
- **→ Next Group:** [../Group-C_Stock-Operations-Services/](../Group-C_Stock-Operations-Services/)

---

## Document Overview

This document completes the StockMovement model by adding metadata configuration, custom manager with query methods, comprehensive validation, reversal support, summary methods, and admin interface.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create StockMovement Meta class | Medium |
| 32 | Add StockMovement manager | Medium |
| 33 | Create movement validation | Medium |
| 34 | Add movement reversal support | High |
| 35 | Create movement summary methods | Medium |
| 36 | Create StockMovement admin | Medium |

---

## Task 31: Create StockMovement Meta Class

### Overview
Configure model metadata including database settings, indexes, ordering, and permissions for optimal performance and usability.

### Dependencies
- Tasks 21-30: All StockMovement fields defined

### Instructions

1. **Create Meta class**
   - Add inner Meta class at end of model definition
   - Before any model methods

2. **Define verbose names**
   - verbose_name = "Stock Movement"
   - verbose_name_plural = "Stock Movements"

3. **Set database table name**
   - db_table = "inventory_stock_movement"
   - Explicit naming for clarity

4. **Configure default ordering**
   - Order by: `-movement_date` (newest first)
   - Secondary: `-id` for consistent ordering
   - ordering = ['-movement_date', '-id']

5. **Define composite indexes**
   - Index on (product, movement_date) - product history queries
   - Index on (from_warehouse, movement_date) - warehouse reports
   - Index on (to_warehouse, movement_date) - receiving reports
   - Index on (movement_type, movement_date) - type-based reports
   - Index on (reference_type, reference_id) - reference lookups

6. **Add get_latest_by configuration**
   - Set get_latest_by = 'movement_date'
   - Enables Product.stock_movements.latest() queries

7. **Define custom permissions** (optional)
   - can_reverse_movement - Reverse/cancel movements
   - can_approve_adjustment - Approve large adjustments
   - Add to permissions tuple in Meta

### Meta Configuration Overview

| Setting | Value | Purpose |
|---------|-------|---------|
| verbose_name | "Stock Movement" | Display name singular |
| verbose_name_plural | "Stock Movements" | Display name plural |
| db_table | "inventory_stock_movement" | Explicit table name |
| ordering | ['-movement_date', '-id'] | Newest first |
| get_latest_by | 'movement_date' | Latest query support |

### Index Strategy

| Index | Fields | Purpose |
|-------|--------|---------|
| Product History | (product, movement_date) | Get movements for product |
| Warehouse Outgoing | (from_warehouse, movement_date) | Warehouse shipment reports |
| Warehouse Incoming | (to_warehouse, movement_date) | Warehouse receipt reports |
| Movement Type | (movement_type, movement_date) | Type-specific analysis |
| Reference Lookup | (reference_type, reference_id) | Find movements by reference |

### Expected Meta Class
```python
# Add to StockMovement model:
# 
# class Meta:
#     verbose_name = "Stock Movement"
#     verbose_name_plural = "Stock Movements"
#     db_table = "inventory_stock_movement"
#     ordering = ['-movement_date', '-id']
#     get_latest_by = 'movement_date'
#     
#     indexes = [
#         models.Index(fields=['product', '-movement_date']),
#         models.Index(fields=['from_warehouse', '-movement_date']),
#         models.Index(fields=['to_warehouse', '-movement_date']),
#         models.Index(fields=['movement_type', '-movement_date']),
#         models.Index(fields=['reference_type', 'reference_id']),
#     ]
#     
#     permissions = [
#         ('can_reverse_movement', 'Can reverse stock movements'),
#         ('can_approve_adjustment', 'Can approve stock adjustments'),
#     ]
```

### Verification Checklist
- [ ] Meta class added to model
- [ ] Verbose names defined
- [ ] db_table explicitly set
- [ ] Ordering configured (newest first)
- [ ] get_latest_by set for convenience
- [ ] Composite indexes defined for common queries
- [ ] Custom permissions added (optional)

---

## Task 32: Add StockMovement Manager

### Overview
Create custom model manager with query methods for filtering and retrieving movements by various criteria.

### Dependencies
- Task 31: Meta class complete

### Instructions

1. **Create StockMovementManager class**
   - Define class inheriting from models.Manager
   - Place before StockMovement model definition
   - Add comprehensive docstring

2. **Implement filter by type method**
   - Method: `by_type(movement_type)`
   - Returns queryset filtered by movement_type
   - Useful for type-specific reports

3. **Implement filter by date range**
   - Method: `by_date_range(start_date, end_date=None)`
   - Filter movements within date range
   - If end_date None, from start_date onwards
   - Use movement_date field

4. **Implement filter by product**
   - Method: `for_product(product, variant=None)`
   - Returns all movements for product
   - Optional variant filtering
   - Select related warehouse, location for efficiency

5. **Implement filter by warehouse**
   - Method: `for_warehouse(warehouse, direction='both')`
   - direction options: 'incoming', 'outgoing', 'both'
   - Filter by from_warehouse, to_warehouse, or both
   - Useful for warehouse activity reports

6. **Implement filter by reference**
   - Method: `by_reference(reference_type, reference_id)`
   - Find movements linked to specific document
   - Example: All movements for order #123

7. **Implement recent movements method**
   - Method: `recent(days=7)`
   - Returns movements from last N days
   - Uses timezone-aware date calculation

8. **Implement pending approval method** (if using approvals)
   - Method: `pending_approval()`
   - Returns adjustments needing approval
   - Filter: approved_by=NULL, movement_type=ADJUSTMENT

9. **Add select related optimization**
   - Method: `with_relations()`
   - Pre-fetch common relations
   - Reduces query count for list views

10. **Assign manager to model**
    - Add to StockMovement: `objects = StockMovementManager()`

### Manager Methods Overview

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| by_type | movement_type | QuerySet | Filter by movement type |
| by_date_range | start_date, end_date | QuerySet | Date range filtering |
| for_product | product, variant | QuerySet | Product movement history |
| for_warehouse | warehouse, direction | QuerySet | Warehouse activity |
| by_reference | reference_type, reference_id | QuerySet | Movements for document |
| recent | days | QuerySet | Recent movements |
| with_relations | - | QuerySet | Optimized with related data |

### Manager Implementation Structure
```python
# Create StockMovementManager:
# 
# class StockMovementManager(models.Manager):
#     """Custom manager for StockMovement queries."""
#     
#     def by_type(self, movement_type):
#         return self.filter(movement_type=movement_type)
#     
#     def by_date_range(self, start_date, end_date=None):
#         qs = self.filter(movement_date__gte=start_date)
#         if end_date:
#             qs = qs.filter(movement_date__lte=end_date)
#         return qs
#     
#     def for_product(self, product, variant=None):
#         qs = self.filter(product=product)
#         if variant:
#             qs = qs.filter(variant=variant)
#         return qs.select_related('from_warehouse', 'to_warehouse')
#     
#     def for_warehouse(self, warehouse, direction='both'):
#         # Implementation based on direction parameter
#     
#     def by_reference(self, reference_type, reference_id):
#         return self.filter(
#             reference_type=reference_type,
#             reference_id=reference_id
#         )
#     
#     def recent(self, days=7):
#         from django.utils import timezone
#         from datetime import timedelta
#         cutoff = timezone.now() - timedelta(days=days)
#         return self.filter(movement_date__gte=cutoff)
#     
#     def with_relations(self):
#         return self.select_related(
#             'product', 'variant',
#             'from_warehouse', 'to_warehouse',
#             'from_location', 'to_location',
#             'created_by'
#         )
```

### Usage Examples
```python
# Get all stock in movements
stock_in = StockMovement.objects.by_type(STOCK_IN)

# Get product history for last 30 days
history = StockMovement.objects.for_product(product).recent(30)

# Get warehouse incoming movements
incoming = StockMovement.objects.for_warehouse(warehouse, direction='incoming')

# Get movements for an order
order_movements = StockMovement.objects.by_reference('ORDER', order_id)
```

### Verification Checklist
- [ ] StockMovementManager class created
- [ ] by_type method implemented
- [ ] by_date_range method implemented
- [ ] for_product method with variant support
- [ ] for_warehouse with direction parameter
- [ ] by_reference method implemented
- [ ] recent method with configurable days
- [ ] with_relations optimization method
- [ ] Manager assigned to model.objects

---

## Task 33: Create Movement Validation

### Overview
Implement comprehensive validation logic to ensure data integrity and prevent invalid stock movements.

### Dependencies
- Tasks 21-30: All model fields exist

### Instructions

1. **Override clean method**
   - Add clean() method to StockMovement model
   - Call super().clean() first
   - Perform all validation checks

2. **Validate quantity is positive**
   - Check: `self.quantity > 0`
   - Raise ValidationError if not positive
   - Message: "Quantity must be greater than zero"

3. **Validate warehouse requirements by type**
   - STOCK_IN: from_warehouse=NULL, to_warehouse=NOT NULL
   - STOCK_OUT: from_warehouse=NOT NULL, to_warehouse=NULL
   - TRANSFER: both warehouses required, must be different
   - Create validation function for each type

4. **Validate location belongs to warehouse**
   - If from_location: must belong to from_warehouse
   - If to_location: must belong to to_warehouse
   - Check: `location.warehouse == warehouse`

5. **Validate reason matches movement type**
   - Define VALID_REASON_COMBINATIONS dictionary
   - Check reason in allowed list for movement_type
   - Raise ValidationError for invalid combination

6. **Validate reference consistency** (optional)
   - If reference_type provided, reference_id should be provided
   - If reference_id provided, reference_type should be provided
   - Both or neither

7. **Validate cost is non-negative**
   - If cost_per_unit provided: must be >= 0
   - Negative cost indicates error

8. **Create validation error messages**
   - Use clear, actionable error messages
   - Specify field in ValidationError dict
   - Example: `{'quantity': 'Quantity must be positive'}`

### Validation Rules Summary

| Rule | Condition | Error Message |
|------|-----------|---------------|
| Positive Quantity | quantity > 0 | "Quantity must be greater than zero" |
| STOCK_IN Warehouses | from=NULL, to=NOT NULL | "STOCK_IN requires destination warehouse only" |
| STOCK_OUT Warehouses | from=NOT NULL, to=NULL | "STOCK_OUT requires source warehouse only" |
| TRANSFER Warehouses | both required, different | "TRANSFER requires different source and destination" |
| Location Match | location.warehouse == movement.warehouse | "Location must belong to specified warehouse" |
| Reason Match | reason valid for type | "Invalid reason for this movement type" |
| Non-negative Cost | cost >= 0 if provided | "Cost cannot be negative" |

### Warehouse Validation Logic
```python
# In clean() method:
# 
# def _validate_warehouses(self):
#     """Validate warehouse requirements per movement type."""
#     if self.movement_type == STOCK_IN:
#         if self.from_warehouse is not None:
#             raise ValidationError({
#                 'from_warehouse': 'STOCK_IN should not have source warehouse'
#             })
#         if self.to_warehouse is None:
#             raise ValidationError({
#                 'to_warehouse': 'STOCK_IN requires destination warehouse'
#             })
#     
#     elif self.movement_type == STOCK_OUT:
#         if self.from_warehouse is None:
#             raise ValidationError({
#                 'from_warehouse': 'STOCK_OUT requires source warehouse'
#             })
#         if self.to_warehouse is not None:
#             raise ValidationError({
#                 'to_warehouse': 'STOCK_OUT should not have destination warehouse'
#             })
#     
#     elif self.movement_type == TRANSFER:
#         if not self.from_warehouse or not self.to_warehouse:
#             raise ValidationError(
#                 'TRANSFER requires both source and destination warehouses'
#             )
#         if self.from_warehouse == self.to_warehouse:
#             raise ValidationError(
#                 'Cannot transfer to same warehouse'
#             )
```

### Reason Validation
```python
# VALID_REASON_COMBINATIONS dictionary:
# VALID_REASON_COMBINATIONS = {
#     STOCK_IN: [PURCHASE, RETURN_FROM_CUSTOMER, FOUND, CORRECTION],
#     STOCK_OUT: [SALE, RETURN_TO_SUPPLIER, DAMAGE, THEFT, EXPIRED, WRITE_OFF],
#     TRANSFER: [TRANSFER_OUT],
#     ADJUSTMENT: [DAMAGE, THEFT, EXPIRED, FOUND, CORRECTION, WRITE_OFF],
#     RESERVED: [ORDER_PLACED],
#     RELEASED: [ORDER_CANCELLED, ORDER_TIMEOUT, MANUAL_RELEASE],
# }
```

### Complete Clean Method Structure
```python
# def clean(self):
#     """Validate stock movement data."""
#     super().clean()
#     
#     # Validate quantity
#     if self.quantity <= 0:
#         raise ValidationError({'quantity': 'Quantity must be greater than zero'})
#     
#     # Validate warehouses
#     self._validate_warehouses()
#     
#     # Validate locations
#     self._validate_locations()
#     
#     # Validate reason
#     self._validate_reason()
#     
#     # Validate cost
#     if self.cost_per_unit is not None and self.cost_per_unit < 0:
#         raise ValidationError({'cost_per_unit': 'Cost cannot be negative'})
```

### Verification Checklist
- [ ] clean() method implemented
- [ ] Quantity validation (> 0)
- [ ] Warehouse validation by movement type
- [ ] Location-warehouse relationship validation
- [ ] Reason-type combination validation
- [ ] Cost non-negative validation
- [ ] Clear, actionable error messages
- [ ] Validation methods organized (separate functions)

---

## Task 34: Add Movement Reversal Support

### Overview
Implement functionality to reverse/cancel stock movements, creating compensating entries for error corrections.

### Dependencies
- Tasks 21-33: Complete StockMovement model with validation

### Instructions

1. **Add reversal tracking fields**
   - Add is_reversed BooleanField (default=False)
   - Add reversed_by FK to User (NULL, optional)
   - Add reversed_at DateTimeField (NULL, optional)
   - Add reversal_reason TextField (NULL, optional)
   - Add reversed_movement FK to self (NULL, for linking)

2. **Add original_movement field**
   - FK to self (NULL, optional)
   - If populated, this movement reverses original_movement
   - on_delete=SET_NULL (preserve if original deleted)
   - related_name='reversal_movements'

3. **Create reverse method**
   - Method: `reverse(self, user, reason)`
   - Creates compensating movement
   - Marks original as reversed
   - Returns new reversal movement

4. **Implement reversal logic**
   - Swap from_warehouse and to_warehouse
   - Swap from_location and to_location
   - Keep same quantity (direction reversed by warehouse swap)
   - Keep same product, variant
   - Set movement_type appropriately (STOCK_IN ↔ STOCK_OUT, TRANSFER unchanged)
   - Set reference to original movement

5. **Validate reversal eligibility**
   - Check: movement not already reversed
   - Check: sufficient time hasn't passed (optional time limit)
   - Check: user has permission to reverse
   - Check: movement type allows reversal (some may not)

6. **Update original movement on reversal**
   - Set is_reversed=True
   - Set reversed_by, reversed_at, reversal_reason
   - Set reversed_movement link

7. **Document reversal scenarios**
   - Add comments explaining when to reverse:
     - Data entry errors
     - Incorrect warehouse
     - Wrong product/quantity
     - Cancelled transactions
   - Note: Reversals create audit trail (don't delete)

8. **Add reversal validation** (in clean)
   - If original_movement set: validate consistency
   - Reversal should be opposite of original
   - Prevent reversing a reversal

### Reversal Fields Configuration
```python
# Add to StockMovement model:
# 
# is_reversed = models.BooleanField(
#     default=False,
#     help_text="Whether this movement has been reversed"
# )
# 
# reversed_by = models.ForeignKey(
#     settings.AUTH_USER_MODEL,
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name='stock_movements_reversed',
#     help_text="User who reversed this movement"
# )
# 
# reversed_at = models.DateTimeField(
#     null=True,
#     blank=True,
#     help_text="When this movement was reversed"
# )
# 
# reversal_reason = models.TextField(
#     null=True,
#     blank=True,
#     help_text="Reason for reversing this movement"
# )
# 
# original_movement = models.ForeignKey(
#     'self',
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name='reversal_movements',
#     help_text="Original movement being reversed (if this is a reversal)"
# )
```

### Reverse Method Implementation
```python
# def reverse(self, user, reason):
#     """
#     Create a compensating movement to reverse this one.
#     
#     Args:
#         user: User performing the reversal
#         reason: Explanation for reversal
#     
#     Returns:
#         New StockMovement instance (the reversal)
#     """
#     if self.is_reversed:
#         raise ValueError("Movement has already been reversed")
#     
#     # Create reversal movement
#     reversal_type = self._get_reversal_type()
#     reversal = StockMovement.objects.create(
#         product=self.product,
#         variant=self.variant,
#         movement_type=reversal_type,
#         quantity=self.quantity,
#         from_warehouse=self.to_warehouse,  # Swapped
#         to_warehouse=self.from_warehouse,  # Swapped
#         from_location=self.to_location,    # Swapped
#         to_location=self.from_location,    # Swapped
#         reason=CORRECTION,
#         notes=f"Reversal of movement #{self.id}: {reason}",
#         original_movement=self,
#         created_by=user,
#         cost_per_unit=self.cost_per_unit,
#     )
#     
#     # Mark this movement as reversed
#     self.is_reversed = True
#     self.reversed_by = user
#     self.reversed_at = timezone.now()
#     self.reversal_reason = reason
#     self.save()
#     
#     return reversal
# 
# def _get_reversal_type(self):
#     """Determine movement type for reversal."""
#     reversal_map = {
#         STOCK_IN: STOCK_OUT,
#         STOCK_OUT: STOCK_IN,
#         TRANSFER: TRANSFER,
#         ADJUSTMENT: ADJUSTMENT,
#     }
#     return reversal_map.get(self.movement_type, ADJUSTMENT)
```

### Reversal Scenarios

| Original Type | Reversal Type | Effect |
|---------------|---------------|--------|
| STOCK_IN | STOCK_OUT | Remove stock that was added |
| STOCK_OUT | STOCK_IN | Return stock that was removed |
| TRANSFER | TRANSFER | Transfer back to original warehouse |
| ADJUSTMENT | ADJUSTMENT | Counter-adjustment |

### Reversal Process Flow
```
1. User identifies incorrect movement
2. Call movement.reverse(user, reason)
3. Validation checks (not already reversed, permissions)
4. Create compensating movement with swapped warehouses
5. Mark original as reversed
6. Save both movements
7. Stock levels updated automatically by service/signals
```

### Verification Checklist
- [ ] Reversal tracking fields added (is_reversed, etc.)
- [ ] original_movement FK to self added
- [ ] reverse() method implemented
- [ ] Warehouse/location swap logic correct
- [ ] Reversal type determination logic
- [ ] Validation prevents double reversal
- [ ] Original movement marked on reversal
- [ ] Reversal creates proper audit trail
- [ ] Comments document reversal scenarios

---

## Task 35: Create Movement Summary Methods

### Overview
Add utility methods to calculate movement summaries and statistics, useful for reports and dashboards.

### Dependencies
- Task 32: Manager with query methods exists

### Instructions

1. **Add summary method to manager**
   - Method: `summary_by_product(product, variant=None, start_date=None, end_date=None)`
   - Returns dictionary with movement statistics
   - Include: total in, total out, net change

2. **Calculate total quantity by type**
   - Sum quantity for each movement type
   - Separate: stock_in_total, stock_out_total, transfer_in, transfer_out
   - Return as dictionary

3. **Add warehouse summary method**
   - Method: `summary_by_warehouse(warehouse, start_date=None, end_date=None)`
   - Calculate: incoming, outgoing, net change
   - Group by movement type

4. **Create cost summary method**
   - Method: `cost_summary(filters...)`
   - Sum total_cost (quantity * cost_per_unit)
   - Group by movement type or date range
   - Useful for COGS and valuation

5. **Add daily movement aggregation**
   - Method: `daily_summary(start_date, end_date)`
   - Group movements by date
   - Calculate daily in/out quantities
   - Return list of daily summaries

6. **Create activity report method**
   - Method: `user_activity(user, start_date, end_date)`
   - Summarize movements by user
   - Count movements, total quantity handled
   - Useful for productivity tracking

7. **Add reference summary**
   - Method: `summary_by_reference(reference_type, reference_id)`
   - Get all movements for a document
   - Calculate totals and list details
   - Example: Total quantity shipped for an order

### Summary Methods Overview

| Method | Purpose | Returns |
|--------|---------|---------|
| summary_by_product | Product movement stats | Dict with in/out/net |
| summary_by_warehouse | Warehouse activity | Dict with incoming/outgoing |
| cost_summary | Cost aggregation | Dict with cost totals |
| daily_summary | Daily movement trends | List of daily dicts |
| user_activity | User productivity | Dict with user stats |
| summary_by_reference | Document movements | Dict with reference totals |

### Summary Method Implementations
```python
# Add to StockMovementManager:
# 
# def summary_by_product(self, product, variant=None, start_date=None, end_date=None):
#     """Get movement summary for a product."""
#     qs = self.for_product(product, variant)
#     if start_date:
#         qs = qs.filter(movement_date__gte=start_date)
#     if end_date:
#         qs = qs.filter(movement_date__lte=end_date)
#     
#     stock_in = qs.filter(movement_type=STOCK_IN).aggregate(
#         total=Sum('quantity')
#     )['total'] or 0
#     
#     stock_out = qs.filter(movement_type=STOCK_OUT).aggregate(
#         total=Sum('quantity')
#     )['total'] or 0
#     
#     return {
#         'stock_in': stock_in,
#         'stock_out': stock_out,
#         'net_change': stock_in - stock_out,
#         'movement_count': qs.count(),
#     }
# 
# def summary_by_warehouse(self, warehouse, start_date=None, end_date=None):
#     """Get movement summary for a warehouse."""
#     # Similar implementation for warehouse
# 
# def cost_summary(self, movement_type=None, start_date=None, end_date=None):
#     """Calculate total cost of movements."""
#     qs = self.all()
#     if movement_type:
#         qs = qs.filter(movement_type=movement_type)
#     if start_date:
#         qs = qs.filter(movement_date__gte=start_date)
#     if end_date:
#         qs = qs.filter(movement_date__lte=end_date)
#     
#     return qs.aggregate(
#         total_cost=Sum(F('quantity') * F('cost_per_unit'))
#     )
```

### Usage Examples
```python
# Product movement summary
summary = StockMovement.objects.summary_by_product(
    product, 
    start_date=month_start,
    end_date=month_end
)
# Returns: {'stock_in': 150, 'stock_out': 100, 'net_change': 50}

# Warehouse activity
activity = StockMovement.objects.summary_by_warehouse(warehouse)
# Returns: {'incoming': 500, 'outgoing': 400, 'net': 100}

# Cost of goods sold (month)
cogs = StockMovement.objects.cost_summary(
    movement_type=STOCK_OUT,
    start_date=month_start,
    end_date=month_end
)
```

### Verification Checklist
- [ ] summary_by_product method implemented
- [ ] summary_by_warehouse method implemented
- [ ] cost_summary method implemented
- [ ] daily_summary method implemented (optional)
- [ ] user_activity method implemented (optional)
- [ ] summary_by_reference method implemented
- [ ] All methods use efficient aggregation
- [ ] Methods handle None/empty results gracefully

---

## Task 36: Create StockMovement Admin

### Overview
Configure Django admin interface for viewing and managing stock movements with appropriate filters, search, and read-only restrictions.

### Dependencies
- Tasks 21-35: Complete StockMovement model

### Instructions

1. **Create admin class**
   - Define StockMovementAdmin(admin.ModelAdmin)
   - Register with @admin.register(StockMovement)

2. **Configure list display**
   - movement_date
   - movement_type
   - product (with link)
   - variant
   - quantity
   - from_warehouse
   - to_warehouse
   - reason
   - created_by
   - reference_number
   - is_reversed (with icon/color)

3. **Add list filters**
   - movement_type
   - reason
   - from_warehouse
   - to_warehouse
   - is_reversed
   - movement_date (date hierarchy)

4. **Configure search fields**
   - product__name
   - product__sku
   - reference_number
   - notes

5. **Set readonly fields**
   - Most fields should be read-only after creation
   - Movements are audit trail, minimize editing
   - Allow editing: notes (for clarification)
   - All others readonly

6. **Add fieldsets**
   - Movement Details
   - Product Information
   - Source (from warehouse/location)
   - Destination (to warehouse/location)
   - Reference Information
   - Additional Information (notes, cost)
   - Audit Trail (created_by, timestamps)
   - Reversal Information (if reversed)

7. **Customize is_reversed display**
   - Method: `get_is_reversed_display(obj)`
   - Show colored indicator
   - Red/strikethrough if reversed

8. **Add custom admin actions**
   - Action: Export to CSV
   - No delete action (preserve audit trail)
   - No bulk edit (dangerous for audit)

9. **Override permissions**
   - Override has_add_permission (restrict manual creation)
   - Override has_delete_permission (return False)
   - Override has_change_permission (very restricted)
   - Movements created via API/services, not admin

10. **Add inline for related movements** (optional)
    - Show reversal movements as inline
    - Read-only display

### Admin Configuration
```python
# admin.py:
# 
# @admin.register(StockMovement)
# class StockMovementAdmin(admin.ModelAdmin):
#     list_display = [
#         'movement_date', 'movement_type', 'product_link',
#         'quantity', 'from_warehouse', 'to_warehouse',
#         'reason', 'reference_number', 'reversed_status',
#         'created_by'
#     ]
#     
#     list_filter = [
#         'movement_type', 'reason', 'is_reversed',
#         'from_warehouse', 'to_warehouse',
#         ('movement_date', admin.DateFieldListFilter),
#     ]
#     
#     search_fields = [
#         'product__name', 'product__sku',
#         'reference_number', 'notes'
#     ]
#     
#     readonly_fields = [
#         'product', 'variant', 'movement_type', 'quantity',
#         'from_warehouse', 'to_warehouse',
#         'from_location', 'to_location',
#         'reason', 'movement_date',
#         'reference_type', 'reference_id', 'reference_number',
#         'cost_per_unit', 'created_by',
#         'is_reversed', 'reversed_by', 'reversed_at'
#     ]
#     
#     fieldsets = [
#         ('Movement Details', {
#             'fields': ['movement_type', 'reason', 'quantity', 'movement_date']
#         }),
#         ('Product Information', {
#             'fields': ['product', 'variant']
#         }),
#         ('Source', {
#             'fields': ['from_warehouse', 'from_location']
#         }),
#         ('Destination', {
#             'fields': ['to_warehouse', 'to_location']
#         }),
#         ('Reference', {
#             'fields': ['reference_type', 'reference_id', 'reference_number'],
#             'classes': ['collapse']
#         }),
#         ('Additional Information', {
#             'fields': ['notes', 'cost_per_unit']
#         }),
#         ('Audit Trail', {
#             'fields': ['created_by'],
#             'classes': ['collapse']
#         }),
#         ('Reversal Information', {
#             'fields': ['is_reversed', 'reversed_by', 'reversed_at', 'reversal_reason'],
#             'classes': ['collapse']
#         }),
#     ]
#     
#     def has_add_permission(self, request):
#         # Restrict manual creation
#         return False
#     
#     def has_delete_permission(self, request, obj=None):
#         # Preserve audit trail
#         return False
#     
#     def has_change_permission(self, request, obj=None):
#         # Very restricted editing
#         return request.user.is_superuser
#     
#     def product_link(self, obj):
#         # Link to product admin
#         # Implementation
#     product_link.short_description = 'Product'
#     
#     def reversed_status(self, obj):
#         if obj.is_reversed:
#             return format_html('<span style="color:red;">REVERSED</span>')
#         return 'Active'
#     reversed_status.short_description = 'Status'
```

### Verification Checklist
- [ ] StockMovementAdmin class created and registered
- [ ] list_display with key fields
- [ ] list_filter for common criteria
- [ ] search_fields for finding movements
- [ ] Most fields set as readonly
- [ ] fieldsets organized logically
- [ ] Custom display methods (reversed status)
- [ ] Permissions restricted (no add/delete)
- [ ] Admin emphasizes read-only audit trail nature

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Create StockMovement Meta class | Indexes, ordering, permissions |
| 32 | Add StockMovement manager | Query methods for filtering |
| 33 | Create movement validation | Comprehensive data validation |
| 34 | Add movement reversal support | Error correction functionality |
| 35 | Create movement summary methods | Reporting and analytics |
| 36 | Create StockMovement admin | Admin interface configuration |

### Group B Complete - StockMovement Model

**Complete Features:**
- ✓ Movement type and reason constants
- ✓ Product, variant, warehouse, location relationships
- ✓ Reference fields for document linking
- ✓ Cost tracking for valuation
- ✓ User audit trail
- ✓ Comprehensive validation
- ✓ Movement reversal support
- ✓ Custom manager with query methods
- ✓ Summary and reporting methods
- ✓ Admin interface (read-only focus)

**Files Created:**
```
apps/inventory/stock/
├── constants.py          # Movement types and reasons (updated)
├── models/
│   ├── stock_level.py   # From Group A
│   └── stock_movement.py # Group B - Complete
└── admin.py             # Both models registered
```

### Next Steps
Group B (Stock Movement Tracking) is now complete. Proceed to:
- **[../Group-C_Stock-Operations-Services/](../Group-C_Stock-Operations-Services/)** - Implement business logic services for stock operations

---

## Notes for AI Agents

1. **Audit Trail:** StockMovement is append-only; use reversals instead of deletions
2. **Validation Layers:** Clean() for model validation, service layer for business rules
3. **Indexing:** Index all commonly queried fields (product, warehouse, date)
4. **Manager Methods:** Provide convenient queries for common patterns
5. **Reversal Pattern:** Create compensating entries, don't delete movements
6. **Admin Restrictions:** Read-only admin preserves audit integrity
7. **Next Group:** Group C will create services using these models
8. **Performance:** Use select_related and prefetch_related for related objects
