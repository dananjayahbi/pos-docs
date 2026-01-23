# Tasks 33-40: Loyalty Program and Customer Account Models

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** C - Loyalty Points System  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-46_Points-Transaction-Earning.md](02_Tasks-41-46_Points-Transaction-Earning.md)

---

## Document Overview

This document establishes the foundation of the loyalty points system by creating the LoyaltyProgram and CustomerLoyalty models. These models manage program configuration and customer loyalty accounts, including points earning rules, program activation, and customer points balances.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create LoyaltyProgram Model | Medium | 25 min |
| 34 | Add Program Settings | Medium | 20 min |
| 35 | Add Program Active Fields | Low | 15 min |
| 36 | Run Program Migrations | Low | 15 min |
| 37 | Create CustomerLoyalty Model | Medium | 25 min |
| 38 | Add Points Balance Fields | Medium | 20 min |
| 39 | Add Tier Fields | Medium | 20 min |
| 40 | Run Loyalty Account Migrations | Low | 15 min |

---

## Task 33: Create LoyaltyProgram Model

### Overview
Create the LoyaltyProgram model to define loyalty program configurations for each tenant. This model stores the rules and settings that govern how customers earn and redeem loyalty points, including earning rates, minimum purchase requirements, and program activation.

### Dependencies
- Credit app exists (`apps/credit/`)
- BaseModel or TimestampedModel available
- Tenant model configured

### Instructions

1. **Create loyalty program model file**
   - Navigate to `apps/credit/models/` directory
   - Create new file `loyalty_program.py`
   - This contains loyalty program configuration

2. **Import required dependencies**
   - Import Django model components
   - Import Decimal and date types
   - Import BaseModel or create with common fields
   - Import tenant model

3. **Create LoyaltyProgram model class**
   - Inherit from BaseModel (includes id, created, modified)
   - Add comprehensive model docstring
   - Describe program configuration purpose

4. **Add tenant relationship**
   - ForeignKey to Tenant model
   - CASCADE deletion (program deleted with tenant)
   - related_name='loyalty_programs'
   - Allows tenant to have multiple program versions

5. **Add program name field**
   - CharField max_length=200
   - Program display name
   - Example: "Platinum Rewards", "VIP Club"
   - Not unique (different tenants can use same name)

6. **Add program description**
   - TextField blank=True, null=True
   - Detailed program information
   - Benefits, terms, conditions
   - Displayed to customers

7. **Configure Meta class**
   - db_table = 'credit_loyalty_program'
   - verbose_name = 'Loyalty Program'
   - verbose_name_plural = 'Loyalty Programs'
   - ordering = ['-created']
   - Default ordering by creation date

8. **Add __str__ method**
   - Return program name and tenant
   - Format: "{name} - {tenant.name}"
   - Helpful in admin interface

### Model Purpose

| Field | Type | Purpose |
|-------|------|---------|
| tenant | ForeignKey | Program owner tenant |
| name | CharField | Program display name |
| description | TextField | Program details |

### Loyalty Program Types

#### Basic Rewards Program
```
Name: "Shop & Earn Rewards"
Description: Earn 1 point for every Rs. 100 spent. 
Redeem 100 points for Rs. 100 discount.
```

#### Premium VIP Program
```
Name: "VIP Platinum Club"
Description: Exclusive rewards for our valued customers.
Earn 2x points on all purchases. Special birthday bonuses.
```

#### Category-Specific Program
```
Name: "Electronics Rewards"
Description: Extra points on electronics purchases.
Double points on laptops, phones, tablets.
```

### Expected Outcome
- Core LoyaltyProgram model created
- Tenant-specific program support
- Foundation for program rules

### Verification Checklist
- [ ] `loyalty_program.py` file created
- [ ] LoyaltyProgram class defined
- [ ] Inherits from BaseModel
- [ ] tenant ForeignKey configured
- [ ] name CharField added
- [ ] description TextField added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model docstring included

---

## Task 34: Add Program Settings

### Overview
Add program settings fields that control points earning rates, minimum purchase requirements, and points expiry. These settings define the core mechanics of how the loyalty program operates.

### Dependencies
- Task 33: Create LoyaltyProgram Model

### Instructions

1. **Open loyalty program model**
   - Navigate to `apps/credit/models/loyalty_program.py`
   - Locate LoyaltyProgram class

2. **Add points earning rate field**
   - DecimalField: points_per_currency
   - max_digits=5, decimal_places=2
   - default=Decimal('1.00')
   - Points earned per Rs. 100 spent

3. **Add earning rate help text**
   - help_text explaining calculation
   - "Points earned per Rs. 100 spent. E.g., 1.00 = 1 point per Rs. 100"
   - Clarifies the earning formula

4. **Add minimum purchase field**
   - DecimalField: min_purchase_for_points
   - max_digits=10, decimal_places=2
   - default=Decimal('0.00')
   - Minimum purchase to earn points

5. **Add minimum purchase help text**
   - help_text for minimum requirement
   - "Minimum purchase amount to earn points. 0 = no minimum"
   - Explains threshold behavior

6. **Add points expiry months field**
   - PositiveIntegerField: points_expiry_months
   - default=12
   - null=True, blank=True
   - Number of months until points expire

7. **Add expiry help text**
   - help_text for expiry logic
   - "Months until points expire. Null = never expire"
   - Explains expiry mechanism

