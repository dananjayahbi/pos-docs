# Tasks 45-48: Gallery Limits, Admin & Drag-Drop

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** C - Variant Images & Gallery  
> **Document:** 03 of 03  
> **Tasks Covered:** 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-40-44_Gallery-Service.md](02_Tasks-40-44_Gallery-Service.md)
- **→ Next Group:** [../Group-D_WebP-Conversion-Optimization/](../Group-D_WebP-Conversion-Optimization/)

---

## Document Overview

This document covers gallery limits configuration, position validation, admin interface for variant images with inline preview, and drag-drop reordering API endpoint for frontend integration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Add gallery limit configuration | Low |
| 46 | Create gallery position validation | Low |
| 47 | Add VariantImage admin | Medium |
| 48 | Create image drag-drop reordering | Medium |

---

## Task 45: Add Gallery Limit Configuration

### Overview
Implement tenant-configurable gallery limits to control the maximum number of images allowed per product or variant, with reasonable defaults to prevent storage abuse.

### Dependencies
- Task 40: Create ProductGallery service
- Phase-02: Multi-tenancy setup (TenantSettings model)

### Instructions

1. **Add gallery limit to tenant settings**
   - Navigate to tenant settings model (from Phase-02)
   - Add field: `max_product_images` as PositiveIntegerField
   - Set default=10
   - Add help_text explaining limit purpose
   - This allows per-tenant customization

2. **Create constants for limits**
   - Open `backend/apps/products/media/constants.py`
   - Add constant: `DEFAULT_MAX_GALLERY_IMAGES = 10`
   - Add constant: `ABSOLUTE_MAX_GALLERY_IMAGES = 50`
   - Absolute max prevents excessive limits even if tenant configures high

3. **Add method to get tenant gallery limit**
   - Create utility function: `get_gallery_limit()`
   - Check tenant settings for max_product_images
   - Return tenant value if set
   - Otherwise return DEFAULT_MAX_GALLERY_IMAGES
   - Ensure never exceeds ABSOLUTE_MAX_GALLERY_IMAGES

4. **Update ProductGallery service**
   - Open gallery_manager.py
   - Import get_gallery_limit function
   - In bulk_add_images method, use get_gallery_limit() instead of hardcoded 10

5. **Add validation in add_image method**
   - Check current image count before adding
   - If at limit, raise ValidationError
   - Error message: "Gallery limit reached ({limit} images)"

6. **Add can_add_images method to ProductGallery**
   - Method signature: `can_add_images(self, count=1)`
   - Return boolean indicating if count images can be added
   - Check: current_count + count <= get_gallery_limit()
   - Useful for UI to disable upload button

7. **Add get_remaining_capacity method**
   - Method signature: `get_remaining_capacity(self)`
   - Return: get_gallery_limit() - current_count
   - Shows how many more images can be added
   - Useful for UI messaging

8. **Document limit rationale**
   - Add comments explaining why limits exist
   - Storage management
   - Performance (page load times)
   - User experience (too many images overwhelming)

### Gallery Limit Hierarchy

```
┌──────────────────────────────┐
│ Check Tenant Setting         │
│ max_product_images           │
└────────────┬─────────────────┘
             │
             ▼
        ┌─────────┐
        │ Set?    │
        └────┬─┬──┘
             │ │
            Yes No
             │ │
             │ └──────────┐
             │            │
             ▼            ▼
    ┌────────────┐  ┌─────────────┐
    │ Use Tenant │  │ Use Default │
    │ Value      │  │ (10)        │
    └─────┬──────┘  └──────┬──────┘
          │                │
          └────────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Cap at        │
           │ Absolute Max  │
           │ (50)          │
           └───────────────┘
```

### Limit Recommendations by Tier

| Tenant Tier | Suggested Limit | Rationale |
|-------------|----------------|-----------|
| Free | 5 | Encourage upgrade |
| Basic | 10 | Standard usage |
| Professional | 25 | Power users |
| Enterprise | 50 | Maximum flexibility |

### Expected Outcome
```
Tenant settings model updated:
- max_product_images field added

constants.py updated:
- DEFAULT_MAX_GALLERY_IMAGES = 10
- ABSOLUTE_MAX_GALLERY_IMAGES = 50

Utility functions:
- get_gallery_limit() - returns tenant limit

ProductGallery methods:
- can_add_images(count) - check capacity
- get_remaining_capacity() - remaining slots

Validation:
- add_image checks limit
- bulk_add_images checks limit
```

