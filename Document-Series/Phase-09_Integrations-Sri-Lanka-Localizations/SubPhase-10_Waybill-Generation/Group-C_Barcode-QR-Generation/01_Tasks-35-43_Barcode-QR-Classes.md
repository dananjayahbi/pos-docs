# Tasks 35-43: Barcode & QR Generation Classes

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** C - Barcode & QR Generation  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-44-50_Placement-Validate.md](02_Tasks-44-50_Placement-Validate.md)

---

## Document Overview

This document covers the installation of barcode and QR code generation libraries and the creation of core generation classes. It establishes the foundational components for generating barcodes (Code128, Code39, EAN13) and QR codes with proper encoding and format conversion capabilities for Sri Lankan courier waybill labels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Install Barcode Libraries | Low | 10 min |
| 36 | Create BarcodeGenerator Class | Medium | 45 min |
| 37 | Create Code128 Generator | Low | 20 min |
| 38 | Create Code39 Generator | Low | 20 min |
| 39 | Create EAN13 Generator | Low | 25 min |
| 40 | Create Barcode to Image | Low | 25 min |
| 41 | Create Barcode to SVG | Low | 20 min |
| 42 | Create QRCodeGenerator Class | Medium | 40 min |
| 43 | Create QR Data Encoder | Low | 30 min |

---

## Task 35: Install Barcode Libraries

### Overview
Install the required Python libraries for barcode and QR code generation: python-barcode for various barcode formats, qrcode for QR code generation, and Pillow for image processing. These libraries form the foundation for all barcode and QR code generation functionality in the shipping system.

### Dependencies
- Task 34 (PDF Generation Engine must be complete)
- Python virtual environment activated
- Backend Django project structure established

### Instructions

1. **Navigate to backend directory**
   - Open terminal in backend project root
   - Ensure virtual environment is activated
   - Confirm Python version is 3.12+

2. **Install python-barcode library**
   - Add python-barcode to requirements.txt
   - Install via pip with specific version pinning
   - Verify installation by importing barcode module

3. **Install qrcode library**
   - Add qrcode[pil] to requirements.txt (includes Pillow)
   - Install with PIL support for image generation
   - Verify installation by importing qrcode module

4. **Install Pillow for image processing**
   - Add Pillow to requirements.txt if not included with qrcode[pil]
   - Ensure version compatibility with other image libraries
   - Test image creation capabilities

5. **Update requirements.txt**
   - Pin library versions for production stability
   - Add dependencies in alphabetical order
   - Include version constraints for security

6. **Create generators directory structure**
   - Create `backend/apps/shipping/generators/` directory
   - Create `backend/apps/shipping/generators/barcode/` subdirectory
   - Add `__init__.py` files for proper Python packaging

### Required Libraries

| Library | Version | Purpose | Installation |
|---------|---------|---------|-------------|
| python-barcode | >=0.15.1 | Barcode generation | `pip install python-barcode>=0.15.1` |
| qrcode[pil] | >=7.4.2 | QR code with image support | `pip install qrcode[pil]>=7.4.2` |
| Pillow | >=10.0.0 | Image processing | Included with qrcode[pil] |

### Library Features Overview

```
python-barcode
├── Code128 ✓ (Most common for shipping)
├── Code39 ✓ (Alternative format)
├── EAN13 ✓ (Product identification)
├── SVG Output ✓
└── PNG Output ✓

qrcode
├── Data Encoding ✓
├── Error Correction ✓ (L, M, Q, H levels)
├── SVG Output ✓
└── PNG Output ✓
```

### Directory Structure After Installation

```
backend/
└── apps/
    └── shipping/
        └── generators/
            ├── __init__.py
            └── barcode/
                └── __init__.py
```

### Verification Commands

| Library | Test Import | Expected Output |
|---------|-------------|-----------------|
| python-barcode | `import barcode` | No error |
| qrcode | `import qrcode` | No error |
| PIL | `from PIL import Image` | No error |

### Expected Outcome
- All required libraries installed and verified
- Directory structure created for generator modules
- Requirements.txt updated with pinned versions
- Foundation ready for barcode and QR code classes

### Verification Checklist
- [ ] python-barcode installed and importable
- [ ] qrcode[pil] installed and importable
- [ ] Pillow available through PIL import
- [ ] generators/barcode/ directory structure created
- [ ] requirements.txt updated with version pins
- [ ] All imports work without errors

---

## Task 36: Create BarcodeGenerator Class

### Overview
Create the main BarcodeGenerator class that serves as a unified interface for generating different types of barcodes. This class encapsulates barcode creation logic, handles different barcode formats (Code128, Code39, EAN13), and provides methods for format conversion and validation specific to Sri Lankan shipping requirements.

### Dependencies
- Task 35: Install Barcode Libraries

### Instructions

1. **Create BarcodeGenerator class file**
   - Create `barcode_gen.py` in `generators/barcode/` directory
   - Import required dependencies from python-barcode library
   - Import PIL Image for image processing

