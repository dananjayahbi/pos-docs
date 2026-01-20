# Group C: Test Fixtures & Factories

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 10 - Testing Multi-Tenancy  
> **Group:** C of F  
> **Tasks Covered:** 29-44  
> **Group Goal:** Create test data factories and fixtures for all models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_TenantTestCase-Base-Class/](../Group-B_TenantTestCase-Base-Class/)
- **→ Next Group:** [../Group-D_Isolation-Verification-Tests/](../Group-D_Isolation-Verification-Tests/)

---

## Group Overview

This group creates Factory Boy factories for all models and JSON fixtures for test data. Factories automatically respect tenant context.

### Key Outcomes
- Create TenantFactory
- Create DomainFactory
- Create ProductFactory
- Create CategoryFactory
- Create CustomerFactory
- Create OrderFactory
- Create UserFactory
- Create tenant fixtures JSON
- Create sample data fixtures
- Create minimal fixture
- Create full fixture
- Create load fixture helper
- Create random data generator
- Create bulk data generator
- Verify factory isolation
- Document fixtures

### Technology Context
- **Factory Boy:** Model factories
- **Faker:** Random data generation
- **Fixtures:** JSON data files
- **Bulk:** Large dataset generation

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-34_Model-Factories.md | 29-34 | Tenant, Domain, Product, Category, Customer, Order factories |
| 02 | 02_Tasks-35-40_User-Fixtures.md | 35-40 | User factory, tenant fixtures, sample data, minimal, full, load helper |
| 03 | 03_Tasks-41-44_Generators-Verify-Docs.md | 41-44 | Random generator, bulk generator, verify isolation, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Create TenantFactory | Task 28 | Medium |
| 30 | Create DomainFactory | Task 29 | Simple |
| 31 | Create ProductFactory | Task 29 | Medium |
| 32 | Create CategoryFactory | Task 31 | Simple |
| 33 | Create CustomerFactory | Task 29 | Medium |
| 34 | Create OrderFactory | Task 33 | Medium |
| 35 | Create UserFactory | Task 29 | Medium |
| 36 | Create Tenant Fixtures JSON | Task 29 | Simple |
| 37 | Create Sample Data Fixtures | Task 36 | Medium |
| 38 | Create Minimal Fixture | Task 37 | Simple |
| 39 | Create Full Fixture | Task 37 | Medium |
| 40 | Create Load Fixture Helper | Task 39 | Medium |
| 41 | Create Random Data Generator | Task 40 | Medium |
| 42 | Create Bulk Data Generator | Task 41 | Medium |
| 43 | Verify Factory Isolation | Task 42 | Medium |
| 44 | Document Fixtures | Task 43 | Simple |

---

## Execution Order

```
01_Tasks-29-34_Model-Factories.md
        │
        ▼
02_Tasks-35-40_User-Fixtures.md
        │
        ▼
03_Tasks-41-44_Generators-Verify-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── tests/
    ├── factories/
    │   ├── __init__.py
    │   ├── tenant_factories.py
    │   ├── product_factories.py
    │   ├── customer_factories.py
    │   └── order_factories.py
    ├── fixtures/
    │   ├── tenants.json
    │   ├── sample_data.json
    │   ├── minimal.json
    │   └── full.json
    └── utils/
        ├── data_generators.py
        └── fixture_loader.py

docs/
└── testing/
    └── fixtures.md
```

---

## Factory Example

```python
import factory
from factory.django import DjangoModelFactory
from apps.products.models import Product

class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Product
    
    name = factory.Faker('product_name')
    sku = factory.Sequence(lambda n: f'SKU-{n:06d}')
    price = factory.Faker('pydecimal', left_digits=4, right_digits=2, positive=True)
    quantity = factory.Faker('random_int', min=0, max=1000)
    category = factory.SubFactory('tests.factories.CategoryFactory')
    is_active = True

# Usage
product = ProductFactory()  # Creates in current tenant context
products = ProductFactory.create_batch(10)  # Create 10 products
```

---

## Bulk Data Generator

```python
def generate_bulk_data(tenant, count=1000):
    """Generate bulk test data for performance testing."""
    with tenant_context(tenant):
        CategoryFactory.create_batch(10)
        ProductFactory.create_batch(count)
        CustomerFactory.create_batch(count // 10)
        OrderFactory.create_batch(count // 5)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (TenantTestCase ready)
2. **Factory Boy:** Use DjangoModelFactory as base
3. **Faker:** Use for realistic fake data
4. **Tenant Context:** Factories respect current tenant
5. **Bulk:** Support for large dataset generation
6. **Git Commit:** Commit after completing this group

