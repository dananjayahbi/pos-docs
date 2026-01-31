# Tasks 17-25: Libraries and Page Sizes

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** B - PDF Generation Engine  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-26-34_Fonts-Layout-Verify.md](02_Tasks-26-34_Fonts-Layout-Verify.md)

---

## Document Overview

This document covers the installation of PDF generation libraries and creation of the PDF generation engine with page size configurations. It establishes the foundational infrastructure for generating waybill PDFs in multiple formats, including ReportLab and WeasyPrint implementations with thermal, A4, and A5 page size support for Sri Lankan courier requirements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Install PDF Libraries | Low | 15 min |
| 18 | Create PDFGenerator ABC | Medium | 30 min |
| 19 | Create generate Method | Low | 20 min |
| 20 | Create ReportLabGenerator | High | 45 min |
| 21 | Create WeasyPrintGenerator | High | 45 min |
| 22 | Create PDF Page Size | Low | 20 min |
| 23 | Create Thermal Size | Low | 15 min |
| 24 | Create A4 Size | Low | 15 min |
| 25 | Create A5 Size | Low | 15 min |

---

## Task 17: Install PDF Libraries

### Overview
Install the necessary PDF generation libraries including ReportLab for programmatic PDF creation and WeasyPrint for HTML-to-PDF conversion. These libraries provide different approaches to PDF generation, allowing flexibility based on use case requirements and performance needs.

### Dependencies
- Task 16: Create Waybill Repository must be complete
- Backend Django project is initialized
- Virtual environment is activated

### Instructions

1. **Navigate to backend directory**
   - Go to `backend/` directory
   - Ensure virtual environment is activated
   - Confirm `requirements.txt` exists

2. **Add PDF libraries to requirements**
   - Add `reportlab>=4.0.0` for programmatic PDF generation
   - Add `weasyprint>=61.0` for HTML-to-PDF conversion
   - Add `Pillow>=10.0.0` for image handling support

3. **Install additional dependencies**
   - Add `pango` system dependency for WeasyPrint text rendering
   - Add `fontconfig` for proper font management
   - Add `cairo` for graphics rendering support

4. **Install Python packages**
   - Run package installation command
   - Verify successful installation of all packages
   - Check for any dependency conflicts

5. **Verify library installations**
   - Test ReportLab import functionality
   - Test WeasyPrint import functionality
   - Confirm Pillow image processing support

### Library Specifications

| Library | Version | Purpose | Performance |
|---------|---------|---------|-------------|
| reportlab | ≥4.0.0 | Programmatic PDF creation | High |
| weasyprint | ≥61.0 | HTML to PDF conversion | Medium |
| Pillow | ≥10.0.0 | Image processing support | High |

### System Dependencies

| Dependency | Platform | Purpose |
|------------|----------|---------|
| pango | Linux/macOS | Text layout engine |
| fontconfig | Linux/macOS | Font management |
| cairo | Linux/macOS | Graphics rendering |
| GTK | Windows | WeasyPrint support |

### Installation Verification

```
Library Import Tests
├── from reportlab.pdfgen import canvas
├── from weasyprint import HTML
└── from PIL import Image
```

### Performance Characteristics

| Library | Speed | Memory | Features |
|---------|-------|--------|----------|
| ReportLab | Fast | Low | Basic layouts |
| WeasyPrint | Medium | Medium | Rich HTML/CSS |
| Combined | Flexible | Variable | Best of both |

### Expected Outcome
- PDF generation libraries installed successfully
- System dependencies configured properly
- Import tests pass without errors
- Ready for PDF generator implementation

### Verification Checklist
- [ ] ReportLab added to requirements.txt
- [ ] WeasyPrint added to requirements.txt
- [ ] Pillow added to requirements.txt
- [ ] System dependencies installed (Linux/macOS)
- [ ] All packages install without conflicts
- [ ] Library imports work correctly

---

## Task 18: Create PDFGenerator ABC

### Overview
Create the abstract base class for PDF generators that defines the common interface for all PDF generation implementations. This ABC ensures consistent method signatures across different PDF libraries and provides a foundation for the Strategy pattern implementation.

### Dependencies
- Task 17: Install PDF Libraries

### Instructions

1. **Create PDF generator directory structure**
   - Navigate to `backend/apps/shipping/` directory
   - Create new directory named `generators`
   - Create subdirectory named `pdf` within generators

