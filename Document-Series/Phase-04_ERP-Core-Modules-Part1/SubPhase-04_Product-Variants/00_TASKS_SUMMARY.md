# SubPhase 04: Product Variants - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase Index:** 04 of 10  
> **SubPhase Goal:** Implement variable products with size/color/material combinations  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 8-9 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Product-Base-Model](../SubPhase-03_Product-Base-Model/)
- **→ Next SubPhase:** [SubPhase-05_Bundle-Composite-Products](../SubPhase-05_Bundle-Composite-Products/)

---

## SubPhase Overview

This sub-phase implements the product variant system for the LankaCommerce Cloud platform. Variable products have a parent product with multiple variants based on attribute combinations (e.g., Size × Color).

### Key Outcomes
- Variant option types (Size, Color, Material)
- Variant option values (S, M, L, XL for Size)
- Product variant combinations
- Individual variant SKU generation
- Variant-specific pricing
- Variant-specific stock tracking
- Variant-specific images

### Variant Structure Example
```
T-Shirt (Parent Product - Variable)
├── Options:
│   ├── Size: [S, M, L, XL]
│   └── Color: [Red, Blue]
├── Variants (8 combinations):
│   ├── T-Shirt - S - Red   [SKU: TS-S-RED, Stock: 25]
│   ├── T-Shirt - S - Blue  [SKU: TS-S-BLU, Stock: 30]
│   ├── T-Shirt - M - Red   [SKU: TS-M-RED, Stock: 40]
│   ├── T-Shirt - M - Blue  [SKU: TS-M-BLU, Stock: 35]
│   ├── T-Shirt - L - Red   [SKU: TS-L-RED, Stock: 20]
│   ├── T-Shirt - L - Blue  [SKU: TS-L-BLU, Stock: 15]
│   ├── T-Shirt - XL - Red  [SKU: TS-XL-RED, Stock: 10]
│   └── T-Shirt - XL - Blue [SKU: TS-XL-BLU, Stock: 12]
```

### Dependencies
- **Requires:** SubPhase-03 (Product Base Model)

---

## Task Execution Order

```
TASK GROUP A: Variant Option Models (Tasks 01-18)
        │
        ▼
TASK GROUP B: ProductVariant Model (Tasks 19-38)
        │
        ▼
TASK GROUP C: Variant Generation Logic (Tasks 39-54)
        │
        ▼
TASK GROUP D: Variant Managers & QuerySets (Tasks 55-66)
        │
        ▼
TASK GROUP E: Serializers & Views (Tasks 67-82)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 83-94)
```

---

## Task Index

### Group A: Variant Option Models (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create variant_option.py File** | VariantOption model | SubPhase-03 | 🔴 Not Created |
| 02 | **Define VariantOptionType Class** | Option type model | Task 01 | 🔴 Not Created |
| 03 | **Add type name Field** | Size, Color, Material | Task 02 | 🔴 Not Created |
| 04 | **Add type slug Field** | URL identifier | Task 03 | 🔴 Not Created |
| 05 | **Add display_order Field** | Sort order | Task 04 | 🔴 Not Created |
| 06 | **Add is_color_swatch Field** | Show color picker | Task 05 | 🔴 Not Created |
| 07 | **Add is_image_swatch Field** | Show image picker | Task 06 | 🔴 Not Created |
| 08 | **Export VariantOptionType** | In __init__.py | Task 07 | 🔴 Not Created |
| 09 | **Define VariantOptionValue Class** | Option value model | Task 08 | 🔴 Not Created |
| 10 | **Add option_type Field** | FK to OptionType | Task 09 | 🔴 Not Created |
| 11 | **Add value Field** | Option value text | Task 10 | 🔴 Not Created |
| 12 | **Add label Field** | Display label | Task 11 | 🔴 Not Created |
| 13 | **Add color_code Field** | Hex color code | Task 12 | 🔴 Not Created |
| 14 | **Add image Field** | Swatch image | Task 13 | 🔴 Not Created |
| 15 | **Add display_order Field** | Sort order | Task 14 | 🔴 Not Created |
| 16 | **Export VariantOptionValue** | In __init__.py | Task 15 | 🔴 Not Created |
| 17 | **Create Option Migration** | Option migration | Task 16 | 🔴 Not Created |
| 18 | **Test Option Models** | Basic tests | Task 17 | 🔴 Not Created |

