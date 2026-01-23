# Tasks 61-66: Schemas & Examples

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** E - Documentation Enhancements  
> **Document:** 02 of 03  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-60_Schema-Extensions.md](01_Tasks-55-60_Schema-Extensions.md)
- **→ Next Document:** [03_Tasks-67-70_Rate-Version-Export.md](03_Tasks-67-70_Rate-Version-Export.md)

---

## Document Overview

This document covers creating reusable error schemas, documenting pagination and filtering, and adding request/response examples to enhance API documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Create Error Schemas | Medium |
| 62 | Document Pagination | Simple |
| 63 | Document Filtering | Simple |
| 64 | Document Ordering | Simple |
| 65 | Create Example Requests | Medium |
| 66 | Create Example Responses | Medium |

---

## Task 61: Create Error Schemas

### Overview
Create reusable error schema definitions that can be referenced throughout the API documentation for consistent error response documentation.

### Dependencies
- Task 60: Document Error Responses

### Instructions

1. **Create schemas.py file**
   - Navigate to `backend/apps/core/api_docs/`
   - Create new file named `schemas.py`
   - Initialize with file docstring

2. **Define base error schema**
   - Create ErrorResponse schema
   - Include error code field
   - Include message field
   - Include details field

3. **Create specific error schemas**
   - ValidationError schema
   - AuthenticationError schema
   - PermissionError schema
   - NotFoundError schema

4. **Add schema examples**
   - Include example values
   - Show realistic error messages
   - Demonstrate field errors

5. **Register schemas in settings**
   - Add to SPECTACULAR_SETTINGS
   - Define in COMPONENTS
   - Make reusable across endpoints

### Schemas File Structure
```python
"""
API Documentation Schemas

Reusable OpenAPI schema components for error responses,
pagination, and common data structures.
"""

from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from rest_framework import serializers


class ErrorResponseSchema(serializers.Serializer):
    """Base error response schema."""
    code = serializers.CharField(
        help_text="Machine-readable error code"
    )
    message = serializers.CharField(
        help_text="Human-readable error message"
    )
    details = serializers.DictField(
        required=False,
        help_text="Additional error details"
    )


class ValidationErrorSchema(serializers.Serializer):
    """Validation error response (400)."""
    error = ErrorResponseSchema()
    
    class Meta:
        examples = [
            {
                "error": {
                    "code": "validation_error",
                    "message": "Invalid input data",
                    "details": {
                        "price": ["Ensure this value is greater than 0."]
                    }
                }
            }
        ]


class AuthenticationErrorSchema(serializers.Serializer):
    """Authentication error response (401)."""
    error = ErrorResponseSchema()
    
    class Meta:
        examples = [
            {
                "error": {
                    "code": "authentication_failed",
                    "message": "Authentication credentials were not provided."
                }
            }
        ]


class PermissionErrorSchema(serializers.Serializer):
    """Permission error response (403)."""
    error = ErrorResponseSchema()
    
    class Meta:
        examples = [
            {
                "error": {
                    "code": "permission_denied",
                    "message": "You do not have permission to perform this action."
                }
            }
        ]


class NotFoundErrorSchema(serializers.Serializer):
    """Not found error response (404)."""
    error = ErrorResponseSchema()
    
    class Meta:
        examples = [
            {
                "error": {
                    "code": "not_found",
                    "message": "The requested resource was not found."
                }
            }
        ]
```

### Error Schema Types
| Schema | Status Code | Use Case |
|--------|-------------|----------|
| **ValidationErrorSchema** | 400 | Invalid input data |
| **AuthenticationErrorSchema** | 401 | Missing/invalid auth |
| **PermissionErrorSchema** | 403 | Insufficient permissions |
| **NotFoundErrorSchema** | 404 | Resource not found |

### Expected Outcome
```
backend/apps/core/api_docs/
├── __init__.py
├── urls.py
├── extensions.py
└── schemas.py            # New file
```

