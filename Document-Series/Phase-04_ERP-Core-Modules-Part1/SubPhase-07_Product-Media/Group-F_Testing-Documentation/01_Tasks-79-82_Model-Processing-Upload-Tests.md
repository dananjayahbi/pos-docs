# Tasks 79-82: Model, Processing & Upload Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Media-Serializers-API-Views/03_Tasks-75-78_Endpoints-Permissions.md](../Group-E_Media-Serializers-API-Views/03_Tasks-75-78_Endpoints-Permissions.md)
- **→ Next Document:** [02_Tasks-83-86_API-Optimization-Docs.md](02_Tasks-83-86_API-Optimization-Docs.md)

---

## Document Overview

This document covers comprehensive testing for the media module including model tests, image processing tests, variant image tests, and API upload endpoint tests.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Write ProductImage model tests | High |
| 80 | Write image processing tests | High |
| 81 | Write VariantImage tests | Medium |
| 82 | Write upload endpoint tests | Medium |

---

## Task 79: Write ProductImage Model Tests

### Overview
Create comprehensive unit tests for the ProductImage model including creation, validation, relationships, methods, and edge cases.

### Dependencies
- Task 01: Create ProductImage model
- Phase-03 SubPhase-10: File storage configuration
- Django testing framework

### Instructions

1. **Create tests directory structure**
   - Navigate to `backend/apps/products/media/`
   - Create `tests/` directory
   - Create `__init__.py` in tests directory

2. **Create test_models.py file**
   - In tests directory
   - Add module docstring

3. **Import required modules**
   - Import TestCase from django.test
   - Import ProductImage, Product, Tenant models
   - Import File, SimpleUploadedFile for file handling
   - Import mock for external dependencies
   - Import factory_boy factories if available

4. **Create ProductImageModelTestCase class**
   - Inherit from TestCase
   - Add setUpTestData class method
   - Create fixtures (tenant, product, sample images)

5. **Test basic creation**
   - test_create_product_image()
   - Create ProductImage with minimum required fields
   - Assert instance saved successfully
   - Verify all fields set correctly

6. **Test field validations**
   - test_image_field_required()
   - test_alt_text_max_length()
   - test_display_order_default_value()
   - Verify field constraints enforced

7. **Test file upload**
   - test_image_upload()
   - Create SimpleUploadedFile with test image
   - Assign to ProductImage.image field
   - Verify file saved to correct path
   - Check upload_to function works

8. **Test upload path generation**
   - test_image_upload_path()
   - Mock uuid4 for predictable path
   - Create image and verify path structure
   - Should be: products/{product_id}/images/{uuid}.{ext}

9. **Test unique constraints**
   - test_display_order_not_unique_per_product()
   - Multiple images can have same display_order
   - Or test unique constraint if implemented

10. **Test is_primary field**
    - test_is_primary_default_false()
    - test_only_one_primary_per_product()
    - Use set_as_primary method
    - Verify constraint enforced

11. **Test set_as_primary method**
    - test_set_as_primary()
    - Create multiple images for product
    - Call set_as_primary on one
    - Verify only that image has is_primary=True
    - Check others set to False

12. **Test get_absolute_url method**
    - test_get_absolute_url()
    - Verify returns correct URL
    - Check URL structure

13. **Test relationships**
    - test_product_relationship()
    - Verify foreign key to Product works
    - Test cascade deletion
    - Check reverse relationship

14. **Test cascade deletion**
    - test_delete_product_deletes_images()
    - Create product with images
    - Delete product
    - Verify images also deleted (if cascade set)
    - Or verify images kept if protected

15. **Test file deletion on model delete**
    - test_delete_image_deletes_file()
    - Create image
    - Note file path
    - Delete model instance
    - Verify physical file deleted
    - Use pre_delete or post_delete signal

16. **Test metadata fields**
    - test_width_height_auto_populated()
    - Upload image
    - Verify width and height extracted
    - Check values correct

17. **Test processing status**
    - test_default_processing_status()
    - Verify default is 'pending'
    - Test status transitions

18. **Test file size tracking**
    - test_file_size_calculated()
    - Upload file of known size
    - Verify file_size_bytes field populated

