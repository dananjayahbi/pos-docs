# Tasks 29-34: Calculation Service and Signals

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** B - PO Line Items & Calculations  
> **Document:** 02 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-28_Line-Item-Model.md](01_Tasks-19-28_Line-Item-Model.md)

---

## Document Overview

This document implements the calculation service that handles all purchase order financial calculations, including line totals, tax aggregation, and grand totals. It also sets up automatic recalculation through Django signals and implements vendor price lookup functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Create PO Calculation Service | High | 30 min |
| 30 | Implement Line Total Calculator | Medium | 25 min |
| 31 | Implement PO Tax Calculator | Medium | 25 min |
| 32 | Implement PO Grand Total | Medium | 25 min |
| 33 | Create PO Recalculation Signal | Medium | 25 min |
| 34 | Implement Vendor Price Lookup | Medium | 25 min |

---

## Task 29: Create PO Calculation Service

### Overview
Create a centralized calculation service class that handles all purchase order financial calculations. This service provides methods for calculating line totals, taxes, and PO totals with proper decimal precision.

### Dependencies
- Group A: PurchaseOrder model complete
- Tasks 19-28: POLineItem model complete

### Instructions

1. **Create calculation_service.py file**
   - Navigate to `apps/purchases/services/` directory
   - Create `calculation_service.py` file
   - Add comprehensive module docstring

2. **Import required modules**
   - Import Decimal from decimal module
   - Import PurchaseOrder and POLineItem models
   - Import Django transaction module
   - Import F expressions for database queries

3. **Create POCalculationService class**
   - Define class with class methods or instance methods
   - Add class docstring explaining purpose
   - Design for stateless operation

4. **Add calculate_line_total static method**
   - Accept line item parameters (unit_price, quantity, discount, tax)
   - Return calculated line total
   - Handle discount percentage vs fixed amount
   - Apply tax after discount
   - Return Decimal with 2 decimal places

5. **Add calculate_line_tax static method**
   - Calculate tax amount for line item
   - Use after-discount price as base
   - Return Decimal with 2 decimal places

6. **Add calculate_po_subtotal method**
   - Accept PurchaseOrder instance
   - Sum all line_total values from line_items
   - Return Decimal subtotal

7. **Add calculate_po_tax method**
   - Accept PurchaseOrder instance
   - Sum all tax_amount values from line_items
   - Return Decimal tax total

8. **Add calculate_po_total method**
   - Accept PurchaseOrder instance
   - Calculate: subtotal - order_discount + tax + shipping
   - Apply order-level discount if present
   - Return Decimal grand total

9. **Add recalculate_po method**
   - Accept PurchaseOrder instance
   - Recalculate all line totals first
   - Update PO subtotal, tax_amount, total
   - Save PurchaseOrder
   - Use transaction for atomicity

10. **Update services __init__.py**
    - Import POCalculationService
    - Export for use in other modules

### Service Methods Summary

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| calculate_line_total | Line params | Decimal | Line item total |
| calculate_line_tax | Line params | Decimal | Line tax amount |
| calculate_po_subtotal | PurchaseOrder | Decimal | Sum of lines |
| calculate_po_tax | PurchaseOrder | Decimal | Total tax |
| calculate_po_total | PurchaseOrder | Decimal | Grand total |
| recalculate_po | PurchaseOrder | None | Full recalc |

### Calculation Service Structure
```
POCalculationService
├── calculate_line_total(unit_price, qty, discount, tax)
├── calculate_line_tax(subtotal, tax_rate)
├── calculate_po_subtotal(purchase_order)
├── calculate_po_tax(purchase_order)
├── calculate_po_total(purchase_order)
└── recalculate_po(purchase_order)
```

### Decimal Precision Handling

| Operation | Precision | Rounding |
|-----------|-----------|----------|
| Unit price | 2 decimals | Half-up |
| Discount calculation | 2 decimals | Half-up |
| Tax calculation | 2 decimals | Half-up |
| Line total | 2 decimals | Half-up |
| PO total | 2 decimals | Half-up |

### Service Usage Example Flow
```
Create PO:
1. Add line items with prices
2. Call POCalculationService.recalculate_po(po)
3. PO totals updated automatically

Update Line:
1. Modify line quantity or price
2. Service recalculates line total
3. Signal triggers PO recalculation
4. All totals updated
```

