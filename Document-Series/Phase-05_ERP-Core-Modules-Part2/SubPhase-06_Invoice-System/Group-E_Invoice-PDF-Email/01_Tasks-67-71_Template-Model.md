# Tasks 67-71: Invoice Template Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** E - Invoice PDF & Email  
> **Document:** 01 of 03  
> **Tasks Covered:** 67, 68, 69, 70, 71

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-72-77_PDF-Generator.md](02_Tasks-72-77_PDF-Generator.md)

---

## Document Overview

This document covers the InvoiceTemplate model creation for storing PDF customization settings per tenant.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create InvoiceTemplate Model | Medium | 25 min |
| 68 | Add Template Header Fields | Medium | 20 min |
| 69 | Add Template Styling Fields | Medium | 20 min |
| 70 | Add Template Footer Fields | Medium | 20 min |
| 71 | Run InvoiceTemplate Migrations | Low | 15 min |

---

## Task 67: Create InvoiceTemplate Model

### Overview
Create the InvoiceTemplate model to store PDF template configurations and branding settings for each tenant.

### Dependencies
- Phase 02, Task 15: Tenant Model

### Instructions

1. **Create model file**
   - Create `apps/invoices/models/invoice_template.py`
   - Import base classes and dependencies

2. **Define InvoiceTemplate model**
   - OneToOne relationship to Tenant
   - Store PDF customization settings
   - Inherit from models.Model

3. **Add basic fields**
   - tenant: OneToOneField to Tenant
   - name: CharField (template name)
   - is_active: BooleanField (default: True)
   - is_default: BooleanField (default: False)

4. **Add timestamps**
   - created_at: DateTimeField (auto_now_add)
   - updated_at: DateTimeField (auto_now)

5. **Add model methods**
   - `__str__()`: Return template name
   - `get_absolute_url()`: URL to template detail

6. **Add Meta class**
   - db_table: 'invoice_templates'
   - ordering: ['-is_default', 'name']
   - verbose_name: 'Invoice Template'

### Model Structure

```python
class InvoiceTemplate(models.Model):
    tenant = models.OneToOneField(
        Tenant,
        on_delete=models.CASCADE,
        related_name='invoice_template'
    )
    name = models.CharField(max_length=100, default='Default Template')
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=True)
    
    # Header fields (Task 68)
    # Styling fields (Task 69)
    # Footer fields (Task 70)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'invoice_templates'
        ordering = ['-is_default', 'name']
        verbose_name = 'Invoice Template'
        verbose_name_plural = 'Invoice Templates'
    
    def __str__(self):
        return f"{self.tenant.name} - {self.name}"
```

### Expected Outcome
- InvoiceTemplate model created
- Basic structure in place
- Ready for additional fields

### Verification Checklist
- [ ] Model file created
- [ ] OneToOne relationship to Tenant
- [ ] Basic fields added
- [ ] Meta class defined
- [ ] Model methods added

---

## Task 68: Add Template Header Fields

### Overview
Add fields to InvoiceTemplate for header customization including logo, business information, and registration numbers.

### Dependencies
- Task 67: Create InvoiceTemplate Model

### Instructions

1. **Add logo field**
   - logo: ImageField (upload_to='invoice_templates/logos/')
   - Optional/nullable
   - Recommended size: 200x100px

2. **Add business information**
   - business_name: CharField (max_length=200)
   - business_address: TextField
   - business_phone: CharField (max_length=20)
   - business_email: EmailField
   - business_website: URLField (optional)

3. **Add registration numbers**
   - business_registration_number: CharField (BRN)
   - vat_registration_number: CharField (VAT/TIN)
   - svat_registration_number: CharField (SVAT if applicable)

4. **Add display toggles**
   - show_logo: BooleanField (default: True)
   - show_brn: BooleanField (default: True)
   - show_vat: BooleanField (default: True)
   - show_website: BooleanField (default: False)

5. **Add help text**
   - Provide guidance for each field
   - Specify format requirements
   - Add Sri Lankan context

### Header Fields

