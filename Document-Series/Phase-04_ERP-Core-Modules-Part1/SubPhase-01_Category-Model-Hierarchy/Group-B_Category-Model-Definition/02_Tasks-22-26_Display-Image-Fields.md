# Tasks 22-26: Display & Image Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** B - Category Model Definition  
> **Document:** 02 of 03  
> **Tasks Covered:** 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-21_Category-Class-Basic-Fields.md](01_Tasks-15-21_Category-Class-Basic-Fields.md)
- **→ Next Document:** [03_Tasks-27-32_SEO-Fields-Meta-Export.md](03_Tasks-27-32_SEO-Fields-Meta-Export.md)

---

## Document Overview

This document covers adding display-related fields including description, image, icon, status flag, and display ordering. These fields control how categories appear in the webstore and admin interface.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 22 | Add description Field | Low |
| 23 | Add image Field | Medium |
| 24 | Add icon Field | Low |
| 25 | Add is_active Field | Low |
| 26 | Add display_order Field | Low |

---

## Task 22: Add description Field

### Overview
Add a rich text description field for category information displayed on webstore category pages.

### Dependencies
- Task 21: Add parent Field

### Instructions

1. **Add TextField for description**
   - Field type: TextField (unlimited length)
   - Optional field (blank=True, null=True)
   - Can contain HTML or markdown

2. **Configure description attributes**
   - blank: True (optional, not all categories need descriptions)
   - null: True (NULL in database when empty)
   - verbose_name: 'Description'

3. **Add help text**
   - Explain usage: "Detailed category description for webstore"
   - Mention HTML/markdown support if applicable

4. **Consider rich text editor**
   - Plan for rich text in admin (CKEditor, TinyMCE)
   - Support for formatting, links, lists
   - Sanitize HTML to prevent XSS

5. **Plan multi-language descriptions**
   - Primary description in English
   - Consider translation fields for Sinhala
   - Use django-parler or similar for i18n

### Description Field Usage
| Use Case | Example |
|----------|---------|
| **Webstore Category Page** | Display full description at top of category |
| **SEO Content** | Search engines index description text |
| **Customer Information** | Explain what products are in this category |
| **Admin Reference** | Help staff understand category purpose |

### Rich Text Considerations
- Support basic formatting (bold, italic, lists)
- Allow links to other pages
- Image embedding (optional)
- Sanitize user-generated content
- Preview in admin interface

### Expected Outcome
```
description = models.TextField(
    blank=True,
    null=True,
    verbose_name='Description',
    help_text='Detailed description for webstore display'
)
```

### Verification Steps
- Check TextField is used (not CharField)
- Verify blank=True and null=True
- Confirm help text is descriptive

---

## Task 23: Add image Field

### Overview
Add an image field for category visual representation in webstore navigation and listings.

### Dependencies
- Task 22: Add description Field

### Instructions

1. **Add ImageField for image**
   - Field type: ImageField
   - Optional (blank=True, null=True)
   - Upload to tenant-specific directory

2. **Configure upload path**
   - upload_to: 'categories/images/'
   - Include tenant schema in path for isolation
   - Use callable function for dynamic paths

3. **Add image constraints**
   - Consider max file size
   - Recommended formats: JPG, PNG, WebP
   - Dimension recommendations for consistency

4. **Configure field attributes**
   - blank: True (not all categories have images)
   - null: True (NULL when no image)
   - verbose_name: 'Category Image'

5. **Plan image processing**
   - Generate thumbnails for performance
   - Use django-imagekit or Pillow
   - Different sizes: thumbnail, medium, large
   - Lazy loading in webstore

6. **Ensure tenant isolation**
   - Store images in tenant-specific paths
   - Format: tenant_{schema}/categories/images/
   - Prevents cross-tenant file access

### Image Storage Strategy
| Aspect | Implementation |
|--------|----------------|
| **Storage Backend** | FileSystemStorage or S3 |
| **Path Structure** | tenant_{schema}/categories/images/ |
| **File Naming** | UUID or slugified names |
| **Thumbnails** | Generated on upload or on-demand |

### Upload Path Function Example (Concept)
```
Upload path should include:
- Tenant schema identifier
- 'categories' directory
- 'images' subdirectory
- Unique filename (UUID or timestamp)
```

### Image Specifications
| Specification | Recommended Value |
|---------------|------------------|
| **Format** | JPG, PNG, WebP |
| **Max Size** | 2MB |
| **Dimensions** | 800x800px (square) |
| **Thumbnail** | 200x200px |
| **Medium** | 400x400px |

