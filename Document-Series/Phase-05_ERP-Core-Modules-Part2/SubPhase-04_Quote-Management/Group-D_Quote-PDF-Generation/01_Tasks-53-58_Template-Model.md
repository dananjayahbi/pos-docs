# Tasks 53-58: QuoteTemplate Model & Configuration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** D - Quote PDF Generation  
> **Document:** 01 of 03  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Quote-Services-Business-Logic/](../Group-C_Quote-Services-Business-Logic/)
- **→ Next Document:** [02_Tasks-59-64_PDF-Generator-Sections.md](02_Tasks-59-64_PDF-Generator-Sections.md)

---

## Document Overview

This document covers the creation of the QuoteTemplate model for storing PDF template configurations including header information, styling options, content fields, and layout settings.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create QuoteTemplate Model | Medium | 25 min |
| 54 | Add Template Header Fields | Medium | 20 min |
| 55 | Add Template Styling Fields | Medium | 20 min |
| 56 | Add Template Content Fields | Medium | 20 min |
| 57 | Add Template Layout Options | Medium | 20 min |
| 58 | Run QuoteTemplate Migrations | Low | 15 min |

---

## Task 53: Create QuoteTemplate Model

### Overview
Create the QuoteTemplate model to store PDF template configurations for generating professional quote documents.

### Dependencies
- Tenant model exists
- FileField storage configured

### Instructions

1. **Create template.py model file**
   - Navigate to `apps/quotes/models/`
   - Create new file `template.py`

2. **Import required modules**
   - Django model classes
   - FileField for logo storage
   - JSONField for layout options
   - Validators

3. **Define QuoteTemplate model**
   - Store template configurations
   - Per-tenant customization
   - Multiple templates per tenant

4. **Add tenant relationship**
   - ForeignKey to Tenant
   - related_name='quote_templates'
   - Multiple templates allowed

5. **Add basic fields**
   - name: CharField for template name
   - is_default: BooleanField
   - is_active: BooleanField
   - description: TextField (optional)

6. **Add Meta class**
   - Ordering
   - Unique constraint: one default per tenant
   - Verbose names

7. **Add __str__ method**
   - Return template name with tenant

8. **Add get_default_template class method**
   - Get default template for tenant
   - Create if doesn't exist

9. **Update models __init__.py**
   - Import QuoteTemplate
   - Add to __all__

### Implementation

```python
# apps/quotes/models/template.py

from django.db import models
from django.core.validators import FileExtensionValidator


class QuoteTemplate(models.Model):
    """
    PDF template configuration for quote generation.
    
    Stores branding, styling, and layout settings for
    generating professional quote PDF documents.
    """
    
    # Tenant relationship
    tenant = models.ForeignKey(
        'tenants.Tenant',
        on_delete=models.CASCADE,
        related_name='quote_templates',
        help_text="Tenant this template belongs to"
    )
    
    # Basic info
    name = models.CharField(
        max_length=100,
        help_text="Template name (e.g., 'Professional Blue', 'Modern')"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Template description"
    )
    
    is_default = models.BooleanField(
        default=False,
        help_text="Use as default template for new quotes"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Template is available for use"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', 'name']
        verbose_name = "Quote Template"
        verbose_name_plural = "Quote Templates"
        constraints = [
            models.UniqueConstraint(
                fields=['tenant', 'name'],
                name='unique_template_name_per_tenant'
            ),
        ]
    
    def __str__(self):
        default_tag = " (Default)" if self.is_default else ""
        return f"{self.name}{default_tag} - {self.tenant.name}"
    
    @classmethod
    def get_default_template(cls, tenant):
        """
        Get default template for tenant.
        
        Args:
            tenant: Tenant instance
        
        Returns:
            QuoteTemplate: Default template or first active template
        """
        # Try to get default
        template = cls.objects.filter(
            tenant=tenant,
            is_default=True,
            is_active=True
        ).first()
        
        if not template:
            # Get any active template
            template = cls.objects.filter(
                tenant=tenant,
                is_active=True
            ).first()
        
        if not template:
            # Create default template
            template = cls.objects.create(
                tenant=tenant,
                name="Default Template",
                is_default=True,
                is_active=True
            )
        
        return template
    
    def save(self, *args, **kwargs):
        """Override save to ensure only one default per tenant."""
        if self.is_default:
            # Unset other defaults for this tenant
            QuoteTemplate.objects.filter(
                tenant=self.tenant,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        
        super().save(*args, **kwargs)
```

