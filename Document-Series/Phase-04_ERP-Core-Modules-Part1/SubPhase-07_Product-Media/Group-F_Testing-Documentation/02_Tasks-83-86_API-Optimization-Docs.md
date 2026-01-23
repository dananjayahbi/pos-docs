# Tasks 83-86: API, Optimization Tests & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-82_Model-Processing-Upload-Tests.md](01_Tasks-79-82_Model-Processing-Upload-Tests.md)
- **→ Next SubPhase:** [../../SubPhase-08_Inventory-Stock/00_SUBPHASE_SUMMARY.md](../../SubPhase-08_Inventory-Stock/00_SUBPHASE_SUMMARY.md)

---

## Document Overview

This document completes the testing suite with API endpoint tests and optimization tests, then creates comprehensive technical and end-user documentation for the media module.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 83 | Write API endpoint tests | High |
| 84 | Write optimization tests | Medium |
| 85 | Create media module documentation | High |
| 86 | Create media management guide | Medium |

---

## Task 83: Write API Endpoint Tests

### Overview
Create comprehensive API tests for all media endpoints including CRUD operations, custom actions (download, optimize, cleanup), and ViewSet functionality.

### Dependencies
- Task 70: Create ProductImageViewSet
- Task 71-73: Upload, set primary, reorder endpoints
- Task 75-77: Download, optimize, cleanup endpoints
- Django REST framework testing

### Instructions

1. **Create test_api_endpoints.py file**
   - In tests directory
   - Add module docstring

2. **Import required modules**
   - Import APITestCase from rest_framework.test
   - Import status, reverse
   - Import models (ProductImage, VariantImage, Product)
   - Import User, Tenant, permissions

3. **Create ProductImageAPITestCase class**
   - Inherit from APITestCase
   - Set up fixtures
   - Authenticate client

4. **Test list endpoint**
   - test_list_product_images()
   - GET /api/products/images/
   - Verify 200 OK
   - Check pagination
   - Verify response format

5. **Test list filtering**
   - test_list_filter_by_product()
   - GET /api/products/images/?product=123
   - Verify only matching images returned

6. **Test list filtering by primary**
   - test_list_primary_images()
   - GET /api/products/images/?is_primary=true
   - Verify only primary images

7. **Test list ordering**
   - test_list_ordered_by_display_order()
   - GET /api/products/images/?ordering=display_order
   - Verify correct order

8. **Test retrieve endpoint**
   - test_retrieve_product_image()
   - GET /api/products/images/{id}/
   - Verify 200 OK
   - Check all fields present

9. **Test retrieve non-existent**
   - test_retrieve_404_for_non_existent()
   - GET /api/products/images/99999/
   - Verify 404 Not Found

10. **Test create via POST**
    - test_create_product_image()
    - POST /api/products/images/
    - With multipart data
    - Verify 201 Created

11. **Test update via PATCH**
    - test_partial_update_image()
    - PATCH /api/products/images/{id}/
    - Update alt_text only
    - Verify 200 OK

12. **Test update metadata only**
    - test_cannot_update_image_file()
    - PATCH with new image file
    - Verify file not changed
    - Or verify validation error

13. **Test delete endpoint**
    - test_delete_product_image()
    - DELETE /api/products/images/{id}/
    - Verify 204 No Content
    - Check image deleted from database

14. **Test delete with file removal**
    - test_delete_removes_physical_file()
    - Note file path
    - DELETE image
    - Verify file deleted from storage

15. **Test set primary endpoint**
    - test_set_primary_endpoint()
    - POST /api/products/images/{id}/set-primary/
    - Verify 200 OK
    - Check is_primary updated

16. **Test reorder endpoint**
    - test_reorder_gallery()
    - PATCH /api/products/images/reorder/
    - With ordered_ids
    - Verify display_order updated

17. **Test reorder validation**
    - test_reorder_invalid_ids()
    - Invalid or incomplete IDs
    - Verify 400 Bad Request

18. **Test download endpoint**
    - test_download_image()
    - GET /api/products/images/{id}/download/
    - Verify file response or redirect

