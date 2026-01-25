# Tasks 25-34: VATReturn Generator

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** B - VAT Return  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_VATReturn-Model.md](01_Tasks-17-24_VATReturn-Model.md)

---

## Document Overview

This document covers the creation of the VATReturnGenerator service class, which automatically calculates VAT return data from sales and purchase invoices. The generator queries invoices for a specific period, groups transactions by VAT rate and category, calculates output and input VAT, handles zero-rated and exempt sales, applies SVAT adjustments, and generates IRD-compliant PDF and CSV exports.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Create VATReturnGenerator | High | 45 min |
| 26 | Add get sales VAT method | Medium | 35 min |
| 27 | Add get purchase VAT method | Medium | 35 min |
| 28 | Add get zero-rated sales | Medium | 30 min |
| 29 | Add get exempt sales | Medium | 30 min |
| 30 | Add SVAT calculation | High | 40 min |
| 31 | Create VAT return PDF template | Medium | 35 min |
| 32 | Create VAT return CSV export | Medium | 30 min |
| 33 | Add VAT summary by rate | Low | 20 min |
| 34 | Create VAT return API endpoint | Low | 25 min |

---

## Task 25: Create VATReturnGenerator

### Overview
Create the VATReturnGenerator service class that generates VAT return data from sales and purchase invoices. This class serves as the main orchestrator, coordinating all VAT calculations, validations, and return generation for a specific tax period.

### Dependencies
- Task 24: VATReturn model with migrations
- Sales Invoice model exists
- Purchase Invoice model exists
- TaxPeriod model exists

### Instructions

1. **Create generators directory**
   - Navigate to `apps/accounting/tax/`
   - Create directory named `generators`
   - This will house tax calculation services

2. **Create package initialization**
   - Create `__init__.py` in `generators/` directory
   - Will import generator classes later

3. **Create vat_return.py generator file**
   - Create file at `apps/accounting/tax/generators/vat_return.py`
   - This will contain VATReturnGenerator class

4. **Import required dependencies**
   - Import VATReturn model
   - Import TaxPeriod model
   - Import SalesInvoice and PurchaseInvoice models
   - Import Decimal, timezone, datetime utilities
   - Import Django database transaction utilities

5. **Define VATReturnGenerator class**
   - Create main service class
   - Add comprehensive class docstring
   - Explain purpose: generate VAT returns from invoices

6. **Add __init__ method**
   - Accept tenant parameter (required)
   - Accept period parameter (TaxPeriod instance, required)
   - Store as instance variables
   - Validate period belongs to tenant
   - Raise ValueError if validation fails

7. **Add generate method**
   - Main public method to create VAT return
   - Check if return already exists for period
   - Create new VATReturn instance
   - Call calculation methods (next tasks)
   - Populate output_vat, input_vat, net_vat_payable
   - Populate line_items JSONField
   - Save and return VATReturn instance

8. **Add _validate_period method**
   - Private method for validation
   - Check period.period_type is monthly or quarterly
   - Check period dates are valid
   - Check period is closed (end_date <= today)
   - Raise ValidationError if invalid

9. **Add _get_period_invoices method**
   - Private helper to query invoices
   - Accept invoice model class (SalesInvoice or PurchaseInvoice)
   - Filter by tenant
   - Filter by date range (period start/end)
   - Filter by status (only 'finalized' or 'paid')
   - Exclude voided invoices
   - Return queryset

10. **Update generators/__init__.py**
    - Import VATReturnGenerator
    - Add to __all__ list

### VATReturnGenerator Class Structure

```
┌────────────────────────────────────────────────┐
│         VATReturnGenerator Class               │
├────────────────────────────────────────────────┤
│ Instance Variables:                            │
│  • tenant (Tenant instance)                    │
│  • period (TaxPeriod instance)                 │
│                                                │
│ Public Methods:                                │
│  • generate() → VATReturn                      │
│                                                │
│ Calculation Methods (Tasks 26-30):             │
│  • get_sales_vat() → Decimal                   │
│  • get_purchase_vat() → Decimal                │
│  • get_zero_rated_sales() → Decimal            │
│  • get_exempt_sales() → Decimal                │
│  • calculate_svat_adjustment() → Decimal       │
│                                                │
│ Private Helper Methods:                        │
│  • _validate_period() → None                   │
│  • _get_period_invoices(model) → QuerySet     │
│  • _build_line_items() → dict                  │
│                                                │
│ Export Methods (Tasks 31-32):                  │
│  • generate_pdf(vat_return) → bytes            │
│  • generate_csv(vat_return) → str              │
└────────────────────────────────────────────────┘
```

### Generation Workflow

```
VAT Return Generation Process
══════════════════════════════

Step 1: Initialize Generator
    ├─► tenant = current_tenant
    ├─► period = selected_period (e.g., January 2026)
    └─► VATReturnGenerator(tenant, period)

Step 2: Validate Period
    ├─► Check period belongs to tenant
    ├─► Check period type (monthly/quarterly)
    ├─► Check period is closed
    └─► Raise error if invalid

Step 3: Check Existing Return
    ├─► Query: VATReturn.objects.filter(tenant, period)
    ├─► If exists: Return existing or raise error
    └─► If not exists: Continue generation

Step 4: Calculate Output VAT (Task 26)
    ├─► Query sales invoices for period
    ├─► Filter standard-rated (8%) sales
    ├─► Sum VAT amounts
    └─► output_vat = total

Step 5: Calculate Input VAT (Task 27)
    ├─► Query purchase invoices for period
    ├─► Filter claimable purchases
    ├─► Sum VAT amounts
    └─► input_vat = total

Step 6: Calculate Zero-Rated Sales (Task 28)
    ├─► Query sales invoices for period
    ├─► Filter zero-rated (0%) sales
    ├─► Sum taxable amounts (no VAT)
    └─► zero_rated_amount = total

Step 7: Calculate Exempt Sales (Task 29)
    ├─► Query sales invoices for period
    ├─► Filter exempt sales
    ├─► Sum amounts
    └─► exempt_amount = total

Step 8: Apply SVAT Adjustment (Task 30)
    ├─► Check if tenant is SVAT registered
    ├─► Calculate SVAT adjustment
    ├─► Adjust input_vat if applicable
    └─► svat_adjustment = amount

Step 9: Calculate Net VAT
    ├─► net_vat_payable = output_vat - input_vat
    └─► Apply SVAT adjustment if any

Step 10: Build Line Items
    ├─► Create structured JSON
    ├─► Group invoices by category
    ├─► Include all transaction details
    └─► line_items = {...}

Step 11: Create VATReturn
    ├─► Instantiate VATReturn model
    ├─► Set all calculated fields
    ├─► Status = 'draft'
    ├─► Save to database
    └─► Return VATReturn instance
```

### Usage Example

```
Using VATReturnGenerator
════════════════════════

from accounting.tax.generators import VATReturnGenerator
from accounting.models import TaxPeriod
from tenants.models import Tenant

# Get tenant and period
tenant = Tenant.objects.get(id=1)
period = TaxPeriod.objects.get(
    tenant=tenant,
    period_type='monthly',
    start_date='2026-01-01'
)

# Initialize generator
generator = VATReturnGenerator(
    tenant=tenant,
    period=period
)

# Generate VAT return
vat_return = generator.generate()

# Result
print(f"Status: {vat_return.status}")
print(f"Output VAT: {vat_return.output_vat_display}")
print(f"Input VAT: {vat_return.input_vat_display}")
print(f"Net VAT: {vat_return.net_vat_payable_display}")

# Output:
# Status: draft
# Output VAT: LKR 80,000.00
# Input VAT: LKR 56,000.00
# Net VAT: LKR 24,000.00 (Payable)
```

### Period Validation Rules

```
Period Validation Checklist
════════════════════════════

✓ Period must belong to tenant
  └─► period.tenant == generator.tenant

✓ Period type must be monthly or quarterly
  └─► period.period_type in ['monthly', 'quarterly']

✓ Period must be closed (ended)
  └─► period.end_date <= today()

✓ Period dates must be valid
  └─► period.start_date < period.end_date

✗ Cannot generate for future periods
  └─► period.end_date > today() → ERROR

✗ Cannot generate if return already exists
  └─► VATReturn(tenant, period) exists → ERROR
      (unless regenerating draft)
```

### Invoice Filtering Criteria

```
Invoice Selection Rules
═══════════════════════

Sales Invoices:
  ✓ Tenant matches
  ✓ Date between period start/end
  ✓ Status = 'finalized' OR 'paid'
  ✗ Status = 'draft' (excluded)
  ✗ Status = 'voided' (excluded)
  ✗ Status = 'cancelled' (excluded)

Purchase Invoices:
  ✓ Tenant matches
  ✓ Date between period start/end
  ✓ Status = 'approved' OR 'paid'
  ✓ Supplier is VAT-registered
  ✗ Status = 'draft' (excluded)
  ✗ Status = 'rejected' (excluded)

Date Matching:
  ✓ invoice.date >= period.start_date
  ✓ invoice.date <= period.end_date
```

### Transaction Handling

```
Database Transaction Wrapper
═════════════════════════════

The generate() method should use database transactions:

with transaction.atomic():
    # Step 1: Create VATReturn instance
    vat_return = VATReturn(...)
    
    # Step 2: Calculate all values
    output_vat = self.get_sales_vat()
    input_vat = self.get_purchase_vat()
    ...
    
    # Step 3: Set values
    vat_return.output_vat = output_vat
    vat_return.input_vat = input_vat
    ...
    
    # Step 4: Save (atomic commit)
    vat_return.save()
    
    # If any error occurs, entire transaction rolls back
    return vat_return

Benefits:
- Data consistency
- No partial saves
- Automatic rollback on error
```

### Error Handling

| Error Type | Cause | Handler |
|------------|-------|---------|
| ValidationError | Invalid period | Raise with clear message |
| ValueError | Missing parameters | Raise in __init__ |
| IntegrityError | Duplicate return | Check before creation |
| DoesNotExist | Period not found | Validate in __init__ |
| OperationalError | Database issue | Let Django handle |

### Expected Outcome
- VATReturnGenerator service class created
- Period validation implemented
- Invoice query methods prepared
- Foundation for VAT calculations
- Transaction-safe generation

### Verification Checklist
- [ ] generators/ directory created
- [ ] generators/__init__.py created
- [ ] vat_return.py file created
- [ ] VATReturnGenerator class defined
- [ ] __init__ method accepts tenant and period
- [ ] generate() method skeleton created
- [ ] _validate_period() method implemented
- [ ] _get_period_invoices() method implemented
- [ ] Period validation rules enforced
- [ ] Invoice filtering criteria applied
- [ ] Generator imported in __init__.py

---

## Task 26: Add Get Sales VAT Method

### Overview
Implement the get_sales_vat() method to calculate total output VAT from sales invoices for the period. This method queries all finalized sales invoices, extracts VAT amounts from standard-rated (8%) transactions, and returns the total output VAT liability.

### Dependencies
- Task 25: VATReturnGenerator class created
- SalesInvoice model with tax_amount field
- InvoiceLineItem model with tax calculations

### Instructions

1. **Open vat_return.py generator file**
   - Navigate to `apps/accounting/tax/generators/vat_return.py`
   - Locate VATReturnGenerator class

2. **Add get_sales_vat method**
   - Public method, no parameters (uses self.tenant, self.period)
   - Returns Decimal value
   - Add method docstring explaining calculation

3. **Query sales invoices**
   - Use _get_period_invoices(SalesInvoice)
   - Filter by date range
   - Exclude voided/cancelled invoices
   - Only include finalized and paid invoices

4. **Calculate total VAT**
   - Use Django's aggregate and Sum
   - Sum the tax_amount field from invoices
   - Filter for standard VAT rate (8%)
   - Handle None result (no invoices)

5. **Handle zero-rated within standard invoices**
   - Some invoices may have mixed rates
   - Query invoice line items
   - Filter line_items with tax_rate = 8.00
   - Sum tax_amount from line items

