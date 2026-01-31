# Tasks 17-26: Image Resize and Transform

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 10 - Advanced Image Optimization  
> **Group:** B - Image Processor  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-A_Storage-CDN-Setup](../Group-A_Storage-CDN-Setup/)
- **→ Next Document:** [02_Tasks-27-34_Pipeline-Cache.md](02_Tasks-27-34_Pipeline-Cache.md)

---

## Document Overview

This document establishes the core image processing capabilities using Sharp.js library for the LankaCommerce Cloud platform. It covers the installation and configuration of Sharp, creation of the main ImageProcessor class, implementation of resize and transformation methods, and basic image manipulation features including cropping, compression, and watermarking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Install Sharp | Low | 15 min |
| 18 | Create ImageProcessor Class | Medium | 40 min |
| 19 | Create Resize Method | Medium | 35 min |
| 20 | Create Resize Presets | Low | 20 min |
| 21 | Create Aspect Ratio | Low | 25 min |
| 22 | Create Crop Method | Low | 30 min |
| 23 | Create Smart Crop | Medium | 50 min |
| 24 | Create Compress Method | Medium | 35 min |
| 25 | Create Quality Presets | Low | 20 min |
| 26 | Create Watermark | Medium | 45 min |

---

## Task 17: Install Sharp

### Overview
Install and configure the Sharp image processing library for high-performance image transformations. Sharp is chosen for its speed, memory efficiency, and comprehensive feature set, making it ideal for the high-volume image processing requirements of LankaCommerce Cloud.

### Dependencies
- Node.js environment configured
- Package management system (npm/yarn) available
- Backend image processing service structure in place
- System libraries for image processing (libvips) support

### Instructions

1. **Install Sharp package**
   - Add Sharp as a production dependency in the media processing service
   - Ensure version compatibility with Node.js runtime
   - Install platform-specific binaries for production environment
   - Verify installation with version check and basic functionality test

2. **Configure system dependencies**
   - Ensure libvips library is available on deployment systems
   - Configure Docker images to include required system libraries
   - Set up environment variables for Sharp configuration
   - Test cross-platform compatibility (development vs production)

3. **Set up Sharp configuration**
   - Configure memory limits for large image processing
   - Set up concurrency limits for resource management
   - Configure cache settings for temporary file handling
   - Establish error handling for library initialization

4. **Validate installation**
   - Test basic image operations (load, resize, save)
   - Verify supported input formats (JPEG, PNG, WebP, GIF, TIFF)
   - Confirm output format capabilities
   - Check performance benchmarks against requirements

### Sharp Configuration Matrix

| Setting | Development | Production | Purpose |
|---------|-------------|------------|---------|
| Memory Limit | 512MB | 2GB | Large image handling |
| Concurrency | CPU cores | CPU cores * 0.8 | Resource management |
| Cache Size | 100MB | 500MB | Temporary processing |
| Timeout | 30 seconds | 60 seconds | Operation limits |

### Expected Outcome
- Sharp library installed and configured correctly
- System dependencies available for all deployment environments
- Performance validated against processing requirements
- Foundation ready for image processor implementation

### Verification Checklist
- [ ] Sharp package installed without errors
- [ ] System libraries (libvips) available and functional
- [ ] Basic image operations complete successfully
- [ ] Performance meets baseline requirements (>50 images/minute)
- [ ] Memory usage within acceptable limits

---

## Task 18: Create ImageProcessor Class

### Overview
Design and implement the central ImageProcessor class that serves as the main interface for all image processing operations in LankaCommerce Cloud. The class provides a unified API for image transformations while maintaining tenant isolation and processing queue integration.

### Dependencies
- Task 17 (Sharp installation) completed
- Object-oriented programming structure established
- Tenant context management system available
- Error handling and logging framework operational

### Instructions

1. **Design class architecture**
   - Create main ImageProcessor class with dependency injection
   - Implement builder pattern for chained operations
   - Design method signatures for all transformation types
   - Establish internal state management for processing pipeline

2. **Implement core functionality**
   - Image loading with format detection and validation
   - Metadata extraction and preservation options
   - Processing pipeline state management
   - Output format and quality management

3. **Add tenant isolation features**
   - Tenant context injection for all operations
   - Tenant-specific processing limits and quotas
   - Isolated temporary file handling
   - Tenant watermark and branding support

4. **Create error handling system**
   - Comprehensive error catching and reporting
   - Graceful degradation for unsupported operations
   - Processing timeout and resource limit enforcement
   - Detailed logging for debugging and monitoring

