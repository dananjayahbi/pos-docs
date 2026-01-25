# Tasks 28-32: PayslipTemplate Model and PDF Configuration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** B - PDF Template Design  
> **Document:** 02 of 02  
> **Tasks Covered:** 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-27_Line-Item-Models.md](01_Tasks-17-27_Line-Item-Models.md)

---

## Document Overview

This document covers the PayslipTemplate model that enables tenant-level customization of payslip PDF appearance. Tenants can configure company branding, statutory registration numbers, footer text, color schemes, display preferences, and paper size selection. This ensures each tenant can generate professional, branded payslips that meet their specific requirements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 28 | Create PayslipTemplate Model | Medium | 25 min |
| 29 | Add Template Company Details | Medium | 20 min |
| 30 | Add Template Footer Fields | Low | 15 min |
| 31 | Add Template Style Fields | Low | 15 min |
| 32 | Run Template Migrations | Low | 15 min |

---

## Task 28: Create PayslipTemplate Model

### Overview
Create the PayslipTemplate model that stores tenant-specific PDF template configurations. This model provides a centralized location for all payslip appearance settings, ensuring consistent branding across all payslips generated for a tenant. Each tenant has one template that controls every aspect of their payslip PDF design.

### Dependencies
- Payslip app structure exists
- Tenant model (Client) available
- Django ORM configured
- Base model mixins available

### Instructions

1. **Create payslip_template.py model file**
   - Navigate to `apps/payslip/models/` directory
   - Create new file named `payslip_template.py`
   - This will contain the PayslipTemplate model

2. **Import required Django components**
   - Import models module from django.db
   - Import field types: CharField, TextField, EmailField, ImageField, BooleanField
   - Import model field options and validators

3. **Import base mixins**
   - Import TimestampMixin for created_at/updated_at
   - These provide automatic timestamp management
   - Consistent with other models in the system

4. **Import tenant model**
   - Import Client model from tenants app
   - Required for OneToOneField relationship
   - Links template to specific tenant

5. **Define PayslipTemplate model class**
   - Inherit from TimestampMixin and models.Model
   - Add comprehensive model docstring
   - Explain purpose: tenant-specific PDF customization

6. **Add tenant relationship field**
   - OneToOneField to Client model
   - on_delete=CASCADE (template deleted with tenant)
   - related_name='payslip_template'
   - Ensures one template per tenant

7. **Add is_active field**
   - BooleanField, default=True
   - Controls whether template is in use
   - Inactive templates prevent PDF generation
   - Useful for template maintenance

8. **Add internal_notes field**
   - TextField, optional (blank=True, null=True)
   - Internal documentation for template configuration
   - Track customization history and decisions
   - Not visible on generated payslips

9. **Add Meta class configuration**
   - Set verbose_name = 'Payslip Template'
   - Set verbose_name_plural = 'Payslip Templates'
   - Add ordering = ['tenant__name']
   - Add db_table for explicit table naming

10. **Implement __str__ method**
    - Return format: "Payslip Template - {tenant_name}"
    - Provides clear identification in admin and logs
    - Include active status indicator

11. **Add get_absolute_url method**
    - Return URL for template detail view
    - Useful for admin integration
    - Support future template preview functionality

12. **Update models/__init__.py**
    - Import PayslipTemplate class
    - Add to __all__ list for proper module exposure
    - Ensure model registration with Django

### PayslipTemplate Model Structure

```
┌─────────────────────────────────────────────────────────┐
│              PayslipTemplate Model                      │
├─────────────────────────────────────────────────────────┤
│ Core Fields:                                            │
│  • tenant (OneToOneField → Client)                      │
│  • is_active (BooleanField)                             │
│  • internal_notes (TextField, optional)                 │
│                                                         │
│ Company Details Fields (Task 29):                       │
│  • company_name, company_logo, company_address          │
│  • company_phone, company_email                         │
│  • epf_number, etf_number                               │
│                                                         │
│ Footer Fields (Task 30):                                │
│  • footer_text, disclaimer_text                         │
│                                                         │
│ Style Fields (Task 31):                                 │
│  • primary_color, secondary_color                       │
│  • show_employer_contributions, show_ytd                │
│  • show_bank_details, paper_size                        │
│                                                         │
│ Inherited from TimestampMixin:                          │
│  • created_at (DateTimeField, auto_now_add)             │
│  • updated_at (DateTimeField, auto_now)                 │
└─────────────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────────┐       1:1        ┌──────────────────────┐
│  Client (Tenant) │◄─────────────────│  PayslipTemplate     │
└──────────────────┘                  └──────────────────────┘
                                               │
                                               │ Referenced by
                                               ▼
                                      ┌──────────────────────┐
                                      │  Payslip (PDF Gen)   │
                                      │   Uses template for  │
                                      │   PDF rendering      │
                                      └──────────────────────┘
```

### Template Lifecycle

```
Template Creation Flow
══════════════════════

1. Tenant Registration
   └─→ Create default PayslipTemplate
       └─→ Set sensible defaults
           └─→ Use tenant's basic info

2. Template Customization
   └─→ Admin/HR updates fields
       └─→ Upload company logo
           └─→ Configure colors/display

3. Template Usage
   └─→ Payslip generation
       └─→ Fetch tenant's template
           └─→ Apply to PDF rendering

4. Template Maintenance
   └─→ Seasonal updates
       └─→ Branding changes
           └─→ Version tracking
```

### OneToOne Relationship Benefits

| Benefit | Description |
|---------|-------------|
| Data Integrity | Each tenant has exactly one template |
| Simple Queries | Direct access: `tenant.payslip_template` |
| Cascading Delete | Template removed when tenant deleted |
| Efficient Storage | No redundant template records |
| Clear Ownership | Explicit tenant-template binding |

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| tenant | OneToOneField | Yes | - | Links to specific tenant |
| is_active | BooleanField | Yes | True | Template availability |
| internal_notes | TextField | No | null | Admin documentation |

### Usage Scenarios

#### Scenario 1: New Tenant Onboarding
```
When new tenant registered:
1. Create Client record
2. Auto-create PayslipTemplate
3. Populate with tenant defaults:
   - company_name from tenant
   - default colors
   - standard paper size (A4)
4. Flag for customization
```

#### Scenario 2: Template Customization
```
HR Manager customizes template:
1. Access tenant's template
2. Upload company logo
3. Set brand colors
4. Configure display options
5. Add statutory numbers
6. Save and activate
```

