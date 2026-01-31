# Tasks 26-34: Fonts, Layout and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** B - PDF Generation Engine  
> **Document:** 02 of 02  
> **Tasks Covered:** 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-25_Libraries-Sizes.md](01_Tasks-17-25_Libraries-Sizes.md)

---

## Document Overview

This document covers the implementation of font embedding, layout components, and verification of the PDF generation engine. It focuses on Unicode font support for Sinhala and Tamil scripts, proper PDF layout with headers and footers, logo placement, and comprehensive testing to ensure reliable waybill PDF generation across all supported formats.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 26 | Create PDF Fonts | Medium | 30 min |
| 27 | Create Sinhala Font | Medium | 25 min |
| 28 | Create Tamil Font | Medium | 25 min |
| 29 | Create PDF Margins | Low | 20 min |
| 30 | Create PDF Header | Medium | 35 min |
| 31 | Create PDF Footer | Medium | 35 min |
| 32 | Create Tenant Logo | Low | 15 min |
| 33 | Create Courier Logo | Low | 15 min |
| 34 | Verify PDF Generation | Low | 30 min |

---

## Task 26: Create PDF Fonts

### Overview
Implement the font management system for PDF generation that handles Unicode fonts required for Sinhala and Tamil text rendering. This system ensures proper text display across different languages used in Sri Lankan addresses and business names, with fallback mechanisms for unsupported characters.

### Dependencies
- Task 25: Create A5 Size
- System Unicode fonts available

### Instructions

1. **Create fonts directory structure**
   - Navigate to `backend/apps/shipping/generators/pdf/` directory
   - Create subdirectory named `fonts`
   - Add `__init__.py` to make it a Python package

2. **Create font manager module**
   - Create file `font_manager.py` in pdf directory
   - Import required font handling libraries
   - Add system font discovery utilities

3. **Define FontManager class**
   - Create class for centralized font management
   - Add font registration and caching mechanisms
   - Implement font validation and fallback logic

4. **Add font discovery methods**
   - Create method to scan system fonts
   - Add method to verify font file existence
   - Implement method to check font format compatibility

5. **Implement font registration system**
   - Create method to register TTF/OTF fonts
   - Add font family and style mapping
   - Implement Unicode range validation

6. **Add font fallback mechanisms**
   - Create fallback font chain configuration
   - Add method to handle missing characters
   - Implement automatic font substitution

7. **Create font configuration file**
   - Define supported font families
   - Set Unicode range mappings
   - Configure default fonts for each script

### Font Management Architecture

```
Font System Structure
├── FontManager class
│   ├── register_font()
│   ├── get_font()
│   ├── validate_font()
│   └── create_fallback_chain()
├── Font discovery
├── Unicode validation
└── Fallback mechanisms
```

### Supported Font Formats

| Format | Extension | Support Level | Usage |
|--------|-----------|---------------|-------|
| TrueType | .ttf | Full | Primary fonts |
| OpenType | .otf | Full | Alternative fonts |
| Type 1 | .pfb/.pfa | Limited | Legacy support |

### Font Registration Process

| Step | Action | Validation |
|------|--------|------------|
| 1 | Locate font file | File exists check |
| 2 | Load font metadata | Format validation |
| 3 | Check Unicode ranges | Script coverage |
| 4 | Register in system | Conflict resolution |
| 5 | Create font object | Ready for use |

### Unicode Script Ranges

| Script | Unicode Range | Font Required |
|--------|---------------|---------------|
| Latin | U+0000-U+007F | Default |
| Sinhala | U+0D80-U+0DFF | Sinhala font |
| Tamil | U+0B80-U+0BFF | Tamil font |
| Devanagari | U+0900-U+097F | Optional |

### Font Fallback Chain

```
Fallback Priority Order
├── 1. Requested specific font
├── 2. Script-specific font
├── 3. Unicode fallback font
├── 4. System default font
└── 5. Built-in PDF font
```

### Font Cache Management

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Memory cache | Font objects stored | Fast access |
| File cache | Font validation results | Reduced I/O |
| Metadata cache | Unicode range data | Quick lookups |

### Expected Outcome
- Centralized font management system
- Unicode font registration capability
- Automatic fallback mechanisms
- Ready for Sinhala and Tamil font integration

### Verification Checklist
- [ ] `fonts/` directory created with __init__.py
- [ ] `font_manager.py` created
- [ ] FontManager class implemented
- [ ] Font discovery methods working
- [ ] Registration system functional
- [ ] Fallback mechanisms in place

---

## Task 27: Create Sinhala Font