### ImageProcessor Architecture

```
ImageProcessor Class Structure:
├── Core Methods
│   ├── loadImage(path, tenant)
│   ├── saveImage(path, options)
│   ├── getMetadata()
│   └── resetPipeline()
├── Transformation Methods
│   ├── resize(width, height, options)
│   ├── crop(x, y, width, height)
│   ├── compress(quality, format)
│   └── transform(matrix)
├── Utility Methods
│   ├── validateInput(image)
│   ├── optimizeOutput(options)
│   ├── generateThumbnail(size)
│   └── extractColors()
└── Tenant Methods
    ├── applyTenantSettings(tenant)
    ├── addWatermark(tenant)
    ├── checkQuota(tenant)
    └── logOperation(tenant, operation)
```

### Processing Pipeline Flow

```
Image Processing Flow:
Load Original Image
    │
    ▼
Validate Format & Size
    │
    ▼
Apply Tenant Context
    │
    ▼
Execute Transformation Chain
    │
    ▼
Apply Output Optimization
    │
    ▼
Save Processed Image
    │
    ▼
Update Metadata & Logs
```

### Expected Outcome
- Comprehensive ImageProcessor class with full feature set
- Tenant-aware processing with isolation and quotas
- Chainable method interface for complex transformations
- Robust error handling and monitoring integration

### Verification Checklist
- [ ] ImageProcessor class instantiates without errors
- [ ] Basic image loading and saving functions correctly
- [ ] Tenant context properly isolated across operations
- [ ] Error handling captures and reports issues appropriately
- [ ] Method chaining works for multiple transformations

---

## Task 19: Create Resize Method

### Overview
Implement intelligent image resizing functionality that maintains quality while optimizing for different use cases. The resize method supports various algorithms and provides options for different content types common in Sri Lankan e-commerce environments.

### Dependencies
- Task 18 (ImageProcessor class) operational
- Sharp resize algorithms understood
- LankaCommerce image size requirements defined
- Performance benchmarks established for resize operations

### Instructions

1. **Implement resize algorithms**
   - Lanczos algorithm for high-quality photographic content
   - Cubic interpolation for product images and graphics
   - Bilinear interpolation for fast thumbnail generation
   - Nearest neighbor for pixel art and simple graphics

2. **Add resize options**
   - Maintain aspect ratio with intelligent padding
   - Crop to exact dimensions when needed
   - Upscaling protection with quality warnings
   - Progressive resizing for large dimension changes

3. **Create size validation**
   - Minimum size limits (50x50 pixels) for usability
   - Maximum size limits (4000x4000 pixels) for performance
   - Aspect ratio validation for specific use cases
   - File size prediction and warnings

4. **Optimize for common use cases**
   - Product catalog images: 800x800, 400x400, 150x150
   - Profile pictures: 200x200, 100x100, 50x50
   - Banner images: 1200x300, 800x200
   - Thumbnail generation: 150x150 with smart cropping

### Resize Algorithm Matrix

| Content Type | Algorithm | Quality | Speed | Use Case |
|--------------|-----------|---------|--------|----------|
| Product Photos | Lanczos | Highest | Slow | Catalog images |
| User Profiles | Cubic | High | Medium | Profile pictures |
| Thumbnails | Bilinear | Medium | Fast | Quick previews |
| Graphics/Icons | Nearest | Perfect | Fastest | Pixel art, logos |

### Common Size Presets

```
LankaCommerce Standard Sizes:
├── Product Images
│   ├── Original: Max 2000x2000
│   ├── Large: 800x800
│   ├── Medium: 400x400
│   └── Small: 150x150
├── Profile Pictures
│   ├── Large: 200x200
│   ├── Medium: 100x100
│   └── Thumbnail: 50x50
├── Marketing Banners
│   ├── Desktop: 1200x300
│   ├── Tablet: 800x200
│   └── Mobile: 400x100
└── Receipt Images
    ├── Preview: 300x400
    ├── Thumbnail: 150x200
    └── Icon: 50x67
```

### Expected Outcome
- High-quality image resizing with multiple algorithm options
- Optimized presets for common LankaCommerce use cases
- Intelligent aspect ratio handling and validation
- Performance optimized for high-volume processing

### Verification Checklist
- [ ] Resize operations produce expected output dimensions
- [ ] Image quality maintained across different algorithms
- [ ] Aspect ratio preservation works correctly
- [ ] Performance meets throughput requirements
- [ ] Size validation prevents invalid operations

---

## Task 20: Create Resize Presets

