# Group E: Verification & Refunds

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement payment verification and refund processing with PayHere APIs

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Webhook-Notification](../Group-D_Webhook-Notification/)
- **→ Next Group:** [Group-F_Frontend-Integration-Testing](../Group-F_Frontend-Integration-Testing/)

---

## Group Overview

This group implements verification and refunds. Creates verify_payment method to verify payment status with PayHere. Creates verification API call and verification hash. Creates verification response parsing and payment reconciliation with webhook data. Creates process_refund method for refund processing. Creates refund API call and refund hash. Creates partial refund support and refund amount validation. Creates refund response parsing and refund record saving. Creates refund webhook handler. Verifies refund processing.

### Key Outcomes

- verify_payment method
- Verification API call
- Verification hash
- Verification response
- Payment reconciliation
- process_refund method
- Refund API call
- Refund hash
- Partial refund
- Refund validation
- Refund response
- Refund record
- Refund webhook
- Refund processing verified

### Technology Context

- **Verify API:** /merchant/v1/payment/verify
- **Refund API:** /merchant/v1/payment/refund
- **Auth:** Merchant ID + Secret
- **Hash:** MD5 signature

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-71_Verify-Reconcile.md` | Create verification and reconciliation | 67-71 |
| 02 | `02_Tasks-72-80_Refund-Webhook-Verify.md` | Create refund and verification | 72-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create verify_payment Method | Medium | Task 66 |
| 68 | Create Verification API Call | Medium | Task 67 |
| 69 | Create Verification Hash | Low | Task 68 |
| 70 | Create Verification Response | Low | Task 68 |
| 71 | Create Payment Reconciliation | Medium | Task 70 |
| 72 | Create process_refund Method | High | Task 66 |
| 73 | Create Refund API Call | Medium | Task 72 |
| 74 | Create Refund Hash | Low | Task 73 |
| 75 | Create Partial Refund | Medium | Task 72 |
| 76 | Create Refund Validation | Low | Task 75 |
| 77 | Create Refund Response | Low | Task 73 |
| 78 | Create Refund Record | Low | Task 77 |
| 79 | Create Refund Webhook | Medium | Task 78 |
| 80 | Verify Refund Processing | Low | Task 79 |

---

## Execution Order

```
Task 67: verify_payment Method
    │
    ▼
Task 68: Verification API Call
    │
    ├────────┐
    ▼        ▼
T-69     T-70
(Hash) (Response)
    │        │
    └────┬───┘
         │
         ▼
   Task 71: Payment Reconciliation
         │
         ▼
   Task 72: process_refund Method
         │
    ┌────┴────┐
    ▼         ▼
T-73       T-75
(API)    (Partial)
    │         │
    ├────┐    ▼
    ▼    ▼   T-76
T-74   T-77 (Valid)
(Hash)(Resp)  │
    │    │    │
    │    └────┤
    │         │
    │         ▼
    │       T-78
    │     (Record)
    │         │
    └─────────┤
              │
              ▼
        Task 79: Refund Webhook
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
        └── processors/
            └── payhere/
                └── processor.py (verify, refund)
        └── webhooks/
            └── payhere.py (refund handler)
```

---

## Notes for AI Agents

### verify_payment Method (Task 67)
| Input | payment_id, order_id |
|-------|----------------------|
| Output | PaymentResult |
| Use | Confirm webhook data |

### Verification API Call (Task 68)
| Endpoint | /merchant/v1/payment/verify |
|----------|------------------------------|
| Method | POST |
| Auth | Merchant ID + Hash |

### Verification Hash (Task 69)
| Components | Value |
|------------|-------|
| merchant_id | Config |
| payment_id | Transaction |
| merchant_secret | Config |

### Verification Response (Task 70)
| Field | Meaning |
|-------|---------|
| status | Payment status |
| amount | Payment amount |
| currency | LKR |

### Payment Reconciliation (Task 71)
| Check | Action |
|-------|--------|
| Amount match | Verify same |
| Status match | Verify same |
| Mismatch | Log alert |

### process_refund Method (Task 72)
| Input | transaction_id, amount, reason |
|-------|--------------------------------|
| Output | RefundResult |
| Support | Full and partial |

### Refund API Call (Task 73)
| Endpoint | /merchant/v1/payment/refund |
|----------|------------------------------|
| Method | POST |
| Auth | Merchant ID + Hash |

### Refund Hash (Task 74)
| Components | Value |
|------------|-------|
| merchant_id | Config |
| payment_id | Transaction |
| amount | Refund amount |
| merchant_secret | Config |

### Partial Refund (Task 75)
| Feature | Supported |
|---------|-----------|
| Partial | Yes |
| Multiple | Yes |
| Max | Original amount |

### Refund Validation (Task 76)
| Check | Rule |
|-------|------|
| Amount | <= remaining refundable |
| Status | Original must be SUCCESS |
| Reason | Required |

### Refund Response (Task 77)
| Field | Meaning |
|-------|---------|
| status | Refund status |
| refund_id | Refund reference |
| message | Error if failed |

### Refund Record (Task 78)
| Model | PaymentRefund |
|-------|---------------|
| transaction | ForeignKey |
| amount | Refund amount |
| reason | Text |
| gateway_reference | refund_id |

### Refund Webhook (Task 79)
| status_code | Meaning |
|-------------|---------|
| Similar | To payment webhooks |
| Update | Refund record status |
