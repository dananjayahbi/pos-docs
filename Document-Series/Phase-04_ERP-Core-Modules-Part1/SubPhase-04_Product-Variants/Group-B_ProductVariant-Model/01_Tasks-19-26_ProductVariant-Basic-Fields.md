# Tasks 19-26: ProductVariant Basic Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** B - ProductVariant Model  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Override-Fields-Properties.md](02_Tasks-27-34_Override-Fields-Properties.md)

---

## Document Overview

This document covers the creation of the ProductVariant model with its basic fields. ProductVariant represents a specific variation of a product, such as a T-Shirt in Medium size and Red color.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Create product_variant.py File | Low |
| 20 | Define ProductVariant Class | Medium |
| 21 | Add product Field | Medium |
| 22 | Add sku Field | Medium |
| 23 | Add barcode Field | Low |
| 24 | Add name Field | Low |
| 25 | Add option_values Field | High |
| 26 | Add is_active Field | Low |

---

## Business Context

### Understanding Product Variants

A product variant is a specific combination of options for a variable product:

**Example 1: T-Shirt Product**
- **Base Product:** Classic T-Shirt
- **Variants:**
  - Classic T-Shirt - Small / Red (SKU: TSHIRT-S-RED)
  - Classic T-Shirt - Medium / Red (SKU: TSHIRT-M-RED)
  - Classic T-Shirt - Large / Blue (SKU: TSHIRT-L-BLUE)
  - Each variant has own SKU, price, stock

**Example 2: Laptop Product**
- **Base Product:** Dell XPS 15
- **Variants:**
  - Dell XPS 15 - 16GB RAM / 512GB SSD (SKU: XPS15-16-512)
  - Dell XPS 15 - 32GB RAM / 1TB SSD (SKU: XPS15-32-1TB)
  - Each variant has different price, specs

**Example 3: Rice (Sri Lankan Context)**
- **Base Product:** Basmati Rice
- **Variants:**
  - Basmati Rice - 1kg (SKU: RICE-BAS-1KG, Price: LKR 450)
  - Basmati Rice - 5kg (SKU: RICE-BAS-5KG, Price: LKR 2100)
  - Basmati Rice - 10kg (SKU: RICE-BAS-10KG, Price: LKR 4000)

### Product vs Variant Relationship

```
Product (Parent) ────┬───→ Variant 1 (Size: S, Color: Red)
                     ├───→ Variant 2 (Size: M, Color: Red)
                     ├───→ Variant 3 (Size: L, Color: Red)
                     ├───→ Variant 4 (Size: S, Color: Blue)
                     └───→ Variant 5 (Size: M, Color: Blue)
```

---

## Task 19: Create product_variant.py File

### Overview
Create a new model file for the ProductVariant model and related through models.

### Dependencies
- Product model exists
- VariantOptionValue model exists (Group A)

### Instructions

1. **Navigate to products models directory**
   - Location: `backend/apps/products/models/`
   - Ensure directory exists

2. **Create the product_variant.py file**
   - File name: `product_variant.py`
   - Location: `backend/apps/products/models/product_variant.py`

3. **Add file header with imports**
   - Import Django model components
   - Import TenantAwareModel base class
   - Import Product model
   - Import VariantOptionValue model
   - Import validators
   - Import gettext_lazy for translations

4. **Add module docstring**
   - Describe purpose: "Product variant models for variable products"
   - Mention models: ProductVariant, ProductVariantOption, ProductOptionConfig

### Expected File Structure
```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── product.py
    ├── variant_option.py
    └── product_variant.py    # NEW FILE
```

### Verification Checklist
- [ ] File `product_variant.py` created in models directory
- [ ] Required imports added
- [ ] Module docstring present
- [ ] File follows project coding standards

---

## Task 20: Define ProductVariant Class

### Overview
Create the ProductVariant model class that represents a specific variant of a product.

### Dependencies
- Task 19: product_variant.py file exists

### Instructions

1. **Define the ProductVariant class**
   - Inherit from TenantAwareModel
   - Class name: `ProductVariant`

2. **Add class docstring**
   - Explain purpose: "Represents a specific variant of a variable product"
   - Provide examples: T-Shirt in Medium/Red, Laptop with 16GB/512GB
   - Mention relationship to Product and OptionValues

3. **Add __all__ export list**
   - Prepare for exporting the class

4. **Prepare for field definitions**
   - Fields will be added in subsequent tasks

### Model Purpose

ProductVariant enables:
- Specific product configurations
- Individual SKUs and pricing per variant
- Separate inventory tracking
- Cart and order line items
- Customer selection of exact product variation

