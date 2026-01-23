# Tasks 32-36: Bundle Manager & Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** B - Bundle Stock & Pricing Logic  
> **Document:** 03 of 03  
> **Tasks Covered:** 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-27-31_Bundle-Pricing-Service.md](02_Tasks-27-31_Bundle-Pricing-Service.md)
- **→ Next Group:** [../Group-C_Composite-Product-BOM/](../Group-C_Composite-Product-BOM/)

---

## Document Overview

This document creates a custom Django manager for ProductBundle to provide optimized querysets and common filtering methods. It also implements initial tests for bundle stock and pricing logic to ensure calculations work correctly.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 32 | Create Bundle Manager | Medium | 10 min |
| 33 | Add active Method | Low | 5 min |
| 34 | Add available Method | Medium | 10 min |
| 35 | Add with_items Method | Low | 5 min |
| 36 | Test Bundle Logic | High | 20 min |

---

## Task 32: Create Bundle Manager

### Overview
Create a custom Django manager for ProductBundle model to provide common querysets and optimize database access patterns.

### Dependencies
- Task 31: Add get_savings Method

### Instructions

1. **Create manager in bundle.py or separate file**
   - Class name: BundleManager
   - Inherit from models.Manager
   - Place before ProductBundle model or in managers/ directory

2. **Add manager docstring**
   - Describe custom queryset methods
   - Note optimization strategies

3. **Plan manager methods**
   - active(): filter active bundles
   - available(): bundles with stock
   - with_items(): prefetch bundle items

4. **Add to ProductBundle model**
   - Add: objects = BundleManager()
   - Replaces default manager

### Expected Outcome
BundleManager class is defined and attached to ProductBundle model.

### Verification Checklist
- [ ] BundleManager class defined
- [ ] Inherits from models.Manager
- [ ] Attached to ProductBundle as objects

---

## Task 33: Add active Method

### Overview
Add manager method to filter only active bundles, commonly used in storefront queries.

### Dependencies
- Task 32: Create Bundle Manager

### Instructions

1. **Define active method**
   - Returns queryset of active bundles
   - Filter: is_active=True

2. **Add method docstring**
   - Explain: Returns only active bundles

3. **Return filtered queryset**
   - Use self.filter(is_active=True)
   - Allows further chaining

### Method Usage
```
Active bundles:
ProductBundle.objects.active()

Active bundles with specific type:
ProductBundle.objects.active().filter(bundle_type='dynamic')
```

### Expected Outcome
active() method filters for active bundles only.

### Verification Checklist
- [ ] Method filters is_active=True
- [ ] Returns queryset for chaining
- [ ] Docstring present

---

## Task 34: Add available Method

### Overview
Add manager method to filter bundles that have stock available (at least 1 bundle can be created).

### Dependencies
- Task 33: Add active Method

### Instructions

1. **Define available method**
   - Returns bundles with available stock
   - More complex than simple filter

2. **Implementation options**
   - Option A: Filter in Python (check each bundle)
   - Option B: Annotate with stock calculation
   - Option C: Use subquery for stock check

3. **Simple implementation**
   - Get active bundles
   - For each, check if get_available_stock() > 0
   - Return IDs, then filter queryset

4. **Note performance considerations**
   - May be expensive for many bundles
   - Consider caching results
   - Use on smaller querysets

### Implementation Strategy
```
def available(self):
    active_bundles = self.active()
    available_ids = []
    
    for bundle in active_bundles:
        service = BundleStockService(bundle)
        if service.get_available_stock() > 0:
            available_ids.append(bundle.id)
    
    return self.filter(id__in=available_ids)
```

### Expected Outcome
available() method returns bundles with stock.

### Verification Checklist
- [ ] Checks stock availability
- [ ] Returns queryset
- [ ] Performance considered

---

## Task 35: Add with_items Method

### Overview
Add manager method to prefetch bundle items, reducing N+1 query problems when accessing bundle contents.

### Dependencies
- Task 34: Add available Method

