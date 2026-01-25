# Tasks 17-27: Line Item Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** B - PDF Template Design  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-28-32_Template-Model.md](02_Tasks-28-32_Template-Model.md)

---

## Document Overview

This document covers the creation of line item models for payslip generation, including earnings, deductions, and employer contributions. These models store the detailed breakdown of salary components that appear on employee payslips, enabling accurate financial reporting and compliance with Sri Lankan labor regulations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create PayslipEarning Model | Medium | 25 min |
| 18 | Add Earning Component Name | Low | 15 min |
| 19 | Add Earning Amount Fields | Low | 15 min |
| 20 | Add Earning Sort Order | Low | 10 min |
| 21 | Create PayslipDeduction Model | Medium | 20 min |
| 22 | Add Deduction Component Name | Low | 15 min |
| 23 | Add Deduction Amount Fields | Low | 15 min |
| 24 | Add Deduction Sort Order | Low | 10 min |
| 25 | Create PayslipEmployerContribution | Medium | 20 min |
| 26 | Add Employer Contribution Fields | Low | 15 min |
| 27 | Run Line Item Migrations | Low | 15 min |

---

## Task 17: Create PayslipEarning Model

### Overview
Create the PayslipEarning model to store individual earning line items on payslips. This model captures each salary component that adds to an employee's gross pay, such as basic salary, allowances, overtime, bonuses, and commissions. Each payslip can have multiple earning entries, creating a detailed breakdown of the employee's total compensation.

### Dependencies
- Payslip model exists (from Group A)
- Django ORM configured
- apps/payslip/ structure established

### Instructions

1. **Create payslip_line.py model file**
   - Navigate to `apps/payslip/models/` directory
   - Create new file named `payslip_line.py`
   - This file will house all line item models

2. **Import required modules**
   - Import Django model fields (CharField, DecimalField, IntegerField, BooleanField, ForeignKey)
   - Import Django CASCADE for foreign key deletion
   - Import base model mixins (TimestampMixin if available)
   - Import Payslip model from same package

3. **Define PayslipEarning model class**
   - Inherit from Django's Model class
   - Add TimestampMixin if using shared base classes
   - Add comprehensive model docstring

4. **Add payslip foreign key**
   - ForeignKey to Payslip model
   - Use CASCADE on_delete behavior
   - Set related_name='earnings'
   - This creates reverse relationship for accessing all earnings

5. **Add model Meta class**
   - Set verbose_name to 'Payslip Earning'
   - Set verbose_name_plural to 'Payslip Earnings'
   - Add ordering by ['display_order', 'id']
   - Add index on (payslip, display_order) for query performance

6. **Add __str__ method**
   - Return format: "component_name - amount"
   - Example: "Basic Salary - 150,000.00"
   - Include currency formatting if applicable

7. **Update models/__init__.py**
   - Import PayslipEarning
   - Add to __all__ list for clean imports

### PayslipEarning Model Structure

```
┌──────────────────────────────────────────────────┐
│           PayslipEarning Model                   │
├──────────────────────────────────────────────────┤
│ Core Fields:                                     │
│  • payslip (ForeignKey to Payslip)               │
│  • component_code (CharField) [Task 18]          │
│  • component_name (CharField) [Task 18]          │
│  • amount (DecimalField) [Task 19]               │
│  • ytd_amount (DecimalField) [Task 19]           │
│  • display_order (IntegerField) [Task 20]        │
│  • is_highlighted (BooleanField) [Task 20]       │
│                                                  │
│ Inherited from TimestampMixin:                   │
│  • created_at (DateTimeField)                    │
│  • updated_at (DateTimeField)                    │
└──────────────────────────────────────────────────┘
```

### Model Relationships

```
┌─────────────┐          1:N          ┌─────────────────────┐
│   Payslip   │◄──────────────────────│  PayslipEarning     │
└─────────────┘                       └─────────────────────┘
      │                                         │
      │                                         │
      │ 1:N                                     │
      ▼                                         │
┌─────────────────────┐                        │
│ PayslipDeduction    │                        │
└─────────────────────┘                        │
      │                                         │
      │                                         │
      │ 1:N                                     │
      ▼                                         │
┌──────────────────────────┐                   │
│ PayslipEmployerContrib   │                   │
└──────────────────────────┘                   │
                                                │
          All linked to same Payslip           │
          for complete salary breakdown         │
```

### Salary Component Flow

```
                     Employee Payslip
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    PayslipEarning  PayslipDeduction  EmployerContrib
           │               │               │
    ┌──────┴─────┐  ┌──────┴─────┐  ┌──────┴─────┐
    ▼            ▼  ▼            ▼  ▼            ▼
  Basic      Transport  EPF       PAYE  EPF      ETF
  Salary     Allowance  Employee  Tax   Employer
  │          │          │         │     │        │
  150,000    15,000     12,000    5,500 18,000   4,500
  
  Total Earnings: 193,750
  Total Deductions: 22,500
  Net Salary: 171,250
  Employer Cost: 22,500
  Total Cost to Company: 216,250
```

### Common Earning Components

| Component Code | Component Name | Typical Amount | Category |
|----------------|----------------|----------------|----------|
| BASIC | Basic Salary | 150,000 LKR | Mandatory |
| TRANSPORT | Transport Allowance | 10,000-25,000 LKR | Allowance |
| MEDICAL | Medical Allowance | 5,000-15,000 LKR | Allowance |
| MEAL | Meal Allowance | 5,000-10,000 LKR | Allowance |
| MOBILE | Mobile Allowance | 2,000-5,000 LKR | Allowance |
| OVERTIME | Overtime Pay | Variable | Variable |
| BONUS | Performance Bonus | Variable | Incentive |
| COMMISSION | Sales Commission | Variable | Incentive |
| ARREARS | Salary Arrears | Variable | Adjustment |

### Earning Component Categories

#### Mandatory Components
```
Basic Salary
├── Fixed monthly salary
├── Forms base for EPF/ETF calculation
└── Typically 60-70% of gross pay
```

#### Fixed Allowances
```
Transport Allowance
├── Monthly travel reimbursement
├── Fixed amount per month
└── May vary by position level

Medical Allowance
├── Healthcare support
├── Fixed monthly amount
└── May be non-taxable up to limits

Meal Allowance
├── Daily meal support
├── Typically per working day
└── May be attendance-based
```

#### Variable Components
```
Overtime Pay
├── Hourly rate × OT hours
├── 1.5x or 2x normal rate
└── Weekend/holiday premium

Performance Bonus
├── Monthly/quarterly incentive
├── Based on KPIs
└── May be discretionary

Commission
├── Percentage of sales
├── Tiered structure possible
└── Common in sales roles
```

### Expected Outcome
- Functional PayslipEarning model
- Foreign key relationship to Payslip
- Foundation for earning line items
- Ready for field additions in subsequent tasks

### Verification Checklist
- [ ] payslip_line.py file created
- [ ] PayslipEarning class defined
- [ ] Django Model imported
- [ ] payslip ForeignKey field added
- [ ] related_name='earnings' set
- [ ] CASCADE delete behavior configured
- [ ] Meta class with verbose names
- [ ] Ordering specification added
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 18: Add Earning Component Name

### Overview
Add component identification fields to the PayslipEarning model. These fields store the code and human-readable name of each earning component, enabling consistent identification, reporting, and multi-language support for salary components.

### Dependencies
- Task 17: Create PayslipEarning Model

### Instructions

1. **Open payslip_line.py model file**
   - Navigate to `apps/payslip/models/payslip_line.py`
   - Locate PayslipEarning model class

2. **Add component_code field**
   - CharField with max_length=20
   - Required field (no blank/null)
   - Uppercase convention (e.g., 'BASIC', 'TRANSPORT')
   - System identifier for component

3. **Add component_name field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Human-readable display name
   - Example: 'Basic Salary', 'Transport Allowance'

4. **Update model docstring**
   - Document component_code purpose
   - Document component_name usage
   - Note code vs. name distinction

5. **Add validation method (optional)**
   - Create clean method to validate code format
   - Ensure uppercase convention
   - Prevent duplicate codes per payslip

6. **Update Meta class**
   - Add unique_together constraint (payslip, component_code)
   - Prevents duplicate components on same payslip
   - Add database index on component_code

7. **Update __str__ method**
   - Modify to use component_code and component_name
   - Format: "{code}: {name} - {amount}"
   - Example: "BASIC: Basic Salary - 150,000.00"

### Component Name Field Details

```
┌──────────────────────────────────────────────────┐
│       Component Identification Fields            │
├──────────────────────────────────────────────────┤
│ component_code (CharField, 20)                   │
│  • System identifier                             │
│  • Uppercase convention                          │
│  • Used in calculations and reports              │
│  • Examples: BASIC, TRANSPORT, OT                │
│                                                  │
│ component_name (CharField, 100)                  │
│  • Display name for employees                    │
│  • Can be translated/localized                   │
│  • Appears on payslip PDF                        │
│  • Examples: Basic Salary, අතිකාල වැටුප්         │
└──────────────────────────────────────────────────┘
```

### Code vs. Name Distinction

| Aspect | component_code | component_name |
|--------|----------------|----------------|
| Purpose | System identifier | Display label |
| Format | UPPERCASE_SNAKE | Title Case |
| Language | Always English | Localizable |
| Length | Short (≤20 chars) | Longer (≤100 chars) |
| Usage | Calculations, queries | PDF display |
| Example | BASIC | Basic Salary |
| Example | TRANSPORT | Transport Allowance |
| Example | OT_WEEKDAY | Weekday Overtime Pay |

### Component Code Naming Convention

#### Standard Pattern
```
{CATEGORY}_{SUBCATEGORY}_{TYPE}

Examples:
BASIC                    → Basic salary (no subcategory needed)
TRANSPORT                → Transport allowance
MEDICAL                  → Medical allowance
OT_WEEKDAY              → Overtime on weekdays
OT_WEEKEND              → Overtime on weekends
OT_HOLIDAY              → Overtime on holidays
BONUS_PERFORMANCE       → Performance bonus
BONUS_ATTENDANCE        → Attendance bonus
COMMISSION_SALES        → Sales commission
ALLOWANCE_MOBILE        → Mobile phone allowance
ARREARS_SALARY          → Salary arrears payment
```

### Multi-Language Support Example

```
Component Code: BASIC
├── English: Basic Salary
├── Sinhala: මූලික වැටුප
└── Tamil: அடிப்படை சம்பளம்

Component Code: TRANSPORT
├── English: Transport Allowance
├── Sinhala: ප්‍රවාහන දීමනාව
└── Tamil: போக்குவரத்து படி

Component Code: MEDICAL
├── English: Medical Allowance
├── Sinhala: වෛද්‍ය දීමනාව
└── Tamil: மருத்துவ படி
```

### Component Categorization

