# Tasks 84-88: API Endpoints and Tests

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** F - Import/Export & API  
> **Document:** 02 of 02  
> **Tasks Covered:** 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-83_Import-Export.md](01_Tasks-79-83_Import-Export.md)

---

## Document Overview

This document covers API serializers, viewsets, filtering, URL configuration, and comprehensive testing.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 84 | Create CustomerSerializer | Medium | 30 min |
| 85 | Create CustomerViewSet | High | 35 min |
| 86 | Implement Customer Filtering | Medium | 25 min |
| 87 | Register Customer API URLs | Low | 20 min |
| 88 | Create Customer Module Tests | High | 45 min |

---

## Task 84: Create CustomerSerializer

### Overview
Create Django REST Framework serializer for Customer model with nested relationships.

### Dependencies
- Django REST Framework installed

### Instructions

1. **Create serializers directory** in customers app
2. **Create customer_serializer.py file**

3. **Define CustomerSerializer**
   - Include all Customer fields
   - Nest AddressSerializer
   - Nest PhoneSerializer
   - Include calculated fields

4. **Create nested serializers**
   - AddressSerializer
   - PhoneSerializer
   - TagSerializer

5. **Add custom methods**
   - get_full_name
   - get_primary_address
   - get_primary_phone
   - get_purchase_summary

6. **Implement field validation**
   - Email uniqueness
   - Phone format (Sri Lanka)
   - District-province validation

### CustomerSerializer Structure

```json
{
  "id": "uuid",
  "customer_code": "CUST-00001",
  "customer_type": "INDIVIDUAL",
  "status": "ACTIVE",
  "first_name": "John",
  "last_name": "Perera",
  "full_name": "John Perera",
  "company_name": null,
  "email": "john@example.com",
  "primary_phone": "+94712345678",
  "tax_id": "123456789V",
  "credit_limit": 50000.00,
  "outstanding_balance": 0.00,
  "total_purchases": 125000.00,
  "addresses": [
    {
      "id": "uuid",
      "address_type": "BILLING",
      "address_line_1": "123 Main St",
      "city": "Colombo",
      "district": "Colombo",
      "province": "Western",
      "postal_code": "00100",
      "is_default": true
    }
  ],
  "phones": [
    {
      "id": "uuid",
      "phone_type": "MOBILE",
      "phone_number": "+94712345678",
      "is_primary": true
    }
  ],
  "tags": [
    {
      "id": "uuid",
      "name": "VIP",
      "color": "#FFD700"
    }
  ],
  "purchase_summary": {
    "total_orders": 25,
    "average_order_value": 5000.00,
    "last_purchase_date": "2026-01-10"
  },
  "created_at": "2025-03-15T10:30:00",
  "updated_at": "2026-01-15T14:20:00"
}
```

### Serializer Options

| Option | Description |
|--------|-------------|
| depth | Control nested serialization depth |
| read_only_fields | Fields not editable via API |
| write_only_fields | Fields not returned in response |
| required | Required fields for creation |

### Read-Only Fields

- id
- customer_code (auto-generated)
- total_purchases (calculated)
- outstanding_balance (calculated)
- created_at
- updated_at

### Expected Outcome
- Complete CustomerSerializer with nested data

### Verification Checklist
- [ ] serializers/ directory created
- [ ] CustomerSerializer defined
- [ ] Nested serializers created
- [ ] Custom methods implemented
- [ ] Validation working
- [ ] Read-only fields configured

---

## Task 85: Create CustomerViewSet

### Overview
Create Django REST Framework ViewSet with CRUD operations and custom actions.

### Dependencies
- Task 84: Create CustomerSerializer

### Instructions

1. **Create views directory** in customers app
2. **Create customer_viewset.py file**
3. **Define CustomerViewSet** inheriting from ModelViewSet

4. **Implement standard actions**
   - list (GET /customers/)
   - create (POST /customers/)
   - retrieve (GET /customers/{id}/)
   - update (PUT /customers/{id}/)
   - partial_update (PATCH /customers/{id}/)
   - destroy (DELETE /customers/{id}/)

