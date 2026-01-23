# Tasks 41-46: Points Transaction Model and Earning Logic

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** C - Loyalty Points System  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-40_Program-Loyalty-Account.md](01_Tasks-33-40_Program-Loyalty-Account.md)
- **→ Next Document:** [03_Tasks-47-50_Redemption-Expiry-Balance.md](03_Tasks-47-50_Redemption-Expiry-Balance.md)

---

## Document Overview

This document implements the points transaction system and earning logic. The PointsTransaction model tracks all points movements (earn, redeem, expire, bonus, adjustment), while the LoyaltyService class provides the business logic for awarding points based on purchase amounts and customer tiers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create PointsTransaction Model | Medium | 25 min |
| 42 | Define PointsTransactionType | Low | 15 min |
| 43 | Add Points Transaction Fields | Medium | 20 min |
| 44 | Run Points Transaction Migrations | Low | 15 min |
| 45 | Create LoyaltyService Class | High | 30 min |
| 46 | Implement Points Earning | Medium | 25 min |

---

## Task 41: Create PointsTransaction Model

### Overview
Create the PointsTransaction model to record all points movements in the loyalty system. This model provides a complete audit trail of points earned, redeemed, expired, and adjusted, ensuring transparency and accountability in the loyalty program.

### Dependencies
- Task 40: Run Loyalty Account Migrations
- CustomerLoyalty model exists

### Instructions

1. **Create points transaction model file**
   - Navigate to `apps/credit/models/` directory
   - Create new file `points_transaction.py`
   - This contains all points movement records

2. **Import required dependencies**
   - Import Django model components
   - Import CustomerLoyalty model
   - Import UUID for reference_id
   - Import BaseModel

3. **Create PointsTransaction model class**
   - Inherit from BaseModel
   - Add comprehensive model docstring
   - Describe transaction tracking purpose

4. **Add customer loyalty relationship**
   - ForeignKey to CustomerLoyalty
   - CASCADE deletion
   - related_name='points_transactions'
   - Links transaction to loyalty account

5. **Add transaction reference field**
   - UUIDField: reference_id
   - null=True, blank=True
   - References source transaction (order, refund)
   - Allows linking to originating event

6. **Add reference type field**
   - CharField: reference_type
   - null=True, blank=True
   - Identifies source type (Order, Refund, Manual)
   - Content type alternative

7. **Configure Meta class**
   - db_table = 'credit_points_transaction'
   - verbose_name = 'Points Transaction'
   - verbose_name_plural = 'Points Transactions'
   - ordering = ['-created']
   - Default ordering by date (newest first)

8. **Add indexes for performance**
   - Index on customer_loyalty
   - Index on created (date filtering)
   - Index on reference_id (lookup)
   - Composite index on (customer_loyalty, created)

9. **Add __str__ method**
   - Return transaction type and points
   - Format: "{customer.name} - {type} {points} points"
   - Include date if helpful

### Model Purpose

| Field | Type | Purpose |
|-------|------|---------|
| customer_loyalty | ForeignKey | Account owner |
| reference_id | UUIDField | Source transaction |
| reference_type | CharField | Source type identifier |

### Points Transaction Flow

```
Transaction Lifecycle:
─────────────────────────────────────────────────────

Event Occurs:
├── Customer makes purchase
├── Customer redeems points
├── Points expire
├── Admin adjustment
└── Bonus points awarded
       │
       ▼
Create PointsTransaction:
├── Link to CustomerLoyalty
├── Set transaction type
├── Record points amount
├── Store reference information
└── Set expiry date (if earn)
       │
       ▼
Update CustomerLoyalty:
├── Adjust points_balance
├── Update lifetime_earned (if earn)
├── Update total_redeemed (if redeem)
└── Set last_activity_date
```

### Transaction Reference Examples

#### Purchase Transaction
```
PointsTransaction:
├── customer_loyalty: CustomerLoyalty(customer_id=xxx)
├── type: EARN
├── points: 150
├── reference_id: "a1b2c3d4..." (Order.id)
├── reference_type: "Order"
├── description: "Purchase Rs. 15,000"
└── created: 2026-01-24 10:30:00
```

#### Redemption Transaction
```
PointsTransaction:
├── customer_loyalty: CustomerLoyalty(customer_id=xxx)
├── type: REDEEM
├── points: -200 (negative for deduction)
├── reference_id: "e5f6g7h8..." (Order.id)
├── reference_type: "Order"
├── description: "Redeemed for Rs. 200 discount"
└── created: 2026-01-24 14:15:00
```

#### Expiry Transaction
```
PointsTransaction:
├── customer_loyalty: CustomerLoyalty(customer_id=xxx)
├── type: EXPIRE
├── points: -50 (negative for deduction)
├── reference_id: "original_transaction_id"
├── reference_type: "PointsTransaction"
├── description: "Points expired (12 months old)"
└── created: 2026-01-24 02:00:00 (Celery task)
```

#### Manual Adjustment
```
PointsTransaction:
├── customer_loyalty: CustomerLoyalty(customer_id=xxx)
├── type: ADJUSTMENT
├── points: 500 (positive = addition, negative = removal)
├── reference_id: null
├── reference_type: "Manual"
├── description: "Compensation for service issue"
├── adjusted_by: User(staff_id)
└── created: 2026-01-24 16:45:00
```