### Tenant Isolation Critical
```
Correct Path Structure:
tenant_abc123/
  └── categories/
      └── images/
          ├── electronics.jpg
          └── clothing.png

tenant_xyz789/
  └── categories/
      └── images/
          ├── electronics.jpg  # Different file, same name OK
          └── furniture.png
```

### Expected Outcome
```
image = models.ImageField(
    upload_to='categories/images/',  # Will add tenant prefix
    blank=True,
    null=True,
    verbose_name='Category Image',
    help_text='Main category image for webstore display'
)
```

### Verification Steps
- Check ImageField is used
- Verify upload_to path includes categories
- Confirm blank=True and null=True
- Ensure tenant isolation in path

---

## Task 24: Add icon Field

### Overview
Add an icon field for storing CSS icon class names (Font Awesome, Material Icons) for UI display.

### Dependencies
- Task 23: Add image Field

### Instructions

1. **Add CharField for icon**
   - Field type: CharField
   - max_length: 100 characters
   - Optional field (blank=True, null=True)

2. **Configure icon field**
   - Stores CSS class name
   - Example: 'fas fa-mobile-alt' (Font Awesome)
   - Example: 'mdi mdi-laptop' (Material Design Icons)

3. **Add field attributes**
   - blank: True (icons are optional)
   - null: True (NULL when not used)
   - verbose_name: 'Icon Class'

4. **Document icon format**
   - Help text explains format
   - Reference to icon library used
   - Example class names

5. **Plan icon library**
   - Choose icon set (Font Awesome, Material Icons)
   - Include in frontend bundles
   - Admin interface icon picker (optional)

### Icon vs Image
| Use Case | Icon | Image |
|----------|------|-------|
| **Navigation Menus** | ✓ Fast, scalable | Heavy, slower |
| **Mobile App** | ✓ Consistent size | Variable sizes |
| **Category Cards** | Limited variety | ✓ Unique visuals |
| **Breadcrumbs** | ✓ Space efficient | Too large |

**Recommendation:** Use both - icons for navigation, images for banners

### Icon Library Options
| Library | Prefix | Example | Count |
|---------|--------|---------|-------|
| **Font Awesome** | fa, fas, far | fas fa-mobile-alt | 7,000+ |
| **Material Icons** | mdi | mdi-laptop | 6,000+ |
| **Bootstrap Icons** | bi | bi-phone | 1,800+ |

### Icon Usage Examples
```
Electronics → fas fa-bolt (lightning bolt)
Mobile Phones → fas fa-mobile-alt (phone)
Laptops → fas fa-laptop (laptop)
Clothing → fas fa-tshirt (t-shirt)
Food → fas fa-apple-alt (apple)
```

### Expected Outcome
```
icon = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    verbose_name='Icon Class',
    help_text='CSS icon class (e.g., fas fa-mobile-alt)'
)
```

### Verification Steps
- Check CharField with appropriate length
- Verify blank=True and null=True
- Confirm help text with examples

---

## Task 25: Add is_active Field

### Overview
Add a boolean flag to control category visibility in the webstore and admin.

### Dependencies
- Task 24: Add icon Field

### Instructions

1. **Add BooleanField for is_active**
   - Field type: BooleanField
   - Default: True (new categories active by default)
   - Required field (no blank or null)

2. **Configure field attributes**
   - default: True
   - db_index: True (frequently queried)
   - verbose_name: 'Active'

3. **Add help text**
   - Explain behavior when inactive
   - "Inactive categories are hidden from webstore"

4. **Document active/inactive behavior**
   - Active: Visible in webstore, products accessible
   - Inactive: Hidden from public, admin can still see
   - Consider child category behavior

5. **Plan filtering logic**
   - API should filter active categories by default
   - Admin can view all categories
   - Consider parent inactive affects children

### Active Status Behavior
| Status | Webstore | Admin | API (Public) | API (Admin) |
|--------|----------|-------|--------------|-------------|
| **Active** | Visible | Visible | Returned | Returned |
| **Inactive** | Hidden | Visible | Filtered | Returned |

### Cascade Behavior Considerations
```
If parent is inactive, should children be hidden too?

Option 1: Hide children automatically
- Simpler logic
- Consistent behavior

Option 2: Allow children to be visible
- More flexible
- Requires breadcrumb handling

Recommended: Option 1 - hide children when parent inactive
```

### Use Cases for Inactive Status
| Scenario | Action |
|----------|--------|
| **Seasonal Categories** | Deactivate off-season |
| **Temporary Removal** | Deactivate instead of delete |
| **Testing** | Deactivate until ready |
| **Discontinued Products** | Deactivate empty categories |

### Database Indexing
is_active should be indexed because:
- Frequently queried in filters
- Used in every public API call
- Combined with other filters
- Performance critical for webstore

