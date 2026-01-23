# Tasks 01-06: Pagination Module Setup & Standard Pagination

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** A - Pagination Classes  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-11_Advanced-Pagination-Classes.md](02_Tasks-07-11_Advanced-Pagination-Classes.md)

---

## Document Overview

This document covers the creation of the pagination module structure and the implementation of the standard page-number pagination class with configurable page size. This establishes the foundation for all pagination patterns used throughout the LankaCommerce Cloud API.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create pagination Module | Low |
| 02 | Create pagination __init__.py | Low |
| 03 | Create StandardPagination Class | Medium |
| 04 | Configure PAGE_SIZE | Low |
| 05 | Configure MAX_PAGE_SIZE | Low |
| 06 | Add page_size Query Param | Medium |

---

## Task 01: Create pagination Module

### Overview
Create the pagination module directory within the core app to house all custom pagination classes used across the LankaCommerce Cloud API.

### Dependencies
- SubPhase-02: API Framework Setup
- SubPhase-03: Base Models & Mixins

### Instructions

1. **Navigate to core app directory**
   - Go to `backend/apps/core/` directory

2. **Create pagination directory**
   - Create new directory named `pagination`
   - This will contain all pagination-related code

3. **Verify directory structure**
   - Ensure the directory is created at correct location
   - Path should be `backend/apps/core/pagination/`

### Expected Directory Structure
```
backend/apps/core/
├── __init__.py
├── models.py
├── admin.py
└── pagination/              # New directory
```

### Verification Checklist
- [ ] `pagination/` directory exists at `backend/apps/core/pagination/`
- [ ] Directory is empty and ready for module files
- [ ] Path is accessible from core app

---

## Task 02: Create pagination __init__.py

### Overview
Create the `__init__.py` file in the pagination module to make it a Python package and define exports for easy imports throughout the project.

### Dependencies
- Task 01: Create pagination Module

### Instructions

1. **Create __init__.py file**
   - Create file named `__init__.py` in `pagination/` directory
   - Location: `backend/apps/core/pagination/__init__.py`

2. **Add module docstring**
   - Add descriptive docstring explaining the module's purpose
   - State that it provides DRF pagination classes
   - Mention support for standard, cursor, and limit/offset pagination

3. **Prepare import section**
   - Add comment section for future imports
   - Will import pagination classes once created
   - Leave the actual imports commented out for now

4. **Prepare __all__ export list**
   - Define empty `__all__` list
   - Will populate with class names in Task 15
   - Leave as placeholder for now

5. **Add version information**
   - Add `__version__` attribute
   - Set to '1.0.0'

### File Structure
```python
"""
Pagination module docstring
"""

__version__ = '1.0.0'

# Imports will be added in Task 15
# from .paginators import ...

__all__ = [
    # Class names will be added in Task 15
]
```

### Expected Outcome
```
backend/apps/core/
└── pagination/
    └── __init__.py          # Package initialization
```

### Verification Checklist
- [ ] `__init__.py` file exists in `pagination/` directory
- [ ] Module docstring is present
- [ ] `__version__` attribute is defined
- [ ] `__all__` list is prepared (empty for now)
- [ ] Module can be imported without errors

---

## Task 03: Create StandardPagination Class

### Overview
Create the StandardPagination class that extends Django REST Framework's PageNumberPagination to provide page-number-based pagination with a consistent response format.

### Dependencies
- Task 02: Create pagination __init__.py

### Instructions

1. **Create paginators.py file**
   - Create file named `paginators.py` in `pagination/` directory
   - Location: `backend/apps/core/pagination/paginators.py`

2. **Add file docstring**
   - Document that this file contains custom pagination classes
   - List the pagination types available
   - Mention DRF integration

3. **Import required dependencies**
   - Import `PageNumberPagination` from `rest_framework.pagination`
   - Import `Response` from `rest_framework.response`
   - Import `OrderedDict` from `collections`

4. **Create StandardPagination class**
   - Define class that inherits from `PageNumberPagination`
   - Add class docstring explaining page-number pagination
   - Mention query parameters: page, page_size

5. **Add class-level documentation**
   - Document the expected query parameters
   - Explain the response format
   - Provide usage examples in docstring

6. **Prepare for configuration**
   - Leave placeholder for `page_size` attribute (Task 04)
   - Leave placeholder for `max_page_size` attribute (Task 05)
   - Leave placeholder for `page_size_query_param` (Task 06)

7. **Add custom response method (optional)**
   - Override `get_paginated_response()` method if custom format needed
   - Include links: next, previous
   - Include metadata: count, page number, total pages
   - Return consistent JSON structure

