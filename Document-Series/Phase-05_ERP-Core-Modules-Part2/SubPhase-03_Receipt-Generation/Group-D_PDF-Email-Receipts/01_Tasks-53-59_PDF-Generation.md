# Tasks 53-59: PDF Generation System

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** D - PDF & Email Receipts  
> **Document:** 01 of 03  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Thermal-Printer-Integration/](../Group-C_Thermal-Printer-Integration/)
- **→ Next Document:** [02_Tasks-60-64_Email-Receipts.md](02_Tasks-60-64_Email-Receipts.md)

---

## Document Overview

This document covers the implementation of PDF receipt generation functionality. It includes creating PDF templates, applying tenant branding, implementing a PDF generation service with metadata support, and providing multiple PDF styles (A4 invoice and thermal-style) with storage capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create PDF receipt template | High | 35 min |
| 54 | Add tenant branding to PDF | Medium | 25 min |
| 55 | Implement PDF generator service | High | 35 min |
| 56 | Add PDF metadata | Low | 15 min |
| 57 | Create A4 invoice-style PDF | Medium | 30 min |
| 58 | Create thermal-style PDF | Medium | 25 min |
| 59 | Add PDF storage | Medium | 25 min |

---

## Task 53: Create PDF Receipt Template

### Overview
Design and implement the foundational PDF receipt template that will serve as the base for all PDF receipt generation. This template should match the thermal receipt layout but be optimized for digital display and printing on standard paper.

### Dependencies
- Group A: Receipt template models are implemented
- Group B: Receipt data calculation logic is available
- Group C: Thermal receipt formatter provides reference structure

### Instructions

1. **Set up PDF generation infrastructure**
   - Install PDF generation library (ReportLab or WeasyPrint)
   - Create `apps/pos/receipts/services/pdf_generator.py` module
   - Add PDF generation dependencies to requirements

2. **Create HTML template structure**
   - Create directory: `apps/pos/receipts/templates/receipts/pdf/`
   - Create base template: `base_receipt.html`
   - Design template with Django template language
   - Structure similar to thermal receipt but styled for PDF

3. **Define template header section**
   - Tenant business name (prominent, centered)
   - Business logo placeholder area
   - Store address and contact information
   - Tax registration numbers (TIN/VAT)
   - Receipt identifier (number and date)

4. **Design transaction details section**
   - Transaction date and time with proper formatting
   - Cashier/salesperson name
   - Terminal/POS identifier
   - Customer name (if provided)
   - Customer email or phone (if available)

5. **Create itemized section layout**
   - Table structure for items
   - Columns: Item name, Quantity, Unit Price, Total
   - Support for item modifiers or notes
   - Clear visual separation between rows
   - Subtotal calculations

6. **Design discount and adjustment section**
   - Item-level discounts display
   - Transaction-level discounts
   - Coupon or promotion details
   - Adjustment reasons and amounts

7. **Create totals section layout**
   - Subtotal before tax
   - Tax breakdown by rate (12% VAT, etc.)
   - Total discounts
   - Final total amount (prominent)
   - Amount tendered
   - Change given

8. **Add payment information section**
   - Payment method(s) used
   - Payment reference numbers
   - Card last 4 digits (if card payment)
   - Split payment details (if applicable)

9. **Design footer section**
   - Thank you message (customizable)
   - Return policy summary
   - Customer support contact
   - Website and social media links
   - QR code placeholder for digital receipt

10. **Implement conditional sections**
    - Show/hide customer info based on availability
    - Display loyalty points only if enabled
    - Show tax details only if applicable
    - Conditionally display discount sections

11. **Add typography and spacing**
    - Select web-safe fonts for consistency
    - Define font sizes for hierarchy (header, body, footer)
    - Set appropriate line spacing for readability
    - Add section separators (lines or spacing)

12. **Implement page layout**
    - Define page margins
    - Set maximum content width
    - Handle page breaks for long receipts
    - Ensure header/footer on each page (if multiple pages)

### Template Structure Reference

```
┌─────────────────────────────────────┐
│         [BUSINESS LOGO]             │
│       BUSINESS NAME                 │
│     123 Main St, Colombo            │
│     +94 11 234 5678                 │
│     TIN: 123456789V                 │
├─────────────────────────────────────┤
│  RECEIPT #: RC-2026-001234          │
│  DATE: 2026-01-23 14:35:22          │
│  CASHIER: Nimal Perera              │
│  TERMINAL: POS-01                   │
├─────────────────────────────────────┤
│  CUSTOMER: Kasun Silva              │
│  EMAIL: kasun@example.com           │
├─────────────────────────────────────┤
│  ITEMS                              │
│  ─────────────────────────────────  │
│  Product Name          Qty × Price  │
│  Tea - 100g Packet     2 × 450.00   │
│                            900.00   │
│  Sugar - 1kg           1 × 180.00   │
│                            180.00   │
│  ─────────────────────────────────  │
│  SUBTOTAL:                1,080.00  │
│  DISCOUNT (10%):           -108.00  │
│  TAX (12% VAT):            116.64   │
│  ─────────────────────────────────  │
│  TOTAL:              Rs. 1,088.64   │
│  TENDERED:           Rs. 1,100.00   │
│  CHANGE:             Rs.    11.36   │
├─────────────────────────────────────┤
│  PAYMENT: Cash                      │
├─────────────────────────────────────┤
│  Thank you for shopping with us!    │
│  Returns within 7 days with receipt │
│  Support: support@store.com         │
│  www.mystore.lk                     │
│  [QR CODE]                          │
└─────────────────────────────────────┘
```

### PDF Generation Library Comparison

| Library | Approach | Best For | Setup Complexity |
|---------|----------|----------|------------------|
| **WeasyPrint** | HTML/CSS to PDF | Template-based design | Medium (requires system deps) |
| **ReportLab** | Programmatic PDF | Full control over layout | Low (pure Python) |
| **xhtml2pdf** | HTML to PDF | Simple HTML templates | Low (pure Python) |
| **wkhtmltopdf** | Headless browser | Complex CSS layouts | High (external binary) |

### Recommended Approach
- **Use WeasyPrint** for HTML template-based generation
- Benefits: Easy styling with CSS, familiar HTML structure
- Alternative: **ReportLab** if system dependencies are a concern

