# Tasks 14-16: Filename, Signals & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** A - Product Image Models  
> **Document:** 04 of 04  
> **Tasks Covered:** 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-10-13_Manager-Constraints-Validation.md](03_Tasks-10-13_Manager-Constraints-Validation.md)
- **→ Next Group:** [../Group-B_Image-Processing-Pipeline/](../Group-B_Image-Processing-Pipeline/)

---

## Document Overview

This document completes Group A by adding original filename storage, implementing pre-save signals for automatic metadata extraction, and configuring the Django admin interface with image previews and filters.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 14 | Add original_filename field | Low |
| 15 | Create ProductImage signals | Medium |
| 16 | Create ProductImage admin | Medium |

---

## Task 14: Add original_filename Field

### Overview
Add a field to store the original uploaded filename before it gets renamed to UUID format. This preserves user's original filename for reference and potential download features.

### Dependencies
- Task 09: Create ProductImage Meta class

### Instructions

1. **Open product_image.py**
   - Open `backend/apps/products/media/models/product_image.py`
   - Add new field to ProductImage model

2. **Add original_filename field**
   - Create `original_filename` field as CharField
   - Set `max_length=255`
   - Set `blank=True`
   - Set `editable=False` (automatically populated)
   - Add `help_text`: "Original filename when uploaded"

3. **Document field purpose**
   - Add comment explaining this preserves user's original filename
   - Note that actual stored file will have UUID name
   - Useful for download features or debugging

4. **Add to admin list display**
   - Will be useful in admin to see original names
   - Helps administrators identify images

### Field Purpose

| Aspect | Description |
|--------|-------------|
| **Stored Filename** | `a1b2c3d4-5e6f-7890.jpg` (UUID) |
| **Original Filename** | `summer-collection-tshirt-red.jpg` |
| **User Benefit** | Can see meaningful name instead of UUID |
| **Download Feature** | Can offer download with original filename |
| **Debugging** | Easier to identify which image was uploaded |

### Use Cases

```
Use Case 1: Admin Interface
Admin views:
ID | Image | Original Filename | Product
1  | [img] | summer-red-shirt.jpg | T-Shirt Red
2  | [img] | winter-blue-jacket.jpg | Jacket Blue

Without original_filename:
ID | Image | Product
1  | [img] | T-Shirt Red  (which image is this?)
2  | [img] | Jacket Blue  (hard to identify)

Use Case 2: Download Feature
User clicks "Download Original"
→ Browser downloads as "summer-red-shirt.jpg"
   instead of "a1b2c3d4-5e6f-7890.jpg"

Use Case 3: API Response
{
  "id": 1,
  "url": "/media/.../a1b2c3d4.jpg",
  "original_filename": "summer-red-shirt.jpg",
  "display_name": "summer-red-shirt.jpg"
}
```

### Expected Outcome
```
ProductImage Model (updated):
├── product (ForeignKey)
├── image (ImageField)
├── display_order (PositiveIntegerField)
├── is_primary (BooleanField)
├── alt_text (CharField)
├── title (CharField)
├── caption (TextField)
├── width (PositiveIntegerField)
├── height (PositiveIntegerField)
├── file_size (PositiveIntegerField)
├── original_filename (CharField) ───── NEW
├── created_at (DateTimeField)
└── updated_at (DateTimeField)
```

### Verification Checklist
- [ ] original_filename field added to ProductImage
- [ ] Field type is CharField with max_length=255
- [ ] Field set to blank=True and editable=False
- [ ] help_text explains field purpose
- [ ] Comment documents why field is needed

---

## Task 15: Create ProductImage Signals

### Overview
Implement pre_save signal to automatically extract and populate width, height, file_size, and original_filename fields before saving ProductImage instances. This ensures metadata is always up-to-date.

### Dependencies
- Task 14: Add original_filename field

### Instructions

1. **Create signals file**
   - Create `signals.py` in `backend/apps/products/media/`
   - Add module docstring

2. **Import required modules**
   - Import `pre_save` from `django.db.models.signals`
   - Import `receiver` from `django.dispatch`
   - Import `PIL.Image` for dimension extraction
   - Import `ProductImage` model

3. **Create pre_save receiver function**
   - Define function `populate_image_metadata`
   - Decorate with `@receiver(pre_save, sender=ProductImage)`
   - Accept `sender, instance, **kwargs` parameters

4. **Extract original filename**
   - Check if `instance.image` exists
   - Check if `instance.original_filename` is empty
   - Extract filename: `instance.image.name.split('/')[-1]`
   - Or use `instance.image.file.name` if UploadedFile
   - Set `instance.original_filename`

