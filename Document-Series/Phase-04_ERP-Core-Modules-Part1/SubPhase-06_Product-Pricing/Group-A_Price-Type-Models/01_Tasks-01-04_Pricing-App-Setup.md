# Tasks 01-04: Pricing App Setup & Core Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** A - Price Type Models  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-05-09_Price-Fields-Manager.md](02_Tasks-05-09_Price-Fields-Manager.md)

---

## Document Overview

This document establishes the foundational pricing infrastructure within the products module. It covers the creation of the pricing app structure, LKR currency constants, a custom PriceField for validated decimal prices, and the core ProductPrice model that handles base prices for all products in the multi-tenant ERP system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create pricing app structure | Low | 15 min |
| 02 | Define currency constants | Low | 10 min |
| 03 | Create PriceField custom field | Medium | 25 min |
| 04 | Create ProductPrice model | Medium | 30 min |

---

## Task 01: Create Pricing App Structure

### Overview
Create the pricing Django app within the products module to house all pricing-related models, services, and utilities. This app will manage product prices, variant prices, tiered pricing, scheduled pricing, and tax calculations specifically for the LankaCommerce Cloud multi-tenant ERP system.

### Dependencies
- Phase-04, SubPhase-01: Product model already exists
- Multi-tenancy infrastructure (django-tenants) configured
- PostgreSQL database operational

### Instructions

1. **Create pricing app directory**
   - Navigate to `backend/apps/products/`
   - Create new directory named `pricing/`
   - This will be a sub-app within the products module

2. **Create `__init__.py` file**
   - Create empty `__init__.py` in `pricing/` directory
   - Mark directory as Python package

3. **Create `apps.py` configuration file**
   - Define `PricingConfig` class inheriting from `AppConfig`
   - Set `name` to `'apps.products.pricing'`
   - Set `default_auto_field` to `'django.db.models.BigAutoField'`
   - Add `verbose_name` as `'Product Pricing'`

4. **Create subdirectories for organization**
   - Create `models/` directory with `__init__.py`
   - Create `managers/` directory with `__init__.py`
   - Create `services/` directory with `__init__.py` (for future use)
   - Create `tasks/` directory with `__init__.py` (for Celery tasks)
   - Create `tests/` directory with `__init__.py`

5. **Register app in Django settings**
   - Add `'apps.products.pricing'` to `TENANT_APPS` in settings
   - Ensure it comes after `'apps.products'` in the list
   - Pricing tables will exist in each tenant schema

6. **Create placeholder files**
   - Create `admin.py` for Django admin configuration
   - Create `constants.py` for pricing constants
   - Create `fields.py` for custom model fields
   - Create `utils.py` for utility functions

### Directory Structure

```
backend/apps/products/
├── __init__.py
├── models.py (existing product models)
├── pricing/                          (NEW)
│   ├── __init__.py                   (NEW)
│   ├── apps.py                       (NEW)
│   ├── admin.py                      (NEW)
│   ├── constants.py                  (NEW)
│   ├── fields.py                     (NEW)
│   ├── utils.py                      (NEW)
│   ├── models/                       (NEW)
│   │   └── __init__.py               (NEW)
│   ├── managers/                     (NEW)
│   │   └── __init__.py               (NEW)
│   ├── services/                     (NEW)
│   │   └── __init__.py               (NEW)
│   ├── tasks/                        (NEW)
│   │   └── __init__.py               (NEW)
│   └── tests/                        (NEW)
│       └── __init__.py               (NEW)
```

### Multi-Tenancy Considerations

- Pricing models belong in `TENANT_APPS` (tenant schema tables)
- Each tenant has independent pricing data
- Price calculations must respect tenant isolation
- Currency and tax rates may vary per tenant
- Shared reference data (like tax classes) may be in public schema

### Expected Outcome

A properly structured pricing app within the products module, registered in Django settings, ready to house pricing models and logic for the multi-tenant ERP system.

### Verification Checklist

