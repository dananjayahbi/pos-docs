# Tasks 79-82: Documentation & Integration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** F - Testing & Validation  
> **Document:** 03 of 03  
> **Tasks Covered:** 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-75-78_Feature-CI-Tests.md](02_Tasks-75-78_Feature-CI-Tests.md)
- **→ Next SubPhase:** [../../SubPhase-12_*/](../../)

---

## Document Overview

This document covers creating comprehensive API documentation guides, documenting schema decorator usage, creating extension guides, and verifying full integration of the API documentation system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create API Docs README | Simple |
| 80 | Document Schema Decorators | Medium |
| 81 | Document Extension Guide | Medium |
| 82 | Verify Full Integration | Complex |

---

## Task 79: Create API Docs README

### Overview
Create comprehensive README documentation for the API documentation system covering setup, usage, and maintenance.

### Dependencies
- Task 78: Add Schema CI Check

### Instructions

1. **Create docs/api/ directory**
   - Create `backend/docs/api/`
   - Add `README.md`
   - Add `.gitkeep` if needed

2. **Document API documentation overview**
   - What is drf-spectacular
   - Why we use it
   - What it provides
   - Architecture overview

3. **Document accessing documentation**
   - Swagger UI URL
   - ReDoc URL
   - Schema download URL
   - Authentication process

4. **Document for developers**
   - How to document new endpoints
   - How to add examples
   - How to customize schemas
   - Best practices

5. **Document testing**
   - Running schema tests
   - Validating schema
   - CI/CD integration
   - Coverage requirements

6. **Add troubleshooting section**
   - Common issues
   - Error messages
   - Solutions
   - Support contacts

### README.md
```markdown
# API Documentation

LankaCommerce Cloud API documentation using OpenAPI 3.0, Swagger UI, and ReDoc.

## Overview

The API documentation system uses **drf-spectacular** to automatically generate OpenAPI 3.0 schemas from Django REST Framework code. It provides:

- **Swagger UI**: Interactive API testing interface
- **ReDoc**: Clean, comprehensive documentation
- **OpenAPI Schema**: Machine-readable API specification

### Architecture

```
┌─────────────────────────────────────┐
│   Django REST Framework ViewSets    │
│   (with @extend_schema decorators)  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      drf-spectacular Generator       │
│   (Custom preprocessor + schemas)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       OpenAPI 3.0 Schema (YAML)     │
└──────────────┬──────────────────────┘
               │
         ┌─────┴──────┐
         ▼            ▼