### Audit Trail Benefits

```
Complete Transaction History:
─────────────────────────────────────────────────────

Transparency:
├── Every points change recorded
├── Source of points identified
├── Date and time stamped
└── Irreversible audit trail

Accountability:
├── Staff actions tracked
├── Automatic system actions logged
├── Customer actions recorded
└── Dispute resolution support

Reporting:
├── Points earning analysis
├── Redemption patterns
├── Expiry tracking
└── Customer activity insights
```

### Expected Outcome
- Core PointsTransaction model created
- Relationship to CustomerLoyalty established
- Reference tracking configured
- Foundation for transaction types

### Verification Checklist
- [ ] `points_transaction.py` file created
- [ ] PointsTransaction class defined
- [ ] Inherits from BaseModel
- [ ] customer_loyalty ForeignKey configured
- [ ] reference_id UUIDField added
- [ ] reference_type CharField added
- [ ] Meta class configured
- [ ] Indexes planned (implement in migration)
- [ ] __str__ method implemented
- [ ] Model docstring included

---

## Task 42: Define PointsTransactionType

### Overview
Define transaction type constants that categorize different kinds of points movements. These constants ensure consistency across the application when recording and filtering points transactions.

### Dependencies
- Task 41: Create PointsTransaction Model

### Instructions

1. **Open points transaction model**
   - Navigate to `apps/credit/models/points_transaction.py`
   - Locate appropriate location (before class or at top)

2. **Create transaction type constants**
   - Define module-level or class-level constants
   - Follow Django choices pattern
   - Cover all transaction scenarios

3. **Define EARN constant**
   - Value: 'earn'
   - Display: 'Earn'
   - Purpose: Points earned from purchases

4. **Define REDEEM constant**
   - Value: 'redeem'
   - Display: 'Redeem'
   - Purpose: Points redeemed for discounts

5. **Define EXPIRE constant**
   - Value: 'expire'
   - Display: 'Expire'
   - Purpose: Points expired due to time limit

6. **Define BONUS constant**
   - Value: 'bonus'
   - Display: 'Bonus'
   - Purpose: Bonus points (birthday, promotion)

7. **Define ADJUSTMENT constant**
   - Value: 'adjustment'
   - Display: 'Adjustment'
   - Purpose: Manual admin adjustment (add or remove)

8. **Create POINTS_TRANSACTION_TYPES tuple**
   - Combine all constants into choices tuple
   - Format: ((value, display), ...)
   - Used in type CharField

### Transaction Type Definitions

| Constant | Value | Display | Points Sign | Use Case |
|----------|-------|---------|-------------|----------|
| EARN | 'earn' | Earn | Positive (+) | Purchase points |
| REDEEM | 'redeem' | Redeem | Negative (-) | Discount redemption |
| EXPIRE | 'expire' | Expire | Negative (-) | Automatic expiry |
| BONUS | 'bonus' | Bonus | Positive (+) | Special rewards |
| ADJUSTMENT | 'adjustment' | Adjustment | Both (+/-) | Manual correction |

### Transaction Type Usage

#### EARN Transactions
```
Triggers:
├── Customer completes purchase
├── Minimum purchase threshold met
├── Payment confirmed
└── Order not cancelled/refunded

Point Calculation:
├── Based on purchase amount
├── Apply tier multiplier
├── Apply promotion multiplier
└── Floor to integer

Examples:
├── Normal purchase: +50 points
├── Tier bonus: +50 × 1.5 = +75 points
└── Double points promo: +50 × 2 = +100 points
```

#### REDEEM Transactions
```
Triggers:
├── Customer requests redemption at checkout
├── Sufficient points available
├── Minimum redemption met
└── Order completed

Point Calculation:
├── Negative value (deduction)
├── Exact amount requested
├── Whole points only (no partial)
└── Update balance immediately

Examples:
├── Redeem 200 points: -200 points
├── Redeem 1,000 points: -1,000 points
└── Balance: 1,500 - 200 = 1,300 points
```

#### EXPIRE Transactions
```
Triggers:
├── Celery task runs daily
├── Checks expiry_date on EARN transactions
├── Finds expired points
└── Creates EXPIRE transaction

Point Calculation:
├── Negative value (deduction)
├── Equals expired EARN transaction
├── FIFO (oldest points first)
└── Automatic process

Examples:
├── Earned 2025-01-24: 100 points
├── Expiry: 2026-01-24 (12 months)
├── Today: 2026-01-25
└── Create EXPIRE: -100 points
```

#### BONUS Transactions
```
Triggers:
├── Birthday bonus (annual)
├── Anniversary bonus
├── Promotional campaign
├── Tier upgrade reward
└── Special event

Point Calculation:
├── Positive value (addition)
├── Fixed amount or percentage
├── No tier multiplier (already bonus)
└── May have own expiry

Examples:
├── Birthday: +500 points
├── Anniversary: +1,000 points
├── New member: +100 points
└── Tier upgrade: +250 points
```

