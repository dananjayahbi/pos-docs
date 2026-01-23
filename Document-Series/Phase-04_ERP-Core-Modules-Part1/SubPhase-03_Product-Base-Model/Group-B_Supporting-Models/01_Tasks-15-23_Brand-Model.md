# Tasks 15-23: Brand Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** B - Supporting Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-24-29_TaxClass-Model.md](02_Tasks-24-29_TaxClass-Model.md)

---

## Document Overview

This document covers the creation of the Brand model, which represents product brands or manufacturers in the system. Brands help organize products and provide trust signals to customers.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create brand.py File | Low |
| 16 | Define Brand Class | Medium |
| 17 | Add Brand name Field | Low |
| 18 | Add Brand slug Field | Low |
| 19 | Add Brand logo Field | Medium |
| 20 | Add Brand description Field | Low |
| 21 | Add Brand website Field | Low |
| 22 | Add Brand is_active Field | Low |
| 23 | Export Brand Model | Low |

---

## Task 15: Create brand.py File

### Overview
Create a new file for the Brand model within the models module.

### Dependencies
- Task 14: Define DISCONTINUED Status
- models/ directory must exist

### Instructions

1. **Create brand.py file**
   - Create new file named `brand.py` in models/ directory
   - Place at: `backend/apps/products/models/brand.py`
   - This file will contain the Brand model class

2. **Add file docstring**
   - Describe the Brand model purpose
   - Mention key use cases and relationships
   - Note tenant isolation behavior

3. **Import required dependencies**
   - Import Django models module
   - Import BaseModel from core app
   - Import gettext_lazy for translation
   - Import any validators needed

4. **Prepare file structure**
   - Add imports section at top
   - Leave space for the Brand class
   - Follow Django model file conventions

### Expected Outcome
```python
"""
Brand model for LankaCommerce Cloud.

Represents product brands or manufacturers. Brands help organize products
and provide trust signals for customers.

Each brand is tenant-specific and can have:
- Name and unique slug
- Logo image
- Description and website
- Active/inactive status
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import BaseModel


# Brand model will be defined below
```

### Verification Checklist
- [ ] brand.py file created in models/ directory
- [ ] File has descriptive docstring
- [ ] Required imports are present
- [ ] File path is correct

---

## Task 16: Define Brand Class

### Overview
Define the Brand model class with proper inheritance and model metadata.

### Dependencies
- Task 15: Create brand.py File

### Instructions

1. **Create Brand model class**
   - Define class named `Brand`
   - Inherit from `BaseModel`
   - Add class docstring explaining purpose

2. **Understand BaseModel inheritance**
   - BaseModel provides: id, created_at, updated_at, is_deleted
   - BaseModel includes tenant isolation
   - BaseModel has soft delete support
   - All common fields are inherited

3. **Add class-level docstring**
   - Explain Brand model purpose
   - List key fields that will be added
   - Note relationships to products
   - Mention tenant-specific behavior

4. **Prepare for field definitions**
   - Fields will be added in subsequent tasks
   - Each field will have proper type and constraints
   - All fields will have help_text for documentation

### Brand Model Purpose

| Aspect | Purpose |
|--------|---------|
| **Organization** | Group products by manufacturer |
| **Trust** | Build customer confidence |
| **Filtering** | Allow customers to shop by brand |
| **Marketing** | Brand pages in webstore |
| **Reporting** | Sales analysis by brand |

### Expected Outcome
```python
class Brand(BaseModel):
    """
    Represents a product brand or manufacturer.
    
    Brands help organize products and provide filtering options
    for customers. Each brand can have a logo, description, and
    website link.
    
    Examples: Apple, Samsung, Nike, Coca-Cola
    
    Relationships:
    - Products: Many products can belong to one brand
    
    Tenant Isolation: Each tenant has separate brands
    """
    
    # Fields will be added in next tasks
    
    class Meta:
        db_table = 'products_brand'
        verbose_name = _('Brand')
        verbose_name_plural = _('Brands')
        ordering = ['name']
```

### Verification Checklist
- [ ] Brand class is defined
- [ ] Inherits from BaseModel
- [ ] Has comprehensive docstring
- [ ] Meta class is configured

---

## Task 17: Add Brand name Field

### Overview
Add the name field to store the brand name.

### Dependencies
- Task 16: Define Brand Class

### Instructions

1. **Define name field**
   - Use CharField for the name
   - Set max_length to 100 characters
   - Make it required (blank=False, null=False)
   - Add verbose_name for admin display