### StandardPagination Features
| Feature | Description |
|---------|-------------|
| **Pagination Style** | Page number with query param `?page=2` |
| **Default Page Size** | To be configured in Task 04 |
| **Max Page Size** | To be configured in Task 05 |
| **Page Size Override** | To be configured in Task 06 |
| **Response Format** | Consistent JSON with metadata |

### Response Format Structure
```json
{
  "count": 150,
  "next": "http://api.example.com/items/?page=3",
  "previous": "http://api.example.com/items/?page=1",
  "results": [...]
}
```

### Expected Outcome
```
backend/apps/core/
└── pagination/
    ├── __init__.py
    └── paginators.py        # Pagination classes
```

### Verification Checklist
- [ ] `paginators.py` file exists in `pagination/` directory
- [ ] File docstring is present
- [ ] Required imports are included
- [ ] `StandardPagination` class is defined
- [ ] Class inherits from `PageNumberPagination`
- [ ] Class docstring explains usage
- [ ] Response format is documented

---

## Task 04: Configure PAGE_SIZE

### Overview
Configure the default page size for StandardPagination class to return 20 items per page by default, balancing performance with user experience.

### Dependencies
- Task 03: Create StandardPagination Class

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Add page_size attribute**
   - In `StandardPagination` class
   - Set `page_size` class attribute to `20`
   - This controls default items per page

3. **Add inline comment**
   - Explain why 20 is chosen
   - Note: balances API response size with UX
   - Mention that users can override with query param

4. **Document in class docstring**
   - Update class docstring to mention default page size
   - Specify that 20 items is the default

### Page Size Rationale
| Consideration | Reason for 20 Items |
|---------------|---------------------|
| **Performance** | Small enough for fast response times |
| **Mobile UX** | Reasonable scroll length on mobile devices |
| **Desktop UX** | Good balance for table displays |
| **API Load** | Prevents excessive data transfer |
| **Standard Practice** | Common default in REST APIs |

### Configuration Guidelines
- **Small datasets:** 20 items works well
- **Large objects:** Consider lower default if objects are heavy
- **Real-time data:** Cursor pagination may be better (Group A, Doc 02)
- **Reporting:** May need higher limits with explicit override

### Expected Class Structure
```python
class StandardPagination(PageNumberPagination):
    """
    Standard page number pagination.
    Default: 20 items per page
    """
    page_size = 20  # Default page size
    # max_page_size to be added in Task 05
    # page_size_query_param to be added in Task 06
```

### Verification Checklist
- [ ] `page_size` attribute is set to `20`
- [ ] Inline comment explains the choice
- [ ] Class docstring mentions default page size
- [ ] Value is appropriate for most use cases

---

## Task 05: Configure MAX_PAGE_SIZE

### Overview
Configure the maximum page size limit to prevent clients from requesting excessively large result sets that could impact server performance.

### Dependencies
- Task 04: Configure PAGE_SIZE

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Add max_page_size attribute**
   - In `StandardPagination` class
   - Set `max_page_size` class attribute to `100`
   - This is the maximum allowed items per page

3. **Add inline comment**
   - Explain that this prevents excessive API load
   - Note: protects server resources
   - Mention security consideration

4. **Update class docstring**
   - Document the maximum page size limit
   - Explain that requests exceeding this will be capped
   - Clarify validation behavior

5. **Consider use cases**
   - Bulk operations may need high limits
   - Export features should use different approach (streaming)
   - Admin operations might need special pagination class

### Maximum Page Size Rationale
| Consideration | Reason for 100 Items Limit |
|---------------|----------------------------|
| **Server Protection** | Prevents resource exhaustion |
| **Query Performance** | Database queries remain efficient |
| **Memory Usage** | Limits serialization memory footprint |
| **Network Transfer** | Reasonable payload size |
| **Security** | Prevents DoS via pagination abuse |

### Edge Case Handling
| Scenario | Behavior |
|----------|----------|
| Request `?page_size=150` | Automatically capped to 100 |
| Request `?page_size=-5` | Falls back to default (20) |
| Request `?page_size=0` | Falls back to default (20) |
| No `page_size` param | Uses default (20) |

### Expected Class Structure
```python
class StandardPagination(PageNumberPagination):
    """
    Standard page number pagination.
    Default: 20 items per page
    Maximum: 100 items per page
    """
    page_size = 20         # Default page size
    max_page_size = 100    # Maximum allowed page size
    # page_size_query_param to be added in Task 06
```

