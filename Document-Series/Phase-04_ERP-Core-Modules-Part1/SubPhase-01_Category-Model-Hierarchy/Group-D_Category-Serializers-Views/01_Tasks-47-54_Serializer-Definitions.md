# Tasks 47-54: Serializer Definitions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** D - Category Serializers & Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Category-Manager-QuerySets/](../Group-C_Category-Manager-QuerySets/)
- **→ Next Document:** [02_Tasks-55-62_ViewSet-CRUD-Actions.md](02_Tasks-55-62_ViewSet-CRUD-Actions.md)

---

## Document Overview

This document covers creating all category serializers for different API use cases including tree structure, list views, detail views, and creation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 47 | Create serializers.py File | Low |
| 48 | Create CategorySerializer | Medium |
| 49 | Add Nested Fields | High |
| 50 | Create CategoryTreeSerializer | High |
| 51 | Create CategoryListSerializer | Low |
| 52 | Create CategoryDetailSerializer | Medium |
| 53 | Create CategoryCreateSerializer | Medium |
| 54 | Add Slug Auto-generation | Medium |

---

## Technology Context

### Why Multiple Serializers?
Different API endpoints need different data representations:
- **List:** Minimal fields for performance
- **Detail:** Complete information
- **Tree:** Nested children structure
- **Create:** Validation and auto-generation

### Django REST Framework Serializers
- ModelSerializer: Automatic field generation
- Nested serializers: Related object representation
- RecursiveField: Self-referential nesting
- Validation: Field-level and object-level

---

## Task 47: Create serializers.py File

### Overview
Create serializers.py file in categories app to hold all serializer classes.

### Dependencies
- Group C complete (managers and querysets)

### Instructions

1. **Create serializers.py**
   - Path: backend/apps/categories/serializers.py
   - Will contain all category serializers

2. **Add file docstring**
   - Explain purpose: API serializers
   - List serializer classes

3. **Import required modules**
   - Django REST Framework serializers
   - Category model
   - RecursiveField (for tree structure)

4. **Plan serializer organization**
   - Base serializers first
   - Specialized serializers after
   - Logical grouping

### Expected Outcome
```
backend/apps/categories/
├── models/
├── serializers.py           # NEW: API serializers
├── views.py
└── urls.py
```

### Verification Steps
- Check serializers.py exists
- Verify imports are correct
- Confirm docstring present

---

## Task 48: Create CategorySerializer

### Overview
Create base CategorySerializer with common fields.

### Dependencies
- Task 47: Create serializers.py File

### Instructions

1. **Define CategorySerializer class**
   - Inherit from ModelSerializer
   - Include common fields

2. **Configure Meta class**
   - model = Category
   - fields = ['id', 'name', 'slug', 'parent', ...]
   - read_only_fields = ['id', 'created_at', 'updated_at']

3. **Include basic fields**
   - id, name, slug, parent
   - description, image, icon
   - is_active, display_order
   - created_at, updated_at

4. **Add serializer docstring**
   - Explain base serializer purpose
   - Note usage contexts

### Field Selection
| Field | Include | Reason |
|-------|---------|--------|
| **id** | Yes | Primary key |
| **name** | Yes | Category name |
| **slug** | Yes | URL identifier |
| **parent** | Yes | Parent relationship |
| **description** | Yes | Category info |
| **image** | Yes | Visual representation |
| **icon** | Yes | UI icon |
| **is_active** | Yes | Status |
| **display_order** | Yes | Sorting |
| **seo_*** | No | Only in detail |

### Expected Outcome
```
class CategorySerializer(serializers.ModelSerializer):
    """
    Base serializer for Category model.
    
    Used as base for other serializers.
    """
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'parent',
            'description', 'image', 'icon',
            'is_active', 'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

### Verification Steps
- Check inherits ModelSerializer
- Verify all fields listed
- Confirm read_only_fields set

---

## Task 49: Add Nested Fields

### Overview
Add support for nested parent and children representations.

### Dependencies
- Task 48: Create CategorySerializer

### Instructions

1. **Add parent nested field**
   - Use SerializerMethodField or nested serializer
   - Show parent basic info

2. **Add children field**
   - SerializerMethodField returning list
   - Basic child information

3. **Implement get_parent method**
   - Return parent category data
   - Handle None for root categories

4. **Implement get_children method**
   - Return list of direct children
   - Use queryset prefetch if available

### Nested Field Options
| Approach | Use Case |
|----------|----------|
| **PrimaryKeyRelatedField** | Just IDs |
| **StringRelatedField** | Just names |
| **Nested Serializer** | Full object |
| **SerializerMethodField** | Custom logic |

### Expected Outcome
```
class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    children = serializers.SerializerMethodField()
    
    class Meta:
        # ... fields
        
    def get_children(self, obj):
        """Return direct children."""
        children = obj.children.filter(is_active=True)
        return CategoryListSerializer(children, many=True).data
