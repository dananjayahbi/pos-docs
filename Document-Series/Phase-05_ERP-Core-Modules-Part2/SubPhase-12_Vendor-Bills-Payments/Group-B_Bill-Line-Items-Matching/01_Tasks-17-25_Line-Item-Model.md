# Tasks 17-25: Bill Line Item Model & Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** B - Bill Line Items & Matching  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-26-32_Matching-Service.md](02_Tasks-26-32_Matching-Service.md)

---

## Document Overview

This document covers the creation of the BillLineItem model with comprehensive fields for tracking individual line items on vendor bills. Each line item represents a single product or service being billed, with quantity, pricing, tax information, and references to purchase orders and goods received notes for three-way matching.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create BillLineItem Model | Medium | 25 min |
| 18 | Add Line Item Product Fields | Medium | 20 min |
| 19 | Add Line Item Description | Low | 15 min |
| 20 | Add Line Item Quantity Fields | Medium | 20 min |
| 21 | Add Line Item Pricing Fields | Medium | 20 min |
| 22 | Add Line Item Total Field | Medium | 20 min |
| 23 | Add Line Item PO Reference | Medium | 20 min |
| 24 | Add Line Item GRN Reference | Medium | 20 min |
| 25 | Run BillLineItem Migrations | Low | 15 min |

---

## Task 17: Create BillLineItem Model

### Overview
Create the BillLineItem model to represent individual line items on vendor bills. Each bill can have multiple line items, and each line item tracks a specific product or service with its quantity, price, and related information for matching against purchase orders and goods received notes.

### Dependencies
- Group A complete: VendorBill model exists
- Product model available in catalog app
- Django model relationships understood

### Instructions

1. **Create bill_line_item.py file**
   - Navigate to `apps/vendor_bills/models/`
   - Create new file `bill_line_item.py`
   - Will contain BillLineItem model

2. **Import required dependencies**
   - Import Django model components
   - Import VendorBill model
   - Import base model mixins if available
   - Import related models (will add as needed)

3. **Define BillLineItem model class**
   - Inherit from appropriate base model
   - Use TimestampedModel if available
   - Set up for tenant awareness

4. **Add vendor_bill relationship**
   - ForeignKey to VendorBill
   - on_delete=CASCADE (delete lines with bill)
   - related_name='line_items'
   - Required field

5. **Add line_number field**
   - PositiveIntegerField for ordering
   - Tracks line position on bill
   - Example: 1, 2, 3, etc.
   - Used for display and reference

6. **Define model Meta class**
   - Set verbose_name to "Bill Line Item"
   - Set verbose_name_plural to "Bill Line Items"
   - Add ordering by line_number
   - Define unique_together for (vendor_bill, line_number)

7. **Add __str__ method**
   - Return bill number and line number
   - Format: "BILL-2026-00001 - Line 1"
   - Helpful for admin and debugging

8. **Add model docstring**
   - Explain line item purpose
   - Document key relationships
   - Note matching functionality

9. **Update models __init__.py**
   - Import BillLineItem model
   - Export for use in other modules
   - Maintain clean imports

### BillLineItem Core Structure

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| vendor_bill | ForeignKey | to=VendorBill, CASCADE | Parent bill |
| line_number | PositiveIntegerField | - | Line position |
| created_at | DateTimeField | auto_now_add | Creation timestamp |
| updated_at | DateTimeField | auto_now | Update timestamp |

### Bill and Line Item Relationship

```
One-to-Many Relationship:
┌──────────────────┐
│   VendorBill     │
│  BILL-2026-00001 │
└────────┬─────────┘
         │
         ├──────────┐
         │          │
         ▼          ▼
┌─────────────┐  ┌─────────────┐
│LineItem #1  │  │LineItem #2  │
│Product A    │  │Product B    │
│Qty: 50      │  │Qty: 100     │
│Price: $10   │  │Price: $20   │
└─────────────┘  └─────────────┘

Access patterns:
bill.line_items.all()  → Get all lines
line_item.vendor_bill  → Get parent bill
```

### Line Number Purpose

```
Line Number Usage:
┌──────┬─────────────────┬─────────┬──────────┐
│ Line │ Item            │ Qty     │ Price    │
├──────┼─────────────────┼─────────┼──────────┤
│  1   │ Widget A        │  50     │ $500.00  │
│  2   │ Widget B        │ 100     │ $2,000.00│
│  3   │ Shipping        │   1     │ $50.00   │
└──────┴─────────────────┴─────────┴──────────┘

Benefits:
- Maintain line order on printed bills
- Reference specific lines in communications
- Track line-by-line matching
- Preserve vendor invoice structure
```

### Model Cascade Behavior

```
on_delete=CASCADE:

When bill deleted → All line items deleted

Example:
Delete BILL-2026-00001
    ↓
Line 1 deleted automatically
Line 2 deleted automatically
Line 3 deleted automatically

Protects data integrity
No orphaned line items
```

### Expected Outcome
- Core BillLineItem model created
- Relationship to VendorBill established
- Foundation for additional fields
- Ready for product and quantity fields

### Verification Checklist
- [ ] bill_line_item.py file created
- [ ] BillLineItem model class defined
- [ ] vendor_bill ForeignKey added
- [ ] line_number field added
- [ ] Timestamp fields included
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model docstring added
- [ ] models/__init__.py updated

---

## Task 18: Add Line Item Product Fields

### Overview
Add product identification fields to the BillLineItem model including references to Product, ProductVariant, and vendor SKU. These fields allow line items to represent both catalog products and non-catalog items that vendors may include on their invoices.

### Dependencies
- Task 17: Create BillLineItem Model
- Product model exists in catalog app
- ProductVariant model exists

### Instructions

1. **Import Product and ProductVariant models**
   - From apps.catalog.models import Product, ProductVariant
   - Ensure proper model references
   - Handle circular imports if needed

2. **Add product field**
   - ForeignKey to Product model
   - null=True, blank=True (optional)
   - on_delete=PROTECT
   - related_name='bill_line_items'

3. **Add variant field**
   - ForeignKey to ProductVariant model
   - null=True, blank=True (optional)
   - on_delete=PROTECT
   - related_name='bill_line_items'

4. **Add vendor_sku field**
   - CharField with max_length=100
   - Stores vendor's product code
   - Blank=True for non-product items
   - Helps with matching and reference

