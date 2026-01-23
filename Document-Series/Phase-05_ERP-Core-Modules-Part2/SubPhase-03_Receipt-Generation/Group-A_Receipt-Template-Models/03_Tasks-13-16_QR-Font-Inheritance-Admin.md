# Tasks 13-16: QR Code, Fonts, Inheritance, and Admin

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** A - Receipt Template Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Display-Settings.md](02_Tasks-07-12_Display-Settings.md)
- **→ Next Group:** [../Group-B_Receipt-Data-Generation/](../Group-B_Receipt-Data-Generation/)

---

## Document Overview

This document covers the final components of the receipt template system, including QR code settings, font configuration, template inheritance patterns, and Django admin interface customization for managing receipt templates.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add QR code settings | Medium | 20 min |
| 14 | Add font settings | Low | 15 min |
| 15 | Create template inheritance | Medium | 25 min |
| 16 | Create ReceiptTemplate admin | Medium | 30 min |

---

## Task 13: Add QR Code Settings

### Overview
Add QR code configuration fields to the ReceiptTemplate model. QR codes provide customers with quick access to digital receipts, online resources, loyalty programs, or payment verification. These settings control QR code visibility, content type, and positioning.

### Dependencies
- Task 12: Add return policy field

### Instructions

1. **Open template.py model file**
   - Navigate to `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Define QR code content type choices**
   - Create QR_CONTENT_TYPE_CHOICES tuple
   - Options for different QR code content types
   - Examples: transaction ID, digital receipt URL, payment verification

3. **Add show_qr_code field**
   - BooleanField, default=False
   - Controls QR code visibility
   - QR codes appear at bottom of receipt

4. **Add qr_content_type field**
   - CharField with QR_CONTENT_TYPE_CHOICES
   - Default to 'transaction_id'
   - Determines what data QR code encodes

5. **Add qr_code_size field**
   - CharField with size choices
   - Options: SMALL, MEDIUM, LARGE
   - Default to 'medium'

6. **Add qr_label field**
   - CharField, max_length=100
   - Optional (blank=True, null=True)
   - Label text above QR code
   - Example: "Scan for Digital Receipt"

7. **Add qr_position field**
   - CharField with position choices
   - Options: BEFORE_FOOTER, AFTER_FOOTER
   - Default to 'after_footer'
   - Controls QR code placement

8. **Update model docstring**
   - Document QR code settings
   - List all QR-related fields

### QR Code Settings Structure

```
┌────────────────────────────────────────────────┐
│         QR Code Configuration                  │
├────────────────────────────────────────────────┤
│ Visibility:                                    │
│  • show_qr_code (Boolean)                      │
│                                                │
│ Content:                                       │
│  • qr_content_type (Choice)                    │
│  • qr_label (CharField, 100)                   │
│                                                │
│ Display:                                       │
│  • qr_code_size (Choice: SMALL/MEDIUM/LARGE)   │
│  • qr_position (Choice: BEFORE/AFTER_FOOTER)   │
└────────────────────────────────────────────────┘
```

### QR Code Content Types

| Content Type | Value | Data Encoded | Use Case |
|-------------|-------|--------------|----------|
| Transaction ID | 'transaction_id' | Unique transaction ID | Payment verification |
| Digital Receipt | 'digital_receipt' | URL to online receipt | Paperless option |
| Loyalty Program | 'loyalty' | Loyalty account link | Points tracking |
| Feedback Form | 'feedback' | Feedback survey URL | Customer feedback |
| Payment Verification | 'payment_verify' | Payment reference | Payment confirmation |
| Website | 'website' | Business website URL | Online presence |

### QR Code Display Examples

#### QR Code with Transaction ID
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║        Scan for Payment Verification           ║
║                                                ║
║               ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                 ║
║               █ ▄▄▄ █  █ ▄▄▄ █                 ║
║               █ ███ █  █ ███ █                 ║
║               █▄▄▄▄▄█  █▄▄▄▄▄█                 ║
║               ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                 ║
║                                                ║
║         Transaction: TXN-2026-0123456          ║
╚════════════════════════════════════════════════╝
```

