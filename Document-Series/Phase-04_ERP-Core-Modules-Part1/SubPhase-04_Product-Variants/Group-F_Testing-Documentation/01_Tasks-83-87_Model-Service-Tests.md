# Tasks 83-87: Model and Service Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 83, 84, 85, 86, 87

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Serializers-Views/](../Group-E_Serializers-Views/)
- **→ Next Document:** [02_Tasks-88-90_API-Tests.md](02_Tasks-88-90_API-Tests.md)

---

## Document Overview

This document covers comprehensive testing for variant models and services.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 83 | Test VariantOptionType Model | Low |
| 84 | Test VariantOptionValue Model | Medium |
| 85 | Test ProductVariant Model | High |
| 86 | Test VariantGenerator Service | High |
| 87 | Test Variant Managers | Medium |

---

## Task 83: Test VariantOptionType Model

### Overview
Create tests for VariantOptionType model functionality.

### Dependencies
- VariantOptionType model (Group A)

### Instructions

1. **Create test_variant_models.py**
   - Location: `backend/apps/products/tests/test_variant_models.py`

2. **Test model creation and validation**

### Implementation

```python
from django.test import TestCase
from apps.products.models import VariantOptionType, VariantOptionValue

class VariantOptionTypeTests(TestCase):
    """Tests for VariantOptionType model."""
    
    def setUp(self):
        """Set up test data."""
        self.option_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size',
            display_order=1
        )
    
    def test_create_option_type(self):
        """Test creating option type."""
        assert self.option_type.name == 'size'
        assert self.option_type.display_name == 'Size'
        assert self.option_type.is_active is True
    
    def test_str_representation(self):
        """Test string representation."""
        assert str(self.option_type) == 'Size'
    
    def test_unique_name(self):
        """Test name uniqueness."""
        with self.assertRaises(Exception):
            VariantOptionType.objects.create(
                name='size',  # Duplicate
                display_name='Size 2'
            )
    
    def test_ordering(self):
        """Test default ordering by display_order."""
        type2 = VariantOptionType.objects.create(
            name='color',
            display_name='Color',
            display_order=2
        )
        
        types = list(VariantOptionType.objects.all())
        assert types[0] == self.option_type
        assert types[1] == type2
    
    def test_deactivate(self):
        """Test deactivating option type."""
        self.option_type.is_active = False
        self.option_type.save()
        
        assert not self.option_type.is_active
```

### Verification Checklist
- [ ] Test file created
- [ ] Creation tested
- [ ] Validation tested
- [ ] String representation tested
- [ ] Ordering tested
- [ ] All tests passing

---

## Task 84: Test VariantOptionValue Model

### Overview
Test VariantOptionValue including swatches.

### Dependencies
- Task 83: Option type tests

### Instructions

1. **Add to test_variant_models.py**
2. **Test swatches and relationships**

### Implementation

```python
class VariantOptionValueTests(TestCase):
    """Tests for VariantOptionValue model."""
    
    def setUp(self):
        """Set up test data."""
        self.option_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
        
        self.value = VariantOptionValue.objects.create(
            option_type=self.option_type,
            value='red',
            display_value='Red',
            color_swatch='#FF0000'
        )
    
    def test_create_option_value(self):
        """Test creating option value."""
        assert self.value.value == 'red'
        assert self.value.display_value == 'Red'
        assert self.value.color_swatch == '#FF0000'
    
    def test_str_representation(self):
        """Test string representation."""
        assert str(self.value) == 'Color: Red'
    
    def test_option_type_relationship(self):
        """Test foreign key relationship."""
        assert self.value.option_type == self.option_type
        assert self.value in self.option_type.values.all()
    
    def test_color_swatch_validation(self):
        """Test color swatch format."""
        # Valid hex color
        value = VariantOptionValue.objects.create(
            option_type=self.option_type,
            value='blue',
            color_swatch='#0000FF'
        )
        assert value.color_swatch == '#0000FF'
    
    def test_image_swatch(self):
        """Test image swatch field."""
        # Would use actual image file in real test
        value = VariantOptionValue.objects.create(
            option_type=self.option_type,
            value='pattern',
            display_value='Pattern'
        )
        assert value.image_swatch is None or value.image_swatch == ''
    
    def test_unique_value_per_type(self):
        """Test value uniqueness within type."""
        with self.assertRaises(Exception):
            VariantOptionValue.objects.create(
                option_type=self.option_type,
                value='red',  # Duplicate
                display_value='Red 2'
            )
```

### Verification Checklist
- [ ] Value creation tested
- [ ] Swatch handling tested
- [ ] Relationships tested
- [ ] Validation tested
- [ ] All tests passing

---

