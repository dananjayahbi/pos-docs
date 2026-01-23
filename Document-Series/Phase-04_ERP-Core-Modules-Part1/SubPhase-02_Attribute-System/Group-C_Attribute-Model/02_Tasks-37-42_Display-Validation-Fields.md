# Tasks 37-42: Display & Validation Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** C - Attribute Model  
> **Document:** 02 of 03  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-36_Attribute-Model-Basic-Fields.md](01_Tasks-29-36_Attribute-Model-Basic-Fields.md)
- **→ Next Document:** [03_Tasks-43-48_Category-Assignment-Export.md](03_Tasks-43-48_Category-Assignment-Export.md)

---

## Document Overview

This document covers adding display and validation fields to the Attribute model. These fields control how attributes appear in the UI and define validation rules for different attribute types.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 37 | Add is_filterable Field | Low |
| 38 | Add is_searchable Field | Low |
| 39 | Add is_comparable Field | Low |
| 40 | Add is_visible_on_product Field | Low |
| 41 | Add display_order Field | Low |
| 42 | Add validation_regex Field | Medium |

---

## Task 37: Add is_filterable Field

### Overview
Add a boolean field to mark attributes that should be available as filters in the webstore faceted search.

### Dependencies
- Task 36: Add is_required Field

### Instructions

1. **Add is_filterable field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: False
   - Verbose name: "Is Filterable"

2. **Configure field properties**
   - Set db_index=True for efficient filtering queries
   - Add help text explaining webstore usage
   - Default to False (explicit opt-in)

3. **Document filterable behavior**
   - Filterable attributes appear in webstore sidebar
   - Used for faceted search/filtering
   - Common for attributes like Color, Size, Brand
   - Generates filter widgets in frontend

4. **Consider performance implications**
   - Too many filterable attributes can clutter UI
   - Select most important differentiators
   - Usually 5-10 filters per category

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | False | Explicit opt-in |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | True | Frequently filtered |

### Filterable vs Non-Filterable

| Filterable Attributes | Non-Filterable Attributes |
|----------------------|---------------------------|
| Color, Size, Brand | SKU, Barcode |
| Price Range | Description |
| Material | Model Number |
| Storage Capacity | Manufacturer Part Number |
| Screen Size | Internal Notes |
| RAM | Warehouse Location |

### Webstore Filter Examples

