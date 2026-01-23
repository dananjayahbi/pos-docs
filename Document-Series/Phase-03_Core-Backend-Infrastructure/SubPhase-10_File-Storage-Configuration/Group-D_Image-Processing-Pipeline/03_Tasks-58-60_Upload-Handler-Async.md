# Tasks 58-60: Upload Handler and Async Processing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** D - Image Processing Pipeline  
> **Document:** 03 of 03  
> **Tasks Covered:** 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-53-57_Web-Optimization.md](02_Tasks-53-57_Web-Optimization.md)
- **→ Next Document:** [../../Group-E_File-Security-Validation/01_Tasks-61-66_FileValidator-Class.md](../../Group-E_File-Security-Validation/01_Tasks-61-66_FileValidator-Class.md)

---

## Document Overview

This document covers the creation of image upload handlers and async processing tasks using Celery. It includes handling file uploads, triggering image processing, and exporting utilities for use throughout the application.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 58 | Create Image Upload Handler | Medium |
| 59 | Create Async Image Task | Complex |
| 60 | Export Image Utilities | Simple |

---

## Task 58: Create Image Upload Handler

### Overview
Create an upload handler that intercepts image uploads and applies appropriate processing based on file size and type. This handler determines when to process images synchronously vs asynchronously.

### Dependencies
- Task 57: Define THUMB_LARGE (600x600)

### Instructions

1. **Create handlers.py file**
   - Navigate to `backend/apps/core/storage/`
   - Create new file named `handlers.py`
   - Add module docstring

2. **Import required dependencies**
   - Import ImageProcessor
   - Import thumbnail constants
   - Import storage backends
   - Import file validation utilities

3. **Create handle_image_upload function**
   - Accept uploaded file parameter
   - Determine processing strategy
   - Apply appropriate processing
   - Return processed file or path

4. **Implement size threshold logic**
   - Small images (< 1MB): Process synchronously
   - Large images (> 1MB): Queue for async processing
   - Return placeholder during processing

5. **Add thumbnail generation**
   - Generate standard thumbnail sizes
   - Save thumbnails to storage
   - Link thumbnails to original

6. **Implement error handling**
   - Catch processing errors
   - Log failures
   - Return original on error

### Processing Strategy

```
Upload Handler Flow:
Uploaded Image
    ↓
Check File Size
    ↓
┌───────────────┴───────────────┐
│                               │
< 1MB                        > 1MB
│                               │
▼                               ▼
Synchronous                 Asynchronous
Processing                  Queue Task
│                               │
▼                               ▼
Return Processed           Return Placeholder
Image Immediately          Process in Background
```

### Size Thresholds

| File Size | Processing | Wait Time | User Experience |
|-----------|------------|-----------|-----------------|
| **< 500KB** | Sync | Immediate | No delay |
| **500KB-1MB** | Sync | 1-2 seconds | Slight delay |
| **1-5MB** | Async | Background | Upload continues |
| **> 5MB** | Async | Background | Progress indicator |

