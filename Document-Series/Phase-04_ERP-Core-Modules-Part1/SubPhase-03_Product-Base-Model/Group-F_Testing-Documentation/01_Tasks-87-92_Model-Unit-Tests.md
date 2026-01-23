# Tasks 87-92: Model Unit Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Serializers-Views/03_Tasks-85-86_Admin-Configuration.md](../Group-E_Serializers-Views/03_Tasks-85-86_Admin-Configuration.md)
- **→ Next Document:** [02_Tasks-93-95_API-Tenant-Tests.md](02_Tasks-93-95_API-Tenant-Tests.md)

---

## Document Overview

This document covers comprehensive unit testing for products app models.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 87 | Create tests Directory | Low |
| 88 | Test Brand Model | Medium |
| 89 | Test TaxClass Model | Medium |
| 90 | Test UnitOfMeasure Model | Medium |
| 91 | Test Product Model | High |
| 92 | Test QuerySet Methods | High |

---

## Task 87: Create tests Directory

### Overview
Set up testing infrastructure for products app.

### Dependencies
- Task 86: Configure ModelAdmin Classes

### Instructions

1. **Remove default tests.py**
   - Delete `backend/apps/products/tests.py` if exists

2. **Create tests directory**
   - Create directory: `backend/apps/products/tests/`

3. **Create test modules**
   - `__init__.py` - marks as Python package
   - `test_models.py` - model tests
   - `test_api.py` - API tests (for next document)
   - `test_managers.py` - manager/queryset tests

4. **Import in __init__.py**
   - Import all test classes for test discovery

### Expected Outcome
```
backend/apps/products/tests/
├── __init__.py
├── test_models.py
├── test_api.py
└── test_managers.py
```

### Verification Checklist
- [ ] tests/ directory created
- [ ] All test modules created
- [ ] __init__.py configured
- [ ] Test discovery works

---

## Task 88: Test Brand Model

### Overview
Create comprehensive unit tests for Brand model.

### Dependencies
- Task 87: Create tests Directory

### Instructions

1. **Create test class in test_models.py**
   - Inherit from TenantTestCase
   - Set up test fixtures

2. **Test model creation**
   - Create brand with valid data
   - Verify all fields saved correctly
   - Test auto-generated slug

3. **Test constraints**
   - Test unique slug constraint
   - Test required fields validation
   - Test field max_lengths

4. **Test model methods**
   - Test __str__ method
   - Test get_absolute_url if exists
   - Test custom properties

5. **Test slug generation**
   - Test automatic slug from name
   - Test slug uniqueness
   - Test slug updates on name change

### Test Coverage Requirements

**Test Cases:**
1. `test_create_brand` - Create valid brand
2. `test_brand_str_method` - Test __str__ returns name
3. `test_brand_slug_auto_generation` - Slug auto-generates from name
4. `test_brand_unique_slug` - Unique slugs for duplicate names
5. `test_brand_required_fields` - Validate required fields
6. `test_brand_is_active_default` - is_active defaults to True
7. `test_brand_logo_upload` - Test logo field
8. `test_brand_update` - Update brand fields

### Expected Test Structure
```python
# test_models.py
"""
Unit tests for products app models.
"""

from django.test import TestCase
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django_tenants.test.cases import TenantTestCase

from apps.products.models import Brand, TaxClass, UnitOfMeasure, Product
from apps.categories.models import Category


class BrandModelTest(TenantTestCase):
    """Unit tests for Brand model."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create test brand
        pass
    
    def test_create_brand(self):
        """Test creating a brand with valid data."""
        # Create brand
        # Assert saved correctly
        # Check all fields
        pass
    
    def test_brand_str_method(self):
        """Test Brand __str__ returns name."""
        # Assert str(brand) == brand.name
        pass
    
    def test_brand_slug_auto_generation(self):
        """Test slug auto-generates from name."""
        # Create brand without slug
        # Assert slug generated
        # Assert slug matches slugified name
        pass
    
    def test_brand_unique_slug(self):
        """Test unique slugs for brands with same name."""
        # Create two brands with same name
        # Assert slugs are different
        # Assert second slug has suffix
        pass
    
    def test_brand_required_fields(self):
        """Test required fields validation."""
        # Try to create brand without name
        # Assert ValidationError raised
        pass
    
    def test_brand_is_active_default(self):
        """Test is_active defaults to True."""
        # Create brand without specifying is_active
        # Assert is_active is True
        pass
```

### Verification Checklist
- [ ] All test cases created
- [ ] Tests cover model creation
- [ ] Tests cover constraints
- [ ] Tests cover slug generation
- [ ] Tests pass successfully

