# Tasks 17-23: ImageProcessor Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** B - Image Processing Pipeline  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Product-Image-Models/](../Group-A_Product-Image-Models/)
- **→ Next Document:** [02_Tasks-24-28_ImageVariant-Async.md](02_Tasks-24-28_ImageVariant-Async.md)

---

## Document Overview

This document covers the installation of Pillow and creation of the ImageProcessor service class with methods for resizing images while maintaining aspect ratio or cropping to exact dimensions, plus generation of thumbnail, medium, and large size variants.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Install Pillow dependency | Low |
| 18 | Create ImageProcessor service | High |
| 19 | Implement resize_to_fit method | Medium |
| 20 | Implement resize_to_cover method | Medium |
| 21 | Implement create_thumbnail method | Low |
| 22 | Implement create_medium method | Low |
| 23 | Implement create_large method | Low |

---

## Task 17: Install Pillow Dependency

### Overview
Install the Pillow library, a Python imaging library required for all image processing operations including resizing, format conversion, and metadata extraction.

### Dependencies
- None (standalone dependency installation)

### Instructions

1. **Add to requirements file**
   - Open `backend/requirements/base.txt` or `requirements.txt`
   - Add line: `Pillow>=10.2.0`
   - Use version 10.2.0 or later for latest features and security fixes

2. **Install dependency**
   - Run: `pip install Pillow>=10.2.0`
   - Or run: `pip install -r requirements.txt` to install all dependencies

3. **Verify installation**
   - Run Python shell: `python manage.py shell`
   - Import Pillow: `from PIL import Image`
   - Check version: `Image.__version__`
   - Should show version 10.2.0 or higher

4. **Add system dependencies (if needed)**
   - Ubuntu/Debian: `sudo apt-get install libjpeg-dev zlib1g-dev`
   - For WebP support: `sudo apt-get install libwebp-dev`
   - macOS: `brew install jpeg webp`
   - Windows: Pre-built wheels include dependencies

5. **Document in README**
   - Note Pillow requirement in project README
   - List system dependencies for different OS

### Pillow Capabilities

| Feature | Description |
|---------|-------------|
| **Format Support** | JPEG, PNG, GIF, BMP, WebP, TIFF |
| **Resizing** | High-quality resampling algorithms |
| **Format Conversion** | Convert between formats |
| **EXIF Handling** | Read/write EXIF metadata |
| **Image Filters** | Blur, sharpen, enhance |
| **Drawing** | Add text, shapes, watermarks |

### Expected Outcome
```
backend/requirements/base.txt:
...
Django>=5.0
Pillow>=10.2.0  ← ADDED
djangorestframework>=3.15
...
```

### Verification Checklist
- [ ] Pillow>=10.2.0 added to requirements file
- [ ] Pillow installed in virtual environment
- [ ] Can import PIL.Image in Python shell
- [ ] Version 10.2.0 or higher confirmed
- [ ] System dependencies installed (if Linux/macOS)

---

## Task 18: Create ImageProcessor Service

### Overview
Create a service class that encapsulates all image processing operations. This provides a clean, testable interface for image manipulation and ensures consistent processing across the application.

### Dependencies
- Task 17: Install Pillow dependency

### Instructions

1. **Create service file**
   - Create `image_processor.py` in `backend/apps/products/media/services/`
   - Add module docstring explaining the service purpose

2. **Import required modules**
   - Import `Image` from `PIL`
   - Import `ImageOps` from `PIL` for orientation fixes
   - Import `io` for BytesIO
   - Import constants from `..constants`

3. **Define ImageProcessor class**
   - Create class `ImageProcessor`
   - Add class docstring describing available methods
   - This is a stateless service (no instance state)

4. **Add initialization method**
   - Define `__init__(self, image_file)` method
   - Accept image file (UploadedFile or file path)
   - Open image with PIL: `self.image = Image.open(image_file)`
   - Store original format: `self.format = self.image.format`

5. **Add close method**
   - Define `close(self)` method
   - Close the PIL image: `self.image.close()`
   - Call in cleanup or use as context manager

6. **Add save method**
   - Define `save(self, output, format=None, quality=None)` method
   - Accept output path or BytesIO object
   - Accept optional format (default to original)
   - Accept optional quality (default from constants)
   - Save image with specified parameters