```
Earning Components by Category
═══════════════════════════════

┌─ Salary Components
│  ├── BASIC (Basic Salary)
│  ├── ARREARS (Salary Arrears)
│  └── SALARY_INCREMENT (Increment Adjustment)
│
┌─ Allowances
│  ├── TRANSPORT (Transport Allowance)
│  ├── MEDICAL (Medical Allowance)
│  ├── MEAL (Meal Allowance)
│  ├── MOBILE (Mobile Allowance)
│  ├── HOUSING (Housing Allowance)
│  └── UTILITY (Utility Allowance)
│
┌─ Overtime
│  ├── OT_WEEKDAY (Weekday Overtime)
│  ├── OT_WEEKEND (Weekend Overtime)
│  ├── OT_HOLIDAY (Public Holiday Overtime)
│  └── OT_SPECIAL (Special Overtime)
│
┌─ Incentives
│  ├── BONUS_PERFORMANCE (Performance Bonus)
│  ├── BONUS_ATTENDANCE (Attendance Bonus)
│  ├── BONUS_FESTIVAL (Festival Bonus)
│  ├── COMMISSION_SALES (Sales Commission)
│  └── INCENTIVE_TARGET (Target Achievement)
│
└─ Other Earnings
   ├── REIMBURSEMENT (Expense Reimbursement)
   ├── GRATUITY (Gratuity Payment)
   ├── LEAVE_ENCASH (Leave Encashment)
   └── ADVANCE_SETTLE (Advance Settlement)
```

### Unique Constraint Logic

```
Preventing Duplicate Components
════════════════════════════════

Payslip #12345 (April 2026):
  ├── BASIC: Basic Salary - 150,000   ✓ Allowed
  ├── TRANSPORT: Transport - 15,000   ✓ Allowed
  ├── BASIC: Extra Basic - 10,000     ✗ REJECTED (duplicate code)
  └── OT_WEEKDAY: Overtime - 5,000    ✓ Allowed

Different Payslips:
  Payslip #12345: BASIC - 150,000     ✓ Allowed
  Payslip #12346: BASIC - 150,000     ✓ Allowed (different payslip)
```

### Usage Scenarios

#### Scenario 1: Standard Monthly Payslip
```
Employee: Samantha Fernando
Period: April 2026
Department: Sales

Earnings:
┌──────────────┬────────────────────────┬────────────┐
│ Code         │ Component Name         │ Amount     │
├──────────────┼────────────────────────┼────────────┤
│ BASIC        │ Basic Salary           │ 150,000.00 │
│ TRANSPORT    │ Transport Allowance    │  15,000.00 │
│ MEDICAL      │ Medical Allowance      │  10,000.00 │
│ COMMISSION   │ Sales Commission       │  18,750.00 │
└──────────────┴────────────────────────┴────────────┘
```

#### Scenario 2: Overtime Heavy Payslip
```
Employee: Kasun Perera
Period: April 2026
Department: Operations

Earnings:
┌──────────────┬────────────────────────┬────────────┐
│ Code         │ Component Name         │ Amount     │
├──────────────┼────────────────────────┼────────────┤
│ BASIC        │ Basic Salary           │  80,000.00 │
│ TRANSPORT    │ Transport Allowance    │   8,000.00 │
│ OT_WEEKDAY   │ Weekday Overtime       │  12,000.00 │
│ OT_WEEKEND   │ Weekend Overtime       │   9,600.00 │
│ OT_HOLIDAY   │ Holiday Overtime       │   4,800.00 │
└──────────────┴────────────────────────┴────────────┘
```

#### Scenario 3: Executive Compensation
```
Employee: Pradeep Silva
Period: April 2026
Department: Management

Earnings:
┌──────────────┬────────────────────────┬────────────┐
│ Code         │ Component Name         │ Amount     │
├──────────────┼────────────────────────┼────────────┤
│ BASIC        │ Basic Salary           │ 300,000.00 │
│ TRANSPORT    │ Transport Allowance    │  50,000.00 │
│ MEDICAL      │ Medical Allowance      │  25,000.00 │
│ HOUSING      │ Housing Allowance      │  75,000.00 │
│ MOBILE       │ Mobile Allowance       │   5,000.00 │
│ BONUS_PERF   │ Performance Bonus      │ 100,000.00 │
└──────────────┴────────────────────────┴────────────┘
```

### Expected Outcome
- Component identification fields added
- Unique constraint prevents duplicates
- Support for component categorization
- Foundation for reporting and calculations
- Multi-language display capability

### Verification Checklist
- [ ] component_code field added
- [ ] component_name field added
- [ ] Max lengths set appropriately
- [ ] Both fields required (not nullable)
- [ ] unique_together constraint added
- [ ] Database index on component_code
- [ ] __str__ method updated
- [ ] Model docstring updated
- [ ] Clean method for validation (optional)

---

## Task 19: Add Earning Amount Fields

### Overview
Add financial amount fields to the PayslipEarning model. These fields store the current period amount and year-to-date (YTD) accumulation for each earning component, enabling accurate financial tracking, tax calculations, and compliance with statutory reporting requirements in Sri Lanka.

### Dependencies
- Task 18: Add Earning Component Name

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Locate PayslipEarning model class

2. **Add amount field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field (no blank/null)
   - Default value: 0.00
   - Current period earning amount

3. **Add ytd_amount field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field (no blank/null)
   - Default value: 0.00
   - Year-to-date cumulative amount

4. **Add field help text**
   - amount: "Earning amount for this pay period"
   - ytd_amount: "Cumulative year-to-date amount including this period"

5. **Update model docstring**
   - Document amount field purpose
   - Explain YTD calculation logic
   - Note fiscal year consideration

6. **Add validation method**
   - Create clean method to validate amounts
   - Ensure amount >= 0 (no negative earnings)
   - Validate ytd_amount >= amount (current period)

7. **Add YTD calculation method**
   - Create calculate_ytd method
   - Query previous payslips in fiscal year
   - Sum component amounts + current amount
   - Return calculated YTD total

### Amount Field Details

```
┌──────────────────────────────────────────────────┐
│           Financial Amount Fields                │
├──────────────────────────────────────────────────┤
│ amount (DecimalField)                            │
│  • Current pay period amount                     │
│  • Max digits: 15 (13 integer + 2 decimal)       │
│  • Precision: 2 decimal places                   │
│  • Currency: LKR (Sri Lankan Rupees)             │
│  • Range: 0.00 to 9,999,999,999,999.99          │
│                                                  │
│ ytd_amount (DecimalField)                        │
│  • Year-to-date cumulative amount                │
│  • Same precision as amount field                │
│  • Includes current period amount                │
│  • Resets at fiscal year start                   │
│  • Used for tax calculations                     │
└──────────────────────────────────────────────────┘
```

### Decimal Field Specifications

| Field | Max Digits | Decimal Places | Max Value | Precision |
|-------|------------|----------------|-----------|-----------|
| amount | 15 | 2 | 9,999,999,999,999.99 | LKR 0.01 |
| ytd_amount | 15 | 2 | 9,999,999,999,999.99 | LKR 0.01 |

**Rationale for 15 Digits:**
- Accommodates executive compensation
- Supports cumulative YTD calculations
- Handles bonuses and large commissions
- Future-proof for inflation

### YTD Calculation Logic

```
Year-to-Date Amount Calculation
════════════════════════════════

Fiscal Year: January 1 - December 31

Employee: Samantha Fernando
Component: TRANSPORT (Transport Allowance)

Month      | Amount    | YTD Amount
-----------|-----------|------------
Jan 2026   | 15,000.00 |  15,000.00
Feb 2026   | 15,000.00 |  30,000.00
Mar 2026   | 15,000.00 |  45,000.00
Apr 2026   | 15,000.00 |  60,000.00  ← Current Period
May 2026   | 15,000.00 |  75,000.00
...        | ...       |  ...
Dec 2026   | 15,000.00 | 180,000.00  ← Year End

Calculation for April 2026:
YTD = Jan + Feb + Mar + Apr
YTD = 15,000 + 15,000 + 15,000 + 15,000
YTD = 60,000.00
```

### Amount Field Examples

#### Example 1: Fixed Monthly Allowances
```
Component: TRANSPORT (Transport Allowance)
├── January 2026
│   ├── amount: 15,000.00
│   └── ytd_amount: 15,000.00
│
├── February 2026
│   ├── amount: 15,000.00
│   └── ytd_amount: 30,000.00
│
├── March 2026
│   ├── amount: 15,000.00
│   └── ytd_amount: 45,000.00
│
└── April 2026
    ├── amount: 15,000.00
    └── ytd_amount: 60,000.00
```

#### Example 2: Variable Overtime
```
Component: OT_WEEKDAY (Weekday Overtime)
├── January 2026
│   ├── amount: 8,500.00
│   └── ytd_amount: 8,500.00
│
├── February 2026
│   ├── amount: 12,300.00
│   └── ytd_amount: 20,800.00
│
├── March 2026
│   ├── amount: 6,700.00
│   └── ytd_amount: 27,500.00
│
└── April 2026
    ├── amount: 15,200.00
    └── ytd_amount: 42,700.00
```

#### Example 3: Quarterly Bonus
```
Component: BONUS_PERFORMANCE (Performance Bonus)
├── January 2026
│   ├── amount: 0.00
│   └── ytd_amount: 0.00
│
├── February 2026
│   ├── amount: 0.00
│   └── ytd_amount: 0.00
│
├── March 2026
│   ├── amount: 0.00
│   └── ytd_amount: 0.00
│
└── April 2026 (Q1 Bonus)
    ├── amount: 50,000.00
    └── ytd_amount: 50,000.00
```

### Fiscal Year Considerations

```
Sri Lankan Fiscal Year Options
═══════════════════════════════

Option 1: Calendar Year (Most Common)
├── Start: January 1
├── End: December 31
└── YTD resets on January 1

Option 2: Financial Year (Government)
├── Start: January 1
├── End: December 31
└── Aligns with government fiscal year

Option 3: Custom Fiscal Year
├── Start: April 1
├── End: March 31
└── Used by some organizations

YTD Calculation must respect fiscal year start
Example: If fiscal year is Apr-Mar:
  March 2026: Last month of FY 2025/2026
  April 2026: First month of FY 2026/2027 (YTD resets)
```

### Amount Validation Rules

```
Validation Rules for Amount Fields
═══════════════════════════════════

Rule 1: Non-negative amounts
✓ amount = 15,000.00
✗ amount = -5,000.00 (INVALID: No negative earnings)

Rule 2: YTD >= Current Amount (in first period)
✓ amount = 15,000.00, ytd_amount = 15,000.00
✗ amount = 15,000.00, ytd_amount = 10,000.00 (INVALID)

Rule 3: YTD Consistency
✓ Previous YTD: 45,000, Current: 15,000, New YTD: 60,000
✗ Previous YTD: 45,000, Current: 15,000, New YTD: 50,000 (INVALID)

Rule 4: Decimal Precision
✓ amount = 15,000.50
✓ amount = 12,345.67
✗ amount = 10,000.567 (INVALID: Max 2 decimal places)
```

### Tax Calculation Usage

```
Using YTD for PAYE Tax Calculation
═══════════════════════════════════

Total Taxable Earnings YTD:
├── BASIC YTD: 600,000.00
├── TRANSPORT YTD: 60,000.00
├── MEDICAL YTD: 40,000.00
└── OVERTIME YTD: 42,700.00
    ─────────────────────────
    Total: 742,700.00

PAYE Tax Calculation (2026 Rates):
├── First 500,000: Tax-free (4%)
│   └── Tax: 0.00
├── Next 242,700 at 8%
│   └── Tax: 19,416.00
└── Total PAYE: 19,416.00

Annual tax / 12 months = 1,618.00 per month
YTD tracking ensures accurate progressive taxation
```

