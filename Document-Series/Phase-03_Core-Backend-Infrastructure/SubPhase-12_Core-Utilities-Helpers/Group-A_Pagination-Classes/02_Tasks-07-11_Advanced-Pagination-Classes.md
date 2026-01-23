# Tasks 07-11: Advanced Pagination Classes

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** A - Pagination Classes  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_Pagination-Module-Setup.md](01_Tasks-01-06_Pagination-Module-Setup.md)
- **→ Next Document:** [03_Tasks-12-16_Response-Format-Export.md](03_Tasks-12-16_Response-Format-Export.md)

---

## Document Overview

This document covers the implementation of advanced pagination classes including cursor-based pagination for real-time data feeds and limit/offset pagination for flexible querying. These patterns complement the standard pagination from Document 01.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 07 | Create CursorPagination Class | Medium |
| 08 | Configure Cursor Ordering | Low |
| 09 | Create LimitOffsetPagination | Medium |
| 10 | Configure Default Limit | Low |
| 11 | Configure Max Limit | Low |

---

## Task 07: Create CursorPagination Class

### Overview
Create the CursorPagination class for efficient pagination of large, frequently changing datasets such as activity feeds, notifications, and real-time inventory updates.

### Dependencies
- Task 06: Add page_size Query Param

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Import CursorPagination from DRF**
   - Add import: `from rest_framework.pagination import CursorPagination`
   - Place with other pagination imports

3. **Create LCCCursorPagination class**
   - Define new class that inherits from `CursorPagination`
   - Use prefix "LCC" to distinguish from DRF's default
   - Add comprehensive class docstring

4. **Document cursor pagination behavior**
   - Explain cursor-based navigation
   - No page numbers, uses opaque cursor tokens
   - Efficient for real-time data
   - Cannot jump to arbitrary pages

5. **Add class-level documentation**
   - Document query parameters: cursor
   - Explain forward/backward navigation
   - List ideal use cases
   - Note limitations

6. **Prepare configuration attributes**
   - Leave placeholder for `page_size` (will use 20 like StandardPagination)
   - Leave placeholder for `ordering` attribute (Task 08)
   - Note that `cursor_query_param` defaults to 'cursor' in DRF

### Cursor Pagination Characteristics

| Feature | Behavior |
|---------|----------|
| **Query Param** | `?cursor=cD0yMDIzLTA...` (opaque token) |
| **Navigation** | Next/previous only, no page jumping |
| **Consistency** | Results remain consistent even with data changes |
| **Performance** | Efficient for large datasets |
| **Use Case** | Activity feeds, notifications, logs |

### When to Use Cursor Pagination

| Scenario | Use Cursor? | Reason |
|----------|-------------|--------|
| **Activity feed** | ✅ Yes | Frequent updates, no page jumping needed |
| **Notifications** | ✅ Yes | Real-time data, consistent ordering |
| **Product catalog** | ❌ No | Users need page jumping |
| **Search results** | ❌ No | Fixed result set, page numbers helpful |
| **Audit logs** | ✅ Yes | Large dataset, chronological order |
| **Inventory updates** | ✅ Yes | Frequent changes, time-ordered |

### Cursor vs Page Number Comparison

| Aspect | Cursor Pagination | Page Number Pagination |
|--------|-------------------|------------------------|
| **Navigation** | Next/Previous only | Jump to any page |
| **Performance** | Constant time O(1) | Slower with page offset |
| **Data changes** | Consistent results | May see duplicates/gaps |
| **User experience** | Linear browsing | Random access |
| **Implementation** | More complex | Simpler |

### Response Format
```json
{
  "next": "http://api.example.com/items/?cursor=cD0yMDIzLTA...",
  "previous": "http://api.example.com/items/?cursor=cj1aTg3LTA...",
  "results": [...]
}
```

### Expected Class Structure
```python
class LCCCursorPagination(CursorPagination):
    """
    Cursor-based pagination for large, frequently changing datasets.
    
    Use for: activity feeds, notifications, real-time data
    Navigation: next/previous only (no page jumping)
    Query param: ?cursor=<token>
    """
    page_size = 20  # Consistent with StandardPagination
    # ordering to be configured in Task 08
```

### Verification Checklist
- [ ] `LCCCursorPagination` class is defined
- [ ] Class inherits from `CursorPagination`
- [ ] Class docstring explains cursor pagination
- [ ] Use cases are documented
- [ ] Limitations are noted
- [ ] Response format is documented

---

