# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** F of F  
> **Tasks Covered:** 77-90  
> **Group Goal:** Create frontend COD components and integration testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Reconciliation-Reports](../Group-E_Reconciliation-Reports/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-07_Shipping-Zone-Configuration](../../SubPhase-07_Shipping-Zone-Configuration/)

---

## Group Overview

This group creates frontend COD integration. Creates COD TypeScript types and API client. Creates useCODEligibility hook for checking COD availability and useCODPayment hook for COD payment flow. Creates COD button component with fee display. Creates OTP input component with timer for countdown to resend and resend button. Creates not available message and limit reached message components. Creates admin reconciliation UI. Creates integration tests. Creates COD documentation.

### Key Outcomes

- COD types (TypeScript)
- COD API client
- useCODEligibility hook
- useCODPayment hook
- COD button
- COD fee display
- OTP input
- OTP timer
- OTP resend
- Not available message
- Limit reached message
- Admin reconciliation UI
- Integration tests
- COD documentation

### Technology Context

- **Frontend:** Next.js, TypeScript
- **OTP:** Timer countdown
- **Eligibility:** Real-time check
- **Messages:** Clear user feedback

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-77-83_Types-Hooks-OTP.md` | Create types, hooks, and OTP | 77-83 |
| 02 | `02_Tasks-84-90_Messages-Admin-Testing.md` | Create messages, admin, and testing | 84-90 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 77 | Create COD Types | Low | Task 76 |
| 78 | Create COD API Client | Medium | Task 77 |
| 79 | Create Eligibility Hook | Medium | Task 78 |
| 80 | Create Payment Hook | Medium | Task 78 |
| 81 | Create COD Button | Medium | Task 78 |
| 82 | Create COD Fee Display | Low | Task 81 |
| 83 | Create OTP Input | Medium | Task 78 |
| 84 | Create OTP Timer | Low | Task 83 |
| 85 | Create OTP Resend | Low | Task 83 |
| 86 | Create Not Available Message | Low | Task 79 |
| 87 | Create Limit Message | Low | Task 79 |
| 88 | Create Admin Reconciliation | Medium | Task 76 |
| 89 | Create Integration Tests | Medium | Task 76 |
| 90 | Create Documentation | Medium | Task 89 |

---

## Execution Order

```
Task 77: COD Types
    │
    ▼
Task 78: COD API Client
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-79     T-80     T-81     T-83
(Elig)  (Pay)  (Button)  (OTP)
    │        │        │        │
    │        │        ▼        ├────────┐
    │        │      T-82      ▼        ▼
    │        │     (Fee)    T-84     T-85
    │        │        │    (Timer) (Resend)
    │        │        │        │        │
    ├────────┤        │        │        │
    ▼        ▼        │        │        │
T-86     T-87       │        │        │
(NotAvl)(Limit)     │        │        │
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                    │
                    ▼
           Task 88: Admin Reconciliation
                    │
                    ▼
           Task 89: Integration Tests
                    │
                    ▼
           Task 90: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── payments/
│       └── cod/
│           ├── types.ts
│           ├── client.ts
│           └── hooks.ts
├── components/
│   └── checkout/
│       ├── CODButton.tsx
│       ├── CODFeeDisplay.tsx
│       ├── OTPInput.tsx
│       ├── OTPTimer.tsx
│       └── CODNotAvailable.tsx
└── __tests__/
    └── payments/
        └── cod.test.ts
```

---

## Notes for AI Agents

### COD Types (Task 77)
| Type | Fields |
|------|--------|
| CODEligibility | eligible, reason, max_amount |
| CODPayment | order_id, amount, fee |
| OTPRequest | phone, order_id |

### COD API Client (Task 78)
| Method | Endpoint |
|--------|----------|
| checkEligibility | POST /api/payments/cod/eligibility/ |
| initiate | POST /api/payments/cod/initiate/ |
| sendOTP | POST /api/payments/cod/otp/send/ |
| verifyOTP | POST /api/payments/cod/otp/verify/ |

### Eligibility Hook (Task 79)
| Hook | useCODEligibility |
|------|-------------------|
| Input | address, amount |
| Return | eligible, reason, limit |

### Payment Hook (Task 80)
| Hook | useCODPayment |
|------|---------------|
| Return | initiate, verifyOTP, status |

### COD Button (Task 81)
| Component | CODButton |
|-----------|-----------|
| Props | orderId, amount |
| Display | "Cash on Delivery" |
| Disabled | If not eligible |

### COD Fee Display (Task 82)
| Component | CODFeeDisplay |
|-----------|---------------|
| Props | feeType, feeAmount |
| Display | "+₨100 COD fee" |

### OTP Input (Task 83)
| Component | OTPInput |
|-----------|----------|
| Props | onVerify, phone |
| Inputs | 6 digit boxes |

### OTP Timer (Task 84)
| Component | OTPTimer |
|-----------|----------|
| Display | Countdown seconds |
| Initial | 60 seconds |

### OTP Resend (Task 85)
| Component | OTPResend |
|-----------|-----------|
| Enable | After timer ends |
| Max | 3 resends |

### Not Available Message (Task 86)
| Component | CODNotAvailable |
|-----------|-----------------|
| Message | "COD is not available for your area" |
| Reason | Show specific reason |

### Limit Message (Task 87)
| Component | CODLimitMessage |
|-----------|-----------------|
| Message | "Order exceeds COD limit of ₨X" |
| Suggestion | "Try online payment" |

### Admin Reconciliation (Task 88)
| Route | /admin/payments/cod/reconciliation |
|-------|-------------------------------------|
| Features | View, reconcile, export |
| Filters | Date range, courier, status |

### Integration Tests (Task 89)
| Test | Flow |
|------|------|
| 1 | Check eligibility |
| 2 | Send OTP |
| 3 | Verify OTP |
| 4 | Place COD order |
| 5 | Collection flow |

### Documentation (Task 90)
| Section | Content |
|---------|---------|
| Setup | COD configuration |
| Flow | Customer flow |
| Admin | Reconciliation |
| Risk | Risk management |
| Troubleshooting | Common issues |