#### QR Code for Digital Receipt
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║         Scan for Your Digital Receipt          ║
║                                                ║
║               ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                 ║
║               █ ▄▄▄ █  █ ▄▄▄ █                 ║
║               █ ███ █  █ ███ █                 ║
║               █▄▄▄▄▄█  █▄▄▄▄▄█                 ║
║               ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                 ║
║                                                ║
║      https://receipts.example.lk/TXN456        ║
╚════════════════════════════════════════════════╝
```

#### QR Code for Loyalty Program
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║       Join Our Loyalty Program Today!          ║
║           Scan to Earn Rewards                 ║
║                                                ║
║               ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                 ║
║               █ ▄▄▄ █  █ ▄▄▄ █                 ║
║               █ ███ █  █ ███ █                 ║
║               █▄▄▄▄▄█  █▄▄▄▄▄█                 ║
║               ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                 ║
║                                                ║
║       www.example.lk/loyalty/join              ║
╚════════════════════════════════════════════════╝
```

### QR Code Size Specifications

| Size | Dimensions (mm) | Print Size | Use Case |
|------|-----------------|------------|----------|
| SMALL | 15x15mm | 10 lines | Compact receipts |
| MEDIUM | 25x25mm | 15 lines | Standard receipts |
| LARGE | 35x35mm | 20 lines | Emphasis, easy scanning |

### QR Code Size Examples

#### Small QR Code
```
║     Scan for Digital Receipt      ║
║                                   ║
║          ▄▄▄▄▄  ▄▄▄▄▄            ║
║          █ ▄ █  █ ▄ █            ║
║          █▄▄▄█  █▄▄▄█            ║
║                                   ║
```

#### Medium QR Code
```
║     Scan for Digital Receipt      ║
║                                   ║
║        ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄          ║
║        █ ▄▄▄ █  █ ▄▄▄ █          ║
║        █ ███ █  █ ███ █          ║
║        █▄▄▄▄▄█  █▄▄▄▄▄█          ║
║        ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄          ║
║                                   ║
```

#### Large QR Code
```
║     Scan for Digital Receipt      ║
║                                   ║
║      ▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄        ║
║      █ ▄▄▄▄▄ █  █ ▄▄▄▄▄ █        ║
║      █ █████ █  █ █████ █        ║
║      █ █████ █  █ █████ █        ║
║      █▄▄▄▄▄▄▄█  █▄▄▄▄▄▄▄█        ║
║      ▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄        ║
║                                   ║
```

### QR Code Position Options

#### Before Footer
```
╔════════════════════════════════════════════════╗
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║        Scan for Payment Verification           ║
║               [QR CODE HERE]                   ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║          Thank You for Your Purchase!          ║
╚════════════════════════════════════════════════╝
```

#### After Footer (Default)
```
╔════════════════════════════════════════════════╗
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║          Thank You for Your Purchase!          ║
║            Please Visit Us Again!              ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║        Scan for Payment Verification           ║
║               [QR CODE HERE]                   ║
╚════════════════════════════════════════════════╝
```

### QR Code Label Examples

| Label Text | Use Case |
|-----------|----------|
| "Scan for Digital Receipt" | Online receipt access |
| "Scan to Verify Payment" | Payment confirmation |
| "Join Loyalty Program" | Membership signup |
| "Rate Your Experience" | Customer feedback |
| "Visit Us Online" | Website promotion |
| "Track Your Order" | Order tracking |

### QR Code Data Formats

#### Transaction ID Format
```
Data: TXN-2026-0123456
URL: https://verify.example.lk/transaction/TXN-2026-0123456
```

#### Digital Receipt Format
```
Data: https://receipts.example.lk/view?id=TXN-2026-0123456&auth=abc123
```

#### Loyalty Program Format
```
Data: https://loyalty.example.lk/enroll?store=COL01&txn=TXN-2026-0123456
```

#### Payment Verification Format
```
Data: {"txn":"TXN-2026-0123456","amount":5390.00,"method":"CASH","date":"2026-01-23T14:30:00"}
```

### Sri Lanka-Specific QR Code Uses

| Use Case | Implementation | Benefit |
|----------|----------------|---------|
| Lanka QR Payment | Encode Lanka QR payment URL | Contactless payment |
| Digital Invoice | Link to IRD-compliant e-invoice | Tax compliance |
| Mobile Banking | Link to bank transaction | Payment verification |
| Delivery Tracking | Pronto/Domex tracking link | Order status |
| Product Registry | Link to warranty registration | After-sales service |

### QR Code Configuration Matrix

| Paper Size | Recommended Size | Position | Label |
|-----------|-----------------|----------|-------|
| 58mm | SMALL | AFTER_FOOTER | Short label |
| 80mm | MEDIUM | AFTER_FOOTER | Full label |
| A4 | LARGE | AFTER_FOOTER | Descriptive label |