6. **Add validation**
   - Ensure calculated amount >= 0
   - Log warning if unusually high
   - Return Decimal value with 2 decimal places

7. **Build line items list**
   - Create private method _get_sales_line_items()
   - Return list of dictionaries with invoice details
   - Include: invoice_number, date, customer, amounts
   - Used for line_items JSONField

### get_sales_vat Method Logic

```
Output VAT Calculation Flow
════════════════════════════

Step 1: Query Sales Invoices
    ├─► Filter: tenant = self.tenant
    ├─► Filter: date between period start/end
    ├─► Filter: status in ['finalized', 'paid']
    └─► Exclude: voided = True

Step 2: Calculate Invoice-Level VAT
    ├─► Option A: Use invoice.tax_amount (if simple)
    │   └─► Sum all tax_amount fields
    │
    └─► Option B: Use line-item detail (more accurate)
        ├─► Join invoice lines
        ├─► Filter: tax_rate = 8.00 (standard rate)
        ├─► Sum: line.quantity × line.price × (tax_rate / 100)
        └─► Total = Σ line_tax_amounts

Step 3: Validate and Return
    ├─► Ensure result >= 0
    ├─► Round to 2 decimal places
    ├─► Log if amount > threshold (e.g., > LKR 10M)
    └─► Return Decimal value
```

### Sales Invoice Data Structure

```
Sales Invoice Hierarchy
═══════════════════════

SalesInvoice (Header)
├── invoice_number: "INV-2026-00123"
├── date: 2026-01-15
├── customer: Customer instance
├── total_amount: LKR 108,000
├── tax_amount: LKR 8,000 ◄─── Sum of this field
├── status: 'finalized'
└── line_items: [
        InvoiceLineItem #1
        ├── description: "Product A"
        ├── quantity: 10
        ├── unit_price: LKR 5,000
        ├── subtotal: LKR 50,000
        ├── tax_rate: 8.00
        └── tax_amount: LKR 4,000 ◄─── Or sum of these
        
        InvoiceLineItem #2
        ├── description: "Product B"
        ├── quantity: 5
        ├── unit_price: LKR 10,000
        ├── subtotal: LKR 50,000
        ├── tax_rate: 8.00
        └── tax_amount: LKR 4,000
    ]
```

### Calculation Scenarios

```
Scenario 1: All Standard-Rated Sales
═════════════════════════════════════

Invoice #1: LKR 50,000 @ 8% → VAT: LKR 4,000
Invoice #2: LKR 75,000 @ 8% → VAT: LKR 6,000
Invoice #3: LKR 100,000 @ 8% → VAT: LKR 8,000
───────────────────────────────────────────────
Output VAT Total:                  LKR 18,000


Scenario 2: Mixed Rate Sales (8% and 0%)
═════════════════════════════════════════

Invoice #1:
  ├─► Item A: LKR 50,000 @ 8% → VAT: LKR 4,000 ✓
  └─► Item B: LKR 20,000 @ 0% → VAT: LKR 0 (excluded)

Invoice #2:
  └─► Item C: LKR 100,000 @ 8% → VAT: LKR 8,000 ✓

Output VAT (8% only):               LKR 12,000


Scenario 3: Large Volume Retail
════════════════════════════════

500 invoices × Average LKR 2,000 = LKR 1,000,000
VAT @ 8% = LKR 80,000

Validation: Check if within expected range
```

### Query Optimization

```
Efficient Database Query
════════════════════════

Option 1: Simple Aggregation (if all invoices use same rate)
────────────────────────────────────────────────────────────
from django.db.models import Sum

total_vat = SalesInvoice.objects.filter(
    tenant=self.tenant,
    date__gte=self.period.start_date,
    date__lte=self.period.end_date,
    status__in=['finalized', 'paid'],
    voided=False
).aggregate(
    total=Sum('tax_amount')
)['total'] or Decimal('0.00')


Option 2: Line-Item Level (for mixed rates)
───────────────────────────────────────────
from django.db.models import Sum, F

total_vat = InvoiceLineItem.objects.filter(
    invoice__tenant=self.tenant,
    invoice__date__gte=self.period.start_date,
    invoice__date__lte=self.period.end_date,
    invoice__status__in=['finalized', 'paid'],
    invoice__voided=False,
    tax_rate=Decimal('8.00')
).aggregate(
    total=Sum('tax_amount')
)['total'] or Decimal('0.00')
```

### Line Items JSON Structure (for sales)

```json
{
  "standard_rated": [
    {
      "invoice_number": "INV-2026-00123",
      "invoice_date": "2026-01-15",
      "customer_name": "ABC Company (Pvt) Ltd",
      "customer_tin": "123456789V",
      "taxable_amount": 50000.00,
      "vat_rate": 8.00,
      "vat_amount": 4000.00,
      "total_amount": 54000.00
    },
    ...
  ]
}
```

### Business Logic Rules

| Rule | Implementation | Purpose |
|------|----------------|---------|
| Only finalized invoices | Filter status field | Exclude drafts |
| Only period invoices | Filter by date range | Period accuracy |
| Exclude voided | Filter voided=False | Cancelled transactions |
| Standard rate only | Filter tax_rate=8.00 | Exclude zero-rated |
| Must be positive | Validation check | Data integrity |

### Error Scenarios

```
Handling Edge Cases
═══════════════════

No invoices for period:
  └─► Return Decimal('0.00')
      └─► Valid scenario (new business, off-season)

All invoices zero-rated (exports):
  └─► Return Decimal('0.00')
      └─► Valid for export businesses

Negative VAT amount:
  └─► Log error
      └─► Investigate data issue
          └─► Return Decimal('0.00') with warning

Database connection error:
  └─► Let Django handle
      └─► Transaction rollback
```

### Expected Outcome
- get_sales_vat() method calculating output VAT
- Accurate aggregation from invoices
- Filtering by VAT rate (8% only)
- Handling of edge cases
- Foundation for line items construction

### Verification Checklist
- [ ] get_sales_vat() method created
- [ ] Returns Decimal with 2 decimal places
- [ ] Queries sales invoices for period
- [ ] Filters by status (finalized/paid)
- [ ] Excludes voided invoices
- [ ] Filters by standard VAT rate (8%)
- [ ] Handles None/empty result
- [ ] Validation ensures >= 0
- [ ] _get_sales_line_items() method added
- [ ] Line items include required fields

---

## Task 27: Add Get Purchase VAT Method

### Overview
Implement the get_purchase_vat() method to calculate total input VAT from purchase invoices for the period. This method queries all approved purchase invoices from VAT-registered suppliers, extracts claimable VAT amounts, and returns the total input VAT credit.

### Dependencies
- Task 25: VATReturnGenerator class created
- Task 26: get_sales_vat method (for pattern reference)
- PurchaseInvoice model with tax fields
- Supplier model with VAT registration status

### Instructions

1. **Open vat_return.py generator file**
   - Navigate to `apps/accounting/tax/generators/vat_return.py`
   - Locate VATReturnGenerator class

2. **Add get_purchase_vat method**
   - Public method, no parameters
   - Returns Decimal value
   - Add comprehensive docstring

3. **Query purchase invoices**
   - Use _get_period_invoices(PurchaseInvoice)
   - Filter by date range
   - Only approved and paid invoices
   - Only from VAT-registered suppliers

4. **Filter claimable purchases**
   - Check supplier.vat_registered = True
   - Exclude non-claimable categories (if tracked)
   - Apply claimability rules (Sri Lanka IRD)

5. **Calculate total VAT**
   - Sum tax_amount from purchase invoices
   - Or sum from purchase line items
   - Filter by tax_rate = 8.00
   - Handle partial claimability (e.g., vehicles)

6. **Handle special cases**
   - Capital goods (100% claimable)
   - Motor vehicles over 1500cc (25% claimable)
   - Entertainment expenses (0% claimable)
   - Personal use items (0% claimable)

7. **Build purchase line items**
   - Create _get_purchase_line_items() method
   - Return list of purchase details
   - Include supplier TIN verification
   - Mark purchase type (local/import)

### get_purchase_vat Method Logic

```
Input VAT Calculation Flow
═══════════════════════════

Step 1: Query Purchase Invoices
    ├─► Filter: tenant = self.tenant
    ├─► Filter: date between period start/end
    ├─► Filter: status in ['approved', 'paid']
    └─► Filter: supplier.vat_registered = True

Step 2: Apply Claimability Rules
    ├─► Standard purchases: 100% claimable
    ├─► Capital goods: 100% claimable
    ├─► Motor vehicles < 1500cc: 100% claimable
    ├─► Motor vehicles > 1500cc: 25% claimable
    ├─► Entertainment: 0% claimable (exclude)
    └─► Personal use: 0% claimable (exclude)

Step 3: Calculate Input VAT
    ├─► Sum tax_amount from filtered invoices
    ├─► Apply percentage adjustments if needed
    ├─► Sum: Σ (invoice.tax_amount × claimability_%)
    └─► Total = input VAT

Step 4: Validate and Return
    ├─► Ensure result >= 0
    ├─► Check reasonableness vs. output VAT
    ├─► Log if input VAT > output VAT (refund position)
    └─► Return Decimal value
```

### Purchase Invoice Data Structure

```
Purchase Invoice Hierarchy
═══════════════════════════

PurchaseInvoice (Header)
├── invoice_number: "PURCH-2026-00045"
├── supplier_invoice_ref: "SUPP-INV-123"
├── date: 2026-01-10
├── supplier: Supplier instance
│   ├── name: "Raw Materials Co."
│   ├── vat_registered: True ◄─── Must be True
│   └── vat_tin: "555666777V" ◄─── Required
├── total_amount: LKR 432,000
├── tax_amount: LKR 32,000 ◄─── Sum of this field
├── status: 'approved'
└── line_items: [
        PurchaseLineItem #1
        ├── description: "Raw Material A"
        ├── quantity: 100
        ├── unit_price: LKR 2,000
        ├── subtotal: LKR 200,000
        ├── tax_rate: 8.00
        ├── tax_amount: LKR 16,000
        └── category: "materials" (100% claimable)
        
        PurchaseLineItem #2
        ├── description: "Delivery Van"
        ├── quantity: 1
        ├── unit_price: LKR 200,000
        ├── subtotal: LKR 200,000
        ├── tax_rate: 8.00
        ├── tax_amount: LKR 16,000
        └── category: "vehicle_under_1500cc" (100% claimable)
    ]
```

### Sri Lanka VAT Claimability Rules

```
Input VAT Claimability Matrix
══════════════════════════════

Category                          Claimable %    Conditions
──────────────────────────────────────────────────────────────
Business inputs/raw materials     100%           For taxable supplies
Capital equipment                 100%           Business use only
Office supplies                   100%           Business related
Services (business)               100%           Directly attributable
Motor vehicles < 1500cc           100%           Business use documented
Motor vehicles > 1500cc           25%            Restricted by IRD
Entertainment expenses            0%             Not claimable
Personal use items                0%             Not business-related
Purchases for exempt supplies     0%             Cannot claim
Non-VAT registered suppliers      0%             No valid tax invoice
──────────────────────────────────────────────────────────────
```

### Claimability Calculation Examples

```
Example 1: Standard Purchase (100% Claimable)
══════════════════════════════════════════════

Purchase: Raw materials
Amount: LKR 500,000
VAT @ 8%: LKR 40,000
Supplier: VAT-registered ✓
Category: Business input ✓
Claimable: LKR 40,000 × 100% = LKR 40,000


Example 2: Luxury Vehicle (25% Claimable)
══════════════════════════════════════════

Purchase: Car (2000cc)
Amount: LKR 5,000,000
VAT @ 8%: LKR 400,000
Supplier: VAT-registered ✓
Category: Vehicle > 1500cc
Claimable: LKR 400,000 × 25% = LKR 100,000


Example 3: Mixed Purchases
═══════════════════════════

Purchase Invoice:
  ├─► Materials: LKR 200,000 → VAT: LKR 16,000 (100%)
  ├─► Equipment: LKR 300,000 → VAT: LKR 24,000 (100%)
  └─► Entertainment: LKR 50,000 → VAT: LKR 4,000 (0%)

Total Claimable: LKR 16,000 + LKR 24,000 + LKR 0
                = LKR 40,000
```

