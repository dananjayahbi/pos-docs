# Tasks 15-21: Category Class & Basic Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** B - Category Model Definition  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_MPTT-Setup/](../Group-A_MPTT-Setup/)
- **→ Next Document:** [02_Tasks-22-26_Display-Image-Fields.md](02_Tasks-22-26_Display-Image-Fields.md)

---

## Document Overview

This document covers creating the Category model file, importing required classes, and defining the basic fields including name, slug, and parent relationship.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create category.py Model File | Low |
| 16 | Import MPTTModel | Low |
| 17 | Import TreeForeignKey | Low |
| 18 | Define Category Class | Medium |
| 19 | Add name Field | Low |
| 20 | Add slug Field | Low |
| 21 | Add parent Field | Medium |

---

## Technology Context

### Model Inheritance Strategy
The Category model will inherit from two base classes:
- **BaseModel:** Provides UUID primary key, timestamps, audit fields
- **MPTTModel:** Provides tree structure fields (lft, rght, tree_id, level)

### Multiple Inheritance in Django
Django supports multiple inheritance with proper Method Resolution Order (MRO).
Order matters: BaseModel should come before MPTTModel for proper field ordering.

### Field Types Used
- CharField: Text fields with max length
- SlugField: URL-safe identifiers
- TreeForeignKey: Special ForeignKey for MPTT parent relationships

---

## Task 15: Create category.py Model File

### Overview
Create the category.py file in the models module to hold the Category model definition.

### Dependencies
- Group A complete (all setup tasks)

### Instructions

1. **Navigate to models directory**
   - Go to backend/apps/categories/models/
   - This directory was created in Group A

2. **Create category.py file**
   - Create new file named category.py
   - This will contain the Category model class

3. **Add file docstring**
   - Include module-level docstring
   - Explain purpose: "Category model for hierarchical product organization"
   - Mention MPTT usage

4. **Prepare for imports section**
   - Leave space at top for import statements
   - Will add Django and MPTT imports next

5. **Plan file structure**
   - Imports at top
   - Model class definition
   - Meta class
   - String representation method

### File Organization Best Practices
```
File Structure:
1. Module docstring
2. Standard library imports
3. Django imports
4. Third-party imports (mptt)
5. Local imports (BaseModel)
6. Model class definition
7. Inner Meta class
8. Methods
```

### Expected Outcome
```
backend/apps/categories/
└── models/
    ├── __init__.py
    └── category.py              # NEW: Category model file
```

File contains:
- Docstring explaining purpose
- Space prepared for imports
- Ready for model class definition

### Verification Steps
- Confirm category.py file exists
- Check file is in correct directory
- Verify docstring is present
- Ensure proper encoding (UTF-8)

---

## Task 16: Import MPTTModel

### Overview
Import the MPTTModel base class from django-mptt for tree functionality.

### Dependencies
- Task 15: Create category.py Model File

### Instructions

1. **Add MPTT import section**
   - Add comment: "# Third-party imports"
   - Import from mptt.models module

2. **Import MPTTModel class**
   - Add import statement for MPTTModel
   - This is the base class for tree models

3. **Add import comment**
   - Inline or above comment explaining purpose
   - Example: "# Tree structure support"

4. **Verify import path**
   - Correct path: from mptt.models import MPTTModel
   - Case-sensitive: MPTTModel (not MpttModel)

### Why MPTTModel?
| Feature | Provided by MPTTModel |
|---------|----------------------|
| **Tree Fields** | Adds lft, rght, tree_id, level automatically |
| **Tree Methods** | get_ancestors(), get_descendants(), etc. |
| **Tree Manager** | TreeManager with tree-specific queries |
| **Tree QuerySet** | TreeQuerySet for chaining tree operations |
| **Tree Save** | Handles tree structure updates on save |

### MPTTModel Methods Available
After inheriting from MPTTModel:
- get_ancestors() - returns all parent nodes
- get_descendants() - returns all child nodes  
- get_children() - returns direct children
- get_siblings() - returns nodes at same level
- is_root_node() - checks if node has no parent
- is_leaf_node() - checks if node has no children
- get_root() - returns the root node of this tree

### Expected Outcome
Import section includes:
```
# Third-party imports
from mptt.models import MPTTModel
```

