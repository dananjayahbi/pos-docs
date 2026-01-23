# Tasks 71-73: Receipt PDF Generation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** E - Payment Receipts & Notifications  
> **Document:** 02 of 03  
> **Tasks Covered:** 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-70_Payment-Receipt-Model-Generation.md](01_Tasks-65-70_Payment-Receipt-Model-Generation.md)
- **→ Next Document:** [03_Tasks-74-76_Payment-Email-Notifications.md](03_Tasks-74-76_Payment-Email-Notifications.md)

---

## Document Overview

This document implements PDF generation for payment receipts, creating professional, branded PDF documents that can be printed or emailed to customers. This includes setting up the PDF generation library, creating receipt layouts with headers/footers, and formatting receipt content with company branding and Sri Lankan context.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Set Up PDF Generation Library | Low | 20 min |
| 72 | Create Receipt PDF Generator | High | 40 min |
| 73 | Add Receipt Header/Footer | Medium | 25 min |

---

## Task 71: Set Up PDF Generation Library

### Overview
Install and configure a PDF generation library for creating receipt PDFs. ReportLab is recommended for Python/Django projects.

### Dependencies
- Python environment configured

### Instructions

1. **Install ReportLab library**
   - Add to requirements.txt
   - Install via pip

2. **Configure PDF settings**
   - Page size (A4 or Letter)
   - Margins
   - Font settings

3. **Create PDF utilities module**
   - Helper functions for common PDF operations
   - Font registration
   - Color definitions

4. **Test basic PDF generation**
   - Create simple test PDF
   - Verify file creation

### Installation

```bash
# Add to requirements.txt
reportlab==4.0.9

# Install
pip install reportlab==4.0.9

# Or in Docker:
# Add to backend/requirements.txt and rebuild
```

### Configuration

```python
# Create apps/payments/utils/pdf_utils.py

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
import os


# PDF Configuration
PDF_CONFIG = {
    'PAGE_SIZE': A4,  # (595.27, 841.89) points = (210mm, 297mm)
    'MARGIN_TOP': 20 * mm,
    'MARGIN_BOTTOM': 20 * mm,
    'MARGIN_LEFT': 20 * mm,
    'MARGIN_RIGHT': 20 * mm,
    'FONT_NAME': 'Helvetica',
    'FONT_NAME_BOLD': 'Helvetica-Bold',
    'FONT_SIZE_NORMAL': 10,
    'FONT_SIZE_SMALL': 8,
    'FONT_SIZE_LARGE': 14,
    'FONT_SIZE_TITLE': 18,
}

# Color Definitions (customize for your brand)
COLORS = {
    'PRIMARY': HexColor('#2563eb'),      # Blue
    'SECONDARY': HexColor('#64748b'),    # Slate
    'SUCCESS': HexColor('#10b981'),      # Green
    'DANGER': HexColor('#ef4444'),       # Red
    'TEXT': HexColor('#1e293b'),         # Dark text
    'TEXT_LIGHT': HexColor('#94a3b8'),   # Light text
    'BORDER': HexColor('#e2e8f0'),       # Border
    'BACKGROUND': HexColor('#f8fafc'),   # Light background
}


def get_page_width(page_size=None):
    """Get usable page width"""
    page_size = page_size or PDF_CONFIG['PAGE_SIZE']
    return page_size[0] - PDF_CONFIG['MARGIN_LEFT'] - PDF_CONFIG['MARGIN_RIGHT']


def get_page_height(page_size=None):
    """Get usable page height"""
    page_size = page_size or PDF_CONFIG['PAGE_SIZE']
    return page_size[1] - PDF_CONFIG['MARGIN_TOP'] - PDF_CONFIG['MARGIN_BOTTOM']


def format_currency(amount, currency='LKR'):
    """
    Format currency amount for display
    
    Args:
        amount: Decimal amount
        currency: Currency code
        
    Returns:
        str: Formatted amount (e.g., "Rs. 50,000.00")
    """
    from decimal import Decimal
    
    amount = Decimal(str(amount))
    
    if currency == 'LKR':
        # Sri Lankan Rupee format
        return f'Rs. {amount:,.2f}'
    elif currency == 'USD':
        return f'$ {amount:,.2f}'
    elif currency == 'EUR':
        return f'€ {amount:,.2f}'
    else:
        return f'{currency} {amount:,.2f}'


def create_paragraph_style(
    name,
    font_name=None,
    font_size=None,
    alignment=TA_LEFT,
    text_color=None,
    space_before=0,
    space_after=0,
    leading=None
):
    """
    Create custom paragraph style
    
    Args:
        name: Style name
        font_name: Font family
        font_size: Font size in points
        alignment: Text alignment (TA_LEFT, TA_CENTER, TA_RIGHT)
        text_color: Text color
        space_before: Space before paragraph
        space_after: Space after paragraph
        leading: Line height (None = auto)
        
    Returns:
        ParagraphStyle: ReportLab paragraph style
    """
    return ParagraphStyle(
        name=name,
        fontName=font_name or PDF_CONFIG['FONT_NAME'],
        fontSize=font_size or PDF_CONFIG['FONT_SIZE_NORMAL'],
        alignment=alignment,
        textColor=text_color or COLORS['TEXT'],
        spaceBefore=space_before,
        spaceAfter=space_after,
        leading=leading
    )
```

