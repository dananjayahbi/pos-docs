# Tasks 59-66: Sections, Custom & Verify

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** D - Label Templates  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-58_Courier-Templates.md](01_Tasks-51-58_Courier-Templates.md)

---

## Document Overview

This document covers the creation of A4 templates with packing slips, specialized template sections for different label components, custom template administration UI, preview functionality, and comprehensive template verification procedures for Sri Lankan courier operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create A4 Template | Medium | 40 min |
| 60 | Create Packing Slip Section | Low | 25 min |
| 61 | Create Address Section | Low | 25 min |
| 62 | Create COD Section | Low | 20 min |
| 63 | Create Instructions Section | Low | 20 min |
| 64 | Create Custom Template UI | Medium | 50 min |
| 65 | Create Template Preview | Medium | 45 min |
| 66 | Verify Templates | Low | 30 min |

---

## Task 59: Create A4 Template

### Overview
Create a comprehensive A4 format template that includes both courier label and detailed packing slip sections. This template is designed for standard office printers and provides complete shipment documentation including itemized packing lists, detailed addresses, and comprehensive shipping information.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create A4 template file**
   - Create `a4_with_slip.html` in templates directory
   - Extend base template with A4-specific layout
   - Configure for A4 paper size (210mm x 297mm)

2. **Design two-section layout**
   - Top section: Courier label (similar to thermal format)
   - Bottom section: Detailed packing slip
   - Include perforation line indication between sections
   - Configure page break controls

3. **Create courier label section**
   - Condensed version of courier-specific template
   - Essential shipping information only
   - Sized to fit in top 1/3 of A4 page
   - Include all critical routing and tracking info

4. **Design packing slip layout**
   - Detailed itemized list of package contents
   - Company letterhead and branding
   - Complete sender and recipient information
   - Terms and conditions section

5. **Implement responsive A4 styling**
   - Optimize for A4 paper dimensions
   - Set proper margins for standard printers
   - Configure fonts for readability at distance
   - Ensure consistent alignment and spacing

6. **Add A4-specific features**
   - Include company letterhead in packing slip
   - Add space for signatures and dates
   - Include detailed terms and conditions
   - Add customs declaration section if needed

7. **Configure print optimization**
   - Set A4 page size and margins
   - Prevent unwanted page breaks
   - Optimize colors for laser/inkjet printing
   - Include print-specific CSS rules

### A4 Template Structure

