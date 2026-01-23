# Tasks 49-56: Physical, SEO & Meta

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** C - Product Model Definition  
> **Document:** 03 of 03  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-48_Classification-Tax-Fields.md](02_Tasks-41-48_Classification-Tax-Fields.md)
- **→ Next Group:** [../Group-D_Product-Manager-QuerySets/](../Group-D_Product-Manager-QuerySets/)

---

## Document Overview

This document covers adding physical dimensions, SEO fields, and model metadata to complete the Product model definition.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Add weight Field | Low |
| 50 | Add dimensions Fields | Medium |
| 51 | Add seo_title Field | Low |
| 52 | Add seo_description Field | Low |
| 53 | Add featured Field | Low |
| 54 | Add __str__ Method | Low |
| 55 | Add Meta Class | Medium |
| 56 | Export Product Model | Low |

---

## Task 49: Add weight Field

### Overview
Add the weight field to store product weight in kilograms.

### Dependencies
- Task 48: Add unit_of_measure Field

### Instructions

1. **Define weight field**
   - Use DecimalField for precise measurements
   - Set max_digits to 10, decimal_places to 3
   - Make it optional (blank=True, null=True)
   - Add MinValueValidator(0)

2. **Configure weight specifications**
   - Stored in kilograms (kg)
   - Precision: 3 decimal places (0.001 kg = 1 gram)
   - Optional but important for shipping
   - Used in shipping calculations

3. **Plan weight usage**
   - Shipping cost calculations
   - Product specifications display
   - Filtering heavy/light products
   - Inventory weight reporting

### Expected Outcome
```python
    unit_of_measure = models.ForeignKey(...)
    
    # ============================================
    # PHYSICAL ATTRIBUTES
    # ============================================
    
    weight = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name=_('Weight (kg)'),
        help_text=_('Product weight in kilograms (e.g., 1.500 for 1.5kg)')
    )
```

### Verification Checklist
- [ ] weight field is defined
- [ ] DecimalField with proper precision
- [ ] Optional (blank=True, null=True)
- [ ] MinValueValidator(0) added

---

## Task 50: Add dimensions Fields

### Overview
Add length, width, and height fields for product dimensions in centimeters.

### Dependencies
- Task 49: Add weight Field

### Instructions

1. **Define length field**
   - DecimalField, max_digits=10, decimal_places=2
   - Optional (blank=True, null=True)
   - MinValueValidator(0)
   - Unit: centimeters (cm)

2. **Define width field**
   - Same specifications as length
   - Optional field
   - Used with length and height

3. **Define height field**
   - Same specifications as length and width
   - Complete the 3D dimensions
   - Used for shipping and storage

4. **Plan dimensions usage**
   - Shipping calculations
   - Package size determination
   - Storage space planning
   - Product specifications

### Expected Outcome
```python
    weight = models.DecimalField(...)
    
    length = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name=_('Length (cm)'),
        help_text=_('Product length in centimeters')
    )
    
    width = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name=_('Width (cm)'),
        help_text=_('Product width in centimeters')
    )
    
    height = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name=_('Height (cm)'),
        help_text=_('Product height in centimeters')
    )
```

### Verification Checklist
- [ ] All three dimension fields defined
- [ ] DecimalField with max_digits=10, decimal_places=2
- [ ] All optional with validators
- [ ] Help text specifies unit (cm)

---

## Task 51: Add seo_title Field

### Overview
Add the seo_title field for page title optimization.

### Dependencies
- Task 50: Add dimensions Fields

### Instructions

1. **Define seo_title field**
   - CharField, max_length=100
   - Optional (blank=True)
   - Used as HTML title tag
   - Falls back to product name if blank

2. **Configure SEO title specifications**
   - Optimal length: 50-60 characters
   - Max 100 for flexibility
   - Include keywords
   - Brand + Product Name format

3. **Plan SEO title usage**
   - HTML <title> tag
   - Search engine results
   - Browser tab title
   - Social media shares