### Verification Checklist
- [ ] max_product_images field added to tenant settings
- [ ] DEFAULT_MAX_GALLERY_IMAGES constant defined (10)
- [ ] ABSOLUTE_MAX_GALLERY_IMAGES constant defined (50)
- [ ] get_gallery_limit() function created
- [ ] ProductGallery.add_image validates limit
- [ ] ProductGallery.bulk_add_images validates limit
- [ ] can_add_images method returns boolean
- [ ] get_remaining_capacity method returns count
- [ ] Limits enforced before image creation
- [ ] Clear error messages for limit exceeded

---

## Task 46: Create Gallery Position Validation

### Overview
Implement validation to ensure display_order values are unique within a product or variant gallery, preventing duplicate positions and maintaining ordering integrity.

### Dependencies
- Task 05: Create ProductImage model
- Task 33: Create VariantImage model

### Instructions

1. **Add unique_together constraint (if appropriate)**
   - Consider adding to model Meta class
   - unique_together = [['product', 'display_order']]
   - However, this can complicate reordering
   - May be better to validate programmatically

2. **Create validation function**
   - Create file or add to validators.py
   - Function: `validate_unique_display_order(image_instance)`
   - Check if another image has same display_order
   - Exclude current instance (for updates)
   - Raise ValidationError if duplicate found

3. **Add clean method to ProductImage**
   - Override clean() method on ProductImage model
   - Call validate_unique_display_order
   - Ensures validation runs on save

4. **Add clean method to VariantImage**
   - Override clean() method on VariantImage model
   - Call validate_unique_display_order with variant context
   - Same validation pattern as ProductImage

5. **Update reorder logic**
   - In ProductGallery.reorder method
   - Ensure no duplicate display_order values assigned
   - Transaction ensures atomicity

6. **Add position normalization utility**
   - Create function: `normalize_gallery_positions(product_or_variant)`
   - Resets display_order to 0, 1, 2, 3... for all images
   - Useful after deletions that leave gaps
   - Can be called manually or in cleanup tasks

7. **Add gap-based ordering (optional enhancement)**
   - Instead of 0, 1, 2, 3... use 10, 20, 30, 40...
   - Allows inserting images without full reorder
   - To insert between 10 and 20, use 15
   - Document if implementing this approach

8. **Validate on save signal**
   - Add validation in pre_save signal (optional)
   - Catch duplicate positions early
   - Can auto-adjust by finding next available position

### Validation Scenarios

| Scenario | Validation | Action |
|----------|-----------|--------|
| New image | Check existing positions | Assign next available |
| Update position | Check for conflicts | Reject if duplicate |
| Bulk reorder | Validate entire set | Ensure unique positions |
| Deletion | N/A | Optionally normalize gaps |

### Position Conflict Resolution Strategies

**Strategy 1: Reject Duplicate**
- Simplest approach
- User must provide unique position
- Clear error message

**Strategy 2: Auto-increment**
- If conflict, find next available
- Automatically assign unique position
- More user-friendly

**Strategy 3: Gap-based (10, 20, 30)**
- Allows insertions without conflicts
- Normalize occasionally to prevent large numbers

### Expected Outcome
```
Validation added:
- validate_unique_display_order(image) function
- ProductImage.clean() method
- VariantImage.clean() method

Utilities:
- normalize_gallery_positions(product/variant)

Prevents duplicate display_order values
Maintains gallery ordering integrity
```

### Verification Checklist
- [ ] validate_unique_display_order function created
- [ ] ProductImage.clean() validates position
- [ ] VariantImage.clean() validates position
- [ ] Validation excludes current instance on update
- [ ] Clear error message for duplicate position
- [ ] normalize_gallery_positions utility created
- [ ] Validation integrated with save process
- [ ] Transaction safety for batch operations

---

## Task 47: Add VariantImage Admin

### Overview
Register VariantImage model in Django admin with inline preview, list display configuration, filters, and integration with Variant admin for efficient management.

### Dependencies
- Task 33: Create VariantImage model
- Task 16: Create ProductImage admin (reference pattern)

### Instructions

1. **Create or update admin.py**
   - Navigate to `backend/apps/products/media/admin.py`
   - This file was created in Task 16 for ProductImage

2. **Import required modules**
   - Import VariantImage model
   - Import admin decorators and classes
   - Import mark_safe for HTML rendering

3. **Define VariantImageAdmin class**
   - Create class inheriting from admin.ModelAdmin
   - Register with @admin.register(VariantImage) decorator
   - Add class docstring

4. **Configure list_display**
   - Set list_display tuple with fields:
     - 'image_thumbnail' (custom method)
     - 'variant' (clickable link to variant)
     - 'display_order'
     - 'is_primary'
     - 'width'
     - 'height'
     - 'file_size_display' (custom method for formatted size)
     - 'created_at'