### Component Amount Ranges

| Component | Typical Monthly | Annual Range | YTD Example (Apr) |
|-----------|----------------|--------------|-------------------|
| Basic Salary | 50,000-500,000 | 600,000-6,000,000 | 200,000-2,000,000 |
| Transport | 5,000-50,000 | 60,000-600,000 | 20,000-200,000 |
| Medical | 3,000-25,000 | 36,000-300,000 | 12,000-100,000 |
| Overtime | 0-100,000 | 0-1,200,000 | 0-400,000 |
| Bonus | 0-500,000 | 0-2,000,000 | 0-500,000 |

### Expected Outcome
- Current period amount tracking
- Year-to-date accumulation
- Accurate financial calculations
- Support for tax computations
- Audit trail for earnings

### Verification Checklist
- [ ] amount field added with DecimalField
- [ ] ytd_amount field added
- [ ] max_digits=15, decimal_places=2 set
- [ ] Default values set to 0.00
- [ ] Help text added to both fields
- [ ] Validation method for non-negative amounts
- [ ] YTD calculation method implemented
- [ ] Model docstring updated
- [ ] Fiscal year consideration documented

---

## Task 20: Add Earning Sort Order

### Overview
Add display ordering and highlighting fields to the PayslipEarning model. These fields control how earning components appear on payslips, enabling logical grouping, prioritization, and emphasis of important components like basic salary.

### Dependencies
- Task 19: Add Earning Amount Fields

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Locate PayslipEarning model class

2. **Add display_order field**
   - IntegerField
   - Required field with default=100
   - Lower numbers appear first
   - Allows custom ordering of components

3. **Add is_highlighted field**
   - BooleanField, default=False
   - Marks important components for emphasis
   - Affects PDF rendering (bold, different color)

4. **Update Meta class ordering**
   - Modify ordering to ['display_order', 'component_code']
   - Ensures consistent component display
   - Secondary sort by code for consistency

5. **Add field help text**
   - display_order: "Display order on payslip (lower numbers first)"
   - is_highlighted: "Highlight this component on payslip"

6. **Create display order constants**
   - Define recommended order values
   - DISPLAY_ORDER_BASIC_SALARY = 10
   - DISPLAY_ORDER_ALLOWANCES = 50
   - DISPLAY_ORDER_OVERTIME = 100
   - DISPLAY_ORDER_BONUSES = 150

7. **Update model docstring**
   - Document display_order usage
   - Explain highlighting purpose
   - Note ordering conventions

### Display Order Field Details

```
┌──────────────────────────────────────────────────┐
│        Display Ordering and Highlighting         │
├──────────────────────────────────────────────────┤
│ display_order (IntegerField)                     │
│  • Controls position on payslip                  │
│  • Lower values appear first                     │
│  • Default: 100 (middle range)                   │
│  • Range: 1-999 recommended                      │
│  • Allows 10-point increments                    │
│                                                  │
│ is_highlighted (BooleanField)                    │
│  • Marks component for emphasis                  │
│  • Default: False                                │
│  • Used in PDF rendering                         │
│  • Common for: Basic salary, totals              │
└──────────────────────────────────────────────────┘
```

### Standard Display Order Ranges

```
Display Order Hierarchy
═══════════════════════

Range 1-50: Primary Compensation
├── 10: Basic Salary (BASIC)
├── 15: Salary Arrears (ARREARS)
└── 20: Salary Increments

Range 51-100: Standard Allowances
├── 50: Transport Allowance (TRANSPORT)
├── 55: Medical Allowance (MEDICAL)
├── 60: Meal Allowance (MEAL)
├── 65: Mobile Allowance (MOBILE)
└── 70: Housing Allowance (HOUSING)

Range 101-150: Variable Earnings
├── 100: Weekday Overtime (OT_WEEKDAY)
├── 105: Weekend Overtime (OT_WEEKEND)
├── 110: Holiday Overtime (OT_HOLIDAY)
└── 120: Night Shift Differential

Range 151-200: Incentives & Bonuses
├── 150: Performance Bonus (BONUS_PERFORMANCE)
├── 155: Attendance Bonus (BONUS_ATTENDANCE)
├── 160: Sales Commission (COMMISSION_SALES)
└── 170: Festival Bonus

Range 201-250: Other Earnings
├── 200: Expense Reimbursement
├── 210: Leave Encashment
└── 220: Gratuity Payment
```

### Display Order Examples

#### Example 1: Standard Employee Payslip
```
Earnings Section Display Order
═══════════════════════════════

display_order | Component                | Amount      | Highlighted
───────────────────────────────────────────────────────────────────
10            | Basic Salary             | 150,000.00  | ✓ Yes
50            | Transport Allowance      |  15,000.00  | ✗ No
55            | Medical Allowance        |  10,000.00  | ✗ No
100           | Weekday Overtime         |   8,500.00  | ✗ No
───────────────────────────────────────────────────────────────────
              | Total Earnings           | 183,500.00  | ✓ Yes
```

#### Example 2: Sales Executive Payslip
```
Earnings Section Display Order
═══════════════════════════════

display_order | Component                | Amount      | Highlighted
───────────────────────────────────────────────────────────────────
10            | Basic Salary             | 100,000.00  | ✓ Yes
50            | Transport Allowance      |  25,000.00  | ✗ No
55            | Medical Allowance        |  15,000.00  | ✗ No
65            | Mobile Allowance         |   5,000.00  | ✗ No
150           | Performance Bonus        |  50,000.00  | ✓ Yes
160           | Sales Commission         |  75,000.00  | ✓ Yes
───────────────────────────────────────────────────────────────────
              | Total Earnings           | 270,000.00  | ✓ Yes
```

#### Example 3: Overtime-Heavy Worker
```
Earnings Section Display Order
═══════════════════════════════

display_order | Component                | Amount      | Highlighted
───────────────────────────────────────────────────────────────────
10            | Basic Salary             |  80,000.00  | ✓ Yes
50            | Transport Allowance      |   8,000.00  | ✗ No
100           | Weekday Overtime         |  18,000.00  | ✗ No
105           | Weekend Overtime         |  14,400.00  | ✗ No
110           | Holiday Overtime         |   9,600.00  | ✗ No
───────────────────────────────────────────────────────────────────
              | Total Earnings           | 130,000.00  | ✓ Yes
```

### Highlighting Use Cases

```
Component Highlighting Guidelines
══════════════════════════════════

Always Highlight:
✓ Basic Salary (primary compensation)
✓ Large bonuses (> 20% of gross)
✓ Commission (if significant)
✓ Total Earnings row

Consider Highlighting:
? Performance bonuses
? Arrears payments
? One-time adjustments

Never Highlight:
✗ Small allowances
✗ Standard monthly allowances
✗ Minor reimbursements
```

### PDF Rendering Effects

```
Regular Component (is_highlighted=False)
────────────────────────────────────────
Transport Allowance              15,000.00


Highlighted Component (is_highlighted=True)
───────────────────────────────────────────
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Basic Salary                    150,000.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PDF Styling Options:
├── Bold font weight
├── Different background color (light blue/gray)
├── Thicker separator lines
├── Larger font size
└── Color coding (primary color)
```

### Flexible Ordering Benefits

```
Benefits of Configurable Display Order
═══════════════════════════════════════

1. Logical Grouping
   ├── Group related components together
   ├── Separate fixed from variable pay
   └── Distinguish incentives from base pay

2. Industry Standards
   ├── Follow industry conventions
   ├── Meet regulatory display requirements
   └── Align with employee expectations

3. Company Preferences
   ├── Emphasize important components
   ├── Support company compensation philosophy
   └── Customize per department or role

4. Easy Reordering
   ├── Add new components without code changes
   ├── Adjust based on feedback
   └── Support multiple payslip templates

5. Consistent Display
   ├── Same order across all payslips
   ├── Predictable employee experience
   └── Easier payslip comparison
```

### Component Grouping Strategy

```
Grouping Strategy on Payslip PDF
════════════════════════════════

╔════════════════════════════════════════╗
║            EARNINGS                    ║
╠════════════════════════════════════════╣
║ PRIMARY COMPENSATION                   ║
║ ─────────────────────                  ║
║ Basic Salary           150,000.00      ║ ← is_highlighted=True
║                                        ║
║ ALLOWANCES                             ║
║ ─────────────────────                  ║
║ Transport Allowance     15,000.00      ║
║ Medical Allowance       10,000.00      ║
║ Meal Allowance           5,000.00      ║
║                                        ║
║ OVERTIME & VARIABLE                    ║
║ ─────────────────────                  ║
║ Weekday Overtime        12,000.00      ║
║ Weekend Overtime         9,600.00      ║
║                                        ║
║ INCENTIVES                             ║
║ ─────────────────────                  ║
║ Performance Bonus       25,000.00      ║ ← is_highlighted=True
║                                        ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║ TOTAL EARNINGS         226,600.00      ║ ← is_highlighted=True
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
╚════════════════════════════════════════╝
```

### Expected Outcome
- Configurable component ordering
- Visual emphasis for key components
- Logical grouping on payslips
- Professional payslip presentation
- Flexible display customization

### Verification Checklist
- [ ] display_order field added
- [ ] is_highlighted field added
- [ ] Default values set appropriately
- [ ] Help text added to both fields
- [ ] Meta class ordering updated
- [ ] Display order constants defined
- [ ] Model docstring updated
- [ ] Ordering logic tested

---

## Task 21: Create PayslipDeduction Model

### Overview
Create the PayslipDeduction model to store deduction line items on payslips. This model captures all amounts deducted from an employee's gross pay, including statutory deductions (EPF employee contribution, PAYE tax), loans, advances, and other deductions. The structure mirrors PayslipEarning to maintain consistency.

### Dependencies
- Task 20: Add Earning Sort Order (PayslipEarning complete)
- Payslip model exists
- Django ORM configured

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Add PayslipDeduction after PayslipEarning

2. **Define PayslipDeduction model class**
   - Inherit from Django's Model class
   - Add TimestampMixin if using shared base classes
   - Add comprehensive model docstring

3. **Add payslip foreign key**
   - ForeignKey to Payslip model
   - Use CASCADE on_delete behavior
   - Set related_name='deductions'
   - Creates reverse relationship for accessing deductions

4. **Add model Meta class**
   - Set verbose_name to 'Payslip Deduction'
   - Set verbose_name_plural to 'Payslip Deductions'
   - Add ordering by ['display_order', 'id']
   - Add index on (payslip, display_order)

5. **Add __str__ method**
   - Return format: "component_name - amount"
   - Example: "EPF Employee (8%) - 12,000.00"
   - Include currency formatting

6. **Update models/__init__.py**
   - Import PayslipDeduction
   - Add to __all__ list

### PayslipDeduction Model Structure