#### Scenario 3: Payslip Generation
```
When generating payslip:
1. Fetch employee's tenant
2. Retrieve tenant.payslip_template
3. Check is_active = True
4. Apply template to PDF:
   - Use logo, colors
   - Apply display settings
   - Format with company info
5. Generate branded PDF
```

#### Scenario 4: Temporary Deactivation
```
During template updates:
1. Set is_active = False
2. Prevent new payslip generation
3. Update template settings
4. Test changes
5. Set is_active = True
6. Resume normal operations
```

### Expected Outcome
- Functional PayslipTemplate model
- OneToOne relationship with tenant
- Active/inactive control mechanism
- Foundation for company branding
- Ready for detailed field additions

### Verification Checklist
- [ ] payslip_template.py file created
- [ ] PayslipTemplate class defined
- [ ] Imports complete (Django, mixins, Client)
- [ ] tenant field as OneToOneField
- [ ] is_active field added
- [ ] internal_notes field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] get_absolute_url method added
- [ ] Model imported in models/__init__.py

---

## Task 29: Add Template Company Details

### Overview
Add company identification and contact information fields to the PayslipTemplate model. These fields capture the branding elements and statutory registration numbers that appear on generated payslips, ensuring professional, legally compliant documents.

### Dependencies
- Task 28: Create PayslipTemplate model

### Instructions

1. **Open payslip_template.py model file**
   - Navigate to `apps/payslip/models/payslip_template.py`
   - Locate PayslipTemplate class definition

2. **Add company_name field**
   - CharField, max_length=200
   - Required field (blank=False, null=False)
   - Appears in payslip header
   - Can override tenant's default name

3. **Add company_logo field**
   - ImageField
   - Optional (blank=True, null=True)
   - upload_to='payslip_templates/logos/'
   - Appears at top of payslip
   - Supported formats: PNG, JPG

4. **Add company_address field**
   - TextField
   - Required field for legal compliance
   - Multi-line address format
   - Appears in header section

5. **Add company_phone field**
   - CharField, max_length=20
   - Optional (blank=True, null=True)
   - International format: +94 11 234 5678
   - Contact information for employees

6. **Add company_email field**
   - EmailField
   - Optional (blank=True, null=True)
   - max_length=100
   - HR contact email for queries

7. **Add epf_number field**
   - CharField, max_length=50
   - Optional but recommended (blank=True, null=True)
   - Employees' Provident Fund registration
   - Required for statutory compliance

8. **Add etf_number field**
   - CharField, max_length=50
   - Optional but recommended (blank=True, null=True)
   - Employees' Trust Fund registration
   - Required for statutory compliance

9. **Add help text to statutory fields**
   - Add help_text parameter to epf_number
   - Add help_text parameter to etf_number
   - Guide users on proper format

10. **Update model docstring**
    - Document company details section
    - Explain purpose of each field group
    - Note statutory compliance requirements

### Company Details Field Structure

```
┌──────────────────────────────────────────────────────┐
│         Company Details Section                      │
├──────────────────────────────────────────────────────┤
│ Branding Fields:                                     │
│  • company_name (CharField, 200)                     │
│  • company_logo (ImageField, optional)               │
│                                                      │
│ Contact Information:                                 │
│  • company_address (TextField)                       │
│  • company_phone (CharField, 20, optional)           │
│  • company_email (EmailField, optional)              │
│                                                      │
│ Statutory Registration:                              │
│  • epf_number (CharField, 50, optional)              │
│  • etf_number (CharField, 50, optional)              │
└──────────────────────────────────────────────────────┘
```

### Payslip Header Layout with Company Details

```
┌────────────────────────────────────────────────────────┐
│                     [COMPANY LOGO]                     │  ← company_logo
│                                                        │
│                LANKA COMMERCE PVT LTD                  │  ← company_name
│              123, Galle Road, Colombo 03               │  ← company_address
│                     Sri Lanka                          │     (line 2)
│        Tel: +94 11 234 5678  │  EPF: C/12345          │  ← company_phone, epf_number
│     Email: hr@lankacommerce.lk  │  ETF: E/6789        │  ← company_email, etf_number
│                                                        │
├────────────────────────────────────────────────────────┤
│                    SALARY SLIP                         │
│                                                        │
│  Employee Details...                                   │
└────────────────────────────────────────────────────────┘
```

### Company Logo Specifications

```
Logo Requirements
═════════════════

Recommended Dimensions:
┌──────────────────┐
│                  │
│    200 x 100px   │  ← Landscape format (2:1 ratio)
│                  │
└──────────────────┘

Alternative Dimensions:
┌─────────┐
│         │
│ 150x150 │  ← Square format
│         │
└─────────┘

File Format:
• PNG (with transparency) - Recommended
• JPEG (for photos)
• Max file size: 2MB
• Resolution: 150 DPI minimum

Placement:
• Centered at top of payslip
• Scaled to fit within header
• Maintains aspect ratio
```

### Company Address Format Examples

#### Standard Business Address
```
Lanka Commerce Pvt Ltd
123, Galle Road, Level 5
Colombo 03
Sri Lanka
```

#### Multi-Location Company
```
Head Office:
LankaCommerce Group
No. 45, Duplication Road
Colombo 04, Sri Lanka

Branch: Kandy
```

#### Industrial Zone Address
```
Lanka Manufacturing Ltd
Plot 15, Katunayake Export Processing Zone
Seeduwa
Sri Lanka
```

### Statutory Registration Numbers

#### EPF (Employees' Provident Fund) Number
```
Format: C/XXXXX or A/XXXXX
Examples:
- C/12345  (Company registration)
- A/67890  (Alternate format)

Usage:
• Required for EPF contribution reporting
• Appears on payslip for transparency
• Links to EPF member accounts
• Validates compliance with EPF Act
```

#### ETF (Employees' Trust Fund) Number
```
Format: E/XXXXX
Examples:
- E/6789
- E/12345

Usage:
• Required for ETF contribution reporting
• Separate from EPF number
• Validates compliance with ETF Act
• Required for all employers with 15+ employees
```

### Field Details Table

| Field | Type | Max Length | Required | Purpose |
|-------|------|------------|----------|---------|
| company_name | CharField | 200 | Yes | Primary business identifier |
| company_logo | ImageField | - | No | Brand recognition |
| company_address | TextField | - | Yes | Legal address requirement |
| company_phone | CharField | 20 | No | Employee contact channel |
| company_email | EmailField | 100 | No | HR query contact |
| epf_number | CharField | 50 | No | EPF registration ID |
| etf_number | CharField | 50 | No | ETF registration ID |

### Usage Scenarios