2. **Define BarcodeGenerator class structure**
   - Create class with appropriate constructor
   - Define supported barcode types as class constants
   - Initialize default settings for Sri Lankan shipping context

3. **Implement barcode type enumeration**
   - Define supported barcode formats (CODE128, CODE39, EAN13)
   - Create mapping between string names and barcode classes
   - Add validation for supported formats

4. **Create barcode validation methods**
   - Implement data validation for each barcode type
   - Add length and character validation
   - Handle Sri Lankan tracking number formats

5. **Implement base generation method**
   - Create method to generate barcode objects
   - Handle barcode creation with error handling
   - Set default options for shipping labels

6. **Add barcode configuration options**
   - Define default width, height, and spacing
   - Set text rendering options (show/hide text below barcode)
   - Configure quiet zones for proper scanning

7. **Implement error handling**
   - Create custom exceptions for barcode generation errors
   - Handle invalid data gracefully
   - Log errors for debugging purposes

### Class Structure

```
BarcodeGenerator
├── __init__(self, options=None)
├── SUPPORTED_FORMATS (class constant)
├── DEFAULT_OPTIONS (class constant)
├── generate_barcode(data, barcode_type)
├── validate_data(data, barcode_type)
├── _get_barcode_class(barcode_type)
└── _apply_default_options(barcode)
```

### Supported Barcode Types

| Type | Use Case | Data Format | Max Length |
|------|----------|-------------|------------|
| CODE128 | Shipping tracking | Alphanumeric | Variable |
| CODE39 | Legacy systems | Alphanumeric uppercase | Variable |
| EAN13 | Product identification | 13 digits | Fixed (13) |

### Default Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| module_width | 0.2mm | Bar width |
| module_height | 15.0mm | Bar height |
| quiet_zone | 6.0mm | Side margins |
| font_size | 10 | Text size |
| text_distance | 5.0mm | Text spacing |
| background | white | Background color |

### Barcode Format Mapping

```
Format Map
├── 'code128' → Code128
├── 'code39' → Code39
├── 'ean13' → EAN13
├── 'CODE128' → Code128
├── 'CODE39' → Code39
└── 'EAN13' → EAN13
```

### Error Handling Strategy

| Error Type | Exception | Action |
|------------|-----------|--------|
| Invalid Format | UnsupportedBarcodeFormat | Raise with supported formats list |
| Invalid Data | InvalidBarcodeData | Raise with validation details |
| Generation Error | BarcodeGenerationError | Log and raise with context |

### Sri Lankan Context Considerations

| Aspect | Implementation |
|--------|----------------|
| Tracking Numbers | Support LCC format: LCC{YYYYMMDD}{NNNN} |
| Courier Codes | Support local courier prefixes |
| Character Set | Handle Sinhala transliterations in data |
| Size Standards | Match Sri Lankan postal service requirements |

### Expected Outcome
- Comprehensive BarcodeGenerator class ready for barcode creation
- Support for three major barcode formats
- Proper validation and error handling
- Configuration suitable for Sri Lankan shipping labels

### Verification Checklist
- [ ] `generators/barcode/barcode_gen.py` file created
- [ ] BarcodeGenerator class defined with proper structure
- [ ] Supported barcode types enumerated
- [ ] Data validation methods implemented
- [ ] Error handling with custom exceptions
- [ ] Default options configured for shipping use
- [ ] Class imports required libraries correctly

---

## Task 37: Create Code128 Generator

### Overview
Implement the Code128 barcode generation functionality within the BarcodeGenerator class. Code128 is the most commonly used barcode format for shipping labels due to its ability to encode alphanumeric data efficiently and its high data density, making it ideal for Sri Lankan courier tracking numbers.

### Dependencies
- Task 36: Create BarcodeGenerator Class

### Instructions

1. **Import Code128 from python-barcode**
   - Add Code128 import to barcode_gen.py
   - Import required utilities for Code128 generation
   - Ensure proper error handling for import failures

2. **Implement generate_code128 method**
   - Create dedicated method for Code128 generation
   - Accept data string and options parameters
   - Return Code128 barcode object with proper configuration

3. **Add Code128 data validation**
   - Implement validate_code128_data method
   - Check for valid characters (ASCII 0-127)
   - Validate data length constraints
   - Handle Sri Lankan tracking number formats

4. **Configure Code128 options**
   - Set optimal module width for shipping labels
   - Configure height for courier scanner compatibility
   - Set text rendering preferences
   - Apply quiet zone requirements

5. **Handle Code128 specific features**
   - Support automatic character set selection (A, B, C)
   - Implement checksum verification
   - Handle start/stop characters automatically
   - Optimize for high-density encoding

6. **Add tracking number pattern support**
   - Support LCC tracking format: LCC{YYYYMMDD}{NNNN}
   - Support third-party courier formats
   - Handle reference number encoding
   - Validate tracking number checksums

7. **Implement error handling**
   - Handle invalid character errors
   - Manage data length violations
   - Provide clear error messages for debugging

### Code128 Character Sets

