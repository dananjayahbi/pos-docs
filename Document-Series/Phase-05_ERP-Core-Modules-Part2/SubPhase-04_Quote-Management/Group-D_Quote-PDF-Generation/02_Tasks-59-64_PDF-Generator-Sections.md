# Tasks 59-64: PDF Generator Service & Sections

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** D - Quote PDF Generation  
> **Document:** 02 of 03  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-58_Template-Model.md](01_Tasks-53-58_Template-Model.md)
- **→ Next Document:** [03_Tasks-65-68_QR-Storage-Regeneration-Download.md](03_Tasks-65-68_QR-Storage-Regeneration-Download.md)

---

## Document Overview

This document covers the implementation of the QuotePDFGenerator service class and all PDF section generators (header, customer, line items, totals, footer).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create QuotePDFGenerator Service | High | 30 min |
| 60 | Implement PDF Header Section | Medium | 25 min |
| 61 | Implement PDF Customer Section | Medium | 25 min |
| 62 | Implement PDF Line Items Table | High | 30 min |
| 63 | Implement PDF Totals Section | Medium | 25 min |
| 64 | Implement PDF Footer Section | Medium | 25 min |

---

## Task 59: Create QuotePDFGenerator Service

### Overview
Create the core PDF generation service using ReportLab or WeasyPrint to generate professional quote PDFs.

### Dependencies
- Task 58: QuoteTemplate model exists
- ReportLab or WeasyPrint installed

### Instructions

1. **Install PDF generation library**
   - Add to requirements: `reportlab` or `weasyprint`
   - Choose based on needs (ReportLab = Python-only, WeasyPrint = HTML/CSS)

2. **Create pdf_generator.py service**
   - Create file: `apps/quotes/services/pdf_generator.py`
   - Import PDF library
   - Import models

3. **Define QuotePDFGenerator class**
   - Accept Quote instance
   - Accept optional QuoteTemplate
   - Initialize canvas/document

4. **Add generate() main method**
   - Coordinate all sections
   - Return BytesIO buffer with PDF
   - Handle errors gracefully

5. **Add helper methods**
   - get_template(): Get template or default
   - setup_document(): Initialize PDF document
   - format_currency(): Format LKR values
   - format_date(): Format dates

6. **Add section placeholders**
   - _generate_header()
   - _generate_customer_section()
   - _generate_line_items()
   - _generate_totals()
   - _generate_footer()

7. **Implement error handling**
   - Catch PDF generation errors
   - Log errors
   - Return error PDF or raise exception

### Implementation (ReportLab approach)

