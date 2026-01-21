# Group D: Loyalty Tiers & Rewards

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement loyalty tier system and special rewards

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Loyalty Points System](../Group-C_Loyalty-Points-System/)
- **→ Next Group:** [Group E: Store Credit & Promotions](../Group-E_Store-Credit-Promotions/)

---

## Group Overview

### Key Outcomes

1. **LoyaltyTier Model** - Tier levels (Bronze, Silver, Gold, Platinum)
2. **Tier Threshold Fields** - min_points_required, min_spend_required
3. **Tier Benefit Fields** - points_multiplier, discount_percentage, free_shipping
4. **Tier Display Fields** - name, description, badge_image, color
5. **Tier Migrations** - Apply migrations
6. **Tier Evaluation** - Evaluate customer tier based on activity
7. **Tier Upgrade** - Upgrade customer to higher tier
8. **Tier Downgrade** - Downgrade on expiry/inactivity
9. **Tier Evaluation Task** - Celery task for periodic evaluation
10. **LoyaltyReward Model** - Special rewards and promotions
11. **RewardType Choices** - BIRTHDAY, ANNIVERSARY, BONUS_POINTS, FREE_PRODUCT
12. **Reward Configuration** - Rules, eligibility, value
13. **Reward Migrations** - Apply migrations
14. **Birthday Reward** - Birthday bonus points/discount
15. **Anniversary Reward** - Customer anniversary bonus
16. **Birthday Reminder Task** - Celery task for birthday greetings

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Tier and reward models |
| Service Layer | Tier evaluation logic |
| Celery | Evaluation and reminder tasks |
| Image Storage | Tier badge images |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-59_Tier-Model-Evaluation.md` | 51-59 | LoyaltyTier model, fields, evaluation, upgrade/downgrade, task |
| 02 | `02_Tasks-60-66_Rewards.md` | 60-66 | LoyaltyReward model, types, birthday/anniversary, reminder task |

---

## Task Summary

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
| 60 | Create LoyaltyReward Model | Medium | 25 min |
| 61 | Define RewardType Choices | Low | 15 min |
| 62 | Add Reward Configuration | Medium | 25 min |
| 63 | Run Reward Migrations | Low | 15 min |
| 64 | Implement Birthday Reward | Medium | 25 min |
| 65 | Implement Anniversary Reward | Medium | 25 min |
| 66 | Create Birthday Reminder Task | Medium | 25 min |

---

## Execution Order

```
[Tasks 51-59: LoyaltyTier model and evaluation]
         │
         ▼
[Tasks 60-66: Rewards and birthday tasks]
```

---

## Expected Deliverables

```
apps/credit/
├── models/
│   ├── __init__.py
│   ├── loyalty_tier.py           # Tasks 51-54
│   └── loyalty_reward.py         # Tasks 60-62
├── services/
│   ├── __init__.py
│   ├── tier_service.py           # Tasks 56-58
│   └── reward_service.py         # Tasks 64-65
├── tasks/
│   ├── __init__.py
│   ├── tier_tasks.py             # Task 59
│   └── birthday_tasks.py         # Task 66
└── migrations/
    ├── 0007_tier.py              # Task 55
    └── 0008_reward.py            # Task 63
```

---

## Notes for AI Agents

### Loyalty Tier Structure
| Tier | Points Required | Spend Required | Points Multiplier | Discount |
|------|-----------------|----------------|-------------------|----------|
| **Bronze** | 0 | Rs. 0 | 1.0x | 0% |
| **Silver** | 1,000 | Rs. 25,000 | 1.25x | 5% |
| **Gold** | 5,000 | Rs. 100,000 | 1.5x | 10% |
| **Platinum** | 10,000 | Rs. 250,000 | 2.0x | 15% |

### LoyaltyTier Fields
- name: CharField (Bronze, Silver, Gold, Platinum)
- order: Integer (1, 2, 3, 4 for sorting)
- min_points_required: Integer
- min_spend_required: Decimal
- points_multiplier: Decimal (1.0, 1.25, 1.5, 2.0)
- discount_percentage: Decimal (0, 5, 10, 15)
- free_shipping: Boolean
- description: TextField
- badge_image: ImageField
- color: CharField (hex color)

### Tier Colors
```
Bronze:   #CD7F32
Silver:   #C0C0C0
Gold:     #FFD700
Platinum: #E5E4E2
```

### Tier Evaluation Logic
```
Evaluate Tier:
1. Calculate lifetime points OR lifetime spend
2. Find highest tier where customer meets requirements
3. If higher than current tier → Upgrade
4. If lower than current tier → Check expiry policy
5. Tier valid for 12 months from qualification
```

### Tier Downgrade Policy
```
Downgrade Conditions:
1. Tier expired (12 months since qualification)
2. No purchases in last 6 months
3. Manual downgrade by admin

Grace Period: 30 days before downgrade
Notification: 7 days, 3 days, 1 day before
```

### RewardType Choices
- **BIRTHDAY**: Birthday bonus
- **ANNIVERSARY**: Customer anniversary (signup date)
- **BONUS_POINTS**: Promotional bonus points
- **FREE_PRODUCT**: Free product reward

### LoyaltyReward Fields
- name: CharField
- reward_type: Choice field
- points_value: Integer (bonus points)
- discount_value: Decimal (discount amount)
- discount_percentage: Decimal (discount %)
- free_product: FK to Product (nullable)
- min_tier_required: FK to LoyaltyTier
- is_active: Boolean
- valid_from: Date
- valid_to: Date

### Birthday Reward Configuration
```json
{
  "reward_type": "BIRTHDAY",
  "tier_rewards": {
    "Bronze": {"points": 100},
    "Silver": {"points": 200, "discount": 5},
    "Gold": {"points": 500, "discount": 10},
    "Platinum": {"points": 1000, "discount": 15}
  },
  "valid_days": 30
}
```

### Birthday Reminder Task
```
Daily at 9:00 AM:
1. Find customers with birthday today
2. Award birthday points
3. Send birthday email with discount code
4. Log communication
```