### Business Examples

**Clothing Store Variants:**

| Product | Variant | Options | SKU | Price (LKR) |
|---------|---------|---------|-----|-------------|
| Classic T-Shirt | Variant 1 | S, Red | TSHIRT-S-RED | 1,500 |
| Classic T-Shirt | Variant 2 | M, Red | TSHIRT-M-RED | 1,500 |
| Classic T-Shirt | Variant 3 | L, Blue | TSHIRT-L-BLUE | 1,500 |
| Premium Jeans | Variant 1 | 30W, Blue | JEANS-30-BLUE | 5,000 |
| Premium Jeans | Variant 2 | 32W, Black | JEANS-32-BLACK | 5,000 |

**Electronics Store Variants:**

| Product | Variant | Options | SKU | Price (LKR) |
|---------|---------|---------|-----|-------------|
| Dell XPS 15 | Variant 1 | 16GB, 512GB | XPS15-16-512 | 450,000 |
| Dell XPS 15 | Variant 2 | 32GB, 1TB | XPS15-32-1TB | 620,000 |
| iPhone 14 | Variant 1 | 128GB, Blue | IPH14-128-BLUE | 280,000 |
| iPhone 14 | Variant 2 | 256GB, Black | IPH14-256-BLACK | 320,000 |

**Sri Lankan Grocery Variants:**

| Product | Variant | Options | SKU | Price (LKR) |
|---------|---------|---------|-----|-------------|
| Basmati Rice | Variant 1 | 1kg | RICE-BAS-1KG | 450 |
| Basmati Rice | Variant 2 | 5kg | RICE-BAS-5KG | 2,100 |
| Cinnamon Powder | Variant 1 | 50g | CINN-50G | 150 |
| Cinnamon Powder | Variant 2 | 100g | CINN-100G | 280 |

### Verification Checklist
- [ ] ProductVariant class defined
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring present with examples
- [ ] Added to __all__ list
- [ ] Ready for field additions

---

## Task 21: Add product Field

### Overview
Add a ForeignKey field linking the variant to its parent product.

### Dependencies
- Task 20: ProductVariant class defined
- Product model exists

### Instructions

1. **Add product field as ForeignKey**
   - Field name: `product`
   - Links to: Product model
   - on_delete: CASCADE (if product deleted, variants deleted)
   - related_name: `variants`

2. **Add field help text**
   - "The parent product this variant belongs to"

3. **Add verbose name for admin**
   - verbose_name: "Product"

4. **Add validation**
   - Product must have product_type='VARIABLE'
   - Simple products cannot have variants

### Field Purpose

The product field establishes parent-child relationship:
- Links variant to base product
- Inherits product properties
- Groups variants together
- Enables variant queries

### Relationship Structure

```
Product (product_type=VARIABLE)
  ├── name: "Classic T-Shirt"
  ├── base_price: 1500 (optional, variants may override)
  └── Variants:
      ├── Variant 1: S / Red
      ├── Variant 2: M / Red
      ├── Variant 3: L / Red
      └── Variant 4: S / Blue
```

### Product Type Validation

**Product Types:**
- `SIMPLE`: Single product, no variants
- `VARIABLE`: Product with variants

**Validation Rule:**
- ProductVariant.product must have product_type='VARIABLE'
- Attempting to create variant for SIMPLE product → ValidationError

### Query Examples (Conceptual)

**Get all variants for a product:**
```python
product = Product.objects.get(sku='TSHIRT-CLASSIC')
variants = product.variants.all()
# Returns: All T-shirt variants (all size/color combinations)
```

**Get product from variant:**
```python
variant = ProductVariant.objects.get(sku='TSHIRT-M-RED')
product = variant.product
# Returns: Classic T-Shirt product
```

**Count variants:**
```python
product = Product.objects.get(sku='LAPTOP-XPS15')
variant_count = product.variants.count()
# Returns: Number of laptop configurations available
```

### Cascading Deletion Behavior

**Scenario:** Admin deletes parent product

**Result:**
- Product deleted
- All variants automatically deleted
- Maintains data integrity
- Prevents orphaned variants

**Business Impact:**
- Removing a product removes all configurations
- Stock adjustments needed
- Order history preserved (soft delete recommended)

### Multi-Tenant Scenarios

**Tenant 1 (Fashion Store):**
- Product: "Summer Dress"
- Variants: 10 (5 sizes × 2 colors)

**Tenant 2 (Electronics Store):**
- Product: "Gaming Laptop"
- Variants: 8 (4 RAM options × 2 storage options)

