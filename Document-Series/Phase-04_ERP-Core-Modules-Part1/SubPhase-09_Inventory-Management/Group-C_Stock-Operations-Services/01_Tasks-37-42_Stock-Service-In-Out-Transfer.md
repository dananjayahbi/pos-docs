# Tasks 37-42: Stock Service & Core Operations

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** C - Stock Operations Services  
> **Document:** 01 of 04  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-48_Transit-Reserve-Release-Adjustment.md](02_Tasks-43-48_Transit-Reserve-Release-Adjustment.md)

---

## Document Overview

This document establishes the foundational service layer for stock operations, implementing core business logic for receiving, shipping, and transferring inventory with proper validation and transaction handling.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 37 | Create StockService base class | Medium |
| 38 | Implement stock_in operation | Medium |
| 39 | Implement stock_out operation | Medium |
| 40 | Validate stock availability | Medium |
| 41 | Implement stock_transfer operation | High |
| 42 | Create transfer validation | Medium |

---

## Task 37: Create StockService Base Class

### Overview
Create an abstract base service class that provides common functionality for all stock operations, including transaction management, logging, and error handling.

### Dependencies
- Groups A & B: StockLevel and StockMovement models complete
- SubPhase-03: Understanding of Django transaction handling

### Instructions

1. **Create services directory**
   - Create `services/` directory in `apps/inventory/stock/`
   - Create `__init__.py` in services directory
   - Add module-level docstring

2. **Create stock_service.py file**
   - Create file in services directory
   - Add comprehensive file-level docstring
   - Explain service layer purpose and patterns

3. **Define StockService base class**
   - Create abstract base class (not instantiated directly)
   - Import required models and utilities
   - Add class-level docstring

4. **Add initialization method**
   - Accept optional user parameter (for audit trail)
   - Accept optional notes parameter
   - Store as instance attributes
   - User can be None for system operations

5. **Create transaction wrapper method**
   - Method: `_execute_in_transaction(func, *args, **kwargs)`
   - Use `transaction.atomic()`
   - Wrap operations to ensure atomicity
   - Rollback on any exception

6. **Create stock level retrieval method**
   - Method: `_get_stock_level(product, variant, warehouse, location=None)`
   - Use `select_for_update()` to lock row
   - Prevents concurrent modification issues
   - Create if doesn't exist (with defaults)
   - Return locked StockLevel instance

7. **Create movement creation method**
   - Method: `_create_movement(movement_type, product, variant, warehouse_from, warehouse_to, quantity, reason, **kwargs)`
   - Create StockMovement record
   - Include all relevant information
   - Set created_by from instance user
   - Return created movement

8. **Add validation helper methods**
   - Method: `_validate_quantity(quantity)` - ensure positive
   - Method: `_validate_product(product, variant)` - ensure valid combination
   - Method: `_validate_warehouse(warehouse)` - ensure exists and active
   - Raise descriptive exceptions on validation failure

9. **Create logging helper**
   - Method: `_log_operation(operation_type, details)`
   - Log all operations for troubleshooting
   - Include timestamp, user, operation details
   - Use Python logging module

10. **Add error handling pattern**
    - Define custom exceptions: `StockOperationError`, `InsufficientStockError`
    - Wrap database errors with meaningful messages
    - Include contextual information in exceptions

### Service Class Structure

```
StockService (Base Class)
├── __init__(user, notes)
├── Transaction Management
│   └── _execute_in_transaction()
├── Data Access
│   ├── _get_stock_level()
│   └── _create_movement()
├── Validation
│   ├── _validate_quantity()
│   ├── _validate_product()
│   └── _validate_warehouse()
├── Utilities
│   ├── _log_operation()
│   └── Error handling
└── Abstract Methods (implemented in subclasses)
    ├── stock_in()
    ├── stock_out()
    └── transfer()
```

### Transaction Pattern

**Atomic Operations:**
- All database modifications in single transaction
- Use `select_for_update()` to prevent race conditions
- Rollback on any error
- Commit only if all operations succeed

**Locking Strategy:**
```
1. Begin transaction
2. Lock StockLevel row with select_for_update()
3. Validate operation
4. Update StockLevel
5. Create StockMovement
6. Commit transaction
```

### Custom Exceptions

