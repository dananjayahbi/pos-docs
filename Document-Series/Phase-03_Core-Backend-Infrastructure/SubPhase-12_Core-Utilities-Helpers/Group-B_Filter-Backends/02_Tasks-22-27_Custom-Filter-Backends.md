# Tasks 22-27: Custom Filter Backends

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** B - Filter Backends  
> **Document:** 02 of 03  
> **Tasks Covered:** 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-21_Django-Filter-Setup.md](01_Tasks-17-21_Django-Filter-Setup.md)
- **→ Next Document:** [03_Tasks-28-32_BaseFilterSet-Testing.md](03_Tasks-28-32_BaseFilterSet-Testing.md)

---

## Document Overview

This document covers the creation of custom filter backend classes including the critical TenantFilterBackend for multi-tenancy, date range filtering, search capabilities, and common field filters.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 22 | Create TenantFilterBackend | High |
| 23 | Create DateRangeFilter | Medium |
| 24 | Create SearchFilter | Medium |
| 25 | Create OrderingFilter | Medium |
| 26 | Create IsActiveFilter | Low |
| 27 | Create CreatedByFilter | Medium |

---

## Task 22: Create TenantFilterBackend

### Overview
Create the TenantFilterBackend class that automatically filters all querysets to the current tenant's data, ensuring complete tenant isolation at the filter level. This is a critical security component.

### Dependencies
- Task 21: Create filters __init__.py
- SubPhase-02: Multi-Tenancy Setup

### Instructions

1. **Create backends.py file**
   - Create file named `backends.py` in `filters/` directory
   - Location: `backend/apps/core/filters/backends.py`

2. **Add file docstring**
   - Document that this file contains custom filter backend classes
   - Emphasize tenant-aware filtering

3. **Import required dependencies**
   - Import `BaseFilterBackend` from `rest_framework.filters`
   - Import tenant model and utilities
   - Import `get_current_tenant` helper

4. **Create TenantFilterBackend class**
   - Define class inheriting from `BaseFilterBackend`
   - Add comprehensive class docstring
   - Explain automatic tenant isolation

5. **Implement filter_queryset method**
   - Override `filter_queryset(request, queryset, view)` method
   - Get current tenant from request context
   - Filter queryset by tenant_id
   - Handle cases where tenant is not set
   - Return filtered queryset

6. **Add error handling**
   - Handle missing tenant gracefully
   - Log warning if tenant not found in request
   - Raise appropriate exception if tenant required but missing

7. **Document usage in docstring**
   - Explain automatic application
   - Show how to add to view's filter_backends
   - Note that it should be first in the list

### TenantFilterBackend Behavior

| Scenario | Behavior |
|----------|----------|
| **Tenant in request** | Filters queryset to tenant's data |
| **No tenant in request** | Raises exception or returns empty queryset |
| **Public endpoint** | Can be skipped for non-tenant views |
| **Admin override** | Special handling for superusers (optional) |

### Implementation Pattern
```python
class TenantFilterBackend(BaseFilterBackend):
    """
    Automatically filters querysets to current tenant's data.
    
    Critical for multi-tenant security - applies tenant isolation.
    Should be first filter backend in the list.
    """
    
    def filter_queryset(self, request, queryset, view):
        # Get tenant from request
        tenant = get_current_tenant(request)
        
        if tenant is None:
            # Handle no tenant case
            raise PermissionDenied("Tenant not found")
        
        # Filter by tenant
        if hasattr(queryset.model, 'tenant'):
            return queryset.filter(tenant=tenant)
        
        return queryset
```

### Usage in Views
```python
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [
        TenantFilterBackend,  # MUST be first!
        SearchFilter,
        OrderingFilter,
    ]
```

### Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| **Always first** | Must be first backend in the list |
| **No bypass** | Never skip in tenant-scoped views |
| **Error handling** | Fail secure (empty queryset/error) |
| **Logging** | Log tenant isolation events |
| **Testing** | Verify tenant isolation in tests |

### Verification Checklist
- [ ] `backends.py` file created
- [ ] `TenantFilterBackend` class defined
- [ ] Inherits from `BaseFilterBackend`
- [ ] `filter_queryset` method implemented
- [ ] Tenant isolation logic correct
- [ ] Error handling included
- [ ] Usage documented in docstring

---