**Electronics Category:**
- Brand (Apple, Samsung, LG)
- Price Range (0-50k, 50-100k, 100k+)
- Screen Size (5-6", 6-6.5", 6.5"+)
- Storage (64GB, 128GB, 256GB)
- RAM (4GB, 8GB, 16GB)

**Clothing Category:**
- Size (XS, S, M, L, XL)
- Color (Red, Blue, Green, Black)
- Material (Cotton, Polyester, Silk)
- Brand (Nike, Adidas, Puma)
- Price Range

**Food Category:**
- Brand
- Weight Range
- Organic (Yes/No)
- Allergen-Free
- Price Range

### Filter Widget Types by Attribute Type

| Attribute Type | Filter Widget |
|----------------|---------------|
| **SELECT** | Checkbox list or dropdown |
| **MULTISELECT** | Checkbox list |
| **NUMBER** | Range slider or min/max inputs |
| **BOOLEAN** | Single checkbox |
| **TEXT** | Usually not filterable |
| **DATE** | Date range picker |

### API Filter Usage

```
GET /api/products/?color=red&size=large&brand=nike&price_min=5000&price_max=15000
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    is_filterable = models.BooleanField(
        default=False,
        help_text="Include in webstore faceted search filters"
    )
```

### Verification Checklist
- [ ] is_filterable field added
- [ ] BooleanField type
- [ ] default=False set
- [ ] help_text provided
- [ ] db_index configured

---

## Task 38: Add is_searchable Field

### Overview
Add a boolean field to mark attributes that should be indexed for full-text search.

### Dependencies
- Task 37: Add is_filterable Field

### Instructions

1. **Add is_searchable field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: False
   - Verbose name: "Is Searchable"

2. **Configure field properties**
   - Set db_index=True for search optimization
   - Add help text explaining search indexing
   - Default to False (explicit opt-in)

3. **Document searchable behavior**
   - Searchable attributes indexed for full-text search
   - Values included in search queries
   - Improves product discoverability
   - Common for Brand, Model, Features

4. **Consider search integration**
   - PostgreSQL full-text search
   - Elasticsearch integration (future)
   - Search weight/boost configuration
   - Multi-language search support

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | False | Explicit opt-in |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | True | Search optimization |

### Searchable vs Non-Searchable

| Searchable Attributes | Non-Searchable Attributes |
|----------------------|---------------------------|
| Brand | Price |
| Model Number | Weight |
| Product Features | Dimensions |
| Material | Display Order |
| Description | SKU (maybe searchable) |
| Tags | Created Date |

### Search Use Cases

**Text Attributes:**
- Brand: "Samsung", "Apple", "LG"
- Model: "Galaxy S21", "iPhone 14"
- Material: "Cotton", "Leather"
- Description: Product description text

**Select/Multiselect:**
- Color names: "Midnight Blue", "Space Gray"
- Features: "WiFi 6", "5G", "Wireless Charging"
- Tags: "New Arrival", "Bestseller", "Eco-Friendly"

**Boolean:**
- Usually not searchable
- But could search "Wireless" to find wireless=true

### Search Query Examples

```
Search: "samsung 5g"
Matches products with:
- Brand: Samsung
- Features: 5G

Search: "leather wallet"
Matches products with:
- Material: Leather
- Product Type: Wallet

Search: "wireless bluetooth headphones"
Matches products with:
- Features: Wireless, Bluetooth
- Category: Headphones
```

### PostgreSQL Full-Text Search

```python
# In search implementation
from django.contrib.postgres.search import SearchVector

# Build search vector from searchable attributes
search_vector = SearchVector('name', weight='A')
for attr in category.attributes.filter(is_searchable=True):
    search_vector += SearchVector(f'attributes__{attr.slug}', weight='B')
```

### Multi-Language Search (Sri Lankan Context)

**English + Sinhala:**
- Search "Samsung" or "සැම්සන්"
- Search "Wireless" or "රැහැන් රහිත"

**Search Optimization:**
- Stemming for English
- Sinhala text indexing
- Singlish (romanized Sinhala) support

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    is_searchable = models.BooleanField(
        default=False,
        help_text="Include attribute values in search indexing"
    )
```

### Verification Checklist
- [ ] is_searchable field added
- [ ] BooleanField type
- [ ] default=False set
- [ ] help_text provided
- [ ] db_index configured

---

## Task 39: Add is_comparable Field

### Overview
Add a boolean field to mark attributes that should appear in product comparison tables.

### Dependencies
- Task 38: Add is_searchable Field

### Instructions

1. **Add is_comparable field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: False
   - Verbose name: "Is Comparable"

2. **Configure field properties**
   - Add help_text explaining comparison feature
   - Default to False (explicit selection)
   - No db_index needed (not frequently queried alone)

3. **Document comparable behavior**
   - Comparable attributes shown in product comparison tables
   - Users can compare multiple products side-by-side
   - Important for purchase decisions
   - Usually spec-focused attributes

4. **Consider comparison UI**
   - Comparison table rows
   - Side-by-side product cards
   - Highlight differences
   - Focus on key differentiators

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | False | Explicit opt-in |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | False | Not frequently filtered alone |

### Comparable vs Non-Comparable

| Comparable Attributes | Non-Comparable Attributes |
|----------------------|---------------------------|
| Processor | SKU |
| RAM | Barcode |
| Storage | Warehouse Location |
| Screen Size | Supplier |
| Battery Capacity | Internal Notes |
| Weight | Slug |
| Price | Created Date |
| Warranty Period | Display Order |

### Comparison Table Example

**Electronics (Smartphones):**

| Attribute | Product A | Product B | Product C |
|-----------|-----------|-----------|-----------|
| Brand | Samsung | Apple | OnePlus |
| Model | Galaxy S23 | iPhone 14 | 11 Pro |
| Price | 125,000 LKR | 145,000 LKR | 95,000 LKR |
| Screen | 6.1" AMOLED | 6.1" Super Retina | 6.7" Fluid AMOLED |
| Processor | Snapdragon 8 Gen 2 | A15 Bionic | Snapdragon 8 Gen 1 |
| RAM | 8 GB | 6 GB | 12 GB |
| Storage | 256 GB | 128 GB | 256 GB |
| Battery | 3,900 mAh | 3,279 mAh | 5,000 mAh |
| Camera | 50 MP + 12 MP + 10 MP | 12 MP + 12 MP | 50 MP + 48 MP + 8 MP |
| Weight | 168 g | 172 g | 201 g |
| 5G | Yes | Yes | Yes |
| Warranty | 1 Year | 1 Year | 1 Year |

### Comparison UI Behavior

**Highlighting Differences:**
- Best value (green): Lowest price, highest specs
- Highlight differences between products
- Show which product leads in each category
- Help users make informed decisions

**Mobile-Responsive:**
- Horizontal scroll on mobile
- Sticky first column (attribute names)
- Collapsible rows for details

### API Endpoint

```
GET /api/products/compare/?ids=123,456,789
Returns: Products with comparable attributes only

GET /api/categories/{id}/comparable-attributes/
Returns: List of comparable attributes for category
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    is_comparable = models.BooleanField(
        default=False,
        help_text="Show in product comparison tables"
    )
```

### Verification Checklist
- [ ] is_comparable field added
- [ ] BooleanField type
- [ ] default=False set
- [ ] help_text provided
- [ ] No db_index (not needed)

---

## Task 40: Add is_visible_on_product Field

### Overview
Add a boolean field to control whether the attribute is displayed on product detail pages.

### Dependencies
- Task 39: Add is_comparable Field

### Instructions

1. **Add is_visible_on_product field**
   - Type: BooleanField
   - Required: Yes with default value
   - Default: True (visible by default)
   - Verbose name: "Visible on Product Page"

2. **Configure field properties**
   - Add help_text explaining product page display
   - Default to True (most attributes visible)
   - No db_index needed

3. **Document visibility behavior**
   - Controls display on product detail pages
   - Hidden attributes still stored and searchable
   - Useful for internal/administrative attributes
   - Can hide technical IDs, internal codes

4. **Consider use cases**
   - Show: Brand, Color, Size, Features, Specs
   - Hide: SKU, Warehouse Location, Internal ID
   - Conditional visibility based on user role

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | True | Most attributes visible |
| **blank** | False | Required field |
| **null** | False | Always has value |
| **db_index** | False | Not frequently filtered alone |

### Visible vs Hidden Attributes

| Visible Attributes | Hidden Attributes |
|-------------------|-------------------|
| Brand | Internal SKU |
| Model | Warehouse Location |
| Color | Supplier Code |
| Size | Cost Price |
| Features | Purchase Order Number |
| Specifications | Last Inventory Date |
| Warranty | Accounting Code |
| Price | Admin Notes |

### Product Page Display Example

**Visible Specifications:**
```
Technical Specifications:
- Brand: Samsung
- Model: Galaxy S23
- Screen Size: 6.1 inches
- Processor: Snapdragon 8 Gen 2
- RAM: 8 GB
- Storage: 256 GB
- Battery: 3,900 mAh
- Color: Phantom Black
- Weight: 168 g
- 5G Supported: Yes
- Warranty: 1 Year Local Warranty
```

**Hidden (Not Displayed):**
- SKU: SAMGS23-256-BLK-LK
- Supplier Code: SAM-2023-001
- Warehouse Location: A-12-03
- Cost Price: 95,000 LKR
- Last Received: 2026-01-15

### Conditional Visibility

**Public Users:**
- See all visible attributes
- Cannot see hidden attributes

**Admin Users:**
- See all attributes (visible + hidden)
- Can toggle visibility
- Can view internal attributes

### API Response

```json
{
  "id": "product-123",
  "name": "Samsung Galaxy S23",
  "attributes": {
    "brand": "Samsung",
    "color": "Phantom Black",
    "storage": "256 GB"
    // Only visible attributes
  },
  "admin_attributes": {
    "sku": "SAMGS23-256-BLK-LK",
    "warehouse": "A-12-03"
    // Hidden attributes (admin only)
  }
}
```

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    is_visible_on_product = models.BooleanField(
        default=True,
        help_text="Display this attribute on product detail pages"
    )
```

### Verification Checklist
- [ ] is_visible_on_product field added
- [ ] BooleanField type
- [ ] default=True set
- [ ] help_text provided
- [ ] No db_index needed

---

## Task 41: Add display_order Field

### Overview
Add a display_order field to control the sort order of attributes within their group or on product pages.

### Dependencies
- Task 40: Add is_visible_on_product Field

### Instructions

1. **Add display_order field**
   - Type: PositiveIntegerField
   - Required: Yes with default value
   - Default: 0
   - Verbose name: "Display Order"

2. **Configure ordering behavior**
   - Lower numbers appear first
   - Same numbers sort alphabetically by name
   - Add db_index for efficient sorting

3. **Document ordering strategy**
   - 0-9: Critical attributes (Brand, Model, Price)
   - 10-49: Important specifications
   - 50-99: Standard attributes
   - 100+: Less important details

4. **Interaction with group ordering**
   - Groups ordered by AttributeGroup.display_order
   - Within group, attributes ordered by Attribute.display_order
   - Two-level hierarchical ordering

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **default** | 0 | Default ordering |
| **blank** | False | Always has value |
| **null** | False | Required field |
| **db_index** | True | Frequent ordering |

### Display Order Strategy

| Order Range | Priority | Example Attributes |
|-------------|----------|-------------------|
| **0-9** | Critical | Brand, Model, Price |
| **10-29** | High | Key Specifications |
| **30-49** | Medium | Additional Specs |
| **50-69** | Standard | Features |
| **70-99** | Low | Supplemental Info |
| **100+** | Extra | Optional Details |

### Hierarchical Ordering Example

**Group: Technical Specifications (display_order=10)**
1. (Order 0) Processor
2. (Order 5) RAM
3. (Order 10) Storage
4. (Order 15) Graphics Card
5. (Order 20) Operating System

**Group: Display (display_order=20)**
1. (Order 0) Screen Size
2. (Order 5) Resolution
3. (Order 10) Refresh Rate
4. (Order 15) Panel Type

**Group: Connectivity (display_order=30)**
1. (Order 0) WiFi
2. (Order 5) Bluetooth
3. (Order 10) 5G
4. (Order 15) NFC
5. (Order 20) USB Ports

### QuerySet Ordering

```python
# Attributes ordered by group, then by attribute display_order
Attribute.objects.filter(
    categories=category
).select_related('group').order_by(
    'group__display_order',
    'display_order',
    'name'
)
```

### Product Page Display

Attributes rendered in order:
1. Sort groups by AttributeGroup.display_order
2. Within each group, sort attributes by Attribute.display_order
3. Attributes with same order sort alphabetically

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in which attribute is displayed (lower first)"
    )
