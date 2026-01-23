# Tasks 01-06: Submodule, Constants, and Header Configuration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** A - Receipt Template Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Display-Settings.md](02_Tasks-07-12_Display-Settings.md)

---

## Document Overview

This document covers the foundation of the receipt template system, including the submodule structure, receipt type and paper size constants, the core ReceiptTemplate model, and header configuration settings. These elements establish the base infrastructure for customizable receipt generation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create receipt submodule | Low | 10 min |
| 02 | Define receipt type constants | Low | 10 min |
| 03 | Define paper size constants | Low | 10 min |
| 04 | Create ReceiptTemplate model | Medium | 30 min |
| 05 | Add header configuration | Medium | 25 min |
| 06 | Add header text fields | Medium | 20 min |

---

## Task 01: Create Receipt Submodule

### Overview
Create the `receipts` submodule within the POS application to organize all receipt-related functionality. This submodule will contain models, constants, rendering logic, and administrative interfaces for receipt templates.

### Dependencies
- POS application (`apps/pos/`) must exist
- Django project structure is established

### Instructions

1. **Create receipts directory structure**
   - Navigate to `apps/pos/` directory
   - Create new directory named `receipts`
   - This will house all receipt generation functionality

2. **Create package initialization file**
   - Create `__init__.py` in `receipts/` directory
   - Leave empty or add module docstring

3. **Create models subdirectory**
   - Create `models/` directory inside `receipts/`
   - This will contain receipt-related models

4. **Create models package initialization**
   - Create `__init__.py` in `models/` directory
   - Leave empty initially (will import models later)

5. **Create constants module**
   - Create `constants.py` in `receipts/` directory
   - Will contain receipt types and paper sizes

6. **Create admin module**
   - Create `admin.py` in `receipts/` directory
   - Will contain Django admin configurations

### Directory Structure
```
apps/pos/receipts/
├── __init__.py                    # Package initialization
├── models/
│   └── __init__.py               # Models package init
├── constants.py                  # Constants definitions
└── admin.py                      # Admin configurations
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `receipts/__init__.py` | Package entry point |
| `models/__init__.py` | Model imports and exports |
| `constants.py` | Receipt types, paper sizes |
| `admin.py` | Django admin customization |

### Expected Outcome
- Clean submodule structure within POS app
- Organized location for receipt functionality
- Foundation for receipt template system

### Verification Checklist
- [ ] `apps/pos/receipts/` directory exists
- [ ] `receipts/__init__.py` file created
- [ ] `receipts/models/` directory exists
- [ ] `receipts/models/__init__.py` file created
- [ ] `receipts/constants.py` file created
- [ ] `receipts/admin.py` file created

---

## Task 02: Define Receipt Type Constants

### Overview
Define standard receipt type constants that identify different kinds of receipts generated in the system. These constants ensure consistency across the application when categorizing and processing receipts.

### Dependencies
- Task 01: Create receipt submodule

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/pos/receipts/constants.py`
   - Prepare to define receipt type constants

2. **Add module docstring**
   - Add comprehensive module documentation
   - Explain the purpose of constants
   - Note usage context (receipt generation, filtering, reporting)

3. **Define RECEIPT_TYPES constant**
   - Create tuple of receipt type choices
   - Follow Django's choices pattern (value, display_name)
   - Include all standard receipt types

4. **Define RECEIPT_TYPE_SALE constant**
   - Value: 'sale'
   - Purpose: Normal sale transactions
   - Most common receipt type

5. **Define RECEIPT_TYPE_REFUND constant**
   - Value: 'refund'
   - Purpose: Return/refund transactions
   - Shows items being returned

6. **Define RECEIPT_TYPE_VOID constant**
   - Value: 'void'
   - Purpose: Voided transactions
   - Indicates cancelled sale

7. **Define RECEIPT_TYPE_REPRINT constant**
   - Value: 'reprint'
   - Purpose: Duplicate receipt generation
   - Marks as copy of original

### Receipt Type Details

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| RECEIPT_TYPE_SALE | 'sale' | Sale | Standard purchase transaction |
| RECEIPT_TYPE_REFUND | 'refund' | Refund | Customer return/refund |
| RECEIPT_TYPE_VOID | 'void' | Void | Cancelled transaction |
| RECEIPT_TYPE_REPRINT | 'reprint' | Reprint | Duplicate receipt |

