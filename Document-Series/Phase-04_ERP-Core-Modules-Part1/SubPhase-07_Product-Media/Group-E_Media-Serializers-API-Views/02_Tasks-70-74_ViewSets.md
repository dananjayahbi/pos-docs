# Tasks 70-74: API ViewSets

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** E - Media Serializers & API Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-69_Serializers.md](01_Tasks-65-69_Serializers.md)
- **→ Next Document:** [03_Tasks-75-78_Endpoints-Permissions.md](03_Tasks-75-78_Endpoints-Permissions.md)

---

## Document Overview

This document covers the creation of Django REST Framework ViewSets for product and variant image management, including CRUD operations, upload endpoints, set primary actions, reordering, and variant-specific views.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 70 | Create ProductImageViewSet | High |
| 71 | Add image upload endpoint | Medium |
| 72 | Add set primary endpoint | Low |
| 73 | Add reorder endpoint | Low |
| 74 | Create VariantImageViewSet | Medium |

---

## Task 70: Create ProductImageViewSet

### Overview
Create a Django REST Framework ModelViewSet for ProductImage with standard CRUD operations and custom actions for image management.

### Dependencies
- Task 65: Create ProductImageSerializer
- Phase-03 SubPhase-02: API Framework Setup

### Instructions

1. **Create views directory structure**
   - Navigate to `backend/apps/products/media/`
   - Create `views/` directory
   - Create `__init__.py` in views directory

2. **Create product_image.py view file**
   - Create file in views directory
   - Add module docstring

3. **Import required modules**
   - Import viewsets from rest_framework
   - Import Response, status from rest_framework
   - Import ProductImage model
   - Import ProductImageSerializer
   - Import authentication and permission classes
   - Import action decorator for custom endpoints

4. **Define ProductImageViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add class docstring

5. **Set queryset and serializer**
   - Set `queryset = ProductImage.objects.all().select_related('product')`
   - Set `serializer_class = ProductImageSerializer`
   - Use select_related for query optimization

6. **Configure filtering**
   - Set `filterset_fields = ['product', 'is_primary']`
   - Allows filtering by product ID and primary status
   - Or use FilterBackend for more options

7. **Configure ordering**
   - Set `ordering_fields = ['display_order', 'created_at']`
   - Set `ordering = ['display_order']` as default
   - Ensures gallery order maintained

8. **Override get_queryset method**
   - Filter by current tenant
   - Only show images from user's tenant
   - Handle staff/superuser access

9. **Add create method override**
   - Extract product from request data
   - Validate user has permission to add images to product
   - Call super().create()
   - Trigger image processing

10. **Add update method override**
    - Validate image belongs to user's tenant
    - Allow updating metadata only (not image file)
    - Call super().update()

11. **Add destroy method override**
    - Validate permissions
    - Delete image and all variants
    - Return 204 No Content

12. **Add pagination**
    - Set `pagination_class = PageNumberPagination`
    - Configure page size (e.g., 20 images per page)

13. **Create URL configuration**
    - Create or update `urls.py` in media app
    - Register router with ProductImageViewSet
    - URL pattern: `/api/products/images/`

14. **Update views __init__.py**
    - Import ProductImageViewSet
    - Add to __all__ list

### ViewSet Endpoints Generated

| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| GET | /api/products/images/ | list | List all images |
| GET | /api/products/images/{id}/ | retrieve | Get single image |
| POST | /api/products/images/ | create | Upload new image |
| PATCH | /api/products/images/{id}/ | partial_update | Update metadata |
| DELETE | /api/products/images/{id}/ | destroy | Delete image |

### Expected Outcome
```
backend/apps/products/media/
├── views/
│   ├── __init__.py
│   └── product_image.py (NEW)
└── urls.py (NEW or updated)

ProductImageViewSet with:
- CRUD operations
- Tenant filtering
- Query optimization
- Pagination
```

### Verification Checklist
- [ ] views directory created
- [ ] product_image.py file created
- [ ] ProductImageViewSet class defined
- [ ] queryset uses select_related
- [ ] serializer_class set
- [ ] Filtering configured
- [ ] Ordering configured
- [ ] get_queryset filters by tenant
- [ ] create, update, destroy overridden
- [ ] Pagination configured
- [ ] URLs registered
- [ ] ViewSet imported in __init__.py

---

## Task 71: Add Image Upload Endpoint

### Overview
Add a custom action to ProductImageViewSet for handling single and bulk image uploads with validation and processing.

### Dependencies
- Task 70: Create ProductImageViewSet
- Task 68: Create ImageUploadSerializer
- Task 42: Create bulk upload handler

### Instructions

1. **Add upload action to ProductImageViewSet**
   - Use @action decorator
   - Methods: ['post']
   - Detail: False (list-level action)
   - URL path: 'upload/'

2. **Define upload method**
   - Method signature: `upload(self, request, *args, **kwargs)`
   - Handle single or multiple file uploads
   - Use ImageUploadSerializer for validation