```
┌─────────────────────────────────────┐ ← A4 (210mm x 297mm)
│         COURIER LABEL SECTION       │
│ ┌─────────────────────────────────┐ │ ← Top 1/3 (99mm)
│ │ [Standard Courier Label Layout] │ │
│ │ - Logo, Waybill, Addresses      │ │
│ │ - Service Details, Barcode      │ │
│ └─────────────────────────────────┘ │
│ ≋≋≋≋≋≋≋≋ TEAR HERE ≋≋≋≋≋≋≋≋≋≋≋ │ ← Perforation line
│                                     │
│        PACKING SLIP SECTION         │
│ ┌─────────────────────────────────┐ │ ← Bottom 2/3 (198mm)
│ │ Company Letterhead              │ │
│ │ ─────────────────────────────── │ │
│ │ PACKING SLIP #PS123456          │ │
│ │                                 │ │
│ │ Ship To:        Ship From:      │ │
│ │ [Detailed       [Company        │ │
│ │  Address]        Address]       │ │
│ │                                 │ │
│ │ Items Shipped:                  │ │
│ │ ┌─────┬──────┬────┬──────────┐ │ │
│ │ │ QTY │ ITEM │ WT │ VALUE    │ │ │
│ │ ├─────┼──────┼────┼──────────┤ │ │
│ │ │  2  │ ABC  │1kg │ ₨1,500   │ │ │
│ │ └─────┴──────┴────┴──────────┘ │ │
│ │                                 │ │
│ │ Special Instructions:           │ │
│ │ [Delivery Notes]                │ │
│ │                                 │ │
│ │ Terms & Conditions:             │ │
│ │ [Legal Text]                    │ │
│ │                                 │ │
│ │ Signatures:                     │ │
│ │ Sender: ____________            │ │
│ │ Receiver: ___________           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### A4 Section Specifications

| Section | Height | Purpose |
|---------|--------|---------|
| Courier Label | 99mm (33%) | Shipping routing |
| Perforation | 5mm | Tear separation |
| Packing Slip | 193mm (65%) | Detailed documentation |

### A4 Typography Scale

| Element | Font Family | Size | Weight |
|---------|-------------|------|--------|
| Section Headers | Arial | 18pt | Bold |
| Label Text | Arial | 12pt | Regular |
| Packing Slip Headers | Arial | 14pt | Bold |
| Item Details | Arial | 10pt | Regular |
| Legal Text | Arial | 8pt | Regular |

### A4 Print Configuration

```
A4 Print Settings
├── Page Size: A4 (210mm × 297mm)
├── Margins: 10mm all sides
├── Orientation: Portrait
├── Color: Full color or grayscale
├── Quality: 300 DPI minimum
└── Paper: Standard office paper
```

### Expected Outcome
- Comprehensive A4 template with dual-purpose layout
- Professional packing slip with itemized details
- Print-optimized formatting for office printers
- Clear section separation with perforation indicator

### Verification Checklist
- [ ] A4 template created with proper dimensions
- [ ] Courier label section in top third
- [ ] Packing slip section in bottom two-thirds
- [ ] Perforation line clearly indicated
- [ ] Print margins and sizing optimized
- [ ] Professional letterhead and branding

---

## Task 60: Create Packing Slip Section

### Overview
Create a reusable packing slip section component that can be included in A4 templates and standalone packing slips. This section provides detailed itemization of package contents, weights, values, and serves as a commercial invoice for customs and accounting purposes.

### Dependencies
- Task 59: Create A4 Template

### Instructions

1. **Create packing slip section file**
   - Create `sections/packing_slip.html` in templates directory
   - Design as reusable Jinja2 template section
   - Configure for inclusion in larger templates

2. **Design itemized table structure**
   - Create responsive table for item details
   - Include columns for quantity, description, weight, value
   - Add subtotals and totals calculations
   - Include tax and duty information if applicable

3. **Implement item detail fields**
   - Product name and description
   - SKU or product code
   - Quantity shipped
   - Unit weight and total weight
   - Unit price and total value (optional)

4. **Add summary calculations**
   - Total quantity of items
   - Total weight of shipment
   - Total declared value (for customs)
   - COD amount if applicable
   - Shipping charges breakdown

5. **Include regulatory information**
   - Customs declaration details
   - Export/import codes if required
   - Product category classifications
   - Country of origin for items

6. **Design signature section**
   - Sender verification signature
   - Packer identification
   - Date and time of packing
   - Receiver acknowledgment section

7. **Add responsive table styling**
   - Mobile-friendly table design
   - Print-optimized column widths
   - Clear borders and spacing
   - Alternating row colors for readability

### Packing Slip Table Structure

```
┌─────┬─────────────────┬─────┬─────┬──────────┬──────────┐
│ QTY │ ITEM DESCRIPTION│ SKU │ WT  │ UNIT ₨  │ TOTAL ₨ │
├─────┼─────────────────┼─────┼─────┼──────────┼──────────┤
│  2  │ Samsung Phone   │SP01 │0.5kg│  45,000  │  90,000  │
│  1  │ Phone Case      │PC12 │0.1kg│   1,500  │   1,500  │
│  1  │ Screen Protector│SP99 │0.1kg│     500  │     500  │
├─────┼─────────────────┼─────┼─────┼──────────┼──────────┤
│  4  │ TOTAL ITEMS     │     │0.7kg│          │  92,000  │
└─────┴─────────────────┴─────┴─────┴──────────┴──────────┘