#### Scenario 1: Corporate Professional Services
```
Company: Lanka Consulting Partners
Logo: Professional shield emblem
Address: 25th Floor, World Trade Center, Colombo 01
Phone: +94 11 234 5678
Email: payroll@lankaconsulting.lk
EPF: C/25896
ETF: E/14523

Payslip Style: Clean, corporate, full details
```

#### Scenario 2: Manufacturing Company
```
Company: Ceylon Garments Ltd
Logo: Fabric/textile icon
Address: EPZ Plot 22, Biyagama
Phone: +94 33 229 8765
Email: hr@ceylongarments.lk
EPF: C/78452
ETF: E/36521

Payslip Style: Industrial, practical, compliance-focused
```

#### Scenario 3: Retail Chain
```
Company: QuickMart Supermarkets
Logo: Shopping cart logo
Address: Head Office, 456 Kandy Road, Colombo 10
Phone: +94 11 555 1234
Email: hr@quickmart.lk
EPF: C/96325
ETF: E/48756

Payslip Style: Retail-branded, employee-friendly
```

#### Scenario 4: Tech Startup
```
Company: TechInnovate Lanka
Logo: Modern geometric design
Address: Level 3, Innovation Hub, Colombo 07
Phone: +94 77 789 4561
Email: people@techinnovate.lk
EPF: C/14785  (once registered)
ETF: E/85236  (once applicable)

Payslip Style: Modern, minimal, tech-forward
```

### Compliance Requirements for Sri Lanka

#### EPF Registration
```
Mandatory when:
• Employer has 5+ employees
• Employees earn > Rs. 1,000/month (historically, now higher)
• Permanent and contract employees covered

Exemptions:
• Foreign employees (under certain conditions)
• Casual workers
• Employees under other provident fund schemes
```

#### ETF Registration
```
Mandatory when:
• Employer has 15+ employees
• Employees earn above threshold
• Monthly basis calculation

Rate:
• Employer contributes 3% of gross salary
• No employee contribution
• Separate from EPF
```

### Logo Upload and Storage

```
File Upload Flow
════════════════

1. Admin uploads logo
   └─→ Validate file format (PNG/JPG)
       └─→ Check file size (< 2MB)
           └─→ Validate dimensions

2. Storage
   └─→ Save to: media/payslip_templates/logos/
       └─→ Filename: tenant_{id}_logo.{ext}
           └─→ Overwrite existing on update

3. Retrieval
   └─→ Access via template.company_logo.url
       └─→ Serve via web server
           └─→ Cache for performance

4. PDF Generation
   └─→ Load image from storage
       └─→ Resize/scale as needed
           └─→ Embed in PDF header
```

### Expected Outcome
- Complete company identification on payslips
- Professional branding with logo
- Full contact information for employees
- Statutory compliance with EPF/ETF numbers
- Legal address requirements met

### Verification Checklist
- [ ] company_name field added
- [ ] company_logo field added with upload_to
- [ ] company_address field added
- [ ] company_phone field added
- [ ] company_email field added with validation
- [ ] epf_number field added with help_text
- [ ] etf_number field added with help_text
- [ ] All required fields marked correctly
- [ ] Optional fields allow blank/null
- [ ] Model docstring updated

---

## Task 30: Add Template Footer Fields

### Overview
Add footer and disclaimer text fields to the PayslipTemplate model. These fields allow tenants to add important legal disclaimers, confidentiality notices, and contact information at the bottom of generated payslips.

### Dependencies
- Task 29: Add template company details

### Instructions

1. **Open payslip_template.py model file**
   - Continue in `apps/payslip/models/payslip_template.py`
   - Locate PayslipTemplate class

2. **Add footer_text field**
   - TextField
   - Optional (blank=True, null=True)
   - Appears at bottom of payslip
   - General information or instructions

3. **Add footer_text help text**
   - Provide clear guidance
   - Suggest use cases: contact info, website
   - Note: appears above disclaimer

4. **Add disclaimer_text field**
   - TextField
   - Optional (blank=True, null=True)
   - Legal disclaimer and confidentiality notice
   - Appears below footer_text

5. **Add disclaimer_text help text**
   - Guide on legal requirements
   - Suggest standard disclaimers
   - Note: final text on payslip

6. **Add show_footer field**
   - BooleanField, default=True
   - Controls footer_text visibility
   - Allows hiding footer if empty

7. **Add show_disclaimer field**
   - BooleanField, default=True
   - Controls disclaimer_text visibility
   - Allows hiding disclaimer if not needed

8. **Update model docstring**
   - Document footer configuration section
   - Explain footer vs disclaimer usage
   - Note visibility controls

### Footer Section Field Structure

```
┌────────────────────────────────────────────────────┐
│          Footer Configuration Fields               │
├────────────────────────────────────────────────────┤
│ Content Fields:                                    │
│  • footer_text (TextField, optional)               │
│  • disclaimer_text (TextField, optional)           │
│                                                    │
│ Display Control:                                   │
│  • show_footer (BooleanField, default=True)        │
│  • show_disclaimer (BooleanField, default=True)    │
└────────────────────────────────────────────────────┘
```

### Payslip Footer Layout

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Earnings/Deductions/Net Pay sections above]     │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  FOOTER SECTION                                    │  ← footer_text
│  ─────────────                                     │
│  For any queries regarding this payslip, please    │
│  contact the HR Department at hr@company.lk or     │
│  call +94 11 234 5678 during office hours.         │
│                                                    │
│  Visit our employee portal: www.company.lk/hr      │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  DISCLAIMER                                        │  ← disclaimer_text
│  ──────────                                        │
│  This payslip is computer-generated and does not   │
│  require a signature. It is confidential and       │
│  intended solely for the named employee.           │
│                                                    │
│  EPF/ETF contributions are remitted to the         │
│  respective funds as per Sri Lanka labor laws.     │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Footer Text Examples

#### Example 1: Contact Information Focus
```
Footer Text:
─────────────
For payslip queries:
• Email: payroll@lankacommerce.lk
• Phone: +94 11 234 5678 (Ext: 125)
• Office Hours: Monday-Friday, 9:00 AM - 5:00 PM

Employee Portal: https://hr.lankacommerce.lk
```

#### Example 2: Benefits Reminder
```
Footer Text:
─────────────
Reminder: Your benefits include medical insurance, 
annual bonus eligibility, and EPF/ETF contributions.

Review your employment contract for full details.
Questions? Contact HR at hr@company.lk
```