| Set | Characters | Use Case |
|-----|------------|----------|
| A | ASCII 0-95 + Control | Uppercase, numbers, special |
| B | ASCII 32-127 | Mixed case, numbers, special |
| C | 00-99 (pairs) | Numeric data (most efficient) |

### Code128 Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| module_width | 0.33mm | Standard for shipping |
| module_height | 15mm | Scanner compatibility |
| quiet_zone | 10 * module_width | Scanning margin |
| add_checksum | True | Data integrity |
| text | True | Human readable |

### Sri Lankan Tracking Formats

```
LCC Format: LCC20260131{NNNN}
├── LCC: Company prefix
├── 20260131: Date (YYYYMMDD)
└── {NNNN}: Sequential number

Third-party Format: {COURIER}{NNNNNNNNNN}
├── COURIER: 2-3 char courier code
└── NNNNNNNNNN: 10-digit tracking
```

### Data Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Length | 1-48 characters | "Code128 data too long" |
| Characters | ASCII 0-127 | "Invalid character in position X" |
| Empty | Not empty string | "Code128 data cannot be empty" |

### Code128 Generation Flow

```
Input Data
    ↓
Validate Characters
    ↓
Select Character Set (A/B/C)
    ↓
Apply Start Character
    ↓
Encode Data
    ↓
Calculate Checksum
    ↓
Add Stop Character
    ↓
Apply Quiet Zones
    ↓
Return Barcode Object
```

### Expected Outcome
- Functional Code128 generation method
- Proper data validation for Code128 format
- Support for Sri Lankan tracking number patterns
- Optimized configuration for shipping labels

### Verification Checklist
- [ ] Code128 import added to barcode_gen.py
- [ ] generate_code128 method implemented
- [ ] Data validation for Code128 characters
- [ ] Support for LCC tracking number format
- [ ] Proper module width and height configuration
- [ ] Error handling for invalid data
- [ ] Quiet zone and text options configured

---

## Task 38: Create Code39 Generator

### Overview
Implement Code39 barcode generation functionality for legacy compatibility and alternative scanning requirements. Code39 is widely supported by older scanner systems and provides a reliable backup format for situations where Code128 might not be compatible with certain courier equipment in Sri Lanka.

### Dependencies
- Task 36: Create BarcodeGenerator Class

### Instructions

1. **Import Code39 from python-barcode**
   - Add Code39 import to barcode_gen.py
   - Import required utilities for Code39 generation
   - Handle import errors gracefully

2. **Implement generate_code39 method**
   - Create dedicated method for Code39 generation
   - Accept data string and options parameters
   - Return Code39 barcode object with proper settings

3. **Add Code39 data validation**
   - Implement validate_code39_data method
   - Check for valid Code39 character set (A-Z, 0-9, -, ., $, /, +, %, SPACE)
   - Convert lowercase to uppercase automatically
   - Validate data length constraints

4. **Configure Code39 options**
   - Set module width appropriate for Code39
   - Configure height for scanner compatibility
   - Enable/disable checksum calculation
   - Set text display options

5. **Handle Code39 specific features**
   - Implement automatic start/stop character addition (*)
   - Support checksum character calculation (optional)
   - Handle wide/narrow bar ratios
   - Apply proper intercharacter spacing

6. **Add data preprocessing**
   - Convert lowercase letters to uppercase
   - Replace unsupported characters with alternatives
   - Handle spaces in tracking data
   - Validate final processed data

7. **Implement backward compatibility**
   - Support legacy tracking number formats
   - Handle courier systems that prefer Code39
   - Provide fallback when Code128 fails

### Code39 Character Set

| Characters | Description |
|------------|-------------|
| A-Z | Uppercase letters |
| 0-9 | Numeric digits |
| - | Hyphen/dash |
| . | Period/dot |
| SPACE | Space character |
| $ | Dollar sign |
| / | Forward slash |
| + | Plus sign |
| % | Percent sign |

### Code39 Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| module_width | 0.4mm | Wider than Code128 |
| module_height | 15mm | Same as Code128 |
| wide_ratio | 3.0 | Wide:narrow bar ratio |
| quiet_zone | 10 * module_width | Scanning margin |
| add_checksum | False | Optional feature |
| text | True | Human readable |

### Data Preprocessing Rules

| Input | Output | Action |
|-------|--------|--------|
| lowercase | UPPERCASE | Auto-convert |
| @ | A | Character substitution |
| # | H | Character substitution |
| & | AND | Text replacement |

### Code39 vs Code128 Comparison

| Aspect | Code39 | Code128 |
|--------|--------|---------|
| Character Set | 43 characters | Full ASCII |
| Density | Lower | Higher |
| Scanner Support | Universal | Modern scanners |
| Checksum | Optional | Mandatory |
| Use Case | Legacy/backup | Primary |

### Legacy System Support

```
Old Courier Systems
├── Scanner Model < 2010
├── Limited Code128 support
├── Prefer Code39 format
└── Manual fallback needed

Modern Systems
├── Scanner Model >= 2010
├── Full Code128 support
├── Code39 compatibility
└── Automatic format detection
```

### Data Validation Flow