5. **Add product validation**
   - If product set, ensure it matches variant's product
   - Validate product or description present
   - Check product is from correct vendor
   - Implement in clean() method

6. **Add convenience properties**
   - Property: product_name (from product or variant)
   - Property: has_product
   - Property: is_catalog_item
   - Quick access to product info

### Product Reference Fields

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| product | ForeignKey | to=Product, PROTECT, optional | Catalog product |
| variant | ForeignKey | to=ProductVariant, PROTECT, optional | Product variant |
| vendor_sku | CharField | max_length=100, blank=True | Vendor code |

### Product vs Variant Usage

```
Product Hierarchy:
┌────────────────────┐
│    Product         │  Generic: "T-Shirt"
│    (Base Item)     │
└─────────┬──────────┘
          │
          ├───────────┐
          │           │
          ▼           ▼
    ┌─────────┐  ┌─────────┐
    │Variant 1│  │Variant 2│
    │Red/S    │  │Blue/M   │
    └─────────┘  └─────────┘

Line Item Options:
1. Product only: Generic item, no variant
2. Product + Variant: Specific variant ordered
3. Neither: Non-catalog item (use description)
```

### Catalog vs Non-Catalog Items

#### Catalog Items
```
Line Item for catalog product:
├── product: FK to Product "Widget A"
├── variant: FK to Variant "Red/Large"
├── vendor_sku: "VEN-WDG-A-RL"
├── item_description: Auto-populated
└── Tracked in inventory
```

#### Non-Catalog Items
```
Line Item for service or non-inventory:
├── product: NULL
├── variant: NULL
├── vendor_sku: Empty or vendor's code
├── item_description: "Installation Service"
└── Not tracked in inventory

Examples:
- Delivery charges
- Installation fees
- Consulting services
- Miscellaneous items
```

### Vendor SKU Purpose

```
Vendor SKU Examples:
┌────────────────┬──────────────────┬─────────────┐
│ Our SKU        │ Vendor SKU       │ Product     │
├────────────────┼──────────────────┼─────────────┤
│ PRD-001        │ ACME-WDG-100     │ Widget A    │
│ PRD-002        │ ACME-WDG-200     │ Widget B    │
│ PRD-003        │ VEN-BOLT-M10     │ Bolt M10    │
└────────────────┴──────────────────┴─────────────┘

Uses:
- Cross-reference with vendor catalogs
- Reconcile with vendor invoices
- Map vendor items to our products
- Support for multiple vendors per product
```

### Product Validation Logic

```
Validation Rules:

1. Product-Variant Consistency:
   IF variant is set:
       THEN product must equal variant.product
   
2. Product or Description Required:
   IF product is NULL:
       THEN item_description must not be empty
   
3. Variant Implies Product:
   IF variant is set:
       THEN product must be set

Error Examples:
❌ variant = "Red/Small" but product = NULL
❌ product = "Widget A" but variant = "Blue/Large" (different product)
✅ product = "Widget A", variant = "Red/Small" (same product)
✅ product = NULL, variant = NULL, description = "Delivery Fee"
```

### Product Selection Workflow

```
User Flow When Creating Bill Line:

1. Search for product
   ├─ Found in catalog
   │  ├─ Has variants?
   │  │  ├─ Yes: Select variant
   │  │  └─ No: Use product only
   │  └─ Auto-populate price from catalog
   │
   └─ Not found in catalog
      └─ Enter description manually
      └─ Enter price from invoice
```

### Expected Outcome
- Product catalog integration
- Support for variants
- Vendor SKU tracking
- Flexible item identification

### Verification Checklist
- [ ] Product model imported
- [ ] ProductVariant model imported
- [ ] product ForeignKey added
- [ ] variant ForeignKey added
- [ ] vendor_sku CharField added
- [ ] Product validation implemented
- [ ] product_name property created
- [ ] has_product property created
- [ ] Product-variant consistency checked

---

## Task 19: Add Line Item Description

### Overview
Add an item_description TextField to store human-readable descriptions of line items. This field is essential for non-catalog items and provides context for all items regardless of whether they are linked to products in the catalog.

### Dependencies
- Task 18: Add Line Item Product Fields
- Understanding of catalog vs non-catalog items

### Instructions

1. **Add item_description field**
   - TextField to store item description
   - blank=True (optional for catalog items)
   - Max length consideration (1000 chars recommended)
   - Stores vendor's description or custom text

2. **Add auto-population logic**
   - Auto-populate from product name if product set
   - Allow manual override of auto-populated text
   - Preserve vendor's original description
   - Implement in save() method or form

3. **Add description validation**
   - Required if product is NULL
   - Cannot be empty for non-catalog items
   - Trim whitespace
   - Implement in clean() method

4. **Add description formatting**
   - Strip extra whitespace
   - Standardize format if needed
   - Preserve important formatting
   - Handle special characters

### Item Description Field

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| item_description | TextField | max_length=1000, blank=True | Item description |

### Description Source Priority

```
Description Population Logic:
┌────────────────────────────────────┐
│  1. Manual Entry (User Override)   │  Highest priority
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  2. Vendor Invoice Description     │  If provided
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  3. Product Name + Variant Info    │  Auto-populated
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  4. Default (Empty)                │  Validated as error
└────────────────────────────────────┘
```

### Description Examples

#### Catalog Items with Auto-Population
```
Product: Widget A
Variant: Red/Large
Auto-generated: "Widget A - Red/Large"

Product: Industrial Bolt M10x50
Variant: None
Auto-generated: "Industrial Bolt M10x50"

User can override to match vendor invoice:
"Industrial Bolt M10x50mm Grade 8.8"
```

#### Non-Catalog Items
```
Required Manual Descriptions:

Services:
- "Installation and Configuration Service"
- "Technical Support - 10 hours"
- "Consulting Services - System Design"

Charges:
- "Delivery Charges to Colombo"
- "Handling Fee"
- "Express Shipping Surcharge"

Miscellaneous:
- "Custom Fabrication - per specification"
- "Emergency Call-out Fee"
- "After-hours Labor"
```

### Description Validation Rules

```
Validation Logic:

IF product is NULL:
    IF item_description is empty:
        RAISE ValidationError("Description required for non-catalog items")

IF item_description length > 1000:
    RAISE ValidationError("Description too long (max 1000 characters)")

IF item_description contains only whitespace:
    RAISE ValidationError("Description cannot be only whitespace")
```

