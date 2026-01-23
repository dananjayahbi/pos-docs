# Tasks 63-66: VariantManager and Assignment

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** D - Variant Managers & QuerySets  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-62_VariantQuerySet-Methods.md](01_Tasks-55-62_VariantQuerySet-Methods.md)
- **→ Next Group:** [../Group-E_Serializers-Views/](../Group-E_Serializers-Views/)

---

## Document Overview

This document covers creating VariantManager with lookup methods and assigning it to the ProductVariant model.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create VariantManager | Medium |
| 64 | Add get_by_options Method | High |
| 65 | Assign Manager to Model | Low |
| 66 | Test Manager Methods | Medium |

---

## Task 63: Create VariantManager

### Overview
Create custom Manager that uses VariantQuerySet.

### Dependencies
- VariantQuerySet complete (Tasks 55-62)

### Instructions

1. **Define VariantManager class**
   - Inherit from models.Manager
   - Use VariantQuerySet as QuerySet

2. **Connect manager to queryset**
   - Override get_queryset method
   - Return VariantQuerySet instance

### Implementation

```python
class VariantManager(models.Manager):
    """Custom manager for ProductVariant."""
    
    def get_queryset(self):
        return VariantQuerySet(self.model, using=self._db)
    
    # Additional manager-level methods
```

### Manager vs QuerySet

| Component | Purpose | Methods |
|-----------|---------|---------|
| **QuerySet** | Chainable filters | active(), in_stock(), for_product() |
| **Manager** | Lookup methods | get_by_options(), create_variant() |

### Verification Checklist
- [ ] VariantManager class defined
- [ ] get_queryset returns VariantQuerySet
- [ ] Inherits QuerySet methods

---

## Task 64: Add get_by_options Method

### Overview
Add method to find variant by exact option combination.

### Dependencies
- Task 63: VariantManager defined

### Instructions

1. **Add get_by_options method**
   - Accepts list of option values or dict
   - Finds variant matching exact combination
   - Returns variant or None

2. **Support dict input**
   - {'Size': 'M', 'Color': 'Red'}
   - Lookup by option type name and value

### Implementation

```python
def get_by_options(self, product, options):
    """
    Get variant by exact option combination.
    
    Args:
        product: Product instance or ID
        options: List of VariantOptionValue or dict like {'Size': 'M', 'Color': 'Red'}
    
    Returns:
        ProductVariant or None
    """
    # Implementation details in document body
```

### Usage Examples

**Example 1: Using option value objects**
```python
size_m = VariantOptionValue.objects.get(value='m')
color_red = VariantOptionValue.objects.get(value='red')

variant = ProductVariant.objects.get_by_options(
    product=product,
    options=[size_m, color_red]
)
```

**Example 2: Using dict**
```python
variant = ProductVariant.objects.get_by_options(
    product=product,
    options={'Size': 'Medium', 'Color': 'Red'}
)
```

### Business Use Cases

**Use Case: Add to Cart**
```
1. Customer selects: Size = Medium, Color = Red
2. System calls: get_by_options(product, {'Size': 'M', 'Color': 'Red'})
3. Returns: TSHIRT-M-RED variant
4. Adds variant to cart
```

**Use Case: POS Lookup**
```
1. Cashier scans product
2. Selects options on screen
3. System finds exact variant
4. Adds to transaction
```

### Verification Checklist
- [ ] get_by_options method added
- [ ] Accepts list or dict
- [ ] Finds exact match
- [ ] Returns variant or None
- [ ] Handles missing combinations

---

## Task 65: Assign Manager to Model

### Overview
Assign VariantManager to ProductVariant model.

### Dependencies
- Task 63-64: VariantManager complete

### Instructions

1. **Add manager to ProductVariant model**
   - In ProductVariant class
   - Replace default objects manager

2. **Update variant_managers.py exports**
   - Export VariantManager and VariantQuerySet

3. **Update model imports**
   - Import manager in product_variant.py

### Model Assignment

**In product_variant.py:**
```python
from .variant_managers import VariantManager

class ProductVariant(TenantAwareModel):
    # ... fields ...
    
    objects = VariantManager()
    
    class Meta:
        # ... meta options ...
```