### Overview
Establish predefined resize configurations optimized for specific use cases within the LankaCommerce Cloud platform. The preset system simplifies image processing while ensuring consistency across the platform and optimizing for Sri Lankan business needs.

### Dependencies
- Task 19 (resize method) implemented
- Platform image requirements documented
- User interface design specifications available
- Performance testing framework operational

### Instructions

1. **Define preset categories**
   - Product catalog presets for e-commerce displays
   - Profile image presets for user accounts
   - Marketing material presets for campaigns
   - Document processing presets for receipts and invoices

2. **Create size-specific presets**
   - Square formats for profile pictures and product thumbnails
   - Rectangle formats for banners and marketing materials
   - Portrait formats for receipts and document scans
   - Landscape formats for header images and banners

3. **Implement quality tiers**
   - High quality presets for hero images and featured products
   - Standard quality presets for general catalog use
   - Optimized presets for mobile and bandwidth-limited users
   - Thumbnail presets for quick loading and previews

4. **Add context-aware selection**
   - Automatic preset selection based on image content analysis
   - Device-specific preset selection (mobile, tablet, desktop)
   - Bandwidth-aware preset selection for different connection speeds
   - Tenant-specific preset customization options

### Preset Configuration Matrix

| Preset Name | Dimensions | Quality | Format | Use Case |
|-------------|------------|---------|--------|----------|
| product-hero | 800x800 | 85% | WebP | Featured products |
| product-catalog | 400x400 | 80% | WebP | Product listings |
| product-thumb | 150x150 | 75% | WebP | Quick previews |
| profile-large | 200x200 | 80% | WebP | User profiles |
| profile-small | 50x50 | 70% | WebP | Comments/reviews |
| banner-desktop | 1200x300 | 85% | WebP | Desktop banners |
| banner-mobile | 400x100 | 80% | WebP | Mobile banners |
| receipt-preview | 300x400 | 90% | JPEG | Document preview |

### Preset Selection Logic

```
Automatic Preset Selection:
Image Analysis
    │
    ▼
Content Type Detection
├── Square Aspect → Product/Profile Presets
├── Landscape → Banner/Marketing Presets
├── Portrait → Document/Receipt Presets
└── Custom → Manual Selection Required
    │
    ▼
Device Context Analysis
├── Mobile → Optimized/Small Presets
├── Tablet → Medium/Balanced Presets
└── Desktop → Large/High Quality Presets
    │
    ▼
Apply Selected Preset
```

### Expected Outcome
- Consistent image sizing across all platform components
- Optimized presets for specific Sri Lankan business use cases
- Automatic preset selection reducing manual configuration
- Performance optimization through standardized sizes

### Verification Checklist
- [ ] All preset configurations generate expected output
- [ ] Preset selection logic chooses appropriate sizes
- [ ] Quality settings balance file size and visual quality
- [ ] Custom preset creation and management functional
- [ ] Performance impact of preset processing acceptable

---

## Task 21: Create Aspect Ratio

### Overview
Implement aspect ratio management to ensure consistent image proportions while handling various input formats. The system maintains visual consistency across the platform while providing flexibility for different content types and display requirements.

### Dependencies
- Task 20 (resize presets) operational
- Mathematical ratio calculation utilities available
- Content type classification system functional
- Image dimension analysis capabilities established

### Instructions

1. **Implement ratio calculation**
   - Calculate greatest common divisor for ratio simplification
   - Support common ratios (1:1, 4:3, 16:9, 3:2, 21:9)
   - Handle arbitrary ratios for custom use cases
   - Provide ratio validation and correction suggestions

2. **Create ratio enforcement**
   - Crop to exact ratio with intelligent positioning
   - Letterbox/pillarbox with configurable background colors
   - Stretch with quality warnings for inappropriate use
   - Smart padding with content-aware background generation

3. **Design ratio-specific optimizations**
   - Square ratios (1:1) for product thumbnails and profiles
   - Landscape ratios (16:9, 4:3) for banners and hero images
   - Portrait ratios (3:4, 9:16) for mobile displays and receipts
   - Panoramic ratios (21:9, 32:9) for wide banners

4. **Add contextual ratio selection**
   - Automatic ratio detection from content analysis
   - Platform-specific ratio requirements (social media, print)
   - Responsive ratio selection based on display context
   - Tenant-specific ratio preferences and branding requirements

### Aspect Ratio Management

