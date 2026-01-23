# Tasks 51-59: Loyalty Tier Model and Evaluation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** D - Loyalty Tiers & Rewards  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-60-66_Rewards.md](02_Tasks-60-66_Rewards.md)

---

## Document Overview

This document implements the loyalty tier system with the LoyaltyTier model and tier evaluation logic. The tier system provides graduated benefits based on customer spending and points accumulation, including automatic upgrades, downgrades, and periodic evaluation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create LoyaltyTier Model | Medium | 25 min |
| 52 | Add Tier Threshold Fields | Medium | 20 min |
| 53 | Add Tier Benefit Fields | Medium | 20 min |
| 54 | Add Tier Display Fields | Medium | 20 min |
| 55 | Run Tier Migrations | Low | 15 min |
| 56 | Implement Tier Evaluation | High | 35 min |
| 57 | Implement Tier Upgrade | Medium | 25 min |
| 58 | Implement Tier Downgrade | Medium | 25 min |
| 59 | Create Tier Evaluation Task | Medium | 25 min |

---

## Task 51: Create LoyaltyTier Model

### Overview
Create the LoyaltyTier model to define loyalty tiers (Bronze, Silver, Gold, Platinum) with requirements and benefits. This model stores tier configuration including qualification thresholds, multipliers, and benefits that customers receive.

### Dependencies
- LoyaltyProgram model exists
- CustomerLoyalty model exists (forward reference already defined)

### Instructions

1. **Create loyalty tier model file**
   - Navigate to `apps/credit/models/` directory
   - Create new file `loyalty_tier.py`
   - This contains tier definitions and benefits

2. **Import required dependencies**
   - Import Django model components
   - Import BaseModel
   - Import Decimal for numeric fields

3. **Create LoyaltyTier model class**
   - Inherit from BaseModel
   - Add comprehensive model docstring
   - Describe tier system purpose

4. **Add tier name field**
   - CharField: name
   - max_length=50
   - Unique=True
   - Tier display name (Bronze, Silver, Gold, Platinum)

5. **Add tier order field**
   - PositiveIntegerField: order
   - Unique=True
   - Sorting order (1, 2, 3, 4)
   - Lower order = lower tier

6. **Configure Meta class**
   - db_table = 'credit_loyalty_tier'
   - verbose_name = 'Loyalty Tier'
   - verbose_name_plural = 'Loyalty Tiers'
   - ordering = ['order']
   - Default ordering by tier level

7. **Add __str__ method**
   - Return tier name
   - Format: "{name} (Level {order})"
   - Helpful in admin and displays

### Loyalty Tier Structure

```
Tier Hierarchy:
─────────────────────────────────────────────────────

┌─────────────────────────────────────────────────┐
│  PLATINUM (Level 4)                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Highest tier - Premium benefits                │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  GOLD (Level 3)                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Advanced tier - Enhanced benefits              │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  SILVER (Level 2)                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Mid-tier - Good benefits                       │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  BRONZE (Level 1)                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Entry tier - Basic benefits                    │
└─────────────────────────────────────────────────┘
```

### Model Purpose

| Field | Type | Purpose |
|-------|------|---------|
| name | CharField | Tier display name |
| order | PositiveIntegerField | Sorting/hierarchy order |

### Tier Names and Levels

| Tier | Order | Typical Usage |
|------|-------|---------------|
| **Bronze** | 1 | Entry level, new members |
| **Silver** | 2 | Mid-level, regular shoppers |
| **Gold** | 3 | High-value, loyal customers |
| **Platinum** | 4 | VIP, top spenders |

### Expected Outcome
- Core LoyaltyTier model created
- Tier name and order fields
- Foundation for threshold and benefits
- Hierarchical tier structure

### Verification Checklist
- [ ] `loyalty_tier.py` file created
- [ ] LoyaltyTier class defined
- [ ] Inherits from BaseModel
- [ ] name CharField added (unique)
- [ ] order PositiveIntegerField added (unique)
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model docstring included

---

## Task 52: Add Tier Threshold Fields

### Overview
Add threshold fields that define the qualification requirements for each tier. These fields specify the minimum points and spending needed to achieve or maintain a tier level.

### Dependencies
- Task 51: Create LoyaltyTier Model

### Instructions

1. **Open loyalty tier model**
   - Navigate to `apps/credit/models/loyalty_tier.py`
   - Locate LoyaltyTier class

2. **Add minimum points required field**
   - PositiveIntegerField: min_points_required
   - default=0
   - Minimum lifetime points to qualify
   - Used in tier evaluation

3. **Add points help text**
   - help_text explaining points requirement
   - "Minimum lifetime points earned to qualify for this tier"
   - Clarifies cumulative nature

4. **Add minimum spend required field**
   - DecimalField: min_spend_required
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - Minimum lifetime spend to qualify

5. **Add spend help text**
   - help_text for spend requirement
   - "Minimum lifetime spend to qualify for this tier"
   - Clarifies cumulative spending

6. **Add qualification logic note**
   - Document OR vs AND logic
   - Typically: points OR spend (whichever qualifies)
   - Can be configured for AND logic

### Tier Qualification Thresholds

```
Standard Tier Thresholds (Sri Lanka Context):
─────────────────────────────────────────────────────

┌──────────┬───────────┬─────────────┬─────────────┐
│ Tier     │ Order     │ Min Points  │ Min Spend   │
├──────────┼───────────┼─────────────┼─────────────┤
│ Bronze   │ 1         │ 0           │ Rs. 0       │
│ Silver   │ 2         │ 1,000       │ Rs. 25,000  │
│ Gold     │ 3         │ 5,000       │ Rs. 100,000 │
│ Platinum │ 4         │ 10,000      │ Rs. 250,000 │
└──────────┴───────────┴─────────────┴─────────────┘

Qualification Logic (OR):
Customer qualifies if EITHER:
- lifetime_points_earned >= min_points_required
OR
- lifetime_spend >= min_spend_required
```

### Qualification Scenarios

#### Scenario 1: Points Qualification
```
Customer Profile:
├── Lifetime Points Earned: 6,000
├── Lifetime Spend: Rs. 80,000
└── Current Tier: Silver

Evaluation for Gold:
├── Min Points Required: 5,000
├── Min Spend Required: Rs. 100,000
├── Points Check: 6,000 >= 5,000 ✓
├── Spend Check: 80,000 >= 100,000 ✗
└── Result: QUALIFIED (points sufficient)

Tier Upgrade: Silver → Gold
```

#### Scenario 2: Spend Qualification
```
Customer Profile:
├── Lifetime Points Earned: 3,500
├── Lifetime Spend: Rs. 120,000
└── Current Tier: Silver

Evaluation for Gold:
├── Min Points Required: 5,000
├── Min Spend Required: Rs. 100,000
├── Points Check: 3,500 >= 5,000 ✗
├── Spend Check: 120,000 >= 100,000 ✓
└── Result: QUALIFIED (spend sufficient)

Tier Upgrade: Silver → Gold
```

#### Scenario 3: Neither Qualifier Met
```
Customer Profile:
├── Lifetime Points Earned: 4,200
├── Lifetime Spend: Rs. 85,000
└── Current Tier: Silver

Evaluation for Gold:
├── Min Points Required: 5,000
├── Min Spend Required: Rs. 100,000
├── Points Check: 4,200 >= 5,000 ✗
├── Spend Check: 85,000 >= 100,000 ✗
└── Result: NOT QUALIFIED

Tier Status: Remains Silver
Points Needed: 800 more points OR Rs. 15,000 more spend
```

### Threshold Progression Examples

