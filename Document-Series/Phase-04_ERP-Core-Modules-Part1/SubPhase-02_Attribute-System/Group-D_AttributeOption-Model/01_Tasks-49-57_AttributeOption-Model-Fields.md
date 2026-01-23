# Tasks 49-57: AttributeOption Model & Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** D - AttributeOption Model  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56, 57

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Attribute-Model/](../Group-C_Attribute-Model/)
- **→ Next Document:** [02_Tasks-58-62_Meta-Manager-Export.md](02_Tasks-58-62_Meta-Manager-Export.md)

---

## Document Overview

This document covers the creation of the AttributeOption model which stores predefined choices for SELECT and MULTISELECT type attributes. Options enable dropdown selection, color swatches, and visual product variant selection.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create attribute_option.py File | Low |
| 50 | Define AttributeOption Class | Medium |
| 51 | Add attribute Field | Medium |
| 52 | Add value Field | Low |
| 53 | Add label Field | Low |
| 54 | Add color_code Field | Low |
| 55 | Add image Field | Medium |
| 56 | Add display_order Field | Low |
| 57 | Add is_default Field | Low |

---

## Task 49: Create attribute_option.py File

### Overview
Create a dedicated model file for the AttributeOption model within the models module.

### Dependencies
- Group C Task 48: Create Attribute Migration

### Instructions

1. **Create attribute_option.py file**
   - Create file: `backend/apps/attributes/models/attribute_option.py`
   - Follow snake_case naming convention

2. **Add module docstring**
   - Document purpose: "AttributeOption model for SELECT/MULTISELECT choices"
   - Explain predefined option values

3. **Import required modules**
   - Import Django models
   - Import BaseModel from core app
   - Import Attribute from current module

4. **Prepare file structure**
   - Module docstring
   - Imports
   - Model class definition

### Expected Outcome
```
backend/apps/attributes/models/
├── __init__.py
├── attribute_group.py
├── attribute.py
└── attribute_option.py      # New file
```

### Verification Checklist
- [ ] File created at correct path
- [ ] Module docstring present
- [ ] Required imports included
- [ ] Valid Python syntax

---

## Task 50: Define AttributeOption Class

### Overview
Define the AttributeOption model class that inherits from BaseModel to provide option choices for SELECT and MULTISELECT attributes.

### Dependencies
- Task 49: Create attribute_option.py File

### Instructions

1. **Create AttributeOption class**
   - Define class named `AttributeOption`
   - Inherit from `BaseModel`
   - Add comprehensive class docstring

2. **Understand option purpose**
   - Stores predefined choices for SELECT/MULTISELECT attributes
   - Used for color swatches, size selection, feature lists
   - Supports visual representation (color code, image)
   - Enables consistent product specifications

3. **Plan model fields**
   - attribute: ForeignKey to Attribute
   - value: Stored value (internal identifier)
   - label: Display text (user-facing)
   - color_code: Optional hex color for swatches
   - image: Optional thumbnail for visual selection
   - display_order: Custom sort order
   - is_default: Default selection flag

4. **Document business context**
   - Only used for SELECT and MULTISELECT types
   - Products reference options, not free-form values
   - Ensures data consistency

### AttributeOption Purpose

| Aspect | Details |
|--------|---------|
| **Storage** | Predefined choices for selection |
| **Display** | Visual swatches and labels |
| **Validation** | Product values must match options |
| **Consistency** | Standardized attribute values |

### Business Use Cases

**Color Selection:**
- Value: "red", Label: "Bright Red", Color: "#FF0000"
- Value: "blue", Label: "Navy Blue", Color: "#000080"
- Value: "black", Label: "Midnight Black", Color: "#000000"

**Size Selection:**
- Value: "xs", Label: "Extra Small"
- Value: "s", Label: "Small"
- Value: "m", Label: "Medium"
- Value: "l", Label: "Large"

**Material Selection:**
- Value: "cotton", Label: "100% Cotton", Image: cotton_texture.jpg
- Value: "leather", Label: "Genuine Leather", Image: leather_texture.jpg

**Features (MULTISELECT):**
- WiFi, Bluetooth, NFC, GPS, 5G, Wireless Charging

### Expected Outcome
```python
class AttributeOption(BaseModel):
    """
    Model for storing predefined options for SELECT and MULTISELECT attributes.
    
    Supports color swatches and images for visual selection.
    Only used for SELECT and MULTISELECT attribute types.
    """
    # Fields will be added in subsequent tasks
    pass
```

### Verification Checklist
- [ ] AttributeOption class defined
- [ ] Inherits from BaseModel
- [ ] Class docstring present
- [ ] Class name uses PascalCase

---

## Task 51: Add attribute Field

### Overview
Add a ForeignKey field to associate options with their parent attribute.

