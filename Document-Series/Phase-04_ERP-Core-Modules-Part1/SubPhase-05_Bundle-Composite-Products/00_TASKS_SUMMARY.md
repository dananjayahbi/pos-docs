# SubPhase 05: Bundle & Composite Products - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase Index:** 05 of 10  
> **SubPhase Goal:** Create product bundles and manufacturing recipes (BOM)  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Product-Variants](../SubPhase-04_Product-Variants/)
- **→ Next SubPhase:** [SubPhase-06_Product-Pricing](../SubPhase-06_Product-Pricing/)

---

## SubPhase Overview

This sub-phase implements bundle and composite product types for the LankaCommerce Cloud platform. Bundles are collections of existing products sold together. Composite products are manufactured from raw materials using Bill of Materials (BOM).

### Key Outcomes
- Product bundle model
- Bundle item relationships
- Bundle pricing (fixed or dynamic)
- Bill of Materials (BOM) model
- Manufacturing recipes
- Cost calculation from components
- Stock availability based on components

### Product Types
```
Bundle Product:
  → Collection of existing products sold together
  → Example: Gift Hamper = Chocolate + Wine + Card
  → Stock depends on component availability

Composite Product:
  → Manufactured from raw materials
  → Uses Bill of Materials (BOM)
  → Example: Custom Cake = Flour + Sugar + Eggs + Labor
  → Has manufacturing cost calculation
```

### Dependencies
- **Requires:** SubPhase-03 (Product Base Model)

---

## Task Execution Order

```
TASK GROUP A: Bundle Product Models (Tasks 01-20)
        │
        ▼
TASK GROUP B: Bundle Stock & Pricing Logic (Tasks 21-36)
        │
        ▼
TASK GROUP C: Composite Product & BOM (Tasks 37-56)
        │
        ▼
TASK GROUP D: Manufacturing Cost Calculation (Tasks 57-68)
        │
        ▼
TASK GROUP E: Serializers & Views (Tasks 69-80)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 81-90)
```

---

## Task Index

### Group A: Bundle Product Models (Tasks 01-20)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create bundle.py File** | Bundle models | SubPhase-03 | 🔴 Not Created |
| 02 | **Define ProductBundle Class** | Bundle container | Task 01 | 🔴 Not Created |
| 03 | **Add product Field** | FK to Product | Task 02 | 🔴 Not Created |
| 04 | **Add bundle_type Field** | Fixed/Dynamic pricing | Task 03 | 🔴 Not Created |
| 05 | **Add fixed_price Field** | Fixed bundle price | Task 04 | 🔴 Not Created |
| 06 | **Add discount_type Field** | Percentage/Fixed | Task 05 | 🔴 Not Created |
| 07 | **Add discount_value Field** | Discount amount | Task 06 | 🔴 Not Created |
| 08 | **Add is_active Field** | Active status | Task 07 | 🔴 Not Created |
| 09 | **Export ProductBundle** | In __init__.py | Task 08 | 🔴 Not Created |
| 10 | **Define BundleItem Class** | Bundle component | Task 09 | 🔴 Not Created |
| 11 | **Add bundle Field** | FK to ProductBundle | Task 10 | 🔴 Not Created |
| 12 | **Add product Field** | FK to Product | Task 11 | 🔴 Not Created |
| 13 | **Add variant Field** | FK to ProductVariant | Task 12 | 🔴 Not Created |
| 14 | **Add quantity Field** | Quantity in bundle | Task 13 | 🔴 Not Created |
| 15 | **Add is_optional Field** | Optional component | Task 14 | 🔴 Not Created |
| 16 | **Add sort_order Field** | Display order | Task 15 | 🔴 Not Created |
| 17 | **Add __str__ Method** | String representation | Task 16 | 🔴 Not Created |
| 18 | **Add Meta Class** | Unique constraint | Task 17 | 🔴 Not Created |
| 19 | **Export BundleItem** | In __init__.py | Task 18 | 🔴 Not Created |
| 20 | **Create Bundle Migration** | Bundle migration | Task 19 | 🔴 Not Created |

---