#### Example 3: Payroll Schedule
```
Footer Text:
─────────────
Salary Payment Schedule:
Monthly salaries are paid on the last working day 
of each month via direct bank transfer.

For payment issues, contact Finance Department
Email: finance@company.lk | Phone: +94 11 234 5678
```

#### Example 4: Multi-language Support
```
Footer Text:
─────────────
වැටුප් විමසීම් සඳහා / For Salary Queries:
HR Department: hr@company.lk
+94 11 234 5678

சம்பள விசாரணைகளுக்கு / For Salary Queries:
HR பிரிவு: hr@company.lk
```

### Disclaimer Text Examples

#### Example 1: Standard Confidentiality
```
Disclaimer Text:
─────────────
CONFIDENTIAL DOCUMENT

This payslip is computer-generated and does not 
require a physical signature. It is confidential 
and intended solely for the named employee.

Unauthorized disclosure or distribution is prohibited.
```

#### Example 2: Statutory Compliance
```
Disclaimer Text:
─────────────
This payslip is generated in compliance with the 
Sri Lanka Labor Laws and Employees' Provident Fund 
Act. All statutory deductions are remitted to the 
respective authorities as required by law.

EPF contributions are deposited with the Employees' 
Provident Fund. ETF contributions are deposited with 
the Employees' Trust Fund.
```

#### Example 3: Digital Document Notice
```
Disclaimer Text:
─────────────
This is a computer-generated digital payslip. 
No signature is required for validity.

Please retain this document for your records. 
For reprints, contact HR Department.

This document is legally binding and serves as 
proof of salary payment.
```

#### Example 4: Privacy and Data Protection
```
Disclaimer Text:
─────────────
PRIVACY NOTICE

Your personal data on this payslip is processed 
in accordance with our Data Protection Policy and 
applicable Sri Lankan privacy regulations.

This document contains confidential financial 
information. Please store securely and dispose 
responsibly.

For data privacy queries: dpo@company.lk
```

### Footer vs Disclaimer Usage Guide

| Content Type | Use Footer | Use Disclaimer |
|--------------|-----------|----------------|
| Contact information | ✓ Yes | No |
| HR queries guidance | ✓ Yes | No |
| Employee portal link | ✓ Yes | No |
| Payroll schedule | ✓ Yes | No |
| Confidentiality notice | No | ✓ Yes |
| Legal disclaimers | No | ✓ Yes |
| Statutory compliance | No | ✓ Yes |
| Digital signature notice | No | ✓ Yes |

### Footer Section Variations

#### Minimal Footer (Essential Only)
```
┌────────────────────────────────────────────────┐
│  For queries: hr@company.lk                    │
├────────────────────────────────────────────────┤
│  This is a computer-generated document.        │
└────────────────────────────────────────────────┘
```

#### Comprehensive Footer (Full Details)
```
┌────────────────────────────────────────────────┐
│  HR CONTACT INFORMATION                        │
│  Email: hr@lankacommerce.lk                    │
│  Phone: +94 11 234 5678                        │
│  Office: Mon-Fri, 9 AM - 5 PM                  │
│  Portal: https://hr.lankacommerce.lk           │
│                                                │
│  PAYMENT SCHEDULE                              │
│  Salaries paid last working day of month       │
│  Direct deposit to registered bank account     │
├────────────────────────────────────────────────┤
│  LEGAL DISCLAIMER                              │
│  This payslip is confidential. EPF/ETF         │
│  contributions remitted as per law.            │
│  Computer-generated, no signature required.    │
└────────────────────────────────────────────────┘
```

#### No Footer (Display Disabled)
```
┌────────────────────────────────────────────────┐
│  [Net Pay and Summary sections]                │
│                                                │
│  (No footer section displayed)                 │
│                                                │
└────────────────────────────────────────────────┘
```

### Field Details Table

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| footer_text | TextField | No | null | General info, contacts |
| disclaimer_text | TextField | No | null | Legal notices |
| show_footer | BooleanField | Yes | True | Footer visibility toggle |
| show_disclaimer | BooleanField | Yes | True | Disclaimer visibility toggle |

### Text Length Recommendations

| Paper Size | Footer Max Lines | Disclaimer Max Lines | Total Chars |
|-----------|------------------|---------------------|-------------|
| A4 | 8-10 lines | 10-12 lines | 800-1200 |
| Letter | 8-10 lines | 10-12 lines | 800-1200 |

### Sri Lanka-Specific Legal Considerations

#### Employment Law References
```
Suggested Disclaimer Content:
─────────────────────────────
"Generated in compliance with:
• Shop and Office Employees Act
• Wages Boards Ordinance
• Employees' Provident Fund Act
• Employees' Trust Fund Act
• Payment of Gratuity Act"
```

#### Language Requirements
```
For Multi-Ethnic Workforces:

Option 1: English Only (Most common)
Option 2: Bilingual (English + Sinhala)
Option 3: Trilingual (English + Sinhala + Tamil)

Recommended: English with contact info in all three
```

### Display Control Logic

```
Footer Display Decision Flow
════════════════════════════

IF show_footer = True AND footer_text is not empty:
    → Display footer section
ELSE:
    → Skip footer section

IF show_disclaimer = True AND disclaimer_text is not empty:
    → Display disclaimer section
ELSE:
    → Skip disclaimer section

Result combinations:
1. Both shown: Full footer area
2. Footer only: No disclaimer line
3. Disclaimer only: No footer line
4. Neither shown: Clean end
```

### Usage Scenarios

#### Scenario 1: Corporate Professional
```
footer_text:
"For payslip queries, contact HR at hr@company.lk
or call +94 11 234 5678 (Extension 125)
Office Hours: Monday-Friday, 9:00 AM - 5:00 PM"

disclaimer_text:
"This payslip is confidential and computer-generated.
EPF/ETF contributions are remitted as per Sri Lankan
labor laws. No signature required."

show_footer: True
show_disclaimer: True
```

#### Scenario 2: Small Business (Minimal)
```
footer_text: "Questions? Call +94 77 123 4567"

disclaimer_text: null

show_footer: True
show_disclaimer: False
```

#### Scenario 3: Large Corporation (Comprehensive)
```
footer_text:
"HR Department: hr@company.lk | +94 11 234 5678
Employee Portal: https://hr.company.lk
Review benefits, tax forms, and leave balance online

Payroll Schedule: Last working day of each month
Direct deposit to registered bank account

For urgent matters, visit HR Office during 9 AM - 5 PM"

disclaimer_text:
"CONFIDENTIAL DOCUMENT - FOR NAMED EMPLOYEE ONLY

This payslip is computer-generated and legally binding.
No physical signature is required for validity.

Generated in compliance with Sri Lankan labor laws:
• EPF contributions remitted to Employees' Provident Fund
• ETF contributions remitted to Employees' Trust Fund  
• PAYE tax deducted as per Inland Revenue regulations

Your personal data is protected under our Privacy Policy.
Unauthorized disclosure is prohibited.

For data privacy concerns: dpo@company.lk"

show_footer: True
show_disclaimer: True
```