### Verification Steps
- Check import statement syntax
- Verify from mptt.models path
- Confirm MPTTModel spelling
- Ensure no syntax errors

---

## Task 17: Import TreeForeignKey

### Overview
Import the TreeForeignKey field class for creating the parent relationship.

### Dependencies
- Task 16: Import MPTTModel

### Instructions

1. **Add to MPTT imports section**
   - Import from mptt.fields module
   - Add TreeForeignKey to imports

2. **Understand TreeForeignKey**
   - Special ForeignKey for MPTT parent relationships
   - Handles tree structure automatically
   - Enables hierarchical relationships

3. **Add import statement**
   - Import TreeForeignKey from mptt.fields
   - Include in same section as MPTTModel import

### TreeForeignKey vs Regular ForeignKey
| Aspect | TreeForeignKey | Regular ForeignKey |
|--------|----------------|-------------------|
| **Usage** | MPTT parent field | Standard relationships |
| **Tree Aware** | Yes - updates tree structure | No |
| **MPPT Integration** | Automatic | Manual |
| **Recommendations** | Use for MPTT models only | Use for non-tree relations |

### When to Use TreeForeignKey
- Always use for parent field in MPTT models
- Enables proper tree structure maintenance
- Required by django-mptt for correct operation
- Never use regular ForeignKey for parent in MPPT models

### Expected Outcome
Import section includes:
```
# Third-party imports
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey
```

### Verification Steps
- Check TreeForeignKey import exists
- Verify from mptt.fields path
- Confirm spelling and casing
- Ensure both MPTT imports present

---

## Task 18: Define Category Class

### Overview
Create the Category model class inheriting from BaseModel and MPTTModel.

### Dependencies
- Task 17: Import TreeForeignKey

### Instructions

1. **Import BaseModel**
   - Add import for BaseModel from core app
   - This provides common fields (UUID, timestamps, audit)
   - Path: from apps.core.models import BaseModel

2. **Import Django model components**
   - Import models from django.db
   - Needed for field definitions

3. **Define Category class**
   - Create class named Category
   - Inherit from BaseModel and MPTTModel
   - Order: BaseModel first, then MPTTModel

4. **Add class docstring**
   - Document model purpose
   - Explain MPTT structure
   - Note multi-tenancy

5. **Prepare for field definitions**
   - Add blank line after docstring
   - Ready to add fields in next tasks

### Multiple Inheritance Order
```
Correct Order:
class Category(BaseModel, MPTTModel):
    # BaseModel provides: id, created_at, updated_at, created_by, updated_by
    # MPTTModel provides: lft, rght, tree_id, level, tree
```

Why this order?
- BaseModel first for UUID primary key
- MPTTModel second adds tree functionality
- Method Resolution Order (MRO) follows left-to-right

### Class Docstring Template
```
class Category(BaseModel, MPTTModel):
    """
    Hierarchical category model for product organization.
    
    Uses MPTT (Modified Preorder Tree Traversal) for efficient tree queries.
    Categories can be nested to unlimited depth.
    
    Inherits:
        BaseModel: UUID, timestamps, audit fields
        MPTTModel: Tree structure (lft, rght, tree_id, level)
    
    Tenant-specific: Each tenant has isolated category tree.
    """
```

### Fields Inherited from BaseModel
| Field | Type | Purpose |
|-------|------|---------|
| id | UUIDField | Primary key |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Last modification |
| created_by | ForeignKey | User who created |
| updated_by | ForeignKey | User who last modified |

### Fields Inherited from MPTTModel
| Field | Type | Purpose |
|-------|------|---------|
| lft | PositiveIntegerField | Left tree boundary |
| rght | PositiveIntegerField | Right tree boundary |
| tree_id | PositiveIntegerField | Tree identifier |
| level | PositiveIntegerField | Depth from root |

### Expected Outcome
Category class defined with:
- Proper multiple inheritance
- Comprehensive docstring
- Ready for field definitions
- All imports present

### Verification Steps
- Check class definition syntax
- Verify inheritance order
- Confirm docstring is present
- Ensure BaseModel imported

---

## Task 19: Add name Field

### Overview
Add the name field for storing the category name in English.

### Dependencies
- Task 18: Define Category Class

### Instructions

