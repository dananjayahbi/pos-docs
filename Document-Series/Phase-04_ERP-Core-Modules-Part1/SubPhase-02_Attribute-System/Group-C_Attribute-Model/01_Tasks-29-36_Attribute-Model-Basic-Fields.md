# Tasks 29-36: Attribute Model & Basic Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** C - Attribute Model  
> **Document:** 01 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_AttributeGroup-Model/](../Group-B_AttributeGroup-Model/)
- **→ Next Document:** [02_Tasks-37-42_Display-Validation-Fields.md](02_Tasks-37-42_Display-Validation-Fields.md)

---

## Document Overview

This document covers the creation of the Attribute model with basic identification and type fields. The Attribute model defines individual product attributes with their types, validation rules, and organizational relationships.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create attribute.py File | Low |
| 30 | Define Attribute Class | Medium |
| 31 | Add name Field | Low |
| 32 | Add slug Field | Low |
| 33 | Add group Field | Medium |
| 34 | Add attribute_type Field | Medium |
| 35 | Add unit Field | Low |
| 36 | Add is_required Field | Low |

---

## Task 29: Create attribute.py File

### Overview
Create a dedicated model file for the Attribute model within the models module.

### Dependencies
- Group B Task 28: Create Initial Migration

### Instructions

1. **Create attribute.py file**
   - Create file named `attribute.py` in `backend/apps/attributes/models/`
   - Follow snake_case naming convention

2. **Add module docstring**
   - Document purpose: "Attribute model for defining product attributes"
   - Explain that attributes are type-based specifications

3. **Import required modules**
   - Import Django models module
   - Import BaseModel from core app
   - Import AttributeGroup from current module
   - Import ATTRIBUTE_TYPES from constants

4. **Prepare file structure**
   - Module docstring
   - Imports section
   - Model class definition

### Required Imports

| Import | Source | Purpose |
|--------|--------|---------|
| models | django.db | Django ORM |
| BaseModel | apps.core.models | Base model inheritance |
| AttributeGroup | .attribute_group | ForeignKey reference |
| ATTRIBUTE_TYPES, TEXT, NUMBER, etc. | ..constants | Type choices |

### Expected Outcome
```
backend/apps/attributes/models/
├── __init__.py
├── attribute_group.py
└── attribute.py              # New file
```

### Verification Checklist
- [ ] File created at correct path
- [ ] Module docstring present
- [ ] Required imports included
- [ ] File is valid Python

---

## Task 30: Define Attribute Class

### Overview
Define the Attribute model class that inherits from BaseModel to provide common fields and multi-tenant functionality.

### Dependencies
- Task 29: Create attribute.py File

### Instructions

1. **Create Attribute class**
   - Define class named `Attribute`
   - Inherit from `BaseModel`
   - Add comprehensive class docstring

2. **Understand attribute purpose**
   - Defines individual product specifications
   - Type-based validation (TEXT, NUMBER, SELECT, etc.)
   - Can be required or optional
   - Organized into AttributeGroups

3. **Plan model fields**
   - name: Attribute display name
   - slug: URL-friendly identifier
   - group: ForeignKey to AttributeGroup
   - attribute_type: Choice field (TEXT, NUMBER, etc.)
   - unit: Unit of measure (for NUMBER type)
   - is_required: Required flag
   - Display flags (next document)
   - Validation fields (next document)
   - Category M2M (last document)

4. **Add class docstring**
   - Explain attribute purpose
   - List supported types
   - Note business context

### Attribute Model Purpose

| Aspect | Details |
|--------|---------|
| **Definition** | Defines product specifications |
| **Types** | TEXT, NUMBER, SELECT, MULTISELECT, BOOLEAN, DATE |
| **Validation** | Type-specific validation rules |
| **Organization** | Grouped by AttributeGroup |
| **Assignment** | Linked to Categories via M2M |

### Business Use Cases