### Expected Outcome
- Customizable footer information
- Legal disclaimer capability
- Visibility controls per section
- Professional payslip closure
- Compliance with legal requirements

### Verification Checklist
- [ ] footer_text field added
- [ ] footer_text help_text provided
- [ ] disclaimer_text field added
- [ ] disclaimer_text help_text provided
- [ ] show_footer field added
- [ ] show_disclaimer field added
- [ ] All fields optional (blank=True, null=True)
- [ ] Boolean defaults set correctly
- [ ] Model docstring updated

---

## Task 31: Add Template Style Fields

### Overview
Add visual styling and display control fields to the PayslipTemplate model. These fields allow tenants to customize the color scheme, control which sections appear on the payslip, and select the appropriate paper size for PDF generation.

### Dependencies
- Task 30: Add template footer fields

### Instructions

1. **Open payslip_template.py model file**
   - Continue in `apps/payslip/models/payslip_template.py`
   - Locate PayslipTemplate class

2. **Define paper size choices**
   - Create PAPER_SIZE_CHOICES tuple
   - Option: 'A4' - Standard international (210mm x 297mm)
   - Option: 'LETTER' - US letter size (8.5" x 11")

3. **Add paper_size field**
   - CharField with PAPER_SIZE_CHOICES
   - max_length=10
   - Default to 'A4'
   - Determines PDF page dimensions

4. **Add primary_color field**
   - CharField, max_length=7
   - Default to '#2C3E50' (professional dark blue)
   - Stores hex color code
   - Used for headers, section titles