| Exception | When Raised | Example |
|-----------|-------------|---------|
| StockOperationError | General operation failure | "Failed to process stock operation" |
| InsufficientStockError | Not enough stock | "Insufficient stock: need 10, have 5" |
| InvalidProductError | Product/variant mismatch | "Variant does not belong to product" |
| InactiveWarehouseError | Warehouse not active | "Cannot operate on inactive warehouse" |

### Expected File Structure
```python
# services/stock_service.py structure:
# 
# Imports (models, transaction, logging, exceptions)
# 
# Custom Exceptions
# - StockOperationError
# - InsufficientStockError
# - InvalidProductError
# 
# class StockService:
#     """Base service for stock operations."""
#     
#     def __init__(self, user=None, notes=None):
#         # Initialization
#     
#     def _execute_in_transaction(self, func, *args, **kwargs):
#         # Transaction wrapper
#     
#     def _get_stock_level(self, product, variant, warehouse, location=None):
#         # Get and lock stock level
#     
#     def _create_movement(self, ...):
#         # Create movement record
#     
#     def _validate_quantity(self, quantity):
#         # Validation methods
#     
#     def _log_operation(self, operation_type, details):
#         # Logging
```

### Verification Checklist
- [ ] services/ directory created
- [ ] stock_service.py file created
- [ ] StockService base class defined
- [ ] __init__ method accepts user and notes
- [ ] _execute_in_transaction wrapper implemented
- [ ] _get_stock_level uses select_for_update()
- [ ] _create_movement handles all fields
- [ ] Validation helper methods implemented
- [ ] Logging helper implemented
- [ ] Custom exceptions defined
- [ ] Comprehensive docstrings provided

---

## Task 38: Implement Stock In Operation

### Overview
Implement the stock_in operation to receive goods into a warehouse, creating movement records and updating stock levels.

### Dependencies
- Task 37: StockService base class exists

### Instructions

1. **Add stock_in method to StockService**
   - Public method: `stock_in(product, quantity, warehouse, **kwargs)`
   - Optional kwargs: variant, location, cost_per_unit, reason, reference_type, reference_id
   - Returns: OperationResult (see Task 52)

2. **Validate input parameters**
   - Call validation helpers for product, quantity, warehouse
   - Ensure warehouse is destination (not source)
   - Validate cost_per_unit if provided (must be positive)
   - Set default reason to PURCHASE if not provided

3. **Execute within transaction**
   - Wrap entire operation in _execute_in_transaction
   - Ensures atomicity of all changes

4. **Get or create stock level**
   - Call _get_stock_level with lock
   - If new record, set initial values
   - For existing record, will update quantities

5. **Update stock level quantity**
   - Increment quantity field by operation quantity
   - If cost provided, call update_average_cost method
   - Calculate new weighted average cost
   - Save stock level with updated values

6. **Create stock movement record**
   - Call _create_movement with STOCK_IN type
   - Set to_warehouse (destination)
   - Set from_warehouse to None
   - Include cost_per_unit if provided
   - Set reason and reference information

7. **Handle incoming quantity adjustment**
   - If reference_type is PURCHASE_ORDER
   - Decrement incoming_quantity field
   - This reflects that expected stock has arrived

8. **Log operation**
   - Log successful stock in operation
   - Include product, quantity, warehouse details

9. **Return result**
   - Return success result with movement ID
   - Include updated stock level information
   - On error, return failure result with error details

### Stock In Operation Flow

```
Input: product, quantity, warehouse, cost
    ↓
Validate inputs
    ↓
Begin transaction & lock stock level
    ↓
Update stock level quantity
    ↓
Update weighted average cost (if cost provided)
    ↓
Decrement incoming_quantity (if from PO)
    ↓
Create STOCK_IN movement
    ↓
Save all changes
    ↓
Commit transaction
    ↓
Return success result
```

### Stock In Use Cases

| Scenario | Reason | Cost Handling |
|----------|--------|---------------|
| Purchase receipt | PURCHASE | Update weighted average |
| Customer return | RETURN_FROM_CUSTOMER | Use current cost or provided cost |
| Found during count | FOUND | Use current cost or zero |
| Manual correction | CORRECTION | Optional cost update |

### Weighted Average Cost Update

When cost is provided:
```
new_avg_cost = (current_qty * current_cost + new_qty * new_cost) / (current_qty + new_qty)

Example:
Current: 100 units @ ₨10 = ₨1,000
Receive: 50 units @ ₨12 = ₨600
New average: ₨1,600 / 150 = ₨10.67 per unit
```

