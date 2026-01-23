# Tasks 88-90: API and Integration Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-83-87_Model-Service-Tests.md](01_Tasks-83-87_Model-Service-Tests.md)
- **→ Next Document:** [03_Tasks-91-94_Documentation-Verification.md](03_Tasks-91-94_Documentation-Verification.md)

---

## Document Overview

This document covers API endpoint testing and multi-tenant isolation verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 88 | Test Variant API Endpoints | High |
| 89 | Test Tenant Isolation | High |
| 90 | Test Integration Scenarios | High |

---

## Task 88: Test Variant API Endpoints

### Overview
Test all API endpoints for variant management.

### Dependencies
- ViewSets complete (Group E, Tasks 75-78)

### Instructions

1. **Create test_variant_api.py**
   - Location: `backend/apps/products/tests/test_variant_api.py`

2. **Test CRUD for all endpoints**
3. **Test custom actions**

### Implementation

```python
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.products.models import (
    Product, VariantOptionType, VariantOptionValue,
    ProductVariant, ProductVariantOption
)

User = get_user_model()

class VariantOptionTypeAPITests(APITestCase):
    """Tests for VariantOptionType API."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_list_option_types(self):
        """Test listing option types."""
        VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        
        response = self.client.get('/api/variant-option-types/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_create_option_type(self):
        """Test creating option type."""
        data = {
            'name': 'color',
            'display_name': 'Color',
            'display_order': 1,
            'is_active': True
        }
        
        response = self.client.post('/api/variant-option-types/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'color'
    
    def test_update_option_type(self):
        """Test updating option type."""
        option_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        
        data = {'display_name': 'Product Size'}
        response = self.client.patch(
            f'/api/variant-option-types/{option_type.id}/',
            data
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['display_name'] == 'Product Size'
    
    def test_delete_option_type(self):
        """Test deleting option type."""
        option_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        
        response = self.client.delete(
            f'/api/variant-option-types/{option_type.id}/'
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not VariantOptionType.objects.filter(id=option_type.id).exists()


class VariantOptionValueAPITests(APITestCase):
    """Tests for VariantOptionValue API."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.option_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
    
    def test_create_option_value(self):
        """Test creating option value."""
        data = {
            'option_type': self.option_type.id,
            'value': 'red',
            'display_value': 'Red',
            'color_swatch': '#FF0000',
            'display_order': 1
        }
        
        response = self.client.post('/api/variant-option-values/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['value'] == 'red'
        assert response.data['color_swatch'] == '#FF0000'
    
    def test_by_type_action(self):
        """Test by_type custom action."""
        VariantOptionValue.objects.create(
            option_type=self.option_type,
            value='red',
            display_value='Red'
        )
        
        response = self.client.get(
            f'/api/variant-option-values/by_type/?type_id={self.option_type.id}'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1


class ProductVariantAPITests(APITestCase):
    """Tests for ProductVariant API."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT'
        )
        
        size_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        self.size_m = VariantOptionValue.objects.create(
            option_type=size_type,
            value='m',
            display_value='Medium'
        )
    
    def test_list_variants(self):
        """Test listing variants."""
        ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M'
        )
        
        response = self.client.get('/api/product-variants/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_create_variant(self):
        """Test creating variant with options."""
        data = {
            'product': self.product.id,
            'sku': 'TSHIRT-M-NEW',
            'option_value_ids': [self.size_m.id]
        }
        
        response = self.client.post('/api/product-variants/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['sku'] == 'TSHIRT-M-NEW'
    
    def test_generate_variants_action(self):
        """Test generate_variants custom action."""
        color_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
        VariantOptionValue.objects.create(
            option_type=color_type,
            value='red',
            display_value='Red'
        )
        VariantOptionValue.objects.create(
            option_type=color_type,
            value='blue',
            display_value='Blue'
        )
        
        data = {
            'product_id': self.product.id,
            'options': {
                'Size': ['Medium'],
                'Color': ['Red', 'Blue']
            }
        }
        
        response = self.client.post(
            '/api/product-variants/generate_variants/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'Generated 2 variants' in response.data['message']
    
    def test_by_options_action(self):
        """Test by_options custom action."""
        variant = ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M'
        )
        ProductVariantOption.objects.create(
            variant=variant,
            option_value=self.size_m
        )
        
        response = self.client.get(
            f'/api/product-variants/by_options/?product={self.product.id}&options[]={self.size_m.id}'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['sku'] == 'TSHIRT-M'
    
    def test_filter_by_product(self):
        """Test filtering variants by product."""
        ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M'
        )
        
        other_product = Product.objects.create(
            name='Jeans',
            sku='JEANS'
        )
        ProductVariant.objects.create(
            product=other_product,
            sku='JEANS-30'
        )
        
        response = self.client.get(
            f'/api/product-variants/?product={self.product.id}'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['sku'] == 'TSHIRT-M'
```

