# Tasks 60-66: Loyalty Rewards

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** D - Loyalty Tiers & Rewards  
> **Document:** 02 of 02 (Tasks 60-66)

---

## Navigation

- **↑ Parent:** [Group D Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-59_Tier-Model-Evaluation.md](./01_Tasks-51-59_Tier-Model-Evaluation.md)
- **→ Next Document:** [Group E: Store Credit & Promotions](../Group-E_Store-Credit-Promotions/)

---

## Document Overview

### **Purpose**
Implement special rewards for loyalty customers including birthday bonuses, anniversary rewards, and automated reminder tasks.

### **Scope**
- LoyaltyReward model for configuring special rewards
- Reward type definitions and configurations
- Birthday and anniversary reward implementations
- Automated reminder Celery tasks

### **Key Outcomes**
1. ✅ LoyaltyReward model with flexible configuration
2. ✅ Reward type choices (BIRTHDAY, ANNIVERSARY, BONUS_POINTS, FREE_PRODUCT)
3. ✅ Birthday reward implementation with bonus points/discounts
4. ✅ Anniversary reward implementation for customer milestones
5. ✅ Birthday reminder Celery task for automated greetings
6. ✅ Database migrations for rewards system

---

## Tasks Covered

| Task # | Title | Complexity | Est. Time | Status |
|--------|-------|------------|-----------|--------|
| 60 | Create LoyaltyReward Model | Medium | 25 min | ⏳ Not Started |
| 61 | Define RewardType Choices | Low | 15 min | ⏳ Not Started |
| 62 | Add Reward Configuration | Medium | 25 min | ⏳ Not Started |
| 63 | Run Reward Migrations | Low | 15 min | ⏳ Not Started |
| 64 | Implement Birthday Reward | Medium | 25 min | ⏳ Not Started |
| 65 | Implement Anniversary Reward | Medium | 25 min | ⏳ Not Started |
| 66 | Create Birthday Reminder Task | Medium | 25 min | ⏳ Not Started |

---

## Implementation Details

### Task 60: Create LoyaltyReward Model

**File:** `apps/credit/models/loyalty_reward.py`

#### Dependencies
- `BaseModel` from `apps/common/models/base`
- `LoyaltyProgram` model
- Django `models`, `timezone`

#### Requirements

1. **Model Structure**
   - Inherit from `BaseModel` (uuid, timestamps, tenant, active)
   - ForeignKey to `LoyaltyProgram`
   - Fields for reward type and configuration
   - Metadata fields for display and rules

2. **Key Fields**
   ```
   - program (FK to LoyaltyProgram, CASCADE)
   - reward_type (CharField with choices)
   - name (CharField max 100)
   - description (TextField)
   - is_active (BooleanField default True)
   - valid_from (DateField null/blank)
   - valid_until (DateField null/blank)
   - configuration (JSONField)
   ```

3. **Meta Options**
   - `db_table = 'credit_loyalty_rewards'`
   - `verbose_name = 'Loyalty Reward'`
   - `verbose_name_plural = 'Loyalty Rewards'`
   - `ordering = ['program', 'reward_type', 'name']`
   - Unique together: `['program', 'reward_type']` (one reward per type per program)

4. **String Method**
   - Return: `"{program.name} - {reward_type} - {name}"`
   - Example: "Gold Program - BIRTHDAY - Birthday Bonus"

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     LoyaltyReward Model                     │
├─────────────────────────────────────────────────────────────┤
│  [BaseModel Fields]                                         │
│  - id: UUID (PK)                                            │
│  - tenant: FK → Tenant                                      │
│  - created_at: DateTime                                     │
│  - updated_at: DateTime                                     │
│  - active: Boolean                                          │
│                                                             │
│  [Relationship Fields]                                      │
│  - program: FK → LoyaltyProgram (CASCADE)                   │
│                                                             │
│  [Reward Configuration]                                     │
│  - reward_type: CharField (choices)                         │
│  - name: CharField(100)                                     │
│  - description: TextField                                   │
│  - is_active: Boolean (default True)                        │
│  - valid_from: DateField (null/blank)                       │
│  - valid_until: DateField (null/blank)                      │
│  - configuration: JSONField (flexible rules)                │
│                                                             │
│  [Methods]                                                  │
│  - __str__(): String representation                         │
│  - is_valid_today(): Check if reward active                 │
│  - get_reward_value(): Extract value from config            │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Create model file
- Location: `apps/credit/models/loyalty_reward.py`
- Import `BaseModel`, Django modules, related models

**Step 2:** Define `LoyaltyReward` class
- Inherit from `BaseModel`
- Add all required fields with proper types
- Use `JSONField` for flexible configuration storage

