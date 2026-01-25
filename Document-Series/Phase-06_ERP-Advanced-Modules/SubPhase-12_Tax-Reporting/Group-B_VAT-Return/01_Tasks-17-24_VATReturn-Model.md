# Tasks 17-24: VATReturn Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** B - VAT Return  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-34_VATReturn-Generator.md](02_Tasks-25-34_VATReturn-Generator.md)

---

## Document Overview

This document covers the creation of the VATReturn model, which stores VAT return data for Sri Lanka's 8% VAT system. The model tracks output VAT (from sales), input VAT (from purchases), net VAT payable or refundable, and detailed line items for audit purposes. This model integrates with the TaxPeriod system and supports IRD-compliant reporting requirements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create VATReturn model | Medium | 30 min |
| 18 | Add return period FK | Low | 10 min |
| 19 | Add output VAT field | Low | 10 min |
| 20 | Add input VAT field | Low | 10 min |
| 21 | Add net VAT payable | Low | 10 min |
| 22 | Add return line items | Medium | 25 min |
| 23 | Add filed date | Low | 10 min |
| 24 | Run VATReturn migrations | Low | 15 min |

---

## Task 17: Create VATReturn Model

### Overview
Create the core VATReturn model in the accounting app's tax module. This model represents a single VAT return submission for a specific tax period, storing all VAT calculations and submission details required by Sri Lanka's Inland Revenue Department (IRD).

### Dependencies
- Accounting application exists
- Tax module structure established (from Task 16)
- Django ORM configured
- Base model mixins available (TenantAwareMixin, TimestampMixin)

### Instructions

1. **Create vat_return.py model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `vat_return.py`
   - This will contain the VATReturn model

2. **Import required Django components**
   - Import Django model base classes
   - Import model field types (CharField, DecimalField, JSONField, etc.)
   - Import Q for query conditions
   - Import timezone utilities

3. **Import project-specific dependencies**
   - Import TenantAwareMixin from base models
   - Import TimestampMixin from base models
   - Import Tenant model
   - Import User model (for filed_by field)
   - Prepare for TaxPeriod import (next task)

4. **Define VATReturn model class**
   - Create class inheriting from TenantAwareMixin, TimestampMixin, and models.Model
   - Add comprehensive model docstring
   - Explain model purpose: stores VAT return data for a specific period

5. **Add status field**
   - CharField with choices
   - Values: 'draft', 'filed', 'amended', 'cancelled'
   - Default to 'draft'
   - Required field (no blank/null)
   - Tracks return lifecycle state

6. **Add reference_number field**
   - CharField with max_length=50
   - Unique identifier for filed returns
   - Optional initially (blank=True, null=True)
   - Generated when filed
   - Format: VAT-YYYYMM-XXXXX (e.g., VAT-202601-00123)

7. **Add notes field**
   - TextField, optional (blank=True, null=True)
   - Internal notes about this return
   - Adjustments, special circumstances
   - Audit trail information

8. **Add filed_by field**
   - ForeignKey to User model
   - on_delete=models.SET_NULL
   - Optional (blank=True, null=True)
   - Tracks who submitted the return
   - Related_name: 'vat_returns_filed'

9. **Add Meta class**
   - Set verbose_name: "VAT Return"
   - Set verbose_name_plural: "VAT Returns"
   - Set ordering: ['-created_at'] (newest first)
   - Add unique_together constraint for (tenant, period)
   - Add indexes: (tenant, status), (tenant, period)

10. **Add __str__ method**
    - Return format: "VAT Return - [Period] ([Status])"
    - Example: "VAT Return - January 2026 (Filed)"
    - Include reference number if filed

11. **Update models/__init__.py**
    - Import VATReturn model
    - Add to __all__ list for easy imports

### VATReturn Model Structure

```
┌─────────────────────────────────────────────────┐
│              VATReturn Model                    │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • status (CharField with choices)              │
│  • reference_number (CharField, optional)       │
│  • notes (TextField, optional)                  │
│  • filed_by (FK to User, optional)              │
│                                                 │
│ VAT Fields (Added in subsequent tasks):         │
│  • period (FK to TaxPeriod) - Task 18          │
│  • output_vat (DecimalField) - Task 19          │
│  • input_vat (DecimalField) - Task 20           │
│  • net_vat_payable (DecimalField) - Task 21     │
│  • line_items (JSONField) - Task 22             │
│  • filed_date (DateTimeField) - Task 23         │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Status Workflow

```
VAT Return Status Lifecycle
════════════════════════════

┌─────────┐     File Return     ┌────────┐
│  DRAFT  │────────────────────▶│ FILED  │
└─────────┘                     └────────┘
     │                               │
     │ Cancel                        │ Amend
     ▼                               ▼
┌───────────┐                  ┌──────────┐
│ CANCELLED │                  │ AMENDED  │
└───────────┘                  └──────────┘
```

### Status Definitions

| Status | Description | Editable | Reference# | Use Case |
|--------|-------------|----------|------------|----------|
| draft | Initial creation, calculations in progress | Yes | No | Preparing return before submission |
| filed | Submitted to IRD | No | Yes | Official return filed with IRD |
| amended | Corrections submitted after filing | No | Yes | Error corrections, IRD amendments |
| cancelled | Return voided before filing | No | No | Mistake in period or calculation |

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────┐
│    Tenant    │◄─────────────────────│   VATReturn    │
└──────────────┘                      └────────────────┘
                                             │
                                             │ N:1
                                             ▼
                                      ┌──────────────┐
                                      │  TaxPeriod   │
                                      │ (Task 18)    │
                                      └──────────────┘
                                             │
                                             │ N:1
                                             ▼
                                      ┌──────────────┐
                                      │     User     │
                                      │  (filed_by)  │
                                      └──────────────┘
```

### Reference Number Format

```
VAT-YYYYMM-XXXXX

Components:
  VAT      : Prefix indicating VAT return
  YYYY     : Year (4 digits)
  MM       : Month (2 digits)
  XXXXX    : Sequence number (5 digits, zero-padded)

Examples:
  VAT-202601-00001  : First VAT return for January 2026
  VAT-202601-00002  : Second VAT return for January 2026 (amended)
  VAT-202602-00001  : First VAT return for February 2026
```

### Sri Lanka IRD Context

#### VAT Registration Requirements
- Businesses with turnover > LKR 12M per quarter
- Voluntary registration available
- Registered traders receive VAT TIN (Tax Identification Number)

#### Filing Frequency
- Monthly: Large taxpayers (turnover > LKR 300M annually)
- Quarterly: Medium taxpayers (turnover LKR 12M-300M)
- Due date: 20th of the month following period end

#### Return Components Required by IRD
- Output VAT (VAT charged on sales)
- Input VAT (VAT paid on purchases)
- Net VAT payable or refundable
- Supporting schedules with transaction details
- Declaration and signature

### Expected Outcome
- VATReturn model created with core fields
- Status workflow foundation established
- Reference number structure defined
- Ready for VAT calculation fields
- Prepared for tenant and user relationships

