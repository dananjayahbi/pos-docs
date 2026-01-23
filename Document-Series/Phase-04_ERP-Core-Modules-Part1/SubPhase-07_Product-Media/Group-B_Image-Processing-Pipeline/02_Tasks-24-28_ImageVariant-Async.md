# Tasks 24-28: ImageVariant Model & Async Processing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** B - Image Processing Pipeline  
> **Document:** 02 of 03  
> **Tasks Covered:** 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-23_ImageProcessor-Service.md](01_Tasks-17-23_ImageProcessor-Service.md)
- **→ Next Document:** [03_Tasks-29-32_Quality-Errors-Cleanup.md](03_Tasks-29-32_Quality-Errors-Cleanup.md)

---

## Document Overview

This document covers the ImageVariant model for storing paths to generated image sizes, implementing async variant generation with post-save signals and Celery tasks, adding processing status tracking, and fixing image orientation issues.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 24 | Create ImageVariant model | Medium |
| 25 | Add variant generation on save | High |
| 26 | Create Celery task for processing | High |
| 27 | Add processing status field | Low |
| 28 | Implement image orientation fix | Medium |

---

## Task 24: Create ImageVariant Model

### Overview
Create a model to store paths to generated image variants (thumbnail, medium, large) separately from the original ProductImage. This allows tracking processing status and storing multiple formats.

### Dependencies
- Task 05: Create ProductImage model

### Instructions

1. **Create model file**
   - Create `image_variant.py` in `backend/apps/products/media/models/`

2. **Import required modules**
   - Import models from django.db
   - Import ProductImage model

3. **Define ImageVariant model**
   - Create class inheriting from models.Model
   - Link to ProductImage with OneToOneField
   - Set on_delete=CASCADE
   - Set related_name='variants'

4. **Add variant path fields**
   - `thumbnail_path` as CharField(max_length=500, blank=True)
   - `medium_path` as CharField(max_length=500, blank=True)
   - `large_path` as CharField(max_length=500, blank=True)
   - Store relative paths to generated images

5. **Add timestamps**
   - `created_at` as DateTimeField(auto_now_add=True)
   - `updated_at` as DateTimeField(auto_now=True)

6. **Add Meta class**
   - Set db_table = 'products_image_variants'
   - Set verbose_name = 'Image Variant'

7. **Add string representation**
   - Return f"Variants for Image {product_image.id}"

### Expected Outcome
```
ProductImage (1) ─────< (1) ImageVariant
    │                          │
    │                          ├── thumbnail_path
    │                          ├── medium_path
    │                          └── large_path
```

### Verification Checklist
- [ ] image_variant.py file created
- [ ] ImageVariant model defined with OneToOneField to ProductImage
- [ ] Three path fields (thumbnail, medium, large)
- [ ] Timestamps added
- [ ] Meta class configured

---

## Task 25: Add Variant Generation on Save

### Overview
Implement post_save signal to automatically trigger variant generation when a ProductImage is created or updated. Uses async Celery task to avoid blocking the upload request.

### Dependencies
- Task 24: Create ImageVariant model

### Instructions

1. **Open signals.py**
   - Add post_save signal for ProductImage

2. **Import required modules**
   - Import post_save from django.db.models.signals
   - Import ProductImage
   - Import ImageVariant

3. **Create post_save receiver**
   - Define function `trigger_variant_generation`
   - Decorate with @receiver(post_save, sender=ProductImage)
   - Accept sender, instance, created, **kwargs

4. **Create ImageVariant if new image**
   - If created=True, create ImageVariant instance
   - Link to ProductImage: `ImageVariant.objects.create(product_image=instance)`

5. **Trigger async task**
   - Import Celery task (will create in Task 26)
   - Call `process_image_variants.delay(instance.id)`
   - Uses .delay() for async execution

6. **Handle updates**
   - If image file changed, retrigger processing
   - Check if instance.image has changed
   - Trigger task again for new file