8. **Add redemption minimum field**
   - PositiveIntegerField: min_points_for_redemption
   - default=100
   - Minimum points required to redeem
   - Prevents small redemptions

9. **Add redemption value field**
   - DecimalField: redemption_value_per_point
   - max_digits=5, decimal_places=2
   - default=Decimal('1.00')
   - Monetary value per point (Rs.)

### Points Earning Formula

```
Base Calculation:
──────────────────────────────────────────────────
purchase_amount = Rs. 5,500
points_per_currency = 1.00
min_purchase_for_points = Rs. 100

Step 1: Check minimum purchase
if purchase_amount >= min_purchase_for_points:
    continue
else:
    return 0 points

Step 2: Calculate base points
currency_units = floor(purchase_amount / 100)
                = floor(5500 / 100)
                = 55 units

base_points = currency_units × points_per_currency
            = 55 × 1.00
            = 55 points

Step 3: Apply tier multiplier (from CustomerLoyalty)
tier_multiplier = 1.5 (Gold Tier)
final_points = base_points × tier_multiplier
             = 55 × 1.5
             = 82.5 → floor to 82 points
```

### Program Settings Examples

#### Conservative Program
```
Points Per Rs. 100: 0.50 points
Minimum Purchase: Rs. 500
Points Expiry: 6 months
Min Redemption: 200 points
Redemption Value: Rs. 0.50 per point

Example: Rs. 5,000 purchase = 25 points = Rs. 12.50 value
```

#### Generous Program
```
Points Per Rs. 100: 2.00 points
Minimum Purchase: Rs. 100
Points Expiry: 24 months
Min Redemption: 50 points
Redemption Value: Rs. 1.00 per point

Example: Rs. 5,000 purchase = 100 points = Rs. 100 value
```

#### No Expiry Program
```
Points Per Rs. 100: 1.00 points
Minimum Purchase: Rs. 0 (none)
Points Expiry: null (never expires)
Min Redemption: 100 points
Redemption Value: Rs. 1.00 per point

Example: Rs. 5,000 purchase = 50 points = Rs. 50 value
```

### Points Expiry Logic

```
Scenario: Points expire after 12 months
──────────────────────────────────────────────────
Earn Date: January 15, 2026
Points: 150 points
Expiry Calculation: January 15, 2026 + 12 months
Expiry Date: January 15, 2027

Status Check (December 2026):
Points Status: Active (still valid)

Status Check (February 2027):
Points Status: Expired (auto-flagged by Celery task)
Action: Mark as expired, deduct from balance
```

### Redemption Scenarios

#### Scenario 1: Sufficient Points
```
Customer Balance: 500 points
Min Redemption: 100 points
Redemption Value: Rs. 1.00 per point
Purchase: Rs. 2,000

Customer redeems 300 points
Discount: 300 × Rs. 1.00 = Rs. 300
Final Amount: Rs. 2,000 - Rs. 300 = Rs. 1,700
Remaining Balance: 500 - 300 = 200 points
```

#### Scenario 2: Below Minimum
```
Customer Balance: 75 points
Min Redemption: 100 points
Result: Cannot redeem (below minimum)
Message: "Minimum 100 points required for redemption"
```

### Expected Outcome
- Points earning rate configured
- Minimum purchase threshold set
- Points expiry timeframe defined
- Redemption rules established

### Verification Checklist
- [ ] points_per_currency field added
- [ ] min_purchase_for_points field added
- [ ] points_expiry_months field added
- [ ] min_points_for_redemption field added
- [ ] redemption_value_per_point field added
- [ ] All Decimal fields use appropriate precision
- [ ] Default values set appropriately
- [ ] Help text added to all fields
- [ ] Fields allow null/blank where appropriate

---

## Task 35: Add Program Active Fields

### Overview
Add fields to control loyalty program activation status, including active/inactive flags and date range constraints. These fields enable scheduled program launches and automatic deactivation.

### Dependencies
- Task 34: Add Program Settings

### Instructions

1. **Open loyalty program model**
   - Navigate to `apps/credit/models/loyalty_program.py`
   - Locate LoyaltyProgram class

2. **Add is_active field**
   - BooleanField: is_active
   - default=True
   - Controls if program is currently active
   - Allows manual deactivation

3. **Add active field help text**
   - help_text for active flag
   - "Program is currently active and accepting new members"
   - Clarifies immediate activation status

4. **Add start date field**
   - DateField: start_date
   - null=True, blank=True
   - Program becomes active on this date
   - Used for scheduled launches

5. **Add start date help text**
   - help_text for start date
   - "Program activation date. Null = active immediately"
   - Explains scheduled activation

6. **Add end date field**
   - DateField: end_date
   - null=True, blank=True
   - Program automatically deactivates after this date
   - Used for limited-time programs

7. **Add end date help text**
   - help_text for end date
   - "Program end date. Null = no end date"
   - Explains program termination

8. **Add program version field**
   - PositiveIntegerField: version
   - default=1
   - Tracks program version for updates
   - Useful for program revisions

9. **Create is_currently_active method**
   - Property or instance method
   - Checks is_active flag
   - Validates start_date <= today
   - Validates end_date >= today or null
   - Returns boolean

10. **Create days_until_expiry method**
    - Property or instance method
    - Calculates days until end_date
    - Returns None if no end_date
    - Returns negative if expired

### Program Activation States