---

## Task 89: Test TaxClass Model

### Overview
Create unit tests for TaxClass model.

### Dependencies
- Task 88: Test Brand Model

### Instructions

1. **Create test class**
   - Add TaxClassModelTest to test_models.py
   - Set up fixtures

2. **Test model creation**
   - Create tax class with valid rate
   - Test decimal precision
   - Test is_default flag

3. **Test validation**
   - Test rate range (0-100)
   - Test required fields
   - Test decimal places

4. **Test default logic**
   - Test only one default per tenant
   - Test changing default updates others

### Test Coverage Requirements

**Test Cases:**
1. `test_create_tax_class` - Create valid tax class
2. `test_tax_class_str_method` - Test __str__ method
3. `test_tax_class_rate_decimal` - Test rate decimal precision
4. `test_tax_class_rate_validation` - Validate rate range
5. `test_tax_class_is_default` - Test default flag
6. `test_only_one_default` - Ensure only one default
7. `test_tax_rate_calculation` - Test rate calculations

### Expected Test Structure
```python
class TaxClassModelTest(TenantTestCase):
    """Unit tests for TaxClass model."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create standard VAT tax class
        pass
    
    def test_create_tax_class(self):
        """Test creating tax class with valid data."""
        pass
    
    def test_tax_class_str_method(self):
        """Test TaxClass __str__ returns name."""
        pass
    
    def test_tax_class_rate_decimal(self):
        """Test rate stored with correct decimal precision."""
        # Create tax class with 15.50 rate
        # Assert rate stored as 15.50
        pass
    
    def test_tax_class_rate_validation(self):
        """Test rate must be between 0 and 100."""
        # Try negative rate - should fail
        # Try rate > 100 - should fail
        pass
    
    def test_tax_class_is_default(self):
        """Test is_default flag functionality."""
        # Create default tax class
        # Assert is_default is True
        pass
    
    def test_only_one_default(self):
        """Test only one tax class can be default."""
        # Create tax class 1 as default
        # Create tax class 2 as default
        # Assert tax class 1 no longer default
        # Assert only tax class 2 is default
        pass
```

### Verification Checklist
- [ ] All test cases created
- [ ] Tests cover rate validation
- [ ] Tests cover default logic
- [ ] Tests pass successfully

---

## Task 90: Test UnitOfMeasure Model

### Overview
Create unit tests for UnitOfMeasure model.

### Dependencies
- Task 89: Test TaxClass Model

### Instructions

1. **Create test class**
   - Add UnitOfMeasureModelTest to test_models.py
   - Set up fixtures

2. **Test model creation**
   - Create UOM with valid data
   - Test conversion_factor
   - Test is_base_unit flag

3. **Test validation**
   - Test required fields
   - Test conversion_factor > 0
   - Test base unit logic

4. **Test conversions**
   - Test unit conversions
   - Test base unit calculations

### Test Coverage Requirements

**Test Cases:**
1. `test_create_unit_of_measure` - Create valid UOM
2. `test_uom_str_method` - Test __str__ method
3. `test_uom_conversion_factor` - Test conversion_factor
4. `test_uom_is_base_unit` - Test base unit flag
5. `test_uom_base_unit_conversion_one` - Base units have factor 1.0
6. `test_uom_conversion_calculation` - Test unit conversions

### Expected Test Structure
```python
class UnitOfMeasureModelTest(TenantTestCase):
    """Unit tests for UnitOfMeasure model."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create base unit (pieces)
        # Create derived units (dozen, gross)
        pass
    
    def test_create_unit_of_measure(self):
        """Test creating UOM with valid data."""
        pass
    
    def test_uom_str_method(self):
        """Test UnitOfMeasure __str__ returns name."""
        pass
    
    def test_uom_conversion_factor(self):
        """Test conversion_factor stored correctly."""
        # Create UOM with factor 12 (dozen)
        # Assert factor is 12.0
        pass
    
    def test_uom_is_base_unit(self):
        """Test is_base_unit flag."""
        # Create base unit
        # Assert is_base_unit is True
        # Assert conversion_factor is 1.0
        pass
    
    def test_uom_conversion_calculation(self):
        """Test unit conversion calculations."""
        # Create dozen (12) and gross (144)
        # Test conversions between units
        pass
```

### Verification Checklist
- [ ] All test cases created
- [ ] Tests cover conversion logic
- [ ] Tests cover base unit
- [ ] Tests pass successfully

---

## Task 91: Test Product Model

### Overview
Create comprehensive unit tests for Product model.

### Dependencies
- Task 90: Test UnitOfMeasure Model

### Instructions

