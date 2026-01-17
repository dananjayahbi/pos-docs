# SubPhase 03: Product Base Model - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase Index:** 03 of 10  
> **SubPhase Goal:** Create the core product model with all common fields  
> **Total Tasks:** 98 | **Status:** Planning  
> **Estimated Duration:** 8-9 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Attribute-System](../SubPhase-02_Attribute-System/)
- **→ Next SubPhase:** [SubPhase-04_Product-Variants](../SubPhase-04_Product-Variants/)

---

## SubPhase Overview

This sub-phase creates the core product model for the LankaCommerce Cloud platform. The product model supports multiple product types (simple, variable, bundle, composite) and includes all common fields for ERP and webstore functionality.

### Key Outcomes
- Core product model with all fields
- Product type support (simple/variable/bundle/composite)
- SKU and barcode management
- Brand model
- Tax class integration
- Unit of measure support
- Product status workflow

### Product Types
```
Simple    → Single product, no variations (e.g., Book)
Variable  → Has variants (e.g., T-Shirt with sizes/colors)
Bundle    → Collection of products (e.g., Gift Set)
Composite → Manufacturing/BOM (e.g., Custom Cake)
```

### Dependencies
- **Requires:** SubPhase-01 (Category Model)
- **Requires:** SubPhase-02 (Attribute System)

---

## Task Execution Order

```
TASK GROUP A: Products App Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: Supporting Models (Tasks 15-32)
        │
        ▼
TASK GROUP C: Product Model Definition (Tasks 33-56)
        │
        ▼
TASK GROUP D: Product Manager & QuerySets (Tasks 57-70)
        │
        ▼
TASK GROUP E: Serializers & Views (Tasks 71-86)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 87-98)
```

---

## Task Index

### Group A: Products App Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create products App** | django-admin startapp products | SubPhase-02 | 🔴 Not Created |
| 02 | **Add products to TENANT_APPS** | Tenant-specific app | Task 01 | 🔴 Not Created |
| 03 | **Create products __init__.py** | App initialization | Task 02 | 🔴 Not Created |
| 04 | **Create products apps.py** | App configuration | Task 03 | 🔴 Not Created |
| 05 | **Configure App Label** | products app label | Task 04 | 🔴 Not Created |
| 06 | **Create models Module** | models/ directory | Task 05 | 🔴 Not Created |
| 07 | **Create models __init__.py** | Export models | Task 06 | 🔴 Not Created |
| 08 | **Create constants.py File** | Product constants | Task 07 | 🔴 Not Created |
| 09 | **Define PRODUCT_TYPES** | Type choices | Task 08 | 🔴 Not Created |
| 10 | **Define PRODUCT_STATUS** | Status choices | Task 09 | 🔴 Not Created |
| 11 | **Define DRAFT Status** | Draft status | Task 10 | 🔴 Not Created |
| 12 | **Define ACTIVE Status** | Active status | Task 11 | 🔴 Not Created |
| 13 | **Define ARCHIVED Status** | Archived status | Task 12 | 🔴 Not Created |
| 14 | **Define DISCONTINUED Status** | Discontinued status | Task 13 | 🔴 Not Created |

---