**Electronics:**
- Brand (TEXT, required)
- Weight (NUMBER, kg, optional)
- Color (SELECT, required)
- Features (MULTISELECT, optional)
- Warranty (BOOLEAN, required)
- Release Date (DATE, optional)

**Clothing:**
- Size (SELECT, required)
- Material (TEXT, required)
- Care Instructions (TEXT, optional)
- Washable (BOOLEAN, required)
- Available Colors (MULTISELECT, optional)

**Food:**
- Weight (NUMBER, g/kg, required)
- Ingredients (TEXT, required)
- Allergens (MULTISELECT, optional)
- Organic (BOOLEAN, optional)
- Best Before (DATE, required)

### Multi-Tenant Context

- Each tenant defines their own attributes
- Attributes stored in tenant schema
- No cross-tenant visibility
- Same attribute names possible across tenants (different records)

### Expected Outcome
```python
class Attribute(BaseModel):
    """
    Model for defining product attributes with type-based validation.
    
    Supports multiple attribute types: TEXT, NUMBER, SELECT,
    MULTISELECT, BOOLEAN, DATE.
    
    Attributes are organized into groups and assigned to categories.
    """
    # Fields will be added in subsequent tasks
    pass
```

### Verification Checklist
- [ ] Attribute class defined
- [ ] Inherits from BaseModel
- [ ] Class docstring present
- [ ] Class name uses PascalCase

---

## Task 31: Add name Field

### Overview
Add the name field to store the attribute's display name.

### Dependencies
- Task 30: Define Attribute Class

### Instructions

1. **Add name field**
   - Type: CharField
   - Max length: 100 characters
   - Required: Yes (blank=False, null=False)
   - Verbose name: "Attribute Name"

2. **Configure field properties**
   - Set db_index=True for query performance
   - Add help text
   - Examples: "Color", "Weight", "Screen Size"

3. **Consider unique constraint**
   - Name should be unique within group (handled in Meta)
   - Or at minimum, unique within tenant
   - Prevents duplicate attribute names

4. **Multi-language support**
   - Store in English or tenant's primary language
   - Translation at presentation layer
   - Future i18n considerations

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 100 | Sufficient for names |
| **blank** | False | Required field |
| **null** | False | Database constraint |
| **db_index** | True | Frequently queried |

### Name Examples by Category

| Category | Attribute Names |
|----------|-----------------|
| **Electronics** | Brand, Model, Processor, RAM, Storage, Screen Size, Resolution, Battery Capacity |
| **Clothing** | Size, Color, Material, Pattern, Sleeve Length, Fit Type, Collar Style |
| **Furniture** | Material, Dimensions, Weight Capacity, Color, Finish, Assembly Required |
| **Food** | Weight, Volume, Ingredients, Allergens, Nutrition Facts, Serving Size |
| **Books** | Author, Publisher, ISBN, Pages, Language, Format, Edition |

### Sri Lankan Context

**LKR-Related:**
- Price (NUMBER, LKR)
- Shipping Cost (NUMBER, LKR)

**Local Language:**
- Product Name Sinhala (TEXT)
- Description Tamil (TEXT)

**Local Specifications:**
- Import Duty Paid (BOOLEAN)
- SLS Certified (BOOLEAN)
- Warranty Period Sri Lanka (NUMBER, months)

### Expected Outcome
```python
class Attribute(BaseModel):
    name = models.CharField(
        max_length=100,
        help_text="Name of the attribute (e.g., Color, Weight, Size)"
    )
```

### Verification Checklist
- [ ] name field added
- [ ] CharField with max_length=100
- [ ] blank=False and null=False
- [ ] help_text provided
- [ ] db_index configured

---

## Task 32: Add slug Field

### Overview
Add a slug field for URL-friendly attribute identifiers used in API endpoints and filtering.

### Dependencies
- Task 31: Add name Field

### Instructions

