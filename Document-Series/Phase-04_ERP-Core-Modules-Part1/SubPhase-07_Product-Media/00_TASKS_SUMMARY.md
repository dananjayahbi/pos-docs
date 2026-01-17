# SubPhase-07: Product Media - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 of 10  
> **SubPhase Goal:** Implement comprehensive product image and media management system  
> **Total Tasks:** 86 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-04 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06: Product Pricing](../SubPhase-06_Product-Pricing/)
- **→ Next SubPhase:** [SubPhase-08: Warehouse & Locations](../SubPhase-08_Warehouse-Locations/)

---

## SubPhase Overview

This sub-phase implements the complete media management system for products in LankaCommerce Cloud. The system supports multiple images per product/variant with automatic resizing, WebP conversion for optimized web delivery, gallery ordering, and tenant-isolated storage. All media operations integrate with the file storage configuration from Phase-03.

### Key Outcomes
- ProductImage model with gallery support and ordering
- VariantImage model for variant-specific images
- Automatic image processing pipeline (resize, WebP conversion)
- Primary image designation for products and variants
- SEO-friendly alt text and metadata storage
- Thumbnail generation for list views
- Tenant-isolated media storage paths

### Dependencies
- SubPhase-03: Product Base Model (Product FK)
- SubPhase-04: Product Variants (Variant FK)
- Phase-03 SubPhase-10: File Storage Configuration (TenantAwareStorage)

---

## Execution Flow Diagram