2. **Create base PDF generator file**
   - Create file `base.py` in the pdf directory
   - Add appropriate imports for ABC functionality
   - Import typing annotations for method signatures

3. **Define PDFGenerator abstract class**
   - Create class `PDFGenerator` inheriting from `ABC`
   - Add class docstring explaining purpose and usage
   - Define abstract method signatures

4. **Add configuration properties**
   - Add abstract property for supported page sizes
   - Add abstract property for supported font formats
   - Add abstract property for library version info

5. **Define error handling classes**
   - Create `PDFGenerationError` exception class
   - Create `UnsupportedPageSizeError` exception class
   - Create `FontEmbeddingError` exception class

6. **Add validation methods**
   - Create method for page size validation
   - Create method for font availability checking
   - Create method for template format validation

### Class Structure

```
PDFGenerator (ABC)
├── generate() - Abstract method
├── validate_page_size() - Validation
├── validate_fonts() - Font checking
├── get_supported_sizes() - Property
└── get_library_info() - Property
```

### Abstract Method Signature

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| generate | waybill, template, size | bytes | Generate PDF content |

### Exception Hierarchy

| Exception | Parent | Use Case |
|-----------|--------|----------|
| PDFGenerationError | Exception | Base PDF errors |
| UnsupportedPageSizeError | PDFGenerationError | Invalid size |
| FontEmbeddingError | PDFGenerationError | Font issues |

### Abstract Properties

| Property | Type | Description |
|----------|------|-------------|
| supported_sizes | List[str] | Available page sizes |
| supported_fonts | List[str] | Available font formats |
| library_info | Dict | Version and capabilities |

### Expected Outcome
- Abstract base class created successfully
- Clear interface definition for implementations
- Proper exception hierarchy established
- Foundation for Strategy pattern implementation

### Verification Checklist
- [ ] `backend/apps/shipping/generators/pdf/base.py` created
- [ ] PDFGenerator class inherits from ABC
- [ ] generate() method is abstract
- [ ] Exception classes defined properly
- [ ] Abstract properties implemented
- [ ] Class imports work correctly

---

## Task 19: Create generate Method

### Overview
Define the abstract generate method signature and documentation that all PDF generator implementations must follow. This method serves as the primary interface for PDF creation, accepting waybill data, template configuration, and page size specifications.

### Dependencies
- Task 18: Create PDFGenerator ABC

### Instructions

1. **Define method signature**
   - Open `base.py` file in pdf directory
   - Locate PDFGenerator abstract class
   - Add generate method with proper typing

2. **Add method parameters**
   - Add `waybill` parameter with Waybill model type
   - Add `template` parameter with template configuration
   - Add `size` parameter with page size specification

3. **Define return type annotation**
   - Set return type as `bytes` for PDF content
   - Add optional return type for error cases
   - Include Union typing for multiple return types

4. **Create comprehensive docstring**
   - Document method purpose and usage
   - Describe each parameter and its requirements
   - Explain return value format and encoding

5. **Add parameter validation requirements**
   - Specify required waybill fields validation
   - Define template format requirements
   - List supported page size values

6. **Define error handling contract**
   - Specify which exceptions may be raised
   - Document error conditions and responses
   - Include parameter validation error handling

### Method Signature Components

| Component | Type | Description |
|-----------|------|-------------|
| waybill | Waybill | Waybill model instance |
| template | str | Template identifier |
| size | str | Page size specification |
| **returns** | bytes | PDF content as bytes |

### Parameter Requirements

| Parameter | Validation | Format |
|-----------|------------|---------|
| waybill | Must be saved instance | Waybill model |
| template | Must exist in system | String identifier |
| size | Must be supported | thermal/A4/A5 |

### Template Format Options

| Template | Description | Use Case |
|----------|-------------|----------|
| basic | Simple layout | Quick printing |
| detailed | Full information | Complete waybills |
| compact | Minimal size | Label printing |

### Page Size Specifications

| Size | Dimensions | Usage |
|------|------------|--------|
| thermal | 4x6 inches | Courier labels |
| A4 | 210x297 mm | Standard documents |
| A5 | 148x210 mm | Compact format |

### Error Conditions

| Condition | Exception | Description |
|-----------|-----------|-------------|
| Invalid waybill | PDFGenerationError | Missing required data |
| Unknown template | PDFGenerationError | Template not found |
| Unsupported size | UnsupportedPageSizeError | Size not available |