Each tenant's variants link only to their products.

### Verification Checklist
- [ ] product ForeignKey field added
- [ ] Links to Product model
- [ ] on_delete=CASCADE configured
- [ ] related_name='variants' set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Product type validation planned

---

## Task 22: Add sku Field

### Overview
Add a unique SKU (Stock Keeping Unit) field for each variant.

### Dependencies
- Task 21: product field exists

### Instructions

1. **Add sku field as CharField**
   - Field name: `sku`
   - Maximum length: 100 characters
   - Cannot be blank or null

2. **Add field help text**
   - "Unique Stock Keeping Unit for this variant"

3. **Add verbose name for admin**
   - verbose_name: "SKU"

4. **Configure uniqueness**
   - Unique per tenant
   - Will be enforced in Meta unique_together

5. **Add SKU generation notes**
   - Can be auto-generated from product SKU + options
   - Can be manually specified
   - Must be unique within tenant

### Field Purpose

The SKU field provides:
- Unique identifier for each variant
- Inventory tracking reference
- Order line item identification
- Barcode generation basis
- Integration with external systems

### SKU Formats and Patterns

**Pattern 1: Product SKU + Options**
```
Format: {product_sku}-{option1_value}-{option2_value}
Example: TSHIRT-M-RED (T-Shirt, Medium, Red)
Example: LAPTOP-16GB-512GB (Laptop, 16GB RAM, 512GB storage)
```

**Pattern 2: Sequential**
```
Format: {product_sku}-V001, V002, V003
Example: TSHIRT-V001, TSHIRT-V002, TSHIRT-V003
```

**Pattern 3: Hierarchical**
```
Format: {category}-{product}-{options}
Example: CLO-TSHIRT-M-RED (Clothing-TShirt-Medium-Red)
Example: ELE-LAPTOP-16-512 (Electronics-Laptop-16GB-512GB)
```

### SKU Examples by Industry

**Clothing:**

| Product | Variant | SKU | Pattern |
|---------|---------|-----|---------|
| T-Shirt | S, Red | TSHIRT-S-RED | Product-Size-Color |
| T-Shirt | M, Blue | TSHIRT-M-BLUE | Product-Size-Color |
| Jeans | 30W, Black | JEANS-30-BLACK | Product-Waist-Color |

**Electronics:**

| Product | Variant | SKU | Pattern |
|---------|---------|-----|---------|
| Laptop | 16GB, 512GB | XPS15-16-512 | Product-RAM-Storage |
| Phone | 128GB, Red | IPH14-128-RED | Product-Storage-Color |

**Food/Grocery (Sri Lanka):**

| Product | Variant | SKU | Pattern |
|---------|---------|-----|---------|
| Rice | Basmati, 1kg | RICE-BAS-1KG | Product-Type-Weight |
| Rice | Samba, 5kg | RICE-SAM-5KG | Product-Type-Weight |
| Cinnamon | Powder, 100g | CINN-PWD-100G | Product-Grind-Weight |

### SKU Best Practices

| Practice | Recommendation | Reason |
|----------|----------------|--------|
| **Uniqueness** | Globally unique within tenant | Inventory accuracy |
| **Readability** | Human-readable format | Easy identification |
| **Consistency** | Consistent pattern across products | Systematic organization |
| **Length** | 8-20 characters optimal | Barcode compatibility |
| **Characters** | Alphanumeric + hyphens | System compatibility |
| **Avoid** | Special characters, spaces | Integration issues |

### Auto-Generation Logic (Conceptual)

**Rule-Based Generation:**
```
Input:
  - Product SKU: "TSHIRT"
  - Size: "M"
  - Color: "RED"

Output:
  - Variant SKU: "TSHIRT-M-RED"

Logic:
  1. Start with product SKU
  2. Append each option value
  3. Separate with hyphens
  4. Convert to uppercase
  5. Check uniqueness
  6. If duplicate, add counter
```

### Uniqueness Handling

**Scenario: Duplicate SKU**
```
Attempt 1: TSHIRT-M-RED (Success)
Attempt 2: TSHIRT-M-RED (Duplicate detected)
Solution: TSHIRT-M-RED-2 or regenerate with different pattern
```

### Integration Uses

**Inventory System:**
- Track stock by SKU
- SKU: TSHIRT-M-RED, Quantity: 150

**Point of Sale:**
- Scan barcode → Lookup SKU → Find variant → Add to cart

