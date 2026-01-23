# Tasks 27-32: SEO Fields, Meta & Export

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** B - Category Model Definition  
> **Document:** 03 of 03  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-22-26_Display-Image-Fields.md](02_Tasks-22-26_Display-Image-Fields.md)
- **→ Next Group:** [../Group-C_Category-Manager-QuerySets/](../Group-C_Category-Manager-QuerySets/)

---

## Document Overview

This document covers adding SEO fields for webstore optimization, configuring the MPTTMeta class, adding string representation, and exporting the model from the module.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 27 | Add seo_title Field | Low |
| 28 | Add seo_description Field | Low |
| 29 | Add seo_keywords Field | Low |
| 30 | Define MPTTMeta Class | Medium |
| 31 | Add __str__ Method | Low |
| 32 | Export Category Model | Low |

---

## Task 27: Add seo_title Field

### Overview
Add meta title field for SEO optimization in webstore category pages.

### Dependencies
- Task 26: Add display_order Field

### Instructions

1. **Add CharField for seo_title**
   - Field type: CharField
   - max_length: 100 characters (Google limit ~60)
   - Optional (blank=True, null=True)

2. **Configure SEO title attributes**
   - Falls back to name field if not provided
   - Used in HTML `<title>` tag
   - Displayed in search results

3. **Add help text**
   - Explain SEO importance
   - Mention character limit
   - Example: "Optimized title for search engines (60 chars max)"

4. **SEO best practices**
   - Keep under 60 characters
   - Include keywords
   - Be descriptive and unique
   - Front-load important terms

### SEO Title Guidelines
| Aspect | Guideline |
|--------|-----------|
| **Length** | 50-60 characters optimal |
| **Keywords** | Include main search terms |
| **Uniqueness** | Different from other pages |
| **Branding** | Optional site name suffix |

### Examples
| Category Name | SEO Title |
|---------------|-----------|
| Mobile Phones | Buy Mobile Phones Online - Sri Lanka |
| Laptops | Best Laptops for Sale - LCC Store |
| Rice & Grains | Premium Rice & Grains - Order Online |

### Expected Outcome
```
seo_title = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    verbose_name='SEO Title',
    help_text='Meta title for search engines (60 chars optimal)'
)
```

### Verification Steps
- Check appropriate max_length
- Verify blank=True and null=True
- Confirm help text mentions character limit

---

## Task 28: Add seo_description Field

### Overview
Add meta description field for search engine result snippets.

### Dependencies
- Task 27: Add seo_title Field

### Instructions

1. **Add CharField for seo_description**
   - Field type: CharField
   - max_length: 200 characters (Google shows ~155-160)
   - Optional (blank=True, null=True)

2. **Configure description attributes**
   - Falls back to description field if not provided
   - Used in HTML meta description tag
   - Displayed in search result snippets

3. **Add help text**
   - Explain purpose
   - Mention character limit
   - "Meta description for search results (155 chars optimal)"

4. **SEO best practices**
   - 150-160 characters optimal
   - Include call-to-action
   - Accurately describe category
   - Include keywords naturally

### Meta Description Guidelines
| Aspect | Guideline |
|--------|-----------|
| **Length** | 150-160 characters |
| **Action Words** | Shop, Buy, Browse, Discover |
| **Keywords** | Include naturally |
| **Uniqueness** | Different from other categories |

### Examples
```
Mobile Phones:
"Shop the latest smartphones and feature phones. Wide selection 
of Android & iOS devices with fast delivery across Sri Lanka."

Laptops:
"Browse gaming laptops, business notebooks, and desktops. Best 
prices on top brands with warranty. Order online today."
```

### Expected Outcome
```
seo_description = models.CharField(
    max_length=200,
    blank=True,
    null=True,
    verbose_name='SEO Description',
    help_text='Meta description for search results (155 chars optimal)'
)
```

### Verification Steps
- Check max_length is 200
- Verify blank=True and null=True
- Confirm help text is descriptive

---

## Task 29: Add seo_keywords Field

### Overview
Add meta keywords field (optional, less important in modern SEO).

### Dependencies
- Task 28: Add seo_description Field

### Instructions

1. **Add CharField for seo_keywords**
   - Field type: CharField
   - max_length: 255 characters
   - Optional (blank=True, null=True)

