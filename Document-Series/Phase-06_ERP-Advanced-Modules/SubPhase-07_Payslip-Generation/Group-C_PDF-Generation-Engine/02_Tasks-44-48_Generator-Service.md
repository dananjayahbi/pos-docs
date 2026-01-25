# Tasks 44-48: PDF CSS Styles and PayslipGenerator Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** C - PDF Generation Engine  
> **Document:** 02 of 02  
> **Tasks Covered:** 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-43_HTML-Template-Design.md](01_Tasks-33-43_HTML-Template-Design.md)

---

## Document Overview

This document covers the PDF generation infrastructure for payslip documents, including CSS styling optimized for print media and PDF conversion, and the complete PayslipGenerator service class that orchestrates HTML rendering, PDF conversion, file storage, and regeneration workflows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 44 | Create PDF CSS styles | Medium | 35 min |
| 45 | Create PayslipGenerator service class | Medium | 30 min |
| 46 | Implement generate single method | High | 45 min |
| 47 | Implement save PDF method | Medium | 30 min |
| 48 | Implement regenerate method | Medium | 25 min |

---

## Task 44: Create PDF CSS Styles

### Overview
Develop comprehensive CSS stylesheets specifically optimized for PDF generation using WeasyPrint. These styles must handle print media rules, page breaks, responsive table layouts, and ensure consistent rendering across different PDF viewers while maintaining professional payslip aesthetics.

### Dependencies
- Task 33-43: HTML template structure exists
- WeasyPrint library installed and configured
- Template directory structure established

### Instructions

1. **Create CSS file in static directory**
   - Navigate to `apps/payroll/static/payroll/css/` directory
   - Create new file named `payslip_pdf.css`
   - This will contain all PDF-specific styles

2. **Define page layout with @page rule**
   - Set page size to A4 (210mm × 297mm)
   - Define appropriate margins (typically 1-2cm)
   - Configure page orientation (portrait)
   - Set up page numbering if needed

3. **Configure print media query**
   - Use `@media print` for print-specific overrides
   - Ensure colors are preserved in print output
   - Optimize for grayscale printing compatibility