7. **Add get_dimensions method**
   - Define `get_dimensions(self)` method
   - Return tuple: `(width, height)`
   - Returns current image size

8. **Add get_format method**
   - Define `get_format(self)` method
   - Return image format string (e.g., 'JPEG', 'PNG')

9. **Add context manager support**
   - Define `__enter__(self)` method returning self
   - Define `__exit__(self, exc_type, exc_val, exc_tb)` method calling close()
   - Allows: `with ImageProcessor(file) as processor: ...`

### Service Pattern Benefits

| Benefit | Description |
|---------|-------------|
| **Separation of Concerns** | Image logic separate from models |
| **Testability** | Easy to unit test without database |
| **Reusability** | Use across models (Product, Variant, User avatar) |
| **Maintainability** | Single place for image processing logic |
| **Error Handling** | Centralized error handling |

### Usage Pattern

```
Pattern 1: Context Manager (Recommended)
with ImageProcessor(uploaded_file) as processor:
    processor.resize_to_fit(500, 500)
    processor.save(output_path, quality=80)
# Image automatically closed

Pattern 2: Manual Management
processor = ImageProcessor(uploaded_file)
try:
    processor.resize_to_fit(500, 500)
    processor.save(output_path)
finally:
    processor.close()

Pattern 3: Quick Processing
processor = ImageProcessor(uploaded_file)
thumb = processor.create_thumbnail()
processor.close()
```

### Expected Outcome
```
backend/apps/products/media/services/
├── __init__.py                     # Import ImageProcessor
└── image_processor.py              # NEW (ImageProcessor class)

ImageProcessor class structure:
├── __init__(image_file)
├── close()
├── save(output, format, quality)
├── get_dimensions()
├── get_format()
├── __enter__()
└── __exit__(...)
```

### Verification Checklist
- [ ] `image_processor.py` file created
- [ ] ImageProcessor class defined
- [ ] `__init__` opens image with PIL
- [ ] close() method defined
- [ ] save() method accepts output, format, quality
- [ ] get_dimensions() returns (width, height)
- [ ] get_format() returns format string
- [ ] Context manager support (`__enter__`, `__exit__`)
- [ ] Service exported from services/__init__.py

---

## Task 19: Implement resize_to_fit Method

### Overview
Implement a method that resizes an image to fit within maximum dimensions while maintaining the original aspect ratio. This is useful for consistent sizing without cropping.

### Dependencies
- Task 18: Create ImageProcessor service

### Instructions

1. **Open image_processor.py**
   - Add method to ImageProcessor class

2. **Define resize_to_fit method**
   - Create `resize_to_fit(self, max_width, max_height)` method
   - Accept maximum width and height
   - Return self for method chaining

3. **Calculate aspect ratio**
   - Get current dimensions: `width, height = self.image.size`
   - Calculate width ratio: `width_ratio = max_width / width`
   - Calculate height ratio: `height_ratio = max_height / height`
   - Choose smaller ratio to ensure both dimensions fit

4. **Calculate new dimensions**
   - Use minimum ratio: `ratio = min(width_ratio, height_ratio)`
   - If ratio >= 1.0, image already fits (no resize needed)
   - Calculate: `new_width = int(width * ratio)`
   - Calculate: `new_height = int(height * ratio)`

5. **Resize image**
   - Use high-quality resampling: `Image.Resampling.LANCZOS`
   - Resize: `self.image = self.image.resize((new_width, new_height), Image.Resampling.LANCZOS)`
   - LANCZOS provides best quality for downsizing

6. **Return self**
   - Return `self` for method chaining
   - Allows: `processor.resize_to_fit(500, 500).save(output)`

7. **Add method docstring**
   - Explain that aspect ratio is maintained
   - Note that image will fit within max dimensions
   - May be smaller than max if aspect ratio differs

### resize_to_fit Logic