2. **Add field help_text**
   - Explain the purpose of the field
   - Provide guidance on format
   - Mention character limit

3. **Consider validation**
   - Name should be unique per tenant
   - No special validation needed (letters, numbers, spaces okay)
   - Will be used in display throughout the system

4. **Understand name usage**
   - Displayed in product listings
   - Used in admin interface
   - Searchable field
   - Part of brand identity

### Name Field Specifications

| Property | Value |
|----------|-------|
| **Type** | CharField |
| **Max Length** | 100 |
| **Required** | Yes |
| **Unique** | Per tenant |
| **Searchable** | Yes |

### Expected Outcome
```python
class Brand(BaseModel):
    """[docstring]"""
    
    name = models.CharField(
        max_length=100,
        verbose_name=_('Brand Name'),
        help_text=_('Name of the brand or manufacturer (e.g., Apple, Samsung)')
    )
```

### Verification Checklist
- [ ] name field is defined
- [ ] CharField with max_length=100
- [ ] Has verbose_name with translation
- [ ] Has descriptive help_text

---

## Task 18: Add Brand slug Field

### Overview
Add the slug field for URL-friendly brand identifier.

### Dependencies
- Task 17: Add Brand name Field

### Instructions

1. **Define slug field**
   - Use SlugField for URL compatibility
   - Set max_length to 100 characters
   - Make it unique per tenant
   - Allow blank for auto-generation

2. **Configure slug uniqueness**
   - Should be unique per tenant
   - Use UniqueForTenantValidator (from core validators)
   - Or rely on database unique constraint with tenant_id

3. **Add auto-generation note**
   - Slug can be auto-generated from name
   - Can be manually overridden
   - Must be URL-safe (lowercase, hyphens)

4. **Understand slug usage**
   - Used in brand page URLs: /brands/apple/
   - SEO-friendly identifier
   - Human-readable in URLs
   - Must remain stable once published

### Slug Field Specifications

| Property | Value |
|----------|-------|
| **Type** | SlugField |
| **Max Length** | 100 |
| **Unique** | Per tenant |
| **Auto-Generated** | From name if blank |
| **Format** | lowercase-with-hyphens |

### Expected Outcome
```python
class Brand(BaseModel):
    """[docstring]"""
    
    name = models.CharField(
        max_length=100,
        verbose_name=_('Brand Name'),
        help_text=_('Name of the brand or manufacturer')
    )
    
    slug = models.SlugField(
        max_length=100,
        blank=True,
        verbose_name=_('URL Slug'),
        help_text=_('URL-friendly identifier (auto-generated from name if left blank)')
    )
```

### Verification Checklist
- [ ] slug field is defined
- [ ] SlugField with max_length=100
- [ ] blank=True for auto-generation
- [ ] Has help_text explaining auto-generation

---

## Task 19: Add Brand logo Field

### Overview
Add the logo field to store brand logo images.

### Dependencies
- Task 18: Add Brand slug Field

### Instructions

1. **Define logo field**
   - Use ImageField for image uploads
   - Set upload_to with tenant-specific path
   - Make it optional (blank=True, null=True)
   - Add verbose_name and help_text

2. **Configure upload path**
   - Use dynamic upload_to function or path
   - Include tenant_id in path for isolation
   - Format: `brands/{tenant_id}/logos/`
   - Helps organize files by tenant

3. **Add file validation notes**
   - Image format validation (JPEG, PNG)
   - File size limits (configured in settings)
   - Dimension recommendations (e.g., 500x500px)
   - Aspect ratio guidance (square preferred)

4. **Configure storage backend**
   - Use default storage backend
   - Will use tenant-aware storage from core
   - Supports local development and S3 production
   - Automatic file cleanup on deletion

### Logo Field Specifications

| Property | Value |
|----------|-------|
| **Type** | ImageField |
| **Required** | No (optional) |
| **Upload Path** | brands/{tenant_id}/logos/ |
| **Formats** | JPEG, PNG |
| **Recommended Size** | 500x500px |
| **Aspect Ratio** | Square (1:1) |

### Storage Path Structure
```
media/
└── brands/
    ├── {tenant_1_id}/
    │   └── logos/
    │       ├── brand-logo-1.png
    │       └── brand-logo-2.jpg
    └── {tenant_2_id}/
        └── logos/
            └── brand-logo-3.png
```

### Expected Outcome
```python
class Brand(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    
    logo = models.ImageField(
        upload_to='brands/logos/',
        blank=True,
        null=True,
        verbose_name=_('Brand Logo'),
        help_text=_('Brand logo image (recommended: 500x500px, square aspect ratio)')
    )
```

