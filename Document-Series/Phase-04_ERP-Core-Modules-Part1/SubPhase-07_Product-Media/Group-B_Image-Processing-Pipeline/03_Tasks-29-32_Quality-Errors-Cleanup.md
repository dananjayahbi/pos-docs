# Tasks 29-32: Quality, Errors & Cleanup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** B - Image Processing Pipeline  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-24-28_ImageVariant-Async.md](02_Tasks-24-28_ImageVariant-Async.md)
- **→ Next Group:** [../Group-C_Variant-Images-Gallery/](../Group-C_Variant-Images-Gallery/)

---

## Document Overview

This document completes Group B by implementing EXIF data stripping for privacy, configuring image quality settings, adding comprehensive error handling, and creating cleanup utilities for deleted images.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Add EXIF data stripping | Low |
| 30 | Create image quality settings | Low |
| 31 | Add image processing error handling | Medium |
| 32 | Create image cleanup utility | Low |

---

## Task 29: Add EXIF Data Stripping

### Overview
Implement EXIF data stripping to remove potentially sensitive metadata (GPS location, camera model, timestamps) from images before storing them. This protects user privacy.

### Dependencies
- Task 28: Implement image orientation fix

### Instructions

1. **Add strip_exif method to ImageProcessor**
   - Define `strip_exif(self)` method
   - Remove all EXIF data except orientation (handled separately)
   - Use: `self.image = self.image.convert('RGB')` to strip metadata
   - Or use: `image.save(output, exif=b'')` to save without EXIF

2. **Preserve essential data only**
   - Keep image dimensions, format, color profile
   - Remove GPS coordinates, camera info, timestamps, copyright

3. **Call in processing pipeline**
   - Add to Celery task after orientation fix
   - Strip EXIF before generating variants

4. **Add configuration option**
   - Create setting `STRIP_IMAGE_EXIF` (default=True)
   - Allow disabling if EXIF preservation needed

### EXIF Data Examples

| Field | Example | Privacy Risk |
|-------|---------|--------------|
| GPS Coordinates | 40.7128° N, 74.0060° W | Reveals photo location |
| Camera Model | Canon EOS 5D Mark IV | Identifies equipment |
| Original DateTime | 2026-01-15 14:30:00 | Reveals timestamp |
| Copyright | © John Doe 2026 | Attribution info |

### Expected Outcome
Images stored without sensitive EXIF metadata, protecting user privacy.

### Verification Checklist
- [ ] strip_exif method added to ImageProcessor
- [ ] Removes GPS, camera, timestamp data
- [ ] Preserves image quality and format
- [ ] Configuration option available
- [ ] Called in processing pipeline

---

## Task 30: Create Image Quality Settings

### Overview
Configure image quality settings for different formats (JPEG, PNG, WebP) to balance file size and visual quality. These settings are used when saving processed images.

### Dependencies
- Task 18: Create ImageProcessor service

### Instructions

1. **Update save method in ImageProcessor**
   - Modify `save(self, output, format=None, quality=None)` method
   - Apply format-specific quality settings

2. **JPEG quality configuration**
   - Default quality: 80 (from constants.JPEG_QUALITY)
   - Use progressive JPEG for better perceived loading
   - Add parameter: `optimize=True` for smaller file size

3. **PNG compression configuration**
   - Compression level: 6 (from constants.PNG_COMPRESSION_LEVEL)
   - Range 0-9, 6 is good balance
   - Add parameter: `optimize=True`

4. **WebP quality configuration**
   - Quality: 85 (from constants.WEBP_QUALITY)
   - Higher than JPEG for better quality at similar size
   - Add parameter: `method=4` for better compression (slower)

5. **Add format detection**
   - Auto-detect format from file extension if not specified
   - Use original format if format parameter is None

6. **Apply settings in save**
   - Build kwargs dict based on format
   - Pass to image.save() call

### Quality Settings Summary

| Format | Quality | Optimize | Special Params | File Size Impact |
|--------|---------|----------|----------------|------------------|
| JPEG | 80 | True | progressive=True | -30% vs quality 95 |
| PNG | N/A | True | compress_level=6 | -20% vs no compression |
| WebP | 85 | True | method=4 | -50% vs JPEG quality 80 |

