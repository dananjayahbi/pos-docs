# Tasks 73-77: DRF Serializers for Inventory API

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** E - Serializers & API Views  
> **Tasks:** 73-77 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group E Overview](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group D: Stock Take & Adjustments](../Group-D_Stock-Take-Adjustments/)
- **→ Next:** [Tasks 78-81: ViewSets](02_Tasks-78-81_ViewSets.md)

---

## Task 73: Create StockLevelSerializer

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create DRF serializer for StockLevel model with product info, quantities, and status display.

### Instructions

#### 1. Create Base StockLevelSerializer
- Create `apps/inventory/stock/serializers.py`
- Define `StockLevelSerializer` inheriting from `serializers.ModelSerializer`
- Include fields: id, product, warehouse, quantity, reserved_quantity, incoming_quantity

#### 2. Add Nested Product Information
- Use nested serializer or SerializerMethodField
- Include: product_id, sku, name, unit
- Avoid deep nesting (don't include full product serializer)
- Keep response lightweight

#### 3. Add Nested Warehouse Information
- Include warehouse: id, name, code
- Use `source` to flatten: `warehouse_name = serializers.CharField(source='warehouse.name')`
- Avoid full warehouse serializer

#### 4. Add Calculated Fields
- `available_quantity` - SerializerMethodField
- Calculate: quantity - reserved_quantity
- `status` - SerializerMethodField  
- Return: IN_STOCK, LOW_STOCK, OUT_OF_STOCK based on thresholds

#### 5. Add Cost Information
- Include `average_cost_per_unit` if user has permission
- Include `total_value` (quantity × cost)
- Use SerializerMethodField to check permissions
- Return None if user doesn't have cost view permission

#### 6. Create List and Detail Variants
- `StockLevelListSerializer` - minimal fields for list view
- `StockLevelDetailSerializer` - full fields including movement history
- Use in appropriate ViewSet actions

### Validation Checklist
- [ ] All quantity fields included
- [ ] Nested product/warehouse data correct
- [ ] Available quantity calculated correctly
- [ ] Status determination accurate
- [ ] Permissions checked for sensitive data
- [ ] List and detail variants appropriate

---

## Task 74: Add Available Stock Field

**Complexity:** Low | **Time Estimate:** 15 min

### Objective
Add SerializerMethodField to calculate and display real-time available stock quantity.

### Instructions

#### 1. Add Available Quantity Field
- In StockLevelSerializer, add:
  ```python
  available_quantity = serializers.SerializerMethodField()
  ```
- Add to `fields` in Meta class

#### 2. Implement Calculation Method
- Define `get_available_quantity(self, obj)` method
- Return: `obj.quantity - obj.reserved_quantity`
- Ensure returns Decimal, not int
- Handle case where reserved > quantity (shouldn't happen, but defensive)

#### 3. Add Available Percentage
- Optional field: `available_percentage`
- Calculate: (available / quantity) × 100
- Return as percentage (0-100)
- Handle division by zero

#### 4. Add Stock Status Indicator
- Field: `stock_status`
- Return color-coded status: 
  - "available" if available > 0
  - "reserved" if available == 0 but quantity > 0
  - "out_of_stock" if quantity == 0

#### 5. Add Projected Available
- Field: `projected_available`
- Calculate: available + incoming_quantity
- Useful for planning and commitments
- Include incoming PO quantity

#### 6. Optimize Query Performance
- Ensure available_quantity calculation doesn't cause N+1 queries
- Use select_related/prefetch_related in ViewSet
- Consider annotating queryset with calculation

### Validation Checklist
- [ ] Available quantity accurate
- [ ] Handles edge cases (negative, zero)
- [ ] Status indicator reflects reality
- [ ] Projected available includes incoming
- [ ] No N+1 query issues
- [ ] Returns proper data types

---

## Task 75: Create StockMovementSerializer

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create serializer for StockMovement model with movement details and reference information.

### Instructions

#### 1. Create Base StockMovementSerializer
- Define in same serializers.py file
- Inherit from `serializers.ModelSerializer`
- Include: id, product, movement_type, quantity, created_at, created_by

#### 2. Add Product Information
- Nested fields: product_id, product_sku, product_name
- Use SerializerMethodField or source
- Keep lightweight

#### 3. Add Warehouse Information
- Include both source and destination warehouses
- Fields: from_warehouse, to_warehouse (names and IDs)
- Show null for stock in (no source) or stock out (no destination)

#### 4. Add Human-Readable Fields
- `movement_type_display` - get_FOO_display() for choice field
- `movement_reason_display` - human readable reason
- `quantity_display` - formatted with sign (+ or -)

#### 5. Add Reference Information
- Include: reference_type, reference_id
- Add `reference_url` - SerializerMethodField
- Generate URL to referenced object (order, PO, adjustment)
- Return null if no reference

#### 6. Add User Information
- Include: created_by_name, created_by_id
- Optional: approved_by for adjustments
- Show user's full name or username

### Validation Checklist
- [ ] All movement data included
- [ ] Display fields human-readable
- [ ] Warehouse fields handle nulls
- [ ] Reference information complete
- [ ] User information present
- [ ] Performance optimized

---

## Task 76: Create StockOperationSerializer

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create write serializer for stock operations (in, out, transfer, adjust) with validation.

### Instructions

#### 1. Create Base StockOperationSerializer
- Define as non-model serializer (inherits from `serializers.Serializer`)
- Used for write operations, not reading data
- Include common fields: operation_type, product_id, quantity

#### 2. Add Operation-Specific Fields
- `warehouse_id` - for stock in/out
- `from_warehouse_id` - for transfers
- `to_warehouse_id` - for transfers
- `reason` - for adjustments
- `notes` - optional text field
- `reference_type` and `reference_id` - optional

#### 3. Implement Field Validation
- Validate `quantity > 0` for most operations
- Validate `product_id` exists and is active
- Validate warehouses exist and user has access
- Custom validators per operation type

#### 4. Create Operation-Type Validators
- Override `validate()` method
- Check required fields based on operation_type:
  - STOCK_IN: requires warehouse_id
  - STOCK_OUT: requires warehouse_id
  - TRANSFER: requires both from/to warehouse_id
  - ADJUSTMENT: requires reason

#### 5. Add Authorization Checks
- Validate user has permission for operation
- Check adjustment authorization requirements
- Return validation error if not authorized
- Don't expose permission details in error

#### 6. Create Nested Serializers for Specific Operations
- `StockInSerializer` - inherits from base, stock in specific
- `StockOutSerializer` - inherits, includes availability check
- `StockTransferSerializer` - inherits, validates transfer route
- `StockAdjustmentSerializer` - inherits, includes approval fields

### Validation Checklist
- [ ] All operation types supported
- [ ] Validation comprehensive
- [ ] Authorization checked
- [ ] Error messages clear
- [ ] Nested serializers appropriate
- [ ] Can be used in API views

---

## Task 77: Create StockTakeSerializer

**Complexity:** High | **Time Estimate:** 30 min

### Objective
Create nested serializer for stock take with items, supporting both read and write operations.

### Instructions

#### 1. Create StockTakeItemSerializer
- Start with item serializer (used within stock take)
- Include: id, product, expected_quantity, counted_quantity, variance_quantity
- Add product details: sku, name
- Add variance_percentage and variance_value

#### 2. Create StockTakeListSerializer
- For list views, minimal fields
- Include: id, reference, warehouse, status, started_at, counted_items, total_items
- Add progress_percentage: (counted_items / total_items) × 100
- Include summary stats

#### 3. Create StockTakeDetailSerializer
- Full serializer with nested items
- Use `StockTakeItemSerializer(many=True)` for items
- Include all fields from model
- Add computed fields: duration, completion_percentage

#### 4. Handle Nested Write Operations
- Override `create()` method if creating stock take with items
- Override `update()` method for updating counts
- Use transactions for nested writes
- Validate items belong to stock take

#### 5. Add Conditional Field Inclusion
- If `is_blind_count`, exclude expected_quantity from items
- Use SerializerMethodField to conditionally include/exclude
- Or use separate BlindStockTakeSerializer
- Check user permissions for sensitive fields

#### 6. Create Write Serializers for Actions
- `StartStockTakeSerializer` - for start action, minimal input
- `RecordCountSerializer` - for recording counts, includes item_id and counted_quantity
- `CompleteStockTakeSerializer` - for completion, may include override flags

### Validation Checklist
- [ ] Item serializer complete
- [ ] List serializer lightweight
- [ ] Detail serializer comprehensive
- [ ] Nested writes work correctly
- [ ] Blind count supported
- [ ] Action serializers appropriate

---

## Expected Outcomes

After completing Tasks 73-77:

### Files Created
- `apps/inventory/stock/serializers.py` (comprehensive serializers module)

### Serializer Structure

```python
# Stock Level Serializers
- StockLevelSerializer (base)
- StockLevelListSerializer (minimal)
- StockLevelDetailSerializer (with history)

# Stock Movement Serializers
- StockMovementSerializer
- StockMovementListSerializer

# Stock Operation Serializers
- StockOperationSerializer (base for writes)
- StockInSerializer
- StockOutSerializer
- StockTransferSerializer
- StockAdjustmentSerializer

# Stock Take Serializers
- StockTakeItemSerializer
- StockTakeListSerializer
- StockTakeDetailSerializer
- BlindStockTakeSerializer
- StartStockTakeSerializer
- RecordCountSerializer
- CompleteStockTakeSerializer
```

### Serializer Response Examples

**StockLevel List Response:**
```json
{
  "id": 123,
  "product_id": 456,
  "product_sku": "WIDGET-001",
  "product_name": "Premium Widget",
  "warehouse_id": 789,
  "warehouse_name": "Main Warehouse",
  "quantity": 150,
  "reserved_quantity": 20,
  "available_quantity": 130,
  "incoming_quantity": 50,
  "projected_available": 180,
  "stock_status": "available",
  "average_cost_per_unit": "10.50"
}
```

**StockMovement Response:**
```json
{
  "id": 9876,
  "movement_type": "STOCK_OUT",
  "movement_type_display": "Stock Out",
  "quantity": -50,
  "quantity_display": "-50",
  "product_sku": "WIDGET-001",
  "from_warehouse": "Main Warehouse",
  "to_warehouse": null,
  "movement_reason": "SALE",
  "reference_type": "ORDER",
  "reference_id": "1234",
  "reference_url": "/api/orders/1234/",
  "created_at": "2026-01-23T14:32:15Z",
  "created_by_name": "John Doe"
}
```

**Stock Operation Request:**
```json
{
  "operation_type": "TRANSFER",
  "product_id": 456,
  "quantity": 30,
  "from_warehouse_id": 789,
  "to_warehouse_id": 790,
  "notes": "Transferring to retail location"
}
```

### Validation Examples

```python
# StockOutSerializer validation
def validate(self, data):
    product = data['product_id']
    warehouse = data['warehouse_id']
    quantity = data['quantity']
    
    # Check availability
    stock_level = StockLevel.objects.get(
        product=product, 
        warehouse=warehouse
    )
    
    if stock_level.available_quantity < quantity:
        raise serializers.ValidationError({
            'quantity': f'Insufficient stock. Available: {stock_level.available_quantity}'
        })
    
    return data
```

---

## Progress Tracking

- [ ] Task 73: StockLevelSerializer
- [ ] Task 74: Available stock field
- [ ] Task 75: StockMovementSerializer
- [ ] Task 76: StockOperationSerializer
- [ ] Task 77: StockTakeSerializer

**Document Status:** Complete | **Ready for Implementation:** Yes