### Expected Outcome
- Centralized calculation logic
- Consistent financial calculations
- Proper decimal handling
- Reusable calculation methods

### Verification Checklist
- [ ] calculation_service.py created
- [ ] POCalculationService class defined
- [ ] All calculation methods implemented
- [ ] Decimal precision correct
- [ ] Service exported in __init__.py
- [ ] Methods documented

---

## Task 30: Implement Line Total Calculator

### Overview
Implement the detailed line total calculation logic that handles unit price, quantity, discounts, and taxes with proper decimal precision and business rules.

### Dependencies
- Task 29: Create PO Calculation Service

### Instructions

1. **Implement calculate_line_total method**
   - Accept parameters: unit_price, quantity, discount_pct, discount_amt, tax_rate
   - All parameters as Decimal type
   - Return final line total

2. **Calculate base amount**
   - Multiply unit_price by quantity
   - Ensure Decimal precision maintained

3. **Apply discount logic**
   - Check if discount_percentage > 0
   - If yes: calculate discount = base_amount × (discount_pct / 100)
   - If no: calculate discount = discount_amount × quantity
   - Subtract discount from base_amount

4. **Calculate subtotal after discount**
   - subtotal = base_amount - discount
   - This is the taxable amount

5. **Calculate tax amount**
   - tax = subtotal × (tax_rate / 100)
   - Round to 2 decimal places

6. **Calculate line total**
   - line_total = subtotal + tax
   - Round to 2 decimal places
   - Return value

7. **Add validation**
   - Ensure no negative values
   - Check discount doesn't exceed base amount
   - Validate tax rate within reasonable range (0-100)

8. **Add method to POLineItem model**
   - Update POLineItem.calculate_total() to use service
   - Call POCalculationService.calculate_line_total()
   - Update self.line_total with result

### Line Total Calculation Formula

```
Step 1: Base Amount
base_amount = unit_price × quantity_ordered

Step 2: Apply Discount
if discount_percentage > 0:
    discount = base_amount × (discount_percentage / 100)
else:
    discount = discount_amount × quantity_ordered

Step 3: Subtotal After Discount
subtotal = base_amount - discount

Step 4: Calculate Tax
tax_amount = subtotal × (tax_rate / 100)

Step 5: Line Total
line_total = subtotal + tax_amount
```

### Calculation Examples

| Case | Unit Price | Qty | Discount % | Tax % | Line Total |
|------|------------|-----|------------|-------|------------|
| Simple | 1,000 | 10 | 0 | 0 | 10,000.00 |
| With discount | 1,000 | 10 | 10 | 0 | 9,000.00 |
| With tax | 1,000 | 10 | 0 | 18 | 11,800.00 |
| Full calc | 1,000 | 10 | 10 | 18 | 10,620.00 |

### Step-by-Step Example
```
Samsung TV Line Item:
├── Unit Price: Rs. 85,000.00
├── Quantity: 10
├── Discount: 5%
└── Tax Rate: 18%

Calculation:
├── Base: 85,000.00 × 10 = 850,000.00
├── Discount: 850,000.00 × 5% = 42,500.00
├── Subtotal: 850,000.00 - 42,500.00 = 807,500.00
├── Tax: 807,500.00 × 18% = 145,350.00
└── Line Total: 807,500.00 + 145,350.00 = 952,850.00
```

### Discount Priority Rules

| Scenario | Rule | Reason |
|----------|------|--------|
| Both set | Use percentage | More flexible |
| Only percentage | Calculate from percentage | Standard |
| Only amount | Use fixed amount | Special pricing |
| Neither set | No discount | Default |

### Validation Rules

| Rule | Check | Action |
|------|-------|--------|
| Negative price | unit_price < 0 | Raise error |
| Zero quantity | quantity == 0 | Raise error |
| Excessive discount | discount > base | Raise error |
| Invalid tax | tax_rate < 0 or > 100 | Raise error |

### Expected Outcome
- Accurate line total calculations
- Proper discount application
- Correct tax calculations
- Decimal precision maintained

### Verification Checklist
- [ ] calculate_line_total method complete
- [ ] Discount logic implemented
- [ ] Tax calculation correct
- [ ] Validation rules added
- [ ] POLineItem.calculate_total() updated
- [ ] Test calculations verified

---

## Task 31: Implement PO Tax Calculator

### Overview
Implement tax calculation aggregation that sums tax amounts from all line items and handles order-level tax adjustments if needed.