### Expected Outcome
- Flexible QR code integration
- Multiple content type support
- Size and position control
- Custom label text
- Enhanced customer engagement

### Verification Checklist
- [ ] QR_CONTENT_TYPE_CHOICES defined
- [ ] show_qr_code field added
- [ ] qr_content_type field added
- [ ] qr_code_size field added
- [ ] qr_label field added
- [ ] qr_position field added
- [ ] Size choices defined (SMALL/MEDIUM/LARGE)
- [ ] Position choices defined (BEFORE/AFTER_FOOTER)
- [ ] All fields have appropriate defaults
- [ ] Model docstring updated

---

## Task 14: Add Font Settings

### Overview
Add font configuration fields to the ReceiptTemplate model. These settings control the typography of the receipt, including font sizes, bold text application, and separator line styles. Proper font settings ensure readability and professional appearance.

### Dependencies
- Task 13: Add QR code settings

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Define font size choices**
   - Create FONT_SIZE_CHOICES tuple
   - Options: SMALL, NORMAL, LARGE
   - Applies to body text

3. **Add font_size field**
   - CharField with FONT_SIZE_CHOICES
   - Default to 'normal'
   - Controls body text size

4. **Add header_font_size field**
   - CharField with FONT_SIZE_CHOICES
   - Default to 'large'
   - Controls header text size

5. **Add footer_font_size field**
   - CharField with FONT_SIZE_CHOICES
   - Default to 'normal'
   - Controls footer text size

6. **Add use_bold_headers field**
   - BooleanField, default=True
   - Makes all header text bold
   - Overrides individual settings

7. **Add separator_style field**
   - CharField with separator style choices
   - Options: EQUALS, DASHES, STARS, NONE
   - Default to 'equals'

8. **Add separator_length field**
   - CharField with length choices
   - Options: FULL, HALF, CUSTOM
   - Default to 'full'

9. **Update model docstring**
   - Document font settings
   - List all font-related fields

### Font Settings Structure

```
┌────────────────────────────────────────────────┐
│         Font Configuration                     │
├────────────────────────────────────────────────┤
│ Font Sizes:                                    │
│  • font_size (Choice: SMALL/NORMAL/LARGE)      │
│  • header_font_size (Choice)                   │
│  • footer_font_size (Choice)                   │
│                                                │
│ Bold Settings:                                 │
│  • use_bold_headers (Boolean)                  │
│                                                │
│ Separators:                                    │
│  • separator_style (Choice)                    │
│  • separator_length (Choice)                   │
└────────────────────────────────────────────────┘
```

### Font Size Options

| Size | Point Size | Character Height | Use Case |
|------|-----------|------------------|----------|
| SMALL | 8pt | 2mm | Compact receipts, fine print |
| NORMAL | 10pt | 3mm | Standard body text |
| LARGE | 14pt | 4mm | Headers, emphasis |

### Font Size Examples

#### Small Font
```
╔════════════════════════════════════════════════╗
║  Date: 2026-01-23  Time: 14:30  Cashier: C001  ║  ← Small font
║                                                ║
║  Item Description          Qty    Price  Total ║
║  Rice - Basmati 5kg          2  1,250.00 2,500 ║
║  Dhal - Red Lentils 1kg      1    450.00   450 ║
╚════════════════════════════════════════════════╝
```

#### Normal Font (Standard)
```
╔════════════════════════════════════════════════╗
║  Date: 2026-01-23    Time: 14:30:00            ║  ← Normal font
║                                                ║
║  Item Description          Qty    Price  Total ║
║  Rice - Basmati 5kg          2  1,250.00 2,500 ║
║  Dhal - Red Lentils          1    450.00   450 ║
╚════════════════════════════════════════════════╝
```

#### Large Font (Headers)
```
╔════════════════════════════════════════════════╗
║         LANKACOMMERCE RETAIL                   ║  ← Large font
║                                                ║
║  123 Galle Road, Colombo 03                    ║  ← Normal font
║  Tel: +94 11 234 5678                          ║
╚════════════════════════════════════════════════╝
```

### Font Size Combinations

| Configuration | Header | Body | Footer | Best For |
|--------------|--------|------|--------|----------|
| Standard | LARGE | NORMAL | NORMAL | General purpose |
| Compact | NORMAL | SMALL | SMALL | Space-constrained |
| Emphasis | LARGE | NORMAL | SMALL | Branding focus |
| Uniform | NORMAL | NORMAL | NORMAL | Simple, clean |

### Separator Style Options

#### Equals Signs (=)
```
═══════════════════════════════════════════════
```