- [ ] `backend/apps/products/pricing/` directory exists
- [ ] `apps.py` file created with `PricingConfig` class
- [ ] All required subdirectories (`models/`, `managers/`, `services/`, `tasks/`, `tests/`) exist
- [ ] Placeholder files (`admin.py`, `constants.py`, `fields.py`, `utils.py`) created
- [ ] App registered in `TENANT_APPS` in Django settings
- [ ] All directories contain `__init__.py` files

---

## Task 02: Define Currency Constants

### Overview
Define LKR (Sri Lankan Rupee) currency constants, formatting rules, and validation limits for use throughout the pricing system. This ensures consistent currency handling across all price-related operations in the LankaCommerce Cloud platform.

### Dependencies
- Task 01: Create pricing app structure

### Instructions

1. **Open `constants.py` file**
   - File located at `backend/apps/products/pricing/constants.py`

2. **Define currency code constant**
   - Create constant `CURRENCY_CODE = 'LKR'`
   - This represents Sri Lankan Rupees

3. **Define currency symbol constant**
   - Create constant `CURRENCY_SYMBOL = '₨'`
   - Rupee symbol for display purposes

4. **Define currency display name**
   - Create constant `CURRENCY_NAME = 'Sri Lankan Rupees'`
   - Full name for documentation and reports

5. **Define decimal precision**
   - Create constant `CURRENCY_DECIMAL_PLACES = 2`
   - LKR uses 2 decimal places (cents)

6. **Define maximum digits**
   - Create constant `CURRENCY_MAX_DIGITS = 12`
   - Allows prices up to 999,999,999.99 LKR
   - Total digits including decimal places

7. **Define minimum price**
   - Create constant `MIN_PRICE = Decimal('0.00')`
   - No negative prices allowed
   - Use `Decimal` type for precision

8. **Define maximum price**
   - Create constant `MAX_PRICE = Decimal('999999999.99')`
   - Maximum storable price value

9. **Define default price**
   - Create constant `DEFAULT_PRICE = Decimal('0.00')`
   - Default when price not specified

10. **Define price format template**
    - Create constant `PRICE_FORMAT = '{symbol} {amount:,.2f}'`
    - Template for formatted price display
    - Includes comma thousand separator

11. **Add import statements**
    - Import `Decimal` from `decimal` module at top of file
    - Required for precise decimal calculations

### Currency Constants Reference

| Constant | Value | Purpose |
|----------|-------|---------|
| `CURRENCY_CODE` | `'LKR'` | ISO 4217 currency code |
| `CURRENCY_SYMBOL` | `'₨'` | Rupee symbol for display |
| `CURRENCY_NAME` | `'Sri Lankan Rupees'` | Full currency name |
| `CURRENCY_DECIMAL_PLACES` | `2` | Decimal precision |
| `CURRENCY_MAX_DIGITS` | `12` | Total digits (including decimals) |
| `MIN_PRICE` | `Decimal('0.00')` | Minimum allowed price |
| `MAX_PRICE` | `Decimal('999999999.99')` | Maximum allowed price |
| `DEFAULT_PRICE` | `Decimal('0.00')` | Default price value |
| `PRICE_FORMAT` | `'{symbol} {amount:,.2f}'` | Display format template |

### Price Display Examples

| Price Value | Formatted Output |
|-------------|------------------|
| 100.00 | ₨ 100.00 |
| 1250.50 | ₨ 1,250.50 |
| 25000.00 | ₨ 25,000.00 |
| 1500000.75 | ₨ 1,500,000.75 |

### Sri Lanka Context

- **LKR (₨)** is the official currency of Sri Lanka
- Prices in Sri Lankan retail typically shown with comma separators
- 2 decimal places are standard for pricing
- Large retail purchases can reach millions of LKR
- Currency symbol placement: before the amount with space

### Expected Outcome

A complete `constants.py` file with all currency-related constants defined, ready for import and use throughout the pricing module.

### Verification Checklist