### Test PDF Generation

```python
# Create test script: test_pdf.py

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from apps.payments.utils.pdf_utils import PDF_CONFIG, COLORS, format_currency

def create_test_pdf(filename='test_receipt.pdf'):
    """Create test PDF to verify ReportLab setup"""
    c = canvas.Canvas(filename, pagesize=PDF_CONFIG['PAGE_SIZE'])
    width, height = PDF_CONFIG['PAGE_SIZE']
    
    # Title
    c.setFont(PDF_CONFIG['FONT_NAME_BOLD'], PDF_CONFIG['FONT_SIZE_TITLE'])
    c.setFillColor(COLORS['PRIMARY'])
    c.drawString(100, height - 100, 'Payment Receipt - Test')
    
    # Content
    c.setFont(PDF_CONFIG['FONT_NAME'], PDF_CONFIG['FONT_SIZE_NORMAL'])
    c.setFillColor(COLORS['TEXT'])
    c.drawString(100, height - 150, f'Amount: {format_currency(50000, "LKR")}')
    c.drawString(100, height - 170, 'Payment Method: Card')
    
    c.save()
    print(f'Test PDF created: {filename}')

# Run test
if __name__ == '__main__':
    create_test_pdf()
```

### Expected Outcome
- ReportLab library installed
- PDF configuration module created
- Helper functions for PDF operations
- Test PDF generation successful

### Verification Checklist
- [ ] reportlab added to requirements.txt
- [ ] ReportLab installed successfully
- [ ] pdf_utils.py created
- [ ] PDF_CONFIG defined
- [ ] COLORS defined
- [ ] format_currency() helper
- [ ] create_paragraph_style() helper
- [ ] Test PDF generation works

---

## Task 72: Create Receipt PDF Generator

### Overview
Implement the core ReceiptPDFService class to generate professional PDF receipts with proper layout, formatting, and content sections.

### Dependencies
- Task 71: PDF library configured
- PaymentReceipt model exists

### Instructions

1. **Create ReceiptPDFService class**
   - generate_receipt_pdf(): Main generation method
   - Build receipt content sections
   - Save PDF to receipt.pdf_file

2. **Define receipt sections**
   - Header: Company info, logo, receipt number
   - Customer info: Name, address, contact
   - Payment details: Amount, method, date
   - Invoice reference: Invoice number (if applicable)
   - Footer: Thank you message, terms

3. **Implement content layout**
   - Use tables for structured data
   - Use paragraphs for text
   - Add spacing between sections

4. **Handle company branding**
   - Company name and logo
   - Company address and contact
   - Tax/registration numbers

5. **Format numbers and dates**
   - Currency formatting
   - Date formatting
   - Number alignment

### Implementation

