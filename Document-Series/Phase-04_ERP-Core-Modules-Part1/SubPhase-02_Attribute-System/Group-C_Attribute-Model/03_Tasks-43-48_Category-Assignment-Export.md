# Tasks 43-48: Category Assignment & Export

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** C - Attribute Model  
> **Document:** 03 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-37-42_Display-Validation-Fields.md](02_Tasks-37-42_Display-Validation-Fields.md)
- **→ Next Group:** [../Group-D_AttributeOption-Model/](../Group-D_AttributeOption-Model/)

---

## Document Overview

This document covers completing the Attribute model with validation fields for NUMBER type, the categories ManyToMany relationship for category assignment, and model finalization with Meta class, __str__ method, export, and migration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Add min_value Field | Low |
| 44 | Add max_value Field | Low |
| 45 | Add categories Field | High |
| 46 | Add __str__ Method | Low |
| 47 | Export Attribute | Low |
| 48 | Create Attribute Migration | Low |

---

## Task 43: Add min_value Field

### Overview
Add an optional min_value field to validate minimum values for NUMBER type attributes.

### Dependencies
- Task 42: Add validation_regex Field

### Instructions

1. **Add min_value field**
   - Type: DecimalField
   - Max digits: 20, decimal places: 4
   - Required: No (blank=True, null=True)
   - Verbose name: "Minimum Value"

2. **Configure field properties**
   - Optional field (only for NUMBER type)
   - Add help text with examples
   - High precision for various measurements

3. **Document usage**
   - Only relevant for NUMBER type attributes
   - Validates product attribute values
   - Enforced in serializers/forms
   - Examples: Weight >= 0, Rating >= 0, Price >= 0

4. **Consider validation logic**
   - If set, attribute value must be >= min_value
   - Application-level validation
   - Can be null (no minimum)

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_digits** | 20 | Accommodate large numbers |
| **decimal_places** | 4 | High precision |
| **blank** | True | Optional (type-specific) |
| **null** | True | Allow NULL (no minimum) |
| **db_index** | False | Not frequently searched |

### Common Minimum Values

| Attribute | Min Value | Unit |
|-----------|-----------|------|
| Weight | 0 | kg/g |
| Length | 0 | cm/m |
| Price | 0 | LKR |
| Rating | 0 | (0-5 scale) |
| Discount | 0 | % |
| Age Requirement | 0 | years |
| Stock Quantity | 0 | units |
| Battery Capacity | 0 | mAh |

### Validation Examples

**Weight (kg):**
```
min_value: 0
max_value: null (no maximum)
Valid: 0, 0.5, 2.5, 10.0
Invalid: -1, -0.5
```

**Rating (0-5):**
```
min_value: 0
max_value: 5
Valid: 0, 2.5, 5
Invalid: -1, 6
```

**Discount Percentage:**
```
min_value: 0
max_value: 100
Valid: 0, 10, 50, 100
Invalid: -10, 150
```

**Temperature (°C):**
```
min_value: -50
max_value: 150
Valid: -50, 0, 25, 150
Invalid: -51, 151
```

### Validation Implementation

```python
# In serializer or validator
if attribute.attribute_type == 'number':
    if attribute.min_value is not None and value < attribute.min_value:
        raise ValidationError(
            f"{attribute.name} must be at least {attribute.min_value} {attribute.unit}"
        )
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    min_value = models.DecimalField(
        max_digits=20,
        decimal_places=4,
        blank=True,
        null=True,
        help_text="Minimum allowed value for NUMBER attributes"
    )
```

### Verification Checklist
- [ ] min_value field added
- [ ] DecimalField with max_digits=20, decimal_places=4
- [ ] blank=True and null=True
- [ ] help_text provided
- [ ] No db_index needed

---

## Task 44: Add max_value Field

### Overview
Add an optional max_value field to validate maximum values for NUMBER type attributes.

### Dependencies
- Task 43: Add min_value Field

### Instructions

1. **Add max_value field**
   - Type: DecimalField
   - Max digits: 20, decimal places: 4
   - Required: No (blank=True, null=True)
   - Verbose name: "Maximum Value"

2. **Configure field properties**
   - Optional field (only for NUMBER type)
   - Add help text with examples
   - Same precision as min_value

3. **Document usage**
   - Only relevant for NUMBER type attributes
   - Validates product attribute values
   - Can combine with min_value for range
   - Examples: Rating <= 5, Discount <= 100

