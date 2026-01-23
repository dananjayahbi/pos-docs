# Tasks 15-22: AttributeGroup Model & Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** B - AttributeGroup Model  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Attributes-App-Setup/](../Group-A_Attributes-App-Setup/)
- **→ Next Document:** [02_Tasks-23-28_Manager-Migration-Export.md](02_Tasks-23-28_Manager-Migration-Export.md)

---

## Document Overview

This document covers the creation of the AttributeGroup model which organizes related attributes into logical groups for better organization and display in the UI. Attribute groups help categorize product specifications (e.g., "Dimensions", "Technical Specifications", "Materials").

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create attribute_group.py File | Low |
| 16 | Define AttributeGroup Class | Medium |
| 17 | Add name Field | Low |
| 18 | Add slug Field | Low |
| 19 | Add description Field | Low |
| 20 | Add display_order Field | Low |
| 21 | Add is_active Field | Low |
| 22 | Add __str__ Method | Low |

---

## Task 15: Create attribute_group.py File

### Overview
Create a dedicated model file for the AttributeGroup model within the models module.

### Dependencies
- Group A Task 07: Create models __init__.py

### Instructions

1. **Create attribute_group.py file**
   - Create file named `attribute_group.py` in `backend/apps/attributes/models/`
   - Follow snake_case naming convention for model files

2. **Add module docstring**
   - Document purpose: "AttributeGroup model for organizing related attributes"
   - Explain that groups help categorize attributes in UI

3. **Import required modules**
   - Import Django models module
   - Import BaseModel from core app
   - Import timezone utilities if needed

4. **Prepare file structure**
   - Module docstring at top
   - Imports section
   - Model class definition
   - Manager/QuerySet classes (if needed)

### File Organization Pattern

| Section | Purpose |
|---------|---------|
| **Module Docstring** | File purpose and overview |
| **Imports** | Django and project imports |
| **QuerySet Class** | Custom query methods (optional) |
| **Manager Class** | Custom manager (optional) |
| **Model Class** | Main model definition |

### Expected Outcome
```
backend/apps/attributes/models/
├── __init__.py
└── attribute_group.py       # New file
```

### Verification Checklist
- [ ] File created at correct path
- [ ] Module docstring present
- [ ] Required imports included
- [ ] File is valid Python (no syntax errors)

---

## Task 16: Define AttributeGroup Class

### Overview
Define the AttributeGroup model class that inherits from BaseModel to provide common fields and functionality.

### Dependencies
- Task 15: Create attribute_group.py File

### Instructions

1. **Create AttributeGroup class**
   - Define class named `AttributeGroup`
   - Inherit from `BaseModel` (from apps.core.models)
   - Add class docstring explaining purpose

2. **Understand inheritance from BaseModel**
   - Inherits common fields: id, created_at, updated_at, created_by, updated_by
   - Inherits tenant isolation behavior
   - Inherits soft delete functionality (if implemented)

3. **Plan model fields**
   - name: Group name (e.g., "Dimensions", "Technical Specs")
   - slug: URL-friendly identifier
   - description: Optional group description
   - display_order: Custom sort order
   - is_active: Active/inactive status

4. **Add class docstring**
   - Explain that AttributeGroup organizes related attributes
   - Provide example groups: Dimensions, Technical Specifications
   - Note multi-tenant context

### AttributeGroup Purpose

| Aspect | Details |
|--------|---------|
| **Organization** | Groups related attributes logically |
| **UI Display** | Sections in product forms and details |
| **Navigation** | Collapsible sections in admin/frontend |
| **Customization** | Tenant-specific attribute organization |

### Business Use Cases

**Product Category: Electronics**
- Technical Specifications: Processor, RAM, Storage
- Display: Screen Size, Resolution, Type
- Connectivity: WiFi, Bluetooth, Ports
- Dimensions: Height, Width, Depth, Weight

**Product Category: Clothing**
- Size & Fit: Size, Fit Type, Length
- Materials: Fabric Composition, Care Instructions
- Style: Color, Pattern, Sleeve Type
- Dimensions: Chest, Waist, Hip, Inseam

**Product Category: Food**
- Nutritional Information: Calories, Protein, Fat
- Ingredients: Main Ingredients, Allergens
- Storage: Storage Instructions, Temperature
- Packaging: Package Size, Units per Package

### Multi-Tenant Considerations

- Each tenant defines their own attribute groups
- Groups stored in tenant schema
- No cross-tenant visibility
- Groups can have same names across tenants (different records)

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    """
    Model for organizing related attributes into logical groups.
    
    Examples: Dimensions, Technical Specifications, Materials
    """
    # Fields will be added in subsequent tasks
    pass