#### Conservative Progression
```
Tier         Points    Spend
─────────────────────────────────────
Bronze       0         Rs. 0
Silver       2,000     Rs. 50,000
Gold         10,000    Rs. 200,000
Platinum     25,000    Rs. 500,000

Characteristics:
├── High barriers to entry
├── Exclusive higher tiers
└── Long-term loyalty focus
```

#### Generous Progression
```
Tier         Points    Spend
─────────────────────────────────────
Bronze       0         Rs. 0
Silver       500       Rs. 10,000
Gold         2,500     Rs. 50,000
Platinum     7,500     Rs. 150,000

Characteristics:
├── Lower barriers
├── More accessible tiers
└── Encourages participation
```

### Expected Outcome
- Tier qualification thresholds defined
- Points and spend requirements
- Foundation for tier evaluation
- Clear qualification rules

### Verification Checklist
- [ ] min_points_required field added
- [ ] min_spend_required field added
- [ ] Both fields have defaults (0)
- [ ] Help text added to both fields
- [ ] Decimal field uses appropriate precision
- [ ] Fields support tier qualification logic

---

## Task 53: Add Tier Benefit Fields

### Overview
Add benefit fields that define what customers receive at each tier level. These include points multipliers for earning bonuses, discount percentages, and special privileges like free shipping.

### Dependencies
- Task 52: Add Tier Threshold Fields

### Instructions

1. **Open loyalty tier model**
   - Navigate to `apps/credit/models/loyalty_tier.py`
   - Locate LoyaltyTier class

2. **Add points multiplier field**
   - DecimalField: points_multiplier
   - max_digits=4, decimal_places=2
   - default=Decimal('1.00')
   - Applied when earning points
   - Range: 1.0 to 3.0 typically

3. **Add multiplier help text**
   - help_text for multiplier
   - "Points earning multiplier (1.0 = standard, 1.5 = 50% bonus)"
   - Clarifies multiplication factor

4. **Add discount percentage field**
   - DecimalField: discount_percentage
   - max_digits=5, decimal_places=2
   - default=Decimal('0.00')
   - Automatic discount on purchases
   - Range: 0 to 25 typically

5. **Add discount help text**
   - help_text for discount
   - "Automatic discount percentage on all purchases"
   - Clarifies discount application

6. **Add free shipping field**
   - BooleanField: free_shipping
   - default=False
   - Whether tier gets free shipping
   - Simple benefit flag

7. **Add priority support field**
   - BooleanField: priority_support
   - default=False
   - Access to priority customer service
   - Premium benefit

8. **Add early access field**
   - BooleanField: early_access
   - default=False
   - Early access to sales/new products
   - VIP benefit

### Tier Benefits Configuration

```
Standard Tier Benefits:
─────────────────────────────────────────────────────

┌──────────┬────────┬──────────┬──────────┬──────────┐
│ Tier     │ Points │ Discount │ Free     │ Priority │
│          │ Mult.  │ %        │ Shipping │ Support  │
├──────────┼────────┼──────────┼──────────┼──────────┤
│ Bronze   │ 1.0x   │ 0%       │ No       │ No       │
│ Silver   │ 1.25x  │ 5%       │ No       │ No       │
│ Gold     │ 1.5x   │ 10%      │ Yes      │ Yes      │
│ Platinum │ 2.0x   │ 15%      │ Yes      │ Yes      │
└──────────┴────────┴──────────┴──────────┴──────────┘

Additional Benefits:
├── Gold+: Early access to sales
├── Platinum: Birthday gifts, exclusive events
└── All: Points never expire (optional)
```

### Points Multiplier Examples

```
Purchase Scenario: Rs. 10,000
Base Points: 100 points (Rs. 100 = 1 point)
─────────────────────────────────────────────────────

Bronze (1.0x):
├── Calculation: 100 × 1.0 = 100 points
└── Total Earned: 100 points

Silver (1.25x):
├── Calculation: 100 × 1.25 = 125 points
└── Total Earned: 125 points (+25% bonus)

Gold (1.5x):
├── Calculation: 100 × 1.5 = 150 points
└── Total Earned: 150 points (+50% bonus)

Platinum (2.0x):
├── Calculation: 100 × 2.0 = 200 points
└── Total Earned: 200 points (+100% bonus)
```

### Discount Percentage Examples

```
Purchase Scenario: Rs. 50,000 order
─────────────────────────────────────────────────────

Bronze (0% discount):
├── Subtotal: Rs. 50,000
├── Tier Discount: Rs. 0
└── Final: Rs. 50,000

Silver (5% discount):
├── Subtotal: Rs. 50,000
├── Tier Discount: Rs. 2,500
└── Final: Rs. 47,500 (Save Rs. 2,500)

Gold (10% discount):
├── Subtotal: Rs. 50,000
├── Tier Discount: Rs. 5,000
└── Final: Rs. 45,000 (Save Rs. 5,000)

Platinum (15% discount):
├── Subtotal: Rs. 50,000
├── Tier Discount: Rs. 7,500
└── Final: Rs. 42,500 (Save Rs. 7,500)
```

### Combined Benefits Example

```
Platinum Customer Purchase:
─────────────────────────────────────────────────────

Order Details:
├── Subtotal: Rs. 100,000
├── Shipping: Rs. 1,500 (waived)
└── Items: Electronics

Benefits Applied:
1. Tier Discount (15%):
   └── Rs. 100,000 × 15% = Rs. 15,000 OFF

2. Free Shipping:
   └── Rs. 1,500 shipping waived

3. Points Earned (2.0x):
   ├── Base: 1,000 points (Rs. 100 = 1 pt)
   ├── Multiplier: 2.0x
   └── Earned: 2,000 points

4. Priority Support:
   └── 24/7 dedicated support line

Final Calculation:
├── Subtotal: Rs. 100,000
├── Tier Discount: -Rs. 15,000
├── Shipping: Rs. 0 (free)
├── Total Paid: Rs. 85,000
├── Points Earned: 2,000
└── Total Savings: Rs. 16,500
```

### Expected Outcome
- Points multiplier for earning bonuses
- Automatic discount percentages
- Additional benefit flags
- Complete tier benefit structure

### Verification Checklist
- [ ] points_multiplier field added
- [ ] discount_percentage field added
- [ ] free_shipping field added
- [ ] priority_support field added
- [ ] early_access field added
- [ ] All Decimal fields have appropriate precision
- [ ] Default values set appropriately
- [ ] Help text added to key fields
- [ ] Benefit ranges documented

---

## Task 54: Add Tier Display Fields

### Overview
Add display fields for visual presentation of tiers including description, badge images, and brand colors. These fields enhance the tier system's visual appeal and help customers understand tier benefits.

### Dependencies
- Task 53: Add Tier Benefit Fields

### Instructions

1. **Open loyalty tier model**
   - Navigate to `apps/credit/models/loyalty_tier.py`
   - Locate LoyaltyTier class

2. **Add tier description field**
   - TextField: description
   - blank=True, null=True
   - Detailed tier information
   - Benefits summary

3. **Add badge image field**
   - ImageField: badge_image
   - upload_to='loyalty/tier_badges/'
   - blank=True, null=True
   - Visual tier representation