```
State Diagram:
─────────────────────────────────────────────────────

┌─────────────┐
│   PLANNED   │  is_active=True, start_date > today
└──────┬──────┘
       │ (start_date arrives)
       ▼
┌─────────────┐
│   ACTIVE    │  is_active=True, start <= today <= end
└──────┬──────┘
       │ (end_date arrives OR is_active=False)
       ▼
┌─────────────┐
│  INACTIVE   │  is_active=False OR today > end_date
└─────────────┘
```

### Activation Scenarios

#### Scenario 1: Immediate Activation
```
Configuration:
├── is_active: True
├── start_date: null
└── end_date: null

Result: Program active immediately and indefinitely
Status Check: is_currently_active() → True
```

#### Scenario 2: Scheduled Launch
```
Configuration:
├── is_active: True
├── start_date: 2026-02-01
└── end_date: null

Today: 2026-01-24
Result: Program not yet active (planned)
Status Check: is_currently_active() → False

Today: 2026-02-15
Result: Program active
Status Check: is_currently_active() → True
```

#### Scenario 3: Limited Time Program
```
Configuration:
├── is_active: True
├── start_date: 2026-02-01
└── end_date: 2026-03-31

Timeline:
├── 2026-01-24: Not active (before start)
├── 2026-02-15: Active (within range)
├── 2026-03-15: Active (within range)
└── 2026-04-15: Not active (past end date)
```

#### Scenario 4: Manual Deactivation
```
Configuration:
├── is_active: False
├── start_date: 2026-01-01
└── end_date: 2026-12-31

Result: Program inactive despite valid date range
Reason: Manually deactivated by admin
Status Check: is_currently_active() → False
```

### is_currently_active Logic

```python
Pseudo-code:
─────────────────────────────────────────────────────

def is_currently_active():
    # Check 1: Manual deactivation
    if not self.is_active:
        return False
    
    # Check 2: Start date validation
    if self.start_date and self.start_date > today:
        return False  # Not started yet
    
    # Check 3: End date validation
    if self.end_date and self.end_date < today:
        return False  # Already ended
    
    # All checks passed
    return True
```

### Days Until Expiry Examples

```
Program End Date: 2026-03-31
─────────────────────────────────────────────────────

Today: 2026-01-24
days_until_expiry() → 66 days

Today: 2026-03-25
days_until_expiry() → 6 days

Today: 2026-04-05
days_until_expiry() → -5 days (expired)

End Date: null
days_until_expiry() → None (no expiry)
```

### Expected Outcome
- Program activation control
- Scheduled program launches
- Automatic program termination
- Active status validation

### Verification Checklist
- [ ] is_active field added
- [ ] start_date field added
- [ ] end_date field added
- [ ] version field added
- [ ] is_currently_active method created
- [ ] days_until_expiry method created
- [ ] Help text added to all fields
- [ ] Date fields allow null/blank
- [ ] Logic handles null dates properly

---

## Task 36: Run Program Migrations

### Overview
Generate and apply Django migrations for the LoyaltyProgram model. This task creates the database table with all configured fields and constraints.

### Dependencies
- Task 35: Add Program Active Fields

### Instructions

1. **Verify model completeness**
   - Open `loyalty_program.py`
   - Ensure all fields from Tasks 33-35 are present
   - Check Meta class configuration

2. **Register model in models init**
   - Open `apps/credit/models/__init__.py`
   - Import LoyaltyProgram
   - Add to __all__ list

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations credit`

4. **Review generated migration**
   - Navigate to `apps/credit/migrations/`
   - Open newest migration file (e.g., 0004_loyaltyprogram.py)
   - Verify all fields present
   - Check field types and constraints

5. **Check migration dependencies**
   - Ensure migration depends on previous credit migrations
   - Verify tenant model dependency if needed

6. **Apply migration to database**
   - Run: `python manage.py migrate credit`
   - Confirm successful table creation
   - No errors in output

7. **Verify database table**
   - Check table exists: credit_loyalty_program
   - Verify columns match model fields
   - Check indexes created properly

8. **Test model in Django shell**
   - Run: `python manage.py shell`
   - Import LoyaltyProgram
   - Create test instance
   - Verify save and retrieval

### Migration Review Checklist

```
Expected Migration Operations:
─────────────────────────────────────────────────────
✓ CreateModel: LoyaltyProgram
  ├── Field: id (UUIDField primary key)
  ├── Field: created (DateTimeField auto_now_add)
  ├── Field: modified (DateTimeField auto_now)
  ├── Field: tenant (ForeignKey to Tenant)
  ├── Field: name (CharField max_length=200)
  ├── Field: description (TextField null, blank)
  ├── Field: points_per_currency (DecimalField)
  ├── Field: min_purchase_for_points (DecimalField)
  ├── Field: points_expiry_months (PositiveIntegerField)
  ├── Field: min_points_for_redemption (PositiveIntegerField)
  ├── Field: redemption_value_per_point (DecimalField)
  ├── Field: is_active (BooleanField default True)
  ├── Field: start_date (DateField null, blank)
  ├── Field: end_date (DateField null, blank)
  └── Field: version (PositiveIntegerField default 1)

✓ Indexes:
  └── tenant_id (for filtering by tenant)

✓ Constraints:
  └── None required (handled by application logic)
