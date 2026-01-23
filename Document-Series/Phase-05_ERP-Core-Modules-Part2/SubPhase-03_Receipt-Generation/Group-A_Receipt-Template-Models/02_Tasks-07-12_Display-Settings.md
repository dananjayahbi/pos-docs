# Tasks 07-12: Display Settings Configuration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** A - Receipt Template Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_Submodule-Constants-Header.md](01_Tasks-01-06_Submodule-Constants-Header.md)
- **→ Next Document:** [03_Tasks-13-16_QR-Font-Inheritance-Admin.md](03_Tasks-13-16_QR-Font-Inheritance-Admin.md)

---

## Document Overview

This document covers the display settings configuration for receipt templates. These settings control what information appears on receipts, including address details, item-level information, totals breakdown, payment details, footer content, and return policy text.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add address display settings | Low | 15 min |
| 08 | Add item display settings | Medium | 20 min |
| 09 | Add totals display settings | Medium | 20 min |
| 10 | Add payment display settings | Low | 15 min |
| 11 | Add footer configuration | Medium | 20 min |
| 12 | Add return policy field | Low | 15 min |

---

## Task 07: Add Address Display Settings

### Overview
Add fields to control the display of business address information on receipts. These settings allow tenants to customize which address components appear, accommodating different receipt styles and space constraints.

### Dependencies
- Task 06: Add header text fields

### Instructions

1. **Open template.py model file**
   - Navigate to `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add show_address field**
   - BooleanField, default=True
   - Controls whether address appears on receipt
   - Address comes from tenant settings

3. **Add show_phone field**
   - BooleanField, default=True
   - Controls phone number visibility
   - Phone number from tenant settings

4. **Add show_email field**
   - BooleanField, default=True
   - Controls email address visibility
   - Email from tenant settings

5. **Add show_website field**
   - BooleanField, default=False
   - Controls website URL visibility
   - Website from tenant settings

6. **Add show_tax_number field**
   - BooleanField, default=True
   - Controls tax/VAT registration number visibility
   - Important for Sri Lanka VAT compliance

7. **Add address_separator field**
   - BooleanField, default=True
   - Adds separator line after address section
   - Helps visually separate header from body

8. **Update model docstring**
   - Document address display settings
   - List all address-related fields

### Address Display Settings Structure

```
┌────────────────────────────────────────────────┐
│        Address Display Configuration           │
├────────────────────────────────────────────────┤
│ Visibility Controls:                           │
│  • show_address (Boolean)                      │
│  • show_phone (Boolean)                        │
│  • show_email (Boolean)                        │
│  • show_website (Boolean)                      │
│  • show_tax_number (Boolean)                   │
│                                                │
│ Layout Controls:                               │
│  • address_separator (Boolean)                 │
└────────────────────────────────────────────────┘
```

### Address Display Examples

#### Full Address Display (All Options Enabled)
```
╔════════════════════════════════════════════════╗
║             LANKACOMMERCE RETAIL               ║
║                                                ║
║            123 Galle Road, Floor 2             ║
║              Colombo 03, Sri Lanka             ║
║          Tel: +94 11 234 5678                  ║
║        Email: info@lankacommerce.lk            ║
║        Web: www.lankacommerce.lk               ║
║         VAT Reg: 123-456-789-001               ║
║                                                ║
║ ══════════════════════════════════════════════ ║  ← Separator
║                                                ║
║  Date: 2026-01-23    Time: 14:30:00            ║
╚════════════════════════════════════════════════╝
```

#### Minimal Address Display (Compact)
```
╔════════════════════════════════════════════════╗
║             LANKACOMMERCE RETAIL               ║
║          Tel: +94 11 234 5678                  ║
║                                                ║
║  Date: 2026-01-23    Time: 14:30:00            ║
╚════════════════════════════════════════════════╝
```

#### Address with Tax Number (VAT Compliance)
```
╔════════════════════════════════════════════════╗
║             LANKACOMMERCE RETAIL               ║
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
║         VAT Reg: 123-456-789-001               ║
║                                                ║
║ ══════════════════════════════════════════════ ║
╚════════════════════════════════════════════════╝
```

#### Address without Separator
```
╔════════════════════════════════════════════════╗
║             LANKACOMMERCE RETAIL               ║
║            123 Galle Road, Colombo 03          ║
║          Tel: +94 11 234 5678                  ║
║                                                ║
║  Date: 2026-01-23    Time: 14:30:00            ║
╚════════════════════════════════════════════════╝
```

### Address Field Configuration Matrix

| Setting | Thermal 58mm | Thermal 80mm | A4 Format | Reason |
|---------|-------------|--------------|-----------|--------|
| show_address | Optional | Recommended | Yes | Space constraints |
| show_phone | Yes | Yes | Yes | Essential contact |
| show_email | No | Optional | Yes | Space constraints |
| show_website | No | Optional | Yes | Space/relevance |
| show_tax_number | Yes | Yes | Yes | Legal requirement |
| address_separator | No | Yes | Yes | Visual clarity |

### Sri Lanka Tax Number Format

```
VAT Registration Number Format
════════════════════════════════

Standard Format: XXX-XXX-XXX-XXX
Example: 123-456-789-001