### Model Structure

```
QuoteTemplate
├── tenant (ForeignKey)
├── name (CharField)
├── description (TextField)
├── is_default (BooleanField)
├── is_active (BooleanField)
├── created_at (DateTimeField)
└── updated_at (DateTimeField)
```

### Expected Outcome
```
apps/quotes/models/
├── __init__.py
├── quote.py
├── line_item.py
├── history.py
├── settings.py
└── template.py              # New model
```

### Verification Checklist
- [ ] template.py file created
- [ ] QuoteTemplate model defined
- [ ] ForeignKey to Tenant
- [ ] name field (CharField)
- [ ] description field (TextField)
- [ ] is_default field (BooleanField)
- [ ] is_active field (BooleanField)
- [ ] Timestamps added
- [ ] Meta class with ordering
- [ ] Unique constraint on tenant + name
- [ ] __str__ method
- [ ] get_default_template() class method
- [ ] save() override for default management
- [ ] Imported in models __init__.py

---

## Task 54: Add Template Header Fields

### Overview
Add fields for template header section including logo, business information, and contact details.

### Dependencies
- Task 53: QuoteTemplate model exists

### Instructions

1. **Add logo field**
   - ImageField for company logo
   - Upload to 'quote_templates/logos/'
   - null=True, blank=True
   - Validators for image types

2. **Add business information fields**
   - business_name: CharField
   - business_address: TextField
   - business_city: CharField
   - business_postal_code: CharField
   - business_country: CharField (default='Sri Lanka')

3. **Add contact fields**
   - phone_number: CharField
   - email_address: EmailField
   - website: URLField (optional)

4. **Add registration fields (Sri Lanka context)**
   - company_registration_number: CharField
   - tax_registration_number: CharField (VAT/TIN)

5. **Add show/hide toggles**
   - show_logo: BooleanField
   - show_business_address: BooleanField
   - show_contact_info: BooleanField

### Implementation

```python
# Add to QuoteTemplate model

class QuoteTemplate(models.Model):
    # ... existing fields ...
    
    # ===== HEADER SECTION =====
    
    # Logo
    logo = models.ImageField(
        upload_to='quote_templates/logos/',
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['jpg', 'jpeg', 'png', 'svg']
            )
        ],
        help_text="Company logo for PDF header"
    )
    
    show_logo = models.BooleanField(
        default=True,
        help_text="Display logo in PDF header"
    )
    
    # Business information
    business_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Business name displayed on quote"
    )
    
    business_address = models.TextField(
        blank=True,
        help_text="Business address (multi-line)"
    )
    
    business_city = models.CharField(
        max_length=100,
        blank=True,
        help_text="City"
    )
    
    business_postal_code = models.CharField(
        max_length=20,
        blank=True,
        help_text="Postal/ZIP code"
    )
    
    business_country = models.CharField(
        max_length=100,
        default='Sri Lanka',
        help_text="Country"
    )
    
    show_business_address = models.BooleanField(
        default=True,
        help_text="Display business address in header"
    )
    
    # Contact information
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="Business phone number"
    )
    
    email_address = models.EmailField(
        blank=True,
        help_text="Business email address"
    )
    
    website = models.URLField(
        blank=True,
        help_text="Business website URL"
    )
    
    show_contact_info = models.BooleanField(
        default=True,
        help_text="Display contact information in header"
    )
    
    # Sri Lanka specific
    company_registration_number = models.CharField(
        max_length=50,
        blank=True,
        help_text="Company registration number"
    )
    
    tax_registration_number = models.CharField(
        max_length=50,
        blank=True,
        help_text="Tax/VAT registration number (TIN)"
    )
```