### Expected Outcome
```
is_active = models.BooleanField(
    default=True,
    db_index=True,
    verbose_name='Active',
    help_text='Inactive categories are hidden from webstore'
)
```

### Verification Steps
- Check BooleanField is used
- Verify default=True
- Confirm db_index=True
- Ensure help text is clear

---

## Task 26: Add display_order Field

### Overview
Add an integer field for manual sorting control within same parent level.

### Dependencies
- Task 25: Add is_active Field

### Instructions

1. **Add PositiveIntegerField for display_order**
   - Field type: PositiveIntegerField
   - Default: 0
   - Used for manual sorting

2. **Configure field attributes**
   - default: 0
   - db_index: True (used in ORDER BY)
   - verbose_name: 'Display Order'

3. **Add help text**
   - Explain sorting behavior
   - "Lower numbers appear first"

4. **Plan ordering strategy**
   - Primary sort: display_order
   - Secondary sort: name (alphabetical)
   - Applies within same parent level

5. **Consider admin interface**
   - Drag-drop reordering updates this field
   - MPTT admin supports reordering
   - Inline editing for quick updates

### Display Order Usage
```
Same Parent - Different display_order:

Electronics (parent=None)
├── Mobile Phones (display_order=10)
├── Laptops (display_order=20)
└── Accessories (display_order=30)

User drags Accessories above Laptops:
├── Mobile Phones (display_order=10)
├── Accessories (display_order=15)  # Updated
└── Laptops (display_order=20)
```

### Ordering Strategy
| Level | Primary Sort | Secondary Sort |
|-------|-------------|----------------|
| **Same Parent** | display_order ASC | name ASC |
| **Tree Display** | MPTT tree order | display_order ASC |
| **API Response** | display_order ASC | name ASC |

### Why PositiveIntegerField?
- Only positive numbers allowed
- Zero is valid (default)
- Sufficient range (0 to 2,147,483,647)
- Database storage efficient

### Display Order Best Practices
- Use increments of 10: 10, 20, 30, 40...
- Allows inserting between (15, 25, 35)
- Avoid gaps of 1: 1, 2, 3, 4... (hard to reorder)
- Periodically normalize to clean gaps

### Expected Outcome
```
display_order = models.PositiveIntegerField(
    default=0,
    db_index=True,
    verbose_name='Display Order',
    help_text='Sort order within parent (lower numbers first)'
)
```

### Verification Steps
- Check PositiveIntegerField is used
- Verify default=0
- Confirm db_index=True
- Ensure help text explains sorting

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 22 | Add description Field | TextField for rich text description |
| 23 | Add image Field | ImageField with tenant isolation |
| 24 | Add icon Field | CharField for CSS icon classes |
| 25 | Add is_active Field | BooleanField for visibility control |
| 26 | Add display_order Field | PositiveIntegerField for sorting |

### What Was Accomplished
- Rich text description field for webstore content
- Image field with tenant-isolated storage
- Icon field for navigation and UI elements
- Active status flag for visibility control
- Display order field for manual sorting

### Current Model Fields (Summary)
```
Category Model Fields (so far):
├── From BaseModel: id, created_at, updated_at, created_by, updated_by
├── From MPTTModel: lft, rght, tree_id, level
├── Basic Fields:
│   ├── name (CharField)
│   ├── slug (SlugField)
│   └── parent (TreeForeignKey)
└── Display Fields (NEW):
    ├── description (TextField)
    ├── image (ImageField)
    ├── icon (CharField)
    ├── is_active (BooleanField)
    └── display_order (PositiveIntegerField)
```

### Dependencies Satisfied for Next Document
- All display fields added
- Ready for SEO fields
- Ready for Meta class configuration

### Next Steps
Proceed to [03_Tasks-27-32_SEO-Fields-Meta-Export.md](03_Tasks-27-32_SEO-Fields-Meta-Export.md) to add SEO fields, configure MPTTMeta, and export the model.

---

## Notes for AI Agents

1. **Tenant Isolation:** Image paths must include tenant schema for data isolation
2. **Rich Text:** Description supports HTML/markdown for formatting
3. **Icon Library:** Choose consistent icon set (Font Awesome recommended)
4. **Active Status:** Index is_active field for query performance
5. **Display Order:** Use increments of 10 for flexible reordering
6. **Image Processing:** Plan thumbnail generation strategy
7. **NULL vs Blank:** Optional fields should have both blank=True and null=True
8. **Cascade Inactive:** Consider hiding children when parent is inactive
9. **Storage Backend:** Plan for local storage or S3 for images
10. **Admin UI:** Enable drag-drop reordering for display_order field
