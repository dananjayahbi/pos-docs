# Tasks 33-40: Product Identity Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** C - Product Model Definition  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-48_Classification-Tax-Fields.md](02_Tasks-41-48_Classification-Tax-Fields.md)

---

## Document Overview

This document covers the creation of the Product model with identity fields. These fields uniquely identify and describe products in the system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create product.py File | Low |
| 34 | Define Product Class | Medium |
| 35 | Add name Field | Low |
| 36 | Add slug Field | Low |
| 37 | Add sku Field | Medium |
| 38 | Add barcode Field | Medium |
| 39 | Add description Field | Low |
| 40 | Add short_description Field | Low |

---

## Task 33: Create product.py File

### Overview
Create a new file for the Product model within the models module.

### Dependencies
- Task 32: Export UnitOfMeasure Model
- All supporting models must be complete

### Instructions

1. **Create product.py file**
   - Create new file named `product.py` in models/ directory
   - Place at: `backend/apps/products/models/product.py`
   - This will be the main product model file

2. **Add comprehensive file docstring**
   - Describe the Product model as the core of the system
   - List all product types supported
   - Explain tenant isolation and relationships
   - Note that this is a base model (variants come later)

3. **Import required dependencies**
   - Import Django models module
   - Import BaseModel from core app
   - Import gettext_lazy for translation
   - Import constants from products.constants
   - Import supporting models (Brand, TaxClass, UnitOfMeasure)
   - Import Category from categories app
   - Import validators as needed

4. **Plan model structure**
   - Identity fields (name, slug, SKU, barcode)
   - Classification fields (category, brand, type, status)
   - Description fields (description, short_description)
   - Visibility fields (webstore, POS, featured)
   - Tax and measurement fields
   - Physical dimension fields
   - SEO fields

### Expected Outcome
```python
"""
Product model for LankaCommerce Cloud.

The Product model is the core of the inventory and catalog system.
It supports multiple product types and integrates with all aspects
of the ERP system.

Product Types:
- SIMPLE: Single product without variations
- VARIABLE: Parent product with variants (size, color, etc.)
- BUNDLE: Collection of products sold together
- COMPOSITE: Product with bill of materials (BOM)

Key Features:
- Multi-tenant isolation
- SKU and barcode management
- Category and brand classification
- Tax class integration
- Visibility controls (webstore, POS)
- SEO optimization fields
- Physical dimensions and weight

Relationships:
- Category: FK to Category (hierarchical)
- Brand: FK to Brand (optional)
- TaxClass: FK to TaxClass
- UnitOfMeasure: FK to UnitOfMeasure
- Variants: One-to-many (in SubPhase-04)
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import BaseModel
from apps.categories.models import Category
from apps.products.constants import PRODUCT_TYPES, PRODUCT_STATUS

# Supporting models will be imported as needed
```

### Verification Checklist
- [ ] product.py file created in models/ directory
- [ ] File has comprehensive docstring
- [ ] Product types are documented
- [ ] All required imports are present

---

## Task 34: Define Product Class

### Overview
Define the Product model class with proper inheritance and comprehensive documentation.

### Dependencies
- Task 33: Create product.py File

### Instructions

1. **Create Product model class**
   - Define class named `Product`
   - Inherit from `BaseModel`
   - Add extensive class docstring

2. **Document class purpose and behavior**
   - Explain core product model
   - List all product types and their behaviors
   - Note field organization
   - Explain tenant isolation

3. **Add Meta class preparation**
   - Plan db_table name
   - Plan verbose names
   - Plan ordering (by name or created_at)
   - Plan indexes for performance

4. **Consider model organization**
   - Fields will be added in logical groups
   - Identity fields first
   - Classification fields next
   - Then visibility, tax, dimensions, SEO

### Product Model Field Organization

