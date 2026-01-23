# Tasks 33-39: VariantImage Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** C - Variant Images & Gallery  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-40-44_Gallery-Service.md](02_Tasks-40-44_Gallery-Service.md)

---

## Document Overview

This document covers the creation of the VariantImage model for variant-specific product images, including metadata, upload path functions, custom manager, signals, and image inheritance logic that allows variants to fall back to product images when no variant-specific images exist.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create VariantImage model | Medium |
| 34 | Add variant image metadata | Low |
| 35 | Create variant image upload path | Low |
| 36 | Add variant image manager | Medium |
| 37 | Create variant image signals | Medium |
| 38 | Add image inheritance logic | Low |
| 39 | Create get_variant_images method | Low |

---

## Task 33: Create VariantImage Model

### Overview
Create the VariantImage model to store images specific to product variants. This allows each variant (e.g., different colors or sizes) to have its own unique images while maintaining the same structure as ProductImage.

### Dependencies
- Task 05: Create ProductImage model (model structure reference)
- SubPhase-04: Product Variants (Variant model exists)

### Instructions

1. **Create variant_image.py file**
   - Navigate to `backend/apps/products/media/models/`
   - Create file named `variant_image.py`
   - Add module docstring explaining variant-specific images

2. **Import required modules**
   - Import `models` from `django.db`
   - Import `Variant` model from `apps.products.models`
   - Import `TenantAwareStorage` from file storage module
   - Import image validation functions from validators
   - Import variant image upload path function (will be created in Task 35)

3. **Define VariantImage model class**
   - Create class `VariantImage` inheriting from `models.Model`
   - Add class docstring explaining variant image storage

4. **Add variant foreign key**
   - Create `variant` field as ForeignKey to Variant model
   - Set `on_delete=models.CASCADE` (delete images when variant deleted)
   - Set `related_name='images'` for reverse access
   - Add help_text explaining the variant association

5. **Add image field**
   - Create `image` field as ImageField
   - Set `upload_to` to variant image upload path function (Task 35)
   - Set `storage` to TenantAwareStorage instance
   - Set `max_length=500` for path storage
   - Add validators for image format and size
   - Add help_text explaining the image file

6. **Add display order field**
   - Create `display_order` field as PositiveIntegerField
   - Set `default=0`
   - Add db_index=True for query optimization
   - Add help_text explaining gallery ordering

7. **Add is_primary field**
   - Create `is_primary` field as BooleanField
   - Set `default=False`
   - Add db_index=True for quick primary image lookups
   - Add help_text explaining primary image designation

8. **Add dimension fields**
   - Create `width` field as PositiveIntegerField with null=True, blank=True
   - Create `height` field as PositiveIntegerField with null=True, blank=True
   - Add help_text explaining auto-population on save
   - These will be populated by signals (Task 37)

9. **Add file size field**
   - Create `file_size` field as PositiveIntegerField with null=True, blank=True
   - Store size in bytes
   - Add help_text explaining auto-population
   - Will be populated by pre-save signal

10. **Add original filename field**
    - Create `original_filename` field as CharField with max_length=255
    - Set blank=True
    - Store user's original filename for reference

11. **Add timestamp fields**
    - Create `created_at` field as DateTimeField with auto_now_add=True
    - Create `updated_at` field as DateTimeField with auto_now=True
    - Track creation and modification times

12. **Define Meta class**
    - Set `db_table` to 'products_variant_images'
    - Set `ordering` to ['display_order', 'created_at']
    - Add index on ['variant', 'display_order']
    - Add index on ['variant', 'is_primary']
    - Set `verbose_name` to 'Variant Image'
    - Set `verbose_name_plural` to 'Variant Images'

13. **Add __str__ method**
    - Return descriptive string with variant SKU and image filename
    - Format: "Variant {variant_sku} - Image {filename}"

14. **Update models __init__.py**
    - Import VariantImage from variant_image module
    - Add to __all__ list for clean imports

### Model Field Summary