### Overview
Integrate Sinhala Unicode font support for proper rendering of Sinhala text in addresses, names, and business information. This ensures that Sri Lankan customers' information is displayed correctly in waybill PDFs, maintaining cultural and linguistic accuracy.

### Dependencies
- Task 26: Create PDF Fonts

### Instructions

1. **Download Sinhala Unicode font**
   - Download Noto Sans Sinhala from Google Fonts
   - Verify font includes complete Sinhala Unicode range
   - Check font license compatibility with commercial use

2. **Install Sinhala font file**
   - Copy font file to `fonts/` directory
   - Name file as `NotoSansSinhala-Regular.ttf`
   - Verify file integrity and readability

3. **Register Sinhala font in system**
   - Add Sinhala font to FontManager
   - Map Unicode range U+0D80-U+0DFF to font
   - Configure font family name as 'Noto Sans Sinhala'

4. **Create Sinhala font configuration**
   - Define Sinhala-specific font settings
   - Set appropriate font sizes for different contexts
   - Configure text rendering options

5. **Add Sinhala text validation**
   - Create method to detect Sinhala characters
   - Add validation for proper font selection
   - Implement Sinhala text measurement utilities

6. **Test Sinhala font rendering**
   - Create test samples with common Sinhala words
   - Verify character rendering accuracy
   - Test font in both PDF generators

### Sinhala Font Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font Family | Noto Sans Sinhala | Google's Unicode font |
| Unicode Range | U+0D80-U+0DFF | Complete Sinhala coverage |
| File Size | ~200KB | Compact for embedding |
| License | Open Font License | Commercial use allowed |

### Sinhala Unicode Coverage

| Character Range | Description | Examples |
|----------------|-------------|----------|
| U+0D80-U+0D83 | Independent vowels | අ, ආ, ඇ, ඈ |
| U+0D85-U+0D96 | Consonants | ක, ඛ, ග, ඝ |
| U+0D9A-U+0DB1 | More consonants | ච, ජ, ට, ණ |
| U+0DB3-U+0DBB | Final consonants | ත, භ, ය, ර |
| U+0DCA-U+0DCF | Vowel signs | ් , ා, ි, ී |

### Common Sinhala Words for Testing

| Word | Meaning | Unicode |
|------|---------|---------|
| ඔබගේ | Your | U+0D94 U+0DB6 U+0D9C U+0DDA |
| නම | Name | U+0DB1 U+0DB8 |
| ලිපිනය | Address | U+0DBD U+0DD2 U+0DB4 U+0DD2 U+0DB1 U+0DBA |
| දුරකථන | Telephone | U+0DAF U+0DD4 U+0DBB U+0D9A U+0DAE U+0DB1 |

### Font Size Recommendations

| Context | Size | Rationale |
|---------|------|-----------|
| Addresses | 10-12pt | Clear readability |
| Names | 11-13pt | Proper identification |
| Details | 9-10pt | Space efficiency |
| Headers | 12-14pt | Emphasis |

### Sinhala Text Layout Considerations

| Aspect | Requirement | Implementation |
|--------|-------------|----------------|
| Direction | Left-to-right | Standard text flow |
| Line spacing | 1.2x font size | Proper character clearance |
| Word breaking | Syllable boundaries | Unicode-aware breaks |
| Hyphenation | Avoid if possible | Preserve word integrity |

### Testing Sinhala Integration

```
Test Cases
├── Single Sinhala words
├── Mixed Sinhala-English text
├── Long Sinhala addresses
├── Special characters and punctuation
└── Font fallback scenarios
```

### Expected Outcome
- Sinhala font properly integrated
- Complete Unicode range coverage
- Accurate text rendering in PDFs
- Ready for production use with Sinhala addresses

### Verification Checklist
- [ ] Noto Sans Sinhala font downloaded
- [ ] Font file placed in fonts/ directory
- [ ] Sinhala font registered in FontManager
- [ ] Unicode range mapping configured
- [ ] Test samples render correctly
- [ ] Both PDF generators support Sinhala

---

## Task 28: Create Tamil Font

### Overview
Integrate Tamil Unicode font support for proper rendering of Tamil text in addresses and business information. This ensures accurate display of Tamil content for Sri Lankan Tamil customers and businesses, supporting the linguistic diversity of Sri Lanka.

### Dependencies
- Task 26: Create PDF Fonts

### Instructions

1. **Download Tamil Unicode font**
   - Download Noto Sans Tamil from Google Fonts
   - Verify font includes complete Tamil Unicode range
   - Check font license for commercial usage rights

2. **Install Tamil font file**
   - Copy font file to `fonts/` directory
   - Name file as `NotoSansTamil-Regular.ttf`
   - Verify file integrity and character coverage