5. **Add custom actions**
   - search (GET /customers/search/)
   - addresses (GET /customers/{id}/addresses/)
   - phones (GET /customers/{id}/phones/)
   - communications (GET /customers/{id}/communications/)
   - history (GET /customers/{id}/history/)
   - statistics (GET /customers/{id}/statistics/)
   - activity (GET /customers/{id}/activity/)
   - assign_tag (POST /customers/{id}/tags/)
   - remove_tag (DELETE /customers/{id}/tags/{tag_id}/)
   - import_csv (POST /customers/import/)
   - export_csv (GET /customers/export/)
   - duplicates (GET /customers/duplicates/)
   - merge (POST /customers/merge/)

6. **Add permission classes**
   - IsAuthenticated
   - TenantPermission

7. **Implement pagination**
   - PageNumberPagination
   - Page size: 50 (configurable)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/customers/ | List all customers |
| POST | /api/v1/customers/ | Create new customer |
| GET | /api/v1/customers/{id}/ | Get customer detail |
| PUT | /api/v1/customers/{id}/ | Update customer (full) |
| PATCH | /api/v1/customers/{id}/ | Update customer (partial) |
| DELETE | /api/v1/customers/{id}/ | Delete customer |
| GET | /api/v1/customers/search/ | Search customers |
| GET | /api/v1/customers/{id}/addresses/ | List customer addresses |
| POST | /api/v1/customers/{id}/addresses/ | Add new address |
| GET | /api/v1/customers/{id}/phones/ | List customer phones |
| POST | /api/v1/customers/{id}/phones/ | Add new phone |
| GET | /api/v1/customers/{id}/communications/ | Communication timeline |
| POST | /api/v1/customers/{id}/communications/ | Log communication |
| GET | /api/v1/customers/{id}/history/ | Purchase history |
| GET | /api/v1/customers/{id}/statistics/ | Customer statistics |
| GET | /api/v1/customers/{id}/activity/ | Activity feed |
| POST | /api/v1/customers/{id}/tags/ | Assign tag |
| DELETE | /api/v1/customers/{id}/tags/{tag_id}/ | Remove tag |
| POST | /api/v1/customers/import/ | Import from CSV |
| GET | /api/v1/customers/export/ | Export to CSV |
| GET | /api/v1/customers/duplicates/ | List potential duplicates |
| POST | /api/v1/customers/merge/ | Merge customers |

### Custom Action Examples

#### Search Action
```python
@action(detail=False, methods=['get'])
def search(self, request):
    """
    Search customers by name, email, phone
    Query params: q (search term)
    """
```

#### Import Action
```python
@action(detail=False, methods=['post'])
def import_csv(self, request):
    """
    Import customers from CSV file
    Accepts: multipart/form-data with 'file' field
    """
```

#### Statistics Action
```python
@action(detail=True, methods=['get'])
def statistics(self, request, pk=None):
    """
    Get customer statistics
    Returns: RFM metrics, totals, averages
    """
```

### Expected Outcome
- Complete CustomerViewSet with all endpoints

### Verification Checklist
- [ ] views/ directory created
- [ ] CustomerViewSet defined
- [ ] All standard actions implemented
- [ ] Custom actions added
- [ ] Permissions configured
- [ ] Pagination set up

---

## Task 86: Implement Customer Filtering

### Overview
Add comprehensive filtering options for customer list API.

### Dependencies
- Task 85: Create CustomerViewSet
- django-filter library installed

### Instructions

1. **Install django-filter**
   - Add to requirements.txt
   - Add to INSTALLED_APPS

2. **Create filters.py file** in customers app
3. **Define CustomerFilter class**

4. **Add filter fields**
   - status (exact, in)
   - customer_type (exact, in)
   - tags (name, multiple)
   - created_at (range)
   - total_purchases (range)
   - outstanding_balance (range)
   - province (exact, in)
   - district (exact, in)
   - has_outstanding (boolean)
   - search (name, email, phone)

5. **Add to CustomerViewSet**
   - Configure filter_backends
   - Set filterset_class

### Filter Options

| Filter | Type | Example |
|--------|------|---------|
| status | Choice | ?status=ACTIVE |
| status__in | Multiple | ?status__in=ACTIVE,POTENTIAL |
| customer_type | Choice | ?customer_type=BUSINESS |
| tags | Name | ?tags=vip |
| tags__in | Multiple | ?tags__in=vip,wholesale |
| created_from | Date | ?created_from=2026-01-01 |
| created_to | Date | ?created_to=2026-01-31 |
| total_purchases_min | Decimal | ?total_purchases_min=100000 |
| total_purchases_max | Decimal | ?total_purchases_max=500000 |
| has_outstanding | Boolean | ?has_outstanding=true |
| province | Choice | ?province=Western |
| district | Choice | ?district=Colombo |
| search | Text | ?search=john |

