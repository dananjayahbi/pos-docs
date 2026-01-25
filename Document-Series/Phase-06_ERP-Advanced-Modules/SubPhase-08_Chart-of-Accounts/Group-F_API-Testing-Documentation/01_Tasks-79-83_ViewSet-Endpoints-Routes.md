# Tasks 79-83: ViewSet, Endpoints, and Routes

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-E_Admin-Serializers/02_Tasks-75-78_Full-Tree-Accounts.md](../Group-E_Admin-Serializers/02_Tasks-75-78_Full-Tree-Accounts.md)
- **→ Next Document:** [02_Tasks-84-86_Testing-Documentation.md](02_Tasks-84-86_Testing-Documentation.md)

---

## Document Overview

This document covers the implementation of the REST API layer for the Chart of Accounts system. It includes creating the AccountViewSet with standard CRUD operations, specialized endpoints for tree structure retrieval, account type listing, and COA initialization, plus URL routing configuration. These components provide a complete REST API interface for managing chart of accounts in a multi-tenant environment.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create AccountViewSet | Medium | 45 min |
| 80 | Add tree list endpoint | Medium | 30 min |
| 81 | Add account types endpoint | Low | 20 min |
| 82 | Add initialize COA endpoint | Medium | 40 min |
| 83 | Create URL routes | Low | 15 min |

---

## Task 79: Create AccountViewSet

### Overview
Create the main AccountViewSet using Django REST Framework's ModelViewSet to provide full CRUD operations for Account management. This ViewSet handles listing, creating, retrieving, updating, and archiving accounts with proper filtering, pagination, and permission controls. It serves as the primary API endpoint for account management.

### Dependencies
- Task 78: Create AccountSerializer (from Group E)
- Account model with MPTT fields
- Django REST Framework installed
- Permission classes configured
- django-filter installed for queryset filtering

### Instructions

1. **Create views directory structure**
   - Navigate to `apps/accounting/` directory
   - Create `views/` directory if not exists
   - Create `__init__.py` in views directory
   - Create `account.py` module for AccountViewSet

2. **Import required dependencies**
   - Import ModelViewSet from rest_framework.viewsets
   - Import action decorator from rest_framework.decorators
   - Import Response from rest_framework.response
   - Import status from rest_framework
   - Import DjangoFilterBackend, SearchFilter, OrderingFilter from django_filters and rest_framework.filters
   - Import Account model
   - Import AccountSerializer
   - Import permission classes (IsAuthenticated, DjangoModelPermissions)

3. **Define AccountViewSet class**
   - Inherit from ModelViewSet
   - Set queryset to Account.objects.all() with select_related for optimization
   - Set serializer_class to AccountSerializer
   - Configure permission_classes for authentication and authorization
   - Set filter_backends with DjangoFilterBackend, SearchFilter, OrderingFilter

4. **Configure filterset_fields**
   - Add 'type' field for exact filtering by account type
   - Add 'category' field for filtering by category
   - Add 'status' field for filtering by status
   - Add 'parent' field for filtering by parent account
   - Add 'is_active' boolean filter
   - Add 'allow_transactions' boolean filter

5. **Configure search_fields**
   - Add 'code' for searching by account code
   - Add 'name' for searching by account name
   - Add 'description' for searching in descriptions
   - Use case-insensitive search with icontains

6. **Configure ordering_fields**
   - Add 'code' for ordering by account code
   - Add 'name' for ordering by account name
   - Add 'type' for ordering by account type
   - Add 'created_at' for date-based ordering
   - Set default ordering to ['code'] or hierarchical order

7. **Override get_queryset method**
   - Call super().get_queryset() to get base queryset
   - Apply tenant filtering automatically
   - Use select_related('parent') for query optimization
   - Use prefetch_related('children') if needed
   - Consider using get_descendants() for hierarchical queries
   - Return optimized queryset

8. **Override perform_create method**
   - Extract data from serializer
   - Validate parent-child relationships
   - Check if code is unique within tenant
   - Validate account type constraints
   - Save with current tenant context
   - Trigger post-creation signals if needed

9. **Override perform_update method**
   - Validate status transitions
   - Check if account has transactions (restrict certain updates)
   - Validate hierarchy changes don't create cycles
   - Ensure MPTT tree integrity maintained
   - Update modified timestamp
   - Save changes with audit trail

10. **Override perform_destroy method**
    - Check if account can be deleted
    - Verify no child accounts exist
    - Verify no transactions reference account
    - Archive instead of delete if has historical data
    - Set status to 'archived' rather than hard delete
    - Maintain data integrity

