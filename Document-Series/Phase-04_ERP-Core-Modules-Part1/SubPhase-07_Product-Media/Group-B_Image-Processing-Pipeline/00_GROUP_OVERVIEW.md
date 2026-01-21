# Group B: Image Processing Pipeline

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement automatic image resizing and processing on upload

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Product-Image-Models](../Group-A_Product-Image-Models/)
- **→ Next Group:** [Group-C_Variant-Images-Gallery](../Group-C_Variant-Images-Gallery/)

---

## Group Overview

### Key Outcomes
- Pillow dependency installation
- ImageProcessor service class
- resize_to_fit method (maintain aspect ratio)
- resize_to_cover method (crop to exact dimensions)
- Thumbnail, medium, large image generation
- ImageVariant model for storing variant paths
- Post-save signal for async variant generation
- Celery task for image processing
- Processing status field (PENDING, PROCESSING, COMPLETED, FAILED)
- EXIF orientation fix
- EXIF data stripping for privacy
- Image quality settings (JPEG 80%, PNG compression)
- Error handling for corrupt files
- Image cleanup utility for deleted originals

### Technology Context
- **Library:** Pillow for image manipulation
- **Async:** Celery for background processing
- **Sizes:** Thumbnail (150×150), Medium (500×500), Large (1000×1000)
- **Quality:** JPEG 80%, PNG compression level 6

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-17-23_ImageProcessor-Service.md | 17-23 | Pillow, ImageProcessor, resize methods, size generation |
| 02 | 02_Tasks-24-28_ImageVariant-Async.md | 24-28 | ImageVariant model, post-save, Celery task, status, orientation |
| 03 | 03_Tasks-29-32_Quality-Errors-Cleanup.md | 29-32 | EXIF stripping, quality settings, error handling, cleanup |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Install Pillow dependency | Low | 10 min |
| 18 | Create ImageProcessor service | High | 30 min |
| 19 | Implement resize_to_fit method | Medium | 25 min |
| 20 | Implement resize_to_cover method | Medium | 25 min |
| 21 | Implement create_thumbnail method | Low | 20 min |
| 22 | Implement create_medium method | Low | 20 min |
| 23 | Implement create_large method | Low | 20 min |
| 24 | Create ImageVariant model | Medium | 25 min |
| 25 | Add variant generation on save | High | 30 min |
| 26 | Create Celery task for processing | High | 30 min |
| 27 | Add processing status field | Low | 15 min |
| 28 | Implement image orientation fix | Medium | 25 min |
| 29 | Add EXIF data stripping | Low | 20 min |
| 30 | Create image quality settings | Low | 15 min |
| 31 | Add image processing error handling | Medium | 25 min |
| 32 | Create image cleanup utility | Low | 20 min |

---

## Execution Order

```
Task 17: Install Pillow dependency
    │
    ▼
Tasks 18-23: ImageProcessor Service
    │ (service class, resize_to_fit, resize_to_cover,
    │  thumbnail, medium, large)
    ▼
Tasks 24-28: ImageVariant & Async
    │ (model, post-save signal, Celery task,
    │  status field, orientation fix)
    ▼
Tasks 29-32: Quality & Cleanup
    │ (EXIF stripping, quality settings,
    │  error handling, cleanup utility)
```

---

## Expected Deliverables

```
backend/apps/products/media/
├── models/
│   ├── __init__.py (updated)
│   └── image_variant.py (NEW)
├── services/
│   ├── __init__.py (NEW)
│   └── image_processor.py (NEW)
├── tasks/
│   ├── __init__.py (NEW)
│   └── process_image.py (NEW)
└── utils.py (updated - cleanup)
```

---

## Notes for AI Agents

1. **resize_to_fit:** Fit within max dimensions, maintain aspect ratio
2. **resize_to_cover:** Cover exact dimensions, crop if needed
3. **ImageVariant Fields:** thumbnail_path, medium_path, large_path
4. **Processing Status:**
   - PENDING: Waiting in queue
   - PROCESSING: Currently being processed
   - COMPLETED: All variants generated
   - FAILED: Error occurred
5. **EXIF Orientation:** Auto-rotate based on Orientation tag
6. **EXIF Stripping:** Remove GPS, camera info for privacy
7. **Quality Settings:**
   - JPEG: quality=80
   - PNG: optimize=True, compress_level=6
8. **Error Handling:** Log errors, set status=FAILED
9. **Cleanup:** Delete all variants when original deleted
10. **Next Group:** Variant Images & Gallery (Group C)