### Filter Query Examples

```
# Active business customers
GET /customers/?status=ACTIVE&customer_type=BUSINESS

# VIP or wholesale customers
GET /customers/?tags__in=vip,wholesale

# Customers created in January 2026
GET /customers/?created_from=2026-01-01&created_to=2026-01-31

# High-value customers (>500K purchases)
GET /customers/?total_purchases_min=500000

# Customers with outstanding balance
GET /customers/?has_outstanding=true

# Customers in Western Province
GET /customers/?province=Western

# Search by name, email, or phone
GET /customers/?search=john

# Combined filters
GET /customers/?status=ACTIVE&customer_type=BUSINESS&province=Western&total_purchases_min=100000
```

### Custom Filter Methods

1. **has_outstanding filter**
   - Filter customers with outstanding_balance > 0

2. **tags filter**
   - Filter by tag names
   - Support multiple tags (AND/OR)

3. **search filter**
   - Search across: first_name, last_name, company_name, email
   - Use icontains lookup

### Expected Outcome
- Comprehensive customer filtering

### Verification Checklist
- [ ] django-filter installed
- [ ] filters.py created
- [ ] CustomerFilter defined
- [ ] All filter fields added
- [ ] Custom filters implemented
- [ ] Integrated with CustomerViewSet
- [ ] Filter queries working

---

## Task 87: Register Customer API URLs

### Overview
Configure URL routing for customer API endpoints.

### Dependencies
- Task 86: Implement Customer Filtering

### Instructions

1. **Create urls.py file** in customers app

2. **Configure router**
   - Use DefaultRouter from DRF
   - Register CustomerViewSet

3. **Add to main API URLs**
   - Include customers.urls in api/urls.py
   - Prefix: /api/v1/customers/

4. **Add additional URL patterns**
   - Import/export views
   - Custom endpoints not in ViewSet

### URL Configuration Structure

```python
# customers/urls.py
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')

urlpatterns = router.urls
```

```python
# api/urls.py
from django.urls import path, include

urlpatterns = [
    path('v1/', include('apps.customers.urls')),
]
```

### Generated URL Patterns

```
/api/v1/customers/                            → CustomerViewSet.list
/api/v1/customers/<uuid>/                     → CustomerViewSet.retrieve
/api/v1/customers/search/                     → CustomerViewSet.search
/api/v1/customers/<uuid>/addresses/           → CustomerViewSet.addresses
/api/v1/customers/<uuid>/phones/              → CustomerViewSet.phones
/api/v1/customers/<uuid>/communications/      → CustomerViewSet.communications
/api/v1/customers/<uuid>/history/             → CustomerViewSet.history
/api/v1/customers/<uuid>/statistics/          → CustomerViewSet.statistics
/api/v1/customers/<uuid>/activity/            → CustomerViewSet.activity
/api/v1/customers/<uuid>/tags/                → CustomerViewSet.assign_tag
/api/v1/customers/<uuid>/tags/<uuid>/         → CustomerViewSet.remove_tag
/api/v1/customers/import/                     → CustomerViewSet.import_csv
/api/v1/customers/export/                     → CustomerViewSet.export_csv
/api/v1/customers/duplicates/                 → CustomerViewSet.duplicates
/api/v1/customers/merge/                      → CustomerViewSet.merge
```

### Expected Outcome
- Complete API URL routing

### Verification Checklist
- [ ] urls.py created in customers app
- [ ] Router configured
- [ ] CustomerViewSet registered
- [ ] URLs included in main API config
- [ ] All endpoints accessible

---

## Task 88: Create Customer Module Tests

### Overview
Create comprehensive test suite covering models, services, and API endpoints.

### Dependencies
- All previous tasks completed

### Instructions

1. **Create tests directory** in customers app

2. **Create test files**
   - test_models.py (model tests)
   - test_services.py (service tests)
   - test_search.py (search tests)
   - test_import.py (import/export tests)
   - test_api.py (API endpoint tests)

3. **Model tests**
   - Customer model creation
   - Field validations
   - Customer code generation
   - Address model
   - Phone model
   - Tag assignment

