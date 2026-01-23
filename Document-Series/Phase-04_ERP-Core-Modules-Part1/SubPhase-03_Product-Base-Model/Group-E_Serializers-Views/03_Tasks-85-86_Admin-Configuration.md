# Tasks 85-86: Admin Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** E - Serializers & Views  
> **Document:** 03 of 03  
> **Tasks Covered:** 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-79-84_ViewSets-URLs.md](02_Tasks-79-84_ViewSets-URLs.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers configuring Django admin interface for products app models.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 85 | Create admin.py File | Low |
| 86 | Configure ModelAdmin Classes | Medium |

---

## Task 85: Create admin.py File

### Overview
Create the Django admin module for products app.

### Dependencies
- Task 84: Create urls.py File

### Instructions

1. **Create admin.py file**
   - At: `backend/apps/products/admin.py`
   - Contains ModelAdmin classes

2. **Import dependencies**
   - Django admin
   - Product models
   - Any custom forms or widgets

### Expected Outcome
```python
"""
Django admin configuration for products app.
"""

from django.contrib import admin
from django.utils.html import format_html

from apps.products.models import (
    Brand,
    TaxClass,
    UnitOfMeasure,
    Product
)


# ModelAdmin classes will be defined below
```

### Verification Checklist
- [ ] admin.py created
- [ ] All imports present

---

## Task 86: Configure ModelAdmin Classes

### Overview
Create comprehensive admin interfaces for all product models.

### Dependencies
- Task 85: Create admin.py File

### Instructions

**Brand Admin**
1. Configure list_display: name, logo preview, is_active, created_at
2. Add list_filter: is_active, created_at
3. Add search_fields: name, description
4. Configure prepopulated_fields: slug from name
5. Add readonly_fields: created_at, updated_at
6. Create logo preview method with thumbnail

**TaxClass Admin**
1. Configure list_display: name, rate, is_default, created_at
2. Add list_filter: is_default, created_at
3. Add search_fields: name
4. Add readonly_fields: created_at, updated_at
5. Display rate with percentage

**UnitOfMeasure Admin**
1. Configure list_display: name, symbol, is_base_unit, is_active
2. Add list_filter: is_base_unit, is_active
3. Add search_fields: name, symbol
4. Add readonly_fields: created_at, updated_at

**Product Admin**
1. Configure list_display: sku, name, product_type, status, category, brand, featured
2. Add list_filter: product_type, status, is_webstore_visible, is_pos_visible, featured, created_at
3. Add search_fields: name, sku, barcode, description
4. Configure prepopulated_fields: slug from name
5. Add readonly_fields: sku (auto-generated), created_at, updated_at
6. Configure fieldsets for organized form
7. Add autocomplete_fields for ForeignKeys
8. Display colored status badges

### Expected Outcome

**Brand ModelAdmin:**
```python
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """
    Admin interface for Brand model.
    
    Features:
    - Logo thumbnail preview
    - Active status filter
    - Slug auto-population
    """
    
    list_display = [
        'name',
        'logo_preview',
        'is_active',
        'created_at'
    ]
    
    list_filter = [
        'is_active',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'description'
    ]
    
    prepopulated_fields = {
        'slug': ['name']
    }
    
    readonly_fields = [
        'logo_preview',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name',
                'slug',
                'description'
            )
        }),
        ('Branding', {
            'fields': (
                'logo',
                'logo_preview',
                'website'
            )
        }),
        ('Status', {
            'fields': (
                'is_active',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ['collapse']
        })
    )
    
    def logo_preview(self, obj):
        """Display logo thumbnail."""
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px;" />',
                obj.logo.url
            )
        return '-'
    logo_preview.short_description = 'Logo'
```

**TaxClass ModelAdmin:**
```python
@admin.register(TaxClass)
class TaxClassAdmin(admin.ModelAdmin):
    """
    Admin interface for TaxClass model.
    
    Features:
    - Rate display with percentage
    - Default tax class indicator
    """
    
    list_display = [
        'name',
        'rate_display',
        'is_default',
        'created_at'
    ]
    
    list_filter = [
        'is_default',
        'created_at'
    ]
    
    search_fields = [
        'name'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Tax Information', {
            'fields': (
                'name',
                'rate',
                'is_default'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ['collapse']
        })
    )
    
    def rate_display(self, obj):
        """Display rate with percentage symbol."""
        return f"{obj.rate}%"
    rate_display.short_description = 'Rate'
    rate_display.admin_order_field = 'rate'
```

**UnitOfMeasure ModelAdmin:**
```python
@admin.register(UnitOfMeasure)
class UnitOfMeasureAdmin(admin.ModelAdmin):
    """
    Admin interface for UnitOfMeasure model.
    
    Features:
    - Base unit indicator
    - Active status filter
    - Conversion factor display
    """
    
    list_display = [
        'name',
        'symbol',
        'conversion_factor',
        'is_base_unit',
        'is_active'
    ]
    
    list_filter = [
        'is_base_unit',
        'is_active'
    ]
    
    search_fields = [
        'name',
        'symbol'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Unit Information', {
            'fields': (
                'name',
                'symbol',
                'description'
            )
        }),
        ('Conversion', {
            'fields': (
                'conversion_factor',
                'is_base_unit'
            )
        }),
        ('Status', {
            'fields': (
                'is_active',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ['collapse']
        })
    )
```

**Product ModelAdmin:**
```python
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin interface for Product model.
    
    Features:
    - Rich product listing with filters
    - Status badges with colors
    - Auto-populated slug and SKU
    - Organized fieldsets
    - ForeignKey autocomplete
    """
    
    list_display = [
        'sku',
        'name',
        'product_type',
        'status_badge',
        'category',
        'brand',
        'featured',
        'created_at'
    ]
    
    list_filter = [
        'product_type',
        'status',
        'is_webstore_visible',
        'is_pos_visible',
        'featured',
        'category',
        'brand',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'sku',
        'barcode',
        'description',
        'short_description'
    ]
    
    prepopulated_fields = {
        'slug': ['name']
    }
    
    readonly_fields = [
        'sku',
        'created_at',
        'updated_at'
    ]
    
    autocomplete_fields = [
        'category',
        'brand',
        'tax_class',
        'unit_of_measure'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name',
                'slug',
                'sku',
                'barcode',
                'short_description',
                'description'
            )
        }),
        ('Classification', {
            'fields': (
                'category',
                'brand',
                'product_type',
                'status'
            )
        }),
        ('Visibility', {
            'fields': (
                'is_webstore_visible',
                'is_pos_visible',
                'featured'
            )
        }),
        ('Pricing & Tax', {
            'fields': (
                'tax_class',
                'unit_of_measure'
            )
        }),
        ('Physical Attributes', {
            'fields': (
                'weight',
                'length',
                'width',
                'height'
            ),
            'classes': ['collapse']
        }),
        ('SEO', {
            'fields': (
                'seo_title',
                'seo_description'
            ),
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ['collapse']
        })
    )
    
    def status_badge(self, obj):
        """Display status with colored badge."""
        colors = {
            'draft': '#999999',
            'active': '#28a745',
            'archived': '#ffc107',
            'discontinued': '#dc3545'
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
```

### Admin Features Summary

**Brand Admin:**
- Logo thumbnail preview
- Active/inactive filtering
- Slug auto-population
- Search by name and description

**TaxClass Admin:**
- Rate with percentage display
- Default indicator
- Simple interface

**UnitOfMeasure Admin:**
- Base unit indicator
- Conversion factor display
- Active status filter

**Product Admin:**
- Rich filtering (type, status, visibility)
- Colored status badges
- ForeignKey autocomplete
- Auto-generated SKU (readonly)
- Organized fieldsets (Basic, Classification, Visibility, Pricing, Physical, SEO)
- Search by name, SKU, barcode, description

### Verification Checklist
- [ ] All ModelAdmin classes created
- [ ] list_display configured for each
- [ ] list_filter configured for each
- [ ] search_fields configured for each
- [ ] readonly_fields set appropriately
- [ ] prepopulated_fields for slugs
- [ ] Custom display methods added
- [ ] fieldsets organized logically
- [ ] autocomplete_fields for ForeignKeys

---

## Summary of Deliverables

After completing Group E Document 3:

### Admin Interfaces Created
✓ BrandAdmin - Logo preview, active filter  
✓ TaxClassAdmin - Rate display, default indicator  
✓ UnitOfMeasureAdmin - Base unit, conversion display  
✓ ProductAdmin - Rich interface with filters and badges

### Features Implemented
✓ Logo thumbnail previews  
✓ Colored status badges  
✓ Auto-populated slugs  
✓ Readonly auto-generated fields (SKU)  
✓ ForeignKey autocomplete  
✓ Organized fieldsets  
✓ Advanced filtering  
✓ Comprehensive search

---

## Notes for Implementation

1. **Admin Performance**
   - Use select_related in get_queryset()
   - Limit list_per_page to 25-50
   - Add database indexes for filtered fields
   - Cache autocomplete results

2. **User Experience**
   - Group related fields in fieldsets
   - Collapse advanced sections
   - Use autocomplete for ForeignKeys
   - Display visual feedback (badges, colors)

3. **Validation**
   - Add custom validation in clean() methods
   - Display helpful error messages
   - Use inline formsets where appropriate
   - Add JavaScript for dynamic forms

4. **Security**
   - Respect user permissions
   - Add readonly fields for audit
   - Log admin actions
   - Validate file uploads (logos)

---