Display Options:
1. Full: "VAT Reg: 123-456-789-001"
2. Short: "VAT: 123-456-789-001"
3. With Label: "VAT Registration No: 123-456-789-001"
```

### Address Layout Patterns

#### Pattern 1: Stacked Address
```
123 Galle Road, Floor 2
Colombo 03, Western Province
Sri Lanka 00300
Tel: +94 11 234 5678
```

#### Pattern 2: Inline Address
```
123 Galle Road, Colombo 03, Sri Lanka
Tel: +94 11 234 5678 | Email: info@example.lk
```

#### Pattern 3: Multi-line with Icons
```
📍 123 Galle Road, Colombo 03
📞 +94 11 234 5678
📧 info@lankacommerce.lk
🌐 www.lankacommerce.lk
```

### Address Display Use Cases

| Business Type | Address | Phone | Email | Website | Tax# |
|--------------|---------|-------|-------|---------|------|
| Retail Store | ✓ | ✓ | ✗ | ✗ | ✓ |
| Restaurant | ✓ | ✓ | ✗ | ✗ | ✓ |
| Online Store | ✗ | ✓ | ✓ | ✓ | ✓ |
| Service Business | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mobile Vendor | ✗ | ✓ | ✗ | ✗ | ✓ |

### Address Separator Styles

#### Style 1: Equal Signs
```
══════════════════════════════════════════════
```

#### Style 2: Dashes
```
------------------------------------------------
```

#### Style 3: Mixed
```
═══════════════════════════════════════════════
```

#### Style 4: Double Line
```
════════════════════════════════════════════════
------------------------------------------------
```

### Expected Outcome
- Flexible address display options
- Support for various contact methods
- VAT registration number display
- Visual separation controls
- Space-optimized layouts

### Verification Checklist
- [ ] show_address field added
- [ ] show_phone field added
- [ ] show_email field added
- [ ] show_website field added
- [ ] show_tax_number field added
- [ ] address_separator field added
- [ ] All fields are BooleanField
- [ ] Appropriate defaults set
- [ ] Model docstring updated

---

## Task 08: Add Item Display Settings

### Overview
Add fields to control how individual items are displayed in the receipt body. These settings determine whether to show product codes, barcodes, per-item taxes, and other item-level details.

### Dependencies
- Task 07: Add address display settings

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add show_sku field**
   - BooleanField, default=False
   - Controls whether product SKU appears
   - Useful for inventory tracking

3. **Add show_barcode field**
   - BooleanField, default=False
   - Controls whether product barcode appears
   - Alternative to SKU

4. **Add show_category field**
   - BooleanField, default=False
   - Controls whether product category appears
   - Useful for detailed receipts

5. **Add show_tax_per_item field**
   - BooleanField, default=False
   - Shows tax amount on each line item
   - Required for detailed tax reporting

6. **Add show_discount_per_item field**
   - BooleanField, default=True
   - Shows discount amount on each item
   - Important for promotional transparency

7. **Add item_description_length field**
   - PositiveIntegerField, default=30
   - Maximum characters for item description
   - Prevents text overflow

8. **Add truncate_description field**
   - BooleanField, default=True
   - Truncates long descriptions with "..."
   - False wraps to next line

9. **Add show_unit_price field**
   - BooleanField, default=True
   - Shows price per unit
   - Important for quantity > 1

10. **Update model docstring**
    - Document item display settings
    - List all item-related fields

### Item Display Settings Structure

```
┌────────────────────────────────────────────────┐
│         Item Display Configuration             │
├────────────────────────────────────────────────┤
│ Product Information:                           │
│  • show_sku (Boolean)                          │
│  • show_barcode (Boolean)                      │
│  • show_category (Boolean)                     │
│                                                │
│ Pricing Details:                               │
│  • show_tax_per_item (Boolean)                 │
│  • show_discount_per_item (Boolean)            │
│  • show_unit_price (Boolean)                   │
│                                                │
│ Description Formatting:                        │
│  • item_description_length (Integer)           │
│  • truncate_description (Boolean)              │
└────────────────────────────────────────────────┘
```

### Item Display Examples

#### Standard Item Display (Minimal)
```
╔════════════════════════════════════════════════╗
║  Item Description          Qty    Price  Total ║
║  ────────────────────────  ───  ───────  ───── ║
║  Rice - Basmati 5kg          2  1,250.00 2,500 ║
║  Dhal - Red Lentils 1kg      1    450.00   450 ║
║  Coconut Oil 1L              3    680.00 2,040 ║
╚════════════════════════════════════════════════╝
```

#### Detailed Item Display (With SKU & Tax)
```
╔════════════════════════════════════════════════╗
║  Description        SKU      Qty  Price   Total ║
║  ─────────────────────────────────────────────  ║
║  Rice - Basmati     RB-5KG    2  1,250   2,500  ║
║    Tax (8%):                              200.00 ║
║                                                  ║
║  Dhal - Red         DL-1KG    1    450     450  ║
║    Tax (8%):                               36.00 ║
╚════════════════════════════════════════════════╝
```

#### Item Display with Discounts
```
╔════════════════════════════════════════════════╗
║  Item Description          Qty    Price  Total ║
║  ────────────────────────  ───  ───────  ───── ║
║  Rice - Basmati 5kg          2  1,250.00 2,500 ║
║    Discount (10%):                       -250.00║
║    Final Price:                          2,250  ║
║                                                 ║
║  Coconut Oil 1L              3    680.00 2,040  ║
║    Bulk Discount:                        -204.00║
║    Final Price:                          1,836  ║
╚════════════════════════════════════════════════╝
```

#### Item Display with Category
```
╔════════════════════════════════════════════════╗
║  Item Description          Qty    Price  Total ║
║  ────────────────────────  ───  ───────  ───── ║
║  [GROCERY]                                      ║
║  Rice - Basmati 5kg          2  1,250.00 2,500 ║
║  Dhal - Red Lentils 1kg      1    450.00   450 ║
║                                                 ║
║  [COOKING ESSENTIALS]                           ║
║  Coconut Oil 1L              3    680.00 2,040 ║
╚════════════════════════════════════════════════╝
```

### Item Description Truncation

#### Truncated (30 characters)
```
Product Name: "Premium Basmati Rice - Imported from India - 5kg Pack"

