# Tasks 08-14: Constants & Attribute Types

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** A - Attributes App Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_App-Creation-Configuration.md](01_Tasks-01-07_App-Creation-Configuration.md)
- **→ Next Group:** [../Group-B_AttributeGroup-Model/](../Group-B_AttributeGroup-Model/)

---

## Document Overview

This document covers the creation of constants file for attribute type definitions. These constants define the supported attribute types and will be used throughout the attributes app for model choices, validation, and serialization.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 08 | Create constants.py File | Low |
| 09 | Define ATTRIBUTE_TYPES | Medium |
| 10 | Define TEXT Type | Low |
| 11 | Define NUMBER Type | Low |
| 12 | Define SELECT Type | Low |
| 13 | Define MULTISELECT Type | Low |
| 14 | Define BOOLEAN Type | Low |

---

## Task 08: Create constants.py File

### Overview
Create a constants module to store all attribute-related constants, starting with attribute type definitions.

### Dependencies
- Task 07: Create models __init__.py

### Instructions

1. **Create constants.py file**
   - Create file named `constants.py` in `backend/apps/attributes/`
   - Place at app root level, not in models directory

2. **Add module docstring**
   - Document the purpose: "Constants for attribute types and configurations"
   - Mention that these constants are used across models and serializers

3. **Import necessary modules**
   - No imports needed initially
   - Future tasks may require additional imports

4. **Prepare for type definitions**
   - Structure file to contain ATTRIBUTE_TYPES tuple
   - Use uppercase naming for constants (Python convention)

### File Organization

| Section | Purpose |
|---------|---------|
| **Module Docstring** | Explain file purpose |
| **Imports** | Required modules (if any) |
| **Type Constants** | Individual type constants |
| **ATTRIBUTE_TYPES** | Tuple of all types for choices |

### Expected Outcome
```
backend/apps/attributes/
├── __init__.py
├── apps.py
├── constants.py             # New file
└── models/
    └── __init__.py
```

### Verification Checklist
- [ ] `constants.py` file exists in `backend/apps/attributes/`
- [ ] File has module docstring
- [ ] File is valid Python (no syntax errors)
- [ ] File location is at app root, not in models/

---

## Task 09: Define ATTRIBUTE_TYPES

### Overview
Define the ATTRIBUTE_TYPES tuple that will be used for model field choices throughout the attributes app.

### Dependencies
- Task 08: Create constants.py File

### Instructions

1. **Define attribute type constants**
   - Create individual constants for each type (tasks 10-14)
   - Use uppercase naming: `TEXT`, `NUMBER`, `SELECT`, etc.
   - Assign string values that match constant names

2. **Create ATTRIBUTE_TYPES tuple**
   - Define as tuple of 2-tuples for Django choices
   - Format: `(value, display_label)`
   - Include all attribute types in logical order

3. **Order types logically**
   - Start with simple types (TEXT, NUMBER)
   - Follow with selection types (SELECT, MULTISELECT)
   - End with special types (BOOLEAN, DATE)

4. **Use descriptive labels**
   - Display labels should be user-friendly
   - Use title case for display labels
   - Match label to business terminology

### Django Choices Pattern

```python
ATTRIBUTE_TYPES = (
    (VALUE, 'Display Label'),
    (VALUE2, 'Display Label 2'),
)
```

### Attribute Types Overview

| Type | Purpose | Use Case |
|------|---------|----------|
| **TEXT** | Free-form text | Brand, model number, description |
| **NUMBER** | Numeric values | Weight, length, capacity |
| **SELECT** | Single choice from options | Color, size, material |
| **MULTISELECT** | Multiple choices | Features, compatibility |
| **BOOLEAN** | Yes/No values | Waterproof, wireless |
| **DATE** | Date values | Warranty expiry, manufacturing date |

### Expected Outcome
- ATTRIBUTE_TYPES tuple defined
- Ready for use in model field choices
- All types included (6 types total)

### Verification Checklist
- [ ] ATTRIBUTE_TYPES tuple created
- [ ] Contains 6 attribute types
- [ ] Format is tuple of 2-tuples: `(value, label)`
- [ ] All labels are descriptive and user-friendly