- [ ] `constants.py` file contains all currency constants
- [ ] `Decimal` imported from `decimal` module
- [ ] `CURRENCY_CODE` set to `'LKR'`
- [ ] `CURRENCY_SYMBOL` set to `'₨'`
- [ ] `CURRENCY_MAX_DIGITS` set to `12`
- [ ] `CURRENCY_DECIMAL_PLACES` set to `2`
- [ ] `MIN_PRICE` and `MAX_PRICE` defined as `Decimal` types
- [ ] `PRICE_FORMAT` includes comma separator

---

## Task 03: Create PriceField Custom Field

### Overview
Create a custom Django model field `PriceField` that extends `DecimalField` with built-in LKR currency validation, consistent decimal precision, and automatic constraints. This field will be used for all price-related database columns throughout the pricing system.

### Dependencies
- Task 02: Define currency constants

### Instructions

1. **Open `fields.py` file**
   - File located at `backend/apps/products/pricing/fields.py`

2. **Import required modules**
   - Import `DecimalField` from `django.db.models`
   - Import all constants from `.constants` module
   - Import `ValidationError` from `django.core.exceptions`

3. **Define `PriceField` class**
   - Create class `PriceField` inheriting from `DecimalField`
   - This field enforces LKR currency rules automatically

4. **Override `__init__` method**
   - Accept `max_digits`, `decimal_places`, and other keyword arguments
   - Set default `max_digits` to `CURRENCY_MAX_DIGITS` if not provided
   - Set default `decimal_places` to `CURRENCY_DECIMAL_PLACES` if not provided
   - Call parent `__init__` with updated parameters

5. **Add field description**
   - Set `description` class attribute
   - Value: `"A price field for LKR currency with validation"`
   - Used for documentation and introspection

6. **Override `deconstruct` method**
   - Return name, path, args, kwargs for migrations
   - Remove `max_digits` and `decimal_places` from kwargs if they match defaults
   - Ensures clean migration files

7. **Add `validate` method**
   - Accept `value` parameter
   - Call parent `validate` method first
   - Check if value is less than `MIN_PRICE`
   - Check if value is greater than `MAX_PRICE`
   - Raise `ValidationError` with appropriate message if validation fails

8. **Add `get_prep_value` method**
   - Accept `value` parameter
   - Convert value to `Decimal` if it's a string or number
   - Handle `None` values gracefully
   - Return prepared value for database storage

9. **Add docstring to class**
   - Explain purpose: custom field for LKR prices
   - Document default parameters
   - Provide usage example

### PriceField Characteristics

| Characteristic | Value | Reason |
|---------------|-------|--------|
| Base Class | `DecimalField` | Precise decimal arithmetic |
| Default `max_digits` | `12` | Supports up to 999M LKR |
| Default `decimal_places` | `2` | Standard LKR precision |
| Minimum Value | `0.00` | No negative prices |
| Maximum Value | `999,999,999.99` | Reasonable upper limit |

### Usage Example Pattern

```
# In a model definition:
base_price = PriceField()
# Automatically uses max_digits=12, decimal_places=2

# With custom constraints (if needed):
special_price = PriceField(max_digits=10, decimal_places=2)
```

### Validation Behavior

| Input | Validation Result |
|-------|------------------|
| `Decimal('100.50')` | Valid |
| `Decimal('0.00')` | Valid (minimum) |
| `Decimal('999999999.99')` | Valid (maximum) |
| `Decimal('-10.00')` | Invalid (negative) |
| `Decimal('1000000000.00')` | Invalid (exceeds max) |

### Benefits of Custom Field

- **Consistency:** All price fields have same precision and constraints
- **Validation:** Built-in range validation at model level
- **Maintainability:** Change currency rules in one place
- **Documentation:** Self-documenting field purpose
- **Type Safety:** Ensures Decimal type usage

### Expected Outcome

A reusable `PriceField` class in `fields.py` that enforces LKR currency rules automatically, ready to be used in all pricing models.

### Verification Checklist