### Expected Outcome
```python
# In handlers.py:

from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from apps.core.storage.images import ImageProcessor
from apps.core.storage.constants import THUMBNAIL_SIZES
from apps.core.storage.backends import get_storage_class
import logging

logger = logging.getLogger(__name__)

# Size threshold for async processing (1MB)
ASYNC_PROCESSING_THRESHOLD = 1024 * 1024  # 1MB in bytes


def handle_image_upload(uploaded_file, field_name='image', instance=None):
    """
    Handle image upload with processing.
    
    Determines whether to process image synchronously or asynchronously
    based on file size. Generates standard thumbnails.
    
    Args:
        uploaded_file: Django UploadedFile object
        field_name: Name of the model field
        instance: Model instance (for async task reference)
        
    Returns:
        Processed file or original file
        
    Processing Strategy:
        - Files < 1MB: Process immediately (synchronous)
        - Files > 1MB: Queue for background processing (async)
    
    Example:
        # In model save method:
        if self.image:
            self.image = handle_image_upload(self.image, 'image', self)
    """
    try:
        # Get file size
        file_size = uploaded_file.size
        
        logger.info(
            f"Processing image upload: {uploaded_file.name}, "
            f"size: {file_size} bytes"
        )
        
        # Small files: Process synchronously
        if file_size < ASYNC_PROCESSING_THRESHOLD:
            return process_image_sync(uploaded_file)
        
        # Large files: Queue for async processing
        else:
            # Import here to avoid circular dependency
            from apps.core.tasks.images import process_image_async
            
            # Save original file first
            storage = get_storage_class()
            file_path = storage.save(uploaded_file.name, uploaded_file)
            
            # Queue async task
            if instance:
                process_image_async.delay(
                    file_path=file_path,
                    model_name=instance.__class__.__name__,
                    instance_id=instance.pk,
                    field_name=field_name
                )
            else:
                process_image_async.delay(file_path=file_path)
            
            logger.info(f"Queued async processing for {uploaded_file.name}")
            
            # Return original file (will be replaced by async task)
            return uploaded_file
    
    except Exception as e:
        logger.error(f"Error handling image upload: {e}")
        # Return original file on error
        return uploaded_file


def process_image_sync(uploaded_file):
    """
    Process image synchronously.
    
    Applies web optimization and generates thumbnails immediately.
    Used for small files that can be processed quickly.
    
    Args:
        uploaded_file: Django UploadedFile object
        
    Returns:
        Processed InMemoryUploadedFile
    """
    try:
        # Create processor
        processor = ImageProcessor(uploaded_file)
        
        # Optimize for web
        processor.optimize_for_web(quality=85)
        
        # Save processed image
        output_io = processor.save()
        
        # Create new UploadedFile with processed image
        processed_file = InMemoryUploadedFile(
            file=output_io,
            field_name=uploaded_file.field_name,
            name=uploaded_file.name,
            content_type=f'image/{processor.format.lower()}',
            size=output_io.tell(),
            charset=None
        )
        
        logger.info(f"Synchronously processed: {uploaded_file.name}")
        
        return processed_file
    
    except Exception as e:
        logger.error(f"Error in sync processing: {e}")
        return uploaded_file


def generate_thumbnails(image_path, save_to_storage=True):
    """
    Generate all standard thumbnail sizes for an image.
    
    Args:
        image_path: Path to image file in storage
        save_to_storage: Whether to save thumbnails to storage
        
    Returns:
        Dictionary of {size_name: thumbnail_path}
    """
    try:
        storage = get_storage_class()
        
        # Open image from storage
        with storage.open(image_path) as image_file:
            processor = ImageProcessor(image_file)
        
        # Generate all thumbnail sizes
        thumbnails = processor.generate_thumbnails(THUMBNAIL_SIZES)
        
        thumbnail_paths = {}
        
        if save_to_storage:
            # Save each thumbnail
            for size_name, thumb_processor in thumbnails.items():
                # Build thumbnail path
                base_name = image_path.rsplit('.', 1)[0]
                thumb_path = f"{base_name}_{size_name}.webp"
                
                # Save thumbnail
                thumb_io = thumb_processor.save(format='WEBP')
                storage.save(thumb_path, thumb_io)
                
                thumbnail_paths[size_name] = thumb_path
                
                logger.info(f"Saved thumbnail: {thumb_path}")
        
        return thumbnail_paths
    
    except Exception as e:
        logger.error(f"Error generating thumbnails: {e}")
        return {}
```

### Usage in Models

```python
from django.db import models
from apps.core.storage.handlers import handle_image_upload

class Product(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='products/')
    
    # Thumbnail fields (optional - can be computed on-demand)
    image_small = models.ImageField(upload_to='products/', blank=True)
    image_medium = models.ImageField(upload_to='products/', blank=True)
    image_large = models.ImageField(upload_to='products/', blank=True)
    
    def save(self, *args, **kwargs):
        # Process image on upload
        if self.image and not self.pk:
            self.image = handle_image_upload(self.image, 'image', self)
        
        super().save(*args, **kwargs)
```

