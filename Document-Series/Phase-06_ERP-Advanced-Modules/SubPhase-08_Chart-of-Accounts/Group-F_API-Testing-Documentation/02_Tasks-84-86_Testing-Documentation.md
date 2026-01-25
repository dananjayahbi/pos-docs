# Tasks 84-86: Testing and Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-83_ViewSet-Endpoints-Routes.md](01_Tasks-79-83_ViewSet-Endpoints-Routes.md)
- **→ Next SubPhase:** [SubPhase-09_Journal-Entries](../../SubPhase-09_Journal-Entries/)

---

## Document Overview

This document covers comprehensive testing and documentation for the Chart of Accounts system. It includes unit tests for the Account model validating business logic and MPTT functionality, service tests for COA initialization and balance calculation services, and complete API documentation using OpenAPI/Swagger standards. These components ensure system reliability, maintainability, and provide clear guidance for API consumers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 84 | Write Account model tests | Medium | 60 min |
| 85 | Write COA service tests | Medium | 60 min |
| 86 | Create API documentation | Medium | 45 min |

---

## Task 84: Write Account Model Tests

### Overview
Create comprehensive unit tests for the Account model covering all business logic, validation rules, MPTT tree operations, status transitions, and edge cases. These tests ensure the Account model behaves correctly under various scenarios and maintains data integrity, particularly in hierarchical structures and multi-tenant environments.

### Dependencies
- Account model fully implemented
- MPTT fields configured
- pytest and pytest-django installed
- Factory Boy for test data generation
- Tenant context available in tests

### Instructions

1. **Create test module structure**
   - Navigate to `apps/accounting/tests/` directory
   - Create directory if not exists
   - Create `__init__.py` in tests directory
   - Create `test_models.py` for Account model tests

2. **Set up test configuration**
   - Import pytest and pytest fixtures
   - Import django.test utilities
   - Import Account model
   - Import constants (ACCOUNT_TYPE_CHOICES, etc.)
   - Configure test database settings

3. **Create test fixtures and factories**
   - Create AccountFactory using Factory Boy
   - Define fixture for test tenant
   - Create fixture for root asset account
   - Create fixture for child accounts
   - Create fixture for account hierarchy

4. **Write account creation tests**
   - Test creating account with minimum required fields
   - Test creating account with all fields populated
   - Test auto-generation of MPTT fields
   - Test tenant association
   - Test default status is 'active'
   - Test created_at and updated_at timestamps

5. **Write validation tests**
   - Test code uniqueness within tenant
   - Test code format validation
   - Test name required validation
   - Test type from valid choices
   - Test category from valid choices for type
   - Test invalid type rejection
   - Test invalid category for type rejection
   - Test description length limits

6. **Write hierarchy tests**
   - Test creating root account (no parent)
   - Test creating child account with parent
   - Test parent-child relationship integrity
   - Test preventing circular references
   - Test maximum tree depth enforcement
   - Test moving account to different parent
   - Test moving account with children

7. **Write MPTT method tests**
   - Test get_ancestors() returns correct hierarchy
   - Test get_descendants() includes all children
   - Test get_children() returns immediate children only
   - Test get_siblings() returns accounts at same level
   - Test get_root() returns top-level parent
   - Test is_leaf_node() for accounts without children
   - Test is_root_node() for accounts without parent
   - Test get_level() returns correct depth

8. **Write balance and transaction tests**
   - Test initial balance is zero
   - Test current_balance calculation
   - Test debit/credit nature validation
   - Test allow_transactions flag behavior
   - Test restricting transactions on parent accounts
   - Test balance aggregation from children

9. **Write status transition tests**
   - Test status change from active to inactive
   - Test status change from inactive to active
   - Test status change to archived
   - Test preventing archiving accounts with transactions
   - Test preventing archiving accounts with active children
   - Test cascading status changes

10. **Write edge case and error tests**
    - Test duplicate code in same tenant (should fail)
    - Test same code in different tenants (should succeed)
    - Test deleting account with children (should fail)
    - Test deleting account with transactions (should fail)
    - Test creating account with invalid parent
    - Test maximum code length
    - Test special characters in code/name

11. **Write multi-tenancy tests**
    - Test tenant isolation in queries
    - Test tenant-specific code uniqueness
    - Test cross-tenant parent prevention
    - Test tenant filtering in tree operations

