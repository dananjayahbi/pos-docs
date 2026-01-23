# Tasks 65-69: Media Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** E - Media Serializers & API Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 65, 66, 67, 68, 69

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-70-74_ViewSets.md](02_Tasks-70-74_ViewSets.md)

---

## Document Overview

This document covers the creation of Django REST Framework serializers for product and variant images, including responsive image fields, upload serializers, and reorder serializers for comprehensive API support.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 65 | Create ProductImageSerializer | Medium |
| 66 | Add responsive image fields | Low |
| 67 | Create VariantImageSerializer | Medium |
| 68 | Create ImageUploadSerializer | Medium |
| 69 | Create ImageReorderSerializer | Low |

---

## Task 65: Create ProductImageSerializer

### Overview
Create a Django REST Framework serializer for ProductImage model that exposes all relevant fields including image URLs, variant URLs, metadata, and display order for API consumption.

### Dependencies
- Task 05: Create ProductImage model
- Phase-03 SubPhase-02: API Framework Setup (DRF installed)

### Instructions

1. **Create serializers directory structure**
   - Navigate to `backend/apps/products/media/`
   - Create `serializers/` directory
   - Create `__init__.py` in serializers directory

2. **Create product_image.py serializer file**
   - Create file in serializers directory
   - Name: `product_image.py`
   - Add module docstring

3. **Import required modules**
   - Import `serializers` from `rest_framework`
   - Import ProductImage model
   - Import ImageVariant model
   - Import image URL utilities

4. **Define ProductImageSerializer class**
   - Inherit from `serializers.ModelSerializer`
   - Add class docstring

5. **Add URL fields**
   - Add `url` field as SerializerMethodField
   - Method: `get_url(self, obj)` - returns original image URL
   - Add `thumbnail_url` as SerializerMethodField
   - Method: `get_thumbnail_url(self, obj)` - returns thumbnail variant URL
   - Add `medium_url` as SerializerMethodField
   - Method: `get_medium_url(self, obj)` - returns medium variant URL
   - Add `large_url` as SerializerMethodField
   - Method: `get_large_url(self, obj)` - returns large variant URL

6. **Add WebP URL fields**
   - Add `webp_thumbnail_url` as SerializerMethodField
   - Add `webp_medium_url` as SerializerMethodField
   - Add `webp_large_url` as SerializerMethodField
   - Check if WebP variants exist before returning URLs
   - Return None if WebP not available

7. **Add dimension and size fields**
   - Include `width`, `height` from model
   - Add `file_size` field
   - Add `file_size_human` as SerializerMethodField
   - Method converts bytes to KB/MB for display

8. **Add metadata fields**
   - Include `alt_text`, `title`, `caption`
   - Include `display_order`, `is_primary`
   - Include `original_filename`

9. **Add processing status**
   - Check if ImageVariant exists and is processed
   - Add `processing_status` field
   - Return: 'pending', 'processing', 'completed', 'failed'

10. **Define Meta class**
    - Set model = ProductImage
    - Set fields list with all included fields
    - Set read_only_fields for auto-generated data
    - Configure ordering

11. **Add `to_representation` customization**
    - Override to add request context-aware URLs
    - Build absolute URLs if request available
    - Handle WebP based on browser support

12. **Update serializers __init__.py**
    - Import ProductImageSerializer
    - Add to __all__ list

### Serializer Output Example

```json
{
  "id": 123,
  "url": "https://example.com/media/products/123/image.jpg",
  "thumbnail_url": "https://example.com/media/products/123/thumb.jpg",
  "medium_url": "https://example.com/media/products/123/medium.jpg",
  "large_url": "https://example.com/media/products/123/large.jpg",
  "webp_thumbnail_url": "https://example.com/media/products/123/thumb.webp",
  "webp_medium_url": "https://example.com/media/products/123/medium.webp",
  "webp_large_url": "https://example.com/media/products/123/large.webp",
  "width": 1200,
  "height": 1200,
  "file_size": 153600,
  "file_size_human": "150 KB",
  "alt_text": "Product front view",
  "title": "Main product image",
  "caption": "",
  "display_order": 0,
  "is_primary": true,
  "original_filename": "product-photo.jpg",
  "processing_status": "completed",
  "created_at": "2026-01-23T10:00:00Z",
  "updated_at": "2026-01-23T10:05:00Z"
}
```