19. **Test download with variant**
    - test_download_specific_variant()
    - GET /api/products/images/{id}/download/?variant=thumbnail
    - Verify correct variant returned

20. **Test optimize endpoint**
    - test_trigger_optimization()
    - POST /api/products/images/{id}/optimize/
    - Verify 202 Accepted
    - Check task ID returned

21. **Test optimize requires staff**
    - test_optimize_requires_staff_permission()
    - Non-staff user
    - POST to optimize endpoint
    - Verify 403 Forbidden

22. **Test bulk optimize**
    - test_bulk_optimize_all()
    - POST /api/products/images/optimize-all/
    - With product_id
    - Verify task IDs returned

23. **Test cleanup endpoint**
    - test_cleanup_orphaned_images()
    - POST /api/products/images/cleanup/
    - With types=['orphaned']
    - Verify 200 OK with report

24. **Test cleanup requires superuser**
    - test_cleanup_requires_superuser()
    - Regular user
    - POST to cleanup
    - Verify 403 Forbidden

25. **Test cleanup dry run**
    - test_cleanup_dry_run()
    - POST with dry_run=true
    - Verify nothing deleted
    - Check preview returned

26. **Test optimization status endpoint**
    - test_check_optimization_status()
    - GET /api/products/images/optimization-status/?task_id=abc
    - Verify task status returned

27. **Test tenant isolation in list**
    - test_list_only_tenant_images()
    - Create images in multiple tenants
    - List from one tenant
    - Verify only tenant images shown

28. **Test tenant isolation in retrieve**
    - test_cannot_retrieve_other_tenant_image()
    - Image from tenant A
    - User from tenant B
    - Verify 404 or 403

29. **Test permission checks**
    - test_view_permission_required()
    - test_upload_permission_required()
    - test_edit_permission_required()
    - test_delete_permission_required()
    - Verify all permission classes work

30. **Create VariantImageAPITestCase class**
    - Similar structure for variant endpoints
    - Test all CRUD operations
    - Test variant-specific actions

31. **Test variant image endpoints**
    - test_list_variant_images()
    - test_retrieve_variant_image()
    - test_create_variant_image()
    - test_update_variant_image()
    - test_delete_variant_image()

32. **Test variant inheritance query**
    - test_list_with_inherited_images()
    - GET /api/variants/images/?include_inherited=true
    - Verify product images included

33. **Use helper methods**
    - _create_authenticated_client()
    - _create_test_image()
    - _create_test_product()
    - Reduce code duplication

### Test Structure Example

```python
class ProductImageAPITestCase(APITestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(...)
        self.user = User.objects.create(...)
        self.product = Product.objects.create(...)
        self.client.force_authenticate(user=self.user)
        
    def test_list_product_images(self):
        """Test GET /api/products/images/"""
        # Create test images
        # Make request
        # Assert response
        pass
    
    def test_set_primary_endpoint(self):
        """Test POST /api/products/images/{id}/set-primary/"""
        # Create images
        # Call endpoint
        # Assert primary set
        pass
    
    # ... more tests

class VariantImageAPITestCase(APITestCase):
    # Similar structure for variant endpoints
    pass
```

### Expected Test Coverage

| Endpoint Group | Test Count | Coverage Target |
|----------------|------------|-----------------|
| CRUD Operations | 8-10 tests | 100% |
| Custom Actions | 6-8 tests | 100% |
| Permissions | 6-8 tests | 100% |
| Filtering/Ordering | 4-5 tests | 95%+ |
| Tenant Isolation | 3-4 tests | 100% |
| Variant Endpoints | 6-8 tests | 95%+ |

### Expected Outcome
```
backend/apps/products/media/tests/
├── __init__.py
├── test_models.py
├── test_processing.py
├── test_variant_images.py
├── test_api_upload.py
└── test_api_endpoints.py (NEW)

ProductImageAPITestCase: 25-30 tests
VariantImageAPITestCase: 10-15 tests
Total: 35-45 comprehensive API tests
95%+ ViewSet and endpoint coverage
```