```python
# apps/quotes/services/pdf_generator.py

from io import BytesIO
from decimal import Decimal
from datetime import date
from typing import Optional

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle,
    Paragraph, Spacer, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

from apps.quotes.models import Quote, QuoteTemplate


class QuotePDFGenerator:
    """
    Service for generating PDF documents from quotes.
    
    Uses ReportLab to create professional, customizable PDFs
    based on QuoteTemplate configurations.
    """
    
    def __init__(self, quote: Quote, template: Optional[QuoteTemplate] = None):
        """
        Initialize PDF generator.
        
        Args:
            quote: Quote instance to generate PDF for
            template: Optional QuoteTemplate (uses default if not provided)
        """
        self.quote = quote
        self.template = template or self._get_template()
        self.buffer = BytesIO()
        self.story = []  # ReportLab story elements
        self.styles = getSampleStyleSheet()
        
        # Initialize custom styles from template
        self._setup_styles()
    
    def _get_template(self) -> QuoteTemplate:
        """Get template for quote's tenant."""
        return QuoteTemplate.get_default_template(self.quote.tenant)
    
    def _setup_styles(self):
        """Setup custom paragraph styles from template."""
        # Heading style
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading1'],
            fontName=self.template.header_font,
            fontSize=self.template.font_size + 6,
            textColor=colors.HexColor(self.template.primary_color),
            spaceAfter=12,
        )
        
        # Body style
        self.body_style = ParagraphStyle(
            'CustomBody',
            parent=self.styles['BodyText'],
            fontName=self.template.body_font,
            fontSize=self.template.font_size,
            textColor=colors.HexColor(self.template.text_color),
        )
        
        # Bold style
        self.bold_style = ParagraphStyle(
            'CustomBold',
            parent=self.body_style,
            fontName=f"{self.template.body_font}-Bold",
        )
    
    def generate(self) -> BytesIO:
        """
        Generate complete PDF document.
        
        Returns:
            BytesIO: PDF file buffer
        """
        try:
            # Setup document
            doc = self._setup_document()
            
            # Build story (content elements)
            self._generate_header()
            self.story.append(Spacer(1, 10*mm))
            
            self._generate_customer_section()
            self.story.append(Spacer(1, 10*mm))
            
            self._generate_line_items()
            self.story.append(Spacer(1, 10*mm))
            
            self._generate_totals()
            self.story.append(Spacer(1, 10*mm))
            
            self._generate_footer()
            
            # Build PDF
            doc.build(self.story)
            
            # Reset buffer position
            self.buffer.seek(0)
            return self.buffer
            
        except Exception as e:
            # Log error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"PDF generation failed for quote {self.quote.quote_number}: {e}")
            raise
    
    def _setup_document(self) -> SimpleDocTemplate:
        """Setup PDF document with template settings."""
        # Page size
        page_size = A4 if self.template.page_size == 'A4' else letter
        
        # Create document
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=page_size,
            topMargin=self.template.margin_top * mm,
            bottomMargin=self.template.margin_bottom * mm,
            leftMargin=self.template.margin_left * mm,
            rightMargin=self.template.margin_right * mm,
        )
        
        return doc
    
    def format_currency(self, amount: Decimal) -> str:
        """Format amount as LKR currency."""
        return f"LKR {amount:,.2f}"
    
    def format_date(self, date_obj: date) -> str:
        """Format date for display."""
        return date_obj.strftime("%d %B %Y")
    
    # Section methods (implemented in subsequent tasks)
    def _generate_header(self):
        """Generate PDF header section."""
        pass  # Implemented in Task 60
    
    def _generate_customer_section(self):
        """Generate customer information section."""
        pass  # Implemented in Task 61
    
    def _generate_line_items(self):
        """Generate line items table."""
        pass  # Implemented in Task 62
    
    def _generate_totals(self):
        """Generate totals section."""
        pass  # Implemented in Task 63
    
    def _generate_footer(self):
        """Generate footer section."""
        pass  # Implemented in Task 64
```

### Service Structure

```
QuotePDFGenerator
├── __init__(quote, template)
├── generate()                    # Main method
├── _get_template()
├── _setup_styles()
├── _setup_document()
├── format_currency()
├── format_date()
├── _generate_header()
├── _generate_customer_section()
├── _generate_line_items()
├── _generate_totals()
└── _generate_footer()
```

### Usage Examples

```python
from apps.quotes.services.pdf_generator import QuotePDFGenerator

# Generate PDF with default template
quote = Quote.objects.get(quote_number='QT-2026-00001')
generator = QuotePDFGenerator(quote)
pdf_buffer = generator.generate()

# Save to file
with open('quote.pdf', 'wb') as f:
    f.write(pdf_buffer.getvalue())

# Generate with specific template
template = QuoteTemplate.objects.get(name="Professional Blue")
generator = QuotePDFGenerator(quote, template=template)
pdf_buffer = generator.generate()

# Return as HTTP response
from django.http import HttpResponse

response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
response['Content-Disposition'] = f'attachment; filename="quote_{quote.quote_number}.pdf"'
return response
```

### Expected Outcome
```
apps/quotes/services/
├── __init__.py
├── quote_service.py
├── calculation_service.py
└── pdf_generator.py          # New service
```

### Verification Checklist
- [ ] pdf_generator.py file created
- [ ] ReportLab installed
- [ ] QuotePDFGenerator class defined
- [ ] __init__ accepts quote and template
- [ ] generate() main method implemented
- [ ] _get_template() method
- [ ] _setup_styles() method
- [ ] _setup_document() method
- [ ] format_currency() helper
- [ ] format_date() helper
- [ ] Section method placeholders
- [ ] Error handling implemented
- [ ] Logging configured

---

## Task 60: Implement PDF Header Section

### Overview
Implement the header section generator with logo, business information, and quote number.

### Dependencies
- Task 59: QuotePDFGenerator service exists

### Instructions

1. **Implement _generate_header method**
   - Check if header visible in layout
   - Create header table
   - Add logo (if configured)
   - Add business information
   - Add quote details

2. **Add logo handling**
   - Check if logo exists and show_logo=True
   - Load logo image
   - Resize appropriately
   - Add to header

3. **Add business information**
   - Business name (large, bold)
   - Address
   - Contact information
   - Registration numbers

