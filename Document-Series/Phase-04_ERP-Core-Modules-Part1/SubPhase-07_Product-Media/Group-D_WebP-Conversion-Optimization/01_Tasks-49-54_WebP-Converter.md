# Tasks 49-54: WebP Converter Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** D - WebP Conversion & Optimization  
> **Document:** 01 of 03  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-55-60_Responsive-CDN-Placeholder.md](02_Tasks-55-60_Responsive-CDN-Placeholder.md)

---

## Document Overview

This document covers the creation of WebP conversion service for modern image format support, including lossless conversion for PNG images, lossy conversion for JPEG images, WebP path storage, fallback logic for browsers without WebP support, and browser detection.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create WebP converter service | High |
| 50 | Implement lossless WebP conversion | Low |
| 51 | Implement lossy WebP conversion | Low |
| 52 | Add WebP paths to ImageVariant | Low |
| 53 | Create WebP fallback logic | Medium |
| 54 | Add browser detection helper | Low |

---

## Task 49: Create WebP Converter Service

### Overview
Create a service class that handles conversion of images to WebP format, which provides superior compression and smaller file sizes while maintaining quality, improving page load times and reducing bandwidth usage.

### Dependencies
- Task 18: Create ImageProcessor service (reference pattern)
- Task 24: Create ImageVariant model

### Instructions

1. **Create webp_converter.py file**
   - Navigate to `backend/apps/products/media/services/`
   - Create file named `webp_converter.py`
   - Add module docstring explaining WebP conversion benefits

2. **Import required modules**
   - Import `Image` from `PIL` (Pillow)
   - Import `BytesIO` for in-memory file handling
   - Import `ContentFile` from `django.core.files`
   - Import constants for quality settings
   - Import logging for error tracking

3. **Define WebPConverter service class**
   - Create class: `WebPConverter`
   - Add class docstring explaining conversion methods
   - Static methods or instance methods (consider design)

4. **Add initialization method (if using instance)**
   - If using instance-based design, add __init__
   - Store configuration: quality settings, compression level
   - Or use class-level configuration with static methods

5. **Create convert_to_webp base method**
   - Method signature: `convert_to_webp(self, source_image, quality=85, lossless=False)`
   - Accept source_image (file path or PIL Image object)
   - Accept quality parameter (1-100)
   - Accept lossless flag
   - Return BytesIO object with WebP data

6. **Open source image**
   - Handle both file paths and PIL Image objects
   - If file path, use Image.open()
   - If already PIL Image, use directly
   - Handle RGBA mode (transparency) correctly

7. **Handle transparency in conversion**
   - Check if image has alpha channel (RGBA, LA modes)
   - Preserve alpha channel in WebP output
   - Important for PNG images with transparency

8. **Convert to WebP format**
   - Create BytesIO buffer for output
   - Use image.save() with format='WEBP'
   - Set quality parameter
   - Set lossless parameter
   - Use method='6' for better compression (highest)

9. **Return WebP data**
   - Seek to beginning of BytesIO buffer
   - Return buffer for saving to file
   - Or wrap in ContentFile for Django storage

10. **Add error handling**
    - Catch conversion errors (corrupt images)
    - Log errors with details
    - Return None or raise custom exception
    - Ensure graceful degradation

11. **Add size comparison utility**
    - Method: `get_compression_ratio(original_size, webp_size)`
    - Calculate percentage reduction
    - Return ratio and savings in bytes
    - Useful for optimization reports (Task 63)

12. **Update services __init__.py**
    - Import WebPConverter
    - Add to __all__ list

### WebP Format Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| **Smaller Size** | 25-35% smaller than JPEG/PNG | Faster page loads |
| **Quality** | Superior compression algorithm | Better visual quality |
| **Transparency** | Supports alpha channel like PNG | Flexible usage |
| **Animation** | Supports animation like GIF | Modern alternative |
| **Browser Support** | 95%+ modern browsers | Wide compatibility |

### Lossless vs Lossy Conversion

