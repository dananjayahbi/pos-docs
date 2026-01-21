# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** F of F  
> **Tasks Covered:** 79-86  
> **Group Goal:** Create REST API endpoints, comprehensive tests, and API documentation for Chart of Accounts

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Admin-Serializers](../Group-E_Admin-Serializers/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-09_Journal-Entries](../../SubPhase-09_Journal-Entries/)

---

## Group Overview

This group implements the REST API layer for chart of accounts with ViewSets, specialized endpoints for tree structure and COA initialization, URL routing, and comprehensive testing. Includes unit tests for Account model, service tests for COA initialization and balance calculation, and complete API documentation.

### Key Outcomes

- AccountViewSet with full CRUD operations
- Tree list endpoint (GET /accounts/tree/)
- Account types endpoint (GET /accounts/types/)
- COA initialization endpoint (POST /accounts/initialize/)
- URL routes registered in accounting app
- Unit tests for Account model
- Service tests for COAInitializer and BalanceService
- API endpoint integration tests
- OpenAPI/Swagger documentation

### Technology Context

- **API:** Django REST Framework ViewSets
- **Routing:** DRF DefaultRouter
- **Testing:** pytest with pytest-django
- **Documentation:** drf-spectacular for OpenAPI schema

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-83_ViewSet-Endpoints-Routes.md` | Create AccountViewSet, custom endpoints, URL routing | 79-83 |
| 02 | `02_Tasks-84-86_Testing-Documentation.md` | Model tests, service tests, API documentation | 84-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create AccountViewSet | Medium | Task 78 |
| 80 | Add Tree List Endpoint | Medium | Task 79 |
| 81 | Add Account Types Endpoint | Low | Task 80 |
| 82 | Add Initialize COA Endpoint | Medium | Task 81 |
| 83 | Add Account URL Routes | Low | Task 82 |
| 84 | Write Account Model Tests | Medium | Task 83 |
| 85 | Write COA Service Tests | Medium | Task 84 |
| 86 | Create Accounting API Documentation | Medium | Task 85 |

---

## Execution Order

```
Task 79: Create AccountViewSet
    │
    ▼
Task 80: Add Tree List Endpoint
    │
    ▼
Task 81: Add Account Types Endpoint
    │
    ▼
Task 82: Add Initialize COA Endpoint
    │
    ▼
Task 83: Add URL Routes
    │
    ▼
Task 84: Write Model Tests
    │
    ▼
Task 85: Write Service Tests
    │
    ▼
Task 86: Create API Documentation
```

---

## Expected Deliverables

```
apps/accounting/
├── views/
│   ├── __init__.py
│   └── account.py           # AccountViewSet
├── urls.py                  # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_models.py       # Account model tests
│   ├── test_services.py     # COA and Balance service tests
│   └── test_api.py          # API endpoint tests
└── docs/
    └── api_documentation.md # API reference

docs/api/
└── accounting.md            # Accounting module API docs
```

---

## Notes for AI Agents

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/accounting/accounts/` | List accounts (flat) |
| POST | `/api/v1/accounting/accounts/` | Create account |
| GET | `/api/v1/accounting/accounts/{id}/` | Retrieve account |
| PUT | `/api/v1/accounting/accounts/{id}/` | Update account |
| DELETE | `/api/v1/accounting/accounts/{id}/` | Archive/delete account |
| GET | `/api/v1/accounting/accounts/tree/` | Get full tree hierarchy |
| GET | `/api/v1/accounting/accounts/types/` | Get account types |
| POST | `/api/v1/accounting/accounts/initialize/` | Initialize tenant COA |

### ViewSet Actions
```
AccountViewSet:
├── list()          → Standard list with filters
├── create()        → Create with validation
├── retrieve()      → Single account detail
├── update()        → Update with validation
├── destroy()       → Archive/delete logic
├── @action tree()  → Hierarchical tree response
├── @action types() → Account type configurations
└── @action initialize() → Initialize COA for tenant
```

### Query Parameters
- `type`: Filter by account type (asset, liability, etc.)
- `category`: Filter by category (current, non_current, etc.)
- `status`: Filter by status (active, inactive, archived)
- `is_header`: Filter header accounts only
- `parent`: Filter by parent account ID

### Test Coverage Requirements
Model Tests:
- Account creation with valid/invalid codes
- MPTT hierarchy operations
- Balance calculation accuracy
- Code uniqueness constraint

Service Tests:
- COA initialization from template
- COA initialization with defaults
- Balance recalculation
- Validator enforcement

API Tests:
- CRUD operations
- Tree endpoint response structure
- Initialize endpoint for new tenant
- Permission checks

### Documentation Content
- Endpoint reference with request/response examples
- Filter and query parameter documentation
- Error response formats
- Integration examples for frontend
