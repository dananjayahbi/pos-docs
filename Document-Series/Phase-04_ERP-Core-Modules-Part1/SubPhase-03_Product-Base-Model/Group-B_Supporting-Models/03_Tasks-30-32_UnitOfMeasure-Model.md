# Tasks 30-32: UnitOfMeasure Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** B - Supporting Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-24-29_TaxClass-Model.md](02_Tasks-24-29_TaxClass-Model.md)
- **→ Next Group:** [../Group-C_Product-Model-Definition/](../Group-C_Product-Model-Definition/)

---

## Document Overview

This document covers the creation of the UnitOfMeasure model, which defines measurement units for products (pieces, kilograms, liters, etc.). Units of measure are essential for inventory tracking and sales transactions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 30 | Create unit_of_measure.py | Low |
| 31 | Define UnitOfMeasure Class | Medium |
| 32 | Export UnitOfMeasure Model | Low |

---

## Task 30: Create unit_of_measure.py

### Overview
Create a new file for the UnitOfMeasure model within the models module.

### Dependencies
- Task 29: Export TaxClass Model
- models/ directory must exist

### Instructions

1. **Create unit_of_measure.py file**
   - Create new file named `unit_of_measure.py` in models/ directory
   - Place at: `backend/apps/products/models/unit_of_measure.py`
   - This file will contain the UnitOfMeasure model

2. **Add file docstring**
   - Describe the UnitOfMeasure model purpose
   - Explain measurement unit standardization
   - List common units used in Sri Lankan commerce
   - Note tenant-specific unit configurations

3. **Import required dependencies**
   - Import Django models module
   - Import BaseModel from core app
   - Import gettext_lazy for translation
   - Import validators if needed

4. **Document common units**
   - Piece (pcs) - countable items
   - Kilogram (kg) - weight measurement
   - Gram (g) - smaller weight measurement
   - Liter (l) - volume/liquid measurement
   - Milliliter (ml) - smaller volume measurement
   - Meter (m) - length/distance
   - Box, Carton, Pack - packaging units

### Common Units in Sri Lankan Commerce

| Category | Units | Examples |
|----------|-------|----------|
| **Count** | Piece (pcs), Dozen | Books, Phones, Eggs |
| **Weight** | Kilogram (kg), Gram (g) | Rice, Sugar, Vegetables |
| **Volume** | Liter (l), Milliliter (ml) | Milk, Juice, Oil |
| **Length** | Meter (m), Centimeter (cm) | Fabric, Wire, Pipe |
| **Packaging** | Box, Carton, Pack | Bulk items |

### Expected Outcome
```python
"""
UnitOfMeasure model for LankaCommerce Cloud.

Defines measurement units for products used in inventory tracking,
sales transactions, and pricing.

Common units in Sri Lankan commerce:
- Count: Piece (pcs), Dozen
- Weight: Kilogram (kg), Gram (g)
- Volume: Liter (l), Milliliter (ml)
- Length: Meter (m), Centimeter (cm)
- Packaging: Box, Carton, Pack

Each product references a unit of measure which determines:
- How quantity is displayed
- How stock is tracked
- Unit conversions (if applicable)
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import BaseModel


# UnitOfMeasure model will be defined below
```

### Verification Checklist
- [ ] unit_of_measure.py file created in models/ directory
- [ ] File has descriptive docstring
- [ ] Common units are documented
- [ ] Required imports are present

---

## Task 31: Define UnitOfMeasure Class

### Overview
Define the complete UnitOfMeasure model class with all fields.

### Dependencies
- Task 30: Create unit_of_measure.py

### Instructions

1. **Create UnitOfMeasure model class**
   - Define class named `UnitOfMeasure`
   - Inherit from `BaseModel`
   - Add comprehensive class docstring

2. **Define name field**
   - Use CharField for full unit name
   - Set max_length to 50 characters
   - Make it required
   - Examples: "Piece", "Kilogram", "Liter"

3. **Define symbol field**
   - Use CharField for unit abbreviation
   - Set max_length to 10 characters
   - Make it required
   - Examples: "pcs", "kg", "l"

4. **Define conversion_factor field (optional)**
   - Use DecimalField for base unit conversion
   - Set max_digits to 10, decimal_places to 4
   - Make it optional (blank=True, null=True)
   - Default can be 1.0 (base unit)
   - Used for unit conversions (e.g., 1 kg = 1000 g)

5. **Define is_base_unit field (optional)**
   - Use BooleanField to mark base unit in category
   - Default to False
   - Helps identify primary unit for conversions
   - Example: kg is base for weight, l for volume

6. **Define description field**
   - Use TextField for detailed description
   - Make it optional
   - Explain when to use this unit
   - Provide examples

7. **Define is_active field**
   - Use BooleanField for enable/disable
   - Default to True
   - Inactive units hidden from selection