┌─────────────┐  ┌─────────────┐
│  Swagger UI │  │    ReDoc    │
└─────────────┘  └─────────────┘
```

## Accessing Documentation

### Development

- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Production

- **Swagger UI**: https://api.lankacommerce.com/api/schema/swagger-ui/
- **ReDoc**: https://api.lankacommerce.com/api/schema/redoc/
- **OpenAPI Schema**: https://api.lankacommerce.com/api/schema/

### Authentication

To test authenticated endpoints in Swagger UI:

1. Click **Authorize** button (top right)
2. Enter: `Bearer <your_access_token>`
3. Click **Authorize**
4. Click **Close**
5. Test endpoints with authentication

To get an access token:

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## For Developers

### Documenting New Endpoints

When creating a new ViewSet or APIView, use `@extend_schema` decorator:

```python
from drf_spectacular.utils import extend_schema
from apps.core.api_docs import (
    ValidationErrorSchema,
    CREATE_PRODUCT_REQUEST_EXAMPLE,
    PRODUCT_RESPONSE_EXAMPLE,
)

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing products.
    """
    
    @extend_schema(
        summary="Create a new product",
        description="Create a new product in the catalog.",
        request=CREATE_PRODUCT_REQUEST_EXAMPLE,
        responses={
            201: PRODUCT_RESPONSE_EXAMPLE,
            400: ValidationErrorSchema,
        },
        tags=['Products']
    )
    def create(self, request, *args, **kwargs):
        # Implementation
        pass
```

### Adding Examples

Add examples to `backend/apps/core/api_docs/examples.py`:

```python
CREATE_PRODUCT_REQUEST_EXAMPLE = {
    'request': {
        'name': 'Ceylon Tea Premium 100g',
        'sku': 'TEA-CEYLON-100',
        'price': '850.00',
        'category': 'Beverages',
        'description': 'Premium Ceylon black tea',
    }
}

PRODUCT_RESPONSE_EXAMPLE = {
    'response': {
        'id': 'uuid-here',
        'name': 'Ceylon Tea Premium 100g',
        'sku': 'TEA-CEYLON-100',
        'price': '850.00',
        'category': 'Beverages',
        'created_at': '2024-01-15T10:30:00Z',
        'updated_at': '2024-01-15T10:30:00Z',
    }
}
```

Export in `__init__.py`:

```python
__all__ = [
    'CREATE_PRODUCT_REQUEST_EXAMPLE',
    'PRODUCT_RESPONSE_EXAMPLE',
]
```

### Customizing Schemas

For custom response structures, create schemas in `backend/apps/core/api_docs/schemas.py`:

```python
class CustomResponseSchema(serializers.Serializer):
    """Custom response schema."""
    status = serializers.CharField(help_text="Operation status")
    data = serializers.DictField(help_text="Response data")
    message = serializers.CharField(help_text="Human-readable message")
```

Use in decorator:

```python
@extend_schema(
    responses={
        200: CustomResponseSchema,
    }
)
def custom_endpoint(self, request):
    # Implementation
    pass
```

### Best Practices

1. **Always use @extend_schema** on all ViewSet actions
2. **Add summary and description** for clarity
3. **Include examples** for request and response
4. **Document all error responses** (400, 401, 403, 404, 500)
5. **Use tags** to organize endpoints
6. **Add parameter descriptions** for clarity
7. **Test in Swagger UI** before committing
8. **Run schema tests** to validate changes

## Testing

### Running Schema Tests

```bash
# Run all API docs tests
pytest backend/apps/core/tests/test_api_docs/ -v

# Run specific test file
pytest backend/apps/core/tests/test_api_docs/test_schema.py -v

# Run with coverage
pytest backend/apps/core/tests/test_api_docs/ \
  --cov=apps.core.api_docs \
  --cov-report=html
```

### Validating Schema

```bash
# Validate OpenAPI schema
python manage.py spectacular --validate --fail-on-warn

# Generate schema file
python manage.py spectacular --file schema.yml

# Generate with color output
python manage.py spectacular --color --file schema.yml
```

### CI/CD Integration

Schema validation runs automatically on:

- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`
- Changes to `backend/apps/**`

Check workflow: `.github/workflows/api-schema.yml`

### Coverage Requirements

- Schema generation: 100%
- Schema validation: 100%
- Endpoint coverage: ≥95%
- Test coverage: ≥95%

## Troubleshooting

### Schema Generation Fails

**Issue**: `ImproperlyConfigured: SPECTACULAR_SETTINGS not found`

**Solution**: Ensure `INSTALLED_APPS` includes `drf_spectacular` and settings configured.

---

**Issue**: `AssertionError: Schema has errors`

**Solution**: Run `python manage.py spectacular --validate` to see specific errors. Common issues:
- Missing serializer fields
- Invalid response types
- Circular references

### Swagger UI Not Loading

**Issue**: Swagger UI shows blank page

**Solution**: Check:
1. URL is correct: `/api/schema/swagger-ui/`
2. Static files collected: `python manage.py collectstatic`
3. Browser console for JavaScript errors
4. Django logs for errors

### Authentication Not Working

**Issue**: 401 Unauthorized in Swagger UI

**Solution**:
1. Get fresh access token: `POST /api/token/`
2. Click **Authorize** button
3. Enter: `Bearer <token>` (include "Bearer ")
4. Test endpoint again

### Missing Endpoints

**Issue**: Endpoint not appearing in documentation

**Solution**:
1. Ensure ViewSet registered in `urls.py`
2. Check ViewSet has `@extend_schema` decorators
3. Run `python manage.py spectacular --validate`
4. Check endpoint tags configured

### Examples Not Showing

**Issue**: Examples not displayed in Swagger UI

**Solution**:
1. Verify examples in `examples.py`
2. Check examples exported in `__init__.py`
3. Ensure examples passed to `@extend_schema(request=..., responses=...)`
4. Check examples are valid JSON

## Configuration

### Settings

API documentation configured in `backend/config/settings/api_docs.py`:

```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'VERSION': '1.0.0',
    'DESCRIPTION': 'Multi-tenant SaaS ERP for Sri Lankan SMEs',
    # ... more settings
}
```

### URLs

Documentation URLs in `backend/config/urls.py`:

```python
urlpatterns = [
    path('api/schema/', include('apps.core.api_docs.urls')),
]
```

### Extensions

Custom extensions in `backend/apps/core/api_docs/`:

- `extensions.py`: Custom schema preprocessor
- `schemas.py`: Reusable error schemas
- `examples.py`: Request/response examples

## Support

### Internal Resources

- **Documentation**: `/docs/api/`
- **Decorators Guide**: `/docs/api/decorators.md`
- **Extensions Guide**: `/docs/api/extensions.md`

### External Resources

- [drf-spectacular Docs](https://drf-spectacular.readthedocs.io/)
- [OpenAPI 3.0 Spec](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [ReDoc](https://redocly.com/redoc/)

### Contact

- **Technical Lead**: tech@lankacommerce.com
- **API Support**: api@lankacommerce.com
- **Slack**: #api-documentation

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
```

### Expected Outcome
```
backend/docs/api/
└── README.md             # API docs overview created
```

### Verification Checklist
- [ ] docs/api/ directory created
- [ ] README.md created
- [ ] Overview section complete
- [ ] Access instructions clear
- [ ] Developer guide comprehensive
- [ ] Testing section complete
- [ ] Troubleshooting added
- [ ] Configuration documented
- [ ] Support contacts included

---

## Task 80: Document Schema Decorators

### Overview
Create comprehensive guide for using `@extend_schema` and other drf-spectacular decorators.

### Dependencies
- Task 79: Create API Docs README

### Instructions

1. **Create decorators.md**
   - Create `backend/docs/api/decorators.md`
   - Document all drf-spectacular decorators
   - Add examples for each

2. **Document @extend_schema**
   - Basic usage
   - Parameters (request, responses, tags, etc.)
   - Examples for each parameter
   - Common patterns

3. **Document @extend_schema_view**
   - ViewSet-level documentation
   - Override action documentation
   - Multiple action configuration

4. **Document @extend_schema_field**
   - Custom serializer field documentation
   - Field-level customization
   - Type overrides

5. **Document @extend_schema_serializer**
   - Serializer-level documentation
   - Example addition
   - Deprecation marking

6. **Add common patterns**
   - Pagination documentation
   - Filtering documentation
   - Search documentation
   - Ordering documentation

### decorators.md
```markdown
# Schema Decorator Guide

Comprehensive guide to using drf-spectacular decorators for API documentation.

## Table of Contents

- [@extend_schema](#extend_schema)
- [@extend_schema_view](#extend_schema_view)
- [@extend_schema_field](#extend_schema_field)
- [@extend_schema_serializer](#extend_schema_serializer)
- [Common Patterns](#common-patterns)

---

## @extend_schema

Main decorator for documenting ViewSet actions and APIView methods.

### Basic Usage

```python
from drf_spectacular.utils import extend_schema

class ProductViewSet(viewsets.ModelViewSet):
    @extend_schema(
        summary="List all products",
        description="Retrieve a paginated list of all products in the catalog."
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
```

### Parameters

#### summary
Short one-line description of the endpoint.

```python
@extend_schema(
    summary="Create a new product"
)
```

#### description
Detailed description (supports Markdown).

```python
@extend_schema(
    description="""
    Create a new product in the catalog.
    
    ## Requirements
    - User must be authenticated
    - User must have 'add_product' permission
    - SKU must be unique
    
    ## Business Rules
    - Price must be greater than 0
    - Category must exist
    """
)
```

#### request
Document request body with examples.

```python
from apps.core.api_docs import CREATE_PRODUCT_REQUEST_EXAMPLE

@extend_schema(
    request=CREATE_PRODUCT_REQUEST_EXAMPLE
)
```

Or inline:

```python
@extend_schema(
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'name': {'type': 'string'},
                'price': {'type': 'number'},
            },
            'required': ['name', 'price']
        }
    }
)
```

#### responses
Document possible responses with examples.

```python
from apps.core.api_docs import (
    PRODUCT_RESPONSE_EXAMPLE,
    ValidationErrorSchema,
    AuthenticationErrorSchema,
)

@extend_schema(
    responses={
        201: PRODUCT_RESPONSE_EXAMPLE,
        400: ValidationErrorSchema,
        401: AuthenticationErrorSchema,
        403: PermissionErrorSchema,
    }
)
```

#### tags
Organize endpoints into groups.

```python
@extend_schema(
    tags=['Products']
)
```

#### parameters
Document query parameters, headers, path parameters.

```python
from drf_spectacular.utils import OpenApiParameter

@extend_schema(
    parameters=[
        OpenApiParameter(
            name='category',
            type=str,
            location=OpenApiParameter.QUERY,
            description='Filter by category name',
            required=False
        ),
        OpenApiParameter(
            name='min_price',
            type=float,
            location=OpenApiParameter.QUERY,
            description='Minimum price (LKR)',
            required=False
        ),
    ]
)
```

#### operation_id
Custom operation ID (auto-generated if not provided).

```python
@extend_schema(
    operation_id='products_create_bulk'
)
```

#### deprecated
Mark endpoint as deprecated.

```python
@extend_schema(
    deprecated=True,
    description="This endpoint is deprecated. Use /api/v2/products/ instead."
)
```

#### auth
Override authentication requirements.

```python
@extend_schema(
    auth=[]  # No authentication required
)
```

### Complete Example

```python
from drf_spectacular.utils import extend_schema, OpenApiParameter
from apps.core.api_docs import (
    CREATE_PRODUCT_REQUEST_EXAMPLE,
    PRODUCT_RESPONSE_EXAMPLE,
    ValidationErrorSchema,
    AuthenticationErrorSchema,
)

class ProductViewSet(viewsets.ModelViewSet):
    @extend_schema(
        summary="Create a new product",
        description="Create a new product in the catalog with full details.",
        request=CREATE_PRODUCT_REQUEST_EXAMPLE,
        responses={
            201: PRODUCT_RESPONSE_EXAMPLE,
            400: ValidationErrorSchema,
            401: AuthenticationErrorSchema,
        },
        tags=['Products'],
        operation_id='products_create'
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        summary="Filter products",
        description="Filter products by category, price range, or availability.",
        parameters=[
            OpenApiParameter(
                name='category',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter by category name'
            ),
            OpenApiParameter(
                name='min_price',
                type=float,
                description='Minimum price in LKR'
            ),
            OpenApiParameter(
                name='max_price',
                type=float,
                description='Maximum price in LKR'
            ),
            OpenApiParameter(
                name='in_stock',
                type=bool,
                description='Show only in-stock items'
            ),
        ],
        tags=['Products']
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
```

---

## @extend_schema_view

Document multiple ViewSet actions at once.

### Basic Usage

```python
from drf_spectacular.utils import extend_schema_view, extend_schema

@extend_schema_view(
    list=extend_schema(
        summary="List products",
        tags=['Products']
    ),
    create=extend_schema(
        summary="Create product",
        tags=['Products']
    ),
    retrieve=extend_schema(
        summary="Get product details",
        tags=['Products']
    ),
    update=extend_schema(
        summary="Update product",
        tags=['Products']
    ),
    destroy=extend_schema(
        summary="Delete product",
        tags=['Products']
    ),
)
class ProductViewSet(viewsets.ModelViewSet):
    # ViewSet implementation
    pass
```

### With Custom Actions

```python
@extend_schema_view(
    list=extend_schema(summary="List products"),
    bulk_create=extend_schema(
        summary="Bulk create products",
        description="Create multiple products at once.",
        request={
            'application/json': {
                'type': 'array',
                'items': {'$ref': '#/components/schemas/Product'}
            }
        }
    )
)
class ProductViewSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        # Implementation
        pass
```

---

## @extend_schema_field

Document custom serializer fields.

### Basic Usage

```python
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

class ProductSerializer(serializers.ModelSerializer):
    @extend_schema_field(OpenApiTypes.STR)
    def get_price_display(self, obj):
        """Display price with currency symbol."""
        return f"Rs. {obj.price:.2f}"
    
    price_display = serializers.SerializerMethodField()
```

### With Custom Schema

```python
@extend_schema_field({
    'type': 'string',
    'format': 'currency',
    'example': 'Rs. 1,250.00',
    'description': 'Formatted price with LKR symbol'
})
def get_price_display(self, obj):
    return f"Rs. {obj.price:,.2f}"
```

---

## @extend_schema_serializer

Document serializer-level details.

### Basic Usage

```python
from drf_spectacular.utils import extend_schema_serializer

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Valid Product',
            value={
                'name': 'Ceylon Tea 100g',
                'sku': 'TEA-100',
                'price': '850.00',
                'category': 'Beverages'
            },
            request_only=True
        ),
        OpenApiExample(
            'Product Response',
            value={
                'id': 'uuid-here',
                'name': 'Ceylon Tea 100g',
                'sku': 'TEA-100',
                'price': '850.00',
                'created_at': '2024-01-15T10:00:00Z'
            },
            response_only=True
        )
    ]
)
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

### Deprecate Serializer

```python
@extend_schema_serializer(
    deprecate_fields=['old_field'],
    exclude_fields=['internal_field']
)
class ProductSerializer(serializers.ModelSerializer):
    # Serializer implementation
    pass
```

---

## Common Patterns

### Pagination

```python
from apps.core.api_docs import PRODUCT_LIST_RESPONSE_EXAMPLE

@extend_schema(
    summary="List products with pagination",
    responses={
        200: PRODUCT_LIST_RESPONSE_EXAMPLE
    },
    parameters=[
        OpenApiParameter(
            name='page',
            type=int,
            location=OpenApiParameter.QUERY,
            description='Page number'
        ),
        OpenApiParameter(
            name='page_size',
            type=int,
            description='Number of items per page (max 100)'
        ),
    ]
)
def list(self, request):
    pass
```

### Filtering

```python
@extend_schema(
    parameters=[
        OpenApiParameter(
            name='status',
            type={'type': 'string', 'enum': ['active', 'inactive', 'archived']},
            description='Filter by status'
        ),
        OpenApiParameter(
            name='created_after',
            type=OpenApiTypes.DATE,
            description='Filter by creation date (YYYY-MM-DD)'
        ),
    ]
)
def list(self, request):
    pass
```

### Search

```python
@extend_schema(
    parameters=[
        OpenApiParameter(
            name='search',
            type=str,
            description='Search in name, SKU, and description'
        ),
    ]
)
def list(self, request):
    pass
```

### Ordering

```python
@extend_schema(
    parameters=[
        OpenApiParameter(
            name='ordering',
            type=str,
            description='Order by field (prefix with - for descending). Options: name, price, created_at'
        ),
    ]
)
def list(self, request):
    pass
```

### Multi-Tenant Header

```python
@extend_schema(
    parameters=[
        OpenApiParameter(
            name='X-Tenant-ID',
            type=str,
            location=OpenApiParameter.HEADER,
            description='Tenant identifier (required for all requests)',
            required=True
        ),
    ]
)
```

### File Upload

```python
@extend_schema(
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'file': {
                    'type': 'string',
                    'format': 'binary'
                },
                'name': {
                    'type': 'string'
                }
            }
        }
    },
    responses={
        201: {'description': 'File uploaded successfully'}
    }
)
@action(detail=False, methods=['post'])
def upload(self, request):
    pass
```

---

## Best Practices

1. **Always add summary**: Every endpoint should have a clear summary
2. **Use examples**: Include request/response examples for clarity
3. **Document errors**: Always document possible error responses
4. **Use tags**: Group related endpoints with tags
5. **Add descriptions**: Provide detailed descriptions for complex endpoints
6. **Parameter descriptions**: Explain what each parameter does
7. **Test in Swagger**: Always test documented endpoints in Swagger UI
8. **Keep updated**: Update documentation when API changes

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
```

### Expected Outcome
```
backend/docs/api/
├── README.md             # API docs overview
└── decorators.md         # Decorator guide created
```

### Verification Checklist
- [ ] decorators.md created
- [ ] @extend_schema documented
- [ ] @extend_schema_view documented
- [ ] @extend_schema_field documented
- [ ] @extend_schema_serializer documented
- [ ] Common patterns included
- [ ] Examples comprehensive
- [ ] Best practices added

---

## Task 81: Document Extension Guide

### Overview
Create guide for using and extending the custom schema preprocessor and extensions.

### Dependencies
- Task 80: Document Schema Decorators

### Instructions

1. **Create extensions.md**
   - Create `backend/docs/api/extensions.md`
   - Document custom preprocessor
   - Explain extension system

2. **Document preprocessor hook**
   - What it does
   - How it works
   - When to use it
   - How to extend it

3. **Document schema customization**
   - Adding global parameters
   - Modifying endpoints
   - Adding custom documentation
   - Preprocessing patterns

4. **Document custom schemas**
   - Creating error schemas
   - Creating response schemas
   - Reusing schemas
   - Best practices

5. **Document examples system**
   - Creating examples
   - Organizing examples
   - Example patterns
   - Sri Lankan context

6. **Add extension examples**
   - Custom authentication docs
   - Custom error handling
   - Custom response formatting
   - Industry-specific extensions

### extensions.md
```markdown
# Extension Guide

Guide to extending and customizing the API documentation system.

## Table of Contents

- [Custom Preprocessor](#custom-preprocessor)
- [Schema Customization](#schema-customization)
- [Custom Schemas](#custom-schemas)
- [Examples System](#examples-system)
- [Extension Examples](#extension-examples)

---

## Custom Preprocessor

The custom preprocessor hook modifies the generated OpenAPI schema before it's served.

### Overview

Located in `backend/apps/core/api_docs/extensions.py`:

```python
def custom_preprocessing_hook(endpoints):
    """
    Custom preprocessing hook for OpenAPI schema.
    
    Adds multi-tenancy documentation, JWT authentication details,
    and Sri Lankan localization information to all endpoints.
    """
    # Implementation
    return endpoints
```

### What It Does

1. **Adds Global Headers**: X-Tenant-ID header to all authenticated endpoints
2. **Enhances Auth Docs**: Adds JWT token format and expiry information
3. **Adds Localization**: Documents LKR currency and timezone
4. **Modifies Descriptions**: Adds business rules and context

### How It Works

The preprocessor receives a list of `(path, path_regex, method, callback)` tuples and can:
- Modify endpoint paths
- Add/remove endpoints
- Modify endpoint metadata
- Add global parameters

### Example: Adding Global Header

```python
def custom_preprocessing_hook(endpoints):
    """Add X-Tenant-ID header to all endpoints."""
    
    for path, path_regex, method, callback in endpoints:
        # Check if endpoint requires authentication
        if hasattr(callback, 'cls'):
            view_class = callback.cls
            if hasattr(view_class, 'authentication_classes'):
                # Add tenant header parameter
                if not hasattr(callback, 'kwargs'):
                    callback.kwargs = {}
                
                if 'parameters' not in callback.kwargs:
                    callback.kwargs['parameters'] = []
                
                # Add X-Tenant-ID parameter
                callback.kwargs['parameters'].append({
                    'name': 'X-Tenant-ID',
                    'in': 'header',
                    'required': True,
                    'schema': {'type': 'string'},
                    'description': 'Tenant identifier'
                })
    
    return endpoints
```

### When to Use

Use the preprocessor to:
- Add global headers (X-Tenant-ID, X-Request-ID)
- Add business rules documentation
- Modify descriptions programmatically
- Add localization information
- Enforce documentation standards

### Extending the Preprocessor

To add custom preprocessing:

1. **Edit extensions.py**:
```python
def custom_preprocessing_hook(endpoints):
    # Existing preprocessing
    endpoints = add_tenant_header(endpoints)
    endpoints = add_jwt_docs(endpoints)
    
    # Add your custom preprocessing
    endpoints = add_custom_documentation(endpoints)
    
    return endpoints

def add_custom_documentation(endpoints):
    """Add custom documentation to endpoints."""
    for path, path_regex, method, callback in endpoints:
        # Your custom logic
        pass
    return endpoints
```

2. **Register in settings** (already configured):
```python
SPECTACULAR_SETTINGS = {
    'PREPROCESSING_HOOKS': [
        'apps.core.api_docs.extensions.custom_preprocessing_hook'
    ],
}
```

---

## Schema Customization

### Global Schema Modifications

Modify the entire schema after generation:

```python
def postprocessing_hook(result, generator, request, public):
    """
    Modify schema after generation.
    
    Args:
        result: Generated OpenAPI schema (dict)
        generator: SchemaGenerator instance
        request: HTTP request object
        public: Whether schema is public
    """
    # Add custom info
    result['info']['x-custom-field'] = 'custom value'
    
    # Add custom servers
    result['servers'].append({
        'url': 'https://custom.server.com',
        'description': 'Custom Server'
    })
    
    # Modify paths
    for path, path_item in result['paths'].items():
        # Add custom path documentation
        pass
    
    return result
```

Register in settings:

```python
SPECTACULAR_SETTINGS = {
    'POSTPROCESSING_HOOKS': [
        'apps.core.api_docs.extensions.postprocessing_hook'
    ],
}
```

### Adding Custom Components

Add reusable schemas to components:

```python
def postprocessing_hook(result, generator, request, public):
    # Add custom schemas to components
    if 'components' not in result:
        result['components'] = {}
    if 'schemas' not in result['components']:
        result['components']['schemas'] = {}
    
    result['components']['schemas']['SriLankanAddress'] = {
        'type': 'object',
        'properties': {
            'street': {'type': 'string'},
            'city': {'type': 'string'},
            'district': {
                'type': 'string',
                'enum': [
                    'Colombo', 'Gampaha', 'Kalutara',
                    'Kandy', 'Matale', 'Nuwara Eliya',
                    # ... all 25 districts
                ]
            },
            'postal_code': {
                'type': 'string',
                'pattern': '^[0-9]{5}$'
            }
        },
        'required': ['city', 'district']
    }
    
    return result
```

---

## Custom Schemas

### Creating Error Schemas

Located in `backend/apps/core/api_docs/schemas.py`:

```python
from rest_framework import serializers

class ErrorResponseSchema(serializers.Serializer):
    """Standard error response schema."""
    error = serializers.DictField(
        help_text="Error details",
        child=serializers.CharField()
    )

class ValidationErrorSchema(serializers.Serializer):
    """Validation error response schema."""
    field_name = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of validation errors for this field"
    )
```

### Creating Response Schemas

For custom response structures:

```python
class PaginatedResponseSchema(serializers.Serializer):
    """Paginated response schema."""
    count = serializers.IntegerField(
        help_text="Total number of items"
    )
    next = serializers.URLField(
        allow_null=True,
        help_text="URL to next page"
    )
    previous = serializers.URLField(
        allow_null=True,
        help_text="URL to previous page"
    )
    results = serializers.ListField(
        help_text="Array of results"
    )

class BulkOperationResponseSchema(serializers.Serializer):
    """Bulk operation response schema."""
    success_count = serializers.IntegerField()
    error_count = serializers.IntegerField()
    errors = serializers.ListField(
        child=serializers.DictField()
    )
```

### Using Custom Schemas

In ViewSet:

```python
from apps.core.api_docs.schemas import BulkOperationResponseSchema

@extend_schema(
    responses={
        200: BulkOperationResponseSchema,
        400: ValidationErrorSchema,
    }
)
@action(detail=False, methods=['post'])
def bulk_create(self, request):
    # Implementation
    pass
```

### Exporting Schemas

Add to `__init__.py`:

```python
__all__ = [
    'ErrorResponseSchema',
    'ValidationErrorSchema',
    'BulkOperationResponseSchema',
]
```

---

## Examples System

### Creating Examples

Located in `backend/apps/core/api_docs/examples.py`.

### Example Structure

```python
EXAMPLE_NAME = {
    'request': {
        # Request body fields
    },
    'response': {
        # Response body fields
    }
}
```

Or separate:

```python
REQUEST_EXAMPLE = {
    'request': {
        # Fields
    }
}

RESPONSE_EXAMPLE = {
    'response': {
        # Fields
    }
}
```

### Sri Lankan Context Examples

Always use Sri Lankan context:

```python
CREATE_CUSTOMER_EXAMPLE = {
    'request': {
        'name': 'Nimal Perera',
        'email': 'nimal@example.lk',
        'phone': '+94771234567',
        'address': {
            'street': '123 Galle Road',
            'city': 'Colombo',
            'district': 'Colombo',
            'postal_code': '00300'
        },
        'language': 'si',  # Sinhala
        'preferred_currency': 'LKR'
    }
}

CREATE_PRODUCT_EXAMPLE = {
    'request': {
        'name': 'Ceylon Tea Premium 100g',
        'sku': 'TEA-CEYLON-100',
        'price': '850.00',  # LKR
        'category': 'Beverages',
        'description': 'Premium Ceylon black tea from Nuwara Eliya',
        'unit': 'g',
        'weight': 100
    }
}
```

### Using Examples

```python
from apps.core.api_docs import (
    CREATE_CUSTOMER_EXAMPLE,
    CUSTOMER_RESPONSE_EXAMPLE,
)

@extend_schema(
    request=CREATE_CUSTOMER_EXAMPLE,
    responses={
        201: CUSTOMER_RESPONSE_EXAMPLE
    }
)
def create(self, request):
    pass
```

### Example Best Practices

1. **Realistic Data**: Use realistic Sri Lankan names, addresses, phone numbers
2. **Currency**: Always use LKR values (850.00 not 8.50)
3. **Phone Format**: Use +94 format (+94771234567)
4. **Addresses**: Use real Sri Lankan cities and districts
5. **Business Context**: Use industry-specific examples
6. **Completeness**: Include all required fields
7. **Validation**: Ensure examples pass validation

---

## Extension Examples

### Custom Authentication Documentation

Add OAuth2 flow:

```python
SPECTACULAR_SETTINGS = {
    'APPEND_COMPONENTS': {
        'securitySchemes': {
            'OAuth2': {
                'type': 'oauth2',
                'flows': {
                    'authorizationCode': {
                        'authorizationUrl': '/oauth/authorize',
                        'tokenUrl': '/oauth/token',
                        'scopes': {
                            'read': 'Read access',
                            'write': 'Write access'
                        }
                    }
                }
            }
        }
    },
}
```

### Industry-Specific Extensions

For retail:

```python
def add_retail_documentation(endpoints):
    """Add retail-specific documentation."""
    retail_endpoints = ['/api/pos/', '/api/sales/', '/api/inventory/']
    
    for path, path_regex, method, callback in endpoints:
        if any(retail_path in path for retail_path in retail_endpoints):
            # Add retail-specific documentation
            if hasattr(callback, 'kwargs'):
                if 'description' in callback.kwargs:
                    callback.kwargs['description'] += (
                        "\n\n## Retail Notes\n"
                        "- Supports barcode scanning\n"
                        "- Integrates with POS hardware\n"
                        "- Real-time inventory updates\n"
                    )
    
    return endpoints
```

### Custom Validators

Add schema validators:

```python
def validate_sri_lankan_context(schema):
    """Validate Sri Lankan context in schema."""
    # Check for LKR currency
    # Check for Sri Lankan phone format
    # Check for proper address structure
    pass
```

---

## Tips and Best Practices

1. **Keep Preprocessor Fast**: Don't add expensive operations
2. **Test Extensions**: Test custom preprocessing thoroughly
3. **Document Changes**: Document any custom extensions
4. **Version Extensions**: Version custom schemas and examples
5. **Maintain Consistency**: Follow established patterns
6. **Use Type Hints**: Add type hints to custom functions
7. **Add Tests**: Test custom extensions and schemas

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
```

### Expected Outcome
```
backend/docs/api/
├── README.md             # API docs overview
├── decorators.md         # Decorator guide
└── extensions.md         # Extension guide created
```

### Verification Checklist
- [ ] extensions.md created
- [ ] Preprocessor documented
- [ ] Schema customization explained
- [ ] Custom schemas documented
- [ ] Examples system explained
- [ ] Extension examples added
- [ ] Best practices included

---

## Task 82: Verify Full Integration

### Overview
Final verification that all API documentation components are working together correctly.

### Dependencies
- Task 81: Document Extension Guide

### Instructions

1. **Run all tests**
   - Run schema generation tests
   - Run schema validation tests
   - Run endpoint coverage tests
   - Run example tests
   - Verify all pass

2. **Test documentation interfaces**
   - Access Swagger UI
   - Test all endpoints in Swagger
   - Test authentication flow
   - Verify examples work
   - Access ReDoc
   - Verify all sections present

3. **Verify schema download**
   - Download schema from /api/schema/
   - Validate schema format
   - Check completeness
   - Verify against OpenAPI 3.0 spec

4. **Test CI/CD integration**
   - Create test PR
   - Verify schema validation runs
   - Check test results
   - Verify PR comments

5. **Verify documentation**
   - Check README complete
   - Check decorator guide complete
   - Check extension guide complete
   - Verify examples correct

6. **Create verification checklist**
   - Document all checks
   - Create sign-off template
   - Verify with stakeholders

### Verification Script

Create `backend/scripts/verify_api_docs.py`:

```python
"""
Verification script for API documentation system.

