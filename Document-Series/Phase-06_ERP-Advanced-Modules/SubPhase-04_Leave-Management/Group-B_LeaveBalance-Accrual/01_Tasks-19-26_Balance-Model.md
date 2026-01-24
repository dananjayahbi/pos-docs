# Tasks 19-26: LeaveBalance Model & Migrations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** B - Leave Balance & Accrual  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Accrual-Service-Tasks.md](02_Tasks-27-34_Accrual-Service-Tasks.md)

---

## Document Overview

This document covers the foundation of leave balance tracking, including accrual method constants and the core LeaveBalance model. These elements establish the infrastructure for tracking employee leave entitlements, usage, and carry-forward across years.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Define AccrualMethod Choices | Low | 10 min |
| 20 | Create LeaveBalance Model | Medium | 25 min |
| 21 | Add Balance Core Fields | Low | 15 min |
| 22 | Add Allocation Fields | Low | 15 min |
| 23 | Add Usage Fields | Medium | 20 min |
| 24 | Add Carry Forward Field | Low | 15 min |
| 25 | Add Encashed Field | Low | 15 min |
| 26 | Run LeaveBalance Migrations | Low | 15 min |

---

## Task 19: Define AccrualMethod Choices

### Overview
Define standard accrual method constants that determine how leave balances are credited to employees. These constants ensure consistency across the system when calculating and allocating leave entitlements based on different organizational policies.

### Dependencies
- Leave app structure exists (`apps/leave/`)
- Constants module exists or will be created

### Instructions

1. **Open or create constants.py file**
   - Navigate to `apps/leave/constants.py`
   - If file exists, add to existing content
   - If not, create new file with module docstring

2. **Add module docstring (if new file)**
   - Add comprehensive module documentation
   - Explain the purpose of leave constants
   - Note usage context (leave policies, accrual calculations)

3. **Define ACCRUAL_METHODS constant**
   - Create tuple of accrual method choices
   - Follow Django's choices pattern (value, display_name)
   - Include all standard accrual methods

4. **Define ACCRUAL_METHOD_ANNUAL_GRANT constant**
   - Value: 'annual_grant'
   - Purpose: Full balance granted at year start
   - Most common method for permanent employees

5. **Define ACCRUAL_METHOD_MONTHLY constant**
   - Value: 'monthly_accrual'
   - Purpose: Balance credited monthly (days_per_year / 12)
   - Gradual accumulation throughout year

6. **Define ACCRUAL_METHOD_PRO_RATA constant**
   - Value: 'pro_rata'
   - Purpose: Based on employment period/join date
   - Used for new joiners and partial year employment

7. **Add accrual method documentation**
   - Document each method's calculation logic
   - Include examples for Sri Lankan context
   - Note when each method is appropriate

### Accrual Method Details

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| ACCRUAL_METHOD_ANNUAL_GRANT | 'annual_grant' | Annual Grant | Full entitlement at year start |
| ACCRUAL_METHOD_MONTHLY | 'monthly_accrual' | Monthly Accrual | Monthly accumulation |
| ACCRUAL_METHOD_PRO_RATA | 'pro_rata' | Pro-Rata | New joiners, partial year |

### Accrual Method Calculation Examples

#### Annual Grant Method
```
Employee entitled to 14 days annual leave

January 1st, 2026:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Allocated Days:        14.0
Available from:        2026-01-01
Full balance granted immediately

Usage:
• Employee can use full 14 days anytime in 2026
• Common for permanent staff
• Aligns with Sri Lankan calendar year
```

#### Monthly Accrual Method
```
Employee entitled to 14 days annual leave

Monthly Calculation: 14 ÷ 12 = 1.17 days per month

Month-by-Month Accrual:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
January:     1.17 days   (Total: 1.17)
February:    1.17 days   (Total: 2.34)
March:       1.17 days   (Total: 3.51)
April:       1.17 days   (Total: 4.68)
...
December:    1.17 days   (Total: 14.04)

Usage:
• Employee accumulates leave gradually
• Can only use accrued balance
• Common for probationary staff
• Cannot take more than accrued amount
```

#### Pro-Rata Method
```
New Employee Scenario:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Annual Entitlement:    14 days
Join Date:             June 1, 2026
Remaining Months:      7 months (Jun-Dec)

Pro-Rata Calculation:
14 days × (7 months ÷ 12 months) = 8.17 days

Allocated Days:        8.17
Effective from:        2026-06-01

Usage:
• Only entitled to partial year amount
• Based on actual employment period
• Fair for mid-year joiners
• Complies with Sri Lankan labor law
```

### Sri Lankan Context

#### Government Sector Example
```
Government employees typically receive:
• 20 days annual leave (annual grant)
• Granted on January 1st each year
• Carry forward allowed (usually 10 days max)

Accrual Method: ANNUAL_GRANT
```

#### Private Sector Example
```
Private sector employees may receive:
• 14 days annual leave after 1 year service
• Probation period: monthly accrual
• After confirmation: annual grant

Year 1 (Probation): MONTHLY_ACCRUAL
Year 2+:            ANNUAL_GRANT
```

#### New Joiner Example
```
Employee joins on April 15, 2026:
• Entitled to 14 days per year
• Not entitled to full year amount
• Pro-rata for remaining period

Calculation:
Remaining days: 260 days (Apr 15 - Dec 31)
Total year:     365 days
Pro-rata:       14 × (260/365) = 9.97 days

Accrual Method: PRO_RATA
```

### Accrual Method Selection Criteria

| Employment Status | Recommended Method | Reason |
|------------------|-------------------|--------|
| Permanent employee | Annual Grant | Full entitlement, immediate access |
| Probationary employee | Monthly Accrual | Gradual earning during probation |
| New joiner (mid-year) | Pro-Rata | Fair allocation for partial year |
| Contract employee | Monthly Accrual | Tied to contract duration |
| Temporary worker | Pro-Rata | Based on employment period |

### Accrual Method Business Rules

#### Annual Grant
- **When to Use:** Confirmed permanent employees
- **Timing:** January 1st or anniversary date
- **Advantages:** Simple, full access immediately
- **Considerations:** May be taken before "earned"

#### Monthly Accrual
- **When to Use:** Probation, contracts, cash flow concerns
- **Timing:** Last day of each month
- **Advantages:** Controlled usage, gradual accumulation
- **Considerations:** More complex tracking

#### Pro-Rata
- **When to Use:** New joiners, resignations, partial periods
- **Timing:** Join date or status change
- **Advantages:** Fair allocation, legally compliant
- **Considerations:** Requires date calculations

### Integration with Leave Policies

```
LeaveType (from Group A)
        │
        ├─── accrual_method = ANNUAL_GRANT
        │    └─── days_per_year = 14
        │
        └─── Used by: LeaveBalance (this group)
             └─── Determines allocation timing and amount
```

### Expected Outcome
- Clear accrual method categorization
- Consistent accrual method values
- Foundation for accrual calculations
- Support for various employment scenarios

### Verification Checklist
- [ ] ACCRUAL_METHODS tuple defined
- [ ] ACCRUAL_METHOD_ANNUAL_GRANT constant created
- [ ] ACCRUAL_METHOD_MONTHLY constant created
- [ ] ACCRUAL_METHOD_PRO_RATA constant created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Documentation includes examples

---

## Task 20: Create LeaveBalance Model

### Overview
Create the core LeaveBalance model that tracks employee leave entitlements and usage. This model serves as the central repository for leave balance information, maintaining one record per employee per leave type per year.

### Dependencies
- Task 19: Define AccrualMethod Choices
- LeaveType model exists (from Group A)
- Employee model exists
- Django ORM configured

### Instructions

1. **Create leave_balance.py model file**
   - Create file at `apps/leave/models/leave_balance.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import Decimal for precise balance tracking
   - Import date utilities
   - Import Employee model
   - Import LeaveType model
   - Import base model mixins (if available)

3. **Define LeaveBalance model class**
   - Inherit from models.Model (and mixins if available)
   - Add comprehensive model docstring

4. **Add model-level documentation**
   - Explain one-record-per-employee-per-type-per-year principle
   - Document the unique_together constraint
   - Note calculation formulas

5. **Plan field structure**
   - Core identification fields (employee, leave_type, year)
   - Allocation fields (opening, allocated, carried)
   - Usage fields (used, pending)
   - Control fields (active status, dates)

6. **Define Meta class**
   - Set verbose_name = 'Leave Balance'
   - Set verbose_name_plural = 'Leave Balances'
   - Add unique_together = ['employee', 'leave_type', 'year']
   - Add ordering = ['-year', 'employee', 'leave_type']
   - Add indexes for common queries

7. **Add __str__ method**
   - Return format: "Employee Name - Leave Type (Year)"
   - Example: "John Perera - Annual Leave (2026)"
   - Include available days for quick reference

8. **Add available_days property**
   - Computed field (not stored in database)
   - Formula: opening + allocated + carried - used - pending - encashed
   - Return as Decimal with 2 decimal places

9. **Update models/__init__.py**
   - Import LeaveBalance
   - Add to __all__ list

### LeaveBalance Model Structure

```
┌─────────────────────────────────────────────────┐
│           LeaveBalance Model                    │
├─────────────────────────────────────────────────┤
│ Core Identification:                            │
│  • employee (ForeignKey to Employee)            │
│  • leave_type (ForeignKey to LeaveType)         │
│  • year (IntegerField)                          │
│                                                 │
│ Allocation Fields:                              │
│  • opening_balance (DecimalField)               │
│  • allocated_days (DecimalField)                │
│  • carried_from_previous (DecimalField)         │
│                                                 │
│ Usage Fields:                                   │
│  • used_days (DecimalField)                     │
│  • pending_days (DecimalField)                  │
│  • encashed_days (DecimalField)                 │
│                                                 │
│ Control Fields:                                 │
│  • carry_forward_expiry (DateField)             │
│  • last_accrual_date (DateField)                │
│  • is_active (BooleanField)                     │
│                                                 │
│ Computed Property:                              │
│  • available_days (calculated)                  │
│                                                 │
│ Constraints:                                    │
│  • unique_together: (employee, leave_type, year)│
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         N:1          ┌────────────────────┐
│   Employee   │◄─────────────────────│   LeaveBalance     │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
┌──────────────┐                      ┌────────────────────┐
│  LeaveType   │◄─────────────────────│   LeaveBalance     │
└──────────────┘                      └────────────────────┘

