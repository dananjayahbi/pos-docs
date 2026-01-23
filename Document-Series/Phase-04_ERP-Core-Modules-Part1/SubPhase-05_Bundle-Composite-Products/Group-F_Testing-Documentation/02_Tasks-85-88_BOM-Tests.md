# Tasks 85-88: BOM Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-84_Bundle-Tests.md](01_Tasks-81-84_Bundle-Tests.md)
- **→ Next Document:** [03_Tasks-89-90_Documentation-Integration.md](03_Tasks-89-90_Documentation-Integration.md)

---

## Document Overview

This document creates comprehensive test suites for Bill of Materials (BOM) models, cost calculation services, manufacturing stock services, and API endpoints. Tests cover BOM creation, cost calculations, material availability, and tenant isolation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create test_bom_models.py | Low | 3 min |
| 86 | BOM model tests | High | 20 min |
| 87 | Manufacturing service tests | High | 20 min |
| 88 | BOM API tests | High | 20 min |

---

## Task 85: Create test_bom_models.py

### Overview
Create test file for BOM model tests.

### Dependencies
- Task 84: Bundle API tests

### Instructions

1. **Create file**
   - Path: tests/test_bom_models.py

2. **Add imports**
   - Django test classes
   - TenantTestCase
   - BOM models
   - Services
   - Decimal for cost calculations

3. **Add base test class**
   - Inherit from TenantTestCase
   - Set up test tenant
   - Create test products (raw materials and finished)
   - Create test BOMs

4. **Add docstring**

### Test File Structure
```python
from django.test import TestCase
from django_tenants.test.cases import TenantTestCase
import pytest
from decimal import Decimal

from apps.products.models import BillOfMaterials, BOMItem, Product
from apps.products.services.manufacturing_services import (
    CostCalculationService,
    ManufacturingStockService
)
```

### Expected Outcome
Test file ready for BOM tests.

### Verification Checklist
- [ ] File created
- [ ] Imports added
- [ ] Base class defined

---

## Task 86: BOM Model Tests

### Overview
Test BOM and BOMItem model functionality.

### Dependencies
- Task 85: Create test_bom_models.py

### Instructions

1. **Test BOM creation**
   - Create BillOfMaterials
   - Verify fields saved correctly
   - Test version field
   - Test is_active flag

2. **Test BOM item creation**
   - Create BOMItem
   - Verify FK relationships
   - Test quantity and unit of measure
   - Test wastage_percent
   - Test is_critical flag
   - Test substitute materials

3. **Test BOM manager**
   - Test active() method
   - Test with_items() method
   - Test for_product() method (if implemented)
   - Verify query optimization

4. **Test BOM versioning**
   - Create multiple versions for same product
   - Test active version retrieval
   - Test version history

5. **Test validation**
   - Test negative quantity rejection
   - Test negative wastage rejection
   - Test wastage > 100% rejection
   - Test circular BOM references (if applicable)

6. **Test cascading behavior**
   - Delete BOM, verify items deleted
   - Delete product, verify BOM handling

### Test Cases Structure
```python
class BillOfMaterialsModelTest(TenantTestCase):
    
    def setUp(self):
        # Create finished product
        # Create raw materials
        # Create BOM
        pass
    
    def test_create_bom(self):
        # Test BOM creation
        pass
    
    def test_bom_item_relationships(self):
        # Test BOM-BOMItem FK
        pass
    
    def test_wastage_calculation(self):
        # Test wastage_percent application
        pass
    
    def test_critical_items(self):
        # Test is_critical flag
        pass
    
    def test_substitute_materials(self):
        # Test substitute FK
        pass
    
    def test_bom_manager_active(self):
        # Test active() filter
        pass
    
    def test_bom_versioning(self):
        # Test multiple versions
        pass
    
    def test_negative_quantity_validation(self):
        # Test quantity validation
        pass
    
    def test_wastage_validation(self):
        # Test wastage validation
        pass
```

### Expected Outcome
All BOM model functionality tested.

### Verification Checklist
- [ ] Creation tests pass
- [ ] Manager tests pass
- [ ] Versioning tests pass
- [ ] Validation tests pass
- [ ] Relationship tests pass

---

## Task 87: Manufacturing Service Tests

### Overview
Test cost calculation and manufacturing stock services.

### Dependencies
- Task 86: BOM model tests

### Instructions

1. **Test CostCalculationService**
   - Test calculate_material_cost()
   - Test calculate_with_wastage()
   - Test calculate_labor_cost()
   - Test calculate_overhead()
   - Test calculate_total_cost()
   - Test calculate_unit_cost()
   - Test suggest_selling_price()