4. **Add quote information box**
   - Quote number
   - Issue date
   - Valid until date
   - Status badge

5. **Apply template styling**
   - Use template colors
   - Use template fonts
   - Respect layout options

### Implementation

```python
# Add to QuotePDFGenerator class

def _generate_header(self):
    """Generate PDF header with logo and business info."""
    if not self.template.is_section_visible('header'):
        return
    
    # Header data
    header_data = []
    
    # Row 1: Logo and Business Info
    row1 = []
    
    # Logo column
    if self.template.show_logo and self.template.logo:
        try:
            logo = Image(self.template.logo.path, width=40*mm, height=40*mm)
            row1.append(logo)
        except:
            row1.append('')  # Empty cell if logo fails
    else:
        row1.append('')
    
    # Business info column
    if self.template.show_business_address:
        business_info = f"""
        <font size="{self.template.font_size + 8}" color="{self.template.primary_color}">
            <b>{self.template.business_name or self.quote.tenant.name}</b>
        </font><br/>
        {self.template.business_address}<br/>
        {self.template.business_city}, {self.template.business_postal_code}<br/>
        {self.template.business_country}<br/>
        """
        
        if self.template.show_contact_info:
            business_info += f"""
            <br/>
            Phone: {self.template.phone_number}<br/>
            Email: {self.template.email_address}<br/>
            """
            if self.template.website:
                business_info += f"Web: {self.template.website}<br/>"
        
        if self.template.company_registration_number:
            business_info += f"""
            <br/>
            Reg No: {self.template.company_registration_number}<br/>
            TIN: {self.template.tax_registration_number}
            """
        
        business_para = Paragraph(business_info, self.body_style)
        row1.append(business_para)
    
    # Quote info box (right column)
    quote_info = f"""
    <font size="{self.template.font_size + 4}" color="{self.template.primary_color}">
        <b>QUOTATION</b>
    </font><br/>
    <b>Quote #:</b> {self.quote.quote_number}<br/>
    <b>Date:</b> {self.format_date(self.quote.issue_date)}<br/>
    <b>Valid Until:</b> {self.format_date(self.quote.valid_until)}<br/>
    <b>Status:</b> <font color="{self._get_status_color()}">{self.quote.get_status_display()}</font>
    """
    quote_para = Paragraph(quote_info, self.body_style)
    row1.append(quote_para)
    
    header_data.append(row1)
    
    # Create table
    table = Table(
        header_data,
        colWidths=[50*mm, 80*mm, 60*mm]
    )
    
    # Table style
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, 0), 'CENTER'),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
    ]))
    
    self.story.append(table)
    
    # Separator line
    self._add_separator_line()

def _get_status_color(self) -> str:
    """Get color for quote status."""
    status_colors = {
        'DRAFT': '#6b7280',      # Gray
        'SENT': '#3b82f6',       # Blue
        'ACCEPTED': '#10b981',   # Green
        'REJECTED': '#ef4444',   # Red
        'EXPIRED': '#f59e0b',    # Amber
        'CONVERTED': '#8b5cf6',  # Purple
    }
    return status_colors.get(self.quote.status, '#000000')

def _add_separator_line(self):
    """Add horizontal separator line."""
    from reportlab.platypus import HRFlowable
    
    line = HRFlowable(
        width="100%",
        thickness=1,
        color=colors.HexColor(self.template.secondary_color),
        spaceBefore=5*mm,
        spaceAfter=5*mm
    )
    self.story.append(line)
```

### Header Layout

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]        ABC Trading (Pvt) Ltd          QUOTATION │
│                123 Galle Road                  Quote #: │
│                Colombo 03, 00300               QT-2026  │
│                Sri Lanka                       -00001   │
│                                                          │
│                Phone: +94 11 234 5678         Date:     │
│                Email: info@abc.lk             15 Jan    │
│                                                2026      │
│                Reg No: PV 12345                          │
│                TIN: 123456789V                Valid:     │
│                                                15 Feb    │
│                                                2026      │
│                                                          │
│                                                Status:   │
│                                                SENT      │
├─────────────────────────────────────────────────────────┤
```

### Expected Outcome
Professional header section with logo, business branding, and quote metadata.

### Verification Checklist
- [ ] _generate_header() implemented
- [ ] Logo handling (if configured)
- [ ] Business name displayed
- [ ] Business address displayed
- [ ] Contact information displayed
- [ ] Registration numbers displayed
- [ ] Quote number displayed
- [ ] Issue date displayed
- [ ] Valid until date displayed
- [ ] Status with color coding
- [ ] Respects template styling
- [ ] Separator line added

---

## Task 61: Implement PDF Customer Section

### Overview
Implement customer information section showing recipient details.

### Dependencies
- Task 60: Header section implemented

### Instructions

1. **Implement _generate_customer_section method**
   - Check if section visible
   - Create "Bill To" section
   - Display customer details
   - Optional shipping address

2. **Add customer information**
   - Customer name
   - Contact person
   - Address
   - Phone/Email

3. **Handle quote-specific customer data**
   - Use customer_name if customer FK null
   - Use customer_email if provided
   - Custom address fields

4. **Add styling**
   - Section heading
   - Clean layout
   - Template colors

### Implementation

```python
# Add to QuotePDFGenerator class