One employee can have multiple balances:
• One per leave type
• One per year
• Example: Annual Leave 2025, Annual Leave 2026, Sick Leave 2026
```

### Unique Constraint Explanation

```
Unique Together: (employee, leave_type, year)
═══════════════════════════════════════════════

Employee: John Perera (ID: 101)

Valid Records:
✓  LeaveBalance(employee=101, leave_type='Annual', year=2025)
✓  LeaveBalance(employee=101, leave_type='Annual', year=2026)
✓  LeaveBalance(employee=101, leave_type='Sick', year=2026)
✓  LeaveBalance(employee=101, leave_type='Casual', year=2026)

Invalid (Duplicate):
✗  LeaveBalance(employee=101, leave_type='Annual', year=2026)  ← Already exists!
```

### Balance Calculation Formula

```
Available Days Calculation
══════════════════════════

Available = Opening Balance
          + Allocated Days
          + Carried from Previous Year
          - Used Days
          - Pending Approval Days
          - Encashed Days

Example:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening Balance:           14.00  (from policy)
Allocated (accrued):        0.00  (annual grant)
Carried Forward:            3.00  (from 2025)
Used Days:                  5.00  (approved leaves)
Pending Approval:           2.00  (awaiting decision)
Encashed Days:              0.00  (not yet encashed)
────────────────────────────────────────────────
Available Days:            10.00

Formula: 14.00 + 0.00 + 3.00 - 5.00 - 2.00 - 0.00 = 10.00
```

### Field Categories and Purpose

#### Core Identification Fields
| Field | Purpose | Example |
|-------|---------|---------|
| employee | Links to employee record | John Perera (EMP-001) |
| leave_type | Links to leave type | Annual Leave |
| year | Calendar year | 2026 |

#### Allocation Fields
| Field | Purpose | Example |
|-------|---------|---------|
| opening_balance | Starting balance for year | 14.00 |
| allocated_days | Accrued/granted days | 0.00 (annual) or monthly sum |
| carried_from_previous | Carried from prior year | 3.00 |

#### Usage Fields
| Field | Purpose | Example |
|-------|---------|---------|
| used_days | Approved and taken | 5.00 |
| pending_days | Awaiting approval | 2.00 |
| encashed_days | Converted to cash | 0.00 |

#### Control Fields
| Field | Purpose | Example |
|-------|---------|---------|
| carry_forward_expiry | When carried days expire | 2026-03-31 |
| last_accrual_date | Last accrual calculation | 2026-01-31 |
| is_active | Balance is current | True |

### LeaveBalance Lifecycle

```
Year Start (January 1, 2026)
        │
        ├─── Create LeaveBalance record
        │    • employee = John Perera
        │    • leave_type = Annual Leave
        │    • year = 2026
        │    • opening_balance = 14.00
        │    • allocated_days = 0.00 (annual grant)
        │    • carried_from_previous = 3.00
        │    • available_days = 17.00
        │
        ├─── Throughout Year
        │    • Leave requests approved → used_days increases
        │    • Leave requests submitted → pending_days increases
        │    • Monthly accrual (if applicable) → allocated_days increases
        │    • Leave encashment → encashed_days increases
        │
        └─── Year End (December 31, 2026)
             • Calculate unused days
             • Process carry forward (if allowed)
             • Create 2027 balance record
             • Set is_active = False (archived)
```

### Example Balance Records

#### Example 1: Permanent Employee (Annual Grant)
```
Employee:              Kumari Silva
Leave Type:            Annual Leave
Year:                  2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening Balance:       14.00  (policy entitlement)
Allocated Days:         0.00  (annual grant method)
Carried Forward:        2.00  (from 2025)
Used Days:              6.00  (Jan-Jun usage)
Pending Days:           1.00  (July request pending)
Encashed Days:          0.00  (none)
────────────────────────────────────────────────
Available Days:         9.00  (14+0+2-6-1-0)
```

#### Example 2: New Joiner (Pro-Rata)
```
Employee:              Anil Fernando
Leave Type:            Annual Leave
Year:                  2026
Join Date:             June 1, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening Balance:        0.00  (mid-year joiner)
Allocated Days:         8.17  (pro-rata: 14×7/12)
Carried Forward:        0.00  (new employee)
Used Days:              1.00  (July vacation)
Pending Days:           0.00  (none)
Encashed Days:          0.00  (none)
────────────────────────────────────────────────
Available Days:         7.17  (0+8.17+0-1-0-0)
```

#### Example 3: Probationary Employee (Monthly Accrual)
```
Employee:              Priya Jayawardena
Leave Type:            Annual Leave
Year:                  2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening Balance:        0.00  (probation period)
Allocated Days:         4.68  (Jan-Apr: 1.17×4)
Carried Forward:        0.00  (probationary)
Used Days:              2.00  (March leave)
Pending Days:           1.00  (May request)
Encashed Days:          0.00  (none)
────────────────────────────────────────────────
Available Days:         1.68  (0+4.68+0-2-1-0)
Last Accrual:      2026-04-30
```

### Database Indexes

```
Index Strategy:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Unique Index: (employee, leave_type, year)
   • Enforces one record per combination
   
2. Query Index: (employee, year)
   • Common query: all balances for employee in year
   
3. Lookup Index: (leave_type, year, is_active)
   • Report queries: all employees by leave type
   
4. Expiry Index: (carry_forward_expiry, is_active)
   • Daily check for expired carry forwards
```

### Expected Outcome
- Functional LeaveBalance model
- One record per employee-type-year combination
- Foundation for balance tracking
- Support for various accrual methods
- Computed available days property

### Verification Checklist
- [ ] leave_balance.py file created
- [ ] LeaveBalance class defined
- [ ] Model docstring comprehensive
- [ ] Meta class configured
- [ ] unique_together constraint set
- [ ] Appropriate indexes defined
- [ ] __str__ method implemented
- [ ] available_days property added
- [ ] Model imported in __init__.py

---

## Task 21: Add Balance Core Fields

### Overview
Add the core identification and relationship fields to the LeaveBalance model. These fields link the balance record to a specific employee, leave type, and year, forming the unique identity of each balance record.

### Dependencies
- Task 20: Create LeaveBalance model

### Instructions

1. **Open leave_balance.py model file**
   - Navigate to `apps/leave/models/leave_balance.py`
   - Locate LeaveBalance model class

2. **Add employee field**
   - ForeignKey to Employee model
   - on_delete=models.CASCADE (delete balances if employee deleted)
   - related_name='leave_balances'
   - db_index=True for query performance
   - Help text: "Employee who owns this leave balance"

3. **Add leave_type field**
   - ForeignKey to LeaveType model
   - on_delete=models.PROTECT (prevent deletion if balances exist)
   - related_name='balances'
   - db_index=True
   - Help text: "Type of leave this balance tracks"

4. **Add year field**
   - PositiveIntegerField
   - Stores 4-digit year (e.g., 2026)
   - db_index=True
   - validators=[MinValueValidator(2020), MaxValueValidator(2100)]
   - Help text: "Calendar year for this balance"

5. **Add field documentation**
   - Add inline comments explaining each field
   - Note relationship behavior (CASCADE vs PROTECT)
   - Document query patterns

6. **Update unique_together in Meta**
   - Ensure unique_together = ['employee', 'leave_type', 'year']
   - Add db_table = 'leave_balance' (optional)

### Core Fields Structure

```
┌─────────────────────────────────────────────────┐
│         LeaveBalance Core Fields                │
├─────────────────────────────────────────────────┤
│ employee (ForeignKey)                           │
│  ├─── to: Employee                              │
│  ├─── on_delete: CASCADE                        │
│  ├─── related_name: 'leave_balances'            │
│  └─── indexed: Yes                              │
│                                                 │
│ leave_type (ForeignKey)                         │
│  ├─── to: LeaveType                             │
│  ├─── on_delete: PROTECT                        │
│  ├─── related_name: 'balances'                  │
│  └─── indexed: Yes                              │
│                                                 │
│ year (PositiveIntegerField)                     │
│  ├─── format: 4-digit year (2026)               │
│  ├─── validators: 2020-2100                     │
│  └─── indexed: Yes                              │
└─────────────────────────────────────────────────┘
```

### Field Relationships Diagram

```
┌─────────────────┐
│    Employee     │
│  (Core Model)   │
│                 │
│ • employee_id   │
│ • first_name    │
│ • last_name     │
│ • join_date     │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────────────────────────────────────┐
│           LeaveBalance                          │
│                                                 │
│ • id (PK)                                       │
│ • employee_id (FK) ──┐                          │
│ • leave_type_id (FK) ─┼─→ Unique Together      │
│ • year               ─┘                         │
│ • opening_balance                               │
│ • ... (other fields)                            │
└────────┬────────────────────────────────────────┘
         │ N
         │
         │ 1
