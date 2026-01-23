# Tasks 08-14: Constants - Product Types & Status

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** A - Products App Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_App-Creation-Configuration.md](01_Tasks-01-07_App-Creation-Configuration.md)
- **→ Next Group:** [../Group-B_Supporting-Models/](../Group-B_Supporting-Models/)

---

## Document Overview

This document covers the creation of constants for product types and product status. These constants define the behavior and lifecycle states of products in the system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 08 | Create constants.py File | Low |
| 09 | Define PRODUCT_TYPES | Medium |
| 10 | Define PRODUCT_STATUS | Medium |
| 11 | Define DRAFT Status | Low |
| 12 | Define ACTIVE Status | Low |
| 13 | Define ARCHIVED Status | Low |
| 14 | Define DISCONTINUED Status | Low |

---

## Task 08: Create constants.py File

### Overview
Create a constants module to store product-related constants including product types and status choices.

### Dependencies
- Task 07: Create models __init__.py

### Instructions

1. **Create constants.py file**
   - Create file named `constants.py` in the products app directory
   - Place it at the same level as models/ directory
   - This file will contain all product-related constants

2. **Add module docstring**
   - Describe the purpose of the constants module
   - List the constant groups defined here
   - Explain usage in models, serializers, and views

3. **Import required dependencies**
   - Import Django's TextChoices for choice fields
   - Import gettext_lazy for translation support
   - Use _ alias for gettext_lazy

4. **Prepare structure for constants**
   - Add section comments for organization
   - Separate product types from status constants
   - Use clear naming conventions

### Constants Module Purpose

| Purpose | Description |
|---------|-------------|
| **Centralization** | Single source of truth for choices |
| **Consistency** | Same values across models, serializers, views |
| **Maintainability** | Easy to update choice options |
| **Translation** | Support for multi-language labels |

### Expected Outcome
```python
"""
Constants for the products app.

This module defines:
- PRODUCT_TYPES: Types of products (simple, variable, bundle, composite)
- PRODUCT_STATUS: Product lifecycle states (draft, active, archived, discontinued)

These constants are used throughout the products app for:
- Model field choices
- Serializer validation
- View filtering
- Admin display
"""

from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


# Product type and status constants will be defined below
```

### Verification Checklist
- [ ] constants.py file exists in products app
- [ ] Module has descriptive docstring
- [ ] Required imports are present
- [ ] File structure is organized with comments

---

## Task 09: Define PRODUCT_TYPES

### Overview
Define the PRODUCT_TYPES constant as a TextChoices class with all supported product types.

### Dependencies
- Task 08: Create constants.py File

### Instructions

1. **Create PRODUCT_TYPES class**
   - Define a class named `PRODUCT_TYPES`
   - Inherit from `TextChoices`
   - Add class docstring explaining product types

2. **Define SIMPLE product type**
   - Value: 'simple'
   - Label: 'Simple Product'
   - Description: Single product without variations

3. **Define VARIABLE product type**
   - Value: 'variable'
   - Label: 'Variable Product'
   - Description: Product with variants (size, color, etc.)

4. **Define BUNDLE product type**
   - Value: 'bundle'
   - Label: 'Bundle'
   - Description: Collection of products sold together

5. **Define COMPOSITE product type**
   - Value: 'composite'
   - Label: 'Composite Product'
   - Description: Product assembled from components (BOM)

### Product Type Descriptions

```
┌─────────────────────────────────────────────────────┐
│             PRODUCT TYPE BEHAVIORS                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SIMPLE                                             │
│  ├── Single SKU                                     │
│  ├── Direct pricing                                 │
│  ├── Direct inventory                               │
│  └── Example: Book, Pen, Water Bottle              │
│                                                     │
│  VARIABLE                                           │
│  ├── Parent with variants                           │
│  ├── Variants have own SKU, price, stock           │
│  ├── Attributes define variations                  │
│  └── Example: T-Shirt (S, M, L, XL)                │
│                                                     │
│  BUNDLE                                             │
│  ├── Collection of products                         │
│  ├── Sold as single unit                           │
│  ├── Bundle price (may differ from sum)            │
│  └── Example: Gift Set, Meal Combo                 │
│                                                     │
│  COMPOSITE                                          │
│  ├── Built from components (BOM)                   │
│  ├── Manufacturing/assembly required               │
│  ├── Component inventory tracked                   │
│  └── Example: Custom PC, Made-to-order Cake        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
```python
class PRODUCT_TYPES(TextChoices):
    """
    Product type choices defining product behavior.
    
    - SIMPLE: Standard single product
    - VARIABLE: Product with variants (size, color, etc.)
    - BUNDLE: Collection of products
    - COMPOSITE: Product with bill of materials (BOM)
    """
    SIMPLE = 'simple', _('Simple Product')
    VARIABLE = 'variable', _('Variable Product')
    BUNDLE = 'bundle', _('Bundle')
    COMPOSITE = 'composite', _('Composite Product')
