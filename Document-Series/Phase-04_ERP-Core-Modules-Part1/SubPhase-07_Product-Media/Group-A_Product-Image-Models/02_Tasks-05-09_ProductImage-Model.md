# Tasks 05-09: ProductImage Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** A - Product Image Models  
> **Document:** 02 of 04  
> **Tasks Covered:** 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Media-App-Setup.md](01_Tasks-01-04_Media-App-Setup.md)
- **→ Next Document:** [03_Tasks-10-13_Manager-Constraints-Validation.md](03_Tasks-10-13_Manager-Constraints-Validation.md)

---

## Document Overview

This document covers the creation of the core ProductImage model with all essential fields for storing product images, metadata, dimensions, and file size. The model establishes the foundation for product image management with proper database configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Create ProductImage model | Medium |
| 06 | Add image metadata fields | Low |
| 07 | Add image dimension fields | Low |
| 08 | Add file size tracking | Low |
| 09 | Create ProductImage Meta class | Low |

---

## Task 05: Create ProductImage Model

### Overview
Create the core ProductImage model that represents uploaded product images. This model links images to products with ordering and primary image designation capabilities.

### Dependencies
- Task 01: Create media app structure
- Task 04: Create image upload path function
- SubPhase-03: Product Base Model (Product model exists)

### Instructions

1. **Create model file**
   - Create `product_image.py` in `backend/apps/products/media/models/`
   - Add module docstring explaining the model's purpose

2. **Import required modules**
   - Import `models` from `django.db`
   - Import `Product` model from `apps.products.models`
   - Import `product_image_upload_path` from `..utils`
   - Import `TenantAwareModel` from `apps.core.models` (base model from Phase-03)

3. **Define ProductImage model class**
   - Create class `ProductImage` inheriting from `TenantAwareModel`
   - Add class docstring describing the model's purpose
   - This model stores product images with metadata

4. **Add product foreign key**
   - Create `product` field as ForeignKey to Product
   - Set `on_delete=models.CASCADE` (delete images when product deleted)
   - Set `related_name='images'` for reverse relation
   - Add `help_text` explaining the relationship

5. **Add image file field**
   - Create `image` field as ImageField
   - Set `upload_to=product_image_upload_path` (function from Task 04)
   - Set `max_length=500` for file path storage
   - Add `help_text` explaining accepted formats

6. **Add display order field**
   - Create `display_order` field as PositiveIntegerField
   - Set `default=0`
   - Set `db_index=True` for efficient ordering queries
   - Add `help_text`: "Order of image in gallery (lower numbers first)"

7. **Add is_primary flag**
   - Create `is_primary` field as BooleanField
   - Set `default=False`
   - Set `db_index=True` for quick primary image lookup
   - Add `help_text`: "Designate as the main product image"

8. **Add created_at timestamp**
   - Create `created_at` field as DateTimeField
   - Set `auto_now_add=True` for automatic timestamp on creation
   - Add `help_text`: "When the image was uploaded"

9. **Add updated_at timestamp**
   - Create `updated_at` field as DateTimeField
   - Set `auto_now=True` for automatic timestamp on updates
   - Add `help_text`: "When the image was last modified"

10. **Add string representation**
    - Define `__str__()` method
    - Return format: `Product {product_id} - Image {id}`
    - Makes admin interface more readable

### Model Field Summary

| Field | Type | Purpose | Indexed |
|-------|------|---------|---------|
| product | ForeignKey | Links to product | Yes (FK) |
| image | ImageField | Stores image file | No |
| display_order | PositiveIntegerField | Gallery ordering | Yes |
| is_primary | BooleanField | Primary image flag | Yes |
| created_at | DateTimeField | Upload timestamp | No |
| updated_at | DateTimeField | Modification timestamp | No |

### Relationship Diagram

```
Product (1) ─────< (Many) ProductImage
    │
    │ has many images
    │
    ▼
[ProductImage 1] display_order=10, is_primary=True
[ProductImage 2] display_order=20, is_primary=False
[ProductImage 3] display_order=30, is_primary=False
```

### Expected Outcome
```
backend/apps/products/media/models/
├── __init__.py                     # Will import ProductImage
└── product_image.py                # NEW (ProductImage model)
```

### Verification Checklist
- [ ] `product_image.py` file created
- [ ] ProductImage class inherits from TenantAwareModel
- [ ] product ForeignKey defined with CASCADE delete
- [ ] image ImageField defined with upload_to function
- [ ] display_order field defined with index
- [ ] is_primary field defined with index
- [ ] Timestamp fields (created_at, updated_at) defined
- [ ] `__str__()` method returns readable representation