```

### Verification Steps
- Check nested fields defined
- Verify methods implemented
- Confirm handles None cases

---

## Task 50: Create CategoryTreeSerializer

### Overview
Create serializer for recursive tree structure representation.

### Dependencies
- Task 49: Add Nested Fields

### Instructions

1. **Define CategoryTreeSerializer**
   - Inherit from CategorySerializer
   - Add recursive children field

2. **Add RecursiveField for children**
   - Import RecursiveField from DRF Recursive
   - Or implement custom recursion

3. **Configure for nested structure**
   - children = RecursiveField(many=True)
   - Handles unlimited nesting depth

4. **Add depth limiting**
   - Prevent infinite recursion
   - Limit to reasonable depth (e.g., 5 levels)

### Recursive Structure Example
```
{
  "id": "uuid",
  "name": "Electronics",
  "children": [
    {
      "id": "uuid",
      "name": "Mobile Phones",
      "children": [
        {
          "id": "uuid",
          "name": "Smartphones",
          "children": []
        }
      ]
    }
  ]
}
```

### Implementation Options
| Option | Library | Complexity |
|--------|---------|------------|
| **RecursiveField** | djangorestframework-recursive | Simple |
| **Custom** | Manual implementation | Medium |
| **SerializerMethodField** | Built-in DRF | Medium |

### Expected Outcome
```
class CategoryTreeSerializer(serializers.ModelSerializer):
    """
    Serializer for recursive category tree structure.
    
    Returns nested children to unlimited depth.
    """
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'children']
        
    def get_children(self, obj):
        """Recursively serialize children."""
        children = obj.children.filter(is_active=True)
        serializer = CategoryTreeSerializer(children, many=True)
        return serializer.data
```

### Verification Steps
- Check handles recursion
- Verify children nested properly
- Confirm depth limiting if needed

---

## Task 51: Create CategoryListSerializer

### Overview
Create lightweight serializer for list views with minimal fields.

### Dependencies
- Task 50: Create CategoryTreeSerializer

### Instructions

1. **Define CategoryListSerializer**
   - Minimal fields for performance
   - Used in list endpoints

2. **Include only essential fields**
   - id, name, slug
   - icon, is_active
   - parent_id (FK only)

3. **Optimize for large lists**
   - No nested objects
   - No heavy fields
   - Fast serialization

4. **Add docstring**
   - Explain lightweight purpose
   - Note usage in lists

### List vs Detail Serializers
| Serializer | Fields | Use Case |
|------------|--------|----------|
| **List** | Essential only | GET /categories/ |
| **Detail** | Complete info | GET /categories/{id}/ |

### Expected Outcome
```
class CategoryListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for category lists.
    
    Minimal fields for performance in list views.
    """
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'icon',
            'parent', 'is_active', 'display_order'
        ]
```

### Verification Steps
- Check minimal field set
- Verify no nested objects
- Confirm optimized for lists

---

## Task 52: Create CategoryDetailSerializer

### Overview
Create comprehensive serializer for detail views with all fields including SEO.

### Dependencies
- Task 51: Create CategoryListSerializer

### Instructions

1. **Define CategoryDetailSerializer**
   - Inherit from CategorySerializer
   - Add all fields including SEO

2. **Include SEO fields**
   - seo_title, seo_description, seo_keywords
   - Only in detail view

3. **Add computed fields**
   - children_count, product_count
   - is_root, is_leaf

4. **Add related data**
   - Parent full object
   - Children list

### Detail Serializer Fields
```
All CategorySerializer fields +
├── seo_title
├── seo_description
├── seo_keywords
├── children_count
├── product_count
├── is_root
└── is_leaf
```

### Expected Outcome
```
class CategoryDetailSerializer(CategorySerializer):
    """
    Detailed serializer with all fields including SEO.
    
    Used for single category retrieval.
    """
    children_count = serializers.IntegerField(read_only=True)
    is_root = serializers.BooleanField(read_only=True)
    is_leaf = serializers.BooleanField(read_only=True)
    
    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + [
            'seo_title', 'seo_description', 'seo_keywords',
            'children_count', 'is_root', 'is_leaf'
        ]
```

### Verification Steps
- Check includes all fields
- Verify SEO fields present
- Confirm computed fields added

---

## Task 53: Create CategoryCreateSerializer

### Overview
Create serializer for category creation with validation.

### Dependencies
- Task 52: Create CategoryDetailSerializer

### Instructions

1. **Define CategoryCreateSerializer**
   - Used for POST/PUT operations
   - Includes validation

2. **Add field validation**
   - Name required
   - Parent validation
   - Slug auto-generation

3. **Add create method**
   - Handle slug generation
   - Validate parent
   - Create category

4. **Add update method**
   - Update fields
   - Regenerate slug if name changes

### Validation Rules
| Field | Validation |
|-------|------------|
| **name** | Required, max 200 |
| **parent** | Must exist, not self |
| **slug** | Auto-generated |
| **is_active** | Boolean |

### Expected Outcome
```
class CategoryCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating categories.
    
    Handles slug auto-generation and validation.
    """
    
    class Meta:
        model = Category
        fields = [
            'name', 'parent', 'description',
            'image', 'icon', 'is_active',
            'display_order', 'seo_title',
            'seo_description', 'seo_keywords'
        ]
        
    def validate_parent(self, value):
        """Validate parent category."""
        if value and self.instance and value == self.instance:
            raise serializers.ValidationError("Category cannot be its own parent")
        return value