### Verification Checklist
- [ ] test_api_endpoints.py file created
- [ ] ProductImageAPITestCase class defined
- [ ] List endpoint tests (4-5)
- [ ] Retrieve endpoint tests (2-3)
- [ ] Create/Update/Delete tests (4-5)
- [ ] Set primary endpoint test
- [ ] Reorder endpoint tests (2)
- [ ] Download endpoint tests (2)
- [ ] Optimize endpoint tests (4-5)
- [ ] Cleanup endpoint tests (3-4)
- [ ] Permission tests (6-8)
- [ ] Tenant isolation tests (3-4)
- [ ] VariantImageAPITestCase class defined
- [ ] Variant CRUD tests (5-6)
- [ ] Variant inheritance test
- [ ] Helper methods created
- [ ] All tests pass
- [ ] 95%+ API endpoint coverage achieved

---

## Task 84: Write Optimization Tests

### Overview
Create comprehensive tests for image optimization features including WebP conversion, batch optimization, compression analysis, and CDN integration.

### Dependencies
- Task 49-54: WebP conversion functionality
- Task 55-60: Responsive images, CDN, LQIP
- Task 61-64: Batch optimization, reports, caching

### Instructions

1. **Create test_optimization.py file**
   - In tests directory
   - Add module docstring

2. **Import required modules**
   - Import TestCase, TransactionTestCase
   - Import optimization services
   - Import models
   - Import mock, patch

3. **Create WebPConversionTestCase class**
   - Test WebPConverter service
   - Test lossless and lossy conversion
   - Test browser detection

4. **Test WebP converter initialization**
   - test_webp_converter_init()
   - Create converter instance
   - Verify settings loaded

5. **Test PNG to WebP lossless**
   - test_convert_png_to_webp_lossless()
   - Load PNG file
   - Convert to WebP
   - Verify lossless quality
   - Check file size

6. **Test JPEG to WebP lossy**
   - test_convert_jpeg_to_webp_lossy()
   - Load JPEG file
   - Convert with lossy compression
   - Verify quality acceptable
   - Check file size reduction

7. **Test WebP quality settings**
   - test_webp_quality_parameter()
   - Convert with different quality levels
   - Verify quality applied
   - Check file sizes vary appropriately

8. **Test WebP fallback**
   - test_webp_fallback_to_original()
   - Simulate browser without WebP support
   - Request image
   - Verify original format returned

9. **Test browser detection helper**
   - test_detect_webp_support()
   - Mock user agent headers
   - Call detection function
   - Verify correct detection

10. **Create ResponsiveImageTestCase class**
    - Test ResponsiveImageService
    - Test srcset generation
    - Test picture element data

11. **Test srcset generation**
    - test_generate_srcset()
    - Create image with variants
    - Generate srcset
    - Verify format correct
    - Check all variants included

12. **Test sizes attribute**
    - test_generate_sizes_attribute()
    - For responsive breakpoints
    - Verify sizes string format

13. **Test picture element data**
    - test_generate_picture_element_data()
    - With WebP and fallback
    - Verify source elements
    - Check media queries

14. **Test lazy loading attributes**
    - test_lazy_loading_attributes()
    - Generate attributes
    - Verify loading="lazy"
    - Check decoding="async"

15. **Test LQIP generation**
    - test_generate_lqip()
    - Create image
    - Generate LQIP
    - Verify small size (< 2KB)
    - Check base64 encoding

16. **Test LQIP quality**
    - test_lqip_visual_quality()
    - Generate LQIP
    - Verify blurred but recognizable
    - Check dimensions (10-20px)

17. **Create CDNIntegrationTestCase class**
    - Test CDN URL generation
    - Test cache headers
    - Mock CDN service

18. **Test CDN URL generation**
    - test_generate_cdn_url()
    - Mock CDN settings
    - Generate URL for variant
    - Verify CDN domain used

19. **Test cache headers**
    - test_cache_control_headers()
    - Generate variant URLs
    - Check Cache-Control header
    - Verify max-age set

20. **Test cache invalidation**
    - test_invalidate_cdn_cache()
    - Update image
    - Verify CDN cache purged
    - Or verify cache-busting parameter

21. **Create BatchOptimizationTestCase class**
    - Test batch optimization command
    - Test bulk operations