┌────────▼────────┐
│   LeaveType     │
│  (From Group A) │
│                 │
│ • id            │
│ • name          │
│ • days_per_year │
│ • accrual_method│
└─────────────────┘
```

### On Delete Behavior

#### CASCADE (employee field)
```
Scenario: Employee is deleted from system

Employee: John Perera (ID: 101) - DELETED
        │
        ├─── LeaveBalance (Annual 2025) - DELETED
        ├─── LeaveBalance (Annual 2026) - DELETED
        ├─── LeaveBalance (Sick 2026)   - DELETED
        └─── All related balances automatically deleted

Rationale:
• Balance records meaningless without employee
• Maintains referential integrity
• Prevents orphaned records
• Historical data should be archived before deletion
```

#### PROTECT (leave_type field)
```
Scenario: Attempt to delete LeaveType

LeaveType: Annual Leave - CANNOT DELETE
        │
        ├─── LeaveBalance (Emp 101, 2026) - Exists
        ├─── LeaveBalance (Emp 102, 2026) - Exists
        └─── Error: Cannot delete LeaveType with existing balances

Rationale:
• Preserve historical integrity
• Force conscious decision (transfer balances first)
• Prevent accidental data loss
• Leave types rarely deleted in practice
```

### Related Name Usage

#### Accessing from Employee
```python
# Get all balances for an employee
employee = Employee.objects.get(id=101)
balances = employee.leave_balances.all()

# Get 2026 balances only
balances_2026 = employee.leave_balances.filter(year=2026)

# Get specific leave type balance
annual_balance = employee.leave_balances.get(
    leave_type__name='Annual Leave',
    year=2026
)
```

#### Accessing from LeaveType
```python
# Get all balances for a leave type
leave_type = LeaveType.objects.get(name='Annual Leave')
all_balances = leave_type.balances.all()

# Get active balances (current year)
active_balances = leave_type.balances.filter(
    year=2026,
    is_active=True
)

# Count employees with this leave type
employee_count = leave_type.balances.filter(year=2026).count()
```

### Year Field Validation

```
Valid Years: 2020 - 2100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Valid Examples:
✓  year = 2026  (current/future)
✓  year = 2025  (historical)
✓  year = 2020  (minimum allowed)
✓  year = 2100  (maximum allowed)

Invalid Examples:
✗  year = 2019  (below minimum)
✗  year = 2101  (above maximum)
✗  year = 26    (2-digit year)
✗  year = 20266 (typo)
```

### Core Fields Query Patterns

#### Pattern 1: Get Employee's Current Balance
```python
# Get specific balance for employee
balance = LeaveBalance.objects.get(
    employee_id=employee_id,
    leave_type_id=leave_type_id,
    year=current_year
)
```

#### Pattern 2: Get All Balances for Year
```python
# HR dashboard: all balances for current year
balances = LeaveBalance.objects.filter(
    year=2026
).select_related('employee', 'leave_type')
```

#### Pattern 3: Get Employee's All Leave Types (Current Year)
```python
# Employee view: all their current balances
balances = LeaveBalance.objects.filter(
    employee=employee,
    year=2026,
    is_active=True
)
```

#### Pattern 4: Get Historical Balances
```python
# Audit report: employee's historical balances
history = LeaveBalance.objects.filter(
    employee=employee
).order_by('-year', 'leave_type__name')
```

### Sri Lankan Context Examples

#### Example 1: Public Sector Employee
```
Employee:    R.M. Kumara (Senior Clerk, Grade III)
Join Date:   2015-03-01
Department:  Ministry of Finance

Leave Balances (2026):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Annual Leave (20 days)
2. Casual Leave (7 days)
3. Sick Leave (21 days)
4. Maternity Leave (N/A - Male)

Database Records:
• LeaveBalance(employee=Kumara, type=Annual, year=2026)
• LeaveBalance(employee=Kumara, type=Casual, year=2026)
• LeaveBalance(employee=Kumara, type=Sick, year=2026)
```

#### Example 2: Private Sector Employee
```
Employee:    S. Fernando (Marketing Manager)
Join Date:   2020-07-01
Company:     ABC Pvt Ltd

Leave Balances (2026):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Annual Leave (14 days)
2. Medical Leave (7 days)

Database Records:
• LeaveBalance(employee=Fernando, type=Annual, year=2026)
• LeaveBalance(employee=Fernando, type=Medical, year=2026)
```

### Index Performance Considerations

```
Query Performance Strategy:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fast Queries (Indexed):
✓  WHERE employee_id = 101
✓  WHERE leave_type_id = 5
✓  WHERE year = 2026
✓  WHERE employee_id = 101 AND year = 2026

Slow Queries (Not Indexed):
✗  WHERE opening_balance > 10
✗  WHERE available_days < 5  (computed field)

Optimization:
• Add composite index (employee_id, year)
• Add index on (year, is_active)
• Use select_related() for ForeignKey lookups
```

### Expected Outcome
- Three core fields linking balance to employee, type, and year
- Proper relationship behavior (CASCADE and PROTECT)
- Efficient query performance with indexes
- Foundation for unique constraint
- Support for historical tracking

### Verification Checklist
- [ ] employee field added
- [ ] leave_type field added
- [ ] year field added
- [ ] ForeignKey relationships correct
- [ ] on_delete behavior appropriate
- [ ] related_name attributes set
- [ ] db_index=True for all three fields
- [ ] Year validators set (2020-2100)
- [ ] Help text added to all fields
- [ ] unique_together constraint in Meta

---

## Task 22: Add Allocation Fields

### Overview
Add fields that track how leave days are allocated to the employee. These fields record the opening balance, days accrued or granted during the year, and any days carried forward from previous years.

### Dependencies
- Task 21: Add Balance Core Fields

### Instructions

1. **Open leave_balance.py model file**
   - Continue in `apps/leave/models/leave_balance.py`
   - Locate LeaveBalance model class

2. **Import DecimalField**
   - Ensure Decimal is imported from Python's decimal module
   - Will be used for precise leave day calculations

3. **Add opening_balance field**
   - DecimalField with max_digits=6, decimal_places=2
   - Default=Decimal('0.00')
   - Help text: "Starting balance at beginning of year"
   - Note: Usually equals leave type's days_per_year

4. **Add allocated_days field**
   - DecimalField with max_digits=6, decimal_places=2
   - Default=Decimal('0.00')
   - Help text: "Days accrued or granted during the year"
   - Note: Increments with monthly accrual or set once for annual grant

5. **Add carried_from_previous field**
   - DecimalField with max_digits=6, decimal_places=2
   - Default=Decimal('0.00')
   - Help text: "Unused days carried forward from previous year"
   - Note: Subject to carry forward policy limits

6. **Add field documentation**
   - Add comments explaining allocation flow
   - Document how fields interact
   - Note calculation dependencies

7. **Update model docstring**
   - Document allocation field purpose
   - Include examples of different scenarios
   - Explain relationship between fields

### Allocation Fields Structure

```
┌─────────────────────────────────────────────────┐
│      LeaveBalance Allocation Fields             │
├─────────────────────────────────────────────────┤
│ opening_balance (Decimal)                       │
│  ├─── max_digits: 6                             │
│  ├─── decimal_places: 2                         │
│  ├─── default: 0.00                             │
│  └─── purpose: Year start entitlement           │
│                                                 │
│ allocated_days (Decimal)                        │
│  ├─── max_digits: 6                             │
│  ├─── decimal_places: 2                         │
│  ├─── default: 0.00                             │
│  └─── purpose: Accrued/granted in year          │
│                                                 │
│ carried_from_previous (Decimal)                 │
│  ├─── max_digits: 6                             │
│  ├─── decimal_places: 2                         │
│  ├─── default: 0.00                             │
│  └─── purpose: Carried from prior year          │
└─────────────────────────────────────────────────┘
```

### Allocation Flow Diagram

```
Year Start (January 1, 2026)
        │
        ├─── opening_balance = 14.00
        │    (From LeaveType.days_per_year)
        │
        ├─── carried_from_previous = 3.00
        │    (From 2025 year-end process)
        │
        ├─── allocated_days = 0.00
        │    (If annual grant, stays 0)
        │    (If monthly accrual, increments monthly)
        │
        └─── Total Available = 17.00
             (opening + allocated + carried)
```

### Allocation Field Relationships

```
Total Entitlement = opening_balance
                  + allocated_days
                  + carried_from_previous

Example Scenario:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
opening_balance:         14.00  (policy entitlement)
allocated_days:           0.00  (annual grant - full at start)
carried_from_previous:    3.00  (from 2025)
────────────────────────────────────────────────
Total Entitlement:       17.00 days
```

### Annual Grant Accrual Pattern

```
Annual Grant Method:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

January 1, 2026:
  opening_balance:        14.00  (Full entitlement granted)
  allocated_days:          0.00  (Not used for annual grant)
  carried_from_previous:   3.00  (From 2025)

