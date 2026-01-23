# Tasks 93-95: API & Tenant Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 93, 94, 95

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-87-92_Model-Unit-Tests.md](01_Tasks-87-92_Model-Unit-Tests.md)
- **→ Next Document:** [03_Tasks-96-98_Documentation-Integration.md](03_Tasks-96-98_Documentation-Integration.md)

---

## Document Overview

This document covers API endpoint testing and multi-tenant isolation verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 93 | Test API Endpoints | High |
| 94 | Test Tenant Isolation | High |
| 95 | Test API Permissions | Medium |

---

## Task 93: Test API Endpoints

### Overview
Create comprehensive tests for all products API endpoints.

### Dependencies
- Task 92: Test QuerySet Methods

### Instructions

1. **Create test class in test_api.py**
   - Inherit from TenantTestCase
   - Use APIClient for requests
   - Set up authentication

2. **Test Brand API**
   - Test list brands
   - Test create brand
   - Test retrieve brand
   - Test update brand
   - Test delete brand
   - Test filtering and search

3. **Test TaxClass API**
   - Test CRUD operations
   - Test filtering by is_default
   - Test validation

4. **Test UnitOfMeasure API**
   - Test CRUD operations
   - Test filtering

5. **Test Product API**
   - Test list products
   - Test create product (with auto-SKU)
   - Test retrieve product
   - Test update product
   - Test delete product
   - Test custom actions (published, featured)
   - Test filtering (category, brand, status, type)
   - Test search
   - Test pagination

### Test Coverage Requirements

**Brand API Tests:**
1. `test_list_brands` - GET /brands/
2. `test_create_brand` - POST /brands/
3. `test_retrieve_brand` - GET /brands/{id}/
4. `test_update_brand` - PUT /brands/{id}/
5. `test_partial_update_brand` - PATCH /brands/{id}/
6. `test_delete_brand` - DELETE /brands/{id}/
7. `test_filter_brands_active` - Filter is_active
8. `test_search_brands` - Search by name

**TaxClass API Tests:**
1. `test_list_tax_classes`
2. `test_create_tax_class`
3. `test_retrieve_tax_class`
4. `test_update_tax_class`
5. `test_delete_tax_class`
6. `test_filter_default_tax_class`

**UnitOfMeasure API Tests:**
1. `test_list_units`
2. `test_create_unit`
3. `test_retrieve_unit`
4. `test_update_unit`
5. `test_delete_unit`

**Product API Tests:**
1. `test_list_products` - GET /products/
2. `test_create_product` - POST /products/
3. `test_create_product_auto_sku` - Verify SKU generation
4. `test_retrieve_product` - GET /products/{id}/
5. `test_update_product` - PUT /products/{id}/
6. `test_partial_update_product` - PATCH /products/{id}/
7. `test_delete_product` - DELETE /products/{id}/
8. `test_published_products` - GET /products/published/
9. `test_featured_products` - GET /products/featured/
10. `test_filter_by_category`
11. `test_filter_by_brand`
12. `test_filter_by_product_type`
13. `test_filter_by_status`
14. `test_search_products`
15. `test_product_pagination`