2. **Configure keywords attributes**
   - Comma-separated list
   - Less important for modern SEO
   - May be used for internal search

3. **Add help text**
   - Note modern SEO doesn't rely on this
   - "Comma-separated keywords (optional, legacy SEO)"

4. **Keyword strategy**
   - 5-10 keywords maximum
   - Include category-specific terms
   - Local terms for Sri Lankan market

### Meta Keywords Context
- **Historical:** Important in early search engines
- **Modern:** Google doesn't use for ranking
- **Current Use:** Internal search, categorization
- **Recommendation:** Include but don't prioritize

### Examples
```
Mobile Phones:
smartphones, phones, Android, iOS, mobile devices

Rice & Grains:
rice, grains, basmati, samba, කුරුඳු සහල්
```

### Expected Outcome
```
seo_keywords = models.CharField(
    max_length=255,
    blank=True,
    null=True,
    verbose_name='SEO Keywords',
    help_text='Comma-separated keywords (optional, legacy SEO)'
)
```

### Verification Steps
- Check CharField with max_length 255
- Verify blank=True and null=True
- Confirm help text notes legacy status

---

## Task 30: Define MPTTMeta Class

### Overview
Configure MPTT-specific options using the MPTTMeta inner class.

### Dependencies
- Task 29: Add seo_keywords Field

### Instructions

1. **Create MPTTMeta inner class**
   - Add class named MPTTMeta inside Category model
   - Placed after all field definitions
   - Before methods section

2. **Configure order_insertion_by**
   - Sets default ordering for children
   - Use: ['display_order', 'name']
   - Primary sort by display_order, then name

3. **Add class docstring**
   - Explain MPTT configuration
   - Document ordering strategy

4. **Understand MPTT options**
   - order_insertion_by: How children are ordered
   - parent_attr: Parent field name (default: 'parent')
   - left_attr: Left field name (default: 'lft')
   - right_attr: Right field name (default: 'rght')

### MPTTMeta Configuration Options
| Option | Purpose | Default | Our Value |
|--------|---------|---------|-----------|
| order_insertion_by | Child ordering | None | ['display_order', 'name'] |
| parent_attr | Parent field name | 'parent' | 'parent' (default) |
| left_attr | Left field name | 'lft' | 'lft' (default) |
| right_attr | Right field name | 'rght' | 'rght' (default) |

### Ordering Strategy
```
order_insertion_by = ['display_order', 'name']

Results in:
Electronics
├── Mobile Phones (display_order=10, name=M)
├── Computers (display_order=20, name=C)
└── Accessories (display_order=30, name=A)

If display_order is same, alphabetical by name:
├── Accessories (display_order=10, name=A)
├── Computers (display_order=10, name=C)
└── Mobile Phones (display_order=10, name=M)
```

### Why order_insertion_by?
- Determines how get_children() returns nodes
- Affects tree admin display order
- Ensures consistent ordering
- Can be overridden in queries

### Expected Outcome
```
class MPTTMeta:
    """
    MPTT configuration for Category tree.
    """
    order_insertion_by = ['display_order', 'name']
```

### Verification Steps
- Check MPTTMeta class exists
- Verify order_insertion_by is set
- Confirm ordering fields are valid
- Ensure placed before methods

---

## Task 31: Add __str__ Method

### Overview
Define string representation method for Category instances.

### Dependencies
- Task 30: Define MPTTMeta Class

### Instructions

1. **Define __str__ method**
   - Return category name
   - Used in admin, shell, logs
   - Simple and descriptive

2. **Method implementation**
   - Return self.name
   - Keep simple for clarity
   - Consider adding parent for nested display

3. **Add method docstring**
   - Explain return value
   - Document usage

4. **Consider nested display**
   - Option 1: Just name (simple)
   - Option 2: Full path (verbose but clear)
   - Recommendation: Just name for simplicity

### String Representation Options
| Style | Example | Pros | Cons |
|-------|---------|------|------|
| **Name Only** | "Smartphones" | Simple, clean | No context |
| **With Parent** | "Mobile Phones > Smartphones" | Clear hierarchy | Longer |
| **Full Path** | "Electronics > Mobile > Smartphones" | Complete context | Very long |

**Recommendation:** Use name only for simplicity