def _generate_customer_section(self):
    """Generate customer information section."""
    if not self.template.is_section_visible('customer_info'):
        return
    
    # Section title
    title = Paragraph(
        "<b>BILL TO:</b>",
        self.heading_style
    )
    self.story.append(title)
    self.story.append(Spacer(1, 3*mm))
    
    # Customer data
    customer_data = []
    
    # Get customer information
    if self.quote.customer:
        customer_info = f"""
        <b>{self.quote.customer.name}</b><br/>
        """
        
        if hasattr(self.quote.customer, 'contact_person') and self.quote.customer.contact_person:
            customer_info += f"Attn: {self.quote.customer.contact_person}<br/>"
        
        if hasattr(self.quote.customer, 'address'):
            customer_info += f"{self.quote.customer.address}<br/>"
            if hasattr(self.quote.customer, 'city'):
                customer_info += f"{self.quote.customer.city}"
                if hasattr(self.quote.customer, 'postal_code'):
                    customer_info += f", {self.quote.customer.postal_code}"
                customer_info += "<br/>"
        
        if hasattr(self.quote.customer, 'phone'):
            customer_info += f"Phone: {self.quote.customer.phone}<br/>"
        
        if hasattr(self.quote.customer, 'email'):
            customer_info += f"Email: {self.quote.customer.email}<br/>"
    
    else:
        # Use quote-specific customer data
        customer_info = f"<b>{self.quote.customer_name or 'N/A'}</b><br/>"
        
        if self.quote.customer_email:
            customer_info += f"Email: {self.quote.customer_email}<br/>"
        
        if self.quote.customer_phone:
            customer_info += f"Phone: {self.quote.customer_phone}<br/>"
    
    customer_para = Paragraph(customer_info, self.body_style)
    customer_data.append([customer_para])
    
    # Quote title/subject if present
    if self.quote.title:
        customer_data.append([Spacer(1, 5*mm)])
        title_para = Paragraph(
            f"<b>Subject:</b> {self.quote.title}",
            self.body_style
        )
        customer_data.append([title_para])
    
    # Create table
    table = Table(customer_data, colWidths=[180*mm])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    self.story.append(table)
```

### Customer Section Layout

```
BILL TO:
─────────
ABC Company (Pvt) Ltd
Attn: John Doe
456 Kandy Road
Colombo 07, 00700

Phone: +94 77 123 4567
Email: john@abccompany.lk

Subject: Office Furniture Quotation
```

### Expected Outcome
Clear display of customer information and quote subject.

### Verification Checklist
- [ ] _generate_customer_section() implemented
- [ ] Section title displayed
- [ ] Customer name displayed
- [ ] Contact person (if available)
- [ ] Customer address displayed
- [ ] Phone number displayed
- [ ] Email displayed
- [ ] Quote title/subject displayed
- [ ] Handles missing customer FK
- [ ] Uses quote customer fields as fallback

---

## Task 62: Implement PDF Line Items Table

### Overview
Implement the line items table with product details, quantities, prices, and totals.

### Dependencies
- Task 61: Customer section implemented

### Instructions

1. **Implement _generate_line_items method**
   - Get visible columns from template
   - Create table headers
   - Add line items rows
   - Apply table styling

2. **Build table headers**
   - Use layout_options for visible columns
   - Map column names to display names
   - Apply header styling

3. **Build line items rows**
   - Iterate through quote line items
   - Format each column
   - Handle notes/descriptions
   - Format currency values

4. **Apply table styling**
   - Borders (if configured)
   - Grid lines (if configured)
   - Alternating row colors
   - Column alignment

5. **Handle long descriptions**
   - Use Paragraph for wrapping
   - Limit width appropriately

### Implementation

```python
# Add to QuotePDFGenerator class