### Dependencies
- Task 29: Create PO Calculation Service
- Task 30: Implement Line Total Calculator

### Instructions

1. **Implement calculate_po_tax method**
   - Accept PurchaseOrder instance as parameter
   - Query all line_items for the PO
   - Aggregate tax_amount from all lines
   - Return total tax as Decimal

2. **Use Django aggregation**
   - Use Sum aggregation on line_items.tax_amount
   - Handle None result (no line items)
   - Return Decimal('0.00') if no items

3. **Add order-level tax adjustment**
   - Check if PO has order-level tax adjustment field
   - Add/subtract adjustment to aggregated tax
   - Support tax corrections or rounding adjustments

4. **Handle tax exemptions**
   - Check if PO is tax-exempt
   - Return zero if exempt flag set
   - Document exemption scenarios

5. **Add tax breakdown method**
   - Create get_tax_breakdown(purchase_order) method
   - Return dictionary with tax by rate
   - Group line items by tax_rate
   - Sum tax_amount for each rate

6. **Update PO model**
   - Add update_tax_amount() method to PurchaseOrder
   - Call calculation service
   - Save updated tax_amount

### PO Tax Calculation

```python
def calculate_po_tax(purchase_order):
    # Aggregate line item taxes
    line_tax = purchase_order.line_items.aggregate(
        total_tax=Sum('tax_amount')
    )['total_tax'] or Decimal('0.00')
    
    # Add order-level adjustment
    order_tax = line_tax + (purchase_order.tax_adjustment or Decimal('0.00'))
    
    # Check exemption
    if purchase_order.is_tax_exempt:
        return Decimal('0.00')
    
    return order_tax.quantize(Decimal('0.01'))
```

### Tax Aggregation Example

```
PO-2026-00001 Tax Calculation:
├── Line 1 Tax: Rs. 145,350.00 (18%)
├── Line 2 Tax: Rs. 45,000.00 (18%)
├── Line 3 Tax: Rs. 12,600.00 (12%)
│
├── Total Line Tax: Rs. 202,950.00
├── Order Adjustment: Rs. 0.00
└── PO Tax Amount: Rs. 202,950.00
```

### Tax Breakdown Structure

```python
{
    '18.0': {
        'rate': Decimal('18.00'),
        'taxable_amount': Decimal('1057500.00'),
        'tax_amount': Decimal('190350.00'),
        'line_count': 2
    },
    '12.0': {
        'rate': Decimal('12.00'),
        'taxable_amount': Decimal('105000.00'),
        'tax_amount': Decimal('12600.00'),
        'line_count': 1
    }
}
```

### Tax Scenarios

| Scenario | Handling |
|----------|----------|
| Standard | Sum all line taxes |
| Mixed rates | Sum all, breakdown by rate |
| Tax-exempt | Return 0.00 |
| No line items | Return 0.00 |
| Rounding adjustment | Add adjustment amount |

### Expected Outcome
- Accurate tax aggregation
- Tax breakdown by rate
- Order-level adjustments supported
- Tax exemption handling

### Verification Checklist
- [ ] calculate_po_tax method implemented
- [ ] Django aggregation used
- [ ] Order-level adjustments handled
- [ ] Tax exemption logic added
- [ ] Tax breakdown method created
- [ ] PO update method added

---

## Task 32: Implement PO Grand Total

### Overview
Implement the grand total calculation that combines subtotal, applies order-level discounts, adds taxes and shipping costs to produce the final PO total.

### Dependencies
- Task 29: Create PO Calculation Service
- Task 30: Implement Line Total Calculator
- Task 31: Implement PO Tax Calculator

### Instructions

1. **Implement calculate_po_total method**
   - Accept PurchaseOrder instance
   - Calculate complete grand total
   - Include all components
   - Return Decimal total

2. **Calculate subtotal component**
   - Call calculate_po_subtotal()
   - Sum all line_total values

3. **Apply order-level discount**
   - Check if PO has discount_percentage or discount_amount
   - Calculate discount on subtotal
   - Subtract from subtotal

4. **Add tax component**
   - Call calculate_po_tax()
   - Tax calculated on after-discount amount

5. **Add shipping cost**
   - Add PO.shipping_cost field value
   - Default to 0.00 if not set

6. **Add other charges**
   - Include any additional charges fields
   - Handling fees, insurance, etc.