### Group B: Supporting Models (Tasks 15-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create brand.py File** | Brand model | Task 14 | 🔴 Not Created |
| 16 | **Define Brand Class** | Model definition | Task 15 | 🔴 Not Created |
| 17 | **Add Brand name Field** | Brand name | Task 16 | 🔴 Not Created |
| 18 | **Add Brand slug Field** | URL identifier | Task 17 | 🔴 Not Created |
| 19 | **Add Brand logo Field** | Brand logo image | Task 18 | 🔴 Not Created |
| 20 | **Add Brand description Field** | Brand description | Task 19 | 🔴 Not Created |
| 21 | **Add Brand website Field** | Brand website URL | Task 20 | 🔴 Not Created |
| 22 | **Add Brand is_active Field** | Active status | Task 21 | 🔴 Not Created |
| 23 | **Export Brand Model** | In __init__.py | Task 22 | 🔴 Not Created |
| 24 | **Create tax_class.py File** | TaxClass model | Task 23 | 🔴 Not Created |
| 25 | **Define TaxClass Class** | Model definition | Task 24 | 🔴 Not Created |
| 26 | **Add TaxClass name Field** | Tax class name | Task 25 | 🔴 Not Created |
| 27 | **Add TaxClass rate Field** | Tax percentage | Task 26 | 🔴 Not Created |
| 28 | **Add TaxClass is_default Field** | Default tax class | Task 27 | 🔴 Not Created |
| 29 | **Export TaxClass Model** | In __init__.py | Task 28 | 🔴 Not Created |
| 30 | **Create unit_of_measure.py** | UnitOfMeasure model | Task 29 | 🔴 Not Created |
| 31 | **Define UnitOfMeasure Class** | Model definition | Task 30 | 🔴 Not Created |
| 32 | **Export UnitOfMeasure Model** | In __init__.py | Task 31 | 🔴 Not Created |

---

### Group C: Product Model Definition (Tasks 33-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create product.py File** | Product model | Task 32 | 🔴 Not Created |
| 34 | **Define Product Class** | Model definition | Task 33 | 🔴 Not Created |
| 35 | **Add name Field** | Product name | Task 34 | 🔴 Not Created |
| 36 | **Add slug Field** | URL identifier | Task 35 | 🔴 Not Created |
| 37 | **Add sku Field** | Stock keeping unit | Task 36 | 🔴 Not Created |
| 38 | **Add barcode Field** | EAN-13/UPC barcode | Task 37 | 🔴 Not Created |
| 39 | **Add description Field** | Rich text description | Task 38 | 🔴 Not Created |
| 40 | **Add short_description Field** | Brief description | Task 39 | 🔴 Not Created |
| 41 | **Add category Field** | FK to Category | Task 40 | 🔴 Not Created |
| 42 | **Add brand Field** | FK to Brand | Task 41 | 🔴 Not Created |
| 43 | **Add product_type Field** | Type from choices | Task 42 | 🔴 Not Created |
| 44 | **Add status Field** | Status from choices | Task 43 | 🔴 Not Created |
| 45 | **Add is_webstore_visible Field** | Show on webstore | Task 44 | 🔴 Not Created |
| 46 | **Add is_pos_visible Field** | Show on POS | Task 45 | 🔴 Not Created |
| 47 | **Add tax_class Field** | FK to TaxClass | Task 46 | 🔴 Not Created |
| 48 | **Add unit_of_measure Field** | FK to UoM | Task 47 | 🔴 Not Created |
| 49 | **Add weight Field** | Product weight | Task 48 | 🔴 Not Created |
| 50 | **Add dimensions Fields** | Length/Width/Height | Task 49 | 🔴 Not Created |
| 51 | **Add seo_title Field** | Meta title | Task 50 | 🔴 Not Created |
| 52 | **Add seo_description Field** | Meta description | Task 51 | 🔴 Not Created |
| 53 | **Add featured Field** | Featured product | Task 52 | 🔴 Not Created |
| 54 | **Add __str__ Method** | String representation | Task 53 | 🔴 Not Created |
| 55 | **Add Meta Class** | Ordering, indexes | Task 54 | 🔴 Not Created |
| 56 | **Export Product Model** | In __init__.py | Task 55 | 🔴 Not Created |

---

