# SubPhase 09: Customer Credit & Loyalty - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 09 of 12  
> **SubPhase Goal:** Implement credit management and loyalty programs for customer retention  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08_Customer-Module](../SubPhase-08_Customer-Module/)
- **→ Next SubPhase:** [SubPhase-10_Vendor-Module](../SubPhase-10_Vendor-Module/)

---

## SubPhase Overview

This sub-phase implements comprehensive credit management and loyalty programs. Credit features allow businesses to extend credit to trusted customers with approval workflows and aging tracking. Loyalty features incentivize repeat purchases through points accumulation, tier-based rewards, and special promotions.

### Key Outcomes
- Customer credit limit configuration
- Credit approval workflow
- Outstanding balance and aging tracking
- Credit payment reminders
- Loyalty points earning rules
- Points redemption at checkout
- Loyalty tier system (Bronze, Silver, Gold, Platinum)
- Birthday and anniversary rewards
- Store credit balance management
- Credit and loyalty dashboards

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Async Tasks:** Celery for reminders, tier evaluation
- **Frontend:** Next.js 14+ with TypeScript
- **Points Format:** 1 Point = Rs. 1 (configurable)

### Dependencies
- Phase-05 SubPhase-08: Customer Module (customer records)
- Phase-05 SubPhase-07: Payment Recording (payment integration)

---

## Task Execution Order

```
TASK GROUP A: Credit Limit & Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: Credit Transactions & Aging (Tasks 17-32)
        │
        ▼
TASK GROUP C: Loyalty Points System (Tasks 33-50)
        │
        ▼
TASK GROUP D: Loyalty Tiers & Rewards (Tasks 51-66)
        │
        ▼
TASK GROUP E: Store Credit & Promotions (Tasks 67-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-90)
```

---

## Task Index

### Group A: Credit Limit & Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create credit Django App** | Create new Django app for credit & loyalty with proper structure | None | 🔴 Not Created |
| 02 | **Register credit App** | Add credit app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define CreditStatus Choices** | Create enum: ACTIVE, SUSPENDED, CLOSED, PENDING_APPROVAL | Task 01 | 🔴 Not Created |
| 04 | **Create CustomerCredit Model** | Model for customer credit account linked to customer | Task 03 | 🔴 Not Created |
| 05 | **Add Credit Limit Fields** | Add credit_limit, available_credit, outstanding_balance | Task 04 | 🔴 Not Created |
| 06 | **Add Credit Terms Fields** | Add payment_terms_days (Net 30, etc.), grace_period_days | Task 04 | 🔴 Not Created |
| 07 | **Add Credit Status Fields** | Add status, approved_by, approved_at, suspended_reason | Task 04 | 🔴 Not Created |
| 08 | **Add Credit Date Fields** | Add last_payment_date, last_purchase_date, next_payment_due | Task 04 | 🔴 Not Created |
| 09 | **Add Credit Risk Fields** | Add risk_score, late_payment_count, default_count | Task 04 | 🔴 Not Created |
| 10 | **Create Credit Model Indexes** | Add indexes for status, customer, outstanding_balance | Task 04 | 🔴 Not Created |
| 11 | **Run Initial Credit Migrations** | Generate and apply migrations for CustomerCredit | Task 10 | 🔴 Not Created |
| 12 | **Create CreditSettings Model** | Tenant settings for default limits, terms, interest | Task 11 | 🔴 Not Created |
| 13 | **Add Default Credit Settings** | Default credit limit, payment terms, approval threshold | Task 12 | 🔴 Not Created |
| 14 | **Create CreditApprovalWorkflow Model** | Model for credit approval requests | Task 11 | 🔴 Not Created |
| 15 | **Add Approval Fields** | Add requested_limit, requested_by, approved_by, decision | Task 14 | 🔴 Not Created |
| 16 | **Run Settings Migrations** | Generate migrations for CreditSettings, Workflow | Task 15 | 🔴 Not Created |

---

