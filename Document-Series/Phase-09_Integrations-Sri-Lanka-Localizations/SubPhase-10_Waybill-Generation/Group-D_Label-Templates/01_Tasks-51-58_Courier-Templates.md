# Tasks 51-58: Courier Templates

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** D - Label Templates  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-59-66_Sections-Custom-Verify.md](02_Tasks-59-66_Sections-Custom-Verify.md)

---

## Document Overview

This document covers the creation of the Jinja2 template engine and HTML label templates for all Sri Lankan courier services. It establishes the foundational template engine, creates a base template structure, and implements courier-specific templates for Koombiyo, Domex, PromptX, Royal Express, and Trance Express, along with specialized thermal printing templates.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Template Engine | Medium | 45 min |
| 52 | Create Base Template | Medium | 40 min |
| 53 | Create Koombiyo Template | Medium | 35 min |
| 54 | Create Domex Template | Medium | 35 min |
| 55 | Create PromptX Template | Medium | 35 min |
| 56 | Create RoyalExpress Template | Medium | 35 min |
| 57 | Create TranceExpress Template | Medium | 35 min |
| 58 | Create Thermal Template | Medium | 40 min |

---

## Task 51: Create Template Engine

### Overview
Set up the Jinja2 template engine for HTML label generation. This engine will handle template rendering with custom filters for Sri Lankan formatting requirements, dynamic content insertion, and courier-specific template selection. The engine provides the foundation for all label template functionality.

### Dependencies
- Task 50: Create Waybill Data Processor (from Group C)
- Django framework is configured
- Shipping app structure is established

### Instructions

1. **Install Jinja2 dependencies**
   - Add Jinja2 to project requirements
   - Install Jinja2 with Django integration
   - Configure template loading capabilities

2. **Create template engine module**
   - Create `engine.py` in `backend/apps/shipping/generators/templates/`
   - Define `TemplateEngine` class with Jinja2 configuration
   - Set up template directory path resolution

3. **Configure template environment**
   - Set Jinja2 environment with proper settings
   - Configure template loading from filesystem
   - Set auto-escaping for HTML templates
   - Define template file extension (.html)

4. **Create Sri Lankan formatting filters**
   - Create `format_lkr` filter for currency display (₨ 1,500.00)
   - Create `format_phone` filter for Sri Lankan phone numbers (+94 XX XXX XXXX)
   - Create `format_date` filter for Asia/Colombo timezone
   - Create `format_address` filter for multiline address formatting

5. **Create courier branding globals**
   - Define global variables for company information
   - Set courier logo paths and URLs
   - Configure brand color schemes for each courier
   - Set default fonts and styling preferences

6. **Implement template rendering methods**
   - Create `render_template` method with data context
   - Create `get_template` method for template loading
   - Create `render_to_string` method for HTML output
   - Add error handling for missing templates

7. **Add template validation**
   - Validate template syntax before rendering
   - Check for required template variables
   - Handle missing context data gracefully
   - Log template rendering errors

### Template Engine Structure

```
TemplateEngine
├── __init__()
│   ├── Setup Jinja2 environment
│   ├── Register custom filters
│   └── Configure globals
├── render_template()
│   ├── Load template by name
│   ├── Inject context data
│   └── Return rendered HTML
├── get_courier_template()
│   ├── Select courier-specific template
│   └── Apply courier branding
└── validate_template()
    ├── Check template syntax
    └── Verify required variables
```

### Custom Filters

| Filter Name | Purpose | Example Input | Example Output |
|-------------|---------|---------------|----------------|
| format_lkr | Currency formatting | 1500.50 | ₨ 1,500.50 |
| format_phone | Phone formatting | 0771234567 | +94 77 123 4567 |
| format_date | Date formatting | 2026-01-31 | 31st January 2026 |
| format_address | Address formatting | Street, City | Street<br>City |

### Global Variables

| Variable | Type | Purpose |
|----------|------|---------|
| company_name | string | LankaCommerce Cloud |
| company_address | dict | Company address details |
| courier_logos | dict | Logo paths by courier |
| brand_colors | dict | Color schemes by courier |
| print_settings | dict | Print optimization settings |

### Template Context Structure

```
Context Data Flow
├── Waybill Information
│   ├── waybill_number
│   ├── courier_service
│   └── shipment_date
├── Sender Details
│   ├── name, address, phone
│   └── company_info
├── Recipient Details
│   ├── name, address, phone
│   └── special_instructions
├── Package Information
│   ├── items_list
│   ├── total_weight
│   └── cod_amount
└── Courier Branding
    ├── logo_url
    ├── brand_colors
    └── contact_info
```

