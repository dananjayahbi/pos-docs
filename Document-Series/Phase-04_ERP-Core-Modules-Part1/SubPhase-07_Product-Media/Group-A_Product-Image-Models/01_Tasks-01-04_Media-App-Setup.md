# Tasks 01-04: Media App Setup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** A - Product Image Models  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-05-09_ProductImage-Model.md](02_Tasks-05-09_ProductImage-Model.md)

---

## Document Overview

This document covers the foundational setup for the product media module. It establishes the app structure within the products application, defines image size constants for multi-resolution support, specifies allowed image formats, and creates tenant-aware file upload path functions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create media app structure | Low |
| 02 | Define image size constants | Low |
| 03 | Define allowed image formats | Low |
| 04 | Create image upload path function | Low |

---

## Task 01: Create Media App Structure

### Overview
Initialize the media module within the products app to organize image-related models, services, and utilities. This creates a clean separation of concerns for product image management.

### Dependencies
- Phase-03 SubPhase-01: Django Apps Structure (products app exists)
- Phase-03 SubPhase-10: File Storage Configuration (TenantAwareStorage)

### Instructions

1. **Create media module directory**
   - Navigate to `backend/apps/products/`
   - Create new directory named `media/`
   - This will contain all image-related functionality

2. **Create module initialization file**
   - Create `__init__.py` in `media/` directory
   - Leave it empty for now (package marker)

3. **Create media app configuration**
   - Create `apps.py` in `media/` directory
   - Define `MediaConfig` class inheriting from `AppConfig`
   - Set `name` to `apps.products.media`
   - Set `label` to `products_media`
   - Set `default_auto_field` to `django.db.models.BigAutoField`
   - Define `ready()` method to import signals (will be added later)

4. **Create models subdirectory**
   - Create `models/` directory inside `media/`
   - Create `__init__.py` in `models/` directory
   - This will organize model files

5. **Create services subdirectory**
   - Create `services/` directory inside `media/`
   - Create `__init__.py` in `services/` directory
   - This will contain image processing services

6. **Create managers subdirectory**
   - Create `managers/` directory inside `media/`
   - Create `__init__.py` in `managers/` directory
   - This will contain custom model managers

7. **Create tasks subdirectory**
   - Create `tasks/` directory inside `media/`
   - Create `__init__.py` in `tasks/` directory
   - This will contain Celery tasks for async processing

8. **Register media config (optional)**
   - If needed, add `apps.products.media` to `INSTALLED_APPS` in settings
   - Or let it be part of products app without separate registration

### Expected Directory Structure
```
backend/apps/products/
├── media/                          # NEW
│   ├── __init__.py                 # NEW
│   ├── apps.py                     # NEW
│   ├── models/                     # NEW
│   │   └── __init__.py             # NEW
│   ├── services/                   # NEW
│   │   └── __init__.py             # NEW
│   ├── managers/                   # NEW
│   │   └── __init__.py             # NEW
│   └── tasks/                      # NEW
│       └── __init__.py             # NEW
```

### Verification Checklist
- [ ] `media/` directory exists under `apps/products/`
- [ ] `apps.py` with MediaConfig exists
- [ ] `models/`, `services/`, `managers/`, `tasks/` subdirectories created
- [ ] All subdirectories have `__init__.py` files
- [ ] Module structure follows Django conventions

---

## Task 02: Define Image Size Constants

### Overview
Define standard image size constants for consistent thumbnail, medium, and large image generation across the application. These sizes optimize for different use cases (list views, product cards, detail pages).

### Dependencies
- Task 01: Create media app structure

### Instructions

1. **Create constants file**
   - Create `constants.py` in `backend/apps/products/media/`
   - Add module docstring explaining the purpose

2. **Define thumbnail size constant**
   - Create constant `THUMBNAIL_SIZE` with value `(150, 150)`
   - Add comment: "For list views, cart items, search results"
   - This is a square thumbnail for consistent display

3. **Define medium size constant**
   - Create constant `MEDIUM_SIZE` with value `(500, 500)`
   - Add comment: "For product cards, category pages"
   - This size balances quality and performance