22. **Test batch optimize command**
    - test_batch_optimize_command()
    - Run management command
    - Verify all images processed
    - Check status updated

23. **Test batch optimize filtering**
    - test_batch_optimize_filter_by_product()
    - Optimize only specific product
    - Verify only those images processed

24. **Test batch optimize progress**
    - test_batch_optimize_progress_tracking()
    - Mock progress callback
    - Run optimization
    - Verify progress reported

25. **Test optimization report**
    - test_generate_optimization_report()
    - Optimize images
    - Generate report
    - Verify statistics correct
    - Check savings calculated

26. **Test compression analyzer**
    - test_analyze_compression()
    - Analyze optimized image
    - Verify metrics returned
    - Check original vs optimized sizes

27. **Test format migration**
    - test_migrate_jpeg_to_webp()
    - Run migration task
    - Verify WebP variants created
    - Check originals preserved

28. **Test optimization with errors**
    - test_optimization_handles_errors_gracefully()
    - Mock PIL to raise exception
    - Run optimization
    - Verify continues with other images
    - Check errors logged

29. **Test optimization rollback**
    - test_rollback_on_optimization_failure()
    - Mock failure midway
    - Verify partial changes rolled back

30. **Test concurrent optimization**
    - test_concurrent_optimization_tasks()
    - Queue multiple tasks
    - Verify no race conditions
    - Check all complete

### Test Structure Example

```python
class WebPConversionTestCase(TestCase):
    def setUp(self):
        self.converter = WebPConverter()
        self.test_image_path = self._create_test_image()
    
    def test_convert_png_to_webp_lossless(self):
        """Test lossless PNG to WebP conversion"""
        # Load PNG
        # Convert to WebP
        # Assert WebP created
        # Check quality preserved
        pass
    
    # ... more tests

class ResponsiveImageTestCase(TestCase):
    def test_generate_srcset(self):
        """Test srcset generation for responsive images"""
        # Create image with variants
        # Call ResponsiveImageService
        # Assert srcset format correct
        pass

class BatchOptimizationTestCase(TransactionTestCase):
    @mock.patch('apps.products.media.tasks.optimize_image.delay')
    def test_batch_optimize_command(self, mock_task):
        """Test batch optimization management command"""
        # Create images
        # Run command
        # Assert all queued
        pass
```

### Expected Test Coverage

| Component | Test Count | Coverage Target |
|-----------|------------|-----------------|
| WebP Conversion | 6-8 tests | 95%+ |
| Responsive Images | 5-6 tests | 95%+ |
| LQIP Generation | 2-3 tests | 90%+ |
| CDN Integration | 3-4 tests | 90%+ |
| Batch Optimization | 5-6 tests | 95%+ |
| Error Handling | 3-4 tests | 90%+ |

### Expected Outcome
```
backend/apps/products/media/tests/
├── __init__.py
├── test_models.py
├── test_processing.py
├── test_variant_images.py
├── test_api_upload.py
├── test_api_endpoints.py
└── test_optimization.py (NEW)

Multiple test cases:
- WebPConversionTestCase
- ResponsiveImageTestCase
- CDNIntegrationTestCase
- BatchOptimizationTestCase
Total: 25-30 optimization tests
95%+ optimization coverage
```

### Verification Checklist
- [ ] test_optimization.py file created
- [ ] WebPConversionTestCase class defined
- [ ] PNG to WebP lossless test
- [ ] JPEG to WebP lossy test
- [ ] WebP quality tests
- [ ] WebP fallback test
- [ ] Browser detection test
- [ ] ResponsiveImageTestCase class defined
- [ ] srcset generation test
- [ ] sizes attribute test
- [ ] picture element test
- [ ] LQIP tests (2-3)
- [ ] CDNIntegrationTestCase class defined
- [ ] CDN URL generation test
- [ ] Cache header tests
- [ ] BatchOptimizationTestCase class defined
- [ ] Batch command test
- [ ] Optimization report test
- [ ] Compression analyzer test
- [ ] Format migration test
- [ ] Error handling tests (3-4)
- [ ] Concurrent optimization test
- [ ] All tests pass
- [ ] 95%+ optimization coverage achieved