1. **Add slug field**
   - Type: SlugField
   - Max length: 100 characters
   - Required: Yes (blank=True for auto-generation)
   - Auto-populate from name

2. **Configure slug properties**
   - Set blank=True for auto-generation
   - Add db_index=True for lookup performance
   - Set help_text explaining auto-generation

3. **Plan slug generation**
   - Auto-generate from name in save() method
   - Convert to lowercase
   - Replace spaces with hyphens
   - Ensure uniqueness within tenant

4. **Document slug usage**
   - Used in API filtering: `/api/attributes/?slug=screen-size`
   - Used in webstore faceted search
   - Frontend attribute selectors

### Slug Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 100 | Match name field |
| **blank** | True | Allow auto-generation |
| **null** | False | Always populated |
| **db_index** | True | URL lookups |

### Slug Generation Examples

| Name | Generated Slug |
|------|----------------|
| Screen Size | `screen-size` |
| Battery Capacity | `battery-capacity` |
| Material Composition | `material-composition` |
| Warranty Period (Years) | `warranty-period-years` |
| Weight (kg) | `weight-kg` |
| Allergen Information | `allergen-information` |

### API Usage

```
GET /api/attributes/
GET /api/attributes/?slug=screen-size
GET /api/products/?screen-size=6.5
GET /api/products/filter/?attributes[color]=red&attributes[size]=large
```

### Webstore Filtering

**Faceted Search URLs:**
```
/products/smartphones?screen-size=6.5&color=black&ram=8gb
/products/clothing?size=large&color=blue&material=cotton
```

### Expected Outcome
```python
class Attribute(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(
        max_length=100,
        blank=True,
        help_text="URL-friendly identifier (auto-generated)"
    )
```

### Verification Checklist
- [ ] slug field added
- [ ] SlugField with max_length=100
- [ ] blank=True for auto-generation
- [ ] db_index configured
- [ ] help_text mentions auto-generation

---

## Task 33: Add group Field

### Overview
Add a ForeignKey field to associate attributes with attribute groups for organizational purposes.

### Dependencies
- Task 32: Add slug Field

### Instructions

1. **Add group ForeignKey field**
   - Type: ForeignKey to AttributeGroup
   - Required: No (blank=True, null=True)
   - Related name: 'attributes'
   - On delete: SET_NULL

2. **Configure relationship**
   - Use string reference or import: `'AttributeGroup'` or direct import
   - Set related_name for reverse lookup
   - Choose appropriate on_delete behavior

3. **Document optional grouping**
   - Groups are optional but recommended
   - Ungrouped attributes still usable
   - Groups improve UI organization

4. **Consider group inheritance**
   - Attributes inherit group's display_order
   - Can override with attribute's own display_order
   - Group filtering in admin

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **to** | AttributeGroup | Model reference |
| **on_delete** | SET_NULL | Preserve attributes if group deleted |
| **related_name** | 'attributes' | Reverse lookup name |
| **blank** | True | Optional grouping |
| **null** | True | Allow NULL in database |

### on_delete Options

| Option | Behavior | Use Case |
|--------|----------|----------|
| **CASCADE** | Delete attributes when group deleted | Strong dependency |
| **SET_NULL** | Set to NULL when group deleted | Preserve attributes |
| **PROTECT** | Prevent group deletion if has attributes | Enforce integrity |

**Recommendation:** SET_NULL - Preserves attribute definitions even if group removed

### Related Name Usage

```python
# Get all attributes in a group
group = AttributeGroup.objects.get(slug='technical-specs')
attributes = group.attributes.all()

# Get active attributes in a group
active_attrs = group.attributes.filter(is_active=True)

# Count attributes in a group
count = group.attributes.count()
```

### Grouping Examples

**Technical Specifications Group:**
- Processor
- RAM
- Storage
- Screen Size
- Resolution

**Dimensions Group:**
- Height
- Width
- Depth
- Weight