7. **Calculate grand total**
   - Formula: subtotal - order_discount + tax + shipping + other
   - Round to 2 decimal places

8. **Update PO fields**
   - Set PO.subtotal
   - Set PO.tax_amount
   - Set PO.total
   - Save PurchaseOrder

9. **Add validation**
   - Ensure total >= 0
   - Check all components non-negative
   - Validate order discount doesn't exceed subtotal

### Grand Total Formula

```
PO Total Calculation:
├── Line Items Subtotal: Sum(line_total)
├── Order Discount: -discount_amount or -(subtotal × discount_%)
├── Tax Amount: Sum(line_tax)
├── Shipping Cost: +shipping_cost
├── Other Charges: +handling_fee, +insurance
└── Grand Total: subtotal - discount + tax + shipping + other
```

### Calculation Flow Diagram

```
Line Item 1 Total
Line Item 2 Total  ──→ Subtotal
Line Item N Total

                    ↓
              Apply Order Discount
                    ↓
              After Discount
                    ↓
              Add Tax Amount
                    ↓
            Add Shipping Cost
                    ↓
            Add Other Charges
                    ↓
              GRAND TOTAL
```

### Complete PO Total Example

```
PO-2026-00001 Total Calculation:

Line Items:
├── Line 1: Rs. 952,850.00
├── Line 2: Rs. 341,100.00
└── Line 3: Rs. 117,600.00
                            
Subtotal:                   Rs. 1,411,550.00

Order Discount (3%):        Rs.   -42,346.50
                            ─────────────────
After Discount:             Rs. 1,369,203.50

Tax (calculated on lines):  Rs.   202,950.00
Shipping Cost:              Rs.     5,000.00
                            ─────────────────
GRAND TOTAL:                Rs. 1,577,153.50
```

### Total Components Summary

| Component | Source | Example |
|-----------|--------|---------|
| Subtotal | Sum(line_total) | Rs. 1,411,550.00 |
| Order Discount | discount % or amount | Rs. -42,346.50 |
| Tax | Sum(line_tax) | Rs. 202,950.00 |
| Shipping | shipping_cost field | Rs. 5,000.00 |
| Total | Calculated | Rs. 1,577,153.50 |

### Order Discount Application

| Type | Calculation | Priority |
|------|-------------|----------|
| Percentage | subtotal × (percentage / 100) | If > 0, use this |
| Fixed Amount | discount_amount | If percentage = 0 |
| None | 0.00 | Both = 0 |

### Expected Outcome
- Accurate grand total calculation
- All cost components included
- Order-level discount applied
- Complete financial picture

### Verification Checklist
- [ ] calculate_po_total method implemented
- [ ] Subtotal calculation included
- [ ] Order discount applied
- [ ] Tax added correctly
- [ ] Shipping cost included
- [ ] PO fields updated
- [ ] Validation rules added

---

## Task 33: Create PO Recalculation Signal

### Overview
Implement Django signals that automatically trigger purchase order recalculation when line items are created, updated, or deleted. This ensures PO totals are always synchronized with line item changes.

### Dependencies
- Task 29: Create PO Calculation Service
- Tasks 30-32: All calculation methods implemented

### Instructions

1. **Create signals.py file**
   - Navigate to `apps/purchases/` directory
   - Create `signals.py` file
   - Add module docstring

2. **Import required modules**
   - Import post_save, post_delete signals
   - Import receiver decorator
   - Import POLineItem model
   - Import POCalculationService
   - Import transaction module

3. **Create line_item_saved signal handler**
   - Use @receiver decorator with post_save
   - Connect to POLineItem sender
   - Accept sender, instance, created, kwargs parameters
   - Get associated PurchaseOrder
   - Call POCalculationService.recalculate_po()

4. **Create line_item_deleted signal handler**
   - Use @receiver decorator with post_delete
   - Connect to POLineItem sender
   - Accept sender, instance, kwargs parameters
   - Get PurchaseOrder from deleted instance
   - Call recalculation service

5. **Add signal optimization**
   - Check if update actually affects calculations
   - Skip recalculation for timestamp-only updates
   - Use update_fields to detect price/quantity changes

6. **Handle edge cases**
   - Check if PO still exists before recalculating
   - Handle cascading deletes properly
   - Avoid infinite recursion

7. **Add transaction handling**
   - Wrap recalculation in transaction
   - Ensure atomicity
   - Rollback on errors