## Task 85: Test ProductVariant Model

### Overview
Test ProductVariant model with options and overrides.

### Dependencies
- Tasks 83-84: Option model tests

### Instructions

1. **Add comprehensive ProductVariant tests**
2. **Test relationships and computed fields**

### Implementation

```python
from apps.products.models import Product, ProductVariant, ProductVariantOption

class ProductVariantTests(TestCase):
    """Tests for ProductVariant model."""
    
    def setUp(self):
        """Set up test data."""
        # Create product
        self.product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT',
            base_price=1000.00
        )
        
        # Create option types
        self.size_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        self.color_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
        
        # Create option values
        self.size_m = VariantOptionValue.objects.create(
            option_type=self.size_type,
            value='m',
            display_value='Medium'
        )
        self.color_red = VariantOptionValue.objects.create(
            option_type=self.color_type,
            value='red',
            display_value='Red',
            color_swatch='#FF0000'
        )
        
        # Create variant
        self.variant = ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M-RED'
        )
        
        # Add options
        ProductVariantOption.objects.create(
            variant=self.variant,
            option_value=self.size_m
        )
        ProductVariantOption.objects.create(
            variant=self.variant,
            option_value=self.color_red
        )
    
    def test_create_variant(self):
        """Test creating variant."""
        assert self.variant.product == self.product
        assert self.variant.sku == 'TSHIRT-M-RED'
        assert self.variant.is_active is True
    
    def test_variant_options(self):
        """Test variant option relationships."""
        options = self.variant.option_values.all()
        assert options.count() == 2
        assert self.size_m in options
        assert self.color_red in options
    
    def test_get_option_display(self):
        """Test option display method."""
        display = self.variant.get_option_display()
        assert 'Medium' in display
        assert 'Red' in display
    
    def test_effective_price_without_override(self):
        """Test price falls back to product price."""
        price = self.variant.get_effective_price()
        assert price == self.product.base_price
    
    def test_effective_price_with_override(self):
        """Test override price used."""
        self.variant.override_price = 1200.00
        self.variant.save()
        
        price = self.variant.get_effective_price()
        assert price == 1200.00
    
    def test_unique_sku(self):
        """Test SKU uniqueness."""
        with self.assertRaises(Exception):
            ProductVariant.objects.create(
                product=self.product,
                sku='TSHIRT-M-RED'  # Duplicate
            )
    
    def test_str_representation(self):
        """Test string representation."""
        assert 'TSHIRT-M-RED' in str(self.variant)
```

### Verification Checklist
- [ ] Variant creation tested
- [ ] Option relationships tested
- [ ] Price logic tested
- [ ] Display methods tested
- [ ] Validation tested
- [ ] All tests passing

---

## Task 86: Test VariantGenerator Service

### Overview
Test VariantGenerator service for bulk variant creation.

### Dependencies
- Task 85: Variant model tests
- VariantGenerator service (Group C)

### Instructions

1. **Create test_variant_generator.py**
   - Location: `backend/apps/products/tests/test_variant_generator.py`

2. **Test generation logic**

### Implementation

```python
from django.test import TestCase
from apps.products.models import (
    Product, VariantOptionType, VariantOptionValue,
    ProductVariant
)
from apps.products.services.variant_generator import VariantGenerator

class VariantGeneratorTests(TestCase):
    """Tests for VariantGenerator service."""
    
    def setUp(self):
        """Set up test data."""
        self.product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT'
        )
        
        # Create options
        size_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        color_type = VariantOptionType.objects.create(
            name='color',
            display_name='Color'
        )
        
        # Create values
        self.size_s = VariantOptionValue.objects.create(
            option_type=size_type,
            value='s',
            display_value='Small'
        )
        self.size_m = VariantOptionValue.objects.create(
            option_type=size_type,
            value='m',
            display_value='Medium'
        )
        
        self.color_red = VariantOptionValue.objects.create(
            option_type=color_type,
            value='red',
            display_value='Red'
        )
        self.color_blue = VariantOptionValue.objects.create(
            option_type=color_type,
            value='blue',
            display_value='Blue'
        )
        
        self.generator = VariantGenerator(self.product)
    
    def test_generate_combinations(self):
        """Test generating all combinations."""
        options = {
            'Size': ['Small', 'Medium'],
            'Color': ['Red', 'Blue']
        }
        
        variants = self.generator.generate_all_combinations(options)
        
        # Should create 2 * 2 = 4 variants
        assert len(variants) == 4
        assert ProductVariant.objects.filter(product=self.product).count() == 4
    
    def test_sku_generation(self):
        """Test SKU pattern generation."""
        options = {
            'Size': ['Small'],
            'Color': ['Red']
        }
        
        variants = self.generator.generate_all_combinations(options)
        variant = variants[0]
        
        assert 'TSHIRT' in variant.sku
        assert 'S' in variant.sku or 'SMALL' in variant.sku.upper()
        assert 'RED' in variant.sku.upper()
    
    def test_duplicate_prevention(self):
        """Test duplicate variant prevention."""
        options = {
            'Size': ['Small'],
            'Color': ['Red']
        }
        
        # Generate once
        self.generator.generate_all_combinations(options)
        
        # Try to generate again
        with self.assertRaises(Exception):
            self.generator.generate_all_combinations(options)
    
    def test_empty_options(self):
        """Test handling empty options."""
        with self.assertRaises(Exception):
            self.generator.generate_all_combinations({})
    
    def test_single_option(self):
        """Test generating with single option type."""
        options = {
            'Size': ['Small', 'Medium', 'Large']
        }
        
        variants = self.generator.generate_all_combinations(options)
        assert len(variants) == 3
```