```
Ratio Processing Options:
Original Image (Any Ratio)
    │
    ▼
Target Ratio Analysis
├── Exact Match → No Processing
├── Close Match → Minor Crop/Pad
└── Different Ratio → Choose Method:
    ├── Crop (Focus on center/smart crop)
    ├── Letterbox (Add padding)
    ├── Stretch (Quality warning)
    └── Smart Fill (Content-aware)
```

### Common Ratio Applications

| Ratio | Decimal | Use Case | Platform Context |
|-------|---------|----------|------------------|
| 1:1 | 1.0 | Product thumbnails, profile pics | Instagram, catalog grids |
| 4:3 | 1.333 | Traditional photos, presentations | Standard displays |
| 16:9 | 1.778 | Hero images, video thumbnails | Widescreen, modern displays |
| 3:2 | 1.5 | Photography, print materials | DSLR cameras, prints |
| 9:16 | 0.563 | Mobile portraits, stories | Mobile-first, vertical |
| 21:9 | 2.333 | Ultra-wide banners | Cinema displays, headers |

### Smart Crop Positioning

```
Intelligent Crop Focus:
Face Detection Available
├── Center on primary face
└── Center on face group centroid

Product Images
├── Center on product (remove background)
└── Focus on brand/logo area

Text Content
├── Preserve text readability
└── Maintain important content visibility

Generic Content
├── Rule of thirds positioning
└── Center-weighted cropping
```

### Expected Outcome
- Consistent aspect ratios across all platform images
- Intelligent handling of ratio conversions with minimal quality loss
- Automated ratio selection based on content and context
- Support for custom ratios with validation and guidance

### Verification Checklist
- [ ] Aspect ratio calculations are mathematically accurate
- [ ] Crop positioning preserves important content
- [ ] Letterboxing uses appropriate background colors
- [ ] Ratio enforcement maintains visual quality
- [ ] Smart ratio selection chooses contextually appropriate ratios

---

## Task 22: Create Crop Method

### Overview
Develop comprehensive image cropping functionality supporting manual positioning, automated cropping, and content-aware cropping strategies. The system provides precise control while offering intelligent defaults for various use cases in LankaCommerce Cloud.

### Dependencies
- Task 21 (aspect ratio management) functional
- Image content analysis capabilities available
- Coordinate system and positioning logic established
- Crop area validation and boundary checking implemented

### Instructions

1. **Implement crop positioning methods**
   - Absolute pixel coordinates for precise manual control
   - Percentage-based positioning for responsive layouts
   - Named positions (center, top-left, bottom-right, etc.)
   - Offset-based positioning from reference points

2. **Create crop area validation**
   - Boundary checking to prevent invalid crop areas
   - Minimum crop size enforcement for usability
   - Aspect ratio validation for crop dimensions
   - Overlap detection for multiple crop operations

3. **Add crop preview and optimization**
   - Generate crop preview thumbnails for user confirmation
   - Calculate optimal crop sizes for different output requirements
   - Provide crop suggestions based on content analysis
   - Validate crop quality and recommend adjustments

4. **Implement batch cropping capabilities**
   - Multiple crop areas from single source image
   - Consistent cropping across image sets
   - Template-based cropping for standardization
   - Queue processing for large-scale crop operations

### Crop Method Matrix

| Method Type | Input Format | Precision | Use Case |
|-------------|--------------|-----------|----------|
| Absolute | (x, y, width, height) pixels | Exact | Manual editing |
| Percentage | (x%, y%, w%, h%) | Relative | Responsive layouts |
| Named Position | "center", "top-left" etc. | Preset | Quick operations |
| Smart Focus | Content analysis | Automatic | Batch processing |

### Crop Positioning System

```
Coordinate System:
┌─────────────────────────┐ (0,0) = Top-left
│ (0,0)           (w,0)   │
│                         │
│        Crop Area        │
│     ┌─────────┐         │
│     │  (x,y)  │         │
│     │         │         │
│     │         │         │
│     └─────────┘         │
│                         │
│ (0,h)           (w,h)   │
└─────────────────────────┘

Named Positions:
├── center: ((w-cw)/2, (h-ch)/2)
├── top-left: (0, 0)
├── top-right: (w-cw, 0)
├── bottom-left: (0, h-ch)
└── bottom-right: (w-cw, h-ch)
```

### Crop Validation Rules

| Validation | Rule | Error Message | Action |
|------------|------|---------------|---------|
| Boundaries | Crop within image bounds | "Crop area exceeds image boundaries" | Adjust to fit |
| Minimum Size | Width/height ≥ 50px | "Crop area too small for processing" | Increase size |
| Maximum Size | Area ≤ original image | "Crop area larger than source" | Limit to source |
| Aspect Ratio | Valid ratio for output | "Invalid aspect ratio for target" | Suggest adjustment |

