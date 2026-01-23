# Tasks 78-81: DRF ViewSets for Inventory API

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** E - Serializers & API Views  
> **Tasks:** 78-81 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group E Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 73-77: Serializers](01_Tasks-73-77_Serializers.md)
- **→ Next:** [Tasks 82-84: Additional Endpoints](03_Tasks-82-84_Additional-Endpoints.md)

---

## Task 78: Create StockLevelViewSet

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create ReadOnly ViewSet for querying stock levels with filtering by product, warehouse, and status.

### Instructions

#### 1. Create StockLevelViewSet Base
- Create `apps/inventory/stock/views.py`
- Define `StockLevelViewSet` inheriting from `viewsets.ReadOnlyModelViewSet`
- Set queryset: `StockLevel.objects.select_related('product', 'warehouse')`
- Use `StockLevelSerializer` as default

#### 2. Add Multi-Tenant Filtering
- Override `get_queryset()` to filter by tenant
- Apply: `queryset.filter(tenant=self.request.user.tenant)`
- Add warehouse access check (user can only see authorized warehouses)

#### 3. Configure Filter Backends
- Add `django_filters.DjangoFilterBackend`
- Add `filters.SearchFilter`
- Add `filters.OrderingFilter`
- Configure in viewset settings

#### 4. Define Filter Fields
- Create `StockLevelFilter` class using django-filter
- Filter by:
  - `product` (exact, ID)
  - `product__sku` (exact, icontains)
  - `warehouse` (exact, multiple)
  - `quantity__gte`, `quantity__lte` (range)
  - `available_quantity__gte` (calculated in queryset)
- Add custom filter for `status` (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)

#### 5. Add Search and Ordering
- `search_fields`: ['product__sku', 'product__name', 'warehouse__name']
- `ordering_fields`: ['quantity', 'available_quantity', 'product__sku']
- `ordering`: ['-quantity'] (default)

#### 6. Add Custom Actions
- Action: `@action(methods=['get']) low_stock()`
  - Return items with available quantity < reorder_level
  - Use separate `LowStockSerializer` with alert info
- Action: `@action(methods=['get']) out_of_stock()`
  - Return items with quantity == 0

### Validation Checklist
- [ ] ViewSet properly configured
- [ ] Multi-tenant filtering works
- [ ] Filters comprehensive
- [ ] Search functionality accurate
- [ ] Ordering works on all fields
- [ ] Custom actions functional

---

## Task 79: Create StockMovementViewSet

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Create ReadOnly ViewSet for querying stock movement history with date range and type filtering.

### Instructions

#### 1. Create StockMovementViewSet Base
- Define `StockMovementViewSet` inheriting from `viewsets.ReadOnlyModelViewSet`
- Set queryset with optimizations:
  - `select_related('product', 'from_warehouse', 'to_warehouse', 'created_by')`
- Use `StockMovementSerializer`
- ReadOnly (no create/update/delete)

#### 2. Add Tenant and Permission Filtering
- Override `get_queryset()` for tenant filtering
- Filter by user's accessible warehouses
- Apply warehouse-level permissions

#### 3. Create StockMovementFilter
- Filter by:
  - `product` (exact, multiple)
  - `movement_type` (exact, multiple choice)
  - `from_warehouse`, `to_warehouse` (exact, multiple)
  - `created_at__gte`, `created_at__lte` (date range)
  - `reference_type`, `reference_id` (exact)
- Add custom `date_range` filter (today, this_week, this_month, last_30_days)

#### 4. Add Search and Ordering
- `search_fields`: ['product__sku', 'product__name', 'notes']
- `ordering_fields`: ['created_at', 'quantity', 'movement_type']
- `ordering`: ['-created_at'] (most recent first)

#### 5. Create Custom Actions
- Action: `@action(methods=['get']) for_product()`
  - Get all movements for specific product
  - Include query param: product_id
  - Return chronological movement history

- Action: `@action(methods=['get']) summary()`
  - Aggregate movements by type for date range
  - Return: {STOCK_IN: 500, STOCK_OUT: -300, ...}

#### 6. Add Pagination
- Use `PageNumberPagination`
- Set page_size = 50 (movements can be numerous)
- Allow page_size override up to 200