19. **Test thumbnail generation**
    - test_thumbnail_generated_on_save()
    - Create image
    - Trigger processing
    - Verify thumbnail variant created
    - Or verify signal triggered

20. **Test queryset methods**
    - test_primary_images_queryset()
    - If custom manager with .primary() method
    - Verify returns only primary images

21. **Test tenant isolation**
    - test_images_filtered_by_tenant()
    - Create images in different tenants
    - Query from tenant context
    - Verify only tenant images returned

22. **Test edge cases**
    - test_create_without_product_fails()
    - test_invalid_image_format_fails()
    - test_file_too_large_fails()
    - test_duplicate_primary_prevention()

23. **Test string representation**
    - test_str_method()
    - Verify __str__ returns expected format

24. **Use factories for test data**
    - Create ProductImageFactory with factory_boy
    - Use in tests for cleaner setup
    - Reduces boilerplate

### Test Structure Example

```python
class ProductImageModelTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create tenant
        # Create product
        # Create sample image file
        pass
    
    def test_create_product_image(self):
        """Test basic ProductImage creation"""
        # Create image
        # Assert fields
        pass
    
    def test_set_as_primary(self):
        """Test setting image as primary"""
        # Create multiple images
        # Set one as primary
        # Assert only one is primary
        pass
    
    # ... more tests
```

### Expected Test Coverage

| Component | Test Count | Coverage Target |
|-----------|------------|-----------------|
| Model Creation | 3-5 tests | 100% |
| Field Validation | 5-7 tests | 100% |
| Methods | 3-4 tests | 100% |
| Relationships | 2-3 tests | 100% |
| File Handling | 4-5 tests | 95%+ |
| Edge Cases | 5-7 tests | 90%+ |

### Expected Outcome
```
backend/apps/products/media/tests/
├── __init__.py (NEW)
└── test_models.py (NEW)

ProductImageModelTestCase with:
- 20-25 comprehensive tests
- 95%+ model coverage
- Edge cases handled
- File operations tested
```

### Verification Checklist
- [ ] tests directory created
- [ ] test_models.py file created
- [ ] ProductImageModelTestCase class defined
- [ ] setUpTestData method implemented
- [ ] test_create_product_image test
- [ ] Field validation tests (3-5)
- [ ] test_image_upload test
- [ ] test_image_upload_path test
- [ ] test_set_as_primary test
- [ ] test_get_absolute_url test
- [ ] Relationship tests
- [ ] Cascade deletion tests
- [ ] File deletion test
- [ ] Metadata fields tests
- [ ] Processing status tests
- [ ] Thumbnail generation test
- [ ] Tenant isolation test
- [ ] Edge case tests (5+)
- [ ] String representation test
- [ ] All tests pass
- [ ] 95%+ code coverage achieved

---

## Task 80: Write Image Processing Tests

### Overview
Create comprehensive tests for image processing functionality including Celery tasks, variant generation, WebP conversion, and optimization.

### Dependencies
- Task 20: Create Celery task for image processing
- Task 49-54: WebP conversion functionality
- Task 55-60: Responsive image service

### Instructions

1. **Create test_processing.py file**
   - In tests directory
   - Add module docstring

2. **Import required modules**
   - Import TestCase, TransactionTestCase
   - Import Celery task test utilities
   - Import mock, patch decorators
   - Import Pillow (PIL)
   - Import ProductImage, ImageVariant models

3. **Create ImageProcessingTestCase class**
   - Inherit from TransactionTestCase (for Celery)
   - Or use @override_settings(CELERY_TASK_ALWAYS_EAGER=True)
   - Set up test fixtures

4. **Test task execution**
   - test_process_product_image_task()
   - Create ProductImage
   - Call process_product_image_task.delay(image_id)
   - Verify task completes successfully
   - Check processing_status updated

5. **Test variant generation**
   - test_generate_all_variants()
   - Create image
   - Trigger processing
   - Verify all variant sizes created (thumbnail, small, medium, large)
   - Check ImageVariant records exist

6. **Test variant dimensions**
   - test_variant_dimensions_correct()
   - For each variant size
   - Verify width/height match configuration
   - Check aspect ratio preserved

