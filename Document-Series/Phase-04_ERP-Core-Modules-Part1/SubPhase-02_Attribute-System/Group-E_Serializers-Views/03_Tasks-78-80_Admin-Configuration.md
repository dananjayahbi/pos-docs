# Tasks 78-80: Admin Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** E - Serializers & Views  
> **Document:** 03 of 03  
> **Tasks Covered:** 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-70-77_ViewSets-URLs.md](02_Tasks-70-77_ViewSets-URLs.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers configuring Django admin interfaces for the attribute app with inline editing, filters, and search capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 78 | Create admin.py File | Low |
| 79 | Register AttributeGroup Admin | Medium |
| 80 | Register Attribute Admin | High |

---

## Task 78: Create admin.py File

### Overview
Create the admin module for attribute app to provide Django admin interfaces.

### Dependencies
- Task 77: Register Routes

### Instructions

1. **Create admin.py file**
   - Create: `backend/apps/attributes/admin.py`

2. **Import required modules**
   - Django admin
   - Models from current app

3. **Prepare admin structure**
   - Module docstring
   - Imports
   - Admin classes
   - Model registrations

### Expected Outcome

```python
from django.contrib import admin
from .models import AttributeGroup, Attribute, AttributeOption

# Admin classes will be defined in next tasks
```

### Verification Checklist
- [ ] admin.py created
- [ ] Required imports added
- [ ] Valid Python syntax

---

## Task 79: Register AttributeGroup Admin

### Overview
Create and register admin interface for AttributeGroup with list display, search, and filters.

### Dependencies
- Task 78: Create admin.py File

### Instructions

1. **Create AttributeGroupAdmin class**
   - Inherit from admin.ModelAdmin

2. **Configure list display**
   - list_display: name, slug, display_order, is_active, attribute_count
   - attribute_count: custom method showing number of attributes

3. **Add list filters**
   - list_filter: is_active, created_at

4. **Configure search**
   - search_fields: name, description

5. **Add field ordering**
   - ordering: display_order, name

6. **Configure prepopulated fields**
   - prepopulated_fields: slug from name

7. **Add custom method**
   - attribute_count(): Show number of attributes in group

8. **Register model**
   - admin.site.register(AttributeGroup, AttributeGroupAdmin)

### Admin Configuration

```python
@admin.register(AttributeGroup)
class AttributeGroupAdmin(admin.ModelAdmin):
    """Admin interface for AttributeGroup"""
    list_display = ['name', 'slug', 'display_order', 'is_active', 'attribute_count']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['display_order', 'name']
    prepopulated_fields = {'slug': ('name',)}
    
    def attribute_count(self, obj):
        """Display number of attributes in group"""
        return obj.attributes.count()
    attribute_count.short_description = 'Attributes'
```

### Admin Interface Features

**List View:**
- Columns: Name, Slug, Display Order, Active Status, Attribute Count
- Filters: Is Active, Created At
- Search: Name, Description

**Form View:**
- Auto-populate slug from name
- All fields editable

### Verification Checklist
- [ ] AttributeGroupAdmin created
- [ ] list_display configured
- [ ] Filters and search added
- [ ] prepopulated_fields set
- [ ] attribute_count method added
- [ ] Model registered

---

## Task 80: Register Attribute Admin

### Overview
Create and register admin interface for Attribute with inline option editing, advanced filters, and category management.

### Dependencies
- Task 79: Register AttributeGroup Admin

### Instructions

1. **Create AttributeOptionInline class**
   - Inline editor for AttributeOption
   - TabularInline for compact display
   - Allow adding/editing options directly

2. **Configure AttributeOptionInline**
   - model = AttributeOption
   - extra = 3 (show 3 empty forms)
   - fields: value, label, color_code, image, display_order, is_default
   - ordering: display_order

3. **Create AttributeAdmin class**
   - Inherit from admin.ModelAdmin
   - Include AttributeOptionInline

4. **Configure list display**
   - list_display: name, group, attribute_type, is_required, is_filterable, is_visible_on_product, option_count

5. **Add list filters**
   - list_filter: attribute_type, is_required, is_filterable, is_searchable, is_comparable, is_visible_on_product, group

6. **Configure search**
   - search_fields: name, description

7. **Add field organization**
   - fieldsets: Group fields logically
     - Basic Information: name, slug, group, attribute_type, unit
     - Display Settings: is_required, is_filterable, is_searchable, is_comparable, is_visible_on_product, display_order
     - Validation: validation_regex, min_value, max_value
     - Categories: categories

8. **Configure filters**
   - filter_horizontal: categories (for M2M selection)

9. **Add custom methods**
   - option_count(): Show number of options for SELECT/MULTISELECT types

10. **Register model**
    - admin.site.register(Attribute, AttributeAdmin)

### Admin Configuration

```python
class AttributeOptionInline(admin.TabularInline):
    """Inline editor for AttributeOption"""
    model = AttributeOption
    extra = 3
    fields = ['value', 'label', 'color_code', 'image', 'display_order', 'is_default']
    ordering = ['display_order']


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    """Admin interface for Attribute"""
    list_display = [
        'name', 'group', 'attribute_type', 'is_required', 
        'is_filterable', 'is_visible_on_product', 'option_count'
    ]
    list_filter = [
        'attribute_type', 'is_required', 'is_filterable', 
        'is_searchable', 'is_comparable', 'is_visible_on_product', 
        'group'
    ]
    search_fields = ['name', 'description']
    ordering = ['group__display_order', 'display_order', 'name']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['categories']
    inlines = [AttributeOptionInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'group', 'attribute_type', 'unit')
        }),
        ('Display Settings', {
            'fields': (
                'is_required', 'is_filterable', 'is_searchable', 
                'is_comparable', 'is_visible_on_product', 'display_order'
            )
        }),
        ('Validation', {
            'fields': ('validation_regex', 'min_value', 'max_value'),
            'classes': ('collapse',)
        }),
        ('Categories', {
            'fields': ('categories',)
        })
    )
    
    def option_count(self, obj):
        """Display number of options for SELECT/MULTISELECT types"""
        if obj.attribute_type in ['select', 'multiselect']:
            return obj.options.count()
        return '-'
    option_count.short_description = 'Options'
```

### Admin Interface Features

**List View:**
- Columns: Name, Group, Type, Required, Filterable, Visible, Option Count
- Filters: Type, Required, Filterable, Searchable, Comparable, Visible, Group
- Search: Name, Description

**Form View:**
- Organized fieldsets (Basic, Display, Validation, Categories)
- Inline option editor (for SELECT/MULTISELECT)
- Auto-populate slug
- Filter horizontal for category selection

**Inline Option Editor:**
- Edit options directly on attribute form
- Add multiple options at once
- Set color codes for visual swatches
- Upload option images
- Set default option

### Use Cases

**Admin User Tasks:**

1. **Create Color Attribute:**
   - Name: Color
   - Type: SELECT
   - Group: Product Specifications
   - Filterable: Yes
   - Add Options:
     - Red (color_code: #FF0000)
     - Blue (color_code: #0000FF)
     - Green (color_code: #00FF00)

2. **Create Size Attribute:**
   - Name: Size
   - Type: SELECT
   - Group: Product Specifications
   - Filterable: Yes
   - Add Options: Small, Medium, Large, X-Large

3. **Create Weight Attribute:**
   - Name: Weight
   - Type: NUMBER
   - Unit: kg
   - Validation: min_value=0, max_value=1000

4. **Assign to Categories:**
   - Select categories that use this attribute
   - Filter horizontal widget for easy selection

### Business Context

The admin interface enables:
1. **Easy Attribute Creation:** Staff can quickly create attributes with options
2. **Visual Organization:** Grouped fields and inline options
3. **Bulk Management:** Edit multiple options at once
4. **Category Assignment:** Link attributes to relevant categories
5. **Validation:** Set rules for attribute values

### Sri Lankan Context

**Local Business Needs:**
- Support for local product attributes (සිංහල labels)
- LKR-based min/max values
- Local measurement units (kg, g, l, ml)
- Color names in Sinhala/English

**Example Attributes:**
- තේ ප්‍රභේදය (Tea Variety): SELECT
- බර (Weight): NUMBER with unit="kg"
- පාට (Color): SELECT with visual swatches
- තත්ත්වය (Quality): SELECT (Premium, Standard, Economy)

### Verification Checklist
- [ ] AttributeOptionInline created
- [ ] AttributeAdmin created
- [ ] list_display configured
- [ ] Filters and search added
- [ ] fieldsets organized
- [ ] filter_horizontal for categories
- [ ] Inline included
- [ ] option_count method added
- [ ] Model registered

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 78 | Create admin.py File | Admin module created |
| 79 | Register AttributeGroup Admin | Group admin interface |
| 80 | Register Attribute Admin | Attribute admin with inline options |

### Admin Features Summary

**AttributeGroup Admin:**
- List display with attribute count
- Search by name/description
- Filter by active status
- Auto-populate slug

**Attribute Admin:**
- Inline option editor
- Advanced filters (type, required, filterable, etc.)
- Organized fieldsets
- Category assignment with filter horizontal
- Custom option count column

### Next Steps
1. Proceed to [../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)
2. Create model unit tests
3. Create API tests
4. Create tenant isolation tests
5. Write documentation

---

## Notes for AI Agents

1. **Inline Admin:** TabularInline for compact option editing
2. **Fieldsets:** Group related fields logically
3. **Custom Methods:** Add columns to list_display with methods
4. **Prepopulated Fields:** Auto-generate slug from name
5. **Filter Horizontal:** For M2M fields (categories)
6. **Collapsible Sections:** Use 'collapse' class for optional fields
7. **No Code:** Instructions only
