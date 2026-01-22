# Group D: Webhook & Notification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement PayHere webhook endpoint with signature verification and status handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Payment-Initialization](../Group-C_Payment-Initialization/)
- **→ Next Group:** [Group-E_Verification-Refunds](../Group-E_Verification-Refunds/)

---

## Group Overview

This group implements PayHere webhook handling. Creates PayHere webhook view and URL configuration. Creates CSRF exemption for webhook endpoint and IP whitelist for PayHere servers. Creates signature verification with MD5 hash and signature components builder. Creates secure hash comparison. Creates webhook parser for POST parameters and status code mapping. Creates handlers for success (status_code=2), pending (status_code=0), failed (status_code=-1,-2,-3), and chargeback (status_code=-4). Creates order update logic and transaction record saving. Verifies webhook processing.

### Key Outcomes

- PayHere webhook view
- Webhook URL config
- Webhook CSRF exempt
- Webhook IP whitelist
- Signature verification
- Signature components
- Hash comparison
- Webhook parser
- Status code mapping
- Success handler (2)
- Pending handler (0)
- Failed handler (-1,-2,-3)
- Chargeback handler (-4)
- Order update
- Transaction record
- Webhook processing verified

### Technology Context

- **Signature:** MD5 hash
- **CSRF:** Exempt
- **Status:** PayHere status codes
- **Async:** Optional Celery

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_View-Signature-Parser.md` | Create view, signature, and parser | 51-58 |
| 02 | `02_Tasks-59-66_Handlers-Update-Verify.md` | Create handlers and verification | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create PayHere Webhook View | Medium | Task 50 |
| 52 | Create Webhook URL Config | Low | Task 51 |
| 53 | Create Webhook CSRF Exempt | Low | Task 51 |
| 54 | Create Webhook IP Whitelist | Medium | Task 51 |
| 55 | Create Signature Verification | High | Task 51 |
| 56 | Create Signature Components | Medium | Task 55 |
| 57 | Create Hash Comparison | Low | Task 55 |
| 58 | Create Webhook Parser | Medium | Task 51 |
| 59 | Create Status Code Mapping | Low | Task 58 |
| 60 | Create Success Handler | Medium | Task 59 |
| 61 | Create Pending Handler | Low | Task 59 |
| 62 | Create Failed Handler | Low | Task 59 |
| 63 | Create Chargeback Handler | Medium | Task 59 |
| 64 | Create Order Update | Medium | Task 60 |
| 65 | Create Transaction Record | Medium | Task 64 |
| 66 | Verify Webhook Processing | Low | Task 65 |

---

## Execution Order

```
Task 51: PayHere Webhook View
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-52     T-53     T-54     T-55     T-58
(URL)  (CSRF)   (IP)   (Sig)  (Parser)
    │        │        │        │        │
    │        │        │   ┌────┴────┐   │
    │        │        │   ▼         ▼   │
    │        │        │ T-56      T-57  │
    │        │        │(Comp)   (Compare)|
    │        │        │   │         │   │
    │        │        │   └────┬────┘   │
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                        │
                        ▼
                  Task 59: Status Mapping
                        │
              ┌────┬────┼────┬────────┐
              ▼    ▼    ▼    ▼        ▼
           T-60  T-61  T-62  T-63
         (Succ)(Pend)(Fail)(Charge)
              │    │    │    │
              │    │    │    │
              └────┴────┴────┘
                   │
                   ▼
             Task 64: Order Update
                   │
                   ▼
             Task 65: Transaction Record
                   │
                   ▼
             Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── webhooks/
            └── payhere.py
        └── processors/
            └── payhere/
                └── validators.py
```

---

## Notes for AI Agents

### PayHere Webhook View (Task 51)
| Endpoint | /api/webhooks/payhere/ |
|----------|------------------------|
| Method | POST |
| Response | 200 OK always |

### Webhook URL Config (Task 52)
| URL | Path |
|-----|------|
| Pattern | webhooks/payhere/ |
| Name | payhere-webhook |

### Webhook CSRF Exempt (Task 53)
| Decorator | @csrf_exempt |
|-----------|--------------|
| Reason | External POST |

### Webhook IP Whitelist (Task 54)
| IPs | PayHere server IPs |
|-----|---------------------|
| Check | Optional but recommended |
| Fail | Return 403 |

### Signature Verification (Task 55)
| Algorithm | MD5 |
|-----------|-----|
| Field | md5sig |
| Match | Required |

### Signature Components (Task 56)
| Order | Fields |
|-------|--------|
| 1 | merchant_id |
| 2 | order_id |
| 3 | payhere_amount |
| 4 | payhere_currency |
| 5 | status_code |
| 6 | md5(merchant_secret).upper() |

### Hash Comparison (Task 57)
| Method | hmac.compare_digest |
|--------|---------------------|
| Security | Timing-safe compare |

### Webhook Parser (Task 58)
| Parse | POST data |
|-------|-----------|
| Fields | All PayHere fields |
| Sanitize | Strip, validate |

### Status Code Mapping (Task 59)
| Code | Status |
|------|--------|
| 2 | PaymentStatus.SUCCESS |
| 0 | PaymentStatus.PENDING |
| -1 | PaymentStatus.CANCELLED |
| -2 | PaymentStatus.FAILED |
| -3 | PaymentStatus.FAILED |
| -4 | PaymentStatus.CHARGEDBACK |

### Success Handler (Task 60)
| status_code | 2 |
|-------------|---|
| Action | Mark order paid |
| Emit | payment_success signal |

### Pending Handler (Task 61)
| status_code | 0 |
|-------------|---|
| Action | Keep pending |
| Note | Wait for final status |

### Failed Handler (Task 62)
| status_code | -1, -2, -3 |
|-------------|------------|
| Action | Mark failed |
| Emit | payment_failed signal |

### Chargeback Handler (Task 63)
| status_code | -4 |
|-------------|-----|
| Action | Mark chargedback |
| Alert | Notify admin |
| Note | Serious issue |

### Order Update (Task 64)
| On Success | Update |
|------------|--------|
| order.status | PAID |
| order.paid_at | now |
| Emit | order_paid signal |

### Transaction Record (Task 65)
| Save | Fields |
|------|--------|
| order | ForeignKey |
| gateway_reference | payment_id |
| amount | payhere_amount |
| status | Mapped status |
| gateway_response | Full webhook data |