5. **Add primary_color help text**
   - Format: Hex color code (e.g., #2C3E50)
   - Used for main headings and accents
   - Should contrast with white background

6. **Add secondary_color field**
   - CharField, max_length=7
   - Default to '#7F8C8D' (neutral gray)
   - Stores hex color code
   - Used for subheadings, borders

7. **Add secondary_color help text**
   - Format: Hex color code
   - Used for secondary elements
   - Should complement primary color

8. **Add show_employer_contributions field**
   - BooleanField, default=False
   - Controls employer contribution section visibility
   - Some companies hide this from employees

9. **Add show_employer_contributions help text**
   - Explain: displays EPF employer 12% and ETF 3%
   - Shows total cost to company
   - Optional disclosure

10. **Add show_ytd field**
    - BooleanField, default=True
    - Controls year-to-date column visibility
    - Shows cumulative amounts since fiscal year start

11. **Add show_ytd help text**
    - Explain: displays YTD totals for earnings/deductions
    - Helps employees track annual income
    - Useful for tax planning

12. **Add show_bank_details field**
    - BooleanField, default=True
    - Controls bank account information visibility
    - Shows employee's payment account

13. **Add show_bank_details help text**
    - Explain: displays bank name, account number
    - Confirms payment destination
    - Privacy consideration

14. **Add validation method for color fields**
    - Create clean() method
    - Validate hex color format (#RRGGBB)
    - Raise ValidationError if invalid

15. **Update model docstring**
    - Document style configuration section
    - List all style and display fields
    - Note color format requirements

### Style Configuration Field Structure

```
┌──────────────────────────────────────────────────────┐
│         Style & Display Configuration                │
├──────────────────────────────────────────────────────┤
│ Visual Style:                                        │
│  • paper_size (Choice: A4/LETTER)                    │
│  • primary_color (CharField, hex code)               │
│  • secondary_color (CharField, hex code)             │
│                                                      │
│ Display Controls:                                    │
│  • show_employer_contributions (BooleanField)        │
│  • show_ytd (BooleanField)                           │
│  • show_bank_details (BooleanField)                  │
└──────────────────────────────────────────────────────┘
```

### Paper Size Specifications

#### A4 Paper Size
```
Dimensions: 210mm × 297mm (8.27" × 11.69")

┌────────────────────┐
│                    │ ▲
│                    │ │
│    A4 PORTRAIT     │ 297mm
│                    │ │
│                    │ ▼
└────────────────────┘
    ◄─── 210mm ───►

Usage:
• International standard
• Common in Sri Lanka
• Used for formal documents
• Default selection
```

#### Letter Paper Size
```
Dimensions: 8.5" × 11" (215.9mm × 279.4mm)

┌────────────────────┐
│                    │ ▲
│   LETTER PORTRAIT  │ 11"
│                    │ ▼
└────────────────────┘
    ◄──── 8.5" ────►

Usage:
• US/North American standard
• Slightly wider than A4
• Less common in Sri Lanka
• International companies
```

### Color Scheme Examples

#### Professional Blue (Default)
```
Primary:   #2C3E50  ████  Dark blue-gray
Secondary: #7F8C8D  ████  Medium gray

┌────────────────────────────────────────┐
│  SALARY SLIP           ████ #2C3E50    │ ← Header
├────────────────────────────────────────┤
│  Employee: John Doe    ████ #7F8C8D    │ ← Subheading
│  Department: IT                        │
└────────────────────────────────────────┘

Use Case: Corporate, professional, trustworthy
```

#### Corporate Red
```
Primary:   #C0392B  ████  Rich red
Secondary: #95A5A6  ████  Light gray

┌────────────────────────────────────────┐
│  SALARY SLIP           ████ #C0392B    │
├────────────────────────────────────────┤
│  Employee: Jane Smith  ████ #95A5A6    │
│  Period: Jan 2026                      │
└────────────────────────────────────────┘

Use Case: Bold, energetic brands
```

#### Elegant Green
```
Primary:   #27AE60  ████  Forest green
Secondary: #BDC3C7  ████  Cool gray

┌────────────────────────────────────────┐
│  SALARY SLIP           ████ #27AE60    │
├────────────────────────────────────────┤
│  Employee: A. Perera   ████ #BDC3C7    │
│  Location: Colombo                     │
└────────────────────────────────────────┘

Use Case: Environmental, healthcare, growth-focused
```

#### Modern Purple
```
Primary:   #8E44AD  ████  Deep purple
Secondary: #ABB2B9  ████  Neutral gray

┌────────────────────────────────────────┐
│  SALARY SLIP           ████ #8E44AD    │
├────────────────────────────────────────┤
│  Employee: S. Kumar    ████ #ABB2B9    │
│  Designation: Manager                  │
└────────────────────────────────────────┘

Use Case: Creative, tech, innovative companies
```

#### Conservative Black
```
Primary:   #000000  ████  Pure black
Secondary: #666666  ████  Dark gray

┌────────────────────────────────────────┐
│  SALARY SLIP           ████ #000000    │
├────────────────────────────────────────┤
│  Employee: R. Fernando ████ #666666    │
│  Employee ID: EMP-001                  │
└────────────────────────────────────────┘

Use Case: Traditional, formal, legal firms
```

### Color Usage in Payslip Layout

```
┌─────────────────────────────────────────────────────┐
│  [LOGO]    COMPANY NAME                             │ ◄─ primary_color
│            123 Address Street                       │
├─────────────────────────────────────────────────────┤
│  SALARY SLIP - JANUARY 2026                         │ ◄─ primary_color
├─────────────────────────────────────────────────────┤
│                                                     │
│  Employee Details                                   │ ◄─ secondary_color
│  Name: John Doe         | ID: EMP-123               │
│  Designation: Manager   | Department: IT            │
│                                                     │
├─────────────────────────────────────────────────────┤
│  EARNINGS                                           │ ◄─ primary_color
│  Component              Amount        YTD           │ ◄─ secondary_color
│  ────────────────────────────────────────           │
│  Basic Salary          150,000     600,000          │
│  Transport Allowance    15,000      60,000          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  DEDUCTIONS                                         │ ◄─ primary_color
│  Component              Amount        YTD           │ ◄─ secondary_color
│  ────────────────────────────────────────           │
│  EPF Employee (8%)      12,000      48,000          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Display Control Fields Explanation

#### show_employer_contributions
```
When True:
┌─────────────────────────────────────────┐
│  EMPLOYER CONTRIBUTIONS                 │
│  EPF Employer (12%)        18,000       │
│  ETF (3%)                   4,500       │
│  Total Cost to Company    193,750       │
└─────────────────────────────────────────┘

When False:
(Section not displayed)

Decision Factors:
✓ Show: Transparency, employee engagement
✗ Hide: Company policy, compensation privacy
```

#### show_ytd
```
When True:
┌─────────────────────────────────────────┐
│  Component         Amount        YTD    │
│  Basic Salary     150,000     600,000   │ ◄─ YTD column shown
│  Transport         15,000      60,000   │
└─────────────────────────────────────────┘

When False:
┌─────────────────────────────────────────┐
│  Component                     Amount   │
│  Basic Salary                 150,000   │ ◄─ No YTD column
│  Transport                     15,000   │
└─────────────────────────────────────────┘

Benefits of Showing YTD:
• Tax planning visibility
• Income tracking
• Annual bonus calculation reference
• Loan application documentation
```

#### show_bank_details
```
When True:
┌─────────────────────────────────────────┐
│  PAYMENT INFORMATION                    │
│  Bank: Commercial Bank                  │
│  Account: 1234567890                    │
│  Branch: Colombo Fort                   │
└─────────────────────────────────────────┘

When False:
┌─────────────────────────────────────────┐
│  PAYMENT INFORMATION                    │
│  Payment via direct bank transfer       │
└─────────────────────────────────────────┘

Privacy Considerations:
✓ Show: Payment confirmation, audit trail
✗ Hide: Security concerns, privacy preference
```

### Field Details Table

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| paper_size | CharField | Yes | 'A4' | PDF page size |
| primary_color | CharField | Yes | '#2C3E50' | Main headings, accents |
| secondary_color | CharField | Yes | '#7F8C8D' | Subheadings, borders |
| show_employer_contributions | BooleanField | Yes | False | Employer costs visibility |
| show_ytd | BooleanField | Yes | True | Year-to-date column |
| show_bank_details | BooleanField | Yes | True | Payment account info |

### Display Control Matrix

| Configuration | Employer Contrib | YTD | Bank Details | Use Case |
|--------------|------------------|-----|--------------|----------|
| Full Transparency | ✓ Show | ✓ Show | ✓ Show | Open culture, employee trust |
| Standard | ✗ Hide | ✓ Show | ✓ Show | Most common, balanced |
| Privacy-Focused | ✗ Hide | ✓ Show | ✗ Hide | High security needs |
| Minimal | ✗ Hide | ✗ Hide | ✗ Hide | Basic compliance only |

### Color Validation

```
Hex Color Format Requirements
══════════════════════════════

Valid formats:
✓ #2C3E50  (6-digit hex)
✓ #2c3e50  (lowercase accepted)
✓ #FFFFFF  (white)
✓ #000000  (black)

Invalid formats:
✗ 2C3E50   (missing #)
✗ #2C3     (too short)
✗ #2C3E50F (too long)
✗ #GGGGGG  (invalid hex chars)
✗ rgb(44, 62, 80)  (not hex)

Validation Logic:
1. Check starts with '#'
2. Check length = 7 characters
3. Check characters [1-6] are 0-9, A-F, a-f
4. Raise ValidationError if invalid
```

### Usage Scenarios

#### Scenario 1: Corporate Standard
```
paper_size: 'A4'
primary_color: '#2C3E50'
secondary_color: '#7F8C8D'
show_employer_contributions: False
show_ytd: True
show_bank_details: True

Profile: Professional services, standard setup
```

#### Scenario 2: Transparent Startup
```
paper_size: 'A4'
primary_color: '#3498DB'  (bright blue)
secondary_color: '#95A5A6'
show_employer_contributions: True
show_ytd: True
show_bank_details: True

Profile: Tech startup, open culture, full transparency
```

#### Scenario 3: High Security
```
paper_size: 'A4'
primary_color: '#000000'
secondary_color: '#666666'
show_employer_contributions: False
show_ytd: True
show_bank_details: False

Profile: Financial institution, privacy-focused
```

#### Scenario 4: International Company
```
paper_size: 'LETTER'  (US standard)
primary_color: '#1ABC9C'  (teal)
secondary_color: '#BDC3C7'
show_employer_contributions: False
show_ytd: True
show_bank_details: True

Profile: US-based company, Sri Lankan operations
```

### Expected Outcome
- Customizable visual appearance
- Professional color schemes
- Flexible display controls
- Paper size selection
- Privacy-aware configurations

### Verification Checklist
- [ ] PAPER_SIZE_CHOICES tuple defined
- [ ] paper_size field added with choices
- [ ] primary_color field added
- [ ] primary_color help_text added
- [ ] secondary_color field added
- [ ] secondary_color help_text added
- [ ] show_employer_contributions field added
- [ ] show_employer_contributions help_text added
- [ ] show_ytd field added
- [ ] show_ytd help_text added
- [ ] show_bank_details field added
- [ ] show_bank_details help_text added
- [ ] clean() method for color validation
- [ ] Model docstring updated

---

## Task 32: Run Template Migrations

### Overview
Create and apply Django migrations for the PayslipTemplate model. This task generates the database schema changes and applies them to create the payslip_template table with all configured fields.

### Dependencies
- Task 28: Create PayslipTemplate model
- Task 29: Add template company details
- Task 30: Add template footer fields
- Task 31: Add template style fields
- Database configured and accessible

### Instructions

1. **Verify model completeness**
   - Open `apps/payslip/models/payslip_template.py`
   - Review all fields are properly defined
   - Check all required imports present
   - Verify model is imported in `models/__init__.py`

2. **Check for model errors**
   - Run Django check command
   - Identify any model definition issues
   - Fix any syntax or configuration errors
   - Ensure no field conflicts

3. **Generate migration file**
   - Navigate to project root directory
   - Run makemigrations command for payslip app
   - Specify app name: `python manage.py makemigrations payslip`
   - Review generated migration file

4. **Inspect migration file**
   - Open newly created migration file
   - Located in `apps/payslip/migrations/`
   - Filename format: `0003_payslip_template.py`
   - Verify all fields included
   - Check field types and options

5. **Review migration operations**
   - Verify CreateModel operation for PayslipTemplate
   - Check all fields with correct types
   - Verify OneToOneField to Client
   - Confirm indexes and constraints
   - Review default values

6. **Apply migration to database**
   - Run migrate command
   - Command: `python manage.py migrate payslip`
   - Monitor for errors during application
   - Verify successful completion

7. **Verify database table creation**
   - Access database (PostgreSQL)
   - Confirm `payslip_paysliptemplate` table exists
   - Check all columns created correctly
   - Verify constraints and indexes

8. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import PayslipTemplate model
   - Verify model loads without errors
   - Test basic queries

9. **Create test template instance**
   - Use Django shell or admin
   - Create PayslipTemplate for test tenant
   - Populate required fields
   - Verify save operation successful

10. **Document migration**
    - Note migration number
    - Record in project documentation
    - Update change log if maintained
    - Commit migration files to version control

### Migration File Structure

```
apps/payslip/migrations/0003_payslip_template.py
═══════════════════════════════════════════════

# Generated by Django X.X on YYYY-MM-DD HH:MM

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('payslip', '0002_payslip_lines'),
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PayslipTemplate',
            fields=[
                ('id', models.BigAutoField(...)),
                
                # Core fields
                ('is_active', models.BooleanField(default=True)),
                ('internal_notes', models.TextField(blank=True, null=True)),
                
                # Company details
                ('company_name', models.CharField(max_length=200)),
                ('company_logo', models.ImageField(upload_to='payslip_templates/logos/', blank=True, null=True)),
                ('company_address', models.TextField()),
                ('company_phone', models.CharField(max_length=20, blank=True, null=True)),
                ('company_email', models.EmailField(blank=True, null=True)),
                ('epf_number', models.CharField(max_length=50, blank=True, null=True)),
                ('etf_number', models.CharField(max_length=50, blank=True, null=True)),
                
                # Footer fields
                ('footer_text', models.TextField(blank=True, null=True)),
                ('disclaimer_text', models.TextField(blank=True, null=True)),
                ('show_footer', models.BooleanField(default=True)),
                ('show_disclaimer', models.BooleanField(default=True)),
                
                # Style fields
                ('paper_size', models.CharField(max_length=10, choices=[...], default='A4')),
                ('primary_color', models.CharField(max_length=7, default='#2C3E50')),
                ('secondary_color', models.CharField(max_length=7, default='#7F8C8D')),
                ('show_employer_contributions', models.BooleanField(default=False)),
                ('show_ytd', models.BooleanField(default=True)),
                ('show_bank_details', models.BooleanField(default=True)),
                
                # Timestamps
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                
                # Relationships
                ('tenant', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='payslip_template', to='tenants.client')),
            ],
            options={
                'verbose_name': 'Payslip Template',
                'verbose_name_plural': 'Payslip Templates',
                'db_table': 'payslip_paysliptemplate',
                'ordering': ['tenant__name'],
            },
        ),
    ]
