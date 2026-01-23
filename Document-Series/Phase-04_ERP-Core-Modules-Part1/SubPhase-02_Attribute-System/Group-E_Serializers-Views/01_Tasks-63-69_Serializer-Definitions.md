# Tasks 63-69: Serializer Definitions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** E - Serializers & Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68, 69

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_AttributeOption-Model/](../Group-D_AttributeOption-Model/)
- **→ Next Document:** [02_Tasks-70-77_ViewSets-URLs.md](02_Tasks-70-77_ViewSets-URLs.md)

---

## Document Overview

This document covers creating DRF serializers for all attribute models to expose them via REST API. Serializers handle data validation, transformation, and nested relationships.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create serializers.py File | Low |
| 64 | Create AttributeGroupSerializer | Medium |
| 65 | Create AttributeSerializer | Medium |
| 66 | Create AttributeOptionSerializer | Low |
| 67 | Create AttributeListSerializer | Low |
| 68 | Create AttributeDetailSerializer | Medium |
| 69 | Add Nested Options | High |

---

## Task 63: Create serializers.py File

### Overview
Create the serializers module for attribute app to house all DRF serializers.

### Dependencies
- Group D Task 62: Create Option Migration

### Instructions

1. **Create serializers.py file**
   - Create: `backend/apps/attributes/serializers.py`
   - At app root level

2. **Add module docstring**
   - Document purpose: "DRF serializers for attribute models"

3. **Import required modules**
   - Django REST Framework serializers
   - Attribute models
   - Related models if needed

4. **Prepare file structure**
   - Module docstring
   - Imports
   - Serializer classes

### Required Imports

```python
from rest_framework import serializers
from .models import AttributeGroup, Attribute, AttributeOption
```

### Expected Outcome
```
backend/apps/attributes/
├── serializers.py           # New file
├── models/
├── migrations/
└── ...
```

### Verification Checklist
- [ ] serializers.py created at app root
- [ ] Module docstring present
- [ ] Required imports included
- [ ] Valid Python syntax

---

## Task 64: Create AttributeGroupSerializer

### Overview
Create a serializer for the AttributeGroup model with read and write operations.

### Dependencies
- Task 63: Create serializers.py File

### Instructions

1. **Create AttributeGroupSerializer class**
   - Inherit from serializers.ModelSerializer
   - Add class docstring

2. **Configure Meta class**
   - model = AttributeGroup
   - fields: all or specific list
   - read_only_fields: timestamps, created_by, etc.

3. **Add field customization**
   - slug: read_only (auto-generated)
   - Add attribute_count (optional)

4. **Add validation**
   - Name uniqueness within tenant
   - Slug generation logic

### Serializer Structure

```python
class AttributeGroupSerializer(serializers.ModelSerializer):
    """Serializer for AttributeGroup model"""
    attribute_count = serializers.SerializerMethodField()
    
    class Meta:
        model = AttributeGroup
        fields = '__all__'
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_attribute_count(self, obj):
        return obj.attributes.count()
```

### Expected Fields

- id (read-only)
- name
- slug (read-only)
- description
- display_order
- is_active
- attribute_count (computed)
- created_at, updated_at (read-only)

### Verification Checklist
- [ ] AttributeGroupSerializer created
- [ ] Inherits from ModelSerializer
- [ ] Meta class configured
- [ ] Fields specified
- [ ] read_only_fields set

---

## Task 65: Create AttributeSerializer

### Overview
Create a serializer for the Attribute model with validation and relationships.

### Dependencies
- Task 64: Create AttributeGroupSerializer

### Instructions

1. **Create AttributeSerializer class**
   - Inherit from serializers.ModelSerializer
   - Handle group relationship

2. **Configure Meta class**
   - model = Attribute
   - fields: all or specific list
   - Include group, categories

3. **Add field customization**
   - slug: read_only
   - group: PrimaryKeyRelatedField or nested
   - categories: PrimaryKeyRelatedField (many=True)