```
Example 1: Landscape Image
Original: 1200 × 800
Max: 500 × 500

Calculations:
- width_ratio = 500/1200 = 0.417
- height_ratio = 500/800 = 0.625
- ratio = min(0.417, 0.625) = 0.417

Result: 500 × 333 (width limited)
└─► Fits horizontally, vertical padding needed

Example 2: Portrait Image
Original: 800 × 1200
Max: 500 × 500

Calculations:
- width_ratio = 500/800 = 0.625
- height_ratio = 500/1200 = 0.417
- ratio = min(0.625, 0.417) = 0.417

Result: 333 × 500 (height limited)
└─► Fits vertically, horizontal padding needed

Example 3: Already Fits
Original: 300 × 200
Max: 500 × 500

Calculations:
- width_ratio = 500/300 = 1.67
- height_ratio = 500/200 = 2.5
- ratio = min(1.67, 2.5) = 1.67
- ratio >= 1.0 → No resize needed

Result: 300 × 200 (unchanged)
```

### Visual Representation

```
resize_to_fit(500, 500):

┌─────────────────┐          ┌───────────────────────┐
│                 │          │                       │
│  1200 × 800     │   →→→    │      500 × 333        │
│  (landscape)    │          │   (fits in 500×500)   │
│                 │          │                       │
└─────────────────┘          └───────────────────────┘
                             ↑ maintains aspect ratio

No cropping, preserves entire image content
```

### Resampling Algorithms

| Algorithm | Quality | Speed | Use Case |
|-----------|---------|-------|----------|
| NEAREST | Lowest | Fastest | Pixel art, sprites |
| BILINEAR | Low | Fast | Quick previews |
| BICUBIC | Medium | Medium | General use |
| **LANCZOS** | Highest | Slower | Production (recommended) |

### Expected Outcome
```
ImageProcessor class (updated):
├── __init__(image_file)
├── close()
├── save(output, format, quality)
├── get_dimensions()
├── get_format()
├── resize_to_fit(max_width, max_height)  ← NEW
├── __enter__()
└── __exit__(...)
```

### Verification Checklist
- [ ] resize_to_fit method added to ImageProcessor
- [ ] Method accepts max_width and max_height parameters
- [ ] Calculates aspect ratio correctly
- [ ] Uses min ratio to ensure both dimensions fit
- [ ] Skips resize if image already fits (ratio >= 1.0)
- [ ] Uses Image.Resampling.LANCZOS for quality
- [ ] Returns self for method chaining
- [ ] Docstring explains aspect ratio preservation

---

## Task 20: Implement resize_to_cover Method

### Overview
Implement a method that resizes and crops an image to exactly cover specified dimensions. This is useful for thumbnails that need exact dimensions, accepting some cropping.

### Dependencies
- Task 19: Implement resize_to_fit method

### Instructions

1. **Open image_processor.py**
   - Add method to ImageProcessor class

2. **Define resize_to_cover method**
   - Create `resize_to_cover(self, target_width, target_height)` method
   - Accept exact target dimensions
   - Return self for method chaining

3. **Calculate aspect ratios**
   - Current ratio: `current_ratio = width / height`
   - Target ratio: `target_ratio = target_width / target_height`

4. **Determine resize strategy**
   - If `current_ratio > target_ratio`: image is wider
     - Resize based on height
     - Crop horizontally (left and right)
   - If `current_ratio < target_ratio`: image is taller
     - Resize based on width
     - Crop vertically (top and bottom)

5. **Calculate resize dimensions**
   - For wider images: `new_height = target_height`, `new_width = int(height * current_ratio)`
   - For taller images: `new_width = target_width`, `new_height = int(width / current_ratio)`

6. **Resize image**
   - Resize to calculated dimensions using LANCZOS

7. **Calculate crop box**
   - For horizontal crop: `left = (new_width - target_width) // 2`, `right = left + target_width`
   - For vertical crop: `top = (new_height - target_height) // 2`, `bottom = top + target_height`
   - Center the crop

8. **Crop image**
   - Use: `self.image = self.image.crop((left, top, right, bottom))`

9. **Return self**
   - Return `self` for method chaining

### resize_to_cover Logic

