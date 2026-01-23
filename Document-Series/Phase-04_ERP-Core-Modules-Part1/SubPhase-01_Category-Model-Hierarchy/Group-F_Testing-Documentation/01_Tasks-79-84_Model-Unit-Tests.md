# Tasks 79-84: Model & Unit Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Admin-Management-Commands/](../Group-E_Admin-Management-Commands/)
- **→ Next Document:** [02_Tasks-85-89_API-Integration-Tests.md](02_Tasks-85-89_API-Integration-Tests.md)

---

## Document Overview

This document covers creating comprehensive unit tests for the Category model, MPTT functionality, and model methods.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create tests Module | Low |
| 80 | Create test_models.py | Low |
| 81 | Test Category Creation | Medium |
| 82 | Test Hierarchy | High |
| 83 | Test MPTT Fields | High |
| 84 | Test Slug Generation | Medium |

---

## Task 79: Create tests Module

### Overview
Convert tests.py to tests/ module for better organization.

### Instructions

1. **Delete default tests.py**
   - Remove backend/apps/categories/tests.py

2. **Create tests directory**
   - backend/apps/categories/tests/

3. **Create __init__.py**
   - Makes tests/ a Python package

4. **Plan test files**
   - test_models.py: Model tests
   - test_api.py: API tests
   - test_managers.py: Manager tests (optional)

### Expected Structure
```
backend/apps/categories/
├── tests/
│   ├── __init__.py
│   ├── test_models.py        # This document
│   └── test_api.py            # Next document
```

---

## Task 80: Create test_models.py

### Overview
Create test file for Category model tests with pytest-django.

### Instructions

1. **Create test_models.py**
   - Path: backend/apps/categories/tests/test_models.py

2. **Import required modules**
   - pytest
   - Category model
   - Django test utilities

3. **Create test class**
   - CategoryModelTest class
   - Organize related tests

4. **Add fixtures**
   - Sample categories for testing
   - Use pytest fixtures

### Test File Structure
```
Imports
├── pytest
├── Category model
└── Test utilities

Fixtures
├── root_category
├── child_category
└── nested_categories

Test Classes
├── TestCategoryCreation
├── TestCategoryHierarchy
├── TestMPTTFields
└── TestSlugGeneration
```

---

## Task 81: Test Category Creation

### Overview
Test basic category creation with all fields.

### Instructions

1. **Test create root category**
   - Create category with parent=None
   - Verify all fields saved
   - Check MPTT fields initialized

2. **Test create with minimal fields**
   - Only required fields (name)
   - Check defaults applied

3. **Test create with all fields**
   - All optional fields provided
   - Verify saved correctly

4. **Test field constraints**
   - Max length validation
   - Required field validation

### Test Scenarios
| Test Case | Verification |
|-----------|--------------|
| **Create Root** | parent=None, level=0 |
| **Minimal Fields** | Only name required |
| **All Fields** | All fields saved |
| **Defaults** | is_active=True by default |
| **UUID** | Auto-generated ID |

### Test Example Concepts
```
Tests should verify:
- Category created successfully
- UUID generated automatically
- Timestamps set correctly
- Default values applied
- MPTT fields initialized
```

---

## Task 82: Test Hierarchy

### Overview
Test parent-child relationships and tree structure.

### Instructions

1. **Test parent-child relationship**
   - Create parent and child
   - Verify child.parent == parent
   - Verify parent.children includes child

2. **Test multi-level hierarchy**
   - Create 3-level tree
   - Verify relationships at all levels

3. **Test get_ancestors**
   - Verify ancestor chain
   - Check ordering (root to node)

4. **Test get_descendants**
   - Verify all descendants returned
   - Check includes all levels

5. **Test get_children**
   - Only direct children
   - No grandchildren

6. **Test root/leaf properties**
   - is_root for parent=None
   - is_leaf for no children

### Hierarchy Test Cases
```
Test Structure:
Electronics (root)
├── Mobile Phones (level 1)
│   └── Smartphones (level 2)
└── Laptops (level 1)

Verifications:
- Smartphones.get_ancestors() returns [Electronics, Mobile Phones]
- Electronics.get_descendants() returns [Mobile, Smartphones, Laptops]
- Mobile.get_children() returns [Smartphones] only
- Electronics.is_root == True
- Smartphones.is_leaf == True
```