### Header Fields Layout

```
PDF Header Section:
┌─────────────────────────────────┐
│ [LOGO]     BUSINESS NAME        │
│            Address Line 1       │
│            City, Postal Code    │
│            Sri Lanka            │
│                                 │
│ Phone: +94 XX XXX XXXX         │
│ Email: info@business.lk        │
│ Web: www.business.lk           │
│                                 │
│ Reg No: ABC/123/2020           │
│ TIN: 123456789V                │
└─────────────────────────────────┘
```

### Usage Examples

```python
# Create template with header info
template = QuoteTemplate.objects.create(
    tenant=tenant,
    name="Professional Template",
    is_default=True,
    
    # Header fields
    business_name="ABC Trading (Pvt) Ltd",
    business_address="123, Galle Road\nColombo 03",
    business_city="Colombo",
    business_postal_code="00300",
    business_country="Sri Lanka",
    phone_number="+94 11 234 5678",
    email_address="info@abctrading.lk",
    website="https://www.abctrading.lk",
    company_registration_number="PV 12345",
    tax_registration_number="123456789V",
    
    show_logo=True,
    show_business_address=True,
    show_contact_info=True
)

# Upload logo
with open('logo.png', 'rb') as f:
    template.logo.save('logo.png', f)
```

### Expected Outcome
QuoteTemplate model now includes comprehensive header fields for professional business presentation on PDF quotes.

### Verification Checklist
- [ ] logo ImageField added
- [ ] show_logo toggle added
- [ ] business_name field added
- [ ] business_address TextField added
- [ ] business_city field added
- [ ] business_postal_code field added
- [ ] business_country field (default Sri Lanka)
- [ ] show_business_address toggle added
- [ ] phone_number field added
- [ ] email_address EmailField added
- [ ] website URLField added
- [ ] show_contact_info toggle added
- [ ] company_registration_number field added
- [ ] tax_registration_number field added

---

## Task 55: Add Template Styling Fields

### Overview
Add fields for customizing PDF appearance including colors, fonts, and visual theme.

### Dependencies
- Task 54: Header fields exist

### Instructions

1. **Add color fields**
   - primary_color: CharField for hex color
   - secondary_color: CharField for hex color
   - accent_color: CharField for accent elements
   - text_color: CharField for body text
   - Default color scheme provided

2. **Add font fields**
   - header_font: CharField with font choices
   - body_font: CharField with font choices
   - font_size: IntegerField (default 10)

3. **Add theme field**
   - theme: CharField with choices
   - Options: 'professional', 'modern', 'minimal', 'classic'

4. **Add border/spacing options**
   - show_borders: BooleanField
   - show_grid_lines: BooleanField
   - line_spacing: CharField with choices

5. **Add validation**
   - Validate hex color format
   - Ensure font size reasonable (8-14pt)

### Implementation