### Description Display Formatting

```
Storage vs Display:

Stored (Database):
"Widget A - Red/Large - 100 Pack"

Display (Invoice):
┌────────────────────────────────────┐
│ Widget A                           │
│ Color: Red, Size: Large            │
│ Package: 100 Pack                  │
└────────────────────────────────────┘

Report Display:
"Widget A - Red/Large..."  (truncated)
```

### Multi-Language Considerations

```
Sri Lankan Context:

English: "Industrial Safety Gloves - Size L"
Sinhala: "කාර්මික ආරක්ෂිත අත්වැසුම් - විශාලය L"

Store primary language (English)
Translation handled separately
Description field supports Unicode
```

### Expected Outcome
- Clear item descriptions
- Support for catalog and non-catalog items
- Auto-population for efficiency
- Manual override capability

### Verification Checklist
- [ ] item_description TextField added
- [ ] max_length set appropriately
- [ ] blank=True configured
- [ ] Auto-population logic implemented
- [ ] Validation for non-catalog items
- [ ] Whitespace trimming added
- [ ] Unicode support verified
- [ ] Description formatting tested

---

## Task 20: Add Line Item Quantity Fields

### Overview
Add quantity tracking fields to the BillLineItem model including the billed quantity, ordered quantity from the PO, and received quantity from the GRN. These fields enable three-way matching and variance detection between what was ordered, received, and billed.

### Dependencies
- Task 19: Add Line Item Description
- Three-way matching concept understood
- PO and GRN models available

### Instructions

1. **Add quantity field**
   - PositiveIntegerField for billed quantity
   - Required field, cannot be zero
   - Quantity vendor is billing for
   - Primary quantity for this line

2. **Add quantity_ordered field**
   - PositiveIntegerField for PO quantity
   - Nullable (null=True, blank=True)
   - Populated from linked PO line
   - Reference for matching validation

3. **Add quantity_received field**
   - PositiveIntegerField for GRN quantity
   - Nullable (null=True, blank=True)
   - Populated from linked GRN line
   - Key for three-way match validation

4. **Add quantity validation**
   - quantity must be > 0
   - quantity_ordered must be >= quantity (if set)
   - quantity_received should match quantity
   - Implement tolerance for variances

5. **Add quantity comparison methods**
   - Method: get_quantity_variance()
   - Method: is_quantity_matched()
   - Method: get_quantity_variance_percentage()
   - Support matching calculations

6. **Add quantity convenience properties**
   - Property: quantity_short (ordered - received)
   - Property: quantity_over (received - ordered)
   - Property: is_overbilled (quantity > received)
   - Property: is_underbilled (quantity < received)

### Quantity Fields Structure

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| quantity | PositiveIntegerField | required, > 0 | Billed quantity |
| quantity_ordered | PositiveIntegerField | nullable | PO quantity |
| quantity_received | PositiveIntegerField | nullable | GRN quantity |

### Three-Way Quantity Matching

```
Quantity Flow Across Documents:
┌──────────────────┐
│ Purchase Order   │
│ quantity_ordered │
│     100 units    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Goods Received   │
│quantity_received │
│     100 units    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Vendor Bill      │
│    quantity      │
│     100 units    │
└──────────────────┘

Match Validation:
✓ ordered (100) = received (100)
✓ received (100) = billed (100)
✓ ordered (100) = billed (100)
→ PERFECT MATCH
```

### Quantity Variance Scenarios

```
Scenario 1: Perfect Match
┌─────────┬──────────┬──────────┐
│ Ordered │ Received │ Billed   │
├─────────┼──────────┼──────────┤
│  100    │   100    │   100    │
└─────────┴──────────┴──────────┘
Result: ✅ MATCHED
Variance: 0
Action: Auto-approve

Scenario 2: Partial Receipt
┌─────────┬──────────┬──────────┐
│ Ordered │ Received │ Billed   │
├─────────┼──────────┼──────────┤
│  100    │    80    │    80    │
└─────────┴──────────┴──────────┘
Result: ✅ MATCHED (Partial)
Variance: 0 (billed = received)
Note: 20 units not received or billed

Scenario 3: Overbilling
┌─────────┬──────────┬──────────┐
│ Ordered │ Received │ Billed   │
├─────────┼──────────┼──────────┤
│  100    │   100    │   105    │
└─────────┴──────────┴──────────┘
Result: ⚠️ VARIANCE
Variance: +5 (overbilled)
Action: Investigation required

Scenario 4: Underbilling
┌─────────┬──────────┬──────────┐
│ Ordered │ Received │ Billed   │
├─────────┼──────────┼──────────┤
│  100    │   100    │    95    │
└─────────┴──────────┴──────────┘
Result: ⚠️ VARIANCE
Variance: -5 (underbilled)
Action: Review (may be intentional)

Scenario 5: Over-Receipt
┌─────────┬──────────┬──────────┐
│ Ordered │ Received │ Billed   │
├─────────┼──────────┼──────────┤
│  100    │   110    │   110    │
└─────────┴──────────┴──────────┘
Result: ⚠️ VARIANCE
Variance: +10 (over-receipt)
Action: Check if PO amended
```

### Quantity Variance Calculations

```
Variance Formulas:

1. Absolute Variance:
   variance = billed_qty - received_qty
   
2. Variance Percentage:
   variance_pct = (variance / received_qty) × 100
   
3. Tolerance Check:
   is_within_tolerance = (abs(variance_pct) <= tolerance_threshold)

Examples:
Ordered: 100, Received: 100, Billed: 102
- Variance: +2
- Variance %: 2%
- Within 2% tolerance: ✅ YES

Ordered: 100, Received: 100, Billed: 110
- Variance: +10
- Variance %: 10%
- Within 2% tolerance: ❌ NO
```

### Partial Delivery Handling

```
Multiple Deliveries for One PO:

PO: 100 units ordered

Delivery 1 (GRN-001):
- Received: 60 units
- Bill-001: 60 units ✅

Delivery 2 (GRN-002):
- Received: 40 units
- Bill-002: 40 units ✅

Total Billed: 100 units = Ordered ✅

System tracks:
- PO line: quantity_ordered = 100
- Bill line 1: quantity = 60, quantity_received = 60
- Bill line 2: quantity = 40, quantity_received = 40
```

### Quantity Unit Consistency

