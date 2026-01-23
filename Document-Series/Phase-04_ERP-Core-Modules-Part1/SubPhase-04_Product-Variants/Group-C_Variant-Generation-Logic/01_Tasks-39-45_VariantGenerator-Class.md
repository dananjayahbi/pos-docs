# Tasks 39-45: VariantGenerator Class

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** C - Variant Generation Logic  
> **Document:** 01 of 03  
> **Tasks Covered:** 39, 40, 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-46-52_SKU-Pattern-Signals.md](02_Tasks-46-52_SKU-Pattern-Signals.md)

---

## Document Overview

This document covers creating the VariantGenerator service class that automatically generates product variants from option combinations using Cartesian product logic.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 39 | Create variant_generator.py | Low |
| 40 | Create VariantGenerator Class | Medium |
| 41 | Add get_combinations Method | High |
| 42 | Add generate_variants Method | High |
| 43 | Add generate_sku Method | Medium |
| 44 | Add validate_combinations Method | Medium |
| 45 | Add bulk_create_variants Method | High |

---

## Business Context

### Variant Generation Concept

When a product has multiple option types, variants are all possible combinations:

**Example: T-Shirt**
- Sizes: S, M, L (3 options)
- Colors: Red, Blue (2 options)
- **Total Variants:** 3 × 2 = 6 combinations

| Variant | Size | Color | SKU |
|---------|------|-------|-----|
| 1 | S | Red | TSHIRT-S-RED |
| 2 | S | Blue | TSHIRT-S-BLUE |
| 3 | M | Red | TSHIRT-M-RED |
| 4 | M | Blue | TSHIRT-M-BLUE |
| 5 | L | Red | TSHIRT-L-RED |
| 6 | L | Blue | TSHIRT-L-BLUE |

**Example: Laptop**
- RAM: 8GB, 16GB, 32GB (3 options)
- Storage: 256GB, 512GB (2 options)
- **Total Variants:** 3 × 2 = 6 combinations

This is called **Cartesian Product** - all possible combinations of option values.

---

## Task 39: Create variant_generator.py

### Overview
Create a service file for variant generation logic.

### Dependencies
- ProductVariant model exists
- ProductOptionConfig model exists
- VariantOptionValue model exists

### Instructions

1. **Create services directory**
   - Location: `backend/apps/products/services/`
   - Create __init__.py if not exists

2. **Create variant_generator.py file**
   - Location: `backend/apps/products/services/variant_generator.py`

3. **Add imports**
   - Import itertools (for product function)
   - Import Django transaction
   - Import models
   - Import exceptions

4. **Add module docstring**
   - Purpose: "Service for generating product variants"

### File Structure
```
backend/apps/products/
├── models/
├── services/
│   ├── __init__.py
│   └── variant_generator.py  # NEW
```

### Verification Checklist
- [ ] services directory exists
- [ ] variant_generator.py created
- [ ] Required imports added
- [ ] Module docstring present

---

## Task 40: Create VariantGenerator Class

### Overview
Create the main VariantGenerator service class.

### Dependencies
- Task 39: variant_generator.py file exists

### Instructions

1. **Define VariantGenerator class**
   - Class name: `VariantGenerator`
   - Purpose: Generate variants for a product

2. **Add __init__ method**
   - Accept product parameter
   - Store product reference
   - Initialize tenant context

3. **Add class docstring**
   - Explain purpose
   - Provide usage example

### Class Structure

```python
class VariantGenerator:
    """
    Service for generating product variants.
    
    Example:
        generator = VariantGenerator(product)
        variants = generator.generate_variants()
    """
    
    def __init__(self, product):
        self.product = product
        self.tenant = product.tenant
```

### Verification Checklist
- [ ] VariantGenerator class defined
- [ ] __init__ method accepts product
- [ ] Tenant context initialized
- [ ] Docstring with example

---

## Task 41: Add get_combinations Method

### Overview
Add method to calculate Cartesian product of option values.

### Dependencies
- Task 40: VariantGenerator class defined

### Instructions

1. **Add get_combinations method**
   - Returns list of option value combinations
   - Uses itertools.product for Cartesian product
   - Orders option types by display_order

2. **Implementation logic:**
   - Get ProductOptionConfig for product
   - For each config, get VariantOptionValue options
   - Calculate Cartesian product
   - Return list of combinations