### Expected Outcome
- Clear method signature definition
- Comprehensive parameter documentation
- Proper type annotations throughout
- Foundation for concrete implementations

### Verification Checklist
- [ ] generate() method added to PDFGenerator ABC
- [ ] Proper type annotations for all parameters
- [ ] Comprehensive docstring documentation
- [ ] Return type specified as bytes
- [ ] Error handling requirements documented
- [ ] Method marked as @abstractmethod

---

## Task 20: Create ReportLabGenerator

### Overview
Implement the ReportLab-based PDF generator that provides fast, programmatic PDF creation. This implementation focuses on performance and direct PDF manipulation, making it ideal for high-volume waybill generation with minimal resource usage.

### Dependencies
- Task 19: Create generate Method

### Instructions

1. **Create ReportLab generator file**
   - Create file `reportlab_gen.py` in pdf directory
   - Import ReportLab required modules
   - Import PDFGenerator base class

2. **Define ReportLabGenerator class**
   - Create class inheriting from PDFGenerator
   - Add class docstring with usage information
   - Initialize required ReportLab components

3. **Implement generate method**
   - Override abstract generate method
   - Add parameter validation logic
   - Implement PDF creation workflow

4. **Add canvas setup methods**
   - Create method for page size configuration
   - Create method for margin setup
   - Create method for coordinate system setup

5. **Implement content rendering methods**
   - Create method for text rendering
   - Create method for image placement
   - Create method for line drawing and borders

6. **Add font handling capabilities**
   - Implement font registration system
   - Add Unicode font support for Sinhala/Tamil
   - Create font fallback mechanisms

7. **Implement page size support**
   - Add thermal size implementation (4x6 inches)
   - Add A4 size implementation (210x297 mm)
   - Add A5 size implementation (148x210 mm)

### ReportLab Components

| Component | Purpose | Usage |
|-----------|---------|-------|
| Canvas | PDF page creation | Main drawing surface |
| Paragraph | Formatted text | Rich text content |
| Table | Tabular data | Structured layouts |
| Image | Picture insertion | Logo placement |

### Canvas Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| pagesize | Variable | Page dimensions |
| bottomup | 1 | Coordinate system |
| verbosity | 0 | Error reporting |

### Content Rendering Pipeline

```
PDF Generation Flow
├── 1. Validate parameters
├── 2. Create canvas with page size
├── 3. Set up coordinate system
├── 4. Render header section
├── 5. Render waybill content
├── 6. Render footer section
├── 7. Save and return bytes
└── 8. Handle any errors
```

### Font Registration Process

| Step | Action | Result |
|------|--------|--------|
| 1 | Register TTF fonts | Font availability |
| 2 | Set font mappings | Unicode support |
| 3 | Create fallbacks | Error handling |

### Page Size Implementation

| Size | ReportLab Constant | Dimensions |
|------|-------------------|------------|
| thermal | Custom tuple | (288, 432) points |
| A4 | A4 | (595, 842) points |
| A5 | A5 | (420, 595) points |

### Performance Optimizations

| Technique | Benefit | Implementation |
|-----------|---------|----------------|
| Canvas reuse | Reduced overhead | Object pooling |
| Font caching | Faster rendering | Memory storage |
| Image caching | Quick access | File system cache |

### Expected Outcome
- High-performance PDF generator implementation
- Support for all required page sizes
- Unicode font embedding capabilities
- Optimized for bulk generation scenarios

### Verification Checklist
- [ ] `reportlab_gen.py` file created
- [ ] ReportLabGenerator class implemented
- [ ] generate() method overridden properly
- [ ] Canvas setup methods created
- [ ] Content rendering methods implemented
- [ ] Font handling system working
- [ ] All page sizes supported correctly

---

## Task 21: Create WeasyPrintGenerator

### Overview
Implement the WeasyPrint-based PDF generator that converts HTML templates to PDF documents. This implementation provides rich formatting capabilities and CSS styling support, making it ideal for complex layouts and professional document appearance.

### Dependencies
- Task 19: Create generate Method

### Instructions

1. **Create WeasyPrint generator file**
   - Create file `weasyprint_gen.py` in pdf directory
   - Import WeasyPrint required modules
   - Import PDFGenerator base class and HTML handling