3. **Register Tamil font in system**
   - Add Tamil font to FontManager
   - Map Unicode range U+0B80-U+0BFF to font
   - Configure font family name as 'Noto Sans Tamil'

4. **Create Tamil font configuration**
   - Define Tamil-specific rendering settings
   - Set appropriate font sizes for contexts
   - Configure complex script rendering options

5. **Add Tamil text validation**
   - Create method to detect Tamil characters
   - Add validation for proper font assignment
   - Implement Tamil text measurement utilities

6. **Test Tamil font rendering**
   - Create test samples with common Tamil words
   - Verify conjunct character rendering
   - Test font in both PDF generators

### Tamil Font Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Font Family | Noto Sans Tamil | Google's Unicode font |
| Unicode Range | U+0B80-U+0BFF | Complete Tamil coverage |
| File Size | ~180KB | Efficient embedding |
| License | Open Font License | Commercial compatible |

### Tamil Unicode Coverage

| Character Range | Description | Examples |
|----------------|-------------|----------|
| U+0B80-U+0B82 | Signs and vowels | ஂ, ஃ |
| U+0B85-U+0B8A | Independent vowels | அ, ஆ, இ, ஈ |
| U+0B8E-U+0B90 | More vowels | எ, ஏ, ஐ |
| U+0B92-U+0B95 | Vowel and consonants | ஒ, ஓ, க |
| U+0B99-U+0BBC | Consonants and signs | ங, ச, ன, ் |

### Common Tamil Words for Testing

| Word | Meaning | Unicode |
|------|---------|---------|
| உங்கள் | Your | U+0B89 U+0B99 U+0BCD U+0B95 U+0BB3 U+0BCD |
| பெயர் | Name | U+0BAA U+0BC6 U+0BAF U+0BB0 U+0BCD |
| முகவரி | Address | U+0BAE U+0BC1 U+0B95 U+0BB5 U+0BB0 U+0BBF |
| தொலைபேசி | Telephone | U+0BA4 U+0BCA U+0BB2 U+0BC8 U+0BAA U+0BC7 U+0B9A U+0BBF |

### Tamil Script Complexities

| Feature | Description | Handling |
|---------|-------------|----------|
| Conjuncts | Combined consonants | Unicode composition |
| Vowel marks | Attached to consonants | Proper positioning |
| Tamil numerals | ௧, ௨, ௩, etc. | Alternative to Arabic |
| Grantha letters | Sanskrit loanwords | Extended coverage |

### Font Size Recommendations

| Context | Size | Rationale |
|---------|------|-----------|
| Addresses | 10-12pt | Clear readability |
| Names | 11-13pt | Proper identification |
| Details | 9-10pt | Space efficiency |
| Headers | 12-14pt | Emphasis |

### Tamil Text Layout Requirements

| Aspect | Requirement | Implementation |
|--------|-------------|----------------|
| Direction | Left-to-right | Standard flow |
| Line spacing | 1.3x font size | Complex character space |
| Character spacing | Default tracking | Preserve conjuncts |
| Word breaking | Syllable-aware | Unicode boundaries |

### Tamil Integration Testing

```
Test Scenarios
├── Simple Tamil words
├── Complex conjunct combinations
├── Mixed Tamil-English content
├── Tamil numerals and punctuation
├── Long Tamil addresses
└── Font substitution edge cases
```

### Expected Outcome
- Tamil font successfully integrated
- Complete Unicode range support
- Accurate conjunct rendering
- Production-ready Tamil text support

### Verification Checklist
- [ ] Noto Sans Tamil font downloaded
- [ ] Font file installed in fonts/ directory
- [ ] Tamil font registered in FontManager
- [ ] Unicode range properly mapped
- [ ] Complex character rendering works
- [ ] Both PDF generators handle Tamil

---

## Task 29: Create PDF Margins

### Overview
Implement standardized margin configuration for PDF documents that ensures consistent spacing, proper content boundaries, and professional appearance across all page sizes. The margin system accommodates printer limitations and provides optimal content layout.

### Dependencies
- Task 28: Create Tamil Font

### Instructions

1. **Create margin configuration module**
   - Create file `margins.py` in pdf directory
   - Import page size definitions
   - Add margin calculation utilities

2. **Define MarginConfig class**
   - Create class to hold margin specifications
   - Add properties for top, bottom, left, right margins
   - Include methods for margin calculations

3. **Implement margin calculation methods**
   - Create method to calculate printable area
   - Add method to convert margins between units
   - Implement method to validate margin constraints

4. **Define standard margin sets**
   - Create thermal printer margins (minimal)
   - Create A4 document margins (standard)
   - Create A5 compact margins (efficient)

