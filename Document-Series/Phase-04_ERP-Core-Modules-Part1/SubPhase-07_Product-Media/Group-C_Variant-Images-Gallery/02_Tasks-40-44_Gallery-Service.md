# Tasks 40-44: Gallery Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** C - Variant Images & Gallery  
> **Document:** 02 of 03  
> **Tasks Covered:** 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-39_VariantImage-Model.md](01_Tasks-33-39_VariantImage-Model.md)
- **→ Next Document:** [03_Tasks-45-48_Limits-Admin-Reorder.md](03_Tasks-45-48_Limits-Admin-Reorder.md)

---

## Document Overview

This document covers the creation of the ProductGallery service for unified gallery management, including reordering functionality, bulk image uploads, image swapping, and copying images from products to variants.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 40 | Create ProductGallery service | High |
| 41 | Add reorder_gallery method | Low |
| 42 | Create bulk upload handler | High |
| 43 | Add image swap functionality | Low |
| 44 | Create image copy to variant | Medium |

---

## Task 40: Create ProductGallery Service

### Overview
Create a unified service class that manages both ProductImage and VariantImage galleries with consistent interfaces, providing centralized gallery operations for the entire media system.

### Dependencies
- Task 05: Create ProductImage model
- Task 33: Create VariantImage model
- Task 39: Create get_variant_images method

### Instructions

1. **Open gallery_manager.py file**
   - Navigate to `backend/apps/products/media/services/gallery_manager.py`
   - This file was started in Task 39
   - Add ProductGallery class below existing functions

2. **Import required modules**
   - Import `transaction` from `django.db`
   - Import `ValidationError` from `django.core.exceptions`
   - Import ProductImage and VariantImage models
   - Import Product and Variant models

3. **Define ProductGallery service class**
   - Create class: `ProductGallery`
   - Add class docstring explaining unified gallery management
   - This class handles both product and variant galleries

4. **Add __init__ method**
   - Accept optional `product` parameter
   - Accept optional `variant` parameter
   - Validate that at least one is provided
   - Store both as instance attributes
   - Determine whether operating on product or variant gallery

5. **Add get_model method**
   - Return ProductImage if operating on product
   - Return VariantImage if operating on variant
   - Private method: `_get_model(self)`
   - Used internally to get correct model class

6. **Add get_images method**
   - Return all images for the product or variant
   - Use get_variant_images if variant (includes inheritance)
   - Use ProductImage.objects.get_gallery if product
   - Order by display_order
   - Method signature: `get_images(self)`

7. **Add get_primary method**
   - Return primary image for product or variant
   - Use appropriate manager method
   - Handle case where no primary exists
   - Method signature: `get_primary(self)`

8. **Add set_primary method**
   - Accept image_id parameter
   - Use transaction for atomicity
   - Unset all current primary images
   - Set specified image as primary
   - Validate image belongs to correct product/variant
   - Method signature: `set_primary(self, image_id)`

9. **Add add_image method**
   - Accept image file parameter
   - Accept optional metadata (alt_text, title)
   - Calculate next display_order
   - Create new ProductImage or VariantImage
   - Set is_primary=True if first image
   - Return created image instance
   - Method signature: `add_image(self, image_file, **metadata)`

10. **Add remove_image method**
    - Accept image_id parameter
    - Validate image exists and belongs to product/variant
    - Delete image (triggers file deletion via signals)
    - If was primary, set next image as primary
    - Method signature: `remove_image(self, image_id)`

11. **Add count_images method**
    - Return total image count
    - For variants, respect inheritance
    - Method signature: `count(self)`

12. **Add get_next_display_order method**
    - Calculate next available display_order
    - Query max display_order and add 1
    - Default to 0 if no images
    - Private method: `_get_next_display_order(self)`

### ProductGallery Class Interface

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| __init__ | product?, variant? | - | Initialize for product or variant |
| get_images | - | QuerySet | Get all images ordered |
| get_primary | - | Image or None | Get primary image |
| set_primary | image_id | Image | Set image as primary |
| add_image | file, **metadata | Image | Add new image to gallery |
| remove_image | image_id | bool | Remove image from gallery |
| count | - | int | Count images in gallery |

### Usage Examples (Conceptual)

**Product Gallery:**
```python
gallery = ProductGallery(product=product_instance)
images = gallery.get_images()
primary = gallery.get_primary()
new_image = gallery.add_image(file, alt_text="Product view")
```

**Variant Gallery:**
```python
gallery = ProductGallery(variant=variant_instance)
images = gallery.get_images()  # Includes inheritance
gallery.set_primary(image_id=123)
```

