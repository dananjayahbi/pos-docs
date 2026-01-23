# Tasks 82-84: Additional API Endpoints

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** E - Serializers & API Views  
> **Tasks:** 82-84 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group E Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 78-81: ViewSets](02_Tasks-78-81_ViewSets.md)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Task 82: Add Bulk Count Endpoint

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create endpoint for batch counting multiple stock take items in a single request for efficiency.

### Instructions

#### 1. Create BulkCountSerializer
- Define serializer accepting list of counts
- Structure: `[{item_id: 123, counted_quantity: 50, notes: "..."}, ...]`
- Validate each item:
  - item_id exists and belongs to stock take
  - counted_quantity is valid number
  - item not already locked

#### 2. Add Bulk Count Action to StockTakeViewSet
- Action: `@action(methods=['post'], detail=True) bulk_count()`
- URL: `POST /api/stock-takes/{id}/bulk-count/`
- Accept list of count records in request body
- Use `BulkCountSerializer` for validation

#### 3. Implement Batch Processing
- Call `StockTakeService.record_counts_bulk(counts_list, user)`
- Process all counts in single database transaction
- Use `select_for_update()` to lock items being counted
- Handle partial failures if configured (continue on error)

#### 4. Return Detailed Results
- Return structure:
  ```json
  {
    "total": 25,
    "successful": 23,
    "failed": 2,
    "results": [
      {"item_id": 123, "success": true, "variance": -2},
      {"item_id": 124, "success": false, "error": "Item locked"}
    ]
  }
  ```

#### 5. Add Progress Tracking
- Update stock take `counted_items` counter
- Update `items_with_variance` counter
- Recalculate `total_variance_value`
- Return updated stock take summary

#### 6. Optimize Performance
- Use `bulk_update()` for updating multiple items
- Minimize database queries
- For very large batches (>100 items), consider Celery task
- Return task ID if processing asynchronously

### Validation Checklist
- [ ] Serializer validates all items
- [ ] Batch processing efficient
- [ ] Transaction handling correct
- [ ] Results clearly show success/failure per item
- [ ] Progress tracking accurate
- [ ] Performance acceptable for large batches

---

## Task 83: Add Stock Availability Endpoint

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create endpoint to query product availability across all warehouses in a single request.

### Instructions

#### 1. Create Availability Serializer
- Define `ProductAvailabilitySerializer`
- Include: product info, total available, breakdown by warehouse
- Structure:
  ```json
  {
    "product_id": 456,
    "sku": "WIDGET-001",
    "name": "Premium Widget",
    "total_quantity": 500,
    "total_available": 450,
    "total_reserved": 50,
    "by_warehouse": [
      {
        "warehouse_id": 1,
        "warehouse_name": "Main",
        "quantity": 300,
        "available": 280,
        "reserved": 20
      },
      ...
    ]
  }
  ```

#### 2. Add Availability Action to Product ViewSet
- If Product ViewSet exists in products app, add action there
- Action: `@action(methods=['get'], detail=True) availability()`
- URL: `GET /api/products/{id}/availability/`
- Alternative: Create standalone view in stock app

#### 3. Implement Query Logic
- Query all StockLevel records for product
- Use `select_related('warehouse')` for efficiency
- Calculate totals and available quantities
- Filter by user's accessible warehouses

#### 4. Add Filtering Options
- Query param: `warehouse_ids` - limit to specific warehouses
- Query param: `include_zero` - include warehouses with zero stock
- Query param: `available_only` - only show warehouses with available stock

#### 5. Support Multi-Product Query
- Create separate endpoint for checking multiple products
- URL: `POST /api/stock-levels/check-availability/`
- Accept: `{"product_ids": [456, 457, 458]}`
- Return availability for all products
- Use for order fulfillment checking

#### 6. Add Projected Availability
- Include `incoming_quantity` in calculations
- Show `projected_available` = available + incoming
- Include expected arrival dates for incoming stock
- Useful for order promising

### Validation Checklist
- [ ] Availability calculated correctly
- [ ] Breakdown by warehouse accurate
- [ ] Filtering options work
- [ ] Multi-product check efficient
- [ ] Projected availability included
- [ ] Response format consistent

---

## Task 84: Add Stock History Endpoint

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create endpoint to retrieve complete movement history for a product with date range filtering.

### Instructions

#### 1. Create Stock History Serializer
- Define `StockHistorySerializer`
- Extend `StockMovementSerializer` with additional context
- Include running balance after each movement
- Structure:
  ```json
  {
    "movement_id": 9876,
    "date": "2026-01-23T14:30:00Z",
    "type": "STOCK_OUT",
    "quantity": -50,
    "balance_after": 200,
    "warehouse": "Main",
    "reason": "SALE",
    "reference": "ORDER-1234",
    "user": "John Doe"
  }
  ```

#### 2. Add History Action to Product or StockLevel ViewSet
- Option A: Add to Product ViewSet
  - `@action(methods=['get'], detail=True) movements()`
  - URL: `GET /api/products/{id}/movements/`
  
- Option B: Add to StockMovement ViewSet
  - Filter by product: `GET /api/stock-movements/?product_id=456`
  - This option may already be covered by Task 79

#### 3. Implement Running Balance Calculation
- Query movements ordered by created_at
- Calculate running total after each movement
- Start from earliest movement or specified date
- Annotate queryset with cumulative sum if possible

#### 4. Add Date Range Filtering
- Required params: `start_date`, `end_date`
- If not provided, default to last 30 days
- Validate date range not too large (max 1 year)
- Return movements within range

#### 5. Add Warehouse Filtering
- Query param: `warehouse_id` - specific warehouse only
- If not provided, return movements across all warehouses
- Show warehouse in each movement record