```
Input Data
    ↓
Convert to Uppercase
    ↓
Replace Invalid Characters
    ↓
Validate Length (1-43 chars)
    ↓
Check Character Set
    ↓
Add Start/Stop Characters (*)
    ↓
Calculate Checksum (if enabled)
    ↓
Return Validated Data
```

### Expected Outcome
- Functional Code39 generation with legacy compatibility
- Proper data validation and preprocessing
- Support for older scanner systems
- Reliable backup format for Code128

### Verification Checklist
- [ ] Code39 import added to barcode_gen.py
- [ ] generate_code39 method implemented
- [ ] Data validation with character set checking
- [ ] Automatic uppercase conversion
- [ ] Character substitution for invalid chars
- [ ] Proper start/stop character handling
- [ ] Legacy system compatibility verified

---

## Task 39: Create EAN13 Generator

### Overview
Implement EAN13 barcode generation for product identification and international shipping compatibility. EAN13 barcodes are essential for packages containing retail products and provide standardized identification that's recognized by international courier systems and customs authorities.

### Dependencies
- Task 36: Create BarcodeGenerator Class

### Instructions

1. **Import EAN13 from python-barcode**
   - Add EAN13 import to barcode_gen.py
   - Import checksum calculation utilities
   - Handle import errors and fallbacks

2. **Implement generate_ean13 method**
   - Create dedicated method for EAN13 generation
   - Accept 12 or 13-digit data string
   - Calculate checksum if not provided
   - Return EAN13 barcode object

3. **Add EAN13 data validation**
   - Implement validate_ean13_data method
   - Check for numeric-only data
   - Validate 12 or 13-digit length
   - Verify checksum if provided

4. **Implement checksum calculation**
   - Create calculate_ean13_checksum method
   - Use standard EAN13 checksum algorithm
   - Handle both 12-digit (add checksum) and 13-digit (verify) inputs
   - Provide clear error messages for invalid checksums

5. **Configure EAN13 options**
   - Set standard EAN13 dimensions
   - Configure guard bars and center bars
   - Set text positioning below barcode
   - Apply international standards compliance

6. **Handle country code assignment**
   - Support Sri Lankan country code (728)
   - Handle international product codes
   - Provide mapping for common country codes
   - Validate country code format

7. **Add product identification support**
   - Support manufacturer code assignment
   - Handle product code generation
   - Implement sequential numbering for products
   - Validate against GS1 standards

### EAN13 Structure

```
EAN13: 1234567890123
├── 123: Country/Organization Code
├── 456789: Manufacturer Code
├── 01234: Product Code
└── 3: Checksum Digit
```

### Sri Lankan Context

| Code | Description | Usage |
|------|-------------|-------|
| 728 | Sri Lanka | Local products |
| 000-019 | US/Canada | Imported goods |
| 020-029 | In-store use | Internal tracking |
| 200-299 | Various | International |

### EAN13 Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| module_width | 0.33mm | International standard |
| module_height | 22.85mm | Standard height |
| quiet_zone_left | 11 modules | Left margin |
| quiet_zone_right | 7 modules | Right margin |
| text_offset | 1.0mm | Below barcode |
| guard_bars | True | Standard format |

### Checksum Algorithm

```
Steps for EAN13 Checksum:
1. Sum digits in odd positions (1,3,5,7,9,11)
2. Sum digits in even positions (2,4,6,8,10,12)
3. Multiply even sum by 3
4. Add both sums
5. Checksum = (10 - (sum % 10)) % 10
```

### Product Code Categories

| Range | Category | Example Use |
|-------|----------|-------------|
| 728000000-728099999 | LCC Internal | Package tracking |
| 728100000-728199999 | Local Manufacturers | Sri Lankan products |
| 728200000-728299999 | Retail Partners | E-commerce items |
| 728900000-728999999 | Special Use | Custom applications |

### Data Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Length | Exactly 12 or 13 digits | "EAN13 requires 12 or 13 digits" |
| Numeric | All characters are digits | "EAN13 contains non-numeric characters" |
| Checksum | Valid checksum digit | "Invalid EAN13 checksum" |
| Leading | No leading zeros beyond format | "Invalid EAN13 format" |

### EAN13 Generation Flow

```
Input Data (12 or 13 digits)
    ↓
Validate Numeric Format
    ↓
Check Length (12 or 13)
    ↓
Calculate/Verify Checksum
    ↓
Apply Country Code Logic
    ↓
Generate Barcode Pattern
    ↓
Add Guard Bars
    ↓
Return EAN13 Object
```

### Expected Outcome
- Functional EAN13 generation with checksum calculation
- Support for Sri Lankan country codes (728)
- International standards compliance
- Product identification capabilities

### Verification Checklist
- [ ] EAN13 import added to barcode_gen.py
- [ ] generate_ean13 method implemented
- [ ] Checksum calculation algorithm correct
- [ ] 12 and 13-digit input support
- [ ] Sri Lankan country code (728) support
- [ ] Data validation for numeric format
- [ ] Standard EAN13 dimensions configured

---

## Task 40: Create Barcode to Image