#### Dashes (-)
```
-----------------------------------------------
```

#### Stars (*)
```
***********************************************
```

#### None
```
(No separator line)
```

### Separator Examples in Context

#### With Equals
```
║  Subtotal:                            4,990.00 ║
║  Tax (8%):                              399.20 ║
║ ═══════════════════════════════════════════════║
║  TOTAL:                               5,389.20 ║
```

#### With Dashes
```
║  Subtotal:                            4,990.00 ║
║  Tax (8%):                              399.20 ║
║ ───────────────────────────────────────────────║
║  TOTAL:                               5,389.20 ║
```

#### With Stars
```
║  Subtotal:                            4,990.00 ║
║  Tax (8%):                              399.20 ║
║ ***********************************************║
║  TOTAL:                               5,389.20 ║
```

#### Without Separator
```
║  Subtotal:                            4,990.00 ║
║  Tax (8%):                              399.20 ║
║                                                ║
║  TOTAL:                               5,389.20 ║
```

### Separator Length Options

#### Full Length (Default)
```
═══════════════════════════════════════════════
```

#### Half Length
```
            ═══════════════════
```

#### Custom Length (Configurable)
```
    ═══════════════════════════════════
```

### Bold Header Examples

#### With Bold Headers
```
╔════════════════════════════════════════════════╗
║          LANKACOMMERCE RETAIL                  ║  ← Bold
║          123 Galle Road, Colombo 03            ║  ← Bold
║                                                ║
║  Date: 2026-01-23    Time: 14:30:00            ║  ← Normal
╚════════════════════════════════════════════════╝
```

#### Without Bold Headers
```
╔════════════════════════════════════════════════╗
║          LANKACOMMERCE RETAIL                  ║  ← Normal weight
║          123 Galle Road, Colombo 03            ║  ← Normal weight
║                                                ║
║  Date: 2026-01-23    Time: 14:30:00            ║  ← Normal
╚════════════════════════════════════════════════╝
```

### Font Configuration Recommendations

| Business Type | Header Size | Body Size | Footer Size | Separator |
|--------------|------------|-----------|-------------|-----------|
| Retail Store | LARGE | NORMAL | SMALL | EQUALS |
| Restaurant | LARGE | NORMAL | NORMAL | DASHES |
| Pharmacy | LARGE | SMALL | SMALL | EQUALS |
| Wholesale | NORMAL | SMALL | SMALL | DASHES |
| Online Store | LARGE | NORMAL | NORMAL | EQUALS |

### Receipt Typography Hierarchy

```
Typography Hierarchy
═══════════════════════

Level 1: Business Name
  Size: LARGE (14pt)
  Weight: BOLD
  Usage: Company identity

Level 2: Section Headers
  Size: NORMAL (10pt)
  Weight: BOLD
  Usage: "Item Description", "TOTAL"

Level 3: Body Text
  Size: NORMAL (10pt)
  Weight: NORMAL
  Usage: Item lists, details

Level 4: Fine Print
  Size: SMALL (8pt)
  Weight: NORMAL
  Usage: Footer notes, legal text
```

### Readability Guidelines

| Paper Size | Min Font | Recommended Font | Max Characters |
|-----------|----------|------------------|----------------|
| 58mm | SMALL | NORMAL | 32 chars |
| 80mm | NORMAL | NORMAL | 48 chars |
| A4 | NORMAL | LARGE for headers | Variable |

### Expected Outcome
- Flexible font size control
- Separate sizing for sections
- Bold text options
- Multiple separator styles
- Professional typography

### Verification Checklist
- [ ] FONT_SIZE_CHOICES defined
- [ ] font_size field added
- [ ] header_font_size field added
- [ ] footer_font_size field added
- [ ] use_bold_headers field added
- [ ] separator_style field added (with choices)
- [ ] separator_length field added (with choices)
- [ ] All choices defined (SMALL/NORMAL/LARGE)
- [ ] Separator style choices defined
- [ ] Model docstring updated

---

## Task 15: Create Template Inheritance

### Overview
Implement template inheritance functionality for receipt templates. This system allows templates to inherit settings from parent templates, enabling a hierarchical structure where system defaults can be overridden at the tenant level, and custom templates can inherit from tenant defaults.

### Dependencies
- Task 14: Add font settings
- All previous template configuration tasks

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add parent_template field**
   - ForeignKey to self (ReceiptTemplate)
   - Optional (blank=True, null=True)
   - on_delete=models.SET_NULL
   - related_name='child_templates'