```

### Database Table Structure

```sql
Table: credit_loyalty_program
─────────────────────────────────────────────────────
Column                     | Type           | Nullable
──────────────────────────────────────────────────────
id                         | UUID           | NOT NULL
created                    | TIMESTAMP      | NOT NULL
modified                   | TIMESTAMP      | NOT NULL
tenant_id                  | UUID           | NOT NULL
name                       | VARCHAR(200)   | NOT NULL
description                | TEXT           | NULL
points_per_currency        | DECIMAL(5,2)   | NOT NULL
min_purchase_for_points    | DECIMAL(10,2)  | NOT NULL
points_expiry_months       | INTEGER        | NULL
min_points_for_redemption  | INTEGER        | NOT NULL
redemption_value_per_point | DECIMAL(5,2)   | NOT NULL
is_active                  | BOOLEAN        | NOT NULL
start_date                 | DATE           | NULL
end_date                   | DATE           | NULL
version                    | INTEGER        | NOT NULL

Foreign Keys:
├── tenant_id → tenants.id (CASCADE)

Indexes:
├── PRIMARY KEY (id)
└── INDEX (tenant_id)
```

### Shell Test Example

```python
Shell Commands:
─────────────────────────────────────────────────────

# Import models
from apps.credit.models import LoyaltyProgram
from apps.tenants.models import Tenant
from decimal import Decimal
from datetime import date

# Get or create tenant
tenant = Tenant.objects.first()

# Create loyalty program
program = LoyaltyProgram.objects.create(
    tenant=tenant,
    name="Gold Rewards Program",
    description="Earn 1 point per Rs. 100",
    points_per_currency=Decimal('1.00'),
    min_purchase_for_points=Decimal('100.00'),
    points_expiry_months=12,
    min_points_for_redemption=100,
    redemption_value_per_point=Decimal('1.00'),
    is_active=True,
    start_date=date.today(),
    version=1
)

# Verify creation
print(program)
print(f"ID: {program.id}")
print(f"Active: {program.is_currently_active()}")

# Query programs
programs = LoyaltyProgram.objects.filter(tenant=tenant)
print(f"Total programs: {programs.count()}")
```

### Expected Outcome
- Migration file generated successfully
- Database table created
- All fields present and correct
- Model functional in Django shell

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration dependencies correct
- [ ] All fields present in migration
- [ ] Migration applied successfully
- [ ] Table exists in database
- [ ] Model imported in __init__.py
- [ ] Shell test successful
- [ ] No migration warnings or errors

---

## Task 37: Create CustomerLoyalty Model

### Overview
Create the CustomerLoyalty model to track each customer's loyalty account. This model stores points balance, earning history, tier membership, and account status for loyalty program participants.

### Dependencies
- Task 36: Run Program Migrations
- Customer model exists

### Instructions

1. **Create customer loyalty model file**
   - Navigate to `apps/credit/models/` directory
   - Create new file `customer_loyalty.py`
   - This contains customer loyalty accounts

2. **Import required dependencies**
   - Import Django model components
   - Import Customer model
   - Import LoyaltyProgram model
   - Import BaseModel

3. **Create CustomerLoyalty model class**
   - Inherit from BaseModel
   - Add comprehensive model docstring
   - Describe customer loyalty account purpose

4. **Add customer relationship**
   - OneToOneField to Customer model
   - CASCADE deletion
   - related_name='loyalty_account'
   - Each customer has one loyalty account

5. **Add program relationship**
   - ForeignKey to LoyaltyProgram
   - SET_NULL deletion (keep account if program deleted)
   - null=True, blank=True
   - related_name='customer_accounts'

6. **Add enrollment date field**
   - DateField: enrolled_date
   - auto_now_add=True
   - Tracks when customer joined program
   - Cannot be modified

7. **Add account status field**
   - CharField: status
   - choices=LOYALTY_STATUS_CHOICES
   - default='active'
   - Values: active, suspended, closed

8. **Define LOYALTY_STATUS_CHOICES**
   - Create tuple of status choices
   - ACTIVE = 'active'
   - SUSPENDED = 'suspended'
   - CLOSED = 'closed'

9. **Configure Meta class**
   - db_table = 'credit_customer_loyalty'
   - verbose_name = 'Customer Loyalty Account'
   - verbose_name_plural = 'Customer Loyalty Accounts'
   - ordering = ['-enrolled_date']

10. **Add __str__ method**
    - Return customer name and status
    - Format: "{customer.name} - {status}"
    - Include points balance if possible

### Model Purpose

| Field | Type | Purpose |
|-------|------|---------|
| customer | OneToOneField | Account owner |
| program | ForeignKey | Enrolled program |
| enrolled_date | DateField | Join date |
| status | CharField | Account status |

### Customer Loyalty Account States

```
Account Lifecycle:
─────────────────────────────────────────────────────

┌─────────────┐
│  CREATED    │  New customer, no loyalty yet
└──────┬──────┘
       │ (enroll in program)
       ▼
┌─────────────┐
│   ACTIVE    │  Earning and redeeming points
└──────┬──────┘
       │
       ├─→ (violation) ─→ SUSPENDED ─→ (review) ─→ ACTIVE
       │
       └─→ (customer request) ─→ CLOSED
```

### Account Status Definitions

#### ACTIVE Status
```
Description: Normal operating status
Capabilities:
├── Earn points on purchases
├── Redeem points for discounts
├── Access tier benefits
├── Receive rewards
└── Participate in promotions