### Expected Method Structure
```python
# Add to StockService:
# 
# def stock_in(self, product, quantity, warehouse, variant=None, location=None, 
#              cost_per_unit=None, reason=PURCHASE, reference_type=None, 
#              reference_id=None, notes=None):
#     """
#     Receive stock into warehouse.
#     
#     Args:
#         product: Product instance
#         quantity: Decimal quantity to receive
#         warehouse: Destination warehouse
#         variant: Optional product variant
#         location: Optional warehouse location
#         cost_per_unit: Optional cost for weighted average
#         reason: Movement reason (default: PURCHASE)
#         reference_type: Source document type
#         reference_id: Source document ID
#         notes: Additional notes
#     
#     Returns:
#         OperationResult with success/failure and details
#     """
#     # Validate inputs
#     # Execute in transaction
#     # Get/create stock level with lock
#     # Update quantity and cost
#     # Create movement
#     # Return result
```

### Verification Checklist
- [ ] stock_in method added to StockService
- [ ] Input validation performed
- [ ] Operation wrapped in transaction
- [ ] Stock level locked with select_for_update()
- [ ] Quantity incremented correctly
- [ ] Cost update handled (weighted average)
- [ ] Incoming_quantity decremented if from PO
- [ ] STOCK_IN movement created
- [ ] Operation logged
- [ ] OperationResult returned

---

## Task 39: Implement Stock Out Operation

### Overview
Implement the stock_out operation to remove goods from warehouse, with availability checking to prevent overselling.

### Dependencies
- Task 37: StockService base class exists
- Task 38: Understanding of operation pattern

### Instructions

1. **Add stock_out method to StockService**
   - Public method: `stock_out(product, quantity, warehouse, **kwargs)`
   - Similar signature to stock_in
   - Optional kwargs: variant, location, reason, reference_type, reference_id
   - Returns: OperationResult

2. **Validate input parameters**
   - Validate product, quantity, warehouse
   - Ensure warehouse is source (not destination)
   - Set default reason to SALE if not provided

3. **Check stock availability**
   - Call availability validation (Task 40)
   - Ensure available_quantity >= requested quantity
   - Raise InsufficientStockError if not enough
   - Consider reserved quantities in check

4. **Execute within transaction**
   - Wrap in _execute_in_transaction
   - Lock stock level row

5. **Update stock level quantity**
   - Decrement quantity field by operation quantity
   - Do NOT update cost (cost remains same)
   - Validate quantity doesn't go negative

6. **Create stock movement record**
   - Call _create_movement with STOCK_OUT type
   - Set from_warehouse (source)
   - Set to_warehouse to None
   - Include current cost_per_unit from stock level
   - Set reason and reference information

7. **Record cost for COGS**
   - Capture cost_per_unit from stock level
   - Record in movement for Cost of Goods Sold calculation
   - This is historical cost at time of sale

8. **Log operation**
   - Log successful stock out
   - Include availability check results

9. **Return result**
   - Return success with movement ID
   - Include remaining stock information
   - On error, return failure with details

### Stock Out Operation Flow

```
Input: product, quantity, warehouse
    ↓
Validate inputs
    ↓
Check stock availability
    ↓
Begin transaction & lock stock level
    ↓
Verify still available (double-check after lock)
    ↓
Decrement stock level quantity
    ↓
Capture cost for COGS
    ↓
Create STOCK_OUT movement
    ↓
Save all changes
    ↓
Commit transaction
    ↓
Return success result
```

### Stock Out Use Cases

| Scenario | Reason | Notes |
|----------|--------|-------|
| Order fulfillment | SALE | Most common, check available qty |
| Return to supplier | RETURN_TO_SUPPLIER | RMA process |
| Damage write-off | DAMAGE | Reduce stock for damaged goods |
| Theft/loss | THEFT | Document loss |
| Expiry | EXPIRED | Remove expired products |
| General write-off | WRITE_OFF | Other removals |

### Availability Check Logic
```
available_quantity = quantity - reserved_quantity

Operation allowed if:
available_quantity >= requested_quantity

For order fulfillment:
If stock is reserved for the order, use commit_reserved instead
```