---

## Task 06: Add Image Metadata Fields

### Overview
Add metadata fields to ProductImage for SEO, accessibility, and enhanced image information. These fields improve search engine visibility and screen reader support.

### Dependencies
- Task 05: Create ProductImage model

### Instructions

1. **Open product_image.py**
   - Open `backend/apps/products/media/models/product_image.py`
   - Add new fields to ProductImage model

2. **Add alt_text field**
   - Create `alt_text` field as CharField
   - Set `max_length=255`
   - Set `blank=True` (optional field)
   - Add `help_text`: "Alternative text for accessibility (screen readers)"
   - Critical for WCAG compliance

3. **Add title field**
   - Create `title` field as CharField
   - Set `max_length=255`
   - Set `blank=True` (optional field)
   - Add `help_text`: "Image title (displayed on hover)"
   - Shows when user hovers over image

4. **Add caption field**
   - Create `caption` field as TextField
   - Set `blank=True` (optional field)
   - Add `help_text`: "Image caption or description"
   - Longer descriptive text for image context

5. **Add metadata guidance comments**
   - Add comment explaining SEO benefits of alt_text
   - Add comment explaining accessibility importance
   - Add comment noting these fields should be in multiple languages if multi-language support enabled

### Metadata Field Usage

| Field | SEO Impact | Accessibility | Character Limit | Required |
|-------|-----------|---------------|-----------------|----------|
| alt_text | High | Critical | 255 | Recommended |
| title | Low | Helpful | 255 | Optional |
| caption | Medium | Helpful | Unlimited | Optional |

### SEO Best Practices for alt_text

| Good Example | Bad Example |
|--------------|-------------|
| "Red cotton t-shirt with round neck, size M" | "image1.jpg" |
| "Nike Air Max 2026 - White/Black colorway" | "product" |
| "Wooden dining table, 6-seater, oak finish" | "IMG_0123" |

### Accessibility Guidelines

```
Screen Reader Experience:
- Without alt_text: "Image [unidentified]"
- With alt_text: "Red cotton t-shirt with round neck, size M"

SEO Impact:
- Google Image Search uses alt_text for indexing
- Helps visually impaired users understand content
- Improves overall page accessibility score
```

### Multi-Language Considerations

For Sri Lankan market:
- alt_text may need Sinhala/Tamil translations
- Consider using django-modeltranslation for translated fields
- Or store translations in separate TranslatedProductImage model
- Phase-05 may include translation system

### Expected Outcome
```
ProductImage Model Fields (updated):
├── product (ForeignKey)
├── image (ImageField)
├── display_order (PositiveIntegerField)
├── is_primary (BooleanField)
├── alt_text (CharField) ─────────── NEW
├── title (CharField) ─────────────── NEW
├── caption (TextField) ───────────── NEW
├── created_at (DateTimeField)
└── updated_at (DateTimeField)
```

### Verification Checklist
- [ ] alt_text field added (CharField, max_length=255, blank=True)
- [ ] title field added (CharField, max_length=255, blank=True)
- [ ] caption field added (TextField, blank=True)
- [ ] All metadata fields have helpful help_text
- [ ] Fields marked as optional (blank=True)
- [ ] Comments explain SEO and accessibility benefits

---

## Task 07: Add Image Dimension Fields

### Overview
Add width and height fields to store image dimensions automatically extracted from uploaded images. These dimensions are useful for responsive image handling and frontend layout optimization.

### Dependencies
- Task 06: Add image metadata fields

### Instructions

1. **Open product_image.py**
   - Continue editing `backend/apps/products/media/models/product_image.py`

2. **Add width field**
   - Create `width` field as PositiveIntegerField
   - Set `null=True, blank=True` (populated automatically)
   - Set `editable=False` (not manually editable in admin)
   - Add `help_text`: "Image width in pixels (auto-populated)"

3. **Add height field**
   - Create `height` field as PositiveIntegerField
   - Set `null=True, blank=True` (populated automatically)
   - Set `editable=False` (not manually editable in admin)
   - Add `help_text`: "Image height in pixels (auto-populated)"

4. **Add aspect_ratio property**
   - Define `@property` decorated method `aspect_ratio`
   - Calculate aspect ratio as `width / height`
   - Return as float rounded to 2 decimal places
   - Return `None` if width or height is None
   - Add docstring explaining the calculation

5. **Add is_landscape property**
   - Define `@property` decorated method `is_landscape`
   - Return `True` if `width > height`
   - Return `False` otherwise
   - Return `None` if dimensions not available