### Expected Outcome
Optimized images with balanced quality and file size, consistent across the application.

### Verification Checklist
- [ ] save method applies format-specific settings
- [ ] JPEG uses quality=80, optimize=True, progressive=True
- [ ] PNG uses compress_level=6, optimize=True
- [ ] WebP uses quality=85, method=4
- [ ] Format auto-detected if not specified

---

## Task 31: Add Image Processing Error Handling

### Overview
Implement comprehensive error handling for image processing operations to gracefully handle corrupt files, unsupported formats, insufficient memory, and other failure scenarios.

### Dependencies
- Task 26: Create Celery task for processing

### Instructions

1. **Define custom exceptions**
   - Create `exceptions.py` in media directory
   - Define `ImageProcessingError` class
   - Define `UnsupportedImageFormatError` class
   - Define `ImageTooLargeError` class
   - Define `CorruptImageError` class

2. **Add try-except to ImageProcessor methods**
   - Wrap PIL operations in try-except blocks
   - Catch `IOError`, `OSError`, `PIL.UnidentifiedImageError`
   - Raise custom exceptions with helpful messages

3. **Handle memory errors**
   - Catch `MemoryError` when processing very large images
   - Log error with image dimensions
   - Set status=FAILED in ImageVariant

4. **Handle corrupt files**
   - Verify image before processing with `image.verify()`
   - Catch verification failures
   - Provide clear error message to user

5. **Update Celery task error handling**
   - Wrap entire task in try-except
   - Catch all custom exceptions
   - Update ImageVariant status and error_message
   - Log to Celery logger with context

6. **Add retry logic**
   - Use Celery's `retry` with exponential backoff
   - Retry on transient errors (network, temporary file issues)
   - Don't retry on permanent errors (corrupt file, unsupported format)

7. **Log errors appropriately**
   - Use Python logging module
   - Include image ID, product ID, error type
   - Log stack trace for debugging

### Error Handling Strategy

```
Error Type → Action
─────────────────────────────────────
Corrupt File → FAILED, notify user
Unsupported Format → FAILED, notify user
Memory Error → FAILED, log, notify admin
Network Error → RETRY (3 attempts)
Temporary File Error → RETRY (3 attempts)
Unknown Error → FAILED, log stack trace
```

### Expected Outcome
Robust error handling that prevents crashes, provides clear error messages, and enables debugging.

### Verification Checklist
- [ ] Custom exception classes defined
- [ ] ImageProcessor methods have try-except blocks
- [ ] Celery task catches all exceptions
- [ ] ImageVariant status updated on errors
- [ ] Retry logic for transient errors
- [ ] Comprehensive logging

---

## Task 32: Create Image Cleanup Utility

### Overview
Create a utility that automatically deletes all image variants when the original ProductImage is deleted. This prevents orphaned files and saves storage space.

### Dependencies
- Task 24: Create ImageVariant model

### Instructions

1. **Create cleanup utility file**
   - Update `utils.py` in media directory
   - Add cleanup functions

2. **Create delete_image_variants function**
   - Define `delete_image_variants(product_image)` function
   - Accept ProductImage instance
   - Get associated ImageVariant
   - Delete all variant files from storage

3. **Delete thumbnail file**
   - Check if `thumbnail_path` exists
   - Use `default_storage.delete(thumbnail_path)`
   - Catch and log errors if file doesn't exist

4. **Delete medium file**
   - Check if `medium_path` exists
   - Delete from storage
   - Handle errors gracefully

5. **Delete large file**
   - Check if `large_path` exists
   - Delete from storage
   - Handle errors gracefully

6. **Delete original image**
   - Delete `product_image.image` file
   - Use `product_image.image.delete(save=False)`

7. **Create pre_delete signal**
   - Add to `signals.py`
   - Create `@receiver(pre_delete, sender=ProductImage)` decorator
   - Define `cleanup_image_files` function
   - Call `delete_image_variants(instance)` before model deletion

8. **Delete ImageVariant record**
   - CASCADE delete will handle this automatically
   - But can explicitly delete for clarity

9. **Add bulk cleanup command**
   - Create management command `cleanup_orphaned_images`
   - Find image files without database records
   - Delete orphaned files
   - Report number of files cleaned