2. **Test cost scenarios**
   - Simple BOM with 2-3 items
   - BOM with wastage
   - BOM with zero wastage
   - BOM with high wastage
   - BOM with labor costs
   - BOM with overhead

3. **Test ManufacturingStockService**
   - Test check_raw_materials()
   - Test get_producible_quantity()
   - Test identify_missing_materials()

4. **Test stock scenarios**
   - All materials available
   - One material out of stock
   - Multiple materials low stock
   - Calculate max producible units
   - Handle optional materials

5. **Test edge cases**
   - Empty BOM
   - Zero-cost materials
   - Infinite stock materials
   - Negative stock (shouldn't happen but test)
   - Division by zero handling

### Test Structure
```python
class CostCalculationServiceTest(TenantTestCase):
    
    def setUp(self):
        # Create BOM with items
        # Set material costs
        pass
    
    def test_calculate_material_cost_no_wastage(self):
        # Sum of material costs
        pass
    
    def test_calculate_material_cost_with_wastage(self):
        # Include wastage in cost
        pass
    
    def test_calculate_labor_cost(self):
        # Calculate labor component
        pass
    
    def test_calculate_overhead(self):
        # Calculate overhead percentage
        pass
    
    def test_calculate_total_cost(self):
        # Material + labor + overhead
        pass
    
    def test_calculate_unit_cost(self):
        # Total cost / yield quantity
        pass
    
    def test_suggest_selling_price(self):
        # Apply markup to unit cost
        pass
    
    def test_zero_yield_quantity(self):
        # Handle edge case
        pass

class ManufacturingStockServiceTest(TenantTestCase):
    
    def test_check_raw_materials_all_available(self):
        # All materials in stock
        pass
    
    def test_check_raw_materials_missing(self):
        # Some materials out of stock
        pass
    
    def test_get_producible_quantity_unlimited(self):
        # Ample stock for all
        pass
    
    def test_get_producible_quantity_limited(self):
        # Limited by one material
        pass
    
    def test_identify_missing_materials(self):
        # List out-of-stock items
        pass
```

### Cost Calculation Example
```
Material A: Rs. 50.00 x 2 units = Rs. 100.00
Material B: Rs. 30.00 x 3 units = Rs. 90.00
Material C: Rs. 20.00 x 1 unit (10% wastage) = Rs. 22.00

Material Cost: Rs. 212.00
Labor Cost: Rs. 50.00 (fixed per batch)
Overhead: Rs. 26.20 (10% of material + labor)
Total Cost: Rs. 288.20
Yield: 10 units
Unit Cost: Rs. 28.82
Suggested Price: Rs. 43.23 (50% markup)
```

### Expected Outcome
All service methods tested with cost calculations verified.

### Verification Checklist
- [ ] Cost service tests pass
- [ ] Stock service tests pass
- [ ] Calculations accurate
- [ ] Edge cases handled
- [ ] Sri Lankan currency format

---

## Task 88: BOM API Tests

### Overview
Test BOM API endpoints and ViewSet functionality.

### Dependencies
- Task 87: Manufacturing service tests

### Instructions

1. **Test list endpoint**
   - GET /api/v1/bom/
   - Test pagination
   - Test filtering by product
   - Test filtering by is_active
   - Test search

2. **Test create endpoint**
   - POST /api/v1/bom/
   - Test valid creation
   - Test validation errors
   - Test nested BOMItem creation
   - Test version auto-increment

3. **Test retrieve endpoint**
   - GET /api/v1/bom/{id}/
   - Test detail serialization
   - Test nested items
   - Test cost fields included

4. **Test update endpoint**
   - PUT/PATCH /api/v1/bom/{id}/
   - Test full update
   - Test partial update
   - Test nested item updates
   - Test version changes

5. **Test delete endpoint**
   - DELETE /api/v1/bom/{id}/
   - Test soft delete (is_active=False)
   - Test cascade behavior

6. **Test custom actions**
   - GET /api/v1/bom/{id}/cost/
   - GET /api/v1/bom/{id}/producible/
   - Test cost calculation endpoint
   - Test material check endpoint

7. **Test permissions**
   - Test unauthenticated access denied
   - Test tenant isolation
   - Test role-based permissions

8. **Test tenant isolation**
   - Create BOMs in different tenants
   - Verify no cross-tenant access
   - Test material references stay within tenant

### Test Structure
```python
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

class BOMAPITest(TenantTestCase, APITestCase):
    
    def setUp(self):
        # Set up API client
        # Create test user
        # Authenticate
        # Create test products
        pass
    
    def test_list_boms(self):
        # GET /api/v1/bom/
        pass
    
    def test_create_bom(self):
        # POST /api/v1/bom/
        pass
    
    def test_retrieve_bom(self):
        # GET /api/v1/bom/{id}/
        pass
    
    def test_update_bom(self):
        # PUT /api/v1/bom/{id}/
        pass
    
    def test_delete_bom(self):
        # DELETE /api/v1/bom/{id}/
        pass
    
    def test_cost_calculation_action(self):
        # GET /api/v1/bom/{id}/cost/
        pass
    
    def test_producible_quantity_action(self):
        # GET /api/v1/bom/{id}/producible/
        pass
    
    def test_filter_by_product(self):
        # Test filterset
        pass
    
    def test_unauthorized_access(self):
        # Test permission denied
        pass
    
    def test_tenant_isolation(self):
        # Test cross-tenant access denied
        pass
```

### API Test Scenarios
```
List Tests:
  - Empty list
  - Paginated list
  - Filtered by product
  - Filtered by is_active
  - Ordered by version

Create Tests:
  - Valid BOM with items
  - Invalid data
  - Missing required fields
  - Nested items creation
  - Duplicate version handling

Retrieve Tests:
  - Valid BOM ID
  - Invalid BOM ID
  - Cost fields present
  - Nested items included

Update Tests:
  - Update BOM fields
  - Update nested items
  - Add new items
  - Remove items
  - Change version

Delete Tests:
  - Valid delete (soft)
  - Delete non-existent
  - Cascade behavior

Custom Actions:
  - Cost calculation
  - Material availability
  - Producible quantity
  - Suggested price

Permissions:
  - Unauthenticated
  - Wrong tenant
  - Insufficient role
  - Read-only vs write
```

### Expected Outcome
All BOM API endpoints tested with success and error cases.

### Verification Checklist
- [ ] CRUD tests pass
- [ ] Custom action tests pass
- [ ] Cost calculations verified
- [ ] Permission tests pass
- [ ] Tenant isolation verified

---

## Summary of Tasks 85-88

### What Was Accomplished
- Created BOM test file structure
- Implemented model tests for BillOfMaterials and BOMItem
- Implemented service tests for cost calculation and manufacturing stock
- Implemented API tests for all endpoints
- Verified tenant isolation for BOMs

### Test Coverage Areas
```
Models:
  - BOM creation with versioning
  - BOM item relationships
  - Wastage calculations
  - Critical items and substitutes
  - Manager methods
  - Validation rules

Services:
  - Material cost calculation
  - Wastage application
  - Labor cost calculation
  - Overhead calculation
  - Total and unit cost
  - Selling price suggestion
  - Raw material checking
  - Producible quantity calculation

API:
  - List with filtering
  - Create with nested items
  - Retrieve with cost data
  - Update (full and partial)
  - Delete (soft)
  - Cost calculation action
  - Producible quantity action
  - Permissions and tenant isolation
```

### Test Execution
```bash
# Run all BOM tests
pytest apps/products/tests/test_bom_models.py -v

# Run specific test class
pytest apps/products/tests/test_bom_models.py::BillOfMaterialsModelTest -v

# Run with coverage
pytest apps/products/tests/test_bom_models.py --cov=apps.products.models.bom --cov-report=html

# Run all manufacturing tests
pytest apps/products/tests/test_bom_models.py::CostCalculationServiceTest -v
pytest apps/products/tests/test_bom_models.py::ManufacturingStockServiceTest -v
```

---

## Notes for Developers

### Cost Calculation Testing
- Use Decimal for all monetary values
- Test with realistic Sri Lankan prices (LKR)
- Verify precision (2 decimal places)
- Test rounding behavior
- Compare calculated vs expected costs

### Manufacturing Testing
- Set up realistic stock levels
- Test with various yield quantities
- Verify producible quantity logic
- Test material limitation scenarios
- Handle zero/negative stock gracefully

### BOM Versioning Testing
- Create multiple versions per product
- Test version history retrieval
- Verify active version logic
- Test version switching

### Tenant Isolation Critical
- BOMs reference products within tenant
- Materials must be from same tenant
- Cost calculations tenant-specific
- Verify no cross-tenant material access

### Performance Testing
- Test with large BOMs (50+ items)
- Profile cost calculation speed
- Optimize queries with select_related
- Use bulk operations for BOMItems

### Edge Cases
- Empty BOMs (valid?)
- BOMs with one item
- Zero-cost materials
- 100% wastage
- Infinite producible quantity
- Circular dependencies (product references itself)

---