### ViewSet Architecture

```
AccountViewSet (ModelViewSet)
├── Standard Actions:
│   ├── list()           → GET /accounts/
│   ├── create()         → POST /accounts/
│   ├── retrieve()       → GET /accounts/{id}/
│   ├── update()         → PUT /accounts/{id}/
│   ├── partial_update() → PATCH /accounts/{id}/
│   └── destroy()        → DELETE /accounts/{id}/
├── Custom Actions:
│   ├── tree()           → Task 80
│   ├── types()          → Task 81
│   └── initialize()     → Task 82
└── Overridden Methods:
    ├── get_queryset()
    ├── perform_create()
    ├── perform_update()
    └── perform_destroy()
```

### Filtering Capabilities

| Filter Type | Parameter | Description | Example |
|-------------|-----------|-------------|---------|
| Exact | type | Filter by account type | ?type=asset |
| Exact | category | Filter by category | ?category=current |
| Exact | status | Filter by status | ?status=active |
| Exact | parent | Filter by parent ID | ?parent=123 |
| Boolean | is_active | Active accounts only | ?is_active=true |
| Boolean | allow_transactions | Transactional accounts | ?allow_transactions=true |
| Search | search | Search code, name, desc | ?search=cash |
| Ordering | ordering | Sort results | ?ordering=code,-created_at |

### Queryset Optimization Strategy

```
Base Queryset Optimization:
├── select_related('parent')      → Reduce parent queries
├── prefetch_related('children')  → Reduce children queries
├── annotate(balance=...)         → Add balance calculations
├── filter(tenant=current_tenant) → Tenant isolation
└── order_by('tree_id', 'lft')   → Hierarchical ordering

Performance Considerations:
├── Use pagination (default: 50 items/page)
├── Limit depth for tree queries
├── Cache account types and categories
├── Index on code, type, status fields
└── Avoid N+1 queries with select_related
```

### Permission Strategy

| Action | Permission Required | Check |
|--------|-------------------|-------|
| list | view_account | Can view accounts |
| retrieve | view_account | Can view single account |
| create | add_account | Can create accounts |
| update | change_account | Can modify accounts |
| destroy | delete_account | Can archive accounts |

### Expected Outcome
- Fully functional AccountViewSet with CRUD operations
- Efficient queryset with optimized database queries
- Proper filtering, searching, and ordering
- Tenant-aware data isolation
- Permission-based access control
- Safe archiving instead of hard deletes
- Foundation for custom endpoints

### Verification Checklist
- [ ] `apps/accounting/views/` directory created
- [ ] `views/__init__.py` file exists
- [ ] `views/account.py` file created with AccountViewSet
- [ ] ModelViewSet inheritance configured
- [ ] queryset with Account.objects.all()
- [ ] serializer_class set to AccountSerializer
- [ ] permission_classes configured
- [ ] filterset_fields includes type, category, status, parent
- [ ] search_fields includes code, name, description
- [ ] ordering_fields configured with default ordering
- [ ] get_queryset() method optimized with select_related
- [ ] perform_create() validates and saves with tenant
- [ ] perform_update() validates changes
- [ ] perform_destroy() archives instead of deleting

---

## Task 80: Add Tree List Endpoint

### Overview
Implement a custom action endpoint that returns accounts in a hierarchical tree structure. This specialized endpoint provides the full chart of accounts as a nested tree, making it easy to display account hierarchies in UI components like tree views, dropdowns with indentation, or organizational charts.

### Dependencies
- Task 79: Create AccountViewSet
- Account model with MPTT fields (lft, rght, tree_id, level)
- AccountSerializer with tree support

### Instructions

1. **Create tree action method**
   - Add @action decorator to method
   - Set detail=False (collection endpoint)
   - Set methods=['get']
   - Set url_path='tree'
   - Set url_name='tree-list'

2. **Configure action permissions**
   - Use permission_classes within @action decorator
   - Require 'view_account' permission
   - Ensure tenant isolation

3. **Implement tree retrieval logic**
   - Get root accounts (accounts with no parent)
   - Use Account.objects.root_nodes() if available
   - Order by code or custom sort field
   - Apply tenant filtering

4. **Build hierarchical response structure**
   - For each root account, get descendants
   - Use get_descendants(include_self=True)
   - Maintain tree order with MPTT ordering
   - Include depth/level information

