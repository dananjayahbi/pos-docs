# Tasks 81-83: Decorator and Session Tests

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 04  
> **Tasks Covered:** 81, 82, 83

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-77-80_Test-Setup-Isolation.md](01_Tasks-77-80_Test-Setup-Isolation.md)
- **→ Next Document:** [03_Tasks-84-87_Documentation.md](03_Tasks-84-87_Documentation.md)

---

## Document Overview

This document covers testing cache decorators, invalidation patterns, and session caching.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Test Cache Decorators | Medium |
| 82 | Test Invalidation Patterns | Medium |
| 83 | Test Session Caching | Simple |

---

## Task 81: Test Cache Decorators

### Overview
Comprehensive testing of cache decorators (already partially done in Group D Task 62, complete here).

### Dependencies
- Task 80: Test Cache Isolation

### Instructions

1. **Test cache_response decorator**
   - Test view response caching
   - Test cache hits and misses
   - Test with different timeout values
   - Test custom cache keys
   - Test vary_on_tenant
   - Test vary_on_user

2. **Test with DRF views**
   - Test with APIView
   - Test with ViewSet
   - Test serialization

3. **Test cache_queryset decorator**
   - Test QuerySet result caching
   - Test with complex queries
   - Verify results match fresh query
   - Test invalidation

4. **Test cache_method decorator**
   - Test method result caching
   - Test with instance methods
   - Test with class methods
   - Test argument hashing

5. **Test decorator combinations**
   - Multiple decorators on same view
   - Verify correct behavior

6. **Test error handling**
   - Test with cache unavailable
   - Verify graceful degradation

### Test Example
```
def test_cache_response_decorator(client):
    @cache_response(timeout=300)
    def test_view(request):
        return Response({'data': 'test'})
    
    # First call - cache miss
    response1 = test_view(request)
    
    # Second call - cache hit
    response2 = test_view(request)
    
    # Should be same response
    assert response1.data == response2.data
```

### Verification
- All decorators tested
- Various scenarios covered
- Tests pass

---

## Task 82: Test Invalidation Patterns

### Overview
Test automatic cache invalidation via signals.

### Dependencies
- Task 81: Test Cache Decorators

### Instructions

1. **Test model save invalidation**
   - Create model instance
   - Cache some data
   - Update model
   - Verify cache invalidated

2. **Test model delete invalidation**
   - Cache model data
   - Delete model
   - Verify cache cleared

3. **Test related model invalidation**
   - Cache data from model A and B (related)
   - Update model A
   - Verify model B cache invalidated

4. **Test CacheMixin behavior**
   - Test with mixin-enabled model
   - Test custom invalidation rules
   - Test invalidate_cache() method

5. **Test transaction.on_commit**
   - Start transaction
   - Modify model (triggers signal)
   - Verify cache NOT invalidated yet
   - Commit transaction
   - Verify cache NOW invalidated

6. **Test transaction rollback**
   - Start transaction
   - Modify model
   - Rollback transaction
   - Verify cache NOT invalidated

### Transaction Test Example
```
def test_on_commit_invalidation():
    product = Product.objects.create(name='Test')
    cache.set('products:list', ['data'])
    
    with transaction.atomic():
        product.name = 'Updated'
        product.save()
        # Cache still has old data (not committed)
        assert cache.get('products:list') == ['data']
    
    # After commit, cache invalidated
    assert cache.get('products:list') is None
```

### Verification
- Signal-based invalidation tested
- Transaction behavior verified
- Rollback handling correct

---

## Task 83: Test Session Caching

### Overview
Test Django session caching with Redis/cache backend.

### Dependencies
- Task 82: Test Invalidation Patterns

### Instructions

1. **Test session storage**
   - Set session data
   - Retrieve session data
   - Verify stored in cache

2. **Test session expiration**
   - Set session with timeout
   - Wait or manipulate time
   - Verify session expires

3. **Test session across requests**
   - Create session in request 1
   - Access session in request 2
   - Verify session persists

4. **Test anonymous sessions**
   - Test with anonymous user
   - Verify session created

5. **Test authenticated sessions**
   - Test with logged-in user
   - Verify user data in session

6. **Test session isolation**
   - Multiple users
   - Verify each has own session

### Session Test Example
```
def test_session_caching(client):
    # Set session data
    session = client.session
    session['key'] = 'value'
    session.save()
    
    # Verify stored in cache
    cache = caches['sessions']
    session_key = f'django.contrib.sessions:{session.session_key}'
    assert cache.get(session_key) is not None
    
    # Retrieve in new request
    response = client.get('/some-view/')
    assert response.wsgi_request.session['key'] == 'value'
```

### Verification
- Session caching tested
- Expiration works
- Isolation verified

---

## Expected Outcome After This Document

```
backend/apps/core/tests/test_cache/
├── test_decorators.py    # Complete decorator tests
├── test_invalidation.py  # Complete invalidation tests
└── test_sessions.py      # New session tests
```

---

## Notes for AI Agents

1. **Decorator Tests:** Already started in Group D, complete here
2. **Transaction Tests:** Critical for data consistency
3. **Session Tests:** Verify cache backend works for sessions
4. **Git Commit:** Commit complete test suite

---

## Validation Checklist

- [ ] Cache decorator tests complete
- [ ] All decorator scenarios covered
- [ ] Invalidation patterns tested
- [ ] Signal behavior verified
- [ ] Transaction behavior tested
- [ ] Session caching tested
- [ ] Session isolation verified
- [ ] All tests passing
- [ ] Test coverage > 90%
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [03_Tasks-84-87_Documentation.md](03_Tasks-84-87_Documentation.md) to create comprehensive caching documentation.
