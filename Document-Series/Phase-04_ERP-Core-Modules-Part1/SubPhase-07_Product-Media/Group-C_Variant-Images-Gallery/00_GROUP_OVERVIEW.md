# Group C: Variant Images & Gallery

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement variant-specific images and gallery management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Image-Processing-Pipeline](../Group-B_Image-Processing-Pipeline/)
- **→ Next Group:** [Group-D_WebP-Conversion-Optimization](../Group-D_WebP-Conversion-Optimization/)

---

## Group Overview

### Key Outcomes
- VariantImage model with variant FK
- Variant-specific metadata (alt_text, title)
- Variant image upload path function
- VariantImage manager (get_primary, get_gallery)
- Signals for variant image processing
- Image inheritance logic (variant falls back to product)
- get_variant_images method with fallback
- ProductGallery service for unified management
- Gallery reordering functionality
- Bulk upload handler
- Image swap functionality
- Copy product image to variant
- Gallery limit configuration (tenant-specific)
- Gallery position validation (unique display_order)
- VariantImage admin with preview
- Drag-drop reorder endpoint

### Technology Context
- **Inheritance:** Variants use product images if none defined
- **Path Format:** tenants/{schema}/products/{product_id}/variants/{variant_id}/
- **Default Limit:** 10 images per product (tenant configurable)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-33-39_VariantImage-Model.md | 33-39 | VariantImage model, metadata, path, manager, inheritance |
| 02 | 02_Tasks-40-44_Gallery-Service.md | 40-44 | ProductGallery service, reorder, bulk upload, swap, copy |
| 03 | 03_Tasks-45-48_Limits-Admin-Reorder.md | 45-48 | Gallery limits, position validation, admin, drag-drop |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create VariantImage model | Medium | 30 min |
| 34 | Add variant image metadata | Low | 15 min |
| 35 | Create variant image upload path | Low | 20 min |
| 36 | Add variant image manager | Medium | 25 min |
| 37 | Create variant image signals | Medium | 25 min |
| 38 | Add image inheritance logic | Low | 20 min |
| 39 | Create get_variant_images method | Low | 20 min |
| 40 | Create ProductGallery service | High | 30 min |
| 41 | Add reorder_gallery method | Low | 20 min |
| 42 | Create bulk upload handler | High | 30 min |
| 43 | Add image swap functionality | Low | 15 min |
| 44 | Create image copy to variant | Medium | 25 min |
| 45 | Add gallery limit configuration | Low | 20 min |
| 46 | Create gallery position validation | Low | 20 min |
| 47 | Add VariantImage admin | Medium | 25 min |
| 48 | Create image drag-drop reordering | Medium | 25 min |

---

## Execution Order

```
Tasks 33-39: VariantImage Model
    │ (model, metadata, path, manager, signals,
    │  inheritance, get_variant_images)
    ▼
Tasks 40-44: ProductGallery Service
    │ (service, reorder, bulk upload, swap, copy)
    ▼
Tasks 45-48: Limits, Admin & Reorder
    │ (gallery limits, position validation,
    │  admin, drag-drop endpoint)
```

---

## Expected Deliverables

```
backend/apps/products/media/
├── models/
│   ├── __init__.py (updated)
│   └── variant_image.py (NEW)
├── services/
│   ├── __init__.py (updated)
│   └── gallery_manager.py (NEW)
├── managers/
│   └── image_manager.py (updated)
└── admin.py (updated)
```

---

## Notes for AI Agents

1. **VariantImage Fields:** variant FK, image, display_order, is_primary
2. **Upload Path:** tenants/{schema}/products/{product_id}/variants/{variant_id}/
3. **Inheritance Logic:**
   - If variant has images → use variant images
   - If no variant images → use product images
4. **get_variant_images:** Returns variant images or product fallback
5. **ProductGallery Service:** Unified API for both product and variant galleries
6. **Bulk Upload:** Accept multiple files, assign sequential display_order
7. **Gallery Limit:** Default 10, configurable per tenant
8. **Position Validation:** display_order must be unique within product/variant
9. **Gap-Based Ordering:** 10, 20, 30... for easy insertions
10. **Next Group:** WebP Conversion & Optimization (Group D)