```

### Verification Checklist
- [ ] display_order field added
- [ ] PositiveIntegerField type
- [ ] default=0 set
- [ ] help_text provided
- [ ] db_index configured

---

## Task 42: Add validation_regex Field

### Overview
Add an optional validation_regex field for TEXT type attributes to enforce pattern-based validation.

### Dependencies
- Task 41: Add display_order Field

### Instructions

1. **Add validation_regex field**
   - Type: CharField
   - Max length: 255 characters
   - Required: No (blank=True, null=True)
   - Verbose name: "Validation Regex"

2. **Configure field properties**
   - Optional field (only used for TEXT type)
   - Add help text with examples
   - Store as raw regex pattern string

3. **Document regex validation**
   - Applied to TEXT type attributes only
   - Validates product attribute values
   - Enforced in serializers/forms
   - Examples: Email, Phone, URL, SKU patterns

4. **Consider validation implementation**
   - Python re.match() for validation
   - Provide user-friendly error messages
   - Test regex patterns before saving
   - Document common patterns in admin

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| **max_length** | 255 | Accommodate complex patterns |
| **blank** | True | Optional (type-specific) |
| **null** | True | Allow NULL |
| **db_index** | False | Not searched |

### Common Regex Patterns

| Purpose | Regex Pattern | Example |
|---------|---------------|---------|
| **Email** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | user@example.com |
| **Sri Lankan Mobile** | `^(\+94\|0)?7[0-9]{8}$` | +94712345678 |
| **URL** | `^https?://[^\s]+$` | https://example.com |
| **SKU Format** | `^[A-Z]{3}-[0-9]{6}$` | ABC-123456 |
| **ISBN** | `^(97[89])?\d{9}[\dX]$` | 9780123456789 |
| **Color Hex** | `^#[0-9A-Fa-f]{6}$` | #FF0000 |
| **LKR Amount** | `^\d{1,3}(,\d{3})*(\.\d{2})?$` | 125,000.00 |