```python
# Add to QuoteTemplate model

from django.core.validators import RegexValidator

class QuoteTemplate(models.Model):
    # ... existing fields ...
    
    # ===== STYLING SECTION =====
    
    # Color scheme
    primary_color = models.CharField(
        max_length=7,
        default='#2563eb',  # Blue
        validators=[
            RegexValidator(
                regex=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                message='Enter a valid hex color code (e.g., #2563eb)'
            )
        ],
        help_text="Primary brand color (hex code)"
    )
    
    secondary_color = models.CharField(
        max_length=7,
        default='#64748b',  # Slate gray
        validators=[
            RegexValidator(
                regex=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                message='Enter a valid hex color code'
            )
        ],
        help_text="Secondary color (hex code)"
    )
    
    accent_color = models.CharField(
        max_length=7,
        default='#f59e0b',  # Amber
        validators=[
            RegexValidator(
                regex=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                message='Enter a valid hex color code'
            )
        ],
        help_text="Accent color for highlights (hex code)"
    )
    
    text_color = models.CharField(
        max_length=7,
        default='#1e293b',  # Dark slate
        validators=[
            RegexValidator(
                regex=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                message='Enter a valid hex color code'
            )
        ],
        help_text="Body text color (hex code)"
    )
    
    # Fonts
    FONT_CHOICES = [
        ('Helvetica', 'Helvetica'),
        ('Times-Roman', 'Times New Roman'),
        ('Courier', 'Courier'),
        ('Arial', 'Arial'),
    ]
    
    header_font = models.CharField(
        max_length=50,
        choices=FONT_CHOICES,
        default='Helvetica',
        help_text="Font for headings"
    )
    
    body_font = models.CharField(
        max_length=50,
        choices=FONT_CHOICES,
        default='Helvetica',
        help_text="Font for body text"
    )
    
    font_size = models.PositiveIntegerField(
        default=10,
        validators=[MinValueValidator(8), MaxValueValidator(14)],
        help_text="Base font size (8-14 points)"
    )
    
    # Theme
    THEME_CHOICES = [
        ('professional', 'Professional'),
        ('modern', 'Modern'),
        ('minimal', 'Minimal'),
        ('classic', 'Classic'),
    ]
    
    theme = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default='professional',
        help_text="Overall visual theme"
    )
    
    # Visual options
    show_borders = models.BooleanField(
        default=True,
        help_text="Show table borders"
    )
    
    show_grid_lines = models.BooleanField(
        default=False,
        help_text="Show grid lines in table"
    )
    
    LINE_SPACING_CHOICES = [
        ('compact', 'Compact'),
        ('normal', 'Normal'),
        ('relaxed', 'Relaxed'),
    ]
    
    line_spacing = models.CharField(
        max_length=20,
        choices=LINE_SPACING_CHOICES,
        default='normal',
        help_text="Line spacing in tables"
    )
```

### Color Schemes

| Theme | Primary | Secondary | Accent | Text |
|-------|---------|-----------|--------|------|
| Professional | #2563eb (Blue) | #64748b (Slate) | #f59e0b (Amber) | #1e293b (Dark) |
| Modern | #8b5cf6 (Purple) | #6b7280 (Gray) | #ec4899 (Pink) | #111827 (Black) |
| Minimal | #000000 (Black) | #9ca3af (Gray) | #6b7280 (Gray) | #374151 (Dark) |
| Classic | #1e3a8a (Navy) | #475569 (Slate) | #dc2626 (Red) | #1f2937 (Dark) |

### Usage Examples

```python
# Professional blue theme
template.primary_color = '#2563eb'
template.secondary_color = '#64748b'
template.accent_color = '#f59e0b'
template.text_color = '#1e293b'
template.header_font = 'Helvetica'
template.body_font = 'Helvetica'
template.font_size = 10
template.theme = 'professional'
template.show_borders = True
template.show_grid_lines = False
template.line_spacing = 'normal'
template.save()

# Modern minimal theme
template2 = QuoteTemplate.objects.create(
    tenant=tenant,
    name="Modern Minimal",
    primary_color='#8b5cf6',
    secondary_color='#6b7280',
    accent_color='#ec4899',
    text_color='#111827',
    header_font='Arial',
    body_font='Arial',
    font_size=11,
    theme='modern',
    show_borders=False,
    show_grid_lines=True,
    line_spacing='relaxed'
)
```

### Expected Outcome
PDF appearance can be fully customized per tenant with professional color schemes and typography options.

### Verification Checklist
- [ ] primary_color field with validator
- [ ] secondary_color field with validator
- [ ] accent_color field with validator
- [ ] text_color field with validator
- [ ] Default colors provided
- [ ] header_font field with choices
- [ ] body_font field with choices
- [ ] font_size field with validators
- [ ] theme field with choices
- [ ] show_borders toggle
- [ ] show_grid_lines toggle
- [ ] line_spacing field with choices

---

## Task 56: Add Template Content Fields

### Overview
Add fields for PDF content including footer text, terms and conditions, and custom messages.

### Dependencies
- Task 55: Styling fields exist

### Instructions