### Dependencies
- Task 50: Define AttributeOption Class

### Instructions

1. **Add attribute ForeignKey**
   - Type: ForeignKey to Attribute
   - Required: Yes (blank=False, null=False)
   - Related name: 'options'
   - On delete: CASCADE

2. **Configure relationship**
   - Use CASCADE (delete options when attribute deleted)
   - Set related_name for reverse lookup
   - Add db_index for performance

3. **Document relationship**
   - Each option belongs to one attribute
   - Attributes can have many options
   - Options cascade-deleted with attribute

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **to** | Attribute | Parent attribute |
| **on_delete** | CASCADE | Delete options with attribute |
| **related_name** | 'options' | Reverse lookup |
| **blank** | False | Required field |
| **null** | False | Database constraint |

### Related Name Usage

```python
# Get all options for an attribute
attribute = Attribute.objects.get(slug='color')
options = attribute.options.all()

# Get options ordered
options = attribute.options.order_by('display_order', 'label')

# Count options
option_count = attribute.options.count()
```

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name='options',
        help_text="Attribute this option belongs to"
    )
```

### Verification Checklist
- [ ] attribute field added
- [ ] ForeignKey to Attribute
- [ ] on_delete=CASCADE
- [ ] related_name='options'
- [ ] help_text provided

---

## Task 52: Add value Field

### Overview
Add a value field to store the internal identifier for the option.

### Dependencies
- Task 51: Add attribute Field

### Instructions

1. **Add value field**
   - Type: CharField
   - Max length: 100 characters
   - Required: Yes (blank=False, null=False)
   - Verbose name: "Value"

2. **Configure field properties**
   - Set db_index=True for lookup performance
   - Add help text
   - Lowercase recommended

3. **Document value usage**
   - Internal identifier (stored in database)
   - Usually lowercase, slug-like format
   - Used in API filters and queries
   - Examples: "red", "large", "cotton"

4. **Consider uniqueness**
   - Must be unique within attribute (handled in Meta)
   - Different attributes can have same value

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 100 | Sufficient for values |
| **blank** | False | Required field |
| **null** | False | Database constraint |
| **db_index** | True | Frequently queried |

### Value vs Label

| Field | Purpose | Example |
|-------|---------|---------|
| **value** | Internal identifier | "navy-blue" |
| **label** | Display text | "Navy Blue" |

### Value Examples

| Attribute | Value | Label |
|-----------|-------|-------|
| Color | red | Bright Red |
| Color | blue | Navy Blue |
| Size | xs | Extra Small |
| Size | l | Large |
| Material | cotton | 100% Cotton |
| Storage | 256gb | 256 GB |
| RAM | 8gb | 8 GB RAM |

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(...)
    value = models.CharField(
        max_length=100,
        help_text="Internal value (e.g., 'red', 'large')"
    )
```

### Verification Checklist
- [ ] value field added
- [ ] CharField with max_length=100
- [ ] blank=False and null=False
- [ ] db_index configured
- [ ] help_text provided

---

## Task 53: Add label Field

### Overview
Add a label field to store the user-facing display text for the option.

### Dependencies
- Task 52: Add value Field

### Instructions

1. **Add label field**
   - Type: CharField
   - Max length: 100 characters
   - Required: Yes (blank=False, null=False)
   - Verbose name: "Label"

2. **Configure field properties**
   - Add help text explaining display usage
   - User-friendly formatting

3. **Document label usage**
   - Displayed in UI (dropdowns, filters, product pages)
   - Can include spaces, capitals, special chars
   - Translation at presentation layer
   - Examples: "Bright Red", "Extra Large", "100% Cotton"

### Label Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 100 | Sufficient for labels |
| **blank** | False | Required field |
| **null** | False | Database constraint |
| **db_index** | False | Not frequently searched |

### Label Examples

| Value | Label | Display Context |
|-------|-------|-----------------|
| xs | Extra Small | Dropdown: "Extra Small" |
| xl | Extra Large | Button: "Extra Large" |
| midnight-black | Midnight Black | Swatch with label |
| 256gb | 256 GB Storage | Specification list |
| wireless-charging | Wireless Charging | Feature checkbox |

### Multi-Language Considerations

**English Labels:**
- "Bright Red", "Large", "Wireless Charging"

**Sinhala Labels (Future):**
- "දීප්තිමත් රතු" (Bright Red)
- "විශාල" (Large)
- "රැහැන් රහිත ආරෝපණය" (Wireless Charging)

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(...)
    value = models.CharField(...)
    label = models.CharField(
        max_length=100,
        help_text="Display label (e.g., 'Bright Red', 'Extra Large')"
    )