### Verification Checklist
- [ ] handlers.py file created
- [ ] handle_image_upload function implemented
- [ ] Size threshold logic working
- [ ] Sync processing implemented
- [ ] Async processing queuing ready
- [ ] Thumbnail generation functional

---

## Task 59: Create Async Image Task

### Overview
Create a Celery task for asynchronous image processing. This task processes large images in the background without blocking the request/response cycle.

### Dependencies
- Task 58: Create Image Upload Handler

### Instructions

1. **Create images.py task file**
   - Navigate to `backend/apps/core/tasks/`
   - Create new file named `images.py`
   - Add module docstring

2. **Import Celery and dependencies**
   - Import shared_task decorator
   - Import ImageProcessor
   - Import storage utilities
   - Import model utilities

3. **Create process_image_async task**
   - Decorate with @shared_task
   - Accept file path and metadata
   - Process image asynchronously
   - Update model instance if provided

4. **Implement processing pipeline**
   - Load image from storage
   - Apply optimization
   - Generate thumbnails
   - Save all outputs

5. **Add progress tracking**
   - Update task state
   - Track percentage complete
   - Log processing stages

6. **Implement error handling**
   - Retry on transient errors
   - Log permanent failures
   - Send notifications if needed

### Async Task Flow

```
Celery Task Flow:
Task Queued
    ↓
Worker Picks Up Task
    ↓
Load Image from Storage
    ↓
Apply Optimization
    ↓
Generate Thumbnails
    ↓
Save Processed Images
    ↓
Update Model Instance
    ↓
Mark Task Complete
    ↓
Send Notification (optional)
```

### Task States

| State | Description | Action |
|-------|-------------|--------|
| **PENDING** | Task queued | Waiting for worker |
| **STARTED** | Processing begun | Loading image |
| **PROGRESS** | In progress | Show percentage |
| **SUCCESS** | Completed | Update model |
| **FAILURE** | Failed | Log error |
| **RETRY** | Retrying | Retry with backoff |

