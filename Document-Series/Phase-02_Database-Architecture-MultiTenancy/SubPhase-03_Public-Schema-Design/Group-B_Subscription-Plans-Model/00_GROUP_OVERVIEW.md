# Group B: Subscription Plans Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** B of G  
> **Tasks Covered:** 13-28  
> **Group Goal:** Create subscription plan models for SaaS pricing tiers

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Public-Schema-Planning/](../Group-A_Public-Schema-Planning/)
- **→ Next Group:** [../Group-C_Platform-Settings-Model/](../Group-C_Platform-Settings-Model/)

---

## Group Overview

This group creates the subscription plan models that define pricing tiers and feature limits for tenants. The models include SubscriptionPlan for plan definitions and PlanFeature for per-plan feature toggles.

### Key Outcomes
- SubscriptionPlan model created
- Plan name field (Free, Starter, Pro, Enterprise)
- Plan slug field (URL-safe identifier)
- Description field added
- Monthly price field (LKR)
- Annual price field (LKR)
- Max users limit field
- Max products limit field
- Max locations limit field
- Storage limit field (MB/GB)
- Is active field (plan availability)
- Display order field (UI ordering)
- PlanFeature model created
- Feature key/value fields
- SubscriptionPlan admin interface
- Default plans fixture (Free/Starter/Pro/Enterprise)

### Technology Context
- **Currency:** Sri Lankan Rupee (LKR)
- **Plans:** Free, Starter, Pro, Enterprise
- **Limits:** Users, products, locations, storage
- **Features:** Per-plan feature toggles

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-13-18_Plan-Model-Pricing.md | 13-18 | Create SubscriptionPlan, name, slug, description, monthly price, annual price |
| 02 | 02_Tasks-19-24_Plan-Limits-Status.md | 19-24 | Max users, products, locations, storage, is_active, display_order |
| 03 | 03_Tasks-25-28_Features-Admin-Fixture.md | 25-28 | PlanFeature model, feature key/value, admin, default plans fixture |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 13 | Create SubscriptionPlan Model | Task 07 | Medium |
| 14 | Add Plan Name Field | Task 13 | Simple |
| 15 | Add Plan Slug Field | Task 13 | Simple |
| 16 | Add Description Field | Task 13 | Simple |
| 17 | Add Monthly Price Field | Task 13 | Simple |
| 18 | Add Annual Price Field | Task 13 | Simple |
| 19 | Add Max Users Field | Task 13 | Simple |
| 20 | Add Max Products Field | Task 13 | Simple |
| 21 | Add Max Locations Field | Task 13 | Simple |
| 22 | Add Storage Limit Field | Task 13 | Simple |
| 23 | Add Is Active Field | Task 13 | Simple |
| 24 | Add Display Order Field | Task 13 | Simple |
| 25 | Create PlanFeature Model | Task 23 | Medium |
| 26 | Add Feature Key/Value | Task 25 | Simple |
| 27 | Create SubscriptionPlan Admin | Task 25 | Medium |
| 28 | Create Default Plans Fixture | Task 27 | Medium |

---

## Execution Order

```
01_Tasks-13-18_Plan-Model-Pricing.md
        │
        ▼
02_Tasks-19-24_Plan-Limits-Status.md
        │
        ▼
03_Tasks-25-28_Features-Admin-Fixture.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── platform/
        ├── models/
        │   └── subscription.py  # SubscriptionPlan, PlanFeature
        ├── admin.py             # Updated with plan admin
        └── fixtures/
            └── default_plans.json

docs/
└── saas/
    └── subscription-plans.md    # Plan documentation
```

---

## Default Subscription Plans

| Plan | Monthly (LKR) | Annual (LKR) | Users | Products | Locations |
|------|--------------|--------------|-------|----------|-----------|
| Free | 0 | 0 | 2 | 100 | 1 |
| Starter | 2,999 | 29,990 | 5 | 1,000 | 2 |
| Pro | 9,999 | 99,990 | 20 | 10,000 | 5 |
| Enterprise | 29,999 | 299,990 | Unlimited | Unlimited | Unlimited |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (base models exist)
2. **Currency:** Use DecimalField for prices (LKR)
3. **Limits:** Use -1 or None for unlimited
4. **Fixture:** Create JSON fixture for initial plans
5. **Slug:** Auto-generate from name if not provided
6. **Git Commit:** Commit after completing this group