| Field | Type | Purpose | Auto-populated |
|-------|------|---------|----------------|
| variant | ForeignKey | Link to product variant | No |
| image | ImageField | Actual image file | No |
| display_order | PositiveIntegerField | Gallery ordering | No |
| is_primary | BooleanField | Primary variant image flag | No |
| width | PositiveIntegerField | Image width in pixels | Yes (signal) |
| height | PositiveIntegerField | Image height in pixels | Yes (signal) |
| file_size | PositiveIntegerField | File size in bytes | Yes (signal) |
| original_filename | CharField | User's original filename | Yes (on upload) |
| created_at | DateTimeField | Creation timestamp | Yes |
| updated_at | DateTimeField | Last update timestamp | Yes |

### Expected Outcome
```
backend/apps/products/media/
├── models/
│   ├── __init__.py (updated)
│   ├── product_image.py
│   ├── image_variant.py
│   └── variant_image.py (NEW)
```

### Verification Checklist
- [ ] variant_image.py file created
- [ ] VariantImage model defined with all fields
- [ ] variant FK with CASCADE deletion
- [ ] image field with TenantAwareStorage
- [ ] display_order and is_primary fields added
- [ ] Dimension and file_size fields (auto-populated)
- [ ] Meta class with proper db_table and indexes
- [ ] __str__ method returns descriptive string
- [ ] Model imported in models/__init__.py

---

## Task 34: Add Variant Image Metadata

### Overview
Add metadata fields to VariantImage for SEO optimization and accessibility. These fields allow storage of alt text and titles specific to variant images.

### Dependencies
- Task 33: Create VariantImage model

### Instructions

1. **Open variant_image.py file**
   - Navigate to `backend/apps/products/media/models/variant_image.py`
   - Locate the VariantImage model class

2. **Add alt_text field**
   - Create `alt_text` field as CharField with max_length=255
   - Set blank=True (optional but recommended)
   - Add help_text explaining SEO and accessibility importance
   - Used for image alt attribute in HTML

3. **Add title field**
   - Create `title` field as CharField with max_length=255
   - Set blank=True
   - Add help_text explaining hover tooltip usage
   - Used for image title attribute in HTML

4. **Add caption field (optional)**
   - Create `caption` field as TextField
   - Set blank=True
   - Add help_text explaining display caption usage
   - Can be displayed below image in galleries

5. **Update __str__ method if needed**
   - Consider including alt_text in string representation
   - Makes admin interface more informative

6. **Add get_display_name method**
   - Create method that returns title or alt_text or filename
   - Fallback order: title → alt_text → original_filename → "Variant Image"
   - Useful for admin and API displays

### Metadata Field Usage

| Field | HTML Attribute | SEO Impact | Required |
|-------|---------------|------------|----------|
| alt_text | img alt="" | High | Recommended |
| title | img title="" | Low | Optional |
| caption | <figcaption> | None | Optional |

### Accessibility Guidelines

1. **Alt Text Best Practices:**
   - Describe the image content concisely
   - Include variant-specific information (color, pattern)
   - Example: "Blue cotton t-shirt front view"
   - Avoid "image of" or "picture of" prefixes

2. **Title Best Practices:**
   - Provide additional context on hover
   - Can be more descriptive than alt text
   - Example: "Premium organic cotton t-shirt in navy blue"

### Expected Outcome
```
VariantImage model fields updated:
- alt_text: CharField(max_length=255, blank=True)
- title: CharField(max_length=255, blank=True)
- caption: TextField(blank=True)
- get_display_name() method added
```

### Verification Checklist
- [ ] alt_text field added to model
- [ ] title field added to model
- [ ] caption field added (optional)
- [ ] get_display_name method implemented
- [ ] Fields marked as blank=True (optional)
- [ ] Help text added to all metadata fields

---

## Task 35: Create Variant Image Upload Path

### Overview
Create a function that generates tenant-aware upload paths for variant images, ensuring proper file organization and tenant isolation with variant-specific directory structure.

### Dependencies
- Task 04: Create image upload path function (reference pattern)
- Task 33: Create VariantImage model

### Instructions

1. **Open utils.py file**
   - Navigate to `backend/apps/products/media/utils.py`
   - This file already contains product_image_upload_path function

2. **Import additional modules if needed**
   - Ensure `os`, `uuid`, and `connection` are imported
   - These should already be imported from Task 04

3. **Define variant_image_upload_path function**
   - Create function with signature: `variant_image_upload_path(instance, filename)`
   - Accept `instance` parameter (VariantImage model instance)
   - Accept `filename` parameter (original uploaded filename)
   - Return complete upload path as string