```
Unit of Measure Considerations:

All quantities must use same UOM:
┌──────────┬─────────────┐
│ Document │ Quantity    │
├──────────┼─────────────┤
│ PO       │ 100 pieces  │
│ GRN      │ 100 pieces  │
│ Bill     │ 100 pieces  │
└──────────┴─────────────┘
✅ Consistent units

Unit Conversion Issues:
┌──────────┬─────────────┐
│ PO       │ 10 boxes    │
│ GRN      │ 100 pieces  │ (10 pieces/box)
│ Bill     │ 100 pieces  │
└──────────┴─────────────┘
⚠️ Need conversion logic
```

### Expected Outcome
- Complete quantity tracking
- Three-way quantity matching
- Variance detection capability
- Foundation for matching validation

### Verification Checklist
- [ ] quantity field added (required)
- [ ] quantity_ordered field added (nullable)
- [ ] quantity_received field added (nullable)
- [ ] quantity > 0 validation
- [ ] get_quantity_variance() method created
- [ ] is_quantity_matched() method created
- [ ] Variance percentage calculation added
- [ ] Tolerance checking implemented
- [ ] is_overbilled property created
- [ ] is_underbilled property created

---

## Task 21: Add Line Item Pricing Fields

### Overview
Add pricing fields to track unit prices, billed prices, and tax rates for each line item. These fields enable price validation, tax calculation, and variance detection between expected PO prices and actual billed prices.

### Dependencies
- Task 20: Add Line Item Quantity Fields
- Decimal field precision understood
- Sri Lankan tax rates known

### Instructions

1. **Add unit_price field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores expected price from PO
   - Nullable (null=True, blank=True)
   - Reference price for comparison

2. **Add billed_price field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores actual price on vendor invoice
   - Required field
   - Primary price for calculation

3. **Add tax_rate field**
   - DecimalField with max_digits=5, decimal_places=2
   - Stores tax percentage (e.g., 18.00 for 18% VAT)
   - Default to standard rate
   - Can be 0 for exempt items

4. **Add tax_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Calculated tax value
   - Auto-computed from billed_price × tax_rate
   - Read-only, derived field

5. **Add price validation**
   - billed_price must be > 0
   - tax_rate must be >= 0 and <= 100
   - unit_price variance checking
   - Price tolerance validation

6. **Add price calculation methods**
   - Method: calculate_tax_amount()
   - Method: get_price_variance()
   - Method: get_price_variance_percentage()
   - Method: is_price_matched()

7. **Add price convenience properties**
   - Property: subtotal_before_tax
   - Property: subtotal_with_tax
   - Property: is_price_higher (than PO)
   - Property: is_price_lower (than PO)

### Pricing Fields Structure

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| unit_price | DecimalField | 12,2, nullable | Expected PO price |
| billed_price | DecimalField | 12,2, required | Actual billed price |
| tax_rate | DecimalField | 5,2, default | Tax percentage |
| tax_amount | DecimalField | 12,2, computed | Calculated tax |

### Price Matching Logic

```
Price Comparison Flow:
┌───────────────────┐
│ Purchase Order    │
│  unit_price       │
│  LKR 1,000        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Vendor Bill       │
│  billed_price     │
│  LKR 1,000        │
└───────────────────┘

Match Check:
IF unit_price = billed_price:
    → ✅ MATCHED
ELSE:
    variance = billed_price - unit_price
    IF abs(variance_pct) <= tolerance:
        → ⚠️ MATCHED (with variance note)
    ELSE:
        → ❌ VARIANCE (requires approval)
```

### Price Variance Scenarios

```
Scenario 1: Perfect Price Match
PO Unit Price: LKR 1,000
Billed Price: LKR 1,000
Variance: LKR 0 (0%)
Result: ✅ MATCHED

Scenario 2: Price Increase
PO Unit Price: LKR 1,000
Billed Price: LKR 1,050
Variance: +LKR 50 (+5%)
Result: ⚠️ VARIANCE
Action: Investigation needed

Scenario 3: Price Decrease
PO Unit Price: LKR 1,000
Billed Price: LKR 950
Variance: -LKR 50 (-5%)
Result: ⚠️ VARIANCE (favorable)
Action: Review and document

Scenario 4: Within Tolerance
PO Unit Price: LKR 1,000
Billed Price: LKR 1,005
Variance: +LKR 5 (+0.5%)
Tolerance: 1%
Result: ✅ MATCHED (within tolerance)
```

### Tax Rate Configuration

```
Sri Lankan VAT Rates (2026):
┌──────────────────┬─────────┬─────────────────┐
│ Category         │ Rate    │ tax_rate Value  │
├──────────────────┼─────────┼─────────────────┤
│ Standard         │ 18%     │ 18.00           │
│ Reduced          │ 8%      │  8.00           │
│ Zero-rated       │ 0%      │  0.00           │
│ Exempt           │ N/A     │  0.00           │
└──────────────────┴─────────┴─────────────────┘

Tax Amount Calculation:
tax_amount = (billed_price × quantity) × (tax_rate / 100)

Example:
billed_price = LKR 1,000
quantity = 10
tax_rate = 18.00

subtotal = 1,000 × 10 = 10,000
tax_amount = 10,000 × 0.18 = 1,800
total = 10,000 + 1,800 = 11,800
```

### Price Calculation Flow

```
Line Item Calculations:
┌──────────────────┐
│  billed_price    │  LKR 1,000 per unit
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  × quantity      │  × 10 units
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ subtotal_before  │  LKR 10,000
│     _tax         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  × tax_rate      │  × 18%
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  tax_amount      │  LKR 1,800
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ subtotal_with    │  LKR 11,800
│     _tax         │  (line_total)
└──────────────────┘
```

### Price Variance Tolerance

```
Tolerance Configuration:
┌──────────────┬────────────┬─────────────┐
│ Variance %   │ Status     │ Action      │
├──────────────┼────────────┼─────────────┤
│ 0%           │ MATCHED    │ Auto-approve│
│ 0-1%         │ MATCHED    │ Auto-approve│
│ 1-3%         │ VARIANCE   │ Review      │
│ 3-5%         │ VARIANCE   │ Approval    │
│ > 5%         │ VARIANCE   │ Investigation│
└──────────────┴────────────┴─────────────┘

Configurable per:
- Tenant settings
- Vendor relationship
- Product category
- Amount threshold
```

### Currency Considerations