| Mode | Best For | Transparency | Quality | Size |
|------|----------|--------------|---------|------|
| Lossless | PNG, graphics, text | Preserved | Identical | Smaller than PNG |
| Lossy | JPEG, photos | Preserved | Near-identical | Much smaller than JPEG |

### Expected Outcome
```
backend/apps/products/media/services/
├── __init__.py (updated)
├── image_processor.py
├── gallery_manager.py
└── webp_converter.py (NEW)

WebPConverter class with:
- convert_to_webp(source, quality, lossless)
- Error handling
- Transparency preservation
- Compression ratio calculation
```

### Verification Checklist
- [ ] webp_converter.py file created
- [ ] WebPConverter class defined
- [ ] convert_to_webp method implemented
- [ ] Handles both file paths and PIL Images
- [ ] Preserves transparency (alpha channel)
- [ ] Accepts quality parameter (1-100)
- [ ] Accepts lossless flag
- [ ] Returns BytesIO or ContentFile with WebP data
- [ ] Error handling for corrupt images
- [ ] get_compression_ratio utility added
- [ ] Service imported in __init__.py

---

## Task 50: Implement Lossless WebP Conversion

### Overview
Implement a specific method for lossless WebP conversion, optimal for PNG images, graphics, and images with text where preserving exact pixel data is important.

### Dependencies
- Task 49: Create WebP converter service

### Instructions

1. **Add convert_png_to_webp method**
   - Open webp_converter.py
   - Add method to WebPConverter class
   - Method signature: `convert_png_to_webp(self, png_source)`
   - Specialized for PNG conversion

2. **Set lossless flag**
   - Call convert_to_webp with lossless=True
   - This preserves all pixel data exactly
   - Quality parameter ignored in lossless mode

3. **Optimize for PNG characteristics**
   - PNG images typically have transparency
   - Ensure alpha channel is preserved
   - Use method='6' for best compression without quality loss

4. **Handle PNG-specific modes**
   - Support RGB, RGBA, L (grayscale), LA (grayscale+alpha)
   - Convert P (palette) mode to RGBA before conversion
   - Ensures proper color handling

5. **Set appropriate options**
   - Use lossless=True
   - Set method=6 (slowest but best compression)
   - Exact=True to match PNG precisely
   - These parameters ensure pixel-perfect conversion

6. **Benchmark compression improvement**
   - PNG files typically reduce 20-30% in lossless WebP
   - Add logging to track conversion results
   - Store compression metrics for reporting

7. **Create batch PNG conversion helper**
   - Method: `batch_convert_pngs(self, png_files)`
   - Accept list of PNG file paths
   - Convert all to WebP
   - Return list of WebP files
   - Useful for migration (Task 62)

### Lossless WebP Configuration

```python
# Configuration for lossless WebP
save_options = {
    'format': 'WEBP',
    'lossless': True,
    'quality': 100,  # Ignored in lossless mode
    'method': 6,     # Best compression (slowest)
    'exact': True    # Preserve color exactly
}
```

### PNG to WebP Comparison

| Image Type | PNG Size | WebP Size | Savings |
|-----------|----------|-----------|---------|
| Logo with transparency | 50 KB | 35 KB | 30% |
| Screenshot with text | 200 KB | 140 KB | 30% |
| Icon set | 10 KB | 7 KB | 30% |
| Product on white bg | 80 KB | 55 KB | 31% |

### Expected Outcome
```
WebPConverter class updated with:
- convert_png_to_webp(png_source) method
- Lossless conversion enabled
- Transparency preservation
- Optimal compression settings
- Batch conversion helper
```

### Verification Checklist
- [ ] convert_png_to_webp method added
- [ ] Calls convert_to_webp with lossless=True
- [ ] Handles RGBA (transparency) correctly
- [ ] Converts palette mode to RGBA first
- [ ] Uses method=6 for best compression
- [ ] Preserves exact pixel data
- [ ] batch_convert_pngs helper created
- [ ] Compression benchmarking logged
- [ ] Method documented with examples