4. **Extract file extension**
   - Use `os.path.splitext(filename)` to get extension
   - Convert extension to lowercase for consistency
   - Handle files without extensions (use empty string)

5. **Generate unique filename**
   - Use `uuid.uuid4()` to generate unique identifier
   - Combine with extension: `{uuid}{extension}`
   - Prevents filename collisions

6. **Get tenant schema**
   - Access `connection.schema_name` for current tenant
   - Provides tenant isolation in storage

7. **Get product ID from variant**
   - Access `instance.variant.product.id` for product reference
   - Variant images stored under product directory for logical grouping

8. **Get variant ID**
   - Access `instance.variant.id` for variant reference
   - Creates variant-specific subdirectory

9. **Construct variant upload path**
   - Build path: `tenants/{schema}/products/{product_id}/variants/{variant_id}/{unique_filename}`
   - Use forward slashes for cross-platform compatibility
   - Example: `tenants/shop_a/products/123/variants/456/a1b2c3d4.jpg`

10. **Handle missing associations gracefully**
    - If variant not yet associated, use temporary path
    - Path: `tenants/{schema}/products/temp/variants/{unique_filename}`
    - Add comment explaining temporary upload location

11. **Add docstring**
    - Explain function purpose
    - Document parameters and return value
    - Include example path

### Path Structure Comparison

**Product Images:**
```
tenants/{schema}/products/{product_id}/{filename}
```

**Variant Images:**
```
tenants/{schema}/products/{product_id}/variants/{variant_id}/{filename}
```

### Directory Organization Example

```
media/
└── tenants/
    └── shop_a/
        └── products/
            └── 123/                     # Product ID
                ├── image1.jpg           # Product image
                ├── image2.jpg           # Product image
                └── variants/
                    ├── 456/             # Variant ID (Red, Small)
                    │   ├── image1.jpg
                    │   └── image2.jpg
                    └── 457/             # Variant ID (Blue, Medium)
                        └── image1.jpg
```

### Expected Outcome
```
backend/apps/products/media/
└── utils.py (updated with variant_image_upload_path function)
```

### Verification Checklist
- [ ] variant_image_upload_path function created
- [ ] Function accepts instance and filename parameters
- [ ] Unique filename generated using UUID
- [ ] Tenant schema retrieved from connection
- [ ] Product ID and variant ID extracted from instance
- [ ] Path format: tenants/{schema}/products/{id}/variants/{vid}/
- [ ] Graceful handling of missing associations
- [ ] Docstring with examples added

---

## Task 36: Add Variant Image Manager

### Overview
Create a custom manager for VariantImage model with convenience methods for retrieving primary images and gallery collections, similar to ProductImage manager.

### Dependencies
- Task 33: Create VariantImage model
- Task 10: Add ProductImage manager (reference pattern)

### Instructions

1. **Create variant_image_manager.py file**
   - Navigate to `backend/apps/products/media/managers/`
   - Create file named `variant_image_manager.py`
   - Add module docstring

2. **Import required modules**
   - Import `models` from `django.db`
   - Import `Q` from `django.db.models` for complex queries

3. **Define VariantImageManager class**
   - Create class inheriting from `models.Manager`
   - Add class docstring explaining custom query methods

4. **Add get_primary method**
   - Create method: `get_primary(self, variant)`
   - Accept variant instance as parameter
   - Query for images with variant=variant and is_primary=True
   - Use `.first()` to get single primary image or None
   - Add docstring with example usage

5. **Add get_gallery method**
   - Create method: `get_gallery(self, variant)`
   - Accept variant instance as parameter
   - Query for all images with variant=variant
   - Order by display_order, then created_at
   - Return queryset of all variant images
   - Add docstring with example usage

6. **Add set_primary method**
   - Create method: `set_primary(self, image_id, variant)`
   - Accept image_id and variant instance
   - Use transaction to ensure atomicity
   - Unset is_primary for all variant's images
   - Set is_primary=True for specified image
   - Return the primary image instance
   - Add docstring

7. **Add get_or_none method**
   - Create method: `get_or_none(self, variant, **kwargs)`
   - Safe way to get single image without raising exception
   - Return image if found, None otherwise
   - Useful for checking image existence