1. **Add CharField for name**
   - Field type: CharField
   - max_length: 200 characters
   - Required field (no blank=True)

2. **Configure field attributes**
   - verbose_name: 'Category Name'
   - help_text: Descriptive text for admins
   - db_index: True for query performance

3. **Add field validation**
   - Required field (blank=False, null=False)
   - Max length enforced by database
   - Should be unique per parent (handled in Meta)

4. **Consider multi-language support**
   - Primary name in English
   - Consider future translation field
   - Sinhala name can be separate field (future)

### Field Configuration Options
| Attribute | Value | Reason |
|-----------|-------|--------|
| max_length | 200 | Allows long descriptive names |
| blank | False | Name is required |
| null | False | No NULL values in database |
| db_index | True | Fast lookups by name |
| verbose_name | 'Category Name' | Human-readable label |

### Naming Conventions
- Use descriptive English names
- Title case for display
- Avoid abbreviations
- Keep concise but clear

### Examples of Good Category Names
| Good | Why | Bad | Why Not |
|------|-----|-----|---------|
| Mobile Phones | Clear, descriptive | Mobiles | Too abbreviated |
| Laptops | Standard term | Laptop Computers | Redundant |
| Rice & Grains | Specific group | Food | Too broad |
| Traditional Clothing | Descriptive | Trad Clothes | Abbreviated |

### Expected Outcome
Field defined in Category model:
```
name = models.CharField(
    max_length=200,
    db_index=True,
    verbose_name='Category Name',
    help_text='Name of the category'
)
```

### Verification Steps
- Check field is defined
- Verify max_length is appropriate
- Confirm db_index for performance
- Ensure verbose_name is set

---

## Task 20: Add slug Field

### Overview
Add the slug field for URL-safe category identifiers used in webstore URLs.

### Dependencies
- Task 19: Add name Field

### Instructions

1. **Add SlugField for slug**
   - Field type: SlugField
   - max_length: 200 (match name length)
   - Should be unique per parent

2. **Configure slug attributes**
   - unique: False (allow same slug under different parents)
   - blank: True (auto-generated if not provided)
   - db_index: True (used in URL lookups)

3. **Add slug validation**
   - Must be URL-safe (lowercase, hyphens, no spaces)
   - Unique per parent category
   - Auto-generated from name if not provided

4. **Plan slug generation strategy**
   - Auto-generate from name field
   - Use slugify() utility
   - Handle duplicate slugs
   - Implement in save() method (later task)

### Slug Field Purpose
| Purpose | Example | Benefit |
|---------|---------|---------|
| **SEO URLs** | /categories/mobile-phones/ | Search engine friendly |
| **Readability** | /laptops/gaming-laptops/ | Human-readable |
| **Consistency** | Always lowercase | Predictable |
| **Uniqueness** | Per-parent uniqueness | Avoids conflicts |

### Slug Generation Rules
- Lowercase all characters
- Replace spaces with hyphens
- Remove special characters
- Handle Unicode (Sinhala names)
- Ensure uniqueness within same parent

### Why Unique Per Parent, Not Globally?
Allows same slug under different parents:
```
Electronics → Accessories (slug: accessories)
Clothing → Accessories (slug: accessories)
```

Both can have slug "accessories" because different parents.

### Slug Field Configuration
| Attribute | Value | Reason |
|-----------|-------|--------|
| max_length | 200 | Match name field |
| unique | False | Allow per-parent uniqueness |
| blank | True | Auto-generated |
| db_index | True | URL lookup performance |
| allow_unicode | False | ASCII-only for URLs |

### Expected Outcome
Field defined in Category model:
```
slug = models.SlugField(
    max_length=200,
    blank=True,
    db_index=True,
    verbose_name='URL Slug',
    help_text='URL-safe identifier (auto-generated from name)'
)
```

### Verification Steps
- Check SlugField is defined
- Verify blank=True for auto-generation
- Confirm db_index is set
- Ensure appropriate max_length

---

## Task 21: Add parent Field

### Overview
Add the parent field using TreeForeignKey to create the hierarchical structure.

### Dependencies
- Task 20: Add slug Field

### Instructions

1. **Add TreeForeignKey for parent**
   - Field type: TreeForeignKey
   - Points to 'self' (same model)
   - Related name: 'children'