---

## Task 51: Implement Lossy WebP Conversion

### Overview
Implement lossy WebP conversion method for JPEG images and photos where slight quality loss is acceptable in exchange for significantly smaller file sizes.

### Dependencies
- Task 49: Create WebP converter service

### Instructions

1. **Add convert_jpeg_to_webp method**
   - Open webp_converter.py
   - Add method to WebPConverter class
   - Method signature: `convert_jpeg_to_webp(self, jpeg_source, quality=85)`
   - Specialized for JPEG conversion

2. **Set lossy conversion parameters**
   - Call convert_to_webp with lossless=False
   - Use quality parameter (default 85)
   - Quality 85 provides good balance of size vs quality

3. **Optimize for photo characteristics**
   - JPEG typically used for photos
   - Lossy compression works well on gradients
   - Method 4-6 provides good compression
   - Higher quality (80-90) for product images

4. **Handle JPEG color modes**
   - Support RGB (most common)
   - Support L (grayscale)
   - Convert CMYK to RGB if needed (rare)
   - Ensure proper color space handling

5. **Configure quality levels**
   - Create quality presets:
     - HIGH: 90 (minimal loss, larger size)
     - MEDIUM: 85 (balanced, default)
     - LOW: 75 (more loss, smaller size)
   - Document when to use each level

6. **Remove EXIF data option**
   - Add parameter: strip_metadata=True
   - Remove EXIF, GPS, camera info
   - Reduces file size slightly
   - Privacy benefit (already done in Task 29)

7. **Benchmark compression improvement**
   - JPEG to WebP typically 25-35% reduction
   - Log conversion results
   - Track quality setting vs file size
   - Use for optimization tuning

8. **Create batch JPEG conversion helper**
   - Method: `batch_convert_jpegs(self, jpeg_files, quality=85)`
   - Accept list of JPEG file paths
   - Convert all to WebP with specified quality
   - Return list of WebP files

### Lossy WebP Configuration

```python
# Configuration for lossy WebP (photos)
save_options = {
    'format': 'WEBP',
    'lossless': False,
    'quality': 85,   # 1-100, 85 recommended
    'method': 4      # Balanced speed/compression
}
```

### Quality Setting Guidelines

| Quality | Use Case | Visual Difference | Size Reduction |
|---------|----------|-------------------|----------------|
| 90-100 | Product hero images | Imperceptible | 20-25% |
| 80-89 | Product gallery | Minimal | 30-35% |
| 70-79 | Thumbnails | Slight | 40-45% |
| 60-69 | Rarely used | Noticeable | 50%+ |

### JPEG to WebP Comparison

| Image Type | JPEG Size | WebP Size | Savings |
|-----------|-----------|-----------|---------|
| Product photo | 150 KB | 100 KB | 33% |
| Lifestyle shot | 300 KB | 200 KB | 33% |
| Detail close-up | 80 KB | 55 KB | 31% |
| Thumbnail | 20 KB | 14 KB | 30% |

### Expected Outcome
```
WebPConverter class updated with:
- convert_jpeg_to_webp(jpeg_source, quality) method
- Lossy conversion with quality control
- Quality preset constants
- Metadata stripping option
- Batch conversion helper
```

### Verification Checklist
- [ ] convert_jpeg_to_webp method added
- [ ] Calls convert_to_webp with lossless=False
- [ ] Accepts quality parameter (default 85)
- [ ] Handles RGB and grayscale modes
- [ ] Converts CMYK to RGB if needed
- [ ] Quality presets defined (HIGH, MEDIUM, LOW)
- [ ] strip_metadata parameter available
- [ ] batch_convert_jpegs helper created
- [ ] Compression benchmarking logged
- [ ] Method documented with quality guidelines

---

## Task 52: Add WebP Paths to ImageVariant

### Overview
Extend the ImageVariant model to store paths for WebP versions of each image size (thumbnail, medium, large), enabling efficient serving of modern format while maintaining original files.