5. **Extract image dimensions**
   - Open image using `PIL.Image.open(instance.image.file)`
   - Get dimensions: `width, height = image.size`
   - Set `instance.width = width`
   - Set `instance.height = height`
   - Close image after extraction

6. **Extract file size**
   - Get file size: `instance.image.file.size`
   - Set `instance.file_size = size`

7. **Add error handling**
   - Wrap in try-except block
   - Catch `IOError`, `AttributeError` exceptions
   - Log error but don't prevent save
   - Set fields to None on error

8. **Handle file not yet uploaded**
   - Check if `instance.image` exists
   - Check if file is accessible
   - Skip metadata extraction if file not ready

9. **Register signals in apps.py**
   - Open `apps.py` in media directory
   - Define `ready()` method in MediaConfig
   - Import signals: `from . import signals`

10. **Add signal documentation**
    - Document that signal runs before save
    - Note that it only runs if image field has changed
    - Explain metadata is extracted automatically

### Signal Flow Diagram

```
ProductImage.save() called
        │
        ▼
pre_save signal triggered
        │
        ▼
populate_image_metadata(sender, instance, **kwargs)
        │
        ├─► Extract original_filename
        │   └─► instance.original_filename = "photo.jpg"
        │
        ├─► Open image with PIL
        │   └─► image = PIL.Image.open(instance.image.file)
        │
        ├─► Extract dimensions
        │   └─► instance.width, instance.height = image.size
        │
        ├─► Extract file size
        │   └─► instance.file_size = instance.image.file.size
        │
        └─► Close image
            └─► image.close()
        │
        ▼
ProductImage saved with metadata
```

### Metadata Extraction Example

```
Before Signal:
instance = ProductImage(
    product=product,
    image=uploaded_file,
    original_filename=None,  ← Empty
    width=None,              ← Empty
    height=None,             ← Empty
    file_size=None           ← Empty
)

After Signal (before save):
instance = ProductImage(
    product=product,
    image=uploaded_file,
    original_filename="summer-shirt.jpg",  ← Populated
    width=1200,                            ← Populated
    height=1600,                           ← Populated
    file_size=245678                       ← Populated (bytes)
)

Saved to database with all metadata!
```

### Performance Considerations

| Operation | Time | Impact |
|-----------|------|--------|
| Extract filename | ~0.01ms | Negligible |
| Open image (PIL) | ~50ms | Moderate |
| Read dimensions | ~1ms | Negligible |
| Get file size | ~0.01ms | Negligible |
| **Total** | **~50ms** | Acceptable for upload |

### Error Handling Strategy

```
Possible Errors:
1. IOError: File not found or unreadable
2. AttributeError: image field is None
3. PIL.UnidentifiedImageError: Not a valid image
4. OSError: File system issues

Strategy:
- Catch all errors
- Log error with details
- Set metadata fields to None
- Allow save to proceed
- Don't block upload due to metadata failure
```

### Expected Outcome
```
backend/apps/products/media/
├── __init__.py
├── apps.py                         # UPDATED (register signals)
├── signals.py                      # NEW (pre_save signal)
└── models/
    └── product_image.py            # No changes (signal connects externally)
```

### Verification Checklist
- [ ] `signals.py` file created
- [ ] populate_image_metadata function defined
- [ ] Function decorated with @receiver(pre_save, sender=ProductImage)
- [ ] Extracts original_filename from uploaded file
- [ ] Extracts width and height using PIL
- [ ] Extracts file_size from file object
- [ ] Error handling with try-except
- [ ] Signals imported in apps.py ready() method
- [ ] Signal documented with comments

---

## Task 16: Create ProductImage Admin

### Overview
Configure Django admin interface for ProductImage with image preview, list display, filters, search, and inline editing capabilities. This provides a user-friendly interface for managing product images.

### Dependencies
- Task 15: Create ProductImage signals

### Instructions

1. **Create admin file**
   - Create `admin.py` in `backend/apps/products/media/`
   - Add module docstring

2. **Import required modules**
   - Import `admin` from `django.contrib`
   - Import `format_html` from `django.utils.html`
   - Import `ProductImage` from `.models`

3. **Create ProductImageAdmin class**
   - Define class inheriting from `admin.ModelAdmin`
   - Add class docstring

4. **Configure list_display**
   - Set `list_display` tuple with fields to show in list view
   - Include: `'id'`, `'image_preview'`, `'product'`, `'original_filename'`
   - Include: `'display_order'`, `'is_primary'`, `'file_size_human'`
   - Include: `'dimensions_display'`, `'created_at'`