6. **Add is_portrait property**
   - Define `@property` decorated method `is_portrait`
   - Return `True` if `height > width`
   - Return `False` otherwise
   - Return `None` if dimensions not available

7. **Add is_square property**
   - Define `@property` decorated method `is_square`
   - Return `True` if `width == height`
   - Return `False` otherwise
   - Return `None` if dimensions not available

8. **Add comment about signal**
   - Add comment noting that dimensions will be populated via pre_save signal (Task 15)
   - Dimensions extracted using Pillow library

### Dimension Usage Examples

| Use Case | Field/Property | Purpose |
|----------|----------------|---------|
| Responsive images | width, height | Set aspect ratio in CSS |
| Layout planning | aspect_ratio | Prevent layout shift |
| Image filtering | is_landscape, is_portrait | Filter by orientation |
| Thumbnail cropping | is_square | Determine crop strategy |

### Aspect Ratio Reference

| Ratio | Description | Common Use |
|-------|-------------|------------|
| 1:1 (1.0) | Square | Social media, avatars |
| 4:3 (1.33) | Traditional | Product photos |
| 3:2 (1.5) | Photography | DSLR standard |
| 16:9 (1.78) | Widescreen | Banners, headers |

### Frontend Integration Example

```
HTML with dimensions:
<img 
  src="/media/image.jpg"
  width="800"
  height="600"
  alt="Product image"
  style="aspect-ratio: 800/600"
/>

Benefits:
- Browser reserves space before image loads
- Prevents cumulative layout shift (CLS)
- Improves Core Web Vitals score
```

### Expected Outcome
```
ProductImage Model Fields (updated):
├── product (ForeignKey)
├── image (ImageField)
├── display_order (PositiveIntegerField)
├── is_primary (BooleanField)
├── alt_text (CharField)
├── title (CharField)
├── caption (TextField)
├── width (PositiveIntegerField) ───── NEW
├── height (PositiveIntegerField) ──── NEW
├── created_at (DateTimeField)
└── updated_at (DateTimeField)

Properties (NEW):
├── aspect_ratio (float)
├── is_landscape (bool)
├── is_portrait (bool)
└── is_square (bool)
```

### Verification Checklist
- [ ] width field added (PositiveIntegerField, null=True, editable=False)
- [ ] height field added (PositiveIntegerField, null=True, editable=False)
- [ ] aspect_ratio property defined (returns float)
- [ ] is_landscape property defined (returns bool)
- [ ] is_portrait property defined (returns bool)
- [ ] is_square property defined (returns bool)
- [ ] All properties handle None values gracefully
- [ ] Comment explains signal will populate dimensions

---

## Task 08: Add File Size Tracking

### Overview
Add a file_size field to track the size of uploaded images in bytes. This enables storage monitoring, quota management, and optimization reporting.

### Dependencies
- Task 07: Add image dimension fields

### Instructions

1. **Open product_image.py**
   - Continue editing `backend/apps/products/media/models/product_image.py`

2. **Add file_size field**
   - Create `file_size` field as PositiveIntegerField
   - Set `null=True, blank=True` (populated automatically)
   - Set `editable=False` (not manually editable)
   - Add `help_text`: "File size in bytes (auto-populated)"

3. **Add file_size_kb property**
   - Define `@property` decorated method `file_size_kb`
   - Calculate kilobytes: `file_size / 1024`
   - Return rounded to 2 decimal places
   - Return `None` if file_size is None

4. **Add file_size_mb property**
   - Define `@property` decorated method `file_size_mb`
   - Calculate megabytes: `file_size / (1024 * 1024)`
   - Return rounded to 2 decimal places
   - Return `None` if file_size is None

5. **Add file_size_human property**
   - Define `@property` decorated method `file_size_human`
   - Return human-readable format (e.g., "1.5 MB", "512 KB")
   - Logic: if > 1MB show MB, else show KB
   - Return "Unknown" if file_size is None

6. **Add is_large_file property**
   - Define `@property` decorated method `is_large_file`
   - Return `True` if file_size > 1MB (1024 * 1024 bytes)
   - Return `False` otherwise
   - Useful for identifying optimization candidates

7. **Add comment about signal**
   - Add comment noting file_size populated via pre_save signal (Task 15)
   - File size extracted from UploadedFile object

### File Size Categories

| Category | Size Range | Optimization Action |
|----------|-----------|---------------------|
| Small | < 100 KB | No action needed |
| Medium | 100 KB - 500 KB | Monitor |
| Large | 500 KB - 1 MB | Consider optimization |
| Very Large | > 1 MB | Strong candidate for compression |

### Storage Impact Analysis