5. **Add image_thumbnail method**
   - Create method: `image_thumbnail(self, obj)`
   - Check if image exists
   - Generate HTML img tag with thumbnail
   - Use ImageVariant thumbnail_path if exists
   - Set max dimensions: 50x50px
   - Mark as safe HTML
   - Set short_description = 'Preview'

6. **Add file_size_display method**
   - Create method: `file_size_display(self, obj)`
   - Convert bytes to human-readable format
   - Example: 1048576 → "1.0 MB"
   - Handle KB, MB display
   - Set short_description = 'File Size'

7. **Configure list_filter**
   - Add filters: 'is_primary', 'created_at'
   - Add filter: 'variant__product' for filtering by product
   - Allows narrowing down image list

8. **Configure search_fields**
   - Add: 'variant__sku'
   - Add: 'variant__product__name'
   - Add: 'alt_text'
   - Add: 'title'
   - Enables searching images by variant or metadata

9. **Configure readonly_fields**
   - Add: 'width', 'height', 'file_size'
   - Add: 'created_at', 'updated_at'
   - Add: 'image_preview' (larger preview in detail view)
   - These are auto-populated, shouldn't be edited

10. **Add image_preview method for detail view**
    - Create method: `image_preview(self, obj)`
    - Generate larger preview image (200x200px)
    - Show original image
    - Include image dimensions and size info below
    - Use fieldsets to position nicely

11. **Configure fieldsets**
    - Group fields logically:
      - Basic Info: variant, image, display_order, is_primary
      - Metadata: alt_text, title, caption
      - Technical: width, height, file_size, original_filename
      - Preview: image_preview (readonly)
      - Timestamps: created_at, updated_at (readonly)

12. **Add actions**
    - Create action: `set_as_primary`
    - Select images and set as primary
    - Use ProductGallery.set_primary method

13. **Configure ordering**
    - Set ordering = ['-created_at']
    - Most recent images first

### VariantImageInline for Variant Admin

14. **Create VariantImageInline class**
    - In same admin.py file
    - Create class inheriting from admin.TabularInline or StackedInline
    - Set model = VariantImage
    - Set extra = 0 (no empty forms)
    - Set max_num = 10 (or get_gallery_limit())

15. **Configure inline fields**
    - Set fields: ('image_thumbnail', 'image', 'display_order', 'is_primary', 'alt_text')
    - Include thumbnail preview
    - Allow editing display_order inline

16. **Configure inline readonly_fields**
    - Add: 'image_thumbnail'
    - Add: 'width', 'height', 'file_size'

17. **Add inline to Variant admin**
    - Navigate to Variant model admin (in products app)
    - Add VariantImageInline to inlines list
    - Allows managing variant images directly from variant page

### Admin Interface Features

| Feature | Purpose | User Benefit |
|---------|---------|--------------|
| Thumbnail preview | Quick visual identification | See images at a glance |
| Inline editing | Edit from variant page | Convenient workflow |
| Set as primary action | Bulk primary designation | Efficient management |
| Search by SKU | Find variant images | Quick lookup |
| Filter by product | See all variants' images | Product-level view |

### Expected Outcome
```
admin.py updated with:
- VariantImageAdmin class registered
- list_display with thumbnail preview
- list_filter for narrowing results
- search_fields for variant/product search
- fieldsets for organized detail view
- Actions for bulk operations
- VariantImageInline for Variant admin

Provides full admin interface for variant image management
```

### Verification Checklist
- [ ] VariantImageAdmin class created and registered
- [ ] list_display includes thumbnail, variant, order, primary
- [ ] image_thumbnail method shows 50x50 preview
- [ ] file_size_display formats bytes to KB/MB
- [ ] list_filter includes is_primary, created_at, variant__product
- [ ] search_fields allows searching by variant/product
- [ ] readonly_fields for auto-populated data
- [ ] image_preview shows larger image in detail view
- [ ] fieldsets organize fields logically
- [ ] set_as_primary action available
- [ ] VariantImageInline created
- [ ] Inline added to Variant admin
- [ ] Inline shows thumbnails and allows editing

---

## Task 48: Create Image Drag-Drop Reordering

### Overview
Create an API endpoint that supports drag-and-drop reordering of gallery images from frontend applications, accepting ordered list of image IDs and updating display_order accordingly.

### Dependencies
- Task 41: Add reorder_gallery method
- Task 40: Create ProductGallery service

### Instructions

1. **Create reorder endpoint in views**
   - Navigate to `backend/apps/products/media/views/`
   - Choose to add to existing view file or create new
   - This endpoint will be used by frontend drag-drop UI