7. **Test variant quality**
   - test_variant_quality_settings()
   - Verify quality parameter applied
   - Check file sizes reduced appropriately

8. **Test WebP conversion**
   - test_webp_variants_created()
   - Process image
   - Verify WebP format variants created
   - Check both original format and WebP exist

9. **Test lossless PNG to WebP**
   - test_png_to_webp_lossless()
   - Upload PNG image
   - Process with WebP converter
   - Verify WebP created
   - Check quality preserved

10. **Test lossy JPEG to WebP**
    - test_jpeg_to_webp_lossy()
    - Upload JPEG image
    - Process with lossy conversion
    - Verify file size reduction
    - Check acceptable quality

11. **Test image format detection**
    - test_detect_image_format()
    - Test with JPEG, PNG, WebP files
    - Verify format detected correctly
    - Handle corrupted files gracefully

12. **Test invalid image handling**
    - test_process_invalid_image()
    - Upload corrupted file
    - Trigger processing
    - Verify processing_status='failed'
    - Check error logged

13. **Test metadata extraction**
    - test_extract_image_metadata()
    - Upload image with EXIF data
    - Process image
    - Verify metadata extracted
    - Check width, height, format stored

14. **Test optimization**
    - test_image_optimization()
    - Upload large image
    - Trigger optimization
    - Verify file size reduced
    - Check original_size vs optimized_size

15. **Test batch processing**
    - test_batch_optimize_images()
    - Create multiple images
    - Call batch optimization
    - Verify all processed
    - Check task completion

16. **Test processing rollback on error**
    - test_rollback_on_processing_error()
    - Mock PIL to raise exception
    - Trigger processing
    - Verify transaction rolled back
    - Image status set to failed

17. **Test concurrent processing**
    - test_concurrent_image_processing()
    - Queue multiple tasks simultaneously
    - Verify no race conditions
    - Check all complete successfully

18. **Test responsive image generation**
    - test_generate_srcset()
    - Process image
    - Call ResponsiveImageService
    - Verify srcset generated
    - Check URLs correct

19. **Test LQIP generation**
    - test_generate_lqip()
    - Process image
    - Verify low-quality placeholder created
    - Check base64 encoded

20. **Test CDN URL generation**
    - test_cdn_urls()
    - Mock CDN settings
    - Generate variant URLs
    - Verify CDN domain used

21. **Test cache headers**
    - test_cache_headers_set()
    - Generate variant URLs
    - Check Cache-Control headers
    - Verify expiration times

22. **Test processing hooks**
    - test_pre_processing_signal()
    - test_post_processing_signal()
    - Verify signals sent
    - Check handlers called

23. **Use mocking for external services**
    - Mock S3/CDN uploads
    - Mock Celery task execution
    - Faster test execution

### Test Structure Example

```python
@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class ImageProcessingTestCase(TransactionTestCase):
    def setUp(self):
        # Create test image
        # Set up mocks
        pass
    
    def test_process_product_image_task(self):
        """Test Celery task processes image successfully"""
        # Create image
        # Trigger task
        # Assert variants created
        pass
    
    @mock.patch('apps.products.media.services.WebPConverter')
    def test_webp_conversion(self, mock_converter):
        """Test WebP conversion service called"""
        # Configure mock
        # Process image
        # Assert converter called
        pass
    
    # ... more tests
```

### Expected Test Coverage

| Component | Test Count | Coverage Target |
|-----------|------------|-----------------|
| Task Execution | 3-4 tests | 100% |
| Variant Generation | 4-5 tests | 100% |
| WebP Conversion | 4-5 tests | 95%+ |
| Optimization | 3-4 tests | 90%+ |
| Error Handling | 4-5 tests | 100% |
| Responsive Images | 3-4 tests | 90%+ |

### Expected Outcome
```
backend/apps/products/media/tests/
├── __init__.py
├── test_models.py
└── test_processing.py (NEW)

ImageProcessingTestCase with:
- 20-25 processing tests
- Mock external dependencies
- Async task testing
- 90%+ processing coverage
```