2. **Define WeasyPrintGenerator class**
   - Create class inheriting from PDFGenerator
   - Add class configuration for CSS and fonts
   - Initialize template rendering engine

3. **Implement generate method**
   - Override abstract generate method
   - Add HTML template loading logic
   - Implement template data binding

4. **Create template rendering system**
   - Add method for template file loading
   - Create template context preparation
   - Implement variable substitution logic

5. **Add CSS styling configuration**
   - Create CSS file loading system
   - Add page size CSS definitions
   - Implement responsive layout rules

6. **Implement font configuration**
   - Add CSS font-face definitions
   - Configure Unicode font paths
   - Set up font fallback chains

7. **Add page size implementations**
   - Create thermal size CSS (100x150mm)
   - Create A4 size CSS (210x297mm)
   - Create A5 size CSS (148x210mm)

### WeasyPrint Components

| Component | Purpose | Usage |
|-----------|---------|-------|
| HTML | Content structure | Template base |
| CSS | Styling rules | Layout control |
| Document | PDF container | Output format |

### Template System Architecture

```
Template Processing Flow
├── 1. Load HTML template
├── 2. Prepare context data
├── 3. Render template variables
├── 4. Apply CSS styling
├── 5. Configure page size
├── 6. Generate PDF document
├── 7. Return PDF bytes
└── 8. Handle template errors
```

### CSS Page Size Configuration

| Size | CSS Media Query | Dimensions |
|------|----------------|------------|
| thermal | @page { size: 100mm 150mm } | 4x6 inches |
| A4 | @page { size: A4 } | 210x297 mm |
| A5 | @page { size: A5 } | 148x210 mm |

### Template Context Variables

| Variable | Type | Description |
|----------|------|-------------|
| waybill | Object | Waybill instance data |
| tenant | Object | Tenant information |
| courier | Object | Courier details |
| settings | Dict | Configuration options |

### Font Configuration CSS

```
Font Face Definitions
├── @font-face { Noto Sans Sinhala }
├── @font-face { Noto Sans Tamil }
└── font-family fallback chains
```

### HTML Template Structure

| Section | Purpose | CSS Classes |
|---------|---------|-------------|
| Header | Logo and info | .header, .logo |
| Content | Waybill data | .content, .field |
| Footer | Barcode and info | .footer, .barcode |

### Performance Considerations

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Template caching | Memory storage | Faster rendering |
| CSS compilation | Pre-processed | Reduced overhead |
| Font preloading | System cache | Quick access |

### Expected Outcome
- HTML-to-PDF generator implementation
- Rich CSS styling capabilities
- Professional document layouts
- Template-based flexibility

### Verification Checklist
- [ ] `weasyprint_gen.py` file created
- [ ] WeasyPrintGenerator class implemented
- [ ] HTML template system working
- [ ] CSS styling configuration complete
- [ ] Font embedding functional
- [ ] All page sizes render correctly

---

## Task 22: Create PDF Page Size

### Overview
Create the page size configuration system that manages different PDF dimensions for various use cases. This system provides standardized page size definitions and ensures consistent formatting across different PDF generators and output requirements.

### Dependencies
- Task 20: Create ReportLabGenerator
- Task 21: Create WeasyPrintGenerator

### Instructions

1. **Create page size configuration file**
   - Create file `page_sizes.py` in pdf directory
   - Add imports for dimension calculations
   - Create constants for common measurements

2. **Define PageSize data class**
   - Create dataclass with width and height properties
   - Add name and description fields
   - Include unit conversion methods

3. **Add dimension conversion utilities**
   - Create method for mm to points conversion
   - Create method for inches to points conversion
   - Add method for pixel to points conversion

4. **Implement page size registry**
   - Create dictionary of available page sizes
   - Add getter method for size by name
   - Include validation for size existence

5. **Define common page size constants**
   - Add thermal printer size (4x6 inches)
   - Add standard A4 size (210x297 mm)
   - Add compact A5 size (148x210 mm)

6. **Add size validation methods**
   - Create method to validate size names
   - Add method to check dimension limits
   - Include method for aspect ratio validation

### PageSize Data Structure

| Field | Type | Description |
|-------|------|-------------|
| name | str | Size identifier |
| width | float | Width in points |
| height | float | Height in points |
| description | str | Human-readable name |
| unit | str | Original unit type |

### Conversion Constants