SHIPMENT SUMMARY
├── Items: 4 pieces
├── Weight: 0.7kg
├── Value: ₨92,000
├── COD: ₨0 (Prepaid)
└── Insurance: ₨92,000
```

### Table Column Specifications

| Column | Width | Purpose | Required |
|--------|-------|---------|----------|
| Quantity | 8% | Number of items | Yes |
| Description | 40% | Item details | Yes |
| SKU | 15% | Product code | No |
| Weight | 12% | Item weight | Yes |
| Unit Price | 12% | Price per item | No |
| Total Value | 13% | Line total | No |

### Summary Section Fields

| Field | Type | Purpose |
|-------|------|---------|
| Total Items | Number | Item count |
| Total Weight | Decimal | Package weight |
| Total Value | Currency | Declared value |
| COD Amount | Currency | Collection amount |
| Insurance | Currency | Coverage value |

### Customs Declaration

| Field | Purpose | Required |
|-------|---------|----------|
| Description | Contents description | Yes |
| Value | Customs value | Yes |
| Country of Origin | Manufacturing origin | No |
| HS Code | Harmonized system code | No |
| Purpose | Gift/Commercial/Personal | Yes |

### Expected Outcome
- Reusable packing slip section with itemized details
- Responsive table design for various screen sizes
- Summary calculations and totals
- Customs declaration information

### Verification Checklist
- [ ] Packing slip section created as reusable component
- [ ] Itemized table with all required columns
- [ ] Summary calculations implemented
- [ ] Customs declaration fields included
- [ ] Signature section added
- [ ] Print-optimized styling applied

---

## Task 61: Create Address Section

### Overview
Create a reusable address section component that standardizes the display of sender and recipient addresses across all label templates. This section ensures consistent formatting, handles Sri Lankan address formats, and provides clear visual separation between sender and recipient information.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create address section file**
   - Create `sections/address.html` in templates directory
   - Design as flexible Jinja2 include template
   - Support both side-by-side and stacked layouts

2. **Design dual address layout**
   - Sender address on left side
   - Recipient address on right side
   - Clear visual separation between sections
   - Responsive design for different label sizes

3. **Implement Sri Lankan address formatting**
   - Support for multi-line addresses
   - Proper district and province display
   - Postal code formatting and validation
   - Phone number formatting (+94 XX XXX XXXX)

4. **Add address type indicators**
   - Clear "FROM" and "TO" labels
   - Visual icons or symbols for clarity
   - Color-coded sections for quick identification
   - Sender/recipient role indication

5. **Create address validation display**
   - Indicate verified vs. unverified addresses
   - Show address completion status
   - Display geocoding confidence level
   - Include address correction suggestions

6. **Implement contact information**
   - Primary phone number display
   - Alternative contact numbers
   - Email addresses if available
   - Business hours for commercial addresses

7. **Add responsive address layout**
   - Stack vertically on small thermal labels
   - Side-by-side on A4 and larger formats
   - Adjust font sizes based on available space
   - Maintain readability across all sizes

### Address Section Layout

```
┌─────────────────────┬─────────────────────┐
│     FROM: 📤        │      TO: 📥         │
├─────────────────────┼─────────────────────┤
│ Sender Company      │ Recipient Name      │
│ Contact Person      │ Company Name        │
│ Street Address      │ Delivery Address    │
│ Address Line 2      │ Address Line 2      │
│ City, District      │ City, District      │
│ Province 12345      │ Province 67890      │
│ 📞 +94 77 123 4567 │ 📞 +94 71 987 6543 │
│ ✉️  info@company.lk │ 📧 customer@co.lk  │
└─────────────────────┴─────────────────────┘
```

### Sri Lankan Address Format

```
Standard Address Structure
├── Name/Company (Required)
├── Street/Building (Required)
├── Area/Locality (Optional)
├── City (Required)
├── District (Required)
├── Province (Optional)
├── Postal Code (5 digits)
└── Contact Number (Required)
```

### Address Display Variants

| Variant | Use Case | Layout |
|---------|----------|--------|
| Side-by-Side | A4, thermal 4x6 | Two columns |
| Stacked | Small thermal | Single column |
| Compact | Barcode labels | Abbreviated |
| Detailed | Packing slips | Full format |

### Contact Information Display

| Field | Format | Example |
|-------|--------|---------|
| Phone | +94 XX XXX XXXX | +94 77 123 4567 |
| Mobile | +94 7X XXX XXXX | +94 71 987 6543 |
| Email | Standard format | customer@company.lk |
| Hours | 24h or 12h | 9:00 AM - 6:00 PM |

### Address Validation Indicators

| Status | Display | Color |
|--------|---------|-------|
| Verified | ✓ icon | Green |
| Unverified | ? icon | Orange |
| Invalid | ✗ icon | Red |
| Incomplete | ⚠ icon | Yellow |

### Expected Outcome
- Reusable address section with standardized formatting
- Support for Sri Lankan address formats
- Responsive layout for different label sizes
- Contact information and validation indicators

### Verification Checklist
- [ ] Address section created as reusable component
- [ ] Sri Lankan address format implemented
- [ ] Side-by-side and stacked layout options
- [ ] Contact information formatting applied
- [ ] Address validation indicators included
- [ ] Responsive design for various label sizes

---

## Task 62: Create COD Section

### Overview
Create a specialized Cash on Delivery (COD) section component that prominently displays COD amounts, payment instructions, and collection procedures. This section ensures COD information is clearly visible and properly formatted for Sri Lankan currency and payment practices.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create COD section file**
   - Create `sections/cod.html` in templates directory
   - Design as reusable template component
   - Configure for prominent display when COD is required

2. **Design COD amount display**
   - Large, bold formatting for COD amount
   - Sri Lankan Rupee (₨) currency symbol
   - Proper number formatting with thousands separators
   - Red or orange highlighting for attention

3. **Implement payment instructions**
   - Accepted payment methods (cash, card, mobile)
   - Change requirements and limitations
   - Receipt and documentation procedures
   - Customer verification requirements

4. **Add COD status indicators**
   - Paid vs. Unpaid status display
   - Payment confirmation methods
   - Collection agent identification
   - Payment receipt reference numbers

5. **Create COD collection details**
   - Collection agent name and ID
   - Collection date and time
   - Customer identification requirements
   - Signature and verification procedures

6. **Implement COD variations**
   - Standard COD (full amount)
   - Partial COD (partial payment)
   - COD with return (exchange scenarios)
   - Multiple payment method options

7. **Add COD compliance features**
   - Legal disclaimers and terms
   - Return policy information
   - Dispute resolution procedures
   - Regulatory compliance statements

### COD Section Layout

```
┌─────────────────────────────────────┐
│           💰 CASH ON DELIVERY       │
├─────────────────────────────────────┤
│                                     │
│         COD AMOUNT                  │
│          ₨ 12,500.00               │
│                                     │
├─────────────────────────────────────┤
│ 💳 PAYMENT METHODS:                │
│ ✓ Cash (Exact change preferred)    │
│ ✓ Card (Visa, Master, Amex)       │
│ ✓ Mobile (eZ Cash, mCash)          │
├─────────────────────────────────────┤
│ 📋 COLLECTION DETAILS:             │
│ Agent: John Silva (ID: AG001)      │
│ Date: 31/01/2026 Time: 2:00 PM    │
│ Status: ⏳ PENDING COLLECTION      │
├─────────────────────────────────────┤
│ ⚠️  CUSTOMER REQUIREMENTS:          │
│ • Valid ID for verification        │
│ • Signature required on receipt    │
│ • Inspect items before payment     │
└─────────────────────────────────────┘
```

### COD Amount Formatting

| Scenario | Display Format | Example |
|----------|----------------|---------|
| Standard COD | ₨ X,XXX.XX | ₨ 12,500.00 |
| Large Amount | ₨ XX,XXX.XX | ₨ 125,000.00 |
| Partial COD | ₨ XXX.XX (Partial) | ₨ 2,500.00 (Partial) |
| No COD | PREPAID | PREPAID |

### Payment Method Icons

| Method | Icon | Description |
|--------|------|-------------|
| Cash | 💵 | Physical currency |
| Card | 💳 | Credit/debit cards |
| Mobile | 📱 | Mobile payments |
| Bank | 🏦 | Bank transfers |

### COD Status Indicators

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Pending | ⏳ | Orange | Awaiting collection |
| Collected | ✅ | Green | Payment received |
| Failed | ❌ | Red | Collection failed |
| Partial | 🔄 | Blue | Partially collected |

### Legal and Compliance

| Item | Content |
|------|---------|
| Terms | COD terms and conditions |
| Returns | Return policy for COD orders |
| Disputes | Dispute resolution process |
| Liability | Courier liability limitations |

### Expected Outcome
- Prominent COD section with clear amount display
- Payment method options and instructions
- Collection procedures and requirements
- Status tracking and compliance information

### Verification Checklist
- [ ] COD section created with prominent amount display
- [ ] Sri Lankan Rupee formatting implemented
- [ ] Payment method options included
- [ ] Collection details and procedures added
- [ ] Status indicators and tracking
- [ ] Legal compliance information included

---

## Task 63: Create Instructions Section

### Overview
Create a flexible delivery instructions section that displays special handling requirements, delivery preferences, and customer notes. This section ensures important delivery information is clearly communicated to courier staff and is easily customizable for different instruction types.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create instructions section file**
   - Create `sections/instructions.html` in templates directory
   - Design as flexible template component
   - Support various instruction types and priorities

2. **Design instruction categories**
   - Delivery preferences (time, location)
   - Special handling (fragile, electronics)
   - Customer requirements (ID, signature)
   - Access instructions (gate codes, directions)

3. **Implement priority indicators**
   - Critical instructions (red highlighting)
   - Important instructions (orange highlighting)
   - Standard instructions (normal formatting)
   - Optional notes (lighter formatting)

4. **Add instruction formatting**
   - Clear, readable text formatting
   - Icon indicators for instruction types
   - Numbered or bulleted lists
   - Proper spacing and line breaks

5. **Create instruction templates**
   - Common instruction templates
   - Customizable instruction fields
   - Predefined instruction options
   - Free-text instruction support

6. **Implement multilingual support**
   - English instruction display
   - Sinhala instruction support
   - Tamil instruction support
   - Language preference indicators

7. **Add instruction validation**
   - Character limits for different label sizes
   - Instruction completeness checking
   - Profanity and content filtering
   - Emergency contact information validation

### Instructions Section Layout

```
┌─────────────────────────────────────┐
│ 📋 DELIVERY INSTRUCTIONS            │
├─────────────────────────────────────┤
│ 🔴 CRITICAL:                       │
│ • Contact before delivery           │
│ • ID verification required          │
│                                     │
│ 🟡 IMPORTANT:                      │
│ • Handle with extreme care          │
│ • Keep upright at all times        │
│                                     │
│ 📍 ACCESS DETAILS:                  │
│ • Building: Blue Gate Apartments    │
│ • Floor: 3rd Floor, Apartment 3B   │
│ • Gate Code: #1234                  │
│ • Parking: Visitor parking available│
│                                     │
│ ⏰ DELIVERY WINDOW:                 │
│ • Preferred: 2:00 PM - 6:00 PM     │
│ • Alternative: Weekends OK          │
│                                     │
│ 📞 CONTACT:                         │
│ • Primary: +94 77 123 4567          │
│ • Emergency: +94 71 987 6543        │
└─────────────────────────────────────┘
```

### Instruction Categories

| Category | Purpose | Priority | Icon |
|----------|---------|----------|------|
| Critical | Must-do instructions | High | 🔴 |
| Important | Should-do instructions | Medium | 🟡 |
| Access | Location details | Standard | 📍 |
| Timing | Delivery windows | Standard | ⏰ |
| Contact | Communication | Standard | 📞 |

### Common Instructions

| Type | Example | Usage Frequency |
|------|---------|-----------------|
| Contact First | "Call before delivery" | Very High |
| Handle With Care | "Fragile - Handle carefully" | High |
| ID Required | "ID verification required" | Medium |
| Office Hours | "Office hours delivery only" | Medium |
| No Elevator | "Stairs only - No elevator" | Low |

### Instruction Priority Levels

| Priority | Display | Color | Usage |
|----------|---------|-------|-------|
| Critical | Bold, bordered | Red | Safety, security |
| Important | Bold | Orange | Handling, care |
| Standard | Regular | Black | General info |
| Optional | Light | Gray | Nice-to-have |

### Multilingual Support

| Language | Script | Example |
|----------|--------|---------|
| English | Latin | "Handle with care" |
| Sinhala | Sinhala | "සැලකිලිමත්ව හසුරුවන්න" |
| Tamil | Tamil | "கவனமாக கையாளவும்" |

### Character Limits

| Label Size | Max Characters | Typical Lines |
|------------|---------------|---------------|
| Thermal 4x6 | 200 characters | 4-6 lines |
| A4 Section | 500 characters | 8-12 lines |
| Full Page | 1000 characters | 15-20 lines |

### Expected Outcome
- Flexible instructions section with priority indicators
- Support for various instruction categories
- Multilingual capability for Sri Lankan languages
- Clear formatting and readability

### Verification Checklist
- [ ] Instructions section created with category support
- [ ] Priority indicators and color coding
- [ ] Common instruction templates available
- [ ] Multilingual support implemented
- [ ] Character limits and validation
- [ ] Icon indicators for instruction types

---

## Task 64: Create Custom Template UI

### Overview
Create an administrative user interface that allows authorized users to create, edit, and manage custom label templates. This UI provides a template editor with HTML/CSS editing capabilities, variable management, and preview functionality for creating organization-specific templates.

### Dependencies
- Task 52: Create Base Template
- Django admin framework is configured
- User authentication and permissions system

### Instructions

1. **Create template admin models**
   - Create `CustomTemplate` model in shipping app
   - Include fields for template name, HTML content, CSS styles
   - Add template category (courier, format, purpose)
   - Include template status and approval workflow

2. **Design template editor interface**
   - HTML code editor with syntax highlighting
   - CSS style editor with live preview
   - Template variable insertion tools
   - Template structure validation

3. **Implement variable management**
   - Available template variables list
   - Variable insertion helpers and shortcuts
   - Variable validation and type checking
   - Custom variable definition capabilities

4. **Create template form builder**
   - Drag-and-drop template components
   - Pre-built section library
   - Template layout wizard
   - Responsive design tools

5. **Add template preview functionality**
   - Real-time preview as changes are made
   - Sample data for template testing
   - Multiple format preview (thermal, A4)
   - Print preview simulation

6. **Implement template version control**
   - Template revision history
   - Version comparison tools
   - Rollback and restore capabilities
   - Change approval workflow

7. **Create template management features**
   - Template duplication and cloning
   - Template import/export functionality
   - Template sharing between organizations
   - Template backup and recovery

### Template Editor Interface

```
┌─────────────────────────────────────────────────────────┐
│ Custom Template Editor                                   │
├─────────────────────────────────────────────────────────┤
│ Template Name: [My Custom Template      ] [Save] [Preview]│
│ Category: [Thermal ▼] Format: [4x6 ▼] Status: [Draft ▼] │
├─────────────────────┬───────────────────────────────────┤
│ HTML Editor         │ CSS Editor                        │
│ ┌─────────────────┐ │ ┌─────────────────────────────────┐│
│ │<div class="hdr">│ │ │.header {                        ││
│ │  <h1>{{title}}</h1>│ │ │  font-size: 18px;               ││
│ │  <span>{{date}}</span>│ │ │  font-weight: bold;             ││
│ │</div>           │ │ │}                                ││
│ │<div class="addr">│ │ │.address {                       ││
│ │  {{sender_addr}} │ │ │  margin: 10px 0;                ││
│ │  {{recipient_addr}}│ │ │  line-height: 1.4;             ││
│ │</div>           │ │ │}                                ││
│ └─────────────────┘ │ └─────────────────────────────────┘│
├─────────────────────┼───────────────────────────────────┤
│ Variables Available │ Live Preview                      │
│ ☐ {{waybill_number}}│ ┌─────────────────────────────────┐│
│ ☐ {{sender_name}}   │ │ My Custom Template              ││
│ ☐ {{recipient_name}}│ │ 31/01/2026                      ││
│ ☐ {{courier_logo}}  │ │                                 ││
│ ☐ {{barcode}}       │ │ From: John Doe                  ││
│ ☐ {{qr_code}}       │ │ To: Jane Smith                  ││
│ [+ Add Custom Var]  │ │                                 ││
└─────────────────────┴───────────────────────────────────┘
```

### Template Model Structure

| Field | Type | Purpose |
|-------|------|---------|
| name | CharField | Template identifier |
| html_content | TextField | HTML template code |
| css_styles | TextField | CSS styling code |
| category | CharField | Template category |
| format | CharField | Label format (thermal, A4) |
| is_active | BooleanField | Template status |
| created_by | ForeignKey | Template author |
| version | IntegerField | Template version |

### Available Template Variables

| Category | Variables |
|----------|-----------|
| Waybill | waybill_number, date_created, courier_name |
| Sender | sender_name, sender_address, sender_phone |
| Recipient | recipient_name, recipient_address, recipient_phone |
| Package | weight, dimensions, items_count, cod_amount |
| Service | service_type, delivery_date, special_instructions |
| Branding | courier_logo, company_name, contact_info |

### Template Editor Features

| Feature | Description |
|---------|-------------|
| Syntax Highlighting | HTML/CSS code coloring |
| Auto-completion | Variable and tag suggestions |
| Error Validation | Template syntax checking |
| Live Preview | Real-time preview updates |
| Version Control | Save and restore versions |

### Template Categories

| Category | Purpose | Examples |
|----------|---------|---------|
| Courier Templates | Courier-specific | Koombiyo, Domex custom |
| Format Templates | Size-specific | Thermal, A4, Letter |
| Purpose Templates | Use-case specific | Express, COD, International |
| Organization Templates | Company-specific | Custom branding |

### Expected Outcome
- Complete template editor interface
- HTML/CSS editing with live preview
- Template variable management system
- Version control and approval workflow

### Verification Checklist
- [ ] Custom template model and admin interface created
- [ ] HTML/CSS editor with syntax highlighting
- [ ] Template variable insertion and validation
- [ ] Live preview functionality
- [ ] Template version control system
- [ ] Template management and sharing features

---

## Task 65: Create Template Preview

### Overview
Create a comprehensive template preview system that allows users to visualize how templates will appear when printed, test templates with sample data, and generate PDF previews for different label formats and courier services before actual printing.

### Dependencies
- Task 64: Create Custom Template UI

### Instructions

1. **Create preview generation system**
   - Develop template preview engine
   - Generate HTML previews with sample data
   - Convert HTML to PDF for print preview
   - Support multiple preview formats simultaneously

2. **Implement sample data system**
   - Create realistic sample datasets
   - Include various package types and scenarios
   - Generate random but consistent test data
   - Support custom sample data input

3. **Design preview interface**
   - Side-by-side template editor and preview
   - Multiple format preview (thermal, A4)
   - Zoom and scale preview controls
   - Print simulation with actual dimensions

4. **Add PDF generation**
   - Convert templates to PDF for printing
   - Support different paper sizes and orientations
   - Optimize PDF for thermal and laser printers
   - Include print job settings and metadata

5. **Create preview comparison tools**
   - Compare different template versions
   - Side-by-side courier template comparison
   - Before/after editing comparison
   - Template A/B testing interface

6. **Implement preview validation**
   - Check template rendering errors
   - Validate barcode and QR code generation
   - Test template with edge cases
   - Identify printing issues and warnings

7. **Add preview export features**
   - Save preview as PDF file
   - Export preview images (PNG, JPG)
   - Generate preview reports
   - Share preview links with stakeholders

### Preview Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│ Template Preview                                        │
├─────────────────────────────────────────────────────────┤
│ Template: [Koombiyo Thermal ▼]  Data: [Sample Set 1 ▼] │
│ Format: [4x6 Thermal ▼]         Zoom: [100% ▼] [PDF]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│     ┌─────────────────────────────────────┐            │
│     │ KOOMBIYO    WB: KB123456789         │            │
│     │ ─────────────────────────────────── │            │
│     │ FROM: John's Electronics            │            │
│     │       123 Main St, Colombo 01       │            │
│     │       +94 11 234 5678               │            │
│     │                                     │            │
│     │ TO:   Jane Smith                    │            │
│     │       456 Galle Road                │            │
│     │       Kandy, Central Province       │            │
│     │       +94 77 987 6543               │            │
│     │                                     │            │
│     │ Service: Express    COD: ₨ 2,500    │            │
│     │ Weight: 1.2kg      Items: 3         │            │
│     │                                     │            │
│     │ Instructions:                       │            │
│     │ Handle with care - Electronics      │            │
│     │                                     │            │
│     │ |||||||||||||||||||||||||||||||||||  │            │
│     │ KB123456789                         │            │
│     └─────────────────────────────────────┘            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [◀ Prev Template] [Generate PDF] [🖨️ Print] [Next ▶]    │
│                                                         │
│ ✅ Template renders correctly                           │
│ ✅ Barcode generates properly                           │
│ ⚠️  Text may be small for thermal printing              │
└─────────────────────────────────────────────────────────┘
```