2. **Configure parent field attributes**
   - null: True (root categories have no parent)
   - blank: True (optional in forms)
   - on_delete: CASCADE (delete children when parent deleted)

3. **Set related_name**
   - Use 'children' for reverse relation
   - Enables: parent_category.children.all()
   - Clear semantic meaning

4. **Add field metadata**
   - verbose_name: 'Parent Category'
   - help_text: Explain parent-child relationship

5. **Consider CASCADE behavior**
   - Deleting parent deletes all children
   - Alternative: SET_NULL (orphan children)
   - Recommended: CASCADE for clean tree structure

### TreeForeignKey Configuration
```
parent = TreeForeignKey(
    'self',
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name='children',
    verbose_name='Parent Category',
    help_text='Parent category in the hierarchy'
)
```

### Parent Field Behavior
| Scenario | Result |
|----------|--------|
| parent=None | Root category (level 0) |
| parent=Electronics | Child of Electronics |
| Delete parent | All children deleted (CASCADE) |
| Change parent | Tree structure recalculated |

### on_delete Options
| Option | Behavior | Use Case |
|--------|----------|----------|
| CASCADE | Delete children too | Recommended - clean tree |
| SET_NULL | Make children orphans | Preserve children |
| PROTECT | Prevent parent deletion | Require manual cleanup |

**Recommendation:** Use CASCADE for category trees

### Related Name Usage
```
# Access children from parent
electronics = Category.objects.get(name='Electronics')
children = electronics.children.all()  # Returns all child categories

# Access parent from child
smartphone = Category.objects.get(name='Smartphones')
parent = smartphone.parent  # Returns Mobile Phones category
```

### Root Categories
Root categories have parent=None:
- Electronics (parent=None)
- Clothing (parent=None)
- Food & Grocery (parent=None)

Level automatically set to 0 by MPTT.

### Expected Outcome
Parent field defined:
- TreeForeignKey to self
- Proper CASCADE behavior
- Clear related_name
- Allows root categories

### Verification Steps
- Check TreeForeignKey is used (not ForeignKey)
- Verify null=True and blank=True
- Confirm on_delete=CASCADE
- Ensure related_name is 'children'

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create category.py Model File | category.py file created |
| 16 | Import MPTTModel | MPTTModel imported |
| 17 | Import TreeForeignKey | TreeForeignKey imported |
| 18 | Define Category Class | Category class with inheritance |
| 19 | Add name Field | name CharField added |
| 20 | Add slug Field | slug SlugField added |
| 21 | Add parent Field | parent TreeForeignKey added |

### What Was Accomplished
- Category model file created with proper structure
- MPTT classes imported (MPTTModel, TreeForeignKey)
- Category class defined with multiple inheritance
- Basic identification fields added (name, slug)
- Hierarchical parent relationship established

### Current Model Structure
```
Category Model (so far):
├── Inherited from BaseModel:
│   ├── id (UUID)
│   ├── created_at
│   ├── updated_at
│   ├── created_by
│   └── updated_by
├── Inherited from MPTTModel:
│   ├── lft
│   ├── rght
│   ├── tree_id
│   └── level
└── Defined fields:
    ├── name (CharField)
    ├── slug (SlugField)
    └── parent (TreeForeignKey)
```

### Dependencies Satisfied for Next Document
- Basic model structure exists
- Core fields defined
- Ready for display and image fields

### Next Steps
Proceed to [02_Tasks-22-26_Display-Image-Fields.md](02_Tasks-22-26_Display-Image-Fields.md) to add display fields, images, and status flags.

---

## Notes for AI Agents

1. **Inheritance Order:** BaseModel before MPTTModel is critical
2. **TreeForeignKey:** Must use TreeForeignKey for parent, not regular ForeignKey
3. **Slug Generation:** Slug auto-generation implemented later in serializers
4. **Unique Constraint:** Slug unique per parent, not globally
5. **CASCADE:** Delete children when parent deleted for clean tree structure
6. **Root Categories:** parent=None for top-level categories
7. **Related Name:** 'children' provides semantic access to child categories
8. **Multi-Language:** Primary name in English; translations handled separately
9. **Index Fields:** name and slug indexed for query performance
10. **No Code:** Instructions only; actual implementation comes during development