| Unit | Points Multiplier | Usage |
|------|-------------------|-------|
| inches | 72 | Imperial measurements |
| mm | 2.834 | Metric measurements |
| pixels | 0.75 | Digital dimensions |

### Page Size Registry Structure

```
PAGE_SIZES = {
    'thermal': PageSize(...),
    'A4': PageSize(...),
    'A5': PageSize(...),
}
```

### Dimension Validation Rules

| Rule | Purpose | Implementation |
|------|---------|----------------|
| Min size | Prevent too small | width/height >= 72pt |
| Max size | Prevent too large | width/height <= 1440pt |
| Aspect ratio | Reasonable proportions | 0.1 <= ratio <= 10 |

### Size Utility Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| get_size(name) | Retrieve size config | PageSize object |
| validate_size(name) | Check if exists | Boolean |
| list_sizes() | Available options | List of names |

### Expected Outcome
- Centralized page size configuration
- Consistent dimension handling
- Easy addition of new page sizes
- Proper unit conversion support

### Verification Checklist
- [ ] `page_sizes.py` file created
- [ ] PageSize dataclass defined
- [ ] Conversion utilities implemented
- [ ] Page size registry created
- [ ] Validation methods working
- [ ] Common sizes defined correctly

---

## Task 23: Create Thermal Size

### Overview
Configure the thermal printer page size specifically for courier labels and shipping stickers. This 4x6 inch format is the standard size for thermal label printers used by Sri Lankan courier services and provides optimal space utilization for waybill information.

### Dependencies
- Task 22: Create PDF Page Size

### Instructions

1. **Define thermal size specifications**
   - Open `page_sizes.py` file
   - Add thermal size constants
   - Define 4x6 inch dimensions in points

2. **Calculate exact dimensions**
   - Convert 4 inches to points (4 × 72 = 288)
   - Convert 6 inches to points (6 × 72 = 432)
   - Verify aspect ratio (1.5:1)

3. **Add thermal PageSize entry**
   - Create PageSize instance for thermal
   - Set name as 'thermal'
   - Add descriptive text for courier labels

4. **Configure margin considerations**
   - Account for thermal printer margins
   - Set printable area dimensions
   - Define safe content boundaries

5. **Add thermal-specific validations**
   - Validate content fits within thermal bounds
   - Check font sizes for readability
   - Ensure barcode sizing compatibility

6. **Test thermal size configuration**
   - Verify dimensions in both generators
   - Test with sample waybill content
   - Confirm courier label compatibility

### Thermal Size Specifications

| Dimension | Value | Points | Purpose |
|-----------|-------|--------|---------|
| Width | 4 inches | 288 pt | Standard label width |
| Height | 6 inches | 432 pt | Standard label height |
| Aspect Ratio | 1:1.5 | N/A | Portrait orientation |

### Courier Compatibility

| Courier Service | Label Size | Compatibility |
|----------------|------------|---------------|
| DHL Sri Lanka | 4x6 inches | ✓ Full |
| FedEx Lanka | 4x6 inches | ✓ Full |
| Aramex Lanka | 4x6 inches | ✓ Full |
| Local Couriers | 4x6 inches | ✓ Full |

### Thermal Printer Margins

| Edge | Margin | Printable Area |
|------|--------|----------------|
| Top | 0.1 inch | 283 pt width |
| Bottom | 0.1 inch | 418 pt height |
| Left | 0.05 inch | 2.9" content |
| Right | 0.05 inch | 5.8" content |

### Content Layout Zones

```
Thermal Layout (4x6 inches)
┌─────────────────────────────┐
│        Header Zone          │ ← 1" height
├─────────────────────────────┤
│                             │
│      Content Zone           │ ← 4" height
│   (Address, Items, etc.)    │
│                             │
├─────────────────────────────┤
│       Footer Zone           │ ← 1" height
│   (Barcode, Tracking)       │
└─────────────────────────────┘
```

### Font Size Recommendations

| Content Type | Font Size | Rationale |
|--------------|-----------|-----------|
| Headers | 12-14pt | Clear identification |
| Addresses | 10-12pt | Space efficiency |
| Details | 8-10pt | Information density |
| Barcodes | Auto | Scanner compatibility |

### Expected Outcome
- Thermal size properly configured
- Compatible with all Sri Lankan couriers
- Optimal content layout support
- Ready for production printing