```
┌──────────────────────────────────────────────────┐
│          PayslipDeduction Model                  │
├──────────────────────────────────────────────────┤
│ Core Fields:                                     │
│  • payslip (ForeignKey to Payslip)               │
│  • component_code (CharField) [Task 22]          │
│  • component_name (CharField) [Task 22]          │
│  • amount (DecimalField) [Task 23]               │
│  • ytd_amount (DecimalField) [Task 23]           │
│  • display_order (IntegerField) [Task 24]        │
│  • is_highlighted (BooleanField) [Task 24]       │
│                                                  │
│ Inherited from TimestampMixin:                   │
│  • created_at (DateTimeField)                    │
│  • updated_at (DateTimeField)                    │
└──────────────────────────────────────────────────┘
```

### Model Relationships

```
                    Payslip Model
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
  PayslipEarning  PayslipDeduction  EmployerContrib
  (Additions)     (Subtractions)    (Cost Info)
          │              │              │
          │              │              │
    Gross Salary = Total Earnings
          │
          │ minus
          ▼
    Total Deductions
          │
          │ equals
          ▼
    Net Salary (Take-home pay)
```

### Common Deduction Components

| Component Code | Component Name | Typical Amount | Category |
|----------------|----------------|----------------|----------|
| EPF_EMPLOYEE | EPF Employee (8%) | 8% of basic | Statutory |
| PAYE | PAYE Tax | Variable | Statutory |
| ETF_EMPLOYEE | ETF Employee (Rare) | 0% typically | Statutory |
| LOAN_PERSONAL | Personal Loan | Fixed installment | Loan |
| LOAN_FESTIVAL | Festival Loan | Fixed installment | Loan |
| ADVANCE_SALARY | Salary Advance | Variable | Advance |
| INSURANCE | Life Insurance | Fixed premium | Insurance |
| UNION_FEE | Union Membership | Fixed monthly | Membership |
| WELFARE | Welfare Society | Fixed monthly | Membership |
| ABSENCE | Unpaid Leave | Variable | Adjustment |

### Deduction Categories

#### Statutory Deductions (Mandatory)
```
EPF Employee Contribution
├── Rate: 8% of basic salary + allowances
├── Calculation base: Pensionable earnings
├── Monthly contribution
└── Deducted from employee salary

PAYE Tax (Pay As You Earn)
├── Progressive tax rates
├── Based on annual taxable income
├── Monthly deduction from salary
├── Employer remits to IRD
└── Rates (2026 Example):
    ├── 0-500,000: 4% relief
    ├── 500,001-1,000,000: 8%
    ├── 1,000,001-1,500,000: 12%
    └── Above 1,500,000: 16%
```

#### Loan Deductions
```
Personal Loans
├── Fixed monthly installments
├── Interest charged
├── Deducted from salary
└── Until loan repaid

Festival Loans
├── Short-term loans (3-6 months)
├── Low/no interest
├── Advance for festivals
└── Deducted in equal installments

Vehicle/Housing Loans
├── Long-term loans
├── Market interest rates
├── Larger monthly deductions
└── Can span years
```

#### Voluntary Deductions
```
Insurance Premiums
├── Life insurance
├── Health insurance
├── Accidental insurance
└── Paid by employer on behalf

Membership Fees
├── Union membership
├── Professional body fees
├── Welfare society
└── Monthly/annual deductions

Retirement Contributions
├── Voluntary EPF (above 8%)
├── Private pension plans
├── Investment schemes
└── Employee-elected
```

### Deduction Flow Diagram

```
Salary Deduction Process Flow
═════════════════════════════

Gross Salary: 193,750.00
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
   Statutory Deductions          Voluntary Deductions
         │                              │
    ┌────┴────┐                    ┌────┴────┐
    ▼         ▼                    ▼         ▼
EPF (8%)   PAYE Tax            Loans    Insurance
12,000     5,500               5,000    1,500
    │         │                    │         │
    └────┬────┘                    └────┬────┘
         │                              │
         └──────────────┬───────────────┘
                        ▼
              Total Deductions: 24,000.00
                        │
                        ▼
              Net Salary: 169,750.00
              (Take-home pay)
```

### Statutory Deduction Calculations

```
EPF Employee Contribution Calculation
══════════════════════════════════════

Basic Salary: 150,000.00
EPF Rate: 8%
EPF Amount: 150,000 × 0.08 = 12,000.00

Note: Some allowances may be EPF-eligible
If Transport is EPF-eligible (15,000):
  Total Pensionable: 150,000 + 15,000 = 165,000
  EPF Amount: 165,000 × 0.08 = 13,200.00


PAYE Tax Calculation (Annual then Monthly)
═══════════════════════════════════════════

Annual Gross: 2,325,000
Tax-free threshold: 500,000 (with 4% relief)

Taxable Slabs:
├── First 500,000: 0% (4% relief)
├── Next 500,000: 8% = 40,000
├── Next 500,000: 12% = 60,000
├── Remaining 825,000: 16% = 132,000
└── Total Annual Tax: 232,000

Monthly PAYE: 232,000 ÷ 12 = 19,333.33
(This is divided across payslips proportionately)
```

### Expected Outcome
- Functional PayslipDeduction model
- Foreign key relationship to Payslip
- Foundation for deduction line items
- Ready for field additions in subsequent tasks
- Consistent structure with PayslipEarning

### Verification Checklist
- [ ] PayslipDeduction class defined
- [ ] payslip ForeignKey field added
- [ ] related_name='deductions' set
- [ ] CASCADE delete behavior configured
- [ ] Meta class with verbose names
- [ ] Ordering specification added
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 22: Add Deduction Component Name

### Overview
Add component identification fields to the PayslipDeduction model. These fields store the code and display name for each deduction component, maintaining the same structure as PayslipEarning for consistency and enabling accurate reporting, statutory compliance tracking, and multi-language support.

### Dependencies
- Task 21: Create PayslipDeduction Model

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Locate PayslipDeduction model class

2. **Add component_code field**
   - CharField with max_length=20
   - Required field (no blank/null)
   - Uppercase convention (e.g., 'EPF_EMPLOYEE', 'PAYE')
   - System identifier for deduction

3. **Add component_name field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Human-readable display name
   - Example: 'EPF Employee (8%)', 'PAYE Tax'

4. **Update model docstring**
   - Document component identification
   - Note statutory vs. voluntary distinction
   - Explain code naming convention

5. **Update Meta class**
   - Add unique_together constraint (payslip, component_code)
   - Prevents duplicate deductions on same payslip
   - Add database index on component_code

6. **Update __str__ method**
   - Format: "{code}: {name} - {amount}"
   - Example: "EPF_EMPLOYEE: EPF Employee (8%) - 12,000.00"

### Deduction Component Code Naming

```
┌──────────────────────────────────────────────────┐
│      Deduction Component Identification          │
├──────────────────────────────────────────────────┤
│ component_code (CharField, 20)                   │
│  • System identifier                             │
│  • Uppercase convention                          │
│  • Used in calculations and reports              │
│  • Examples: EPF_EMPLOYEE, PAYE, LOAN_PERSONAL   │
│                                                  │
│ component_name (CharField, 100)                  │
│  • Display name for employees                    │
│  • Can include percentages/details               │
│  • Appears on payslip PDF                        │
│  • Examples: EPF Employee (8%), Personal Loan    │
└──────────────────────────────────────────────────┘
```

### Deduction Code Categories

```
Deduction Component Codes by Category
══════════════════════════════════════

┌─ Statutory Deductions (SRI_*)
│  ├── EPF_EMPLOYEE (EPF Employee Contribution)
│  ├── PAYE (Pay As You Earn Tax)
│  └── ETF_EMPLOYEE (ETF Employee - Rare)
│
┌─ Loan Deductions (LOAN_*)
│  ├── LOAN_PERSONAL (Personal Loan Repayment)
│  ├── LOAN_FESTIVAL (Festival Loan)
│  ├── LOAN_VEHICLE (Vehicle Loan)
│  ├── LOAN_HOUSING (Housing Loan)
│  └── LOAN_EDUCATION (Education Loan)
│
┌─ Advance Repayment (ADVANCE_*)
│  ├── ADVANCE_SALARY (Salary Advance)
│  ├── ADVANCE_TRAVEL (Travel Advance)
│  └── ADVANCE_EMERGENCY (Emergency Advance)
│
┌─ Insurance (INSURANCE_*)
│  ├── INSURANCE_LIFE (Life Insurance)
│  ├── INSURANCE_HEALTH (Health Insurance)
│  └── INSURANCE_ACCIDENT (Accidental Insurance)
│
┌─ Membership Fees (FEE_*)
│  ├── FEE_UNION (Union Membership)
│  ├── FEE_WELFARE (Welfare Society)
│  └── FEE_PROFESSIONAL (Professional Body)
│
└─ Adjustments (ADJ_*)
   ├── ADJ_ABSENCE (Unpaid Leave Deduction)
   ├── ADJ_LATE (Late Coming Penalty)
   ├── ADJ_DAMAGE (Damage Recovery)
   └── ADJ_OVERPAYMENT (Previous Overpayment)
```

### Component Name Display Examples

```
Component Names with Contextual Information
════════════════════════════════════════════

Statutory Deductions:
EPF_EMPLOYEE    → "EPF Employee (8%)"
PAYE            → "PAYE Tax"
ETF_EMPLOYEE    → "ETF Employee Contribution"

Loan Repayments:
LOAN_PERSONAL   → "Personal Loan - Apr 2026"
LOAN_FESTIVAL   → "Vesak Festival Loan"
LOAN_VEHICLE    → "Vehicle Loan (#VL-2024-001)"

Advance Recoveries:
ADVANCE_SALARY  → "Salary Advance Recovery"
ADVANCE_TRAVEL  → "Travel Advance Settlement"

Insurance Premiums:
INSURANCE_LIFE  → "Life Insurance Premium"
INSURANCE_HEALTH → "Health Insurance (Family Plan)"

Membership Fees:
FEE_UNION       → "Union Membership Fee"
FEE_WELFARE     → "Welfare Society Contribution"

Adjustments:
ADJ_ABSENCE     → "Unpaid Leave Deduction (2 days)"
ADJ_OVERPAYMENT → "March 2026 Overpayment Recovery"
```

### Multi-Language Support

```
Deduction Component Names - Multi-Language
═══════════════════════════════════════════

Component Code: EPF_EMPLOYEE
├── English: EPF Employee Contribution (8%)
├── Sinhala: රා.අ.අ. සේවක දායකත්වය (8%)
└── Tamil: பி.ச.நி. ஊழியர் பங்களிப்பு (8%)

Component Code: PAYE
├── English: PAYE Tax
├── Sinhala: ආදායම් බද්ද
└── Tamil: வருமான வரி

Component Code: LOAN_PERSONAL
├── English: Personal Loan Repayment
├── Sinhala: පුද්ගලික ණය ආපසු ගෙවීම
└── Tamil: தனிப்பட்ட கடன் திருப்பிச்செலுத்தல்
```

### Statutory Deduction Details