---

## Task 85: Create Media Module Documentation

### Overview
Create comprehensive technical documentation for the media module including architecture overview, API reference, model documentation, and development guidelines.

### Dependencies
- All previous tasks (reference implementation)
- Phase-01 SubPhase-08: Documentation structure

### Instructions

1. **Create docs directory**
   - In `backend/apps/products/media/`
   - Create `docs/` directory

2. **Create README.md overview**
   - File: `docs/README.md`
   - Module overview and introduction
   - Quick start guide
   - Table of contents

3. **Write module overview section**
   - Purpose of media module
   - Key features list:
     - Product image management
     - Variant image support
     - Automatic thumbnail generation
     - WebP conversion
     - Responsive images
     - CDN integration
     - Batch optimization
   - Technology stack

4. **Create architecture.md**
   - File: `docs/architecture.md`
   - System architecture diagram (describe or ASCII)
   - Component overview
   - Data flow diagrams

5. **Document models section**
   - ProductImage model fields
   - VariantImage model fields
   - ImageVariant model fields
   - Relationships and foreign keys
   - Model methods

6. **Create models.md reference**
   - File: `docs/models.md`
   - Complete model field reference
   - Example model usage
   - Model manager methods
   - Custom querysets

7. **Document services section**
   - ImageProcessor service
   - ProductGallery service
   - WebPConverter service
   - ResponsiveImageService
   - Purpose and usage of each

8. **Create services.md reference**
   - File: `docs/services.md`
   - Service class documentation
   - Method signatures
   - Parameters and return values
   - Usage examples

9. **Document Celery tasks**
   - process_product_image_task
   - optimize_image_task
   - batch_optimize_images_task
   - Task parameters
   - Task retry logic

10. **Create tasks.md reference**
    - File: `docs/tasks.md`
    - Task documentation
    - How to queue tasks
    - Monitoring task status

11. **Document API endpoints**
    - All ViewSet endpoints
    - Request/response formats
    - Query parameters
    - Filtering and ordering

12. **Create api.md reference**
    - File: `docs/api.md`
    - Complete API documentation
    - Endpoint table with methods
    - Request examples
    - Response examples
    - Error responses

13. **Document permissions**
    - Permission classes
    - Who can perform what actions
    - Permission matrix table

14. **Create permissions.md reference**
    - File: `docs/permissions.md`
    - Permission documentation
    - Role-based access
    - Tenant isolation

15. **Document configuration**
    - Settings variables
    - Environment variables
    - Default values
    - Tenant-specific settings

16. **Create configuration.md**
    - File: `docs/configuration.md`
    - All configuration options
    - Image size settings
    - Optimization settings
    - CDN settings
    - Storage settings

17. **Document image processing pipeline**
    - Upload flow
    - Processing steps
    - Variant generation
    - WebP conversion
    - Optimization process

18. **Create processing.md**
    - File: `docs/processing.md`
    - Processing pipeline diagram
    - Step-by-step explanation
    - Customization options

19. **Document best practices**
    - Image upload guidelines
    - Recommended image sizes
    - Format recommendations
    - Performance tips

20. **Create best-practices.md**
    - File: `docs/best-practices.md`
    - Development best practices
    - Testing guidelines
    - Performance optimization

21. **Document troubleshooting**
    - Common issues
    - Error messages and solutions
    - Debugging tips

22. **Create troubleshooting.md**
    - File: `docs/troubleshooting.md`
    - FAQ section
    - Common errors
    - Solutions

23. **Document deployment**
    - Production setup
    - Storage configuration
    - CDN setup
    - Scaling considerations

24. **Create deployment.md**
    - File: `docs/deployment.md`
    - Deployment checklist
    - Infrastructure requirements
    - Environment setup

25. **Create CHANGELOG.md**
    - Version history
    - Feature additions
    - Bug fixes
    - Breaking changes

26. **Add inline docstrings**
    - Document all classes with docstrings
    - Document all methods
    - Add parameter descriptions
    - Add return value descriptions

