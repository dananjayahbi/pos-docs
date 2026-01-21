# Group C: Loyalty Points System

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** C of F  
> **Tasks Covered:** 33-50  
> **Group Goal:** Implement loyalty program with points earning, redemption, and expiry

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Credit Transactions & Aging](../Group-B_Credit-Transactions-Aging/)
- **→ Next Group:** [Group D: Loyalty Tiers & Rewards](../Group-D_Loyalty-Tiers-Rewards/)

---

## Group Overview

### Key Outcomes

1. **LoyaltyProgram Model** - Loyalty program configuration
2. **Program Settings** - points_per_currency, min_purchase_for_points
3. **Program Active Fields** - is_active, start_date, end_date
4. **Program Migrations** - Apply migrations
5. **CustomerLoyalty Model** - Customer's loyalty account
6. **Points Balance Fields** - points_balance, lifetime_earned, redeemed
7. **Tier Fields** - current_tier FK, tier_expiry_date
8. **Loyalty Account Migrations** - Apply migrations
9. **PointsTransaction Model** - Points earning and redemption
10. **PointsTransactionType** - EARN, REDEEM, EXPIRE, BONUS, ADJUSTMENT
11. **Points Transaction Fields** - type, points, reference_id, expiry_date
12. **Points Transaction Migrations** - Apply migrations
13. **LoyaltyService Class** - Main service for loyalty operations
14. **Points Earning** - Calculate and award points on purchase
15. **Points Redemption** - Redeem points for discount
16. **Points Expiry** - Track and expire unused points
17. **Points Expiry Task** - Celery task to expire old points
18. **Points Balance Calculator** - Calculate available with expiry

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Loyalty models |
| Service Layer | Points logic |
| Celery | Expiry tasks |
| PostgreSQL | Points calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-33-40_Program-Loyalty-Account.md` | 33-40 | LoyaltyProgram, CustomerLoyalty models, settings, migrations |
| 02 | `02_Tasks-41-46_Points-Transaction-Earning.md` | 41-46 | PointsTransaction model, service, earning |
| 03 | `03_Tasks-47-50_Redemption-Expiry-Balance.md` | 47-50 | Redemption, expiry, expiry task, balance calculator |

---

## Task Summary

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
| 41 | Create PointsTransaction Model | Medium | 25 min |
| 42 | Define PointsTransactionType | Low | 15 min |
| 43 | Add Points Transaction Fields | Medium | 20 min |
| 44 | Run Points Transaction Migrations | Low | 15 min |
| 45 | Create LoyaltyService Class | High | 30 min |
| 46 | Implement Points Earning | Medium | 25 min |
| 47 | Implement Points Redemption | Medium | 25 min |
| 48 | Implement Points Expiry | Medium | 25 min |
| 49 | Create Points Expiry Task | Medium | 25 min |
| 50 | Implement Points Balance Calculator | Medium | 25 min |

---

## Execution Order

```
[Tasks 33-40: Program and loyalty account models]
         │
         ▼
[Tasks 41-46: Points transaction and earning]
         │
         ▼
[Tasks 47-50: Redemption, expiry, balance]
```

---

## Expected Deliverables

```
apps/credit/
├── models/
│   ├── __init__.py
│   ├── loyalty_program.py        # Tasks 33-35
│   ├── customer_loyalty.py       # Tasks 37-39
│   └── points_transaction.py     # Tasks 41-43
├── services/
│   ├── __init__.py
│   └── loyalty_service.py        # Tasks 45-50
├── tasks/
│   ├── __init__.py
│   └── expiry_tasks.py           # Task 49
└── migrations/
    ├── 0004_program.py           # Task 36
    ├── 0005_loyalty.py           # Task 40
    └── 0006_points.py            # Task 44
```

---

## Notes for AI Agents

### LoyaltyProgram Fields
- name: CharField (program name)
- points_per_currency: Decimal (points per Rs. 100)
- min_purchase_for_points: Decimal (minimum purchase)
- points_expiry_months: Integer (months until expiry)
- is_active: Boolean
- start_date: Date
- end_date: Date (nullable)

### Points Earning Formula
```
Base Rule: Rs. 100 spent = 1 Point

points_earned = floor(purchase_amount / 100) × points_per_currency × tier_multiplier

Example:
Purchase: Rs. 5,500
Base Points: floor(5500 / 100) = 55 points
Tier (Gold 1.5x): 55 × 1.5 = 82.5 → 82 points
```

### CustomerLoyalty Fields
- customer: OneToOne to Customer
- points_balance: Integer (current available)
- lifetime_points_earned: Integer (total ever earned)
- lifetime_points_redeemed: Integer (total ever redeemed)
- current_tier: FK to LoyaltyTier
- tier_qualified_date: Date
- tier_expiry_date: Date
- enrollment_date: Date

### PointsTransactionType Choices
- **EARN**: Points earned from purchase
- **REDEEM**: Points redeemed for discount
- **EXPIRE**: Points expired
- **BONUS**: Bonus points (promotion, birthday)
- **ADJUSTMENT**: Manual adjustment

### PointsTransaction Fields
- loyalty_account: FK to CustomerLoyalty
- transaction_type: Choice field
- points: Integer (positive for earn, negative for redeem)
- balance_after: Integer
- reference_type: Order, Promotion
- reference_id: UUID
- description: CharField
- expiry_date: Date (for earned points)
- transaction_date: DateTime

### Points Redemption Rules
```
Redemption Rate: 100 Points = Rs. 100 discount

Minimum Redemption: 100 points
Maximum Redemption: 50% of purchase value

Example:
Purchase: Rs. 2,000
Customer Points: 500
Max Redeemable: 50% of 2,000 = Rs. 1,000 = 1,000 points
Actual Redeemable: min(500, 1000) = 500 points = Rs. 500 discount
```

### Points Expiry
```
Default Expiry: 12 months from earning

Expiry Process:
1. Points expire at midnight on expiry_date
2. Celery task runs daily
3. FIFO - oldest points used first
4. Customer notified 30 days before expiry
```

### Points Balance Calculation
```json
{
  "available_points": 1500,
  "expiring_soon": {
    "next_30_days": 200,
    "next_60_days": 300
  },
  "lifetime_earned": 5000,
  "lifetime_redeemed": 3500
}
```