### Verification Checklist
- [ ] Thermal size added to page_sizes.py
- [ ] 4x6 inch dimensions correct (288x432 pt)
- [ ] Margin calculations accurate
- [ ] Content zones defined properly
- [ ] Font size recommendations documented
- [ ] Courier compatibility verified

---

## Task 24: Create A4 Size

### Overview
Configure the A4 page size for standard document printing when waybills need to be included with packing slips or when customers require full-size documentation. A4 provides ample space for detailed information and professional presentation.

### Dependencies
- Task 22: Create PDF Page Size

### Instructions

1. **Define A4 size specifications**
   - Open `page_sizes.py` file
   - Add A4 size constants using ISO 216 standard
   - Define 210x297 mm dimensions in points

2. **Calculate A4 dimensions**
   - Convert 210 mm to points (210 × 2.834 = 595)
   - Convert 297 mm to points (297 × 2.834 = 842)
   - Verify standard A4 proportions

3. **Add A4 PageSize entry**
   - Create PageSize instance for A4
   - Set name as 'A4'
   - Add descriptive text for standard documents

4. **Configure standard margins**
   - Set 20mm margins on all sides
   - Define printable area boundaries
   - Account for printer limitations

5. **Add multi-column layout support**
   - Enable two-column content layout
   - Add section dividers and spacing
   - Support for additional document elements

6. **Test A4 size configuration**
   - Verify dimensions match ISO 216 standard
   - Test with extended waybill content
   - Confirm professional appearance

### A4 Size Specifications

| Dimension | Value | Points | Standard |
|-----------|-------|--------|----------|
| Width | 210 mm | 595 pt | ISO 216 A4 |
| Height | 297 mm | 842 pt | ISO 216 A4 |
| Aspect Ratio | 1:1.414 | √2 | ISO standard |

### A4 Margin Configuration

| Edge | Margin | Printable Area |
|------|--------|----------------|
| Top | 20 mm | 555 pt width |
| Bottom | 20 mm | 785 pt height |
| Left | 20 mm | 170 mm content |
| Right | 20 mm | 257 mm content |

### A4 Content Layout Zones

```
A4 Layout (210x297 mm)
┌─────────────────────────────────────┐
│              Header                 │ ← 30mm height
├─────────────────────────────────────┤
│  ┌───────────┐ ┌─────────────────┐ │
│  │ Sender    │ │ Recipient       │ │
│  │ Details   │ │ Details         │ │
│  └───────────┘ └─────────────────┘ │ ← 60mm height
├─────────────────────────────────────┤
│                                     │
│         Item Details Table          │ ← 120mm height
│                                     │
├─────────────────────────────────────┤
│          Terms & Conditions         │ ← 40mm height
├─────────────────────────────────────┤
│      Footer & Signatures           │ ← 27mm height
└─────────────────────────────────────┘
```

### Content Capacity

| Section | Recommended Content |
|---------|-------------------|
| Header | Company logo, waybill number, date |
| Addresses | Full postal addresses, contact info |
| Items | Detailed item list with descriptions |
| Terms | Legal text, conditions, instructions |
| Footer | Signatures, barcodes, reference numbers |

### Use Cases for A4 Format

| Use Case | Benefit | When to Use |
|----------|---------|-------------|
| Packing Slip | Complete information | B2B shipments |
| Documentation | Professional appearance | Important deliveries |
| Record Keeping | Archival quality | Legal requirements |
| Customer Copy | Detailed reference | High-value items |

### Expected Outcome
- A4 size properly configured for standard use
- Professional document layout support
- Multi-section content organization
- Compatible with standard office printers

### Verification Checklist
- [ ] A4 size added to page_sizes.py
- [ ] ISO 216 dimensions correct (595x842 pt)
- [ ] Standard margins configured
- [ ] Multi-section layout defined
- [ ] Content capacity optimized
- [ ] Professional appearance verified

---

## Task 25: Create A5 Size

### Overview
Configure the A5 page size as a compact format that balances information density with paper efficiency. A5 provides a middle ground between thermal labels and full A4 documents, suitable for space-conscious printing while maintaining readability.

### Dependencies
- Task 22: Create PDF Page Size

### Instructions

1. **Define A5 size specifications**
   - Open `page_sizes.py` file
   - Add A5 size constants following ISO 216 standard
   - Define 148x210 mm dimensions in points