### Supplier VAT Registration Validation

```
Supplier Verification Process
══════════════════════════════

For each purchase:
  ├─► Check supplier.vat_registered field
  │   ├─► If True: Proceed with claim ✓
  │   └─► If False: Exclude from input VAT ✗
  │
  ├─► Verify supplier.vat_tin exists
  │   ├─► If present: Valid ✓
  │   └─► If missing: Flag for review ⚠
  │
  └─► Check tax invoice received
      ├─► If yes: Include in claim ✓
      └─► If no: Cannot claim ✗

IRD Requirement:
"Input VAT can only be claimed if the supplier is a
 VAT-registered trader and a proper tax invoice is issued"
```

### Purchase Types and Handling

```
Purchase Type Classification
════════════════════════════

LOCAL PURCHASES
├─► From VAT-registered local suppliers
├─► Tax invoice required
├─► Supplier TIN must be recorded
├─► VAT rate: 8% (current)
└─► Claim: Full amount if claimable category

IMPORTS
├─► From overseas suppliers
├─► VAT paid at customs
├─► Customs declaration required
├─► VAT rate: 8% (at border)
└─► Claim: Full amount with customs proof

SERVICES
├─► From VAT-registered service providers
├─► Tax invoice required
├─► Must be directly attributable to business
├─► VAT rate: 8%
└─► Claim: Full amount if business-related
```

### Query Implementation

```
Efficient Purchase VAT Query
════════════════════════════

from django.db.models import Sum, Q, Case, When, DecimalField

# Query with claimability adjustments
input_vat = PurchaseInvoice.objects.filter(
    tenant=self.tenant,
    date__gte=self.period.start_date,
    date__lte=self.period.end_date,
    status__in=['approved', 'paid'],
    supplier__vat_registered=True
).aggregate(
    total=Sum(
        Case(
            # Standard purchases: 100%
            When(
                category__in=['materials', 'supplies', 'equipment'],
                then=F('tax_amount')
            ),
            # Luxury vehicles: 25%
            When(
                category='vehicle_over_1500cc',
                then=F('tax_amount') * Decimal('0.25')
            ),
            # Entertainment: 0%
            When(
                category='entertainment',
                then=Decimal('0.00')
            ),
            # Default: 100%
            default=F('tax_amount'),
            output_field=DecimalField(max_digits=15, decimal_places=2)
        )
    )
)['total'] or Decimal('0.00')
```

### Line Items JSON Structure (for purchases)

```json
{
  "purchases": [
    {
      "purchase_invoice": "PURCH-2026-00045",
      "supplier_invoice": "SUPP-INV-123",
      "invoice_date": "2026-01-10",
      "supplier_name": "Raw Materials Co.",
      "supplier_tin": "555666777V",
      "taxable_amount": 400000.00,
      "vat_rate": 8.00,
      "vat_amount": 32000.00,
      "claimable_percentage": 100,
      "claimable_vat": 32000.00,
      "total_amount": 432000.00,
      "purchase_type": "local",
      "category": "materials"
    },
    {
      "purchase_invoice": "PURCH-2026-00046",
      "supplier_invoice": "IMP-2026-789",
      "invoice_date": "2026-01-12",
      "supplier_name": "Overseas Equipment Ltd",
      "supplier_country": "Singapore",
      "taxable_amount": 200000.00,
      "vat_rate": 8.00,
      "vat_amount": 16000.00,
      "claimable_percentage": 100,
      "claimable_vat": 16000.00,
      "total_amount": 216000.00,
      "purchase_type": "import",
      "customs_declaration": "C-2026-456"
    }
  ]
}
```

### Validation and Warnings

```
Input VAT Validation Checks
════════════════════════════

Check 1: Reasonableness vs Output VAT
  ├─► If input_vat > output_vat × 2: Log warning
  └─► May indicate refund position or data error

Check 2: Supplier Verification
  ├─► All suppliers VAT-registered: OK
  └─► Non-registered suppliers: Exclude + Log

Check 3: Category Classification
  ├─► All purchases categorized: OK
  └─► Uncategorized: Default to 100% claimable + Flag

Check 4: High-Value Purchases
  ├─► Single purchase > LKR 1M: Flag for review
  └─► Ensure proper documentation

Check 5: Zero Input VAT
  ├─► If = 0 and business has purchases: Warning
  └─► May indicate missing data
```

### Expected Outcome
- get_purchase_vat() method calculating input VAT
- Claimability rules applied
- Supplier VAT registration verified
- Purchase categorization handled
- Line items with full details

### Verification Checklist
- [ ] get_purchase_vat() method created
- [ ] Returns Decimal with 2 decimal places
- [ ] Queries purchase invoices for period
- [ ] Filters by status (approved/paid)
- [ ] Filters by supplier VAT registration
- [ ] Applies claimability rules
- [ ] Handles vehicle restrictions (25% for >1500cc)
- [ ] Excludes entertainment and personal expenses
- [ ] _get_purchase_line_items() method added
- [ ] Line items include supplier TIN and purchase type

---

## Task 28: Add Get Zero-Rated Sales

### Overview
Implement the get_zero_rated_sales() method to identify and calculate sales that are zero-rated (0% VAT) under Sri Lankan tax law. Zero-rated sales include exports, certain foodstuffs, and specified goods/services. While these sales don't generate output VAT, they must be reported separately for IRD compliance.

### Dependencies
- Task 26: get_sales_vat method pattern
- SalesInvoice model with tax rate field
- Tax rate constants defined

### Instructions

1. **Open vat_return.py generator file**
   - Navigate to `apps/accounting/tax/generators/vat_return.py`
   - Locate VATReturnGenerator class

2. **Add get_zero_rated_sales method**
   - Public method, returns Decimal
   - Calculate total value of zero-rated sales
   - Add docstring with zero-rated categories

3. **Query zero-rated invoices**
   - Filter sales invoices for period
   - Filter where tax_rate = 0.00 or is_zero_rated = True
   - Include finalized and paid statuses
   - Exclude voided invoices

4. **Calculate total value**
   - Sum total_amount or subtotal (before VAT)
   - VAT amount will be 0 for all these
   - Return total taxable value

5. **Build zero-rated line items**
   - Create _get_zero_rated_line_items() method
   - Include export declarations for exports
   - Include customer country for international sales
   - Mark zero-rated category (export, foodstuff, etc.)

6. **Handle export documentation**
   - Check for export_declaration field
   - Verify destination country is non-Sri Lanka
   - Flag if missing documentation

7. **Add validation**
   - Zero-rated should have tax_amount = 0
   - Log warning if tax_rate = 0 but tax_amount > 0
   - Ensure proper categorization

### Zero-Rated Sales Categories (Sri Lanka)

```
Sri Lankan Zero-Rated Supplies
═══════════════════════════════

EXPORTS (Most Common)
├─► Goods exported outside Sri Lanka
├─► Services to non-residents
├─► International transport
└─► Requirements: Export declaration, proof of export

ESSENTIAL FOODSTUFFS
├─► Rice
├─► Bread
├─► Milk powder
├─► Fresh vegetables (specific list)
└─► Other gazetted food items

MEDICAL SUPPLIES
├─► Specified pharmaceuticals
├─► Medical equipment (approved list)
└─► Must be on IRD gazette notification

OTHER ZERO-RATED
├─► Books and newspapers
├─► Educational materials
└─► Specific government-approved items
```

### Zero-Rated Sales Detection Logic

```
Identifying Zero-Rated Sales
════════════════════════════

Method 1: Tax Rate Field
    ├─► Filter: tax_rate = 0.00
    └─► AND: is_taxable = True (distinguishes from exempt)

Method 2: Zero-Rated Flag
    ├─► Filter: is_zero_rated = True
    └─► Explicit marking in invoice

Method 3: Customer/Product Attributes
    ├─► Customer.country != 'Sri Lanka' (exports)
    ├─► Product.zero_rated_category exists
    └─► Combined logic for accuracy

Preferred: Combination of methods for validation
```

### Calculation Example

```
Zero-Rated Sales Calculation
═════════════════════════════

Invoice #1: Export to UK
  ├─► Customer: UK Trading Ltd
  ├─► Goods: Electronics
  ├─► Subtotal: LKR 500,000
  ├─► VAT @ 0%: LKR 0
  ├─► Total: LKR 500,000
  └─► Export Declaration: EXP-2026-045 ✓

Invoice #2: Export to India
  ├─► Customer: Mumbai Traders
  ├─► Goods: Garments
  ├─► Subtotal: LKR 300,000
  ├─► VAT @ 0%: LKR 0
  ├─► Total: LKR 300,000
  └─► Export Declaration: EXP-2026-046 ✓

Invoice #3: Essential Food Items (Local)
  ├─► Customer: Local Retailer
  ├─► Goods: Rice (zero-rated)
  ├─► Subtotal: LKR 100,000
  ├─► VAT @ 0%: LKR 0
  ├─► Total: LKR 100,000
  └─► Zero-rated category: Essential food ✓

Total Zero-Rated Sales: LKR 900,000
Output VAT from these sales: LKR 0
```

### IRD Reporting Requirements

```
Zero-Rated Sales in VAT Return
═══════════════════════════════

SECTION A: OUTPUT VAT (Sales)

1. Standard-rated supplies (8%)
   Taxable Value:     LKR 1,000,000
   VAT Amount:        LKR    80,000
   
2. Zero-rated supplies (0%)           ◄── Task 28
   Taxable Value:     LKR   500,000   ◄── This amount
   VAT Amount:        LKR         0   ◄── Always zero
   
   2a. Exports        LKR   450,000
   2b. Essential foods LKR    50,000

3. Exempt supplies
   Value:             LKR   200,000
   VAT Amount:        N/A

TOTAL OUTPUT VAT:     LKR    80,000 (from line 1 only)

Note: Zero-rated value reported separately but not taxed
```

### Export Documentation Validation

```
Export Sales Verification
═════════════════════════

Required Fields for Exports:
  ✓ export_declaration (e.g., "EXP-2026-045")
  ✓ customer_country (non-Sri Lanka)
  ✓ shipping_documents
  ✓ proof_of_export

Validation Checks:
  ├─► Export declaration present?
  │   └─► No: Flag for manual review
  │
  ├─► Customer country is foreign?
  │   └─► No: Possible error, check classification
  │
  ├─► Shipping proof exists?
  │   └─► No: May not qualify as zero-rated
  │
  └─► Declaration number format valid?
      └─► Format: EXP-YYYY-NNNNN
```

### Line Items JSON Structure (zero-rated)

```json
{
  "zero_rated": [
    {
      "invoice_number": "EXP-2026-00045",
      "invoice_date": "2026-01-20",
      "customer_name": "UK Trading Ltd",
      "customer_country": "United Kingdom",
      "taxable_amount": 500000.00,
      "vat_rate": 0.00,
      "vat_amount": 0.00,
      "total_amount": 500000.00,
      "zero_rated_category": "export",
      "export_declaration": "EXP-2026-045",
      "destination_port": "London Heathrow",
      "shipping_date": "2026-01-22"
    },
    {
      "invoice_number": "INV-2026-00178",
      "invoice_date": "2026-01-25",
      "customer_name": "Colombo Retailers",
      "customer_country": "Sri Lanka",
      "taxable_amount": 100000.00,
      "vat_rate": 0.00,
      "vat_amount": 0.00,
      "total_amount": 100000.00,
      "zero_rated_category": "essential_food",
      "product_description": "Rice - 5kg bags",
      "gazette_reference": "Gazette 2024-03-15"
    }
  ]
}
```

### Zero-Rated vs Exempt Distinction