---

## Task 83: Test MPTT Fields

### Overview
Test MPTT field values and tree structure integrity.

### Instructions

1. **Test lft/rght values**
   - Verify left < right
   - Check descendant containment
   - Validate no overlaps

2. **Test tree_id assignment**
   - Separate trees have different tree_id
   - Same tree has same tree_id

3. **Test level values**
   - Root: level=0
   - Children: parent.level + 1
   - Deep nesting levels correct

4. **Test MPTT field updates**
   - Create category: fields set
   - Move category: fields updated
   - Delete category: tree rebalanced

5. **Test tree integrity**
   - No gaps in lft/rght
   - Proper nesting
   - Consistent tree_id

### MPTT Field Validation
```
For tree:
Electronics (lft=1, rght=8, level=0)
├── Mobile (lft=2, rght=5, level=1)
│   └── Smart (lft=3, rght=4, level=2)
└── Laptop (lft=6, rght=7, level=1)

Verify:
- All lft < rght
- Smart.lft > Mobile.lft and Smart.rght < Mobile.rght
- All level values correct
- No gaps in sequence
```

---

## Task 84: Test Slug Generation

### Overview
Test automatic slug generation and uniqueness handling.

### Instructions

1. **Test auto-generation**
   - Create without slug
   - Verify slug generated from name

2. **Test manual slug**
   - Provide custom slug
   - Verify preserved

3. **Test slug uniqueness**
   - Create duplicate names
   - Verify slugs unique within parent
   - Check number suffix added

4. **Test slug format**
   - Lowercase
   - Hyphens for spaces
   - Special characters removed

5. **Test Unicode handling**
   - Sinhala characters
   - Transliteration

### Slug Generation Test Cases
| Input Name | Expected Slug | Notes |
|------------|---------------|-------|
| "Mobile Phones" | "mobile-phones" | Lowercase, hyphen |
| "Rice & Grains" | "rice-grains" | Remove & |
| "Electronics" (2nd) | "electronics-2" | Duplicate |
| "කුරුඳු" | "kurumdu" or similar | Unicode handling |

### Test Concepts
```
Tests should verify:
- Slugify converts to lowercase
- Spaces become hyphens
- Special characters removed
- Duplicates get number suffix
- Manual slugs preserved
- Uniqueness per parent, not global
```

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Create tests Module | tests/ directory structure |
| 80 | Create test_models.py | Model test file |
| 81 | Test Category Creation | Creation tests |
| 82 | Test Hierarchy | Tree relationship tests |
| 83 | Test MPTT Fields | MPTT validation tests |
| 84 | Test Slug Generation | Slug auto-generation tests |

### Model Test Coverage
```
test_models.py Tests:
├── Category Creation
│   ├── Root categories
│   ├── Minimal fields
│   └── Field validation
├── Hierarchy Tests
│   ├── Parent-child relationships
│   ├── Ancestors/descendants
│   ├── Children queries
│   └── Root/leaf properties
├── MPTT Fields
│   ├── lft/rght validation
│   ├── tree_id assignment
│   ├── level calculation
│   └── Tree integrity
└── Slug Generation
    ├── Auto-generation
    ├── Manual slugs
    ├── Uniqueness
    └── Format validation
```

### Next Steps
Proceed to [02_Tasks-85-89_API-Integration-Tests.md](02_Tasks-85-89_API-Integration-Tests.md) for API endpoint testing.

---

## Notes for AI Agents

1. **pytest-django:** Use for Django testing
2. **Fixtures:** Create reusable test data
3. **MPTT Tests:** Critical for tree integrity
4. **Hierarchy:** Test all tree relationships
5. **Slug Tests:** Include edge cases
6. **Isolation:** Each test independent
7. **Coverage:** Aim for 90%+ coverage
8. **Edge Cases:** Test boundaries and errors
9. **Validation:** Test field constraints
10. **Next Document:** API integration tests