Run this script to verify that all API documentation
components are working correctly.
"""
import sys
import subprocess
from pathlib import Path


def run_command(cmd, description):
    """Run command and report status."""
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"{'='*60}")
    print(f"Command: {cmd}\n")
    
    result = subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print(f"✅ PASSED: {description}")
        return True
    else:
        print(f"❌ FAILED: {description}")
        print(f"Error: {result.stderr}")
        return False


def main():
    """Run all verification checks."""
    print("="*60)
    print("API Documentation Verification")
    print("="*60)
    
    checks = []
    
    # 1. Schema generation
    checks.append(run_command(
        "python manage.py spectacular --validate --fail-on-warn",
        "Schema Generation & Validation"
    ))
    
    # 2. Schema tests
    checks.append(run_command(
        "pytest apps/core/tests/test_api_docs/test_schema.py -v",
        "Schema Generation Tests"
    ))
    
    # 3. Endpoint tests
    checks.append(run_command(
        "pytest apps/core/tests/test_api_docs/test_endpoints.py -v",
        "Endpoint Coverage Tests"
    ))
    
    # 4. Example tests
    checks.append(run_command(
        "pytest apps/core/tests/test_api_docs/test_examples.py -v",
        "Example Validation Tests"
    ))
    
    # 5. Full test suite
    checks.append(run_command(
        "pytest apps/core/tests/test_api_docs/ --cov=apps.core.api_docs",
        "Full Test Suite with Coverage"
    ))
    
    # 6. Check documentation files
    docs_files = [
        'docs/api/README.md',
        'docs/api/decorators.md',
        'docs/api/extensions.md',
    ]
    
    for doc_file in docs_files:
        exists = Path(doc_file).exists()
        if exists:
            print(f"✅ FOUND: {doc_file}")
            checks.append(True)
        else:
            print(f"❌ MISSING: {doc_file}")
            checks.append(False)
    
    # Summary
    print("\n" + "="*60)
    print("VERIFICATION SUMMARY")
    print("="*60)
    
    passed = sum(checks)
    total = len(checks)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"Passed: {passed}/{total} ({percentage:.1f}%)")
    
    if passed == total:
        print("\n✅ ALL CHECKS PASSED - API Documentation is fully functional!")
        return 0
    else:
        print(f"\n❌ {total - passed} CHECKS FAILED - Please review errors above")
        return 1


if __name__ == '__main__':
    sys.exit(main())
```

### Running Verification

```bash
# Make script executable
chmod +x backend/scripts/verify_api_docs.py

# Run verification
cd backend
python scripts/verify_api_docs.py
```

### Expected Verification Output

```
============================================================
API Documentation Verification
============================================================

============================================================
Testing: Schema Generation & Validation
============================================================
Command: python manage.py spectacular --validate --fail-on-warn

✅ PASSED: Schema Generation & Validation

============================================================
Testing: Schema Generation Tests
============================================================
Command: pytest apps/core/tests/test_api_docs/test_schema.py -v

test_schema.py::TestSchemaGeneration::test_schema_can_be_generated PASSED
test_schema.py::TestSchemaGeneration::test_schema_has_required_keys PASSED
... (11 tests)

✅ PASSED: Schema Generation Tests

============================================================
Testing: Endpoint Coverage Tests
============================================================
Command: pytest apps/core/tests/test_api_docs/test_endpoints.py -v

test_endpoints.py::TestEndpointCoverage::test_all_viewsets_registered PASSED
... (14 tests)

✅ PASSED: Endpoint Coverage Tests

============================================================
Testing: Example Validation Tests
============================================================
Command: pytest apps/core/tests/test_api_docs/test_examples.py -v

test_examples.py::TestRequestExamples::test_login_request_example PASSED
... (17 tests)

✅ PASSED: Example Validation Tests

============================================================
Testing: Full Test Suite with Coverage
============================================================

---------- coverage: platform linux, python 3.11 -----------
Name                                      Stmts   Miss  Cover
-------------------------------------------------------------
apps/core/api_docs/__init__.py               15      0   100%
apps/core/api_docs/extensions.py             45      2    96%
apps/core/api_docs/schemas.py                32      0   100%
apps/core/api_docs/examples.py               78      0   100%
apps/core/api_docs/urls.py                   12      0   100%
-------------------------------------------------------------
TOTAL                                       182      2    99%

✅ PASSED: Full Test Suite with Coverage

✅ FOUND: docs/api/README.md
✅ FOUND: docs/api/decorators.md
✅ FOUND: docs/api/extensions.md

============================================================
VERIFICATION SUMMARY
============================================================
Passed: 8/8 (100.0%)

✅ ALL CHECKS PASSED - API Documentation is fully functional!
```

### Final Verification Checklist

```markdown
# SubPhase-11 API Documentation - Final Verification

## Component Checks

### Group A: drf-spectacular Setup
- [ ] drf-spectacular installed
- [ ] Settings configured
- [ ] URLs configured
- [ ] Schema generation works

### Group B: Schema Configuration
- [ ] API metadata configured
- [ ] Contact info added
- [ ] License info added
- [ ] Servers configured
- [ ] Tags organized

### Group C: Swagger UI
- [ ] Swagger UI accessible
- [ ] Theme configured
- [ ] Try It Out works
- [ ] Authentication works

### Group D: ReDoc
- [ ] ReDoc accessible
- [ ] Theme configured
- [ ] All sections present
- [ ] Logo displayed

### Group E: Documentation Enhancements
- [ ] Custom preprocessor working
- [ ] Error schemas created
- [ ] Examples created
- [ ] Rate limiting documented
- [ ] Versioning documented
- [ ] Changelog created
- [ ] Exports working

### Group F: Testing & Validation
- [ ] Schema tests pass (25 tests)
- [ ] Example tests pass (17 tests)
- [ ] Auth tests pass (7 tests)
- [ ] Coverage ≥95%
- [ ] CI/CD configured
- [ ] Documentation complete

## Interface Checks

### Swagger UI
- [ ] Accessible at /api/schema/swagger-ui/
- [ ] All endpoints listed
- [ ] Authentication works
- [ ] Try It Out works
- [ ] Examples displayed
- [ ] Errors displayed correctly

### ReDoc
- [ ] Accessible at /api/schema/redoc/
- [ ] Clean layout
- [ ] All sections present
- [ ] Examples displayed
- [ ] Search works

### Schema Download
- [ ] Accessible at /api/schema/
- [ ] Valid OpenAPI 3.0 format
- [ ] All endpoints included
- [ ] All components included

## Documentation Checks

- [ ] README.md complete
- [ ] decorators.md complete
- [ ] extensions.md complete
- [ ] All examples documented
- [ ] Troubleshooting section added

## CI/CD Checks

- [ ] GitHub Actions workflow created
- [ ] Schema validation runs on PR
- [ ] Tests run on PR
- [ ] PR comments working
- [ ] Coverage reported

## Final Sign-Off

- [ ] All 82 tasks completed
- [ ] All 6 groups complete
- [ ] All tests passing
- [ ] Documentation complete
- [ ] CI/CD integrated
- [ ] Stakeholder approval

**Verified By**: _______________  
**Date**: _______________  
**Signature**: _______________
```

### Expected Outcome

```
backend/
├── scripts/
│   └── verify_api_docs.py    # Verification script
└── docs/api/
    ├── README.md              # Complete
    ├── decorators.md          # Complete
    └── extensions.md          # Complete

SubPhase-11 Status: ✅ COMPLETE
```

### Verification Checklist

- [ ] Verification script created
- [ ] All tests run successfully
- [ ] Schema validation passes
- [ ] Swagger UI tested
- [ ] ReDoc tested
- [ ] Documentation verified
- [ ] CI/CD tested
- [ ] Final checklist complete
- [ ] Stakeholder sign-off obtained

---

## Summary

SubPhase-11 API Documentation is now complete!

### What We Accomplished

1. ✅ Created API documentation guides
2. ✅ Documented schema decorators
3. ✅ Documented extension system
4. ✅ Verified full integration

### Final Deliverables

```
backend/
├── apps/core/api_docs/
│   ├── __init__.py           # All exports
│   ├── urls.py               # Documentation URLs
│   ├── extensions.py         # Custom preprocessor
│   ├── schemas.py            # Error schemas
│   └── examples.py           # Request/response examples
├── apps/core/tests/test_api_docs/
│   ├── conftest.py           # Test fixtures
│   ├── test_schema.py        # Schema tests (18 tests)
│   ├── test_endpoints.py     # Endpoint tests (14 tests)
│   └── test_examples.py      # Example tests (17 tests)
├── docs/api/
│   ├── README.md             # API docs overview
│   ├── decorators.md         # Decorator guide
│   └── extensions.md         # Extension guide
├── scripts/
│   └── verify_api_docs.py    # Verification script
└── .github/workflows/
    └── api-schema.yml        # CI validation

Total: 49 tests, 99% coverage, Full CI/CD integration
```

### Complete Task Summary

| Group | Tasks | Documents | Status |
|-------|-------|-----------|--------|
| **A** | 01-14 | 3 | ✅ Complete |
| **B** | 15-28 | 3 | ✅ Complete |
| **C** | 29-42 | 3 | ✅ Complete |
| **D** | 43-54 | 2 | ✅ Complete |
| **E** | 55-70 | 3 | ✅ Complete |
| **F** | 71-82 | 3 | ✅ Complete |
| **Total** | **82 tasks** | **17 docs** | **✅ COMPLETE** |

### Git Commit Message

```
docs(api-docs): complete API documentation system

- Create comprehensive API documentation README
- Document @extend_schema decorator usage
- Document extension system and preprocessor
- Create verification script and checklist
- Verify full integration of all components
- All 82 tasks complete
- All 6 groups complete
- 49 tests passing with 99% coverage
- CI/CD fully integrated

SubPhase-11 Complete: API Documentation
All Groups (A-F) Complete
Ready for Production
```

### Next Steps

SubPhase-11 is complete! Proceed to:
- **SubPhase-12**: Core Utilities & Helpers
- **Phase-04**: ERP Core Modules (Part 1)

---

**SubPhase-11 Status**: ✅ **COMPLETE**  
**Total Tasks**: 82  
**Total Documents**: 17  
**Test Coverage**: 99%  
**CI/CD**: ✅ Integrated