```python
# Create apps/payments/services/receipt_pdf_service.py

import logging
import os
from io import BytesIO
from datetime import datetime
from decimal import Decimal

from django.core.files.base import ContentFile
from django.conf import settings

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib import colors

from apps.payments.models.payment_receipt import PaymentReceipt
from apps.payments.utils.pdf_utils import (
    PDF_CONFIG, COLORS, format_currency, create_paragraph_style, get_page_width
)

logger = logging.getLogger(__name__)


class ReceiptPDFService:
    """Service for generating payment receipt PDFs"""
    
    @staticmethod
    def generate_receipt_pdf(receipt):
        """
        Generate PDF for payment receipt
        
        Args:
            receipt: PaymentReceipt instance
            
        Returns:
            dict: Generation result
        """
        try:
            # Create PDF in memory
            buffer = BytesIO()
            
            # Create document
            doc = SimpleDocTemplate(
                buffer,
                pagesize=PDF_CONFIG['PAGE_SIZE'],
                topMargin=PDF_CONFIG['MARGIN_TOP'],
                bottomMargin=PDF_CONFIG['MARGIN_BOTTOM'],
                leftMargin=PDF_CONFIG['MARGIN_LEFT'],
                rightMargin=PDF_CONFIG['MARGIN_RIGHT']
            )
            
            # Build content
            story = []
            
            # Add header
            story.extend(ReceiptPDFService._build_header(receipt))
            story.append(Spacer(1, 10 * mm))
            
            # Add customer info
            story.extend(ReceiptPDFService._build_customer_info(receipt))
            story.append(Spacer(1, 10 * mm))
            
            # Add payment details
            story.extend(ReceiptPDFService._build_payment_details(receipt))
            story.append(Spacer(1, 10 * mm))
            
            # Add invoice reference (if applicable)
            if receipt.invoice:
                story.extend(ReceiptPDFService._build_invoice_reference(receipt))
                story.append(Spacer(1, 10 * mm))
            
            # Add footer
            story.extend(ReceiptPDFService._build_footer(receipt))
            
            # Build PDF
            doc.build(story)
            
            # Save PDF to receipt
            pdf_content = buffer.getvalue()
            buffer.close()
            
            pdf_filename = f'{receipt.receipt_number}.pdf'
            receipt.pdf_file.save(pdf_filename, ContentFile(pdf_content), save=False)
            receipt.pdf_generated_at = datetime.now()
            receipt.save(update_fields=['pdf_file', 'pdf_generated_at'])
            
            logger.info(
                f'Receipt PDF generated: {receipt.receipt_number}, '
                f'Size: {len(pdf_content)} bytes'
            )
            
            return {
                'success': True,
                'receipt_number': receipt.receipt_number,
                'pdf_size': len(pdf_content),
                'pdf_url': receipt.get_pdf_url(),
                'message': 'Receipt PDF generated successfully'
            }
            
        except Exception as e:
            logger.error(f'Receipt PDF generation failed: {str(e)}', exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'code': 'PDF_GENERATION_ERROR'
            }
    
    
    @staticmethod
    def _build_header(receipt):
        """Build receipt header section"""
        elements = []
        
        # Company name and receipt title
        title_style = create_paragraph_style(
            'Title',
            font_name=PDF_CONFIG['FONT_NAME_BOLD'],
            font_size=PDF_CONFIG['FONT_SIZE_TITLE'],
            alignment=TA_CENTER,
            text_color=COLORS['PRIMARY'],
            space_after=5
        )
        
        subtitle_style = create_paragraph_style(
            'Subtitle',
            font_size=PDF_CONFIG['FONT_SIZE_LARGE'],
            alignment=TA_CENTER,
            text_color=COLORS['TEXT']
        )
        
        # Company name (from settings or tenant)
        company_name = getattr(settings, 'COMPANY_NAME', 'Your Company Name')
        elements.append(Paragraph(company_name, title_style))
        elements.append(Paragraph('PAYMENT RECEIPT', subtitle_style))
        elements.append(Spacer(1, 5 * mm))
        
        # Company address and contact (centered)
        address_style = create_paragraph_style(
            'Address',
            font_size=PDF_CONFIG['FONT_SIZE_SMALL'],
            alignment=TA_CENTER,
            text_color=COLORS['TEXT_LIGHT']
        )
        
        company_address = getattr(
            settings,
            'COMPANY_ADDRESS',
            '123 Main Street, Colombo 03, Sri Lanka'
        )
        company_contact = getattr(
            settings,
            'COMPANY_CONTACT',
            'Tel: +94 11 234 5678 | Email: info@company.com'
        )
        
        elements.append(Paragraph(company_address, address_style))
        elements.append(Paragraph(company_contact, address_style))
        elements.append(Spacer(1, 5 * mm))
        
        # Horizontal line
        line_data = [['', '']]
        line_table = Table(line_data, colWidths=[get_page_width()])
        line_table.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1, COLORS['BORDER']),
        ]))
        elements.append(line_table)
        elements.append(Spacer(1, 5 * mm))
        
        # Receipt number and date (two columns)
        info_data = [
            [
                Paragraph(
                    f'<b>Receipt No:</b> {receipt.receipt_number}',
                    create_paragraph_style('InfoLeft', alignment=TA_LEFT)
                ),
                Paragraph(
                    f'<b>Date:</b> {receipt.receipt_date.strftime("%d %b %Y")}',
                    create_paragraph_style('InfoRight', alignment=TA_RIGHT)
                )
            ]
        ]
        
        info_table = Table(info_data, colWidths=[get_page_width() / 2] * 2)
        info_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(info_table)
        
        return elements
    
    
    @staticmethod
    def _build_customer_info(receipt):
        """Build customer information section"""
        elements = []
        
        section_title = create_paragraph_style(
            'SectionTitle',
            font_name=PDF_CONFIG['FONT_NAME_BOLD'],
            font_size=PDF_CONFIG['FONT_SIZE_NORMAL'],
            text_color=COLORS['PRIMARY'],
            space_before=5,
            space_after=5
        )
        
        elements.append(Paragraph('RECEIVED FROM', section_title))
        
        # Customer details table
        customer = receipt.customer
        
        customer_data = [
            ['Name:', customer.name],
            ['Address:', customer.address or 'N/A'],
            ['Phone:', customer.phone or 'N/A'],
            ['Email:', customer.email or 'N/A'],
        ]
        
        customer_table = Table(
            customer_data,
            colWidths=[30 * mm, get_page_width() - 30 * mm]
        )
        customer_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), PDF_CONFIG['FONT_NAME_BOLD']),
            ('FONTSIZE', (0, 0), (-1, -1), PDF_CONFIG['FONT_SIZE_NORMAL']),
            ('TEXTCOLOR', (0, 0), (0, -1), COLORS['TEXT']),
            ('TEXTCOLOR', (1, 0), (1, -1), COLORS['TEXT']),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(customer_table)
        
        return elements
    
    
    @staticmethod
    def _build_payment_details(receipt):
        """Build payment details section"""
        elements = []
        
        section_title = create_paragraph_style(
            'SectionTitle',
            font_name=PDF_CONFIG['FONT_NAME_BOLD'],
            font_size=PDF_CONFIG['FONT_SIZE_NORMAL'],
            text_color=COLORS['PRIMARY'],
            space_before=5,
            space_after=5
        )
        
        elements.append(Paragraph('PAYMENT DETAILS', section_title))
        
        # Payment details table
        payment_data = [
            ['Payment Amount:', format_currency(receipt.receipt_amount, receipt.currency)],
            ['Payment Method:', receipt.get_display_method()],
            ['Payment Date:', receipt.receipt_date.strftime('%d %B %Y')],
        ]
        
        if receipt.reference_number:
            payment_data.append(['Reference Number:', receipt.reference_number])
        
        if receipt.payment.method == 'CARD':
            card_info = receipt.payment.method_details.get('last_4_digits', 'N/A')
            payment_data.append(['Card Last 4 Digits:', f'**** {card_info}'])
        
        if receipt.payment.method == 'BANK_TRANSFER':
            bank_name = receipt.payment.method_details.get('bank_name', 'N/A')
            payment_data.append(['Bank:', bank_name])
        
        payment_table = Table(
            payment_data,
            colWidths=[40 * mm, get_page_width() - 40 * mm]
        )
        payment_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), PDF_CONFIG['FONT_NAME_BOLD']),
            ('FONTSIZE', (0, 0), (-1, -1), PDF_CONFIG['FONT_SIZE_NORMAL']),
            ('TEXTCOLOR', (0, 0), (0, -1), COLORS['TEXT']),
            ('TEXTCOLOR', (1, 0), (1, -1), COLORS['TEXT']),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(payment_table)
        
        # Amount highlight box
        elements.append(Spacer(1, 5 * mm))
        
        amount_data = [[
            Paragraph(
                f'<b>TOTAL AMOUNT RECEIVED:</b> {format_currency(receipt.receipt_amount, receipt.currency)}',
                create_paragraph_style(
                    'AmountHighlight',
                    font_name=PDF_CONFIG['FONT_NAME_BOLD'],
                    font_size=PDF_CONFIG['FONT_SIZE_LARGE'],
                    alignment=TA_CENTER,
                    text_color=COLORS['SUCCESS']
                )
            )
        ]]
        
        amount_table = Table(amount_data, colWidths=[get_page_width()])
        amount_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), COLORS['BACKGROUND']),
            ('BOX', (0, 0), (-1, -1), 1, COLORS['BORDER']),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(amount_table)
        
        return elements
    
    
    @staticmethod
    def _build_invoice_reference(receipt):
        """Build invoice reference section"""
        elements = []
        
        section_title = create_paragraph_style(
            'SectionTitle',
            font_name=PDF_CONFIG['FONT_NAME_BOLD'],
            font_size=PDF_CONFIG['FONT_SIZE_NORMAL'],
            text_color=COLORS['PRIMARY'],
            space_before=5,
            space_after=5
        )
        
        elements.append(Paragraph('INVOICE REFERENCE', section_title))
        
        # Invoice details
        invoice = receipt.invoice
        
        invoice_data = [
            ['Invoice Number:', invoice.invoice_number],
            ['Invoice Date:', invoice.invoice_date.strftime('%d %B %Y')],
            ['Invoice Amount:', format_currency(invoice.total_amount, invoice.currency)],
            ['Amount Paid:', format_currency(invoice.paid_amount or 0, invoice.currency)],
            ['Outstanding Balance:', format_currency(
                invoice.total_amount - (invoice.paid_amount or 0),
                invoice.currency
            )],
        ]
        
        invoice_table = Table(
            invoice_data,
            colWidths=[40 * mm, get_page_width() - 40 * mm]
        )
        invoice_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), PDF_CONFIG['FONT_NAME_BOLD']),
            ('FONTSIZE', (0, 0), (-1, -1), PDF_CONFIG['FONT_SIZE_NORMAL']),
            ('TEXTCOLOR', (0, 0), (0, -1), COLORS['TEXT']),
            ('TEXTCOLOR', (1, 0), (1, -1), COLORS['TEXT']),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(invoice_table)
        
        return elements
    
    
    @staticmethod
    def _build_footer(receipt):
        """Build receipt footer section"""
        elements = []
        
        elements.append(Spacer(1, 10 * mm))
        
        # Horizontal line
        line_data = [['', '']]
        line_table = Table(line_data, colWidths=[get_page_width()])
        line_table.setStyle(TableStyle([
            ('LINEABOVE', (0, 0), (-1, -1), 1, COLORS['BORDER']),
        ]))
        elements.append(line_table)
        
        elements.append(Spacer(1, 5 * mm))
        
        # Thank you message
        footer_style = create_paragraph_style(
            'Footer',
            font_size=PDF_CONFIG['FONT_SIZE_NORMAL'],
            alignment=TA_CENTER,
            text_color=COLORS['TEXT']
        )
        
        elements.append(Paragraph('<b>Thank you for your payment!</b>', footer_style))
        
        # Notes (if any)
        if receipt.notes:
            notes_style = create_paragraph_style(
                'Notes',
                font_size=PDF_CONFIG['FONT_SIZE_SMALL'],
                alignment=TA_CENTER,
                text_color=COLORS['TEXT_LIGHT'],
                space_before=5
            )
            elements.append(Paragraph(f'Notes: {receipt.notes}', notes_style))
        
        # Terms and footer text
        terms_style = create_paragraph_style(
            'Terms',
            font_size=PDF_CONFIG['FONT_SIZE_SMALL'],
            alignment=TA_CENTER,
            text_color=COLORS['TEXT_LIGHT'],
            space_before=10
        )
        
        elements.append(Paragraph(
            'This is a computer-generated receipt and does not require a signature.',
            terms_style
        ))
        elements.append(Paragraph(
            'For any queries, please contact our accounts department.',
            terms_style
        ))
        
        # Company footer
        company_footer = getattr(
            settings,
            'COMPANY_FOOTER',
            'Company Registration No: 123456 | VAT No: LK123456789'
        )
        elements.append(Paragraph(company_footer, terms_style))
        
        return elements
```