## Task 23: Create DateRangeFilter

### Overview
Create a filter backend for date range queries using `start_date` and `end_date` query parameters, commonly used in reports, analytics, and time-based filtering.

### Dependencies
- Task 22: Create TenantFilterBackend

### Instructions

1. **Open backends.py file**
   - Navigate to `backend/apps/core/filters/backends.py`

2. **Create DateRangeFilterBackend class**
   - Define class inheriting from `BaseFilterBackend`
   - Add comprehensive class docstring

3. **Implement filter_queryset method**
   - Override `filter_queryset(request, queryset, view)` method
   - Extract `start_date` from query params
   - Extract `end_date` from query params
   - Apply date range filtering to queryset

4. **Determine date field**
   - Check if view has `date_filter_field` attribute
   - Default to `'created_at'` if not specified
   - Allow views to customize the date field

5. **Apply date filters**
   - If `start_date` provided: `queryset.filter(field__gte=start_date)`
   - If `end_date` provided: `queryset.filter(field__lte=end_date)`
   - Handle both, either, or neither parameter

6. **Add date parsing and validation**
   - Parse date strings (ISO format: YYYY-MM-DD)
   - Validate date format
   - Handle invalid dates gracefully
   - Convert to timezone-aware datetimes

7. **Document query parameters**
   - Explain `?start_date=YYYY-MM-DD` parameter
   - Explain `?end_date=YYYY-MM-DD` parameter
   - Provide usage examples

### Date Range Filtering Patterns

| Query | Filter Applied |
|-------|---------------|
| `?start_date=2026-01-01` | Items from Jan 1, 2026 onwards |
| `?end_date=2026-01-31` | Items up to Jan 31, 2026 |
| `?start_date=2026-01-01&end_date=2026-01-31` | Items in January 2026 |
| No params | No date filtering |

### Implementation Pattern
```python
class DateRangeFilterBackend(BaseFilterBackend):
    """
    Filters queryset by date range.
    
    Query params:
        ?start_date=YYYY-MM-DD
        ?end_date=YYYY-MM-DD
    
    Views can set date_filter_field attribute.
    Defaults to 'created_at'.
    """
    
    def filter_queryset(self, request, queryset, view):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Get field name from view or use default
        field_name = getattr(view, 'date_filter_field', 'created_at')
        
        if start_date:
            # Parse and apply start date filter
            queryset = queryset.filter(**{f'{field_name}__gte': start_date})
        
        if end_date:
            # Parse and apply end date filter
            queryset = queryset.filter(**{f'{field_name}__lte': end_date})
        
        return queryset
```

### Usage Examples

**In Views:**
```python
class OrderListView(ListAPIView):
    queryset = Order.objects.all()
    filter_backends = [DateRangeFilterBackend]
    date_filter_field = 'order_date'  # Custom field
```

**API Queries:**
```
GET /api/orders/?start_date=2026-01-01&end_date=2026-01-31
GET /api/invoices/?start_date=2026-01-01
GET /api/sales/?end_date=2026-12-31
```

### Verification Checklist
- [ ] `DateRangeFilterBackend` class defined
- [ ] Query parameter extraction implemented
- [ ] Start date filtering logic correct
- [ ] End date filtering logic correct
- [ ] Custom field name support added
- [ ] Date parsing and validation included
- [ ] Usage examples in docstring

---

## Task 24: Create SearchFilter

### Overview
Create a custom search filter backend that extends DRF's SearchFilter with additional functionality for Sri Lankan context, including Sinhala text search support.

### Dependencies
- Task 23: Create DateRangeFilter

### Instructions

1. **Import SearchFilter from DRF**
   - Add import: `from rest_framework.filters import SearchFilter as DRFSearchFilter`

2. **Create LCCSearchFilter class**
   - Define class inheriting from `DRFSearchFilter`
   - Add "LCC" prefix for identification
   - Add comprehensive class docstring

3. **Configure default search param**
   - Set `search_param = 'search'`
   - This allows `?search=query` parameter

4. **Document searchable fields**
   - Views must define `search_fields` attribute
   - Example: `search_fields = ['name', 'description', 'sku']`
   - Supports field lookups: `^`, `=`, `@`, `$`

5. **Add Sinhala search support note**
   - Document that PostgreSQL full-text search works with Sinhala
   - Note proper database configuration needed
   - Reference text search configuration