### Expected Outcome
- Functional Jinja2 template engine
- Sri Lankan formatting filters implemented
- Courier-specific global variables configured
- Template rendering and validation methods ready

### Verification Checklist
- [ ] Jinja2 engine initialized with proper configuration
- [ ] Custom filters for LKR, phone, date, address formatting work
- [ ] Global variables for courier branding are accessible
- [ ] Template rendering methods function correctly
- [ ] Error handling for missing templates implemented
- [ ] Template validation prevents syntax errors

---

## Task 52: Create Base Template

### Overview
Create the base HTML template that serves as the foundation for all courier-specific label templates. This template defines the common structure, styling, and layout elements that will be inherited by all courier templates, ensuring consistency while allowing for courier-specific customization.

### Dependencies
- Task 51: Create Template Engine

### Instructions

1. **Create base template file**
   - Create `base.html` in `backend/apps/shipping/generators/templates/`
   - Set up HTML5 document structure
   - Define template blocks for customization

2. **Design template structure**
   - Create header block for logo and waybill information
   - Create main content block for courier-specific content
   - Create footer block for barcodes and additional information
   - Set up CSS block for courier-specific styling

3. **Implement responsive layout**
   - Use CSS Grid or Flexbox for layout structure
   - Ensure templates work for both thermal and A4 printing
   - Set up print-optimized CSS with @media print rules
   - Configure page margins and padding for different formats

4. **Add common styling elements**
   - Define typography scale for headings and body text
   - Set up color variables that can be overridden by couriers
   - Create border and spacing utilities
   - Configure barcode and QR code positioning

5. **Create template blocks**
   - `{% block title %}` for page title
   - `{% block styles %}` for courier-specific CSS
   - `{% block header %}` for header content customization
   - `{% block content %}` for main label content
   - `{% block footer %}` for footer information

6. **Implement print optimization**
   - Remove web-only elements in print view
   - Set proper page break handling
   - Configure print margins and scaling
   - Optimize colors for thermal and inkjet printing

7. **Add Sri Lankan localization**
   - Support Sinhala Unicode fonts
   - Configure right-to-left text support where needed
   - Set proper character encoding (UTF-8)
   - Include Sri Lankan address formatting

### Base Template Structure

```
<!DOCTYPE html>
<html>
├── <head>
│   ├── Meta tags and encoding
│   ├── Title block
│   ├── Base CSS styles
│   └── Courier-specific styles block
├── <body>
│   ├── Header Block
│   │   ├── Courier logo area
│   │   └── Waybill number area
│   ├── Content Block
│   │   ├── Sender information
│   │   ├── Recipient information
│   │   ├── Package details
│   │   └── Special instructions
│   └── Footer Block
│       ├── Barcode area
│       ├── QR code area
│       └── Fine print information
└── Print-specific styles
```

### CSS Framework

| Category | Implementation |
|----------|----------------|
| Typography | 16px base, scalable headings |
| Colors | CSS custom properties for theming |
| Layout | CSS Grid with print optimization |
| Spacing | Consistent margin and padding scale |
| Print | Optimized for thermal and laser printing |

### Template Blocks

| Block Name | Purpose | Override Frequency |
|------------|---------|-------------------|
| title | Page title | Always |
| styles | Custom CSS | Always |
| header | Header layout | Sometimes |
| content | Main content | Always |
| footer | Footer content | Sometimes |

### Print Specifications

| Format | Dimensions | Margin | Font Size |
|--------|------------|--------|-----------|
| Thermal 4x6 | 4" x 6" (102 x 152mm) | 2mm | 12px |
| A4 | 210 x 297mm | 10mm | 14px |
| Letter | 8.5" x 11" | 0.5" | 14px |

### Color Variables

```
CSS Custom Properties
├── --courier-primary: Default blue
├── --courier-secondary: Default gray
├── --text-primary: Dark gray
├── --text-secondary: Medium gray
├── --border-color: Light gray
└── --background-color: White
```

### Expected Outcome
- Reusable base template with block structure
- Print-optimized CSS for multiple formats
- Sri Lankan localization support
- Consistent styling foundation for all couriers

### Verification Checklist
- [ ] Base template file created with proper HTML5 structure
- [ ] Template blocks defined for customization
- [ ] Print CSS optimized for thermal and A4 formats
- [ ] Color variables system implemented
- [ ] Sri Lankan localization features added
- [ ] Typography and spacing scales established

---