#### 6. Add Aggregation Options
- Query param: `aggregate=daily` - group by day
- Query param: `aggregate=weekly` - group by week
- Return summary: date, total_in, total_out, net_change, ending_balance
- Useful for reporting and trending

### Validation Checklist
- [ ] Movement history complete
- [ ] Running balance accurate
- [ ] Date range filtering works
- [ ] Warehouse filtering functional
- [ ] Aggregation options available
- [ ] Performance acceptable for large histories

---

## Expected Outcomes

After completing Tasks 82-84:

### Files Modified
- `apps/inventory/stock/views.py` (actions added to ViewSets)
- `apps/inventory/stock/serializers.py` (new serializers added)

### New API Endpoints

**Bulk Count:**
- `POST /api/stock-takes/{id}/bulk-count/`
  - Body: `{"counts": [{item_id, counted_quantity, notes}, ...]}`
  - Response: Batch result with success/failure per item

**Product Availability:**
- `GET /api/products/{id}/availability/`
  - Response: Total availability with warehouse breakdown
- `POST /api/stock-levels/check-availability/`
  - Body: `{"product_ids": [456, 457, 458]}`
  - Response: Availability for all requested products

**Stock History:**
- `GET /api/products/{id}/movements/`
  - Query params: start_date, end_date, warehouse_id, aggregate
  - Response: Movement history with running balance

### Request/Response Examples

**Bulk Count Request:**
```json
POST /api/stock-takes/123/bulk-count/
{
  "counts": [
    {"item_id": 501, "counted_quantity": 98, "notes": "2 damaged"},
    {"item_id": 502, "counted_quantity": 150},
    {"item_id": 503, "counted_quantity": 0, "notes": "Not found"}
  ]
}
```

**Bulk Count Response:**
```json
{
  "total": 3,
  "successful": 3,
  "failed": 0,
  "stock_take": {
    "id": 123,
    "reference": "ST-2026-0045",
    "counted_items": 25,
    "total_items": 847,
    "progress_percentage": 2.95
  },
  "results": [
    {
      "item_id": 501,
      "success": true,
      "variance_quantity": -2,
      "variance_percentage": -2.04
    },
    {
      "item_id": 502,
      "success": true,
      "variance_quantity": 0,
      "variance_percentage": 0.0
    },
    {
      "item_id": 503,
      "success": true,
      "variance_quantity": -25,
      "variance_percentage": -100.0
    }
  ]
}
```

**Product Availability Response:**
```json
{
  "product_id": 456,
  "sku": "WIDGET-001",
  "name": "Premium Widget",
  "total_quantity": 500,
  "total_available": 450,
  "total_reserved": 50,
  "total_incoming": 200,
  "projected_available": 650,
  "by_warehouse": [
    {
      "warehouse_id": 1,
      "warehouse_name": "Main Warehouse",
      "warehouse_code": "MAIN",
      "quantity": 300,
      "available": 280,
      "reserved": 20,
      "incoming": 100
    },
    {
      "warehouse_id": 2,
      "warehouse_name": "Retail Store 1",
      "warehouse_code": "RET01",
      "quantity": 200,
      "available": 170,
      "reserved": 30,
      "incoming": 100
    }
  ]
}
```

**Stock History Response:**
```json
{
  "product_id": 456,
  "sku": "WIDGET-001",
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-23"
  },
  "starting_balance": 100,
  "ending_balance": 200,
  "movements": [
    {
      "id": 9871,
      "date": "2026-01-02T10:15:00Z",
      "type": "STOCK_IN",
      "type_display": "Stock In",
      "quantity": 150,
      "balance_after": 250,
      "warehouse": "Main Warehouse",
      "reason": "PURCHASE",
      "reference": "PO-2026-001",
      "user": "Jane Smith",
      "cost_per_unit": "10.00"
    },
    {
      "id": 9876,
      "date": "2026-01-23T14:30:00Z",
      "type": "STOCK_OUT",
      "type_display": "Stock Out",
      "quantity": -50,
      "balance_after": 200,
      "warehouse": "Main Warehouse",
      "reason": "SALE",
      "reference": "ORDER-1234",
      "user": "John Doe",
      "cost_per_unit": "10.00"
    }
  ]
}
```

### Mobile App Integration

These endpoints are particularly useful for:
- **Bulk Count**: Warehouse staff can count multiple items offline and sync in batch
- **Availability**: POS/Sales apps can check stock before committing orders
- **History**: Mobile reporting and audit trail access

### Performance Optimizations

```python
# Bulk count optimization
@transaction.atomic()
def bulk_count(self, request, pk=None):
    stock_take = self.get_object()
    serializer = BulkCountSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    # Lock all items being updated
    item_ids = [c['item_id'] for c in serializer.validated_data['counts']]
    items = StockTakeItem.objects.select_for_update().filter(
        id__in=item_ids,
        stock_take=stock_take
    )
    
    # Process with bulk_update
    for item, count_data in zip(items, serializer.validated_data['counts']):
        item.counted_quantity = count_data['counted_quantity']
        item.counted_by = request.user
        item.counted_at = timezone.now()
        item.calculate_variance()
    
    StockTakeItem.objects.bulk_update(
        items, 
        ['counted_quantity', 'counted_by', 'counted_at', 
         'variance_quantity', 'variance_percentage']
    )
    
    return Response(...)
```

---

## Progress Tracking

- [ ] Task 82: Bulk count endpoint
- [ ] Task 83: Stock availability endpoint
- [ ] Task 84: Stock history endpoint

**Group E Status:** Complete | **Ready for Group F:** Yes