---

### Group B: ProductVariant Model (Tasks 19-38)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create product_variant.py File** | ProductVariant model | Task 18 | 🔴 Not Created |
| 20 | **Define ProductVariant Class** | Variant model | Task 19 | 🔴 Not Created |
| 21 | **Add product Field** | FK to Product | Task 20 | 🔴 Not Created |
| 22 | **Add sku Field** | Variant SKU | Task 21 | 🔴 Not Created |
| 23 | **Add barcode Field** | Variant barcode | Task 22 | 🔴 Not Created |
| 24 | **Add name Field** | Auto-generated name | Task 23 | 🔴 Not Created |
| 25 | **Add option_values Field** | M2M to OptionValue | Task 24 | 🔴 Not Created |
| 26 | **Add is_active Field** | Active status | Task 25 | 🔴 Not Created |
| 27 | **Add weight_override Field** | Override weight | Task 26 | 🔴 Not Created |
| 28 | **Add dimension_overrides** | Override dimensions | Task 27 | 🔴 Not Created |
| 29 | **Add sort_order Field** | Display order | Task 28 | 🔴 Not Created |
| 30 | **Define ProductVariantOption** | Through model | Task 29 | 🔴 Not Created |
| 31 | **Add __str__ Method** | String representation | Task 30 | 🔴 Not Created |
| 32 | **Add Meta Class** | Unique constraint | Task 31 | 🔴 Not Created |
| 33 | **Add get_option_display Method** | Options string | Task 32 | 🔴 Not Created |
| 34 | **Add get_full_name Property** | Product + options | Task 33 | 🔴 Not Created |
| 35 | **Create ProductOptionConfig** | Product-option link | Task 34 | 🔴 Not Created |
| 36 | **Add product Field to Config** | FK to Product | Task 35 | 🔴 Not Created |
| 37 | **Add option_type Field to Config** | FK to OptionType | Task 36 | 🔴 Not Created |
| 38 | **Export ProductVariant** | In __init__.py | Task 37 | 🔴 Not Created |

---

### Group C: Variant Generation Logic (Tasks 39-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 39 | **Create variant_generator.py** | Generation logic | Task 38 | 🔴 Not Created |
| 40 | **Create VariantGenerator Class** | Generator class | Task 39 | 🔴 Not Created |
| 41 | **Add get_combinations Method** | Cartesian product | Task 40 | 🔴 Not Created |
| 42 | **Add generate_variants Method** | Create variants | Task 41 | 🔴 Not Created |
| 43 | **Add generate_sku Method** | SKU generation | Task 42 | 🔴 Not Created |
| 44 | **Add validate_combinations Method** | Validate options | Task 43 | 🔴 Not Created |
| 45 | **Add bulk_create_variants Method** | Bulk creation | Task 44 | 🔴 Not Created |
| 46 | **Create SKU Pattern Config** | SKU format config | Task 45 | 🔴 Not Created |
| 47 | **Define Default SKU Pattern** | {product}-{opt1}-{opt2} | Task 46 | 🔴 Not Created |
| 48 | **Add SKU Uniqueness Check** | Validate unique | Task 47 | 🔴 Not Created |
| 49 | **Create signals.py File** | Variant signals | Task 48 | 🔴 Not Created |
| 50 | **Add pre_save Signal** | Before variant save | Task 49 | 🔴 Not Created |
| 51 | **Add post_save Signal** | After variant save | Task 50 | 🔴 Not Created |
| 52 | **Add Auto-name Generation** | Generate variant name | Task 51 | 🔴 Not Created |
| 53 | **Create Variant Migration** | Variant migration | Task 52 | 🔴 Not Created |
| 54 | **Test Variant Generation** | Generator tests | Task 53 | 🔴 Not Created |

---