```

### Verification Checklist
- [ ] AttributeGroup class defined
- [ ] Inherits from BaseModel
- [ ] Class docstring present
- [ ] Class name uses PascalCase

---

## Task 17: Add name Field

### Overview
Add the name field to store the attribute group's display name.

### Dependencies
- Task 16: Define AttributeGroup Class

### Instructions

1. **Add name field**
   - Type: CharField
   - Max length: 100 characters
   - Required: Yes (blank=False, null=False)
   - Verbose name: "Group Name"

2. **Configure field properties**
   - Set db_index=True for query performance
   - Add help text explaining purpose
   - Examples: "Dimensions", "Technical Specifications"

3. **Add validation considerations**
   - Name should be unique within tenant (handled by Meta)
   - Trimmed whitespace (handled by form/serializer)
   - Non-empty string required

4. **Document multi-language support**
   - Store in English or tenant's primary language
   - Translation handled at presentation layer
   - Consider future i18n integration

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 100 | Sufficient for group names |
| **blank** | False | Name is required |
| **null** | False | Database-level constraint |
| **db_index** | True | Frequently queried |
| **unique** | False | Handled in Meta with tenant |

### Name Examples

| Category | Group Names |
|----------|-------------|
| **Electronics** | Technical Specs, Display, Battery, Connectivity |
| **Clothing** | Size & Fit, Materials, Style, Care Instructions |
| **Furniture** | Dimensions, Materials, Features, Assembly |
| **Food** | Nutritional Info, Ingredients, Allergens, Storage |
| **Books** | Publication Details, Dimensions, Formats |

### Sri Lanka Context

English group names are standard, but could include:
- දත්ත විස්තර (Data Details)
- තාක්ෂණික තොරතුරු (Technical Information)
- මිනුම් (Measurements)

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    name = models.CharField(
        max_length=100,
        help_text="Name of the attribute group"
    )
```

### Verification Checklist
- [ ] name field added
- [ ] CharField with max_length=100
- [ ] blank=False and null=False (or omitted as default)
- [ ] help_text provided
- [ ] db_index configured

---

## Task 18: Add slug Field

### Overview
Add a slug field for URL-friendly group identifiers used in API endpoints and frontend routing.

### Dependencies
- Task 17: Add name Field

### Instructions

1. **Add slug field**
   - Type: SlugField
   - Max length: 100 characters
   - Required: Yes (blank=True for auto-generation, null=False)
   - Auto-populate from name

2. **Configure slug properties**
   - Set blank=True to allow auto-generation
   - Add db_index=True for lookup performance
   - Set help_text explaining auto-generation

3. **Plan slug generation**
   - Auto-generate from name in save() method or signal
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Ensure uniqueness within tenant

4. **Document slug usage**
   - Used in API URLs: `/api/attributes/groups/{slug}/`
   - Used in frontend routing
   - Ensures URL stability even if name changes

### Slug Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 100 | Match name field |
| **blank** | True | Allow auto-generation |
| **null** | False | Always populated |
| **db_index** | True | URL lookups |
| **unique** | False | Handled in Meta with tenant |

### Slug Generation Examples

| Name | Generated Slug |
|------|----------------|
| Technical Specifications | `technical-specifications` |
| Dimensions & Weight | `dimensions-weight` |
| Size & Fit | `size-fit` |
| Nutritional Information | `nutritional-information` |
| Display & Screen | `display-screen` |

### Slug Usage in API

```
GET /api/attributes/groups/
GET /api/attributes/groups/technical-specifications/
GET /api/attributes/?group=dimensions-weight
```

### Multi-Tenant Slug Handling

- Slugs must be unique within tenant
- Different tenants can have same slug (different records)
- Slug generation in save() method checks tenant scope
- Use unique_together constraint: (tenant_schema, slug)

### Expected Outcome
```python
class AttributeGroup(BaseModel):
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
- [ ] null=False (default)
- [ ] db_index configured
- [ ] help_text mentions auto-generation

---

## Task 19: Add description Field

### Overview
Add an optional description field to provide additional context about the attribute group's purpose.

### Dependencies
- Task 18: Add slug Field

### Instructions

1. **Add description field**
   - Type: TextField
   - Required: No (blank=True, null=True)
   - Verbose name: "Description"

2. **Configure field properties**
   - Allow empty values (optional field)
   - Add help text explaining usage
   - Support multi-line text

3. **Document usage**
   - Displayed in admin interface
   - Shown as help text in product forms
   - Can include instructions for data entry
   - Optional tooltip in webstore

4. **Consider rich text support**
   - Plain text for now
   - Future: Support markdown or HTML
   - Frontend renders with formatting

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **blank** | True | Optional field |
| **null** | True | Allow database NULL |
| **db_index** | False | Not frequently searched |
| **help_text** | Provided | Explain purpose |

### Description Use Cases

**Technical Specifications:**
> "Technical details about the product's hardware and software capabilities. Include processor, memory, storage, and other technical attributes."

**Dimensions & Weight:**
> "Physical measurements and weight of the product. Useful for shipping calculations and space planning."

**Materials & Construction:**
> "Information about materials used and construction methods. Important for durability and care instructions."

**Nutritional Information:**
> "Nutrition facts per serving. Required for food products as per Sri Lankan food labeling regulations."

### Admin Interface Usage

- Shown below group name in admin
- Helps staff understand what attributes belong in group
- Guides consistent data entry
- Reduces training time for new staff

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of this attribute group"
    )
```