3. **Add is_system_default field**
   - BooleanField, default=False
   - Marks template as system-wide default
   - Only one system default allowed

4. **Add inherits_from_parent field**
   - BooleanField, default=True
   - Controls whether to inherit parent settings
   - Can be disabled for full customization

5. **Create get_effective_value method**
   - Instance method to get field value
   - Checks inheritance chain
   - Returns value or parent's value

6. **Create get_inherited_fields method**
   - Returns dict of inherited field values
   - Traverses parent chain
   - Merges values appropriately

7. **Create clone_template method**
   - Instance method to duplicate template
   - Creates copy with new name
   - Preserves all settings

8. **Update save method**
   - Validate inheritance rules
   - Ensure no circular inheritance
   - Prevent system default duplication

9. **Add Meta constraints**
   - Unique constraint for system default
   - Check constraint for inheritance validation

10. **Update model docstring**
    - Document inheritance functionality
    - Explain inheritance chain

### Template Inheritance Structure

```
┌────────────────────────────────────────────────┐
│         Template Inheritance                   │
├────────────────────────────────────────────────┤
│ Inheritance Fields:                            │
│  • parent_template (ForeignKey to self)        │
│  • is_system_default (Boolean)                 │
│  • inherits_from_parent (Boolean)              │
│                                                │
│ Methods:                                       │
│  • get_effective_value(field_name)             │
│  • get_inherited_fields()                      │
│  • clone_template(new_name)                    │
└────────────────────────────────────────────────┘
```

### Inheritance Hierarchy

```
Template Inheritance Hierarchy
═══════════════════════════════

System Default Template (Global)
  ├── is_system_default = True
  ├── tenant = None
  └── parent_template = None
       │
       ▼
Tenant Default Template (Tenant A)
  ├── is_default = True
  ├── tenant = Tenant A
  └── parent_template = System Default
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
Custom Template 1  Custom Template 2  Custom Template 3
  (inherits)        (inherits)        (no inherit)
```

### Inheritance Examples

#### Example 1: Simple Inheritance
```
System Default:
  - paper_size: 80mm
  - show_logo: True
  - show_address: True
       ↓
Tenant Default:
  - Inherits from System Default
  - Overrides: business_name_override = "My Store"
  - Inherits: paper_size (80mm), show_logo (True)
       ↓
Custom Template:
  - Inherits from Tenant Default
  - Overrides: show_qr_code = True
  - Inherits: paper_size, show_logo, business_name_override
```

#### Example 2: Full Override
```
System Default:
  - All standard settings
       ↓
Custom Template (inherits_from_parent = False):
  - Does NOT inherit from System Default
  - All settings defined explicitly
  - Complete customization
```

### Inheritance Chain Resolution

```
Field Value Resolution Process
═══════════════════════════════

1. Check Current Template
   ↓ Field defined?
   Yes → Use current value
   No → Continue
   
2. Check inherits_from_parent
   ↓ True?
   Yes → Continue
   No → Use default value
   
3. Check parent_template
   ↓ Exists?
   Yes → Check parent (recursive)
   No → Use default value

Example:
  Custom Template.show_logo = None
  Parent.show_logo = True
  → Result: True (inherited)
  
  Custom Template.show_logo = False
  Parent.show_logo = True
  → Result: False (overridden)
```

### get_effective_value Method Logic

```
Method: get_effective_value(field_name)
═══════════════════════════════════════

Input: Field name (string)
Output: Effective field value

Logic:
1. Get current template's value for field
2. If value is not None/default:
   Return value
3. If inherits_from_parent is False:
   Return model field default
4. If parent_template exists:
   Return parent_template.get_effective_value(field_name)
5. Else:
   Return model field default

Example Usage:
  template.get_effective_value('show_logo')
  → True (from parent if not overridden)
```

### Inheritance Use Cases

| Use Case | Hierarchy | Benefit |
|----------|-----------|---------|
| Standard deployment | System → Tenant | Consistent defaults |
| Franchises | System → Tenant → Branches | Brand consistency |
| Multiple locations | Tenant → Location templates | Location-specific |
| Seasonal receipts | Tenant Default → Seasonal | Easy switching |
| A/B Testing | Tenant Default → Test variants | Experimentation |

### Template Cloning Example

```
Clone Template Process
═══════════════════════

Original Template: "Standard 80mm"
  - paper_size: 80mm
  - show_logo: True
  - All other settings...

↓ Clone with new name

Cloned Template: "Standard 80mm - Holiday"
  - paper_size: 80mm (copied)
  - show_logo: True (copied)
  - All other settings (copied)
  - parent_template: Original Template
  - Ready for customization
```