5. **Add responsive margin system**
   - Implement margins that adjust to page size
   - Add minimum margin constraints
   - Include margin validation rules

6. **Integrate margins with generators**
   - Update ReportLabGenerator to use margin config
   - Update WeasyPrintGenerator margin handling
   - Ensure consistent margin application

### Margin Configuration Structure

```
MarginConfig Class
├── top: float
├── bottom: float
├── left: float
├── right: float
├── unit: str
└── Methods:
    ├── get_printable_area()
    ├── to_points()
    └── validate()
```

### Standard Margin Sets

| Page Size | Top | Bottom | Left | Right | Unit |
|-----------|-----|--------|------|-------|------|
| Thermal | 3mm | 3mm | 2mm | 2mm | mm |
| A4 | 20mm | 20mm | 20mm | 20mm | mm |
| A5 | 15mm | 15mm | 15mm | 15mm | mm |

### Printable Area Calculations

| Page Size | Page Dimensions | Margins | Printable Area |
|-----------|----------------|---------|----------------|
| Thermal | 288×432 pt | 6×8.5 pt | 282×423.5 pt |
| A4 | 595×842 pt | 57×57 pt | 538×785 pt |
| A5 | 420×595 pt | 42.5×42.5 pt | 377.5×552.5 pt |

### Margin Validation Rules

| Rule | Purpose | Implementation |
|------|---------|----------------|
| Minimum margin | Printer safety | 2mm minimum |
| Maximum margin | Content area | 50% max usage |
| Aspect preservation | Layout integrity | Proportional scaling |

### Margin Integration Points

```
PDF Generation Flow
├── 1. Load page size config
├── 2. Apply margin configuration
├── 3. Calculate printable boundaries
├── 4. Position content within margins
├── 5. Ensure no content overflow
└── 6. Validate final layout
```

### Content Positioning System

| Zone | Position | Calculation |
|------|----------|-------------|
| Header | Top margin + header height | Fixed position |
| Content | Header bottom to footer top | Dynamic area |
| Footer | Page height - bottom margin | Fixed position |

### Margin Utilities

| Method | Purpose | Returns |
|--------|---------|---------|
| get_content_width() | Available width | Points |
| get_content_height() | Available height | Points |
| get_center_x() | Horizontal center | X coordinate |
| get_center_y() | Vertical center | Y coordinate |

### Expected Outcome
- Standardized margin system across all formats
- Consistent content positioning
- Printer-safe boundaries maintained
- Professional document appearance

### Verification Checklist
- [ ] `margins.py` file created
- [ ] MarginConfig class implemented
- [ ] Standard margin sets defined
- [ ] Printable area calculations correct
- [ ] Integration with both generators
- [ ] Margin validation working

---

## Task 30: Create PDF Header

### Overview
Implement the PDF header component that displays essential waybill information at the top of each PDF document. The header includes tenant logo placement, waybill identification number, generation date, and document title with consistent formatting across all page sizes.

### Dependencies
- Task 29: Create PDF Margins

### Instructions

1. **Create header component module**
   - Create file `header.py` in pdf directory
   - Import required PDF generation libraries
   - Add image handling utilities

2. **Define PDFHeader class**
   - Create class for header generation
   - Add methods for header content rendering
   - Include logo placement functionality

3. **Implement header layout system**
   - Create three-column header layout
   - Add left column for tenant logo
   - Add center column for waybill number
   - Add right column for date and time

4. **Add logo handling capabilities**
   - Create method to load and resize logos
   - Add image format validation
   - Implement logo positioning calculations

5. **Create header text formatting**
   - Define font sizes for header elements
   - Add text alignment and spacing rules
   - Implement responsive text sizing

6. **Add header border and styling**
   - Create bottom border line separation
   - Add background color options
   - Implement consistent header height

### Header Layout Structure

```
PDF Header Layout
┌─────────────────────────────────────┐
│ [Logo]    WAYBILL #WB001234    Date │ ← Header zone
├─────────────────────────────────────┤
│                                     │
│          Document Content           │
│                                     │
```

### Header Zones Definition

| Zone | Width | Content | Alignment |
|------|-------|---------|-----------|
| Left | 33% | Tenant logo | Left |
| Center | 34% | Waybill number | Center |
| Right | 33% | Date/time | Right |

### Logo Specifications

| Property | Value | Constraint |
|----------|-------|------------|
| Max Width | 150px | Thermal: 100px |
| Max Height | 50px | Thermal: 35px |
| Format | PNG, JPG, SVG | Vector preferred |
| Resolution | 300 DPI | Print quality |

### Header Height by Page Size