4. **Set base typography rules**
   - Define font family stack (Arial, Helvetica, sans-serif)
   - Set base font size (10-12pt for readability)
   - Configure line height for optimal spacing
   - Set default text color (#333 for better printing)

5. **Create payslip container styles**
   - Define maximum width matching A4 dimensions
   - Center container with auto margins
   - Set background color (white) for consistency
   - Configure padding for content spacing

6. **Style table elements for PDF rendering**
   - Use `border-collapse: collapse` for clean borders
   - Define consistent border widths and colors
   - Set table width to 100% for full-width layout
   - Configure cell padding for readability

7. **Implement page break controls**
   - Add `page-break-inside: avoid` for critical sections
   - Use `page-break-after: avoid` to keep related content together
   - Apply `page-break-before: always` for specific sections if needed
   - Prevent orphan table rows with `break-inside: avoid`

8. **Style company header section**
   - Configure logo dimensions and positioning
   - Style company name with appropriate font size/weight
   - Format address and contact information
   - Ensure header fits within top margin area

9. **Design employee information block**
   - Create grid or table layout for employee details
   - Style labels and values distinctly
   - Use consistent spacing between information rows
   - Apply subtle background color for visual separation

10. **Style period information section**
    - Format date range display prominently
    - Style period name (e.g., "January 2026")
    - Configure pay date highlighting
    - Ensure clear visual distinction from other sections

11. **Design earnings table styles**
    - Create alternating row colors (zebra striping)
    - Style table headers with bold text
    - Right-align numeric columns (amounts)
    - Add bottom border for totals row

12. **Style deductions table**
    - Mirror earnings table structure for consistency
    - Use distinct colors to differentiate from earnings
    - Emphasize total deductions row
    - Ensure clear column alignment

13. **Design summary section styles**
    - Create prominent visual styling for net pay
    - Use larger font size for final amount
    - Add background color to highlight summary
    - Apply generous padding for emphasis

14. **Style year-to-date (YTD) section**
    - Format YTD figures consistently
    - Use smaller font size than main sections
    - Apply subtle background for separation
    - Ensure compact presentation

15. **Design employer contributions section**
    - Style consistently with deductions table
    - Use distinct background color
    - Format contribution types and amounts
    - Maintain clear column structure

16. **Style footer area**
    - Format payslip number prominently
    - Style generation timestamp
    - Add confidentiality notice styling
    - Include page footer with company info

17. **Implement responsive table layouts**
    - Handle long text with word wrapping
    - Set minimum column widths
    - Use overflow handling for edge cases
    - Ensure tables don't break across pages

18. **Add WeasyPrint-specific optimizations**
    - Avoid flexbox (limited WeasyPrint support)
    - Use tables and floats for layout
    - Avoid CSS Grid (not supported)
    - Use absolute positioning sparingly

19. **Configure color management**
    - Use print-safe colors (CMYK-friendly)
    - Ensure sufficient contrast ratios
    - Test colors in grayscale mode
    - Avoid pure black (#000) - use #333

20. **Add print-specific hiding rules**
    - Hide interactive elements (buttons, links)
    - Remove unnecessary decorative elements
    - Suppress navigation elements
    - Clean up for print-only rendering

### CSS Architecture Concepts

#### Page Layout with @page Rule

The `@page` rule defines the page box dimensions and margins for paged media like PDF documents. This is crucial for controlling how content flows across pages.

**Key Properties:**
- **size**: Defines page dimensions (e.g., A4, Letter, or custom dimensions)
- **margin**: Sets page margins (affects printable area)
- **orientation**: Controls portrait or landscape layout
- **marks**: Adds printer marks (crop, cross) for professional printing

**Example Structure:**
```
@page {
  size: A4 portrait;          /* 210mm × 297mm */
  margin: 2cm 1.5cm;          /* top/bottom, left/right */
}
```

**Considerations:**
- A4 size is standard in most countries (including Sri Lanka)
- Margins should accommodate printer limitations
- Content area = page size - margins
- Balance margins for professional appearance

#### Print Media Queries

Print media queries allow different styles for screen and print/PDF output. This ensures optimal presentation in both contexts.

**Usage Pattern:**
```
/* Base styles for all media */
body {
  font-family: Arial, sans-serif;
  color: #333;
}

/* Print/PDF-specific overrides */
@media print {
  body {
    font-size: 10pt;
  }
  
  .no-print {
    display: none;
  }
}
```

**Common Print Optimizations:**
- Hide navigation and interactive elements
- Adjust font sizes for better readability
- Preserve colors with `-webkit-print-color-adjust: exact`
- Optimize spacing and margins
- Remove box shadows (may not render well)

#### Page Break Controls

Page breaks are critical for preventing content from splitting awkwardly across PDF pages. CSS provides several properties to control this behavior.

**Key Properties:**

1. **page-break-inside**
   - `avoid`: Prevents element from breaking across pages
   - `auto`: Allows natural page breaks
   - Use for sections that must stay together

2. **page-break-before**
   - `always`: Forces page break before element
   - `avoid`: Prevents break before element
   - `auto`: Default behavior
   - Useful for starting sections on new pages

3. **page-break-after**
   - `always`: Forces page break after element
   - `avoid`: Prevents break after element
   - Controls what follows an element

4. **break-inside** (modern alternative)
   - `avoid`: Prevents breaking inside element
   - Better browser support than page-break-inside
   - Preferred for new projects

**Strategic Application:**
- Apply `page-break-inside: avoid` to complete tables
- Use on employee information blocks
- Protect earnings/deductions tables from splitting
- Keep summary section together
- Prevent single table rows from breaking

**Example Application Areas:**
```
/* Keep tables together */
.earnings-table, .deductions-table {
  page-break-inside: avoid;
}

/* Keep employee info block together */
.employee-info {
  break-inside: avoid;
}

/* Start new page for specific sections */
.new-section {
  page-break-before: always;
}
```

#### Table Formatting for PDF

Tables in PDFs require special attention to ensure proper rendering, alignment, and page break handling.

**Border Collapse:**
```
table {
  border-collapse: collapse;  /* Merges adjacent borders */
  width: 100%;
}
```

**Benefits of Border Collapse:**
- Cleaner appearance (no double borders)
- Reduced file size
- Better print quality
- Consistent border rendering

**Column Alignment:**
- Left-align text columns (descriptions, names)
- Right-align numeric columns (amounts, quantities)
- Center-align headers for balance

**Responsive Width Handling:**
```
table {
  width: 100%;
  table-layout: fixed;  /* Forces equal column widths */
}

/* Or use auto for content-based sizing */
table {
  table-layout: auto;
}
```

**Cell Padding Strategy:**
- Use consistent padding (e.g., 8px 12px)
- More vertical padding for readability
- Less horizontal padding to maximize width
- Increase padding in summary sections

**Zebra Striping (Alternating Rows):**
```
tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}
```

**Benefits:**
- Improved row tracking across wide tables
- Better readability
- Professional appearance
- Guides eye across columns

**Header Styling:**
- Bold font weight for emphasis
- Slightly larger font size
- Background color for distinction
- Bottom border for separation

**Totals Row Emphasis:**
- Bold text weight
- Top border or double border
- Slightly larger font size
- Background color highlighting

#### WeasyPrint Compatibility Considerations

WeasyPrint is a Python library that converts HTML/CSS to PDF. It has specific limitations that must be considered when designing CSS.

**Supported Layout Methods:**
1. **Tables** - Full support, recommended for layouts
2. **Floats** - Good support for basic layouts
3. **Absolute/Relative Positioning** - Supported with limitations
4. **Display: inline-block** - Supported

**Limited or No Support:**
1. **Flexbox** - Limited support, avoid for critical layouts
2. **CSS Grid** - Not supported, use tables instead
3. **Transform** - Limited support
4. **Animations** - Not applicable to PDF
5. **Advanced Selectors** - Some CSS3 selectors unsupported

**Best Practices:**
- Use table-based layouts for complex structures
- Prefer floats over flexbox for multi-column layouts
- Test thoroughly with WeasyPrint
- Keep CSS relatively simple
- Use inline-block for simple arrangements
- Avoid cutting-edge CSS features

**Font Handling:**
- Embed fonts or use system fonts
- Specify complete font stack
- Test font rendering in PDF output
- Consider file size with embedded fonts

**Image Handling:**
- Use absolute URLs or file paths
- Optimize image sizes
- Consider resolution for printing
- Test image positioning

#### Color Management for Print

Color handling in PDFs requires careful consideration for both screen viewing and physical printing.

**Screen RGB vs. Print CMYK:**
- Screen displays use RGB color model
- Professional printing uses CMYK
- Some colors don't translate well
- Test in grayscale mode

**Color Selection Guidelines:**
- Use web-safe colors for consistency
- Avoid pure black (#000) - use #333 for better printing
- Ensure sufficient contrast (WCAG guidelines)
- Test colors in grayscale (many print in B&W)

**Contrast Ratios:**
- Text to background: minimum 4.5:1
- Large text: minimum 3:1
- Important information: higher contrast
- Consider colorblind users

**Print-Safe Color Palette Example:**
- Text: #333333 (dark gray, not black)
- Headings: #1a1a1a (very dark gray)
- Borders: #cccccc (light gray)
- Table headers: #f5f5f5 (very light gray background)
- Highlights: #e8f4f8 (light blue, prints as light gray)
- Warnings: #fff4e5 (light orange, prints well)

**Color Preservation:**
```
* {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  color-adjust: exact;
}
```

This ensures colors are preserved in PDF output rather than being optimized for grayscale printing.

#### Typography for PDF Documents

Typography in PDF documents differs from web design due to fixed page dimensions and printing considerations.

**Font Selection:**
- Use web-safe fonts (Arial, Helvetica, Times)
- Or embed custom fonts
- Serif fonts (Times) for body text in formal documents
- Sans-serif fonts (Arial) for modern, clean look
- Monospace fonts (Courier) for codes/numbers

**Font Size Guidelines:**
- Body text: 10-12pt (optimal for A4)
- Headings: 14-18pt
- Subheadings: 12-14pt
- Fine print: 8-9pt (legal notices, footnotes)
- Large display: 20pt+ (net pay amount)

**Line Height (Leading):**
- Body text: 1.4-1.6 (e.g., 1.5)
- Headings: 1.2-1.3 (tighter spacing)
- Tables: 1.3-1.4 (compact for data)
- Optimal readability balance

**Letter Spacing (Tracking):**
- Normal text: 0 (default)
- Headings: slight increase (0.5px-1px)
- ALL CAPS text: increase tracking (1px-2px)
- Improves readability of uppercase text

**Font Weight Usage:**
- Regular (400): Body text
- Medium (500): Subheadings, emphasis
- Bold (700): Headings, totals, important figures
- Light (300): Subtle information (use sparingly)

### Expected Outcome
- Complete CSS stylesheet optimized for PDF generation
- Print-friendly styling with proper page break handling
- Responsive table layouts that don't break awkwardly
- Professional appearance matching payslip mockups
- WeasyPrint-compatible styling (no flexbox/grid)
- Consistent rendering across PDF viewers

### Verification Checklist
- [ ] `payslip_pdf.css` file created in static directory
- [ ] @page rule defines A4 size and margins
- [ ] Print media query configured
- [ ] Base typography defined (fonts, sizes, colors)
- [ ] Payslip container styles configured
- [ ] Table styles with border-collapse implemented
- [ ] Page break controls applied to critical sections
- [ ] Company header section styled
- [ ] Employee information block designed
- [ ] Period information section formatted
- [ ] Earnings table styles created
- [ ] Deductions table styled consistently
- [ ] Summary section prominently designed
- [ ] YTD section formatted compactly
- [ ] Employer contributions styled
- [ ] Footer area configured
- [ ] Responsive table layouts implemented
- [ ] WeasyPrint-specific optimizations applied
- [ ] Color management configured for print
- [ ] Print-specific hiding rules added
- [ ] Tested with sample payslip data
- [ ] Verified no flexbox or grid usage
- [ ] Ensured proper page breaks in multi-page slips

---

## Task 45: Create PayslipGenerator Service Class

### Overview
Create the core PayslipGenerator service class that orchestrates the entire PDF generation workflow. This class encapsulates the business logic for rendering HTML templates, converting to PDF, managing file storage, and handling regeneration scenarios with proper error handling and transaction management.

### Dependencies
- Task 44: PDF CSS styles created
- Task 33-43: HTML templates completed
- WeasyPrint library installed
- Django storage backend configured
- Payslip model exists

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/payroll/` directory
   - Create new directory named `services` if not exists
   - Create `__init__.py` in services directory

2. **Create generator module**
   - Create new file `payslip_generator.py` in services directory
   - This will house the PayslipGenerator class

3. **Add module imports**
   - Import Django template engine components
   - Import WeasyPrint library
   - Import storage backend classes
   - Import Payslip model and related models
   - Import logging for error tracking
   - Import datetime for timestamp handling
   - Import transaction management utilities

4. **Define PayslipGenerator class**
   - Create class with clear docstring
   - Document purpose: orchestrate PDF generation
   - Note usage patterns and dependencies

5. **Implement __init__ method**
   - Accept tenant parameter (or derive from context)
   - Store tenant reference for tenant-aware operations
   - Initialize logger instance
   - Set up storage backend reference
   - Configure template engine

6. **Add template resolution logic**
   - Method to locate correct payslip template
   - Support custom tenant templates
   - Fallback to default template
   - Validate template exists

7. **Create context builder method**
   - Private method `_get_template_context(payslip)`
   - Build comprehensive context dictionary
   - Include company information
   - Include employee details
   - Include period information
   - Include earnings breakdown
   - Include deductions breakdown
   - Include summary calculations
   - Include YTD figures
   - Include employer contributions
   - Format all currency values
   - Format all dates consistently

8. **Implement HTML rendering method**
   - Private method `_render_html(context)`
   - Load Django template
   - Render template with context
   - Handle template rendering errors
   - Return rendered HTML string
   - Log rendering process

9. **Create HTML to PDF conversion method**
   - Private method `_html_to_pdf(html_content)`
   - Use WeasyPrint to convert HTML to PDF
   - Configure PDF metadata (title, author)
   - Handle conversion errors gracefully
   - Return PDF as bytes
   - Log conversion process

10. **Add PDF validation logic**
    - Private method `_validate_pdf(pdf_bytes)`
    - Check PDF is not empty
    - Verify PDF structure basics
    - Optionally validate page count
    - Return validation result

11. **Implement error handling strategy**
    - Create custom exceptions for specific errors
    - TemplateNotFoundError
    - PDFGenerationError
    - StorageError
    - Wrap external library errors
    - Provide meaningful error messages

12. **Add logging infrastructure**
    - Log generation start
    - Log each major step
    - Log success with file size
    - Log errors with full context
    - Use appropriate log levels (INFO, WARNING, ERROR)

13. **Implement transaction management**
    - Use database transactions for state changes
    - Ensure atomic operations
    - Handle rollback scenarios
    - Maintain data consistency

14. **Add caching consideration**
    - Consider caching rendered HTML (optional)
    - Cache template objects
    - Cache company information
    - Optimize repeated generations

15. **Create utility methods**
    - Format currency values consistently
    - Format dates according to locale
    - Generate unique filenames
    - Calculate storage paths

### Service Class Architecture

#### Class Structure Overview

The PayslipGenerator service class follows the Single Responsibility Principle, focusing solely on PDF generation and storage. It coordinates between multiple components: template engine, PDF converter, storage backend, and database models.

**Core Responsibilities:**
1. **Template Rendering** - Convert data to HTML
2. **PDF Conversion** - Transform HTML to PDF bytes
3. **File Storage** - Persist PDFs to storage backend
4. **State Management** - Update payslip records
5. **Error Handling** - Manage failures gracefully

**Class Initialization:**
```
PayslipGenerator(tenant=None):
  - Stores tenant reference
  - Initializes logger
  - Sets up storage backend
  - Configures template engine
```

**Design Patterns:**
- **Service Layer Pattern** - Encapsulates business logic
- **Template Method Pattern** - Defines generation algorithm
- **Strategy Pattern** - Swappable storage backends
- **Factory Pattern** - Creates context objects

#### Method Organization

**Public Methods (External Interface):**
1. `generate(payslip_id)` - Generate PDF, return bytes
2. `save(payslip_id)` - Generate and save to storage
3. `regenerate(payslip_id)` - Update existing PDF

**Private Methods (Internal Implementation):**
1. `_get_template_context(payslip)` - Build context data
2. `_render_html(context)` - Template to HTML
3. `_html_to_pdf(html_content)` - HTML to PDF bytes
4. `_validate_pdf(pdf_bytes)` - Check PDF validity
5. `_generate_filename(payslip)` - Create unique filename
6. `_get_storage_path(payslip)` - Determine save location
7. `_update_payslip_record(payslip, file_path)` - Update model

#### Separation of Concerns

**Data Layer (Models):**
- Payslip model stores metadata
- Handles database persistence
- Manages file field references

**Business Logic Layer (Service):**
- PayslipGenerator orchestrates process
- Implements generation algorithm
- Handles errors and edge cases

**Presentation Layer (Templates):**
- HTML templates define structure
- CSS styles define appearance
- No logic in templates

**Storage Layer (Backend):**
- Handles file persistence
- S3 or filesystem storage
- Abstracted through Django storage API

This separation allows:
- Independent testing of each layer
- Easy swapping of storage backends
- Template changes without code changes
- Clean, maintainable codebase

#### Error Handling Strategy

Comprehensive error handling ensures robust PDF generation with clear failure reporting.

**Error Categories:**

1. **Template Errors**
   - Template not found
   - Template syntax error
   - Missing template variables
   - **Recovery:** Use default template, notify admin

2. **Rendering Errors**
   - Invalid context data
   - Template rendering failure
   - **Recovery:** Log error, return specific error message

3. **PDF Conversion Errors**
   - WeasyPrint conversion failure
   - Invalid HTML structure
   - Missing CSS resources
   - **Recovery:** Log error, save HTML for debugging

4. **Storage Errors**
   - Filesystem write failure
   - S3 upload failure
   - Permission denied
   - **Recovery:** Retry with backoff, fallback storage

5. **Database Errors**
   - Payslip not found
   - Update failure
   - Transaction rollback
   - **Recovery:** Rollback changes, return error

**Exception Hierarchy:**
```
PayslipGenerationError (Base)
├── TemplateNotFoundError
├── TemplateRenderError
├── PDFConversionError
├── StorageError
└── InvalidPayslipError
```

**Error Handling Pattern:**
```
Try:
  - Attempt operation
  - Log progress
Except SpecificError:
  - Log detailed error
  - Clean up resources
  - Raise custom exception with context
Finally:
  - Close resources
  - Update metrics
```

**User-Facing Error Messages:**
- Generic message: "Failed to generate payslip"
- Admin sees: Full error details and stack trace
- User sees: Friendly message with support reference
- Log contains: All context for debugging

#### Transaction Management

Database transactions ensure data consistency during PDF generation, especially when updating payslip records with file paths and generation timestamps.

**Transaction Boundaries:**

**Scenario 1: Generate and Save**
```
Begin Transaction:
  1. Retrieve payslip record
  2. Generate PDF bytes
  3. Save PDF to storage
  4. Update payslip.pdf_file field
  5. Update payslip.generated_at timestamp
  6. Commit transaction
Rollback on any error
```

**Scenario 2: Regenerate Existing**
```
Begin Transaction:
  1. Retrieve existing payslip
  2. Delete old PDF file
  3. Generate new PDF
  4. Save new PDF to storage
  5. Update payslip record
  6. Increment regeneration_count
  7. Commit transaction
Rollback on any error
```

**Atomic Operations:**
- Use Django's `transaction.atomic()` decorator
- All database changes commit together
- Failures rollback all changes
- Maintains referential integrity

**File System Considerations:**
- File operations outside transaction
- Handle orphaned files on rollback
- Cleanup strategy for failed uploads
- Eventual consistency approach

**Best Practices:**
- Keep transactions short
- Avoid long-running operations in transaction
- File I/O before or after transaction
- Use select_for_update() to prevent race conditions

#### Logging Infrastructure

Comprehensive logging provides visibility into PDF generation process, aids debugging, and supports monitoring and alerting.

**Log Levels:**

1. **DEBUG** - Detailed diagnostic information
   - Template context data
   - Rendering steps
   - Configuration values

2. **INFO** - General informational messages
   - Generation started
   - Generation completed
   - File saved successfully

3. **WARNING** - Unexpected but handled situations
   - Template fallback used
   - Regeneration triggered
   - High generation time

4. **ERROR** - Error events with recovery
   - PDF conversion failed
   - Storage error with retry
   - Template rendering error

5. **CRITICAL** - Severe errors requiring attention
   - Storage backend unavailable
   - All retries exhausted
   - Data corruption detected

**Structured Logging Format:**
```
[TIMESTAMP] [LEVEL] [TENANT] [USER] [PAYSLIP_ID] [MESSAGE]
2026-01-24 10:30:45 INFO tenant_001 user_123 PAY-2026-01-001 PDF generation started
2026-01-24 10:30:47 INFO tenant_001 user_123 PAY-2026-01-001 PDF generated (125 KB)
2026-01-24 10:30:48 INFO tenant_001 user_123 PAY-2026-01-001 PDF saved to S3
```

**Context Information:**
- Tenant ID (for multi-tenant systems)
- User ID (who triggered generation)
- Payslip ID (unique identifier)
- Employee ID (for tracking)
- Duration (performance monitoring)
- File size (storage monitoring)

**Log Aggregation:**
- Integrate with logging services (e.g., ELK stack)
- Enable searching and filtering
- Set up alerts for errors
- Create dashboards for monitoring

**Privacy Considerations:**
- Don't log sensitive data (salaries, personal info)
- Use payslip ID instead of employee name
- Redact confidential information
- Comply with data protection regulations

### Expected Outcome
- PayslipGenerator service class created in services directory
- Clean initialization with tenant awareness
- Private helper methods for each generation step
- Public interface methods (generate, save, regenerate)
- Comprehensive error handling with custom exceptions
- Robust logging at appropriate levels
- Transaction management for data consistency
- Well-documented class with clear responsibilities

### Verification Checklist
- [ ] services directory created in payroll app
- [ ] `payslip_generator.py` file created
- [ ] PayslipGenerator class defined
- [ ] `__init__` method implemented with tenant parameter
- [ ] Template resolution logic added
- [ ] `_get_template_context` method created
- [ ] `_render_html` method implemented
- [ ] `_html_to_pdf` method created using WeasyPrint
- [ ] `_validate_pdf` method added
- [ ] Custom exception classes defined
- [ ] Logging infrastructure implemented
- [ ] Transaction management included
- [ ] Utility methods created (format currency, dates)
- [ ] Class docstring comprehensive
- [ ] Method docstrings complete
- [ ] Type hints added (optional but recommended)
- [ ] No hardcoded values (use settings)

---

## Task 46: Implement Generate Single Method

### Overview
Implement the primary `generate()` method that orchestrates the entire PDF generation process for a single payslip. This method retrieves payslip data, renders the HTML template, converts to PDF, validates the output, and returns the PDF as bytes without persisting to storage.

### Dependencies
- Task 45: PayslipGenerator service class created
- Task 44: PDF CSS styles completed
- Task 33-43: HTML templates ready
- Payslip model with all related data accessible

### Instructions

1. **Define generate method signature**
   - Public method `generate(payslip_id)`
   - Accept payslip ID as parameter
   - Return PDF as bytes object
   - Add comprehensive docstring

2. **Add method parameter validation**
   - Validate payslip_id is not None
   - Check payslip_id format/type
   - Raise InvalidPayslipError if invalid

3. **Implement payslip retrieval**
   - Query Payslip model by ID
   - Include tenant filtering (if multi-tenant)
   - Use select_related() for related data
   - Use prefetch_related() for collections
   - Handle DoesNotExist exception
   - Raise PayslipNotFoundError if missing

4. **Add payslip status validation**
   - Check payslip is in appropriate status
   - Verify required data is complete
   - Ensure earnings and deductions exist
   - Validate no processing errors exist
   - Raise InvalidPayslipError if invalid

5. **Build comprehensive context dictionary**
   - Call `_get_template_context(payslip)`
   - Ensure all required context keys present
   - Validate context data structure
   - Log context building completion

6. **Implement HTML rendering**
   - Call `_render_html(context)`
   - Catch template rendering errors
   - Log HTML generation success
   - Optionally save HTML for debugging (development only)

7. **Add HTML validation (optional)**
   - Check HTML is not empty
   - Verify minimum HTML structure
   - Validate required elements present
   - Log validation result

8. **Implement PDF conversion**
   - Call `_html_to_pdf(html_content)`
   - Pass WeasyPrint configuration options
   - Catch PDF conversion errors
   - Wrap errors in PDFConversionError
   - Log PDF generation success

9. **Validate PDF output**
   - Call `_validate_pdf(pdf_bytes)`
   - Check PDF size is reasonable
   - Verify PDF structure basics
   - Raise error if invalid
   - Log validation success

10. **Add performance logging**
    - Record generation start time
    - Calculate total generation duration
    - Log duration for monitoring
    - Warn if generation takes too long

11. **Implement comprehensive error handling**
    - Try-except blocks around each step
    - Catch specific exceptions
    - Re-raise with context information
    - Ensure cleanup on failure
    - Log all errors with details

12. **Add optional caching**
    - Check if PDF already cached
    - Return cached version if fresh
    - Cache new generation result
    - Set appropriate cache timeout
    - Use payslip ID + version as cache key

13. **Implement retry logic for transient failures**
    - Retry PDF conversion if fails
    - Use exponential backoff
    - Maximum retry attempts (e.g., 3)
    - Log retry attempts
    - Raise error if all retries fail

14. **Add monitoring hooks**
    - Emit metrics for generation count
    - Track success/failure rates
    - Monitor generation duration
    - Alert on high failure rate

15. **Return PDF bytes**
    - Return generated PDF as bytes
    - Ensure proper encoding
    - Add success log message
    - Include file size in log

### Generation Method Workflow

#### Step-by-Step Process Flow

The `generate()` method follows a clear, sequential workflow with proper error handling at each step:

**Step 1: Input Validation**
```
Input: payslip_id
↓
Validate parameter
├── Check not None
├── Check correct type
└── Check format (if applicable)
↓
If invalid → Raise InvalidPayslipError
If valid → Continue
```

**Step 2: Data Retrieval**
```
Query Database:
├── Payslip.objects.get(id=payslip_id)
├── .select_related('employee', 'period', 'department')
├── .prefetch_related('earnings', 'deductions', 'contributions')
└── Filter by tenant (if multi-tenant)
↓
If not found → Raise PayslipNotFoundError
If found → Store payslip object
```

**Step 3: Data Validation**
```
Validate Payslip:
├── Check status is 'processed' or 'approved'
├── Verify employee exists and is active
├── Ensure period is valid
├── Confirm earnings exist
├── Confirm deductions calculated
└── Validate gross_pay and net_pay
↓
If invalid → Raise InvalidPayslipError
If valid → Continue
```

**Step 4: Context Building**
```
Build Context Dictionary:
├── Company information (name, logo, address)
├── Employee details (name, ID, department, designation)
├── Period information (month, year, dates)
├── Earnings list (type, description, amount)
├── Deductions list (type, description, amount)
├── Summary (gross, deductions, net)
├── YTD figures (earnings, deductions, net)
├── Employer contributions (EPF, ETF)
├── Metadata (slip number, generation date)
└── Format all values (currency, dates)
↓
Return context dictionary
```

**Step 5: HTML Rendering**
```
Render Template:
├── Load template (payslip_pdf.html)
├── Apply context dictionary
├── Execute template logic
├── Generate HTML string
└── Handle template errors
↓
If error → Raise TemplateRenderError
If success → Return HTML string
```

**Step 6: PDF Conversion**
```
Convert to PDF:
├── Initialize WeasyPrint HTML object
├── Apply CSS stylesheets
├── Configure PDF metadata
├── Render to PDF bytes
└── Handle conversion errors
↓
If error → Raise PDFConversionError
If success → Return PDF bytes
```

**Step 7: Validation**
```
Validate PDF:
├── Check bytes not empty
├── Verify minimum size (e.g., > 5 KB)
├── Validate PDF header
└── Optional: Check page count
↓
If invalid → Raise PDFValidationError
If valid → Continue
```

**Step 8: Return Result**
```
Return PDF:
├── Log success (file size, duration)
├── Emit metrics (generation count)
├── Update cache (optional)
└── Return bytes to caller
```

#### Performance Considerations

**Optimization Strategies:**

1. **Database Query Optimization**
   - Use `select_related()` for foreign keys (single JOIN)
   - Use `prefetch_related()` for reverse FKs and M2M
   - Minimize number of queries (avoid N+1 problem)
   - Load only required fields (use `only()` or `defer()`)

2. **Template Caching**
   - Cache compiled template objects
   - Reuse across multiple generations
   - Reduces template parsing overhead
   - Significant benefit for batch generation

3. **Context Building Efficiency**
   - Pre-calculate values where possible
   - Cache company information (rarely changes)
   - Format values efficiently (avoid repeated calls)
   - Use list comprehensions for collections

4. **WeasyPrint Performance**
   - WeasyPrint is CPU-intensive
   - Generation typically takes 1-3 seconds per payslip
   - Consider async processing for batches
   - Use caching for repeated requests

5. **Memory Management**
   - PDF bytes held in memory temporarily
   - Large payslips (multi-page) consume more memory
   - Clean up resources after generation
   - Consider streaming for very large PDFs

**Performance Benchmarks:**
- Simple payslip: 1-2 seconds
- Complex payslip (multi-page): 3-5 seconds
- Database query: < 100ms (with optimization)
- HTML rendering: < 200ms
- PDF conversion: 1-3 seconds (WeasyPrint)

**Scaling Considerations:**
- For batch generation: use Celery tasks
- Process multiple payslips in parallel
- Queue management for high volume
- Monitor resource usage (CPU, memory)

#### Error Recovery Strategies

**Retry Logic Implementation:**

Transient failures (network issues, temporary resource unavailability) should trigger automatic retries with exponential backoff.

**Retry Configuration:**
```
max_retries = 3
base_delay = 1 second
backoff_multiplier = 2

Attempt 1: If fails, wait 1 second
Attempt 2: If fails, wait 2 seconds  
Attempt 3: If fails, wait 4 seconds
Attempt 4: Raise error
```

**Retryable Errors:**
- PDF conversion timeouts
- Temporary storage unavailability
- Database connection issues
- External service timeouts

**Non-Retryable Errors:**
- Invalid payslip data
- Template syntax errors
- Missing required fields
- Permission denied

**Fallback Strategies:**

1. **Template Fallback**
   - If custom template fails → use default template
   - If default fails → use minimal template
   - Always generate some output

2. **Partial Data Handling**
   - If optional data missing → omit section
   - If required data missing → show placeholder
   - Log data issues for admin review

3. **Graceful Degradation**
   - If logo unavailable → skip logo
   - If YTD data missing → omit YTD section
   - Generate payslip with available data

4. **Error Notification**
   - Log error with full context
   - Notify system administrators
   - Queue for manual review
   - Provide user-friendly error message

#### Return Value and Usage

**Return Type:**
```
bytes object containing PDF data
```

**Usage Patterns:**

**Pattern 1: Direct Download**
```
generator = PayslipGenerator(tenant=request.tenant)
pdf_bytes = generator.generate(payslip_id)

response = HttpResponse(pdf_bytes, content_type='application/pdf')
response['Content-Disposition'] = 'attachment; filename="payslip.pdf"'
return response
```

**Pattern 2: Email Attachment**
```
generator = PayslipGenerator(tenant=request.tenant)
pdf_bytes = generator.generate(payslip_id)

email = EmailMessage(
    subject='Your Payslip',
    body='Please find attached your payslip.',
    to=[employee.email],
)
email.attach('payslip.pdf', pdf_bytes, 'application/pdf')
email.send()
```

**Pattern 3: Preview**
```
generator = PayslipGenerator(tenant=request.tenant)
pdf_bytes = generator.generate(payslip_id)

# Display in browser
response = HttpResponse(pdf_bytes, content_type='application/pdf')
response['Content-Disposition'] = 'inline; filename="payslip.pdf"'
return response
```

**Pattern 4: Storage (see Task 47)**
```
generator = PayslipGenerator(tenant=request.tenant)
file_path = generator.save(payslip_id)  # Uses generate() internally
```

**Bytes Object Characteristics:**
- Immutable byte sequence
- Can be written to file
- Can be stored in database (not recommended for large PDFs)
- Can be transmitted over network
- Can be converted to base64 for API responses

### Expected Outcome
- Fully functional `generate()` method that returns PDF bytes
- Comprehensive error handling with specific exceptions
- Performance logging and monitoring
- Optional caching for repeated requests
- Retry logic for transient failures
- Clean, maintainable code following best practices

### Verification Checklist
- [ ] `generate(payslip_id)` method signature defined
- [ ] Parameter validation implemented
- [ ] Payslip retrieval with select_related/prefetch_related
- [ ] Payslip status validation added
- [ ] Context building via `_get_template_context`
- [ ] HTML rendering via `_render_html`
- [ ] HTML validation (optional) implemented
- [ ] PDF conversion via `_html_to_pdf`
- [ ] PDF validation implemented
- [ ] Performance logging added (start time, duration)
- [ ] Comprehensive error handling (try-except blocks)
- [ ] Optional caching implemented
- [ ] Retry logic for transient failures
- [ ] Monitoring hooks added
- [ ] Returns PDF bytes correctly
- [ ] Method docstring complete
- [ ] Unit tests created for method
- [ ] Integration tests with real payslip data
- [ ] Error scenarios tested
- [ ] Performance benchmarked

---

## Task 47: Implement Save PDF Method

### Overview
Implement the `save()` method that generates a PDF and persists it to the configured storage backend (filesystem or S3). This method handles file naming, storage path determination, file upload, and updates the payslip record with the file reference and metadata.

### Dependencies
- Task 46: Generate single method implemented
- Django storage backend configured (FileSystemStorage or S3)
- Payslip model has pdf_file field (FileField)
- File storage permissions configured

### Instructions

1. **Define save method signature**
   - Public method `save(payslip_id, force=False)`
   - Accept payslip_id parameter
   - Accept optional force parameter (regenerate existing)
   - Return file path or URL
   - Add comprehensive docstring

2. **Implement parameter validation**
   - Validate payslip_id not None
   - Check force parameter is boolean
   - Raise InvalidPayslipError if invalid

3. **Check for existing PDF**
   - Query payslip record
   - Check if pdf_file field already populated
   - If exists and force=False → return existing path
   - If exists and force=True → proceed with regeneration
   - Log decision

4. **Generate PDF using generate() method**
   - Call `self.generate(payslip_id)`
   - Catch generation errors
   - Re-raise with context
   - Log generation completion

5. **Implement filename generation**
   - Create private method `_generate_filename(payslip)`
   - Build filename from payslip data
   - Format: `payslip_{slip_number}_{employee_id}.pdf`
   - Example: `payslip_PAY-2026-01-001_EMP-0123.pdf`
   - Ensure filename is filesystem-safe
   - Remove special characters
   - Replace spaces with underscores

6. **Determine storage path**
   - Create private method `_get_storage_path(payslip)`
   - Build hierarchical path structure
   - Format: `payslips/{tenant_id}/{year}/{month}/{filename}`
   - Example: `payslips/tenant_001/2026/01/payslip_PAY-2026-01-001_EMP-0123.pdf`
   - Create date-based organization
   - Support tenant isolation

7. **Handle file deletion for regeneration**
   - If existing file, delete old file
   - Use storage backend's delete() method
   - Handle delete errors gracefully
   - Log deletion (don't fail if delete fails)
   - Orphaned files cleanup (background task)

8. **Save PDF to storage backend**
   - Use Django's storage API
   - Create ContentFile from PDF bytes
   - Call storage.save(path, content)
   - Handle storage errors (disk full, S3 unavailable)
   - Retry on transient failures
   - Log save success with file size

9. **Update payslip record with file reference**
   - Use database transaction
   - Update payslip.pdf_file field
   - Update payslip.generated_at timestamp
   - Update payslip.file_size (optional)
   - Increment regeneration_count (if regenerating)
   - Save payslip model
   - Handle save errors
   - Rollback on failure

10. **Implement atomic operation**
    - Wrap file save and DB update in transaction
    - If file save succeeds but DB update fails:
      - Log error
      - Delete uploaded file
      - Rollback transaction
    - Ensure consistency

11. **Add storage backend abstraction**
    - Support multiple storage backends
    - FileSystemStorage for local/development
    - S3Boto3Storage for production
    - Get storage from Django settings
    - Test storage availability

12. **Implement URL generation**
    - Generate accessible URL for file
    - For filesystem: relative path
    - For S3: pre-signed URL (temporary) or public URL
    - Return URL to caller
    - Handle URL generation errors

13. **Add file size validation**
    - Check PDF size is reasonable
    - Maximum size limit (e.g., 10 MB)
    - Minimum size check (e.g., 5 KB)
    - Log warning if unusually large
    - Raise error if exceeds maximum

14. **Implement progress callback (optional)**
    - For large files or batch processing
    - Callback function for upload progress
    - Update progress indicator
    - Support async processing

15. **Add comprehensive logging**
    - Log file generation start
    - Log filename and path
    - Log storage backend used
    - Log file size
    - Log URL generation
    - Log completion with timing

### File Storage Strategy

#### Storage Backend Options

Django provides flexible storage backends for file management. Choose based on infrastructure and scaling needs.

**1. FileSystemStorage (Default)**

**Characteristics:**
- Stores files on local filesystem
- Simple configuration
- Fast for development
- Direct file access
- No external dependencies

**Use Cases:**
- Development environment
- Single-server deployments
- Small-scale applications
- Internal systems with limited users

**Configuration:**
```python
# settings.py
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
```

**Advantages:**
- Simple setup
- No additional costs
- Fast local access
- Easy debugging (direct file inspection)

**Disadvantages:**
- Not suitable for multi-server deployments
- No automatic backups
- Scaling limitations
- Manual backup management required

**2. S3Boto3Storage (AWS S3)**

**Characteristics:**
- Stores files in Amazon S3
- Highly scalable
- Distributed access
- Built-in redundancy
- Pay-per-use pricing

**Use Cases:**
- Production environments
- Multi-server deployments
- High availability requirements
- Large file storage needs
- Global distribution

**Configuration:**
```python
# settings.py
AWS_ACCESS_KEY_ID = 'your-access-key'
AWS_SECRET_ACCESS_KEY = 'your-secret-key'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
AWS_S3_REGION_NAME = 'ap-south-1'  # Mumbai
AWS_DEFAULT_ACL = 'private'
AWS_S3_FILE_OVERWRITE = False
AWS_S3_SIGNATURE_VERSION = 's3v4'

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

**Advantages:**
- Infinite scalability
- Automatic backups (versioning)
- CDN integration
- High availability (99.99%)
- Disaster recovery
- No server maintenance

**Disadvantages:**
- Additional costs
- Network latency
- Requires AWS account
- More complex setup

**3. Alternative Storage Options**

- **Azure Blob Storage** - Microsoft Azure
- **Google Cloud Storage** - Google Cloud Platform
- **MinIO** - Self-hosted S3-compatible storage
- **Ceph** - Open-source distributed storage

#### Directory Structure and Organization

A well-organized directory structure facilitates file management, searching, and maintenance.

**Recommended Structure:**
```
media/
└── payslips/
    └── {tenant_id}/
        └── {year}/
            └── {month}/
                ├── payslip_PAY-2026-01-001_EMP-0123.pdf
                ├── payslip_PAY-2026-01-002_EMP-0124.pdf
                └── payslip_PAY-2026-01-003_EMP-0125.pdf
```

**Path Components:**

1. **Root: media/payslips/**
   - Segregates payslips from other media
   - Easy to apply specific permissions
   - Simplifies backup strategies

2. **Tenant ID: {tenant_id}/**
   - Isolates data between tenants
   - Enables per-tenant storage limits
   - Simplifies tenant deletion
   - Required for multi-tenant systems

3. **Year: {year}/**
   - Organizes by tax/fiscal year
   - Facilitates year-end processing
   - Enables year-based archival
   - Example: 2026/

4. **Month: {month}/**
   - Groups monthly payslips
   - Aligns with payroll periods
   - Simplifies monthly reports
   - Example: 01/ (January)

5. **Filename: payslip_{slip_number}_{employee_id}.pdf**
   - Unique identifier (slip_number)
   - Employee reference (employee_id)
   - Extension (.pdf)
   - Example: payslip_PAY-2026-01-001_EMP-0123.pdf

**Benefits:**
- Easy navigation and browsing
- Efficient searching (by date, tenant)
- Natural archival strategy (by year/month)
- Prevents directory bloat (thousands of files in one directory)
- Supports regulatory compliance (date-based retention)

**Alternative Structures:**

**By Employee (use if frequent employee-based access):**
```
media/payslips/{tenant_id}/{employee_id}/{year}/{month}/payslip.pdf
```

**By Department (use if department-level access control):**
```
media/payslips/{tenant_id}/{department}/{year}/{month}/payslip_{employee_id}.pdf
```

#### Filename Generation Strategy

Filenames must be unique, descriptive, and filesystem-safe across various operating systems.

**Filename Format:**
```
payslip_{slip_number}_{employee_id}.pdf
```

**Components:**

1. **Prefix: "payslip_"**
   - Identifies file type
   - Distinguishes from other documents
   - Aids in searching/filtering

2. **Slip Number: {slip_number}**
   - Unique identifier for payslip
   - Example: PAY-2026-01-001
   - Ensures uniqueness
   - Traceable in system

3. **Employee ID: {employee_id}**
   - Links to employee
   - Aids in employee-based searches
   - Example: EMP-0123
   - Additional uniqueness guarantee

4. **Extension: .pdf**
   - Indicates file format
   - Required for proper handling

**Character Safety:**
- Replace spaces with underscores: `_`
- Remove special characters: `/ \ : * ? " < > |`
- Keep alphanumeric: `A-Z a-z 0-9`
- Keep hyphens and underscores: `- _`
- Lowercase for consistency (optional)

**Example Transformations:**
```
PAY-2026-01-001 → PAY-2026-01-001 (no change)
EMP 0123 → EMP_0123 (space to underscore)
EMP/0123 → EMP_0123 (slash to underscore)
EMP#0123 → EMP_0123 (special char removed)
```

**Length Considerations:**
- Keep reasonable length (< 255 characters)
- Most filesystems support 255 char filenames
- Full path length limits vary (4096 on Linux, 260 on Windows)
- Shorten if necessary (abbreviate slip number)

**Collision Handling:**
- Slip number should be unique (enforced at DB level)
- If collision detected: append timestamp
- Example: `payslip_PAY-2026-01-001_EMP-0123_20260124103045.pdf`
- Log collision for investigation

#### File Access and Security

**Access Control Strategies:**

1. **Private Files (Recommended for Payslips)**
   - Files not publicly accessible
   - Require authentication to access
   - Server generates temporary URLs
   - URLs expire after time period

**Implementation with S3:**
```python
def get_payslip_url(payslip):
    # Generate pre-signed URL (valid for 1 hour)
    url = payslip.pdf_file.storage.url(
        payslip.pdf_file.name,
        expire=3600  # 1 hour
    )
    return url
```

**Benefits:**
- Sensitive salary data protected
- Prevents unauthorized access
- URLs expire automatically
- Audit trail of access

2. **Public Files (Not Recommended for Payslips)**
   - Files publicly accessible via URL
   - No authentication required
   - Permanent URLs
   - Use for non-sensitive documents only

**Permission Levels:**

**File-Level Permissions:**
- Owner (employee): Full access to own payslips
- Manager: Access to team member payslips
- HR: Access to all payslips
- Admin: Full access and management
- Auditor: Read-only access

**Implementation:**
- Check permissions in view before serving file
- Use Django's permission system
- Log all file access attempts
- Deny access by default

**Django View Example:**
```
@login_required
def download_payslip(request, payslip_id):
    payslip = get_object_or_404(Payslip, id=payslip_id)
    
    # Check permissions
    if not (payslip.employee.user == request.user or 
            request.user.has_perm('payroll.view_all_payslips')):
        raise PermissionDenied
    
    # Generate URL or serve file
    return redirect(payslip.pdf_file.url)
```

**S3 Bucket Policies:**
- Block public access to bucket
- Use IAM roles for server access
- Enable versioning for recovery
- Enable access logging
- Set lifecycle policies for archival

#### Storage Monitoring and Maintenance

**Capacity Monitoring:**
- Track total storage usage
- Monitor growth rate
- Set alerts for thresholds
- Plan capacity expansion

**Metrics to Track:**
- Total file count
- Total storage size
- Average file size
- Storage growth per month
- Failed uploads count

**Cleanup Strategies:**

1. **Archival Policy**
   - Move old payslips to archive storage
   - After 2-3 years → move to cold storage
   - After 7 years → delete (check legal requirements)
   - Use S3 lifecycle policies for automation

2. **Orphaned File Detection**
   - Files in storage but not in database
   - Database records without files
   - Regular audit process
   - Automated cleanup jobs

3. **Temporary File Cleanup**
   - Failed upload cleanup
   - Staging area cleanup
   - Cache cleanup

**Backup Strategy:**
- Regular automated backups
- Test restore procedures
- Offsite backup storage
- Retention policy alignment
- Version control (S3 versioning)

### Expected Outcome
- Fully functional `save()` method that persists PDFs to storage
- Intelligent filename generation with tenant and date organization
- Support for multiple storage backends (filesystem and S3)
- Atomic operations ensuring database and file consistency
- Proper error handling and rollback on failures
- File access URLs generated correctly
- Comprehensive logging of save operations

### Verification Checklist
- [ ] `save(payslip_id, force=False)` method signature defined
- [ ] Parameter validation implemented
- [ ] Existing PDF check implemented
- [ ] Calls `generate()` method internally
- [ ] `_generate_filename` method created
- [ ] `_get_storage_path` method created
- [ ] File deletion for regeneration implemented
- [ ] PDF saved to storage using Django storage API
- [ ] Payslip record updated with file reference
- [ ] Transaction wrapping for atomic operation
- [ ] Storage backend abstraction implemented
- [ ] URL generation implemented
- [ ] File size validation added
- [ ] Comprehensive logging added
- [ ] Method docstring complete
- [ ] Unit tests for save method
- [ ] Integration tests with storage backends
- [ ] Error scenarios tested (storage full, permissions)
- [ ] Verified works with FileSystemStorage
- [ ] Verified works with S3Boto3Storage

---

## Task 48: Implement Regenerate Method

### Overview
Implement the `regenerate()` method that handles updating existing payslip PDFs when payslip data changes. This method ensures old files are properly handled, tracks regeneration history, updates timestamps, and maintains audit trails for compliance and debugging purposes.

### Dependencies
- Task 47: Save PDF method implemented
- Task 46: Generate method working correctly
- Payslip model has regeneration tracking fields
- Audit logging system configured (optional)

### Instructions

1. **Define regenerate method signature**
   - Public method `regenerate(payslip_id, reason=None)`
   - Accept payslip_id parameter
   - Accept optional reason string for audit trail
   - Return new file path
   - Add comprehensive docstring

2. **Implement parameter validation**
   - Validate payslip_id not None
   - Validate reason is string or None
   - Limit reason length (e.g., 500 characters)
   - Raise InvalidPayslipError if invalid

3. **Retrieve existing payslip**
   - Query Payslip model by ID
   - Include tenant filtering
   - Use select_for_update() to prevent race conditions
   - Handle DoesNotExist exception
   - Raise PayslipNotFoundError if missing

4. **Validate regeneration eligibility**
   - Check payslip status allows regeneration
   - Verify payslip is not locked (if locking mechanism exists)
   - Check user permissions (via context)
   - Ensure data has actually changed (optional optimization)
   - Log validation result

5. **Store old file reference**
   - Capture existing pdf_file path
   - Store old file URL for backup
   - Record old file size
   - Prepare for deletion or archival

6. **Implement file archival strategy (optional)**
   - Option 1: Delete old file immediately
   - Option 2: Archive old file with version suffix
   - Option 3: Keep old file temporarily (background cleanup)
   - Configure via settings
   - Log archival decision

7. **Create audit log entry**
   - Record regeneration attempt
   - Timestamp
   - User who triggered (if available)
   - Reason provided
   - Old file reference
   - Status (pending)

8. **Call save method with force=True**
   - Use `self.save(payslip_id, force=True)`
   - This generates new PDF and saves it
   - Handles file replacement
   - Updates payslip record
   - Catch and handle errors

9. **Update regeneration metadata**
   - Increment payslip.regeneration_count
   - Update payslip.last_regenerated_at timestamp
   - Store regeneration_reason (if field exists)
   - Update audit log to success status
   - Save payslip model

10. **Implement transaction management**
    - Wrap entire process in database transaction
    - Use select_for_update() to lock payslip
    - Commit on success
    - Rollback on failure
    - Ensure atomic operation

11. **Add old file cleanup**
    - After successful regeneration
    - Delete or archive old file
    - Handle deletion errors gracefully
    - Don't fail regeneration if cleanup fails
    - Log cleanup status

12. **Implement notification mechanism (optional)**
    - Notify employee of regeneration
    - Send email with new payslip
    - Create system notification
    - Log notification sent

13. **Add regeneration limit check**
    - Check regeneration_count
    - Warn if unusually high (e.g., > 5)
    - Log warning for investigation
    - Optionally require admin approval

14. **Implement comparison logging (optional)**
    - Compare old and new data
    - Log what changed
    - Aids troubleshooting
    - Supports audit requirements

15. **Return result and log completion**
    - Return new file path or URL
    - Log regeneration success
    - Include duration
    - Update metrics (regeneration count)

### Regeneration Triggers

Understanding when and why payslips need regeneration helps design robust regeneration logic and prevents unnecessary operations.

**Common Regeneration Scenarios:**

**1. Data Correction**
- **Trigger:** Employee data corrected after initial generation
- **Examples:**
  - Salary amount updated
  - Deduction calculation error fixed
  - Bonus added retroactively
  - Tax calculation corrected
- **Urgency:** High (affects payment)
- **Notification:** Required (employee must know)

**2. Template Updates**
- **Trigger:** Payslip template changed
- **Examples:**
  - Logo updated
  - Company information changed
  - Layout improvements
  - Branding refresh
- **Urgency:** Low (cosmetic change)
- **Notification:** Not required
- **Batch Operation:** Can regenerate all historical payslips

**3. Regulatory Compliance**
- **Trigger:** New reporting requirements
- **Examples:**
  - Tax law changes
  - Labor department requirements
  - New mandatory fields
  - Format changes
- **Urgency:** Medium to High
- **Notification:** May be required
- **Scope:** May affect multiple periods

**4. Bug Fixes**
- **Trigger:** PDF generation bug discovered
- **Examples:**
  - Calculation display error
  - Rendering issue
  - Missing information
  - Incorrect formatting
- **Urgency:** High
- **Notification:** Depends on impact
- **Scope:** All affected payslips

**5. Employee Request**
- **Trigger:** Employee reports issue with payslip
- **Examples:**
  - PDF won't open
  - Information unclear
  - Formatting problem
  - Missing details
- **Urgency:** Medium
- **Notification:** Required (resolution confirmation)

**6. Audit Requirements**
- **Trigger:** Audit or compliance check
- **Examples:**
  - Auditor needs updated format
  - Compliance verification
  - Historical data review
  - Legal proceedings
- **Urgency:** Medium
- **Notification:** Not required

**Regeneration Decision Matrix:**

| Trigger | Regenerate? | Batch? | Notify Employee? | Archive Old? |
|---------|-------------|--------|------------------|--------------|
| Data correction | Yes | No | Yes | Yes |
| Template update | Optional | Yes | No | No |
| Regulatory compliance | Yes | Yes | Maybe | Yes |
| Bug fix | Yes | Yes | Maybe | Yes |
| Employee request | Yes | No | Yes | Yes |
| Audit requirement | Yes | Maybe | No | Yes |

### Transaction Management and Locking

Regeneration involves multiple operations that must succeed or fail together. Proper transaction management and locking prevent data inconsistencies and race conditions.

**Race Condition Scenario:**
```
User A: Starts regenerating payslip #123
User B: Simultaneously starts regenerating payslip #123

Without locking:
- Both read same old file reference
- Both generate new PDFs
- Both try to save
- One overwrites the other
- Audit trail broken
- Regeneration count incorrect
```

**Solution: Database Locking**

**select_for_update() Usage:**
```python
with transaction.atomic():
    # Lock the payslip row for update
    payslip = Payslip.objects.select_for_update().get(id=payslip_id)
    
    # Other processes wait here until lock released
    # Perform regeneration
    # ...
    
    # Lock released on transaction commit
```

**Lock Behavior:**
- Exclusive lock on database row
- Other transactions wait
- Prevents concurrent modifications
- Released on commit or rollback
- Timeout after configured period

**Transaction Boundaries:**

**Full Regeneration Transaction:**
```
BEGIN TRANSACTION
├── SELECT ... FOR UPDATE (lock payslip)
├── Validate eligibility
├── Create audit log (pending)
├── Generate new PDF (outside transaction - file I/O)
├── Delete old file (outside transaction - file I/O)
├── Save new file (outside transaction - file I/O)
├── Update payslip.pdf_file
├── Increment regeneration_count
├── Update last_regenerated_at
├── Update audit log (success)
└── COMMIT (release lock)

On error: ROLLBACK (release lock)
```

**File Operations Outside Transaction:**
- File I/O is slow
- Holding lock during I/O blocks other users
- Generate PDF before or after transaction
- Trade-off: consistency vs. performance

**Optimized Approach:**
```
1. Generate new PDF (no lock, no transaction)
2. BEGIN TRANSACTION
3.   SELECT ... FOR UPDATE (lock)
4.   Validate (quick)
5.   Update references (quick)
6.   Update metadata (quick)
7. COMMIT (release lock)
8. Delete old file (after commit, no lock)
```

**Handling Long-Running Operations:**
- Keep transactions short
- Release locks quickly
- File operations outside transaction
- Accept eventual consistency for file cleanup

**Deadlock Prevention:**
- Always lock payslips in same order (by ID)
- Keep transactions short
- Use timeouts on locks
- Implement retry logic

### Audit Trail and Versioning

Maintaining comprehensive audit trails for payslip regenerations supports compliance, debugging, and transparency.

**Audit Log Data Model:**

**RegenerationLog Model Fields:**
```
- id: Primary key
- payslip: Foreign key to Payslip
- timestamp: When regeneration occurred
- user: Who triggered regeneration (nullable)
- reason: Text explanation
- old_file_path: Reference to replaced file
- new_file_path: Reference to new file
- old_file_size: Size of old PDF
- new_file_size: Size of new PDF
- status: pending/success/failed
- error_message: If failed, error details
- duration_ms: How long regeneration took
- ip_address: Request source (if web request)
- user_agent: Browser/client info
```

**Audit Log Usage:**

**1. Compliance and Legal**
- Prove when changes were made
- Track who made changes
- Justify retroactive corrections
- Support audit inquiries

**2. Debugging**
- Investigate why payslip was regenerated
- Track frequency of regenerations
- Identify problematic payslips
- Analyze failure patterns

**3. Analytics**
- Regeneration frequency metrics
- Average regeneration time
- Failure rate tracking
- Most common reasons

**4. User Communication**
- Explain to employees why payslip changed
- Provide history of changes
- Build trust through transparency

**Audit Log Creation:**
```python
# Before regeneration
log = RegenerationLog.objects.create(
    payslip=payslip,
    user=request.user if request else None,
    reason=reason,
    old_file_path=payslip.pdf_file.name,
    old_file_size=payslip.pdf_file.size,
    status='pending',
    timestamp=timezone.now(),
)

try:
    # Regeneration process
    new_path = self.save(payslip_id, force=True)
    
    # Update log on success
    log.status = 'success'
    log.new_file_path = new_path
    log.new_file_size = payslip.pdf_file.size
    log.duration_ms = (timezone.now() - log.timestamp).total_seconds() * 1000
    log.save()
    
except Exception as e:
    # Update log on failure
    log.status = 'failed'
    log.error_message = str(e)
    log.save()
    raise
```

**File Versioning Strategies:**

**Option 1: No Versioning (Simple)**
- Delete old file immediately
- Only keep current version
- Pros: Simple, saves storage
- Cons: Can't recover old version

**Option 2: Version Suffix Archival**
```
Original: payslip_PAY-2026-01-001_EMP-0123.pdf
Version 1: payslip_PAY-2026-01-001_EMP-0123_v1_20260124103045.pdf
Version 2: payslip_PAY-2026-01-001_EMP-0123_v2_20260125140530.pdf
Current: payslip_PAY-2026-01-001_EMP-0123.pdf (latest)
```
- Pros: Can review history, recover old versions
- Cons: Increased storage usage

**Option 3: Separate Archive Directory**
```
Current: payslips/tenant_001/2026/01/payslip_PAY-2026-01-001_EMP-0123.pdf
Archive: payslips/tenant_001/2026/01/archive/payslip_PAY-2026-01-001_EMP-0123_v1.pdf
```
- Pros: Clean current directory, preserved history
- Cons: More complex structure

**Option 4: S3 Versioning**
- Enable S3 versioning on bucket
- Automatic version management
- Access via version ID
- Pros: Automatic, reliable
- Cons: Requires S3, increased costs

**Recommended Approach:**
- Development: No versioning (simple)
- Production: S3 versioning or archive directory
- Keep versions for 30-90 days
- Automatic cleanup of old versions

### Batch Regeneration Considerations

Regenerating multiple payslips (e.g., after template update) requires special handling for performance and reliability.

**Batch Regeneration Scenarios:**

**1. Template Update**
- All payslips for all employees
- All periods or specific period
- Typically 100s to 1000s of payslips

**2. Bug Fix**
- All affected payslips
- Specific date range
- May span multiple periods

**3. Compliance Update**
- Specific year or quarter
- All employees
- May be mandated by law

**Batch Processing Strategies:**

**Option 1: Synchronous Loop (Simple, Small Batches)**
```python
def batch_regenerate(payslip_ids, reason):
    results = {'success': [], 'failed': []}
    
    for payslip_id in payslip_ids:
        try:
            generator.regenerate(payslip_id, reason=reason)
            results['success'].append(payslip_id)
        except Exception as e:
            results['failed'].append((payslip_id, str(e)))
            # Continue with next payslip
    
    return results
```
- Pros: Simple, easy to implement
- Cons: Slow, blocks request, no parallelism
- Use for: < 50 payslips

**Option 2: Celery Task Queue (Recommended for Production)**
```python
@shared_task
def regenerate_payslip_task(payslip_id, reason):
    generator = PayslipGenerator()
    return generator.regenerate(payslip_id, reason=reason)

def batch_regenerate_async(payslip_ids, reason):
    for payslip_id in payslip_ids:
        regenerate_payslip_task.delay(payslip_id, reason)
    
    # Returns immediately, processing in background
```
- Pros: Async, scalable, fault-tolerant
- Cons: More complex setup
- Use for: > 50 payslips, production

**Option 3: Batch API Method**
```python
def regenerate_batch(payslip_ids, reason):
    # Process in chunks
    chunk_size = 10
    for i in range(0, len(payslip_ids), chunk_size):
        chunk = payslip_ids[i:i+chunk_size]
        
        # Process chunk with progress tracking
        for payslip_id in chunk:
            self.regenerate(payslip_id, reason=reason)
        
        # Optional: brief pause between chunks
        time.sleep(0.1)
```
- Pros: Progress tracking, controlled load
- Cons: Still synchronous
- Use for: Medium batches (50-200)

**Performance Optimization:**

**1. Database Query Optimization**
- Prefetch all payslips at once
- Use select_related for foreign keys
- Avoid N+1 queries

**2. Connection Pooling**
- Reuse database connections
- Reuse S3 connections
- Configure pool sizes

**3. Parallel Processing**
- Multiple Celery workers
- Process different tenants in parallel
- Respect database connection limits

**4. Progress Tracking**
- Track completion percentage
- Store in cache or database
- Provide user feedback
- Enable cancellation

**5. Error Handling**
- Continue on individual failures
- Collect all errors
- Provide summary report
- Optionally retry failed items

**Batch Regeneration Best Practices:**
- Always use async processing for large batches
- Implement progress tracking
- Provide estimated completion time
- Allow cancellation
- Send completion notification
- Generate summary report (success/failed counts)

### Expected Outcome
- Fully functional `regenerate()` method for updating existing PDFs
- Proper handling of old file removal or archival
- Comprehensive audit trail of regenerations
- Transaction management preventing race conditions
- Support for both single and batch regeneration
- Regeneration metadata tracked (count, timestamp, reason)

### Verification Checklist
- [ ] `regenerate(payslip_id, reason=None)` method signature defined
- [ ] Parameter validation implemented
- [ ] Payslip retrieval with select_for_update()
- [ ] Regeneration eligibility validation
- [ ] Old file reference stored before regeneration
- [ ] File archival strategy implemented
- [ ] Audit log entry creation
- [ ] Calls `save(payslip_id, force=True)` internally
- [ ] Regeneration metadata updated (count, timestamp)
- [ ] Transaction wrapping entire process
- [ ] Old file cleanup implemented
- [ ] Regeneration limit check added
- [ ] Method docstring complete
- [ ] Unit tests for regenerate method
- [ ] Integration tests with real data
- [ ] Race condition tests (concurrent regeneration)
- [ ] Audit trail verified
- [ ] Batch regeneration capability tested
- [ ] Performance benchmarked (single and batch)

---

## Summary

This document covered the PDF generation infrastructure for payslip documents:

### Completed Components
- ✅ PDF CSS styles optimized for print media and WeasyPrint
- ✅ PayslipGenerator service class with comprehensive architecture
- ✅ Generate method for creating PDF bytes
- ✅ Save method for persisting PDFs to storage
- ✅ Regenerate method for updating existing payslips

### Key Achievements
1. **Print-Optimized Styling** - CSS with page breaks, responsive tables, WeasyPrint compatibility
2. **Service Architecture** - Clean separation of concerns, error handling, transaction management
3. **Generation Workflow** - Complete pipeline from data to PDF bytes
4. **Storage Strategy** - Flexible backend support (filesystem/S3), organized directory structure
5. **Regeneration Support** - Audit trails, versioning, batch processing capabilities

### Technical Highlights
- **CSS Concepts:** @page rule, print media queries, page break controls, table formatting, WeasyPrint compatibility
- **Service Design:** Template method pattern, comprehensive error handling, logging infrastructure
- **Storage:** Multi-backend support, secure file access, hierarchical organization
- **Audit:** Complete regeneration tracking, versioning strategies, compliance support

### Next Steps
This completes Group C: PDF Generation Engine. Proceed to Group D for API endpoint development and integration testing of the complete payslip generation system.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~980