```

### Verification Steps
- Check validation methods present
- Verify create/update methods
- Confirm parent validation

---

## Task 54: Add Slug Auto-generation

### Overview
Implement automatic slug generation from category name.

### Dependencies
- Task 53: Create CategoryCreateSerializer

### Instructions

1. **Add create method override**
   - Generate slug from name if not provided
   - Use slugify utility

2. **Handle slug uniqueness**
   - Check uniqueness within same parent
   - Add number suffix if duplicate

3. **Add update method override**
   - Regenerate slug if name changes
   - Preserve manual slugs if provided

4. **Import slugify utility**
   - From django.utils.text import slugify
   - Handles special characters

### Slug Generation Logic
```
Input: "Mobile Phones"
Output: "mobile-phones"

Input: "Rice & Grains"
Output: "rice-grains"

Duplicate handling:
"Accessories" → "accessories"
"Accessories" (duplicate) → "accessories-2"
```

### Expected Outcome
```
from django.utils.text import slugify

class CategoryCreateSerializer(serializers.ModelSerializer):
    # ... fields
    
    def create(self, validated_data):
        """Create category with auto-generated slug."""
        if not validated_data.get('slug'):
            validated_data['slug'] = self._generate_slug(
                validated_data['name'],
                validated_data.get('parent')
            )
        return super().create(validated_data)
    
    def _generate_slug(self, name, parent):
        """Generate unique slug for category."""
        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        
        # Check uniqueness within same parent
        while Category.objects.filter(
            slug=slug, parent=parent
        ).exists():
            counter += 1
            slug = f"{base_slug}-{counter}"
            
        return slug
```

### Verification Steps
- Check slugify imported
- Verify auto-generation works
- Confirm uniqueness checking
- Test duplicate handling

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 47 | Create serializers.py File | Serializers file created |
| 48 | Create CategorySerializer | Base serializer |
| 49 | Add Nested Fields | Parent/children nesting |
| 50 | Create CategoryTreeSerializer | Recursive tree structure |
| 51 | Create CategoryListSerializer | Lightweight list serializer |
| 52 | Create CategoryDetailSerializer | Complete detail serializer |
| 53 | Create CategoryCreateSerializer | Create/update serializer |
| 54 | Add Slug Auto-generation | Automatic slug generation |

### Serializer Types Created
```
Category Serializers:
├── CategorySerializer (Base)
├── CategoryTreeSerializer (Recursive)
├── CategoryListSerializer (Minimal)
├── CategoryDetailSerializer (Complete)
└── CategoryCreateSerializer (Validation)
```

### Usage by Endpoint
| Endpoint | Serializer |
|----------|------------|
| **GET /categories/** | CategoryListSerializer |
| **GET /categories/{id}/** | CategoryDetailSerializer |
| **GET /categories/tree/** | CategoryTreeSerializer |
| **POST /categories/** | CategoryCreateSerializer |
| **PUT /categories/{id}/** | CategoryCreateSerializer |

### Dependencies Satisfied for Next Document
- All serializers defined
- Validation implemented
- Slug auto-generation working
- Ready for ViewSet creation

### Next Steps
Proceed to [02_Tasks-55-62_ViewSet-CRUD-Actions.md](02_Tasks-55-62_ViewSet-CRUD-Actions.md) to create CategoryViewSet with CRUD operations.

---

## Notes for AI Agents

1. **Multiple Serializers:** Different use cases need different serializers
2. **Tree Structure:** Use RecursiveField or SerializerMethodField
3. **Performance:** List serializer minimal for large datasets
4. **Slug Generation:** Handle uniqueness within same parent
5. **Validation:** Prevent circular parent references
6. **Read-Only:** Mark computed fields as read_only=True
7. **Nested Data:** Use prefetch_related to avoid N+1
8. **SEO Fields:** Only in detail serializer
9. **Create vs Update:** Same serializer, different methods
10. **Next Document:** ViewSet uses these serializers
