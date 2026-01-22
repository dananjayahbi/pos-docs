# Group B: Payment Processor Interface

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Create abstract payment processor interface with factory pattern and exception hierarchy

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Payment-Models-Core](../Group-A_Payment-Models-Core/)
- **→ Next Group:** [Group-C_Payment-Service-Layer](../Group-C_Payment-Service-Layer/)

---

## Group Overview

This group creates the abstract payment processor interface. Creates dataclasses for PaymentResult, PaymentIntent, and RefundResult. Creates PaymentProcessor abstract base class with methods for initiate_payment, verify_payment, process_refund, get_status, and supports_recurring. Creates PaymentProcessorFactory with processor registry and get_processor method. Creates ProcessorConfig type for processor configuration. Creates PaymentException base class and specific exceptions for gateway errors, validation errors, and timeout errors. Verifies the processor interface contract.

### Key Outcomes

- PaymentResult dataclass
- PaymentIntent dataclass
- RefundResult dataclass
- PaymentProcessor ABC
- initiate_payment method
- verify_payment method
- process_refund method
- get_status method
- supports_recurring method
- PaymentProcessorFactory
- Processor registry
- get_processor method
- ProcessorConfig type
- PaymentException base
- Specific exceptions
- Processor interface verified

### Technology Context

- **Pattern:** Strategy + Factory
- **ABC:** Abstract Base Class
- **Typing:** dataclasses, TypedDict
- **Exceptions:** Custom hierarchy

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-27_Dataclasses-ABC.md` | Create dataclasses and ABC | 19-27 |
| 02 | `02_Tasks-28-34_Factory-Exceptions-Verify.md` | Create factory and exceptions | 28-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create PaymentResult Dataclass | Medium | Task 18 |
| 20 | Create PaymentIntent Dataclass | Medium | Task 19 |
| 21 | Create RefundResult Dataclass | Medium | Task 19 |
| 22 | Create PaymentProcessor ABC | High | Task 21 |
| 23 | Create initiate_payment Method | Medium | Task 22 |
| 24 | Create verify_payment Method | Medium | Task 22 |
| 25 | Create process_refund Method | Medium | Task 22 |
| 26 | Create get_status Method | Low | Task 22 |
| 27 | Create supports_recurring Method | Low | Task 22 |
| 28 | Create PaymentProcessorFactory | Medium | Task 27 |
| 29 | Create Processor Registry | Medium | Task 28 |
| 30 | Create get_processor Method | Medium | Task 29 |
| 31 | Create ProcessorConfig Type | Low | Task 28 |
| 32 | Create PaymentException Base | Medium | Task 22 |
| 33 | Create Specific Exceptions | Medium | Task 32 |
| 34 | Verify Processor Interface | Low | Task 33 |

---

## Execution Order

```
Task 19: PaymentResult Dataclass
    │
    ├────────┐
    ▼        ▼
T-20     T-21
(Intent)(Refund)
    │        │
    └────┬───┘
         │
         ▼
   Task 22: PaymentProcessor ABC
         │
    ┌────┼────┬────────┬────────┬────────┐
    ▼    ▼    ▼        ▼        ▼        ▼
T-23  T-24  T-25    T-26    T-27     T-32
(Init)(Ver)(Refund)(Status)(Recur) (Exception)
    │    │    │        │        │        │
    │    │    │        │        │        ▼
    │    │    │        │        │     T-33
    │    │    │        │        │  (Specific)
    │    │    │        │        │        │
    └────┴────┴────────┴────────┘        │
                   │                     │
                   ▼                     │
             Task 28: Factory            │
                   │                     │
              ┌────┼────┐                │
              ▼    ▼    ▼                │
           T-29  T-30  T-31             │
         (Reg) (Get) (Config)           │
              │    │    │                │
              └────┴────┴────────────────┘
                        │
                        ▼
                  Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            ├── __init__.py
            ├── base.py
            ├── factory.py
            ├── dataclasses.py
            └── exceptions.py
```

---

## Notes for AI Agents

### PaymentResult Dataclass (Task 19)
| Field | Type |
|-------|------|
| success | bool |
| transaction_id | str |
| gateway_reference | str |
| amount | Decimal |
| status | PaymentStatus |
| redirect_url | Optional[str] |
| error_message | Optional[str] |

### PaymentIntent Dataclass (Task 20)
| Field | Type |
|-------|------|
| order_id | str |
| amount | Decimal |
| currency | str = "LKR" |
| customer_email | str |
| customer_phone | str |
| description | str |
| return_url | str |
| cancel_url | str |
| metadata | dict |

### RefundResult Dataclass (Task 21)
| Field | Type |
|-------|------|
| success | bool |
| refund_id | str |
| gateway_reference | str |
| amount | Decimal |
| status | str |
| error_message | Optional[str] |

### PaymentProcessor ABC (Task 22)
| Attribute | Type |
|-----------|------|
| gateway_type | PaymentGateway |
| config | ProcessorConfig |
| Methods | Abstract methods |

### initiate_payment Method (Task 23)
| Signature | Description |
|-----------|-------------|
| Input | PaymentIntent |
| Output | PaymentResult |
| Action | Start payment flow |

### verify_payment Method (Task 24)
| Signature | Description |
|-----------|-------------|
| Input | gateway_reference, order_id |
| Output | PaymentResult |
| Action | Verify payment completed |

### process_refund Method (Task 25)
| Signature | Description |
|-----------|-------------|
| Input | transaction_id, amount, reason |
| Output | RefundResult |
| Action | Process refund request |

### get_status Method (Task 26)
| Signature | Description |
|-----------|-------------|
| Input | gateway_reference |
| Output | PaymentStatus |
| Action | Check current status |

### supports_recurring Method (Task 27)
| Signature | Description |
|-----------|-------------|
| Input | None |
| Output | bool |
| Action | Check recurring support |

### PaymentProcessorFactory (Task 28)
| Pattern | Factory |
|---------|---------|
| Method | get_processor |
| Input | gateway_type, config |
| Output | PaymentProcessor |

### Processor Registry (Task 29)
| Registry | Dict |
|----------|------|
| Key | PaymentGateway enum |
| Value | PaymentProcessor class |
| Register | Via decorator or dict |

### PaymentException Base (Task 32)
| Exception | PaymentException |
|-----------|------------------|
| Inherits | Exception |
| Fields | message, code, gateway |

### Specific Exceptions (Task 33)
| Exception | Use |
|-----------|-----|
| PaymentGatewayError | Gateway communication |
| PaymentValidationError | Invalid input |
| PaymentTimeoutError | Gateway timeout |
| PaymentRefundError | Refund failure |
| PaymentWebhookError | Webhook processing |
