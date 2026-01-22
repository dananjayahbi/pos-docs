# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** F of F  
> **Tasks Covered:** 75-88  
> **Group Goal:** Create frontend components, hooks, gateway switch, and end-to-end testing for WebXPay

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Verification-Refunds](../Group-E_Verification-Refunds/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-04_KOKO-MintPay-BNPL](../SubPhase-04_KOKO-MintPay-BNPL/)

---

## Group Overview

This group creates frontend integration and testing. Creates WebXPay TypeScript types and API client. Creates useWebXPayPayment hook for payment initiation. Creates redirect handler for WebXPay redirect flow. Creates QR display component for QR code payments. Creates WebXPay payment button component with loading state. Creates success and cancel pages for payment completion. Creates sandbox tests using WebXPay test credentials. Creates end-to-end payment flow test. Creates gateway switch UI for PayHere/WebXPay selection. Creates WebXPay integration documentation.

### Key Outcomes

- WebXPay types (TypeScript)
- WebXPay API client
- useWebXPayPayment hook
- Redirect handler
- QR display component
- WebXPay button
- Loading state
- Success page
- Cancel page
- Sandbox tests
- Test credentials
- E2E test
- Gateway switch UI
- WebXPay documentation

### Technology Context

- **Frontend:** Next.js, TypeScript
- **Hook:** TanStack Query mutation
- **QR:** qrcode.react
- **Testing:** Sandbox mode

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-75-82_Types-Hook-Components.md` | Create types, hook, and components | 75-82 |
| 02 | `02_Tasks-83-88_Testing-Switch-Documentation.md` | Create testing, switch, and documentation | 83-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 75 | Create WebXPay Types | Low | Task 74 |
| 76 | Create WebXPay API Client | Medium | Task 75 |
| 77 | Create Payment Hook | Medium | Task 76 |
| 78 | Create Redirect Handler | Medium | Task 77 |
| 79 | Create QR Display | Medium | Task 77 |
| 80 | Create WebXPay Button | Medium | Task 76 |
| 81 | Create Loading State | Low | Task 80 |
| 82 | Create Success Page | Medium | Task 78 |
| 83 | Create Cancel Page | Low | Task 78 |
| 84 | Create Sandbox Tests | Medium | Task 74 |
| 85 | Create Test Credentials | Low | Task 84 |
| 86 | Create E2E Test | High | Task 85 |
| 87 | Create Gateway Switch UI | Medium | Task 80 |
| 88 | Create Documentation | Medium | Task 87 |

---

## Execution Order

```
Task 75: WebXPay Types
    │
    ▼
Task 76: WebXPay API Client
    │
    ├────────┐
    ▼        ▼
T-77     T-80
(Hook) (Button)
    │        │
    ├────┐   ▼
    ▼    ▼ T-81
T-78   T-79(Load)
(Redir)(QR)  │
    │    │   │
    ├────┘   │
    │        │
    ├────────┘
    │
    ├────────┐
    ▼        ▼
T-82     T-83
(Success)(Cancel)
    │        │
    └────┬───┘
         │
         ▼
   Task 84: Sandbox Tests
         │
         ▼
   Task 85: Test Credentials
         │
         ▼
   Task 86: E2E Test
         │
         ▼
   Task 87: Gateway Switch UI
         │
         ▼
   Task 88: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── payments/
│       └── webxpay/
│           ├── types.ts
│           ├── client.ts
│           └── hooks.ts
├── components/
│   └── checkout/
│       ├── WebXPayButton.tsx
│       ├── QRPaymentDisplay.tsx
│       └── GatewaySwitcher.tsx
├── app/
│   └── (storefront)/
│       └── checkout/
│           ├── success/
│           │   └── page.tsx
│           └── cancel/
│               └── page.tsx
└── __tests__/
    └── payments/
        └── webxpay.test.ts
```

---

## Notes for AI Agents

### WebXPay Types (Task 75)
| Type | Fields |
|------|--------|
| WebXPayInitRequest | order_id, gateway, payment_method |
| WebXPayInitResponse | checkout_url, qr_code |
| WebXPayPaymentMethod | CARD, QR, BANK |

### WebXPay API Client (Task 76)
| Method | Endpoint |
|--------|----------|
| initiate | POST /api/payments/initiate/ |
| verify | POST /api/payments/verify/ |

### Payment Hook (Task 77)
| Hook | useWebXPayPayment |
|------|-------------------|
| Type | useMutation |
| Return | initiate function |

### Redirect Handler (Task 78)
| Method | Window redirect |
|--------|-----------------|
| Target | WebXPay checkout URL |

### QR Display (Task 79)
| Component | QRPaymentDisplay |
|-----------|------------------|
| Library | qrcode.react |
| Size | 256x256 |
| Expiry | Countdown timer |

### WebXPay Button (Task 80)
| Props | Type |
|-------|------|
| orderId | string |
| amount | number |
| paymentMethod | QR/Card/Bank |
| onSuccess | () => void |
| onError | (error) => void |

### Loading State (Task 81)
| State | Display |
|-------|---------|
| isLoading | Spinner + "Processing..." |
| Disable | Button disabled |

### Success Page (Task 82)
| Route | /checkout/success |
|-------|-------------------|
| Query | order_id |
| Show | Order confirmation |
| Verify | Check order status |

### Cancel Page (Task 83)
| Route | /checkout/cancel |
|-------|------------------|
| Show | Cancel message |
| Action | Return to cart |

### Sandbox Tests (Task 84)
| Environment | Sandbox |
|-------------|---------|
| URL | WebXPay sandbox |
| Credentials | Test credentials |

### Test Credentials (Task 85)
| Credential | Use |
|------------|-----|
| Test API key | Development |
| Test secret | Development |
| Test cards | Sandbox payments |

### E2E Test (Task 86)
| Flow | Steps |
|------|-------|
| 1 | Add to cart |
| 2 | Checkout |
| 3 | Select WebXPay |
| 4 | Choose method (QR/Card) |
| 5 | Complete payment |
| 6 | Verify success |

### Gateway Switch UI (Task 87)
| Component | GatewaySwitcher |
|-----------|-----------------|
| Options | PayHere, WebXPay |
| Default | PayHere |
| Store | Selected preference |

### Documentation (Task 88)
| Section | Content |
|---------|---------|
| Setup | Config steps |
| Flow | Payment flow |
| QR | QR payment guide |
| Webhooks | Webhook setup |
| Troubleshooting | Common issues |