4. **Consider range validation**
   - Use both min and max for valid range
   - Either can be null (unbounded)
   - Ensure max >= min if both set

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_digits** | 20 | Match min_value |
| **decimal_places** | 4 | Match min_value |
| **blank** | True | Optional |
| **null** | True | Allow NULL (no maximum) |
| **db_index** | False | Not searched |

### Range Validation Examples

**Rating (0-5):**
```
min_value: 0
max_value: 5
Valid: 0, 2.5, 5
Invalid: -1, 6
```

**Discount (0-100%):**
```
min_value: 0
max_value: 100
Valid: 0, 50, 100
Invalid: -10, 150
```

**Age Requirement (0-120):**
```
min_value: 0
max_value: 120
Valid: 0, 18, 65, 120
Invalid: -5, 150
```

**Weight (unlimited):**
```
min_value: 0
max_value: null
Valid: 0, 100, 1000, 10000
Invalid: -1
```

### Validation Implementation

```python
# In serializer or validator
if attribute.attribute_type == 'number':
    if attribute.max_value is not None and value > attribute.max_value:
        raise ValidationError(
            f"{attribute.name} must be at most {attribute.max_value} {attribute.unit}"
        )
    
    # Range validation
    if attribute.min_value is not None and attribute.max_value is not None:
        if not (attribute.min_value <= value <= attribute.max_value):
            raise ValidationError(
                f"{attribute.name} must be between {attribute.min_value} "
                f"and {attribute.max_value} {attribute.unit}"
            )
```

### Model-Level Validation

```python
# In model clean() method
def clean(self):
    super().clean()
    if self.attribute_type == 'number':
        if (self.min_value is not None and 
            self.max_value is not None and 
            self.min_value > self.max_value):
            raise ValidationError(
                "Minimum value cannot be greater than maximum value"
            )
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    max_value = models.DecimalField(
        max_digits=20,
        decimal_places=4,
        blank=True,
        null=True,
        help_text="Maximum allowed value for NUMBER attributes"
    )
```

### Verification Checklist
- [ ] max_value field added
- [ ] DecimalField with max_digits=20, decimal_places=4
- [ ] blank=True and null=True
- [ ] help_text provided
- [ ] No db_index needed

---

## Task 45: Add categories Field

### Overview
Add a ManyToManyField to assign attributes to product categories, enabling category-specific attribute sets.

### Dependencies
- Task 44: Add max_value Field

### Instructions

1. **Add categories ManyToMany field**
   - Type: ManyToManyField to Category model
   - Related name: 'attributes'
   - Required: No (blank=True)
   - No through model needed initially

2. **Configure relationship**
   - Import Category from categories app
   - Set related_name for reverse lookup
   - Allow blank (attributes can exist without categories initially)

3. **Document category assignment**
   - Attributes assigned to specific categories
   - Products inherit category's attributes
   - Child categories inherit parent's attributes
   - Enables category-specific product forms

4. **Consider inheritance**
   - Category hierarchy: Electronics > Smartphones > Android Phones
   - Child categories inherit parent attributes
   - Can add category-specific attributes
   - Supports flexible product schemas

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **to** | 'categories.Category' | Model reference |
| **related_name** | 'attributes' | Reverse lookup |
| **blank** | True | Optional assignment |
| **db_table** | Auto-generated | M2M join table |

### Category-Attribute Relationships

**Electronics Category:**
- Brand (TEXT)
- Price (NUMBER, LKR)
- Warranty (NUMBER, years)

**Smartphones Subcategory (inherits Electronics):**
- Screen Size (NUMBER, inches)
- RAM (NUMBER, GB)
- Storage (NUMBER, GB)
- Battery (NUMBER, mAh)

**Clothing Category:**
- Size (SELECT)
- Color (SELECT)
- Material (TEXT)
- Care Instructions (TEXT)

**T-Shirts Subcategory (inherits Clothing):**
- Fit Type (SELECT: Regular, Slim, Oversized)
- Sleeve Length (SELECT: Short, Long)
- Neckline (SELECT: Round, V-Neck, Collar)

### Attribute Inheritance Example

```
Electronics (Category)
├── Brand, Price, Warranty
│
├── Smartphones (Subcategory)
│   ├── Inherits: Brand, Price, Warranty
│   ├── Adds: Screen Size, RAM, Storage, Battery
│   │
│   └── Android Phones (Sub-subcategory)
│       ├── Inherits: All from Smartphones + Electronics
│       └── Adds: Android Version
```

