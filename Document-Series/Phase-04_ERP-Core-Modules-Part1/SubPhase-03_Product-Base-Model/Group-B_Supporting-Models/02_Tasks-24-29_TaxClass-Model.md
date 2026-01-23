# Tasks 24-29: TaxClass Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** B - Supporting Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 24, 25, 26, 27, 28, 29

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-23_Brand-Model.md](01_Tasks-15-23_Brand-Model.md)
- **→ Next Document:** [03_Tasks-30-32_UnitOfMeasure-Model.md](03_Tasks-30-32_UnitOfMeasure-Model.md)

---

## Document Overview

This document covers the creation of the TaxClass model, which manages tax rates for products. Tax classes are essential for calculating prices and taxes in accordance with Sri Lankan tax regulations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 24 | Create tax_class.py File | Low |
| 25 | Define TaxClass Class | Medium |
| 26 | Add TaxClass name Field | Low |
| 27 | Add TaxClass rate Field | Medium |
| 28 | Add TaxClass is_default Field | Low |
| 29 | Export TaxClass Model | Low |

---

## Task 24: Create tax_class.py File

### Overview
Create a new file for the TaxClass model within the models module.

### Dependencies
- Task 23: Export Brand Model
- models/ directory must exist

### Instructions

1. **Create tax_class.py file**
   - Create new file named `tax_class.py` in models/ directory
   - Place at: `backend/apps/products/models/tax_class.py`
   - This file will contain the TaxClass model

2. **Add file docstring**
   - Describe the TaxClass model purpose
   - Explain tax rate management
   - Note Sri Lankan tax context (VAT)
   - Mention tenant-specific tax configurations

3. **Import required dependencies**
   - Import Django models module
   - Import BaseModel from core app
   - Import gettext_lazy for translation
   - Import DecimalField validators
   - Import MinValueValidator, MaxValueValidator

4. **Add Sri Lankan tax context**
   - Sri Lanka uses Value Added Tax (VAT)
   - Standard VAT rate is currently 15% (as of 2024)
   - Some products may be exempt (0%)
   - Some products may have reduced rates
   - Tax rates can change, so configurable rates are essential

### Sri Lankan Tax Context

| Tax Type | Description | Common Rates |
|----------|-------------|--------------|
| **VAT** | Value Added Tax | 0%, 8%, 15% |
| **NBT** | Nation Building Tax | 2% (on some items) |
| **Exempt** | No tax | 0% |
| **Zero-rated** | VAT registered but 0% | 0% |

### Expected Outcome
```python
"""
TaxClass model for LankaCommerce Cloud.

Manages tax rates for products in accordance with Sri Lankan tax regulations.
Tax classes allow flexible tax rate configuration per tenant.

Sri Lankan Tax Context:
- VAT (Value Added Tax): Standard rate is 15% (as of 2024)
- Some products are exempt (0%)
- Rates are configurable per tenant
- Each product references a tax class

Examples:
- Standard VAT (15%)
- Zero-rated (0%)
- Essential Goods (0% or reduced rate)
"""

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import BaseModel


# TaxClass model will be defined below
```

### Verification Checklist
- [ ] tax_class.py file created in models/ directory
- [ ] File has descriptive docstring
- [ ] Sri Lankan tax context mentioned
- [ ] Required imports are present

---

## Task 25: Define TaxClass Class

### Overview
Define the TaxClass model class with proper inheritance and model metadata.

### Dependencies
- Task 24: Create tax_class.py File

### Instructions

1. **Create TaxClass model class**
   - Define class named `TaxClass`
   - Inherit from `BaseModel`
   - Add comprehensive class docstring

2. **Understand TaxClass purpose**
   - Stores tax rate configurations
   - Each tenant can define custom rates
   - Products reference TaxClass for pricing
   - Tax calculations use these rates

3. **Add class-level docstring**
   - Explain TaxClass purpose and usage
   - List key fields that will be added
   - Note relationship to products
   - Explain is_default behavior

4. **Configure Meta class**
   - Set db_table name
   - Set verbose names with translation
   - Set default ordering (by name)
   - Plan for unique constraints

### TaxClass Model Purpose

| Aspect | Purpose |
|--------|---------|
| **Flexibility** | Different rates for different products |
| **Compliance** | Meet tax reporting requirements |
| **Calculation** | Automatic tax computation in invoices |
| **Configuration** | Tenant-specific tax setups |

### Expected Outcome
```python
class TaxClass(BaseModel):
    """
    Represents a tax rate configuration for products.
    
    Tax classes allow flexible configuration of tax rates per tenant.
    Each product references a tax class which determines the tax rate
    applied during pricing and invoice generation.
    
    Examples:
    - Standard VAT (15%)
    - Zero-rated (0%)
    - Essential Goods (8%)
    - Exempt (0%)
    
    Relationships:
    - Products: Many products can use the same tax class
    
    Tenant Isolation: Each tenant has separate tax classes
    """
    
    # Fields will be added in next tasks
    
    class Meta:
        db_table = 'products_tax_class'
        verbose_name = _('Tax Class')
        verbose_name_plural = _('Tax Classes')
        ordering = ['name']
```