5. **Create image_preview method**
   - Define method `image_preview(self, obj)`
   - Return HTML img tag with small preview (100px width)
   - Use `format_html()` for safe HTML
   - Handle case where image doesn't exist
   - Set `short_description = 'Preview'`

6. **Create dimensions_display method**
   - Define method `dimensions_display(self, obj)`
   - Return formatted string: `"{width} × {height}"`
   - Return "N/A" if dimensions not available
   - Set `short_description = 'Dimensions'`

7. **Configure list_filter**
   - Set `list_filter` tuple
   - Include: `'is_primary'`, `'product'`, `'created_at'`
   - Enables filtering by primary status and product

8. **Configure search_fields**
   - Set `search_fields` tuple
   - Include: `'original_filename'`, `'alt_text'`, `'title'`
   - Include: `'product__name'` (search by product name)

9. **Configure list_per_page**
   - Set `list_per_page = 50`
   - Shows 50 images per page

10. **Configure ordering**
    - Set `ordering = ['-created_at']`
    - Shows newest images first

11. **Configure readonly_fields**
    - Set `readonly_fields` tuple
    - Include: `'width'`, `'height'`, `'file_size'`, `'original_filename'`
    - Include: `'created_at'`, `'updated_at'`
    - These are auto-populated, shouldn't be edited

12. **Configure fieldsets**
    - Organize form into logical sections
    - Section 1: "Image" - image, product, display_order, is_primary
    - Section 2: "Metadata" - alt_text, title, caption
    - Section 3: "Technical Details" - width, height, file_size, original_filename
    - Section 4: "Timestamps" - created_at, updated_at

13. **Add actions**
    - Create custom action `set_as_primary_action`
    - Allows bulk setting primary images (with validation)
    - Add to `actions` list

14. **Create inline admin class**
    - Define `ProductImageInline(admin.TabularInline)`
    - Set `model = ProductImage`
    - Set `extra = 0` (no empty forms)
    - Set `fields` for inline: image, alt_text, display_order, is_primary
    - This will be used in Product admin (different subphase)

15. **Register admin**
    - Call `admin.site.register(ProductImage, ProductImageAdmin)`

### Admin Interface Layout

```
List View:
┌────┬─────────┬──────────┬────────────────────┬───────┬────────┬─────────┬──────────┬────────────┐
│ ID │ Preview │ Product  │ Original Filename  │ Order │Primary │  Size   │   Dims   │  Created   │
├────┼─────────┼──────────┼────────────────────┼───────┼────────┼─────────┼──────────┼────────────┤
│ 1  │  [IMG]  │ T-Shirt  │ red-shirt.jpg      │  10   │   ✓    │ 245 KB  │ 800×600  │ 2026-01-20 │
│ 2  │  [IMG]  │ T-Shirt  │ side-view.jpg      │  20   │   ✗    │ 198 KB  │ 800×600  │ 2026-01-20 │
│ 3  │  [IMG]  │ Jacket   │ blue-jacket.jpg    │  10   │   ✓    │ 1.2 MB  │ 1200×800 │ 2026-01-19 │
└────┴─────────┴──────────┴────────────────────┴───────┴────────┴─────────┴──────────┴────────────┘

Filters (right sidebar):
□ Is Primary
  • Yes
  • No
□ Product
  • T-Shirt
  • Jacket
  • ...
□ Created Date
  • Today
  • Past 7 days
  • This month
```

### Detail View Fieldsets

```
┌─────────────────────────────────────┐
│ Image                               │
├─────────────────────────────────────┤
│ Image: [Choose File]                │
│ Product: [T-Shirt ▼]                │
│ Display Order: [10]                 │
│ Is Primary: ☑                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Metadata                            │
├─────────────────────────────────────┤
│ Alt Text: [Red cotton t-shirt]      │
│ Title: [T-Shirt Front View]         │
│ Caption: [Summer collection...]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Technical Details (Read-only)       │
├─────────────────────────────────────┤
│ Width: 800 px                       │
│ Height: 600 px                      │
│ File Size: 245 KB                   │
│ Original Filename: red-shirt.jpg    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Timestamps (Read-only)              │
├─────────────────────────────────────┤
│ Created: 2026-01-20 10:30:00        │
│ Updated: 2026-01-20 10:30:00        │
└─────────────────────────────────────┘
```

### Custom Actions

```
Set as Primary Action:

Selected images: [2 images selected]
Action: [Set as Primary ▼] [Go]

Validation:
- Can only select images from ONE product
- If multiple products selected → Error
- If multiple images from same product → Error
  (can only set one as primary)

Success:
- Image set as primary
- Other images from same product set to non-primary
- Message: "Image set as primary for Product X"
```