### Expected Outcome
```python
    height = models.DecimalField(...)
    
    # ============================================
    # SEO FIELDS
    # ============================================
    
    seo_title = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('SEO Title'),
        help_text=_(
            'Page title for search engines (50-60 chars optimal). '
            'Defaults to product name if blank.'
        )
    )
```

### Verification Checklist
- [ ] seo_title field is defined
- [ ] CharField with max_length=100
- [ ] blank=True
- [ ] Help text mentions optimal length

---

## Task 52: Add seo_description Field

### Overview
Add the seo_description field for meta description.

### Dependencies
- Task 51: Add seo_title Field

### Instructions

1. **Define seo_description field**
   - CharField, max_length=300
   - Optional (blank=True)
   - Used as meta description
   - Falls back to short_description if blank

2. **Configure SEO description specifications**
   - Optimal length: 150-160 characters
   - Max 300 for flexibility
   - Compelling copy
   - Include primary keywords

3. **Plan SEO description usage**
   - HTML meta description tag
   - Search result snippets
   - Social media previews
   - OG:description for sharing

### Expected Outcome
```python
    seo_title = models.CharField(...)
    
    seo_description = models.CharField(
        max_length=300,
        blank=True,
        verbose_name=_('SEO Description'),
        help_text=_(
            'Meta description for search engines (150-160 chars optimal). '
            'Defaults to short description if blank.'
        )
    )
```

### Verification Checklist
- [ ] seo_description field is defined
- [ ] CharField with max_length=300
- [ ] blank=True
- [ ] Help text mentions optimal length

---

## Task 53: Add featured Field

### Overview
Add the featured boolean field to mark featured products.

### Dependencies
- Task 52: Add seo_description Field

### Instructions

1. **Define featured field**
   - BooleanField
   - Default=False
   - Add db_index=True for filtering
   - Used for homepage and promotions

2. **Configure featured behavior**
   - Featured products shown prominently
   - Used in homepage widgets
   - Special sections in webstore
   - Promotional campaigns

3. **Plan featured usage**
   - Homepage featured section
   - Category page highlights
   - Email campaigns
   - Filters in admin

### Expected Outcome
```python
    seo_description = models.CharField(...)
    
    featured = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name=_('Featured Product'),
        help_text=_('Mark as featured for display on homepage and promotions')
    )
```

### Verification Checklist
- [ ] featured field is defined
- [ ] BooleanField with default=False
- [ ] db_index=True
- [ ] Clear help text

---

## Task 54: Add __str__ Method

### Overview
Add the string representation method for the Product model.

### Dependencies
- Task 53: Add featured Field

### Instructions

1. **Define __str__ method**
   - Return product name
   - Simple and clear representation
   - Used throughout Django admin
   - Used in shell and debugging

2. **Configure return value**
   - Return self.name
   - Could include SKU if needed
   - Keep it simple and readable

### Expected Outcome
```python
    featured = models.BooleanField(...)
    
    def __str__(self):
        """String representation of product."""
        return self.name
```

### Verification Checklist
- [ ] __str__ method is defined
- [ ] Returns self.name
- [ ] Has docstring

---

## Task 55: Add Meta Class

### Overview
Configure the Meta class with database table, ordering, and indexes.

### Dependencies
- Task 54: Add __str__ Method

### Instructions

1. **Configure Meta class**
   - Set db_table name
   - Set verbose names (singular and plural)
   - Set default ordering
   - Add database indexes
   - Add unique_together constraints

2. **Define database indexes**
   - Index on SKU for lookups
   - Index on barcode for scanning
   - Index on status for filtering
   - Composite index on (status, is_webstore_visible)

3. **Plan unique constraints**
   - SKU unique per tenant (handled by BaseModel + constraint)
   - Barcode unique per tenant if provided
   - Slug unique per tenant

4. **Configure ordering**
   - Primary: -created_at (newest first)
   - Secondary: name (alphabetical)

