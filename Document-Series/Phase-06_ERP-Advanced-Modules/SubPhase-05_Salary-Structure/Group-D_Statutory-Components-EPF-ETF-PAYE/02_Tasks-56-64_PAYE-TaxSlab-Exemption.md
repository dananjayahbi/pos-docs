# Tasks 56-64: PAYE Tax Slab and Tax Exemption Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** D - Statutory Components (EPF/ETF/PAYE)  
> **Document:** 02 of 02  
> **Tasks Covered:** 56, 57, 58, 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-55_EPF-ETF-Settings.md](01_Tasks-49-55_EPF-ETF-Settings.md)

---

## Document Overview

This document covers the implementation of PAYE (Pay As You Earn) tax calculation infrastructure for Sri Lankan income tax compliance. This includes tax slab models for progressive taxation, tax exemption models for personal reliefs, and management commands to seed current tax rates and exemptions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 56 | Create PAYETaxSlab Model | Medium | 25 min |
| 57 | Add Tax Slab Fields | Medium | 20 min |
| 58 | Add Tax Year Field | Low | 15 min |
| 59 | Run PAYETaxSlab Migrations | Low | 15 min |
| 60 | Create Current Tax Slabs Seed | Medium | 25 min |
| 61 | Create TaxExemption Model | Medium | 20 min |
| 62 | Add Exemption Fields | Low | 15 min |
| 63 | Run TaxExemption Migrations | Low | 15 min |
| 64 | Create Default Exemptions Seed | Medium | 20 min |

---

## Task 56: Create PAYETaxSlab Model

### Overview
Create the PAYETaxSlab model to store progressive income tax slab configurations for PAYE (Pay As You Earn) calculations. PAYE is the system by which employees pay income tax throughout the year via monthly salary deductions. Tax slabs define the progressive tax brackets where different income ranges are taxed at different rates.

### Dependencies
- Payroll application exists
- Tenant/Client model exists
- Base model mixins available
- Django ORM configured
- Understanding of progressive taxation

### Instructions

1. **Create paye_slab.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `paye_slab.py`
   - Will contain the PAYETaxSlab model

2. **Import required modules**
   - Import Django model fields (CharField, DecimalField, DateField, IntegerField, BooleanField)
   - Import Django models base class
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import tenant/client model
   - Import Decimal and date types

3. **Define PAYETaxSlab model class**
   - Create class named PAYETaxSlab
   - Inherit from Django Model
   - Add comprehensive docstring explaining progressive taxation

4. **Add tenant relationship field**
   - ForeignKey to Client/Tenant model (NOT OneToOne - multiple slabs per tenant)
   - Sets on_delete=CASCADE
   - Related_name='paye_tax_slabs'
   - Each tenant can have multiple tax slabs (one per bracket)

5. **Add order field**
   - IntegerField to control slab sequence
   - Required field
   - Used for sorting slabs (0, 1, 2, ...)
   - Ensures correct progressive calculation order

6. **Add effective_from field**
   - DateField indicating when these slabs become effective
   - Required field
   - Allows for tax year changes
   - Historical tax rate queries

7. **Add effective_to field**
   - DateField indicating when slabs expire
   - Optional (blank=True, null=True)
   - Null means currently active
   - Used when tax slabs change

8. **Add is_active field**
   - BooleanField with default=True
   - Controls whether slabs are currently used
   - Allows disabling old tax slabs

9. **Add Meta class**
   - Set verbose_name to "PAYE Tax Slab"
   - Set verbose_name_plural to "PAYE Tax Slabs"
   - Add ordering by ['tenant', 'tax_year', 'order']
   - Add unique_together on (tenant, tax_year, order)

10. **Add __str__ method**
    - Return format showing tax bracket
    - Example: "Tax Slab: 1,200,001-1,700,000 @ 6% (2024)"
    - Include tax year for clarity

11. **Add model docstring**
    - Explain progressive taxation concept
    - Document that multiple slabs per tenant
    - Note Sri Lankan PAYE context

12. **Update models/__init__.py**
    - Import PAYETaxSlab from paye_slab
    - Add PAYETaxSlab to __all__ list

### PAYETaxSlab Model Structure

```
┌─────────────────────────────────────────────────┐
│          PAYETaxSlab Model                      │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • tenant (ForeignKey)                          │
│  • order (IntegerField)                         │
│  • effective_from (DateField)                   │
│  • effective_to (DateField, nullable)           │
│  • is_active (BooleanField)                     │
│                                                 │
│ Slab Fields (Task 57):                          │
│  • from_amount (DecimalField)                   │
│  • to_amount (DecimalField, nullable)           │
│  • rate (DecimalField)                          │
│                                                 │
│ Year Field (Task 58):                           │
│  • tax_year (IntegerField)                      │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│   PAYETaxSlab      │
│   (Client)   │                      │  (Multiple slabs)  │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ Used for
                                               ▼
                                      ┌────────────────────┐
                                      │  PAYE Calculation  │
                                      │   (Payroll)        │
                                      └────────────────────┘
```

### Progressive Taxation Overview

#### What is Progressive Taxation?
Progressive taxation means higher income is taxed at higher rates. Income is divided into brackets (slabs), and each bracket is taxed at its own rate.

#### Progressive vs Flat Tax

```
Progressive Tax (Sri Lanka):
Income: 2,400,000 LKR/year

Slab 1 (0-1,200,000):       0% → 0
Slab 2 (1,200,001-1,700,000): 6% → 30,000
Slab 3 (1,700,001-2,200,000): 12% → 60,000
Slab 4 (2,200,001-2,400,000): 18% → 36,000
──────────────────────────────────────
Total Tax: 126,000 LKR (5.25% effective)

Flat Tax (Hypothetical 10%):
Income: 2,400,000 LKR/year
Tax: 240,000 LKR (10% on all income)
```

### Sri Lanka PAYE Tax Slabs (2024)

```
Tax Year 2024 Slabs:
┌──────────────────────────────────────────────────┐
│ Annual Income Range     │ Rate  │ Max Tax/Slab   │
├──────────────────────────────────────────────────┤
│ 0 - 1,200,000           │  0%   │ 0              │
│ 1,200,001 - 1,700,000   │  6%   │ 30,000         │
│ 1,700,001 - 2,200,000   │ 12%   │ 60,000         │
│ 2,200,001 - 2,700,000   │ 18%   │ 90,000         │
│ 2,700,001 - 3,200,000   │ 24%   │ 120,000        │
│ 3,200,001 - 3,700,000   │ 30%   │ 150,000        │
│ 3,700,001+              │ 36%   │ Unlimited      │
└──────────────────────────────────────────────────┘
```

### Tax Slab Representation in Database

```
For Tax Year 2024, Tenant A will have 7 records:

Record 1 (Slab 0):
├── order: 0
├── from_amount: 0
├── to_amount: 1,200,000
├── rate: 0.00
└── tax_year: 2024

Record 2 (Slab 1):
├── order: 1
├── from_amount: 1,200,001
├── to_amount: 1,700,000
├── rate: 6.00
└── tax_year: 2024

Record 3 (Slab 2):
├── order: 2
├── from_amount: 1,700,001
├── to_amount: 2,200,000
├── rate: 12.00
└── tax_year: 2024

... (continues for all 7 slabs)

Record 7 (Top slab):
├── order: 6
├── from_amount: 3,700,001
├── to_amount: null (unlimited)
├── rate: 36.00
└── tax_year: 2024
```

### Multiple Tax Years Support

```
Tenant Tax Slabs Timeline:
┌────────────────────────────────────────────────┐
│ Tax Year 2023 (Slabs: 7 records)               │
│   effective_from: 2023-01-01                   │
│   effective_to: 2023-12-31                     │
│   is_active: False                             │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│ Tax Year 2024 (Slabs: 7 records)               │
│   effective_from: 2024-01-01                   │
│   effective_to: null                           │
│   is_active: True                              │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│ Tax Year 2025 (Slabs: TBD)                     │
│   Created when new rates announced             │
└────────────────────────────────────────────────┘
```

### Order Field Purpose

```
Order ensures correct progressive calculation:

Query: Get tax slabs for calculation
PAYETaxSlab.objects.filter(
    tenant=tenant,
    tax_year=2024,
    is_active=True
).order_by('order')

Result: Slabs in correct sequence (0, 1, 2, ...)
└── Enables iterative tax calculation
    from lowest to highest bracket
```

### Why ForeignKey Instead of OneToOne?

```
OneToOne Relationship:
├── One tenant → One PAYETaxSlab record
└── ❌ Cannot represent multiple tax brackets

ForeignKey Relationship:
├── One tenant → Multiple PAYETaxSlab records
└── ✅ Can represent 7+ tax brackets per year
    ├── Slab 0: 0-1.2M @ 0%
    ├── Slab 1: 1.2M-1.7M @ 6%
    ├── Slab 2: 1.7M-2.2M @ 12%
    └── ... (and so on)
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| tenant | ForeignKey | Yes | - | Tenant association |
| order | IntegerField | Yes | - | Slab sequence |
| effective_from | DateField | Yes | - | Start date |
| effective_to | DateField | No | null | End date (null=current) |
| is_active | BooleanField | Yes | True | Active status |

### PAYE Context in Sri Lanka

```
PAYE System:
├── Employer deducts tax monthly from salary
├── Based on annual taxable income projection
├── Progressive slabs applied monthly
├── Final reconciliation at year end
└── Administered by Inland Revenue Department

Tax Calculation Frequency:
├── Annual: Total tax for the year
├── Monthly: Annual tax / 12
└── Withholding: Deducted from monthly salary

