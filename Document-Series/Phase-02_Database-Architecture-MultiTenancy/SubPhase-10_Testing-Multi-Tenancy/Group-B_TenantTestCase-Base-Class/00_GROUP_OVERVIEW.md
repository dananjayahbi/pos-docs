# Group B: TenantTestCase Base Class

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 10 - Testing Multi-Tenancy  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Create the TenantTestCase base class for multi-tenant tests

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Test-Infrastructure/](../Group-A_Test-Infrastructure/)
- **→ Next Group:** [../Group-C_Test-Fixtures-Factories/](../Group-C_Test-Fixtures-Factories/)

---

## Group Overview

This group creates the TenantTestCase base class that provides automatic tenant setup and teardown, tenant context management, and assertion helpers for multi-tenant tests.

### Key Outcomes
- Create TenantTestCase class
- Extend Django TestCase
- Create setUp method with tenant creation
- Create tearDown method with cleanup
- Create test tenant automatically
- Set tenant context before tests
- Create tenant context manager
- Create MultiTenantTestMixin
- Create two-tenant test setup
- Create tenant switching helper
- Create schema assertion helper
- Create isolation assertion helper
- Add transaction rollback
- Document TenantTestCase usage

### Technology Context
- **Base Class:** Extends Django TestCase
- **Context Manager:** with tenant: block
- **Assertions:** Custom assertion methods
- **Rollback:** Automatic transaction rollback

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_Base-Class-Setup.md | 15-20 | TenantTestCase, extend, setUp, tearDown, test tenant, context |
| 02 | 02_Tasks-21-25_Mixin-Helpers.md | 21-25 | Context manager, mixin, two-tenant, switching, schema assertion |
| 03 | 03_Tasks-26-28_Isolation-Rollback-Docs.md | 26-28 | Isolation assertion, rollback, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Create TenantTestCase Class | Task 14 | Medium |
| 16 | Extend Django TestCase | Task 15 | Simple |
| 17 | Create setUp Method | Task 16 | Medium |
| 18 | Create tearDown Method | Task 17 | Medium |
| 19 | Create Test Tenant | Task 17 | Medium |
| 20 | Set Tenant Context | Task 19 | Medium |
| 21 | Create Tenant Context Manager | Task 20 | Medium |
| 22 | Create Multi-Tenant Test Mixin | Task 21 | Medium |
| 23 | Create Two-Tenant Setup | Task 22 | Medium |
| 24 | Create Tenant Switching Helper | Task 23 | Simple |
| 25 | Create Schema Assertion Helper | Task 24 | Simple |
| 26 | Create Isolation Assertion | Task 25 | Medium |
| 27 | Add Transaction Rollback | Task 26 | Simple |
| 28 | Document TenantTestCase | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-15-20_Base-Class-Setup.md
        │
        ▼
02_Tasks-21-25_Mixin-Helpers.md
        │
        ▼
03_Tasks-26-28_Isolation-Rollback-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── tests/
    ├── base.py           # TenantTestCase
    └── mixins.py         # MultiTenantTestMixin

docs/
└── testing/
    └── tenant-test-case.md
```

---

## TenantTestCase Usage

```python
from tests.base import TenantTestCase

class ProductTests(TenantTestCase):
    """Tests run in tenant context automatically."""
    
    def test_create_product(self):
        # self.tenant is automatically created
        product = Product.objects.create(name="Test Product")
        self.assertEqual(product.name, "Test Product")
        
    def test_isolation(self):
        # Assert data isolation between tenants
        self.assertTenantIsolation(Product, 'name')
```

---

## Two-Tenant Test Setup

```python
from tests.mixins import MultiTenantTestMixin

class CrossTenantTests(TenantTestCase, MultiTenantTestMixin):
    """Tests with two tenants for isolation verification."""
    
    def setUp(self):
        super().setUp()
        self.setup_two_tenants()  # Creates self.tenant_a, self.tenant_b
    
    def test_tenant_a_cannot_see_b_data(self):
        with self.tenant_context(self.tenant_a):
            Product.objects.create(name="Product A")
        
        with self.tenant_context(self.tenant_b):
            products = Product.objects.all()
            self.assertEqual(products.count(), 0)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (infrastructure ready)
2. **Base Class:** All tenant tests inherit from TenantTestCase
3. **Auto Setup:** Tenant created automatically in setUp
4. **Context Manager:** Use `with tenant_context():` for switching
5. **Rollback:** Tests automatically rolled back
6. **Git Commit:** Commit after completing this group