### Expected Outcome
```python
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'products_product'
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['-created_at', 'name']
        indexes = [
            models.Index(fields=['sku'], name='product_sku_idx'),
            models.Index(fields=['barcode'], name='product_barcode_idx'),
            models.Index(fields=['status'], name='product_status_idx'),
            models.Index(fields=['status', 'is_webstore_visible'], name='product_published_idx'),
            models.Index(fields=['featured'], name='product_featured_idx'),
            models.Index(fields=['category', 'status'], name='product_category_idx'),
        ]
```

### Verification Checklist
- [ ] Meta class is complete
- [ ] db_table is set
- [ ] verbose_name and verbose_name_plural use translation
- [ ] ordering is configured
- [ ] All important indexes are added

---

## Task 56: Export Product Model

### Overview
Export the Product model from the models module.

### Dependencies
- Task 55: Add Meta Class

### Instructions

1. **Update models/__init__.py**
   - Import Product from product module
   - Add to __all__ list
   - Place in "Core models" section

2. **Verify all models exported**
   - Supporting models: Brand, TaxClass, UnitOfMeasure
   - Core model: Product
   - All in __all__ list

3. **Test imports**
   - Test: `from apps.products.models import Product`
   - Test: `from apps.products.models import Brand, TaxClass, UnitOfMeasure, Product`
   - Verify no errors

### Expected Outcome
```python
"""
Product models for LankaCommerce Cloud.

This module contains:
- Brand: Product brand/manufacturer
- TaxClass: Tax rate configuration
- UnitOfMeasure: Product measurement units
- Product: Core product model
"""

# Supporting models
from .brand import Brand
from .tax_class import TaxClass
from .unit_of_measure import UnitOfMeasure

# Core models
from .product import Product

# Managers (coming in Group D)
# from .managers import ProductManager, ProductQuerySet

__all__ = [
    'Brand',
    'TaxClass',
    'UnitOfMeasure',
    'Product',
]
```

### Verification Checklist
- [ ] Product imported in models/__init__.py
- [ ] Product added to __all__ list
- [ ] All models are exported
- [ ] No import errors

---

## Summary of Deliverables

After completing Group C, the complete Product model is defined:

### Final Product Model Structure
```python
class Product(BaseModel):
    # Identity Fields (6)
    name, slug, sku, barcode, description, short_description
    
    # Classification & Tax Fields (8)
    category, brand, product_type, status
    is_webstore_visible, is_pos_visible
    tax_class, unit_of_measure
    
    # Physical Attributes (4)
    weight, length, width, height
    
    # SEO Fields (2)
    seo_title, seo_description
    
    # Other (1)
    featured
    
    # Methods
    __str__()
    
    # Meta
    ordering, indexes
    
    # Total: 21 fields + BaseModel fields
```

### Key Achievements
✓ Complete Product model with all 21 fields  
✓ Physical dimensions for shipping  
✓ SEO optimization fields  
✓ Featured product support  
✓ Proper indexes for performance  
✓ Model exported and ready for use

---

## Notes for Implementation

1. **Dimensions and Shipping**
   - Calculate volumetric weight: (L × W × H) / 5000
   - Use for shipping cost calculations
   - Validate all three provided together
   - Consider package size recommendations

2. **SEO Best Practices**
   - Auto-generate SEO title from name + brand if blank
   - Auto-generate SEO description from short_description
   - Include category in SEO
   - Validate optimal lengths in admin

3. **Featured Products**
   - Limit number of featured products
   - Rotate featured products periodically
   - Featured section in homepage
   - Admin action to bulk feature/unfeature

4. **Database Optimization**
   - Composite indexes for common queries
   - Index on (category, status) for category pages
   - Index on (status, is_webstore_visible) for webstore
   - Consider partial indexes for PostgreSQL

5. **Next Steps**
   - Create migrations for Product model
   - Add custom managers and querysets (Group D)
   - Create serializers and views (Group E)
   - Write comprehensive tests (Group F)

---
