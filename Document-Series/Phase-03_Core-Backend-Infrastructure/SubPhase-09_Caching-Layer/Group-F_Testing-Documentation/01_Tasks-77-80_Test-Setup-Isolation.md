# Tasks 77-80: Test Setup and Isolation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 04  
> **Tasks Covered:** 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Invalidation-Patterns/](../Group-E_Invalidation-Patterns/)
- **→ Next Document:** [02_Tasks-81-83_Decorator-Session-Tests.md](02_Tasks-81-83_Decorator-Session-Tests.md)

---

## Document Overview

This document covers setting up cache testing infrastructure and verifying tenant cache isolation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 77 | Create Cache Test Utils | Medium |
| 78 | Configure Test Cache Backend | Simple |
| 79 | Test TenantCache Class | Medium |
| 80 | Test Cache Isolation | Medium |

---

## Task 77: Create Cache Test Utils

### Overview
Create test utilities and fixtures for cache testing.

### Dependencies
- Task 76: Test Invalidation (Group E)

### Instructions

1. **Create conftest.py**
   - Location: apps/core/tests/test_cache/conftest.py
   - Define pytest fixtures
   - Set up test utilities

2. **Create mock tenant fixture**
   - Mock tenant context for tests
   - Switch between tenants easily
   - Clean up after tests

3. **Create cache clear fixture**
   - Clear cache before each test
   - Ensure test isolation
   - Auto-use fixture

4. **Create sample data fixtures**
   - Test models with cache
   - Sample users, products, etc.
   - Reusable across tests

5. **Create helper functions**
   - set_tenant(schema): Switch tenant
   - clear_all_cache(): Clear all test cache
   - get_cache_keys(pattern): List matching keys

### Fixture Examples
```
@pytest.fixture
def clear_cache():
    cache.clear()
    yield
    cache.clear()

@pytest.fixture
def tenant_context(tenant):
    # Set up tenant context
    yield tenant
    # Clean up

@pytest.fixture
def sample_product():
    return Product.objects.create(name='Test')
```

### Verification
- conftest.py created
- Fixtures defined
- Helper functions created

---

## Task 78: Configure Test Cache Backend

### Overview
Configure test-specific cache backend (LocMemCache) for fast, isolated testing.

### Dependencies
- Task 77: Create Cache Test Utils

### Instructions

1. **Create test settings**
   - File: config/settings/test.py (if not exists)
   - Override cache settings

2. **Use LocMemCache for tests**
   - Fast in-memory cache
   - No Redis dependency
   - Isolated per test run

3. **Configure test CACHES**
   - Replace Redis with LocMemCache
   - Keep same structure
   - Same aliases (default, sessions)

4. **Disable persistent cache**
   - Tests should be repeatable
   - No state between test runs

5. **Document test configuration**
   - Explain LocMemCache choice
   - Note differences from Redis
   - Mention integration tests need Redis

### Test Cache Configuration
```
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'test-cache',
    },
    'sessions': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'test-sessions',
    },
}
```

### Verification
- test.py settings configured
- LocMemCache used in tests
- Tests don't require Redis

---

## Task 79: Test TenantCache Class

### Overview
Write comprehensive tests for TenantCache class.

### Dependencies
- Task 78: Configure Test Cache Backend

### Instructions

1. **Test initialization**
   - Test cache backend loading
   - Test different cache aliases

2. **Test make_key method**
   - Test key prefixing
   - Test tenant scoping
   - Test long key hashing

3. **Test get/set/delete**
   - Test basic operations
   - Test with different data types
   - Test expiration

4. **Test bulk operations**
   - Test get_many/set_many
   - Test with multiple keys

5. **Test counter operations**
   - Test incr/decr
   - Test atomic behavior

6. **Test pattern deletion**
   - Test delete_pattern
   - Test wildcard matching

7. **Test error handling**
   - Test cache unavailable
   - Test invalid keys
   - Test connection errors

### Test Cases
```
class TestTenantCache:
    def test_make_key(self, tenant):
        cache = TenantCache()
        key = cache.make_key('products:list')
        assert 'tenant:' in key
        assert tenant.schema_name in key
    
    def test_get_set(self, tenant):
        cache = TenantCache()
        cache.set('test', 'value')
        assert cache.get('test') == 'value'
    
    # More tests...
```

### Verification
- TenantCache fully tested
- All methods covered
- Edge cases tested

---

## Task 80: Test Cache Isolation

### Overview
Verify that cache is properly isolated between tenants.

### Dependencies
- Task 79: Test TenantCache Class

### Instructions

1. **Create multi-tenant test**
   - Set up two test tenants
   - Switch between them
   - Verify isolation

2. **Test data separation**
   - Set key in tenant A
   - Switch to tenant B
   - Verify key not accessible

3. **Test same key different tenants**
   - Set 'products:list' in tenant A with value 'A'
   - Set 'products:list' in tenant B with value 'B'
   - Verify each tenant gets correct value

4. **Test pattern operations**
   - Clear pattern in tenant A
   - Verify tenant B unaffected

5. **Test public schema**
   - Test shared data in public schema
   - Verify accessible from all tenants

6. **Document isolation tests**
   - Critical security tests
   - Explain importance
   - Add to CI pipeline

### Isolation Test Example
```
def test_tenant_isolation(tenant_a, tenant_b):
    # Tenant A sets key
    with tenant_context(tenant_a):
        cache = get_tenant_cache()
        cache.set('secret', 'tenant_a_data')
    
    # Tenant B cannot see it
    with tenant_context(tenant_b):
        cache = get_tenant_cache()
        assert cache.get('secret') is None
    
    # Tenant B sets same key
    with tenant_context(tenant_b):
        cache.set('secret', 'tenant_b_data')
        assert cache.get('secret') == 'tenant_b_data'
    
    # Tenant A still has own data
    with tenant_context(tenant_a):
        cache = get_tenant_cache()
        assert cache.get('secret') == 'tenant_a_data'
```

### Critical Test Scenarios
| Scenario | Expected Behavior |
|----------|------------------|
| **Same key, different tenants** | Each tenant sees own data |
| **Pattern delete in one tenant** | Other tenants unaffected |
| **Public schema data** | Accessible from all tenants |
| **No tenant context** | Uses public or error |

### Verification
- Isolation tests created
- Multi-tenant scenarios covered
- All isolation tests pass
- Security verified

---

## Expected Outcome After This Document

```
backend/apps/core/tests/test_cache/
├── conftest.py           # Test fixtures
├── test_tenant_cache.py  # Updated with isolation tests
```

---

## Sri Lanka-Specific Considerations

- **Multi-Tenant:** Critical for SaaS serving multiple Sri Lankan businesses
- **Data Privacy:** Isolation ensures customer data privacy
- **Testing:** Verify with realistic Sri Lankan tenant scenarios

---

## Notes for AI Agents

1. **LocMemCache:** Fast for unit tests, use Redis for integration tests
2. **Fixtures:** Reusable fixtures improve test maintainability
3. **Isolation:** Most critical test for multi-tenant caching
4. **conftest.py:** Centralize test configuration
5. **Git Commit:** Commit test infrastructure

---

## Validation Checklist

- [ ] conftest.py created with fixtures
- [ ] Test cache backend configured
- [ ] LocMemCache used for tests
- [ ] TenantCache class fully tested
- [ ] Isolation tests created
- [ ] Multi-tenant scenarios covered
- [ ] All tests passing
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [02_Tasks-81-83_Decorator-Session-Tests.md](02_Tasks-81-83_Decorator-Session-Tests.md) for decorator and session testing.
