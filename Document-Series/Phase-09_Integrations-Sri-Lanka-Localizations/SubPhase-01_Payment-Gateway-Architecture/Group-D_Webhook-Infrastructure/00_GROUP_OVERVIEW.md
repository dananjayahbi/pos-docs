# Group D: Webhook Infrastructure

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create webhook routing, signature validation, parsing, and async processing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Payment-Service-Layer](../Group-C_Payment-Service-Layer/)
- **→ Next Group:** [Group-E_Transaction-Refund-APIs](../Group-E_Transaction-Refund-APIs/)

---

## Group Overview

This group creates the webhook infrastructure. Creates webhook router view to route webhooks by gateway type. Creates webhook URL patterns for each gateway. Creates webhook authentication with signature validation. Creates per-gateway signature validators for PayHere (MD5) and WebXPay. Creates webhook parser to parse gateway-specific payloads. Creates PayHere and WebXPay parsers. Creates webhook processor for async processing with Celery task. Creates idempotency check to prevent duplicate processing. Creates webhook retry logic for failed webhooks. Creates comprehensive webhook logging. Creates error handling for malformed webhooks. Verifies webhook infrastructure.

### Key Outcomes

- Webhook router view
- Webhook URL patterns
- Webhook authentication
- Signature validators
- PayHere signature validator
- WebXPay signature validator
- Webhook parser
- PayHere parser
- WebXPay parser
- Webhook processor
- Celery webhook task
- Idempotency check
- Webhook retry logic
- Webhook logging
- Webhook error handling
- Webhook infrastructure verified

### Technology Context

- **Async:** Celery for processing
- **Security:** HMAC/MD5 signatures
- **Idempotency:** Webhook ID tracking
- **Logging:** Full payload logging

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-60_Router-Validators-Parsers.md` | Create router, validators, and parsers | 53-60 |
| 02 | `02_Tasks-61-68_Processor-Retry-Verify.md` | Create processor and verification | 61-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Webhook Router View | Medium | Task 52 |
| 54 | Create Webhook URL Patterns | Low | Task 53 |
| 55 | Create Webhook Authentication | High | Task 53 |
| 56 | Create Signature Validators | Medium | Task 55 |
| 57 | Create PayHere Signature | Medium | Task 56 |
| 58 | Create WebXPay Signature | Medium | Task 56 |
| 59 | Create Webhook Parser | Medium | Task 53 |
| 60 | Create PayHere Parser | Medium | Task 59 |
| 61 | Create WebXPay Parser | Medium | Task 59 |
| 62 | Create Webhook Processor | High | Task 59 |
| 63 | Create Celery Webhook Task | Medium | Task 62 |
| 64 | Create Idempotency Check | Medium | Task 62 |
| 65 | Create Webhook Retry Logic | Medium | Task 62 |
| 66 | Create Webhook Logging | Low | Task 53 |
| 67 | Create Webhook Error Handling | Medium | Task 62 |
| 68 | Verify Webhook Infrastructure | Low | Task 67 |

---

## Execution Order

```
Task 53: Webhook Router View
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-54     T-55     T-59     T-66
(URLs) (Auth)  (Parser) (Log)
    │        │        │        │
    │        ▼        │        │
    │     T-56       │        │
    │   (Validators) │        │
    │        │        │        │
    │   ┌────┴────┐   │        │
    │   ▼         ▼   │        │
    │ T-57     T-58   │        │
    │(PayHere)(WebX)  │        │
    │   │         │   │        │
    │   └────┬────┘   │        │
    │        │        │        │
    │        └────────┤        │
    │                 │        │
    │            ┌────┴────┐   │
    │            ▼         ▼   │
    │         T-60      T-61   │
    │       (PHParse)(WXParse) │
    │            │         │   │
    │            └────┬────┘   │
    │                 │        │
    └─────────────────┘        │
              │                │
              ▼                │
        Task 62: Processor     │
              │                │
    ┌────┬────┼────┬────┐      │
    ▼    ▼    ▼    ▼    ▼      │
T-63  T-64  T-65  T-67         │
(Celery)(Idem)(Retry)(Error)   │
    │    │    │    │           │
    └────┴────┴────┴───────────┘
              │
              ▼
        Task 68: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── webhooks/
        │   ├── __init__.py
        │   ├── router.py
        │   ├── validators.py
        │   └── parsers.py
        ├── tasks.py
        └── api/
            └── webhook_urls.py
```

---

## Notes for AI Agents

### Webhook Router View (Task 53)
| Endpoint | /api/webhooks/{gateway}/ |
|----------|--------------------------|
| Method | POST |
| CSRF | Exempt |
| Action | Route to processor |

### Webhook URL Patterns (Task 54)
| Gateway | URL |
|---------|-----|
| PayHere | /api/webhooks/payhere/ |
| WebXPay | /api/webhooks/webxpay/ |
| KOKO | /api/webhooks/koko/ |

### Webhook Authentication (Task 55)
| Check | Order |
|-------|-------|
| 1 | Validate IP (if available) |
| 2 | Validate signature |
| 3 | Reject if invalid |

### PayHere Signature (Task 57)
| Algorithm | MD5 |
|-----------|-----|
| Fields | merchant_id + order_id + amount + ... |
| Compare | With md5sig field |
| Secret | Merchant secret |

### WebXPay Signature (Task 58)
| Algorithm | HMAC-SHA256 |
|-----------|-------------|
| Payload | Full body |
| Header | X-Signature |
| Secret | API secret |

### Webhook Parser (Task 59)
| Function | Parse |
|----------|-------|
| Input | Raw request body |
| Output | Normalized WebhookEvent |
| Handle | Gateway-specific format |

### PayHere Parser (Task 60)
| Field | Map |
|-------|-----|
| order_id | order_id |
| payment_id | transaction_id |
| status_code | status |
| md5sig | signature |

### WebXPay Parser (Task 61)
| Field | Map |
|-------|-----|
| reference | transaction_id |
| orderId | order_id |
| status | status |

### Webhook Processor (Task 62)
| Steps | Description |
|-------|-------------|
| 1 | Parse webhook |
| 2 | Check idempotency |
| 3 | Update transaction |
| 4 | Emit events |

### Celery Webhook Task (Task 63)
| Task | process_webhook |
|------|-----------------|
| Queue | webhooks |
| Retry | 3 times |
| Async | Background processing |

### Idempotency Check (Task 64)
| Key | webhook_id or hash |
|-----|---------------------|
| Store | WebhookLog processed |
| Check | Before processing |
| Skip | If already processed |

### Webhook Retry Logic (Task 65)
| On Fail | Retry |
|---------|-------|
| Attempts | 3 |
| Delay | Exponential |
| Dead letter | After max retries |

### Webhook Logging (Task 66)
| Log | Content |
|-----|---------|
| Received | Gateway, timestamp |
| Payload | Full JSON (sanitized) |
| Result | Success/failure |
| Duration | Processing time |

### Webhook Error Handling (Task 67)
| Error | Response |
|-------|----------|
| Invalid signature | 401 + log |
| Parse error | 400 + log |
| Processing error | 500 + retry |