| Page Size | Header Height | Logo Area | Text Area |
|-----------|---------------|-----------|-----------|
| Thermal | 25mm | 20mm | 18mm |
| A4 | 30mm | 25mm | 22mm |
| A5 | 25mm | 20mm | 18mm |

### Header Text Elements

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| "WAYBILL" | 14pt | Bold | Primary |
| Waybill Number | 12pt | Normal | Primary |
| Date | 10pt | Normal | Secondary |
| Page info | 9pt | Normal | Secondary |

### Header Content Data

```
Header Information
├── Tenant logo (if available)
├── Document title "WAYBILL"
├── Waybill number (formatted)
├── Generation date
├── Generation time
└── Page number (if multi-page)
```

### Responsive Header Behavior

| Page Size | Logo Size | Font Scaling | Content Priority |
|-----------|-----------|--------------|------------------|
| Thermal | Small | 85% | Essential only |
| A4 | Full | 100% | All elements |
| A5 | Medium | 90% | Most elements |

### Header Styling Options

| Style | Description | Usage |
|-------|-------------|-------|
| Minimal | Text only, no borders | Thermal efficiency |
| Standard | Logo + text + border | Professional docs |
| Branded | Full logo + colors | Customer-facing |

### Expected Outcome
- Professional header component
- Consistent branding across documents
- Responsive design for all page sizes
- Ready for logo integration

### Verification Checklist
- [ ] `header.py` file created
- [ ] PDFHeader class implemented
- [ ] Three-column layout working
- [ ] Logo placement functional
- [ ] Text formatting consistent
- [ ] Header height appropriate for each size

---

## Task 31: Create PDF Footer

### Overview
Implement the PDF footer component that displays courier information, tracking elements, and document metadata at the bottom of each PDF. The footer includes courier logo, barcode/QR code placement, page numbers, and legal disclaimers with professional formatting.

### Dependencies
- Task 29: Create PDF Margins

### Instructions

1. **Create footer component module**
   - Create file `footer.py` in pdf directory
   - Import PDF generation utilities
   - Add barcode handling capabilities

2. **Define PDFFooter class**
   - Create class for footer generation
   - Add methods for footer content rendering
   - Include barcode/QR code integration

3. **Implement footer layout system**
   - Create three-section footer layout
   - Add left section for courier logo
   - Add center section for tracking codes
   - Add right section for page information

4. **Add courier branding elements**
   - Create method for courier logo placement
   - Add courier contact information
   - Implement courier-specific styling

5. **Create tracking code section**
   - Add barcode generation and placement
   - Add QR code generation capability
   - Implement tracking number display

6. **Add footer text and legal elements**
   - Create disclaimer text handling
   - Add page numbering system
   - Implement footer separator line

### Footer Layout Structure

```
PDF Footer Layout
│                                     │
│          Document Content           │
│                                     │
├─────────────────────────────────────┤
│ [Courier] [Barcode/QR] Page X of Y  │ ← Footer zone
└─────────────────────────────────────┘
```

### Footer Zones Definition

| Zone | Width | Content | Alignment |
|------|-------|---------|-----------|
| Left | 30% | Courier logo/info | Left |
| Center | 40% | Barcode/QR codes | Center |
| Right | 30% | Page numbers/info | Right |

### Courier Logo Specifications

| Property | Value | Constraint |
|----------|-------|------------|
| Max Width | 100px | Thermal: 60px |
| Max Height | 40px | Thermal: 25px |
| Format | PNG, JPG, SVG | Vector preferred |
| Position | Bottom left | Standard placement |

### Footer Height by Page Size

| Page Size | Footer Height | Barcode Area | Text Area |
|-----------|---------------|--------------|-----------|
| Thermal | 20mm | 15mm | 12mm |
| A4 | 25mm | 20mm | 15mm |
| A5 | 20mm | 15mm | 12mm |

### Barcode Integration

| Code Type | Size | Position | Content |
|-----------|------|----------|---------|
| Code 128 | 25×8mm | Center | Tracking number |
| QR Code | 15×15mm | Center-right | Full waybill URL |
| Data Matrix | 10×10mm | Alternative | Compact data |

### Footer Text Elements

| Element | Font Size | Content | Position |
|---------|-----------|---------|----------|
| Courier info | 8pt | Company name | Left |
| Contact | 7pt | Phone/website | Left |
| Page number | 8pt | "Page X of Y" | Right |
| Disclaimer | 6pt | Legal text | Bottom |

### Footer Content Data

```
Footer Information
├── Courier logo and branding
├── Courier contact information
├── Tracking barcode
├── QR code for digital access
├── Page numbering
└── Legal disclaimers
```

### Multi-Page Footer Behavior