### System Default Template

```
System Default Template Characteristics
═══════════════════════════════════════

Properties:
  - is_system_default = True
  - tenant = None (global)
  - parent_template = None (root)
  - Only ONE can exist

Purpose:
  - Provides baseline settings
  - Used when no tenant default
  - Fallback for all tenants

Settings:
  - Conservative defaults
  - Minimal branding
  - Maximum compatibility
  - All features enabled
```

### Inheritance Validation Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| No Circular | Template cannot inherit from descendant | Save validation |
| Single System Default | Only one system default allowed | Database constraint |
| Tenant Matching | Child must match parent's tenant | Save validation |
| Max Depth | Inheritance depth limited to 5 levels | Save validation |

### Circular Inheritance Prevention

```
Circular Inheritance Check
══════════════════════════

Invalid Example:
  Template A → parent: Template B
  Template B → parent: Template C
  Template C → parent: Template A  ← CIRCULAR!

Validation:
  On save, traverse parent chain
  If current template found in chain:
    Raise ValidationError
```

### Expected Outcome
- Hierarchical template structure
- Efficient setting reuse
- Easy customization
- Template cloning capability
- Inheritance validation

### Verification Checklist
- [ ] parent_template field added
- [ ] is_system_default field added
- [ ] inherits_from_parent field added
- [ ] get_effective_value method implemented
- [ ] get_inherited_fields method implemented
- [ ] clone_template method implemented
- [ ] Save method validates inheritance
- [ ] Circular inheritance prevention
- [ ] Meta constraints added
- [ ] Model docstring updated

---

## Task 16: Create ReceiptTemplate Admin

### Overview
Create a comprehensive Django admin interface for managing receipt templates. The admin should provide an intuitive way to create, edit, preview, and manage templates, including bulk actions, filtering, and a visual preview of receipt templates.

### Dependencies
- Task 15: Create template inheritance
- Django admin framework
- All ReceiptTemplate fields completed

### Instructions

1. **Create admin.py or open existing**
   - Navigate to `apps/pos/receipts/admin.py`
   - Import necessary admin modules

2. **Import required modules**
   - Import Django admin components
   - Import ReceiptTemplate model
   - Import any custom admin mixins

3. **Create ReceiptTemplateAdmin class**
   - Inherit from admin.ModelAdmin
   - Configure comprehensive admin interface

4. **Configure list_display**
   - Show key fields in list view
   - Include: name, tenant, paper_size, is_default, is_active
   - Add custom display methods

5. **Configure list_filter**
   - Add filters for tenant
   - Add filters for paper_size
   - Add filters for is_default and is_active
   - Add custom filter for inheritance

6. **Configure search_fields**
   - Enable search by name
   - Enable search by description
   - Enable search by tenant name

7. **Configure fieldsets**
   - Organize fields into logical sections
   - Sections: Basic Info, Header, Items, Totals, Payment, Footer, QR & Fonts, Inheritance

8. **Add readonly_fields**
   - created_at and updated_at
   - Custom preview field

9. **Create preview method**
   - Generate visual template preview
   - Show template structure
   - Display as readonly field

10. **Add custom actions**
    - Clone template action
    - Set as default action
    - Activate/deactivate action

11. **Configure inlines (if applicable)**
    - No inlines needed for this model

12. **Add form validation**
    - Override clean method
    - Validate inheritance settings
    - Ensure only one default per tenant

13. **Register admin class**
    - Register ReceiptTemplate with admin site
    - Apply admin configuration

### Admin Interface Structure

```
┌────────────────────────────────────────────────┐
│         ReceiptTemplate Admin                  │
├────────────────────────────────────────────────┤
│ List View:                                     │
│  • Name, Tenant, Paper Size                    │
│  • Is Default, Is Active                       │
│  • Filters & Search                            │
│                                                │
│ Edit Form:                                     │
│  • Fieldsets (organized)                       │
│  • Template Preview                            │
│  • Inheritance Settings                        │
│                                                │
│ Actions:                                       │
│  • Clone Template                              │
│  • Set as Default                              │
│  • Activate/Deactivate                         │
└────────────────────────────────────────────────┘
```

### List Display Configuration

```python
list_display = [
    'name',
    'tenant',
    'paper_size',
    'is_default_display',
    'is_active_display',
    'has_qr_code',
    'parent_template_name',
    'created_at',
]
```

