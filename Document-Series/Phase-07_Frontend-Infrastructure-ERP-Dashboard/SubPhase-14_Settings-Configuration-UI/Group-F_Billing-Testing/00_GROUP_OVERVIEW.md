# Group F: Billing & Testing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** F of F  
> **Tasks Covered:** 79-92  
> **Group Goal:** Build billing management, audit log, and final testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Integrations-API-Keys](../Group-E_Integrations-API-Keys/)
- **→ Next Group:** None (Last Group) | **Next Phase:** [Phase-08_Webstore-Ecommerce-Platform](../../Phase-08_Webstore-Ecommerce-Platform/)

---

## Group Overview

This group creates billing management and audit log interfaces. Creates billing page with current plan card showing plan name and features. Adds upgrade plan button and plan selection modal. Creates billing history table with invoice downloads. Creates payment method section with add payment method action. Creates audit log page with table and filters. Creates settings module documentation. Performs final verification testing.

### Key Outcomes

- Billing page
- Current plan card
- Plan features list
- Upgrade plan button
- Plan selection modal
- Billing history table
- Download invoice action
- Payment method section
- Add payment method action
- Audit log page
- Audit log table
- Audit log filters
- Settings module documentation
- Final verification complete

### Technology Context

- **Billing:** Subscription management
- **PDF:** Invoice download
- **Audit:** Activity tracking
- **Currency:** LKR (Sri Lankan Rupees)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-87_Billing.md` | Create billing and payment management | 79-87 |
| 02 | `02_Tasks-88-92_Audit-Testing.md` | Create audit log and final testing | 88-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create Billing Page | Medium | Task 14 |
| 80 | Create Current Plan Card | Medium | Task 79 |
| 81 | Create Plan Features List | Low | Task 80 |
| 82 | Create Upgrade Plan Button | Low | Task 80 |
| 83 | Create Plan Selection Modal | Medium | Task 82 |
| 84 | Create Billing History Table | Medium | Task 79 |
| 85 | Create Download Invoice Action | Low | Task 84 |
| 86 | Create Payment Method Section | Medium | Task 79 |
| 87 | Create Add Payment Method | Medium | Task 86 |
| 88 | Create Audit Log Page | Medium | Task 14 |
| 89 | Create Audit Log Table | Medium | Task 88 |
| 90 | Create Audit Log Filters | Low | Task 89 |
| 91 | Create Settings Module Documentation | Low | Task 90 |
| 92 | Final Verification & Testing | Low | Task 91 |

---

## Execution Order

```
Task 79: Billing Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 80: Current Plan Card                             │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 81    Task 82       │                            │
(Features) (Upgrade)      │                            │
    │          │          │                            │
    │          ▼          │                            │
    │     Task 83        │                            │
    │     (Selection)    │                            │
    │          │          │                            │
    └──────────┘          │                            │
               │          │                            │
               ▼          │                            │
         Task 84: Billing History                      │
               │          │                            │
               ▼          │                            │
         Task 85: Download Invoice                     │
               │          │                            │
               ▼          │                            │
         Task 86: Payment Method                       │
               │          │                            │
               ▼          │                            │
         Task 87: Add Payment                          │
               │          │                            │
               └──────────┘                            │
                          │                            │
                          ▼                            │
                    Task 88: Audit Log Page            │
                          │                            │
                          ▼                            │
                    Task 89: Audit Table               │
                          │                            │
                          ▼                            │
                    Task 90: Filters                   │
                          │                            │
                          ▼                            │
                    Task 91: Documentation             │
                          │                            │
                          ▼
                    Task 92: Testing
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── settings/
│           ├── Billing/
│           │   ├── BillingPage.tsx
│           │   ├── CurrentPlanCard.tsx
│           │   ├── PlanFeaturesList.tsx
│           │   ├── UpgradePlanButton.tsx
│           │   ├── PlanSelectionModal.tsx
│           │   ├── BillingHistoryTable.tsx
│           │   ├── DownloadInvoice.tsx
│           │   ├── PaymentMethodSection.tsx
│           │   ├── AddPaymentMethod.tsx
│           │   └── index.ts
│           ├── AuditLog/
│           │   ├── AuditLogPage.tsx
│           │   ├── AuditLogTable.tsx
│           │   ├── AuditLogFilters.tsx
│           │   └── index.ts
│           └── index.ts
└── docs/
    └── SETTINGS_MODULE.md
```

---

## Notes for AI Agents

### Current Plan Card (Task 80)
| Element | Content |
|---------|---------|
| Plan Name | Current plan |
| Price | ₨ X,XXX/month |
| Billing Cycle | Monthly/Annual |
| Next Billing | Date |
| Features | Key features list |

### Plan Tiers
| Plan | Price (LKR) | Features |
|------|-------------|----------|
| Starter | Free | 1 user, 100 products |
| Business | 4,999/mo | 5 users, 1000 products |
| Pro | 9,999/mo | 10 users, unlimited |
| Enterprise | Custom | Unlimited, support |

### Plan Features List (Task 81)
| Feature | Starter | Business | Pro |
|---------|---------|----------|-----|
| Users | 1 | 5 | 10 |
| Products | 100 | 1,000 | Unlimited |
| Transactions | 500/mo | 5,000/mo | Unlimited |
| Locations | 1 | 3 | 10 |
| Support | Email | Email+Chat | Priority |

### Billing History Columns (Task 84)
| Column | Width |
|--------|-------|
| Invoice # | 120px |
| Date | 100px |
| Amount | 120px |
| Status | 100px |
| Action | 80px |

### Invoice Status
| Status | Color |
|--------|-------|
| Paid | Green |
| Pending | Yellow |
| Failed | Red |

### Payment Methods (Task 86)
| Type | Icon |
|------|------|
| Credit Card | CreditCard |
| Debit Card | CreditCard |
| Bank Transfer | Building |

### Add Payment (Task 87)
| Field | Type |
|-------|------|
| Card Number | Card input |
| Expiry | MM/YY |
| CVV | 3 digits |
| Name | Text |
| Default | Checkbox |

### Audit Log Columns (Task 89)
| Column | Width |
|--------|-------|
| Timestamp | 160px |
| User | 150px |
| Action | 150px |
| Resource | 150px |
| Details | 200px |
| IP Address | 120px |

### Audit Actions
| Action | Category |
|--------|----------|
| Login | Auth |
| Logout | Auth |
| Create | CRUD |
| Update | CRUD |
| Delete | CRUD |
| Export | Data |
| Settings Change | Config |

### Audit Log Filters (Task 90)
| Filter | Type |
|--------|------|
| User | Select |
| Action | Select |
| Resource | Select |
| Date Range | Date picker |

### Documentation (Task 91)
| Section | Content |
|---------|---------|
| Components | All settings components |
| Hooks | Custom hooks |
| API | Endpoints used |
| Permissions | Required permissions |

### Final Testing (Task 92)
| Test Case | Scenario |
|-----------|----------|
| General | Localization, notifications |
| Company | Profile, logo upload |
| Users | Invite, edit, disable |
| Roles | Create, permissions |
| Integrations | Connect, disconnect |
| API Keys | Generate, revoke |
| Billing | View, upgrade |
| Audit | View, filter |