def _generate_line_items(self):
    """Generate line items table."""
    if not self.template.is_section_visible('line_items'):
        return
    
    # Section title
    title = Paragraph("<b>ITEMS:</b>", self.heading_style)
    self.story.append(title)
    self.story.append(Spacer(1, 3*mm))
    
    # Get visible columns
    visible_columns = self.template.get_visible_columns()
    
    # Column mapping
    column_labels = {
        'item_code': '#',
        'description': 'Description',
        'quantity': 'Qty',
        'unit_price': 'Unit Price',
        'discount': 'Discount',
        'tax': 'Tax',
        'total': 'Total',
    }
    
    # Table data
    table_data = []
    
    # Headers
    headers = [column_labels.get(col, col.title()) for col in visible_columns]
    table_data.append(headers)
    
    # Line items
    line_items = self.quote.line_items.all().order_by('position')
    
    for idx, item in enumerate(line_items, 1):
        row = []
        
        for col in visible_columns:
            if col == 'item_code':
                code = item.product.code if item.product else f"#{idx}"
                row.append(Paragraph(code, self.body_style))
            
            elif col == 'description':
                desc = item.description or (item.product.name if item.product else '')
                if item.notes:
                    desc += f"\n<i>{item.notes}</i>"
                row.append(Paragraph(desc, self.body_style))
            
            elif col == 'quantity':
                qty = f"{item.quantity} {item.unit or ''}"
                row.append(Paragraph(qty, self.body_style))
            
            elif col == 'unit_price':
                price = self.format_currency(item.unit_price)
                row.append(Paragraph(price, self.body_style))
            
            elif col == 'discount':
                if item.discount_amount > 0:
                    discount = self.format_currency(item.discount_amount)
                    row.append(Paragraph(f"-{discount}", self.body_style))
                else:
                    row.append(Paragraph('-', self.body_style))
            
            elif col == 'tax':
                if item.is_taxable and item.tax_amount > 0:
                    tax = self.format_currency(item.tax_amount)
                    row.append(Paragraph(tax, self.body_style))
                else:
                    row.append(Paragraph('-', self.body_style))
            
            elif col == 'total':
                total = self.format_currency(item.line_total)
                row.append(Paragraph(f"<b>{total}</b>", self.body_style))
        
        table_data.append(row)
    
    # Column widths (adjust based on visible columns)
    col_widths = self._calculate_column_widths(visible_columns)
    
    # Create table
    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    
    # Table style
    style_commands = [
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(self.template.primary_color)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), f"{self.template.header_font}-Bold"),
        ('FONTSIZE', (0, 0), (-1, 0), self.template.font_size),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        
        # Body styling
        ('FONTNAME', (0, 1), (-1, -1), self.template.body_font),
        ('FONTSIZE', (0, 1), (-1, -1), self.template.font_size),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        
        # Alignment
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),  # Item code centered
        ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),  # Total right-aligned
    ]
    
    # Alternating row colors
    for i in range(1, len(table_data)):
        if i % 2 == 0:
            style_commands.append(
                ('BACKGROUND', (0, i), (-1, i), colors.HexColor('#f9fafb'))
            )
    
    # Borders
    if self.template.show_borders:
        style_commands.extend([
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor(self.template.secondary_color)),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor(self.template.primary_color)),
        ])
    
    if self.template.show_grid_lines:
        style_commands.append(
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb'))
        )
    
    table.setStyle(TableStyle(style_commands))
    
    self.story.append(table)

def _calculate_column_widths(self, visible_columns):
    """Calculate column widths based on layout options."""
    layout = self.template.layout_options or {}
    columns_config = layout.get('columns', {})
    
    # Available width (A4 - margins)
    available_width = 170 * mm  # Approximate
    
    widths = []
    for col in visible_columns:
        col_config = columns_config.get(col, {})
        width_str = col_config.get('width', '15%')
        
        # Convert percentage to mm
        if '%' in width_str:
            percentage = float(width_str.replace('%', ''))
            width = available_width * (percentage / 100)
        else:
            width = 25 * mm  # Default
        
        widths.append(width)
    
    return widths