3. **Add docstring and type hints**

### Cartesian Product Logic

**Mathematical Concept:**
```
Set A = {S, M, L}
Set B = {Red, Blue}
A × B = {(S,Red), (S,Blue), (M,Red), (M,Blue), (L,Red), (L,Blue)}
```

**Implementation with itertools.product:**
```python
import itertools

sizes = ['S', 'M', 'L']
colors = ['Red', 'Blue']

combinations = list(itertools.product(sizes, colors))
# Result: [
#   ('S', 'Red'), ('S', 'Blue'),
#   ('M', 'Red'), ('M', 'Blue'),
#   ('L', 'Red'), ('L', 'Blue')
# ]
```

### Example Scenarios

**2 Option Types:**
- Sizes: 4 values (XS, S, M, L)
- Colors: 3 values (Red, Blue, Green)
- **Combinations:** 4 × 3 = 12 variants

**3 Option Types:**
- Sizes: 3 values (S, M, L)
- Colors: 2 values (Red, Blue)
- Materials: 2 values (Cotton, Polyester)
- **Combinations:** 3 × 2 × 2 = 12 variants

**Sri Lankan Rice Example:**
- Types: 3 values (Basmati, Samba, Nadu)
- Weights: 4 values (1kg, 5kg, 10kg, 25kg)
- **Combinations:** 3 × 4 = 12 variants

### Method Output Format

```python
[
    [<VariantOptionValue: Size - S>, <VariantOptionValue: Color - Red>],
    [<VariantOptionValue: Size - S>, <VariantOptionValue: Color - Blue>],
    [<VariantOptionValue: Size - M>, <VariantOptionValue: Color - Red>],
    [<VariantOptionValue: Size - M>, <VariantOptionValue: Color - Blue>],
    # ... more combinations
]
```

### Verification Checklist
- [ ] get_combinations method added
- [ ] Uses itertools.product
- [ ] Orders by option type display_order
- [ ] Returns list of combinations
- [ ] Docstring explains logic

---

## Task 42: Add generate_variants Method

### Overview
Add main method that generates all variant records.

### Dependencies
- Task 41: get_combinations method exists
- Task 43: generate_sku method exists (next task)

### Instructions

1. **Add generate_variants method**
   - Gets combinations from get_combinations
   - For each combination, creates ProductVariant
   - Generates SKU for each variant
   - Creates ProductVariantOption links
   - Returns list of created variants

2. **Use database transaction**
   - Wrap in transaction.atomic()
   - Rollback if any error occurs

3. **Handle existing variants**
   - Check if combination already exists
   - Skip if duplicate
   - Log skipped variants

### Generation Process

**Step-by-Step Flow:**
```
1. Get option combinations (Cartesian product)
2. For each combination:
   a. Generate SKU
   b. Check if variant already exists
   c. Create ProductVariant instance
   d. Link option values via ProductVariantOption
   e. Generate variant name from options
3. Bulk save all variants
4. Return created variants
```

### Transaction Safety

**Why Use Transactions:**
- All variants created or none (atomic operation)
- Prevents partial generation on error
- Maintains database consistency

**Example Transaction:**
```python
with transaction.atomic():
    for combination in combinations:
        variant = create_variant(combination)
        variants.append(variant)
    ProductVariant.objects.bulk_create(variants)
```

### Error Handling

**Potential Errors:**
- Duplicate SKU
- Invalid option combination
- Database constraint violation
- Missing required fields

**Error Response:**
- Rollback transaction
- Return error message
- No partial data created

### Verification Checklist
- [ ] generate_variants method added
- [ ] Uses get_combinations
- [ ] Creates ProductVariant instances
- [ ] Links option values
- [ ] Uses transaction.atomic
- [ ] Handles duplicates
- [ ] Returns created variants

---

## Task 43: Add generate_sku Method

### Overview
Add method to generate SKU from product and option values.

### Dependencies
- Task 40: VariantGenerator class defined

### Instructions

1. **Add generate_sku method**
   - Accepts option values combination
   - Generates SKU based on pattern
   - Ensures uniqueness
   - Returns SKU string

2. **Default SKU pattern:**
   - Format: {product_sku}-{option1}-{option2}
   - Example: TSHIRT-M-RED

3. **Handle duplicate SKUs:**
   - Check if SKU exists
   - Append counter if needed
   - Example: TSHIRT-M-RED-2