### Test Scenarios

| Scenario | Endpoint | Expected Result |
|----------|----------|----------------|
| List Types | GET /api/variant-option-types/ | 200, list data |
| Create Type | POST /api/variant-option-types/ | 201, created |
| List Values | GET /api/variant-option-values/ | 200, list data |
| Create Value | POST /api/variant-option-values/ | 201, with swatch |
| List Variants | GET /api/product-variants/ | 200, list data |
| Create Variant | POST /api/product-variants/ | 201, with options |
| Generate Variants | POST /api/product-variants/generate_variants/ | 201, bulk created |
| Find by Options | GET /api/product-variants/by_options/ | 200, exact match |

### Verification Checklist
- [ ] Test file created
- [ ] All CRUD endpoints tested
- [ ] Custom actions tested
- [ ] Filtering tested
- [ ] Authentication tested
- [ ] All tests passing

---

## Task 89: Test Tenant Isolation

### Overview
Verify multi-tenant isolation for all variant models.

### Dependencies
- Task 88: API tests
- Multi-tenant architecture (Phase 02)

### Instructions

1. **Create test_variant_tenancy.py**
   - Location: `backend/apps/products/tests/test_variant_tenancy.py`

2. **Test data isolation between tenants**

### Implementation

```python
from django.test import TestCase, TransactionTestCase
from django_tenants.test.cases import TenantTestCase
from apps.tenants.models import Tenant
from apps.products.models import (
    VariantOptionType, VariantOptionValue,
    Product, ProductVariant
)

class VariantTenantIsolationTests(TenantTestCase):
    """Tests for tenant isolation in variant models."""
    
    def setUp(self):
        """Set up test tenants."""
        super().setUp()
        
        # Tenant 1
        self.tenant1 = Tenant.objects.create(
            schema_name='tenant1',
            name='Tenant 1'
        )
        
        # Tenant 2
        self.tenant2 = Tenant.objects.create(
            schema_name='tenant2',
            name='Tenant 2'
        )
    
    def test_option_type_isolation(self):
        """Test option types isolated per tenant."""
        # Create in tenant1
        self.tenant1.activate()
        type1 = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        count1 = VariantOptionType.objects.count()
        
        # Switch to tenant2
        self.tenant2.activate()
        count2 = VariantOptionType.objects.count()
        
        # Tenant 2 should not see tenant 1's data
        assert count1 == 1
        assert count2 == 0
    
    def test_option_value_isolation(self):
        """Test option values isolated per tenant."""
        # Create option type in each tenant
        self.tenant1.activate()
        type1 = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        value1 = VariantOptionValue.objects.create(
            option_type=type1,
            value='m',
            display_value='Medium'
        )
        
        self.tenant2.activate()
        type2 = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        value2 = VariantOptionValue.objects.create(
            option_type=type2,
            value='l',
            display_value='Large'
        )
        
        # Verify isolation
        self.tenant1.activate()
        assert VariantOptionValue.objects.count() == 1
        assert VariantOptionValue.objects.first().value == 'm'
        
        self.tenant2.activate()
        assert VariantOptionValue.objects.count() == 1
        assert VariantOptionValue.objects.first().value == 'l'
    
    def test_variant_isolation(self):
        """Test product variants isolated per tenant."""
        # Tenant 1
        self.tenant1.activate()
        product1 = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT'
        )
        variant1 = ProductVariant.objects.create(
            product=product1,
            sku='TSHIRT-M'
        )
        
        # Tenant 2
        self.tenant2.activate()
        product2 = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT'
        )
        variant2 = ProductVariant.objects.create(
            product=product2,
            sku='TSHIRT-M'  # Same SKU but different tenant
        )
        
        # Verify isolation
        self.tenant1.activate()
        assert ProductVariant.objects.count() == 1
        assert ProductVariant.objects.first() == variant1
        
        self.tenant2.activate()
        assert ProductVariant.objects.count() == 1
        assert ProductVariant.objects.first() == variant2
    
    def test_cross_tenant_references_blocked(self):
        """Test cannot reference data from other tenant."""
        # Create option in tenant1
        self.tenant1.activate()
        type1 = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        
        # Try to use in tenant2
        self.tenant2.activate()
        with self.assertRaises(Exception):
            VariantOptionValue.objects.create(
                option_type=type1,  # From tenant1!
                value='m',
                display_value='Medium'
            )
```