```
Zero-Rated vs Exempt Sales
═══════════════════════════

ZERO-RATED (0% VAT)
├─► VAT rate: 0%
├─► Input VAT: Claimable ✓
├─► Reported: Yes, separately
├─► Examples: Exports, essential foods
└─► Tax treatment: Within VAT system

EXEMPT (No VAT)
├─► VAT rate: N/A
├─► Input VAT: NOT claimable ✗
├─► Reported: Yes, but differently
├─► Examples: Financial services, land sales
└─► Tax treatment: Outside VAT system

Key Difference for Business:
  Zero-rated: Business can claim input VAT
  Exempt: Business cannot claim input VAT
```

### Business Scenarios

```
Scenario 1: Export Business
════════════════════════════

Company: Garment Exporter
Monthly Sales:
  ├─► Exports: LKR 5,000,000 @ 0% → Output VAT: LKR 0
  └─► Local: LKR 1,000,000 @ 8% → Output VAT: LKR 80,000

Purchases (input VAT): LKR 400,000

VAT Return:
  ├─► Output VAT: LKR 80,000
  ├─► Input VAT: LKR 400,000 (fully claimable)
  ├─► Net VAT: LKR -320,000 (REFUND)
  └─► Zero-rated sales: LKR 5,000,000 (reported)

Result: Company in refund position due to zero-rated exports


Scenario 2: Mixed Business
═══════════════════════════

Company: Food Distributor
Monthly Sales:
  ├─► Rice (zero-rated): LKR 500,000 @ 0%
  ├─► Other foods (8%): LKR 1,500,000 @ 8% → VAT: LKR 120,000
  └─► Total output VAT: LKR 120,000

Purchases: LKR 1,800,000 @ 8% → Input VAT: LKR 144,000

VAT Return:
  ├─► Output VAT: LKR 120,000
  ├─► Input VAT: LKR 144,000
  ├─► Net VAT: LKR -24,000 (small refund)
  └─► Zero-rated sales: LKR 500,000 (reported)
```

### Expected Outcome
- get_zero_rated_sales() method calculating zero-rated value
- Proper identification of zero-rated categories
- Export documentation tracking
- Distinction from exempt sales
- Separate reporting for IRD compliance

### Verification Checklist
- [ ] get_zero_rated_sales() method created
- [ ] Returns Decimal (total taxable value)
- [ ] Filters invoices with tax_rate = 0.00
- [ ] Distinguishes zero-rated from exempt
- [ ] _get_zero_rated_line_items() method added
- [ ] Export declarations captured
- [ ] Customer country recorded for exports
- [ ] Zero-rated category classified
- [ ] Validation ensures VAT amount = 0
- [ ] Documentation requirements flagged

---

## Task 29: Add Get Exempt Sales

### Overview
Implement the get_exempt_sales() method to identify and calculate sales that are exempt from VAT under Sri Lankan tax law. Exempt sales include financial services, land/building sales, education, and healthcare. Unlike zero-rated sales, exempt sales don't allow input VAT claims on related purchases.

### Dependencies
- Task 28: get_zero_rated_sales method (for comparison)
- SalesInvoice model with exempt flag
- Product/Service categorization

### Instructions

1. **Open vat_return.py generator file**
   - Navigate to `apps/accounting/tax/generators/vat_return.py`
   - Locate VATReturnGenerator class

2. **Add get_exempt_sales method**
   - Public method, returns Decimal
   - Calculate total value of exempt sales
   - Add docstring with exempt categories

3. **Query exempt invoices**
   - Filter sales invoices for period
   - Filter where is_exempt = True
   - Or filter by exempt product/service categories
   - Include finalized and paid statuses

4. **Calculate total value**
   - Sum total amounts of exempt sales
   - No VAT component (not applicable)
   - Return total exempt value

5. **Build exempt line items**
   - Create _get_exempt_line_items() method
   - Include exemption reason/category
   - Document basis for exemption
   - Reference gazette notification if applicable

6. **Add validation**
   - Ensure no VAT charged on exempt sales
   - Warn if tax_amount > 0 for exempt invoice
   - Verify exemption classification

### Exempt Supplies Categories (Sri Lanka)

```
Sri Lankan VAT-Exempt Supplies
═══════════════════════════════

FINANCIAL SERVICES
├─► Banking services
├─► Insurance services
├─► Loan/credit facilities
├─► Investment management
└─► Stock brokerage

LAND AND BUILDINGS
├─► Sale of land
├─► Sale of residential buildings
├─► Leasing of residential property
└─► (Commercial property IS taxable)

EDUCATION
├─► School fees
├─► University tuition
├─► Vocational training (approved)
├─► Educational materials
└─► Coaching/tutoring services

HEALTHCARE
├─► Medical services
├─► Hospital charges
├─► Dental services
├─► Medical lab tests
└─► (Cosmetic services may be taxable)

TRANSPORTATION
├─► Passenger transport
├─► Public transport services
└─► (Freight may be taxable)

OTHER EXEMPT
├─► Postal services
├─► Cultural services (approved)
├─► Sports facilities (non-profit)
└─► Charitable services
```

### Exempt Sales Detection Logic

```
Identifying Exempt Sales
════════════════════════

Method 1: Explicit Flag
    ├─► invoice.is_exempt = True
    └─► Most reliable method

Method 2: Product/Service Category
    ├─► product.category = 'financial_services'
    ├─► service.category = 'education'
    └─► Category-based classification

Method 3: Customer Type
    ├─► customer.type = 'educational_institution'
    ├─► customer.type = 'healthcare_provider'
    └─► May trigger exemption

Method 4: Transaction Type
    ├─► transaction_type = 'land_sale'
    ├─► transaction_type = 'residential_lease'
    └─► Specific transaction markers

Recommended: Combination of flag + category
```

### Calculation Example

```
Exempt Sales Calculation
════════════════════════

Invoice #1: Educational Services
  ├─► Customer: University of Colombo
  ├─► Service: Professional training program
  ├─► Amount: LKR 200,000
  ├─► VAT: Not applicable (exempt)
  ├─► Total: LKR 200,000
  └─► Exemption: Educational services ✓

Invoice #2: Financial Service
  ├─► Customer: Corporate client
  ├─► Service: Investment advisory
  ├─► Amount: LKR 150,000
  ├─► VAT: Not applicable (exempt)
  ├─► Total: LKR 150,000
  └─► Exemption: Financial services ✓

Invoice #3: Medical Services
  ├─► Customer: Patient
  ├─► Service: Surgery
  ├─► Amount: LKR 500,000
  ├─► VAT: Not applicable (exempt)
  ├─► Total: LKR 500,000
  └─► Exemption: Healthcare ✓

Total Exempt Sales: LKR 850,000
VAT: Not applicable (N/A)
```

### IRD Reporting for Exempt Sales

```
Exempt Sales in VAT Return
══════════════════════════

SECTION A: OUTPUT VAT (Sales)

1. Standard-rated supplies (8%)
   Taxable Value:     LKR 1,000,000
   VAT Amount:        LKR    80,000
   
2. Zero-rated supplies (0%)
   Taxable Value:     LKR   500,000
   VAT Amount:        LKR         0

3. Exempt supplies                    ◄── Task 29
   Value:             LKR   200,000   ◄── This amount
   VAT Amount:        N/A             ◄── Not applicable

TOTAL OUTPUT VAT:     LKR    80,000

Note: Exempt sales reported for completeness but no VAT
```

### Exempt vs Zero-Rated Comparison

```
Key Differences: Exempt vs Zero-Rated
══════════════════════════════════════

                        EXEMPT          ZERO-RATED
───────────────────────────────────────────────────────
VAT Rate                N/A             0%
Input VAT Claimable     NO ✗            YES ✓
Reported in Return      Yes             Yes
Within VAT System       NO              YES
Output VAT              N/A             LKR 0
Examples                Financial svcs  Exports
Business Impact         Higher cost     Competitive

Critical Distinction:
  Exempt: Input VAT becomes a cost (not recoverable)
  Zero-rated: Input VAT is fully recoverable
```

### Input VAT Allocation for Mixed Businesses

```
Proportional Input VAT Allocation
══════════════════════════════════

Business with Mixed Sales:
  ├─► Taxable sales (8%): LKR 1,000,000
  ├─► Zero-rated (0%): LKR 500,000
  └─► Exempt: LKR 200,000

Total Sales: LKR 1,700,000

Input VAT Calculation:
  Total Input VAT: LKR 100,000
  
  Claimable Input VAT:
    = Input VAT × (Taxable + Zero-rated) / Total
    = 100,000 × (1,500,000 / 1,700,000)
    = 100,000 × 0.8824
    = LKR 88,240
  
  Non-Claimable Input VAT:
    = Input VAT × (Exempt / Total)
    = 100,000 × (200,000 / 1,700,000)
    = 100,000 × 0.1176
    = LKR 11,760 (becomes business cost)
```

### Line Items JSON Structure (exempt)

```json
{
  "exempt": [
    {
      "invoice_number": "INV-2026-00150",
      "invoice_date": "2026-01-25",
      "customer_name": "University of Colombo",
      "customer_type": "educational_institution",
      "service_description": "Professional training program",
      "amount": 200000.00,
      "exemption_category": "education",
      "exemption_reason": "Educational services - VAT Act Section 25",
      "gazette_reference": "Gazette 2015-11-03"
    },
    {
      "invoice_number": "INV-2026-00165",
      "invoice_date": "2026-01-28",
      "customer_name": "ABC Insurance Ltd",
      "customer_type": "corporate",
      "service_description": "Investment advisory services",
      "amount": 150000.00,
      "exemption_category": "financial_services",
      "exemption_reason": "Financial services - VAT Act Section 23"
    }
  ]
}
```

### Exemption Validation Rules

```
Exempt Sales Validation
═══════════════════════

Check 1: Category Verification
  ├─► Is service/product in exempt list?
  ├─► Valid exemption category assigned?
  └─► Gazette reference available?

Check 2: No VAT Charged
  ├─► tax_amount = 0?
  ├─► tax_rate = null or 0?
  └─► is_taxable = false?

Check 3: Proper Documentation
  ├─► Exemption reason documented?
  ├─► Legal basis cited?
  └─► Customer type confirmed?

Check 4: Mixed Transaction Handling
  ├─► If invoice has both taxable and exempt:
  │   ├─► Separate line items?
  │   ├─► VAT only on taxable items?
  │   └─► Clear distinction?
  └─► Log if unclear classification
```

### Business Scenarios

```
Scenario 1: Educational Institution
════════════════════════════════════

Institution: Private College
Monthly Revenue:
  ├─► Tuition fees: LKR 2,000,000 (exempt)
  ├─► Cafeteria sales: LKR 500,000 @ 8% → VAT: LKR 40,000
  └─► Book sales: LKR 200,000 (zero-rated)

Expenses: LKR 1,500,000 @ 8% → Input VAT: LKR 120,000

Input VAT Allocation:
  ├─► Taxable portion: 500,000 / 2,700,000 = 18.5%
  ├─► Claimable: LKR 120,000 × 18.5% = LKR 22,200
  └─► Non-claimable: LKR 97,800 (cost to business)

Result: Most input VAT not claimable due to exempt revenue


Scenario 2: Financial Services
═══════════════════════════════

Company: Investment Advisor
Monthly Revenue:
  └─► Advisory services: LKR 5,000,000 (all exempt)

Expenses: LKR 1,000,000 @ 8% → Input VAT: LKR 80,000

Input VAT Allocation:
  ├─► Taxable portion: 0 / 5,000,000 = 0%
  ├─► Claimable: LKR 0
  └─► Non-claimable: LKR 80,000 (full cost to business)

Result: No input VAT claimable, increases operational cost
```

### Special Cases

```
Special Exemption Scenarios
═══════════════════════════

Partial Exemption:
  └─► Some services exempt, others taxable
      └─► Pro-rata input VAT calculation required

Incidental Exempt Sales:
  └─► If exempt < 5% of total, may ignore for input VAT
      └─► Simplification rule (check IRD guidelines)

Exempt Import Services:
  └─► Reverse charge mechanism
      └─► No VAT on import, but noted in return

Change in Status:
  └─► Service becomes exempt mid-period
      └─► Pro-rate based on dates
```