**E-commerce API:**
```
GET /api/products/TSHIRT-M-RED/
GET /api/cart/add/?sku=TSHIRT-M-RED&quantity=2
```

**Order Management:**
```
Order #1234
  Line Item 1: SKU TSHIRT-M-RED, Qty: 2
  Line Item 2: SKU JEANS-32-BLUE, Qty: 1
```

### Multi-Language Considerations

**Note:** SKU should remain consistent across languages
- SKU: TSHIRT-M-RED (English)
- SKU: TSHIRT-M-RED (Sinhala interface)
- Name translates, SKU does not

### Verification Checklist
- [ ] sku field added as CharField
- [ ] Maximum length set to 100
- [ ] Field is required (non-nullable)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Prepared for uniqueness constraint
- [ ] SKU patterns understood
- [ ] Generation logic planned

---

## Task 23: Add barcode Field

### Overview
Add an optional field to store barcode values for variants.

### Dependencies
- Task 22: sku field exists

### Instructions

1. **Add barcode field as CharField**
   - Field name: `barcode`
   - Maximum length: 100 characters
   - Can be blank and null (optional)

2. **Add field help text**
   - "Barcode for this variant (EAN-13, UPC, etc.)"

3. **Add verbose name for admin**
   - verbose_name: "Barcode"

4. **Add barcode format notes**
   - Support multiple formats (EAN-13, UPC-A, Code128)
   - Can be generated from SKU
   - Used for POS scanning

### Field Purpose

The barcode field enables:
- Point of Sale scanning
- Inventory management
- Warehouse operations
- Quick product lookup
- Integration with barcode systems

### Barcode Formats

| Format | Length | Usage | Example |
|--------|--------|-------|---------|
| **EAN-13** | 13 digits | International products | 5901234123457 |
| **UPC-A** | 12 digits | North American products | 012345678905 |
| **Code 128** | Variable | Alphanumeric encoding | TSHIRT-M-RED |
| **QR Code** | Variable | 2D barcode for URLs | https://store.lk/p/123 |

### Barcode Examples

**Clothing Store:**

| Product Variant | SKU | Barcode (EAN-13) | Usage |
|----------------|-----|------------------|-------|
| T-Shirt M/Red | TSHIRT-M-RED | 5901234560001 | POS scanning |
| T-Shirt L/Blue | TSHIRT-L-BLUE | 5901234560002 | POS scanning |
| Jeans 32/Black | JEANS-32-BLACK | 5901234570001 | POS scanning |

**Electronics Store:**

| Product Variant | SKU | Barcode (UPC-A) | Usage |
|----------------|-----|-----------------|-------|
| Laptop 16GB/512GB | XPS15-16-512 | 012345678905 | International sales |
| Phone 128GB/Red | IPH14-128-RED | 012345678912 | Retail scanning |

**Sri Lankan Grocery:**

| Product Variant | SKU | Barcode (EAN-13) | Price (LKR) |
|----------------|-----|------------------|-------------|
| Rice Basmati 1kg | RICE-BAS-1KG | 5901234500001 | 450 |
| Rice Samba 5kg | RICE-SAM-5KG | 5901234500002 | 2,100 |

### Barcode Generation

**Option 1: Auto-Generate from SKU**
- Use SKU as Code 128 barcode
- No separate numeric code needed
- Example: SKU "TSHIRT-M-RED" → Code 128 barcode

**Option 2: Sequential EAN-13**
- Generate sequential 13-digit codes
- Assign to variants as created
- Example: 5901234560001, 5901234560002, ...

**Option 3: Manual Entry**
- For products with existing barcodes
- Import from supplier data
- Validate format before saving

### Barcode Validation

**EAN-13 Validation:**
- Must be exactly 13 digits
- Check digit validation (last digit)
- No letters or special characters

**UPC-A Validation:**
- Must be exactly 12 digits
- Check digit validation
- No letters or special characters

**Code 128 Validation:**
- Alphanumeric allowed
- Special characters allowed
- Length varies

### Business Use Cases

**Point of Sale:**
```
1. Customer brings T-Shirt to counter
2. Cashier scans barcode
3. System looks up by barcode → finds SKU
4. Retrieves variant details (price, stock)
5. Adds to transaction
```

**Inventory Receiving:**
```
1. Warehouse receives shipment
2. Scan each item barcode
3. System matches to purchase order
4. Updates stock quantities
5. Confirms receipt
```

**Stock Taking:**
```
1. Staff scans each item on shelf
2. System records barcode + quantity
3. Compares to expected stock
4. Identifies discrepancies
```

### Multi-Tenant Barcode Strategy