5. **Add query parameter support**
   - Accept 'max_depth' parameter to limit tree depth
   - Accept 'type' parameter to filter by account type
   - Accept 'status' parameter to filter by status
   - Accept 'include_inactive' boolean parameter

6. **Serialize tree data**
   - Create recursive serialization
   - Include parent-child relationships
   - Add 'children' field to each account
   - Include account hierarchy metadata

7. **Optimize tree query performance**
   - Use select_related for parent references
   - Use prefetch_related for children
   - Limit depth to prevent deep recursion
   - Cache frequently accessed trees

8. **Add response metadata**
   - Include total account count
   - Include max depth of tree
   - Include account type breakdown
   - Add timestamp of data generation

### Tree Endpoint Details

```
Endpoint: GET /api/v1/accounting/accounts/tree/
Method: GET
Authentication: Required
Permission: view_account

Query Parameters:
├── max_depth (int)         → Limit tree depth (default: unlimited)
├── type (string)           → Filter by account type
├── status (string)         → Filter by status (default: active)
├── include_inactive (bool) → Include inactive accounts
└── format (string)         → Response format (tree, flat)

Response Structure:
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
    "max_depth": 4,
    "account_types": {...},
    "timestamp": "2026-01-24T10:00:00Z"
  }
}
```

### Tree Traversal Algorithm

```
Tree Building Process:
1. Query root accounts (parent IS NULL)
   ├── Filter by tenant
   ├── Apply status filter
   └── Order by code

2. For each root account:
   ├── Serialize account data
   ├── Get children using MPTT methods
   ├── Recursively process children
   └── Add to tree structure

3. Apply depth limiting:
   ├── Track current depth
   ├── Stop recursion at max_depth
   └── Mark truncated branches

4. Return complete tree structure
```

### Tree Response Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| tree | Nested hierarchical structure | Tree UI components |
| flat | Flat list with level indicators | Indented dropdowns |
| paths | Account with full path | Breadcrumb navigation |

### Performance Optimization

```
Query Optimization:
├── Use MPTT tree_id for grouping
├── Single query with get_descendants()
├── Prefetch children relationships
├── Cache tree structure per tenant
└── Set reasonable depth limits

Caching Strategy:
├── Cache key: tenant_id + tree_version
├── Invalidate on account changes
├── TTL: 1 hour (configurable)
├── Warm cache on tenant login
└── Background refresh for large trees
```

### Tree Depth Guidelines

| Max Depth | Account Count | Performance | Use Case |
|-----------|---------------|-------------|----------|
| 2-3 | < 100 | Excellent | Small business |
| 4-5 | 100-500 | Good | Medium business |
| 6-7 | 500-1000 | Moderate | Large business |
| 8+ | 1000+ | Consider pagination | Enterprise |

### Expected Outcome
- Custom tree endpoint returning hierarchical structure
- Efficient querying with MPTT methods
- Configurable depth limiting
- Multiple response format support
- Cached for performance
- Metadata for UI rendering
- Tenant-isolated tree data

### Verification Checklist
- [ ] @action decorator configured with detail=False
- [ ] methods=['get'] specified
- [ ] url_path='tree' set
- [ ] Permission check for view_account
- [ ] Root accounts query implemented
- [ ] Hierarchical structure built with children
- [ ] max_depth parameter support added
- [ ] type and status filtering implemented
- [ ] Response includes metadata
- [ ] MPTT get_descendants() used for efficiency
- [ ] select_related and prefetch_related optimizations
- [ ] Tree structure properly nested
- [ ] Level information included in response

---

## Task 81: Add Account Types Endpoint

### Overview
Create a simple endpoint that returns all available account types with their configurations and metadata. This endpoint provides frontend applications with the information needed to populate dropdowns, validate input, and display account type-specific options. It includes account type definitions, categories, and validation rules.

### Dependencies
- Task 80: Add tree list endpoint
- ACCOUNT_TYPE_CHOICES defined in constants
- ACCOUNT_CATEGORIES mapping configured

### Instructions

1. **Create types action method**
   - Add @action decorator to AccountViewSet
   - Set detail=False (collection endpoint)
   - Set methods=['get']
   - Set url_path='types'
   - Set url_name='account-types'

2. **Configure action permissions**
   - Use permission_classes in decorator
   - Require IsAuthenticated permission
   - No model-level permission needed (reference data)

3. **Gather account type data**
   - Import ACCOUNT_TYPE_CHOICES from constants
   - Import ACCOUNT_CATEGORIES from constants
   - Import ACCOUNT_TYPE_CONFIGS if exists
   - Collect metadata for each type