12. **Write query optimization tests**
    - Test select_related reduces queries
    - Test prefetch_related for children
    - Test tree query performance
    - Test bulk operations efficiency

### Test File Structure

```
apps/accounting/tests/
├── __init__.py
├── conftest.py                    # Shared fixtures
├── factories.py                   # Factory Boy factories
├── test_models.py                 # Account model tests
├── test_services.py              # Service tests (Task 85)
└── test_api.py                   # API endpoint tests

test_models.py structure:
├── TestAccountCreation           # Creation tests
├── TestAccountValidation         # Validation tests
├── TestAccountHierarchy          # Tree/hierarchy tests
├── TestAccountMPTTMethods        # MPTT-specific tests
├── TestAccountBalance            # Balance calculation tests
├── TestAccountStatus             # Status transition tests
├── TestAccountEdgeCases          # Edge cases and errors
└── TestAccountMultiTenancy       # Tenant isolation tests
```

### Testing Patterns and Best Practices

```
Test Organization:
├── Arrange: Set up test data and context
├── Act: Execute the method/function being tested
├── Assert: Verify expected outcomes
└── Cleanup: Reset state (handled by pytest)

Naming Convention:
├── test_<method>_<scenario>_<expected_outcome>
├── Example: test_create_account_with_parent_creates_child
├── Example: test_duplicate_code_same_tenant_raises_error
└── Example: test_get_descendants_returns_all_children

Fixture Usage:
├── Use fixtures for common test data
├── Parameterize tests for multiple scenarios
├── Use factories for flexible test object creation
└── Isolate tests from each other
```

### Example Test Scenarios

#### Account Creation Tests
```
Test Cases:
├── Create root account successfully
├── Create child account with valid parent
├── Auto-generate MPTT fields (lft, rght, tree_id, level)
├── Set default status to 'active'
├── Associate with current tenant
├── Populate timestamps (created_at, updated_at)
├── Generate unique code within tenant
└── Handle optional fields gracefully
```

#### Validation Tests
```
Test Cases:
├── Reject account without code
├── Reject account without name
├── Reject account without type
├── Reject duplicate code in same tenant
├── Allow duplicate code in different tenants
├── Reject invalid account type
├── Reject invalid category for type
├── Enforce code format pattern
└── Validate name length constraints
```

#### Hierarchy Tests
```
Test Cases:
├── Create 3-level hierarchy (root → parent → child)
├── Prevent circular reference (account as its own parent)
├── Prevent account from being descendant of itself
├── Move account to new parent updates MPTT fields
├── Move account with children moves entire subtree
├── Delete parent account behavior
├── Orphan children handling
└── Maximum depth enforcement
```

#### MPTT Method Tests
```
Test Cases:
├── get_ancestors() returns [root, parent] for child
├── get_descendants() returns all children and grandchildren
├── get_children() returns only immediate children
├── get_siblings() excludes self, includes same-level accounts
├── get_root() returns top ancestor
├── is_leaf_node() true for accounts without children
├── is_root_node() true for accounts without parent
└── get_level() returns 0 for root, 1 for child, etc.
```

#### Balance Tests
```
Test Cases:
├── New account has zero balance
├── Debit increases asset account balance
├── Credit decreases asset account balance
├── Credit increases liability account balance
├── Debit decreases liability account balance
├── Parent account balance = sum of children balances
├── Allow_transactions=False prevents direct transactions
└── Balance aggregation up the tree
```

#### Status Transition Tests
```
Test Cases:
├── Active → Inactive (allowed)
├── Inactive → Active (allowed)
├── Active → Archived (allowed if no transactions)
├── Cannot archive account with transactions
├── Cannot archive account with active children
├── Inactive parent, active child handling
├── Cascade inactive status to children (optional)
└── Status change triggers audit log
```

#### Multi-Tenancy Tests
```
Test Cases:
├── Query accounts filters by tenant automatically
├── Cannot create account in different tenant
├── Cannot set parent from different tenant
├── Code uniqueness scoped to tenant
├── Tree operations respect tenant boundaries
├── Tenant isolation in get_descendants()
└── Cross-tenant queries blocked
```

### Test Data Setup

