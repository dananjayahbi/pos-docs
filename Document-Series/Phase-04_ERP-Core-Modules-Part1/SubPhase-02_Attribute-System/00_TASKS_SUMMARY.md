# SubPhase 02: Attribute System - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase Index:** 02 of 10  
> **SubPhase Goal:** Build flexible attribute system for product specifications  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 8-9 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_Category-Model-Hierarchy](../SubPhase-01_Category-Model-Hierarchy/)
- **→ Next SubPhase:** [SubPhase-03_Product-Base-Model](../SubPhase-03_Product-Base-Model/)

---

## SubPhase Overview

This sub-phase creates the flexible attribute system for product specifications in the LankaCommerce Cloud platform. Attributes support multiple data types and can be assigned to categories for category-specific product specifications.

### Key Outcomes
- Attribute groups for organization
- Multiple attribute types (text, number, select, etc.)
- Category-specific attribute assignment
- Filterable attributes for webstore
- Searchable attributes
- Attribute validation rules

### Attribute Types
```
Text       → Material: Cotton
Number     → Weight: 250g
Select     → Size: S, M, L, XL
MultiSelect → Colors: Red, Blue, Green
Boolean    → Is Organic: Yes/No
Date       → Expiry Date: 2025-12-31
```

### Dependencies
- **Requires:** SubPhase-01 (Category Model & Hierarchy)

---

## Task Execution Order

```
TASK GROUP A: Attributes App Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: AttributeGroup Model (Tasks 15-28)
        │
        ▼
TASK GROUP C: Attribute Model (Tasks 29-48)
        │
        ▼
TASK GROUP D: AttributeOption Model (Tasks 49-62)
        │
        ▼
TASK GROUP E: Serializers & Views (Tasks 63-80)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 81-96)
```

---

## Task Index

### Group A: Attributes App Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create attributes App** | django-admin startapp attributes | SubPhase-01 | 🔴 Not Created |
| 02 | **Add attributes to TENANT_APPS** | Tenant-specific app | Task 01 | 🔴 Not Created |
| 03 | **Create attributes __init__.py** | App initialization | Task 02 | 🔴 Not Created |
| 04 | **Create attributes apps.py** | App configuration | Task 03 | 🔴 Not Created |
| 05 | **Configure App Label** | attributes app label | Task 04 | 🔴 Not Created |
| 06 | **Create models Module** | models/ directory | Task 05 | 🔴 Not Created |
| 07 | **Create models __init__.py** | Export models | Task 06 | 🔴 Not Created |
| 08 | **Create constants.py File** | Attribute constants | Task 07 | 🔴 Not Created |
| 09 | **Define ATTRIBUTE_TYPES** | Type choices | Task 08 | 🔴 Not Created |
| 10 | **Define TEXT Type** | Text input | Task 09 | 🔴 Not Created |
| 11 | **Define NUMBER Type** | Numeric input | Task 10 | 🔴 Not Created |
| 12 | **Define SELECT Type** | Single select | Task 11 | 🔴 Not Created |
| 13 | **Define MULTISELECT Type** | Multi select | Task 12 | 🔴 Not Created |
| 14 | **Define BOOLEAN Type** | Yes/No input | Task 13 | 🔴 Not Created |

---

### Group B: AttributeGroup Model (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create attribute_group.py File** | AttributeGroup model | Task 14 | 🔴 Not Created |
| 16 | **Define AttributeGroup Class** | Model definition | Task 15 | 🔴 Not Created |
| 17 | **Add name Field** | Group name | Task 16 | 🔴 Not Created |
| 18 | **Add slug Field** | URL identifier | Task 17 | 🔴 Not Created |
| 19 | **Add description Field** | Group description | Task 18 | 🔴 Not Created |
| 20 | **Add display_order Field** | Sort order | Task 19 | 🔴 Not Created |
| 21 | **Add is_active Field** | Active status | Task 20 | 🔴 Not Created |
| 22 | **Add __str__ Method** | String representation | Task 21 | 🔴 Not Created |
| 23 | **Add Meta Class** | Ordering, constraints | Task 22 | 🔴 Not Created |
| 24 | **Create GroupManager** | Custom manager | Task 23 | 🔴 Not Created |
| 25 | **Add active Method** | Filter active | Task 24 | 🔴 Not Created |
| 26 | **Add with_attributes Method** | Prefetch attributes | Task 25 | 🔴 Not Created |
| 27 | **Export AttributeGroup** | In __init__.py | Task 26 | 🔴 Not Created |
| 28 | **Create Initial Migration** | Group migration | Task 27 | 🔴 Not Created |