```
[Group A: Product Image Models]
         │
         ▼
[Group B: Image Processing Pipeline]
         │
         ▼
[Group C: Variant Images & Gallery]
         │
         ▼
[Group D: WebP Conversion & Optimization]
         │
         ▼
[Group E: Media Serializers & API Views]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Product Image Models (Tasks 01-16)

Core models for product image storage and metadata.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create media app structure | Initialize `apps/products/media/` module with __init__, apps.py configuration | 15 min |
| 02 | Define image size constants | Create constants for THUMBNAIL (150×150), MEDIUM (500×500), LARGE (1000×1000) | 10 min |
| 03 | Define allowed image formats | Create constants for allowed formats: JPEG, PNG, WebP, GIF (static) | 10 min |
| 04 | Create image upload path function | Define tenant-aware upload path: `tenants/{schema}/products/{product_id}/` | 20 min |
| 05 | Create ProductImage model | Define model with product FK, image field, display_order, is_primary fields | 30 min |
| 06 | Add image metadata fields | Add alt_text, title, caption fields for SEO and accessibility | 20 min |
| 07 | Add image dimension fields | Add width, height fields populated on save | 15 min |
| 08 | Add file size tracking | Add file_size field (bytes) populated on save | 15 min |
| 09 | Create ProductImage Meta class | Define db_table, indexes on product, ordering by display_order | 15 min |
| 10 | Add ProductImage manager | Create manager with get_primary(), get_gallery() methods | 25 min |
| 11 | Create is_primary constraint | Ensure only one image per product can be is_primary=True | 25 min |
| 12 | Add set_as_primary method | Method to set image as primary and unset others for same product | 20 min |
| 13 | Create image validation | Validate file type, max file size (5MB), min/max dimensions | 25 min |
| 14 | Add original_filename field | Store original filename before renaming for reference | 10 min |
| 15 | Create ProductImage signals | Pre-save signal to extract dimensions and file size | 25 min |
| 16 | Create ProductImage admin | Register admin with image preview, list display, filters | 25 min |

---

### Group B: Image Processing Pipeline (Tasks 17-32)

Automatic image resizing and processing on upload.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 17 | Install Pillow dependency | Add Pillow to requirements for image processing | 10 min |
| 18 | Create ImageProcessor service | Build service class for all image processing operations | 30 min |
| 19 | Implement resize_to_fit method | Resize image to fit within max dimensions while maintaining aspect ratio | 25 min |
| 20 | Implement resize_to_cover method | Resize image to cover exact dimensions with cropping if needed | 25 min |
| 21 | Implement create_thumbnail method | Generate 150×150 thumbnail from original image | 20 min |
| 22 | Implement create_medium method | Generate 500×500 medium image from original | 20 min |
| 23 | Implement create_large method | Generate 1000×1000 large image from original | 20 min |
| 24 | Create ImageVariant model | Store paths to generated size variants (thumbnail_path, medium_path, large_path) | 25 min |
| 25 | Add variant generation on save | Post-save signal to generate all image variants asynchronously | 30 min |
| 26 | Create Celery task for processing | Async task to process image variants without blocking upload | 30 min |
| 27 | Add processing status field | Add status field: PENDING, PROCESSING, COMPLETED, FAILED | 15 min |
| 28 | Implement image orientation fix | Auto-rotate images based on EXIF orientation data | 25 min |
| 29 | Add EXIF data stripping | Remove sensitive EXIF data (GPS, camera info) for privacy | 20 min |
| 30 | Create image quality settings | Configure JPEG quality (80%), PNG compression level | 15 min |
| 31 | Add image processing error handling | Handle corrupt files, unsupported formats gracefully | 25 min |
| 32 | Create image cleanup utility | Delete all variants when original is deleted | 20 min |

---

### Group C: Variant Images & Gallery (Tasks 33-48)

Variant-specific images and gallery management.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 33 | Create VariantImage model | Define model with variant FK, image field, display_order, is_primary | 30 min |
| 34 | Add variant image metadata | Add alt_text, title for variant-specific images | 15 min |
| 35 | Create variant image upload path | Define path: `tenants/{schema}/products/{product_id}/variants/{variant_id}/` | 20 min |
| 36 | Add variant image manager | Create manager with get_primary(), get_gallery() for variants | 25 min |
| 37 | Create variant image signals | Signals for dimension extraction and variant processing | 25 min |
| 38 | Add image inheritance logic | Variant uses product images if no variant-specific images | 20 min |
| 39 | Create get_variant_images method | Return variant images or fallback to product images | 20 min |
| 40 | Create ProductGallery service | Unified service to manage product/variant image galleries | 30 min |
| 41 | Add reorder_gallery method | Reorder images by updating display_order field | 20 min |
| 42 | Create bulk upload handler | Handle multiple image upload in single request | 30 min |
| 43 | Add image swap functionality | Swap display_order between two images | 15 min |
| 44 | Create image copy to variant | Copy product image to variant with new file | 25 min |
| 45 | Add gallery limit configuration | Tenant-configurable max images per product (default: 10) | 20 min |
| 46 | Create gallery position validation | Ensure display_order is unique within product/variant | 20 min |
| 47 | Add VariantImage admin | Admin with image preview, inline within variant admin | 25 min |
| 48 | Create image drag-drop reordering | Frontend-ready endpoint for drag-drop reorder updates | 25 min |

---

### Group D: WebP Conversion & Optimization (Tasks 49-64)

WebP format conversion and image optimization for web.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 49 | Create WebP converter service | Build service to convert images to WebP format | 30 min |
| 50 | Implement lossless WebP conversion | Convert PNG images to lossless WebP | 20 min |
| 51 | Implement lossy WebP conversion | Convert JPEG images to lossy WebP with quality setting | 20 min |
| 52 | Add WebP paths to ImageVariant | Store webp_thumbnail, webp_medium, webp_large paths | 15 min |
| 53 | Create WebP fallback logic | Serve original format for browsers without WebP support | 25 min |
| 54 | Add browser detection helper | Detect WebP support via Accept header | 15 min |
| 55 | Create responsive image service | Service to return appropriate image size based on viewport | 25 min |
| 56 | Implement srcset generation | Generate srcset string for responsive images | 20 min |
| 57 | Add image lazy loading support | Return data attributes for frontend lazy loading | 15 min |
| 58 | Create image CDN URL generation | Generate CDN URLs if CDN is configured | 25 min |
| 59 | Add placeholder generation | Generate blur placeholder (LQIP) for progressive loading | 30 min |
| 60 | Create image compression analyzer | Report compression ratio and size savings | 20 min |
| 61 | Add batch optimization command | Management command to optimize existing images | 30 min |
| 62 | Create image format migration | Migrate existing JPEG/PNG to WebP in background | 30 min |
| 63 | Add optimization report | Generate report of storage saved by WebP conversion | 20 min |
| 64 | Create cache headers utility | Set appropriate cache headers for image responses | 20 min |

---

### Group E: Media Serializers & API Views (Tasks 65-78)

DRF serializers and viewsets for media management.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 65 | Create ProductImageSerializer | Serializer with image URL, all size variant URLs | 25 min |
| 66 | Add responsive image fields | SerializerMethodField for srcset, sizes attributes | 20 min |
| 67 | Create VariantImageSerializer | Serializer for variant images with inheritance | 25 min |
| 68 | Create ImageUploadSerializer | Write serializer for image upload with validation | 25 min |
| 69 | Create ImageReorderSerializer | Serializer for gallery reorder operations | 15 min |
| 70 | Create ProductImageViewSet | ModelViewSet for product image CRUD operations | 30 min |
| 71 | Add image upload endpoint | POST /products/{id}/images/ for single/bulk upload | 25 min |
| 72 | Add set primary endpoint | POST /products/{id}/images/{img_id}/set-primary/ | 20 min |
| 73 | Add reorder endpoint | PATCH /products/{id}/images/reorder/ with ordered IDs | 20 min |
| 74 | Create VariantImageViewSet | ViewSet for variant image management | 25 min |
| 75 | Add image download endpoint | GET /images/{id}/download/ for original file | 20 min |
| 76 | Add image optimization endpoint | POST /images/{id}/optimize/ to trigger re-optimization | 20 min |
| 77 | Create media cleanup endpoint | DELETE /products/{id}/images/cleanup/ for orphan removal | 20 min |
| 78 | Add image permissions | Ensure upload/delete restricted to authorized users | 20 min |

---

### Group F: Testing & Documentation (Tasks 79-86)

Comprehensive testing and documentation for media system.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 79 | Create ProductImage model tests | Test model creation, is_primary constraint, ordering | 30 min |
| 80 | Create image processing tests | Test resize, thumbnail generation, WebP conversion | 35 min |
| 81 | Create variant image tests | Test variant images, inheritance, gallery methods | 30 min |
| 82 | Create upload endpoint tests | Test single/bulk upload, validation, error handling | 35 min |
| 83 | Create API endpoint tests | Test all ViewSet actions with authentication | 30 min |
| 84 | Create image optimization tests | Test WebP conversion, compression, size savings | 25 min |
| 85 | Write media module documentation | Document all models, services, API endpoints | 40 min |
| 86 | Create media management guide | User guide for image upload, gallery management, optimization | 35 min |

---

## Expected File Structure

```
apps/products/media/
├── __init__.py
├── apps.py
├── models/
│   ├── __init__.py
│   ├── product_image.py          # Tasks 05-16
│   ├── variant_image.py          # Tasks 33-37
│   └── image_variant.py          # Task 24
├── services/
│   ├── __init__.py
│   ├── image_processor.py        # Tasks 18-23, 28-31
│   ├── webp_converter.py         # Tasks 49-52
│   ├── responsive_image.py       # Tasks 55-58
│   ├── gallery_manager.py        # Tasks 40-46
│   └── cdn_integration.py        # Task 58
├── serializers/
│   ├── __init__.py
│   ├── product_image.py          # Tasks 65-66
│   ├── variant_image.py          # Task 67
│   └── upload.py                 # Tasks 68-69
├── views/
│   ├── __init__.py
│   ├── product_image.py          # Tasks 70-73
│   └── variant_image.py          # Task 74
├── tasks/
│   ├── __init__.py
│   ├── process_image.py          # Task 26
│   └── optimize_images.py        # Task 62
├── admin.py                      # Tasks 16, 47
├── urls.py
├── constants.py                  # Tasks 02-03
├── validators.py                 # Task 13
└── utils.py                      # Tasks 04, 32, 64
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Product Image Models | 16 | 0 | 🔴 Not Started |
| B | Image Processing Pipeline | 16 | 0 | 🔴 Not Started |
| C | Variant Images & Gallery | 16 | 0 | 🔴 Not Started |
| D | WebP Conversion & Optimization | 16 | 0 | 🔴 Not Started |
| E | Media Serializers & API Views | 14 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 8 | 0 | 🔴 Not Started |
| **Total** | | **86** | **0** | 🔴 |