```
Minimal Account:
├── code: "1000"
├── name: "Assets"
├── type: "asset"
├── tenant: test_tenant
└── All other fields use defaults

Full Account:
├── code: "1100"
├── name: "Current Assets"
├── type: "asset"
├── category: "current"
├── description: "Assets convertible within 1 year"
├── parent: assets_account
├── status: "active"
├── allow_transactions: True
├── is_active: True
└── tenant: test_tenant

Account Hierarchy:
Assets (1000)
├── Current Assets (1100)
│   ├── Cash (1110)
│   ├── Bank (1120)
│   └── Receivables (1130)
└── Non-Current Assets (1200)
    ├── Fixed Assets (1210)
    └── Investments (1220)
```

### Assertion Examples

```
Standard Assertions:
├── assert account.code == "1000"
├── assert account.name == "Assets"
├── assert account.type == "asset"
├── assert account.tenant == test_tenant
├── assert account.is_root_node()
└── assert account.get_level() == 0

Count Assertions:
├── assert Account.objects.count() == 5
├── assert account.get_children().count() == 2
├── assert account.get_descendants().count() == 6
└── assert account.get_ancestors().count() == 0

Exception Assertions:
├── with pytest.raises(ValidationError):
│       Account.objects.create(...)
├── with pytest.raises(IntegrityError):
│       account.code = duplicate_code
└── assert "error message" in str(exception)

Query Assertions:
├── assert Account.objects.filter(tenant=tenant).count() == 10
├── assert root_accounts.count() == 5
└── assert leaf_accounts.filter(allow_transactions=True).count() == 20
```

### Performance Testing

```
Test Query Counts:
├── Use django.test.utils.override_settings
├── Use assertNumQueries(expected_count)
├── Verify select_related reduces queries
├── Verify prefetch_related optimizes children loading
└── Benchmark tree operations

Example:
with assertNumQueries(1):
    accounts = Account.objects.select_related('parent').all()
    for account in accounts:
        parent_name = account.parent.name if account.parent else None
```

### Test Coverage Goals

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Model creation | 100% | High |
| Validation logic | 100% | High |
| MPTT methods | 100% | High |
| Business rules | 95%+ | High |
| Edge cases | 90%+ | Medium |
| Error handling | 90%+ | Medium |
| Helper methods | 85%+ | Medium |

### Expected Outcome
- Comprehensive test suite for Account model
- All creation, validation, and hierarchy logic tested
- MPTT methods fully covered
- Balance calculations verified
- Status transitions validated
- Multi-tenancy isolation confirmed
- Edge cases and errors handled
- Test coverage above 95% for model

### Verification Checklist
- [ ] `apps/accounting/tests/` directory created
- [ ] `test_models.py` file created
- [ ] pytest and pytest-django installed
- [ ] AccountFactory created with Factory Boy
- [ ] Test fixtures for tenant and accounts
- [ ] Account creation tests written (minimum and full)
- [ ] Validation tests cover all required fields
- [ ] Uniqueness constraint tests (code per tenant)
- [ ] Hierarchy tests for parent-child relationships
- [ ] MPPT method tests (ancestors, descendants, children)
- [ ] Balance calculation tests
- [ ] Status transition tests
- [ ] Edge case tests (circular reference, invalid parent)
- [ ] Multi-tenancy isolation tests
- [ ] All tests pass successfully
- [ ] Test coverage report generated
- [ ] Coverage above 95% for Account model

---

## Task 85: Write COA Service Tests

### Overview
Create comprehensive tests for the COA initialization service and account balance calculation service. These service-level tests verify complex business logic, multi-step processes, transaction handling, error scenarios, and integration between services. Focus on testing the COAInitializer for template-based account creation and AccountBalanceService for balance calculations.

### Dependencies
- Task 84: Write Account model tests
- Task 44: Create COAInitializer service
- Task 47: Create AccountBalanceService
- DefaultChartOfAccounts model with templates
- Test fixtures and factories

### Instructions

1. **Create service test module**
   - Navigate to `apps/accounting/tests/` directory
   - Create `test_services.py` module
   - Add module docstring describing service tests
   - Import all necessary services and models

2. **Set up service test fixtures**
   - Create fixture for COAInitializer instance
   - Create fixture for AccountBalanceService instance
   - Create fixture for default chart template
   - Create fixture for custom chart template
   - Create fixture for tenant with accounts

3. **Write COAInitializer tests - Basic Initialization**
   - Test initialize with default template
   - Test initialize with specific template_id
   - Test initialize with template_name
   - Test account creation count matches template
   - Test all account types created
   - Test hierarchy structure matches template
   - Test MPTT tree integrity after initialization

