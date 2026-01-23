# Tasks 46-52: SKU Pattern and Signals

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** C - Variant Generation Logic  
> **Document:** 02 of 03  
> **Tasks Covered:** 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-39-45_VariantGenerator-Class.md](01_Tasks-39-45_VariantGenerator-Class.md)
- **→ Next Document:** [03_Tasks-53-54_Migration-Testing.md](03_Tasks-53-54_Migration-Testing.md)

---

## Document Overview

This document covers configuring SKU generation patterns and creating Django signals for automatic variant name generation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 46 | Create SKU Pattern Config | Medium |
| 47 | Define Default SKU Pattern | Low |
| 48 | Add SKU Uniqueness Check | Medium |
| 49 | Create signals.py File | Low |
| 50 | Add pre_save Signal | Medium |
| 51 | Add post_save Signal | Medium |
| 52 | Add Auto-name Generation | Medium |

---

## Task 46: Create SKU Pattern Config

### Overview
Create configuration system for customizable SKU generation patterns.

### Dependencies
- VariantGenerator class exists

### Instructions

1. **Create config.py file in services**
   - Location: `backend/apps/products/services/config.py`

2. **Define SKU pattern templates**
   - Multiple pattern options
   - Placeholder support
   - Tenant-customizable patterns

3. **Add pattern variables**
   - {product_sku}: Parent product SKU
   - {option_1}, {option_2}, etc.: Option value codes
   - {counter}: Sequential number
   - {tenant_code}: Tenant identifier

4. **Add pattern validation**
   - Ensure required placeholders present
   - Validate syntax

### SKU Pattern Examples

| Pattern | Example Input | Generated SKU |
|---------|---------------|---------------|
| `{product_sku}-{option_1}-{option_2}` | TSHIRT, M, RED | TSHIRT-M-RED |
| `{tenant_code}-{product_sku}-{option_1}-{option_2}` | T1, LAPTOP, 16GB, 512GB | T1-LAPTOP-16GB-512GB |
| `{product_sku}-V{counter:03d}` | TSHIRT, 1 | TSHIRT-V001 |

### Verification Checklist
- [ ] config.py file created
- [ ] Pattern templates defined
- [ ] Placeholder variables documented
- [ ] Pattern validation added

---

## Task 47: Define Default SKU Pattern

### Overview
Set default SKU generation pattern for the system.

### Dependencies
- Task 46: SKU pattern config exists

### Instructions

1. **Define DEFAULT_SKU_PATTERN constant**
   - Pattern: `{product_sku}-{options}`
   - Concatenates all option codes with hyphens

2. **Add pattern documentation**
   - Explain placeholder usage
   - Show examples

3. **Make pattern tenant-configurable**
   - Store in TenantSettings model
   - Fallback to default if not set

### Default Pattern Behavior

**Pattern:** `{product_sku}-{options}`

**Examples:**
- T-Shirt (M, Red) → TSHIRT-M-RED
- Laptop (16GB, 512GB) → LAPTOP-16GB-512GB
- Rice (Basmati, 1kg) → RICE-BASMATI-1KG

### Verification Checklist
- [ ] DEFAULT_SKU_PATTERN defined
- [ ] Pattern documented
- [ ] Tenant override capability added
- [ ] Examples provided

---

## Task 48: Add SKU Uniqueness Check

### Overview
Add method to ensure SKU uniqueness before creating variants.

### Dependencies
- Task 43: generate_sku method exists

### Instructions

1. **Add check_sku_unique method**
   - Queries existing SKUs
   - Tenant-scoped check
   - Returns boolean

2. **Add get_unique_sku method**
   - Generates SKU
   - Checks uniqueness
   - Appends counter if duplicate
   - Returns unique SKU

3. **Handle edge cases**
   - Maximum retry attempts
   - Error if can't generate unique SKU

### Uniqueness Check Logic

```python
def get_unique_sku(base_sku):
    if not sku_exists(base_sku):
        return base_sku
    
    for counter in range(2, 1000):
        sku = f"{base_sku}-{counter}"
        if not sku_exists(sku):
            return sku
    
    raise ValueError("Cannot generate unique SKU")
```

### Verification Checklist
- [ ] check_sku_unique method added
- [ ] get_unique_sku method added
- [ ] Tenant-scoped checks
- [ ] Error handling for failures

---

## Task 49: Create signals.py File

### Overview
Create Django signals file for variant automation.

### Dependencies
- ProductVariant model exists

### Instructions

1. **Create signals.py file**
   - Location: `backend/apps/products/signals.py`

2. **Add imports**
   - Django signals (pre_save, post_save)
   - Import models
   - Import receiver decorator

3. **Add module docstring**
   - Purpose: "Signal handlers for product variants"

### File Structure
```
backend/apps/products/
├── models/
├── services/
├── signals.py  # NEW
```

