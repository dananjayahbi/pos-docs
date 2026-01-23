# Tasks 01-08: VariantOptionType Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** A - Variant Option Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_VariantOptionValue-Model.md](02_Tasks-09-16_VariantOptionValue-Model.md)

---

## Document Overview

This document covers the creation of the VariantOptionType model, which represents the types of variant options available for products. Examples include Size, Color, Material, Style, Pattern, etc. This model is the foundation for building product variants.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create variant_option.py File | Low |
| 02 | Define VariantOptionType Class | Medium |
| 03 | Add type name Field | Low |
| 04 | Add type slug Field | Low |
| 05 | Add display_order Field | Low |
| 06 | Add is_color_swatch Field | Low |
| 07 | Add is_image_swatch Field | Low |
| 08 | Export VariantOptionType | Low |

---

## Business Context

### Understanding Variant Option Types

In e-commerce and retail systems, products often have multiple variations. For example:

- **T-Shirt:** Size (S, M, L, XL), Color (Red, Blue, Green)
- **Laptop:** RAM (8GB, 16GB, 32GB), Storage (256GB, 512GB, 1TB)
- **Shoes:** Size (UK 6, UK 7, UK 8), Color (Black, Brown, White)
- **Rice (Sri Lankan Context):** Type (Basmati, Samba, Nadu), Weight (1kg, 5kg, 10kg)

The VariantOptionType represents the **categories** of these variations (Size, Color, RAM, etc.), while the actual **values** (S, M, L or Red, Blue, Green) are stored in VariantOptionValue.

### Multi-Tenant Considerations

Each tenant (business) defines their own variant option types:
- Clothing store: Size, Color, Material, Style
- Electronics store: RAM, Storage, Processor, Screen Size
- Food store: Weight, Flavor, Packaging Type

---

## Task 01: Create variant_option.py File

### Overview
Create a new model file to house variant option-related models.

### Dependencies
- Product app structure exists
- models/ directory exists in products app

### Instructions

1. **Navigate to products models directory**
   - Location: `backend/apps/products/models/`
   - Ensure directory exists

2. **Create the variant_option.py file**
   - File name: `variant_option.py`
   - Location: `backend/apps/products/models/variant_option.py`

3. **Add file header with imports**
   - Import Django model components
   - Import TenantAwareModel base class
   - Import CloudinaryField for image handling
   - Import gettext_lazy for translations

4. **Add module docstring**
   - Describe purpose: "Variant option models for product variations"
   - Mention models included: VariantOptionType, VariantOptionValue

### Expected File Structure
```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── product.py
    └── variant_option.py    # NEW FILE
```

### Verification Checklist
- [ ] File `variant_option.py` created in models directory
- [ ] Required imports added (django.db.models, base models)
- [ ] Module docstring present
- [ ] File follows project coding standards

---

## Task 02: Define VariantOptionType Class

### Overview
Create the VariantOptionType model class that inherits from TenantAwareModel.

### Dependencies
- Task 01: variant_option.py file exists

### Instructions

1. **Define the VariantOptionType class**
   - Inherit from TenantAwareModel
   - Class name: `VariantOptionType`

2. **Add class docstring**
   - Explain purpose: "Represents a type of product variant option"
   - Provide examples: Size, Color, Material, Style
   - Mention tenant isolation

3. **Add __all__ export list**
   - Prepare for exporting the class

4. **Prepare for field definitions**
   - Fields will be added in subsequent tasks

### Model Purpose

The VariantOptionType defines:
- What kind of variations a product can have
- How those variations should be displayed (color picker, image selector, dropdown)
- Display order for consistent UI presentation

### Business Examples

| Business Type | Option Types |
|---------------|--------------|
| **Clothing Store** | Size, Color, Material, Pattern, Fit |
| **Electronics** | RAM, Storage, Processor, Screen Size, Color |
| **Furniture** | Material, Color, Size, Style |
| **Food/Grocery** | Weight, Flavor, Packaging, Portion Size |
| **Sri Lankan Spices** | Weight, Grind Type (Whole/Ground), Origin |