Conditions:
├── Customer account in good standing
├── No policy violations
└── Loyalty program is active
```

#### SUSPENDED Status
```
Description: Temporarily disabled
Capabilities:
├── Cannot earn points
├── Cannot redeem points
├── Tier benefits frozen
├── No rewards eligibility
└── Points balance retained

Reasons for Suspension:
├── Policy violation
├── Fraud investigation
├── Customer dispute
└── Administrative hold
```

#### CLOSED Status
```
Description: Permanently terminated
Capabilities:
├── No point earning
├── No point redemption
├── Tier membership revoked
├── Rewards forfeited
└── Account cannot be reopened

Reasons for Closure:
├── Customer request
├── Account inactivity
├── Program termination
└── Business decision
```

### Enrollment Scenarios

#### New Customer Enrollment
```
Event: Customer makes first purchase
Action: Automatic enrollment

Process:
1. Check if customer has loyalty account
2. If not, create CustomerLoyalty record
3. Link to active loyalty program
4. Set status = 'active'
5. Set enrolled_date = today
6. Initialize points balance = 0
```

#### Existing Customer Re-enrollment
```
Event: Customer previously closed account
Action: Manual re-enrollment

Process:
1. Check for existing CLOSED account
2. Cannot reactivate (create new)
3. Create new CustomerLoyalty record
4. Previous history retained separately
5. Start with fresh points balance
```

### OneToOne Relationship Benefits

```
Customer ←→ CustomerLoyalty (OneToOne)
─────────────────────────────────────────────────────

Advantages:
├── customer.loyalty_account (direct access)
├── No duplicate loyalty accounts
├── Data integrity enforced
├── Simplified queries
└── Clear ownership

Usage Example:
# Get customer's loyalty account
customer = Customer.objects.get(id=customer_id)
loyalty = customer.loyalty_account  # Direct access

# Check if customer has loyalty
if hasattr(customer, 'loyalty_account'):
    points = customer.loyalty_account.points_balance
```

### Expected Outcome
- Customer loyalty account model created
- One-to-one customer relationship
- Account status tracking
- Enrollment date recorded

### Verification Checklist
- [ ] `customer_loyalty.py` file created
- [ ] CustomerLoyalty class defined
- [ ] Inherits from BaseModel
- [ ] customer OneToOneField configured
- [ ] program ForeignKey configured
- [ ] enrolled_date field added
- [ ] status field with choices added
- [ ] LOYALTY_STATUS_CHOICES defined
- [ ] Meta class configured
- [ ] __str__ method implemented

---

## Task 38: Add Points Balance Fields

### Overview
Add fields to track customer points balances, including current available points, lifetime earned points, and total redeemed points. These fields provide complete visibility into customer loyalty activity.

### Dependencies
- Task 37: Create CustomerLoyalty Model

### Instructions

1. **Open customer loyalty model**
   - Navigate to `apps/credit/models/customer_loyalty.py`
   - Locate CustomerLoyalty class

2. **Add current points balance field**
   - IntegerField: points_balance
   - default=0
   - Current available points
   - Updated on earn/redeem/expire

3. **Add balance help text**
   - help_text for points_balance
   - "Current available points (after redemptions and expiries)"
   - Clarifies this is net balance

4. **Add lifetime earned field**
   - IntegerField: lifetime_points_earned
   - default=0
   - Total points ever earned
   - Never decreases (cumulative)

5. **Add lifetime help text**
   - help_text for lifetime earned
   - "Total points earned since enrollment (never decreases)"
   - Clarifies cumulative nature

6. **Add total redeemed field**
   - IntegerField: total_points_redeemed
   - default=0
   - Total points ever redeemed
   - Cumulative redemption history

7. **Add redeemed help text**
   - help_text for total redeemed
   - "Total points redeemed for discounts"
   - Clarifies usage history

8. **Add last activity date field**
   - DateTimeField: last_activity_date
   - null=True, blank=True
   - auto_now=True
   - Updated on any points activity

9. **Create available_points property**
   - Property decorator
   - Returns points_balance minus expired
   - Excludes points scheduled to expire
   - Real-time calculation

10. **Create redemption_value method**
    - Method with points parameter
    - Calculates monetary value of points
    - Uses program redemption_value_per_point
    - Returns Decimal amount

### Points Balance Tracking

```
Balance Equation:
─────────────────────────────────────────────────────

points_balance = lifetime_points_earned 
                 - total_points_redeemed 
                 - total_points_expired

Invariants:
├── points_balance >= 0 (never negative)
├── lifetime_points_earned >= total_points_redeemed
└── points_balance <= lifetime_points_earned
```

### Balance Update Scenarios

#### Scenario 1: Earning Points
```
Initial State:
├── points_balance: 500
├── lifetime_points_earned: 2,000
└── total_points_redeemed: 1,500

Event: Purchase Rs. 3,000 → Earn 30 points

Updated State:
├── points_balance: 530 (+30)
├── lifetime_points_earned: 2,030 (+30)
└── total_points_redeemed: 1,500 (unchanged)
```

#### Scenario 2: Redeeming Points
```
Initial State:
├── points_balance: 530
├── lifetime_points_earned: 2,030
└── total_points_redeemed: 1,500

Event: Redeem 200 points for Rs. 200 discount

Updated State:
├── points_balance: 330 (-200)
├── lifetime_points_earned: 2,030 (unchanged)
└── total_points_redeemed: 1,700 (+200)
```

#### Scenario 3: Points Expiry
```
Initial State:
├── points_balance: 330
├── lifetime_points_earned: 2,030
└── total_points_redeemed: 1,700