**Step 3:** Add Meta class
- Set db_table, verbose names
- Define ordering
- Add unique_together constraint for program and reward_type

**Step 4:** Implement `__str__` method
- Format: "{program.name} - {reward_type} - {name}"
- Handle None cases gracefully

**Step 5:** Add helper methods
- `is_valid_today()`: Check date range validity
- `get_reward_value()`: Extract value from configuration JSON
- `get_reward_rules()`: Return rules dict from configuration

**Step 6:** Update `models/__init__.py`
- Import and export `LoyaltyReward`

**Step 7:** Sri Lanka Context
- Example: "Vesak Day Special - 500 bonus points"
- Example: "Sinhala New Year Reward - 10% discount voucher"
- Support for local holiday rewards

#### Verification

```bash
# Check model definition
python manage.py check credit

# Verify model in shell
python manage.py shell
>>> from apps.credit.models import LoyaltyReward
>>> LoyaltyReward._meta.get_fields()
>>> LoyaltyReward._meta.db_table
```

**Expected:**
- Model imports successfully
- All fields present with correct types
- Meta options correctly set
- String method works as expected

---

### Task 61: Define RewardType Choices

**File:** `apps/credit/models/loyalty_reward.py`

#### Dependencies
- Task 60 (LoyaltyReward model)
- Django `models.TextChoices`

#### Requirements

1. **RewardType Enum**
   - Use `models.TextChoices` for type safety
   - Define common reward types
   - Include display labels

2. **Reward Types**
   ```
   BIRTHDAY = 'BIRTHDAY', 'Birthday Bonus'
   ANNIVERSARY = 'ANNIVERSARY', 'Anniversary Reward'
   BONUS_POINTS = 'BONUS_POINTS', 'Bonus Points'
   FREE_PRODUCT = 'FREE_PRODUCT', 'Free Product'
   DISCOUNT_VOUCHER = 'DISCOUNT_VOUCHER', 'Discount Voucher'
   FREE_SHIPPING = 'FREE_SHIPPING', 'Free Shipping'
   TIER_UPGRADE = 'TIER_UPGRADE', 'Tier Upgrade Bonus'
   REFERRAL = 'REFERRAL', 'Referral Reward'
   ```

3. **Configuration Schema Per Type**
   - BIRTHDAY: `{points: int, discount_percentage: decimal, valid_days: int}`
   - ANNIVERSARY: `{points: int, milestone_years: int, gift_product_id: uuid}`
   - BONUS_POINTS: `{points: int, reason: str}`
   - FREE_PRODUCT: `{product_id: uuid, quantity: int}`
   - DISCOUNT_VOUCHER: `{percentage: decimal, max_amount: decimal, min_purchase: decimal}`

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Reward Type Hierarchy                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                            │
│  │ RewardType  │                                            │
│  │  (Choices)  │                                            │
│  └──────┬──────┘                                            │
│         │                                                   │
│    ┌────┴────┬────────┬──────────┬────────────┐            │
│    │         │        │          │            │            │
│  BIRTHDAY  ANNIV.  BONUS   FREE_PRODUCT  DISCOUNT          │
│    │         │        │          │            │            │
│  Points   Points  Points    Product     Voucher            │
│  Discount  Gift   Reason    Quantity   Percentage          │
│  ValidDays Years                       MaxAmount           │
│                                                             │
│  Configuration Examples:                                   │
│  ┌───────────────────────────────────────────────────┐     │
│  │ BIRTHDAY: {                                       │     │
│  │   "points": 500,                                  │     │
│  │   "discount_percentage": 10.00,                   │     │
│  │   "valid_days": 7                                 │     │
│  │ }                                                 │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ ANNIVERSARY: {                                    │     │
│  │   "points": 1000,                                 │     │
│  │   "milestone_years": 1,                           │     │
│  │   "gift_product_id": "uuid..."                    │     │
│  │ }                                                 │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Define `RewardType` class
- Location: Inside `LoyaltyReward` model file, before model definition
- Inherit from `models.TextChoices`
- Use SCREAMING_SNAKE_CASE for enum names

**Step 2:** Add all reward types
- Each type: `NAME = 'VALUE', 'Display Label'`
- Include 6-8 common reward types
- Consider extensibility for future types

**Step 3:** Update `LoyaltyReward.reward_type` field
- Change to: `CharField(max_length=20, choices=RewardType.choices)`
- Add `db_index=True` for fast lookups

**Step 4:** Document configuration schema
- Add docstring to RewardType class
- Specify expected JSON structure for each type
- Include examples