### Dependencies
- Task 24: Create ImageVariant model
- Task 49: Create WebP converter service

### Instructions

1. **Open image_variant.py file**
   - Navigate to `backend/apps/products/media/models/image_variant.py`
   - Locate ImageVariant model definition

2. **Add webp_thumbnail_path field**
   - Add CharField with max_length=500
   - Set blank=True, null=True (optional, generated later)
   - Add help_text explaining WebP thumbnail storage
   - Stores path to 150x150 WebP thumbnail

3. **Add webp_medium_path field**
   - Add CharField with max_length=500
   - Set blank=True, null=True
   - Add help_text for WebP medium image
   - Stores path to 500x500 WebP version

4. **Add webp_large_path field**
   - Add CharField with max_length=500
   - Set blank=True, null=True
   - Add help_text for WebP large image
   - Stores path to 1000x1000 WebP version

5. **Add webp_original_path field (optional)**
   - Add CharField with max_length=500
   - Set blank=True, null=True
   - Stores WebP version of original if converted
   - Useful for full-quality WebP delivery

6. **Add helper method to get WebP path**
   - Method: `get_webp_path(self, size)`
   - Accept size parameter: 'thumbnail', 'medium', 'large'
   - Return appropriate webp_*_path value
   - Return None if WebP not generated yet

7. **Add helper method to check WebP availability**
   - Method: `has_webp(self, size=None)`
   - If size specified, check that specific size
   - If no size, check if any WebP versions exist
   - Return boolean
   - Useful for fallback logic

8. **Add get_all_webp_paths method**
   - Return dictionary with all WebP paths
   - Format: {'thumbnail': path, 'medium': path, 'large': path}
   - Useful for API responses

9. **Update model __str__ for clarity**
   - Include WebP status in string representation
   - Example: "Variants (3 WebP)" if WebP exists

10. **Run migration**
    - Generate migration: `python manage.py makemigrations`
    - Review migration file
    - Apply: `python manage.py migrate`
    - Fields added to database

### ImageVariant Model Structure

**Before:**
```
ImageVariant:
  - product_image (FK)
  - thumbnail_path
  - medium_path
  - large_path
  - processing_status
```

**After:**
```
ImageVariant:
  - product_image (FK)
  - thumbnail_path
  - medium_path
  - large_path
  - webp_thumbnail_path (NEW)
  - webp_medium_path (NEW)
  - webp_large_path (NEW)
  - processing_status
```

### Path Storage Strategy

| Size | Original Path | WebP Path |
|------|--------------|-----------|
| Thumbnail | /media/.../thumb.jpg | /media/.../webp/thumb.webp |
| Medium | /media/.../medium.jpg | /media/.../webp/medium.webp |
| Large | /media/.../large.jpg | /media/.../webp/large.webp |

### Expected Outcome
```
ImageVariant model updated with fields:
- webp_thumbnail_path
- webp_medium_path
- webp_large_path
- webp_original_path (optional)

Helper methods:
- get_webp_path(size)
- has_webp(size)
- get_all_webp_paths()

Migration created and applied
```

### Verification Checklist
- [ ] webp_thumbnail_path field added
- [ ] webp_medium_path field added
- [ ] webp_large_path field added
- [ ] All WebP fields set as blank=True, null=True
- [ ] get_webp_path method implemented
- [ ] has_webp method implemented
- [ ] get_all_webp_paths method implemented
- [ ] Migration generated
- [ ] Migration applied successfully
- [ ] Fields appear in database

---

## Task 53: Create WebP Fallback Logic

### Overview
Implement fallback logic to serve original image formats (JPEG/PNG) when WebP is not available or not supported by the browser, ensuring compatibility with all clients.

### Dependencies
- Task 52: Add WebP paths to ImageVariant
- Task 49: Create WebP converter service

### Instructions

1. **Create image_urls utility module**
   - Create file: `backend/apps/products/media/utils/image_urls.py`
   - Or add to existing utils.py
   - Contains URL generation functions