### Verification Checklist
- [ ] vat_return.py file created in apps/accounting/models/
- [ ] VATReturn class defined
- [ ] Inherits from TenantAwareMixin and TimestampMixin
- [ ] status field with choices (draft, filed, amended, cancelled)
- [ ] reference_number field added (CharField, optional)
- [ ] notes field added (TextField, optional)
- [ ] filed_by field added (FK to User, optional)
- [ ] Meta class configured (verbose names, ordering, constraints)
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 18: Add Return Period FK

### Overview
Add the period foreign key field to link each VATReturn to a specific TaxPeriod. This establishes the relationship between VAT returns and their corresponding tax periods, ensuring each return is associated with exactly one monthly or quarterly period.

### Dependencies
- Task 17: Create VATReturn model
- Task 16: TaxPeriod model exists (from Group A)

### Instructions

1. **Open vat_return.py model file**
   - Navigate to `apps/accounting/models/vat_return.py`
   - Locate VATReturn model class

2. **Import TaxPeriod model**
   - Add import statement for TaxPeriod
   - Import from accounting.models

3. **Add period field**
   - ForeignKey to TaxPeriod model
   - on_delete=models.PROTECT (cannot delete period with returns)
   - Required field (no blank/null)
   - Related_name: 'vat_returns'
   - Add help_text: "Tax period for this VAT return"

4. **Update unique_together constraint**
   - In Meta class, ensure unique_together includes (tenant, period)
   - Prevents duplicate VAT returns for same period
   - Amended returns reuse same period with different status

5. **Update __str__ method**
   - Modify to include period information
   - Format: "VAT Return - [Period Name] ([Status])"
   - Access period name via self.period

6. **Add validation method**
   - Create clean() method
   - Validate that period.period_type is 'monthly' or 'quarterly'
   - Ensure period belongs to same tenant
   - Raise ValidationError if invalid

### Period Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | ForeignKey | Links to TaxPeriod |
| Target Model | TaxPeriod | Tax period definition |
| on_delete | PROTECT | Prevent period deletion if returns exist |
| Related Name | vat_returns | Access returns from period: period.vat_returns.all() |
| Required | Yes | Every return must have a period |
| Help Text | "Tax period for this VAT return" | User guidance |

### Relationship Details

```
┌──────────────────────────────────────────────┐
│                TaxPeriod                     │
│  period_type: monthly                        │
│  start_date: 2026-01-01                      │
│  end_date: 2026-01-31                        │
└──────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌──────────────────────────────────────────────┐
│              VATReturn #1                    │
│  status: draft                               │
│  period: → January 2026                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│              VATReturn #2                    │
│  status: filed                               │
│  period: → January 2026                      │
│  reference_number: VAT-202601-00001          │
└──────────────────────────────────────────────┘
         ▲
         │ (Amended return - new record,
         │  same period, status='amended')
```

### Period Type Handling

```
Supported Period Types for VAT Returns
═══════════════════════════════════════

Monthly Periods:
  ✓ January 2026 (01/01/2026 - 31/01/2026)
  ✓ February 2026 (01/02/2026 - 28/02/2026)
  ✓ March 2026 (01/03/2026 - 31/03/2026)

Quarterly Periods:
  ✓ Q1 2026 (01/01/2026 - 31/03/2026)
  ✓ Q2 2026 (01/04/2026 - 30/06/2026)
  ✓ Q3 2026 (01/07/2026 - 30/09/2026)
  ✓ Q4 2026 (01/10/2026 - 31/12/2026)

Annual Periods:
  ✗ Not used for VAT returns
    (VAT is monthly or quarterly only)
```

### Unique Constraint Logic

```
Unique Together: (tenant, period)
═══════════════════════════════════

Tenant A:
  Period: January 2026
    ├── VATReturn (status=draft)     ✗ INVALID
    └── VATReturn (status=filed)     ✗ INVALID
    
    Only ONE VATReturn per (tenant, period) combination
    
    For amendments:
      Delete/update existing return OR
      Use status='amended' workflow
```

### Business Rules

| Rule | Enforcement | Reason |
|------|-------------|--------|
| One return per period | Database constraint | Prevent duplicate filings |
| Period must exist | Foreign key constraint | Data integrity |
| Cannot delete period with returns | PROTECT on_delete | Preserve audit trail |
| Period type validation | clean() method | VAT only uses monthly/quarterly |
| Tenant matching | clean() method | Cross-tenant data protection |

### Period Selection Flow

```
Creating New VAT Return
═══════════════════════

Step 1: Select Tax Period
  └─► Query available periods for tenant
      └─► Filter by period_type in ['monthly', 'quarterly']
          └─► Exclude periods with existing returns
              └─► Present available periods to user

Step 2: Validate Selection
  └─► Check period belongs to tenant
      └─► Verify no existing return for period
          └─► Confirm period is closed/ready for return
              └─► Create VATReturn with selected period

Step 3: Link Return to Period
  └─► Set period foreign key
      └─► Save VATReturn
          └─► Now accessible via period.vat_returns.all()
```

### Expected Outcome
- VATReturn linked to TaxPeriod
- One return per period per tenant enforced
- Period cannot be deleted if returns exist
- Period validation ensures correct usage
- Foundation for period-based reporting

### Verification Checklist
- [ ] TaxPeriod imported in vat_return.py
- [ ] period field added as ForeignKey
- [ ] on_delete set to PROTECT
- [ ] Related_name set to 'vat_returns'
- [ ] Required field (no blank/null)
- [ ] unique_together includes (tenant, period)
- [ ] __str__ method updated to include period
- [ ] clean() method validates period type
- [ ] clean() method validates tenant matching

---

## Task 19: Add Output VAT Field

### Overview
Add the output_vat field to store the total VAT collected on sales (VAT charged to customers). Output VAT represents the tax liability for the period and forms the first component of the net VAT calculation for Sri Lanka's 8% VAT system.

### Dependencies
- Task 17: Create VATReturn model
- Task 18: Add return period FK

### Instructions

1. **Open vat_return.py model file**
   - Navigate to `apps/accounting/models/vat_return.py`
   - Locate VATReturn model class

2. **Add output_vat field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Cannot be negative (add validation)
   - Required field (no blank/null)
   - Help_text: "Total VAT charged on sales (Output VAT)"

3. **Import Decimal**
   - Add: from decimal import Decimal
   - Required for default value and calculations

4. **Update clean() method**
   - Add validation: output_vat must be >= 0
   - Raise ValidationError if negative
   - Error message: "Output VAT cannot be negative"

5. **Add output_vat_display property**
   - Create property method
   - Format output_vat with currency symbol (LKR)
   - Return format: "LKR 80,000.00"
   - Use thousand separators for readability

6. **Update model docstring**
   - Document output_vat field purpose
   - Explain calculation source: sum of VAT from sales invoices
   - Note Sri Lanka standard rate: 8%

### Output VAT Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DecimalField | Monetary value with precision |
| max_digits | 15 | Support large tax amounts (up to billions) |
| decimal_places | 2 | Standard monetary precision |
| Default | Decimal('0.00') | Start at zero |
| Validation | >= 0 | Cannot have negative output VAT |
| Help Text | "Total VAT charged on sales (Output VAT)" | User guidance |

### Output VAT Calculation Sources