#### ADJUSTMENT Transactions
```
Triggers:
├── Admin correction
├── Customer service resolution
├── System error fix
├── Fraud reversal
└── Policy exception

Point Calculation:
├── Positive or negative
├── Exact amount specified
├── Requires admin authorization
├── Must include reason
└── Permanent change

Examples:
├── Error correction: +100 points
├── Fraud reversal: -500 points
├── Goodwill gesture: +200 points
└── Policy violation: -1,000 points
```

### Transaction Type Filtering

```
Query Examples:
─────────────────────────────────────────────────────

# All earning transactions
earn_transactions = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    type='earn'
)

# All redemptions in date range
redemptions = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    type='redeem',
    created__range=[start_date, end_date]
)

# Positive transactions only (earn + bonus + positive adjustments)
positive = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    type__in=['earn', 'bonus'],
    points__gt=0
)

# Negative transactions (redeem + expire + negative adjustments)
negative = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    points__lt=0
)

# Manual interventions only
manual = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    type='adjustment'
)
```

### Expected Outcome
- Five transaction type constants defined
- Clear categorization of points movements
- Foundation for transaction type field
- Consistent type values across system

### Verification Checklist
- [ ] EARN constant defined
- [ ] REDEEM constant defined
- [ ] EXPIRE constant defined
- [ ] BONUS constant defined
- [ ] ADJUSTMENT constant defined
- [ ] POINTS_TRANSACTION_TYPES tuple created
- [ ] All constants follow naming convention
- [ ] Display names user-friendly
- [ ] Values lowercase and consistent

---

## Task 43: Add Points Transaction Fields

### Overview
Add comprehensive fields to the PointsTransaction model to capture all transaction details including type, points amount, description, expiry date, and administrative information. These fields provide complete context for every points movement.

### Dependencies
- Task 42: Define PointsTransactionType

### Instructions

1. **Open points transaction model**
   - Navigate to `apps/credit/models/points_transaction.py`
   - Locate PointsTransaction class

2. **Add transaction type field**
   - CharField: type
   - max_length=20
   - choices=POINTS_TRANSACTION_TYPES
   - Categorizes transaction
   - Required field

3. **Add points field**
   - IntegerField: points
   - Positive for earn/bonus, negative for redeem/expire
   - Required field
   - Core transaction value

4. **Add points help text**
   - help_text for points field
   - "Points amount. Positive = earn/bonus, Negative = redeem/expire"
   - Clarifies sign convention

5. **Add balance after field**
   - IntegerField: balance_after
   - Points balance after this transaction
   - Snapshot of balance state
   - Useful for reconciliation

6. **Add description field**
   - TextField: description
   - blank=True, null=True
   - Human-readable transaction description
   - Context information

7. **Add expiry date field**
   - DateField: expiry_date
   - null=True, blank=True
   - Only for EARN transactions
   - When these points expire

8. **Add expiry help text**
   - help_text for expiry_date
   - "For EARN transactions: when these points expire"
   - Clarifies usage

9. **Add adjusted by field**
   - ForeignKey: adjusted_by
   - to User model
   - SET_NULL on deletion
   - null=True, blank=True
   - Only for ADJUSTMENT type

10. **Add adjustment reason field**
    - CharField: adjustment_reason
    - max_length=500
    - null=True, blank=True
    - Required for ADJUSTMENT type
    - Explains manual changes

11. **Add is_expired flag**
    - BooleanField: is_expired
    - default=False
    - Marks if EARN points expired
    - Set by expiry task

### Points Transaction Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| type | CharField | Yes | Transaction category |
| points | IntegerField | Yes | Points amount (+/-) |
| balance_after | IntegerField | Yes | Balance snapshot |
| description | TextField | No | Transaction context |
| expiry_date | DateField | No | When points expire (EARN) |
| adjusted_by | ForeignKey | No | Admin user (ADJUSTMENT) |
| adjustment_reason | CharField | No | Reason (ADJUSTMENT) |
| is_expired | BooleanField | Yes | Expiry flag |

### Points Sign Convention

```
Transaction Type → Points Sign:
─────────────────────────────────────────────────────

Positive Points (Balance Increase):
├── EARN: +50, +100, +250
├── BONUS: +500, +1000
└── ADJUSTMENT: +100 (correction)

Negative Points (Balance Decrease):
├── REDEEM: -200, -500
├── EXPIRE: -50, -100
└── ADJUSTMENT: -300 (penalty)

Calculation Example:
Starting Balance: 1,000 points
Transaction: EARN +150 points
Balance After: 1,150 points

Transaction: REDEEM -300 points
Balance After: 850 points
```

### balance_after Tracking

```
Sequential Balance Tracking:
─────────────────────────────────────────────────────

Initial: Balance = 0

Transaction 1:
├── Type: EARN
├── Points: +100
├── Balance Before: 0
└── Balance After: 100

Transaction 2:
├── Type: EARN
├── Points: +50
├── Balance Before: 100
└── Balance After: 150

Transaction 3:
├── Type: REDEEM
├── Points: -75
├── Balance Before: 150
└── Balance After: 75

Transaction 4:
├── Type: EXPIRE
├── Points: -25
├── Balance Before: 75
└── Balance After: 50

Reconciliation:
Current Balance: 50
Sum of Points: 100 + 50 - 75 - 25 = 50 ✓
Last balance_after: 50 ✓
```

