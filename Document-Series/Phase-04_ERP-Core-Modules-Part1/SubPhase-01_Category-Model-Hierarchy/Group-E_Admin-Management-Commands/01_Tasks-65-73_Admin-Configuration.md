# Tasks 65-73: Admin Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** E - Admin & Management Commands  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Category-Serializers-Views/](../Group-D_Category-Serializers-Views/)
- **→ Next Document:** [02_Tasks-74-78_Management-Commands.md](02_Tasks-74-78_Management-Commands.md)

---

## Document Overview

This document covers creating Django admin configuration for Category model with MPTT tree display and drag-drop reordering.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 65 | Create admin.py File | Low |
| 66 | Import MPTTModelAdmin | Low |
| 67 | Create CategoryAdmin Class | Medium |
| 68 | Configure list_display | Low |
| 69 | Configure list_filter | Low |
| 70 | Configure search_fields | Low |
| 71 | Configure prepopulated_fields | Low |
| 72 | Configure ordering | Low |
| 73 | Enable Drag-Drop Reordering | High |

---

## Task 65-67: Admin Base Setup

### Overview
Create admin.py and CategoryAdmin class with MPTT support.

### Instructions

1. **Verify admin.py exists**
   - Should be created by Django startapp
   - Path: backend/apps/categories/admin.py

2. **Import required modules**
   - from django.contrib import admin
   - from mptt.admin import MPTTModelAdmin
   - from .models import Category

3. **Create CategoryAdmin class**
   - Inherit from MPTTModelAdmin
   - Enables tree display in admin

4. **Register admin class**
   - admin.site.register(Category, CategoryAdmin)

### MPTTModelAdmin Features
- Tree-based display with indentation
- Expand/collapse nodes
- Visual hierarchy representation
- Drag-drop reordering support
- Parent-child relationship visualization

---

## Task 68: Configure list_display

### Overview
Configure which fields appear in admin list view.

### Instructions

1. **Set list_display tuple**
   - Show key fields in list view
   - Include name, parent, is_active, display_order

2. **Add custom methods for display**
   - parent_name: Show parent category name
   - children_count: Show number of children

3. **Configure field order**
   - Most important fields first
   - Actions column last

### Recommended list_display
```
list_display = [
    'name',
    'parent',
    'display_order',
    'is_active',
    'children_count',
    'created_at'
]
```

---

## Task 69: Configure list_filter

### Overview
Add sidebar filters for easy category filtering.

### Instructions

1. **Set list_filter tuple**
   - is_active: Filter by status
   - parent: Filter by parent category
   - created_at: Filter by date

2. **Add custom filters if needed**
   - RootCategoryFilter: Show only roots
   - LeafCategoryFilter: Show only leaves

### Recommended list_filter
```
list_filter = [
    'is_active',
    'parent',
    'created_at',
    'updated_at'
]
```

---

## Task 70: Configure search_fields

### Overview
Enable search functionality in admin.

### Instructions

1. **Set search_fields list**
   - name: Primary search field
   - description: Secondary search
   - slug: URL identifier search

2. **Use search operators**
   - '^name': Starts with
   - '=slug': Exact match
   - '@description': Full-text search

### Recommended search_fields
```
search_fields = [
    'name',
    'slug',
    'description'
]
```

---

## Task 71: Configure prepopulated_fields

### Overview
Auto-populate slug field from name in admin forms.

### Instructions

1. **Set prepopulated_fields dict**
   - Key: field to populate (slug)
   - Value: source field(s) (name)

2. **Enable auto-slugification**
   - Slug auto-fills as name is typed
   - Can be manually edited if needed

### Configuration
```
prepopulated_fields = {
    'slug': ('name',)
}
```

---

## Task 72: Configure ordering

### Overview
Set default ordering for admin list view.

### Instructions

1. **Set ordering tuple**
   - Primary: display_order
   - Secondary: name (alphabetical)

2. **Tree-aware ordering**
   - MPTT maintains tree structure
   - ordering applies within same level

### Configuration
```
ordering = ['display_order', 'name']
```

---

## Task 73: Enable Drag-Drop Reordering

### Overview
Enable drag-drop reordering in MPTT admin for easy tree management.

### Instructions

1. **Verify MPTTModelAdmin**
   - Provides drag-drop by default
   - Works with modern browsers

2. **Configure tree display options**
   - Set indentation level
   - Configure expand/collapse behavior

3. **Add JavaScript for drag-drop**
   - MPTTModelAdmin includes this automatically
   - Ensure static files are collected

4. **Test drag-drop functionality**
   - Move categories to different parents
   - Reorder within same parent
   - Verify tree structure updates

### MPTT Admin Features
| Feature | Description |
|---------|-------------|
| **Tree Display** | Hierarchical indentation |
| **Drag-Drop** | Move categories visually |
| **Expand/Collapse** | Show/hide children |
| **Level Indicators** | Visual depth markers |

### Configuration
```
class CategoryAdmin(MPTTModelAdmin):
    """
    Admin configuration for Category model with MPPT tree display.
    """
    list_display = ['name', 'parent', 'is_active', 'display_order']
    list_filter = ['is_active', 'parent']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']
    
    # MPTT specific
    mptt_level_indent = 20  # Pixel indentation per level
```

---

## Summary

### Tasks Completed
All admin configuration tasks completed:
- MPTTModelAdmin integration
- List display configured
- Filters and search enabled
- Auto-slug generation
- Drag-drop reordering

### Admin Features
```
CategoryAdmin:
├── Tree-based display
├── Drag-drop reordering
├── Search by name/slug/description
├── Filter by status/parent/date
├── Auto-slug from name
└── Custom field display
```

### Next Steps
Proceed to [02_Tasks-74-78_Management-Commands.md](02_Tasks-74-78_Management-Commands.md) to create management commands.

---

## Notes for AI Agents

1. **MPTTModelAdmin:** Essential for tree display
2. **list_display:** Show important fields only
3. **prepopulated_fields:** Auto-slug very useful
4. **Drag-Drop:** Enabled automatically by MPPT
5. **Static Files:** Collect static for drag-drop JavaScript
6. **Tree Structure:** Visual hierarchy in admin
7. **Ordering:** Applies within same tree level
8. **Search:** Enable multiple field search
9. **Filters:** Make common queries easy
10. **Testing:** Test drag-drop after setup