---

## Notes for AI Agents

### Image Size Specifications
| Size | Dimensions | Use Case |
|------|------------|----------|
| Thumbnail | 150×150 | List views, cart items, search results |
| Medium | 500×500 | Product cards, category pages |
| Large | 1000×1000 | Product detail page, zoom |
| Original | Preserved | Admin, download, source |

### Tenant-Isolated Storage Paths
```
media/
└── tenants/
    └── {tenant_schema}/
        └── products/
            └── {product_id}/
                ├── original/
                │   └── image-001.jpg
                ├── thumbnail/
                │   └── image-001.jpg
                ├── medium/
                │   └── image-001.jpg
                ├── large/
                │   └── image-001.jpg
                ├── webp/
                │   ├── image-001-thumbnail.webp
                │   ├── image-001-medium.webp
                │   └── image-001-large.webp
                └── variants/
                    └── {variant_id}/
                        └── (same structure)
```

### Image Processing Flow
```
Upload Request
      │
      ▼
┌─────────────┐
│  Validate   │ ← Check type, size, dimensions
└─────────────┘
      │
      ▼
┌─────────────┐
│ Save to     │ ← Store original in tenant folder
│ Original    │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Queue Task  │ ← Celery async processing
└─────────────┘
      │
      ▼
┌─────────────┐
│ Generate    │ ← Thumbnail, Medium, Large
│ Variants    │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Convert to  │ ← Create WebP versions
│ WebP        │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Update DB   │ ← Store all paths, set COMPLETED
└─────────────┘
```

### Image Validation Rules
- **Max file size:** 5MB
- **Allowed formats:** JPEG, PNG, WebP, GIF (static only)
- **Min dimensions:** 100×100 pixels
- **Max dimensions:** 4000×4000 pixels
- **Aspect ratio:** No restriction (will be cropped for thumbnails)

### is_primary Constraint Logic
```python
# On save, if is_primary=True:
ProductImage.objects.filter(
    product=self.product,
    is_primary=True
).exclude(pk=self.pk).update(is_primary=False)
```

### Gallery Ordering
- display_order starts at 0
- Primary image should have display_order=0
- Reorder updates all affected items in single transaction
- Gap-based ordering (10, 20, 30) for easy insertions

### WebP Support Detection
```python
def supports_webp(request):
    accept = request.headers.get('Accept', '')
    return 'image/webp' in accept
```

### Responsive Image srcset Format
```html
<img src="medium.jpg"
     srcset="thumbnail.jpg 150w,
             medium.jpg 500w,
             large.jpg 1000w"
     sizes="(max-width: 600px) 150px,
            (max-width: 1200px) 500px,
            1000px"
     alt="Product description">
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