### Cleanup Flow

```
ProductImage.delete() called
        │
        ▼
pre_delete signal triggered
        │
        ▼
cleanup_image_files function
        │
        ├──► Delete thumbnail file
        ├──► Delete medium file
        ├──► Delete large file
        └──► Delete original file
        │
        ▼
ProductImage deleted from DB
        │
        ▼
ImageVariant auto-deleted (CASCADE)
```

### Storage Management

| Action | Files Deleted | Storage Reclaimed (avg) |
|--------|---------------|-------------------------|
| Delete 1 ProductImage | 4 files (original + 3 variants) | ~500 KB |
| Delete Product with 10 images | 40 files | ~5 MB |
| Bulk cleanup orphaned files | Variable | Can be GBs |

### Expected Outcome
Automatic cleanup of all image files when ProductImage is deleted, preventing storage bloat.

### Verification Checklist
- [ ] delete_image_variants function created
- [ ] Deletes thumbnail, medium, large files
- [ ] Deletes original image file
- [ ] pre_delete signal calls cleanup function
- [ ] Error handling for missing files
- [ ] Management command for orphaned files
- [ ] Logs cleanup actions

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Add EXIF data stripping | Privacy protection by removing metadata |
| 30 | Create image quality settings | Format-specific optimization settings |
| 31 | Add image processing error handling | Robust error handling and retry logic |
| 32 | Create image cleanup utility | Automatic file deletion on image removal |

### Group B Complete - Image Processing Pipeline

```
✅ Group B Deliverables:
├── Pillow dependency installed
├── ImageProcessor service class
│   ├── resize_to_fit (maintain aspect)
│   ├── resize_to_cover (crop to exact)
│   ├── create_thumbnail (150×150)
│   ├── create_medium (500×500)
│   ├── create_large (1000×1000)
│   ├── fix_orientation (EXIF rotation)
│   └── strip_exif (privacy protection)
├── ImageVariant model
│   ├── Stores paths to all variants
│   ├── Processing status tracking
│   └── Error message storage
├── Async processing
│   ├── post_save signal triggers task
│   ├── Celery task generates variants
│   └── Non-blocking upload response
├── Quality optimization
│   ├── JPEG quality=80, progressive
│   ├── PNG compress_level=6
│   └── WebP quality=85, method=4
├── Error handling
│   ├── Custom exceptions
│   ├── Retry logic for transient errors
│   └── Comprehensive logging
└── Cleanup utilities
    ├── Auto-delete variants on image delete
    ├── pre_delete signal
    └── Management command for orphans
```

### Performance Summary

| Operation | Time | Blocking |
|-----------|------|----------|
| Upload + Save | ~100ms | Yes |
| Generate Thumbnail | ~500ms | No (async) |
| Generate Medium | ~800ms | No (async) |
| Generate Large | ~1200ms | No (async) |
| **Total Processing** | **~2.5s** | **No (background)** |

### Storage Optimization

| Image Set | Original | After WebP (Group D) | Savings |
|-----------|----------|---------------------|---------|
| 1 Product (5 images) | 2.5 MB | 1.25 MB | 50% |
| 100 Products | 250 MB | 125 MB | 125 MB saved |
| 1000 Products | 2.5 GB | 1.25 GB | 1.25 GB saved |

### Next Steps
**Group B is complete!** Proceed to [../Group-C_Variant-Images-Gallery/](../Group-C_Variant-Images-Gallery/) to implement variant-specific images and gallery management features.

---

## Notes for AI Agents

1. **EXIF Stripping:** Critical for privacy, removes GPS and camera data
2. **Quality Balance:** 80% JPEG quality is sweet spot (quality vs size)
3. **Error Handling:** Prevents crashes, enables debugging, user-friendly messages
4. **Cleanup Critical:** Prevents storage bloat from deleted images
5. **Async Processing:** User gets fast response, heavy work in background
6. **Progressive JPEG:** Better perceived loading on slow connections
7. **WebP Method 4:** Best compression, acceptable processing time
8. **Retry Logic:** Handles transient failures automatically
9. **Next Group:** Variant images and gallery management
10. **Group B Complete:** 16/16 tasks done, ready for Group C