2. **Calculate A5 dimensions**
   - Convert 148 mm to points (148 × 2.834 = 420)
   - Convert 210 mm to points (210 × 2.834 = 595)
   - Verify A5 is half of A4 dimensions

3. **Add A5 PageSize entry**
   - Create PageSize instance for A5
   - Set name as 'A5'
   - Add descriptive text for compact documents

4. **Configure compact margins**
   - Set 15mm margins for efficient space usage
   - Define optimized printable area
   - Balance content density with readability

5. **Design compact layout structure**
   - Single-column layout for clarity
   - Condensed sections for space efficiency
   - Essential information prioritization

6. **Test A5 size configuration**
   - Verify proper ISO 216 compliance
   - Test content fitting and readability
   - Confirm printer compatibility

### A5 Size Specifications

| Dimension | Value | Points | Relationship |
|-----------|-------|--------|--------------|
| Width | 148 mm | 420 pt | A4 width ÷ 2 |
| Height | 210 mm | 595 pt | A4 height ÷ √2 |
| Aspect Ratio | 1:1.414 | √2 | ISO standard |

### A5 Margin Configuration

| Edge | Margin | Printable Area |
|------|--------|----------------|
| Top | 15 mm | 378 pt width |
| Bottom | 15 mm | 538 pt height |
| Left | 15 mm | 118 mm content |
| Right | 15 mm | 180 mm content |

### A5 Compact Layout Zones

```
A5 Layout (148x210 mm)
┌─────────────────────────────┐
│          Header             │ ← 20mm height
├─────────────────────────────┤
│     ┌─────┐ ┌─────────┐    │
│     │Logo │ │ Details │    │ ← 25mm height
│     └─────┘ └─────────┘    │
├─────────────────────────────┤
│                             │
│       Main Content          │ ← 110mm height
│    (Address & Items)        │
│                             │
├─────────────────────────────┤
│         Barcode             │ ← 20mm height
├─────────────────────────────┤
│         Footer              │ ← 15mm height
└─────────────────────────────┘
```

### Content Optimization

| Element | A5 Approach | Space Saved |
|---------|-------------|-------------|
| Headers | Condensed font | 25% |
| Addresses | Single line format | 30% |
| Item list | Essential fields only | 40% |
| Footer | Minimal information | 50% |

### Ideal Use Cases

| Scenario | Benefit | Consideration |
|----------|---------|---------------|
| Small packages | Paper savings | Content may be tight |
| Local deliveries | Quick printing | Less detail space |
| Cost efficiency | Material savings | Font size limits |
| Eco-friendly | Reduced waste | Layout constraints |

### Font Size Strategy

| Content Type | Font Size | Rationale |
|--------------|-----------|-----------|
| Title | 10-11pt | Clear hierarchy |
| Addresses | 9-10pt | Essential readability |
| Details | 8-9pt | Maximum information |
| Footer | 7-8pt | Reference only |

### Expected Outcome
- A5 size configured for compact printing
- Optimized layout for space efficiency
- Maintains essential information clarity
- Cost-effective printing option

### Verification Checklist
- [ ] A5 size added to page_sizes.py
- [ ] ISO 216 dimensions correct (420x595 pt)
- [ ] Compact margins optimized
- [ ] Single-column layout designed
- [ ] Content prioritization implemented
- [ ] Space efficiency maximized

---

## Summary

This document established the foundation for PDF generation in the waybill system, including library installation, abstract base class creation, and page size configuration. The implemented components provide flexibility in PDF generation approaches and support for multiple document formats suitable for Sri Lankan courier requirements.

### Completed Tasks
1. ✓ Installed PDF libraries (ReportLab, WeasyPrint, Pillow)
2. ✓ Created PDFGenerator abstract base class
3. ✓ Defined generate method interface
4. ✓ Implemented ReportLabGenerator for fast generation
5. ✓ Implemented WeasyPrintGenerator for rich formatting
6. ✓ Created page size configuration system
7. ✓ Configured thermal size (4x6 inches) for courier labels
8. ✓ Configured A4 size (210x297 mm) for standard documents
9. ✓ Configured A5 size (148x210 mm) for compact printing

### Next Steps
Proceed to [02_Tasks-26-34_Fonts-Layout-Verify.md](02_Tasks-26-34_Fonts-Layout-Verify.md) to implement font embedding for Sinhala and Tamil Unicode support, create PDF layout components (headers, footers, margins), and verify the complete PDF generation functionality.