**Step 5:** Add validation method
- `validate_configuration()`: Check config matches reward_type schema
- Raise `ValidationError` if invalid
- Called in model's `clean()` method

**Step 6:** Sri Lanka Context
- Example reward names in Sinhala/Tamil
- Example: Birthday reward valid for "දින 7" (7 days)
- Support for local festival rewards (Vesak, Poson, etc.)

#### Verification

```python
# In Django shell
from apps.credit.models import LoyaltyReward
print(LoyaltyReward.RewardType.choices)
print(LoyaltyReward.RewardType.BIRTHDAY)
print(LoyaltyReward.RewardType.ANNIVERSARY)
```

**Expected:**
- All reward types accessible
- Choices list displays correctly
- Type-safe enum access works

---

### Task 62: Add Reward Configuration

**File:** `apps/credit/models/loyalty_reward.py`

#### Dependencies
- Task 60 (LoyaltyReward model)
- Task 61 (RewardType choices)
- Django `JSONField`

#### Requirements

1. **Configuration JSONField**
   - Store flexible reward rules
   - Schema varies by reward_type
   - Default to empty dict `{}`

2. **Configuration Validation**
   - Validate against reward_type schema
   - Ensure required fields present
   - Check data types and ranges

3. **Configuration Helpers**
   - Method to get configuration value
   - Method to set configuration value
   - Method to validate configuration

4. **Common Configuration Fields**
   - `points`: Integer, points to award
   - `discount_percentage`: Decimal, discount percentage
   - `valid_days`: Integer, number of days reward is valid
   - `min_purchase`: Decimal, minimum purchase requirement
   - `max_usage`: Integer, times customer can use
   - `product_id`: UUID, for product-based rewards

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Reward Configuration Structure                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LoyaltyReward                                              │
│  ┌────────────────────────────────────────┐                 │
│  │ reward_type: BIRTHDAY                  │                 │
│  │ configuration: {                       │                 │
│  │   "points": 500,                       │                 │
│  │   "discount_percentage": 10.00,        │                 │
│  │   "valid_days": 7,                     │                 │
│  │   "message": "Happy Birthday!"         │                 │
│  │ }                                      │                 │
│  └────────────────────────────────────────┘                 │
│                                                             │
│  Validation Flow:                                          │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │  Save/Clean │────▶│  Validate    │────▶│   Raise     │ │
│  │   Reward    │     │ Config Schema│     │ValidationErr│ │
│  └─────────────┘     └──────────────┘     └─────────────┘ │
│         │                    │                             │
│         │                    ▼                             │
│         │             Schema Matched?                      │
│         │                    │                             │
│         │                    ▼                             │
│         │                ┌───────┐                         │
│         └───────────────▶│ Save  │                         │
│                          └───────┘                         │
│                                                             │
│  Configuration Getters:                                    │
│  - get_points() → int                                      │
│  - get_discount() → Decimal                                │
│  - get_valid_days() → int                                  │
│  - get_product_id() → UUID                                 │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Add configuration field
- Field type: `JSONField(default=dict, blank=True)`
- Help text: "Reward configuration based on reward type"
- Allow flexible structure

**Step 2:** Create validation method
- Method: `validate_configuration()`
- Check required fields based on reward_type
- Validate data types and ranges
- Example:
  ```
  if reward_type == BIRTHDAY:
      assert 'points' in config or 'discount_percentage' in config
      assert config.get('valid_days', 1) > 0
  ```

**Step 3:** Override `clean()` method
- Call `super().clean()`
- Call `validate_configuration()`
- Raise `ValidationError` with descriptive messages

**Step 4:** Add configuration getters
- `get_points()`: Return points value or 0
- `get_discount()`: Return discount or Decimal('0.00')
- `get_valid_days()`: Return valid days or default (7)
- `get_product_id()`: Return product UUID or None

**Step 5:** Add configuration setters
- `set_config(key, value)`: Update config dict safely
- `update_config(dict)`: Merge new config with existing
- Save after updates

**Step 6:** Add display helper
- `get_config_display()`: Format config for admin/UI
- Example: "500 points + 10% discount (valid 7 days)"

**Step 7:** Sri Lanka Context
- Support Rs. currency in config
- Example: `{"points": 500, "min_purchase_lkr": 5000.00}`
- Local messaging: "උපන් දිනයට සුභ පැතුම්!" (Happy Birthday in Sinhala)

#### Verification

