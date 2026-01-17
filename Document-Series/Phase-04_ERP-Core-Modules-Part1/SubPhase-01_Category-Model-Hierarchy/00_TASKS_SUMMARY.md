# SubPhase 01: Category Model & Hierarchy - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase Index:** 01 of 10  
> **SubPhase Goal:** Create a flexible, hierarchical category system  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-03_Core-Backend-Infrastructure](../../Phase-03_Core-Backend-Infrastructure/)
- **→ Next SubPhase:** [SubPhase-02_Attribute-System](../SubPhase-02_Attribute-System/)

---

## SubPhase Overview

This sub-phase creates the hierarchical category system for the LankaCommerce Cloud platform. Categories support unlimited nesting using MPTT (Modified Preorder Tree Traversal) for efficient tree queries.

### Key Outcomes
- Hierarchical category model (MPTT)
- Unlimited nesting depth
- Category images and descriptions
- SEO fields for webstore
- Active/inactive status management
- Display ordering
- Category breadcrumb support

### Category Structure Example
```
Electronics
├── Mobile Phones
│   ├── Smartphones
│   │   ├── Android
│   │   └── iOS
│   └── Feature Phones
├── Laptops
│   ├── Gaming
│   └── Business
└── Accessories
    ├── Chargers
    └── Cases
```

### Dependencies
- **Requires:** Phase-03 (Base Models & Mixins)

---

## Task Execution Order

```
TASK GROUP A: MPTT Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: Category Model Definition (Tasks 15-32)
        │
        ▼
TASK GROUP C: Category Manager & QuerySets (Tasks 33-46)
        │
        ▼
TASK GROUP D: Category Serializers & Views (Tasks 47-64)
        │
        ▼
TASK GROUP E: Admin & Management Commands (Tasks 65-78)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 79-92)
```

---

## Task Index

### Group A: MPTT Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install django-mptt** | pip install django-mptt | Phase-03 | 🔴 Not Created |
| 02 | **Pin django-mptt Version** | Add to requirements.txt | Task 01 | 🔴 Not Created |
| 03 | **Add to INSTALLED_APPS** | mptt | Task 02 | 🔴 Not Created |
| 04 | **Create categories App** | django-admin startapp categories | Task 03 | 🔴 Not Created |
| 05 | **Add categories to TENANT_APPS** | Tenant-specific app | Task 04 | 🔴 Not Created |
| 06 | **Create categories __init__.py** | App initialization | Task 05 | 🔴 Not Created |
| 07 | **Create categories apps.py** | App configuration | Task 06 | 🔴 Not Created |
| 08 | **Configure App Label** | categories app label | Task 07 | 🔴 Not Created |
| 09 | **Create models Module** | models/ directory | Task 08 | 🔴 Not Created |
| 10 | **Create models __init__.py** | Export models | Task 09 | 🔴 Not Created |
| 11 | **Understand MPTT Fields** | lft, rght, tree_id, level | Task 10 | 🔴 Not Created |
| 12 | **Plan Tree Structure** | Category tree design | Task 11 | 🔴 Not Created |
| 13 | **Create Initial Migration** | Category model migration | Task 12 | 🔴 Not Created |
| 14 | **Test MPTT Installation** | Verify setup | Task 13 | 🔴 Not Created |

---

### Group B: Category Model Definition (Tasks 15-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create category.py Model File** | Category model | Task 14 | 🔴 Not Created |
| 16 | **Import MPTTModel** | from mptt.models | Task 15 | 🔴 Not Created |
| 17 | **Import TreeForeignKey** | For parent field | Task 16 | 🔴 Not Created |
| 18 | **Define Category Class** | MPTTModel subclass | Task 17 | 🔴 Not Created |
| 19 | **Add name Field** | Category name | Task 18 | 🔴 Not Created |
| 20 | **Add slug Field** | URL-safe identifier | Task 19 | 🔴 Not Created |
| 21 | **Add parent Field** | TreeForeignKey to self | Task 20 | 🔴 Not Created |
| 22 | **Add description Field** | Rich text description | Task 21 | 🔴 Not Created |
| 23 | **Add image Field** | Category image | Task 22 | 🔴 Not Created |
| 24 | **Add icon Field** | Category icon class | Task 23 | 🔴 Not Created |
| 25 | **Add is_active Field** | Active status | Task 24 | 🔴 Not Created |
| 26 | **Add display_order Field** | Sort ordering | Task 25 | 🔴 Not Created |
| 27 | **Add seo_title Field** | Meta title | Task 26 | 🔴 Not Created |
| 28 | **Add seo_description Field** | Meta description | Task 27 | 🔴 Not Created |
| 29 | **Add seo_keywords Field** | Meta keywords | Task 28 | 🔴 Not Created |
| 30 | **Define MPTTMeta Class** | order_insertion_by | Task 29 | 🔴 Not Created |
| 31 | **Add __str__ Method** | String representation | Task 30 | 🔴 Not Created |
| 32 | **Export Category Model** | In __init__.py | Task 31 | 🔴 Not Created |

