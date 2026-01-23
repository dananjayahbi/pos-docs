# Tasks 89-92: API Tests, Concurrency & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** F - Testing & Documentation  
> **Tasks:** 89-92 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group F Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 85-88: Model & Service Tests](01_Tasks-85-88_Model-Service-Tests.md)
- **→ Next SubPhase:** [SubPhase-10: Stock Alerts & Reordering](../../SubPhase-10_Stock-Alerts-Reordering/)

---

## Task 89: Create API Endpoint Tests

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Test all inventory API endpoints including ViewSets, actions, filters, and permissions.

### Instructions

#### 1. Set Up API Test Class
- Create `apps/inventory/stock/tests/test_api.py`
- Import Django REST Framework test utilities
- Use APIClient for making requests
- Create authenticated user fixtures for permission testing

#### 2. Test StockLevel API Endpoints
- Test `GET /api/stock-levels/` - list with pagination
- Test filtering: by product, warehouse, status
- Test search: by SKU, product name
- Test ordering: by quantity, available
- Test `GET /api/stock-levels/{id}/` - retrieve detail
- Test authentication required for all endpoints
- Test tenant isolation (can only see own tenant's stock)

#### 3. Test StockMovement API Endpoints
- Test `GET /api/stock-movements/` - list movements
- Test filtering: by date range, movement type, product
- Test `GET /api/stock-movements/{id}/` - retrieve detail
- Test `/for_product/` custom action
- Test `/summary/` aggregation action
- Test read-only (no create/update/delete)

#### 4. Test Stock Operation Endpoints
- Test `POST /api/stock-operations/stock_in/` - add stock
  - Test success case
  - Test validation errors (missing fields)
  - Test permission denied for unauthorized users
  
- Test `POST /api/stock-operations/stock_out/` - remove stock
  - Test success case
  - Test insufficient stock error
  - Test updates stock level correctly
  
- Test `POST /api/stock-operations/transfer/` - transfer stock
  - Test success with both warehouses updated
  - Test validation of transfer route
  
- Test `POST /api/stock-operations/adjust/` - adjust stock
  - Test adjustment with authorization
  - Test approval request created for high value
  - Test adjustment reason required

#### 5. Test StockTake API Endpoints
- Test `GET /api/stock-takes/` - list stock takes
- Test `POST /api/stock-takes/` - create stock take
- Test `GET /api/stock-takes/{id}/` - retrieve detail
- Test `POST /api/stock-takes/{id}/start/` - start action
  - Verify items populated
  - Verify status changed
- Test `POST /api/stock-takes/{id}/count/` - record count
  - Verify variance calculated
- Test `POST /api/stock-takes/{id}/bulk-count/` - bulk recording
- Test `POST /api/stock-takes/{id}/complete/` - complete action
  - Verify adjustments created
- Test `GET /api/stock-takes/{id}/report/` - generate report

#### 6. Test Additional Endpoints
- Test `GET /api/products/{id}/availability/` - availability check
- Test `POST /api/stock-levels/check-availability/` - multi-product
- Test `GET /api/products/{id}/movements/` - movement history

#### 7. Test Permission and Authorization
- Test endpoints require authentication
- Test role-based access:
  - Stock clerk: can view, count
  - Supervisor: can adjust (low value)
  - Manager: can approve, complete stock takes
- Test warehouse-level permissions (user can only access assigned warehouses)

#### 8. Test Response Formats
- Verify all responses match serializer schemas
- Test pagination in list responses
- Test error response format (400, 404, 403)
- Test nested data properly serialized

### Validation Checklist
- [ ] All endpoints tested (GET, POST)
- [ ] Filters and search work
- [ ] Custom actions functional
- [ ] Validation errors return correctly
- [ ] Permissions enforced
- [ ] Response formats consistent
- [ ] Authentication required

---

## Task 90: Create Concurrency Tests

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Test that concurrent stock operations are handled safely without data corruption.

### Instructions

#### 1. Set Up Concurrency Test Infrastructure
- Create `apps/inventory/stock/tests/test_concurrency.py`
- Import threading and multiprocessing utilities
- Use pytest-django's transaction database
- Create fixtures for concurrent test scenarios

#### 2. Test Concurrent Stock Out Operations
- Create stock level with quantity 100
- Launch 10 threads simultaneously removing 10 units each
- Verify final quantity is 0 (not negative or inconsistent)
- Test with `select_for_update()` locking
- Test without locking to demonstrate race condition

#### 3. Test Concurrent Reservations
- Create stock level with 50 available
- Launch 5 threads each trying to reserve 15 units
- Verify only 3 reservations succeed (total 45)
- Last 2 should fail with insufficient stock
- Test reservation queue fairness

#### 4. Test Concurrent Transfers
- Create two warehouses with stock
- Launch multiple transfers from warehouse A to B simultaneously
- Verify all transfers atomic (no partial state)
- Verify total stock conserved (no phantom inventory)
- Test deadlock prevention

#### 5. Test Concurrent Stock Takes
- Create stock take with multiple items
- Have multiple users count different items simultaneously
- Verify no counts lost or duplicated
- Test item locking during count

#### 6. Test Concurrent Adjustments
- Launch multiple adjustment requests simultaneously
- Verify serialization of approvals
- Test no duplicate adjustments processed
- Test proper queuing

#### 7. Test Database Lock Timeouts
- Test behavior when lock cannot be acquired
- Verify appropriate error returned (not silent failure)
- Test retry logic if implemented
- Test `nowait=True` option handling

#### 8. Simulate Real-World Scenarios
- Scenario: POS sales + online orders + warehouse transfers all at once
- Scenario: Multiple stock takes in different warehouses
- Scenario: Batch imports during active operations
- Verify data consistency in all scenarios

### Validation Checklist
- [ ] Race conditions don't corrupt data
- [ ] Locking prevents concurrent issues
- [ ] Deadlocks don't occur
- [ ] Timeouts handled gracefully
- [ ] Stock totals always accurate
- [ ] No phantom inventory created

---

## Task 91: Write Inventory Module Documentation

**Complexity:** Medium | **Time Estimate:** 45 min

### Objective
Create comprehensive technical documentation for the inventory module covering models, services, and APIs.

### Instructions

#### 1. Create Documentation Structure
- Create `docs/inventory/` directory
- Files:
  - `index.md` - overview and navigation
  - `models.md` - model documentation
  - `services.md` - service layer documentation
  - `api.md` - API endpoint documentation
  - `architecture.md` - design decisions and patterns

#### 2. Document Models
- For each model (StockLevel, StockMovement, StockTake, etc.):
  - Purpose and use case
  - Field descriptions with data types
  - Relationships and foreign keys
  - Constraints and validations
  - Manager methods
  - Properties and calculated fields
- Include ERD diagrams showing relationships

#### 3. Document Services
- For each service (StockService, StockTakeService, etc.):
  - Purpose and responsibilities
  - Public methods with signatures
  - Parameters and return types
  - Usage examples with code snippets
  - Error handling
  - Transaction behavior
- Include service interaction diagrams

#### 4. Document API Endpoints
- For each endpoint:
  - URL pattern and HTTP method
  - Request parameters and body schema
  - Response format and status codes
  - Example requests and responses
  - Authentication requirements
  - Permission levels required
- Use OpenAPI/Swagger format if possible

#### 5. Document Architecture Decisions
- Explain design patterns used:
  - Service layer pattern for business logic
  - Repository pattern vs direct ORM
  - Result objects for operation outcomes
- Document concurrency handling:
  - Locking strategy
  - Transaction isolation levels
- Document costing methods (FIFO, LIFO, WAC)

#### 6. Add Configuration Guide
- Document settings:
  - Stock operation permissions
  - Adjustment authorization thresholds
  - Negative stock allowed/prevented
  - Stock take configurations
- Environment variables
- Feature flags

#### 7. Include Integration Guide
- How to integrate with:
  - Order management (reservations)
  - Purchasing (stock in from POs)
  - Sales (stock out from orders)
  - Accounting (COGS calculation)
- Webhook event documentation
- Signal documentation

#### 8. Add Troubleshooting Section
- Common issues and solutions
- Performance optimization tips
- Debugging guide
- FAQ

### Validation Checklist
- [ ] All models documented
- [ ] All services documented
- [ ] All API endpoints documented
- [ ] Architecture explained
- [ ] Examples provided
- [ ] Diagrams included
- [ ] Configuration covered
- [ ] Integration guide complete

---

## Task 92: Create Inventory Management Guide

**Complexity:** Medium | **Time Estimate:** 40 min

### Objective
Create user-facing guide for warehouse staff and managers on using the inventory system.

### Instructions

#### 1. Create User Guide Structure
- Create `docs/user-guides/inventory-management.md`
- Sections:
  - Introduction
  - Getting Started
  - Daily Operations
  - Stock Takes
  - Reports
  - Troubleshooting
  - Best Practices

#### 2. Write Getting Started Guide
- Overview of inventory system features
- User roles and permissions:
  - Stock Clerk: daily operations, counting
  - Supervisor: adjustments, approvals
  - Warehouse Manager: stock takes, high-value adjustments
- Navigation and UI overview
- Key concepts: stock levels, movements, reservations

#### 3. Document Daily Operations
- **Receiving Stock (Stock In):**
  - How to record incoming shipments
  - Linking to purchase orders
  - Verifying quantities and quality
  - Printing receiving labels
  
- **Picking and Shipping (Stock Out):**
  - Processing orders
  - Picking lists
  - Recording outbound shipments
  - Handling backorders
  
- **Transferring Between Warehouses:**
  - Creating transfer requests
  - Dispatching transfers
  - Receiving transfers
  - Tracking in-transit stock

#### 4. Document Stock Take Process
- **Planning:**
  - Full vs partial vs cycle counts
  - Scheduling and preparation
  - Blind count benefits
  
- **Execution:**
  - Starting a stock take
  - Counting procedures
  - Using mobile app for counting
  - Recording counts
  - Handling discrepancies
  
- **Review and Completion:**
  - Reviewing variances
  - Approval workflows
  - Completing stock take
  - Generating reports

#### 5. Document Adjustments
- When to make adjustments
- Adjustment reasons:
  - Damage
  - Theft
  - Expiry
  - Found stock
  - Count errors
- Authorization levels
- Requesting approval for large adjustments
- Documentation requirements

#### 6. Document Reporting
- Available reports:
  - Stock level reports
  - Movement history
  - Stock take reports
  - Variance reports
  - ABC analysis
- How to generate reports
- Interpreting report data
- Exporting to Excel

#### 7. Add Best Practices
- Regular cycle counting schedule
- Proper receiving procedures
- Accurate record keeping
- Warehouse organization
- Loss prevention
- Inventory accuracy KPIs

#### 8. Include Screenshots and Examples
- Add screenshots of:
  - Stock level screen
  - Stock take interface
  - Mobile counting app
  - Reports
- Include example scenarios:
  - "How to handle damaged goods"
  - "How to count perishables"
  - "How to investigate missing stock"

### Validation Checklist
- [ ] All user roles covered
- [ ] All operations explained
- [ ] Stock take process clear
- [ ] Adjustments documented
- [ ] Reports explained
- [ ] Best practices included
- [ ] Screenshots added
- [ ] Examples helpful

---

## Expected Outcomes

After completing Tasks 89-92:

### Files Created
```
apps/inventory/stock/tests/
├── test_api.py                 # Task 89
└── test_concurrency.py         # Task 90

docs/inventory/
├── index.md
├── models.md                   # Task 91
├── services.md                 # Task 91
├── api.md                      # Task 91
└── architecture.md             # Task 91

docs/user-guides/
└── inventory-management.md     # Task 92
```

### Test Coverage Summary

```
apps/inventory/stock/
├── models.py         ████████████ 92%
├── services/         ███████████░ 87%
├── views.py          ████████████ 90%
├── serializers.py    ████████████ 91%
└── Overall           ███████████░ 89%
```

### Documentation Examples

**API Documentation Example:**
```markdown
## Stock Out Operation

Create a stock out movement to remove stock from warehouse.

**Endpoint:** `POST /api/stock-operations/stock_out/`

**Request Body:**
```json
{
  "product_id": 456,
  "warehouse_id": 789,
  "quantity": 50,
  "reason": "SALE",
  "reference_type": "ORDER",
  "reference_id": "ORD-1234",
  "notes": "Shipped to customer"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "movement": {
    "id": 9876,
    "type": "STOCK_OUT",
    "quantity": -50,
    "created_at": "2026-01-23T14:30:00Z"
  },
  "stock_level": {
    "quantity": 200,
    "available": 180,
    "reserved": 20
  }
}
```

**Errors:**
- `400` - Validation error (insufficient stock)
- `403` - Permission denied
- `404` - Product or warehouse not found
```

**User Guide Example:**
```markdown
## How to Perform a Stock Take

### Step 1: Create Stock Take
1. Navigate to Inventory > Stock Takes
2. Click "New Stock Take"
3. Select warehouse
4. Choose scope (Full or Partial)
5. If partial, select products or categories
6. Click "Create"

### Step 2: Start Counting
1. Open the created stock take
2. Click "Start Counting"
3. System populates all items with expected quantities
4. Assign counters if multiple people

### Step 3: Count Physical Stock
1. Use mobile app or web interface
2. For each item, enter counted quantity
3. Add notes for discrepancies
4. Mark item as counted

**Tip:** Use blind count mode for more accurate results
```

### Concurrency Test Example

```python
@pytest.mark.django_db(transaction=True)
def test_concurrent_stock_out_race_condition(stock_level):
    """Test that concurrent stock outs don't create negative stock"""
    from concurrent.futures import ThreadPoolExecutor
    import time
    
    stock_level.quantity = Decimal('50')
    stock_level.save()
    
    def stock_out_operation(amount):
        service = StockService()
        time.sleep(0.01)  # Small delay to increase race likelihood
        return service.stock_out(
            product=stock_level.product,
            warehouse=stock_level.warehouse,
            quantity=Decimal(str(amount)),
            user=stock_level.tenant.users.first()
        )
    
    # Try to remove more stock than available concurrently
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(stock_out_operation, 10) for _ in range(10)]
        results = [f.result() for f in futures]
    
    # Count successes and failures
    successes = sum(1 for r in results if r.success)
    failures = sum(1 for r in results if not r.success)
    
    # Should be 5 successes (50/10=5) and 5 failures
    assert successes == 5
    assert failures == 5
    
    stock_level.refresh_from_db()
    assert stock_level.quantity == Decimal('0')  # Exactly 0, not negative
```

---

## Progress Tracking

- [ ] Task 89: API endpoint tests with authentication
- [ ] Task 90: Concurrency and thread-safety tests
- [ ] Task 91: Technical module documentation
- [ ] Task 92: User guide for inventory management

**Group F Status:** Complete  
**SubPhase-09 Status:** Complete  
**All 92 Tasks Documented:** ✓