### List Display Example

```
Receipt Templates
═════════════════════════════════════════════════════════════════

Name                  | Tenant    | Size | Default | Active | QR  | Parent
────────────────────────────────────────────────────────────────────────
Standard Receipt      | Tenant A  | 80mm | ✓       | ✓      | ✗   | System
Compact Receipt       | Tenant A  | 58mm | ✗       | ✓      | ✗   | Standard
Gift Receipt          | Tenant A  | 80mm | ✗       | ✓      | ✗   | Standard
Holiday Receipt       | Tenant A  | 80mm | ✗       | ✗      | ✓   | Standard
Invoice Style         | Tenant A  | A4   | ✗       | ✓      | ✓   | None
```

### Fieldset Organization

#### Fieldset 1: Basic Information
```
Fields:
  - name
  - description
  - tenant
  - paper_size
  - is_default
  - is_active
```

#### Fieldset 2: Header Configuration
```
Fields:
  - show_logo, logo_size
  - business_name_override
  - show_business_name, business_name_bold, business_name_uppercase
  - header_line_1, header_line_1_bold, header_line_1_center
  - header_line_2, header_line_2_bold, header_line_2_center
  - header_line_3, header_line_3_bold, header_line_3_center
```

#### Fieldset 3: Address & Contact
```
Fields:
  - show_address
  - show_phone
  - show_email
  - show_website
  - show_tax_number
  - address_separator
```

#### Fieldset 4: Item Display
```
Fields:
  - show_sku, show_barcode, show_category
  - show_tax_per_item, show_discount_per_item
  - show_unit_price
  - item_description_length, truncate_description
```

#### Fieldset 5: Totals Display
```
Fields:
  - show_subtotal
  - show_tax_breakdown, show_total_tax
  - show_total_discount, show_savings
  - show_rounding
  - totals_separator, bold_grand_total
```

#### Fieldset 6: Payment Display
```
Fields:
  - show_payment_method
  - show_amount_tendered, show_change_given
  - show_balance_due
  - show_card_details
  - payment_separator
```

#### Fieldset 7: Footer Configuration
```
Fields:
  - footer_line_1, footer_line_1_bold, footer_line_1_center
  - footer_line_2, footer_line_2_bold, footer_line_2_center
  - footer_line_3, footer_line_3_bold, footer_line_3_center
  - footer_separator
  - show_return_policy, return_policy_heading
  - return_policy_text, return_policy_bold_heading
  - return_policy_separator
```

#### Fieldset 8: QR Code & Fonts
```
Fields:
  - show_qr_code, qr_content_type
  - qr_code_size, qr_label, qr_position
  - font_size, header_font_size, footer_font_size
  - use_bold_headers
  - separator_style, separator_length
```

#### Fieldset 9: Template Inheritance
```
Fields:
  - parent_template
  - is_system_default
  - inherits_from_parent
  - (Preview of inherited settings)
```

#### Fieldset 10: Metadata (Read-only)
```
Fields:
  - created_at
  - updated_at
  - template_preview (custom field)
```

### Template Preview Display

```
Template Preview
═══════════════════════════════════════════════

Paper Size: 80mm (48 characters)
╔════════════════════════════════════════════════╗
║                   [LOGO]                       ║
║             LANKACOMMERCE RETAIL               ║
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
║         VAT Reg: 123-456-789-001               ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║  Date: 2026-01-23         Time: 14:30:00       ║
║  Receipt: RCP-0001        Cashier: John D.     ║
║                                                ║
║  Item Description          Qty    Price  Total ║
║  ────────────────────────  ───  ───────  ───── ║
║  Sample Item 1               2    500.00 1,000 ║
║  Sample Item 2               1    750.00   750 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║  Subtotal:                            1,750.00 ║
║  Tax (8%):                              140.00 ║
║  ──────────────────────────────────────────── ║
║  GRAND TOTAL:                   LKR  1,890.00  ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║  Payment Method:                          CASH ║
║  Amount Tendered:                        2,000 ║
║  Change Given:                             110 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║          Thank You for Your Purchase!          ║
║            Please Visit Us Again!              ║
║                                                ║
║ [QR CODE]                                      ║
║                                                ║
╚════════════════════════════════════════════════╝

Template inherits from: System Default
Active fields: 45 defined, 12 inherited
```

### Custom Admin Actions

#### Action 1: Clone Template
```
Action: Clone selected templates

Process:
1. User selects template(s) in list
2. Clicks "Clone selected templates"
3. System creates copies with " (Copy)" suffix
4. Redirects to template list

Result:
  Original: "Standard Receipt"
  Clone: "Standard Receipt (Copy)"
```