Throughout Year:
  opening_balance:        14.00  (No change)
  allocated_days:          0.00  (No change)
  carried_from_previous:   3.00  (No change until expiry)

Calculation:
  Total = 14.00 + 0.00 + 3.00 = 17.00 days
```

### Monthly Accrual Pattern

```
Monthly Accrual Method:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

January 1, 2026:
  opening_balance:         0.00  (Not used for monthly accrual)
  allocated_days:          0.00  (Starting point)
  carried_from_previous:   0.00  (Probation - no carry forward)

End of January:
  allocated_days:          1.17  (14 ÷ 12)

End of February:
  allocated_days:          2.34  (1.17 + 1.17)

End of March:
  allocated_days:          3.51  (2.34 + 1.17)

...continuing monthly...

End of December:
  opening_balance:         0.00
  allocated_days:         14.04  (1.17 × 12)
  carried_from_previous:   0.00
  ────────────────────────────────
  Total:                  14.04 days
```

### Pro-Rata Allocation Pattern

```
Pro-Rata Method (Mid-Year Joiner):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Employee joins June 1, 2026:
  Annual Entitlement:    14 days
  Remaining Months:       7 (Jun-Dec)
  Pro-Rata Calculation:  14 × (7/12) = 8.17

June 1, 2026:
  opening_balance:        0.00  (Mid-year joiner)
  allocated_days:         8.17  (Pro-rata amount granted)
  carried_from_previous:  0.00  (New employee)
  ────────────────────────────────
  Total:                  8.17 days
```

### Carried Forward Scenarios

#### Scenario 1: No Carry Forward
```
Employee Policy: No carry forward allowed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2025 End:
  Unused Days: 5.00 (lost)

2026 Start:
  opening_balance:        14.00
  allocated_days:          0.00
  carried_from_previous:   0.00  (Not allowed)
  ────────────────────────────────
  Total:                  14.00 days
```

#### Scenario 2: Unlimited Carry Forward
```
Employee Policy: Unlimited carry forward
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2025 End:
  Unused Days: 5.00

2026 Start:
  opening_balance:        14.00
  allocated_days:          0.00
  carried_from_previous:   5.00  (All unused days)
  ────────────────────────────────
  Total:                  19.00 days
```

#### Scenario 3: Limited Carry Forward
```
Employee Policy: Maximum 3 days carry forward
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2025 End:
  Unused Days: 5.00
  Maximum Allowed: 3.00
  Forfeited: 2.00

2026 Start:
  opening_balance:        14.00
  allocated_days:          0.00
  carried_from_previous:   3.00  (Limited to max)
  ────────────────────────────────
  Total:                  17.00 days
```

### Decimal Precision Rationale

```
Why Decimal (6, 2)?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

max_digits=6:
  • Maximum value: 9999.99
  • Sufficient for any realistic leave balance
  • Example maximum: 999 days 99 hundredths

decimal_places=2:
  • Precision to 0.01 days
  • Supports half-days (0.5)
  • Supports hourly leave (0.125 = 1 hour in 8-hour day)
  • Example: 14.50 = 14 days 4 hours

Examples:
✓  14.00  (14 full days)
✓  14.50  (14 days, 4 hours)
✓  1.17   (monthly accrual)
✓  0.125  (1 hour of 8-hour day)
✓  8.17   (pro-rata calculation)
```

### Sri Lankan Examples

#### Government Sector
```
Employee: K.G.S. Perera (Administrative Officer)
Leave Type: Annual Leave
Year: 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Allocation:
  opening_balance:        20.00  (Government standard)
  allocated_days:          0.00  (Annual grant)
  carried_from_previous:  10.00  (Max allowed by govt)
  ────────────────────────────────
  Total Available:        30.00 days

Notes:
• Government allows 10 days carry forward
• Annual grant on January 1st
• Carried days must be used by June 30th
```

#### Private Sector
```
Employee: N.P. Silva (Software Engineer)
Leave Type: Annual Leave
Year: 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Allocation:
  opening_balance:        14.00  (Private sector standard)
  allocated_days:          0.00  (Annual grant)
  carried_from_previous:   3.00  (Company policy: max 3)
  ────────────────────────────────
  Total Available:        17.00 days

Notes:
• Private sector typically 14 days
• Limited carry forward (3-5 days common)
• Carried days expire March 31st
```

### Field Validation Rules

```
Validation Requirements:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

opening_balance:
✓  Must be >= 0
✓  Usually equals LeaveType.days_per_year
✓  Can be 0 for monthly accrual method

allocated_days:
✓  Must be >= 0
✓  Increments throughout year (monthly accrual)
✓  Or remains 0 (annual grant)

carried_from_previous:
✓  Must be >= 0
✓  Should not exceed max_carry_forward_days
✓  Validated during year-end rollover
```

### Expected Outcome
- Three allocation fields tracking leave entitlement sources
- Precise decimal calculation (2 decimal places)
- Support for all accrual methods
- Foundation for total entitlement calculation
- Historical tracking of allocations

### Verification Checklist
- [ ] opening_balance field added
- [ ] allocated_days field added
- [ ] carried_from_previous field added
- [ ] All fields are DecimalField
- [ ] max_digits=6, decimal_places=2 set
- [ ] Default=Decimal('0.00') for all
- [ ] Help text added to all fields
- [ ] Field documentation complete
- [ ] Model docstring updated

---

## Task 23: Add Usage Fields

### Overview
Add fields that track how leave days are consumed by the employee. These fields record approved leave taken, pending requests awaiting approval, and the calculated available balance.

### Dependencies
- Task 22: Add Allocation Fields

### Instructions

1. **Open leave_balance.py model file**
   - Continue in `apps/leave/models/leave_balance.py`
   - Locate LeaveBalance model class

2. **Add used_days field**
   - DecimalField with max_digits=6, decimal_places=2
   - Default=Decimal('0.00')
   - Help text: "Days of approved leave taken"
   - Note: Increments when leave requests are approved and completed

3. **Add pending_days field**
   - DecimalField with max_digits=6, decimal_places=2
   - Default=Decimal('0.00')
   - Help text: "Days of leave requests pending approval"
   - Note: Increments when requests submitted, decrements when approved/rejected

4. **Update available_days property**
   - Define as @property method (not database field)
   - Calculate: opening + allocated + carried - used - pending - encashed
   - Return Decimal with 2 decimal places
   - Add docstring explaining calculation

5. **Add balance validation method**
   - Create method to check if sufficient balance available
   - Name: has_sufficient_balance(days_requested)
   - Returns Boolean
   - Considers pending days in calculation

6. **Add field documentation**
   - Document how usage fields are updated
   - Explain available_days calculation
   - Note relationship with leave requests (Group C)

### Usage Fields Structure

```
┌─────────────────────────────────────────────────┐
│       LeaveBalance Usage Fields                 │
├─────────────────────────────────────────────────┤
│ used_days (Decimal)                             │
│  ├─── max_digits: 6                             │
│  ├─── decimal_places: 2                         │
│  ├─── default: 0.00                             │
│  └─── purpose: Approved & taken leave           │
│                                                 │
│ pending_days (Decimal)                          │
│  ├─── max_digits: 6                             │
│  ├─── decimal_places: 2                         │
│  ├─── default: 0.00                             │
│  └─── purpose: Awaiting approval                │
│                                                 │
│ available_days (Property - Computed)            │
│  ├─── not stored in database                    │
│  ├─── calculated on-the-fly                     │
│  └─── formula: opening+allocated+carried        │
│                -used-pending-encashed           │
└─────────────────────────────────────────────────┘
```

### Balance Calculation Formula

```
Available Days Calculation:
═══════════════════════════════════════════════════

available_days = opening_balance
               + allocated_days
               + carried_from_previous
               - used_days
               - pending_days
               - encashed_days

Example:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening Balance:         14.00
Allocated (accrued):      2.34  (monthly: 2 months)
Carried Forward:          3.00
Used Days:                5.00  (approved leaves taken)
Pending Days:             2.00  (awaiting approval)
Encashed Days:            0.00
────────────────────────────────────────────────────
Available:               12.34 days

Formula: 14.00 + 2.34 + 3.00 - 5.00 - 2.00 - 0.00 = 12.34
```

### Usage Field Lifecycle

```
Leave Request Lifecycle & Balance Updates:
══════════════════════════════════════════════════

Step 1: Employee submits leave request (3 days)
        │
        ├─── pending_days: 0.00 → 3.00
        ├─── available_days: 17.00 → 14.00
        └─── Status: "Blocked" but not yet deducted

Step 2: Manager approves request
        │
        ├─── pending_days: 3.00 → 0.00
        ├─── used_days: 0.00 → 0.00 (not yet taken)
        └─── available_days: 14.00 (unchanged)

Step 3: Leave period ends (leave taken)
        │
        ├─── used_days: 0.00 → 3.00
        └─── available_days: 14.00 → 14.00 (was blocked by pending)

Alternative: Manager rejects request
        │
        ├─── pending_days: 3.00 → 0.00
        ├─── used_days: 0.00 (no change)
        └─── available_days: 14.00 → 17.00 (restored)
```

### Usage Tracking Examples

#### Example 1: Throughout the Year
```
Employee: S. Jayawardena
Leave Type: Annual Leave
Year: 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