**Option 1: Tenant-Specific Prefix**
- Tenant 1: 59012340xxxxx
- Tenant 2: 59012341xxxxx
- Prevents barcode collisions

**Option 2: Tenant-Specific Ranges**
- Tenant 1: 5901234000001-5901234099999
- Tenant 2: 5901234100000-5901234199999

**Option 3: Separate Sequences**
- Each tenant has own counter
- Tenant 1: 0001, 0002, 0003...
- Tenant 2: 0001, 0002, 0003...
- Combined with tenant prefix

### Sri Lankan Context

**Local Barcode Requirements:**
- EAN-13 compatible for imports
- GS1 Sri Lanka membership for official codes
- Custom barcodes for local products
- Sinhala language labels with barcode

### Verification Checklist
- [ ] barcode field added as CharField
- [ ] Maximum length set to 100
- [ ] Field is optional (blank=True, null=True)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Barcode formats understood
- [ ] Validation patterns noted
- [ ] Generation strategy planned

---

## Task 24: Add name Field

### Overview
Add a field to store the variant's display name.

### Dependencies
- Task 25: option_values field exists (for auto-generation)

### Instructions

1. **Add name field as CharField**
   - Field name: `name`
   - Maximum length: 255 characters
   - Can be blank (auto-generated from options)

2. **Add field help text**
   - "Display name for this variant (auto-generated from options)"

3. **Add verbose name for admin**
   - verbose_name: "Variant Name"

4. **Add auto-generation logic**
   - Generated from option values
   - Format: "OptionValue1 / OptionValue2"
   - Example: "Medium / Red"

### Field Purpose

The name field provides:
- Human-readable variant identification
- Display in product listings
- Cart and order display
- Admin interface clarity
- Search functionality

### Name Format Examples

**Clothing Variants:**

| Product | Options | Generated Name |
|---------|---------|----------------|
| T-Shirt | Size: M, Color: Red | "Medium / Red" |
| T-Shirt | Size: L, Color: Blue | "Large / Blue" |
| Jeans | Waist: 32, Color: Black | "32 / Black" |
| Dress | Size: S, Material: Cotton, Color: White | "Small / Cotton / White" |

**Electronics Variants:**

| Product | Options | Generated Name |
|---------|---------|----------------|
| Laptop | RAM: 16GB, Storage: 512GB | "16 GB / 512 GB SSD" |
| Phone | Storage: 128GB, Color: Blue | "128 GB / Blue" |
| Tablet | Screen: 10", Storage: 64GB, Color: Gray | "10 inch / 64 GB / Gray" |

**Food Products (Sri Lanka):**

| Product | Options | Generated Name |
|---------|---------|----------------|
| Rice | Type: Basmati, Weight: 1kg | "Basmati / 1 kilogram" |
| Cinnamon | Grind: Powder, Weight: 100g | "Fine Powder / 100 grams" |
| Tea | Type: Black, Quantity: 200g | "Black Tea / 200 grams" |

### Full Display Name

**Complete Product Display:**
```
Product Name: Classic T-Shirt
Variant Name: Medium / Red
Full Display: "Classic T-Shirt - Medium / Red"

Product Name: Dell XPS 15
Variant Name: 16 GB / 512 GB SSD
Full Display: "Dell XPS 15 - 16 GB / 512 GB SSD"
```

### Auto-Generation Logic (Conceptual)

**Generation Rule:**
```
1. Get all option values for variant
2. Order by option_type.display_order
3. Get label from each option value
4. Join with " / " separator
5. Save to name field

Example:
  Options: [Size: M, Color: Red]
  Option Type Order: Size (0), Color (10)
  Labels: "Medium", "Red"
  Generated Name: "Medium / Red"
```

### Name Update Triggers

**When to Regenerate Name:**
- Variant created
- Option values changed
- Option value labels updated
- Manual trigger from admin

### Display Contexts

**Product Page:**
```
Classic T-Shirt
Select Options:
  ○ Small / Red - LKR 1,500
  ● Medium / Red - LKR 1,500
  ○ Large / Blue - LKR 1,500

Selected: Medium / Red
```

**Shopping Cart:**
```
Items in Cart:
1. Classic T-Shirt - Medium / Red
   SKU: TSHIRT-M-RED
   Price: LKR 1,500
   Quantity: 2
   Subtotal: LKR 3,000
```

**Order Confirmation:**
```
Order #12345
Items:
1. Classic T-Shirt - Medium / Red (TSHIRT-M-RED) × 2 = LKR 3,000
2. Premium Jeans - 32 / Black (JEANS-32-BLACK) × 1 = LKR 5,000
```

