# Group B: WebXPay Processor Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Implement WebXPayProcessor class with HMAC signature, data builders, and API handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_WebXPay-Configuration](../Group-A_WebXPay-Configuration/)
- **→ Next Group:** [Group-C_Payment-Request-Checkout](../Group-C_Payment-Request-Checkout/)

---

## Group Overview

This group implements the WebXPayProcessor class. Creates WebXPayProcessor extending PaymentProcessor ABC and registers with factory. Creates HMAC-SHA256 signature generator with proper parameter order. Creates amount formatter and LKR currency handler. Creates reference generator for unique payment references. Creates description builder for payment descriptions. Creates customer data builder with phone formatter for +94 format and address formatter. Creates metadata builder and request builder for API calls. Creates response parser and error handler. Verifies processor implementation.

### Key Outcomes

- WebXPayProcessor class
- Processor registration
- HMAC signature generator
- Signature parameters
- Amount formatter
- Currency handler
- Reference generator
- Description builder
- Customer data builder
- Phone formatter (+94)
- Address formatter
- Metadata builder
- Request builder
- Response parser
- Error handler
- Processor implementation verified

### Technology Context

- **Signature:** HMAC-SHA256
- **API:** REST-based
- **Phone:** +94 format
- **Currency:** LKR only

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-22_Processor-Signature-Builders.md` | Create processor, signature, and builders | 15-22 |
| 02 | `02_Tasks-23-30_Customer-Request-Verify.md` | Create customer, request, and verification | 23-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create WebXPayProcessor Class | High | Task 14 |
| 16 | Create Processor Registration | Low | Task 15 |
| 17 | Create HMAC Signature | Medium | Task 15 |
| 18 | Create Signature Parameters | Low | Task 17 |
| 19 | Create Amount Formatter | Low | Task 15 |
| 20 | Create Currency Handler | Low | Task 19 |
| 21 | Create Reference Generator | Low | Task 15 |
| 22 | Create Description Builder | Low | Task 15 |
| 23 | Create Customer Data | Medium | Task 15 |
| 24 | Create Phone Formatter | Low | Task 23 |
| 25 | Create Address Formatter | Low | Task 23 |
| 26 | Create Metadata Builder | Low | Task 15 |
| 27 | Create Request Builder | Medium | Task 26 |
| 28 | Create Response Parser | Medium | Task 27 |
| 29 | Create Error Handler | Medium | Task 28 |
| 30 | Verify Processor | Low | Task 29 |

---

## Execution Order

```
Task 15: WebXPayProcessor Class
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-16     T-17     T-19     T-21     T-22     T-23     T-26
(Reg)   (HMAC)   (Amt)   (Ref)   (Desc)(Customer)(Meta)
    │        │        │        │        │        │        │
    │   ┌────┘        ▼        │        │   ┌────┴────┐   │
    │   ▼           T-20      │        │   ▼         ▼   │
    │ T-18       (Currency)   │        │ T-24      T-25  │
    │(Params)       │        │        │(Phone)  (Addr)  │
    │   │           │        │        │   │         │   │
    │   │           │        │        │   └────┬────┘   │
    │   │           │        │        │        │        │
    └───┴───────────┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                        Task 27: Request Builder
                              │
                              ▼
                        Task 28: Response Parser
                              │
                              ▼
                        Task 29: Error Handler
                              │
                              ▼
                        Task 30: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── webxpay/
                ├── __init__.py
                ├── processor.py
                ├── signature.py
                └── builders.py
```

---

## Notes for AI Agents

### WebXPayProcessor Class (Task 15)
| Attribute | Value |
|-----------|-------|
| gateway_type | PaymentGateway.WEBXPAY |
| Extends | PaymentProcessor |
| Methods | All abstract methods |

### Processor Registration (Task 16)
| Register | Method |
|----------|--------|
| Factory | ProcessorFactory.register |
| Key | PaymentGateway.WEBXPAY |
| Class | WebXPayProcessor |

### HMAC Signature (Task 17)
| Algorithm | HMAC-SHA256 |
|-----------|-------------|
| Library | hmac |
| Key | secret_key |

### Signature Parameters (Task 18)
| Order | Fields |
|-------|--------|
| Defined | By WebXPay documentation |
| Include | merchant_id, reference, amount |

### Amount Formatter (Task 19)
| Format | Value |
|--------|-------|
| Decimals | 2 places |
| Example | 1234.56 |
| Type | String |

### Currency Handler (Task 20)
| Currency | Allowed |
|----------|---------|
| LKR | Yes (only) |
| USD | No |
| Others | No |

### Reference Generator (Task 21)
| Format | Value |
|--------|-------|
| Pattern | WXP-{tenant}-{uuid} |
| Unique | Always unique |

### Description Builder (Task 22)
| Content | Value |
|---------|-------|
| Pattern | "Order #{order_id}" |
| Max | 255 chars |

### Customer Data (Task 23)
| Field | Source |
|-------|--------|
| name | Customer full name |
| email | Customer.email |
| phone | Customer.phone |

### Phone Formatter (Task 24)
| Input | Output |
|-------|--------|
| 0771234567 | 94771234567 |
| +94771234567 | 94771234567 |
| Strip | + and leading 0 |

### Address Formatter (Task 25)
| Field | WebXPay Field |
|-------|---------------|
| Line 1 | address |
| City | city |
| Country | LK |

### Metadata Builder (Task 26)
| Field | Use |
|-------|-----|
| order_id | Internal order ID |
| tenant_id | Tenant ID |

### Request Builder (Task 27)
| Content | API request |
|---------|-------------|
| Method | POST |
| Headers | Authorization, Content-Type |
| Body | JSON payload |

### Response Parser (Task 28)
| Parse | Fields |
|-------|--------|
| status | Success/failure |
| reference | Payment reference |
| checkout_url | Redirect URL |

### Error Handler (Task 29)
| Error | Action |
|-------|--------|
| Network | Retry |
| API error | Log + return |
| Validation | Return error |