### Expected Outcome
```
backend/apps/products/media/services/
└── gallery_manager.py (updated with ProductGallery class)

ProductGallery class with methods:
- __init__(product, variant)
- get_images()
- get_primary()
- set_primary(image_id)
- add_image(file, **metadata)
- remove_image(image_id)
- count()
```

### Verification Checklist
- [ ] ProductGallery class created in gallery_manager.py
- [ ] __init__ accepts product or variant
- [ ] get_images returns ordered queryset
- [ ] get_primary returns primary image
- [ ] set_primary uses transaction
- [ ] add_image creates appropriate model instance
- [ ] remove_image validates and deletes
- [ ] count method respects inheritance for variants
- [ ] All methods have docstrings

---

## Task 41: Add Reorder Gallery Method

### Overview
Implement gallery reordering functionality to allow users to change the display order of images. This method updates display_order values in a single transaction.

### Dependencies
- Task 40: Create ProductGallery service

### Instructions

1. **Add reorder method to ProductGallery class**
   - Open `gallery_manager.py`
   - Add new method to ProductGallery class
   - Method signature: `reorder(self, ordered_image_ids)`

2. **Accept ordered list of image IDs**
   - Parameter: `ordered_image_ids` as list of integers
   - List order represents new display order
   - Example: [3, 1, 4, 2] means image 3 first, image 1 second, etc.

3. **Validate all images exist**
   - Query images with provided IDs
   - Verify count matches input list length
   - Ensure all images belong to the product/variant
   - Raise ValidationError if mismatch

4. **Use database transaction**
   - Wrap update logic in `@transaction.atomic` or with statement
   - Ensures all-or-nothing update
   - Prevents partial reordering on errors

5. **Update display_order for each image**
   - Iterate through ordered_image_ids with enumerate
   - For each ID, get image instance
   - Set display_order to index value
   - Save each image

6. **Handle primary image positioning**
   - Optionally ensure primary image is at position 0
   - Or allow primary at any position
   - Document behavior in docstring

7. **Return updated images**
   - Query and return images in new order
   - Useful for API responses

8. **Add bulk update optimization**
   - Consider using `bulk_update` for better performance
   - Update all images in single query
   - Significant performance gain for large galleries

### Reorder Logic Flow

```
┌─────────────────────────┐
│ Receive Ordered IDs     │
│ [3, 1, 4, 2]           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Validate All IDs        │
│ - Exist                 │
│ - Belong to product     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Start Transaction       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Update Each Image       │
│ Image 3: display_order=0│
│ Image 1: display_order=1│
│ Image 4: display_order=2│
│ Image 2: display_order=3│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Commit Transaction      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Return Ordered Images   │
└─────────────────────────┘
```

### Reorder Validation Rules

| Validation | Check | Error Message |
|-----------|-------|---------------|
| Count match | len(IDs) == image count | "ID count mismatch" |
| All exist | All IDs found in DB | "Invalid image ID(s)" |
| Ownership | All belong to product | "Image not in gallery" |
| No duplicates | Set(IDs) == len(IDs) | "Duplicate IDs" |

### Expected Outcome
```
ProductGallery class updated with:
- reorder(ordered_image_ids) method
- Transaction-wrapped updates
- Validation of IDs
- Bulk update optimization
```

### Verification Checklist
- [ ] reorder method added to ProductGallery
- [ ] Accepts list of ordered image IDs
- [ ] Validates all IDs exist
- [ ] Validates ownership by product/variant
- [ ] Uses transaction.atomic for safety
- [ ] Updates display_order for each image
- [ ] Returns updated images queryset
- [ ] Handles errors with meaningful messages
- [ ] Docstring explains usage and parameters

---

## Task 42: Create Bulk Upload Handler

### Overview
Implement functionality to handle multiple image uploads in a single request, validating each file and creating multiple ProductImage or VariantImage instances efficiently.

### Dependencies
- Task 40: Create ProductGallery service
- Task 13: Create image validation

### Instructions

1. **Add bulk_add_images method to ProductGallery**
   - Method signature: `bulk_add_images(self, image_files, metadata_list=None)`
   - Accept list of image files
   - Accept optional list of metadata dictionaries
   - Return list of created image instances

2. **Validate input parameters**
   - Check image_files is list or tuple
   - Check all items are file-like objects
   - If metadata_list provided, check length matches
   - Raise ValidationError for invalid input

3. **Check gallery limit**
   - Get current image count
   - Get maximum allowed (will be from Task 45, use default 10 for now)
   - Calculate how many can be added
   - Raise ValidationError if exceeds limit