3. **Extract product from request**
   - Get product_id from request data or URL
   - Validate product exists
   - Check user has permission to upload to product

4. **Handle single file upload**
   - Check if single file in request.FILES
   - Validate using ImageUploadSerializer
   - Create ProductImage instance
   - Trigger processing asynchronously

5. **Handle multiple file upload**
   - Check if multiple files in request.FILES
   - Use ProductGallery.bulk_add_images service
   - Validate gallery limit
   - Create all images in transaction

6. **Return created images**
   - Serialize created images with ProductImageSerializer
   - Return 201 Created status
   - Include image IDs and URLs

7. **Handle validation errors**
   - Catch validation errors from serializer
   - Return 400 Bad Request with error details
   - Provide clear error messages

8. **Add progress tracking (optional)**
   - For bulk uploads, return task ID
   - Frontend can poll for progress
   - Or use WebSocket for real-time updates

### Upload Endpoint Specification

**Single Upload Request:**
```
POST /api/products/images/upload/
Content-Type: multipart/form-data

product_id: 123
image: <file>
alt_text: "Product view"
is_primary: true
```

**Multiple Upload Request:**
```
POST /api/products/images/upload/
Content-Type: multipart/form-data

product_id: 123
images[]: <file1>
images[]: <file2>
images[]: <file3>
```

**Response:**
```json
{
  "success": true,
  "images": [
    {"id": 45, "url": "...", "processing_status": "pending"},
    {"id": 46, "url": "...", "processing_status": "pending"}
  ],
  "count": 2
}
```

### Expected Outcome
```
ProductImageViewSet updated with:
- @action upload endpoint
- Single and bulk file handling
- Validation with ImageUploadSerializer
- Gallery service integration
- Async processing trigger
```

### Verification Checklist
- [ ] @action decorator with methods=['post']
- [ ] upload method defined
- [ ] Extracts and validates product_id
- [ ] Handles single file upload
- [ ] Handles multiple file upload
- [ ] Uses ImageUploadSerializer
- [ ] Calls ProductGallery.bulk_add_images for multiple
- [ ] Returns 201 with created images
- [ ] Returns 400 for validation errors
- [ ] Triggers async processing

---

## Task 72: Add Set Primary Endpoint

### Overview
Add a custom action to set a specific image as the primary image for a product, unsetting any other primary images.

### Dependencies
- Task 70: Create ProductImageViewSet
- Task 12: Add set_as_primary method

### Instructions

1. **Add set_primary action**
   - Use @action decorator
   - Methods: ['post']
   - Detail: True (instance-level action)
   - URL path: 'set-primary/'

2. **Define set_primary method**
   - Method signature: `set_primary(self, request, pk=None)`
   - Get image instance by pk
   - Validate image exists

3. **Validate ownership**
   - Check image belongs to user's tenant
   - Check user has permission
   - Return 403 if not authorized

4. **Use ProductImage method**
   - Call image.set_as_primary() method
   - Or use ProductGallery.set_primary()
   - Updates is_primary flags in transaction

5. **Return updated image**
   - Serialize image with ProductImageSerializer
   - Return 200 OK
   - Include updated is_primary status

6. **Handle errors**
   - Image not found: 404
   - Permission denied: 403
   - Other errors: 400 with message

### Set Primary Endpoint Specification

**Request:**
```
POST /api/products/images/{id}/set-primary/
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": 45,
    "is_primary": true,
    "display_order": 0,
    ...
  }
}
```

### Expected Outcome
```
ProductImageViewSet updated with:
- @action set_primary endpoint
- Validates ownership
- Calls set_as_primary method
- Returns updated image
```

### Verification Checklist
- [ ] @action decorator with methods=['post'], detail=True
- [ ] set_primary method defined
- [ ] Gets image instance by pk
- [ ] Validates tenant ownership
- [ ] Calls set_as_primary method
- [ ] Returns 200 with updated image
- [ ] Returns 404 if image not found
- [ ] Returns 403 if not authorized

---

## Task 73: Add Reorder Endpoint

### Overview
Add a custom action to reorder product gallery images by accepting a list of ordered image IDs.

### Dependencies
- Task 70: Create ProductImageViewSet
- Task 69: Create ImageReorderSerializer
- Task 41: Add reorder_gallery method

### Instructions

1. **Add reorder action**
   - Use @action decorator
   - Methods: ['patch']
   - Detail: False (list-level action)
   - URL path: 'reorder/'

2. **Define reorder method**
   - Method signature: `reorder(self, request, *args, **kwargs)`
   - Accept ordered list of image IDs
   - Use ImageReorderSerializer for validation

3. **Extract product ID**
   - Get product_id from request data or query params
   - Validate product exists
   - Check user has permission

4. **Validate request data**
   - Use ImageReorderSerializer
   - Check ordered_ids is valid list
   - Validate all IDs belong to the product