## Task 53: Create Koombiyo Template

### Overview
Create the Koombiyo-specific label template by extending the base template. This template incorporates Koombiyo's branding elements, color scheme, and specific layout requirements for their courier service labels, optimized for their operational workflow and brand guidelines.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create Koombiyo template file**
   - Create `koombiyo.html` in templates directory
   - Extend the base template using Jinja2 inheritance
   - Override necessary blocks for Koombiyo customization

2. **Implement Koombiyo branding**
   - Set Koombiyo brand colors (primary red/orange theme)
   - Configure Koombiyo logo placement and sizing
   - Apply Koombiyo-specific typography and styling
   - Use official Koombiyo color palette

3. **Customize header section**
   - Place Koombiyo logo prominently in header
   - Display "KOOMBIYO" brand name with proper styling
   - Include Koombiyo contact information and website
   - Add waybill number with Koombiyo formatting

4. **Design content layout**
   - Structure sender and recipient information for Koombiyo workflow
   - Include Koombiyo-specific fields (branch code, service type)
   - Display COD amount with Koombiyo styling
   - Add delivery instructions section

5. **Configure footer elements**
   - Include Koombiyo terms and conditions reference
   - Add Koombiyo customer service contact details
   - Position barcodes according to Koombiyo requirements
   - Include tracking information format

6. **Add Koombiyo-specific features**
   - Include branch office information
   - Add service type indicators (express, standard)
   - Display special handling instructions
   - Include insurance information if applicable

7. **Optimize for Koombiyo operations**
   - Layout optimized for Koombiyo scanning systems
   - Information arranged for efficient processing
   - Clear separation of critical vs. supplementary data
   - Easy-to-read font sizes for warehouse operations

### Koombiyo Brand Guidelines

| Element | Specification |
|---------|---------------|
| Primary Color | #FF6600 (Orange) |
| Secondary Color | #333333 (Dark Gray) |
| Logo Position | Top-left header |
| Typography | Open Sans, Arial fallback |
| Accent Color | #FF9933 (Light Orange) |

### Template Layout Structure

```
┌─────────────────────────────────────┐
│ KOOMBIYO LOGO    WAYBILL: KB123456 │
│ www.koombiyo.lk   Date: 31/01/2026 │
├─────────────────────────────────────┤
│ FROM:                    TO:        │
│ Sender Name              Recipient  │
│ Address Line 1           Name       │
│ Address Line 2           Address 1  │
│ Phone: +94771234567      Address 2  │
│                          Phone      │
├─────────────────────────────────────┤
│ SERVICE: Express         COD: ₨0    │
│ BRANCH: Colombo 01       ITEMS: 1   │
│ WEIGHT: 0.5kg            VALUE: ₨0  │
├─────────────────────────────────────┤
│ SPECIAL INSTRUCTIONS:               │
│ Handle with care                    │
├─────────────────────────────────────┤
│ [BARCODE]              [QR CODE]    │
│ KB123456789            Track Online │
└─────────────────────────────────────┘
```

### Koombiyo-Specific Fields

| Field | Purpose | Required |
|-------|---------|----------|
| Branch Code | Origin branch identification | Yes |
| Service Type | Express/Standard/Same Day | Yes |
| Hub Code | Destination hub | Yes |
| Special Handling | Fragile, Electronics, etc. | No |
| Insurance Value | Package insurance amount | No |

### Color Scheme Implementation

```
Koombiyo Colors
├── Header Background: #FF6600
├── Text on Orange: #FFFFFF
├── Primary Text: #333333
├── Secondary Text: #666666
├── Border Color: #CCCCCC
└── Accent Elements: #FF9933
```

### Expected Outcome
- Functional Koombiyo-branded label template
- Proper brand colors and logo integration
- Layout optimized for Koombiyo operations
- All required Koombiyo fields included

### Verification Checklist
- [ ] Koombiyo template extends base template correctly
- [ ] Koombiyo brand colors applied throughout
- [ ] Koombiyo logo positioned and sized properly
- [ ] All Koombiyo-specific fields included
- [ ] Layout optimized for Koombiyo workflow
- [ ] Contact information and branding elements complete

---

## Task 54: Create Domex Template

### Overview
Create the Domex-specific label template by extending the base template. This template incorporates Domex's distinctive branding elements, blue color scheme, and specific layout requirements tailored to their courier service operations and brand identity.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create Domex template file**
   - Create `domex.html` in templates directory
   - Extend base template with Jinja2 inheritance
   - Override blocks for Domex-specific customization

