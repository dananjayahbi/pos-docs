# Group E: Verification & Refunds

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** E of F  
> **Tasks Covered:** 61-74  
> **Group Goal:** Implement payment verification and refund processing with WebXPay APIs

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Webhook-Callback](../Group-D_Webhook-Callback/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group implements verification and refunds. Creates verify_payment method to verify payment status with WebXPay. Creates status query API call and query signature. Creates status response parsing and payment reconciliation with webhook data. Creates process_refund method for refund processing. Creates refund API call and refund signature. Creates partial refund support and refund amount validation. Creates refund response parsing and refund record saving. Creates refund webhook handler. Verifies refund processing.

### Key Outcomes

- verify_payment method
- Status query API
- Query signature
- Status response
- Reconciliation
- process_refund method
- Refund API call
- Refund signature
- Partial refund
- Refund validation
- Refund response
- Refund record
- Refund webhook
- Refund processing verified

### Technology Context

- **Status API:** /api/v1/payment/status
- **Refund API:** /api/v1/payment/refund
- **Auth:** API key + signature
- **Signature:** HMAC-SHA256

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-61-67_Verify-Reconcile-Refund.md` | Create verification and refund initiation | 61-67 |
| 02 | `02_Tasks-68-74_Partial-Webhook-Verify.md` | Create partial refund and verification | 68-74 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 61 | Create verify_payment Method | Medium | Task 60 |
| 62 | Create Status Query API | Medium | Task 61 |
| 63 | Create Query Signature | Low | Task 62 |
| 64 | Create Status Response | Low | Task 62 |
| 65 | Create Reconciliation | Medium | Task 64 |
| 66 | Create process_refund Method | High | Task 60 |
| 67 | Create Refund API Call | Medium | Task 66 |
| 68 | Create Refund Signature | Low | Task 67 |
| 69 | Create Partial Refund | Medium | Task 66 |
| 70 | Create Refund Validation | Low | Task 69 |
| 71 | Create Refund Response | Low | Task 67 |
| 72 | Create Refund Record | Low | Task 71 |
| 73 | Create Refund Webhook | Medium | Task 72 |
| 74 | Verify Refunds | Low | Task 73 |

---

## Execution Order

```
Task 61: verify_payment Method
    │
    ▼
Task 62: Status Query API
    │
    ├────────┐
    ▼        ▼
T-63     T-64
(Sig)  (Response)
    │        │
    └────┬───┘
         │
         ▼
   Task 65: Reconciliation
         │
         ▼
   Task 66: process_refund Method
         │
    ┌────┴────┐
    ▼         ▼
T-67       T-69
(API)    (Partial)
    │         │
    ├────┐    ▼
    ▼    ▼   T-70
T-68   T-71 (Valid)
(Sig) (Resp)  │
    │    │    │
    │    └────┤
    │         │
    │         ▼
    │       T-72
    │     (Record)
    │         │
    └─────────┤
              │
              ▼
        Task 73: Refund Webhook
              │
              ▼
        Task 74: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── webxpay/
                └── processor.py (verify, refund)
        └── webhooks/
            └── webxpay.py (refund handler)
```

---

## Notes for AI Agents

### verify_payment Method (Task 61)
| Input | payment_reference |
|-------|-------------------|
| Output | PaymentResult |
| Use | Confirm webhook data |

### Status Query API (Task 62)
| Endpoint | /api/v1/payment/status |
|----------|------------------------|
| Method | POST |
| Auth | API key + signature |

### Query Signature (Task 63)
| Components | Value |
|------------|-------|
| merchant_id | Config |
| reference | Payment reference |
| secret_key | Config |

### Status Response (Task 64)
| Field | Meaning |
|-------|---------|
| status | Payment status |
| amount | Payment amount |
| reference | Payment reference |

### Reconciliation (Task 65)
| Check | Action |
|-------|--------|
| Amount match | Verify same |
| Status match | Verify same |
| Mismatch | Log alert |

### process_refund Method (Task 66)
| Input | transaction_id, amount, reason |
|-------|--------------------------------|
| Output | RefundResult |
| Support | Full and partial |

### Refund API Call (Task 67)
| Endpoint | /api/v1/payment/refund |
|----------|------------------------|
| Method | POST |
| Auth | API key + signature |

### Refund Signature (Task 68)
| Components | Value |
|------------|-------|
| merchant_id | Config |
| reference | Transaction reference |
| amount | Refund amount |
| secret_key | Config |

### Partial Refund (Task 69)
| Feature | Supported |
|---------|-----------|
| Partial | Yes |
| Multiple | Yes |
| Max | Original amount |

### Refund Validation (Task 70)
| Check | Rule |
|-------|------|
| Amount | <= remaining refundable |
| Status | Original must be SUCCESS |
| Reason | Required |

### Refund Response (Task 71)
| Field | Meaning |
|-------|---------|
| status | Refund status |
| refund_id | Refund reference |
| message | Error if failed |

### Refund Record (Task 72)
| Model | PaymentRefund |
|-------|---------------|
| transaction | ForeignKey |
| amount | Refund amount |
| reason | Text |
| gateway_reference | refund_id |

### Refund Webhook (Task 73)
| Handle | Refund callbacks |
|--------|------------------|
| Update | Refund record status |
| Notify | Admin if needed |