```
Multi-Currency Pricing:

All prices in line item use parent bill currency:
bill.currency = "LKR"
line_item.billed_price = 1000.00 LKR
line_item.unit_price = 1000.00 LKR

Foreign Currency Bill:
bill.currency = "USD"
line_item.billed_price = 100.00 USD
line_item.unit_price = 100.00 USD

Conversion to LKR for reporting handled separately.
```

### Expected Outcome
- Complete price tracking
- Tax calculation automation
- Price variance detection
- Foundation for financial validation

### Verification Checklist
- [ ] unit_price field added (nullable)
- [ ] billed_price field added (required)
- [ ] tax_rate field added with default
- [ ] tax_amount field added (computed)
- [ ] billed_price > 0 validation
- [ ] tax_rate range validation (0-100)
- [ ] calculate_tax_amount() method created
- [ ] get_price_variance() method created
- [ ] Price variance percentage calculation
- [ ] is_price_matched() method created
- [ ] subtotal_before_tax property added
- [ ] subtotal_with_tax property added

---

## Task 22: Add Line Item Total Field

### Overview
Add the line_total field to store the complete line item total including quantity, price, and tax. This field represents the final amount for each line and is used to calculate the bill's overall total.

### Dependencies
- Task 21: Add Line Item Pricing Fields
- Calculation logic understood

### Instructions

1. **Add line_total field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores complete line amount
   - Calculated field, not manually entered
   - Includes tax if applicable

2. **Implement line_total calculation**
   - Formula: (billed_price × quantity) + tax_amount
   - Alternative: (billed_price × quantity) × (1 + tax_rate/100)
   - Auto-calculate on save
   - Update when related fields change

3. **Add calculation method**
   - Method: calculate_line_total()
   - Called before save
   - Handles edge cases (zero quantity, etc.)
   - Returns calculated total

4. **Add calculation triggers**
   - Recalculate on billed_price change
   - Recalculate on quantity change
   - Recalculate on tax_rate change
   - Override save() method

5. **Add bill total aggregation**
   - Bill recalculates total from line items
   - Method in VendorBill: recalculate_from_lines()
   - Sum all line_total values
   - Update bill.total field

6. **Add convenience properties**
   - Property: subtotal_before_tax (price × quantity)
   - Property: tax_component (tax_amount)
   - Property: total_with_tax (line_total)
   - Clear separation of components

### Line Total Field

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| line_total | DecimalField | 12,2, computed | Complete line amount |

### Line Total Calculation Formula

```
Line Total Calculation:
┌────────────────────────────────────┐
│ Method 1: Step-by-Step             │
├────────────────────────────────────┤
│ subtotal = billed_price × quantity │
│ tax_amount = subtotal × (tax_rate / 100) │
│ line_total = subtotal + tax_amount │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Method 2: Combined                 │
├────────────────────────────────────┤
│ line_total = (billed_price × quantity) × (1 + tax_rate / 100) │
└────────────────────────────────────┘

Both methods produce same result.
Method 1 preferred for clarity.
```

### Line Total Examples

```
Example 1: Standard Item with VAT
billed_price = LKR 1,000
quantity = 10
tax_rate = 18%

Calculation:
subtotal = 1,000 × 10 = 10,000
tax_amount = 10,000 × 0.18 = 1,800
line_total = 10,000 + 1,800 = 11,800

Example 2: Tax-Exempt Item
billed_price = LKR 500
quantity = 5
tax_rate = 0%

Calculation:
subtotal = 500 × 5 = 2,500
tax_amount = 2,500 × 0 = 0
line_total = 2,500 + 0 = 2,500

Example 3: Reduced VAT Rate
billed_price = LKR 200
quantity = 100
tax_rate = 8%

Calculation:
subtotal = 200 × 100 = 20,000
tax_amount = 20,000 × 0.08 = 1,600
line_total = 20,000 + 1,600 = 21,600
```

### Bill Total Aggregation

```
Bill Total = Sum of All Line Totals

Bill BILL-2026-00001:
┌──────┬────────────┬─────┬──────────┬─────────┬────────────┐
│ Line │ Product    │ Qty │ Price    │ Tax%    │ Line Total │
├──────┼────────────┼─────┼──────────┼─────────┼────────────┤
│  1   │ Widget A   │ 10  │ 1,000.00 │ 18%     │  11,800.00 │
│  2   │ Widget B   │ 5   │   500.00 │ 18%     │   2,950.00 │
│  3   │ Shipping   │ 1   │   200.00 │  0%     │     200.00 │
└──────┴────────────┴─────┴──────────┴─────────┴────────────┘
                                        TOTAL:     14,950.00

VendorBill.recalculate_from_lines():
bill.total = sum(line.line_total for line in bill.line_items.all())
bill.total = 11,800 + 2,950 + 200 = 14,950.00
```

### Automatic Recalculation

```
Recalculation Triggers:

1. Line Item Save:
   def save(self, *args, **kwargs):
       self.line_total = self.calculate_line_total()
       super().save(*args, **kwargs)
       self.vendor_bill.recalculate_from_lines()

2. Field Changes:
   IF billed_price changes → recalculate
   IF quantity changes → recalculate
   IF tax_rate changes → recalculate

3. Line Item Delete:
   @receiver(post_delete, sender=BillLineItem)
   def recalc_on_delete(sender, instance, **kwargs):
       instance.vendor_bill.recalculate_from_lines()
```

### Calculation Consistency

```
Data Integrity Rules:

1. Line Total Must Equal Calculation:
   stored_line_total == calculated_line_total
   
2. Bill Total Must Equal Sum of Lines:
   bill.total == sum(line.line_total for line in bill.lines)
   
3. Prevent Manual Total Entry:
   line_total is read-only
   Calculated automatically
   
4. Validation on Save:
   IF stored != calculated:
       RAISE ValidationError("Total mismatch")
```

### Rounding Considerations

```
Decimal Precision:

DecimalField(max_digits=12, decimal_places=2)
└─ Stores: 9999999999.99
└─ Rounds to 2 decimal places

Rounding Rules:
tax_amount = round(subtotal × tax_rate / 100, 2)
line_total = round(subtotal + tax_amount, 2)

Example with Rounding:
subtotal = 1,000.00
tax_rate = 18.5%
tax_amount = 1,000 × 0.185 = 185.00 (no rounding needed)
line_total = 1,000 + 185 = 1,185.00

Example with Rounding:
subtotal = 33.33
tax_rate = 18%
tax_amount = 33.33 × 0.18 = 5.9994 → rounds to 6.00
line_total = 33.33 + 6.00 = 39.33
```

