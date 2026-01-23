# Tasks 27-34: Override Fields and Properties

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** B - ProductVariant Model  
> **Document:** 02 of 03  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-26_ProductVariant-Basic-Fields.md](01_Tasks-19-26_ProductVariant-Basic-Fields.md)
- **→ Next Document:** [03_Tasks-35-38_ProductOptionConfig-Export.md](03_Tasks-35-38_ProductOptionConfig-Export.md)

---

## Document Overview

This document covers adding override fields that allow variants to override parent product properties, plus methods and properties for variant functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 27 | Add weight_override Field | Low |
| 28 | Add dimension_overrides | Medium |
| 29 | Add sort_order Field | Low |
| 30 | Define ProductVariantOption | High |
| 31 | Add __str__ Method | Low |
| 32 | Add Meta Class | Medium |
| 33 | Add get_option_display Method | Medium |
| 34 | Add get_full_name Property | Low |

---

## Business Context

### Why Override Fields?

Variants often have different physical properties than the parent product:

**Example: T-Shirt Product**
- Base product weight: 200g (average)
- Small variant: 180g (actual weight)
- Large variant: 220g (actual weight)
- XL variant: 250g (actual weight)

**Example: Gift Box Product**
- Base dimensions: 30×20×10 cm
- Small box variant: 20×15×8 cm
- Large box variant: 40×30×15 cm

Override fields allow accurate shipping calculations and inventory management.

---

## Task 27: Add weight_override Field

### Overview
Add an optional field to override the product's base weight for shipping calculations.

### Dependencies
- Task 20: ProductVariant class defined
- Product model has weight field

### Instructions

1. **Add weight_override field as DecimalField**
   - Field name: `weight_override`
   - max_digits: 10, decimal_places: 3
   - Can be blank and null (optional)
   - Unit: kilograms

2. **Add field help text**
   - "Override product weight for this variant (kg). Leave empty to use product weight"

3. **Add verbose name**
   - verbose_name: "Weight Override"

4. **Add get_weight method**
   - Returns weight_override if set, else product.weight
   - Handles null cases

### Weight Override Use Cases

| Product | Base Weight | Variant | Override Weight | Reason |
|---------|-------------|---------|-----------------|--------|
| T-Shirt | 200g | Small | 180g | Less fabric |
| T-Shirt | 200g | XL | 250g | More fabric |
| Laptop | 2.0kg | Base model | 1.8kg | Lighter battery |
| Laptop | 2.0kg | Pro model | 2.2kg | Larger battery |
| Rice | N/A | 1kg pack | 1.0kg | Package weight |
| Rice | N/A | 5kg pack | 5.0kg | Package weight |

### Shipping Calculation Impact

**Sri Lankan Context:**
```
Product: T-Shirt
Variants:
  - Small (180g): Shipping = LKR 250 (under 200g rate)
  - Medium (200g): Shipping = LKR 250
  - XL (250g): Shipping = LKR 300 (over 200g rate)

Accurate weight = Accurate shipping cost
```

### Verification Checklist
- [ ] weight_override field added as DecimalField
- [ ] Field is optional (blank=True, null=True)
- [ ] max_digits and decimal_places set
- [ ] Help text explains override behavior
- [ ] get_weight method planned

---

## Task 28: Add dimension_overrides

### Overview
Add optional fields to override product dimensions (length, width, height) for variants.

### Dependencies
- Task 27: weight_override field exists
- Product model has dimension fields

### Instructions

1. **Add three dimension override fields**
   - length_override: DecimalField, max_digits: 10, decimal_places: 2
   - width_override: DecimalField, max_digits: 10, decimal_places: 2
   - height_override: DecimalField, max_digits: 10, decimal_places: 2
   - All can be blank and null (optional)
   - Unit: centimeters

2. **Add field help texts**
   - "Override product {dimension} for this variant (cm)"

3. **Add verbose names**
   - "Length Override", "Width Override", "Height Override"

4. **Add get_dimensions method**
   - Returns dict with length, width, height
   - Uses overrides if set, else product dimensions

### Dimension Override Examples

**Gift Box Product:**

| Variant | Length | Width | Height | Volume | Use Case |
|---------|--------|-------|--------|--------|----------|
| Small | 20 cm | 15 cm | 8 cm | 2,400 cm³ | Single item |
| Medium | 30 cm | 20 cm | 10 cm | 6,000 cm³ | Multiple items |
| Large | 40 cm | 30 cm | 15 cm | 18,000 cm³ | Bulk items |

**Furniture Product:**

| Variant | Length | Width | Height | Description |
|---------|--------|-------|--------|-------------|
| Twin Bed | 190 cm | 99 cm | 25 cm | Single person |
| Full Bed | 190 cm | 137 cm | 25 cm | Single/couple |
| Queen Bed | 203 cm | 152 cm | 25 cm | Standard couple |
| King Bed | 203 cm | 193 cm | 25 cm | Large couple |