### Related Name Usage

```python
# Get all attributes for a category
category = Category.objects.get(slug='smartphones')
attributes = category.attributes.all()

# Get attributes including inherited from parents
def get_category_attributes_with_inheritance(category):
    attributes = set()
    current = category
    while current:
        attributes.update(current.attributes.all())
        current = current.parent
    return list(attributes)

# Get filterable attributes for category
filterable_attrs = category.attributes.filter(is_filterable=True)
```

### Product Form Generation

```python
# Generate product form fields based on category
def generate_product_form(category):
    fields = {}
    for attr in get_category_attributes_with_inheritance(category):
        if attr.is_required:
            fields[attr.slug] = {
                'required': True,
                'type': attr.attribute_type,
                'label': attr.name,
                'help_text': attr.description
            }
    return fields
```

### Database Schema

**M2M Join Table (auto-generated):**
```
attributes_attribute_categories
- id
- attribute_id (FK to attributes_attribute)
- category_id (FK to categories_category)
- unique_together(attribute_id, category_id)
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    categories = models.ManyToManyField(
        'categories.Category',
        related_name='attributes',
        blank=True,
        help_text="Categories this attribute applies to"
    )
```

### Verification Checklist
- [ ] categories field added
- [ ] ManyToManyField to 'categories.Category'
- [ ] related_name='attributes'
- [ ] blank=True
- [ ] help_text provided

---

## Task 46: Add __str__ Method

### Overview
Add the __str__ method to provide human-readable string representation of Attribute instances.

### Dependencies
- Task 45: Add categories Field

### Instructions

1. **Define __str__ method**
   - Return the attribute name
   - Simple and clear representation
   - Used in admin and logs

2. **Optional enhancements**
   - Could include type: "Weight (NUMBER)"
   - Could include group: "Weight (Dimensions)"
   - Keep simple for now

3. **Add Meta class**
   - Set ordering: ['group__display_order', 'display_order', 'name']
   - Set verbose names
   - Add unique_together for (slug,) within tenant

4. **Document string usage**
   - Admin list views
   - ForeignKey dropdowns
   - Shell/debugging
   - Log messages

### String Representation

**Simple (Recommended):**
```python
def __str__(self):
    return self.name
```

**With Type:**
```python
def __str__(self):
    return f"{self.name} ({self.get_attribute_type_display()})"
```

**With Group:**
```python
def __str__(self):
    if self.group:
        return f"{self.group.name}: {self.name}"
    return self.name
```

### Meta Class Configuration

```python
class Meta:
    ordering = ['group__display_order', 'display_order', 'name']
    verbose_name = 'Attribute'
    verbose_name_plural = 'Attributes'
    indexes = [
        models.Index(fields=['attribute_type']),
        models.Index(fields=['is_filterable']),
    ]
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... all fields ...
    
    class Meta:
        ordering = ['group__display_order', 'display_order', 'name']
        verbose_name = 'Attribute'
        verbose_name_plural = 'Attributes'
    
    def __str__(self):
        return self.name
```

### Verification Checklist
- [ ] __str__ method defined
- [ ] Returns self.name
- [ ] Meta class added
- [ ] ordering configured
- [ ] verbose names set

---

## Task 47: Export Attribute

### Overview
Export the Attribute model from the models module for easy importing.

### Dependencies
- Task 46: Add __str__ Method

### Instructions

1. **Open models/__init__.py**
   - Edit `backend/apps/attributes/models/__init__.py`

2. **Import Attribute**
   - Add: `from .attribute import Attribute`

3. **Update __all__**
   - Add 'Attribute' to __all__ list
   - Keep alphabetical order

4. **Verify import pattern**
   - Enables: `from apps.attributes.models import Attribute, AttributeGroup`

### Export Pattern

```python
# backend/apps/attributes/models/__init__.py

from .attribute_group import AttributeGroup
from .attribute import Attribute

__all__ = [
    'AttributeGroup',
    'Attribute',
]
```

### Expected Outcome
```
backend/apps/attributes/models/
├── __init__.py              # Updated with Attribute export
├── attribute_group.py
└── attribute.py
```

### Verification Checklist
- [ ] models/__init__.py updated
- [ ] Attribute imported from .attribute
- [ ] __all__ includes 'Attribute'
- [ ] Import works correctly

---

## Task 48: Create Attribute Migration