```

### Verification Checklist
- [ ] PRODUCT_TYPES class is defined
- [ ] All four types are included
- [ ] Values are lowercase strings
- [ ] Labels use gettext_lazy for translation
- [ ] Class has descriptive docstring

---

## Task 10: Define PRODUCT_STATUS

### Overview
Define the PRODUCT_STATUS constant as a TextChoices class with all product lifecycle states.

### Dependencies
- Task 09: Define PRODUCT_TYPES

### Instructions

1. **Create PRODUCT_STATUS class**
   - Define a class named `PRODUCT_STATUS`
   - Inherit from `TextChoices`
   - Add class docstring explaining status workflow

2. **Add status class docstring**
   - Explain the purpose of product status
   - Describe the typical status workflow
   - Note visibility and availability implications

3. **Prepare for status constants**
   - Structure will be defined in subsequent tasks
   - Each status will have value, label, and meaning
   - Status controls product visibility and availability

### Product Status Workflow

```
┌─────────────────────────────────────────────────────┐
│             PRODUCT STATUS WORKFLOW                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│    ┌─────────┐                                      │
│    │  DRAFT  │  ← New product, not visible          │
│    └────┬────┘                                      │
│         │ Publish                                   │
│         ▼                                           │
│    ┌─────────┐                                      │
│    │ ACTIVE  │  ← Visible and available for sale   │
│    └────┬────┘                                      │
│         │                                           │
│    ┌────┴────┐                                      │
│    │         │                                      │
│    ▼         ▼                                      │
│  ┌─────┐  ┌──────────┐                              │
│  │ARCH │  │DISCONTIN │  ← Hidden from catalog       │
│  │IVED │  │  -UED    │                              │
│  └──┬──┘  └────┬─────┘                              │
│     │          │                                    │
│     └────┬─────┘                                    │
│          │ Restore                                  │
│          ▼                                          │
│     ┌─────────┐                                     │
│     │ ACTIVE  │                                     │
│     └─────────┘                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
```python
class PRODUCT_STATUS(TextChoices):
    """
    Product status choices defining product lifecycle.
    
    Status workflow:
    - DRAFT: New product, not published (not visible)
    - ACTIVE: Published and available for sale
    - ARCHIVED: Hidden but can be restored
    - DISCONTINUED: Permanently unavailable
    
    Status determines:
    - Visibility in webstore and POS
    - Availability for purchase
    - Search and filter inclusion
    """
    # Status constants will be defined in next tasks
```

### Verification Checklist
- [ ] PRODUCT_STATUS class is defined
- [ ] Class inherits from TextChoices
- [ ] Docstring explains status workflow
- [ ] Docstring notes visibility implications

---

## Task 11: Define DRAFT Status

### Overview
Define the DRAFT status constant within the PRODUCT_STATUS class.

### Dependencies
- Task 10: Define PRODUCT_STATUS

### Instructions

1. **Add DRAFT status constant**
   - Value: 'draft'
   - Label: 'Draft'
   - This is the initial state for new products

2. **Understand DRAFT behavior**
   - Not visible in webstore or POS
   - Not searchable by customers
   - Only visible to admin users
   - Can be edited freely

3. **Document DRAFT use cases**
   - New products being configured
   - Products with incomplete information
   - Products awaiting approval
   - Testing and preview purposes

### DRAFT Status Characteristics

| Aspect | Behavior |
|--------|----------|
| **Webstore Visibility** | Hidden |
| **POS Visibility** | Hidden |
| **Admin Visibility** | Visible |
| **Customer Search** | Not included |
| **Can Purchase** | No |
| **Can Edit** | Yes (full access) |

### Expected Outcome
```python
class PRODUCT_STATUS(TextChoices):
    """[docstring from previous task]"""
    
    DRAFT = 'draft', _('Draft')
```

### Verification Checklist
- [ ] DRAFT constant is defined
- [ ] Value is 'draft' (lowercase)
- [ ] Label uses translation support
- [ ] Placement is first in the class

---