```
Sri Lankan Statutory Deductions (2026)
═══════════════════════════════════════

EPF (Employees' Provident Fund)
────────────────────────────────
Code: EPF_EMPLOYEE
Rate: 8% of pensionable earnings
Base: Basic salary + designated allowances
Employer also contributes: 12%
Managed by: Employees' Provident Fund
Retirement benefit

PAYE (Pay As You Earn)
──────────────────────
Code: PAYE
Rate: Progressive (4%, 8%, 12%, 16%)
Base: Total taxable income
Calculation: Annual then monthly
Managed by: Inland Revenue Department
Income tax collection

ETF (Employees' Trust Fund)
───────────────────────────
Code: ETF_EMPLOYEE
Rate: 0% (Employer pays 3%)
Note: No employee contribution
Managed by: Employees' Trust Fund
Additional retirement benefit
```

### Usage Scenarios

#### Scenario 1: Standard Employee Deductions
```
Employee: Samantha Fernando
Period: April 2026

Deductions:
┌──────────────┬────────────────────────────┬────────────┐
│ Code         │ Component Name             │ Amount     │
├──────────────┼────────────────────────────┼────────────┤
│ EPF_EMPLOYEE │ EPF Employee (8%)          │  12,000.00 │
│ PAYE         │ PAYE Tax                   │   5,500.00 │
│ LOAN_PERSONAL│ Personal Loan              │   5,000.00 │
│ FEE_WELFARE  │ Welfare Society            │     500.00 │
└──────────────┴────────────────────────────┴────────────┘
Total Deductions: 23,000.00
```

#### Scenario 2: Multiple Loan Deductions
```
Employee: Kasun Perera
Period: April 2026

Deductions:
┌──────────────┬────────────────────────────┬────────────┐
│ Code         │ Component Name             │ Amount     │
├──────────────┼────────────────────────────┼────────────┤
│ EPF_EMPLOYEE │ EPF Employee (8%)          │   6,400.00 │
│ PAYE         │ PAYE Tax                   │   2,100.00 │
│ LOAN_FESTIVAL│ Vesak Festival Loan        │   3,000.00 │
│ LOAN_PERSONAL│ Personal Loan              │   8,000.00 │
│ ADVANCE_SAL  │ March Salary Advance       │   5,000.00 │
└──────────────┴────────────────────────────┴────────────┘
Total Deductions: 24,500.00
```

#### Scenario 3: High-Income Employee
```
Employee: Pradeep Silva (Executive)
Period: April 2026

Deductions:
┌──────────────┬────────────────────────────┬────────────┐
│ Code         │ Component Name             │ Amount     │
├──────────────┼────────────────────────────┼────────────┤
│ EPF_EMPLOYEE │ EPF Employee (8%)          │  24,000.00 │
│ PAYE         │ PAYE Tax                   │  35,000.00 │
│ INSURANCE_LF │ Life Insurance Premium     │   5,000.00 │
│ INSURANCE_HL │ Health Insurance (Family)  │   8,000.00 │
│ FEE_PROF     │ Professional Body Fee      │   2,000.00 │
└──────────────┴────────────────────────────┴────────────┘
Total Deductions: 74,000.00
```

### Expected Outcome
- Component identification fields added
- Unique constraint prevents duplicates
- Support for statutory and voluntary deductions
- Multi-language display capability
- Consistent naming convention

### Verification Checklist
- [ ] component_code field added
- [ ] component_name field added
- [ ] Max lengths set appropriately
- [ ] Both fields required (not nullable)
- [ ] unique_together constraint added
- [ ] Database index on component_code
- [ ] __str__ method updated
- [ ] Model docstring updated

---

## Task 23: Add Deduction Amount Fields

### Overview
Add financial amount fields to the PayslipDeduction model. These fields store the current period deduction amount and year-to-date accumulation, enabling accurate tracking of statutory contributions, loan repayments, and other deductions for tax reporting and compliance purposes.

### Dependencies
- Task 22: Add Deduction Component Name

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Locate PayslipDeduction model class

2. **Add amount field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field (no blank/null)
   - Default value: 0.00
   - Current period deduction amount

3. **Add ytd_amount field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field (no blank/null)
   - Default value: 0.00
   - Year-to-date cumulative deduction

4. **Add field help text**
   - amount: "Deduction amount for this pay period"
   - ytd_amount: "Cumulative year-to-date deduction including this period"

5. **Update model docstring**
   - Document amount field purpose
   - Explain YTD tracking for deductions
   - Note statutory reporting requirements

6. **Add validation method**
   - Create clean method to validate amounts
   - Ensure amount >= 0 (no negative deductions)
   - Validate ytd_amount >= amount (in first period)
   - Check deduction doesn't exceed gross pay

7. **Add YTD calculation method**
   - Create calculate_ytd method
   - Query previous payslips in fiscal year
   - Sum deduction amounts + current amount
   - Return calculated YTD total

### Deduction Amount Field Details

```
┌──────────────────────────────────────────────────┐
│      Deduction Financial Amount Fields           │
├──────────────────────────────────────────────────┤
│ amount (DecimalField)                            │
│  • Current pay period deduction                  │
│  • Max digits: 15 (13 integer + 2 decimal)       │
│  • Precision: 2 decimal places                   │
│  • Currency: LKR (Sri Lankan Rupees)             │
│  • Range: 0.00 to 9,999,999,999,999.99          │
│                                                  │
│ ytd_amount (DecimalField)                        │
│  • Year-to-date cumulative deduction             │
│  • Same precision as amount field                │
│  • Includes current period amount                │
│  • Used for tax and statutory reporting          │
│  • Resets at fiscal year start                   │
└──────────────────────────────────────────────────┘
```

### YTD Tracking for Statutory Deductions

```
EPF Employee Contribution YTD Tracking
═══════════════════════════════════════

Employee: Samantha Fernando
Component: EPF_EMPLOYEE
Fiscal Year: 2026 (Jan-Dec)

Month      | Amount    | YTD Amount | Notes
-----------|-----------|------------|------------------
Jan 2026   | 12,000.00 |  12,000.00 | 8% of 150,000
Feb 2026   | 12,000.00 |  24,000.00 | Cumulative
Mar 2026   | 12,000.00 |  36,000.00 | Cumulative
Apr 2026   | 12,000.00 |  48,000.00 | ← Current Period
May 2026   | 12,000.00 |  60,000.00 | Projected
...        | ...       |  ...       |
Dec 2026   | 12,000.00 | 144,000.00 | Annual Total

Annual EPF Employee: 144,000.00
Annual EPF Employer: 216,000.00 (12%)
Total EPF: 360,000.00
```

### PAYE Tax YTD Tracking

```
PAYE Tax YTD Tracking (Progressive)
════════════════════════════════════

Employee: Pradeep Silva
Component: PAYE
Annual Gross: 6,600,000

Month      | Amount    | YTD Amount | Tax Rate Applied
-----------|-----------|------------|------------------
Jan 2026   | 35,000.00 |  35,000.00 | Progressive
Feb 2026   | 35,000.00 |  70,000.00 | Progressive
Mar 2026   | 35,000.00 | 105,000.00 | Progressive
Apr 2026   | 35,000.00 | 140,000.00 | ← Current
...        | ...       | ...        |
Dec 2026   | 35,000.00 | 420,000.00 | Annual Tax

Tax Brackets Applied (Annual):
├── First 500,000: 0% (4% relief)
├── Next 500,000: 8% = 40,000
├── Next 500,000: 12% = 60,000
├── Remaining 5,100,000: 16% = 816,000
└── Total Annual Tax: 916,000

Monthly Deduction: 916,000 ÷ 12 = 76,333.33
(Simplified example shows 35,000 for demonstration)
```

### Loan Repayment YTD Tracking

```
Personal Loan Repayment Tracking
═════════════════════════════════

Employee: Kasun Perera
Loan Amount: 100,000
Term: 20 months
Monthly Payment: 5,000
Start: January 2026

Month      | Amount   | YTD Amount | Balance
-----------|----------|------------|---------
Jan 2026   | 5,000.00 |   5,000.00 |  95,000
Feb 2026   | 5,000.00 |  10,000.00 |  90,000
Mar 2026   | 5,000.00 |  15,000.00 |  85,000
Apr 2026   | 5,000.00 |  20,000.00 |  80,000 ← Current
May 2026   | 5,000.00 |  25,000.00 |  75,000
...        | ...      |  ...       |  ...
Aug 2027   | 5,000.00 | 100,000.00 |      0 (Paid off)
```

### Deduction Amount Examples

#### Example 1: Standard Monthly Deductions
```
Employee: Samantha Fernando
Period: April 2026
Gross Pay: 193,750.00

Deductions:
┌──────────────┬────────────────┬────────────┬────────────┐
│ Component    │ Current Amount │ YTD Amount │ % of Gross │
├──────────────┼────────────────┼────────────┼────────────┤
│ EPF Employee │     12,000.00  │ 48,000.00  │    6.19%   │
│ PAYE Tax     │      5,500.00  │ 22,000.00  │    2.84%   │
│ Personal Loan│      5,000.00  │ 20,000.00  │    2.58%   │
│ Welfare Fee  │        500.00  │  2,000.00  │    0.26%   │
└──────────────┴────────────────┴────────────┴────────────┘
Total: 23,000.00 (11.87% of gross)
Net Pay: 170,750.00
```

#### Example 2: High Deduction Scenario
```
Employee: Nimal Perera
Period: April 2026
Gross Pay: 95,000.00
Multiple Loans

Deductions:
┌──────────────┬────────────────┬────────────┬────────────┐
│ Component    │ Current Amount │ YTD Amount │ % of Gross │
├──────────────┼────────────────┼────────────┼────────────┤
│ EPF Employee │      6,400.00  │ 25,600.00  │    6.74%   │
│ PAYE Tax     │      2,100.00  │  8,400.00  │    2.21%   │
│ Festival Loan│      3,000.00  │ 12,000.00  │    3.16%   │
│ Personal Loan│      8,000.00  │ 32,000.00  │    8.42%   │
│ Salary Adv   │      5,000.00  │  5,000.00  │    5.26%   │
└──────────────┴────────────────┴────────────┴────────────┘
Total: 24,500.00 (25.79% of gross)
Net Pay: 70,500.00
```

### Validation Rules

```
Deduction Amount Validation
════════════════════════════

Rule 1: Non-negative amounts
✓ amount = 12,000.00
✗ amount = -5,000.00 (INVALID: No negative deductions)

Rule 2: YTD >= Current (in first period)
✓ amount = 12,000.00, ytd_amount = 12,000.00
✗ amount = 12,000.00, ytd_amount = 10,000.00 (INVALID)

Rule 3: Total deductions <= Gross pay
✓ Gross: 150,000, Total Deductions: 25,000 (16.7%)
✗ Gross: 50,000, Total Deductions: 60,000 (120%) (INVALID)
⚠ Warning threshold: Deductions > 40% of gross

Rule 4: Statutory percentages accurate
✓ EPF: 8% of 150,000 = 12,000.00
✗ EPF: 8% of 150,000 = 15,000.00 (INVALID: Incorrect calculation)

Rule 5: YTD Consistency
✓ Mar YTD: 36,000, Apr Current: 12,000, Apr YTD: 48,000
✗ Mar YTD: 36,000, Apr Current: 12,000, Apr YTD: 40,000 (INVALID)
```

