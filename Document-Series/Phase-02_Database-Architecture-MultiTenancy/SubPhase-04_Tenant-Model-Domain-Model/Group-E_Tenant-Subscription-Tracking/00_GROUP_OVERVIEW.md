# Group E: Tenant Subscription Tracking

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** E of F  
> **Tasks Covered:** 59-72  
> **Group Goal:** Create subscription tracking for tenant billing

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Tenant-Settings-Model/](../Group-D_Tenant-Settings-Model/)
- **→ Next Group:** [../Group-F_Admin-Management/](../Group-F_Admin-Management/)

---

## Group Overview

This group creates the TenantSubscription model that tracks each tenant's subscription status, billing cycle, dates, and payment information. This enables subscription management and billing automation.

### Key Outcomes
- TenantSubscription model created
- Tenant foreign key relationship
- Plan foreign key (to SubscriptionPlan)
- Status field (active, trial, expired, cancelled)
- Billing cycle field (monthly/annual)
- Started at timestamp
- Expires at timestamp
- Trial ends at timestamp
- Next billing date field
- Amount field (current billing amount)
- Payment method field
- Is auto renew field
- Custom SubscriptionManager
- Active/expired querysets

### Technology Context
- **Relationship:** FK to Tenant and SubscriptionPlan
- **Status:** Tracks subscription lifecycle
- **Billing:** Monthly or annual cycles
- **Currency:** LKR (Sri Lankan Rupee)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-59-65_Subscription-Core.md | 59-65 | TenantSubscription, FKs, status, billing cycle, dates |
| 02 | 02_Tasks-66-72_Billing-Manager.md | 66-72 | Trial ends, billing date, amount, payment method, auto renew, manager |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 59 | Create TenantSubscription Model | Task 16 | Medium |
| 60 | Add Tenant FK | Task 59 | Simple |
| 61 | Add Plan FK | Task 59 | Simple |
| 62 | Add Status Field | Task 59 | Simple |
| 63 | Add Billing Cycle Field | Task 59 | Simple |
| 64 | Add Started At Field | Task 59 | Simple |
| 65 | Add Expires At Field | Task 59 | Simple |
| 66 | Add Trial Ends At Field | Task 59 | Simple |
| 67 | Add Next Billing Date | Task 59 | Simple |
| 68 | Add Amount Field | Task 59 | Simple |
| 69 | Add Payment Method | Task 59 | Simple |
| 70 | Add Is Auto Renew Field | Task 59 | Simple |
| 71 | Create Subscription Manager | Task 59 | Medium |
| 72 | Add Active/Expired Querysets | Task 71 | Simple |

---

## Execution Order

```
01_Tasks-59-65_Subscription-Core.md
        │
        ▼
02_Tasks-66-72_Billing-Manager.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── models/
            ├── subscription.py           # TenantSubscription
            └── managers/
                └── subscription_manager.py
```

---

## Subscription Statuses

| Status | Description |
|--------|-------------|
| TRIAL | Active trial period |
| ACTIVE | Paid subscription active |
| EXPIRED | Subscription expired |
| CANCELLED | User cancelled |
| SUSPENDED | Admin suspended |

---

## Billing Cycles

| Cycle | Description | Discount |
|-------|-------------|----------|
| MONTHLY | Billed monthly | None |
| ANNUAL | Billed annually | ~17% off |

---

## Model Relationships

```
SubscriptionPlan (platform app)
        │
        ▼ FK
TenantSubscription ◄──── Tenant
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete (TenantSettings exists)
2. **Plan FK:** References SubscriptionPlan in platform app
3. **Amount:** Use DecimalField for currency
4. **Trial:** Default trial period from PlatformSettings
5. **Manager:** Provide helpers like is_active_or_trial()
6. **Git Commit:** Commit after completing this group