```
Output VAT Calculation Flow
════════════════════════════

Sales Invoices (Period: January 2026)
┌──────────────────────────────────────────────┐
│ Invoice #1                                   │
│   Item A: LKR 50,000 @ 8% → VAT: LKR 4,000  │
│   Item B: LKR 30,000 @ 8% → VAT: LKR 2,400  │
│   Invoice Total VAT: LKR 6,400               │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Invoice #2                                   │
│   Item C: LKR 100,000 @ 8% → VAT: LKR 8,000 │
│   Invoice Total VAT: LKR 8,000               │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Invoice #3 (Zero-rated export)               │
│   Item D: LKR 50,000 @ 0% → VAT: LKR 0      │
│   Invoice Total VAT: LKR 0                   │
└──────────────────────────────────────────────┘

Sum all sales invoice VAT amounts
↓
Output VAT = LKR 6,400 + LKR 8,000 + LKR 0
Output VAT = LKR 14,400
```

### Output VAT Components Breakdown

```
Output VAT Breakdown by Transaction Type
═════════════════════════════════════════

Category           Taxable Amount    VAT Rate    VAT Amount
────────────────────────────────────────────────────────────
Standard Sales     LKR 1,000,000      8%        LKR 80,000
Zero-Rated Sales   LKR   500,000      0%        LKR      0
Exempt Sales       LKR   200,000      -         LKR      -
                                                ───────────
TOTAL OUTPUT VAT                                LKR 80,000
═══════════════════════════════════════════════════════════

Notes:
- Zero-rated: Exports, certain foodstuffs
- Exempt: Financial services, land sales, education
- Only standard-rated sales generate output VAT
```

### Sri Lanka VAT Rate Context (2024-2026)

| Effective Date | Standard Rate | Zero Rate | Notes |
|----------------|---------------|-----------|-------|
| Before 2024 | 15% | 0% | Higher rate period |
| 2024-Current | 8% | 0% | Reduced rate active |
| Future | Variable | 0% | May change per government policy |

### IRD Output VAT Reporting Format

```
INLAND REVENUE DEPARTMENT - VAT RETURN
SECTION A: OUTPUT VAT (Sales)

1. Standard-rated supplies (8%)
   Taxable Value:     LKR 1,000,000.00
   VAT Amount:        LKR    80,000.00 ◄── output_vat field
   
2. Zero-rated supplies (0%)
   Taxable Value:     LKR   500,000.00
   VAT Amount:        LKR         0.00 (included above)

3. Exempt supplies (not subject to VAT)
   Value:             LKR   200,000.00
   VAT Amount:        N/A

TOTAL OUTPUT VAT:     LKR    80,000.00
```

### Display Formatting Examples

| Raw Value | Formatted Display | Context |
|-----------|-------------------|---------|
| 80000.00 | LKR 80,000.00 | Standard format with separator |
| 4567.50 | LKR 4,567.50 | Smaller amount |
| 1234567.89 | LKR 1,234,567.89 | Large amount with separators |
| 0.00 | LKR 0.00 | No output VAT (all zero-rated) |

### Business Scenarios

#### Scenario 1: Retail Store
```
Sales for January 2026:
  - 500 transactions
  - Average invoice: LKR 2,000
  - All standard-rated (8%)
  - Total sales: LKR 1,000,000
  - Output VAT: LKR 80,000 ◄── Stored in output_vat field
```

#### Scenario 2: Export Company
```
Sales for January 2026:
  - Local sales: LKR 500,000 @ 8% → VAT: LKR 40,000
  - Export sales: LKR 2,000,000 @ 0% → VAT: LKR 0
  - Total output VAT: LKR 40,000 ◄── Lower due to exports
```

#### Scenario 3: Mixed Services
```
Sales for January 2026:
  - Taxable services: LKR 800,000 @ 8% → VAT: LKR 64,000
  - Exempt services: LKR 200,000 @ N/A → VAT: N/A
  - Total output VAT: LKR 64,000 ◄── Exempt sales excluded
```

### Expected Outcome
- output_vat field storing sales VAT
- Non-negative validation enforced
- Formatted display for user interface
- Foundation for net VAT calculation
- IRD-compliant data storage

### Verification Checklist
- [ ] output_vat field added (DecimalField)
- [ ] max_digits=15, decimal_places=2
- [ ] Default value set to Decimal('0.00')
- [ ] Decimal imported from decimal module
- [ ] clean() method validates >= 0
- [ ] ValidationError raised if negative
- [ ] output_vat_display property created
- [ ] Display format includes LKR and separators
- [ ] Model docstring updated

---

## Task 20: Add Input VAT Field

### Overview
Add the input_vat field to store the total VAT paid on purchases (VAT paid to suppliers). Input VAT represents claimable tax credits and forms the second component of the net VAT calculation. This field is essential for determining the final VAT liability or refund.

### Dependencies
- Task 17: Create VATReturn model
- Task 19: Add output VAT field

### Instructions

1. **Open vat_return.py model file**
   - Navigate to `apps/accounting/models/vat_return.py`
   - Locate VATReturn model class

2. **Add input_vat field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Cannot be negative (add validation)
   - Required field (no blank/null)
   - Help_text: "Total VAT paid on purchases (Input VAT)"

3. **Update clean() method**
   - Add validation: input_vat must be >= 0
   - Raise ValidationError if negative
   - Error message: "Input VAT cannot be negative"

4. **Add input_vat_display property**
   - Create property method
   - Format input_vat with currency symbol (LKR)
   - Return format: "LKR 56,000.00"
   - Use thousand separators for readability

5. **Update model docstring**
   - Document input_vat field purpose
   - Explain calculation source: sum of VAT from purchase invoices
   - Note claimability rules for Sri Lanka

### Input VAT Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DecimalField | Monetary value with precision |
| max_digits | 15 | Support large tax amounts |
| decimal_places | 2 | Standard monetary precision |
| Default | Decimal('0.00') | Start at zero |
| Validation | >= 0 | Cannot have negative input VAT |
| Help Text | "Total VAT paid on purchases (Input VAT)" | User guidance |

### Input VAT Calculation Sources

```
Input VAT Calculation Flow
═══════════════════════════

Purchase Invoices (Period: January 2026)
┌──────────────────────────────────────────────┐
│ Purchase #1 (Local supplier)                 │
│   Raw materials: LKR 500,000                 │
│   VAT @ 8%: LKR 40,000                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Purchase #2 (Import with VAT)                │
│   Equipment: LKR 200,000                     │
│   VAT @ 8%: LKR 16,000                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Purchase #3 (Services)                       │
│   Consulting: LKR 100,000                    │
│   VAT @ 8%: LKR 8,000                        │
└──────────────────────────────────────────────┘

Sum all purchase invoice VAT amounts
↓
Input VAT = LKR 40,000 + LKR 16,000 + LKR 8,000
Input VAT = LKR 64,000
```

### Input VAT Claimability Rules (Sri Lanka)

```
Input VAT Claimability Matrix
══════════════════════════════

Purchase Type                    Claimable?    Conditions
─────────────────────────────────────────────────────────────
Business inputs/raw materials    ✓ Yes         Used for taxable supplies
Capital equipment                ✓ Yes         Business use only
Services for business            ✓ Yes         Directly attributable
Motor vehicles (< 1500cc)        ✓ Yes         Business use documented
Motor vehicles (> 1500cc)        ✓ Partial     25% claimable
Entertainment expenses           ✗ No          Not claimable
Personal use items               ✗ No          Not business-related
Purchases for exempt supplies    ✗ No          Cannot claim
```