### Expected Outcome
```
backend/apps/products/media/serializers/
├── __init__.py
└── product_image.py (NEW)

ProductImageSerializer with:
- All image URLs (original + variants)
- WebP URLs
- Metadata fields
- Processing status
- Human-readable file size
```

### Verification Checklist
- [ ] serializers directory created
- [ ] product_image.py file created
- [ ] ProductImageSerializer class defined
- [ ] url, thumbnail_url, medium_url, large_url fields
- [ ] WebP URL fields with availability check
- [ ] file_size_human method formats bytes
- [ ] Metadata fields included (alt_text, title, caption)
- [ ] processing_status field shows variant status
- [ ] Meta class configured properly
- [ ] Serializer imported in __init__.py
- [ ] Output matches expected JSON structure

---

## Task 66: Add Responsive Image Fields

### Overview
Extend ProductImageSerializer with SerializerMethodFields that generate responsive image srcset and sizes attributes, making it easy for frontend to implement responsive images.

### Dependencies
- Task 65: Create ProductImageSerializer
- Task 56: Implement srcset generation

### Instructions

1. **Open product_image.py serializer file**
   - Navigate to ProductImageSerializer class
   - Add new SerializerMethodFields

2. **Import responsive image service**
   - Import ResponsiveImageService from services
   - Import srcset generation utilities

3. **Add srcset field**
   - Add `srcset` as SerializerMethodField
   - Method: `get_srcset(self, obj)`
   - Generate srcset string using ResponsiveImageService
   - Return srcset for original format (JPEG/PNG)

4. **Add webp_srcset field**
   - Add `webp_srcset` as SerializerMethodField
   - Method: `get_webp_srcset(self, obj)`
   - Generate srcset for WebP variants
   - Return None if no WebP available

5. **Add sizes field**
   - Add `sizes` as SerializerMethodField
   - Method: `get_sizes(self, obj)`
   - Return sizes attribute string
   - Default: "(max-width: 600px) 150px, (max-width: 1200px) 500px, 1000px"

6. **Add responsive_urls field**
   - Add `responsive_urls` as SerializerMethodField
   - Method: `get_responsive_urls(self, obj)`
   - Return dictionary with all sizes and formats
   - Structure: `{'thumbnail': {'original': url, 'webp': url}, ...}`

7. **Add picture_element_data field**
   - Add `picture_element_data` as SerializerMethodField
   - Method: `get_picture_element_data(self, obj)`
   - Return complete data for HTML picture element
   - Includes sources for WebP and original format

8. **Add lazy_load_attrs field**
   - Add `lazy_load_attrs` as SerializerMethodField
   - Method: `get_lazy_load_attrs(self, obj)`
   - Return dictionary of lazy loading attributes
   - Includes: loading="lazy", data-src, placeholder

9. **Add placeholder_url field**
   - Add `placeholder_url` as SerializerMethodField
   - Method: `get_placeholder_url(self, obj)`
   - Return data URI for LQIP placeholder
   - From ImageVariant.placeholder_data_uri

10. **Handle browser context**
    - Check if request available in context
    - Detect WebP support from request
    - Adjust returned URLs based on browser capabilities

11. **Update Meta fields list**
    - Add all new responsive fields to fields list
    - Ensure they're exposed in API response

### Responsive Fields Output Example

```json
{
  "id": 123,
  "url": "https://example.com/media/products/123/image.jpg",
  "srcset": "thumb.jpg 150w, medium.jpg 500w, large.jpg 1000w",
  "webp_srcset": "thumb.webp 150w, medium.webp 500w, large.webp 1000w",
  "sizes": "(max-width: 600px) 150px, (max-width: 1200px) 500px, 1000px",
  "responsive_urls": {
    "thumbnail": {
      "original": "https://example.com/.../thumb.jpg",
      "webp": "https://example.com/.../thumb.webp"
    },
    "medium": {...},
    "large": {...}
  },
  "picture_element_data": {
    "sources": [
      {
        "type": "image/webp",
        "srcset": "thumb.webp 150w, medium.webp 500w, large.webp 1000w"
      },
      {
        "type": "image/jpeg",
        "srcset": "thumb.jpg 150w, medium.jpg 500w, large.jpg 1000w"
      }
    ],
    "img": {
      "src": "medium.jpg",
      "alt": "Product front view"
    }
  },
  "lazy_load_attrs": {
    "loading": "lazy",
    "data-src": "medium.jpg",
    "data-srcset": "..."
  },
  "placeholder_url": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### Expected Outcome
```
ProductImageSerializer updated with responsive fields:
- srcset (original format)
- webp_srcset
- sizes
- responsive_urls (all sizes/formats)
- picture_element_data
- lazy_load_attrs
- placeholder_url