### Overview
Implement image conversion functionality for all barcode types, enabling the generation of PNG images suitable for inclusion in PDF waybills, email attachments, and web display. This functionality converts barcode objects to high-quality images with proper resolution for printing and scanning.

### Dependencies
- Task 39: Create EAN13 Generator

### Instructions

1. **Import image handling dependencies**
   - Import BytesIO from io module for memory handling
   - Import PIL Image for image processing
   - Import base64 for encoding if needed

2. **Implement barcode_to_image method**
   - Create unified method for all barcode types
   - Accept barcode object and image options
   - Return PNG image as bytes or PIL Image object
   - Support different output formats

3. **Configure image generation options**
   - Set default DPI (300) for print quality
   - Configure image format (PNG recommended)
   - Set background color (white) and foreground (black)
   - Handle transparency settings

4. **Add image sizing options**
   - Support custom width and height
   - Maintain aspect ratio preservation
   - Handle scaling for different use cases
   - Provide size presets (small, medium, large, print)

5. **Implement image quality settings**
   - Configure DPI settings for different uses
   - Screen display: 96 DPI
   - Print quality: 300 DPI
   - High resolution: 600 DPI
   - Set compression levels

6. **Add output format options**
   - Primary: PNG (lossless, transparency support)
   - Alternative: JPEG (smaller files, no transparency)
   - Raw bytes for direct use
   - Base64 encoded for web embedding

7. **Handle memory management**
   - Use BytesIO for memory-efficient processing
   - Clean up temporary objects
   - Optimize for large batch operations
   - Handle memory limits gracefully

### Image Configuration Presets

| Preset | Width | Height | DPI | Use Case |
|--------|-------|--------|-----|----------|
| thumbnail | 200px | 50px | 96 | Web preview |
| standard | 400px | 100px | 150 | Email attachment |
| print | 600px | 150px | 300 | PDF inclusion |
| high_res | 1200px | 300px | 600 | Professional printing |

### Output Format Options

| Format | Extension | Transparency | Compression | Best Use |
|--------|-----------|-------------|-------------|----------|
| PNG | .png | Yes | Lossless | Default choice |
| JPEG | .jpg | No | Lossy | Smaller files |
| BMP | .bmp | No | None | Windows compatibility |
| TIFF | .tiff | Yes | Lossless | Professional print |

### DPI Standards

```
DPI Guidelines
├── 72-96 DPI: Screen display
├── 150 DPI: Basic printing
├── 300 DPI: Professional printing
└── 600 DPI: High-end commercial
```

### Image Generation Process

```
Barcode Object
    ↓
Configure Writer Options
    ↓
Set DPI and Dimensions
    ↓
Render to BytesIO
    ↓
Process with PIL
    ↓
Apply Size/Quality Settings
    ↓
Convert to Target Format
    ↓
Return Image Bytes
```

### Memory Management Strategy

| Operation | Memory Approach |
|-----------|----------------|
| Small Barcodes | Direct memory processing |
| Batch Generation | Chunked processing |
| Large Images | Streaming/temporary files |
| Web Display | Compressed formats |

### Error Handling

| Error Type | Cause | Recovery |
|------------|-------|---------|
| Memory Error | Image too large | Reduce dimensions |
| Format Error | Unsupported format | Fallback to PNG |
| Encoding Error | Invalid data | Return error image |
| IO Error | Disk space/permissions | Use memory buffer |

### Image Metadata

| Metadata | Value | Purpose |
|----------|-------|---------|
| Creator | LankaCommerce Cloud | Attribution |
| Subject | Shipping Barcode | Description |
| Keywords | barcode,shipping,lcc | Search/organization |
| Resolution | Variable | DPI information |

### Expected Outcome
- High-quality PNG image generation from barcodes
- Multiple size and quality presets
- Memory-efficient processing
- Support for different output formats

### Verification Checklist
- [ ] barcode_to_image method implemented
- [ ] PNG output format support
- [ ] Multiple DPI settings (96, 150, 300, 600)
- [ ] Size presets (thumbnail, standard, print, high_res)
- [ ] Memory-efficient BytesIO usage
- [ ] Error handling for memory and format issues
- [ ] Image metadata inclusion

---

## Task 41: Create Barcode to SVG

### Overview
Implement SVG conversion functionality for all barcode types, providing scalable vector graphics that can be resized without quality loss. SVG format is ideal for web applications, responsive designs, and professional printing where crisp edges are essential regardless of scaling.

### Dependencies
- Task 40: Create Barcode to Image

### Instructions

1. **Import SVG handling dependencies**
   - Import SVGWriter from python-barcode
   - Import xml.etree.ElementTree for SVG manipulation
   - Import re for pattern matching and cleanup

2. **Implement barcode_to_svg method**
   - Create unified method for all barcode types
   - Accept barcode object and SVG options
   - Return SVG as string or write to file
   - Support different SVG configurations

3. **Configure SVG generation options**
   - Set viewBox for proper scaling
   - Configure stroke and fill properties
   - Set text rendering options
   - Handle font specifications