### Group D: Variant Managers & QuerySets (Tasks 55-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create variant_managers.py** | Variant managers | Task 54 | 🔴 Not Created |
| 56 | **Create VariantQuerySet** | Custom QuerySet | Task 55 | 🔴 Not Created |
| 57 | **Add active Method** | Filter active | Task 56 | 🔴 Not Created |
| 58 | **Add in_stock Method** | Has stock | Task 57 | 🔴 Not Created |
| 59 | **Add for_product Method** | Filter by product | Task 58 | 🔴 Not Created |
| 60 | **Add by_option Method** | Filter by option | Task 59 | 🔴 Not Created |
| 61 | **Add with_prices Method** | Prefetch prices | Task 60 | 🔴 Not Created |
| 62 | **Add with_stock Method** | Prefetch stock | Task 61 | 🔴 Not Created |
| 63 | **Create VariantManager** | Custom manager | Task 62 | 🔴 Not Created |
| 64 | **Add get_by_options Method** | Find by options | Task 63 | 🔴 Not Created |
| 65 | **Assign Manager to Model** | objects = VariantManager | Task 64 | 🔴 Not Created |
| 66 | **Test Manager Methods** | Manager tests | Task 65 | 🔴 Not Created |

---

### Group E: Serializers & Views (Tasks 67-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create variant_serializers.py** | Variant serializers | Task 66 | 🔴 Not Created |
| 68 | **Create OptionTypeSerializer** | OptionType serializer | Task 67 | 🔴 Not Created |
| 69 | **Create OptionValueSerializer** | OptionValue serializer | Task 68 | 🔴 Not Created |
| 70 | **Create ProductVariantSerializer** | Variant serializer | Task 69 | 🔴 Not Created |
| 71 | **Create VariantListSerializer** | List view | Task 70 | 🔴 Not Created |
| 72 | **Create VariantDetailSerializer** | Detail view | Task 71 | 🔴 Not Created |
| 73 | **Create VariantCreateSerializer** | Create validation | Task 72 | 🔴 Not Created |
| 74 | **Create BulkCreateSerializer** | Bulk creation | Task 73 | 🔴 Not Created |
| 75 | **Create variant_views.py** | Variant views | Task 74 | 🔴 Not Created |
| 76 | **Create OptionTypeViewSet** | OptionType CRUD | Task 75 | 🔴 Not Created |
| 77 | **Create OptionValueViewSet** | OptionValue CRUD | Task 76 | 🔴 Not Created |
| 78 | **Create ProductVariantViewSet** | Variant CRUD | Task 77 | 🔴 Not Created |
| 79 | **Add generate_variants Action** | Bulk generate | Task 78 | 🔴 Not Created |
| 80 | **Update urls.py File** | Variant URLs | Task 79 | 🔴 Not Created |
| 81 | **Create variant_admin.py** | Variant admin | Task 80 | 🔴 Not Created |
| 82 | **Configure Inline Variants** | Variants in product | Task 81 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create test_variants.py** | Variant tests | Task 82 | 🔴 Not Created |
| 84 | **Test OptionType Creation** | Create option type | Task 83 | 🔴 Not Created |
| 85 | **Test OptionValue Creation** | Create option value | Task 84 | 🔴 Not Created |
| 86 | **Test Variant Creation** | Create variant | Task 85 | 🔴 Not Created |
| 87 | **Test Variant Generation** | Auto-generate | Task 86 | 🔴 Not Created |
| 88 | **Test SKU Generation** | SKU patterns | Task 87 | 🔴 Not Created |
| 89 | **Test Combination Logic** | Cartesian product | Task 88 | 🔴 Not Created |
| 90 | **Create test_variant_api.py** | API tests | Task 89 | 🔴 Not Created |
| 91 | **Test Variant Endpoints** | CRUD API | Task 90 | 🔴 Not Created |
| 92 | **Test Tenant Isolation** | Tenant separation | Task 91 | 🔴 Not Created |
| 93 | **Create Variants README** | Usage documentation | Task 92 | 🔴 Not Created |
| 94 | **Verify Full Integration** | End-to-end test | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/products/
├── models/
│   ├── __init__.py
│   ├── product.py
│   ├── variant_option.py
│   ├── product_variant.py
│   └── variant_managers.py
├── services/
│   └── variant_generator.py
├── serializers/
│   ├── __init__.py
│   ├── product_serializers.py
│   └── variant_serializers.py
├── views/
│   ├── __init__.py
│   ├── product_views.py
│   └── variant_views.py
├── admin/
│   ├── __init__.py
│   ├── product_admin.py
│   └── variant_admin.py
├── signals.py
├── tests/
│   ├── test_models.py
│   ├── test_variants.py
│   └── test_variant_api.py
└── docs/
    └── variants.md