---

### Group C: Attribute Model (Tasks 29-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Create attribute.py File** | Attribute model | Task 28 | 🔴 Not Created |
| 30 | **Define Attribute Class** | Model definition | Task 29 | 🔴 Not Created |
| 31 | **Add name Field** | Attribute name | Task 30 | 🔴 Not Created |
| 32 | **Add slug Field** | URL identifier | Task 31 | 🔴 Not Created |
| 33 | **Add group Field** | FK to AttributeGroup | Task 32 | 🔴 Not Created |
| 34 | **Add attribute_type Field** | Type from choices | Task 33 | 🔴 Not Created |
| 35 | **Add unit Field** | Unit of measure | Task 34 | 🔴 Not Created |
| 36 | **Add is_required Field** | Required flag | Task 35 | 🔴 Not Created |
| 37 | **Add is_filterable Field** | Webstore filter | Task 36 | 🔴 Not Created |
| 38 | **Add is_searchable Field** | Search indexing | Task 37 | 🔴 Not Created |
| 39 | **Add is_comparable Field** | Product comparison | Task 38 | 🔴 Not Created |
| 40 | **Add is_visible_on_product Field** | Show on product | Task 39 | 🔴 Not Created |
| 41 | **Add display_order Field** | Sort order | Task 40 | 🔴 Not Created |
| 42 | **Add validation_regex Field** | Validation pattern | Task 41 | 🔴 Not Created |
| 43 | **Add min_value Field** | Number minimum | Task 42 | 🔴 Not Created |
| 44 | **Add max_value Field** | Number maximum | Task 43 | 🔴 Not Created |
| 45 | **Add categories Field** | M2M to Category | Task 44 | 🔴 Not Created |
| 46 | **Add __str__ Method** | String representation | Task 45 | 🔴 Not Created |
| 47 | **Export Attribute** | In __init__.py | Task 46 | 🔴 Not Created |
| 48 | **Create Attribute Migration** | Attribute migration | Task 47 | 🔴 Not Created |

---

### Group D: AttributeOption Model (Tasks 49-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create attribute_option.py File** | AttributeOption model | Task 48 | 🔴 Not Created |
| 50 | **Define AttributeOption Class** | Model definition | Task 49 | 🔴 Not Created |
| 51 | **Add attribute Field** | FK to Attribute | Task 50 | 🔴 Not Created |
| 52 | **Add value Field** | Option value | Task 51 | 🔴 Not Created |
| 53 | **Add label Field** | Display label | Task 52 | 🔴 Not Created |
| 54 | **Add color_code Field** | Color hex code | Task 53 | 🔴 Not Created |
| 55 | **Add image Field** | Option image | Task 54 | 🔴 Not Created |
| 56 | **Add display_order Field** | Sort order | Task 55 | 🔴 Not Created |
| 57 | **Add is_default Field** | Default selection | Task 56 | 🔴 Not Created |
| 58 | **Add __str__ Method** | String representation | Task 57 | 🔴 Not Created |
| 59 | **Add Meta Class** | Ordering, unique | Task 58 | 🔴 Not Created |
| 60 | **Create OptionManager** | Custom manager | Task 59 | 🔴 Not Created |
| 61 | **Export AttributeOption** | In __init__.py | Task 60 | 🔴 Not Created |
| 62 | **Create Option Migration** | Option migration | Task 61 | 🔴 Not Created |