1. **Add footer fields**
   - footer_text: TextField for custom footer
   - show_footer: BooleanField
   - footer_alignment: CharField (left/center/right)

2. **Add terms fields**
   - terms_and_conditions: TextField
   - show_terms: BooleanField
   - terms_title: CharField (default "Terms & Conditions")

3. **Add notes fields**
   - default_thank_you_message: TextField
   - default_payment_instructions: TextField

4. **Add validity message**
   - validity_message_template: CharField
   - Template: "This quote is valid until {valid_until}"

5. **Add signature fields**
   - show_signature_line: BooleanField
   - signature_label: CharField
   - authorized_person_name: CharField
   - authorized_person_title: CharField

### Implementation

```python
# Add to QuoteTemplate model

class QuoteTemplate(models.Model):
    # ... existing fields ...
    
    # ===== CONTENT SECTION =====
    
    # Footer
    footer_text = models.TextField(
        blank=True,
        help_text="Custom footer text"
    )
    
    show_footer = models.BooleanField(
        default=True,
        help_text="Display footer section"
    )
    
    ALIGNMENT_CHOICES = [
        ('left', 'Left'),
        ('center', 'Center'),
        ('right', 'Right'),
    ]
    
    footer_alignment = models.CharField(
        max_length=10,
        choices=ALIGNMENT_CHOICES,
        default='center',
        help_text="Footer text alignment"
    )
    
    # Terms and conditions
    terms_and_conditions = models.TextField(
        blank=True,
        default="""Payment Terms:
- 50% advance payment required
- Balance payable on delivery
- VAT (15%) included in total amount

Delivery:
- Standard delivery within 7-10 business days
- Express delivery available at additional cost

Warranty:
- All products covered by manufacturer warranty
- Installation services available""",
        help_text="Standard terms and conditions"
    )
    
    show_terms = models.BooleanField(
        default=True,
        help_text="Display terms and conditions"
    )
    
    terms_title = models.CharField(
        max_length=100,
        default="Terms & Conditions",
        help_text="Title for terms section"
    )
    
    # Messages
    default_thank_you_message = models.TextField(
        blank=True,
        default="Thank you for your business!",
        help_text="Thank you message"
    )
    
    default_payment_instructions = models.TextField(
        blank=True,
        default="""Bank Details:
Bank: Bank of Ceylon
Account Name: ABC Trading (Pvt) Ltd
Account Number: 1234567890
Branch: Colombo Main Branch""",
        help_text="Payment instructions"
    )
    
    # Validity
    validity_message_template = models.CharField(
        max_length=200,
        default="This quotation is valid until {valid_until}",
        help_text="Validity message template (use {valid_until} placeholder)"
    )
    
    # Signature
    show_signature_line = models.BooleanField(
        default=True,
        help_text="Display signature line"
    )
    
    signature_label = models.CharField(
        max_length=100,
        default="Authorized Signature",
        help_text="Label for signature line"
    )
    
    authorized_person_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Name of person authorizing quote"
    )
    
    authorized_person_title = models.CharField(
        max_length=100,
        blank=True,
        help_text="Title/position of authorized person"
    )
```

### Content Sections Layout

```
PDF Content Sections:

┌──────────────────────────────────┐
│ [Line Items Table]               │
│ [Totals]                         │
├──────────────────────────────────┤
│ Terms & Conditions               │
│                                  │
│ Payment Terms:                   │
│ - 50% advance required           │
│ - Balance on delivery            │
│ - VAT (15%) included             │
│                                  │
│ Delivery: 7-10 business days     │
│ Warranty: Manufacturer warranty  │
├──────────────────────────────────┤
│ Payment Instructions             │
│                                  │
│ Bank: Bank of Ceylon             │
│ Account: ABC Trading             │
│ Acc #: 1234567890                │
├──────────────────────────────────┤
│ This quotation is valid until    │
│ 2026-02-15                       │
│                                  │
│ Thank you for your business!     │
├──────────────────────────────────┤
│ ________________________         │
│ Authorized Signature             │
│ John Doe, Sales Manager          │
└──────────────────────────────────┘
```