4. **Add SVG customization options**
   - Support custom colors (foreground/background)
   - Configure text font family and size
   - Set stroke width and style
   - Handle transparency and opacity

5. **Implement SVG optimization**
   - Remove unnecessary whitespace
   - Minimize redundant attributes
   - Optimize path elements
   - Compress inline styles

6. **Add responsive SVG features**
   - Set proper viewBox dimensions
   - Configure preserveAspectRatio
   - Support CSS styling hooks
   - Enable responsive scaling

7. **Handle SVG metadata and accessibility**
   - Add title and description elements
   - Include barcode data as text alternative
   - Set appropriate role attributes
   - Provide ARIA labels for screen readers

### SVG Configuration Options

| Option | Default Value | Purpose |
|--------|---------------|---------|
| module_width | 0.2mm | Bar width |
| module_height | 15mm | Bar height |
| font_family | 'Arial, sans-serif' | Text font |
| font_size | 10 | Text size |
| text_color | 'black' | Text color |
| bar_color | 'black' | Barcode color |
| background | 'transparent' | Background color |

### SVG Structure

```xml
<svg viewBox="0 0 width height" xmlns="...">
  <title>Barcode: {data}</title>
  <desc>Generated by LankaCommerce Cloud</desc>
  <rect> <!-- Background (if not transparent) -->
  <g> <!-- Barcode bars -->
    <rect x="..." y="..." width="..." height="..."/>
    <!-- More bars -->
  </g>
  <text> <!-- Human readable text -->
</svg>
```

### Color Customization

| Color Property | CSS Variable | Default | Usage |
|----------------|--------------|---------|-------|
| Bar Color | --barcode-color | #000000 | Bars and text |
| Background | --barcode-bg | transparent | Background fill |
| Text Color | --barcode-text | #000000 | Human readable |
| Quiet Zone | --barcode-margin | transparent | Side margins |

### SVG Optimization Techniques

| Technique | Benefit | Implementation |
|-----------|---------|----------------|
| Path Merging | Smaller file size | Combine adjacent bars |
| Attribute Deduplication | Cleaner code | Use CSS classes |
| Decimal Precision | Reduced size | Round coordinates |
| White Space Removal | Minimal size | Strip formatting |

### Responsive Design Support

```css
/* CSS for responsive barcodes */
.barcode-svg {
  width: 100%;
  max-width: 400px;
  height: auto;
}

/* Print media styles */
@media print {
  .barcode-svg {
    width: 4in;
    height: 1in;
  }
}
```

### SVG Generation Process

```
Barcode Object
    ↓
Configure SVG Writer
    ↓
Set Dimensions and Colors
    ↓
Generate SVG Elements
    ↓
Add Metadata and Accessibility
    ↓
Optimize SVG Code
    ↓
Return SVG String
```

### Accessibility Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| title Element | Barcode data description | Screen reader support |
| desc Element | Generation context | Additional information |
| role Attribute | role="img" | Semantic meaning |
| aria-label | Barcode value | Alternative text |

### Web Integration

| Use Case | Implementation | Advantage |
|----------|----------------|-----------|
| Inline SVG | Direct HTML embedding | Fast loading |
| External File | Separate .svg file | Cacheable |
| Data URL | Base64 encoded | Single request |
| CSS Background | background-image | Styling flexibility |

### Performance Considerations

| Aspect | Optimization | Impact |
|--------|-------------|--------|
| File Size | Minimize attributes | Faster loading |
| Rendering | Simple shapes | Smooth display |
| Scaling | Vector format | Crisp at any size |
| Caching | Static content | Reusability |

### Expected Outcome
- High-quality SVG generation from barcodes
- Scalable vector graphics for all use cases
- Web-optimized SVG with accessibility features
- Responsive design support

### Verification Checklist
- [ ] barcode_to_svg method implemented
- [ ] SVGWriter configuration for all barcode types
- [ ] Custom color and font options
- [ ] Proper viewBox and dimensions
- [ ] Accessibility elements (title, desc)
- [ ] SVG optimization for file size
- [ ] Responsive design compatibility

---

## Task 42: Create QRCodeGenerator Class

### Overview
Create the QRCodeGenerator class for generating QR codes containing tracking URLs and shipment information. QR codes provide quick access to tracking information via mobile devices and support multiple data encoding formats with built-in error correction, essential for Sri Lankan courier services.

### Dependencies
- Task 35: Install Barcode Libraries

### Instructions

1. **Create QRCodeGenerator class file**
   - Create `qr_gen.py` in `generators/barcode/` directory
   - Import qrcode library and PIL dependencies
   - Import BytesIO for image handling

2. **Define QRCodeGenerator class structure**
   - Create class with initialization method
   - Define default QR code configuration
   - Set error correction levels and sizing options
   - Initialize tracking URL template

3. **Implement QR code configuration**
   - Set default version (size) for tracking URLs
   - Configure error correction level (M - 15% recovery)
   - Set box size and border dimensions
   - Define fill and background colors