**Admin Interface:**
```
Product Variants:
- Classic T-Shirt - Medium / Red [Active] [150 in stock]
- Classic T-Shirt - Large / Blue [Active] [200 in stock]
- Classic T-Shirt - Small / Red [Inactive] [Out of stock]
```

### Multi-Language Considerations

**Variant Names by Locale:**

| Options | English | Sinhala | Tamil |
|---------|---------|---------|-------|
| Size: M, Color: Red | Medium / Red | මධ්‍ය / රතු | நடுத்தர / சிவப்பு |
| Weight: 1kg, Type: Basmati | 1 kilogram / Basmati | කිලෝග්‍රෑම් 1 / බාස්මති | 1 கிலோ / பாஸ்மதி |

**Implementation:**
- Store option values with translated labels
- Generate name based on current locale
- Cache generated names per language

### Verification Checklist
- [ ] name field added as CharField
- [ ] Maximum length set to 255
- [ ] Field can be blank (auto-generated)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Generation format understood
- [ ] Display contexts clear
- [ ] Localization considered

---

## Task 25: Add option_values Field

### Overview
Add a ManyToMany field to link variant to its option values through a custom through model.

### Dependencies
- Task 20: ProductVariant class defined
- VariantOptionValue model exists (Group A)

### Instructions

1. **Define ProductVariantOption through model**
   - Model name: `ProductVariantOption`
   - Links ProductVariant and VariantOptionValue
   - Add display_order field for ordering
   - Inherit from models.Model (not tenant-aware)

2. **Add option_values field to ProductVariant**
   - Field name: `option_values`
   - Field type: ManyToManyField
   - Links to: VariantOptionValue
   - through: ProductVariantOption
   - related_name: `product_variants`

3. **Add field help text**
   - "Option values that define this variant"

4. **Configure through model**
   - ForeignKey to ProductVariant
   - ForeignKey to VariantOptionValue
   - display_order field for option ordering

### Field Purpose

The option_values field defines:
- Which option values make up this variant
- Combination of options (Size: M, Color: Red)
- Link to option value details (color code, image)
- Basis for variant name generation

### ManyToMany Relationship

**Relationship Structure:**
```
ProductVariant ←→ ProductVariantOption ←→ VariantOptionValue
(Many)                  (Through)              (Many)
```

**Example:**
```
Variant: T-Shirt - Medium / Red
  └─ ProductVariantOption 1:
      ├─ ProductVariant: T-Shirt variant
      ├─ VariantOptionValue: Medium (Size)
      └─ display_order: 0
  └─ ProductVariantOption 2:
      ├─ ProductVariant: T-Shirt variant
      ├─ VariantOptionValue: Red (Color)
      └─ display_order: 10
```

### Through Model: ProductVariantOption

**Purpose:**
- Links variant to option values
- Maintains order of options
- Enables additional metadata

**Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| variant | ForeignKey | Link to ProductVariant |
| option_value | ForeignKey | Link to VariantOptionValue |
| display_order | PositiveIntegerField | Order of options in display |

**Unique Constraint:**
- unique_together: ['variant', 'option_value']
- Prevents duplicate option values per variant

### Option Combination Examples

**T-Shirt Variant:**
```
Variant: TSHIRT-M-RED
Option Values:
  1. Size: Medium (order: 0)
  2. Color: Red (order: 10)
Display: "Medium / Red"
```

**Laptop Variant:**
```
Variant: XPS15-16-512
Option Values:
  1. RAM: 16 GB (order: 0)
  2. Storage: 512 GB SSD (order: 10)
  3. Color: Silver (order: 20)
Display: "16 GB / 512 GB SSD / Silver"
```

**Rice Variant (Sri Lanka):**
```
Variant: RICE-BAS-5KG
Option Values:
  1. Type: Basmati (order: 0)
  2. Weight: 5 kilograms (order: 10)
  3. Origin: Local (order: 20)
Display: "Basmati / 5 kilograms / Local"
```

### Validation Rules

**Variant Option Constraints:**
1. Each variant must have at least one option value
2. Option values must be from different option types
3. Cannot have two values from same type (e.g., both "Red" and "Blue")
4. Option types must be configured for the product

**Example Validation:**
```
Valid:
  - Size: M, Color: Red ✓
  - RAM: 16GB, Storage: 512GB ✓

Invalid:
  - Size: M, Size: L ✗ (duplicate option type)
  - Color: Red, Color: Blue ✗ (duplicate option type)
  - [empty] ✗ (no option values)
```