### Expiry Date Usage

```
EARN Transaction with Expiry:
─────────────────────────────────────────────────────

Transaction Created: 2026-01-24
├── type: EARN
├── points: +200
├── expiry_date: 2027-01-24 (12 months)
└── is_expired: False

Expiry Check (2026-06-24):
├── expiry_date: 2027-01-24
├── Today: 2026-06-24
└── Status: Still valid (7 months left)

Expiry Check (2027-02-01):
├── expiry_date: 2027-01-24
├── Today: 2027-02-01
└── Status: Expired (8 days past)

Expiry Processing:
├── Create EXPIRE transaction: -200 points
├── Link to original EARN transaction
├── Set is_expired = True on original
└── Update customer balance
```

### Adjustment Transaction Example

```
Manual Adjustment for Service Issue:
─────────────────────────────────────────────────────

Customer Complaint: Order delayed 2 weeks
Resolution: Award 500 bonus points

Transaction:
├── type: ADJUSTMENT
├── points: +500
├── description: "Compensation for delayed order #12345"
├── adjusted_by: User(staff_member_id)
├── adjustment_reason: "Order delivery delay - customer service resolution"
├── reference_id: order_id
├── reference_type: "Order"
└── created: 2026-01-24 15:30:00

Required Fields for ADJUSTMENT:
✓ adjusted_by (who made change)
✓ adjustment_reason (why change was made)
✓ description (what happened)
```

### Description Field Examples

```
Descriptive Transaction Context:
─────────────────────────────────────────────────────

EARN:
"Purchase Order #INV-2024-001234 - Rs. 15,750"
"Online order - Electronics category - Gold tier 1.5x"

REDEEM:
"Redeemed 300 points for Rs. 300 discount - Order #INV-2024-001235"
"Loyalty redemption at checkout"

EXPIRE:
"Points from purchase 2025-01-24 expired after 12 months"
"EARN transaction 550 points expired"

BONUS:
"Birthday bonus - Happy Birthday!"
"New member welcome bonus"
"Double points promotion - Summer Sale 2026"

ADJUSTMENT:
"Compensation for service issue - Order #12345"
"Correction: duplicate points awarded"
"Fraud reversal - suspicious activity"
```

### Expected Outcome
- Comprehensive transaction fields
- Points amount and balance tracking
- Expiry date management
- Administrative audit trail

### Verification Checklist
- [ ] type CharField added with choices
- [ ] points IntegerField added
- [ ] balance_after IntegerField added
- [ ] description TextField added
- [ ] expiry_date DateField added
- [ ] adjusted_by ForeignKey added
- [ ] adjustment_reason CharField added
- [ ] is_expired BooleanField added
- [ ] Help text added to key fields
- [ ] All nullable fields marked properly
- [ ] Points sign convention documented

---

## Task 44: Run Points Transaction Migrations

### Overview
Generate and apply Django migrations for the PointsTransaction model. This task creates the database table with all transaction fields, relationships, and indexes for optimal performance.

### Dependencies
- Task 43: Add Points Transaction Fields

### Instructions

1. **Verify model completeness**
   - Open `points_transaction.py`
   - Ensure all fields from Tasks 41-43 present
   - Check all relationships and constraints

2. **Register model in models init**
   - Open `apps/credit/models/__init__.py`
   - Import PointsTransaction
   - Add to __all__ list

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations credit`

4. **Review generated migration**
   - Navigate to `apps/credit/migrations/`
   - Open newest migration file (e.g., 0006_pointstransaction.py)
   - Verify all fields present
   - Check indexes created

5. **Add custom indexes if needed**
   - Edit migration to add composite indexes
   - Index on (customer_loyalty, created)
   - Index on (customer_loyalty, type)
   - Index on (reference_id)

6. **Apply migration to database**
   - Run: `python manage.py migrate credit`
   - Confirm successful table creation
   - No errors in output

7. **Verify database table**
   - Check table exists: credit_points_transaction
   - Verify columns match model
   - Check foreign key constraints
   - Verify indexes created

8. **Test model in Django shell**
   - Create test transactions
   - Test all transaction types
   - Verify relationships
   - Test querying and filtering

### Migration Review Checklist

```
Expected Migration Operations:
─────────────────────────────────────────────────────
✓ CreateModel: PointsTransaction
  ├── Field: id (UUIDField primary key)
  ├── Field: created (DateTimeField auto_now_add)
  ├── Field: modified (DateTimeField auto_now)
  ├── Field: customer_loyalty (ForeignKey to CustomerLoyalty)
  ├── Field: reference_id (UUIDField null, blank)
  ├── Field: reference_type (CharField null, blank)
  ├── Field: type (CharField choices)
  ├── Field: points (IntegerField)
  ├── Field: balance_after (IntegerField)
  ├── Field: description (TextField null, blank)
  ├── Field: expiry_date (DateField null, blank)
  ├── Field: adjusted_by (ForeignKey to User null)
  ├── Field: adjustment_reason (CharField null, blank)
  └── Field: is_expired (BooleanField default False)

