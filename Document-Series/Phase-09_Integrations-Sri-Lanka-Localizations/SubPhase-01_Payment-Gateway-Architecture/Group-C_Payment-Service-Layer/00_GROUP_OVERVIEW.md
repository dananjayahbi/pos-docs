# Group C: Payment Service Layer

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Create PaymentService with payment lifecycle, events, and analytics

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Payment-Processor-Interface](../Group-B_Payment-Processor-Interface/)
- **→ Next Group:** [Group-D_Webhook-Infrastructure](../Group-D_Webhook-Infrastructure/)

---

## Group Overview

This group creates the PaymentService layer. Creates PaymentService class as the main entry point for payments. Creates get_active_methods to list active payment methods for tenant. Creates initiate_payment method to start payment process with logging. Creates verify_payment method that updates order status on success. Creates process_refund method with partial refund support. Creates get_transaction_status and transaction history methods. Creates amount validation and LKR currency handling. Creates retry logic and timeout handling for gateway failures. Creates payment events with Django signals and event handlers. Creates payment analytics for metrics tracking. Verifies PaymentService methods.

### Key Outcomes

- PaymentService class
- get_active_methods method
- initiate_payment method
- Payment logging
- verify_payment method
- Update order status
- process_refund method
- Partial refund logic
- get_transaction_status method
- Transaction history
- Amount validation
- Currency handling (LKR)
- Retry logic
- Timeout handling
- Payment events
- Event handlers
- Payment analytics
- PaymentService verified

### Technology Context

- **Pattern:** Service layer
- **Events:** Django signals
- **Retry:** Exponential backoff
- **Currency:** LKR formatting

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Service-Methods.md` | Create service and methods | 35-44 |
| 02 | `02_Tasks-45-52_Validation-Events-Verify.md` | Create validation, events, and verification | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create PaymentService Class | Medium | Task 34 |
| 36 | Create get_active_methods | Low | Task 35 |
| 37 | Create initiate_payment Method | High | Task 35 |
| 38 | Create Payment Logging | Medium | Task 37 |
| 39 | Create verify_payment Method | High | Task 35 |
| 40 | Create Update Order Status | Medium | Task 39 |
| 41 | Create process_refund Method | High | Task 35 |
| 42 | Create Partial Refund Logic | Medium | Task 41 |
| 43 | Create get_transaction_status | Low | Task 35 |
| 44 | Create Transaction History | Low | Task 35 |
| 45 | Create Amount Validation | Medium | Task 35 |
| 46 | Create Currency Handling | Low | Task 45 |
| 47 | Create Retry Logic | High | Task 35 |
| 48 | Create Timeout Handling | Medium | Task 47 |
| 49 | Create Payment Events | Medium | Task 35 |
| 50 | Create Event Handlers | Medium | Task 49 |
| 51 | Create Payment Analytics | Medium | Task 35 |
| 52 | Verify Payment Service | Low | Task 51 |

---

## Execution Order

```
Task 35: PaymentService Class
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-36     T-37     T-39     T-41     T-43     T-44     T-45     T-47  T-49  T-51
(List)  (Init)  (Verify)(Refund)(Status)(History)(Valid)(Retry)(Event)(Anal)
    │        │        │        │        │        │        │        │    │    │
    │        ▼        ▼        ▼        │        │        ▼        ▼    ▼    │
    │     T-38     T-40     T-42       │        │     T-46     T-48  T-50   │
    │    (Log)   (Order) (Partial)    │        │   (Currency)(Time)(Handle)│
    │        │        │        │        │        │        │        │    │    │
    └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────┴────┘
                                        │
                                        ▼
                                  Task 52: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── services/
        │   ├── __init__.py
        │   └── payment_service.py
        ├── signals.py
        └── utils/
            ├── __init__.py
            ├── currency.py
            └── validators.py
```

---

## Notes for AI Agents

### PaymentService Class (Task 35)
| Method | Description |
|--------|-------------|
| __init__ | Accept tenant context |
| Pattern | Single entry point |
| Inject | ProcessorFactory |

### get_active_methods (Task 36)
| Return | List[PaymentMethod] |
|--------|---------------------|
| Filter | is_active=True |
| Order | display_order |
| Tenant | Current tenant only |

### initiate_payment Method (Task 37)
| Steps | Description |
|-------|-------------|
| 1 | Validate order and amount |
| 2 | Get processor for gateway |
| 3 | Create transaction record |
| 4 | Call processor.initiate_payment |
| 5 | Return result with redirect URL |

### Payment Logging (Task 38)
| Log | Content |
|-----|---------|
| Start | Order ID, amount, gateway |
| Success | Transaction ID |
| Failure | Error message |
| Level | INFO, WARNING, ERROR |

### verify_payment Method (Task 39)
| Steps | Description |
|-------|-------------|
| 1 | Get transaction by reference |
| 2 | Call processor.verify_payment |
| 3 | Update transaction status |
| 4 | Emit payment_verified event |

### Update Order Status (Task 40)
| On Success | Action |
|------------|--------|
| Order | status = PAID |
| Payment | paid_at = now |
| Event | order_paid signal |

### process_refund Method (Task 41)
| Steps | Description |
|-------|-------------|
| 1 | Validate refund amount |
| 2 | Call processor.process_refund |
| 3 | Create refund record |
| 4 | Update transaction if full |

### Partial Refund Logic (Task 42)
| Check | Condition |
|-------|-----------|
| Max | refund <= (amount - refunded) |
| Status | PARTIALLY_REFUNDED if partial |
| Status | REFUNDED if full |

### Amount Validation (Task 45)
| Rule | Value |
|------|-------|
| Min | ₨100 |
| Max | ₨1,000,000 |
| Decimal | 2 places |
| Positive | > 0 |

### Currency Handling (Task 46)
| Format | LKR |
|--------|-----|
| Symbol | ₨ |
| Decimal | 2 places |
| Display | ₨1,234.56 |
| API | Amount in cents |

### Retry Logic (Task 47)
| Strategy | Exponential backoff |
|----------|---------------------|
| Attempts | 3 max |
| Delay | 1s, 2s, 4s |
| Exception | Only timeout/network |

### Timeout Handling (Task 48)
| Gateway | Timeout |
|---------|---------|
| Default | 30 seconds |
| Action | Raise PaymentTimeoutError |
| Retry | Eligible for retry |

### Payment Events (Task 49)
| Signal | When |
|--------|------|
| payment_initiated | On initiate |
| payment_verified | On verify |
| payment_failed | On failure |
| refund_processed | On refund |

### Payment Analytics (Task 51)
| Metric | Track |
|--------|-------|
| Success rate | Per gateway |
| Avg amount | Per gateway |
| Failure reasons | Categorized |
| Processing time | Latency |