### Statutory Compliance Reporting

```
Year-End Statutory Reports Using YTD
═════════════════════════════════════

EPF/ETF Annual Statement (Form 3A)
───────────────────────────────────
Employee: Each employee
Period: Calendar year 2026

Employee EPF YTD:     144,000.00 (8%)
Employer EPF YTD:     216,000.00 (12%)
Employer ETF YTD:      54,000.00 (3%)
Total Contributions:  414,000.00

PAYE Annual Tax Certificate
────────────────────────────
Employee: Samantha Fernando
Period: Tax year 2026

Total Taxable Income:   2,325,000.00
Total PAYE Deducted:      232,000.00
Net Income:             2,093,000.00

This data comes from YTD tracking in payslips.
```

### Expected Outcome
- Current period deduction tracking
- Year-to-date accumulation
- Accurate statutory reporting data
- Loan repayment monitoring
- Compliance with labor regulations

### Verification Checklist
- [ ] amount field added with DecimalField
- [ ] ytd_amount field added
- [ ] max_digits=15, decimal_places=2 set
- [ ] Default values set to 0.00
- [ ] Help text added to both fields
- [ ] Validation method for amounts
- [ ] YTD calculation method implemented
- [ ] Gross pay validation check
- [ ] Model docstring updated

---

## Task 24: Add Deduction Sort Order

### Overview
Add display ordering and highlighting fields to the PayslipDeduction model. These fields control the presentation sequence of deductions on payslips, ensuring statutory deductions appear first, followed by loans and other deductions in a logical, consistent manner.

### Dependencies
- Task 23: Add Deduction Amount Fields

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Locate PayslipDeduction model class

2. **Add display_order field**
   - IntegerField
   - Required field with default=100
   - Lower numbers appear first
   - Ensures statutory deductions listed first

3. **Add is_highlighted field**
   - BooleanField, default=False
   - Marks important deductions for emphasis
   - Typically used for large deductions

4. **Update Meta class ordering**
   - Modify ordering to ['display_order', 'component_code']
   - Ensures consistent deduction display
   - Secondary sort by code for consistency

5. **Add field help text**
   - display_order: "Display order on payslip (lower numbers first)"
   - is_highlighted: "Highlight this deduction on payslip"

6. **Create display order constants**
   - Define recommended order values
   - DISPLAY_ORDER_EPF = 10
   - DISPLAY_ORDER_PAYE = 20
   - DISPLAY_ORDER_LOANS = 50
   - DISPLAY_ORDER_OTHER = 100

7. **Update model docstring**
   - Document display ordering logic
   - Explain statutory deduction priority
   - Note highlighting conventions

### Deduction Display Order Ranges

```
Display Order Hierarchy for Deductions
═══════════════════════════════════════

Range 1-50: Statutory Deductions (Priority)
├── 10: EPF Employee Contribution
├── 15: ETF Employee (if applicable)
└── 20: PAYE Tax

Range 51-100: Loan Repayments
├── 50: Personal Loan
├── 55: Festival Loan
├── 60: Vehicle Loan
├── 65: Housing Loan
└── 70: Education Loan

Range 101-150: Advance Recoveries
├── 100: Salary Advance
├── 105: Travel Advance
└── 110: Emergency Advance

Range 151-200: Insurance & Memberships
├── 150: Life Insurance
├── 155: Health Insurance
├── 160: Accidental Insurance
├── 170: Union Membership
└── 175: Welfare Society

Range 201-250: Adjustments & Penalties
├── 200: Unpaid Leave Deduction
├── 205: Late Coming Penalty
├── 210: Damage Recovery
└── 220: Previous Overpayment
```

### Deduction Display Examples

#### Example 1: Standard Employee Deductions
```
Deductions Section Display Order
═════════════════════════════════

display_order | Component                  | Amount     | Highlighted
───────────────────────────────────────────────────────────────────────
10            | EPF Employee (8%)          | 12,000.00  | ✓ Yes
20            | PAYE Tax                   |  5,500.00  | ✓ Yes
50            | Personal Loan              |  5,000.00  | ✗ No
175           | Welfare Society            |    500.00  | ✗ No
───────────────────────────────────────────────────────────────────────
              | Total Deductions           | 23,000.00  | ✓ Yes
```

#### Example 2: Multiple Loan Deductions
```
Deductions Section Display Order
═════════════════════════════════

display_order | Component                  | Amount     | Highlighted
───────────────────────────────────────────────────────────────────────
10            | EPF Employee (8%)          |  6,400.00  | ✓ Yes
20            | PAYE Tax                   |  2,100.00  | ✓ Yes
50            | Personal Loan              |  8,000.00  | ✓ Yes (Large)
55            | Festival Loan              |  3,000.00  | ✗ No
100           | Salary Advance Recovery    |  5,000.00  | ✗ No
───────────────────────────────────────────────────────────────────────
              | Total Deductions           | 24,500.00  | ✓ Yes
```

#### Example 3: Executive with Insurance
```
Deductions Section Display Order
═════════════════════════════════

display_order | Component                  | Amount     | Highlighted
───────────────────────────────────────────────────────────────────────
10            | EPF Employee (8%)          | 24,000.00  | ✓ Yes
20            | PAYE Tax                   | 35,000.00  | ✓ Yes
150           | Life Insurance Premium     |  5,000.00  | ✗ No
155           | Health Insurance (Family)  |  8,000.00  | ✗ No
170           | Professional Body Fee      |  2,000.00  | ✗ No
───────────────────────────────────────────────────────────────────────
              | Total Deductions           | 74,000.00  | ✓ Yes
```

### Deduction Highlighting Guidelines

```
When to Highlight Deductions
════════════════════════════

Always Highlight:
✓ EPF Employee Contribution (Statutory)
✓ PAYE Tax (Statutory)
✓ Large deductions (> 10% of gross)
✓ Total Deductions row

Consider Highlighting:
? Deductions > LKR 10,000
? New deductions (first month)
? Final loan payment
? Unusual adjustments

Never Highlight:
✗ Small membership fees
✗ Standard monthly fees
✗ Minor adjustments (< LKR 1,000)
```

### PDF Rendering Effects

```
Statutory Deduction (is_highlighted=True)
──────────────────────────────────────────
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPF Employee (8%)                12,000.00
PAYE Tax                          5,500.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


Regular Deduction (is_highlighted=False)
─────────────────────────────────────────
Personal Loan                     5,000.00
Welfare Society                     500.00


PDF Styling for Highlighted Deductions:
├── Bold font weight
├── Light background color (pale yellow/gray)
├── Slightly larger font
└── May include icon or marker
```

### Statutory Deduction Priority Logic

```
Why Statutory Deductions Come First
════════════════════════════════════

Rationale:
1. Legal Compliance
   ├── EPF/ETF are mandatory by law
   ├── PAYE is tax obligation
   └── Must be clearly visible

2. Employee Understanding
   ├── Shows mandatory deductions separately
   ├── Distinguishes from voluntary deductions
   └── Improves transparency

3. Audit Trail
   ├── Easier to verify statutory compliance
   ├── Supports government inspections
   └── Simplifies annual reporting

Display Order:
┌────────────────────────────────┐
│ DEDUCTIONS                     │
├────────────────────────────────┤
│ Statutory (Always First)       │
│  ├── EPF Employee              │
│  └── PAYE Tax                  │
│                                │
│ Loans (Second Priority)        │
│  ├── Personal Loan             │
│  └── Festival Loan             │
│                                │
│ Other (Last)                   │
│  ├── Insurance                 │
│  └── Memberships               │
└────────────────────────────────┘
```

### Grouping Strategy on Payslip PDF

```
╔════════════════════════════════════════╗
║            DEDUCTIONS                  ║
╠════════════════════════════════════════╣
║ STATUTORY DEDUCTIONS                   ║
║ ─────────────────────                  ║
║ EPF Employee (8%)       12,000.00      ║ ← is_highlighted=True
║ PAYE Tax                 5,500.00      ║ ← is_highlighted=True
║                                        ║
║ LOAN REPAYMENTS                        ║
║ ─────────────────────                  ║
║ Personal Loan            5,000.00      ║
║ Festival Loan            3,000.00      ║
║                                        ║
║ INSURANCE & MEMBERSHIPS                ║
║ ─────────────────────                  ║
║ Life Insurance           2,500.00      ║
║ Welfare Society            500.00      ║
║                                        ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║ TOTAL DEDUCTIONS        28,500.00      ║ ← is_highlighted=True
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
╚════════════════════════════════════════╝
```

### Expected Outcome
- Logical deduction ordering
- Statutory deductions prioritized
- Visual emphasis for key deductions
- Professional payslip presentation
- Consistent display across payslips

### Verification Checklist
- [ ] display_order field added
- [ ] is_highlighted field added
- [ ] Default values set appropriately
- [ ] Help text added to both fields
- [ ] Meta class ordering updated
- [ ] Display order constants defined
- [ ] Model docstring updated
- [ ] Statutory priority documented

---

## Task 25: Create PayslipEmployerContribution Model

### Overview
Create the PayslipEmployerContribution model to store employer-side contributions that don't deduct from employee salary but represent additional costs to the company. In Sri Lanka, this primarily includes EPF employer contribution (12%) and ETF (3%), which are crucial for understanding total cost to company and statutory compliance.

### Dependencies
- Task 24: Add Deduction Sort Order (PayslipDeduction complete)
- Payslip model exists
- Django ORM configured

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Add PayslipEmployerContribution after PayslipDeduction

2. **Define PayslipEmployerContribution model class**
   - Inherit from Django's Model class
   - Add TimestampMixin if using shared base classes
   - Add comprehensive model docstring

3. **Add payslip foreign key**
   - ForeignKey to Payslip model
   - Use CASCADE on_delete behavior
   - Set related_name='employer_contributions'
   - Creates reverse relationship

4. **Add model Meta class**
   - Set verbose_name to 'Payslip Employer Contribution'
   - Set verbose_name_plural to 'Payslip Employer Contributions'
   - Add ordering by ['display_order', 'id']
   - Add index on (payslip, display_order)

5. **Add __str__ method**
   - Return format: "component_name - amount"
   - Example: "EPF Employer (12%) - 18,000.00"
   - Include currency formatting

6. **Update models/__init__.py**
   - Import PayslipEmployerContribution
   - Add to __all__ list

### PayslipEmployerContribution Model Structure

```
┌──────────────────────────────────────────────────┐
│    PayslipEmployerContribution Model             │
├──────────────────────────────────────────────────┤
│ Core Fields:                                     │
│  • payslip (ForeignKey to Payslip)               │
│  • component_code (CharField) [Task 26]          │
│  • component_name (CharField) [Task 26]          │
│  • amount (DecimalField) [Task 26]               │
│  • ytd_amount (DecimalField) [Task 26]           │
│  • display_order (IntegerField) [Task 26]        │
│                                                  │
│ Inherited from TimestampMixin:                   │
│  • created_at (DateTimeField)                    │
│  • updated_at (DateTimeField)                    │
└──────────────────────────────────────────────────┘
```

### Model Purpose & Relationships