```
┌─────────────────────────────────────────────────────┐
│           PRODUCT MODEL FIELD GROUPS                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Identity Fields:                                   │
│  ├── name, slug, sku, barcode                      │
│  └── description, short_description                │
│                                                     │
│  Classification Fields:                             │
│  ├── category, brand                               │
│  └── product_type, status                          │
│                                                     │
│  Visibility Fields:                                 │
│  ├── is_webstore_visible                           │
│  ├── is_pos_visible                                │
│  └── featured                                      │
│                                                     │
│  Tax & Measurement:                                 │
│  ├── tax_class                                     │
│  └── unit_of_measure                               │
│                                                     │
│  Physical Attributes:                               │
│  ├── weight                                        │
│  └── length, width, height                         │
│                                                     │
│  SEO Fields:                                        │
│  ├── seo_title                                     │
│  └── seo_description                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
```python
class Product(BaseModel):
    """
    Core product model for LankaCommerce Cloud.
    
    Represents all types of products in the catalog including simple products,
    variable products (with variants), bundles, and composite products.
    
    Product Types:
    - SIMPLE: Standard single product (e.g., Book, Pen)
    - VARIABLE: Has variants with different attributes (e.g., T-Shirt with sizes)
    - BUNDLE: Collection of products (e.g., Gift Set)
    - COMPOSITE: Built from components/BOM (e.g., Custom Cake)
    
    Product Status:
    - DRAFT: Not visible, being configured
    - ACTIVE: Published and available
    - ARCHIVED: Temporarily hidden
    - DISCONTINUED: Permanently unavailable
    
    Tenant Isolation: All products are tenant-specific
    
    Relationships:
    - category: FK to Category (required)
    - brand: FK to Brand (optional)
    - tax_class: FK to TaxClass (required)
    - unit_of_measure: FK to UnitOfMeasure (required)
    """
    
    # Fields will be added in subsequent tasks
    
    class Meta:
        db_table = 'products_product'
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['-created_at', 'name']
```

### Verification Checklist
- [ ] Product class is defined
- [ ] Inherits from BaseModel
- [ ] Has comprehensive docstring
- [ ] Meta class is prepared

---

## Task 35: Add name Field

### Overview
Add the name field to store the product name.

### Dependencies
- Task 34: Define Product Class

### Instructions

1. **Define name field**
   - Use CharField for the product name
   - Set max_length to 200 characters
   - Make it required (blank=False, null=False)
   - Add db_index=True for search performance
   - Add verbose_name and help_text

2. **Consider name requirements**
   - Should be descriptive and clear
   - Used in all product displays
   - Searchable field
   - May include brand name
   - Examples: "Apple iPhone 15 Pro", "Samsung Galaxy Tab S9"

3. **Plan name usage**
   - Product listings in webstore
   - POS product selection
   - Search results
   - Invoice line items
   - Reports and exports

4. **Understand multilingual support**
   - Name should be in primary language (English/Sinhala)
   - Translation support for webstore (future)
   - Can include Sinhaglish (romanized Sinhala)

### Name Field Specifications

| Property | Value |
|----------|-------|
| **Type** | CharField |
| **Max Length** | 200 |
| **Required** | Yes |
| **Indexed** | Yes |
| **Searchable** | Yes |

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    # ============================================
    # IDENTITY FIELDS
    # ============================================
    
    name = models.CharField(
        max_length=200,
        db_index=True,
        verbose_name=_('Product Name'),
        help_text=_('Full product name as displayed to customers')
    )
```

### Verification Checklist
- [ ] name field is defined
- [ ] CharField with max_length=200
- [ ] db_index=True for performance
- [ ] Has verbose_name and help_text

---

## Task 36: Add slug Field

### Overview
Add the slug field for SEO-friendly product URLs.

### Dependencies
- Task 35: Add name Field

### Instructions

1. **Define slug field**
   - Use SlugField for URL compatibility
   - Set max_length to 200 characters
   - Make it unique per tenant
   - Allow blank for auto-generation
   - Add db_index=True automatically (SlugField default)

2. **Configure uniqueness**
   - Must be unique per tenant
   - Use UniqueForTenantValidator or rely on tenant isolation
   - Slug is critical for product page URLs
   - Must remain stable once published

3. **Plan auto-generation**
   - Generate from name if blank
   - Slugify: "Apple iPhone 15" → "apple-iphone-15"
   - Handle duplicates with counter
   - Implement in save() method or use AutoSlugField

4. **Understand slug importance**
   - SEO-friendly URLs: /products/apple-iphone-15/
   - Human-readable identifiers
   - Better than using IDs in URLs
   - Should not change after product is active

### Slug Field Specifications

| Property | Value |
|----------|-------|
| **Type** | SlugField |
| **Max Length** | 200 |
| **Unique** | Per tenant |
| **Auto-Generated** | From name if blank |
| **Format** | lowercase-with-hyphens |

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    
    slug = models.SlugField(
        max_length=200,
        blank=True,
        verbose_name=_('URL Slug'),
        help_text=_(
            'SEO-friendly URL identifier (auto-generated from name if left blank). '
            'Example: apple-iphone-15-pro'
        )
    )