### Sample Data Categories

| Category | Sample Data |
|----------|-------------|
| E-commerce | Electronics, clothing, books |
| Food Delivery | Restaurant orders, groceries |
| Documents | Legal papers, certificates |
| Medical | Prescriptions, medical supplies |
| Electronics | Phones, computers, accessories |

### Preview Formats

| Format | Dimensions | Use Case |
|--------|------------|----------|
| Thermal 4x6 | 4" × 6" | Standard courier labels |
| Thermal 4x8 | 4" × 8" | Extended information labels |
| A4 Portrait | 210 × 297mm | Office printing |
| Letter | 8.5" × 11" | US standard |
| Custom | User-defined | Special requirements |

### PDF Generation Options

| Setting | Options | Purpose |
|---------|---------|---------|
| Quality | 150, 300, 600 DPI | Print resolution |
| Color | Color, Grayscale, B&W | Print type |
| Paper | A4, Letter, Thermal | Paper size |
| Orientation | Portrait, Landscape | Layout |
| Margins | None, Minimal, Standard | Print margins |

### Preview Validation Checks

| Check | Description | Severity |
|-------|-------------|----------|
| Rendering | Template renders without errors | Error |
| Barcodes | Barcode generation successful | Error |
| Text Size | Text readable at print size | Warning |
| Margins | Content within print margins | Warning |
| Colors | Colors suitable for printing | Info |