✓ Indexes:
  ├── customer_loyalty_id
  ├── created (for date range queries)
  ├── reference_id (for lookup)
  ├── (customer_loyalty_id, created) composite
  └── (customer_loyalty_id, type) composite

✓ Foreign Keys:
  ├── customer_loyalty_id → credit_customer_loyalty.id (CASCADE)
  └── adjusted_by_id → users.id (SET_NULL)
```

### Database Table Structure

```sql
Table: credit_points_transaction
─────────────────────────────────────────────────────
Column              | Type          | Nullable
────────────────────────────────────────────────────
id                  | UUID          | NOT NULL
created             | TIMESTAMP     | NOT NULL
modified            | TIMESTAMP     | NOT NULL
customer_loyalty_id | UUID          | NOT NULL
reference_id        | UUID          | NULL
reference_type      | VARCHAR(100)  | NULL
type                | VARCHAR(20)   | NOT NULL
points              | INTEGER       | NOT NULL
balance_after       | INTEGER       | NOT NULL
description         | TEXT          | NULL
expiry_date         | DATE          | NULL
adjusted_by_id      | UUID          | NULL
adjustment_reason   | VARCHAR(500)  | NULL
is_expired          | BOOLEAN       | NOT NULL

Foreign Keys:
├── customer_loyalty_id → credit_customer_loyalty.id (CASCADE)
└── adjusted_by_id → users.id (SET_NULL)

Indexes:
├── PRIMARY KEY (id)
├── INDEX (customer_loyalty_id)
├── INDEX (created)
├── INDEX (reference_id)
├── INDEX (customer_loyalty_id, created)
└── INDEX (customer_loyalty_id, type)
```

### Shell Test Examples

```python
Shell Commands:
─────────────────────────────────────────────────────

# Import models
from apps.credit.models import PointsTransaction, CustomerLoyalty
from datetime import date, timedelta

# Get loyalty account
loyalty = CustomerLoyalty.objects.first()

# Test EARN transaction
earn = PointsTransaction.objects.create(
    customer_loyalty=loyalty,
    type='earn',
    points=100,
    balance_after=loyalty.points_balance + 100,
    description="Test purchase Rs. 10,000",
    expiry_date=date.today() + timedelta(days=365)
)
print(f"EARN: {earn}")

# Test REDEEM transaction
redeem = PointsTransaction.objects.create(
    customer_loyalty=loyalty,
    type='redeem',
    points=-50,
    balance_after=loyalty.points_balance - 50,
    description="Redeemed for Rs. 50 discount"
)
print(f"REDEEM: {redeem}")

# Test BONUS transaction
bonus = PointsTransaction.objects.create(
    customer_loyalty=loyalty,
    type='bonus',
    points=500,
    balance_after=loyalty.points_balance + 500,
    description="Birthday bonus"
)
print(f"BONUS: {bonus}")

# Query transactions by type
earns = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    type='earn'
)
print(f"Total EARN transactions: {earns.count()}")

# Get transaction history
history = PointsTransaction.objects.filter(
    customer_loyalty=loyalty
).order_by('-created')[:10]

for txn in history:
    print(f"{txn.created.date()} | {txn.type:10} | {txn.points:5} | Balance: {txn.balance_after}")

# Calculate total earned
from django.db.models import Sum
total_earned = PointsTransaction.objects.filter(
    customer_loyalty=loyalty,
    type='earn'
).aggregate(Sum('points'))['points__sum']
print(f"Total earned: {total_earned}")
```

### Expected Outcome
- Migration file generated successfully
- Database table created with indexes
- All fields and relationships configured
- Model functional and performant

### Verification Checklist
- [ ] Migration file generated
- [ ] All fields present in migration
- [ ] Indexes added for performance
- [ ] Foreign keys configured correctly
- [ ] Migration applied successfully
- [ ] Table exists in database
- [ ] Model imported in __init__.py
- [ ] Shell test successful
- [ ] Queries perform efficiently
- [ ] No migration warnings or errors

---

## Task 45: Create LoyaltyService Class

### Overview
Create the LoyaltyService class to centralize all loyalty program business logic. This service class provides methods for points calculation, customer enrollment, account management, and serves as the main interface for loyalty operations.

### Dependencies
- Task 44: Run Points Transaction Migrations
- CustomerLoyalty and PointsTransaction models exist

### Instructions

1. **Create loyalty service module**
   - Navigate to `apps/credit/services/` directory
   - Create new file `loyalty_service.py`
   - This contains loyalty business logic

2. **Create services directory if needed**
   - If `services/` doesn't exist, create it
   - Create `__init__.py` in services directory
   - Import LoyaltyService in __init__

3. **Import required dependencies**
   - Import CustomerLoyalty, PointsTransaction models
   - Import LoyaltyProgram model
   - Import Customer model
   - Import Decimal, datetime
   - Import transaction (database)

4. **Create LoyaltyService class**
   - Class-based service (not instance-based)
   - Static methods or class methods
   - Comprehensive docstring

5. **Create enroll_customer method**
   - Static method or class method
   - Parameters: customer, program
   - Creates CustomerLoyalty record
   - Returns loyalty account
   - Handles existing account

6. **Add enrollment logic**
   - Check if customer already enrolled
   - If exists, return existing
   - If not, create new account
   - Set status='active'
   - Link to program
   - Return loyalty account

7. **Create get_or_create_loyalty method**
   - Static method or class method
   - Parameters: customer
   - Gets existing or creates new
   - Auto-enrolls in active program
   - Returns (loyalty, created) tuple

8. **Create calculate_points method**
   - Static method or class method
   - Parameters: purchase_amount, loyalty_account
   - Calculates points based on amount
   - Applies tier multiplier
   - Returns integer points

9. **Add points calculation logic**
   - Get program from loyalty account
   - Check min_purchase_for_points
   - Calculate base points (amount / 100)
   - Apply points_per_currency rate
   - Apply tier multiplier
   - Floor to integer
   - Return points

10. **Create validation methods**
    - validate_account_active
    - validate_program_active
    - validate_sufficient_points
    - Return boolean or raise exception

### Service Class Structure

```
LoyaltyService Architecture:
─────────────────────────────────────────────────────