4. **Service tests**
   - CustomerService CRUD
   - Search functionality
   - Tag assignment
   - Duplicate detection
   - Customer merge

5. **Import tests**
   - CSV import validation
   - Column mapping
   - Error handling
   - Export functionality

6. **API tests**
   - List customers
   - Create customer
   - Update customer
   - Delete customer
   - Search endpoint
   - Custom actions
   - Filtering
   - Pagination
   - Permissions

### Test Categories

| Category | File | Tests |
|----------|------|-------|
| Models | test_models.py | 15-20 tests |
| Services | test_services.py | 20-25 tests |
| Search | test_search.py | 10-15 tests |
| Import/Export | test_import.py | 15-20 tests |
| API | test_api.py | 25-30 tests |

### Model Test Examples

- test_create_individual_customer
- test_create_business_customer
- test_customer_code_generation
- test_customer_full_name
- test_address_creation
- test_phone_validation
- test_tag_assignment
- test_duplicate_detection

### Service Test Examples

- test_create_customer_service
- test_update_customer_service
- test_delete_customer_service
- test_search_by_name
- test_search_by_email
- test_search_by_phone
- test_full_text_search
- test_tag_assignment
- test_duplicate_detection_by_email
- test_customer_merge

### API Test Examples

- test_list_customers_api
- test_create_customer_api
- test_update_customer_api
- test_delete_customer_api
- test_search_customers_api
- test_filter_by_status
- test_filter_by_tags
- test_customer_addresses_api
- test_customer_statistics_api
- test_import_csv_api
- test_export_csv_api
- test_merge_customers_api
- test_pagination
- test_permissions

### Test Fixtures

Create reusable test data:
- CustomerFactory (using factory_boy)
- AddressFactory
- PhoneFactory
- TagFactory
- Test CSV files

### Expected Outcome
- Comprehensive test coverage (>85%)

### Verification Checklist
- [ ] tests/ directory created
- [ ] All test files created
- [ ] Model tests implemented (15+ tests)
- [ ] Service tests implemented (20+ tests)
- [ ] Search tests implemented (10+ tests)
- [ ] Import tests implemented (15+ tests)
- [ ] API tests implemented (25+ tests)
- [ ] Test fixtures created
- [ ] All tests passing
- [ ] Coverage >85%

---

## Summary

This document implemented API and testing:

### Completed Features
- ✅ CustomerSerializer with nested data
- ✅ AddressSerializer, PhoneSerializer, TagSerializer
- ✅ CustomerViewSet with all CRUD operations
- ✅ 20+ custom API actions (search, import, export, statistics, etc.)
- ✅ Comprehensive filtering (status, type, tags, dates, amounts)
- ✅ django-filter integration
- ✅ API URL routing configured
- ✅ Comprehensive test suite (85+ tests)
- ✅ Test coverage >85%

### Key Achievements
1. **Complete API** - RESTful endpoints for all customer operations
2. **Rich Filtering** - Multiple filter options with combinations
3. **Nested Data** - Addresses, phones, tags in serializer
4. **Custom Actions** - Import, export, merge, statistics
5. **Comprehensive Tests** - Models, services, API coverage

### API Endpoints Summary
- Standard CRUD (list, create, retrieve, update, delete)
- Search and filtering
- Import/Export CSV
- Customer statistics and activity
- Tag management
- Duplicate detection and merge
- Communication and history

### Test Coverage
- Models: 15-20 tests
- Services: 20-25 tests
- Search: 10-15 tests
- Import/Export: 15-20 tests
- API: 25-30 tests
- **Total: 85-110 tests**

### Group F Complete
All import/export and API functionality implemented.

---

## Customer Module Complete! 🎉

All 88 tasks across 6 groups (A-F) have been documented:
- ✅ **Group A:** Customer Model & Profile (Tasks 01-18)
- ✅ **Group B:** Addresses & Contact Information (Tasks 19-34)
- ✅ **Group C:** Customer Services & Search (Tasks 35-50)
- ✅ **Group D:** Communication & History (Tasks 51-64)
- ✅ **Group E:** Segmentation & Duplicate Detection (Tasks 65-78)
- ✅ **Group F:** Import/Export & API (Tasks 79-88)

The Customer Module is ready for implementation!

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~850