## Task 08: Configure Cursor Ordering

### Overview
Configure the default ordering for cursor pagination to ensure consistent, predictable results. Use created_at timestamp with id as tiebreaker.

### Dependencies
- Task 07: Create CursorPagination Class

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Add ordering attribute**
   - In `LCCCursorPagination` class
   - Set `ordering` to `'-created_at'` (newest first)
   - This ensures consistent cursor generation

3. **Add inline comment**
   - Explain descending order (newest first)
   - Note: matches typical use case (recent items first)
   - Mention that views can override if needed

4. **Update class docstring**
   - Document the default ordering
   - Explain the timestamp-based approach
   - Mention override capability

5. **Document ordering requirements**
   - Ordering field must be indexed
   - Should be unique or have unique tiebreaker
   - Recommend using (created_at, id) compound index

### Ordering Considerations

| Ordering Field | Use Case | Tiebreaker |
|----------------|----------|------------|
| **-created_at** | Recent items first (default) | id |
| **created_at** | Oldest items first | id |
| **-modified_at** | Recently updated | id |
| **-priority** | Importance-based | created_at |

### Database Index Recommendations
```sql
-- For cursor pagination performance
CREATE INDEX idx_created_at_id ON table_name (created_at DESC, id DESC);
CREATE INDEX idx_modified_at_id ON table_name (modified_at DESC, id DESC);
```

### Ordering Best Practices

| Practice | Recommendation |
|----------|----------------|
| **Field Selection** | Use indexed timestamp columns |
| **Tiebreaker** | Always include unique field (id) |
| **Consistency** | Same ordering across all requests |
| **Performance** | Create compound indexes |
| **Nulls** | Avoid nullable ordering fields |

### View-Level Override Example
```python
# Views can override ordering if needed
class CustomListView(ListAPIView):
    pagination_class = LCCCursorPagination
    ordering = '-priority'  # Override default
```

### Expected Class Structure
```python
class LCCCursorPagination(CursorPagination):
    """
    Cursor-based pagination for large, frequently changing datasets.
    
    Default ordering: -created_at (newest first)
    Query param: ?cursor=<token>
    """
    page_size = 20          # Consistent with StandardPagination
    ordering = '-created_at' # Newest first by default
```

### Verification Checklist
- [ ] `ordering` attribute is set to `'-created_at'`
- [ ] Inline comment explains ordering choice
- [ ] Class docstring mentions default ordering
- [ ] Database indexing is considered
- [ ] Override capability is documented

---

## Task 09: Create LimitOffsetPagination

### Overview
Create the LimitOffsetPagination class for SQL-style pagination using limit and offset query parameters, providing maximum flexibility for API clients.

### Dependencies
- Task 08: Configure Cursor Ordering

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Import LimitOffsetPagination from DRF**
   - Add import: `from rest_framework.pagination import LimitOffsetPagination`
   - Place with other pagination imports

3. **Create LCCLimitOffsetPagination class**
   - Define new class that inherits from `LimitOffsetPagination`
   - Use "LCC" prefix for consistency
   - Add comprehensive class docstring

4. **Document limit/offset behavior**
   - Explain SQL-style pagination
   - Uses `limit` and `offset` query parameters
   - Flexible but less efficient than cursor for large datasets
   - Allows jumping to arbitrary positions

5. **Add class-level documentation**
   - Document query parameters: limit, offset
   - Explain calculation: offset + limit
   - List ideal use cases
   - Note performance considerations

6. **Prepare configuration attributes**
   - Leave placeholder for `default_limit` (Task 10)
   - Leave placeholder for `max_limit` (Task 11)

### Limit/Offset Pagination Characteristics

| Feature | Behavior |
|---------|----------|
| **Query Params** | `?limit=20&offset=40` |
| **Navigation** | Can jump to any position |
| **Calculation** | offset = (page - 1) × limit |
| **Performance** | Slower with large offsets |
| **Use Case** | Data exploration, reporting |

### When to Use Limit/Offset Pagination

| Scenario | Use Limit/Offset? | Reason |
|----------|-------------------|--------|
| **Data exports** | ✅ Yes | Need precise control over ranges |
| **Analytics dashboards** | ✅ Yes | Flexible data fetching |
| **Third-party integrations** | ✅ Yes | Standard SQL-style interface |
| **Mobile apps** | ❌ No | StandardPagination is better |
| **Real-time feeds** | ❌ No | Use CursorPagination instead |
| **Admin reports** | ✅ Yes | Need to fetch specific ranges |