### Expected Method Structure
```python
# Add to StockService:
# 
# def stock_out(self, product, quantity, warehouse, variant=None, location=None,
#               reason=SALE, reference_type=None, reference_id=None, notes=None):
#     """
#     Remove stock from warehouse.
#     
#     Args:
#         product: Product instance
#         quantity: Decimal quantity to remove
#         warehouse: Source warehouse
#         variant: Optional product variant
#         location: Optional warehouse location
#         reason: Movement reason (default: SALE)
#         reference_type: Source document type
#         reference_id: Source document ID
#         notes: Additional notes
#     
#     Returns:
#         OperationResult with success/failure and details
#     
#     Raises:
#         InsufficientStockError: If not enough stock available
#     """
#     # Validate inputs
#     # Check availability
#     # Execute in transaction
#     # Get stock level with lock
#     # Double-check availability after lock
#     # Decrement quantity
#     # Capture cost from stock level
#     # Create STOCK_OUT movement
#     # Return result
```

### Verification Checklist
- [ ] stock_out method added to StockService
- [ ] Input validation performed
- [ ] Availability check before operation
- [ ] InsufficientStockError raised if not enough stock
- [ ] Operation wrapped in transaction
- [ ] Stock level locked and rechecked after lock
- [ ] Quantity decremented correctly
- [ ] Cost captured for COGS (not updated)
- [ ] STOCK_OUT movement created
- [ ] Operation logged
- [ ] OperationResult returned

---

## Task 40: Validate Stock Availability

### Overview
Create comprehensive validation logic to check if sufficient stock is available before allowing stock out operations.

### Dependencies
- Task 37: StockService base class exists

### Instructions

1. **Add check_availability method**
   - Method: `check_availability(product, quantity, warehouse, variant=None, location=None)`
   - Returns: Boolean and details dict
   - Does NOT modify database (read-only check)

2. **Get stock level without lock**
   - Query StockLevel for product/variant/warehouse/location
   - If no record exists, return False (no stock)
   - Don't lock - this is preliminary check

3. **Calculate available quantity**
   - Use available_quantity property
   - Formula: quantity - reserved_quantity
   - This is what can be sold/removed now

4. **Compare with requested quantity**
   - Check: available_quantity >= requested_quantity
   - Return True if sufficient
   - Return False if insufficient

5. **Build detailed response**
   - Return dictionary with:
     - is_available: Boolean result
     - total_quantity: Current quantity
     - reserved_quantity: Reserved amount
     - available_quantity: Available amount
     - requested_quantity: Requested amount
     - shortage: How much short (if insufficient)

6. **Add get_availability_by_warehouse method**
   - Method: `get_availability_by_warehouse(product, quantity, variant=None)`
   - Check availability across all warehouses
   - Return list of warehouses with sufficient stock
   - Useful for order fulfillment from multiple locations

7. **Create suggest_alternatives method** (optional)
   - When insufficient at requested warehouse
   - Suggest other warehouses with availability
   - Suggest partial fulfillment options
   - Calculate transfer requirements

8. **Add validation with context**
   - Method: `validate_availability_or_raise(product, quantity, warehouse, ...)`
   - Raises InsufficientStockError with details
   - Used by stock_out operation
   - Includes suggestions in error message

### Availability Check Response Format

```python
{
    'is_available': False,
    'total_quantity': Decimal('100.000'),
    'reserved_quantity': Decimal('80.000'),
    'available_quantity': Decimal('20.000'),
    'requested_quantity': Decimal('30.000'),
    'shortage': Decimal('10.000'),
    'suggestions': [
        {'warehouse': 'Store A', 'available': Decimal('15.000')},
        {'warehouse': 'Store B', 'available': Decimal('20.000')}
    ]
}
```

### Multi-Warehouse Availability
```python
# Example output from get_availability_by_warehouse:
[
    {
        'warehouse': warehouse_obj_1,
        'available': Decimal('20.000'),
        'can_fulfill': True
    },
    {
        'warehouse': warehouse_obj_2,
        'available': Decimal('50.000'),
        'can_fulfill': True
    }
]
```

### Availability Scenarios

| Total | Reserved | Available | Request | Result | Notes |
|-------|----------|-----------|---------|--------|-------|
| 100 | 0 | 100 | 50 | ✓ Available | Simple case |
| 100 | 80 | 20 | 30 | ✗ Insufficient | 10 units short |
| 100 | 100 | 0 | 10 | ✗ Insufficient | All reserved |
| 0 | 0 | 0 | 10 | ✗ Out of stock | No inventory |