```python
# Test configuration validation
reward = LoyaltyReward(
    program=program,
    reward_type='BIRTHDAY',
    configuration={
        'points': 500,
        'discount_percentage': 10.00,
        'valid_days': 7
    }
)
reward.full_clean()  # Should not raise
reward.save()

# Test getters
assert reward.get_points() == 500
assert reward.get_discount() == Decimal('10.00')
assert reward.get_valid_days() == 7
```

**Expected:**
- Valid configurations save successfully
- Invalid configurations raise ValidationError
- Getter methods return correct values
- Configuration display is human-readable

---

### Task 63: Run Reward Migrations

**Command:** `python manage.py makemigrations credit`  
**Command:** `python manage.py migrate credit`

#### Dependencies
- Tasks 60-62 (LoyaltyReward model complete)
- PostgreSQL database running
- Previous migrations applied

#### Requirements

1. **Migration Creation**
   - Generate migration for LoyaltyReward model
   - Include all fields and constraints
   - Add indexes for performance

2. **Migration Review**
   - Check generated SQL
   - Verify foreign key constraints
   - Ensure proper indexes

3. **Migration Application**
   - Apply to development database
   - Verify table created
   - Check indexes created

#### Instructions

**Step 1:** Generate migrations
```bash
python manage.py makemigrations credit
```

**Expected Output:**
```
Migrations for 'credit':
  apps/credit/migrations/0007_loyaltyreward.py
    - Create model LoyaltyReward
```

**Step 2:** Review migration file
- Location: `apps/credit/migrations/0007_loyaltyreward.py`
- Check field definitions match model
- Verify unique_together constraint present
- Ensure foreign key to LoyaltyProgram included

**Step 3:** Check SQL (optional)
```bash
python manage.py sqlmigrate credit 0007
```
- Review generated SQL
- Verify table name `credit_loyalty_rewards`
- Check indexes on program, reward_type, is_active

**Step 4:** Apply migration
```bash
python manage.py migrate credit
```

**Expected Output:**
```
Running migrations:
  Applying credit.0007_loyaltyreward... OK
```

**Step 5:** Verify in database
```sql
\d credit_loyalty_rewards
-- Check columns, constraints, indexes
```

**Step 6:** Test in Django shell
```python
from apps.credit.models import LoyaltyReward
LoyaltyReward.objects.count()  # Should be 0
```

#### Verification

**Database Check:**
```sql
-- Table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'credit_loyalty_rewards';

-- Columns exist
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'credit_loyalty_rewards';

-- Unique constraint exists
SELECT constraint_name, constraint_type FROM information_schema.table_constraints
WHERE table_name = 'credit_loyalty_rewards' AND constraint_type = 'UNIQUE';
```

**Django Check:**
```bash
python manage.py check credit
# Should show no issues
```

**Expected:**
- Migration applied successfully
- Table `credit_loyalty_rewards` exists
- All fields present with correct types
- Unique constraint on program + reward_type
- Foreign key to loyalty_programs table

---

### Task 64: Implement Birthday Reward

**File:** `apps/credit/services/loyalty_service.py` (extend)

#### Dependencies
- Task 60-63 (LoyaltyReward model)
- `CustomerLoyalty` model
- `Customer` model with `date_of_birth` field
- Django `timezone`

#### Requirements

1. **Birthday Detection**
   - Check if today is customer's birthday
   - Handle leap year birthdays (Feb 29)
   - Support multi-day birthday period (e.g., 7 days)

2. **Reward Application**
   - Check if customer already received birthday reward this year
   - Award bonus points based on configuration
   - Apply discount voucher if configured
   - Create PointsTransaction record

3. **Reward Eligibility**
   - Customer must have loyalty account
   - Birthday must be set in customer profile
   - Reward must be active and within valid date range
   - Customer should not have received reward this year

4. **Tracking**
   - Store reward application date
   - Prevent duplicate rewards in same year
   - Log reward details

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│               Birthday Reward Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Trigger: Daily Task (2:00 AM)                              │
│  ┌────────────────────────────────────────────┐             │
│  │  1. Get all customers with birthdays today │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  2. Check loyalty account exists           │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  3. Check not already rewarded this year   │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  4. Get BIRTHDAY reward config             │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  5. Award points (500 points)              │             │
│  │     Create PointsTransaction               │             │
│  │     Type: BONUS, Reason: "Birthday"        │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  6. Send birthday greeting email           │             │
│  │     Include reward details                 │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  7. Mark reward as claimed for this year   │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
│  Tracking:                                                  │
│  - Last birthday reward date on CustomerLoyalty             │
│  - PointsTransaction record                                 │
│  - Email sent notification                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Add birthday tracking field
- Model: `CustomerLoyalty`
- Field: `last_birthday_reward_date = DateField(null=True, blank=True)`
- Create migration