### Shipping Volume Calculation

**Volumetric Weight Formula:**
```
Volumetric Weight (kg) = (Length × Width × Height) / 5000

Example - Medium Gift Box:
(30 × 20 × 10) / 5000 = 1.2 kg volumetric weight

Charged Weight = MAX(actual weight, volumetric weight)
```

### Verification Checklist
- [ ] length_override field added
- [ ] width_override field added
- [ ] height_override field added
- [ ] All fields optional
- [ ] Decimal precision appropriate
- [ ] Help texts clear
- [ ] get_dimensions method planned

---

## Task 29: Add sort_order Field

### Overview
Add a field to control the display order of variants.

### Dependencies
- Task 20: ProductVariant class defined

### Instructions

1. **Add sort_order field as PositiveIntegerField**
   - Field name: `sort_order`
   - Default value: 0

2. **Add field help text**
   - "Order in which this variant appears (lower numbers first)"

3. **Add verbose name**
   - verbose_name: "Sort Order"

4. **Configure default ordering**
   - Will be used in Meta class ordering

### Sort Order Use Cases

**Size-Based Ordering:**

| Variant | Options | sort_order | Display Position |
|---------|---------|------------|------------------|
| XS variant | XS | 0 | First |
| S variant | S | 10 | Second |
| M variant | M | 20 | Third (default) |
| L variant | L | 30 | Fourth |
| XL variant | XL | 40 | Fifth |

**Price-Based Ordering:**

| Variant | Price (LKR) | sort_order | Display Position |
|---------|-------------|------------|------------------|
| Basic | 50,000 | 0 | First (cheapest) |
| Standard | 75,000 | 10 | Second |
| Premium | 100,000 | 20 | Third (most expensive) |

**Popularity-Based Ordering:**

| Variant | Sales | sort_order | Display Position |
|---------|-------|------------|------------------|
| Best seller | 500 | 0 | First (most popular) |
| Popular | 200 | 10 | Second |
| Regular | 50 | 20 | Third |

### Verification Checklist
- [ ] sort_order field added
- [ ] Default value set to 0
- [ ] Help text added
- [ ] Will be used in Meta ordering

---

## Task 30: Define ProductVariantOption

### Overview
Complete the ProductVariantOption through model for the ManyToMany relationship.

### Dependencies
- Task 25: option_values ManyToMany field defined

### Instructions

1. **Define ProductVariantOption class**
   - Inherit from models.Model
   - Not tenant-aware (inherits from ProductVariant)

2. **Add variant field**
   - ForeignKey to ProductVariant
   - on_delete: CASCADE
   - related_name: 'variant_options'