### Expected Outcome
- get_exempt_sales() method calculating exempt value
- Proper categorization of exempt supplies
- No VAT charged on exempt sales
- Foundation for input VAT allocation
- Compliance with IRD exempt classifications

### Verification Checklist
- [ ] get_exempt_sales() method created
- [ ] Returns Decimal (total exempt value)
- [ ] Filters invoices with is_exempt = True
- [ ] Properly distinguishes from zero-rated
- [ ] _get_exempt_line_items() method added
- [ ] Exemption categories documented
- [ ] Exemption reasons included
- [ ] Legal references added where applicable
- [ ] Validation ensures no VAT charged
- [ ] Mixed business input VAT logic prepared

---

## Task 30: Add SVAT Calculation

### Overview
Implement the calculate_svat_adjustment() method to apply Simplified VAT (SVAT) scheme adjustments for registered exporters. SVAT allows businesses engaged primarily in zero-rated exports to claim input VAT more favorably, reducing the cash flow burden of standard VAT recovery processes.

### Dependencies
- Task 26: get_sales_vat (output VAT)
- Task 27: get_purchase_vat (input VAT)
- Task 28: get_zero_rated_sales
- Tenant model with SVAT registration status

### Instructions

1. **Open vat_return.py generator file**
   - Navigate to `apps/accounting/tax/generators/vat_return.py`
   - Locate VATReturnGenerator class

2. **Add calculate_svat_adjustment method**
   - Public method, returns Decimal
   - Calculate SVAT benefit if applicable
   - Returns additional input VAT claimable

3. **Check SVAT eligibility**
   - Verify tenant.is_svat_registered = True
   - Check tenant.svat_certificate exists
   - Verify SVAT certificate is valid (not expired)
   - Return 0 if not eligible

4. **Calculate export ratio**
   - Export ratio = Zero-rated sales / Total sales
   - Total sales = Standard-rated + Zero-rated
   - Exclude exempt sales from calculation
   - SVAT applies if export ratio > 60%

5. **Apply SVAT formula**
   - SVAT adjustment depends on export percentage
   - Higher export ratio = greater input VAT recovery
   - Formula varies by IRD regulations
   - Calculate additional claimable amount

6. **Handle SVAT ceiling**
   - SVAT has maximum claim limits
   - Check against input VAT amount
   - Cannot exceed certain percentage
   - Apply ceiling if necessary

7. **Document SVAT calculation**
   - Add calculation details to line_items
   - Include export ratio
   - Show SVAT adjustment amount
   - Reference SVAT certificate number

### SVAT Scheme Overview (Sri Lanka)

```
Simplified VAT (SVAT) System
════════════════════════════

Purpose:
  Facilitate VAT recovery for exporters who primarily
  engage in zero-rated supplies (exports)

Eligibility:
  ✓ Registered for VAT
  ✓ Exports > 60% of total sales
  ✓ SVAT certificate from IRD
  ✓ Maintain proper export documentation

Benefits:
  ✓ Enhanced input VAT recovery
  ✓ Faster refund processing
  ✓ Simplified calculation method
  ✓ Reduced cash flow burden

Requirements:
  ✓ Separate SVAT application
  ✓ Annual renewal
  ✓ Quarterly reporting
  ✓ Maintain export evidence
```

### SVAT Eligibility Check

```
SVAT Eligibility Decision Tree
═══════════════════════════════

Start: Check SVAT Registration
    │
    ├─► Is tenant.is_svat_registered = True?
    │   ├─► No: Return 0 (not eligible) ✗
    │   └─► Yes: Continue
    │
    ├─► Does tenant.svat_certificate exist?
    │   ├─► No: Return 0 + Warning ✗
    │   └─► Yes: Continue
    │
    ├─► Is certificate valid (not expired)?
    │   ├─► No: Return 0 + Warning ✗
    │   └─► Yes: Continue
    │
    ├─► Calculate export ratio
    │   Export Ratio = Zero-rated / (Standard + Zero-rated)
    │
    └─► Is export ratio > 60%?
        ├─► No: Return 0 (threshold not met) ✗
        └─► Yes: Apply SVAT calculation ✓
```

### Export Ratio Calculation

```
Export Ratio Formula
════════════════════

Export Ratio = (Zero-Rated Sales) / (Total Taxable Sales) × 100%

Where:
  Zero-Rated Sales = Sum of exports + other zero-rated
  Total Taxable Sales = Standard-rated + Zero-rated
  (Exempt sales excluded from calculation)

Example 1: High Export Business
────────────────────────────────
Standard-rated sales: LKR   500,000
Zero-rated (exports): LKR 3,000,000
Exempt sales:         LKR   200,000 (excluded)

Total Taxable: LKR 3,500,000
Export Ratio: 3,000,000 / 3,500,000 = 85.7% ✓ (Eligible)


Example 2: Mixed Business
─────────────────────────
Standard-rated sales: LKR 2,000,000
Zero-rated (exports): LKR 1,500,000
Exempt sales:         LKR   500,000 (excluded)

Total Taxable: LKR 3,500,000
Export Ratio: 1,500,000 / 3,500,000 = 42.9% ✗ (Not eligible)


Example 3: Borderline Case
──────────────────────────
Standard-rated sales: LKR 1,400,000
Zero-rated (exports): LKR 2,100,000
Exempt sales:         LKR   0

Total Taxable: LKR 3,500,000
Export Ratio: 2,100,000 / 3,500,000 = 60.0% ✓ (Just eligible)
```

### SVAT Calculation Formula

```
SVAT Input VAT Enhancement
═══════════════════════════

Standard Input VAT Claim:
  Claimable Input VAT = (Input VAT × Taxable%) 
  
  Where Taxable% = (Standard + Zero) / (Standard + Zero + Exempt)

SVAT Enhancement:
  Under SVAT, export businesses can claim input VAT
  more favorably, reducing the penalty of exempt sales

SVAT Formula (Simplified):
  SVAT Adjustment = Input VAT × Export Ratio × Enhancement Factor
  
  Where Enhancement Factor = 0.10 to 0.20 (IRD guideline)

Example Calculation:
────────────────────
Input VAT: LKR 200,000
Export Ratio: 80%
Enhancement Factor: 0.15

SVAT Adjustment = 200,000 × 0.80 × 0.15
                = 200,000 × 0.12
                = LKR 24,000 (additional claimable)

Total Claimable Input VAT:
  Standard calculation: LKR 180,000
  SVAT adjustment: LKR 24,000
  Total: LKR 204,000
```

### SVAT Ceiling and Limits

```
SVAT Claim Limitations
══════════════════════

Maximum Claim Limits:
  ├─► SVAT adjustment cannot exceed 20% of input VAT
  ├─► Total claim cannot exceed actual input VAT
  └─► Subject to IRD annual review

Example with Ceiling:
─────────────────────
Input VAT: LKR 100,000
Export Ratio: 90%
Enhancement: 0.25 (25%)

Calculated SVAT Adjustment:
  = 100,000 × 0.90 × 0.25
  = LKR 22,500

But ceiling = 20% of input VAT = LKR 20,000

Applied SVAT Adjustment: LKR 20,000 (capped)
```

### Implementation Logic

```
SVAT Calculation Process
════════════════════════

Step 1: Check Eligibility
    ├─► SVAT registered? → Check tenant field
    ├─► Certificate valid? → Check expiry date
    └─► Export ratio > 60%? → Calculate and check

Step 2: Calculate Export Ratio
    zero_rated = self.get_zero_rated_sales()
    standard_rated = self.get_sales_vat() / Decimal('0.08')
    total_taxable = standard_rated + zero_rated
    export_ratio = zero_rated / total_taxable if total_taxable > 0 else 0

Step 3: Calculate Base SVAT Adjustment
    input_vat = self.get_purchase_vat()
    enhancement_factor = Decimal('0.15')  # IRD guideline
    svat_adjustment = input_vat × export_ratio × enhancement_factor

Step 4: Apply Ceiling
    ceiling = input_vat × Decimal('0.20')  # 20% max
    svat_adjustment = min(svat_adjustment, ceiling)

Step 5: Validate and Return
    ├─► Ensure >= 0
    ├─► Round to 2 decimals
    └─► Return adjustment amount
```

### SVAT in VAT Return

```
VAT Return with SVAT Adjustment
════════════════════════════════

SECTION B: INPUT VAT (Purchases)

4. Local purchases
   Purchase Value:    LKR   800,000
   VAT Amount:        LKR    64,000
   
5. Imports
   Import Value:      LKR   200,000
   VAT Amount:        LKR    16,000

6. Total Input VAT before SVAT
                      LKR    80,000

7. SVAT Adjustment (if applicable)     ◄── Task 30
   Export Ratio: 85%                   ◄── Calculated
   SVAT Certificate: SVAT-2025-12345   ◄── Reference
   Adjustment Amount:  LKR    10,200   ◄── Additional claim
   
8. Total Claimable Input VAT
                      LKR    90,200   ◄── Enhanced

SECTION C: NET VAT
Output VAT:           LKR   100,000
Input VAT (with SVAT):LKR    90,200
───────────────────────────────────
Net VAT Payable:      LKR     9,800
```

### Line Items JSON Structure (SVAT)

```json
{
  "svat_calculation": {
    "is_svat_registered": true,
    "svat_certificate": "SVAT-2025-12345",
    "certificate_valid_until": "2026-12-31",
    "export_ratio": 0.857,
    "export_ratio_percentage": "85.7%",
    "threshold_met": true,
    "zero_rated_sales": 3000000.00,
    "standard_rated_sales": 500000.00,
    "total_taxable_sales": 3500000.00,
    "input_vat_before_svat": 80000.00,
    "enhancement_factor": 0.15,
    "calculated_adjustment": 10284.00,
    "ceiling_amount": 16000.00,
    "applied_adjustment": 10284.00,
    "total_claimable_input_vat": 90284.00
  }
}
```

### Business Impact Example

```
SVAT Impact on Cash Flow
═════════════════════════

Exporter: Garment Manufacturer

Scenario A: Without SVAT
─────────────────────────
Output VAT: LKR 50,000 (local sales)
Input VAT: LKR 400,000 (raw materials, etc.)
Net Position: LKR -350,000 (Refund)
Refund time: 60-90 days
Cash impact: Significant working capital tied up

Scenario B: With SVAT
─────────────────────
Output VAT: LKR 50,000
Input VAT: LKR 400,000
SVAT Adjustment: LKR 60,000 (additional)
Total Claimable: LKR 460,000
Net Position: LKR -410,000 (Larger refund)
Refund time: 30-45 days (priority processing)
Cash impact: Better cash flow, faster refunds

Benefit:
  ├─► Higher refund amount: +LKR 60,000
  ├─► Faster processing: -30 days
  └─► Improved working capital management
```

### Expected Outcome
- calculate_svat_adjustment() method working
- SVAT eligibility verification
- Export ratio calculation
- Enhancement factor application
- Ceiling enforcement
- Cash flow benefits for exporters

### Verification Checklist
- [ ] calculate_svat_adjustment() method created
- [ ] Returns Decimal (adjustment amount)
- [ ] Checks tenant.is_svat_registered
- [ ] Verifies SVAT certificate validity
- [ ] Calculates export ratio correctly
- [ ] Checks 60% threshold
- [ ] Applies enhancement factor (0.15)
- [ ] Enforces 20% ceiling
- [ ] Documents SVAT calculation in line_items
- [ ] Handles non-eligible cases (returns 0)

---

## Task 31: Create VAT Return PDF Template

### Overview
Create an IRD-compliant PDF template for VAT return reports. This template generates a professional, formatted PDF document that matches Sri Lanka's Inland Revenue Department requirements, suitable for official submission and record-keeping.

### Dependencies
- Task 25: VATReturn model complete
- PDF generation library (e.g., ReportLab or WeasyPrint)
- Django template system
- VATReturn instance with all data

### Instructions

1. **Create templates directory structure**
   - Navigate to `apps/accounting/templates/`
   - Create directory: `tax/`
   - Create file: `vat_return.html`