### Query Parameter Examples

| Request URL | Behavior |
|-------------|----------|
| `/api/products/?limit=20&offset=0` | First 20 items |
| `/api/products/?limit=20&offset=20` | Items 21-40 |
| `/api/products/?limit=50&offset=100` | Items 101-150 |
| `/api/products/?offset=50` | Uses default limit from offset 50 |

### Response Format
```json
{
  "count": 150,
  "next": "http://api.example.com/items/?limit=20&offset=40",
  "previous": "http://api.example.com/items/?limit=20&offset=0",
  "results": [...]
}
```

### Pagination Style Comparison

| Style | Query Format | Best For |
|-------|--------------|----------|
| **Page Number** | `?page=3` | User-facing lists |
| **Cursor** | `?cursor=token` | Real-time feeds |
| **Limit/Offset** | `?limit=20&offset=40` | Data exports, APIs |

### Performance Considerations

| Offset Size | Performance Impact |
|-------------|-------------------|
| **0-1000** | Good performance |
| **1000-10000** | Acceptable with indexes |
| **10000+** | Consider cursor pagination |

### Expected Class Structure
```python
class LCCLimitOffsetPagination(LimitOffsetPagination):
    """
    SQL-style limit/offset pagination.
    
    Query params: ?limit=N&offset=M
    Flexible but less efficient for large offsets
    Use for: data exports, reporting, third-party APIs
    """
    # default_limit to be configured in Task 10
    # max_limit to be configured in Task 11
```

### Verification Checklist
- [ ] `LCCLimitOffsetPagination` class is defined
- [ ] Class inherits from `LimitOffsetPagination`
- [ ] Class docstring explains limit/offset pagination
- [ ] Use cases are documented
- [ ] Performance considerations are noted
- [ ] Response format is documented

---

## Task 10: Configure Default Limit

### Overview
Configure the default limit for LimitOffsetPagination to 20 items, maintaining consistency with StandardPagination's default page size.

### Dependencies
- Task 09: Create LimitOffsetPagination

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Add default_limit attribute**
   - In `LCCLimitOffsetPagination` class
   - Set `default_limit` to `20`
   - This is used when no `limit` parameter is provided

3. **Add inline comment**
   - Explain consistency with other pagination classes
   - Note: matches StandardPagination default
   - Mention that clients can override with query param

4. **Update class docstring**
   - Document the default limit value
   - Explain when it applies
   - Show example with and without limit parameter

### Default Limit Rationale

| Consideration | Why 20 Items |
|---------------|--------------|
| **Consistency** | Matches StandardPagination |
| **Performance** | Reasonable default for most APIs |
| **User Experience** | Good balance for data browsing |
| **API Standards** | Common default in REST APIs |

### Query Behavior Examples

| Request | Effective Limit | Notes |
|---------|----------------|-------|
| `?offset=0` | 20 | Uses default_limit |
| `?limit=50&offset=0` | 50 | Client override |
| `?limit=200&offset=0` | 100 | Capped by max_limit (Task 11) |
| `?offset=40` | 20 | Default limit from offset 40 |

### Expected Class Structure
```python
class LCCLimitOffsetPagination(LimitOffsetPagination):
    """
    SQL-style limit/offset pagination.
    
    Default limit: 20 items
    Query params: ?limit=N&offset=M
    
    Examples:
        /api/products/?offset=0          -> 20 items (default)
        /api/products/?limit=50&offset=0 -> 50 items
    """
    default_limit = 20  # Default when no limit specified
    # max_limit to be configured in Task 11
```

### Verification Checklist
- [ ] `default_limit` attribute is set to `20`
- [ ] Inline comment explains consistency
- [ ] Class docstring mentions default limit
- [ ] Examples are provided

---

## Task 11: Configure Max Limit

### Overview
Configure the maximum limit for LimitOffsetPagination to 100 items, protecting server resources while allowing reasonable data fetching flexibility.

### Dependencies
- Task 10: Configure Default Limit

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Add max_limit attribute**
   - In `LCCLimitOffsetPagination` class
   - Set `max_limit` to `100`
   - This caps the maximum items per request

3. **Add inline comment**
   - Explain server protection purpose
   - Note: prevents excessive resource usage
   - Mention consistency with StandardPagination

4. **Update class docstring**
   - Document the maximum limit
   - Explain capping behavior
   - Provide examples of limit validation