### Verification Checklist
- [ ] Test file created
- [ ] Combination generation tested
- [ ] SKU generation tested
- [ ] Duplicate prevention tested
- [ ] Edge cases tested
- [ ] All tests passing

---

## Task 87: Test Variant Managers

### Overview
Test custom managers and querysets.

### Dependencies
- Variant managers (Group D)

### Instructions

1. **Add to test_variant_models.py**
2. **Test all custom manager methods**

### Implementation

```python
class VariantManagerTests(TestCase):
    """Tests for custom variant managers."""
    
    def setUp(self):
        """Set up test data."""
        self.product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT'
        )
        
        # Create active variant
        self.active_variant = ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M',
            is_active=True
        )
        
        # Create inactive variant
        self.inactive_variant = ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-L',
            is_active=False
        )
    
    def test_active_filter(self):
        """Test active() manager method."""
        active = ProductVariant.objects.active()
        
        assert self.active_variant in active
        assert self.inactive_variant not in active
        assert active.count() == 1
    
    def test_for_product_filter(self):
        """Test for_product() method."""
        variants = ProductVariant.objects.for_product(self.product.id)
        
        assert variants.count() == 2
        assert self.active_variant in variants
        assert self.inactive_variant in variants
    
    def test_method_chaining(self):
        """Test chaining multiple filters."""
        variants = (ProductVariant.objects
                    .active()
                    .for_product(self.product.id))
        
        assert variants.count() == 1
        assert self.active_variant in variants
    
    def test_get_by_options(self):
        """Test get_by_options() manager method."""
        # Create options
        size_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        size_m = VariantOptionValue.objects.create(
            option_type=size_type,
            value='m',
            display_value='Medium'
        )
        
        ProductVariantOption.objects.create(
            variant=self.active_variant,
            option_value=size_m
        )
        
        # Find by options
        variant = ProductVariant.objects.get_by_options(
            product=self.product,
            options=[size_m]
        )
        
        assert variant == self.active_variant
```

### Verification Checklist
- [ ] Active filter tested
- [ ] Product filter tested
- [ ] Method chaining tested
- [ ] get_by_options tested
- [ ] All tests passing

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 83 | Test VariantOptionType | Model tests |
| 84 | Test VariantOptionValue | Value/swatch tests |
| 85 | Test ProductVariant | Variant model tests |
| 86 | Test VariantGenerator | Service tests |
| 87 | Test Variant Managers | Manager/QuerySet tests |

### Test Coverage

**Models:**
- ✅ VariantOptionType creation and validation
- ✅ VariantOptionValue with swatches
- ✅ ProductVariant with options
- ✅ Relationships and foreign keys

**Services:**
- ✅ VariantGenerator combination logic
- ✅ SKU generation patterns
- ✅ Duplicate prevention

**Managers:**
- ✅ Custom QuerySet filters
- ✅ Method chaining
- ✅ get_by_options lookup

### Test Files Created

1. `test_variant_models.py` - Model tests
2. `test_variant_generator.py` - Service tests

### Next Steps
1. Proceed to [02_Tasks-88-90_API-Tests.md](02_Tasks-88-90_API-Tests.md) for API endpoint tests

---

## Notes for AI Agents

1. **Test Isolation:** Each test should be independent
2. **setUp Method:** Create common test data in setUp
3. **Assertions:** Use descriptive assertions (assert x == y, not assertTrue(x == y))
4. **Coverage:** Aim for 80%+ code coverage
5. **Edge Cases:** Test boundary conditions and error cases
6. **Database:** Tests use in-memory database for speed
7. **Multi-tenant:** Tests should respect tenant isolation
8. **Performance:** Keep test suite fast (<1 minute)