### Group B: Bundle Stock & Pricing Logic (Tasks 21-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 21 | **Create bundle_services.py** | Bundle services | Task 20 | 🔴 Not Created |
| 22 | **Create BundleStockService Class** | Stock calculation | Task 21 | 🔴 Not Created |
| 23 | **Add get_available_stock Method** | Calculate stock | Task 22 | 🔴 Not Created |
| 24 | **Add check_availability Method** | Check if available | Task 23 | 🔴 Not Created |
| 25 | **Add get_limiting_item Method** | Find bottleneck | Task 24 | 🔴 Not Created |
| 26 | **Add reserve_stock Method** | Reserve components | Task 25 | 🔴 Not Created |
| 27 | **Create BundlePricingService Class** | Pricing logic | Task 26 | 🔴 Not Created |
| 28 | **Add calculate_fixed_price Method** | Fixed price | Task 27 | 🔴 Not Created |
| 29 | **Add calculate_dynamic_price Method** | Sum of components | Task 28 | 🔴 Not Created |
| 30 | **Add apply_discount Method** | Apply bundle discount | Task 29 | 🔴 Not Created |
| 31 | **Add get_savings Method** | Calculate savings | Task 30 | 🔴 Not Created |
| 32 | **Create Bundle Manager** | Custom manager | Task 31 | 🔴 Not Created |
| 33 | **Add active Method** | Filter active | Task 32 | 🔴 Not Created |
| 34 | **Add available Method** | Has stock | Task 33 | 🔴 Not Created |
| 35 | **Add with_items Method** | Prefetch items | Task 34 | 🔴 Not Created |
| 36 | **Test Bundle Logic** | Stock/price tests | Task 35 | 🔴 Not Created |

---

### Group C: Composite Product & BOM (Tasks 37-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create bom.py File** | BOM models | Task 36 | 🔴 Not Created |
| 38 | **Define BillOfMaterials Class** | BOM container | Task 37 | 🔴 Not Created |
| 39 | **Add product Field** | FK to Product | Task 38 | 🔴 Not Created |
| 40 | **Add version Field** | BOM version | Task 39 | 🔴 Not Created |
| 41 | **Add is_active Field** | Active BOM version | Task 40 | 🔴 Not Created |
| 42 | **Add notes Field** | Manufacturing notes | Task 41 | 🔴 Not Created |
| 43 | **Add yield_quantity Field** | Output quantity | Task 42 | 🔴 Not Created |
| 44 | **Export BillOfMaterials** | In __init__.py | Task 43 | 🔴 Not Created |
| 45 | **Define BOMItem Class** | BOM component | Task 44 | 🔴 Not Created |
| 46 | **Add bom Field** | FK to BOM | Task 45 | 🔴 Not Created |
| 47 | **Add raw_material Field** | FK to Product | Task 46 | 🔴 Not Created |
| 48 | **Add quantity Field** | Required quantity | Task 47 | 🔴 Not Created |
| 49 | **Add unit_of_measure Field** | UoM for material | Task 48 | 🔴 Not Created |
| 50 | **Add wastage_percent Field** | Wastage allowance | Task 49 | 🔴 Not Created |
| 51 | **Add is_critical Field** | Critical component | Task 50 | 🔴 Not Created |
| 52 | **Add substitute Field** | Alternative material | Task 51 | 🔴 Not Created |
| 53 | **Add sort_order Field** | Display order | Task 52 | 🔴 Not Created |
| 54 | **Export BOMItem** | In __init__.py | Task 53 | 🔴 Not Created |
| 55 | **Create BOM Migration** | BOM migration | Task 54 | 🔴 Not Created |
| 56 | **Create BOM Manager** | Custom manager | Task 55 | 🔴 Not Created |

---