### Expected Outcome
- Flexible cropping system supporting manual and automated operations
- Intelligent crop positioning with content-aware suggestions
- Comprehensive validation preventing invalid crop operations
- Batch processing capabilities for efficient large-scale operations

### Verification Checklist
- [ ] Manual crop coordinates produce expected results
- [ ] Named position cropping works for all defined positions
- [ ] Boundary validation prevents invalid crop operations
- [ ] Crop previews accurately represent final output
- [ ] Batch cropping processes multiple images consistently

---

## Task 23: Create Smart Crop

### Overview
Implement AI-powered smart cropping that automatically identifies important content areas and crops images intelligently. The smart crop system uses content analysis, face detection, and saliency mapping to preserve the most important parts of images during cropping operations.

### Dependencies
- Task 22 (basic crop method) operational
- Content analysis and object detection libraries available
- Face detection capabilities (optional but recommended)
- Saliency detection algorithms or APIs accessible

### Instructions

1. **Implement content analysis for smart cropping**
   - Edge detection to identify object boundaries and important features
   - Contrast analysis to find areas of visual interest
   - Color distribution analysis for balanced crop selection
   - Texture analysis to preserve detailed areas

2. **Add face detection and human-focused cropping**
   - Face detection for portrait and profile image cropping
   - Eye position analysis for optimal face centering
   - Group photo handling with multiple face detection
   - Fallback to geometric center when no faces detected

3. **Create product-aware cropping for e-commerce**
   - Background subtraction to isolate product from background
   - Logo and brand element detection for marketing materials
   - Text region preservation for images with important text
   - Geometric shape detection for products with defined shapes

4. **Implement saliency-based cropping algorithms**
   - Visual attention modeling to identify focal points
   - Rule of thirds application for aesthetic composition
   - Entropy-based cropping for maximum information preservation
   - Machine learning models for content-specific optimization

### Smart Crop Decision Tree

```
Smart Crop Analysis Flow:
Input Image Analysis
    │
    ▼
Content Type Detection
├── Human Faces Detected
│   ├── Single Face → Center on face
│   └── Multiple Faces → Group composition
├── Product/Object Detected  
│   ├── Clear Background → Isolate product
│   └── Complex Background → Saliency analysis
├── Text Content Detected
│   ├── Preserve text regions
│   └── Balance text with visual elements
└── Generic Content
    ├── High contrast areas
    ├── Rule of thirds positioning
    └── Maximum entropy preservation
```

### Smart Crop Algorithms

| Algorithm | Strength | Use Case | Processing Time |
|-----------|----------|----------|-----------------|
| Face Detection | High for portraits | Profile pics, team photos | Fast |
| Saliency Mapping | High for complex scenes | Product photos, landscapes | Medium |
| Edge Detection | Medium for all content | General purpose fallback | Fast |
| Entropy Analysis | High for information dense | Documents, detailed images | Slow |

### Content-Specific Optimization

```
Smart Crop Strategies by Content Type:
├── Portrait Images
│   ├── Face detection + eye positioning
│   ├── Upper body framing rules
│   └── Background blur consideration
├── Product Images
│   ├── Background removal/detection
│   ├── Product boundary analysis
│   └── Brand element preservation
├── Landscape/Scene Images
│   ├── Horizon line detection
│   ├── Foreground/background separation
│   └── Point of interest identification
└── Document/Text Images
    ├── Text block detection
    ├── Reading flow preservation
    └── Important element highlighting
```

### Quality Scoring System

```
Smart Crop Quality Metrics:
├── Content Preservation Score (0-100)
│   ├── Important feature retention
│   ├── Information density preservation
│   └── Visual balance maintenance
├── Aesthetic Quality Score (0-100)
│   ├── Composition rule adherence
│   ├── Visual flow and balance
│   └── Crop boundary smoothness  
└── Technical Quality Score (0-100)
    ├── Edge preservation quality
    ├── Contrast maintenance
    └── Resolution optimization
```

### Expected Outcome
- Intelligent automated cropping preserving important content
- Content-aware algorithms optimized for different image types
- High-quality results reducing manual intervention requirements
- Scalable processing suitable for large-volume operations

### Verification Checklist
- [ ] Face detection correctly identifies and centers on faces
- [ ] Product images preserve main product in crop area
- [ ] Text-heavy images maintain readability after cropping
- [ ] Quality scores accurately reflect crop effectiveness
- [ ] Processing time acceptable for production use