8. **Register signals**
   - Import signals in apps.py ready() method
   - Ensure signals connected on app startup

9. **Add signal documentation**
   - Document when signals fire
   - Explain recalculation triggers
   - Note performance implications

10. **Create manual recalculate command**
    - Add management command for manual recalculation
    - Useful for data migrations or fixes
    - Recalculate all or specific POs

### Signal Structure

```python
@receiver(post_save, sender=POLineItem)
def recalculate_on_line_save(sender, instance, created, **kwargs):
    """Recalculate PO totals when line item saved"""
    if instance.purchase_order:
        POCalculationService.recalculate_po(instance.purchase_order)

@receiver(post_delete, sender=POLineItem)
def recalculate_on_line_delete(sender, instance, **kwargs):
    """Recalculate PO totals when line item deleted"""
    try:
        if instance.purchase_order_id:
            po = PurchaseOrder.objects.get(id=instance.purchase_order_id)
            POCalculationService.recalculate_po(po)
    except PurchaseOrder.DoesNotExist:
        pass
```

### Signal Trigger Events

| Event | Signal | Action |
|-------|--------|--------|
| Add line item | post_save (created=True) | Recalculate PO |
| Update line item | post_save (created=False) | Recalculate PO |
| Delete line item | post_delete | Recalculate PO |
| Bulk update | Multiple post_save | Multiple recalcs |

### Signal Flow

```
User Action: Add Line Item
     ↓
POLineItem.save() called
     ↓
post_save signal fires
     ↓
Signal handler executes
     ↓
POCalculationService.recalculate_po()
     ↓
├── Recalculate all line totals
├── Sum to get subtotal
├── Calculate tax
├── Add shipping
├── Update PO.subtotal
├── Update PO.tax_amount
└── Update PO.total
     ↓
PO.save() (updated totals)
```

### Optimization Strategies

| Strategy | Purpose |
|----------|---------|
| Check update_fields | Skip if no price/qty change |
| Debounce | Batch multiple updates |
| Async | Use Celery for large POs |
| Selective | Only recalc affected fields |

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| PO deleted | Check existence before recalc |
| Cascade delete | Handle in post_delete |
| Bulk operations | May fire multiple times |
| Import/migration | Disable signals temporarily |

### Expected Outcome
- Automatic PO recalculation
- Always synchronized totals
- No manual calculation needed
- Transparent to users

### Verification Checklist
- [ ] signals.py file created
- [ ] post_save signal handler implemented
- [ ] post_delete signal handler implemented
- [ ] Edge cases handled
- [ ] Transaction safety ensured
- [ ] Signals registered in apps.py
- [ ] Optimization added
- [ ] Documentation complete

---

## Task 34: Implement Vendor Price Lookup

### Overview
Implement automatic vendor price lookup that pre-fills unit price and vendor SKU when adding products to a purchase order based on vendor-product relationships.

### Dependencies
- Task 29: Create PO Calculation Service
- VendorProduct model exists (from vendors app)

### Instructions

1. **Add lookup_vendor_price method to service**
   - Add to POCalculationService or create new service
   - Accept vendor and product as parameters
   - Query VendorProduct model
   - Return price and SKU information

2. **Query VendorProduct model**
   - Filter by vendor and product
   - Get unit_cost field
   - Get vendor_sku field
   - Get lead_time_days field

3. **Handle missing vendor product**
   - Return None if no VendorProduct found
   - Return product's default cost as fallback
   - Log warning for missing vendor pricing

4. **Calculate expected delivery date**
   - Use lead_time_days from VendorProduct
   - Add to current date
   - Return suggested expected_delivery_date

5. **Create populate_from_product method**
   - Add to POLineItem model or service
   - Accept product and vendor
   - Call lookup_vendor_price
   - Auto-fill unit_price, vendor_sku, expected_delivery_date

6. **Add to line item creation**
   - When creating POLineItem with product
   - Check if unit_price is not provided
   - Automatically look up from vendor
   - Fill in vendor pricing

7. **Handle preferred vendor**
   - Check product's preferred_vendor
   - Suggest using preferred vendor
   - Show price comparison if different vendor

8. **Add price history tracking**
   - Log when prices fetched from vendor
   - Track price changes over time
   - Alert if price increased significantly

9. **Create API endpoint for price lookup**
   - Add endpoint /api/purchases/vendor-price/
   - Accept vendor_id and product_id
   - Return pricing information
   - Use in frontend for real-time lookup