- [ ] `PriceField` class defined in `fields.py`
- [ ] Inherits from `DecimalField`
- [ ] Default `max_digits` set to `12`
- [ ] Default `decimal_places` set to `2`
- [ ] `validate` method checks MIN_PRICE and MAX_PRICE
- [ ] `deconstruct` method implemented for migrations
- [ ] `get_prep_value` method handles type conversion
- [ ] Class docstring explains purpose and usage

---

## Task 04: Create ProductPrice Model

### Overview
Create the core `ProductPrice` model that stores base pricing information for products. This model includes base price, cost price, and establishes the foundation for all pricing operations in the multi-tenant ERP system.

### Dependencies
- Task 01: Create pricing app structure
- Task 02: Define currency constants
- Task 03: Create PriceField custom field
- Product model exists (from SubPhase-01)

### Instructions

1. **Create `product_price.py` file**
   - Create file in `backend/apps/products/pricing/models/`
   - This file will contain the `ProductPrice` model

2. **Import required modules**
   - Import Django model classes and fields
   - Import `PriceField` from `..fields`
   - Import `BaseModel` from core models (tenant-aware base)
   - Import `Product` model from products app

3. **Define `ProductPrice` class**
   - Inherit from `BaseModel` (includes tenant isolation)
   - Add comprehensive docstring explaining purpose

4. **Add product relationship field**
   - Create `OneToOneField` to `Product` model
   - Set `on_delete=models.CASCADE`
   - Set `related_name='price'`
   - Set `verbose_name='Product'`
   - Add `help_text` explaining one-to-one relationship

5. **Add base_price field**
   - Use `PriceField()` custom field
   - Set `verbose_name='Base Price'`
   - Set `help_text` explaining base price purpose
   - This is the default selling price
   - Set `default=CURRENCY_DEFAULT_PRICE`

6. **Add cost_price field**
   - Use `PriceField()` custom field
   - Set `verbose_name='Cost Price'`
   - Set `help_text` explaining supplier/manufacturing cost
   - Set `null=True`, `blank=True` (optional)
   - Used for profit margin calculations

7. **Add is_tax_inclusive field**
   - Use `BooleanField`
   - Set `default=True`
   - Set `verbose_name='Tax Inclusive'`
   - Set `help_text` explaining whether stored price includes tax
   - Important for Sri Lankan VAT calculations

8. **Add pricing notes field**
   - Use `TextField`
   - Set `blank=True`, `null=True`
   - Set `verbose_name='Pricing Notes'`
   - Set `help_text` for internal notes about pricing decisions

9. **Add last_cost_update timestamp**
   - Use `DateTimeField`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Last Cost Update'`
   - Track when cost price was last changed

10. **Add profit_margin property method**
    - Create `@property` decorated method
    - Calculate: `((base_price - cost_price) / base_price) * 100`
    - Return percentage as Decimal
    - Handle None cost_price gracefully
    - Return None if cost_price is not set

11. **Add profit_amount property method**
    - Create `@property` decorated method
    - Calculate: `base_price - cost_price`
    - Return difference as Decimal
    - Handle None cost_price gracefully

12. **Add `__str__` method**
    - Return formatted string with product name and base price
    - Format: "Product Name - ₨ 1,250.00"
    - Use currency formatting utility

13. **Add Meta class**
    - Set `db_table = 'pricing_product_price'`
    - Set `verbose_name = 'Product Price'`
    - Set `verbose_name_plural = 'Product Prices'`
    - Set `ordering = ['product__name']`
    - Add index on `product` field

### ProductPrice Model Fields

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `product` | OneToOneField | Link to Product | Yes |
| `base_price` | PriceField | Default selling price | Yes |
| `cost_price` | PriceField | Cost/wholesale cost | No |
| `is_tax_inclusive` | BooleanField | Tax included in price | Yes |
| `pricing_notes` | TextField | Internal notes | No |
| `last_cost_update` | DateTimeField | Cost change timestamp | No |

### Calculated Properties

| Property | Calculation | Return Type | Purpose |
|----------|-------------|-------------|---------|
| `profit_margin` | `((base - cost) / base) * 100` | Decimal | Profit percentage |
| `profit_amount` | `base - cost` | Decimal | Profit in LKR |