**Ungrouped:**
- SKU
- Barcode
- Manufacturer Part Number

### Expected Outcome
```python
class Attribute(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    group = models.ForeignKey(
        AttributeGroup,
        on_delete=models.SET_NULL,
        related_name='attributes',
        blank=True,
        null=True,
        help_text="Optional group for organizing attributes"
    )
```

### Verification Checklist
- [ ] group field added
- [ ] ForeignKey to AttributeGroup
- [ ] on_delete=SET_NULL
- [ ] related_name='attributes'
- [ ] blank=True and null=True
- [ ] help_text provided

---

## Task 34: Add attribute_type Field

### Overview
Add a choice field to specify the attribute type using constants defined in Group A.

### Dependencies
- Task 33: Add group Field

### Instructions

1. **Add attribute_type field**
   - Type: CharField with choices
   - Max length: 20 characters
   - Choices: ATTRIBUTE_TYPES from constants
   - Required: Yes (blank=False, null=False)

2. **Import type constants**
   - Import ATTRIBUTE_TYPES from constants module
   - Can also import individual constants (TEXT, NUMBER, etc.)
   - Use for default value if needed

3. **Configure field**
   - Set db_index=True for filtering by type
   - Add help text listing available types
   - No default value (force explicit selection)

4. **Document type implications**
   - Type determines validation rules
   - Type determines input widget
   - Type determines storage approach
   - Type affects which other fields are used

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 20 | Accommodate type values |
| **choices** | ATTRIBUTE_TYPES | Defined in constants |
| **blank** | False | Type is required |
| **null** | False | Database constraint |
| **db_index** | True | Frequently filtered |

### Type Choice Import

```python
from ..constants import ATTRIBUTE_TYPES, TEXT, NUMBER, SELECT, MULTISELECT, BOOLEAN, DATE
```

### Type-Specific Behavior

| Type | Validation Fields | Storage | Input Widget |
|------|-------------------|---------|--------------|
| **TEXT** | validation_regex, min/max length | CharField/TextField | Text input |
| **NUMBER** | min_value, max_value, unit | DecimalField | Number input |
| **SELECT** | Options via AttributeOption | ForeignKey | Dropdown/Radio |
| **MULTISELECT** | Options via AttributeOption | ManyToMany | Checkboxes |
| **BOOLEAN** | None | BooleanField | Checkbox/Toggle |
| **DATE** | min/max date | DateField | Date picker |

### Type Usage Examples

**TEXT Attributes:**
- Brand, Model Number, SKU, Description
- Validation: Regex pattern, length constraints

**NUMBER Attributes:**
- Weight (kg), Height (cm), Price (LKR), Rating (0-5)
- Validation: Min/max range, decimal precision

**SELECT Attributes:**
- Color (single choice), Size (single choice), Material
- Validation: Must match an AttributeOption

**MULTISELECT Attributes:**
- Features (multiple), Certifications, Compatibility
- Validation: All selections must match AttributeOptions

**BOOLEAN Attributes:**
- In Stock, Featured, On Sale, Certified
- Validation: True/False only

**DATE Attributes:**
- Manufacturing Date, Expiry Date, Warranty Until
- Validation: Valid date format, min/max dates

### API Filtering by Type

```python
# Get all text attributes
text_attrs = Attribute.objects.filter(attribute_type='text')

# Get all number attributes
number_attrs = Attribute.objects.filter(attribute_type='number')

# Get all selection-based attributes (SELECT or MULTISELECT)
from ..constants import SELECT, MULTISELECT
selection_attrs = Attribute.objects.filter(
    attribute_type__in=[SELECT, MULTISELECT]
)
```

### Expected Outcome
```python
from ..constants import ATTRIBUTE_TYPES

class Attribute(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    group = models.ForeignKey(...)
    attribute_type = models.CharField(
        max_length=20,
        choices=ATTRIBUTE_TYPES,
        help_text="Type of attribute (TEXT, NUMBER, SELECT, etc.)"
    )
```