### Receipt PDF Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│          YOUR COMPANY NAME                  │  ← Header
│          PAYMENT RECEIPT                    │
│    123 Main St, Colombo 03, Sri Lanka      │
│   Tel: +94 11 234 5678 | info@co.com      │
│                                             │
│  ──────────────────────────────────────    │
│                                             │
│  Receipt No: REC-2026-00067                │
│  Date: 15 Jan 2026                          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  RECEIVED FROM                              │  ← Customer Info
│                                             │
│  Name:     ABC Corporation Ltd              │
│  Address:  456 Business St, Colombo 02     │
│  Phone:    +94 77 123 4567                 │
│  Email:    accounts@abc.com                 │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  PAYMENT DETAILS                            │  ← Payment Details
│                                             │
│  Payment Amount:     Rs. 50,000.00         │
│  Payment Method:     Card                   │
│  Payment Date:       15 January 2026       │
│  Reference Number:   TXN123456789          │
│  Card Last 4 Digits: **** 1234             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ TOTAL AMOUNT RECEIVED: Rs. 50,000.00  │ │  ← Amount Highlight
│  └───────────────────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  INVOICE REFERENCE                          │  ← Invoice Info
│                                             │
│  Invoice Number:       INV-2026-00456      │
│  Invoice Date:         10 January 2026     │
│  Invoice Amount:       Rs. 100,000.00      │
│  Amount Paid:          Rs. 50,000.00       │
│  Outstanding Balance:  Rs. 50,000.00       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ──────────────────────────────────────    │  ← Footer
│                                             │
│       Thank you for your payment!           │
│                                             │
│  This is a computer-generated receipt      │
│  and does not require a signature.         │
│                                             │
│  Company Registration No: 123456           │
│  VAT No: LK123456789                       │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- ReceiptPDFService for PDF generation
- Professional receipt layout
- Company branding integration
- All receipt sections implemented
- PDF saved to file storage