2. **Implement Domex branding**
   - Apply Domex brand colors (blue and white theme)
   - Configure Domex logo placement and proportions
   - Set Domex-specific typography and font weights
   - Use official Domex corporate color palette

3. **Customize header layout**
   - Position Domex logo with proper brand spacing
   - Display "DOMEX" brand name with corporate styling
   - Include Domex website and customer service information
   - Format waybill number with Domex numbering system

4. **Design content structure**
   - Organize sender/recipient layout for Domex processing
   - Include Domex service identifiers and codes
   - Display package information with Domex formatting
   - Add Domex delivery preference options

5. **Configure footer information**
   - Include Domex terms of service reference
   - Add Domex tracking and inquiry details
   - Position barcodes per Domex scanning requirements
   - Include Domex network coverage information

6. **Add Domex operational features**
   - Include depot and route information
   - Add Domex service level indicators
   - Display special delivery instructions format
   - Include Domex liability and insurance details

7. **Optimize for Domex workflow**
   - Layout structured for Domex sorting systems
   - Information hierarchy for efficient handling
   - Clear visual separation of processing zones
   - Readable fonts for warehouse scanning

### Domex Brand Guidelines

| Element | Specification |
|---------|---------------|
| Primary Color | #0056B3 (Blue) |
| Secondary Color | #FFFFFF (White) |
| Logo Position | Top-center header |
| Typography | Roboto, Helvetica fallback |
| Accent Color | #E6F3FF (Light Blue) |

### Template Layout Structure

```
┌─────────────────────────────────────┐
│        DOMEX LOGO                   │
│    Delivering Excellence            │
│  Waybill: DX987654  Date: 31/01/26 │
├─────────────────────────────────────┤
│ SENDER:                 RECIPIENT:  │
│ Company/Name            Name        │
│ Street Address          Address     │
│ City, District          City        │
│ Contact: +94XX XXX XXXX Phone       │
├─────────────────────────────────────┤
│ SERVICE TYPE: Standard              │
│ DEPOT: Colombo          COD: ₨ 0   │
│ WEIGHT: 1.2kg          PIECES: 2   │
│ DIMENSIONS: 30x20x15cm              │
├─────────────────────────────────────┤
│ DELIVERY INSTRUCTIONS:              │
│ Office hours only                   │
├─────────────────────────────────────┤
│ |||||||||||||||    ▄▄▄▄▄▄▄▄▄▄    │
│ DX987654321        ▄ QR CODE ▄     │
│                    ▄▄▄▄▄▄▄▄▄▄     │
│ www.domex.lk | 011-2345678         │
└─────────────────────────────────────┘
```

### Domex-Specific Fields

| Field | Purpose | Required |
|-------|---------|----------|
| Depot Code | Processing facility | Yes |
| Route Code | Delivery route | Yes |
| Service Level | Standard/Express/Priority | Yes |
| Dimensions | Package measurements | No |
| Declared Value | Contents value | No |

### Domex Color Implementation

```
Domex Color Palette
├── Primary Blue: #0056B3
├── Header Background: #E6F3FF
├── Text Primary: #003366
├── Text Secondary: #666666
├── Border Color: #B3D9FF
└── Accent Blue: #3399FF
```

### Expected Outcome
- Professional Domex-branded label template
- Proper blue color scheme implementation
- Layout optimized for Domex operations
- All required Domex operational fields

### Verification Checklist
- [ ] Domex template extends base template properly
- [ ] Domex blue branding applied consistently
- [ ] Domex logo positioned and branded correctly
- [ ] All Domex operational fields included
- [ ] Layout supports Domex processing workflow
- [ ] Contact and tracking information complete

---

## Task 55: Create PromptX Template

### Overview
Create the PromptX-specific label template by extending the base template. This template incorporates PromptX's modern branding elements, green color scheme, and specialized layout for their same-day delivery service with emphasis on speed and efficiency indicators.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create PromptX template file**
   - Create `promptx.html` in templates directory
   - Extend base template using Jinja2 inheritance
   - Override blocks for PromptX-specific customization

2. **Implement PromptX branding**
   - Apply PromptX brand colors (green and black theme)
   - Configure PromptX logo with modern styling
   - Set contemporary typography matching PromptX brand
   - Use official PromptX digital brand guidelines

3. **Customize header with speed emphasis**
   - Position PromptX logo with dynamic styling
   - Display "PROMPTX" with speed indicators
   - Include same-day delivery badges and timing
   - Format waybill with PromptX tracking system