### Uniqueness Enforcement

**Business Rule:** No two variants can have the same option combination

**Example:**
```
Variant 1: Size M, Color Red ✓
Variant 2: Size L, Color Red ✓
Variant 3: Size M, Color Red ✗ (duplicate combination)
```

**Database Enforcement:**
- Unique constraint on combination
- Check before creating variant
- Prevent duplicate SKUs implicitly

### Query Examples (Conceptual)

**Get option values for variant:**
```python
variant = ProductVariant.objects.get(sku='TSHIRT-M-RED')
option_values = variant.option_values.all()
# Returns: [Size: Medium, Color: Red]
```

**Get variants with specific option value:**
```python
red_color = VariantOptionValue.objects.get(value='red')
red_variants = red_color.product_variants.all()
# Returns: All variants with Red color
```

**Filter variants by multiple options:**
```python
medium_size = VariantOptionValue.objects.get(value='m')
red_color = VariantOptionValue.objects.get(value='red')

variant = ProductVariant.objects.filter(
    option_values=medium_size
).filter(
    option_values=red_color
).first()
# Returns: Medium Red variant
```

### Display Order Importance

**Why display_order matters:**
- Consistent display: "Medium / Red" not "Red / Medium"
- Follows option type ordering
- Better user experience
- Predictable sorting

**Example:**
```
Option Types:
  - Size (display_order: 0)
  - Color (display_order: 10)

Variant Options:
  - Size: Medium (display_order: 0)
  - Color: Red (display_order: 10)

Display: "Medium / Red" (Size first, Color second)
```

### Multi-Tenant Considerations

Each tenant's variants use their own option values:
- Tenant 1 sizes: XS, S, M, L, XL
- Tenant 2 sizes: Small, Medium, Large
- No cross-tenant option value sharing

### Verification Checklist
- [ ] ProductVariantOption through model defined
- [ ] option_values ManyToMany field added
- [ ] through model specified
- [ ] related_name set
- [ ] Help text added
- [ ] Through model fields defined
- [ ] Unique constraints understood
- [ ] Validation rules clear
- [ ] Display order logic planned

---

## Task 26: Add is_active Field

### Overview
Add a boolean field to control whether the variant is active and available for sale.

### Dependencies
- Task 20: ProductVariant class defined

### Instructions

1. **Add is_active field as BooleanField**
   - Field name: `is_active`
   - Default value: True

2. **Add field help text**
   - "Whether this variant is active and available for sale"

3. **Add verbose name for admin**
   - verbose_name: "Is Active"

4. **Add index for filtering**
   - Index on is_active for active variant queries

### Field Purpose

The is_active field controls:
- Variant visibility on storefront
- Availability for purchase
- Inventory management
- Seasonal products
- Discontinued variants

### Active vs Inactive Scenarios

**When to Set Inactive:**

| Scenario | Reason | Example |
|----------|--------|---------|
| **Out of Stock** | No inventory, hide from store | T-Shirt M/Red: 0 in stock |
| **Discontinued** | No longer producing | Old iPhone model variants |
| **Seasonal** | Not in season | Winter jacket in summer |
| **Quality Issue** | Temporary removal | Product recall |
| **Pending Approval** | New variant, not ready | Awaiting QC approval |

**When to Keep Active:**

| Scenario | Reason | Example |
|----------|--------|---------|
| **In Stock** | Available inventory | T-Shirt M/Red: 150 in stock |
| **Pre-order** | Accepting orders | New laptop model coming soon |
| **Made to Order** | Custom manufacturing | Custom furniture variants |
| **Always Available** | Digital products | Software licenses |

### Business Logic Impact

**Storefront Display:**
```
Active Variants:
✓ Shown in product page
✓ Selectable by customers
✓ Appear in search results
✓ Listed in catalog

Inactive Variants:
✗ Hidden from product page
✗ Not selectable
✗ Excluded from search
✗ Removed from catalog
```

**Inventory Management:**
```
Active Variants:
- Included in stock reports
- Available for POS sales
- Shown in inventory lists

Inactive Variants:
- Marked as unavailable
- Hidden from POS
- Archived in reports
```

**API Response:**
```
GET /api/products/tshirt-classic/variants/?is_active=true
Returns: Only active variants

GET /api/products/tshirt-classic/variants/
Returns: All variants (admin view)
```

### Activation Workflows

**New Variant Workflow:**
```
1. Create variant (is_active=False by default in some systems)
2. Add inventory
3. Set pricing
4. Upload images
5. QC approval
6. Set is_active=True
7. Variant goes live
```