8. **Configure Meta class**
   - Set db_table name
   - Set verbose names with translation
   - Set ordering (by name or symbol)
   - Add indexes for frequently queried fields

9. **Add __str__ method**
   - Return format: "Name (symbol)"
   - Example: "Kilogram (kg)"

### UnitOfMeasure Field Structure

```
┌─────────────────────────────────────────────────────┐
│         UNIT OF MEASURE MODEL FIELDS                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Core Fields:                                       │
│  ├── name              → Full name (e.g., Kilogram) │
│  ├── symbol            → Abbreviation (e.g., kg)    │
│  └── description       → Usage explanation          │
│                                                     │
│  Conversion Fields (Optional):                      │
│  ├── conversion_factor → Conversion to base unit    │
│  └── is_base_unit      → Mark as base unit          │
│                                                     │
│  Status:                                            │
│  └── is_active         → Enable/disable unit        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Conversion Factor Examples

```
┌─────────────────────────────────────────────────────┐
│           UNIT CONVERSION EXAMPLES                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Weight Category (Base: Kilogram)                   │
│  ├── Kilogram (kg): 1.0 (base)                     │
│  └── Gram (g): 0.001 (1g = 0.001kg)                │
│                                                     │
│  Volume Category (Base: Liter)                      │
│  ├── Liter (l): 1.0 (base)                         │
│  └── Milliliter (ml): 0.001 (1ml = 0.001l)         │
│                                                     │
│  Length Category (Base: Meter)                      │
│  ├── Meter (m): 1.0 (base)                         │
│  └── Centimeter (cm): 0.01 (1cm = 0.01m)           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
```python
class UnitOfMeasure(BaseModel):
    """
    Represents a unit of measurement for products.
    
    Units define how product quantities are measured and displayed.
    Each product has one unit of measure which determines inventory
    tracking and display format.
    
    Examples:
    - Piece (pcs): Countable items
    - Kilogram (kg): Weight measurement
    - Liter (l): Volume measurement
    - Meter (m): Length measurement
    
    Relationships:
    - Products: Many products can use the same unit
    
    Tenant Isolation: Each tenant has separate units
    """
    
    name = models.CharField(
        max_length=50,
        verbose_name=_('Unit Name'),
        help_text=_('Full name of the unit (e.g., Kilogram, Piece, Liter)')
    )
    
    symbol = models.CharField(
        max_length=10,
        verbose_name=_('Symbol'),
        help_text=_('Unit abbreviation or symbol (e.g., kg, pcs, l)')
    )
    
    conversion_factor = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        blank=True,
        null=True,
        verbose_name=_('Conversion Factor'),
        help_text=_(
            'Conversion factor to base unit (e.g., 1 g = 0.001 kg). '
            'Leave blank if not applicable.'
        )
    )
    
    is_base_unit = models.BooleanField(
        default=False,
        verbose_name=_('Base Unit'),
        help_text=_('Mark as base unit for conversions in this category')
    )
    
    description = models.TextField(
        blank=True,
        verbose_name=_('Description'),
        help_text=_('Detailed description of when to use this unit')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Inactive units are hidden from selection')
    )
    
    class Meta:
        db_table = 'products_unit_of_measure'
        verbose_name = _('Unit of Measure')
        verbose_name_plural = _('Units of Measure')
        ordering = ['name']
        indexes = [
            models.Index(fields=['symbol']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_base_unit']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.symbol})"
    
    def clean(self):
        """Validate model data."""
        super().clean()
        # Add custom validation:
        # - If is_base_unit=True, conversion_factor should be 1.0
        # - Ensure symbol is not empty
        # - Validate conversion_factor is positive if provided
```

### Verification Checklist
- [ ] UnitOfMeasure class is defined
- [ ] Inherits from BaseModel
- [ ] All core fields are defined (name, symbol)
- [ ] Optional fields included (conversion_factor, description)
- [ ] is_active field for soft disable
- [ ] Meta class configured properly
- [ ] __str__ method returns formatted string
- [ ] clean() method added for validation

---

## Task 32: Export UnitOfMeasure Model

### Overview
Export the UnitOfMeasure model from the models module for use throughout the application.

### Dependencies
- Task 31: Define UnitOfMeasure Class

### Instructions

1. **Open models/__init__.py file**
   - Locate the models package init file
   - Find the import section for UnitOfMeasure

2. **Add UnitOfMeasure import**
   - Import UnitOfMeasure from unit_of_measure module
   - Place after TaxClass import
   - Add to __all__ list

3. **Verify all supporting models exported**
   - Brand, TaxClass, UnitOfMeasure should all be in __all__
   - Supporting models section is complete
   - Ready for Product model in next group

4. **Test imports**
   - Ensure no import errors
   - Test in Django shell: `from apps.products.models import UnitOfMeasure`
   - Verify all three models can be imported together