6. **Document search operators**
   - `^` prefix: Starts-with search
   - `=` prefix: Exact match
   - `@` prefix: Full-text search (PostgreSQL)
   - `$` prefix: Regex search
   - No prefix: Case-insensitive contains

### Search Operators

| Operator | Behavior | Example | Matches |
|----------|----------|---------|---------|
| None | Contains (case-insensitive) | `search_fields = ['name']` | "Product" matches "product name" |
| `^` | Starts with | `search_fields = ['^name']` | "prod" matches "Product" |
| `=` | Exact match | `search_fields = ['=sku']` | "ABC123" matches only "ABC123" |
| `@` | Full-text | `search_fields = ['@description']` | PostgreSQL full-text search |
| `$` | Regex | `search_fields = ['$name']` | Regex pattern matching |

### Implementation Pattern
```python
class LCCSearchFilter(DRFSearchFilter):
    """
    Search filter with support for Sinhala text.
    
    Query param: ?search=query
    
    Views must define search_fields attribute.
    Example: search_fields = ['name', 'description', '@content']
    
    Operators:
        ^field - Starts with
        =field - Exact match
        @field - Full-text search (PostgreSQL)
        $field - Regex
        field  - Contains (default)
    """
    search_param = 'search'
```

### Usage in Views
```python
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [LCCSearchFilter]
    search_fields = [
        '^name',           # Name starts with
        'description',     # Description contains
        '@full_description', # Full-text search
        '=sku',            # SKU exact match
    ]
```

### Search Examples

| Query | search_fields | Matches |
|-------|---------------|---------|
| `?search=rice` | `['name']` | "Rice Bag", "Basmati Rice" |
| `?search=basmati` | `['^name']` | "Basmati Rice" (not "Premium Basmati") |
| `?search=ABC123` | `['=sku']` | Only exact "ABC123" |
| `?search=බත් පැකට්` | `['@name']` | Sinhala full-text search |

### Verification Checklist
- [ ] `LCCSearchFilter` class defined
- [ ] Inherits from DRF's SearchFilter
- [ ] `search_param` configured
- [ ] Search operators documented
- [ ] Sinhala support mentioned
- [ ] Usage examples provided

---

## Task 25: Create OrderingFilter

### Overview
Create a custom ordering filter backend that extends DRF's OrderingFilter with sensible defaults for LankaCommerce Cloud.

### Dependencies
- Task 24: Create SearchFilter

### Instructions

1. **Import OrderingFilter from DRF**
   - Add import: `from rest_framework.filters import OrderingFilter as DRFOrderingFilter`

2. **Create LCCOrderingFilter class**
   - Define class inheriting from `DRFOrderingFilter`
   - Add comprehensive class docstring

3. **Configure default ordering param**
   - Set `ordering_param = 'ordering'`
   - Allows `?ordering=field` parameter

4. **Document ordering syntax**
   - Ascending: `?ordering=name`
   - Descending: `?ordering=-created_at`
   - Multiple fields: `?ordering=-created_at,name`

5. **Document ordering fields**
   - Views must define `ordering_fields` attribute
   - Or use `ordering_fields = '__all__'` for all fields
   - Can restrict to specific fields for security

6. **Add default ordering**
   - Views can set `ordering` attribute for default
   - Example: `ordering = ['-created_at']`

### Ordering Syntax

| Syntax | Behavior | Example |
|--------|----------|---------|
| `field` | Ascending order | `?ordering=name` → A to Z |
| `-field` | Descending order | `?ordering=-created_at` → Newest first |
| `field1,field2` | Multiple fields | `?ordering=category,-price` |

### Implementation Pattern
```python
class LCCOrderingFilter(DRFOrderingFilter):
    """
    Ordering filter for sorting results.
    
    Query param: ?ordering=field or ?ordering=-field
    
    Views must define:
        - ordering_fields: List of allowed fields or '__all__'
        - ordering: Default ordering (optional)
    
    Examples:
        ?ordering=name          - Ascending
        ?ordering=-created_at   - Descending (newest first)
        ?ordering=category,-price - Multiple fields
    """
    ordering_param = 'ordering'
```

### Usage in Views
```python
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [LCCOrderingFilter]
    ordering_fields = ['name', 'price', 'created_at', 'stock']
    ordering = ['-created_at']  # Default ordering
```