4. **Create tracking URL generation**
   - Implement generate_tracking_url method
   - Support LCC tracking URL format: https://track.lcc.lk/{waybill}
   - Handle different courier tracking URLs
   - Add validation parameters to URLs

5. **Implement QR code generation method**
   - Create generate_qr method
   - Accept data string and configuration options
   - Return QR code object with proper settings
   - Handle different data types (URL, text, JSON)

6. **Add QR code validation**
   - Implement data validation for QR content
   - Check URL format and accessibility
   - Validate data length for chosen version
   - Handle special characters and encoding

7. **Create configuration presets**
   - Define size presets (small, medium, large)
   - Set error correction presets based on use case
   - Create color schemes for different applications
   - Configure border and quiet zone options

### QR Code Configuration

| Parameter | Default | Options | Purpose |
|-----------|---------|---------|---------|
| version | 1 | 1-40 | Size (21x21 to 177x177) |
| error_correct | ERROR_CORRECT_M | L,M,Q,H | Recovery level |
| box_size | 10 | 1-50 | Pixel size per module |
| border | 4 | 0-20 | Quiet zone size |

### Error Correction Levels

| Level | Recovery | Use Case | Damage Tolerance |
|-------|----------|----------|------------------|
| L | ~7% | Perfect conditions | Low |
| M | ~15% | Standard use | Medium |
| Q | ~25% | Harsh environment | High |
| H | ~30% | Maximum protection | Very High |

### QR Code Size Presets

| Preset | Version | Modules | Data Capacity | Use Case |
|--------|---------|---------|---------------|----------|
| small | 1 | 21x21 | 25 chars | Simple tracking |
| medium | 3 | 29x29 | 53 chars | Standard tracking |
| large | 6 | 41x41 | 106 chars | Rich tracking data |
| extra | 10 | 57x57 | 174 chars | Full shipment info |

### Tracking URL Templates

```
LCC Tracking:
https://track.lcc.lk/{waybill_number}

LCC with Details:
https://track.lcc.lk/{waybill_number}?ref={reference}&phone={phone}

Third-party Courier:
{courier_base_url}/track?id={tracking_number}

Multi-courier Support:
https://track.lcc.lk/universal/{courier_code}/{tracking_number}
```

### Data Encoding Support

| Data Type | Format | Example | Max Length |
|-----------|--------|---------|------------|
| URL | UTF-8 | https://... | 2953 chars |
| Text | UTF-8 | Plain text | 2953 chars |
| JSON | UTF-8 | {"waybill":"..."} | 2953 chars |
| Phone | Tel URI | tel:+94771234567 | Variable |

### QR Code Generation Process

```
Input Data
    ↓
Validate Data Format
    ↓
Select Optimal Version
    ↓
Set Error Correction Level
    ↓
Generate QR Matrix
    ↓
Apply Visual Configuration
    ↓
Create QR Code Object
    ↓
Return QR Instance
```

### Sri Lankan Context Integration

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| Sinhala Text | UTF-8 encoding | Local language support |
| Phone Numbers | +94 format validation | Standard format |
| Addresses | Postal code integration | Location accuracy |
| Currency | LKR symbol support | Local pricing |

### Quality Assurance

| Check | Validation | Action |
|-------|------------|--------|
| URL Validity | HTTP status check | Generate backup QR |
| Data Length | Version capacity | Auto-upgrade version |
| Error Level | Scanning conditions | Adjust correction level |
| Readability | Test scan | Optimize size/contrast |

### Expected Outcome
- Comprehensive QRCodeGenerator class for tracking URLs
- Support for different error correction levels
- Configurable size and color options
- Sri Lankan courier service integration

### Verification Checklist
- [ ] `generators/barcode/qr_gen.py` file created
- [ ] QRCodeGenerator class with proper initialization
- [ ] Error correction level configuration
- [ ] Tracking URL template support
- [ ] Size presets (small, medium, large)
- [ ] Data validation methods
- [ ] Support for LCC tracking URL format

---

## Task 43: Create QR Data Encoder

### Overview
Implement data encoding functionality for QR codes, focusing on tracking URLs with additional shipment information. This encoder creates structured data that maximizes QR code utility while maintaining readability and providing fallback options for different scanning scenarios.

### Dependencies
- Task 42: Create QRCodeGenerator Class

### Instructions

1. **Implement encode_tracking_data method**
   - Create method within QRCodeGenerator class
   - Accept waybill number and optional parameters
   - Generate structured tracking URL with query parameters
   - Return properly formatted URL string

2. **Add shipment data encoding**
   - Implement encode_shipment_info method
   - Include recipient name, phone, and address (if needed)
   - Add package dimensions and weight
   - Include service type and delivery options

3. **Create JSON data encoding**
   - Implement encode_json_data method for rich data
   - Structure data for mobile app consumption
   - Include all relevant tracking information
   - Compress data to fit QR capacity limits

4. **Add multi-language support**
   - Support Sinhala text encoding (UTF-8)
   - Handle Tamil text for tracking information
   - Provide English fallbacks
   - Validate character encoding