### Verification Checklist
- [ ] `max_page_size` attribute is set to `100`
- [ ] Inline comment explains security/performance reasons
- [ ] Class docstring mentions maximum limit
- [ ] Value provides adequate protection

---

## Task 06: Add page_size Query Param

### Overview
Enable clients to dynamically override the default page size using the `page_size` query parameter, allowing flexibility while respecting the maximum limit.

### Dependencies
- Task 05: Configure MAX_PAGE_SIZE

### Instructions

1. **Open paginators.py file**
   - Navigate to `backend/apps/core/pagination/paginators.py`

2. **Add page_size_query_param attribute**
   - In `StandardPagination` class
   - Set `page_size_query_param` to string `'page_size'`
   - This enables query parameter override

3. **Add inline comment**
   - Explain that clients can customize page size
   - Note that it's capped by `max_page_size`
   - Mention query format: `?page_size=50`

4. **Update class docstring**
   - Add usage examples with `page_size` parameter
   - Show example URLs
   - Document validation behavior

5. **Document query parameter behavior**
   - Values between 1 and `max_page_size` are accepted
   - Values exceeding `max_page_size` are capped to 100
   - Invalid values fall back to default (20)
   - Combines with `page` parameter: `?page=2&page_size=50`

### Query Parameter Examples

| Request URL | Effective Page Size | Notes |
|-------------|---------------------|-------|
| `/api/products/` | 20 | Uses default |
| `/api/products/?page_size=50` | 50 | Custom size |
| `/api/products/?page_size=150` | 100 | Capped to max |
| `/api/products/?page=3&page_size=25` | 25 | Page 3 with custom size |
| `/api/products/?page_size=abc` | 20 | Invalid, uses default |

### Usage Scenarios
| Use Case | Recommended Page Size | Reason |
|----------|----------------------|--------|
| **Mobile list view** | 20 (default) | Optimized for mobile scrolling |
| **Desktop table** | 50 | Better use of screen space |
| **Admin bulk operations** | 100 | Maximum efficiency |
| **Real-time updates** | 10-20 | Faster updates |
| **Export preview** | 100 | Show more context before export |

### Expected Final Class Structure
```python
class StandardPagination(PageNumberPagination):
    """
    Standard page number pagination.
    
    Default: 20 items per page
    Maximum: 100 items per page
    Query param: ?page_size=N
    
    Examples:
        /api/products/              -> 20 items (default)
        /api/products/?page_size=50 -> 50 items
        /api/products/?page=2       -> Page 2, 20 items
    """
    page_size = 20                      # Default page size
    max_page_size = 100                 # Maximum allowed page size
    page_size_query_param = 'page_size' # Allow clients to override
```

### Verification Checklist
- [ ] `page_size_query_param` is set to `'page_size'`
- [ ] Inline comment explains client override capability
- [ ] Class docstring includes usage examples
- [ ] Query parameter behavior is documented
- [ ] Validation rules are clear

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create pagination Module | `pagination/` directory |
| 02 | Create pagination __init__.py | `__init__.py` package file |
| 03 | Create StandardPagination Class | `paginators.py` with base class |
| 04 | Configure PAGE_SIZE | Default 20 items per page |
| 05 | Configure MAX_PAGE_SIZE | Maximum 100 items limit |
| 06 | Add page_size Query Param | Client override capability |

### Module Structure After This Document
```
backend/apps/core/
└── pagination/
    ├── __init__.py          # Package initialization (empty exports)
    └── paginators.py        # StandardPagination class
```

### StandardPagination Configuration Summary
```python
StandardPagination:
    - page_size: 20 (default)
    - max_page_size: 100 (limit)
    - page_size_query_param: 'page_size' (override)
    - Inherits: PageNumberPagination
    - Response: {count, next, previous, results}
```

### Next Steps
Proceed to [02_Tasks-07-11_Advanced-Pagination-Classes.md](02_Tasks-07-11_Advanced-Pagination-Classes.md) to implement:
- CursorPagination for real-time data
- LimitOffsetPagination for flexible querying
- Configuration of ordering and limits

---

## Notes for AI Agents

1. **Execution Order:** Tasks 01-06 must be executed in strict sequence
2. **No Code Generation:** These are instructions only; implementation is developer's responsibility
3. **DRF Integration:** All pagination classes extend DRF base classes
4. **Tenant Context:** All pagination will work with tenant-scoped querysets
5. **Testing:** Unit tests will be added in Group F (Task 80)
6. **Export Classes:** Actual exports to `__init__.py` happen in Task 15