### Verification Checklist
- [ ] description field added
- [ ] TextField type
- [ ] blank=True and null=True
- [ ] help_text provided
- [ ] No db_index (not searched)

---

## Task 20: Add display_order Field

### Overview
Add a display_order field to control the sort order of attribute groups in UI displays.

### Dependencies
- Task 19: Add description Field

### Instructions

1. **Add display_order field**
   - Type: PositiveIntegerField
   - Required: Yes with default value
   - Default: 0
   - Verbose name: "Display Order"

2. **Configure ordering behavior**
   - Lower numbers appear first
   - Same numbers sort alphabetically by name
   - Add db_index for efficient sorting

3. **Document ordering strategy**
   - 0-9: Critical/primary groups
   - 10-49: Important groups
   - 50-99: Standard groups
   - 100+: Less important groups

4. **Usage in queries**
   - Order by display_order, then name
   - Allow admin users to customize order
   - Respect order in API responses and UI

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | 0 | Default ordering |
| **blank** | False | Always has value |
| **null** | False | Required field |
| **db_index** | True | Frequent ordering |

### Display Order Strategy

| Order Range | Priority | Example Groups |
|-------------|----------|----------------|
| **0-9** | Critical | Key Specifications, Overview |
| **10-29** | High | Technical Specs, Dimensions |
| **30-49** | Medium | Features, Materials |
| **50-69** | Standard | Additional Info, Packaging |
| **70-99** | Low | Regulatory, Certifications |
| **100+** | Supplemental | Internal Use, Historical Data |

### Ordering Examples

**Electronics Product:**
1. (Order 0) Overview - Main features
2. (Order 10) Technical Specifications
3. (Order 20) Display
4. (Order 30) Connectivity
5. (Order 40) Dimensions & Weight
6. (Order 50) Package Contents

**Clothing Product:**
1. (Order 0) Size & Fit
2. (Order 10) Materials & Care
3. (Order 20) Style Details
4. (Order 30) Dimensions
5. (Order 40) Sustainability

### QuerySet Ordering

```python
# Groups ordered by display_order, then name
AttributeGroup.objects.filter(is_active=True).order_by('display_order', 'name')
```

### Admin Interface

- Drag-and-drop reordering in admin (future enhancement)
- Manual number entry for precise control
- Preview of group order in list view

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    description = models.TextField(...)
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in which groups are displayed (lower first)"
    )
```

### Verification Checklist
- [ ] display_order field added
- [ ] PositiveIntegerField type
- [ ] default=0 set
- [ ] help_text explains ordering
- [ ] db_index configured

---

## Task 21: Add is_active Field

### Overview
Add an is_active boolean field to control visibility of attribute groups without deletion.

### Dependencies
- Task 20: Add display_order Field

### Instructions

1. **Add is_active field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: True
   - Verbose name: "Is Active"

2. **Configure field properties**
   - Set db_index=True for filtering active groups
   - Add help text explaining purpose
   - Default to True for new groups

3. **Document inactive behavior**
   - Inactive groups hidden in UI
   - Existing attribute assignments preserved
   - Can be reactivated without data loss
   - Admin can still view/edit inactive groups

4. **Query implications**
   - Filter by is_active=True in most queries
   - Custom manager method for active groups
   - API endpoints filter active by default

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | True | New groups active by default |
| **blank** | False | Required field |
| **null** | False | Always has boolean value |
| **db_index** | True | Frequently filtered |

### Active vs Inactive Usage

| Status | UI Behavior | API Behavior | Admin Behavior |
|--------|-------------|--------------|----------------|
| **Active** | Visible | Returned | Editable |
| **Inactive** | Hidden | Filtered out | Viewable/Editable |

### Use Cases for Deactivation

**Seasonal Products:**
- Deactivate "Summer Features" group in winter
- Reactivate when seasonal products return

**Product Category Changes:**
- Deactivate groups no longer relevant
- Preserve historical data
- Avoid breaking existing products

**Phased Rollout:**
- Create groups in advance
- Mark inactive until ready
- Activate when staff trained

**Business Rules:**
- Deprecate old specification standards
- Maintain compliance with historical data
- Support data migration scenarios

### Query Patterns

```python
# Get active groups only
AttributeGroup.objects.filter(is_active=True)