```
Example 1: Landscape to Square
Original: 1200 × 800
Target: 500 × 500

Steps:
1. current_ratio = 1200/800 = 1.5
2. target_ratio = 500/500 = 1.0
3. current_ratio > target_ratio → wider
4. Resize based on height:
   new_height = 500
   new_width = 800 * 1.5 = 1200... wait, recalculate
   new_width = 500 * 1.5 = 750
5. Crop horizontally:
   left = (750 - 500) / 2 = 125
   right = 125 + 500 = 625
6. Result: 500 × 500 (center portion)

Example 2: Portrait to Square
Original: 800 × 1200
Target: 500 × 500

Steps:
1. current_ratio = 800/1200 = 0.67
2. target_ratio = 500/500 = 1.0
3. current_ratio < target_ratio → taller
4. Resize based on width:
   new_width = 500
   new_height = 1200 * 0.625 = 750
5. Crop vertically:
   top = (750 - 500) / 2 = 125
   bottom = 125 + 500 = 625
6. Result: 500 × 500 (center portion)
```

### Visual Representation

```
resize_to_cover(500, 500):

┌───────────────────────┐          ┌─────────────┐
│                       │          │             │
│    1200 × 800         │   →→→    │   500×500   │
│    (landscape)        │          │  (square)   │
│                       │          │             │
└───────────────────────┘          └─────────────┘
     └─ crop sides ─┘              ↑ exact size

Some content cropped to achieve exact dimensions
```

### Crop Positioning

| Position | Description | When to Use |
|----------|-------------|-------------|
| **Center (default)** | Crop equally from all sides | General use, balanced |
| Top | Keep top portion | Faces, headers |
| Bottom | Keep bottom portion | Feet, footers |
| Left | Keep left portion | LTR content |
| Right | Keep right portion | RTL content |

### Expected Outcome
```
ImageProcessor class (updated):
├── __init__(image_file)
├── close()
├── save(output, format, quality)
├── get_dimensions()
├── get_format()
├── resize_to_fit(max_width, max_height)
├── resize_to_cover(target_width, target_height)  ← NEW
├── __enter__()
└── __exit__(...)
```

### Verification Checklist
- [ ] resize_to_cover method added to ImageProcessor
- [ ] Method accepts target_width and target_height
- [ ] Calculates aspect ratios correctly
- [ ] Determines resize strategy based on ratios
- [ ] Resizes to cover dimensions (may be larger)
- [ ] Crops to exact target dimensions
- [ ] Centers crop (equal padding on both sides)
- [ ] Returns self for method chaining
- [ ] Docstring explains cropping behavior

---

## Tasks 21-23: Create Size Variant Methods

### Overview
Implement three convenience methods for creating standard size variants (thumbnail, medium, large) using the resize_to_fit method with predefined dimensions from constants.

### Dependencies
- Task 19: Implement resize_to_fit method
- Task 02: Define image size constants

### Instructions for All Three Methods

#### Task 21: Create Thumbnail Method

1. **Define create_thumbnail method**
   - Create `create_thumbnail(self)` method
   - No parameters (uses THUMBNAIL_SIZE from constants)
   - Call `self.resize_to_fit(*THUMBNAIL_SIZE)`
   - Return self

2. **Add method docstring**
   - Explain creates 150×150 thumbnail
   - Note aspect ratio is maintained

#### Task 22: Create Medium Method

1. **Define create_medium method**
   - Create `create_medium(self)` method
   - No parameters (uses MEDIUM_SIZE from constants)
   - Call `self.resize_to_fit(*MEDIUM_SIZE)`
   - Return self

2. **Add method docstring**
   - Explain creates 500×500 medium image
   - Note for product cards and category pages

#### Task 23: Create Large Method

1. **Define create_large method**
   - Create `create_large(self)` method
   - No parameters (uses LARGE_SIZE from constants)
   - Call `self.resize_to_fit(*LARGE_SIZE)`
   - Return self

2. **Add method docstring**
   - Explain creates 1000×1000 large image
   - Note for product detail page

### Method Usage Examples

```
Example 1: Generate All Sizes
with ImageProcessor(uploaded_file) as processor:
    # Thumbnail
    processor.create_thumbnail()
    processor.save('thumb.jpg')
    
    # Reload original
    processor = ImageProcessor(uploaded_file)
    
    # Medium
    processor.create_medium()
    processor.save('medium.jpg')
    
    # Reload original
    processor = ImageProcessor(uploaded_file)
    
    # Large
    processor.create_large()
    processor.save('large.jpg')

Example 2: Quick Thumbnail
processor = ImageProcessor(image_file)
processor.create_thumbnail().save(output_path, quality=80)
processor.close()
```