27. **Use consistent format**
    - Follow Markdown conventions
    - Use code blocks with language
    - Add section anchors
    - Include navigation links

### Documentation Structure

```
backend/apps/products/media/docs/
├── README.md                   # Overview and quick start
├── architecture.md             # System architecture
├── models.md                   # Model reference
├── services.md                 # Service classes
├── tasks.md                    # Celery tasks
├── api.md                      # API endpoints
├── permissions.md              # Permission system
├── configuration.md            # Settings and config
├── processing.md               # Image processing pipeline
├── best-practices.md           # Development guidelines
├── troubleshooting.md          # Common issues
├── deployment.md               # Production setup
└── CHANGELOG.md                # Version history
```

### Documentation Content Guidelines

**README.md Example Structure:**
```markdown
# Product Media Module

## Overview
Brief description of the module and its purpose.

## Features
- Feature 1
- Feature 2
...

## Quick Start
Basic usage example

## Documentation
Links to detailed docs

## Architecture
High-level overview

## API Reference
Link to API docs
```

**API.md Example Structure:**
```markdown
# API Reference

## Endpoints

### ProductImage Endpoints

#### List Images
- **Endpoint:** GET /api/products/images/
- **Description:** List all product images
- **Query Parameters:**
  - product: Filter by product ID
  - is_primary: Filter primary images
  - ordering: Sort by field
- **Response:**
```json
{
  "count": 10,
  "results": [...]
}
```
...
```

### Expected Outcome
```
backend/apps/products/media/docs/ (NEW)
├── All documentation files created
├── Comprehensive technical reference
├── Usage examples
├── Troubleshooting guide

Plus inline docstrings in all code files
```

### Verification Checklist
- [ ] docs directory created
- [ ] README.md created with overview
- [ ] architecture.md created
- [ ] models.md with complete reference
- [ ] services.md with service docs
- [ ] tasks.md with Celery task docs
- [ ] api.md with all endpoints
- [ ] permissions.md with permission docs
- [ ] configuration.md with all settings
- [ ] processing.md with pipeline explanation
- [ ] best-practices.md created
- [ ] troubleshooting.md with FAQ
- [ ] deployment.md with production guide
- [ ] CHANGELOG.md initialized
- [ ] Inline docstrings added to all classes
- [ ] Inline docstrings added to all methods
- [ ] Consistent Markdown formatting
- [ ] Code examples included
- [ ] Diagrams or ASCII art included
- [ ] Navigation links between docs

---

## Task 86: Create Media Management Guide

### Overview
Create end-user focused documentation for merchants and staff on how to manage product images through the ERP interface, including upload, organization, and optimization.

### Dependencies
- Task 85: Technical documentation (reference)
- Phase-07: Frontend implementation (for screenshots/descriptions)

### Instructions

1. **Create user-guides directory**
   - In `backend/apps/products/media/docs/`
   - Create `user-guides/` subdirectory

2. **Create media-management-guide.md**
   - File: `docs/user-guides/media-management-guide.md`
   - End-user focused
   - Step-by-step instructions

3. **Write introduction section**
   - What is product media?
   - Why images are important
   - Overview of capabilities

4. **Document image requirements**
   - Recommended image formats (JPEG, PNG)
   - Recommended dimensions
   - Maximum file size
   - Image quality guidelines

5. **Create "Uploading Images" section**
   - How to upload single image
   - How to upload multiple images
   - How to add images to products
   - How to add images to variants

6. **Document upload steps**
   - Step 1: Navigate to product
   - Step 2: Click "Add Images"
   - Step 3: Select files
   - Step 4: Add alt text and descriptions
   - Step 5: Click upload
   - Include screenshots or detailed descriptions

7. **Create "Managing Gallery" section**
   - How to reorder images
   - How to set primary image
   - How to delete images
   - How to edit image metadata

8. **Document gallery organization**
   - Drag-and-drop reordering instructions
   - Setting featured/primary image
   - Best practices for image order

9. **Create "Variant Images" section**
   - What are variant images
   - When to use variant-specific images
   - How to add images to variants
   - Image inheritance explanation