### Group D: Manufacturing Cost Calculation (Tasks 57-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create manufacturing_services.py** | Manufacturing services | Task 56 | 🔴 Not Created |
| 58 | **Create CostCalculationService Class** | Cost calculation | Task 57 | 🔴 Not Created |
| 59 | **Add calculate_material_cost Method** | Raw material cost | Task 58 | 🔴 Not Created |
| 60 | **Add calculate_with_wastage Method** | Include wastage | Task 59 | 🔴 Not Created |
| 61 | **Add calculate_labor_cost Method** | Labor cost | Task 60 | 🔴 Not Created |
| 62 | **Add calculate_overhead Method** | Overhead cost | Task 61 | 🔴 Not Created |
| 63 | **Add calculate_total_cost Method** | Total manufacturing | Task 62 | 🔴 Not Created |
| 64 | **Add calculate_unit_cost Method** | Per unit cost | Task 63 | 🔴 Not Created |
| 65 | **Add suggest_selling_price Method** | Price suggestion | Task 64 | 🔴 Not Created |
| 66 | **Create ManufacturingStockService** | Stock calculation | Task 65 | 🔴 Not Created |
| 67 | **Add check_raw_materials Method** | Material availability | Task 66 | 🔴 Not Created |
| 68 | **Add get_producible_quantity Method** | Max output | Task 67 | 🔴 Not Created |

---

### Group E: Serializers & Views (Tasks 69-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create bundle_serializers.py** | Bundle serializers | Task 68 | 🔴 Not Created |
| 70 | **Create ProductBundleSerializer** | Bundle serializer | Task 69 | 🔴 Not Created |
| 71 | **Create BundleItemSerializer** | Item serializer | Task 70 | 🔴 Not Created |
| 72 | **Create BundleDetailSerializer** | Full details | Task 71 | 🔴 Not Created |
| 73 | **Create bom_serializers.py** | BOM serializers | Task 72 | 🔴 Not Created |
| 74 | **Create BillOfMaterialsSerializer** | BOM serializer | Task 73 | 🔴 Not Created |
| 75 | **Create BOMItemSerializer** | Item serializer | Task 74 | 🔴 Not Created |
| 76 | **Create bundle_views.py** | Bundle views | Task 75 | 🔴 Not Created |
| 77 | **Create ProductBundleViewSet** | Bundle CRUD | Task 76 | 🔴 Not Created |
| 78 | **Create bom_views.py** | BOM views | Task 77 | 🔴 Not Created |
| 79 | **Create BillOfMaterialsViewSet** | BOM CRUD | Task 78 | 🔴 Not Created |
| 80 | **Update urls.py** | Bundle/BOM URLs | Task 79 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create test_bundles.py** | Bundle tests | Task 80 | 🔴 Not Created |
| 82 | **Test Bundle Creation** | Create bundle | Task 81 | 🔴 Not Created |
| 83 | **Test Bundle Stock Calc** | Stock calculation | Task 82 | 🔴 Not Created |
| 84 | **Test Bundle Pricing** | Price calculation | Task 83 | 🔴 Not Created |
| 85 | **Create test_bom.py** | BOM tests | Task 84 | 🔴 Not Created |
| 86 | **Test BOM Creation** | Create BOM | Task 85 | 🔴 Not Created |
| 87 | **Test Cost Calculation** | Manufacturing cost | Task 86 | 🔴 Not Created |
| 88 | **Test Tenant Isolation** | Tenant separation | Task 87 | 🔴 Not Created |
| 89 | **Create Bundle/BOM README** | Usage documentation | Task 88 | 🔴 Not Created |
| 90 | **Verify Full Integration** | End-to-end test | Task 89 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/products/
├── models/
│   ├── __init__.py
│   ├── product.py
│   ├── bundle.py
│   └── bom.py
├── services/
│   ├── __init__.py
│   ├── bundle_services.py
│   └── manufacturing_services.py
├── serializers/
│   ├── __init__.py
│   ├── bundle_serializers.py
│   └── bom_serializers.py
├── views/
│   ├── __init__.py
│   ├── bundle_views.py
│   └── bom_views.py
├── tests/
│   ├── test_bundles.py
│   └── test_bom.py
└── docs/
    ├── bundles.md
    └── bom.md