### Verification Checklist
- [ ] attribute_type field added
- [ ] CharField with max_length=20
- [ ] choices=ATTRIBUTE_TYPES
- [ ] blank=False and null=False
- [ ] db_index configured
- [ ] help_text provided
- [ ] ATTRIBUTE_TYPES imported from constants

---

## Task 35: Add unit Field

### Overview
Add an optional unit field to specify the unit of measure for NUMBER type attributes.

### Dependencies
- Task 34: Add attribute_type Field

### Instructions

1. **Add unit field**
   - Type: CharField
   - Max length: 20 characters
   - Required: No (blank=True, null=True)
   - Verbose name: "Unit of Measure"

2. **Configure field properties**
   - Optional field (only used for NUMBER type)
   - Add help text with examples
   - Examples: kg, cm, GB, mAh, %, LKR

3. **Document usage**
   - Only relevant for NUMBER type
   - Displayed alongside numeric value
   - Used in product display and filtering
   - Important for measurements and specifications

4. **Consider validation**
   - Application-level validation: required if type=NUMBER
   - Not enforced at database level
   - Serializer/form validation checks type

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 20 | Short unit labels |
| **blank** | True | Optional (type-specific) |
| **null** | True | Allow NULL |
| **db_index** | False | Not frequently searched |

### Common Units by Measurement

| Measurement | Units |
|-------------|-------|
| **Weight** | g, kg, lbs, oz, ton |
| **Length** | mm, cm, m, inches, feet |
| **Volume** | mL, L, gal, fl oz |
| **Storage** | GB, TB, MB, KB |
| **Power** | W, kW, mAh, V, A |
| **Speed** | km/h, mph, Mbps, GHz |
| **Temperature** | °C, °F, K |
| **Currency** | LKR, USD, EUR, GBP |
| **Percentage** | % |
| **Time** | seconds, minutes, hours, days, months, years |

### Sri Lankan Context

**Local Units:**
- Weight: kg, g (metric system)
- Currency: LKR (₨)
- Length: cm, m (metric system)
- Volume: mL, L (metric system)

**Display Examples:**
- Weight: "2.5 kg"
- Price: "45,000 LKR"
- Screen Size: "6.5 inches"
- Battery: "5000 mAh"
- Storage: "256 GB"

### Usage in Product Display

```
Brand: Samsung (TEXT, no unit)
Weight: 180 g
Screen Size: 6.5 inches
Battery: 5000 mAh
Storage: 256 GB
RAM: 8 GB
Price: 125,000 LKR
```

### Validation Logic

```python
# In serializer or clean method
if attribute.attribute_type == 'number' and not attribute.unit:
    raise ValidationError("Unit is required for NUMBER type attributes")
```

### Expected Outcome
```python
class Attribute(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    group = models.ForeignKey(...)
    attribute_type = models.CharField(...)
    unit = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Unit of measure (e.g., kg, cm, GB, LKR) - for NUMBER type"
    )
```

### Verification Checklist
- [ ] unit field added
- [ ] CharField with max_length=20
- [ ] blank=True and null=True
- [ ] help_text with examples
- [ ] No db_index (not searched)

---

## Task 36: Add is_required Field

### Overview
Add a boolean field to mark whether the attribute is required when creating products.

### Dependencies
- Task 35: Add unit Field

### Instructions

1. **Add is_required field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: False (optional by default)
   - Verbose name: "Is Required"

2. **Configure field properties**
   - Set db_index=True for filtering required attributes
   - Add help text explaining usage
   - Default to False for flexibility

3. **Document required behavior**
   - Required attributes must have values when creating products
   - Validation enforced in product forms/serializers
   - Can make attributes required per category assignment

4. **Consider use cases**
   - Core attributes: SKU, Name (required)
   - Optional attributes: Additional specs
   - Category-specific requirements

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | False | Optional by default |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | True | Frequently filtered |

