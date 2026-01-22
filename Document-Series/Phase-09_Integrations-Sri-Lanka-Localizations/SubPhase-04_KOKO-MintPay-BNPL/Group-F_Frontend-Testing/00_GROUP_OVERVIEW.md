# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** F of F  
> **Tasks Covered:** 81-94  
> **Group Goal:** Create frontend BNPL components, eligibility flow, and testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Installment-Management](../Group-E_Installment-Management/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-05_Bank-Transfer-Upload](../SubPhase-05_Bank-Transfer-Upload/)

---

## Group Overview

This group creates frontend BNPL integration and testing. Creates BNPL TypeScript types and API client. Creates useBNPLEligibility hook for eligibility checking. Creates useBNPLPayment hook for payment initiation. Creates KOKO and MintPay payment buttons. Creates installment preview component showing payment schedule. Creates BNPL badge for product pages. Creates NIC input component with validation. Creates eligibility modal for checking eligibility. Creates approval and rejection screens. Creates sandbox tests using BNPL sandbox environments. Creates BNPL integration documentation.

### Key Outcomes

- BNPL types (TypeScript)
- BNPL API client
- useBNPLEligibility hook
- useBNPLPayment hook
- KOKO button
- MintPay button
- Installment preview
- BNPL badge
- NIC input component
- Eligibility modal
- Approval screen
- Rejection screen
- Sandbox tests
- BNPL documentation

### Technology Context

- **Frontend:** Next.js, TypeScript
- **Hooks:** TanStack Query
- **NIC:** Input with validation
- **Testing:** Sandbox mode

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-88_Types-Components.md` | Create types and components | 81-88 |
| 02 | `02_Tasks-89-94_Modal-Testing-Docs.md` | Create modal, testing, and documentation | 89-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create BNPL Types | Low | Task 80 |
| 82 | Create BNPL API Client | Medium | Task 81 |
| 83 | Create Eligibility Hook | Medium | Task 82 |
| 84 | Create Payment Hook | Medium | Task 82 |
| 85 | Create KOKO Button | Medium | Task 82 |
| 86 | Create MintPay Button | Medium | Task 82 |
| 87 | Create Installment Preview | Medium | Task 82 |
| 88 | Create BNPL Badge | Low | Task 82 |
| 89 | Create NIC Input | Medium | Task 82 |
| 90 | Create Eligibility Modal | Medium | Task 83 |
| 91 | Create Approval Screen | Medium | Task 84 |
| 92 | Create Rejection Screen | Low | Task 84 |
| 93 | Create Sandbox Tests | Medium | Task 80 |
| 94 | Create Documentation | Medium | Task 93 |

---

## Execution Order

```
Task 81: BNPL Types
    │
    ▼
Task 82: BNPL API Client
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-83     T-84     T-85     T-86     T-87     T-88     T-89
(Elig)  (Pay)   (KOKO) (MintPay)(Preview)(Badge)(NIC)
    │        │        │        │        │        │        │
    ▼        │        │        │        │        │        │
T-90       │        │        │        │        │        │
(Modal)    │        │        │        │        │        │
    │        │        │        │        │        │        │
    │   ┌────┴────┐   │        │        │        │        │
    │   ▼         ▼   │        │        │        │        │
    │ T-91      T-92  │        │        │        │        │
    │(Approve)(Reject)│        │        │        │        │
    │   │         │   │        │        │        │        │
    └───┴─────────┴───┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                        Task 93: Sandbox Tests
                              │
                              ▼
                        Task 94: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── payments/
│       └── bnpl/
│           ├── types.ts
│           ├── client.ts
│           └── hooks.ts
├── components/
│   └── checkout/
│       ├── KOKOButton.tsx
│       ├── MintPayButton.tsx
│       ├── InstallmentPreview.tsx
│       ├── BNPLBadge.tsx
│       ├── NICInput.tsx
│       └── EligibilityModal.tsx
├── app/
│   └── (storefront)/
│       └── checkout/
│           ├── bnpl/
│           │   ├── approved/
│           │   │   └── page.tsx
│           │   └── rejected/
│           │       └── page.tsx
└── __tests__/
    └── payments/
        └── bnpl.test.ts
```

---

## Notes for AI Agents

### BNPL Types (Task 81)
| Type | Fields |
|------|--------|
| BNPLProvider | KOKO, MINTPAY |
| EligibilityRequest | nic, phone, order_amount |
| EligibilityResponse | eligible, plans, limit |
| InstallmentPlan | months, first_payment, monthly |

### BNPL API Client (Task 82)
| Method | Endpoint |
|--------|----------|
| checkEligibility | POST /api/payments/bnpl/eligibility/ |
| initiate | POST /api/payments/bnpl/initiate/ |

### Eligibility Hook (Task 83)
| Hook | useBNPLEligibility |
|------|---------------------|
| Input | nic, phone, order_amount |
| Output | eligibility result |

### Payment Hook (Task 84)
| Hook | useBNPLPayment |
|------|----------------|
| Type | useMutation |
| Input | provider, order_id |

### KOKO Button (Task 85)
| Component | KOKOButton |
|-----------|------------|
| Props | orderId, amount, onSuccess |
| Display | KOKO logo + "Pay with KOKO" |

### MintPay Button (Task 86)
| Component | MintPayButton |
|-----------|---------------|
| Props | orderId, amount, onSuccess |
| Display | MintPay logo + "Pay with MintPay" |

### Installment Preview (Task 87)
| Component | InstallmentPreview |
|-----------|---------------------|
| Props | amount, plan_months |
| Display | Payment schedule table |

### BNPL Badge (Task 88)
| Component | BNPLBadge |
|-----------|-----------|
| Props | minAmount |
| Display | "Pay in 4 from ₨X/month" |
| Location | Product page |

### NIC Input (Task 89)
| Component | NICInput |
|-----------|----------|
| Validation | Old/new format |
| Format | Auto-detect |
| Error | Invalid NIC message |

### Eligibility Modal (Task 90)
| Component | EligibilityModal |
|-----------|------------------|
| Steps | Enter NIC → Check → Result |
| Loading | Checking eligibility... |
| Result | Eligible or Not |

### Approval Screen (Task 91)
| Route | /checkout/bnpl/approved |
|-------|-------------------------|
| Show | Approved message |
| Display | Installment schedule |
| Action | Proceed to order confirmation |

### Rejection Screen (Task 92)
| Route | /checkout/bnpl/rejected |
|-------|-------------------------|
| Show | Rejection message |
| Reason | User-friendly reason |
| Action | Try other payment methods |

### Sandbox Tests (Task 93)
| Environment | Sandbox |
|-------------|---------|
| Test NIC | Test NIC numbers |
| Test phone | Test phone numbers |
| Scenarios | Approval, rejection |

### Documentation (Task 94)
| Section | Content |
|---------|---------|
| Setup | KOKO/MintPay config |
| Eligibility | Eligibility flow |
| Payment | Payment flow |
| NIC | NIC format guide |
| Testing | Sandbox guide |