Frontend-ready for responsive images
```

### Verification Checklist
- [ ] srcset field added with proper format
- [ ] webp_srcset field generates WebP srcset
- [ ] sizes field returns appropriate sizes string
- [ ] responsive_urls returns nested dictionary
- [ ] picture_element_data has sources array
- [ ] lazy_load_attrs includes loading and data attributes
- [ ] placeholder_url returns LQIP data URI
- [ ] Browser context handled (WebP detection)
- [ ] All fields added to Meta.fields
- [ ] Output tested with frontend consumption

---

## Task 67: Create VariantImageSerializer

### Overview
Create a serializer for VariantImage model with similar structure to ProductImageSerializer but including variant-specific fields and inheritance logic.

### Dependencies
- Task 65: Create ProductImageSerializer
- Task 33: Create VariantImage model

### Instructions

1. **Create variant_image.py serializer file**
   - In serializers directory
   - Similar structure to product_image.py

2. **Import required modules**
   - Import serializers from DRF
   - Import VariantImage model
   - Import get_variant_images utility

3. **Define VariantImageSerializer class**
   - Inherit from serializers.ModelSerializer
   - Can extend ProductImageSerializer for shared fields
   - Or create standalone with similar fields

4. **Add variant-specific fields**
   - Include `variant` field (ID or nested)
   - Add `uses_inherited` boolean field
   - Indicates if image inherited from product

5. **Reuse URL and responsive fields**
   - Copy URL field methods from ProductImageSerializer
   - Or inherit and reuse
   - Same structure: url, thumbnail_url, etc.

6. **Add inherited images handling**
   - Method: `get_inherited_from_product(self, obj)`
   - Return True if variant has no own images
   - Helps frontend show inheritance indicator

7. **Include metadata fields**
   - alt_text, title, caption
   - display_order, is_primary
   - Same as ProductImageSerializer

8. **Define Meta class**
   - Set model = VariantImage
   - Set fields list
   - Set read_only_fields

9. **Add validation**
   - Ensure variant exists
   - Validate image file format
   - Check gallery limits

10. **Update serializers __init__.py**
    - Import VariantImageSerializer
    - Add to __all__ list

### Expected Outcome
```
backend/apps/products/media/serializers/
├── __init__.py (updated)
├── product_image.py
└── variant_image.py (NEW)

VariantImageSerializer with:
- All image URLs and variants
- Variant-specific fields
- Inheritance indicator
- Responsive fields
```

### Verification Checklist
- [ ] variant_image.py file created
- [ ] VariantImageSerializer class defined
- [ ] variant field included
- [ ] uses_inherited field indicates inheritance
- [ ] All URL fields from ProductImageSerializer
- [ ] Responsive fields included
- [ ] Metadata fields included
- [ ] Meta class configured
- [ ] Validation implemented
- [ ] Imported in __init__.py

---

## Task 68: Create ImageUploadSerializer

### Overview
Create a write-only serializer for handling image uploads with validation, metadata input, and proper file handling.

### Dependencies
- Task 13: Create image validation
- Task 65: Create ProductImageSerializer

### Instructions

1. **Create upload.py serializer file**
   - In serializers directory
   - Handles write operations

2. **Define ImageUploadSerializer class**
   - Inherit from serializers.Serializer (not ModelSerializer)
   - Write-only serializer for uploads

3. **Add image field**
   - Add `image` as ImageField
   - Required field
   - Will validate file format and size

4. **Add metadata fields**
   - Add `alt_text` CharField (optional)
   - Add `title` CharField (optional)
   - Add `caption` TextField (optional)
   - Add `is_primary` BooleanField (optional, default False)
   - Add `display_order` IntegerField (optional)

5. **Add validation methods**
   - `validate_image(self, value)` - validate file
   - Check file size against MAX_FILE_SIZE
   - Check format in ALLOWED_EXTENSIONS
   - Check dimensions (min/max)
   - Raise ValidationError if fails

6. **Add create method**
   - Override `create(self, validated_data)`
   - Extract product or variant from context
   - Create ProductImage or VariantImage instance
   - Return created instance

7. **Handle multiple uploads**
   - Alternative: ImageBulkUploadSerializer
   - Accept list of image data
   - Validate all before creating any
   - Use transactions

8. **Add success response fields**
   - After creation, return ProductImageSerializer data
   - Include generated URLs
   - Include processing status

### Upload Serializer Structure

**Input:**
```json
{
  "image": <file>,
  "alt_text": "Product front view",
  "title": "Main image",
  "is_primary": true,
  "display_order": 0
}
```

**Response:**
```json
{
  "id": 123,
  "url": "...",
  "processing_status": "pending",
  ...
}
```

### Expected Outcome
```
backend/apps/products/media/serializers/
└── upload.py (NEW)