4. **Build types response structure**
   - Create list of account type objects
   - Include type value and display name
   - Include valid categories for each type
   - Include nature (debit/credit)
   - Include usage description

5. **Add configuration metadata**
   - Include can_have_children flag
   - Include allow_transactions flag
   - Include requires_category flag
   - Include default_status value
   - Include validation rules

6. **Include statistical data**
   - Count active accounts per type
   - Include last used timestamp
   - Show most common categories per type
   - Display usage percentage

7. **Add filtering capability**
   - Support 'include_stats' parameter
   - Support 'active_only' parameter
   - Support 'transactional_only' parameter

8. **Format response for frontend consumption**
   - Structure for dropdown compatibility
   - Include display labels
   - Add tooltips/descriptions
   - Include validation constraints

### Account Types Endpoint Details

```
Endpoint: GET /api/v1/accounting/accounts/types/
Method: GET
Authentication: Required
Permission: IsAuthenticated

Query Parameters:
├── include_stats (bool)     → Include usage statistics
├── active_only (bool)       → Only types with active accounts
└── transactional_only (bool) → Only transactional types

Response Structure:
{
  "account_types": [
    {
      "value": "asset",
      "label": "Asset",
      "nature": "debit",
      "categories": [
        {
          "value": "current",
          "label": "Current Assets",
          "description": "Assets convertible within 1 year"
        },
        {
          "value": "non_current",
          "label": "Non-Current Assets",
          "description": "Long-term assets"
        }
      ],
      "configuration": {
        "can_have_children": true,
        "allow_transactions": true,
        "requires_category": true,
        "default_status": "active"
      },
      "validation": {
        "code_prefix": "1",
        "max_depth": 5,
        "required_fields": ["code", "name", "type", "category"]
      },
      "statistics": {
        "count": 25,
        "percentage": 50.0,
        "last_used": "2026-01-24T10:00:00Z"
      }
    }
  ],
  "metadata": {
    "total_types": 5,
    "total_categories": 12,
    "timestamp": "2026-01-24T10:00:00Z"
  }
}
```

### Account Type Definitions

| Type | Nature | Categories | Can Have Children | Allow Transactions |
|------|--------|------------|-------------------|-------------------|
| Asset | Debit | Current, Non-Current | Yes | Yes |
| Liability | Credit | Current, Non-Current | Yes | Yes |
| Equity | Credit | Capital, Retained Earnings | Yes | Yes |
| Revenue | Credit | Operating, Non-Operating | Yes | Yes |
| Expense | Debit | Operating, Non-Operating | Yes | Yes |

### Category Mappings

```
Asset Categories:
├── current           → Cash, receivables, inventory
├── non_current       → Fixed assets, investments
└── other             → Miscellaneous assets

Liability Categories:
├── current           → Payables, short-term debt
├── non_current       → Long-term debt, bonds
└── other             → Deferred revenue, provisions

Equity Categories:
├── capital           → Owner's capital, common stock
├── retained_earnings → Accumulated profits
└── other             → Treasury stock, AOCI

Revenue Categories:
├── operating         → Sales, service revenue
├── non_operating     → Interest income, gains
└── other             → Miscellaneous income

Expense Categories:
├── operating         → COGS, salaries, rent
├── non_operating     → Interest expense, losses
└── other             → Miscellaneous expenses
```

### Validation Rules by Type

```
Asset Accounts:
├── Code must start with '1'
├── Debit increases balance
├── Credit decreases balance
├── Can be parent or child
└── Must have category

Liability Accounts:
├── Code must start with '2'
├── Credit increases balance
├── Debit decreases balance
├── Can be parent or child
└── Must have category

Equity Accounts:
├── Code must start with '3'
├── Credit increases balance
├── Debit decreases balance
├── Can be parent or child
└── Must have category

Revenue Accounts:
├── Code must start with '4'
├── Credit increases balance
├── Debit decreases balance
├── Usually leaf accounts
└── Must have category

Expense Accounts:
├── Code must start with '5'
├── Debit increases balance
├── Credit decreases balance
├── Usually leaf accounts
└── Must have category
```

### Frontend Integration