### Test Coverage

**Tenant Isolation Tests:**
- ✅ VariantOptionType isolated
- ✅ VariantOptionValue isolated
- ✅ ProductVariant isolated
- ✅ Cross-tenant references blocked
- ✅ Same SKU allowed in different tenants

### Verification Checklist
- [ ] Test file created
- [ ] All models tested for isolation
- [ ] Cross-tenant access blocked
- [ ] All tests passing

---

## Task 90: Test Integration Scenarios

### Overview
Test complete workflows and integration between components.

### Dependencies
- Tasks 88-89: API and tenant tests

### Instructions

1. **Create test_variant_integration.py**
   - Location: `backend/apps/products/tests/test_variant_integration.py`

2. **Test end-to-end scenarios**

### Implementation

```python
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.products.models import (
    Product, VariantOptionType, VariantOptionValue,
    ProductVariant, ProductVariantOption
)

User = get_user_model()

class VariantIntegrationTests(TestCase):
    """Integration tests for variant system."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_complete_variant_creation_workflow(self):
        """Test complete workflow from product to variants."""
        # Step 1: Create product
        product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT',
            base_price=1000.00
        )
        
        # Step 2: Create option types
        size_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        color_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
        
        # Step 3: Create option values
        size_s = VariantOptionValue.objects.create(
            option_type=size_type,
            value='s',
            display_value='Small'
        )
        size_m = VariantOptionValue.objects.create(
            option_type=size_type,
            value='m',
            display_value='Medium'
        )
        
        color_red = VariantOptionValue.objects.create(
            option_type=color_type,
            value='red',
            display_value='Red',
            color_swatch='#FF0000'
        )
        color_blue = VariantOptionValue.objects.create(
            option_type=color_type,
            value='blue',
            display_value='Blue',
            color_swatch='#0000FF'
        )
        
        # Step 4: Generate all variants
        from apps.products.services.variant_generator import VariantGenerator
        generator = VariantGenerator(product)
        variants = generator.generate_all_combinations({
            'Size': ['Small', 'Medium'],
            'Color': ['Red', 'Blue']
        })
        
        # Verify: 2 sizes × 2 colors = 4 variants
        assert len(variants) == 4
        assert ProductVariant.objects.filter(product=product).count() == 4
        
        # Verify each variant has correct options
        for variant in variants:
            assert variant.option_values.count() == 2
            assert variant.sku.startswith('TSHIRT')
    
    def test_ecommerce_cart_scenario(self):
        """Test e-commerce cart scenario."""
        # Setup: Product with variants
        product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT',
            base_price=1200.00
        )
        
        size_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        color_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
        
        size_m = VariantOptionValue.objects.create(
            option_type=size_type,
            value='m',
            display_value='Medium'
        )
        color_red = VariantOptionValue.objects.create(
            option_type=color_type,
            value='red',
            display_value='Red'
        )
        
        variant = ProductVariant.objects.create(
            product=product,
            sku='TSHIRT-M-RED',
            override_price=1500.00
        )
        ProductVariantOption.objects.create(
            variant=variant,
            option_value=size_m
        )
        ProductVariantOption.objects.create(
            variant=variant,
            option_value=color_red
        )
        
        # Scenario: Customer adds to cart
        # 1. Select options
        selected_options = [size_m.id, color_red.id]
        
        # 2. Find variant by options
        found_variant = ProductVariant.objects.get_by_options(
            product=product,
            options=selected_options
        )
        
        # 3. Verify correct variant found
        assert found_variant == variant
        assert found_variant.sku == 'TSHIRT-M-RED'
        
        # 4. Get price
        price = found_variant.get_effective_price()
        assert price == 1500.00  # Override price
    
    def test_bulk_price_update_scenario(self):
        """Test bulk updating variant prices."""
        product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT',
            base_price=1000.00
        )
        
        # Create 3 variants
        for i in range(3):
            ProductVariant.objects.create(
                product=product,
                sku=f'TSHIRT-{i}'
            )
        
        # Bulk update prices
        variants = ProductVariant.objects.filter(product=product)
        variants.update(override_price=1200.00)
        
        # Verify all updated
        for variant in variants:
            assert variant.get_effective_price() == 1200.00
    
    def test_variant_search_and_filter_scenario(self):
        """Test searching and filtering variants."""
        # Create multiple products with variants
        product1 = Product.objects.create(name='T-Shirt', sku='TSHIRT')
        product2 = Product.objects.create(name='Jeans', sku='JEANS')
        
        variant1 = ProductVariant.objects.create(
            product=product1,
            sku='TSHIRT-M',
            is_active=True
        )
        variant2 = ProductVariant.objects.create(
            product=product1,
            sku='TSHIRT-L',
            is_active=False
        )
        variant3 = ProductVariant.objects.create(
            product=product2,
            sku='JEANS-30',
            is_active=True
        )
        
        # Test filters
        active_variants = ProductVariant.objects.active()
        assert variant1 in active_variants
        assert variant2 not in active_variants
        assert variant3 in active_variants
        
        product1_variants = ProductVariant.objects.for_product(product1.id)
        assert variant1 in product1_variants
        assert variant2 in product1_variants
        assert variant3 not in product1_variants
        
        # Chain filters
        active_product1 = (ProductVariant.objects
                          .active()
                          .for_product(product1.id))
        assert active_product1.count() == 1
        assert variant1 in active_product1
```