### Verification Checklist
- [ ] logo field is defined
- [ ] ImageField with upload_to path
- [ ] blank=True and null=True
- [ ] Help text includes size recommendation

---

## Task 20: Add Brand description Field

### Overview
Add the description field for brand information.

### Dependencies
- Task 19: Add Brand logo Field

### Instructions

1. **Define description field**
   - Use TextField for long text
   - Make it optional (blank=True)
   - Add verbose_name and help_text
   - Support rich text formatting (HTML)

2. **Configure field properties**
   - No max_length (unlimited text)
   - blank=True allows empty descriptions
   - null=False, use empty string as default
   - Will display in brand pages

3. **Plan content structure**
   - Can include brand history
   - Product range information
   - Brand values and mission
   - HTML formatting supported

4. **Consider usage scenarios**
   - Brand page content in webstore
   - Admin reference information
   - Marketing and SEO content
   - Optional but recommended

### Description Field Usage

| Context | Purpose |
|---------|---------|
| **Webstore** | Brand page content |
| **Admin** | Reference information |
| **SEO** | Brand page meta description |
| **Marketing** | Brand storytelling |

### Expected Outcome
```python
class Brand(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    logo = models.ImageField(...)
    
    description = models.TextField(
        blank=True,
        verbose_name=_('Description'),
        help_text=_('Brand description for webstore display (supports HTML formatting)')
    )
```

### Verification Checklist
- [ ] description field is defined
- [ ] TextField with blank=True
- [ ] Has verbose_name with translation
- [ ] Help text mentions HTML support

---

## Task 21: Add Brand website Field

### Overview
Add the website field to store the brand's official website URL.

### Dependencies
- Task 20: Add Brand description Field

### Instructions

1. **Define website field**
   - Use URLField for URL validation
   - Make it optional (blank=True)
   - Set max_length to 200
   - Add verbose_name and help_text