### Group D: Product Manager & QuerySets (Tasks 57-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create managers.py File** | Product managers | Task 56 | 🔴 Not Created |
| 58 | **Create ProductQuerySet** | Custom QuerySet | Task 57 | 🔴 Not Created |
| 59 | **Add active Method** | Filter active | Task 58 | 🔴 Not Created |
| 60 | **Add published Method** | Webstore visible | Task 59 | 🔴 Not Created |
| 61 | **Add in_stock Method** | Has stock | Task 60 | 🔴 Not Created |
| 62 | **Add by_category Method** | Filter by category | Task 61 | 🔴 Not Created |
| 63 | **Add by_brand Method** | Filter by brand | Task 62 | 🔴 Not Created |
| 64 | **Add simple_products Method** | Type = simple | Task 63 | 🔴 Not Created |
| 65 | **Add variable_products Method** | Type = variable | Task 64 | 🔴 Not Created |
| 66 | **Add featured Method** | Featured products | Task 65 | 🔴 Not Created |
| 67 | **Create ProductManager** | Custom manager | Task 66 | 🔴 Not Created |
| 68 | **Add search Method** | Full-text search | Task 67 | 🔴 Not Created |
| 69 | **Assign Manager to Model** | objects = ProductManager | Task 68 | 🔴 Not Created |
| 70 | **Create Migration** | Product migration | Task 69 | 🔴 Not Created |

---

### Group E: Serializers & Views (Tasks 71-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Create serializers.py File** | Product serializers | Task 70 | 🔴 Not Created |
| 72 | **Create BrandSerializer** | Brand serializer | Task 71 | 🔴 Not Created |
| 73 | **Create TaxClassSerializer** | TaxClass serializer | Task 72 | 🔴 Not Created |
| 74 | **Create UnitOfMeasureSerializer** | UoM serializer | Task 73 | 🔴 Not Created |
| 75 | **Create ProductListSerializer** | List view serializer | Task 74 | 🔴 Not Created |
| 76 | **Create ProductDetailSerializer** | Detail serializer | Task 75 | 🔴 Not Created |
| 77 | **Create ProductCreateSerializer** | Create validation | Task 76 | 🔴 Not Created |
| 78 | **Add Auto SKU Generation** | Generate SKU | Task 77 | 🔴 Not Created |
| 79 | **Create views.py File** | Product views | Task 78 | 🔴 Not Created |
| 80 | **Create BrandViewSet** | Brand CRUD | Task 79 | 🔴 Not Created |
| 81 | **Create TaxClassViewSet** | TaxClass CRUD | Task 80 | 🔴 Not Created |
| 82 | **Create ProductViewSet** | Product CRUD | Task 81 | 🔴 Not Created |
| 83 | **Add ProductFilter** | Filter class | Task 82 | 🔴 Not Created |
| 84 | **Create urls.py File** | Product URLs | Task 83 | 🔴 Not Created |
| 85 | **Create admin.py File** | Product admin | Task 84 | 🔴 Not Created |
| 86 | **Configure Admin Filters** | Admin filtering | Task 85 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 87-98)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 87 | **Create tests Module** | tests/ directory | Task 86 | 🔴 Not Created |
| 88 | **Create test_models.py** | Model tests | Task 87 | 🔴 Not Created |
| 89 | **Test Product Creation** | Create product | Task 88 | 🔴 Not Created |
| 90 | **Test Product Types** | Type variations | Task 89 | 🔴 Not Created |
| 91 | **Test SKU Generation** | Auto SKU | Task 90 | 🔴 Not Created |
| 92 | **Test Status Workflow** | Status changes | Task 91 | 🔴 Not Created |
| 93 | **Create test_api.py** | API tests | Task 92 | 🔴 Not Created |
| 94 | **Test Product Endpoints** | CRUD API | Task 93 | 🔴 Not Created |
| 95 | **Test Tenant Isolation** | Tenant separation | Task 94 | 🔴 Not Created |
| 96 | **Create Products README** | Usage documentation | Task 95 | 🔴 Not Created |
| 97 | **Document API Endpoints** | API reference | Task 96 | 🔴 Not Created |
| 98 | **Verify Full Integration** | End-to-end test | Task 97 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/products/
├── __init__.py
├── apps.py
├── constants.py
├── models/
│   ├── __init__.py
│   ├── brand.py
│   ├── tax_class.py
│   ├── unit_of_measure.py
│   ├── product.py
│   └── managers.py
├── serializers.py
├── views.py
├── urls.py
├── admin.py
├── filters.py
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_api.py
└── docs/
    ├── overview.md
    └── api.md