January 1 (Year Start):
  Opening:     14.00
  Allocated:    0.00
  Carried:      2.00
  Used:         0.00
  Pending:      0.00
  ────────────────────
  Available:   16.00

February 15 (Request 3 days - March vacation):
  Used:         0.00 (no change)
  Pending:      3.00 (new request)
  Available:   13.00 (reduced)

March 1 (Request approved):
  Used:         0.00 (not yet taken)
  Pending:      0.00 (approved)
  Available:   13.00 (stays blocked)

March 15 (Leave taken - vacation ends):
  Used:         3.00 (leave completed)
  Pending:      0.00
  Available:   13.00 (unchanged)

June 1 (Another request - 5 days):
  Used:         3.00
  Pending:      5.00 (new request)
  Available:    8.00

June 5 (Request rejected - insufficient notice):
  Used:         3.00
  Pending:      0.00 (rejected)
  Available:   13.00 (restored)

September 30 (Year-to-date):
  Used:         7.00 (total taken so far)
  Pending:      1.00 (one pending request)
  Available:    8.00
```

#### Example 2: Multiple Overlapping Requests
```
Scenario: Employee submits multiple requests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Starting Balance:
  Opening:     14.00
  Carried:      3.00
  Used:         0.00
  Pending:      0.00
  Available:   17.00

Request 1 (March vacation - 3 days):
  Pending:      3.00
  Available:   14.00

Request 2 (June vacation - 5 days):
  Pending:      8.00 (3 + 5)
  Available:    9.00

Request 3 (December vacation - 4 days):
  Pending:     12.00 (3 + 5 + 4)
  Available:    5.00

Note: All three requests "block" the balance
      None are deducted until approved and taken
```

### Sufficient Balance Check

```
has_sufficient_balance(days_requested) Method:
═══════════════════════════════════════════════════

Logic:
  available = opening + allocated + carried - used - pending - encashed
  return available >= days_requested

Example 1: Sufficient Balance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current State:
  Available: 10.00 days
  Request:    3.00 days

Check: 10.00 >= 3.00
Result: True ✓ (Request can proceed)


Example 2: Insufficient Balance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current State:
  Available: 2.00 days
  Request:    5.00 days

Check: 2.00 >= 5.00
Result: False ✗ (Request blocked)


Example 3: Exactly Enough
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current State:
  Available: 5.00 days
  Request:    5.00 days

Check: 5.00 >= 5.00
Result: True ✓ (Request uses all remaining)
```

### Pending Days Management

```
Pending Days Scenarios:
═══════════════════════════════════════════════════

Scenario A: Request Approved
  pending_days -= request_days
  used_days += 0  (wait until leave is taken)

Scenario B: Request Rejected
  pending_days -= request_days
  used_days += 0  (no change)
  # Days return to available pool

Scenario C: Request Cancelled (by employee)
  pending_days -= request_days
  used_days += 0
  # Days immediately available again

Scenario D: Leave Completed
  # After leave period ends
  pending_days += 0  (already moved when approved)
  used_days += request_days
```

### Edge Cases and Validation

#### Edge Case 1: Over-Booking
```
Problem: Used + Pending exceeds Total Entitlement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Entitlement: 14.00
Used:               10.00
Pending:             5.00
Total Consumed:     15.00 ✗ (Exceeds entitlement!)

Prevention:
• Validate before accepting new requests
• Check: (used + pending + new_request) <= total
• Reject if insufficient balance
```

#### Edge Case 2: Negative Balance
```
Problem: Calculation results in negative available
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Opening:    14.00
Used:       10.00
Pending:     8.00
Available:  -4.00 ✗ (Should never happen!)

Prevention:
• Strict validation on leave request submission
• Database constraints (check constraints)
• Application-level validation
```

#### Edge Case 3: Partial Days
```
Half-Day Leave Support:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Request: 0.5 days (half-day leave)

Before:
  Used:       5.00
  Available: 10.00

After Approval:
  Used:       5.50
  Available:  9.50

Note: DecimalField(2) supports half-days precisely
```

### Sri Lankan Context Examples

#### Public Sector Usage Pattern
```
Employee: A.K. Gunasekara (Teacher)
Leave Type: Annual Leave
Year: 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Entitlement: 20 days (public sector)

January-March:
  Used: 0.00 (School term - minimal leave)

April (Avurudu):
  Pending: 3.00 (Sinhala/Tamil New Year)
  After approval, Used: 3.00

July-August (School vacation):
  Used: 10.00 (vacation period)

December:
  Used: 15.00 (total year)
  Available: 5.00 (remaining)
```

#### Private Sector Usage Pattern
```
Employee: M.R. De Silva (Accountant)
Leave Type: Annual Leave  
Year: 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Entitlement: 14 days (private sector)

Throughout Year:
  March:   Used 2.00 (long weekend)
  June:    Used 5.00 (family vacation)
  October: Used 3.00 (pilgrimage)
  December: Used 4.00 (year-end break)
  ────────────────────────────────────
  Total Used: 14.00
  Remaining:   0.00
```

### Available Days Display

```
User Interface Display Recommendations:
═══════════════════════════════════════════════════

Dashboard View:
┌─────────────────────────────────────────┐
│ Leave Balance Summary (2026)            │
├─────────────────────────────────────────┤
│ Annual Leave:                           │
│  • Total Entitlement: 17.00 days        │
│  • Used:               5.00 days        │
│  • Pending Approval:   2.00 days        │
│  • Available:         10.00 days ✓      │
└─────────────────────────────────────────┘

Detail View:
┌─────────────────────────────────────────┐
│ Annual Leave Balance Breakdown          │
├─────────────────────────────────────────┤
│ Opening Balance:      14.00 days        │
│ Carried Forward:       3.00 days        │
│ Allocated (Accrued):   0.00 days        │
│ ─────────────────────────────           │
│ Total Entitlement:    17.00 days        │
│                                         │
│ Used (Approved):       5.00 days        │
│ Pending Approval:      2.00 days        │
│ Encashed:              0.00 days        │
│ ─────────────────────────────           │
│ Available:            10.00 days ✓      │
└─────────────────────────────────────────┘
```

### Expected Outcome
- Two usage fields tracking consumption
- Computed available_days property
- Balance validation method
- Foundation for leave request approval
- Accurate real-time balance tracking

### Verification Checklist
- [ ] used_days field added
- [ ] pending_days field added
- [ ] Both fields are DecimalField
- [ ] max_digits=6, decimal_places=2 set
- [ ] Default=Decimal('0.00') for both
- [ ] available_days property defined
- [ ] Calculation formula correct
- [ ] has_sufficient_balance method added
- [ ] Help text added to fields
- [ ] Model docstring updated

---

## Task 24: Add Carry Forward Field

### Overview
Add the carry_forward_expiry field to track when carried forward leave days expire. This field supports policies where carried leave must be used by a specific date (e.g., March 31st of the following year).

### Dependencies
- Task 23: Add Usage Fields

### Instructions

1. **Open leave_balance.py model file**
   - Continue in `apps/leave/models/leave_balance.py`
   - Locate LeaveBalance model class

2. **Add carry_forward_expiry field**
   - DateField, optional (blank=True, null=True)
   - Help text: "Date when carried forward leave expires"
   - Default=None
   - Note: Only applicable if carried_from_previous > 0

3. **Add field documentation**
   - Document expiry logic
   - Explain relationship with carried_from_previous
   - Note daily expiry check process

4. **Add expiry check method**
   - Name: is_carry_forward_expired()
   - Returns Boolean
   - Checks if today > carry_forward_expiry
   - Returns False if no expiry date set

5. **Add expired days calculation method**
   - Name: get_expired_carry_forward_days()
   - Returns Decimal
   - Returns carried_from_previous if expired, else 0.00
   - Used to reduce available balance

6. **Update available_days property**
   - Modify to exclude expired carry forward days
   - Recalculate if past expiry date
   - Document expiry impact

### Carry Forward Expiry Field Structure

```
┌─────────────────────────────────────────────────┐
│     Carry Forward Expiry Configuration          │
├─────────────────────────────────────────────────┤
│ carry_forward_expiry (DateField)                │
│  ├─── optional (null=True, blank=True)          │
│  ├─── default: None                             │
│  ├─── purpose: Expiry date for carried days     │
│  └─── example: 2026-03-31                       │
│                                                 │
│ Related Field:                                  │
│  • carried_from_previous (Decimal)              │
│    └─── Expires on carry_forward_expiry date    │
│                                                 │
│ Methods:                                        │
│  • is_carry_forward_expired() → Boolean         │
│  • get_expired_carry_forward_days() → Decimal   │
└─────────────────────────────────────────────────┘
```

### Carry Forward Expiry Scenarios

#### Scenario 1: Standard Expiry (March 31st)
```
Employee: K. Fernando
Year: 2026
Carry Forward: 3.00 days from 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

January 1, 2026:
  carried_from_previous:      3.00
  carry_forward_expiry:  2026-03-31
  Status: Active ✓

Timeline:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Jan 1  ────────────────────────► Mar 31  ───► Apr 1
       Carried days valid (3.00)         Expired (0.00)

March 15, 2026:
  Check: today (2026-03-15) <= expiry (2026-03-31)
  Result: Not expired ✓
  Available: Includes 3.00 carried days