10. **Document variant workflow**
    - Step 1: Navigate to variant
    - Step 2: Choose to use product images or upload new
    - Step 3: Upload variant-specific images
    - Step 4: Organize variant gallery

11. **Create "Image Optimization" section**
    - What is image optimization
    - Benefits of optimization
    - How optimization works
    - WebP format explanation

12. **Document optimization features**
    - Automatic optimization on upload
    - Manual optimization trigger
    - Batch optimization
    - Checking optimization status

13. **Create "Alt Text & Accessibility" section**
    - Importance of alt text
    - How to write good alt text
    - Accessibility best practices
    - SEO benefits

14. **Provide alt text examples**
    - Good examples
    - Bad examples
    - Guidelines for descriptive text

15. **Create "Best Practices" section**
    - Image quality guidelines
    - Recommended dimensions for different uses
    - File naming conventions
    - Organization tips

16. **Document image usage guidelines**
    - Product main images: high-res, white background
    - Lifestyle images: context, in-use shots
    - Detail shots: close-ups, features
    - Variant images: show differences

17. **Create "Troubleshooting" section**
    - Common upload errors
    - What to do if image won't upload
    - File size issues
    - Format issues

18. **Provide solutions for common issues**
    - "File too large" error: How to compress
    - "Invalid format" error: Convert to JPEG/PNG
    - "Gallery limit reached": Delete old images
    - Processing stuck: Contact support

19. **Create "Gallery Limits" section**
    - Explain gallery limits
    - Current limit based on plan
    - How to upgrade
    - Managing within limits

20. **Create "Mobile Considerations" section**
    - Uploading from mobile devices
    - Image optimization for mobile
    - Responsive image delivery

21. **Create FAQ section**
    - Can I upload from my phone?
    - What happens to my original images?
    - How long does processing take?
    - Can I undo changes?
    - How do I bulk upload?

22. **Add visual aids**
    - Describe UI elements
    - Reference button labels
    - Explain icons and indicators
    - Include flowcharts if helpful

23. **Create quick reference card**
   - File: `docs/user-guides/quick-reference.md`
   - One-page cheat sheet
   - Common tasks
   - Keyboard shortcuts (if any)

24. **Create video tutorial outline**
    - File: `docs/user-guides/video-tutorial-outline.md`
    - Script for video tutorial
    - Scenes and demonstrations
    - Talking points

25. **Use clear, simple language**
    - Avoid technical jargon
    - Use screenshots/descriptions extensively
    - Step-by-step instructions
    - Friendly, helpful tone

26. **Add tips and notes**
    - 💡 Tip: Best practices
    - ⚠️ Note: Important information
    - ✅ Success indicators
    - ❌ What to avoid

### User Guide Structure

```
backend/apps/products/media/docs/user-guides/
├── media-management-guide.md   # Main user guide
├── quick-reference.md          # Cheat sheet
└── video-tutorial-outline.md   # Video script
```

### Guide Content Example

**media-management-guide.md Structure:**
```markdown
# Product Media Management Guide

## Introduction
Welcome to the product media management guide...

## Getting Started

### Image Requirements
- **Formats:** JPEG, PNG
- **Max Size:** 10 MB
- **Recommended Dimensions:** 2000x2000 px
...

## Uploading Images

### Single Image Upload
1. Navigate to your product page
2. Click the "Add Image" button in the gallery section
3. Select an image file from your computer
4. Add alt text (e.g., "Blue cotton t-shirt front view")
5. Click "Upload"

💡 **Tip:** Add descriptive alt text for better SEO and accessibility

### Multiple Image Upload
1. Click "Add Images" (plural)
2. Select multiple files (Ctrl+Click or Cmd+Click)
3. Images will be added to queue
4. Click "Upload All"

...

## Managing Your Gallery

### Reordering Images
- Click and drag images to reorder
- The first image is your primary/featured image
- Changes are saved automatically

### Setting Primary Image
- Click the star icon on any image
- This becomes your product's main image
- Displays in product listings and search results

...

## Variant Images

### When to Use Variant Images
Use variant-specific images when:
- Color variations look significantly different
- Size variations need scale reference
- Material variations have different texture

### How to Add Variant Images
1. Navigate to product variants section
2. Select a variant
3. Click "Add Variant Images"
4. Upload images specific to this variant

**Note:** If no variant images are uploaded, product images will be shown by default.

...

## Troubleshooting

### "File Too Large" Error
Your image exceeds the 10 MB limit.
**Solution:**
1. Use an image compression tool
2. Reduce image dimensions
3. Try uploading in JPEG format instead of PNG

### Image Not Processing
If your image is stuck "Processing"...
**Solution:**
1. Wait 2-3 minutes
2. Refresh the page
3. If still stuck, contact support with the image ID

...

## FAQ

**Q: Can I upload images from my phone?**
A: Yes! The uploader works on mobile devices...

**Q: What happens to my original images?**
A: Original images are stored safely. We create optimized versions...

...
```