### Manager Usage

```python
# All VariantQuerySet methods available
active_variants = ProductVariant.objects.active()

# Manager-specific methods
variant = ProductVariant.objects.get_by_options(product, options)

# Chaining works
variants = ProductVariant.objects.active().for_product(product_id).with_prices()
```

### Verification Checklist
- [ ] VariantManager assigned to ProductVariant.objects
- [ ] Manager exported from variant_managers.py
- [ ] Import in product_variant.py correct
- [ ] No import errors

---

## Task 66: Test Manager Methods

### Overview
Create tests for VariantManager and VariantQuerySet methods.

### Dependencies
- Tasks 63-65: Manager assigned to model

### Instructions

1. **Create test_variant_managers.py**
   - Location: `backend/apps/products/tests/test_variant_managers.py`

2. **Test all QuerySet methods**
   - Test active()
   - Test in_stock()
   - Test for_product()
   - Test by_option()
   - Test with_prices()
   - Test with_stock()

3. **Test Manager methods**
   - Test get_by_options()
   - Test with various option combinations

4. **Test method chaining**
   - Test multiple filters chained
   - Verify query count optimization

### Test Scenarios

**Test 1: Active Filter**
```python
def test_active_filter(self):
    active_count = ProductVariant.objects.active().count()
    assert active_count == expected_active_count
```

**Test 2: For Product**
```python
def test_for_product_filter(self):
    variants = ProductVariant.objects.for_product(self.product.id)
    assert variants.count() == self.product.variants.count()
```

**Test 3: Get By Options**
```python
def test_get_by_options(self):
    variant = ProductVariant.objects.get_by_options(
        product=self.product,
        options=[self.size_m, self.color_red]
    )
    assert variant.sku == 'TSHIRT-M-RED'
```

**Test 4: Method Chaining**
```python
def test_method_chaining(self):
    variants = (ProductVariant.objects
        .active()
        .for_product(self.product.id)
        .in_stock())
    assert variants.count() > 0
```

**Test 5: Query Optimization**
```python
def test_with_prices_optimization(self):
    with self.assertNumQueries(2):  # Only 2 queries expected
        variants = ProductVariant.objects.active().with_prices()
        for v in variants:
            _ = v.prices.all()  # No additional queries
```

### Verification Checklist
- [ ] test_variant_managers.py created
- [ ] All QuerySet methods tested
- [ ] Manager methods tested
- [ ] Chaining tested
- [ ] Query optimization verified
- [ ] Edge cases covered
- [ ] All tests passing

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Create VariantManager | Manager class |
| 64 | Add get_by_options Method | Option lookup method |
| 65 | Assign Manager to Model | Manager assignment |
| 66 | Test Manager Methods | Test suite |

### Group D Complete

All tasks in Group D (Variant Managers & QuerySets) complete:
- ✅ VariantQuerySet with 6 methods
- ✅ VariantManager with lookup methods
- ✅ Manager assigned to model
- ✅ Comprehensive tests

### Features Delivered

**VariantQuerySet Methods:**
- active() - Filter active variants
- in_stock() - Filter variants with stock
- for_product() - Filter by product
- by_option() - Filter by option values
- with_prices() - Prefetch prices
- with_stock() - Prefetch stock

**VariantManager Methods:**
- get_by_options() - Find exact option match

### Business Value

Custom managers enable:
- Cleaner, more maintainable code
- Optimized database queries
- Reusable filter logic
- Better performance
- Easier testing

### Next Steps
1. Proceed to [Group-E_Serializers-Views](../Group-E_Serializers-Views/) for API serializers and views

---

## Notes for AI Agents

1. **Manager vs QuerySet:** Manager for lookup/creation, QuerySet for filtering
2. **Method Chaining:** All QuerySet methods must return QuerySet
3. **Query Optimization:** Always prefetch in list views
4. **Testing:** Test query count to verify optimization
5. **get_by_options:** Critical for cart/checkout functionality
6. **Type Hints:** Add for better IDE support
7. **Documentation:** Document all public methods
8. **Edge Cases:** Handle missing options gracefully
