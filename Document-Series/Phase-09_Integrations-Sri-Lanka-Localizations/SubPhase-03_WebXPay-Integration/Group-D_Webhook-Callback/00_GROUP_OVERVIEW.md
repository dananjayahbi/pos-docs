# Group D: Webhook & Callback

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** D of F  
> **Tasks Covered:** 47-60  
> **Group Goal:** Implement WebXPay webhook endpoint with HMAC verification and status handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Payment-Request-Checkout](../Group-C_Payment-Request-Checkout/)
- **→ Next Group:** [Group-E_Verification-Refunds](../Group-E_Verification-Refunds/)

---

## Group Overview

This group implements WebXPay webhook handling. Creates WebXPay webhook view and URL configuration. Creates CSRF exemption for webhook endpoint. Creates HMAC signature verification with secure comparison. Creates payload parser for webhook data and status mapping. Creates handlers for success, failure, and pending statuses. Creates order update logic and transaction record saving. Creates webhook logging for all received webhooks. Verifies webhook processing.

### Key Outcomes

- WebXPay webhook view
- Webhook URL config
- Webhook CSRF exempt
- Signature verification
- Signature comparison
- Payload parser
- Status mapping
- Success handler
- Failure handler
- Pending handler
- Order update
- Transaction record
- Webhook logging
- Webhook processing verified

### Technology Context

- **Signature:** HMAC-SHA256
- **CSRF:** Exempt
- **Response:** 200 OK always
- **Async:** Optional Celery

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-47-53_View-Signature-Parser.md` | Create view, signature, and parser | 47-53 |
| 02 | `02_Tasks-54-60_Handlers-Update-Verify.md` | Create handlers and verification | 54-60 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 47 | Create WebXPay Webhook View | Medium | Task 46 |
| 48 | Create Webhook URL Config | Low | Task 47 |
| 49 | Create CSRF Exempt | Low | Task 47 |
| 50 | Create Signature Verification | High | Task 47 |
| 51 | Create Signature Comparison | Low | Task 50 |
| 52 | Create Payload Parser | Medium | Task 47 |
| 53 | Create Status Mapping | Low | Task 52 |
| 54 | Create Success Handler | Medium | Task 53 |
| 55 | Create Failure Handler | Low | Task 53 |
| 56 | Create Pending Handler | Low | Task 53 |
| 57 | Create Order Update | Medium | Task 54 |
| 58 | Create Transaction Record | Medium | Task 57 |
| 59 | Create Webhook Logging | Low | Task 47 |
| 60 | Verify Webhook | Low | Task 59 |

---

## Execution Order

```
Task 47: WebXPay Webhook View
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-48     T-49     T-50     T-52     T-59
(URL)  (CSRF)   (Sig)  (Parser)  (Log)
    │        │        │        │        │
    │        │        ▼        │        │
    │        │      T-51      │        │
    │        │   (Compare)    │        │
    │        │        │        │        │
    └────────┴────────┴────────┘        │
                   │                    │
                   ▼                    │
             Task 53: Status Mapping    │
                   │                    │
         ┌────────┼────────┐           │
         ▼        ▼        ▼           │
      T-54     T-55     T-56           │
    (Success)(Failure)(Pending)        │
         │        │        │           │
         └────────┤        │           │
                  │        │           │
                  ▼        │           │
            Task 57: Order Update      │
                  │        │           │
                  ▼        │           │
            Task 58: Transaction       │
                  │        │           │
                  └────────┴───────────┘
                           │
                           ▼
                     Task 60: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── webhooks/
            └── webxpay.py
        └── processors/
            └── webxpay/
                └── validators.py
```

---

## Notes for AI Agents

### WebXPay Webhook View (Task 47)
| Endpoint | /api/webhooks/webxpay/ |
|----------|------------------------|
| Method | POST |
| Response | 200 OK always |

### Webhook URL Config (Task 48)
| URL | Path |
|-----|------|
| Pattern | webhooks/webxpay/ |
| Name | webxpay-webhook |

### CSRF Exempt (Task 49)
| Decorator | @csrf_exempt |
|-----------|--------------|
| Reason | External POST |

### Signature Verification (Task 50)
| Algorithm | HMAC-SHA256 |
|-----------|-------------|
| Header | X-Signature |
| Match | Required |

### Signature Comparison (Task 51)
| Method | hmac.compare_digest |
|--------|---------------------|
| Security | Timing-safe compare |

### Payload Parser (Task 52)
| Parse | JSON body |
|-------|-----------|
| Fields | All WebXPay fields |
| Sanitize | Strip, validate |

### Status Mapping (Task 53)
| WebXPay Status | Internal Status |
|----------------|-----------------|
| SUCCESS | PaymentStatus.SUCCESS |
| FAILED | PaymentStatus.FAILED |
| PENDING | PaymentStatus.PENDING |
| CANCELLED | PaymentStatus.CANCELLED |

### Success Handler (Task 54)
| Status | SUCCESS |
|--------|---------|
| Action | Mark order paid |
| Emit | payment_success signal |

### Failure Handler (Task 55)
| Status | FAILED |
|--------|--------|
| Action | Mark failed |
| Emit | payment_failed signal |

### Pending Handler (Task 56)
| Status | PENDING |
|--------|---------|
| Action | Keep pending |
| Note | Wait for final status |

### Order Update (Task 57)
| On Success | Update |
|------------|--------|
| order.status | PAID |
| order.paid_at | now |
| Emit | order_paid signal |

### Transaction Record (Task 58)
| Save | Fields |
|------|--------|
| order | ForeignKey |
| gateway_reference | payment_id |
| amount | Amount paid |
| status | Mapped status |
| gateway_response | Full webhook data |

### Webhook Logging (Task 59)
| Log | Content |
|-----|---------|
| Received | Timestamp |
| Signature | Valid/invalid |
| Status | Processed/rejected |
| Payload | Sanitized data |