4. **Design content for efficiency**
   - Structure layout for rapid processing
   - Include PromptX time slot information
   - Display urgency indicators and priority levels
   - Add PromptX delivery window specifications

5. **Configure footer with tracking**
   - Include PromptX real-time tracking information
   - Add PromptX mobile app promotion
   - Position barcodes for automated sorting
   - Include GPS tracking reference numbers

6. **Add PromptX service features**
   - Include time slot booking information
   - Add same-day delivery confirmation
   - Display PromptX speed metrics
   - Include customer notification preferences

7. **Optimize for speed operations**
   - Layout designed for quick scanning
   - Color-coded priority indicators
   - Minimal text for rapid processing
   - Large, clear identifiers for sorting

### PromptX Brand Guidelines

| Element | Specification |
|---------|---------------|
| Primary Color | #00CC66 (Green) |
| Secondary Color | #1A1A1A (Black) |
| Logo Position | Top-left with badge |
| Typography | Montserrat, Sans-serif fallback |
| Accent Color | #66FF99 (Light Green) |

### Template Layout Structure

```
┌─────────────────────────────────────┐
│ PROMPTX ⚡ SAME DAY   PX456789     │
│ Speed Delivered     📅 31/01/26    │
├─────────────────────────────────────┤
│ 🚀 URGENT DELIVERY - TIME: 2:00 PM │
├─────────────────────────────────────┤
│ FROM:                    TO:        │
│ Pickup Location          Delivery   │
│ Address 1                Name       │
│ Address 2                Address 1  │
│ Phone: +94XX XXX XXXX    Address 2  │
│                          Phone      │
├─────────────────────────────────────┤
│ ⏰ PICKUP: 10:00 AM    COD: ₨ 0   │
│ 📦 ITEMS: 1            🏃 EXPRESS   │
│ ⚖️  WEIGHT: 0.3kg      💰 VALUE: ₨0 │
├─────────────────────────────────────┤
│ 📝 DELIVERY NOTES:                 │
│ Call on arrival - Office delivery  │
├─────────────────────────────────────┤
│ ████████████████    ⬛⬛⬛⬛⬛     │
│ PX456789012         ⬛ QR  ⬛     │
│ Track: promptx.lk   ⬛⬛⬛⬛⬛     │
└─────────────────────────────────────┘
```

### PromptX-Specific Fields

| Field | Purpose | Required |
|-------|---------|----------|
| Time Slot | Delivery window | Yes |
| Priority Level | Urgent/Standard | Yes |
| Pickup Time | Collection time | Yes |
| GPS Reference | Location tracking | Yes |
| Customer Mobile | SMS notifications | Yes |

### PromptX Color Implementation

```
PromptX Color Scheme
├── Primary Green: #00CC66
├── Header Background: #F0FFF4
├── Urgent Red: #FF3333
├── Text Primary: #1A1A1A
├── Text Secondary: #666666
└── Accent Green: #66FF99
```

### Speed Indicators

| Indicator | Display | Purpose |
|-----------|---------|---------|
| ⚡ Lightning | Same-day badge | Speed emphasis |
| 🚀 Rocket | Urgent priority | High priority |
| ⏰ Clock | Time sensitive | Scheduling |
| 🏃 Runner | Express service | Service level |

### Expected Outcome
- Modern PromptX-branded label with speed emphasis
- Green color scheme with urgency indicators
- Time-sensitive delivery information highlighted
- Same-day delivery features prominently displayed

### Verification Checklist
- [ ] PromptX template extends base with modern styling
- [ ] Green branding and speed indicators implemented
- [ ] Time slot and urgency information included
- [ ] PromptX operational fields complete
- [ ] Layout optimized for rapid processing
- [ ] Same-day delivery features emphasized

---

## Task 56: Create RoyalExpress Template

### Overview
Create the RoyalExpress-specific label template by extending the base template. This template incorporates RoyalExpress's premium branding elements, purple and gold color scheme, and layout designed to reflect their premium courier service positioning and quality standards.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create RoyalExpress template file**
   - Create `royal_express.html` in templates directory
   - Extend base template with Jinja2 inheritance
   - Override blocks for RoyalExpress premium customization

2. **Implement RoyalExpress premium branding**
   - Apply RoyalExpress colors (purple and gold theme)
   - Configure RoyalExpress logo with premium styling
   - Set elegant typography reflecting premium positioning
   - Use official RoyalExpress brand guidelines

3. **Customize header with premium elements**
   - Position RoyalExpress logo with royal styling
   - Display "ROYAL EXPRESS" with premium typography
   - Include premium service indicators and badges
   - Format waybill with RoyalExpress numbering