### Verification Checklist
- [ ] test_processing.py file created
- [ ] ImageProcessingTestCase class defined
- [ ] Celery ALWAYS_EAGER configured
- [ ] test_process_product_image_task test
- [ ] Variant generation tests (4-5)
- [ ] Variant dimension tests
- [ ] Variant quality tests
- [ ] WebP conversion tests (4-5)
- [ ] Format detection test
- [ ] Invalid image handling test
- [ ] Metadata extraction test
- [ ] Optimization tests (3-4)
- [ ] Batch processing test
- [ ] Error rollback test
- [ ] Concurrent processing test
- [ ] Responsive image tests (3-4)
- [ ] LQIP generation test
- [ ] CDN URL test
- [ ] Signal/hook tests
- [ ] Mocks used appropriately
- [ ] All tests pass
- [ ] 90%+ processing coverage achieved

---

## Task 81: Write VariantImage Tests

### Overview
Create tests for VariantImage model including inheritance from product images, variant-specific galleries, and variant image management.

### Dependencies
- Task 33: Create VariantImage model
- Task 38: Add image inheritance logic
- Task 79: Write ProductImage model tests (reference pattern)

### Instructions

1. **Create test_variant_images.py file**
   - In tests directory
   - Add module docstring

2. **Import required modules**
   - Import TestCase
   - Import ProductImage, VariantImage models
   - Import Product, ProductVariant models
   - Import File utilities

3. **Create VariantImageModelTestCase class**
   - Inherit from TestCase
   - Set up test fixtures
   - Create product with variants

4. **Test basic creation**
   - test_create_variant_image()
   - Create VariantImage for variant
   - Verify saved successfully
   - Check all fields set

5. **Test variant relationship**
   - test_variant_foreign_key()
   - Verify relationship to ProductVariant
   - Test reverse relationship
   - Check cascade behavior

6. **Test image inheritance**
   - test_inherit_product_images()
   - Create product images
   - Create variant without images
   - Call get_variant_images utility
   - Verify returns product images

7. **Test no inheritance with own images**
   - test_no_inheritance_when_variant_has_images()
   - Create product images
   - Create variant images
   - Call get_variant_images
   - Verify returns only variant images

8. **Test set_as_primary for variant**
   - test_set_variant_image_as_primary()
   - Create multiple variant images
   - Set one as primary
   - Verify only one primary per variant

9. **Test copy image to variant**
   - test_copy_product_image_to_variant()
   - Create product image
   - Use ProductGallery.copy_image_to_variant()
   - Verify new VariantImage created
   - Check file copied

10. **Test variant gallery ordering**
    - test_variant_image_display_order()
    - Create multiple variant images
    - Set display orders
    - Query in order
    - Verify correct sequence

11. **Test variant gallery reorder**
    - test_reorder_variant_gallery()
    - Create variant images
    - Call reorder with new order
    - Verify display_order updated

12. **Test variant gallery limits**
    - test_variant_gallery_limit()
    - If separate limit for variants
    - Create images up to limit
    - Verify cannot exceed
    - Or verify uses product limit

13. **Test variant image upload path**
    - test_variant_image_upload_path()
    - Create variant image
    - Verify path includes variant identifier
    - Should be: products/{product_id}/variants/{variant_id}/images/{uuid}.{ext}

14. **Test tenant isolation**
    - test_variant_images_tenant_isolation()
    - Create variants in different tenants
    - Query variant images
    - Verify tenant filtering

15. **Test deletion**
    - test_delete_variant_deletes_images()
    - Create variant with images
    - Delete variant
    - Verify images deleted (if cascade)

16. **Test bulk upload to variant**
    - test_bulk_upload_to_variant()
    - Use bulk upload handler
    - Upload multiple files to variant
    - Verify all created

17. **Test variant-specific metadata**
    - test_variant_image_metadata()
    - If variant images have additional metadata
    - Verify fields populated

18. **Test swap with product image**
    - test_swap_variant_image()
    - Create product and variant images
    - Swap display order
    - Verify order updated

### Test Structure Example

```python
class VariantImageModelTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create tenant
        # Create product
        # Create variants
        # Create sample images
        pass
    
    def test_inherit_product_images(self):
        """Test variant inherits product images when it has none"""
        # Create product images
        # Create variant without images
        # Call get_variant_images
        # Assert returns product images
        pass
    
    def test_copy_product_image_to_variant(self):
        """Test copying product image to variant"""
        # Create product image
        # Call copy_image_to_variant
        # Assert new VariantImage created
        pass
    
    # ... more tests
```