### Expected Outcome
- Comprehensive preview system with multiple formats
- PDF generation for print testing
- Sample data system for realistic previews
- Preview validation and error checking

### Verification Checklist
- [ ] Preview generation system implemented
- [ ] Sample data system with various scenarios
- [ ] PDF generation with print optimization
- [ ] Multiple format preview support
- [ ] Preview validation and error checking
- [ ] Export and sharing functionality

---

## Task 66: Verify Templates

### Overview
Create a comprehensive template verification and testing system that validates all templates against various scenarios, checks for compatibility issues, tests printing functionality, and ensures all templates meet quality standards and operational requirements.

### Dependencies
- Task 65: Create Template Preview

### Instructions

1. **Create template testing framework**
   - Develop automated template testing system
   - Create test cases for different scenarios
   - Implement template quality checks
   - Generate comprehensive test reports

2. **Implement data validation tests**
   - Test templates with various data scenarios
   - Validate required field handling
   - Test with missing or incomplete data
   - Verify error handling and fallbacks

3. **Create rendering verification**
   - Test template rendering across browsers
   - Verify PDF generation consistency
   - Check print output quality
   - Test barcode and QR code generation

4. **Add courier-specific testing**
   - Test each courier template individually
   - Verify courier branding and requirements
   - Check courier-specific field handling
   - Validate courier workflow compatibility