4. **Define large size constant**
   - Create constant `LARGE_SIZE` with value `(1000, 1000)`
   - Add comment: "For product detail page, zoom functionality"
   - High quality for detailed viewing

5. **Define all sizes list**
   - Create constant `ALL_SIZES` as a list containing all size tuples
   - Include: THUMBNAIL_SIZE, MEDIUM_SIZE, LARGE_SIZE
   - Useful for batch processing operations

6. **Define size names mapping**
   - Create dictionary `SIZE_NAMES` mapping sizes to human-readable names
   - Map THUMBNAIL_SIZE to "thumbnail"
   - Map MEDIUM_SIZE to "medium"
   - Map LARGE_SIZE to "large"

7. **Define max original dimension**
   - Create constant `MAX_ORIGINAL_WIDTH` with value `4000`
   - Create constant `MAX_ORIGINAL_HEIGHT` with value `4000`
   - Prevents excessively large uploads

8. **Define min dimension requirement**
   - Create constant `MIN_WIDTH` with value `100`
   - Create constant `MIN_HEIGHT` with value `100`
   - Ensures images have minimum acceptable quality

9. **Define max file size**
   - Create constant `MAX_FILE_SIZE` with value `5 * 1024 * 1024` (5MB)
   - Add comment explaining the calculation (5 megabytes in bytes)

### Size Specification Table

| Constant | Dimensions | Use Case | Target Device |
|----------|-----------|----------|---------------|
| THUMBNAIL_SIZE | 150×150 | List views, cart | Mobile lists |
| MEDIUM_SIZE | 500×500 | Product cards | Mobile/tablet cards |
| LARGE_SIZE | 1000×1000 | Detail view | Desktop detail page |
| Original | Up to 4000×4000 | Admin, download | High-res storage |

### Image Quality vs Performance

| Size | File Size (approx) | Load Time (4G) | Use Case Priority |
|------|-------------------|----------------|-------------------|
| Thumbnail | 10-20 KB | < 0.1s | Speed |
| Medium | 40-80 KB | < 0.3s | Balance |
| Large | 100-200 KB | < 0.7s | Quality |

### Expected Outcome
```
backend/apps/products/media/
├── __init__.py
├── apps.py
├── constants.py                    # NEW (size constants)
├── models/
├── services/
├── managers/
└── tasks/
```

### Verification Checklist
- [ ] `constants.py` file created
- [ ] THUMBNAIL_SIZE, MEDIUM_SIZE, LARGE_SIZE defined
- [ ] ALL_SIZES list created
- [ ] SIZE_NAMES mapping defined
- [ ] MAX_ORIGINAL_WIDTH/HEIGHT defined (4000)
- [ ] MIN_WIDTH/HEIGHT defined (100)
- [ ] MAX_FILE_SIZE defined (5MB)
- [ ] Comments explain each constant's purpose

---

## Task 03: Define Allowed Image Formats

### Overview
Define allowed image format constants to validate uploads and ensure only supported image types are processed. This protects against unsupported formats and potential security issues.

### Dependencies
- Task 02: Define image size constants

### Instructions

1. **Add format constants to constants.py**
   - Open `backend/apps/products/media/constants.py`
   - Add format-related constants below size constants

2. **Define allowed MIME types**
   - Create constant `ALLOWED_MIME_TYPES` as a tuple
   - Include: `'image/jpeg'`
   - Include: `'image/jpg'`
   - Include: `'image/png'`
   - Include: `'image/webp'`
   - Include: `'image/gif'`

3. **Define allowed file extensions**
   - Create constant `ALLOWED_EXTENSIONS` as a tuple
   - Include: `'jpg'`
   - Include: `'jpeg'`
   - Include: `'png'`
   - Include: `'webp'`
   - Include: `'gif'`
   - All lowercase for consistency

4. **Define format descriptions**
   - Create dictionary `FORMAT_DESCRIPTIONS` mapping extensions to descriptions
   - Map 'jpg'/'jpeg' to "JPEG (lossy compression, best for photos)"
   - Map 'png' to "PNG (lossless compression, supports transparency)"
   - Map 'webp' to "WebP (modern format, smaller size)"
   - Map 'gif' to "GIF (animated images, limited colors)"