### Expected Method Structures
```python
# Add to StockService:
# 
# def check_availability(self, product, quantity, warehouse, 
#                        variant=None, location=None):
#     """
#     Check if sufficient stock available.
#     
#     Args:
#         product, quantity, warehouse, variant, location
#     
#     Returns:
#         dict with is_available and detailed breakdown
#     """
#     # Get stock level (no lock)
#     # Calculate available
#     # Compare with requested
#     # Build response dict
# 
# def validate_availability_or_raise(self, product, quantity, warehouse,
#                                     variant=None, location=None):
#     """
#     Validate availability or raise exception.
#     
#     Raises:
#         InsufficientStockError: With detailed message
#     """
#     # Check availability
#     # If insufficient, raise with details
# 
# def get_availability_by_warehouse(self, product, quantity, variant=None):
#     """Get list of warehouses that can fulfill request."""
#     # Query all warehouses
#     # Filter by availability
#     # Return list with details
```

### Verification Checklist
- [ ] check_availability method implemented
- [ ] Returns Boolean and details dict
- [ ] Available quantity calculated correctly
- [ ] Comparison with requested quantity
- [ ] Detailed response includes all fields
- [ ] get_availability_by_warehouse implemented
- [ ] validate_availability_or_raise raises proper exception
- [ ] suggest_alternatives implemented (optional)
- [ ] No database locks for read-only check

---

## Task 41: Implement Stock Transfer Operation

### Overview
Implement the stock_transfer operation to move inventory between warehouses, creating paired movements for source and destination.

### Dependencies
- Tasks 37-40: Base service and core operations exist

### Instructions

1. **Add transfer method to StockService**
   - Method: `transfer(product, quantity, from_warehouse, to_warehouse, **kwargs)`
   - Optional kwargs: variant, from_location, to_location, reason, reference_type, reference_id
   - Returns: OperationResult with both movement IDs

2. **Validate input parameters**
   - Validate product, quantity, both warehouses
   - Ensure from_warehouse != to_warehouse
   - Validate locations belong to respective warehouses
   - Set default reason to TRANSFER_OUT

3. **Check availability at source**
   - Call availability validation for from_warehouse
   - Ensure sufficient stock before proceeding
   - Raise InsufficientStockError if not available

4. **Execute within transaction**
   - Critical: Both warehouses must update atomically
   - Wrap entire operation in transaction
   - Lock both stock levels (source first, then destination)
   - Prevents partial transfers on error

5. **Update source warehouse stock**
   - Get source stock level with lock
   - Decrement quantity
   - Capture cost_per_unit for destination

6. **Update destination warehouse stock**
   - Get destination stock level with lock
   - Increment quantity
   - Use same cost_per_unit from source
   - Maintains cost consistency

7. **Create transfer movements**
   - Create two TRANSFER movements:
     - Movement 1: from_warehouse to to_warehouse (represents source side)
     - Movement 2: from_warehouse to to_warehouse (represents destination side)
   - Both have same quantity and cost
   - Link via reference fields (optional)
   - Both created in same transaction

8. **Handle in-transit state** (if implemented)
   - See Task 43 for in-transit handling
   - For simple transfers, update both immediately
   - For complex transfers, may need transit state

9. **Log operation**
   - Log complete transfer operation
   - Include both warehouses and quantity

10. **Return result**
    - Return success with both movement IDs
    - Include source and destination stock levels
    - On error, rollback and return failure

### Transfer Operation Flow

```
Input: product, quantity, from_warehouse, to_warehouse
    ↓
Validate inputs (warehouses different)
    ↓
Check availability at source
    ↓
Begin transaction
    ↓
Lock source stock level
    ↓
Decrement source quantity
    ↓
Capture cost from source
    ↓
Lock destination stock level
    ↓
Increment destination quantity (with same cost)
    ↓
Create source TRANSFER movement
    ↓
Create destination TRANSFER movement
    ↓
Commit transaction
    ↓
Return success with both movement IDs
```

### Transfer Scenarios