```

### Verification Checklist
- [ ] slug field is defined
- [ ] SlugField with max_length=200
- [ ] blank=True for auto-generation
- [ ] Help text explains auto-generation

---

## Task 37: Add sku Field

### Overview
Add the SKU (Stock Keeping Unit) field for unique product identification.

### Dependencies
- Task 36: Add slug Field

### Instructions

1. **Define sku field**
   - Use CharField for SKU code
   - Set max_length to 50 characters
   - Make it unique per tenant
   - Allow blank for auto-generation
   - Add db_index=True for lookups

2. **Plan SKU format**
   - Format: PREFIX-CATEGORY-NUMBER
   - Example: PRD-ELEC-00001
   - Can be auto-generated or manual
   - Must be unique per tenant

3. **Configure uniqueness constraint**
   - Unique per tenant (not globally)
   - Use UniqueForTenantValidator
   - Critical for inventory tracking
   - Barcode scanners may use SKU

4. **Understand SKU importance**
   - Primary inventory identifier
   - Used in stock movements
   - Referenced in purchase orders
   - Printed on product labels
   - Searchable in POS

5. **Plan auto-generation logic**
   - Generate if blank during creation
   - Use sequential numbering
   - Include category code or prefix
   - Ensure no duplicates

### SKU Field Specifications

| Property | Value |
|----------|-------|
| **Type** | CharField |
| **Max Length** | 50 |
| **Unique** | Per tenant |
| **Auto-Generated** | Yes (if blank) |
| **Format** | PREFIX-CATEGORY-NUMBER |
| **Example** | PRD-ELEC-00001 |

### SKU Format Examples
```
PRD-ELEC-00001  → Electronics product #1
PRD-FOOD-00005  → Food product #5
PRD-CLTH-00123  → Clothing product #123
```

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    
    sku = models.CharField(
        max_length=50,
        blank=True,
        db_index=True,
        verbose_name=_('SKU'),
        help_text=_(
            'Stock Keeping Unit - Unique product identifier '
            '(auto-generated if left blank). Example: PRD-ELEC-00001'
        )
    )
```

### Verification Checklist
- [ ] sku field is defined
- [ ] CharField with max_length=50
- [ ] blank=True for auto-generation
- [ ] db_index=True for lookups
- [ ] Help text explains format and auto-generation

---

## Task 38: Add barcode Field

### Overview
Add the barcode field for product scanning and identification.

### Dependencies
- Task 37: Add sku Field

### Instructions

1. **Define barcode field**
   - Use CharField for barcode value
   - Set max_length to 50 characters
   - Make it optional (blank=True, null=True)
   - Add db_index=True for scanner lookups
   - Add verbose_name and help_text

2. **Support barcode formats**
   - EAN-13 (European Article Number, 13 digits)
   - UPC-A (Universal Product Code, 12 digits)
   - Code-128 (alphanumeric)
   - Allow custom formats
   - Validation can be added later

3. **Configure barcode uniqueness**
   - Should be unique per tenant if provided
   - Not all products have barcodes
   - Can be null for products without barcodes
   - Validate format if provided

4. **Understand barcode usage**
   - Scanned at POS for quick selection
   - Used in inventory receiving
   - Stock counting and audits
   - Product identification in warehouse
   - Optional but highly recommended for retail

5. **Plan barcode generation**
   - Can be auto-generated (internal barcodes)
   - Can be manually entered (manufacturer barcodes)
   - Can be scanned during product creation
   - Should validate format if provided

### Barcode Field Specifications

| Property | Value |
|----------|-------|
| **Type** | CharField |
| **Max Length** | 50 |
| **Required** | No (optional) |
| **Unique** | Per tenant (if provided) |
| **Indexed** | Yes |
| **Formats** | EAN-13, UPC-A, Code-128 |

### Common Barcode Formats
```
EAN-13:    5901234123457 (13 digits)
UPC-A:     012345678905 (12 digits)
Code-128:  ABC-12345 (alphanumeric)
```

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    sku = models.CharField(...)
    
    barcode = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        db_index=True,
        verbose_name=_('Barcode'),
        help_text=_(
            'Product barcode for scanning (EAN-13, UPC-A, or Code-128). '
            'Leave blank if product has no barcode.'
        )
    )