```
Use Cases:
├── Account creation form
│   ├── Type dropdown population
│   ├── Category dropdown (filtered by type)
│   ├── Validation rule display
│   └── Code prefix suggestion

├── Account filtering
│   ├── Filter by type dropdown
│   ├── Multi-select type filter
│   └── Category filter (cascading)

├── Reporting
│   ├── Group accounts by type
│   ├── Type-specific calculations
│   └── Balance sheet categorization

└── Validation
    ├── Code format validation
    ├── Category requirement check
    └── Transaction permission check
```

### Expected Outcome
- Endpoint returning all account type definitions
- Complete configuration for each type
- Category mappings per type
- Validation rules included
- Optional usage statistics
- Frontend-ready response format
- Consistent with Account model constraints

### Verification Checklist
- [ ] @action decorator configured
- [ ] methods=['get'] specified
- [ ] url_path='types' set
- [ ] Permission set to IsAuthenticated
- [ ] ACCOUNT_TYPE_CHOICES imported and used
- [ ] ACCOUNT_CATEGORIES mapping included
- [ ] Response includes all five types
- [ ] Each type has nature (debit/credit)
- [ ] Categories listed per type
- [ ] Configuration flags included
- [ ] Validation rules documented
- [ ] Statistics included if requested
- [ ] Response format matches schema

---

## Task 82: Add Initialize COA Endpoint

### Overview
Create a POST endpoint that initializes a tenant's chart of accounts from a predefined template. This endpoint handles the complex process of creating a complete account hierarchy for a new tenant, including all standard accounts, categories, and relationships. It's typically called once during tenant onboarding but can be used to reset or reinitialize the chart of accounts.

### Dependencies
- Task 81: Add account types endpoint
- Task 44: Create COAInitializer service (from Group C)
- DefaultChartOfAccounts model with templates
- Account model with MPTT
- Tenant context available

### Instructions

1. **Create initialize action method**
   - Add @action decorator to AccountViewSet
   - Set detail=False (collection endpoint)
   - Set methods=['post']
   - Set url_path='initialize'
   - Set url_name='initialize-coa'

2. **Configure action permissions**
   - Use permission_classes in decorator
   - Require 'add_account' permission
   - Consider requiring superuser or admin role
   - Ensure tenant-specific authorization

3. **Define request parameters**
   - Accept 'template_id' in request body (optional)
   - Accept 'template_name' as alternative (e.g., 'standard', 'basic', 'full')
   - Accept 'overwrite' boolean flag
   - Accept 'dry_run' boolean for preview
   - Accept 'include_inactive' boolean

4. **Validate initialization request**
   - Check if tenant already has accounts
   - Validate template_id exists
   - Check overwrite flag if accounts exist
   - Verify user has permission to initialize
   - Validate tenant state allows initialization

5. **Handle existing accounts scenario**
   - If accounts exist and overwrite=False, return error
   - If accounts exist and overwrite=True, proceed with caution
   - Option to archive existing accounts
   - Option to merge with existing structure
   - Warn about potential data loss

6. **Execute initialization process**
   - Import COAInitializer service
   - Pass tenant context to initializer
   - Pass template_id or default template
   - Call initialize_chart_of_accounts() method
   - Handle initialization in transaction

7. **Implement dry run mode**
   - If dry_run=True, don't commit changes
   - Return preview of accounts to be created
   - Show account count per type
   - Display sample account structure
   - Estimate completion time

8. **Handle initialization errors**
   - Catch validation errors
   - Catch database errors
   - Catch MPTT tree errors
   - Rollback transaction on failure
   - Return detailed error message

9. **Build response with results**
   - Return success status
   - Include count of accounts created
   - List created account types
   - Include initialization timestamp
   - Provide access to created accounts

10. **Log initialization activity**
    - Log user who initiated
    - Log template used
    - Log tenant context
    - Log success/failure status
    - Create audit trail entry

### Initialize Endpoint Details

```
Endpoint: POST /api/v1/accounting/accounts/initialize/
Method: POST
Authentication: Required
Permission: add_account + admin role

Request Body:
{
  "template_id": 1,                    // Optional: Specific template
  "template_name": "standard",         // Or: Template by name
  "overwrite": false,                  // Overwrite existing accounts
  "dry_run": false,                    // Preview without committing
  "include_inactive": false            // Include inactive accounts
}

Response (Success):
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
    },
    "template": {
      "id": 1,
      "name": "Standard Chart of Accounts",
      "description": "Basic chart for small business"
    },
    "tree_structure": {
      "max_depth": 4,
      "root_accounts": 5
    }
  },
  "timestamp": "2026-01-24T10:00:00Z"
}

Response (Dry Run):
{
  "status": "preview",
  "message": "Preview of initialization",
  "data": {
    "accounts_to_create": 50,
    "types": {...},
    "sample_accounts": [
      {"code": "1000", "name": "Assets", "level": 0},
      {"code": "1100", "name": "Current Assets", "level": 1}
    ],
    "estimated_time": "2 seconds"
  }
}

Response (Error - Accounts Exist):
{
  "status": "error",
  "message": "Chart of accounts already exists for this tenant",
  "data": {
    "existing_accounts": 45,
    "suggestion": "Use overwrite=true to reinitialize"
  }
}
```