ImageUploadSerializer with:
- image field with validation
- Optional metadata fields
- create method
- Comprehensive validation
```

### Verification Checklist
- [ ] upload.py file created
- [ ] ImageUploadSerializer defined
- [ ] image field with proper validation
- [ ] Metadata fields (alt_text, title, caption)
- [ ] validate_image method checks size/format/dimensions
- [ ] create method creates ProductImage/VariantImage
- [ ] Returns serialized response
- [ ] Handles validation errors gracefully

---

## Task 69: Create ImageReorderSerializer

### Overview
Create a serializer for handling gallery reordering requests, validating ordered image IDs and facilitating the reorder operation.

### Dependencies
- Task 41: Add reorder_gallery method

### Instructions

1. **Add to upload.py or create separate file**
   - Add ImageReorderSerializer to upload.py
   - Or create reorder.py

2. **Define ImageReorderSerializer class**
   - Inherit from serializers.Serializer
   - Simple request/response serializer

3. **Add ordered_ids field**
   - Add `ordered_ids` as ListField of IntegerFields
   - Required field
   - Represents new order of image IDs

4. **Add validation**
   - `validate_ordered_ids(self, value)` method
   - Check list is not empty
   - Check all values are positive integers
   - Check no duplicates
   - Will check ownership in view

5. **Add update method**
   - Override `update(self, instance, validated_data)`
   - Or handle in view
   - Call ProductGallery.reorder() service

6. **Return updated gallery**
   - After reorder, return list of images in new order
   - Use ProductImageSerializer(many=True)

### Reorder Request Example

**Request:**
```json
{
  "ordered_ids": [45, 42, 47, 43, 44]
}
```

**Response:**
```json
{
  "images": [
    {"id": 45, "display_order": 0, ...},
    {"id": 42, "display_order": 1, ...},
    {"id": 47, "display_order": 2, ...},
    {"id": 43, "display_order": 3, ...},
    {"id": 44, "display_order": 4, ...}
  ]
}
```

### Expected Outcome
```
ImageReorderSerializer with:
- ordered_ids field
- Validation of IDs
- Simple request structure
- Used by reorder endpoint
```

### Verification Checklist
- [ ] ImageReorderSerializer defined
- [ ] ordered_ids field as ListField
- [ ] Validation checks for empty, duplicates
- [ ] Used in reorder endpoint (Task 73)
- [ ] Returns updated gallery after reorder

---

## Summary

This document created comprehensive DRF serializers for the media API:

- **ProductImageSerializer**: Full serialization with URLs, metadata, and processing status
- **Responsive Fields**: Srcset, sizes, and picture element data for responsive images
- **VariantImageSerializer**: Variant-specific serialization with inheritance support
- **ImageUploadSerializer**: Write serializer for uploads with validation
- **ImageReorderSerializer**: Reordering request/response handling

These serializers provide a complete API interface for image management operations.

---

## Next Steps

Continue to [02_Tasks-70-74_ViewSets.md](02_Tasks-70-74_ViewSets.md) to implement DRF ViewSets for image CRUD operations and custom actions.