### Verification Checklist
- [ ] schemas.py file created
- [ ] ErrorResponseSchema defined
- [ ] ValidationErrorSchema created
- [ ] AuthenticationErrorSchema created
- [ ] PermissionErrorSchema created
- [ ] NotFoundErrorSchema created
- [ ] Examples included
- [ ] File documented

---

## Task 62: Document Pagination

### Overview
Document the pagination format used in list endpoints to help developers understand how to navigate through paginated results.

### Dependencies
- Task 61: Create Error Schemas

### Instructions

1. **Add pagination documentation**
   - Add to SPECTACULAR_SETTINGS description
   - Create pagination section
   - Explain pagination format

2. **Document PageNumberPagination**
   - Explain page-based pagination
   - Show query parameters
   - Document response format

3. **Show pagination parameters**
   - page: Page number
   - page_size: Results per page
   - Default and max values

4. **Document response structure**
   - count: Total results
   - next: Next page URL
   - previous: Previous page URL
   - results: Array of items

5. **Provide pagination example**
   - Example request with page parameter
   - Example response with pagination data
   - Show navigation through pages

### Pagination Documentation
```python
# Add to SPECTACULAR_SETTINGS description
PAGINATION_DOCS = '''

## Pagination

List endpoints use page number pagination with the following structure:

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number to retrieve |
| `page_size` | integer | 20 | Results per page (max: 100) |

### Response Format

```json
{
  "count": 150,
  "next": "http://api.example.com/products/?page=3",
  "previous": "http://api.example.com/products/?page=1",
  "results": [
    { /* item 1 */ },
    { /* item 2 */ },
    ...
  ]
}
```

### Example Request

```
GET /api/products/?page=2&page_size=20
```

### Example Response

```json
{
  "count": 150,
  "next": "/api/products/?page=3&page_size=20",
  "previous": "/api/products/?page=1&page_size=20",
  "results": [
    {
      "id": 21,
      "name": "Product 21",
      "price": "99.99"
    },
    ...
  ]
}
```

### Navigation

- **First Page**: `?page=1`
- **Next Page**: Use `next` URL from response
- **Previous Page**: Use `previous` URL from response
- **Last Page**: When `next` is `null`
'''
```

### Pagination Structure
| Field | Type | Description |
|-------|------|-------------|
| **count** | Integer | Total number of results |
| **next** | String/null | URL for next page |
| **previous** | String/null | URL for previous page |
| **results** | Array | Array of items for current page |

### Pagination Parameters
| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| **page** | 1 | N/A | Page number |
| **page_size** | 20 | 100 | Items per page |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Pagination documented
```

### Verification Checklist
- [ ] Pagination section added
- [ ] Query parameters documented
- [ ] Response format shown
- [ ] Example request provided
- [ ] Example response provided
- [ ] Navigation explained

---

## Task 63: Document Filtering

### Overview
Document the filtering capabilities available on list endpoints to help developers query specific subsets of data.

### Dependencies
- Task 62: Document Pagination

### Instructions

1. **Add filtering documentation**
   - Add to SPECTACULAR_SETTINGS description
   - Create filtering section
   - Explain filter parameters

2. **Document filter syntax**
   - Query parameter format
   - Field-based filtering
   - Comparison operators

3. **List common filters**
   - Exact match filters
   - Range filters (gt, lt, gte, lte)
   - Search filters
   - Boolean filters

4. **Show filter examples**
   - Single field filter
   - Multiple field filters
   - Range filters
   - Combined filters

5. **Document filter operators**
   - exact: Exact match
   - icontains: Case-insensitive contains
   - gt/gte: Greater than
   - lt/lte: Less than

### Filtering Documentation
```python
# Add to SPECTACULAR_SETTINGS description
FILTERING_DOCS = '''

## Filtering

List endpoints support filtering through query parameters:

### Filter Syntax

Use field names as query parameters to filter results:

```
GET /api/products/?category=electronics&price__gte=100
```

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| (none) | Exact match | `?status=active` |
| `__icontains` | Case-insensitive contains | `?name__icontains=phone` |
| `__gt` | Greater than | `?price__gt=100` |
| `__gte` | Greater than or equal | `?price__gte=100` |
| `__lt` | Less than | `?price__lt=1000` |
| `__lte` | Less than or equal | `?price__lte=1000` |
| `__in` | In list | `?status__in=active,pending` |

### Examples

**Single Filter**
```
GET /api/products/?category=electronics
```

**Multiple Filters**
```
GET /api/products/?category=electronics&price__gte=100&price__lte=500
```

**Search Filter**
```
GET /api/products/?search=phone
```

**Boolean Filter**
```
GET /api/products/?in_stock=true
```

### Common Filters

| Endpoint | Available Filters |
|----------|------------------|
| **/products/** | category, price, in_stock, name |
| **/orders/** | status, customer, created_date |
| **/customers/** | email, phone, active |
'''
```

### Filter Operators
| Operator | SQL Equivalent | Example |
|----------|----------------|---------|
| **exact** | = | ?price=99.99 |
| **icontains** | ILIKE %...% | ?name__icontains=phone |
| **gt** | > | ?price__gt=100 |
| **gte** | >= | ?price__gte=100 |
| **lt** | < | ?price__lt=1000 |
| **lte** | <= | ?price__lte=1000 |
| **in** | IN (...) | ?id__in=1,2,3 |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Filtering documented
```