#### Action 2: Set as Default
```
Action: Set as default template

Process:
1. User selects ONE template
2. Clicks "Set as default"
3. System unsets other defaults for tenant
4. Sets selected template as default
5. Shows success message

Validation:
  - Only one template can be selected
  - Template must be active
```

#### Action 3: Activate Templates
```
Action: Activate selected templates

Process:
1. User selects template(s)
2. Clicks "Activate templates"
3. System sets is_active=True
4. Shows count of activated templates
```

#### Action 4: Deactivate Templates
```
Action: Deactivate selected templates

Process:
1. User selects template(s)
2. Clicks "Deactivate templates"
3. System sets is_active=False
4. Prevents deactivation of default
5. Shows count of deactivated templates
```

### List Filters

#### Filter 1: By Tenant
```
Filter: Tenant
Options: All, Tenant A, Tenant B, Tenant C...
```

#### Filter 2: By Paper Size
```
Filter: Paper Size
Options: All, 80mm, 58mm, A4
```

#### Filter 3: By Status
```
Filter: Status
Options: Active, Inactive, Default, Non-default
```

#### Filter 4: By Inheritance
```
Filter: Has Parent
Options: All, Has Parent, No Parent
```

### Search Functionality

```
Search Fields:
  - name (icontains)
  - description (icontains)
  - tenant__name (icontains)

Example Searches:
  "standard" → Finds "Standard Receipt", "Non-standard Template"
  "80mm" → Finds templates with "80mm" in name or description
  "Tenant A" → Finds all Tenant A templates
```

### Form Validation

```
Validation Rules:
═════════════════

1. Default Template Validation
   - Only one default per tenant
   - If setting is_default=True:
     - Unset other defaults for tenant

2. Inheritance Validation
   - No circular inheritance
   - Parent must belong to same tenant or be system default
   - Max inheritance depth: 5 levels

3. System Default Validation
   - Only one system default allowed
   - System default cannot have tenant
   - System default cannot have parent

4. Paper Size Validation
   - Required field
   - Must be valid choice

5. Active State Validation
   - Cannot deactivate default template
   - Must have at least one active template per tenant
```

### Expected Outcome
- Comprehensive admin interface
- Organized field layout
- Visual template preview
- Bulk actions for management
- Search and filtering
- Form validation

### Verification Checklist
- [ ] ReceiptTemplateAdmin class created
- [ ] list_display configured
- [ ] list_filter configured
- [ ] search_fields configured
- [ ] fieldsets organized logically
- [ ] readonly_fields configured
- [ ] preview method implemented
- [ ] Clone template action added
- [ ] Set as default action added
- [ ] Activate/deactivate actions added
- [ ] Form validation implemented
- [ ] Admin registered

---

## Summary

This document completed the receipt template system with advanced features:

### Completed Components
- ✅ QR code settings (content types, sizes, positioning)
- ✅ Font configuration (sizes, bold options, separators)
- ✅ Template inheritance (parent-child relationships, effective values)
- ✅ Django admin interface (comprehensive management, preview, actions)

### Key Achievements
1. **QR Code Integration** - Digital receipt access, loyalty programs, payment verification
2. **Typography Control** - Font sizes, bold settings, separator styles
3. **Template Hierarchy** - System defaults, tenant defaults, custom templates
4. **Admin Excellence** - Organized interface, visual preview, bulk actions

### Complete System Overview

```
Receipt Template System
═══════════════════════

Components:
├── Submodule Structure
├── Constants (Types, Sizes)
├── ReceiptTemplate Model
│   ├── Header Configuration
│   ├── Address Display
│   ├── Item Display
│   ├── Totals Display
│   ├── Payment Display
│   ├── Footer Configuration
│   ├── Return Policy
│   ├── QR Code Settings
│   ├── Font Settings
│   └── Inheritance
└── Django Admin Interface

Total Fields: ~70+
Total Methods: ~5
Admin Actions: 4
Inheritance Levels: Up to 5
```

### Next Group

Proceed to **Group B: Receipt Data Generation** to implement:
- Receipt data model
- Transaction data collection
- Item data aggregation
- Receipt number generation
- Data validation
- Receipt history tracking

---

**Document Status:** ✅ Complete  
**Total Tasks:** 4  
**Total Lines:** ~1380  
**Group A Status:** ✅ All Tasks Complete (16/16)