### Expected Outcome
```
apps/pos/receipts/
├── services/
│   └── pdf_generator.py          # PDF generation service (shell)
└── templates/
    └── receipts/
        └── pdf/
            └── base_receipt.html  # Base PDF template
```

### Verification Checklist
- [ ] PDF generation library is installed
- [ ] `pdf_generator.py` module is created
- [ ] Base PDF template HTML file exists
- [ ] Template includes all required sections (header, items, totals, footer)
- [ ] Template uses Django template language for dynamic content
- [ ] Font selections are web-safe and readable
- [ ] Layout is structured with proper spacing
- [ ] Conditional sections are implemented
- [ ] Template matches thermal receipt information content
- [ ] QR code placeholder is included

---

## Task 54: Add Tenant Branding to PDF

### Overview
Implement tenant-specific branding in PDF receipts, including business logo, brand colors, custom fonts, and personalized messaging. This ensures each tenant's receipts reflect their unique brand identity.

### Dependencies
- Task 53: PDF receipt template is created
- Core system: Tenant model with branding settings
- File storage: Logo upload and retrieval system

### Instructions

1. **Extend tenant model for branding settings**
   - Add logo file field (ImageField)
   - Add primary brand color field (HEX color code)
   - Add secondary brand color field
   - Add accent color for highlights
   - Add custom font preference field

2. **Define branding settings structure**
   - Receipt header background color
   - Text color scheme (primary, secondary, muted)
   - Button or link color
   - Footer background color
   - Border and divider color

3. **Implement logo handling**
   - Retrieve logo file from tenant settings
   - Convert logo to appropriate format for PDF (PNG/JPG)
   - Resize logo to fit template dimensions
   - Handle missing logo (use business name as fallback)
   - Center logo in header section

4. **Create branding context builder**
   - Function to collect all branding settings for tenant
   - Merge with default branding values
   - Validate color codes (valid HEX format)
   - Prepare branding dictionary for template context

5. **Apply colors to template**
   - Inject brand colors into CSS styles
   - Use inline styles for email client compatibility
   - Apply primary color to header background
   - Use accent color for totals and highlights
   - Apply secondary color to footer

6. **Implement custom font support**
   - Define allowed font families (web-safe + Google Fonts)
   - Fetch custom fonts if specified
   - Apply font family to template
   - Provide fallback fonts

7. **Add personalization fields**
   - Custom thank you message
   - Custom return policy text
   - Custom footer notes
   - Promotional message area
   - Social media handles (Facebook, Instagram, WhatsApp)

8. **Handle multi-language branding**
   - Support Sinhala business names in fonts that support Unicode
   - Handle Tamil text if needed
   - Ensure font supports local currency symbol (₨)
   - Use appropriate text direction (LTR for English/Sinhala)

9. **Create branding defaults**
   - Define default color palette for tenants without customization
   - Default logo placeholder
   - Default thank you message in English and Sinhala
   - Standard return policy template

10. **Implement branding preview**
    - Admin interface to preview branded receipts
    - Sample receipt with tenant branding applied
    - Before/after comparison view

11. **Add branding validation**
    - Validate logo file size (max 2MB)
    - Validate logo dimensions (min/max width and height)
    - Validate color code formats
    - Ensure contrast for accessibility (text readability)

12. **Cache branding assets**
    - Cache processed logos to reduce file operations
    - Cache branding settings to reduce database queries
    - Invalidate cache when branding settings change

### Branding Settings Structure

| Setting | Type | Purpose | Default |
|---------|------|---------|---------|
| `logo` | ImageField | Business logo | None |
| `primary_color` | CharField(7) | Header background | `#2563EB` (Blue) |
| `secondary_color` | CharField(7) | Footer background | `#1E3A8A` (Dark Blue) |
| `accent_color` | CharField(7) | Highlights, totals | `#10B981` (Green) |
| `text_color` | CharField(7) | Main text | `#1F2937` (Dark Gray) |
| `font_family` | CharField(50) | Custom font | `Arial, sans-serif` |
| `thank_you_message` | TextField | Custom message | "Thank you for your purchase!" |
| `return_policy` | TextField | Policy text | "Returns within 7 days with receipt" |
| `footer_note` | TextField | Additional info | "" |

### Color Application Map

```
┌─────────────────────────────────────┐
│  [PRIMARY_COLOR - Header BG]        │
│  [LOGO] + [TEXT_COLOR - Bus. Name]  │
├─────────────────────────────────────┤
│  [TEXT_COLOR - Receipt Details]     │
│  [ACCENT_COLOR - Section Dividers]  │
├─────────────────────────────────────┤
│  [TEXT_COLOR - Items]               │
│  [ACCENT_COLOR - Total Amount]      │
├─────────────────────────────────────┤
│  [SECONDARY_COLOR - Footer BG]      │
│  [Light text - Footer Info]         │
└─────────────────────────────────────┘
```

### Logo Processing Workflow

```
[Tenant Logo Upload]
         │
         ▼
[Validate Format: PNG/JPG]
         │
         ▼
[Check File Size: Max 2MB]
         │
         ▼
[Validate Dimensions]
         │
         ▼
[Resize to Standard Dimensions]
   (Max width: 300px)
         │
         ▼
[Optimize for PDF]
         │
         ▼
[Store in Media Storage]
         │
         ▼
[Cache Processed Version]
```

### Expected Outcome
```
apps/pos/receipts/
├── services/
│   ├── pdf_generator.py          # Updated with branding support
│   └── branding_service.py       # Branding context builder
└── templates/
    └── receipts/
        └── pdf/
            └── base_receipt.html  # Updated with branding variables
```

### Verification Checklist
- [ ] Tenant model has branding fields
- [ ] Logo upload and retrieval work correctly
- [ ] Branding context builder is implemented
- [ ] Brand colors are applied to template
- [ ] Custom fonts are supported
- [ ] Personalization fields are editable
- [ ] Multi-language text is supported
- [ ] Branding defaults are defined
- [ ] Branding preview is available in admin
- [ ] Logo validation prevents oversized/invalid files
- [ ] Branding assets are cached
- [ ] Missing logo shows fallback (business name)

---

## Task 55: Implement PDF Generator Service