---

## Task 24: Create Compress Method

### Overview
Develop intelligent image compression that balances file size reduction with visual quality preservation. The compression system adapts to content types and delivery requirements while maintaining the professional quality expected in LankaCommerce Cloud applications.

### Dependencies
- Task 23 (smart crop) functional
- Image quality assessment tools available
- File size optimization requirements defined
- Compression algorithm libraries (Sharp built-ins) accessible

### Instructions

1. **Implement adaptive compression algorithms**
   - JPEG compression with progressive encoding for photographs
   - PNG optimization with palette reduction for graphics
   - WebP compression with both lossy and lossless modes
   - AVIF compression for next-generation format support

2. **Create content-aware quality selection**
   - High detail preservation for product photos and professional images
   - Balanced compression for user-generated content
   - Aggressive compression for thumbnails and preview images
   - Lossless compression for images with text or sharp edges

3. **Add compression optimization features**
   - Progressive JPEG encoding for better perceived loading speed
   - Chroma subsampling optimization for human visual perception
   - Metadata stripping to reduce file size without quality loss
   - Multi-pass compression for optimal quality-to-size ratio

4. **Implement quality validation and feedback**
   - SSIM (Structural Similarity Index) for quality measurement
   - File size target achievement with quality boundaries
   - Visual quality assessment with automated warnings
   - Compression artifact detection and mitigation

### Compression Strategy Matrix

| Content Type | Format | Quality Range | Method | Target Size Reduction |
|--------------|--------|---------------|--------|----------------------|
| Product Photos | JPEG | 80-90% | Progressive | 60-80% |
| User Profiles | WebP | 75-85% | Lossy optimized | 70-85% |
| Graphics/Logos | PNG | Lossless | Palette optimized | 30-50% |
| Thumbnails | WebP | 60-75% | Aggressive lossy | 85-95% |
| Documents | JPEG | 85-95% | Text optimized | 50-70% |

### Compression Quality Levels

```
Quality Level Framework:
├── Maximum Quality (95-100%)
│   ├── Hero images and featured products  
│   ├── Professional photography
│   └── Print-ready materials
├── High Quality (80-95%)
│   ├── Product catalog images
│   ├── Marketing materials
│   └── User profile pictures
├── Standard Quality (65-80%)
│   ├── General content images
│   ├── Blog and article images
│   └── Social media content
└── Optimized Quality (40-65%)
    ├── Thumbnail images
    ├── Preview images
    └── Mobile-optimized content
```

### Progressive Enhancement Strategy

```
Format Selection by Browser Support:
Modern Browser Support
├── AVIF Available → Use AVIF (best compression)
├── WebP Available → Use WebP (good compression)
└── Legacy → Use JPEG/PNG (universal support)

Quality Adaptation by Context:
├── High bandwidth → Higher quality settings
├── Mobile/Limited → Lower quality, smaller files
└── CDN edge cache → Multiple quality variants
```

### Compression Pipeline

```
Compression Process Flow:
Original Image Input
    │
    ▼
Content Analysis
├── Photographic → JPEG/WebP optimization
├── Graphic → PNG/WebP optimization  
├── Mixed → Hybrid approach
└── Text-heavy → Lossless preservation
    │
    ▼
Quality Setting Selection
├── Content importance
├── Display context
├── Bandwidth considerations
└── Storage requirements
    │
    ▼
Multi-pass Compression
├── Initial compression
├── Quality assessment
├── Size target check
└── Final optimization
    │
    ▼
Output Validation & Storage
```

### Expected Outcome
- Intelligent compression reducing file sizes while preserving visual quality
- Content-aware optimization for different image types
- Progressive enhancement supporting modern formats with fallbacks
- Automated quality validation ensuring consistent results

### Verification Checklist
- [ ] Compression achieves target file size reductions
- [ ] Visual quality maintained within acceptable thresholds
- [ ] Different formats optimized according to content type
- [ ] Progressive JPEG loading improves perceived performance
- [ ] Quality assessment accurately identifies compression artifacts

---

## Task 25: Create Quality Presets

### Overview
Establish standardized quality presets that simplify compression settings while ensuring consistent output across the LankaCommerce Cloud platform. The preset system balances automation with flexibility, allowing for customization while maintaining platform-wide consistency.

### Dependencies
- Task 24 (compress method) operational
- Platform quality requirements documented
- User experience performance targets defined
- A/B testing framework for quality optimization available

### Instructions