4. **Write COAInitializer tests - Validation**
   - Test initialization with invalid template_id
   - Test initialization with non-existent template
   - Test initialization for tenant already with accounts
   - Test template validation before initialization
   - Test duplicate code detection
   - Test parent reference validation

5. **Write COAInitializer tests - Template Processing**
   - Test template entry sorting by hierarchy
   - Test parent account created before children
   - Test root accounts created first
   - Test multi-level hierarchy creation
   - Test account code prefix handling
   - Test account attribute copying from template

6. **Write COAInitializer tests - Transaction Handling**
   - Test successful initialization commits transaction
   - Test failed initialization rolls back transaction
   - Test no partial creation on error
   - Test database state unchanged on failure
   - Test atomic operation behavior

7. **Write COAInitializer tests - Edge Cases**
   - Test empty template handling
   - Test template with single account
   - Test template with deep hierarchy (7+ levels)
   - Test template with 500+ accounts
   - Test concurrent initialization attempts
   - Test initialization with existing accounts

8. **Write AccountBalanceService tests - Single Account Balance**
   - Test balance calculation for account without transactions
   - Test balance calculation with debit transactions
   - Test balance calculation with credit transactions
   - Test balance calculation with mixed transactions
   - Test balance for asset account (debit nature)
   - Test balance for liability account (credit nature)
   - Test balance for equity account
   - Test balance for revenue account
   - Test balance for expense account

9. **Write AccountBalanceService tests - Aggregate Balance**
   - Test parent account balance = sum of children
   - Test multi-level aggregation
   - Test balance propagation up the tree
   - Test excluding child balances when needed
   - Test aggregate balance with filters
   - Test date range balance calculation

10. **Write AccountBalanceService tests - Balance Validation**
    - Test debit/credit nature validation
    - Test balance sign correctness by type
    - Test zero balance accounts
    - Test negative balance handling
    - Test balance rounding to 2 decimals
    - Test currency handling in balance

11. **Write integration tests**
    - Test COAInitializer + immediate balance query
    - Test account creation + balance service
    - Test initialization + tree retrieval
    - Test service interactions in workflow

12. **Write performance tests**
    - Test initialization time for 50 accounts
    - Test initialization time for 500 accounts
    - Test balance calculation performance
    - Test aggregate balance query count
    - Test bulk operation efficiency

### Service Test Structure

```
test_services.py structure:
├── TestCOAInitializerBasic          # Basic initialization
├── TestCOAInitializerValidation     # Validation logic
├── TestCOAInitializerTemplate       # Template processing
├── TestCOAInitializerTransaction    # Transaction handling
├── TestCOAInitializerEdgeCases      # Edge cases
├── TestAccountBalanceServiceSingle  # Single account balance
├── TestAccountBalanceServiceAggregate # Aggregate balance
├── TestAccountBalanceServiceValidation # Balance validation
├── TestServiceIntegration           # Integration tests
└── TestServicePerformance           # Performance tests
```

### COAInitializer Test Scenarios

#### Basic Initialization
```
Test Cases:
├── Initialize with default template
│   ├── Verify accounts created
│   ├── Verify types distribution
│   └── Verify tree structure
│
├── Initialize with template_id
│   ├── Load specific template
│   ├── Create accounts from template
│   └── Verify template attributes copied
│
├── Initialize with template_name
│   ├── Lookup template by name
│   ├── Fallback to default if not found
│   └── Verify correct template used
│
└── Verify MPTT tree integrity
    ├── Check lft/rght values
    ├── Check tree_id grouping
    └── Check level calculations
```

#### Validation Tests
```
Test Cases:
├── Invalid template_id → raises ValueError
├── Non-existent template → raises ObjectDoesNotExist
├── Tenant with accounts + overwrite=False → raises Error
├── Tenant with accounts + overwrite=True → archives old, creates new
├── Template with duplicate codes → raises ValidationError
├── Template with invalid parent refs → raises Error
└── Template with circular refs → raises Error
```

#### Transaction Handling
```
Test Cases:
├── Successful initialization:
│   ├── All accounts created
│   ├── Transaction committed
│   └── No rollback occurred
│
├── Failed initialization (error midway):
│   ├── Transaction rolled back
│   ├── No accounts in database
│   ├── Database state unchanged
│   └── Error message clear
│
└── Atomic behavior:
    ├── All or nothing creation
    ├── No partial trees
    └── MPTT consistency maintained
```

### AccountBalanceService Test Scenarios