```python
# Header Configuration
logo = models.ImageField(
    upload_to='invoice_templates/logos/',
    null=True,
    blank=True,
    help_text='Company logo (recommended: 200x100px)'
)
business_name = models.CharField(
    max_length=200,
    help_text='Company name as it should appear on invoices'
)
business_address = models.TextField(
    help_text='Complete business address'
)
business_phone = models.CharField(
    max_length=20,
    help_text='Contact phone number'
)
business_email = models.EmailField(
    help_text='Business email address'
)
business_website = models.URLField(
    blank=True,
    help_text='Company website (optional)'
)
business_registration_number = models.CharField(
    max_length=50,
    blank=True,
    help_text='BRN (Business Registration Number)'
)
vat_registration_number = models.CharField(
    max_length=50,
    blank=True,
    help_text='VAT/TIN registration number'
)
svat_registration_number = models.CharField(
    max_length=50,
    blank=True,
    help_text='SVAT registration number (if applicable)'
)

# Display Options
show_logo = models.BooleanField(default=True)
show_brn = models.BooleanField(default=True)
show_vat = models.BooleanField(default=True)
show_website = models.BooleanField(default=False)
```

### Expected Outcome
- Header fields added to model
- Display options configured
- Sri Lankan compliance fields included

### Verification Checklist
- [ ] Logo field added
- [ ] Business information fields added
- [ ] Registration number fields added
- [ ] Display toggles added
- [ ] Help text provided

---

## Task 69: Add Template Styling Fields

### Overview
Add fields for PDF styling customization including colors, fonts, and layout options.

### Dependencies
- Task 68: Add Template Header Fields

### Instructions

1. **Add color fields**
   - primary_color: CharField (hex color, default: '#007bff')
   - accent_color: CharField (hex color, default: '#6c757d')
   - text_color: CharField (hex color, default: '#212529')
   - background_color: CharField (hex color, default: '#ffffff')

2. **Add font fields**
   - font_family: CharField (choices: FONT_CHOICES)
   - font_size: IntegerField (default: 10)
   - heading_font_size: IntegerField (default: 14)

3. **Add layout options**
   - page_size: CharField (choices: 'A4', 'Letter', default: 'A4')
   - page_orientation: CharField (choices: 'portrait', 'landscape')
   - margin_top: IntegerField (mm, default: 20)
   - margin_bottom: IntegerField (mm, default: 20)
   - margin_left: IntegerField (mm, default: 15)
   - margin_right: IntegerField (mm, default: 15)

4. **Add style toggles**
   - use_borders: BooleanField (default: True)
   - use_shading: BooleanField (default: True)
   - show_grid: BooleanField (default: False)

5. **Add font choices**
   - Define FONT_CHOICES constant
   - Include web-safe fonts
   - Include fonts supporting Sinhala/Tamil

### Styling Fields

```python
# Color Configuration
primary_color = models.CharField(
    max_length=7,
    default='#007bff',
    help_text='Primary brand color (hex format)'
)
accent_color = models.CharField(
    max_length=7,
    default='#6c757d',
    help_text='Accent/secondary color'
)
text_color = models.CharField(
    max_length=7,
    default='#212529',
    help_text='Main text color'
)
background_color = models.CharField(
    max_length=7,
    default='#ffffff',
    help_text='Background color'
)

# Font Configuration
FONT_CHOICES = [
    ('Arial', 'Arial'),
    ('Helvetica', 'Helvetica'),
    ('Times', 'Times New Roman'),
    ('Courier', 'Courier'),
    ('Noto Sans', 'Noto Sans (Unicode)'),
    ('Roboto', 'Roboto'),
]
font_family = models.CharField(
    max_length=50,
    choices=FONT_CHOICES,
    default='Arial'
)
font_size = models.IntegerField(default=10)
heading_font_size = models.IntegerField(default=14)

# Page Layout
PAGE_SIZE_CHOICES = [
    ('A4', 'A4 (210 x 297 mm)'),
    ('Letter', 'Letter (8.5 x 11 in)'),
]
page_size = models.CharField(
    max_length=10,
    choices=PAGE_SIZE_CHOICES,
    default='A4'
)
page_orientation = models.CharField(
    max_length=10,
    choices=[('portrait', 'Portrait'), ('landscape', 'Landscape')],
    default='portrait'
)
margin_top = models.IntegerField(default=20, help_text='Top margin in mm')
margin_bottom = models.IntegerField(default=20, help_text='Bottom margin in mm')
margin_left = models.IntegerField(default=15, help_text='Left margin in mm')
margin_right = models.IntegerField(default=15, help_text='Right margin in mm')

# Style Options
use_borders = models.BooleanField(default=True)
use_shading = models.BooleanField(default=True)
show_grid = models.BooleanField(default=False)
```

### Expected Outcome
- Styling fields added
- Color customization supported
- Font and layout options available