2. **Create get_image_url function**
   - Function signature: `get_image_url(image_variant, size, request=None)`
   - Accept ImageVariant instance
   - Accept size: 'thumbnail', 'medium', 'large'
   - Accept optional request object for browser detection
   - Return appropriate image URL

3. **Check WebP support**
   - If request provided, check Accept header (Task 54)
   - Determine if browser supports WebP
   - Store result in variable

4. **Check WebP availability**
   - Use image_variant.has_webp(size)
   - Verify WebP file actually exists
   - WebP may not be generated yet

5. **Implement fallback cascade**
   - If browser supports WebP AND WebP exists: return WebP URL
   - Otherwise: return original format URL
   - Ensures always returns valid URL

6. **Generate full URL**
   - Get relative path from ImageVariant
   - Use request.build_absolute_uri() if request available
   - Otherwise return relative path
   - Handle MEDIA_URL prefix

7. **Add get_responsive_urls function**
   - Function: `get_responsive_urls(image_variant, request=None)`
   - Return dictionary with all sizes
   - Include both WebP and fallback URLs
   - Format for srcset generation (Task 56)

8. **Create ImageUrlBuilder class (optional)**
   - Encapsulate URL generation logic
   - Builder pattern for flexibility
   - Methods: .with_size(), .for_browser(), .build()
   - Cleaner API for complex scenarios

9. **Handle missing variants gracefully**
   - If ImageVariant doesn't exist, return placeholder
   - Define PLACEHOLDER_IMAGE_URL constant
   - Ensures UI never shows broken images

10. **Add caching for URL generation**
    - URL generation can be called frequently
    - Cache WebP support check per session
    - Improves performance

### Fallback Decision Tree

```
┌─────────────────────────┐
│ Get Image URL           │
└───────────┬─────────────┘
            │
            ▼
      ┌──────────┐
      │ Browser  │
      │ supports │
      │ WebP?    │
      └────┬─┬───┘
           │ │
          Yes No
           │ │
           │ └─────────────┐
           │               │
           ▼               │
      ┌──────────┐        │
      │ WebP     │        │
      │ variant  │        │
      │ exists?  │        │
      └────┬─┬───┘        │
           │ │            │
          Yes No          │
           │ │            │
           │ └──────┐     │
           │        │     │
           ▼        ▼     ▼
     ┌─────────┐ ┌──────────┐
     │ Return  │ │ Return   │
     │ WebP URL│ │ Original │
     └─────────┘ └──────────┘
```

### URL Generation Examples

**WebP Available & Supported:**
```
/media/tenants/shop/products/123/webp/image-thumb.webp
```

**Fallback to Original:**
```
/media/tenants/shop/products/123/thumb/image.jpg
```

**Responsive URLs Dictionary:**
```python
{
    'thumbnail': {
        'webp': '/media/.../webp/thumb.webp',
        'original': '/media/.../thumb.jpg'
    },
    'medium': {...},
    'large': {...}
}
```

### Expected Outcome
```
Utility functions created:
- get_image_url(image_variant, size, request)
- get_responsive_urls(image_variant, request)
- (Optional) ImageUrlBuilder class

Implements intelligent fallback:
- WebP if available and supported
- Original format otherwise
- Placeholder for missing images
```

### Verification Checklist
- [ ] image_urls.py file created (or functions added to utils)
- [ ] get_image_url function implemented
- [ ] Checks browser WebP support
- [ ] Checks WebP variant availability
- [ ] Falls back to original format
- [ ] Generates full URLs with domain
- [ ] get_responsive_urls function implemented
- [ ] Returns dictionary with all sizes
- [ ] Handles missing ImageVariant gracefully
- [ ] Returns placeholder for missing images
- [ ] Functions documented with examples

---

## Task 54: Add Browser Detection Helper

### Overview
Create a utility function to detect WebP support from browser's Accept header, enabling server-side format selection for optimal delivery.

### Dependencies
- Task 53: Create WebP fallback logic

### Instructions