2. **Configure URL validation**
   - Django validates URL format automatically
   - Must include protocol (http:// or https://)
   - International domains supported
   - URL will be clickable in admin

3. **Plan usage scenarios**
   - Link to brand's official site from brand pages
   - Reference for admin users
   - Trust signal for customers
   - Optional field

4. **Consider display options**
   - Open in new tab when clicked
   - Add rel="nofollow" for SEO
   - Display as "Official Website" link
   - Show brand domain only in listings

### Website Field Specifications

| Property | Value |
|----------|-------|
| **Type** | URLField |
| **Max Length** | 200 |
| **Required** | No (optional) |
| **Validation** | Automatic URL format |
| **Protocol** | http:// or https:// required |

### Expected Outcome
```python
class Brand(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    logo = models.ImageField(...)
    description = models.TextField(...)
    
    website = models.URLField(
        max_length=200,
        blank=True,
        verbose_name=_('Official Website'),
        help_text=_('Brand\'s official website URL (e.g., https://www.apple.com)')
    )
```

### Verification Checklist
- [ ] website field is defined
- [ ] URLField with max_length=200
- [ ] blank=True for optional
- [ ] Help text shows example URL

---

## Task 22: Add Brand is_active Field

### Overview
Add the is_active field to enable/disable brands without deletion.

### Dependencies
- Task 21: Add Brand website Field

### Instructions

1. **Define is_active field**
   - Use BooleanField for true/false value
   - Set default to True
   - Add verbose_name and help_text
   - Required field (no blank/null)

2. **Understand active/inactive behavior**
   - Inactive brands hidden in frontend
   - Products keep brand reference when inactive
   - Admin can still view and edit inactive brands
   - Soft disable (not deletion)

3. **Plan filtering usage**
   - Filter brand lists by is_active=True
   - Admin can toggle status easily
   - Dropdown filters show only active by default
   - Reports can include/exclude inactive

4. **Consider use cases**
   - Temporarily disable discontinued brands
   - Hide brands during disputes
   - Seasonal brand visibility
   - Easy to reactivate later

### Active Status Behavior

| Context | Active=True | Active=False |
|---------|-------------|--------------|
| **Frontend Filters** | Visible | Hidden |
| **Product Display** | Shows brand | Shows brand (historical) |
| **Admin** | Editable | Editable |
| **New Products** | Can select | Not recommended |

### Expected Outcome
```python
class Brand(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    slug = models.SlugField(...)
    logo = models.ImageField(...)
    description = models.TextField(...)
    website = models.URLField(...)
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Inactive brands are hidden from frontend but products keep their reference')
    )
    
    class Meta:
        db_table = 'products_brand'
        verbose_name = _('Brand')
        verbose_name_plural = _('Brands')
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]
```

### Verification Checklist
- [ ] is_active field is defined
- [ ] BooleanField with default=True
- [ ] Has descriptive help_text
- [ ] Indexes include slug and is_active

---

## Task 23: Export Brand Model

### Overview
Export the Brand model from the models module for use throughout the application.

### Dependencies
- Task 22: Add Brand is_active Field

### Instructions

1. **Open models/__init__.py file**
   - Locate the models package init file
   - Find the commented import section for Brand

2. **Uncomment Brand import**
   - Import Brand from brand module
   - Add to __all__ list for explicit export

3. **Follow import organization**
   - Brand should be in "Supporting models" section
   - Imports should be alphabetically ordered within sections
   - Keep one import per line for clarity

4. **Verify import path**
   - Use relative import: `from .brand import Brand`
   - Ensure module name matches file name
   - Check for typos in import statement

### models/__init__.py Structure

```python
"""
Product models for LankaCommerce Cloud.
"""

# Supporting models
from .brand import Brand

# __all__ list
__all__ = [
    'Brand',
]
```

### Expected Outcome
```python
"""
Product models for LankaCommerce Cloud.

This module contains:
- Brand: Product brand/manufacturer
- TaxClass: Tax rate configuration (coming next)
- UnitOfMeasure: Product measurement units (coming next)
- Product: Core product model (coming later)
"""

# Supporting models
from .brand import Brand
# from .tax_class import TaxClass
# from .unit_of_measure import UnitOfMeasure

# Core models
# from .product import Product

# Managers
# from .managers import ProductManager, ProductQuerySet

__all__ = [
    'Brand',
    # More models will be added here
]
```

### Verification Checklist
- [ ] Brand imported in models/__init__.py
- [ ] Brand added to __all__ list
- [ ] Import statement uses relative import
- [ ] No import errors when importing Brand

---

## Summary of Deliverables

After completing these tasks, the Brand model should be fully functional:

```
backend/apps/products/
└── models/
    ├── __init__.py           # Exports Brand
    └── brand.py              # Brand model definition
```

### Complete Brand Model Structure

```python
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import BaseModel


class Brand(BaseModel):
    """Represents a product brand or manufacturer."""
    
    name = models.CharField(
        max_length=100,
        verbose_name=_('Brand Name'),
        help_text=_('Name of the brand or manufacturer')
    )
    
    slug = models.SlugField(
        max_length=100,
        blank=True,
        verbose_name=_('URL Slug'),
        help_text=_('URL-friendly identifier')
    )
    
    logo = models.ImageField(
        upload_to='brands/logos/',
        blank=True,
        null=True,
        verbose_name=_('Brand Logo'),
        help_text=_('Brand logo image (500x500px recommended)')
    )
    
    description = models.TextField(
        blank=True,
        verbose_name=_('Description'),
        help_text=_('Brand description (supports HTML)')
    )
    
    website = models.URLField(
        max_length=200,
        blank=True,
        verbose_name=_('Official Website'),
        help_text=_('Brand\'s official website URL')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Inactive brands are hidden from frontend')
    )
    
    class Meta:
        db_table = 'products_brand'
        verbose_name = _('Brand')
        verbose_name_plural = _('Brands')
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name
```

### Key Achievements
✓ Brand model with all required fields  
✓ Logo image support with tenant isolation  
✓ URL-friendly slug for brand pages  
✓ Active/inactive status for soft disabling  
✓ Model exported for use in other modules  
✓ Translation support for all text fields

---

## Notes for Implementation

1. **Slug Auto-Generation**
   - Implement in save() method or use AutoSlugField
   - Generate from name: "Apple Inc." → "apple-inc"
   - Ensure uniqueness per tenant
   - Only auto-generate if slug is blank

2. **Logo Storage**
   - Use tenant-aware storage backend
   - Implement file validation (size, format)
   - Consider image optimization (resize, compress)
   - Clean up old files when logo is updated

3. **Brand Filtering**
   - Create custom queryset method: `active()`
   - Use in brand dropdowns and filters
   - Consider caching active brand list
   - Index is_active field for performance

4. **Admin Configuration**
   - Show logo thumbnail in list view
   - Make slug auto-populate from name
   - Add is_active filter in sidebar
   - Enable search on name field

---