LoyaltyService
├── Enrollment Methods:
│   ├── enroll_customer(customer, program)
│   ├── get_or_create_loyalty(customer)
│   └── create_loyalty_account(customer, program)
│
├── Points Calculation:
│   ├── calculate_points(amount, loyalty)
│   ├── calculate_base_points(amount, program)
│   └── apply_tier_multiplier(points, tier)
│
├── Validation Methods:
│   ├── validate_account_active(loyalty)
│   ├── validate_program_active(program)
│   ├── validate_sufficient_points(loyalty, points)
│   └── validate_minimum_purchase(amount, program)
│
└── Utility Methods:
    ├── get_active_program(tenant)
    ├── get_customer_loyalty(customer)
    └── format_transaction_description(...)
```

### enroll_customer Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def enroll_customer(customer, program=None):
    """
    Enroll customer in loyalty program.
    
    Args:
        customer: Customer instance
        program: LoyaltyProgram instance (optional)
    
    Returns:
        CustomerLoyalty instance
    """
    # Check existing enrollment
    existing = CustomerLoyalty.objects.filter(
        customer=customer
    ).first()
    
    if existing:
        return existing
    
    # Get program if not provided
    if not program:
        program = LoyaltyProgram.objects.filter(
            tenant=customer.tenant,
            is_active=True
        ).first()
    
    if not program:
        raise ValueError("No active loyalty program found")
    
    # Create loyalty account
    loyalty = CustomerLoyalty.objects.create(
        customer=customer,
        program=program,
        status='active',
        points_balance=0,
        lifetime_points_earned=0,
        total_points_redeemed=0
    )
    
    return loyalty
```

### get_or_create_loyalty Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def get_or_create_loyalty(customer):
    """
    Get existing loyalty account or create new one.
    
    Args:
        customer: Customer instance
    
    Returns:
        tuple: (CustomerLoyalty, created:bool)
    """
    # Try to get existing
    try:
        loyalty = customer.loyalty_account
        return (loyalty, False)
    except CustomerLoyalty.DoesNotExist:
        pass
    
    # Get active program
    program = LoyaltyProgram.objects.filter(
        tenant=customer.tenant,
        is_active=True
    ).first()
    
    if not program:
        return (None, False)
    
    # Create new account
    loyalty = LoyaltyService.enroll_customer(customer, program)
    return (loyalty, True)
```

### calculate_points Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def calculate_points(purchase_amount, loyalty_account):
    """
    Calculate points earned for purchase amount.
    
    Args:
        purchase_amount: Decimal purchase amount
        loyalty_account: CustomerLoyalty instance
    
    Returns:
        int: Points earned
    """
    # Get program
    program = loyalty_account.program
    if not program:
        return 0
    
    # Check minimum purchase
    if purchase_amount < program.min_purchase_for_points:
        return 0
    
    # Calculate base points
    # Rs. 100 = 1 currency unit
    currency_units = int(purchase_amount / Decimal('100'))
    base_points = currency_units * program.points_per_currency
    
    # Apply tier multiplier
    tier_multiplier = loyalty_account.tier_multiplier  # Property
    final_points = base_points * tier_multiplier
    
    # Floor to integer
    return int(final_points)
```

### Points Calculation Examples

```
Example 1: Basic Calculation (No Tier)
─────────────────────────────────────────────────────
Purchase: Rs. 5,500
Program: 1.00 points per Rs. 100
Min Purchase: Rs. 100
Tier: None (multiplier = 1.0)

Calculation:
├── currency_units = floor(5500 / 100) = 55
├── base_points = 55 × 1.00 = 55
├── tier_multiplier = 1.0
├── final_points = 55 × 1.0 = 55
└── Result: 55 points


Example 2: With Gold Tier
─────────────────────────────────────────────────────
Purchase: Rs. 5,500
Program: 1.00 points per Rs. 100
Tier: Gold (multiplier = 1.5)

Calculation:
├── currency_units = floor(5500 / 100) = 55
├── base_points = 55 × 1.00 = 55
├── tier_multiplier = 1.5
├── final_points = 55 × 1.5 = 82.5 → floor to 82
└── Result: 82 points


Example 3: Below Minimum
─────────────────────────────────────────────────────
Purchase: Rs. 50
Program: 1.00 points per Rs. 100
Min Purchase: Rs. 100

Calculation:
├── purchase_amount (50) < min_purchase (100)
└── Result: 0 points (threshold not met)
```