#### Single Account Balance
```
Test Cases:
├── Account with no transactions → balance = 0.00
│
├── Asset account:
│   ├── Debit $100 → balance = $100.00
│   ├── Credit $30 → balance = $70.00
│   └── Multiple transactions → correct sum
│
├── Liability account:
│   ├── Credit $100 → balance = $100.00
│   ├── Debit $30 → balance = $70.00
│   └── Multiple transactions → correct sum
│
├── Revenue account:
│   ├── Credit $500 → balance = $500.00
│   └── Nature: credit increases
│
└── Expense account:
    ├── Debit $200 → balance = $200.00
    └── Nature: debit increases
```

#### Aggregate Balance Tests
```
Test Cases:
├── Parent with 2 children:
│   ├── Child1 balance: $100
│   ├── Child2 balance: $200
│   └── Parent balance: $300
│
├── 3-level hierarchy:
│   ├── Root → Parent1 → Child1: $50
│   ├── Root → Parent1 → Child2: $30
│   ├── Root → Parent2 → Child3: $20
│   ├── Parent1 balance: $80
│   └── Root balance: $100
│
├── Exclude children parameter:
│   ├── With children: $300
│   └── Without children: $0 (if no direct transactions)
│
└── Date range filtering:
    ├── Balance as of specific date
    ├── Balance for date range
    └── Historical balance comparison
```

#### Balance Calculation Logic
```
Asset/Expense Accounts (Debit Nature):
Balance = Sum(Debits) - Sum(Credits)

Liability/Equity/Revenue (Credit Nature):
Balance = Sum(Credits) - Sum(Debits)

Aggregate Balance:
Parent Balance = Parent Direct Balance + Sum(Children Balances)

Performance Optimization:
├── Use aggregation functions (Sum, Coalesce)
├── Annotate rather than Python loops
├── Cache frequently accessed balances
└── Batch calculate for multiple accounts
```

### Integration Test Scenarios

```
Workflow Tests:
├── Initialize COA → Query tree → Verify structure
├── Initialize COA → Calculate balance → Verify zero
├── Initialize COA → Create transaction → Calculate balance
├── Reinitialize COA (overwrite) → Verify old archived
└── Initialize multiple tenants → Verify isolation

Cross-Service Tests:
├── COAInitializer creates accounts
├── AccountBalanceService queries those accounts
├── Verify service compatibility
└── Verify data flow between services
```

### Performance Benchmarks

| Operation | Account Count | Max Time | Queries |
|-----------|---------------|----------|---------|
| Initialize COA | 50 | 2 sec | ~55 |
| Initialize COA | 100 | 5 sec | ~105 |
| Initialize COA | 500 | 25 sec | ~505 |
| Calculate single balance | 1 | 0.1 sec | 2 |
| Calculate aggregate balance | 10 | 0.3 sec | 5 |
| Calculate all balances | 100 | 2 sec | 10 |

### Mock and Fixture Strategies

```
Mocking:
├── Mock external API calls
├── Mock email notifications
├── Mock Celery tasks
├── Mock file operations
└── Don't mock internal service logic

Fixtures:
├── Use factories for flexible data
├── Create realistic test scenarios
├── Reuse common fixtures
├── Clean up after tests (pytest handles)
└── Parameterize for multiple scenarios

Test Data:
├── Minimal template: 10 accounts
├── Standard template: 50 accounts
├── Full template: 100+ accounts
├── Custom template: specific use case
└── Edge case template: deep hierarchy, many accounts
```

### Expected Outcome
- Comprehensive service tests for COAInitializer
- Complete coverage of initialization scenarios
- Transaction and rollback behavior verified
- AccountBalanceService tests for all account types
- Aggregate balance calculation validated
- Integration between services tested
- Performance benchmarks established
- All service tests passing

### Verification Checklist
- [ ] `test_services.py` file created
- [ ] COAInitializer test class created
- [ ] Test fixtures for initializer and templates
- [ ] Basic initialization tests (default, by ID, by name)
- [ ] Validation tests for invalid scenarios
- [ ] Template processing tests
- [ ] Transaction rollback tests
- [ ] MPTT tree integrity tests after init
- [ ] AccountBalanceService test class created
- [ ] Single account balance tests for all types
- [ ] Aggregate balance tests for hierarchy
- [ ] Balance with date range filtering
- [ ] Integration tests between services
- [ ] Performance tests for large datasets
- [ ] All service tests pass successfully
- [ ] Service test coverage above 90%