### Business Logic Examples

**Example 1: Electronics Store**
- Product: Samsung TV
- Base Price: ₨ 85,000.00
- Cost Price: ₨ 65,000.00
- Profit Margin: 23.53%
- Profit Amount: ₨ 20,000.00

**Example 2: Grocery Store**
- Product: Basmati Rice 5kg
- Base Price: ₨ 1,250.00
- Cost Price: ₨ 1,000.00
- Profit Margin: 20.00%
- Profit Amount: ₨ 250.00

### Multi-Tenancy Considerations

- Each tenant has separate `ProductPrice` records
- Tenant isolation enforced through `BaseModel`
- One tenant cannot access another tenant's pricing
- Pricing strategies can differ per tenant
- Currency and tax rules consistent across tenant's products

### Relationship to Other Models

```
Product (1) ←→ (1) ProductPrice
Product (1) → (many) VariantPrice (future)
ProductPrice → PriceHistory (many) (future)
```

### Expected Outcome

A complete `ProductPrice` model with base pricing fields, cost tracking, profit calculations, and proper multi-tenant isolation.

### Verification Checklist

- [ ] `product_price.py` file created in `models/` directory
- [ ] `ProductPrice` class inherits from `BaseModel`
- [ ] `product` OneToOneField with CASCADE delete
- [ ] `base_price` and `cost_price` use `PriceField`
- [ ] `is_tax_inclusive` BooleanField added
- [ ] `profit_margin` property calculates percentage
- [ ] `profit_amount` property calculates difference
- [ ] `__str__` method returns formatted string
- [ ] Meta class with `db_table`, `verbose_name`, `ordering`
- [ ] Model imported in `models/__init__.py`

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create pricing app structure | Pricing app with organized subdirectories |
| 02 | Define currency constants | `constants.py` with LKR constants |
| 03 | Create PriceField custom field | Reusable `PriceField` with validation |
| 04 | Create ProductPrice model | Core pricing model with base/cost prices |

### Files Created

```
backend/apps/products/pricing/
├── __init__.py
├── apps.py
├── constants.py (LKR constants)
├── fields.py (PriceField)
├── admin.py (placeholder)
├── utils.py (placeholder)
├── models/
│   ├── __init__.py
│   └── product_price.py (ProductPrice model)
├── managers/
│   └── __init__.py
├── services/
│   └── __init__.py
├── tasks/
│   └── __init__.py
└── tests/
    └── __init__.py
```

### Key Achievements

- ✅ Pricing app structure established within products module
- ✅ LKR currency constants defined with proper formatting rules
- ✅ Custom PriceField created for consistent price handling
- ✅ ProductPrice model with base price, cost price, and profit calculations
- ✅ Multi-tenant isolation through BaseModel inheritance
- ✅ Foundation ready for sale prices, wholesale prices, and tax handling

### Next Steps

Proceed to [02_Tasks-05-09_Price-Fields-Manager.md](02_Tasks-05-09_Price-Fields-Manager.md) to add:
- Sale price fields with date ranges
- Wholesale price field
- Tax handling fields
- ProductPrice Meta class configuration
- Custom model manager for pricing queries

---

## Notes for AI Agents

1. **LKR Format:** All prices in "₨ 1,250.00" format with comma thousand separator
2. **Multi-Tenancy:** ProductPrice in tenant schema, isolated per tenant
3. **BaseModel:** Provides created_at, updated_at, is_active fields automatically
4. **PriceField:** Always use for price fields, never raw DecimalField
5. **Decimal Type:** Use `Decimal` from decimal module, never float for prices
6. **Cost Price Optional:** Not all products have cost price (e.g., services)
7. **Tax Inclusive:** Sri Lankan retail prices typically include VAT
8. **Profit Margin:** Standard retail markup 15-30%, wholesale 5-15%
9. **Next Document:** Will add sale prices, wholesale, tax fields, manager
10. **Database:** Run migrations after completing all Group A models