### Expected Outcome
```python
# In tasks/images.py:

from celery import shared_task
from django.apps import apps
from django.core.files.base import ContentFile
from apps.core.storage.images import ImageProcessor
from apps.core.storage.backends import get_storage_class
from apps.core.storage.constants import THUMBNAIL_SIZES
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def process_image_async(
    self,
    file_path,
    model_name=None,
    instance_id=None,
    field_name='image',
    generate_thumbs=True
):
    """
    Process image asynchronously using Celery.
    
    This task is used for large images that would take too long
    to process synchronously. Applies web optimization and generates
    thumbnails in the background.
    
    Args:
        file_path: Path to image in storage
        model_name: Model class name (e.g., 'Product')
        instance_id: Model instance ID
        field_name: Name of image field on model
        generate_thumbs: Whether to generate thumbnails
        
    Returns:
        Dictionary with processing results
        
    Retry Policy:
        - Max retries: 3
        - Backoff: Exponential (2^retry_count seconds)
        - Retry on: IOError, OSError
    """
    try:
        # Update task state
        self.update_state(
            state='PROGRESS',
            meta={'status': 'Loading image', 'progress': 10}
        )
        
        storage = get_storage_class()
        
        # Load image from storage
        with storage.open(file_path) as image_file:
            processor = ImageProcessor(image_file)
        
        logger.info(f"Processing image: {file_path}")
        
        # Update progress
        self.update_state(
            state='PROGRESS',
            meta={'status': 'Optimizing image', 'progress': 30}
        )
        
        # Optimize for web
        processor.optimize_for_web(quality=85)
        
        # Save optimized image
        optimized_io = processor.save(format='WEBP')
        optimized_path = file_path.rsplit('.', 1)[0] + '_optimized.webp'
        storage.save(optimized_path, ContentFile(optimized_io.read()))
        
        logger.info(f"Saved optimized image: {optimized_path}")
        
        # Generate thumbnails
        thumbnail_paths = {}
        
        if generate_thumbs:
            self.update_state(
                state='PROGRESS',
                meta={'status': 'Generating thumbnails', 'progress': 60}
            )
            
            thumbnails = processor.generate_thumbnails(THUMBNAIL_SIZES)
            
            for size_name, thumb_processor in thumbnails.items():
                # Build thumbnail path
                base_name = file_path.rsplit('.', 1)[0]
                thumb_path = f"{base_name}_{size_name}.webp"
                
                # Save thumbnail
                thumb_io = thumb_processor.save(format='WEBP')
                storage.save(thumb_path, ContentFile(thumb_io.read()))
                
                thumbnail_paths[size_name] = thumb_path
                
                logger.info(f"Saved thumbnail: {thumb_path}")
        
        # Update model instance if provided
        if model_name and instance_id:
            self.update_state(
                state='PROGRESS',
                meta={'status': 'Updating model', 'progress': 90}
            )
            
            try:
                # Get model class
                model_class = apps.get_model('core', model_name)
                
                # Get instance
                instance = model_class.objects.get(pk=instance_id)
                
                # Update image field with optimized version
                setattr(instance, field_name, optimized_path)
                
                # Update thumbnail fields if they exist
                if hasattr(instance, f'{field_name}_small'):
                    setattr(instance, f'{field_name}_small', 
                           thumbnail_paths.get('small', ''))
                
                if hasattr(instance, f'{field_name}_medium'):
                    setattr(instance, f'{field_name}_medium', 
                           thumbnail_paths.get('medium', ''))
                
                if hasattr(instance, f'{field_name}_large'):
                    setattr(instance, f'{field_name}_large', 
                           thumbnail_paths.get('large', ''))
                
                instance.save(update_fields=[
                    field_name,
                    f'{field_name}_small',
                    f'{field_name}_medium',
                    f'{field_name}_large'
                ])
                
                logger.info(f"Updated {model_name} instance {instance_id}")
            
            except Exception as e:
                logger.error(f"Error updating model instance: {e}")
                # Don't fail task if model update fails
        
        # Return success
        return {
            'status': 'success',
            'original_path': file_path,
            'optimized_path': optimized_path,
            'thumbnail_paths': thumbnail_paths,
            'progress': 100
        }
    
    except (IOError, OSError) as e:
        # Retry on I/O errors
        logger.warning(f"I/O error processing image, retrying: {e}")
        raise self.retry(exc=e, countdown=2 ** self.request.retries)
    
    except Exception as e:
        # Log other errors and fail
        logger.error(f"Error processing image: {e}", exc_info=True)
        return {
            'status': 'error',
            'error': str(e),
            'file_path': file_path
        }


@shared_task
def process_bulk_images(file_paths, **kwargs):
    """
    Process multiple images in bulk.
    
    Args:
        file_paths: List of file paths to process
        **kwargs: Additional arguments for process_image_async
        
    Returns:
        List of task IDs
    """
    task_ids = []
    
    for file_path in file_paths:
        task = process_image_async.delay(file_path, **kwargs)
        task_ids.append(task.id)
    
    logger.info(f"Queued {len(task_ids)} image processing tasks")
    
    return task_ids


@shared_task
def cleanup_temp_images():
    """
    Clean up temporary and unprocessed images.
    
    Runs periodically to remove:
    - Failed upload attempts
    - Orphaned temporary files
    - Old unprocessed images
    """
    # Implementation for cleanup
    pass
```

### Task Configuration

```python
# In celery.py or settings:

CELERY_TASK_ROUTES = {
    'apps.core.tasks.images.process_image_async': {
        'queue': 'images',
        'priority': 5
    },
}

CELERY_TASK_TIME_LIMIT = 300  # 5 minutes max
CELERY_TASK_SOFT_TIME_LIMIT = 240  # 4 minute warning
```