---

## Task 10: Define TEXT Type

### Overview
Define the TEXT constant for free-form text attributes.

### Dependencies
- Task 09: Define ATTRIBUTE_TYPES

### Instructions

1. **Create TEXT constant**
   - Define constant: `TEXT = 'text'`
   - Use lowercase value for consistency
   - Place before ATTRIBUTE_TYPES definition

2. **Add to ATTRIBUTE_TYPES tuple**
   - Include entry: `(TEXT, 'Text')`
   - Position as first type in tuple

3. **Document usage with comment**
   - Add inline comment explaining usage
   - Example: `# Free-form text input`

### TEXT Type Characteristics

| Aspect | Details |
|--------|---------|
| **Validation** | Optional regex pattern |
| **Storage** | TextField or CharField |
| **Input Type** | Text input or textarea |
| **Example Attributes** | Brand, Model Number, SKU, Description |

### Business Use Cases

**Product Specifications:**
- Brand Name: "Samsung", "Apple", "Dell"
- Model Number: "SM-G990B", "iPhone 14 Pro"
- Serial Number: "ABC123456789"

**Product Descriptions:**
- Short Description: Brief product summary
- Material: "100% Cotton", "Stainless Steel"
- Manufacturer: Company name

### Validation Options

TEXT type supports:
- **Min Length:** Minimum character count
- **Max Length:** Maximum character count
- **Regex Pattern:** Custom validation pattern
- **Required:** Mandatory field flag

### Expected Outcome
```python
TEXT = 'text'
ATTRIBUTE_TYPES = (
    (TEXT, 'Text'),
    # ... other types
)
```

### Verification Checklist
- [ ] TEXT constant defined with value 'text'
- [ ] Included in ATTRIBUTE_TYPES tuple
- [ ] Display label is 'Text'
- [ ] Comment explains usage

---

## Task 11: Define NUMBER Type

### Overview
Define the NUMBER constant for numeric attributes with optional unit of measure.

### Dependencies
- Task 10: Define TEXT Type

### Instructions

1. **Create NUMBER constant**
   - Define constant: `NUMBER = 'number'`
   - Use lowercase value for consistency

2. **Add to ATTRIBUTE_TYPES tuple**
   - Include entry: `(NUMBER, 'Number')`
   - Position after TEXT type

3. **Document numeric features**
   - Supports decimal values
   - Supports min/max validation
   - Supports unit of measure

### NUMBER Type Characteristics

| Aspect | Details |
|--------|---------|
| **Validation** | Min/max value range |
| **Storage** | DecimalField or FloatField |
| **Input Type** | Number input |
| **Unit Support** | Optional unit field |
| **Example Attributes** | Weight, Length, Price, Quantity |

### Business Use Cases

**Physical Measurements:**
- Weight: 2.5 kg, 500 g, 15 lbs
- Length: 30 cm, 12 inches
- Height: 180 cm
- Width: 50 mm

**Specifications:**
- Battery Capacity: 5000 mAh
- Storage: 256 GB
- RAM: 8 GB
- Screen Size: 6.5 inches

**Financial:**
- Price: 45,000 LKR
- Discount: 10%
- Tax Rate: 15%

### Unit of Measure Examples

| Measurement | Units |
|-------------|-------|
| **Weight** | kg, g, lbs, oz |
| **Length** | cm, m, mm, inches, feet |
| **Volume** | L, mL, gal |
| **Power** | W, kW, HP |
| **Storage** | GB, TB, MB |
| **Currency** | LKR, USD, EUR |

### Validation Options

NUMBER type supports:
- **Min Value:** Minimum allowed value
- **Max Value:** Maximum allowed value
- **Decimal Places:** Precision control
- **Unit:** Unit of measure label
- **Required:** Mandatory field flag

### Expected Outcome
```python
NUMBER = 'number'
ATTRIBUTE_TYPES = (
    (TEXT, 'Text'),
    (NUMBER, 'Number'),
    # ... other types
)
```

### Verification Checklist
- [ ] NUMBER constant defined with value 'number'
- [ ] Included in ATTRIBUTE_TYPES tuple
- [ ] Display label is 'Number'
- [ ] Positioned after TEXT type