Example:
Annual Taxable Income: 2,400,000 LKR
Annual Tax: 126,000 LKR
Monthly Deduction: 10,500 LKR
```

### Expected Outcome
- Functional PAYETaxSlab model created
- Support for multiple tax brackets per tenant
- Progressive taxation capability
- Historical tax year support
- Ordered slab application

### Verification Checklist
- [ ] paye_slab.py file created
- [ ] PAYETaxSlab class defined
- [ ] tenant field added (ForeignKey)
- [ ] order field added
- [ ] effective_from field added
- [ ] effective_to field added (nullable)
- [ ] is_active field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Progressive taxation documented
- [ ] Model imported in __init__.py

---

## Task 57: Add Tax Slab Fields

### Overview
Add the core tax slab fields to the PAYETaxSlab model that define each tax bracket's income range and tax rate. These fields enable the calculation of progressive income tax by specifying the from/to amounts for each bracket and the applicable tax rate.

### Dependencies
- Task 56: Create PAYETaxSlab Model

### Instructions

1. **Open paye_slab.py model file**
   - Navigate to `apps/payroll/models/paye_slab.py`
   - Locate PAYETaxSlab model class

2. **Import Decimal if not already imported**
   - From decimal import Decimal
   - Used for precise tax calculations

3. **Add from_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Required field (no blank/null)
   - Represents the start of the income bracket (annual amount)
   - Example: 1,200,001.00

4. **Add field help text for from_amount**
   - Help text: "Annual income starting from this amount (inclusive)"
   - Clarifies that amount is annual, not monthly

5. **Add to_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Optional field (blank=True, null=True)
   - Represents the end of the income bracket
   - Null for the top slab (unlimited upper bound)

6. **Add field help text for to_amount**
   - Help text: "Annual income up to this amount (inclusive). Leave empty for top slab."
   - Explains nullable behavior

7. **Add rate field**
   - DecimalField with max_digits=5, decimal_places=2
   - Required field
   - Represents tax rate as percentage (e.g., 6.00 for 6%)
   - Range: 0.00 to 100.00

8. **Add field help text for rate**
   - Help text: "Tax rate as percentage (e.g., 6.00 for 6%)"
   - Clarifies percentage format

9. **Add clean method validation**
   - Override clean() method
   - Validate from_amount >= 0
   - Validate to_amount > from_amount (if to_amount is not null)
   - Validate rate >= 0 and rate <= 100
   - Raise ValidationError for invalid values

10. **Add helper method: calculate_slab_tax**
    - Method signature: calculate_slab_tax(taxable_income)
    - Calculates tax for the portion of income in this slab
    - Returns Decimal (tax amount for this slab only)

11. **Update model docstring**
    - Document from_amount, to_amount, rate fields
    - Explain annual vs monthly amounts
    - Provide Sri Lankan tax slab examples

### Tax Slab Fields Structure

```
┌────────────────────────────────────────────────┐
│          Tax Slab Amount Fields                │
├────────────────────────────────────────────────┤
│ from_amount                                    │
│  • Type: DecimalField(12, 2)                   │
│  • Required: Yes                               │
│  • Purpose: Start of income bracket (annual)   │
│                                                │
│ to_amount                                      │
│  • Type: DecimalField(12, 2)                   │
│  • Required: No (nullable)                     │
│  • Purpose: End of bracket (null=unlimited)    │
│                                                │
│ rate                                           │
│  • Type: DecimalField(5, 2)                    │
│  • Required: Yes                               │
│  • Purpose: Tax rate percentage                │
│  • Range: 0.00 - 100.00                        │
└────────────────────────────────────────────────┘
```

### Tax Slab Field Examples

```
Slab 1 (Tax-Free):
├── from_amount: 0.00
├── to_amount: 1,200,000.00
└── rate: 0.00

Slab 2:
├── from_amount: 1,200,001.00
├── to_amount: 1,700,000.00
└── rate: 6.00

Slab 7 (Top Slab - Unlimited):
├── from_amount: 3,700,001.00
├── to_amount: null (no upper limit)
└── rate: 36.00
```

### Field Precision Requirements

#### Why DecimalField(12, 2) for Amounts?
```
Max Digits: 12
Decimal Places: 2

Range: 000,000,000.00 to 999,999,999.99
Practical: Up to ~1 billion LKR annually

Examples:
✅ 1,200,000.00 (Valid)
✅ 50,000,000.00 (Valid - high income)
✅ 999,999,999.99 (Valid - max)
❌ 1,200,000.456 (Too many decimals)
```

#### Why DecimalField(5, 2) for Rate?
```
Max Digits: 5
Decimal Places: 2

Range: 000.00 to 999.99
Practical: 0.00 to 100.00

Examples:
✅ 0.00 (Tax-free slab)
✅ 6.00 (6% rate)
✅ 36.00 (36% rate)
❌ 150.00 (Exceeds 100%)
```

### Sri Lanka Tax Slabs (2024) - Complete

```
┌──────────────────────────────────────────────────────────┐
│ Slab │ From (LKR)  │ To (LKR)    │ Rate  │ Tax on Slab   │
├──────────────────────────────────────────────────────────┤
│  0   │ 0           │ 1,200,000   │  0%   │ 0             │
│  1   │ 1,200,001   │ 1,700,000   │  6%   │ 30,000 max    │
│  2   │ 1,700,001   │ 2,200,000   │ 12%   │ 60,000 max    │
│  3   │ 2,200,001   │ 2,700,000   │ 18%   │ 90,000 max    │
│  4   │ 2,700,001   │ 3,200,000   │ 24%   │ 120,000 max   │
│  5   │ 3,200,001   │ 3,700,000   │ 30%   │ 150,000 max   │
│  6   │ 3,700,001   │ null        │ 36%   │ Unlimited     │
└──────────────────────────────────────────────────────────┘
```

### Progressive Tax Calculation Example

```
Employee Annual Taxable Income: 2,400,000 LKR

Step-by-Step Calculation:
┌────────────────────────────────────────────────┐
│ Slab 0: 0 - 1,200,000 @ 0%                    │
│   Income in slab: 1,200,000                   │
│   Tax: 1,200,000 × 0% = 0                     │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│ Slab 1: 1,200,001 - 1,700,000 @ 6%            │
│   Income in slab: 500,000                     │
│   Tax: 500,000 × 6% = 30,000                  │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│ Slab 2: 1,700,001 - 2,200,000 @ 12%           │
│   Income in slab: 500,000                     │
│   Tax: 500,000 × 12% = 60,000                 │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│ Slab 3: 2,200,001 - 2,700,000 @ 18%           │
│   Income in slab: 200,000 (partial)           │
│   Tax: 200,000 × 18% = 36,000                 │
└────────────────────────────────────────────────┘
──────────────────────────────────────────────────
Total Annual Tax: 126,000 LKR
Monthly Deduction: 10,500 LKR
Effective Rate: 5.25%
```

### calculate_slab_tax() Method Logic

```
Method Signature:
def calculate_slab_tax(self, taxable_income):
    """
    Calculate tax for portion of income in this slab.
    
    Args:
        taxable_income (Decimal): Total annual taxable income
        
    Returns:
        Decimal: Tax amount for this slab only
    """