### Input VAT Components Breakdown

```
Input VAT Breakdown by Category
════════════════════════════════

Category               Purchase Amount    VAT Rate    VAT Amount
────────────────────────────────────────────────────────────────
Local Purchases        LKR   600,000      8%         LKR 48,000
Imported Goods         LKR   100,000      8%         LKR  8,000
Services               LKR    50,000      8%         LKR  4,000
                                                     ──────────
TOTAL INPUT VAT                                      LKR 60,000
═══════════════════════════════════════════════════════════════

Notes:
- All purchases must be from VAT-registered suppliers
- Supplier TIN must be recorded
- Tax invoices required for claims
```

### IRD Input VAT Reporting Format

```
INLAND REVENUE DEPARTMENT - VAT RETURN
SECTION B: INPUT VAT (Purchases)

4. Local purchases from VAT-registered suppliers
   Purchase Value:    LKR   600,000.00
   VAT Amount:        LKR    48,000.00
   
5. Imported goods (VAT paid at customs)
   Import Value:      LKR   100,000.00
   VAT Amount:        LKR     8,000.00
   
6. Services from VAT-registered suppliers
   Service Value:     LKR    50,000.00
   VAT Amount:        LKR     4,000.00

TOTAL INPUT VAT:      LKR    60,000.00 ◄── input_vat field
```

### Input VAT vs Output VAT Relationship

```
VAT Return Calculation Overview
════════════════════════════════

Output VAT (Sales)        LKR  80,000 ◄── Task 19
Input VAT (Purchases)     LKR  60,000 ◄── Task 20 (current)
                               ───────
Net VAT Payable           LKR  20,000 ◄── Task 21 (next)

When Input VAT > Output VAT:
  Result: VAT Refund/Credit
  Example: Export businesses with zero-rated sales
```

### Business Scenarios

#### Scenario 1: Manufacturing Business
```
Purchases for January 2026:
  - Raw materials: LKR 500,000 @ 8% → VAT: LKR 40,000
  - Machinery parts: LKR 200,000 @ 8% → VAT: LKR 16,000
  - Utilities: LKR 100,000 @ 8% → VAT: LKR 8,000
  - Total input VAT: LKR 64,000 ◄── Stored in input_vat field
```

#### Scenario 2: Service Company
```
Purchases for January 2026:
  - Office supplies: LKR 50,000 @ 8% → VAT: LKR 4,000
  - Software licenses: LKR 100,000 @ 8% → VAT: LKR 8,000
  - Consulting: LKR 75,000 @ 8% → VAT: LKR 6,000
  - Total input VAT: LKR 18,000 ◄── Lower input VAT
```

#### Scenario 3: Retail Business
```
Purchases for January 2026:
  - Inventory: LKR 800,000 @ 8% → VAT: LKR 64,000
  - Delivery van: LKR 1,200,000 @ 8% → VAT: LKR 96,000
    (Capital expense - large one-time input VAT)
  - Total input VAT: LKR 160,000 ◄── May exceed output VAT
    Result: VAT refund position for the period
```

### Input VAT Documentation Requirements

| Requirement | Purpose | IRD Compliance |
|-------------|---------|----------------|
| Supplier TIN | Verify VAT registration | Mandatory |
| Tax Invoice | Prove VAT payment | Mandatory |
| Payment proof | Bank transfer/receipt | Recommended |
| Business purpose | Justify claimability | Required for audit |
| Asset register | Capital items tracking | Required for capital goods |

### Expected Outcome
- input_vat field storing purchase VAT
- Non-negative validation enforced
- Formatted display for user interface
- Foundation for net VAT calculation
- Claimable input VAT tracked

### Verification Checklist
- [ ] input_vat field added (DecimalField)
- [ ] max_digits=15, decimal_places=2
- [ ] Default value set to Decimal('0.00')
- [ ] clean() method validates >= 0
- [ ] ValidationError raised if negative
- [ ] input_vat_display property created
- [ ] Display format includes LKR and separators
- [ ] Model docstring updated

---

## Task 21: Add Net VAT Payable

### Overview
Add the net_vat_payable field to store the final VAT liability or refund amount. This calculated field represents the difference between output VAT and input VAT, determining whether the business owes tax to the IRD or is entitled to a refund.

### Dependencies
- Task 19: Add output VAT field
- Task 20: Add input VAT field

### Instructions

1. **Open vat_return.py model file**
   - Navigate to `apps/accounting/models/vat_return.py`
   - Locate VATReturn model class

2. **Add net_vat_payable field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Can be positive (payable) or negative (refundable)
   - Required field (no blank/null)
   - Help_text: "Net VAT payable or refundable (Output VAT - Input VAT)"

3. **Add calculate_net_vat method**
   - Create method to calculate: output_vat - input_vat
   - Return Decimal result
   - Automatically called before saving
   - Update net_vat_payable field

4. **Override save method**
   - Call calculate_net_vat() before saving
   - Update net_vat_payable with calculated value
   - Call parent save method

5. **Add is_refund_position property**
   - Create boolean property
   - Return True if net_vat_payable < 0
   - Return False if net_vat_payable >= 0
   - Used for UI display and reporting

6. **Add net_vat_payable_display property**
   - Format with currency symbol (LKR)
   - Show "LKR X,XXX.XX (Payable)" if positive
   - Show "LKR X,XXX.XX (Refund)" if negative
   - Use absolute value for display

7. **Update model docstring**
   - Document net_vat_payable calculation
   - Explain positive vs. negative values
   - Note automatic calculation on save

### Net VAT Payable Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DecimalField | Monetary value with precision |
| max_digits | 15 | Support large amounts |
| decimal_places | 2 | Standard monetary precision |
| Default | Decimal('0.00') | Start at zero |
| Validation | None (can be negative) | Allow refund positions |
| Help Text | "Net VAT payable or refundable..." | User guidance |
| Auto-calculated | Yes | Updated on save |

### Net VAT Calculation Formula

```
Net VAT Payable Calculation
════════════════════════════

Net VAT Payable = Output VAT - Input VAT

Interpretation:
  ► Positive value: Business owes tax to IRD
  ► Negative value: Business entitled to refund from IRD
  ► Zero: No tax liability or refund
```

### Calculation Examples

```
Example 1: Payable Position (Standard Case)
════════════════════════════════════════════
Output VAT (Sales):       LKR  80,000
Input VAT (Purchases):    LKR  60,000
                               ───────
Net VAT Payable:          LKR  20,000 ✓ (Pay to IRD)

Example 2: Refund Position (Export Business)
═════════════════════════════════════════════
Output VAT (Sales):       LKR  10,000  (mostly zero-rated)
Input VAT (Purchases):    LKR  50,000
                               ───────
Net VAT Refundable:       LKR -40,000 ✓ (Claim from IRD)

Example 3: Neutral Position (Rare)
═══════════════════════════════════
Output VAT (Sales):       LKR  75,000
Input VAT (Purchases):    LKR  75,000
                               ───────
Net VAT:                  LKR       0 ✓ (No payment/refund)

Example 4: Large Capital Purchase
══════════════════════════════════
Output VAT (Sales):       LKR  100,000
Input VAT (Purchases):    LKR  200,000  (bought machinery)
                               ────────
Net VAT Refundable:       LKR -100,000 ✓ (Temporary refund)
```