### Group B: Credit Transactions & Aging (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create CreditTransaction Model** | Model for credit usage and payment transactions | Task 16 | 🔴 Not Created |
| 18 | **Define TransactionType Choices** | Enum: CREDIT_PURCHASE, PAYMENT, ADJUSTMENT, INTEREST, WRITE_OFF | Task 17 | 🔴 Not Created |
| 19 | **Add Transaction Fields** | Add type, amount, balance_after, reference_id | Task 17 | 🔴 Not Created |
| 20 | **Add Transaction Date Fields** | Add transaction_date, due_date, paid_date | Task 17 | 🔴 Not Created |
| 21 | **Run Transaction Migrations** | Generate migrations for CreditTransaction | Task 20 | 🔴 Not Created |
| 22 | **Create CreditService Class** | Main service for credit operations | Task 21 | 🔴 Not Created |
| 23 | **Implement Credit Purchase** | Record credit purchase, reduce available credit | Task 22 | 🔴 Not Created |
| 24 | **Implement Credit Payment** | Record payment, increase available credit | Task 22 | 🔴 Not Created |
| 25 | **Implement Credit Limit Check** | Validate purchase against available credit | Task 22 | 🔴 Not Created |
| 26 | **Implement Credit Balance Calculator** | Calculate outstanding balance from transactions | Task 22 | 🔴 Not Created |
| 27 | **Create Aging Buckets Calculator** | Calculate aging: Current, 30, 60, 90, 90+ days | Task 22 | 🔴 Not Created |
| 28 | **Create Customer Credit Statement** | Generate statement with all transactions | Task 27 | 🔴 Not Created |
| 29 | **Implement Interest Calculation** | Calculate interest on overdue amounts | Task 22 | 🔴 Not Created |
| 30 | **Create Payment Reminder Task** | Celery task for payment due reminders | Task 22 | 🔴 Not Created |
| 31 | **Create Overdue Alert Task** | Celery task for overdue notifications | Task 30 | 🔴 Not Created |
| 32 | **Implement Credit Suspension** | Auto-suspend credit on excessive late payments | Task 31 | 🔴 Not Created |

---

### Group C: Loyalty Points System (Tasks 33-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create LoyaltyProgram Model** | Model for loyalty program configuration | Task 32 | 🔴 Not Created |
| 34 | **Add Program Settings** | Add name, points_per_currency, min_purchase_for_points | Task 33 | 🔴 Not Created |
| 35 | **Add Program Active Fields** | Add is_active, start_date, end_date | Task 33 | 🔴 Not Created |
| 36 | **Run Program Migrations** | Generate migrations for LoyaltyProgram | Task 35 | 🔴 Not Created |
| 37 | **Create CustomerLoyalty Model** | Model for customer's loyalty account | Task 36 | 🔴 Not Created |
| 38 | **Add Points Balance Fields** | Add points_balance, lifetime_points_earned, points_redeemed | Task 37 | 🔴 Not Created |
| 39 | **Add Tier Fields** | Add current_tier FK, tier_expiry_date | Task 37 | 🔴 Not Created |
| 40 | **Run Loyalty Account Migrations** | Generate migrations for CustomerLoyalty | Task 39 | 🔴 Not Created |
| 41 | **Create PointsTransaction Model** | Model for points earning and redemption | Task 40 | 🔴 Not Created |
| 42 | **Define PointsTransactionType** | Enum: EARN, REDEEM, EXPIRE, BONUS, ADJUSTMENT | Task 41 | 🔴 Not Created |
| 43 | **Add Points Transaction Fields** | Add type, points, reference_id, expiry_date | Task 41 | 🔴 Not Created |
| 44 | **Run Points Transaction Migrations** | Generate migrations for PointsTransaction | Task 43 | 🔴 Not Created |
| 45 | **Create LoyaltyService Class** | Main service for loyalty operations | Task 44 | 🔴 Not Created |
| 46 | **Implement Points Earning** | Calculate and award points on purchase | Task 45 | 🔴 Not Created |
| 47 | **Implement Points Redemption** | Redeem points for discount at checkout | Task 45 | 🔴 Not Created |
| 48 | **Implement Points Expiry** | Track and expire unused points | Task 45 | 🔴 Not Created |
| 49 | **Create Points Expiry Task** | Celery task to expire old points | Task 48 | 🔴 Not Created |
| 50 | **Implement Points Balance Calculator** | Calculate available points with expiry | Task 45 | 🔴 Not Created |

---

### Group D: Loyalty Tiers & Rewards (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create LoyaltyTier Model** | Model for tier levels (Bronze, Silver, Gold, Platinum) | Task 50 | 🔴 Not Created |
| 52 | **Add Tier Threshold Fields** | Add min_points_required, min_spend_required for tier | Task 51 | 🔴 Not Created |
| 53 | **Add Tier Benefit Fields** | Add points_multiplier, discount_percentage, free_shipping | Task 51 | 🔴 Not Created |
| 54 | **Add Tier Display Fields** | Add name, description, badge_image, color | Task 51 | 🔴 Not Created |
| 55 | **Run Tier Migrations** | Generate migrations for LoyaltyTier | Task 54 | 🔴 Not Created |
| 56 | **Implement Tier Evaluation** | Evaluate customer tier based on activity | Task 55 | 🔴 Not Created |
| 57 | **Implement Tier Upgrade** | Upgrade customer to higher tier | Task 56 | 🔴 Not Created |
| 58 | **Implement Tier Downgrade** | Downgrade customer on tier expiry/inactivity | Task 56 | 🔴 Not Created |
| 59 | **Create Tier Evaluation Task** | Celery task for periodic tier evaluation | Task 58 | 🔴 Not Created |
| 60 | **Create LoyaltyReward Model** | Model for special rewards and promotions | Task 55 | 🔴 Not Created |
| 61 | **Define RewardType Choices** | Enum: BIRTHDAY, ANNIVERSARY, BONUS_POINTS, FREE_PRODUCT | Task 60 | 🔴 Not Created |
| 62 | **Add Reward Configuration** | Add reward rules, eligibility, value | Task 60 | 🔴 Not Created |
| 63 | **Run Reward Migrations** | Generate migrations for LoyaltyReward | Task 62 | 🔴 Not Created |
| 64 | **Implement Birthday Reward** | Award birthday bonus points/discount | Task 63 | 🔴 Not Created |
| 65 | **Implement Anniversary Reward** | Award customer anniversary bonus | Task 63 | 🔴 Not Created |
| 66 | **Create Birthday Reminder Task** | Celery task to send birthday greetings/rewards | Task 65 | 🔴 Not Created |