5. **Document validation behavior**
   - Limits exceeding 100 are automatically capped
   - Negative limits fall back to default (20)
   - Zero limits fall back to default (20)

### Maximum Limit Rationale

| Consideration | Why 100 Items Limit |
|---------------|---------------------|
| **Server Protection** | Prevents resource exhaustion |
| **Query Performance** | Database queries remain efficient |
| **Memory Usage** | Limits serialization overhead |
| **Consistency** | Matches StandardPagination max |
| **Security** | Prevents abuse of API resources |

### Limit Validation Examples

| Request Limit | Effective Limit | Notes |
|---------------|----------------|-------|
| `?limit=50` | 50 | Valid, within max |
| `?limit=100` | 100 | Maximum allowed |
| `?limit=200` | 100 | Capped to max_limit |
| `?limit=-10` | 20 | Invalid, uses default |
| `?limit=0` | 20 | Invalid, uses default |

### Large Dataset Strategies

| Need | Recommended Approach |
|------|---------------------|
| **Export all data** | Use data export feature with streaming |
| **Fetch 1000+ items** | Use multiple requests with offset |
| **Real-time updates** | Use CursorPagination instead |
| **Bulk processing** | Implement async task with Celery |

### Expected Final Class Structure
```python
class LCCLimitOffsetPagination(LimitOffsetPagination):
    """
    SQL-style limit/offset pagination.
    
    Default limit: 20 items
    Maximum limit: 100 items
    Query params: ?limit=N&offset=M
    
    Examples:
        /api/products/?offset=0            -> 20 items (default)
        /api/products/?limit=50&offset=0   -> 50 items
        /api/products/?limit=200&offset=0  -> 100 items (capped)
    """
    default_limit = 20  # Default when no limit specified
    max_limit = 100     # Maximum allowed limit
```

### Verification Checklist
- [ ] `max_limit` attribute is set to `100`
- [ ] Inline comment explains protection purpose
- [ ] Class docstring mentions maximum limit
- [ ] Validation behavior is documented
- [ ] Capping examples are provided

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 07 | Create CursorPagination Class | `LCCCursorPagination` class |
| 08 | Configure Cursor Ordering | Default `-created_at` ordering |
| 09 | Create LimitOffsetPagination | `LCCLimitOffsetPagination` class |
| 10 | Configure Default Limit | Default 20 items |
| 11 | Configure Max Limit | Maximum 100 items limit |

### Pagination Classes Summary

```python
# StandardPagination (from Doc 01)
StandardPagination:
    - page_size: 20
    - max_page_size: 100
    - Query: ?page=N&page_size=M

# CursorPagination (this doc)
LCCCursorPagination:
    - page_size: 20
    - ordering: '-created_at'
    - Query: ?cursor=<token>

# LimitOffsetPagination (this doc)
LCCLimitOffsetPagination:
    - default_limit: 20
    - max_limit: 100
    - Query: ?limit=N&offset=M
```

### Pagination Pattern Selection Guide

| Use Case | Recommended Class | Reason |
|----------|------------------|--------|
| **Product listings** | StandardPagination | Page numbers intuitive for users |
| **Activity feed** | LCCCursorPagination | Real-time data, efficient |
| **Data exports** | LCCLimitOffsetPagination | Precise control needed |
| **Search results** | StandardPagination | Users expect page numbers |
| **Notifications** | LCCCursorPagination | Chronological, frequently updated |
| **Admin reports** | LCCLimitOffsetPagination | Flexible range queries |

### Module Structure After This Document
```
backend/apps/core/
└── pagination/
    ├── __init__.py                  # Package initialization
    └── paginators.py                # All three pagination classes
        ├── StandardPagination       # Page number pagination
        ├── LCCCursorPagination      # Cursor-based pagination
        └── LCCLimitOffsetPagination # Limit/offset pagination
```

### Next Steps
Proceed to [03_Tasks-12-16_Response-Format-Export.md](03_Tasks-12-16_Response-Format-Export.md) to:
- Add total count to responses
- Add page metadata
- Create NoPagination class
- Export all classes
- Add unit tests

---

## Notes for AI Agents

1. **Execution Order:** Tasks 07-11 must be executed in strict sequence
2. **Cursor Performance:** Requires proper database indexing on ordering fields
3. **Limit/Offset Warning:** Performance degrades with large offsets
4. **Consistency:** All pagination classes use similar defaults (20/100)
5. **Testing:** Comprehensive tests will be added in Group F (Task 80)
6. **View Integration:** Views can override pagination class and settings