### Verification Checklist
- [ ] Filtering section added
- [ ] Filter syntax explained
- [ ] Operators documented
- [ ] Examples provided
- [ ] Common filters listed
- [ ] Combined filters shown

---

## Task 64: Document Ordering

### Overview
Document the ordering/sorting capabilities on list endpoints to help developers control result ordering.

### Dependencies
- Task 63: Document Filtering

### Instructions

1. **Add ordering documentation**
   - Add to SPECTACULAR_SETTINGS description
   - Create ordering section
   - Explain ordering parameter

2. **Document ordering syntax**
   - Use ordering query parameter
   - Field name for ascending
   - Minus prefix for descending

3. **Show ordering examples**
   - Single field ordering
   - Multiple field ordering
   - Ascending and descending

4. **List orderable fields**
   - Common sortable fields
   - Per-endpoint ordering options
   - Default ordering

5. **Add ordering notes**
   - Case sensitivity
   - Null value handling
   - Performance considerations

### Ordering Documentation
```python
# Add to SPECTACULAR_SETTINGS description
ORDERING_DOCS = '''

## Ordering

List endpoints support ordering results using the `ordering` parameter:

### Syntax

- **Ascending**: `?ordering=field_name`
- **Descending**: `?ordering=-field_name`
- **Multiple**: `?ordering=field1,-field2`

### Examples

**Ascending Order**
```
GET /api/products/?ordering=price
```
Returns products from cheapest to most expensive.

**Descending Order**
```
GET /api/products/?ordering=-created_at
```
Returns newest products first.

**Multiple Fields**
```
GET /api/products/?ordering=category,-price
```
Orders by category ascending, then price descending within each category.

### Common Orderable Fields

| Endpoint | Orderable Fields |
|----------|-----------------|
| **/products/** | name, price, created_at, updated_at |
| **/orders/** | order_number, created_at, total, status |
| **/customers/** | name, email, created_at, last_order_date |

### Default Ordering

If no `ordering` parameter is provided, endpoints use default ordering:
- Most endpoints: `-created_at` (newest first)
- Product listings: `name` (alphabetical)
- Customer listings: `name` (alphabetical)

### Combining with Filters

```
GET /api/products/?category=electronics&ordering=-price
```
Returns electronics sorted by price (highest first).
'''
```

### Ordering Syntax
| Format | Result |
|--------|--------|
| **?ordering=field** | Ascending order |
| **?ordering=-field** | Descending order |
| **?ordering=field1,-field2** | Multiple fields |