### Verification Checklist
- [ ] VariantOptionType class defined
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring present with examples
- [ ] Ready for field additions

---

## Task 03: Add type name Field

### Overview
Add the name field to store the display name of the variant option type.

### Dependencies
- Task 02: VariantOptionType class defined

### Instructions

1. **Add name field as CharField**
   - Field name: `name`
   - Maximum length: 100 characters
   - Cannot be blank or null

2. **Add field help text**
   - "Name of the variant option type (e.g., Size, Color, Material)"

3. **Add verbose name for admin**
   - verbose_name: "Option Type Name"

4. **Add field validation**
   - Field is required (blank=False, null=False)
   - Unique per tenant (will be enforced in Meta)

### Field Purpose

The name field stores the user-visible label for the option type:
- "Size" (displayed in product listings)
- "Color" (shown in variant selector)
- "RAM" (displayed in electronics)
- "පරිමාව" (Sinhala for "Size" in localized UI)

### Business Usage Examples

| Option Type | Usage Context |
|-------------|---------------|
| **Size** | Clothing, Shoes, Furniture dimensions |
| **Color** | Most visual products |
| **Material** | Clothing, Furniture, Accessories |
| **Storage** | Electronics, Digital products |
| **Weight** | Food items, Bulk goods |
| **Flavor** | Food, Beverages |

### Multi-Tenant Scenarios

**Tenant 1 (Clothing Store):**
- Size
- Color
- Material (Cotton, Polyester, Silk)

**Tenant 2 (Electronics Store):**
- RAM
- Storage
- Color
- Screen Size

**Tenant 3 (Sri Lankan Grocery):**
- Weight (1kg, 5kg, 10kg)
- Type (Basmati, Samba)
- Origin (Local, Imported)

### Verification Checklist
- [ ] name field added as CharField
- [ ] Maximum length set to 100
- [ ] Help text added
- [ ] Field is required (non-nullable)
- [ ] Verbose name set for admin display

---

## Task 04: Add type slug Field

### Overview
Add a slug field for URL-friendly representation of the variant option type.

### Dependencies
- Task 03: name field exists

### Instructions

1. **Add slug field as SlugField**
   - Field name: `slug`
   - Maximum length: 100 characters
   - Cannot be blank or null

2. **Add field help text**
   - "URL-friendly identifier (auto-generated from name)"

3. **Configure slug auto-generation**
   - Set editable=False for auto-generation
   - Will be generated from name field
   - Use slugify utility

4. **Add uniqueness constraint**
   - Unique per tenant
   - Will be enforced in Meta with unique_together

### Field Purpose

The slug field provides:
- URL-friendly identifier: `/products/tshirt?size=medium&color=red`
- API filtering: `?option_type=color`
- Frontend routing and navigation
- SEO-friendly URLs

### Slug Generation Examples

| Name | Generated Slug | Usage |
|------|----------------|-------|
| Size | `size` | `/filter?size=large` |
| Color | `color` | `/products?color=red` |
| Material Type | `material-type` | `/products?material-type=cotton` |
| Screen Size | `screen-size` | `/laptops?screen-size=15-inch` |
| පරිමාව (Size in Sinhala) | `parimava` | Transliterated for URLs |

### Multi-Tenant Slug Usage

**API Endpoint Example:**
```
GET /api/v1/products/tshirt-001/variants/?option_type=color
GET /api/v1/products/laptop-pro/variants/?option_type=ram
GET /api/v1/option-types/size/values/
```

**Frontend URL Example:**
```
https://tenant1.store.lk/products/tshirt?size=large&color=blue
https://tenant2.store.lk/laptops/dell-xps?ram=16gb&storage=512gb
```

### Verification Checklist
- [ ] slug field added as SlugField
- [ ] Maximum length set to 100
- [ ] Help text added
- [ ] Auto-generation configured
- [ ] Prepared for uniqueness constraint

---

## Task 05: Add display_order Field

### Overview
Add a field to control the display order of variant option types in the UI.

### Dependencies
- Task 02: VariantOptionType class defined