### IRD Net VAT Reporting Format

```
INLAND REVENUE DEPARTMENT - VAT RETURN
SECTION C: NET VAT CALCULATION

Line 6: Total Output VAT (Section A)      LKR   80,000.00
Line 7: Total Input VAT (Section B)       LKR   60,000.00
                                               ───────────
Line 8: Net VAT Payable                   LKR   20,000.00
        (If positive - amount to pay)
        (If negative - amount to claim)
        
Payment due date: 20th February 2026

─────────────────────────────────────────────────────────
Declaration: I declare that this return is true and complete.

Signature: ________________    Date: ________________
```

### Payable vs. Refund Positions

```
VAT Position Decision Tree
═══════════════════════════

Output VAT vs Input VAT
        │
        ├─── Output > Input ──► PAYABLE POSITION
        │                       └─► Pay IRD
        │                           └─► Due: 20th next month
        │
        ├─── Output < Input ──► REFUND POSITION
        │                       └─► Claim from IRD
        │                           └─► Process time: 60-90 days
        │
        └─── Output = Input ──► NEUTRAL POSITION
                                └─► No action required
                                    └─► Still file return
```

### Business Scenarios by Position Type

#### Payable Position Scenarios
| Business Type | Typical Ratio | Example |
|---------------|---------------|---------|
| Retail store | Output 1.3x Input | High sales margin |
| Restaurant | Output 1.5x Input | Value-added services |
| Service company | Output 2x Input | Low input costs |
| Wholesale (high margin) | Output 1.2x Input | Markup on goods |

#### Refund Position Scenarios
| Business Type | Typical Ratio | Reason |
|---------------|---------------|--------|
| Export company | Input >> Output | Zero-rated exports |
| New business | Input > Output | Capital purchases |
| Manufacturer (capital intensive) | Input > Output | Equipment purchases |
| SVAT registered | Input > Output | Special scheme benefits |

### Display Format Examples

| net_vat_payable | is_refund_position | Display |
|-----------------|-------------------|---------|
| 20000.00 | False | LKR 20,000.00 (Payable) |
| -15000.00 | True | LKR 15,000.00 (Refund) |
| 0.00 | False | LKR 0.00 (Neutral) |
| 125467.50 | False | LKR 125,467.50 (Payable) |
| -98234.75 | True | LKR 98,234.75 (Refund) |

### Payment and Refund Timelines

```
Payable Position Timeline
═════════════════════════
Period ends: 31 Jan 2026
  │
  ├─► Calculate VAT: 1-5 Feb
  ├─► File return: by 20 Feb
  ├─► Make payment: by 20 Feb
  └─► Penalty if late: 2% per month + interest

Refund Position Timeline
════════════════════════
Period ends: 31 Jan 2026
  │
  ├─► Calculate VAT: 1-5 Feb
  ├─► File return: by 20 Feb
  ├─► IRD review: 30-60 days
  ├─► Audit (if required): 60-90 days
  └─► Refund issued: 60-90 days from filing
```

### Expected Outcome
- net_vat_payable field storing final VAT liability
- Automatic calculation from output and input VAT
- Support for both payable and refund positions
- Clear display with position indicator
- Foundation for payment processing

### Verification Checklist
- [ ] net_vat_payable field added (DecimalField)
- [ ] max_digits=15, decimal_places=2
- [ ] Default value set to Decimal('0.00')
- [ ] calculate_net_vat() method created
- [ ] save() method overridden to auto-calculate
- [ ] is_refund_position property added
- [ ] net_vat_payable_display property created
- [ ] Display shows (Payable) or (Refund)
- [ ] Model docstring updated

---

## Task 22: Add Return Line Items

### Overview
Add the line_items JSONField to store detailed breakdown of all transactions contributing to the VAT return. This field provides the audit trail required by IRD, storing individual invoice references, amounts, and VAT calculations grouped by category and rate.

### Dependencies
- Task 17: Create VATReturn model
- Task 19: Add output VAT field
- Task 20: Add input VAT field

### Instructions

1. **Open vat_return.py model file**
   - Navigate to `apps/accounting/models/vat_return.py`
   - Locate VATReturn model class

2. **Add line_items field**
   - JSONField for flexible structured data
   - Default to dict (empty dictionary)
   - Required field (no blank/null)
   - Help_text: "Detailed breakdown of VAT calculations by transaction"

3. **Define line items structure in docstring**
   - Document expected JSON structure
   - Include standard_rated, zero_rated, exempt sections
   - Include purchases section
   - List required fields per line item

4. **Add validation method for line_items**
   - Create validate_line_items() method
   - Check required keys exist
   - Validate each line item has required fields
   - Ensure amounts match field totals

5. **Add update_line_items method**
   - Create method to populate line_items from invoices
   - Query sales invoices for period
   - Query purchase invoices for period
   - Group by VAT rate and category
   - Store in structured format

6. **Add get_line_items_by_category method**
   - Accept category parameter (standard_rated, zero_rated, etc.)
   - Return filtered list of line items
   - Used for displaying specific categories

7. **Add line_items_summary property**
   - Create property that returns summary statistics
   - Count of items per category
   - Total amounts per category
   - Used for quick overview

### Line Items Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Flexible structured data |
| Default | dict | Empty dictionary |
| Required | Yes | No blank/null |
| Validation | Custom method | Ensure structure integrity |
| Help Text | "Detailed breakdown..." | User guidance |

### Line Items JSON Structure

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
    {
      "invoice_number": "INV-2026-00124",
      "invoice_date": "2026-01-16",
      "customer_name": "XYZ Holdings",
      "customer_tin": "987654321V",
      "taxable_amount": 75000.00,
      "vat_rate": 8.00,
      "vat_amount": 6000.00,
      "total_amount": 81000.00
    }
  ],
  "zero_rated": [
    {
      "invoice_number": "EXP-2026-00045",
      "invoice_date": "2026-01-20",
      "customer_name": "International Buyer Ltd",
      "customer_country": "United Kingdom",
      "taxable_amount": 500000.00,
      "vat_rate": 0.00,
      "vat_amount": 0.00,
      "total_amount": 500000.00,
      "export_declaration": "EXP-2026-045"
    }
  ],
  "exempt": [
    {
      "invoice_number": "INV-2026-00150",
      "invoice_date": "2026-01-25",
      "customer_name": "Educational Institute",
      "description": "Educational materials",
      "amount": 100000.00,
      "exemption_reason": "Educational supplies"
    }
  ],
  "purchases": [
    {
      "supplier_invoice": "SUPP-001-2026",
      "invoice_date": "2026-01-10",
      "supplier_name": "Raw Materials Supplier",
      "supplier_tin": "555666777V",
      "taxable_amount": 400000.00,
      "vat_rate": 8.00,
      "vat_amount": 32000.00,
      "total_amount": 432000.00,
      "purchase_type": "local"
    },
    {
      "supplier_invoice": "IMP-2026-123",
      "invoice_date": "2026-01-12",
      "supplier_name": "Overseas Supplier Inc",
      "supplier_country": "India",
      "taxable_amount": 200000.00,
      "vat_rate": 8.00,
      "vat_amount": 16000.00,
      "total_amount": 216000.00,
      "purchase_type": "import",
      "customs_declaration": "C-2026-456"
    }
  ],
  "summary": {
    "total_standard_rated_count": 2,
    "total_standard_rated_vat": 10000.00,
    "total_zero_rated_count": 1,
    "total_zero_rated_amount": 500000.00,
    "total_exempt_count": 1,
    "total_exempt_amount": 100000.00,
    "total_purchases_count": 2,
    "total_purchases_vat": 48000.00
  }
}
```

### Line Item Categories

```
VAT Return Line Items Structure
════════════════════════════════