### Common Orderable Fields
- **created_at**: Creation timestamp
- **updated_at**: Last update timestamp
- **name**: Alphabetical
- **price**: Numerical
- **status**: Status enum order

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Ordering documented
```

### Verification Checklist
- [ ] Ordering section added
- [ ] Syntax explained
- [ ] Examples provided
- [ ] Orderable fields listed
- [ ] Default ordering noted
- [ ] Combined with filters shown

---

## Task 65: Create Example Requests

### Overview
Create realistic example requests for common API operations to help developers understand proper request formatting.

### Dependencies
- Task 64: Document Ordering

### Instructions

1. **Create examples.py file**
   - Navigate to `backend/apps/core/api_docs/`
   - Create new file named `examples.py`
   - Initialize with file docstring

2. **Define request examples**
   - Create example request dictionaries
   - Organize by endpoint/operation
   - Include all required fields

3. **Create authentication examples**
   - Login request example
   - Token refresh request example

4. **Create CRUD operation examples**
   - Create (POST) request examples
   - Update (PUT/PATCH) request examples
   - Include validation examples

5. **Add multi-tenant examples**
   - Include X-Tenant-ID header
   - Show tenant-scoped data
   - Demonstrate tenant isolation

### Examples File Structure
```python
"""
API Documentation Examples

Request and response examples for API documentation.
Provides realistic examples for common operations.
"""

# Authentication Examples
LOGIN_REQUEST_EXAMPLE = {
    "username": "john.doe@example.com",
    "password": "SecurePassword123!"
}

TOKEN_REFRESH_REQUEST_EXAMPLE = {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

# Product Examples
CREATE_PRODUCT_REQUEST_EXAMPLE = {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "category": "electronics",
    "price": "2499.99",  # LKR
    "sku": "MOUSE-WL-001",
    "in_stock": True,
    "quantity": 50
}

UPDATE_PRODUCT_REQUEST_EXAMPLE = {
    "price": "2299.99",  # Discounted price
    "quantity": 45
}

# Order Examples
CREATE_ORDER_REQUEST_EXAMPLE = {
    "customer_id": "550e8400-e29b-41d4-a716-446655440001",
    "items": [
        {
            "product_id": "550e8400-e29b-41d4-a716-446655440010",
            "quantity": 2,
            "unit_price": "2499.99"
        },
        {
            "product_id": "550e8400-e29b-41d4-a716-446655440011",
            "quantity": 1,
            "unit_price": "5999.99"
        }
    ],
    "shipping_address": {
        "line1": "123 Galle Road",
        "line2": "Apartment 4B",
        "city": "Colombo",
        "postal_code": "00300",
        "country": "LK"
    },
    "payment_method": "cash_on_delivery"
}

# Customer Examples
CREATE_CUSTOMER_REQUEST_EXAMPLE = {
    "name": "Amal Perera",
    "email": "amal.perera@example.com",
    "phone": "+94771234567",
    "address": {
        "line1": "456 Kandy Road",
        "city": "Kandy",
        "postal_code": "20000",
        "country": "LK"
    },
    "preferred_language": "si"  # Sinhala
}
```

### Example Categories
| Category | Examples |
|----------|----------|
| **Authentication** | Login, token refresh |
| **Products** | Create, update product |
| **Orders** | Create order, update status |
| **Customers** | Create, update customer |

### Sri Lanka-Specific Examples
- **Currency**: LKR (₨) values
- **Phone**: +94 format
- **Language**: si (Sinhala), en (English)
- **Address**: Sri Lankan format

### Expected Outcome
```
backend/apps/core/api_docs/
├── __init__.py
├── urls.py
├── extensions.py
├── schemas.py
└── examples.py           # New file
```

### Verification Checklist
- [ ] examples.py file created
- [ ] Authentication examples added
- [ ] Product examples added
- [ ] Order examples added
- [ ] Customer examples added
- [ ] Sri Lankan specifics included
- [ ] All required fields present

---

## Task 66: Create Example Responses

### Overview
Create realistic example responses for common API operations to show developers what successful responses look like.

### Dependencies
- Task 65: Create Example Requests

### Instructions

1. **Add response examples to examples.py**
   - Extend examples.py file
   - Create response example dictionaries
   - Match request examples

2. **Create success response examples**
   - 200 OK responses
   - 201 Created responses
   - Include proper structure

3. **Create authentication responses**
   - Token response example
   - User profile response

4. **Create CRUD response examples**
   - Created resource responses
   - Updated resource responses
   - List responses with pagination

5. **Add Sri Lankan data**
   - LKR currency in responses
   - Sinhala text examples
   - Local timestamps (Asia/Colombo)

### Response Examples
```python
# Add to examples.py

# Authentication Responses
LOGIN_RESPONSE_EXAMPLE = {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "john.doe@example.com",
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
}

# Product Responses
PRODUCT_RESPONSE_EXAMPLE = {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "category": "electronics",
    "price": "2499.99",
    "currency": "LKR",
    "sku": "MOUSE-WL-001",
    "in_stock": True,
    "quantity": 50,
    "created_at": "2024-01-15T10:30:00+05:30",
    "updated_at": "2024-01-15T10:30:00+05:30",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440001"
}

PRODUCT_LIST_RESPONSE_EXAMPLE = {
    "count": 150,
    "next": "/api/products/?page=2",
    "previous": None,
    "results": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440010",
            "name": "Wireless Mouse",
            "price": "2499.99",
            "currency": "LKR",
            "in_stock": True
        },
        {
            "id": "550e8400-e29b-41d4-a716-446655440011",
            "name": "Keyboard",
            "price": "5999.99",
            "currency": "LKR",
            "in_stock": True
        }
    ]
}