---

### Group C: Category Manager & QuerySets (Tasks 33-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create managers.py File** | Category managers | Task 32 | 🔴 Not Created |
| 34 | **Create CategoryQuerySet** | Custom QuerySet | Task 33 | 🔴 Not Created |
| 35 | **Add active Method** | Filter active only | Task 34 | 🔴 Not Created |
| 36 | **Add root_nodes Method** | Get root categories | Task 35 | 🔴 Not Created |
| 37 | **Add with_children Method** | Prefetch children | Task 36 | 🔴 Not Created |
| 38 | **Add with_products Method** | Prefetch products | Task 37 | 🔴 Not Created |
| 39 | **Create CategoryManager** | Custom manager | Task 38 | 🔴 Not Created |
| 40 | **Add get_tree Method** | Full tree structure | Task 39 | 🔴 Not Created |
| 41 | **Add get_breadcrumbs Method** | Ancestor path | Task 40 | 🔴 Not Created |
| 42 | **Add get_descendants_ids Method** | All descendant IDs | Task 41 | 🔴 Not Created |
| 43 | **Add move_node Method** | Reorder categories | Task 42 | 🔴 Not Created |
| 44 | **Assign Manager to Model** | objects = CategoryManager | Task 43 | 🔴 Not Created |
| 45 | **Add Model Properties** | Computed properties | Task 44 | 🔴 Not Created |
| 46 | **Test Manager Methods** | Manager unit tests | Task 45 | 🔴 Not Created |

---

### Group D: Category Serializers & Views (Tasks 47-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create serializers.py File** | Category serializers | Task 46 | 🔴 Not Created |
| 48 | **Create CategorySerializer** | Base serializer | Task 47 | 🔴 Not Created |
| 49 | **Add Nested Fields** | parent, children | Task 48 | 🔴 Not Created |
| 50 | **Create CategoryTreeSerializer** | Tree structure | Task 49 | 🔴 Not Created |
| 51 | **Create CategoryListSerializer** | Flat list | Task 50 | 🔴 Not Created |
| 52 | **Create CategoryDetailSerializer** | Full details | Task 51 | 🔴 Not Created |
| 53 | **Create CategoryCreateSerializer** | Create validation | Task 52 | 🔴 Not Created |
| 54 | **Add Slug Auto-generation** | From name | Task 53 | 🔴 Not Created |
| 55 | **Create views.py File** | Category views | Task 54 | 🔴 Not Created |
| 56 | **Create CategoryViewSet** | CRUD ViewSet | Task 55 | 🔴 Not Created |
| 57 | **Add list Action** | List categories | Task 56 | 🔴 Not Created |
| 58 | **Add retrieve Action** | Get single | Task 57 | 🔴 Not Created |
| 59 | **Add create Action** | Create category | Task 58 | 🔴 Not Created |
| 60 | **Add update Action** | Update category | Task 59 | 🔴 Not Created |
| 61 | **Add destroy Action** | Delete category | Task 60 | 🔴 Not Created |
| 62 | **Add tree Action** | Get full tree | Task 61 | 🔴 Not Created |
| 63 | **Create urls.py File** | Category URLs | Task 62 | 🔴 Not Created |
| 64 | **Register Routes** | Router registration | Task 63 | 🔴 Not Created |

---