### Common Ordering Patterns

| Use Case | Ordering Configuration |
|----------|----------------------|
| **Recent items first** | `ordering = ['-created_at']` |
| **Alphabetical** | `ordering = ['name']` |
| **Price low to high** | `ordering = ['price']` |
| **Priority then date** | `ordering = ['-priority', '-created_at']` |

### Ordering Examples

| Query | Result Order |
|-------|--------------|
| `?ordering=name` | Products A→Z |
| `?ordering=-price` | Most expensive first |
| `?ordering=category,-price` | By category, then price desc |
| No param | Uses view's default ordering |

### Verification Checklist
- [ ] `LCCOrderingFilter` class defined
- [ ] Inherits from DRF's OrderingFilter
- [ ] `ordering_param` configured
- [ ] Ordering syntax documented
- [ ] Multiple field ordering explained
- [ ] Usage examples provided

---

## Task 26: Create IsActiveFilter

### Overview
Create a simple boolean filter for the common `is_active` field, allowing clients to filter active/inactive records easily.

### Dependencies
- Task 25: Create OrderingFilter

### Instructions

1. **Open backends.py file**
   - Continue in `backend/apps/core/filters/backends.py`

2. **Create IsActiveFilterBackend class**
   - Define class inheriting from `BaseFilterBackend`
   - Add class docstring

3. **Implement filter_queryset method**
   - Extract `is_active` from query params
   - Parse as boolean value
   - Apply filter if provided

4. **Handle boolean parsing**
   - Accept: `true`, `True`, `1`, `yes` for True
   - Accept: `false`, `False`, `0`, `no` for False
   - Ignore invalid values

5. **Document query parameter**
   - Explain `?is_active=true` parameter
   - Explain `?is_active=false` parameter
   - Default behavior (no filter if not provided)

### Boolean Parsing

| Query Parameter | Parsed As | Filter Applied |
|----------------|-----------|----------------|
| `?is_active=true` | `True` | Only active records |
| `?is_active=false` | `False` | Only inactive records |
| `?is_active=1` | `True` | Only active records |
| `?is_active=0` | `False` | Only inactive records |
| No parameter | None | No filtering |

### Implementation Pattern
```python
class IsActiveFilterBackend(BaseFilterBackend):
    """
    Filters by is_active field.
    
    Query param: ?is_active=true or ?is_active=false
    
    Accepts: true/false, 1/0, yes/no (case-insensitive)
    """
    
    def filter_queryset(self, request, queryset, view):
        is_active = request.query_params.get('is_active', None)
        
        if is_active is not None:
            # Parse boolean value
            is_active_bool = is_active.lower() in ['true', '1', 'yes']
            
            if hasattr(queryset.model, 'is_active'):
                return queryset.filter(is_active=is_active_bool)
        
        return queryset
```

### Usage in Views
```python
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    filter_backends = [IsActiveFilterBackend]
    # Will filter by ?is_active=true/false
```

### Common Use Cases

| Endpoint | Query | Purpose |
|----------|-------|---------|
| `/api/products/` | `?is_active=true` | Active products only |
| `/api/customers/` | `?is_active=false` | Inactive customers |
| `/api/categories/` | `?is_active=true` | Active categories for dropdown |

### Verification Checklist
- [ ] `IsActiveFilterBackend` class defined
- [ ] Boolean parsing implemented
- [ ] Query parameter documented
- [ ] Handles true/false values
- [ ] Handles 1/0 values
- [ ] Checks if model has is_active field

---

## Task 27: Create CreatedByFilter

### Overview
Create a filter backend for filtering records by the user who created them, useful for "my items" views and user-specific listings.

### Dependencies
- Task 26: Create IsActiveFilter

### Instructions

1. **Create CreatedByFilterBackend class**
   - Define class inheriting from `BaseFilterBackend`
   - Add comprehensive class docstring

2. **Implement filter_queryset method**
   - Extract `created_by` from query params
   - Support special value `'me'` for current user
   - Support user ID for specific user
   - Apply filter if provided

3. **Handle 'me' special value**
   - If `?created_by=me`, filter by `request.user`
   - Requires authentication
   - Useful for "my items" functionality