**Step 2:** Create `apply_birthday_reward` method
- Location: `LoyaltyService` class
- Parameters: `customer_loyalty_id`
- Returns: `dict` with success status and details

**Step 3:** Implement birthday check logic
```
1. Get customer and loyalty account
2. Check customer.date_of_birth is set
3. Check today matches birthday (month and day)
4. Check last_birthday_reward_date.year != current_year
5. Get BIRTHDAY reward from program
6. Validate reward is active and valid
```

**Step 4:** Apply reward
```
1. Extract points from reward.configuration
2. Call award_points with reason="Birthday Bonus"
3. Update loyalty.last_birthday_reward_date = today
4. Create notification/email
```

**Step 5:** Handle discount vouchers
- If discount_percentage in config, create voucher record
- Store voucher in separate model or use existing coupon system
- Set expiry based on valid_days from config

**Step 6:** Add error handling
- Customer not found → log and skip
- DOB not set → log and skip
- Reward not configured → log and skip
- Already claimed → log and skip

**Step 7:** Sri Lanka Context
- Birthday message in Sinhala/Tamil/English
- Example: "උපන් දිනයට සුභ පැතුම්! ලකුණු 500ක් ලැබී ඇත."
- Support local calendar formats

#### Verification

```python
# Test birthday reward
from apps.credit.services import LoyaltyService
from apps.customers.models import Customer
from datetime import date

# Set customer birthday to today
customer = Customer.objects.first()
customer.date_of_birth = date.today()
customer.save()

loyalty = customer.loyalty
initial_points = loyalty.points_balance

# Apply birthday reward
result = LoyaltyService.apply_birthday_reward(loyalty.id)

# Verify
assert result['success'] == True
assert loyalty.points_balance == initial_points + 500
assert loyalty.last_birthday_reward_date == date.today()

# Try again (should fail - already claimed)
result2 = LoyaltyService.apply_birthday_reward(loyalty.id)
assert result2['success'] == False
assert 'already claimed' in result2['message'].lower()
```

**Expected:**
- Birthday reward applies correctly
- Points awarded and transaction created
- Prevents duplicate rewards in same year
- Email sent with birthday greeting
- Tracking field updated

---

### Task 65: Implement Anniversary Reward

**File:** `apps/credit/services/loyalty_service.py` (extend)

#### Dependencies
- Task 64 (Birthday reward implementation)
- `CustomerLoyalty` model with `created_at` field
- `Customer` model
- `LoyaltyReward` model

#### Requirements

1. **Anniversary Detection**
   - Calculate years since customer first joined
   - Check if today is anniversary date
   - Support milestone anniversaries (1 year, 2 years, 5 years, 10 years)

2. **Milestone Rewards**
   - Different rewards for different milestones
   - Increasing rewards for longer loyalty
   - Configuration per milestone year

3. **Reward Application**
   - Check if anniversary reward already claimed this year
   - Award bonus points based on milestone
   - Optional gift product for major milestones
   - Create transaction record

4. **Tracking**
   - Store last anniversary reward date
   - Track milestone reached
   - Prevent duplicate rewards

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Anniversary Reward Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Customer Joined: 2023-06-15                                │
│  Today: 2024-06-15 (1 year anniversary)                     │
│                                                             │
│  ┌────────────────────────────────────────────┐             │
│  │  1. Calculate years since joined           │             │
│  │     years = today.year - created_at.year   │             │
│  │     if month/day not reached, years -= 1   │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  2. Check anniversary is today             │             │
│  │     created_at.month == today.month        │             │
│  │     created_at.day == today.day            │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  3. Check not rewarded this anniversary    │             │
│  │     last_anniversary_reward_year != year   │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  4. Get ANNIVERSARY reward config          │             │
│  │     Milestone 1: 1000 points               │             │
│  │     Milestone 2: 1500 points               │             │
│  │     Milestone 5: 3000 points + gift        │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  5. Award milestone reward                 │             │
│  │     Points based on years                  │             │
│  │     Gift product for milestones 5, 10      │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  6. Send anniversary email                 │             │
│  │     Thank customer for loyalty             │             │
│  │     Highlight years of partnership         │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  7. Update tracking fields                 │             │
│  │     last_anniversary_reward_year = year    │             │
│  │     anniversary_rewards_count += 1         │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
│  Milestone Examples:                                        │
│  Year 1: 1000 points                                        │
│  Year 2: 1500 points                                        │
│  Year 3: 2000 points                                        │
│  Year 5: 3000 points + gift voucher                         │
│  Year 10: 5000 points + premium gift                        │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Add anniversary tracking fields
- Model: `CustomerLoyalty`
- Fields:
  ```
  - last_anniversary_reward_year = IntegerField(null=True, blank=True)
  - anniversary_rewards_count = IntegerField(default=0)
  - years_as_customer (property - calculated from created_at)
  ```