```

### Line Items Table Layout

```
ITEMS:
───────────────────────────────────────────────────────────────
│ #  │ Description          │ Qty │ Unit Price │ Tax    │ Total   │
│────│──────────────────────│─────│────────────│────────│─────────│
│ 1  │ Office Desk - Oak    │ 2   │ LKR 25,000 │ LKR    │ LKR     │
│    │ Standard size        │     │            │ 7,500  │ 57,500  │
│────│──────────────────────│─────│────────────│────────│─────────│
│ 2  │ Office Chair         │ 4   │ LKR 12,000 │ LKR    │ LKR     │
│    │ Ergonomic, adjustable│     │            │ 7,200  │ 55,200  │
│────│──────────────────────│─────│────────────│────────│─────────│
```

### Expected Outcome
Professional line items table with proper formatting, alignment, and styling.

### Verification Checklist
- [ ] _generate_line_items() implemented
- [ ] Visible columns from layout_options
- [ ] Table headers created
- [ ] All line items displayed
- [ ] Item codes/numbers shown
- [ ] Descriptions with wrapping
- [ ] Notes displayed (if present)
- [ ] Quantities formatted
- [ ] Unit prices formatted as LKR
- [ ] Discounts shown (if applicable)
- [ ] Tax amounts shown (if applicable)
- [ ] Line totals displayed
- [ ] Column widths calculated
- [ ] Header styling applied
- [ ] Alternating row colors
- [ ] Borders/grid lines (if configured)
- [ ] Proper alignment (right for currency)

---

## Task 63: Implement PDF Totals Section

### Overview
Implement totals section showing subtotal, discounts, tax, and grand total.

### Dependencies
- Task 62: Line items table implemented

### Instructions

1. **Implement _generate_totals method**
   - Check if section visible
   - Create totals table (right-aligned)
   - Show subtotal
   - Show header discount (if any)
   - Show tax breakdown
   - Show grand total

2. **Format totals**
   - Right-align amounts
   - Bold grand total
   - Use template colors
   - Clear labels

3. **Add tax breakdown**
   - Show tax rate (15% VAT)
   - Show taxable amount
   - Show tax total

4. **Style grand total**
   - Larger font
   - Bold
   - Background color
   - Prominent display

### Implementation

```python
# Add to QuotePDFGenerator class

def _generate_totals(self):
    """Generate totals section."""
    if not self.template.is_section_visible('totals'):
        return
    
    layout = self.template.layout_options or {}
    totals_config = layout.get('totals', {})
    
    # Totals data (right-aligned table)
    totals_data = []
    
    # Subtotal
    if totals_config.get('show_subtotal', True):
        totals_data.append([
            Paragraph('<b>Subtotal:</b>', self.body_style),
            Paragraph(self.format_currency(self.quote.subtotal), self.body_style)
        ])
    
    # Header discount
    if self.quote.discount_amount > 0 and totals_config.get('show_discount', True):
        discount_label = f"Discount ({self.quote.discount_type}):"
        if self.quote.discount_type == 'PERCENTAGE':
            discount_label = f"Discount ({self.quote.discount_value}%):"
        
        totals_data.append([
            Paragraph(f'<b>{discount_label}</b>', self.body_style),
            Paragraph(
                f'<font color="#dc2626">-{self.format_currency(self.quote.discount_amount)}</font>',
                self.body_style
            )
        ])
    
    # Tax breakdown
    if totals_config.get('show_tax_breakdown', True):
        # VAT 15%
        taxable_amount = self.quote.subtotal - self.quote.discount_amount
        tax_amount = self.quote.tax_amount
        
        totals_data.append([
            Paragraph('<b>Taxable Amount:</b>', self.body_style),
            Paragraph(self.format_currency(taxable_amount), self.body_style)
        ])
        
        totals_data.append([
            Paragraph('<b>VAT (15%):</b>', self.body_style),
            Paragraph(self.format_currency(tax_amount), self.body_style)
        ])
    
    # Spacer before grand total
    totals_data.append([
        Paragraph('', self.body_style),
        Paragraph('', self.body_style)
    ])
    
    # Grand total
    if totals_config.get('show_grand_total', True):
        grand_total_style = ParagraphStyle(
            'GrandTotal',
            parent=self.body_style,
            fontSize=self.template.font_size + 4,
            textColor=colors.HexColor(self.template.primary_color),
        )
        
        totals_data.append([
            Paragraph('<b>GRAND TOTAL:</b>', grand_total_style),
            Paragraph(
                f'<b>{self.format_currency(self.quote.grand_total)}</b>',
                grand_total_style
            )
        ])
    
    # Create table (right-aligned, 50% width)
    totals_table = Table(
        totals_data,
        colWidths=[60*mm, 40*mm]
    )
    
    # Table style
    style_commands = [
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        
        # Grand total styling
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor(self.template.primary_color)),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.whitesmoke),
        ('TOPPADDING', (0, -1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
    ]
    
    if self.template.show_borders:
        style_commands.extend([
            ('BOX', (0, 0), (-1, -2), 1, colors.HexColor(self.template.secondary_color)),
            ('BOX', (0, -1), (-1, -1), 2, colors.HexColor(self.template.primary_color)),
        ])
    
    totals_table.setStyle(TableStyle(style_commands))
    
    # Wrapper table to right-align
    wrapper = Table([[totals_table]], colWidths=[170*mm])
    wrapper.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
    ]))
    
    self.story.append(wrapper)