```
Scenario: 1000 products with 5 images each (5000 images)

Average Size Impact:
- 100 KB avg: 500 MB total storage
- 500 KB avg: 2.5 GB total storage
- 1 MB avg: 5 GB total storage

With WebP conversion (50% reduction):
- 1 MB avg → 500 KB avg
- Saves 2.5 GB storage per 5000 images
```

### Admin Display Format

```
In Admin List View:
- Show file_size_human for easy reading
- Highlight is_large_file in red
- Allow filtering by size ranges

Example Display:
Product ID | Image | Size     | Status
-----------|-------|----------|--------
123        | img1  | 1.2 MB   | 🔴 Large
124        | img2  | 450 KB   | 🟡 Medium
125        | img3  | 85 KB    | 🟢 Small
```

### Expected Outcome
```
ProductImage Model Fields (updated):
├── product (ForeignKey)
├── image (ImageField)
├── display_order (PositiveIntegerField)
├── is_primary (BooleanField)
├── alt_text (CharField)
├── title (CharField)
├── caption (TextField)
├── width (PositiveIntegerField)
├── height (PositiveIntegerField)
├── file_size (PositiveIntegerField) ─── NEW
├── created_at (DateTimeField)
└── updated_at (DateTimeField)

Properties (updated):
├── aspect_ratio (float)
├── is_landscape (bool)
├── is_portrait (bool)
├── is_square (bool)
├── file_size_kb (float) ──────────────── NEW
├── file_size_mb (float) ──────────────── NEW
├── file_size_human (str) ─────────────── NEW
└── is_large_file (bool) ──────────────── NEW
```

### Verification Checklist
- [ ] file_size field added (PositiveIntegerField, null=True, editable=False)
- [ ] file_size_kb property defined (returns KB)
- [ ] file_size_mb property defined (returns MB)
- [ ] file_size_human property defined (returns human-readable string)
- [ ] is_large_file property defined (threshold > 1MB)
- [ ] All properties handle None values gracefully
- [ ] Comment explains signal will populate file_size

---

## Task 09: Create ProductImage Meta Class

### Overview
Define the Meta class for ProductImage model to configure database table name, indexes, ordering, and other database-level settings for optimal performance.

### Dependencies
- Task 08: Add file size tracking

### Instructions

1. **Open product_image.py**
   - Continue editing `backend/apps/products/media/models/product_image.py`
   - Add Meta class inside ProductImage model

2. **Define database table name**
   - Set `db_table = 'products_product_images'`
   - Follow naming convention: `{app}_{model_plural}`
   - Keeps table names consistent and predictable

3. **Define verbose names**
   - Set `verbose_name = 'Product Image'`
   - Set `verbose_name_plural = 'Product Images'`
   - Used in admin interface and error messages

4. **Define default ordering**
   - Set `ordering = ['product', 'display_order', 'id']`
   - Primary: group by product
   - Secondary: sort by display_order (gallery sequence)
   - Tertiary: sort by id (creation order)

5. **Define indexes**
   - Create `indexes` list with multiple Index objects
   - Index 1: `models.Index(fields=['product', 'display_order'])` for gallery queries
   - Index 2: `models.Index(fields=['product', 'is_primary'])` for primary image lookup
   - Index 3: `models.Index(fields=['created_at'])` for recent images queries

6. **Define unique constraints**
   - Create `constraints` list
   - Add `UniqueConstraint` for ensuring only one primary image per product
   - Name: 'unique_primary_per_product'
   - Fields: ['product', 'is_primary']
   - Condition: Q(is_primary=True)
   - Note: Will be implemented in Task 11

7. **Add app_label**
   - Set `app_label = 'products'`
   - Ensures model is associated with products app
   - Important for multi-module structure

8. **Add permissions**
   - Define `permissions` list for custom permissions
   - Add: `('can_upload_images', 'Can upload product images')`
   - Add: `('can_delete_images', 'Can delete product images')`
   - Add: `('can_set_primary', 'Can set primary product image')`

### Index Strategy

| Index | Fields | Purpose | Query Pattern |
|-------|--------|---------|---------------|
| product_order_idx | product, display_order | Gallery listing | `WHERE product_id=X ORDER BY display_order` |
| product_primary_idx | product, is_primary | Find primary image | `WHERE product_id=X AND is_primary=True` |
| created_idx | created_at | Recent images | `ORDER BY created_at DESC LIMIT 10` |

### Query Performance Impact

```
Without Indexes:
SELECT * FROM products_product_images 
WHERE product_id = 123 
ORDER BY display_order;
→ Full table scan: ~500ms for 10,000 images

With Indexes:
Same query with (product, display_order) index
→ Index scan: ~5ms for 10,000 images
→ 100x performance improvement
```