### Validation Usage Examples

**Brand Name (Letters and Spaces):**
```
Pattern: ^[A-Za-z\s]+$
Valid: "Samsung", "Apple Inc"
Invalid: "Samsung123", "Apple_Inc"
```

**Model Number (Alphanumeric with Hyphens):**
```
Pattern: ^[A-Z0-9-]+$
Valid: "SM-G990", "IPHONE-14-PRO"
Invalid: "sm-g990", "iPhone 14 Pro"
```

**Email Address:**
```
Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
Valid: "contact@example.com"
Invalid: "contact@", "@example.com"
```

**Sri Lankan Phone Number:**
```
Pattern: ^(\+94|0)?7[0-9]{8}$
Valid: "+94712345678", "0712345678", "712345678"
Invalid: "812345678", "+95712345678"
```

### Validation Implementation

```python
# In serializer or validator
import re

def validate_text_attribute(attribute, value):
    if attribute.validation_regex:
        pattern = re.compile(attribute.validation_regex)
        if not pattern.match(value):
            raise ValidationError(
                f"{attribute.name} format is invalid. "
                f"Expected pattern: {attribute.validation_regex}"
            )
```

### Admin Interface

**Regex Pattern Help:**
- Common patterns dropdown
- Pattern tester
- Example values
- Error message preview