### Expected Outcome
- Automated line total calculation
- Accurate tax computation
- Bill total aggregation
- Consistent financial tracking

### Verification Checklist
- [ ] line_total field added
- [ ] calculate_line_total() method created
- [ ] Auto-calculation on save implemented
- [ ] Recalculation triggers configured
- [ ] VendorBill.recalculate_from_lines() method
- [ ] subtotal_before_tax property added
- [ ] Rounding rules implemented
- [ ] Validation for total consistency
- [ ] Post-delete signal for recalculation

---

## Task 23: Add Line Item PO Reference

### Overview
Add a reference to purchase order line items to enable matching bill lines against what was originally ordered. This relationship is essential for three-way matching and price/quantity validation.

### Dependencies
- Task 22: Add Line Item Total Field
- PurchaseOrder and POLineItem models exist
- Three-way matching understood

### Instructions

1. **Import POLineItem model**
   - From apps.purchasing.models import POLineItem
   - Ensure proper model reference
   - Handle import timing

2. **Add po_line field**
   - ForeignKey to POLineItem model
   - null=True, blank=True (optional)
   - on_delete=SET_NULL
   - related_name='bill_line_items'

3. **Add PO line matching logic**
   - Auto-match when bill created from PO
   - Manual matching for standalone bills
   - Validate product consistency
   - Link line-by-line

4. **Add PO data population**
   - Auto-populate unit_price from PO
   - Auto-populate quantity_ordered from PO
   - Copy product reference
   - Preserve PO terms

5. **Add convenience properties**
   - Property: has_po_reference
   - Property: po_number
   - Property: is_po_matched
   - Quick access to PO info

### PO Line Reference Field

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| po_line | ForeignKey | to=POLineItem, SET_NULL, optional | PO line reference |

### Bill to PO Line Relationship

```
Purchase Order Line to Bill Line:
┌────────────────────────┐
│ PO-2026-00001          │
│ ├─ Line 1: Widget A    │
│ │  Qty: 100            │
│ │  Price: LKR 1,000    │
│ │  Total: 100,000      │
└────────┬───────────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ BILL-001 Line 1 │  │ BILL-002 Line 1 │
│ Partial: 60     │  │ Final: 40       │
│ Price: 1,000    │  │ Price: 1,000    │
│ po_line: PO#1   │  │ po_line: PO#1   │
└─────────────────┘  └─────────────────┘

One PO line can have multiple bill lines (partial deliveries)
```

### PO Line Data Auto-Population

```
When Linking to PO Line:

1. Retrieve PO Line Data:
   po_line = POLineItem.objects.get(id=po_line_id)

2. Auto-populate Bill Line Fields:
   bill_line.product = po_line.product
   bill_line.variant = po_line.variant
   bill_line.item_description = po_line.description
   bill_line.unit_price = po_line.unit_price
   bill_line.quantity_ordered = po_line.quantity
   bill_line.tax_rate = po_line.tax_rate
   bill_line.po_line = po_line

3. User Can Override:
   - billed_price (may differ from unit_price)
   - quantity (may be partial)
   - tax_rate (if vendor applies different rate)
```

### PO Line Matching Scenarios

#### Scenario 1: Bill Created from PO
```
Process:
1. User selects PO: PO-2026-00001
2. System loads all PO lines
3. Creates bill lines automatically:
   - Line 1 → Widget A (100 units)
   - Line 2 → Widget B (50 units)
4. All fields auto-populated
5. po_line references set
6. User verifies and adjusts if needed
```

#### Scenario 2: Manual Bill Entry
```
Process:
1. User creates bill manually
2. Enters vendor invoice details
3. Adds line items manually
4. User can optionally link to PO:
   - Search for PO
   - Match lines one-by-one
   - System validates match
5. po_line set if matched
```

#### Scenario 3: Partial Billing
```
PO Line:
- Product: Widget A
- Quantity: 100 units
- Price: LKR 1,000

First Bill (Partial Delivery):
- Bill-001 Line 1
- Product: Widget A
- Quantity: 60
- po_line: → PO Line (Widget A)

Second Bill (Remaining):
- Bill-002 Line 1
- Product: Widget A
- Quantity: 40
- po_line: → Same PO Line (Widget A)

Both bill lines reference same PO line.
```

### PO Line Quantity Tracking

```
Track Billed vs Ordered:

PO Line: 100 units ordered

Query all bill lines for this PO line:
total_billed = BillLineItem.objects.filter(
    po_line=po_line_id,
    vendor_bill__status__in=['approved', 'paid']
).aggregate(Sum('quantity'))['quantity__sum'] or 0

Remaining to Bill:
remaining = po_line.quantity - total_billed

Status:
IF total_billed == 0:
    → Not Yet Billed
ELIF total_billed < po_line.quantity:
    → Partially Billed
ELIF total_billed == po_line.quantity:
    → Fully Billed
ELIF total_billed > po_line.quantity:
    → Overbilled (requires investigation)
```

### PO Line Matching Validation

```
Validation Rules:

1. Product Consistency:
   bill_line.product == po_line.product
   
2. Quantity Check:
   bill_line.quantity <= (po_line.quantity - already_billed)
   
3. Price Reasonableness:
   abs(bill_line.billed_price - po_line.unit_price) <= tolerance
   
4. Not Overbilling:
   total_billed_for_po_line <= po_line.quantity

Errors:
❌ Different product: "Bill line product doesn't match PO"
❌ Overbilling: "Quantity exceeds remaining PO quantity"
❌ Large price variance: "Price differs significantly from PO"
```

### Expected Outcome
- PO line linkage established
- Auto-population from PO data
- Foundation for PO matching
- Partial billing support

### Verification Checklist
- [ ] POLineItem model imported
- [ ] po_line ForeignKey added
- [ ] null=True, blank=True configured
- [ ] on_delete=SET_NULL set
- [ ] related_name='bill_line_items' defined
- [ ] Auto-population logic implemented
- [ ] has_po_reference property created
- [ ] po_number property created
- [ ] PO matching validation added
- [ ] Quantity tracking logic implemented

---

## Task 24: Add Line Item GRN Reference