5. **Implement print testing**
   - Test with actual thermal printers
   - Verify A4 printer output
   - Check print margins and scaling
   - Test various paper types and settings

6. **Create compatibility verification**
   - Test template browser compatibility
   - Verify mobile device display
   - Check printing from different devices
   - Test with various printer drivers

7. **Generate verification reports**
   - Comprehensive test result reports
   - Pass/fail status for each template
   - Identified issues and recommendations
   - Performance metrics and optimization suggestions

### Template Verification Matrix

```
┌─────────────────────────────────────────────────────────┐
│ Template Verification Dashboard                          │
├─────────────────────────────────────────────────────────┤
│ Test Summary: 8/8 Templates | 48/50 Tests Pass (96%)   │
├─────────────────────────────────────────────────────────┤
│ TEMPLATE         │ RENDER │ DATA │ PRINT │ COMPAT│ STATUS │
├──────────────────┼────────┼──────┼───────┼───────┼────────┤
│ Base Template    │   ✅   │  ✅  │   ✅  │   ✅  │   ✅   │
│ Koombiyo         │   ✅   │  ✅  │   ✅  │   ✅  │   ✅   │
│ Domex            │   ✅   │  ✅  │   ✅  │   ✅  │   ✅   │
│ PromptX          │   ✅   │  ✅  │   ⚠️   │   ✅  │   ⚠️   │
│ RoyalExpress     │   ✅   │  ✅  │   ✅  │   ✅  │   ✅   │
│ TranceExpress    │   ✅   │  ✅  │   ✅  │   ✅  │   ✅   │
│ Thermal          │   ✅   │  ✅  │   ✅  │   ✅  │   ✅   │
│ A4 with Slip     │   ✅   │  ✅  │   ❌  │   ✅  │   ❌   │
├──────────────────┴────────┴──────┴───────┴───────┴────────┤
│ ISSUES IDENTIFIED:                                       │
│ ⚠️  PromptX: Small text on some thermal printers         │
│ ❌  A4 Template: Packing slip table overflow             │
│                                                         │
│ RECOMMENDATIONS:                                        │
│ • Increase minimum font size for thermal templates     │
│ • Adjust A4 template table column widths              │
│ • Test with additional printer models                  │
└─────────────────────────────────────────────────────────┘
```