- Create migration

**Step 2:** Add `years_as_customer` property
```python
@property
def years_as_customer(self):
    today = date.today()
    years = today.year - self.created_at.year
    if (today.month, today.day) < (self.created_at.month, self.created_at.day):
        years -= 1
    return years
```

**Step 3:** Create `apply_anniversary_reward` method
- Location: `LoyaltyService` class
- Parameters: `customer_loyalty_id`
- Returns: `dict` with success status and details

**Step 4:** Implement anniversary check logic
```
1. Get loyalty account
2. Calculate years_as_customer
3. Check today matches anniversary (month/day)
4. Check last_anniversary_reward_year != current_year
5. Get ANNIVERSARY reward from program
6. Determine milestone tier
```

**Step 5:** Define milestone configuration
```
Milestones in reward.configuration:
{
  "milestones": {
    "1": {"points": 1000, "message": "Thank you for 1 year!"},
    "2": {"points": 1500, "message": "2 years of loyalty!"},
    "3": {"points": 2000},
    "5": {"points": 3000, "gift_product_id": "uuid..."},
    "10": {"points": 5000, "gift_product_id": "uuid..."}
  },
  "default_points_per_year": 500  // For non-milestone years
}
```

**Step 6:** Apply reward
```
1. Get milestone config for years_as_customer
2. If no specific milestone, use default_points_per_year * years
3. Award points with reason="Anniversary - {years} years"
4. If gift_product_id, create gift order or voucher
5. Update tracking fields
```

**Step 7:** Create anniversary email
- Template with customer name and years
- Highlight achievements (total points earned, purchases made)
- Include reward details
- Express gratitude

**Step 8:** Sri Lanka Context
- Anniversary message in local languages
- Example: "වසර {years}ක සේවාදායකත්වයට ස්තූතියි!"
- Celebrate Sri Lankan business partnerships

#### Verification

```python
# Test anniversary reward
from apps.credit.services import LoyaltyService
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

# Create loyalty account with anniversary today (1 year ago)
loyalty = CustomerLoyalty.objects.create(
    customer=customer,
    program=program,
    created_at=date.today() - relativedelta(years=1)
)

initial_points = loyalty.points_balance

# Apply anniversary reward
result = LoyaltyService.apply_anniversary_reward(loyalty.id)

# Verify
assert result['success'] == True
assert result['years'] == 1
assert loyalty.points_balance == initial_points + 1000  # Milestone 1
assert loyalty.last_anniversary_reward_year == date.today().year
assert loyalty.anniversary_rewards_count == 1

# Test 5-year milestone (should include gift)
loyalty.created_at = date.today() - relativedelta(years=5)
loyalty.last_anniversary_reward_year = None
loyalty.save()

result = LoyaltyService.apply_anniversary_reward(loyalty.id)
assert result['success'] == True
assert result['years'] == 5
assert result.get('gift_product_id') is not None
```

**Expected:**
- Anniversary reward applies correctly
- Milestone-specific rewards work
- Years calculation accurate
- Prevents duplicate rewards
- Email sent with personalized message
- Tracking fields updated

---

### Task 66: Create Birthday Reminder Task

**File:** `apps/credit/tasks.py` (extend)

#### Dependencies
- Task 64 (Birthday reward implementation)
- Celery configuration
- Email service
- Customer and CustomerLoyalty models

#### Requirements

1. **Celery Periodic Task**
   - Run daily at specific time (e.g., 6:00 AM)
   - Check for birthdays today
   - Apply birthday rewards
   - Send birthday greetings

2. **Batch Processing**
   - Process all birthdays in single task run
   - Handle large customer bases efficiently
   - Log successes and failures

3. **Email Notifications**
   - Birthday greeting email
   - Include reward details
   - Personalized message
   - Support multiple languages