Event: 50 points expire (older than 12 months)

Updated State:
├── points_balance: 280 (-50)
├── lifetime_points_earned: 2,030 (unchanged)
└── total_points_redeemed: 1,700 (unchanged)

Note: Expiry tracked separately in PointsTransaction
```

### Lifetime Points Examples

#### Customer A: Active User
```
Timeline: 2 years of membership

Lifetime Earned: 15,000 points
├── Year 1: 8,000 points
└── Year 2: 7,000 points

Total Redeemed: 10,000 points
├── Year 1: 5,000 points
└── Year 2: 5,000 points

Expired: 2,000 points
└── From Year 1 purchases

Current Balance: 3,000 points
Calculation: 15,000 - 10,000 - 2,000 = 3,000
```

#### Customer B: Occasional User
```
Timeline: 1 year of membership

Lifetime Earned: 500 points
└── Small purchases

Total Redeemed: 0 points
└── Never used points

Expired: 0 points
└── Points still valid

Current Balance: 500 points
Calculation: 500 - 0 - 0 = 500
```

### available_points Property Logic

```python
Pseudo-code:
─────────────────────────────────────────────────────

@property
def available_points(self):
    # Get current balance
    balance = self.points_balance
    
    # Calculate pending expiries (within 30 days)
    today = date.today()
    expiry_threshold = today + timedelta(days=30)
    
    pending_expiry = PointsTransaction.objects.filter(
        customer_loyalty=self,
        type='EARN',
        expiry_date__lte=expiry_threshold,
        expiry_date__gt=today
    ).aggregate(Sum('points'))['points__sum'] or 0
    
    # Return points excluding pending expiries
    return balance - pending_expiry
```

### Redemption Value Calculation

```
Calculation Examples:
─────────────────────────────────────────────────────

Program Setting: Rs. 1.00 per point

Points: 250
Value: 250 × Rs. 1.00 = Rs. 250.00

Points: 1,500
Value: 1,500 × Rs. 1.00 = Rs. 1,500.00

---

Program Setting: Rs. 0.50 per point

Points: 250
Value: 250 × Rs. 0.50 = Rs. 125.00

Points: 1,500
Value: 1,500 × Rs. 0.50 = Rs. 750.00
```

### Expected Outcome
- Current points balance tracked
- Lifetime earning history
- Total redemption history
- Last activity timestamp

### Verification Checklist
- [ ] points_balance field added
- [ ] lifetime_points_earned field added
- [ ] total_points_redeemed field added
- [ ] last_activity_date field added
- [ ] available_points property created
- [ ] redemption_value method created
- [ ] All fields have help_text
- [ ] Default values set to 0
- [ ] Integer fields used (no decimals)

---

## Task 39: Add Tier Fields

### Overview
Add fields to track customer tier membership, including current tier assignment, tier evaluation date, and tier expiry date. These fields integrate with the loyalty tier system for tiered benefits.

### Dependencies
- Task 38: Add Points Balance Fields

### Instructions

1. **Open customer loyalty model**
   - Navigate to `apps/credit/models/customer_loyalty.py`
   - Locate CustomerLoyalty class

2. **Add current tier field**
   - ForeignKey: current_tier
   - to='LoyaltyTier' model (forward reference)
   - SET_NULL on deletion
   - null=True, blank=True
   - related_name='customers'

3. **Add tier help text**
   - help_text for current_tier
   - "Current loyalty tier (Bronze, Silver, Gold, Platinum)"
   - Clarifies tier assignment

4. **Add tier evaluation date**
   - DateTimeField: tier_evaluated_at
   - null=True, blank=True
   - Last time tier was evaluated
   - Updated by evaluation task

5. **Add tier expiry date**
   - DateField: tier_expiry_date
   - null=True, blank=True
   - When current tier expires
   - Customer may be downgraded

6. **Add tier expiry help text**
   - help_text for tier_expiry
   - "Date when tier expires (null = no expiry)"
   - Explains tier retention

7. **Add tier upgrade date field**
   - DateTimeField: tier_upgraded_at
   - null=True, blank=True
   - When customer was last upgraded
   - Tracks tier progression

8. **Create tier_name property**
   - Property decorator
   - Returns current_tier.name if exists
   - Returns "No Tier" if null
   - Display-friendly tier name

9. **Create tier_multiplier property**
   - Property decorator
   - Returns current_tier.points_multiplier
   - Returns 1.0 if no tier
   - Used in points calculation

10. **Create is_tier_expired method**
    - Instance method
    - Checks tier_expiry_date < today
    - Returns boolean
    - Triggers tier downgrade

### Tier Relationship Structure

```
CustomerLoyalty → LoyaltyTier (Many-to-One)
─────────────────────────────────────────────────────

One tier can have many customers
One customer has one active tier

Relationship Benefits:
├── Efficient tier queries
├── Centralized tier configuration
├── Easy tier updates
└── Clear tier hierarchy

Example:
Gold Tier (LoyaltyTier)
├── Customer A (CustomerLoyalty)
├── Customer B (CustomerLoyalty)
├── Customer C (CustomerLoyalty)
└── 1,523 other customers
```

### Tier Assignment Scenarios

#### Scenario 1: New Customer (No Tier)
```
Customer: Just enrolled
Tier Assignment: null (Bronze by default in logic)