1. **Create test class**
   - Add ProductModelTest to test_models.py
   - Set up fixtures (category, brand, tax class, UOM)

2. **Test model creation**
   - Create product with all fields
   - Test auto-generated SKU
   - Test auto-generated slug
   - Test default values

3. **Test SKU generation**
   - Test SKU format (PRD-CATEGORY-00001)
   - Test SKU uniqueness
   - Test SKU increments correctly
   - Test SKU with different categories

4. **Test product types**
   - Test SIMPLE product creation
   - Test VARIABLE product creation
   - Test BUNDLE product creation
   - Test COMPOSITE product creation

5. **Test product status**
   - Test DRAFT status
   - Test ACTIVE status
   - Test status transitions
   - Test ARCHIVED and DISCONTINUED

6. **Test visibility**
   - Test is_webstore_visible
   - Test is_pos_visible
   - Test published() logic

7. **Test model methods**
   - Test __str__ method
   - Test get_absolute_url if exists
   - Test custom properties

### Test Coverage Requirements

**Test Cases:**
1. `test_create_product` - Create valid product
2. `test_product_str_method` - Test __str__ returns name
3. `test_product_sku_auto_generation` - SKU auto-generates
4. `test_product_sku_format` - SKU follows PRD-CATEGORY-00001 format
5. `test_product_sku_uniqueness` - SKUs are unique
6. `test_product_sku_increments` - SKU numbers increment
7. `test_product_slug_auto_generation` - Slug auto-generates
8. `test_product_types` - Test all product types
9. `test_product_status_default` - Status defaults to DRAFT
10. `test_product_visibility_defaults` - Visibility defaults
11. `test_product_required_fields` - Test required fields
12. `test_product_foreignkey_relations` - Test ForeignKey fields
13. `test_product_physical_attributes` - Test weight/dimensions
14. `test_product_seo_fields` - Test SEO fields

### Expected Test Structure
```python
class ProductModelTest(TenantTestCase):
    """Unit tests for Product model."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create category
        # Create brand
        # Create tax class
        # Create unit of measure
        pass
    
    def test_create_product(self):
        """Test creating product with valid data."""
        # Create product
        # Assert all fields saved correctly
        pass
    
    def test_product_str_method(self):
        """Test Product __str__ returns name."""
        pass
    
    def test_product_sku_auto_generation(self):
        """Test SKU auto-generates if not provided."""
        # Create product without SKU
        # Assert SKU generated
        # Assert SKU not empty
        pass
    
    def test_product_sku_format(self):
        """Test SKU follows PRD-CATEGORY-00001 format."""
        # Create product
        # Assert SKU starts with 'PRD-'
        # Assert SKU contains category abbreviation
        # Assert SKU ends with numeric sequence
        pass
    
    def test_product_sku_uniqueness(self):
        """Test SKUs are unique per tenant."""
        # Create two products
        # Assert SKUs are different
        pass
    
    def test_product_sku_increments(self):
        """Test SKU numbers increment sequentially."""
        # Create product 1 (PRD-ELEC-00001)
        # Create product 2 (PRD-ELEC-00002)
        # Assert SKU increments
        pass
    
    def test_product_slug_auto_generation(self):
        """Test slug auto-generates from name."""
        # Create product without slug
        # Assert slug generated
        pass
    
    def test_product_types(self):
        """Test all product types can be created."""
        # Create SIMPLE product
        # Create VARIABLE product
        # Create BUNDLE product
        # Create COMPOSITE product
        # Assert all created successfully
        pass
    
    def test_product_status_default(self):
        """Test status defaults to DRAFT."""
        # Create product without status
        # Assert status is DRAFT
        pass
    
    def test_product_visibility_defaults(self):
        """Test visibility flags default correctly."""
        # Create product without visibility flags
        # Assert is_webstore_visible is True
        # Assert is_pos_visible is True
        pass
    
    def test_product_required_fields(self):
        """Test required fields validation."""
        # Try to create product without name
        # Assert ValidationError raised
        pass
    
    def test_product_foreignkey_relations(self):
        """Test ForeignKey relationships."""
        # Create product with all FKs
        # Assert relations set correctly
        # Assert can access related objects
        pass
```

### Verification Checklist
- [ ] All test cases created
- [ ] Tests cover SKU generation
- [ ] Tests cover product types
- [ ] Tests cover status workflow
- [ ] Tests cover visibility
- [ ] Tests pass successfully

---

## Task 92: Test QuerySet Methods

### Overview
Test custom QuerySet and Manager methods.

### Dependencies
- Task 91: Test Product Model

### Instructions