4. **Error Handling**
   - Log failed reward applications
   - Continue processing other customers on failure
   - Retry failed emails
   - Alert admins of issues

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│         Birthday Reminder Task Flow (Daily 6:00 AM)        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Celery Beat Scheduler                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  Every day at 6:00 AM                      │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  process_birthday_rewards.delay()          │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  Get all customers with birthday today     │             │
│  │  (month=today.month, day=today.day)        │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  For each customer:                        │             │
│  │    ┌──────────────────────────────────┐    │             │
│  │    │ 1. Check loyalty account exists  │    │             │
│  │    └──────────────┬───────────────────┘    │             │
│  │                   │                        │             │
│  │                   ▼                        │             │
│  │    ┌──────────────────────────────────┐    │             │
│  │    │ 2. Apply birthday reward         │    │             │
│  │    │    (Task 64 implementation)      │    │             │
│  │    └──────────────┬───────────────────┘    │             │
│  │                   │                        │             │
│  │                   ▼                        │             │
│  │    ┌──────────────────────────────────┐    │             │
│  │    │ 3. Send birthday email           │    │             │
│  │    │    - Greeting                    │    │             │
│  │    │    - Reward details              │    │             │
│  │    │    - Personalized message        │    │             │
│  │    └──────────────┬───────────────────┘    │             │
│  │                   │                        │             │
│  │                   ▼                        │             │
│  │    ┌──────────────────────────────────┐    │             │
│  │    │ 4. Log result (success/failure)  │    │             │
│  │    └──────────────────────────────────┘    │             │
│  └────────────────────────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  Generate summary report                   │             │
│  │  - Total processed: 25                     │             │
│  │  - Successful: 24                          │             │
│  │  - Failed: 1                               │             │
│  │  - Emails sent: 24                         │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  Send admin notification (if failures)     │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
│  Also check for anniversary rewards:                        │
│  - Similar flow for anniversary detection                   │
│  - Can combine in same task or separate task               │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Create Celery task
- Location: `apps/credit/tasks.py`
- Task name: `process_birthday_rewards`
- Decorator: `@shared_task(name='credit.process_birthday_rewards')`

**Step 2:** Implement task logic
```python
@shared_task(name='credit.process_birthday_rewards')
def process_birthday_rewards():
    today = date.today()
    customers = Customer.objects.filter(
        date_of_birth__month=today.month,
        date_of_birth__day=today.day,
        loyalty__isnull=False
    ).select_related('loyalty')
    
    results = {'total': 0, 'success': 0, 'failed': 0, 'errors': []}
    
    for customer in customers:
        try:
            result = LoyaltyService.apply_birthday_reward(customer.loyalty.id)
            results['total'] += 1
            if result['success']:
                results['success'] += 1
                send_birthday_email(customer, result)
            else:
                results['failed'] += 1
                results['errors'].append(f"{customer.email}: {result['message']}")
        except Exception as e:
            results['failed'] += 1
            results['errors'].append(f"{customer.email}: {str(e)}")
            logger.error(f"Birthday reward error for {customer.id}: {e}")
    
    # Log summary
    logger.info(f"Birthday rewards processed: {results}")
    
    # Alert admin if many failures
    if results['failed'] > 0:
        send_admin_alert('Birthday Reward Failures', results)
    
    return results
```

**Step 3:** Create birthday email function
```python
def send_birthday_email(customer, reward_result):
    context = {
        'customer_name': customer.first_name,
        'points_awarded': reward_result.get('points', 0),
        'discount': reward_result.get('discount', 0),
        'valid_days': reward_result.get('valid_days', 7),
    }
    
    send_email(
        template='emails/birthday_greeting.html',
        to_email=customer.email,
        subject='Happy Birthday from [Store Name]!',
        context=context
    )
```

**Step 4:** Add Celery Beat schedule
- File: `config/celery.py` or settings
```python
CELERY_BEAT_SCHEDULE = {
    'process-birthday-rewards': {
        'task': 'credit.process_birthday_rewards',
        'schedule': crontab(hour=6, minute=0),  # 6:00 AM daily
    },
    # Optionally combine with anniversaries or separate task
    'process-anniversary-rewards': {
        'task': 'credit.process_anniversary_rewards',
        'schedule': crontab(hour=6, minute=30),  # 6:30 AM daily
    },
}
```

**Step 5:** Create anniversary task (similar structure)
```python
@shared_task(name='credit.process_anniversary_rewards')
def process_anniversary_rewards():
    # Similar to birthday task but for anniversaries
    # Use apply_anniversary_reward method
    pass
```

**Step 6:** Add monitoring and alerts
- Log task execution to file or database
- Track success/failure rates
- Alert admins via email/Slack if failure rate > 10%