April 1, 2026:
  Check: today (2026-04-01) > expiry (2026-03-31)
  Result: Expired ✗
  Available: Excludes 3.00 carried days
  Action: Reduce carried_from_previous to 0.00
```

#### Scenario 2: No Expiry Date
```
Employee: S. Perera
Year: 2026
Carry Forward: 5.00 days from 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Balance:
  carried_from_previous:      5.00
  carry_forward_expiry:       None
  Status: No expiry ✓

Result:
• Carried days valid entire year
• No expiry check performed
• Available throughout 2026
• Rolls to next year if unused
```

#### Scenario 3: Used Before Expiry
```
Employee: A. Silva
Year: 2026
Carry Forward: 3.00 days from 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

January 1, 2026:
  carried_from_previous:      3.00
  carry_forward_expiry:  2026-03-31
  used_days:                  0.00

February 15, 2026 (Take 2 days leave):
  carried_from_previous:      3.00 (unchanged)
  used_days:                  2.00

March 20, 2026 (Before expiry):
  Check: 2026-03-20 <= 2026-03-31 ✓
  Remaining carried:          3.00 (technically)
  Already used:               2.00
  Effective remaining:        1.00

April 1, 2026 (After expiry):
  Remaining unused carried:   1.00
  Status: Expired ✗
  Action: Forfeit 1.00 day
```

### Carry Forward Expiry Policies

| Policy Type | Expiry Date | Sri Lankan Context |
|------------|-------------|-------------------|
| Q1 Expiry | March 31 | Most common in private sector |
| H1 Expiry | June 30 | Common in public sector (government) |
| No Expiry | None | Rare, usually with cap on total |
| Anniversary | Employee join date + 1 year | Individual basis |
| End of Year | December 31 | Same-year usage only |

### Government Sector Example

```
Sri Lankan Government Employee:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee: W.A.S. Kumara (Administrative Officer)
Leave Type: Annual Leave
Year: 2026

Policy:
• Annual entitlement: 20 days
• Carry forward allowed: Maximum 10 days
• Expiry: June 30 of following year

2025 Year End:
  Unused days: 12.00
  Max carry forward: 10.00
  Carried to 2026: 10.00 (limited)
  Forfeited: 2.00

2026 Balance:
  opening_balance:         20.00
  carried_from_previous:   10.00
  carry_forward_expiry:    2026-06-30
  ────────────────────────────────
  Total (Jan-Jun):         30.00

June 30, 2026 (Expiry Check):
  Carried days used:        6.00
  Carried days remaining:   4.00
  Status: Expired ✗
  Action: Forfeit 4.00 days

July 1, 2026 onwards:
  opening_balance:         20.00
  carried_from_previous:    0.00 (expired)
  ────────────────────────────────
  Total:                   20.00
```

### Private Sector Example

```
Sri Lankan Private Company:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee: N.K. De Silva (Manager)
Leave Type: Annual Leave
Year: 2026

Policy:
• Annual entitlement: 14 days
• Carry forward allowed: Maximum 3 days
• Expiry: March 31 of following year

2025 Year End:
  Unused days: 5.00
  Max carry forward: 3.00
  Carried to 2026: 3.00 (limited)
  Forfeited: 2.00

2026 Balance:
  opening_balance:         14.00
  carried_from_previous:    3.00
  carry_forward_expiry:     2026-03-31
  ────────────────────────────────
  Total (Jan-Mar):         17.00

March 31, 2026 (Expiry Check):
  Carried days used:        2.00
  Carried days remaining:   1.00
  Status: Expired ✗
  Action: Forfeit 1.00 day

April 1, 2026 onwards:
  opening_balance:         14.00
  carried_from_previous:    0.00 (expired)
  ────────────────────────────────
  Total:                   14.00
```

### Expiry Check Implementation

```
is_carry_forward_expired() Method Logic:
═══════════════════════════════════════════════════

def is_carry_forward_expired(self):
    if not self.carry_forward_expiry:
        return False  # No expiry date set
    
    if self.carried_from_previous <= 0:
        return False  # Nothing to expire
    
    from django.utils import timezone
    today = timezone.now().date()
    
    return today > self.carry_forward_expiry

Examples:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. No expiry date:
   carry_forward_expiry = None
   Result: False (never expires)

2. Before expiry:
   carry_forward_expiry = 2026-03-31
   today = 2026-02-15
   Result: False (still valid)

3. On expiry date:
   carry_forward_expiry = 2026-03-31
   today = 2026-03-31
   Result: False (valid on expiry day)

4. After expiry:
   carry_forward_expiry = 2026-03-31
   today = 2026-04-01
   Result: True (expired)

5. No carried days:
   carried_from_previous = 0.00
   Result: False (nothing to expire)
```

### Available Days Calculation with Expiry

```
Updated available_days Property:
═══════════════════════════════════════════════════

@property
def available_days(self):
    total = (self.opening_balance +
             self.allocated_days +
             self.carried_from_previous -
             self.used_days -
             self.pending_days -
             self.encashed_days)
    
    # Subtract expired carry forward
    if self.is_carry_forward_expired():
        total -= self.carried_from_previous
    
    return max(total, Decimal('0.00'))  # Never negative

Example Before Expiry (March 15, 2026):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening:    14.00
Allocated:   0.00
Carried:     3.00 (expires 2026-03-31)
Used:        5.00
Pending:     0.00
Encashed:    0.00
Expired:     0.00 (not yet expired)
────────────────────────────────────
Available:  12.00

Example After Expiry (April 1, 2026):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opening:    14.00
Allocated:   0.00
Carried:     3.00 (expired!)
Used:        5.00
Pending:     0.00
Encashed:    0.00
Expired:    -3.00 (subtracted)
────────────────────────────────────
Available:   9.00
```

### Daily Expiry Check Process

```
Celery Task: Check Leave Expiry
═══════════════════════════════════════════════════

Schedule: Daily at 00:30

Process:
1. Query all balances with:
   • carry_forward_expiry = today
   • carried_from_previous > 0
   • is_active = True

2. For each expired balance:
   a. Log expiry event
   b. Send notification to employee
   c. Update balance:
      • carried_from_previous = 0.00
      • carry_forward_expiry = None
   d. Create audit record

3. Generate daily expiry report for HR

Example Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: 2026-03-31
Expired Carry Forward Summary:

• K. Fernando: 1.00 day expired
• A. Silva: 2.00 days expired
• S. Perera: 0.50 days expired
────────────────────────────────────
Total Expired: 3.50 days (3 employees)
```

### Expected Outcome
- Carry forward expiry date field
- Expiry validation methods
- Updated available days calculation
- Foundation for automated expiry processing
- Support for various expiry policies

### Verification Checklist
- [ ] carry_forward_expiry field added
- [ ] Field is DateField (null=True, blank=True)
- [ ] Help text added
- [ ] is_carry_forward_expired() method implemented
- [ ] get_expired_carry_forward_days() method added
- [ ] available_days property updated
- [ ] Expiry logic documented
- [ ] Model docstring updated

---

## Task 25: Add Encashed Field

### Overview
Add the encashed_days field to track leave days that have been converted to cash payment. This supports leave encashment policies where employees can opt to receive payment for unused leave days instead of taking time off.

### Dependencies
- Task 24: Add Carry Forward Field

### Instructions

1. **Open leave_balance.py model file**
   - Continue in `apps/leave/models/leave_balance.py`
   - Locate LeaveBalance model class

2. **Add encashed_days field**
   - DecimalField with max_digits=6, decimal_places=2
   - Default=Decimal('0.00')
   - Help text: "Leave days converted to cash payment"
   - Note: Reduces available balance, not used_days

3. **Add field documentation**
   - Document encashment policy context
   - Explain relationship with available_days
   - Note payment calculation (future group)

4. **Update available_days property**
   - Ensure encashed_days is subtracted in calculation
   - Already included in Task 23, verify correct

5. **Add encashment validation method**
   - Name: can_encash_days(days_to_encash)
   - Returns tuple (Boolean, str) - (can_encash, reason)
   - Checks if sufficient available balance
   - Checks policy restrictions

6. **Add field notes**
   - Document Sri Lankan context (rare in public sector)
   - Note typical private sector policies
   - Explain tax implications (reference only)

### Encashed Days Field Structure

```
┌─────────────────────────────────────────────────┐
│         Encashed Days Configuration             │
├─────────────────────────────────────────────────┤
│ encashed_days (Decimal)                         │
│  ├─── max_digits: 6                             │
│  ├─── decimal_places: 2                         │
│  ├─── default: 0.00                             │
│  └─── purpose: Days converted to cash           │
│                                                 │
│ Impact on Balance:                              │
│  • Reduces available_days                       │
│  • Does NOT increase used_days                  │
│  • Cannot be reversed after payment             │
│                                                 │
│ Validation Method:                              │
│  • can_encash_days(days) → (bool, str)          │
└─────────────────────────────────────────────────┘
```

### Leave Encashment Concept

```
Leave Encashment:
═══════════════════════════════════════════════════

Definition:
Converting unused leave days into cash payment
instead of taking time off work.

Process:
1. Employee applies for leave encashment
2. System checks policy eligibility
3. Calculates payment amount
4. Deducts from leave balance
5. Processes payment (finance system)

Balance Impact:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before Encashment:
  Opening:     14.00
  Used:         5.00
  Available:    9.00