### Receipt Type Usage Scenarios

#### Sale Receipt
- Generated at point of sale
- Shows purchased items
- Payment information
- Change given
- Most frequently used

#### Refund Receipt
- Generated during returns
- Shows returned items
- Refund amount
- Original transaction reference
- May show restocking fees

#### Void Receipt
- Generated when voiding transaction
- Shows voided items
- Void reason
- Original transaction details
- Manager authorization

#### Reprint Receipt
- Generated on customer request
- Identical to original
- Marked as "DUPLICATE" or "REPRINT"
- Same transaction reference
- Does not affect financial records

### Expected Outcome
- Clear receipt type categorization
- Consistent receipt type values
- Foundation for receipt type filtering
- Support for various transaction types

### Verification Checklist
- [ ] RECEIPT_TYPES tuple defined
- [ ] RECEIPT_TYPE_SALE constant created
- [ ] RECEIPT_TYPE_REFUND constant created
- [ ] RECEIPT_TYPE_VOID constant created
- [ ] RECEIPT_TYPE_REPRINT constant created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly

---

## Task 03: Define Paper Size Constants

### Overview
Define paper size constants for different receipt formats. These constants determine the physical dimensions and character width constraints for receipt rendering, supporting thermal printers and standard paper sizes.

### Dependencies
- Task 01: Create receipt submodule

### Instructions

1. **Open constants.py file**
   - Continue in `apps/pos/receipts/constants.py`
   - Add paper size constants section

2. **Add paper size documentation**
   - Document each paper size
   - Include physical dimensions
   - Note character width per line

3. **Define PAPER_SIZES constant**
   - Create tuple of paper size choices
   - Follow Django's choices pattern
   - Include all supported formats

4. **Define PAPER_SIZE_THERMAL_80MM constant**
   - Value: '80mm'
   - Most common thermal paper size
   - Standard for POS thermal printers

5. **Define PAPER_SIZE_THERMAL_58MM constant**
   - Value: '58mm'
   - Smaller thermal paper format
   - Used in mobile/compact printers

6. **Define PAPER_SIZE_A4 constant**
   - Value: 'a4'
   - Standard paper size (210mm × 297mm)
   - Used for formal receipts/invoices

7. **Create character width mapping**
   - Define PAPER_SIZE_CHAR_WIDTHS dictionary
   - Map paper sizes to character width
   - Used for text wrapping and formatting

### Paper Size Specifications