| From Warehouse | To Warehouse | Reason | Use Case |
|----------------|--------------|--------|----------|
| Main Warehouse | Store A | TRANSFER | Store replenishment |
| Store A | Main Warehouse | TRANSFER | Return to central |
| Main WH, Bin A1 | Main WH, Bin B2 | TRANSFER | Internal reorganization |
| Store B | Store C | TRANSFER | Inter-store transfer |

### Locking Order (Important)
```
Always lock in consistent order to prevent deadlocks:
1. Source warehouse stock level first
2. Destination warehouse stock level second
3. Or use warehouse ID ordering if multiple operations
```

### Expected Method Structure
```python
# Add to StockService:
# 
# def transfer(self, product, quantity, from_warehouse, to_warehouse,
#              variant=None, from_location=None, to_location=None,
#              reason=TRANSFER_OUT, reference_type=None, reference_id=None,
#              notes=None):
#     """
#     Transfer stock between warehouses.
#     
#     Args:
#         product: Product to transfer
#         quantity: Amount to transfer
#         from_warehouse: Source warehouse
#         to_warehouse: Destination warehouse
#         variant: Optional variant
#         from_location: Source location
#         to_location: Destination location
#         reason: Transfer reason
#         reference_type: Source document type
#         reference_id: Source document ID
#         notes: Additional notes
#     
#     Returns:
#         OperationResult with both movement IDs
#     
#     Raises:
#         ValueError: If from_warehouse == to_warehouse
#         InsufficientStockError: If not enough stock at source
#     """
#     # Validate inputs
#     # Check from_warehouse != to_warehouse
#     # Check availability
#     # Begin transaction
#     # Lock and update source
#     # Lock and update destination
#     # Create both movements
#     # Commit
#     # Return result
```

### Verification Checklist
- [ ] transfer method added to StockService
- [ ] Validates warehouses are different
- [ ] Checks availability at source
- [ ] Entire operation in single transaction
- [ ] Both stock levels locked
- [ ] Source quantity decremented
- [ ] Destination quantity incremented
- [ ] Cost transferred from source to destination
- [ ] Two TRANSFER movements created
- [ ] Operation logged
- [ ] OperationResult with both movements returned
- [ ] Rollback on any error

---

## Task 42: Create Transfer Validation

### Overview
Implement comprehensive validation for transfer operations to ensure data integrity and business rule compliance.

### Dependencies
- Task 41: Transfer operation exists

### Instructions

1. **Add validate_transfer method**
   - Method: `validate_transfer(product, quantity, from_warehouse, to_warehouse, variant=None, ...)`
   - Returns: Validation result with errors list
   - Called before executing transfer

2. **Validate warehouses are different**
   - Check: from_warehouse.id != to_warehouse.id
   - Error: "Cannot transfer to same warehouse"
   - Prevent self-transfers

3. **Validate warehouses are active**
   - Check: from_warehouse.is_active and to_warehouse.is_active
   - Error: "Cannot transfer from/to inactive warehouse"
   - Prevent operations on closed warehouses

4. **Validate product is transferable**
   - Check if product allows transfers (if such flag exists)
   - Some products may be location-specific
   - Check product type or category restrictions

5. **Validate quantity against minimum transfer**
   - If business rules define minimum transfer quantity
   - Example: Minimum 10 units for bulk items
   - Error: "Transfer quantity below minimum"

6. **Validate locations belong to warehouses**
   - If from_location specified: must belong to from_warehouse
   - If to_location specified: must belong to to_warehouse
   - Error: "Location does not belong to warehouse"

7. **Check if transfer is allowed between warehouse types**
   - Example: Cannot transfer from retail to wholesale
   - Example: Temperature-controlled products need compatible warehouses
   - Business rule validation

8. **Validate cost implications**
   - Check if cost difference between warehouses is significant
   - May require approval for high-value transfers
   - Optional threshold checking

9. **Add pre-flight check method**
   - Method: `can_transfer(product, quantity, from_warehouse, to_warehouse, ...)`
   - Quick check returning Boolean
   - Used in UI to enable/disable transfer button

10. **Document validation rules**
    - Add comprehensive comments explaining each validation
    - Document business rules
    - Explain approval requirements

### Validation Rules Summary