2. **Design HTML template**
   - Use IRD-compliant layout
   - Include all required sections
   - Header with business details
   - Section A: Output VAT
   - Section B: Input VAT
   - Section C: Net VAT calculation
   - Footer with declaration

3. **Add CSS styling**
   - Professional appearance
   - Print-friendly layout
   - Proper page breaks
   - IRD-style formatting
   - Tables with borders

4. **Include business header**
   - Business name and address
   - VAT TIN (Tax Identification Number)
   - Period information
   - Return reference number
   - Filing date

5. **Section A: Output VAT details**
   - Standard-rated sales table
   - Line items with invoice references
   - Subtotals by rate
   - Zero-rated sales section
   - Exempt sales section
   - Total output VAT

6. **Section B: Input VAT details**
   - Purchase invoices table
   - Supplier TIN verification
   - Local vs. import purchases
   - SVAT adjustment (if applicable)
   - Total input VAT

7. **Section C: Net VAT calculation**
   - Output VAT total
   - Input VAT total
   - Net VAT payable/refundable
   - Payment due date
   - Bank details (if payable)

8. **Add declaration section**
   - IRD-required declaration text
   - Signature block
   - Date field
   - Preparer details

9. **Create PDF generation function**
   - Function: generate_vat_return_pdf(vat_return)
   - Render HTML template with context
   - Convert HTML to PDF
   - Return PDF bytes

10. **Add print settings**
    - Page size: A4
    - Margins: 20mm all sides
    - Header/footer on each page
    - Page numbers

### IRD VAT Return Format

```
VAT RETURN FORMAT (Sri Lanka IRD)
═════════════════════════════════

┌────────────────────────────────────────────────┐
│         INLAND REVENUE DEPARTMENT              │
│    VALUE ADDED TAX (VAT) RETURN FORM           │
└────────────────────────────────────────────────┘

TAXPAYER INFORMATION
────────────────────
Business Name: ABC Company (Pvt) Ltd
VAT TIN: 123456789V
Address: 123 Galle Road, Colombo 03
Period: January 2026 (01/01/2026 - 31/01/2026)
Return Reference: VAT-202601-00001
Filing Date: 15/02/2026

SECTION A: OUTPUT VAT (Sales)
──────────────────────────────

1. Standard-rated supplies (8%)
   
   Invoice Number    Date        Customer            Amount        VAT
   ───────────────────────────────────────────────────────────────────
   INV-2026-00123   15/01/2026  ABC Co.         50,000.00   4,000.00
   INV-2026-00124   16/01/2026  XYZ Ltd         75,000.00   6,000.00
   ...
   ───────────────────────────────────────────────────────────────────
   SUBTOTAL:                                1,000,000.00  80,000.00

2. Zero-rated supplies (0%)
   
   Invoice Number    Date        Customer (Country)     Amount        VAT
   ───────────────────────────────────────────────────────────────────
   EXP-2026-00045   20/01/2026  UK Trading (UK)    500,000.00       0.00
   ...
   ───────────────────────────────────────────────────────────────────
   SUBTOTAL:                                  500,000.00       0.00

3. Exempt supplies
   
   Invoice Number    Date        Customer            Amount
   ──────────────────────────────────────────────────────────
   INV-2026-00150   25/01/2026  University      200,000.00
   ...
   ──────────────────────────────────────────────────────────
   SUBTOTAL:                                  200,000.00

TOTAL OUTPUT VAT:                                         80,000.00

SECTION B: INPUT VAT (Purchases)
─────────────────────────────────

4. Local purchases from VAT-registered suppliers
   
   Invoice         Date        Supplier (TIN)         Amount        VAT
   ───────────────────────────────────────────────────────────────────
   PURCH-2026-45  10/01/2026  Supplier A (555...)   400,000.00  32,000.00
   ...
   ───────────────────────────────────────────────────────────────────
   SUBTOTAL:                                    600,000.00  48,000.00

5. Imports (VAT paid at customs)
   
   Customs Decl.   Date        Supplier (Country)     Amount        VAT
   ───────────────────────────────────────────────────────────────────
   C-2026-456     12/01/2026  Overseas (India)     100,000.00   8,000.00
   ...
   ───────────────────────────────────────────────────────────────────
   SUBTOTAL:                                    100,000.00   8,000.00

6. SVAT Adjustment (if applicable)
   SVAT Certificate: SVAT-2025-12345
   Export Ratio: 85.7%
   Additional Input VAT Claimable:                           4,000.00

TOTAL INPUT VAT:                                          60,000.00

SECTION C: NET VAT PAYABLE/(REFUNDABLE)
────────────────────────────────────────

7. Total Output VAT (Section A)                           80,000.00
8. Total Input VAT (Section B)                            60,000.00
   ────────────────────────────────────────────────────────────────
9. NET VAT PAYABLE/(REFUNDABLE)                           20,000.00

Payment Due Date: 20/02/2026

Bank Payment Details:
  Bank: Bank of Ceylon
  Branch: Colombo Fort
  Account: 1234567890
  Reference: VAT-202601-00001

DECLARATION
───────────
I declare that the information given in this return is true, correct
and complete to the best of my knowledge and belief.

Signature: _____________________    Date: _______________

Name: _________________________     Position: Accountant

Contact: +94 11 234 5678            Email: accounts@company.lk

───────────────────────────────────────────────────────────────────
For Official Use Only
Received Date: _________  Reference: _________  Officer: _________
```

### HTML Template Structure

```html
<!-- apps/accounting/templates/tax/vat_return.html -->

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>VAT Return - {{ vat_return.period }}</title>
    <style>
        /* PDF-friendly CSS */
        @page {
            size: A4;
            margin: 20mm;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .section-title {
            background-color: #f0f0f0;
            padding: 5px;
            font-weight: bold;
            border: 1px solid #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        .amount {
            text-align: right;
        }
        .total-row {
            font-weight: bold;
            background-color: #e0e0e0;
        }
        .declaration {
            margin-top: 30px;
            font-size: 9pt;
            border: 1px solid #000;
            padding: 10px;
        }
        .signature-block {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>INLAND REVENUE DEPARTMENT</h1>
        <h2>VALUE ADDED TAX (VAT) RETURN FORM</h2>
    </div>

    <!-- Taxpayer Information -->
    <div class="section">
        <div class="section-title">TAXPAYER INFORMATION</div>
        <p>
            <strong>Business Name:</strong> {{ tenant.business_name }}<br>
            <strong>VAT TIN:</strong> {{ tenant.vat_tin }}<br>
            <strong>Address:</strong> {{ tenant.address }}<br>
            <strong>Period:</strong> {{ vat_return.period }} 
                ({{ vat_return.period.start_date|date:"d/m/Y" }} - 
                 {{ vat_return.period.end_date|date:"d/m/Y" }})<br>
            <strong>Return Reference:</strong> {{ vat_return.reference_number }}<br>
            <strong>Filing Date:</strong> {{ vat_return.filed_date|date:"d/m/Y" }}
        </p>
    </div>

    <!-- Section A: Output VAT -->
    <div class="section">
        <div class="section-title">SECTION A: OUTPUT VAT (Sales)</div>
        
        <!-- Standard-rated sales table -->
        <!-- Zero-rated sales table -->
        <!-- Exempt sales table -->
        <!-- Total output VAT -->
    </div>

    <!-- Section B: Input VAT -->
    <div class="section">
        <div class="section-title">SECTION B: INPUT VAT (Purchases)</div>
        
        <!-- Local purchases table -->
        <!-- Import purchases table -->
        <!-- SVAT adjustment -->
        <!-- Total input VAT -->
    </div>

    <!-- Section C: Net VAT -->
    <div class="section">
        <div class="section-title">SECTION C: NET VAT PAYABLE/(REFUNDABLE)</div>
        
        <!-- Calculation summary -->
        <!-- Payment details -->
    </div>

    <!-- Declaration -->
    <div class="declaration">
        <p>
            I declare that the information given in this return is true, correct
            and complete to the best of my knowledge and belief.
        </p>
        <div class="signature-block">
            <div>
                Signature: _____________________<br>
                Name: _________________________<br>
                Contact: _______________________
            </div>
            <div>
                Date: _______________<br>
                Position: ____________<br>
                Email: _______________
            </div>
        </div>
    </div>
</body>
</html>
```

### PDF Generation Function

```python
# In vat_return.py generator or separate utils file

from django.template.loader import render_to_string
from weasyprint import HTML  # or use ReportLab
import tempfile

def generate_vat_return_pdf(vat_return):
    """
    Generate IRD-compliant PDF for VAT return.
    
    Args:
        vat_return: VATReturn instance
        
    Returns:
        bytes: PDF content
    """
    # Prepare context data
    context = {
        'vat_return': vat_return,
        'tenant': vat_return.tenant,
        'period': vat_return.period,
        'line_items': vat_return.line_items,
        'today': timezone.now(),
    }
    
    # Render HTML template
    html_string = render_to_string(
        'tax/vat_return.html',
        context
    )
    
    # Generate PDF
    pdf_file = HTML(string=html_string).write_pdf()
    
    return pdf_file
```

### Expected Outcome
- Professional IRD-compliant PDF template
- All VAT return sections included
- Print-ready formatting
- Official declaration section
- PDF generation function working

### Verification Checklist
- [ ] vat_return.html template created
- [ ] Template structure matches IRD format
- [ ] CSS styling for print
- [ ] Header with business/period info
- [ ] Section A: Output VAT tables
- [ ] Section B: Input VAT tables
- [ ] Section C: Net VAT calculation
- [ ] Declaration and signature blocks
- [ ] generate_vat_return_pdf() function created
- [ ] PDF generation library configured
- [ ] A4 page size and margins set
- [ ] Test PDF renders correctly

---

## Task 32: Create VAT Return CSV Export

### Overview
Create a CSV export function for VAT return data that formats the information for upload to the IRD's electronic filing portal. The CSV follows a specific structure required by the IRD system, with headers and data fields in the exact order specified.

### Dependencies
- Task 25: VATReturn model with all fields
- Python CSV module
- VATReturn instance with complete data

### Instructions

1. **Create CSV generation function**
   - Function: generate_vat_return_csv(vat_return)
   - Located in generators/vat_return.py or separate utils
   - Returns CSV string content

2. **Define IRD CSV format**
   - Document required columns
   - Specify column order
   - Note data format requirements
   - Include header row

3. **Implement header row**
   - IRD-specified column names
   - Exact spelling and case
   - Proper order

4. **Generate summary row**
   - Return reference number
   - Period dates
   - Total output VAT
   - Total input VAT
   - Net VAT payable
   - Filing status

5. **Add detailed transaction rows**
   - One row per invoice (sales)
   - One row per purchase
   - Include all required fields
   - Proper formatting

6. **Format monetary values**
   - Two decimal places
   - No currency symbols
   - Use period as decimal separator
   - No thousands separators

7. **Format dates**
   - ISO format: YYYY-MM-DD
   - Consistent across all rows
   - No time components

8. **Handle special characters**
   - Escape commas in text fields
   - Remove line breaks
   - Handle Unicode properly

9. **Add validation**
   - Verify all required fields present
   - Check data format correctness
   - Validate totals match

### IRD CSV Format Specification

```
IRD VAT Return CSV Structure
════════════════════════════

File Type: CSV (Comma-Separated Values)
Encoding: UTF-8
Line Ending: CRLF (Windows) or LF (Unix)
Decimal Separator: Period (.)
Date Format: YYYY-MM-DD

Section 1: Header Row (required)
Section 2: Summary Row (required)
Section 3: Transaction Rows (one per invoice)
```

### CSV Column Structure

```
HEADER ROW:
───────────
1. Return Reference
2. VAT TIN
3. Business Name
4. Period Start
5. Period End
6. Filing Date
7. Output VAT Total
8. Input VAT Total
9. Net VAT Payable
10. Status

TRANSACTION ROWS (Sales):
─────────────────────────
1. Transaction Type (SALE)
2. Invoice Number
3. Invoice Date
4. Customer Name
5. Customer TIN
6. Taxable Amount
7. VAT Rate
8. VAT Amount
9. Total Amount
10. Category

TRANSACTION ROWS (Purchases):
─────────────────────────────
1. Transaction Type (PURCHASE)
2. Invoice Number
3. Invoice Date
4. Supplier Name
5. Supplier TIN
6. Taxable Amount
7. VAT Rate
8. VAT Amount
9. Total Amount
10. Category
```