4. **Support user ID filtering**
   - Allow `?created_by=123` for specific user
   - Useful for admin views
   - Validate user ID

5. **Add authentication check**
   - Require authenticated user for 'me' value
   - Return unfiltered for anonymous + 'me'
   - Or return empty queryset (configurable)

### Filter Patterns

| Query Parameter | Behavior |
|----------------|----------|
| `?created_by=me` | Items created by current user |
| `?created_by=123` | Items created by user ID 123 |
| No parameter | No filtering |

### Implementation Pattern
```python
class CreatedByFilterBackend(BaseFilterBackend):
    """
    Filters by created_by user field.
    
    Query param:
        ?created_by=me  - Current user's items
        ?created_by=123 - Specific user's items
    
    Requires model to have 'created_by' field.
    'me' requires authenticated user.
    """
    
    def filter_queryset(self, request, queryset, view):
        created_by = request.query_params.get('created_by')
        
        if not created_by:
            return queryset
        
        if created_by == 'me':
            if request.user.is_authenticated:
                return queryset.filter(created_by=request.user)
            return queryset.none()  # Empty for anonymous
        
        # Filter by specific user ID
        try:
            user_id = int(created_by)
            return queryset.filter(created_by_id=user_id)
        except (ValueError, TypeError):
            return queryset
```

### Usage Examples

**In Views:**
```python
class TaskListView(ListAPIView):
    queryset = Task.objects.all()
    filter_backends = [CreatedByFilterBackend]
    # Supports ?created_by=me
```

**API Queries:**
```
GET /api/tasks/?created_by=me      - My tasks
GET /api/orders/?created_by=me     - My orders
GET /api/invoices/?created_by=15   - User 15's invoices (admin)
```

### Use Cases

| Scenario | Query | Result |
|----------|-------|--------|
| **My tasks** | `?created_by=me` | Current user's tasks |
| **Admin view** | `?created_by=123` | Specific user's items |
| **All items** | No param | Unfiltered |

### Verification Checklist
- [ ] `CreatedByFilterBackend` class defined
- [ ] Handles 'me' special value
- [ ] Handles user ID filtering
- [ ] Authentication check implemented
- [ ] Invalid value handling included
- [ ] Usage examples provided

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 22 | Create TenantFilterBackend | Automatic tenant isolation |
| 23 | Create DateRangeFilter | Date range query support |
| 24 | Create SearchFilter | Enhanced search with Sinhala support |
| 25 | Create OrderingFilter | Result ordering capabilities |
| 26 | Create IsActiveFilter | Active/inactive filtering |
| 27 | Create CreatedByFilter | User-specific filtering |

### Filter Backends Summary

| Backend | Query Parameter | Purpose |
|---------|----------------|---------|
| **TenantFilterBackend** | Automatic | Tenant isolation (security) |
| **DateRangeFilterBackend** | `?start_date=X&end_date=Y` | Date range filtering |
| **LCCSearchFilter** | `?search=query` | Text search |
| **LCCOrderingFilter** | `?ordering=field` | Result ordering |
| **IsActiveFilterBackend** | `?is_active=true` | Active/inactive filter |
| **CreatedByFilterBackend** | `?created_by=me` | User filtering |

### Module Structure After This Document
```
backend/apps/core/
└── filters/
    ├── __init__.py              # Package initialization
    └── backends.py              # All filter backend classes
        ├── TenantFilterBackend
        ├── DateRangeFilterBackend
        ├── LCCSearchFilter
        ├── LCCOrderingFilter
        ├── IsActiveFilterBackend
        └── CreatedByFilterBackend
```

### Next Steps
Proceed to [03_Tasks-28-32_BaseFilterSet-Testing.md](03_Tasks-28-32_BaseFilterSet-Testing.md) to:
- Create ModifiedAtFilter
- Create BaseFilterSet class
- Add common filter fields
- Export all filter classes
- Add unit tests

---

## Notes for AI Agents

1. **TenantFilterBackend Critical:** Must be first in filter_backends list
2. **Security:** Tenant isolation is a security requirement, not optional
3. **Date Formats:** Use ISO 8601 format (YYYY-MM-DD)
4. **Sinhala Support:** Requires PostgreSQL full-text search configuration
5. **Testing:** Full unit tests in Group F (Task 81)
6. **Combination:** Multiple filters can be used together in views