---

## Task 12: Define SELECT Type

### Overview
Define the SELECT constant for single-choice selection attributes.

### Dependencies
- Task 11: Define NUMBER Type

### Instructions

1. **Create SELECT constant**
   - Define constant: `SELECT = 'select'`
   - Use lowercase value for consistency

2. **Add to ATTRIBUTE_TYPES tuple**
   - Include entry: `(SELECT, 'Select')`
   - Position after NUMBER type

3. **Document dropdown behavior**
   - Single choice from predefined options
   - Options stored in AttributeOption model
   - Supports color swatches and images

### SELECT Type Characteristics

| Aspect | Details |
|--------|---------|
| **Validation** | Must match an AttributeOption |
| **Storage** | ForeignKey to AttributeOption |
| **Input Type** | Dropdown, radio buttons, or swatches |
| **Options Required** | Yes - AttributeOption records |
| **Example Attributes** | Color, Size, Material, Flavor |

### Business Use Cases

**Product Variants:**
- Color: Red, Blue, Green, Black
- Size: XS, S, M, L, XL, XXL
- Material: Cotton, Polyester, Leather
- Flavor: Vanilla, Chocolate, Strawberry

**Specifications:**
- Condition: New, Refurbished, Used
- Warranty: 1 Year, 2 Years, Lifetime
- Grade: A, B, C
- Rating: 1 Star, 2 Stars, 3 Stars, 4 Stars, 5 Stars

**Configuration:**
- Storage: 64GB, 128GB, 256GB, 512GB
- RAM: 4GB, 8GB, 16GB, 32GB
- Processor: i3, i5, i7, i9

### Visual Presentation

SELECT attributes can be displayed as:
- **Dropdown:** Standard select input
- **Radio Buttons:** Single-choice radio group
- **Color Swatches:** Visual color circles (if color_code provided)
- **Image Swatches:** Thumbnail images (if option image provided)
- **Buttons:** Button group for quick selection

### AttributeOption Integration

Each SELECT option stored as AttributeOption with:
- **Value:** Internal identifier (e.g., "red")
- **Label:** Display name (e.g., "Bright Red")
- **Color Code:** Hex color for swatch (e.g., "#FF0000")
- **Image:** Optional thumbnail image
- **Display Order:** Sort order

### Expected Outcome
```python
SELECT = 'select'
ATTRIBUTE_TYPES = (
    (TEXT, 'Text'),
    (NUMBER, 'Number'),
    (SELECT, 'Select'),
    # ... other types
)
```

### Verification Checklist
- [ ] SELECT constant defined with value 'select'
- [ ] Included in ATTRIBUTE_TYPES tuple
- [ ] Display label is 'Select'
- [ ] Positioned after NUMBER type

---

## Task 13: Define MULTISELECT Type

### Overview
Define the MULTISELECT constant for multiple-choice selection attributes.

### Dependencies
- Task 12: Define SELECT Type

### Instructions

1. **Create MULTISELECT constant**
   - Define constant: `MULTISELECT = 'multiselect'`
   - Use lowercase value for consistency

2. **Add to ATTRIBUTE_TYPES tuple**
   - Include entry: `(MULTISELECT, 'Multi-Select')`
   - Position after SELECT type
   - Note the hyphenated display label

3. **Document multiple selection behavior**
   - Multiple choices from predefined options
   - Options stored in AttributeOption model
   - ManyToMany relationship in product attributes

### MULTISELECT Type Characteristics

| Aspect | Details |
|--------|---------|
| **Validation** | All selected must match AttributeOptions |
| **Storage** | ManyToManyField to AttributeOption |
| **Input Type** | Multi-select, checkboxes |
| **Options Required** | Yes - AttributeOption records |
| **Example Attributes** | Features, Compatibility, Tags |

### Business Use Cases

**Product Features:**
- Features: WiFi, Bluetooth, NFC, GPS, USB-C
- Certifications: ISO 9001, CE, FCC, RoHS
- Compatibility: Windows, macOS, Linux, Android, iOS

**Specifications:**
- Available Colors: Multiple color options
- Languages: English, Sinhala, Tamil
- Payment Methods: Cash, Card, Mobile, Bank Transfer