| Page | Left Content | Center Content | Right Content |
|------|-------------|----------------|---------------|
| First | Courier logo | Main barcode | Page 1 of N |
| Middle | Courier info | Reference codes | Page X of N |
| Last | Full branding | Summary codes | Page N of N |

### Footer Styling Variations

| Style | Description | Elements |
|-------|-------------|----------|
| Minimal | Essential info only | Barcode + page |
| Standard | Logo + codes + page | All elements |
| Detailed | Full branding + legal | Maximum info |

### Expected Outcome
- Professional footer with courier branding
- Integrated barcode/QR code support
- Consistent page numbering
- Legal compliance information

### Verification Checklist
- [ ] `footer.py` file created
- [ ] PDFFooter class implemented
- [ ] Three-section layout working
- [ ] Courier logo placement functional
- [ ] Barcode integration ready
- [ ] Page numbering system working

---

## Task 32: Create Tenant Logo

### Overview
Implement tenant logo handling system that manages customer business logos in PDF headers. This system supports multiple image formats, automatic resizing, quality optimization, and fallback mechanisms when logos are unavailable or invalid.

### Dependencies
- Task 30: Create PDF Header

### Instructions

1. **Create logo management module**
   - Create file `logo_manager.py` in pdf directory
   - Import image processing libraries
   - Add file handling utilities

2. **Define TenantLogo class**
   - Create class for logo handling
   - Add image loading and validation methods
   - Include logo caching mechanisms

3. **Implement logo loading system**
   - Create method to load logos from tenant data
   - Add support for file uploads and URLs
   - Implement logo format validation

4. **Add image processing capabilities**
   - Create automatic resizing functionality
   - Add aspect ratio preservation
   - Implement quality optimization

5. **Create logo cache system**
   - Add memory caching for frequently used logos
   - Create file system cache for processed logos
   - Implement cache expiration and cleanup

6. **Add fallback mechanisms**
   - Create default logo system
   - Add placeholder logo generation
   - Implement graceful degradation

### Tenant Logo Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Max Width | 150px | Header space limit |
| Max Height | 50px | Vertical constraint |
| Min Width | 50px | Readability threshold |
| Min Height | 20px | Minimum visibility |

### Supported Image Formats

| Format | Extension | Support Level | Optimization |
|--------|-----------|---------------|--------------|
| PNG | .png | Full | Lossless compression |
| JPEG | .jpg, .jpeg | Full | Quality adjustment |
| SVG | .svg | Limited | Rasterization |
| WebP | .webp | Conditional | Modern format |

### Logo Processing Pipeline

```
Logo Processing Flow
├── 1. Load original image
├── 2. Validate format and size
├── 3. Resize if necessary
├── 4. Optimize for print quality
├── 5. Cache processed version
├── 6. Return PDF-ready image
└── 7. Handle processing errors
```

### Logo Sizing Rules

| Page Size | Max Logo Size | Scaling Factor | Priority |
|-----------|---------------|----------------|----------|
| Thermal | 100×35px | 0.67× | Space critical |
| A4 | 150×50px | 1.0× | Full quality |
| A5 | 120×40px | 0.8× | Balanced |

### Cache Management

| Cache Type | Storage | Expiration | Size Limit |
|------------|---------|------------|------------|
| Memory | RAM | 1 hour | 50 logos |
| Disk | File system | 24 hours | 500 logos |
| Database | Metadata only | Permanent | Unlimited |

### Logo Fallback Strategy

```
Fallback Sequence
├── 1. Tenant-specific logo
├── 2. Tenant category default
├── 3. System default logo
├── 4. Text-based placeholder
└── 5. Empty space (minimal)
```

### Logo Quality Settings

| Quality | DPI | File Size | Use Case |
|---------|-----|-----------|----------|
| Draft | 150 | Small | Testing |
| Standard | 300 | Medium | Normal use |
| High | 600 | Large | Professional |

### Logo Validation Rules

| Rule | Check | Action |
|------|-------|--------|
| File exists | Path validation | Load or fallback |
| Format support | Extension check | Convert or reject |
| Size limits | Dimension check | Resize or reject |
| File size | Byte limit | Optimize or reject |

### Expected Outcome
- Robust logo management system
- Automatic processing and optimization
- Reliable fallback mechanisms
- Ready for production use

### Verification Checklist
- [ ] `logo_manager.py` file created
- [ ] TenantLogo class implemented
- [ ] Image processing working
- [ ] Logo caching functional
- [ ] Fallback system reliable
- [ ] All formats supported properly

---

## Task 33: Create Courier Logo

### Overview
Implement courier logo handling system for PDF footers that manages courier service provider branding. This system maintains courier-specific logos, handles multiple courier integrations, and ensures consistent branding in waybill documents.