1. **Create test class**
   - Add ProductQuerySetTest to test_managers.py
   - Set up fixtures with various products

2. **Test QuerySet filters**
   - Test active() method
   - Test published() method
   - Test in_stock() method (when inventory added)
   - Test by_category() method
   - Test by_brand() method

3. **Test Manager methods**
   - Test simple_products()
   - Test variable_products()
   - Test featured()
   - Test search()

4. **Test method chaining**
   - Test combining multiple filters
   - Test order of operations

### Test Coverage Requirements

**Test Cases:**
1. `test_queryset_active` - Filter active products
2. `test_queryset_published` - Filter published products
3. `test_queryset_by_category` - Filter by category
4. `test_queryset_by_brand` - Filter by brand
5. `test_manager_simple_products` - Get simple products
6. `test_manager_variable_products` - Get variable products
7. `test_manager_featured` - Get featured products
8. `test_manager_search` - Search products
9. `test_queryset_chaining` - Chain multiple filters

### Expected Test Structure
```python
# test_managers.py
"""
Unit tests for products app managers and querysets.
"""

from django_tenants.test.cases import TenantTestCase
from apps.products.models import Product, Brand
from apps.categories.models import Category


class ProductQuerySetTest(TenantTestCase):
    """Unit tests for ProductQuerySet methods."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create category
        # Create brand
        # Create multiple products with different statuses
        # Create active, draft, archived products
        # Create featured and non-featured products
        pass
    
    def test_queryset_active(self):
        """Test active() returns only active products."""
        # Query active products
        # Assert only ACTIVE status returned
        # Assert DRAFT/ARCHIVED not returned
        pass
    
    def test_queryset_published(self):
        """Test published() returns active + webstore visible."""
        # Query published products
        # Assert status is ACTIVE
        # Assert is_webstore_visible is True
        pass
    
    def test_queryset_by_category(self):
        """Test by_category() filters correctly."""
        # Query products by category
        # Assert only products in that category returned
        pass
    
    def test_queryset_by_brand(self):
        """Test by_brand() filters correctly."""
        # Query products by brand
        # Assert only products with that brand returned
        pass
    
    def test_manager_simple_products(self):
        """Test simple_products() returns SIMPLE type."""
        # Query simple products
        # Assert all products are SIMPLE type
        pass
    
    def test_manager_variable_products(self):
        """Test variable_products() returns VARIABLE type."""
        # Query variable products
        # Assert all products are VARIABLE type
        pass
    
    def test_manager_featured(self):
        """Test featured() returns featured products."""
        # Query featured products
        # Assert all have featured=True
        pass
    
    def test_manager_search(self):
        """Test search() finds products by keyword."""
        # Search by product name
        # Assert correct products returned
        # Search by SKU
        # Assert found
        # Search by description
        # Assert found
        pass
    
    def test_queryset_chaining(self):
        """Test chaining multiple QuerySet methods."""
        # Chain active().by_category().featured()
        # Assert all conditions met
        pass
```

### Verification Checklist
- [ ] All test cases created
- [ ] Tests cover all QuerySet methods
- [ ] Tests cover all Manager methods
- [ ] Tests cover method chaining
- [ ] Tests pass successfully

---

## Summary of Deliverables

After completing Group F Document 1:

### Test Infrastructure
✓ tests/ directory structure  
✓ test_models.py module  
✓ test_managers.py module  
✓ Test discovery configured

### Model Tests
✓ BrandModelTest - 8+ test cases  
✓ TaxClassModelTest - 7+ test cases  
✓ UnitOfMeasureModelTest - 6+ test cases  
✓ ProductModelTest - 14+ test cases

### Manager Tests
✓ ProductQuerySetTest - 9+ test cases  
✓ QuerySet filter methods tested  
✓ Manager methods tested  
✓ Method chaining tested

---

## Notes for Implementation

1. **Test Organization**
   - Group related tests in classes
   - Use descriptive test names
   - Follow Arrange-Act-Assert pattern
   - Keep tests focused and independent

2. **Test Data**
   - Use factories for complex objects
   - Create minimal fixtures
   - Clean up after tests
   - Use TenantTestCase for tenant isolation

3. **Test Coverage**
   - Aim for 80%+ code coverage
   - Test happy paths
   - Test edge cases
   - Test error conditions

4. **Running Tests**
   ```bash
   # Run all products tests
   python manage.py test apps.products
   
   # Run model tests only
   python manage.py test apps.products.tests.test_models
   
   # Run specific test class
   python manage.py test apps.products.tests.test_models.ProductModelTest
   
   # With coverage
   coverage run --source='apps.products' manage.py test apps.products
   coverage report
   ```

---