Fields:
├── current_tier: null
├── tier_evaluated_at: null
├── tier_expiry_date: null
└── tier_upgraded_at: null

Points Multiplier: 1.0 (default)
Tier Benefits: None (or Bronze benefits)
```

#### Scenario 2: Upgraded to Gold
```
Event: Customer reaches 5,000 points and Rs. 100,000 spend

Before:
├── current_tier: Silver
├── tier_evaluated_at: 2025-12-01
├── tier_expiry_date: 2026-11-30 (1 year)
└── tier_upgraded_at: 2025-12-01

After:
├── current_tier: Gold
├── tier_evaluated_at: 2026-01-24 (today)
├── tier_expiry_date: 2027-01-24 (1 year from upgrade)
└── tier_upgraded_at: 2026-01-24 (today)

Benefits:
├── Points Multiplier: 1.5x
├── Discount: 10%
├── Free Shipping: Yes
└── Priority Support: Yes
```

#### Scenario 3: Tier Expiry
```
Customer: Gold tier expires due to inactivity

Before Expiry:
├── current_tier: Gold
├── tier_expiry_date: 2026-01-20
└── Tier Status: Active

After Expiry (2026-01-24):
├── current_tier: Silver (downgraded)
├── tier_expiry_date: 2027-01-24 (new expiry)
└── Tier Status: Downgraded

Reason: No qualifying activity in past 12 months
Action: Celery task auto-downgrades tier
```

### Tier Multiplier in Points Calculation

```
Purchase Scenario:
─────────────────────────────────────────────────────

Purchase Amount: Rs. 10,000
Base Points: 100 points (Rs. 100 = 1 point)

Customer A (No Tier):
├── Multiplier: 1.0
└── Points Earned: 100 × 1.0 = 100 points

Customer B (Silver):
├── Multiplier: 1.25
└── Points Earned: 100 × 1.25 = 125 points

Customer C (Gold):
├── Multiplier: 1.5
└── Points Earned: 100 × 1.5 = 150 points

Customer D (Platinum):
├── Multiplier: 2.0
└── Points Earned: 100 × 2.0 = 200 points
```

### Tier Evaluation Frequency

```
Evaluation Schedule:
─────────────────────────────────────────────────────

Automatic Evaluation:
├── Daily Celery task (2:00 AM)
├── Checks all customer accounts
├── Evaluates tier eligibility
└── Upgrades or downgrades as needed

Manual Evaluation:
├── Admin panel action
├── API endpoint call
├── After major purchase
└── Customer request

Evaluation Criteria:
├── Total lifetime points
├── Total lifetime spend
├── Recent activity (last 12 months)
└── Tier expiry date
```

### is_tier_expired Logic

```python
Pseudo-code:
─────────────────────────────────────────────────────

def is_tier_expired(self):
    # No tier assigned
    if not self.current_tier:
        return False
    
    # No expiry date set (permanent tier)
    if not self.tier_expiry_date:
        return False
    
    # Check if expiry date has passed
    today = date.today()
    return self.tier_expiry_date < today
```

### Expected Outcome
- Current tier tracking
- Tier evaluation timestamps
- Tier expiry management
- Tier multiplier access

### Verification Checklist
- [ ] current_tier ForeignKey added
- [ ] tier_evaluated_at field added
- [ ] tier_expiry_date field added
- [ ] tier_upgraded_at field added
- [ ] tier_name property created
- [ ] tier_multiplier property created
- [ ] is_tier_expired method created
- [ ] All fields allow null/blank
- [ ] Help text added
- [ ] SET_NULL on tier deletion

---

## Task 40: Run Loyalty Account Migrations

### Overview
Generate and apply Django migrations for the CustomerLoyalty model. This task creates the database table with all loyalty account fields and relationships.

### Dependencies
- Task 39: Add Tier Fields

### Instructions

1. **Verify model completeness**
   - Open `customer_loyalty.py`
   - Ensure all fields from Tasks 37-39 present
   - Check all relationships configured

2. **Register model in models init**
   - Open `apps/credit/models/__init__.py`
   - Import CustomerLoyalty
   - Add to __all__ list

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations credit`

4. **Review generated migration**
   - Navigate to `apps/credit/migrations/`
   - Open newest migration file (e.g., 0005_customerloyalty.py)
   - Verify all fields present
   - Check foreign key relationships

5. **Verify migration dependencies**
   - Check dependency on 0004_loyaltyprogram
   - Check Customer model dependency
   - Ensure LoyaltyTier dependency (forward reference)

6. **Apply migration to database**
   - Run: `python manage.py migrate credit`
   - Confirm successful table creation
   - No errors in output

7. **Verify database table**
   - Check table exists: credit_customer_loyalty
   - Verify columns match model
   - Check foreign key constraints
   - Verify unique constraint on customer

8. **Test model in Django shell**
   - Create test loyalty account
   - Link to customer and program
   - Test properties and methods
   - Verify relationships work

### Migration Review Checklist