1. **Design preset quality tiers**
   - Premium tier for high-end product photography and hero images
   - Standard tier for general catalog and content images
   - Optimized tier for mobile delivery and bandwidth conservation
   - Thumbnail tier for preview images and grid layouts

2. **Create use case-specific presets**
   - E-commerce product presets optimized for catalog browsing
   - Profile picture presets for social features
   - Document scan presets for receipt and invoice processing
   - Marketing material presets for campaigns and promotions

3. **Implement adaptive preset selection**
   - Automatic preset selection based on image analysis
   - Context-aware adjustment for device and bandwidth
   - Tenant-specific preset customization options
   - A/B testing integration for preset optimization

4. **Add preset management and validation**
   - Preset configuration interface for administrators
   - Quality validation and performance impact assessment
   - Preset versioning and rollback capabilities
   - Usage analytics and optimization recommendations

### Quality Preset Matrix

| Preset Name | Quality Level | Target Size | Format Priority | Use Case |
|-------------|---------------|-------------|-----------------|----------|
| premium | 90-95% | 200-500KB | AVIF → WebP → JPEG | Hero images, featured products |
| high | 80-90% | 100-300KB | WebP → JPEG | Product catalog, galleries |
| standard | 70-80% | 50-150KB | WebP → JPEG | General content, blogs |
| optimized | 60-70% | 20-80KB | WebP → JPEG | Mobile, thumbnails |
| thumbnail | 50-60% | 5-25KB | WebP → JPEG | Grid views, previews |

### Adaptive Preset Selection

```
Preset Selection Logic:
Image Analysis
├── Content Type Detection
│   ├── Professional Photo → Premium/High
│   ├── User Generated → Standard/Optimized
│   ├── Graphics/Text → High (Lossless when possible)
│   └── Thumbnails → Optimized/Thumbnail
├── Display Context
│   ├── Hero/Featured → Premium
│   ├── Catalog Grid → High/Standard
│   ├── Mobile View → Optimized
│   └── Preview → Thumbnail
└── Bandwidth Context
    ├── High Speed → Higher quality presets
    ├── Standard → Balanced presets
    └── Limited → Optimized presets
```

### Preset Configuration Structure

```
Preset Configuration Schema:
{
  preset_name: {
    quality_targets: {
      jpeg: 85,
      webp: 80,
      avif: 75,
      png: "lossless"
    },
    size_targets: {
      max_size: "300KB",
      target_size: "150KB"
    },
    optimization_features: {
      progressive: true,
      chroma_subsampling: true,
      strip_metadata: true
    },
    format_priority: ["avif", "webp", "jpeg"],
    fallback_strategy: "quality_reduction"
  }
}
```

### Context-Aware Adjustments

| Context Factor | Adjustment | Reasoning |
|----------------|------------|-----------|
| Mobile Device | -10% quality | Screen size, bandwidth |
| Slow Connection | -15% quality | Loading speed priority |
| High DPI Display | +5% quality | Pixel density compensation |
| Thumbnail View | Thumbnail preset | Small display size |
| Print Usage | Premium preset | High resolution requirement |

### Expected Outcome
- Simplified quality management through standardized presets
- Consistent visual quality across platform components
- Automatic optimization based on context and requirements
- Flexible system allowing customization while maintaining standards

### Verification Checklist
- [ ] Preset selection produces consistent, predictable results
- [ ] Quality targets achieved within acceptable tolerance
- [ ] File sizes meet target ranges for each preset
- [ ] Adaptive selection chooses contextually appropriate presets
- [ ] Custom preset creation and management functional

---

## Task 26: Create Watermark

### Overview
Implement sophisticated watermarking capabilities for brand protection, copyright enforcement, and professional presentation of images in LankaCommerce Cloud. The system supports various watermark types and intelligent positioning while maintaining image quality and visual appeal.

### Dependencies
- Task 25 (quality presets) operational
- Brand assets and logos available for watermarking
- Tenant branding system configured
- Image composition and blending algorithms available

### Instructions

1. **Design watermark types and formats**
   - Text watermarks with customizable fonts, sizes, and colors
   - Logo watermarks supporting PNG with transparency
   - Combined text and logo watermarks for complete branding
   - QR code watermarks for product verification and tracking

2. **Implement intelligent positioning system**
   - Nine-point positioning system (corners, edges, center)
   - Content-aware positioning avoiding important image areas
   - Multiple watermark support with non-overlapping placement
   - Responsive scaling based on image dimensions

3. **Create watermark styling and effects**
   - Opacity control for subtle integration with source images
   - Drop shadow and outline effects for better visibility
   - Blend mode options (normal, multiply, overlay, soft light)
   - Color adaptation based on underlying image content

