# Group F: Testing & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** F of F  
> **Tasks Covered:** 79-86  
> **Group Goal:** Comprehensive testing and documentation for media system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Media-Serializers-API-Views](../Group-E_Media-Serializers-API-Views/)
- **→ Next SubPhase:** [SubPhase-08_Warehouse-Locations](../../SubPhase-08_Warehouse-Locations/)

---

## Group Overview

### Key Outcomes
- ProductImage model tests (creation, is_primary, ordering)
- Image processing tests (resize, thumbnail, WebP)
- Variant image tests (inheritance, gallery methods)
- Upload endpoint tests (single, bulk, validation, errors)
- API endpoint tests (all ViewSet actions with auth)
- Image optimization tests (WebP, compression, savings)
- Media module documentation (models, services, endpoints)
- Media management guide (user-facing instructions)

### Technology Context
- **Testing:** pytest with Django fixtures
- **Factory:** Factory Boy with image file generation
- **Coverage:** Aim for 90%+ coverage
- **Documentation:** Markdown with examples

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-79-82_Model-Processing-Upload-Tests.md | 79-82 | Model, processing, variant, upload tests |
| 02 | 02_Tasks-83-86_API-Optimization-Docs.md | 83-86 | API tests, optimization tests, documentation, guide |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create ProductImage model tests | High | 30 min |
| 80 | Create image processing tests | High | 35 min |
| 81 | Create variant image tests | High | 30 min |
| 82 | Create upload endpoint tests | High | 35 min |
| 83 | Create API endpoint tests | High | 30 min |
| 84 | Create image optimization tests | Medium | 25 min |
| 85 | Write media module documentation | Medium | 40 min |
| 86 | Create media management guide | Medium | 35 min |

---

## Execution Order

```
Tasks 79-82: Unit & Upload Tests
    │ (ProductImage, processing, variant, upload)
    ▼
Tasks 83-84: API & Optimization Tests
    │ (endpoints, optimization)
    ▼
Tasks 85-86: Documentation
    │ (module docs, user guide)
```

---

## Expected Deliverables

```
backend/apps/products/media/
├── tests/
│   ├── __init__.py (NEW)
│   ├── test_models.py (NEW)
│   ├── test_processing.py (NEW)
│   ├── test_variant_images.py (NEW)
│   ├── test_upload.py (NEW)
│   ├── test_api.py (NEW)
│   ├── test_optimization.py (NEW)
│   └── factories/
│       └── image_factories.py (NEW)
└── docs/
    ├── media_module.md (NEW)
    └── media_guide.md (NEW)
```

---

## Notes for AI Agents

1. **Model Tests:**
   - Create ProductImage with all fields
   - Test is_primary constraint (only one per product)
   - Test display_order ordering
   - Test dimension and file_size extraction
2. **Processing Tests:**
   - Test resize_to_fit maintains aspect ratio
   - Test resize_to_cover crops correctly
   - Test thumbnail generation (150×150)
   - Test WebP conversion
   - Test EXIF orientation fix
3. **Variant Image Tests:**
   - Test VariantImage creation
   - Test inheritance logic (fallback to product)
   - Test get_variant_images method
4. **Upload Tests:**
   - Test single file upload
   - Test bulk file upload
   - Test file type validation
   - Test file size validation
   - Test dimension validation
5. **API Tests:**
   - Test all CRUD operations
   - Test set-primary endpoint
   - Test reorder endpoint
   - Test permission enforcement
6. **Optimization Tests:**
   - Test WebP size savings
   - Test compression ratios
   - Test batch optimization command
7. **Documentation:**
   - All models with field descriptions
   - Image processing pipeline
   - API endpoints with examples
8. **User Guide:**
   - How to upload images
   - How to manage gallery
   - Optimization best practices
9. **SubPhase Complete:** Ready for Warehouse & Locations (SubPhase-08)