### Signal Flow
```
ProductImage.save()
        │
        ▼
post_save signal
        │
        ▼
Create ImageVariant (if new)
        │
        ▼
Trigger Celery Task (async)
        │
        ▼
Return to user immediately
        │
(Task processes variants in background)
```

### Verification Checklist
- [ ] post_save signal receiver created
- [ ] Creates ImageVariant for new ProductImage
- [ ] Triggers async Celery task
- [ ] Handles both create and update scenarios

---

## Task 26: Create Celery Task for Processing

### Overview
Create a Celery task that generates all image variants (thumbnail, medium, large) in the background without blocking the upload request. This improves user experience and handles heavy processing asynchronously.

### Dependencies
- Task 23: Implement create_large method
- Task 25: Add variant generation on save

### Instructions

1. **Create task file**
   - Create `process_image.py` in `backend/apps/products/media/tasks/`

2. **Import required modules**
   - Import shared_task from celery
   - Import ProductImage, ImageVariant
   - Import ImageProcessor from services
   - Import default_storage from django.core.files.storage

3. **Define Celery task**
   - Create function `process_image_variants(image_id)`
   - Decorate with @shared_task
   - Accept image_id parameter

4. **Get ProductImage instance**
   - Query ProductImage.objects.get(id=image_id)
   - Handle DoesNotExist exception

5. **Generate thumbnail variant**
   - Open image with ImageProcessor
   - Call create_thumbnail()
   - Save to thumbnail path
   - Store path in ImageVariant.thumbnail_path