### Integration Scenarios

| Scenario | Components Tested | Expected Outcome |
|----------|-------------------|------------------|
| **Complete Workflow** | Models, Generator, QuerySets | 4 variants created |
| **E-commerce Cart** | Models, Managers, Options | Correct variant found |
| **Bulk Update** | QuerySets, Models | All prices updated |
| **Search & Filter** | QuerySets, Managers | Correct filtering |

### Verification Checklist
- [ ] Test file created
- [ ] Complete workflows tested
- [ ] E-commerce scenarios tested
- [ ] Bulk operations tested
- [ ] Search/filter tested
- [ ] All tests passing

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 88 | Test Variant API Endpoints | API test suite |
| 89 | Test Tenant Isolation | Tenancy tests |
| 90 | Test Integration Scenarios | Integration tests |

### Test Coverage Summary

**API Tests:**
- ✅ Option type CRUD
- ✅ Option value CRUD with swatches
- ✅ Variant CRUD with options
- ✅ Custom actions (generate_variants, by_options)
- ✅ Filtering and search

**Tenant Isolation Tests:**
- ✅ Option types isolated
- ✅ Option values isolated
- ✅ Variants isolated
- ✅ Cross-tenant blocking

**Integration Tests:**
- ✅ Complete variant creation workflow
- ✅ E-commerce cart scenario
- ✅ Bulk operations
- ✅ Search and filter scenarios

### Test Files Created

1. `test_variant_api.py` - API endpoint tests
2. `test_variant_tenancy.py` - Tenant isolation tests
3. `test_variant_integration.py` - Integration/workflow tests

### Next Steps
1. Proceed to [03_Tasks-91-94_Documentation-Verification.md](03_Tasks-91-94_Documentation-Verification.md) for final documentation

---

## Notes for AI Agents

1. **API Tests:** Use APIClient with force_authenticate
2. **Tenant Tests:** Use TenantTestCase from django-tenants
3. **Integration Tests:** Test complete workflows, not isolated units
4. **Test Data:** Create realistic test scenarios
5. **Assertions:** Use descriptive assertions
6. **Coverage:** Run coverage report to identify gaps
7. **CI/CD:** Tests should run in CI pipeline
8. **Performance:** Keep test suite under 2 minutes