```

---

## Variant Model Fields

```
┌─────────────────────────────────────────────────────┐
│              VARIANT MODEL FIELDS                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  VariantOptionType:                                 │
│  ├── id           → Primary key (UUID)             │
│  ├── name         → "Size", "Color", "Material"    │
│  ├── slug         → "size", "color", "material"    │
│  ├── display_order → Sort order                    │
│  ├── is_color_swatch → Show color picker           │
│  └── is_image_swatch → Show image picker           │
│                                                     │
│  VariantOptionValue:                                │
│  ├── id           → Primary key (UUID)             │
│  ├── option_type  → FK to VariantOptionType        │
│  ├── value        → "S", "M", "L", "Red", "Blue"   │
│  ├── label        → Display label                  │
│  ├── color_code   → "#FF0000" (for colors)         │
│  ├── image        → Swatch image                   │
│  └── display_order → Sort order                    │
│                                                     │
│  ProductVariant:                                    │
│  ├── id           → Primary key (UUID)             │
│  ├── product      → FK to Product (parent)         │
│  ├── sku          → Unique variant SKU             │
│  ├── barcode      → Variant-specific barcode       │
│  ├── name         → Auto-generated name            │
│  ├── option_values → M2M to OptionValue            │
│  ├── is_active    → Active status                  │
│  ├── weight_override → Override parent weight      │
│  └── sort_order   → Display order                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Variant Generation Flow

```
┌─────────────────────────────────────────────────────┐
│            VARIANT GENERATION FLOW                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Configure Product Options                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ Product: T-Shirt                            │   │
│  │ Options:                                    │   │
│  │   - Size: [S, M, L, XL]                     │   │
│  │   - Color: [Red, Blue, Green]               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Step 2: Generate Combinations                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Cartesian Product: 4 × 3 = 12 variants      │   │
│  │   S-Red, S-Blue, S-Green                    │   │
│  │   M-Red, M-Blue, M-Green                    │   │
│  │   L-Red, L-Blue, L-Green                    │   │
│  │   XL-Red, XL-Blue, XL-Green                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Step 3: Generate SKUs                              │
│  ┌─────────────────────────────────────────────┐   │
│  │ Pattern: {product_sku}-{size}-{color}       │   │
│  │ Examples:                                   │   │
│  │   TS-S-RED, TS-S-BLU, TS-S-GRN              │   │
│  │   TS-M-RED, TS-M-BLU, TS-M-GRN              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Step 4: Create Variant Records                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Bulk create ProductVariant objects          │   │
│  │ Each with: SKU, name, option values         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────┐
│             VARIANT API ENDPOINTS                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Option Types:                                      │
│  ├── GET    /api/v1/option-types/                  │
│  ├── POST   /api/v1/option-types/                  │
│  └── DELETE /api/v1/option-types/{id}/             │
│                                                     │
│  Option Values:                                     │
│  ├── GET    /api/v1/option-types/{id}/values/      │
│  ├── POST   /api/v1/option-types/{id}/values/      │
│  └── DELETE /api/v1/option-values/{id}/            │
│                                                     │
│  Product Variants:                                  │
│  ├── GET    /api/v1/products/{id}/variants/        │
│  ├── POST   /api/v1/products/{id}/variants/        │
│  ├── POST   /api/v1/products/{id}/generate-variants/│
│  ├── GET    /api/v1/variants/{id}/                 │
│  ├── PUT    /api/v1/variants/{id}/                 │
│  └── DELETE /api/v1/variants/{id}/                 │
│                                                     │
│  Query Parameters:                                  │
│  ├── ?option_type={id} → Filter by option type     │
│  ├── ?is_active=true   → Filter active only        │
│  └── ?in_stock=true    → Filter in-stock           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Cartesian Product:** Size × Color = All combinations
3. **SKU Pattern:** Configurable per tenant
4. **Bulk Generation:** Create all variants at once
5. **Color Swatches:** Support hex codes
6. **Image Swatches:** Support swatch images
7. **Tenant Isolation:** All models tenant-specific
8. **Admin Inline:** Show variants in product admin
9. **Next SubPhase:** Bundle/Composite products
