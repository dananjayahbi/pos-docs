# Group C: Payment Initialization

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement payment initiation with form data, tokens, and error handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_PayHere-Processor-Implementation](../Group-B_PayHere-Processor-Implementation/)
- **→ Next Group:** [Group-D_Webhook-Notification](../Group-D_Webhook-Notification/)

---

## Group Overview

This group implements payment initialization. Creates initiate_payment method as the main entry point. Creates payment form data with all required parameters. Creates checkout page URL for PayHere redirect. Creates optional pre-approval API integration. Creates payment token for storing pending payment state and token expiry handling. Creates duplicate prevention to avoid double payments and order lock during payment. Creates payment logging for all initiation attempts. Creates error handling for PayHere errors with retry logic and timeout handling. Creates response parsing for PayHere responses with success and error handlers. Verifies payment initialization flow.

### Key Outcomes

- initiate_payment method
- Payment form data
- Checkout page URL
- Pre-approval API
- Payment token
- Expiry handling
- Duplicate prevention
- Order lock
- Payment logging
- Error handling
- Retry logic
- Timeout handling
- Response parsing
- Success response handler
- Error response handler
- Payment initialization verified

### Technology Context

- **Flow:** Form POST redirect
- **Token:** Pending payment state
- **Lock:** Prevent double payment
- **Timeout:** 30 seconds default

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-42_Initiate-Token-Lock.md` | Create initiate, token, and lock | 35-42 |
| 02 | `02_Tasks-43-50_Error-Response-Verify.md` | Create error handling and verification | 43-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create initiate_payment Method | High | Task 34 |
| 36 | Create Payment Form Data | Medium | Task 35 |
| 37 | Create Checkout Page URL | Low | Task 36 |
| 38 | Create Pre-Approval API | Medium | Task 35 |
| 39 | Create Payment Token | Medium | Task 35 |
| 40 | Create Expiry Handling | Low | Task 39 |
| 41 | Create Duplicate Prevention | Medium | Task 39 |
| 42 | Create Order Lock | Medium | Task 41 |
| 43 | Create Payment Logging | Low | Task 35 |
| 44 | Create Error Handling | Medium | Task 35 |
| 45 | Create Retry Logic | Medium | Task 44 |
| 46 | Create Timeout Handling | Medium | Task 44 |
| 47 | Create Response Parsing | Medium | Task 35 |
| 48 | Create Success Response | Low | Task 47 |
| 49 | Create Error Response | Low | Task 47 |
| 50 | Verify Payment Initialization | Low | Task 49 |

---

## Execution Order

```
Task 35: initiate_payment Method
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-36     T-38     T-39     T-43     T-44     T-47
(Form)  (Pre)  (Token)  (Log)   (Error) (Parse)
    │        │        │        │        │        │
    ▼        │   ┌────┴────┐   │   ┌────┴────┐   ├────────┐
T-37        │   ▼         ▼   │   ▼         ▼   ▼        ▼
(URL)       │ T-40      T-41  │ T-45      T-46  T-48    T-49
    │        │(Expiry)(Dupe)  │(Retry)  (Time)(Success)(Error)
    │        │   │         │   │   │         │   │        │
    │        │   │         ▼   │   │         │   │        │
    │        │   │      T-42  │   │         │   │        │
    │        │   │     (Lock) │   │         │   │        │
    │        │   │         │   │   │         │   │        │
    └────────┴───┴─────────┴───┴───┴─────────┴───┴────────┘
                              │
                              ▼
                        Task 50: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── payhere/
                └── processor.py (initiate_payment)
        └── models/
            └── payment_token.py
        └── services/
            └── payment_lock.py
```

---

## Notes for AI Agents

### initiate_payment Method (Task 35)
| Input | PaymentIntent |
|-------|---------------|
| Output | PaymentResult |
| Steps | Build form, create token, return URL |

### Payment Form Data (Task 36)
| Field | Source |
|-------|--------|
| merchant_id | Config |
| return_url | Config |
| cancel_url | Config |
| notify_url | Config |
| order_id | Generated |
| items | Order items |
| currency | LKR |
| amount | Order total |
| first_name | Customer |
| last_name | Customer |
| email | Customer |
| phone | Customer |
| address | Billing |
| city | Billing |
| country | Sri Lanka |
| hash | Calculated |

### Checkout Page URL (Task 37)
| URL | Value |
|-----|-------|
| Sandbox | https://sandbox.payhere.lk/pay/checkout |
| Production | https://www.payhere.lk/pay/checkout |

### Pre-Approval API (Task 38)
| Feature | Optional |
|---------|----------|
| Use | Pre-authorize payment |
| When | Before redirect |

### Payment Token (Task 39)
| Model | Fields |
|-------|--------|
| order | ForeignKey |
| token | UUID |
| form_data | JSONField |
| created_at | DateTimeField |
| expires_at | DateTimeField |

### Expiry Handling (Task 40)
| Expiry | Value |
|--------|-------|
| Default | 30 minutes |
| Check | Before using token |
| Action | Regenerate if expired |

### Duplicate Prevention (Task 41)
| Check | Method |
|-------|--------|
| Token | One active per order |
| Status | Check order status |
| Reject | If already paid |

### Order Lock (Task 42)
| Lock | Method |
|------|--------|
| Type | Database lock |
| Duration | During payment |
| Release | On complete/cancel |

### Payment Logging (Task 43)
| Log | Content |
|-----|---------|
| Start | Order ID, amount |
| Form | Sanitized form data |
| Result | Success/failure |

### Error Handling (Task 44)
| Error | Action |
|-------|--------|
| Network | Retry |
| Timeout | Retry |
| Validation | Return error |
| Gateway | Log + return |

### Retry Logic (Task 45)
| Attempts | 3 |
|----------|---|
| Delay | Exponential |
| Errors | Network, timeout |

### Timeout Handling (Task 46)
| Timeout | 30 seconds |
|---------|------------|
| Action | Raise PaymentTimeoutError |
| Retry | Eligible |

### Success Response (Task 48)
| Response | Content |
|----------|---------|
| success | True |
| redirect_url | PayHere URL |
| form_data | Form fields |

### Error Response (Task 49)
| Response | Content |
|----------|---------|
| success | False |
| error_message | Error details |
| error_code | Error code |