```

### Totals Section Layout

```
                           Subtotal:  LKR 110,000.00
                        Discount (5%):  -LKR 5,500.00
                                     ─────────────────
                     Taxable Amount:  LKR 104,500.00
                          VAT (15%):  LKR 15,675.00
                                     
┌────────────────────────────────────────────────────┐
│                   GRAND TOTAL:  LKR 120,175.00     │
└────────────────────────────────────────────────────┘
```

### Expected Outcome
Clear, professional totals section with proper calculations and prominent grand total display.

### Verification Checklist
- [ ] _generate_totals() implemented
- [ ] Subtotal displayed
- [ ] Header discount shown (if applicable)
- [ ] Discount type/value shown
- [ ] Taxable amount calculated
- [ ] VAT (15%) displayed
- [ ] Grand total prominent
- [ ] Right-aligned layout
- [ ] Grand total styled with background
- [ ] Currency formatting consistent
- [ ] Respects layout_options visibility

---

## Task 64: Implement PDF Footer Section

### Overview
Implement footer section with terms, validity message, signature line, and custom footer text.

### Dependencies
- Task 63: Totals section implemented

### Instructions

1. **Implement _generate_footer method**
   - Add terms and conditions (if configured)
   - Add validity message
   - Add payment instructions (if configured)
   - Add signature line (if configured)
   - Add custom footer text

2. **Add terms section**
   - Title: "Terms & Conditions"
   - Multi-line text from template
   - Smaller font size

3. **Add validity message**
   - Use template validity_message_template
   - Replace {valid_until} placeholder
   - Prominent display

4. **Add signature section**
   - Horizontal line
   - Signature label
   - Authorized person name/title

5. **Add custom footer**
   - Page number (optional)
   - Footer text from template
   - Alignment from template

### Implementation

```python
# Add to QuotePDFGenerator class