## Task 12: Define ACTIVE Status

### Overview
Define the ACTIVE status constant within the PRODUCT_STATUS class.

### Dependencies
- Task 11: Define DRAFT Status

### Instructions

1. **Add ACTIVE status constant**
   - Value: 'active'
   - Label: 'Active'
   - This is the published and available state

2. **Understand ACTIVE behavior**
   - Fully visible in webstore (if is_webstore_visible=True)
   - Available in POS (if is_pos_visible=True)
   - Searchable by customers
   - Available for purchase
   - Can still be edited by admin

3. **Document ACTIVE characteristics**
   - Primary status for sellable products
   - Respects visibility flags (webstore/POS)
   - Included in catalog listings
   - Participates in inventory management

### ACTIVE Status Characteristics

| Aspect | Behavior |
|--------|----------|
| **Webstore Visibility** | Yes (if flag enabled) |
| **POS Visibility** | Yes (if flag enabled) |
| **Admin Visibility** | Visible |
| **Customer Search** | Included |
| **Can Purchase** | Yes (if in stock) |
| **Can Edit** | Yes (may affect live catalog) |

### Expected Outcome
```python
class PRODUCT_STATUS(TextChoices):
    """[docstring]"""
    
    DRAFT = 'draft', _('Draft')
    ACTIVE = 'active', _('Active')
```

### Verification Checklist
- [ ] ACTIVE constant is defined
- [ ] Value is 'active' (lowercase)
- [ ] Label uses translation support
- [ ] Placement is after DRAFT

---

## Task 13: Define ARCHIVED Status

### Overview
Define the ARCHIVED status constant within the PRODUCT_STATUS class.

### Dependencies
- Task 12: Define ACTIVE Status

### Instructions

1. **Add ARCHIVED status constant**
   - Value: 'archived'
   - Label: 'Archived'
   - This is for temporarily hidden products

2. **Understand ARCHIVED behavior**
   - Not visible in webstore or POS
   - Not searchable by customers
   - Admin can still view and edit
   - Can be restored to ACTIVE
   - Historical data preserved

3. **Document ARCHIVED use cases**
   - Seasonal products (out of season)
   - Temporarily unavailable items
   - Products being updated
   - Market testing completed
   - Potential future reactivation

4. **Differentiate from DISCONTINUED**
   - ARCHIVED is temporary, DISCONTINUED is permanent
   - ARCHIVED can be easily restored
   - ARCHIVED suggests future availability

### ARCHIVED Status Characteristics

| Aspect | Behavior |
|--------|----------|
| **Webstore Visibility** | Hidden |
| **POS Visibility** | Hidden |
| **Admin Visibility** | Visible |
| **Customer Search** | Not included |
| **Can Purchase** | No |
| **Can Restore** | Yes (easy) |
| **Historical Data** | Preserved |

### Expected Outcome
```python
class PRODUCT_STATUS(TextChoices):
    """[docstring]"""
    
    DRAFT = 'draft', _('Draft')
    ACTIVE = 'active', _('Active')
    ARCHIVED = 'archived', _('Archived')
```

### Verification Checklist
- [ ] ARCHIVED constant is defined
- [ ] Value is 'archived' (lowercase)
- [ ] Label uses translation support
- [ ] Placement is after ACTIVE

---

## Task 14: Define DISCONTINUED Status

### Overview
Define the DISCONTINUED status constant within the PRODUCT_STATUS class.

### Dependencies
- Task 13: Define ARCHIVED Status

### Instructions

1. **Add DISCONTINUED status constant**
   - Value: 'discontinued'
   - Label: 'Discontinued'
   - This is for permanently unavailable products

2. **Understand DISCONTINUED behavior**
   - Not visible in webstore or POS
   - Not searchable by customers
   - Admin can view for reference
   - Generally not restored to ACTIVE
   - Used for reporting and history

3. **Document DISCONTINUED use cases**
   - Product no longer manufactured
   - Product replaced by new version
   - Supplier no longer available
   - Regulatory/compliance issues
   - End of life for product line

4. **Differentiate from ARCHIVED**
   - DISCONTINUED is permanent, ARCHIVED is temporary
   - DISCONTINUED implies no future availability
   - DISCONTINUED may have replacement product
   - Usually kept for historical records only

### DISCONTINUED Status Characteristics