```

### Verification Checklist
- [ ] barcode field is defined
- [ ] CharField with max_length=50
- [ ] blank=True and null=True (optional)
- [ ] db_index=True for scanner lookups
- [ ] Help text mentions supported formats

---

## Task 39: Add description Field

### Overview
Add the description field for detailed product information.

### Dependencies
- Task 38: Add barcode Field

### Instructions

1. **Define description field**
   - Use TextField for unlimited length
   - Make it optional (blank=True)
   - Add verbose_name and help_text
   - Support rich text (HTML)

2. **Plan content structure**
   - Full product description
   - Features and specifications
   - Usage instructions
   - Warranty information
   - HTML formatting supported

3. **Understand description usage**
   - Displayed on product detail pages
   - Used for SEO content
   - Supports HTML formatting
   - Can include images (via HTML)
   - Searchable content

4. **Configure for rich text**
   - Store HTML content
   - Sanitize HTML on save (security)
   - Support common HTML tags
   - Use WYSIWYG editor in admin

### Description Field Usage

| Context | Purpose |
|---------|---------|
| **Webstore** | Product detail page content |
| **SEO** | Rich content for search engines |
| **Marketing** | Product storytelling |
| **Customers** | Detailed product information |

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    sku = models.CharField(...)
    barcode = models.CharField(...)
    
    description = models.TextField(
        blank=True,
        verbose_name=_('Description'),
        help_text=_(
            'Full product description with features and specifications. '
            'Supports HTML formatting for rich content display.'
        )
    )
```

### Verification Checklist
- [ ] description field is defined
- [ ] TextField with blank=True
- [ ] Has verbose_name and help_text
- [ ] Help text mentions HTML support

---

## Task 40: Add short_description Field

### Overview
Add the short_description field for brief product summaries.

### Dependencies
- Task 39: Add description Field

### Instructions

1. **Define short_description field**
   - Use CharField for limited length
   - Set max_length to 500 characters
   - Make it optional (blank=True)
   - Add verbose_name and help_text

2. **Understand short description purpose**
   - Brief product summary
   - Used in product listings
   - Shown in search results
   - Used as meta description
   - Plain text only (no HTML)

3. **Plan content guidelines**
   - 1-2 sentences maximum
   - Highlight key features
   - No HTML formatting
   - SEO-friendly summary
   - Compelling for customers

4. **Configure field properties**
   - Limited length for consistency
   - Plain text for listings
   - Optional but recommended
   - Used in cards and grids

### Short Description Usage

| Context | Purpose |
|---------|---------|
| **Product Lists** | Grid/list view summaries |
| **Search Results** | Quick product overview |
| **Meta Description** | SEO snippet |
| **Social Sharing** | OG description |

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    sku = models.CharField(...)
    barcode = models.CharField(...)
    description = models.TextField(...)
    
    short_description = models.CharField(
        max_length=500,
        blank=True,
        verbose_name=_('Short Description'),
        help_text=_(
            'Brief product summary for listings and search results (max 500 characters). '
            'Plain text only, no HTML.'
        )
    )
```

### Verification Checklist
- [ ] short_description field is defined
- [ ] CharField with max_length=500
- [ ] blank=True for optional
- [ ] Help text explains plain text only
- [ ] Help text mentions character limit

---

## Summary of Progress

After completing these tasks, the Product model has all identity fields:

### Identity Fields Added
✓ name - Product name (200 chars, indexed)  
✓ slug - SEO-friendly URL (auto-generated)  
✓ sku - Stock keeping unit (unique per tenant)  
✓ barcode - Barcode for scanning (optional)  
✓ description - Full product description (HTML)  
✓ short_description - Brief summary (500 chars)

### Current Product Model Structure
```python
class Product(BaseModel):
    # Identity Fields
    name = CharField(200, indexed)
    slug = SlugField(200, blank, unique)
    sku = CharField(50, blank, indexed, unique)
    barcode = CharField(50, optional, indexed, unique)
    description = TextField(blank, HTML)
    short_description = CharField(500, blank)
    
    # More fields will be added in next document
```

---

## Notes for Implementation

1. **Slug Auto-Generation**
   - Implement in save() method
   - Use Django's slugify utility
   - Handle duplicate slugs with counter
   - Only generate if slug is blank

2. **SKU Auto-Generation**
   - Implement in save() or create() method
   - Format: PREFIX-CATEGORY-NUMBER
   - Use atomic transaction for sequential numbers
   - Ensure uniqueness per tenant

3. **Barcode Validation**
   - Add custom validator for format checking
   - Validate EAN-13 checksum
   - Validate UPC-A checksum
   - Allow custom formats

4. **Description Sanitization**
   - Use bleach library to sanitize HTML
   - Allow safe tags only (p, br, strong, em, ul, li, etc.)
   - Strip dangerous attributes
   - Prevent XSS attacks

5. **Search Optimization**
   - Index name, sku, barcode fields
   - Use PostgreSQL full-text search
   - Include description in search
   - Weight name higher than description

---