### Instructions

1. **Add display_order field as PositiveIntegerField**
   - Field name: `display_order`
   - Default value: 0

2. **Add field help text**
   - "Order in which this option type appears (lower numbers first)"

3. **Add verbose name for admin**
   - verbose_name: "Display Order"

4. **Configure default ordering**
   - Will be used in Meta class ordering

### Field Purpose

The display_order field ensures consistent UI presentation:
- Size appears before Color
- Primary options appear before secondary options
- Consistent ordering across product pages

### Display Order Examples

**Clothing Product Variant Selector:**

| Option Type | display_order | Display Position |
|-------------|---------------|------------------|
| Size | 0 | First selector |
| Color | 10 | Second selector |
| Material | 20 | Third selector (if applicable) |
| Fit | 30 | Fourth selector (if applicable) |

**Electronics Product Variant Selector:**

| Option Type | display_order | Display Position |
|-------------|---------------|------------------|
| Color | 0 | First (most visual) |
| RAM | 10 | Second |
| Storage | 20 | Third |
| Screen Size | 30 | Fourth |

**Sri Lankan Rice Product:**

| Option Type | display_order | Display Position |
|-------------|---------------|------------------|
| Type | 0 | First (Basmati, Samba, Nadu) |
| Weight | 10 | Second (1kg, 5kg, 10kg) |
| Origin | 20 | Third (Local, Imported) |

### UI Presentation Impact

**Without display_order:**
- Unpredictable ordering
- Inconsistent user experience
- Random database ordering

**With display_order:**
- Predictable, consistent ordering
- Business logic controls presentation
- Better user experience

### Verification Checklist
- [ ] display_order field added
- [ ] Field type is PositiveIntegerField
- [ ] Default value set to 0
- [ ] Help text added
- [ ] Verbose name set

---

## Task 06: Add is_color_swatch Field

### Overview
Add a boolean field to indicate if this option type should display as color swatches.

### Dependencies
- Task 02: VariantOptionType class defined

### Instructions

1. **Add is_color_swatch field as BooleanField**
   - Field name: `is_color_swatch`
   - Default value: False

2. **Add field help text**
   - "If True, option values will display as color swatches"

3. **Add verbose name for admin**
   - verbose_name: "Display as Color Swatch"

4. **Add usage note in docstring**
   - When True, OptionValue should have color_code field populated

### Field Purpose

The is_color_swatch field enables rich UI presentation:
- Color options show as clickable color squares
- Visual selection instead of dropdown
- Better user experience for color-based products

### Color Swatch Display Examples

**When is_color_swatch = True:**

| Option Type | Option Values | UI Display |
|-------------|---------------|------------|
| Color | Red, Blue, Green | 🟥 🟦 🟩 (Clickable color squares) |
| Fabric Color | Navy, Burgundy, Olive | 🔷 🟥 🟢 (Color swatches) |

**When is_color_swatch = False:**

| Option Type | Option Values | UI Display |
|-------------|---------------|------------|
| Size | S, M, L, XL | Dropdown or button group |
| Material | Cotton, Polyester | Dropdown list |

### Technical Implementation Notes