### Verification Checklist
- [ ] Color fields added
- [ ] Font fields added
- [ ] Layout fields added
- [ ] Style toggles added
- [ ] Choices defined

---

## Task 70: Add Template Footer Fields

### Overview
Add fields for footer customization including bank details, payment instructions, terms, and signature.

### Dependencies
- Task 69: Add Template Styling Fields

### Instructions

1. **Add bank details**
   - bank_name: CharField
   - account_name: CharField
   - account_number: CharField
   - branch: CharField
   - swift_code: CharField (optional, for international)

2. **Add payment instructions**
   - payment_instructions: TextField
   - Default text for LKR payments

3. **Add terms and conditions**
   - terms_and_conditions: TextField
   - Default legal terms

4. **Add signature fields**
   - signature_image: ImageField (optional)
   - authorized_signatory: CharField
   - signatory_designation: CharField

5. **Add footer toggles**
   - show_bank_details: BooleanField (default: True)
   - show_terms: BooleanField (default: True)
   - show_signature: BooleanField (default: False)

6. **Add footer text**
   - footer_text: TextField (optional)
   - Example: "Thank you for your business"

### Footer Fields

```python
# Bank Details
bank_name = models.CharField(
    max_length=100,
    blank=True,
    help_text='Bank name for payments'
)
account_name = models.CharField(
    max_length=200,
    blank=True,
    help_text='Account holder name'
)
account_number = models.CharField(
    max_length=50,
    blank=True,
    help_text='Bank account number'
)
branch = models.CharField(
    max_length=100,
    blank=True,
    help_text='Bank branch'
)
swift_code = models.CharField(
    max_length=20,
    blank=True,
    help_text='SWIFT/BIC code (for international payments)'
)

# Payment Instructions
payment_instructions = models.TextField(
    blank=True,
    default='Please make payment via bank transfer to the account details shown above. '
            'Include invoice number as payment reference.',
    help_text='Instructions for customers on how to make payment'
)

# Terms and Conditions
terms_and_conditions = models.TextField(
    blank=True,
    default='1. Payment is due within the specified period.\n'
            '2. Late payments may incur additional charges.\n'
            '3. Goods remain property of seller until full payment received.',
    help_text='Standard terms and conditions'
)

# Signature
signature_image = models.ImageField(
    upload_to='invoice_templates/signatures/',
    null=True,
    blank=True,
    help_text='Authorized signature image'
)
authorized_signatory = models.CharField(
    max_length=100,
    blank=True,
    help_text='Name of authorized signatory'
)
signatory_designation = models.CharField(
    max_length=100,
    blank=True,
    help_text='Designation/title of signatory'
)

# Footer Options
show_bank_details = models.BooleanField(default=True)
show_terms = models.BooleanField(default=True)
show_signature = models.BooleanField(default=False)
footer_text = models.TextField(
    blank=True,
    help_text='Additional footer text (e.g., "Thank you for your business")'
)
```

### Expected Outcome
- Footer fields added
- Bank details structure defined
- Payment and terms fields included
- Signature support added

### Verification Checklist
- [ ] Bank detail fields added
- [ ] Payment instructions field added
- [ ] Terms and conditions field added
- [ ] Signature fields added
- [ ] Footer toggles added
- [ ] Default values set

---

## Task 71: Run InvoiceTemplate Migrations

### Overview
Generate and apply database migrations for the InvoiceTemplate model.

### Dependencies
- Tasks 67-70: All InvoiceTemplate fields

### Instructions

1. **Generate migration**
   - Run `python manage.py makemigrations invoices`
   - Review generated migration file

2. **Verify migration**
   - Check all fields included
   - Verify field types and constraints
   - Check default values

3. **Run migration**
   - Run `python manage.py migrate invoices`
   - Verify successful application

4. **Create default templates**
   - Create data migration
   - Auto-create template for existing tenants
   - Set default values

5. **Verify database**
   - Check table created
   - Check all columns present
   - Test template creation

### Expected Outcome
```
apps/invoices/migrations/
└── 0005_invoice_template.py

Database:
└── invoice_templates table created
```

### Verification Checklist
- [ ] Migration generated
- [ ] Migration applied
- [ ] Table created
- [ ] Default templates created
- [ ] Test creation works

---

## Summary

**Key Deliverables:**
- InvoiceTemplate model with comprehensive customization options
- Header, styling, and footer fields
- Database migrations applied

**Next Steps:**
- Proceed to [02_Tasks-72-77_PDF-Generator.md](02_Tasks-72-77_PDF-Generator.md)