### Dependencies
- Task 31: Create PDF Footer

### Instructions

1. **Extend logo management for couriers**
   - Update `logo_manager.py` to handle courier logos
   - Add CourierLogo class for courier-specific handling
   - Create courier logo registry system

2. **Define courier logo specifications**
   - Create smaller logo size limits for footer space
   - Add courier-specific sizing rules
   - Define placement constraints for footer layout

3. **Implement courier logo repository**
   - Create directory structure for courier logos
   - Add default logos for major Sri Lankan couriers
   - Implement logo versioning for brand updates

4. **Add courier-specific processing**
   - Create courier logo loading methods
   - Add courier brand color extraction
   - Implement courier-specific optimizations

5. **Create courier fallback system**
   - Add generic courier placeholder
   - Create text-based courier identification
   - Implement graceful degradation for missing logos

6. **Integrate with PDF footer**
   - Update PDFFooter to use CourierLogo
   - Add logo positioning in footer layout
   - Ensure consistent courier branding

### Courier Logo Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Max Width | 100px | Footer space limit |
| Max Height | 40px | Footer height constraint |
| Min Width | 40px | Brand recognition |
| Min Height | 15px | Minimum visibility |

### Sri Lankan Courier Services

| Courier | Logo Size | Brand Colors | File Name |
|---------|-----------|--------------|-----------|
| DHL Lanka | 80×30px | Red/Yellow | dhl-lanka.png |
| FedEx Lanka | 85×25px | Purple/Orange | fedex-lanka.png |
| Aramex Lanka | 75×35px | Red/Blue | aramex-lanka.png |
| Pronto Lanka | 70×30px | Blue/Green | pronto-lanka.png |

### Courier Logo Directory Structure

```
fonts/courier-logos/
├── dhl-lanka.png
├── fedex-lanka.png
├── aramex-lanka.png
├── pronto-lanka.png
├── default-courier.png
└── README.md
```

### Courier Logo Processing

| Step | Action | Courier-Specific |
|------|--------|------------------|
| 1 | Load courier info | Service identification |
| 2 | Select appropriate logo | Brand matching |
| 3 | Apply courier sizing | Service-specific rules |
| 4 | Position in footer | Brand guidelines |
| 5 | Cache processed logo | Performance |

### Courier Brand Integration

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Logo placement | Footer left | Standard position |
| Brand colors | Color extraction | Theme consistency |
| Contact info | Service details | Customer service |
| Service codes | Tracking integration | Operational data |

### Courier Logo Fallback

```
Courier Fallback Sequence
├── 1. Specific courier logo
├── 2. Courier category default
├── 3. Generic courier placeholder
├── 4. Text-based courier name
└── 5. Service code only
```

### Footer Integration Points

| Component | Courier Data | Display |
|-----------|-------------|---------|
| Logo | Brand image | Visual identity |
| Name | Company name | Text identification |
| Contact | Phone/website | Customer service |
| Code | Service identifier | Operational reference |

### Expected Outcome
- Comprehensive courier logo system
- Support for major Sri Lankan couriers
- Consistent footer branding
- Reliable fallback mechanisms

### Verification Checklist
- [ ] CourierLogo class created
- [ ] Courier logo repository established
- [ ] Major courier logos added
- [ ] Footer integration working
- [ ] Fallback system functional
- [ ] Brand consistency maintained

---

## Task 34: Verify PDF Generation

### Overview
Conduct comprehensive testing and verification of the complete PDF generation system to ensure reliable operation across all page sizes, generators, fonts, and content types. This verification covers functional testing, performance validation, and quality assurance.

### Dependencies
- Task 33: Create Courier Logo
- All PDF generation components complete

### Instructions

1. **Create PDF generation test suite**
   - Create file `test_pdf_generation.py` in tests directory
   - Import all PDF generation components
   - Add comprehensive test cases

2. **Test basic PDF generation**
   - Create test waybills with various content types
   - Test ReportLabGenerator with all page sizes
   - Test WeasyPrintGenerator with all page sizes

3. **Verify font rendering**
   - Test English text rendering
   - Test Sinhala Unicode text rendering
   - Test Tamil Unicode text rendering
   - Test mixed-language content

4. **Test page size configurations**
   - Generate thermal size PDFs (4×6 inches)
   - Generate A4 size PDFs (210×297 mm)
   - Generate A5 size PDFs (148×210 mm)
   - Verify dimensions and content fitting

5. **Verify logo integration**
   - Test tenant logo placement and sizing
   - Test courier logo placement and sizing
   - Test fallback mechanisms for missing logos
   - Verify logo quality and positioning