```

### Verification Checklist
- [ ] label field added
- [ ] CharField with max_length=100
- [ ] blank=False and null=False
- [ ] help_text provided
- [ ] No db_index needed

---

## Task 54: Add color_code Field

### Overview
Add an optional color_code field to store hex color codes for color swatch display.

### Dependencies
- Task 53: Add label Field

### Instructions

1. **Add color_code field**
   - Type: CharField
   - Max length: 7 characters (for #RRGGBB)
   - Required: No (blank=True, null=True)
   - Verbose name: "Color Code"

2. **Configure field properties**
   - Optional field (only for color attributes)
   - Add help text with format example
   - Validation for hex format (in serializer/form)

3. **Document color swatch usage**
   - Used for visual color swatches in webstore
   - Hex format: #RRGGBB
   - Examples: #FF0000 (red), #0000FF (blue)
   - Displayed as colored circle/square

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 7 | #RRGGBB format |
| **blank** | True | Optional (color-specific) |
| **null** | True | Allow NULL |
| **db_index** | False | Not searched |

### Color Code Examples

| Color Name | Value | Label | Color Code |
|------------|-------|-------|------------|
| Red | red | Bright Red | #FF0000 |
| Blue | blue | Navy Blue | #000080 |
| Green | green | Forest Green | #228B22 |
| Black | black | Midnight Black | #000000 |
| White | white | Pure White | #FFFFFF |
| Pink | pink | Hot Pink | #FF69B4 |
| Orange | orange | Vibrant Orange | #FF8C00 |

### Swatch Display

**Webstore Filter:**
```
Colors:
[●] Red (#FF0000)
[●] Blue (#000080)
[●] Green (#228B22)
```

**Product Options:**
```
Select Color:
[●Red]  [●Blue]  [●Green]  [●Black]
```

### Hex Color Validation

```python
# In serializer
import re

def validate_color_code(value):
    if value and not re.match(r'^#[0-9A-Fa-f]{6}$', value):
        raise ValidationError("Color code must be in #RRGGBB format")
```

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(...)
    value = models.CharField(...)
    label = models.CharField(...)
    color_code = models.CharField(
        max_length=7,
        blank=True,
        null=True,
        help_text="Hex color code for swatches (e.g., #FF0000)"
    )
```

### Verification Checklist
- [ ] color_code field added
- [ ] CharField with max_length=7
- [ ] blank=True and null=True
- [ ] help_text with format example
- [ ] No db_index needed

---

## Task 55: Add image Field

### Overview
Add an optional image field to store thumbnail images for visual option selection.

### Dependencies
- Task 54: Add color_code Field

### Instructions

1. **Add image field**
   - Type: ImageField
   - Upload to: Dynamic path with tenant schema
   - Required: No (blank=True, null=True)
   - Verbose name: "Option Image"

2. **Configure field properties**
   - Set upload_to callable for tenant isolation
   - Add help text explaining usage
   - Optional field (only when visual needed)

3. **Document image usage**
   - Used for material textures, pattern swatches
   - Displayed as thumbnail in option selection
   - Examples: fabric textures, finish samples
   - Stored in tenant-specific directory

4. **Consider file storage**
   - Tenant isolation in file paths
   - Thumbnail generation (separate task)
   - Image optimization
   - CDN delivery (future)

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **upload_to** | Callable | Tenant-specific path |
| **blank** | True | Optional field |
| **null** | True | Allow NULL |
| **max_length** | 255 | File path length |

### Upload Path Function

```python
def attribute_option_image_path(instance, filename):
    # Tenant-isolated path
    return f'attributes/options/{instance.attribute.slug}/{filename}'
```

### Image Use Cases

**Material Options:**
- Cotton: cotton_texture.jpg
- Leather: leather_texture.jpg
- Denim: denim_texture.jpg

**Pattern Options:**
- Striped: striped_pattern.jpg
- Checkered: checkered_pattern.jpg
- Solid: solid_color.jpg

**Finish Options:**
- Matte: matte_finish.jpg
- Glossy: glossy_finish.jpg
- Brushed: brushed_finish.jpg

### Option Display with Image

**Webstore:**
```
Select Material:
[📷 Cotton]  [📷 Leather]  [📷 Denim]
```

**Product Page:**
```
Material: 
[Image: Cotton texture] 100% Cotton
```

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(...)
    value = models.CharField(...)
    label = models.CharField(...)
    color_code = models.CharField(...)
    image = models.ImageField(
        upload_to='attributes/options/',
        blank=True,
        null=True,
        help_text="Optional image for visual selection"
    )
```

### Verification Checklist
- [ ] image field added
- [ ] ImageField type
- [ ] upload_to configured
- [ ] blank=True and null=True
- [ ] help_text provided

---

## Task 56: Add display_order Field

### Overview
Add a display_order field to control the sort order of options within an attribute.

### Dependencies
- Task 55: Add image Field

### Instructions

1. **Add display_order field**
   - Type: PositiveIntegerField
   - Required: Yes with default value
   - Default: 0
   - Verbose name: "Display Order"

2. **Configure ordering behavior**
   - Lower numbers appear first
   - Used in dropdowns and filters
   - Add db_index for sorting performance

3. **Document ordering strategy**
   - Logical order (sizes: XS, S, M, L, XL)
   - Common first (most popular colors first)
   - Alphabetical as fallback

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | 0 | Default ordering |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | True | Frequent ordering |

### Ordering Examples

**Size Attribute:**
1. (Order 0) XS - Extra Small
2. (Order 10) S - Small
3. (Order 20) M - Medium
4. (Order 30) L - Large
5. (Order 40) XL - Extra Large
6. (Order 50) XXL - Double Extra Large

**Color Attribute (by popularity):**
1. (Order 0) Black
2. (Order 10) White
3. (Order 20) Blue
4. (Order 30) Red
5. (Order 40) Green

**Storage Attribute:**
1. (Order 0) 64 GB
2. (Order 10) 128 GB
3. (Order 20) 256 GB
4. (Order 30) 512 GB
5. (Order 40) 1 TB

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(...)
    value = models.CharField(...)
    label = models.CharField(...)
    color_code = models.CharField(...)
    image = models.ImageField(...)
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in which option is displayed (lower first)"
    )
```

### Verification Checklist
- [ ] display_order field added
- [ ] PositiveIntegerField type
- [ ] default=0 set
- [ ] help_text provided
- [ ] db_index configured

---

## Task 57: Add is_default Field

### Overview
Add a boolean field to mark the default selected option for an attribute.

### Dependencies
- Task 56: Add display_order Field

### Instructions

1. **Add is_default field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: False
   - Verbose name: "Is Default"

2. **Configure field properties**
   - Add help text explaining usage
   - Default to False (explicit selection)
   - Consider unique constraint (one default per attribute)

3. **Document default behavior**
   - Pre-selected in product forms
   - Shown first in filters
   - Only one default per attribute (enforced in logic)

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | False | Explicit opt-in |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | True | Frequently filtered |

### Default Option Use Cases

**Color: Black (default)**
- Pre-selected when adding product
- Shown first in color picker
- Most common option

**Size: Medium (default)**
- Standard size selection
- Most commonly ordered

**Storage: 128 GB (default)**
- Most popular capacity
- Middle option

### Default Validation

```python
# In model save() or serializer
def save(self, *args, **kwargs):
    if self.is_default:
        # Remove default from other options
        AttributeOption.objects.filter(
            attribute=self.attribute,
            is_default=True
        ).exclude(pk=self.pk).update(is_default=False)
    super().save(*args, **kwargs)
```

### Expected Outcome
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(...)
    value = models.CharField(...)
    label = models.CharField(...)
    color_code = models.CharField(...)
    image = models.ImageField(...)
    display_order = models.PositiveIntegerField(...)
    is_default = models.BooleanField(
        default=False,
        help_text="Default selected option"
    )
```

### Verification Checklist
- [ ] is_default field added
- [ ] BooleanField type
- [ ] default=False set
- [ ] help_text provided
- [ ] db_index configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 49 | Create attribute_option.py File | Model file created |
| 50 | Define AttributeOption Class | Class inheriting from BaseModel |
| 51 | Add attribute Field | ForeignKey to Attribute |
| 52 | Add value Field | Internal identifier |
| 53 | Add label Field | Display text |
| 54 | Add color_code Field | Hex color for swatches |
| 55 | Add image Field | Optional thumbnail |
| 56 | Add display_order Field | Custom sort order |
| 57 | Add is_default Field | Default selection flag |

### AttributeOption Model Structure (So Far)
```python
class AttributeOption(BaseModel):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='options')
    value = models.CharField(max_length=100)
    label = models.CharField(max_length=100)
    color_code = models.CharField(max_length=7, blank=True, null=True)
    image = models.ImageField(upload_to='attributes/options/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_default = models.BooleanField(default=False)
    
    # Meta, __str__, manager, export to be added in next document
```

### Next Steps
1. Proceed to [02_Tasks-58-62_Meta-Manager-Export.md](02_Tasks-58-62_Meta-Manager-Export.md)
2. Add Meta class with unique constraint
3. Add __str__ method
4. Create custom manager (optional)
5. Export model and generate migration

---

## Notes for AI Agents

1. **Attribute Type:** Only for SELECT/MULTISELECT
2. **Value vs Label:** value=internal, label=display
3. **Visual Options:** color_code for swatches, image for textures
4. **Default Option:** Only one per attribute
5. **Ordering:** Logical order (sizes, storage) or popularity
6. **Tenant Isolation:** Image paths include tenant
7. **No Code:** Instructions only