4. **Design content for premium service**
   - Structure layout emphasizing quality and care
   - Include RoyalExpress premium service features
   - Display package handling instructions clearly
   - Add RoyalExpress quality assurance information

5. **Configure footer with premium touch**
   - Include RoyalExpress service guarantee
   - Add premium customer service information
   - Position barcodes with elegant styling
   - Include RoyalExpress network prestige

6. **Add RoyalExpress service features**
   - Include premium packaging options
   - Add insurance and liability coverage
   - Display RoyalExpress quality metrics
   - Include white-glove service indicators

7. **Optimize for premium operations**
   - Layout reflecting careful handling
   - Premium color scheme throughout
   - Elegant fonts and spacing
   - Quality indicators and assurances

### RoyalExpress Brand Guidelines

| Element | Specification |
|---------|---------------|
| Primary Color | #663399 (Royal Purple) |
| Secondary Color | #FFD700 (Gold) |
| Logo Position | Centered with crown |
| Typography | Playfair Display, Serif fallback |
| Accent Color | #E6E6FA (Lavender) |

### Template Layout Structure

```
┌─────────────────────────────────────┐
│          👑 ROYAL EXPRESS          │
│       Premium Courier Service      │
│   Waybill: RE789012  Date: 31/01/26│
├─────────────────────────────────────┤
│ ⭐ PREMIUM SERVICE - WHITE GLOVE ⭐ │
├─────────────────────────────────────┤
│ SENDER:                RECIPIENT:   │
│ Premium Client         Valued      │
│ Business Address       Customer     │
│ Location Details       Address     │
│ Contact: +94XX XXX XXXX Phone      │
├─────────────────────────────────────┤
│ 👑 SERVICE: Premium    COD: ₨ 0    │
│ 🛡️  INSURED: ₨10,000  📦 ITEMS: 1 │
│ ⚖️  WEIGHT: 2.1kg      💎 FRAGILE  │
│ 📏 SIZE: Large Package             │
├─────────────────────────────────────┤
│ 🎯 SPECIAL HANDLING:               │
│ Handle with extreme care - Fragile │
│ Signature required on delivery     │
├─────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ████████████   │
│ RE789012345         ██ ROYAL ██    │
│ Premium Guarantee   ████████████   │
│ 📞 Royal Care: 011-7777777         │
└─────────────────────────────────────┘
```

### RoyalExpress-Specific Fields

| Field | Purpose | Required |
|-------|---------|----------|
| Premium Level | Service tier | Yes |
| Insurance Value | Coverage amount | Yes |
| Handling Code | Special care | No |
| Signature Required | Delivery confirmation | Yes |
| White Glove | Premium handling | No |

### RoyalExpress Color Implementation

```
Royal Color Palette
├── Royal Purple: #663399
├── Premium Gold: #FFD700
├── Header Background: #F5F0FF
├── Text Primary: #2D1B69
├── Text Secondary: #666666
└── Accent Lavender: #E6E6FA
```

### Premium Indicators

| Symbol | Meaning | Usage |
|--------|---------|-------|
| 👑 Crown | Premium service | Header branding |
| ⭐ Star | Quality rating | Service level |
| 🛡️ Shield | Insurance protection | Coverage |
| 💎 Diamond | Fragile/valuable | Handling |

### Expected Outcome
- Elegant RoyalExpress-branded premium label
- Purple and gold color scheme implemented
- Premium service features highlighted
- Quality and care indicators throughout

### Verification Checklist
- [ ] RoyalExpress template with premium styling
- [ ] Purple and gold branding applied
- [ ] Premium service indicators included
- [ ] RoyalExpress operational fields complete
- [ ] Layout reflects premium positioning
- [ ] Quality assurance elements present

---

## Task 57: Create TranceExpress Template

### Overview
Create the TranceExpress-specific label template by extending the base template. This template incorporates TranceExpress's dynamic branding elements, blue and orange color scheme, and layout optimized for their express delivery service with emphasis on speed and reliability.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create TranceExpress template file**
   - Create `trance_express.html` in templates directory
   - Extend base template with Jinja2 inheritance
   - Override blocks for TranceExpress-specific customization

2. **Implement TranceExpress branding**
   - Apply TranceExpress colors (blue and orange theme)
   - Configure TranceExpress logo with dynamic elements
   - Set modern typography for express service
   - Use official TranceExpress brand standards