**Deactivation Workflow:**
```
1. Receive inventory alert: Stock = 0
2. Check restock timeline
3. If long delay: Set is_active=False
4. Update product page
5. Notify customers (if pre-ordered)
```

**Seasonal Activation:**
```
Winter Season:
- Activate: Winter jackets, Sweaters, Boots
- Deactivate: Summer dresses, Sandals, Shorts

Summer Season:
- Activate: Summer dresses, Sandals, Shorts
- Deactivate: Winter jackets, Sweaters, Boots
```

### Query Examples (Conceptual)

**Get active variants only:**
```python
active_variants = ProductVariant.objects.filter(is_active=True)
```

**Get active variants for product:**
```python
product = Product.objects.get(sku='TSHIRT-CLASSIC')
active = product.variants.filter(is_active=True)
```

**Count active vs inactive:**
```python
total = ProductVariant.objects.count()
active = ProductVariant.objects.filter(is_active=True).count()
inactive = total - active
```

### Admin Interface Usage

**Bulk Actions:**
```
Admin Actions:
[ ] Select All
[✓] T-Shirt M/Red
[✓] T-Shirt L/Blue
[ ] T-Shirt S/Green

Actions: [Activate Selected] [Deactivate Selected] [Go]
```

**Status Indicators:**
```
Product Variants:
✓ T-Shirt - Medium / Red [Active]
✓ T-Shirt - Large / Blue [Active]
✗ T-Shirt - Small / Green [Inactive]
```

### Multi-Tenant Scenarios

**Tenant 1 (Fashion Store):**
```
Active: 85 variants (current season)
Inactive: 120 variants (past seasons)
Strategy: Deactivate off-season variants
```

**Tenant 2 (Electronics Store):**
```
Active: 45 variants (current models)
Inactive: 15 variants (discontinued models)
Strategy: Deactivate when new model replaces old
```

**Tenant 3 (Sri Lankan Grocery):**
```
Active: 200 variants (always available)
Inactive: 5 variants (temporary shortages)
Strategy: Deactivate only when supplier issues
```

### Sri Lankan Context

**Seasonal Products:**
- Activate: Avurudu sweets during New Year
- Deactivate: After Avurudu season
- Reactivate: Next year same time

**Import-Dependent Products:**
- Deactivate: When import delayed
- Notify: Customers via email/SMS
- Reactivate: When shipment arrives

### Performance Considerations

**Index on is_active:**
- Speeds up active variant queries
- Critical for storefront performance
- Include in composite indexes

**Caching Strategy:**
- Cache active variant list
- Invalidate on activation/deactivation
- Refresh every 5-10 minutes

### Verification Checklist
- [ ] is_active field added
- [ ] Field type is BooleanField
- [ ] Default value is True
- [ ] Help text added
- [ ] Verbose name set
- [ ] Index planned for filtering
- [ ] Business logic understood
- [ ] Admin usage clear
- [ ] Query patterns noted

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Create product_variant.py File | New model file |
| 20 | Define ProductVariant Class | Model class structure |
| 21 | Add product Field | ForeignKey to Product |
| 22 | Add sku Field | sku CharField (unique) |
| 23 | Add barcode Field | barcode CharField (optional) |
| 24 | Add name Field | name CharField (auto-generated) |
| 25 | Add option_values Field | ManyToMany to VariantOptionValue |
| 26 | Add is_active Field | is_active BooleanField |

### ProductVariant Model Progress

Core fields complete:
- **Relationships:** product, option_values
- **Identification:** sku, barcode, name
- **Status:** is_active
- **Through Model:** ProductVariantOption

### Business Value

These fields enable:
- Unique variant identification
- Parent product relationship
- Option combination tracking
- Inventory management
- Sales control (active/inactive)
- POS integration (barcode)

### Next Steps
1. Proceed to [02_Tasks-27-34_Override-Fields-Properties.md](02_Tasks-27-34_Override-Fields-Properties.md) for override fields and properties

---

## Notes for AI Agents

1. **SKU Uniqueness:** Enforce per tenant, critical for inventory
2. **Option Validation:** Prevent duplicate option types per variant
3. **Through Model:** ProductVariantOption maintains option order
4. **Name Generation:** Auto-generate from option values on save
5. **Active Status:** Default True, filter in storefront queries
6. **Barcode Optional:** Not all products need barcodes
7. **Cascading Deletion:** Product deletion removes variants
8. **Multi-Tenant:** All queries filter by tenant automatically