### Verification Checklist
- [ ] ReceiptPDFService class created
- [ ] generate_receipt_pdf() method
- [ ] _build_header() with company info
- [ ] _build_customer_info() section
- [ ] _build_payment_details() section
- [ ] _build_invoice_reference() section
- [ ] _build_footer() with terms
- [ ] Currency formatting
- [ ] Date formatting
- [ ] PDF saved to receipt.pdf_file
- [ ] pdf_generated_at timestamp updated

---

## Task 73: Add Receipt Header/Footer

### Overview
Enhance the receipt header and footer with additional branding elements, such as company logo, custom colors, and configurable footer text.

### Dependencies
- Task 72: ReceiptPDFService implemented

### Instructions

1. **Add company logo support**
   - Upload logo to media/company/logo.png
   - Display logo in receipt header
   - Handle missing logo gracefully

2. **Make header/footer configurable**
   - Company settings model (or Django settings)
   - Customizable company info
   - Customizable footer text

3. **Add page numbers (if multi-page)**
   - Page X of Y in footer
   - Only if receipt spans multiple pages

4. **Add QR code (optional)**
   - QR code with receipt URL for verification
   - Display in header or footer

### Implementation

```python
# Update ReceiptPDFService._build_header()

@staticmethod
def _build_header(receipt):
    """Build receipt header section with logo"""
    elements = []
    
    # Check for company logo
    logo_path = os.path.join(settings.MEDIA_ROOT, 'company', 'logo.png')
    has_logo = os.path.exists(logo_path)
    
    if has_logo:
        # Header with logo (left) and company info (right)
        logo_img = Image(logo_path, width=40 * mm, height=20 * mm, kind='proportional')
        
        # Company info
        company_info_style = create_paragraph_style(
            'CompanyInfo',
            font_name=PDF_CONFIG['FONT_NAME_BOLD'],
            font_size=PDF_CONFIG['FONT_SIZE_LARGE'],
            alignment=TA_RIGHT,
            text_color=COLORS['PRIMARY']
        )
        
        company_name = getattr(settings, 'COMPANY_NAME', 'Your Company Name')
        company_tagline = getattr(settings, 'COMPANY_TAGLINE', 'Serving you since 2020')
        
        company_info = [
            [
                logo_img,
                Paragraph(
                    f'<b>{company_name}</b><br/><font size="8">{company_tagline}</font>',
                    company_info_style
                )
            ]
        ]
        
        logo_table = Table(
            company_info,
            colWidths=[60 * mm, get_page_width() - 60 * mm]
        )
        logo_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(logo_table)
        elements.append(Spacer(1, 5 * mm))
    
    else:
        # Header without logo (centered)
        title_style = create_paragraph_style(
            'Title',
            font_name=PDF_CONFIG['FONT_NAME_BOLD'],
            font_size=PDF_CONFIG['FONT_SIZE_TITLE'],
            alignment=TA_CENTER,
            text_color=COLORS['PRIMARY'],
            space_after=5
        )
        
        company_name = getattr(settings, 'COMPANY_NAME', 'Your Company Name')
        elements.append(Paragraph(company_name, title_style))
    
    # Receipt title
    subtitle_style = create_paragraph_style(
        'Subtitle',
        font_size=PDF_CONFIG['FONT_SIZE_LARGE'],
        alignment=TA_CENTER,
        text_color=COLORS['TEXT']
    )
    elements.append(Paragraph('PAYMENT RECEIPT', subtitle_style))
    elements.append(Spacer(1, 5 * mm))
    
    # Rest of header implementation...
    # (continue with company address, contact, receipt number, date as before)
    
    return elements


# Update ReceiptPDFService._build_footer()

@staticmethod
def _build_footer(receipt):
    """Build receipt footer with optional QR code"""
    elements = []
    
    elements.append(Spacer(1, 10 * mm))
    
    # Horizontal line
    line_data = [['', '']]
    line_table = Table(line_data, colWidths=[get_page_width()])
    line_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 1, COLORS['BORDER']),
    ]))
    elements.append(line_table)
    elements.append(Spacer(1, 5 * mm))
    
    # QR Code (optional - requires qrcode library)
    # if getattr(settings, 'RECEIPT_INCLUDE_QR_CODE', False):
    #     qr_code_img = ReceiptPDFService._generate_qr_code(receipt)
    #     if qr_code_img:
    #         elements.append(qr_code_img)
    #         elements.append(Spacer(1, 5 * mm))
    
    # Thank you message
    footer_style = create_paragraph_style(
        'Footer',
        font_size=PDF_CONFIG['FONT_SIZE_NORMAL'],
        alignment=TA_CENTER,
        text_color=COLORS['TEXT']
    )
    
    thank_you_message = getattr(
        settings,
        'RECEIPT_THANK_YOU_MESSAGE',
        'Thank you for your payment!'
    )
    elements.append(Paragraph(f'<b>{thank_you_message}</b>', footer_style))
    
    # Custom footer message
    custom_footer = getattr(settings, 'RECEIPT_FOOTER_MESSAGE', None)
    if custom_footer:
        custom_style = create_paragraph_style(
            'CustomFooter',
            font_size=PDF_CONFIG['FONT_SIZE_SMALL'],
            alignment=TA_CENTER,
            text_color=COLORS['TEXT_LIGHT'],
            space_before=5
        )
        elements.append(Paragraph(custom_footer, custom_style))
    
    # Notes (if any)
    if receipt.notes:
        notes_style = create_paragraph_style(
            'Notes',
            font_size=PDF_CONFIG['FONT_SIZE_SMALL'],
            alignment=TA_CENTER,
            text_color=COLORS['TEXT_LIGHT'],
            space_before=5
        )
        elements.append(Paragraph(f'Notes: {receipt.notes}', notes_style))
    
    # Terms and conditions
    terms_style = create_paragraph_style(
        'Terms',
        font_size=PDF_CONFIG['FONT_SIZE_SMALL'],
        alignment=TA_CENTER,
        text_color=COLORS['TEXT_LIGHT'],
        space_before=10
    )
    
    terms_text = getattr(
        settings,
        'RECEIPT_TERMS_TEXT',
        'This is a computer-generated receipt and does not require a signature.'
    )
    elements.append(Paragraph(terms_text, terms_style))
    
    contact_text = getattr(
        settings,
        'RECEIPT_CONTACT_TEXT',
        'For any queries, please contact our accounts department.'
    )
    elements.append(Paragraph(contact_text, terms_style))
    
    # Company registration details
    company_registration = getattr(settings, 'COMPANY_REGISTRATION', None)
    vat_number = getattr(settings, 'COMPANY_VAT_NUMBER', None)
    
    footer_details = []
    if company_registration:
        footer_details.append(f'Company Registration No: {company_registration}')
    if vat_number:
        footer_details.append(f'VAT No: {vat_number}')
    
    if footer_details:
        elements.append(Paragraph(' | '.join(footer_details), terms_style))
    
    # Website/Email
    company_website = getattr(settings, 'COMPANY_WEBSITE', None)
    company_email = getattr(settings, 'COMPANY_EMAIL', None)
    
    contact_details = []
    if company_website:
        contact_details.append(f'Web: {company_website}')
    if company_email:
        contact_details.append(f'Email: {company_email}')
    
    if contact_details:
        elements.append(Paragraph(' | '.join(contact_details), terms_style))
    
    return elements


# Optional: QR Code generation
@staticmethod
def _generate_qr_code(receipt):
    """
    Generate QR code for receipt verification
    
    Args:
        receipt: PaymentReceipt instance
        
    Returns:
        Image or None: QR code image
    """
    try:
        import qrcode
        from io import BytesIO
        
        # Create receipt verification URL
        verification_url = f'{settings.SITE_URL}/receipts/verify/{receipt.receipt_number}/'
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=3,
            border=1,
        )
        qr.add_data(verification_url)
        qr.make(fit=True)
        
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to BytesIO
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Create ReportLab Image
        qr_image = Image(buffer, width=30 * mm, height=30 * mm)
        
        return qr_image
        
    except ImportError:
        logger.warning('qrcode library not installed, skipping QR code generation')
        return None
    except Exception as e:
        logger.error(f'QR code generation failed: {str(e)}')
        return None
```