4. **Add validation**
   - Type-specific validation
   - Unit required for NUMBER type
   - Min/max validation for NUMBER

### Serializer Structure

```python
class AttributeSerializer(serializers.ModelSerializer):
    """Serializer for Attribute model"""
    group_name = serializers.CharField(source='group.name', read_only=True)
    type_display = serializers.CharField(source='get_attribute_type_display', read_only=True)
    
    class Meta:
        model = Attribute
        fields = '__all__'
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Type-specific validation
        if data.get('attribute_type') == 'number' and not data.get('unit'):
            raise serializers.ValidationError("Unit is required for NUMBER type")
        return data
```

### Expected Fields

- id, name, slug
- group, group_name (computed)
- attribute_type, type_display (computed)
- unit, is_required
- is_filterable, is_searchable, is_comparable, is_visible_on_product
- display_order
- validation_regex, min_value, max_value
- categories (list of IDs)

### Verification Checklist
- [ ] AttributeSerializer created
- [ ] Meta class configured
- [ ] Relationships handled
- [ ] Validation added

---

## Task 66: Create AttributeOptionSerializer

### Overview
Create a serializer for the AttributeOption model with visual field support.

### Dependencies
- Task 65: Create AttributeSerializer

### Instructions

1. **Create AttributeOptionSerializer class**
   - Inherit from serializers.ModelSerializer
   - Handle image and color_code fields

2. **Configure Meta class**
   - model = AttributeOption
   - fields: all or specific
   - Handle image URL generation

3. **Add field customization**
   - image: ImageField with URL
   - attribute: PrimaryKeyRelatedField or nested

### Serializer Structure

```python
class AttributeOptionSerializer(serializers.ModelSerializer):
    """Serializer for AttributeOption model"""
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    
    class Meta:
        model = AttributeOption
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
```

### Expected Fields

- id, attribute, attribute_name
- value, label
- color_code, image (URL)
- display_order, is_default

### Verification Checklist
- [ ] AttributeOptionSerializer created
- [ ] Meta class configured
- [ ] Image field handled
- [ ] Computed fields added

---

## Task 67: Create AttributeListSerializer

### Overview
Create an optimized serializer for listing attributes with minimal data.

### Dependencies
- Task 66: Create AttributeOptionSerializer

### Instructions

1. **Create AttributeListSerializer class**
   - Inherit from AttributeSerializer or ModelSerializer
   - Include only essential fields for lists

2. **Optimize for performance**
   - Exclude large fields (description)
   - Include minimal nested data
   - Use select_related/prefetch_related in view

3. **Add computed fields**
   - option_count (if SELECT/MULTISELECT)

### Serializer Structure

```python
class AttributeListSerializer(serializers.ModelSerializer):
    """Optimized serializer for attribute lists"""
    group_name = serializers.CharField(source='group.name', read_only=True)
    type_display = serializers.CharField(source='get_attribute_type_display', read_only=True)
    option_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'slug', 'attribute_type', 'type_display',
                  'group', 'group_name', 'is_required', 'is_filterable',
                  'is_searchable', 'option_count']
        read_only_fields = ['slug']
    
    def get_option_count(self, obj):
        if obj.attribute_type in ['select', 'multiselect']:
            return obj.options.count()
        return None
```

### Fields Included

- id, name, slug
- attribute_type, type_display
- group, group_name
- is_required, is_filterable, is_searchable
- option_count (computed)

### Verification Checklist
- [ ] AttributeListSerializer created
- [ ] Minimal fields included
- [ ] Optimized for lists
- [ ] Computed fields added

---

## Task 68: Create AttributeDetailSerializer

### Overview
Create a detailed serializer with full attribute information and nested options.

### Dependencies
- Task 67: Create AttributeListSerializer

### Instructions

1. **Create AttributeDetailSerializer class**
   - Inherit from AttributeSerializer
   - Include all fields and relationships

2. **Add nested serializers**
   - Nested AttributeGroupSerializer (read-only)
   - Nested category data (read-only)