# Order Responses
ORDER_RESPONSE_EXAMPLE = {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "order_number": "ORD-2024-0001",
    "status": "pending",
    "customer": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Amal Perera",
        "email": "amal.perera@example.com"
    },
    "items": [
        {
            "product": {
                "id": "550e8400-e29b-41d4-a716-446655440010",
                "name": "Wireless Mouse"
            },
            "quantity": 2,
            "unit_price": "2499.99",
            "subtotal": "4999.98"
        }
    ],
    "subtotal": "4999.98",
    "tax": "749.997",
    "total": "5749.977",
    "currency": "LKR",
    "created_at": "2024-01-15T14:30:00+05:30",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Response Features
| Feature | Inclusion |
|---------|-----------|
| **IDs** | UUIDs for all resources |
| **Timestamps** | ISO format with timezone |
| **Currency** | LKR for Sri Lankan prices |
| **Tenant ID** | Multi-tenant isolation |
| **Nested Data** | Related object details |

### Expected Outcome
```
backend/apps/core/api_docs/
└── examples.py           # Response examples added
```

### Verification Checklist
- [ ] Response examples added
- [ ] Success responses (200, 201)
- [ ] Authentication responses
- [ ] Product responses
- [ ] Order responses
- [ ] Pagination responses
- [ ] Sri Lankan data included
- [ ] Timestamps with timezone

---

## Summary

After completing these tasks, the API documentation will have comprehensive error schemas, pagination/filtering documentation, and realistic request/response examples.

### What We Accomplished
1. ✅ Created reusable error schemas
2. ✅ Documented pagination format
3. ✅ Documented filtering capabilities
4. ✅ Documented ordering options
5. ✅ Created example requests
6. ✅ Created example responses

### Next Steps
- Add rate limit documentation
- Add API versioning documentation
- Create changelog section
- Export extensions for use

### Files Created
```
backend/apps/core/api_docs/
├── __init__.py
├── urls.py
├── extensions.py
├── schemas.py            # Error schemas
└── examples.py           # Request/response examples
```

### Git Commit Message
```
feat(api-docs): add schemas, pagination, and examples

- Create reusable error schemas for all error types
- Document pagination with PageNumberPagination
- Document filtering with operators and examples
- Document ordering with syntax and examples
- Create realistic request examples
- Create response examples with Sri Lankan data
- Include LKR currency, +94 phone format
- Add timezone-aware timestamps

Part of SubPhase-11 Group E (Tasks 61-66)
```