### Inline Admin Usage

```
Product Admin Form:
┌─────────────────────────────────────┐
│ Product: T-Shirt                    │
├─────────────────────────────────────┤
│ Name: [T-Shirt Red]                 │
│ SKU: [TSH-001]                      │
│ ...                                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Product Images (inline)             │
├─────────────────────────────────────┤
│ Image      Alt Text          Order  Primary │
│ [Choose]   [Front view]      [10]   ☑      │
│ [Choose]   [Side view]       [20]   ☐      │
│ [Choose]   [Back view]       [30]   ☐      │
│ [Add another image]                        │
└─────────────────────────────────────┘
```

### Expected Outcome
```
backend/apps/products/media/
├── admin.py                        # NEW (ProductImageAdmin)
├── signals.py
└── models/
    └── product_image.py

Admin features:
├── List view with image previews
├── Search by filename, alt text, product
├── Filter by primary status, product, date
├── Custom display methods (preview, dimensions)
├── Organized fieldsets
├── Readonly auto-populated fields
├── Custom action (set as primary)
└── Inline admin for use in Product admin
```

### Verification Checklist
- [ ] `admin.py` file created
- [ ] ProductImageAdmin class defined
- [ ] list_display includes id, preview, product, filename, order
- [ ] image_preview method shows thumbnail
- [ ] dimensions_display method shows width×height
- [ ] list_filter includes is_primary, product, created_at
- [ ] search_fields includes filename, alt_text, title, product name
- [ ] readonly_fields includes auto-populated fields
- [ ] fieldsets organize form into logical sections
- [ ] set_as_primary_action custom action defined
- [ ] ProductImageInline defined for Product admin
- [ ] ProductImageAdmin registered with admin.site

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 14 | Add original_filename field | Field to preserve user's original filename |
| 15 | Create ProductImage signals | pre_save signal for automatic metadata extraction |
| 16 | Create ProductImage admin | Full-featured admin with previews and filters |

### Group A Complete Structure

```
backend/apps/products/media/
├── __init__.py
├── apps.py (MediaConfig with signals registration)
├── constants.py (size constants, format definitions)
├── utils.py (upload path functions)
├── validators.py (image validation functions)
├── signals.py (pre_save signal) ───────────── NEW
├── admin.py (ProductImageAdmin) ───────────── NEW
├── models/
│   ├── __init__.py (exports ProductImage)
│   └── product_image.py (complete model)
└── managers/
    └── image_manager.py (custom manager)
```

### ProductImage Model Final Feature Set

✅ **Core Functionality:**
- Product relationship with CASCADE delete
- Image file storage with tenant-aware paths
- Gallery ordering with display_order
- Primary image designation

✅ **Metadata:**
- SEO fields (alt_text, title, caption)
- Dimension tracking (width, height)
- File size tracking
- Original filename preservation

✅ **Data Integrity:**
- Database constraint (one primary per product)
- Comprehensive validation (type, size, dimensions)
- Atomic set_as_primary method

✅ **Developer Experience:**
- Custom manager with 6 convenience methods
- Properties (aspect_ratio, file_size_human, etc.)
- Automatic metadata extraction via signals
- Full-featured admin interface

### Admin Features Summary

| Feature | Description |
|---------|-------------|
| **Image Preview** | 100px thumbnail in list view |
| **Search** | By filename, alt text, product name |
| **Filters** | By primary status, product, date |
| **Readonly Fields** | Auto-populated fields protected |
| **Fieldsets** | Organized form sections |
| **Custom Actions** | Set as primary bulk action |
| **Inline Admin** | For use in Product admin |

### Next Steps
**Group A is now complete!** Proceed to [../Group-B_Image-Processing-Pipeline/](../Group-B_Image-Processing-Pipeline/) to implement automatic image resizing, thumbnail generation, and async processing with Celery.

---

## Notes for AI Agents

1. **Signals Registration:** Must register in apps.py ready() method
2. **PIL Extraction:** ~50ms per image, acceptable for upload flow
3. **Admin Previews:** Use format_html for safe HTML rendering
4. **Inline Admin:** Will be referenced in Product admin (different subphase)
5. **Error Handling:** Metadata extraction failures don't block save
6. **Performance:** Admin list view limited to 50 items per page
7. **Security:** Readonly fields prevent manual editing of auto-values
8. **Group Complete:** All 16 tasks in Group A finished
9. **Next Group:** Image Processing Pipeline (Tasks 17-32)
10. **Ready for Migration:** Can now create and run migrations for ProductImage model