# Include inactive for admin
AttributeGroup.objects.all()

# Custom manager method
AttributeGroup.objects.active()  # Returns only active
```

### Admin Interface

- Filter by active/inactive status
- Bulk activation/deactivation actions
- Visual indicator (icon or color) for inactive groups
- Warning when deactivating groups with attributes

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    description = models.TextField(...)
    display_order = models.PositiveIntegerField(...)
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this group is active and visible"
    )
```

### Verification Checklist
- [ ] is_active field added
- [ ] BooleanField type
- [ ] default=True set
- [ ] help_text provided
- [ ] db_index configured

---

## Task 22: Add __str__ Method

### Overview
Add the __str__ method to provide a human-readable string representation of AttributeGroup instances.

### Dependencies
- Task 21: Add is_active Field

### Instructions

1. **Define __str__ method**
   - Return the group name
   - Simple and clear representation
   - Used in admin dropdowns and logs

2. **Method implementation**
   - Return self.name directly
   - No need for complex formatting
   - Ensure returns string type

3. **Document usage**
   - Shown in Django admin list views
   - Displayed in ForeignKey dropdowns
   - Used in shell/debugging
   - Appears in log messages

4. **Consider future enhancements**
   - Could include active status indicator
   - Could show attribute count
   - Keep simple for now

### String Representation Usage

| Context | Display |
|---------|---------|
| **Admin List** | "Technical Specifications" |
| **Dropdown** | "Dimensions" |
| **Shell** | `<AttributeGroup: Materials>` |
| **Logs** | "Modified group: Size & Fit" |

### Implementation Considerations

**Simple Approach (Recommended):**
```python
def __str__(self):
    return self.name
```

**Enhanced Approach (Optional):**
```python
def __str__(self):
    active_indicator = "" if self.is_active else " (Inactive)"
    return f"{self.name}{active_indicator}"
```

### Usage Examples

**Django Admin:**
- Attribute ForeignKey shows: "Technical Specifications"
- Group list shows clear group names
- Breadcrumbs show group name

**Django Shell:**
```python
>>> group = AttributeGroup.objects.first()
>>> print(group)
Technical Specifications
>>> str(group)
'Technical Specifications'
```

**Logging:**
```python
logger.info(f"Attribute group created: {group}")
# Output: Attribute group created: Technical Specifications
```

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    name = models.CharField(...)
    slug = models.SlugField(...)
    description = models.TextField(...)
    display_order = models.PositiveIntegerField(...)
    is_active = models.BooleanField(...)
    
    def __str__(self):
        return self.name
```

### Verification Checklist
- [ ] __str__ method defined
- [ ] Returns self.name
- [ ] Returns string type
- [ ] No complex logic (keep simple)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create attribute_group.py File | Model file created |
| 16 | Define AttributeGroup Class | Class inheriting from BaseModel |
| 17 | Add name Field | Group name field |
| 18 | Add slug Field | URL-friendly identifier |
| 19 | Add description Field | Optional group description |
| 20 | Add display_order Field | Custom sort order |
| 21 | Add is_active Field | Active/inactive status |
| 22 | Add __str__ Method | String representation |

### AttributeGroup Model Structure
```python
class AttributeGroup(BaseModel):
    # Fields
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True)
    description = models.TextField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Methods
    def __str__(self):
        return self.name
    
    # Inherited from BaseModel:
    # - id (UUID or BigAutoField)
    # - created_at
    # - updated_at
    # - created_by
    # - updated_by
```

### Field Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| name | CharField(100) | Yes | Group display name |
| slug | SlugField(100) | Yes (auto) | URL identifier |
| description | TextField | No | Optional description |
| display_order | PositiveIntegerField | Yes (0) | Sort order |
| is_active | BooleanField | Yes (True) | Visibility control |

### Next Steps
1. Proceed to [02_Tasks-23-28_Manager-Migration-Export.md](02_Tasks-23-28_Manager-Migration-Export.md)
2. Add Meta class for model configuration
3. Create custom manager with active() and with_attributes() methods
4. Export model from models/__init__.py
5. Generate and run migration

---

## Notes for AI Agents

1. **Inheritance:** All common fields inherited from BaseModel
2. **Tenant Isolation:** Model data stored in tenant schemas
3. **Slug Generation:** Implement in save() method or pre_save signal
4. **Ordering:** Always order by display_order, then name
5. **Active Filter:** Most queries should filter is_active=True
6. **String Method:** Keep simple, return name only
7. **No Code:** Instructions only, no actual code generation
