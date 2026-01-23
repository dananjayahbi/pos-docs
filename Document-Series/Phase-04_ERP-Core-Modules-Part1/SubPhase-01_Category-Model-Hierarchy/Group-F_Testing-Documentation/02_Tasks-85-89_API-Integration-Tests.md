# Tasks 85-89: API & Integration Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-84_Model-Unit-Tests.md](01_Tasks-79-84_Model-Unit-Tests.md)
- **→ Next Document:** [03_Tasks-90-92_Documentation-Integration.md](03_Tasks-90-92_Documentation-Integration.md)

---

## Document Overview

This document covers creating comprehensive API tests for Category endpoints, including tenant isolation verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 85 | Create test_api.py | Low |
| 86 | Test List Endpoints | Medium |
| 87 | Test Tree Endpoint | High |
| 88 | Test Create Endpoint | Medium |
| 89 | Test Tenant Isolation | High |

---

## Task 85: Create test_api.py

### Overview
Create test file for API endpoint testing with DRF test utilities.

### Instructions

1. **Create test_api.py**
   - Path: backend/apps/categories/tests/test_api.py

2. **Import required modules**
   - DRF test utilities (APITestCase, APIClient)
   - Category model and serializers
   - User model for authentication
   - Tenant utilities

3. **Create test class**
   - CategoryAPITest class
   - Inherit from APITestCase

4. **Add fixtures and setup**
   - Create test tenant
   - Create test user
   - Create sample categories
   - Set up API client with authentication

### Test File Structure
```
Imports
├── DRF test utilities
├── Category model
├── User model
└── Tenant utilities

Fixtures
├── tenant
├── user
├── authenticated_client
└── sample_categories

Test Classes
├── TestCategoryListAPI
├── TestCategoryTreeAPI
├── TestCategoryCRUDAPI
└── TestTenantIsolation
```

---

## Task 86: Test List Endpoints

### Overview
Test category list endpoint with filters and pagination.

### Instructions

1. **Test basic list endpoint**
   - GET /api/categories/
   - Verify 200 status
   - Check response structure
   - Validate pagination

2. **Test active filter**
   - Filter is_active=True
   - Verify only active returned

3. **Test parent filter**
   - Filter by parent ID
   - Verify only children returned

4. **Test search functionality**
   - Search by name
   - Search by description
   - Verify results correct

5. **Test ordering**
   - Order by display_order
   - Order by name
   - Verify sort correct

### List Endpoint Test Cases
| Test Case | Endpoint | Expected Result |
|-----------|----------|-----------------|
| **List All** | GET /api/categories/ | All categories |
| **Active Only** | GET /api/categories/?is_active=true | Active only |
| **By Parent** | GET /api/categories/?parent=<id> | Children only |
| **Search** | GET /api/categories/?search=mobile | Matched results |
| **Ordering** | GET /api/categories/?ordering=name | Sorted by name |

### Response Structure Validation
```
Expected response format:
{
  "count": 10,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "parent": null,
      "level": 0,
      "is_active": true,
      "display_order": 1
    },
    ...
  ]
}
```

---

## Task 87: Test Tree Endpoint

### Overview
Test tree endpoint that returns hierarchical category structure.

### Instructions

1. **Test full tree endpoint**
   - GET /api/categories/tree/
   - Verify nested structure
   - Check all levels included

2. **Test tree structure**
   - Parent-child relationships correct
   - Nested children arrays
   - Level values accurate

3. **Test tree filtering**
   - Filter root categories only
   - Filter by parent
   - Active categories only in tree

4. **Test recursive serialization**
   - Children nested properly
   - All fields included
   - No circular references

### Tree Endpoint Test Cases
| Test Case | Verification |
|-----------|--------------|
| **Full Tree** | All categories nested correctly |
| **Root Level** | Only parent=None at top |
| **Nesting** | Children in children array |
| **Depth** | All levels included |
| **Active Filter** | Only active in tree |

### Expected Tree Structure
```
[
  {
    "id": "uuid-1",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "level": 0,
    "children": [
      {
        "id": "uuid-2",
        "name": "Mobile Phones",
        "slug": "mobile-phones",
        "parent": "uuid-1",
        "level": 1,
        "children": [
          {
            "id": "uuid-3",
            "name": "Smartphones",
            "slug": "smartphones",
            "parent": "uuid-2",
            "level": 2,
            "children": []
          }
        ]
      }
    ]
  }
]
```

---

## Task 88: Test Create Endpoint

### Overview
Test category creation via API with validation.

### Instructions

1. **Test create root category**
   - POST /api/categories/
   - With parent=null
   - Verify created successfully
   - Check 201 status

2. **Test create child category**
   - POST with parent ID
   - Verify parent-child link
   - Check level calculated

3. **Test required fields validation**
   - POST without name
   - Verify 400 error
   - Check error message

4. **Test slug auto-generation**
   - POST without slug
   - Verify slug generated
   - Check format correct

5. **Test duplicate validation**
   - Create duplicate name/parent
   - Verify validation error
   - Check unique constraint

6. **Test update endpoint**
   - PATCH /api/categories/<id>/
   - Update fields
   - Verify changes saved