4. **Add tier color field**
   - CharField: color
   - max_length=7
   - Hex color code (#RRGGBB)
   - default='#808080' (gray)
   - Brand color for tier

5. **Add color help text**
   - help_text for color field
   - "Hex color code for tier branding (e.g., #FFD700 for gold)"
   - Clarifies format

6. **Add icon/emoji field (optional)**
   - CharField: icon
   - max_length=10
   - Unicode emoji or icon class
   - blank=True, null=True

### Tier Visual Design

```
Tier Colors (Standard):
─────────────────────────────────────────────────────

Bronze:   #CD7F32  ▓▓▓▓▓▓
Silver:   #C0C0C0  ▓▓▓▓▓▓
Gold:     #FFD700  ▓▓▓▓▓▓
Platinum: #E5E4E2  ▓▓▓▓▓▓

Alternative Colors:
Bronze:   #B87333  ▓▓▓▓▓▓ (Copper)
Silver:   #AAA9AD  ▓▓▓▓▓▓ (True silver)
Gold:     #FFD700  ▓▓▓▓▓▓ (Standard gold)
Platinum: #E5E4E2  ▓▓▓▓▓▓ (Platinum metallic)
```

### Tier Descriptions

```
Bronze Tier Description:
─────────────────────────────────────────────────────
"Welcome to our loyalty program! As a Bronze member, 
you'll earn 1 point for every Rs. 100 spent. Enjoy 
exclusive member-only promotions and birthday rewards."

Benefits:
• Standard points earning (1.0x)
• Member-only promotions
• Birthday rewards

Silver Tier Description:
─────────────────────────────────────────────────────
"Congratulations on reaching Silver! Enjoy 25% bonus 
points on all purchases and 5% discount on your orders. 
Keep shopping to reach Gold tier!"

Benefits:
• 25% bonus points (1.25x)
• 5% automatic discount
• Member promotions
• Birthday rewards

Gold Tier Description:
─────────────────────────────────────────────────────
"You're Golden! Enjoy 50% bonus points, 10% discount, 
FREE shipping on all orders, and priority customer 
support. Plus early access to sales and new products!"

Benefits:
• 50% bonus points (1.5x)
• 10% automatic discount
• Free shipping always
• Priority support
• Early access to sales

Platinum Tier Description:
─────────────────────────────────────────────────────
"Welcome to Platinum - our most exclusive tier! Double 
your points on every purchase, 15% discount, free 
shipping, priority support, early sale access, and 
exclusive VIP events and gifts!"

Benefits:
• Double points (2.0x)
• 15% automatic discount
• Free shipping
• 24/7 priority support
• Early access to everything
• Exclusive VIP events
• Special birthday gifts
```

### Badge Image Examples

```
Badge Image Requirements:
─────────────────────────────────────────────────────

Format: PNG with transparency
Size: 200x200 pixels
Style: Metallic badge with tier name

Bronze Badge:
├── Copper/brown metallic badge
├── "BRONZE" text in white
├── Star or shield shape
└── File: bronze_badge.png

Silver Badge:
├── Silver metallic badge
├── "SILVER" text in dark gray
├── Shield or diamond shape
└── File: silver_badge.png

Gold Badge:
├── Gold metallic badge
├── "GOLD" text in black
├── Crown or star shape
└── File: gold_badge.png

Platinum Badge:
├── Platinum/white metallic badge
├── "PLATINUM" text in black
├── Diamond or crown shape
└── File: platinum_badge.png
```

### Icon/Emoji Usage

```
Tier Icons:
─────────────────────────────────────────────────────

Bronze:   🥉 (bronze medal emoji)
Silver:   🥈 (silver medal emoji)
Gold:     🥇 (gold medal emoji)
Platinum: 💎 (diamond emoji)

Alternative Icons:
Bronze:   ⭐ (star)
Silver:   ⭐⭐ (two stars)
Gold:     ⭐⭐⭐ (three stars)
Platinum: 👑 (crown)
```

### Display Integration Example

```html
Tier Card Display:
─────────────────────────────────────────────────────

<div class="tier-card" style="border-color: {{ tier.color }}">
    <div class="tier-badge">
        {% if tier.badge_image %}
            <img src="{{ tier.badge_image.url }}" alt="{{ tier.name }}">
        {% endif %}
    </div>
    
    <div class="tier-header" style="background: {{ tier.color }}">
        <h2>{{ tier.icon }} {{ tier.name }}</h2>
    </div>
    
    <div class="tier-description">
        <p>{{ tier.description }}</p>
    </div>
    
    <div class="tier-benefits">
        <ul>
            <li>{{ tier.points_multiplier }}x Points</li>
            <li>{{ tier.discount_percentage }}% Discount</li>
            {% if tier.free_shipping %}
            <li>✓ Free Shipping</li>
            {% endif %}
            {% if tier.priority_support %}
            <li>✓ Priority Support</li>
            {% endif %}
        </ul>
    </div>
</div>
```

### Expected Outcome
- Tier descriptions for customer clarity
- Badge images for visual appeal
- Brand colors for consistency
- Complete tier presentation

### Verification Checklist
- [ ] description TextField added
- [ ] badge_image ImageField added
- [ ] color CharField added (hex format)
- [ ] icon CharField added (optional)
- [ ] Upload path configured for badges
- [ ] Default color set
- [ ] Help text added
- [ ] Fields support visual branding

---

## Task 55: Run Tier Migrations

### Overview
Generate and apply Django migrations for the LoyaltyTier model. This task creates the database table with all tier fields including thresholds, benefits, and display attributes.

### Dependencies
- Task 54: Add Tier Display Fields

### Instructions

1. **Verify model completeness**
   - Open `loyalty_tier.py`
   - Ensure all fields from Tasks 51-54 present
   - Check all field configurations

2. **Register model in models init**
   - Open `apps/credit/models/__init__.py`
   - Import LoyaltyTier
   - Add to __all__ list

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations credit`

4. **Review generated migration**
   - Navigate to `apps/credit/migrations/`
   - Open newest migration file (e.g., 0007_loyaltytier.py)
   - Verify all fields present
   - Check field types and constraints

5. **Apply migration to database**
   - Run: `python manage.py migrate credit`
   - Confirm successful table creation
   - No errors in output

6. **Verify database table**
   - Check table exists: credit_loyalty_tier
   - Verify columns match model
   - Check unique constraints

7. **Create initial tier data**
   - Create data migration or fixtures
   - Define Bronze, Silver, Gold, Platinum
   - Set thresholds and benefits

8. **Test model in Django shell**
   - Create/retrieve tier instances
   - Test ordering
   - Verify all fields accessible

### Migration Review Checklist

```
Expected Migration Operations:
─────────────────────────────────────────────────────
✓ CreateModel: LoyaltyTier
  ├── Field: id (UUIDField primary key)
  ├── Field: created (DateTimeField)
  ├── Field: modified (DateTimeField)
  ├── Field: name (CharField unique)
  ├── Field: order (PositiveIntegerField unique)
  ├── Field: min_points_required (PositiveIntegerField)
  ├── Field: min_spend_required (DecimalField)
  ├── Field: points_multiplier (DecimalField)
  ├── Field: discount_percentage (DecimalField)
  ├── Field: free_shipping (BooleanField)
  ├── Field: priority_support (BooleanField)
  ├── Field: early_access (BooleanField)
  ├── Field: description (TextField)
  ├── Field: badge_image (ImageField)
  ├── Field: color (CharField)
  └── Field: icon (CharField)

✓ Constraints:
  ├── UNIQUE (name)
  └── UNIQUE (order)

✓ Indexes:
  └── order (for sorting)
```

### Initial Tier Data Creation

```python
Data Migration Script:
─────────────────────────────────────────────────────

from decimal import Decimal

def create_default_tiers(apps, schema_editor):
    """Create default loyalty tiers."""
    LoyaltyTier = apps.get_model('credit', 'LoyaltyTier')
    
    # Bronze Tier
    LoyaltyTier.objects.create(
        name='Bronze',
        order=1,
        min_points_required=0,
        min_spend_required=Decimal('0.00'),
        points_multiplier=Decimal('1.00'),
        discount_percentage=Decimal('0.00'),
        free_shipping=False,
        priority_support=False,
        early_access=False,
        description='Entry level tier for new members',
        color='#CD7F32',
        icon='🥉'
    )
    
    # Silver Tier
    LoyaltyTier.objects.create(
        name='Silver',
        order=2,
        min_points_required=1000,
        min_spend_required=Decimal('25000.00'),
        points_multiplier=Decimal('1.25'),
        discount_percentage=Decimal('5.00'),
        free_shipping=False,
        priority_support=False,
        early_access=False,
        description='Mid-tier with 25% bonus points and 5% discount',
        color='#C0C0C0',
        icon='🥈'
    )
    
    # Gold Tier
    LoyaltyTier.objects.create(
        name='Gold',
        order=3,
        min_points_required=5000,
        min_spend_required=Decimal('100000.00'),
        points_multiplier=Decimal('1.50'),
        discount_percentage=Decimal('10.00'),
        free_shipping=True,
        priority_support=True,
        early_access=True,
        description='Premium tier with 50% bonus points, 10% discount, and free shipping',
        color='#FFD700',
        icon='🥇'
    )
    
    # Platinum Tier
    LoyaltyTier.objects.create(
        name='Platinum',
        order=4,
        min_points_required=10000,
        min_spend_required=Decimal('250000.00'),
        points_multiplier=Decimal('2.00'),
        discount_percentage=Decimal('15.00'),
        free_shipping=True,
        priority_support=True,
        early_access=True,
        description='VIP tier with double points, 15% discount, and exclusive benefits',
        color='#E5E4E2',
        icon='💎'
    )
```

### Shell Test Example

```python
Shell Commands:
─────────────────────────────────────────────────────

# Import model
from apps.credit.models import LoyaltyTier

# Query all tiers
tiers = LoyaltyTier.objects.all()
for tier in tiers:
    print(f"{tier.order}. {tier.name}")
    print(f"   Points: {tier.min_points_required:,}")
    print(f"   Spend: Rs. {tier.min_spend_required:,.2f}")
    print(f"   Multiplier: {tier.points_multiplier}x")
    print(f"   Discount: {tier.discount_percentage}%")
    print()

# Get specific tier
gold = LoyaltyTier.objects.get(name='Gold')
print(f"Gold Tier: {gold}")
print(f"Color: {gold.color}")
print(f"Free Shipping: {gold.free_shipping}")

# Query by order
top_tier = LoyaltyTier.objects.order_by('-order').first()
print(f"Highest tier: {top_tier.name}")
```

### Expected Outcome
- Migration file generated successfully
- Database table created
- Default tier data loaded
- Model functional and queryable

### Verification Checklist
- [ ] Migration file generated
- [ ] All fields present in migration
- [ ] Unique constraints added
- [ ] Migration applied successfully
- [ ] Table exists in database
- [ ] Model imported in __init__.py
- [ ] Initial tier data created
- [ ] Shell test successful
- [ ] Tiers ordered correctly
- [ ] No migration warnings or errors

---

## Task 56: Implement Tier Evaluation

### Overview
Implement the tier evaluation logic in TierService to determine a customer's appropriate tier based on their lifetime points and spending. This method checks qualification criteria and identifies upgrade or downgrade opportunities.

### Dependencies
- Task 55: Run Tier Migrations
- CustomerLoyalty model complete

### Instructions

1. **Create tier service module**
   - Navigate to `apps/credit/services/` directory
   - Create file `tier_service.py`
   - This contains tier evaluation logic

2. **Import required dependencies**
   - Import CustomerLoyalty, LoyaltyTier models
   - Import datetime, timedelta
   - Import database transaction

3. **Create TierService class**
   - Class-based service
   - Static methods or class methods
   - Comprehensive docstring

4. **Create evaluate_tier method**
   - Static method or class method
   - Parameter: loyalty_account
   - Returns appropriate LoyaltyTier or None
   - Uses points OR spend logic

5. **Implement evaluation logic**
   - Get all tiers ordered by level
   - Loop through tiers (highest first)
   - Check if customer qualifies
   - Return highest qualifying tier

6. **Add qualification check**
   - Check lifetime_points_earned >= min_points_required
   - OR check lifetime_spend >= min_spend_required
   - Return True if either condition met

7. **Create get_next_tier method**
   - Parameters: current_tier
   - Returns next higher tier
   - Returns None if already at top

8. **Create get_tier_progress method**
   - Parameters: loyalty_account
   - Returns progress toward next tier
   - Shows points/spend needed

### evaluate_tier Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

class TierService:
    """Service for loyalty tier management."""
    
    @staticmethod
    def evaluate_tier(loyalty_account):
        """
        Evaluate and return appropriate tier for customer.
        
        Args:
            loyalty_account: CustomerLoyalty instance
        
        Returns:
            LoyaltyTier: Highest tier customer qualifies for
        """
        # Get customer stats
        lifetime_points = loyalty_account.lifetime_points_earned
        lifetime_spend = loyalty_account.customer.lifetime_spend
        
        # Get all tiers ordered by level (highest first)
        tiers = LoyaltyTier.objects.all().order_by('-order')
        
        # Find highest qualifying tier
        for tier in tiers:
            if TierService.qualifies_for_tier(
                lifetime_points,
                lifetime_spend,
                tier
            ):
                return tier
        
        # Should never reach here (Bronze has 0 requirements)
        return tiers.last()  # Return lowest tier
    
    @staticmethod
    def qualifies_for_tier(lifetime_points, lifetime_spend, tier):
        """
        Check if customer qualifies for tier.
        
        Args:
            lifetime_points: Integer points earned
            lifetime_spend: Decimal total spend
            tier: LoyaltyTier instance
        
        Returns:
            bool: True if qualified
        """
        # OR logic: either points OR spend qualifies
        points_qualified = lifetime_points >= tier.min_points_required
        spend_qualified = lifetime_spend >= tier.min_spend_required
        
        return points_qualified or spend_qualified
```

### Tier Evaluation Flow

```
Evaluation Process:
─────────────────────────────────────────────────────

┌─────────────┐
│  Get        │
│  Customer   │
│  Stats      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Query All  │────── Order by level (high to low)
│  Tiers      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  For Each   │
│  Tier       │
│ (High→Low)  │
└──────┬──────┘
       │
       ├───────────────────┐
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Check     │ OR  │   Check     │
│   Points    │     │   Spend     │
│ Requirement │     │ Requirement │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
          ┌──────────────┐
          │  Qualified?  │
          └──────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
       Yes               No
        │                 │
        ▼                 ▼
┌──────────────┐   ┌──────────────┐
│  Return      │   │  Continue    │
│  This Tier   │   │  To Next     │
└──────────────┘   └──────────────┘
```

### Evaluation Scenarios

#### Scenario 1: Qualified for Gold
```
Customer Stats:
├── Lifetime Points: 6,500
├── Lifetime Spend: Rs. 95,000
└── Current Tier: Silver

Evaluation Process:
1. Check Platinum:
   ├── Min Points: 10,000 (6,500 < 10,000) ✗
   ├── Min Spend: Rs. 250,000 (95,000 < 250,000) ✗
   └── Result: NOT QUALIFIED

2. Check Gold:
   ├── Min Points: 5,000 (6,500 >= 5,000) ✓
   ├── Min Spend: Rs. 100,000 (95,000 < 100,000) ✗
   └── Result: QUALIFIED (points sufficient)

Evaluation Result: Gold Tier
Action: Upgrade from Silver to Gold
```

#### Scenario 2: High Spender, Low Points
```
Customer Stats:
├── Lifetime Points: 2,800
├── Lifetime Spend: Rs. 280,000
└── Current Tier: Silver

Evaluation Process:
1. Check Platinum:
   ├── Min Points: 10,000 (2,800 < 10,000) ✗
   ├── Min Spend: Rs. 250,000 (280,000 >= 250,000) ✓
   └── Result: QUALIFIED (spend sufficient)

Evaluation Result: Platinum Tier
Action: Upgrade from Silver directly to Platinum
```

#### Scenario 3: Remains at Current Tier
```
Customer Stats:
├── Lifetime Points: 1,200
├── Lifetime Spend: Rs. 28,000
└── Current Tier: Silver

Evaluation Process:
1. Check Platinum: NOT QUALIFIED
2. Check Gold: NOT QUALIFIED
3. Check Silver:
   ├── Min Points: 1,000 (1,200 >= 1,000) ✓
   └── Result: QUALIFIED

Evaluation Result: Silver Tier
Action: No change (maintain current tier)
```

### get_next_tier Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def get_next_tier(current_tier):
    """
    Get the next higher tier.
    
    Args:
        current_tier: LoyaltyTier instance or None
    
    Returns:
        LoyaltyTier or None
    """
    if not current_tier:
        # No tier, get lowest
        return LoyaltyTier.objects.order_by('order').first()
    
    # Get next higher tier
    next_tier = LoyaltyTier.objects.filter(
        order__gt=current_tier.order
    ).order_by('order').first()
    
    return next_tier
```

### get_tier_progress Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def get_tier_progress(loyalty_account):
    """
    Calculate progress toward next tier.
    
    Args:
        loyalty_account: CustomerLoyalty instance
    
    Returns:
        dict: Progress information
    """
    current_tier = loyalty_account.current_tier
    next_tier = TierService.get_next_tier(current_tier)
    
    if not next_tier:
        # Already at top tier
        return {
            'at_top_tier': True,
            'current_tier': current_tier.name,
        }
    
    # Calculate requirements
    lifetime_points = loyalty_account.lifetime_points_earned
    lifetime_spend = loyalty_account.customer.lifetime_spend
    
    points_needed = max(0, next_tier.min_points_required - lifetime_points)
    spend_needed = max(Decimal('0'), next_tier.min_spend_required - lifetime_spend)
    
    # Calculate progress percentages
    points_progress = 0
    if next_tier.min_points_required > 0:
        points_progress = min(
            100,
            (lifetime_points / next_tier.min_points_required) * 100
        )
    
    spend_progress = 0
    if next_tier.min_spend_required > 0:
        spend_progress = min(
            100,
            (lifetime_spend / next_tier.min_spend_required) * 100
        )
    
    return {
        'at_top_tier': False,
        'current_tier': current_tier.name if current_tier else 'None',
        'next_tier': next_tier.name,
        'points_needed': points_needed,
        'spend_needed': spend_needed,
        'points_progress': round(points_progress, 1),
        'spend_progress': round(spend_progress, 1),
        'closer_via': 'points' if points_progress > spend_progress else 'spend'
    }
```

### Tier Progress Example

```json
Progress Toward Next Tier:
─────────────────────────────────────────────────────

Current: Silver → Target: Gold

{
  "at_top_tier": false,
  "current_tier": "Silver",
  "next_tier": "Gold",
  "points_needed": 3200,
  "spend_needed": "Rs. 72000.00",
  "points_progress": 36.0,
  "spend_progress": 28.0,
  "closer_via": "points",
  "message": "Earn 3,200 more points or spend Rs. 72,000 more to reach Gold!"
}
```

### Expected Outcome
- Tier evaluation logic implemented
- Qualification checking (OR logic)
- Next tier calculation
- Progress tracking

### Verification Checklist
- [ ] `tier_service.py` file created
- [ ] TierService class defined
- [ ] evaluate_tier method implemented
- [ ] qualifies_for_tier method implemented
- [ ] get_next_tier method implemented
- [ ] get_tier_progress method implemented
- [ ] OR logic (points OR spend)
- [ ] Handles edge cases (no tier, top tier)
- [ ] Service imported in __init__.py
- [ ] Comprehensive docstrings added

---

## Task 57: Implement Tier Upgrade

### Overview
Implement the upgrade_tier method in TierService to promote customers to higher tiers. This method validates eligibility, updates the tier assignment, sets expiry dates, and records the upgrade event.

### Dependencies
- Task 56: Implement Tier Evaluation

### Instructions

1. **Open tier service file**
   - Navigate to `apps/credit/services/tier_service.py`
   - Locate TierService class

2. **Create upgrade_tier method**
   - Static method or class method
   - Parameters: loyalty_account, new_tier, set_expiry
   - Validates upgrade eligibility
   - Updates tier assignment
   - Returns boolean success

3. **Add validation checks**
   - Verify customer qualifies for new tier
   - Check new tier is higher than current
   - Validate tier exists and is active

4. **Update CustomerLoyalty record**
   - Set current_tier = new_tier
   - Set tier_upgraded_at = now
   - Set tier_evaluated_at = now
   - Calculate and set tier_expiry_date

5. **Calculate tier expiry date**
   - Add 12 months from upgrade date
   - Or use program-specific duration
   - Set tier_expiry_date field

6. **Create tier upgrade notification**
   - Log upgrade event
   - Send customer notification
   - Include new benefits information

7. **Use database transaction**
   - Wrap updates in atomic transaction
   - Ensure data consistency
   - Rollback on error

### upgrade_tier Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def upgrade_tier(loyalty_account, new_tier, set_expiry=True):
    """
    Upgrade customer to higher tier.
    
    Args:
        loyalty_account: CustomerLoyalty instance
        new_tier: LoyaltyTier instance
        set_expiry: Boolean, set tier expiry date
    
    Returns:
        bool: True if upgraded
    
    Raises:
        ValueError: If upgrade not valid
    """
    # Validation
    if not TierService.qualifies_for_tier(
        loyalty_account.lifetime_points_earned,
        loyalty_account.customer.lifetime_spend,
        new_tier
    ):
        raise ValueError(
            f"Customer does not qualify for {new_tier.name} tier"
        )
    
    current_tier = loyalty_account.current_tier
    
    # Check if actually an upgrade
    if current_tier and new_tier.order <= current_tier.order:
        raise ValueError(
            f"{new_tier.name} is not higher than current tier "
            f"{current_tier.name}"
        )
    
    # Calculate expiry date
    tier_expiry = None
    if set_expiry:
        tier_expiry = date.today() + timedelta(days=365)  # 12 months
    
    # Update tier
    with transaction.atomic():
        loyalty_account.current_tier = new_tier
        loyalty_account.tier_upgraded_at = timezone.now()
        loyalty_account.tier_evaluated_at = timezone.now()
        loyalty_account.tier_expiry_date = tier_expiry
        loyalty_account.save()
    
    # Log upgrade
    logger.info(
        f"Customer {loyalty_account.customer.name} upgraded to "
        f"{new_tier.name} tier"
    )
    
    # Send notification
    notify_tier_upgrade(loyalty_account, new_tier)
    
    return True
```

### Tier Upgrade Flow

```
Upgrade Process:
─────────────────────────────────────────────────────

┌─────────────┐
│  Evaluate   │────── Call TierService.evaluate_tier()
│  Customer   │────── Determine qualified tier
│  Tier       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Compare    │────── Is new tier higher?
│  With       │────── Check tier.order
│  Current    │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
      Yes           No
       │             │
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│  Upgrade    │  │  No Action  │
│  Eligible   │  │  Required   │
└──────┬──────┘  └─────────────┘
       │
       ▼
┌─────────────┐
│  Calculate  │────── + 12 months from today
│  Expiry     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Update    │────── current_tier = new_tier
│   Loyalty   │────── tier_upgraded_at = now
│   Record    │────── tier_expiry_date = calculated
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Send      │────── Email notification
│ Notification│────── SMS alert
└──────┬──────┘────── In-app message
       │
       ▼
┌─────────────┐
│   Return    │
│   Success   │
└─────────────┘
```

### Upgrade Scenarios

#### Scenario 1: Silver to Gold Upgrade
```
Customer Profile:
├── Current Tier: Silver
├── Lifetime Points: 5,500
├── Lifetime Spend: Rs. 88,000
└── Silver Since: 2025-06-15

Evaluation:
├── Qualifies for Gold: 5,500 >= 5,000 ✓
├── Gold is higher: order 3 > order 2 ✓
└── Upgrade Valid: Yes

Upgrade Process:
1. Set current_tier: Gold
2. Set tier_upgraded_at: 2026-01-24 15:30:00
3. Set tier_expiry_date: 2027-01-24
4. Save loyalty account

Notification Sent:
├── Subject: "Congratulations! You've reached Gold Tier!"
├── Benefits: 1.5x points, 10% discount, free shipping
└── Expiry: Valid until Jan 24, 2027

Result: Successfully upgraded to Gold
```

#### Scenario 2: Bronze to Platinum (Skip Tiers)
```
Customer Profile:
├── Current Tier: Bronze
├── Lifetime Points: 12,000
├── Lifetime Spend: Rs. 280,000
└── Member Since: 2024-01-15

Evaluation:
├── Qualifies for Platinum: 280,000 >= 250,000 ✓
├── Platinum is higher: order 4 > order 1 ✓
└── Upgrade Valid: Yes

Upgrade Process:
1. Skip Silver and Gold tiers
2. Upgrade directly to Platinum
3. Set expiry: Jan 24, 2027

Result: Multi-tier jump to Platinum
Note: Valid to skip tiers if qualified
```

#### Scenario 3: Failed Upgrade (Not Qualified)
```
Customer Profile:
├── Current Tier: Silver
├── Lifetime Points: 3,200
├── Lifetime Spend: Rs. 65,000
└── Attempting: Gold upgrade

Evaluation:
├── Gold Requirements:
│   ├── Points: 5,000 (need 1,800 more) ✗
│   └── Spend: Rs. 100,000 (need Rs. 35,000 more) ✗
└── Upgrade Valid: No

Error:
└── "Customer does not qualify for Gold tier"

Result: Upgrade blocked, remains Silver
```

### Tier Expiry Date Calculation

```
Expiry Date Examples:
─────────────────────────────────────────────────────

Upgrade Date: January 24, 2026

Standard (12 months):
├── Expiry: January 24, 2027
└── Valid for: 365 days

Extended (18 months):
├── Expiry: July 24, 2027
└── Valid for: 547 days

Platinum Lifetime:
├── Expiry: null (no expiry)
└── Valid for: Permanent

Note: Expiry resets on each upgrade
```

### Upgrade Notification Template

```html
Email Template:
─────────────────────────────────────────────────────

Subject: 🎉 Congratulations! You've Reached {{ tier.name }} Tier!

Dear {{ customer.name }},

We're thrilled to inform you that you've been upgraded to our 
{{ tier.name }} tier!

Your New Benefits:
✓ {{ tier.points_multiplier }}x Points on Every Purchase
✓ {{ tier.discount_percentage }}% Automatic Discount
{% if tier.free_shipping %}
✓ FREE Shipping on All Orders
{% endif %}
{% if tier.priority_support %}
✓ Priority Customer Support
{% endif %}
{% if tier.early_access %}
✓ Early Access to Sales & New Products
{% endif %}

Tier Valid Until: {{ loyalty.tier_expiry_date|date:"F j, Y" }}

Current Balance: {{ loyalty.points_balance }} points

Thank you for being a valued customer!

[Shop Now Button]

Best regards,
Your Loyalty Team
```

### Expected Outcome
- Tier upgrade implementation
- Validation and eligibility checks
- Expiry date calculation
- Customer notifications

### Verification Checklist
- [ ] upgrade_tier method implemented
- [ ] Validation checks included
- [ ] Qualification verified
- [ ] Tier order comparison
- [ ] CustomerLoyalty fields updated
- [ ] Tier expiry date calculated
- [ ] Database transaction atomic
- [ ] Notification sent
- [ ] Error handling comprehensive
- [ ] Returns success boolean

---

## Task 58: Implement Tier Downgrade

### Overview
Implement the downgrade_tier method in TierService to handle tier downgrades due to expiry or inactivity. This method finds the appropriate lower tier, updates the assignment, and notifies customers with grace periods where applicable.

### Dependencies
- Task 57: Implement Tier Upgrade

### Instructions

1. **Open tier service file**
   - Navigate to `apps/credit/services/tier_service.py`
   - Locate TierService class

2. **Create downgrade_tier method**
   - Static method or class method
   - Parameters: loyalty_account, reason
   - Evaluates appropriate lower tier
   - Updates tier assignment
   - Returns new tier

3. **Implement downgrade logic**
   - Re-evaluate tier based on current stats
   - Find highest qualifying tier
   - If same as current, no downgrade needed
   - If lower, proceed with downgrade

4. **Add grace period check**
   - Check if within grace period
   - Grace period: 30 days before expiry
   - Send warning notifications
   - Delay actual downgrade if in grace

5. **Update CustomerLoyalty record**
   - Set current_tier to lower tier
   - Set tier_evaluated_at = now
   - Clear or update tier_expiry_date
   - Record downgrade event

6. **Create downgrade notification**
   - Send email notification
   - Explain downgrade reason
   - Show how to regain tier
   - Include current benefits

7. **Handle edge cases**
   - Already at lowest tier
   - No tier assigned
   - Multiple downgrades
   - Tier expiry during grace period

### downgrade_tier Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

@staticmethod
def downgrade_tier(loyalty_account, reason='evaluation'):
    """
    Downgrade customer tier if no longer qualified.
    
    Args:
        loyalty_account: CustomerLoyalty instance
        reason: String reason for downgrade
    
    Returns:
        LoyaltyTier: New tier after downgrade
    """
    current_tier = loyalty_account.current_tier
    
    if not current_tier:
        # No tier to downgrade from
        return None
    
    # Re-evaluate tier eligibility
    qualified_tier = TierService.evaluate_tier(loyalty_account)
    
    # Check if downgrade needed
    if qualified_tier.order >= current_tier.order:
        # Still qualified for current or higher
        return current_tier
    
    # Downgrade needed
    logger.warning(
        f"Downgrading customer {loyalty_account.customer.name} "
        f"from {current_tier.name} to {qualified_tier.name}. "
        f"Reason: {reason}"
    )
    
    # Calculate new expiry
    new_expiry = None
    if qualified_tier.order > 1:  # Not bronze
        new_expiry = date.today() + timedelta(days=365)
    
    # Update tier
    with transaction.atomic():
        loyalty_account.current_tier = qualified_tier
        loyalty_account.tier_evaluated_at = timezone.now()
        loyalty_account.tier_expiry_date = new_expiry
        loyalty_account.save()
    
    # Send notification
    notify_tier_downgrade(
        loyalty_account,
        current_tier,
        qualified_tier,
        reason
    )
    
    return qualified_tier
```

### Tier Downgrade Flow

```
Downgrade Process:
─────────────────────────────────────────────────────

┌─────────────┐
│  Trigger    │────── Expiry check
│  Event      │────── Manual review
│             │────── Periodic evaluation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Re-evaluate│────── Check current points/spend
│  Tier       │────── Find qualified tier
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Compare    │────── Is qualified < current?
│  Tiers      │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
  Downgrade      No Change
    Needed        Needed
       │             │
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│  Check      │  │  Maintain   │
│  Grace      │  │  Current    │
│  Period     │  │  Tier       │
└──────┬──────┘  └─────────────┘
       │
       ├─────────────┐
       │             │
   In Grace      Past Grace
       │             │
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│  Send       │  │  Execute    │
│  Warning    │  │  Downgrade  │
│  Delay      │  │  Update     │
└─────────────┘  └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  Notify     │
                 │  Customer   │
                 └─────────────┘
```

### Downgrade Scenarios

#### Scenario 1: Gold to Silver (Expiry)
```
Customer Profile:
├── Current Tier: Gold
├── Tier Expiry: 2026-01-20 (expired)
├── Lifetime Points: 4,200
├── Lifetime Spend: Rs. 85,000
└── Last Purchase: 2025-12-10

Re-evaluation:
├── Gold Requirements:
│   ├── Points: 5,000 (4,200 < 5,000) ✗
│   └── Spend: Rs. 100,000 (85,000 < 100,000) ✗
├── Silver Requirements:
│   ├── Points: 1,000 (4,200 >= 1,000) ✓
│   └── Qualified: Yes
└── New Tier: Silver

Downgrade Process:
1. Reason: "Tier expired and no longer qualified"
2. Update: Gold → Silver
3. New Expiry: 2027-01-24
4. Notify customer

Benefits Changed:
├── Points: 1.5x → 1.25x
├── Discount: 10% → 5%
└── Free Shipping: Yes → No
```

#### Scenario 2: Silver to Bronze (Inactivity)
```
Customer Profile:
├── Current Tier: Silver
├── Lifetime Points: 900
├── Lifetime Spend: Rs. 20,000
├── Last Purchase: 2024-06-15 (7 months ago)
└── Points Expired: 500 points (dropped below threshold)

Re-evaluation:
├── Silver Requirements:
│   ├── Points: 1,000 (900 < 1,000) ✗
│   └── Spend: Rs. 25,000 (20,000 < 25,000) ✗
├── Bronze Requirements:
│   ├── Points: 0 (always qualified) ✓
│   └── Qualified: Yes
└── New Tier: Bronze

Downgrade Process:
1. Reason: "Inactivity and points expiry"
2. Update: Silver → Bronze
3. No expiry (Bronze is permanent)
4. Notify customer with re-activation tips
```

#### Scenario 3: Grace Period Warning
```
Customer Profile:
├── Current Tier: Platinum
├── Tier Expiry: 2026-02-15 (22 days away)
├── Lifetime Points: 8,500 (below 10,000)
├── Lifetime Spend: Rs. 220,000 (below Rs. 250,000)
└── At Risk of: Downgrade to Gold

Grace Period Check:
├── Days to Expiry: 22 days
├── Grace Period: 30 days
├── Status: IN GRACE PERIOD
└── Action: Send warning, delay downgrade

Warning Notification:
├── Subject: "Your Platinum Tier Expires Soon!"
├── Content: "Maintain Platinum with 1,500 more points or Rs. 30,000 spend"
├── Deadline: February 15, 2026
└── Action: Shop now to maintain tier

Result: No immediate downgrade, customer alerted
```

### Downgrade Reasons

```
Downgrade Triggers:
─────────────────────────────────────────────────────

1. TIER_EXPIRED:
   - Tier expiry date passed
   - No longer meets requirements
   - Automatic evaluation

2. POINTS_EXPIRED:
   - Significant points expired
   - Dropped below threshold
   - Triggered by expiry task

3. INACTIVITY:
   - No purchases in 6+ months
   - Below qualification criteria
   - Manual or scheduled review

4. POLICY_VIOLATION:
   - Terms of service violation
   - Fraud detected
   - Manual admin action

5. PROGRAM_CHANGE:
   - Tier requirements updated
   - Grandfathering expired
   - Policy adjustment
```

### Downgrade Notification Template

```html
Email Template:
─────────────────────────────────────────────────────

Subject: Important Update About Your {{ old_tier.name }} Tier

Dear {{ customer.name }},

We're writing to inform you about a change to your loyalty 
tier status.

Tier Change:
{{ old_tier.name }} → {{ new_tier.name }}

Reason: {{ reason }}

Your New Benefits:
✓ {{ new_tier.points_multiplier }}x Points on Purchases
✓ {{ new_tier.discount_percentage }}% Automatic Discount
{% if new_tier.free_shipping %}
✓ FREE Shipping on All Orders
{% endif %}

How to Regain {{ old_tier.name }} Tier:
{% if points_needed > 0 %}
- Earn {{ points_needed }} more points, OR
{% endif %}
{% if spend_needed > 0 %}
- Spend Rs. {{ spend_needed }} more
{% endif %}

Current Balance: {{ loyalty.points_balance }} points

We value your continued loyalty!

[Shop Now to Earn Points]

Best regards,
Your Loyalty Team
```

### Expected Outcome
- Tier downgrade implementation
- Re-evaluation logic
- Grace period handling
- Customer notifications

### Verification Checklist
- [ ] downgrade_tier method implemented
- [ ] Re-evaluation logic included
- [ ] Grace period check added
- [ ] CustomerLoyalty updated correctly
- [ ] Handles multiple tier drops
- [ ] Edge cases handled (no tier, Bronze)
- [ ] Database transaction atomic
- [ ] Notification sent
- [ ] Reason parameter captured
- [ ] Returns new tier

---

## Task 59: Create Tier Evaluation Task

### Overview
Create a Celery periodic task to automatically evaluate and update customer tiers daily. This task processes all active loyalty accounts, checks for upgrades and downgrades, and ensures tier assignments remain accurate.

### Dependencies
- Task 58: Implement Tier Downgrade
- Celery configured

### Instructions

1. **Create tier tasks module**
   - Navigate to `apps/credit/tasks/` directory
   - Create file `tier_tasks.py` if not exists
   - This contains tier evaluation tasks

2. **Import required dependencies**
   - Import Celery shared_task
   - Import CustomerLoyalty, LoyaltyTier models
   - Import TierService
   - Import logging, timezone

3. **Create evaluate_customer_tiers task**
   - Use @shared_task decorator
   - name='credit.evaluate_customer_tiers'
   - No parameters (processes all accounts)
   - Returns evaluation summary

4. **Query active loyalty accounts**
   - Filter CustomerLoyalty by status='active'
   - Select related customer, tier, program
   - Optimize query for bulk processing

5. **Evaluate each account**
   - Call TierService.evaluate_tier
   - Compare with current tier
   - Upgrade if higher qualified
   - Check for downgrade if expired

6. **Track evaluation statistics**
   - Count accounts processed
   - Count upgrades performed
   - Count downgrades performed
   - Count unchanged

7. **Handle expiry checks**
   - Check tier_expiry_date
   - Send warnings 30/7/1 days before
   - Execute downgrades if past expiry

8. **Configure periodic schedule**
   - Add to Celery beat schedule
   - Run daily at 3:00 AM
   - Use crontab schedule

9. **Add comprehensive logging**
   - Log task start and completion
   - Log each tier change
   - Log errors per account
   - Return detailed summary

### Celery Task Implementation

```python
Pseudo-code:
─────────────────────────────────────────────────────

# apps/credit/tasks/tier_tasks.py

from celery import shared_task
from django.utils import timezone
from datetime import date, timedelta
from apps.credit.models import CustomerLoyalty
from apps.credit.services import TierService
import logging

logger = logging.getLogger(__name__)

@shared_task(name='credit.evaluate_customer_tiers')
def evaluate_customer_tiers():
    """
    Celery task to evaluate customer tiers daily.
    
    Runs: Daily at 3:00 AM
    
    Returns:
        dict: Summary of tier evaluations
    """
    logger.info("Starting customer tier evaluation task")
    
    # Statistics
    stats = {
        'accounts_processed': 0,
        'upgrades': 0,
        'downgrades': 0,
        'unchanged': 0,
        'warnings_sent': 0,
        'errors': [],
        'started_at': timezone.now()
    }
    
    # Get all active loyalty accounts
    active_accounts = CustomerLoyalty.objects.filter(
        status='active'
    ).select_related('customer', 'current_tier', 'program')
    
    logger.info(f"Found {active_accounts.count()} accounts to evaluate")
    
    today = date.today()
    
    # Process each account
    for loyalty in active_accounts:
        try:
            current_tier = loyalty.current_tier
            
            # Check for expiry warnings
            if loyalty.tier_expiry_date:
                days_until_expiry = (loyalty.tier_expiry_date - today).days
                
                if days_until_expiry in [30, 7, 1]:
                    # Send warning
                    send_tier_expiry_warning(loyalty, days_until_expiry)
                    stats['warnings_sent'] += 1
                
                elif days_until_expiry < 0:
                    # Expired, check for downgrade
                    new_tier = TierService.downgrade_tier(
                        loyalty,
                        reason='tier_expired'
                    )
                    if new_tier and new_tier.order < current_tier.order:
                        stats['downgrades'] += 1
                        logger.info(
                            f"Downgraded {loyalty.customer.name}: "
                            f"{current_tier.name} → {new_tier.name}"
                        )
                    continue
            
            # Evaluate for potential upgrade
            qualified_tier = TierService.evaluate_tier(loyalty)
            
            if not current_tier:
                # No tier assigned, assign qualified tier
                TierService.upgrade_tier(loyalty, qualified_tier)
                stats['upgrades'] += 1
                logger.info(
                    f"Assigned {qualified_tier.name} to {loyalty.customer.name}"
                )
            
            elif qualified_tier.order > current_tier.order:
                # Eligible for upgrade
                TierService.upgrade_tier(loyalty, qualified_tier)
                stats['upgrades'] += 1
                logger.info(
                    f"Upgraded {loyalty.customer.name}: "
                    f"{current_tier.name} → {qualified_tier.name}"
                )
            
            elif qualified_tier.order < current_tier.order:
                # May need downgrade (if not in grace period)
                new_tier = TierService.downgrade_tier(
                    loyalty,
                    reason='no_longer_qualified'
                )
                if new_tier.order < current_tier.order:
                    stats['downgrades'] += 1
                    logger.info(
                        f"Downgraded {loyalty.customer.name}: "
                        f"{current_tier.name} → {new_tier.name}"
                    )
            
            else:
                # Tier unchanged
                stats['unchanged'] += 1
            
            stats['accounts_processed'] += 1
        
        except Exception as e:
            error_msg = f"Error evaluating {loyalty.id}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
    
    # Completion
    stats['completed_at'] = timezone.now()
    duration = (stats['completed_at'] - stats['started_at']).total_seconds()
    
    logger.info(
        f"Tier evaluation task completed. "
        f"Processed: {stats['accounts_processed']}, "
        f"Upgrades: {stats['upgrades']}, "
        f"Downgrades: {stats['downgrades']}, "
        f"Unchanged: {stats['unchanged']}, "
        f"Warnings: {stats['warnings_sent']}, "
        f"Duration: {duration}s"
    )
    
    return stats
```

### Celery Beat Schedule

```python
Celery Beat Configuration:
─────────────────────────────────────────────────────

# settings.py or celery.py

CELERY_BEAT_SCHEDULE = {
    # ... existing tasks ...
    
    'evaluate-customer-tiers-daily': {
        'task': 'credit.evaluate_customer_tiers',
        'schedule': crontab(hour=3, minute=0),  # 3:00 AM daily
        'options': {
            'expires': 3600,  # Task expires after 1 hour
        }
    },
}
```

### Task Execution Timeline

```
Daily Tier Evaluation:
─────────────────────────────────────────────────────

03:00 AM: Task triggered
    │
    ├─ Query all active loyalty accounts (2,500 accounts)
    │
    ├─ For each account:
    │   ├─ Check tier expiry warnings
    │   ├─ Evaluate qualified tier
    │   ├─ Compare with current tier
    │   ├─ Perform upgrade/downgrade if needed
    │   └─ Send notifications
    │
    ├─ Log all tier changes
    │
    └─ Task complete (typically 3-5 minutes)

Example Results:
├── 03:00:00 - Task started
├── 03:00:05 - Queried 2,500 accounts
├── 03:04:30 - Processed 2,500 accounts
│              - Upgrades: 45 customers
│              - Downgrades: 12 customers
│              - Unchanged: 2,443 customers
│              - Warnings sent: 78 notifications
└── 03:04:35 - Task completed
```

### Expected Outcome
- Automated tier evaluation daily
- Upgrades processed automatically
- Downgrades handled with grace periods
- Customers notified of changes

### Verification Checklist
- [ ] `tier_tasks.py` file created
- [ ] evaluate_customer_tiers task defined
- [ ] @shared_task decorator used
- [ ] Queries all active accounts
- [ ] Calls TierService methods
- [ ] Handles upgrades and downgrades
- [ ] Checks tier expiry
- [ ] Sends warnings before expiry
- [ ] Statistics tracked and logged
- [ ] Celery beat schedule configured
- [ ] Task runs daily at 3:00 AM

---

## Summary

This document implemented the loyalty tier system:

### Completed Models
- ✅ LoyaltyTier - Tier definitions with benefits
- ✅ Tier thresholds, benefits, display fields

### Completed Services
- ✅ TierService - Tier management logic
- ✅ Tier evaluation
- ✅ Tier upgrades
- ✅ Tier downgrades

### Completed Tasks
- ✅ Automated tier evaluation (Celery)
- ✅ Daily tier processing
- ✅ Expiry warnings
- ✅ Customer notifications

### Key Features
1. **Four-Tier System** - Bronze, Silver, Gold, Platinum
2. **Qualification Logic** - Points OR spend (flexible)
3. **Automatic Upgrades** - Daily evaluation
4. **Grace Periods** - 30-day warning before downgrade
5. **Tier Benefits** - Multipliers, discounts, perks

### Database Structure
```
Tables:
└── credit_loyalty_tier (Task 55)

Services:
└── TierService (Tasks 56-58)
    ├── evaluate_tier
    ├── upgrade_tier
    ├── downgrade_tier
    ├── get_next_tier
    └── get_tier_progress

Celery Tasks:
└── evaluate_customer_tiers (Task 59)
```

### Next Steps
Proceed to [02_Tasks-60-66_Rewards.md](02_Tasks-60-66_Rewards.md) to implement loyalty rewards (birthday, anniversary) and reminder tasks.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Total Lines:** ~1395
