# Tasks 85-88: Model & Service Testing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** F - Testing & Documentation  
> **Tasks:** 85-88 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group F Overview](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group E: Serializers & API Views](../Group-E_Serializers-API-Views/)
- **→ Next:** [Tasks 89-92: API, Concurrency & Documentation](02_Tasks-89-92_API-Concurrency-Docs.md)

---

## Task 85: Create StockLevel Model Tests

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Create comprehensive test suite for StockLevel model including creation, constraints, and calculations.

### Instructions

#### 1. Set Up Test Infrastructure
- Create `apps/inventory/stock/tests/test_models.py`
- Import pytest and Django test utilities
- Create fixtures for test data:
  - `warehouse_factory` - creates test warehouse
  - `product_factory` - creates test product
  - `stock_level_factory` - creates test stock level

#### 2. Test Model Creation
- Test basic StockLevel creation with all required fields
- Test default values: reserved_quantity=0, incoming_quantity=0
- Test automatic timestamp creation
- Test tenant association from product/warehouse

#### 3. Test Unique Constraints
- Test unique_together constraint: (product, variant, warehouse, location)
- Verify duplicate creation raises IntegrityError
- Test that different combinations are allowed

#### 4. Test Available Quantity Property
- Test calculation: available = quantity - reserved_quantity
- Test with various quantity and reserved combinations
- Test edge cases: reserved > quantity (shouldn't happen but handle)

#### 5. Test Stock Status Property
- Test IN_STOCK status when available > reorder_level
- Test LOW_STOCK status when available <= reorder_level
- Test OUT_OF_STOCK status when quantity == 0
- Test with different threshold configurations

#### 6. Test Manager Methods
- Test `get_for_product()` returns correct stock levels
- Test `get_total_stock()` sums across warehouses
- Test `get_available_by_warehouse()` groups correctly
- Test filtering by tenant

#### 7. Test Validation
- Test negative quantity prevention (if configured)
- Test reserved_quantity cannot exceed quantity
- Test cost per unit must be positive
- Test related object existence validation

### Validation Checklist
- [ ] All creation scenarios tested
- [ ] Constraints properly enforced
- [ ] Calculated properties accurate
- [ ] Manager methods return correct data
- [ ] Validations prevent invalid states
- [ ] Edge cases handled

---

## Task 86: Create StockMovement Tests

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Test StockMovement model creation, validation, and reversal functionality.

### Instructions

#### 1. Set Up Movement Test Fixtures
- Create `stock_movement_factory` with faker data
- Create fixtures for different movement types
- Set up related objects: products, warehouses, users

#### 2. Test Movement Creation
- Test creating movements of each type: IN, OUT, TRANSFER, ADJUSTMENT
- Verify all fields properly set
- Test automatic timestamp creation
- Test user tracking

#### 3. Test Movement Type Validation
- Test STOCK_IN: to_warehouse required, from_warehouse null
- Test STOCK_OUT: from_warehouse required, to_warehouse null
- Test TRANSFER: both warehouses required
- Test ADJUSTMENT: warehouse required, reason required
- Verify invalid combinations raise validation errors

#### 4. Test Quantity Validation
- Test quantity must be positive for all types
- Test quantity stored as negative for STOCK_OUT (or handle in logic)
- Test decimal precision maintained
- Test zero quantity prevented

#### 5. Test Movement Reversal
- Create movement, then call `reverse_movement()`
- Verify reverse movement created with opposite quantity
- Test link between original and reversed movement
- Test double-reversal prevention

#### 6. Test Reference Linking
- Test movement linked to order (reference_type=ORDER, reference_id=X)
- Test movement linked to PO, adjustment, stock take
- Test querying movements by reference
- Test reference validation

#### 7. Test Manager Methods
- Test filtering by movement_type
- Test filtering by date range
- Test filtering by product
- Test summary methods (sum movements by type)

### Validation Checklist
- [ ] All movement types can be created
- [ ] Type-specific validations enforced
- [ ] Quantity validations work
- [ ] Reversal creates correct opposite movement
- [ ] References properly linked
- [ ] Manager methods return correct data

---

## Task 87: Create Stock Operation Tests

**Complexity:** High | **Time Estimate:** 40 min

### Objective
Test all stock operation service methods: in, out, transfer, reserve, release, commit.

### Instructions

#### 1. Set Up Service Test Class
- Create `apps/inventory/stock/tests/test_services.py`
- Import StockService and related services
- Set up fixtures with complete data: products, warehouses, stock levels

#### 2. Test Stock In Operation
- Test successful stock in increases quantity
- Test StockMovement record created
- Test cost_per_unit recorded
- Test weighted average cost updated
- Test invalid inputs raise appropriate errors

#### 3. Test Stock Out Operation
- Test successful stock out decreases quantity
- Test availability check prevents insufficient stock out
- Test StockMovement created with negative quantity
- Test error when trying to remove more than available
- Test reserved quantity not affected

#### 4. Test Stock Transfer Operation
- Test successful transfer updates both warehouses
- Test source quantity decreased
- Test destination quantity increased
- Test two movements created (OUT and IN)
- Test in-transit handling if implemented
- Test transfer validation (route, availability)

#### 5. Test Reserve Operation
- Test reserve increases reserved_quantity
- Test available_quantity decreases
- Test reservation movement created
- Test insufficient stock prevents reservation
- Test partial reservation if configured
- Test reservation expiration

#### 6. Test Release Operation
- Test release decreases reserved_quantity
- Test available_quantity increases
- Test release movement created
- Test release linked to original reservation
- Test releasing non-existent reservation fails

#### 7. Test Commit Reserved Operation
- Test commit decreases both quantity and reserved_quantity
- Test available quantity unchanged (net effect)
- Test committed movement created
- Test cost tracking on commit
- Test committing non-reserved quantity fails

#### 8. Test Adjustment Operations
- Test positive adjustment increases quantity
- Test negative adjustment decreases quantity
- Test adjustment requires authorization for large amounts
- Test adjustment request created if approval needed
- Test reason required for adjustments

#### 9. Test Transaction Handling
- Test operations are atomic (all or nothing)
- Test concurrent operations don't corrupt data
- Test rollback on error leaves data consistent
- Use threading or multiprocessing to test concurrency

### Validation Checklist
- [ ] All operation types tested
- [ ] Success paths work correctly
- [ ] Error paths handled gracefully
- [ ] Quantity updates accurate
- [ ] Movements created correctly
- [ ] Authorization enforced
- [ ] Transactions atomic
- [ ] Concurrency safe

---

## Task 88: Create Stock Take Tests

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Test complete stock take lifecycle from creation through completion.

### Instructions

#### 1. Set Up Stock Take Test Class
- Create fixtures for stock take scenarios
- Create warehouse with multiple products
- Create stock levels for all products

#### 2. Test Stock Take Creation
- Test creating stock take with FULL scope
- Test creating with PARTIAL scope and product selection
- Test reference number generation
- Test initial status is DRAFT
- Test validation of warehouse access

#### 3. Test Start Stock Take
- Test starting transitions status to COUNTING
- Test items populated with expected quantities
- Test item count matches scope (all or partial products)
- Test expected quantity matches StockLevel at start time
- Test cost per unit captured
- Test count sequence assigned

#### 4. Test Record Count
- Test recording counted quantity updates item
- Test variance calculated automatically
- Test counted_by and counted_at set
- Test parent stock take statistics updated
- Test high variance flagged for review
- Test counting locked items prevented

#### 5. Test Bulk Count Recording
- Test recording multiple counts in single transaction
- Test partial success handled (some fail, some succeed)
- Test progress tracking updated correctly
- Test performance with large batches

#### 6. Test Variance Calculations
- Test variance_quantity = counted - expected
- Test variance_percentage calculated correctly
- Test variance_value includes cost
- Test variance classification (MINOR, MODERATE, SIGNIFICANT)
- Test handle zero expected quantity

#### 7. Test Complete Stock Take
- Test completion requires all items counted
- Test adjustments created for all variances
- Test stock levels updated correctly
- Test status transitions to COMPLETED
- Test completion timestamps set
- Test force complete bypasses validation

#### 8. Test Approval Workflow
- Test high value variances require approval
- Test approval request created
- Test approval allows completion
- Test rejection prevents completion

#### 9. Test Blind Count Mode
- Test expected quantity hidden when blind count
- Test revealed after count submitted
- Test double blind verification

### Validation Checklist
- [ ] Full lifecycle can complete
- [ ] All status transitions work
- [ ] Items populated correctly
- [ ] Counts recorded accurately
- [ ] Variances calculated correctly
- [ ] Adjustments created on completion
- [ ] Stock levels updated
- [ ] Approval workflow functional
- [ ] Blind count mode works

---

## Expected Outcomes

After completing Tasks 85-88:

### Files Created
```
apps/inventory/stock/tests/
├── __init__.py
├── conftest.py                 # pytest fixtures
├── factories.py                # factory_boy factories
├── test_models.py              # Task 85
├── test_services.py            # Tasks 87-88
└── test_stock_movements.py     # Task 86
```

### Test Coverage Targets
- **Models:** 90%+ coverage
- **Services:** 85%+ coverage
- **Critical paths:** 100% coverage (stock operations, adjustments)

### Example Test Structure

```python
# test_models.py
import pytest
from decimal import Decimal
from apps.inventory.stock.models import StockLevel

@pytest.mark.django_db
class TestStockLevelModel:
    
    def test_create_stock_level(self, product_factory, warehouse_factory):
        """Test basic stock level creation"""
        product = product_factory()
        warehouse = warehouse_factory()
        
        stock_level = StockLevel.objects.create(
            product=product,
            warehouse=warehouse,
            quantity=Decimal('100'),
            reserved_quantity=Decimal('10')
        )
        
        assert stock_level.quantity == Decimal('100')
        assert stock_level.reserved_quantity == Decimal('10')
        assert stock_level.available_quantity == Decimal('90')
    
    def test_unique_constraint(self, stock_level_factory):
        """Test unique constraint on product-warehouse"""
        stock_level = stock_level_factory()
        
        with pytest.raises(IntegrityError):
            StockLevel.objects.create(
                product=stock_level.product,
                warehouse=stock_level.warehouse,
                quantity=50
            )
    
    def test_stock_status_calculation(self, stock_level_factory):
        """Test status based on quantity thresholds"""
        stock_level = stock_level_factory(
            quantity=100,
            reserved_quantity=0
        )
        stock_level.product.reorder_level = 50
        
        assert stock_level.stock_status == 'IN_STOCK'
        
        stock_level.quantity = 30
        assert stock_level.stock_status == 'LOW_STOCK'
        
        stock_level.quantity = 0
        assert stock_level.stock_status == 'OUT_OF_STOCK'
```

```python
# test_services.py
import pytest
from decimal import Decimal
from apps.inventory.stock.services.stock_service import StockService

@pytest.mark.django_db
class TestStockOperations:
    
    def test_stock_in_operation(self, product, warehouse, user):
        """Test stock in increases quantity and creates movement"""
        service = StockService()
        
        result = service.stock_in(
            product=product,
            warehouse=warehouse,
            quantity=Decimal('100'),
            cost_per_unit=Decimal('10.00'),
            user=user
        )
        
        assert result.success is True
        assert result.data['stock_level'].quantity == Decimal('100')
        assert result.data['movement'].movement_type == 'STOCK_IN'
    
    def test_stock_out_insufficient_stock(self, stock_level, user):
        """Test stock out fails when insufficient stock"""
        stock_level.quantity = Decimal('10')
        stock_level.save()
        
        service = StockService()
        
        result = service.stock_out(
            product=stock_level.product,
            warehouse=stock_level.warehouse,
            quantity=Decimal('20'),
            user=user
        )
        
        assert result.success is False
        assert 'insufficient' in result.errors[0]['message'].lower()
    
    @pytest.mark.django_db(transaction=True)
    def test_concurrent_stock_operations(self, stock_level):
        """Test concurrent operations don't corrupt data"""
        from concurrent.futures import ThreadPoolExecutor
        
        def stock_out_operation():
            service = StockService()
            return service.stock_out(
                product=stock_level.product,
                warehouse=stock_level.warehouse,
                quantity=Decimal('1'),
                user=stock_level.tenant.users.first()
            )
        
        stock_level.quantity = Decimal('10')
        stock_level.save()
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(stock_out_operation) for _ in range(5)]
            results = [f.result() for f in futures]
        
        stock_level.refresh_from_db()
        assert stock_level.quantity == Decimal('5')  # 10 - 5 operations
```

### Pytest Configuration

```python
# conftest.py
import pytest
from decimal import Decimal
import factory

@pytest.fixture
def product_factory(db):
    from apps.products.tests.factories import ProductFactory
    return ProductFactory

@pytest.fixture
def warehouse_factory(db):
    from apps.warehouse.tests.factories import WarehouseFactory
    return WarehouseFactory

@pytest.fixture
def stock_level_factory(db):
    from .factories import StockLevelFactory
    return StockLevelFactory

@pytest.fixture
def stock_level(product_factory, warehouse_factory, db):
    """Pre-created stock level with standard quantities"""
    from apps.inventory.stock.models import StockLevel
    
    product = product_factory()
    warehouse = warehouse_factory()
    
    return StockLevel.objects.create(
        product=product,
        warehouse=warehouse,
        quantity=Decimal('100'),
        reserved_quantity=Decimal('0'),
        average_cost_per_unit=Decimal('10.00')
    )
```

---

## Progress Tracking

- [ ] Task 85: StockLevel model tests
- [ ] Task 86: StockMovement model tests
- [ ] Task 87: Stock operation service tests
- [ ] Task 88: Stock take lifecycle tests

**Document Status:** Complete | **Ready for Implementation:** Yes