---

### Group E: Serializers & Views (Tasks 63-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create serializers.py File** | Attribute serializers | Task 62 | 🔴 Not Created |
| 64 | **Create AttributeGroupSerializer** | Group serializer | Task 63 | 🔴 Not Created |
| 65 | **Create AttributeSerializer** | Attribute serializer | Task 64 | 🔴 Not Created |
| 66 | **Create AttributeOptionSerializer** | Option serializer | Task 65 | 🔴 Not Created |
| 67 | **Create AttributeListSerializer** | Flat list | Task 66 | 🔴 Not Created |
| 68 | **Create AttributeDetailSerializer** | Full details | Task 67 | 🔴 Not Created |
| 69 | **Add Nested Options** | Options in attribute | Task 68 | 🔴 Not Created |
| 70 | **Create views.py File** | Attribute views | Task 69 | 🔴 Not Created |
| 71 | **Create AttributeGroupViewSet** | Group CRUD | Task 70 | 🔴 Not Created |
| 72 | **Create AttributeViewSet** | Attribute CRUD | Task 71 | 🔴 Not Created |
| 73 | **Create AttributeOptionViewSet** | Option CRUD | Task 72 | 🔴 Not Created |
| 74 | **Add by_category Action** | Filter by category | Task 73 | 🔴 Not Created |
| 75 | **Add filterable Action** | Get filterable | Task 74 | 🔴 Not Created |
| 76 | **Create urls.py File** | Attribute URLs | Task 75 | 🔴 Not Created |
| 77 | **Register Routes** | Router registration | Task 76 | 🔴 Not Created |
| 78 | **Create admin.py File** | Attribute admin | Task 77 | 🔴 Not Created |
| 79 | **Configure Inline Options** | Options in admin | Task 78 | 🔴 Not Created |
| 80 | **Configure Admin Filters** | Admin filtering | Task 79 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 81-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create tests Module** | tests/ directory | Task 80 | 🔴 Not Created |
| 82 | **Create test_models.py** | Model tests | Task 81 | 🔴 Not Created |
| 83 | **Test AttributeGroup Creation** | Create group | Task 82 | 🔴 Not Created |
| 84 | **Test Attribute Creation** | Create attribute | Task 83 | 🔴 Not Created |
| 85 | **Test AttributeOption Creation** | Create option | Task 84 | 🔴 Not Created |
| 86 | **Test Attribute Types** | Type validation | Task 85 | 🔴 Not Created |
| 87 | **Test Category Assignment** | M2M relation | Task 86 | 🔴 Not Created |
| 88 | **Create test_api.py** | API tests | Task 87 | 🔴 Not Created |
| 89 | **Test Group Endpoints** | Group API | Task 88 | 🔴 Not Created |
| 90 | **Test Attribute Endpoints** | Attribute API | Task 89 | 🔴 Not Created |
| 91 | **Test Option Endpoints** | Option API | Task 90 | 🔴 Not Created |
| 92 | **Test by_category Filter** | Category filtering | Task 91 | 🔴 Not Created |
| 93 | **Test Tenant Isolation** | Tenant separation | Task 92 | 🔴 Not Created |
| 94 | **Create Attributes README** | Usage documentation | Task 93 | 🔴 Not Created |
| 95 | **Document API Endpoints** | API reference | Task 94 | 🔴 Not Created |
| 96 | **Verify Full Integration** | End-to-end test | Task 95 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/attributes/
├── __init__.py
├── apps.py
├── constants.py
├── models/
│   ├── __init__.py
│   ├── attribute_group.py
│   ├── attribute.py
│   └── attribute_option.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_api.py
└── docs/
    ├── overview.md
    └── api.md