---

### Group E: Store Credit & Promotions (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create StoreCredit Model** | Model for store credit balance (separate from loyalty) | Task 66 | 🔴 Not Created |
| 68 | **Add Store Credit Fields** | Add balance, created_from (refund, gift, adjustment) | Task 67 | 🔴 Not Created |
| 69 | **Add Store Credit Expiry** | Add expiry_date, is_expired | Task 67 | 🔴 Not Created |
| 70 | **Run Store Credit Migrations** | Generate migrations for StoreCredit | Task 69 | 🔴 Not Created |
| 71 | **Create StoreCreditTransaction Model** | Track store credit usage | Task 70 | 🔴 Not Created |
| 72 | **Implement Store Credit Issue** | Issue store credit (refund, manual) | Task 71 | 🔴 Not Created |
| 73 | **Implement Store Credit Redemption** | Use store credit at checkout | Task 71 | 🔴 Not Created |
| 74 | **Implement Store Credit Balance Check** | Validate store credit availability | Task 71 | 🔴 Not Created |
| 75 | **Create PointsPromotion Model** | Model for bonus points promotions | Task 66 | 🔴 Not Created |
| 76 | **Add Promotion Rules** | Add multiplier, categories, date range | Task 75 | 🔴 Not Created |
| 77 | **Implement Double Points Promotion** | Apply 2x points for promotions | Task 76 | 🔴 Not Created |
| 78 | **Implement Category Bonus** | Extra points for specific categories | Task 76 | 🔴 Not Created |
| 79 | **Create Credit/Loyalty Dashboard Data** | Aggregate data for admin dashboard | Task 78 | 🔴 Not Created |
| 80 | **Run Promotion Migrations** | Generate migrations for PointsPromotion | Task 79 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create CreditSerializer** | DRF serializer for CustomerCredit | Task 80 | 🔴 Not Created |
| 82 | **Create LoyaltySerializer** | DRF serializer for CustomerLoyalty, tiers | Task 80 | 🔴 Not Created |
| 83 | **Create CreditViewSet** | ViewSet for credit operations | Task 82 | 🔴 Not Created |
| 84 | **Create LoyaltyViewSet** | ViewSet for loyalty operations | Task 82 | 🔴 Not Created |
| 85 | **Implement Credit Filtering** | Filter by status, aging bucket, amount | Task 83 | 🔴 Not Created |
| 86 | **Add Credit Actions** | Actions: approve, suspend, adjust, write_off | Task 83 | 🔴 Not Created |
| 87 | **Add Loyalty Actions** | Actions: award_points, redeem, upgrade_tier | Task 84 | 🔴 Not Created |
| 88 | **Register Credit/Loyalty API URLs** | Add all endpoints to URL configuration | Task 87 | 🔴 Not Created |
| 89 | **Create Credit & Loyalty Tests** | Unit and integration tests for all modules | Task 88 | 🔴 Not Created |
| 90 | **Create Module Documentation** | API docs, credit policies, loyalty rules guide | Task 89 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/credit/
├── __init__.py
├── admin.py                    # Admin for Credit, Loyalty, Tiers
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── customer_credit.py     # CustomerCredit model
│   ├── credit_transaction.py  # CreditTransaction model
│   ├── credit_settings.py     # CreditSettings model
│   ├── credit_approval.py     # CreditApprovalWorkflow model
│   ├── loyalty_program.py     # LoyaltyProgram model
│   ├── customer_loyalty.py    # CustomerLoyalty model
│   ├── points_transaction.py  # PointsTransaction model
│   ├── loyalty_tier.py        # LoyaltyTier model
│   ├── loyalty_reward.py      # LoyaltyReward model
│   ├── store_credit.py        # StoreCredit model
│   └── points_promotion.py    # PointsPromotion model
├── services/
│   ├── __init__.py
│   ├── credit_service.py      # Credit business logic
│   ├── loyalty_service.py     # Loyalty points logic
│   ├── tier_service.py        # Tier evaluation logic
│   ├── reward_service.py      # Rewards processing
│   └── store_credit_service.py # Store credit logic
├── serializers/
│   ├── __init__.py
│   ├── credit_serializer.py
│   ├── loyalty_serializer.py
│   └── tier_serializer.py
├── views/
│   ├── __init__.py
│   ├── credit_viewset.py      # Credit CRUD ViewSet
│   ├── loyalty_viewset.py     # Loyalty ViewSet
│   └── dashboard_views.py     # Dashboard aggregations
├── tasks/
│   ├── __init__.py
│   ├── reminder_tasks.py      # Payment reminders
│   ├── tier_tasks.py          # Tier evaluation
│   ├── expiry_tasks.py        # Points/credit expiry
│   └── birthday_tasks.py      # Birthday rewards
├── filters.py                  # Filtering
├── urls.py                     # URL routing
├── signals.py                  # Signals
├── permissions.py              # Permissions
├── tests/
│   ├── __init__.py
│   ├── test_credit.py
│   ├── test_loyalty.py
│   ├── test_tiers.py
│   └── test_api.py
└── migrations/
```

---

## Loyalty Tier Structure

| Tier | Points Required | Spend Required | Points Multiplier | Discount |
|------|-----------------|----------------|-------------------|----------|
| **Bronze** | 0 | Rs. 0 | 1.0x | 0% |
| **Silver** | 1,000 | Rs. 25,000 | 1.25x | 5% |
| **Gold** | 5,000 | Rs. 100,000 | 1.5x | 10% |
| **Platinum** | 10,000 | Rs. 250,000 | 2.0x | 15% |

---

## Points Earning Rules

```
Base Rule: Rs. 100 spent = 1 Point

