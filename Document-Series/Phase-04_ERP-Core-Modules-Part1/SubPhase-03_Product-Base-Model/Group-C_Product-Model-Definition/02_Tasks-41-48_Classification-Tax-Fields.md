# Tasks 41-48: Classification & Tax Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** C - Product Model Definition  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-40_Product-Identity-Fields.md](01_Tasks-33-40_Product-Identity-Fields.md)
- **→ Next Document:** [03_Tasks-49-56_Physical-SEO-Meta.md](03_Tasks-49-56_Physical-SEO-Meta.md)

---

## Document Overview

This document covers adding classification and tax-related fields to the Product model. These fields organize products and handle pricing calculations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 41 | Add category Field | Medium |
| 42 | Add brand Field | Medium |
| 43 | Add product_type Field | Medium |
| 44 | Add status Field | Medium |
| 45 | Add is_webstore_visible Field | Low |
| 46 | Add is_pos_visible Field | Low |
| 47 | Add tax_class Field | Medium |
| 48 | Add unit_of_measure Field | Medium |

---

## Task 41: Add category Field

### Overview
Add the category foreign key field to classify products hierarchically.

### Dependencies
- Task 40: Add short_description Field
- Category model must exist from SubPhase-01

### Instructions

1. **Define category field**
   - Use ForeignKey to Category model
   - Set on_delete=PROTECT (prevent category deletion if products exist)
   - Add related_name='products' for reverse lookups
   - Make it required (null=False)
   - Add db_index=True automatically (ForeignKey default)

2. **Understand category relationship**
   - Each product belongs to one category
   - Categories are hierarchical (MPTT)
   - Category helps organize and filter products
   - Category affects URL structure

3. **Configure field behavior**
   - PROTECT prevents accidental deletion
   - related_name allows: category.products.all()
   - Category is required for all products
   - Used in navigation and breadcrumbs

4. **Plan category usage**
   - Product filtering and search
   - Navigation menus
   - SEO-friendly URLs: /category/product/
   - Reports and analytics by category

### Category Field Specifications

| Property | Value |
|----------|-------|
| **Type** | ForeignKey(Category) |
| **On Delete** | PROTECT |
| **Related Name** | products |
| **Required** | Yes |
| **Indexed** | Yes (automatic) |

### Expected Outcome
```python
class Product(BaseModel):
    """[docstring]"""
    
    # Identity Fields
    name = models.CharField(...)
    slug = models.SlugField(...)
    sku = models.CharField(...)
    barcode = models.CharField(...)
    description = models.TextField(...)
    short_description = models.CharField(...)
    
    # ============================================
    # CLASSIFICATION FIELDS
    # ============================================
    
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('Category'),
        help_text=_('Product category for organization and filtering')
    )
```

### Verification Checklist
- [ ] category field is defined
- [ ] ForeignKey to Category model
- [ ] on_delete=PROTECT
- [ ] related_name='products'
- [ ] Has verbose_name and help_text

---

## Task 42: Add brand Field

### Overview
Add the brand foreign key field to associate products with brands.

### Dependencies
- Task 41: Add category Field

### Instructions

1. **Define brand field**
   - Use ForeignKey to Brand model
   - Set on_delete=SET_NULL (allow brand deletion, keep product)
   - Add related_name='products'
   - Make it optional (null=True, blank=True)
   - Add db_index=True automatically

2. **Understand brand relationship**
   - Brand is optional for products
   - Some products may not have brands (generic items)
   - Brand deletion sets product.brand to NULL
   - Brand helps with trust and filtering

3. **Configure field behavior**
   - SET_NULL allows brand deletion without cascade
   - Optional field, can be left blank
   - related_name allows: brand.products.all()
   - Used in filtering and brand pages

4. **Plan brand usage**
   - Filter products by brand
   - Brand pages in webstore
   - Trust signals for customers
   - Marketing and promotions

### Brand Field Specifications

| Property | Value |
|----------|-------|
| **Type** | ForeignKey(Brand) |
| **On Delete** | SET_NULL |
| **Related Name** | products |
| **Required** | No (optional) |
| **Indexed** | Yes (automatic) |