When `is_color_swatch = True`:
- Each VariantOptionValue must have `color_code` field (hex value like #FF0000)
- Frontend renders color picker or color swatches
- User clicks on color directly, not dropdown

### Business Use Cases

**Clothing Store:**
- T-Shirt Color option: Red (#FF0000), Blue (#0000FF), Green (#00FF00)
- User sees and clicks color swatches

**Paint Store:**
- Wall Color option: Crimson (#DC143C), Sky Blue (#87CEEB)
- Visual color selection improves user experience

**Furniture Store:**
- Fabric Color: Beige (#F5F5DC), Charcoal (#36454F)
- Realistic color representation

### Verification Checklist
- [ ] is_color_swatch field added
- [ ] Field type is BooleanField
- [ ] Default value is False
- [ ] Help text added
- [ ] Verbose name set
- [ ] Usage note documented

---

## Task 07: Add is_image_swatch Field

### Overview
Add a boolean field to indicate if this option type should display as image swatches.

### Dependencies
- Task 02: VariantOptionType class defined

### Instructions

1. **Add is_image_swatch field as BooleanField**
   - Field name: `is_image_swatch`
   - Default value: False

2. **Add field help text**
   - "If True, option values will display as image swatches"

3. **Add verbose name for admin**
   - verbose_name: "Display as Image Swatch"

4. **Add usage note in docstring**
   - When True, OptionValue should have image field populated

### Field Purpose

The is_image_swatch field enables visual product selection:
- Pattern/texture selection shows actual images
- Material types show sample images
- Better visual understanding for customers

### Image Swatch Display Examples

**When is_image_swatch = True:**

| Option Type | Option Values | UI Display |
|-------------|---------------|------------|
| Pattern | Striped, Checkered, Solid | 📷 (Small preview images) |
| Material | Cotton, Denim, Leather | 📷 (Texture images) |
| Wood Type | Oak, Walnut, Mahogany | 📷 (Wood grain images) |

**When is_image_swatch = False:**

| Option Type | Option Values | UI Display |
|-------------|---------------|------------|
| Size | S, M, L, XL | Text-based selector |
| Weight | 1kg, 5kg, 10kg | Dropdown list |

### Technical Implementation Notes

When `is_image_swatch = True`:
- Each VariantOptionValue must have `image` field populated
- Images should be small (thumbnails) for fast loading
- Recommended size: 50x50px or 100x100px
- Frontend renders grid of clickable images

### Business Use Cases

**Fabric Store:**
- Pattern option: Floral, Geometric, Abstract patterns
- Users see actual fabric patterns before selection

**Flooring Store:**
- Tile Pattern: Marble effect, Wood grain, Geometric tiles
- Visual representation crucial for decision-making

**Sri Lankan Sarong Store:**
- Design option: Traditional patterns, Modern designs
- Cultural patterns shown as images

**Wallpaper Store:**
- Pattern Type: Textured, Printed, Embossed
- Sample images show actual appearance

### Image Swatch Best Practices

| Practice | Recommendation |
|----------|----------------|
| **Image Size** | 50x50px to 100x100px thumbnails |
| **File Format** | WebP or optimized JPG |
| **Storage** | Cloudinary or S3 for CDN delivery |
| **Alt Text** | Include descriptive alt text for accessibility |
| **Fallback** | Show text label if image fails to load |

### Combined Swatch Usage

**Scenario:** A product can have both color and pattern options

| Option Type | is_color_swatch | is_image_swatch | Display |
|-------------|-----------------|-----------------|---------|
| Color | True | False | Color squares |
| Pattern | False | True | Pattern images |
| Size | False | False | Text dropdown |

### Verification Checklist
- [ ] is_image_swatch field added
- [ ] Field type is BooleanField
- [ ] Default value is False
- [ ] Help text added
- [ ] Verbose name set
- [ ] Usage note documented
- [ ] Image size recommendations documented

---

## Task 08: Export VariantOptionType

### Overview
Export the VariantOptionType model from the module and update the models package __init__.py.

### Dependencies
- Tasks 01-07: VariantOptionType model complete

### Instructions

1. **Add Meta class to VariantOptionType**
   - Define verbose names (singular and plural)
   - Set default ordering by display_order and name
   - Add unique_together constraint for tenant + slug
   - Add unique_together constraint for tenant + name
   - Set indexes for performance

2. **Add __str__ method**
   - Return the name field
   - Provides readable string representation

3. **Add save method override**
   - Auto-generate slug from name if not provided
   - Use slugify utility
   - Call parent save method

4. **Add validation methods**
   - Validate that is_color_swatch and is_image_swatch are not both True
   - Raise ValidationError if both are True

5. **Update models/__init__.py**
   - Import VariantOptionType from variant_option
   - Add to __all__ list

### Meta Class Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **verbose_name** | "Variant Option Type" | Admin display (singular) |
| **verbose_name_plural** | "Variant Option Types" | Admin display (plural) |
| **ordering** | ['display_order', 'name'] | Default query ordering |
| **unique_together** | [['tenant', 'slug'], ['tenant', 'name']] | Prevent duplicates per tenant |
| **indexes** | tenant + slug, tenant + name | Query performance |

### String Representation

The `__str__` method should return a clear, human-readable format:
- Simple case: `"Size"`
- Complex case: `"Color (Swatch)"`

### Slug Auto-Generation Logic

**Slug Generation Rules:**
1. If slug is empty, generate from name
2. Convert to lowercase
3. Replace spaces with hyphens
4. Remove special characters
5. Transliterate non-ASCII characters for Sinhala/Tamil names

**Examples:**

| Name | Generated Slug |
|------|----------------|
| Color | `color` |
| Screen Size | `screen-size` |
| Material Type | `material-type` |
| RAM Memory | `ram-memory` |

### Validation Logic

**Business Rule:** An option type cannot be both color swatch AND image swatch

**Validation Check:**
- If `is_color_swatch=True` and `is_image_swatch=True`
- Raise ValidationError
- Message: "Option type cannot be both color swatch and image swatch"

**Valid Combinations:**
- ✅ is_color_swatch=True, is_image_swatch=False (Color picker)
- ✅ is_color_swatch=False, is_image_swatch=True (Image selector)
- ✅ is_color_swatch=False, is_image_swatch=False (Standard dropdown)
- ❌ is_color_swatch=True, is_image_swatch=True (INVALID)

### Expected Model Structure

After completion, VariantOptionType should have:

| Component | Purpose |
|-----------|---------|
| **Fields** | name, slug, display_order, is_color_swatch, is_image_swatch |
| **Methods** | __str__, save, clean |
| **Meta** | ordering, unique constraints, indexes |
| **Inheritance** | TenantAwareModel (tenant, created_at, updated_at) |

### Verification Checklist
- [ ] Meta class added with verbose names
- [ ] Default ordering configured
- [ ] unique_together constraints added
- [ ] Indexes added for performance
- [ ] __str__ method returns name
- [ ] save method auto-generates slug
- [ ] Validation prevents both swatch types being True
- [ ] Model exported in __init__.py
- [ ] Model appears in admin (if registered)
- [ ] No migration errors when created

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create variant_option.py File | New model file |
| 02 | Define VariantOptionType Class | Model class structure |
| 03 | Add type name Field | name CharField |
| 04 | Add type slug Field | slug SlugField |
| 05 | Add display_order Field | display_order PositiveIntegerField |
| 06 | Add is_color_swatch Field | is_color_swatch BooleanField |
| 07 | Add is_image_swatch Field | is_image_swatch BooleanField |
| 08 | Export VariantOptionType | Meta, methods, export |

### VariantOptionType Model Complete

The VariantOptionType model is now complete with:
- **Core fields:** name, slug, display_order
- **Display flags:** is_color_swatch, is_image_swatch
- **Tenant isolation:** Inherited from TenantAwareModel
- **Validation:** Prevents conflicting swatch types
- **Auto-generation:** Slug created from name

### Business Value

This model enables:
- Flexible product variant configuration
- Rich UI presentation (color/image swatches)
- Multi-tenant variant management
- Consistent option ordering
- SEO-friendly URLs

### Next Steps
1. Proceed to [02_Tasks-09-16_VariantOptionValue-Model.md](02_Tasks-09-16_VariantOptionValue-Model.md) to create VariantOptionValue model
2. VariantOptionValue will reference VariantOptionType via ForeignKey

---

## Notes for AI Agents

1. **Tenant Isolation:** Every query must filter by current tenant
2. **Slug Generation:** Use Django's slugify, handle Sinhala transliteration
3. **Validation:** Enforce business rules at model level, not just UI
4. **Indexing:** Add database indexes for tenant + slug lookups
5. **Admin:** Register model for admin interface with inline values
6. **API:** Create read-only endpoints for option types
7. **Testing:** Test slug generation, uniqueness constraints, validation rules
8. **Sri Lankan Context:** Support Sinhala option type names with transliteration