### Overview
Add a reference to goods received note line items to complete the three-way matching triangle. This enables validation that billed items match what was actually received, preventing payment for undelivered goods.

### Dependencies
- Task 23: Add Line Item PO Reference
- GoodsReceivedNote and GRNLineItem models exist
- Three-way matching fully understood

### Instructions

1. **Import GRNLineItem model**
   - From apps.inventory.models import GRNLineItem
   - Ensure proper model reference
   - Handle import dependencies

2. **Add grn_line field**
   - ForeignKey to GRNLineItem model
   - null=True, blank=True (optional)
   - on_delete=SET_NULL
   - related_name='bill_line_items'

3. **Add GRN line matching logic**
   - Auto-match when bill created from GRN
   - Validate against received quantity
   - Check product consistency
   - Link to specific receipt

4. **Add GRN data population**
   - Auto-populate quantity_received from GRN
   - Validate quantity <= received quantity
   - Reference GRN inspection status
   - Consider rejected quantities

5. **Add convenience properties**
   - Property: has_grn_reference
   - Property: grn_number
   - Property: is_grn_matched
   - Property: is_3way_matched (PO + GRN + Bill)

### GRN Line Reference Field

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| grn_line | ForeignKey | to=GRNLineItem, SET_NULL, optional | GRN line reference |

### Complete Three-Way Matching Structure

```
Three-Way Match Relationships:
┌────────────────────┐
│  PO Line           │
│  Product: Widget A │
│  Ordered: 100      │
│  Price: 1,000      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  GRN Line          │
│  Product: Widget A │
│  Received: 100     │
│  Inspected: OK     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Bill Line         │
│  Product: Widget A │
│  Billed: 100       │
│  Price: 1,000      │
│  po_line: ✓        │
│  grn_line: ✓       │
└────────────────────┘

Complete triangle enables full validation.
```

### GRN Line Data Auto-Population

```
When Linking to GRN Line:

1. Retrieve GRN Line Data:
   grn_line = GRNLineItem.objects.get(id=grn_line_id)

2. Auto-populate Bill Line Fields:
   bill_line.product = grn_line.product
   bill_line.variant = grn_line.variant
   bill_line.quantity_received = grn_line.quantity_accepted
   bill_line.quantity = grn_line.quantity_accepted  # Default
   bill_line.grn_line = grn_line
   
3. Link to PO if GRN has PO reference:
   IF grn_line.po_line:
       bill_line.po_line = grn_line.po_line
       bill_line.unit_price = grn_line.po_line.unit_price
       bill_line.quantity_ordered = grn_line.po_line.quantity
```

### GRN Line Matching Scenarios

#### Scenario 1: Standard Receipt and Bill
```
PO Line:
- Ordered: 100 units

GRN Line:
- Received: 100 units
- Accepted: 100 units
- Rejected: 0 units

Bill Line:
- Billed: 100 units
- po_line: ✓ references PO
- grn_line: ✓ references GRN

Result: ✅ Perfect 3-way match
```

#### Scenario 2: Partial Acceptance
```
PO Line:
- Ordered: 100 units

GRN Line:
- Received: 100 units
- Accepted: 95 units
- Rejected: 5 units (damaged)

Bill Line:
- Billed: 95 units (match accepted qty)
- po_line: ✓ references PO
- grn_line: ✓ references GRN

Result: ✅ Matched (bill for accepted only)
```

#### Scenario 3: Overbilling Attempt
```
PO Line:
- Ordered: 100 units

GRN Line:
- Received: 100 units
- Accepted: 100 units

Bill Line:
- Billed: 105 units ⚠️
- po_line: ✓ references PO
- grn_line: ✓ references GRN

Result: ❌ Variance detected
Billed (105) > Received (100)
Action: Investigation required
```

### GRN Rejected Quantity Handling

```
Rejected Items Not Billable:

GRN Line Data:
├── quantity_received: 100
├── quantity_accepted: 95
└── quantity_rejected: 5
    └── rejection_reason: "Damaged packaging"

Bill Line Rules:
✓ Can bill up to: quantity_accepted (95)
❌ Cannot bill: quantity_rejected (5)

Validation:
IF bill_line.quantity > grn_line.quantity_accepted:
    RAISE ValidationError(
        "Cannot bill for more than accepted quantity"
    )
```

### Three-Way Match Validation

```
Complete 3-Way Match Check:

def is_3way_matched():
    # All three references must exist
    IF NOT (po_line AND grn_line):
        RETURN False
    
    # Quantities must align
    po_qty = po_line.quantity
    grn_qty = grn_line.quantity_accepted
    bill_qty = quantity
    
    # Bill qty should match GRN accepted qty
    IF bill_qty != grn_qty:
        RETURN False
    
    # GRN qty should match or be less than PO qty
    IF grn_qty > po_qty:
        RETURN False
    
    # Products must match
    IF po_line.product != grn_line.product != product:
        RETURN False
    
    # Prices should match within tolerance
    price_variance = abs(billed_price - po_line.unit_price)
    IF price_variance > tolerance:
        RETURN False
    
    RETURN True
```

### GRN Inspection Status Consideration

```
GRN Inspection Statuses:
┌──────────────┬────────────────────────┐
│ Status       │ Billing Allowed?       │
├──────────────┼────────────────────────┤
│ PENDING      │ ❌ No (wait for inspect)│
│ INSPECTING   │ ❌ No (in progress)    │
│ ACCEPTED     │ ✅ Yes (all units OK)  │
│ PARTIAL      │ ✅ Yes (accepted units)│
│ REJECTED     │ ❌ No (all rejected)   │
└──────────────┴────────────────────────┘

Validation:
IF grn_line.status NOT IN ['ACCEPTED', 'PARTIAL']:
    RAISE ValidationError(
        "Cannot bill for uninspected or rejected items"
    )
```

### Multiple GRNs for One PO

```
Partial Deliveries Scenario:

PO: 100 units ordered

GRN-001:
- Received: 60 units
- Accepted: 60 units
- Bill-001 Line: 60 units
  grn_line → GRN-001 Line

GRN-002:
- Received: 40 units
- Accepted: 40 units
- Bill-002 Line: 40 units
  grn_line → GRN-002 Line

Each bill line references its specific GRN line.
All reference same PO line.
```

### Expected Outcome
- GRN line linkage complete
- Three-way matching enabled
- Validation against received quantities
- Prevention of overbilling

