# Group F: Frontend Integration & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** F of F  
> **Tasks Covered:** 81-92  
> **Group Goal:** Create frontend components, hooks, and end-to-end testing for PayHere

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Verification-Refunds](../Group-E_Verification-Refunds/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-03_WebXPay-Integration](../SubPhase-03_WebXPay-Integration/)

---

## Group Overview

This group creates frontend integration and testing. Creates PayHere TypeScript types and API client. Creates usePayHerePayment hook for payment initiation. Creates redirect handler for PayHere redirect flow. Creates success and cancel pages for payment completion. Creates PayHere payment button component with loading state. Creates sandbox tests using PayHere sandbox and test cards. Creates end-to-end payment flow test. Creates PayHere integration documentation.

### Key Outcomes

- PayHere types (TypeScript)
- PayHere API client
- usePayHerePayment hook
- Redirect handler
- Success page
- Cancel page
- PayHere button
- Loading state
- Sandbox tests
- Test cards
- E2E payment test
- PayHere documentation

### Technology Context

- **Frontend:** Next.js, TypeScript
- **Hook:** TanStack Query mutation
- **Redirect:** Form POST
- **Testing:** Sandbox mode

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-88_Types-Hook-Components.md` | Create types, hook, and components | 81-88 |
| 02 | `02_Tasks-89-92_Testing-Documentation.md` | Create testing and documentation | 89-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create PayHere Types | Low | Task 80 |
| 82 | Create PayHere API Client | Medium | Task 81 |
| 83 | Create Initiate Payment Hook | Medium | Task 82 |
| 84 | Create Redirect Handler | Medium | Task 83 |
| 85 | Create Success Page | Medium | Task 84 |
| 86 | Create Cancel Page | Low | Task 84 |
| 87 | Create PayHere Button | Medium | Task 82 |
| 88 | Create Loading State | Low | Task 87 |
| 89 | Create Sandbox Tests | Medium | Task 80 |
| 90 | Create Test Cards | Low | Task 89 |
| 91 | Create E2E Payment Test | High | Task 90 |
| 92 | Create PayHere Documentation | Medium | Task 91 |

---

## Execution Order

```
Task 81: PayHere Types
    │
    ▼
Task 82: PayHere API Client
    │
    ├────────┐
    ▼        ▼
T-83     T-87
(Hook) (Button)
    │        │
    ▼        ▼
T-84     T-88
(Redirect)(Loading)
    │        │
    ├────────┘
    │
    ├────────┐
    ▼        ▼
T-85     T-86
(Success)(Cancel)
    │        │
    └────┬───┘
         │
         ▼
   Task 89: Sandbox Tests
         │
         ▼
   Task 90: Test Cards
         │
         ▼
   Task 91: E2E Payment Test
         │
         ▼
   Task 92: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── payments/
│       └── payhere/
│           ├── types.ts
│           ├── client.ts
│           └── hooks.ts
├── app/
│   └── (storefront)/
│       └── checkout/
│           ├── success/
│           │   └── page.tsx
│           └── cancel/
│               └── page.tsx
├── components/
│   └── checkout/
│       └── PayHereButton.tsx
└── __tests__/
    └── payments/
        └── payhere.test.ts
```

---

## Notes for AI Agents

### PayHere Types (Task 81)
| Type | Fields |
|------|--------|
| PayHereInitRequest | order_id, gateway |
| PayHereInitResponse | redirect_url, form_data |
| PayHereFormData | All form fields |

### PayHere API Client (Task 82)
| Method | Endpoint |
|--------|----------|
| initiate | POST /api/payments/initiate/ |
| verify | POST /api/payments/verify/ |

### Initiate Payment Hook (Task 83)
| Hook | usePayHerePayment |
|------|-------------------|
| Type | useMutation |
| Return | initiate function |

### Redirect Handler (Task 84)
| Method | Form POST |
|--------|-----------|
| Create | Hidden form |
| Submit | Auto-submit |
| Target | PayHere URL |

### Success Page (Task 85)
| Route | /checkout/success |
|-------|-------------------|
| Query | order_id |
| Show | Order confirmation |
| Verify | Check order status |

### Cancel Page (Task 86)
| Route | /checkout/cancel |
|-------|------------------|
| Show | Cancel message |
| Action | Return to cart |

### PayHere Button (Task 87)
| Props | Type |
|-------|------|
| orderId | string |
| amount | number |
| onSuccess | () => void |
| onError | (error) => void |

### Loading State (Task 88)
| State | Display |
|-------|---------|
| isLoading | Spinner + "Processing..." |
| Disable | Button disabled |

### Sandbox Tests (Task 89)
| Environment | Sandbox |
|-------------|---------|
| URL | sandbox.payhere.lk |
| Merchant | Test merchant ID |

### Test Cards (Task 90)
| Card | Number |
|------|--------|
| Visa Success | 4916217501611292 |
| Visa Fail | 4000000000000002 |
| Master Success | 5307732125531191 |
| Expiry | Any future date |
| CVV | Any 3 digits |

### E2E Payment Test (Task 91)
| Flow | Steps |
|------|-------|
| 1 | Add to cart |
| 2 | Checkout |
| 3 | Select PayHere |
| 4 | Redirect |
| 5 | Pay (sandbox) |
| 6 | Verify success |

### PayHere Documentation (Task 92)
| Section | Content |
|---------|---------|
| Setup | Config steps |
| Flow | Payment flow |
| Webhooks | Webhook setup |
| Testing | Sandbox guide |
| Troubleshooting | Common issues |