3. **Customize header with express elements**
   - Position TranceExpress logo with speed graphics
   - Display "TRANCE EXPRESS" with movement styling
   - Include express service badges and timing
   - Format waybill with TranceExpress tracking

4. **Design content for express operations**
   - Structure layout for fast processing
   - Include TranceExpress express service indicators
   - Display time-sensitive delivery information
   - Add TranceExpress speed guarantees

5. **Configure footer with tracking**
   - Include TranceExpress express tracking
   - Add express delivery guarantees
   - Position barcodes for rapid sorting
   - Include TranceExpress network coverage

6. **Add TranceExpress service features**
   - Include express delivery commitments
   - Add speed tracking metrics
   - Display TranceExpress reliability indicators
   - Include customer notification systems

7. **Optimize for express workflow**
   - Layout designed for speed processing
   - Clear express service indicators
   - Rapid identification elements
   - Streamlined information display

### TranceExpress Brand Guidelines

| Element | Specification |
|---------|---------------|
| Primary Color | #0066FF (Blue) |
| Secondary Color | #FF6600 (Orange) |
| Logo Position | Left with motion lines |
| Typography | Source Sans Pro, Sans fallback |
| Accent Color | #CCE6FF (Light Blue) |

### Template Layout Structure

```
┌─────────────────────────────────────┐
│ TRANCE EXPRESS ≫≫    TE654321      │
│ Speed Beyond Limits   📅 31/01/26   │
├─────────────────────────────────────┤
│ ⚡ EXPRESS DELIVERY - GUARANTEED ⚡ │
├─────────────────────────────────────┤
│ PICKUP:                 DELIVERY:   │
│ Express Hub             Express     │
│ Collection Point        Customer    │
│ Location A              Address     │
│ Contact: +94XX XXX XXXX Phone      │
├─────────────────────────────────────┤
│ 🚚 EXPRESS SERVICE    COD: ₨ 0     │
│ ⏱️  DELIVERY: 4PM     📦 ITEMS: 1  │
│ ⚖️  WEIGHT: 0.8kg      🎯 PRIORITY │
│ 📍 ZONE: Express Coverage          │
├─────────────────────────────────────┤
│ 📋 EXPRESS INSTRUCTIONS:           │
│ Time-critical delivery required    │
│ Contact on arrival mandatory       │
├─────────────────────────────────────┤
│ ■■■■■■■■■■■■■■■    ▀▀▀▀▀▀▀▀▀▀     │
│ TE654321890         ▀ EXPRESS ▀    │
│ Track Express       ▀▀▀▀▀▀▀▀▀▀     │
│ trance.express.lk                  │
└─────────────────────────────────────┘
```

### TranceExpress-Specific Fields

| Field | Purpose | Required |
|-------|---------|----------|
| Express Zone | Coverage area | Yes |
| Delivery Time | Committed time | Yes |
| Priority Level | Service urgency | Yes |
| Express Code | Service identifier | Yes |
| Speed Guarantee | Delivery promise | Yes |

### TranceExpress Color Implementation

```
Express Color Scheme
├── Express Blue: #0066FF
├── Speed Orange: #FF6600
├── Header Background: #F0F8FF
├── Text Primary: #003366
├── Text Secondary: #666666
└── Accent Blue: #CCE6FF
```

### Express Indicators

| Symbol | Meaning | Usage |
|--------|---------|-------|
| ⚡ Lightning | Express speed | Service level |
| ≫≫ Motion | Movement/speed | Logo enhancement |
| 🚚 Truck | Express delivery | Service type |
| ⏱️ Timer | Time commitment | Scheduling |

### Expected Outcome
- Dynamic TranceExpress-branded express label
- Blue and orange express color scheme
- Speed and reliability features emphasized
- Express delivery commitments highlighted

### Verification Checklist
- [ ] TranceExpress template with dynamic styling
- [ ] Blue and orange express branding applied
- [ ] Express service indicators prominent
- [ ] TranceExpress operational fields complete
- [ ] Layout optimized for express processing
- [ ] Speed guarantees and timing featured

---

## Task 58: Create Thermal Template

### Overview
Create a specialized thermal label template optimized for 4x6 inch thermal printers commonly used in Sri Lankan courier operations. This template focuses on essential information display with high contrast, clear fonts, and efficient use of limited space for direct thermal printing.

### Dependencies
- Task 52: Create Base Template

### Instructions

1. **Create thermal template file**
   - Create `thermal.html` in templates directory
   - Extend base template but override most layout blocks
   - Configure for 4x6 inch (102x152mm) thermal format