### Expected Test Structure
```python
# test_api.py
"""
API endpoint tests for products app.
"""

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django_tenants.test.cases import TenantTestCase

from apps.products.models import Brand, TaxClass, UnitOfMeasure, Product
from apps.categories.models import Category
from apps.users.models import User


class BrandAPITest(TenantTestCase):
    """API tests for Brand endpoints."""
    
    def setUp(self):
        """Set up test client and fixtures."""
        # Create APIClient
        # Create test user
        # Authenticate client
        # Create test brand
        pass
    
    def test_list_brands(self):
        """Test GET /brands/ returns brand list."""
        # Send GET request to /api/v1/products/brands/
        # Assert status 200
        # Assert response contains brands
        # Assert correct serializer data
        pass
    
    def test_create_brand(self):
        """Test POST /brands/ creates new brand."""
        # Prepare brand data
        # Send POST request
        # Assert status 201
        # Assert brand created in database
        # Assert slug auto-generated
        pass
    
    def test_retrieve_brand(self):
        """Test GET /brands/{id}/ returns brand detail."""
        # Send GET request with brand ID
        # Assert status 200
        # Assert correct brand data returned
        pass
    
    def test_update_brand(self):
        """Test PUT /brands/{id}/ updates brand."""
        # Prepare updated data
        # Send PUT request
        # Assert status 200
        # Assert brand updated in database
        pass
    
    def test_partial_update_brand(self):
        """Test PATCH /brands/{id}/ partially updates brand."""
        # Prepare partial data
        # Send PATCH request
        # Assert status 200
        # Assert only specified fields updated
        pass
    
    def test_delete_brand(self):
        """Test DELETE /brands/{id}/ deletes brand."""
        # Send DELETE request
        # Assert status 204
        # Assert brand deleted from database
        pass
    
    def test_filter_brands_active(self):
        """Test filtering brands by is_active."""
        # Create active and inactive brands
        # Send GET with ?is_active=true
        # Assert only active brands returned
        pass
    
    def test_search_brands(self):
        """Test searching brands by name."""
        # Create brands with different names
        # Send GET with ?search=keyword
        # Assert matching brands returned
        pass


class TaxClassAPITest(TenantTestCase):
    """API tests for TaxClass endpoints."""
    
    def setUp(self):
        """Set up test client and fixtures."""
        pass
    
    def test_list_tax_classes(self):
        """Test GET /tax-classes/ returns list."""
        pass
    
    def test_create_tax_class(self):
        """Test POST /tax-classes/ creates tax class."""
        pass
    
    def test_retrieve_tax_class(self):
        """Test GET /tax-classes/{id}/ returns detail."""
        pass
    
    def test_update_tax_class(self):
        """Test PUT /tax-classes/{id}/ updates tax class."""
        pass
    
    def test_delete_tax_class(self):
        """Test DELETE /tax-classes/{id}/ deletes."""
        pass
    
    def test_filter_default_tax_class(self):
        """Test filtering by is_default."""
        # Create default and non-default
        # Filter by is_default=true
        # Assert only default returned
        pass


class UnitOfMeasureAPITest(TenantTestCase):
    """API tests for UnitOfMeasure endpoints."""
    
    def setUp(self):
        """Set up test client and fixtures."""
        pass
    
    def test_list_units(self):
        """Test GET /units/ returns list."""
        pass
    
    def test_create_unit(self):
        """Test POST /units/ creates unit."""
        pass
    
    def test_retrieve_unit(self):
        """Test GET /units/{id}/ returns detail."""
        pass
    
    def test_update_unit(self):
        """Test PUT /units/{id}/ updates unit."""
        pass
    
    def test_delete_unit(self):
        """Test DELETE /units/{id}/ deletes."""
        pass


class ProductAPITest(TenantTestCase):
    """API tests for Product endpoints."""
    
    def setUp(self):
        """Set up test client and fixtures."""
        # Create APIClient
        # Create user and authenticate
        # Create category, brand, tax class, UOM
        # Create test products
        pass
    
    def test_list_products(self):
        """Test GET /products/ returns product list."""
        # Send GET request
        # Assert status 200
        # Assert products returned
        # Assert uses ProductListSerializer
        pass
    
    def test_create_product(self):
        """Test POST /products/ creates new product."""
        # Prepare product data
        # Send POST request
        # Assert status 201
        # Assert product created
        # Assert slug auto-generated
        pass
    
    def test_create_product_auto_sku(self):
        """Test SKU auto-generates when not provided."""
        # Create product without SKU
        # Assert SKU generated
        # Assert SKU format correct (PRD-CATEGORY-00001)
        pass
    
    def test_retrieve_product(self):
        """Test GET /products/{id}/ returns detail."""
        # Send GET request
        # Assert status 200
        # Assert uses ProductDetailSerializer
        # Assert nested data present (category, brand)
        pass
    
    def test_update_product(self):
        """Test PUT /products/{id}/ updates product."""
        # Prepare updated data
        # Send PUT request
        # Assert status 200
        # Assert product updated
        pass
    
    def test_partial_update_product(self):
        """Test PATCH /products/{id}/ partial update."""
        # Prepare partial data
        # Send PATCH request
        # Assert status 200
        # Assert only specified fields updated
        pass
    
    def test_delete_product(self):
        """Test DELETE /products/{id}/ deletes product."""
        # Send DELETE request
        # Assert status 204
        # Assert product deleted
        pass
    
    def test_published_products(self):
        """Test GET /products/published/ returns published."""
        # Create active + webstore visible products
        # Create draft products
        # Send GET to /products/published/
        # Assert only published returned
        pass
    
    def test_featured_products(self):
        """Test GET /products/featured/ returns featured."""
        # Create featured products
        # Send GET to /products/featured/
        # Assert only featured returned
        pass
    
    def test_filter_by_category(self):
        """Test filtering products by category."""
        # Create products in different categories
        # Filter by category ID
        # Assert only products in that category
        pass
    
    def test_filter_by_brand(self):
        """Test filtering products by brand."""
        # Create products with different brands
        # Filter by brand ID
        # Assert only products with that brand
        pass
    
    def test_filter_by_product_type(self):
        """Test filtering by product_type."""
        # Create SIMPLE and VARIABLE products
        # Filter by product_type=simple
        # Assert only SIMPLE returned
        pass
    
    def test_filter_by_status(self):
        """Test filtering by status."""
        # Create products with different statuses
        # Filter by status=active
        # Assert only ACTIVE returned
        pass
    
    def test_search_products(self):
        """Test searching products."""
        # Create products with different names
        # Search by keyword
        # Assert matching products returned
        # Test search by SKU
        # Test search by description
        pass
    
    def test_product_pagination(self):
        """Test product list pagination."""
        # Create 30 products
        # GET without pagination params
        # Assert paginated response
        # Assert page_size applied
        # Test page 2
        pass
```

