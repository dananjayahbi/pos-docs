# Group F: Import/Export & API

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** F of F  
> **Tasks Covered:** 79-88  
> **Group Goal:** Implement CSV import/export and API endpoints

---

## Navigation

- **↑ Parent:** [SubPhase-08 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Segmentation & Duplicate Detection](../Group-E_Segmentation-Duplicate-Detection/)

---

## Group Overview

### Key Outcomes

1. **Customer CSV Importer** - Import from CSV
2. **Column Mapping** - Map CSV columns to fields
3. **Import Validation** - Validate, skip/flag invalid
4. **Import Progress Tracking** - Track for large files
5. **Customer CSV Exporter** - Export to CSV
6. **CustomerSerializer** - DRF serializer with nested data
7. **CustomerViewSet** - CRUD, search, import actions
8. **Customer Filtering** - Filter by status, type, tags, date
9. **API URL Registration** - Register endpoints
10. **Customer Module Tests** - Unit and integration tests

### Technology Context

| Technology | Purpose |
|------------|---------|
| pandas | CSV processing |
| Celery | Async import tasks |
| Django REST Framework | API serializers/views |
| django-filter | Customer filtering |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-79-83_Import-Export.md` | 79-83 | CSV importer, column mapping, validation, progress, exporter |
| 02 | `02_Tasks-84-88_API-Tests.md` | 84-88 | CustomerSerializer, ViewSet, filtering, URLs, tests |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Customer CSV Importer | High | 35 min |
| 80 | Implement Column Mapping | Medium | 25 min |
| 81 | Implement Import Validation | Medium | 30 min |
| 82 | Implement Import Progress Tracking | Medium | 25 min |
| 83 | Create Customer CSV Exporter | Medium | 25 min |
| 84 | Create CustomerSerializer | Medium | 30 min |
| 85 | Create CustomerViewSet | High | 35 min |
| 86 | Implement Customer Filtering | Medium | 25 min |
| 87 | Register Customer API URLs | Low | 20 min |
| 88 | Create Customer Module Tests | High | 45 min |

---

## Execution Order

```
[Tasks 79-83: CSV import/export services]
         │
         ▼
[Tasks 84-88: API serializers, views, tests]
```

---

## Expected Deliverables

```
apps/customers/
├── serializers/
│   ├── __init__.py
│   ├── customer_serializer.py    # Task 84
│   ├── address_serializer.py
│   ├── phone_serializer.py
│   └── tag_serializer.py
├── views/
│   ├── __init__.py
│   ├── customer_viewset.py       # Task 85
│   ├── import_view.py            # Task 79
│   └── export_view.py            # Task 83
├── services/
│   ├── __init__.py
│   ├── import_service.py         # Tasks 79-82
│   └── export_service.py         # Task 83
├── filters.py                    # Task 86
├── urls.py                       # Task 87
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_search.py
│   ├── test_import.py
│   └── test_api.py               # Task 88
```

---

## Notes for AI Agents

### API Endpoints
```
/api/v1/customers/
├── GET /                         # List customers
├── POST /                        # Create customer
├── GET /{id}/                    # Get customer detail
├── PUT /{id}/                    # Update customer
├── DELETE /{id}/                 # Delete customer
├── GET /{id}/addresses/          # List addresses
├── POST /{id}/addresses/         # Add address
├── GET /{id}/phones/             # List phones
├── POST /{id}/phones/            # Add phone
├── GET /{id}/communications/     # Communication timeline
├── POST /{id}/communications/    # Log communication
├── GET /{id}/history/            # Purchase history
├── GET /{id}/statistics/         # Customer statistics
├── GET /{id}/activity/           # Activity feed
├── POST /{id}/tags/              # Assign tag
├── DELETE /{id}/tags/{tag_id}/   # Remove tag
├── GET /search/                  # Search customers
├── POST /import/                 # Import from CSV
├── GET /export/                  # Export to CSV
├── GET /duplicates/              # List potential duplicates
├── POST /merge/                  # Merge customers
```

### Customer Filtering Options
```
GET /customers/?status=ACTIVE
GET /customers/?customer_type=BUSINESS
GET /customers/?tags=vip,wholesale
GET /customers/?created_from=2026-01-01&created_to=2026-01-31
GET /customers/?has_outstanding=true
GET /customers/?province=Western
```

### CSV Import Column Mapping
| CSV Column | Field | Required |
|------------|-------|----------|
| first_name | first_name | Yes (Individual) |
| last_name | last_name | Yes (Individual) |
| company_name | company_name | Yes (Business) |
| email | email | No |
| phone | primary_phone | No |
| address | address_line_1 | No |
| city | city | No |
| district | district | No |
| province | province | No |

### Import Validation Rules
- Validate email format
- Validate phone format (+94)
- Check for duplicates (based on settings)
- Validate district-province mapping
- Required fields based on customer_type

### Import Progress Response
```json
{
  "import_id": "uuid",
  "status": "PROCESSING",
  "total_rows": 1000,
  "processed_rows": 456,
  "successful": 450,
  "failed": 6,
  "progress_percent": 45.6
}
```

### CSV Export Columns
```
customer_code,first_name,last_name,company_name,email,
primary_phone,customer_type,status,total_purchases,
outstanding_balance,created_at
```

### Test Categories
- Model unit tests (Customer, Address, Phone, Tag)
- Service tests (CRUD, search, merge)
- Import tests (validation, mapping, progress)
- API tests (all endpoints, permissions)
- Search tests (full-text, quick, lookup)
- Integration tests (complete workflows)