├── STANDARD_RATED (8% VAT)
│   ├── Local sales to VAT-registered businesses
│   ├── Local sales to individuals
│   └── Standard services
│
├── ZERO_RATED (0% VAT)
│   ├── Exports (goods)
│   ├── Exports (services)
│   ├── Essential foodstuffs
│   └── Specified medical supplies
│
├── EXEMPT (No VAT)
│   ├── Financial services
│   ├── Land and building sales
│   ├── Educational services
│   └── Healthcare services
│
└── PURCHASES (Input VAT)
    ├── Local purchases (VAT-registered suppliers)
    ├── Imports (VAT paid at customs)
    └── Services (VAT-registered providers)
```

### Required Fields by Category

#### Standard Rated Sales
| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| invoice_number | String | Yes | Invoice reference |
| invoice_date | Date | Yes | Transaction date |
| customer_name | String | Yes | Buyer identification |
| customer_tin | String | No | VAT registration (if available) |
| taxable_amount | Decimal | Yes | Amount before VAT |
| vat_rate | Decimal | Yes | 8.00 (current rate) |
| vat_amount | Decimal | Yes | Calculated VAT |
| total_amount | Decimal | Yes | Amount including VAT |

#### Zero Rated Sales
| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| invoice_number | String | Yes | Invoice reference |
| customer_name | String | Yes | Buyer identification |
| customer_country | String | Yes (exports) | Destination country |
| taxable_amount | Decimal | Yes | Export value |
| export_declaration | String | Yes (exports) | Customs reference |

#### Purchases (Input VAT)
| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| supplier_invoice | String | Yes | Supplier invoice number |
| supplier_name | String | Yes | Supplier identification |
| supplier_tin | String | Yes | Supplier VAT registration |
| taxable_amount | Decimal | Yes | Purchase before VAT |
| vat_amount | Decimal | Yes | Claimable VAT |
| purchase_type | String | Yes | 'local' or 'import' |

### Line Items Validation Rules

```
Validation Checklist
════════════════════

Structure Validation:
✓ All required sections present
✓ Each section is a list
✓ Summary section is a dictionary

Line Item Validation:
✓ Required fields present in each item
✓ Amounts are numeric (Decimal/float)
✓ Dates are in ISO format (YYYY-MM-DD)
✓ VAT rates are valid (0.00, 8.00)
✓ VAT amount = taxable_amount × (vat_rate / 100)

Total Validation:
✓ Sum of standard_rated VAT = portion of output_vat
✓ Sum of purchases VAT = input_vat
✓ Summary totals match detail totals
```

### Usage Example: Audit Trail

```
IRD Audit Scenario: January 2026 Return
════════════════════════════════════════

Auditor Request: "Show all standard-rated sales"

Response from line_items:
1. INV-2026-00123  │  15 Jan  │  ABC Company     │  LKR 4,000 VAT
2. INV-2026-00124  │  16 Jan  │  XYZ Holdings    │  LKR 6,000 VAT
3. INV-2026-00125  │  18 Jan  │  DEF Industries  │  LKR 5,200 VAT
   ...
   Total: 145 invoices  │  Total VAT: LKR 80,000

Auditor Request: "Show invoice INV-2026-00123 details"

Response:
{
  "invoice_number": "INV-2026-00123",
  "invoice_date": "2026-01-15",
  "customer_name": "ABC Company (Pvt) Ltd",
  "customer_tin": "123456789V",
  "taxable_amount": 50000.00,
  "vat_rate": 8.00,
  "vat_amount": 4000.00,
  "line_items": [
    {"description": "Product A", "qty": 10, "price": 3000, ...},
    {"description": "Product B", "qty": 5, "price": 4000, ...}
  ]
}
```

### Expected Outcome
- line_items field storing transaction details
- Structured JSON format for easy querying
- Complete audit trail for IRD compliance
- Validation ensures data integrity
- Methods for easy access and filtering

### Verification Checklist
- [ ] line_items field added (JSONField)
- [ ] Default value set to dict
- [ ] JSON structure documented in docstring
- [ ] validate_line_items() method created
- [ ] Required keys validation implemented
- [ ] update_line_items() method created
- [ ] get_line_items_by_category() method added
- [ ] line_items_summary property created
- [ ] Summary includes counts and totals

---

## Task 23: Add Filed Date

### Overview
Add the filed_date timestamp field to record when the VAT return was officially submitted to the IRD. This field is critical for compliance tracking, deadline monitoring, and audit trails. It remains null for draft returns and is set when the status changes to 'filed'.

### Dependencies
- Task 17: Create VATReturn model
- Task 18: Add return period FK

### Instructions

1. **Open vat_return.py model file**
   - Navigate to `apps/accounting/models/vat_return.py`
   - Locate VATReturn model class

2. **Add filed_date field**
   - DateTimeField with auto_now_add=False
   - Optional (blank=True, null=True)
   - Set only when status = 'filed'
   - Help_text: "Date and time when return was filed with IRD"

3. **Update save method**
   - Check if status changed to 'filed'
   - If filing for first time, set filed_date = timezone.now()
   - If already filed, preserve original filed_date
   - Generate reference_number if not exists

4. **Add filing_deadline property**
   - Calculate deadline: period.end_date + 20 days
   - Return date object
   - Used for checking if filing is late

5. **Add is_filed_late property**
   - Compare filed_date to filing_deadline
   - Return True if filed after deadline
   - Return False if on time
   - Return None if not yet filed

6. **Add days_until_deadline property**
   - Calculate days between today and deadline
   - Return positive int if deadline in future
   - Return negative int if deadline passed
   - Return None if already filed

7. **Add days_late property**
   - Calculate days between deadline and filed_date
   - Return 0 if filed on time
   - Return positive int if filed late
   - Return None if not yet filed

8. **Import timezone utilities**
   - Add: from django.utils import timezone
   - Required for filed_date timestamp

### Filed Date Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DateTimeField | Date and time precision |
| auto_now_add | False | Manual control of filing time |
| blank | True | Optional (null for drafts) |
| null | True | Database allows null |
| Set When | Status = 'filed' | Automatic on filing |
| Help Text | "Date and time when..." | User guidance |

### Filing Workflow

```
VAT Return Filing Process
══════════════════════════

Status: DRAFT
├── filed_date: null
├── reference_number: null
└── Can be edited

         │ User clicks "File Return"
         │ Validation passes
         ▼

Status: FILED
├── filed_date: 2026-02-15 14:30:25
├── reference_number: VAT-202601-00001
└── Cannot be edited (except amendments)

         │ If corrections needed
         ▼