```

### Database Table Schema

```
Table: payslip_paysliptemplate
═══════════════════════════════════════════════════

Column Name                  | Type           | Nullable | Default
─────────────────────────────┼────────────────┼──────────┼─────────────
id                           | bigint         | NOT NULL | nextval()
tenant_id                    | bigint         | NOT NULL | -
is_active                    | boolean        | NOT NULL | true
internal_notes               | text           | NULL     | NULL
company_name                 | varchar(200)   | NOT NULL | -
company_logo                 | varchar(100)   | NULL     | NULL
company_address              | text           | NOT NULL | -
company_phone                | varchar(20)    | NULL     | NULL
company_email                | varchar(100)   | NULL     | NULL
epf_number                   | varchar(50)    | NULL     | NULL
etf_number                   | varchar(50)    | NULL     | NULL
footer_text                  | text           | NULL     | NULL
disclaimer_text              | text           | NULL     | NULL
show_footer                  | boolean        | NOT NULL | true
show_disclaimer              | boolean        | NOT NULL | true
paper_size                   | varchar(10)    | NOT NULL | 'A4'
primary_color                | varchar(7)     | NOT NULL | '#2C3E50'
secondary_color              | varchar(7)     | NOT NULL | '#7F8C8D'
show_employer_contributions  | boolean        | NOT NULL | false
show_ytd                     | boolean        | NOT NULL | true
show_bank_details            | boolean        | NOT NULL | true
created_at                   | timestamp      | NOT NULL | now()
updated_at                   | timestamp      | NOT NULL | now()

Constraints:
────────────
PRIMARY KEY: id
UNIQUE: tenant_id (OneToOne relationship)
FOREIGN KEY: tenant_id → tenants_client(id) ON DELETE CASCADE

Indexes:
────────
payslip_paysliptemplate_pkey (PRIMARY KEY on id)
payslip_paysliptemplate_tenant_id_unique (UNIQUE on tenant_id)
payslip_paysliptemplate_tenant_id_idx (INDEX on tenant_id)
```

### Migration Commands Reference

```bash
# Check for model issues
python manage.py check payslip

