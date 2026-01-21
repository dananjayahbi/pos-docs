# Group E: Media Serializers & API Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Create DRF serializers and viewsets for media management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_WebP-Conversion-Optimization](../Group-D_WebP-Conversion-Optimization/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- ProductImageSerializer with all size variant URLs
- Responsive image fields (srcset, sizes)
- VariantImageSerializer with inheritance handling
- ImageUploadSerializer with validation
- ImageReorderSerializer for gallery operations
- ProductImageViewSet with CRUD operations
- Image upload endpoint (single/bulk)
- Set primary image endpoint
- Reorder gallery endpoint
- VariantImageViewSet
- Image download endpoint
- Image optimization trigger endpoint
- Media cleanup endpoint
- Image permission enforcement

### Technology Context
- **Framework:** Django REST Framework 3.15+
- **Upload:** MultiPartParser for file uploads
- **Permissions:** Authorized users only for upload/delete

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-65-69_Serializers.md | 65-69 | ProductImage, responsive, VariantImage, Upload, Reorder serializers |
| 02 | 02_Tasks-70-74_ViewSets.md | 70-74 | ProductImageViewSet, upload, set-primary, reorder, VariantImageViewSet |
| 03 | 03_Tasks-75-78_Endpoints-Permissions.md | 75-78 | Download, optimize, cleanup endpoints, permissions |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create ProductImageSerializer | Medium | 25 min |
| 66 | Add responsive image fields | Low | 20 min |
| 67 | Create VariantImageSerializer | Medium | 25 min |
| 68 | Create ImageUploadSerializer | Medium | 25 min |
| 69 | Create ImageReorderSerializer | Low | 15 min |
| 70 | Create ProductImageViewSet | High | 30 min |
| 71 | Add image upload endpoint | Medium | 25 min |
| 72 | Add set primary endpoint | Low | 20 min |
| 73 | Add reorder endpoint | Low | 20 min |
| 74 | Create VariantImageViewSet | Medium | 25 min |
| 75 | Add image download endpoint | Low | 20 min |
| 76 | Add image optimization endpoint | Low | 20 min |
| 77 | Create media cleanup endpoint | Low | 20 min |
| 78 | Add image permissions | Low | 20 min |

---

## Execution Order

```
Tasks 65-69: Serializers
    │ (ProductImage, responsive, VariantImage,
    │  Upload, Reorder)
    ▼
Tasks 70-74: ViewSets
    │ (ProductImageViewSet, upload, set-primary,
    │  reorder, VariantImageViewSet)
    ▼
Tasks 75-78: Endpoints & Permissions
    │ (download, optimize, cleanup, permissions)
```

---

## Expected Deliverables

```
backend/apps/products/media/
├── serializers/
│   ├── __init__.py (NEW)
│   ├── product_image.py (NEW)
│   ├── variant_image.py (NEW)
│   └── upload.py (NEW)
├── views/
│   ├── __init__.py (NEW)
│   ├── product_image.py (NEW)
│   └── variant_image.py (NEW)
└── urls.py (NEW)
```

---

## Notes for AI Agents

1. **ProductImageSerializer Fields:**
   - id, product, image, alt_text, title, caption
   - thumbnail_url, medium_url, large_url
   - webp_thumbnail_url, webp_medium_url, webp_large_url
   - srcset, sizes, is_primary, display_order
2. **Responsive Fields:** SerializerMethodField for srcset, sizes
3. **VariantImageSerializer:** Handle inheritance (use_product_images flag)
4. **ImageUploadSerializer:** Validate file type, size, dimensions
5. **API Endpoints:**
   - POST /products/{id}/images/ (upload)
   - POST /products/{id}/images/{img_id}/set-primary/
   - PATCH /products/{id}/images/reorder/
   - GET /images/{id}/download/
   - POST /images/{id}/optimize/
   - DELETE /products/{id}/images/cleanup/
6. **Bulk Upload:** Accept multiple files in single request
7. **Reorder Format:** {"order": [3, 1, 2, 5, 4]}
8. **Permissions:** Require manage_products permission
9. **Cleanup:** Remove orphaned files not in database
10. **Next Group:** Testing & Documentation (Group F)