5. **Define preferred format order**
   - Create constant `PREFERRED_FORMATS` as ordered tuple
   - Order: `('webp', 'jpg', 'png', 'gif')`
   - WebP preferred for smallest size, best compression

6. **Define format-specific settings**
   - Create constant `JPEG_QUALITY` with value `80`
   - Add comment: "Balance of quality and file size"
   - Create constant `PNG_COMPRESSION_LEVEL` with value `6`
   - Add comment: "0 (no compression) to 9 (max compression)"
   - Create constant `WEBP_QUALITY` with value `85`
   - Add comment: "Higher than JPEG for better quality"

7. **Define animated GIF handling**
   - Create constant `ALLOW_ANIMATED_GIF` with value `False`
   - Add comment: "Set to True to allow animated GIFs (only first frame processed)"
   - Animated GIFs can cause processing complexity

8. **Define GIF to video conversion flag**
   - Create constant `CONVERT_GIF_TO_VIDEO` with value `False`
   - Add comment: "Future feature: convert GIF to MP4 for better compression"

### Format Comparison Table

| Format | Transparency | Animation | Compression | Best For |
|--------|--------------|-----------|-------------|----------|
| JPEG | No | No | Lossy | Photographs, complex images |
| PNG | Yes | No | Lossless | Logos, text, simple graphics |
| WebP | Yes | Yes | Both | All use cases (modern browsers) |
| GIF | Yes | Yes | Lossless | Legacy animation (not recommended) |

### Browser Support Considerations

| Format | Chrome | Firefox | Safari | Edge | IE11 |
|--------|--------|---------|--------|------|------|
| JPEG | ✅ | ✅ | ✅ | ✅ | ✅ |
| PNG | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebP | ✅ | ✅ | ✅ (14+) | ✅ | ❌ |
| GIF | ✅ | ✅ | ✅ | ✅ | ✅ |

### Expected Outcome
```
backend/apps/products/media/
├── __init__.py
├── apps.py
├── constants.py                    # UPDATED (format constants added)
├── models/
├── services/
├── managers/
└── tasks/
```

### Verification Checklist
- [ ] ALLOWED_MIME_TYPES tuple defined
- [ ] ALLOWED_EXTENSIONS tuple defined
- [ ] FORMAT_DESCRIPTIONS dictionary created
- [ ] PREFERRED_FORMATS order defined
- [ ] JPEG_QUALITY set to 80
- [ ] PNG_COMPRESSION_LEVEL set to 6
- [ ] WEBP_QUALITY set to 85
- [ ] ALLOW_ANIMATED_GIF flag defined
- [ ] All constants have explanatory comments

---

## Task 04: Create Image Upload Path Function

### Overview
Create a function that generates tenant-aware upload paths for product images. This ensures proper file organization and tenant isolation in the storage system.

### Dependencies
- Task 01: Create media app structure
- Phase-03 SubPhase-10: File Storage Configuration (TenantAwareStorage)

### Instructions

1. **Create utils file**
   - Create `utils.py` in `backend/apps/products/media/`
   - Add module docstring

2. **Import required modules**
   - Import `os` for path manipulation
   - Import `uuid` for unique filename generation
   - Import `connection` from `django.db` for tenant schema access

3. **Define upload path function**
   - Create function `product_image_upload_path(instance, filename)`
   - Accept `instance` parameter (ProductImage model instance)
   - Accept `filename` parameter (original uploaded filename)
   - Return complete upload path as string

4. **Extract file extension**
   - Get file extension from filename using `os.path.splitext()`
   - Store extension in lowercase for consistency
   - Handle files without extensions gracefully

5. **Generate unique filename**
   - Use `uuid.uuid4()` to generate unique identifier
   - Combine with original extension
   - Format: `{uuid}{extension}` (e.g., "a1b2c3d4.jpg")

6. **Get tenant schema**
   - Access `connection.schema_name` to get current tenant
   - This provides the tenant identifier for path isolation

7. **Get product ID**
   - Access `instance.product.id` to get associated product
   - Handle case where product might not be set yet (return temporary path)