### Initialization Workflow

```
Initialization Process:
1. Validate Request
   ├── Check template exists
   ├── Verify tenant context
   ├── Check user permissions
   └── Validate parameters

2. Check Existing Accounts
   ├── Query account count for tenant
   ├── If count > 0 and overwrite=False → Error
   ├── If count > 0 and overwrite=True → Proceed with warning
   └── If count = 0 → Proceed

3. Prepare Template
   ├── Load DefaultChartOfAccounts template
   ├── Get all template entries
   ├── Sort by hierarchical order
   └── Validate template integrity

4. Begin Transaction
   ├── Start database transaction
   ├── If overwrite, archive existing accounts
   ├── Create accounts from template
   └── Build MPTT tree structure

5. Create Accounts
   ├── Loop through template entries
   ├── Create Account objects with tenant
   ├── Set parent relationships
   ├── Rebuild MPTT tree if needed
   └── Validate account codes

6. Verify Integrity
   ├── Check all accounts created
   ├── Verify MPTT tree is valid
   ├── Ensure no duplicate codes
   └── Validate parent-child relationships

7. Commit or Rollback
   ├── If dry_run → Rollback, return preview
   ├── If success → Commit transaction
   └── If error → Rollback, return error

8. Post-Initialization
   ├── Create audit log entry
   ├── Invalidate account cache
   ├── Send notification if configured
   └── Return success response
```

### Template Selection Logic

| Parameter | Priority | Selection Logic |
|-----------|----------|-----------------|
| template_id | 1 | Use specific template by ID |
| template_name | 2 | Lookup template by name |
| None | 3 | Use default template for tenant country |

### Safety Checks

```
Pre-Initialization Checks:
├── Tenant has no transactions
├── User has admin privileges
├── Template is valid and complete
├── No pending migrations
└── Database connection stable

Overwrite Safeguards:
├── Require explicit overwrite=true flag
├── Archive existing accounts (don't delete)
├── Create backup before overwrite
├── Log all overwrite operations
└── Notify administrators

Rollback Conditions:
├── Template validation fails
├── Account creation error
├── MPTT tree corruption
├── Duplicate code conflict
└── Any unhandled exception
```

### Performance Considerations

```
Optimization Strategies:
├── Bulk create accounts (batch insert)
├── Defer MPTT tree rebuild until end
├── Use single transaction for atomicity
├── Disable signals during bulk creation
└── Cache template data

Expected Performance:
├── 50 accounts: < 2 seconds
├── 100 accounts: < 5 seconds
├── 200 accounts: < 10 seconds
├── 500+ accounts: Consider background job

Background Job Triggers:
├── Account count > 500
├── Complex tree structure (depth > 6)
├── Multiple initializations queued
└── Peak usage time
```

### Use Cases

| Scenario | Parameters | Outcome |
|----------|------------|---------|
| New tenant onboarding | template_name='standard' | Create full COA |
| Reset chart | overwrite=true, template_id=1 | Archive old, create new |
| Preview template | dry_run=true, template_id=2 | Show preview without commit |
| Custom initialization | template_id=custom_template | Use organization-specific COA |

### Expected Outcome
- POST endpoint for COA initialization
- Template-based account creation
- Dry run preview capability
- Overwrite protection with explicit flag
- Transaction-safe initialization
- Detailed success/error responses
- Audit logging of initialization
- Background job support for large templates

### Verification Checklist
- [ ] @action decorator configured with detail=False
- [ ] methods=['post'] specified
- [ ] url_path='initialize' set
- [ ] Permission check for add_account
- [ ] Request accepts template_id parameter
- [ ] Request accepts template_name parameter
- [ ] Request accepts overwrite boolean flag
- [ ] Request accepts dry_run boolean flag
- [ ] Validation checks if accounts already exist
- [ ] COAInitializer service imported and used
- [ ] Initialization wrapped in transaction
- [ ] Dry run mode returns preview without commit
- [ ] Overwrite mode handles existing accounts
- [ ] Success response includes counts by type
- [ ] Error handling with rollback
- [ ] Audit logging implemented