### Usage Contexts
- Admin list display: Shows category name
- Admin dropdowns: Parent selection
- Django shell: Object representation
- Logging: Error messages, debug output
- Foreign key displays: Related objects

### Expected Outcome
```
def __str__(self):
    """Return string representation of category."""
    return self.name
```

### Alternative with Path (Optional)
```
def __str__(self):
    """Return string representation with parent path."""
    if self.parent:
        return f"{self.parent.name} > {self.name}"
    return self.name
```

### Verification Steps
- Check method is defined
- Verify returns self.name
- Confirm docstring is present
- Ensure proper indentation

---

## Task 32: Export Category Model

### Overview
Export the Category model from the models module __init__.py for easy importing.

### Dependencies
- Task 31: Add __str__ Method

### Instructions

1. **Open models/__init__.py**
   - Navigate to backend/apps/categories/models/__init__.py
   - This file created in Group A

2. **Import Category model**
   - Add import statement
   - from .category import Category

3. **Define __all__ list**
   - Create __all__ list with exported names
   - Include 'Category'
   - Enables: from apps.categories.models import Category

4. **Add module docstring**
   - Document exported models
   - Mention MPTT structure

5. **Prepare for additional models**
   - Leave space for future imports
   - Managers will be added in Group C

### Export Pattern
```
# backend/apps/categories/models/__init__.py

"""
Category models for hierarchical product organization.

Uses MPTT for efficient tree operations.
"""

from .category import Category

__all__ = [
    'Category',
]
```

### Why __all__?
- Controls `from models import *`
- Documents public API
- IDE autocomplete support
- Prevents accidental imports

### Import Convenience
```
Before (without __init__.py export):
from apps.categories.models.category import Category

After (with __init__.py export):
from apps.categories.models import Category
```

### Expected Outcome
```
backend/apps/categories/models/
├── __init__.py              # Updated with exports
└── category.py              # Complete Category model
```

### Verification Steps
- Check import statement is correct
- Verify __all__ list is defined
- Test import works: `from apps.categories.models import Category`
- Confirm docstring is present

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 27 | Add seo_title Field | CharField for meta title |
| 28 | Add seo_description Field | CharField for meta description |
| 29 | Add seo_keywords Field | CharField for keywords |
| 30 | Define MPTTMeta Class | MPTT configuration |
| 31 | Add __str__ Method | String representation |
| 32 | Export Category Model | Model exported from module |

### Complete Category Model Structure
```
Category Model (Complete):
├── Inherited from BaseModel:
│   ├── id (UUID)
│   ├── created_at, updated_at
│   └── created_by, updated_by
├── Inherited from MPTTModel:
│   ├── lft, rght, tree_id, level
│   └── Tree methods (get_ancestors, get_descendants, etc.)
├── Basic Fields:
│   ├── name
│   ├── slug
│   └── parent
├── Display Fields:
│   ├── description
│   ├── image
│   ├── icon
│   ├── is_active
│   └── display_order
├── SEO Fields (NEW):
│   ├── seo_title
│   ├── seo_description
│   └── seo_keywords
├── Configuration:
│   ├── MPTTMeta (order_insertion_by)
│   └── __str__ method
└── Exported from models module
```

### Group B Complete
All 18 tasks in Group B are documented:
- Category model file created
- All fields defined (basic, display, SEO)
- MPTT configuration completed
- String representation added
- Model properly exported

### Dependencies Satisfied for Group C
- Complete Category model exists
- All fields defined
- MPTT configured
- Ready for custom managers and querysets

### Next Steps
Proceed to [../Group-C_Category-Manager-QuerySets/](../Group-C_Category-Manager-QuerySets/) to create custom managers and querysets for efficient category operations.

---

## Notes for AI Agents

1. **SEO Fields:** Optional but important for webstore visibility
2. **Character Limits:** Based on Google's display limits
3. **MPTTMeta:** Controls child ordering within same parent
4. **order_insertion_by:** Use display_order first, then name
5. **__str__ Method:** Keep simple (just name) for clarity
6. **Export Pattern:** Always export models in __init__.py
7. **SEO Best Practices:** Follow character limits and include keywords
8. **Model Complete:** All required fields now defined
9. **Migration Ready:** Can now create database migration
10. **Next Group:** Will add custom managers for tree operations