def _generate_footer(self):
    """Generate footer section with terms and signature."""
    
    # Terms and conditions
    if self.template.show_terms and self.template.terms_and_conditions:
        if self.template.is_section_visible('terms'):
            self.story.append(Spacer(1, 5*mm))
            
            terms_title = Paragraph(
                f"<b>{self.template.terms_title}</b>",
                self.heading_style
            )
            self.story.append(terms_title)
            self.story.append(Spacer(1, 2*mm))
            
            terms_style = ParagraphStyle(
                'Terms',
                parent=self.body_style,
                fontSize=self.template.font_size - 1,
            )
            
            terms_text = self.template.terms_and_conditions.replace('\n', '<br/>')
            terms_para = Paragraph(terms_text, terms_style)
            self.story.append(terms_para)
    
    # Payment instructions
    if self.template.default_payment_instructions:
        if self.template.is_section_visible('payment_instructions'):
            self.story.append(Spacer(1, 5*mm))
            
            payment_title = Paragraph(
                "<b>Payment Details</b>",
                self.heading_style
            )
            self.story.append(payment_title)
            self.story.append(Spacer(1, 2*mm))
            
            payment_text = self.template.default_payment_instructions.replace('\n', '<br/>')
            payment_para = Paragraph(payment_text, self.body_style)
            self.story.append(payment_para)
    
    # Validity message
    self.story.append(Spacer(1, 5*mm))
    
    validity_msg = self.template.validity_message_template.format(
        valid_until=self.format_date(self.quote.valid_until)
    )
    
    validity_style = ParagraphStyle(
        'Validity',
        parent=self.body_style,
        textColor=colors.HexColor(self.template.accent_color),
        fontSize=self.template.font_size + 1,
    )
    
    validity_para = Paragraph(f"<i>{validity_msg}</i>", validity_style)
    self.story.append(validity_para)
    
    # Thank you message
    if self.template.default_thank_you_message:
        self.story.append(Spacer(1, 3*mm))
        
        thanks_para = Paragraph(
            f"<b><i>{self.template.default_thank_you_message}</i></b>",
            self.body_style
        )
        self.story.append(thanks_para)
    
    # Signature line
    if self.template.show_signature_line:
        if self.template.is_section_visible('signature'):
            self.story.append(Spacer(1, 10*mm))
            
            # Signature line
            sig_data = [
                [Paragraph('_' * 40, self.body_style)],
                [Paragraph(f"<b>{self.template.signature_label}</b>", self.body_style)],
            ]
            
            if self.template.authorized_person_name:
                sig_data.append([
                    Paragraph(self.template.authorized_person_name, self.body_style)
                ])
            
            if self.template.authorized_person_title:
                sig_data.append([
                    Paragraph(
                        f"<i>{self.template.authorized_person_title}</i>",
                        self.body_style
                    )
                ])
            
            sig_table = Table(sig_data, colWidths=[80*mm])
            sig_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ]))
            
            self.story.append(sig_table)
    
    # Custom footer text
    if self.template.show_footer and self.template.footer_text:
        if self.template.is_section_visible('footer'):
            self.story.append(Spacer(1, 10*mm))
            
            footer_align = self.template.footer_alignment.upper()
            footer_style = ParagraphStyle(
                'Footer',
                parent=self.body_style,
                fontSize=self.template.font_size - 2,
                textColor=colors.HexColor(self.template.secondary_color),
                alignment={'LEFT': 0, 'CENTER': 1, 'RIGHT': 2}.get(footer_align, 1),
            )
            
            footer_text = self.template.footer_text.replace('\n', '<br/>')
            footer_para = Paragraph(footer_text, footer_style)
            self.story.append(footer_para)
```

### Footer Layout

```
Terms & Conditions
──────────────────
Payment Terms:
- 50% advance payment required
- Balance payable on delivery
- VAT (15%) included in total amount

Delivery: Standard delivery within 7-10 business days
Warranty: All products covered by manufacturer warranty

Payment Details
───────────────
Bank: Bank of Ceylon
Account Name: ABC Trading (Pvt) Ltd
Account Number: 1234567890
Branch: Colombo Main Branch

This quotation is valid until 15 February 2026

Thank you for your business!

                 ________________________________
                    Authorized Signature
                       John Doe
                     Sales Manager

─────────────────────────────────────────────────────
     ABC Trading (Pvt) Ltd | www.abctrading.lk
```

### Expected Outcome
Complete footer with terms, payment details, validity, and professional signature section.

### Verification Checklist
- [ ] _generate_footer() implemented
- [ ] Terms and conditions displayed
- [ ] Terms title from template
- [ ] Payment instructions shown
- [ ] Validity message displayed
- [ ] {valid_until} placeholder replaced
- [ ] Thank you message shown
- [ ] Signature line displayed
- [ ] Signature label shown
- [ ] Authorized person name/title shown
- [ ] Custom footer text displayed
- [ ] Footer alignment applied
- [ ] Respects section visibility settings
- [ ] Smaller font for terms/footer

---

## Summary

After completing Tasks 59-64, the Quote module will have:

### PDF Generation Service
- QuotePDFGenerator service class
- ReportLab-based PDF creation
- Template-driven styling
- Professional document layout

### PDF Sections
- Header: Logo, business info, quote details
- Customer: Recipient information
- Line Items: Professional table with all product details
- Totals: Subtotal, discount, tax (15% VAT), grand total
- Footer: Terms, payment, validity, signature

### Features
- Template customization (colors, fonts, layout)
- Configurable column visibility
- Section show/hide options
- Sri Lankan business context (LKR, VAT, TIN)
- Professional formatting
- Currency and date formatting
- Status color coding
- Alternating row colors
- Responsive column widths

### Usage
```python
generator = QuotePDFGenerator(quote)
pdf_buffer = generator.generate()
```

### Next Steps
Proceed to [03_Tasks-65-68_QR-Storage-Regeneration-Download.md](03_Tasks-65-68_QR-Storage-Regeneration-Download.md) to add QR codes, PDF storage, regeneration logic, and download endpoints.