---

## Task 86: Create Accounting API Documentation

### Overview
Create comprehensive API documentation for the accounting module using OpenAPI/Swagger standards. This documentation provides clear, detailed information about all endpoints, request/response formats, authentication requirements, error codes, and usage examples. It serves as the definitive reference for frontend developers and API consumers.

### Dependencies
- Task 85: Write COA service tests
- All API endpoints implemented (AccountViewSet)
- drf-spectacular installed and configured
- API endpoints accessible and tested

### Instructions

1. **Install and configure drf-spectacular**
   - Add 'drf_spectacular' to INSTALLED_APPS
   - Configure REST_FRAMEWORK settings for spectacular
   - Set OpenAPI schema generator
   - Configure spectacular settings (title, version, description)

2. **Add schema endpoint URLs**
   - Add schema view to main URLs
   - Configure /api/schema/ endpoint
   - Add /api/docs/ for Swagger UI
   - Add /api/redoc/ for ReDoc UI

3. **Document AccountViewSet**
   - Add docstrings to ViewSet class
   - Document each action method
   - Use @extend_schema decorator for custom actions
   - Specify request/response serializers

4. **Document standard CRUD endpoints**
   - Document list endpoint (GET /accounts/)
   - Document create endpoint (POST /accounts/)
   - Document retrieve endpoint (GET /accounts/{id}/)
   - Document update endpoints (PUT/PATCH /accounts/{id}/)
   - Document destroy endpoint (DELETE /accounts/{id}/)

5. **Document custom action endpoints**
   - Document tree endpoint with @extend_schema
   - Document types endpoint with @extend_schema
   - Document initialize endpoint with @extend_schema
   - Include query parameters
   - Include request/response examples

6. **Document request/response schemas**
   - Define AccountSerializer schema
   - Define TreeResponseSerializer
   - Define TypesResponseSerializer
   - Define InitializeRequestSerializer
   - Define InitializeResponseSerializer
   - Define error response schemas

7. **Document authentication**
   - Specify authentication scheme (JWT/Token)
   - Document authentication header format
   - Provide example authentication requests
   - Document permission requirements per endpoint

8. **Document query parameters and filters**
   - Document filterset_fields usage
   - Document search parameter
   - Document ordering parameter
   - Document pagination parameters
   - Provide filter examples

9. **Document error responses**
   - Document standard HTTP status codes
   - Document error response format
   - Provide examples for common errors
   - Document validation error format
   - Document permission error format

10. **Create usage examples**
    - Provide curl examples for each endpoint
    - Provide JavaScript fetch examples
    - Provide Python requests examples
    - Include authentication in examples
    - Show complete request/response cycles

11. **Write API reference markdown**
    - Create `docs/api/accounting.md` file
    - Document module overview
    - List all endpoints with descriptions
    - Include detailed parameter documentation
    - Add troubleshooting section

12. **Generate and validate OpenAPI schema**
    - Run schema generation command
    - Validate schema with OpenAPI validator
    - Test Swagger UI functionality
    - Test ReDoc UI functionality
    - Ensure all endpoints documented

### API Documentation Structure

```
Documentation Components:
├── OpenAPI Schema (JSON/YAML)
│   ├── Paths (endpoints)
│   ├── Schemas (request/response models)
│   ├── Security schemes
│   └── Tags and descriptions
│
├── Swagger UI
│   ├── Interactive API explorer
│   ├── Try it out functionality
│   ├── Request/response examples
│   └── Authentication integration
│
├── ReDoc UI
│   ├── Clean, readable documentation
│   ├── Three-panel layout
│   ├── Code samples
│   └── Search functionality
│
└── Markdown Documentation
    ├── Overview and introduction
    ├── Authentication guide
    ├── Endpoint reference
    ├── Usage examples
    └── Error handling guide
```

### drf-spectacular Configuration

```
settings.py:
────────────
INSTALLED_APPS = [
    ...
    'rest_framework',
    'drf_spectacular',
    ...
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'POS/ERP API - Accounting Module',
    'DESCRIPTION': 'Chart of Accounts and Journal Entry API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
}

urls.py:
────────
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

### ViewSet Documentation with @extend_schema

```
Example for tree endpoint:
──────────────────────────
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample

class AccountViewSet(ModelViewSet):
    
    @extend_schema(
        summary="Get account tree hierarchy",
        description="Returns all accounts in a hierarchical tree structure",
        parameters=[
            OpenApiParameter(
                name='max_depth',
                type=int,
                description='Maximum depth of tree to return',
                required=False,
            ),
            OpenApiParameter(
                name='type',
                type=str,
                description='Filter by account type',
                required=False,
            ),
        ],
        responses={
            200: TreeResponseSerializer,
            400: ErrorResponseSerializer,
        },
        examples=[
            OpenApiExample(
                'Success Response',
                value={
                    "accounts": [...],
                    "metadata": {...}
                },
                response_only=True,
            ),
        ],
    )
    @action(detail=False, methods=['get'])
    def tree(self, request):
        # Implementation
        pass
```

### Endpoint Documentation Template

```
For each endpoint document:
├── Summary: One-line description
├── Description: Detailed explanation
├── HTTP Method: GET, POST, PUT, DELETE
├── URL Path: /api/v1/accounting/accounts/
├── Authentication: Required/Optional
├── Permissions: List required permissions
├── Query Parameters: Name, type, description, required
├── Request Body: Schema and example
├── Response: Status codes, schema, examples
├── Errors: Possible error responses
└── Examples: curl, JavaScript, Python
```

### API Endpoint Reference

| Endpoint | Method | Summary | Auth | Permission |
|----------|--------|---------|------|------------|
| /accounts/ | GET | List accounts | Required | view_account |
| /accounts/ | POST | Create account | Required | add_account |
| /accounts/{id}/ | GET | Retrieve account | Required | view_account |
| /accounts/{id}/ | PUT | Update account | Required | change_account |
| /accounts/{id}/ | PATCH | Partial update | Required | change_account |
| /accounts/{id}/ | DELETE | Archive account | Required | delete_account |
| /accounts/tree/ | GET | Get tree structure | Required | view_account |
| /accounts/types/ | GET | Get account types | Required | Authenticated |
| /accounts/initialize/ | POST | Initialize COA | Required | add_account + admin |

### Request/Response Examples

#### Create Account Example
```
Request:
POST /api/v1/accounting/accounts/
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "1100",
  "name": "Current Assets",
  "type": "asset",
  "category": "current",
  "description": "Assets convertible to cash within one year",
  "parent": 1,
  "allow_transactions": false,
  "is_active": true
}

Response: 201 Created
{
  "id": 2,
  "code": "1100",
  "name": "Current Assets",
  "type": "asset",
  "category": "current",
  "description": "Assets convertible to cash within one year",
  "parent": 1,
  "level": 1,
  "has_children": false,
  "allow_transactions": false,
  "is_active": true,
  "status": "active",
  "created_at": "2026-01-24T10:00:00Z",
  "updated_at": "2026-01-24T10:00:00Z"
}
```

#### Get Tree Example
```
Request:
GET /api/v1/accounting/accounts/tree/?max_depth=3&status=active
Authorization: Bearer <token>

Response: 200 OK
{
  "accounts": [
    {
      "id": 1,
      "code": "1000",
      "name": "Assets",
      "type": "asset",
      "level": 0,
      "has_children": true,
      "children": [
        {
          "id": 2,
          "code": "1100",
          "name": "Current Assets",
          "type": "asset",
          "level": 1,
          "has_children": true,
          "children": [...]
        }
      ]
    }
  ],
  "metadata": {
    "total_accounts": 50,
    "max_depth": 3,
    "timestamp": "2026-01-24T10:00:00Z"
  }
}
```

#### Initialize COA Example
```
Request:
POST /api/v1/accounting/accounts/initialize/
Authorization: Bearer <token>
Content-Type: application/json

{
  "template_name": "standard",
  "overwrite": false,
  "dry_run": false
}

Response: 200 OK
{
  "status": "success",
  "message": "Chart of accounts initialized successfully",
  "data": {
    "accounts_created": 50,
    "types": {
      "asset": 20,
      "liability": 10,
      "equity": 5,
      "revenue": 8,
      "expense": 7
    }
  },
  "timestamp": "2026-01-24T10:00:00Z"
}
```

### Error Response Documentation

```
Standard Error Format:
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": {
    "field_name": ["Error detail for field"]
  },
  "code": "ERROR_CODE",
  "timestamp": "2026-01-24T10:00:00Z"
}