### Validation Checklist
- [ ] ViewSet properly configured
- [ ] Filters cover common use cases
- [ ] Date range filtering accurate
- [ ] Product history action works
- [ ] Summary action aggregates correctly
- [ ] Pagination efficient

---

## Task 80: Create Stock Operation Endpoints

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Create POST endpoints for executing stock operations: in, out, transfer, and adjust.

### Instructions

#### 1. Create StockOperationViewSet
- Define `StockOperationViewSet` inheriting from `viewsets.ViewSet`
- NOT a ModelViewSet (operations, not CRUD)
- No list/retrieve/update/delete actions
- Only custom POST actions

#### 2. Implement Stock In Action
- Action: `@action(methods=['post']) stock_in()`
- Use `StockInSerializer` for input validation
- Call `StockService.stock_in()` with validated data
- Return: movement record and updated stock level
- Handle errors with appropriate HTTP status codes

#### 3. Implement Stock Out Action
- Action: `@action(methods=['post']) stock_out()`
- Use `StockOutSerializer` for validation
- Validate availability before calling service
- Call `StockService.stock_out()`
- Return movement and remaining stock
- Return 400 if insufficient stock

#### 4. Implement Transfer Action
- Action: `@action(methods=['post']) transfer()`
- Use `StockTransferSerializer`
- Validate transfer route is allowed
- Call `StockService.stock_transfer()`
- Handle in-transit status if applicable
- Return source and destination stock levels

#### 5. Implement Adjustment Action
- Action: `@action(methods=['post']) adjust()`
- Use `StockAdjustmentSerializer`
- Check authorization requirements
- If requires approval, create request instead of executing
- Call `StockAdjustmentService.adjust_up()` or `adjust_down()`
- Return adjustment details and approval status

#### 6. Add Batch Operation Action
- Action: `@action(methods=['post']) batch_operation()`
- Accept list of operations
- Use `BatchStockService.execute_batch()`
- Return `BatchOperationResult`
- Include success/failure details for each operation

### Validation Checklist
- [ ] All operation endpoints functional
- [ ] Input validation comprehensive
- [ ] Service layer properly called
- [ ] Errors handled gracefully
- [ ] Response format consistent
- [ ] Batch operations work correctly

---

## Task 81: Create StockTakeViewSet

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Create ViewSet for managing stock takes with actions for start, count, and complete operations.

### Instructions

#### 1. Create StockTakeViewSet Base
- Define `StockTakeViewSet` inheriting from `viewsets.ModelViewSet`
- Support full CRUD for stock take management
- Use `StockTakeListSerializer` for list
- Use `StockTakeDetailSerializer` for retrieve
- Use `CreateStockTakeSerializer` for create

#### 2. Configure Queryset and Filtering
- Queryset: `StockTake.objects.select_related('warehouse', 'created_by')`
- Add `StockTakeFilter`:
  - Filter by: warehouse, status, scope, created_at range
- Add search: reference, name
- Add ordering: -created_at, -started_at

#### 3. Override Create Method
- Use `StockTakeService.create_stock_take()`
- Don't directly create model instance
- Validate warehouse access
- Return created stock take with initial status DRAFT

#### 4. Implement Start Action
- Action: `@action(methods=['post'], detail=True) start()`
- Call `StockTakeService.start_stock_take(pk, user)`
- Populate items with expected quantities
- Transition status to COUNTING
- Return stock take with item count

#### 5. Implement Count Action
- Action: `@action(methods=['post'], detail=True) count()`
- Accept: item_id, counted_quantity, notes
- Call `StockTakeService.record_count()`
- Return updated item with variance calculated
- Support recording multiple items in single request

#### 6. Implement Complete Action
- Action: `@action(methods=['post'], detail=True) complete()`
- Validate all items counted (or force flag provided)
- Call `StockTakeService.complete_stock_take()`
- Create adjustments for variances
- Return completion summary with adjustment details

#### 7. Add Additional Actions
- Action: `@action(methods=['post'], detail=True) cancel()`
  - Cancel stock take in progress
  
- Action: `@action(methods=['get'], detail=True) items()`
  - List all items in stock take with filtering
  