With Truncation (truncate_description=True):
  Premium Basmati Rice - Imp...  2  1,250  2,500

Without Truncation (truncate_description=False):
  Premium Basmati Rice -         2  1,250  2,500
  Imported from India - 5kg
  Pack
```

### Item Description Length Guidelines

| Paper Size | Recommended Length | Max Width | Notes |
|-----------|-------------------|-----------|-------|
| 58mm | 20 characters | 32 chars | Very compact |
| 80mm | 30 characters | 48 chars | Standard |
| A4 | 50 characters | Variable | Detailed |

### Item Display Layouts

#### Layout 1: Compact (58mm)
```
Description         Qty  Total
Rice 5kg              2  2,500
Dhal 1kg              1    450
Oil 1L                3  2,040
```

#### Layout 2: Standard (80mm)
```
Description                  Qty    Price    Total
Rice - Basmati 5kg            2  1,250.00  2,500.00
Dhal - Red Lentils 1kg        1    450.00    450.00
Coconut Oil 1L                3    680.00  2,040.00
```

#### Layout 3: Detailed (A4)
```
Description                    SKU        Qty   Unit Price   Discount   Tax     Total
Rice - Basmati 5kg            RB-5KG       2    1,250.00    -125.00   200.00  2,375.00
Dhal - Red Lentils 1kg        DL-1KG       1      450.00       0.00    36.00    486.00
Coconut Oil 1L                CO-1L        3      680.00     -68.00   163.20  2,093.20
```

### SKU vs Barcode Display

| Field | Format | Length | Use Case |
|-------|--------|--------|----------|
| SKU | RB-5KG | 6-10 chars | Internal reference |
| Barcode | 5012345678901 | 13 digits | EAN/UPC code |

### Per-Item Tax Display Formats

#### Format 1: Inline Tax
```
Rice - Basmati 5kg       2  1,250  2,500  (Tax: 200.00)
```

#### Format 2: Separate Line
```
Rice - Basmati 5kg       2  1,250  2,500
  VAT 8%:                                200.00
```

#### Format 3: Column
```
Description         Qty  Price   Tax    Total
Rice - Basmati       2  1,250  200.00  2,500
```

### Item Display Configuration Recommendations

| Business Type | SKU | Barcode | Tax/Item | Category | Reason |
|--------------|-----|---------|----------|----------|--------|
| Retail Store | ✗ | ✗ | ✗ | ✗ | Clean, simple |
| Wholesale | ✓ | ✗ | ✓ | ✓ | Detailed tracking |
| Restaurant | ✗ | ✗ | ✗ | ✓ | Menu categories |
| Pharmacy | ✓ | ✓ | ✓ | ✗ | Regulatory needs |
| Electronics | ✓ | ✗ | ✓ | ✓ | Warranty tracking |

### Expected Outcome
- Flexible item information display
- Support for detailed or minimal layouts
- Per-item tax and discount visibility
- Product identification options
- Text overflow handling

### Verification Checklist
- [ ] show_sku field added
- [ ] show_barcode field added
- [ ] show_category field added
- [ ] show_tax_per_item field added
- [ ] show_discount_per_item field added
- [ ] item_description_length field added
- [ ] truncate_description field added
- [ ] show_unit_price field added
- [ ] All BooleanFields have defaults
- [ ] item_description_length is PositiveIntegerField
- [ ] Model docstring updated

---

## Task 09: Add Totals Display Settings

### Overview
Add fields to control how the totals section is displayed on receipts. These settings determine the visibility of subtotals, tax breakdowns, discounts, and various other financial summary elements.

### Dependencies
- Task 08: Add item display settings

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add show_subtotal field**
   - BooleanField, default=True
   - Shows pre-tax subtotal
   - Sum of all items before tax

3. **Add show_tax_breakdown field**
   - BooleanField, default=True
   - Shows detailed tax breakdown by rate
   - Example: VAT 8%, VAT 15%

4. **Add show_total_tax field**
   - BooleanField, default=True
   - Shows total tax amount
   - Sum of all taxes

5. **Add show_total_discount field**
   - BooleanField, default=True
   - Shows total discount amount
   - Sum of all discounts applied

6. **Add show_savings field**
   - BooleanField, default=False
   - Shows "You Saved" message
   - Emphasizes customer savings

7. **Add show_rounding field**
   - BooleanField, default=False
   - Shows rounding adjustment
   - Important for cash transactions in LKR

8. **Add totals_separator field**
   - BooleanField, default=True
   - Adds separator line before totals
   - Visual separation from items

9. **Add bold_grand_total field**
   - BooleanField, default=True
   - Makes grand total bold/emphasized
   - Highlights final amount

10. **Update model docstring**
    - Document totals display settings
    - List all totals-related fields

### Totals Display Settings Structure

```
┌────────────────────────────────────────────────┐
│         Totals Display Configuration           │
├────────────────────────────────────────────────┤
│ Amount Visibility:                             │
│  • show_subtotal (Boolean)                     │
│  • show_tax_breakdown (Boolean)                │
│  • show_total_tax (Boolean)                    │
│  • show_total_discount (Boolean)               │
│  • show_savings (Boolean)                      │
│  • show_rounding (Boolean)                     │
│                                                │
│ Layout Controls:                               │
│  • totals_separator (Boolean)                  │
│  • bold_grand_total (Boolean)                  │
└────────────────────────────────────────────────┘
```

### Totals Display Examples

#### Standard Totals (Full Breakdown)
```
╔════════════════════════════════════════════════╗
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║  Subtotal:                            4,990.00 ║
║  Discount:                             -499.00 ║
║                                                ║
║  VAT 8%:                                359.28 ║
║  VAT 15%:                               674.10 ║
║  Total Tax:                           1,033.38 ║
║                                                ║
║  ────────────────────────────────────────────  ║
║  GRAND TOTAL:                   LKR  5,524.38  ║
║                                                ║
║  You Saved:                             499.00 ║
╚════════════════════════════════════════════════╝
```

#### Minimal Totals (Simple)
```
╔════════════════════════════════════════════════╗
║                                                ║
║  ──────────────────────────────────────────── ║
║                                                ║
║  TOTAL:                             LKR 5,524  ║
╚════════════════════════════════════════════════╝
```

#### Totals with Rounding
```
╔════════════════════════════════════════════════╗
║                                                ║
║  Subtotal:                            4,990.00 ║
║  Tax (8%):                              399.20 ║
║  Total:                               5,389.20 ║
║  Rounding:                                0.80 ║
║                                                ║
║  ────────────────────────────────────────────  ║
║  GRAND TOTAL:                   LKR  5,390.00  ║
╚════════════════════════════════════════════════╝
```

#### Totals with Savings Emphasis
```
╔════════════════════════════════════════════════╗
║                                                ║
║  Subtotal:                            6,500.00 ║
║  Discount (15%):                       -975.00 ║
║  ──────────────────────────────────────────── ║
║  After Discount:                      5,525.00 ║
║  Tax (8%):                              442.00 ║
║  ────────────────────────────────────────────  ║
║  GRAND TOTAL:                   LKR  5,967.00  ║
║                                                ║
║  ★ YOU SAVED LKR 975.00 TODAY! ★              ║
╚════════════════════════════════════════════════╝
```

### Tax Breakdown Formats

#### Single Tax Rate
```
Subtotal:                            4,990.00
VAT (8%):                              399.20
────────────────────────────────────────────
TOTAL:                               5,389.20
```

#### Multiple Tax Rates
```
Subtotal:                            4,990.00

