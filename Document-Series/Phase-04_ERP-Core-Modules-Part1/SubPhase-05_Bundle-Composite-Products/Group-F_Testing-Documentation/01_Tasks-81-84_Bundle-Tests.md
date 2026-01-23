# Tasks 81-84: Bundle Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Serializers-Views/](../Group-E_Serializers-Views/)
- **→ Next Document:** [02_Tasks-85-88_BOM-Tests.md](02_Tasks-85-88_BOM-Tests.md)

---

## Document Overview

This document creates comprehensive test suites for bundle models, services, and API endpoints. Tests cover model creation, stock availability, pricing calculations, API CRUD operations, and tenant isolation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create test_bundle_models.py | Low | 3 min |
| 82 | Bundle model tests | High | 20 min |
| 83 | Bundle service tests | High | 20 min |
| 84 | Bundle API tests | High | 20 min |

---

## Task 81: Create test_bundle_models.py

### Overview
Create test file for bundle model tests.

### Dependencies
- Task 80: Update urls.py

### Instructions

1. **Create file**
   - Path: tests/test_bundle_models.py

2. **Add imports**
   - Django test classes
   - pytest fixtures
   - Bundle models
   - Services
   - Factories (if using)

3. **Add base test class**
   - Inherit from TenantTestCase
   - Set up test tenant
   - Create test data fixtures

4. **Add docstring**

### Test File Structure
```python
from django.test import TestCase, TransactionTestCase
from django_tenants.test.cases import TenantTestCase
import pytest
from decimal import Decimal

from apps.products.models import ProductBundle, BundleItem
from apps.products.services.bundle_services import BundleStockService, BundlePricingService
```

### Expected Outcome
Test file ready for bundle tests.

### Verification Checklist
- [ ] File created
- [ ] Imports added
- [ ] Base class defined

---

## Task 82: Bundle Model Tests

### Overview
Test bundle and bundle item model functionality.

### Dependencies
- Task 81: Create test_bundle_models.py

### Instructions

1. **Test bundle creation**
   - Create ProductBundle
   - Verify fields saved correctly
   - Test bundle types (FIXED, DYNAMIC, HYBRID)

2. **Test bundle item creation**
   - Create BundleItem
   - Verify FK relationships
   - Test quantity validation
   - Test optional items

3. **Test bundle manager**
   - Test active() method
   - Test available() method
   - Test with_items() method
   - Verify query optimization

4. **Test bundle properties**
   - Test item_count property
   - Test calculated_price property
   - Test final_price property

5. **Test discount calculations**
   - Test PERCENTAGE discount
   - Test FIXED discount
   - Test edge cases (100% off, invalid values)

6. **Test validation**
   - Test negative quantity rejection
   - Test negative discount rejection
   - Test percentage > 100 rejection

### Test Cases Structure
```python
class ProductBundleModelTest(TenantTestCase):
    
    def setUp(self):
        # Create test products
        # Create test bundle
        pass
    
    def test_create_bundle_fixed_price(self):
        # Test FIXED bundle creation
        pass
    
    def test_create_bundle_dynamic_price(self):
        # Test DYNAMIC bundle creation
        pass
    
    def test_bundle_item_relationships(self):
        # Test bundle-item FK
        pass
    
    def test_bundle_manager_active(self):
        # Test active() filter
        pass
    
    def test_discount_percentage(self):
        # Test percentage discount
        pass
    
    def test_discount_fixed(self):
        # Test fixed discount
        pass
    
    def test_item_count_property(self):
        # Test item count calculation
        pass
    
    def test_calculated_price(self):
        # Test price calculation
        pass
    
    def test_negative_quantity_validation(self):
        # Test quantity validation
        pass
```

### Expected Outcome
All bundle model functionality tested.

### Verification Checklist
- [ ] Creation tests pass
- [ ] Manager tests pass
- [ ] Property tests pass
- [ ] Validation tests pass
- [ ] Discount tests pass

---

## Task 83: Bundle Service Tests

### Overview
Test bundle stock and pricing services.

### Dependencies
- Task 82: Bundle model tests

### Instructions

1. **Test BundleStockService**
   - Test get_available_stock() method
   - Test check_availability() method
   - Test get_limiting_item() method
   - Test reserve_stock() method

2. **Test stock scenarios**
   - All items in stock
   - One item out of stock
   - Multiple items low stock
   - Optional items out of stock

3. **Test BundlePricingService**
   - Test calculate_fixed_price()
   - Test calculate_dynamic_price()
   - Test apply_discount()
   - Test get_savings()

4. **Test pricing scenarios**
   - FIXED bundle pricing
   - DYNAMIC bundle pricing
   - HYBRID bundle pricing
   - With percentage discount
   - With fixed discount
   - Zero discount

5. **Test edge cases**
   - Empty bundle
   - Bundle with variants
   - Bundle with optional items
   - Negative stock
   - Zero prices

### Test Structure
```python
class BundleStockServiceTest(TenantTestCase):
    
    def setUp(self):
        # Create bundle with items
        # Set stock levels
        pass
    
    def test_get_available_stock_all_available(self):
        # All items in stock
        pass
    
    def test_get_available_stock_limited(self):
        # One item limits bundle stock
        pass
    
    def test_check_availability_true(self):
        # Stock available for quantity
        pass
    
    def test_check_availability_false(self):
        # Insufficient stock
        pass
    
    def test_get_limiting_item(self):
        # Identify limiting item
        pass
    
    def test_reserve_stock(self):
        # Reserve stock for bundle
        pass

class BundlePricingServiceTest(TenantTestCase):
    
    def test_fixed_price_no_discount(self):
        # Fixed price without discount
        pass
    
    def test_dynamic_price_calculation(self):
        # Sum of item prices
        pass
    
    def test_apply_percentage_discount(self):
        # Apply percentage discount
        pass
    
    def test_apply_fixed_discount(self):
        # Apply fixed discount
        pass
    
    def test_get_savings(self):
        # Calculate savings amount
        pass
```