```

---

## Product Model Fields

```
┌─────────────────────────────────────────────────────┐
│              PRODUCT MODEL FIELDS                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Identity Fields:                                   │
│  ├── id           → Primary key (UUID)             │
│  ├── name         → Product name                   │
│  ├── slug         → URL identifier                 │
│  ├── sku          → Stock keeping unit             │
│  └── barcode      → EAN-13/UPC code                │
│                                                     │
│  Description Fields:                                │
│  ├── description       → Rich text (HTML)          │
│  └── short_description → Plain text excerpt        │
│                                                     │
│  Classification:                                    │
│  ├── category     → FK to Category                 │
│  ├── brand        → FK to Brand                    │
│  ├── product_type → simple/variable/bundle/comp    │
│  └── status       → draft/active/archived          │
│                                                     │
│  Visibility:                                        │
│  ├── is_webstore_visible → Show in webstore        │
│  ├── is_pos_visible      → Show in POS             │
│  └── featured            → Featured flag           │
│                                                     │
│  Tax & Measurement:                                 │
│  ├── tax_class       → FK to TaxClass              │
│  ├── unit_of_measure → FK to UoM                   │
│  ├── weight          → Product weight (kg)         │
│  ├── length          → Dimension (cm)              │
│  ├── width           → Dimension (cm)              │
│  └── height          → Dimension (cm)              │
│                                                     │
│  SEO Fields:                                        │
│  ├── seo_title       → Meta title                  │
│  └── seo_description → Meta description            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Product Status Workflow

```
┌─────────────────────────────────────────────────────┐
│             PRODUCT STATUS WORKFLOW                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│         ┌──────────┐                                │
│         │  DRAFT   │ ← New product                  │
│         └────┬─────┘                                │
│              │ Publish                              │
│              ▼                                      │
│         ┌──────────┐                                │
│         │  ACTIVE  │ ← Visible, sellable            │
│         └────┬─────┘                                │
│              │                                      │
│       ┌──────┴──────┐                               │
│       │             │                               │
│       ▼             ▼                               │
│  ┌──────────┐  ┌──────────────┐                     │
│  │ ARCHIVED │  │ DISCONTINUED │                     │
│  └──────────┘  └──────────────┘                     │
│       │             │                               │
│       └──────┬──────┘                               │
│              │ Restore                              │
│              ▼                                      │
│         ┌──────────┐                                │
│         │  ACTIVE  │                                │
│         └──────────┘                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────┐
│              PRODUCT API ENDPOINTS                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Brands:                                            │
│  ├── GET    /api/v1/brands/                        │
│  ├── GET    /api/v1/brands/{id}/                   │
│  ├── POST   /api/v1/brands/                        │
│  └── DELETE /api/v1/brands/{id}/                   │
│                                                     │
│  Tax Classes:                                       │
│  ├── GET    /api/v1/tax-classes/                   │
│  └── POST   /api/v1/tax-classes/                   │
│                                                     │
│  Products:                                          │
│  ├── GET    /api/v1/products/                      │
│  ├── GET    /api/v1/products/{id}/                 │
│  ├── POST   /api/v1/products/                      │
│  ├── PUT    /api/v1/products/{id}/                 │
│  ├── PATCH  /api/v1/products/{id}/                 │
│  └── DELETE /api/v1/products/{id}/                 │
│                                                     │
│  Query Parameters:                                  │
│  ├── ?category={id}    → Filter by category        │
│  ├── ?brand={id}       → Filter by brand           │
│  ├── ?product_type=    → Filter by type            │
│  ├── ?status=          → Filter by status          │
│  ├── ?search=          → Full-text search          │
│  └── ?ordering=        → Order by field            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 98 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 98 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Product Type:** Determines behavior (variants, bundles)
3. **SKU Generation:** Auto-generate if not provided
4. **Barcode:** Support EAN-13 and UPC formats
5. **Status Workflow:** Draft → Active → Archived
6. **Tenant Isolation:** All products are tenant-specific
7. **Tax Class:** Required for LKR price calculations
8. **Admin:** Rich admin with filters and search
9. **Next SubPhase:** Variants build on this model
