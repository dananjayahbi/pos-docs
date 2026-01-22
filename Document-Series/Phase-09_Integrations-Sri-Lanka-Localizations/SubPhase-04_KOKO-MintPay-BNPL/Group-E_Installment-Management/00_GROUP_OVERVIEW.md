# Group E: Installment Management

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement installment calculation, tracking, and BNPL order management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Eligibility-Verification](../Group-D_Eligibility-Verification/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group implements installment management. Creates installment calculator for splitting payments. Creates plan options for 3, 4, and 6 month plans. Creates first payment calculation (25% typically). Creates monthly amounts for remaining installments. Creates due dates based on payment schedule. Creates installment display for UI breakdown. Creates BNPLOrder model to track BNPL orders. Creates Installment model for individual installments. Creates payment schedule storage. Creates status tracking for installment progress. Creates installment webhook handler for payment updates. Creates overdue handling for missed payments. Creates BNPL reports for admin. Verifies installment flow.

### Key Outcomes

- Installment calculator
- Plan options (3, 4, 6 month)
- First payment calculation
- Monthly amounts
- Due dates
- Installment display
- BNPLOrder model
- Installment model
- Payment schedule
- Status tracking
- Installment webhook
- Overdue handling
- BNPL reports
- Installment flow verified

### Technology Context

- **Plans:** 3, 4, 6 months
- **First:** Typically 25%
- **Interest:** Zero interest
- **Schedule:** Monthly auto-charge

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-73_Calculator-Models.md` | Create calculator and models | 67-73 |
| 02 | `02_Tasks-74-80_Schedule-Reports-Verify.md` | Create schedule and reports | 74-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create Installment Calculator | High | Task 66 |
| 68 | Create Plan Options | Low | Task 67 |
| 69 | Create First Payment | Low | Task 67 |
| 70 | Create Monthly Amounts | Low | Task 67 |
| 71 | Create Due Dates | Medium | Task 67 |
| 72 | Create Installment Display | Medium | Task 67 |
| 73 | Create BNPLOrder Model | Medium | Task 66 |
| 74 | Create Installment Model | Medium | Task 73 |
| 75 | Create Payment Schedule | Medium | Task 74 |
| 76 | Create Status Tracking | Medium | Task 74 |
| 77 | Create Installment Webhook | Medium | Task 73 |
| 78 | Create Overdue Handling | Medium | Task 76 |
| 79 | Create BNPL Reports | Medium | Task 73 |
| 80 | Verify Installments | Low | Task 79 |

---

## Execution Order

```
Task 67: Installment Calculator
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-68     T-69     T-70     T-71     T-72
(Plans) (First) (Monthly)(Dates)(Display)
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                   │
                   ▼
             Task 73: BNPLOrder Model
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
      T-74      T-77      T-79
   (Install) (Webhook) (Reports)
         │         │         │
    ┌────┴────┐    │         │
    ▼         ▼    │         │
T-75      T-76    │         │
(Schedule)(Status) │         │
    │         │    │         │
    │         ▼    │         │
    │      T-78   │         │
    │   (Overdue) │         │
    │         │    │         │
    └─────────┴────┴─────────┘
                   │
                   ▼
             Task 80: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   └── bnpl/
        │       └── installments.py
        └── models/
            ├── bnpl_order.py
            └── installment.py
```

---

## Notes for AI Agents

### Installment Calculator (Task 67)
| Input | order_amount, plan_months |
|-------|---------------------------|
| Output | InstallmentBreakdown |
| Logic | Split evenly with first payment |

### Plan Options (Task 68)
| Plan | Months | First % |
|------|--------|---------|
| 3-month | 3 | 33.33% |
| 4-month | 4 | 25% |
| 6-month | 6 | 16.67% |

### First Payment (Task 69)
| Calculate | Value |
|-----------|-------|
| Formula | total / plan_months |
| Round | Ceiling (covers rounding) |
| Due | Today |

### Monthly Amounts (Task 70)
| Calculate | Value |
|-----------|-------|
| Formula | (total - first) / (months - 1) |
| Distribute | Evenly |

### Due Dates (Task 71)
| Calculate | Value |
|-----------|-------|
| Start | Order date |
| Interval | 30 days |
| Format | YYYY-MM-DD |

### Installment Display (Task 72)
| Display | Fields |
|---------|--------|
| Installment # | 1 of 4 |
| Amount | ₨2,500 |
| Due date | 2024-02-15 |
| Status | Paid/Pending |

### BNPLOrder Model (Task 73)
| Field | Type |
|-------|------|
| order | ForeignKey |
| provider | KOKO/MintPay |
| plan_months | IntegerField |
| total_amount | DecimalField |
| first_payment | DecimalField |
| status | Choices |

### Installment Model (Task 74)
| Field | Type |
|-------|------|
| bnpl_order | ForeignKey |
| installment_number | IntegerField |
| amount | DecimalField |
| due_date | DateField |
| paid_date | DateField (null) |
| status | Choices |

### Payment Schedule (Task 75)
| Store | Fields |
|-------|--------|
| Create | All installments on order |
| Track | Due dates, amounts |

### Status Tracking (Task 76)
| Status | Meaning |
|--------|---------|
| PENDING | Not yet due |
| DUE | Due today |
| PAID | Payment received |
| OVERDUE | Past due date |

### Installment Webhook (Task 77)
| Trigger | Provider payment |
|---------|------------------|
| Update | Installment status |
| Action | Mark as paid |

### Overdue Handling (Task 78)
| Check | Daily job |
|-------|-----------|
| Action | Mark overdue |
| Notify | Admin alert |
| Note | Provider handles collection |

### BNPL Reports (Task 79)
| Report | Fields |
|--------|--------|
| Total BNPL orders | Count |
| By provider | KOKO/MintPay |
| Outstanding | Unpaid installments |
| Overdue | Past due count |