```

---

## Attribute Type Behaviors

```
┌─────────────────────────────────────────────────────┐
│             ATTRIBUTE TYPE BEHAVIORS                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TEXT:                                              │
│  ├── Free text input                               │
│  ├── Optional regex validation                     │
│  └── Example: Brand, Material                      │
│                                                     │
│  NUMBER:                                            │
│  ├── Numeric input                                 │
│  ├── Optional min/max validation                   │
│  ├── Optional unit display                         │
│  └── Example: Weight (kg), Height (cm)             │
│                                                     │
│  SELECT:                                            │
│  ├── Single selection from options                 │
│  ├── Options defined via AttributeOption           │
│  └── Example: Size (S, M, L, XL)                   │
│                                                     │
│  MULTISELECT:                                       │
│  ├── Multiple selections allowed                   │
│  ├── Options defined via AttributeOption           │
│  └── Example: Colors (Red, Blue, Green)            │
│                                                     │
│  BOOLEAN:                                           │
│  ├── Yes/No toggle                                 │
│  ├── No additional options needed                  │
│  └── Example: Is Organic, Is Fragile               │
│                                                     │
│  DATE:                                              │
│  ├── Date picker input                             │
│  ├── Date format validation                        │
│  └── Example: Expiry Date, Manufacture Date        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Category-Attribute Assignment

```
┌─────────────────────────────────────────────────────┐
│          CATEGORY-ATTRIBUTE ASSIGNMENT              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Electronics                                        │
│  ├── Screen Size (NUMBER - inches)                 │
│  ├── RAM (SELECT - 4GB, 8GB, 16GB)                 │
│  ├── Storage (SELECT - 128GB, 256GB, 512GB)        │
│  └── Warranty (NUMBER - months)                    │
│                                                     │
│  Clothing                                           │
│  ├── Size (SELECT - XS, S, M, L, XL)               │
│  ├── Color (MULTISELECT - options)                 │
│  ├── Material (TEXT - Cotton, Polyester)           │
│  └── Gender (SELECT - Men, Women, Unisex)          │
│                                                     │
│  Food & Beverages                                   │
│  ├── Expiry Date (DATE)                            │
│  ├── Weight (NUMBER - grams)                       │
│  ├── Is Organic (BOOLEAN)                          │
│  └── Allergens (MULTISELECT - Gluten, Dairy)       │
│                                                     │
│  → Attributes inherit to child categories          │
│  → Products in category show relevant attributes   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────┐
│             ATTRIBUTE API ENDPOINTS                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Attribute Groups:                                  │
│  ├── GET    /api/v1/attribute-groups/              │
│  ├── GET    /api/v1/attribute-groups/{id}/         │
│  ├── POST   /api/v1/attribute-groups/              │
│  ├── PUT    /api/v1/attribute-groups/{id}/         │
│  └── DELETE /api/v1/attribute-groups/{id}/         │
│                                                     │
│  Attributes:                                        │
│  ├── GET    /api/v1/attributes/                    │
│  ├── GET    /api/v1/attributes/{id}/               │
│  ├── POST   /api/v1/attributes/                    │
│  ├── PUT    /api/v1/attributes/{id}/               │
│  ├── DELETE /api/v1/attributes/{id}/               │
│  ├── GET    /api/v1/attributes/by-category/{id}/   │
│  └── GET    /api/v1/attributes/filterable/         │
│                                                     │
│  Attribute Options:                                 │
│  ├── GET    /api/v1/attributes/{id}/options/       │
│  ├── POST   /api/v1/attributes/{id}/options/       │
│  ├── PUT    /api/v1/attribute-options/{id}/        │
│  └── DELETE /api/v1/attribute-options/{id}/        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 96 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 96 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Type Safety:** Validate input based on attribute_type
3. **Category M2M:** Attributes assigned to categories
4. **Filterable:** Mark attributes for webstore filters
5. **Options:** SELECT/MULTISELECT need AttributeOption
6. **Inheritance:** Child categories inherit parent attributes
7. **Admin:** Inline options editing in admin
8. **Validation:** Use regex/min/max for validation
9. **Tenant Isolation:** All models are tenant-specific