### Configuration in Settings

```python
# settings.py

# Company Information
COMPANY_NAME = 'ABC Corporation Ltd'
COMPANY_TAGLINE = 'Your trusted partner since 2020'
COMPANY_ADDRESS = '123 Main Street, Colombo 03, Sri Lanka'
COMPANY_CONTACT = 'Tel: +94 11 234 5678 | Fax: +94 11 234 5679'
COMPANY_EMAIL = 'info@abccorp.lk'
COMPANY_WEBSITE = 'www.abccorp.lk'
COMPANY_REGISTRATION = 'PV 12345'
COMPANY_VAT_NUMBER = 'VAT123456789'

# Receipt Settings
RECEIPT_THANK_YOU_MESSAGE = 'Thank you for your business!'
RECEIPT_FOOTER_MESSAGE = 'We appreciate your prompt payment.'
RECEIPT_TERMS_TEXT = 'This is a computer-generated receipt and does not require a signature.'
RECEIPT_CONTACT_TEXT = 'For queries, contact accounts@abccorp.lk or call +94 11 234 5678'
RECEIPT_INCLUDE_QR_CODE = True  # Enable QR code

# Site URL for QR codes
SITE_URL = 'https://erp.abccorp.lk'
```

### Receipt with Enhanced Header/Footer