### Validation Methods

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def validate_account_active(loyalty_account):
    """Validate loyalty account is active."""
    if loyalty_account.status != 'active':
        raise ValueError("Loyalty account is not active")
    return True

@staticmethod
def validate_program_active(program):
    """Validate loyalty program is active."""
    if not program.is_currently_active():
        raise ValueError("Loyalty program is not active")
    return True

@staticmethod
def validate_sufficient_points(loyalty_account, required_points):
    """Validate customer has sufficient points."""
    if loyalty_account.points_balance < required_points:
        raise ValueError(
            f"Insufficient points. Required: {required_points}, "
            f"Available: {loyalty_account.points_balance}"
        )
    return True

@staticmethod
def validate_minimum_purchase(amount, program):
    """Validate purchase meets minimum threshold."""
    if amount < program.min_purchase_for_points:
        return False
    return True
```

### Expected Outcome
- Centralized loyalty service class
- Customer enrollment logic
- Points calculation with tiers
- Validation methods

### Verification Checklist
- [ ] `loyalty_service.py` file created
- [ ] LoyaltyService class defined
- [ ] enroll_customer method implemented
- [ ] get_or_create_loyalty method implemented
- [ ] calculate_points method implemented
- [ ] Validation methods created
- [ ] Service imported in __init__.py
- [ ] Comprehensive docstrings added
- [ ] Static/class methods used appropriately
- [ ] Error handling included

---

## Task 46: Implement Points Earning

### Overview
Implement the points earning logic in the LoyaltyService class. This includes the award_points method that creates points transactions, updates customer balances, and handles all aspects of earning points from purchases.

### Dependencies
- Task 45: Create LoyaltyService Class

### Instructions

1. **Open loyalty service file**
   - Navigate to `apps/credit/services/loyalty_service.py`
   - Locate LoyaltyService class

2. **Create award_points method**
   - Static method or class method
   - Parameters: loyalty, amount, reference_id, reference_type, description
   - Calculates points
   - Creates transaction
   - Updates balance
   - Returns transaction

3. **Add purchase validation**
   - Validate loyalty account active
   - Validate program active
   - Validate minimum purchase
   - Return early if validation fails

4. **Calculate points to award**
   - Call calculate_points method
   - Pass purchase amount and loyalty account
   - If points = 0, return None or early exit

5. **Calculate expiry date**
   - Get points_expiry_months from program
   - If set, calculate expiry_date
   - If null, no expiry
   - Add months to current date

6. **Create PointsTransaction record**
   - Use database transaction (atomic)
   - Set type='earn'
   - Set points (positive value)
   - Set description
   - Set expiry_date
   - Set reference_id and reference_type

7. **Update CustomerLoyalty balance**
   - Add points to points_balance
   - Add points to lifetime_points_earned
   - Update last_activity_date
   - Save loyalty account

8. **Set balance_after in transaction**
   - Set transaction.balance_after = loyalty.points_balance
   - Save transaction

9. **Add error handling**
   - Wrap in try/except
   - Rollback on error
   - Log errors
   - Return None or raise exception

10. **Return transaction record**
    - Return created PointsTransaction
    - Allows caller to access transaction details

### award_points Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def award_points(
    loyalty_account,
    purchase_amount,
    reference_id=None,
    reference_type=None,
    description=None
):
    """
    Award points for a purchase.
    
    Args:
        loyalty_account: CustomerLoyalty instance
        purchase_amount: Decimal purchase amount
        reference_id: UUID of source transaction (order)
        reference_type: String type (Order, Refund, etc)
        description: Transaction description
    
    Returns:
        PointsTransaction or None
    """
    # Validation
    try:
        LoyaltyService.validate_account_active(loyalty_account)
        LoyaltyService.validate_program_active(loyalty_account.program)
    except ValueError as e:
        logger.warning(f"Validation failed: {e}")
        return None
    
    # Calculate points
    points = LoyaltyService.calculate_points(
        purchase_amount,
        loyalty_account
    )
    
    if points <= 0:
        return None  # Below minimum or no points
    
    # Calculate expiry
    program = loyalty_account.program
    expiry_date = None
    if program.points_expiry_months:
        expiry_date = date.today() + relativedelta(
            months=program.points_expiry_months
        )
    
    # Create transaction with atomic database transaction
    with transaction.atomic():
        # Create points transaction
        points_txn = PointsTransaction.objects.create(
            customer_loyalty=loyalty_account,
            type='earn',
            points=points,
            balance_after=0,  # Set after update
            description=description or f"Purchase Rs. {purchase_amount}",
            expiry_date=expiry_date,
            reference_id=reference_id,
            reference_type=reference_type
        )
        
        # Update loyalty account
        loyalty_account.points_balance += points
        loyalty_account.lifetime_points_earned += points
        loyalty_account.last_activity_date = timezone.now()
        loyalty_account.save()
        
        # Update balance_after
        points_txn.balance_after = loyalty_account.points_balance
        points_txn.save()
    
    return points_txn
```