**Step 7:** Sri Lanka Context
- Schedule task considering Sri Lankan timezone (UTC+5:30)
- Birthday emails in customer's preferred language
- Consider local holidays (don't send on Poya days if preferred)

#### Verification

**Manual Test:**
```python
# Test task directly
from apps.credit.tasks import process_birthday_rewards

# Set some test customers' birthdays to today
today = date.today()
Customer.objects.filter(id__in=[...]).update(
    date_of_birth=today.replace(year=1990)
)

# Run task
result = process_birthday_rewards.delay()
print(result.get())
```

**Check Celery Beat:**
```bash
# View scheduled tasks
celery -A config inspect scheduled

# Check last run
# View logs for task execution
```

**Verify Email Sent:**
- Check email logs or test inbox
- Verify email content is correct
- Check reward details included

**Expected:**
- Task runs daily at 6:00 AM
- All birthday customers processed
- Rewards applied correctly
- Emails sent successfully
- Failures logged and reported
- Admin alerted if issues

---

## Summary

### Completed Tasks

| Task # | Status | Component | Notes |
|--------|--------|-----------|-------|
| 60 | ✅ | LoyaltyReward Model | Multi-type reward system |
| 61 | ✅ | RewardType Choices | 8 reward types defined |
| 62 | ✅ | Reward Configuration | JSON-based flexible config |
| 63 | ✅ | Reward Migrations | Database schema updated |
| 64 | ✅ | Birthday Reward | Auto-reward on birthday |
| 65 | ✅ | Anniversary Reward | Milestone-based rewards |
| 66 | ✅ | Birthday Reminder Task | Daily Celery task at 6:00 AM |

### Key Deliverables

1. **LoyaltyReward Model**
   - File: `apps/credit/models/loyalty_reward.py`
   - Features: Multi-type rewards, JSON config, validation
   - Fields: program, reward_type, configuration, valid_from/until

2. **Birthday Reward System**
   - Service method: `LoyaltyService.apply_birthday_reward()`
   - Auto-detects birthdays and awards points
   - Prevents duplicate rewards per year
   - Sends personalized email

3. **Anniversary Reward System**
   - Service method: `LoyaltyService.apply_anniversary_reward()`
   - Milestone-based rewards (1yr, 2yr, 5yr, 10yr)
   - Escalating rewards for long-term customers
   - Thank-you emails

4. **Automated Tasks**
   - Task: `process_birthday_rewards` (daily 6:00 AM)
   - Task: `process_anniversary_rewards` (daily 6:30 AM)
   - Batch processing with error handling
   - Admin alerts on failures

### Technical Highlights

**Reward Configuration System:**
- Flexible JSON-based configuration per reward type
- Schema validation ensures data integrity
- Supports points, discounts, products, vouchers
- Extensible for future reward types

**Birthday/Anniversary Detection:**
- Efficient database queries (month/day match)
- Handles leap year birthdays
- Prevents duplicate rewards
- Tracks last reward date

**Email Notifications:**
- Personalized birthday/anniversary greetings
- Includes reward details
- Multi-language support
- Asynchronous sending via Celery

### Sri Lanka Context

**Local Celebrations:**
- Birthday messages in Sinhala/Tamil/English
- Support for Vesak, Poson, New Year special rewards
- Rs. currency in reward configurations

**Business Practices:**
- Anniversary rewards strengthen customer relationships
- Milestone gifts for 5-year, 10-year loyalty
- Birthday rewards common in Sri Lankan retail

**Examples:**
- Birthday: "උපන් දිනයට සුභ පැතුම්! ලකුණු 500ක් ලැබී ඇත."
- Anniversary: "වසර 5ක සේවාදායකත්වයට ස්තූතියි! ලකුණු 3000 සහ තෑග වවුචරයක්."

### Testing Checklist

- [ ] LoyaltyReward model creates successfully
- [ ] Reward types validate correctly
- [ ] Configuration validation prevents invalid configs
- [ ] Birthday reward applies on correct date
- [ ] Anniversary reward calculates years correctly
- [ ] Duplicate rewards prevented
- [ ] Birthday email sends with correct details
- [ ] Celery tasks run on schedule
- [ ] Failed rewards logged properly
- [ ] Admin alerts work

### Next Steps

1. **Continue to Group E:**
   - [Group E: Store Credit & Promotions](../Group-E_Store-Credit-Promotions/)
   - Tasks 67-80: Store credit and points promotions

2. **Optional Enhancements:**
   - Add more reward types (referral, social media)
   - Implement reward redemption tracking
   - Create admin dashboard for reward analytics
   - Add A/B testing for reward effectiveness

---

## Navigation

- **↑ Parent:** [Group D Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-59_Tier-Model-Evaluation.md](./01_Tasks-51-59_Tier-Model-Evaluation.md)
- **→ Next Document:** [Group E: Store Credit & Promotions](../Group-E_Store-Credit-Promotions/)

---

**Document End** - Tasks 60-66 Complete ✅