6. **Conduct performance testing**
   - Test single PDF generation speed
   - Test bulk PDF generation performance
   - Monitor memory usage during generation
   - Test concurrent PDF generation

7. **Quality assurance checks**
   - Verify PDF file validity
   - Test PDF readability in viewers
   - Check print quality on actual printers
   - Validate PDF metadata and properties

### Test Case Categories

| Category | Test Count | Coverage |
|----------|------------|----------|
| Basic Generation | 20 | Core functionality |
| Font Rendering | 15 | Unicode support |
| Page Sizes | 12 | All size combinations |
| Logo Integration | 10 | Branding elements |
| Performance | 8 | Speed and memory |
| Quality | 6 | Output validation |

### Font Testing Matrix

| Language | Font | Generator | Page Size | Status |
|----------|------|-----------|-----------|--------|
| English | Default | ReportLab | Thermal | ✓ |
| English | Default | WeasyPrint | A4 | ✓ |
| Sinhala | Noto Sans | ReportLab | A5 | ✓ |
| Tamil | Noto Sans | WeasyPrint | Thermal | ✓ |

### Performance Benchmarks

| Metric | Target | ReportLab | WeasyPrint |
|--------|--------|-----------|------------|
| Single PDF | < 500ms | ~300ms | ~800ms |
| Memory Usage | < 50MB | ~20MB | ~60MB |
| Concurrent | 10 PDFs/sec | ~15/sec | ~8/sec |

### Quality Verification Steps

```
PDF Quality Checklist
├── File validity (PDF/A compliance)
├── Text searchability
├── Font embedding verification
├── Image quality assessment
├── Print output testing
├── Metadata accuracy
└── Cross-platform compatibility
```

### Test Data Requirements

| Data Type | Samples | Purpose |
|-----------|---------|---------|
| Waybills | 50 | Variety of content |
| Addresses | 100 | Language coverage |
| Logos | 20 | Size variations |
| Items | 200 | Content diversity |

### Error Handling Tests

| Error Type | Test Case | Expected Behavior |
|------------|-----------|-------------------|
| Missing font | Remove font file | Fallback font used |
| Invalid logo | Corrupted image | Placeholder shown |
| Large content | Oversized text | Content truncation |
| Memory limit | Bulk generation | Graceful handling |

### Output Validation

| Validation | Method | Tool |
|------------|--------|------|
| PDF structure | File analysis | PyPDF2 |
| Visual output | Image comparison | PIL |
| Performance | Time measurement | Python profiler |
| Memory usage | Resource monitoring | Memory profiler |

### Expected Outcome
- Fully verified PDF generation system
- Comprehensive test coverage
- Performance benchmarks established
- Quality standards confirmed
- Production-ready system

### Verification Checklist
- [ ] Test suite created and comprehensive
- [ ] All basic generation tests pass
- [ ] Font rendering verified for all languages
- [ ] All page sizes generate correctly
- [ ] Logo integration working properly
- [ ] Performance meets requirements
- [ ] Quality standards achieved
- [ ] Error handling robust
- [ ] Cross-platform compatibility confirmed
- [ ] System ready for production deployment

---

## Summary

This document completed the PDF generation engine implementation with Unicode font support, layout components, and comprehensive verification. The system now supports multi-language content rendering, professional document layouts, and reliable PDF generation across all required formats for Sri Lankan courier integration.

### Completed Tasks
1. ✓ Created PDF font management system with Unicode support
2. ✓ Integrated Sinhala font (Noto Sans Sinhala) for proper character rendering  
3. ✓ Integrated Tamil font (Noto Sans Tamil) with conjunct support
4. ✓ Configured standardized PDF margins for all page sizes
5. ✓ Implemented professional PDF header with logo and waybill info
6. ✓ Created comprehensive PDF footer with courier branding and tracking
7. ✓ Established tenant logo handling with processing and fallbacks
8. ✓ Implemented courier logo system for major Sri Lankan services
9. ✓ Conducted thorough verification and testing of complete system

### System Capabilities
- **Multi-Generator Support**: ReportLab for speed, WeasyPrint for rich formatting
- **Multi-Language Text**: English, Sinhala, and Tamil Unicode rendering
- **Multi-Size Output**: Thermal labels (4×6"), A4 documents, A5 compact format  
- **Professional Layout**: Headers with logos, footers with tracking, proper margins
- **Robust Fallbacks**: Logo alternatives, font substitution, error handling
- **Performance Optimized**: Caching, memory management, concurrent generation

### Next Steps
The PDF generation engine is now complete and ready for integration with the waybill generation workflow. The system provides reliable, professional PDF output suitable for Sri Lankan courier services and business requirements.