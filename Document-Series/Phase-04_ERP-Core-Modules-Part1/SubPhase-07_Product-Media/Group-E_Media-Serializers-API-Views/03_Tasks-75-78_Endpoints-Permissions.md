# Tasks 75-78: Additional Endpoints & Permissions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** E - Media Serializers & API Views  
> **Document:** 03 of 03  
> **Tasks Covered:** 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-70-74_ViewSets.md](02_Tasks-70-74_ViewSets.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the implementation of specialized API endpoints for image management including download, optimization triggers, cleanup operations, and the permission system for media access control.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Add image download endpoint | Medium |
| 76 | Add optimization trigger endpoint | Low |
| 77 | Add cleanup endpoint | Low |
| 78 | Create image permissions | Medium |

---

## Task 75: Add Image Download Endpoint

### Overview
Add a custom action to ProductImageViewSet and VariantImageViewSet for secure image downloads with access control, variant selection, and download tracking.

### Dependencies
- Task 70: Create ProductImageViewSet
- Task 74: Create VariantImageViewSet
- Task 57: Add CDN URL generation

### Instructions

1. **Add download action to ProductImageViewSet**
   - Use @action decorator
   - Methods: ['get']
   - Detail: True (instance-level)
   - URL path: 'download/'

2. **Define download method**
   - Method signature: `download(self, request, pk=None)`
   - Get image instance by pk
   - Validate permissions

3. **Accept variant parameter**
   - Query parameter: `?variant=thumbnail`
   - Possible values: thumbnail, small, medium, large, original
   - Default to 'original'

4. **Validate access permissions**
   - Check user has permission to view product
   - Check image belongs to user's tenant
   - Return 403 if not authorized

5. **Get requested variant path**
   - Use image.get_variant_url(variant_name)
   - Or access ImageVariant queryset
   - Handle missing variants gracefully

6. **Return file response**
   - Use FileResponse or HttpResponse
   - Set Content-Disposition header for download
   - Set Content-Type based on image format
   - Stream file efficiently

7. **Track downloads (optional)**
   - Increment download counter
   - Log download event
   - Analytics purposes

8. **Handle CDN images**
   - If using CDN, redirect to CDN URL
   - Return 302 redirect response
   - Or proxy through Django for tracking

9. **Add rate limiting**
   - Limit download requests per user
   - Prevent abuse
   - Use throttling classes

10. **Add to VariantImageViewSet**
    - Implement same download action
    - Handle variant image specifics

### Download Endpoint Specification

**Request:**
```
GET /api/products/images/{id}/download/?variant=medium
GET /api/products/images/{id}/download/?variant=original
```

**Response (Redirect):**
```
HTTP 302 Found
Location: https://cdn.example.com/media/products/image_medium.jpg
```

**Response (Direct):**
```
HTTP 200 OK
Content-Type: image/jpeg
Content-Disposition: attachment; filename="product_45_medium.jpg"
Content-Length: 123456

[Binary Image Data]
```

### Expected Outcome
```
ProductImageViewSet updated with:
- @action download endpoint
- Variant parameter handling
- Permission validation
- File response or CDN redirect
- Optional download tracking

VariantImageViewSet updated similarly
```

### Verification Checklist
- [ ] @action decorator with methods=['get'], detail=True
- [ ] download method defined
- [ ] Accepts variant query parameter
- [ ] Validates user permissions
- [ ] Validates image belongs to tenant
- [ ] Gets requested variant URL
- [ ] Returns FileResponse or redirect
- [ ] Sets appropriate headers
- [ ] Handles missing variants
- [ ] Optional download tracking
- [ ] Rate limiting configured
- [ ] Added to both ViewSets

---

## Task 76: Add Optimization Trigger Endpoint

### Overview
Add an admin action to manually trigger image optimization for specific images or all images of a product, useful for re-optimizing after settings change.

### Dependencies
- Task 61: Create batch optimization command
- Task 70: Create ProductImageViewSet

### Instructions

1. **Add optimize action to ProductImageViewSet**
   - Use @action decorator
   - Methods: ['post']
   - Detail: True (instance-level)
   - URL path: 'optimize/'

2. **Define optimize method**
   - Method signature: `optimize(self, request, pk=None)`
   - Get image instance
   - Validate admin/staff permission

3. **Accept optimization parameters**
   - force: Force re-optimization even if already optimized
   - formats: List of formats to optimize (webp, jpeg, png)
   - quality: Override quality settings
   - All optional with defaults

4. **Queue optimization task**
   - Use Celery task from Task 20
   - Pass image ID and parameters
   - Return task ID for tracking

5. **Return task status**
   - Return 202 Accepted (task queued)
   - Include task ID
   - Frontend can poll task status

6. **Add bulk optimize action**
   - List-level action (detail=False)
   - URL path: 'optimize-all/'
   - Accept product_id or image_ids
   - Queue multiple optimization tasks

7. **Validate permissions**
   - Only staff/admin users
   - Or specific 'can_optimize_images' permission
   - Return 403 for regular users

8. **Add optimization status endpoint**
   - GET action to check task status
   - URL path: 'optimization-status/'
   - Query parameter: task_id
   - Returns progress and results

### Optimization Endpoint Specification

**Single Image Optimization:**
```
POST /api/products/images/{id}/optimize/
Content-Type: application/json

{
  "force": true,
  "formats": ["webp", "jpeg"],
  "quality": 85
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "abc123...",
  "message": "Optimization queued",
  "status_url": "/api/products/images/optimization-status/?task_id=abc123"
}
```

**Bulk Optimization:**
```
POST /api/products/images/optimize-all/
Content-Type: application/json

{
  "product_id": 123,
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "task_ids": ["abc123", "def456", "ghi789"],
  "image_count": 3,
  "message": "3 images queued for optimization"
}
```

**Status Check:**
```
GET /api/products/images/optimization-status/?task_id=abc123
```

**Response:**
```json
{
  "task_id": "abc123",
  "status": "completed",
  "progress": 100,
  "result": {
    "optimized": true,
    "original_size": 512000,
    "optimized_size": 256000,
    "savings_percent": 50
  }
}
```

### Expected Outcome
```
ProductImageViewSet updated with:
- @action optimize endpoint
- Accepts optimization parameters
- Queues Celery task
- Returns task ID
- Bulk optimize-all action
- optimization-status endpoint
- Staff/admin permission required
```

### Verification Checklist
- [ ] @action optimize with methods=['post'], detail=True
- [ ] optimize method defined
- [ ] Accepts force, formats, quality parameters
- [ ] Validates staff/admin permission
- [ ] Queues Celery optimization task
- [ ] Returns 202 with task ID
- [ ] optimize-all bulk action added
- [ ] Accepts product_id or image_ids
- [ ] optimization-status endpoint added
- [ ] Returns task progress and results
- [ ] Returns 403 for non-staff users

---

## Task 77: Add Cleanup Endpoint

### Overview
Add an admin endpoint to clean up orphaned images, remove old variants, and perform media maintenance operations.

### Dependencies
- Task 70: Create ProductImageViewSet
- Phase-03 SubPhase-10: File storage configuration

### Instructions

1. **Add cleanup action to ProductImageViewSet**
   - Use @action decorator
   - Methods: ['post']
   - Detail: False (list-level)
   - URL path: 'cleanup/'

2. **Define cleanup method**
   - Method signature: `cleanup(self, request, *args, **kwargs)`
   - Validate admin/superuser permission
   - Accept cleanup parameters

3. **Accept cleanup types**
   - orphaned: Remove images with deleted products
   - unused_variants: Remove variants not accessed in X days
   - failed_processing: Remove images stuck in processing
   - temp_files: Clean temporary upload files
   - all: Perform all cleanup operations

4. **Implement orphaned images cleanup**
   - Query ProductImage where product is None (soft delete scenario)
   - Or products that are deleted
   - Delete images and physical files
   - Return count of deleted images

5. **Implement unused variants cleanup**
   - Query ImageVariant with last_accessed_at > X days
   - Or variants never accessed
   - Delete physical files
   - Keep database records with deleted flag

6. **Implement failed processing cleanup**
   - Query images with processing_status='failed'
   - Age > 7 days
   - Remove or mark for retry

7. **Implement temp files cleanup**
   - Scan upload temporary directory
   - Remove files older than 24 hours
   - Files from incomplete uploads

8. **Use Django management command**
   - Create management command: `cleanup_media`
   - API endpoint calls this command
   - Or implement logic directly in view

9. **Return cleanup report**
   - Number of images deleted
   - Number of variants removed
   - Disk space freed
   - Errors encountered

10. **Add dry-run option**
    - Parameter: dry_run=true
    - Show what would be deleted
    - Don't actually delete

11. **Queue as background task**
    - For large cleanup operations
    - Use Celery task
    - Return task ID

### Cleanup Endpoint Specification

**Request:**
```
POST /api/products/images/cleanup/
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "types": ["orphaned", "unused_variants"],
  "dry_run": false,
  "unused_variants_days": 90
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "orphaned_images_deleted": 15,
    "unused_variants_deleted": 234,
    "disk_space_freed_mb": 125.6,
    "errors": []
  }
}
```

**Dry Run Response:**
```json
{
  "success": true,
  "dry_run": true,
  "report": {
    "orphaned_images_count": 15,
    "unused_variants_count": 234,
    "estimated_space_mb": 125.6,
    "would_delete": [
      {"id": 123, "type": "orphaned", "path": "..."},
      {"id": 124, "type": "orphaned", "path": "..."}
    ]
  }
}
```

### Expected Outcome
```
ProductImageViewSet updated with:
- @action cleanup endpoint
- Cleanup types parameter
- Orphaned images deletion
- Unused variants deletion
- Failed processing cleanup
- Temp files cleanup
- Dry-run option
- Superuser permission required
```

### Verification Checklist
- [ ] @action cleanup with methods=['post']
- [ ] cleanup method defined
- [ ] Accepts types parameter
- [ ] Validates superuser permission
- [ ] Implements orphaned images cleanup
- [ ] Implements unused variants cleanup
- [ ] Implements failed processing cleanup
- [ ] Implements temp files cleanup
- [ ] Returns detailed cleanup report
- [ ] dry_run option implemented
- [ ] Can queue as background task
- [ ] Returns 403 for non-superusers

---

## Task 78: Create Image Permissions

### Overview
Implement a comprehensive permission system for media management, controlling who can view, upload, edit, delete, and optimize images based on roles and ownership.

### Dependencies
- Phase-03 SubPhase-05: Role Permission System
- Task 70: Create ProductImageViewSet
- Task 74: Create VariantImageViewSet

### Instructions

1. **Create permissions directory**
   - In `backend/apps/products/media/`
   - Create `permissions/` directory
   - Create `__init__.py`

2. **Create image_permissions.py file**
   - In permissions directory
   - Add module docstring

3. **Import permission classes**
   - Import BasePermission from rest_framework.permissions
   - Import IsAuthenticated, IsAdminUser
   - Import custom permission base classes

4. **Create CanViewProductImage permission**
   - Inherit from BasePermission
   - Check user is authenticated
   - Check user belongs to same tenant as image
   - Public products: Allow all authenticated
   - Private products: Check user access

5. **Create CanUploadProductImage permission**
   - Check user has 'add_productimage' permission
   - Or has 'products.add_product' permission
   - Check tenant subscription allows more images
   - Check gallery limit not exceeded

6. **Create CanEditProductImage permission**
   - Check user has 'change_productimage' permission
   - Or is product owner
   - Or has manager role
   - Check image belongs to user's tenant

7. **Create CanDeleteProductImage permission**
   - Check user has 'delete_productimage' permission
   - Or is product owner
   - Or has admin role
   - Prevent deletion of last primary image (optional)

8. **Create CanOptimizeImages permission**
   - Check user is staff or has admin role
   - Or has specific 'can_optimize_images' permission
   - Only for optimization endpoints

9. **Create CanCleanupMedia permission**
   - Check user is superuser
   - Or has 'can_cleanup_media' permission
   - Only for cleanup endpoint

10. **Create CanManageVariantImages permission**
    - Similar to ProductImage permissions
    - Check variant ownership
    - Check product access through variant

11. **Apply permissions to ViewSets**
    - ProductImageViewSet: Set permission_classes
    - Use different permissions per action
    - Override get_permissions() method

12. **Configure action-level permissions**
    - List/Retrieve: CanViewProductImage
    - Create/Upload: CanUploadProductImage
    - Update: CanEditProductImage
    - Delete: CanDeleteProductImage
    - Optimize: CanOptimizeImages
    - Cleanup: CanCleanupMedia

13. **Add object-level permissions**
    - Override has_object_permission
    - Check ownership for specific instances
    - Tenant isolation enforcement

14. **Create permission decorators**
    - @require_media_permission
    - Decorator for non-DRF views
    - Utility for function-based views

15. **Update views __init__.py**
    - Import permission classes
    - Export for use in views

### Permission Structure

```
ProductImage Permissions:
├── View: CanViewProductImage
│   ├── Authenticated users
│   ├── Same tenant
│   └── Product access granted
├── Upload: CanUploadProductImage
│   ├── 'add_productimage' permission
│   ├── Within gallery limit
│   └── Subscription allows
├── Edit: CanEditProductImage
│   ├── 'change_productimage' permission
│   ├── Product owner
│   └── Manager role
├── Delete: CanDeleteProductImage
│   ├── 'delete_productimage' permission
│   ├── Product owner
│   └── Admin role
├── Optimize: CanOptimizeImages
│   ├── Staff user
│   └── 'can_optimize_images' permission
└── Cleanup: CanCleanupMedia
    ├── Superuser
    └── 'can_cleanup_media' permission
```

### Applying Permissions to ViewSets

**ProductImageViewSet:**
```python
# Override get_permissions method
def get_permissions(self):
    if self.action == 'list' or self.action == 'retrieve':
        permission_classes = [IsAuthenticated, CanViewProductImage]
    elif self.action == 'create' or self.action == 'upload':
        permission_classes = [IsAuthenticated, CanUploadProductImage]
    elif self.action == 'update' or self.action == 'partial_update':
        permission_classes = [IsAuthenticated, CanEditProductImage]
    elif self.action == 'destroy':
        permission_classes = [IsAuthenticated, CanDeleteProductImage]
    elif self.action == 'optimize':
        permission_classes = [IsAuthenticated, CanOptimizeImages]
    elif self.action == 'cleanup':
        permission_classes = [IsAuthenticated, CanCleanupMedia]
    else:
        permission_classes = [IsAuthenticated]
    
    return [permission() for permission in permission_classes]

# Object-level permission check
def has_object_permission(self, request, view, obj):
    # Check tenant isolation
    if obj.product.tenant != request.user.tenant:
        return False
    
    # Check action-specific permissions
    # ...
```

### Expected Outcome
```
backend/apps/products/media/
├── permissions/
│   ├── __init__.py (NEW)
│   └── image_permissions.py (NEW)

Permission Classes:
- CanViewProductImage
- CanUploadProductImage
- CanEditProductImage
- CanDeleteProductImage
- CanOptimizeImages
- CanCleanupMedia
- CanManageVariantImages

ViewSets updated with:
- Action-level permissions
- Object-level permissions
- Tenant isolation enforcement
```

### Verification Checklist
- [ ] permissions directory created
- [ ] image_permissions.py file created
- [ ] CanViewProductImage class defined
- [ ] CanUploadProductImage class defined
- [ ] CanEditProductImage class defined
- [ ] CanDeleteProductImage class defined
- [ ] CanOptimizeImages class defined
- [ ] CanCleanupMedia class defined
- [ ] CanManageVariantImages class defined
- [ ] Permissions applied to ProductImageViewSet
- [ ] get_permissions method overridden
- [ ] has_object_permission implemented
- [ ] Tenant isolation enforced
- [ ] Permissions applied to VariantImageViewSet
- [ ] Permission decorators created
- [ ] Permissions imported in __init__.py

---

## Summary

This document completed the API layer for media management:

- **Download Endpoint**: Secure image downloads with variant selection and CDN support
- **Optimization Trigger**: Admin endpoint to queue image optimization tasks
- **Cleanup Endpoint**: Media maintenance operations for orphaned and unused files
- **Permission System**: Comprehensive role-based access control for all media operations

These endpoints and permissions provide a complete, secure API for image management.

---

## Next Steps

Continue to [Group F: Testing & Documentation](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md) to implement comprehensive tests and create end-user documentation for the media module.