Tier Multipliers:
├── Bronze:   1.0x → Rs. 100 = 1 point
├── Silver:   1.25x → Rs. 100 = 1.25 points
├── Gold:     1.5x → Rs. 100 = 1.5 points
└── Platinum: 2.0x → Rs. 100 = 2 points

Promotions:
├── Double Points Days: 2x on specific dates
├── Category Bonus: Extra points on categories
└── First Purchase: Bonus welcome points
```

---

## Points Redemption

```
Redemption Rate: 100 Points = Rs. 100 discount

Minimum Redemption: 100 points
Maximum Redemption: 50% of purchase value

Example:
├── Purchase: Rs. 2,000
├── Available Points: 500
├── Max Redeemable: Rs. 1,000 (50% of purchase)
└── Points Used: 500 = Rs. 500 discount
```

---

## Credit Aging Buckets

| Bucket | Days Overdue | Action |
|--------|--------------|--------|
| Current | 0 | No action |
| 1-30 | 1-30 | Reminder email |
| 31-60 | 31-60 | Phone call, warning |
| 61-90 | 61-90 | Suspend credit |
| 90+ | >90 | Collection, write-off |

---

## Credit Approval Workflow

```
Customer Requests Credit
        │
        ▼
┌───────────────────┐
│ PENDING_APPROVAL  │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌────────┐ ┌─────────┐
│APPROVED│ │REJECTED │
└────────┘ └─────────┘
    │
    ▼
┌────────┐
│ ACTIVE │ ← Can make credit purchases
└────────┘
```

---

## Key Business Rules

1. **Credit Limit:** Cannot exceed approved limit
2. **Aging Alert:** Auto-alert on 30-day overdue
3. **Suspension:** Auto-suspend on 90+ days overdue
4. **Points Expiry:** Points expire after 12 months (configurable)
5. **Tier Review:** Evaluate tier monthly/quarterly
6. **Birthday Reward:** Send within birthday month
7. **Store Credit:** No expiry or configurable expiry
8. **Redemption Limit:** Maximum 50% of purchase from points

---

## Sri Lanka Specific Considerations

- **Currency:** All amounts in LKR
- **Payment Terms:** Net 30 common for B2B
- **Interest:** Consider legal max interest rates
- **Birthday:** Lunar New Year, Vesak bonuses popular
- **Mobile:** SMS for credit reminders popular

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (credit Django App)

---

## Notes for AI Agents

- Credit and loyalty can be in same app or separate (chosen: same)
- Use decimal for points to support fractional earning
- Implement proper locking for points balance updates
- Consider gamification elements (badges, achievements)
- Track point earning sources for analytics
- Credit approval may need multi-level approval for high limits
- Birthday reward should be one-time per year
- Store credit from refund should be automatic

---

*End of SubPhase 09 Tasks Summary*