### Expected Outcome
```python
    category = models.ForeignKey(...)
    
    brand = models.ForeignKey(
        'Brand',
        on_delete=models.SET_NULL,
        related_name='products',
        null=True,
        blank=True,
        verbose_name=_('Brand'),
        help_text=_('Product brand or manufacturer (optional)')
    )
```

### Verification Checklist
- [ ] brand field is defined
- [ ] ForeignKey to Brand model
- [ ] on_delete=SET_NULL
- [ ] null=True and blank=True
- [ ] Has verbose_name and help_text

---

## Task 43: Add product_type Field

### Overview
Add the product_type choice field to define product behavior.

### Dependencies
- Task 42: Add brand Field
- PRODUCT_TYPES constant must exist

### Instructions

1. **Define product_type field**
   - Use CharField with choices
   - Set max_length to 20 characters
   - Set choices=PRODUCT_TYPES.choices
   - Set default=PRODUCT_TYPES.SIMPLE
   - Make it required

2. **Import PRODUCT_TYPES constant**
   - From apps.products.constants
   - Provides: SIMPLE, VARIABLE, BUNDLE, COMPOSITE
   - Type determines product behavior

3. **Understand product type implications**
   - SIMPLE: Direct pricing, single SKU
   - VARIABLE: Has variants (SubPhase-04)
   - BUNDLE: Contains other products
   - COMPOSITE: Has bill of materials (BOM)

4. **Configure field behavior**
   - Default is SIMPLE (most common)
   - Type rarely changes after creation
   - Type affects model behavior
   - Used in filtering and logic

### Product Type Specifications

| Property | Value |
|----------|-------|
| **Type** | CharField |
| **Max Length** | 20 |
| **Choices** | PRODUCT_TYPES |
| **Default** | SIMPLE |
| **Required** | Yes |

### Expected Outcome
```python
    brand = models.ForeignKey(...)
    
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPES.choices,
        default=PRODUCT_TYPES.SIMPLE,
        verbose_name=_('Product Type'),
        help_text=_(
            'Type determines product behavior: '
            'Simple (single item), Variable (with variants), '
            'Bundle (collection), Composite (BOM)'
        )
    )
```

### Verification Checklist
- [ ] product_type field is defined
- [ ] CharField with max_length=20
- [ ] choices=PRODUCT_TYPES.choices
- [ ] default=PRODUCT_TYPES.SIMPLE
- [ ] Help text explains types

---

## Task 44: Add status Field

### Overview
Add the status choice field to manage product lifecycle.

### Dependencies
- Task 43: Add product_type Field
- PRODUCT_STATUS constant must exist

### Instructions

1. **Define status field**
   - Use CharField with choices
   - Set max_length to 20 characters
   - Set choices=PRODUCT_STATUS.choices
   - Set default=PRODUCT_STATUS.DRAFT
   - Add db_index=True for filtering

2. **Import PRODUCT_STATUS constant**
   - From apps.products.constants
   - Provides: DRAFT, ACTIVE, ARCHIVED, DISCONTINUED
   - Status controls visibility

3. **Understand status workflow**
   - DRAFT: New products, not visible
   - ACTIVE: Published, available for sale
   - ARCHIVED: Temporarily hidden
   - DISCONTINUED: Permanently unavailable

4. **Configure field behavior**
   - Default is DRAFT (safe default)
   - Status must be changed to ACTIVE to publish
   - Indexed for performance
   - Used in all product queries

### Status Field Specifications

| Property | Value |
|----------|-------|
| **Type** | CharField |
| **Max Length** | 20 |
| **Choices** | PRODUCT_STATUS |
| **Default** | DRAFT |
| **Indexed** | Yes |

### Expected Outcome
```python
    product_type = models.CharField(...)
    
    status = models.CharField(
        max_length=20,
        choices=PRODUCT_STATUS.choices,
        default=PRODUCT_STATUS.DRAFT,
        db_index=True,
        verbose_name=_('Status'),
        help_text=_(
            'Product status: Draft (not visible), Active (published), '
            'Archived (hidden), Discontinued (unavailable)'
        )
    )
```

### Verification Checklist
- [ ] status field is defined
- [ ] CharField with max_length=20
- [ ] choices=PRODUCT_STATUS.choices
- [ ] default=PRODUCT_STATUS.DRAFT
- [ ] db_index=True
- [ ] Help text explains statuses