```
Expected Migration Operations:
─────────────────────────────────────────────────────
✓ CreateModel: CustomerLoyalty
  ├── Field: id (UUIDField primary key)
  ├── Field: created (DateTimeField auto_now_add)
  ├── Field: modified (DateTimeField auto_now)
  ├── Field: customer (OneToOneField to Customer)
  ├── Field: program (ForeignKey to LoyaltyProgram)
  ├── Field: enrolled_date (DateField auto_now_add)
  ├── Field: status (CharField choices)
  ├── Field: points_balance (IntegerField default 0)
  ├── Field: lifetime_points_earned (IntegerField default 0)
  ├── Field: total_points_redeemed (IntegerField default 0)
  ├── Field: last_activity_date (DateTimeField auto_now)
  ├── Field: current_tier (ForeignKey to LoyaltyTier)
  ├── Field: tier_evaluated_at (DateTimeField null, blank)
  ├── Field: tier_expiry_date (DateField null, blank)
  └── Field: tier_upgraded_at (DateTimeField null, blank)

✓ Constraints:
  └── UNIQUE (customer) - OneToOne constraint

✓ Indexes:
  ├── customer_id (unique)
  ├── program_id
  └── current_tier_id
```

### Database Table Structure

```sql
Table: credit_customer_loyalty
─────────────────────────────────────────────────────
Column                    | Type          | Nullable
─────────────────────────────────────────────────────
id                        | UUID          | NOT NULL
created                   | TIMESTAMP     | NOT NULL
modified                  | TIMESTAMP     | NOT NULL
customer_id               | UUID          | NOT NULL
program_id                | UUID          | NULL
enrolled_date             | DATE          | NOT NULL
status                    | VARCHAR(20)   | NOT NULL
points_balance            | INTEGER       | NOT NULL
lifetime_points_earned    | INTEGER       | NOT NULL
total_points_redeemed     | INTEGER       | NOT NULL
last_activity_date        | TIMESTAMP     | NULL
current_tier_id           | UUID          | NULL
tier_evaluated_at         | TIMESTAMP     | NULL
tier_expiry_date          | DATE          | NULL
tier_upgraded_at          | TIMESTAMP     | NULL

Foreign Keys:
├── customer_id → customers.id (CASCADE)
├── program_id → credit_loyalty_program.id (SET_NULL)
└── current_tier_id → credit_loyalty_tier.id (SET_NULL)

Constraints:
└── UNIQUE (customer_id)

Indexes:
├── PRIMARY KEY (id)
├── UNIQUE INDEX (customer_id)
├── INDEX (program_id)
└── INDEX (current_tier_id)
```

### Shell Test Example

```python
Shell Commands:
─────────────────────────────────────────────────────

# Import models
from apps.credit.models import CustomerLoyalty, LoyaltyProgram
from apps.customers.models import Customer

# Get customer and program
customer = Customer.objects.first()
program = LoyaltyProgram.objects.filter(is_active=True).first()

# Create loyalty account
loyalty = CustomerLoyalty.objects.create(
    customer=customer,
    program=program,
    status='active',
    points_balance=100,
    lifetime_points_earned=500,
    total_points_redeemed=400
)

# Verify creation
print(loyalty)
print(f"Customer: {loyalty.customer.name}")
print(f"Points: {loyalty.points_balance}")
print(f"Tier: {loyalty.tier_name}")  # Property
print(f"Multiplier: {loyalty.tier_multiplier}")  # Property

# Test OneToOne relationship
same_loyalty = customer.loyalty_account
print(f"Same account: {same_loyalty == loyalty}")

# Try creating duplicate (should fail)
try:
    CustomerLoyalty.objects.create(
        customer=customer,
        program=program
    )
except Exception as e:
    print(f"Duplicate prevented: {e}")

# Query accounts
accounts = CustomerLoyalty.objects.filter(status='active')
print(f"Active accounts: {accounts.count()}")
```

### Expected Outcome
- Migration file generated successfully
- Database table created
- Relationships configured properly
- Model functional and testable

### Verification Checklist
- [ ] Migration file generated
- [ ] All fields present in migration
- [ ] Foreign key dependencies correct
- [ ] OneToOne constraint created
- [ ] Migration applied successfully
- [ ] Table exists in database
- [ ] Model imported in __init__.py
- [ ] Shell test successful
- [ ] OneToOne relationship enforced
- [ ] No migration warnings or errors

---

## Summary

This document established the core loyalty program infrastructure:

### Completed Models
- ✅ LoyaltyProgram - Program configuration and rules
- ✅ CustomerLoyalty - Customer loyalty accounts

### Completed Features
- ✅ Points earning rate configuration
- ✅ Minimum purchase thresholds
- ✅ Points expiry settings
- ✅ Program activation controls
- ✅ Customer points balance tracking
- ✅ Lifetime earning history
- ✅ Tier membership tracking

### Key Achievements
1. **Program Flexibility** - Configurable earning rates and expiry
2. **Scheduled Activation** - Start and end date controls
3. **Comprehensive Tracking** - Full points history
4. **Tier Integration** - Ready for tier-based benefits
5. **Account Status** - Active, suspended, closed states

### Database Structure
```
Tables Created:
├── credit_loyalty_program (Task 36)
└── credit_customer_loyalty (Task 40)

Relationships:
├── CustomerLoyalty → Customer (OneToOne)
├── CustomerLoyalty → LoyaltyProgram (ForeignKey)
└── CustomerLoyalty → LoyaltyTier (ForeignKey, forward ref)
```

### Next Steps
Proceed to [02_Tasks-41-46_Points-Transaction-Earning.md](02_Tasks-41-46_Points-Transaction-Earning.md) to implement points transactions, earning logic, and the loyalty service class.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~1380