### Instructions

1. **Define with_items method**
   - Prefetch related bundle items
   - Include product and variant data

2. **Use prefetch_related**
   - Prefetch: items
   - Prefetch: items__product
   - Prefetch: items__variant

3. **Use select_related as needed**
   - Select product FK
   - Optimize single queries

### Prefetch Pattern
```
def with_items(self):
    return self.prefetch_related(
        'items',
        'items__product',
        'items__variant'
    ).select_related('product')
```

### Usage
```
Efficient bundle query:
bundles = ProductBundle.objects.active().with_items()

for bundle in bundles:
    for item in bundle.items.all():  # No additional queries
        print(item.product.name)
```

### Expected Outcome
with_items() method optimizes bundle item access.

### Verification Checklist
- [ ] Prefetches items relationship
- [ ] Includes product and variant
- [ ] Reduces query count

---

## Task 36: Test Bundle Logic

### Overview
Create initial tests for bundle stock and pricing services to verify calculations work correctly.

### Dependencies
- Task 35: Add with_items Method

### Instructions

1. **Create test file**
   - File: tests/test_bundle_services.py
   - Import test framework (pytest or Django TestCase)
   - Import models and services

2. **Create test fixtures**
   - Create test tenant
   - Create test products with stock
   - Create test bundle with items
   - Use factories if available

3. **Test stock calculations**
   - Test get_available_stock with various scenarios
   - Test check_availability
   - Test get_limiting_item identification
   - Test reserve_stock transaction

4. **Test pricing calculations**
   - Test fixed price bundles
   - Test dynamic price calculation
   - Test percentage discount
   - Test fixed discount
   - Test savings calculation

5. **Test edge cases**
   - Zero stock scenarios
   - No items in bundle
   - Optional vs required items
   - Variant vs product pricing

6. **Test tenant isolation**
   - Ensure bundles are tenant-scoped
   - Verify cross-tenant access blocked

### Test Structure
```
class TestBundleStockService:
    def test_available_stock_calculation()
    def test_limiting_item_identification()
    def test_stock_reservation()

class TestBundlePricingService:
    def test_fixed_pricing()
    def test_dynamic_pricing()
    def test_percentage_discount()
    def test_savings_calculation()
```

### Expected Outcome
Initial test suite verifies bundle logic correctness.

### Verification Checklist
- [ ] Test file created
- [ ] Stock service tests implemented
- [ ] Pricing service tests implemented
- [ ] Edge cases covered
- [ ] Tests pass successfully

---

## Summary of Tasks 32-36

### What Was Accomplished
- Created BundleManager for optimized queries
- Added active() filter method
- Implemented available() stock check
- Added with_items() prefetch method
- Created comprehensive test suite

### BundleManager Methods
```
ProductBundle.objects:
  ├── active() → Active bundles only
  ├── available() → Bundles with stock
  └── with_items() → Prefetch items & products
```

### Common Query Patterns
```
# Active bundles with items
bundles = ProductBundle.objects.active().with_items()

# Available bundles only
in_stock = ProductBundle.objects.available()

# Chain filters
dynamic_bundles = ProductBundle.objects.active()\
    .filter(bundle_type='dynamic')\
    .with_items()
```

### Group B Complete
All bundle stock and pricing logic is now implemented. Services provide stock calculations, pricing logic, and discount application. Custom manager optimizes queries. Tests verify correctness.

---

## Notes for Developers

### Manager Usage
- Use active() for storefront queries
- Use with_items() when displaying bundle contents
- Chain methods for complex queries
- Consider pagination for large result sets

### Testing Strategy
- Test calculations with realistic data
- Verify edge cases don't break logic
- Test concurrent operations
- Ensure tenant isolation
- Test transaction rollback

### Performance Tips
- Prefetch items when displaying bundles
- Cache stock calculations temporarily
- Use database transactions for reservations
- Consider materialized views for reporting

### Next Group
Group C will implement Bill of Materials (BOM) models for composite/manufactured products.

---