| Paper Size | Constant Value | Physical Width | Character Width | Typical Use |
|------------|----------------|----------------|-----------------|-------------|
| Thermal 80mm | '80mm' | 80mm (3.15") | 48 characters | Standard POS thermal printers |
| Thermal 58mm | '58mm' | 58mm (2.28") | 32 characters | Mobile/compact printers |
| A4 | 'a4' | 210mm (8.27") | Variable (60-80) | Invoice-style receipts |

### Character Width Calculation

#### Thermal 80mm (48 characters)
```
╔════════════════════════════════════════════════╗
║                                                ║  ← 48 characters wide
║  Business Name Here                            ║
║  123 Example Street                            ║
║                                                ║
║  Item Description          Qty    Price  Total║
║  ────────────────────────  ───  ───────  ─────║
║  Product ABC                 2    150.00 300.00║
║                                                ║
╚════════════════════════════════════════════════╝
```

#### Thermal 58mm (32 characters)
```
╔════════════════════════════════╗
║                                ║  ← 32 characters wide
║  Business Name                 ║
║  123 Example St.               ║
║                                ║
║  Item          Qty       Total║
║  ──────────────────  ─────────║
║  Product ABC      2     300.00║
║                                ║
╚════════════════════════════════╝
```

#### A4 Format (Variable width)
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                         BUSINESS NAME                             ║
║                      123 Example Street                           ║
║                    City, Province 12345                           ║
║                                                                   ║
║  Description                          Qty      Price      Total   ║
║  ───────────────────────────────────────────────────────────────  ║
║  Product ABC - Full Description        2      150.00     300.00   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Paper Size Selection Criteria

| Scenario | Recommended Size | Reason |
|----------|-----------------|--------|
| Retail POS | 80mm thermal | Industry standard, optimal readability |
| Mobile sales | 58mm thermal | Portable printer compatibility |
| Formal invoices | A4 | Professional appearance, detailed info |
| Quick receipts | 58mm thermal | Paper cost savings |
| Detailed receipts | 80mm or A4 | More information space |

### Expected Outcome
- Support for multiple paper formats
- Proper character width constraints
- Flexible receipt rendering
- Printer compatibility

### Verification Checklist
- [ ] PAPER_SIZES tuple defined
- [ ] PAPER_SIZE_THERMAL_80MM constant created
- [ ] PAPER_SIZE_THERMAL_58MM constant created
- [ ] PAPER_SIZE_A4 constant created
- [ ] PAPER_SIZE_CHAR_WIDTHS dictionary defined
- [ ] Character widths are accurate
- [ ] All common formats supported

---

## Task 04: Create ReceiptTemplate Model

### Overview
Create the core ReceiptTemplate model that stores receipt template configurations. This model serves as the foundation for customizable receipt generation, allowing tenants to define their preferred receipt format, layout, and content.

### Dependencies
- Task 01: Create receipt submodule
- Task 02: Define receipt type constants
- Task 03: Define paper size constants
- Tenant model exists
- Django ORM configured

### Instructions

1. **Create template.py model file**
   - Create file at `apps/pos/receipts/models/template.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import receipt constants
   - Import tenant model

3. **Define ReceiptTemplate model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add model docstring explaining purpose

4. **Add name field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Human-readable template identifier
   - Example: "Standard 80mm Receipt", "Compact Receipt"

5. **Add paper_size field**
   - CharField with choices from PAPER_SIZES
   - Default to PAPER_SIZE_THERMAL_80MM
   - Determines receipt width and formatting

6. **Add is_default field**
   - BooleanField, default=False
   - Indicates if this is the tenant's default template
   - Only one default template per tenant

7. **Add is_active field**
   - BooleanField, default=True
   - Controls template availability
   - Inactive templates cannot be used

8. **Add description field**
   - TextField, optional (blank=True, null=True)
   - Internal notes about template purpose
   - Usage guidelines

9. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by name
   - Add unique_together constraint (tenant, name)
   - Add index on (tenant, is_default)

10. **Add __str__ method**
    - Return template name
    - Include paper size in string representation
    - Format: "Template Name (80mm)"

11. **Add save method override**
    - Ensure only one default template per tenant
    - If setting is_default=True, unset other defaults
    - Call parent save method

12. **Update models/__init__.py**
    - Import ReceiptTemplate
    - Add to __all__ list

### ReceiptTemplate Model Structure

```
┌─────────────────────────────────────────────────┐
│           ReceiptTemplate Model                 │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • name (CharField)                             │
│  • paper_size (CharField with choices)          │
│  • is_default (BooleanField)                    │
│  • is_active (BooleanField)                     │
│  • description (TextField, optional)            │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│  ReceiptTemplate   │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ 1:N
                                               ▼
                                      ┌────────────────────┐
                                      │  Generated Receipt │
                                      │   (Future Group)   │
                                      └────────────────────┘
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| name | CharField(100) | Yes | - | Template identifier |
| paper_size | CharField | Yes | '80mm' | Paper format selection |
| is_default | BooleanField | Yes | False | Default template flag |
| is_active | BooleanField | Yes | True | Availability status |
| description | TextField | No | null | Internal notes |
| tenant | ForeignKey | Yes | - | Tenant association |

### Default Template Logic

```
Single Default Per Tenant Rule
═══════════════════════════════

Tenant A:
  ├── Template 1 (is_default=False)
  ├── Template 2 (is_default=True)  ← Only one default
  └── Template 3 (is_default=False)

When Template 3 is set as default:
  ├── Template 1 (is_default=False)
  ├── Template 2 (is_default=False)  ← Automatically unset
  └── Template 3 (is_default=True)   ← New default
```

### Template Naming Guidelines

| Template Name | Paper Size | Use Case |
|--------------|------------|----------|
| "Standard Receipt" | 80mm | General purpose |
| "Compact Receipt" | 58mm | Mobile sales |
| "Detailed Invoice" | A4 | Formal transactions |
| "Quick Receipt" | 58mm | Fast service |
| "Gift Receipt" | 80mm | No prices shown |

### Expected Outcome
- Functional ReceiptTemplate model
- Tenant-specific templates
- Default template mechanism
- Active/inactive control
- Foundation for receipt generation

### Verification Checklist
- [ ] template.py file created
- [ ] ReceiptTemplate class defined
- [ ] name field added
- [ ] paper_size field with choices
- [ ] is_default field added
- [ ] is_active field added
- [ ] description field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] save method overridden for default logic
- [ ] Model imported in __init__.py

---

## Task 05: Add Header Configuration

### Overview
Add header configuration fields to the ReceiptTemplate model. These fields control the appearance of the receipt header, including logo display, business name customization, and overall header layout.

### Dependencies
- Task 04: Create ReceiptTemplate model

### Instructions

1. **Open template.py model file**
   - Navigate to `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add show_logo field**
   - BooleanField, default=True
   - Controls whether logo appears on receipt
   - Logo comes from tenant settings

3. **Define logo size choices**
   - Create LOGO_SIZE_CHOICES tuple
   - Options: SMALL, MEDIUM, LARGE
   - Controls logo dimensions on receipt

4. **Add logo_size field**
   - CharField with LOGO_SIZE_CHOICES
   - Default to 'medium'
   - Only applies when show_logo=True

5. **Add business_name_override field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - Overrides tenant's default business name
   - Use case: Different name for receipts vs. system

6. **Add show_business_name field**
   - BooleanField, default=True
   - Controls business name visibility
   - Independent of logo display

7. **Add business_name_bold field**
   - BooleanField, default=True
   - Makes business name bold/emphasized
   - Only applies when show_business_name=True

8. **Add business_name_uppercase field**
   - BooleanField, default=False
   - Converts business name to uppercase
   - Common for formal receipts

9. **Update model docstring**
   - Document header configuration purpose
   - List all header-related fields

### Header Configuration Fields

```
┌────────────────────────────────────────────────┐
│         Receipt Header Configuration           │
├────────────────────────────────────────────────┤
│ Logo Settings:                                 │
│  • show_logo (Boolean)                         │
│  • logo_size (Choice: SMALL/MEDIUM/LARGE)      │
│                                                │
│ Business Name Settings:                        │
│  • business_name_override (CharField)          │
│  • show_business_name (Boolean)                │
│  • business_name_bold (Boolean)                │
│  • business_name_uppercase (Boolean)           │
└────────────────────────────────────────────────┘
```

### Logo Size Specifications

| Size | Dimensions | Character Height | Use Case |
|------|------------|------------------|----------|
| SMALL | 20x20mm | 3 lines | Compact receipts, save space |
| MEDIUM | 30x30mm | 5 lines | Standard receipts, balanced |
| LARGE | 40x40mm | 7 lines | Premium receipts, brand focus |

### Header Layout Examples

#### Header with Logo and Business Name
```
╔════════════════════════════════════════════════╗
║                   [LOGO]                       ║
║                                                ║
║             LANKACOMMERCE RETAIL               ║
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
╚════════════════════════════════════════════════╝
```

#### Header with Logo Only (No Business Name)
```
╔════════════════════════════════════════════════╗
║                   [LOGO]                       ║
║                                                ║
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
╚════════════════════════════════════════════════╝
```

#### Header with Business Name Only (No Logo)
```
╔════════════════════════════════════════════════╗
║             LANKACOMMERCE RETAIL               ║
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
║        Email: info@lankacommerce.lk            ║
╚════════════════════════════════════════════════╝
```

#### Header with Name Override
```
╔════════════════════════════════════════════════╗
║                   [LOGO]                       ║
║                                                ║
║               COLOMBO BRANCH                   ║  ← Override name
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
╚════════════════════════════════════════════════╝
```

### Business Name Override Use Cases

| Scenario | Tenant Name | Override Name | Reason |
|----------|-------------|---------------|--------|
| Branch operation | "LankaCommerce Pvt Ltd" | "Colombo Branch" | Branch identifier |
| Franchise | "LankaCommerce" | "Khan's Store" | Franchisee name |
| DBA | "ABC Company (Pvt) Ltd" | "QuickMart" | Doing business as |
| Multiple brands | "Retail Group Ltd" | "FashionPlus" | Brand-specific |

### Header Configuration Matrix

| Configuration | show_logo | show_business_name | Result |
|--------------|-----------|-------------------|--------|
| Logo + Name | True | True | Both displayed |
| Logo only | True | False | Logo without name |
| Name only | False | True | Name without logo |
| Minimal | False | False | Neither (address only) |

### Expected Outcome
- Flexible header customization
- Logo display control
- Business name customization
- Support for various branding needs

### Verification Checklist
- [ ] show_logo field added
- [ ] LOGO_SIZE_CHOICES defined
- [ ] logo_size field added
- [ ] business_name_override field added
- [ ] show_business_name field added
- [ ] business_name_bold field added
- [ ] business_name_uppercase field added
- [ ] All fields have appropriate defaults
- [ ] Model docstring updated

---

## Task 06: Add Header Text Fields

### Overview
Add custom header text fields to the ReceiptTemplate model. These fields allow tenants to add custom lines of text in the receipt header, such as taglines, promotional messages, or additional business information.

### Dependencies
- Task 05: Add header configuration

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add header_line_1 field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - First custom header line
   - Appears below business name/logo

3. **Add header_line_2 field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - Second custom header line
   - Appears below header_line_1

4. **Add header_line_3 field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - Third custom header line
   - Appears below header_line_2

5. **Add header_line_1_bold field**
   - BooleanField, default=False
   - Makes first header line bold
   - Only applies if header_line_1 has content

6. **Add header_line_2_bold field**
   - BooleanField, default=False
   - Makes second header line bold

7. **Add header_line_3_bold field**
   - BooleanField, default=False
   - Makes third header line bold

8. **Add header_line_1_center field**
   - BooleanField, default=True
   - Centers first header line
   - False for left-align

9. **Add header_line_2_center field**
   - BooleanField, default=True
   - Centers second header line

10. **Add header_line_3_center field**
    - BooleanField, default=True
    - Centers third header line

11. **Update model docstring**
    - Document custom header text capability
    - List all header text fields

### Header Text Field Structure

```
┌────────────────────────────────────────────────┐
│         Custom Header Text Fields              │
├────────────────────────────────────────────────┤
│ Content Fields:                                │
│  • header_line_1 (CharField, 200)              │
│  • header_line_2 (CharField, 200)              │
│  • header_line_3 (CharField, 200)              │
│                                                │
│ Formatting Fields:                             │
│  • header_line_1_bold (Boolean)                │
│  • header_line_2_bold (Boolean)                │
│  • header_line_3_bold (Boolean)                │
│  • header_line_1_center (Boolean)              │
│  • header_line_2_center (Boolean)              │
│  • header_line_3_center (Boolean)              │
└────────────────────────────────────────────────┘
```

### Header Text Usage Examples

#### Example 1: Tagline and Hours
```
╔════════════════════════════════════════════════╗
║                   [LOGO]                       ║
║                                                ║
║             LANKACOMMERCE RETAIL               ║
║            123 Galle Road, Colombo 03          ║
║                                                ║
║        "Quality Products, Great Prices"        ║  ← header_line_1
║         Open Daily: 9:00 AM - 9:00 PM          ║  ← header_line_2
╚════════════════════════════════════════════════╝
```

#### Example 2: Promotional Message
```
╔════════════════════════════════════════════════╗
║             QUICKMART SUPERMARKET              ║
║            45 Peradeniya Road, Kandy           ║
║                                                ║
║      ★★★ GRAND OPENING SALE - 20% OFF ★★★     ║  ← header_line_1 (bold)
║          Valid until December 31, 2026         ║  ← header_line_2
║         Join our loyalty program today!        ║  ← header_line_3
╚════════════════════════════════════════════════╝
```

#### Example 3: Multi-language Support
```
╔════════════════════════════════════════════════╗
║                ETHNIC FOODS                    ║
║           කොළඹ 07, ග්ලෙන්ඩර් පෙදෙස           ║  ← header_line_1 (Sinhala)
║              Colombo 07, Glennie St            ║  ← header_line_2 (English)
║            உணவு பொருட்கள் கடை                 ║  ← header_line_3 (Tamil)
╚════════════════════════════════════════════════╝
```

#### Example 4: Contact Information
```
╔════════════════════════════════════════════════╗
║                TECH GADGETS LK                 ║
║            321 Duplication Road                ║
║                                                ║
║      WhatsApp Orders: +94 77 123 4567          ║  ← header_line_1
║     Website: www.techgadgets.lk                ║  ← header_line_2
║    Follow us: @TechGadgetsLK                   ║  ← header_line_3
╚════════════════════════════════════════════════╝
```

### Header Text Use Cases

| Use Case | Line 1 | Line 2 | Line 3 | Formatting |
|----------|--------|--------|--------|------------|
| Business Hours | "Open 7 Days a Week" | "9 AM - 9 PM" | - | Centered |
| Promotion | "**SALE - 20% OFF**" | "Valid Dec 1-31" | - | Line 1 bold |
| Tagline | "Your Trusted Partner" | - | - | Centered |
| Multi-language | Sinhala text | English text | Tamil text | All centered |
| Contact | "WhatsApp: +94 77 XXX" | "Web: example.lk" | "FB: @Example" | Left-aligned |
| Loyalty | "Join Our Loyalty Club" | "Earn points on every purchase" | - | Centered |

### Text Alignment Options

#### Centered Text (Default)
```
╔════════════════════════════════════════════════╗
║        Quality Products, Great Service         ║
║          Your satisfaction guaranteed          ║
╚════════════════════════════════════════════════╝
```

#### Left-Aligned Text
```
╔════════════════════════════════════════════════╗
║ Quality Products, Great Service                ║
║ Your satisfaction guaranteed                   ║
╚════════════════════════════════════════════════╝
```

### Character Width Considerations

| Paper Size | Max Characters | Recommended Length |
|-----------|----------------|-------------------|
| 80mm | 48 chars | 45 chars (safe) |
| 58mm | 32 chars | 30 chars (safe) |
| A4 | Variable | 60-80 chars |

### Sri Lanka-Specific Examples

#### Sinhala Unicode Support
```
╔════════════════════════════════════════════════╗
║        ඔබගේ විශ්වාසී සාප්පුව                    ║  ← "Your Trusted Shop"
║     සෑම දිනකම විවෘතයි - 9:00 - 9:00          ║  ← "Open Daily"
╚════════════════════════════════════════════════╝
```

#### Tamil Unicode Support
```
╔════════════════════════════════════════════════╗
║        உங்கள் நம்பிக்கைக்குரிய கடை            ║  ← "Your Trusted Shop"
║       தினமும் திறந்திருக்கும்                  ║  ← "Open Daily"
╚════════════════════════════════════════════════╝
```

#### Festival Greetings
```
╔════════════════════════════════════════════════╗
║          Wishing You a Happy Vesak!            ║
║              සුභ වෙසක් මංගල්‍යක්!              ║
║          May the Triple Gem Bless You          ║
╚════════════════════════════════════════════════╝
```

### Expected Outcome
- Three customizable header text lines
- Individual formatting control per line
- Text alignment options
- Support for promotional messages
- Multi-language capability

### Verification Checklist
- [ ] header_line_1 field added
- [ ] header_line_2 field added
- [ ] header_line_3 field added
- [ ] header_line_1_bold field added
- [ ] header_line_2_bold field added
- [ ] header_line_3_bold field added
- [ ] header_line_1_center field added
- [ ] header_line_2_center field added
- [ ] header_line_3_center field added
- [ ] All fields optional (blank=True, null=True)
- [ ] Max length set to 200 characters
- [ ] Model docstring updated

---

## Summary

This document established the foundation of the receipt template system:

### Completed Infrastructure
- ✅ Receipt submodule organization
- ✅ Receipt type constants (SALE, REFUND, VOID, REPRINT)
- ✅ Paper size constants (80mm, 58mm, A4)
- ✅ Core ReceiptTemplate model with tenant awareness
- ✅ Header configuration (logo, business name)
- ✅ Custom header text fields (3 lines with formatting)

### Key Achievements
1. **Organized Structure** - Clean submodule within POS app
2. **Type Safety** - Constants for receipt types and paper sizes
3. **Tenant Flexibility** - Per-tenant template customization
4. **Header Branding** - Logo and business name control
5. **Custom Messaging** - Three customizable header lines

### Next Steps
Proceed to [02_Tasks-07-12_Display-Settings.md](02_Tasks-07-12_Display-Settings.md) to implement display settings for addresses, items, totals, payments, footer, and return policy.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1180