| Rule | Check | Error Message |
|------|-------|---------------|
| Different Warehouses | from != to | "Cannot transfer to same warehouse" |
| Active Warehouses | both active | "Cannot use inactive warehouse" |
| Location Match | location.warehouse == warehouse | "Location mismatch" |
| Sufficient Stock | available >= quantity | "Insufficient stock" |
| Minimum Quantity | quantity >= minimum | "Below minimum transfer quantity" |
| Warehouse Compatibility | compatible types | "Incompatible warehouse types" |

### Transfer Authorization Levels

| Transfer Value | Approval Level | Notes |
|----------------|----------------|-------|
| < ₨10,000 | Auto-approved | Warehouse staff |
| ₨10,000 - ₨50,000 | Warehouse manager | Requires authorization |
| > ₨50,000 | Operations director | High-value transfer |

### Expected Method Structures
```python
# Add to StockService:
# 
# def validate_transfer(self, product, quantity, from_warehouse, to_warehouse,
#                       variant=None, from_location=None, to_location=None):
#     """
#     Comprehensive transfer validation.
#     
#     Args:
#         product, quantity, from/to warehouses, locations
#     
#     Returns:
#         dict with is_valid and errors list
#     """
#     errors = []
#     
#     # Validate warehouses different
#     # Validate warehouses active
#     # Validate locations match warehouses
#     # Validate availability
#     # Check business rules
#     # Check approval requirements
#     
#     return {
#         'is_valid': len(errors) == 0,
#         'errors': errors,
#         'warnings': warnings,  # Optional
#         'requires_approval': requires_approval
#     }
# 
# def can_transfer(self, product, quantity, from_warehouse, to_warehouse,
#                  variant=None):
#     """Quick transfer eligibility check."""
#     validation = self.validate_transfer(...)
#     return validation['is_valid']
```

### Validation Response Format
```python
{
    'is_valid': False,
    'errors': [
        {'field': 'from_warehouse', 'message': 'Warehouse is inactive'},
        {'field': 'quantity', 'message': 'Insufficient stock'}
    ],
    'warnings': [
        {'message': 'High-value transfer requires approval'}
    ],
    'requires_approval': True,
    'estimated_cost': Decimal('45000.00')
}
```

### Verification Checklist
- [ ] validate_transfer method implemented
- [ ] Warehouses different check
- [ ] Warehouses active check
- [ ] Location-warehouse relationship validated
- [ ] Availability checked
- [ ] Minimum quantity validated (if applicable)
- [ ] Warehouse compatibility checked
- [ ] Approval requirements determined
- [ ] can_transfer quick check method added
- [ ] Comprehensive error messages
- [ ] Validation results properly formatted

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 37 | Create StockService base class | Foundation service with transaction handling |
| 38 | Implement stock_in operation | Receiving goods functionality |
| 39 | Implement stock_out operation | Shipping goods functionality |
| 40 | Validate stock availability | Availability checking logic |
| 41 | Implement stock_transfer operation | Inter-warehouse transfers |
| 42 | Create transfer validation | Transfer rules and checks |

### StockService - Core Operations

**Base Class Features:**
- Transaction management with atomic operations
- Row locking with select_for_update()
- Movement creation helper
- Validation helpers
- Logging and error handling
- Custom exceptions

**Operations Implemented:**
- ✓ stock_in: Receive goods, update costs
- ✓ stock_out: Ship goods, check availability
- ✓ transfer: Move between warehouses
- ⏳ reserve: Allocate for orders (Task 44)
- ⏳ release: Free reservations (Task 45)
- ⏳ commit_reserved: Convert to sale (Task 46)

**Key Patterns:**
- All operations wrapped in transactions
- Stock levels locked before modification
- Movements created for audit trail
- Cost tracking maintained
- Availability validated

### Next Steps
Proceed to [02_Tasks-43-48_Transit-Reserve-Release-Adjustment.md](02_Tasks-43-48_Transit-Reserve-Release-Adjustment.md) for reserve/release operations and adjustment service.

---

## Notes for AI Agents

1. **Transaction Safety:** Always use transaction.atomic() and select_for_update()
2. **Locking Order:** Consistent locking order prevents deadlocks
3. **Cost Handling:** Update cost only on stock_in, capture on stock_out
4. **Validation:** Check availability before operations, recheck after locking
5. **Movement Records:** Every operation creates movement for audit
6. **Error Handling:** Use custom exceptions with meaningful messages
7. **Availability:** Consider reserved_quantity in availability calculations
8. **Next Document:** Reserve/release operations for order management