### Expected Outcome
All service methods tested with various scenarios.

### Verification Checklist
- [ ] Stock service tests pass
- [ ] Pricing service tests pass
- [ ] Edge cases covered
- [ ] All scenarios tested

---

## Task 84: Bundle API Tests

### Overview
Test bundle API endpoints and ViewSet functionality.

### Dependencies
- Task 83: Bundle service tests

### Instructions

1. **Test list endpoint**
   - GET /api/v1/bundles/
   - Test pagination
   - Test filtering
   - Test search
   - Test ordering

2. **Test create endpoint**
   - POST /api/v1/bundles/
   - Test valid creation
   - Test validation errors
   - Test nested item creation

3. **Test retrieve endpoint**
   - GET /api/v1/bundles/{id}/
   - Test detail serialization
   - Test nested items

4. **Test update endpoint**
   - PUT/PATCH /api/v1/bundles/{id}/
   - Test full update
   - Test partial update
   - Test nested item updates

5. **Test delete endpoint**
   - DELETE /api/v1/bundles/{id}/
   - Test soft delete if implemented
   - Test cascade behavior

6. **Test custom actions**
   - GET /api/v1/bundles/{id}/availability/
   - Test stock check endpoint
   - Test price calculation endpoint

7. **Test permissions**
   - Test unauthenticated access denied
   - Test tenant isolation
   - Test role-based permissions

8. **Test tenant isolation**
   - Create bundles in different tenants
   - Verify no cross-tenant access

### Test Structure
```python
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

class BundleAPITest(TenantTestCase, APITestCase):
    
    def setUp(self):
        # Set up API client
        # Create test user
        # Authenticate
        pass
    
    def test_list_bundles(self):
        # GET /api/v1/bundles/
        pass
    
    def test_create_bundle(self):
        # POST /api/v1/bundles/
        pass
    
    def test_retrieve_bundle(self):
        # GET /api/v1/bundles/{id}/
        pass
    
    def test_update_bundle(self):
        # PUT /api/v1/bundles/{id}/
        pass
    
    def test_delete_bundle(self):
        # DELETE /api/v1/bundles/{id}/
        pass
    
    def test_bundle_availability_action(self):
        # GET /api/v1/bundles/{id}/availability/
        pass
    
    def test_filter_by_bundle_type(self):
        # Test filterset
        pass
    
    def test_search_by_product_name(self):
        # Test search
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
  - Filtered by bundle_type
  - Searched by name
  - Ordered by created_at

Create Tests:
  - Valid bundle
  - Invalid data
  - Missing required fields
  - Nested items creation

Retrieve Tests:
  - Valid bundle ID
  - Invalid bundle ID
  - Detail serialization

Update Tests:
  - Full update (PUT)
  - Partial update (PATCH)
  - Update nested items
  - Invalid data

Delete Tests:
  - Valid delete
  - Delete non-existent

Custom Actions:
  - Availability check
  - Price calculation
  - Limiting item info

Permissions:
  - Unauthenticated
  - Wrong tenant
  - Insufficient role
```

### Expected Outcome
All API endpoints tested with success and error cases.

### Verification Checklist
- [ ] CRUD tests pass
- [ ] Custom action tests pass
- [ ] Permission tests pass
- [ ] Tenant isolation verified
- [ ] All status codes correct

---

## Summary of Tasks 81-84

### What Was Accomplished
- Created bundle test file structure
- Implemented model tests for ProductBundle and BundleItem
- Implemented service tests for stock and pricing
- Implemented API tests for all endpoints
- Verified tenant isolation

### Test Coverage Areas
```
Models:
  - Bundle creation (FIXED, DYNAMIC, HYBRID)
  - Bundle item relationships
  - Manager methods
  - Properties and calculations
  - Discount logic
  - Validation rules

Services:
  - Stock availability checking
  - Limiting item identification
  - Stock reservation
  - Fixed price calculation
  - Dynamic price calculation
  - Discount application
  - Savings calculation

API:
  - List with pagination/filtering
  - Create with validation
  - Retrieve with details
  - Update (full and partial)
  - Delete
  - Custom availability action
  - Permissions and tenant isolation
```

### Test Execution
```bash
# Run all bundle tests
pytest apps/products/tests/test_bundle_models.py -v

# Run specific test class
pytest apps/products/tests/test_bundle_models.py::ProductBundleModelTest -v

# Run with coverage
pytest apps/products/tests/test_bundle_models.py --cov=apps.products.models.bundle --cov-report=html
```

---

## Notes for Developers

### Testing Best Practices
- Use TenantTestCase for tenant-aware tests
- Create fixtures in setUp() method
- Clean up test data in tearDown()
- Use descriptive test names
- Test both success and failure cases

### Test Data
- Use factories for consistent data
- Avoid hardcoded IDs
- Create minimal required data
- Use realistic values (prices in LKR)

### Assertions
- Use assertEqual for exact matches
- Use assertTrue/assertFalse for booleans
- Use assertIsNone/assertIsNotNone for nulls
- Use assertRaises for exceptions
- Use assertContains for API responses

### Performance
- Use setUpTestData() for read-only data
- Minimize database queries
- Use bulk_create when possible
- Profile slow tests

### Tenant Testing
- Always use TenantTestCase
- Test cross-tenant isolation
- Verify schema separation
- Test tenant-specific data

### API Testing
- Use APIClient for requests
- Set authentication headers
- Test all HTTP methods
- Verify response structure
- Check status codes

---