---

## Task 83: Create Account URL Routes

### Overview
Configure URL routing for the accounting module by registering the AccountViewSet with Django REST Framework's DefaultRouter. This task creates all necessary URL patterns for account endpoints, including both standard CRUD operations and custom actions, making the Account API accessible through RESTful URLs.

### Dependencies
- Task 82: Add initialize COA endpoint
- AccountViewSet fully implemented
- Django REST Framework router installed
- Main URL configuration exists

### Instructions

1. **Create accounting app urls.py**
   - Navigate to `apps/accounting/` directory
   - Create `urls.py` file if not exists
   - Add module docstring explaining URL configuration

2. **Import required modules**
   - Import DefaultRouter from rest_framework.routers
   - Import include from django.urls
   - Import path from django.urls
   - Import AccountViewSet from views.account

3. **Initialize DefaultRouter**
   - Create router instance: router = DefaultRouter()
   - Configure trailing_slash behavior if needed
   - Set router app_name if using namespaces

4. **Register AccountViewSet**
   - Register with router.register()
   - Set route prefix to 'accounts'
   - Set basename to 'account'
   - ViewSet parameter to AccountViewSet

5. **Define urlpatterns list**
   - Include router.urls in urlpatterns
   - Add app_name for namespace (e.g., 'accounting')
   - Keep structure extensible for additional endpoints

6. **Configure URL namespacing**
   - Set app_name = 'accounting' for reverse() lookups
   - Document URL namespace usage
   - Provide examples of URL reversing

7. **Update main project urls.py**
   - Open main `config/urls.py` or project-level urls
   - Add include for accounting URLs
   - Set path prefix (e.g., 'api/v1/accounting/')
   - Ensure API versioning in URL structure

8. **Document generated URL patterns**
   - List all automatically generated URLs
   - Document custom action URLs
   - Provide curl examples for testing
   - Include URL reversal examples

### URL Configuration Structure

```
apps/accounting/urls.py:
───────────────────────────────
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views.account import AccountViewSet

# Initialize router
router = DefaultRouter()

# Register viewsets
router.register(r'accounts', AccountViewSet, basename='account')

# URL patterns
app_name = 'accounting'

urlpatterns = [
    path('', include(router.urls)),
    # Additional non-viewset URLs can be added here
]
```

### Main URLs Integration

```
config/urls.py (or main urls.py):
───────────────────────────────
from django.urls import path, include

urlpatterns = [
    # ... other URL patterns ...
    
    path('api/v1/accounting/', include('apps.accounting.urls')),
    
    # ... more URL patterns ...
]
```

### Generated URL Patterns

| URL Pattern | HTTP Method | ViewSet Action | Name |
|-------------|-------------|----------------|------|
| `/api/v1/accounting/accounts/` | GET | list | account-list |
| `/api/v1/accounting/accounts/` | POST | create | account-list |
| `/api/v1/accounting/accounts/{id}/` | GET | retrieve | account-detail |
| `/api/v1/accounting/accounts/{id}/` | PUT | update | account-detail |
| `/api/v1/accounting/accounts/{id}/` | PATCH | partial_update | account-detail |
| `/api/v1/accounting/accounts/{id}/` | DELETE | destroy | account-detail |
| `/api/v1/accounting/accounts/tree/` | GET | tree | account-tree-list |
| `/api/v1/accounting/accounts/types/` | GET | types | account-account-types |
| `/api/v1/accounting/accounts/initialize/` | POST | initialize | account-initialize-coa |

### URL Naming Convention

```
URL Name Pattern:
<basename>-<action>

Standard Actions:
├── account-list           → List/Create
├── account-detail         → Retrieve/Update/Delete
└── account-<custom>       → Custom actions

Custom Action Examples:
├── account-tree-list
├── account-account-types
└── account-initialize-coa
```

### URL Reversal Examples

```
In Views/Serializers:
───────────────────────
from django.urls import reverse

# List URL
list_url = reverse('accounting:account-list')
# Result: /api/v1/accounting/accounts/

# Detail URL
detail_url = reverse('accounting:account-detail', kwargs={'pk': 123})
# Result: /api/v1/accounting/accounts/123/

# Custom action URL
tree_url = reverse('accounting:account-tree-list')
# Result: /api/v1/accounting/accounts/tree/

# Initialize URL
init_url = reverse('accounting:account-initialize-coa')
# Result: /api/v1/accounting/accounts/initialize/
```