VAT 8% (on LKR 2,490.00):              199.20
VAT 15% (on LKR 2,500.00):             375.00
Total Tax:                             574.20
────────────────────────────────────────────
TOTAL:                               5,564.20
```

#### No Tax Breakdown (Summary Only)
```
Subtotal:                            4,990.00
Tax:                                   399.20
────────────────────────────────────────────
TOTAL:                               5,389.20
```

### Sri Lanka Currency Rounding

```
LKR Rounding Rules (Cash Transactions)
═══════════════════════════════════════

Amounts ending in:
  .00 to .24  → Round down to .00
  .25 to .49  → Round to .50
  .50 to .74  → Keep at .50
  .75 to .99  → Round up to next LKR

Examples:
  5,389.20 → 5,389.00  (Round down 0.20)
  5,389.35 → 5,389.50  (Round to 0.50)
  5,389.50 → 5,389.50  (No change)
  5,389.85 → 5,390.00  (Round up 0.15)

Note: Rounding only applies to cash payments
Card payments use exact amount
```

### Savings Display Formats

#### Format 1: Simple Statement
```
You Saved: LKR 499.00
```

#### Format 2: Emphasized
```
★★★ YOU SAVED LKR 499.00 ★★★
```

#### Format 3: Percentage + Amount
```
You Saved 10% (LKR 499.00) Today!
```

#### Format 4: Multilingual
```
You Saved: LKR 499.00
ඔබ ඉතිරි කළේ: රු. 499.00
நீங்கள் சேமித்தது: ₨ 499.00
```

### Totals Section Layouts

#### Layout 1: Right-Aligned (Standard)
```
Subtotal:                            4,990.00
Discount:                             -499.00
Tax:                                   399.20
────────────────────────────────────────────
TOTAL:                               4,890.20
```

#### Layout 2: Label-Value Pairs
```
Subtotal   :   LKR 4,990.00
Discount   :   LKR  -499.00
Tax (8%)   :   LKR   399.20
─────────────────────────────
TOTAL      :   LKR 4,890.20
```

#### Layout 3: Boxed Total
```
Subtotal:                            4,990.00
Tax:                                   399.20
────────────────────────────────────────────
┌──────────────────────────────────────────┐
│ TOTAL:                   LKR  5,389.20   │
└──────────────────────────────────────────┘
```

### Totals Display Configuration Matrix

| Business Type | Subtotal | Tax Breakdown | Savings | Rounding | Reason |
|--------------|----------|---------------|---------|----------|--------|
| Retail Store | ✓ | ✓ | ✓ | ✓ | Full transparency |
| Restaurant | ✓ | ✗ | ✗ | ✓ | Simple, quick |
| Wholesale | ✓ | ✓ | ✓ | ✗ | Detailed records |
| Pharmacy | ✓ | ✓ | ✗ | ✓ | Tax compliance |
| Online Store | ✓ | ✓ | ✓ | ✗ | No cash rounding |

### Expected Outcome
- Flexible totals presentation
- Tax breakdown visibility
- Discount and savings emphasis
- LKR rounding support
- Professional totals layout

### Verification Checklist
- [ ] show_subtotal field added
- [ ] show_tax_breakdown field added
- [ ] show_total_tax field added
- [ ] show_total_discount field added
- [ ] show_savings field added
- [ ] show_rounding field added
- [ ] totals_separator field added
- [ ] bold_grand_total field added
- [ ] All fields are BooleanField
- [ ] Appropriate defaults set
- [ ] Model docstring updated

---

## Task 10: Add Payment Display Settings

### Overview
Add fields to control how payment information is displayed on receipts. These settings determine the visibility of payment methods, change given, balance due, and other payment-related details.

### Dependencies
- Task 09: Add totals display settings

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add show_payment_method field**
   - BooleanField, default=True
   - Shows payment method used
   - Example: Cash, Card, Mobile Payment

3. **Add show_amount_tendered field**
   - BooleanField, default=True
   - Shows amount customer gave
   - Relevant for cash payments

4. **Add show_change_given field**
   - BooleanField, default=True
   - Shows change returned to customer
   - Only for cash payments

5. **Add show_balance_due field**
   - BooleanField, default=False
   - Shows remaining balance
   - For partial payments or credit

6. **Add show_card_details field**
   - BooleanField, default=False
   - Shows last 4 digits of card
   - Card type and authorization code

7. **Add payment_separator field**
   - BooleanField, default=True
   - Adds separator line before payment section
   - Visual separation from totals

8. **Update model docstring**
   - Document payment display settings
   - List all payment-related fields

### Payment Display Settings Structure

```
┌────────────────────────────────────────────────┐
│        Payment Display Configuration           │
├────────────────────────────────────────────────┤
│ Visibility Controls:                           │
│  • show_payment_method (Boolean)               │
│  • show_amount_tendered (Boolean)              │
│  • show_change_given (Boolean)                 │
│  • show_balance_due (Boolean)                  │
│  • show_card_details (Boolean)                 │
│                                                │
│ Layout Controls:                               │
│  • payment_separator (Boolean)                 │
└────────────────────────────────────────────────┘
```

### Payment Display Examples

#### Cash Payment (Full Details)
```
╔════════════════════════════════════════════════╗
║  GRAND TOTAL:                   LKR  5,390.00  ║
║                                                ║
║ ──────────────────────────────────────────────║
║                                                ║
║  Payment Method:                          CASH ║
║  Amount Tendered:                        6,000 ║
║  Change Given:                             610 ║
╚════════════════════════════════════════════════╝
```

#### Card Payment (Full Details)
```
╔════════════════════════════════════════════════╗
║  GRAND TOTAL:                   LKR  5,390.00  ║
║                                                ║
║ ──────────────────────────────────────────────║
║                                                ║
║  Payment Method:                   VISA CREDIT ║
║  Card Number:                       **** 4532  ║
║  Auth Code:                            458932  ║
║  Transaction ID:                  TXN982374653 ║
╚════════════════════════════════════════════════╝
```

#### Mobile Payment
```
╔════════════════════════════════════════════════╗
║  GRAND TOTAL:                   LKR  5,390.00  ║
║                                                ║
║ ──────────────────────────────────────────────║
║                                                ║
║  Payment Method:                       LANKAQR ║
║  Transaction ID:                  LQR456789012 ║
║  Reference:                       +94771234567 ║
╚════════════════════════════════════════════════╝
```

#### Partial Payment (Balance Due)
```
╔════════════════════════════════════════════════╗
║  GRAND TOTAL:                   LKR  5,390.00  ║
║                                                ║
║ ──────────────────────────────────────────────║
║                                                ║
║  Payment Method:                          CASH ║
║  Amount Paid:                            3,000 ║
║                                                ║
║  BALANCE DUE:                   LKR  2,390.00  ║
║  Due Date:                        2026-02-23   ║
╚════════════════════════════════════════════════╝
```

### Payment Method Types (Sri Lanka)

| Payment Method | Display Name | Details to Show |
|---------------|--------------|-----------------|
| Cash | CASH | Amount tendered, Change |
| Credit Card | VISA/MASTERCARD | Last 4 digits, Auth code |
| Debit Card | DEBIT CARD | Last 4 digits, Auth code |
| Lanka QR | LANKAQR | Transaction ID, Reference |
| Mobile Wallet | MOBILE PAYMENT | Transaction ID, Phone |
| Bank Transfer | BANK TRANSFER | Reference number, Bank |
| Store Credit | STORE CREDIT | Account number, Balance |
| Voucher | GIFT VOUCHER | Voucher code |

### Card Details Display Format

```
Card Payment Display
══════════════════════