### Expected Outcome
```
backend/apps/products/media/docs/user-guides/ (NEW)
├── media-management-guide.md (15-25 pages)
├── quick-reference.md (1-2 pages)
└── video-tutorial-outline.md (3-5 pages)

Comprehensive end-user documentation:
- Clear, jargon-free language
- Step-by-step instructions
- Troubleshooting solutions
- Best practices and tips
```

### Verification Checklist
- [ ] user-guides directory created
- [ ] media-management-guide.md created
- [ ] Introduction section written
- [ ] Image requirements documented
- [ ] Upload instructions (single & bulk)
- [ ] Gallery management section
- [ ] Reordering instructions
- [ ] Set primary image instructions
- [ ] Variant images section
- [ ] Image optimization section
- [ ] Alt text & accessibility section
- [ ] Alt text examples provided
- [ ] Best practices section
- [ ] Image usage guidelines
- [ ] Troubleshooting section
- [ ] Common issues with solutions
- [ ] Gallery limits section
- [ ] Mobile considerations section
- [ ] FAQ section (10+ questions)
- [ ] Visual aid descriptions
- [ ] Tips and notes included
- [ ] quick-reference.md created
- [ ] video-tutorial-outline.md created
- [ ] Clear, simple language used
- [ ] Friendly, helpful tone maintained

---

## Summary

This document completed the testing and documentation:

- **API Endpoint Tests**: 35-45 comprehensive tests for all ViewSet endpoints, CRUD operations, custom actions, and permissions (95%+ coverage)
- **Optimization Tests**: 25-30 tests for WebP conversion, responsive images, LQIP, CDN, batch optimization, and error handling (95%+ coverage)
- **Technical Documentation**: Complete developer reference including architecture, models, services, tasks, API, permissions, configuration, and deployment
- **User Guide**: End-user focused media management guide with step-by-step instructions, best practices, troubleshooting, and FAQ

**Total Testing Summary:**
- Task 79: ~20-25 model tests
- Task 80: ~20-25 processing tests
- Task 81: ~15-20 variant tests
- Task 82: ~20-25 upload API tests
- Task 83: ~35-45 endpoint API tests
- Task 84: ~25-30 optimization tests
**Grand Total: ~135-170 comprehensive tests** covering the entire media module with 95%+ code coverage.

---

## SubPhase Completion

**🎉 SubPhase-07 Product Media is now complete!**

All 86 tasks implemented across 6 groups:
- **Group A**: Core models and relationships (Tasks 1-16)
- **Group B**: Image processing and services (Tasks 17-32)
- **Group C**: Variant images and gallery (Tasks 33-48)
- **Group D**: WebP optimization and CDN (Tasks 49-64)
- **Group E**: API serializers and views (Tasks 65-78)
- **Group F**: Testing and documentation (Tasks 79-86)

The media module provides:
✅ Complete image management system
✅ Automatic variant generation
✅ WebP conversion and optimization
✅ Responsive image delivery
✅ CDN integration
✅ Comprehensive testing (95%+ coverage)
✅ Full technical and user documentation

---

## Next Steps

Continue to [SubPhase-08: Inventory & Stock Management](../../SubPhase-08_Inventory-Stock/00_SUBPHASE_SUMMARY.md) to implement inventory tracking, stock levels, warehouse management, and stock movements.