Common Status Codes:
├── 200 OK: Successful GET request
├── 201 Created: Successful POST request
├── 204 No Content: Successful DELETE request
├── 400 Bad Request: Validation error
├── 401 Unauthorized: Authentication failed
├── 403 Forbidden: Permission denied
├── 404 Not Found: Resource not found
├── 409 Conflict: Duplicate or conflict
└── 500 Internal Server Error: Server error

Validation Error Example:
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "code": ["Account with this code already exists"],
    "type": ["This field is required"],
    "parent": ["Invalid parent account"]
  },
  "code": "VALIDATION_ERROR",
  "timestamp": "2026-01-24T10:00:00Z"
}
```

### Authentication Documentation

```
Authentication Method: JWT Bearer Token

Obtaining Token:
POST /api/auth/token/
{
  "username": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Using Token:
All API requests must include Authorization header:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Token Expiration:
├── Access token: 15 minutes
├── Refresh token: 7 days
└── Refresh endpoint: POST /api/auth/token/refresh/
```

### Markdown Documentation Outline

```
docs/api/accounting.md:
──────────────────────

# Accounting API Documentation

## Overview
- Module description
- Key features
- Base URL

## Authentication
- How to authenticate
- Token management
- Permissions overview

## Endpoints

### Accounts
#### List Accounts
- GET /accounts/
- Parameters, response, examples

#### Create Account
- POST /accounts/
- Request body, validation, examples

#### Get Account Tree
- GET /accounts/tree/
- Parameters, response, examples

[... all endpoints ...]

## Data Models
- Account schema
- Field descriptions
- Validation rules

## Error Handling
- Error format
- Common errors
- Troubleshooting

## Usage Examples
- Complete workflows
- Integration patterns
- Best practices

## Changelog
- Version history
- Breaking changes
```

### Testing Documentation

```
Documentation Tests:
├── Schema generation succeeds
├── Swagger UI loads without errors
├── ReDoc UI displays correctly
├── All endpoints appear in docs
├── Request examples are valid
├── Response examples match actual responses
└── Authentication flow documented correctly

Manual Verification:
├── Open /api/docs/ in browser
├── Verify all endpoints listed
├── Test "Try it out" functionality
├── Check request/response examples
└── Verify authentication works
```

### Expected Outcome
- Complete OpenAPI/Swagger documentation
- Interactive Swagger UI available
- Clean ReDoc documentation
- Markdown API reference guide
- All endpoints documented with examples
- Authentication and permissions documented
- Error responses documented
- Usage examples provided
- Schema validates with OpenAPI specification

### Verification Checklist
- [ ] drf-spectacular installed and configured
- [ ] SPECTACULAR_SETTINGS configured in settings.py
- [ ] Schema endpoint (/api/schema/) accessible
- [ ] Swagger UI (/api/docs/) accessible and functional
- [ ] ReDoc UI (/api/redoc/) accessible and readable
- [ ] AccountViewSet class has docstring
- [ ] All actions have @extend_schema decorators
- [ ] Request/response schemas defined
- [ ] Query parameters documented
- [ ] Authentication documented with examples
- [ ] Error responses documented with examples
- [ ] markdown documentation created (docs/api/accounting.md)
- [ ] Usage examples include curl, JavaScript, Python
- [ ] All CRUD endpoints documented
- [ ] All custom actions documented (tree, types, initialize)
- [ ] OpenAPI schema validates successfully
- [ ] "Try it out" works in Swagger UI

---

## Summary

This document covered comprehensive testing and documentation for the Chart of Accounts system:

**Task 84** created extensive unit tests for the Account model covering creation, validation, hierarchy, MPTT methods, balance calculations, status transitions, and multi-tenancy.

**Task 85** implemented service tests for COAInitializer and AccountBalanceService, testing initialization scenarios, transaction handling, balance calculations, aggregations, and integration workflows.

**Task 86** established complete API documentation using drf-spectacular with OpenAPI/Swagger, including interactive documentation, endpoint references, authentication guides, error handling, and usage examples.

The Chart of Accounts system is now fully tested with high coverage, and comprehensively documented for API consumers. This completes SubPhase-08 (Chart of Accounts). The next SubPhase will cover Journal Entries.

---

**Document Metadata:**
- **Total Tasks:** 3 (84-86)
- **Estimated Time:** 2.75 hours
- **Complexity:** Medium
- **Dependencies:** Account model, services, API endpoints
- **Deliverables:** Model tests, service tests, API documentation, Swagger UI