### Verification Checklist
- [ ] All Brand API tests created
- [ ] All TaxClass API tests created
- [ ] All UnitOfMeasure API tests created
- [ ] All Product API tests created
- [ ] CRUD operations tested
- [ ] Custom actions tested
- [ ] Filtering tested
- [ ] Search tested
- [ ] Pagination tested
- [ ] All tests pass

---

## Task 94: Test Tenant Isolation

### Overview
Verify that products are properly isolated between tenants.

### Dependencies
- Task 93: Test API Endpoints

### Instructions

1. **Create test class**
   - Create TenantIsolationTest in test_api.py
   - Set up multiple tenants

2. **Test data isolation**
   - Create products in tenant 1
   - Create products in tenant 2
   - Switch to tenant 1 - verify only tenant 1 products
   - Switch to tenant 2 - verify only tenant 2 products

3. **Test API isolation**
   - Authenticate as tenant 1 user
   - Request products - verify tenant 1 only
   - Authenticate as tenant 2 user
   - Request products - verify tenant 2 only

4. **Test cross-tenant access prevention**
   - Try to access tenant 2 product from tenant 1
   - Verify 404 or permission denied

### Test Coverage Requirements

**Test Cases:**
1. `test_products_isolated_by_tenant` - Data isolation
2. `test_brands_isolated_by_tenant` - Brand isolation
3. `test_api_tenant_isolation` - API isolation
4. `test_cannot_access_other_tenant_products` - Access prevention
5. `test_sku_unique_per_tenant` - SKU uniqueness per tenant

### Expected Test Structure
```python
class TenantIsolationTest(TenantTestCase):
    """Test multi-tenant data isolation."""
    
    def setUp(self):
        """Set up multiple tenants."""
        # Create tenant 1
        # Create tenant 2
        # Create products in each tenant
        pass
    
    def test_products_isolated_by_tenant(self):
        """Test products isolated between tenants."""
        # Switch to tenant 1
        # Query all products
        # Assert only tenant 1 products returned
        
        # Switch to tenant 2
        # Query all products
        # Assert only tenant 2 products returned
        pass
    
    def test_brands_isolated_by_tenant(self):
        """Test brands isolated between tenants."""
        # Create brands in both tenants
        # Verify isolation
        pass
    
    def test_api_tenant_isolation(self):
        """Test API respects tenant isolation."""
        # Authenticate as tenant 1 user
        # GET /products/
        # Assert only tenant 1 products
        
        # Authenticate as tenant 2 user
        # GET /products/
        # Assert only tenant 2 products
        pass
    
    def test_cannot_access_other_tenant_products(self):
        """Test cannot access other tenant's products."""
        # Get tenant 2 product ID
        # Authenticate as tenant 1 user
        # Try to GET /products/{tenant_2_id}/
        # Assert 404 returned
        pass
    
    def test_sku_unique_per_tenant(self):
        """Test SKU can be same across tenants."""
        # Create product in tenant 1 with SKU-001
        # Create product in tenant 2 with SKU-001
        # Assert both succeed (unique per tenant, not global)
        pass
```

### Verification Checklist
- [ ] Tenant isolation tests created
- [ ] Data isolation verified
- [ ] API isolation verified
- [ ] Cross-tenant access prevented
- [ ] All tests pass

---

## Task 95: Test API Permissions

### Overview
Test API endpoint permissions and authentication.

### Dependencies
- Task 94: Test Tenant Isolation

### Instructions