### CSV Example Output

```csv
Return Reference,VAT TIN,Business Name,Period Start,Period End,Filing Date,Output VAT,Input VAT,Net VAT,Status
VAT-202601-00001,123456789V,ABC Company (Pvt) Ltd,2026-01-01,2026-01-31,2026-02-15,80000.00,60000.00,20000.00,FILED

Transaction Type,Invoice Number,Date,Party Name,Party TIN,Taxable Amount,VAT Rate,VAT Amount,Total Amount,Category
SALE,INV-2026-00123,2026-01-15,ABC Co.,123456789V,50000.00,8.00,4000.00,54000.00,STANDARD
SALE,INV-2026-00124,2026-01-16,XYZ Ltd,987654321V,75000.00,8.00,6000.00,81000.00,STANDARD
SALE,EXP-2026-00045,2026-01-20,UK Trading Ltd,,500000.00,0.00,0.00,500000.00,ZERO_RATED
SALE,INV-2026-00150,2026-01-25,University of Colombo,,200000.00,0.00,0.00,200000.00,EXEMPT
PURCHASE,PURCH-2026-00045,2026-01-10,Supplier A,555666777V,400000.00,8.00,32000.00,432000.00,LOCAL
PURCHASE,IMP-2026-00123,2026-01-12,Overseas Supplier,,200000.00,8.00,16000.00,216000.00,IMPORT
```

### CSV Generation Implementation

```python
import csv
from io import StringIO
from decimal import Decimal

def generate_vat_return_csv(vat_return):
    """
    Generate IRD-compliant CSV for VAT return.
    
    Args:
        vat_return: VATReturn instance with complete data
        
    Returns:
        str: CSV content as string
    """
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header row
    writer.writerow([
        'Return Reference',
        'VAT TIN',
        'Business Name',
        'Period Start',
        'Period End',
        'Filing Date',
        'Output VAT',
        'Input VAT',
        'Net VAT',
        'Status'
    ])
    
    # Write summary row
    writer.writerow([
        vat_return.reference_number or '',
        vat_return.tenant.vat_tin,
        vat_return.tenant.business_name,
        vat_return.period.start_date.isoformat(),
        vat_return.period.end_date.isoformat(),
        vat_return.filed_date.date().isoformat() if vat_return.filed_date else '',
        format_amount(vat_return.output_vat),
        format_amount(vat_return.input_vat),
        format_amount(vat_return.net_vat_payable),
        vat_return.status.upper()
    ])
    
    # Write transaction header
    writer.writerow([
        'Transaction Type',
        'Invoice Number',
        'Date',
        'Party Name',
        'Party TIN',
        'Taxable Amount',
        'VAT Rate',
        'VAT Amount',
        'Total Amount',
        'Category'
    ])
    
    # Write sales transactions
    line_items = vat_return.line_items
    
    # Standard-rated sales
    for item in line_items.get('standard_rated', []):
        writer.writerow([
            'SALE',
            item.get('invoice_number', ''),
            item.get('invoice_date', ''),
            clean_text(item.get('customer_name', '')),
            item.get('customer_tin', ''),
            format_amount(item.get('taxable_amount', 0)),
            format_amount(item.get('vat_rate', 0)),
            format_amount(item.get('vat_amount', 0)),
            format_amount(item.get('total_amount', 0)),
            'STANDARD'
        ])
    
    # Zero-rated sales
    for item in line_items.get('zero_rated', []):
        writer.writerow([
            'SALE',
            item.get('invoice_number', ''),
            item.get('invoice_date', ''),
            clean_text(item.get('customer_name', '')),
            item.get('customer_tin', ''),
            format_amount(item.get('taxable_amount', 0)),
            '0.00',
            '0.00',
            format_amount(item.get('total_amount', 0)),
            'ZERO_RATED'
        ])
    
    # Exempt sales
    for item in line_items.get('exempt', []):
        writer.writerow([
            'SALE',
            item.get('invoice_number', ''),
            item.get('invoice_date', ''),
            clean_text(item.get('customer_name', '')),
            '',
            format_amount(item.get('amount', 0)),
            '',
            '',
            format_amount(item.get('amount', 0)),
            'EXEMPT'
        ])
    
    # Write purchase transactions
    for item in line_items.get('purchases', []):
        writer.writerow([
            'PURCHASE',
            item.get('purchase_invoice', ''),
            item.get('invoice_date', ''),
            clean_text(item.get('supplier_name', '')),
            item.get('supplier_tin', ''),
            format_amount(item.get('taxable_amount', 0)),
            format_amount(item.get('vat_rate', 0)),
            format_amount(item.get('vat_amount', 0)),
            format_amount(item.get('total_amount', 0)),
            item.get('purchase_type', 'LOCAL').upper()
        ])
    
    csv_content = output.getvalue()
    output.close()
    
    return csv_content


def format_amount(value):
    """Format decimal amount for CSV (2 decimal places, no separators)"""
    if value is None:
        return '0.00'
    return f"{Decimal(value):.2f}"


def clean_text(text):
    """Remove problematic characters from text fields"""
    if not text:
        return ''
    # Remove line breaks and extra spaces
    text = ' '.join(text.split())
    # Escape quotes
    text = text.replace('"', '""')
    return text
```

### File Download Implementation

```python
# In views or API endpoint

from django.http import HttpResponse
from accounting.tax.generators import generate_vat_return_csv

def download_vat_return_csv(request, vat_return_id):
    """
    Download VAT return as CSV file.
    """
    vat_return = VATReturn.objects.get(
        id=vat_return_id,
        tenant=request.user.tenant
    )
    
    # Generate CSV content
    csv_content = generate_vat_return_csv(vat_return)
    
    # Create HTTP response
    response = HttpResponse(
        csv_content,
        content_type='text/csv'
    )
    
    # Set filename
    filename = f"VAT_Return_{vat_return.reference_number}.csv"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response
```

### CSV Validation Rules

```
CSV Validation Checklist
════════════════════════

Structure Validation:
  ✓ Header row present
  ✓ Summary row present
  ✓ Transaction header present
  ✓ At least one transaction row

Data Format Validation:
  ✓ Dates in YYYY-MM-DD format
  ✓ Amounts with 2 decimal places
  ✓ No currency symbols
  ✓ Proper encoding (UTF-8)

Content Validation:
  ✓ VAT TIN format correct
  ✓ Transaction types valid (SALE/PURCHASE)
  ✓ Categories valid (STANDARD/ZERO_RATED/EXEMPT/LOCAL/IMPORT)
  ✓ Totals match between summary and details

IRD Portal Validation:
  ✓ File size < 10 MB
  ✓ Correct column count
  ✓ No duplicate invoice numbers
  ✓ Return reference format valid
```

### IRD Upload Process

```
CSV Upload to IRD Portal
════════════════════════

Step 1: Generate CSV
  └─► generate_vat_return_csv(vat_return)

Step 2: Validate Locally
  └─► Check format and data correctness

Step 3: Save File
  └─► Save to user's device
      └─► Filename: VAT_Return_VAT-202601-00001.csv

Step 4: Access IRD Portal
  └─► Navigate to: https://ird.gov.lk/
      └─► Login with credentials

Step 5: Upload File
  └─► Select "VAT Return Upload"
      └─► Choose CSV file
          └─► Click "Submit"

Step 6: Portal Validation
  └─► IRD system validates file
      └─► If errors: Download error report
          └─► Fix and re-upload

Step 7: Confirmation
  └─► Receive confirmation number
      └─► Save confirmation for records
```

### Expected Outcome
- CSV generation function working
- IRD-compliant format
- Proper data formatting
- Ready for portal upload
- Download functionality

### Verification Checklist
- [ ] generate_vat_return_csv() function created
- [ ] Returns CSV string content
- [ ] Header row with correct columns
- [ ] Summary row with all fields
- [ ] Transaction rows for all invoices
- [ ] Amounts formatted with 2 decimals
- [ ] Dates in ISO format (YYYY-MM-DD)
- [ ] Text fields cleaned (no line breaks)
- [ ] Special characters escaped
- [ ] format_amount() helper function
- [ ] clean_text() helper function
- [ ] CSV validates against IRD requirements

---

## Task 33: Add VAT Summary by Rate

### Overview
Implement a method to generate a summary of VAT amounts grouped by tax rate. This summary provides a quick overview of how much VAT was collected at each rate (8%, 0%, exempt), useful for analysis and verification before filing.

### Dependencies
- Task 25: VATReturnGenerator class
- VATReturn model with line_items

### Instructions

1. **Open vat_return.py generator file**
   - Navigate to `apps/accounting/tax/generators/vat_return.py`
   - Locate VATReturnGenerator class

2. **Add get_vat_summary_by_rate method**
   - Public method, returns dictionary
   - Summarize VAT by rate category
   - Include counts and amounts

3. **Group by VAT rate**
   - 8% (standard rate)
   - 0% (zero-rated)
   - Exempt (N/A)
   - Other rates (if applicable)

4. **Calculate for each rate**
   - Count of transactions
   - Total taxable amount
   - Total VAT amount
   - Percentage of total sales

5. **Include metadata**
   - Period information
   - Generation timestamp
   - Overall totals

6. **Format for display**
   - Clear structure
   - Easy to read
   - Suitable for UI display or reports

### Summary Structure

```json
{
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "name": "January 2026"
  },
  "generated_at": "2026-02-15T10:30:00Z",
  "summary_by_rate": {
    "standard_8_percent": {
      "rate": 8.00,
      "rate_display": "8%",
      "transaction_count": 145,
      "taxable_amount": 1000000.00,
      "vat_amount": 80000.00,
      "percentage_of_sales": 58.8
    },
    "zero_rated": {
      "rate": 0.00,
      "rate_display": "0%",
      "transaction_count": 12,
      "taxable_amount": 500000.00,
      "vat_amount": 0.00,
      "percentage_of_sales": 29.4
    },
    "exempt": {
      "rate": null,
      "rate_display": "Exempt",
      "transaction_count": 8,
      "taxable_amount": 200000.00,
      "vat_amount": null,
      "percentage_of_sales": 11.8
    }
  },
  "totals": {
    "total_transactions": 165,
    "total_sales": 1700000.00,
    "total_output_vat": 80000.00,
    "total_input_vat": 60000.00,
    "net_vat_payable": 20000.00
  }
}
```

### Implementation