### Usage Examples

```python
# Queue single image
from apps.core.tasks.images import process_image_async

task = process_image_async.delay(
    file_path='tenant-shop123/products/product.jpg',
    model_name='Product',
    instance_id=42,
    field_name='image'
)

# Check task status
result = task.result
state = task.state

# Queue multiple images
from apps.core.tasks.images import process_bulk_images

paths = [
    'products/product1.jpg',
    'products/product2.jpg',
    'products/product3.jpg',
]

task_ids = process_bulk_images.delay(paths)
```

### Verification Checklist
- [ ] Celery task file created
- [ ] process_image_async task implemented
- [ ] Progress tracking functional
- [ ] Error handling with retries
- [ ] Model update logic working
- [ ] Bulk processing supported

---

## Task 60: Export Image Utilities

### Overview
Export all image processing utilities from the storage module's __init__.py file, making them easily accessible throughout the application with clean imports.

### Dependencies
- Task 59: Create Async Image Task

### Instructions

1. **Open storage __init__.py**
   - Navigate to `backend/apps/core/storage/__init__.py`
   - Prepare to add exports

2. **Import image classes**
   - Import ImageProcessor
   - Import upload handler functions
   - Import thumbnail constants

3. **Create __all__ list**
   - List all exported symbols
   - Organize by category
   - Add comments for clarity

4. **Add convenience imports**
   - Group related imports
   - Create aliases if helpful
   - Document usage patterns

5. **Add module docstring**
   - Document available utilities
   - Provide usage examples
   - Reference related modules

6. **Version and maintain exports**
   - Mark public API
   - Note deprecated items
   - Plan for backward compatibility

### Export Organization

```python
Storage Module Exports:
├── Image Processing
│   ├── ImageProcessor
│   └── optimize_for_web (convenience)
├── Upload Handling
│   ├── handle_image_upload
│   └── process_image_sync
├── Constants
│   ├── THUMB_SMALL
│   ├── THUMB_MEDIUM
│   ├── THUMB_LARGE
│   └── THUMBNAIL_SIZES
├── Storage Backends
│   ├── TenantFileStorage
│   ├── TenantS3Storage
│   ├── PrivateTenantS3Storage
│   └── PublicTenantS3Storage
└── Utilities
    ├── get_storage_class
    └── generate_thumbnails
```