### Sri Lanka Specific Content

```python
# Sri Lankan payment terms
template.default_payment_instructions = """Bank Details:
Bank: Bank of Ceylon
Account Name: ABC Trading (Pvt) Ltd
Account Number: 1234567890
Branch: Colombo Main Branch
SWIFT: BCEYLKLX

Mobile Banking:
eZ Cash: 077 123 4567
Dialog Cash: 077 123 4567"""

# Bilingual terms (English + Sinhala)
template.terms_and_conditions = """Payment Terms / ගෙවීම් කොන්දේසි:
- 50% advance payment / 50% අත්තිකාරම් ගෙවීම
- Balance on delivery / ඉතිරිය බෙදා හැරීමේදී  
- VAT 15% included / වැට් 15% ඇතුළත්

Delivery / බෙදාහැරීම:
- 7-10 business days / වැඩ කරන දින 7-10
"""
```

### Expected Outcome
Template includes comprehensive content fields for professional quote documents with Sri Lankan payment methods.

### Verification Checklist
- [ ] footer_text TextField added
- [ ] show_footer toggle added
- [ ] footer_alignment choices added
- [ ] terms_and_conditions TextField added
- [ ] show_terms toggle added
- [ ] terms_title field added
- [ ] default_thank_you_message added
- [ ] default_payment_instructions added
- [ ] validity_message_template added
- [ ] show_signature_line toggle added
- [ ] signature_label field added
- [ ] authorized_person_name field added
- [ ] authorized_person_title field added
- [ ] Default content provided
- [ ] Sri Lankan context considered

---

## Task 57: Add Template Layout Options

### Overview
Add JSONField for flexible layout configuration including column visibility and section ordering.

### Dependencies
- Task 56: Content fields exist

### Instructions

1. **Add layout_options JSONField**
   - Store flexible configuration
   - Column visibility settings
   - Section ordering
   - Default configuration provided

2. **Define default layout structure**
   - Column visibility options
   - Section show/hide options
   - Page size and orientation

3. **Add helper methods**
   - get_visible_columns()
   - get_section_order()
   - is_section_visible()

4. **Add page settings**
   - page_size: CharField (A4, Letter)
   - page_orientation: CharField (portrait, landscape)
   - margin_top/bottom/left/right: IntegerField

### Implementation