### SKU Generation Patterns

**Pattern 1: Product + Option Values**
```
Product SKU: TSHIRT
Options: Medium, Red
Generated: TSHIRT-M-RED
```

**Pattern 2: Product + Codes**
```
Product SKU: LAPTOP
Options: 16GB, 512GB
Generated: LAPTOP-16-512
```

**Pattern 3: Hierarchical**
```
Category: CLO (Clothing)
Product: TSHIRT
Options: M, RED
Generated: CLO-TSHIRT-M-RED
```

### SKU Uniqueness

**Ensuring Uniqueness:**
```python
def generate_sku(option_values):
    base_sku = f"{product.sku}-{option_string}"
    
    if not SKU.exists(base_sku):
        return base_sku
    
    # Add counter for duplicates
    counter = 2
    while SKU.exists(f"{base_sku}-{counter}"):
        counter += 1
    
    return f"{base_sku}-{counter}"
```

### Option Value Formatting

**Extracting Value Codes:**
- Size: M → "M"
- Color: Red → "RED"
- RAM: 16GB → "16GB"

**Cleaning Values:**
- Convert to uppercase
- Remove spaces
- Replace special characters
- Limit length

### Verification Checklist
- [ ] generate_sku method added
- [ ] Accepts option values
- [ ] Generates readable SKU
- [ ] Ensures uniqueness
- [ ] Handles duplicates
- [ ] Returns string

---

## Task 44: Add validate_combinations Method

### Overview
Add method to validate option combinations before generation.

### Dependencies
- Task 41: get_combinations method exists

### Instructions

1. **Add validate_combinations method**
   - Validates product has option configs
   - Checks option values exist
   - Ensures no duplicate option types
   - Returns validation result

2. **Validation checks:**
   - Product must be VARIABLE type
   - Product must have option configs
   - Each option type must have values
   - No empty combinations

3. **Return format:**
   - Success: (True, None)
   - Failure: (False, error_message)

### Validation Rules

**Rule 1: Product Type**
```
✓ Product type = VARIABLE
✗ Product type = SIMPLE (cannot have variants)
```

**Rule 2: Option Configs Exist**
```
✓ Product has 2+ option configs (Size, Color)
✗ Product has 0 option configs (no options defined)
```

**Rule 3: Option Values Exist**
```
✓ Size has values: S, M, L
✓ Color has values: Red, Blue
✗ Size has no values (empty)
```

**Rule 4: Minimum Requirements**
```
✓ At least 1 option type with 2+ values
✗ Only 1 option type with 1 value (pointless variant)
```

### Validation Examples

**Valid Configuration:**
```
Product: T-Shirt (VARIABLE)
Configs:
  - Size: S, M, L (3 values)
  - Color: Red, Blue (2 values)
Result: ✓ Valid - Can generate 6 variants
```

**Invalid Configuration:**
```
Product: Simple Mug (SIMPLE)
Result: ✗ Invalid - Simple products cannot have variants
```

**Invalid Configuration:**
```
Product: T-Shirt (VARIABLE)
Configs:
  - Size: (no values)
Result: ✗ Invalid - Size option has no values
```

### Error Messages

| Validation | Error Message |
|------------|---------------|
| Not VARIABLE | "Product must be VARIABLE type to have variants" |
| No configs | "Product has no option configurations" |
| No values | "Option type '{name}' has no values defined" |
| Insufficient options | "Need at least one option type with 2+ values" |

### Verification Checklist
- [ ] validate_combinations method added
- [ ] Checks product type
- [ ] Validates option configs
- [ ] Checks option values exist
- [ ] Returns (success, error) tuple
- [ ] Clear error messages

---

## Task 45: Add bulk_create_variants Method

### Overview
Add optimized method for bulk creating variants.

### Dependencies
- Task 42: generate_variants method exists

### Instructions

1. **Add bulk_create_variants method**
   - Accepts list of variant data
   - Uses bulk_create for performance
   - Creates all ProductVariantOption links
   - Returns created count

2. **Optimization strategies:**
   - Use bulk_create instead of save()
   - Batch process option links
   - Minimize database queries
   - Use select_related/prefetch_related

3. **Performance metrics:**
   - Track creation time
   - Log number of variants created
   - Report any failures

### Bulk Creation Performance

**Single save() vs bulk_create():**