```
                    Payslip Model
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
  PayslipEarning  PayslipDeduction  EmployerContribution
  (Employee Gets) (Employee Pays)   (Employer Pays)
          │              │              │
    ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
    │           │  │           │  │           │
  Earnings    Total  EPF       PAYE  EPF       ETF
  Components  Gross  Employee  Tax   Employer
    │           │    │         │     │         │
    │           │    │         │     │         │
    └───────┬───┘    └────┬────┘     └────┬────┘
            │             │               │
            ▼             ▼               ▼
      Gross Salary  Net Salary    Total Cost to
      193,750       169,750       Company
                                  216,250
```

### Sri Lankan Employer Statutory Contributions

```
Employer Statutory Contributions (2026)
════════════════════════════════════════

EPF Employer Contribution
─────────────────────────
Rate: 12% of pensionable earnings
Base: Basic salary + designated allowances
Benefit: Employee retirement fund
Payable to: Employees' Provident Fund
Frequency: Monthly
Due date: 15th of following month

Example:
Basic Salary: 150,000
EPF Employer: 150,000 × 0.12 = 18,000


ETF (Employees' Trust Fund)
───────────────────────────
Rate: 3% of pensionable earnings
Base: Same as EPF base
Benefit: Additional retirement fund
Payable to: Employees' Trust Fund
Frequency: Monthly
Due date: 15th of following month

Example:
Basic Salary: 150,000
ETF Employer: 150,000 × 0.03 = 4,500


Total Employer Cost:
────────────────────
Employee Gross: 150,000
EPF Employer:    18,000 (12%)
ETF:              4,500 (3%)
─────────────────────────
Total Cost:     172,500 (115% of gross)
```

### Employer Contribution Components

| Component Code | Component Name | Rate | Base Calculation |
|----------------|----------------|------|------------------|
| EPF_EMPLOYER | EPF Employer (12%) | 12% | Pensionable earnings |
| ETF_EMPLOYER | ETF (3%) | 3% | Pensionable earnings |
| INSURANCE_EMPLOYER | Group Insurance | Fixed | Per employee |
| MEDICAL_EMPLOYER | Medical Scheme | Varies | Company policy |
| TRAINING_LEVY | Training Levy | Rare | Special industries |

### Total Cost to Company Calculation

```
Total Cost to Company (CTC) Breakdown
══════════════════════════════════════

Employee: Samantha Fernando
Period: April 2026

Employee Earnings:
├── Basic Salary           150,000.00
├── Transport Allowance     15,000.00
├── Medical Allowance       10,000.00
├── Overtime Pay            18,750.00
└── Total Gross Pay:       193,750.00

Employee Deductions:
├── EPF Employee (8%)      -12,000.00
├── PAYE Tax                -5,500.00
├── Personal Loan           -5,000.00
└── Total Deductions:      -22,500.00

Net Salary to Employee:    171,250.00

Employer Contributions:
├── EPF Employer (12%)      18,000.00
├── ETF (3%)                 4,500.00
└── Total Employer Cost:    22,500.00

═════════════════════════════════════
Total Cost to Company:     216,250.00
═════════════════════════════════════

CTC = Gross Pay + Employer Contributions
CTC = 193,750 + 22,500 = 216,250
```

### Why Track Employer Contributions

```
Business Reasons for Tracking
══════════════════════════════

1. Financial Planning
   ├── Accurate cost forecasting
   ├── Budget allocation
   └── Department cost analysis

2. Statutory Compliance
   ├── Monthly EPF/ETF remittances
   ├── Annual Form 3A submissions
   └── Audit trail for inspections

3. Cost Analysis
   ├── True cost per employee
   ├── Department profitability
   └── Hiring decision support

4. Employee Communication
   ├── Show total investment
   ├── Demonstrate value
   └── Optional display on payslip

5. Accounting Integration
   ├── Journal entries
   ├── Cost center allocation
   └── Financial statements
```

### Display on Payslip (Optional)

```
Some companies show employer contributions on payslips
to demonstrate total compensation value:

╔════════════════════════════════════════╗
║         SALARY SUMMARY                 ║
╠════════════════════════════════════════╣
║ Gross Earnings         193,750.00      ║
║ Less: Deductions        22,500.00      ║
║ ─────────────────────────────────      ║
║ Net Salary             171,250.00      ║
║                                        ║
║ EMPLOYER CONTRIBUTIONS (Info Only)     ║
║ ─────────────────────────────────      ║
║ EPF Employer (12%)      18,000.00      ║
║ ETF (3%)                 4,500.00      ║
║ ─────────────────────────────────      ║
║ Total Employer Cost     22,500.00      ║
║                                        ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║ TOTAL COST TO COMPANY  216,250.00      ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
╚════════════════════════════════════════╝

Note: Displaying this is configurable via
PayslipTemplate.show_employer_contributions
```

### Expected Outcome
- Functional PayslipEmployerContribution model
- Foreign key relationship to Payslip
- Foundation for employer cost tracking
- Support for statutory compliance
- Ready for field additions in Task 26

### Verification Checklist
- [ ] PayslipEmployerContribution class defined
- [ ] payslip ForeignKey field added
- [ ] related_name='employer_contributions' set
- [ ] CASCADE delete behavior configured
- [ ] Meta class with verbose names
- [ ] Ordering specification added
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 26: Add Employer Contribution Fields

### Overview
Add all necessary fields to the PayslipEmployerContribution model, including component identification, amounts, YTD tracking, and display ordering. These fields enable complete tracking of employer-side costs for statutory compliance, financial reporting, and optional display on employee payslips.

### Dependencies
- Task 25: Create PayslipEmployerContribution Model

### Instructions

1. **Open payslip_line.py model file**
   - Continue in `apps/payslip/models/payslip_line.py`
   - Locate PayslipEmployerContribution model class

2. **Add component_code field**
   - CharField with max_length=20
   - Required field (no blank/null)
   - Uppercase convention (e.g., 'EPF_EMPLOYER', 'ETF_EMPLOYER')

3. **Add component_name field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Example: 'EPF Employer (12%)', 'ETF (3%)'

4. **Add amount field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field, default=0.00
   - Current period employer contribution

5. **Add ytd_amount field**
   - DecimalField with max_digits=15, decimal_places=2
   - Required field, default=0.00
   - Year-to-date cumulative contribution

6. **Add display_order field**
   - IntegerField with default=100
   - Controls display sequence
   - EPF employer typically first (10), ETF second (20)

7. **Add field help text**
   - component_code: "System identifier for contribution"
   - component_name: "Display name for contribution"
   - amount: "Employer contribution for this period"
   - ytd_amount: "Cumulative YTD employer contribution"
   - display_order: "Display order on payslip"

8. **Update Meta class**
   - Add unique_together constraint (payslip, component_code)
   - Add database index on component_code
   - Update ordering to ['display_order', 'component_code']

9. **Update __str__ method**
   - Format: "{code}: {name} - {amount}"
   - Example: "EPF_EMPLOYER: EPF Employer (12%) - 18,000.00"

10. **Update model docstring**
    - Document all fields
    - Explain statutory contribution requirements
    - Note optional payslip display

### Complete Field Structure

```
┌──────────────────────────────────────────────────┐
│    PayslipEmployerContribution Fields            │
├──────────────────────────────────────────────────┤
│ Identification:                                  │
│  • component_code (CharField, 20)                │
│  • component_name (CharField, 100)               │
│                                                  │
│ Financial:                                       │
│  • amount (DecimalField, 15.2)                   │
│  • ytd_amount (DecimalField, 15.2)               │
│                                                  │
│ Display:                                         │
│  • display_order (IntegerField)                  │
│                                                  │
│ Relationships:                                   │
│  • payslip (ForeignKey)                          │
│                                                  │
│ Timestamps:                                      │
│  • created_at (Auto)                             │
│  • updated_at (Auto)                             │
└──────────────────────────────────────────────────┘
```

### Standard Employer Contribution Components

```
Component Codes and Details
════════════════════════════

EPF_EMPLOYER (Primary)
├── Code: EPF_EMPLOYER
├── Name: EPF Employer Contribution (12%)
├── Rate: 12% of pensionable earnings
├── Display Order: 10
└── Example: 150,000 × 0.12 = 18,000

ETF_EMPLOYER (Primary)
├── Code: ETF_EMPLOYER
├── Name: ETF Contribution (3%)
├── Rate: 3% of pensionable earnings
├── Display Order: 20
└── Example: 150,000 × 0.03 = 4,500

INSURANCE_GROUP (Optional)
├── Code: INSURANCE_GROUP
├── Name: Group Life Insurance
├── Rate: Fixed per employee
├── Display Order: 50
└── Example: Fixed 2,000 per month

MEDICAL_SCHEME (Optional)
├── Code: MEDICAL_SCHEME
├── Name: Medical Insurance Scheme
├── Rate: Varies by coverage
├── Display Order: 60
└── Example: 5,000 per month per employee
```

### YTD Tracking for Employer Contributions

```
EPF Employer Contribution YTD
══════════════════════════════

Employee: Samantha Fernando
Component: EPF_EMPLOYER
Base: 150,000 (Basic Salary)
Rate: 12%

Month      | Amount    | YTD Amount
-----------|-----------|------------
Jan 2026   | 18,000.00 |  18,000.00
Feb 2026   | 18,000.00 |  36,000.00
Mar 2026   | 18,000.00 |  54,000.00
Apr 2026   | 18,000.00 |  72,000.00 ← Current
...        | ...       |  ...
Dec 2026   | 18,000.00 | 216,000.00 ← Year Total

Annual EPF Employer: 216,000
Annual EPF Employee:  96,000 (8%)
Total EPF Fund:      312,000
```

### Employer Contribution Examples

#### Example 1: Standard Employee
```
Employee: Samantha Fernando
Period: April 2026
Basic Salary: 150,000

Employer Contributions:
┌──────────────┬────────────────────────┬────────────┬────────────┐
│ Code         │ Component Name         │ Amount     │ YTD Amount │
├──────────────┼────────────────────────┼────────────┼────────────┤
│ EPF_EMPLOYER │ EPF Employer (12%)     │ 18,000.00  │ 72,000.00  │
│ ETF_EMPLOYER │ ETF (3%)               │  4,500.00  │ 18,000.00  │
└──────────────┴────────────────────────┴────────────┴────────────┘
Total Employer Contributions: 22,500.00
Total Cost to Company: 216,250.00
```

#### Example 2: Senior Employee with Benefits
```
Employee: Pradeep Silva
Period: April 2026
Basic Salary: 300,000

Employer Contributions:
┌──────────────┬────────────────────────┬────────────┬────────────┐
│ Code         │ Component Name         │ Amount     │ YTD Amount │
├──────────────┼────────────────────────┼────────────┼────────────┤
│ EPF_EMPLOYER │ EPF Employer (12%)     │ 36,000.00  │144,000.00  │
│ ETF_EMPLOYER │ ETF (3%)               │  9,000.00  │ 36,000.00  │
│ INSURANCE_GR │ Group Life Insurance   │  5,000.00  │ 20,000.00  │
│ MEDICAL_SCH  │ Medical Scheme (Family)│ 12,000.00  │ 48,000.00  │
└──────────────┴────────────────────────┴────────────┴────────────┘
Total Employer Contributions: 62,000.00
Total Cost to Company: 617,000.00
```