### Overview
Create a comprehensive PDF generator service that converts receipt data into professional PDF documents. This service orchestrates template rendering, branding application, and PDF file creation.

### Dependencies
- Task 53: PDF receipt template exists
- Task 54: Tenant branding system is implemented
- Receipt model: Receipt data is structured and accessible

### Instructions

1. **Create core PDF generator class**
   - Define `PDFGeneratorService` class in `pdf_generator.py`
   - Initialize with WeasyPrint or chosen PDF library
   - Set up configuration for PDF generation

2. **Implement template rendering method**
   - Accept receipt instance as parameter
   - Collect all receipt data (items, totals, payment)
   - Build template context dictionary
   - Render HTML template with context
   - Return rendered HTML string

3. **Create context builder method**
   - Extract receipt header information
   - Format transaction date and time
   - Structure line items with calculations
   - Include discount and tax details
   - Add payment information
   - Include customer details (if available)

4. **Implement branding integration**
   - Fetch tenant branding settings
   - Retrieve tenant logo
   - Apply brand colors to template
   - Include custom messages
   - Handle missing branding gracefully

5. **Create PDF generation method**
   - Accept rendered HTML as input
   - Convert HTML to PDF using library
   - Apply PDF settings (page size, margins)
   - Return PDF as bytes or file object

6. **Implement file naming convention**
   - Format: `receipt_{receipt_number}_{timestamp}.pdf`
   - Example: `receipt_RC-2026-001234_20260123143522.pdf`
   - Ensure filename is filesystem-safe
   - Avoid special characters

7. **Add error handling**
   - Handle template rendering errors
   - Catch PDF generation failures
   - Manage missing data gracefully
   - Log errors with context
   - Return appropriate error responses

8. **Implement currency formatting**
   - Format amounts with LKR symbol (₨)
   - Use proper decimal places (2 decimals)
   - Add thousand separators (1,234.56)
   - Handle negative values (discounts)

9. **Create date/time formatting**
   - Use tenant's timezone (Asia/Colombo)
   - Format date: DD-MM-YYYY or DD/MM/YYYY
   - Format time: HH:MM:SS or HH:MM AM/PM
   - Display receipt age (e.g., "2 hours ago")

10. **Implement QR code generation**
    - Generate QR code for receipt URL
    - Embed QR code image in PDF
    - QR code should link to digital receipt page
    - Include verification token in URL

11. **Add image optimization**
    - Optimize logo size for PDF
    - Convert images to appropriate format
    - Compress images to reduce PDF size
    - Handle image loading failures

12. **Create main generate method**
    - Public method: `generate_pdf(receipt_id)` or `generate_pdf(receipt)`
    - Orchestrate all steps: fetch data, render template, generate PDF
    - Return PDF file object or save to storage
    - Include success/failure status