```python
# Add to QuoteTemplate model

class QuoteTemplate(models.Model):
    # ... existing fields ...
    
    # ===== LAYOUT SECTION =====
    
    # Layout configuration
    layout_options = models.JSONField(
        default=dict,
        blank=True,
        help_text="Layout configuration (JSON)"
    )
    
    # Page settings
    PAGE_SIZE_CHOICES = [
        ('A4', 'A4 (210mm x 297mm)'),
        ('Letter', 'US Letter (8.5" x 11")'),
        ('Legal', 'US Legal (8.5" x 14")'),
    ]
    
    page_size = models.CharField(
        max_length=20,
        choices=PAGE_SIZE_CHOICES,
        default='A4',
        help_text="PDF page size"
    )
    
    ORIENTATION_CHOICES = [
        ('portrait', 'Portrait'),
        ('landscape', 'Landscape'),
    ]
    
    page_orientation = models.CharField(
        max_length=20,
        choices=ORIENTATION_CHOICES,
        default='portrait',
        help_text="Page orientation"
    )
    
    # Margins (in mm)
    margin_top = models.PositiveIntegerField(
        default=20,
        help_text="Top margin in mm"
    )
    
    margin_bottom = models.PositiveIntegerField(
        default=20,
        help_text="Bottom margin in mm"
    )
    
    margin_left = models.PositiveIntegerField(
        default=20,
        help_text="Left margin in mm"
    )
    
    margin_right = models.PositiveIntegerField(
        default=20,
        help_text="Right margin in mm"
    )
    
    def get_default_layout_options(self):
        """Get default layout options structure."""
        return {
            'columns': {
                'item_code': {'visible': True, 'order': 1, 'width': '15%'},
                'description': {'visible': True, 'order': 2, 'width': '35%'},
                'quantity': {'visible': True, 'order': 3, 'width': '10%'},
                'unit_price': {'visible': True, 'order': 4, 'width': '15%'},
                'discount': {'visible': True, 'order': 5, 'width': '10%'},
                'tax': {'visible': True, 'order': 6, 'width': '10%'},
                'total': {'visible': True, 'order': 7, 'width': '15%'},
            },
            'sections': {
                'header': {'visible': True, 'order': 1},
                'customer_info': {'visible': True, 'order': 2},
                'line_items': {'visible': True, 'order': 3},
                'totals': {'visible': True, 'order': 4},
                'terms': {'visible': True, 'order': 5},
                'payment_instructions': {'visible': True, 'order': 6},
                'signature': {'visible': True, 'order': 7},
                'footer': {'visible': True, 'order': 8},
            },
            'line_items': {
                'show_item_codes': True,
                'show_descriptions': True,
                'show_notes': True,
                'group_by_category': False,
            },
            'totals': {
                'show_subtotal': True,
                'show_discount': True,
                'show_tax_breakdown': True,
                'show_grand_total': True,
            }
        }
    
    def get_visible_columns(self):
        """Get list of visible columns in order."""
        layout = self.layout_options or self.get_default_layout_options()
        columns = layout.get('columns', {})
        
        visible = [
            (col, settings)
            for col, settings in columns.items()
            if settings.get('visible', True)
        ]
        
        # Sort by order
        visible.sort(key=lambda x: x[1].get('order', 999))
        
        return [col for col, _ in visible]
    
    def is_section_visible(self, section_name):
        """Check if section should be displayed."""
        layout = self.layout_options or self.get_default_layout_options()
        sections = layout.get('sections', {})
        
        section = sections.get(section_name, {})
        return section.get('visible', True)
    
    def save(self, *args, **kwargs):
        """Initialize layout_options if empty."""
        if not self.layout_options:
            self.layout_options = self.get_default_layout_options()
        
        super().save(*args, **kwargs)
```

### Layout Options Structure

```json
{
  "columns": {
    "item_code": {"visible": true, "order": 1, "width": "15%"},
    "description": {"visible": true, "order": 2, "width": "35%"},
    "quantity": {"visible": true, "order": 3, "width": "10%"},
    "unit_price": {"visible": true, "order": 4, "width": "15%"},
    "discount": {"visible": true, "order": 5, "width": "10%"},
    "tax": {"visible": true, "order": 6, "width": "10%"},
    "total": {"visible": true, "order": 7, "width": "15%"}
  },
  "sections": {
    "header": {"visible": true, "order": 1},
    "customer_info": {"visible": true, "order": 2},
    "line_items": {"visible": true, "order": 3},
    "totals": {"visible": true, "order": 4},
    "terms": {"visible": true, "order": 5},
    "payment_instructions": {"visible": true, "order": 6},
    "signature": {"visible": true, "order": 7},
    "footer": {"visible": true, "order": 8}
  },
  "line_items": {
    "show_item_codes": true,
    "show_descriptions": true,
    "show_notes": true,
    "group_by_category": false
  },
  "totals": {
    "show_subtotal": true,
    "show_discount": true,
    "show_tax_breakdown": true,
    "show_grand_total": true
  }
}
```

### Usage Examples

```python
# Create template with custom layout
template = QuoteTemplate.objects.create(
    tenant=tenant,
    name="Minimal Layout",
    page_size='A4',
    page_orientation='portrait',
    margin_top=15,
    margin_bottom=15,
    margin_left=15,
    margin_right=15
)

# Customize layout - hide discount column
layout = template.get_default_layout_options()
layout['columns']['discount']['visible'] = False
layout['columns']['tax']['visible'] = False
template.layout_options = layout
template.save()

# Check visible columns
visible_columns = template.get_visible_columns()
# ['item_code', 'description', 'quantity', 'unit_price', 'total']

# Check section visibility
if template.is_section_visible('signature'):
    # Include signature section in PDF
    pass
```