| Method | 100 Variants | 1000 Variants |
|--------|--------------|---------------|
| **save() loop** | 10 seconds | 100+ seconds |
| **bulk_create()** | 0.5 seconds | 3 seconds |

**Why bulk_create is faster:**
- Single database transaction
- Fewer SQL queries
- Reduced network overhead
- Database-level optimization

### Bulk Creation Process

**Step 1: Prepare variant data**
```python
variants_to_create = []
for combination in combinations:
    variant = ProductVariant(
        tenant=self.tenant,
        product=self.product,
        sku=generate_sku(combination),
        # ... other fields
    )
    variants_to_create.append(variant)
```

**Step 2: Bulk create variants**
```python
created_variants = ProductVariant.objects.bulk_create(
    variants_to_create,
    batch_size=500
)
```

**Step 3: Bulk create option links**
```python
option_links = []
for variant, combination in zip(created_variants, combinations):
    for idx, option_value in enumerate(combination):
        link = ProductVariantOption(
            variant=variant,
            option_value=option_value,
            display_order=idx * 10
        )
        option_links.append(link)

ProductVariantOption.objects.bulk_create(option_links)
```

### Batch Size Considerations

**Optimal batch_size:**
- Small datasets (< 100): batch_size=None (single batch)
- Medium datasets (100-1000): batch_size=500
- Large datasets (1000+): batch_size=1000

**Sri Lankan Context:**
- Typical clothing store: 50-200 variants per product
- Electronics store: 10-50 variants per product
- Grocery store: 5-20 variants per product
- Recommended batch_size=500

### Error Handling

**Handling Partial Failures:**
```python
try:
    with transaction.atomic():
        variants = bulk_create_variants(data)
        return (True, len(variants))
except IntegrityError as e:
    return (False, str(e))
```

### Performance Logging

**Log Creation Metrics:**
```python
start_time = time.time()
variants = bulk_create_variants(data)
elapsed = time.time() - start_time

logger.info(f"Created {len(variants)} variants in {elapsed:.2f}s")
```

### Verification Checklist
- [ ] bulk_create_variants method added
- [ ] Uses bulk_create
- [ ] Batch size configurable
- [ ] Creates option links
- [ ] Uses transactions
- [ ] Returns created count
- [ ] Performance optimized

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 39 | Create variant_generator.py | Service file |
| 40 | Create VariantGenerator Class | Main service class |
| 41 | Add get_combinations Method | Cartesian product logic |
| 42 | Add generate_variants Method | Main generation method |
| 43 | Add generate_sku Method | SKU generation |
| 44 | Add validate_combinations Method | Validation logic |
| 45 | Add bulk_create_variants Method | Optimized bulk creation |

### VariantGenerator Service Complete

The service now provides:
- **Combination Generation:** Cartesian product of options
- **Variant Creation:** Automated variant generation
- **SKU Generation:** Unique SKU creation
- **Validation:** Pre-generation checks
- **Bulk Operations:** Performance-optimized creation

### Business Value

This service enables:
- One-click variant generation
- Automatic combination calculation
- Consistent SKU patterns
- Fast bulk creation
- Error prevention through validation

### Usage Example

```python
# Create product with options
product = Product.objects.create(
    name="Classic T-Shirt",
    sku="TSHIRT",
    product_type="VARIABLE"
)

# Configure options
ProductOptionConfig.objects.create(product=product, option_type=size_type)
ProductOptionConfig.objects.create(product=product, option_type=color_type)

# Generate variants
generator = VariantGenerator(product)
is_valid, error = generator.validate_combinations()
if is_valid:
    variants = generator.generate_variants()
    print(f"Created {len(variants)} variants")
```

### Next Steps
1. Proceed to [02_Tasks-46-52_SKU-Pattern-Signals.md](02_Tasks-46-52_SKU-Pattern-Signals.md) for SKU patterns and signals

---

## Notes for AI Agents

1. **Cartesian Product:** Use itertools.product for combinations
2. **Transaction Safety:** Always use atomic transactions
3. **SKU Uniqueness:** Check before creating, append counter if needed
4. **Bulk Operations:** Use bulk_create for performance
5. **Validation First:** Always validate before generation
6. **Error Handling:** Provide clear error messages
7. **Logging:** Log creation metrics for monitoring
8. **Batch Size:** Adjust based on dataset size