- Action: `@action(methods=['get'], detail=True) variances()`
  - Return only items with variances
  
- Action: `@action(methods=['get'], detail=True) report()`
  - Generate and return PDF/Excel report

### Validation Checklist
- [ ] CRUD operations work correctly
- [ ] Start action populates items
- [ ] Count action records accurately
- [ ] Complete action creates adjustments
- [ ] All additional actions functional
- [ ] Permissions enforced

---

## Expected Outcomes

After completing Tasks 78-81:

### Files Created
- `apps/inventory/stock/views.py` (ViewSets module)
- `apps/inventory/stock/filters.py` (Filter classes)
- `apps/inventory/stock/urls.py` (URL routing)

### URL Configuration

```python
# apps/inventory/stock/urls.py
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('stock-levels', StockLevelViewSet, basename='stocklevel')
router.register('stock-movements', StockMovementViewSet, basename='stockmovement')
router.register('stock-operations', StockOperationViewSet, basename='stockoperation')
router.register('stock-takes', StockTakeViewSet, basename='stocktake')

urlpatterns = router.urls
```

### API Endpoints Summary

**Stock Levels:**
- `GET /api/stock-levels/` - List stock levels
- `GET /api/stock-levels/{id}/` - Get stock level details
- `GET /api/stock-levels/low_stock/` - Get low stock items
- `GET /api/stock-levels/out_of_stock/` - Get out of stock items

**Stock Movements:**
- `GET /api/stock-movements/` - List movements
- `GET /api/stock-movements/{id}/` - Get movement details
- `GET /api/stock-movements/for_product/?product_id=123` - Product history
- `GET /api/stock-movements/summary/?date_range=this_month` - Movement summary

**Stock Operations:**
- `POST /api/stock-operations/stock_in/` - Add stock
- `POST /api/stock-operations/stock_out/` - Remove stock
- `POST /api/stock-operations/transfer/` - Transfer between warehouses
- `POST /api/stock-operations/adjust/` - Adjust stock
- `POST /api/stock-operations/batch_operation/` - Batch operations

**Stock Takes:**
- `GET /api/stock-takes/` - List stock takes
- `POST /api/stock-takes/` - Create stock take
- `GET /api/stock-takes/{id}/` - Get stock take details
- `POST /api/stock-takes/{id}/start/` - Start counting
- `POST /api/stock-takes/{id}/count/` - Record count
- `POST /api/stock-takes/{id}/complete/` - Finalize stock take
- `GET /api/stock-takes/{id}/items/` - List items
- `GET /api/stock-takes/{id}/variances/` - Get variances only
- `GET /api/stock-takes/{id}/report/` - Download report

### Request/Response Examples

**Stock In Request:**
```json
POST /api/stock-operations/stock_in/
{
  "product_id": 456,
  "warehouse_id": 789,
  "quantity": 100,
  "cost_per_unit": "10.50",
  "reference_type": "PURCHASE_ORDER",
  "reference_id": "PO-2026-001",
  "notes": "Received from Supplier ABC"
}
```

**Stock In Response:**
```json
{
  "success": true,
  "movement": {
    "id": 9999,
    "movement_type": "STOCK_IN",
    "quantity": 100,
    "created_at": "2026-01-23T10:00:00Z"
  },
  "stock_level": {
    "product_sku": "WIDGET-001",
    "warehouse_name": "Main Warehouse",
    "quantity": 250,
    "available_quantity": 230
  }
}
```

**Start Stock Take Request:**
```json
POST /api/stock-takes/123/start/
{
  "count_sequence": "by_location"
}
```

**Start Stock Take Response:**
```json
{
  "id": 123,
  "reference": "ST-2026-0045",
  "status": "COUNTING",
  "started_at": "2026-01-23T10:00:00Z",
  "total_items": 847,
  "counted_items": 0,
  "message": "Stock take started. 847 items ready to count."
}
```

---

## Progress Tracking

- [ ] Task 78: StockLevelViewSet with filters
- [ ] Task 79: StockMovementViewSet with history
- [ ] Task 80: Stock operation endpoints
- [ ] Task 81: StockTakeViewSet with actions

**Document Status:** Complete | **Ready for Implementation:** Yes