### Overview
Generate database migration for the Attribute model and its M2M relationship.

### Dependencies
- Task 47: Export Attribute

### Instructions

1. **Run makemigrations command**
   - Execute: `python manage.py makemigrations attributes`
   - Django generates migration file
   - Includes Attribute table and M2M join table

2. **Review migration file**
   - Verify all fields present
   - Check M2M table creation
   - Confirm indexes and constraints

3. **Migration file naming**
   - Format: `0002_attribute.py` (or next number)
   - Descriptive name from Django

4. **Do not run migration yet**
   - Wait until all models complete
   - Run all migrations together

5. **Verify migration contents**
   - Attribute model with all fields
   - M2M table for categories
   - Proper dependencies

### Migration Structure

```python
# attributes/migrations/0002_attribute.py
class Migration(migrations.Migration):
    dependencies = [
        ('attributes', '0001_initial'),
        ('categories', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='Attribute',
            fields=[
                # All Attribute fields
            ],
        ),
        migrations.CreateModel(
            name='Attribute_categories',
            fields=[
                # M2M join table
            ],
        ),
    ]
```

### Expected Outcome
```
backend/apps/attributes/migrations/
├── __init__.py
├── 0001_initial.py          # AttributeGroup
└── 0002_attribute.py        # Attribute (new)
```

### Verification Checklist
- [ ] Migration file generated
- [ ] All Attribute fields present
- [ ] M2M table included
- [ ] Dependencies correct
- [ ] Migration NOT run yet

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 43 | Add min_value Field | Minimum validation for NUMBER |
| 44 | Add max_value Field | Maximum validation for NUMBER |
| 45 | Add categories Field | Category M2M assignment |
| 46 | Add __str__ Method | String representation + Meta |
| 47 | Export Attribute | Model export from package |
| 48 | Create Attribute Migration | Database migration file |

### Complete Attribute Model
```python
from ..constants import ATTRIBUTE_TYPES

class Attribute(BaseModel):
    # Identification
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True)
    
    # Organization
    group = models.ForeignKey(AttributeGroup, on_delete=models.SET_NULL, related_name='attributes', blank=True, null=True)
    
    # Type & Configuration
    attribute_type = models.CharField(max_length=20, choices=ATTRIBUTE_TYPES)
    unit = models.CharField(max_length=20, blank=True, null=True)
    is_required = models.BooleanField(default=False)
    
    # Display Flags
    is_filterable = models.BooleanField(default=False)
    is_searchable = models.BooleanField(default=False)
    is_comparable = models.BooleanField(default=False)
    is_visible_on_product = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    # Validation
    validation_regex = models.CharField(max_length=255, blank=True, null=True)
    min_value = models.DecimalField(max_digits=20, decimal_places=4, blank=True, null=True)
    max_value = models.DecimalField(max_digits=20, decimal_places=4, blank=True, null=True)
    
    # Category Assignment
    categories = models.ManyToManyField('categories.Category', related_name='attributes', blank=True)
    
    class Meta:
        ordering = ['group__display_order', 'display_order', 'name']
        verbose_name = 'Attribute'
        verbose_name_plural = 'Attributes'
    
    def __str__(self):
        return self.name
```

### Group C Complete

All 20 tasks in Group C are now complete (Tasks 29-48):
- ✅ Attribute model created with all fields
- ✅ Type-based validation (regex, min/max)
- ✅ Display control flags
- ✅ Category M2M assignment
- ✅ Meta class configuration
- ✅ Model exported
- ✅ Migration generated

### File Structure
```
backend/apps/attributes/
├── models/
│   ├── __init__.py          # Exports Attribute, AttributeGroup
│   ├── attribute_group.py
│   └── attribute.py         # Complete model
└── migrations/
    ├── 0001_initial.py
    └── 0002_attribute.py    # Generated
```

### Next Steps
1. Proceed to [../Group-D_AttributeOption-Model/](../Group-D_AttributeOption-Model/)
2. Create AttributeOption model for SELECT/MULTISELECT types
3. Complete attribute system models

---

## Notes for AI Agents

1. **Range Validation:** min/max only for NUMBER type
2. **Category Inheritance:** Child categories inherit parent attributes
3. **M2M Relationship:** Flexible category assignment
4. **Type-Specific Fields:** Some fields only relevant for specific types
5. **Multi-Tenant:** All data in tenant schemas
6. **Migration:** Generated but not run yet
7. **No Code:** Instructions only