3. **Add option_value field**
   - ForeignKey to VariantOptionValue
   - on_delete: PROTECT (don't delete if in use)
   - related_name: 'variant_options'

4. **Add display_order field**
   - PositiveIntegerField
   - Default: 0
   - Controls option display order

5. **Add Meta class**
   - unique_together: ['variant', 'option_value']
   - ordering: ['display_order']

6. **Add __str__ method**
   - Return: "{variant} - {option_value}"

### Through Model Purpose

ProductVariantOption allows:
- Linking variants to multiple option values
- Maintaining display order of options
- Preventing duplicate option assignments
- Additional metadata per option

### Model Structure

```
ProductVariantOption:
  - variant (FK to ProductVariant)
  - option_value (FK to VariantOptionValue)
  - display_order (Integer)
  - unique_together: (variant, option_value)
```

### Verification Checklist
- [ ] ProductVariantOption class defined
- [ ] variant ForeignKey added
- [ ] option_value ForeignKey added
- [ ] display_order field added
- [ ] Meta class with constraints
- [ ] __str__ method implemented

---

## Task 31: Add __str__ Method

### Overview
Add string representation method to ProductVariant model.

### Dependencies
- Tasks 19-30: All fields defined

### Instructions

1. **Add __str__ method to ProductVariant**
   - Return format: "{product.name} - {name}"
   - Example: "Classic T-Shirt - Medium / Red"

2. **Handle edge cases**
   - If name is empty, return just product name + SKU
   - If product is None, return just SKU

### String Representation Examples

| Product | Variant Name | SKU | __str__ Output |
|---------|--------------|-----|----------------|
| Classic T-Shirt | Medium / Red | TSHIRT-M-RED | "Classic T-Shirt - Medium / Red" |
| Dell XPS 15 | 16 GB / 512 GB SSD | XPS15-16-512 | "Dell XPS 15 - 16 GB / 512 GB SSD" |
| Basmati Rice | 1 kilogram | RICE-BAS-1KG | "Basmati Rice - 1 kilogram" |

### Verification Checklist
- [ ] __str__ method added to ProductVariant
- [ ] Returns readable format
- [ ] Handles empty name
- [ ] Handles null product

---

## Task 32: Add Meta Class

### Overview
Add Meta class to ProductVariant with ordering, constraints, and indexes.

### Dependencies
- Tasks 19-31: All fields and methods defined

### Instructions

1. **Add Meta class to ProductVariant**
   - verbose_name: "Product Variant"
   - verbose_name_plural: "Product Variants"

2. **Add ordering**
   - Default ordering: ['product', 'sort_order', 'name']

3. **Add unique_together constraint**
   - ['tenant', 'sku'] - SKU unique per tenant

4. **Add indexes**
   - tenant + product (filter variants by product)
   - tenant + sku (SKU lookups)
   - tenant + is_active (active variant queries)
   - product + is_active + sort_order (sorted active variants)

### Meta Configuration

```python
class Meta:
    verbose_name = "Product Variant"
    verbose_name_plural = "Product Variants"
    ordering = ['product', 'sort_order', 'name']
    unique_together = [['tenant', 'sku']]
    indexes = [
        # Optimize common queries
    ]
```

### Verification Checklist
- [ ] Meta class added
- [ ] verbose names set
- [ ] Ordering configured
- [ ] unique_together constraint added
- [ ] Indexes defined

---

## Task 33: Add get_option_display Method

### Overview
Add method to get formatted display of variant options.

### Dependencies
- Task 25: option_values field exists
- Task 30: ProductVariantOption through model complete

### Instructions

1. **Add get_option_display method**
   - Returns dictionary of option types and values
   - Format: {'Size': 'Medium', 'Color': 'Red'}

2. **Include option ordering**
   - Order by option_type.display_order
   - Then by option display_order

3. **Handle edge cases**
   - Empty option_values
   - Missing option_type

### Method Output Examples

**T-Shirt Variant:**
```python
{
    'Size': 'Medium',
    'Color': 'Red'
}
```

**Laptop Variant:**
```python
{
    'RAM': '16 GB',
    'Storage': '512 GB SSD',
    'Color': 'Silver'
}
```

**Rice Variant:**
```python
{
    'Type': 'Basmati',
    'Weight': '1 kilogram'
}
```

### Verification Checklist
- [ ] get_option_display method added
- [ ] Returns dictionary format
- [ ] Options properly ordered
- [ ] Handles edge cases

---

## Task 34: Add get_full_name Property

### Overview
Add property method that returns full variant display name including product.

### Dependencies
- Task 24: name field exists
- Task 31: __str__ method exists

### Instructions

1. **Add get_full_name property**
   - Returns: "{product.name} - {name}"
   - Uses @property decorator
   - Same as __str__ output

2. **Add docstring**
   - Explain purpose: "Full display name with product"

### Property Usage

**Template Usage:**
```django
{{ variant.get_full_name }}
Output: "Classic T-Shirt - Medium / Red"
```

**API Serializer:**
```python
{
    "sku": "TSHIRT-M-RED",
    "full_name": "Classic T-Shirt - Medium / Red",
    "options": {"Size": "Medium", "Color": "Red"}
}
```

### Verification Checklist
- [ ] get_full_name property added
- [ ] Uses @property decorator
- [ ] Returns formatted string
- [ ] Docstring added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 27 | Add weight_override Field | weight_override DecimalField |
| 28 | Add dimension_overrides | length/width/height override fields |
| 29 | Add sort_order Field | sort_order PositiveIntegerField |
| 30 | Define ProductVariantOption | Through model complete |
| 31 | Add __str__ Method | String representation |
| 32 | Add Meta Class | Ordering and constraints |
| 33 | Add get_option_display Method | Option display dictionary |
| 34 | Add get_full_name Property | Full name property |

### ProductVariant Model Progress

Additional features complete:
- **Override Fields:** weight, dimensions
- **Display Control:** sort_order
- **Through Model:** ProductVariantOption complete
- **Methods:** __str__, get_option_display
- **Properties:** get_full_name
- **Meta:** Ordering, constraints, indexes

### Business Value

These additions enable:
- Accurate shipping calculations
- Flexible variant display ordering
- Clean option value relationships
- Readable string representations
- Efficient database queries

### Next Steps
1. Proceed to [03_Tasks-35-38_ProductOptionConfig-Export.md](03_Tasks-35-38_ProductOptionConfig-Export.md) to create ProductOptionConfig model

---

## Notes for AI Agents

1. **Override Logic:** Check override fields first, fallback to product fields
2. **Dimension Calculations:** Use for volumetric weight in shipping
3. **Sort Order:** Lower numbers appear first in listings
4. **Through Model:** ProductVariantOption maintains M2M relationship
5. **String Methods:** Ensure readable output for admin and logs
6. **Indexes:** Optimize for common query patterns
7. **Property vs Method:** Use @property for simple computed values
8. **Null Handling:** Always check for null in override fields