```

---

## Bundle vs Composite Comparison

```
┌─────────────────────────────────────────────────────┐
│          BUNDLE vs COMPOSITE PRODUCTS               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BUNDLE PRODUCT:                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Example: Gift Hamper                        │   │
│  │                                             │   │
│  │ Components:                                 │   │
│  │ ├── Chocolate Box (qty: 1)                  │   │
│  │ ├── Wine Bottle (qty: 1)                    │   │
│  │ └── Greeting Card (qty: 1)                  │   │
│  │                                             │   │
│  │ Pricing:                                    │   │
│  │ ├── Fixed: Rs. 5,000                        │   │
│  │ └── Dynamic: Sum - 10% discount             │   │
│  │                                             │   │
│  │ Stock = MIN(component stocks / qty)         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  COMPOSITE PRODUCT (BOM):                           │
│  ┌─────────────────────────────────────────────┐   │
│  │ Example: Custom Birthday Cake               │   │
│  │                                             │   │
│  │ Bill of Materials:                          │   │
│  │ ├── Flour (500g, wastage: 5%)               │   │
│  │ ├── Sugar (200g, wastage: 2%)               │   │
│  │ ├── Eggs (4 pcs)                            │   │
│  │ ├── Butter (100g)                           │   │
│  │ └── Labor (2 hours)                         │   │
│  │                                             │   │
│  │ Cost Calculation:                           │   │
│  │ ├── Material Cost: Rs. 800                  │   │
│  │ ├── Wastage: Rs. 40                         │   │
│  │ ├── Labor: Rs. 500                          │   │
│  │ ├── Overhead: Rs. 100                       │   │
│  │ └── Total: Rs. 1,440                        │   │
│  │                                             │   │
│  │ Suggested Price: Rs. 2,500 (74% margin)     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Bundle Pricing Types

```
┌─────────────────────────────────────────────────────┐
│            BUNDLE PRICING TYPES                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FIXED PRICING:                                     │
│  ├── Bundle has one set price                      │
│  ├── Independent of component prices               │
│  └── Example: Gift Set = Rs. 5,000                 │
│                                                     │
│  DYNAMIC PRICING:                                   │
│  ├── Calculated from component prices              │
│  ├── Apply percentage or fixed discount            │
│  │                                                 │
│  │  Component Total:                               │
│  │    Chocolate: Rs. 1,500                         │
│  │    Wine: Rs. 3,000                              │
│  │    Card: Rs. 200                                │
│  │    ─────────────────                            │
│  │    Sum: Rs. 4,700                               │
│  │                                                 │
│  │  With 10% discount:                             │
│  │    Bundle Price: Rs. 4,230                      │
│  │    Savings: Rs. 470                             │
│  └─────────────────────────────────────────────────│
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────┐
│          BUNDLE & BOM API ENDPOINTS                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Bundles:                                           │
│  ├── GET    /api/v1/bundles/                       │
│  ├── GET    /api/v1/bundles/{id}/                  │
│  ├── POST   /api/v1/bundles/                       │
│  ├── PUT    /api/v1/bundles/{id}/                  │
│  ├── DELETE /api/v1/bundles/{id}/                  │
│  ├── GET    /api/v1/bundles/{id}/items/            │
│  ├── POST   /api/v1/bundles/{id}/items/            │
│  └── GET    /api/v1/bundles/{id}/availability/     │
│                                                     │
│  Bill of Materials:                                 │
│  ├── GET    /api/v1/bom/                           │
│  ├── GET    /api/v1/bom/{id}/                      │
│  ├── POST   /api/v1/bom/                           │
│  ├── PUT    /api/v1/bom/{id}/                      │
│  ├── DELETE /api/v1/bom/{id}/                      │
│  ├── GET    /api/v1/bom/{id}/items/                │
│  ├── POST   /api/v1/bom/{id}/items/                │
│  ├── GET    /api/v1/bom/{id}/cost/                 │
│  └── GET    /api/v1/bom/{id}/producible/           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 90 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Bundle Stock:** MIN of (component stock / qty)
3. **Bundle Pricing:** Fixed or dynamic (sum - discount)
4. **BOM Versioning:** Support multiple BOM versions
5. **Wastage:** Include wastage in cost calculation
6. **Substitutes:** Support alternative materials
7. **Tenant Isolation:** All models tenant-specific
8. **Cost Calculation:** Material + Labor + Overhead
9. **Next SubPhase:** Product Pricing