### Group E: Admin & Management Commands (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create admin.py File** | Category admin | Task 64 | 🔴 Not Created |
| 66 | **Import MPTTModelAdmin** | Tree-based admin | Task 65 | 🔴 Not Created |
| 67 | **Create CategoryAdmin Class** | Admin configuration | Task 66 | 🔴 Not Created |
| 68 | **Configure list_display** | Display columns | Task 67 | 🔴 Not Created |
| 69 | **Configure list_filter** | Filter sidebar | Task 68 | 🔴 Not Created |
| 70 | **Configure search_fields** | Search by name | Task 69 | 🔴 Not Created |
| 71 | **Configure prepopulated_fields** | Auto slug | Task 70 | 🔴 Not Created |
| 72 | **Configure ordering** | Default order | Task 71 | 🔴 Not Created |
| 73 | **Enable Drag-Drop Reordering** | MPTT admin | Task 72 | 🔴 Not Created |
| 74 | **Create Management Commands** | commands/ directory | Task 73 | 🔴 Not Created |
| 75 | **Create seed_categories Command** | Demo data | Task 74 | 🔴 Not Created |
| 76 | **Create rebuild_tree Command** | Fix tree structure | Task 75 | 🔴 Not Created |
| 77 | **Create export_categories Command** | Export to JSON | Task 76 | 🔴 Not Created |
| 78 | **Create import_categories Command** | Import from JSON | Task 77 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 79-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create tests Module** | tests/ directory | Task 78 | 🔴 Not Created |
| 80 | **Create test_models.py** | Model tests | Task 79 | 🔴 Not Created |
| 81 | **Test Category Creation** | Create category | Task 80 | 🔴 Not Created |
| 82 | **Test Hierarchy** | Parent-child relations | Task 81 | 🔴 Not Created |
| 83 | **Test MPTT Fields** | lft, rght verification | Task 82 | 🔴 Not Created |
| 84 | **Test Slug Generation** | Auto slug | Task 83 | 🔴 Not Created |
| 85 | **Create test_api.py** | API tests | Task 84 | 🔴 Not Created |
| 86 | **Test List Endpoint** | GET /categories/ | Task 85 | 🔴 Not Created |
| 87 | **Test Tree Endpoint** | GET /categories/tree/ | Task 86 | 🔴 Not Created |
| 88 | **Test Create Endpoint** | POST /categories/ | Task 87 | 🔴 Not Created |
| 89 | **Test Tenant Isolation** | Tenant data separation | Task 88 | 🔴 Not Created |
| 90 | **Create Categories README** | Usage documentation | Task 89 | 🔴 Not Created |
| 91 | **Document API Endpoints** | API reference | Task 90 | 🔴 Not Created |
| 92 | **Verify Full Integration** | End-to-end test | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/categories/
├── __init__.py
├── apps.py
├── models/
│   ├── __init__.py
│   ├── category.py
│   └── managers.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
├── management/
│   └── commands/
│       ├── seed_categories.py
│       ├── rebuild_tree.py
│       ├── export_categories.py
│       └── import_categories.py
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_api.py
└── docs/
    ├── overview.md
    └── api.md
```

---

## Category Model Fields

```
┌─────────────────────────────────────────────────────┐
│              CATEGORY MODEL FIELDS                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Basic Fields:                                      │
│  ├── id           → Primary key (UUID)             │
│  ├── name         → Category name                  │
│  ├── slug         → URL identifier                 │
│  ├── parent       → Parent category (FK)           │
│  └── description  → Rich text description          │
│                                                     │
│  Display Fields:                                    │
│  ├── image        → Category image                 │
│  ├── icon         → Icon class name                │
│  ├── display_order → Sort order                    │
│  └── is_active    → Active status                  │
│                                                     │
│  SEO Fields:                                        │
│  ├── seo_title       → Meta title                  │
│  ├── seo_description → Meta description            │
│  └── seo_keywords    → Meta keywords               │
│                                                     │
│  MPTT Fields (Auto-managed):                        │
│  ├── lft      → Left value                         │
│  ├── rght     → Right value                        │
│  ├── tree_id  → Tree identifier                    │
│  └── level    → Nesting depth                      │
│                                                     │
│  Audit Fields (from BaseModel):                     │
│  ├── created_at  → Creation timestamp              │
│  ├── updated_at  → Last update                     │
│  ├── created_by  → Creator user                    │
│  └── updated_by  → Last modifier                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────┐
│              CATEGORY API ENDPOINTS                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  List & Retrieve:                                   │
│  ├── GET    /api/v1/categories/                    │
│  ├── GET    /api/v1/categories/{id}/               │
│  └── GET    /api/v1/categories/tree/               │
│                                                     │
│  Create & Update:                                   │
│  ├── POST   /api/v1/categories/                    │
│  ├── PUT    /api/v1/categories/{id}/               │
│  ├── PATCH  /api/v1/categories/{id}/               │
│  └── DELETE /api/v1/categories/{id}/               │
│                                                     │
│  Special Actions:                                   │
│  ├── GET    /api/v1/categories/{id}/children/      │
│  ├── GET    /api/v1/categories/{id}/ancestors/     │
│  ├── GET    /api/v1/categories/{id}/products/      │
│  └── POST   /api/v1/categories/{id}/move/          │
│                                                     │
│  Query Parameters:                                  │
│  ├── ?parent={id}    → Filter by parent            │
│  ├── ?is_active=true → Filter active only          │
│  ├── ?search=term    → Search by name              │
│  └── ?ordering=name  → Order by field              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 92 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **MPTT Required:** Use django-mptt for tree structure
3. **Tenant Isolation:** Categories are tenant-specific
4. **Slug Generation:** Auto-generate from name
5. **SEO Fields:** Include for webstore visibility
6. **Image Upload:** Use tenant storage paths
7. **Tree Queries:** Use MPTT methods for efficiency
8. **Admin:** Enable drag-drop reordering
9. **Cache:** Cache category tree for performance
