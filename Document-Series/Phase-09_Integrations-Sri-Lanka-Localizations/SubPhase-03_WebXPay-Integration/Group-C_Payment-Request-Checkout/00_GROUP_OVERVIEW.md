# Group C: Payment Request & Checkout

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 03 - WebXPay Integration  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Implement payment initiation with multiple payment methods and error handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_WebXPay-Processor-Implementation](../Group-B_WebXPay-Processor-Implementation/)
- **→ Next Group:** [Group-D_Webhook-Callback](../Group-D_Webhook-Callback/)

---

## Group Overview

This group implements payment request and checkout. Creates initiate_payment method as the main entry point. Creates payment request API call to WebXPay with request payload. Creates checkout URL for redirect. Creates QR payment option with QR code generator for alternative payment. Creates bank transfer option for direct bank payments. Creates payment token for storing pending payment state and expiry handling. Creates duplicate prevention to avoid double payments. Creates payment logging for all attempts. Creates timeout handling and retry logic. Creates success and error response handlers. Verifies payment request flow.

### Key Outcomes

- initiate_payment method
- Payment request API
- Request payload
- Checkout URL
- QR payment option
- QR code generator
- Bank transfer option
- Payment token
- Expiry handling
- Duplicate prevention
- Payment logging
- Timeout handling
- Retry logic
- Success response
- Error response
- Payment request verified

### Technology Context

- **API:** REST POST
- **QR:** QR code for mobile
- **Bank:** Direct transfer
- **Timeout:** 30 seconds

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-38_Initiate-QR-Token.md` | Create initiate, QR, and token | 31-38 |
| 02 | `02_Tasks-39-46_Prevention-Response-Verify.md` | Create prevention and response handling | 39-46 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create initiate_payment Method | High | Task 30 |
| 32 | Create Payment Request API | Medium | Task 31 |
| 33 | Create Request Payload | Medium | Task 32 |
| 34 | Create Checkout URL | Low | Task 32 |
| 35 | Create QR Payment Option | Medium | Task 31 |
| 36 | Create QR Code Generator | Medium | Task 35 |
| 37 | Create Bank Transfer Option | Medium | Task 31 |
| 38 | Create Payment Token | Medium | Task 31 |
| 39 | Create Expiry Handling | Low | Task 38 |
| 40 | Create Duplicate Prevention | Medium | Task 38 |
| 41 | Create Payment Logging | Low | Task 31 |
| 42 | Create Timeout Handling | Medium | Task 31 |
| 43 | Create Retry Logic | Medium | Task 42 |
| 44 | Create Success Response | Low | Task 31 |
| 45 | Create Error Response | Low | Task 31 |
| 46 | Verify Payment Request | Low | Task 45 |

---

## Execution Order

```
Task 31: initiate_payment Method
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-32     T-35     T-37     T-38     T-41     T-42     T-44     T-45
(API)   (QR)   (Bank)  (Token)  (Log)  (Time) (Succ)  (Error)
    │        │        │        │        │        │        │        │
    ├────┐   ▼        │   ┌────┴────┐   │        ▼        │        │
    ▼    │ T-36      │   ▼         ▼   │      T-43      │        │
T-33   │(QR Gen)    │ T-39      T-40  │    (Retry)     │        │
(Pay)  │   │        │(Expiry) (Dupe)  │        │        │        │
    │    │   │        │   │         │   │        │        │        │
    ▼    │   │        │   │         │   │        │        │        │
T-34   │   │        │   │         │   │        │        │        │
(URL)  │   │        │   │         │   │        │        │        │
    │    │   │        │   │         │   │        │        │        │
    └────┴───┴────────┴───┴─────────┴───┴────────┴────────┴────────┘
                              │
                              ▼
                        Task 46: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── webxpay/
                └── processor.py (initiate_payment)
        └── models/
            └── payment_token.py
        └── utils/
            └── qr_generator.py
```

---

## Notes for AI Agents

### initiate_payment Method (Task 31)
| Input | PaymentIntent |
|-------|---------------|
| Output | PaymentResult |
| Methods | Card, QR, Bank |

### Payment Request API (Task 32)
| Endpoint | /api/v1/payment |
|----------|-----------------|
| Method | POST |
| Auth | API key + signature |

### Request Payload (Task 33)
| Field | Value |
|-------|-------|
| merchant_id | Config |
| amount | Order total |
| currency | LKR |
| reference | Generated |
| callback_url | Config |
| customer | Customer data |

### Checkout URL (Task 34)
| Response | Value |
|----------|-------|
| checkout_url | WebXPay redirect |
| Method | GET redirect |

### QR Payment Option (Task 35)
| Feature | Value |
|---------|-------|
| Type | QR code payment |
| Use | Mobile payment apps |

### QR Code Generator (Task 36)
| Library | qrcode |
|---------|--------|
| Data | Payment reference |
| Format | PNG/SVG |
| Size | 256x256 |

### Bank Transfer Option (Task 37)
| Feature | Value |
|---------|-------|
| Type | Direct bank transfer |
| Use | Manual bank payment |
| Verification | Async webhook |

### Payment Token (Task 38)
| Model | Fields |
|-------|--------|
| order | ForeignKey |
| token | UUID |
| payment_method | QR/Card/Bank |
| created_at | DateTimeField |
| expires_at | DateTimeField |

### Expiry Handling (Task 39)
| Expiry | Value |
|--------|-------|
| Card | 30 minutes |
| QR | 15 minutes |
| Bank | 24 hours |

### Duplicate Prevention (Task 40)
| Check | Method |
|-------|--------|
| Token | One active per order |
| Status | Check order status |
| Reject | If already paid |

### Payment Logging (Task 41)
| Log | Content |
|-----|---------|
| Start | Order ID, method, amount |
| Request | API request (sanitized) |
| Response | API response |
| Result | Success/failure |

### Timeout Handling (Task 42)
| Timeout | 30 seconds |
|---------|------------|
| Action | Raise PaymentTimeoutError |
| Retry | Eligible |

### Retry Logic (Task 43)
| Attempts | 3 |
|----------|---|
| Delay | Exponential (1s, 2s, 4s) |
| Errors | Network, timeout |

### Success Response (Task 44)
| Response | Content |
|----------|---------|
| success | True |
| checkout_url | Redirect URL |
| qr_code | If QR method |

### Error Response (Task 45)
| Response | Content |
|----------|---------|
| success | False |
| error_message | Error details |
| error_code | Error code |