```python
def get_vat_summary_by_rate(self):
    """
    Generate VAT summary grouped by tax rate.
    
    Returns:
        dict: Summary data with rates, counts, and amounts
    """
    from decimal import Decimal
    from django.utils import timezone
    
    # Get line items from generated return or calculate fresh
    if hasattr(self, '_line_items'):
        line_items = self._line_items
    else:
        line_items = self._build_line_items()
    
    # Calculate standard rated (8%)
    standard_items = line_items.get('standard_rated', [])
    standard_count = len(standard_items)
    standard_taxable = sum(
        Decimal(item.get('taxable_amount', 0)) 
        for item in standard_items
    )
    standard_vat = sum(
        Decimal(item.get('vat_amount', 0)) 
        for item in standard_items
    )
    
    # Calculate zero-rated (0%)
    zero_items = line_items.get('zero_rated', [])
    zero_count = len(zero_items)
    zero_taxable = sum(
        Decimal(item.get('taxable_amount', 0)) 
        for item in zero_items
    )
    
    # Calculate exempt
    exempt_items = line_items.get('exempt', [])
    exempt_count = len(exempt_items)
    exempt_amount = sum(
        Decimal(item.get('amount', 0)) 
        for item in exempt_items
    )
    
    # Calculate totals
    total_sales = standard_taxable + zero_taxable + exempt_amount
    total_transactions = standard_count + zero_count + exempt_count
    
    # Calculate percentages
    standard_pct = (standard_taxable / total_sales * 100) if total_sales > 0 else 0
    zero_pct = (zero_taxable / total_sales * 100) if total_sales > 0 else 0
    exempt_pct = (exempt_amount / total_sales * 100) if total_sales > 0 else 0
    
    # Build summary
    summary = {
        'period': {
            'start_date': self.period.start_date.isoformat(),
            'end_date': self.period.end_date.isoformat(),
            'name': str(self.period)
        },
        'generated_at': timezone.now().isoformat(),
        'summary_by_rate': {
            'standard_8_percent': {
                'rate': 8.00,
                'rate_display': '8%',
                'transaction_count': standard_count,
                'taxable_amount': float(standard_taxable),
                'vat_amount': float(standard_vat),
                'percentage_of_sales': round(float(standard_pct), 2)
            },
            'zero_rated': {
                'rate': 0.00,
                'rate_display': '0%',
                'transaction_count': zero_count,
                'taxable_amount': float(zero_taxable),
                'vat_amount': 0.00,
                'percentage_of_sales': round(float(zero_pct), 2)
            },
            'exempt': {
                'rate': None,
                'rate_display': 'Exempt',
                'transaction_count': exempt_count,
                'taxable_amount': float(exempt_amount),
                'vat_amount': None,
                'percentage_of_sales': round(float(exempt_pct), 2)
            }
        },
        'totals': {
            'total_transactions': total_transactions,
            'total_sales': float(total_sales),
            'total_output_vat': float(standard_vat),
            'total_input_vat': float(self.get_purchase_vat()),
            'net_vat_payable': float(standard_vat - self.get_purchase_vat())
        }
    }
    
    return summary
```

### UI Display Example

```
VAT SUMMARY BY RATE - January 2026
═══════════════════════════════════════════════════════════

Rate      Transactions    Taxable Amount    VAT Amount    % of Sales
────────────────────────────────────────────────────────────────────
8%             145        LKR 1,000,000    LKR 80,000      58.8%
0%              12        LKR   500,000    LKR      0      29.4%
Exempt           8        LKR   200,000         N/A        11.8%
────────────────────────────────────────────────────────────────────
TOTAL          165        LKR 1,700,000    LKR 80,000     100.0%

SUMMARY:
  Output VAT:  LKR  80,000
  Input VAT:   LKR  60,000
  ─────────────────────────
  Net Payable: LKR  20,000
```

### Expected Outcome
- Summary method grouping by rate
- Transaction counts per rate
- Amount totals per rate
- Percentage calculations
- Ready for display/export

### Verification Checklist
- [ ] get_vat_summary_by_rate() method created
- [ ] Returns structured dictionary
- [ ] Includes standard (8%) rate summary
- [ ] Includes zero-rated (0%) summary
- [ ] Includes exempt summary
- [ ] Calculates transaction counts
- [ ] Calculates taxable amounts
- [ ] Calculates VAT amounts
- [ ] Calculates percentages
- [ ] Includes period and totals
- [ ] Format suitable for JSON/display

---

## Task 34: Create VAT Return API Endpoint

### Overview
Create a REST API endpoint to expose VAT return functionality. This endpoint allows frontend applications and external systems to generate, retrieve, and manage VAT returns programmatically.

### Dependencies
- Task 25: VATReturnGenerator complete
- Django REST Framework configured
- Authentication system in place
- VATReturn serializer

### Instructions

1. **Create VATReturn serializer**
   - File: `apps/accounting/serializers/vat_return.py`
   - VATReturnSerializer class
   - Include all fields
   - Add read-only computed fields

2. **Create VAT return viewset**
   - File: `apps/accounting/views/tax.py`
   - VATReturnViewSet class
   - Inherit from ModelViewSet
   - Tenant filtering

3. **Add list action**
   - GET /api/vat-returns/
   - List all returns for tenant
   - Filter by period, status
   - Pagination support

4. **Add retrieve action**
   - GET /api/vat-returns/{id}/
   - Get single return details
   - Include line items
   - Computed summaries

5. **Add generate action**
   - POST /api/vat-returns/generate/
   - Accept period_id parameter
   - Call VATReturnGenerator
   - Return created instance

6. **Add file action**
   - POST /api/vat-returns/{id}/file/
   - Change status to filed
   - Set filed_date
   - Generate reference number

7. **Add export actions**
   - GET /api/vat-returns/{id}/export/pdf/
   - GET /api/vat-returns/{id}/export/csv/
   - Return file downloads

8. **Add summary action**
   - GET /api/vat-returns/{id}/summary/
   - Return VAT summary by rate
   - Quick overview data

9. **Configure URL routing**
   - Register viewset with router
   - Define URL patterns

10. **Add permissions**
    - Tenant-based access control
    - Role-based permissions
    - Filed returns read-only

### API Endpoints Summary

```
VAT Return API Endpoints
════════════════════════

List Returns:
  GET /api/vat-returns/
  Query params: ?status=filed&period=2026-01

Get Return:
  GET /api/vat-returns/{id}/

Generate Return:
  POST /api/vat-returns/generate/
  Body: {"period_id": 123}

File Return:
  POST /api/vat-returns/{id}/file/
  Body: {}

Export PDF:
  GET /api/vat-returns/{id}/export/pdf/

Export CSV:
  GET /api/vat-returns/{id}/export/csv/

Get Summary:
  GET /api/vat-returns/{id}/summary/

Update Return:
  PUT /api/vat-returns/{id}/
  PATCH /api/vat-returns/{id}/
  (Only draft status)

Delete Return:
  DELETE /api/vat-returns/{id}/
  (Only draft status)
```

### Serializer Implementation

```python
# apps/accounting/serializers/vat_return.py

from rest_framework import serializers
from accounting.models import VATReturn, TaxPeriod

class VATReturnSerializer(serializers.ModelSerializer):
    """Serializer for VAT Return model."""
    
    period_display = serializers.CharField(
        source='period.__str__',
        read_only=True
    )
    output_vat_display = serializers.CharField(read_only=True)
    input_vat_display = serializers.CharField(read_only=True)
    net_vat_payable_display = serializers.CharField(read_only=True)
    is_refund_position = serializers.BooleanField(read_only=True)
    filing_deadline = serializers.DateField(read_only=True)
    is_filed_late = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = VATReturn
        fields = [
            'id',
            'tenant',
            'period',
            'period_display',
            'status',
            'reference_number',
            'output_vat',
            'output_vat_display',
            'input_vat',
            'input_vat_display',
            'net_vat_payable',
            'net_vat_payable_display',
            'is_refund_position',
            'line_items',
            'notes',
            'filed_date',
            'filed_by',
            'filing_deadline',
            'is_filed_late',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'tenant',
            'reference_number',
            'output_vat',
            'input_vat',
            'net_vat_payable',
            'line_items',
            'filed_date',
            'filed_by',
            'created_at',
            'updated_at',
        ]
```

### ViewSet Implementation

```python
# apps/accounting/views/tax.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse

from accounting.models import VATReturn, TaxPeriod
from accounting.serializers import VATReturnSerializer
from accounting.tax.generators import VATReturnGenerator
from accounting.tax.generators.vat_return import (
    generate_vat_return_pdf,
    generate_vat_return_csv
)

class VATReturnViewSet(viewsets.ModelViewSet):
    """API endpoint for VAT Returns."""
    
    serializer_class = VATReturnSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter returns by tenant."""
        return VATReturn.objects.filter(
            tenant=self.request.user.tenant
        ).select_related(
            'period',
            'filed_by'
        ).order_by('-created_at')
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Generate new VAT return for specified period.
        
        POST /api/vat-returns/generate/
        Body: {"period_id": 123}
        """
        period_id = request.data.get('period_id')
        
        if not period_id:
            return Response(
                {'error': 'period_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            period = TaxPeriod.objects.get(
                id=period_id,
                tenant=request.user.tenant
            )
        except TaxPeriod.DoesNotExist:
            return Response(
                {'error': 'Period not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if return already exists
        if VATReturn.objects.filter(
            tenant=request.user.tenant,
            period=period
        ).exists():
            return Response(
                {'error': 'VAT return already exists for this period'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate return
        try:
            generator = VATReturnGenerator(
                tenant=request.user.tenant,
                period=period
            )
            vat_return = generator.generate()
            
            serializer = self.get_serializer(vat_return)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def file(self, request, pk=None):
        """
        File VAT return with IRD.
        
        POST /api/vat-returns/{id}/file/
        """
        vat_return = self.get_object()
        
        if vat_return.status != 'draft':
            return Response(
                {'error': 'Only draft returns can be filed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update status and filing info
        from django.utils import timezone
        vat_return.status = 'filed'
        vat_return.filed_date = timezone.now()
        vat_return.filed_by = request.user
        
        # Generate reference number if not exists
        if not vat_return.reference_number:
            vat_return.reference_number = vat_return.generate_reference_number()
        
        vat_return.save()
        
        serializer = self.get_serializer(vat_return)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        """
        Export VAT return as PDF.
        
        GET /api/vat-returns/{id}/export/pdf/
        """
        vat_return = self.get_object()
        
        pdf_content = generate_vat_return_pdf(vat_return)
        
        response = HttpResponse(
            pdf_content,
            content_type='application/pdf'
        )
        filename = f"VAT_Return_{vat_return.reference_number or vat_return.id}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
    
    @action(detail=True, methods=['get'])
    def export_csv(self, request, pk=None):
        """
        Export VAT return as CSV.
        
        GET /api/vat-returns/{id}/export/csv/
        """
        vat_return = self.get_object()
        
        csv_content = generate_vat_return_csv(vat_return)
        
        response = HttpResponse(
            csv_content,
            content_type='text/csv'
        )
        filename = f"VAT_Return_{vat_return.reference_number or vat_return.id}.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
    
    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        """
        Get VAT summary by rate.
        
        GET /api/vat-returns/{id}/summary/
        """
        vat_return = self.get_object()
        
        generator = VATReturnGenerator(
            tenant=vat_return.tenant,
            period=vat_return.period
        )
        
        summary = generator.get_vat_summary_by_rate()
        
        return Response(summary)
```

### URL Configuration

```python
# apps/accounting/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.tax import VATReturnViewSet

router = DefaultRouter()
router.register(r'vat-returns', VATReturnViewSet, basename='vatreturn')

urlpatterns = [
    path('api/', include(router.urls)),
]
```

### Expected Outcome
- RESTful API for VAT returns
- Generate, retrieve, file operations
- PDF and CSV exports
- Summary endpoint
- Tenant-based security

### Verification Checklist
- [ ] VATReturnSerializer created
- [ ] VATReturnViewSet created
- [ ] List endpoint working (GET /api/vat-returns/)
- [ ] Retrieve endpoint working (GET /api/vat-returns/{id}/)
- [ ] Generate action implemented (POST /api/vat-returns/generate/)
- [ ] File action implemented (POST /api/vat-returns/{id}/file/)
- [ ] PDF export action (GET /api/vat-returns/{id}/export/pdf/)
- [ ] CSV export action (GET /api/vat-returns/{id}/export/csv/)
- [ ] Summary action (GET /api/vat-returns/{id}/summary/)
- [ ] URL routing configured
- [ ] Tenant filtering enforced
- [ ] Permissions configured

---

## Summary

This document completed the VATReturnGenerator service class and all supporting functionality for VAT return generation:

- **VATReturnGenerator:** Main service class coordinating all calculations
- **Sales VAT Calculation:** Output VAT from invoices
- **Purchase VAT Calculation:** Input VAT with claimability rules
- **Zero-Rated Sales:** Export and essential items tracking
- **Exempt Sales:** Non-VAT supplies handling
- **SVAT Adjustments:** Export business benefits
- **PDF Export:** IRD-compliant printable format
- **CSV Export:** IRD portal upload format
- **VAT Summary:** Grouped analysis by rate
- **REST API:** Full programmatic access

The system now supports complete VAT return generation, filing, and export for Sri Lankan businesses, with special handling for exports, SVAT registration, and IRD compliance requirements.