### Verification Checklist
- [ ] GRNLineItem model imported
- [ ] grn_line ForeignKey added
- [ ] null=True, blank=True configured
- [ ] on_delete=SET_NULL set
- [ ] related_name='bill_line_items' defined
- [ ] Auto-population from GRN implemented
- [ ] has_grn_reference property created
- [ ] grn_number property created
- [ ] is_3way_matched property created
- [ ] GRN quantity validation added
- [ ] Rejected quantity handling implemented
- [ ] Inspection status check added

---

## Task 25: Run BillLineItem Migrations

### Overview
Generate and apply Django migrations to create the BillLineItem model table with all fields, relationships, and constraints. This finalizes the line item implementation and enables storing bill details in the database.

### Dependencies
- All BillLineItem fields complete (Tasks 17-24)
- All relationships defined
- Model validation implemented

### Instructions

1. **Verify model completeness**
   - Review BillLineItem model definition
   - Check all fields present
   - Verify all relationships correct
   - Confirm validation logic implemented

2. **Generate migrations**
   - Run makemigrations command for vendor_bills
   - Review generated migration file
   - Check for warnings or issues
   - Verify all fields included

3. **Review migration file**
   - Open generated migration in editor
   - Verify field types correct
   - Check foreign key relationships
   - Confirm indexes if any

4. **Test migration in development**
   - Apply migration to dev database
   - Check for errors
   - Verify table created
   - Test rollback if needed

5. **Apply to tenant schemas**
   - Use migrate_schemas command
   - Apply to all tenant schemas
   - Verify table in each schema
   - Check constraints created

6. **Verify migration success**
   - Check migration status
   - Verify table exists
   - Test creating line items
   - Confirm relationships work

### Migration Commands

```
Generate Migration:
$ python manage.py makemigrations vendor_bills

Expected Output:
Migrations for 'vendor_bills':
  vendor_bills/migrations/0002_billlineitem.py
    - Create model BillLineItem
    - Add field product
    - Add field variant
    - Add field po_line
    - Add field grn_line
    - Add unique constraint (vendor_bill, line_number)
```

```
Apply Migration:
$ python manage.py migrate vendor_bills

Expected Output:
Operations to perform:
  Apply all migrations: vendor_bills
Running migrations:
  Applying vendor_bills.0002_billlineitem... OK
```

```
Apply to All Tenants:
$ python manage.py migrate_schemas --shared

Expected Output:
Migrating tenant schemas...
  - tenant_1: OK
  - tenant_2: OK
  - tenant_3: OK
All tenants migrated successfully.
```

### Generated Table Structure

```
vendor_bills_billlineitem
├── id (BIGSERIAL PRIMARY KEY)
├── vendor_bill_id (BIGINT REFERENCES vendor_bills_vendorbill)
├── line_number (INTEGER)
├── product_id (BIGINT REFERENCES catalog_product)
├── variant_id (BIGINT REFERENCES catalog_productvariant)
├── vendor_sku (VARCHAR(100))
├── item_description (TEXT)
├── quantity (INTEGER)
├── quantity_ordered (INTEGER)
├── quantity_received (INTEGER)
├── unit_price (NUMERIC(12,2))
├── billed_price (NUMERIC(12,2))
├── tax_rate (NUMERIC(5,2))
├── tax_amount (NUMERIC(12,2))
├── line_total (NUMERIC(12,2))
├── po_line_id (BIGINT REFERENCES purchasing_polineitem)
├── grn_line_id (BIGINT REFERENCES inventory_grnlineitem)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Constraints:
- UNIQUE (vendor_bill_id, line_number)
- CHECK (quantity > 0)
- CHECK (billed_price > 0)
- CHECK (tax_rate >= 0 AND tax_rate <= 100)

Indexes:
- vendor_bill_id (automatic FK index)
- product_id (automatic FK index)
- po_line_id (automatic FK index)
- grn_line_id (automatic FK index)
```

### Testing After Migration

```
Test Line Item Creation:
from apps.vendor_bills.models import VendorBill, BillLineItem
from apps.catalog.models import Product

bill = VendorBill.objects.first()
product = Product.objects.first()

line_item = BillLineItem.objects.create(
    vendor_bill=bill,
    line_number=1,
    product=product,
    item_description="Test Widget",
    quantity=10,
    billed_price=100.00,
    tax_rate=18.00
)

# Check auto-calculations
print(f"Line Total: {line_item.line_total}")
# Should auto-calculate: (100 × 10) × 1.18 = 1,180

# Check bill total updated
bill.recalculate_from_lines()
print(f"Bill Total: {bill.total}")
```

### Expected Outcome
- BillLineItem table created
- All fields properly defined
- Relationships functional
- Line item creation works

### Verification Checklist
- [ ] makemigrations completed without errors
- [ ] Migration file reviewed
- [ ] migrate command successful
- [ ] migrate_schemas applied to tenants
- [ ] vendor_bills_billlineitem table exists
- [ ] All fields present in table
- [ ] Foreign key constraints working
- [ ] Unique constraint on (bill, line_number)
- [ ] Test line item creation successful
- [ ] Line total calculation works
- [ ] Bill total aggregation works

---

## Summary

This document created the complete BillLineItem model with all necessary fields for tracking individual items on vendor bills. The model supports three-way matching by maintaining references to purchase order lines and goods received note lines, enabling comprehensive validation of quantities, prices, and products.

### Completed Tasks
✅ Task 17: Created BillLineItem model with core structure  
✅ Task 18: Added product, variant, and vendor SKU fields  
✅ Task 19: Added item description for flexibility  
✅ Task 20: Added quantity fields for three-way matching  
✅ Task 21: Added pricing and tax fields  
✅ Task 22: Added line total calculation  
✅ Task 23: Added PO line reference  
✅ Task 24: Added GRN line reference  
✅ Task 25: Generated and applied migrations

### Key Deliverables
- Complete line item tracking
- Product catalog integration
- Three-way matching foundation (PO ← → GRN ← → Bill)
- Automatic calculations for taxes and totals
- Support for both catalog and non-catalog items
- Database schema with proper relationships

### Next Steps
Continue to [02_Tasks-26-32_Matching-Service.md](02_Tasks-26-32_Matching-Service.md) to implement the MatchingService that performs automated three-way matching, variance detection, and creates MatchingResult records for audit trails.