8. **Add with_metadata method**
   - Create method: `with_metadata(self)`
   - Return queryset with select_related for variant
   - Optimizes queries by reducing database hits
   - Use for list views and API responses

9. **Update VariantImage model**
   - Open `variant_image.py`
   - Add custom manager: `objects = VariantImageManager()`
   - Import VariantImageManager at top of file

10. **Update managers __init__.py**
    - Import VariantImageManager
    - Add to __all__ list

### Manager Method Summary

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| get_primary | variant | VariantImage or None | Get primary image for variant |
| get_gallery | variant | QuerySet | Get all images for variant |
| set_primary | image_id, variant | VariantImage | Set specific image as primary |
| get_or_none | variant, **kwargs | VariantImage or None | Safe single image retrieval |
| with_metadata | - | QuerySet | Optimized queryset with relations |

### Usage Examples (Reference Only)

**Get Primary Image:**
```python
primary = VariantImage.objects.get_primary(variant=variant_instance)
```

**Get Gallery:**
```python
gallery = VariantImage.objects.get_gallery(variant=variant_instance)
```

**Set Primary:**
```python
VariantImage.objects.set_primary(image_id=123, variant=variant_instance)
```

### Expected Outcome
```
backend/apps/products/media/
├── managers/
│   ├── __init__.py (updated)
│   ├── image_manager.py
│   └── variant_image_manager.py (NEW)
└── models/
    └── variant_image.py (updated with custom manager)
```

### Verification Checklist
- [ ] variant_image_manager.py file created
- [ ] VariantImageManager class defined
- [ ] get_primary method implemented
- [ ] get_gallery method implemented
- [ ] set_primary method implemented with transaction
- [ ] get_or_none method implemented
- [ ] with_metadata method implemented
- [ ] Manager assigned to VariantImage.objects
- [ ] Manager imported in managers/__init__.py

---

## Task 37: Create Variant Image Signals

### Overview
Create pre-save and post-save signals for VariantImage to automatically extract image dimensions, file size, and original filename, and trigger async processing of image variants.

### Dependencies
- Task 33: Create VariantImage model
- Task 15: Create ProductImage signals (reference pattern)

### Instructions

1. **Open variant_image.py or create signals.py**
   - Option A: Add signals to end of variant_image.py file
   - Option B: Create separate `signals.py` in media module
   - Recommendation: Use variant_image.py for simplicity

2. **Import signal decorators**
   - Import `pre_save`, `post_save` from `django.db.models.signals`
   - Import `receiver` decorator
   - Import `Pillow` (PIL) Image module for dimension extraction

3. **Create pre_save signal for metadata extraction**
   - Use @receiver decorator with pre_save and sender=VariantImage
   - Function signature: `extract_variant_image_metadata(sender, instance, **kwargs)`
   - Only process if instance has an image file

4. **Extract image dimensions in pre_save**
   - Open image using PIL: `Image.open(instance.image.file)`
   - Extract width and height: `width, height = img.size`
   - Set instance.width and instance.height
   - Handle exceptions gracefully (log errors)

5. **Extract file size in pre_save**
   - Get file size: `instance.image.file.size`
   - Set instance.file_size
   - File size in bytes as integer

6. **Store original filename in pre_save**
   - Check if instance.original_filename is empty
   - If empty, set from instance.image.name
   - Extract just the filename without path
   - Use `os.path.basename(instance.image.name)`

7. **Create post_save signal for processing**
   - Use @receiver decorator with post_save and sender=VariantImage
   - Function signature: `trigger_variant_image_processing(sender, instance, created, **kwargs)`
   - Only trigger on creation (created=True)

8. **Queue image variant generation**
   - Import Celery task from tasks module (will be created in Group B)
   - Call async task to generate thumbnails, medium, large versions
   - Pass variant image ID to task
   - Set status to PENDING if status field exists

9. **Handle EXIF orientation**
   - In pre_save, check for EXIF orientation tag
   - Auto-rotate image based on orientation
   - This fixes images from cameras/phones
   - Save corrected orientation back to file

10. **Register signals in apps.py**
    - Open media/apps.py
    - In `ready()` method, import signal handlers
    - Ensures signals are connected when Django starts