7. **Test delete endpoint**
   - DELETE /api/categories/<id>/
   - Verify soft delete or cascade
   - Check tree integrity maintained

### CRUD Test Cases
| Method | Endpoint | Test | Expected Status |
|--------|----------|------|-----------------|
| **POST** | /api/categories/ | Create valid | 201 Created |
| **POST** | /api/categories/ | Missing name | 400 Bad Request |
| **POST** | /api/categories/ | Invalid parent | 400 Bad Request |
| **GET** | /api/categories/<id>/ | Retrieve | 200 OK |
| **PATCH** | /api/categories/<id>/ | Update | 200 OK |
| **DELETE** | /api/categories/<id>/ | Delete | 204 No Content |

### Validation Test Concepts
```
Tests should verify:
- Required fields enforced
- Invalid parent ID rejected
- Circular hierarchy prevented
- Slug uniqueness per parent
- Field length limits
- Data type validation
```

---

## Task 89: Test Tenant Isolation

### Overview
Critical test to ensure categories isolated between tenants.

### Instructions

1. **Create multi-tenant test setup**
   - Create two test tenants (tenant1, tenant2)
   - Create user for each tenant
   - Create categories in each tenant

2. **Test category visibility**
   - Login as tenant1 user
   - List categories
   - Verify only tenant1 categories visible

3. **Test cross-tenant access prevention**
   - Login as tenant1 user
   - Attempt to access tenant2 category by ID
   - Verify 404 error (not 403 to avoid info leak)

4. **Test creation isolation**
   - Create category as tenant1
   - Switch to tenant2
   - Verify category not visible

5. **Test tree isolation**
   - Request tree as tenant1
   - Verify only tenant1 categories in tree
   - No tenant2 categories leaked

6. **Test parent references**
   - Cannot set parent from another tenant
   - Verify validation error

### Tenant Isolation Test Scenarios
```
Setup:
- Tenant A: "shop-a.lankacommerce.lk"
  - Category: "Electronics"
- Tenant B: "shop-b.lankacommerce.lk"
  - Category: "Groceries"

Test 1: List Isolation
- As Tenant A user, GET /api/categories/
- Result: Only "Electronics"
- "Groceries" not visible

Test 2: Direct Access
- As Tenant A user, GET /api/categories/<groceries-id>/
- Result: 404 Not Found (not 403)

Test 3: Tree Isolation
- As Tenant A user, GET /api/categories/tree/
- Result: Only Tenant A tree
- No Tenant B data leaked

Test 4: Parent Validation
- As Tenant A user, POST category with Tenant B parent ID
- Result: 400 Bad Request, invalid parent
```

### Critical Isolation Checks
| Check | Expected Behavior |
|-------|-------------------|
| **List** | Only own tenant's categories |
| **Retrieve** | 404 for other tenant's categories |
| **Create** | Cannot use other tenant's parent |
| **Update** | Cannot move to other tenant |
| **Delete** | Cannot delete other tenant's |
| **Tree** | Only own tenant's tree |

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 85 | Create test_api.py | API test file structure |
| 86 | Test List Endpoints | List/filter/search tests |
| 87 | Test Tree Endpoint | Hierarchical tree tests |
| 88 | Test Create Endpoint | CRUD operation tests |
| 89 | Test Tenant Isolation | Multi-tenancy tests |

### API Test Coverage
```
test_api.py Tests:
├── List Endpoint
│   ├── Basic listing
│   ├── Filtering (active, parent)
│   ├── Search
│   ├── Ordering
│   └── Pagination
├── Tree Endpoint
│   ├── Full tree structure
│   ├── Nested serialization
│   ├── Filtering
│   └── Level validation
├── CRUD Operations
│   ├── Create (root, child)
│   ├── Retrieve
│   ├── Update
│   ├── Delete
│   └── Validation
└── Tenant Isolation
    ├── List isolation
    ├── Access prevention
    ├── Tree isolation
    └── Parent validation
```

### Testing Best Practices
1. **Authentication:** Test both authenticated and unauthenticated
2. **Permissions:** Verify role-based access
3. **Validation:** Test all field validations
4. **Edge Cases:** Test boundaries and limits
5. **Tenant Isolation:** CRITICAL - test thoroughly
6. **Response Format:** Validate serializer output
7. **Status Codes:** Verify HTTP status codes
8. **Error Messages:** Check error response format

### Next Steps
Proceed to [03_Tasks-90-92_Documentation-Integration.md](03_Tasks-90-92_Documentation-Integration.md) for final documentation and verification.

---

## Notes for AI Agents

1. **DRF Testing:** Use APITestCase and APIClient
2. **Authentication:** Set up test users with tokens
3. **Tenant Switching:** Use tenant context managers
4. **Isolation Tests:** CRITICAL for multi-tenancy
5. **Tree Validation:** Check nested structure
6. **CRUD Complete:** Test all operations
7. **Status Codes:** Verify correct codes
8. **Error Handling:** Test validation errors
9. **Fixtures:** Reuse setup data
10. **Next Document:** Documentation and integration verification