13. **Implement batch generation support**
    - Method to generate multiple receipts at once
    - Useful for reports or bulk exports
    - Return list of generated PDFs
    - Handle failures gracefully (don't stop on one error)

14. **Add caching for repeated generations**
    - Cache generated PDFs to avoid regeneration
    - Cache key: receipt ID + version hash
    - Check cache before generating
    - Invalidate cache if receipt data changes

### PDF Generator Service Structure

```python
class PDFGeneratorService:
    """
    Service for generating PDF receipts from receipt data.
    """
    
    def __init__(self, receipt=None):
        """Initialize with optional receipt instance."""
        pass
    
    def generate_pdf(self, receipt, style='default'):
        """
        Generate PDF for a receipt.
        Returns PDF as bytes.
        """
        pass
    
    def build_context(self, receipt):
        """
        Build template context from receipt data.
        Returns dictionary with all template variables.
        """
        pass
    
    def apply_branding(self, context, tenant):
        """
        Apply tenant branding to context.
        Returns updated context with branding.
        """
        pass
    
    def render_template(self, template_name, context):
        """
        Render HTML template with context.
        Returns HTML string.
        """
        pass
    
    def html_to_pdf(self, html_string):
        """
        Convert HTML to PDF.
        Returns PDF as bytes.
        """
        pass
    
    def generate_qr_code(self, data):
        """
        Generate QR code image.
        Returns image bytes.
        """
        pass
    
    def format_currency(self, amount):
        """
        Format amount as LKR currency.
        Returns formatted string.
        """
        pass
```

### PDF Generation Workflow

```
[Receive Receipt ID/Instance]
         │
         ▼
[Fetch Receipt from Database]
         │
         ▼
[Load Tenant Branding Settings]
         │
         ▼
[Build Template Context]
  ├─ Receipt data
  ├─ Line items
  ├─ Totals
  ├─ Payment info
  └─ Branding
         │
         ▼
[Generate QR Code]
         │
         ▼
[Render HTML Template]
         │
         ▼
[Convert HTML to PDF]
         │
         ▼
[Apply PDF Settings]
  ├─ Page size
  ├─ Margins
  └─ Metadata
         │
         ▼
[Return PDF Bytes/File]
```

### Error Handling Strategy

| Error Type | Handling | User Impact |
|------------|----------|-------------|
| Receipt not found | Log error, return 404 | "Receipt not found" |
| Template error | Log error, use fallback | Basic PDF generated |
| Branding missing | Use defaults | Generic styled PDF |
| PDF gen failure | Log error, retry once | "PDF generation failed" |
| File save error | Log error, return bytes | In-memory PDF returned |

### Expected Outcome
```
apps/pos/receipts/
└── services/
    ├── pdf_generator.py          # Complete PDF generator service
    └── branding_service.py       # Branding context builder
```

### Verification Checklist
- [ ] `PDFGeneratorService` class is implemented
- [ ] Template rendering method works correctly
- [ ] Context builder includes all receipt data
- [ ] Branding is integrated and applied
- [ ] PDF generation produces valid PDF files
- [ ] File naming convention is consistent
- [ ] Error handling covers all failure points
- [ ] Currency formatting is correct (LKR with proper format)
- [ ] Date/time formatting uses tenant timezone
- [ ] QR code generation and embedding works
- [ ] Image optimization reduces PDF size
- [ ] Main generate method orchestrates all steps
- [ ] Batch generation is supported
- [ ] Caching prevents redundant generation

---

## Task 56: Add PDF Metadata

### Overview
Implement comprehensive PDF metadata that provides document information, improves searchability, and ensures proper PDF standards compliance.

### Dependencies
- Task 55: PDF generator service is implemented

### Instructions

1. **Define metadata structure**
   - Title: Receipt identification
   - Author: Tenant business name
   - Subject: Document purpose
   - Keywords: Searchable terms
   - Creator: Application name
   - Producer: PDF library name
   - Creation date: When PDF was generated
   - Modification date: Same as creation (not modified)

2. **Implement metadata builder method**
   - Create method in PDF generator service
   - Accept receipt instance as parameter
   - Build metadata dictionary
   - Return structured metadata

3. **Set PDF title field**
   - Format: "Receipt {receipt_number} - {business_name}"
   - Example: "Receipt RC-2026-001234 - My Store"
   - Keep concise (max 100 characters)
   - Include receipt identifier for uniqueness

4. **Set PDF author field**
   - Use tenant business name
   - Example: "My Store Pvt Ltd"
   - Fallback to "LankaCommerce Cloud Tenant" if missing

5. **Set PDF subject field**
   - Describe document purpose
   - Example: "Sales Receipt for Customer Purchase"
   - Include transaction type if available
   - Keep descriptive but concise

6. **Add keywords field**
   - Include searchable terms
   - Receipt number
   - Business name
   - Transaction date
   - Customer name (if available)
   - Example: "receipt, RC-2026-001234, My Store, 2026-01-23"

7. **Set creator field**
   - Application identifier
   - Example: "LankaCommerce Cloud v1.0"
   - Include version number
   - Consistent across all PDFs

8. **Set producer field**
   - PDF generation library name
   - Example: "WeasyPrint 60.0" or "ReportLab 3.6.12"
   - Automatically detected from library
   - Include library version

9. **Add creation date**
   - Set to receipt generation timestamp
   - Use ISO 8601 format
   - Include timezone information
   - Example: "2026-01-23T14:35:22+05:30"

10. **Implement metadata injection**
    - Apply metadata during PDF generation
    - Use library-specific metadata API
    - Ensure all fields are populated
    - Validate metadata before applying

11. **Add custom metadata fields**
    - Receipt ID (internal identifier)
    - Tenant ID (for multi-tenant tracking)
    - Receipt amount (for categorization)
    - Language code (en, si, ta)

12. **Create metadata verification utility**
    - Method to read metadata from generated PDF
    - Verify all required fields are present
    - Check metadata correctness
    - Log any missing or incorrect metadata

### Metadata Fields Structure

| Field | Source | Example Value |
|-------|--------|---------------|
| **Title** | Receipt number + Business name | "Receipt RC-2026-001234 - My Store" |
| **Author** | Tenant business name | "My Store Pvt Ltd" |
| **Subject** | Document type | "Sales Receipt for Customer Purchase" |
| **Keywords** | Searchable terms | "receipt, RC-2026-001234, My Store, 2026-01-23, Kasun Silva" |
| **Creator** | Application | "LankaCommerce Cloud v1.0" |
| **Producer** | PDF library | "WeasyPrint 60.0" |
| **Creation Date** | Generation timestamp | "2026-01-23T14:35:22+05:30" |
| **Custom: Receipt ID** | Database ID | "uuid-12345..." |
| **Custom: Tenant ID** | Tenant identifier | "tenant-abc-123" |
| **Custom: Amount** | Total amount | "1088.64" |
| **Custom: Language** | Receipt language | "en" |

### Metadata Builder Method

```python
def build_pdf_metadata(self, receipt):
    """
    Build PDF metadata from receipt data.
    
    Args:
        receipt: Receipt instance
    
    Returns:
        Dictionary with PDF metadata fields
    """
    
    # Extract data from receipt
    tenant = receipt.tenant
    receipt_number = receipt.receipt_number
    creation_date = receipt.created_at
    
    # Build metadata
    metadata = {
        'title': f"Receipt {receipt_number} - {tenant.business_name}",
        'author': tenant.business_name,
        'subject': 'Sales Receipt for Customer Purchase',
        'keywords': self._build_keywords(receipt),
        'creator': f"LankaCommerce Cloud v{settings.APP_VERSION}",
        'producer': self._get_pdf_library_name(),
        'creation_date': creation_date.isoformat(),
        
        # Custom metadata
        'receipt_id': str(receipt.id),
        'tenant_id': str(tenant.id),
        'amount': str(receipt.total_amount),
        'language': receipt.language or 'en',
    }
    
    return metadata
```

### Keywords Building Logic

```
Keywords = [
    "receipt",
    receipt_number,
    tenant.business_name,
    receipt.created_at.strftime("%Y-%m-%d"),
    customer.name (if available),
    transaction_type,
]

Join with ", " separator
Example: "receipt, RC-2026-001234, My Store, 2026-01-23, Kasun Silva, sale"
```

### PDF Library Metadata APIs

**WeasyPrint Approach:**
```python
# WeasyPrint uses PDF metadata in the HTML <meta> tags or via pdfkit
# Metadata is set through the Document's PDF properties
document = HTML(string=html_string)
pdf = document.write_pdf(
    stylesheets=[...],
    presentational_hints=True,
    attachments=[...],
)
# Metadata is set via HTML meta tags or additional processing
```

**ReportLab Approach:**
```python
# ReportLab has direct metadata API
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

c = canvas.Canvas(filename, pagesize=A4)
c.setTitle("Receipt RC-2026-001234 - My Store")
c.setAuthor("My Store Pvt Ltd")
c.setSubject("Sales Receipt")
c.setCreator("LankaCommerce Cloud v1.0")
c.setKeywords(["receipt", "sale", "2026"])
c.save()
```

### Expected Outcome
```
apps/pos/receipts/
└── services/
    └── pdf_generator.py          # Updated with metadata support
                                  # - build_pdf_metadata() method
                                  # - apply_metadata() method
```

### Verification Checklist
- [ ] Metadata structure is defined
- [ ] Metadata builder method is implemented
- [ ] PDF title is descriptive and unique
- [ ] Author field uses business name
- [ ] Subject field describes document purpose
- [ ] Keywords include searchable terms
- [ ] Creator field identifies application
- [ ] Producer field shows PDF library
- [ ] Creation date is accurate and formatted
- [ ] Custom metadata fields are included
- [ ] Metadata is properly injected into PDF
- [ ] Metadata verification utility exists
- [ ] All metadata fields are populated in generated PDFs

---

## Task 57: Create A4 Invoice-Style PDF

### Overview
Design and implement a formal A4-sized invoice-style PDF receipt suitable for business accounting, email attachments, and customer records. This format provides a professional full-page layout.

### Dependencies
- Task 53: Base PDF template exists
- Task 54: Tenant branding is implemented
- Task 55: PDF generator service is functional

### Instructions

1. **Create A4 template file**
   - Create file: `templates/receipts/pdf/a4_invoice.html`
   - Base on standard A4 dimensions (210mm × 297mm)
   - Design for portrait orientation

2. **Define page layout structure**
   - Header section (top 20% of page)
   - Content section (middle 65% of page)
   - Footer section (bottom 15% of page)
   - Set margins: 20mm on all sides

3. **Design professional header**
   - Large logo placement (left or center)
   - Business name in prominent font (24-28pt)
   - Address and contact info (right aligned)
   - Document title: "INVOICE" or "RECEIPT" (large, bold)
   - Receipt number (formatted with prefix)

4. **Create document metadata bar**
   - Receipt number with label
   - Issue date with label
   - Due date (if applicable, usually N/A for receipts)
   - Page number (if multi-page)
   - Grid layout with labeled fields

5. **Design customer information block**
   - Section title: "Bill To" or "Customer Information"
   - Customer name
   - Customer address
   - Customer email
   - Customer phone
   - Box or border around section

6. **Create professional items table**
   - Full-width table with borders
   - Columns: Item #, Description, Qty, Unit Price, Discount, Tax, Total
   - Header row with background color
   - Alternating row colors for readability
   - Right-align numeric columns
   - Bold total column

7. **Add detailed line item information**
   - Item name or SKU
   - Item description or variant
   - Quantity with unit (pcs, kg, etc.)
   - Unit price formatted
   - Line-level discount (if any)
   - Tax rate and amount
   - Line total

8. **Design comprehensive totals section**
   - Right-aligned totals block
   - Subtotal (before discounts and tax)
   - Item discounts total
   - Transaction discounts
   - Taxable amount
   - Tax breakdown by rate
   - Shipping (if applicable)
   - Grand total (prominent, larger font)
   - Box or border around totals

9. **Create payment details section**
   - Section title: "Payment Information"
   - Payment method(s) used
   - Payment reference number
   - Amount tendered
   - Change given
   - Payment status (Paid, Pending, etc.)

10. **Design professional footer**
    - Company registration details
    - Tax registration numbers (TIN, VAT)
    - Bank account information (if relevant)
    - Return policy in small print
    - Terms and conditions summary
    - Contact information
    - Website and email

11. **Add branding elements**
    - Use tenant primary color for header background
    - Apply accent color to section titles
    - Use brand fonts throughout
    - Include watermark or background pattern (subtle)

12. **Implement multi-page handling**
    - Page header repeats on each page
    - "Continued..." indicator at page break
    - Page numbering (Page 1 of 2)
    - Footer on last page only or all pages

13. **Add optional elements**
    - QR code for digital receipt (bottom corner)
    - Barcode for receipt number
    - "PAID" stamp or watermark
    - Company logo watermark (very subtle)

14. **Ensure print optimization**
    - Use print-friendly colors (avoid pure black)
    - Ensure sufficient contrast
    - Test for grayscale printing
    - Avoid background images for printing

### A4 Invoice Layout Diagram

```
┌────────────────────────────────────────────────────┐
│ [LOGO]                    INVOICE/RECEIPT          │
│                                                     │
│ My Store Pvt Ltd          Receipt #: RC-2026-001234│
│ 123 Main Street           Date: 23-Jan-2026        │
│ Colombo 00100            Time: 14:35:22            │
│ +94 11 234 5678                                    │
├────────────────────────────────────────────────────┤
│ BILL TO:                                           │
│ Kasun Silva                                        │
│ kasun@example.com                                  │
│ +94 77 123 4567                                    │
├────────────────────────────────────────────────────┤
│ ITEMS                                              │
│ ┌──┬──────────────┬─────┬──────┬────────┬────────┐│
│ │# │ Description  │ Qty │ Price│Discount│  Total ││
│ ├──┼──────────────┼─────┼──────┼────────┼────────┤│
│ │1 │ Tea 100g     │  2  │450.00│  10%   │ 810.00 ││
│ │2 │ Sugar 1kg    │  1  │180.00│   -    │ 180.00 ││
│ └──┴──────────────┴─────┴──────┴────────┴────────┘│
│                                                     │
│                                    Subtotal: 990.00│
│                             Discount (10%): -99.00│
│                                 Taxable: 891.00│
│                             Tax (12% VAT): 106.92│
│                              ──────────────────────│
│                          TOTAL: Rs. 1,088.64│
│                                                     │
│ PAYMENT INFORMATION                                │
│ Method: Cash                                       │
│ Tendered: Rs. 1,100.00                            │
│ Change: Rs. 11.36                                 │
│ Status: PAID                                       │
├────────────────────────────────────────────────────┤
│ TIN: 123456789V  |  VAT: VAT-987654321            │
│ Returns within 7 days with original receipt       │
│ Thank you for your business!                       │
│ support@mystore.lk | www.mystore.lk               │
│                                          [QR CODE] │
└────────────────────────────────────────────────────┘
                    Page 1 of 1
```

### A4 Template Key Differences from Thermal

| Aspect | Thermal Receipt | A4 Invoice |
|--------|----------------|------------|
| **Size** | 80mm width | 210mm × 297mm (A4) |
| **Orientation** | Portrait (narrow) | Portrait (full page) |
| **Font Size** | Small (8-10pt) | Larger (10-12pt body, 24pt headers) |
| **Layout** | Single column | Multi-column possible |
| **Tables** | Plain text aligned | Formal table with borders |
| **Branding** | Minimal | Full branding with logo |
| **Detail Level** | Essential info only | Comprehensive details |
| **Purpose** | Quick reference | Official documentation |
| **Colors** | Usually monochrome | Full color branding |

### CSS Styling Considerations

```css
/* Page setup */
@page {
    size: A4 portrait;
    margin: 20mm;
}

/* Professional fonts */
body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 11pt;
    line-height: 1.5;
}

/* Header styling */
.invoice-header {
    background-color: {{ primary_color }};
    padding: 20px;
    color: white;
}

/* Table styling */
table.items {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

table.items thead {
    background-color: {{ secondary_color }};
    color: white;
}

table.items tbody tr:nth-child(even) {
    background-color: #f9fafb;
}

/* Totals section */
.totals {
    float: right;
    width: 300px;
    border: 2px solid {{ accent_color }};
    padding: 15px;
}

.grand-total {
    font-size: 16pt;
    font-weight: bold;
    color: {{ accent_color }};
}
```

### Expected Outcome
```
apps/pos/receipts/
└── templates/
    └── receipts/
        └── pdf/
            ├── base_receipt.html        # Existing thermal-style base
            └── a4_invoice.html          # New A4 invoice template
```

### Verification Checklist
- [ ] A4 template file is created
- [ ] Page dimensions are set to A4 (210mm × 297mm)
- [ ] Portrait orientation is configured
- [ ] Professional header with logo is implemented
- [ ] Document metadata bar shows receipt info
- [ ] Customer information block is included
- [ ] Professional items table with borders exists
- [ ] Detailed line item information is displayed
- [ ] Comprehensive totals section is right-aligned
- [ ] Payment details section is included
- [ ] Professional footer with company info exists
- [ ] Branding elements use tenant colors
- [ ] Multi-page handling works correctly
- [ ] QR code and optional elements are included
- [ ] Print optimization ensures good print quality

---

## Task 58: Create Thermal-Style PDF

### Overview
Design a narrow, thermal-receipt-style PDF that mimics the appearance of physical thermal receipts but in digital PDF format. This provides a familiar receipt format suitable for mobile viewing and printing on receipt printers.

### Dependencies
- Task 53: Base PDF template exists
- Task 57: A4 invoice template for comparison

### Instructions

1. **Create thermal-style template file**
   - Create file: `templates/receipts/pdf/thermal_style.html`
   - Design for narrow width (80mm or 3.15 inches)
   - Variable height based on content

2. **Set thermal dimensions**
   - Width: 80mm (standard thermal receipt paper)
   - Alternative widths: 58mm (narrow) or 72mm
   - Height: Auto (content-dependent)
   - Margins: 5mm left/right, 10mm top/bottom

3. **Design compact header**
   - Small logo (max 60mm width)
   - Business name centered
   - Address in smaller font (8-9pt)
   - Phone number
   - Single column layout

4. **Create receipt identifier section**
   - Receipt number centered
   - Date and time on one line
   - Cashier name
   - Terminal ID
   - Simple line separators (dashes or stars)

5. **Design items section**
   - Two-column layout: Description | Amount
   - Item name on left, price on right
   - Quantity × Unit Price on separate line
   - Modifiers or notes indented
   - No table borders (plain text style)

6. **Format item display**
   - Item name (bold or regular)
   - Quantity × Unit Price (12oz × ₨450.00)
   - Line total right-aligned
   - Use dots or spaces for alignment
   - Compact spacing (single line height)

7. **Create simple totals section**
   - Separator line (dashes)
   - Subtotal label and amount
   - Discount label and amount
   - Tax label and amount
   - Another separator
   - Total label (bold or uppercase)
   - Total amount (larger font, bold)
   - Payment tendered
   - Change given

8. **Design minimal footer**
   - Thank you message centered
   - Return policy (one line)
   - Support contact
   - Website or QR code
   - Keep minimal and compact

9. **Implement monospaced font option**
   - Use monospaced font for alignment (Courier, Monaco)
   - Ensures consistent column alignment
   - Alternative: Use CSS for text alignment

10. **Add thermal-style separators**
    - Use dashes, equals, or asterisks
    - Example: `================================`
    - Full-width separators between sections
    - Maintain thermal receipt aesthetic

11. **Optimize for mobile viewing**
    - Narrow width fits mobile screens perfectly
    - No horizontal scrolling needed
    - Easy to view on phone
    - Readable font sizes (10-11pt minimum)

12. **Ensure printer compatibility**
    - Test on thermal printers if available
    - Use printer-friendly fonts
    - Avoid complex graphics
    - High contrast for readability

13. **Add minimal branding**
    - Small logo only (no large headers)
    - Use brand color sparingly (maybe for total)
    - Keep mostly monochrome
    - Focus on readability over design

14. **Implement efficient spacing**
    - Minimize vertical spacing
    - Keep content compact
    - Reduce paper/screen space usage
    - Balance compactness with readability

### Thermal-Style Layout Diagram

```
┌────────────────────────────┐ 80mm width
│      [SMALL LOGO]          │
│      MY STORE PVT LTD      │
│   123 Main St, Colombo     │
│     +94 11 234 5678        │
│     TIN: 123456789V        │
│════════════════════════════│
│  RECEIPT: RC-2026-001234   │
│  DATE: 2026-01-23 14:35    │
│  CASHIER: Nimal Perera     │
│  TERMINAL: POS-01          │
│════════════════════════════│
│  CUSTOMER: Kasun Silva     │
│  EMAIL: kasun@example.com  │
│────────────────────────────│
│  ITEMS                     │
│  ─────────────────────────│
│  Tea - 100g Packet         │
│  2 × ₨450.00       ₨900.00│
│                            │
│  Sugar - 1kg               │
│  1 × ₨180.00       ₨180.00│
│  ─────────────────────────│
│  SUBTOTAL:        ₨990.00│
│  DISCOUNT (10%):   -₨99.00│
│  TAX (12% VAT):   ₨106.92│
│  ─────────────────────────│
│  TOTAL:         ₨1,088.64│
│  TENDERED:      ₨1,100.00│
│  CHANGE:           ₨11.36│
│════════════════════════════│
│  PAYMENT: Cash             │
│════════════════════════════│
│  Thank you!                │
│  Returns within 7 days     │
│  support@mystore.lk        │
│  www.mystore.lk            │
│       [QR CODE]            │
└────────────────────────────┘
```

### Thermal vs. A4 Comparison

| Feature | Thermal-Style | A4 Invoice |
|---------|---------------|------------|
| **Width** | 80mm | 210mm |
| **Layout** | Single column | Multi-column |
| **Font** | Monospaced or compact | Professional sans-serif |
| **Separators** | Dashes/equals | Borders/lines |
| **Tables** | Plain text aligned | HTML tables with borders |
| **Logo** | Small, centered | Large, prominent |
| **Spacing** | Compact | Generous |
| **Use Case** | Quick reference, mobile | Official documentation |
| **Colors** | Minimal | Full branding |

### CSS Styling for Thermal

```css
/* Page setup for thermal width */
@page {
    size: 80mm auto; /* Width fixed, height auto */
    margin: 5mm 3mm;
}

body {
    width: 80mm;
    font-family: 'Courier New', 'Monaco', monospace;
    font-size: 10pt;
    line-height: 1.3;
}

/* Center all text by default */
.thermal-receipt {
    text-align: center;
}

/* Item rows */
.item-row {
    display: flex;
    justify-content: space-between;
    text-align: left;
}

.item-name {
    flex: 1;
}

.item-price {
    text-align: right;
    white-space: nowrap;
}

/* Separators */
.separator {
    border-top: 1px dashed #000;
    margin: 5px 0;
}

.separator-thick {
    border-top: 2px solid #000;
    margin: 8px 0;
}

/* Total amount */
.total-amount {
    font-size: 12pt;
    font-weight: bold;
}
```

### Text Alignment Technique

For proper alignment without HTML tables:
```
Item Name                        ₨XXX.XX
[40 chars]                       [10 chars]

Use string padding:
- Left-align item name
- Right-align price
- Ensure total width is consistent
```

### Expected Outcome
```
apps/pos/receipts/
└── templates/
    └── receipts/
        └── pdf/
            ├── base_receipt.html        # Original base template
            ├── a4_invoice.html          # A4 invoice template
            └── thermal_style.html       # New thermal-style template
```

### Verification Checklist
- [ ] Thermal-style template file is created
- [ ] Width is set to 80mm (or configurable)
- [ ] Height adjusts automatically to content
- [ ] Compact header with small logo
- [ ] Receipt identifier section is centered
- [ ] Items section uses two-column layout
- [ ] Item display format matches thermal receipts
- [ ] Simple totals section with separators
- [ ] Minimal footer with essential info
- [ ] Monospaced font option is available
- [ ] Thermal-style separators (dashes) are used
- [ ] Template is optimized for mobile viewing
- [ ] Printer compatibility is ensured
- [ ] Minimal branding keeps focus on content
- [ ] Spacing is efficient and compact

---

## Task 59: Add PDF Storage

### Overview
Implement a secure and efficient PDF storage system that saves generated PDFs to persistent storage, manages file organization, handles cleanup, and provides retrieval mechanisms.

### Dependencies
- Task 55: PDF generator service generates PDFs
- Core system: File storage configuration (S3, local, etc.)
- Tenant architecture: Multi-tenant storage isolation

### Instructions

1. **Configure PDF storage settings**
   - Define storage backend (local filesystem, S3, etc.)
   - Set storage path: `media/receipts/pdf/`
   - Configure storage permissions
   - Set storage quotas per tenant (if applicable)

2. **Implement tenant-specific storage paths**
   - Path format: `receipts/pdf/{tenant_id}/{year}/{month}/`
   - Example: `receipts/pdf/tenant-123/2026/01/receipt_RC-2026-001234.pdf`
   - Ensure tenant isolation
   - Prevent cross-tenant access

3. **Create PDF storage service**
   - New class or module: `PDFStorageService`
   - Method to save PDF bytes to storage
   - Method to retrieve PDF by receipt ID
   - Method to delete PDF
   - Method to check PDF existence

4. **Implement save PDF method**
   - Accept PDF bytes and receipt instance
   - Generate unique filename
   - Determine storage path based on tenant and date
   - Save PDF to storage backend
   - Return storage path or URL
   - Handle storage errors

5. **Add file naming convention**
   - Format: `receipt_{receipt_number}_{timestamp}.pdf`
   - Example: `receipt_RC-2026-001234_20260123143522.pdf`
   - Ensure uniqueness with timestamp
   - Sanitize filename (remove special characters)
   - Maintain consistency across system

6. **Implement retrieve PDF method**
   - Accept receipt ID or file path
   - Locate PDF in storage
   - Return PDF file object or bytes
   - Handle missing files gracefully
   - Log retrieval attempts

7. **Create PDF URL generation**
   - Generate public or signed URL for PDF access
   - Use Django's `default_storage.url()` method
   - For S3: Generate pre-signed URL with expiration
   - For local: Generate URL through Django views
   - Return accessible URL for download

8. **Implement PDF regeneration detection**
   - Check if PDF already exists before generating
   - Use receipt version or hash to detect changes
   - Skip regeneration if PDF is up-to-date
   - Force regeneration option available

9. **Add storage metadata tracking**
   - Store PDF file path in receipt model
   - Add field: `pdf_file = models.FileField()`
   - Track PDF generation timestamp
   - Track PDF file size

10. **Implement storage cleanup mechanism**
    - Delete PDFs when receipt is deleted
    - Clean up orphaned PDFs (no matching receipt)
    - Scheduled task to purge old PDFs (after X days)
    - Configurable retention period

11. **Add storage quota management**
    - Track storage usage per tenant
    - Implement storage limits
    - Prevent over-storage
    - Alert when nearing quota

12. **Implement batch storage operations**
    - Save multiple PDFs efficiently
    - Batch delete operations
    - Bulk URL generation
    - Optimize for performance

13. **Add storage security measures**
    - Ensure files are not publicly accessible (unless intended)
    - Use signed URLs for temporary access
    - Validate file access permissions
    - Prevent unauthorized downloads

14. **Create storage health check**
    - Verify storage backend is accessible
    - Check available storage space
    - Monitor storage performance
    - Alert on storage issues

### PDF Storage Architecture

```
Storage Backend (S3 or Local Filesystem)
    │
    └── media/
        └── receipts/
            └── pdf/
                ├── tenant-abc-123/
                │   ├── 2026/
                │   │   ├── 01/
                │   │   │   ├── receipt_RC-2026-001234_20260123143522.pdf
                │   │   │   ├── receipt_RC-2026-001235_20260123150000.pdf
                │   │   │   └── ...
                │   │   └── 02/
                │   └── 2025/
                └── tenant-xyz-789/
                    └── 2026/
                        └── 01/
                            └── ...
```

### Storage Service Class Structure

```python
class PDFStorageService:
    """
    Service for storing and retrieving receipt PDFs.
    """
    
    def __init__(self, storage_backend=None):
        """Initialize with optional storage backend."""
        self.storage = storage_backend or default_storage
    
    def save_pdf(self, pdf_bytes, receipt):
        """
        Save PDF to storage.
        Returns file path.
        """
        pass
    
    def get_pdf_path(self, receipt):
        """
        Get storage path for receipt PDF.
        Returns path string.
        """
        pass
    
    def retrieve_pdf(self, receipt):
        """
        Retrieve PDF from storage.
        Returns file object or bytes.
        """
        pass
    
    def delete_pdf(self, receipt):
        """
        Delete PDF from storage.
        Returns True if successful.
        """
        pass
    
    def pdf_exists(self, receipt):
        """
        Check if PDF exists in storage.
        Returns boolean.
        """
        pass
    
    def generate_url(self, receipt, expires_in=3600):
        """
        Generate accessible URL for PDF.
        Returns URL string.
        """
        pass
```

### Storage Path Generation Logic

```python
def get_pdf_path(receipt):
    """
    Generate storage path for receipt PDF.
    
    Format: receipts/pdf/{tenant_id}/{year}/{month}/{filename}
    """
    tenant_id = receipt.tenant.id
    created_at = receipt.created_at
    year = created_at.strftime('%Y')
    month = created_at.strftime('%m')
    
    filename = f"receipt_{receipt.receipt_number}_{created_at.strftime('%Y%m%d%H%M%S')}.pdf"
    
    path = f"receipts/pdf/{tenant_id}/{year}/{month}/{filename}"
    
    return path
```

### Storage Backend Configuration

```python
# settings.py

# For AWS S3
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": {
            "bucket_name": "lankacommerce-receipts",
            "location": "media",
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# For local filesystem (development)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
```

### PDF Cleanup Strategy

| Trigger | Action | Retention |
|---------|--------|-----------|
| Receipt deleted | Delete PDF immediately | N/A |
| Receipt archived | Keep PDF until archive expires | 90 days |
| Orphaned PDFs | Delete if no matching receipt | N/A |
| Scheduled cleanup | Delete PDFs older than retention period | 365 days |
| Tenant deleted | Delete all tenant PDFs | N/A |

### Expected Outcome
```
apps/pos/receipts/
├── models/
│   └── receipt.py                # Updated with pdf_file field
└── services/
    ├── pdf_generator.py          # Uses storage service
    └── pdf_storage.py            # New storage service

apps/core/tasks/
└── cleanup_tasks.py              # Scheduled cleanup tasks
```

### Verification Checklist
- [ ] PDF storage settings are configured
- [ ] Tenant-specific storage paths are implemented
- [ ] PDF storage service class is created
- [ ] Save PDF method stores files correctly
- [ ] File naming convention is consistent
- [ ] Retrieve PDF method fetches files successfully
- [ ] PDF URL generation works (public or signed)
- [ ] PDF regeneration detection prevents duplicates
- [ ] Storage metadata is tracked in receipt model
- [ ] Storage cleanup mechanism is implemented
- [ ] Storage quota management is in place
- [ ] Batch storage operations are efficient
- [ ] Storage security measures prevent unauthorized access
- [ ] Storage health check monitors system

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 53 | Create PDF receipt template | `base_receipt.html` PDF template |
| 54 | Add tenant branding to PDF | Branding service and integration |
| 55 | Implement PDF generator service | `PDFGeneratorService` class |
| 56 | Add PDF metadata | Metadata builder and injection |
| 57 | Create A4 invoice-style PDF | `a4_invoice.html` template |
| 58 | Create thermal-style PDF | `thermal_style.html` template |
| 59 | Add PDF storage | `PDFStorageService` class |

### Final Group D Document 1 Structure
```
apps/pos/receipts/
├── models/
│   └── receipt.py                     # With pdf_file field
├── services/
│   ├── pdf_generator.py               # Complete PDF generator
│   ├── branding_service.py            # Branding context
│   └── pdf_storage.py                 # Storage service
└── templates/
    └── receipts/
        └── pdf/
            ├── base_receipt.html      # Base template
            ├── a4_invoice.html        # A4 invoice style
            └── thermal_style.html     # Thermal receipt style
```

### Group D Progress
- **Document 1 (Tasks 53-59):** PDF Generation System ✓
- **Document 2 (Tasks 60-64):** Email Receipts (Next)
- **Document 3 (Tasks 65-68):** Verification, Sharing, Preferences (Upcoming)

### Next Steps
1. Proceed to [02_Tasks-60-64_Email-Receipts.md](02_Tasks-60-64_Email-Receipts.md) to implement email receipt functionality
2. Test PDF generation with sample receipt data
3. Verify branding customization works correctly
4. Ensure storage backend is properly configured

---

## Notes for AI Agents

1. **PDF Library Choice:**
   - **WeasyPrint:** Recommended for HTML/CSS-based templates
   - **ReportLab:** Alternative for programmatic PDF generation
   - Consider system dependencies when choosing

2. **Branding Flexibility:**
   - Allow tenants to customize extensively
   - Provide sensible defaults for quick setup
   - Cache branding assets to improve performance

3. **Storage Backend:**
   - Use Django's storage abstraction for flexibility
   - Configure S3 for production, local for development
   - Implement signed URLs for secure access

4. **Multi-Tenant Considerations:**
   - Isolate PDF storage by tenant
   - Prevent cross-tenant access
   - Track storage usage per tenant

5. **Performance Optimization:**
   - Cache generated PDFs to avoid regeneration
   - Optimize images (logos) for PDF size
   - Use async tasks for batch generation

6. **Testing:**
   - Test with various receipt lengths (single item vs. many items)
   - Verify multi-page handling
   - Test with missing data (no customer, no logo, etc.)
   - Verify branding customization

7. **Localization:**
   - Ensure Sinhala/Tamil text renders correctly in PDFs
   - Use Unicode-compatible fonts
   - Test LKR currency symbol display (₨)