**Marketing:**
- Tags: New, Sale, Featured, Bestseller, Organic
- Categories: Multiple category assignment
- Audience: Men, Women, Kids, Unisex

**Technical:**
- Ports: HDMI, USB-A, USB-C, Ethernet, Audio Jack
- Connectivity: WiFi, Bluetooth, LTE, 5G
- Sensors: Gyroscope, Accelerometer, Compass, Fingerprint

### Visual Presentation

MULTISELECT attributes displayed as:
- **Checkboxes:** Multiple checkbox group
- **Multi-Select Dropdown:** Dropdown with multiple selection
- **Tag Pills:** Selected items shown as removable tags
- **Toggle Buttons:** Button group with multiple selection

### Difference from SELECT

| Aspect | SELECT | MULTISELECT |
|--------|--------|-------------|
| **Choices** | Single | Multiple |
| **Storage** | ForeignKey | ManyToManyField |
| **UI** | Radio/Dropdown | Checkboxes/Multi-select |
| **Example** | Color: Red | Features: WiFi, Bluetooth, GPS |

### Expected Outcome
```python
MULTISELECT = 'multiselect'
ATTRIBUTE_TYPES = (
    (TEXT, 'Text'),
    (NUMBER, 'Number'),
    (SELECT, 'Select'),
    (MULTISELECT, 'Multi-Select'),
    # ... other types
)
```

### Verification Checklist
- [ ] MULTISELECT constant defined with value 'multiselect'
- [ ] Included in ATTRIBUTE_TYPES tuple
- [ ] Display label is 'Multi-Select' (hyphenated)
- [ ] Positioned after SELECT type

---

## Task 14: Define BOOLEAN Type

### Overview
Define the BOOLEAN constant for yes/no attributes and the DATE constant for date attributes.

### Dependencies
- Task 13: Define MULTISELECT Type

### Instructions

1. **Create BOOLEAN constant**
   - Define constant: `BOOLEAN = 'boolean'`
   - Use lowercase value for consistency

2. **Add BOOLEAN to ATTRIBUTE_TYPES tuple**
   - Include entry: `(BOOLEAN, 'Boolean')`
   - Position after MULTISELECT type

3. **Create DATE constant**
   - Define constant: `DATE = 'date'`
   - Use lowercase value for consistency

4. **Add DATE to ATTRIBUTE_TYPES tuple**
   - Include entry: `(DATE, 'Date')`
   - Position as last type in tuple

5. **Document both types**
   - BOOLEAN: True/False or Yes/No values
   - DATE: Calendar date values

### BOOLEAN Type Characteristics

| Aspect | Details |
|--------|---------|
| **Validation** | True or False only |
| **Storage** | BooleanField |
| **Input Type** | Checkbox or toggle |
| **Default** | Configurable (usually False) |
| **Example Attributes** | Waterproof, Wireless, Certified |

### BOOLEAN Use Cases

**Product Features:**
- Waterproof: Yes/No
- Wireless: Yes/No
- Rechargeable: Yes/No
- Touchscreen: Yes/No

**Certifications:**
- Organic Certified: Yes/No
- Fair Trade: Yes/No
- Halal Certified: Yes/No
- Energy Star: Yes/No

**Specifications:**
- Bluetooth Enabled: Yes/No
- GPS Supported: Yes/No
- Dual SIM: Yes/No
- Expandable Storage: Yes/No

### DATE Type Characteristics

| Aspect | Details |
|--------|---------|
| **Validation** | Valid date format |
| **Storage** | DateField |
| **Input Type** | Date picker |
| **Format** | YYYY-MM-DD (ISO format) |
| **Example Attributes** | Warranty Expiry, Manufacturing Date |

### DATE Use Cases

**Warranty & Lifecycle:**
- Warranty Expiry: 2027-12-31
- Manufacturing Date: 2026-01-15
- Best Before: 2026-06-30
- Release Date: 2026-03-01

**Events & Scheduling:**
- Available From: 2026-02-01
- Sale End Date: 2026-03-31
- Pre-Order Date: 2026-01-20