---

## Task 45: Add is_webstore_visible Field

### Overview
Add the is_webstore_visible boolean field to control webstore visibility.

### Dependencies
- Task 44: Add status Field

### Instructions

1. **Define is_webstore_visible field**
   - Use BooleanField
   - Set default to True
   - Add db_index=True for filtering
   - Add verbose_name and help_text

2. **Understand visibility control**
   - Works in conjunction with status
   - Product must be ACTIVE and is_webstore_visible=True to show
   - Allows hiding products from webstore while keeping in POS
   - Useful for B2B vs B2C products

3. **Configure field behavior**
   - Default True (most products are for webstore)
   - Indexed for quick filtering
   - Used in webstore queries
   - Separate from POS visibility

4. **Plan usage scenarios**
   - Hide wholesale products from retail webstore
   - Show only POS-exclusive items
   - Gradual product launches
   - Regional availability control

### Visibility Field Specifications

| Property | Value |
|----------|-------|
| **Type** | BooleanField |
| **Default** | True |
| **Indexed** | Yes |
| **Purpose** | Control webstore visibility |

### Expected Outcome
```python
    status = models.CharField(...)
    
    # ============================================
    # VISIBILITY FIELDS
    # ============================================
    
    is_webstore_visible = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name=_('Webstore Visible'),
        help_text=_(
            'Show product in webstore. Product must also be Active. '
            'Use this to hide products from webstore while keeping in POS.'
        )
    )
```

### Verification Checklist
- [ ] is_webstore_visible field is defined
- [ ] BooleanField with default=True
- [ ] db_index=True
- [ ] Help text explains interaction with status

---

## Task 46: Add is_pos_visible Field

### Overview
Add the is_pos_visible boolean field to control POS visibility.

### Dependencies
- Task 45: Add is_webstore_visible Field

### Instructions

1. **Define is_pos_visible field**
   - Use BooleanField
   - Set default to True
   - Add db_index=True for filtering
   - Add verbose_name and help_text

2. **Understand POS visibility**
   - Controls product availability in POS system
   - Works with status (must be ACTIVE)
   - Allows webstore-only products
   - Useful for online-exclusive items

3. **Configure field behavior**
   - Default True (most products in POS)
   - Indexed for POS queries
   - Independent of webstore visibility
   - Used in POS product search

4. **Plan usage scenarios**
   - Hide webstore-only products from POS
   - Digital products (no physical inventory)
   - Location-specific products
   - Special order items

### POS Visibility Specifications

| Property | Value |
|----------|-------|
| **Type** | BooleanField |
| **Default** | True |
| **Indexed** | Yes |
| **Purpose** | Control POS visibility |

### Expected Outcome
```python
    is_webstore_visible = models.BooleanField(...)
    
    is_pos_visible = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name=_('POS Visible'),
        help_text=_(
            'Show product in POS system. Product must also be Active. '
            'Use this to hide online-only products from POS.'
        )
    )
```

### Verification Checklist
- [ ] is_pos_visible field is defined
- [ ] BooleanField with default=True
- [ ] db_index=True
- [ ] Help text explains purpose

---

## Task 47: Add tax_class Field

### Overview
Add the tax_class foreign key field for tax calculations.

### Dependencies
- Task 46: Add is_pos_visible Field

### Instructions

1. **Define tax_class field**
   - Use ForeignKey to TaxClass model
   - Set on_delete=PROTECT
   - Add related_name='products'
   - Make it required (null=False)
   - Add db_index=True automatically

2. **Understand tax_class importance**
   - Essential for price calculations
   - Determines tax rate for invoices
   - Required for Sri Lankan tax compliance
   - Used in pricing and reporting

3. **Configure field behavior**
   - PROTECT prevents tax class deletion
   - Required field (all products need tax class)
   - Can default to tenant's default tax class
   - Used in all price calculations

4. **Plan tax calculation usage**
   - Applied to product price
   - Shown on invoices
   - Used in tax reports
   - Compliance with VAT rules

### Tax Class Field Specifications

| Property | Value |
|----------|-------|
| **Type** | ForeignKey(TaxClass) |
| **On Delete** | PROTECT |
| **Related Name** | products |
| **Required** | Yes |
| **Indexed** | Yes (automatic) |