### Testing Categories

| Category | Tests | Description |
|----------|-------|-------------|
| Rendering | 8 tests | Template HTML/CSS rendering |
| Data Handling | 12 tests | Various data scenarios |
| Print Output | 15 tests | Different printer types |
| Compatibility | 10 tests | Browser and device support |
| Performance | 5 tests | Loading and generation speed |

### Test Scenarios

| Scenario | Description | Test Cases |
|----------|-------------|------------|
| Complete Data | All fields populated | Standard orders |
| Missing Data | Some fields empty | Incomplete addresses |
| Edge Cases | Extreme values | Very long addresses |
| Special Characters | Unicode, symbols | Sinhala, Tamil text |
| Large Orders | Many items | 20+ item packing slip |

### Verification Checklist

| Item | Verification Points |
|------|-------------------|
| Template Syntax | Valid HTML, CSS, Jinja2 |
| Required Fields | All mandatory fields handled |
| Error Handling | Graceful failure modes |
| Print Quality | Readable at actual size |
| Barcode Generation | Scannable codes produced |
| Browser Support | Chrome, Firefox, Safari, Edge |

### Print Testing Matrix

| Printer Type | Paper Size | Test Results |
|--------------|------------|--------------|
| Thermal Direct | 4" × 6" | ✅ Pass |
| Thermal Transfer | 4" × 6" | ✅ Pass |
| Inkjet A4 | 210 × 297mm | ⚠️ Minor issues |
| Laser A4 | 210 × 297mm | ✅ Pass |
| Mobile Thermal | 4" × 6" | ⚠️ Font size |