4. **Set up transaction**
   - Use `@transaction.atomic` decorator
   - Ensures all images created or none
   - Rollback on any validation error

5. **Validate each image file**
   - Loop through image_files
   - For each file, run validation (format, size, dimensions)
   - Collect any validation errors
   - If any errors, raise ValidationError with all messages

6. **Create image instances**
   - Calculate starting display_order
   - Loop through validated files
   - For each file, create ProductImage or VariantImage
   - Set display_order incrementally
   - Apply metadata if provided
   - Collect created instances

7. **Set first as primary if gallery empty**
   - Check if gallery was previously empty
   - If yes, set first uploaded image as primary
   - Update is_primary field

8. **Return created images**
   - Return list of created image instances
   - Ordered by display_order
   - Useful for API response with image IDs

9. **Add progress tracking (optional)**
   - For large uploads, consider progress callback
   - Can emit signals for UI progress bars
   - Not required for initial implementation

10. **Handle partial failures gracefully**
    - If one file fails validation, reject all
    - Provide clear error message indicating which file failed
    - Include file index or filename in error

### Bulk Upload Flow

```
┌─────────────────────────┐
│ Receive Files List      │
│ [file1, file2, file3]  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Validate All Files      │
│ - Format                │
│ - Size                  │
│ - Dimensions            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Check Gallery Limit     │
│ Current + New ≤ Max     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Start Transaction       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Create Each Image       │
│ - Set display_order     │
│ - Apply metadata        │
│ - Save to DB            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Set First as Primary    │
│ (if gallery was empty)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Commit Transaction      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Return Created Images   │
└─────────────────────────┘
```

### Validation Per Image

| Check | Validation | Action on Fail |
|-------|-----------|----------------|
| Format | In ALLOWED_EXTENSIONS | Reject with format error |
| Size | ≤ MAX_FILE_SIZE | Reject with size error |
| Dimensions | ≥ MIN, ≤ MAX | Reject with dimension error |
| Limit | Total ≤ Gallery max | Reject with limit error |

### Expected Outcome
```
ProductGallery class updated with:
- bulk_add_images(image_files, metadata_list) method
- Transaction-wrapped creation
- Per-file validation
- Gallery limit checking
- Automatic display_order assignment
- Primary image designation for first upload
```

### Verification Checklist
- [ ] bulk_add_images method added to ProductGallery
- [ ] Accepts list of image files
- [ ] Accepts optional metadata list
- [ ] Validates each file (format, size, dimensions)
- [ ] Checks gallery limit before processing
- [ ] Uses transaction for all-or-nothing creation
- [ ] Assigns incremental display_order
- [ ] Sets first as primary if gallery empty
- [ ] Returns list of created images
- [ ] Provides detailed error messages
- [ ] Handles partial failures by rejecting all

---

## Task 43: Add Image Swap Functionality

### Overview
Implement a simple method to swap the display order of two images in a gallery, useful for quick reordering without specifying the entire order.

### Dependencies
- Task 40: Create ProductGallery service

### Instructions

1. **Add swap method to ProductGallery class**
   - Method signature: `swap(self, image_id_1, image_id_2)`
   - Accept two image IDs to swap
   - Simple convenience method for two-image reorder

2. **Validate both images exist**
   - Query for both images by ID
   - Ensure both belong to the product/variant
   - Raise ValidationError if either not found
   - Raise ValidationError if ownership mismatch

3. **Get current display_order values**
   - Store image1.display_order as order1
   - Store image2.display_order as order2
   - These will be swapped

4. **Use transaction for atomic swap**
   - Wrap update in transaction
   - Prevents inconsistent state

5. **Swap display_order values**
   - Set image1.display_order = order2
   - Set image2.display_order = order1
   - Save both images

6. **Update is_primary if needed**
   - If swapping with position 0 (first position)
   - Consider updating is_primary flag
   - Or keep is_primary independent of order
   - Document behavior choice

7. **Return swapped images**
   - Return tuple: (image1, image2)
   - Both refreshed from database
   - Shows updated display_order values

### Swap Logic

```
Before Swap:
Image A: display_order=2
Image B: display_order=5

After Swap:
Image A: display_order=5
Image B: display_order=2
```

### Swap Use Cases

| Scenario | Usage | UI Pattern |
|----------|-------|-----------|
| Move to top | Swap with position 0 | "Set as first" button |
| Swap adjacent | Swap N and N+1 | Arrow up/down buttons |
| Random swap | Swap any two | Drag-drop targets |

### Expected Outcome
```
ProductGallery class updated with:
- swap(image_id_1, image_id_2) method
- Validation of both IDs
- Transaction-wrapped swap
- Return both updated images
```