10. **Add bulk price lookup**
    - Create method for multiple products
    - Optimize queries with select_related
    - Return dictionary of prices
    - Use when creating PO from multiple items

### Vendor Price Lookup Flow

```
Add Product to PO:
1. User selects vendor (ABC Electronics)
2. User selects product (Samsung TV)
3. System queries VendorProduct
4. Found: unit_cost = Rs. 85,000, vendor_sku = "ABC-TV-55", lead_time = 10 days
5. Auto-fill:
   ├── unit_price = Rs. 85,000
   ├── vendor_sku = "ABC-TV-55"
   └── expected_delivery_date = today + 10 days
6. User can override if needed
```

### VendorProduct Model Reference

```
VendorProduct fields:
├── vendor (FK)
├── product (FK)
├── vendor_sku (CharField)
├── unit_cost (DecimalField)
├── lead_time_days (IntegerField)
├── minimum_order_quantity (IntegerField)
└── is_preferred (BooleanField)
```

### Price Lookup Method

```python
def lookup_vendor_price(vendor, product, variant=None):
    """Look up vendor pricing for product"""
    try:
        query = VendorProduct.objects.get(
            vendor=vendor,
            product=product
        )
        
        return {
            'unit_price': query.unit_cost,
            'vendor_sku': query.vendor_sku,
            'lead_time_days': query.lead_time_days,
            'minimum_order_qty': query.minimum_order_quantity,
            'expected_delivery': date.today() + timedelta(days=query.lead_time_days)
        }
    except VendorProduct.DoesNotExist:
        return None
```

### Lookup Scenarios

| Scenario | Result |
|----------|--------|
| VendorProduct exists | Return vendor pricing |
| Multiple entries | Return most recent |
| No VendorProduct | Return product default cost |
| Variant-specific | Look up variant pricing |

### Price Comparison

```
Product: Samsung TV 55"

Vendor A (ABC Electronics):
├── Unit Cost: Rs. 85,000
├── Lead Time: 10 days
└── Preferred: Yes

Vendor B (XYZ Imports):
├── Unit Cost: Rs. 82,000 (BETTER)
├── Lead Time: 15 days
└── Preferred: No

System suggests: "Vendor B has lower price but longer lead time"
```

### API Response Structure

```json
{
  "vendor_id": "uuid",
  "product_id": "uuid",
  "unit_price": 85000.00,
  "vendor_sku": "ABC-TV-55",
  "lead_time_days": 10,
  "expected_delivery_date": "2026-01-25",
  "minimum_order_quantity": 5,
  "is_preferred": true,
  "last_purchase_price": 83000.00,
  "price_change_percentage": 2.41
}
```

### Expected Outcome
- Automatic price lookup
- Pre-filled vendor SKU
- Calculated delivery dates
- Faster PO creation

### Verification Checklist
- [ ] lookup_vendor_price method implemented
- [ ] VendorProduct query logic added
- [ ] Expected delivery calculation included
- [ ] populate_from_product method created
- [ ] Missing price handling added
- [ ] API endpoint created (optional)
- [ ] Bulk lookup implemented
- [ ] Price comparison logic added

---

## Summary

This document implemented all calculation and automation features:

| Accomplishment | Impact |
|----------------|--------|
| Calculation Service | Centralized financial logic |
| Line Total Calculator | Accurate item pricing |
| Tax Calculator | Proper tax aggregation |
| Grand Total | Complete PO total |
| Recalculation Signals | Automatic updates |
| Vendor Price Lookup | Faster PO creation |

### Group B Complete
All 16 tasks completed:
- ✅ POLineItem model with 26 fields
- ✅ Complete calculation service
- ✅ Line total calculations
- ✅ Tax aggregation
- ✅ Grand total calculation
- ✅ Automatic recalculation signals
- ✅ Vendor price lookup

### Next Steps
- **Group C**: Implement PO creation workflows, status transitions, and approval
- Build PO service layer for business operations
- Add history tracking and settings

---

## Validation Points

Before proceeding to Group C:
- [ ] All 6 tasks completed
- [ ] Calculation service fully implemented
- [ ] All calculation methods tested
- [ ] Signals working correctly
- [ ] Automatic recalculation verified
- [ ] Vendor price lookup functional
- [ ] Decimal precision maintained
- [ ] Ready for PO service layer