Status: AMENDED
├── filed_date: 2026-02-15 14:30:25  (original)
├── amendment_date: 2026-03-10 09:15:00  (new)
└── New reference: VAT-202601-00002
```

### Filing Deadline Calculation

```
Filing Deadline Formula
═══════════════════════

Filing Deadline = Period End Date + 20 Days

Example 1: Monthly Return
Period: January 2026 (01 Jan - 31 Jan)
Deadline: 31 Jan + 20 days = 20 Feb 2026

Example 2: Quarterly Return
Period: Q1 2026 (01 Jan - 31 Mar)
Deadline: 31 Mar + 20 days = 20 Apr 2026

Sri Lanka IRD Rule:
  "VAT returns must be filed by the 20th day
   of the month following the end of the tax period"
```

### Filing Status Matrix

```
Filing Status Determination
════════════════════════════

Today: 15 Feb 2026

Return          Period End    Deadline     Filed Date    Status
────────────────────────────────────────────────────────────────
Return #1       31 Jan 2026   20 Feb 2026  (not filed)   ⏳ Pending
Return #2       31 Dec 2025   20 Jan 2026  18 Jan 2026   ✅ On Time
Return #3       30 Nov 2025   20 Dec 2025  28 Dec 2025   ❌ Late (8 days)
Return #4       31 Oct 2025   20 Nov 2025  (not filed)   ❌ Overdue
```

### Property Examples

#### filing_deadline Property
```
Input: Period ending 31 Jan 2026
Output: 20 Feb 2026

Calculation:
  period.end_date = 2026-01-31
  + timedelta(days=20)
  = 2026-02-20
```

#### is_filed_late Property
```
Return #1:
  filed_date: 2026-02-15
  deadline: 2026-02-20
  Result: False (5 days early)

Return #2:
  filed_date: 2026-02-25
  deadline: 2026-02-20
  Result: True (5 days late)

Return #3:
  filed_date: None
  deadline: 2026-02-20
  Result: None (not filed)
```

#### days_until_deadline Property
```
Today: 2026-02-10

Return #1 (deadline: 2026-02-20):
  Result: 10 days (deadline approaching)

Return #2 (deadline: 2026-01-20):
  Result: -21 days (deadline passed)

Return #3 (already filed):
  Result: None (not applicable)
```

#### days_late Property
```
Return #1:
  filed_date: 2026-02-15
  deadline: 2026-02-20
  Result: 0 (on time)

Return #2:
  filed_date: 2026-02-25
  deadline: 2026-02-20
  Result: 5 days late

Return #3:
  filed_date: None
  Result: None (not filed)
```

### Late Filing Penalties (Sri Lanka)

```
IRD Late Filing Penalty Structure
══════════════════════════════════

Base Penalty: 2% per month on VAT payable
Interest: Central Bank rate + 5% per annum

Example: VAT Payable LKR 100,000

1 month late:
  Penalty: LKR 2,000 (2%)
  Interest: ~LKR 1,250 (15% annual / 12)
  Total: ~LKR 3,250

3 months late:
  Penalty: LKR 6,000 (6%)
  Interest: ~LKR 3,750 (3 months)
  Total: ~LKR 9,750

6 months late:
  Penalty: LKR 12,000 (12%)
  Interest: ~LKR 7,500 (6 months)
  Additional penalties may apply
  Total: ~LKR 19,500+
```

### Filing Reminder Logic

```
Filing Reminder System
══════════════════════

Reminder Schedule:
  └─► 10 days before deadline: "Filing due in 10 days"
      └─► 5 days before: "Filing due in 5 days - URGENT"
          └─► 1 day before: "Filing due TOMORROW"
              └─► On deadline: "LAST DAY to file"
                  └─► 1 day after: "Filing OVERDUE - 1 day"
                      └─► 7 days after: "Filing OVERDUE - 7 days"
                          └─► 30 days after: "Filing CRITICAL - 30 days late"
```

### Business Scenarios

#### Scenario 1: On-Time Filing
```
Period: January 2026 (ends 31 Jan)
Deadline: 20 Feb 2026
Filed: 15 Feb 2026 at 10:30 AM

Result:
  ✓ is_filed_late = False
  ✓ days_late = 0
  ✓ No penalties
  ✓ Compliance maintained
```

#### Scenario 2: Late Filing
```
Period: January 2026 (ends 31 Jan)
Deadline: 20 Feb 2026
Filed: 28 Feb 2026 at 4:45 PM

Result:
  ✗ is_filed_late = True
  ✗ days_late = 8 days
  ✗ Penalty: 2% of VAT payable
  ✗ Interest accrued
  ⚠ Warning issued
```

#### Scenario 3: Not Yet Filed
```
Period: January 2026 (ends 31 Jan)
Deadline: 20 Feb 2026
Current date: 18 Feb 2026
Filed: None

Result:
  ⏳ days_until_deadline = 2 days
  ⏳ Urgent reminder
  ⏳ Still time to file
```

### Expected Outcome
- filed_date tracking submission time
- Automatic setting on status change
- Deadline calculation for monitoring
- Late filing detection
- Foundation for penalty calculation

### Verification Checklist
- [ ] filed_date field added (DateTimeField)
- [ ] Optional (blank=True, null=True)
- [ ] save() method sets filed_date when filing
- [ ] timezone imported and used
- [ ] filing_deadline property calculates correctly
- [ ] is_filed_late property returns boolean
- [ ] days_until_deadline property shows remaining days
- [ ] days_late property calculates late days
- [ ] Properties handle None values correctly

---

## Task 24: Run VATReturn Migrations

### Overview
Generate and apply Django migrations to create the VATReturn table in the database with all fields defined in previous tasks. This finalizes the model structure and makes it available for use in the application.

### Dependencies
- Task 17: Create VATReturn model
- Task 18: Add return period FK
- Task 19: Add output VAT field
- Task 20: Add input VAT field
- Task 21: Add net VAT payable field
- Task 22: Add return line items
- Task 23: Add filed date
- PostgreSQL database configured
- Django migrations system operational

### Instructions

1. **Verify model is complete**
   - Open `apps/accounting/models/vat_return.py`
   - Confirm all fields from tasks 17-23 are present
   - Check imports are complete
   - Verify no syntax errors

2. **Create migration file**
   - Open terminal in project root
   - Run: `python manage.py makemigrations accounting`
   - Migration file created in `apps/accounting/migrations/`
   - Note migration number (e.g., 0019_vatreturn.py)

3. **Review migration file**
   - Open generated migration file
   - Verify all fields are included
   - Check field types and constraints
   - Confirm indexes and unique constraints

4. **Run migration**
   - Execute: `python manage.py migrate accounting`
   - Database table created: `accounting_vatreturn`
   - All fields, indexes, and constraints applied

5. **Verify table creation**
   - Connect to PostgreSQL database
   - Check table exists: `\dt accounting_vatreturn`
   - Verify columns: `\d accounting_vatreturn`
   - Confirm indexes and foreign keys

6. **Test model in Django shell**
   - Open shell: `python manage.py shell`
   - Import model: `from accounting.models import VATReturn`
   - Create test instance (without saving)
   - Verify field defaults and validation

7. **Update admin interface**
   - Verify VATReturn appears in admin (if admin configured)
   - Check field display and editability
   - Test list and detail views

### Migration File Structure

```python
# apps/accounting/migrations/0019_vatreturn.py