4. **Add tenant-specific watermarking**
   - Automatic tenant branding application based on context
   - Custom watermark templates for different tenant tiers
   - Conditional watermarking based on image usage and licensing
   - Batch watermarking for large-scale brand application

### Watermark Positioning System

```
Nine-Point Positioning Grid:
┌─────────┬─────────┬─────────┐
│  NW     │   N     │    NE   │
│ (0,0)   │ (0.5,0) │  (1,0)  │
├─────────┼─────────┼─────────┤
│  W      │ CENTER  │    E    │
│ (0,0.5) │(0.5,0.5)│ (1,0.5) │
├─────────┼─────────┼─────────┤
│  SW     │   S     │    SE   │
│ (0,1)   │ (0.5,1) │  (1,1)  │
└─────────┴─────────┴─────────┘

Smart Positioning:
├── Content Analysis → Avoid faces, text, important objects
├── Contrast Analysis → Choose high contrast areas
├── Edge Detection → Position in less detailed areas
└── Aesthetic Rules → Follow composition guidelines
```

### Watermark Configuration Matrix

| Watermark Type | Position | Opacity | Scale | Use Case |
|----------------|----------|---------|-------|----------|
| Tenant Logo | Bottom-right | 60-80% | 10-15% | Product images |
| Copyright Text | Bottom-center | 40-60% | 8-12% | Marketing materials |
| QR Code | Top-left | 80-90% | 8-10% | Product verification |
| Combined Brand | Bottom-left | 50-70% | 12-18% | Professional photos |

### Watermark Styling Options

```
Watermark Effects Configuration:
├── Opacity Control
│   ├── Transparent: 30-50%
│   ├── Subtle: 50-70%
│   ├── Visible: 70-85%
│   └── Prominent: 85-95%
├── Shadow Effects
│   ├── Drop Shadow: offset, blur, opacity
│   ├── Inner Shadow: inset effects
│   └── Glow: outer glow for visibility
├── Border Effects
│   ├── Stroke: outline around watermark
│   ├── Background: semi-transparent backing
│   └── Frame: decorative borders
└── Blend Modes
    ├── Normal: standard overlay
    ├── Multiply: darken interaction
    ├── Screen: lighten interaction  
    └── Overlay: balanced contrast
```

### Content-Aware Positioning

```
Smart Positioning Algorithm:
Image Analysis
    │
    ▼
Important Region Detection
├── Face Detection → Avoid face areas
├── Text Recognition → Preserve readable text
├── Object Detection → Avoid main subjects
└── Edge/Corner Analysis → Find empty spaces
    │
    ▼
Contrast Analysis
├── High Contrast Areas → Better visibility
├── Uniform Areas → Cleaner appearance
└── Avoid Busy Patterns → Reduce distraction
    │
    ▼
Position Selection & Validation
├── Check minimum distances from edges
├── Validate readability and visibility
├── Ensure no overlap with existing elements
└── Apply aesthetic composition rules
```

### Expected Outcome
- Professional watermarking system with flexible positioning options
- Tenant-specific branding automatically applied based on context
- Content-aware positioning preserving image quality and aesthetics
- Scalable system supporting batch operations for large image sets

### Verification Checklist
- [ ] Watermarks applied correctly in all positioning options
- [ ] Opacity and blend modes produce expected visual effects
- [ ] Content-aware positioning avoids important image areas
- [ ] Tenant branding automatically applied with correct logos
- [ ] Batch watermarking processes multiple images efficiently

---

## Summary

This document has established the core image processing capabilities for the LankaCommerce Cloud platform. The implementation covers Sharp.js installation and configuration, comprehensive ImageProcessor class creation, intelligent resizing with multiple algorithms, preset management for consistency, aspect ratio handling, flexible cropping with smart algorithms, adaptive compression for optimal file sizes, quality preset management, and professional watermarking capabilities.

### Key Achievements

1. **High-Performance Processing** - Sharp.js integration optimized for production workloads
2. **Intelligent Transformations** - Content-aware algorithms for cropping, resizing, and optimization
3. **Quality Management** - Comprehensive preset system balancing quality and performance
4. **Brand Integration** - Sophisticated watermarking with tenant-specific customization
5. **Production Ready** - Robust error handling, validation, and monitoring integration

### Next Steps

The next document will cover the processing pipeline, caching systems, and batch processing capabilities that tie together all these transformation methods into a cohesive, high-performance image optimization system.