Apply Encashment (3 days):
  Opening:     14.00
  Used:         5.00  (no change - not "used")
  Encashed:     3.00  (new)
  Available:    6.00  (reduced)

Note: Encashed days removed from available pool
      but not counted as "leave taken"
```

### Encashment vs. Usage Comparison

```
Used Days vs. Encashed Days:
═══════════════════════════════════════════════════

Used Days (used_days):
• Employee takes time off work
• Approved leave absence
• Recorded attendance: "On Leave"
• No payment beyond regular salary

Encashed Days (encashed_days):
• Employee continues working
• No time off taken
• Normal attendance
• Extra payment received

Example:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee A:
  used_days = 10.00
  encashed_days = 0.00
  → Took 10 days vacation

Employee B:
  used_days = 5.00
  encashed_days = 5.00
  → Took 5 days vacation, encashed 5 days

Employee C:
  used_days = 0.00
  encashed_days = 14.00
  → No vacation, encashed all leave
```

### Sri Lankan Encashment Policies

#### Public Sector (Government)
```
Government Sector Encashment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

General Policy:
• Leave encashment NOT allowed during service
• Only at retirement/resignation
• Limited to maximum accumulation

Example - Retirement:
  Accumulated leave: 120 days (from multiple years)
  Encashable: Up to 90 days (policy limit)
  Payment: Based on last drawn salary