| Aspect | Behavior |
|--------|----------|
| **Webstore Visibility** | Hidden |
| **POS Visibility** | Hidden |
| **Admin Visibility** | Visible (read-only context) |
| **Customer Search** | Not included |
| **Can Purchase** | No |
| **Can Restore** | Possible but uncommon |
| **Historical Data** | Preserved for reports |
| **Replacement** | May link to new product |

### Status Comparison

```
┌─────────────────────────────────────────────────────┐
│          STATUS COMPARISON TABLE                    │
├──────────┬─────────┬────────┬──────────┬────────────┤
│          │ DRAFT   │ ACTIVE │ ARCHIVED │DISCONTIN-  │
│          │         │        │          │  UED       │
├──────────┼─────────┼────────┼──────────┼────────────┤
│Webstore  │   No    │  Yes*  │    No    │    No      │
│POS       │   No    │  Yes*  │    No    │    No      │
│Sellable  │   No    │  Yes   │    No    │    No      │
│Searchable│   No    │  Yes   │    No    │    No      │
│Restore   │   N/A   │  N/A   │   Easy   │  Uncommon  │
│Purpose   │ Setup   │ Sales  │ Temp Off │ Permanent  │
└──────────┴─────────┴────────┴──────────┴────────────┘
* If visibility flags are enabled
```

### Expected Outcome
```python
class PRODUCT_STATUS(TextChoices):
    """
    Product status choices defining product lifecycle.
    
    Status workflow:
    - DRAFT: New product, not published (not visible)
    - ACTIVE: Published and available for sale
    - ARCHIVED: Hidden but can be restored
    - DISCONTINUED: Permanently unavailable
    
    Status determines:
    - Visibility in webstore and POS
    - Availability for purchase
    - Search and filter inclusion
    """
    DRAFT = 'draft', _('Draft')
    ACTIVE = 'active', _('Active')
    ARCHIVED = 'archived', _('Archived')
    DISCONTINUED = 'discontinued', _('Discontinued')
```

### Verification Checklist
- [ ] DISCONTINUED constant is defined
- [ ] Value is 'discontinued' (lowercase)
- [ ] Label uses translation support
- [ ] All four status values are complete
- [ ] Class docstring is comprehensive

---

## Summary of Deliverables

After completing these tasks, the constants.py file should contain:

```
backend/apps/products/
├── __init__.py
├── apps.py
├── constants.py              # ← Created with all constants
└── models/
    └── __init__.py
```

### Complete Constants Structure

```python
"""Constants for the products app."""

from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class PRODUCT_TYPES(TextChoices):
    """Product type choices."""
    SIMPLE = 'simple', _('Simple Product')
    VARIABLE = 'variable', _('Variable Product')
    BUNDLE = 'bundle', _('Bundle')
    COMPOSITE = 'composite', _('Composite Product')


class PRODUCT_STATUS(TextChoices):
    """Product status choices."""
    DRAFT = 'draft', _('Draft')
    ACTIVE = 'active', _('Active')
    ARCHIVED = 'archived', _('Archived')
    DISCONTINUED = 'discontinued', _('Discontinued')
```

### Key Achievements
✓ Product types defined (simple, variable, bundle, composite)  
✓ Product statuses defined (draft, active, archived, discontinued)  
✓ Translation support enabled for all labels  
✓ Constants ready for use in models and forms  
✓ Clear workflow and behavior documentation

---

## Usage in Models

These constants will be used in the Product model as choice fields:

```python
# In models/product.py (future task)
from apps.products.constants import PRODUCT_TYPES, PRODUCT_STATUS

class Product(BaseModel):
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPES.choices,
        default=PRODUCT_TYPES.SIMPLE
    )
    
    status = models.CharField(
        max_length=20,
        choices=PRODUCT_STATUS.choices,
        default=PRODUCT_STATUS.DRAFT
    )
```

---

## Notes for Implementation

1. **TextChoices Benefits**
   - Type-safe access: `PRODUCT_TYPES.SIMPLE`
   - Database values are consistent
   - Labels support translation
   - Easy to iterate over choices

2. **Translation Support**
   - All labels use gettext_lazy (_)
   - Supports Sinhala and Tamil translations
   - Labels can be changed without affecting data
   - Translation files will be generated later

3. **Status Workflow**
   - Default status is DRAFT for new products
   - Products must be explicitly published (ACTIVE)
   - Status transitions should be logged
   - Status affects all product queries

4. **Product Type Implications**
   - Type is set at creation and rarely changed
   - Type determines model behavior and features
   - Variable products will have variants (SubPhase-04)
   - Bundle/Composite will have components (Phase-05)

---