### Expected Test Coverage

| Component | Test Count | Coverage Target |
|-----------|------------|-----------------|
| Model Creation | 2-3 tests | 100% |
| Relationships | 2-3 tests | 100% |
| Inheritance Logic | 3-4 tests | 100% |
| Gallery Operations | 4-5 tests | 95%+ |
| File Operations | 3-4 tests | 90%+ |

### Expected Outcome
```
backend/apps/products/media/tests/
├── __init__.py
├── test_models.py
├── test_processing.py
└── test_variant_images.py (NEW)

VariantImageModelTestCase with:
- 15-20 comprehensive tests
- Inheritance logic tested
- Gallery operations covered
- 95%+ VariantImage coverage
```

### Verification Checklist
- [ ] test_variant_images.py file created
- [ ] VariantImageModelTestCase class defined
- [ ] test_create_variant_image test
- [ ] Variant relationship test
- [ ] Inheritance tests (3-4)
- [ ] set_as_primary for variant test
- [ ] Copy image to variant test
- [ ] Gallery ordering tests
- [ ] Gallery reorder test
- [ ] Gallery limit test (if applicable)
- [ ] Upload path test
- [ ] Tenant isolation test
- [ ] Deletion cascade test
- [ ] Bulk upload test
- [ ] Metadata tests
- [ ] Swap image test
- [ ] All tests pass
- [ ] 95%+ VariantImage coverage achieved

---

## Task 82: Write Upload Endpoint Tests

### Overview
Create comprehensive API tests for image upload endpoints including single upload, bulk upload, validation, error handling, and permission checks.

### Dependencies
- Task 71: Add image upload endpoint
- Task 78: Create image permissions
- Django REST framework testing

### Instructions

1. **Create test_api_upload.py file**
   - In tests directory
   - Add module docstring

2. **Import required modules**
   - Import APITestCase from rest_framework.test
   - Import status from rest_framework
   - Import reverse for URL generation
   - Import ProductImage, Product models
   - Import User, Tenant models

3. **Create ProductImageUploadAPITestCase class**
   - Inherit from APITestCase
   - Set up test fixtures
   - Create authenticated client

4. **Set up authentication**
   - Create test user
   - Create tenant
   - Authenticate client
   - Set tenant context

5. **Test single image upload**
   - test_upload_single_image()
   - Create test image file
   - POST to /api/products/images/upload/
   - Verify 201 Created response
   - Check image created in database

6. **Test upload with metadata**
   - test_upload_with_alt_text()
   - Upload image with alt_text
   - Verify metadata saved
   - Check all fields populated

7. **Test upload and set as primary**
   - test_upload_and_set_primary()
   - Upload with is_primary=true
   - Verify image is primary
   - Check other images not primary

8. **Test bulk image upload**
   - test_bulk_upload_multiple_images()
   - Create multiple test files
   - POST all at once
   - Verify all created
   - Check response contains all images

9. **Test upload validation**
   - test_upload_without_file_fails()
   - POST without file
   - Verify 400 Bad Request
   - Check error message

10. **Test upload without product fails**
    - test_upload_without_product_id_fails()
    - POST without product_id
    - Verify 400 Bad Request

11. **Test invalid file format**
    - test_upload_invalid_format_fails()
    - Upload .txt file as image
    - Verify validation error
    - Check appropriate error message

12. **Test file size validation**
    - test_upload_file_too_large_fails()
    - Create file exceeding size limit
    - Upload file
    - Verify 400 Bad Request
    - Check error indicates size limit

13. **Test gallery limit enforcement**
    - test_upload_exceeding_gallery_limit()
    - Create images up to limit
    - Attempt to upload one more
    - Verify 400 Bad Request
    - Check error indicates limit reached

14. **Test permission checks**
    - test_upload_requires_authentication()
    - Unauthenticated request
    - Verify 401 Unauthorized

15. **Test upload permission**
    - test_upload_requires_permission()
    - Create user without upload permission
    - Attempt upload
    - Verify 403 Forbidden