6. **Generate medium variant**
   - Reload original image (don't use resized thumbnail)
   - Call create_medium()
   - Save to medium path
   - Store path in ImageVariant.medium_path

7. **Generate large variant**
   - Reload original image
   - Call create_large()
   - Save to large path
   - Store path in ImageVariant.large_path

8. **Save ImageVariant**
   - Save all paths to database
   - Set status to COMPLETED (Task 27)

9. **Add error handling**
   - Wrap in try-except
   - Log errors
   - Set status to FAILED on exception

10. **Return result**
    - Return dict with success status and paths

### Task Execution Flow
```
Upload Request → ProductImage.save() → Response (fast)
        │
        ▼
Celery Queue
        │
        ▼
process_image_variants task starts
        │
        ├─► Generate thumbnail (150×150)
        ├─► Generate medium (500×500)
        └─► Generate large (1000×1000)
        │
        ▼
Save all paths to ImageVariant
        │
        ▼
Task complete (variants ready)
```

### Verification Checklist
- [ ] process_image.py file created
- [ ] Celery task decorated with @shared_task
- [ ] Generates thumbnail, medium, large variants
- [ ] Stores paths in ImageVariant model
- [ ] Error handling implemented
- [ ] Returns processing result

---

## Task 27: Add Processing Status Field

### Overview
Add a status field to ImageVariant to track the processing state (pending, processing, completed, failed). This allows the frontend to show processing progress and retry failed tasks.

### Dependencies
- Task 24: Create ImageVariant model

### Instructions

1. **Open image_variant.py**
   - Add status field to ImageVariant model

2. **Define status choices**
   - Create tuple STATUS_CHOICES
   - Add: ('PENDING', 'Pending')
   - Add: ('PROCESSING', 'Processing')
   - Add: ('COMPLETED', 'Completed')
   - Add: ('FAILED', 'Failed')

3. **Add status field**
   - `status` as CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
   - Index this field for quick filtering

4. **Add error_message field**
   - `error_message` as TextField(blank=True)
   - Store error details if processing fails

5. **Add is_ready property**
   - @property method
   - Return True if status == 'COMPLETED'
   - Convenient check for frontend

6. **Update Celery task**
   - Set status='PROCESSING' at start of task
   - Set status='COMPLETED' on success
   - Set status='FAILED' with error_message on failure

### Status Transitions
```
PENDING (initial)
    │
    ▼
PROCESSING (task started)
    │
    ├─► COMPLETED (success)
    │
    └─► FAILED (error)
```

### Verification Checklist
- [ ] STATUS_CHOICES tuple defined
- [ ] status field added to ImageVariant
- [ ] error_message field added
- [ ] is_ready property implemented
- [ ] Celery task updates status appropriately

---

## Task 28: Implement Image Orientation Fix

### Overview
Implement automatic image rotation based on EXIF orientation data. Many cameras and phones embed orientation information that must be applied to display images correctly.

### Dependencies
- Task 18: Create ImageProcessor service

### Instructions

1. **Open image_processor.py**
   - Add method to ImageProcessor class

2. **Import ImageOps**
   - Import ImageOps from PIL
   - Provides exif_transpose function

3. **Create fix_orientation method**
   - Define `fix_orientation(self)` method
   - No parameters (operates on self.image)

4. **Apply EXIF orientation**
   - Use: `self.image = ImageOps.exif_transpose(self.image)`
   - Automatically rotates based on EXIF Orientation tag
   - Handles all 8 EXIF orientation values

5. **Handle missing EXIF**
   - Wrap in try-except (some images lack EXIF)
   - If no EXIF data, image remains unchanged
   - Return self in all cases

6. **Call in Celery task**
   - In process_image_variants task
   - Call fix_orientation() before resizing
   - Ensures all variants have correct orientation

7. **Add to pre-processing**
   - Can also call in ProductImage signal
   - Before saving original image

### EXIF Orientation Values

| Value | Description | Rotation Needed |
|-------|-------------|------------------|
| 1 | Normal | None |
| 2 | Flipped horizontal | Mirror |
| 3 | Rotated 180° | 180° CW |
| 4 | Flipped vertical | Mirror + 180° |
| 5 | Flipped + 90° CW | Mirror + 90° CW |
| 6 | Rotated 90° CW | 90° CW |
| 7 | Flipped + 90° CCW | Mirror + 90° CCW |
| 8 | Rotated 90° CCW | 90° CCW |

### Why EXIF Orientation Matters
```
Without fix_orientation:
📱 Photo taken in portrait
  → Uploaded
  → Displayed sideways ❌

With fix_orientation:
📱 Photo taken in portrait
  → EXIF orientation detected (6 = 90° CW)
  → Auto-rotated
  → Displayed correctly ✓
```

### Verification Checklist
- [ ] fix_orientation method added to ImageProcessor
- [ ] Uses ImageOps.exif_transpose
- [ ] Error handling for missing EXIF
- [ ] Called in Celery task before resizing
- [ ] Returns self for method chaining

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|------------------|
| 24 | Create ImageVariant model | Model for storing variant paths |
| 25 | Add variant generation on save | post_save signal triggers async processing |
| 26 | Create Celery task for processing | Background task generates all variants |
| 27 | Add processing status field | Track PENDING/PROCESSING/COMPLETED/FAILED |
| 28 | Implement image orientation fix | Auto-rotate based on EXIF data |

### Async Processing Benefits

| Benefit | Description |
|---------|-------------|
| **Fast Response** | Upload returns immediately (~100ms) |
| **No Blocking** | Heavy processing in background (~2-3s) |
| **Scalability** | Multiple Celery workers process in parallel |
| **Error Recovery** | Failed tasks can be retried |
| **Status Tracking** | Frontend can show progress |

### Next Steps
Proceed to [03_Tasks-29-32_Quality-Errors-Cleanup.md](03_Tasks-29-32_Quality-Errors-Cleanup.md) for EXIF stripping, quality settings, error handling, and cleanup utilities.

---

## Notes for AI Agents

1. **Async Pattern:** Upload fast, process in background
2. **ImageVariant:** OneToOne relationship with ProductImage
3. **Status Tracking:** PENDING → PROCESSING → COMPLETED/FAILED
4. **EXIF Orientation:** Critical for mobile photos
5. **Celery Task:** Shared task for reusability
6. **Error Handling:** Graceful degradation, status tracking
7. **Original Preservation:** Always reload original for each variant
8. **Performance:** ~2-3 seconds to generate all 3 variants
9. **Next Document:** Quality settings and cleanup
10. **Group B 62% Complete:** Tasks 17-28 of 32 done