### Testing URL Configuration

```
Management Command Test:
───────────────────────
python manage.py show_urls | grep accounting

Expected Output:
/api/v1/accounting/accounts/                     GET,POST    account-list
/api/v1/accounting/accounts/<id>/               GET,PUT,PATCH,DELETE account-detail
/api/v1/accounting/accounts/tree/               GET         account-tree-list
/api/v1/accounting/accounts/types/              GET         account-account-types
/api/v1/accounting/accounts/initialize/         POST        account-initialize-coa
```

### Curl Testing Examples

```
# List accounts
curl -X GET http://localhost:8000/api/v1/accounting/accounts/ \
  -H "Authorization: Bearer <token>"

# Create account
curl -X POST http://localhost:8000/api/v1/accounting/accounts/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"code": "1000", "name": "Assets", "type": "asset"}'

# Get account detail
curl -X GET http://localhost:8000/api/v1/accounting/accounts/1/ \
  -H "Authorization: Bearer <token>"

# Get account tree
curl -X GET http://localhost:8000/api/v1/accounting/accounts/tree/ \
  -H "Authorization: Bearer <token>"

# Get account types
curl -X GET http://localhost:8000/api/v1/accounting/accounts/types/ \
  -H "Authorization: Bearer <token>"

# Initialize COA
curl -X POST http://localhost:8000/api/v1/accounting/accounts/initialize/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"template_name": "standard"}'
```

### Router Configuration Options

| Option | Default | Purpose |
|--------|---------|---------|
| trailing_slash | True | Add / at end of URLs |
| include_root_view | True | Create API root endpoint |
| include_format_suffixes | False | Support .json format suffix |

### API Versioning Strategy

```
Version in URL Path:
├── v1: /api/v1/accounting/accounts/
├── v2: /api/v2/accounting/accounts/
└── Versioning: URL path preferred for clarity

Alternative Strategies:
├── Header-based: Accept: application/vnd.api.v1+json
├── Query param: /api/accounting/accounts/?version=1
└── Hostname: v1.api.example.com/accounting/accounts/

Recommended: URL path versioning for simplicity
```

### API Root Endpoint

```
GET /api/v1/accounting/

Response:
{
  "accounts": "http://localhost:8000/api/v1/accounting/accounts/"
}

Purpose:
├── Discoverability of endpoints
├── HATEOAS principle compliance
└── API navigation for clients
```

### Expected Outcome
- URLs module created in accounting app
- DefaultRouter configured and initialized
- AccountViewSet registered with 'accounts' prefix
- URL namespace 'accounting' configured
- Main URLs include accounting app routes
- All standard and custom endpoints accessible
- URL names follow convention
- Documentation of URL patterns provided

### Verification Checklist
- [ ] `apps/accounting/urls.py` file created
- [ ] DefaultRouter imported and instantiated
- [ ] AccountViewSet registered with basename='account'
- [ ] Route prefix set to 'accounts'
- [ ] app_name = 'accounting' defined
- [ ] urlpatterns includes router.urls
- [ ] Main urls.py includes accounting.urls
- [ ] Path prefix is 'api/v1/accounting/'
- [ ] All standard CRUD URLs accessible
- [ ] Custom action URLs accessible (tree, types, initialize)
- [ ] URL reversal works correctly
- [ ] URL namespace resolves properly
- [ ] show_urls command shows accounting endpoints

---

## Summary

This document covered the implementation of the REST API layer for the Chart of Accounts system:

**Task 79** created the AccountViewSet with full CRUD operations, filtering, searching, and optimized querysets.

**Task 80** added the tree endpoint for hierarchical account structure retrieval with depth limiting and caching.

**Task 81** implemented the account types endpoint providing metadata about account types, categories, and validation rules.

**Task 82** created the COA initialization endpoint with template support, dry run mode, and overwrite protection.

**Task 83** configured URL routing with DefaultRouter, registering all endpoints and setting up proper namespacing.

The API layer is now complete with efficient endpoints, proper permissions, and comprehensive URL configuration. Next document covers testing and documentation.

---

**Document Metadata:**
- **Total Tasks:** 5 (79-83)
- **Estimated Time:** 2.5 hours
- **Complexity:** Medium
- **Dependencies:** AccountSerializer, Account model with MPTT, COAInitializer service
- **Deliverables:** AccountViewSet, custom endpoints, URL configuration