### Signal Flow Diagram

```
┌─────────────────────┐
│  Image Upload       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  pre_save Signal    │
│  ├─ Extract dimensions
│  ├─ Get file size
│  ├─ Store filename
│  └─ Fix orientation
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Save to Database   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  post_save Signal   │
│  └─ Queue processing
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Celery Task        │
│  (Generate variants)│
└─────────────────────┘
```

### Expected Outcome
```
Signals added to variant_image.py:
- extract_variant_image_metadata (pre_save)
- trigger_variant_image_processing (post_save)

Signals registered in apps.py ready() method
```

### Verification Checklist
- [ ] pre_save signal created for metadata extraction
- [ ] Image dimensions extracted using Pillow
- [ ] File size calculated and stored
- [ ] Original filename stored on first save
- [ ] EXIF orientation handled
- [ ] post_save signal created for processing
- [ ] Async task queued on image creation
- [ ] Signals registered in apps.py ready() method
- [ ] Exception handling for corrupt images

---

## Task 38: Add Image Inheritance Logic

### Overview
Implement logic that allows variants to inherit product images when no variant-specific images are defined. This provides a seamless fallback and reduces duplicate image storage.

### Dependencies
- Task 33: Create VariantImage model
- Task 05: Create ProductImage model

### Instructions

1. **Open variant_image.py file**
   - Navigate to `backend/apps/products/media/models/variant_image.py`
   - Add class method to VariantImage model

2. **Create has_own_images class method**
   - Define static method or class method on VariantImage
   - Method signature: `has_own_images(cls, variant)`
   - Check if variant has any associated VariantImage records
   - Return boolean: True if images exist, False otherwise

3. **Add method to Variant model (if allowed)**
   - Navigate to variant model in products app
   - Add method: `get_images(self)`
   - This method will be used to get variant images with fallback

4. **Implement fallback logic in get_images**
   - First, check if variant has own images using VariantImage.objects.filter(variant=self).exists()
   - If yes, return VariantImage.objects.get_gallery(variant=self)
   - If no, return ProductImage.objects.get_gallery(product=self.product)
   - This provides transparent fallback

5. **Add get_primary_image method to Variant**
   - Create method: `get_primary_image(self)`
   - Check if variant has own images
   - If yes, return VariantImage.objects.get_primary(variant=self)
   - If no, return ProductImage.objects.get_primary(product=self.product)
   - Returns primary image with fallback

6. **Create inheritance indicator method**
   - Add method: `uses_inherited_images(self)` to Variant model
   - Return True if variant has no own images
   - Useful for UI to show "using product images" message

7. **Add image count method**
   - Create method: `get_image_count(self)`
   - Return count of own images if they exist
   - Otherwise return count of product images
   - Useful for gallery pagination

8. **Document inheritance behavior**
   - Add docstrings explaining inheritance logic
   - Document in both VariantImage and Variant models
   - Include examples of usage

### Inheritance Logic Flow

```
┌─────────────────────────┐
│ Request Variant Images  │
└───────────┬─────────────┘
            │
            ▼
    ┌──────────────┐
    │ Has own      │
    │ images?      │
    └───┬─────┬────┘
        │     │
       Yes    No
        │     │
        │     └──────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌────────────────┐
│ Return        │  │ Return         │
│ VariantImages │  │ ProductImages  │
└───────────────┘  └────────────────┘
```

### Usage Scenarios

| Scenario | Variant Images | Result | Reason |
|----------|---------------|--------|--------|
| Color variants | Each color has unique images | Own images | Different appearance |
| Size variants | No size-specific images | Inherited | Same appearance |
| Mixed | Some variants have images | Mixed | Flexible per variant |

### Expected Outcome
```
Variant model methods added:
- get_images() - returns images with fallback
- get_primary_image() - returns primary with fallback
- uses_inherited_images() - boolean indicator
- get_image_count() - total image count

VariantImage methods:
- has_own_images(variant) - check for images
```

### Verification Checklist
- [ ] has_own_images class method added to VariantImage
- [ ] get_images method added to Variant model
- [ ] Fallback logic checks variant images first
- [ ] Falls back to product images if none exist
- [ ] get_primary_image method implemented
- [ ] uses_inherited_images indicator method added
- [ ] get_image_count method added
- [ ] Docstrings explain inheritance behavior

