# Group E: Store Credit & Promotions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement store credit management and points promotions

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Loyalty Tiers & Rewards](../Group-D_Loyalty-Tiers-Rewards/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **StoreCredit Model** - Store credit balance (separate from loyalty)
2. **Store Credit Fields** - balance, created_from (refund, gift, adjustment)
3. **Store Credit Expiry** - expiry_date, is_expired
4. **Store Credit Migrations** - Apply migrations
5. **StoreCreditTransaction Model** - Track store credit usage
6. **Store Credit Issue** - Issue credit (refund, manual)
7. **Store Credit Redemption** - Use at checkout
8. **Store Credit Balance Check** - Validate availability
9. **PointsPromotion Model** - Bonus points promotions
10. **Promotion Rules** - multiplier, categories, date range
11. **Double Points Promotion** - Apply 2x points
12. **Category Bonus** - Extra points for categories
13. **Credit/Loyalty Dashboard Data** - Aggregate for admin
14. **Promotion Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Store credit and promotion models |
| Service Layer | Credit and promotion logic |
| PostgreSQL | Date range queries |
| Dashboard | Aggregate calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-74_Store-Credit.md` | 67-74 | StoreCredit model, fields, transactions, issue/redeem |
| 02 | `02_Tasks-75-80_Promotions-Dashboard.md` | 75-80 | PointsPromotion, rules, double points, category bonus, dashboard |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create StoreCredit Model | Medium | 25 min |
| 68 | Add Store Credit Fields | Medium | 20 min |
| 69 | Add Store Credit Expiry | Medium | 20 min |
| 70 | Run Store Credit Migrations | Low | 15 min |
| 71 | Create StoreCreditTransaction Model | Medium | 25 min |
| 72 | Implement Store Credit Issue | Medium | 25 min |
| 73 | Implement Store Credit Redemption | Medium | 25 min |
| 74 | Implement Store Credit Balance Check | Medium | 20 min |
| 75 | Create PointsPromotion Model | Medium | 25 min |
| 76 | Add Promotion Rules | Medium | 25 min |
| 77 | Implement Double Points Promotion | Medium | 25 min |
| 78 | Implement Category Bonus | Medium | 25 min |
| 79 | Create Credit/Loyalty Dashboard Data | High | 35 min |
| 80 | Run Promotion Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 67-74: Store credit model and services]
         │
         ▼
[Tasks 75-80: Promotions and dashboard]
```

---

## Expected Deliverables

```
apps/credit/
├── models/
│   ├── __init__.py
│   ├── store_credit.py           # Tasks 67-69
│   └── points_promotion.py       # Tasks 75-76
├── services/
│   ├── __init__.py
│   └── store_credit_service.py   # Tasks 72-74
├── views/
│   ├── __init__.py
│   └── dashboard_views.py        # Task 79
└── migrations/
    ├── 0009_store_credit.py      # Task 70
    └── 0010_promotion.py         # Task 80
```

---

## Notes for AI Agents

### Store Credit vs Loyalty Points
| Feature | Store Credit | Loyalty Points |
|---------|--------------|----------------|
| Currency | Rs. (actual money) | Points (virtual) |
| Source | Refunds, gifts | Purchases |
| Usage | Full payment value | Discount |
| Expiry | Optional | Usually yes |

### StoreCredit Fields
- customer: FK to Customer
- balance: Decimal (current balance)
- created_from: Choice (REFUND, GIFT, ADJUSTMENT, PROMOTION)
- issued_by: FK to User
- issued_at: DateTime
- expiry_date: Date (nullable)
- is_expired: Boolean
- original_amount: Decimal
- notes: TextField

### Store Credit Source Types
- **REFUND**: From order refund
- **GIFT**: Gift card purchase
- **ADJUSTMENT**: Manual adjustment
- **PROMOTION**: Promotional credit

### StoreCreditTransaction Fields
- store_credit: FK to StoreCredit
- transaction_type: ISSUE, USE, EXPIRE
- amount: Decimal
- balance_after: Decimal
- reference_type: Order, Refund
- reference_id: UUID
- transaction_date: DateTime

### PointsPromotion Fields
- name: CharField
- promotion_type: MULTIPLIER, BONUS, CATEGORY
- multiplier: Decimal (2.0 for double points)
- bonus_points: Integer (flat bonus)
- applicable_categories: M2M to Category
- applicable_products: M2M to Product
- min_purchase: Decimal
- start_date: DateTime
- end_date: DateTime
- is_active: Boolean
- tier_required: FK to LoyaltyTier (nullable)

### Promotion Types
| Type | Description | Example |
|------|-------------|---------|
| MULTIPLIER | Multiply base points | 2x, 3x points |
| BONUS | Flat bonus points | +100 points |
| CATEGORY | Extra on categories | Electronics 2x |

### Double Points Promotion
```
Promotion Period: Jan 1-7, 2026
Multiplier: 2.0

Normal: Rs. 1000 = 10 points
During Promo: Rs. 1000 = 20 points
```

### Category Bonus
```json
{
  "category": "Electronics",
  "bonus_type": "multiplier",
  "multiplier": 1.5,
  "start_date": "2026-01-15",
  "end_date": "2026-01-31"
}

Purchase Rs. 5000 Electronics:
- Base points: 50
- With 1.5x bonus: 75 points
```

### Dashboard Aggregations
```json
{
  "credit_summary": {
    "total_credit_extended": 5000000,
    "total_outstanding": 1500000,
    "overdue_amount": 300000,
    "aging_buckets": {...}
  },
  "loyalty_summary": {
    "total_members": 2500,
    "points_outstanding": 150000,
    "points_redeemed_this_month": 25000,
    "tier_distribution": {
      "Bronze": 1500,
      "Silver": 700,
      "Gold": 250,
      "Platinum": 50
    }
  },
  "store_credit_summary": {
    "total_issued": 500000,
    "total_outstanding": 150000,
    "expiring_next_30_days": 25000
  }
}
```