### Size Comparison

```
Original: 2000 × 1500 (3MP)
    │
    ├─► Thumbnail: 150 × 112  (~17KB)
    │   └─► Use: List views, cart items
    │
    ├─► Medium: 500 × 375  (~40KB)
    │   └─► Use: Product cards, search results
    │
    └─► Large: 1000 × 750  (~120KB)
        └─► Use: Detail page, zoom
```

### Constants Integration

```
From constants.py:
THUMBNAIL_SIZE = (150, 150)
MEDIUM_SIZE = (500, 500)
LARGE_SIZE = (1000, 1000)

Methods use these directly:
def create_thumbnail(self):
    return self.resize_to_fit(*THUMBNAIL_SIZE)
    # Equivalent to: resize_to_fit(150, 150)

Benefit: Change constants, all sizes update automatically
```

### Expected Outcome
```
ImageProcessor class (complete):
├── __init__(image_file)
├── close()
├── save(output, format, quality)
├── get_dimensions()
├── get_format()
├── resize_to_fit(max_width, max_height)
├── resize_to_cover(target_width, target_height)
├── create_thumbnail()  ← NEW (Task 21)
├── create_medium()     ← NEW (Task 22)
├── create_large()      ← NEW (Task 23)
├── __enter__()
└── __exit__(...)
```

### Verification Checklist
- [ ] create_thumbnail method defined
- [ ] create_medium method defined
- [ ] create_large method defined
- [ ] All three methods use constants (THUMBNAIL_SIZE, etc.)
- [ ] All three methods call resize_to_fit
- [ ] All three methods return self for chaining
- [ ] Docstrings explain size and use case
- [ ] Methods imported in services/__init__.py

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Install Pillow dependency | Pillow>=10.2.0 installed |
| 18 | Create ImageProcessor service | Service class with context manager |
| 19 | Implement resize_to_fit method | Maintain aspect ratio, fit within dimensions |
| 20 | Implement resize_to_cover method | Exact dimensions with cropping |
| 21 | Implement create_thumbnail method | 150×150 convenience method |
| 22 | Implement create_medium method | 500×500 convenience method |
| 23 | Implement create_large method | 1000×1000 convenience method |

### ImageProcessor Service Complete

```
ImageProcessor Class:
├── Initialization: Open image with PIL
├── Cleanup: Close image resource
├── Resizing:
│   ├── resize_to_fit (maintain aspect)
│   ├── resize_to_cover (crop to exact size)
│   ├── create_thumbnail (150×150)
│   ├── create_medium (500×500)
│   └── create_large (1000×1000)
├── Utilities:
│   ├── get_dimensions
│   ├── get_format
│   └── save (with quality control)
└── Context Manager: Automatic cleanup
```

### Resize Methods Comparison

| Method | Behavior | Output Size | Cropping | Use Case |
|--------|----------|-------------|----------|----------|
| resize_to_fit | Maintain aspect | Fits within max | None | Gallery, preserve content |
| resize_to_cover | Exact size | Exact target | Yes | Thumbnails, exact layouts |

### Next Steps
Proceed to [02_Tasks-24-28_ImageVariant-Async.md](02_Tasks-24-28_ImageVariant-Async.md) to create the ImageVariant model for storing processed image paths and implement async processing with Celery tasks.

---

## Notes for AI Agents

1. **Pillow Version:** Use 10.2.0+ for security and performance
2. **LANCZOS Resampling:** Best quality for downsizing images
3. **Context Manager:** Always use to ensure proper cleanup
4. **resize_to_fit:** Maintains aspect ratio, no cropping
5. **resize_to_cover:** Exact dimensions, center crop
6. **Constants Integration:** Size methods use centralized constants
7. **Method Chaining:** All methods return self for fluent API
8. **Performance:** LANCZOS ~50-100ms per resize operation
9. **Next Document:** ImageVariant model and async processing
10. **Service Pattern:** Testable, reusable, maintainable