5. **Implement data compression**
   - Use URL shortening for long tracking URLs
   - Abbreviate common terms and codes
   - Remove unnecessary whitespace and formatting
   - Optimize JSON structure for space

6. **Add validation and error handling**
   - Validate phone number formats (+94 XX XXX XXXX)
   - Check URL accessibility and validity
   - Verify data fits within QR code capacity
   - Handle encoding errors gracefully

7. **Create data structure templates**
   - Define standard tracking URL format
   - Create JSON schema for rich data
   - Implement vCard format for contact info
   - Support custom data structures

### Tracking URL Structure

```
Base URL: https://track.lcc.lk/{waybill}

With Parameters:
https://track.lcc.lk/{waybill}
?ref={reference}
&phone={recipient_phone}
&lang={language}
&notify={notification_type}
```

### JSON Data Schema

```json
{
  "waybill": "LCC20260131001",
  "reference": "REF001",
  "recipient": {
    "name": "John Doe",
    "phone": "+94771234567",
    "address": "Colombo 07"
  },
  "service": "express",
  "tracking": "https://track.lcc.lk/LCC20260131001"
}
```

### Data Compression Strategies

| Original | Compressed | Savings |
|----------|------------|---------|
| "reference" | "ref" | 6 chars |
| "recipient" | "rcpt" | 4 chars |
| "address" | "addr" | 3 chars |
| "tracking_number" | "trk" | 11 chars |
| "https://track.lcc.lk/" | "lcc:" | 19 chars |

### Phone Number Validation

| Format | Pattern | Example | Valid |
|--------|---------|---------|-------|
| International | +94XXXXXXXXX | +94771234567 | ✓ |
| Local | 0XXXXXXXXX | 0771234567 | ✓ |
| Short | 771234567 | 771234567 | Convert to +94 |
| Invalid | Various | 123456 | ✗ |

### Multi-language Support

| Language | Field | Encoding | Example |
|----------|-------|----------|---------|
| Sinhala | Name | UTF-8 | කාසිම් |
| Tamil | Address | UTF-8 | சென்னை |
| English | Default | ASCII | Colombo |
| Mixed | All | UTF-8 | Auto-detect |

### Data Capacity Limits

| QR Version | Alphanumeric | Binary | UTF-8 Text |
|------------|--------------|--------|------------|
| 1 | 25 chars | 17 bytes | 10-17 chars |
| 3 | 47 chars | 32 bytes | 20-32 chars |
| 6 | 77 chars | 55 bytes | 35-55 chars |
| 10 | 114 chars | 78 bytes | 50-78 chars |

### Encoding Process Flow

```
Input Data
    ↓
Validate Required Fields
    ↓
Apply Language Detection
    ↓
Compress/Abbreviate Data
    ↓
Select Optimal QR Version
    ↓
Generate Final URL/JSON
    ↓
Validate Against Capacity
    ↓
Return Encoded Data
```

### Error Handling Strategy

| Error Type | Detection | Recovery |
|------------|-----------|----------|
| Data Too Large | Size check | Use shorter format |
| Invalid Phone | Regex validation | Remove or fix format |
| Bad Characters | Encoding test | Replace/remove |
| URL Unreachable | HTTP check | Use fallback URL |

### Tracking URL Examples

```
Simple:
https://track.lcc.lk/LCC20260131001

With Reference:
https://track.lcc.lk/LCC20260131001?ref=ORDER123

Multi-parameter:
https://track.lcc.lk/LCC20260131001
?ref=ORDER123&phone=771234567&lang=si&notify=sms
```

### Expected Outcome
- Efficient data encoding for QR codes
- Support for tracking URLs with parameters
- Multi-language text encoding capability
- Data compression to maximize QR capacity

### Verification Checklist
- [ ] encode_tracking_data method implemented
- [ ] JSON data encoding support
- [ ] Phone number validation (+94 format)
- [ ] Multi-language UTF-8 support
- [ ] Data compression techniques
- [ ] QR version optimization based on data size
- [ ] Error handling for oversized data

---

## Summary

This document established the foundation for barcode and QR code generation in the waybill system. The implementation includes comprehensive libraries installation, barcode generation classes supporting Code128, Code39, and EAN13 formats, image and SVG conversion capabilities, and a robust QR code generation system with data encoding features.

### Completed Tasks
1. ✓ Installed barcode libraries (python-barcode, qrcode, Pillow)
2. ✓ Created BarcodeGenerator class with format support
3. ✓ Implemented Code128 generator for shipping labels
4. ✓ Implemented Code39 generator for legacy compatibility
5. ✓ Implemented EAN13 generator for product identification
6. ✓ Created barcode to image conversion (PNG)
7. ✓ Created barcode to SVG conversion (scalable)
8. ✓ Created QRCodeGenerator class with tracking URLs
9. ✓ Implemented QR data encoder with compression

### Next Steps
Proceed to [02_Tasks-44-50_Placement-Validate.md](02_Tasks-44-50_Placement-Validate.md) to implement barcode and QR code placement on waybill labels, create validation mechanisms for scan readability, and establish testing procedures.