### Points Earning Flow Diagram

```
Purchase Flow:
─────────────────────────────────────────────────────

┌─────────────┐
│   Customer  │
│    Makes    │
│  Purchase   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │────── Check account active
│   Account   │────── Check program active
└──────┬──────┘────── Check minimum purchase
       │
       ▼
┌─────────────┐
│  Calculate  │────── Get base points
│   Points    │────── Apply tier multiplier
└──────┬──────┘────── Floor to integer
       │
       ▼
┌─────────────┐
│  Calculate  │────── Add expiry months
│   Expiry    │────── Set expiry_date
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Create    │────── type = EARN
│ Transaction │────── points = calculated
└──────┬──────┘────── expiry_date = calculated
       │
       ▼
┌─────────────┐
│   Update    │────── points_balance += points
│   Balance   │────── lifetime_earned += points
└──────┬──────┘────── last_activity = now
       │
       ▼
┌─────────────┐
│   Return    │
│ Transaction │
└─────────────┘
```

### Earning Scenarios

#### Scenario 1: Successful Points Award
```
Input:
├── Customer: Existing loyalty member
├── Purchase: Rs. 10,000
├── Tier: Gold (1.5x multiplier)
├── Program: 1.0 points per Rs. 100
└── Expiry: 12 months

Process:
1. Validate account: PASS (active)
2. Validate program: PASS (active)
3. Calculate points: floor(10000/100) × 1.0 × 1.5 = 150
4. Calculate expiry: 2027-01-24
5. Create transaction: EARN +150 points
6. Update balance: 500 → 650 points
7. Update lifetime: 2000 → 2150 points

Result:
├── Transaction created: PointsTransaction #xxx
├── Points awarded: 150 points
├── New balance: 650 points
└── Expiry: 2027-01-24
```

#### Scenario 2: Below Minimum Purchase
```
Input:
├── Customer: Existing loyalty member
├── Purchase: Rs. 75
├── Program min: Rs. 100
└── Tier: Silver

Process:
1. Validate account: PASS
2. Validate program: PASS
3. Calculate points: 75 < 100 → 0 points
4. Return: None (no transaction created)

Result:
├── No transaction created
├── Balance unchanged
└── Customer notified: "Minimum Rs. 100 for points"
```

#### Scenario 3: Suspended Account
```
Input:
├── Customer: Loyalty member (SUSPENDED)
├── Purchase: Rs. 5,000
└── Tier: Bronze

Process:
1. Validate account: FAIL (status = suspended)
2. Return: None (validation failed)

Result:
├── No transaction created
├── No points awarded
└── Log: "Account suspended, no points awarded"
```

### Integration with Order Processing

```python
Example Usage in Order Model:
─────────────────────────────────────────────────────

class Order(models.Model):
    # ... order fields ...
    
    def award_loyalty_points(self):
        """Award loyalty points for this order."""
        # Get or create loyalty account
        loyalty, created = LoyaltyService.get_or_create_loyalty(
            self.customer
        )
        
        if not loyalty:
            return None
        
        # Award points
        transaction = LoyaltyService.award_points(
            loyalty_account=loyalty,
            purchase_amount=self.total_amount,
            reference_id=self.id,
            reference_type='Order',
            description=f"Purchase Order {self.order_number}"
        )
        
        if transaction:
            # Store transaction reference
            self.loyalty_transaction = transaction
            self.save()
            
            # Notify customer
            self.notify_points_earned(transaction.points)
        
        return transaction
```

### Expected Outcome
- Complete points earning implementation
- Transaction creation with expiry
- Balance updates atomic
- Integration-ready service method

### Verification Checklist
- [ ] award_points method implemented
- [ ] Validation checks included
- [ ] Points calculation integrated
- [ ] Expiry date calculation included
- [ ] PointsTransaction created
- [ ] CustomerLoyalty balance updated
- [ ] Database transaction atomic
- [ ] Error handling included
- [ ] Method returns transaction
- [ ] Comprehensive docstring added

---

## Summary

This document implemented the core points transaction system:

### Completed Models
- ✅ PointsTransaction - Complete transaction audit trail
- ✅ Transaction types - EARN, REDEEM, EXPIRE, BONUS, ADJUSTMENT

### Completed Services
- ✅ LoyaltyService - Centralized business logic
- ✅ Customer enrollment
- ✅ Points calculation with tiers
- ✅ Points earning implementation

### Key Features
1. **Transaction Audit** - Every points movement recorded
2. **Points Calculation** - Tier multipliers, thresholds
3. **Expiry Tracking** - Individual transaction expiry dates
4. **Balance Snapshots** - balance_after for reconciliation
5. **Reference Linking** - Connect to source transactions

### Database Structure
```
Tables:
└── credit_points_transaction (Task 44)

Services:
└── LoyaltyService (Tasks 45-46)
    ├── enroll_customer
    ├── get_or_create_loyalty
    ├── calculate_points
    └── award_points
```

### Next Steps
Proceed to [03_Tasks-47-50_Redemption-Expiry-Balance.md](03_Tasks-47-50_Redemption-Expiry-Balance.md) to implement points redemption, expiry processing, and balance calculation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1350