### Verification Checklist
- [ ] swap method added to ProductGallery
- [ ] Accepts two image IDs
- [ ] Validates both images exist
- [ ] Validates both belong to product/variant
- [ ] Uses transaction for atomic operation
- [ ] Swaps display_order values correctly
- [ ] Returns both updated images
- [ ] Docstring explains usage

---

## Task 44: Create Image Copy to Variant

### Overview
Implement functionality to copy an image from a product to a specific variant, creating a new file and VariantImage instance. Useful when variant needs its own version of a product image.

### Dependencies
- Task 40: Create ProductGallery service
- Task 33: Create VariantImage model

### Instructions

1. **Add copy_to_variant method to ProductGallery or standalone function**
   - Create function: `copy_product_image_to_variant(product_image, variant)`
   - Can be standalone in gallery_manager.py
   - Or method on ProductImage model
   - Accept ProductImage instance and Variant instance

2. **Validate inputs**
   - Check product_image is ProductImage instance
   - Check variant is Variant instance
   - Verify variant belongs to same product
   - Raise ValidationError if mismatch

3. **Read original image file**
   - Open product_image.image.file
   - Read file contents into memory
   - Or use file operations to copy

4. **Generate new filename**
   - Use variant_image_upload_path function
   - Generates unique filename with UUID
   - Creates variant-specific path

5. **Create ContentFile for new image**
   - Import ContentFile from django.core.files
   - Create ContentFile from original image content
   - Preserves image data

6. **Create VariantImage instance**
   - Create new VariantImage record
   - Set variant FK to target variant
   - Assign copied image file
   - Copy metadata: alt_text, title, caption
   - Set display_order to next available

7. **Determine is_primary for copied image**
   - If variant has no images, set is_primary=True
   - Otherwise, set is_primary=False
   - Match original's primary status if desired

8. **Copy processing status**
   - If original has ImageVariant record with processed sizes
   - Optionally copy those as well
   - Or trigger new processing for variant
   - Document which approach is used

9. **Save and return**
   - Save new VariantImage instance
   - Triggers signals for processing
   - Return created VariantImage
   - Useful for confirmation

10. **Add bulk copy method (optional)**
    - Create `copy_all_to_variant(product, variant)` function
    - Copy all product images to variant
    - Useful for initializing variant gallery
    - Maintains display_order

### Copy Process Flow

```
┌─────────────────────────┐
│ Product Image           │
│ (Original)              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Read Image File         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Generate New Path       │
│ /variants/{id}/         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Create ContentFile      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Create VariantImage     │
│ - Assign file           │
│ - Copy metadata         │
│ - Set display_order     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Save Instance           │
│ (Triggers processing)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Return VariantImage     │
└─────────────────────────┘
```

### Copy vs Reference

| Approach | Storage | Flexibility | Use Case |
|----------|---------|-------------|----------|
| Copy (this task) | Duplicated | Full - can modify independently | Variant needs own version |
| Reference | Shared | Limited - changes affect all | Inheritance (Task 38) |

### Expected Outcome
```
Functions added to gallery_manager.py:
- copy_product_image_to_variant(product_image, variant)
- (Optional) copy_all_to_variant(product, variant)

Creates new VariantImage with copied file
Maintains metadata and ordering
```

### Verification Checklist
- [ ] copy_product_image_to_variant function created
- [ ] Validates inputs (product_image, variant)
- [ ] Verifies variant belongs to same product
- [ ] Reads original image file
- [ ] Generates new variant-specific path
- [ ] Creates ContentFile with image data
- [ ] Creates VariantImage instance
- [ ] Copies metadata (alt_text, title, caption)
- [ ] Sets appropriate display_order
- [ ] Sets is_primary correctly
- [ ] Saves and returns new VariantImage
- [ ] Optional: bulk copy method for all images

---

## Summary

This document implemented comprehensive gallery management services:

- **ProductGallery Service**: Unified interface for product and variant galleries with add, remove, set primary operations
- **Reorder Functionality**: Transaction-safe reordering of entire galleries
- **Bulk Upload**: Efficient multiple image upload with validation and limit checking
- **Image Swap**: Quick two-image position swap for UI convenience
- **Copy to Variant**: Duplicate product images to variants with independent file storage

These services provide a robust foundation for gallery management operations in both API endpoints and admin interfaces.

---

## Next Steps

Continue to [03_Tasks-45-48_Limits-Admin-Reorder.md](03_Tasks-45-48_Limits-Admin-Reorder.md) to implement gallery limits, validation, admin interface, and drag-drop reordering endpoint.