### Verification Checklist
- [ ] TaxClass class is defined
- [ ] Inherits from BaseModel
- [ ] Has comprehensive docstring
- [ ] Meta class is configured with db_table

---

## Task 26: Add TaxClass name Field

### Overview
Add the name field to identify the tax class.

### Dependencies
- Task 25: Define TaxClass Class

### Instructions

1. **Define name field**
   - Use CharField for the name
   - Set max_length to 50 characters
   - Make it required (blank=False, null=False)
   - Add verbose_name and help_text

2. **Consider naming conventions**
   - Descriptive names: "Standard VAT", "Zero-rated", "Exempt"
   - Keep names short but clear
   - Names shown in dropdowns and invoices
   - Should be meaningful for users

3. **Plan uniqueness**
   - Name should be unique per tenant
   - Prevents duplicate tax classes
   - Use model constraint or validator

4. **Understand name usage**
   - Displayed in product forms
   - Shown in admin interface
   - Appears on invoices
   - Used in tax reports

### Common Tax Class Names

| Name | Rate | Usage |
|------|------|-------|
| **Standard VAT** | 15% | Most taxable goods |
| **Zero-rated** | 0% | Exports, essential items |
| **Exempt** | 0% | Non-taxable items |
| **Essential Goods** | 8% | Reduced rate items |

### Expected Outcome
```python
class TaxClass(BaseModel):
    """[docstring]"""
    
    name = models.CharField(
        max_length=50,
        verbose_name=_('Tax Class Name'),
        help_text=_('Name of the tax class (e.g., Standard VAT, Zero-rated)')
    )
```

### Verification Checklist
- [ ] name field is defined
- [ ] CharField with max_length=50
- [ ] Has verbose_name with translation
- [ ] Has descriptive help_text

---

## Task 27: Add TaxClass rate Field

### Overview
Add the rate field to store the tax percentage.

### Dependencies
- Task 26: Add TaxClass name Field

### Instructions

1. **Define rate field**
   - Use DecimalField for precise calculations
   - Set max_digits to 5 (allows 999.99)
   - Set decimal_places to 2 (two decimal precision)
   - Add validators for valid range
   - Add verbose_name and help_text

2. **Configure decimal precision**
   - DecimalField prevents floating-point errors
   - Essential for financial calculations
   - 2 decimal places: 15.00, 8.50, 0.00
   - Stored as DECIMAL in database

3. **Add validation constraints**
   - MinValueValidator(0): Rate cannot be negative
   - MaxValueValidator(100): Rate cannot exceed 100%
   - Django validates on save and in forms
   - Custom validation can be added in clean()

4. **Understand rate format**
   - Rate is stored as percentage: 15.00 means 15%
   - Calculation: price * (rate / 100)
   - Example: ₨1000 × (15 / 100) = ₨150 tax
   - Display with % symbol in UI

### Rate Field Specifications

| Property | Value |
|----------|-------|
| **Type** | DecimalField |
| **Max Digits** | 5 |
| **Decimal Places** | 2 |
| **Min Value** | 0.00 |
| **Max Value** | 100.00 |
| **Format** | Percentage (15.00 = 15%) |

### Tax Calculation Example

```
┌─────────────────────────────────────────────────────┐
│             TAX CALCULATION EXAMPLE                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Product Price: ₨1,000.00                          │
│  Tax Class: Standard VAT                           │
│  Tax Rate: 15.00%                                  │
│                                                     │
│  Calculation:                                       │
│  Tax Amount = Price × (Rate ÷ 100)                │
│  Tax Amount = 1,000 × (15 ÷ 100)                   │
│  Tax Amount = 1,000 × 0.15                         │
│  Tax Amount = ₨150.00                              │
│                                                     │
│  Total Price = Price + Tax Amount                  │
│  Total Price = ₨1,000.00 + ₨150.00                │
│  Total Price = ₨1,150.00                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
```python
class TaxClass(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    
    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ],
        verbose_name=_('Tax Rate (%)'),
        help_text=_('Tax rate as percentage (e.g., 15.00 for 15% VAT)')
    )