Full Details:
  Payment Method:            VISA CREDIT
  Card Number:               **** 4532
  Cardholder:               J. SMITH
  Auth Code:                458932
  Transaction ID:           TXN982374653

Minimal Details:
  Payment Method:            VISA *4532
  Auth Code:                458932
```

### Change Calculation Display

```
Change Calculation
═══════════════════

Example 1: Exact Change
  Total:                     5,390.00
  Tendered:                  5,400.00
  Change:                       10.00

Example 2: Large Note
  Total:                     5,390.00
  Tendered:                 10,000.00
  Change:                    4,610.00

Example 3: Exact Amount
  Total:                     5,390.00
  Tendered:                  5,390.00
  Change:                        0.00
```

### Multiple Payment Methods

```
╔════════════════════════════════════════════════╗
║  GRAND TOTAL:                   LKR  5,390.00  ║
║                                                ║
║ ──────────────────────────────────────────────║
║                                                ║
║  Payment Split:                                ║
║    Cash:                                 3,000 ║
║    VISA Credit (*4532):                  2,390 ║
║                                                ║
║  Total Paid:                             5,390 ║
╚════════════════════════════════════════════════╝
```

### Sri Lanka Mobile Payment Providers

| Provider | Display Name | Reference Format |
|----------|--------------|------------------|
| Lanka QR | LANKAQR | LQR + 12 digits |
| eZ Cash | eZCash | EZ + 10 digits |
| mCash | mCash | MC + 10 digits |
| Genie | Genie | GEN + 10 digits |
| PayHere | PayHere | PH + 12 digits |

### Payment Display Configuration Matrix

| Setting | Cash | Card | Mobile | Partial | Reason |
|---------|------|------|--------|---------|--------|
| show_payment_method | ✓ | ✓ | ✓ | ✓ | Always show |
| show_amount_tendered | ✓ | ✗ | ✗ | ✓ | Cash only |
| show_change_given | ✓ | ✗ | ✗ | ✗ | Cash only |
| show_balance_due | ✗ | ✗ | ✗ | ✓ | Partial only |
| show_card_details | ✗ | ✓ | ✗ | ✗ | Card only |

### Expected Outcome
- Flexible payment information display
- Support for multiple payment types
- Cash change calculation visibility
- Card security (masked numbers)
- Balance due tracking

### Verification Checklist
- [ ] show_payment_method field added
- [ ] show_amount_tendered field added
- [ ] show_change_given field added
- [ ] show_balance_due field added
- [ ] show_card_details field added
- [ ] payment_separator field added
- [ ] All fields are BooleanField
- [ ] Appropriate defaults set
- [ ] Model docstring updated

---

## Task 11: Add Footer Configuration

### Overview
Add footer configuration fields to the ReceiptTemplate model. These fields allow tenants to add custom footer text, such as thank you messages, promotional text, or important notices at the bottom of receipts.

### Dependencies
- Task 10: Add payment display settings

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add footer_line_1 field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - First custom footer line
   - Typically "Thank You" message

3. **Add footer_line_2 field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - Second custom footer line
   - Additional messaging

4. **Add footer_line_3 field**
   - CharField, max_length=200
   - Optional (blank=True, null=True)
   - Third custom footer line
   - More messaging

5. **Add footer_line_1_bold field**
   - BooleanField, default=False
   - Makes first footer line bold

6. **Add footer_line_2_bold field**
   - BooleanField, default=False
   - Makes second footer line bold

7. **Add footer_line_3_bold field**
   - BooleanField, default=False
   - Makes third footer line bold

8. **Add footer_line_1_center field**
   - BooleanField, default=True
   - Centers first footer line

9. **Add footer_line_2_center field**
   - BooleanField, default=True
   - Centers second footer line

10. **Add footer_line_3_center field**
    - BooleanField, default=True
    - Centers third footer line

11. **Add footer_separator field**
    - BooleanField, default=True
    - Adds separator line before footer
    - Visual separation from payment section

12. **Update model docstring**
    - Document footer configuration
    - List all footer-related fields

### Footer Configuration Structure

```
┌────────────────────────────────────────────────┐
│         Footer Configuration                   │
├────────────────────────────────────────────────┤
│ Content Fields:                                │
│  • footer_line_1 (CharField, 200)              │
│  • footer_line_2 (CharField, 200)              │
│  • footer_line_3 (CharField, 200)              │
│                                                │
│ Formatting Fields:                             │
│  • footer_line_1_bold (Boolean)                │
│  • footer_line_2_bold (Boolean)                │
│  • footer_line_3_bold (Boolean)                │
│  • footer_line_1_center (Boolean)              │
│  • footer_line_2_center (Boolean)              │
│  • footer_line_3_center (Boolean)              │
│                                                │
│ Layout Controls:                               │
│  • footer_separator (Boolean)                  │
└────────────────────────────────────────────────┘
```

### Footer Examples

#### Example 1: Thank You Message
```
╔════════════════════════════════════════════════╗
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║          Thank You for Your Purchase!          ║
║            Please Visit Us Again!              ║
╚════════════════════════════════════════════════╝
```

#### Example 2: Promotional Footer
```
╔════════════════════════════════════════════════╗
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║      ★ LOYALTY MEMBERS GET 10% OFF! ★          ║
║        Sign up today at our counter            ║
║       www.lankacommerce.lk/loyalty             ║
╚════════════════════════════════════════════════╝
```

#### Example 3: Multi-language Thank You
```
╔════════════════════════════════════════════════╗
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║              Thank You!                        ║
║             ස්තුතියි!                          ║
║             நன்றி!                             ║
╚════════════════════════════════════════════════╝
```

#### Example 4: Important Notice
```
╔════════════════════════════════════════════════╗
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║    IMPORTANT: Returns accepted within 7 days   ║
║        with original receipt and tags          ║
║           No returns on sale items             ║
╚════════════════════════════════════════════════╝
```

### Footer Content Use Cases

| Use Case | Line 1 | Line 2 | Line 3 | Bold |
|----------|--------|--------|--------|------|
| Standard Thank You | "Thank You!" | "Visit Again" | - | Line 1 |
| Loyalty Program | "Join Loyalty Club" | "Get 10% Off" | "Ask at Counter" | Line 2 |
| Social Media | "Follow Us!" | "@LankaCommerce" | "Share & Win!" | Line 1 |
| Website | "Shop Online" | "www.example.lk" | "24/7 Delivery" | Line 2 |
| Return Policy | "Returns: 7 Days" | "With Receipt" | "Tags Attached" | None |
| Multi-language | "Thank You!" | "ස්තුතියි!" | "நன்றி!" | None |

### Footer Alignment Examples

#### Centered Footer (Default)
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║            Please Visit Us Again!              ║
║       Save your receipt for returns            ║
╚════════════════════════════════════════════════╝
```