### Expected Outcome
```python
"""
Product models for LankaCommerce Cloud.

This module contains:
- Brand: Product brand/manufacturer
- TaxClass: Tax rate configuration
- UnitOfMeasure: Product measurement units
- Product: Core product model (coming in next group)
"""

# Supporting models
from .brand import Brand
from .tax_class import TaxClass
from .unit_of_measure import UnitOfMeasure

# Core models
# from .product import Product

# Managers
# from .managers import ProductManager, ProductQuerySet

__all__ = [
    'Brand',
    'TaxClass',
    'UnitOfMeasure',
    # Product will be added in Group C
]
```

### Verification Checklist
- [ ] UnitOfMeasure imported in models/__init__.py
- [ ] UnitOfMeasure added to __all__ list
- [ ] Import uses relative path
- [ ] No import errors
- [ ] All supporting models are exported

---

## Summary of Deliverables

After completing these tasks, all supporting models should be complete:

```
backend/apps/products/
└── models/
    ├── __init__.py              # Exports Brand, TaxClass, UnitOfMeasure
    ├── brand.py                 # Brand model
    ├── tax_class.py             # TaxClass model
    └── unit_of_measure.py       # UnitOfMeasure model
```

### Complete UnitOfMeasure Model Structure

```python
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import BaseModel


class UnitOfMeasure(BaseModel):
    """Represents a unit of measurement for products."""
    
    name = models.CharField(
        max_length=50,
        verbose_name=_('Unit Name'),
        help_text=_('Full name of the unit')
    )
    
    symbol = models.CharField(
        max_length=10,
        verbose_name=_('Symbol'),
        help_text=_('Unit abbreviation or symbol')
    )
    
    conversion_factor = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        blank=True,
        null=True,
        verbose_name=_('Conversion Factor'),
        help_text=_('Conversion factor to base unit')
    )
    
    is_base_unit = models.BooleanField(
        default=False,
        verbose_name=_('Base Unit'),
        help_text=_('Mark as base unit for conversions')
    )
    
    description = models.TextField(
        blank=True,
        verbose_name=_('Description'),
        help_text=_('When to use this unit')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Inactive units are hidden')
    )
    
    class Meta:
        db_table = 'products_unit_of_measure'
        verbose_name = _('Unit of Measure')
        verbose_name_plural = _('Units of Measure')
        ordering = ['name']
        indexes = [
            models.Index(fields=['symbol']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.symbol})"
```

### Key Achievements
✓ All three supporting models complete (Brand, TaxClass, UnitOfMeasure)  
✓ UnitOfMeasure with name and symbol fields  
✓ Optional conversion factor for unit conversions  
✓ Active/inactive status for soft disabling  
✓ All models exported and ready for use  
✓ Foundation ready for Product model

---

## Common Units Setup

Suggested initial units to create for Sri Lankan commerce:

### Count Units
```
Name: Piece     Symbol: pcs    Base: Yes   Factor: 1.0
Name: Dozen     Symbol: dz     Base: No    Factor: 12.0
Name: Pair      Symbol: pr     Base: No    Factor: 2.0
```

### Weight Units
```
Name: Kilogram  Symbol: kg     Base: Yes   Factor: 1.0
Name: Gram      Symbol: g      Base: No    Factor: 0.001
```

### Volume Units
```
Name: Liter     Symbol: l      Base: Yes   Factor: 1.0
Name: Milliliter Symbol: ml    Base: No    Factor: 0.001
```

### Length Units
```
Name: Meter     Symbol: m      Base: Yes   Factor: 1.0
Name: Centimeter Symbol: cm    Base: No    Factor: 0.01
```

### Packaging Units
```
Name: Box       Symbol: box    Base: Yes   Factor: 1.0
Name: Carton    Symbol: ctn    Base: Yes   Factor: 1.0
Name: Pack      Symbol: pk     Base: Yes   Factor: 1.0
```

---

## Notes for Implementation

1. **Unit Conversion**
   - Conversion factor is optional for simple implementations
   - Can be implemented in Phase 5 for advanced features
   - Essential for inventory management across units
   - Consider using base unit for stock tracking

2. **Common Unit Creation**
   - Create via data migration or management command
   - Standard units should be available to all tenants
   - Allow tenants to create custom units
   - Most common: Piece (pcs) should be default

3. **Admin Configuration**
   - Show symbol in list view
   - Add is_active filter
   - Group by category if using categories
   - Enable search on name and symbol

4. **Display Format**
   - Use symbol in quantity displays: "10 pcs", "5.5 kg"
   - Full name in forms and labels
   - Symbol in invoices and reports
   - Consider localization (kg vs lb for different regions)

5. **Future Enhancements**
   - Unit categories (count, weight, volume, length)
   - Compound units (e.g., kg/m² for fabric)
   - Fractional support (1/2 kg, 1.5 l)
   - Unit conversion API

6. **Best Practices**
   - Don't change units after products are created
   - Stock tracking uses the product's unit
   - Conversions should be bidirectional
   - Base unit simplifies reporting

---