Employee: K.G.S. Perera (Retiring Officer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Retirement Date: 2026-06-30
Accumulated Leave: 120.00 days
Maximum Encashable: 90.00 days
Encashed at Retirement: 90.00 days
Forfeited: 30.00 days
Last Salary: LKR 150,000
Payment: LKR 450,000 (90 days × daily rate)
```

#### Private Sector
```
Private Sector Encashment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Policy Variations:
1. No encashment (encourage work-life balance)
2. Year-end encashment (unused leave only)
3. Resignation encashment (pro-rated)
4. Special encashment (financial hardship)

Example 1 - Year-End Encashment:
Company: ABC Pvt Ltd
Policy: Max 50% of unused leave encashable

Employee: S. Fernando
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Year: 2026
Annual Entitlement: 14.00 days
Used: 6.00 days
Unused: 8.00 days
Max Encashable: 4.00 days (50% of unused)
Employee Requests: 4.00 days
Approved: 4.00 days
Payment: Based on basic salary

Example 2 - Resignation Encashment:
Employee: M. Silva (Resigning)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resignation Date: 2026-08-31
Year Balance:
  Allocated: 14.00 days (annual grant)
  Used: 5.00 days
  Unused: 9.00 days

Encashment:
  All unused leave encashable on resignation
  Encashed: 9.00 days
  Payment: LKR 90,000 (9 × daily rate)
```

### Encashment Scenarios

#### Scenario 1: Mid-Year Encashment
```
Employee: A. Jayawardena
Year: 2026
Leave Type: Annual Leave
Company Policy: 50% of unused encashable annually
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

June 30, 2026:
  Opening Balance: 14.00
  Used (Jan-Jun):   3.00
  Available:       11.00

Encashment Request: 5.00 days

Validation:
  Max encashable = unused × 50%
  Unused = 14.00 - 3.00 = 11.00
  Max = 11.00 × 0.5 = 5.50 days
  Requested = 5.00 ✓ (within limit)

After Encashment:
  Opening Balance: 14.00
  Used:             3.00
  Encashed:         5.00
  Available:        6.00
```

#### Scenario 2: Insufficient Balance
```
Employee: N. De Silva
Year: 2026
Leave Type: Annual Leave
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Balance:
  Opening: 14.00
  Used:    10.00
  Pending:  2.00
  Available: 2.00

Encashment Request: 5.00 days

Validation:
  Available = 2.00 days
  Requested = 5.00 days
  Result: Insufficient balance ✗

Error: "Cannot encash 5.00 days. Only 2.00 days available."
```

#### Scenario 3: Policy Restriction
```
Employee: P. Gunawardena
Year: 2026
Leave Type: Sick Leave
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Balance:
  Available: 15.00 days

Encashment Request: 10.00 days

Validation:
  Leave Type: Sick Leave
  Encashment Policy: Not allowed for sick leave ✗

Error: "Sick leave cannot be encashed per policy."

Note: Typically only annual/earned leave is encashable
```

### Encashment Validation Method

```
can_encash_days(days_to_encash) Method:
═══════════════════════════════════════════════════

def can_encash_days(self, days_to_encash):
    # Check 1: Leave type allows encashment
    if not self.leave_type.allow_encashment:
        return (False, "This leave type cannot be encashed")
    
    # Check 2: Sufficient available balance
    if days_to_encash > self.available_days:
        return (False, f"Insufficient balance. Available: {self.available_days}")
    
    # Check 3: Within policy limits
    max_encashable = self.leave_type.max_encashment_days_per_year
    if max_encashable and (self.encashed_days + days_to_encash) > max_encashable:
        remaining = max_encashable - self.encashed_days
        return (False, f"Exceeds annual limit. Can encash: {remaining} days")
    
    # Check 4: Minimum balance retained
    min_balance = self.leave_type.min_balance_after_encashment
    if min_balance:
        remaining = self.available_days - days_to_encash
        if remaining < min_balance:
            return (False, f"Must retain {min_balance} days minimum")
    
    return (True, "Encashment allowed")

Examples:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Valid encashment:
   days_to_encash = 5.00
   available_days = 10.00
   allow_encashment = True
   Result: (True, "Encashment allowed")

2. Type not allowed:
   leave_type = Sick Leave
   allow_encashment = False
   Result: (False, "This leave type cannot be encashed")

3. Insufficient balance:
   days_to_encash = 5.00
   available_days = 3.00
   Result: (False, "Insufficient balance. Available: 3.00")

4. Exceeds limit:
   days_to_encash = 8.00
   encashed_days = 5.00
   max_per_year = 10.00
   total = 13.00 ✗
   Result: (False, "Exceeds annual limit. Can encash: 5.00 days")
```

### Encashment Payment Calculation

```
Payment Calculation (Reference):
═══════════════════════════════════════════════════

Note: Detailed implementation in future groups (Finance)

Formula:
  Payment = Daily Rate × Encashed Days

Daily Rate Calculation:
  Daily Rate = Basic Salary ÷ 30 (or 26 working days)

Example:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee: K. Perera
Basic Salary: LKR 90,000/month
Encashed Days: 5.00 days

Method 1 (30 days):
  Daily Rate = 90,000 ÷ 30 = LKR 3,000
  Payment = 3,000 × 5 = LKR 15,000

Method 2 (26 working days):
  Daily Rate = 90,000 ÷ 26 = LKR 3,461.54
  Payment = 3,461.54 × 5 = LKR 17,307.70

Tax Implications:
• Encashment payment subject to income tax
• Added to monthly salary for tax calculation
• Employer may need to deduct tax at source
```

### Database Record Example

```
LeaveBalance Record with Encashment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
employee:               S. Fernando
leave_type:             Annual Leave
year:                   2026
opening_balance:        14.00
allocated_days:          0.00
carried_from_previous:   2.00
used_days:               6.00
pending_days:            0.00
encashed_days:           3.00  ← Cash payment received
────────────────────────────────────────────────────
available_days:          7.00

Calculation:
14.00 + 0.00 + 2.00 - 6.00 - 0.00 - 3.00 = 7.00

Summary:
• Total entitlement: 16.00 days (14 + 2 carried)
• Used as time off:   6.00 days
• Converted to cash:  3.00 days
• Still available:    7.00 days
```

### Expected Outcome
- Encashed days field for tracking cash conversions
- Validation method for encashment requests
- Updated available days calculation
- Foundation for encashment payment processing
- Support for various encashment policies

### Verification Checklist
- [ ] encashed_days field added
- [ ] Field is DecimalField (6, 2)
- [ ] Default=Decimal('0.00')
- [ ] Help text added
- [ ] available_days property includes encashed_days
- [ ] can_encash_days() method implemented
- [ ] Validation logic complete
- [ ] Sri Lankan context documented
- [ ] Model docstring updated

---

## Task 26: Run LeaveBalance Migrations

### Overview
Generate and run Django migrations to create the LeaveBalance model in the database. This task applies all field definitions from Tasks 20-25 to create the actual database table with proper indexes and constraints.

### Dependencies
- Task 25: Add Encashed Field (all model fields complete)
- Database configured (PostgreSQL)
- Django migrations system functional

### Instructions

1. **Verify model completeness**
   - Review LeaveBalance model in `leave_balance.py`
   - Ensure all fields from Tasks 20-25 are present
   - Confirm Meta class with unique_together constraint
   - Check all imports are correct

2. **Update models/__init__.py**
   - Ensure LeaveBalance is imported
   - Verify __all__ includes 'LeaveBalance'
   - Check proper import path

3. **Generate migration file**
   - Run: `python manage.py makemigrations leave`
   - Review generated migration file
   - Verify all fields are included
   - Check constraints and indexes

4. **Review migration file**
   - Confirm migration number (e.g., 0003_leave_balance.py)
   - Verify dependencies list previous migrations
   - Check field definitions match model
   - Review unique_together constraint

5. **Run migration**
   - Run: `python manage.py migrate leave`
   - Verify successful execution
   - Check for any errors or warnings
   - Confirm table created in database

6. **Verify database table**
   - Connect to database
   - Check table exists: `leave_balance`
   - Verify all columns present
   - Confirm indexes created
   - Test unique constraint

7. **Test model operations**
   - Create test LeaveBalance record
   - Test available_days property
   - Test validation methods
   - Verify relationships (employee, leave_type)

### Expected Migration File Structure

```python
# Generated migration: 0003_leave_balance.py
"""
Generated by Django on 2026-01-24
"""

from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('leave', '0002_leave_type_and_policy'),  # Previous migration
        ('employees', '0001_initial'),  # Employee model
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveBalance',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                
                # Core fields
                ('year', models.PositiveIntegerField(
                    validators=[
                        django.core.validators.MinValueValidator(2020),
                        django.core.validators.MaxValueValidator(2100)
                    ],
                    help_text='Calendar year for this balance'
                )),
                
                # Allocation fields
                ('opening_balance', models.DecimalField(
                    max_digits=6,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    help_text='Starting balance at beginning of year'
                )),
                ('allocated_days', models.DecimalField(
                    max_digits=6,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    help_text='Days accrued or granted during the year'
                )),
                ('carried_from_previous', models.DecimalField(
                    max_digits=6,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    help_text='Unused days carried forward from previous year'
                )),
                
                # Usage fields
                ('used_days', models.DecimalField(
                    max_digits=6,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    help_text='Days of approved leave taken'
                )),
                ('pending_days', models.DecimalField(
                    max_digits=6,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    help_text='Days of leave requests pending approval'
                )),
                ('encashed_days', models.DecimalField(
                    max_digits=6,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    help_text='Leave days converted to cash payment'
                )),
                
                # Control fields
                ('carry_forward_expiry', models.DateField(
                    null=True,
                    blank=True,
                    help_text='Date when carried forward leave expires'
                )),
                ('last_accrual_date', models.DateField(
                    null=True,
                    blank=True,
                    help_text='Last date accrual was calculated'
                )),
                ('is_active', models.BooleanField(
                    default=True,
                    help_text='Whether this balance record is active'
                )),
                
                # Relationships
                ('employee', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='leave_balances',
                    to='employees.employee',
                    help_text='Employee who owns this leave balance'
                )),
                ('leave_type', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT,
                    related_name='balances',
                    to='leave.leavetype',
                    help_text='Type of leave this balance tracks'
                )),
            ],
            options={
                'verbose_name': 'Leave Balance',
                'verbose_name_plural': 'Leave Balances',
                'ordering': ['-year', 'employee', 'leave_type'],
                'unique_together': {('employee', 'leave_type', 'year')},
            },
        ),
        
        # Indexes for performance
        migrations.AddIndex(
            model_name='leavebalance',
            index=models.Index(
                fields=['employee', 'year'],
                name='leave_emp_year_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='leavebalance',
            index=models.Index(
                fields=['leave_type', 'year', 'is_active'],
                name='leave_type_year_active_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='leavebalance',
            index=models.Index(
                fields=['carry_forward_expiry', 'is_active'],
                name='leave_expiry_active_idx'
            ),
        ),
    ]
```

### Database Table Structure

```sql
-- Generated PostgreSQL table structure

CREATE TABLE leave_balance (
    id                      BIGSERIAL PRIMARY KEY,
    
    -- Core fields
    employee_id             BIGINT NOT NULL REFERENCES employees_employee(id) ON DELETE CASCADE,
    leave_type_id           BIGINT NOT NULL REFERENCES leave_leavetype(id) ON DELETE PROTECT,
    year                    INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
    
    -- Allocation fields
    opening_balance         DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    allocated_days          DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    carried_from_previous   DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    
    -- Usage fields
    used_days               DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    pending_days            DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    encashed_days           DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    
    -- Control fields
    carry_forward_expiry    DATE NULL,
    last_accrual_date       DATE NULL,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps (if using TimestampMixin)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT leave_balance_unique UNIQUE (employee_id, leave_type_id, year)
);

-- Indexes
CREATE INDEX leave_balance_employee_id_idx ON leave_balance(employee_id);
CREATE INDEX leave_balance_leave_type_id_idx ON leave_balance(leave_type_id);
CREATE INDEX leave_balance_year_idx ON leave_balance(year);
CREATE INDEX leave_emp_year_idx ON leave_balance(employee_id, year);
CREATE INDEX leave_type_year_active_idx ON leave_balance(leave_type_id, year, is_active);
CREATE INDEX leave_expiry_active_idx ON leave_balance(carry_forward_expiry, is_active) WHERE is_active = TRUE;
```

### Migration Commands

```bash
Generate Migration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Generate migration file
python manage.py makemigrations leave

Expected Output:
  Migrations for 'leave':
    leave/migrations/0003_leave_balance.py
      - Create model LeaveBalance
      - Add index leave_emp_year_idx on field(s) employee, year of model leavebalance
      - Add index leave_type_year_active_idx on field(s) leave_type, year, is_active of model leavebalance
      - Add index leave_expiry_active_idx on field(s) carry_forward_expiry, is_active of model leavebalance

Review Migration (Optional):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Show SQL that will be executed
python manage.py sqlmigrate leave 0003

# Check migration status
python manage.py showmigrations leave

Run Migration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Apply migration to database
python manage.py migrate leave

Expected Output:
  Operations to perform:
    Apply all migrations: leave
  Running migrations:
    Applying leave.0003_leave_balance... OK

Verify Migration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Check table exists
python manage.py dbshell
\dt leave_balance
\d leave_balance  # Show table structure
```

### Post-Migration Testing

```python
# Test in Django shell: python manage.py shell

from apps.leave.models import LeaveBalance, LeaveType
from apps.employees.models import Employee
from decimal import Decimal
from datetime import date

# Create test balance
employee = Employee.objects.first()
leave_type = LeaveType.objects.get(name='Annual Leave')

balance = LeaveBalance.objects.create(
    employee=employee,
    leave_type=leave_type,
    year=2026,
    opening_balance=Decimal('14.00'),
    carried_from_previous=Decimal('3.00'),
)

# Test computed property
print(f"Available days: {balance.available_days}")
# Expected: 17.00

# Test usage
balance.used_days = Decimal('5.00')
balance.pending_days = Decimal('2.00')
balance.save()

print(f"Available after usage: {balance.available_days}")
# Expected: 10.00 (14 + 3 - 5 - 2)

# Test unique constraint
try:
    duplicate = LeaveBalance.objects.create(
        employee=employee,
        leave_type=leave_type,
        year=2026,  # Same year
        opening_balance=Decimal('14.00'),
    )
except IntegrityError:
    print("Unique constraint working correctly!")

# Test relationship
print(f"Employee balances: {employee.leave_balances.count()}")
print(f"Leave type balances: {leave_type.balances.count()}")

# Test methods
print(f"Can encash 3 days: {balance.can_encash_days(Decimal('3.00'))}")
print(f"Sufficient balance for 5 days: {balance.has_sufficient_balance(Decimal('5.00'))}")
```

### Verification Checklist

- [ ] All fields from Tasks 20-25 present in model
- [ ] Models __init__.py imports LeaveBalance
- [ ] makemigrations command executed successfully
- [ ] Migration file generated (0003_leave_balance.py)
- [ ] Migration dependencies correct
- [ ] All fields in migration match model
- [ ] unique_together constraint included
- [ ] Indexes defined in migration
- [ ] migrate command executed successfully
- [ ] Table created in database
- [ ] All columns present in table
- [ ] Constraints working correctly
- [ ] Indexes created
- [ ] Test record creation successful
- [ ] Computed properties working
- [ ] Methods functioning correctly
- [ ] Relationships working (employee, leave_type)

---

## Summary

This document established the LeaveBalance model foundation:

### Completed Infrastructure
- ✅ AccrualMethod constants (ANNUAL_GRANT, MONTHLY_ACCRUAL, PRO_RATA)
- ✅ Core LeaveBalance model with unique constraint
- ✅ Core identification fields (employee, leave_type, year)
- ✅ Allocation fields (opening, allocated, carried)
- ✅ Usage fields (used, pending, available computed property)
- ✅ Carry forward expiry field with validation
- ✅ Encashment field with validation
- ✅ Database migrations applied

### Key Achievements
1. **Accrual Methods** - Three distinct methods for leave allocation
2. **Balance Tracking** - Precise tracking with Decimal(6,2) fields
3. **Unique Constraint** - One record per employee-type-year
4. **Computed Balance** - Real-time available_days calculation
5. **Expiry Support** - Carry forward expiry tracking
6. **Encashment Support** - Leave-to-cash conversion tracking
7. **Database Ready** - Migrations applied, table operational

### Model Summary

```
LeaveBalance Model:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core: employee, leave_type, year (unique together)
Allocation: opening_balance, allocated_days, carried_from_previous
Usage: used_days, pending_days, encashed_days
Computed: available_days property
Control: carry_forward_expiry, last_accrual_date, is_active
Methods: has_sufficient_balance, is_carry_forward_expired, can_encash_days
```

### Next Steps
Proceed to [02_Tasks-27-34_Accrual-Service-Tasks.md](02_Tasks-27-34_Accrual-Service-Tasks.md) to implement the LeaveAccrualService with annual grant, monthly accrual, pro-rata calculations, carry forward logic, expiry processing, and year-end Celery task.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8 (Tasks 19-26)  
**Estimated Time:** 2 hours 5 minutes