5. **Use ProductGallery service**
   - Initialize ProductGallery(product=product)
   - Call gallery.reorder(ordered_ids)
   - Handles validation and DB updates

6. **Return updated gallery**
   - Query images in new order
   - Serialize with ProductImageSerializer(many=True)
   - Return 200 OK

7. **Handle errors**
   - Invalid IDs: 400 with details
   - Permission denied: 403
   - Product not found: 404

### Reorder Endpoint Specification

**Request:**
```
PATCH /api/products/images/reorder/
Content-Type: application/json

{
  "product_id": 123,
  "ordered_ids": [45, 42, 47, 43, 44]
}
```

**Response:**
```json
{
  "success": true,
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
ProductImageViewSet updated with:
- @action reorder endpoint
- Accepts ordered_ids list
- Uses ImageReorderSerializer
- Calls ProductGallery.reorder()
- Returns updated gallery
```

### Verification Checklist
- [ ] @action decorator with methods=['patch']
- [ ] reorder method defined
- [ ] Uses ImageReorderSerializer
- [ ] Extracts and validates product_id
- [ ] Validates ordered_ids
- [ ] Calls ProductGallery.reorder()
- [ ] Returns 200 with updated images
- [ ] Returns 400 for invalid data
- [ ] Returns 403 for permission denied

---

## Task 74: Create VariantImageViewSet

### Overview
Create a ViewSet for VariantImage with similar structure to ProductImageViewSet but handling variant-specific logic and inheritance.

### Dependencies
- Task 70: Create ProductImageViewSet (reference pattern)
- Task 67: Create VariantImageSerializer

### Instructions

1. **Create variant_image.py view file**
   - In views directory
   - Similar structure to product_image.py

2. **Define VariantImageViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add class docstring

3. **Set queryset and serializer**
   - Set `queryset = VariantImage.objects.all().select_related('variant__product')`
   - Set `serializer_class = VariantImageSerializer`
   - Optimize with select_related

4. **Configure filtering and ordering**
   - Set `filterset_fields = ['variant', 'is_primary']`
   - Set `ordering = ['display_order']`

5. **Override get_queryset**
   - Filter by tenant
   - Handle inherited images if requested
   - Query parameter: `include_inherited=true`

6. **Add CRUD operations**
   - Similar to ProductImageViewSet
   - Validate variant ownership
   - Check permissions

7. **Add custom actions**
   - upload action (similar to Task 71)
   - set_primary action (similar to Task 72)
   - reorder action (similar to Task 73)
   - All variant-specific

8. **Add get_with_inheritance action**
   - Return variant images or product images if none
   - Implements inheritance logic from Task 38
   - Useful for display purposes

9. **Register URLs**
   - Add to router
   - URL pattern: `/api/variants/images/`

10. **Update views __init__.py**
    - Import VariantImageViewSet
    - Add to __all__ list

### VariantImageViewSet Endpoints

| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| GET | /api/variants/images/ | list | List variant images |
| GET | /api/variants/images/?include_inherited=true | list | Include inherited images |
| GET | /api/variants/images/{id}/ | retrieve | Get single image |
| POST | /api/variants/images/upload/ | upload | Upload variant image |
| POST | /api/variants/images/{id}/set-primary/ | set_primary | Set as primary |
| PATCH | /api/variants/images/reorder/ | reorder | Reorder gallery |

### Expected Outcome
```
backend/apps/products/media/views/
├── __init__.py (updated)
├── product_image.py
└── variant_image.py (NEW)

VariantImageViewSet with:
- CRUD operations
- Variant-specific filtering
- Inheritance support
- Custom actions (upload, set_primary, reorder)
```

### Verification Checklist
- [ ] variant_image.py file created
- [ ] VariantImageViewSet class defined
- [ ] queryset uses select_related
- [ ] serializer_class set
- [ ] Filtering by variant configured
- [ ] get_queryset filters by tenant
- [ ] CRUD operations implemented
- [ ] upload action added
- [ ] set_primary action added
- [ ] reorder action added
- [ ] get_with_inheritance action (optional)
- [ ] URLs registered
- [ ] ViewSet imported in __init__.py

---

## Summary

This document implemented comprehensive API ViewSets for image management:

- **ProductImageViewSet**: Full CRUD with ModelViewSet, tenant filtering, pagination
- **Upload Endpoint**: Single and bulk image upload with validation
- **Set Primary Endpoint**: Action to designate primary image
- **Reorder Endpoint**: Gallery reordering via ordered IDs
- **VariantImageViewSet**: Complete variant image management with inheritance support

These ViewSets provide a RESTful API for all image management operations.

---

## Next Steps

Continue to [03_Tasks-75-78_Endpoints-Permissions.md](03_Tasks-75-78_Endpoints-Permissions.md) to implement additional endpoints (download, optimization, cleanup) and permission handling.