### Expected Outcome
```python
    is_pos_visible = models.BooleanField(...)
    
    # ============================================
    # TAX & MEASUREMENT
    # ============================================
    
    tax_class = models.ForeignKey(
        'TaxClass',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('Tax Class'),
        help_text=_(
            'Tax rate applied to this product (e.g., Standard VAT 15%). '
            'Required for price calculations and tax reporting.'
        )
    )
```

### Verification Checklist
- [ ] tax_class field is defined
- [ ] ForeignKey to TaxClass model
- [ ] on_delete=PROTECT
- [ ] required (no null/blank)
- [ ] Help text explains importance

---

## Task 48: Add unit_of_measure Field

### Overview
Add the unit_of_measure foreign key field for quantity representation.

### Dependencies
- Task 47: Add tax_class Field

### Instructions

1. **Define unit_of_measure field**
   - Use ForeignKey to UnitOfMeasure model
   - Set on_delete=PROTECT
   - Add related_name='products'
   - Make it required (null=False)
   - Add db_index=True automatically

2. **Understand unit of measure importance**
   - Defines how quantity is displayed
   - Used in inventory tracking
   - Shown on invoices and receipts
   - Essential for stock management

3. **Configure field behavior**
   - PROTECT prevents UoM deletion
   - Required for all products
   - Used throughout inventory system
   - Examples: pcs, kg, l

4. **Plan UoM usage**
   - Display format: "10 pcs", "5.5 kg"
   - Stock tracking units
   - Purchase order units
   - Invoice line items

### Unit of Measure Field Specifications

| Property | Value |
|----------|-------|
| **Type** | ForeignKey(UnitOfMeasure) |
| **On Delete** | PROTECT |
| **Related Name** | products |
| **Required** | Yes |
| **Indexed** | Yes (automatic) |

### Expected Outcome
```python
    tax_class = models.ForeignKey(...)
    
    unit_of_measure = models.ForeignKey(
        'UnitOfMeasure',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('Unit of Measure'),
        help_text=_(
            'How product quantity is measured (e.g., Piece, Kilogram, Liter). '
            'Used in inventory tracking and display.'
        )
    )
```

### Verification Checklist
- [ ] unit_of_measure field is defined
- [ ] ForeignKey to UnitOfMeasure model
- [ ] on_delete=PROTECT
- [ ] required (no null/blank)
- [ ] Help text explains purpose

---

## Summary of Progress

After completing these tasks, classification and tax fields are complete:

### Classification & Tax Fields Added
✓ category - Product category (FK, required)  
✓ brand - Product brand (FK, optional)  
✓ product_type - Type: simple/variable/bundle/composite  
✓ status - Lifecycle: draft/active/archived/discontinued  
✓ is_webstore_visible - Show in webstore (boolean)  
✓ is_pos_visible - Show in POS (boolean)  
✓ tax_class - Tax rate for calculations (FK, required)  
✓ unit_of_measure - Quantity unit (FK, required)

### Current Product Model Progress
```python
class Product(BaseModel):
    # Identity Fields (6 fields)
    name, slug, sku, barcode, description, short_description
    
    # Classification & Tax Fields (8 fields)
    category, brand, product_type, status
    is_webstore_visible, is_pos_visible
    tax_class, unit_of_measure
    
    # Physical & SEO fields coming in next document
```

---

## Notes for Implementation

1. **Category Hierarchy**
   - Use MPTT for category navigation
   - Consider category path in URLs
   - Breadcrumbs from category tree
   - Child categories inherit some properties

2. **Product Visibility Logic**
   - Published products: status=ACTIVE AND is_webstore_visible=True
   - POS products: status=ACTIVE AND is_pos_visible=True
   - Create querysets: active(), published(), pos_available()

3. **Tax Class Default**
   - Auto-assign default tax class on creation
   - Allow override during product creation
   - Consider category-based tax class
   - Log tax class changes for auditing

4. **Unit of Measure Selection**
   - Group UoM by category (count, weight, volume)
   - Show common units first
   - Allow filtering in admin
   - Consider product-type-specific defaults

5. **Status Transitions**
   - Log status changes
   - Validate transitions (DRAFT → ACTIVE → ARCHIVED)
   - Notify on status change
   - Consider approval workflow

---