### Verification Checklist
- [ ] signals.py file created
- [ ] Required imports added
- [ ] Module docstring present

---

## Task 50: Add pre_save Signal

### Overview
Add pre_save signal to auto-generate variant name before saving.

### Dependencies
- Task 49: signals.py file exists

### Instructions

1. **Create pre_save signal handler**
   - Decorator: @receiver(pre_save, sender=ProductVariant)
   - Generate name from option values if empty
   - Format: "Option1 / Option2 / Option3"

2. **Name generation logic**
   - Get all option values
   - Order by option_type display_order
   - Get labels
   - Join with " / " separator

3. **Skip if name already set**
   - Only generate if name is empty
   - Allow manual override

### Auto-Name Generation Examples

| Options | Generated Name |
|---------|----------------|
| Size: M, Color: Red | "Medium / Red" |
| RAM: 16GB, Storage: 512GB, Color: Silver | "16 GB / 512 GB SSD / Silver" |
| Type: Basmati, Weight: 1kg | "Basmati / 1 kilogram" |

### Verification Checklist
- [ ] pre_save signal handler created
- [ ] Auto-generates name from options
- [ ] Respects option ordering
- [ ] Skips if name already set

---

## Task 51: Add post_save Signal

### Overview
Add post_save signal for variant creation logging and cleanup.

### Dependencies
- Task 50: pre_save signal exists

### Instructions

1. **Create post_save signal handler**
   - Decorator: @receiver(post_save, sender=ProductVariant)
   - Log variant creation
   - Update product variant count cache
   - Trigger inventory initialization

2. **Differentiate create vs update**
   - Use created parameter
   - Different actions for create vs update

3. **Add logging**
   - Log variant SKU
   - Log parent product
   - Log tenant

### Post-Save Actions

**On Create (created=True):**
- Log: "Variant {sku} created for product {product}"
- Initialize inventory record
- Clear product variant count cache
- Trigger search index update

**On Update (created=False):**
- Log: "Variant {sku} updated"
- Update search index if name changed
- Clear cache if is_active changed

### Verification Checklist
- [ ] post_save signal handler created
- [ ] Logs creation/update
- [ ] Updates caches
- [ ] Initializes related records

---

## Task 52: Add Auto-name Generation

### Overview
Enhance name generation with formatting options and localization support.

### Dependencies
- Task 50: pre_save signal exists

### Instructions

1. **Create get_variant_name utility function**
   - Accepts variant instance
   - Returns formatted name
   - Supports localization

2. **Add formatting options**
   - Separator customization (/, -, •)
   - Case formatting (Title Case, UPPER, lower)
   - Label vs value display

3. **Add localization support**
   - Use current language for labels
   - Translate option type names
   - Support Sinhala/Tamil labels

4. **Integrate with signal**
   - Call utility function in pre_save
   - Apply to variant.name field

### Formatting Examples

**Separator Options:**
- Forward slash: "Medium / Red"
- Hyphen: "Medium - Red"
- Bullet: "Medium • Red"

**Case Options:**
- Title Case: "Medium / Red"
- UPPERCASE: "MEDIUM / RED"
- lowercase: "medium / red"

**Label vs Value:**
- Label: "Medium / Red" (user-friendly)
- Value: "m / red" (internal codes)

### Localization Examples

| Options | English | Sinhala | Tamil |
|---------|---------|---------|-------|
| Size: M, Color: Red | Medium / Red | මධ්‍ය / රතු | நடுத்தர / சிவப்பு |

### Verification Checklist
- [ ] get_variant_name utility created
- [ ] Formatting options supported
- [ ] Localization integrated
- [ ] Signal uses utility function

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 46 | Create SKU Pattern Config | Configuration system |
| 47 | Define Default SKU Pattern | Default pattern |
| 48 | Add SKU Uniqueness Check | Uniqueness validation |
| 49 | Create signals.py File | Signals file |
| 50 | Add pre_save Signal | Auto-name generation |
| 51 | Add post_save Signal | Logging and cleanup |
| 52 | Add Auto-name Generation | Enhanced formatting |

### Features Complete

- **SKU Configuration:** Flexible pattern system
- **Uniqueness:** Automatic SKU uniqueness enforcement
- **Auto-Naming:** Automatic variant name generation
- **Signals:** Pre/post save automation
- **Localization:** Multi-language support

### Next Steps
1. Proceed to [03_Tasks-53-54_Migration-Testing.md](03_Tasks-53-54_Migration-Testing.md) for migration and testing

---

## Notes for AI Agents

1. **SKU Patterns:** Make configurable per tenant
2. **Uniqueness:** Always check before saving
3. **Signals:** Register in apps.py ready() method
4. **Auto-Naming:** Only if name empty, allow manual override
5. **Localization:** Use option value label field for translations
6. **Caching:** Clear caches on variant creation/update
7. **Logging:** Log all variant operations for audit trail