2. **Define endpoint path**
   - Recommended: PATCH `/api/products/{product_id}/images/reorder/`
   - Or: PATCH `/api/variants/{variant_id}/images/reorder/`
   - Use PATCH method (partial update)

3. **Create reorder view or action**
   - If using ViewSet, add custom action with @action decorator
   - Action name: `reorder`
   - Methods: ['patch']
   - URL pattern includes product_id or variant_id

4. **Accept ordered_ids in request body**
   - Expect JSON body: `{"ordered_ids": [3, 1, 4, 2]}`
   - List order represents new display sequence
   - Parse from request.data

5. **Validate request data**
   - Check ordered_ids is present
   - Check it's a list of integers
   - Check not empty
   - Return 400 Bad Request if invalid

6. **Get product or variant instance**
   - From URL parameter (product_id or variant_id)
   - Use get_object_or_404 for clean 404 handling
   - Ensure user has permission (will be Task 78)

7. **Initialize ProductGallery service**
   - Create ProductGallery instance with product or variant
   - Call gallery.reorder(ordered_ids)
   - This handles all validation and updates

8. **Handle validation errors**
   - Catch ValidationError from reorder method
   - Return 400 Bad Request with error message
   - Example errors: ID count mismatch, invalid IDs

9. **Return updated gallery**
   - On success, return updated image list
   - Include image IDs, display_order, URLs
   - Return 200 OK with serialized images
   - Frontend can update UI with new order

10. **Add permission check**
    - Ensure only authorized users can reorder
    - Product owners, staff, or specific role
    - Return 403 Forbidden if unauthorized

11. **Add optimistic locking (optional)**
    - Include version or timestamp in request
    - Detect concurrent modifications
    - Return conflict error if gallery changed
    - Prevents race conditions

12. **Document endpoint**
    - Add docstring with request/response examples
    - Document expected JSON format
    - Note permission requirements
    - Will be included in API docs (Task 86)

### Endpoint Specification

**Request:**
```
PATCH /api/products/123/images/reorder/
Content-Type: application/json

{
  "ordered_ids": [45, 42, 47, 43]
}
```

**Response (Success):**
```
200 OK

{
  "success": true,
  "images": [
    {"id": 45, "display_order": 0, "url": "..."},
    {"id": 42, "display_order": 1, "url": "..."},
    {"id": 47, "display_order": 2, "url": "..."},
    {"id": 43, "display_order": 3, "url": "..."}
  ]
}
```

**Response (Error):**
```
400 Bad Request

{
  "error": "Invalid image IDs provided",
  "details": "Image 99 not found in gallery"
}
```

### Frontend Integration Pattern

```javascript
// Frontend drag-drop handler (example)
async function handleImageReorder(productId, newOrder) {
  const ordered_ids = newOrder.map(img => img.id);
  
  const response = await fetch(`/api/products/${productId}/images/reorder/`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ ordered_ids })
  });
  
  if (response.ok) {
    const data = await response.json();
    updateGalleryUI(data.images);
  } else {
    showError('Failed to reorder images');
  }
}
```

### Expected Outcome
```
API endpoint created:
- PATCH /products/{id}/images/reorder/
- PATCH /variants/{id}/images/reorder/

Request body: {"ordered_ids": [list]}
Response: Updated image list

Integrates with ProductGallery.reorder()
Handles validation and permissions
```

### Verification Checklist
- [ ] Reorder endpoint created for products
- [ ] Reorder endpoint created for variants (if separate)
- [ ] Accepts PATCH method
- [ ] Parses ordered_ids from request body
- [ ] Validates ordered_ids format and content
- [ ] Retrieves product/variant instance
- [ ] Calls ProductGallery.reorder() method
- [ ] Handles ValidationError gracefully
- [ ] Returns updated image list on success
- [ ] Returns 400 for invalid requests
- [ ] Checks user permissions (placeholder for Task 78)
- [ ] Includes endpoint docstring
- [ ] Follows REST conventions

---

## Summary

This document completed the variant images and gallery management system with:

- **Gallery Limits**: Tenant-configurable limits with sensible defaults and absolute maximums
- **Position Validation**: Ensures unique display_order within galleries, maintains ordering integrity
- **Admin Interface**: Full-featured VariantImage admin with thumbnails, inlines, and bulk actions
- **Drag-Drop API**: RESTful endpoint for frontend gallery reordering with validation

The gallery system is now complete with robust validation, flexible limits, and both admin and API interfaces for management.

---

## Next Steps

Continue to [Group-D_WebP-Conversion-Optimization](../Group-D_WebP-Conversion-Optimization/) to implement WebP format conversion, responsive image generation, and optimization features.