1. **Add browser detection function**
   - Add to image_urls.py or create browser_utils.py
   - Function signature: `supports_webp(request)`
   - Accept Django request object
   - Return boolean indicating WebP support

2. **Check Accept header**
   - Access request.headers.get('Accept', '') or request.META.get('HTTP_ACCEPT', '')
   - This header lists formats browser accepts
   - WebP support indicated by 'image/webp' in string

3. **Parse Accept header**
   - Split by comma to get list of accepted types
   - Check if 'image/webp' is in list
   - Case-insensitive comparison recommended
   - Return True if found, False otherwise

4. **Handle missing Accept header**
   - Some requests may not have Accept header
   - Default to False (assume no WebP support)
   - Safer to fall back than serve unsupported format

5. **Add user-agent based detection (optional)**
   - Some old browsers may send incorrect Accept header
   - Check User-Agent for known WebP-supporting browsers
   - Chrome 23+, Firefox 65+, Edge 18+, Safari 14+
   - Provides additional validation

6. **Cache detection result in session**
   - Store WebP support flag in session
   - Avoid parsing Accept header on every request
   - Clear cache method if needed
   - Improves performance for repeated requests

7. **Add get_supported_formats function**
   - Return list of all supported image formats
   - Parse full Accept header
   - Return: ['image/webp', 'image/jpeg', 'image/png', etc.]
   - Useful for advanced format selection

8. **Create BrowserCapabilities class (optional)**
   - Store multiple browser capabilities
   - Properties: supports_webp, supports_avif, supports_svg
   - Instantiate once per request
   - More extensible for future formats

### Accept Header Examples

**Modern Chrome:**
```
Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8
```
Result: supports_webp() = True

**Old Safari:**
```
Accept: image/png,image/*;q=0.8,*/*;q=0.5
```
Result: supports_webp() = False

**Firefox:**
```
Accept: image/webp,*/*
```
Result: supports_webp() = True

### Browser WebP Support Matrix

| Browser | WebP Support | Since Version |
|---------|--------------|---------------|
| Chrome | ✅ Yes | v23+ (2012) |
| Firefox | ✅ Yes | v65+ (2019) |
| Safari | ✅ Yes | v14+ (2020) |
| Edge | ✅ Yes | v18+ (2018) |
| IE 11 | ❌ No | Never |
| Opera | ✅ Yes | v12+ (2012) |

### Expected Outcome
```
Browser detection utilities:
- supports_webp(request) function
- Parses Accept header
- Returns boolean
- Session caching
- Optional: User-Agent validation
- Optional: BrowserCapabilities class
```

### Verification Checklist
- [ ] supports_webp function created
- [ ] Accepts Django request object
- [ ] Checks Accept header for 'image/webp'
- [ ] Case-insensitive checking
- [ ] Handles missing Accept header (returns False)
- [ ] Optional: User-Agent based validation
- [ ] Optional: Session caching for performance
- [ ] get_supported_formats function (optional)
- [ ] BrowserCapabilities class (optional)
- [ ] Function documented with examples
- [ ] Works with different Accept header formats

---

## Summary

This document established comprehensive WebP conversion and delivery infrastructure:

- **WebP Converter Service**: Converts images to modern WebP format with lossless and lossy modes
- **Lossless Conversion**: Optimized for PNG images, graphics, and text with exact pixel preservation
- **Lossy Conversion**: Optimized for JPEG photos with quality control and significant size reduction
- **WebP Path Storage**: Extended ImageVariant model to store WebP versions of all sizes
- **Fallback Logic**: Intelligent serving of WebP or original format based on availability and browser support
- **Browser Detection**: Server-side WebP support detection via Accept header parsing

The system achieves 25-35% file size reduction while maintaining quality and ensuring universal browser compatibility through automatic fallback.

---

## Next Steps

Continue to [02_Tasks-55-60_Responsive-CDN-Placeholder.md](02_Tasks-55-60_Responsive-CDN-Placeholder.md) to implement responsive image service, srcset generation, lazy loading, CDN integration, placeholder generation, and compression analysis.