**Pattern Library:**
```
- Email Address
- Phone Number (Sri Lanka)
- URL
- SKU Format
- Product Code
- Serial Number
- Color Hex Code
```

### Sri Lankan Context Patterns

**Mobile Numbers:**
- `^(\+94|0)?7[0-9]{8}$` - All mobile operators
- `^(\+94|0)?7[12][0-9]{7}$` - Dialog, Mobitel
- `^(\+94|0)?7[78][0-9]{7}$` - Hutch, Airtel

**Landline Numbers:**
- `^(\+94|0)?[1-9][0-9]{8}$` - General format
- `^(\+94|0)?11[0-9]{7}$` - Colombo area

**NIC Format:**
- `^[0-9]{9}[VvXx]$` - Old format: 123456789V
- `^[0-9]{12}$` - New format: 200012345678

### Expected Outcome
```python
class Attribute(BaseModel):
    # ... previous fields ...
    validation_regex = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Regex pattern for validating TEXT attributes (e.g., '^[A-Z0-9-]+$')"
    )
```

### Verification Checklist
- [ ] validation_regex field added
- [ ] CharField with max_length=255
- [ ] blank=True and null=True
- [ ] help_text with example
- [ ] No db_index (not searched)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 37 | Add is_filterable Field | Webstore filter flag |
| 38 | Add is_searchable Field | Search indexing flag |
| 39 | Add is_comparable Field | Comparison table flag |
| 40 | Add is_visible_on_product Field | Product page visibility |
| 41 | Add display_order Field | Custom sort order |
| 42 | Add validation_regex Field | TEXT validation pattern |

### Attribute Model Structure (Updated)
```python
class Attribute(BaseModel):
    # Basic fields (from previous document)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True)
    group = models.ForeignKey(AttributeGroup, ...)
    attribute_type = models.CharField(max_length=20, choices=ATTRIBUTE_TYPES)
    unit = models.CharField(max_length=20, blank=True, null=True)
    is_required = models.BooleanField(default=False)
    
    # Display flags (added in this document)
    is_filterable = models.BooleanField(default=False)
    is_searchable = models.BooleanField(default=False)
    is_comparable = models.BooleanField(default=False)
    is_visible_on_product = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    # Validation fields (added in this document)
    validation_regex = models.CharField(max_length=255, blank=True, null=True)
    
    # More fields in next document:
    # - min_value, max_value (for NUMBER type)
    # - categories (ManyToMany)
```

### Display Flags Summary

| Flag | Purpose | Default |
|------|---------|---------|
| is_filterable | Webstore faceted search | False |
| is_searchable | Full-text search indexing | False |
| is_comparable | Product comparison tables | False |
| is_visible_on_product | Product page display | True |

### Next Steps
1. Proceed to [03_Tasks-43-48_Category-Assignment-Export.md](03_Tasks-43-48_Category-Assignment-Export.md)
2. Add min_value and max_value for NUMBER validation
3. Add categories ManyToMany relationship
4. Complete model with Meta, __str__, manager, and migration

---

## Notes for AI Agents

1. **Display Flags:** Most are False by default (explicit opt-in)
2. **Visibility:** Default True (most attributes shown)
3. **Regex Validation:** Only for TEXT type
4. **Display Order:** Works with group display_order
5. **Search Integration:** Consider PostgreSQL full-text search
6. **Multi-Language:** Support Sinhala patterns if needed
7. **No Code:** Instructions only