1. **Create test class**
   - Create PermissionTest in test_api.py
   - Set up users with different roles

2. **Test authentication required**
   - Test unauthenticated access denied
   - Test authenticated access allowed

3. **Test CRUD permissions**
   - Test who can create products
   - Test who can update products
   - Test who can delete products
   - Test who can read products

4. **Test role-based access**
   - Test admin permissions
   - Test manager permissions
   - Test staff permissions
   - Test readonly permissions

### Test Coverage Requirements

**Test Cases:**
1. `test_unauthenticated_access_denied` - Require authentication
2. `test_authenticated_can_list` - Authenticated can read
3. `test_create_permission_required` - Create requires permission
4. `test_update_permission_required` - Update requires permission
5. `test_delete_permission_required` - Delete requires permission
6. `test_admin_full_access` - Admin has full access
7. `test_readonly_user_cannot_modify` - Readonly cannot modify

### Expected Test Structure
```python
class PermissionTest(TenantTestCase):
    """Test API permissions and authentication."""
    
    def setUp(self):
        """Set up users with different permissions."""
        # Create admin user
        # Create manager user
        # Create readonly user
        # Create test product
        pass
    
    def test_unauthenticated_access_denied(self):
        """Test unauthenticated requests denied."""
        # Create unauthenticated client
        # Try to GET /products/
        # Assert 401 or 403
        pass
    
    def test_authenticated_can_list(self):
        """Test authenticated users can list products."""
        # Authenticate as any user
        # GET /products/
        # Assert 200
        pass
    
    def test_create_permission_required(self):
        """Test create requires proper permission."""
        # Authenticate as readonly user
        # Try to POST /products/
        # Assert 403
        
        # Authenticate as admin
        # POST /products/
        # Assert 201
        pass
    
    def test_update_permission_required(self):
        """Test update requires proper permission."""
        # Authenticate as readonly user
        # Try to PUT /products/{id}/
        # Assert 403
        
        # Authenticate as manager
        # PUT /products/{id}/
        # Assert 200
        pass
    
    def test_delete_permission_required(self):
        """Test delete requires proper permission."""
        # Authenticate as manager
        # Try to DELETE /products/{id}/
        # Assert 403
        
        # Authenticate as admin
        # DELETE /products/{id}/
        # Assert 204
        pass
    
    def test_admin_full_access(self):
        """Test admin has full CRUD access."""
        # Authenticate as admin
        # Test create, read, update, delete
        # Assert all succeed
        pass
    
    def test_readonly_user_cannot_modify(self):
        """Test readonly user cannot modify data."""
        # Authenticate as readonly user
        # Try create, update, delete
        # Assert all denied (403)
        # GET should succeed
        pass
```

### Verification Checklist
- [ ] Permission tests created
- [ ] Authentication tested
- [ ] CRUD permissions tested
- [ ] Role-based access tested
- [ ] All tests pass

---

## Summary of Deliverables

After completing Group F Document 2:

### API Tests
✓ BrandAPITest - 8 test cases  
✓ TaxClassAPITest - 6 test cases  
✓ UnitOfMeasureAPITest - 5 test cases  
✓ ProductAPITest - 15 test cases

### Tenant Isolation Tests
✓ TenantIsolationTest - 5 test cases  
✓ Data isolation verified  
✓ API isolation verified  
✓ Cross-tenant access prevention

### Permission Tests
✓ PermissionTest - 7 test cases  
✓ Authentication tested  
✓ CRUD permissions tested  
✓ Role-based access tested

---

## Notes for Implementation

1. **API Testing Best Practices**
   - Use APIClient for all requests
   - Test both success and error cases
   - Verify response status codes
   - Verify response data structure
   - Test edge cases (empty lists, invalid IDs)

2. **Tenant Testing**
   - Use TenantTestCase (not TestCase)
   - Clean up tenant data after tests
   - Test schema switching
   - Verify middleware works correctly

3. **Authentication Setup**
   ```python
   # JWT Token authentication
   response = self.client.post('/api/auth/login/', {
       'username': 'test',
       'password': 'pass'
   })
   token = response.data['access']
   self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
   
   # Or force authentication
   self.client.force_authenticate(user=self.user)
   ```

4. **Running API Tests**
   ```bash
   # Run all API tests
   python manage.py test apps.products.tests.test_api
   
   # Run specific test class
   python manage.py test apps.products.tests.test_api.ProductAPITest
   
   # Run with verbose output
   python manage.py test apps.products.tests.test_api --verbosity=2
   ```

---