8. **Construct upload path**
   - Build path: `tenants/{schema}/products/{product_id}/{unique_filename}`
   - Use forward slashes for cross-platform compatibility
   - Example: `tenants/acme_corp/products/123/a1b2c3d4.jpg`

9. **Handle missing product gracefully**
   - If product not yet associated, use temporary path
   - Path: `tenants/{schema}/products/temp/{unique_filename}`
   - Add comment explaining this is for upload before product association

10. **Add variant-aware path function**
    - Create function `variant_image_upload_path(instance, filename)`
    - Similar to product path but includes variant ID
    - Path: `tenants/{schema}/products/{product_id}/variants/{variant_id}/{unique_filename}`
    - Will be used for VariantImage model (Task 33)

### Path Structure Diagram

```
media/
└── tenants/
    ├── tenant_alpha/
    │   └── products/
    │       ├── 1/
    │       │   ├── 8f7e6d5c.jpg
    │       │   └── 9a8b7c6d.png
    │       └── 2/
    │           └── 1a2b3c4d.jpg
    └── tenant_beta/
        └── products/
            └── 1/
                └── 5e4d3c2b.jpg
```

### Tenant Isolation Benefits

| Benefit | Description |
|---------|-------------|
| **Security** | Tenants cannot access other tenants' files |
| **Organization** | Clear structure for file management |
| **Backup** | Easy to backup tenant-specific data |
| **Deletion** | Simple to remove tenant data completely |
| **Debugging** | Easy to locate specific tenant files |

### Expected Outcome
```
backend/apps/products/media/
├── __init__.py
├── apps.py
├── constants.py
├── utils.py                        # NEW (upload path functions)
├── models/
├── services/
├── managers/
└── tasks/
```

### Verification Checklist
- [ ] `utils.py` file created
- [ ] `product_image_upload_path()` function defined
- [ ] Function accepts instance and filename parameters
- [ ] UUID used for unique filename generation
- [ ] Tenant schema included in path
- [ ] Product ID included in path
- [ ] Missing product case handled (temp path)
- [ ] `variant_image_upload_path()` function defined
- [ ] Path format: `tenants/{schema}/products/{id}/{filename}`
- [ ] Functions have docstrings explaining purpose

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create media app structure | Module directories and structure |
| 02 | Define image size constants | THUMBNAIL, MEDIUM, LARGE sizes |
| 03 | Define allowed image formats | JPEG, PNG, WebP, GIF validation |
| 04 | Create image upload path function | Tenant-aware path generation |

### Files Created
```
backend/apps/products/media/
├── __init__.py                     # Module marker
├── apps.py                         # MediaConfig
├── constants.py                    # Size and format constants
├── utils.py                        # Upload path functions
├── models/
│   └── __init__.py
├── services/
│   └── __init__.py
├── managers/
│   └── __init__.py
└── tasks/
    └── __init__.py
```

### Key Constants Defined
- **Sizes:** THUMBNAIL_SIZE (150×150), MEDIUM_SIZE (500×500), LARGE_SIZE (1000×1000)
- **Limits:** MAX_FILE_SIZE (5MB), MIN dimensions (100×100), MAX dimensions (4000×4000)
- **Formats:** JPEG, PNG, WebP, GIF
- **Quality:** JPEG (80), PNG (6), WebP (85)

### Next Steps
Proceed to [02_Tasks-05-09_ProductImage-Model.md](02_Tasks-05-09_ProductImage-Model.md) to create the core ProductImage model with metadata and dimension tracking.

---

## Notes for AI Agents

1. **Module Structure:** Media is a submodule of products, not a standalone app
2. **Tenant Awareness:** All paths must include tenant schema for isolation
3. **UUID Filenames:** Prevent filename collisions and obfuscate original names
4. **Size Standards:** Three standard sizes cover all use cases (mobile to desktop)
5. **Format Support:** WebP preferred for web delivery, fallback to JPEG/PNG
6. **Max File Size:** 5MB limit prevents excessive storage and memory usage
7. **Path Format:** `tenants/{schema}/products/{id}/{uuid}{ext}`
8. **Extension Safety:** Always validate and normalize file extensions
9. **No Code:** This document provides instructions only, not implementation
10. **Next Document:** ProductImage model definition (Tasks 05-09)