#### Left-Aligned Footer
```
╔════════════════════════════════════════════════╗
║ Thank You for Your Purchase!                   ║
║ Please Visit Us Again!                         ║
║ Save your receipt for returns                  ║
╚════════════════════════════════════════════════╝
```

### Sri Lanka-Specific Footer Examples

#### Sinhala Footer
```
╔════════════════════════════════════════════════╗
║           ඔබගේ මිලදී ගැනීමට ස්තුතියි!         ║
║         නැවතත් අප වෙත පිවිසෙන්න               ║
╚════════════════════════════════════════════════╝
```

#### Tamil Footer
```
╔════════════════════════════════════════════════╗
║         உங்கள் வாங்குதலுக்கு நன்றி!            ║
║        மீண்டும் வருகை தாருங்கள்!               ║
╚════════════════════════════════════════════════╝
```

#### Festival Greetings
```
╔════════════════════════════════════════════════╗
║         Happy Sinhala & Tamil New Year!        ║
║      සුභ අලුත් අවුරුද්දක් වේවා!                ║
║      புத்தாண்டு வாழ்த்துக்கள்!                 ║
╚════════════════════════════════════════════════╝
```

### Footer Formatting Combinations

| Footer Style | Bold Lines | Alignment | Use Case |
|-------------|-----------|-----------|----------|
| Emphasis | Line 1 | Centered | Thank you message |
| Promotional | Line 1 & 2 | Centered | Special offers |
| Informational | None | Left | Return policy |
| Branded | Line 2 | Centered | Website/social |
| Festive | All | Centered | Holiday greetings |