**Documentation:**
- Certification Date: 2026-01-10
- Inspection Date: 2025-12-15
- Last Service Date: 2026-01-05

### Validation Options

**BOOLEAN:**
- Default value (true/false)
- Required flag
- Display as checkbox/toggle/yes-no

**DATE:**
- Min date (earliest allowed)
- Max date (latest allowed)
- Required flag
- Default to current date option

### Expected Outcome
```python
BOOLEAN = 'boolean'
DATE = 'date'

ATTRIBUTE_TYPES = (
    (TEXT, 'Text'),
    (NUMBER, 'Number'),
    (SELECT, 'Select'),
    (MULTISELECT, 'Multi-Select'),
    (BOOLEAN, 'Boolean'),
    (DATE, 'Date'),
)
```

### Verification Checklist
- [ ] BOOLEAN constant defined with value 'boolean'
- [ ] DATE constant defined with value 'date'
- [ ] Both included in ATTRIBUTE_TYPES tuple
- [ ] Display labels are 'Boolean' and 'Date'
- [ ] ATTRIBUTE_TYPES contains all 6 types
- [ ] Tuple format is correct: `(value, label)`

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 08 | Create constants.py File | `constants.py` module created |
| 09 | Define ATTRIBUTE_TYPES | Choices tuple for model fields |
| 10 | Define TEXT Type | TEXT constant and tuple entry |
| 11 | Define NUMBER Type | NUMBER constant and tuple entry |
| 12 | Define SELECT Type | SELECT constant and tuple entry |
| 13 | Define MULTISELECT Type | MULTISELECT constant and tuple entry |
| 14 | Define BOOLEAN Type | BOOLEAN and DATE constants |

### Final Constants Structure
```python
# backend/apps/attributes/constants.py

TEXT = 'text'
NUMBER = 'number'
SELECT = 'select'
MULTISELECT = 'multiselect'
BOOLEAN = 'boolean'
DATE = 'date'

ATTRIBUTE_TYPES = (
    (TEXT, 'Text'),
    (NUMBER, 'Number'),
    (SELECT, 'Select'),
    (MULTISELECT, 'Multi-Select'),
    (BOOLEAN, 'Boolean'),
    (DATE, 'Date'),
)
```

### Complete Group A Structure
```
backend/apps/attributes/
├── __init__.py              # App package marker
├── apps.py                  # AttributesConfig
├── constants.py             # Attribute type constants
└── models/                  # Models module
    └── __init__.py          # Models package marker
```

### Attribute Types Summary

| Type | Value | Use Case | Storage |
|------|-------|----------|---------|
| TEXT | 'text' | Free-form text | CharField/TextField |
| NUMBER | 'number' | Numeric values with units | DecimalField |
| SELECT | 'select' | Single choice | ForeignKey |
| MULTISELECT | 'multiselect' | Multiple choices | ManyToManyField |
| BOOLEAN | 'boolean' | Yes/No values | BooleanField |
| DATE | 'date' | Date values | DateField |

### Group A Complete

All 14 tasks in Group A are now complete:
- ✅ Attributes app created and configured
- ✅ Registered in TENANT_APPS for multi-tenancy
- ✅ App structure established with models module
- ✅ Constants file with 6 attribute types defined
- ✅ ATTRIBUTE_TYPES tuple ready for model choices

### Next Steps
1. Proceed to [../Group-B_AttributeGroup-Model/](../Group-B_AttributeGroup-Model/) to create the AttributeGroup model
2. AttributeGroup will organize attributes into logical groups
3. Use ATTRIBUTE_TYPES constants in Attribute model field choices

---

## Notes for AI Agents

1. **Constant Usage:** ATTRIBUTE_TYPES tuple used in Attribute model `attribute_type` field choices
2. **Type Extensions:** Additional types can be added to tuple in future
3. **Validation Logic:** Each type will have specific validation in model/serializer
4. **Import Pattern:** `from apps.attributes.constants import ATTRIBUTE_TYPES, TEXT, SELECT`
5. **No Code Generation:** Document provides instructions only
6. **Multi-Tenant Context:** Constants shared across all tenants, but attribute definitions are tenant-specific
7. **Future Use:** Constants used in model fields, serializers, validators, and API filters