3. **Prepare for option nesting**
   - Will add options field in next task
   - Include all validation rules

### Serializer Structure

```python
class AttributeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with full attribute information"""
    group = AttributeGroupSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=AttributeGroup.objects.all(),
        source='group',
        write_only=True,
        required=False
    )
    type_display = serializers.CharField(source='get_attribute_type_display', read_only=True)
    
    class Meta:
        model = Attribute
        fields = '__all__'
        read_only_fields = ['slug', 'created_at', 'updated_at']
```

### Fields Included

- All Attribute fields
- Nested group data (read-only)
- group_id for writing
- type_display
- options (will add in next task)

### Verification Checklist
- [ ] AttributeDetailSerializer created
- [ ] All fields included
- [ ] Nested group data
- [ ] Read/write handling

---

## Task 69: Add Nested Options

### Overview
Add nested options field to AttributeDetailSerializer to include option data when retrieving attribute details.

### Dependencies
- Task 68: Create AttributeDetailSerializer

### Instructions

1. **Add options field to AttributeDetailSerializer**
   - Use AttributeOptionSerializer with many=True
   - Read-only field
   - Automatically serializes related options

2. **Configure prefetch optimization**
   - Options should be prefetched in view
   - Prevents N+1 queries
   - Use select_related for option.attribute

3. **Add option filtering**
   - Order by display_order
   - Only active options (if applicable)

4. **Handle write operations**
   - Options created/updated separately
   - Or use writable nested serializer (complex)

### Updated DetailSerializer

```python
class AttributeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with nested options"""
    group = AttributeGroupSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=AttributeGroup.objects.all(),
        source='group',
        write_only=True,
        required=False
    )
    type_display = serializers.CharField(source='get_attribute_type_display', read_only=True)
    options = AttributeOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Attribute
        fields = '__all__'
        read_only_fields = ['slug', 'created_at', 'updated_at']
```

### Response Example

```json
{
  "id": 1,
  "name": "Color",
  "slug": "color",
  "attribute_type": "select",
  "type_display": "Select",
  "group": {
    "id": 1,
    "name": "Basic Info",
    "slug": "basic-info"
  },
  "options": [
    {
      "id": 1,
      "value": "red",
      "label": "Bright Red",
      "color_code": "#FF0000",
      "display_order": 0
    },
    {
      "id": 2,
      "value": "blue",
      "label": "Navy Blue",
      "color_code": "#000080",
      "display_order": 10
    }
  ]
}
```

### Verification Checklist
- [ ] options field added
- [ ] AttributeOptionSerializer nested
- [ ] many=True and read_only=True
- [ ] Response structure verified

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Create serializers.py File | Serializers module created |
| 64 | Create AttributeGroupSerializer | Group serializer |
| 65 | Create AttributeSerializer | Attribute serializer |
| 66 | Create AttributeOptionSerializer | Option serializer |
| 67 | Create AttributeListSerializer | Optimized list serializer |
| 68 | Create AttributeDetailSerializer | Detailed serializer |
| 69 | Add Nested Options | Nested options in detail |

### Serializer Structure
```
serializers.py:
- AttributeGroupSerializer (full CRUD)
- AttributeOptionSerializer (full CRUD)
- AttributeSerializer (base)
- AttributeListSerializer (optimized for lists)
- AttributeDetailSerializer (with nested group and options)
```

### Next Steps
1. Proceed to [02_Tasks-70-77_ViewSets-URLs.md](02_Tasks-70-77_ViewSets-URLs.md)
2. Create ViewSets for CRUD operations
3. Add custom actions (by_category, filterable)
4. Configure URL routing

---

## Notes for AI Agents

1. **Serializer Levels:** List (minimal), Detail (full + nested), Base (CRUD)
2. **Nested Data:** Read-only nested, separate ID fields for writing
3. **Validation:** Type-specific validation in serializer
4. **Optimization:** Use ListSerializer for performance
5. **Options:** Nested in detail view only
6. **No Code:** Instructions only