Logic:
1. If taxable_income <= from_amount:
   └── Return 0 (income doesn't reach this slab)

2. If to_amount is None (top slab):
   └── income_in_slab = taxable_income - from_amount
   └── tax = income_in_slab × (rate / 100)
   └── Return tax

3. If taxable_income <= to_amount:
   └── income_in_slab = taxable_income - from_amount
   └── tax = income_in_slab × (rate / 100)
   └── Return tax

4. If taxable_income > to_amount:
   └── income_in_slab = to_amount - from_amount + 1
   └── tax = income_in_slab × (rate / 100)
   └── Return tax

Example Usage:
slab = PAYETaxSlab.objects.get(order=1)  # 1.2M-1.7M @ 6%
tax = slab.calculate_slab_tax(Decimal('2400000'))
# Returns: 30,000 (full slab taxed)
```

### Validation Rules

```
Field Validation:
├── from_amount >= 0
├── to_amount > from_amount (if not null)
├── rate >= 0
├── rate <= 100
└── Decimal precision maintained

Valid Examples:
✅ from=0, to=1200000, rate=0
✅ from=1200001, to=1700000, rate=6
✅ from=3700001, to=null, rate=36

Invalid Examples:
❌ from=1700000, to=1200000 (to < from)
❌ from=-100000 (negative)
❌ rate=150 (exceeds 100%)
❌ rate=-5 (negative rate)
```

### Monthly vs Annual Amounts

```
Important: All slab amounts are ANNUAL

Slab Storage:
├── from_amount: 1,200,001 (Annual)
├── to_amount: 1,700,000 (Annual)
└── rate: 6.00

Calculation Flow:
1. Calculate annual taxable income:
   └── Monthly taxable × 12

2. Apply progressive slabs on annual amount

3. Calculate monthly deduction:
   └── Annual tax / 12

Example:
Monthly Taxable Salary: 200,000 LKR
Annual Projection: 2,400,000 LKR ← Use this for slabs
Annual Tax: 126,000 LKR
Monthly Deduction: 10,500 LKR ← Deduct this
```

### Top Slab (Unlimited) Handling

```
Top Slab Characteristics:
├── from_amount: 3,700,001
├── to_amount: null (unlimited)
└── rate: 36.00

Calculation for 10,000,000 LKR Income:
Income in top slab: 10,000,000 - 3,700,001 = 6,299,999
Tax on top slab: 6,299,999 × 36% = 2,267,999.64

Total Tax Calculation:
├── Slab 0-5: Fixed amounts (max out each slab)
├── Slab 6: Variable (depends on income)
└── Sum all slabs
```

### Slab Boundary Behavior

```
Inclusive Boundaries:
├── from_amount: Inclusive (>=)
└── to_amount: Inclusive (<=)

Example: Slab 1,200,001 - 1,700,000
├── 1,200,001: ✅ In slab
├── 1,500,000: ✅ In slab
└── 1,700,000: ✅ In slab

Next Slab: 1,700,001 - 2,200,000
├── 1,700,001: ✅ In this slab (not previous)
```

### Expected Outcome
- Income bracket fields configured (from/to amounts)
- Tax rate field added
- Validation for logical bracket ranges
- Helper method for slab-specific tax calculation
- Support for unlimited top slab (null to_amount)

### Verification Checklist
- [ ] from_amount field added
- [ ] to_amount field added (nullable)
- [ ] rate field added
- [ ] All fields have appropriate precision
- [ ] Help text added for all fields
- [ ] clean() method with validation
- [ ] from_amount < to_amount validation
- [ ] Rate range validation (0-100)
- [ ] calculate_slab_tax() method created
- [ ] Method handles null to_amount (top slab)
- [ ] Model docstring updated

---

## Task 58: Add Tax Year Field

### Overview
Add a tax_year field to the PAYETaxSlab model to enable versioning of tax slabs by year. Tax rates and brackets change over time as the government announces new budgets, and this field allows the system to maintain historical tax rates while supporting current and future tax years.

### Dependencies
- Task 57: Add Tax Slab Fields

### Instructions

1. **Open paye_slab.py model file**
   - Continue in `apps/payroll/models/paye_slab.py`
   - Locate PAYETaxSlab model class

2. **Add tax_year field**
   - IntegerField to store 4-digit year
   - Required field (no blank/null)
   - Represents the tax year these slabs apply to
   - Example: 2024, 2025

3. **Add field help text**
   - Help text: "Tax year for which these slabs are applicable (e.g., 2024)"
   - Clarifies year format

4. **Add field verbose name**
   - Verbose_name: "Tax Year"
   - User-friendly label

5. **Update Meta class**
   - Modify ordering to include tax_year: ['tenant', '-tax_year', 'order']
   - Update unique_together: (tenant, tax_year, order)
   - Add index on (tenant, tax_year, is_active)

6. **Add year validation in clean method**
   - Extend existing clean() method
   - Validate tax_year >= 2000 (reasonable lower bound)
   - Validate tax_year <= current_year + 5 (prevent far future years)
   - Raise ValidationError if year is invalid

7. **Add class method: get_slabs_for_year**
   - Class method to fetch all slabs for a specific tenant and year
   - Method signature: get_slabs_for_year(cls, tenant, tax_year)
   - Returns QuerySet ordered by slab order
   - Filters by is_active=True

8. **Update __str__ method**
   - Include tax_year in string representation
   - Format: "Slab {order}: {from}-{to} @ {rate}% ({tax_year})"

9. **Update model docstring**
   - Document tax year versioning
   - Explain multiple years support
   - Note Sri Lankan tax year (calendar year: Jan-Dec)

### Tax Year Field Structure

```
┌────────────────────────────────────────────────┐
│            Tax Year Field                      │
├────────────────────────────────────────────────┤
│ tax_year                                       │
│  • Type: IntegerField                          │
│  • Required: Yes                               │
│  • Format: YYYY (e.g., 2024)                   │
│  • Purpose: Version tax slabs by year          │
│  • Range: 2000 - (current_year + 5)            │
└────────────────────────────────────────────────┘
```

### Multi-Year Tax Slab Management

```
Database Structure:
┌────────────────────────────────────────────────┐
│ Tenant A - Tax Year 2023 (7 slabs)            │
│   ├── Slab 0: 0-1,200,000 @ 0% (2023)         │
│   ├── Slab 1: 1,200,001-1,700,000 @ 6% (2023) │
│   └── ... (5 more slabs for 2023)             │
├────────────────────────────────────────────────┤
│ Tenant A - Tax Year 2024 (7 slabs)            │
│   ├── Slab 0: 0-1,200,000 @ 0% (2024)         │
│   ├── Slab 1: 1,200,001-1,700,000 @ 6% (2024) │
│   └── ... (5 more slabs for 2024)             │
├────────────────────────────────────────────────┤
│ Tenant B - Tax Year 2024 (7 slabs)            │
│   └── (Tenant B has its own slab set)         │
└────────────────────────────────────────────────┘
```

### Tax Year Versioning Benefits

```
Historical Accuracy:
├── Calculate past payroll with correct rates
├── Generate historical reports accurately
├── Audit trail for tax compliance
└── Support for amended returns

Future Planning:
├── Pre-configure next year's rates
├── Test payroll before year change
├── Smooth transition on January 1
└── Budget forecasting

Multi-Tenant Flexibility:
├── Different tax jurisdictions (if needed)
├── Custom rates per tenant (special cases)
├── Override standard rates when required
└── Maintain tenant autonomy
```

### Sri Lankan Tax Year Context

```
Sri Lankan Tax Year:
├── Assessment Year: Calendar year (Jan 1 - Dec 31)
├── Tax Rates: Announced in annual budget (Nov/Dec)
├── Effective Date: Usually January 1 of tax year
└── Year of Income: Same as assessment year

Example Timeline:
2023 Budget (Nov 2022):
├── Announces 2023 tax rates
└── Effective from: Jan 1, 2023

2024 Budget (Nov 2023):
├── Announces 2024 tax rates
└── Effective from: Jan 1, 2024
```

### Unique Constraint with Tax Year

```
unique_together = [('tenant', 'tax_year', 'order')]

Ensures:
├── Each tenant can have multiple years
├── Each year can have multiple slabs (order)
├── No duplicate slabs within same tenant/year
└── Prevents data integrity issues

Valid:
✅ Tenant A, 2024, Order 0
✅ Tenant A, 2024, Order 1
✅ Tenant A, 2025, Order 0
✅ Tenant B, 2024, Order 0

Invalid:
❌ Tenant A, 2024, Order 0 (duplicate)
```

### Query Patterns with Tax Year

#### Get Current Year Slabs
```
Query:
PAYETaxSlab.objects.filter(
    tenant=tenant,
    tax_year=2024,
    is_active=True
).order_by('order')

Result: All 2024 slabs for tenant in order
```

#### Get Slabs for Payroll Period
```
Logic:
1. Determine payroll period year
   └── Example: March 2024 → Year 2024

2. Query slabs for that year
   └── tax_year=2024

3. Apply slabs to calculate tax
```

#### Historical Tax Calculation
```
Scenario: Recalculate 2023 payroll

Query:
PAYETaxSlab.objects.filter(
    tenant=tenant,
    tax_year=2023,
    is_active=True
).order_by('order')

Result: Uses 2023 rates (even in 2024)
```

### get_slabs_for_year() Class Method

```
Method Signature:
@classmethod
def get_slabs_for_year(cls, tenant, tax_year):
    """
    Get all active tax slabs for a tenant and year.
    
    Args:
        tenant: Tenant/Client instance
        tax_year (int): Year (e.g., 2024)
        
    Returns:
        QuerySet: Ordered slabs for the year
    """
    return cls.objects.filter(
        tenant=tenant,
        tax_year=tax_year,
        is_active=True
    ).order_by('order')

Example Usage:
slabs = PAYETaxSlab.get_slabs_for_year(tenant, 2024)
for slab in slabs:
    tax = slab.calculate_slab_tax(taxable_income)
```

### Year Validation Logic

```
Validation Rules:
├── tax_year >= 2000 (reasonable lower bound)
├── tax_year <= (current_year + 5)
│   └── Allow future years for planning
│   └── But not too far in future
└── tax_year must be integer

Examples (assuming current year is 2024):
✅ 2020 (Valid - historical)
✅ 2024 (Valid - current)
✅ 2025 (Valid - next year)
✅ 2029 (Valid - 5 years ahead)
❌ 1999 (Invalid - before 2000)
❌ 2030 (Invalid - too far in future)
❌ 2024.5 (Invalid - not integer)
```

### Handling Tax Year Changes

```
Transition Process (Dec 31 → Jan 1):

Before Transition:
├── Current slabs: tax_year=2024, is_active=True
└── Next year slabs: tax_year=2025, is_active=False (pre-configured)

On January 1:
├── Old slabs: tax_year=2024, is_active=False (archived)
└── New slabs: tax_year=2025, is_active=True (activated)

Payroll Calculation:
├── Dec 2024 payroll: Uses 2024 slabs
└── Jan 2025 payroll: Uses 2025 slabs
```

### Tax Slab Change Example

```
Scenario: Tax rates change in 2025

2024 Rates:
├── Slab 1: 1,200,001 - 1,700,000 @ 6%
└── tax_year: 2024

2025 Rates (Hypothetical):
├── Slab 1: 1,200,001 - 1,700,000 @ 8% (increased)
└── tax_year: 2025

Database:
├── Record 1: tenant=A, year=2024, order=1, rate=6.00
└── Record 2: tenant=A, year=2025, order=1, rate=8.00

Both records maintained for historical accuracy
```

### Ordering with Tax Year

```
Meta Ordering: ['tenant', '-tax_year', 'order']

Query Result:
Tenant A:
  ├── 2025 Slabs (newest first)
  │   ├── Order 0
  │   ├── Order 1
  │   └── Order 2
  ├── 2024 Slabs
  │   ├── Order 0
  │   ├── Order 1
  │   └── Order 2
  └── 2023 Slabs (oldest)

Benefit: Latest rates appear first in admin listings
```

### Expected Outcome
- Tax year field added for versioning
- Multi-year tax slab support
- Historical tax rate maintenance
- Future tax rate pre-configuration
- Year-specific queries enabled

### Verification Checklist
- [ ] tax_year field added (IntegerField)
- [ ] Field is required (no blank/null)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Meta ordering includes tax_year
- [ ] unique_together updated with tax_year
- [ ] Index added on (tenant, tax_year, is_active)
- [ ] Year validation in clean() method
- [ ] get_slabs_for_year() class method created
- [ ] __str__ method includes tax_year
- [ ] Model docstring updated

---

## Task 59: Run PAYETaxSlab Migrations

### Overview
Generate and apply Django migrations for the PAYETaxSlab model. This task creates the database schema for storing progressive tax slab data, enabling the system to calculate PAYE income tax according to Sri Lankan tax regulations.

### Dependencies
- Task 56: Create PAYETaxSlab Model
- Task 57: Add Tax Slab Fields
- Task 58: Add Tax Year Field
- Database connection configured
- Previous migrations applied (EPFSettings, ETFSettings)

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/paye_slab.py`
   - Ensure all fields from Tasks 56-58 present
   - Verify imports correct
   - Check model imported in `models/__init__.py`

2. **Check for syntax errors**
   - Run: `python manage.py check payroll`
   - Resolve any errors before proceeding

3. **Generate migration file**
   - Execute: `python manage.py makemigrations payroll`
   - Django detects PAYETaxSlab model
   - Migration file created (likely `0010_paye_slab.py`)

4. **Review generated migration**
   - Open new migration file
   - Verify all fields included
   - Check field types, constraints, defaults
   - Verify ForeignKey to tenant correct

5. **Review migration dependencies**
   - Should depend on 0009_etf_settings
   - Check tenant app dependency if needed

6. **Apply migration to database**
   - Execute: `python manage.py migrate payroll`
   - Django creates paye_taxslab table
   - All constraints and indexes applied

7. **Verify migration success**
   - Check: `python manage.py showmigrations payroll`
   - PAYETaxSlab migration marked with [X]
   - No unapplied migrations remain

8. **Verify database schema**
   - Connect to database
   - Verify table exists: `payroll_payetaxslab`
   - Check all columns present
   - Verify constraints and indexes

9. **Test model in Django shell**
   - Import PAYETaxSlab model
   - Verify model accessible
   - Check queryset operations work

10. **Update documentation**
    - Note migration number
    - Update database schema docs
    - Record any special considerations

### Migration File Structure

```
apps/payroll/migrations/
├── __init__.py
├── 0001_initial.py
├── ...
├── 0008_epf_settings.py
├── 0009_etf_settings.py
└── 0010_paye_slab.py          ← New PAYE migration
```

### Expected Migration Content

```
Migration: 0010_paye_slab.py

Operations:
├── CreateModel: PAYETaxSlab
│   ├── Fields:
│   │   ├── id (AutoField)
│   │   ├── tenant (ForeignKey → Client)
│   │   ├── tax_year (IntegerField)
│   │   ├── order (IntegerField)
│   │   ├── from_amount (DecimalField 12,2)
│   │   ├── to_amount (DecimalField 12,2, nullable)
│   │   ├── rate (DecimalField 5,2)
│   │   ├── effective_from (DateField)
│   │   ├── effective_to (DateField, nullable)
│   │   ├── is_active (BooleanField)
│   │   ├── created_at (DateTimeField)
│   │   └── updated_at (DateTimeField)
│   │
│   ├── Options:
│   │   ├── verbose_name: "PAYE Tax Slab"
│   │   ├── verbose_name_plural: "PAYE Tax Slabs"
│   │   ├── ordering: ['tenant', '-tax_year', 'order']
│   │   └── unique_together: [('tenant', 'tax_year', 'order')]
│   │
│   └── Indexes:
│       ├── (tenant, tax_year, is_active)
│       └── (tenant, order)
│
└── Dependencies:
    └── payroll.0009_etf_settings
```

### Database Table Schema

```
Table: payroll_payetaxslab
┌─────────────────────────────────────────────────┐
│ Column              │ Type                      │
├─────────────────────────────────────────────────┤
│ id                  │ INTEGER PK                │
│ tenant_id           │ INTEGER FK                │
│ tax_year            │ INTEGER                   │
│ order               │ INTEGER                   │
│ from_amount         │ DECIMAL(12,2)             │
│ to_amount           │ DECIMAL(12,2) NULL        │
│ rate                │ DECIMAL(5,2)              │
│ effective_from      │ DATE                      │
│ effective_to        │ DATE NULL                 │
│ is_active           │ BOOLEAN                   │
│ created_at          │ TIMESTAMP                 │
│ updated_at          │ TIMESTAMP                 │
└─────────────────────────────────────────────────┘

Constraints:
├── PRIMARY KEY (id)
├── FOREIGN KEY (tenant_id) REFERENCES tenants(id)
├── UNIQUE (tenant_id, tax_year, order)
└── CHECK (to_amount > from_amount OR to_amount IS NULL)

Indexes:
├── idx_tenant_id (tenant_id)
├── idx_tenant_year_active (tenant_id, tax_year, is_active)
└── idx_tenant_order (tenant_id, order)

Defaults:
└── is_active: TRUE
```

### Pre-Migration Checklist

```
Before running migrations:
├── ✅ All model fields defined
├── ✅ Imports correct
├── ✅ Model registered in __init__.py
├── ✅ No syntax errors
├── ✅ Database connection working
├── ✅ Previous migrations applied
├── ✅ Backup database (if production)
└── ✅ Review migration file
```

### Migration Commands

```bash
# Check for issues
python manage.py check payroll

# Generate migration
python manage.py makemigrations payroll

# View SQL (optional)
python manage.py sqlmigrate payroll 0010

# Apply migration
python manage.py migrate payroll

# Verify
python manage.py showmigrations payroll
```

### Post-Migration Verification

```
Verification Steps:

1. Check migration status
   python manage.py showmigrations payroll
   → Should show [X] 0010_paye_slab

2. Verify table exists
   SELECT * FROM payroll_payetaxslab LIMIT 0;
   → Should return empty result (table exists)

3. Test model in shell
   python manage.py shell
   >>> from apps.payroll.models import PAYETaxSlab
   >>> PAYETaxSlab.objects.count()
   0  # Expected: no records yet

4. Test model creation
   >>> from apps.tenants.models import Client
   >>> from decimal import Decimal
   >>> from datetime import date
   >>> tenant = Client.objects.first()
   >>> slab = PAYETaxSlab.objects.create(
   ...     tenant=tenant,
   ...     tax_year=2024,
   ...     order=0,
   ...     from_amount=Decimal('0'),
   ...     to_amount=Decimal('1200000'),
   ...     rate=Decimal('0.00'),
   ...     effective_from=date(2024, 1, 1),
   ...     is_active=True
   ... )
   >>> slab.id  # Should have an ID
   
5. Verify constraints
   Try creating duplicate:
   >>> PAYETaxSlab.objects.create(...)  # Same tenant, year, order
   IntegrityError: UNIQUE constraint failed
   ✅ Constraint working
```

### All Statutory Models Together

```
After All Migrations (Tasks 49-59):

Payroll Models:
├── EPFSettings (OneToOne per tenant)
│   └── Migration: 0008_epf_settings
├── ETFSettings (OneToOne per tenant)
│   └── Migration: 0009_etf_settings
└── PAYETaxSlab (Multiple per tenant)
    └── Migration: 0010_paye_slab

Complete statutory framework for Sri Lankan payroll:
├── EPF: Employee + Employer contributions
├── ETF: Employer contribution
└── PAYE: Progressive income tax
```

### Sample Data Structure After Migration

```
No data inserted yet (empty tables).
Next step (Task 60) will seed tax slabs.

Expected structure after seeding:
Tenant A:
  ├── EPFSettings: 1 record
  ├── ETFSettings: 1 record
  └── PAYETaxSlab: 7 records (2024 slabs)
      ├── Slab 0: 0-1.2M @ 0%
      ├── Slab 1: 1.2M-1.7M @ 6%
      ├── Slab 2: 1.7M-2.2M @ 12%
      ├── Slab 3: 2.2M-2.7M @ 18%
      ├── Slab 4: 2.7M-3.2M @ 24%
      ├── Slab 5: 3.2M-3.7M @ 30%
      └── Slab 6: 3.7M+ @ 36%
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Model not detected | Not in __init__ | Import in models/__init__.py |
| ForeignKey error | Tenant model issue | Check tenant app |
| Unique constraint | Test data exists | Clear test data |
| Decimal errors | Missing Decimal import | Add import in migration |
| Field missing | Model not saved | Re-save model file |

### Expected Outcome
- PAYETaxSlab migration generated
- Migration applied successfully
- Database table created
- All fields, constraints, indexes present
- Model ready for tax slab data
- Foundation for PAYE calculations

### Verification Checklist
- [ ] Model passes check command
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied without errors
- [ ] Table exists in database
- [ ] All columns present
- [ ] Constraints working (unique_together)
- [ ] Indexes created
- [ ] ForeignKey relationship works
- [ ] Model accessible in Django shell
- [ ] Can create test slab record
- [ ] Documentation updated

---

## Task 60: Create Current Tax Slabs Seed

### Overview
Create a Django management command to seed the PAYETaxSlab model with current Sri Lankan tax rates for 2024. This command populates the database with the official progressive tax brackets, enabling immediate PAYE tax calculation capability without manual data entry.

### Dependencies
- Task 59: Run PAYETaxSlab Migrations
- PAYETaxSlab model fully operational
- Understanding of Sri Lankan 2024 tax rates
- Django management commands framework

### Instructions

1. **Create management commands directory structure**
   - Navigate to `apps/payroll/` directory
   - Create `management/` directory if not exists
   - Create `management/commands/` directory
   - Create `__init__.py` in both directories

2. **Create seed_tax_slabs.py command file**
   - Create file: `apps/payroll/management/commands/seed_tax_slabs.py`
   - This will contain the management command

3. **Import required modules**
   - Import Django BaseCommand
   - Import PAYETaxSlab model
   - Import Client/Tenant model
   - Import Decimal, date
   - Import transaction for atomicity

4. **Define Command class**
   - Inherit from BaseCommand
   - Add help text describing command purpose
   - Document that it seeds 2024 Sri Lankan tax slabs

5. **Add command arguments**
   - Add optional argument: `--tenant-id` (seed for specific tenant)
   - Add optional argument: `--all-tenants` (seed for all)
   - Add optional argument: `--tax-year` (default 2024)
   - Add option: `--clear` (clear existing slabs first)

6. **Define Sri Lankan 2024 tax slabs data**
   - Create list/tuple of dictionaries with slab data
   - 7 slabs total (0-6)
   - Include: order, from_amount, to_amount, rate

7. **Implement handle() method**
   - Parse arguments
   - Get tenant(s) to seed
   - Call seeding function for each tenant
   - Wrap in transaction for atomicity

8. **Implement seed_tenant_slabs() method**
   - Takes tenant and tax_year as parameters
   - Optionally clears existing slabs for that year
   - Creates 7 tax slab records
   - Uses bulk_create for efficiency
   - Returns count of created slabs

9. **Add validation**
   - Check if slabs already exist for tenant/year
   - Warn if overwriting (unless --clear specified)
   - Validate tenant exists
   - Handle errors gracefully

10. **Add output messages**
    - Success message with count
    - Warning messages for existing data
    - Error messages for failures
    - Summary at end

### Management Command Structure

```
apps/payroll/
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── seed_tax_slabs.py       ← New command
```

### Sri Lankan 2024 Tax Slabs Data

```python
TAX_SLABS_2024 = [
    {
        'order': 0,
        'from_amount': Decimal('0.00'),
        'to_amount': Decimal('1200000.00'),
        'rate': Decimal('0.00'),
    },
    {
        'order': 1,
        'from_amount': Decimal('1200001.00'),
        'to_amount': Decimal('1700000.00'),
        'rate': Decimal('6.00'),
    },
    {
        'order': 2,
        'from_amount': Decimal('1700001.00'),
        'to_amount': Decimal('2200000.00'),
        'rate': Decimal('12.00'),
    },
    {
        'order': 3,
        'from_amount': Decimal('2200001.00'),
        'to_amount': Decimal('2700000.00'),
        'rate': Decimal('18.00'),
    },
    {
        'order': 4,
        'from_amount': Decimal('2700001.00'),
        'to_amount': Decimal('3200000.00'),
        'rate': Decimal('24.00'),
    },
    {
        'order': 5,
        'from_amount': Decimal('3200001.00'),
        'to_amount': Decimal('3700000.00'),
        'rate': Decimal('30.00'),
    },
    {
        'order': 6,
        'from_amount': Decimal('3700001.00'),
        'to_amount': None,  # Unlimited top slab
        'rate': Decimal('36.00'),
    },
]
```

### Command Usage Examples

```bash
# Seed for all tenants (2024 slabs)
python manage.py seed_tax_slabs --all-tenants

# Seed for specific tenant
python manage.py seed_tax_slabs --tenant-id=1

# Seed for specific year
python manage.py seed_tax_slabs --all-tenants --tax-year=2025

# Clear existing and reseed
python manage.py seed_tax_slabs --all-tenants --clear

# Get help
python manage.py seed_tax_slabs --help
```

### Command Implementation Flow

```
Command Execution Flow:
┌─────────────────────────────────────────────┐
│ 1. Parse command arguments                 │
│    - tenant_id or all_tenants              │
│    - tax_year (default 2024)               │
│    - clear flag                            │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 2. Get tenant(s) to seed                   │
│    - Single tenant by ID                   │
│    - All active tenants                    │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 3. For each tenant:                        │
│    - Check existing slabs                  │
│    - Clear if --clear flag set             │
│    - Create 7 tax slab records             │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 4. Display results                         │
│    - Success count                         │
│    - Errors (if any)                       │
│    - Summary                               │
└─────────────────────────────────────────────┘
```

### Seeding Logic

```python
def seed_tenant_slabs(self, tenant, tax_year, clear=False):
    """Seed tax slabs for a tenant."""
    
    # Check existing slabs
    existing = PAYETaxSlab.objects.filter(
        tenant=tenant,
        tax_year=tax_year
    ).count()
    
    if existing > 0:
        if clear:
            # Delete existing slabs
            PAYETaxSlab.objects.filter(
                tenant=tenant,
                tax_year=tax_year
            ).delete()
        else:
            # Warn and skip
            self.stdout.write(
                self.style.WARNING(
                    f'Slabs exist for {tenant} ({tax_year}). Use --clear.'
                )
            )
            return 0
    
    # Create slab objects
    slabs = []
    effective_date = date(tax_year, 1, 1)
    
    for slab_data in TAX_SLABS_2024:
        slab = PAYETaxSlab(
            tenant=tenant,
            tax_year=tax_year,
            order=slab_data['order'],
            from_amount=slab_data['from_amount'],
            to_amount=slab_data['to_amount'],
            rate=slab_data['rate'],
            effective_from=effective_date,
            is_active=True
        )
        slabs.append(slab)
    
    # Bulk create for efficiency
    PAYETaxSlab.objects.bulk_create(slabs)
    
    return len(slabs)
```

### Transaction Safety

```python
from django.db import transaction

@transaction.atomic
def handle(self, *args, **options):
    """
    Handle command execution with transaction safety.
    If any error occurs, all changes are rolled back.
    """
    try:
        # Seeding logic here
        pass
    except Exception as e:
        self.stdout.write(
            self.style.ERROR(f'Error: {str(e)}')
        )
        raise  # Rollback transaction
```

### Output Messages

```
Success Output:
──────────────────────────────────────────────
Seeding tax slabs for 2024...
✓ Created 7 slabs for Tenant A
✓ Created 7 slabs for Tenant B
✓ Created 7 slabs for Tenant C
──────────────────────────────────────────────
Summary: 21 tax slabs created successfully
──────────────────────────────────────────────

Warning Output:
──────────────────────────────────────────────
⚠ Slabs already exist for Tenant A (2024)
  Use --clear to overwrite
──────────────────────────────────────────────

Error Output:
──────────────────────────────────────────────
✗ Error seeding Tenant B: Tenant not found
──────────────────────────────────────────────
```

### Verification After Seeding

```python
# Verify in Django shell
from apps.payroll.models import PAYETaxSlab
from apps.tenants.models import Client

tenant = Client.objects.first()

# Check slab count
slab_count = PAYETaxSlab.objects.filter(
    tenant=tenant,
    tax_year=2024
).count()
print(f"Slabs created: {slab_count}")  # Should be 7

# Verify slab data
slabs = PAYETaxSlab.objects.filter(
    tenant=tenant,
    tax_year=2024
).order_by('order')

for slab in slabs:
    print(f"Slab {slab.order}: {slab.from_amount}-{slab.to_amount} @ {slab.rate}%")

# Output:
# Slab 0: 0.00-1200000.00 @ 0.00%
# Slab 1: 1200001.00-1700000.00 @ 6.00%
# Slab 2: 1700001.00-2200000.00 @ 12.00%
# ... (and so on)
```

### Future Tax Years

```
Adding 2025 Slabs (when announced):

1. Update TAX_SLABS_2025 data in command
   └── Or create separate command

2. Run command for 2025:
   python manage.py seed_tax_slabs --all-tenants --tax-year=2025

3. Old 2024 slabs remain in database
   └── For historical calculations

4. Payroll uses year-appropriate slabs
   └── 2024 payroll: 2024 slabs
   └── 2025 payroll: 2025 slabs
```

### Seeding on Tenant Creation

```
Optional: Auto-seed when new tenant created

Signal Handler:
@receiver(post_save, sender=Client)
def create_default_tax_slabs(sender, instance, created, **kwargs):
    """Create default tax slabs for new tenant."""
    if created:
        # Call seeding function
        seed_tenant_slabs(
            tenant=instance,
            tax_year=datetime.now().year,
            clear=False
        )
```

### Testing the Command

```bash
# Test with single tenant
python manage.py seed_tax_slabs --tenant-id=1

# Verify in database
python manage.py shell
>>> from apps.payroll.models import PAYETaxSlab
>>> PAYETaxSlab.objects.filter(tenant_id=1).count()
7  # Success

# Test with all tenants
python manage.py seed_tax_slabs --all-tenants

# Test clear functionality
python manage.py seed_tax_slabs --tenant-id=1 --clear
# Should replace existing slabs

# Test different year
python manage.py seed_tax_slabs --tenant-id=1 --tax-year=2025
```

### Expected Outcome
- Management command created
- Seeds 2024 Sri Lankan tax slabs
- Supports single or all tenants
- Includes clear/overwrite option
- Transaction-safe seeding
- Proper error handling and output

### Verification Checklist
- [ ] management/ directory structure created
- [ ] seed_tax_slabs.py command file created
- [ ] Command inherits from BaseCommand
- [ ] TAX_SLABS_2024 data defined correctly
- [ ] Command arguments added
- [ ] handle() method implemented
- [ ] seed_tenant_slabs() method implemented
- [ ] Transaction decorator used
- [ ] Existing slab check implemented
- [ ] bulk_create used for efficiency
- [ ] Output messages informative
- [ ] Help text added
- [ ] Command tested with sample tenant
- [ ] All 7 slabs created correctly
- [ ] Documentation updated

---

## Task 61: Create TaxExemption Model

### Overview
Create the TaxExemption model to store tax relief and exemption configurations for PAYE calculations. Tax exemptions (also called reliefs) reduce an employee's taxable income before applying progressive tax rates. Common exemptions in Sri Lanka include personal relief, spouse relief, and child relief.

### Dependencies
- Payroll application exists
- Tenant/Client model exists
- Base model mixins available
- Django ORM configured
- Understanding of tax exemptions

### Instructions

1. **Create tax_exemption.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `tax_exemption.py`
   - Will contain the TaxExemption model

2. **Import required modules**
   - Import Django model fields
   - Import Django models base class and validators
   - Import base model mixins
   - Import tenant/client model
   - Import Decimal

3. **Define TaxExemption model class**
   - Create class named TaxExemption
   - Inherit from Django Model
   - Add comprehensive docstring explaining tax exemptions

4. **Add tenant relationship field**
   - ForeignKey to Client/Tenant (multiple exemptions per tenant)
   - Sets on_delete=CASCADE
   - Related_name='tax_exemptions'

5. **Add name field**
   - CharField with max_length=200
   - Required field
   - Human-readable exemption name
   - Example: "Personal Relief", "Child Relief"

6. **Add code field**
   - CharField with max_length=50
   - Required field
   - Unique code for programmatic reference
   - Example: "PERSONAL", "SPOUSE", "CHILD"

7. **Add exemption_type field**
   - CharField with choices
   - Define choices: PERSONAL, SPOUSE, CHILD, DISABLED_CHILD, OTHER
   - Used for categorization and reporting

8. **Add tax_year field**
   - IntegerField for year versioning
   - Required field
   - Allows different relief amounts per year

9. **Add is_active field**
   - BooleanField with default=True
   - Controls availability

10. **Add Meta class**
    - Set verbose_name and verbose_name_plural
    - Add ordering by ['tenant', '-tax_year', 'exemption_type']
    - Add unique_together on (tenant, code, tax_year)

11. **Add __str__ method**
    - Return format: "{name} - {annual_amount} ({tax_year})"

12. **Update models/__init__.py**
    - Import TaxExemption
    - Add to __all__ list

### TaxExemption Model Structure

```
┌─────────────────────────────────────────────────┐
│          TaxExemption Model                     │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • tenant (ForeignKey)                          │
│  • name (CharField)                             │
│  • code (CharField)                             │
│  • exemption_type (CharField with choices)      │
│  • tax_year (IntegerField)                      │
│  • is_active (BooleanField)                     │
│                                                 │
│ Amount Fields (Task 62):                        │
│  • annual_amount (DecimalField)                 │
│  • monthly_amount (DecimalField)                │
│  • max_claims (IntegerField, nullable)          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│  TaxExemption      │
│   (Client)   │                      │  (Multiple types)  │
└──────────────┘                      └────────────────────┘
       │                                       │
       │                                       │
       ├──── PAYETaxSlab (7 slabs)             │
       └──── TaxExemption (4-5 exemptions)     │
                                               │
                                               │ Used for
                                               ▼
                                      ┌────────────────────┐
                                      │ Taxable Income     │
                                      │   Calculation      │
                                      └────────────────────┘
```

### Tax Exemption Concept

#### What are Tax Exemptions?
Tax exemptions (or reliefs) are amounts deducted from gross income to arrive at taxable income. They reduce the tax burden by lowering the base on which tax is calculated.

#### Exemption vs Deduction
```
Tax Exemption/Relief:
├── Reduces taxable income
├── Applied before tax calculation
└── Larger impact on tax (saves based on tax bracket)

Example:
Gross Income: 2,400,000 LKR
Less: Personal Relief: 1,200,000 LKR
──────────────────────────────────
Taxable Income: 1,200,000 LKR
Apply Tax Slabs: (on 1.2M, not 2.4M)
```

### Sri Lankan Tax Exemptions (2024)

```
Standard Exemptions:
┌──────────────────────────────────────────────────┐
│ Exemption Type        │ Annual Amount │ Code    │
├──────────────────────────────────────────────────┤
│ Personal Relief       │ 1,200,000     │ PERSONAL│
│ Spouse Relief         │   500,000     │ SPOUSE  │
│ Child Relief (each)   │   300,000     │ CHILD   │
│ Disabled Child (each) │   500,000     │ DISABLED│
└──────────────────────────────────────────────────┘

Additional Exemptions:
├── EPF Employee Contribution (8% of EPF base)
└── Approved Donations (with limits)
```

### Exemption Types Enumeration

```python
class TaxExemption(models.Model):
    # Exemption type choices
    EXEMPTION_TYPE_PERSONAL = 'PERSONAL'
    EXEMPTION_TYPE_SPOUSE = 'SPOUSE'
    EXEMPTION_TYPE_CHILD = 'CHILD'
    EXEMPTION_TYPE_DISABLED_CHILD = 'DISABLED_CHILD'
    EXEMPTION_TYPE_OTHER = 'OTHER'
    
    EXEMPTION_TYPE_CHOICES = [
        (EXEMPTION_TYPE_PERSONAL, 'Personal Relief'),
        (EXEMPTION_TYPE_SPOUSE, 'Spouse Relief'),
        (EXEMPTION_TYPE_CHILD, 'Child Relief'),
        (EXEMPTION_TYPE_DISABLED_CHILD, 'Disabled Child Relief'),
        (EXEMPTION_TYPE_OTHER, 'Other Exemption'),
    ]
    
    exemption_type = models.CharField(
        max_length=50,
        choices=EXEMPTION_TYPE_CHOICES
    )
```

### Tax Exemption Examples

```
Example 1: Single Employee (No Dependents)
Gross Taxable: 2,400,000 LKR
Exemptions:
  ├── Personal Relief: 1,200,000
  └── EPF Employee (8%): 192,000
      ──────────────────────────
Taxable Income: 1,008,000 LKR

Example 2: Married with 2 Children
Gross Taxable: 3,600,000 LKR
Exemptions:
  ├── Personal Relief: 1,200,000
  ├── Spouse Relief: 500,000
  ├── Child 1: 300,000
  ├── Child 2: 300,000
  └── EPF Employee (8%): 288,000
      ──────────────────────────
Taxable Income: 1,012,000 LKR

Example 3: With Disabled Child
Gross Taxable: 4,000,000 LKR
Exemptions:
  ├── Personal Relief: 1,200,000
  ├── Spouse Relief: 500,000
  ├── Child 1: 300,000
  ├── Disabled Child: 500,000
  └── EPF Employee (8%): 320,000
      ──────────────────────────
Taxable Income: 1,180,000 LKR
```

### Multi-Tenant Exemption Configuration

```
Tenant A (Standard Sri Lankan rates):
├── Personal Relief: 1,200,000
├── Spouse Relief: 500,000
├── Child Relief: 300,000
└── Disabled Child: 500,000

Tenant B (Custom rates - special zone):
├── Personal Relief: 1,500,000 (higher)
├── Spouse Relief: 600,000
├── Child Relief: 350,000
└── Disabled Child: 550,000

Each tenant can have custom exemption amounts
```

### Year Versioning for Exemptions

```
Tax Relief Changes Over Years:

2023 Exemptions:
├── Personal Relief: 1,000,000 (old rate)
└── tax_year: 2023

2024 Exemptions:
├── Personal Relief: 1,200,000 (increased)
└── tax_year: 2024

Database Records:
├── Record 1: tenant=A, code=PERSONAL, year=2023, amount=1,000,000
└── Record 2: tenant=A, code=PERSONAL, year=2024, amount=1,200,000

Historical calculations use year-appropriate amounts
```

### Exemption Code Purpose

```
Unique Code for Programmatic Access:

In Payroll Calculation:
personal_relief = TaxExemption.objects.get(
    tenant=tenant,
    code='PERSONAL',
    tax_year=2024
)

taxable_income -= personal_relief.annual_amount

Benefit: Consistent reference regardless of name changes
```

### Field Details

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| tenant | ForeignKey | Yes | Tenant association |
| name | CharField(200) | Yes | Display name |
| code | CharField(50) | Yes | Unique identifier |
| exemption_type | CharField | Yes | Category |
| tax_year | IntegerField | Yes | Year versioning |
| is_active | BooleanField | Yes | Availability |

### Unique Constraint Importance

```
unique_together = [('tenant', 'code', 'tax_year')]

Ensures:
├── Each tenant can have one PERSONAL relief per year
├── Multiple years supported (different rates)
├── No duplicate codes within same tenant/year
└── Prevents data integrity issues

Valid:
✅ Tenant A, PERSONAL, 2024
✅ Tenant A, PERSONAL, 2025
✅ Tenant B, PERSONAL, 2024

Invalid:
❌ Tenant A, PERSONAL, 2024 (duplicate)
```

### Expected Outcome
- Functional TaxExemption model created
- Support for multiple exemption types
- Year versioning enabled
- Tenant-specific exemption configuration
- Foundation for taxable income reduction

### Verification Checklist
- [ ] tax_exemption.py file created
- [ ] TaxExemption class defined
- [ ] tenant field added (ForeignKey)
- [ ] name field added
- [ ] code field added
- [ ] exemption_type field with choices
- [ ] Exemption type choices defined
- [ ] tax_year field added
- [ ] is_active field added
- [ ] Meta class configured
- [ ] unique_together constraint set
- [ ] __str__ method implemented
- [ ] Model docstring comprehensive
- [ ] Model imported in __init__.py

---

## Task 62: Add Exemption Fields

### Overview
Add the exemption amount fields and claim limits to the TaxExemption model. These fields store the actual relief amounts (annual and monthly) and any restrictions on the number of times the exemption can be claimed (e.g., maximum number of children for child relief).

### Dependencies
- Task 61: Create TaxExemption Model

### Instructions

1. **Open tax_exemption.py model file**
   - Navigate to `apps/payroll/models/tax_exemption.py`
   - Locate TaxExemption model class

2. **Add annual_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Required field
   - Represents annual exemption amount
   - Example: 1,200,000.00 for personal relief

3. **Add field help text for annual_amount**
   - Help text: "Annual exemption amount in LKR"

4. **Add monthly_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Required field
   - Represents monthly exemption amount
   - Typically annual_amount / 12

5. **Add field help text for monthly_amount**
   - Help text: "Monthly exemption amount (usually annual / 12)"

6. **Add max_claims field**
   - IntegerField
   - Optional field (blank=True, null=True)
   - Limits number of times exemption can be claimed
   - Example: Maximum 4 children for child relief

7. **Add field help text for max_claims**
   - Help text: "Maximum number of times this exemption can be claimed (e.g., max children). Leave empty for unlimited."

8. **Add save method override**
   - Override save() method
   - Auto-calculate monthly_amount if not provided
   - Formula: monthly_amount = annual_amount / 12
   - Call parent save method

9. **Add validation in clean method**
   - Override clean() method
   - Validate annual_amount > 0
   - Validate monthly_amount > 0
   - Validate max_claims >= 1 (if provided)
   - Raise ValidationError for invalid values

10. **Add helper method: get_total_annual_exemption**
    - Method signature: get_total_annual_exemption(claim_count=1)
    - Takes claim count as parameter
    - Returns total exemption: annual_amount × claim_count
    - Respects max_claims limit

11. **Update model docstring**
    - Document amount fields
    - Explain monthly calculation
    - Note max_claims usage

### Exemption Amount Fields Structure

```
┌────────────────────────────────────────────────┐
│          Exemption Amount Fields               │
├────────────────────────────────────────────────┤
│ annual_amount                                  │
│  • Type: DecimalField(12, 2)                   │
│  • Required: Yes                               │
│  • Purpose: Annual exemption amount            │
│                                                │
│ monthly_amount                                 │
│  • Type: DecimalField(12, 2)                   │
│  • Required: Yes                               │
│  • Purpose: Monthly amount (annual / 12)       │
│  • Auto-calculated if not provided             │
│                                                │
│ max_claims                                     │
│  • Type: IntegerField                          │
│  • Optional: Yes (nullable)                    │
│  • Purpose: Limit claim count                  │
│  • Example: Max 4 children                     │
└────────────────────────────────────────────────┘
```

### Sri Lankan Tax Exemptions with Amounts

```
┌──────────────────────────────────────────────────────────────┐
│ Type              │ Annual     │ Monthly   │ Max Claims      │
├──────────────────────────────────────────────────────────────┤
│ Personal Relief   │ 1,200,000  │ 100,000   │ 1 (implicit)    │
│ Spouse Relief     │   500,000  │  41,667   │ 1 (implicit)    │
│ Child Relief      │   300,000  │  25,000   │ 4 (typical)     │
│ Disabled Child    │   500,000  │  41,667   │ 2 (typical)     │
└──────────────────────────────────────────────────────────────┘
```

### Monthly Amount Calculation

```
Auto-Calculate Monthly Amount:

def save(self, *args, **kwargs):
    """Override save to auto-calculate monthly amount."""
    if not self.monthly_amount:
        self.monthly_amount = self.annual_amount / Decimal('12')
    super().save(*args, **kwargs)

Example:
annual_amount = 1,200,000
monthly_amount = 1,200,000 / 12 = 100,000.00

Why Monthly?
├── Payroll calculated monthly in Sri Lanka
├── Tax deducted monthly from salary
├── Annual exemptions prorated monthly
└── Simplifies monthly tax calculation
```

### Max Claims Usage

```
Child Relief Example:

Exemption Configuration:
├── name: "Child Relief"
├── code: "CHILD"
├── annual_amount: 300,000
├── max_claims: 4 (maximum 4 children)

Employee has 3 children:
├── Claim count: 3
├── Total exemption: 300,000 × 3 = 900,000
└── Within max_claims limit

Employee has 5 children:
├── Claim count: 5 (exceeds max)
├── Allowed: 4 (capped at max_claims)
└── Total exemption: 300,000 × 4 = 1,200,000

Null max_claims:
└── Unlimited claims (e.g., for personal relief)
```

### get_total_annual_exemption() Method

```python
def get_total_annual_exemption(self, claim_count=1):
    """
    Calculate total annual exemption for given claim count.
    
    Args:
        claim_count (int): Number of times to claim exemption
        
    Returns:
        Decimal: Total exemption amount
    """
    # Validate claim count
    if claim_count < 1:
        return Decimal('0')
    
    # Apply max_claims limit if set
    if self.max_claims is not None:
        claim_count = min(claim_count, self.max_claims)
    
    # Calculate total
    return self.annual_amount * claim_count
```

### Usage Examples

```python
# Example 1: Personal Relief (single claim)
personal = TaxExemption.objects.get(
    code='PERSONAL',
    tax_year=2024
)
exemption = personal.get_total_annual_exemption(1)
# Result: 1,200,000

# Example 2: Child Relief (3 children)
child = TaxExemption.objects.get(
    code='CHILD',
    tax_year=2024
)
exemption = child.get_total_annual_exemption(3)
# Result: 900,000 (300,000 × 3)

# Example 3: Child Relief (6 children, but max 4)
exemption = child.get_total_annual_exemption(6)
# Result: 1,200,000 (300,000 × 4, capped)
```

### Complete Tax Exemption Example

```
Employee Profile:
├── Married
├── 3 children (ages 5, 8, 12)
└── Annual gross taxable: 3,600,000

Exemptions Applied:
┌────────────────────────────────────────────────┐
│ Personal Relief:                               │
│   1 claim × 1,200,000 = 1,200,000              │
├────────────────────────────────────────────────┤
│ Spouse Relief:                                 │
│   1 claim × 500,000 = 500,000                  │
├────────────────────────────────────────────────┤
│ Child Relief:                                  │
│   3 claims × 300,000 = 900,000                 │
├────────────────────────────────────────────────┤
│ EPF Employee (8%):                             │
│   288,000                                      │
└────────────────────────────────────────────────┘
Total Exemptions: 2,888,000

Taxable Income Calculation:
Gross Taxable: 3,600,000
Less Exemptions: 2,888,000
──────────────────────────
Taxable Income: 712,000

Tax on 712,000 (using slabs):
└── Most income in tax-free slab
└── Very low tax liability
```

### Field Precision

```
DecimalField(12, 2) for Amounts:

Range: 000,000,000.00 to 999,999,999.99

Examples:
✅ 1,200,000.00 (Personal relief)
✅ 300,000.00 (Child relief)
✅ 500,000.00 (Spouse relief)
✅ 100,000,000.00 (Hypothetical large relief)
```

### Validation Rules

```
Field Validation:
├── annual_amount > 0 (must be positive)
├── monthly_amount > 0 (must be positive)
├── max_claims >= 1 (if provided, at least 1)
└── monthly_amount ≈ annual_amount / 12 (reasonable)

Valid Examples:
✅ annual=1200000, monthly=100000, max_claims=1
✅ annual=300000, monthly=25000, max_claims=4
✅ annual=500000, monthly=41667, max_claims=null

Invalid Examples:
❌ annual=0 (zero not allowed)
❌ annual=-100000 (negative)
❌ max_claims=0 (zero claims illogical)
❌ max_claims=-1 (negative)
```

### Monthly Tax Calculation Impact

```
Monthly Payroll Tax Calculation:

Step 1: Calculate annual taxable
├── Multiply monthly amounts by 12

Step 2: Apply annual exemptions
├── Personal: 1,200,000
├── Spouse: 500,000
├── Children: 900,000 (3 × 300,000)
└── EPF: Calculated from salary

Step 3: Calculate annual tax
└── Use progressive slabs

Step 4: Monthly tax deduction
└── Annual tax / 12

Monthly amounts in exemption model:
└── Used for quick monthly reference
└── But calculation always annualized first
```

### Database Records After Seeding

```
After Task 64 (seed exemptions):

Tenant A - 2024 Exemptions:
┌──────────────────────────────────────────────────────────┐
│ Code     │ Name            │ Annual    │ Monthly │ Max   │
├──────────────────────────────────────────────────────────┤
│ PERSONAL │ Personal Relief │ 1,200,000 │ 100,000 │ 1     │
│ SPOUSE   │ Spouse Relief   │   500,000 │  41,667 │ 1     │
│ CHILD    │ Child Relief    │   300,000 │  25,000 │ 4     │
│ DISABLED │ Disabled Child  │   500,000 │  41,667 │ 2     │
└──────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Exemption amount fields configured
- Annual and monthly amounts stored
- Max claims limit support
- Auto-calculation of monthly amount
- Helper method for total exemption
- Validation for positive amounts

### Verification Checklist
- [ ] annual_amount field added
- [ ] monthly_amount field added
- [ ] max_claims field added (nullable)
- [ ] All fields have correct precision
- [ ] Help text added for all fields
- [ ] save() method overridden
- [ ] Monthly amount auto-calculated
- [ ] clean() method with validation
- [ ] Amount validation (positive)
- [ ] max_claims validation (>= 1)
- [ ] get_total_annual_exemption() method created
- [ ] Method respects max_claims
- [ ] Model docstring updated

---

## Task 63: Run TaxExemption Migrations

### Overview
Generate and apply Django migrations for the TaxExemption model. This creates the database schema for storing tax relief and exemption data, completing the foundation for accurate taxable income calculation in the payroll system.

### Dependencies
- Task 61: Create TaxExemption Model
- Task 62: Add Exemption Fields
- Database connection configured
- Previous migrations applied (PAYETaxSlab)

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/tax_exemption.py`
   - Ensure all fields from Tasks 61-62 present
   - Verify imports correct
   - Check model imported in `models/__init__.py`

2. **Check for syntax errors**
   - Run: `python manage.py check payroll`
   - Resolve any errors before proceeding

3. **Generate migration file**
   - Execute: `python manage.py makemigrations payroll`
   - Django detects TaxExemption model
   - Migration file created (likely `0011_tax_exemption.py`)

4. **Review generated migration**
   - Open new migration file
   - Verify all fields included
   - Check field types, constraints
   - Verify ForeignKey to tenant

5. **Review migration dependencies**
   - Should depend on 0010_paye_slab
   - Check tenant app dependency

6. **Apply migration to database**
   - Execute: `python manage.py migrate payroll`
   - Django creates tax_exemption table
   - All constraints and indexes applied

7. **Verify migration success**
   - Check: `python manage.py showmigrations payroll`
   - TaxExemption migration marked with [X]

8. **Verify database schema**
   - Connect to database
   - Verify table: `payroll_taxexemption`
   - Check all columns present
   - Verify constraints

9. **Test model in Django shell**
   - Import TaxExemption
   - Verify model accessible
   - Test basic operations

10. **Update documentation**
    - Note migration number
    - Update schema documentation

### Migration File Structure

```
apps/payroll/migrations/
├── __init__.py
├── 0001_initial.py
├── ...
├── 0008_epf_settings.py
├── 0009_etf_settings.py
├── 0010_paye_slab.py
└── 0011_tax_exemption.py       ← New exemption migration
```

### Expected Migration Content

```
Migration: 0011_tax_exemption.py

Operations:
├── CreateModel: TaxExemption
│   ├── Fields:
│   │   ├── id (AutoField)
│   │   ├── tenant (ForeignKey → Client)
│   │   ├── name (CharField 200)
│   │   ├── code (CharField 50)
│   │   ├── exemption_type (CharField with choices)
│   │   ├── tax_year (IntegerField)
│   │   ├── annual_amount (DecimalField 12,2)
│   │   ├── monthly_amount (DecimalField 12,2)
│   │   ├── max_claims (IntegerField, nullable)
│   │   ├── is_active (BooleanField)
│   │   ├── created_at (DateTimeField)
│   │   └── updated_at (DateTimeField)
│   │
│   ├── Options:
│   │   ├── verbose_name: "Tax Exemption"
│   │   ├── verbose_name_plural: "Tax Exemptions"
│   │   ├── ordering: ['tenant', '-tax_year', 'exemption_type']
│   │   └── unique_together: [('tenant', 'code', 'tax_year')]
│   │
│   └── Indexes:
│       ├── (tenant, tax_year, is_active)
│       └── (tenant, code)
│
└── Dependencies:
    └── payroll.0010_paye_slab
```

### Database Table Schema

```
Table: payroll_taxexemption
┌─────────────────────────────────────────────────┐
│ Column              │ Type                      │
├─────────────────────────────────────────────────┤
│ id                  │ INTEGER PK                │
│ tenant_id           │ INTEGER FK                │
│ name                │ VARCHAR(200)              │
│ code                │ VARCHAR(50)               │
│ exemption_type      │ VARCHAR(50)               │
│ tax_year            │ INTEGER                   │
│ annual_amount       │ DECIMAL(12,2)             │
│ monthly_amount      │ DECIMAL(12,2)             │
│ max_claims          │ INTEGER NULL              │
│ is_active           │ BOOLEAN                   │
│ created_at          │ TIMESTAMP                 │
│ updated_at          │ TIMESTAMP                 │
└─────────────────────────────────────────────────┘

Constraints:
├── PRIMARY KEY (id)
├── FOREIGN KEY (tenant_id) REFERENCES tenants(id)
├── UNIQUE (tenant_id, code, tax_year)
└── CHECK (annual_amount > 0)
└── CHECK (monthly_amount > 0)
└── CHECK (max_claims >= 1 OR max_claims IS NULL)

Indexes:
├── idx_tenant_id (tenant_id)
├── idx_tenant_year_active (tenant_id, tax_year, is_active)
└── idx_tenant_code (tenant_id, code)

Defaults:
└── is_active: TRUE
```

### Pre-Migration Checklist

```
Before running migrations:
├── ✅ All model fields defined
├── ✅ Imports correct
├── ✅ Model in __init__.py
├── ✅ No syntax errors
├── ✅ Database connection working
├── ✅ Previous migrations applied
├── ✅ Backup database
└── ✅ Review migration file
```

### Migration Commands

```bash
# Check for issues
python manage.py check payroll

# Generate migration
python manage.py makemigrations payroll

# View SQL (optional)
python manage.py sqlmigrate payroll 0011

# Apply migration
python manage.py migrate payroll

# Verify
python manage.py showmigrations payroll
```

### Post-Migration Verification

```
Verification Steps:

1. Check migration status
   python manage.py showmigrations payroll
   → [X] 0011_tax_exemption

2. Verify table exists
   SELECT * FROM payroll_taxexemption LIMIT 0;

3. Test model in shell
   python manage.py shell
   >>> from apps.payroll.models import TaxExemption
   >>> TaxExemption.objects.count()
   0  # Expected

4. Test model creation
   >>> from apps.tenants.models import Client
   >>> from decimal import Decimal
   >>> tenant = Client.objects.first()
   >>> exemption = TaxExemption.objects.create(
   ...     tenant=tenant,
   ...     name="Personal Relief",
   ...     code="PERSONAL",
   ...     exemption_type="PERSONAL",
   ...     tax_year=2024,
   ...     annual_amount=Decimal('1200000'),
   ...     monthly_amount=Decimal('100000'),
   ...     max_claims=1,
   ...     is_active=True
   ... )
   >>> exemption.id  # Has ID
   
5. Verify auto-calculation
   >>> exemption2 = TaxExemption.objects.create(
   ...     tenant=tenant,
   ...     name="Spouse Relief",
   ...     code="SPOUSE",
   ...     exemption_type="SPOUSE",
   ...     tax_year=2024,
   ...     annual_amount=Decimal('500000'),
   ...     is_active=True
   ... )
   >>> exemption2.monthly_amount
   Decimal('41666.67')  # Auto-calculated
```

### Complete Statutory Framework

```
After All Migrations (Tasks 49-63):

Payroll Models Complete:
┌────────────────────────────────────────────────┐
│ EPFSettings (0008_epf_settings)                │
│   ├── Employee rate: 8%                        │
│   ├── Employer rate: 12%                       │
│   └── Optional ceiling                         │
├────────────────────────────────────────────────┤
│ ETFSettings (0009_etf_settings)                │
│   └── Employer rate: 3%                        │
├────────────────────────────────────────────────┤
│ PAYETaxSlab (0010_paye_slab)                   │
│   ├── 7 progressive slabs                      │
│   └── Multi-year support                       │
├────────────────────────────────────────────────┤
│ TaxExemption (0011_tax_exemption)              │
│   ├── Personal Relief: 1.2M                    │
│   ├── Spouse Relief: 500K                      │
│   ├── Child Relief: 300K                       │
│   └── Disabled Child: 500K                     │
└────────────────────────────────────────────────┘

Complete Sri Lankan payroll compliance ready!
```

### Expected Data Structure

```
After seeding (Task 64):

Each Tenant will have:
├── EPFSettings: 1 record
├── ETFSettings: 1 record
├── PAYETaxSlab: 7 records (one per bracket)
└── TaxExemption: 4 records (personal, spouse, child, disabled)

Example for Tenant A:
payroll_epfsettings:       1 row
payroll_etfsettings:       1 row
payroll_payetaxslab:       7 rows
payroll_taxexemption:      4 rows
──────────────────────────────────
Total statutory records:   13 rows
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Model not detected | Not in __init__ | Import in __init__.py |
| ForeignKey error | Tenant issue | Check tenant app |
| Unique constraint | Test data exists | Clear data |
| Decimal errors | Import missing | Add Decimal import |
| Choice field error | Choices not defined | Define choices tuple |

### Expected Outcome
- TaxExemption migration generated
- Migration applied successfully
- Database table created
- All fields, constraints, indexes present
- Model ready for exemption data
- Complete statutory framework ready

### Verification Checklist
- [ ] Model passes check command
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied without errors
- [ ] Table exists in database
- [ ] All columns present
- [ ] Constraints working
- [ ] Indexes created
- [ ] ForeignKey works
- [ ] unique_together enforced
- [ ] Model accessible in shell
- [ ] Can create exemption record
- [ ] Auto-calculation works (monthly_amount)
- [ ] Documentation updated

---

## Task 64: Create Default Exemptions Seed

### Overview
Create a Django management command to seed the TaxExemption model with default Sri Lankan tax relief amounts for 2024. This command populates standard exemptions (personal, spouse, child, disabled child) for all tenants, enabling immediate tax calculation capability.

### Dependencies
- Task 63: Run TaxExemption Migrations
- TaxExemption model operational
- Understanding of Sri Lankan 2024 relief amounts
- Management command from Task 60 as reference

### Instructions

1. **Create seed_tax_exemptions.py command file**
   - In `apps/payroll/management/commands/`
   - Create file: `seed_tax_exemptions.py`
   - Similar structure to seed_tax_slabs.py

2. **Import required modules**
   - Import BaseCommand
   - Import TaxExemption model
   - Import Client/Tenant model
   - Import Decimal, transaction

3. **Define Command class**
   - Inherit from BaseCommand
   - Add help text
   - Document Sri Lankan 2024 exemptions

4. **Add command arguments**
   - `--tenant-id` (specific tenant)
   - `--all-tenants` (all tenants)
   - `--tax-year` (default 2024)
   - `--clear` (clear existing)

5. **Define Sri Lankan 2024 exemption data**
   - Create list of dictionaries
   - 4 standard exemptions
   - Include all required fields

6. **Implement handle() method**
   - Parse arguments
   - Get tenant(s)
   - Call seeding function
   - Transaction safety

7. **Implement seed_tenant_exemptions() method**
   - Takes tenant and tax_year
   - Optionally clears existing
   - Creates 4 exemption records
   - Uses bulk_create

8. **Add validation**
   - Check existing exemptions
   - Warn if overwriting
   - Handle errors

9. **Add output messages**
   - Success count
   - Warnings
   - Errors
   - Summary

10. **Test command**
    - Test with sample tenant
    - Verify all 4 exemptions created
    - Check amounts correct

### Management Command Structure

```
apps/payroll/management/commands/
├── __init__.py
├── seed_tax_slabs.py          ← Task 60
└── seed_tax_exemptions.py     ← New command (Task 64)
```

### Sri Lankan 2024 Tax Exemptions Data

```python
TAX_EXEMPTIONS_2024 = [
    {
        'name': 'Personal Relief',
        'code': 'PERSONAL',
        'exemption_type': TaxExemption.EXEMPTION_TYPE_PERSONAL,
        'annual_amount': Decimal('1200000.00'),
        'monthly_amount': Decimal('100000.00'),
        'max_claims': 1,
    },
    {
        'name': 'Spouse Relief',
        'code': 'SPOUSE',
        'exemption_type': TaxExemption.EXEMPTION_TYPE_SPOUSE,
        'annual_amount': Decimal('500000.00'),
        'monthly_amount': Decimal('41666.67'),
        'max_claims': 1,
    },
    {
        'name': 'Child Relief',
        'code': 'CHILD',
        'exemption_type': TaxExemption.EXEMPTION_TYPE_CHILD,
        'annual_amount': Decimal('300000.00'),
        'monthly_amount': Decimal('25000.00'),
        'max_claims': 4,  # Max 4 children
    },
    {
        'name': 'Disabled Child Relief',
        'code': 'DISABLED_CHILD',
        'exemption_type': TaxExemption.EXEMPTION_TYPE_DISABLED_CHILD,
        'annual_amount': Decimal('500000.00'),
        'monthly_amount': Decimal('41666.67'),
        'max_claims': 2,  # Max 2 disabled children
    },
]
```

### Command Usage Examples

```bash
# Seed for all tenants
python manage.py seed_tax_exemptions --all-tenants

# Seed for specific tenant
python manage.py seed_tax_exemptions --tenant-id=1

# Seed for specific year
python manage.py seed_tax_exemptions --all-tenants --tax-year=2025

# Clear existing and reseed
python manage.py seed_tax_exemptions --all-tenants --clear

# Get help
python manage.py seed_tax_exemptions --help
```

### Command Implementation Flow

```
Command Flow:
┌─────────────────────────────────────────────┐
│ 1. Parse arguments                         │
│    - tenant_id or all_tenants              │
│    - tax_year (default 2024)               │
│    - clear flag                            │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 2. Get tenant(s) to seed                   │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 3. For each tenant:                        │
│    - Check existing exemptions             │
│    - Clear if --clear flag                 │
│    - Create 4 exemption records            │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 4. Display results                         │
└─────────────────────────────────────────────┘
```

### Seeding Logic

```python
def seed_tenant_exemptions(self, tenant, tax_year, clear=False):
    """Seed tax exemptions for a tenant."""
    
    # Check existing
    existing = TaxExemption.objects.filter(
        tenant=tenant,
        tax_year=tax_year
    ).count()
    
    if existing > 0:
        if clear:
            TaxExemption.objects.filter(
                tenant=tenant,
                tax_year=tax_year
            ).delete()
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'Exemptions exist for {tenant} ({tax_year})'
                )
            )
            return 0
    
    # Create exemptions
    exemptions = []
    for exemption_data in TAX_EXEMPTIONS_2024:
        exemption = TaxExemption(
            tenant=tenant,
            tax_year=tax_year,
            name=exemption_data['name'],
            code=exemption_data['code'],
            exemption_type=exemption_data['exemption_type'],
            annual_amount=exemption_data['annual_amount'],
            monthly_amount=exemption_data['monthly_amount'],
            max_claims=exemption_data['max_claims'],
            is_active=True
        )
        exemptions.append(exemption)
    
    # Bulk create
    TaxExemption.objects.bulk_create(exemptions)
    
    return len(exemptions)
```

### Complete Seeding Commands

```bash
# Seed both tax slabs and exemptions
python manage.py seed_tax_slabs --all-tenants
python manage.py seed_tax_exemptions --all-tenants

# Or create combined command (optional)
python manage.py seed_statutory_data --all-tenants
# (This would call both seeding functions)
```

### Verification After Seeding

```python
# Verify in Django shell
from apps.payroll.models import TaxExemption
from apps.tenants.models import Client

tenant = Client.objects.first()

# Check exemption count
count = TaxExemption.objects.filter(
    tenant=tenant,
    tax_year=2024
).count()
print(f"Exemptions: {count}")  # Should be 4

# Display exemptions
exemptions = TaxExemption.objects.filter(
    tenant=tenant,
    tax_year=2024
).order_by('exemption_type')

for ex in exemptions:
    print(f"{ex.name}: {ex.annual_amount} (Max claims: {ex.max_claims})")

# Output:
# Personal Relief: 1200000.00 (Max claims: 1)
# Spouse Relief: 500000.00 (Max claims: 1)
# Child Relief: 300000.00 (Max claims: 4)
# Disabled Child Relief: 500000.00 (Max claims: 2)
```

### Complete Statutory Data Setup

```
After Running Both Seed Commands:

For Each Tenant:
┌────────────────────────────────────────────────┐
│ EPFSettings (manually created or via signal)   │
│   - Employee: 8%, Employer: 12%                │
├────────────────────────────────────────────────┤
│ ETFSettings (manually created or via signal)   │
│   - Employer: 3%                               │
├────────────────────────────────────────────────┤
│ PAYETaxSlab (7 records - Task 60)              │
│   - Progressive tax brackets                   │
├────────────────────────────────────────────────┤
│ TaxExemption (4 records - Task 64)             │
│   - Personal, Spouse, Child, Disabled          │
└────────────────────────────────────────────────┘

Total: 13-14 statutory records per tenant
```

### Output Messages

```
Success:
──────────────────────────────────────────────
Seeding tax exemptions for 2024...
✓ Created 4 exemptions for Tenant A
✓ Created 4 exemptions for Tenant B
──────────────────────────────────────────────
Summary: 8 tax exemptions created
──────────────────────────────────────────────

With Existing Data:
──────────────────────────────────────────────
⚠ Exemptions exist for Tenant A (2024)
  Use --clear to overwrite
──────────────────────────────────────────────
```

### Integration with Payroll

```
Payroll Tax Calculation Uses Exemptions:

def calculate_employee_tax(employee, payroll_period):
    # 1. Calculate gross taxable earnings
    gross_taxable = calculate_gross_taxable(employee)
    
    # 2. Get applicable exemptions
    personal = TaxExemption.objects.get(
        tenant=employee.tenant,
        code='PERSONAL',
        tax_year=payroll_period.year
    )
    
    # 3. Calculate exemptions (simplified)
    total_exemptions = personal.annual_amount
    
    # Add spouse if applicable
    if employee.has_spouse:
        spouse = TaxExemption.objects.get(
            tenant=employee.tenant,
            code='SPOUSE',
            tax_year=payroll_period.year
        )
        total_exemptions += spouse.annual_amount
    
    # Add children
    if employee.num_children > 0:
        child = TaxExemption.objects.get(
            tenant=employee.tenant,
            code='CHILD',
            tax_year=payroll_period.year
        )
        total_exemptions += child.get_total_annual_exemption(
            employee.num_children
        )
    
    # 4. Calculate taxable income
    taxable_income = gross_taxable - total_exemptions
    
    # 5. Apply tax slabs
    # ... (use PAYETaxSlab)
```

### Expected Outcome
- Management command created
- Seeds 4 standard exemptions
- Supports all tenants
- Year versioning
- Transaction safe
- Proper validation

### Verification Checklist
- [ ] seed_tax_exemptions.py created
- [ ] Command inherits BaseCommand
- [ ] TAX_EXEMPTIONS_2024 data defined
- [ ] All 4 exemptions included
- [ ] Amounts correct (Personal: 1.2M, etc.)
- [ ] Command arguments added
- [ ] handle() method implemented
- [ ] seed_tenant_exemptions() method created
- [ ] Existing data check
- [ ] bulk_create used
- [ ] Transaction decorator
- [ ] Output messages
- [ ] Help text
- [ ] Command tested
- [ ] All 4 exemptions created
- [ ] Amounts verified
- [ ] Documentation updated

---

## Summary

This document implemented PAYE (Pay As You Earn) tax infrastructure for Sri Lankan income tax compliance:

### Completed Components

#### PAYETaxSlab Model
- ✅ Progressive tax bracket model
- ✅ 7 tax slabs for 2024 rates
- ✅ Multi-year version support
- ✅ from_amount, to_amount, rate fields
- ✅ Unlimited top slab (null to_amount)
- ✅ Management command for seeding
- ✅ Database migrations applied

#### TaxExemption Model
- ✅ Tax relief/exemption model
- ✅ 4 standard exemptions (personal, spouse, child, disabled)
- ✅ Annual and monthly amounts
- ✅ Max claims support
- ✅ Auto-calculation of monthly amounts
- ✅ Management command for seeding
- ✅ Database migrations applied

### Key Achievements

1. **Progressive Taxation** - Full support for bracketed tax rates
2. **Tax Exemptions** - Personal reliefs reduce taxable income
3. **Year Versioning** - Historical and future tax rates
4. **Sri Lankan Compliance** - 2024 rates and reliefs accurate
5. **Seeding Commands** - Easy setup for new tenants

### Sri Lankan 2024 Tax Summary

```
EPF/ETF (From Document 01):
├── EPF Employee: 8%
├── EPF Employer: 12%
└── ETF Employer: 3%

PAYE Tax Slabs:
├── 0 - 1,200,000: 0%
├── 1,200,001 - 1,700,000: 6%
├── 1,700,001 - 2,200,000: 12%
├── 2,200,001 - 2,700,000: 18%
├── 2,700,001 - 3,200,000: 24%
├── 3,200,001 - 3,700,000: 30%
└── 3,700,001+: 36%

Tax Exemptions:
├── Personal Relief: 1,200,000
├── Spouse Relief: 500,000
├── Child Relief: 300,000 (max 4)
└── Disabled Child: 500,000 (max 2)
```

### Complete Example Calculation

```
Employee Details:
├── Annual Gross Taxable: 3,600,000
├── Married with 2 children
└── EPF-applicable base: 3,600,000

EPF/ETF Contributions:
├── EPF Employee (8%): 288,000 (deducted)
├── EPF Employer (12%): 432,000 (company cost)
└── ETF Employer (3%): 108,000 (company cost)

Taxable Income:
Gross: 3,600,000
Exemptions:
  ├── Personal: 1,200,000
  ├── Spouse: 500,000
  ├── Children (2): 600,000
  └── EPF: 288,000
  ────────────────────
Total: 2,588,000
────────────────────────────
Taxable: 1,012,000

PAYE Tax:
├── 0-1,200,000 @ 0%: 0
└── 1,200,001-1,012,000: Not reached
────────────────────────────
Annual Tax: Minimal (only ~7.2K)
Monthly Tax: ~600
```

### Next Steps
- **Group E:** Implement payroll calculation services
- **Use Models:** Calculate EPF, ETF, PAYE in payroll
- **Employee Assignment:** Link employees to salary structures
- **Payslip Generation:** Create payslips with all deductions

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9 (Tasks 56-64)  
**Models Created:** PAYETaxSlab, TaxExemption  
**Migrations:** 0010_paye_slab, 0011_tax_exemption  
**Seed Commands:** seed_tax_slabs, seed_tax_exemptions