2. **Optimize for thermal printing**
   - Use high contrast black and white only
   - Set fonts optimized for thermal printing (no anti-aliasing)
   - Configure line thickness for thermal printer resolution
   - Remove gradient and shadow effects

3. **Design compact layout**
   - Maximize information density in 4x6 space
   - Prioritize essential information only
   - Use abbreviated labels and compact formatting
   - Eliminate non-essential decorative elements

4. **Configure thermal-specific CSS**
   - Set exact dimensions (4in x 6in)
   - Use point-based measurements for accuracy
   - Configure thermal printer margins (2-3mm)
   - Set thermal-optimized line heights

5. **Implement thermal barcode layout**
   - Position barcodes for thermal printer compatibility
   - Use appropriate barcode sizes for thermal resolution
   - Ensure barcode quiet zones are maintained
   - Configure Code 128 or Code 39 format

6. **Create thermal content structure**
   - Header: Courier + Waybill (minimal)
   - Addresses: Compact sender/recipient layout
   - Service info: Essential details only
   - Footer: Barcode + tracking info

7. **Add thermal printing optimizations**
   - Prevent page breaks within sections
   - Use thermal-safe fonts (Arial, Courier)
   - Configure printer-specific margins
   - Test with common thermal printer models

### Thermal Label Specifications

| Specification | Value |
|---------------|-------|
| Size | 4" x 6" (102mm x 152mm) |
| Resolution | 203 DPI (8 dots/mm) |
| Margins | 2mm all sides |
| Font Size | 10pt minimum, 14pt headers |
| Colors | Black on white only |

### Thermal Layout Structure

```
┌─────────────────────────────┐  4" (102mm)
│ COURIER    WB: 123456789   │  
├─────────────────────────────┤  
│ FR: Sender Name             │  6"
│     Address Line 1          │  (152mm)
│     City, Phone             │  
├─────────────────────────────┤  
│ TO: Recipient Name          │  
│     Address Line 1          │  
│     City + Phone            │  
├─────────────────────────────┤  
│ SVC:EXP COD:₨0 WT:1kg ITM:2│  
├─────────────────────────────┤  
│ |||||||||||||||||||||||||| │  
│ 123456789012345           │  
└─────────────────────────────┘  
```

### Thermal Content Prioritization

| Priority | Content | Space Allocation |
|----------|---------|------------------|
| Critical | Addresses, Waybill | 60% |
| Important | Service, COD, Weight | 25% |
| Essential | Barcode | 15% |
| Optional | Branding, extras | 0% |

### Thermal Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headers | Arial | 12pt | Bold |
| Addresses | Arial | 10pt | Regular |
| Details | Arial | 9pt | Regular |
| Barcode Text | Courier New | 8pt | Regular |

### Thermal CSS Rules

```
Thermal-Specific Styling
├── @page { size: 4in 6in; margin: 2mm; }
├── body { font-family: Arial; color: #000; }
├── .thermal-header { font-size: 12pt; font-weight: bold; }
├── .thermal-address { font-size: 10pt; line-height: 1.2; }
├── .thermal-details { font-size: 9pt; }
└── .thermal-barcode { margin-top: 5mm; }
```

### Expected Outcome
- Functional thermal label template for 4x6 printing
- High contrast layout optimized for thermal printers
- Essential information maximized in limited space
- Compatible with standard thermal printer settings

### Verification Checklist
- [ ] Thermal template optimized for 4x6 inch format
- [ ] Black and white high contrast design
- [ ] Essential information prioritized and compact
- [ ] Thermal printer margins and sizing correct
- [ ] Barcode positioned and sized appropriately
- [ ] Font choices compatible with thermal printing

---

## Summary

This document established the Jinja2 template engine and created HTML label templates for all major Sri Lankan courier services. The templates provide a consistent structure while allowing courier-specific branding and operational requirements.

### Completed Tasks
1. ✓ Created Jinja2 template engine with Sri Lankan formatting
2. ✓ Created base template with common structure and styling
3. ✓ Created Koombiyo template with orange branding
4. ✓ Created Domex template with blue corporate styling
5. ✓ Created PromptX template with green speed emphasis
6. ✓ Created RoyalExpress template with purple premium branding
7. ✓ Created TranceExpress template with blue/orange express styling
8. ✓ Created thermal template optimized for 4x6 direct thermal printing

### Next Steps
Proceed to [02_Tasks-59-66_Sections-Custom-Verify.md](02_Tasks-59-66_Sections-Custom-Verify.md) to create A4 templates with packing slips, template sections, custom template UI, preview functionality, and template verification procedures.