### Expected Outcome
```python
# In __init__.py:

"""
LankaCommerce Cloud Storage Module

This module provides file storage and image processing utilities
for the LankaCommerce Cloud platform.

Features:
- Tenant-isolated file storage (local and S3)
- Image processing and optimization
- Thumbnail generation
- File validation and security
- Signed URLs for private files

Quick Start:
    # Image processing
    from apps.core.storage import ImageProcessor
    
    processor = ImageProcessor(uploaded_file)
    processor.optimize_for_web()
    output = processor.save()
    
    # Upload handling
    from apps.core.storage import handle_image_upload
    
    processed_image = handle_image_upload(uploaded_file)
    
    # Thumbnail constants
    from apps.core.storage import THUMB_SMALL, THUMB_MEDIUM, THUMB_LARGE
    
    thumb = processor.generate_thumbnail(THUMB_MEDIUM)
"""

# Image Processing
from .images import ImageProcessor

# Upload Handlers
from .handlers import (
    handle_image_upload,
    process_image_sync,
    generate_thumbnails,
)

# Storage Backends
from .backends import (
    TenantFileStorage,
    TenantS3Storage,
    PrivateTenantS3Storage,
    PublicTenantS3Storage,
    get_storage_class,
)

# Constants
from .constants import (
    # Thumbnail sizes
    THUMB_SMALL,
    THUMB_MEDIUM,
    THUMB_LARGE,
    THUMBNAIL_SIZES,
    
    # Size utilities
    get_thumbnail_size,
    validate_thumbnail_size,
    
    # File extensions
    IMAGE_EXTENSIONS,
    DOCUMENT_EXTENSIONS,
    
    # Size limits
    MAX_IMAGE_SIZE,
    MAX_DOCUMENT_SIZE,
    
    # URL expiry
    SIGNED_URL_DEFAULT_EXPIRY,
    get_signed_url_expiry,
)

# File Validation
from .validators import (
    FileValidator,
    validate_file_extension,
    validate_file_size,
)

# S3 Utilities
from .s3 import (
    generate_signed_url,
    generate_bulk_signed_urls,
)

# Public API
__all__ = [
    # Image Processing
    'ImageProcessor',
    
    # Upload Handlers
    'handle_image_upload',
    'process_image_sync',
    'generate_thumbnails',
    
    # Storage Backends
    'TenantFileStorage',
    'TenantS3Storage',
    'PrivateTenantS3Storage',
    'PublicTenantS3Storage',
    'get_storage_class',
    
    # Thumbnail Constants
    'THUMB_SMALL',
    'THUMB_MEDIUM',
    'THUMB_LARGE',
    'THUMBNAIL_SIZES',
    'get_thumbnail_size',
    'validate_thumbnail_size',
    
    # File Extensions
    'IMAGE_EXTENSIONS',
    'DOCUMENT_EXTENSIONS',
    
    # Size Limits
    'MAX_IMAGE_SIZE',
    'MAX_DOCUMENT_SIZE',
    
    # Validation
    'FileValidator',
    'validate_file_extension',
    'validate_file_size',
    
    # S3 Utilities
    'generate_signed_url',
    'generate_bulk_signed_urls',
    
    # URL Expiry
    'SIGNED_URL_DEFAULT_EXPIRY',
    'get_signed_url_expiry',
]

# Version
__version__ = '1.0.0'
```

### Usage Examples

```python
# Clean imports throughout the application

# Image processing
from apps.core.storage import ImageProcessor, handle_image_upload

processor = ImageProcessor(file)
processor.optimize_for_web()

# Thumbnail generation
from apps.core.storage import THUMB_MEDIUM, generate_thumbnails

thumbs = generate_thumbnails(image_path)

# Storage backend
from apps.core.storage import get_storage_class

storage = get_storage_class('private')
storage.save('invoice.pdf', file)

# Validation
from apps.core.storage import FileValidator, MAX_IMAGE_SIZE

validator = FileValidator()
validator.validate_size(uploaded_file, MAX_IMAGE_SIZE)

# Signed URLs
from apps.core.storage import generate_signed_url

url = generate_signed_url('invoices/INV-001.pdf', expiry=3600)
```

### Import Patterns

| Pattern | Usage |
|---------|-------|
| **Specific imports** | `from apps.core.storage import ImageProcessor` |
| **Multiple imports** | `from apps.core.storage import THUMB_SMALL, THUMB_MEDIUM` |
| **Wildcard (avoid)** | `from apps.core.storage import *` |

### Verification Checklist
- [ ] __init__.py updated with exports
- [ ] ImageProcessor exported
- [ ] Upload handlers exported
- [ ] Constants exported
- [ ] Storage backends exported
- [ ] __all__ list complete
- [ ] Module docstring comprehensive

---

## Summary

This document completed the image processing pipeline:

### Completed Implementation
1. ✅ Image upload handler created
2. ✅ Sync/async processing strategy implemented
3. ✅ Celery async task for image processing
4. ✅ Progress tracking added
5. ✅ Bulk processing support
6. ✅ All utilities exported for easy access

### Key Achievements
- 🎯 Smart upload handling (sync vs async)
- 🎯 Background processing for large images
- 🎯 Progress tracking for async tasks
- 🎯 Clean API exports
- 🎯 Complete integration with storage
- 🎯 Ready for production use

### Next Phase
Proceed to **Group E: File Security & Validation** to implement file validation, security scanning, and cleanup utilities.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Group:** [Group-E_File-Security-Validation](../../Group-E_File-Security-Validation/)
