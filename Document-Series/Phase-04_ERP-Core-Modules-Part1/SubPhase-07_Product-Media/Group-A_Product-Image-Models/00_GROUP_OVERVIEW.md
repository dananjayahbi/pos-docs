# Group A: Product Image Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create core product image models with metadata and validation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_Image-Processing-Pipeline](../Group-B_Image-Processing-Pipeline/)

---

## Group Overview

### Key Outcomes
- Media app structure within products module
- Image size constants (thumbnail, medium, large)
- Allowed image format definitions
- Tenant-aware image upload path function
- ProductImage model with product FK, display_order, is_primary
- Image metadata fields (alt_text, title, caption)
- Dimension tracking (width, height) on save
- File size tracking on save
- Custom manager with get_primary(), get_gallery()
- is_primary constraint (one per product)
- set_as_primary method
- Image validation (type, size, dimensions)
- Pre-save signals for metadata extraction
- Admin configuration with image preview

### Technology Context
- **Library:** Pillow for image handling
- **Storage:** TenantAwareStorage from Phase-03
- **Path Format:** tenants/{schema}/products/{product_id}/
- **Max File Size:** 5MB

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Media-App-Setup.md | 01-04 | App structure, constants, formats, upload path |
| 02 | 02_Tasks-05-09_ProductImage-Model.md | 05-09 | Model definition, metadata, dimensions, size, Meta |
| 03 | 03_Tasks-10-13_Manager-Constraints-Validation.md | 10-13 | Manager, is_primary constraint, set_as_primary, validation |
| 04 | 04_Tasks-14-16_Filename-Signals-Admin.md | 14-16 | Original filename, signals, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create media app structure | Low | 15 min |
| 02 | Define image size constants | Low | 10 min |
| 03 | Define allowed image formats | Low | 10 min |
| 04 | Create image upload path function | Low | 20 min |
| 05 | Create ProductImage model | Medium | 30 min |
| 06 | Add image metadata fields | Low | 20 min |
| 07 | Add image dimension fields | Low | 15 min |
| 08 | Add file size tracking | Low | 15 min |
| 09 | Create ProductImage Meta class | Low | 15 min |
| 10 | Add ProductImage manager | Medium | 25 min |
| 11 | Create is_primary constraint | Medium | 25 min |
| 12 | Add set_as_primary method | Low | 20 min |
| 13 | Create image validation | Medium | 25 min |
| 14 | Add original_filename field | Low | 10 min |
| 15 | Create ProductImage signals | Medium | 25 min |
| 16 | Create ProductImage admin | Medium | 25 min |

---

## Execution Order

```
Task 01: Create media app structure
    │
    ▼
Tasks 02-04: Constants & Upload Path
    │ (size constants, formats, upload path function)
    ▼
Tasks 05-09: ProductImage Model
    │ (model, metadata, dimensions, file size, Meta)
    ▼
Tasks 10-13: Manager & Validation
    │ (manager, is_primary constraint, set_as_primary, validation)
    ▼
Tasks 14-16: Signals & Admin
    │ (original_filename, signals, admin)
```

---

## Expected Deliverables

```
backend/apps/products/media/
├── __init__.py (NEW)
├── apps.py (NEW)
├── constants.py (NEW)
├── validators.py (NEW)
├── utils.py (NEW)
├── admin.py (NEW)
├── models/
│   ├── __init__.py (NEW)
│   └── product_image.py (NEW)
└── managers/
    └── image_manager.py (NEW)
```

---

## Notes for AI Agents

1. **Size Constants:**
   - THUMBNAIL: 150×150
   - MEDIUM: 500×500
   - LARGE: 1000×1000
2. **Allowed Formats:** JPEG, PNG, WebP, GIF (static only)
3. **Upload Path:** tenants/{schema}/products/{product_id}/
4. **Max File Size:** 5MB
5. **Min Dimensions:** 100×100 pixels
6. **Max Dimensions:** 4000×4000 pixels
7. **is_primary Constraint:** Only one image per product
8. **Dimension Extraction:** Use Pillow in pre_save signal
9. **file_size:** Store in bytes as PositiveIntegerField
10. **Next Group:** Image Processing Pipeline (Group B)