```
┌─────────────────────────────────────────────┐
│                                             │
│  [LOGO]        ABC CORPORATION LTD          │  ← Logo + Company Name
│                Your trusted partner         │
│                                             │
│          PAYMENT RECEIPT                    │
│                                             │
│    123 Main St, Colombo 03, Sri Lanka      │
│   Tel: +94 11 234 5678 | info@abc.lk      │
│                                             │
│  ... (rest of receipt content) ...         │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│       Thank you for your business!          │  ← Custom message
│    We appreciate your prompt payment.       │
│                                             │
│  This is a computer-generated receipt      │
│  and does not require a signature.         │
│                                             │
│  For queries, contact accounts@abc.lk      │
│                                             │
│  Company Registration No: PV 12345         │
│  VAT No: VAT123456789                      │
│                                             │
│  Web: www.abccorp.lk | Email: info@abc.lk │
│                                             │
│         [QR CODE]                          │  ← QR code for verification
│     Scan to verify receipt                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Company logo in header
- Configurable company information
- Customizable thank you and footer messages
- Optional QR code for verification
- Professional branding throughout

### Verification Checklist
- [ ] Company logo support in header
- [ ] Logo positioned correctly
- [ ] Company info configurable via settings
- [ ] Custom thank you message
- [ ] Custom footer message
- [ ] Company registration/VAT details
- [ ] Website and email in footer
- [ ] QR code generation (optional)
- [ ] Graceful handling of missing logo

---

## Summary

This document completed PDF generation for payment receipts:

1. ✅ **PDF Library Setup** (Task 71): ReportLab installed and configured with utilities
2. ✅ **Receipt PDF Generator** (Task 72): Complete ReceiptPDFService with all sections
3. ✅ **Header/Footer Enhancement** (Task 73): Logo support, configurable branding, QR codes

**Key Features Implemented:**
- Professional receipt layout with proper formatting
- Company branding (name, logo, colors)
- All receipt sections (header, customer, payment, invoice, footer)
- Currency and date formatting
- PDF file storage integration
- Configurable company information
- Optional QR code verification

**Next Document:** [03_Tasks-74-76_Payment-Email-Notifications.md](03_Tasks-74-76_Payment-Email-Notifications.md) - Implement email notification system for sending receipts and payment confirmations to customers.