### Issue Severity Levels

| Level | Symbol | Description | Action Required |
|-------|--------|-------------|-----------------|
| Pass | ✅ | No issues | None |
| Warning | ⚠️ | Minor issues | Recommended fix |
| Fail | ❌ | Major issues | Must fix before use |
| Critical | 🔴 | Blocking issues | Immediate attention |

### Expected Outcome
- Complete template verification system
- Automated testing with comprehensive reports
- Quality assurance for all template types
- Print testing and compatibility verification

### Verification Checklist
- [ ] Template testing framework implemented
- [ ] Data validation tests covering all scenarios
- [ ] Print testing with actual hardware
- [ ] Browser and device compatibility verified
- [ ] Courier-specific requirements validated
- [ ] Comprehensive verification reports generated

---

## Summary

This document completed the label template system by creating A4 templates with packing slips, reusable template sections, custom template management UI, preview functionality, and comprehensive verification procedures for all Sri Lankan courier services.

### Completed Tasks
1. ✓ Created A4 template with courier label and detailed packing slip
2. ✓ Created reusable packing slip section with itemized details
3. ✓ Created standardized address section for consistent formatting
4. ✓ Created COD section with payment instructions and collection details
5. ✓ Created delivery instructions section with priority indicators
6. ✓ Created custom template administration UI with editor and preview
7. ✓ Created comprehensive template preview system with PDF generation
8. ✓ Created template verification system with automated testing

### Final Deliverables
- Complete HTML label template system for all Sri Lankan couriers
- Jinja2 template engine with Sri Lankan localization
- Custom template editor with live preview
- Comprehensive testing and verification framework
- Print-optimized templates for thermal and A4 formats

The label template system is now ready for integration with the waybill generation workflow and can produce professional courier labels for all major Sri Lankan delivery services.