```

### Verification Checklist
- [ ] rate field is defined
- [ ] DecimalField with max_digits=5, decimal_places=2
- [ ] Has MinValueValidator(0)
- [ ] Has MaxValueValidator(100)
- [ ] Help text explains percentage format

---

## Task 28: Add TaxClass is_default Field

### Overview
Add the is_default field to mark the default tax class for new products.

### Dependencies
- Task 27: Add TaxClass rate Field

### Instructions

1. **Define is_default field**
   - Use BooleanField for true/false value
   - Set default to False
   - Add verbose_name and help_text
   - Required field (no blank/null)

2. **Understand default behavior**
   - Only one tax class should be default per tenant
   - Default tax class is pre-selected in product forms
   - Simplifies product creation
   - Can be changed per product

3. **Plan uniqueness constraint**
   - Add database constraint or validation
   - Ensure only one is_default=True per tenant
   - When setting new default, unset previous default
   - Handle in model save() method or database constraint

4. **Document default usage**
   - Automatically assigned to new products
   - Admin can override during product creation
   - Shown first in dropdown lists
   - Indicated in admin interface

### Default Tax Class Behavior

| Scenario | Behavior |
|----------|----------|
| **New Product** | Auto-assigned default tax class |
| **Multiple Defaults** | Should be prevented |
| **No Default** | User must select tax class |
| **Change Default** | Previous default becomes non-default |

### Expected Outcome
```python
class TaxClass(BaseModel):
    """[docstring]"""
    
    name = models.CharField(...)
    rate = models.DecimalField(...)
    
    is_default = models.BooleanField(
        default=False,
        verbose_name=_('Default Tax Class'),
        help_text=_(
            'Mark as default tax class for new products. '
            'Only one tax class should be default per tenant.'
        )
    )
    
    class Meta:
        db_table = 'products_tax_class'
        verbose_name = _('Tax Class')
        verbose_name_plural = _('Tax Classes')
        ordering = ['name']
        indexes = [
            models.Index(fields=['is_default']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.rate}%)"
```

### Verification Checklist
- [ ] is_default field is defined
- [ ] BooleanField with default=False
- [ ] Has descriptive help_text
- [ ] __str__ method returns name and rate

---

## Task 29: Export TaxClass Model

### Overview
Export the TaxClass model from the models module for use throughout the application.

### Dependencies
- Task 28: Add TaxClass is_default Field

### Instructions

1. **Open models/__init__.py file**
   - Locate the models package init file
   - Find the import section for TaxClass

2. **Add TaxClass import**
   - Import TaxClass from tax_class module
   - Place after Brand import
   - Add to __all__ list

3. **Follow import organization**
   - Keep supporting models together
   - Maintain alphabetical order within sections
   - Use relative imports

4. **Verify import functionality**
   - Ensure no circular imports
   - Test import: `from apps.products.models import TaxClass`
   - Verify in Django shell

### Expected Outcome
```python
"""
Product models for LankaCommerce Cloud.

This module contains:
- Brand: Product brand/manufacturer
- TaxClass: Tax rate configuration
- UnitOfMeasure: Product measurement units (coming next)
- Product: Core product model (coming later)
"""

# Supporting models
from .brand import Brand
from .tax_class import TaxClass
# from .unit_of_measure import UnitOfMeasure

# Core models
# from .product import Product

# Managers
# from .managers import ProductManager, ProductQuerySet

__all__ = [
    'Brand',
    'TaxClass',
    # More models will be added here
]
```

### Verification Checklist
- [ ] TaxClass imported in models/__init__.py
- [ ] TaxClass added to __all__ list
- [ ] Import uses relative path
- [ ] No import errors

---

## Summary of Deliverables

After completing these tasks, the TaxClass model should be fully functional:

```
backend/apps/products/
└── models/
    ├── __init__.py           # Exports Brand, TaxClass
    ├── brand.py              # Brand model
    └── tax_class.py          # TaxClass model definition
```

### Complete TaxClass Model Structure

```python
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import BaseModel


class TaxClass(BaseModel):
    """Represents a tax rate configuration for products."""
    
    name = models.CharField(
        max_length=50,
        verbose_name=_('Tax Class Name'),
        help_text=_('Name of the tax class (e.g., Standard VAT)')
    )
    
    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ],
        verbose_name=_('Tax Rate (%)'),
        help_text=_('Tax rate as percentage (e.g., 15.00 for 15%)')
    )
    
    is_default = models.BooleanField(
        default=False,
        verbose_name=_('Default Tax Class'),
        help_text=_('Mark as default for new products')
    )
    
    class Meta:
        db_table = 'products_tax_class'
        verbose_name = _('Tax Class')
        verbose_name_plural = _('Tax Classes')
        ordering = ['name']
        indexes = [
            models.Index(fields=['is_default']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.rate}%)"
```

### Key Achievements
✓ TaxClass model with precise decimal rate  
✓ Validation for rate range (0-100%)  
✓ Default tax class support  
✓ Sri Lankan tax context documented  
✓ Model exported for use in other modules  
✓ Translation support for all text fields

---

## Notes for Implementation

1. **Enforce Single Default**
   - Implement in save() method
   - When is_default=True, set others to False
   - Use database transaction for consistency
   - Alternative: Use database constraint

2. **Tax Calculations**
   - Always use DecimalField for money
   - Round tax amounts properly
   - Consider rounding rules (round half up)
   - Tax inclusive vs exclusive pricing

3. **Common Tax Classes Setup**
   - Create Standard VAT (15%) as default
   - Create Zero-rated (0%)
   - Create Exempt (0%)
   - Use data migration or management command

4. **Admin Configuration**
   - Show rate percentage in list view
   - Add is_default filter
   - Enable quick edit of rate
   - Highlight default tax class

5. **Future Enhancements**
   - Tax rate history (track rate changes)
   - Effective date for rate changes
   - Tax jurisdiction (for multiple locations)
   - Compound taxes (tax on tax)

---