---

## Task 39: Create get_variant_images Method

### Overview
Create a utility function or service method that provides a unified interface for retrieving variant images with automatic fallback to product images. This simplifies API and template usage.

### Dependencies
- Task 38: Add image inheritance logic
- Task 36: Add variant image manager

### Instructions

1. **Create gallery service file (preparation for Task 40)**
   - Navigate to `backend/apps/products/media/services/`
   - Create file named `gallery_manager.py`
   - This will house gallery utility functions

2. **Import required modules**
   - Import VariantImage and ProductImage models
   - Import related managers

3. **Define get_variant_images function**
   - Function signature: `get_variant_images(variant, include_primary=True)`
   - Accept variant instance as parameter
   - Accept optional include_primary flag (default True)
   - Return ordered queryset or list of images

4. **Check for variant-specific images**
   - Use VariantImage.objects.filter(variant=variant).exists()
   - Store result in boolean variable

5. **Return variant images if they exist**
   - If variant has images, return VariantImage.objects.get_gallery(variant)
   - Apply ordering by display_order
   - This is the primary path

6. **Return product images as fallback**
   - If no variant images, get product from variant
   - Return ProductImage.objects.get_gallery(product=variant.product)
   - Ensures always returns images

7. **Handle include_primary flag**
   - If include_primary=False, exclude is_primary=True images
   - Useful for showing only secondary images in some views

8. **Add get_variant_primary_image function**
   - Function signature: `get_variant_primary_image(variant)`
   - Check for variant images first
   - Return VariantImage.objects.get_primary(variant) if exists
   - Otherwise return ProductImage.objects.get_primary(variant.product)
   - Simpler interface than calling managers directly

9. **Add get_image_urls function**
   - Function signature: `get_image_urls(variant, size='medium')`
   - Accept variant and size parameter ('thumbnail', 'medium', 'large')
   - Return list of image URLs for specified size
   - Handles variant/product fallback automatically
   - Useful for API responses

10. **Add docstrings and examples**
    - Document all functions with purpose and usage
    - Include parameter descriptions
    - Show example API usage

### Function Interface Summary

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| get_variant_images | variant, include_primary | QuerySet | Get all images with fallback |
| get_variant_primary_image | variant | Image or None | Get primary image with fallback |
| get_image_urls | variant, size | List[str] | Get image URLs for size |

### Usage in API Views (Conceptual)

**In Serializer:**
```python
images = get_variant_images(variant=instance)
primary = get_variant_primary_image(variant=instance)
urls = get_image_urls(variant=instance, size='medium')
```

**In Template:**
```python
{% for image in get_variant_images(variant) %}
    <img src="{{ image.url }}" alt="{{ image.alt_text }}">
{% endfor %}
```

### Expected Outcome
```
backend/apps/products/media/
└── services/
    ├── __init__.py (updated)
    └── gallery_manager.py (NEW with initial functions)

Functions added:
- get_variant_images(variant, include_primary)
- get_variant_primary_image(variant)
- get_image_urls(variant, size)
```

### Verification Checklist
- [ ] gallery_manager.py file created
- [ ] get_variant_images function implemented
- [ ] Checks for variant images first
- [ ] Falls back to product images
- [ ] include_primary parameter handled
- [ ] get_variant_primary_image function implemented
- [ ] get_image_urls function implemented
- [ ] All functions have docstrings
- [ ] Functions imported in services/__init__.py

---

## Summary

This document established the VariantImage model system with complete support for:

- **VariantImage Model**: Full model with variant FK, metadata, dimensions, file tracking
- **Upload Paths**: Tenant-aware paths with variant-specific directories
- **Custom Manager**: Convenience methods for gallery and primary image retrieval
- **Signals**: Automatic metadata extraction and processing queue
- **Inheritance**: Seamless fallback to product images when no variant images exist
- **Utility Functions**: Unified interface for retrieving images with automatic fallback

The system ensures variants can have unique images while maintaining efficiency through inheritance when appropriate.

---

## Next Steps

Continue to [02_Tasks-40-44_Gallery-Service.md](02_Tasks-40-44_Gallery-Service.md) to implement the ProductGallery service with reordering, bulk upload, and image management features.