### Required vs Optional Examples

**Required Attributes:**
- SKU (TEXT, required)
- Product Name (TEXT, required)
- Price (NUMBER, LKR, required)
- Category (SELECT, required)
- In Stock (BOOLEAN, required)

**Optional Attributes:**
- Brand (TEXT, optional)
- Weight (NUMBER, kg, optional)
- Color (SELECT, optional)
- Features (MULTISELECT, optional)
- Warranty Period (NUMBER, years, optional)

### Category-Specific Requirements

**Electronics:**
- Required: Brand, Model, Price
- Optional: Weight, Dimensions, Color

**Clothing:**
- Required: Size, Color, Price
- Optional: Material, Pattern, Brand

**Food:**
- Required: Weight, Price, Expiry Date
- Optional: Brand, Ingredients, Allergens

### Validation Usage

```python
# In product serializer
for attr in category.attributes.filter(is_required=True):
    if attr.slug not in product_data['attributes']:
        raise ValidationError(f"{attr.name} is required")
```

### Admin Interface

- Filter by required/optional
- Visual indicator (icon) for required attributes
- Warning when removing required attributes
- Bulk update required status

### Expected Outcome
```python
class Attribute(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    group = models.ForeignKey(...)
    attribute_type = models.CharField(...)
    unit = models.CharField(...)
    is_required = models.BooleanField(
        default=False,
        help_text="Whether this attribute must have a value"
    )
```

### Verification Checklist
- [ ] is_required field added
- [ ] BooleanField type
- [ ] default=False set
- [ ] help_text provided
- [ ] db_index configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create attribute.py File | Model file created |
| 30 | Define Attribute Class | Class inheriting from BaseModel |
| 31 | Add name Field | Attribute name field |
| 32 | Add slug Field | URL-friendly identifier |
| 33 | Add group Field | ForeignKey to AttributeGroup |
| 34 | Add attribute_type Field | Type choice field |
| 35 | Add unit Field | Unit of measure |
| 36 | Add is_required Field | Required flag |

### Attribute Model Structure (So Far)
```python
from ..constants import ATTRIBUTE_TYPES

class Attribute(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True)
    group = models.ForeignKey(
        AttributeGroup,
        on_delete=models.SET_NULL,
        related_name='attributes',
        blank=True,
        null=True
    )
    attribute_type = models.CharField(
        max_length=20,
        choices=ATTRIBUTE_TYPES
    )
    unit = models.CharField(max_length=20, blank=True, null=True)
    is_required = models.BooleanField(default=False)
    
    # More fields to be added in next document
    # - Display flags (is_filterable, is_searchable, etc.)
    # - Validation fields (regex, min/max values)
    # - Category M2M relationship
```

### Field Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| name | CharField(100) | Yes | Attribute display name |
| slug | SlugField(100) | Yes (auto) | URL identifier |
| group | ForeignKey | No | Organizational grouping |
| attribute_type | CharField(20) | Yes | Type (TEXT, NUMBER, etc.) |
| unit | CharField(20) | No | Unit of measure |
| is_required | BooleanField | Yes (False) | Required flag |

### Next Steps
1. Proceed to [02_Tasks-37-42_Display-Validation-Fields.md](02_Tasks-37-42_Display-Validation-Fields.md)
2. Add display flags (filterable, searchable, comparable, visible)
3. Add validation fields (regex, min_value, max_value)
4. Complete attribute configuration

---

## Notes for AI Agents

1. **Type Field:** Uses choices from constants.ATTRIBUTE_TYPES
2. **Group Optional:** Attributes can exist without group
3. **Unit Usage:** Only relevant for NUMBER type
4. **Required Flag:** Enforced at application level, not database
5. **Slug Auto-Generation:** Implement in save() method
6. **Multi-Tenant:** All data in tenant schemas
7. **No Code:** Instructions only