### Expected Outcome
Flexible layout configuration allowing per-template customization of columns, sections, and page settings.

### Verification Checklist
- [ ] layout_options JSONField added
- [ ] page_size field with choices
- [ ] page_orientation field with choices
- [ ] margin_top field added
- [ ] margin_bottom field added
- [ ] margin_left field added
- [ ] margin_right field added
- [ ] get_default_layout_options() method
- [ ] get_visible_columns() method
- [ ] is_section_visible() method
- [ ] save() override to initialize layout_options
- [ ] Default layout structure defined

---

## Task 58: Run QuoteTemplate Migrations

### Overview
Generate and apply database migrations for the QuoteTemplate model with all fields.

### Dependencies
- Tasks 53-57: QuoteTemplate model complete

### Instructions

1. **Review model completeness**
   - All fields added (basic, header, styling, content, layout)
   - All methods implemented
   - Imports correct

2. **Generate migrations**
   - Run: `python manage.py makemigrations quotes`
   - Review migration file
   - Should include CreateModel for QuoteTemplate

3. **Verify migration**
   - Check all fields included
   - Check validators present
   - Check defaults set

4. **Add data migration (optional)**
   - Create default template for existing tenants
   - Populate with sensible defaults

5. **Run migrations**
   - Execute: `python manage.py migrate quotes`
   - Verify success

6. **Test model**
   - Create QuoteTemplate instance
   - Test get_default_template()
   - Test layout methods

7. **Commit migrations**
   - Add to git
   - Descriptive commit message

### Migration Commands

```bash
# Generate migration
python manage.py makemigrations quotes

# View SQL (optional)
python manage.py sqlmigrate quotes 0004

# Apply migration
python manage.py migrate quotes

# Verify
python manage.py showmigrations quotes
```

### Test Operations

```python
# In Django shell
from apps.quotes.models import QuoteTemplate
from apps.tenants.models import Tenant

tenant = Tenant.objects.first()

# Create template
template = QuoteTemplate.objects.create(
    tenant=tenant,
    name="Professional Template",
    is_default=True,
    business_name="ABC Trading (Pvt) Ltd",
    business_address="123 Galle Road, Colombo 03",
    phone_number="+94 11 234 5678",
    primary_color="#2563eb",
    theme="professional"
)

# Test methods
assert template.get_visible_columns()
assert template.is_section_visible('header') == True
assert template.layout_options  # Should have default layout

# Get default template
default = QuoteTemplate.get_default_template(tenant)
assert default.is_default == True
```

### Expected Outcome
- quotes_quotetemplate table created
- All fields present
- Default template can be created
- Methods functional

### Verification Checklist
- [ ] Model complete with all fields
- [ ] makemigrations executed
- [ ] Migration file generated
- [ ] All fields in migration
- [ ] Validators included
- [ ] Defaults set
- [ ] migrate executed successfully
- [ ] Database table created
- [ ] Test template created successfully
- [ ] get_default_template() works
- [ ] get_visible_columns() works
- [ ] is_section_visible() works
- [ ] Migration committed to git

---

## Summary

After completing Tasks 53-58, the Quote module will have:

### QuoteTemplate Model
Complete PDF template configuration system with:
- Basic template management (name, default, active status)
- Header section (logo, business info, contact details)
- Styling options (colors, fonts, theme, borders)
- Content fields (footer, terms, messages, signature)
- Layout configuration (columns, sections, page settings)
- Helper methods for layout queries

### Key Features
- Per-tenant template customization
- Multiple templates per tenant
- One default template per tenant
- Sri Lankan business context (company reg, TIN)
- Flexible column visibility
- Configurable section ordering
- Professional color schemes
- Responsive layouts

### Database Schema
- quotes_quotetemplate table migrated
- All relationships functional
- Validation constraints active
- Default values set

### Next Steps
Proceed to [02_Tasks-59-64_PDF-Generator-Sections.md](02_Tasks-59-64_PDF-Generator-Sections.md) to implement the PDF generation service using these templates.