### Footer Length Guidelines

| Paper Size | Max Characters | Recommended | Notes |
|-----------|----------------|-------------|-------|
| 58mm | 32 chars | 30 chars | Very compact |
| 80mm | 48 chars | 45 chars | Standard |
| A4 | Variable | 60-80 chars | Full width |

### Footer Separator Styles

#### With Separator
```
║  Change Given:                             610 ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║          Thank You for Your Purchase!          ║
```

#### Without Separator
```
║  Change Given:                             610 ║
║                                                ║
║          Thank You for Your Purchase!          ║
```

### Expected Outcome
- Three customizable footer lines
- Individual formatting control per line
- Text alignment options
- Visual separation from payment section
- Support for promotional and informational content

### Verification Checklist
- [ ] footer_line_1 field added
- [ ] footer_line_2 field added
- [ ] footer_line_3 field added
- [ ] footer_line_1_bold field added
- [ ] footer_line_2_bold field added
- [ ] footer_line_3_bold field added
- [ ] footer_line_1_center field added
- [ ] footer_line_2_center field added
- [ ] footer_line_3_center field added
- [ ] footer_separator field added
- [ ] All content fields max_length=200
- [ ] All content fields optional (blank=True, null=True)
- [ ] Model docstring updated

---

## Task 12: Add Return Policy Field

### Overview
Add a return policy field to the ReceiptTemplate model. This field allows tenants to display their return and exchange policy on receipts, ensuring customers are aware of the terms and conditions.

### Dependencies
- Task 11: Add footer configuration

### Instructions

1. **Open template.py model file**
   - Continue in `apps/pos/receipts/models/template.py`
   - Locate ReceiptTemplate model class

2. **Add show_return_policy field**
   - BooleanField, default=False
   - Controls whether return policy appears
   - Placed after footer lines

3. **Add return_policy_text field**
   - TextField
   - Optional (blank=True, null=True)
   - Full return policy text
   - Can be multiple lines

4. **Add return_policy_heading field**
   - CharField, max_length=100
   - Optional (blank=True, null=True)
   - Heading for return policy section
   - Default: "Return Policy"

5. **Add return_policy_bold_heading field**
   - BooleanField, default=True
   - Makes return policy heading bold
   - Emphasizes section

6. **Add return_policy_separator field**
   - BooleanField, default=True
   - Adds separator line before return policy
   - Visual separation

7. **Update model docstring**
   - Document return policy functionality
   - List all return policy fields

### Return Policy Field Structure

```
┌────────────────────────────────────────────────┐
│         Return Policy Configuration            │
├────────────────────────────────────────────────┤
│ Visibility:                                    │
│  • show_return_policy (Boolean)                │
│                                                │
│ Content:                                       │
│  • return_policy_text (TextField)              │
│  • return_policy_heading (CharField, 100)      │
│                                                │
│ Formatting:                                    │
│  • return_policy_bold_heading (Boolean)        │
│  • return_policy_separator (Boolean)           │
└────────────────────────────────────────────────┘
```

### Return Policy Display Examples

#### Standard Return Policy
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║            Please Visit Us Again!              ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║               RETURN POLICY                    ║
║                                                ║
║  • Returns accepted within 7 days              ║
║  • Original receipt required                   ║
║  • Items must be in original condition         ║
║  • Tags and packaging must be intact           ║
║  • No returns on sale items                    ║
╚════════════════════════════════════════════════╝
```

#### Compact Return Policy
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║                                                ║
║ ──────────────────────────────────────────────║
║                                                ║
║  Returns: 7 days with receipt & original tags  ║
╚════════════════════════════════════════════════╝
```