### Statutory Compliance Reporting

```
Annual EPF/ETF Reporting (Form 3A)
═══════════════════════════════════

Employee: Each employee in company
Period: Calendar year 2026

Data Required:
├── Total Pensionable Earnings: 1,800,000
├── EPF Employee (8%):           144,000
├── EPF Employer (12%):          216,000
├── ETF Employer (3%):            54,000
└── Total Contributions:         414,000

This data comes from YTD amounts in:
- PayslipEarning (for pensionable earnings)
- PayslipDeduction (for EPF employee)
- PayslipEmployerContribution (for EPF/ETF employer)

Monthly Remittance:
Due by 15th of following month
Example: April 2026 contributions due by May 15, 2026
```

### Total Cost Analysis

```
Department Cost Analysis Example
═════════════════════════════════

Department: Sales
Employees: 10
Period: April 2026

Employee Salaries:
├── Total Gross Salaries:     1,500,000.00
└── Total Net Salaries:       1,200,000.00

Employer Contributions:
├── Total EPF Employer:         180,000.00
├── Total ETF:                   45,000.00
├── Group Insurance:             20,000.00
└── Total Contributions:        245,000.00

════════════════════════════════════════
Total Department Cost:        1,745,000.00
════════════════════════════════════════

Cost per Employee Avg:          174,500.00
Employer Contribution %:            16.3%
```

### Display Order for Employer Contributions

```
Employer Contributions Section
═══════════════════════════════

display_order | Component                | Amount
───────────────────────────────────────────────────
10            | EPF Employer (12%)       | 18,000.00
20            | ETF (3%)                 |  4,500.00
50            | Group Life Insurance     |  2,000.00
60            | Medical Scheme           |  5,000.00
───────────────────────────────────────────────────
              | Total Employer Cost      | 29,500.00
              | Total Cost to Company    | 223,250.00
```

### Expected Outcome
- Complete PayslipEmployerContribution model
- Component identification fields
- Financial amount and YTD tracking
- Display ordering capability
- Support for statutory compliance
- Optional payslip display
- Total cost to company calculation

### Verification Checklist
- [ ] component_code field added
- [ ] component_name field added
- [ ] amount field added with DecimalField
- [ ] ytd_amount field added
- [ ] display_order field added
- [ ] All fields have appropriate defaults
- [ ] Help text added to all fields
- [ ] unique_together constraint added
- [ ] Database index on component_code
- [ ] Meta class ordering updated
- [ ] __str__ method updated
- [ ] Model docstring complete

---

## Task 27: Run Line Item Migrations

### Overview
Generate and apply Django migrations for all three line item models (PayslipEarning, PayslipDeduction, PayslipEmployerContribution). This task creates the database schema for storing salary component details, completing the foundation for payslip PDF generation.

### Dependencies
- Task 26: Add Employer Contribution Fields (all models complete)
- PayslipEarning model finalized
- PayslipDeduction model finalized
- PayslipEmployerContribution model finalized
- Django migrations system configured

### Instructions

1. **Review model definitions**
   - Open `apps/payslip/models/payslip_line.py`
   - Verify all three models are complete
   - Check field definitions and constraints
   - Ensure models imported in `__init__.py`

2. **Generate migration file**
   - Run command: `python manage.py makemigrations payslip`
   - Migration should detect three new models
   - Review generated migration file
   - Check for correct field types and constraints

3. **Review migration file**
   - Open generated migration in `apps/payslip/migrations/`
   - Typical name: `0002_payslip_line_items.py`
   - Verify CreateModel operations for all three models
   - Check foreign key relationships
   - Verify unique_together constraints
   - Check database indexes

4. **Apply migration**
   - Run command: `python manage.py migrate payslip`
   - Verify successful table creation
   - Check for any migration errors

5. **Verify database schema**
   - Connect to database
   - Verify tables created:
     - `payslip_payslipearning`
     - `payslip_payslipdeduction`
     - `payslip_payslipemployercontribution`
   - Check column definitions
   - Verify foreign key constraints
   - Verify indexes created

6. **Test model operations**
   - Open Django shell
   - Import models
   - Test creating instances
   - Test querying with relationships
   - Verify constraints work

### Expected Migration File Structure

```
Migration File: 0002_payslip_line_items.py
══════════════════════════════════════════

Dependencies:
├── ('payslip', '0001_initial')  # Previous migration
└── ('tenant', '0001_initial')   # If using TenantAwareMixin

Operations:
├── CreateModel: PayslipEarning
│   ├── Fields: 12 fields total
│   ├── Foreign Key: payslip
│   ├── Indexes: (payslip, display_order)
│   └── Unique Together: (payslip, component_code)
│
├── CreateModel: PayslipDeduction
│   ├── Fields: 12 fields total
│   ├── Foreign Key: payslip
│   ├── Indexes: (payslip, display_order)
│   └── Unique Together: (payslip, component_code)
│
└── CreateModel: PayslipEmployerContribution
    ├── Fields: 11 fields total
    ├── Foreign Key: payslip
    ├── Indexes: (payslip, display_order)
    └── Unique Together: (payslip, component_code)
```

### Database Tables Created

```
Table: payslip_payslipearning
═══════════════════════════════════════

Columns:
├── id (BigAutoField, PK)
├── payslip_id (BigInteger, FK)
├── component_code (VARCHAR 20)
├── component_name (VARCHAR 100)
├── amount (DECIMAL 15,2)
├── ytd_amount (DECIMAL 15,2)
├── display_order (INTEGER)
├── is_highlighted (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Indexes:
├── PRIMARY KEY (id)
├── FOREIGN KEY (payslip_id)
├── INDEX (payslip_id, display_order)
└── UNIQUE (payslip_id, component_code)


Table: payslip_payslipdeduction
════════════════════════════════════════

Columns:
├── id (BigAutoField, PK)
├── payslip_id (BigInteger, FK)
├── component_code (VARCHAR 20)
├── component_name (VARCHAR 100)
├── amount (DECIMAL 15,2)
├── ytd_amount (DECIMAL 15,2)
├── display_order (INTEGER)
├── is_highlighted (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Indexes:
├── PRIMARY KEY (id)
├── FOREIGN KEY (payslip_id)
├── INDEX (payslip_id, display_order)
└── UNIQUE (payslip_id, component_code)


Table: payslip_payslipemployercontribution
═══════════════════════════════════════════

Columns:
├── id (BigAutoField, PK)
├── payslip_id (BigInteger, FK)
├── component_code (VARCHAR 20)
├── component_name (VARCHAR 100)
├── amount (DECIMAL 15,2)
├── ytd_amount (DECIMAL 15,2)
├── display_order (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Indexes:
├── PRIMARY KEY (id)
├── FOREIGN KEY (payslip_id)
├── INDEX (payslip_id, display_order)
└── UNIQUE (payslip_id, component_code)
```

### Testing Model Operations

```
Django Shell Testing
════════════════════

# Import models
from apps.payslip.models import Payslip, PayslipEarning, PayslipDeduction, PayslipEmployerContribution

# Get or create a payslip
payslip = Payslip.objects.first()

# Create earning
earning = PayslipEarning.objects.create(
    payslip=payslip,
    component_code='BASIC',
    component_name='Basic Salary',
    amount=150000.00,
    ytd_amount=600000.00,
    display_order=10,
    is_highlighted=True
)

# Create deduction
deduction = PayslipDeduction.objects.create(
    payslip=payslip,
    component_code='EPF_EMPLOYEE',
    component_name='EPF Employee (8%)',
    amount=12000.00,
    ytd_amount=48000.00,
    display_order=10,
    is_highlighted=True
)

# Create employer contribution
contribution = PayslipEmployerContribution.objects.create(
    payslip=payslip,
    component_code='EPF_EMPLOYER',
    component_name='EPF Employer (12%)',
    amount=18000.00,
    ytd_amount=72000.00,
    display_order=10
)

# Query using relationships
all_earnings = payslip.earnings.all()
all_deductions = payslip.deductions.all()
all_contributions = payslip.employer_contributions.all()

# Test ordering
ordered_earnings = payslip.earnings.order_by('display_order')

# Test unique constraint (should fail)
duplicate = PayslipEarning.objects.create(
    payslip=payslip,
    component_code='BASIC',  # Duplicate code
    component_name='Test',
    amount=1000.00
)  # Should raise IntegrityError
```

### Migration Commands Reference

```
Django Migration Commands
═════════════════════════

Generate migration:
$ python manage.py makemigrations payslip

Apply migration:
$ python manage.py migrate payslip

View migration SQL:
$ python manage.py sqlmigrate payslip 0002

Show migration status:
$ python manage.py showmigrations payslip

Rollback migration (if needed):
$ python manage.py migrate payslip 0001
```

### Expected Outcome
- Three new database tables created
- Foreign key relationships established
- Unique constraints enforced
- Indexes created for performance
- Models ready for data storage
- Foundation complete for PDF generation

### Verification Checklist
- [ ] Migration file generated successfully
- [ ] Migration file reviewed
- [ ] All three models in migration
- [ ] Foreign keys correctly defined
- [ ] Unique constraints included
- [ ] Indexes specified
- [ ] Migration applied without errors
- [ ] Database tables created
- [ ] Model instances can be created
- [ ] Relationships work correctly
- [ ] Unique constraints enforced
- [ ] Ordering works as expected

---

## Summary

This document established the line item models for payslip generation:

### Completed Models
- ✅ PayslipEarning model with component tracking
- ✅ PayslipDeduction model with statutory support
- ✅ PayslipEmployerContribution model for cost tracking
- ✅ All models include YTD tracking
- ✅ Display ordering and highlighting
- ✅ Database migrations applied

### Key Achievements
1. **Earnings Model** - Tracks all income components (basic, allowances, overtime, bonuses)
2. **Deductions Model** - Handles statutory and voluntary deductions with YTD
3. **Employer Contributions** - Captures EPF/ETF and other employer costs
4. **YTD Tracking** - Accurate year-to-date accumulation for tax and compliance
5. **Display Control** - Flexible ordering and highlighting for professional payslips
6. **Statutory Compliance** - Support for Sri Lankan labor law requirements

### Data Flow Summary
```
Payslip Generation Flow
═══════════════════════

1. Calculate Earnings
   ├── Basic Salary
   ├── Allowances
   ├── Overtime
   └── Bonuses
   
2. Calculate Deductions
   ├── EPF Employee (8%)
   ├── PAYE Tax
   ├── Loans
   └── Other

3. Calculate Employer Costs
   ├── EPF Employer (12%)
   ├── ETF (3%)
   └── Other benefits

4. Store Line Items
   ├── PayslipEarning records
   ├── PayslipDeduction records
   └── PayslipEmployerContribution records

5. Generate PDF
   └── Use line items to render payslip
```

### Next Steps
Proceed to [02_Tasks-28-32_Template-Model.md](02_Tasks-28-32_Template-Model.md) to implement the PayslipTemplate model for customizing payslip appearance, company details, and PDF styling options.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 11  
**Total Lines:** ~950