16. **Test tenant isolation**
    - test_cannot_upload_to_other_tenant_product()
    - Create product in different tenant
    - Attempt to upload image
    - Verify 403 or 404

17. **Test product ownership**
    - test_upload_to_owned_product_only()
    - If per-user product ownership
    - Verify can only upload to own products

18. **Test upload triggers processing**
    - test_upload_triggers_celery_task()
    - Mock Celery task
    - Upload image
    - Verify task called with image ID

19. **Test processing status set**
    - test_initial_processing_status()
    - Upload image
    - Check processing_status='pending'

20. **Test variant upload endpoint**
    - test_upload_to_variant()
    - POST to /api/variants/images/upload/
    - With variant_id
    - Verify VariantImage created

21. **Test upload response format**
    - test_upload_response_structure()
    - Upload image
    - Verify response includes:
      - id, url, thumbnail_url
      - processing_status
      - All metadata

22. **Test concurrent uploads**
    - test_concurrent_uploads()
    - Simulate multiple simultaneous uploads
    - Verify all succeed
    - No race conditions

23. **Test upload rollback on error**
    - test_upload_rollback_on_save_error()
    - Mock save to raise exception
    - Attempt upload
    - Verify database clean (no partial records)

### Test Structure Example

```python
class ProductImageUploadAPITestCase(APITestCase):
    def setUp(self):
        # Create tenant
        # Create user
        # Authenticate client
        # Create product
        pass
    
    def test_upload_single_image(self):
        """Test uploading a single image via API"""
        url = reverse('productimage-upload')
        data = {
            'product_id': self.product.id,
            'image': self._create_test_image(),
            'alt_text': 'Test image'
        }
        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ProductImage.objects.count(), 1)
        # ... more assertions
    
    def _create_test_image(self):
        """Helper to create test image file"""
        # Create SimpleUploadedFile with image data
        pass
    
    # ... more tests
```

### Expected Test Coverage

| Component | Test Count | Coverage Target |
|-----------|------------|-----------------|
| Upload Operations | 4-5 tests | 100% |
| Validation | 6-8 tests | 100% |
| Permissions | 5-6 tests | 100% |
| Error Handling | 4-5 tests | 95%+ |
| Integration | 3-4 tests | 90%+ |

### Expected Outcome
```
backend/apps/products/media/tests/
├── __init__.py
├── test_models.py
├── test_processing.py
├── test_variant_images.py
└── test_api_upload.py (NEW)

ProductImageUploadAPITestCase with:
- 20-25 API upload tests
- All validation tested
- Permissions enforced
- 95%+ upload endpoint coverage
```

### Verification Checklist
- [ ] test_api_upload.py file created
- [ ] ProductImageUploadAPITestCase class defined
- [ ] Authentication setup
- [ ] test_upload_single_image test
- [ ] test_upload_with_metadata test
- [ ] test_upload_and_set_primary test
- [ ] test_bulk_upload_multiple_images test
- [ ] Validation tests (6-8)
- [ ] Permission tests (5-6)
- [ ] Tenant isolation test
- [ ] Product ownership test
- [ ] Processing trigger test
- [ ] Processing status test
- [ ] Variant upload test
- [ ] Response format test
- [ ] Concurrent uploads test
- [ ] Error rollback test
- [ ] Helper methods for test data
- [ ] All tests pass
- [ ] 95%+ upload API coverage achieved

---

## Summary

This document created comprehensive testing for models and core functionality:

- **ProductImage Model Tests**: 20-25 tests covering creation, validation, methods, relationships, and edge cases (95%+ coverage)
- **Image Processing Tests**: 20-25 tests for Celery tasks, variant generation, WebP conversion, and optimization (90%+ coverage)
- **VariantImage Tests**: 15-20 tests for inheritance logic, gallery operations, and variant-specific features (95%+ coverage)
- **Upload Endpoint Tests**: 20-25 API tests for upload operations, validation, permissions, and error handling (95%+ coverage)

Total: ~80-95 comprehensive tests ensuring robust media functionality.

---

## Next Steps

Continue to [02_Tasks-83-86_API-Optimization-Docs.md](02_Tasks-83-86_API-Optimization-Docs.md) to complete API endpoint tests, optimization tests, and create comprehensive documentation.