### Ordering Priority

```
Default Ordering: ['product', 'display_order', 'id']

Example Result:
Product 1, Order 10, ID 5   (first)
Product 1, Order 20, ID 3   (second)
Product 1, Order 20, ID 4   (third - same order, sorted by ID)
Product 2, Order 10, ID 1   (fourth - different product)
```

### Custom Permissions Usage

```
View-level Permission Check:
@permission_required('products.can_upload_images')
def upload_product_image(request, product_id):
    # Upload logic

Template-level Permission Check:
{% if perms.products.can_set_primary %}
    <button>Set as Primary</button>
{% endif %}
```

### Expected Outcome
```
ProductImage Model (complete):
├── Fields:
│   ├── product, image, display_order, is_primary
│   ├── alt_text, title, caption
│   ├── width, height, file_size
│   ├── created_at, updated_at
├── Properties:
│   ├── aspect_ratio, is_landscape, is_portrait, is_square
│   ├── file_size_kb, file_size_mb, file_size_human, is_large_file
└── Meta: ───────────────────────────── NEW
    ├── db_table
    ├── verbose_name, verbose_name_plural
    ├── ordering
    ├── indexes (3 composite indexes)
    ├── constraints (unique primary)
    ├── app_label
    └── permissions (3 custom)
```

### Verification Checklist
- [ ] Meta class defined inside ProductImage
- [ ] db_table set to 'products_product_images'
- [ ] verbose_name and verbose_name_plural defined
- [ ] ordering set to ['product', 'display_order', 'id']
- [ ] Three indexes defined (product+order, product+primary, created)
- [ ] UniqueConstraint for primary image noted (Task 11)
- [ ] app_label set to 'products'
- [ ] Three custom permissions defined

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Create ProductImage model | Core model with product FK, image field, ordering |
| 06 | Add image metadata fields | alt_text, title, caption for SEO/accessibility |
| 07 | Add image dimension fields | width, height with aspect ratio properties |
| 08 | Add file size tracking | file_size with human-readable properties |
| 09 | Create ProductImage Meta class | Database config, indexes, ordering, permissions |

### ProductImage Model Complete Structure

```python
ProductImage (TenantAwareModel)
│
├── Core Fields:
│   ├── product (FK to Product, CASCADE)
│   ├── image (ImageField with upload_to)
│   ├── display_order (PositiveIntegerField, indexed)
│   └── is_primary (BooleanField, indexed)
│
├── Metadata Fields:
│   ├── alt_text (CharField, 255, SEO)
│   ├── title (CharField, 255, hover text)
│   └── caption (TextField, description)
│
├── Auto-Populated Fields:
│   ├── width (PositiveIntegerField, editable=False)
│   ├── height (PositiveIntegerField, editable=False)
│   └── file_size (PositiveIntegerField, editable=False)
│
├── Timestamps:
│   ├── created_at (auto_now_add)
│   └── updated_at (auto_now)
│
├── Properties:
│   ├── aspect_ratio, is_landscape, is_portrait, is_square
│   └── file_size_kb, file_size_mb, file_size_human, is_large_file
│
└── Meta:
    ├── db_table, verbose_name
    ├── ordering: [product, display_order, id]
    ├── indexes: 3 composite indexes
    └── permissions: 3 custom permissions
```

### Database Schema

```sql
CREATE TABLE products_product_images (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    image VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    caption TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products_products(id) ON DELETE CASCADE,
    INDEX idx_product_order (product_id, display_order),
    INDEX idx_product_primary (product_id, is_primary),
    INDEX idx_created (created_at)
);
```

### Next Steps
Proceed to [03_Tasks-10-13_Manager-Constraints-Validation.md](03_Tasks-10-13_Manager-Constraints-Validation.md) to add custom manager, is_primary constraint, set_as_primary method, and image validation.

---

## Notes for AI Agents

1. **Model Complete:** ProductImage has all core fields, metadata, and auto-populated fields
2. **Tenant Aware:** Inherits from TenantAwareModel for multi-tenancy support
3. **SEO Optimized:** alt_text, title, caption fields improve search visibility
4. **Performance:** Three strategic indexes for common query patterns
5. **Automatic Values:** width, height, file_size populated via signals (Task 15)
6. **Gallery Ready:** display_order and is_primary enable gallery functionality
7. **Storage Tracking:** file_size enables quota management and optimization
8. **Accessibility:** alt_text critical for WCAG compliance
9. **Next Document:** Manager, constraints, and validation (Tasks 10-13)
10. **Migration:** After Task 09, ready to create migration file
