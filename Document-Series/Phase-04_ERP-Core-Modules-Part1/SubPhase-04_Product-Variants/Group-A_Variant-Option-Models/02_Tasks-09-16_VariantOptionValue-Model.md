# Tasks 09-16: VariantOptionValue Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** A - Variant Option Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_VariantOptionType-Model.md](01_Tasks-01-08_VariantOptionType-Model.md)
- **→ Next Document:** [03_Tasks-17-18_Migration-Testing.md](03_Tasks-17-18_Migration-Testing.md)

---

## Document Overview

This document covers the creation of the VariantOptionValue model, which stores the actual values for each variant option type. For example, if VariantOptionType is "Size", the VariantOptionValue would be "S", "M", "L", "XL".

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Define VariantOptionValue Class | Medium |
| 10 | Add option_type Field | Medium |
| 11 | Add value Field | Low |
| 12 | Add label Field | Low |
| 13 | Add color_code Field | Low |
| 14 | Add image Field | Medium |
| 15 | Add display_order Field | Low |
| 16 | Export VariantOptionValue | Low |

---

## Business Context

### Understanding Variant Option Values

Variant option values are the specific choices available for each option type:

**Example 1: T-Shirt**
- Option Type: **Size**
  - Values: S, M, L, XL, XXL
- Option Type: **Color**
  - Values: Red (#FF0000), Blue (#0000FF), Green (#00FF00)

**Example 2: Laptop**
- Option Type: **RAM**
  - Values: 8GB, 16GB, 32GB, 64GB
- Option Type: **Storage**
  - Values: 256GB SSD, 512GB SSD, 1TB SSD

**Example 3: Rice (Sri Lankan Context)**
- Option Type: **Type**
  - Values: Basmati, Samba, Nadu, Kekulu
- Option Type: **Weight**
  - Values: 1kg, 5kg, 10kg, 25kg (LKR pricing per kg)

### Value vs Label

- **value:** Internal identifier (e.g., "red", "size-m")
- **label:** Display text (e.g., "Red", "Medium")

This separation allows for:
- Consistent internal references
- Flexible display localization
- URL-friendly values

---

## Task 09: Define VariantOptionValue Class

### Overview
Create the VariantOptionValue model class within the same variant_option.py file.

### Dependencies
- Tasks 01-08: VariantOptionType model complete

### Instructions

1. **Define the VariantOptionValue class**
   - Location: `backend/apps/products/models/variant_option.py`
   - Place after VariantOptionType class
   - Inherit from TenantAwareModel

2. **Add class docstring**
   - Explain purpose: "Represents a specific value for a variant option type"
   - Provide examples: S, M, L for Size; Red, Blue for Color
   - Mention relationship to VariantOptionType

3. **Add to __all__ export list**
   - Include VariantOptionValue

4. **Prepare for field definitions**
   - Fields will be added in subsequent tasks

### Model Relationship

```
VariantOptionType (1) -----> (Many) VariantOptionValue
```

**Example:**
- **Type:** Color
  - **Values:** Red, Blue, Green, Yellow, Black, White
- **Type:** Size
  - **Values:** XS, S, M, L, XL, XXL

### Business Examples

**Clothing Store:**

| Option Type | Option Values |
|-------------|---------------|
| Size | XS, S, M, L, XL, XXL, XXXL |
| Color | Red, Blue, Green, Black, White, Navy |
| Material | Cotton (100%), Cotton-Poly (60-40), Polyester (100%) |
| Fit | Slim, Regular, Relaxed, Oversized |

**Electronics Store:**

| Option Type | Option Values |
|-------------|---------------|
| RAM | 4GB, 8GB, 16GB, 32GB, 64GB |
| Storage | 128GB, 256GB, 512GB, 1TB, 2TB |
| Color | Space Gray, Silver, Gold, Rose Gold |
| Screen Size | 13", 14", 15", 16", 17" |

**Sri Lankan Grocery Store:**

| Option Type | Option Values |
|-------------|---------------|
| Weight | 100g, 250g, 500g, 1kg, 5kg |
| Type (Rice) | Basmati, Samba, Nadu, Kekulu, Red Rice |
| Grind Type (Spices) | Whole, Coarse Ground, Fine Powder |
| Origin | Local, Indian, Pakistani, Thai |

### Verification Checklist
- [ ] VariantOptionValue class defined
- [ ] Placed in variant_option.py after VariantOptionType
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring present with examples
- [ ] Added to __all__ list
- [ ] Ready for field additions

---

## Task 10: Add option_type Field

### Overview
Add a ForeignKey field to link each value to its parent VariantOptionType.

### Dependencies
- Task 09: VariantOptionValue class defined
- Tasks 01-08: VariantOptionType model complete

### Instructions

1. **Add option_type field as ForeignKey**
   - Field name: `option_type`
   - Links to: VariantOptionType model
   - on_delete: CASCADE (if type deleted, values deleted)
   - related_name: `values`

2. **Add field help text**
   - "The variant option type this value belongs to"

3. **Add verbose name for admin**
   - verbose_name: "Option Type"

4. **Configure cascading deletion**
   - When VariantOptionType deleted, all its values deleted
   - Protects data integrity

### Field Purpose

The option_type field establishes the parent-child relationship:
- Groups values under their respective types
- Enables efficient querying
- Ensures data consistency

### Relationship Examples

**Size Option Type:**
```
VariantOptionType: Size (id=1)
  └─ VariantOptionValue: S (option_type_id=1)
  └─ VariantOptionValue: M (option_type_id=1)
  └─ VariantOptionValue: L (option_type_id=1)
  └─ VariantOptionValue: XL (option_type_id=1)
```

**Color Option Type:**
```
VariantOptionType: Color (id=2)
  └─ VariantOptionValue: Red (option_type_id=2)
  └─ VariantOptionValue: Blue (option_type_id=2)
  └─ VariantOptionValue: Green (option_type_id=2)
```

### Cascading Deletion Behavior

**Scenario:** Admin deletes "Size" option type

**Result:**
- Size option type deleted
- All size values (S, M, L, XL) automatically deleted
- Product variants referencing these values handle cleanup
- Database integrity maintained

### Query Examples (Conceptual)

**Get all values for Size:**
```
size_type = VariantOptionType.objects.get(slug='size')
size_values = size_type.values.all()
# Returns: S, M, L, XL, XXL
```

**Get option type for a value:**
```
value = VariantOptionValue.objects.get(value='large')
option_type = value.option_type
# Returns: Size
```

### Multi-Tenant Considerations

**Tenant 1 (Fashion Store):**
- Size type → XS, S, M, L, XL, XXL
- Color type → Red, Blue, Black, White

**Tenant 2 (Furniture Store):**
- Size type → Twin, Full, Queen, King
- Color type → Oak, Walnut, Cherry, Mahogany

Each tenant has separate option types and values, but same structure.

### Verification Checklist
- [ ] option_type ForeignKey field added
- [ ] Links to VariantOptionType model
- [ ] on_delete=CASCADE configured
- [ ] related_name='values' set
- [ ] Help text added
- [ ] Verbose name set
- [ ] Cascading behavior understood

---

## Task 11: Add value Field

### Overview
Add a field to store the internal value identifier.

### Dependencies
- Task 10: option_type field exists

### Instructions

1. **Add value field as CharField**
   - Field name: `value`
   - Maximum length: 100 characters
   - Cannot be blank or null

2. **Add field help text**
   - "Internal value identifier (e.g., 's', 'red', '8gb')"

3. **Add verbose name for admin**
   - verbose_name: "Value"

4. **Configure uniqueness**
   - Unique per tenant and option_type
   - Will be enforced in Meta unique_together

### Field Purpose

The value field stores the internal identifier:
- Used in URLs and API queries
- Machine-readable format
- Consistent across languages

### Value Format Recommendations

| Type | Example Values | Format |
|------|----------------|--------|
| **Size** | `xs`, `s`, `m`, `l`, `xl` | Lowercase abbreviation |
| **Color** | `red`, `blue`, `navy-blue` | Lowercase, hyphenated |
| **RAM** | `4gb`, `8gb`, `16gb` | Lowercase with unit |
| **Storage** | `256gb`, `512gb`, `1tb` | Lowercase with unit |
| **Weight** | `1kg`, `5kg`, `10kg` | Number + unit |

### Value vs Label Examples

| Option Type | value | label | Display | URL |
|-------------|-------|-------|---------|-----|
| Size | `m` | "Medium" | Medium | `?size=m` |
| Size | `xl` | "Extra Large" | Extra Large | `?size=xl` |
| Color | `navy-blue` | "Navy Blue" | Navy Blue | `?color=navy-blue` |
| RAM | `16gb` | "16 GB" | 16 GB | `?ram=16gb` |
| Storage | `512gb` | "512GB SSD" | 512GB SSD | `?storage=512gb` |

### Multi-Language Considerations

**Example: Size values in multilingual store**

| value | label (English) | label (Sinhala) | label (Tamil) |
|-------|-----------------|-----------------|---------------|
| `s` | "Small" | "කුඩා" | "சிறிய" |
| `m` | "Medium" | "මධ්‍ය" | "நடுத்தர" |
| `l` | "Large" | "විශාල" | "பெரிய" |

The `value` remains consistent (`s`, `m`, `l`) across all languages, while `label` changes based on locale.

### URL and API Usage

**Product Filtering:**
```
GET /api/v1/products/?size=m&color=red
GET /api/v1/products/tshirt/variants/?size=xl
GET /api/v1/option-values/?option_type=size
```

**Frontend URLs:**
```
https://store.lk/products/tshirt?size=m&color=navy-blue
https://store.lk/laptops/dell-xps?ram=16gb&storage=512gb
```

### Sri Lankan Context Examples

**Rice Product:**
- value: `basmati`, `samba`, `nadu`
- label: "Basmati Rice", "Samba Rice", "Nadu Rice"

**Spice Grind Type:**
- value: `whole`, `coarse`, `fine`
- label (English): "Whole", "Coarse Ground", "Fine Powder"
- label (Sinhala): "සම්පූර්ණ", "රළු අඹරන ලද", "සියුම් කුඩු"

### Verification Checklist
- [ ] value field added as CharField
- [ ] Maximum length set to 100
- [ ] Field is required (non-nullable)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Format guidelines understood
- [ ] Prepared for uniqueness constraint

---

## Task 12: Add label Field

### Overview
Add a field to store the user-facing display label.

### Dependencies
- Task 11: value field exists

### Instructions

1. **Add label field as CharField**
   - Field name: `label`
   - Maximum length: 150 characters
   - Cannot be blank or null

2. **Add field help text**
   - "Display label for this value (e.g., 'Small', 'Red', '8GB RAM')"

3. **Add verbose name for admin**
   - verbose_name: "Display Label"

4. **Add localization support**
   - Field should support multi-language labels
   - Consider using verbose translation fields

### Field Purpose

The label field stores human-readable text:
- Displayed in product pages
- Shown in variant selectors
- Used in cart and checkout
- Supports localization

### Label Best Practices

| Practice | Recommendation | Example |
|----------|----------------|---------|
| **Clarity** | Be descriptive and clear | "Extra Large" not "XL" |
| **Consistency** | Use consistent format | All caps or title case |
| **Context** | Include context if needed | "8 GB RAM" not just "8GB" |
| **Localization** | Support multiple languages | English, Sinhala, Tamil |

### Label Examples by Category

**Clothing Sizes:**

| value | label (Short) | label (Descriptive) |
|-------|---------------|---------------------|
| `xs` | "XS" | "Extra Small" |
| `s` | "S" | "Small" |
| `m` | "M" | "Medium" |
| `l` | "L" | "Large" |
| `xl` | "XL" | "Extra Large" |
| `xxl` | "XXL" | "Extra Extra Large" |

**Colors:**

| value | label | color_code |
|-------|-------|------------|
| `red` | "Red" | #FF0000 |
| `navy-blue` | "Navy Blue" | #000080 |
| `forest-green` | "Forest Green" | #228B22 |

**Electronics:**

| value | label | Description |
|-------|-------|-------------|
| `8gb` | "8 GB" | RAM specification |
| `16gb` | "16 GB" | RAM specification |
| `256gb` | "256 GB SSD" | Storage specification |
| `512gb` | "512 GB SSD" | Storage specification |

**Weight (Sri Lankan Context):**

| value | label (English) | label (Sinhala) | Price Context |
|-------|-----------------|-----------------|---------------|
| `100g` | "100 grams" | "ග්‍රෑම් 100" | Small pack |
| `1kg` | "1 kilogram" | "කිලෝග්‍රෑම් 1" | Standard pack |
| `5kg` | "5 kilograms" | "කිලෝග්‍රෑම් 5" | Family pack |

### Display Context Examples

**Product Page:**
```
Select Size: [S] [M] [L] [XL]
Select Color: 🟥 Red  🟦 Blue  🟩 Green

Selected: Medium, Red
```

**Shopping Cart:**
```
Classic T-Shirt
Size: Medium
Color: Red
Quantity: 2
```

**Order Confirmation:**
```
Product: Classic T-Shirt
Variant: Medium / Red
SKU: TSHIRT-M-RED
```

### Multi-Language Label Examples

**Size Options:**

| value | English | Sinhala | Tamil |
|-------|---------|---------|-------|
| `s` | Small | කුඩා | சிறிய |
| `m` | Medium | මධ්‍ය | நடுத்தர |
| `l` | Large | විශාල | பெரிய |

**Color Options:**

| value | English | Sinhala | Tamil |
|-------|---------|---------|-------|
| `red` | Red | රතු | சிவப்பு |
| `blue` | Blue | නිල් | நீலம் |
| `green` | Green | කොළ | பச்சை |

### Verification Checklist
- [ ] label field added as CharField
- [ ] Maximum length set to 150
- [ ] Field is required (non-nullable)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Localization support considered
- [ ] Display context understood

---

## Task 13: Add color_code Field

### Overview
Add an optional field to store hex color codes for color swatch display.

### Dependencies
- Task 10: option_type field exists

### Instructions

1. **Add color_code field as CharField**
   - Field name: `color_code`
   - Maximum length: 7 characters (for #RRGGBB format)
   - Can be blank and null (optional)

2. **Add field help text**
   - "Hex color code (e.g., #FF0000 for red). Required if option type is color swatch"

3. **Add verbose name for admin**
   - verbose_name: "Color Code"

4. **Add validation**
   - Validate hex format (#RRGGBB)
   - Validate when option_type.is_color_swatch is True

### Field Purpose

The color_code field enables visual color selection:
- Displays actual color swatches in UI
- No need for color name images
- Accurate color representation
- CSS-ready hex codes

### Hex Color Format

**Format:** `#RRGGBB`
- `#` prefix required
- 6 hexadecimal digits (0-9, A-F)
- RR = Red channel (00-FF)
- GG = Green channel (00-FF)
- BB = Blue channel (00-FF)

### Common Color Examples

| Color Name | value | label | color_code |
|------------|-------|-------|------------|
| Red | `red` | "Red" | #FF0000 |
| Blue | `blue` | "Blue" | #0000FF |
| Green | `green` | "Green" | #00FF00 |
| Black | `black` | "Black" | #000000 |
| White | `white` | "White" | #FFFFFF |
| Navy | `navy` | "Navy Blue" | #000080 |
| Crimson | `crimson` | "Crimson Red" | #DC143C |
| Forest Green | `forest-green` | "Forest Green" | #228B22 |
| Sky Blue | `sky-blue` | "Sky Blue" | #87CEEB |
| Gold | `gold` | "Gold" | #FFD700 |

### Advanced Color Examples (Fashion)

| Color Name | label | color_code | Use Case |
|------------|-------|------------|----------|
| Burgundy | "Burgundy" | #800020 | Premium clothing |
| Charcoal | "Charcoal Gray" | #36454F | Professional wear |
| Olive | "Olive Green" | #808000 | Casual wear |
| Coral | "Coral Pink" | #FF7F50 | Summer collection |
| Lavender | "Lavender" | #E6E6FA | Pastel collection |
| Teal | "Teal" | #008080 | Accessories |

### UI Rendering

**HTML/CSS Example (Conceptual):**
```html
<div class="color-swatch" style="background-color: #FF0000;">
  <span>Red</span>
</div>
```

**User Interface:**
```
Select Color:
🟥 Red    🟦 Blue    🟩 Green    ⬛ Black
(Clickable colored squares)
```

### Validation Rules

| Rule | Validation |
|------|------------|
| **Format** | Must match `^#[0-9A-Fa-f]{6}$` regex |
| **Required When** | option_type.is_color_swatch = True |
| **Optional When** | option_type.is_color_swatch = False |
| **Example Valid** | #FF0000, #00FF00, #0000FF |
| **Example Invalid** | FF0000 (missing #), #FFF (too short), #GGGGGG (invalid hex) |

### Business Logic

**When option_type.is_color_swatch = True:**
- color_code field is REQUIRED
- Frontend displays color swatches
- User clicks color directly

**When option_type.is_color_swatch = False:**
- color_code field is OPTIONAL (usually null)
- Frontend displays text/dropdown
- User selects from list

### Sri Lankan Context

**Traditional Clothing Colors:**

| Color | Sinhala Name | color_code |
|-------|--------------|------------|
| Red | රතු | #FF0000 |
| Blue | නිල් | #0000FF |
| Yellow | කහ | #FFFF00 |
| White | සුදු | #FFFFFF |
| Maroon | මැරුන් | #800000 |

### Verification Checklist
- [ ] color_code field added as CharField
- [ ] Maximum length set to 7
- [ ] Field is optional (blank=True, null=True)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Hex format validation planned
- [ ] Conditional requirement understood

---

## Task 14: Add image Field

### Overview
Add an optional field to store swatch images for visual option selection.

### Dependencies
- Task 10: option_type field exists

### Instructions

1. **Add image field as CloudinaryField**
   - Field name: `image`
   - Upload folder: 'variant_option_swatches/'
   - Can be blank and null (optional)
   - Transformation: thumbnail (100x100)

2. **Add field help text**
   - "Swatch image for visual selection. Required if option type uses image swatches"

3. **Add verbose name for admin**
   - verbose_name: "Swatch Image"

4. **Add validation**
   - Validate when option_type.is_image_swatch is True
   - Validate image dimensions and file size

### Field Purpose

The image field enables visual pattern/texture selection:
- Show actual fabric patterns
- Display material textures
- Present design options
- Better user understanding

### Image Swatch Use Cases

| Option Type | Example Values | Image Shows |
|-------------|----------------|-------------|
| **Pattern** | Striped, Checkered, Floral | Actual pattern design |
| **Material** | Cotton, Denim, Leather | Material texture |
| **Wood Type** | Oak, Walnut, Mahogany | Wood grain pattern |
| **Fabric** | Silk, Velvet, Linen | Fabric texture close-up |
| **Design** | Traditional, Modern, Abstract | Design preview |

### Image Specifications

| Specification | Recommendation | Reason |
|---------------|----------------|--------|
| **Dimensions** | 100x100px or 150x150px | Fast loading, sufficient detail |
| **File Format** | WebP or JPEG | Optimal compression |
| **File Size** | < 50KB | Page performance |
| **Aspect Ratio** | 1:1 (square) | Consistent grid layout |
| **Background** | White or transparent | Professional appearance |

### Cloudinary Configuration

**Upload Folder Structure:**
```
variant_option_swatches/
  ├── tenant_1/
  │   ├── patterns/
  │   ├── materials/
  │   └── designs/
  ├── tenant_2/
  │   ├── patterns/
  │   └── wood-types/
```

**Transformations:**
- Resize to 100x100
- Format: auto (WebP when supported)
- Quality: auto
- Crop: fill

### Business Examples

**Fabric Store:**

| Option Type | value | label | image |
|-------------|-------|-------|-------|
| Pattern | `floral-001` | "Floral Garden" | floral_garden_100x100.webp |
| Pattern | `geometric-001` | "Geometric Lines" | geometric_lines_100x100.webp |
| Pattern | `abstract-001` | "Abstract Waves" | abstract_waves_100x100.webp |

**Flooring Store:**

| Option Type | value | label | image |
|-------------|-------|-------|-------|
| Tile Pattern | `marble-white` | "White Marble" | marble_white_swatch.jpg |
| Tile Pattern | `wood-oak` | "Oak Wood Effect" | wood_oak_swatch.jpg |
| Tile Pattern | `geometric-hex` | "Hexagonal Pattern" | hex_pattern_swatch.jpg |

**Sri Lankan Sarong Store:**

| Option Type | value | label | image |
|-------------|-------|-------|-------|
| Design | `traditional-001` | "Traditional Floral" | traditional_floral.jpg |
| Design | `batik-001` | "Batik Pattern" | batik_pattern.jpg |
| Design | `modern-001` | "Modern Geometric" | modern_geometric.jpg |

### UI Rendering

**Frontend Display (Conceptual):**
```
Select Pattern:

┌─────────┐ ┌─────────┐ ┌─────────┐
│ [IMAGE] │ │ [IMAGE] │ │ [IMAGE] │
│  Floral │ │Geometric│ │ Abstract│
└─────────┘ └─────────┘ └─────────┘
```

**HTML Structure (Conceptual):**
```html
<div class="image-swatch">
  <img src="floral_garden_100x100.webp" alt="Floral Garden">
  <span>Floral Garden</span>
</div>
```

### Validation Rules

| Rule | Validation |
|------|------------|
| **Required When** | option_type.is_image_swatch = True |
| **Optional When** | option_type.is_image_swatch = False |
| **File Types** | JPEG, PNG, WebP |
| **Max File Size** | 200KB |
| **Min Dimensions** | 50x50px |
| **Max Dimensions** | 500x500px |

### Business Logic

**When option_type.is_image_swatch = True:**
- image field is REQUIRED
- Frontend displays image grid
- User clicks image to select

**When option_type.is_image_swatch = False:**
- image field is OPTIONAL (usually null)
- Frontend displays text/dropdown
- No image loading

### Multi-Tenant Considerations

**Tenant 1 (Fashion Store):**
- Pattern images: Floral, Striped, Solid
- Material images: Cotton texture, Denim texture

**Tenant 2 (Furniture Store):**
- Wood grain images: Oak, Walnut, Cherry
- Fabric texture images: Leather, Velvet, Linen

Each tenant uploads their own images, stored in tenant-specific folders.

### Verification Checklist
- [ ] image field added as CloudinaryField
- [ ] Upload folder configured
- [ ] Field is optional (blank=True, null=True)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Image specifications understood
- [ ] Transformations configured
- [ ] Conditional requirement understood

---

## Task 15: Add display_order Field

### Overview
Add a field to control the display order of option values within their type.

### Dependencies
- Task 09: VariantOptionValue class defined

### Instructions

1. **Add display_order field as PositiveIntegerField**
   - Field name: `display_order`
   - Default value: 0

2. **Add field help text**
   - "Order in which this value appears (lower numbers first)"

3. **Add verbose name for admin**
   - verbose_name: "Display Order"

4. **Configure default ordering**
   - Will be used in Meta class ordering

### Field Purpose

The display_order field ensures consistent presentation:
- Sizes appear in logical order (XS, S, M, L, XL)
- Colors follow rainbow or brand order
- Values sorted meaningfully

### Display Order Best Practices

**Size Ordering (Clothing):**

| value | label | display_order | Display Position |
|-------|-------|---------------|------------------|
| `xs` | "Extra Small" | 0 | First |
| `s` | "Small" | 10 | Second |
| `m` | "Medium" | 20 | Third |
| `l` | "Large" | 30 | Fourth |
| `xl` | "Extra Large" | 40 | Fifth |
| `xxl` | "Extra Extra Large" | 50 | Sixth |

**Color Ordering (Rainbow):**

| value | label | display_order | Display Position |
|-------|-------|---------------|------------------|
| `red` | "Red" | 0 | First |
| `orange` | "Orange" | 10 | Second |
| `yellow` | "Yellow" | 20 | Third |
| `green` | "Green" | 30 | Fourth |
| `blue` | "Blue" | 40 | Fifth |
| `purple` | "Purple" | 50 | Sixth |
| `black` | "Black" | 60 | Last (neutral) |
| `white` | "White" | 70 | Last (neutral) |

**RAM Ordering (Ascending):**

| value | label | display_order |
|-------|-------|---------------|
| `4gb` | "4 GB" | 0 |
| `8gb` | "8 GB" | 10 |
| `16gb` | "16 GB" | 20 |
| `32gb` | "32 GB" | 30 |
| `64gb` | "64 GB" | 40 |

**Weight Ordering (Sri Lankan Grocery):**

| value | label | display_order | Price Point |
|-------|-------|---------------|-------------|
| `100g` | "100 grams" | 0 | Small pack |
| `250g` | "250 grams" | 10 | Medium pack |
| `500g` | "500 grams" | 20 | Standard pack |
| `1kg` | "1 kilogram" | 30 | Family pack |
| `5kg` | "5 kilograms" | 40 | Bulk pack |

### Business Logic Examples

**Scenario 1: New size added**
- Existing: XS(0), S(10), M(20), L(30), XL(40)
- Add: XXL with display_order=50
- Result: Automatically appears at the end

**Scenario 2: Reorder colors to match brand guidelines**
- Brand colors first: Navy(0), White(10), Red(20)
- Standard colors after: Blue(30), Green(40), Yellow(50)
- Neutral colors last: Black(60), Gray(70)

**Scenario 3: Seasonal color promotion**
- Temporarily change display_order
- Featured color: Summer Blue (display_order=5)
- Appears before regular colors
- Reset after promotion

### UI Impact

**Without display_order:**
```
Sizes: M, XL, S, L, XXL, XS (Random database order)
Colors: Green, Black, Red, Blue, Yellow (Confusing)
```

**With display_order:**
```
Sizes: XS, S, M, L, XL, XXL (Logical progression)
Colors: Red, Orange, Yellow, Green, Blue, Purple (Rainbow order)
```

### Multi-Tenant Custom Ordering

**Tenant 1 (Fashion Store) - Brand Color Priority:**
- Navy Blue (0) - Brand primary
- White (10) - Brand secondary
- Red (20) - Brand accent
- Other colors (30+) - Standard options

**Tenant 2 (Electronics) - Popularity Order:**
- Silver (0) - Most popular
- Space Gray (10) - Second most popular
- Gold (20) - Luxury option
- Other colors (30+) - Less common

### Verification Checklist
- [ ] display_order field added
- [ ] Field type is PositiveIntegerField
- [ ] Default value set to 0
- [ ] Help text added
- [ ] Verbose name set
- [ ] Ordering logic understood
- [ ] Business use cases clear

---

## Task 16: Export VariantOptionValue

### Overview
Complete the VariantOptionValue model with Meta class, methods, and export it.

### Dependencies
- Tasks 09-15: All VariantOptionValue fields added

### Instructions

1. **Add Meta class to VariantOptionValue**
   - Define verbose names (singular and plural)
   - Set default ordering by option_type and display_order
   - Add unique_together constraint for tenant + option_type + value
   - Set indexes for performance

2. **Add __str__ method**
   - Return format: "OptionType: Value" (e.g., "Size: Medium")
   - Provides readable string representation

3. **Add save method override**
   - Auto-populate label from value if label is empty
   - Use title case transformation

4. **Add validation method (clean)**
   - Validate color_code format if provided
   - Require color_code if option_type.is_color_swatch
   - Require image if option_type.is_image_swatch
   - Raise ValidationError for violations

5. **Add property methods**
   - get_display_html: Return HTML for swatch rendering
   - is_color_swatch: Property returning option_type.is_color_swatch
   - is_image_swatch: Property returning option_type.is_image_swatch

6. **Update models/__init__.py**
   - Import VariantOptionValue from variant_option
   - Add to __all__ list

### Meta Class Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **verbose_name** | "Variant Option Value" | Admin display (singular) |
| **verbose_name_plural** | "Variant Option Values" | Admin display (plural) |
| **ordering** | ['option_type', 'display_order', 'value'] | Default query ordering |
| **unique_together** | [['tenant', 'option_type', 'value']] | Prevent duplicates per tenant |
| **indexes** | tenant + option_type, tenant + value | Query performance |

### String Representation

The `__str__` method format:
- Simple: `"Size: Medium"`
- With color: `"Color: Red (#FF0000)"`
- With image: `"Pattern: Floral (image)"`

**Examples:**

| option_type | value | label | __str__ Output |
|-------------|-------|-------|----------------|
| Size | `m` | "Medium" | "Size: Medium" |
| Color | `red` | "Red" | "Color: Red" |
| RAM | `16gb` | "16 GB" | "RAM: 16 GB" |

### Validation Rules

**Color Code Validation:**
```
IF color_code is provided:
  - Must match pattern: ^#[0-9A-Fa-f]{6}$
  - Examples valid: #FF0000, #00ff00, #0000FF
  - Examples invalid: FF0000, #FFF, #GGGGGG

IF option_type.is_color_swatch is True:
  - color_code is REQUIRED
  - Cannot be null or empty
```

**Image Validation:**
```
IF option_type.is_image_swatch is True:
  - image is REQUIRED
  - Cannot be null
  - Must be valid image file
```

### Property Methods

**get_display_html Property:**

Purpose: Return HTML for frontend rendering

Examples (Conceptual):
- Color swatch: `<div style="background: #FF0000;">Red</div>`
- Image swatch: `<img src="url" alt="Floral">`
- Text: `<span>Medium</span>`

**is_color_swatch Property:**
```
Return: option_type.is_color_swatch
Usage: Quick check in templates/serializers
```

**is_image_swatch Property:**
```
Return: option_type.is_image_swatch
Usage: Quick check in templates/serializers
```

### Auto-Label Generation

**Logic:**
If label is empty on save, generate from value:
- Convert underscores/hyphens to spaces
- Apply title case
- Example: `navy-blue` → `Navy Blue`

**Examples:**

| value | Auto-generated label |
|-------|---------------------|
| `m` | "M" |
| `extra-large` | "Extra Large" |
| `navy-blue` | "Navy Blue" |
| `8gb` | "8GB" |

### Model Relationships Summary

```
Tenant (1) ──┐
             ├──→ VariantOptionType (Many)
             │         │
             │         └──→ VariantOptionValue (Many)
             │
             └──→ Product (Many)
                      │
                      └──→ ProductVariant (Many)
                                 │
                                 └──→ VariantOptionValue (Many-to-Many)
```

### Expected Model Structure

After completion, VariantOptionValue should have:

| Component | Purpose |
|-----------|---------|
| **Fields** | option_type, value, label, color_code, image, display_order |
| **Methods** | __str__, save, clean, get_display_html |
| **Properties** | is_color_swatch, is_image_swatch |
| **Meta** | ordering, unique constraints, indexes |
| **Inheritance** | TenantAwareModel (tenant, created_at, updated_at) |

### Verification Checklist
- [ ] Meta class added with verbose names
- [ ] Default ordering configured
- [ ] unique_together constraints added
- [ ] Indexes added for performance
- [ ] __str__ method returns formatted string
- [ ] save method auto-generates label
- [ ] clean method validates color_code and image
- [ ] Property methods added
- [ ] Model exported in __init__.py
- [ ] No migration errors when created
- [ ] Admin displays correctly

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Define VariantOptionValue Class | Model class structure |
| 10 | Add option_type Field | ForeignKey to VariantOptionType |
| 11 | Add value Field | value CharField |
| 12 | Add label Field | label CharField |
| 13 | Add color_code Field | color_code CharField (optional) |
| 14 | Add image Field | image CloudinaryField (optional) |
| 15 | Add display_order Field | display_order PositiveIntegerField |
| 16 | Export VariantOptionValue | Meta, methods, properties, export |

### VariantOptionValue Model Complete

The VariantOptionValue model is now complete with:
- **Core fields:** option_type, value, label, display_order
- **Display fields:** color_code, image
- **Relationships:** ForeignKey to VariantOptionType
- **Validation:** Conditional requirements for color/image
- **Auto-generation:** Label from value
- **Properties:** Quick access to swatch types

### Business Value

This model enables:
- Flexible value definitions per option type
- Rich visual selection (colors and images)
- Consistent ordering and display
- Multi-language label support
- Tenant-specific value sets

### Next Steps
1. Proceed to [03_Tasks-17-18_Migration-Testing.md](03_Tasks-17-18_Migration-Testing.md) to create migrations and tests

---

## Notes for AI Agents

1. **Conditional Validation:** color_code required only when is_color_swatch=True
2. **Image Optimization:** Use Cloudinary transformations for performance
3. **Auto-Label:** Generate label from value for convenience
4. **Ordering:** Always order by option_type, then display_order
5. **Uniqueness:** Enforce tenant + option_type + value uniqueness
6. **Properties:** Use properties for clean template/serializer code
7. **Hex Validation:** Regex pattern `^#[0-9A-Fa-f]{6}$`
8. **Testing:** Test all validation rules thoroughly