from django.db import migrations, models
import django.db.models.deletion
from decimal import Decimal

class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0018_previous_migration'),
        ('tenants', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='VATReturn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[...], default='draft', max_length=20)),
                ('reference_number', models.CharField(blank=True, max_length=50, null=True)),
                ('output_vat', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15)),
                ('input_vat', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15)),
                ('net_vat_payable', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15)),
                ('line_items', models.JSONField(default=dict)),
                ('notes', models.TextField(blank=True, null=True)),
                ('filed_date', models.DateTimeField(blank=True, null=True)),
                ('filed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vat_returns_filed', to='auth.user')),
                ('period', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vat_returns', to='accounting.taxperiod')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tenants.tenant')),
            ],
            options={
                'verbose_name': 'VAT Return',
                'verbose_name_plural': 'VAT Returns',
                'ordering': ['-created_at'],
                'unique_together': {('tenant', 'period')},
                'indexes': [
                    models.Index(fields=['tenant', 'status'], name='accounting_vatreturn_tenant_status_idx'),
                    models.Index(fields=['tenant', 'period'], name='accounting_vatreturn_tenant_period_idx'),
                ],
            },
        ),
    ]
```

### Database Table Structure

```sql
-- PostgreSQL table structure (informational)

CREATE TABLE accounting_vatreturn (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id) ON DELETE CASCADE,
    period_id BIGINT NOT NULL REFERENCES accounting_taxperiod(id) ON DELETE PROTECT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    reference_number VARCHAR(50),
    output_vat NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    input_vat NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    net_vat_payable NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    line_items JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    filed_date TIMESTAMP WITH TIME ZONE,
    filed_by_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    CONSTRAINT unique_tenant_period UNIQUE (tenant_id, period_id)
);

CREATE INDEX idx_tenant_status ON accounting_vatreturn(tenant_id, status);
CREATE INDEX idx_tenant_period ON accounting_vatreturn(tenant_id, period_id);
```

### Field Mapping Summary

| Model Field | Database Column | Type | Constraints |
|-------------|----------------|------|-------------|
| tenant | tenant_id | BIGINT | FK, NOT NULL, CASCADE |
| period | period_id | BIGINT | FK, NOT NULL, PROTECT |
| status | status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' |
| reference_number | reference_number | VARCHAR(50) | NULL |
| output_vat | output_vat | NUMERIC(15,2) | NOT NULL, DEFAULT 0.00 |
| input_vat | input_vat | NUMERIC(15,2) | NOT NULL, DEFAULT 0.00 |
| net_vat_payable | net_vat_payable | NUMERIC(15,2) | NOT NULL, DEFAULT 0.00 |
| line_items | line_items | JSONB | NOT NULL, DEFAULT '{}' |
| notes | notes | TEXT | NULL |
| filed_date | filed_date | TIMESTAMP | NULL |
| filed_by | filed_by_id | INTEGER | FK, NULL, SET_NULL |
| created_at | created_at | TIMESTAMP | NOT NULL, AUTO |
| updated_at | updated_at | TIMESTAMP | NOT NULL, AUTO |

### Migration Verification Steps

```
Migration Verification Checklist
════════════════════════════════

1. Pre-Migration Checks
   ✓ All model fields defined
   ✓ No syntax errors in models.py
   ✓ All imports present
   ✓ Database connection active

2. Migration Generation
   ✓ makemigrations runs without errors
   ✓ Migration file created
   ✓ Migration number sequential
   ✓ No conflicts detected

3. Migration Review
   ✓ All fields present in migration
   ✓ Field types correct
   ✓ Constraints included
   ✓ Indexes defined

4. Migration Application
   ✓ migrate runs without errors
   ✓ No SQL errors
   ✓ No rollback required
   ✓ Success message displayed

5. Post-Migration Verification
   ✓ Table exists in database
   ✓ All columns present
   ✓ Constraints active
   ✓ Indexes created
   ✓ Foreign keys functional

6. Django Shell Testing
   ✓ Model importable
   ✓ Can create instance
   ✓ Field defaults work
   ✓ Validation works
```

### Testing in Django Shell

```python
# Test VATReturn model creation

from accounting.models import VATReturn, TaxPeriod
from tenants.models import Tenant
from decimal import Decimal

# Get test tenant and period
tenant = Tenant.objects.first()
period = TaxPeriod.objects.filter(tenant=tenant, period_type='monthly').first()

# Create draft return
vat_return = VATReturn(
    tenant=tenant,
    period=period,
    status='draft',
    output_vat=Decimal('80000.00'),
    input_vat=Decimal('60000.00'),
)

# Trigger calculation
vat_return.save()

# Verify
print(f"Status: {vat_return.status}")
print(f"Output VAT: {vat_return.output_vat_display}")
print(f"Input VAT: {vat_return.input_vat_display}")
print(f"Net VAT: {vat_return.net_vat_payable_display}")
print(f"Is Refund: {vat_return.is_refund_position}")

# Expected Output:
# Status: draft
# Output VAT: LKR 80,000.00
# Input VAT: LKR 60,000.00
# Net VAT: LKR 20,000.00 (Payable)
# Is Refund: False
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "No changes detected" | Model not in __init__.py | Add model import |
| Foreign key error | Referenced model not migrated | Migrate dependencies first |
| Unique constraint violation | Existing duplicate data | Clean data before migration |
| JSONField error | PostgreSQL < 9.4 | Upgrade PostgreSQL |
| Decimal default error | Missing Decimal import | Add import in migration |

### Rollback Plan

```
Migration Rollback Procedure
════════════════════════════

If migration fails or needs reverting:

1. Identify migration number
   └─► Example: 0019_vatreturn

2. Rollback to previous migration
   └─► python manage.py migrate accounting 0018

3. Delete migration file
   └─► rm apps/accounting/migrations/0019_vatreturn.py

4. Fix model issues
   └─► Correct any errors

5. Regenerate migration
   └─► python manage.py makemigrations accounting

6. Reapply migration
   └─► python manage.py migrate accounting
```

### Expected Outcome
- VATReturn table created in database
- All fields with correct types and constraints
- Indexes and foreign keys active
- Model ready for use in application
- Foundation for VAT return generation

### Verification Checklist
- [ ] makemigrations runs without errors
- [ ] Migration file created (0019_vatreturn.py)
- [ ] Migration file reviewed and correct
- [ ] migrate runs successfully
- [ ] Table accounting_vatreturn exists
- [ ] All columns present in table
- [ ] Foreign keys to tenant, period, user functional
- [ ] Unique constraint (tenant, period) active
- [ ] Indexes created
- [ ] Model importable in Django shell
- [ ] Can create test instance
- [ ] Field defaults and validation work

---

## Summary

This document completed the creation of the VATReturn model with all essential fields for tracking VAT return data in Sri Lanka's 8% VAT system. The model includes:

- Core tracking: status, reference number, filing information
- VAT calculations: output VAT, input VAT, net VAT payable
- Detailed audit trail: line items JSONField
- Compliance: filing deadlines, late filing detection
- Relationships: linked to tenant, tax period, and filing user

Next document will implement the VATReturnGenerator service class that populates these fields from sales and purchase invoices.