# Generate migration file
python manage.py makemigrations payslip

# Expected output:
# Migrations for 'payslip':
#   apps/payslip/migrations/0003_payslip_template.py
#     - Create model PayslipTemplate

# Review migration (dry run)
python manage.py sqlmigrate payslip 0003

# Apply migration
python manage.py migrate payslip

# Expected output:
# Running migrations:
#   Applying payslip.0003_payslip_template... OK

# Verify migration status
python manage.py showmigrations payslip

# Expected output:
# payslip
#  [X] 0001_initial
#  [X] 0002_payslip_lines
#  [X] 0003_payslip_template
```

### Testing PayslipTemplate Model

```python
# Django shell testing
# Command: python manage.py shell

# Import required models
from apps.tenants.models import Client
from apps.payslip.models import PayslipTemplate

# Fetch a test tenant
tenant = Client.objects.first()
print(f"Tenant: {tenant.name}")

# Create PayslipTemplate instance
template = PayslipTemplate.objects.create(
    tenant=tenant,
    company_name="Lanka Commerce Pvt Ltd",
    company_address="123, Galle Road\nColombo 03\nSri Lanka",
    company_phone="+94 11 234 5678",
    company_email="hr@lankacommerce.lk",
    epf_number="C/12345",
    etf_number="E/6789",
    footer_text="For queries: hr@lankacommerce.lk",
    disclaimer_text="This payslip is confidential.",
    primary_color="#2C3E50",
    secondary_color="#7F8C8D",
    show_ytd=True,
    show_bank_details=True,
)

print(f"Template created: {template}")
print(f"Template ID: {template.id}")
print(f"Is active: {template.is_active}")

# Verify OneToOne relationship
print(f"Access via tenant: {tenant.payslip_template}")

# Test retrieval
retrieved = PayslipTemplate.objects.get(tenant=tenant)
print(f"Retrieved template: {retrieved.company_name}")

# Test update
template.primary_color = "#3498DB"
template.save()
print("Template updated successfully")

# Verify color validation
# Should pass
template.primary_color = "#FFFFFF"
template.clean()  # No error

# Should fail
try:
    template.primary_color = "INVALID"
    template.clean()
except ValidationError as e:
    print(f"Validation error: {e}")
```

### Verification Queries

```sql
-- PostgreSQL verification queries

-- Check table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'payslip_paysliptemplate'
);

-- Count records
SELECT COUNT(*) FROM payslip_paysliptemplate;

-- View sample data
SELECT 
    id,
    tenant_id,
    company_name,
    paper_size,
    primary_color,
    is_active,
    created_at
FROM payslip_paysliptemplate
LIMIT 5;

-- Verify OneToOne constraint
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'payslip_paysliptemplate'::regclass;

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'payslip_paysliptemplate';
```

### Common Migration Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "No changes detected" | Model not imported in __init__.py | Import model properly |
| "Conflicting migration" | Multiple unmigrated changes | Merge migrations or apply in order |
| "Invalid default value" | Default doesn't match field type | Fix default value in model |
| "Foreign key constraint failed" | Referenced table doesn't exist | Ensure tenant model migrated first |
| "Duplicate column name" | Field name conflicts | Rename conflicting field |

### Post-Migration Tasks

```
Immediate Next Steps
════════════════════

1. Register model in admin
   └─→ Create PayslipTemplateAdmin class
       └─→ Configure fieldsets and list_display

2. Create template on tenant signup
   └─→ Add signal handler
       └─→ Auto-create default template

3. Add template form
   └─→ Create ModelForm
       └─→ Custom color picker widget

4. Implement template preview
   └─→ Generate sample PDF
       └─→ Show template appearance

5. Add template management views
   └─→ Update template view
       └─→ Logo upload handling
```

### Expected Outcome
- PayslipTemplate table created in database
- All fields properly configured
- Relationships established
- Migration applied successfully
- Model ready for use in PDF generation

### Verification Checklist
- [ ] Django check command passes
- [ ] Migration file generated successfully
- [ ] Migration file reviewed and correct
- [ ] Migration applied without errors
- [ ] Database table created
- [ ] All columns present in table
- [ ] OneToOne constraint exists
- [ ] Indexes created correctly
- [ ] Model import works in shell
- [ ] Test instance created successfully
- [ ] Tenant relationship verified
- [ ] Color validation working
- [ ] Migration files committed to git

---

## Summary

This document completed the PayslipTemplate model configuration:

### Completed Implementation
- ✅ PayslipTemplate model with tenant relationship
- ✅ Company branding fields (name, logo, address, contacts)
- ✅ Statutory registration numbers (EPF, ETF)
- ✅ Footer and disclaimer text fields
- ✅ Visual styling (colors, paper size)
- ✅ Display control toggles (employer contrib, YTD, bank details)
- ✅ Database migrations created and applied

### Key Achievements

1. **Tenant-Specific Customization** - Each tenant controls their payslip appearance
2. **Professional Branding** - Logo, company details, and color scheme support
3. **Legal Compliance** - EPF/ETF numbers and disclaimer text
4. **Flexible Display** - Toggle sections based on company policy
5. **Privacy Controls** - Hide sensitive information as needed
6. **International Support** - A4 and Letter paper sizes

### Model Summary

```
PayslipTemplate Fields:
• Core: tenant (OneToOne), is_active, internal_notes
• Branding: company_name, company_logo, company_address
• Contacts: company_phone, company_email
• Statutory: epf_number, etf_number
• Footer: footer_text, disclaimer_text, show_footer, show_disclaimer
• Style: paper_size, primary_color, secondary_color
• Display: show_employer_contributions, show_ytd, show_bank_details
• Timestamps: created_at, updated_at
```

### Integration Points

```
PayslipTemplate Usage Flow
═══════════════════════════

1. Tenant Registration
   └─→ Auto-create default template

2. Template Customization
   └─→ Admin/HR updates via UI
       └─→ Upload logo
       └─→ Set colors
       └─→ Configure display

3. Payslip Generation
   └─→ Fetch tenant.payslip_template
       └─→ Apply to PDF renderer
           └─→ Generate branded PDF

4. Template Management
   └─→ Update as needed
       └─→ Version control
       └─→ Preview changes
```

### Next Steps in Payslip System

Proceed to Group C: PDF Generation Engine to implement:
- PDF rendering engine setup
- Template-based PDF generation
- Line item rendering
- Section layout logic
- PDF finalization and delivery

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~990
**Group:** B - PDF Template Design COMPLETE