#### Detailed Return Policy
```
╔════════════════════════════════════════════════╗
║          Thank You for Your Purchase!          ║
║                                                ║
║ ══════════════════════════════════════════════ ║
║                                                ║
║           RETURNS & EXCHANGES                  ║
║                                                ║
║  RETURN PERIOD:                                ║
║  7 days from date of purchase                  ║
║                                                ║
║  REQUIREMENTS:                                 ║
║  • Original receipt (this document)            ║
║  • Unused items in original packaging          ║
║  • All tags must be attached                   ║
║                                                ║
║  REFUND METHOD:                                ║
║  Same payment method as original purchase      ║
║                                                ║
║  EXCLUSIONS:                                   ║
║  • Sale items are final sale                   ║
║  • Perishable goods                            ║
║  • Custom/personalized items                   ║
╚════════════════════════════════════════════════╝
```

### Sri Lanka Return Policy Examples

#### Example 1: Standard Retail
```
RETURN POLICY

Returns accepted within 7 days of purchase.
Original receipt and tags required.
Items must be unused and in original packaging.
Sale items and perishable goods are final sale.
Refunds issued in original payment method.
```

#### Example 2: Electronics Store
```
RETURNS & WARRANTY

30-day return period for defective items.
Original receipt and packaging required.
All accessories and manuals must be included.
Manufacturer warranty applies after 30 days.
No returns on software or opened media.
```

#### Example 3: Clothing Store
```
EXCHANGE & RETURN POLICY

14-day return period with receipt.
Items must have original tags attached.
Free exchanges for size and color.
Refunds in store credit or original payment.
Discounted items are final sale.
```

#### Example 4: Food & Beverage
```
RETURN POLICY

Returns accepted for quality issues only.
Must notify within 24 hours of purchase.
Bring item and receipt to store.
Refund or replacement at our discretion.
Perishable items cannot be returned after leaving premises.
```

### Return Policy Content Guidelines

| Business Type | Return Period | Key Requirements | Exclusions |
|--------------|--------------|------------------|------------|
| General Retail | 7-14 days | Receipt, tags | Sale items |
| Electronics | 30 days | Packaging, accessories | Software |
| Clothing | 14-30 days | Tags, unworn | Intimate apparel |
| Food/Beverage | Same day | Quality issues only | All (generally) |
| Pharmacy | No returns | N/A | All medications |
| Books | 7 days | Unwrapped, unmarked | None |

### Return Policy Formatting Options

#### Format 1: Bullet Points
```
RETURN POLICY

• Returns accepted within 7 days
• Original receipt required
• Items in original condition
• Tags must be attached
```

#### Format 2: Numbered List
```
RETURN POLICY

1. Return within 7 days of purchase
2. Present original receipt
3. Ensure items are unused
4. Keep all original packaging
```

#### Format 3: Paragraph Form
```
RETURN POLICY

All returns must be made within 7 days of 
purchase with original receipt. Items must 
be unused, in original packaging, with tags 
attached. Sale items are final sale.
```

### Multi-language Return Policies

#### English + Sinhala
```
RETURN POLICY / ආපසු ගෙන්වා දීමේ ප්‍රතිපත්තිය

Returns accepted within 7 days with receipt.
මුල් රිසිට් පත සමඟ දින 7ක් ඇතුළත ආපසු ගෙන්වා දිය හැක.
```

#### English + Tamil
```
RETURN POLICY / திரும்பப்பெறும் கொள்கை

Returns accepted within 7 days with receipt.
ரசீது உடன் 7 நாட்களுக்குள் திருப்பித் தரலாம்.
```

### Return Policy Length Considerations

| Paper Size | Recommended Length | Notes |
|-----------|-------------------|-------|
| 58mm | 3-4 short lines | Very brief |
| 80mm | 5-8 lines | Standard detail |
| A4 | Full policy | Complete terms |

### Default Return Policy Template

```
RETURN POLICY

• Returns accepted within 7 days of purchase
• Original receipt must be presented
• Items must be unused and in original condition
• All tags and packaging must be intact
• Refunds issued in original payment method
• Sale items and perishable goods are final sale

For questions, contact us at:
[Phone] | [Email]
```

### Expected Outcome
- Optional return policy display
- Customizable policy text
- Custom section heading
- Visual formatting control
- Multi-line policy support

### Verification Checklist
- [ ] show_return_policy field added
- [ ] return_policy_text field added (TextField)
- [ ] return_policy_heading field added
- [ ] return_policy_bold_heading field added
- [ ] return_policy_separator field added
- [ ] All Boolean fields have defaults
- [ ] Text fields optional (blank=True, null=True)
- [ ] Model docstring updated

---

## Summary

This document implemented comprehensive display settings for receipt templates:

### Completed Configuration
- ✅ Address display settings (address, phone, email, website, tax number)
- ✅ Item display settings (SKU, barcode, tax per item, discounts)
- ✅ Totals display settings (subtotal, tax breakdown, savings, rounding)
- ✅ Payment display settings (payment method, change, card details)
- ✅ Footer configuration (3 customizable lines with formatting)
- ✅ Return policy field (heading, text, separator)

### Key Achievements
1. **Flexible Display Control** - Granular visibility settings for all receipt sections
2. **Sri Lanka Localization** - LKR rounding, VAT display, local payment methods
3. **Multi-language Support** - Sinhala and Tamil text in headers and footers
4. **Professional Layouts** - Separators, bold text, alignment options
5. **Business Compliance** - Tax number display, return policy documentation

### Next Steps
Proceed to [03_Tasks-13-16_QR-Font-Inheritance-Admin.md](03_Tasks-13-16_QR-Font-Inheritance-Admin.md) to implement QR code settings, font configuration, template inheritance, and Django admin interface.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1390
